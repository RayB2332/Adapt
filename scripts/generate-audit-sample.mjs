#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
// CONTENT AUDIT SAMPLE GENERATOR
//
// Generates a real, fillable review sheet of AI-generated questions —
// using the EXACT SAME prompt-building code the live app sends to
// Claude (imported directly from src/data/prompts.js, not
// reimplemented) — so what you review here is provably what a real
// child would be asked, not an approximation.
//
// This does NOT judge the content itself. Judging correctness,
// curriculum fit, and age-appropriateness needs a real qualified
// educator per country — that's the whole point of CONTENT_AUDIT.md.
// This script only removes the friction of ever actually running that
// review: instead of reading a protocol and improvising how to sample
// content, you run one command and get a ready-to-annotate sheet.
//
// USAGE:
//   export ANTHROPIC_API_KEY=sk-ant-...
//   node scripts/generate-audit-sample.mjs
//
// Optional flags:
//   --countries=UK,US        (default: UK,US,CA)
//   --levels=2,5,9           (default: 2,5,9 — matches CONTENT_AUDIT.md)
//   --per-cell=3             (questions per subject/level/country — default 3;
//                              CONTENT_AUDIT.md's full protocol asks for 10,
//                              set --per-cell=10 to match it exactly, but
//                              that is ~10x the API calls and cost)
//
// Output: audit-sample-<date>.md — one row per generated question, in
// the same six-category taxonomy CONTENT_AUDIT.md defines (A-F), with
// empty checkboxes for a reviewer to mark directly in the file.
// ═══════════════════════════════════════════════════════════════════

import { subjectsFor, getCurriculum } from "../src/data/content.js";
import { sessionSys } from "../src/data/prompts.js";
import fs from "fs";

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v];
  })
);
const COUNTRIES = (args.countries || "UK,US,CA").split(",");
const LEVELS = (args.levels || "2,5,9").split(",").map(Number);
const PER_CELL = Number(args["per-cell"] || 3);

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("\n✗ Set ANTHROPIC_API_KEY first:\n  export ANTHROPIC_API_KEY=sk-ant-...\n");
  process.exit(1);
}

// A representative mock child per country — no accessibility needs,
// since this samples the BASELINE content every child sees; run again
// with the accessibility flags below set to true if you want to audit
// that content path too (it changes the prompt materially).
const MOCK_CHILD = (country) => ({
  name: "Sam",
  tutor: "Sparky",
  age: 8,
  country,
  yearGroup: undefined, // let sessionSys derive it from age, same as the real app
  level: {},
  topicLevels: {},
  accessibility: {},
});

async function askClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  const s = text.indexOf("{"), e = text.lastIndexOf("}");
  if (s < 0 || e < 0) return { question: "(no valid JSON returned)", options: [], correct: "", _raw: text };
  try {
    return JSON.parse(text.slice(s, e + 1));
  } catch {
    return { question: "(malformed JSON)", options: [], correct: "", _raw: text.slice(s, e + 1) };
  }
}

function pickTopic(country, subject, level) {
  const curriculum = getCurriculum(country);
  const topics = curriculum[subject] || [];
  // Pick a topic whose progression actually reaches this level, closest
  // minAge first so the sample resembles what a real child would see.
  const usable = topics.filter(t => (t.levels?.length || 0) >= level);
  return usable[0] || topics[0] || null;
}

async function main() {
  console.log(`Generating audit sample: ${COUNTRIES.join(", ")} × levels ${LEVELS.join(",")} × ${PER_CELL} questions per cell\n`);
  const rows = [];
  let done = 0;
  const total = COUNTRIES.reduce((sum, c) => sum + subjectsFor(c).length, 0) * LEVELS.length * PER_CELL;

  for (const country of COUNTRIES) {
    const subjects = subjectsFor(country);
    for (const subject of subjects) {
      for (const level of LEVELS) {
        const topic = pickTopic(country, subject, level);
        const child = MOCK_CHILD(country);
        child.topicLevels = topic ? { [subject]: { [topic.id]: level } } : {};
        child.level = { [subject]: level };
        const asked = [];
        for (let i = 0; i < PER_CELL; i++) {
          const prompt = sessionSys(child, subject, topic, "traditional", 5, 10, asked);
          try {
            const q = await askClaude(prompt);
            asked.push(q.question);
            rows.push({ country, subject, level, topic: topic?.name || subject, ...q });
          } catch (e) {
            rows.push({ country, subject, level, topic: topic?.name || subject, question: `(ERROR: ${e.message})`, options: [], correct: "" });
          }
          done++;
          process.stdout.write(`\r  ${done}/${total} generated...`);
          // Be polite to the API — small delay between calls
          await new Promise(r => setTimeout(r, 300));
        }
      }
    }
  }
  console.log("\n");

  // Write a clean, fillable markdown sheet grouped by country → subject → level,
  // using CONTENT_AUDIT.md's own error taxonomy for the checkboxes.
  const date = new Date().toISOString().slice(0, 10);
  let md = `# Content Audit Sample — generated ${date}\n\n`;
  md += `Generated with the app's real production prompt (src/data/prompts.js). `;
  md += `${rows.length} questions across ${COUNTRIES.length} countries × ${LEVELS.length} levels.\n\n`;
  md += `**For each question below, tick any category that applies** (see CONTENT_AUDIT.md for full definitions):\n`;
  md += `A = Factually wrong · B = Ambiguous · C = Off-curriculum · D = Age-inappropriate language · E = Format break · F = Bias/sensitivity\n\n`;
  md += `---\n\n`;

  for (const country of COUNTRIES) {
    md += `## ${country}\n\n`;
    for (const subject of subjectsFor(country)) {
      const subjectRows = rows.filter(r => r.country === country && r.subject === subject);
      if (!subjectRows.length) continue;
      md += `### ${subject}\n\n`;
      for (const level of LEVELS) {
        const levelRows = subjectRows.filter(r => r.level === level);
        if (!levelRows.length) continue;
        md += `**Level ${level}/10** (topic: ${levelRows[0].topic})\n\n`;
        levelRows.forEach((r, i) => {
          md += `${i + 1}. **${r.question}**\n`;
          if (r.options?.length) md += `   Options: ${r.options.join(" | ")}\n   Marked correct: ${r.correct}\n`;
          if (r._raw) md += `   ⚠️ Raw response (parsing failed): \`${r._raw.slice(0, 200)}\`\n`;
          md += `   - [ ] A  - [ ] B  - [ ] C  - [ ] D  - [ ] E  - [ ] F  - [ ] Looks good\n`;
          md += `   Notes: ______________________________________________\n\n`;
        });
      }
    }
  }

  const outPath = `audit-sample-${date}.md`;
  fs.writeFileSync(outPath, md);
  console.log(`✓ Written: ${outPath}`);
  console.log(`  Open it, work through each question with a qualified teacher for that country,`);
  console.log(`  and check CONTENT_AUDIT.md's launch-blocking thresholds once you're done.`);
}

main().catch(e => { console.error("Failed:", e.message); process.exit(1); });
