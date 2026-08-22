// Extracted verbatim from src/App.jsx — this IS the real prompt the
// deployed app sends to Claude. Kept here so both the app and the
// content-audit script (scripts/generate-audit-sample.mjs) use the
// exact same source of truth and can never silently drift apart.
import { TUTORS, YEAR } from './content.js';

export const YEAR_GROUP_CONTENT = {
  UK:{
    "Reception":{Maths:"Count to 20, recognise numerals, add subtract single digits, simple shapes, measure compare",English:"Phonics Phase 2-3, CVC words, simple sentences, listening to stories, rhyme",Science:"Seasons, plants animals local environment, everyday materials, senses"},
    "Year 1":{Maths:"Count to 100, place value to 100, add subtract to 20, 2s 5s 10s times tables, halves quarters, basic measurements, 2D 3D shapes",English:"Phase 3-5 phonics, common exception words, capital letters full stops, nouns verbs adjectives, simple joined sentences",Science:"Seasonal changes, wild and garden plants, fish amphibians reptiles birds mammals, everyday materials properties",History:"Changes within living memory, significant events beyond living memory",Geography:"UK four countries capitals, hot cold areas of world, compass points",Computing:"Simple programs, logical reasoning, use technology safely"},
    "Year 2":{Maths:"Numbers to 100, column addition subtraction, 2 5 10 times tables, halves thirds quarters, standard measurements, 2D 3D shapes",English:"Year 2 exception words, nouns pronouns verbs adjectives adverbs, subordination coordination, apostrophes",Science:"Living things habitats food chains, plants growth, animals nutrition exercise hygiene, materials properties",History:"Great Fire of London, significant explorers, local history",Geography:"UK regions rivers mountains, world continents oceans"},
    "Year 3":{Maths:"4-digit numbers, column add subtract, 3 4 8 times tables, fractions shapes, 12 24 hour time, perimeter, angles, bar charts",English:"Prefixes suffixes, apostrophes, speech punctuation, paragraphs, conjunctions adverbs prepositions",Science:"Plants pollination life cycle. Light reflection shadows. Forces magnets. Rocks fossils soil.",History:"Ancient Egypt. Stone Age to Iron Age.",Geography:"Europe countries capitals rivers. Trade links.",Computing:"Algorithms Scratch programming, online safety"},
    "Year 4":{Maths:"Numbers to 10000, all 12 times tables, decimals 2dp, equivalent fractions, area perimeter, Roman numerals, coordinates, line graphs",English:"Year 3-4 spelling list, fronted adverbials, noun phrases, determiners, Standard English, paragraph cohesion",Science:"Digestion teeth. Sound vibrations pitch volume. Electricity circuits. States of matter.",History:"Ancient Greece democracy legacy. Roman Britain.",Geography:"UK rivers, OS maps, grid references, settlements",Computing:"Scratch with user input, databases, internet"},
    "Year 5":{Maths:"Numbers to million, negative, BODMAS, 4-digit x 2-digit, fractions mixed numbers, percentages, area triangles, converting units, volume",English:"Year 5-6 spelling list, relative clauses, modal verbs, passive voice, semi-colons colons dashes",Science:"Life cycles plants mammals birds amphibians. Dissolving separating mixtures. Earth space solar system.",History:"Anglo-Saxons Vikings. WWII causes effects.",Geography:"World biomes, climate zones, water cycle, trade",Computing:"Python variables input output conditions loops. Networks."},
    "Year 6":{Maths:"Algebra, ratio proportion, all fraction operations, percentages, area circles, volume, mean, negative numbers, equations",English:"Complex sentences, literary techniques, argument debate, report journalism, critical reading, authorial intent",Science:"Evolution adaptation inheritance. Light refraction. Circulatory system. Electricity voltage.",History:"WW2 in depth, post-war Britain, chronological history",Geography:"Fair trade, development, map skills 6-figure references",Computing:"Advanced Python, cybersecurity, AI intro"},
  },
  US:{
    "Kindergarten":{Math:"Count to 100, compare numbers, add subtract within 10, shapes, measurement comparison","English Language Arts":"Letter-sound correspondence, sight words, retell stories, describe characters",Science:"Pushes pulls, living non-living things, weather, needs of plants animals","Social Studies":"Self family classroom, community helpers, basic maps"},
    "Grade 1":{Math:"Count to 120, add subtract within 20, place value, measure lengths, tell time","English Language Arts":"Decode words, sight words, ask answer questions, write opinion sentences",Science:"Sound light vibrations reflection. Plants animals structures. Sky patterns.","Social Studies":"Families communities, goods services, historical figures"},
    "Grade 2":{Math:"Add subtract within 100, place value to 1000, standard measurement, time, money, arrays","English Language Arts":"Multisyllabic words, main topic key details, compare texts, write informative narrative",Science:"Solid liquid gas. Animals habitats. Earth materials.","Social Studies":"Communities government economics, US regions"},
    "Grade 3":{Math:"Multiply divide within 100, fractions number line, area perimeter, time intervals, bar graphs","English Language Arts":"Chapter books, message or lesson, compare characters settings, opinion writing with evidence",Science:"Heredity traits. Life cycles. Weather climate. Magnets.","Social Studies":"Geography continents oceans, US regions, supply demand"},
    "Grade 4":{Math:"Multi-digit multiplication division, fractions same denominator, decimal notation, classify shapes","English Language Arts":"Infer from text, determine theme, compare narrators, multi-paragraph essays",Science:"Energy transfer waves sound light. Rocks weathering. Plant animal structures.","Social Studies":"US regions, state history, Native American cultures, government branches"},
    "Grade 5":{Math:"Multiply divide fractions, decimals thousandths, volume, coordinate plane, data analysis","English Language Arts":"Figurative language, cite textual evidence, argument with counterclaims",Science:"Matter properties states changes. Ecosystems food webs. Earth systems.","Social Studies":"US history Constitution, Civil War, immigration, westward expansion"},
  },
  CA:{
    "Kindergarten":{Mathematics:"Count to 20, compare groups, simple patterns, basic shapes",Language:"Letter recognition, retell stories, print concepts","Science & Technology":"Needs of living things, seasonal changes, materials","Social Studies":"Self family classroom, community, Indigenous peoples intro"},
    "Grade 1":{Mathematics:"Count to 50, add subtract to 20, simple fractions, 2D 3D shapes, non-standard measurement",Language:"Phonics, sight words, retell texts, simple sentences","Science & Technology":"Living things, seasonal change, properties of objects","Social Studies":"Family community traditions, Canada's diverse communities"},
    "Grade 2":{Mathematics:"Count to 200, add subtract to 100, multiplication patterns, fractions, standard measurement",Language:"Decoding strategies, main idea, compare texts, write recounts","Science & Technology":"Animals growth changes, liquids solids, simple machines","Social Studies":"Canadian communities, Indigenous peoples, local geography"},
    "Grade 3":{Mathematics:"Numbers to 1000, multiplication division facts, fractions, perimeter area, bar graphs",Language:"Chapter books, structured paragraphs, research, oral presentations","Science & Technology":"Plants. Matter materials. Forces movement. Soils.","Social Studies":"Urban rural communities, natural resources, provincial regions"},
    "Grade 4":{Mathematics:"Numbers to 10000, all multiplication facts, decimals, fractions, area perimeter, probability",Language:"Infer interpret, structured essays, research, persuasive writing","Science & Technology":"Habitats communities. Matter materials. Light sound. Rocks minerals.","Social Studies":"Medieval societies, Indigenous peoples, Canada's regions"},
    "Grade 5":{Mathematics:"Integers, fractions operations, percent, surface area volume, data analysis",Language:"Critical literacy, literary techniques, argument writing, research","Science & Technology":"Human organ systems. Properties of matter. Forces on structures.","Social Studies":"First contact, Treaties, Confederation, rights governance"},
    "Grade 6":{Mathematics:"Rational numbers, ratio proportion, algebra, geometric relationships, statistics",Language:"Authorial intent, literary analysis, debate argument, complex research","Science & Technology":"Biodiversity. Flight. Space. Electricity.","Social Studies":"Canada in world, globalisation, human rights, sustainability"},
  },
};


