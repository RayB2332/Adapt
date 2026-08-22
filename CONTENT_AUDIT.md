# ADAPT Content Audit Protocol

AI-generated questions must be reviewed by a human educator before public launch.
This document is the process. In-app, children/parents can flag any question (⚑ on
the question card); flags appear in the parent progress screen and are auto-purged
from question banks.

## 1. Who reviews
A qualified teacher (or curriculum specialist) per country: one UK primary teacher,
one US elementary teacher, one Canadian elementary teacher. Budget guide: 4–6 hours
each at standard tutoring rates.

## 2. Sample plan (per country)
For each subject the country teaches, sample generated questions at three levels:

| Subject (country-named) | Level 2 | Level 5 | Level 9 | Total |
|---|---|---|---|---|
| Each subject            | 10      | 10      | 10      | 30    |

UK = 6 subjects → 180 questions. US/CA = 5 subjects → 150 questions each.

**Generate the sample automatically** — this used to mean playing through
every subject's games and lessons by hand with a test child, or manually
constructing prompts. Neither is needed anymore:

```
export ANTHROPIC_API_KEY=sk-ant-...
npm run audit-content
```

This calls `scripts/generate-audit-sample.mjs`, which imports the app's
*real* production prompt-building code directly from
`src/data/prompts.js` (the same file `App.jsx` itself imports — they can
never silently drift apart) and generates real sample questions from the
live API. It writes `audit-sample-<date>.md`: every question grouped by
country → subject → level, with the real topic sampled, the AI's marked
answer, and an empty checkbox row per error category below, ready for a
teacher to work through directly in the file.

Defaults to 3 questions per subject/level/country cell (fast, cheap, good
for a spot-check). To match this document's full 10-per-cell plan exactly:

```
npm run audit-content -- --per-cell=10
```

Other flags: `--countries=UK,US` and `--levels=2,5,9` to narrow a re-run
after a prompt fix, without regenerating everything.

## 3. Error taxonomy (mark each question)
- **A. Factually wrong** — the marked answer is incorrect.
- **B. Ambiguous** — more than one option is defensible.
- **C. Off-curriculum** — content outside the stated year group/country standard.
- **D. Age-inappropriate language** — vocabulary or topic unsuitable for the age.
- **E. Format break** — missing options, duplicate options, truncated text.
- **F. Bias/sensitivity** — stereotypes, cultural insensitivity, or distressing content.

## 4. Pass thresholds (block launch if exceeded)
- Category A or F: **> 1%** of sample → fix prompts before launch.
- Category B or C: **> 5%** → tighten prompts for that subject/level.
- Category E: **> 2%** → strengthen the in-app sanitizer rules.

## 5. Fix loop
1. Reviewer logs failures in a shared sheet: question text, subject, level, category.
2. Adjust the relevant prompt in `src/App.jsx` (game fetchFn or `sessionSys`).
3. Clear affected question banks (they re-seed automatically).
4. Re-sample 10 questions from each failed cell; repeat until under threshold.

## 6. Continuous audit after launch
- Weekly: review all parent-visible flagged questions (⚑ reports).
- Monthly: re-run a 30-question spot check per country on the newest prompts.
- Every flag is auto-purged from banks immediately — no action needed for removal,
  only for root-cause prompt fixes.

## 7. Local (non-AI) content
The procedurally generated maths (tables, arithmetic, algebra, sequences, pairs)
is verified by automated tests for mathematical correctness on every build and does
not require educator review, only a one-time sanity pass on difficulty pacing.