export function getYearGroupContent(child, subject) {
  const country = child.country||"UK";
  const yg = child.yearGroup||YEAR[country]?.[child.age]||"Year 3";
  return YEAR_GROUP_CONTENT[country]?.[yg]?.[subject]||null;
}

export function a11yPromptRules(child) {
  const a = child?.accessibility || {};
  const rules = [];
  if(a.dyslexia) rules.push("Use short sentences (max 12 words). Simple common words. No dense text.");
  if(a.processingDifficulties||a.autism) rules.push("Use very clear, literal, unambiguous language. One instruction at a time. No idioms or figures of speech.");
  if(a.dyscalculia) rules.push("For any maths, include a concrete visual description or real-world objects in the question (e.g. '3 apples and 2 apples'). Always include a step-by-step hint.");
  if(a.testAnxiety||a.generalAnxiety) rules.push("Use warm, low-pressure wording. Never mention time, speed, tests or scores in the question text.");
  if(a.adhd) rules.push("Keep questions short and punchy. High-interest, concrete topics.");
  if(a.visualImpairment) rules.push("Never make the answer depend on describing colours alone.");
  if(a.hearingImpairment) rules.push("Never make a question depend on sound, listening, or audio.");
  return rules.length ? `\nACCESSIBILITY REQUIREMENTS (child has additional needs — follow strictly):\n- ${rules.join("\n- ")}` : "";
}


export const sessionSys = (child, subject, topic, mode, sC, sT, askedQs=[]) => {
  const t = TUTORS[child.tutor];
  const acc = sT>0 ? sC/sT : 0.5;
  const easier = acc<0.45 && sT>=3;
  const harder = acc>0.82 && sT>=3;
  const country = child.country||"UK";
  const yearGroup = child.yearGroup||YEAR[country]?.[child.age]||"Year 3";
  const topicLevel = topic ? (child.topicLevels?.[subject]?.[topic.id]||1) : (child.level?.[subject]||1);
  const yearContent = getYearGroupContent(child, subject);
  const levelObj = topic?.levels?.[topicLevel-1]||topic?.desc||yearContent||"age-appropriate content";
  const lang = country==="US"?"American English (math, color, grade)":country==="CA"?"Canadian English (math, colour, grade)":"British English (maths, colour, year group)";
  return `You are ${child.tutor}. Style: ${t.style}

CHILD: ${child.name} | ${yearGroup} | Age ${child.age} | ${country}
SUBJECT: ${subject} | TOPIC: ${topic?.name||subject} | LANGUAGE: ${lang}
${a11yPromptRules(child)}

${yearGroup} ${subject} CURRICULUM (${country}) — questions MUST stay within this:
"${yearContent||levelObj}"
TOPIC LEVEL ${topicLevel}/10: "${levelObj}"

RULES (no exceptions):
1. Pitch question at exactly ${yearGroup} level — not above, not below
2. READING LEVEL for age ${child.age}: ${child.age<=6?"very short sentences (max 8 words each), only common everyday words, no idioms":child.age<=8?"short sentences (max 12 words each), simple familiar words, no idioms":child.age<=10?"clear sentences (max 16 words each), plain language":"clear direct language"}
2b. Total question text under ${child.age<=6?15:child.age<=8?22:30} words. Ask the question DIRECTLY — no chatty preamble like "Here's a tricky one!" before it.
3. Examples from a ${child.age}-year-old's everyday life in ${country} — toys, pets, snacks, playground, family, not abstract objects
4. ${lang} throughout
5. TEACH LIKE A KIND TEACHER, NOT A TEXTBOOK: if you must use a subject word a ${child.age}-year-old might not know (e.g. "denominator", "century", "habitat"), explain it in the SAME sentence in brackets using a simpler word, e.g. "the denominator (the bottom number)"
6. One idea per question — never stack two concepts in a single question
${easier?"7. Simplify — child struggling. Add a hint.":""}${harder?"7. Slightly more challenging — still within ${yearGroup}":""}

Do NOT repeat: ${askedQs.slice(-8).join(" | ")||"none yet"}
Vary formats: multiple choice, true/false, fill-blank, word problems, spot-mistake

Return ONLY valid JSON:
{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"A","explanation":"brief, ${child.tutor} style","hint":"${easier?"helpful hint":""}","encouragement":"short cheer","difficulty":"${topicLevel<=3?"easy":topicLevel<=7?"medium":"hard"}"}`;
};