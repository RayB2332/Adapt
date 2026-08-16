import React from 'react';
import { supabase } from './lib/supabase';

// Simple password hasher for child accounts
async function hashPassword(pass) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pass + "adapt_salt_2025");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
/**
 * ADAPT — Complete Adaptive AI Education Platform
 * Full build: all screens, all features, persistent storage
 * Ages 4-11 | Maths, English, Science | UK, US, Canada
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ── STYLES ────────────────────────────────────────────────────────────────
(() => {
  if (document.getElementById("adapt-styles")) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap";
  document.head.appendChild(l);
  const s = document.createElement("style");
  s.id = "adapt-styles";
  s.textContent = `
    *{box-sizing:border-box;margin:0;padding:0}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes bounceY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pop{0%{transform:scale(0.7);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
    @keyframes popIn{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
    @keyframes slideRight{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
    @keyframes badgePop{0%{transform:scale(0) rotate(-15deg)}60%{transform:scale(1.25) rotate(5deg)}100%{transform:scale(1) rotate(0deg)}}
    @keyframes correctPop{0%{transform:scale(1)}40%{transform:scale(1.08)}100%{transform:scale(1)}}
    @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
    @keyframes starBurst{0%{transform:scale(0) rotate(0deg);opacity:1}50%{transform:scale(1.4) rotate(180deg);opacity:1}100%{transform:scale(0) rotate(360deg);opacity:0}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}
    button,input,select{font-family:'Nunito',sans-serif}
    button:hover{filter:brightness(1.08);transform:translateY(-1px)}
    @keyframes revealDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes revealUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes revealLeft{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    .reveal-1{animation:revealDown 0.4s ease 0.1s both}
    .reveal-2{animation:revealUp 0.4s ease 0.25s both}
    .reveal-3{animation:revealLeft 0.4s ease 0.4s both}
    .reveal-4{animation:revealUp 0.4s ease 0.55s both}
    button:active{transform:scale(0.96)!important;filter:brightness(0.95)}
    .game-btn:hover{transform:translateY(-2px) scale(1.02)!important}
    @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes flashGreen{0%{opacity:0.5}100%{opacity:0}}
    @keyframes flashRed{0%{opacity:0.4}100%{opacity:0}}
    @keyframes comboIn{0%{transform:translate(-50%,-50%) scale(0.4);opacity:0}60%{transform:translate(-50%,-50%) scale(1.15);opacity:1}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}
    @keyframes comboOut{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(0.8);opacity:0}}
    @keyframes encourageIn{0%{transform:translateX(-50%) translateY(10px);opacity:0}100%{transform:translateX(-50%) translateY(0);opacity:1}}
    @keyframes progressPop{0%{transform:scale(1)}50%{transform:scale(1.6)}100%{transform:scale(1)}}
    @keyframes cardPress{0%{transform:scale(1)}100%{transform:scale(0.93)}}
    @keyframes gemPulse{0%{box-shadow:0 0 0 0 rgba(255,255,255,0.6)}70%{box-shadow:0 0 0 20px rgba(255,255,255,0)}100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}}
    @keyframes floatIn{0%{opacity:0;transform:translateY(24px) scale(0.9)}100%{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes scoreFloat{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-60px) scale(1.4)}}
    @keyframes slideInLeft{0%{opacity:0;transform:translateX(-20px)}100%{opacity:1;transform:translateX(0)}}
    @keyframes slideInRight{0%{opacity:0;transform:translateX(20px)}100%{opacity:1;transform:translateX(0)}}
    @keyframes zoomIn{0%{opacity:0;transform:scale(0.7)}100%{opacity:1;transform:scale(1)}}
    @keyframes twinkle{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}
    @keyframes orbit{from{transform:rotate(0deg) translateX(120px) rotate(0deg)}to{transform:rotate(360deg) translateX(120px) rotate(-360deg)}}
    @keyframes raceLine{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
    @keyframes leafDrift{0%{transform:translateY(-20px) rotate(0deg);opacity:0}50%{opacity:0.4}100%{transform:translateY(120px) rotate(180deg);opacity:0}}
    @keyframes wrongShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
    @keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0.4)}50%{box-shadow:0 0 0 12px rgba(245,158,11,0)}}
    @keyframes countUp{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
    @keyframes glowPulse{0%,100%{box-shadow:0 0 8px rgba(245,158,11,0.3)}50%{box-shadow:0 0 20px rgba(245,158,11,0.7)}}
    body{background:linear-gradient(170deg,#EEF2FF 0%,#F5F3FF 55%,#FDF4FF 100%);background-attachment:fixed;}
    button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #4338CA;outline-offset:2px}
    .a11y-still,.a11y-still *,.a11y-still *::before,.a11y-still *::after{animation:none!important;transition:none!important}
    .tap-scale:active{transform:scale(0.94)!important;transition:transform 0.08s!important}
    @keyframes jellyPop{0%{transform:translateY(-4px) scale(1)}30%{transform:translateY(-4px) scale(1.14,0.88)}55%{transform:translateY(-4px) scale(0.94,1.08)}75%{transform:translateY(-4px) scale(1.06,0.97)}100%{transform:translateY(-4px) scale(1.04)}}
    @keyframes ringPulse{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.14)}}
    @keyframes screenShake{0%,100%{transform:translate(0,0)}20%{transform:translate(-7px,3px)}40%{transform:translate(6px,-3px)}60%{transform:translate(-5px,2px)}80%{transform:translate(4px,-2px)}}
    @keyframes heartLose{0%{transform:scale(1.4) rotate(0)}50%{transform:scale(1.1) rotate(-14deg)}100%{transform:scale(1) rotate(0)}}
    @keyframes flameFlicker{0%,100%{transform:scaleY(1);opacity:1}50%{transform:scaleY(1.25);opacity:0.85}}
    @keyframes countPunch{0%{transform:scale(2.4);opacity:0}55%{transform:scale(0.92);opacity:1}100%{transform:scale(1);opacity:1}}
    @keyframes qSlideIn{0%{opacity:0;transform:translateY(-14px) scale(0.96)}100%{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes particleFly{0%{opacity:1;transform:translateY(0) scale(0.4)}100%{opacity:0;transform:translateY(-78px) scale(1.25)}}
    @keyframes starLand{0%{transform:scale(2.6) rotate(-30deg);opacity:0}60%{transform:scale(0.9) rotate(6deg);opacity:1}100%{transform:scale(1) rotate(0)}}
    @keyframes loadSlide{0%{transform:translateX(-110%)}100%{transform:translateX(320%)}}
    @keyframes warpDown{0%{transform:translateY(-16px) scaleY(1)}100%{transform:translateY(26px) scaleY(3.2)}}
    @keyframes dashLeft{0%{transform:translateX(110vw)}100%{transform:translateX(-140px)}}
    @keyframes kartBob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-3px)}}
    @keyframes fireflyDrift{0%,100%{transform:translate(0,0)}30%{transform:translate(9px,-13px)}65%{transform:translate(-7px,-5px)}}
    @media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}}
  `;
  document.head.appendChild(s);
})();

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  // Backgrounds
  bg:"#F5F3FF", surface:"#FFFFFF", card:"#FFFFFF",
  // Primary - richer indigo
  primary:"#4338CA", pLight:"#EEF2FF", pDark:"#3730A3",
  // Semantic colours - more saturated
  amber:"#D97706",  aLight:"#FEF3C7",
  violet:"#7C3AED", vLight:"#F3F0FF",
  sky:"#0284C7",    sLight:"#E0F2FE",
  green:"#16A34A",  gLight:"#DCFCE7",
  pink:"#DB2777",   pkLight:"#FCE7F3",
  red:"#DC2626",    rLight:"#FEE2E2",
  orange:"#EA580C", oLight:"#FFEDD5",
  teal:"#0D9488",   tLight:"#CCFBF1",
  lime:"#65A30D",   lLight:"#ECFCCB",
  // Text
  text:"#0F172A", muted:"#64748B", border:"#E2E8F0",
  // Game answer button colours (Kahoot-style)
  ansA:"#E53E3E", ansB:"#3182CE", ansC:"#D69E2E", ansD:"#38A169",
  ansALight:"#FED7D7", ansBLight:"#BEE3F8", ansCLight:"#FEFCBF", ansDLight:"#C6F6D5",
};
const F = "'Nunito',sans-serif";
const FDYS = "'OpenDyslexic','Comic Sans MS',sans-serif";

// ── DATA ──────────────────────────────────────────────────────────────────
const SUBJECTS = ["Maths","English","Science","History","Geography","Computing"];
const SUB = {
  // Each subject is a distinct vivid world
  Maths:    {emoji:"🔢",color:"#2563EB",light:"#DBEAFE",grad:"linear-gradient(135deg,#1D4ED8,#3B82F6,#60A5FA)",ring:"#93C5FD"},
  English:  {emoji:"📖",color:"#EA580C",light:"#FED7AA",grad:"linear-gradient(135deg,#C2410C,#EA580C,#FB923C)",ring:"#FDBA74"},
  Science:  {emoji:"🔬",color:"#16A34A",light:"#BBF7D0",grad:"linear-gradient(135deg,#15803D,#22C55E,#4ADE80)",ring:"#86EFAC"},
  History:  {emoji:"📜",color:"#92400E",light:"#FDE68A",grad:"linear-gradient(135deg,#78350F,#B45309,#D97706)",ring:"#FCD34D"},
  Geography:{emoji:"🌍",color:"#0E7490",light:"#A5F3FC",grad:"linear-gradient(135deg,#0E7490,#0891B2,#22D3EE)",ring:"#67E8F9"},
  Computing:{emoji:"💻",color:"#7C3AED",light:"#DDD6FE",grad:"linear-gradient(135deg,#6D28D9,#7C3AED,#A78BFA)",ring:"#C4B5FD"},
  "11+ Verbal Reasoning":  {emoji:"🔤",color:"#DB2777",light:"#FCE7F3",grad:"linear-gradient(135deg,#BE185D,#DB2777,#F472B6)",ring:"#F9A8D4"},
  "11+ Non-Verbal Reasoning":{emoji:"🔷",color:"#0F766E",light:"#CCFBF1",grad:"linear-gradient(135deg,#0F766E,#14B8A6,#5EEAD4)",ring:"#99F6E4"},
  "11+ Maths": {emoji:"🔢",color:"#1D4ED8",light:"#BFDBFE",grad:"linear-gradient(135deg,#1E40AF,#2563EB,#60A5FA)",ring:"#93C5FD"},
  // US/CA aliases with same rich colours
  Math:        {emoji:"🔢",color:"#2563EB",light:"#DBEAFE",grad:"linear-gradient(135deg,#1D4ED8,#3B82F6,#60A5FA)"},
  Mathematics: {emoji:"🔢",color:"#2563EB",light:"#DBEAFE",grad:"linear-gradient(135deg,#1D4ED8,#3B82F6,#60A5FA)"},
  "English Language Arts":{emoji:"📖",color:"#EA580C",light:"#FED7AA",grad:"linear-gradient(135deg,#C2410C,#EA580C,#FB923C)"},
  Language:    {emoji:"📖",color:"#EA580C",light:"#FED7AA",grad:"linear-gradient(135deg,#C2410C,#EA580C,#FB923C)"},
  "Science & Technology":{emoji:"🔬",color:"#16A34A",light:"#BBF7D0",grad:"linear-gradient(135deg,#15803D,#22C55E,#4ADE80)"},
  "Social Studies":{emoji:"🌏",color:"#92400E",light:"#FDE68A",grad:"linear-gradient(135deg,#78350F,#B45309,#D97706)"},
  "Computer Studies":{emoji:"💻",color:"#7C3AED",light:"#DDD6FE",grad:"linear-gradient(135deg,#6D28D9,#7C3AED,#A78BFA)"},
};


// ═══════════════════════════════════════════════════════════
// CURRICULUM — Fully aligned to national standards
// UK: National Curriculum KS1/KS2
// US: Common Core + NGSS + CSTA
// CA: Ontario Curriculum (most widely applicable province)
// ═══════════════════════════════════════════════════════════

const UK_CURRICULUM = {
  Maths: [
    {id:"number_place",   name:"Number & Place Value",        emoji:"🔢", minAge:5,
     desc:"Counting, reading, writing and ordering numbers",
     levels:["Count to 100, tens and ones, more and less","Numbers to 1000, place value, rounding to 10/100","Numbers to 10,000, negative numbers, Roman numerals","Numbers to 1,000,000, ordering, rounding, counting in steps","Numbers to 10,000,000, powers of 10, negative numbers in context","Integers to 10 million, negative numbers, prime factors and HCF/LCM","Indices, standard form intro, ordering fractions/decimals/percentages","Surds intro, irrational numbers, exact values, significant figures","Number theory: prime factorisation, Euclidean algorithm, modular arithmetic","Advanced number: complex concepts, proof by exhaustion, number patterns"]},
    {id:"addition",       name:"Addition & Subtraction",      emoji:"➕", minAge:5,
     desc:"Mental and written addition and subtraction methods",
     levels:["Number bonds to 10 and 20, adding single digits","Adding/subtracting 2-digit numbers, column method introduction","Column addition and subtraction to 3 digits, estimating","Adding/subtracting 4-digit numbers, inverse operations","Multi-step problems, decimals, mental strategies","Multi-step problems with decimals, negative numbers, mental strategies","Adding/subtracting fractions with different denominators, mixed numbers","Algebraic addition: collecting like terms, simplifying expressions","Addition in different contexts: vectors, matrix addition, coordinates","Proof and generalisation: sum of consecutive numbers, algebraic proofs"]},
    {id:"multiplication", name:"Multiplication & Division",   emoji:"✖️", minAge:6,
     desc:"Times tables, short and long multiplication and division",
     levels:["2, 5 and 10 times tables, arrays, grouping","3, 4 and 8 times tables, short multiplication/division","All tables to 12, short division with remainders","Long multiplication 2-digit, short division with fractions","Long multiplication and division, prime factors, BODMAS","Multiply/divide decimals, prime factorisation, factor trees","Multiply fractions and mixed numbers, multiply negative numbers","Multiply algebraic expressions, expand single brackets","Expand double brackets, factorise expressions, difference of squares","Advanced algebra: factorising quadratics, completing the square"]},
    {id:"fractions",      name:"Fractions, Decimals & %",     emoji:"½",  minAge:6,
     desc:"Fractions, decimals and percentages",
     levels:["Halves, quarters and thirds, unit fractions","Equivalent fractions, ordering, simple addition","Adding/subtracting fractions same denominator, tenths","Decimal equivalents, hundredths, fractions of amounts","Percentages, fraction/decimal/% equivalence, multi-step","Fractions of amounts with complex denominators, mixed operations","Dividing fractions by fractions, fraction/decimal/% conversions","Fractions in algebraic contexts, ratio as fractions","Recurring decimals, fraction arithmetic in problem solving","Advanced fraction work: compound fractions, limits, approximations"]},
    {id:"measurement",    name:"Measurement",                 emoji:"📏", minAge:5,
     desc:"Length, mass, capacity, time, money, perimeter and area",
     levels:["Compare and measure length/mass/capacity, time to hour","Measure in cm/m/kg/l, money to £1, time to 5 mins","Perimeter, area basics, time to minute, Roman numerals","Area by counting, converting units, 24-hour clock","Area/perimeter formulae, volume, converting metric units","Area of triangles, parallelograms, compound shapes","Volume of prisms, surface area, converting between metric and imperial","Circumference and area of circles, arc length, sector area","3D shapes: surface area and volume of cylinders, pyramids, cones","Advanced measurement: spheres, frustums, similar shapes scale factors"]},
    {id:"geometry",       name:"Geometry — Shape",            emoji:"📐", minAge:5,
     desc:"2D and 3D shapes, angles, symmetry and properties",
     levels:["Name 2D/3D shapes, sort by properties, symmetry lines","Quadrilaterals, polygons, right angles, lines of symmetry","Angles acute/obtuse/right, triangles, 3D shape nets","Angles on lines and points, regular/irregular polygons","Calculate angles, circles, area of triangles/parallelograms","Angle rules: parallel lines, triangles, polygons interior/exterior","Congruence and similarity, scale drawings, loci and constructions","Pythagoras theorem, trigonometry: sin, cos, tan","Circle theorems, geometric proof, vectors","Advanced geometry: 3D trigonometry, sine and cosine rules"]},
    {id:"position",       name:"Position & Direction",        emoji:"🧭", minAge:6,
     desc:"Coordinates, translation, reflection and rotation",
     levels:["Directions, half/quarter turns, patterns","Describe positions, first quadrant coordinates","Translate shapes, reflect in axes, describe movement","Four-quadrant coordinates, translation by vector","Reflection and translation, solve geometry problems","Transformations: enlargement with scale factor, centre of enlargement","Combining transformations, invariant points","Vectors: addition, subtraction, scalar multiplication","Vector geometry: midpoints, parallel lines using vectors","Advanced transformation geometry: matrices for transformations"]},
    {id:"statistics",     name:"Statistics & Data",           emoji:"📊", minAge:7,
     desc:"Tally charts, bar charts, line graphs, pie charts",
     levels:["Tally charts, pictograms, block diagrams","Bar charts with labels, simple data questions","Bar charts scaled axes, line graphs, tables","Time graphs, calculate mean, compare data sets","Pie charts, line graphs, mean from frequency tables","Scatter graphs, correlation, lines of best fit","Cumulative frequency, box plots, interquartile range","Histograms with unequal class widths, frequency density","Probability: tree diagrams, conditional probability","Advanced statistics: hypothesis testing, sampling methods"]},
    {id:"ratio",          name:"Ratio & Proportion",          emoji:"⚖️", minAge:10,
     desc:"Ratio, proportion, scale and unequal sharing",
     levels:["Introduction to ratio notation and simple ratios","Simplify ratios, share amounts in given ratio","Scale factors, ratio in recipes and maps","Proportion problems, percentage as ratio","Combine ratio and proportion in multi-step problems","Ratio in direct proportion, best value problems","Inverse proportion, ratio and percentage combined","Ratio in geometry: similar shapes, trigonometry ratios","Proportion: direct and inverse proportion graphs and equations","Advanced ratio: compound measures, rates of change"]},
    {id:"algebra",        name:"Algebra",                     emoji:"🔣", minAge:10,
     desc:"Formulae, sequences, unknowns and equations",
     levels:["Number sequences and patterns, missing numbers","Formulae with one variable, substitution","Linear sequences, generating terms, simple equations","Solve one-step equations, express missing angles","Two-step equations, enumerate possibilities, formulae","Solving linear equations with brackets and fractions","Simultaneous equations by substitution and elimination","Quadratic equations: factorising, quadratic formula","Graphs of quadratics, cubics, reciprocals, exponentials","Advanced algebra: functions, iteration, proof"]},
  ],
  English: [
    {id:"phonics",        name:"Phonics & Decoding",          emoji:"🔤", minAge:4,
     desc:"Letter sounds, blending and segmenting",
     levels:["Phase 2: s,a,t,p,i,n,m,d,g,o,c,k — CVC words","Phase 3: j,v,w,x,y,z,qu, digraphs ch,sh,th,ng","Phase 4: CCVC/CVCC words, blending longer words","Phase 5: alternative graphemes, split digraphs","Common exception words, polysyllabic words, fluency","Polysyllabic words, morphology, word families","Etymology: Latin and Greek roots, word origins","Complex spelling patterns, technical vocabulary","Advanced decoding: ambiguous graphemes, accent and dialect","Linguistic analysis: phonological awareness in context"]},
    {id:"spelling",       name:"Spelling",                    emoji:"✏️", minAge:5,
     desc:"Spelling rules, patterns and common exception words",
     levels:["KS1 common exception words, simple CVC patterns","Suffixes -ing/-ed/-er, double consonants, y to i","Prefixes un-/re-/mis-, soft c and g, homophones","KS2 Year 3-4 statutory word list, prefixes pre-/dis-","Year 5-6 statutory list, silent letters, word origins","Complex prefixes: inter-, super-, anti-, auto-","Word origins: French, Latin, Greek influences on English","Specialist vocabulary across subjects, technical terms","Advanced etymology, spelling conventions by word origin","Morphological analysis: derivational and inflectional morphemes"]},
    {id:"grammar",        name:"Grammar & Punctuation",       emoji:"📝", minAge:5,
     desc:"Sentence structure, word types and punctuation",
     levels:["Capital letters, full stops, question marks, finger spaces","Nouns, verbs, adjectives, exclamation marks, commas in lists","Conjunctions, adverbs, apostrophes, inverted commas","Pronouns, prepositions, fronted adverbials, paragraphs","Relative clauses, modal verbs, subjunctive, formal/informal","Passive voice, subjunctive mood, complex sentences","Punctuation: colons, semi-colons, dashes, parenthesis","Discourse markers, cohesive devices, text organisation","Register and formality, Standard English, dialect","Advanced grammar: syntax analysis, grammatical ambiguity"]},
    {id:"reading",        name:"Reading Comprehension",       emoji:"📖", minAge:5,
     desc:"Retrieval, inference and understanding texts",
     levels:["Retell stories, sequence events, simple retrieval","Infer character feelings, predict, ask questions about text","Explain and justify using evidence, summarise main ideas","Compare texts, author purpose, vocabulary in context","Critical analysis, writer techniques, evaluate perspectives","Extended inference, implicit meaning, reading between lines","Authorial intent, social and historical context","Comparative reading: compare themes, language, structure","Critical reading: evaluating bias, argument and rhetoric","Advanced literary analysis: symbolism, narrative technique, context"]},
    {id:"writing",        name:"Writing — Composition",       emoji:"🖊️", minAge:6,
     desc:"Stories, recounts, letters, instructions and reports",
     levels:["Simple sentences, describe pictures, recount events","Stories with beginning/middle/end, simple instructions","Paragraphs, expanded noun phrases, different sentence types","Multi-paragraph stories, persuasive letters, formal reports","Complex narratives, evaluate and edit, audience and purpose","Extended writing: multi-genre, sustained argument","Writing for different audiences: broadening register","Crafting language: imagery, tone, voice, style","Editing and redrafting: improving coherence and impact","Advanced writing: literary techniques, independent authorial voice"]},
    {id:"vocabulary",     name:"Vocabulary & Word Study",     emoji:"💬", minAge:6,
     desc:"Word meanings, synonyms, antonyms and context",
     levels:["Match words to pictures, simple definitions","Synonyms and antonyms, word families, compound words","Prefixes and suffixes change meaning, context clues","Formal/informal word choice, figurative language intro","Connotation, etymology, technical vocabulary by subject","Academic vocabulary across subjects, morphological strategies","Figurative language: metaphor, irony, hyperbole in context","Word choice for effect: connotation, register, precision","Etymology and word history: how language evolves","Advanced vocabulary: linguistic analysis, word power in texts"]},
    {id:"poetry",         name:"Poetry & Creative Writing",   emoji:"🎭", minAge:7,
     desc:"Rhyme, rhythm, imagery and creative expression",
     levels:["Rhyming couplets, simple poems, describe a scene","Similes, alliteration, acrostic poems, kennings","Metaphors, personification, performance poetry","Free verse, haiku, narrative poetry, poetic devices","Extended creative writing, evaluate techniques, original voice","Extended poetic forms: sonnets, odes, dramatic monologue","Poetic movement and context: Romantics, War poets","Comparative poetry: themes, form, language, context","Writing extended poetry: developing a poetic voice","Advanced poetry analysis: critical interpretation, reader response"]},
    {id:"media",          name:"Non-fiction & Media Literacy",emoji:"📰", minAge:7,
     desc:"Reports, persuasion, evaluating sources",
     levels:["Information texts, labels, captions, simple reports","Recount texts, newspapers, fact vs opinion","Persuasive writing techniques, bias, argument structure","Formal reports, journalistic writing, evaluate reliability","Complex argument, rhetorical devices, digital media literacy","Extended non-fiction: investigative journalism, documentary","Multimodal texts: image and text combined","Digital media creation: blogs, vlogs, podcasts","Media representation: gender, race, culture in media","Advanced media literacy: propaganda, fake news, political bias"]},
  ],
  Science: [
    {id:"plants",         name:"Plants",                      emoji:"🌱", minAge:5,
     desc:"Parts of plants, growth, pollination and life cycles",
     levels:["Name basic parts: root, stem, leaf, flower","What plants need: water, light, warmth, nutrients","Flowers, pollination, seed dispersal, germination","Life cycle of flowering plants, photosynthesis basics","Plant reproduction, adaptation, plant classification","Photosynthesis equation, limiting factors, leaf structure","Plant hormones: tropisms, auxins and their effects","Sexual and asexual reproduction in plants","Plant classification: dichotomous keys, taxonomy","Ecology: plant communities, succession, conservation"]},
    {id:"animals",        name:"Animals Including Humans",    emoji:"🐾", minAge:5,
     desc:"Basic needs, food chains, human body and health",
     levels:["Name and group animals, basic needs, offspring","Food chains, predator/prey, habitats and survival","Skeleton and muscles, nutrition, healthy eating","Digestion, teeth types, food groups, exercise and health","Circulatory system, heart, blood, drugs and lifestyle","Breathing and gas exchange, respiration aerobic/anaerobic","Nervous system: neurones, reflex arc, brain function","Hormonal system: endocrine glands, feedback mechanisms","Reproduction: fertilisation, development, birth","Advanced biology: homeostasis, evolution, ecosystems"]},
    {id:"materials",      name:"Materials & Their Properties",emoji:"🧪", minAge:5,
     desc:"Properties of materials, changes and suitability",
     levels:["Name materials: wood, plastic, metal, glass, fabric","Properties: hard/soft, waterproof, transparent, flexible","Solids, liquids, gases — particles and properties","Dissolving, filtering, evaporation — reversible changes","Irreversible changes, burning, rusting, thermal conductivity","Atomic structure: protons, neutrons, electrons, periodic table","Chemical bonding: ionic, covalent, metallic","Chemical reactions: word and symbol equations, energy changes","Acids, bases, salts: neutralisation, pH scale","Advanced chemistry: rates, equilibrium, organic chemistry"]},
    {id:"seasons",        name:"Seasonal Changes & Weather",  emoji:"☀️", minAge:4,
     desc:"The four seasons, weather patterns and day length",
     levels:["Four seasons: name and describe each","Weather: sunny, rainy, snowy, windy, measuring","Day length changes, sunrise and sunset across seasons","Weather symbols, recording, patterns and predictions","Climate vs weather, UK climate, impact on living things","Climate zones: tropical, temperate, polar, arid","Weather systems: pressure, fronts, precipitation","Climate change: evidence, causes, effects, solutions","Microhabitats and seasonal adaptation","Advanced climatology: models, feedback loops, prediction"]},
    {id:"living",         name:"Living Things & Habitats",    emoji:"🌿", minAge:6,
     desc:"Classification, adaptation and ecosystems",
     levels:["Living/non-living, microhabitats, name local animals","Food chains, producers/consumers, describe habitats","Classification: vertebrates/invertebrates, keys","Adaptation to habitats, variation within species","Classification systems, ecosystems, human impact","Cell biology: cell types, organelles, specialisation","Microscopy: magnification, cell size, drawing cells","Transport in cells: osmosis, diffusion, active transport","Genetics: DNA, chromosomes, genes, inheritance","Advanced biology: protein synthesis, mutations, genetic engineering"]},
    {id:"forces",         name:"Forces & Motion",             emoji:"🚀", minAge:7,
     desc:"Gravity, friction, magnetism and mechanisms",
     levels:["Push and pull forces, magnets attract/repel","Gravity, friction, water resistance, air resistance","Simple mechanisms: levers, pulleys, gears","Effects of forces on shape and movement, balanced forces","Speed calculations, force diagrams, pressure","Newton's Laws: F=ma, resultant forces, free body diagrams","Momentum and impulse, conservation of momentum","Work, energy and power: W=Fd, P=W/t","Pressure: P=F/A, fluid pressure, Hooke's Law","Advanced mechanics: moments, circular motion, waves"]},
    {id:"light",          name:"Light & Shadow",              emoji:"💡", minAge:7,
     desc:"Light sources, reflection, shadows and seeing",
     levels:["Light sources, dark without light, eyes to see","Shadows form opposite light source, shadow size","Reflection from surfaces, mirrors and periscopes","Refraction, prism, spectrum, colour and light","Light travel, speed of light, scientific applications","Reflection: angle of incidence = angle of reflection, mirrors","Refraction: Snell's Law, critical angle, total internal reflection","Lenses: converging and diverging, focal length, ray diagrams","Electromagnetic spectrum: properties and uses of each wave type","Advanced optics: interference, diffraction, polarisation"]},
    {id:"sound",          name:"Sound",                       emoji:"🎵", minAge:7,
     desc:"Vibrations, pitch, volume and how sound travels",
     levels:["Sounds come from vibrations, volume near/far","Pitch high/low linked to size, volume and distance","Insulating sound, string telephones, ear drum","How sound travels through solids/liquids/gases","Speed of sound, echoes, ultrasound applications","Wave properties: frequency, amplitude, wavelength, wave speed","Sound in different media, speed of sound, echoes","Musical instruments: standing waves, harmonics, resonance","The ear: structure and function, hearing range, decibels","Advanced acoustics: Doppler effect, ultrasound applications"]},
    {id:"electricity",    name:"Electricity & Circuits",      emoji:"⚡", minAge:8,
     desc:"Simple circuits, components and electrical safety",
     levels:["Everyday uses of electricity, electrical safety","Simple circuits: battery, bulb, wire, switch","Insulators and conductors, testing materials","Series circuits, voltage, changing brightness/pitch","Circuit diagrams, resistance, electrical current basics","Ohm's Law: V=IR, series and parallel circuits calculations","Power: P=IV, energy: E=Pt, electrical safety","Electromagnetism: solenoids, electromagnets, applications","Induction: generators, transformers, mains electricity","Advanced electricity: semiconductors, logic gates, diodes"]},
    {id:"earth",          name:"Earth & Space",               emoji:"🌍", minAge:9,
     desc:"Solar system, Earth rotation, Moon and gravity",
     levels:["Name planets in solar system, sun is a star","Earth rotation causes day and night, 365 days","Moon orbit of Earth, phases of the Moon","Geocentric vs heliocentric model, historical understanding","Gravity in space, satellites, space exploration","Rock cycle: sedimentary, igneous, metamorphic formation","Plate tectonics: structure of Earth, continental drift","Earthquakes and volcanoes: causes, effects, prediction","Atmosphere: composition, evolution, greenhouse effect","Advanced Earth science: carbon cycle, geologic time, climate"]},
    {id:"evolution",      name:"Evolution & Inheritance",     emoji:"🦕", minAge:10,
     desc:"Fossils, adaptation, inheritance and natural selection",
     levels:["Fossils show life has changed over time","Parents pass traits to offspring, variation","Animals adapt to environments over many generations","Natural selection: survival of the fittest","Evidence for evolution, Darwin, DNA basics","Natural selection: variation, competition, survival, reproduction","Evidence for evolution: fossils, DNA, comparative anatomy","Speciation: geographic isolation, reproductive barriers","Human evolution: hominid fossil record, genetic evidence","Advanced evolution: Hardy-Weinberg, population genetics"]},
    {id:"properties2",    name:"Properties & Changes",        emoji:"🔬", minAge:9,
     desc:"States of matter, dissolving, separating and reactions",
     levels:["Solids/liquids/gases, particle model basics","Dissolving, solutions, solute and solvent","Separating mixtures: filtering, sieving, evaporating","Irreversible changes, new substances formed","Combustion, oxidation, thermal decomposition","Rates of reaction: factors affecting rate, collision theory","Catalysts: enzymes, industrial catalysts, activation energy","Electrolysis: electrolytes, products at electrodes, uses","Energy in reactions: exothermic/endothermic, bond energies","Advanced chemistry: equilibrium, Le Chatelier's principle"]},
  ],
  History: [
    {id:"living_memory",  name:"Changes in Living Memory",    emoji:"👴", minAge:5,
     desc:"How life has changed within living memory",
     levels:["How homes have changed: TVs, phones, appliances","How schools have changed: lessons, equipment, rules","How transport has changed: cars, planes, space","Changes to food, shops and everyday life","Oral history, interviewing grandparents, local change","Explore changes in daily life within grandparents' lifetimes: transport, technology, food","Significant national events within living memory: Olympic Games, Royal events","Compare life in the 1950s-1980s with today using photographs and oral histories","Social changes within living memory: women's roles, multiculturalism, technology revolution","Economic and political changes: Thatcher era, devolution, EU membership debate"]},
    {id:"beyond_memory",  name:"Events Beyond Living Memory", emoji:"📜", minAge:5,
     desc:"Significant national/global events from the past",
     levels:["Great Fire of London 1666: causes and effects","The Moon Landing 1969: space race and achievement","The Titanic 1912: why it sank, impact and memory","The Gunpowder Plot 1605: Guy Fawkes, treason, legacy","World events that changed history: suffragettes, plagues","Events beyond living memory significant nationally: Great Fire 1666, Titanic 1912","Victorian Britain: industrial revolution, child labour, railways and empire","World War One: causes, trenches, home front, Armistice, commemoration","World War Two: causes, Blitz, evacuation, Holocaust, D-Day, legacy","Post-war Britain 1945-present: NHS, immigration, Cold War, Falklands, devolution"]},
    {id:"significant",    name:"Significant People & Events", emoji:"⭐", minAge:5,
     desc:"Important people who shaped Britain and the world",
     levels:["Florence Nightingale: nursing, Crimean War, reform","Rosa Parks and Martin Luther King: civil rights","Neil Armstrong: space exploration, the Moon","Queen Elizabeth II: longest reign, modern history","Scientists and inventors: Darwin, Newton, Faraday, Curie","Significant people who changed Britain: Brunel, Florence Nightingale, Suffragettes","Significant people in world history: Gandhi, MLK, Mandela, Marie Curie","Religious and cultural significant figures: Muhammad, Jesus, Buddha in historical context","Scientific and exploratory figures: Darwin, Copernicus, Columbus — impact and controversy","Evaluate historical significance: why do some people matter more to history than others?"]},
    {id:"ancient",        name:"Ancient Civilisations",       emoji:"🏛️", minAge:7,
     desc:"Stone Age through to Roman Britain",
     levels:["Stone Age: hunter-gatherers, cave art, Stonehenge","Bronze and Iron Age: farming, hillforts, Celts","Ancient Egypt: pharaohs, pyramids, mummification, Nile","Ancient Greece: Athens, democracy, Olympics, gods, philosophers","Roman Britain: invasion, Boudicca, roads, villas, legacy","Ancient Egypt: pharaohs, pyramids, mummies, hieroglyphics, River Nile civilisation","Ancient Greece: city-states, democracy, mythology, Olympics, philosophy, legacy","Ancient Rome: Republic to Empire, Julius Caesar, legions, Romanisation of Britain","Mesopotamia: Sumer, Babylon, writing, law codes, ziggurats, first cities","Compare ancient civilisations: trade, beliefs, governance, legacy to modern world"]},
    {id:"british",        name:"British History",             emoji:"👑", minAge:7,
     desc:"Anglo-Saxons, Vikings, Tudors, Victorians and beyond",
     levels:["Anglo-Saxons: kingdoms, Beowulf, culture, Christianity","Vikings: raids, Danelaw, longships, Norse mythology","Tudors: Henry VIII, six wives, Reformation, Elizabeth I","Victorians: industrial revolution, empire, poverty, reform","WW1 and WW2: causes, trenches, home front, legacy","Romans in Britain: invasion, Boudicca, forts, roads, Romanisation, withdrawal","Anglo-Saxons: kingdoms, Christianity, Alfred the Great, culture and settlements","Vikings: raids, settlements, Danelaw, Norse culture, Jorvik","Norman Conquest 1066: Battle of Hastings, Domesday Book, feudal system, castles","Medieval Britain: Magna Carta, Black Death, Peasants' Revolt, Wars of Roses"]},
    {id:"world_history",  name:"World History",               emoji:"🌐", minAge:8,
     desc:"Significant events and changes in world history",
     levels:["Ancient civilisations: Mesopotamia, Indus Valley, China","Medieval world: Crusades, Black Death, Islamic Golden Age","Age of exploration: Columbus, Vasco da Gama, Magellan","Industrial Revolution: steam, factories, social change","Modern world: WW1, WW2, Cold War, decolonisation","Early Islamic civilisation: Baghdad, scholars, medicine, mathematics, trade routes","The Maya: city-states, calendar, astronomy, writing, decline","Benin and West African kingdoms: Benin bronzes, trade, governance, Portuguese contact","Tang Dynasty China: silk road, inventions, paper, gunpowder, printing, global influence","Age of Exploration 1400-1600: Explorers, trade routes, colonisation, Columbian Exchange"]},
    {id:"local_history",  name:"Local & Community History",   emoji:"🏘️", minAge:6,
     desc:"History of the local area, buildings and community",
     levels:["Describe changes to local area using old photos","Identify old buildings and their purpose","Find out how local area developed over time","Research using local archives, maps and census records","Compare local history with national events","Changes in our local area over the last 100 years using maps, photos, census records","Significant local events and people who shaped our town or village","Local industrial history: what was made here, who worked here, conditions","How our local area was affected by national events: WWI/II, industry, immigration","Connecting local history to national and world events — placing local in global context"]},
    {id:"chronology",     name:"Chronology & Historical Skills",emoji:"📅", minAge:5,
     desc:"Timelines, historical enquiry and source skills",
     levels:["Before/after, older/newer, ordering events in sequence","BC and AD, centuries, simple timelines","Primary and secondary sources, what is evidence?","Cause and consequence, similarity and difference","Significance, interpretation, historical argument","Sequence events using timelines: BCE/CE, decades, centuries — place key events","Cause and consequence: identify why events happened and what resulted","Similarity and difference: compare people's lives across different historical periods","Using primary sources: evaluate reliability, bias, perspective of historical evidence","Historical significance: why do some events and people matter more than others?"]},
  ],
  Geography: [
    {id:"uk_geo",         name:"UK Geography",                emoji:"🇬🇧", minAge:5,
     desc:"UK countries, cities, physical features and regions",
     levels:["4 countries, capital cities, surrounding seas","Counties, regions, major cities, Offa's Dyke","UK physical features: mountains, rivers, coasts","UK climate, land use, economic regions","Environmental issues, sustainability, UK in the world","UK regions, capital cities, seas and key physical features","UK counties, major cities, population distribution, land use patterns","UK climate: factors affecting weather, regional variations, seasons","UK economic geography: industry, agriculture, tourism, trade and ports","UK challenges: urbanisation, inequality, housing, transport, sustainability"]},
    {id:"world_geo",      name:"World Geography",             emoji:"🌍", minAge:6,
     desc:"Continents, countries, capitals and world features",
     levels:["7 continents and 5 oceans, basic locations","Major countries and capitals, equator and poles","Climate zones: tropical, polar, desert, temperate","Biomes, world rivers, mountain ranges, landmarks","Globalisation, trade, world population and migration","Seven continents, five oceans, lines of latitude and longitude, hemispheres","World's major countries, capital cities and their locations","World climate zones: tropical, arid, temperate, polar — causes and characteristics","World physical geography: major mountain ranges, rivers, deserts, rainforests","Global patterns: population, development, trade, migration, interdependence"]},
    {id:"physical",       name:"Physical Geography",          emoji:"🏔️", minAge:7,
     desc:"Weather, landscapes, rivers and natural processes",
     levels:["Weather types, measuring, recording data","Landscapes: mountains, valleys, coasts, rivers","River formation, erosion, deposition, flooding","Volcanoes, earthquakes, tectonic plates","Climate change: causes, effects, action","Rivers: source, tributaries, meanders, floodplains, erosion and deposition","Mountains: formation, types (fold, block, volcanic), high-altitude biomes","Coasts: erosion features — cliffs, arches, stacks; deposition — beaches, spits","Glaciation: ice ages, glaciers, U-valleys, corries, moraines, fjords","Weather systems: depressions, anticyclones, fronts, precipitation formation"]},
    {id:"human",          name:"Human Geography",             emoji:"🏙️", minAge:7,
     desc:"Settlement, land use, trade and economic activity",
     levels:["Differences between villages, towns, cities","Land use types: farming, industry, leisure, housing","How settlements grow and change over time","Trade links, economic activity, imports/exports","Migration, population, global development issues","Settlement patterns: site and situation, villages, towns, cities, megacities","Land use: residential, commercial, industrial, rural — change over time","Economic activity: primary, secondary, tertiary, quaternary sectors","Trade and globalisation: supply chains, interdependence, fair trade, TNCs","Development: GDP, HDI, development gap, aid vs trade debate"]},
    {id:"maps",           name:"Maps & Fieldwork",            emoji:"🗺️", minAge:5,
     desc:"Map reading, grid references and fieldwork skills",
     levels:["Simple maps, symbols, compass N/S/E/W","4-figure grid references, map keys and scale","6-figure grid references, contour lines, OS maps","Interpreting Ordnance Survey maps, aerial photographs","GIS, satellite imagery, fieldwork data collection","Compass points (8), simple grid references on OS maps, key map symbols","4-figure grid references, scale, measuring distances, contour lines","6-figure grid references, interpreting contour patterns for relief","OS map skills: identifying land use, planning routes, measuring areas","GIS and digital mapping: Google Maps, data layers, spatial analysis"]},
    {id:"environment",    name:"Environmental Geography",     emoji:"🌿", minAge:8,
     desc:"Climate change, sustainability and environmental action",
     levels:["How humans use and change the environment","Pollution: air, water, land — causes and effects","Deforestation, desertification, habitat loss","Climate change: greenhouse gases, rising temperatures","Sustainability, renewable energy, global solutions","Deforestation: causes, effects on biodiversity and climate, sustainable forestry","Climate change: greenhouse gases, evidence, effects on physical and human systems","Renewable vs non-renewable energy: comparison, advantages, disadvantages","Water cycle and water security: scarcity, management, sustainable use","Sustainable development goals: measuring progress, global vs local action"]},
    {id:"fieldwork",      name:"Fieldwork & Local Study",     emoji:"🔭", minAge:7,
     desc:"Observing, recording and analysing the local area",
     levels:["Observe and describe features of local area","Simple surveys and data collection outside","Map own school grounds, use compasses","Land use survey, traffic count, questionnaires","Analyse results, draw conclusions, geographical argument","Data collection methods: tallies, questionnaires, sketches, photographs, measurements","Analysing fieldwork data: bar charts, scatter graphs, maps, annotated sketches","Presenting fieldwork findings: written reports, posters, digital presentations","Evaluating fieldwork: reliability, improvements, comparing data sets","Independent geographical investigation: design, conduct, analyse, conclude, evaluate"]},
  ],

  // ── 11+ Preparation (Age 10-11) ──────────────────────────────────────
  "11+ Verbal Reasoning": [
    {id:"vr_words",      name:"Word Relationships",    emoji:"🔤", minAge:10, desc:"Synonyms, antonyms, odd-one-out", levels:["Synonyms and antonyms","Word categories and odd one out","Analogies: word pairs","Hidden words and word connections","Complex verbal deductions","Advanced synonyms and antonyms at 11+ level vocabulary","Complex analogies: semantic relationships, abstract connections","Word classification: odd-one-out with abstract categories","Hidden words, connected words, compound word patterns","Complex verbal deductions: multiple-step reasoning with words"]},
    {id:"vr_codes",      name:"Codes & Sequences",     emoji:"🔣", minAge:10, desc:"Letter codes, number sequences", levels:["Simple A=1 number codes","Letter shift codes","Complex coding patterns","Mixed code types","Multi-step code breaking","Multi-step letter codes: A=1 type with offsets and reversals","Complex shift codes: variable shifts, mirror codes","Number sequence codes: arithmetic and geometric within codes","Mixed type codes: letter-number combinations","Timed code-breaking: speed and accuracy under exam conditions"]},
    {id:"vr_logic",      name:"Logic & Deductions",    emoji:"🧩", minAge:10, desc:"If/then reasoning, true/false", levels:["Simple true/false from statements","Two-step deductions","Multi-clue logic puzzles","Contradictions and validity","Complex argument evaluation","Multi-statement logical deductions: true/false/cannot say","Logical sequences: complete the series with abstract reasoning","Family relationship problems: multi-step family trees","Spatial and ordering logic: who sits where, what order","Complex multi-variable logic puzzles: 11+ style exam questions"]},
    {id:"vr_comprehension",name:"Comprehension",       emoji:"📖", minAge:10, desc:"Advanced reading comprehension", levels:["Main idea identification","Inference from text","Author's purpose and tone","Evaluating evidence","Critical analysis of argument","11+ style extended reading passages with inference questions","Author's language choices: effect, connotation, technique","Evaluating texts: comparing two passages, identifying bias","Complex inference and deduction from literary extracts","Timed comprehension under exam conditions with full mark scheme"]},
      {id:"vr_spelling", name:"Spelling & Word Structure", emoji:"✏️", minAge:9,
     desc:"Spot spelling mistakes and apply word structure rules",
     levels:["Identify misspelled word from 4 options: Year 3-4 list","Correct the spelling in a sentence context","Homophones: which spelling is correct here?","Prefixes: identify correctly spelled prefixed word","Suffixes: which suffix makes a real word?","Silent letters and double letters: common patterns","Year 5-6 statutory spelling list words","Etymology: Latin and Greek root spelling patterns","Word families: find the correctly spelled related word","Speed spelling: 20 words timed, GL exam style"]},
],
  "11+ Non-Verbal Reasoning": [
    {id:"nvr_patterns",  name:"Pattern Recognition",   emoji:"🔷", minAge:10, desc:"Sequences and matrices", levels:["Simple shape sequences","2x2 pattern matrices","3x3 pattern matrices","Complex rotation patterns","Multi-rule pattern completion","Complete the sequence: 6-item series with two rules","Matrix completion: 3x3 grids with two simultaneous rules","Analogy matrices: abstract shape relationships","Complex rotation and reflection patterns combined","Full 11+ NVR paper: mixed question types under timed conditions"]},
    {id:"nvr_shapes",    name:"Shape Transformations", emoji:"📐", minAge:10, desc:"Rotation, reflection, nets", levels:["Reflection and rotation basics","Nets of 3D shapes","Paper folding and unfolding","3D cube rotations","Complex spatial reasoning","Nets of all 5 Platonic solids: identify and construct","Complex paper folding: multiple folds with punch holes","3D rotation: visualise rotated 3D objects from 2D views","Similar and congruent shapes: identify from complex sets","Plans and elevations: front, side and top views of 3D shapes"]},
    {id:"nvr_codes",     name:"Symbol Codes",          emoji:"⬛", minAge:10, desc:"Shape-based codes and rules", levels:["One-feature rules","Two-feature codes","Three-feature codes","Complex shape codes","Multi-rule deductions","Two-feature shape codes: identify rules for each feature","Three-feature codes: size, shading, position, number, rotation","Four-feature codes: most complex NVR code type","Mixed code types: sequences within codes","Full exam practice: timed NVR code papers with marking"]},
      {id:"nvr_odd_one_out", name:"Odd One Out", emoji:"🔍", minAge:9,
     desc:"Which shape is the odd one out and why?",
     levels:["Odd one out by shading: one shape has different fill","Odd one out by type: one is not a polygon","Odd one out by number of sides","Odd one out by symmetry: one lacks a line of symmetry","Odd one out by size relative to others","Odd one out by internal feature position","Two possible odd ones out: explain which and why","Abstract odd one out: complex overlapping rules","Verbal odd one out linked to visual reasoning","CEM style mixed odd one out under timed conditions"]},
],
  "11+ Maths": [
    {id:"11m_number",    name:"Number Operations",     emoji:"🔢", minAge:10, desc:"Advanced arithmetic and number theory", levels:["Multi-step calculations","Factors, multiples, primes","Fractions decimals percentages","Ratio and proportion","Algebra and problem solving","Efficient mental methods: breaking apart, compensation, working backwards","Negative numbers: four operations, order of operations, BIDMAS","Prime factorisation: HCF and LCM using Venn diagrams","Fractions, decimals, percentages: fluent conversion and comparison","Algebra: form and solve equations, substitution, sequences, nth term"]},
    {id:"11m_shape",     name:"Shape & Space",         emoji:"📐", minAge:10, desc:"Geometry, area, volume, angles", levels:["Area and perimeter of polygons","Volume of cuboids","Circle calculations (pi)","Angles in parallel lines","Coordinate geometry","Area of circles, sectors, composite shapes involving circles","Volume and surface area: cuboids, cylinders, prisms","Angle proofs: parallel lines, polygons, circle theorems intro","Coordinates: midpoints, distance, linear graphs y=mx+c","Similarity and congruence: scale factors, proof, applications"]},
    {id:"11m_data",      name:"Data & Statistics",     emoji:"📊", minAge:10, desc:"Charts, averages, probability", levels:["Mean, median, mode, range","Pie charts and bar charts","Probability fractions","Frequency tables","Complex data interpretation","Averages from frequency tables, choosing appropriate average","Scatter graphs: correlation, lines of best fit, interpolation","Probability: sample space diagrams, Venn diagrams, tree diagrams","Complex data interpretation: multiple charts, comparing distributions","Statistical reasoning: hypothesis, sample size, bias, conclusions"]},
  ],  Computing: [
    {id:"algorithms",     name:"Algorithms & Sequencing",     emoji:"🔢", minAge:5,
     desc:"Step-by-step instructions, sequences and logic",
     levels:["Step-by-step instructions for everyday tasks","Sequences: what order, what happens next","Loops: repeating actions to save steps","Conditions: if this, then that — decisions","Nested loops, complex conditions, algorithm design","Algorithms in everyday life: recipes, instructions, directions, rules","Flowcharts: sequence, selection (if/else), iteration (loops)","Decomposition: breaking problems into smaller manageable parts","Pattern recognition: finding similarities to solve new problems efficiently","Abstraction: identifying and focusing on essential information only"]},
    {id:"coding",         name:"Programming",                 emoji:"💻", minAge:6,
     desc:"Creating programs using Scratch-style block coding",
     levels:["Simple sequences in Scratch: move, turn, sound","Events: when key pressed, when sprite clicked","Loops: repeat, forever, count-controlled","Variables: store and change data in programs","Functions, parameters, debugging complex programs","Scratch: sequences, events, motion, looks — simple animated story","Scratch: loops (repeat, forever), conditionals (if/if-else), variables","Python intro: print, input, variables, arithmetic, string operations","Python: if/elif/else statements, while and for loops, functions","Python: lists, dictionaries, file handling, debugging, commenting"]},
    {id:"networks",       name:"Networks & The Internet",     emoji:"🌐", minAge:7,
     desc:"How the internet works, websites and communication",
     levels:["What is the internet? Computers connected globally","The World Wide Web, websites, search engines","How email works, digital communication forms","How data travels: packets, routers, IP addresses","Cloud computing, cybersecurity, HTTPS and encryption","What is the internet: routers, packets, IP addresses, DNS","World Wide Web vs internet: HTTP, URLs, web browsers, search engines","Network hardware: routers, switches, servers, clients, Wi-Fi, Ethernet","Cybersecurity: threats — malware, phishing, hacking; defences — firewalls, encryption","Communication technology: email protocols, VoIP, streaming, cloud computing"]},
    {id:"data",           name:"Data & Information",          emoji:"📊", minAge:6,
     desc:"Collecting, organising and presenting data",
     levels:["Data: information we collect, store and use","Binary: computers use 0s and 1s, pixels","Spreadsheets: entering, sorting, filtering data","Charts and graphs from data, patterns and trends","Databases, big data, data analysis and ethics","Data types: text, numbers, images, sound — how computers store each","Binary: counting in binary, converting to/from decimal, bytes and bits","Data storage: file sizes, compression, lossless vs lossy, cloud storage","Databases: records, fields, queries, sorting, filtering, spreadsheet databases","Big data: what it is, how it's collected, uses, privacy implications"]},
    {id:"esafety",        name:"E-Safety & Digital Literacy", emoji:"🛡️", minAge:5,
     desc:"Staying safe online, personal information and rights",
     levels:["Personal information: what is private, who to tell","Cyberbullying: recognise, report, how to help","Reliable information: not everything online is true","Passwords, privacy settings, safe browsing","Digital footprint, copyright, responsible use","Personal information: what to keep private online, why privacy matters","Cyberbullying: recognise, respond, report — bystander responsibility","Online reliability: evaluating websites, fake news, checking sources","Digital footprint: what you leave online, how it's used, permanence","Screen time, wellbeing, healthy habits: balance, sleep, relationships"]},
    {id:"creative",       name:"Creative Computing",          emoji:"🎨", minAge:7,
     desc:"Creating digital content: art, music, video, presentations",
     levels:["Create digital artwork using painting tools","Create simple animations frame by frame","Record and edit audio, podcasts, voice overs","Create multimedia presentations with images and sound","Design websites, video editing, digital publishing","Digital art: using drawing tools, layers, colour, saving in different formats","Digital audio: recording, editing, importing, exporting, copyright","Video production: filming, editing, transitions, captions, publishing","Web design: HTML basics, structure, CSS styling, publishing a simple page","App design: planning, wireframing, prototyping, user testing, iteration"]},
  ],
};

const US_CURRICULUM = {
  Math: [
    {id:"counting",       name:"Counting & Cardinality",      emoji:"🔢", minAge:5,
     desc:"Count to 100, compare numbers, understand quantity — Kindergarten",
     levels:["Count to 20, one-to-one correspondence, cardinality","Count to 100, count on from any number, compare groups","Skip count by 2s, 5s, 10s, even and odd numbers","Place value to 1,000, compare and order 3-digit numbers","Place value to 1,000,000, rounding, comparing large numbers","Count and compare numbers to 1,000; skip count by 2s, 5s, 10s, 100s","Place value to 10,000: expanded form, comparing, ordering, rounding to 1,000","Place value to 1,000,000: powers of 10, standard and word form","Whole numbers to 1 billion; integers: positive, negative, absolute value","Rational numbers: integers, fractions, decimals on the number line"]},
    {id:"operations",     name:"Operations & Algebraic Thinking",emoji:"➕", minAge:5,
     desc:"Addition, subtraction, multiplication, division — word problems",
     levels:["Add and subtract within 10, word problems with objects","Add/subtract within 20, relate addition to subtraction","Multiplication as equal groups, division as sharing fairly","Multiply/divide within 100, properties of operations","Multi-step word problems, factors, multiples, patterns","Multi-digit multiplication and division, partial products","Decimals: add, subtract, multiply, divide to hundredths","Fractions: all operations, mixed numbers","Ratios, rates, unit rates, proportional reasoning","Integers and rational numbers: all four operations"]},
    {id:"base_ten",       name:"Number & Operations — Base Ten",emoji:"🔟", minAge:5,
     desc:"Place value, multi-digit arithmetic and rounding",
     levels:["Compose/decompose numbers 11-19 using tens and ones","Understand hundreds, add/subtract 2-digit numbers","Round to nearest 10/100, add/subtract within 1,000","Multi-digit multiplication, divide with remainders","Multiply multi-digit numbers, divide 4-digit by 2-digit","Numbers to millions, scientific notation intro","Decimal operations: all four operations, estimation","Powers of 10, exponents, order of operations (PEMDAS)","Rational and irrational numbers, absolute value","Real number system: classify and operate with all types"]},
    {id:"fractions",      name:"Fractions & Decimals",         emoji:"½",  minAge:7,
     desc:"Unit fractions, equivalent fractions, operations",
     levels:["Equal parts of a whole, halves, fourths, thirds","Unit fractions on number line, equivalent fractions","Fractions greater than 1, compare with same denominator","Add/subtract fractions same denominator, multiply by whole","Add/subtract unlike denominators, multiply/divide fractions","Unit fractions and non-unit fractions: parts of whole and set","Equivalent fractions: visual models, number line representations","Compare and order fractions with different denominators","Add and subtract fractions: like and unlike denominators","Multiply and divide fractions: whole numbers, fractions, mixed numbers"]},
    {id:"measurement_us", name:"Measurement & Data",           emoji:"📏", minAge:5,
     desc:"Measuring length, time, money, graphs and data",
     levels:["Order by length/height/weight, above and below","Measure in inches and centimeters, tell time to hour","Measure to nearest quarter inch, bar graphs, picture graphs","Perimeter of polygons, area by counting, time intervals","Convert measurement units, volume, line plots, data analysis","Measurement conversions: metric and customary","Area and perimeter of complex polygons","Volume of rectangular prisms, nets","Surface area and volume of 3D figures","Measurement in real-world problem solving with algebraic thinking"]},
    {id:"geometry_us",    name:"Geometry",                     emoji:"📐", minAge:5,
     desc:"2D/3D shapes, area, perimeter and coordinate plane",
     levels:["Name 2D and 3D shapes, sort by attributes","Partition shapes into equal parts, halves, fourths","Understand perimeter, identify quadrilaterals, area","Lines, angles, symmetry, classify triangles and quadrilaterals","Coordinate plane, graph points, classify 2D figures","Coordinate geometry: all four quadrants","Area: triangles, parallelograms, trapezoids","Angle relationships: supplementary, complementary, vertical","Transformations: translations, reflections, rotations, dilations","Pythagorean theorem, distance formula, geometric proofs"]},
    {id:"number_system",  name:"The Number System",            emoji:"🔣", minAge:9,
     desc:"Factors, multiples, decimals and negative numbers",
     levels:["Factors and multiples, prime and composite numbers","Decimal notation, compare decimals to thousandths","Negative numbers on number line, absolute value","GCF and LCM, fraction/decimal/percent equivalence","Rational numbers, operations with integers","Factors and multiples: GCF, LCM, prime and composite numbers","Rational numbers: add, subtract, multiply, divide positive and negative","Rates, ratios and proportional reasoning: unit rates, equivalent ratios","Percent: meaning, conversions, percent of a number, percent change","Scientific notation: writing, comparing, multiplying and dividing"]},
    {id:"expressions",    name:"Expressions & Equations",      emoji:"📐", minAge:10,
     desc:"Variables, simple equations and inequalities",
     levels:["Understand variables, evaluate expressions","Write and solve one-step equations","Write and graph inequalities","Dependent and independent variables","Analyse patterns, represent relationships","Write and evaluate numerical expressions: order of operations, parentheses","Variables: write expressions and equations with variables","Equivalent expressions: combine like terms, distributive property","Solve one-step equations: addition, subtraction, multiplication, division","Solve two-step equations and inequalities; graph solutions on number line"]},
  ],
  "English Language Arts": [
    {id:"reading_lit",    name:"Reading — Literature",         emoji:"📚", minAge:5,
     desc:"Key ideas, story structure, character and theme",
     levels:["Retell stories, identify characters, setting, events","Ask and answer questions, central message, lesson","Describe characters and how they affect the story","Determine theme, summarise, compare stories and myths","Quote accurately, compare themes, analyse how chapters fit","Ask and answer questions about key details in literary texts","Determine theme or central message; describe how characters respond to challenges","Compare and contrast characters, settings, or events using details from text","Determine theme and summarise; analyse character development over a story","Cite textual evidence; analyse how characters, setting, plot interact"]},
    {id:"reading_info",   name:"Reading — Informational Text", emoji:"📰", minAge:5,
     desc:"Main idea, text features and author's purpose",
     levels:["Identify main topic, key details, connections","Ask and answer questions, identify main idea, retell","Determine main idea, explain how reasons support it","Determine main idea, explain how examples support it","Quote text, determine main idea, explain author's purpose","Identify main topic and key details in informational texts","Determine main idea and key details; explain how author supports points","Explain how key details support the main idea; compare two texts on same topic","Determine main idea; explain how it is supported by key details; summarise","Cite textual evidence; determine two or more main ideas; analyse text structure"]},
    {id:"foundational",   name:"Foundational Reading Skills",  emoji:"🔤", minAge:4,
     desc:"Phonics, phonological awareness and reading fluency",
     levels:["Phonemic awareness: rhyme, syllables, initial sounds","Letter-sound relationships, decode CVC words","Vowel teams, blends, digraphs, sight words 100","R-controlled vowels, prefixes/suffixes, fluency grade 2","Multisyllabic words, fluency with grade 3 texts","Phonics: consonant blends, digraphs, long vowel patterns, syllable types","Decoding multisyllabic words: prefixes, suffixes, root words, syllabication","Fluency: read grade-level text with accuracy, appropriate rate, expression","Vocabulary strategies: context clues, word relationships, reference materials","Academic vocabulary: domain-specific words, figurative language, connotations"]},
    {id:"writing_us",     name:"Writing",                      emoji:"✏️", minAge:5,
     desc:"Opinion, informational and narrative writing",
     levels:["Write name, draw and write about topics","Write opinion with reason, informational, narrative","Write opinion with multiple reasons, informational reports","Write structured opinion, informational, narrative essays","Research-based writing, precise language, clear structure","Opinion writing: introduce topic, state opinion, supply reasons, provide conclusion","Informative writing: introduce topic, develop with facts and definitions, conclude","Narrative writing: establish situation, introduce narrator/characters, sequence events","Research-based writing: gather information from multiple sources, cite sources","Extended argument: claim, counterclaim, evidence, analysis, formal style"]},
    {id:"speaking",       name:"Speaking & Listening",         emoji:"🗣️", minAge:5,
     desc:"Collaborative discussions and presentations",
     levels:["Participate in conversations, follow rules for discussion","Build on others' talk, ask clarifying questions","Determine main ideas, report on topics clearly","Engage in discussion, report on topics with facts","Adapt speech for context, present claims, multimedia","Participate in collaborative discussions: listen, take turns, stay on topic","Report on a topic using facts and details; speak clearly at understandable pace","Summarise texts read aloud; identify reasons and evidence a speaker provides","Present claims and findings sequentially; use appropriate facts and details","Adapt speech to context: formal presentations, evidence-based discussions"]},
    {id:"language_us",    name:"Language & Grammar",           emoji:"📝", minAge:5,
     desc:"Grammar conventions, vocabulary and figurative language",
     levels:["Print letters, capitalisation, end punctuation","Nouns, verbs, adjectives, commas in series","Irregular nouns/verbs, adjectives, adverbs, commas","Relative pronouns/adverbs, progressive verbs, modifiers","Perfect verbs, shifts in verb tense, correlative conjunctions","Nouns, pronouns, verbs, adjectives, adverbs: identify and use correctly","Capitalization, punctuation, spelling: commas, apostrophes, quotation marks","Sentence variety: simple, compound, complex; subordinating conjunctions","Formal vs informal English; correct shifts in verb tense; pronoun agreement","Subject-verb agreement; active vs passive voice; mood — indicative, imperative"]},
  ],
  Science: [
    {id:"earth_space_us", name:"Earth & Space Science",        emoji:"🌍", minAge:5,
     desc:"Weather, Earth materials, solar system — NGSS aligned",
     levels:["Weather patterns: sunny, rainy, snowy, seasonal changes","Earth materials: rocks, soil, water — properties and uses","Earth's surface: mountains, valleys, plains, water bodies","Solar system: sun, moon, planets, Earth's rotation","Earth processes: erosion, weathering, water cycle, fossils","Weather and climate: temperature, precipitation, wind; patterns and prediction","Earth's materials: rocks, soil, water; properties, uses, natural resources","Earth's systems: lithosphere, hydrosphere, atmosphere, biosphere interactions","Earth's history: fossils, rock layers, continental drift, geological time","Space systems: Earth-Moon-Sun; solar system; stars; universe scale and structure"]},
    {id:"life_science",   name:"Life Science",                 emoji:"🌿", minAge:5,
     desc:"Plants, animals, ecosystems and heredity — NGSS aligned",
     levels:["Needs of living things: plants and animals, survival","Life cycles: plants, insects, frogs, birds","Ecosystems: food chains, habitats, interdependence","Heredity: traits from parents, variation, adaptation","Natural selection, evolution evidence, biodiversity","Organisms and environments: basic needs, habitats, adaptations, food webs","Life cycles and traits: inherited and acquired traits, reproduction strategies","Ecosystems: energy flow, matter cycling, biodiversity, human impact","Heredity and evolution: variation, natural selection, fossil evidence","Body systems: structure and function of major human body systems"]},
    {id:"physical_sci",   name:"Physical Science",             emoji:"⚡", minAge:6,
     desc:"Matter, forces, motion and energy — NGSS aligned",
     levels:["Properties of matter: solid, liquid, gas, weight, volume","Forces and motion: pushes/pulls, speed, direction","Energy: light, heat, sound, electrical — forms and transfer","Waves: light and sound properties, communication","Chemical reactions, conservation of matter, energy transfer","Matter: properties, states, physical vs chemical changes, mixtures, solutions","Forces and motion: push/pull, speed, gravity, friction, balanced/unbalanced forces","Energy: forms, transfer, conservation; sound, light, heat, electricity","Waves: properties of light and sound waves; electromagnetic spectrum","Engineering design: define problem, brainstorm solutions, test, evaluate, improve"]},
    {id:"engineering",    name:"Engineering Design",           emoji:"🔧", minAge:6,
     desc:"Define problems, design solutions, test and improve",
     levels:["Identify a problem, brainstorm and choose a solution","Build and test a model, improve based on results","Define criteria and constraints, compare solutions","Optimise solutions, communicate results scientifically","System thinking, trade-offs, societal impact of solutions","Engineering design process: identify problem, criteria and constraints","Generate and test solutions: prototyping, fair testing, iteration","Materials properties in engineering: choosing right material for function","Simple machines: lever, pulley, inclined plane, wheel and axle, screw, wedge","Systems thinking: inputs, outputs, feedback, optimising complex systems"]},
  ],
  "Social Studies": [
    {id:"community",      name:"Community & Citizenship",      emoji:"🏘️", minAge:5,
     desc:"Rules, rights, responsibilities and community roles",
     levels:["Classroom and school rules, why we have them","Community helpers: police, firefighters, doctors, teachers","Rights and responsibilities at home, school, community","Local government: mayor, city council, how decisions made","State and national government, Constitution, Bill of Rights","Roles in community: family, school, neighbourhood, local government","Rules and laws: why we have them, how they are made, rights and responsibilities","Community helpers and workers: services, goods, supply and demand basics","Local government: mayor, city council, services provided, civic participation","Communities across America: urban, suburban, rural; how geography shapes life"]},
    {id:"us_history",     name:"American History",             emoji:"🦅", minAge:6,
     desc:"Native Americans through Civil Rights Movement",
     levels:["Native American peoples: culture, traditions, regions","Colonial America: Pilgrims, Jamestown, 13 colonies","American Revolution: causes, key figures, Declaration of Independence","Civil War: slavery, Lincoln, battles, abolition, Reconstruction","Civil Rights Movement: segregation, MLK, Rosa Parks, legislation","Native Americans: major tribes, cultures, traditions, relationship with land","European exploration and colonisation: Columbus, Pilgrims, 13 Colonies, reasons","American Revolution: causes, Declaration of Independence, key figures, outcome","Constitution and early republic: founding documents, branches of government","Westward expansion: Manifest Destiny, Oregon Trail, impact on Native Americans"]},
    {id:"world_hist_us",  name:"World History",                emoji:"🌐", minAge:8,
     desc:"Ancient civilisations to modern global events",
     levels:["Ancient Egypt, Greece, Rome: achievements and legacy","Medieval world: feudalism, Crusades, Black Death, Islam","Age of Exploration: Columbus, conquistadors, colonisation","Industrial Revolution, imperialism, World War 1","World War 2, Cold War, decolonisation, modern global issues","Ancient civilisations: Mesopotamia, Egypt, Greece, Rome — achievements and legacy","Medieval world: feudalism, Islamic Golden Age, Crusades, Black Death","Renaissance and Reformation: humanism, scientific revolution, religious change","Age of exploration and colonisation: trade routes, empires, cultural exchange","Industrial Revolution: causes, effects on society, workers, cities, global trade"]},
    {id:"us_geography",   name:"US Geography",                 emoji:"🇺🇸", minAge:6,
     desc:"50 states, regions, physical features and human geography",
     levels:["Cardinal directions, map symbols, continents and oceans","US regions: Northeast, Southeast, Midwest, Southwest, West","50 states and capitals, major physical features","US climate zones, rivers (Mississippi), mountain ranges","US population, cities, economic regions, immigration patterns","US regions: Northeast, Southeast, Midwest, Southwest, West — features and culture","Physical features of the US: Rocky Mountains, Mississippi River, Great Plains","US climate zones: factors affecting climate, regional differences","Human geography: population patterns, immigration, urbanisation, land use","US in the world: trade, alliances, foreign policy, global interdependence"]},
    {id:"world_geo_us",   name:"World Geography",              emoji:"🌍", minAge:7,
     desc:"Continents, countries, cultures and world issues",
     levels:["7 continents, 5 oceans, major countries and capitals","Physical geography: biomes, climate zones, landforms","Human geography: population, urbanisation, migration","Cultural diversity: language, religion, customs worldwide","Global issues: trade, climate, conflict, interdependence","World regions: identify major world regions on maps, key physical features","Population geography: where people live, why, migration patterns","Cultural geography: language, religion, traditions, cultural diffusion","Economic geography: developed vs developing nations, resources, trade patterns","Environmental geography: human impact, climate zones, natural disasters, sustainability"]},
    {id:"economics_us",   name:"Economics & Financial Literacy",emoji:"💵", minAge:7,
     desc:"Needs vs wants, money, trade and economic systems",
     levels:["Needs vs wants, goods and services, making choices","Earning, spending, saving, importance of budgeting","Supply and demand, producers and consumers, markets","Trade: imports, exports, comparative advantage, global trade","Economic systems, entrepreneurship, personal finance","Scarcity and choice: needs vs wants, opportunity cost, making decisions","Supply and demand: how prices are set, market economy basics","Producers and consumers: specialisation, trade, interdependence","Money and banking: saving, borrowing, interest, budgeting basics","Government's economic role: taxes, public goods, economic systems comparison"]},
      {id:"11m_algebra", name:"Algebra & Equations", emoji:"🔡", minAge:9,
     desc:"Form and solve equations to find unknowns",
     levels:["Missing number: □ + 7 = 15, find the value","Simple equations: x + 5 = 12, solve for x","Two-step equations: 2x + 3 = 11, solve for x","Equations with brackets: 3(x + 2) = 15","Word problems: form and solve an equation","Substitution: find value when n=3 in expressions","Function machines: two-step, find input or output","Sequences and nth term: find the formula","Simultaneous equations: x + y = 10, x - y = 2","Multi-step algebraic word problems: GL exam style"]},
    {id:"11m_worded", name:"Multi-Step Word Problems", emoji:"📝", minAge:9,
     desc:"Real-world problems requiring multiple calculation steps",
     levels:["Single-operation word problems: choose the right operation","Two-step problems: e.g. total cost with change","Ratio word problems: share an amount in given ratio","Percentage problems: discount, profit and loss","Speed distance time: find the missing variable","Time problems: intervals, timetables, before and after","Money problems: bills, VAT, best value comparisons","Mixture problems: combining different rates or prices","Geometry word problems: apply formulae in context","Full GL/CEM mock: 50 questions in 50 minutes timed"]},
],
  Computing: [
    {id:"comp_thinking",  name:"Computational Thinking",       emoji:"🧠", minAge:5,
     desc:"Decomposition, patterns, abstraction and algorithms",
     levels:["Break problems into steps, spot patterns in sequences","Decompose complex tasks, identify what to ignore","Algorithm design, precise unambiguous instructions","Generalise solutions, evaluate efficiency of solutions","Abstraction in code, modelling real-world problems","Decomposition: break complex problems into smaller steps","Pattern recognition: find repeated elements to create efficient solutions","Abstraction: remove unnecessary detail, focus on what matters","Algorithms: write precise step-by-step instructions for solving problems","Evaluation: test solutions, identify errors, improve and optimise"]},
    {id:"programming_us", name:"Programming",                  emoji:"💻", minAge:6,
     desc:"Creating programs in Scratch and text-based languages",
     levels:["Scratch: sequences, events, motion and sounds","Scratch: loops, conditions, variables","Scratch: functions/sprites, simple games and stories","Python/JS introduction: variables, loops, conditions","Functions, lists, debugging, sharing and collaborating","Scratch: sequences, events, loops, basic game or animation","Scratch: variables, conditionals, user input, more complex projects","Python basics: print, variables, input, arithmetic, string formatting","Python: conditionals, loops, functions, simple programs with purpose","Python: lists, file I/O, modules, debugging, commenting, documentation"]},
    {id:"networks_us",    name:"Networks & The Internet",      emoji:"🌐", minAge:7,
     desc:"How the internet works and digital communication",
     levels:["Devices connect to share information, basic network","The internet vs World Wide Web, search effectively","Email, messaging, video calls — digital communication tools","How websites work: HTML basics, DNS, IP addresses","Cybersecurity: threats, protection, staying safe online","Internet basics: packets, routers, IP addresses, how data travels","Web vs internet: HTTP, browsers, URLs, search engines, how websites work","Cybersecurity: passwords, phishing, malware, how to stay safe online","Privacy: data collection, cookies, personal information, digital rights","Network infrastructure: client-server, cloud computing, IoT, future internet"]},
    {id:"data_us",        name:"Data & Analysis",              emoji:"📊", minAge:6,
     desc:"Collecting, visualising and interpreting data",
     levels:["Collect and organise data, tally charts, pictographs","Spreadsheets: enter and sort data, simple charts","Create graphs, identify patterns and outliers","Database queries, filtering and sorting complex data","Statistical thinking, bias in data, ethical data use","Binary: bits and bytes, counting in binary, representing data","Data types: text, numbers, images, audio — how computers store information","Spreadsheets: entering data, formulas, sorting, filtering, basic charts","Databases: tables, records, fields, queries, sorting, relational databases","Data science: collecting, cleaning, analysing, visualising, interpreting data"]},
    {id:"digital_citizen",name:"Digital Citizenship",          emoji:"🛡️", minAge:5,
     desc:"Online safety, privacy and responsible technology use",
     levels:["Personal information: private vs public, trusted adults","Cyberbullying: recognise, respond, report, empathy","Media balance, screen time, healthy technology habits","Privacy settings, strong passwords, phishing awareness","Digital footprint, copyright, fair use, credibility of sources","Online identity: usernames, privacy settings, what to share and not share","Cyberbullying: recognise, respond, report; be an upstander not bystander","Media literacy: evaluate websites, identify fake news, check sources","Copyright and fair use: creative commons, citing sources, plagiarism","Screen time and wellbeing: balanced technology use, healthy digital habits"]},
    {id:"impacts",        name:"Impacts of Computing",         emoji:"🤖", minAge:8,
     desc:"How technology shapes society, AI and the future",
     levels:["How computers help us: medicine, transport, communication","Automation: jobs technology does, jobs humans do","Artificial intelligence: what it is, examples in daily life","Social media: benefits, risks, misinformation, mental health","Ethical computing: bias, accessibility, environmental impact","Positive impacts of technology: healthcare, communication, education, accessibility","Negative impacts: job displacement, addiction, environment, digital divide","Artificial intelligence: what it is, how it works, examples in daily life","Algorithmic bias: how algorithms can be unfair, who is responsible","Future of technology: emerging trends, ethical questions, citizen responsibility"]},
  ],
};

const CA_CURRICULUM = {
  Mathematics: [
    {id:"number_sense",   name:"Number Sense",                 emoji:"🔢", minAge:4,
     desc:"Counting, place value, fractions and operations — Ontario aligned",
     levels:["Count to 50, subitize groups, compare quantities (Kindergarten)","Numbers to 200, place value, addition/subtraction to 20","Numbers to 1000, multiplication/division patterns, fractions","Multi-digit operations, fractions on number line, decimals intro","Operations with fractions and decimals, ratios, proportional reasoning","Number relationships to 10,000, rounding strategies","Mental math: compensation, friendly numbers","Integers: meaning, ordering, adding and subtracting","Rational numbers: fractions, decimals, percents","Powers and exponents, order of operations"]},
    {id:"algebra_ca",     name:"Algebra",                      emoji:"🔣", minAge:7,
     desc:"Patterns, relationships, variables and equations",
     levels:["Identify and extend repeating and growing patterns","Describe patterns with tables and rules","Represent patterns with variables, solve simple equations","Linear patterns, algebraic expressions, solving equations","Systems of relationships, algebraic modelling, coding connections","Patterns: identify, describe, extend, create growing and shrinking patterns","Variables: understand variables as placeholders, simple expressions","Linear relationships: tables of values, graphs, equations y=mx+b","Solving equations: one-step, two-step, check by substitution","Algebraic reasoning: model real situations, solve problems, justify solutions"]},
    {id:"data_ca",        name:"Data Literacy",                emoji:"📊", minAge:5,
     desc:"Collecting, organising and interpreting data — statistics",
     levels:["Sort and classify objects, simple graphs (pictographs)","Bar graphs, tally charts, ask questions about data","Stem-and-leaf plots, mean/median/mode intro, bias awareness","Scatter plots, correlation, data collection methods","Statistical reasoning, probability, census vs sample","Collecting and organising data: surveys, experiments","Graphing: double bar, broken line, scatter plot","Measures of central tendency and spread","Probability: theoretical, experimental, tree diagrams","Data analysis: drawing conclusions, making predictions"]},
    {id:"spatial",        name:"Spatial Sense",                emoji:"📐", minAge:5,
     desc:"2D/3D shapes, measurement, location and transformation",
     levels:["Name 2D/3D shapes, describe location, measure length","Perimeter, area basics, angles as turns, coordinate grid","Area of rectangles, volume basics, transformations","Surface area, volume of prisms, Cartesian plane, scale","Pythagorean theorem intro, geometric reasoning, design projects","2D shapes: properties, sorting, identifying in the environment","3D figures: identify, describe properties, nets, views","Location and movement: grid coordinates, transformations","Geometric relationships: angles, parallel, perpendicular, congruence","Measurement and geometry: area, perimeter, surface area, volume connections"]},
    {id:"financial",      name:"Financial Literacy",           emoji:"💰", minAge:6,
     desc:"Money, earning, spending, saving and budgeting",
     levels:["Identify coins and bills, make amounts, simple purchases","Estimate costs, make change, save for a goal","Budgeting: income vs expenses, wants vs needs, planning","Interest, taxes intro, charitable giving, consumer rights","Credit, debt, financial planning, economic citizenship","Money: count coins and bills, make change, compare costs","Budgeting: needs vs wants, making a simple budget, saving goals","Banking basics: accounts, deposits, withdrawals, interest concept","Consumer math: unit price, best buy, taxes, discounts, tipping","Financial literacy: debt, credit, investing basics, economic choices"]},
    {id:"social_emo",     name:"Social-Emotional Learning",    emoji:"❤️", minAge:5,
     desc:"Growth mindset, problem-solving and resilience in learning",
     levels:["I can learn from mistakes, try different strategies","Identify helpful vs unhelpful thinking, persist with challenges","Reflect on learning, seek help, collaborate on problems","Manage frustration, set goals, monitor own learning","Self-advocacy, mentor others, contribute to math community","Self-awareness: identifying emotions, strengths, areas for growth","Social skills: listening, cooperation, conflict resolution, empathy","Goal setting: SMART goals, planning, persisting through challenges","Decision making: consequences, values, responsible choices","Community and global citizenship: rights, responsibilities, contributing"]},
  ],
  Language: [
    {id:"reading_ca",     name:"Reading",                      emoji:"📖", minAge:4,
     desc:"Phonics, decoding, fluency and comprehension — Ontario",
     levels:["Letter sounds, phonemic awareness, 45 core phonemes, CVC words","Blending and segmenting, common sight words, simple books","Fluency with grade-level texts, monitor comprehension","Text features, main idea, inference, author's craft","Critical literacy, comparing perspectives, synthesising across texts","Reading strategies: predict, connect, visualise, question, infer, determine importance","Reading comprehension: retell, identify main idea, make inferences from text","Reading for purpose: fiction vs non-fiction, author's intent, text features","Critical literacy: whose voice is heard, what perspectives are missing","Independent reading: self-select texts, monitor comprehension, read widely"]},
    {id:"writing_ca",     name:"Writing",                      emoji:"✏️", minAge:5,
     desc:"Narrative, expository, persuasive and multimedia writing",
     levels:["Write simple sentences about familiar topics with pictures","Paragraph structure, narrative with beginning/middle/end","Multi-paragraph writing, persuasive letters, research reports","Complex narratives, formal/informal register, citation basics","Extended essays, argument writing, multimedia composition","Writing process: brainstorm, plan, draft, revise, edit, publish","Narrative writing: personal narrative, fiction, descriptive details, voice","Informational writing: research, note-taking, organise, cite sources","Persuasive writing: opinion, reasons, evidence, counter-argument, call to action","Writing for real purposes: letters, blogs, scripts, multi-modal texts"]},
    {id:"oral",           name:"Oral Communication",           emoji:"🗣️", minAge:4,
     desc:"Listening, speaking, discussion and presentation skills",
     levels:["Follow simple instructions, speak in full sentences, listen actively","Small group discussion, take turns, ask relevant questions","Present information clearly, active listening strategies","Formal presentations, debate, adjusting for audience and purpose","Lead discussions, evaluate effectiveness, interview techniques","Active listening: focus, ask questions, respond respectfully","Speaking clearly: volume, pace, eye contact, appropriate vocabulary","Collaborative discussion: build on others' ideas, disagree respectfully","Oral presentation: prepare, practise, use visuals, handle questions","Media communication: podcast, video, digital storytelling, audiences"]},
    {id:"media_ca",       name:"Media Literacy",               emoji:"📱", minAge:6,
     desc:"Analyse, create and evaluate media texts — digital literacy",
     levels:["Identify different types of media, messages in advertising","Identify point of view in media, create simple media texts","Analyse how media constructs meaning, audience awareness","Evaluate credibility of online sources, responsible creation","Media and identity, algorithmic bias, ethical media production","Identify types of media: print, digital, audio, video, social media","Analyse media messages: purpose, audience, techniques used to persuade","Evaluate media: reliability, bias, representation, stereotypes","Create media texts: plan, produce, reflect on purpose and audience","Media and society: how media shapes culture, values, identity, democracy"]},
  ],
  "Science & Technology": [
    {id:"life_systems",   name:"Life Systems",                 emoji:"🌿", minAge:5,
     desc:"Plants, animals, human body, habitats and ecosystems",
     levels:["Needs of living things, parts of plants, animals and habitats","Life cycles of plants and animals, growth and change","Human body systems, nutrition, health and well-being","Ecosystems: food chains, biotic/abiotic, biodiversity","Population dynamics, human impact on ecosystems, conservation","Characteristics of living things: cells, growth, response, reproduction","Plant systems: roots, stems, leaves, flowers — structure and function","Animal systems: digestive, circulatory, respiratory, skeletal, nervous","Ecosystems: food webs, energy flow, biodiversity, interdependence","Sustainability: human impact on ecosystems, conservation, stewardship"]},
    {id:"matter_ca",      name:"Matter & Materials",           emoji:"🧪", minAge:5,
     desc:"Properties of materials, states of matter and changes",
     levels:["Properties of materials, sort by: hard/soft, magnetic","States of matter: solid, liquid, gas, observable changes","Physical vs chemical changes, mixtures, solutions","Particle model, changes of state, heat and temperature","Atomic structure basics, periodic table intro, chemical reactions","Properties of matter: physical properties, measuring, comparing materials","States of matter: solid, liquid, gas — particle model, changing states","Pure substances vs mixtures: elements, compounds, mechanical mixtures, solutions","Chemical vs physical change: evidence, reversibility, new substances","Atomic theory: atoms, elements, periodic table basics, chemical bonding intro"]},
    {id:"energy_ca",      name:"Energy & Control",             emoji:"⚡", minAge:7,
     desc:"Forces, motion, electricity, light and sound",
     levels:["Push/pull forces, magnets attract/repel, simple machines","Electricity: circuits, series, safety, conductors/insulators","Light: sources, reflection, refraction, colour spectrum","Sound: vibrations, pitch, volume, how sound travels","Forms of energy, energy transformation, conservation of energy","Forms of energy: mechanical, thermal, light, sound, electrical, chemical","Energy transfer and transformation: follow energy through a system","Heat energy: conduction, convection, radiation, insulators and conductors","Light and optics: reflection, refraction, colour, lenses and mirrors","Electricity and magnetism: circuits, electromagnets, generators, renewable energy"]},
    {id:"structures",     name:"Structures & Mechanisms",      emoji:"🏗️", minAge:6,
     desc:"Simple machines, structures, forces and design process",
     levels:["Strong shapes in structures, build stable structures","Simple machines: lever, pulley, wheel, ramp, screw","Mechanical advantage, gears, pneumatics and hydraulics","Design process: identify, design, build, test, improve","Complex structures, loads, materials engineering, systems","Structures in nature and built environment: identify function and design","Forces on structures: load, tension, compression, torsion, shear","Properties of materials: strength, flexibility, hardness for structural use","Design process: identify need, design, build, test, evaluate, improve","Sustainable design: environmental impact, materials choice, life cycle"]},
    {id:"earth_ca",       name:"Earth & Space Systems",        emoji:"🌍", minAge:6,
     desc:"Rocks, water cycle, weather, climate and solar system",
     levels:["Rocks and minerals, soil formation, erosion","Water cycle: evaporation, condensation, precipitation","Weather patterns, climate vs weather, Canadian climate regions","Solar system, moon phases, Earth's rotation and revolution","Climate change, human impact, sustainability, Indigenous knowledge","Weather: measuring, recording, predicting; instruments and meteorology","Water cycle: evaporation, condensation, precipitation, collection, groundwater","Rocks and minerals: types, formation, properties, identification, uses","Soils: composition, formation, properties, importance to ecosystems","Climate change: causes, evidence, effects in Canada, global solutions"]},
  ],
  "Social Studies": [
    {id:"canadian",       name:"Canadian Heritage & Identity", emoji:"🍁", minAge:6,
     desc:"First Nations, colonial history, Confederation and modern Canada",
     levels:["My community: home, school, neighbourhood, local leaders","First Nations peoples: diverse cultures, traditions, land relationships","New France and British colonisation: fur trade, conflict, cultural exchange","Confederation 1867: Fathers of Confederation, why Canada united","WW1, WW2, peacekeeping: Canada's role and contribution","Indigenous peoples of Canada: First Nations, Métis, Inuit — culture and contributions","Early Canadian history: explorers, New France, British colonisation, Confederation","Canadian identity: multiculturalism, Charter of Rights, official languages","Canadian government: federal, provincial, municipal — roles and responsibilities","Canada in the world: NATO, UN, peacekeeping, trade, foreign policy"]},
    {id:"ca_geography",   name:"Canadian Geography",           emoji:"🗺️", minAge:5,
     desc:"Provinces, territories, physical features and regions",
     levels:["Province and territory names and capitals on a map","Natural regions: Canadian Shield, Prairies, Rockies, Arctic","Physical features: Great Lakes, St. Lawrence, Rocky Mountains","Climate regions, natural resources, Indigenous territories","Population distribution, urbanisation, regional identity","Canada's regions: Atlantic, Central, Prairie, Pacific, Northern — features and resources","Physical geography: Canadian Shield, Rocky Mountains, Great Lakes, rivers","Natural resources: forestry, mining, agriculture, oil — sustainability","Population geography: distribution, urbanisation, immigration, diversity","Environmental geography: climate zones, ecosystems, conservation in Canada"]},
    {id:"world_hist_ca",  name:"World History & Global Geography",emoji:"🌐", minAge:7,
     desc:"Ancient civilisations, exploration and global connections",
     levels:["Ancient civilisations: Egypt, Greece, Rome, China, Mesopotamia","Medieval world: feudalism, Islam, trade routes, Black Death","Age of Exploration: European contact, colonisation and its impacts","Industrial Revolution, imperialism, WW1 and WW2 global impact","Cold War, decolonisation, United Nations, modern global issues","Ancient civilisations: contributions to science, arts, governance, philosophy","Medieval and early modern world: feudalism, trade routes, religious change","European contact and colonisation: impact on Indigenous peoples worldwide","Industrial Revolution: causes, effects on work, cities, environment globally","Modern world history: WWI, WWII, Cold War, decolonisation, globalisation"]},
    {id:"government_ca",  name:"Government & Citizenship",     emoji:"⚖️", minAge:7,
     desc:"Democratic government, rights, responsibilities and law",
     levels:["Rules vs laws, class rules, school community decisions","Municipal government: mayor, councillors, local services","Provincial government: Premier, MPPs, how laws are made","Federal government: Prime Minister, Parliament, Constitution","Canadian Charter of Rights and Freedoms, Indigenous rights, treaties","Rules and laws: why communities need them, how they protect rights","Local government: how it works, services provided, how to participate","Provincial and federal government: roles, responsibilities, how bills become law","Democracy and voting: rights, responsibilities, how elections work in Canada","Global governance: United Nations, international law, Canada's global role"]},
    {id:"economics_ca",   name:"Economics & Sustainable Development",emoji:"🌱", minAge:7,
     desc:"Resources, trade, financial literacy and sustainability",
     levels:["Needs vs wants, goods and services, producers and consumers","Natural resources: renewable vs non-renewable, responsible use","Trade: why Canada trades, imports/exports, major trading partners","Economic systems, entrepreneurship, Indigenous economic models","Sustainable development goals, green economy, global responsibility","Needs and wants: scarcity, choice, opportunity cost in daily life","Canadian economy: sectors, major industries, trade partners, labour market","Entrepreneurship: innovation, risk, reward, social enterprise","Global economics: trade, interdependence, fair trade, development","Financial decisions: budgeting, saving, investing, understanding debt"]},
    {id:"global_issues",  name:"Global Issues & Perspectives", emoji:"🌐", minAge:9,
     desc:"Sustainability, climate, human rights and global connections",
     levels:["Global citizenship: rights and responsibilities worldwide","Climate change: causes, effects, Canadian and global action","Poverty and inequality: causes, solutions, international aid","Conflict, peacekeeping and the UN: Canada's role","Sustainable Development Goals, activism, making a difference","Human rights: Universal Declaration, examples of violations, advocacy","Poverty and inequality: causes, effects, organisations working for change","Environmental sustainability: climate change, biodiversity loss, solutions","Migration and refugees: causes, experiences, responsibility, policy","Global citizenship: taking action locally, nationally and globally"]},
  ],
  "Computer Studies": [
    {id:"comp_think_ca",  name:"Computational Thinking",       emoji:"🧠", minAge:5,
     desc:"Algorithms, decomposition, patterns and problem-solving",
     levels:["Follow and give step-by-step instructions, spot patterns","Decompose problems, identify what information is needed","Design algorithms, evaluate different solutions","Generalise solutions, use abstraction to simplify problems","Model complex problems, optimise solutions, evaluate efficiency","Decomposition: break problems into parts, identify steps in daily processes","Abstraction: identify essential information, create simplified models","Algorithms: write clear instructions, identify errors, improve solutions","Pattern recognition: identify repeating elements, apply to new problems","Debugging: find and fix errors systematically, test and verify solutions"]},
    {id:"coding_ca",      name:"Coding & Programming",         emoji:"💻", minAge:6,
     desc:"Scratch, Python and block-based programming",
     levels:["Scratch: sequences, events, sprites and backdrops","Scratch: loops, conditionals, variables, simple games","Python intro: print, input, variables, if/else statements","Python: loops, functions, lists, debug and test programs","Projects: create original programs, collaborate, present code","Scratch: sequences, events, motion, basic interactive program","Scratch: loops, conditionals, variables, interactive game or story","Python: print, variables, input, arithmetic, string manipulation","Python: if/elif/else, for/while loops, functions with parameters","Python: lists, file handling, modules, commenting, collaborative projects"]},
    {id:"digital_cit_ca", name:"Digital Citizenship",          emoji:"🛡️", minAge:5,
     desc:"Online safety, privacy, wellbeing and responsible use",
     levels:["Personal information safety, trusted adults, reporting concerns","Cyberbullying: recognition, empathy, bystander responsibility","Screen time balance, mental health, healthy digital habits","Critical thinking online: misinformation, advertising, algorithms","Privacy rights, digital footprint, responsible content creation","Digital identity: managing your online presence, privacy settings","Cyberbullying: recognise, respond, report; creating positive online culture","Information literacy: evaluating digital sources, fact-checking, citations","Copyright and intellectual property: creating and respecting original work","Digital wellbeing: screen time, sleep, relationships, healthy technology use"]},
    {id:"data_ca2",       name:"Data Literacy & Computing",    emoji:"📊", minAge:7,
     desc:"Collecting, analysing and presenting data ethically",
     levels:["Collect and record data, simple graphs and charts","Spreadsheets: sort, filter, create charts from data","Statistical thinking: mean, median, bias, sampling","Database design, queries, analysis of large data sets","Ethical data use, privacy, AI and machine learning basics","Data collection: surveys, experiments, observations — organising data","Data representation: bar graphs, line graphs, pictographs, circle graphs","Binary and data storage: how computers represent information","Spreadsheets: entering, sorting, filtering, formulas, creating charts","Data privacy: how companies collect data, rights, protecting personal information"]},
  ],
};

// ── Active curriculum selector ────────────────────────────────────────────
// Returns the curriculum for the child's country
// UK National Curriculum Computing — was missing entirely despite
// Computing games and the Computing hub category existing.
UK_CURRICULUM_COMPUTING_FIX: {
  UK_CURRICULUM.Computing = [
    {id:"algorithms",     name:"Algorithms & Logic",       emoji:"🧩", minAge:5,
     desc:"Understanding and creating step-by-step instructions",
     levels:["Follow simple instructions in order","Create simple algorithms for everyday tasks","Debug simple algorithms, predict outcomes","Sequence, selection and repetition in algorithms","Design algorithms with variables and conditions","Decompose problems into smaller parts","Compare algorithms for efficiency","Logical reasoning to detect and correct errors","Searching and sorting algorithm concepts","Algorithm design: flowcharts, pseudocode, evaluation"]},
    {id:"programming",    name:"Programming",              emoji:"💻", minAge:6,
     desc:"Writing and debugging programs",
     levels:["Give a device simple commands","Create simple programs with blocks","Use repetition (loops) in programs","Use selection (if/then) in programs","Use variables to store and change values","Combine loops, selection and variables","Write programs with inputs and outputs","Design, write and debug modular programs","Work with procedures and functions","Plan, build and evaluate complete projects"]},
    {id:"data_info",      name:"Data & Information",       emoji:"📊", minAge:6,
     desc:"How computers store, organise and present data",
     levels:["Sort objects into groups","Create simple pictograms","Collect and record data","Present data in charts and tables","Use branching databases","Search and sort data in a database","Understand how data is stored as binary intro","Design a database with fields and records","Interpret and question data critically","Data modelling and spreadsheet formulas"]},
    {id:"online_safety",  name:"Online Safety & Networks", emoji:"🛡️", minAge:5,
     desc:"Staying safe online and understanding the internet",
     levels:["Know to tell a trusted adult about worries online","Keep personal information private","Recognise kind and unkind online behaviour","Understand passwords and why they matter","Know what to do about unkind messages","Understand the internet as connected computers","Evaluate whether online content is trustworthy","Understand digital footprints","Recognise persuasive design and fake content","Networks, the web, and safe responsible use"]},
  ];
}

function getCurriculum(country) {
  if(country === "US") return US_CURRICULUM;
  if(country === "CA") return CA_CURRICULUM;
  return UK_CURRICULUM; // default to UK
}
// The subjects a child ACTUALLY studies, named as their country names them.
// (US: Math/ELA/Social Studies; CA: Mathematics/Language/Science & Technology.)
function subjectsFor(country) {
  return Object.keys(getCurriculum(country||"UK")).filter(s=>!s.startsWith("11+"));
}

// Subject names per country
const SUBJECT_NAMES = {
  UK: ["Maths","English","Science","History","Geography","Computing","11+ Verbal Reasoning","11+ Non-Verbal Reasoning","11+ Maths"],
  US: ["Math","English Language Arts","Science","Social Studies","Computing"],
  CA: ["Mathematics","Language","Science & Technology","Social Studies","Computer Studies"],
};

// Canonical subjects for display (maps to country-specific names)
function getSubjects(country) {
  return SUBJECT_NAMES[country] || SUBJECT_NAMES.UK;
}

// Legacy CURRICULUM for backward compatibility
const CURRICULUM = UK_CURRICULUM;


// Subject-style aliases: every country's subject names must resolve
SUB["Math"]=SUB["Math"]||SUB.Maths;
SUB["Mathematics"]=SUB["Mathematics"]||SUB.Maths;
SUB["English Language Arts"]=SUB["English Language Arts"]||SUB.English;
SUB["Language"]=SUB["Language"]||SUB.English;
SUB["Science & Technology"]=SUB["Science & Technology"]||SUB.Science;
SUB["Social Studies"]=SUB["Social Studies"]||SUB.History;
SUB["Computer Studies"]=SUB["Computer Studies"]||SUB.Computing;

const YEAR = {
  UK:{4:"Reception",5:"Year 1",6:"Year 2",7:"Year 3",8:"Year 4",9:"Year 5",10:"Year 6",11:"Year 6"},
  US:{4:"Kindergarten",5:"Grade 1",6:"Grade 1",7:"Grade 2",8:"Grade 3",9:"Grade 4",10:"Grade 5",11:"Grade 5"},
  CA:{4:"Kindergarten",5:"Grade 1",6:"Grade 2",7:"Grade 3",8:"Grade 4",9:"Grade 5",10:"Grade 6",11:"Grade 6"},
};
const TUTORS = {
  Sparky:{emoji:"⚡",color:C.amber,light:C.aLight,anim:"bounceY 1.1s ease-in-out infinite",
    tagline:"Let's GO! Learning is the best adventure!",
    style:"energetic and enthusiastic. Short punchy sentences. Exclamation marks. Celebrate every win loudly.",
    voice:{rate:0.85,pitch:1.2}},
  Pip:{emoji:"🦉",color:C.violet,light:C.vLight,anim:"floatY 2s ease-in-out infinite",
    tagline:"Every question is a little discovery...",
    style:"gentle and curious. Warm storytelling. Say hmm and interesting. Make the child feel safe.",
    voice:{rate:0.78,pitch:1.0}},
};
const AVATARS = [
  {id:"fox",e:"🦊"},{id:"panda",e:"🐼"},{id:"lion",e:"🦁"},{id:"penguin",e:"🐧"},
  {id:"dragon",e:"🐲"},{id:"unicorn",e:"🦄"},{id:"cat",e:"🐱"},{id:"dog",e:"🐶"},
  {id:"rabbit",e:"🐰"},{id:"bear",e:"🐻"},{id:"frog",e:"🐸"},{id:"owl",e:"🦉"},
];
const BADGES = [
  {id:"first",   name:"First Step",      emoji:"🌟",check:p=>p.total>=1},
  {id:"streak3", name:"On a Roll",        emoji:"🔥",check:p=>p.streak>=3},
  {id:"streak7", name:"Weekly Warrior",   emoji:"⚡",check:p=>p.streak>=7},
  {id:"streak30",name:"Monthly Legend",   emoji:"👑",check:p=>p.streak>=30},
  {id:"xp100",   name:"Century Club",     emoji:"💯",check:p=>p.xp>=100},
  {id:"xp500",   name:"XP Legend",        emoji:"🏆",check:p=>p.xp>=500},
  {id:"acc80",   name:"Sharp Mind",       emoji:"🎯",check:p=>p.total>=20&&p.correct/p.total>=0.8},
  {id:"maths3",  name:"Maths Star",       emoji:"🔢",check:p=>p.level.Maths>=3},
  {id:"eng3",    name:"Word Wizard",      emoji:"📖",check:p=>p.level.English>=3},
  {id:"sci3",    name:"Science Whiz",     emoji:"🔬",check:p=>p.level.Science>=3},
  {id:"q50",     name:"Halfway Hero",     emoji:"🏅",check:p=>p.total>=50},
  {id:"q100",    name:"Centurion",        emoji:"🎖️",check:p=>p.total>=100},
  {id:"allSubs", name:"All-Rounder",      emoji:"🌈",check:p=>(p.subsTried||[]).length>=3},
  {id:"perfect", name:"Perfectionist",    emoji:"✨",check:p=>(p.bestStreak||0)>=10},
  {id:"gamer",   name:"Game On",          emoji:"🎮",check:p=>(p.gamesPlayed||0)>=1},
  {id:"speed",   name:"Speed Demon",      emoji:"💨",check:p=>(p.gamesBeat||0)>=1},
  {id:"gamePro", name:"Game Master",      emoji:"🕹️",check:p=>(p.gamesPlayed||0)>=9},
];

// ── STORAGE ───────────────────────────────────────────────────────────────
const SK = "adapt:v1";
async function loadData(userId) {
  try {
    const {data,error} = await supabase.from("adapt_data").select("payload").eq("user_id",userId).single();
    if(error||!data) return null;
    return data.payload;
  } catch(e) { console.error("loadData",e); return null; }
}
async function saveData(userId, d) {
  try {
    await supabase.from("adapt_data").upsert({user_id:userId,payload:d,updated_at:new Date().toISOString()});
  } catch(e) { console.error("saveData",e); }
}

// ── UTILS ─────────────────────────────────────────────────────────────────
const shuffle = a => [...a].sort(() => Math.random() - 0.5);

// Endless level system
function getDifficultyLabel(level) {
  if(level <= 3)  return {label:"Beginner", color:"#16A34A", emoji:"🟢"};
  if(level <= 6)  return {label:"Easy",     color:"#CA8A04", emoji:"🟡"};
  if(level <= 10) return {label:"Medium",   color:"#EA580C", emoji:"🟠"};
  if(level <= 15) return {label:"Hard",     color:"#DC2626", emoji:"🔴"};
  if(level <= 20) return {label:"Very Hard",color:"#9333EA", emoji:"🔥"};
  return               {label:"Expert",    color:"#0EA5E9", emoji:"⚡"};
}

function getLevelContext(level) {
  if(level <= 3)  return "very simple beginner level content";
  if(level <= 6)  return "easy content, building basic understanding";
  if(level <= 10) return "medium difficulty, requiring good understanding";
  if(level <= 15) return "hard content, testing deep knowledge";
  if(level <= 20) return "very hard, advanced content near top of curriculum";
  return               "expert level, most challenging content possible";
}
const calcXP   = (score, max) => Math.round(20 + (score / max) * 30);

// ── CLAUDE API ────────────────────────────────────────────────────────────

// Higher token limit for lesson generation
async function claudeLesson(system, msg) {
  for(let attempt=0; attempt<=2; attempt++) {
    try {
      const r = await fetch("/api/chat",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:3500,
          system,
          messages:[{role:"user",content:msg||"Generate the lesson now. Return ONLY valid JSON."}]
        }),
      });
      if(!r.ok){await new Promise(res=>setTimeout(res,1200));continue;}
      const d = await r.json();
      const t = d.content?.find(b=>b.type==="text")?.text||"";
      const clean = t.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      const s=clean.indexOf("{"), e=clean.lastIndexOf("}");
      if(s===-1||e===-1){await new Promise(res=>setTimeout(res,1000));continue;}
      const stripMd=(o)=>{ // model sometimes embeds ``` or ** — never show them to a child
        if(typeof o==="string")return o.replace(/```[a-z]*\n?/g,"").replace(/\*\*/g,"").replace(/^#+\s*/gm,"");
        if(Array.isArray(o))return o.map(stripMd);
        if(o&&typeof o==="object"){const r={};for(const k in o)r[k]=stripMd(o[k]);return r;}
        return o;
      };
      try {
        const parsed = stripMd(JSON.parse(clean.slice(s,e+1)));
        // Validate it has the required fields
        if(parsed?.slides?.length>=3) return parsed;
        if(attempt<2) continue;
        return parsed; // return what we have on last attempt
      } catch(pe) {
        try {
          const fixed=clean.slice(s,e+1)
            .replace(/,\s*}/g,"}").replace(/,\s*]/g,"]")
            .replace(/\n/g," ").replace(/\t/g," ");
          const parsed = stripMd(JSON.parse(fixed));
          if(parsed?.slides?.length>=3||attempt===2) return parsed;
        } catch(e2){if(attempt<2)continue;}
      }
    } catch(e){await new Promise(res=>setTimeout(res,800));continue;}
  }
  return null;
}

async function claude(system, msg, retries=2) {
  for(let attempt=0; attempt<=retries; attempt++) {
    try {
      const r = await fetch("/api/chat",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:2000,system,
          messages:[{role:"user",content:msg||"Generate the content now."}]}),
      });
      if(!r.ok){if(attempt<retries){await new Promise(res=>setTimeout(res,1000));continue;}return null;}
      const d = await r.json();
      const t = d.content?.find(b=>b.type==="text")?.text||"";
      const clean = t.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      const s=clean.indexOf("{"),e=clean.lastIndexOf("}");
      if(s===-1||e===-1){if(attempt<retries)continue;return null;}
      try {
        return JSON.parse(clean.slice(s,e+1));
      } catch(pe) {
        try {
          const fixed=clean.slice(s,e+1).replace(/,\s*}/g,"}").replace(/,\s*]/g,"]");
          return JSON.parse(fixed);
        } catch(e2){if(attempt<retries)continue;return null;}
      }
    } catch(e){if(attempt<retries){await new Promise(res=>setTimeout(res,800));continue;}return null;}
  }
  return null;
}

const diagSys = (name,age,country,year,subject) =>
  `You are ADAPT, friendly AI tutor. ONE diagnostic question.
Child: ${name}, age ${age}, ${country} (${year}), Subject: ${subject}
Language: ${age<=6?"Very simple, max 1 short sentence":"Clear and friendly 1-2 sentences"}
Return ONLY valid JSON no markdown:
{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"A","explanation":"simple 1-sentence","difficulty":"easy"}`;


const YEAR_GROUP_CONTENT = {
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

function getYearGroupContent(child, subject) {
  const country = child.country||"UK";
  const yg = child.yearGroup||YEAR[country]?.[child.age]||"Year 3";
  return YEAR_GROUP_CONTENT[country]?.[yg]?.[subject]||null;
}

const sessionSys = (child, subject, topic, mode, sC, sT, askedQs=[]) => {
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
2. Vocabulary suitable for age ${child.age} only
3. Examples from a ${child.age}-year-old's everyday life in ${country}
4. ${lang} throughout
${easier?"5. Simplify — child struggling. Add a hint.":""}${harder?"5. Slightly more challenging — still within ${yearGroup}":""}

Do NOT repeat: ${askedQs.slice(-8).join(" | ")||"none yet"}
Vary formats: multiple choice, true/false, fill-blank, word problems, spot-mistake

Return ONLY valid JSON:
{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"A","explanation":"brief, ${child.tutor} style","hint":"${easier?"helpful hint":""}","encouragement":"short cheer","difficulty":"${topicLevel<=3?"easy":topicLevel<=7?"medium":"hard"}"}`;
};


// ── SPEECH ────────────────────────────────────────────────────────────────
function cleanForSpeech(text) {
  return text
    .replace(/_+/g, " blank ")
    .replace(/[A-D]\)\s*/g, "")
    .replace(/[*#`>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
// ── Voice quality: score every available voice, pick the warmest ──
// Devices ship several voices and default to a poor one. Modern
// "Enhanced"/"Natural"/Google network voices sound like a kind teacher;
// the old local robots do not. (The previous code preferred LOCAL
// voices, which on Android actively chose the robot over the good
// Google voice — the main reason it sounded bad there.)
function scoreVoice(v){
  const n=(v.name||"");
  let s=0;
  if(/enhanced|premium|natural|neural/i.test(n)) s+=100;   // modern high-quality tiers
  if(/^Google UK English/i.test(n)) s+=92;                  // Chrome/Android network voices
  if(/^Google US English/i.test(n)) s+=88;
  if(/Samantha|Karen|Daniel|Moira|Tessa|Serena|Martha|Kate/i.test(n)) s+=80; // good Apple voices
  if(/eSpeak|compact/i.test(n)) s-=60;                      // known robots
  if(v.lang==="en-GB") s+=30;
  else if(v.lang==="en-US") s+=26;
  else if((v.lang||"").startsWith("en")) s+=18;
  if(v.localService) s+=3;                                  // tiny tiebreak only — never decisive
  return s;
}
function pickBestVoice(voices){
  if(!voices||!voices.length) return null;
  return [...voices].sort((a,b)=>scoreVoice(b)-scoreVoice(a))[0];
}

function speak(text, tutorName) {
  if(!("speechSynthesis" in window)) return;
  if(A11Y_LIVE.current.noAudio||SOUND_PREF.muted) return; // needs or preference: silent
  window.speechSynthesis.cancel();
  const cleaned = cleanForSpeech(text);
  const u = new SpeechSynthesisUtterance(cleaned);
  const v = TUTORS[tutorName]?.voice || {rate:0.88, pitch:1.05};
  // Calm for children: never fast, always slightly warm
  u.rate = Math.min(v.rate ?? 0.88, 0.9);
  u.pitch = Math.min(Math.max(v.pitch ?? 1.05, 1.0), 1.15);
  u.volume = 1;
  const go = () => {
    window.speechSynthesis.onvoiceschanged = null;
    const pick = pickBestVoice(window.speechSynthesis.getVoices());
    if(pick) u.voice = pick;
    window.speechSynthesis.speak(u);
  };
  window.speechSynthesis.getVoices().length > 0 ? go() : (window.speechSynthesis.onvoiceschanged = go);
}

// ── UTILS ─────────────────────────────────────────────────────────────────
const uid=()=>typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);

function checkBadges(child) {
  const earned=[...(child.badges||[])];
  const newOnes=[];
  for(const b of BADGES) if(!earned.includes(b.id)&&b.check(child)){earned.push(b.id);newOnes.push(b.id);}
  return {badges:earned,newBadge:newOnes[0]||null};
}

// ── UI PRIMITIVES ─────────────────────────────────────────────────────────
function Btn({children,onClick,disabled,v="primary",style={}}) {
  const vars={
    primary:{background:`linear-gradient(135deg,${C.primary},#6366F1)`,color:"#fff",border:"none",boxShadow:`0 4px 18px ${C.primary}55`},
    ghost:{background:"transparent",color:C.text,border:`2px solid ${C.border}`,boxShadow:"none"},
    danger:{background:C.red,color:"#fff",border:"none",boxShadow:`0 4px 14px ${C.red}33`},
    success:{background:C.green,color:"#fff",border:"none",boxShadow:`0 4px 14px ${C.green}33`},
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:"13px 22px",borderRadius:14,fontSize:15,fontWeight:800,fontFamily:F,
        cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,
        display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,
        transition:"all 0.15s ease",...vars[v],...style}}
      onMouseOver={e=>{if(!disabled)e.currentTarget.style.transform="translateY(-2px)"}}
      onMouseOut={e=>{e.currentTarget.style.transform=""}}>
      {children}
    </button>
  );
}

function Card({children,style={},onClick}) {
  return (
    <div onClick={onClick}
      style={{background:C.surface,borderRadius:20,padding:"18px 20px",
        border:`1px solid ${C.border}`,boxShadow:"0 4px 20px rgba(79,70,229,0.08)",
        cursor:onClick?"pointer":"default",transition:onClick?"all 0.15s":undefined,...style}}
      onMouseOver={e=>{if(onClick)e.currentTarget.style.transform="translateY(-2px)"}}
      onMouseOut={e=>{if(onClick)e.currentTarget.style.transform=""}}>
      {children}
    </div>
  );
}

function Screen({children,pad=true}) {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#F0F4FF 0%,#EFF6FF 50%,#F5F0FF 100%)",fontFamily:F,display:"flex",
      justifyContent:"center",padding:pad?"20px 16px 60px":"0",animation:"fadeUp 0.3s ease"}}>
      <div style={{maxWidth:480,width:"100%"}}>{children}</div>
    </div>
  );
}

const Lbl=({c})=><p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8}}>{c}</p>;
const BackBtn=({onClick})=><button onClick={onClick} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:14,fontWeight:700,color:C.muted,padding:"8px 0",display:"flex",alignItems:"center",gap:4,fontFamily:F,marginBottom:16}}>← Back</button>;

function TutorChar({name,size=72,noAnim=false}) {
  const t=TUTORS[name]; if(!t) return null;
  return <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,background:`linear-gradient(145deg,${t.light},#fff)`,border:`3px solid ${t.color}35`,boxShadow:`0 4px 20px ${t.color}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.48,animation:noAnim?undefined:t.anim}}>{t.emoji}</div>;
}

function Bubble({text,tutor,style={}}) {
  const t=TUTORS[tutor]; if(!t) return null;
  return <div style={{background:t.light,border:`1.5px solid ${t.color}28`,borderRadius:16,padding:"12px 16px",fontSize:15,fontWeight:700,color:C.text,lineHeight:1.6,animation:"pop 0.22s ease",...style}}>{text}</div>;
}

function XPBar({xp}) {
  const lvl=Math.floor(xp/100)+1,pct=xp%100;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:11,fontWeight:800,color:C.primary,minWidth:32}}>Lv.{lvl}</span>
      <div style={{flex:1,height:8,background:C.border,borderRadius:4,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,borderRadius:4,background:`linear-gradient(90deg,${C.primary},#818CF8)`,transition:"width 0.6s ease"}}/>
      </div>
      <span style={{fontSize:11,fontWeight:700,color:C.muted}}>{pct}/100</span>
    </div>
  );
}

function Spinner({color=C.primary}) {
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"48px 0"}}><div style={{width:36,height:36,borderRadius:"50%",border:`3px solid ${C.border}`,borderTop:`3px solid ${color}`,animation:"spin 0.75s linear infinite"}}/><p style={{fontSize:13,color:C.muted,fontWeight:700}}>Thinking...</p></div>;
}

function AvatarCircle({avatar,size=40,color=C.primary}) {
  const a=AVATARS.find(x=>x.id===avatar)||AVATARS[0];
  return <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(145deg,${color}18,${color}08)`,border:`2px solid ${color}30`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.5}}>{a.e}</div>;
}

function PBar({value,max,color=C.primary,h=8}) {
  const pct=max>0?Math.min(100,(value/max)*100):0;
  return <div style={{width:"100%",height:h,background:C.border,borderRadius:h/2,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,borderRadius:h/2,background:color,transition:"width 0.5s ease"}}/></div>;
}

function Toggle({on,onChange}) {
  return <button onClick={()=>onChange(!on)} style={{width:48,height:26,borderRadius:13,border:"none",cursor:"pointer",background:on?C.green:C.border,transition:"background 0.2s",flexShrink:0,position:"relative"}}><div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?25:3,transition:"left 0.2s"}}/></button>;
}

function BadgeNotif({badgeId,onDone}) {
  const b=BADGES.find(x=>x.id===badgeId); if(!b) return null;
  useEffect(()=>{const t=setTimeout(onDone,3000);return()=>clearTimeout(t);},[]);
  return (
    <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:9999,
      background:C.surface,borderRadius:16,padding:"12px 20px",boxShadow:"0 8px 32px rgba(0,0,0,0.15)",
      border:`2px solid ${C.amber}`,display:"flex",alignItems:"center",gap:12,
      animation:"badgePop 0.5s ease",maxWidth:320,width:"90%"}}>
      <span style={{fontSize:32}}>{b.emoji}</span>
      <div><p style={{fontSize:12,fontWeight:800,color:C.amber}}>New Badge!</p><p style={{fontSize:15,fontWeight:800,color:C.text}}>{b.name}</p></div>
    </div>
  );
}

// ── ANSWER OPTIONS (reused in Diagnostic + Session) ───────────────────────
function Options({options,correct,selected,answered,onAnswer}) {
  const A=useGameA11y();
  const cols = ["#E53E3E","#3182CE","#D69E2E","#38A169"];
  const isGrid = (options?.length||0) === 4 && !A.largeTapTargets;
  return (
    <div style={{display:"grid",gridTemplateColumns:isGrid?"1fr 1fr":"1fr",gap:10}}>
      {options?.map((opt,i)=>{
        const right=opt.charAt(0)===correct,isSel=opt===selected;
        const isCorrect=answered&&right;
        const isWrong=answered&&isSel&&!right;
        const isDim=answered&&!right&&!isSel;
        const col=cols[i%4];
        return (
          <button key={opt} onClick={()=>!answered&&onAnswer(opt)} disabled={answered}
            style={{padding:A.largeTapTargets?"19px 16px":"15px 12px",borderRadius:16,border:"none",
              background:isCorrect?"#22C55E":isWrong?(A.noRedFeedback?"#64748B":"#EF4444"):isDim?"#F1F5F9":`linear-gradient(135deg,${col},${col}DD)`,
              color:isDim?"#94A3B8":"#fff",
              fontSize:(A.largeText?16:14),fontWeight:A.dyslexiaFont?700:900,textAlign:"center",lineHeight:1.4,
              fontFamily:A.dyslexiaFont?FDYS:F,letterSpacing:A.dyslexiaFont?"0.04em":undefined,
              cursor:answered?"default":"pointer",
              opacity:isDim?0.45:1,
              boxShadow:answered?"none":`0 4px 14px ${col}50`,
              transform:isCorrect?"scale(1.04)":isWrong?"scale(0.97)":"scale(1)",
              transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              animation:isCorrect?"correctPop 0.4s cubic-bezier(0.34,1.56,0.64,1)":isWrong?"wrongShake 0.4s ease":"none"}}>
            {isCorrect?"✅ ":isWrong?"❌ ":""}{opt.replace(/^[A-D]\)\s*/,"")}
          </button>
        );
      })}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// SCREENS
// ═════════════════════════════════════════════════════════════════

// ── 1. Welcome ────────────────────────────────────────────────────────────
function Welcome({onParent}) {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#312E81 0%,#4F46E5 40%,#7C3AED 100%)",fontFamily:F,display:"flex",justifyContent:"center",padding:"20px 16px 60px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
      <div style={{position:"absolute",bottom:60,left:-80,width:240,height:240,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
      <div style={{maxWidth:480,width:"100%",paddingTop:60,textAlign:"center",position:"relative",zIndex:1}}>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:24}}>
          {["🔢","📖","🔬","📜","🌍","💻"].map((e,i)=>(
            <div key={i} style={{fontSize:24,animation:`floatY ${2+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.2}s`,opacity:0.85}}>{e}</div>
          ))}
        </div>
        <div style={{fontSize:80,marginBottom:8,filter:"drop-shadow(0 8px 16px rgba(0,0,0,0.3))"}}>🎓</div>
        <h1 style={{fontSize:72,fontWeight:900,color:"#fff",letterSpacing:-3,marginBottom:4,textShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>ADAPT</h1>
        <p style={{fontSize:16,color:"rgba(255,255,255,0.75)",fontWeight:700,marginBottom:28}}>Where every child learns their way</p>
        <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap",marginBottom:40}}>
          {["🧠 AI-Powered","📚 6 Subjects","🎮 12 Games","🇬🇧 🇺🇸 🇨🇦 3 Countries"].map(f=>(
            <span key={f} style={{padding:"6px 14px",borderRadius:50,background:"rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.9)",fontSize:12,fontWeight:800}}>{f}</span>
          ))}
        </div>
        <button onClick={onParent} style={{width:"100%",padding:"22px 24px",borderRadius:22,background:"#fff",border:"none",cursor:"pointer",fontFamily:F,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",transition:"all 0.2s",display:"flex",alignItems:"center",gap:16,textAlign:"left",marginBottom:40}}
          onMouseOver={e=>e.currentTarget.style.transform="translateY(-3px)"}
          onMouseOut={e=>e.currentTarget.style.transform=""}>
          <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#4F46E5,#818CF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>👨‍👩‍👧</div>
          <div>
            <p style={{fontSize:19,fontWeight:900,color:C.text,marginBottom:2}}>Get Started — I'm a Parent</p>
            <p style={{fontSize:13,fontWeight:600,color:C.muted}}>Create your account and set up your child</p>
          </div>
          <span style={{marginLeft:"auto",fontSize:22,color:C.primary}}>›</span>
        </button>
        <div style={{padding:"18px 20px",borderRadius:18,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",backdropFilter:"blur(4px)",textAlign:"left"}}>
          <p style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>How it works</p>
          {["👆 Parent signs up and sets up the account","🎒 Child gets their own username and password","🚀 Child logs in and starts learning straight away"].map((s,i)=>(
            <p key={i} style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.8)",marginBottom:i<2?8:0,lineHeight:1.5}}>{s}</p>
          ))}
        </div>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",fontWeight:700,marginTop:24}}>Free 7-day trial · No credit card needed</p>
        <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:12}}>
          <button onClick={()=>go("privacy_policy")} style={{fontSize:11,color:"rgba(255,255,255,0.35)",background:"none",border:"none",cursor:"pointer",fontFamily:F,textDecoration:"underline"}}>Privacy Policy</button>
          <button onClick={()=>go("terms_of_service")} style={{fontSize:11,color:"rgba(255,255,255,0.35)",background:"none",border:"none",cursor:"pointer",fontFamily:F,textDecoration:"underline"}}>Terms of Service</button>
        </div>
      </div>
    </div>
  );
}

// ── 2. Details (child info) ───────────────────────────────────────────────
function ChildDetails({isParent,initial={},onNext,onBack}) {
  const [name,setName]=useState(initial.name||"");
  const [age,setAge]=useState(initial.age||7);
  const [country,setCountry]=useState(initial.country||"UK");
  const yr=YEAR[country]?.[age]||"";
  return (
    <Screen>
      <div style={{paddingTop:28}}>
        {onBack&&<BackBtn onClick={onBack}/>}
        <Lbl c={isParent?"Child's Details":"About You"}/>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:28}}>
          {isParent?"Tell us about your child":"Tell us about yourself"}
        </h2>
        <Card style={{marginBottom:12}}>
          <Lbl c={isParent?"Child's First Name":"Your Name"}/>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Ella"
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:20,fontWeight:800,
              color:C.text,background:C.bg,outline:"none",
              border:`2px solid ${name?C.primary:C.border}`,transition:"border 0.2s"}}/>
        </Card>
        <Card style={{marginBottom:12}}>
          <Lbl c="Age"/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[4,5,6,7,8,9,10,11].map(a=>(
              <button key={a} onClick={()=>setAge(a)} style={{width:46,height:46,borderRadius:10,fontSize:16,fontWeight:800,cursor:"pointer",transition:"all 0.12s",fontFamily:F,background:age===a?C.pLight:C.bg,border:`2px solid ${age===a?C.primary:C.border}`,color:age===a?C.primary:C.muted}}>{a}</button>
            ))}
          </div>
          {yr&&<p style={{marginTop:10,fontSize:13,fontWeight:800,color:C.primary}}>📚 {yr}</p>}
        </Card>
        <Card style={{marginBottom:32}}>
          <Lbl c="Country"/>
          <div style={{display:"flex",gap:10}}>
            {[["UK","🇬🇧 UK"],["US","🇺🇸 US"],["CA","🇨🇦 Canada"]].map(([c,l])=>(
              <button key={c} onClick={()=>setCountry(c)} style={{flex:1,padding:"12px 6px",borderRadius:10,fontSize:13,fontWeight:800,cursor:"pointer",transition:"all 0.12s",fontFamily:F,background:country===c?C.pLight:C.bg,border:`2px solid ${country===c?C.primary:C.border}`,color:country===c?C.primary:C.muted}}>{l}</button>
            ))}
          </div>
        </Card>
        <Btn onClick={()=>onNext({name:name.trim(),age,country,yearGroup:yr})} disabled={!name.trim()} style={{width:"100%"}}>Continue →</Btn>
      </div>
    </Screen>
  );
}

// ── 3. Avatar ─────────────────────────────────────────────────────────────
function AvatarPick({childName,initial,onNext,onBack}) {
  const [chosen,setChosen]=useState(initial||"fox");
  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <Lbl c="Avatar"/>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:6}}>Pick {childName}'s avatar!</h2>
        <p style={{fontSize:14,color:C.muted,fontWeight:700,marginBottom:24}}>This shows on the leaderboard — just a fun nickname, no real name shown</p>
        <Card style={{marginBottom:28}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
            {AVATARS.map(a=>(
              <button key={a.id} onClick={()=>setChosen(a.id)} style={{width:"100%",aspectRatio:"1",borderRadius:12,fontSize:28,cursor:"pointer",transition:"all 0.15s",border:"none",background:chosen===a.id?C.pLight:"transparent",outline:chosen===a.id?`3px solid ${C.primary}`:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>{a.e}</button>
            ))}
          </div>
        </Card>
        <Btn onClick={()=>onNext(chosen)} style={{width:"100%"}}>Continue →</Btn>
      </div>
    </Screen>
  );
}

// ── 4. Mode Select ────────────────────────────────────────────────────────
function ModeSelect({childName,age,initial,onNext,onBack}) {
  const [mode,setMode]=useState(initial||null);
  const young=age<=6;
  const modes=[
    {id:"traditional",emoji:"📝",label:"Traditional",desc:"Read and answer at your own pace",color:C.primary},
    {id:"audio",emoji:"🎧",label:"Listen & Speak",desc:"Questions read aloud — tap your answer",color:C.sky,rec:young},
    {id:"visual",emoji:"🎨",label:"Visual & Creative",desc:"Questions with AI-generated pictures",color:C.pink},
  ];
  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <Lbl c="Learning Style"/>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:6}}>How does {childName} like to learn?</h2>
        <p style={{fontSize:14,color:C.muted,fontWeight:700,marginBottom:24}}>{young?"💡 For young learners we recommend Listen & Speak":"You can change this any time"}</p>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>
          {modes.map(m=>(
            <button key={m.id} onClick={()=>setMode(m.id)} style={{padding:20,borderRadius:16,cursor:"pointer",textAlign:"left",fontFamily:F,transition:"all 0.15s",background:mode===m.id?`${m.color}10`:C.surface,border:`2px solid ${mode===m.id?m.color:C.border}`,boxShadow:mode===m.id?`0 4px 20px ${m.color}22`:"0 2px 8px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div style={{width:52,height:52,borderRadius:14,fontSize:26,flexShrink:0,background:mode===m.id?`${m.color}18`:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>{m.emoji}</div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <p style={{fontSize:17,fontWeight:800,color:mode===m.id?m.color:C.text}}>{m.label}</p>
                    {m.rec&&<span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:20,background:C.sky,color:"#fff"}}>REC</span>}
                  </div>
                  <p style={{fontSize:13,color:C.muted,fontWeight:600}}>{m.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <Btn onClick={()=>onNext(mode)} disabled={!mode} style={{width:"100%"}}>Continue →</Btn>
      </div>
    </Screen>
  );
}

// ── 5. Character Select ───────────────────────────────────────────────────
function CharSelect({childName,initial,onNext,onBack}) {
  const [chosen,setChosen]=useState(initial||null);
  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <Lbl c="Your Tutor"/>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:6}}>{childName}, pick your tutor!</h2>
        <p style={{fontSize:14,color:C.muted,fontWeight:700,marginBottom:28}}>They'll guide you through every lesson</p>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:32}}>
          {Object.entries(TUTORS).map(([name,t])=>(
            <button key={name} onClick={()=>setChosen(name)} style={{padding:24,borderRadius:20,cursor:"pointer",textAlign:"left",fontFamily:F,transition:"all 0.2s",background:chosen===name?t.light:C.surface,border:`2px solid ${chosen===name?t.color:C.border}`,boxShadow:chosen===name?`0 8px 28px ${t.color}2A`:"0 2px 10px rgba(0,0,0,0.05)"}}>
              <div style={{display:"flex",alignItems:"center",gap:20}}>
                <div style={{width:72,height:72,borderRadius:"50%",flexShrink:0,fontSize:36,background:`linear-gradient(145deg,${t.light},#fff)`,border:`3px solid ${t.color}40`,display:"flex",alignItems:"center",justifyContent:"center",animation:t.anim}}>{t.emoji}</div>
                <div style={{flex:1}}>
                  <p style={{fontSize:22,fontWeight:900,color:chosen===name?t.color:C.text,marginBottom:4}}>{name}</p>
                  <p style={{fontSize:13,color:C.muted,fontWeight:600,lineHeight:1.5}}>{t.tagline}</p>
                </div>
                {chosen===name&&<div style={{width:28,height:28,borderRadius:"50%",background:t.color,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:900}}>✓</div>}
              </div>
            </button>
          ))}
        </div>
        <Btn onClick={()=>onNext(chosen)} disabled={!chosen} style={{width:"100%"}}>Meet {chosen||"your tutor"} →</Btn>
      </div>
    </Screen>
  );
}

// ── 6. Diagnostic Test ────────────────────────────────────────────────────
function Diagnostic({child,onDone}) {
  const a11y=useA11y(child);
  const DSUBS=subjectsFor(child.country); // the child's ACTUAL subjects, in their country's names
  const PER=3,TOTAL=DSUBS.length*PER; // 3 per subject for placement
  const [si,setSi]=useState(0);
  const [qi,setQi]=useState(0);
  const [q,setQ]=useState(null);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  const [ans,setAns]=useState(false);
  const [results,setResults]=useState({});
  const sub=DSUBS[si],overall=si*PER+qi;

  const load=async()=>{
    setLoading(true);setSel(null);setAns(false);
    const r=await claude(diagSys(child.name,child.age,child.country,child.yearGroup,sub),"Generate the diagnostic question.");
    setQ(r);setLoading(false);
    if(child.mode==="audio"&&r) setTimeout(()=>speak(r.question,child.tutor),400);
  };
  useEffect(()=>{load();},[si,qi]);

  const answer=(opt)=>{
    if(ans) return;
    setSel(opt);setAns(true);
    const ok=opt.charAt(0)===q?.correct;
    setResults(r=>({...r,[sub]:{correct:(r[sub]?.correct||0)+(ok?1:0),total:(r[sub]?.total||0)+1}}));
    if(child.mode==="audio") speak((ok?"Correct! ":"Not quite. ")+(q?.explanation||""),child.tutor);
  };

  const next=()=>{
    const nq=qi+1;
    if(nq>=PER){
      if(si+1>=DSUBS.length){
        const levels={};
        DSUBS.forEach(s=>{const r=results[s]||{correct:0,total:PER};levels[s]=r.correct/r.total>=0.8?3:r.correct/r.total>=0.5?2:1;});
        onDone(levels);
      } else {setSi(i=>i+1);setQi(0);}
    } else setQi(n=>n+1);
  };

  const tutor=TUTORS[child.tutor];
  return (
    <Screen>
      <div style={{paddingTop:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <TutorChar name={child.tutor} size={48} noAnim={a11y.noMotion}/>
          <div style={{flex:1}}>
            <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Warm-up · {sub}</p>
            <div style={{display:"flex",gap:4}}>
              {Array.from({length:TOTAL}).map((_,i)=><div key={i} style={{flex:i<overall?"0 0 18px":"0 0 8px",height:6,borderRadius:3,background:i<overall?C.primary:C.border,transition:"all 0.3s"}}/>)}
            </div>
          </div>
        </div>
        <Bubble tutor={child.tutor} text={overall===0?(a11y.noTimers?`Hi ${child.name}! Take your time with each question — there's no rush at all. 🌿`:`Hi ${child.name}! Quick warm-up — no pressure, just try your best! 😊`):`Question ${overall+1} of ${TOTAL} · ${sub}`} style={{marginBottom:16}}/>
        <Card>
          {loading?<Spinner color={tutor.color}/>:q?(
            <div style={{animation:"fadeUp 0.25s ease"}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:6,marginBottom:16,background:SUB[sub]?.light,color:SUB[sub]?.color,padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:800}}>{SUB[sub]?.emoji} {sub}</span>
              <p style={{fontSize:a11y.largeText?22:19,fontWeight:700,color:C.text,lineHeight:1.8,marginBottom:20,fontFamily:a11y.dyslexiaFont?FDYS:F,letterSpacing:a11y.dyslexiaFont?"0.05em":undefined}}>{q.question}</p>
              {child.mode==="audio"&&<button onClick={()=>speak(q.question,child.tutor)} style={{marginBottom:14,padding:"7px 14px",borderRadius:8,cursor:"pointer",border:`2px solid ${tutor.color}`,background:tutor.light,color:tutor.color,fontWeight:800,fontSize:13,fontFamily:F}}>🔊 Hear again</button>}
              <Options options={q.options} correct={q.correct} selected={sel} answered={ans} onAnswer={answer}/>
              {ans&&(
                <div style={{marginTop:16,animation:"pop 0.22s ease"}}>
                  <div style={{padding:"10px 14px",borderRadius:10,marginBottom:12,background:sel?.charAt(0)===q.correct?C.gLight:C.rLight,border:`1px solid ${sel?.charAt(0)===q.correct?C.green:C.red}`}}>
                    <p style={{fontSize:14,fontWeight:700,color:C.text,lineHeight:1.6}}>{sel?.charAt(0)===q.correct?"✓ ":"✗ "}{q.explanation}</p>
                  </div>
                  <Btn onClick={next} style={{width:"100%"}}>{overall+1>=TOTAL?"All done! →":"Next →"}</Btn>
                </div>
              )}
            </div>
          ):(
            <div style={{textAlign:"center",padding:20}}><p style={{color:C.muted,marginBottom:12}}>Couldn't load</p><Btn onClick={load}>Retry</Btn></div>
          )}
        </Card>
      </div>
    </Screen>
  );
}

// ── 7. Child Dashboard ────────────────────────────────────────────────────
function ChildDash({child,isParentView,onSession,onGames,onBadges,onParentView,onMyStats,onSignOut,onChangeAvatar,onLeaderboard,onWeeklyChallenge,children}) {
  const tutor=TUTORS[child.tutor]||TUTORS.sparky;
  const tColor=tutor?.color||C.primary;
  const rank=getRank(child.xp||0);
  const quests=getQuestState(child);
  const questsDone=QUEST_DEFS.filter(d=>quests[d.id]>=d.target).length;
  const hour=new Date().getHours();
  const isBedtime=child.controls?.bedtimeMode&&(hour>=21||hour<7);
  const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  if(isBedtime) return (
    <Screen>
      <div style={{paddingTop:80,textAlign:"center"}}>
        <div style={{fontSize:80,marginBottom:16}}>🌙</div>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:8}}>Time for bed!</h2>
        <p style={{fontSize:15,fontWeight:700,color:C.muted,lineHeight:1.6}}>ADAPT is available between 7am and 9pm.</p>
        <p style={{fontSize:13,fontWeight:600,color:C.muted,marginTop:8}}>See you tomorrow {child.name}! 😴</p>
      </div>
    </Screen>
  );

  return (
    <Screen>
      <div style={{paddingTop:0,paddingBottom:80}}>
        {/* ── Hero Dashboard — the app looks like the game worlds ── */}
        <div style={{background:`linear-gradient(150deg,#1E1B4B 0%,#312E81 42%,${tColor} 130%)`,
          padding:"20px 20px 28px",marginBottom:0,position:"relative",overflow:"hidden",
          borderBottomLeftRadius:30,borderBottomRightRadius:30,boxShadow:"0 10px 34px rgba(30,27,75,0.35)"}}>
          {/* Night sky */}
          {[...Array(16)].map((_,i)=><div key={i} style={{position:"absolute",borderRadius:"50%",pointerEvents:"none",
            width:i%5===0?3:1.6,height:i%5===0?3:1.6,background:"#fff",opacity:0.2+(i%5)*0.09,
            top:`${(i*13+6)%88}%`,left:`${(i*19+4)%96}%`,animation:`twinkle ${1.8+i%4}s ease infinite`}}/>)}
          <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:`radial-gradient(circle,${tColor}33,transparent 70%)`}}/>
          <div style={{position:"absolute",bottom:-60,left:-30,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
          {isParentView&&(
            <div style={{marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:1}}>
              <span style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.8)"}}>👁️ Viewing as {child.name}</span>
              <button onClick={onParentView} style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.8)",background:"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",fontFamily:F,padding:"4px 10px",borderRadius:8}}>← Parent view</button>
            </div>
          )}
          {/* Top row: avatar + streak */}
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              {/* Big avatar */}
              <div style={{width:68,height:68,borderRadius:"50%",background:"rgba(255,255,255,0.14)",
                border:`3px solid ${tColor}`,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:36,boxShadow:`0 0 22px ${tColor}66, 0 4px 20px rgba(0,0,0,0.3)`,
                flexShrink:0}}>
                {(AVATARS||[]).find(a=>a.id===child.avatar)?.e||"🦊"}
              </div>
              <div>
                <p style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.75)",marginBottom:2}}>{greeting} 👋</p>
                <h2 style={{fontSize:28,fontWeight:900,color:"#fff",letterSpacing:"-0.5px"}}>{child.name}</h2>
                <p style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.7)",marginTop:2}}>{child.yearGroup||"Year 3"} · {child.country||"UK"}</p>
              </div>
            </div>
            {/* Streak — animated based on length */}
            <div style={{textAlign:"center",background:"rgba(0,0,0,0.2)",borderRadius:18,padding:"10px 16px",
              border:`2px solid ${(child.streak||0)>=7?"#FCD34D":"rgba(255,255,255,0.25)"}`,
              boxShadow:(child.streak||0)>=7?"0 0 20px rgba(252,211,77,0.4)":"none"}}>
              <p style={{fontSize:(child.streak||0)>=7?26:22,animation:(child.streak||0)>=3?"pulse 2s ease-in-out infinite":"none"}}>
                {(child.streak||0)>=30?"🌟":(child.streak||0)>=14?"💫":(child.streak||0)>=7?"⚡":"🔥"}
              </p>
              <p style={{fontSize:22,fontWeight:900,color:"#fff",lineHeight:1}}>{child.streak||0}</p>
              <p style={{fontSize:9,color:"rgba(255,255,255,0.75)",fontWeight:800,textTransform:"uppercase"}}>day streak</p>
            </div>
          </div>
          {/* XP bar with level goal */}
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.9)"}}>{rank.emoji} {rank.name}</span>
              <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.75)"}}>
                {rank.next?`${rank.toNext} XP to ${rank.next.name}`:"Top rank reached! 🏆"}
              </span>
            </div>
            <div style={{height:10,borderRadius:5,background:"rgba(255,255,255,0.2)",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${rank.next?Math.min(100,Math.round(((child.xp||0)-rank.xp)/(rank.next.xp-rank.xp)*100)):100}%`,borderRadius:5,
                background:"linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0.6))",
                transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow:"0 0 8px rgba(255,255,255,0.6)"}}/>
            </div>
            <p style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)",marginTop:5,textAlign:"center"}}>
              {(child.total||0)} questions answered · {(child.xp||0).toLocaleString()} total XP
            </p>
          </div>
        </div>

        {/* ── Streak milestone banner ── */}
        {child._shieldSaved&&(
          <div style={{margin:"0 16px 12px",padding:"11px 16px",borderRadius:16,
            background:"linear-gradient(135deg,#0EA5E9,#2563EB)",display:"flex",alignItems:"center",gap:10,
            boxShadow:"0 4px 18px rgba(37,99,235,0.35)"}}>
            <span style={{fontSize:24}}>🛡️</span>
            <p style={{fontSize:12.5,fontWeight:900,color:"#fff",lineHeight:1.45}}>
              Streak Shield used! Your {child.streak}-day streak survived a missed day. Shields recharge weekly.
            </p>
          </div>
        )}
        {[7,14,30,100].includes(child.streak||0)&&(
          <div style={{margin:"0 16px 12px",padding:"12px 16px",borderRadius:16,
            background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",
            border:"2px solid #F59E0B",display:"flex",alignItems:"center",gap:12,
            animation:"slideUp 0.5s ease",boxShadow:"0 4px 16px rgba(245,158,11,0.3)"}}>
            <span style={{fontSize:28}}>🎉</span>
            <div>
              <p style={{fontSize:13,fontWeight:900,color:"#92400E"}}>{child.streak} Day Streak Milestone!</p>
              <p style={{fontSize:11,fontWeight:700,color:"#B45309"}}>You're on fire {child.name}! Keep it going!</p>
            </div>
          </div>
        )}
        {/* ── Tutor message ── */}
        <div style={{padding:"0 16px",marginBottom:16}}>
          <Bubble tutor={child.tutor} text={
            (child.streak||0)>=7?`${child.name}, ${child.streak} days in a row — you're absolutely smashing it! 🔥`
            :child.total>0?`Welcome back ${child.name}! Ready to keep learning? 🚀`
            :`Welcome ${child.name}! Your first lesson is ready. Let's discover something amazing! 🎉`
          }/>
        </div>

        {/* ── Your Learning Buddy — ADAPT's heart: it grows from mastery ── */}
        {(()=>{
          const bp=buddyPoints(child);
          const bs=buddyStage(bp);
          const evolved=bs.idx>(child.buddyStageSeen||0);
          return(
            <div style={{margin:"0 16px 16px",padding:"16px",borderRadius:22,position:"relative",overflow:"hidden",
              background:"linear-gradient(150deg,#1E1B4B,#312E81 70%,#4338CA)",
              border:evolved?"2px solid #FFD166":"2px solid rgba(255,255,255,0.1)",
              boxShadow:evolved?"0 6px 28px rgba(255,209,102,0.35)":"0 6px 20px rgba(30,27,75,0.3)"}}>
              {[...Array(8)].map((_,i)=><div key={i} style={{position:"absolute",width:2,height:2,borderRadius:"50%",pointerEvents:"none",
                background:"#fff",opacity:0.3,top:`${(i*23+8)%85}%`,left:`${(i*31+5)%95}%`,animation:`twinkle ${1.8+i%3}s ease infinite`}}/>)}
              {evolved&&<div style={{position:"absolute",top:10,right:12,background:"#FFD166",borderRadius:999,padding:"3px 10px"}}>
                <p style={{fontSize:10,fontWeight:900,color:"#78350F"}}>✨ EVOLVED!</p></div>}
              <div style={{display:"flex",alignItems:"center",gap:14,position:"relative"}}>
                <BuddySprite stage={bs} size={82}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:15,fontWeight:900,color:"#fff"}}>{bs.name}</p>
                  <p style={{fontSize:11.5,fontWeight:700,color:"rgba(255,255,255,0.72)",marginBottom:7,lineHeight:1.4}}>{bs.desc}</p>
                  {bs.next?(<>
                    <div style={{height:7,borderRadius:4,background:"rgba(255,255,255,0.15)",overflow:"hidden",marginBottom:4}}>
                      <div style={{height:"100%",width:`${bs.pct}%`,borderRadius:4,transition:"width 0.8s ease",
                        background:"linear-gradient(90deg,#FFD166,#F0ABFC)"}}/>
                    </div>
                    <p style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.6)"}}>
                      Grows when you beat tricky questions, level up subjects and keep your streak
                    </p>
                  </>):(
                    <p style={{fontSize:11,fontWeight:900,color:"#FFD166"}}>Fully grown — raised by your learning! 🏆</p>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Daily Quests — three goals, one chest, every day ── */}
        <div style={{margin:"0 16px 16px",padding:"14px 16px",borderRadius:20,background:"#fff",
          border:`2px solid ${quests.rewarded?"#F59E0B":C.border}`,
          boxShadow:quests.rewarded?"0 4px 20px rgba(245,158,11,0.25)":"0 4px 16px rgba(15,23,42,0.06)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
            <p style={{fontSize:13,fontWeight:900,color:C.text}}>📅 Today's Quests</p>
            <span style={{fontSize:20,filter:quests.rewarded?"none":"grayscale(1) opacity(0.5)",
              animation:quests.rewarded?"none":questsDone===2?"wiggle 1.2s ease infinite":"none"}}>
              {quests.rewarded?"🎁":"🔒"}
            </span>
          </div>
          {QUEST_DEFS.map(d=>{
            const p=Math.min(quests[d.id]||0,d.target), done=p>=d.target;
            return(
              <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:16,width:22,textAlign:"center",filter:done?"none":"grayscale(0.6)"}}>{done?"✅":d.emoji}</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:800,color:done?"#16A34A":C.text,textDecoration:done?"none":"none"}}>{d.label}</p>
                  <div style={{height:6,borderRadius:3,background:"#F1F5F9",marginTop:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(p/d.target)*100}%`,borderRadius:3,transition:"width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                      background:done?"linear-gradient(90deg,#22C55E,#16A34A)":"linear-gradient(90deg,#818CF8,#6366F1)"}}/>
                  </div>
                </div>
                <span style={{fontSize:11,fontWeight:900,color:done?"#16A34A":C.muted,minWidth:34,textAlign:"right"}}>{p}/{d.target}</span>
              </div>
            );
          })}
          <p style={{fontSize:11,fontWeight:800,color:quests.rewarded?"#B45309":C.muted,textAlign:"center",marginTop:4}}>
            {quests.rewarded?"🎉 Star Snack served — your buddy loved it! +60 XP":`Complete all 3 to earn your buddy's Star Snack · +60 XP`}
          </p>
        </div>

        {/* ── Main CTA ── */}
        <div style={{padding:"0 16px",marginBottom:16}}>
          <Btn onClick={onSession} style={{width:"100%",padding:18,fontSize:18,boxShadow:"0 4px 20px rgba(79,70,229,0.35)"}}>
            ✨ Start Today's Lesson
          </Btn>
        </div>

        {/* ── Subjects + Games grid ── */}
        <div style={{padding:"0 16px",marginBottom:8}}>
          <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Your Subjects</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
            {getSubjects(child.country||"UK").map(s=>{
              const sc=SUB[s]||{emoji:"📚",color:C.primary,light:C.pLight};
              const lvl=child.level[s]||1;
              const diff=getDifficultyLabel(lvl);
              return (
                <button key={s} onClick={()=>onSession(s)}
                  style={{padding:"14px 8px",borderRadius:18,
                    background:sc.grad||`linear-gradient(135deg,${sc.color},${sc.color}CC)`,
                    border:"none",cursor:"pointer",fontFamily:F,textAlign:"center",
                    transition:"all 0.2s",boxShadow:`0 4px 16px ${sc.color}40`,
                    transform:"translateY(0)"}}>
                  <span style={{fontSize:28,display:"block",marginBottom:6}}>{sc.emoji}</span>
                  <p style={{fontSize:12,fontWeight:900,color:"#fff",marginBottom:2}}>{s}</p>
                  <p style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.85)"}}>{diff.emoji} Lv.{lvl}</p>
                </button>
              );
            })}
          </div>

          {/* Games row */}
          <button onClick={onGames} style={{width:"100%",padding:"16px 20px",borderRadius:20,
            background:"linear-gradient(135deg,#1E1B4B 0%,#4338CA 50%,#7C3AED 100%)",
            border:"none",cursor:"pointer",fontFamily:F,
            display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:16,
            boxShadow:"0 6px 24px rgba(67,56,202,0.5)",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-10,right:-10,width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
            <div style={{position:"absolute",bottom:-15,left:20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
            <span style={{fontSize:26}}>🎮</span>
            <div style={{textAlign:"left"}}>
              <p style={{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:"0.01em"}}>Mini Games</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>65 curriculum-aligned games</p>
            </div>
            <span style={{marginLeft:"auto",fontSize:20,color:"rgba(255,255,255,0.6)"}}>›</span>
          </button>
        </div>

        {/* ── Stats row ── */}
        <div style={{padding:"0 16px",marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[
              {e:"🏅",v:(child.badges||[]).length,l:"Badges",fn:onBadges,color:"#D97706"},
              {e:"🔥",v:child.streak||0,l:"Day Streak",color:"#EA580C"},
              {e:"⭐",v:(child.xp||0).toLocaleString(),l:"Total XP",color:C.primary},
            ].map(s=>(
              <button key={s.l} onClick={s.fn||undefined}
                style={{padding:"16px 8px",borderRadius:16,background:"#fff",
                  border:`1.5px solid ${s.color}20`,cursor:s.fn?"pointer":"default",
                  fontFamily:F,textAlign:"center",
                  boxShadow:`0 4px 16px ${s.color}15`,transition:"all 0.2s"}}>
                <span style={{fontSize:26,display:"block",marginBottom:6}}>{s.e}</span>
                <p style={{fontSize:22,fontWeight:900,color:s.color,lineHeight:1,animation:"countUp 0.5s ease"}}>{s.v}</p>
                <p style={{fontSize:10,color:C.muted,fontWeight:700,marginTop:4}}>{s.l}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Bottom buttons ── */}
        <div style={{padding:"0 16px 32px"}}>
          {!isParentView&&<Btn onClick={onMyStats} v="ghost" style={{width:"100%",marginBottom:10}}>📊 My Progress</Btn>}
          {children&&children.length>1&&<Btn onClick={onLeaderboard} v="ghost" style={{width:"100%",marginBottom:10}}>🏆 Family Leaderboard</Btn>}
          {children&&children.length>1&&<Btn onClick={onWeeklyChallenge} v="ghost" style={{width:"100%",marginBottom:10}}>⚡ Weekly Challenge</Btn>}
          {!isParentView&&<Btn onClick={onChangeAvatar} v="ghost" style={{width:"100%",marginBottom:10}}>🎨 Change Avatar</Btn>}
          {!isParentView&&<Btn onClick={onSignOut} v="ghost" style={{width:"100%",marginBottom:10}}>🚪 Sign Out</Btn>}
          {!isParentView&&<button onClick={()=>{if(window.confirm("Report an issue with a question or content?"))alert("Thank you! Our team will review this.");}} style={{fontSize:12,fontWeight:700,color:C.muted,background:"none",border:"none",cursor:"pointer",fontFamily:F,width:"100%"}}>🚩 Report a content issue</button>}
        </div>
      </div>
      <BottomNav active="home" onHome={()=>{}} onLearn={onSession} onGames={onGames} onBadges={onBadges}/>
    </Screen>
  );
}



function checkWrittenAnswer(val, answer, accept=[]) {
  if(!val||!answer) return false;
  const clean = v => String(v).toLowerCase().trim().replace(/[^a-z0-9.]/g,"");
  const cv = clean(val), ca = clean(answer);
  if(cv===ca||accept.some(a=>clean(a)===cv)) return true;
  if(!isNaN(cv)&&!isNaN(ca)) return Math.abs(parseFloat(cv)-parseFloat(ca))<0.001;
  return false;
}
function WrittenAnswer({onSubmit,placeholder="Type your answer..."}) {
  const [val,setVal]=useState("");
  const ref=useRef(null);
  useEffect(()=>{setTimeout(()=>ref.current?.focus(),100);},[]);
  const go=()=>{if(val.trim())onSubmit(val.trim());};
  return(<div style={{marginBottom:12}}><div style={{display:"flex",gap:8}}>
    <input ref={ref} value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder={placeholder}
      style={{flex:1,padding:"14px 16px",borderRadius:14,fontSize:18,fontWeight:700,border:`2px solid ${val?C.primary:C.border}`,outline:"none",fontFamily:F,background:"#fff",color:C.text}}/>
    <button onClick={go} disabled={!val.trim()} style={{padding:"14px 20px",borderRadius:14,fontWeight:900,fontSize:16,background:val.trim()?`linear-gradient(135deg,${C.primary},#6366F1)`:"#E5E7EB",color:val.trim()?"#fff":"#9CA3AF",border:"none",cursor:val.trim()?"pointer":"default",fontFamily:F}}>✓</button>
  </div><p style={{fontSize:11,color:C.muted,fontWeight:600,marginTop:6,textAlign:"center"}}>Type and press Enter or ✓</p></div>);
}

function MasteryTest({child,subject,topic,level,onPass,onFail}) {
  const PASS=8,TOTAL=10;
  const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [correct,setCorrect]=useState(0);
  const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);
  useEffect(()=>{
    claude(`Generate ${TOTAL} mastery test questions for "${topic?.name}" in ${subject}.
Child: age ${child.age}, ${child.yearGroup||"Year 3"}, ${child.country||"UK"} curriculum, Level ${level}.
Test full understanding. Mix easy medium hard. Need ${PASS}/${TOTAL} to pass.
Return ONLY JSON: {"questions":[{"q":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"A","explanation":"..."}]}`,
    "Mastery test.").then(d=>{if(d?.questions?.length)setQs(d.questions);});
  },[]);
  const answer=(opt)=>{
    if(ans||!qs)return;setSel(opt);setAns(true);
    if(opt.charAt(0)===qs[idx]?.correct)setCorrect(c=>c+1);
    setTimeout(()=>{if(idx+1>=TOTAL)setDone(true);else{setSel(null);setAns(false);setIdx(i=>i+1);}},1000);
  };
  const passed=correct>=PASS;
  if(!qs)return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:200,gap:16}}><div style={{fontSize:48}}>🎯</div><p style={{fontSize:20,fontWeight:900,color:"#fff"}}>Loading Mastery Test...</p></div>);
  if(done)return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:24}}>
      <div style={{background:"#fff",borderRadius:28,padding:32,maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:72,marginBottom:12}}>{passed?"🏆":"💪"}</div>
        <h2 style={{fontSize:26,fontWeight:900,color:passed?C.green:C.amber,marginBottom:8}}>{passed?"Level Up!":"Keep Practising!"}</h2>
        <div style={{background:passed?"#DCFCE7":"#FEF3C7",borderRadius:16,padding:"14px 20px",marginBottom:16}}>
          <p style={{fontSize:34,fontWeight:900,color:passed?C.green:"#D97706"}}>{correct}/{TOTAL}</p>
          <p style={{fontSize:14,fontWeight:700,color:passed?"#166534":"#92400E"}}>{passed?`Amazing! Moving to Level ${(level||1)+1}!`:`Need ${PASS}/10 to pass. Keep practising — you can do it!`}</p>
        </div>
        <button onClick={()=>passed?onPass(correct,TOTAL):onFail(correct,TOTAL)} style={{width:"100%",padding:"16px",borderRadius:16,fontSize:17,fontWeight:900,cursor:"pointer",fontFamily:"'Nunito',sans-serif",background:passed?"linear-gradient(135deg,#16A34A,#22C55E)":"linear-gradient(135deg,#F59E0B,#D97706)",color:"#fff",border:"none"}}>
          {passed?`Level ${(level||1)+1} →`:"Practise More →"}
        </button>
      </div>
    </div>
  );
  const q=qs[idx];const cols=["#E53E3E","#3182CE","#D69E2E","#38A169"];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,15,26,0.97)",zIndex:200,overflow:"auto",padding:20}}>
      <div style={{maxWidth:480,margin:"0 auto",paddingTop:20}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,#F59E0B,#EF4444)",borderRadius:50,padding:"8px 20px",marginBottom:8}}>
            <span style={{fontSize:18}}>🎯</span><p style={{fontSize:14,fontWeight:900,color:"#fff"}}>MASTERY TEST · Level {level}</p>
          </div>
          <div style={{display:"flex",gap:3,justifyContent:"center",marginBottom:4}}>
            {Array.from({length:TOTAL}).map((_,i)=><div key={i} style={{width:20,height:5,borderRadius:3,background:i<idx?"#22C55E":i===idx?"#FCD34D":"rgba(255,255,255,0.2)"}}/>)}
          </div>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>Need {PASS}/10 to advance · {correct} correct so far</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:20,padding:"20px 16px",marginBottom:14,border:"1px solid rgba(255,255,255,0.1)"}}><p style={{fontSize:16,fontWeight:800,color:"#fff",lineHeight:1.6,textAlign:"center"}}>{q?.q}</p></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          {q?.options?.map((opt,i)=>{const ok=ans&&opt===q.correct,bad=ans&&sel===opt&&!ok,dim=ans&&!ok&&sel!==opt;return(<button key={i} onClick={()=>answer(opt)} disabled={!!ans} style={{padding:"16px 12px",borderRadius:16,fontSize:13,fontWeight:900,cursor:ans?"default":"pointer",fontFamily:"'Nunito',sans-serif",border:"none",background:ok?"#22C55E":bad?"#EF4444":dim?"rgba(255,255,255,0.05)":`linear-gradient(135deg,${cols[i]},${cols[i]}BB)`,color:dim?"rgba(255,255,255,0.2)":"#fff",opacity:dim?0.4:1}}>{ok?"✅ ":bad?"❌ ":""}{opt.replace(/^[A-D]\)\s*/,"")}</button>);})}</div>
        {ans&&q?.explanation&&<div style={{padding:"10px 14px",borderRadius:12,background:"rgba(99,102,241,0.2)"}}><p style={{fontSize:12,fontWeight:700,color:"#A5B4FC",lineHeight:1.6}}>💡 {q.explanation}</p></div>}
      </div>
    </div>
  );
}

function Session({child,startSubject,startTopic,onComplete,onUpdate,onExit,a11y={}}) {
  const QUESTIONS_PER_LEVEL = 50; // 50 questions before mastery test
  const MAX_LEVELS = 10;          // 10 levels per topic = 500 questions total

  const [subject,setSub]=useState(startSubject||"Maths");
  const [topic,setTopic]=useState(startTopic||null);
  const missedRef=useRef([]); // wrong answers this session → Tricky Ones deck
  const [qNum,setQNum]=useState(0);   // total questions this session (no limit)
  const [mode,setMode]=useState(child.controls?.modeLock||(a11y.alwaysAudio?'audio':null)||child.mode);
  const [q,setQ]=useState(null);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  const [ans,setAns]=useState(false);
  const [sC,setSC]=useState(0);  // session correct
  const [sT,setST]=useState(0);  // session total
  const [sXP,setSXP]=useState(0);
  const [qS,setQS]=useState(0);  // current streak
  const [done,setDone]=useState(false);
  const [paused,setPaused]=useState(false);
  const [showTest,setShowTest]=useState(false);  // mastery test overlay
  const [askedQs,setAskedQs]=useState([]);
  const mRef=useRef(mode);
  useEffect(()=>{
    mRef.current=mode;
    // Cancel any ongoing speech when mode changes
    if(typeof window!=="undefined"&&window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },[mode]);

  // Current topic level (per topic, not global subject level)
  const topicLevel=topic
    ?(child.topicLevels?.[subject]?.[topic?.id]||1)
    :(child.level?.[subject]||1);

  // Questions done at this level for this topic
  const topicKey=topic?`${subject}_${topic.id}_lv${topicLevel}`:null;
  const topicQCount=(child.topicQCounts||{})[topicKey]||0;
  const questionsLeft=QUESTIONS_PER_LEVEL-topicQCount;

  const load=async(sub,m)=>{
    setLoading(true);setSel(null);setAns(false);
    const cm=m??mRef.current;
    const r=await claude(
      sessionSys({...child,level:child.level},sub,topic,cm,sC,sT,askedQs),
      "Generate the next question. Make it different from: "+askedQs.slice(-5).join(", ")
    );
    if(r?.question&&askedQs.includes(r.question)){
      const r2=await claude(sessionSys({...child,level:child.level},sub,topic,cm,sC,sT,askedQs),"Generate a completely NEW different question.");
      setQ(r2||r);
    }else{
      setQ(r);
    }
    setLoading(false);
    if(cm==="audio"&&r) setTimeout(()=>speak(r.question,child.tutor),400);
  };
  useEffect(()=>{load(subject,mode);},[]);

  const answer=(opt)=>{
    if(ans)return;
    setSel(opt);setAns(true);
    const ok=opt.charAt(0)===q?.correct;
    PLAY_TALLY.qs++;
    // Remember the miss — feeds the child's "Tricky Ones" review deck
    if(!ok&&q?.question&&q?.options)missedRef.current=[...missedRef.current,{q:q.question,options:q.options,correct:q.correct,subject}].slice(-10);
    const xp=ok?(q?.difficulty==="hard"?15:q?.difficulty==="medium"?10:7):2;
    const nc=sC+(ok?1:0),nt=sT+1;
    setSC(nc);setST(nt);setSXP(x=>x+xp);setQS(s=>ok?s+1:0);

    // Track per-topic-per-level progress
    if(topic&&topicKey){
      const newCount=topicQCount+1;
      const updatedCounts={...(child.topicQCounts||{}),[topicKey]:newCount};
      // Trigger mastery test after 50 questions
      if(newCount>=QUESTIONS_PER_LEVEL&&!showTest){
        onUpdate({topicQCounts:updatedCounts});
        setTimeout(()=>setShowTest(true),900); // show after answer reveal
      }else{
        onUpdate({topicQCounts:updatedCounts});
      }
    }

    // Save cumulative stats (XP, total, correct, badges) — no automatic level change
    const subsTried=[...(child.subsTried||[]),subject].filter((v,i,a)=>a.indexOf(v)===i);
    const bestStreak=Math.max(child.bestStreak||0,ok?qS+1:0);
    const updated={
      total:child.total+1,
      correct:child.correct+(ok?1:0),
      xp:child.xp+xp,
      subsTried,
      bestStreak
    };
    const {badges,newBadge}=checkBadges({...child,...updated});
    onUpdate({...updated,badges,_newBadge:newBadge});
    if(mode==="audio") speak(ok?(q?.encouragement||"Correct!"):"Not quite. "+(q?.explanation||""),child.tutor);
    if(q?.question) setAskedQs(prev=>[...prev,q.question].slice(-20));
  };

  // Always stay on same topic — no subject rotation
  const goNext=()=>{
    if(!topic&&qNum+1>=20){setDone(true);return;} // Free sessions end at 20
    setQNum(n=>n+1);
    load(subject,mode);
  };

  if(done) return <SessionDone child={child} stats={{correct:sC,total:sT,xp:sXP}} a11y={a11y} onDone={()=>onComplete({correct:sC,total:sT,xp:sXP,missedQs:missedRef.current})}/>;

  const tutor=TUTORS[child.tutor];
  const isRight=sel?.charAt(0)===q?.correct;
  const locked=!!(child.controls?.modeLock);

  return (
    <Screen>
      <div style={{paddingTop:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <TutorChar name={child.tutor} size={40}/>
            <div>
              <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>{topic?topic.name:subject} · Q{qNum+1}</p>
              {topic&&(
                <div style={{marginTop:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{flex:1,height:5,borderRadius:3,background:C.border,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(100,(topicQCount/QUESTIONS_PER_LEVEL)*100)}%`,background:`linear-gradient(90deg,${C.primary},#6366F1)`,borderRadius:3,transition:"width 0.3s"}}/>
                    </div>
                    <span style={{fontSize:9,fontWeight:800,color:C.muted,whiteSpace:"nowrap"}}>{topicQCount}/{QUESTIONS_PER_LEVEL}</span>
                  </div>
                  <p style={{fontSize:9,color:C.muted,fontWeight:600,marginTop:2}}>Lv.{topicLevel} · {Math.max(0,QUESTIONS_PER_LEVEL-topicQCount)} to test</p>
                </div>
              )}
            </div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {qS>=2&&<span style={{fontSize:13,fontWeight:900,color:C.amber}}>🔥{qS}</span>}
            <span style={{fontSize:13,fontWeight:800,color:C.primary}}>+{sXP}XP</span>
            <div style={{display:"flex",gap:6}}>
              {topic&&(()=>{
              const key=`${subject}_${topic?.id}_lv${topicLevel}`;
              const qCount=(child.topicQCounts||{})[key]||0;
              const pct=Math.min(100,Math.round((qCount/50)*100));
              return qCount>=20?(
                <button onClick={()=>setShowTest(true)} style={{background:C.pLight,border:`1.5px solid ${C.primary}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:12,fontWeight:800,color:C.primary,fontFamily:F}}>
                  📝 {qCount>=50?"Take Test!":pct+"%"}
                </button>
              ):null;
            })()}
              <button onClick={()=>setPaused(true)} style={{background:C.aLight,border:`1.5px solid ${C.amber}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:12,fontWeight:800,color:C.amber,fontFamily:F}}>⏸ Break</button>
            </div>
          </div>
        </div>
        {!locked&&(
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {[["traditional","📝 Read"],["audio","🎧 Listen"],["visual","🎨 Visual"]].map(([m,label])=>(
              <button key={m} onClick={()=>{setMode(m);mRef.current=m;if(m!==mode)load(subject,m);}} style={{flex:1,padding:"7px 4px",borderRadius:8,fontFamily:F,fontSize:11,fontWeight:800,cursor:"pointer",transition:"all 0.12s",background:mode===m?C.pLight:C.surface,border:`2px solid ${mode===m?C.primary:C.border}`,color:mode===m?C.primary:C.muted}}>{label}</button>
            ))}
          </div>
        )}
                {showTest&&topic&&(
          <MasteryTest
            child={child}
            subject={subject}
            topic={topic}
            level={topicLevel}
            onPass={(score,total)=>{
              // PASS: advance topic level, reset question count, force save
              const ntl={...child.topicLevels,
                [subject]:{...(child.topicLevels?.[subject]||{}),
                  [topic.id]:Math.min(MAX_LEVELS,(topicLevel||1)+1)}};
              const updatedCounts={...(child.topicQCounts||{}),[topicKey]:0};
              const testResults={...(child.topicTestResults||{}),[topicKey]:{passed:true,score,total,date:new Date().toISOString()}};
              const newLevel=Math.min(MAX_LEVELS,(topicLevel||1)+1);
              const levelLabel=getDifficultyLabel(newLevel).label;
              onUpdate({topicLevels:ntl,topicQCounts:updatedCounts,topicTestResults:testResults,_levelUp:true,_newLevel:levelLabel,perfectTests:(score===total?(child.perfectTests||0)+1:child.perfectTests||0)},true);
              setShowTest(false);
            }}
            onFail={(score,total)=>{
              // FAIL: reset question count so they practise more, stay at same level
              const updatedCounts={...(child.topicQCounts||{}),[topicKey]:0};
              const testResults={...(child.topicTestResults||{}),[topicKey]:{passed:false,score,total,date:new Date().toISOString()}};
              onUpdate({topicQCounts:updatedCounts,topicTestResults:testResults,retriedTests:(child.retriedTests||0)+1},true);
              setShowTest(false);
            }}
          />
        )}        {paused&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:C.surface,borderRadius:24,padding:"32px 24px",width:"100%",maxWidth:360,textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
              <div style={{fontSize:48,marginBottom:12}}>⏸</div>
              <h2 style={{fontSize:24,fontWeight:900,color:C.text,marginBottom:8}}>Taking a break?</h2>
              <p style={{fontSize:14,fontWeight:600,color:C.muted,marginBottom:8}}>Your progress is saved!</p>
              <div style={{background:C.pLight,borderRadius:12,padding:"12px 16px",marginBottom:24,display:"flex",justifyContent:"space-around"}}>
                <div><p style={{fontSize:22,fontWeight:900,color:C.primary}}>{sC}/{sT}</p><p style={{fontSize:11,color:C.muted,fontWeight:700}}>Correct</p></div>
                <div><p style={{fontSize:22,fontWeight:900,color:C.green}}>+{sXP}</p><p style={{fontSize:11,color:C.muted,fontWeight:700}}>XP so far</p></div>
                <div><p style={{fontSize:22,fontWeight:900,color:C.amber}}>{qNum}</p><p style={{fontSize:11,color:C.muted,fontWeight:700}}>Questions</p></div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <Btn onClick={()=>setPaused(false)} style={{width:"100%",fontSize:16}}>▶ Continue learning</Btn>
                <Btn onClick={()=>{
                  if(sT>0){
                    const session={acc:Math.round(sC/sT*100),date:new Date().toISOString(),xp:sXP};
                    onUpdate({streak:child.streak,sessionHistory:[...(child.sessionHistory||[]),session].slice(-30)});
                  }
                  onExit();
                }} v="ghost" style={{width:"100%",fontSize:15}}>Save & go home 🏠</Btn>
              </div>
            </div>
          </div>
        )}
        <Card>
          {loading?<Spinner color={tutor.color}/>:q?(
            <div style={{animation:"fadeUp 0.25s ease"}}>
              <span style={{display:"inline-block",marginBottom:14,padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",background:q.difficulty==="hard"?C.rLight:q.difficulty==="medium"?C.aLight:C.gLight,color:q.difficulty==="hard"?C.red:q.difficulty==="medium"?C.amber:C.green}}>{q.difficulty}</span>
              {mode==="visual"&&q.svg&&<div style={{margin:"0 0 16px",borderRadius:14,overflow:"hidden",background:"linear-gradient(135deg,#EEF2FF,#F0F9FF)",border:`2px solid ${C.border}`,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"16px 12px",minHeight:160}}><div style={{width:"100%",maxWidth:220,overflow:"hidden",borderRadius:8}} dangerouslySetInnerHTML={{__html:q.svg}}/></div>}
              <p style={{fontSize:a11y.largeText?22:19,fontWeight:700,color:C.text,lineHeight:1.8,marginBottom:20,fontFamily:a11y.dyslexiaFont?FDYS:F,letterSpacing:a11y.dyslexiaFont?"0.05em":undefined}}>{q.question}</p>
              {q.hint&&!ans&&<div style={{marginBottom:14,padding:"10px 14px",borderRadius:10,fontSize:13,fontWeight:600,color:"#92400E",background:"#FFFBEB",border:"1px solid #FDE68A"}}>💡 {q.hint}</div>}
              {mode==="audio"&&<button onClick={()=>speak(q.question,child.tutor)} style={{marginBottom:14,padding:"7px 14px",borderRadius:8,cursor:"pointer",border:`2px solid ${tutor.color}`,background:tutor.light,fontFamily:F,color:tutor.color,fontWeight:800,fontSize:13}}>🔊 Hear again</button>}
              <Options options={q.options} correct={q.correct} selected={sel} answered={ans} onAnswer={answer}/>
              {ans&&(
                <div style={{marginTop:16,animation:"pop 0.22s ease"}}>
                  <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:"12px 14px",borderRadius:12,marginBottom:10,background:isRight?C.gLight:(a11y.noRedFeedback?"#F1F5F9":C.rLight),border:`1px solid ${isRight?C.green:(a11y.noRedFeedback?"#94A3B8":C.red)}`}}>
                    <TutorChar name={child.tutor} size={36}/>
                    <div>
                      <p style={{fontSize:13,fontWeight:800,marginBottom:3,color:isRight?C.green:(a11y.noRedFeedback?"#475569":C.red)}}>{isRight?`✓ ${q.encouragement}`:a11y.noRedFeedback?"Almost — let's look together":"✗ Not quite!"}</p>
                      <p style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.55}}>{q.explanation}</p>
                    </div>
                  </div>
                  {isRight&&<p style={{textAlign:"center",fontSize:12,fontWeight:800,color:C.primary,marginBottom:10}}>⭐ +{q.difficulty==="hard"?15:q.difficulty==="medium"?10:7} XP earned!</p>}
                  <Btn onClick={goNext} style={{width:"100%"}}>
  {!topic&&qNum+1>=20?"Finish session 🎉":
   topic&&topicQCount>=QUESTIONS_PER_LEVEL?"Take Mastery Test 🎯":
   "Next question →"}
</Btn>
                </div>
              )}
            </div>
          ):(
            <div style={{textAlign:"center",padding:20}}><p style={{color:C.muted,marginBottom:12}}>Couldn't load question</p><Btn onClick={()=>load(subject,mode)}>Try again</Btn></div>
          )}
        </Card>
      </div>
    </Screen>
  );
}

// ── 9. Session Complete ───────────────────────────────────────────────────

function Confetti({count=40}) {
  const pieces=Array.from({length:count},(_,i)=>({
    id:i,
    x:Math.random()*100,
    delay:Math.random()*2,
    color:["#4338CA","#7C3AED","#EC4899","#F59E0B","#16A34A","#0284C7","#EF4444"][i%7],
    size:6+Math.random()*8,
    shape:Math.random()>0.5?"circle":"square"
  }));
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,height:"100vh",pointerEvents:"none",overflow:"hidden",zIndex:999}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:"absolute",left:`${p.x}%`,top:-20,
          width:p.size,height:p.size,
          borderRadius:p.shape==="circle"?"50%":3,
          background:p.color,
          animation:`confettiFall ${2+Math.random()*2}s ${p.delay}s ease-in forwards`,
        }}/>
      ))}
    </div>
  );
}

function SessionDone({child,stats,onDone,a11y={}}) {
  const acc=stats.total>0?Math.round(stats.correct/stats.total*100):0;
  const medal=acc>=80?"🏆":acc>=60?"⭐":"💪";
  const tier=acc>=80?"high":acc>=60?"mid":"low";
  const msgs={
    Sparky:{high:`INCREDIBLE, ${child.name}!! You absolutely SMASHED it! 🎉`,mid:`Great work ${child.name}! You're getting better every time! ⚡`,low:`Keep going ${child.name}! Every expert started as a beginner! 💪`},
    Pip:{high:`What a beautiful session, ${child.name}. You should be really proud. 🌟`,mid:`Good effort, ${child.name}. Each session makes you a little wiser! 🦉`,low:`Don't worry ${child.name}. Learning takes time — I'm so proud of you. 🌱`},
  };
  const bgGrad = acc>=80 ? "linear-gradient(160deg,#064E3B,#059669,#34D399)" : acc>=60 ? "linear-gradient(160deg,#1E3A5F,#0EA5E9,#38BDF8)" : "linear-gradient(160deg,#312E81,#4F46E5,#818CF8)";
  return (
    <div style={{minHeight:"100vh",background:bgGrad,fontFamily:F,display:"flex",justifyContent:"center",padding:"20px 16px 60px",position:"relative",overflow:"hidden"}}>
      {acc>=80&&!a11y?.noMotion&&<Confetti count={50}/>}
      <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
      <div style={{position:"absolute",bottom:40,left:-60,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
      <div style={{maxWidth:480,width:"100%",paddingTop:48,textAlign:"center",position:"relative",zIndex:1}}>
        <div style={{fontSize:96,marginBottom:12,animation:a11y.noMotion?undefined:"bounceY 1s ease-in-out infinite",filter:"drop-shadow(0 8px 20px rgba(0,0,0,0.3))"}}>{medal}</div>
        <h2 style={{fontSize:38,fontWeight:900,color:"#fff",marginBottom:4,textShadow:"0 2px 12px rgba(0,0,0,0.3)"}}>Session Complete!</h2>
        <p style={{fontSize:15,color:"rgba(255,255,255,0.75)",fontWeight:700,marginBottom:28}}>
          {tier==="high"?"Outstanding work! 🌟":tier==="mid"?"Great effort! Keep it up!":"Every session makes you stronger!"}
        </p>
        <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:28}}>
          {[{v:acc+"%",l:"Accuracy",e:"🎯"},{v:"+"+stats.xp,l:"XP Earned",e:"⭐"},{v:stats.correct+"/"+stats.total,l:"Correct",e:"✅"}].map(s=>(
            <div key={s.l} style={{padding:"16px 14px",borderRadius:20,minWidth:92,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.2)"}}>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:800,marginBottom:4}}>{s.e} {s.l}</p>
              <p style={{fontSize:28,fontWeight:900,color:"#fff"}}>{s.v}</p>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:12,marginBottom:32,alignItems:"flex-start",background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"16px",backdropFilter:"blur(8px)"}}>
          <TutorChar name={child.tutor} size={56}/>
          <p style={{flex:1,textAlign:"left",fontSize:15,fontWeight:700,color:"#fff",lineHeight:1.6}}>{msgs[child.tutor]?.[tier]}</p>
        </div>
        {stats._levelUp&&(
          <div style={{background:"linear-gradient(135deg,#F59E0B,#EF4444)",borderRadius:20,padding:"16px",marginBottom:16,textAlign:"center",boxShadow:"0 6px 20px rgba(245,158,11,0.5)"}}>
            <div style={{fontSize:40,marginBottom:6}}>🎓🎉</div>
            <p style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:4}}>LEVEL UP!</p>
            <p style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.9)"}}>You passed the test and moved to {stats._newLevel}!</p>
          </div>
        )}
        <button onClick={onDone} style={{width:"100%",padding:"18px",borderRadius:50,background:"#fff",border:"none",cursor:"pointer",fontFamily:F,fontSize:17,fontWeight:900,color:C.primary,boxShadow:"0 8px 28px rgba(0,0,0,0.2)",transition:"all 0.2s"}}
          onMouseOver={e=>e.currentTarget.style.transform="translateY(-3px)"}
          onMouseOut={e=>e.currentTarget.style.transform=""}>
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}

// ── 10. Badges Screen ─────────────────────────────────────────────────────
function BadgesScreen({child,onBack}) {
  const earned=child.badges||[];
  const [tooltip,setTooltip]=useState(null);
  return (
    <Screen>
      <div style={{paddingTop:20}}>
        <BackBtn onClick={onBack}/>
        <Lbl c="Achievements"/>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:24}}>{child.name}'s Badges</h2>
        {earned.length>0&&(
          <>
            <p style={{fontSize:13,fontWeight:800,color:C.green,marginBottom:16}}>✓ Earned ({earned.length})</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:28}}>
              {BADGES.filter(b=>earned.includes(b.id)).map(b=>(
                <div key={b.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{width:80,height:80,borderRadius:16,background:`linear-gradient(145deg,${C.aLight},white)`,border:`2px solid ${C.amber}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,boxShadow:`0 4px 12px ${C.amber}33`}}>{b.emoji}</div>
                  <span style={{fontSize:11,fontWeight:800,color:C.text,textAlign:"center",maxWidth:80}}>{b.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <p style={{fontSize:13,fontWeight:800,color:C.muted,marginBottom:16}}>Still to earn ({BADGES.filter(b=>!earned.includes(b.id)).length})</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {BADGES.filter(b=>!earned.includes(b.id)).map(b=>(
            <div key={b.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:0.35}}>
              <div style={{width:72,height:72,borderRadius:14,background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>{b.emoji}</div>
              <span style={{fontSize:10,fontWeight:800,color:C.muted,textAlign:"center",maxWidth:72}}>{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

// ── 11. Parent Dashboard ──────────────────────────────────────────────────
function ParentDash({account,children,onProgressChild,onAddChild,onSettings,onSignOut}) {
  const totalQ=children.reduce((a,c)=>a+c.total,0);
  const totalXP=children.reduce((a,c)=>a+c.xp,0);
  return (
    <Screen>
      <div style={{paddingTop:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div>
            <p style={{fontSize:13,color:C.muted,fontWeight:700}}>Parent Dashboard</p>
            <h2 style={{fontSize:24,fontWeight:900,color:C.text}}>{account?.name||authUser?.user_metadata?.name||'Parent'}</h2>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onSignOut} style={{padding:"8px 14px",borderRadius:12,background:C.rLight,border:"none",cursor:"pointer",fontSize:13,fontWeight:800,color:C.red,fontFamily:F}}>Sign Out</button>
            <button onClick={onSettings} style={{width:42,height:42,borderRadius:12,background:C.pLight,border:"none",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>⚙️</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24}}>
          {[{v:children.length,l:"Children",e:"👧"},{v:totalQ,l:"Questions",e:"❓"},{v:totalXP,l:"Total XP",e:"⭐"}].map(s=>(
            <Card key={s.l} style={{padding:"14px 10px",textAlign:"center"}}>
              <p style={{fontSize:20,marginBottom:4}}>{s.e}</p>
              <p style={{fontSize:22,fontWeight:900,color:C.primary}}>{s.v}</p>
              <p style={{fontSize:11,color:C.muted,fontWeight:700}}>{s.l}</p>
            </Card>
          ))}
        </div>
        <Lbl c="Your Children"/>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
          {children.map(c=>{
            const t=TUTORS[c.tutor];
            const acc=c.total>0?Math.round(c.correct/c.total*100):null;
            return (
              <Card key={c.id} style={{padding:"16px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <AvatarCircle avatar={c.avatar} size={44} color={t?.color||C.primary}/>
                  <div style={{flex:1}}>
                    <p style={{fontSize:17,fontWeight:800,color:C.text}}>{c.name||'Child'}</p>
                    <p style={{fontSize:12,color:C.muted,fontWeight:700}}>{c.country} · {c.yearGroup} · Lv.{Math.max(...Object.values(c.level||{Maths:1}))}</p>
                    {c.childUsername&&<p style={{fontSize:11,color:C.primary,fontWeight:800}}>👤 {c.childUsername}</p>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{fontSize:16}}>🔥 {c.streak}</p>
                    {acc!==null&&<p style={{fontSize:11,color:C.green,fontWeight:800}}>{acc}%</p>}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
                  {subjectsFor(c.country).map(s=>{
                    const st=SUB[s]||{emoji:"📘",color:C.primary};
                    return(
                    <div key={s} style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:12,minWidth:58,fontWeight:700,color:C.muted}}>{st.emoji} {s}</span>
                      <PBar value={(c.level?.[s]||1)-1} max={4} color={st.color} h={5}/>
                      <span style={{fontSize:11,fontWeight:800,color:st.color,minWidth:22}}>Lv.{c.level?.[s]||1}</span>
                    </div>
                  );})}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn onClick={()=>onProgressChild(c)} style={{width:"100%",padding:"10px",fontSize:14}}>📊 View {c.name}'s Progress →</Btn>
                </div>
              </Card>
            );
          })}
        </div>
        <Btn onClick={onAddChild} v="ghost" style={{width:"100%"}}>+ Add Another Child</Btn>
      </div>
    </Screen>
  );
}

// ── 12. Child Progress (Parent View) ─────────────────────────────────────
function ChildProgress({child,onBack,onControls,onAccessibility,onResetPassword,onEditProfile,onEmailReport,onSignOut,onAdvanceYear}) {
  const [insight,setInsight]=useState(null);
  const [insightLoading,setInsightLoading]=useState(false);
  const [expanded,setExpanded]=useState({overview:true,insight:false,gaps:true,curriculum:false,mastery:false,mastery_stats:false,habits:false,subjects:false,patterns:false,velocity:false,games_stats:false,sessions:false});
  const toggle=(k)=>setExpanded(e=>({...e,[k]:!e[k]}));

  const sessions=child.sessionHistory||[];
  const tLevels=child.topicLevels||{};
  const acc=child.total>0?Math.round(child.correct/child.total*100):0;
  const tColor=TUTORS[child.tutor]?.color||C.primary;

  // ── Computed stats ────────────────────────────────────────────
  const thisWeek=sessions.slice(-7);
  const lastWeek=sessions.slice(-14,-7);
  const weekAcc=thisWeek.length>0?Math.round(thisWeek.reduce((a,s)=>a+s.acc,0)/thisWeek.length):0;
  const lastWeekAcc=lastWeek.length>0?Math.round(lastWeek.reduce((a,s)=>a+s.acc,0)/lastWeek.length):0;
  const weekTrend=weekAcc-lastWeekAcc;
  const estMins=sessions.length*12;
  const engagementScore=Math.min(100,Math.round(
    (Math.min(child.streak,30)/30)*25+
    (Math.min(child.total,100)/100)*25+
    (acc/100)*25+
    (Math.min((child.gamesPlayed||0),9)/9)*15+
    (Math.min((child.badges||[]).length,17)/17)*10
  ));

  // ── Topic stats across all subjects ──────────────────────────
  const allTopicStats=[];
  subjectsFor(child.country).forEach(subj=>{
    const topics=getCurriculum(child.country)[subj]||[];
    topics.forEach(topic=>{
      const lvl=(tLevels[subj]?.[topic.id])||1;
      allTopicStats.push({subj,topic,lvl,pct:Math.round(((lvl-1)/4)*100)});
    });
  });
  const attempted=allTopicStats.filter(t=>t.lvl>1);
  const strengths=[...allTopicStats].sort((a,b)=>b.lvl-a.lvl).slice(0,3);
  const weaknesses=allTopicStats.filter(t=>t.lvl<=2).sort((a,b)=>a.lvl-b.lvl).slice(0,3);
  const notStarted=allTopicStats.filter(t=>t.lvl===1&&t.topic.minAge<=child.age);

  // ── Learning velocity ─────────────────────────────────────────
  const _subs=subjectsFor(child.country);
  const avgLevel=_subs.reduce((a,s)=>a+(child.level[s]||1),0)/_subs.length;
  const expectedLevel=child.age<=6?1:child.age<=7?1.5:child.age<=8?2:child.age<=9?2.5:child.age<=10?3:3.5;
  const velocityStatus=avgLevel>=expectedLevel+0.5?"ahead":avgLevel>=expectedLevel-0.5?"on track":"needs support";

  // ── Difficulty curve ──────────────────────────────────────────
  const recentSessions=sessions.slice(-10);
  const earlyAcc=recentSessions.slice(0,5).reduce((a,s)=>a+s.acc,0)/Math.max(recentSessions.slice(0,5).length,1);
  const lateAcc=recentSessions.slice(5).reduce((a,s)=>a+s.acc,0)/Math.max(recentSessions.slice(5).length,1);
  const diffCurve=lateAcc>earlyAcc+5?"improving":lateAcc<earlyAcc-5?"declining":"steady";

  // ── Best/worst sessions ───────────────────────────────────────
  const bestSession=sessions.length>0?[...sessions].sort((a,b)=>b.acc-a.acc)[0]:null;
  const worstSession=sessions.length>0?[...sessions].sort((a,b)=>a.acc-b.acc)[0]:null;
  const avgSessionAcc=sessions.length>0?Math.round(sessions.reduce((a,s)=>a+s.acc,0)/sessions.length):0;

  // ── Session by day of week ────────────────────────────────────
  const dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const byDay=Array(7).fill(null).map((_,d)=>{
    const daySessions=sessions.filter(s=>new Date(s.date).getDay()===d);
    return{day:dayNames[d],count:daySessions.length,acc:daySessions.length>0?Math.round(daySessions.reduce((a,s)=>a+s.acc,0)/daySessions.length):0};
  });
  const bestDay=byDay.sort((a,b)=>b.acc-a.acc).find(d=>d.count>0);

  // ── 4-week prediction ─────────────────────────────────────────
  const sessionsPerWeek=sessions.length>0?Math.round((sessions.length/Math.max(1,Math.ceil((Date.now()-new Date(sessions[0]?.date||Date.now()))/604800000)))):0;
  const projectedXP=child.xp+sessionsPerWeek*4*15;
  const projectedLevel=Math.min(5,avgLevel+(weekTrend>0?0.3:weekTrend<0?-0.1:0.15));

  // ── Additional detailed stats ────────────────────────────────
  // Topic mastery breakdown
  const masteredTopics=allTopicStats.filter(t=>t.lvl>=4).length;
  const inProgressTopics=allTopicStats.filter(t=>t.lvl>=2&&t.lvl<4).length;
  const totalTopicsForAge=allTopicStats.filter(t=>t.topic.minAge<=child.age).length;
  const masteryPct=totalTopicsForAge>0?Math.round((masteredTopics/totalTopicsForAge)*100):0;

  // Consistency score (how regularly they practice)
  const last14Days=Array.from({length:14},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-i);
    return sessions.some(s=>new Date(s.date).toDateString()===d.toDateString());
  });
  const consistencyScore=Math.round((last14Days.filter(Boolean).length/14)*100);

  // Level distribution
  const levelDist={beginner:0,easy:0,medium:0,hard:0,vhard:0,expert:0};
  subjectsFor(child.country).forEach(s=>{
    const l=child.level[s]||1;
    if(l<=3)levelDist.beginner++;
    else if(l<=6)levelDist.easy++;
    else if(l<=10)levelDist.medium++;
    else if(l<=15)levelDist.hard++;
    else if(l<=20)levelDist.vhard++;
    else levelDist.expert++;
  });

  // Tests passed
  const testResults=child.topicTestResults||{};
  const testsPassed=Object.values(testResults).filter(v=>v==="pass").length;
  const testsFailed=Object.values(testResults).filter(v=>v==="fail").length;
  const testPassRate=testsPassed+testsFailed>0?Math.round((testsPassed/(testsPassed+testsFailed))*100):0;

  // Longest streak ever
  const longestStreak=child.bestStreak||child.streak;

  // Questions per day average
  const daysActive=sessions.length>0?Math.ceil((Date.now()-new Date(sessions[0]?.date||Date.now()))/(86400000))||1:1;
  const qPerDay=daysActive>0?Math.round(child.total/daysActive):0;

  // Best subject by level
  const _subs2=subjectsFor(child.country);
  const bestSubject=_subs2.reduce((a,s)=>(child.level[s]||1)>(child.level[a]||1)?s:a,_subs2[0]);
  const worstSubject=_subs2.reduce((a,s)=>(child.level[s]||1)<(child.level[a]||1)?s:a,_subs2[0]);

  // ── Generate Claude insight ───────────────────────────────────
  const loadInsight=async()=>{
    if(insightLoading||insight)return;
    setInsightLoading(true);
    const d=await claude(
      `You are a warm and knowledgeable educational advisor writing to a parent about their child.
Write a single paragraph of 4-5 sentences summarising ${child.name}'s learning progress on ADAPT.
Tone: warm, professional, encouraging but honest. Address the parent directly.
Be specific — use the actual data provided.
Never use bullet points. Write flowing prose only.`,
      `Child: ${child.name}, age ${child.age}, ${child.yearGroup}
Total questions: ${child.total}
Overall accuracy: ${acc}%
Streak: ${child.streak} days
This week accuracy: ${weekAcc}% (${weekTrend>0?"+":""}${weekTrend}% vs last week)
Strongest topics: ${strengths.map(s=>s.topic.name).join(", ")||"none yet"}
Weakest topics: ${weaknesses.map(s=>s.topic.name).join(", ")||"none yet"}
Learning velocity: ${velocityStatus}
Engagement score: ${engagementScore}/100
Sessions this week: ${thisWeek.length}
Write a personalised paragraph for the parent.`
    );
    setInsight(d?Object.values(d)[0]:null);
    setInsightLoading(false);
  };

  useEffect(()=>{if(child.total>0)loadInsight();},[]);

  // ── Section header helper ─────────────────────────────────────
  const SectionHeader=({k,title,emoji,badge})=>(
    <button onClick={()=>toggle(k)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",padding:"14px 0 10px",fontFamily:F}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:18}}>{emoji}</span>
        <p style={{fontSize:15,fontWeight:900,color:C.text}}>{title}</p>
        {badge&&<span style={{padding:"2px 8px",borderRadius:20,background:C.pLight,color:C.primary,fontSize:11,fontWeight:800}}>{badge}</span>}
      </div>
      <span style={{fontSize:18,color:C.muted,transition:"transform 0.2s",transform:expanded[k]?"rotate(180deg)":"none"}}>▾</span>
    </button>
  );

  const trafficLight=(lvl)=>lvl>=4?C.green:lvl>=3?C.green:lvl>=2?C.amber:C.red;
  const tlfg=(lvl)=>lvl>=3?"🟢":lvl>=2?"🟡":"🔴";

  // Year mastery: ready to advance when most subjects are near the top level
  const trackedLevels=subjectsFor(child.country).map(s=>child.level?.[s]||1);
  const avgYearLevel=trackedLevels.reduce((a,b)=>a+b,0)/Math.max(trackedLevels.length,1);
  const masteredSubjects=trackedLevels.filter(l=>l>=9).length;
  const yearMastered=avgYearLevel>=8.5&&masteredSubjects>=Math.ceil(trackedLevels.length*0.6);

  return (
    <Screen>
      <div style={{paddingTop:20}}>
        <BackBtn onClick={onBack}/>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
          <button onClick={onSignOut} style={{padding:"8px 16px",borderRadius:10,background:"#FEE2E2",border:"none",cursor:"pointer",fontSize:13,fontWeight:800,color:"#DC2626",fontFamily:F}}>Sign Out</button>
        </div>

        {/* ── Content audit: questions your child reported ── */}
        {(child.flaggedQs||[]).length>0&&(
          <div style={{padding:"14px 16px",borderRadius:18,marginBottom:16,background:"#FFF7ED",border:"2px solid #FDBA74"}}>
            <p style={{fontSize:13,fontWeight:900,color:"#9A3412",marginBottom:8}}>⚑ {child.name} reported {(child.flaggedQs||[]).length} question{(child.flaggedQs||[]).length===1?"":"s"}</p>
            {(child.flaggedQs||[]).slice(-3).reverse().map((f,i)=>(
              <div key={i} style={{padding:"8px 10px",borderRadius:10,background:"#fff",marginBottom:6,border:"1px solid #FED7AA"}}>
                <p style={{fontSize:12,fontWeight:800,color:"#431407",lineHeight:1.4}}>{f.q}</p>
                <p style={{fontSize:10,fontWeight:700,color:"#9A3412",marginTop:2}}>{f.game} · marked answer: {f.correct}</p>
              </div>
            ))}
            <p style={{fontSize:10.5,fontWeight:700,color:"#9A3412"}}>These are removed from question banks automatically. Review them — children are usually right.</p>
          </div>
        )}

        {/* ── Year mastered! Suggest advancing ── */}
        {yearMastered&&(
          <div style={{padding:"16px 18px",borderRadius:20,marginBottom:16,
            background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 6px 24px rgba(16,185,129,0.35)",
            display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontSize:34}}>🎓</span>
            <div style={{flex:1}}>
              <p style={{fontSize:15,fontWeight:900,color:"#fff"}}>{child.name} has mastered {child.yearGroup}!</p>
              <p style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.85)"}}>{masteredSubjects} of {trackedLevels.length} subjects at top level — ready for the next year's curriculum.</p>
            </div>
            <button onClick={onAdvanceYear} style={{background:"#fff",color:"#059669",border:"none",borderRadius:13,
              padding:"11px 16px",fontSize:13,fontWeight:900,cursor:"pointer",fontFamily:F,whiteSpace:"nowrap",
              boxShadow:"0 3px 0 rgba(0,0,0,0.15)"}}>Advance ›</button>
          </div>
        )}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,padding:"16px 18px",background:`linear-gradient(135deg,${tColor}18,${tColor}08)`,borderRadius:20,border:`1px solid ${tColor}20`}}>
          <AvatarCircle avatar={child.avatar} size={52} color={tColor}/>
          <div style={{flex:1}}>
            <h2 style={{fontSize:22,fontWeight:900,color:C.text}}>{child.name}</h2>
            <p style={{fontSize:12,color:C.muted,fontWeight:700}}>{child.yearGroup} · {child.country} · {child.age} years old</p>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:`conic-gradient(${tColor} ${engagementScore}%,${C.border} 0)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:C.surface,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <p style={{fontSize:13,fontWeight:900,color:tColor}}>{engagementScore}</p>
              </div>
            </div>
            <p style={{fontSize:10,color:C.muted,fontWeight:700,marginTop:3}}>Engagement</p>
          </div>
        </div>

        {/* ── SECTION 1: Overview ── */}
        <Card style={{marginBottom:12}}>
          <SectionHeader k="overview" title="Overview" emoji="📊"/>
          {expanded.overview&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                {[
                  {v:child.total,l:"Questions",c:C.primary,e:"❓"},
                  {v:acc+"%",l:"Accuracy",c:acc>=80?C.green:acc>=60?C.amber:C.red,e:"🎯"},
                  {v:child.streak,l:"Day Streak",c:C.amber,e:"🔥"},
                  {v:estMins+"m",l:"Est. Time",c:C.sky,e:"⏱️"},
                  {v:weekAcc+"%",l:"This Week",c:weekTrend>=0?C.green:C.red,e:"📅"},
                  {v:(child.badges||[]).length,l:"Badges",c:C.violet,e:"🏅"},
                ].map(s=>(
                  <div key={s.l} style={{padding:"12px 8px",borderRadius:14,background:C.bg,textAlign:"center"}}>
                    <p style={{fontSize:10,marginBottom:4}}>{s.e}</p>
                    <p style={{fontSize:18,fontWeight:900,color:s.c}}>{s.v}</p>
                    <p style={{fontSize:10,color:C.muted,fontWeight:700}}>{s.l}</p>
                  </div>
                ))}
              </div>
              {/* Week vs last week */}
              <div style={{padding:"10px 14px",borderRadius:12,background:weekTrend>=0?C.gLight:C.rLight,border:`1px solid ${weekTrend>=0?C.green:C.red}`}}>
                <p style={{fontSize:13,fontWeight:700,color:weekTrend>=0?C.gDark:C.red}}>
                  {weekTrend>=0?"📈":"📉"} {weekTrend>=0?"Up":"Down"} {Math.abs(weekTrend)}% accuracy vs last week
                  {sessions.length===0?" · No sessions yet":""}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* ── SECTION 2: Claude Insight ── */}
        <Card style={{marginBottom:12}}>
          <SectionHeader k="insight" title="AI Learning Insight" emoji="🤖"/>
          {expanded.insight&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              {child.total===0?(
                <p style={{fontSize:13,fontWeight:600,color:C.muted,lineHeight:1.7}}>Insight will appear after {child.name} completes their first session.</p>
              ):insightLoading?(
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0"}}><Spinner color={tColor}/><p style={{fontSize:13,color:C.muted,fontWeight:600}}>Generating insight...</p></div>
              ):insight?(
                <div>
                  <div style={{display:"flex",gap:12,marginBottom:10}}>
                    <TutorChar name={child.tutor} size={44} noAnim/>
                    <p style={{fontSize:14,fontWeight:600,color:C.text,lineHeight:1.75,flex:1}}>{insight}</p>
                  </div>
                  <button onClick={()=>{setInsight(null);loadInsight();}} style={{fontSize:12,fontWeight:800,color:C.muted,background:"none",border:"none",cursor:"pointer",fontFamily:F}}>↻ Refresh insight</button>
                </div>
              ):(
                <button onClick={loadInsight} style={{padding:"10px 16px",borderRadius:10,background:C.pLight,border:`1px solid ${C.primary}`,color:C.primary,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:F}}>Generate insight</button>
              )}
            </div>
          )}
        </Card>

        {/* ── SECTION 3: Strengths & Weaknesses ── */}
        <Card style={{marginBottom:12}}>
          <SectionHeader k="gaps" title="Strengths & Areas to Improve" emoji="💪" badge={`${strengths.length} strong · ${weaknesses.length} need work`}/>
          {expanded.gaps&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              {strengths.length>0&&(
                <div style={{marginBottom:14}}>
                  <p style={{fontSize:11,fontWeight:800,color:C.green,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>✅ Strongest Topics</p>
                  {strengths.map(({subj,topic,lvl})=>(
                    <div key={topic.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,padding:"10px 12px",borderRadius:12,background:C.gLight,border:`1px solid ${C.green}30`}}>
                      <span style={{fontSize:20}}>{topic.emoji}</span>
                      <div style={{flex:1}}>
                        <p style={{fontSize:13,fontWeight:800,color:C.text}}>{topic.name}</p>
                        <p style={{fontSize:11,color:C.muted,fontWeight:600}}>{subj} · Level {lvl}/5</p>
                      </div>
                      <PBar value={lvl-1} max={4} color={C.green} h={6}/>
                    </div>
                  ))}
                </div>
              )}
              {weaknesses.length>0&&(
                <div style={{marginBottom:14}}>
                  <p style={{fontSize:11,fontWeight:800,color:C.amber,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>⚠️ Needs More Practice</p>
                  {weaknesses.map(({subj,topic,lvl})=>(
                    <div key={topic.id} style={{marginBottom:8,padding:"10px 12px",borderRadius:12,background:C.aLight,border:`1px solid ${C.amber}30`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                        <span style={{fontSize:20}}>{topic.emoji}</span>
                        <div style={{flex:1}}>
                          <p style={{fontSize:13,fontWeight:800,color:C.text}}>{topic.name}</p>
                          <p style={{fontSize:11,color:C.muted,fontWeight:600}}>{subj} · Level {lvl}/5</p>
                        </div>
                      </div>
                      <p style={{fontSize:12,fontWeight:600,color:"#92400E",lineHeight:1.5}}>
                        💡 Try 5 minutes on {topic.name} before bed — even short practice builds confidence.
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {notStarted.length>0&&(
                <div>
                  <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>🔒 Not Started Yet ({notStarted.length} topics)</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {notStarted.slice(0,8).map(({topic})=>(
                      <span key={topic.id} style={{padding:"4px 10px",borderRadius:20,background:C.bg,border:`1px solid ${C.border}`,fontSize:12,fontWeight:700,color:C.muted}}>{topic.emoji} {topic.name}</span>
                    ))}
                    {notStarted.length>8&&<span style={{padding:"4px 10px",borderRadius:20,background:C.bg,fontSize:12,fontWeight:700,color:C.muted}}>+{notStarted.length-8} more</span>}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* ── SECTION 4: Topic Mastery Map ── */}
        <Card style={{marginBottom:12}}>
          <SectionHeader k="mastery" title="Topic Mastery Map" emoji="🗺️" badge={`${attempted.length}/${allTopicStats.length} started`}/>
          {expanded.mastery&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                {[{c:C.green,l:"Mastered (4-5)"},{c:C.amber,l:"Progressing (2-3)"},{c:C.border,l:"Not started (1)"}].map(l=>(
                  <div key={l.l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:12,borderRadius:3,background:l.c}}/><span style={{fontSize:11,fontWeight:700,color:C.muted}}>{l.l}</span></div>
                ))}
              </div>
              {subjectsFor(child.country).map(subj=>{
                const topics=(getCurriculum(child.country||"UK")[subj]||[]).filter(t=>t.minAge<=child.age);
                return (
                  <div key={subj} style={{marginBottom:14}}>
                    <p style={{fontSize:12,fontWeight:800,color:SUB[subj].color,marginBottom:8}}>{SUB[subj].emoji} {subj}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {topics.map(topic=>{
                        const lvl=(tLevels[subj]?.[topic.id])||1;
                        const bg=lvl>=4?C.green:lvl>=2?C.amber:C.border;
                        return (
                          <div key={topic.id} title={`${topic.name} — Level ${lvl}/5`}
                            style={{padding:"6px 10px",borderRadius:10,background:bg,opacity:lvl===1?0.4:1,transition:"all 0.15s"}}>
                            <p style={{fontSize:11,fontWeight:800,color:lvl>=2?"#fff":C.muted}}>{topic.emoji} {topic.name}</p>
                            <p style={{fontSize:9,color:lvl>=2?"rgba(255,255,255,0.8)":C.muted,fontWeight:700}}>Lv.{lvl}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* ── SECTION 5: Subject Breakdown ── */}
        <Card style={{marginBottom:12}}>
          <SectionHeader k="subjects" title="Subject Breakdown" emoji="📚"/>
          {expanded.subjects&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              {getSubjects(child.country||"UK").map(subj=>{
                // Map US/CA subject names to display config
                const displaySubj=SUB_ALIASES[subj]||subj;
                const sc=SUB[displaySubj]||SUB[subj]||{color:C.primary,light:C.pLight,emoji:"📚"};
                const lvl=child.level[subj]||child.level[displaySubj]||1;
                const topics=(getCurriculum(child.country||"UK")[subj]||[]).filter(t=>t.minAge<=child.age);
                const startedTopics=topics.filter(t=>((tLevels[subj]?.[t.id])||1)>1).length;
                return (
                  <div key={subj} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:22}}>{SUB[subj].emoji}</span>
                        <div>
                          <p style={{fontSize:14,fontWeight:800,color:C.text}}>{subj}</p>
                          <p style={{fontSize:11,color:C.muted,fontWeight:600}}>{startedTopics}/{topics.length} topics started</p>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{fontSize:18,fontWeight:900,color:SUB[subj].color}}>Lv.{lvl}</p>
                        <p style={{fontSize:10,color:trafficLight(lvl),fontWeight:800}}>{lvl>=4?"Excellent":lvl>=3?"Good":lvl>=2?"Developing":"Just started"}</p>
                      </div>
                    </div>
                    <PBar value={lvl-1} max={4} color={SUB[subj].color} h={8}/>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* ── SECTION 6: Learning Velocity ── */}
        <Card style={{marginBottom:12}}>
          <SectionHeader k="velocity" title="Learning Velocity" emoji="🚀" badge={velocityStatus}/>
          {expanded.velocity&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{padding:"14px 16px",borderRadius:14,background:velocityStatus==="ahead"?C.gLight:velocityStatus==="on track"?C.pLight:C.aLight,border:`1px solid ${velocityStatus==="ahead"?C.green:velocityStatus==="on track"?C.primary:C.amber}`,marginBottom:14}}>
                <p style={{fontSize:24,marginBottom:6}}>{velocityStatus==="ahead"?"🚀":velocityStatus==="on track"?"✅":"💛"}</p>
                <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:4}}>
                  {velocityStatus==="ahead"?`${child.name} is ahead of the expected level for their age`
                    :velocityStatus==="on track"?`${child.name} is on track for their age and year group`
                    :`${child.name} may benefit from a little extra support`}
                </p>
                <p style={{fontSize:13,fontWeight:600,color:C.muted,lineHeight:1.6}}>
                  Average level: {avgLevel.toFixed(1)}/5 · Expected for age {child.age}: {expectedLevel.toFixed(1)}/5
                </p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div style={{padding:"12px",borderRadius:12,background:C.bg,textAlign:"center"}}>
                  <p style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:4}}>Sessions this week</p>
                  <p style={{fontSize:22,fontWeight:900,color:C.primary}}>{thisWeek.length}</p>
                </div>
                <div style={{padding:"12px",borderRadius:12,background:C.bg,textAlign:"center"}}>
                  <p style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:4}}>Avg per week</p>
                  <p style={{fontSize:22,fontWeight:900,color:C.primary}}>{sessionsPerWeek}</p>
                </div>
              </div>
              <div style={{marginTop:10,padding:"12px 14px",borderRadius:12,background:C.bg}}>
                <p style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2}}>📈 4-week projection</p>
                <p style={{fontSize:12,fontWeight:600,color:C.muted,lineHeight:1.6}}>
                  At current pace, {child.name} will reach approximately level {projectedLevel.toFixed(1)} average and earn around {projectedXP} total XP.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* ── SECTION 7: Difficulty Curve ── */}
        <Card style={{marginBottom:12}}>
          <SectionHeader k="patterns" title="Performance Patterns" emoji="📈"/>
          {expanded.patterns&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              {/* Difficulty curve */}
              <div style={{marginBottom:14}}>
                <p style={{fontSize:12,fontWeight:800,color:C.muted,marginBottom:8}}>DIFFICULTY CURVE (last 10 sessions)</p>
                <div style={{padding:"12px 14px",borderRadius:12,background:diffCurve==="improving"?C.gLight:diffCurve==="declining"?C.rLight:C.pLight,border:`1px solid ${diffCurve==="improving"?C.green:diffCurve==="declining"?C.red:C.primary}`}}>
                  <p style={{fontSize:14,fontWeight:800,color:C.text}}>
                    {diffCurve==="improving"?"📈 Improving — accuracy is trending upward"
                      :diffCurve==="declining"?"📉 Declining — accuracy has dipped recently"
                      :"➡️ Steady — consistent performance across sessions"}
                  </p>
                </div>
              </div>
              {/* Best day */}
              {bestDay&&(
                <div style={{marginBottom:14}}>
                  <p style={{fontSize:12,fontWeight:800,color:C.muted,marginBottom:8}}>BEST PERFORMING DAY</p>
                  <div style={{display:"flex",gap:6}}>
                    {byDay.map(d=>(
                      <div key={d.day} style={{flex:1,textAlign:"center"}}>
                        <div style={{height:40,borderRadius:"6px 6px 0 0",background:d.count>0?(d.day===bestDay.day?C.primary:C.pLight):C.border,marginBottom:4,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:2}}>
                          {d.count>0&&<span style={{fontSize:9,fontWeight:800,color:d.day===bestDay.day?"#fff":C.primary}}>{d.acc}%</span>}
                        </div>
                        <p style={{fontSize:10,fontWeight:800,color:d.day===bestDay.day?C.primary:C.muted}}>{d.day}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize:12,fontWeight:700,color:C.muted,marginTop:8}}>💡 {child.name} performs best on {bestDay.day}s with {bestDay.acc}% average accuracy</p>
                </div>
              )}
              {/* Best/worst/avg */}
              {sessions.length>0&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {[{v:bestSession?.acc+"%",l:"Best Session",c:C.green,e:"🏆"},
                    {v:avgSessionAcc+"%",l:"Average",c:C.primary,e:"📊"},
                    {v:worstSession?.acc+"%",l:"Lowest",c:C.amber,e:"💪"}
                  ].map(s=>(
                    <div key={s.l} style={{padding:"12px 8px",borderRadius:12,background:C.bg,textAlign:"center"}}>
                      <p style={{fontSize:16,marginBottom:2}}>{s.e}</p>
                      <p style={{fontSize:18,fontWeight:900,color:s.c}}>{s.v}</p>
                      <p style={{fontSize:10,color:C.muted,fontWeight:700}}>{s.l}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* ── SECTION 7b: Mastery Stats ── */}
        <Card style={{marginBottom:12}}>
          <SectionHeader k="mastery_stats" title="Mastery Overview" emoji="🏆" badge={`${masteredTopics} mastered`}/>
          {expanded.mastery_stats&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              {/* Mastery ring */}
              <div style={{display:"flex",gap:12,marginBottom:16,alignItems:"center"}}>
                <div style={{width:80,height:80,borderRadius:"50%",background:`conic-gradient(${C.green} ${masteryPct}%,${C.border} 0)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <div style={{width:62,height:62,borderRadius:"50%",background:C.surface,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                    <p style={{fontSize:18,fontWeight:900,color:C.green}}>{masteryPct}%</p>
                    <p style={{fontSize:8,color:C.muted,fontWeight:700}}>mastered</p>
                  </div>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[
                      {v:masteredTopics,l:"Mastered",c:C.green},
                      {v:inProgressTopics,l:"In Progress",c:C.amber},
                      {v:testsPassed,l:"Tests Passed",c:C.primary},
                      {v:testPassRate+"%",l:"Pass Rate",c:testPassRate>=80?C.green:C.amber},
                    ].map(s=>(
                      <div key={s.l} style={{padding:"8px 10px",borderRadius:10,background:C.bg,textAlign:"center"}}>
                        <p style={{fontSize:16,fontWeight:900,color:s.c}}>{s.v}</p>
                        <p style={{fontSize:9,color:C.muted,fontWeight:700}}>{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Level distribution */}
              <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Level Distribution</p>
              {[
                {l:"Beginner",v:levelDist.beginner,c:"#16A34A",e:"🟢"},
                {l:"Easy",v:levelDist.easy,c:"#CA8A04",e:"🟡"},
                {l:"Medium",v:levelDist.medium,c:"#EA580C",e:"🟠"},
                {l:"Hard",v:levelDist.hard,c:"#DC2626",e:"🔴"},
                {l:"Very Hard",v:levelDist.vhard,c:"#9333EA",e:"🔥"},
                {l:"Expert",v:levelDist.expert,c:"#0EA5E9",e:"⚡"},
              ].map(d=>(
                <div key={d.l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:12}}>{d.e}</span>
                  <span style={{fontSize:12,fontWeight:700,color:C.muted,width:70}}>{d.l}</span>
                  <div style={{flex:1,height:8,borderRadius:4,background:C.border,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(d.v/subjectsFor(child.country).length)*100}%`,background:d.c,borderRadius:4,transition:"width 0.6s"}}/>
                  </div>
                  <span style={{fontSize:12,fontWeight:800,color:C.text,width:12}}>{d.v}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ── SECTION 7c: Consistency & Habits ── */}
        <Card style={{marginBottom:12}}>
          <SectionHeader k="habits" title="Learning Habits" emoji="📆" badge={consistencyScore+"%  consistent"}/>
          {expanded.habits&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                {[
                  {v:consistencyScore+"%",l:"14-day Consistency",c:consistencyScore>=70?C.green:consistencyScore>=50?C.amber:C.red,e:"📆"},
                  {v:longestStreak,l:"Best Streak",c:C.amber,e:"🔥"},
                  {v:qPerDay,l:"Questions/Day",c:C.primary,e:"📝"},
                  {v:sessionsPerWeek,l:"Sessions/Week",c:C.sky,e:"🗓️"},
                  {v:bestSubject,l:"Strongest",c:C.green,e:"💪"},
                  {v:worstSubject,l:"Needs Work",c:C.amber,e:"📚"},
                ].map(s=>(
                  <div key={s.l} style={{padding:"10px 8px",borderRadius:12,background:C.bg,textAlign:"center"}}>
                    <p style={{fontSize:10,marginBottom:2}}>{s.e}</p>
                    <p style={{fontSize:14,fontWeight:900,color:s.c,lineHeight:1.1}}>{s.v}</p>
                    <p style={{fontSize:9,color:C.muted,fontWeight:700,marginTop:2}}>{s.l}</p>
                  </div>
                ))}
              </div>
              {/* 14-day activity heatmap */}
              <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Last 14 Days</p>
              <div style={{display:"flex",gap:4}}>
                {last14Days.reverse().map((active,i)=>(
                  <div key={i} style={{flex:1,height:28,borderRadius:6,background:active?C.green:C.border,transition:"all 0.3s"}}
                    title={`${14-i} days ago: ${active?"Active":"No session"}`}/>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <p style={{fontSize:9,color:C.muted,fontWeight:700}}>14 days ago</p>
                <p style={{fontSize:9,color:C.muted,fontWeight:700}}>Today</p>
              </div>
            </div>
          )}
        </Card>

        {/* ── SECTION 7d: Curriculum Progress ── */}
        <Card style={{marginBottom:12}}>
          <SectionHeader k="curriculum" title="Curriculum Progress" emoji="📖" badge={`${child.yearGroup}`}/>
          {expanded.curriculum&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{padding:"12px 14px",background:velocityStatus==="ahead"?C.gLight:velocityStatus==="on track"?C.pLight:C.aLight,borderRadius:12,marginBottom:14,border:`1px solid ${velocityStatus==="ahead"?C.green:velocityStatus==="on track"?C.primary:C.amber}`}}>
                <p style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:4}}>
                  {velocityStatus==="ahead"?"🚀 Ahead of curriculum"
                    :velocityStatus==="on track"?"✅ On track for year group"
                    :"💛 May need extra support"}
                </p>
                <p style={{fontSize:12,fontWeight:600,color:C.muted}}>
                  Average level: {avgLevel.toFixed(1)} · Expected for age {child.age}: {expectedLevel.toFixed(1)}
                </p>
              </div>
              {getSubjects(child.country||"UK").map(subj=>{
                // Map US/CA subject names to display config
                const displaySubj=SUB_ALIASES[subj]||subj;
                const sc=SUB[displaySubj]||SUB[subj]||{color:C.primary,light:C.pLight,emoji:"📚"};
                const lvl=child.level[subj]||child.level[displaySubj]||1;
                const diff=getDifficultyLabel(lvl);
                const topicsForAge=(getCurriculum(child.country)[subj]||[]).filter(t=>t.minAge<=child.age);
                const masteredInSubj=topicsForAge.filter(t=>((child.topicLevels||{})[subj]?.[t.id]||1)>=4).length;
                const qKey=`${subj}_progress`;
                return (
                  <div key={subj} style={{marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:20}}>{SUB[subj].emoji}</span>
                        <div>
                          <p style={{fontSize:13,fontWeight:800,color:C.text}}>{subj}</p>
                          <p style={{fontSize:10,color:C.muted,fontWeight:600}}>{masteredInSubj}/{topicsForAge.length} topics mastered</p>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{fontSize:14,fontWeight:900,color:diff.color}}>Lv.{lvl}</p>
                        <p style={{fontSize:9,fontWeight:800,color:diff.color}}>{diff.emoji} {diff.label}</p>
                      </div>
                    </div>
                    <div style={{height:8,borderRadius:4,background:C.border,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(100,(lvl/20)*100)}%`,background:SUB[subj].color,borderRadius:4}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* ── SECTION 7e: Games Stats ── */}
        <Card style={{marginBottom:12}}>
          <SectionHeader k="games_stats" title="Mini Games" emoji="🎮" badge={`${(child.gamesPlayed||0)} played`}/>
          {expanded.games_stats&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                {[
                  {e:"🎮",v:child.gamesPlayed||0,l:"Games Played",c:C.primary},
                  {e:"🏆",v:child.gamesBeat||0,l:"Games Won",c:C.green},
                  {e:"⭐",v:child.gamesPlayed>0?Math.round((child.gamesBeat||0)/(child.gamesPlayed||1)*100)+"%":"—",l:"Win Rate",c:C.amber},
                ].map(s=>(
                  <div key={s.l} style={{padding:"10px 8px",borderRadius:12,background:C.bg,textAlign:"center"}}>
                    <p style={{fontSize:11,marginBottom:2}}>{s.e}</p>
                    <p style={{fontSize:16,fontWeight:900,color:s.c}}>{s.v}</p>
                    <p style={{fontSize:9,color:C.muted,fontWeight:700}}>{s.l}</p>
                  </div>
                ))}
              </div>
              {(!child.gamesPlayed||child.gamesPlayed===0)&&(
                <p style={{textAlign:"center",fontSize:13,color:C.muted,fontWeight:600}}>{child.name} hasn't played any mini games yet.</p>
              )}
            </div>
          )}
        </Card>

        {/* ── SECTION 8: Session History ── */}
        <Card style={{marginBottom:14}}>
          <SectionHeader k="sessions" title="Session History" emoji="📅" badge={`${sessions.length} total`}/>
          {expanded.sessions&&sessions.length>0&&(
            <div style={{animation:"fadeUp 0.2s ease"}}>
              <div style={{display:"flex",gap:4,alignItems:"flex-end",height:80,marginBottom:8}}>
                {sessions.slice(-14).map((s,i)=>{
                  const h=Math.max(8,Math.round((s.acc/100)*64));
                  return (
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <span style={{fontSize:8,color:C.muted,fontWeight:700}}>{s.acc}%</span>
                      <div style={{width:"100%",height:h,borderRadius:"4px 4px 0 0",background:s.acc>=80?C.green:s.acc>=60?C.amber:C.red,transition:"height 0.3s"}}/>
                    </div>
                  );
                })}
              </div>
              <p style={{fontSize:11,color:C.muted,fontWeight:700,textAlign:"center"}}>Last {Math.min(14,sessions.length)} sessions</p>
            </div>
          )}
          {expanded.sessions&&sessions.length===0&&<p style={{fontSize:13,color:C.muted,fontWeight:600,paddingBottom:8}}>No sessions yet — get learning!</p>}
        </Card>

        {/* ── Engagement Score Breakdown ── */}
        <Card style={{marginBottom:14}}>
          <p style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:12}}>⚡ Engagement Score: <span style={{color:tColor}}>{engagementScore}/100</span></p>
          {[
            {l:"Streak",v:Math.min(child.streak,30),max:30,e:"🔥"},
            {l:"Questions",v:Math.min(child.total,100),max:100,e:"❓"},
            {l:"Accuracy",v:acc,max:100,e:"🎯"},
            {l:"Games played",v:Math.min(child.gamesPlayed||0,9),max:9,e:"🎮"},
            {l:"Badges earned",v:Math.min((child.badges||[]).length,17),max:17,e:"🏅"},
          ].map(item=>(
            <div key={item.l} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:700,color:C.text}}>{item.e} {item.l}</span>
                <span style={{fontSize:12,fontWeight:800,color:tColor}}>{item.v}/{item.max}</span>
              </div>
              <PBar value={item.v} max={item.max} color={tColor} h={6}/>
            </div>
          ))}
        </Card>

        {/* Badges */}
        <Card style={{marginBottom:20}}>
          <Lbl c={`Badges (${(child.badges||[]).length}/${BADGES.length})`}/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {(child.badges||[]).length===0
              ?<p style={{fontSize:13,color:C.muted,fontWeight:600}}>No badges yet — keep learning!</p>
              :(child.badges||[]).map(id=>{const b=BADGES.find(x=>x.id===id);return b?<span key={id} style={{fontSize:26}} title={b.name}>{b.emoji}</span>:null;})}
          </div>
        </Card>

        <Btn onClick={onControls} v="ghost" style={{width:"100%",marginBottom:10}}>⚙️ Parental Controls</Btn>
        <Btn onClick={onEmailReport} v="ghost" style={{width:"100%",marginBottom:10}}>📧 Progress Report</Btn>
        <Btn onClick={onAdvanceYear} v="ghost" style={{width:"100%",marginBottom:10}}>🎓 Advance Year Group</Btn>
        <Btn onClick={onEditProfile} v="ghost" style={{width:"100%",marginBottom:10}}>✏️ Edit Child's Profile</Btn>
        <Btn onClick={onResetPassword} v="ghost" style={{width:"100%",marginBottom:10}}>🔑 Reset Child's Password</Btn>
        <Btn onClick={onAccessibility} v="ghost" style={{width:"100%"}}>♿ Accessibility Settings</Btn>
      </div>
    </Screen>
  );
}


// ── 13. Parental Controls ─────────────────────────────────────────────────
function ParentalControls({child,onSave,onBack}) {
  const [ctrl,setCtrl]=useState({modeLock:null,maxMins:child.age<=7?20:child.age<=11?30:45,leaderboard:true,sharing:false,pshe:true,miniGames:true,...(child.controls||{})});
  const upd=(k,v)=>setCtrl(c=>({...c,[k]:v}));
  return (
    <Screen>
      <div style={{paddingTop:20}}>
        <BackBtn onClick={onBack}/>
        <Lbl c="Parental Controls"/>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:24}}>{child.name}'s Settings</h2>
        <Card style={{marginBottom:12}}>
          <Lbl c="Learning Mode"/>
          <p style={{fontSize:13,color:C.muted,fontWeight:600,marginBottom:10}}>Lock to one mode or let {child.name} choose</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[["Free choice",null],["📝 Traditional","traditional"],["🎧 Listen","audio"],["🎨 Visual","visual"]].map(([label,val])=>(
              <button key={label} onClick={()=>upd("modeLock",val)} style={{padding:"8px 12px",borderRadius:8,fontFamily:F,fontSize:13,fontWeight:800,cursor:"pointer",background:ctrl.modeLock===val?C.pLight:C.bg,border:`2px solid ${ctrl.modeLock===val?C.primary:C.border}`,color:ctrl.modeLock===val?C.primary:C.muted,transition:"all 0.12s"}}>{label}</button>
            ))}
          </div>
        </Card>
        <Card style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <Lbl c="Max Session Length"/>
            <span style={{fontSize:15,fontWeight:900,color:C.primary}}>{ctrl.maxMins} min</span>
          </div>
          <input type="range" min={10} max={90} step={5} value={ctrl.maxMins} onChange={e=>upd("maxMins",Number(e.target.value))} style={{width:"100%",accentColor:C.primary}}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
            <span style={{fontSize:11,color:C.muted,fontWeight:700}}>10 min</span>
            <span style={{fontSize:11,color:C.muted,fontWeight:700}}>90 min</span>
          </div>
        </Card>
        <Card style={{marginBottom:28}}>
          {[{key:"leaderboard",label:"National Leaderboard",desc:"Allow comparing with other users"},{key:"sharing",label:"Social Sharing",desc:"Allow sharing badges online"},{key:"pshe",label:"PSHE Content",desc:"Age-appropriate health & relationships topics"},{key:"miniGames",label:"Mini Games",desc:"Allow access to the games hub"},
          {key:"bedtimeMode",label:"Bedtime Mode (9pm-7am)",desc:"Block access outside school hours"}].map((item,i)=>(
            <div key={item.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:i>0?"12px 0 0":undefined,borderTop:i>0?`1px solid ${C.border}`:undefined,marginTop:i>0?12:0}}>
              <div>
                <p style={{fontSize:14,fontWeight:800,color:C.text}}>{item.label}</p>
                <p style={{fontSize:12,color:C.muted,fontWeight:600}}>{item.desc}</p>
              </div>
              <Toggle on={ctrl[item.key]} onChange={v=>upd(item.key,v)}/>
            </div>
          ))}
        </Card>
        <Btn onClick={()=>onSave(ctrl)} style={{width:"100%"}}>Save Settings ✓</Btn>
      </div>
    </Screen>
  );
}

// ── 14. Settings ──────────────────────────────────────────────────────────
function Settings({account,onBack,onReset,onSignOut,onPrivacy,onTerms,onChangePassword}) {
  return (
    <Screen>
      <div style={{paddingTop:20}}>
        <BackBtn onClick={onBack}/>
        <Lbl c="Account"/>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:24}}>Settings</h2>
        <Card style={{marginBottom:12}}>
          <p style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:4}}>Account holder</p>
          <p style={{fontSize:16,fontWeight:700,color:C.primary}}>{account?.name}</p>
        </Card>
        <Card style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <p style={{fontSize:14,fontWeight:800,color:C.text}}>Subscription</p>
            <span style={{fontSize:12,fontWeight:800,padding:"4px 12px",borderRadius:20,background:C.pLight,color:C.primary}}>TRIAL</span>
          </div>
          <p style={{fontSize:13,fontWeight:600,color:C.muted,lineHeight:1.6,marginBottom:10}}>7-day full trial active. To continue after trial, connect Stripe payments (30 min guided setup — ask ADAPT to walk you through it).</p>
          <div style={{padding:"10px 14px",background:C.pLight,borderRadius:10,border:`1px solid ${C.primary}22`}}>
            <p style={{fontSize:13,fontWeight:700,color:C.primary}}>💳 Individual: £6.99/mo · Family (6 kids): £12.99/mo</p>
          </div>
        </Card>
        <Card style={{marginBottom:12}}>
          <p style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:6}}>Privacy & Safety</p>
          <p style={{fontSize:13,fontWeight:600,color:C.muted,lineHeight:1.7}}>All data stored on your device. No data sold or shared. Children's data never used for advertising. AI content filtered with strict educational guardrails.</p>
        </Card>
        <Card style={{marginBottom:28,background:C.rLight,border:`1px solid ${C.red}22`}}>
          <p style={{fontSize:14,fontWeight:800,color:C.red,marginBottom:6}}>Danger Zone</p>
          <p style={{fontSize:13,fontWeight:600,color:C.muted,marginBottom:12}}>This will delete all progress, profiles and data. This cannot be undone.</p>
          <Btn onClick={()=>{
            if(window.confirm("This will delete ALL progress and profiles and cannot be undone. Are you sure?")) {
              onReset();
            }
          }} v="danger" style={{width:"100%"}}>Reset All Data</Btn>
        </Card>
      </div>
    </Screen>
  );
}

// ── 15. Parent Name Screen ────────────────────────────────────────────────
function ParentName({onNext,onBack}) {
  const [name,setName]=useState("");
  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <Lbl c="Your Details"/>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:28}}>What's your name?</h2>
        <Card style={{marginBottom:28}}>
          <Lbl c="Your Name"/>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Sarah"
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:20,fontWeight:800,color:C.text,background:C.bg,outline:"none",border:`2px solid ${name?C.primary:C.border}`,transition:"border 0.2s"}}/>
        </Card>
        <Btn onClick={()=>onNext(name.trim())} disabled={!name.trim()} style={{width:"100%"}}>Continue →</Btn>
      </div>
    </Screen>
  );
}

// ═════════════════════════════════════════════════════════════════
// MINI GAMES SYSTEM
// ═════════════════════════════════════════════════════════════════

const GAMES = [
  // Maths / Math / Mathematics
  { id:"frogJump",     name:"Frog Number Jump", emoji:"🐸",
    subjects:["Maths","Math","Mathematics"], topics:["number_sense","counting","operations"],
    desc:"ARCADE! Hop the frog to where the answer lives!", minAge:4,
    levelDesc:["Numbers to 10","Numbers to 20","Adding jumps","Numbers to 50","Numbers to 100"] },
  { id:"balanceScale", name:"Balance Scale",    emoji:"⚖️",
    subjects:["Maths","Math","Mathematics"], topics:["operations","number_sense","addition"],
    desc:"ARCADE! Stack weights until both sides balance!", minAge:5,
    levelDesc:["Small totals","Bigger totals","Using 5s","Using 10s","Balance master"] },
  { id:"oddEvenSort",  name:"Odd & Even Sort",  emoji:"🧮",
    subjects:["Maths","Math","Mathematics"], topics:["number_sense","counting"],
    desc:"ARCADE! Flick numbers into the right bucket — fast!", minAge:5,
    levelDesc:["Numbers to 20","Numbers to 50","Bigger numbers","Speed sorting","Sort champion"] },
  { id:"roboRescue",   name:"Robo Rescue",      emoji:"🤖",
    subjects:["Computing","Computer Studies"], topics:["algorithms","programming"],
    desc:"ARCADE! Program the robot to reach the star!", minAge:6,
    levelDesc:["Straight lines","Simple turns","Around walls","Tricky mazes","Master coder"] },
  { id:"livingSort",   name:"Living or Not?",   emoji:"🌱",
    subjects:["Science","Science & Technology"], topics:["living_things","biology"],
    desc:"ARCADE! Sort the world into living and not living!", minAge:4,
    levelDesc:["Easy sorting","Trickier things","Speed round","Expert eye","Science sorter"] },
  { id:"nounVerbSort", name:"Noun or Verb?",    emoji:"📖",
    subjects:["English","English Language Arts","Language"], topics:["grammar","vocabulary"],
    desc:"ARCADE! Flick each word into noun or verb!", minAge:6,
    levelDesc:["Easy words","Everyday words","Tricky words","Speed round","Grammar great"] },
  { id:"numberBridge",  name:"Number Bridge",        emoji:"🌉",
    subjects:["Maths","Math","Mathematics"], topics:["number_sense","counting","operations"],
    desc:"NEW! Tap planks in order to build the bridge!", minAge:4,
    levelDesc:["Order small numbers","Counting patterns","Bigger steps","Tricky sequences","Speed sequencing"] },
  { id:"tableMatch",    name:"Times Table Match",    emoji:"🃏",
    subjects:["Maths","Math","Mathematics"], topics:["multiplication","operations"],
    desc:"NEW! Flip cards to pair sums with answers!", minAge:6,
    levelDesc:["2s and 5s pairs","Mixed easy tables","All tables","Harder mixes","Memory master"] },
  { id:"alphabetBridge",name:"Alphabet Bridge",      emoji:"🔤",
    subjects:["English","English Language Arts","Language"], topics:["phonics","spelling","vocabulary"],
    desc:"NEW! Build the bridge in alphabetical order!", minAge:5,
    levelDesc:["First letters","A-Z ordering","Trickier words","Close letters","Alphabet ace"] },
  { id:"wordPicMatch",  name:"Word & Picture Match", emoji:"🖼️",
    subjects:["English","English Language Arts","Language"], topics:["vocabulary","phonics","reading"],
    desc:"NEW! Match each word to its picture!", minAge:4,
    levelDesc:["Simple words","Everyday words","New vocabulary","Tricky words","Word wizard"] },
  { id:"meteorMaths",     name:"Meteor Maths",      emoji:"🌠",
    subjects:["Maths","Math","Mathematics"],
    topics:["operations","addition","multiplication","number_sense"],
    desc:"ARCADE! Tap the right meteor before it smashes the shield!", minAge:5,
    levelDesc:["Add and subtract to 25","Bigger sums and easy tables","Mixed tables and sums","Fast mixed arithmetic","Rapid-fire calculations"] },
  { id:"wordMeteors",     name:"Word Meteors",      emoji:"☄️",
    subjects:["English","English Language Arts","Language"],
    topics:["spelling","phonics","vocabulary"],
    desc:"ARCADE! Zap the correctly spelled word before it lands!", minAge:6,
    levelDesc:["Simple common words","Tricky letter patterns","Homophone traps","Harder spelling rules","Challenge words"] },
  { id:"numberBlaster",   name:"Number Blaster",    emoji:"🔢",
    subjects:["Maths","Math","Mathematics"],
    topics:["number_place","addition","operations","base_ten","counting","number_sense"],
    desc:"Race the clock — answer equations before time runs out!", minAge:4,
    levelDesc:["Simple addition to 10","Mixed +/- to 20","Multiplication and division","Multi-step calculations","Algebra and advanced operations"] },
  { id:"timesTableRace",  name:"Times Table Race",  emoji:"⏱️",
    subjects:["Maths","Math","Mathematics"],
    topics:["multiplication","operations"],
    desc:"How fast can you recall your times tables?", minAge:7,
    levelDesc:["2, 5 and 10 times tables","3, 4 and 8 times tables","All tables to 12","Mixed tables under pressure","Random tables up to 15"] },
  { id:"fractionChef",    name:"Fraction Chef",     emoji:"🍕",
    subjects:["Maths","Math","Mathematics"],
    topics:["fractions","number_sense"],
    desc:"Slice the pizza to show the correct fraction!", minAge:6,
    levelDesc:["Halves and quarters","Thirds and sixths","Equivalent fractions","Add and subtract fractions","Multiply fractions and decimals"] },
  // English / ELA / Language
  { id:"wordScramble",    name:"Word Scramble",     emoji:"🔤",
    subjects:["English","English Language Arts","Language"],
    topics:["spelling","phonics","foundational","reading_ca"],
    desc:"Unscramble the letters to find the hidden word!", minAge:6,
    levelDesc:["CVC words and simple phonics","Common sight words","Year 3-4 vocabulary","Year 5-6 vocabulary","Academic and technical vocabulary"] },
  { id:"spellingBee",     name:"Spelling Bee",      emoji:"🐝",
    subjects:["English","English Language Arts","Language"],
    topics:["spelling","phonics","foundational","reading_ca"],
    desc:"Listen carefully and spell each word correctly.", minAge:7,
    levelDesc:["Phase 3-4 phonics words","KS1 common exception words","Year 3-4 statutory word list","Year 5-6 statutory word list","Advanced vocabulary and etymology"] },
  { id:"sentenceBuilder", name:"Sentence Builder",  emoji:"✏️",
    subjects:["English","English Language Arts","Language"],
    topics:["grammar","language_us","writing_ca"],
    desc:"Arrange the words to build a correct sentence.", minAge:5,
    levelDesc:["Simple subject-verb sentences","Add adjectives and adverbs","Compound sentences with conjunctions","Complex sentences with clauses","Formal writing and sophisticated structures"] },
  // Science
  { id:"scienceSort",     name:"Science Sort",      emoji:"🔬",
    subjects:["Science","Science & Technology"],
    topics:["living","animals","life_science","life_systems","plants"],
    desc:"Sort the items into the correct scientific categories!", minAge:5,
    levelDesc:["Living vs non-living, basic animal groups","Vertebrates and invertebrates, plant parts","Food chains, classification keys, habitats","Ecosystems, adaptation, classification systems","Evolution, genetics, complex classification"] },
  { id:"statesOfMatter",  name:"States of Matter",  emoji:"💧",
    subjects:["Science","Science & Technology"],
    topics:["materials","matter_ca","physical_sci"],
    desc:"Is it a solid, liquid or gas? Sort them correctly!", minAge:6,
    levelDesc:["Identify solids, liquids and gases","Properties of each state, examples","Changes of state: melting, freezing, evaporating","Particle model, temperature and state changes","Chemical changes vs physical changes"] },
  { id:"planetPatrol",    name:"Planet Patrol",     emoji:"🪐",
    subjects:["Science","Science & Technology"],
    topics:["earth","earth_ca","earth_space_us"],
    desc:"Identify the planets from their clues and facts!", minAge:7,
    levelDesc:["Name the 8 planets in order","Key facts about each planet","Comparing planets: size, distance, moons","Solar system structure, asteroids, comets","Space exploration, stars, galaxies"] },
  // History / Social Studies
  { id:"timelineSort",    name:"Timeline Sorter",   emoji:"📅",
    subjects:["History","Social Studies"],
    topics:["chronology","us_history","british","living_memory","canadian"],
    desc:"Place historical events in the correct order!", minAge:6,
    levelDesc:["Order events from own lifetime","Order events from last 100 years","Order events in British/American/Canadian history","Ancient to modern timeline challenges","World history chronology across civilisations"] },
  { id:"historyMatch",    name:"History Match",     emoji:"🏛️",
    subjects:["History","Social Studies"],
    topics:["ancient","us_history","british","world_history","world_hist_us","canadian"],
    desc:"Match historical figures, dates and events!", minAge:7,
    levelDesc:["Match simple facts about local/national history","Famous people and their achievements","Events and their dates and causes","Complex cause and effect matching","Historical sources and interpretations"] },
  // Geography
  { id:"mapQuiz",         name:"Map Explorer",      emoji:"🗺️",
    subjects:["Geography","Social Studies"],
    topics:["uk_geo","us_geography","ca_geography","world_geo","maps"],
    desc:"Find countries, capitals and features on the map!", minAge:5,
    levelDesc:["UK countries / US regions / Canadian provinces","Capital cities and major landmarks","Physical features: rivers, mountains, seas","World continents, oceans and major countries","Advanced world geography and geopolitical knowledge"] },
  // Computing / Computer Studies
  { id:"algorithmSort",   name:"Algorithm Sort",    emoji:"🔢",
    subjects:["Computing","Computer Studies"],
    topics:["algorithms","comp_thinking","comp_think_ca"],
    desc:"Put the steps in the right order to solve the problem!", minAge:6,
    levelDesc:["Everyday algorithm sequences","Simple Scratch program steps","Loops and conditions in sequence","Debugging and correcting algorithms","Complex algorithms with functions and data"] },
  { id:"debugDetective",  name:"Debug Detective",   emoji:"🔍",
    subjects:["Computing","Computer Studies"],
    topics:["coding","programming_us","coding_ca"],
    desc:"Find and fix the bug in the broken program!", minAge:7,
    levelDesc:["Spot the missing step in a sequence","Fix a loop or condition error","Debug variables and data errors","Find logical errors in functions","Debug complex multi-procedure programs"] },
  // NEW FUN GAMES
  { id:"mathFishing",     name:"Maths Fishing",     emoji:"🎣",
    subjects:["Maths","Math","Mathematics"],
    topics:["addition","operations","number_place","base_ten","number_sense"],
    desc:"Cast your line and reel in the right answer!", minAge:4,
    levelDesc:["Fish for answers to simple addition","Mixed +/- with numbers to 20","Multiplication fish in the pond","Multi-step equation fishing","Algebra and advanced equation angling"] },
  { id:"spaceBlaster",    name:"Space Blaster",     emoji:"🚀",
    subjects:["Maths","Math","Mathematics"],
    topics:["multiplication","operations","fractions","algebra","expressions"],
    desc:"Blast the alien ships by solving equations!", minAge:6,
    levelDesc:["Shoot aliens with times table answers","Mixed operations under fire","Fractions and decimals invade!","Multi-step equations in space","Algebra aliens — hardest mission"] },
  { id:"gemHunter",       name:"Gem Hunter",        emoji:"💎",
    subjects:["English","English Language Arts","Language"],
    topics:["spelling","phonics","vocabulary","foundational","reading_ca"],
    desc:"Answer correctly to dig up sparkling gems!", minAge:5,
    levelDesc:["Dig for CVC words and phonics gems","Unearth sight word treasures","Mine Year 3-4 vocabulary gems","Year 5-6 deep mine spellings","Rare gem — advanced vocabulary challenge"] },
  { id:"wordRunner",      name:"Word Runner",        emoji:"🏃",
    subjects:["English","English Language Arts","Language"],
    topics:["grammar","language_us","writing_ca","vocabulary"],
    desc:"Run and collect the correct word before time runs out!", minAge:6,
    levelDesc:["Collect nouns and verbs","Grab adjectives and adverbs","Chase conjunctions and prepositions","Collect formal vs informal word choices","Sprint for sophisticated vocabulary"] },
  { id:"volcanoEscape",   name:"Volcano Escape",    emoji:"🌋",
    subjects:["Science","Science & Technology"],
    topics:["earth","forces","materials","earth_ca","earth_space_us","physical_sci"],
    desc:"Answer science questions to climb to safety!", minAge:6,
    levelDesc:["Escape with basic science facts","Climb using forces and materials knowledge","Scale the volcano with earth science","Answer harder questions higher up","Expert science knowledge — reach the summit!"] },
  { id:"treasureMap",     name:"Treasure Hunt",     emoji:"🗺️",
    subjects:["History","Geography","Social Studies"],
    topics:["chronology","maps","uk_geo","us_geography","ca_geography","us_history","british","canadian"],
    desc:"Follow clues to find the buried treasure!", minAge:6,
    levelDesc:["Simple map and history clues","Local history and basic geography","National history and geography clues","World history and geography trails","Expert historian and geographer challenge"] },
  // ── MATHS GAMES ──────────────────────────────────────────────────────────
  { id:"grandPrix",       name:"Grand Prix Racing",  emoji:"🏎️", subjects:["Maths","Math","Mathematics"], topics:["measurement","measurement_us","spatial"], desc:"Race the track — answer measurement questions to speed up!", minAge:5, levelDesc:["Compare lengths and weights","Measure in cm, m, kg, litres","Convert units and calculate perimeter","Area, volume and compound measures","Speed, distance and time calculations"] },
  { id:"candyShop",       name:"Candy Shop",         emoji:"🍭", subjects:["Maths","Math","Mathematics"], topics:["measurement","financial","number_sense"], desc:"Run your sweet shop — get the money right!", minAge:5, levelDesc:["Count coins and make amounts to 50p","Give correct change from £1","Calculate totals and change from £5","Profit, loss and discount percentages","Financial planning and budgeting"] },
  { id:"basketballMaths", name:"Basketball Maths",   emoji:"🏀", subjects:["Maths","Math","Mathematics"], topics:["statistics","measurement_us","data_ca"], desc:"Shoot hoops! Answer data questions to score!", minAge:7, levelDesc:["Read simple bar charts and pictograms","Interpret bar charts with scales","Calculate averages: mean, median, mode","Interpret line graphs and pie charts","Statistical analysis and probability"] },
  { id:"trainGame",       name:"Number Train",       emoji:"🚂", subjects:["Maths","Math","Mathematics"], topics:["number_place","counting","base_ten","number_sense"], desc:"Drive the train — connect carriages with number sequences!", minAge:4, levelDesc:["Count and order numbers to 20","Number sequences and patterns to 100","Place value to 1000, skip counting","Number patterns, factors and multiples","Complex sequences, nth term, algebra"] },
  { id:"supermarketMath", name:"Supermarket Sweep",  emoji:"🛒", subjects:["Maths","Math","Mathematics","Economics"], topics:["measurement","financial","number_sense"], desc:"Shop smart — calculate prices, change and totals!", minAge:6, levelDesc:["Add prices under £1, make change","Calculate totals and change from £5/£10","Multi-item totals, percentage discounts","Unit prices, best value comparisons","Budgets, taxes and financial planning"] },
  { id:"rocketMaths",     name:"Rocket Launch",      emoji:"🛸", subjects:["Maths","Mathematics"], topics:["algebra_ca","expressions","algebra"], desc:"Count down and launch! Solve algebra to reach orbit!", minAge:9, levelDesc:["Missing number problems and sequences","Simple equations with one variable","Two-step equations and substitution","Solve equations and express unknowns","Systems of equations and complex algebra"] },
  // ── ENGLISH GAMES ─────────────────────────────────────────────────────────
  { id:"spellBingo",      name:"Spelling Bingo",     emoji:"🎱", subjects:["English","English Language Arts","Language"], topics:["spelling","phonics","foundational"], desc:"Dab the right word on your bingo card!", minAge:5, levelDesc:["CVC and simple phonics words","KS1 common exception words","Year 3-4 statutory spelling list","Year 5-6 statutory spelling list","Advanced etymology and word origins"] },
  { id:"wordShake",       name:"WordShake",          emoji:"🎲", subjects:["English","English Language Arts","Language"], topics:["vocabulary","language_us","vocabulary"], desc:"Shake the letters — make as many words as you can!", minAge:6, levelDesc:["Make 2-3 letter words from a set","Make 3-4 letter words, score for length","Make words with prefixes and suffixes","Make formal and subject vocabulary words","Make the most complex words from letters"] },
  { id:"spotDifference",  name:"Spot the Difference",emoji:"🔍", subjects:["English","English Language Arts","Language"], topics:["reading","reading_lit","reading_ca"], desc:"Find what changed in the story — reading comprehension!", minAge:6, levelDesc:["Spot changed words in simple sentences","Find changed details in short paragraphs","Identify differences in story retellings","Spot subtle changes in complex texts","Analyse how author changes affect meaning"] },
  { id:"puzzleWords",     name:"Word Puzzle",        emoji:"🧩", subjects:["English","English Language Arts","Language"], topics:["writing_us","writing_ca","writing"], desc:"Complete the crossword-style word puzzle!", minAge:7, levelDesc:["Simple crossword with picture clues","Crossword using definitions and examples","Themed crossword with subject vocabulary","Advanced crossword with inference clues","Complex crossword with figurative language"] },
  { id:"schoolRun",       name:"School Run",         emoji:"🏃", subjects:["English","English Language Arts","Language"], topics:["writing_ca","writing_us","writing"], desc:"Race to school — build your story as you run!", minAge:6, levelDesc:["Sequence story events in correct order","Choose best words to continue a story","Select the best sentence to add to a paragraph","Choose the most effective narrative device","Evaluate and select sophisticated writing choices"] },
  { id:"memoryWords",     name:"Memory Match",       emoji:"🧠", subjects:["English","English Language Arts","Language"], topics:["foundational","reading_ca","reading_lit"], desc:"Flip cards and match words to their meanings!", minAge:5, levelDesc:["Match pictures to CVC words","Match words to simple definitions","Match words to synonyms and antonyms","Match formal words to informal equivalents","Match words to their etymological roots"] },
  // ── SCIENCE GAMES ─────────────────────────────────────────────────────────
  { id:"dinosaurGame",    name:"Dino Dig",           emoji:"🦕", subjects:["Science","Science & Technology"], topics:["evolution","life_science","life_systems"], desc:"Excavate fossils — learn about evolution and extinct life!", minAge:8, levelDesc:["Identify basic dinosaurs and prehistoric life","Match fossils to time periods","Understand adaptation and natural selection","Evidence for evolution from the fossil record","Compare extinct and modern species, genetics"] },
  { id:"jungleExplorer",  name:"Jungle Explorer",    emoji:"🌴", subjects:["Science","Science & Technology"], topics:["living","life_science","life_systems","plants"], desc:"Explore the rainforest — identify plants and animals!", minAge:5, levelDesc:["Name jungle animals and their features","Classify animals by vertebrate/invertebrate","Identify adaptations for jungle survival","Explore food webs and ecosystem interdependence","Biodiversity, human impact and conservation"] },
  { id:"oceanGame",       name:"Ocean Adventure",    emoji:"🌊", subjects:["Science","Science & Technology"], topics:["animals","life_science","life_systems"], desc:"Dive deep — sort ocean creatures and food chains!", minAge:5, levelDesc:["Name sea creatures and basic features","Sort by vertebrate/invertebrate, size","Build ocean food chains and webs","Explore deep sea zones and adaptations","Marine ecosystems, pressure, light and survival"] },
  { id:"bubbleBuster",    name:"Bubble Buster",      emoji:"🫧", subjects:["Science","Science & Technology"], topics:["materials","matter_ca","physical_sci"], desc:"Pop the right bubbles — sort materials by properties!", minAge:5, levelDesc:["Sort hard/soft, rough/smooth, waterproof","Identify solids, liquids and gases","Properties of materials: conductors, insulators","Reversible and irreversible changes","Chemical vs physical change, particle model"] },
  { id:"colourScience",   name:"Colour Lab",         emoji:"🎨", subjects:["Science","Science & Technology"], topics:["light","physical_sci","energy_ca"], desc:"Mix colours and explore the science of light!", minAge:7, levelDesc:["Primary and secondary colours mixing","Light sources, reflection and shadows","Refraction, prisms and the spectrum","Wavelengths, filters and colour perception","Optics, lenses and real-world light applications"] },
  { id:"astronautGame",   name:"Astronaut Training", emoji:"👨‍🚀", subjects:["Science","Science & Technology"], topics:["earth","earth_ca","earth_space_us"], desc:"Train to be an astronaut — master Earth and Space facts!", minAge:7, levelDesc:["Name planets, describe day/night and seasons","Solar system facts: order, size, moons","Moon phases, Earth-Moon-Sun relationships","Space exploration history and technology","Gravity, orbits, telescopes and the universe"] },
  // ── HISTORY / SOCIAL STUDIES GAMES ────────────────────────────────────────
  { id:"pyramidsGame",    name:"Pyramid Builder",    emoji:"🏛️", subjects:["History","Social Studies"], topics:["ancient","world_hist_us","world_hist_ca"], desc:"Build the pyramids — answer questions about ancient civilisations!", minAge:7, levelDesc:["Basic facts about ancient Egypt","Compare ancient Egypt, Greece and Rome","Daily life, gods, pharaohs and achievements","Trade, conquest and empire building","Legacy of ancient civilisations on today's world"] },
  { id:"inspectorGame",   name:"History Inspector",  emoji:"🕵️", subjects:["History","Social Studies"], topics:["chronology","us_history","living_memory"], desc:"Investigate the past — sort clues and solve the mystery!", minAge:6, levelDesc:["Order events in a simple story of the past","Use picture clues to identify historical periods","Examine primary sources to answer questions","Compare different accounts of the same event","Evaluate historical significance and reliability"] },
  { id:"hideSeekHistory", name:"History Hide & Seek",emoji:"🫣", subjects:["History","Social Studies"], topics:["significant","us_history","canadian"], desc:"Famous figures are hiding in history — find them from clues!", minAge:5, levelDesc:["Identify famous people from simple clues","Match achievements to historical figures","Understand why people were historically significant","Compare significance of different historical figures","Analyse how individuals changed the course of history"] },
  { id:"tenableGame",     name:"Tenable Challenge",  emoji:"📋", subjects:["History","Social Studies"], topics:["world_history","world_hist_us","world_hist_ca"], desc:"Name 5 answers from the category before time runs out!", minAge:8, levelDesc:["Name 3 items from simple history categories","Name 5 items from national history topics","Name 5 items from world history categories","Name 5 from complex thematic history topics","Expert level — obscure history knowledge challenge"] },
  { id:"footballHistory", name:"Penalty Shootout",   emoji:"⚽", subjects:["History","Social Studies"], topics:["british","us_history","canadian"], desc:"Answer history questions to take your penalty — score or save!", minAge:6, levelDesc:["Basic national history facts","Key events and their dates","Causes and consequences of events","Comparing historical periods and significance","Complex historical analysis and argument"] },
  // ── GEOGRAPHY GAMES ───────────────────────────────────────────────────────
  { id:"worldMapGame",    name:"World Map Quest",    emoji:"🌍", subjects:["Geography","Social Studies"], topics:["world_geo","world_geo_us","world_hist_ca"], desc:"Place countries, capitals and features on the world map!", minAge:6, levelDesc:["Locate 7 continents and 5 oceans","Identify major countries and capital cities","Place countries in correct regions/continents","Locate physical features: rivers, mountains, deserts","Advanced world geography and geopolitical knowledge"] },
  { id:"geographyGuesser", name:"Geography Guesser",  emoji:"📍", subjects:["Geography","Social Studies"], topics:["uk_geo","us_geography","ca_geography"], desc:"Guess the place from the photo clues — GeoGuessr style!", minAge:7, levelDesc:["Identify UK/US/CA regions from clues","Name countries from capital or landmark clues","Identify continents from climate and landscape clues","Advanced country identification from subtle clues","Expert geographer — obscure places worldwide"] },
  { id:"skiingGeo",       name:"Ski Slope Race",     emoji:"⛷️", subjects:["Geography","Social Studies"], topics:["physical","human","world_geo"], desc:"Ski down the mountain — answer physical geography questions!", minAge:7, levelDesc:["Name physical features: mountains, rivers, valleys","Describe how physical features are formed","Explain weathering, erosion and deposition","Analyse climate zones and their causes","Complex physical processes and human impact"] },
  { id:"skateboardGeo",   name:"Skatepark City",     emoji:"🛹", subjects:["Geography","Social Studies"], topics:["human","human_geography","economics_us"], desc:"Skate the city — learn about human geography!", minAge:7, levelDesc:["Compare village, town and city differences","Identify land use types in settlements","Explain how cities grow and change","Analyse economic activities and trade","Urbanisation, globalisation and global development"] },
  { id:"pirateGeo",       name:"Pirate Voyage",      emoji:"🏴‍☠️", subjects:["Geography","Social Studies"], topics:["maps","fieldwork","map_skills"], desc:"Use map skills to navigate to the pirate treasure!", minAge:5, levelDesc:["Follow compass directions N/S/E/W","Use a simple grid to find locations","Read 4-figure grid references on OS maps","Use 6-figure grid references and contour lines","Analyse complex OS maps and plan routes"] },
  { id:"busGame",         name:"Eco Bus Driver",     emoji:"🚌", subjects:["Geography","Social Studies"], topics:["environment","environmental","economics_ca"], desc:"Drive your eco bus — learn about environmental geography!", minAge:8, levelDesc:["Identify types of pollution and their causes","Understand deforestation and habitat loss","Explain climate change and greenhouse gases","Evaluate renewable vs non-renewable energy","Assess global sustainability solutions and trade-offs"] },
  // ── COMPUTING GAMES ───────────────────────────────────────────────────────
  { id:"codeGame",        name:"Code Breaker",       emoji:"🔐", subjects:["Computing","Computer Studies"], topics:["data","data_us","data_ca2"], desc:"Crack the code — learn binary and how computers store data!", minAge:7, levelDesc:["Binary 0s and 1s, simple on/off patterns","Convert small binary numbers to decimal","Understand bytes, files and file sizes","Binary arithmetic and hexadecimal basics","Data compression, encryption and storage systems"] },
  { id:"flippingFood",    name:"Recipe Robot",       emoji:"🍳", subjects:["Computing","Computer Studies"], topics:["comp_thinking","comp_think_ca","comp_thinking"], desc:"Program the robot chef — sequence algorithms to cook meals!", minAge:5, levelDesc:["Order simple cooking instructions correctly","Identify the error in a cooking algorithm","Add loops to repeat cooking steps efficiently","Write conditional steps: if burnt then remove","Create efficient cooking algorithms with functions"] },
  // ── MISSING TOPIC GAMES ──────────────────────────────────────────────────
  { id:"shapeShooter",    name:"Shape Shooter",      emoji:"📐", subjects:["Maths","Math","Mathematics"], topics:["geometry","geometry_us","spatial"], desc:"Shoot the correct shapes and angles!", minAge:5, levelDesc:["Name 2D and 3D shapes","Properties of shapes: sides, vertices, angles","Angles: right, acute, obtuse — classify triangles","Area and perimeter of polygons","Circles, compound shapes, geometric reasoning"] },
  { id:"coordinateQuest", name:"Coordinate Quest",   emoji:"🧭", subjects:["Maths","Math","Mathematics"], topics:["position","geometry_us","spatial"], desc:"Navigate the grid and plot coordinates!", minAge:6, levelDesc:["Describe position: left, right, up, down","First quadrant coordinates (x,y)","Translate and reflect shapes on a grid","Four-quadrant coordinates, negative numbers","Transformations: rotation, reflection, translation"] },
  { id:"ratioRecipe",     name:"Ratio Kitchen",      emoji:"⚖️", subjects:["Maths","Math","Mathematics"], topics:["ratio","number_system","fractions"], desc:"Scale recipes up and down using ratio!", minAge:9, levelDesc:["Simple ratios — share in given parts","Simplify ratios, equivalent ratios","Scale factor problems in recipes and maps","Ratio and proportion word problems","Percentage, fraction and ratio combined problems"] },
  { id:"poetrySlam",      name:"Poetry Slam",        emoji:"🎤", subjects:["English","English Language Arts","Language"], topics:["poetry","writing","writing_us","writing_ca"], desc:"Perform the poem! Identify rhyme, rhythm and poetic devices!", minAge:7, levelDesc:["Identify rhyming words and simple rhyme schemes","Spot alliteration and onomatopoeia","Identify similes and metaphors","Analyse personification, repetition and imagery","Evaluate poetic form, structure and voice"] },
  { id:"mediaDetective",  name:"Media Detective",    emoji:"📱", subjects:["English","English Language Arts","Language"], topics:["media","reading_info","media_ca"], desc:"Investigate adverts and news — spot fact from opinion!", minAge:7, levelDesc:["Spot the difference between fact and opinion","Identify the purpose of different media texts","Analyse how adverts persuade","Evaluate reliability of online sources","Examine bias, representation and media influence"] },
  { id:"seasonsGame",     name:"Seasons Explorer",   emoji:"🌤️", subjects:["Science","Science & Technology"], topics:["seasons","earth_ca","earth_space_us"], desc:"Travel through the seasons — match weather, plants and animals!", minAge:4, levelDesc:["Name the four seasons and their weather","Match seasonal changes: trees, animals, day length","Explain why seasons happen — Earth's tilt","Compare climates and seasons around the world","Seasonal adaptations and biomes by latitude"] },
  { id:"soundWaves",      name:"Sound Waves",        emoji:"🎵", subjects:["Science","Science & Technology"], topics:["sound","energy_ca","physical_sci"], desc:"Create sound waves — answer questions about pitch and volume!", minAge:7, levelDesc:["Sounds are made by vibrations","Loud/quiet: volume; high/low: pitch","How sound travels through materials","Insulation, echoes and the ear drum","Speed of sound, ultrasound and real-world uses"] },
  { id:"circuitBuilder",  name:"Circuit Builder",    emoji:"⚡", subjects:["Science","Science & Technology"], topics:["electricity","energy_ca","physical_sci"], desc:"Build circuits by answering questions correctly!", minAge:8, levelDesc:["Identify everyday uses of electricity, safety rules","Build a simple circuit: battery, bulb, wire, switch","Conductors and insulators — test materials","Series circuits: voltage, brightness, resistance","Circuit diagrams, symbols and electrical calculations"] },
  { id:"chemistryLab",    name:"Chemistry Lab",      emoji:"🧫", subjects:["Science","Science & Technology"], topics:["properties2","matter_ca","physical_sci"], desc:"Mix chemicals safely — identify reversible and irreversible changes!", minAge:9, levelDesc:["Reversible changes: dissolving, melting, freezing","Separating mixtures: filtering, evaporating, sieving","Irreversible changes: burning, rusting, cooking","Particles in reactions, new substances formed","Combustion, oxidation and chemical equations intro"] },
  { id:"timeMachine",     name:"Time Machine",       emoji:"⏰", subjects:["History","Social Studies"], topics:["beyond_memory","living_memory","chronology"], desc:"Jump in the time machine — explore events beyond living memory!", minAge:5, levelDesc:["Recent events from the last 100 years","Great Fire, Titanic, WW2 — significant past events","Compare life in different historical periods","Understand how historical events shaped today","Evaluate significance of events across different eras"] },
  { id:"localHero",       name:"Local Hero Quest",   emoji:"🏘️", subjects:["History","Social Studies"], topics:["local_history","living_memory","community"], desc:"Discover the history hidden in your local area!", minAge:6, levelDesc:["What has changed in our town or village?","Identify old and new buildings from photographs","Research how local area developed using maps","Use local archives and census records as evidence","Connect local history to national and world events"] },
  { id:"safetyShield",    name:"Safety Shield",      emoji:"🛡️", subjects:["Computing","Computer Studies"], topics:["esafety","digital_citizen","digital_cit_ca"], desc:"Build your safety shield — master online safety!", minAge:5, levelDesc:["What is personal information? What stays private?","Recognise cyberbullying — how to respond and report","Reliable vs unreliable information online","Passwords, privacy settings and staying secure","Digital footprint, rights, and responsible use"] },
  { id:"creativeStudio",  name:"Creative Studio",    emoji:"🎨", subjects:["Computing","Computer Studies"], topics:["creative","impacts","digital_cit_ca"], desc:"Design digital art, music and animations — creative computing!", minAge:7, levelDesc:["Create simple digital drawings and patterns","Animate a sprite or character step by step","Record, edit and improve a digital sound clip","Design a multi-page digital presentation","Create and publish an original multimedia project"] },
  { id:"spellingRun",    name:"Spelling Sprint",   emoji:"✏️", subjects:["English","English Language Arts","Language"], topics:["spelling","phonics","foundational"], desc:"Type the correct spelling as fast as you can!", minAge:5, levelDesc:["CVC words and basic phonics","Year 1-2 common exception words","Year 3-4 statutory spelling list","Year 5-6 statutory spelling list","Etymology and advanced spelling patterns","Prefixes and suffixes from Latin/Greek","Homophones and near-homophones","Silent letters and double letters","Subject-specific vocabulary","Advanced morphological spelling patterns"] },
  { id:"mathSprint",     name:"Maths Sprint",       emoji:"⚡", subjects:["Maths","Math","Mathematics"], topics:["addition","multiplication","number_place","statistics"], desc:"Type the answer to maths questions as fast as you can!", minAge:5, levelDesc:["Addition and subtraction within 20","Times tables: 2s 5s 10s","All times tables to 12×12","Mental division and inverse operations","Mixed operations with decimals","Fraction arithmetic","Percentage calculations","Algebra: find the unknown","Multi-step mental maths","Speed maths: GL Assessment style"] },
  { id:"memoryComputer",  name:"Computer Memory",    emoji:"💾", subjects:["Computing","Computer Studies"], topics:["networks","networks_us","networks_ca"], desc:"Match hardware to its function — memory game style!", minAge:7, levelDesc:["Match basic hardware: keyboard, screen, mouse","Match components to their functions: CPU, RAM","Match network devices to their roles","Match internet terms to their meanings","Match cybersecurity terms to their descriptions"] },
];

// Get games for a child based on their country and level
function getGamesForChild(child) {
  const country = child.country || "UK";
  const subjectNames = getSubjects(country);
  return GAMES.filter(g => {
    const subjectMatch = g.subjects.some(s => subjectNames.includes(s));
    return subjectMatch && g.minAge <= child.age;
  });
}

// Get game difficulty level for a child based on their subject levels
function getGameLevel(child, game) {
  const subjectLevels = game.subjects.map(s => {
    const subLvl = child.level?.[s] || 1;
    const topicLvls = Object.values(child.topicLevels?.[s] || {});
    const maxTopic = topicLvls.length > 0 ? Math.max(...topicLvls) : 1;
    return Math.max(subLvl, maxTopic);
  });
  return Math.min(10, Math.max(1, Math.max(...subjectLevels)));
}



// ── ENDLESS Q&A ENGINE ───────────────────────────────────────────────────
// Powers all themed Q&A games with lives, progressive difficulty and level sync
function useEndlessGame({child, subject, promptFn, initialLevel=1}) {
  const MAX_LIVES=3;
  const [questions,setQuestions]=useState([]);
  const [qIdx,setQIdx]=useState(0);
  const [lives,setLives]=useState(MAX_LIVES);
  const [score,setScore]=useState(0);
  const [streak,setStreak]=useState(0);
  const [diffLevel,setDiffLevel]=useState(initialLevel);
  const [loading,setLoading]=useState(true);
  const [done,setDone]=useState(false);
  const [loadErr,setLoadErr]=useState(false);
  const fetchingRef=useRef(false);

  const fetchBatch=useCallback(async(lvl)=>{
    if(fetchingRef.current) return;
    fetchingRef.current=true;
    setLoading(true);
    const t=setTimeout(()=>{setLoadErr(true);setLoading(false);},12000);
    try {
      const batch=await claude(promptFn(child,lvl),"Generate next batch of game questions.");
      clearTimeout(t);
      if(batch?.questions?.length){
        setQuestions(prev=>[...prev,...batch.questions]);
      } else {
        setLoadErr(true);
      }
    } catch(e){setLoadErr(true);}
    setLoading(false);
    fetchingRef.current=false;
  },[child,promptFn]);

  // Initial load
  useEffect(()=>{ fetchBatch(diffLevel); },[]);

  // Prefetch when running low
  useEffect(()=>{
    if(questions.length>0&&qIdx>=questions.length-3&&!fetchingRef.current&&!done){
      fetchBatch(diffLevel);
    }
  },[qIdx,questions.length,diffLevel,done]);

  const currentQ = questions[qIdx]||null;

  const answer=(opt)=>{
    if(!currentQ||done) return;
    const correct=opt.charAt(0)===currentQ.correct;
    if(correct){
      setScore(s=>s+1);
      const newStreak=streak+1;
      setStreak(newStreak);
      // Level up every 5 correct in a row
      if(newStreak>0&&newStreak%5===0){
        setDiffLevel(l=>l+1);
      }
    } else {
      setStreak(0);
      const newLives=lives-1;
      setLives(newLives);
      if(newLives<=0){
        setDone(true);
        return;
      }
    }
    setQIdx(i=>i+1);
    return correct;
  };

  const xpEarned=score*10+Math.max(0,diffLevel-initialLevel)*20;

  return {currentQ,lives,score,streak,diffLevel,loading,loadErr,done,answer,xpEarned,total:qIdx+1};
}




// ══════════════════════════════════════════════════════════════════
// GAME JUICE SYSTEM — Sound + Haptics + Flash + Combo
// Research: "Sound is 50% of experience" (Swink, 2009)
// "Immediate feedback triggers dopamine retention" (Schell, 2019)
// ══════════════════════════════════════════════════════════════════

// ── Sound engine (Web Audio API, zero files needed) ───────────────
const _audioCtx = { ref: null };
function _getAudio() {
  if(!_audioCtx.ref) {
    try { _audioCtx.ref = new (window.AudioContext||window.webkitAudioContext)(); } catch(e){}
  }
  return _audioCtx.ref;
}
function _tone(freq, type, start, dur, vol, ctx) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + dur + 0.01);
  } catch(e) {}
}
// Parent/child mute preference — persisted across visits
const SOUND_PREF={muted:(()=>{try{return localStorage.getItem("adaptMuted")==="1";}catch(e){return false;}})()};
function setMuted(m){SOUND_PREF.muted=m;try{localStorage.setItem("adaptMuted",m?"1":"0");}catch(e){}}
// Healthy-play tally: questions answered this sitting (feeds the break nudge)
const PLAY_TALLY={qs:0,shownAt:0};

function playSound(type) {
  if(A11Y_LIVE.current.noAudio||SOUND_PREF.muted) return; // needs or preference: silent
  const ctx = _getAudio();
  if(!ctx) return;
  try { if(ctx.state === 'suspended') ctx.resume(); } catch(e){}
  if(type==='correct') {
    // Happy ascending chime — C E G (major chord arpeggio)
    [[523,0],[659,0.1],[784,0.2]].forEach(([f,t])=>_tone(f,'sine',t,0.18,0.22,ctx));
  } else if(type==='wrong') {
    // Low descending buzz
    _tone(280,'sawtooth',0,0.12,0.15,ctx);
    _tone(220,'sawtooth',0.08,0.12,0.10,ctx);
  } else if(type==='combo3') {
    // Short sparkle — rising 4 notes
    [[440,0],[554,0.07],[659,0.14],[880,0.21]].forEach(([f,t])=>_tone(f,'triangle',t,0.12,0.15,ctx));
  } else if(type==='combo5') {
    // Bigger fanfare
    [[523,0],[659,0.07],[784,0.14],[1047,0.21],[1319,0.28]].forEach(([f,t])=>_tone(f,'sine',t,0.15,0.20,ctx));
  } else if(type==='levelup') {
    // Victory sequence
    [[392,0],[494,0.1],[587,0.2],[784,0.3],[988,0.4],[1175,0.5]].forEach(([f,t])=>_tone(f,'sine',t,0.2,0.25,ctx));
  } else if(type==='tap') {
    // Subtle click
    _tone(800,'sine',0,0.04,0.06,ctx);
  } else if(type==='gameover') {
    [[440,0],[392,0.15],[349,0.3],[294,0.5]].forEach(([f,t])=>_tone(f,'triangle',t,0.2,0.12,ctx));
  }
}

// ── Haptic engine (navigator.vibrate) ────────────────────────────
function haptic(type) {
  if(typeof navigator==='undefined'||!navigator.vibrate) return;
  try {
    if(type==='correct')  navigator.vibrate([35]);
    else if(type==='wrong')  navigator.vibrate([70,30,70]);
    else if(type==='combo3') navigator.vibrate([25,15,25,15,40]);
    else if(type==='combo5') navigator.vibrate([20,10,20,10,20,10,60]);
    else if(type==='tap')    navigator.vibrate([8]);
    else if(type==='levelup') navigator.vibrate([30,20,30,20,30,20,80]);
  } catch(e){}
}

// ══════════════════════════════════════════════════════════════════
// ADAPT GAME KIT v2 — "Saturday-morning arcade" quality bar
// One shared interactive core, four hand-drawn SVG worlds.
// Ages 4-6: huge targets, instant reward. 7-9: character + story.
// 9-11: mastery, stars, streaks. All: a mission you can WIN.
// ══════════════════════════════════════════════════════════════════

// ── LOCAL QUESTION ENGINE — procedural maths, no AI, instant, free ──
// Skill games don't need an LLM to ask "6 × 7". Generating locally means
// zero loading screens, zero API cost, and offline tolerance.
const _ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const _shuffle=(arr)=>[...arr].sort(()=>Math.random()-0.5);
function _mcq(qText,answer,distractors){
  const pool=[...new Set(distractors.filter(d=>d!==answer&&d>=0))];
  const opts=[answer,..._shuffle(pool).slice(0,3)];
  let bump=1;
  while(opts.length<4){const f=answer+bump++;if(!opts.includes(f))opts.push(f);}
  const shuffled=_shuffle(opts);
  const letters=["A","B","C","D"];
  return {q:qText,question:qText,options:shuffled.map((o,i)=>`${letters[i]}) ${o}`),correct:letters[shuffled.indexOf(answer)]};
}
function genMathQs(kind,lvl=1,count=15){
  const L=Math.max(1,Math.min(10,lvl));
  const qs=[];
  for(let i=0;i<count;i++){
    if(kind==="tables"){
      const a=_ri(2,Math.min(12,2+L)), b=_ri(2,Math.min(12,3+L));
      qs.push({..._mcq(`${a} × ${b} =`,a*b,[a*b+a,a*b-a,a*(b+1),a*b+_ri(1,3),(a+1)*b]),
        hint:`${a} × ${b} means ${a}, added ${b} times. Try counting in ${a}s!`});
    } else if(kind==="addsub"){
      const hi=10+L*15;
      if(Math.random()<0.5){const a=_ri(2,hi),b=_ri(2,hi);qs.push({..._mcq(`${a} + ${b} =`,a+b,[a+b+1,a+b-1,a+b+10,a+b-10]),
        hint:`Start at ${Math.max(a,b)} and count on ${Math.min(a,b)}.`});}
      else{const a=_ri(5,hi),b=_ri(1,a-1);qs.push({..._mcq(`${a} − ${b} =`,a-b,[a-b+1,a-b-1,a-b+10,a+b]),
        hint:`Start at ${a} and count back ${b}.`});}
    } else if(kind==="algebra"){
      const x=_ri(1,4+L*2), a=_ri(1,5+L*3);
      if(Math.random()<0.5)qs.push({..._mcq(`x + ${a} = ${x+a},  x =`,x,[x+1,x-1,x+2,a]),
        hint:`What number plus ${a} makes ${x+a}?`});
      else{const m=_ri(2,Math.min(9,2+L));qs.push({..._mcq(`${m} × x = ${m*x},  x =`,x,[x+1,x-1,m,x+m]),
        hint:`${m} times what makes ${m*x}?`});}
    } else { // mixed
      qs.push(genMathQs(["tables","addsub"][_ri(0,1)],L,1)[0]);
    }
  }
  return qs;
}

// ── QUALITY GUARD: a malformed AI question must never reach a child ─
function sanitizeQs(qs){
  return (qs||[]).filter(q=>{
    if(!q)return false;
    const text=String(q.q||q.question||"").trim();
    if(!text)return false;
    // Reject anything that looks like leaked JSON/code rather than a question
    if(text.startsWith("{")||text.startsWith("[")||text.includes('"options"')||text.includes("```"))return false;
    return Array.isArray(q.options)&&q.options.length>=2&&q.options.length<=6
      &&q.options.every(o=>typeof o==="string"&&o.length>0&&o.length<80&&!o.includes("{")&&!o.includes("}"))
      &&q.correct
      &&q.options.some(o=>o===q.correct||String(o).charAt(0)===q.correct);
  });
}

// ── QUESTION BANK CACHE — AI generates once, every child reuses ────
// Banks batches in localStorage per (game, cohort, level). Instant start
// after the first run; a background top-up keeps banks fresh and varied.
function _qbKey(key,lvl){return `adaptQB:${key}:${lvl}`;}
function _qbRead(key,lvl){try{const r=JSON.parse(localStorage.getItem(_qbKey(key,lvl))||"null");return Array.isArray(r?.qs)?r.qs:[];}catch(e){return [];}}
function _qbWrite(key,lvl,qs){try{localStorage.setItem(_qbKey(key,lvl),JSON.stringify({qs:qs.slice(-60),ts:Date.now()}));}catch(e){}}
function _qbMerge(key,lvl,fresh){
  const cur=_qbRead(key,lvl);
  const seen=new Set(cur.map(q=>q.q||q.question));
  const merged=[...cur,...sanitizeQs(fresh).filter(q=>!seen.has(q.q||q.question))];
  _qbWrite(key,lvl,merged);
  return merged;
}
// Audit pipeline: a flagged question is removed from every local bank
function purgeQuestionFromBanks(qText){
  try{
    for(let i=localStorage.length-1;i>=0;i--){
      const k=localStorage.key(i);
      if(!k||!k.startsWith("adaptQB:"))continue;
      const r=JSON.parse(localStorage.getItem(k)||"null");
      if(!r?.qs)continue;
      const filtered=r.qs.filter(q=>(q.q||q.question)!==qText);
      if(filtered.length!==r.qs.length)localStorage.setItem(k,JSON.stringify({...r,qs:filtered}));
    }
  }catch(e){}
}

async function cachedFetch(cacheKey,lvl,fetcher){
  const bank=_qbRead(cacheKey,lvl);
  if(bank.length>=24){
    // Instant start from the bank; refresh quietly in the background
    fetcher(lvl).then(b=>{if(b?.questions)_qbMerge(cacheKey,lvl,b.questions);}).catch(()=>{});
    return {questions:_shuffle(bank).slice(0,15)};
  }
  const fresh=await fetcher(lvl);
  if(fresh?.questions?.length)_qbMerge(cacheKey,lvl,fresh.questions);
  return fresh;
}

const MISSION_LEN = 12; // questions per trail "sector" — play is endless, until 3 hearts are lost

// High-score context: GamePlayer provides {gameId, best}; engines + GameEnd read it
const GameCtx = React.createContext(null);
const useGameCtx = () => React.useContext(GameCtx) || {};

// ── Missing-infra fix: the lives/mission game hook ────────────────
function useLivesGame(fetchFn, initialLevel = 1, maxLives = 3) {
  const A = useGameA11y();
  const missionLen = A.shorterSessions ? 8 : MISSION_LEN; // ADHD: shorter, winnable bursts
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [lives, setLives] = useState(maxLives);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lvl, setLvl] = useState(initialLevel);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState(false);
  const [done, setDone] = useState(false);
  const [won, setWon] = useState(false);
  const fetching = useRef(false);

  const fetchBatch = useCallback(async (level) => {
    if (fetching.current) return;
    fetching.current = true;
    setLoading(true);
    const t = setTimeout(() => { setLoadErr(true); setLoading(false); fetching.current = false; }, 15000);
    try {
      const batch = await fetchFn(level);
      clearTimeout(t);
      const clean = sanitizeQs(batch?.questions);
      if (clean.length) setQuestions(prev => [...prev, ...clean]);
      else setLoadErr(true);
    } catch (e) { clearTimeout(t); setLoadErr(true); }
    setLoading(false);
    fetching.current = false;
  }, [fetchFn]);

  useEffect(() => { fetchBatch(initialLevel); }, []);
  // Prefetch next batch when running low
  useEffect(() => {
    if (questions.length > 0 && qIdx >= questions.length - 3 && !fetching.current && !done && !loadErr) fetchBatch(lvl);
  }, [qIdx, questions.length, lvl, done, loadErr]);

  const q = questions[qIdx] || null;

  const answer = (ok) => {
    if (done) return;
    PLAY_TALLY.qs++;
    if (ok) {
      const ns = streak + 1;
      setScore(s => s + 1); setStreak(ns); setBestStreak(b => Math.max(b, ns));
      if (ns > 0 && ns % 5 === 0) setLvl(l => Math.min(10, l + 1));
    } else {
      setStreak(0);
      const nl = lives - 1;
      setLives(nl);
      if (nl <= 0) { setDone(true); return; }
    }
    const ni = qIdx + 1;
    setQIdx(ni); // endless: play continues until all 3 hearts are lost
  };

  const sector = Math.floor(qIdx / missionLen); // 12-question "sectors" for the trail
  return { q, qIdx, score, lives, maxLives, streak, bestStreak, lvl, loading, loadErr, done, won, setDone, answer, missionLen, sector };
}

// ── World themes — each engine is a different place ───────────────
const WORLDS = {
  cosmic: { role:"Space Cadet", roleEmoji:"🚀", hook:"Every right answer powers the rocket!", verb:"BLAST OFF",
    sky:"linear-gradient(180deg,#050818 0%,#0D1230 45%,#1B1464 80%,#2D1B69 100%)", accent:"#7C6CFF", accent2:"#FFD166" },
  grove:  { role:"Gem Keeper", roleEmoji:"🦉", hook:"Catch a magic gem for every right answer!", verb:"START THE HUNT",
    sky:"linear-gradient(180deg,#0A1030 0%,#14205A 40%,#1D3A6E 75%,#274B63 100%)", accent:"#4ADE80", accent2:"#FDE68A" },
  turbo:  { role:"Turbo Racer", roleEmoji:"🏎️", hook:"Right answers make your kart go faster!", verb:"START YOUR ENGINE",
    sky:"linear-gradient(180deg,#2B1055 0%,#7A2E6F 40%,#E85D75 72%,#FFB65C 100%)", accent:"#FF5D73", accent2:"#FFD166" },
  meteor: { role:"Sky Defender", roleEmoji:"🛡️", hook:"Tap the right meteor before it hits the shield!", verb:"DEFEND",
    sky:"linear-gradient(180deg,#1A0B2E 0%,#3B1155 45%,#6B1E63 80%,#93326B 100%)", accent:"#F0ABFC", accent2:"#FFD166" },
  starmap:{ role:"Star Pilot", roleEmoji:"🛸", hook:"Fly planet to planet — answer to jump!", verb:"LAUNCH",
    sky:"radial-gradient(ellipse at 50% 0%,#2D1B69 0%,#120A38 45%,#04030F 100%)", accent:"#60A5FA", accent2:"#F0ABFC" },
};

// ── Answer tile palette: friendly toy colours + darker "clay" base ─
const TILE = [
  { top:"#FF6B81", base:"#D14059", glow:"rgba(255,107,129,0.45)" },
  { top:"#4D9DF7", base:"#2C6FC4", glow:"rgba(77,157,247,0.45)" },
  { top:"#FFB020", base:"#CC7F00", glow:"rgba(255,176,32,0.45)" },
  { top:"#34C77B", base:"#1F9457", glow:"rgba(52,199,123,0.45)" },
];
const LETTERS = ["A","B","C","D","E","F"];

// ── Shared FX (kept API-compatible with older code) ────────────────
function FlashOverlay({type}) {
  const A=useGameA11y();
  if(!type||A.noMotion||A.reducedMotion) return null; // photosensitive epilepsy: never flash
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:500,
    background:type==='correct'?"rgba(52,199,123,0.28)":A.noRedFeedback?"rgba(100,116,139,0.18)":"rgba(255,93,115,0.26)",
    animation:`${type==='correct'?"flashGreen":"flashRed"} 0.4s ease forwards`}}/>;
}

const COMBO_MSGS = {
  3:  {text:"3 IN A ROW!", sub:"You're on fire", emoji:"🔥", bg:"linear-gradient(135deg,#F59E0B,#EA580C)"},
  5:  {text:"SUPER STREAK!", sub:"5 in a row — level up!", emoji:"⚡", bg:"linear-gradient(135deg,#8B5CF6,#6D28D9)"},
  7:  {text:"UNSTOPPABLE!", sub:"7 straight!", emoji:"🚀", bg:"linear-gradient(135deg,#3B82F6,#1D4ED8)"},
  10: {text:"LEGENDARY!", sub:"Perfect 10!", emoji:"👑", bg:"linear-gradient(135deg,#EC4899,#BE185D)"},
};
function ComboDisplay({streak, visible}) {
  const m = COMBO_MSGS[[10,7,5,3].find(n=>streak===n)];
  if(!m||!visible) return null;
  return(
    <div style={{position:"fixed",top:"33%",left:"50%",zIndex:300,pointerEvents:"none",
      background:m.bg,borderRadius:24,padding:"16px 30px",border:"3px solid rgba(255,255,255,0.55)",
      boxShadow:"0 14px 44px rgba(0,0,0,0.5)",animation:"comboIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
      <p style={{fontSize:34,textAlign:"center",lineHeight:1,marginBottom:4,animation:"wiggle 0.6s ease infinite"}}>{m.emoji}</p>
      <p style={{fontSize:24,fontWeight:900,color:"#fff",textAlign:"center",fontFamily:F,letterSpacing:"0.04em",textShadow:"0 3px 0 rgba(0,0,0,0.25)",whiteSpace:"nowrap"}}>{m.text}</p>
      <p style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.85)",textAlign:"center",fontFamily:F}}>{m.sub}</p>
    </div>
  );
}

// Process praise (Dweck): praise the thinking and effort, never the person —
// "you worked it out" builds resilience; "you're a genius" builds fear of failing.
const CORRECT_MSGS=["Great thinking!","You worked it out!","Brilliant effort!","Strong focus!","You figured it out!","Smart strategy!","Sharp spotting!","Your practice shows!"];
const WRONG_MSGS=["Keep going!","Good try!","So close!","You've got this!","Learning happens here!","Try a new way!"];
function EncourageBanner({ok, visible, qIdx}) {
  if(!visible) return null;
  const msgs = ok ? CORRECT_MSGS : WRONG_MSGS;
  return(
    <div style={{position:"fixed",bottom:"26%",left:"50%",zIndex:300,pointerEvents:"none",
      background:ok?"linear-gradient(135deg,#22C55E,#15803D)":"rgba(71,85,105,0.95)",
      borderRadius:999,padding:"10px 26px",border:"2px solid rgba(255,255,255,0.4)",
      boxShadow:"0 6px 24px rgba(0,0,0,0.4)",animation:"encourageIn 0.3s ease forwards"}}>
      <p style={{fontSize:18,fontWeight:900,color:"#fff",fontFamily:F,whiteSpace:"nowrap",textShadow:"0 2px 0 rgba(0,0,0,0.2)"}}>
        {ok?"⭐ ":"💪 "}{msgs[qIdx%msgs.length]}
      </p>
    </div>
  );
}

function ParticleBurst({active}) {
  if(!active) return null;
  return(
    <div style={{position:"fixed",top:"42%",left:"50%",pointerEvents:"none",zIndex:100}}>
      {[...Array(18)].map((_,i)=>{
        const shapes=["★","●","✦","▲"];
        return(
          <div key={i} style={{position:"absolute",left:0,top:0,transform:`rotate(${i*(360/18)}deg)`}}>
            <span style={{display:"inline-block",fontSize:i%3===0?16:11,
              color:["#FFD166","#FF6B81","#4ADE80","#7C6CFF","#4D9DF7","#F0ABFC"][i%6],
              animation:`particleFly 0.75s ease ${i*0.02}s forwards`,opacity:0}}>{shapes[i%4]}</span>
          </div>
        );
      })}
    </div>
  );
}

function ScorePop({show,text="+XP"}) {
  if(!show) return null;
  return <div style={{position:"fixed",top:"36%",left:"50%",transform:"translateX(-50%)",
    fontSize:30,fontWeight:900,color:"#FFD166",zIndex:200,pointerEvents:"none",fontFamily:F,
    textShadow:"0 3px 0 rgba(0,0,0,0.4), 0 0 24px rgba(255,209,102,0.6)",
    animation:"scoreFloat 0.9s ease forwards",whiteSpace:"nowrap"}}>{text}</div>;
}

// ── Mission journey — 12 stops, the child SEES the adventure ──────
function MissionTrail({qIdx, score, accent, total=MISSION_LEN}) {
  const A=useGameA11y();
  const pos=qIdx%total, sector=Math.floor(qIdx/total);
  return(
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px 2px"}}>
      {sector>0&&<div style={{flexShrink:0,background:"rgba(255,209,102,0.16)",border:"1.5px solid rgba(255,209,102,0.5)",
        borderRadius:9,padding:"2px 8px"}}>
        <p style={{fontSize:10,fontWeight:900,color:"#FFD166",fontFamily:F,whiteSpace:"nowrap"}}>⭐×{sector}</p>
      </div>}
      <div style={{display:"flex",alignItems:"center",flex:1}}>
      {[...Array(total)].map((_,i)=>{
        const donePt = i < pos, cur = i === pos;
        return(
          <div key={i} style={{display:"flex",alignItems:"center",flex:i<total-1?1:"none"}}>
            <div style={{width:cur?18:12,height:cur?18:12,borderRadius:"50%",flexShrink:0,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,
              background:donePt?"#FFD166":cur?accent:"rgba(255,255,255,0.14)",
              border:cur?"2px solid rgba(255,255,255,0.9)":"2px solid transparent",
              boxShadow:donePt?"0 0 8px rgba(255,209,102,0.7)":cur?`0 0 12px ${accent}`:"none",
              transition:"all 0.35s",animation:A.noMotion?"none":cur?"pulse 1.4s ease infinite":donePt?"progressPop 0.4s ease":"none"}}>
              {donePt?"★":""}
            </div>
            {i<total-1&&<div style={{height:3,flex:1,borderRadius:2,margin:"0 1px",
              background:i<pos?"linear-gradient(90deg,#FFD166,#FDBA45)":"rgba(255,255,255,0.1)",transition:"background 0.35s"}}/>}
          </div>
        );
      })}
      </div>
    </div>
  );
}

// ── Hearts that pop when lost ──────────────────────────────────────
function HeartRow({lives,max=3}) {
  return(
    <div style={{display:"flex",gap:3}}>
      {[...Array(max)].map((_,i)=>(
        <span key={`${i}-${i<lives}`} style={{fontSize:17,
          filter:i<lives?"drop-shadow(0 0 5px rgba(255,93,115,0.9))":"grayscale(1) opacity(0.25)",
          animation:i<lives?"none":"heartLose 0.5s ease",transition:"filter 0.3s",display:"inline-block"}}>
          {i<lives?"❤️":"💔"}
        </span>
      ))}
    </div>
  );
}

// ── Game chrome: header with hearts, streak flame, score gem ──────
function GameHeader({name,emoji,score,lives,maxLives=3,level,onQuit,narrative,qIdx,streak=0,scoreLabel="SCORE"}) {
  const {best=0}=useGameCtx();
  return(
    <div style={{padding:"10px 14px 6px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:5}}>
      <div style={{display:"flex",alignItems:"center",gap:9,minWidth:0}}>
        <div style={{width:40,height:40,borderRadius:13,background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.2)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,backdropFilter:"blur(6px)"}}>{emoji}</div>
        <div style={{minWidth:0}}>
          <p style={{fontSize:13,fontWeight:900,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:118,fontFamily:F,textShadow:"0 1px 3px rgba(0,0,0,0.5)"}}>{name}</p>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <HeartRow lives={lives} max={maxLives}/>
            {streak>=2&&<span style={{fontSize:11,fontWeight:900,color:"#FDBA45",fontFamily:F,
              animation:"flameFlicker 0.7s ease infinite",textShadow:"0 0 8px rgba(253,186,69,0.8)"}}>🔥{streak}</span>}
          </div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
        {best>0&&<div style={{background:"rgba(0,0,0,0.35)",borderRadius:13,padding:"4px 10px",textAlign:"center",border:"1.5px solid rgba(240,171,252,0.45)",backdropFilter:"blur(6px)"}}>
          <p style={{fontSize:13,fontWeight:900,color:"#F0ABFC",lineHeight:1.15,fontFamily:F}}>{best}</p>
          <p style={{fontSize:7,color:"rgba(240,171,252,0.7)",fontWeight:800,letterSpacing:"0.12em",fontFamily:F}}>BEST</p>
        </div>}
        <div style={{background:"rgba(0,0,0,0.35)",border:"1.5px solid rgba(255,209,102,0.5)",borderRadius:13,padding:"4px 12px",textAlign:"center",backdropFilter:"blur(6px)"}}>
          <p style={{fontSize:17,fontWeight:900,color:"#FFD166",lineHeight:1.05,fontFamily:F,textShadow:"0 0 10px rgba(255,209,102,0.5)"}}><AnimScore value={score}/></p>
          <p style={{fontSize:7,color:"rgba(255,209,102,0.75)",fontWeight:800,letterSpacing:"0.14em",fontFamily:F}}>{scoreLabel}</p>
        </div>
        <div style={{background:"rgba(0,0,0,0.35)",borderRadius:13,padding:"4px 10px",textAlign:"center",border:"1.5px solid rgba(255,255,255,0.15)",backdropFilter:"blur(6px)"}}>
          <p style={{fontSize:13,fontWeight:900,color:"#fff",lineHeight:1.15,fontFamily:F}}>{level}</p>
          <p style={{fontSize:7,color:"rgba(255,255,255,0.55)",fontWeight:800,letterSpacing:"0.12em",fontFamily:F}}>LEVEL</p>
        </div>
        <MuteBtn/>
        <button onClick={onQuit} aria-label="Quit game" style={{background:"rgba(0,0,0,0.35)",border:"1.5px solid rgba(255,255,255,0.18)",
          color:"rgba(255,255,255,0.75)",borderRadius:11,width:32,height:32,cursor:"pointer",fontFamily:F,fontSize:13,fontWeight:900,backdropFilter:"blur(6px)"}}>✕</button>
      </div>
    </div>
  );
}

// ── Animated score number ──────────────────────────────────────────
function AnimScore({value}) {
  const [disp,setDisp]=useState(value);
  const prev=useRef(value);
  useEffect(()=>{
    if(value<=prev.current){setDisp(value);prev.current=value;return;}
    let cur=prev.current;
    const step=()=>{cur++;setDisp(cur);if(cur<value)requestAnimationFrame(step);};
    requestAnimationFrame(step);
    prev.current=value;
  },[value]);
  return <span>{disp}</span>;
}

// ── Question card — big type, character reacts ─────────────────────
function QuestionCard({question,narrative,qIdx,lvl,mascot,mascotMood,total=MISSION_LEN,onSpeak,onFlag}) {
  const A=useGameA11y();
  const long=(question||"").length>70;
  const fontFam=A.dyslexiaFont?FDYS:F;
  const size=(long?17:21)+(A.largeText?3:0);
  return(
    <div style={{padding:"8px 14px 0",position:"relative",zIndex:5}}>
      <div key={qIdx} style={{position:"relative",background:A.highContrast?"rgba(0,0,0,0.88)":"rgba(8,12,30,0.55)",backdropFilter:"blur(14px)",
        borderRadius:22,padding:"16px 18px 15px",border:A.highContrast?"2.5px solid rgba(255,255,255,0.5)":"2px solid rgba(255,255,255,0.16)",
        boxShadow:"0 10px 34px rgba(0,0,0,0.45)",animation:A.noMotion?"none":"qSlideIn 0.4s cubic-bezier(0.34,1.4,0.64,1) both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <p style={{fontSize:10.5,fontWeight:900,color:"rgba(255,255,255,0.55)",textTransform:"uppercase",letterSpacing:"0.12em",fontFamily:F}}>
            Question {qIdx+1}
          </p>
          <p style={{fontSize:10.5,fontWeight:900,color:"#FFD166",fontFamily:F,letterSpacing:"0.06em"}}>{narrative?.hook||""}</p>
        </div>
        <p style={{fontSize:size,fontWeight:A.dyslexiaFont?700:900,color:"#fff",lineHeight:A.dyslexiaFont?1.7:1.45,fontFamily:fontFam,
          letterSpacing:A.dyslexiaFont?"0.05em":undefined,textShadow:"0 2px 8px rgba(0,0,0,0.55)"}}>{question}</p>
        {onFlag&&<button onClick={onFlag} aria-label="Report this question"
          style={{position:"absolute",top:8,right:10,background:"none",border:"none",cursor:"pointer",
          fontSize:12,opacity:0.4,padding:4}} title="Something wrong with this question?">⚑</button>}
        {onSpeak&&<button onClick={onSpeak} aria-label="Read the question aloud"
          style={{marginTop:11,padding:"8px 16px",borderRadius:12,cursor:"pointer",fontFamily:F,
          border:"2px solid rgba(255,209,102,0.6)",background:"rgba(255,209,102,0.14)",
          color:"#FFD166",fontWeight:900,fontSize:13}}>🔊 Read aloud</button>}
      </div>
    </div>
  );
}

// ── Chunky toy-button answer grid ──────────────────────────────────
function AnswerGrid({opts,states,locked,onTap,icons}) {
  const A=useGameA11y();
  const oneCol=A.largeTapTargets;             // dyspraxia / visual impairment
  const fontFam=A.dyslexiaFont?FDYS:F;        // dyslexia
  const wrongBg=A.noRedFeedback?"#64748B":"#E5484D"; // anxiety: never harsh red
  const wrongShadow=A.noRedFeedback?"0 3px 0 #475569":"0 3px 0 #A32328";
  return(
    <div style={{padding:"12px 14px 22px",display:"grid",gridTemplateColumns:oneCol?"1fr":"1fr 1fr",gap:oneCol?13:11,position:"relative",zIndex:5}}>
      {opts.map((opt,i)=>{
        const t=TILE[i%4];
        const st=states[opt]||"";
        const isOk=st==="correct",isBad=st==="wrong",isDim=st==="dim";
        const label=String(opt).replace(/^[A-F]\)\s*/,"");
        const base=A.largeText?3:0;
        const fs=(label.length>16?13.5:label.length>9?15.5:19)+base;
        return(
          <button key={`${opt}-${i}`} onClick={()=>!locked&&onTap(opt)} disabled={locked}
            aria-label={`Answer ${LETTERS[i]}: ${label}`}
            style={{
              minHeight:oneCol?78:A.largeText?110:96,borderRadius:20,border:"none",padding:"12px 12px 16px",
              cursor:locked?"default":"pointer",fontFamily:fontFam,position:"relative",
              background:isOk?"#2FBF71":isBad?wrongBg:isDim?"rgba(255,255,255,0.05)":t.top,
              boxShadow:isOk?`0 6px 0 #1D8A50, 0 0 34px rgba(47,191,113,0.75)`:
                        isBad?wrongShadow:
                        isDim?"none":`0 6px 0 ${t.base}, 0 10px 22px ${t.glow}`,
              transform:isOk?"translateY(-4px) scale(1.04)":isBad?"translateY(3px)":isDim?"scale(0.97)":"translateY(0)",
              opacity:isDim?0.22:1,
              transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
              animation:A.noMotion?"none":isOk?"jellyPop 0.55s ease":isBad?"wrongShake 0.45s ease":`floatIn 0.4s ease ${i*0.07}s both`,
            }}>
            {/* Colour blindness: state readable without hue — stripes on wrong, double ring on correct */}
            {A.iconFeedback&&isBad&&<div style={{position:"absolute",inset:0,borderRadius:20,pointerEvents:"none",
              background:"repeating-linear-gradient(45deg,transparent,transparent 9px,rgba(255,255,255,0.22) 9px,rgba(255,255,255,0.22) 13px)"}}/>}
            {A.iconFeedback&&isOk&&<div style={{position:"absolute",inset:5,borderRadius:16,pointerEvents:"none",border:"2.5px dashed rgba(255,255,255,0.9)"}}/>}
            {isOk&&!A.noMotion&&[...Array(6)].map((_,k)=>(
              <span key={k} style={{position:"absolute",left:"50%",top:"50%",pointerEvents:"none",fontSize:13,
                color:["#FFD166","#fff","#FDE68A"][k%3],
                transform:`rotate(${k*60}deg) translateY(-8px)`,
                animation:`particleFly 0.6s ease ${k*0.03}s forwards`}}>★</span>
            ))}
            {isOk&&!A.noMotion&&<div style={{position:"absolute",inset:-3,borderRadius:23,border:"3px solid rgba(255,255,255,0.85)",animation:"ringPulse 0.7s ease infinite",pointerEvents:"none"}}/>}
            <div style={{display:"flex",flexDirection:oneCol?"row":"column",alignItems:"center",justifyContent:oneCol?"flex-start":"center",gap:oneCol?13:7,height:"100%"}}>
              <span style={{width:oneCol?32:27,height:oneCol?32:27,borderRadius:"50%",flexShrink:0,
                background:isOk||isBad?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.22)",
                border:"2px solid rgba(255,255,255,0.55)",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:oneCol?15:13,fontWeight:900,color:"#fff",fontFamily:F}}>
                {isOk?"✓":isBad?"✕":LETTERS[i]}
              </span>
              <p style={{fontSize:fs,fontWeight:A.dyslexiaFont?700:900,color:isDim?"rgba(255,255,255,0.35)":"#fff",
                textAlign:oneCol?"left":"center",lineHeight:1.3,fontFamily:fontFam,
                letterSpacing:A.dyslexiaFont?"0.05em":undefined,
                textShadow:"0 2px 0 rgba(0,0,0,0.22)",wordBreak:"break-word"}}>
                {label}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Mission briefing + 3·2·1·GO countdown ──────────────────────────
function MissionIntro({world,name,emoji,child,onGo,total=MISSION_LEN}) {
  const A=useGameA11y();
  const {best=0}=useGameCtx();
  const [count,setCount]=useState(null); // null=briefing, 3,2,1,0=GO
  useEffect(()=>{
    if(count===null||count<0)return;
    if(count===0){const t=setTimeout(onGo,650);return()=>clearTimeout(t);}
    playSound('tap');
    const t=setTimeout(()=>setCount(c=>c-1),750);
    return()=>clearTimeout(t);
  },[count]);
  const start=()=>{
    playSound('tap');haptic('tap');
    if(A.predictableLayout||A.noMotion) onGo(); // autism/epilepsy: no surprise countdown
    else setCount(3);
  };
  return(
    <div className={A.noMotion?"a11y-still":undefined}
      style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",fontFamily:F,background:world.sky,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden",
      filter:A.calmScheme?"saturate(0.78)":undefined}}>
      {!A.noMotion&&[...Array(30)].map((_,i)=><div key={i} style={{position:"absolute",borderRadius:"50%",
        width:i%6===0?3:1.5,height:i%6===0?3:1.5,background:"#fff",opacity:0.25+(i%5)*0.1,
        top:`${(i*13+7)%95}%`,left:`${(i*17+3)%97}%`,animation:`twinkle ${1.5+i%4}s ease infinite`}}/>)}
      {count===null?(
        <div style={{textAlign:"center",animation:A.noMotion?"none":"zoomIn 0.45s ease both",position:"relative",zIndex:2}}>
          <div style={{fontSize:72,marginBottom:10,animation:A.noMotion?"none":"floatY 2.6s ease-in-out infinite",filter:"drop-shadow(0 10px 24px rgba(0,0,0,0.5))"}}>{emoji}</div>
          <p style={{fontSize:11,fontWeight:900,color:world.accent2,letterSpacing:"0.24em",textTransform:"uppercase",marginBottom:6}}>Your mission</p>
          <h1 style={{fontSize:32,fontWeight:900,color:"#fff",marginBottom:10,textShadow:"0 4px 0 rgba(0,0,0,0.3)",lineHeight:1.1,
            fontFamily:A.dyslexiaFont?FDYS:F}}>{name}</h1>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.25)",
            borderRadius:999,padding:"7px 16px",marginBottom:14,backdropFilter:"blur(8px)"}}>
            <span style={{fontSize:18}}>{world.roleEmoji}</span>
            <p style={{fontSize:13,fontWeight:900,color:"#fff"}}>{child?.name?`${child.name} the ${world.role}`:world.role}</p>
          </div>
          <p style={{fontSize:A.largeText?17:15,fontWeight:800,color:"rgba(255,255,255,0.85)",marginBottom:6,maxWidth:280,marginLeft:"auto",marginRight:"auto",lineHeight:1.5,
            fontFamily:A.dyslexiaFont?FDYS:F}}>{A.simpleLanguage?"Read the question. Tap the right answer.":world.hook}</p>
          <p style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.55)",marginBottom:best>0?8:26}}>Answer as many as you can · 3 hearts · ⭐ every {total}</p>
          {best>0&&<p style={{fontSize:14,fontWeight:900,color:"#F0ABFC",marginBottom:22,textShadow:"0 0 12px rgba(240,171,252,0.5)"}}>🏆 Your record: {best} — can you beat it?</p>}
          <button onClick={start}
            style={{background:`linear-gradient(180deg,${world.accent},${world.accent}dd)`,border:"none",
            boxShadow:`0 7px 0 rgba(0,0,0,0.35), 0 14px 34px ${world.accent}66`,borderRadius:22,
            padding:"18px 46px",cursor:"pointer",fontFamily:F,animation:A.noMotion?"none":"pulse 1.8s ease infinite"}}>
            <p style={{fontSize:20,fontWeight:900,color:"#fff",letterSpacing:"0.08em",textShadow:"0 2px 0 rgba(0,0,0,0.25)"}}>▶ {world.verb}</p>
          </button>
        </div>
      ):(
        <div key={count} style={{textAlign:"center",animation:"countPunch 0.65s cubic-bezier(0.34,1.56,0.64,1) both",position:"relative",zIndex:2}}>
          <p style={{fontSize:count===0?76:120,fontWeight:900,color:count===0?"#FFD166":"#fff",fontFamily:F,
            textShadow:`0 8px 0 rgba(0,0,0,0.3), 0 0 60px ${count===0?"rgba(255,209,102,0.8)":"rgba(255,255,255,0.4)"}`,lineHeight:1}}>
            {count===0?"GO!":count}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Mute toggle — parents demand this in kids' apps ────────────────
function MuteBtn(){
  const [muted,setM]=useState(SOUND_PREF.muted);
  return(
    <button onClick={()=>{const m=!muted;setMuted(m);setM(m);if(!m)playSound('tap');}}
      aria-label={muted?"Unmute sounds":"Mute sounds"}
      style={{background:"rgba(0,0,0,0.35)",border:"1.5px solid rgba(255,255,255,0.18)",
      borderRadius:11,width:32,height:32,cursor:"pointer",fontSize:14,backdropFilter:"blur(6px)"}}>
      {muted?"🔇":"🔊"}
    </button>
  );
}

// ── Loading screen (was missing → crash) ───────────────────────────
function GameLoad({name,emoji,tutor}) {
  const tips=["Read every answer before you pick!","Streaks of 5 level you up!","Wrong answers show you the right one — learn it!","Three stars means 10 or more correct!"];
  const tip=tips[Math.floor(Date.now()/4000)%tips.length];
  return(
    <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",fontFamily:F,
      background:"linear-gradient(180deg,#0D1230,#1B1464)",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      {[...Array(24)].map((_,i)=><div key={i} style={{position:"absolute",borderRadius:"50%",width:2,height:2,
        background:"#fff",opacity:0.3,top:`${(i*13+7)%95}%`,left:`${(i*17+3)%97}%`,animation:`twinkle ${1.5+i%4}s ease infinite`}}/>)}
      <div style={{fontSize:64,marginBottom:16,animation:"bounceY 1s ease-in-out infinite",filter:"drop-shadow(0 8px 20px rgba(0,0,0,0.5))"}}>{emoji}</div>
      <p style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:6}}>{name}</p>
      <p style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.6)",marginBottom:22}}>Building your mission…</p>
      <div style={{width:190,height:10,borderRadius:6,background:"rgba(255,255,255,0.12)",overflow:"hidden",marginBottom:22}}>
        <div style={{height:"100%",width:"45%",borderRadius:6,background:"linear-gradient(90deg,#7C6CFF,#F0ABFC)",animation:"loadSlide 1.1s ease-in-out infinite"}}/>
      </div>
      <div style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:16,padding:"11px 18px",maxWidth:280}}>
        <p style={{fontSize:12.5,fontWeight:800,color:"rgba(255,255,255,0.85)",textAlign:"center",lineHeight:1.5}}>💡 {tip}</p>
      </div>
    </div>
  );
}

// ── Error screen (was missing → crash) ─────────────────────────────
function GameError({name,onRetry}) {
  return(
    <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",fontFamily:F,
      background:"linear-gradient(180deg,#0D1230,#1B1464)",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{fontSize:60,marginBottom:14,animation:"wiggle 1.4s ease infinite"}}>🛰️</div>
      <p style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:8,textAlign:"center"}}>Lost the signal!</p>
      <p style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.65)",marginBottom:24,textAlign:"center",maxWidth:260,lineHeight:1.5}}>
        {name} couldn't load its questions. Check the connection and try again.
      </p>
      <button onClick={onRetry} style={{background:"linear-gradient(180deg,#7C6CFF,#5B4BD4)",border:"none",
        boxShadow:"0 6px 0 #3E2FA8",borderRadius:18,padding:"15px 38px",cursor:"pointer",fontFamily:F}}>
        <p style={{fontSize:16,fontWeight:900,color:"#fff"}}>↻ Try again</p>
      </button>
    </div>
  );
}

// ── Mission complete — stars, XP count-up, confetti ────────────────
function GameEnd({name,emoji,score,max,child,xp,level,onRetry,onDone,sectors=0}) {
  const A=useGameA11y();
  const {best=0}=useGameCtx();
  const isNewBest=score>best&&score>0;
  const total=Math.max(max,1);
  const acc=score/total;
  const stars=acc>=0.85?3:acc>=0.6?2:1;
  const [shownStars,setShownStars]=useState(A.noMotion?stars:0);
  const [xpDisp,setXpDisp]=useState(A.noMotion?xp:0);
  useEffect(()=>{
    if(A.noMotion)return;
    let i=0;
    const t=setInterval(()=>{
      i++;
      if(i<=stars){setShownStars(i);playSound(i===3?'combo5':'combo3');haptic('combo3');}
      else clearInterval(t);
    },480);
    return()=>clearInterval(t);
  },[stars]);
  useEffect(()=>{
    if(A.noMotion)return;
    const start=Date.now(),dur=1100;
    const step=()=>{
      const p=Math.min(1,(Date.now()-start)/dur);
      setXpDisp(Math.round(xp*(1-Math.pow(1-p,3))));
      if(p<1)requestAnimationFrame(step);
    };
    const t=setTimeout(()=>requestAnimationFrame(step),700);
    return()=>clearTimeout(t);
  },[xp]);
  useEffect(()=>{playSound(isNewBest?'levelup':stars>=2?'combo5':'gameover');},[]);
  const showBreak=PLAY_TALLY.qs-PLAY_TALLY.shownAt>=80;
  useEffect(()=>{if(showBreak)PLAY_TALLY.shownAt=PLAY_TALLY.qs;},[]);
  const fontFam=A.dyslexiaFont?FDYS:F;
  const headline=isNewBest?"NEW HIGH SCORE!":stars===3?"AMAZING RUN!":stars===2?"GREAT FLYING!":"GOOD TRY!";
  const sub=isNewBest?`${score} — a new record, ${child?.name||"champion"}! 🏆`
    :best>0?`Your record is ${best} — so close!`
    :stars===3?`Perfect work, ${child?.name||"champion"}!`
    :stars===2?"So close to 3 stars — one more go?":"Every run makes you stronger!";
  return(
    <div className={A.noMotion?"a11y-still":undefined}
      style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",fontFamily:F,
      background:"radial-gradient(ellipse at 50% 20%,#2D1B69,#0D1230 70%)",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden",
      filter:A.calmScheme?"saturate(0.8)":undefined}}>
      {stars>=2&&!A.noMotion&&!A.reducedMotion&&<Confetti count={stars===3?60:30}/>}
      {!A.noMotion&&[...Array(26)].map((_,i)=><div key={i} style={{position:"absolute",borderRadius:"50%",width:2,height:2,
        background:"#fff",opacity:0.3,top:`${(i*13+7)%95}%`,left:`${(i*17+3)%97}%`,animation:`twinkle ${1.5+i%4}s ease infinite`}}/>)}
      <div style={{fontSize:64,marginBottom:6,animation:"badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) both",filter:"drop-shadow(0 10px 24px rgba(0,0,0,0.5))"}}>{emoji}</div>
      {/* Stars */}
      <div style={{display:"flex",gap:10,marginBottom:12,height:60,alignItems:"center"}}>
        {[1,2,3].map(i=>(
          <span key={i} style={{fontSize:i===2?54:42,
            filter:i<=shownStars?"drop-shadow(0 0 16px rgba(255,209,102,0.9))":"grayscale(1) opacity(0.25)",
            animation:i<=shownStars?"starLand 0.5s cubic-bezier(0.34,1.56,0.64,1) both":"none",
            transform:i<=shownStars?"none":"scale(0.8)"}}>⭐</span>
        ))}
      </div>
      <h1 style={{fontSize:30,fontWeight:900,color:"#fff",marginBottom:6,textAlign:"center",
        textShadow:"0 4px 0 rgba(0,0,0,0.3)",animation:"zoomIn 0.5s ease 0.3s both",letterSpacing:"0.02em"}}>{headline}</h1>
      <p style={{fontSize:14,fontWeight:800,color:"rgba(255,255,255,0.7)",marginBottom:22,textAlign:"center",animation:"fadeUp 0.5s ease 0.5s both"}}>{sub}</p>
      {/* Stat cards */}
      <div style={{display:"flex",gap:9,marginBottom:26,animation:"fadeUp 0.5s ease 0.7s both",flexWrap:"wrap",justifyContent:"center"}}>
        {[
          {label:"SCORE",val:score,color:"#4ADE80"},
          {label:isNewBest?"OLD BEST":"BEST",val:isNewBest?(best||"—"):Math.max(best,score)||"—",color:"#F0ABFC"},
          {label:"XP EARNED",val:`+${xpDisp}`,color:"#FFD166"},
          ...(sectors>0?[{label:"SECTORS ⭐",val:sectors,color:"#F59E0B"}]:[]),
          {label:"LEVEL",val:level,color:"#7C6CFF"},
        ].map(s=>(
          <div key={s.label} style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",
            borderRadius:18,padding:"13px 15px",textAlign:"center",minWidth:76,backdropFilter:"blur(8px)"}}>
            <p style={{fontSize:21,fontWeight:900,color:s.color,marginBottom:2,textShadow:`0 0 14px ${s.color}66`}}>{s.val}</p>
            <p style={{fontSize:8.5,fontWeight:800,color:"rgba(255,255,255,0.5)",letterSpacing:"0.14em"}}>{s.label}</p>
          </div>
        ))}
      </div>
      {showBreak&&(
        <div style={{background:"rgba(255,209,102,0.14)",border:"1.5px solid rgba(255,209,102,0.5)",
          borderRadius:16,padding:"12px 18px",marginBottom:18,maxWidth:300,animation:"fadeUp 0.5s ease 0.8s both"}}>
          <p style={{fontSize:13,fontWeight:900,color:"#FFD166",textAlign:"center",marginBottom:3}}>🌟 {PLAY_TALLY.qs} questions today — amazing!</p>
          <p style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.8)",textAlign:"center",lineHeight:1.5}}>Champions rest their brains. A 10-minute break makes you even stronger!</p>
        </div>
      )}
      {isNewBest&&<ShareScore name={name} emoji={emoji} score={score} childName={child?.name}/>}
      <div style={{display:"flex",gap:12,animation:"fadeUp 0.5s ease 0.9s both"}}>
        <button onClick={onRetry} style={{background:"linear-gradient(180deg,#7C6CFF,#5B4BD4)",border:"none",
          boxShadow:"0 6px 0 #3E2FA8",borderRadius:18,padding:"15px 30px",cursor:"pointer",fontFamily:F}}>
          <p style={{fontSize:15,fontWeight:900,color:"#fff"}}>↻ Play again</p>
        </button>
        <button onClick={onDone} style={{background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.25)",
          boxShadow:"0 6px 0 rgba(0,0,0,0.3)",borderRadius:18,padding:"15px 30px",cursor:"pointer",fontFamily:F}}>
          <p style={{fontSize:15,fontWeight:900,color:"#fff"}}>Done ✓</p>
        </button>
      </div>
    </div>
  );
}

// ── Share the peak moment — the cheapest growth loop there is ──────
function ShareScore({name,emoji,score,childName}){
  const [copied,setCopied]=useState(false);
  const text=`${emoji} ${childName||"My child"} just scored ${score} in ${name} on ADAPT! Can you beat it?`;
  const share=async()=>{
    try{
      if(typeof navigator!=="undefined"&&navigator.share){await navigator.share({text});return;}
      if(typeof navigator!=="undefined"&&navigator.clipboard){await navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),2000);}
    }catch(e){/* user cancelled share sheet */}
  };
  return(
    <button onClick={share} style={{marginBottom:16,background:"rgba(240,171,252,0.14)",
      border:"1.5px solid rgba(240,171,252,0.5)",borderRadius:14,padding:"10px 22px",cursor:"pointer",fontFamily:F,
      animation:"fadeUp 0.5s ease 0.85s both"}}>
      <p style={{fontSize:13,fontWeight:900,color:"#F0ABFC"}}>{copied?"✓ Copied!":"📣 Share this record"}</p>
    </button>
  );
}

// ── GameShell — chrome for the standalone arcade games ─────────────
function GameShell({name,emoji,subject,score,maxScore,round,total,streak,onQuit,lives,level,children}) {
  const world=({Maths:WORLDS.cosmic,English:WORLDS.grove,Science:WORLDS.starmap,History:WORLDS.turbo,
    Geography:WORLDS.turbo,Computing:WORLDS.starmap})[subject]||WORLDS.cosmic;
  return(
    <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",fontFamily:F,background:world.sky,position:"relative",overflow:"hidden"}}>
      {[...Array(22)].map((_,i)=><div key={i} style={{position:"absolute",borderRadius:"50%",pointerEvents:"none",
        width:i%6===0?3:1.5,height:i%6===0?3:1.5,background:"#fff",opacity:0.18+(i%5)*0.08,
        top:`${(i*13+5)%60}%`,left:`${(i*17+3)%97}%`,animation:`twinkle ${1.6+i%4}s ease infinite`}}/>)}
      {(streak||0)>=3&&<div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:2,
        boxShadow:`inset 0 0 ${40+Math.min(streak,10)*12}px ${streak>=7?"rgba(255,140,60,0.5)":"rgba(255,209,102,0.38)"}`,
        transition:"box-shadow 0.6s ease"}}/>}
      <GameHeader name={name} emoji={emoji} score={score} lives={lives} level={level}
        onQuit={onQuit} narrative={null} qIdx={(round||1)-1} streak={streak||0}/>
      <div style={{padding:"6px 12px 20px",position:"relative",zIndex:4}}>{children}</div>
    </div>
  );
}

// ── SVG world scenery ──────────────────────────────────────────────
function SceneCosmic({boost,hurt,sector=0}) {
  return(
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {[...Array(40)].map((_,i)=><div key={i} style={{position:"absolute",borderRadius:"50%",
        width:i%7===0?3.5:i%4===0?2.4:1.4,height:i%7===0?3.5:i%4===0?2.4:1.4,
        background:i%6===0?"#B4A7FF":i%4===0?"#7EC3FF":"#fff",opacity:0.15+(i%9)*0.08,
        top:`${(i*7+3)%92}%`,left:`${(i*11+5)%97}%`,
        animation:boost?`warpDown 0.5s linear ${i*0.012}s infinite`:`twinkle ${1.5+i%5}s ease-in-out ${i*0.07}s infinite`}}/>)}
      <div style={{position:"absolute",top:"7%",right:"9%",width:52,height:52,borderRadius:"50%",
        background:"radial-gradient(circle at 34% 30%,#FFE29A,#F5A94B 58%,#B96B22)",opacity:0.9,
        boxShadow:"0 0 30px rgba(245,169,75,0.35)",animation:"floatY 6s ease-in-out infinite"}}>
        <div style={{position:"absolute",top:"46%",left:-9,right:-9,height:8,borderRadius:"50%",
          border:"2.5px solid rgba(255,226,154,0.65)",transform:"rotate(-14deg)"}}/>
      </div>
      <div style={{position:"absolute",top:"30%",left:"6%",width:24,height:24,borderRadius:"50%",
        background:"radial-gradient(circle at 35% 30%,#9FE8D2,#3FA88A)",opacity:0.7,animation:"floatY 8s ease-in-out 1s infinite"}}/>
      {/* New worlds appear as sectors are cleared — the galaxy grows with you */}
      {sector>=1&&<div style={{position:"absolute",top:"18%",left:"38%",width:17,height:17,borderRadius:"50%",
        background:"radial-gradient(circle at 35% 30%,#FBC7E4,#C0518F)",opacity:0.75,animation:"floatY 7s ease-in-out 0.5s infinite"}}/>}
      {sector>=2&&<div style={{position:"absolute",top:"44%",right:"7%",width:20,height:20,borderRadius:"50%",
        background:"radial-gradient(circle at 35% 30%,#BFDBFE,#3B82F6)",opacity:0.75,animation:"floatY 9s ease-in-out 1.5s infinite"}}>
        <div style={{position:"absolute",top:"44%",left:-5,right:-5,height:4,borderRadius:"50%",border:"1.5px solid rgba(191,219,254,0.7)",transform:"rotate(18deg)"}}/>
      </div>}
      {sector>=3&&<div style={{position:"absolute",top:"9%",left:"52%",fontSize:15,opacity:0.9,animation:"floatY 6s ease-in-out infinite"}}>🌟</div>}
      {/* Rocket */}
      <svg viewBox="0 0 90 130" style={{position:"absolute",bottom:-6,left:"50%",width:74,
        transform:`translateX(-50%) ${boost?"translateY(-10px)":""}`,transition:"transform 0.25s",
        filter:hurt?"drop-shadow(0 0 16px rgba(255,93,115,0.95))":"drop-shadow(0 8px 18px rgba(0,0,0,0.55))",
        animation:hurt?"wrongShake 0.45s ease":"floatY 3s ease-in-out infinite"}}>
        <ellipse cx="45" cy="112" rx={boost?17:10} ry={boost?26:14} fill="url(#flameG)" style={{animation:"flameFlicker 0.18s ease infinite"}}/>
        <path d="M45 4 C62 22 66 48 64 82 L26 82 C24 48 28 22 45 4 Z" fill="#E8ECF7"/>
        <path d="M45 4 C56 22 60 48 58 82 L45 82 Z" fill="#C7CEE4"/>
        <path d="M26 62 L10 92 L27 84 Z" fill="#FF5D73"/>
        <path d="M64 62 L80 92 L63 84 Z" fill="#D14059"/>
        <rect x="34" y="82" width="22" height="9" rx="4" fill="#8E97B8"/>
        <circle cx="45" cy="40" r="12" fill="#0D1230" stroke="#7C6CFF" strokeWidth="3.5"/>
        <circle cx="41" cy="36" r="4" fill="#7EC3FF" opacity="0.85"/>
        <path d="M45 4 C52 12 56 20 58 30 L32 30 C34 20 38 12 45 4 Z" fill="#FF5D73"/>
        <defs><radialGradient id="flameG" cx="0.5" cy="0.25" r="0.8">
          <stop offset="0%" stopColor="#FFF6C9"/><stop offset="45%" stopColor="#FFB020"/><stop offset="100%" stopColor="#FF5D2E" stopOpacity="0.15"/>
        </radialGradient></defs>
      </svg>
    </div>
  );
}

function SceneGrove({score,hurt,streak=0}) {
  const gems=Math.min(score,12);
  const flies=Math.min(14+streak*2,26); // the grove wakes up as your streak grows
  return(
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"6%",left:"10%",width:58,height:58,borderRadius:"50%",
        background:"radial-gradient(circle at 38% 34%,#FFFDF2,#F2E9C8 55%,#D8CCA0)",
        boxShadow:`0 0 ${44+Math.min(score,15)*3}px rgba(242,233,200,${0.5+Math.min(score,15)*0.02})`,
        transition:"box-shadow 1s ease"}}/>
      {[...Array(flies)].map((_,i)=><div key={i} style={{position:"absolute",width:4,height:4,borderRadius:"50%",
        background:"#FDE68A",boxShadow:"0 0 8px 2px rgba(253,230,138,0.8)",
        top:`${20+(i*11)%55}%`,left:`${(i*19+8)%92}%`,opacity:0.85,
        animation:`fireflyDrift ${4+i%4}s ease-in-out ${i*0.4}s infinite`}}/>)}
      <svg viewBox="0 0 480 200" preserveAspectRatio="none" style={{position:"absolute",bottom:0,left:0,width:"100%",height:"46%"}}>
        <path d="M0 90 Q60 40 130 78 Q200 116 270 66 Q340 26 410 70 Q450 94 480 80 L480 200 L0 200 Z" fill="#0E2440" opacity="0.85"/>
        <path d="M0 130 Q80 86 160 118 Q250 152 330 112 Q410 78 480 116 L480 200 L0 200 Z" fill="#0A1A30"/>
        {[40,110,185,260,335,415].map((x,i)=>(
          <g key={i} transform={`translate(${x} ${132-(i%3)*10})`} opacity={i%2?0.95:0.8}>
            <path d={`M0 68 L${13+(i%3)*3} 0 L${26+(i%3)*6} 68 Z`} fill="#071120"/>
          </g>
        ))}
        <path d="M0 172 Q120 152 240 166 Q360 180 480 160 L480 200 L0 200 Z" fill="#050C18"/>
      </svg>
      {/* Owl mage */}
      <svg viewBox="0 0 90 100" style={{position:"absolute",bottom:4,left:16,width:72,
        filter:hurt?"drop-shadow(0 0 14px rgba(255,93,115,0.95))":"drop-shadow(0 6px 14px rgba(0,0,0,0.6))",
        animation:hurt?"wrongShake 0.45s ease":"floatY 3.4s ease-in-out infinite"}}>
        <ellipse cx="45" cy="62" rx="26" ry="30" fill="#7B5CC9"/>
        <ellipse cx="45" cy="70" rx="16" ry="19" fill="#C9B8F2"/>
        <path d="M22 52 Q14 66 20 84 Q30 76 32 60 Z" fill="#5F44A8"/>
        <path d="M68 52 Q76 66 70 84 Q60 76 58 60 Z" fill="#5F44A8"/>
        <circle cx="36" cy="46" r="9.5" fill="#fff"/><circle cx="54" cy="46" r="9.5" fill="#fff"/>
        <circle cx="37.5" cy="47" r="4.5" fill="#1B1035"/><circle cx="52.5" cy="47" r="4.5" fill="#1B1035"/>
        <circle cx="39" cy="45.5" r="1.6" fill="#fff"/><circle cx="54" cy="45.5" r="1.6" fill="#fff"/>
        <path d="M45 52 L40 59 L50 59 Z" fill="#FFB020"/>
        <path d="M27 34 L45 6 L63 34 Q45 26 27 34 Z" fill="#3E2FA8"/>
        <circle cx="45" cy="8" r="4.5" fill="#FDE68A" style={{animation:"twinkle 1.4s ease infinite"}}/>
        <path d="M28 33 Q45 40 62 33" stroke="#FDE68A" strokeWidth="3" fill="none"/>
      </svg>
      {/* Gem jar — the score made visible */}
      <div style={{position:"absolute",bottom:8,right:14,width:66,textAlign:"center"}}>
        <svg viewBox="0 0 70 84" style={{width:"100%",filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.5))"}}>
          <rect x="22" y="2" width="26" height="8" rx="3" fill="#8E97B8"/>
          <path d="M18 12 L52 12 L58 26 L58 74 Q58 80 52 80 L18 80 Q12 80 12 74 L12 26 Z" fill="rgba(190,215,255,0.16)" stroke="rgba(220,235,255,0.55)" strokeWidth="2.5"/>
          {[...Array(gems)].map((_,i)=>{
            const col=["#4ADE80","#7EC3FF","#F0ABFC","#FFD166"][i%4];
            const x=20+(i%3)*15, y=70-Math.floor(i/3)*13;
            return <path key={i} d={`M${x} ${y-5} L${x+5} ${y} L${x} ${y+5} L${x-5} ${y} Z`} fill={col}
              style={{animation:i===gems-1?"popIn 0.4s ease both":"none",filter:`drop-shadow(0 0 4px ${col})`}}/>;
          })}
        </svg>
        <p style={{fontSize:9,fontWeight:900,color:"#FDE68A",letterSpacing:"0.1em",fontFamily:F,textShadow:"0 1px 3px rgba(0,0,0,0.7)"}}>GEM JAR</p>
      </div>
    </div>
  );
}

function SceneTurbo({streak,boost,hurt,sector=0}) {
  const speed=Math.max(0.35,1.1-streak*0.12);
  const night=Math.min(sector*0.22,0.6); // sunset deepens into night as you race on
  return(
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {night>0&&<div style={{position:"absolute",inset:0,background:"#0B1030",opacity:night,transition:"opacity 2s ease"}}/>}
      {sector>=1&&[...Array(10)].map((_,i)=><div key={`st${i}`} style={{position:"absolute",width:2,height:2,borderRadius:"50%",
        background:"#fff",opacity:0.5,top:`${(i*9+4)%38}%`,left:`${(i*23+7)%95}%`,animation:`twinkle ${1.8+i%3}s ease infinite`}}/>)}
      <div style={{position:"absolute",top:"11%",left:"50%",transform:"translateX(-50%)",width:74,height:74,borderRadius:"50%",
        background:"radial-gradient(circle,#FFF3C4,#FFCB6B 55%,#FF9D5C)",boxShadow:"0 0 60px rgba(255,203,107,0.55)"}}/>
      <svg viewBox="0 0 480 150" preserveAspectRatio="none" style={{position:"absolute",bottom:"30%",left:0,width:"100%",height:"26%"}}>
        <path d="M0 150 L70 52 L150 122 L230 30 L320 108 L400 46 L480 118 L480 150 Z" fill="#3D1D5C" opacity="0.9"/>
        <path d="M0 150 L100 92 L200 138 L300 84 L400 132 L480 96 L480 150 L0 150 Z" fill="#2B1044"/>
      </svg>
      {/* Road */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"30%",background:"linear-gradient(180deg,#28203E,#171126)",
        borderTop:"4px solid #4A3A6E",overflow:"hidden"}}>
        {[...Array(5)].map((_,i)=><div key={i} style={{position:"absolute",top:"46%",height:7,width:64,borderRadius:4,
          background:boost?"#FFD166":"rgba(255,255,255,0.55)",left:`${i*25}%`,
          animation:`dashLeft ${speed}s linear ${i*(speed/5)}s infinite`,
          boxShadow:boost?"0 0 12px rgba(255,209,102,0.8)":"none"}}/>)}
        {streak>=3&&[...Array(6)].map((_,i)=><div key={`s${i}`} style={{position:"absolute",top:`${12+i*14}%`,height:2,width:"46%",
          background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",left:0,
          animation:`dashLeft ${speed*0.7}s linear ${i*0.09}s infinite`}}/>)}
      </div>
      {/* Kart */}
      <svg viewBox="0 0 130 80" style={{position:"absolute",bottom:"9%",left:"50%",width:118,
        transform:`translateX(-50%) ${boost?"translateX(-38%)":""}`,transition:"transform 0.3s",
        filter:hurt?"drop-shadow(0 0 14px rgba(255,93,115,0.95))":"drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
        animation:hurt?"wrongShake 0.45s ease":"kartBob 0.5s ease-in-out infinite"}}>
        {boost&&<g style={{animation:"flameFlicker 0.15s ease infinite"}}>
          <ellipse cx="10" cy="52" rx="14" ry="7" fill="#FFB020" opacity="0.9"/>
          <ellipse cx="4" cy="52" rx="8" ry="4" fill="#FFF6C9"/>
        </g>}
        <path d="M18 52 Q16 38 30 34 L50 30 Q58 16 74 16 L86 16 Q92 16 94 22 L98 34 Q116 36 118 48 Q120 56 112 58 L26 58 Q18 58 18 52 Z" fill="#FF5D73"/>
        <path d="M50 30 Q58 18 72 18 L84 18 L88 30 Z" fill="#7EC3FF" opacity="0.9"/>
        <path d="M18 52 Q16 40 30 36 L34 36 L34 58 L26 58 Q18 58 18 52 Z" fill="#D14059"/>
        <circle cx="38" cy="58" r="13" fill="#1B1430" stroke="#4A3A6E" strokeWidth="3" style={{animation:`spin ${speed*0.8}s linear infinite`,transformOrigin:"38px 58px"}}/>
        <circle cx="38" cy="58" r="4.5" fill="#8E97B8"/>
        <circle cx="98" cy="58" r="13" fill="#1B1430" stroke="#4A3A6E" strokeWidth="3" style={{animation:`spin ${speed*0.8}s linear infinite`,transformOrigin:"98px 58px"}}/>
        <circle cx="98" cy="58" r="4.5" fill="#8E97B8"/>
        <circle cx="70" cy="12" r="8" fill="#FFCB93"/>
        <path d="M62 12 Q70 2 78 12 Z" fill="#2B1044"/>
      </svg>
    </div>
  );
}

function SceneStarmap({qIdx,hurt,sector=0}) {
  // 12 planets along a winding path — the ship hops each correct answer
  const pts=[...Array(MISSION_LEN)].map((_,i)=>({
    x:8+(i*(84/(MISSION_LEN-1))),
    y:30+Math.sin(i*1.05)*13,
  }));
  const cur=qIdx%MISSION_LEN; // endless: a fresh constellation each sector
  const cols=["#FF6B81","#4D9DF7","#FFB020","#34C77B","#F0ABFC","#7EC3FF"];
  return(
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {[...Array(48)].map((_,i)=><div key={i} style={{position:"absolute",borderRadius:"50%",
        width:i%8===0?3.5:i%5===0?2.5:1.4,height:i%8===0?3.5:i%5===0?2.5:1.4,
        background:i%6===0?"#B4A7FF":i%4===0?"#7EC3FF":"#fff",opacity:0.12+(i%10)*0.07,
        top:`${(i*7+3)%94}%`,left:`${(i*11+5)%97}%`,animation:`twinkle ${1.5+i%6}s ease-in-out ${i*0.05}s infinite`}}/>)}
      <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",
        background:`radial-gradient(circle,rgba(240,171,252,${0.09+Math.min(sector,4)*0.05}),transparent 70%)`,top:"-4%",left:"55%",transition:"background 2s"}}/>
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{position:"absolute",top:"9%",left:0,width:"100%",height:"34%",overflow:"visible"}}>
        <polyline points={pts.map(p=>`${p.x},${p.y}`).join(" ")} fill="none"
          stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" strokeDasharray="1.6 2.2"/>
        <polyline points={pts.slice(0,cur+1).map(p=>`${p.x},${p.y}`).join(" ")} fill="none"
          stroke="#FFD166" strokeWidth="0.9" strokeDasharray="1.6 2.2" style={{filter:"drop-shadow(0 0 2px rgba(255,209,102,0.9))"}}/>
        {pts.map((p,i)=>(
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={i<cur?2.4:i===cur?3:2.1}
              fill={i<cur?"#FFD166":i===cur?cols[i%6]:"rgba(255,255,255,0.2)"}
              style={i===cur?{animation:"pulse 1.4s ease infinite",transformOrigin:`${p.x}px ${p.y}px`,filter:`drop-shadow(0 0 3px ${cols[i%6]})`}
                :i<cur?{filter:"drop-shadow(0 0 2px rgba(255,209,102,0.8))"}:{}}/>
            {i===MISSION_LEN-1&&<text x={p.x} y={p.y-4.4} fontSize="4.6" textAnchor="middle">🏁</text>}
          </g>
        ))}
        {/* Your ship at current planet */}
        <g transform={`translate(${pts[cur].x} ${pts[cur].y-6.4})`} style={{transition:"transform 0.6s cubic-bezier(0.34,1.3,0.64,1)"}}>
          <g style={{animation:hurt?"wrongShake 0.45s ease":"floatY 2.4s ease-in-out infinite"}}>
            <ellipse cx="0" cy="1.4" rx="5" ry="1.9" fill="#8E97B8"/>
            <ellipse cx="0" cy="0.6" rx="5" ry="1.7" fill="#C7CEE4"/>
            <path d="M-3 -0.4 Q0 -4.4 3 -0.4 Z" fill="#7EC3FF" opacity="0.9"/>
            <circle cx="0" cy="-1.5" r="1" fill="#0D1230"/>
            {[-3.4,0,3.4].map((lx,li)=><circle key={li} cx={lx} cy="1.6" r="0.62" fill="#FFD166" style={{animation:`twinkle ${0.7+li*0.2}s ease infinite`}}/>)}
          </g>
        </g>
      </svg>
    </div>
  );
}

// ── HINT LIFELINE — a stuck child always has a way forward ─────────
// Being trapped on a question with only wrong guesses teaches
// helplessness; a limited "remove one answer" lifeline teaches
// strategy. 2 per run (3 with learning-support needs).
function pickHintTarget(q,states){
  if(!q)return null;
  const wrongs=(q.options||[]).filter(o=>
    !(o===q.correct||String(o).charAt(0)===q.correct)&&!states[o]);
  return wrongs[0]||null;
}

// ── THE SHARED ENGINE CORE — one interaction model, four worlds ────
function EngineCore({child,name,emoji,subject,world,scene,fetchFn,initialLevel=1,scoreLabel="SCORE",popText="+XP",
  onComplete=()=>{},onQuit=()=>{},onRetry=null,onQResult=null,noCache=false}) {
  const A=useGameA11y();
  // Question bank: AI-generated batches are banked per (game, cohort, level)
  // so repeat plays start instantly. Personal decks (Tricky Ones) skip this.
  const cacheKey=`${name}|${child.yearGroup||""}|${child.country||""}`;
  const effFetch=useCallback((lvl)=>noCache?fetchFn(lvl):cachedFetch(cacheKey,lvl,fetchFn),[fetchFn,noCache,cacheKey]);
  const littleOne=(child.age||8)<=6; // early years: more forgiveness builds persistence
  const game=useLivesGame(effFetch,initialLevel,littleOne?5:3);
  const [phase,setPhase]=useState("intro");
  const [states,setStates]=useState({});
  const [locked,setLocked]=useState(false);
  const [fx,setFx]=useState({flash:null,combo:false,cheer:false,burst:false,pop:false,boost:false,hurt:false,lastOk:true});
  const [hints,setHints]=useState(A.extraHints?3:2);
  const missedRef=useRef([]); // wrong answers → Tricky Ones deck
  const flaggedRef=useRef([]); // reported questions → parent review + bank purge
  const flagQ=()=>{
    if(!game.q)return;
    const qText=game.q.question||game.q.q;
    if(flaggedRef.current.some(f=>f.q===qText))return;
    flaggedRef.current=[...flaggedRef.current,{q:qText,options:game.q.options,correct:game.q.correct,game:name,ts:new Date().toISOString()}];
    purgeQuestionFromBanks(qText); // never served from a bank again
    playSound('tap');
  };
  const wantsSpeech=(child.mode==="audio"||A.alwaysAudio)&&!A.noAudio;
  const useHint=()=>{
    const target=pickHintTarget(game.q,states);
    if(!target||locked||hints<=0)return;
    setStates(s=>({...s,[target]:"dim"}));
    setHints(h=>h-1);playSound('tap');haptic('tap');
  };

  useEffect(()=>{setStates({});setLocked(false);},[game.qIdx]);
  // Sector clear! Every 12 questions survived = a star sector
  const [sectorFlash,setSectorFlash]=useState(false);
  useEffect(()=>{
    if(game.qIdx>0&&game.qIdx%game.missionLen===0&&phase==="play"){
      playSound('levelup');haptic('levelup');
      if(!A.noMotion&&!A.predictableLayout){setSectorFlash(true);setTimeout(()=>setSectorFlash(false),1500);}
    }
  },[game.qIdx]);
  // Processing difficulties / audio mode: read each question aloud
  useEffect(()=>{
    if(phase==="play"&&wantsSpeech&&game.q&&!game.done){
      const t=setTimeout(()=>speak(game.q.question||game.q.q,child.tutor),450);
      return()=>clearTimeout(t);
    }
  },[game.qIdx,phase,game.done]);

  // ADHD: reward more often. Epilepsy/anxiety: no popup surprises.
  const milestones=A.moreRewards?[2,4,6,8,10,12]:[3,5,7,10];
  const showOverlays=!A.noMotion&&!A.predictableLayout;

  const tap=(opt)=>{
    if(locked||!game.q)return;
    setLocked(true);
    const ok=opt===game.q.correct||String(opt).charAt(0)===game.q.correct;
    if(!ok)missedRef.current=[...missedRef.current,{q:game.q.question||game.q.q,options:game.q.options,correct:game.q.correct,subject}].slice(-10);
    if(onQResult)onQResult(game.q,ok);
    const ns={};
    (game.q.options||[]).forEach(o=>{ns[o]=o===opt?(ok?"correct":"wrong"):"dim";});
    setStates(ns);
    if(ok){
      const nstreak=game.streak+1;
      const milestone=showOverlays&&milestones.includes(nstreak);
      setFx(f=>({...f,flash:"correct",burst:showOverlays,pop:true,boost:true,cheer:!milestone,combo:milestone,lastOk:true}));
      playSound(nstreak>=10?'levelup':nstreak>=5?'combo5':nstreak>=3?'combo3':'correct');
      haptic(milestone?'combo3':'correct');
      if(wantsSpeech)speak("Correct!",child.tutor);
      setTimeout(()=>setFx(f=>({...f,flash:null})),400);
      setTimeout(()=>setFx(f=>({...f,burst:false,pop:false,cheer:false,combo:false,boost:false})),1200);
    } else {
      setFx(f=>({...f,flash:"wrong",cheer:true,hurt:true,lastOk:false}));
      playSound('wrong');haptic('wrong');
      // Teach: reveal the right answer
      setTimeout(()=>{
        setStates(s=>{
          const s2={...s};
          const co=(game.q.options||[]).find(o=>o===game.q.correct||String(o).charAt(0)===game.q.correct);
          if(co)s2[co]="correct";
          if(wantsSpeech&&co)speak("Not quite. The answer was "+String(co).replace(/^[A-F]\)\s*/,""),child.tutor);
          return s2;
        });
      },420);
      setTimeout(()=>setFx(f=>({...f,flash:null})),400);
      setTimeout(()=>setFx(f=>({...f,cheer:false,hurt:false})),1200);
    }
    setTimeout(()=>game.answer(ok),ok?820:(A.extraHints?2100:1350)); // extra time to absorb the correct answer
  };

  if(game.loadErr)return <GameError name={name} onRetry={()=>onRetry?onRetry():onQuit()}/>;
  if(game.loading&&!game.q)return <GameLoad name={name} emoji={emoji} tutor={child.tutor}/>;
  if(game.done){
    const attempted=Math.max(game.qIdx+(game.lives<=0?1:0), game.score, 1);
    const xpTotal=game.score*15+game.sector*25; // +25 XP per sector survived
    return <GameEnd name={name} emoji={emoji} score={game.score} max={attempted}
      child={child} xp={xpTotal} level={game.lvl} sectors={game.sector}
      onRetry={()=>onRetry?onRetry():onQuit()}
      onDone={()=>onComplete({score:game.score,max:attempted,xp:xpTotal,total:attempted,correct:game.score,levelReached:game.lvl,missedQs:missedRef.current,bestStreak:game.bestStreak,flaggedQs:flaggedRef.current})}/>;
  }
  if(phase==="intro")return <MissionIntro world={world} name={name} emoji={emoji} child={child} total={game.missionLen} onGo={()=>setPhase("play")}/>;

  return(
    <div className={A.noMotion?"a11y-still":undefined}
      style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",fontFamily:F,background:world.sky,
      position:"relative",overflow:"hidden",animation:fx.hurt&&!A.noMotion?"screenShake 0.4s ease":"none"}}>
      {/* Calm scheme (anxiety/autism): soften the world's saturation */}
      <div style={A.calmScheme?{position:"absolute",inset:0,filter:"saturate(0.72) brightness(1.04)",pointerEvents:"none"}:{position:"absolute",inset:0,pointerEvents:"none"}}>
        {scene({boost:fx.boost&&!A.noMotion,hurt:fx.hurt,streak:game.streak,score:game.score,qIdx:game.qIdx,sector:game.sector})}
      </div>
      {/* Streak fire: screen edges glow warmer the longer the run (static, flash-free) */}
      {game.streak>=3&&<div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:2,borderRadius:0,
        boxShadow:`inset 0 0 ${40+Math.min(game.streak,10)*12}px ${game.streak>=7?"rgba(255,140,60,0.5)":"rgba(255,209,102,0.38)"}`,
        transition:"box-shadow 0.6s ease"}}/>}
      <FlashOverlay type={fx.flash}/>
      {showOverlays&&<ComboDisplay streak={game.streak+1} visible={fx.combo}/>}
      {sectorFlash&&<div style={{position:"fixed",top:"30%",left:"50%",zIndex:310,pointerEvents:"none",
        background:"linear-gradient(135deg,#F59E0B,#D97706)",borderRadius:24,padding:"16px 30px",
        border:"3px solid rgba(255,255,255,0.55)",boxShadow:"0 14px 44px rgba(0,0,0,0.5)",
        animation:"comboIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
        <p style={{fontSize:32,textAlign:"center",lineHeight:1,marginBottom:4}}>⭐</p>
        <p style={{fontSize:22,fontWeight:900,color:"#fff",textAlign:"center",fontFamily:F,letterSpacing:"0.04em",textShadow:"0 3px 0 rgba(0,0,0,0.25)",whiteSpace:"nowrap"}}>SECTOR {game.sector} CLEAR!</p>
        <p style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.85)",textAlign:"center",fontFamily:F}}>+25 XP · keep going!</p>
      </div>}
      <EncourageBanner ok={fx.lastOk} visible={fx.cheer} qIdx={game.qIdx}/>
      {showOverlays&&<ParticleBurst active={fx.burst}/>}
      <ScorePop show={fx.pop} text={popText}/>
      <GameHeader name={name} emoji={emoji} score={game.score} lives={game.lives} maxLives={game.maxLives} level={game.lvl}
        onQuit={()=>game.setDone(true)} narrative={world} qIdx={game.qIdx} streak={game.streak} scoreLabel={scoreLabel}/>
      <div style={{position:"relative",zIndex:5}}><MissionTrail qIdx={game.qIdx} score={game.score} accent={world.accent} total={game.missionLen}/></div>
      <div style={{display:"flex",justifyContent:"flex-end",padding:"2px 16px 0",position:"relative",zIndex:5}}>
        <button onClick={useHint} disabled={hints<=0||locked} aria-label={`Use a hint, ${hints} left`}
          style={{background:hints>0?"rgba(255,209,102,0.16)":"rgba(255,255,255,0.06)",
          border:`1.5px solid ${hints>0?"rgba(255,209,102,0.55)":"rgba(255,255,255,0.12)"}`,
          borderRadius:999,padding:"5px 13px",cursor:hints>0?"pointer":"default",fontFamily:F,
          fontSize:11.5,fontWeight:900,color:hints>0?"#FFD166":"rgba(255,255,255,0.35)"}}>
          💡 Hint ×{hints}
        </button>
      </div>
      {/* Spacer pushes Q&A below the scene's hero area */}
      <div style={{height:subject&&world===WORLDS.starmap?96:4}}/>
      <QuestionCard question={game.q?.question||game.q?.q} narrative={world} qIdx={game.qIdx} lvl={game.lvl}
        total={game.missionLen} onSpeak={wantsSpeech?()=>speak(game.q?.question||game.q?.q,child.tutor):null} onFlag={flagQ}/>
      {Object.values(states).includes("wrong")&&game.q?.hint&&(
        <div style={{margin:"8px 14px 0",padding:"10px 16px",borderRadius:14,position:"relative",zIndex:5,
          background:"rgba(255,209,102,0.13)",border:"1.5px solid rgba(255,209,102,0.5)"}}>
          <p style={{fontSize:13,fontWeight:800,color:"#FFD166",fontFamily:A.dyslexiaFont?FDYS:F,lineHeight:1.5}}>💡 {game.q.hint}</p>
        </div>
      )}
      <AnswerGrid opts={game.q?.options||[]} states={states} locked={locked} onTap={tap}/>
      <div style={{height:world===WORLDS.cosmic||world===WORLDS.grove||world===WORLDS.turbo?128:20}}/>
    </div>
  );
}

// ── ENGINE 1: COSMIC BLAST — Maths / Computing ─────────────────────
function ShooterEngine({child,name,emoji,subject,color,bg,fetchFn,initialLevel=1,onComplete,onQuit,onRetry}) {
  return <EngineCore child={child} name={name} emoji={emoji} subject={subject} world={WORLDS.cosmic}
    scene={p=><SceneCosmic boost={p.boost} hurt={p.hurt} sector={p.sector}/>} popText="+FUEL"
    fetchFn={fetchFn} initialLevel={initialLevel} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

// ── ENGINE 2: ENCHANTED GROVE — English / Language ─────────────────
function CatcherEngine({child,name,emoji,subject,color,bg,fetchFn,catcherChar,sceneBg,initialLevel=1,onComplete,onQuit,onRetry}) {
  return <EngineCore child={child} name={name} emoji={emoji} subject={subject} world={WORLDS.grove}
    scene={p=><SceneGrove score={p.score} hurt={p.hurt} streak={p.streak}/>} scoreLabel="GEMS" popText="+GEM"
    fetchFn={fetchFn} initialLevel={initialLevel} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

// ── ENGINE 3: TURBO TRAIL — History / Geography / mixed ────────────
function RunnerEngine({child,name,emoji,subject,color,fetchFn,runnerChar,sceneBg,initialLevel=1,onComplete,onQuit,onRetry}) {
  return <EngineCore child={child} name={name} emoji={emoji} subject={subject} world={WORLDS.turbo}
    scene={p=><SceneTurbo streak={p.streak} boost={p.boost} hurt={p.hurt} sector={p.sector}/>} scoreLabel="PTS" popText="+BOOST"
    fetchFn={fetchFn} initialLevel={initialLevel} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

// ── ENGINE 4: STAR MAP QUEST — Science / Computing ─────────────────
function SpaceExplorer({child,name,emoji,subject,color,fetchFn,initialLevel=1,onComplete,onQuit,onRetry,onQResult,noCache}) {
  return <EngineCore child={child} name={name} emoji={emoji} subject={subject} world={WORLDS.starmap}
    scene={p=><SceneStarmap qIdx={p.qIdx} hurt={p.hurt} sector={p.sector}/>} scoreLabel="STARS" popText="+STAR" onQResult={onQResult} noCache={noCache}
    fetchFn={fetchFn} initialLevel={initialLevel} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

// ── TRICKY ONES — spaced-repetition review of the child's own misses ──
// The AI remembered every question this child got wrong; beat a question
// here and it leaves the deck for good.
function TrickyReview({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const deck=child.trickyQs||[];
  const fixedRef=useRef([]);
  const fetchFn=useCallback(async()=>{
    const qs=[...deck].sort(()=>Math.random()-0.5)
      .map(t=>({question:t.q,q:t.q,options:t.options,correct:t.correct}));
    return {questions:qs.length?qs:[{q:"Deck cleared — you beat them all! 🎉  Bonus: what is 7 + 5?",options:["A) 12","B) 11","C) 13","D) 10"],correct:"A"}]};
  },[child]);
  return <SpaceExplorer child={child} name="Tricky Ones" emoji="🎯" subject="Review" noCache
    fetchFn={fetchFn} initialLevel={level}
    onQResult={(q,ok)=>{if(ok)fixedRef.current=[...fixedRef.current,q.question||q.q];}}
    onComplete={(s)=>onComplete({...s,xp:Math.round((s.xp||0)*1.5),fixedQs:fixedRef.current,missedQs:[]})}
    onQuit={onQuit} onRetry={onRetry}/>;
}

// ── THE LEARNING BUDDY — grows from mastery, not grinding ──────────
const BUDDY_STAGES=[
  {at:0,   name:"Mystery Egg",    desc:"Something is stirring inside…"},
  {at:30,  name:"Nova Hatchling", desc:"It hatched because you learned!"},
  {at:90,  name:"Star Pup",       desc:"Growing with every tricky win"},
  {at:200, name:"Comet Cub",      desc:"Your mastery makes it glow"},
  {at:380, name:"Aurora Fox",     desc:"Wise from all you've conquered"},
  {at:650, name:"Cosmic Guardian",desc:"Legendary — raised by learning"},
];
// Derived purely from MEANINGFUL learning signals (not raw XP grinding):
function buddyPoints(child){
  const levels=Object.values(child.level||{}).reduce((a,b)=>a+(b||0),0);
  return (child.trickyFixedCount||0)*6   // beating your own tricky questions counts most
       + levels*3                          // real curriculum progress
       + (child.badges||[]).length*4
       + Math.min(child.streak||0,30)*2;   // consistency, capped
}
function buddyStage(points){
  let idx=0;
  BUDDY_STAGES.forEach((s,i)=>{if(points>=s.at)idx=i;});
  const cur=BUDDY_STAGES[idx], next=BUDDY_STAGES[idx+1]||null;
  return {...cur,idx,next,toNext:next?next.at-points:0,
    pct:next?Math.round((points-cur.at)/(next.at-cur.at)*100):100};
}
function BuddySprite({stage,size=88}){
  const s=stage.idx;
  const glow=["#94A3B8","#7EC3FF","#FFD166","#FF9D5C","#F0ABFC","#A78BFA"][s];
  return(
    <svg viewBox="0 0 100 100" width={size} height={size} style={{filter:`drop-shadow(0 0 ${8+s*3}px ${glow}88)`}}>
      {s===0&&<g>{/* egg */}
        <path d="M50 14 C70 14 80 40 80 60 C80 79 67 90 50 90 C33 90 20 79 20 60 C20 40 30 14 50 14 Z" fill="#E8ECF7" stroke="#B9C2DC" strokeWidth="2.5"/>
        <path d="M34 46 L42 54 L38 62" stroke="#B9C2DC" strokeWidth="2.5" fill="none"/>
        <circle cx="60" cy="40" r="3" fill="#C9D2E8"/>
      </g>}
      {s>=1&&<g>{/* creature body evolves */}
        <ellipse cx="50" cy={62-s} rx={26+s*1.5} ry={24+s*1.5} fill={glow}/>
        <ellipse cx="50" cy={68-s} rx={16+s} ry={12+s} fill="rgba(255,255,255,0.35)"/>
        {/* ears grow from stage 2 */}
        {s>=2&&<><path d={`M${34-s} ${42-s} L${28-s} ${18-s*2} L${44} ${34} Z`} fill={glow}/>
        <path d={`M${66+s} ${42-s} L${72+s} ${18-s*2} L${56} ${34} Z`} fill={glow}/></>}
        {/* eyes */}
        <circle cx="41" cy={54-s} r={5.5} fill="#0F172A"/><circle cx="59" cy={54-s} r={5.5} fill="#0F172A"/>
        <circle cx="43" cy={52-s} r="2" fill="#fff"/><circle cx="61" cy={52-s} r="2" fill="#fff"/>
        {/* smile */}
        <path d={`M43 ${66-s} Q50 ${71-s} 57 ${66-s}`} stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* tail from stage 3 */}
        {s>=3&&<path d={`M${74+s} 66 Q ${90} ${56-s*2} ${84} ${40-s*2}`} stroke={glow} strokeWidth={7+s} fill="none" strokeLinecap="round"/>}
        {/* star crown at top stages */}
        {s>=4&&<text x="50" y={16-(s-4)*2} fontSize="13" textAnchor="middle">{s>=5?"👑":"⭐"}</text>}
        {/* aurora sparkles */}
        {s>=4&&[...Array(3)].map((_,i)=><circle key={i} cx={26+i*24} cy={26-i*3} r="1.8" fill="#fff" opacity="0.9"><animate attributeName="opacity" values="0.9;0.2;0.9" dur={`${1.2+i*0.4}s`} repeatCount="indefinite"/></circle>)}
      </g>}
    </svg>
  );
}

// ── RANKS — XP buys identity ───────────────────────────────────────
const RANKS=[
  {xp:0,    name:"New Explorer",  emoji:"🌱"},
  {xp:150,  name:"Comet Cadet",   emoji:"☄️"},
  {xp:400,  name:"Star Scout",    emoji:"⭐"},
  {xp:900,  name:"Moon Ranger",   emoji:"🌙"},
  {xp:1800, name:"Planet Pioneer",emoji:"🪐"},
  {xp:3200, name:"Nova Knight",   emoji:"⚡"},
  {xp:5500, name:"Galaxy Guardian",emoji:"🌌"},
  {xp:9000, name:"Cosmic Champion",emoji:"👑"},
  {xp:14000,name:"Galaxy Legend", emoji:"🏆"},
];
function getRank(xp=0){
  let r=RANKS[0];
  for(const k of RANKS){if(xp>=k.xp)r=k;else break;}
  const idx=RANKS.indexOf(r);
  const next=RANKS[idx+1]||null;
  return {...r,next,toNext:next?next.xp-xp:0,idx};
}

// ── DAY STREAK with Streak Shield ──────────────────────────────────
// Any learning activity (lesson OR game) counts. If a child with a 3+
// day streak misses exactly one day, a weekly Streak Shield saves it —
// life happens, and losing a 20-day streak to one busy Tuesday teaches
// kids to give up, not to persist.
function computeDayStreak(child){
  const lastSession=(child.sessionHistory||[]).slice(-1)[0];
  const lastDate=lastSession?new Date(lastSession.date):null;
  const today=new Date();
  const todayStr=today.toDateString();
  const yesterdayStr=new Date(today.getTime()-86400000).toDateString();
  const twoDaysAgoStr=new Date(today.getTime()-2*86400000).toDateString();
  const lastDateStr=lastDate?lastDate.toDateString():null;
  const shieldReady=!child.shieldUsedAt||(Date.now()-new Date(child.shieldUsedAt).getTime())>6.5*86400000;
  if(!lastDate)return {streak:1,shieldSaved:false};
  if(lastDateStr===todayStr)return {streak:child.streak||1,shieldSaved:false};
  if(lastDateStr===yesterdayStr)return {streak:(child.streak||0)+1,shieldSaved:false};
  if(lastDateStr===twoDaysAgoStr&&shieldReady&&(child.streak||0)>=3)
    return {streak:(child.streak||0)+1,shieldSaved:true,shieldUsedAt:new Date().toISOString()};
  return {streak:1,shieldSaved:false};
}

// ── DAILY QUESTS — three small goals + a chest, every day ──────────
const todayKey=()=>new Date().toISOString().slice(0,10);
function getQuestState(child){
  const q=child.quests||{};
  if(q.date===todayKey())return q;
  return {date:todayKey(),answered:0,correct:0,activities:0,rewarded:false};
}
const QUEST_DEFS=[
  {id:"answered",  label:"Answer 12 questions",   target:12, emoji:"✏️"},
  {id:"correct",   label:"Get 8 answers right",   target:8,  emoji:"✅"},
  {id:"activities",label:"Finish 2 games or lessons", target:2, emoji:"🎮"},
];
// Merge new activity into today's quest progress; returns {quests, bonusXP}
function applyQuestProgress(child,{answered=0,correct=0,activities=0}){
  const cur=getQuestState(child);
  const quests={...cur,
    answered:cur.answered+answered,
    correct:cur.correct+correct,
    activities:cur.activities+activities};
  const allDone=QUEST_DEFS.every(d=>quests[d.id]>=d.target);
  let bonusXP=0;
  if(allDone&&!quests.rewarded){quests.rewarded=true;bonusXP=60;}
  return {quests,bonusXP};
}

// ── METEOR RUSH — a REAL-mechanics arcade engine ───────────────────
// Not a quiz-shell: answer meteors physically fall from the sky and the
// child must tap the correct one before it hits the shield. Moving
// targets + time pressure + escalating speed = website-quality arcade
// feel, while still feeding hearts, sectors, high scores, Tricky Ones,
// quests and every accessibility need.
const METEOR_COLS=[{c:"#FF6B81",d:"#B23A50"},{c:"#4D9DF7",d:"#2A62A8"},{c:"#FFB020",d:"#B87400"},{c:"#34C77B",d:"#1E7F4E"}];
function meteorFallMs(lvl,streak,A,age=8){
  if(A.noTimers||A.noMotion)return Infinity;            // no time pressure
  let base=13000-lvl*550-streak*260;
  if(age<=6)base+=3500;                                  // early years: gentler clock
  if(A.largeTapTargets)base+=2500;                       // dyspraxia: slower
  return Math.max(6500,base);
}
function makeLanes(n=4){
  const xs=_shuffle([10,34,58,82]).slice(0,n);
  return xs.map((x,i)=>({x:x+_ri(-3,3),yOff:_ri(0,14),wob:_ri(0,1)?1:-1,col:i%4}));
}
function MeteorField({opts,lanes,fall,states,locked,onTap,A}){
  const size=A.largeTapTargets?96:76;
  const fontFam=A.dyslexiaFont?FDYS:F;
  return(
    <div style={{position:"relative",height:A.noMotion?undefined:340,zIndex:6,
      display:A.noMotion?"grid":undefined,gridTemplateColumns:A.noMotion?"1fr 1fr":undefined,
      gap:A.noMotion?12:undefined,padding:A.noMotion?"12px 16px":0}}>
      {opts.map((opt,i)=>{
        const lane=lanes[i]||{x:10+i*24,yOff:0,wob:1,col:i};
        const t=METEOR_COLS[lane.col];
        const st=states[opt]||"";
        const isOk=st==="correct",isBad=st==="wrong",isDim=st==="dim";
        const label=String(opt).replace(/^[A-F]\)\s*/,"");
        const fs=(label.length>10?12:label.length>5?14:17)+(A.largeText?2:0);
        const y=A.noMotion?0:Math.min(100,fall+lane.yOff*0.01*fall);
        const common={
          width:size,height:size,borderRadius:"50%",border:"none",cursor:locked?"default":"pointer",
          fontFamily:fontFam,position:A.noMotion?"relative":"absolute",
          left:A.noMotion?undefined:`calc(${lane.x}% - ${size/2}px)`,
          top:A.noMotion?undefined:`${y*0.82}%`,
          background:isOk?"radial-gradient(circle at 34% 30%,#7BEBA8,#2FBF71 60%,#1D8A50)":
                     isBad?(A.noRedFeedback?"radial-gradient(circle at 34% 30%,#94A3B8,#64748B)":"radial-gradient(circle at 34% 30%,#F87171,#E5484D 60%,#A32328)"):
                     `radial-gradient(circle at 34% 30%,${t.c},${t.d})`,
          boxShadow:isOk?"0 0 34px rgba(47,191,113,0.85)":`0 6px 18px rgba(0,0,0,0.45), inset -6px -8px 0 rgba(0,0,0,0.18)`,
          opacity:isDim?0.25:1,
          transform:isOk?"scale(1.18)":isBad?"scale(0.9)":`rotate(${lane.wob*(fall%10-5)*0.6}deg)`,
          transition:A.noMotion?"all 0.2s":"top 0.12s linear, transform 0.25s, opacity 0.3s",
          animation:isBad&&!A.noMotion?"wrongShake 0.45s ease":isOk&&!A.noMotion?"jellyPop 0.55s ease":"none",
          zIndex:isOk?3:1};
        return(
          <button key={`${opt}-${i}`} disabled={locked} onClick={()=>!locked&&onTap(opt)}
            aria-label={`Meteor answer: ${label}`} style={common}>
            {/* flame trail while falling */}
            {!A.noMotion&&!isOk&&!isBad&&!isDim&&<div style={{position:"absolute",top:-16,left:"50%",transform:"translateX(-50%)",
              width:size*0.4,height:20,borderRadius:"50% 50% 0 0",filter:"blur(3px)",
              background:"linear-gradient(180deg,rgba(255,209,102,0.0),rgba(255,176,32,0.75))"}}/>}
            <span style={{position:"relative",fontSize:fs,fontWeight:A.dyslexiaFont?700:900,color:"#fff",lineHeight:1.15,
              letterSpacing:A.dyslexiaFont?"0.04em":undefined,textShadow:"0 2px 3px rgba(0,0,0,0.45)",
              display:"block",padding:"0 6px",wordBreak:"break-word"}}>{isOk?"✓":isBad?"✕":label}</span>
          </button>
        );
      })}
    </div>
  );
}
function MeteorEngine({child,name,emoji,subject,fetchFn,initialLevel=1,onComplete=()=>{},onQuit=()=>{},onRetry=null,noCache=false}){
  const A=useGameA11y();
  const cacheKey=`${name}|${child.yearGroup||""}|${child.country||""}`;
  const effFetch=useCallback((lvl)=>noCache?fetchFn(lvl):cachedFetch(cacheKey,lvl,fetchFn),[fetchFn,noCache,cacheKey]);
  const littleOne=(child.age||8)<=6;
  const game=useLivesGame(effFetch,initialLevel,littleOne?5:3);
  const [phase,setPhase]=useState("intro");
  const [fall,setFall]=useState(0);
  const [lanes,setLanes]=useState(makeLanes());
  const [states,setStates]=useState({});
  const [locked,setLocked]=useState(false);
  const [fx,setFx]=useState({flash:null,burst:false,pop:false,cheer:false,hurt:false,lastOk:true});
  const missedRef=useRef([]);
  const flaggedRef=useRef([]);
  const flagQ=()=>{
    if(!game.q)return;
    const qText=game.q.question||game.q.q;
    if(flaggedRef.current.some(f=>f.q===qText))return;
    flaggedRef.current=[...flaggedRef.current,{q:qText,options:game.q.options,correct:game.q.correct,game:name,ts:new Date().toISOString()}];
    purgeQuestionFromBanks(qText);
    playSound('tap');
  };
  const landedRef=useRef(false);
  const [hints,setHints]=useState(A.extraHints?3:2);
  const wantsSpeech=(child.mode==="audio"||A.alwaysAudio)&&!A.noAudio;
  const useHint=()=>{
    const target=pickHintTarget(game.q,states);
    if(!target||locked||hints<=0)return;
    setStates(s=>({...s,[target]:"dim"}));
    setHints(h=>h-1);playSound('tap');haptic('tap');
  };

  // New question → respawn meteors from the top
  useEffect(()=>{setStates({});setLocked(false);setFall(0);setLanes(makeLanes());landedRef.current=false;},[game.qIdx]);
  // Read aloud for processing needs
  useEffect(()=>{
    if(phase==="play"&&wantsSpeech&&game.q&&!game.done){
      const t=setTimeout(()=>speak(game.q.question||game.q.q,child.tutor),450);
      return()=>clearTimeout(t);
    }
  },[game.qIdx,phase,game.done]);
  // The fall — real time pressure
  useEffect(()=>{
    if(phase!=="play"||game.done||locked||!game.q)return;
    const dur=meteorFallMs(game.lvl,game.streak,A,child.age);
    if(!isFinite(dur))return;
    const step=50/dur*100;
    const t=setInterval(()=>setFall(f=>f+step),50);
    return()=>clearInterval(t);
  },[phase,game.done,locked,game.qIdx,game.lvl,A.noTimers,A.noMotion]);
  // Landing = the correct meteor got through
  useEffect(()=>{
    if(fall>=100&&!locked&&!landedRef.current&&game.q){
      landedRef.current=true;
      resolve(null,false,true);
    }
  },[fall]);

  const resolve=(opt,ok,landed=false)=>{
    if(locked||!game.q)return;
    setLocked(true);
    if(!ok)missedRef.current=[...missedRef.current,{q:game.q.question||game.q.q,options:game.q.options,correct:game.q.correct,subject}].slice(-10);
    const ns={};
    (game.q.options||[]).forEach(o=>{
      const isCorrect=o===game.q.correct||String(o).charAt(0)===game.q.correct;
      ns[o]=ok?(o===opt?"correct":"dim"):(isCorrect?"correct":o===opt?"wrong":"dim");
    });
    setStates(ns);
    if(ok){
      setFx(f=>({...f,flash:"correct",burst:!A.noMotion,pop:true,cheer:true,lastOk:true}));
      const nstreak=game.streak+1;
      playSound(nstreak>=5?'combo5':nstreak>=3?'combo3':'correct');haptic('correct');
    } else {
      setFx(f=>({...f,flash:"wrong",cheer:true,hurt:true,lastOk:false}));
      playSound('wrong');haptic('wrong');
      if(wantsSpeech){const co=(game.q.options||[]).find(o=>o===game.q.correct||String(o).charAt(0)===game.q.correct);if(co)speak("The answer was "+String(co).replace(/^[A-F]\)\s*/,""),child.tutor);}
    }
    setTimeout(()=>setFx(f=>({...f,flash:null})),400);
    setTimeout(()=>setFx(f=>({...f,burst:false,pop:false,cheer:false,hurt:false})),1150);
    setTimeout(()=>game.answer(ok),ok?800:(A.extraHints?2100:1400));
  };
  const tap=(opt)=>{
    const ok=opt===game.q.correct||String(opt).charAt(0)===game.q.correct;
    resolve(opt,ok);
  };

  if(game.loadErr)return <GameError name={name} onRetry={()=>onRetry?onRetry():onQuit()}/>;
  if(game.loading&&!game.q)return <GameLoad name={name} emoji={emoji} tutor={child.tutor}/>;
  if(game.done){
    const attempted=Math.max(game.qIdx+(game.lives<=0?1:0), game.score, 1);
    const xpTotal=game.score*15+game.sector*25;
    return <GameEnd name={name} emoji={emoji} score={game.score} max={attempted}
      child={child} xp={xpTotal} level={game.lvl} sectors={game.sector}
      onRetry={()=>onRetry?onRetry():onQuit()}
      onDone={()=>onComplete({score:game.score,max:attempted,xp:xpTotal,total:attempted,correct:game.score,levelReached:game.lvl,missedQs:missedRef.current,bestStreak:game.bestStreak,flaggedQs:flaggedRef.current})}/>;
  }
  if(phase==="intro")return <MissionIntro world={WORLDS.meteor} name={name} emoji={emoji} child={child} total={game.missionLen} onGo={()=>setPhase("play")}/>;

  return(
    <div className={A.noMotion?"a11y-still":undefined}
      style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",fontFamily:F,background:WORLDS.meteor.sky,
      position:"relative",overflow:"hidden",animation:fx.hurt&&!A.noMotion?"screenShake 0.4s ease":"none",
      filter:A.calmScheme?"saturate(0.78)":undefined}}>
      {!A.noMotion&&[...Array(30)].map((_,i)=><div key={i} style={{position:"absolute",borderRadius:"50%",
        width:i%6===0?3:1.5,height:i%6===0?3:1.5,background:"#fff",opacity:0.15+(i%5)*0.08,
        top:`${(i*13+5)%90}%`,left:`${(i*17+3)%97}%`,animation:`twinkle ${1.6+i%4}s ease infinite`,pointerEvents:"none"}}/>)}
      {game.streak>=3&&<div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:2,
        boxShadow:`inset 0 0 ${40+Math.min(game.streak,10)*12}px ${game.streak>=7?"rgba(255,140,60,0.5)":"rgba(255,209,102,0.38)"}`,
        transition:"box-shadow 0.6s ease"}}/>}
      <FlashOverlay type={fx.flash}/>
      <EncourageBanner ok={fx.lastOk} visible={fx.cheer} qIdx={game.qIdx}/>
      {!A.noMotion&&<ParticleBurst active={fx.burst}/>}
      <ScorePop show={fx.pop} text="+ZAP"/>
      <GameHeader name={name} emoji={emoji} score={game.score} lives={game.lives} maxLives={game.maxLives} level={game.lvl}
        onQuit={()=>game.setDone(true)} narrative={WORLDS.meteor} qIdx={game.qIdx} streak={game.streak} scoreLabel="ZAPS"/>
      <div style={{position:"relative",zIndex:5}}><MissionTrail qIdx={game.qIdx} score={game.score} accent={WORLDS.meteor.accent} total={game.missionLen}/></div>
      <div style={{display:"flex",justifyContent:"flex-end",padding:"2px 16px 0",position:"relative",zIndex:5}}>
        <button onClick={useHint} disabled={hints<=0||locked} aria-label={`Use a hint, ${hints} left`}
          style={{background:hints>0?"rgba(255,209,102,0.16)":"rgba(255,255,255,0.06)",
          border:`1.5px solid ${hints>0?"rgba(255,209,102,0.55)":"rgba(255,255,255,0.12)"}`,
          borderRadius:999,padding:"5px 13px",cursor:hints>0?"pointer":"default",fontFamily:F,
          fontSize:11.5,fontWeight:900,color:hints>0?"#FFD166":"rgba(255,255,255,0.35)"}}>
          💡 Hint ×{hints}
        </button>
      </div>
      <QuestionCard question={game.q?.question||game.q?.q} narrative={WORLDS.meteor} qIdx={game.qIdx} lvl={game.lvl}
        total={game.missionLen} onSpeak={wantsSpeech?()=>speak(game.q?.question||game.q?.q,child.tutor):null} onFlag={flagQ}/>
      {Object.values(states).includes("wrong")&&game.q?.hint&&(
        <div style={{margin:"8px 14px 0",padding:"10px 16px",borderRadius:14,position:"relative",zIndex:6,
          background:"rgba(255,209,102,0.13)",border:"1.5px solid rgba(255,209,102,0.5)"}}>
          <p style={{fontSize:13,fontWeight:800,color:"#FFD166",fontFamily:A.dyslexiaFont?FDYS:F,lineHeight:1.5}}>💡 {game.q.hint}</p>
        </div>
      )}
      <MeteorField opts={game.q?.options||[]} lanes={lanes} fall={fall} states={states} locked={locked} onTap={tap} A={A}/>
      {/* The shield the child is defending */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:46,zIndex:4,pointerEvents:"none",
        background:"linear-gradient(180deg,rgba(124,108,255,0.0),rgba(124,108,255,0.32))",
        borderTop:`3px solid ${fx.hurt?(A.noRedFeedback?"#94A3B8":"#FF5D73"):"rgba(124,108,255,0.85)"}`,
        boxShadow:fx.hurt?"0 -4px 30px rgba(255,93,115,0.5)":"0 -4px 24px rgba(124,108,255,0.45)",
        transition:"all 0.3s"}}>
        <p style={{textAlign:"center",fontSize:10,fontWeight:900,letterSpacing:"0.22em",color:"rgba(255,255,255,0.75)",marginTop:9,fontFamily:F}}>⚡ SHIELD ⚡</p>
      </div>
    </div>
  );
}

// Two games on the engine — one fully local, one AI-with-cache
function MeteorMaths({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>({questions:genMathQs("mixed",lvl,15)}),[]); // local: instant
  return <MeteorEngine child={child} name="Meteor Maths" emoji="🌠" subject="Maths" noCache
    fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}
function WordMeteors({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 15 "which word is spelled correctly?" questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Options are 4 spellings of the same word, one correct, max 12 chars. Return ONLY JSON: {"questions":[{"q":"Which is spelled correctly?","options":["A) freind","B) friend","C) frend","D) friende"],"correct":"B"}]}`,"Word meteor questions."),[child]);
  return <MeteorEngine child={child} name="Word Meteors" emoji="☄️" subject="English"
    fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

// ══════════════════════════════════════════════════════════════════
// NEW MECHANIC 1: ORDER ENGINE — "Bridge Builder"
// Not multiple-choice: the child taps floating planks in the CORRECT
// ORDER to build a bridge across a canyon. Sequencing is a different
// cognitive skill (and a different game feel) from recognition.
// ══════════════════════════════════════════════════════════════════
function genSequenceQs(kind,lvl=1,count=10){
  const L=Math.max(1,Math.min(10,lvl));
  const qs=[];
  const WORDS=["ant","bear","cat","dog","egg","fox","goat","hat","ice","jam","kite","lion","moon","nest","owl","pig","queen","rain","sun","tree","umbrella","van","wolf","yak","zebra"];
  for(let i=0;i<count;i++){
    if(kind==="numbers"){
      const step=[1,2,5,10,3,4][Math.min(5,Math.floor(L/2))];
      const start=_ri(1,10+L*8);
      const items=[...Array(4)].map((_,k)=>start+k*step);
      qs.push({prompt:step===1?"Build the bridge: smallest to biggest!":`Build the bridge: counting in ${step}s!`,
        items:_shuffle(items.map(String)),correct:items.map(String)});
    } else { // alphabet
      const pick=_shuffle(WORDS).slice(0,4).sort();
      qs.push({prompt:"Build the bridge: alphabetical order!",
        items:_shuffle([...pick]),correct:pick});
    }
  }
  return qs;
}
// Pure step logic: tap an item; is it the next correct plank?
function orderStep(correct,placedCount,tapped){
  const ok=correct[placedCount]===tapped;
  return {ok,done:ok&&placedCount+1>=correct.length};
}

function OrderEngine({child,name,emoji,subject,kind,onComplete=()=>{},onQuit=()=>{},onRetry=null,level=1}){
  const A=useGameA11y();
  const littleOne=(child.age||8)<=6;
  const fetchFn=useCallback(async(lvl)=>({questions:genSequenceQs(kind,lvl,10).map(q=>({...q,q:q.prompt,options:q.items,correct:"∅"}))}),[kind]);
  const game=useLivesGame(fetchFn,level,littleOne?5:3);
  const [placed,setPlaced]=useState([]);
  const [shakeItem,setShakeItem]=useState(null);
  const [slipped,setSlipped]=useState(false); // one mistake allowed per bridge
  const [phase,setPhase]=useState("intro");
  useEffect(()=>{setPlaced([]);setSlipped(false);},[game.qIdx]);
  const q=game.q;
  const tap=(item)=>{
    if(!q||placed.includes(item))return;
    const {ok,done}=orderStep(q.correct,placed.length,item);
    if(ok){
      playSound('correct');haptic('tap');
      setPlaced(p=>[...p,item]);
      if(done)setTimeout(()=>game.answer(!slipped),650);
    } else {
      playSound('wrong');haptic('wrong');
      setShakeItem(item);setSlipped(true);
      setTimeout(()=>setShakeItem(null),450);
    }
  };
  if(game.loadErr)return <GameError name={name} onRetry={()=>onRetry?onRetry():onQuit()}/>;
  if(game.loading&&!q)return <GameLoad name={name} emoji={emoji} tutor={child.tutor}/>;
  if(game.done){
    const attempted=Math.max(game.qIdx+(game.lives<=0?1:0),game.score,1);
    const xpT=game.score*15+game.sector*25;
    return <GameEnd name={name} emoji={emoji} score={game.score} max={attempted} child={child} xp={xpT} level={game.lvl} sectors={game.sector}
      onRetry={()=>onRetry?onRetry():onQuit()}
      onDone={()=>onComplete({score:game.score,max:attempted,xp:xpT,total:attempted,correct:game.score,levelReached:game.lvl,bestStreak:game.bestStreak})}/>;
  }
  if(phase==="intro")return <MissionIntro world={WORLDS.grove} name={name} emoji={emoji} child={child} total={game.missionLen} onGo={()=>setPhase("play")}/>;
  const remaining=(q?.items||[]).filter(it=>!placed.includes(it));
  return(
    <GameShell name={name} emoji={emoji} subject={subject} score={game.score} maxScore={null}
      round={game.qIdx+1} total={null} streak={game.streak} onQuit={()=>game.setDone(true)} lives={game.lives} level={game.lvl}>
      <div style={{background:"rgba(8,12,30,0.5)",backdropFilter:"blur(10px)",borderRadius:20,padding:"14px 16px",marginBottom:14,
        border:"2px solid rgba(255,255,255,0.14)"}}>
        <p style={{fontSize:A.largeText?19:17,fontWeight:900,color:"#fff",textAlign:"center",fontFamily:A.dyslexiaFont?FDYS:F}}>{q?.prompt}</p>
      </div>
      {/* The canyon + bridge being built */}
      <div style={{position:"relative",height:150,marginBottom:16}}>
        <div style={{position:"absolute",bottom:0,left:0,width:"16%",height:74,borderRadius:"12px 12px 0 0",background:"linear-gradient(180deg,#3E2FA8,#241B63)"}}/>
        <div style={{position:"absolute",bottom:0,right:0,width:"16%",height:74,borderRadius:"12px 12px 0 0",background:"linear-gradient(180deg,#3E2FA8,#241B63)"}}/>
        <div style={{position:"absolute",bottom:8,left:"3%",fontSize:30,transform:placed.length>=(q?.correct?.length||4)?"translateX(320%)":`translateX(${placed.length*70}%)`,
          transition:"transform 0.6s cubic-bezier(0.34,1.3,0.64,1)",zIndex:3}}>🦊</div>
        <div style={{position:"absolute",bottom:62,left:"16%",right:"16%",display:"flex",gap:5,alignItems:"flex-end"}}>
          {(q?.correct||[]).map((c,i)=>(
            <div key={i} style={{flex:1,height:36,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
              background:i<placed.length?"linear-gradient(180deg,#FFB020,#CC7F00)":"rgba(255,255,255,0.07)",
              border:i<placed.length?"2px solid #FFD166":"2px dashed rgba(255,255,255,0.25)",
              boxShadow:i<placed.length?"0 4px 0 #8A5600":"none",
              animation:i===placed.length-1?"badgePop 0.4s ease":"none"}}>
              <p style={{fontSize:13,fontWeight:900,color:i<placed.length?"#fff":"rgba(255,255,255,0.25)",fontFamily:F,
                textShadow:"0 1px 0 rgba(0,0,0,0.3)"}}>{i<placed.length?placed[i]:"?"}</p>
            </div>
          ))}
        </div>
        <div style={{position:"absolute",bottom:0,left:"16%",right:"16%",height:8,background:"linear-gradient(180deg,transparent,rgba(0,0,0,0.5))"}}/>
      </div>
      {/* Floating planks to tap in order */}
      <div style={{display:"grid",gridTemplateColumns:A.largeTapTargets?"1fr":"1fr 1fr",gap:11}}>
        {remaining.map((it,i)=>(
          <button key={it} onClick={()=>tap(it)}
            style={{minHeight:A.largeTapTargets?76:64,borderRadius:16,border:"none",cursor:"pointer",
            fontFamily:A.dyslexiaFont?FDYS:F,fontSize:(A.largeText?21:18),fontWeight:900,color:"#fff",
            background:`linear-gradient(180deg,${TILE[i%4].top},${TILE[i%4].top}DD)`,
            boxShadow:`0 5px 0 ${TILE[i%4].base}`,textShadow:"0 2px 0 rgba(0,0,0,0.25)",
            animation:shakeItem===it&&!A.noMotion?"wrongShake 0.45s ease":A.noMotion?"none":`floatY ${2.4+i*0.3}s ease-in-out infinite`}}>
            {it}
          </button>
        ))}
      </div>
      {slipped&&<p style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.65)",textAlign:"center",marginTop:12,fontFamily:F}}>One slip — finish the bridge carefully!</p>}
    </GameShell>
  );
}

// ══════════════════════════════════════════════════════════════════
// NEW MECHANIC 2: MATCH ENGINE — "Memory Match"
// Flip cards to find pairs (question↔answer). Working-memory play —
// nothing like multiple choice, loved from age 4 up.
// ══════════════════════════════════════════════════════════════════
function genPairs(kind,lvl=1){
  const L=Math.max(1,Math.min(10,lvl));
  if(kind==="tables"){
    const seen=new Set();const pairs=[];
    while(pairs.length<6){
      const a=_ri(2,Math.min(12,2+L)),b=_ri(2,Math.min(12,3+L));
      const key=`${a}×${b}`;
      if(seen.has(key)||seen.has(`${b}×${a}`))continue;
      seen.add(key);pairs.push({a:`${a} × ${b}`,b:String(a*b)});
    }
    return pairs;
  }
  const EMOJI_WORDS=[["dog","🐶"],["cat","🐱"],["sun","☀️"],["star","⭐"],["fish","🐟"],["tree","🌳"],["apple","🍎"],["moon","🌙"],["car","🚗"],["book","📚"],["frog","🐸"],["cake","🎂"],["ball","⚽"],["bee","🐝"],["boat","⛵"],["king","👑"]];
  return _shuffle(EMOJI_WORDS).slice(0,6).map(([w,e])=>({a:w,b:e}));
}
function buildBoard(pairs){
  const cards=[];
  pairs.forEach((p,i)=>{cards.push({id:i*2,pair:i,face:p.a});cards.push({id:i*2+1,pair:i,face:p.b});});
  return _shuffle(cards);
}
// Pure flip logic
function matchFlip(state,card){
  const {open,matched}=state;
  if(matched.includes(card.pair)&&open.length===0)return state;
  if(open.some(c=>c.id===card.id))return state;
  if(open.length===0)return {...state,open:[card]};
  if(open.length===1){
    if(open[0].pair===card.pair)return {open:[],matched:[...matched,card.pair],hit:true};
    return {open:[open[0],card],matched,miss:true};
  }
  return state;
}
function MatchEngine({child,name,emoji,subject,kind,onComplete=()=>{},onQuit=()=>{},onRetry=null,level=1}){
  const A=useGameA11y();
  const littleOne=(child.age||8)<=6;
  const [lvl]=useState(Math.max(1,level));
  const [board,setBoard]=useState(()=>buildBoard(genPairs(kind,level)));
  const [st,setSt]=useState({open:[],matched:[]});
  const [misses,setMisses]=useState(0);
  const [boards,setBoards]=useState(0);
  const [score,setScore]=useState(0);
  const [lives,setLives]=useState(littleOne?5:3);
  const [done,setDone]=useState(false);
  const [phase,setPhase]=useState("intro");
  const flip=(card)=>{
    if(done||st.open.length===2)return;
    const ns=matchFlip(st,card);
    if(ns===st)return;
    if(ns.hit){
      playSound('correct');haptic('correct');
      setScore(s=>s+1);setSt({open:[],matched:ns.matched});
      if(ns.matched.length>=6){
        playSound('levelup');
        setTimeout(()=>{
          setBoards(b=>b+1);
          setBoard(buildBoard(genPairs(kind,lvl+boards+1)));
          setSt({open:[],matched:[]});
        },800);
      }
    } else if(ns.miss){
      playSound('wrong');
      setSt({open:ns.open,matched:ns.matched});
      setMisses(m=>{
        const nm=m+1;
        if(nm%4===0){ // every 4 mismatches costs a heart — memory takes practice
          setLives(l=>{const nl=l-1;if(nl<=0)setTimeout(()=>setDone(true),500);return nl;});
          haptic('wrong');
        }
        return nm;
      });
      setTimeout(()=>setSt(s=>({...s,open:[]})),900);
    } else setSt(ns);
  };
  if(done)return <GameEnd name={name} emoji={emoji} score={score} max={Math.max(score+Math.floor(misses/2),1)} child={child}
    xp={score*10+boards*30} level={lvl+boards} sectors={boards}
    onRetry={()=>onRetry?onRetry():onQuit()}
    onDone={()=>onComplete({score,max:Math.max(score,1),xp:score*10+boards*30,total:score+misses,correct:score,levelReached:lvl+boards})}/>;
  if(phase==="intro")return <MissionIntro world={WORLDS.starmap} name={name} emoji={emoji} child={child} total={6} onGo={()=>setPhase("play")}/>;
  return(
    <GameShell name={name} emoji={emoji} subject={subject} score={score} maxScore={null}
      round={boards+1} total={null} streak={0} onQuit={()=>setDone(true)} lives={lives} level={lvl+boards}>
      <p style={{fontSize:13,fontWeight:900,color:"rgba(255,255,255,0.8)",textAlign:"center",marginBottom:12,fontFamily:F}}>
        Find the pairs! Board {boards+1} · {6-st.matched.length} left
      </p>
      <div style={{display:"grid",gridTemplateColumns:A.largeTapTargets?"repeat(3,1fr)":"repeat(4,1fr)",gap:9}}>
        {board.map(card=>{
          const isMatched=st.matched.includes(card.pair);
          const isOpen=st.open.some(c=>c.id===card.id)||isMatched;
          const long=card.face.length>4;
          return(
            <button key={card.id} onClick={()=>flip(card)} aria-label={isOpen?card.face:"Hidden card"}
              style={{aspectRatio:"1",borderRadius:14,border:"none",cursor:"pointer",fontFamily:A.dyslexiaFont?FDYS:F,
              fontSize:long?(A.largeText?15:13):(A.largeText?24:21),fontWeight:900,
              color:isOpen?"#fff":"rgba(255,255,255,0.9)",
              background:isMatched?"linear-gradient(160deg,#2FBF71,#1D8A50)":
                        isOpen?"linear-gradient(160deg,#4D9DF7,#2C6FC4)":
                        "linear-gradient(160deg,#3E2FA8,#241B63)",
              boxShadow:isMatched?"0 0 16px rgba(47,191,113,0.5)":"0 4px 0 rgba(0,0,0,0.3)",
              transform:isOpen?"rotateY(0deg) scale(1.02)":"rotateY(0deg)",
              opacity:isMatched?0.85:1,
              transition:"all 0.25s cubic-bezier(0.34,1.4,0.64,1)",
              textShadow:"0 2px 0 rgba(0,0,0,0.3)"}}>
              {isOpen?card.face:"✦"}
            </button>
          );
        })}
      </div>
      <p style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.5)",textAlign:"center",marginTop:12,fontFamily:F}}>
        Every 4 mix-ups costs a heart — picture where the cards are!
      </p>
    </GameShell>
  );
}

// ══════════════════════════════════════════════════════════════════
// NEW MECHANIC 3: SORT ENGINE — rapid binary classification
// Items fly in one at a time; the child flicks each into the LEFT or
// RIGHT bucket. Speed-classification: a completely different rhythm
// from answering questions.
// ══════════════════════════════════════════════════════════════════
const SORT_SETS={
  oddEven:{name:"Odd & Even Sort",emoji:"⚖️",subject:"Maths",left:"ODD",right:"EVEN",
    gen:(lvl)=>{const n=_ri(1,10+lvl*12);return {label:String(n),side:n%2===0?"right":"left"};}},
  livingThing:{name:"Living or Not?",emoji:"🌱",subject:"Science",left:"LIVING",right:"NOT LIVING",
    items:[["dog","left"],["rock","right"],["tree","left"],["car","right"],["fish","left"],["chair","right"],["flower","left"],["robot","right"],["bird","left"],["spoon","right"],["mushroom","left"],["cloud","right"],["bee","left"],["book","right"],["grass","left"],["kite","right"],["whale","left"],["brick","right"]]},
  nounVerb:{name:"Noun or Verb?",emoji:"📖",subject:"English",left:"NOUN",right:"VERB",
    items:[["apple","left"],["run","right"],["house","left"],["jump","right"],["teacher","left"],["sing","right"],["river","left"],["swim","right"],["pencil","left"],["laugh","right"],["mountain","left"],["dance","right"],["tiger","left"],["climb","right"],["window","left"],["shout","right"]]},
};
function nextSortItem(setKey,lvl,used=[]){
  const set=SORT_SETS[setKey];
  if(set.gen)return set.gen(lvl);
  const fresh=set.items.filter(([w])=>!used.includes(w));
  const pool=fresh.length?fresh:set.items;
  const [label,side]=pool[_ri(0,pool.length-1)];
  return {label,side};
}
function SortEngine({child,setKey,onComplete=()=>{},onQuit=()=>{},onRetry=null,level=1}){
  const A=useGameA11y();
  const set=SORT_SETS[setKey];
  const littleOne=(child.age||8)<=6;
  const [item,setItem]=useState(()=>nextSortItem(setKey,level));
  const [used,setUsed]=useState([]);
  const [score,setScore]=useState(0);
  const [streak,setStreak]=useState(0);
  const [lives,setLives]=useState(littleOne?5:3);
  const [lvl,setLvl]=useState(level);
  const [fxSide,setFxSide]=useState(null); // 'left-ok' | 'right-bad' etc
  const [done,setDone]=useState(false);
  const [phase,setPhase]=useState("intro");
  const throwTo=(side)=>{
    if(done||fxSide)return;
    const ok=side===item.side;
    setFxSide(side+(ok?"-ok":"-bad"));
    if(ok){playSound(streak+1>=5?'combo5':'correct');haptic('correct');setScore(s=>s+1);
      setStreak(st=>{const ns=st+1;if(ns%6===0)setLvl(l=>Math.min(10,l+1));return ns;});}
    else{playSound('wrong');haptic('wrong');setStreak(0);
      setLives(l=>{const nl=l-1;if(nl<=0)setTimeout(()=>setDone(true),500);return nl;});}
    setTimeout(()=>{
      setFxSide(null);
      setUsed(u=>[...u,item.label].slice(-10));
      setItem(nextSortItem(setKey,lvl,used));
    },ok?450:900);
  };
  if(done)return <GameEnd name={set.name} emoji={set.emoji} score={score} max={Math.max(score+((littleOne?5:3)-lives),1)} child={child}
    xp={score*8} level={lvl} sectors={Math.floor(score/12)}
    onRetry={()=>onRetry?onRetry():onQuit()}
    onDone={()=>onComplete({score,max:Math.max(score,1),xp:score*8,total:score+((littleOne?5:3)-lives),correct:score,levelReached:lvl})}/>;
  if(phase==="intro")return <MissionIntro world={WORLDS.turbo} name={set.name} emoji={set.emoji} child={child} total={12} onGo={()=>setPhase("play")}/>;
  const buckets=[["left",set.left,"#4D9DF7","#2C6FC4"],["right",set.right,"#FFB020","#CC7F00"]];
  return(
    <GameShell name={set.name} emoji={set.emoji} subject={set.subject} score={score} maxScore={null}
      round={score+1} total={null} streak={streak} onQuit={()=>setDone(true)} lives={lives} level={lvl}>
      {/* The flying item */}
      <div style={{textAlign:"center",margin:"18px 0 26px",minHeight:96}}>
        <div key={item.label+score} style={{display:"inline-block",padding:"18px 30px",borderRadius:22,
          background:"linear-gradient(160deg,#fff,#EEF2FF)",boxShadow:"0 10px 30px rgba(0,0,0,0.35)",
          animation:A.noMotion?"none":"badgePop 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
          transform:fxSide?.startsWith("left")?"translateX(-90px) rotate(-14deg) scale(0.7)":fxSide?.startsWith("right")?"translateX(90px) rotate(14deg) scale(0.7)":"none",
          opacity:fxSide?0.25:1,transition:"all 0.35s ease"}}>
          <p style={{fontSize:A.largeText?34:30,fontWeight:900,color:"#1E1B4B",fontFamily:A.dyslexiaFont?FDYS:F}}>{item.label}</p>
        </div>
      </div>
      {/* The two buckets */}
      <div style={{display:"flex",gap:14}}>
        {buckets.map(([side,label,top,base])=>{
          const hit=fxSide===side+"-ok",bad=fxSide===side+"-bad";
          return(
            <button key={side} onClick={()=>throwTo(side)} aria-label={`Sort into ${label}`}
              style={{flex:1,minHeight:A.largeTapTargets?120:104,borderRadius:"18px 18px 26px 26px",border:"none",cursor:"pointer",
              fontFamily:F,position:"relative",overflow:"hidden",
              background:hit?"linear-gradient(180deg,#2FBF71,#1D8A50)":bad?(A.noRedFeedback?"#64748B":"linear-gradient(180deg,#E5484D,#A32328)"):`linear-gradient(180deg,${top},${base})`,
              boxShadow:`0 6px 0 rgba(0,0,0,0.3)`,
              animation:bad&&!A.noMotion?"wrongShake 0.45s ease":"none",
              transform:hit?"scale(1.05)":"none",transition:"all 0.2s"}}>
              <div style={{position:"absolute",top:0,left:"8%",right:"8%",height:10,borderRadius:"0 0 10px 10px",background:"rgba(0,0,0,0.22)"}}/>
              <p style={{fontSize:A.largeText?20:17,fontWeight:900,color:"#fff",letterSpacing:"0.08em",textShadow:"0 2px 0 rgba(0,0,0,0.3)"}}>{hit?"✓":bad?"✕":label}</p>
            </button>
          );
        })}
      </div>
      <p style={{fontSize:11.5,fontWeight:800,color:"rgba(255,255,255,0.6)",textAlign:"center",marginTop:14,fontFamily:F}}>Tap the right bucket — faster streaks level you up!</p>
    </GameShell>
  );
}

// ══════════════════════════════════════════════════════════════════
// NEW MECHANIC 4: NUMBER LINE — spatial number sense
// No options at all: a frog and a number line. The child taps WHERE
// the answer lives. Estimation and placement, pure number sense.
// ══════════════════════════════════════════════════════════════════
function genLineQ(lvl){
  const L=Math.max(1,Math.min(10,lvl));
  const max=L<=2?10:L<=5?20:L<=8?50:100;
  const step=max<=20?1:max<=50?5:10;
  const ticks=[];for(let v=0;v<=max;v+=step)ticks.push(v);
  const mode=_ri(0,2);
  if(mode===0){const t=ticks[_ri(1,ticks.length-2)];return {prompt:`Jump to ${t}!`,target:t,max,step,ticks};}
  if(mode===1){const a=ticks[_ri(0,ticks.length-3)];const t=a+step*_ri(1,2);return {prompt:`Jump to ${a} + ${t-a}!`,target:t,max,step,ticks};}
  const b=ticks[_ri(2,ticks.length-1)];const t=b-step*_ri(1,2);return {prompt:`Jump to ${b} − ${b-t}!`,target:t,max,step,ticks};
}
function FrogJump({child,mode,onComplete=()=>{},onQuit=()=>{},onRetry,level=1}){
  const A=useGameA11y();
  const littleOne=(child.age||8)<=6;
  const [q,setQ]=useState(()=>genLineQ(level));
  const [frogAt,setFrogAt]=useState(0);
  const [score,setScore]=useState(0);
  const [streak,setStreak]=useState(0);
  const [lives,setLives]=useState(littleOne?5:3);
  const [lvl,setLvl]=useState(level);
  const [locked,setLocked]=useState(false);
  const [result,setResult]=useState(null);
  const [done,setDone]=useState(false);
  const [phase,setPhase]=useState("intro");
  const hop=(v)=>{
    if(locked||done)return;
    setLocked(true);setFrogAt(v);
    const ok=v===q.target;
    setResult(ok?"ok":"bad");
    if(ok){playSound('correct');haptic('correct');setScore(s=>s+1);
      setStreak(st=>{const ns=st+1;if(ns%5===0)setLvl(l=>Math.min(10,l+1));return ns;});}
    else{playSound('wrong');haptic('wrong');setStreak(0);
      setLives(l=>{const nl=l-1;if(nl<=0)setTimeout(()=>setDone(true),700);return nl;});}
    setTimeout(()=>{setResult(null);setLocked(false);setFrogAt(0);setQ(genLineQ(ok?lvl:Math.max(1,lvl)));},ok?900:1500);
  };
  if(done)return <GameEnd name="Frog Number Jump" emoji="🐸" score={score} max={Math.max(score+((littleOne?5:3)-lives),1)} child={child}
    xp={score*12} level={lvl} sectors={Math.floor(score/12)}
    onRetry={()=>onRetry?onRetry():onQuit()}
    onDone={()=>onComplete({score,max:Math.max(score,1),xp:score*12,total:score+((littleOne?5:3)-lives),correct:score,levelReached:lvl})}/>;
  if(phase==="intro")return <MissionIntro world={WORLDS.grove} name="Frog Number Jump" emoji="🐸" child={child} total={12} onGo={()=>setPhase("play")}/>;
  const pct=(v)=>`${(v/q.max)*100}%`;
  return(
    <GameShell name="Frog Number Jump" emoji="🐸" subject="Maths" score={score} maxScore={null}
      round={score+1} total={null} streak={streak} onQuit={()=>setDone(true)} lives={lives} level={lvl}>
      <div style={{background:"rgba(8,12,30,0.5)",backdropFilter:"blur(10px)",borderRadius:20,padding:"14px 16px",marginBottom:22,border:"2px solid rgba(255,255,255,0.14)"}}>
        <p style={{fontSize:A.largeText?21:19,fontWeight:900,color:"#fff",textAlign:"center",fontFamily:A.dyslexiaFont?FDYS:F}}>{q.prompt}</p>
      </div>
      {/* The frog above the line */}
      <div style={{position:"relative",height:56,marginBottom:2}}>
        <div style={{position:"absolute",left:`calc(${pct(frogAt)} - 17px)`,bottom:0,fontSize:30,
          transition:"left 0.5s cubic-bezier(0.34,1.4,0.64,1)",
          animation:result==="ok"&&!A.noMotion?"jellyPop 0.5s ease":result==="bad"&&!A.noMotion?"wrongShake 0.45s ease":A.noMotion?"none":"floatY 1.6s ease-in-out infinite",
          filter:result==="ok"?"drop-shadow(0 0 12px rgba(47,191,113,0.9))":result==="bad"?"drop-shadow(0 0 12px rgba(255,93,115,0.9))":"drop-shadow(0 4px 8px rgba(0,0,0,0.5))"}}>🐸</div>
      </div>
      {/* The number line: tappable lily-pad ticks */}
      <div style={{position:"relative",padding:"0 2px"}}>
        <div style={{position:"absolute",top:15,left:0,right:0,height:5,borderRadius:3,background:"linear-gradient(90deg,#4ADE80,#22C55E)"}}/>
        <div style={{display:"flex",justifyContent:"space-between",position:"relative"}}>
          {q.ticks.map(v=>{
            const isTarget=result&&v===q.target;
            return(
              <button key={v} onClick={()=>hop(v)} aria-label={`Jump to ${v}`}
                style={{width:q.ticks.length>12?26:34,height:q.ticks.length>12?26:34,borderRadius:"50%",border:"none",cursor:"pointer",
                fontFamily:F,fontSize:q.ticks.length>12?9.5:12,fontWeight:900,padding:0,
                background:isTarget?"#2FBF71":v===frogAt&&result==="bad"?(A.noRedFeedback?"#64748B":"#E5484D"):"linear-gradient(180deg,#166534,#14532D)",
                color:"#fff",boxShadow:isTarget?"0 0 14px rgba(47,191,113,0.8)":"0 3px 0 rgba(0,0,0,0.35)",
                transform:isTarget?"scale(1.2)":"none",transition:"all 0.25s"}}>{v}</button>
            );
          })}
        </div>
      </div>
      <p style={{fontSize:11.5,fontWeight:800,color:"rgba(255,255,255,0.6)",textAlign:"center",marginTop:18,fontFamily:F}}>Tap the lily pad where the answer lives!</p>
    </GameShell>
  );
}

// ══════════════════════════════════════════════════════════════════
// NEW MECHANIC 5: BALANCE SCALE — constructive equality
// The child BUILDS the answer by stacking weights until both pans
// balance. Understanding "=" as balance, not as "the answer goes here".
// ══════════════════════════════════════════════════════════════════
function balanceState(target,weights){const sum=weights.reduce((a,b)=>a+b,0);return {sum,balanced:sum===target,over:sum>target};}
function genBalanceQ(lvl){
  const L=Math.max(1,Math.min(10,lvl));
  const target=_ri(4,8+L*6);
  return {target,tokens:L<=3?[1,2,5]:[1,2,5,10]};
}
function BalanceScale({child,mode,onComplete=()=>{},onQuit=()=>{},onRetry,level=1}){
  const A=useGameA11y();
  const littleOne=(child.age||8)<=6;
  const [q,setQ]=useState(()=>genBalanceQ(level));
  const [weights,setWeights]=useState([]);
  const [score,setScore]=useState(0);
  const [lives,setLives]=useState(littleOne?5:3);
  const [lvl,setLvl]=useState(level);
  const [flash,setFlash]=useState(null);
  const [done,setDone]=useState(false);
  const [phase,setPhase]=useState("intro");
  const st=balanceState(q.target,weights);
  const add=(w)=>{
    if(done||flash)return;
    const ns=balanceState(q.target,[...weights,w]);
    if(ns.over){
      playSound('wrong');haptic('wrong');setFlash("over");
      setLives(l=>{const nl=l-1;if(nl<=0)setTimeout(()=>setDone(true),600);return nl;});
      setTimeout(()=>{setFlash(null);setWeights([]);},900);
      return;
    }
    playSound('tap');
    setWeights(ws=>[...ws,w]);
    if(ns.balanced){
      playSound('levelup');haptic('correct');setFlash("ok");
      setScore(s=>{const nsc=s+1;if(nsc%4===0)setLvl(l=>Math.min(10,l+1));return nsc;});
      setTimeout(()=>{setFlash(null);setWeights([]);setQ(genBalanceQ(lvl+1));},1000);
    }
  };
  if(done)return <GameEnd name="Balance Scale" emoji="⚖️" score={score} max={Math.max(score+((littleOne?5:3)-lives),1)} child={child}
    xp={score*14} level={lvl} sectors={Math.floor(score/8)}
    onRetry={()=>onRetry?onRetry():onQuit()}
    onDone={()=>onComplete({score,max:Math.max(score,1),xp:score*14,total:score+((littleOne?5:3)-lives),correct:score,levelReached:lvl})}/>;
  if(phase==="intro")return <MissionIntro world={WORLDS.cosmic} name="Balance Scale" emoji="⚖️" child={child} total={8} onGo={()=>setPhase("play")}/>;
  const tilt=st.balanced?0:Math.max(-10,Math.min(10,(st.sum-q.target)*1.4));
  return(
    <GameShell name="Balance Scale" emoji="⚖️" subject="Maths" score={score} maxScore={null}
      round={score+1} total={null} streak={0} onQuit={()=>setDone(true)} lives={lives} level={lvl}>
      <p style={{fontSize:A.largeText?18:16,fontWeight:900,color:"#fff",textAlign:"center",marginBottom:16,fontFamily:A.dyslexiaFont?FDYS:F}}>
        Make both sides balance!
      </p>
      {/* The scale */}
      <div style={{position:"relative",height:170,marginBottom:14}}>
        <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:16,height:74,borderRadius:6,background:"linear-gradient(180deg,#8E97B8,#5B647F)"}}/>
        <div style={{position:"absolute",bottom:66,left:"50%",width:"84%",height:9,borderRadius:5,
          transform:`translateX(-50%) rotate(${flash==="over"?12:tilt}deg)`,transformOrigin:"center",
          transition:"transform 0.5s cubic-bezier(0.34,1.3,0.64,1)",
          background:"linear-gradient(90deg,#FFB020,#CC7F00)",boxShadow:"0 3px 0 rgba(0,0,0,0.3)"}}>
          {/* left pan: the target */}
          <div style={{position:"absolute",left:-8,top:9,width:86,textAlign:"center"}}>
            <div style={{height:56,borderRadius:"0 0 40px 40px",background:"rgba(77,157,247,0.25)",border:"2.5px solid #4D9DF7",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <p style={{fontSize:26,fontWeight:900,color:"#fff",fontFamily:F,textShadow:"0 0 12px rgba(77,157,247,0.8)"}}>{q.target}</p>
            </div>
          </div>
          {/* right pan: the child's build */}
          <div style={{position:"absolute",right:-8,top:9,width:86,textAlign:"center"}}>
            <div style={{height:56,borderRadius:"0 0 40px 40px",
              background:st.balanced?"rgba(47,191,113,0.3)":"rgba(255,209,102,0.18)",
              border:`2.5px solid ${st.balanced?"#2FBF71":flash==="over"?(A.noRedFeedback?"#94A3B8":"#E5484D"):"#FFD166"}`,
              display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s",
              boxShadow:st.balanced?"0 0 18px rgba(47,191,113,0.7)":"none"}}>
              <p style={{fontSize:26,fontWeight:900,color:"#fff",fontFamily:F}}>{st.sum}{st.balanced?" ✓":""}</p>
            </div>
          </div>
        </div>
        {flash==="over"&&<p style={{position:"absolute",top:6,left:0,right:0,textAlign:"center",fontSize:14,fontWeight:900,color:A.noRedFeedback?"#CBD5E1":"#FCA5A5",fontFamily:F}}>Too heavy! Start again 💪</p>}
        {flash==="ok"&&<p style={{position:"absolute",top:6,left:0,right:0,textAlign:"center",fontSize:16,fontWeight:900,color:"#4ADE80",fontFamily:F}}>⚖️ Balanced! {q.target} = {weights.join(" + ")}</p>}
      </div>
      {/* Weight tokens */}
      <div style={{display:"flex",gap:12,justifyContent:"center"}}>
        {q.tokens.map(w=>(
          <button key={w} onClick={()=>add(w)} aria-label={`Add a ${w} weight`}
            style={{width:A.largeTapTargets?76:64,height:A.largeTapTargets?76:64,borderRadius:"50%",border:"none",cursor:"pointer",
            fontFamily:F,fontSize:A.largeText?24:21,fontWeight:900,color:"#fff",
            background:"radial-gradient(circle at 34% 30%,#A78BFA,#7C3AED 65%,#5B21B6)",
            boxShadow:"0 5px 0 #4C1D95, 0 8px 18px rgba(124,58,237,0.4)",
            textShadow:"0 2px 0 rgba(0,0,0,0.3)"}}>+{w}</button>
        ))}
      </div>
      <p style={{fontSize:11.5,fontWeight:800,color:"rgba(255,255,255,0.6)",textAlign:"center",marginTop:14,fontFamily:F}}>Stack weights to match — go over and the scale tips!</p>
    </GameShell>
  );
}

// ══════════════════════════════════════════════════════════════════
// NEW MECHANIC 6: ROBOT CODER — real computational thinking
// The child WRITES A PROGRAM (arrow commands), then presses RUN and
// watches the robot execute it. Plan → predict → debug: the core of
// the computing curriculum as a game, not a quiz about it.
// ══════════════════════════════════════════════════════════════════
// 10 handcrafted levels: 5 cols × 4 rows. R=robot start, S=star, #=wall
const ROBO_LEVELS=[
  {g:["R...S","#####","#####","#####"],sol:"→→→→"},
  {g:["R....","....S","#####","#####"],sol:"↓→→→→"},
  {g:["R....","#####","....S","#####"],sol:"↓↓↓→→→→↑"},          // impossible row — never used; placeholder replaced below
  {g:["R.#..","..#..","..#..","..#.S"],sol:"↓↓↓→→→→"},
  {g:["R....","...#.",".###.","....S"],sol:"↓↓↓→→→→"},
  {g:["..R..",".#.#.",".#.#.","S...."],sol:"↓↓↓←←"},
  {g:["R.#.S","..#..","..#..","....."],sol:"↓↓↓→→→↑↑↑→"},
  {g:["R....",".###.",".#.#.",".#..S"],sol:"→→→→↓↓↓"},
  {g:["....R",".##..",".....","S.##."],sol:"↓↓←←←↓←"},
  {g:["R.#..","..#.S","..#..","....."],sol:"↓↓↓→→→↑↑→"},
];
// fix the two placeholders with valid mazes
ROBO_LEVELS[2]={g:["R....","....#","...#S","....."],sol:"↓↓↓→→→→↑"};
ROBO_LEVELS[3]={g:["R.#..","..#..","..#..","....S"],sol:"↓↓↓→→→→"};
function roboParse(level){
  const walls=new Set();let robot=null,star=null;
  level.g.forEach((row,y)=>[...row].forEach((ch,x)=>{
    if(ch==="#")walls.add(x+","+y);
    if(ch==="R")robot={x,y};
    if(ch==="S")star={x,y};
  }));
  return {walls,robot,star,w:5,h:4};
}
// Pure simulator: returns {path,success,crashAt}
function roboRun(level,program){
  const {walls,robot,star}=roboParse(level);
  const D={"↑":[0,-1],"↓":[0,1],"←":[-1,0],"→":[1,0]};
  let {x,y}=robot;const path=[{x,y}];
  for(const cmd of program){
    const [dx,dy]=D[cmd]||[0,0];
    const nx=x+dx,ny=y+dy;
    if(nx<0||nx>=5||ny<0||ny>=4||walls.has(nx+","+ny))return {path,success:false,crashAt:path.length};
    x=nx;y=ny;path.push({x,y});
    if(x===star.x&&y===star.y)return {path,success:true};
  }
  return {path,success:false};
}
function RoboRescue({child,mode,onComplete=()=>{},onQuit=()=>{},onRetry,level=1}){
  const A=useGameA11y();
  const littleOne=(child.age||8)<=6;
  const [li,setLi]=useState(0);
  const [prog,setProg]=useState([]);
  const [botPos,setBotPos]=useState(null);
  const [running,setRunning]=useState(false);
  const [fails,setFails]=useState(0);
  const [score,setScore]=useState(0);
  const [lives,setLives]=useState(littleOne?5:3);
  const [done,setDone]=useState(false);
  const [msg,setMsg]=useState(null);
  const [phase,setPhase]=useState("intro");
  const lvlDef=ROBO_LEVELS[li%ROBO_LEVELS.length];
  const parsed=roboParse(lvlDef);
  const run=()=>{
    if(running||prog.length===0)return;
    setRunning(true);setMsg(null);
    const res=roboRun(lvlDef,prog);
    let step=0;
    const t=setInterval(()=>{
      setBotPos(res.path[step]);
      playSound('tap');
      step++;
      if(step>=res.path.length){
        clearInterval(t);
        setTimeout(()=>{
          if(res.success){
            playSound('levelup');haptic('levelup');setMsg("rescued");
            setScore(s=>s+1);
            setTimeout(()=>{setLi(i=>i+1);setProg([]);setBotPos(null);setRunning(false);setMsg(null);setFails(0);},1100);
          } else {
            playSound('wrong');haptic('wrong');setMsg("crash");
            setFails(f=>{
              const nf=f+1;
              if(nf>=2){setLives(l=>{const nl=l-1;if(nl<=0)setTimeout(()=>setDone(true),600);return nl;});return 0;}
              return nf;
            });
            setTimeout(()=>{setBotPos(null);setRunning(false);},900);
          }
        },350);
      }
    },A.noMotion?60:420);
  };
  if(done)return <GameEnd name="Robo Rescue" emoji="🤖" score={score} max={Math.max(score+((littleOne?5:3)-lives),1)} child={child}
    xp={score*20} level={Math.min(10,1+score)} sectors={Math.floor(score/5)}
    onRetry={()=>onRetry?onRetry():onQuit()}
    onDone={()=>onComplete({score,max:Math.max(score,1),xp:score*20,total:score+((littleOne?5:3)-lives),correct:score,levelReached:Math.min(10,1+score)})}/>;
  if(phase==="intro")return <MissionIntro world={WORLDS.starmap} name="Robo Rescue" emoji="🤖" child={child} total={10} onGo={()=>setPhase("play")}/>;
  const bot=botPos||parsed.robot;
  return(
    <GameShell name="Robo Rescue" emoji="🤖" subject="Computing" score={score} maxScore={null}
      round={li+1} total={null} streak={0} onQuit={()=>setDone(true)} lives={lives} level={Math.min(10,1+score)}>
      <p style={{fontSize:13,fontWeight:900,color:"rgba(255,255,255,0.85)",textAlign:"center",marginBottom:12,fontFamily:F}}>
        Write a program to reach the ⭐ — then press RUN!
      </p>
      {/* The grid world */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:14,
        background:"rgba(8,12,30,0.5)",padding:10,borderRadius:18,border:"2px solid rgba(255,255,255,0.12)"}}>
        {[...Array(4)].flatMap((_,y)=>[...Array(5)].map((_,x)=>{
          const isWall=parsed.walls.has(x+","+y);
          const isBot=bot.x===x&&bot.y===y;
          const isStar=parsed.star.x===x&&parsed.star.y===y&&!(msg==="rescued"&&isBot);
          return(
            <div key={x+","+y} style={{aspectRatio:"1",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:22,background:isWall?"linear-gradient(160deg,#3E2FA8,#241B63)":"rgba(255,255,255,0.06)",
              border:isWall?"none":"1px solid rgba(255,255,255,0.08)",
              boxShadow:isWall?"inset 0 -3px 0 rgba(0,0,0,0.3)":"none",
              transition:"all 0.2s"}}>
              {isBot?<span style={{animation:msg==="crash"&&!A.noMotion?"wrongShake 0.45s ease":msg==="rescued"&&!A.noMotion?"jellyPop 0.5s ease":"none",
                filter:msg==="rescued"?"drop-shadow(0 0 10px rgba(74,222,128,0.9))":"none"}}>🤖</span>
               :isStar?"⭐":""}
            </div>
          );
        }))}
      </div>
      {/* The program */}
      <div style={{minHeight:44,borderRadius:14,background:"rgba(255,255,255,0.07)",border:"1.5px dashed rgba(255,255,255,0.25)",
        display:"flex",alignItems:"center",gap:6,padding:"6px 10px",marginBottom:12,flexWrap:"wrap"}}>
        {prog.length===0&&<p style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.4)",fontFamily:F}}>Your program appears here…</p>}
        {prog.map((c,i)=>(
          <span key={i} style={{width:30,height:30,borderRadius:8,background:"linear-gradient(180deg,#4D9DF7,#2C6FC4)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#fff",
            boxShadow:"0 2.5px 0 #1D4E8F"}}>{c}</span>
        ))}
      </div>
      {/* Command buttons */}
      <div style={{display:"flex",gap:9,justifyContent:"center",marginBottom:12}}>
        {["↑","↓","←","→"].map(c=>(
          <button key={c} onClick={()=>!running&&prog.length<12&&setProg(p=>[...p,c])} aria-label={`Add ${c} command`}
            style={{width:A.largeTapTargets?66:56,height:A.largeTapTargets?66:56,borderRadius:16,border:"none",cursor:"pointer",
            fontSize:24,fontWeight:900,color:"#fff",fontFamily:F,
            background:"linear-gradient(180deg,#7C6CFF,#5B4BD4)",boxShadow:"0 5px 0 #3E2FA8"}}>{c}</button>
        ))}
        <button onClick={()=>!running&&setProg(p=>p.slice(0,-1))} aria-label="Delete last command"
          style={{width:A.largeTapTargets?66:56,height:A.largeTapTargets?66:56,borderRadius:16,border:"none",cursor:"pointer",
          fontSize:20,color:"#fff",fontFamily:F,background:"rgba(255,255,255,0.12)",boxShadow:"0 5px 0 rgba(0,0,0,0.3)"}}>⌫</button>
      </div>
      <button onClick={run} disabled={running||prog.length===0}
        style={{width:"100%",padding:"15px",borderRadius:18,border:"none",cursor:running?"default":"pointer",
        fontFamily:F,fontSize:17,fontWeight:900,color:"#fff",letterSpacing:"0.08em",
        background:running?"rgba(255,255,255,0.15)":"linear-gradient(180deg,#2FBF71,#1D8A50)",
        boxShadow:running?"none":"0 6px 0 #14532D"}}>
        {running?"RUNNING…":msg==="crash"?"↻ DEBUG & RUN AGAIN":"▶ RUN PROGRAM"}
      </button>
      {msg==="crash"&&<p style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.7)",textAlign:"center",marginTop:10,fontFamily:F}}>Crashed! Find the bug in your program — that's what real coders do.</p>}
    </GameShell>
  );
}

// Games on the sort mechanic
function OddEvenSort(props){return <SortEngine {...props} setKey="oddEven"/>;}
function LivingSort(props){return <SortEngine {...props} setKey="livingThing"/>;}
function NounVerbSort(props){return <SortEngine {...props} setKey="nounVerb"/>;}

// The four new games on the two new mechanics
function NumberBridge({child,mode,onComplete,onQuit,onRetry,level=1}){
  return <OrderEngine child={child} name="Number Bridge" emoji="🌉" subject="Maths" kind="numbers" level={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}
function AlphabetBridge({child,mode,onComplete,onQuit,onRetry,level=1}){
  return <OrderEngine child={child} name="Alphabet Bridge" emoji="🔤" subject="English" kind="alphabet" level={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}
function TableMatch({child,mode,onComplete,onQuit,onRetry,level=1}){
  return <MatchEngine child={child} name="Times Table Match" emoji="🃏" subject="Maths" kind="tables" level={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}
function WordPicMatch({child,mode,onComplete,onQuit,onRetry,level=1}){
  return <MatchEngine child={child} name="Word & Picture Match" emoji="🖼️" subject="English" kind="words" level={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

// ── Games referenced by GamePlayer but previously undefined ────────
function NumberBlaster({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>({questions:genMathQs("addsub",lvl,15)}),[]); // local: instant, no AI cost
  return <ShooterEngine child={child} name="Number Blaster" emoji="🔢" subject="Maths" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}
function MathSprint({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>({questions:genMathQs("mixed",lvl,15)}),[]); // local: instant, no AI cost
  return <RunnerEngine child={child} name="Math Sprint" emoji="🏃" subject="Maths" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}
function SpellingRun({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 12 spelling questions ("Which spelling is correct?") for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Options max 14 chars. Return ONLY JSON: {"questions":[{"q":"Which spelling is correct?","options":["A) freind","B) friend","C) frend","D) friende"],"correct":"B"}]}`,"Spelling run questions."),[child]);
  return <RunnerEngine child={child} name="Spelling Run" emoji="🏃‍♀️" subject="English" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

// ── Bottom navigation (referenced by ChildDash, previously undefined)
function BottomNav({active,onHome,onLearn,onGames,onBadges}) {
  const items=[
    {id:"home",  label:"Home",   emoji:"🏠", fn:onHome},
    {id:"learn", label:"Learn",  emoji:"📚", fn:onLearn},
    {id:"games", label:"Games",  emoji:"🎮", fn:onGames},
    {id:"badges",label:"Badges", emoji:"🏆", fn:onBadges},
  ];
  return(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,
      background:"rgba(255,255,255,0.92)",backdropFilter:"blur(14px)",borderTop:`1.5px solid ${C.border}`,
      display:"flex",justifyContent:"space-around",padding:"8px 8px calc(10px + env(safe-area-inset-bottom))",zIndex:50}}>
      {items.map(it=>(
        <button key={it.id} onClick={it.fn} style={{background:"transparent",border:"none",cursor:"pointer",
          fontFamily:F,padding:"4px 14px",borderRadius:14,position:"relative"}}>
          <p style={{fontSize:21,marginBottom:1,transform:active===it.id?"translateY(-2px) scale(1.12)":"none",transition:"transform 0.2s"}}>{it.emoji}</p>
          <p style={{fontSize:10,fontWeight:900,color:active===it.id?C.primary:C.muted}}>{it.label}</p>
          {active===it.id&&<div style={{position:"absolute",bottom:-2,left:"50%",transform:"translateX(-50%)",width:18,height:3.5,borderRadius:2,background:C.primary}}/>}
        </button>
      ))}
    </div>
  );
}


function TimesTableRace({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const game=useLivesGame(
    useCallback(async(lvl)=>({questions:genMathQs("tables",lvl,15)}),[]), // local: instant, no AI cost
    level
  );
  const [input,setInput]=useState("");
  const A=useGameA11y();
  const [timeLeft,setTimeLeft]=useState(Math.max(15,35-game.lvl));
  const [timerKey,setTimerKey]=useState(0);
  const inputRef=useRef(null);

  useEffect(()=>{setTimeLeft(Math.max(15,35-game.lvl));setTimerKey(k=>k+1);setInput("");},[game.qIdx]);
  useEffect(()=>{
    if(A.noTimers||game.done||timeLeft<=0)return; // anxiety/dyscalculia/dyspraxia: no time pressure
    const t=setInterval(()=>setTimeLeft(s=>{if(s<=1){clearInterval(t);game.answer(false);return 0;}return s-1;}),1000);
    return()=>clearInterval(t);
  },[timerKey,game.done]);

  const submit=()=>{
    if(!input.trim()||!game.q)return;
    const q=game.q;
    // Extract correct number from option string
    const correctNum=q.correct?.replace(/[^0-9]/g,"");
    const ok=input.trim()===correctNum;
    game.answer(ok);
    setInput("");
  };

  if(game.loadErr)return <GameError name="Times Table Race" onRetry={()=>onQuit()}/>;
  if(game.loading&&!game.q)return <GameLoad name="Times Table Race" emoji="⏱️" tutor={child.tutor}/>;
  if(game.done)return <GameEnd name="Times Table Race" emoji="⏱️" score={game.score} max={game.score+3-game.lives} child={child} xp={game.score*12} level={game.lvl} onRetry={()=>onRetry?onRetry():onQuit()} onDone={()=>onComplete({score:game.score,max:game.score+3-game.lives,xp:game.score*12,total:game.qIdx,correct:game.score,levelReached:game.lvl})}/>;

  const danger=timeLeft<=3;
  return(
    <GameShell name="Times Table Race" emoji="⏱️" subject="Maths" score={game.score} maxScore={null} round={game.qIdx+1} total={null} streak={game.streak} onQuit={()=>game.setDone(true)} lives={game.lives} level={game.lvl}>
      <div style={{background:`linear-gradient(135deg,${danger?"#FEF2F2":"#EEF2FF"},${danger?"#FEE2E2":"#C7D2FE"})`,borderRadius:20,padding:20,marginBottom:16,textAlign:"center",border:`2px solid ${danger?C.red:C.primary}`}}>
        <div style={{fontSize:36,fontWeight:900,color:danger?C.red:C.primary,marginBottom:8}}>{game.q?.q}</div>
        <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
          {A.noTimers
            ? <span style={{fontSize:13,fontWeight:800,color:C.primary}}>🌿 Take your time — no rush!</span>
            : <>
                <div style={{flex:1,height:8,borderRadius:4,background:"rgba(0,0,0,0.1)"}}><div style={{height:"100%",width:`${(timeLeft/Math.max(5,12-game.lvl))*100}%`,background:danger?C.red:C.primary,borderRadius:4,transition:"width 1s"}}/></div>
                <span style={{fontSize:14,fontWeight:900,color:danger?C.red:C.primary,minWidth:24}}>{timeLeft}s</span>
              </>}
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value.replace(/[^0-9]/g,""))}
          onKeyDown={e=>e.key==="Enter"&&submit()} type="number" placeholder="Type answer..."
          style={{flex:1,padding:"14px 16px",borderRadius:14,fontSize:20,fontWeight:900,color:C.text,background:C.surface,outline:"none",border:`2px solid ${C.border}`,fontFamily:F}}/>
        <button onClick={submit} style={{padding:"14px 20px",borderRadius:14,fontWeight:900,background:C.primary,color:"#fff",border:"none",cursor:"pointer",fontFamily:F,fontSize:16}}>✓</button>
      </div>
    </GameShell>
  );
}


function FractionChef({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 fractions questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options. Return ONLY JSON: {"questions":[{"q":"What is 1/2 of 20?","options":["A) 5","B) 8","C) 10","D) 15"],"correct":"C"}]}`,"Fraction chef questions."),[child]);
  return <CatcherEngine child={child} name="Fraction Chef" emoji="🍕" subject="Maths" color="#EF4444" bg="#FEF2F2" catcherChar="🍕" sceneBg="linear-gradient(180deg,#FEF2F2,#FEE2E2)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}


function WordScramble({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 spelling, unscrambling words at curriculum Level for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Word Scramble questions."),[child]);
  return <CatcherEngine child={child} name="Word Scramble" emoji="🔤" subject="English" color="#0EA5E9" bg="#F0F9FF" catcherChar="🧺" sceneBg="linear-gradient(180deg,#EEF2FF,#BFDBFE)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function SpellingBee({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const game=useLivesGame(
    useCallback(async(lvl)=>claude(`Generate 10 spelling words for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Return ONLY JSON: {"questions":[{"word":"friend","hint":"A person you play with","sentence":"My ___ came to my house"}]}`,"Spelling bee questions."),[child]),
    level
  );
  const [input,setInput]=useState("");
  const [result,setResult]=useState(null);
  const inputRef=useRef(null);

  const submit=()=>{
    if(!input.trim()||!game.q)return;
    const ok=input.trim().toLowerCase()===game.q.word?.toLowerCase();
    setResult(ok?"correct":"wrong");
    game.answer(ok);
    setTimeout(()=>{setResult(null);setInput("");},900);
  };

  const A=useGameA11y();
  const speakWord=()=>{
    if(A.noAudio||SOUND_PREF.muted||!window.speechSynthesis||!game.q?.word)return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(game.q.word);
    u.rate=0.72;u.pitch=1.05;u.volume=1; // extra slow and clear for spelling
    const pick=pickBestVoice(window.speechSynthesis.getVoices());
    if(pick)u.voice=pick;
    window.speechSynthesis.speak(u);
  };

  if(game.loadErr)return <GameError name="Spelling Bee" onRetry={()=>onQuit()}/>;
  if(game.loading&&!game.q)return <GameLoad name="Spelling Bee" emoji="🐝" tutor={child.tutor}/>;
  if(game.done)return <GameEnd name="Spelling Bee" emoji="🐝" score={game.score} max={game.score+3-game.lives} child={child} xp={game.score*12} level={game.lvl} onRetry={()=>onRetry?onRetry():onQuit()} onDone={()=>onComplete({score:game.score,max:game.score+3-game.lives,xp:game.score*12,total:game.qIdx,correct:game.score,levelReached:game.lvl})}/>;

  // Hearing impairment: the game becomes fully visual — scrambled letter tiles
  // replace the spoken word, so the child unscrambles rather than listens.
  const scrambled=A.noAudio&&game.q?.word
    ? [...game.q.word.toLowerCase()].map((ch,i)=>({ch,k:(i*7+3)%13})).sort((a,b)=>a.k-b.k).map(o=>o.ch)
    : null;

  return(
    <GameShell name="Spelling Bee" emoji="🐝" subject="English" score={game.score} maxScore={null} round={game.qIdx+1} total={null} streak={game.streak} onQuit={()=>game.setDone(true)} lives={game.lives} level={game.lvl}>
      <div style={{background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",borderRadius:20,padding:20,marginBottom:16,textAlign:"center",border:"2px solid #F59E0B"}}>
        <div style={{fontSize:40,marginBottom:8}}>🐝</div>
        {scrambled&&(
          <div style={{marginBottom:10}}>
            <p style={{fontSize:12,fontWeight:800,color:"#78350F",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em"}}>Unscramble these letters:</p>
            <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
              {scrambled.map((ch,i)=>(
                <span key={i} style={{width:34,height:38,borderRadius:9,background:"#fff",border:"2px solid #F59E0B",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,fontWeight:900,color:"#92400E",
                  fontFamily:A.dyslexiaFont?FDYS:F,boxShadow:"0 3px 0 #D97706"}}>{ch}</span>
              ))}
            </div>
          </div>
        )}
        {game.q?.sentence&&<p style={{fontSize:A.largeText?16:14,fontWeight:600,color:"#92400E",marginBottom:8,lineHeight:1.6,fontStyle:"italic",fontFamily:A.dyslexiaFont?FDYS:F}}>"{game.q.sentence.replace("_".repeat(game.q.word?.length||5),"_ _ _")}"</p>}
        {game.q?.hint&&<p style={{fontSize:A.largeText?15:13,fontWeight:600,color:"#78350F",fontFamily:A.dyslexiaFont?FDYS:F}}>💡 {game.q.hint}</p>}
        {!A.noAudio&&<button onClick={speakWord} style={{marginTop:10,padding:"6px 16px",borderRadius:10,background:"#F59E0B",border:"none",cursor:"pointer",fontSize:13,fontWeight:800,color:"#fff",fontFamily:F}}>🔊 Hear the word</button>}
      </div>
      {result&&<div style={{textAlign:"center",fontSize:A.largeText?26:22,fontWeight:900,marginBottom:8,fontFamily:F,
        color:result==="correct"?"#4ADE80":A.noRedFeedback?"#CBD5E1":"#FCA5A5"}}>
        {result==="correct"?"✅ Correct!":`${A.noRedFeedback?"Almost!":"❌"} It was: ${game.q?.word}`}</div>}
      <div style={{display:"flex",gap:8}}>
        <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&submit()}
          placeholder="Type the spelling..."
          style={{flex:1,padding:"14px",borderRadius:14,fontSize:17,fontWeight:700,color:C.text,background:C.surface,outline:"none",border:`2px solid ${input?C.primary:C.border}`,fontFamily:F}}/>
        <button onClick={submit} style={{padding:"14px 20px",borderRadius:14,fontWeight:900,background:C.primary,color:"#fff",border:"none",cursor:"pointer",fontFamily:F,fontSize:16}}>✓</button>
      </div>
    </GameShell>
  );
}


function SentenceBuilder({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 grammar, sentence structure, correct word order for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Sentence Builder questions."),[child]);
  return <ShooterEngine child={child} name="Sentence Builder" emoji="✏️" subject="English" color="#16A34A" bg="#F0FDF4" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function ScienceSort({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 classifying living things, sorting scientific categories for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Science Sort questions."),[child]);
  return <ShooterEngine child={child} name="Science Sort" emoji="🔬" subject="Science" color="#16A34A" bg="#F0FDF4" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function StatesOfMatter({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 solid liquid gas properties, states of matter changes for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"States of Matter questions."),[child]);
  return <ShooterEngine child={child} name="States of Matter" emoji="💧" subject="Science" color="#0EA5E9" bg="#F0F9FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function PlanetPatrol({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 Earth and space science questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options. Return ONLY JSON: {"questions":[{"q":"Largest planet?","options":["Saturn","Jupiter","Mars","Earth"],"correct":"Jupiter"}]}`,"Planet patrol questions."),[child]);
  return <SpaceExplorer child={child} name="Planet Patrol" emoji="🪐" subject="Science" color="#7C3AED" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function AlgorithmSort({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 computational thinking, algorithm sequencing, order of steps for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Algorithm Sort questions."),[child]);
  return <ShooterEngine child={child} name="Algorithm Sort" emoji="🔢" subject="Computing" color="#7C3AED" bg="#F5F3FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function DebugDetective({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 debugging programs, finding errors in code, fixing sequences for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Debug Detective questions."),[child]);
  return <ShooterEngine child={child} name="Debug Detective" emoji="🔍" subject="Computing" color="#374151" bg="#F9FAFB" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function WordMatch({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 vocabulary matching, word definitions, synonyms and antonyms for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Word Match questions."),[child]);
  return <ShooterEngine child={child} name="Word Match" emoji="🌐" subject="English" color="#0EA5E9" bg="#F0F9FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function MathFishing({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const [qs,setQs]=useState([]);
  const [qIdx,setQIdx]=useState(0);
  const [lives,setLives]=useState(3);
  const [score,setScore]=useState(0);
  const [lvl,setLvl]=useState(level);
  const [streak,setStreak]=useState(0);
  const [done,setDone]=useState(false);
  const [loading,setLoading]=useState(true);
  const [loadErr,setLoadErr]=useState(false);
  const [caught,setCaught]=useState(null);
  const [fish,setFish]=useState([]);
  const fetching=useRef(false);
  const fishRef=useRef([]);
  const idRef=useRef(0);

  const fetchBatch=useCallback(async(l)=>{
    if(fetching.current)return;
    fetching.current=true;
    const t=setTimeout(()=>{setLoadErr(true);setLoading(false);},12000);
    const d=await claude(`Generate 8 maths equations for age ${child.age}, ${child.country||"UK"} curriculum, Level ${l}. Each has correct answer and 3 wrong close answers. Return ONLY JSON: {"questions":[{"eq":"3+4=","correct":7,"wrong":[5,6,8]}]}`,"Fishing questions.");
    clearTimeout(t);
    if(d?.questions?.length)setQs(prev=>[...prev,...d.questions]);
    else setLoadErr(true);
    setLoading(false);fetching.current=false;
  },[child]);

  useEffect(()=>{fetchBatch(level);},[]);
  useEffect(()=>{if(qs.length&&qIdx>=qs.length-2&&!fetching.current&&!done)fetchBatch(lvl);},[qIdx,qs.length,lvl,done]);

  const q=qs[qIdx]||null;

  useEffect(()=>{
    if(!q||done)return;
    const answers=[q.correct,...(q.wrong||[q.correct+1,q.correct-1,q.correct+2])].slice(0,4).sort(()=>Math.random()-0.5);
    const rows=[{y:32},{y:48},{y:60},{y:75}];
    const newFish=answers.map((ans,i)=>({id:++idRef.current,ans,correct:ans===q.correct,x:15+i*22,y:rows[i%4].y,baseY:rows[i%4].y,vx:(Math.random()-0.5)*0.08,vy:0,wobble:Math.random()*Math.PI*2}));
    fishRef.current=newFish;setFish([...newFish]);setCaught(null);
  },[qIdx,q]);

  useEffect(()=>{
    if(!q||done||caught!==null)return;
    let t=0;
    const loop=setInterval(()=>{
      t+=0.02; // very slow
      fishRef.current=fishRef.current.map(f=>({
        ...f,
        x:Math.max(4,Math.min(85,f.x+f.vx*0.15)), // almost stationary
        y:f.baseY+(Math.sin(t*0.5+f.wobble)*2),   // tiny gentle bob
        vx:f.x<=4?Math.abs(f.vx):f.x>=85?-Math.abs(f.vx):f.vx
      }));
      setFish([...fishRef.current]);
    },120);
    return()=>clearInterval(loop);
  },[q,done,caught,qIdx]);

  const [rodX,setRodX]=useState(50);
  const cast=(x)=>{
    if(caught!==null||!q)return;
    setRodX(x);
    setTimeout(()=>{
      const hit=fishRef.current.find(f=>Math.abs(f.x-x)<12);
      if(hit){
        setCaught(hit);
        if(hit.correct){
          setScore(s=>s+1);
          const ns=streak+1;setStreak(ns);
          if(ns>0&&ns%5===0)setLvl(l=>l+1);
        } else {
          setStreak(0);
          const nl=lives-1;setLives(nl);
          if(nl<=0){setDone(true);return;}
        }
        setTimeout(()=>{setCaught(null);setQIdx(i=>i+1);},1000);
      }
    },600);
  };

  if(loadErr)return <GameError name="Maths Fishing" onRetry={()=>{setLoadErr(false);setQs([]);fetchBatch(level);}}/>;
  if(loading&&!q)return <GameLoad name="Maths Fishing" emoji="🎣" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Maths Fishing" emoji="🎣" score={score} max={score+3-lives} child={child} xp={score*12} level={lvl} onRetry={()=>onRetry?onRetry():onQuit()} onDone={()=>onComplete({score,max:score+3-lives,xp:score*12,total:qIdx,correct:score,levelReached:lvl})}/>;

  return(
    <GameShell name="Maths Fishing" emoji="🎣" subject="Maths" score={score} maxScore={null} round={qIdx+1} total={null} streak={streak} onQuit={()=>onComplete({score,max:score+3-lives,xp:score*12,total:qIdx,correct:score})} lives={lives} level={lvl}>
      <div style={{textAlign:"center",marginBottom:8}}>
        <div style={{fontSize:26,fontWeight:900,color:C.primary,background:C.pLight,borderRadius:14,padding:"8px 20px",display:"inline-block"}}>{q?.eq}</div>
        <p style={{fontSize:11,color:C.muted,fontWeight:600,marginTop:4}}>Tap the water to cast near the correct fish!</p>
      </div>
      <div style={{position:"relative",height:200,borderRadius:20,overflow:"hidden",cursor:"pointer",userSelect:"none"}} onClick={e=>{const rect=e.currentTarget.getBoundingClientRect();cast(((e.clientX-rect.left)/rect.width)*100);}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:50,background:"linear-gradient(180deg,#BAE6FD,#7DD3FC)"}}/>
        <div style={{position:"absolute",top:0,left:`${rodX}%`,transform:"translateX(-50%)",zIndex:4}}>
          <div style={{width:3,background:"#92400E",height:50,margin:"0 auto",borderRadius:2}}/>
        </div>
        <div style={{position:"absolute",top:50,left:0,right:0,bottom:0,background:"linear-gradient(180deg,#0EA5E9,#0369A1)"}}/>
        <svg style={{position:"absolute",top:46,left:0,width:"100%",height:12}} viewBox="0 0 400 12" preserveAspectRatio="none">
          <path d="M0,6 Q25,0 50,6 Q75,12 100,6 Q125,0 150,6 Q175,12 200,6 Q225,0 250,6 Q275,12 300,6 Q325,0 350,6 Q375,12 400,6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
        </svg>
        {fish.map(f=>(
          <div key={f.id} style={{position:"absolute",left:`${f.x}%`,top:`${f.y}%`,transform:`translateX(-50%) ${caught?.id===f.id?"translateY(-20px) scale(1.2)":""}`,transition:caught?.id===f.id?"all 0.4s":"none",zIndex:3}}>
            <div style={{background:"rgba(255,255,255,0.9)",borderRadius:10,padding:"2px 7px",fontSize:11,fontWeight:900,color:C.text,textAlign:"center",marginBottom:2,border:`2px solid ${caught?.id===f.id?(caught.correct?C.green:C.red):"transparent"}`}}>{f.ans}</div>
            <div style={{textAlign:"center",fontSize:18,transform:`scaleX(${f.vx>0?1:-1})`}}>🐟</div>
          </div>
        ))}
        {caught&&<div style={{position:"absolute",inset:0,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.3)",borderRadius:20,zIndex:5,fontSize:48}}>{caught.correct?"🎣✅":"💨❌"}</div>}
      </div>
    </GameShell>
  );
}


function SpaceBlaster({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const game=useLivesGame(
    useCallback(async(lvl)=>claude(`Generate 10 maths questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Each has a question and exactly 4 answer options (one correct). Return ONLY JSON: {"questions":[{"q":"5×4=","options":["12","15","20","18"],"correct":"20"}]}`,"Space blaster questions."),[child]),
    level
  );
  const [shipX,setShipX]=useState(50);
  const [bullets,setBullets]=useState([]);
  const [aliens,setAliens]=useState([]);
  const [exps,setExps]=useState([]);
  const [flash,setFlash]=useState(null);
  const sr=useRef({shipX:50,bullets:[],aliens:[],exps:[]});
  const idr=useRef(0);

  useEffect(()=>{
    if(!game.q||game.done)return;
    const opts=game.q.options||[];
    sr.current.aliens=opts.map((opt,i)=>({id:++idr.current,opt,correct:opt===game.q.correct,x:8+i*(80/Math.max(opts.length-1,1)),y:15+Math.random()*20,vx:(Math.random()-0.5)*0.9,vy:0.015+game.lvl*0.006,alive:true}));
    setAliens([...sr.current.aliens]);setBullets([]);sr.current.bullets=[];
  },[game.qIdx,game.q]);

  useEffect(()=>{
    if(game.done||!game.q)return;
    const loop=setInterval(()=>{
      const s=sr.current;
      s.aliens=s.aliens.map(t=>({...t,y:t.alive?t.y+t.vy:t.y,x:Math.max(3,Math.min(90,t.x+t.vx)),vx:t.x<=3||t.x>=90?-t.vx:t.vx}));
      s.bullets=s.bullets.map(b=>({...b,y:b.y-5})).filter(b=>b.y>0);
      s.exps=s.exps.map(e=>({...e,t:e.t+1})).filter(e=>e.t<8);
      let hit=null;
      s.bullets=s.bullets.filter(b=>{const t=s.aliens.find(t=>t.alive&&Math.abs(t.x-b.x)<10&&Math.abs(t.y-b.y)<12);if(t){hit=t;s.exps=[...s.exps,{id:Date.now(),x:t.x,y:t.y,t:0}];}return!t;});
      if(hit){s.aliens=s.aliens.map(t=>t.id===hit.id?{...t,alive:false}:t);game.answer(hit.correct);setFlash(hit.correct?"✅":"❌");setTimeout(()=>setFlash(null),500);}
      const missed=s.aliens.find(t=>t.alive&&t.correct&&t.y>90);
      if(missed){s.aliens=s.aliens.map(t=>t.id===missed.id?{...t,alive:false}:t);game.answer(false);}
      setAliens([...s.aliens]);setBullets([...s.bullets]);setExps([...s.exps]);
    },100);
    return()=>clearInterval(loop);
  },[game.done,game.qIdx,game.q]);

  const moveShip=dir=>{sr.current.shipX=Math.max(5,Math.min(92,sr.current.shipX+dir*10));setShipX(sr.current.shipX);};
  const fire=()=>{const b={id:++idr.current,x:sr.current.shipX,y:80};sr.current.bullets=[...sr.current.bullets,b];setBullets(p=>[...p,b]);};

  if(game.loadErr)return <GameError name="Space Blaster" onRetry={()=>onQuit()}/>;
  if(game.loading&&!game.q)return <GameLoad name="Space Blaster" emoji="🚀" tutor={child.tutor}/>;
  if(game.done)return <GameEnd name="Space Blaster" emoji="🚀" score={game.score} max={game.score+3-game.lives} child={child} xp={game.score*12} level={game.lvl} onRetry={()=>onRetry?onRetry():onQuit()} onDone={()=>onComplete({score:game.score,max:game.score+3-game.lives,xp:game.score*12,total:game.qIdx,correct:game.score,levelReached:game.lvl})}/>;

  return(
    <GameShell name="Space Blaster" emoji="🚀" subject="Maths" score={game.score} maxScore={null} round={game.qIdx+1} total={null} streak={game.streak} onQuit={()=>game.setDone(true)} lives={game.lives} level={game.lvl}>
      <div style={{textAlign:"center",marginBottom:6}}><span style={{fontSize:18,fontWeight:900,color:"#FCD34D",background:"#1E1B4B",padding:"6px 18px",borderRadius:12}}>{game.q?.q}</span></div>
      <div style={{position:"relative",height:195,background:"linear-gradient(180deg,#0F0F1A,#1E1B4B,#312E81)",borderRadius:16,overflow:"hidden",marginBottom:8}}>
        {[...Array(15)].map((_,i)=><div key={i} style={{position:"absolute",width:1.5,height:1.5,background:"#fff",borderRadius:"50%",top:`${(i*17)%95}%`,left:`${(i*13)%100}%`,opacity:0.4}}/>)}
        {aliens.filter(t=>t.alive).map(t=>(
          <div key={t.id} style={{position:"absolute",left:`${t.x}%`,top:`${t.y}%`,transform:"translateX(-50%)",zIndex:2,textAlign:"center"}}>
            <div style={{fontSize:18}}>{t.correct?"👾":"💀"}</div>
            <div style={{background:"rgba(255,255,255,0.93)",borderRadius:6,padding:"1px 6px",fontSize:10,fontWeight:900,color:C.text,marginTop:1,whiteSpace:"nowrap"}}>{t.opt}</div>
          </div>
        ))}
        {bullets.map(b=><div key={b.id} style={{position:"absolute",left:`${b.x}%`,top:`${b.y}%`,width:3,height:10,background:"#FCD34D",borderRadius:2,transform:"translateX(-50%)",zIndex:2}}/>)}
        {exps.map(e=><div key={e.id} style={{position:"absolute",left:`${e.x}%`,top:`${e.y}%`,transform:"translateX(-50%)",fontSize:16,opacity:1-e.t/8,zIndex:3}}>💥</div>)}
        {flash&&<div style={{position:"absolute",inset:0,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.4)",fontSize:40,zIndex:5}}>{flash}</div>}
        <div style={{position:"absolute",bottom:"4%",left:`${shipX}%`,transform:"translateX(-50%)",fontSize:24,zIndex:3,transition:"left 0.1s"}}>🚀</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
        {(game.q?.options||[]).map((opt,i)=>(
          <button key={i} onClick={()=>{
            const target=sr.current.aliens.find(t=>t.alive&&t.opt===opt);
            if(target){
              sr.current.shipX=target.x;setShipX(target.x);
              const b={id:++idr.current,x:target.x,y:80};
              sr.current.bullets=[...sr.current.bullets,b];
              setBullets(p=>[...p,b]);
            }
          }}
          style={{padding:"14px 10px",borderRadius:14,fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:F,
            background:[`linear-gradient(135deg,#E53E3E,#FC8181)`,`linear-gradient(135deg,#3182CE,#63B3ED)`,`linear-gradient(135deg,#D69E2E,#F6E05E)`,`linear-gradient(135deg,#38A169,#68D391)`][i%4],
            color:"#fff",border:"none",
            transition:"all 0.15s",boxShadow:["0 4px 12px rgba(229,62,62,0.4)","0 4px 12px rgba(49,130,206,0.4)","0 4px 12px rgba(214,158,46,0.4)","0 4px 12px rgba(56,161,105,0.4)"][i%4]}}>
            {opt}
          </button>
        ))}
      </div>
    </GameShell>
  );
}


function GemHunter({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 vocabulary, spelling at curriculum Level for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Gem Hunter questions."),[child]);
  return <CatcherEngine child={child} name="Gem Hunter" emoji="💎" subject="English" color="#4F46E5" bg="#EEF2FF" catcherChar="💎" sceneBg="linear-gradient(180deg,#78350F,#92400E)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function WordRunner({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const game=useLivesGame(
    useCallback(async(lvl)=>claude(`Generate 10 grammar questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Instructions like "Catch the VERB!" — 4 word options, 1 correct. Return ONLY JSON: {"questions":[{"instruction":"Catch the VERB!","options":["run","happy","quickly","big"],"correct":"run"}]}`,"Word runner questions."),[child]),
    level
  );
  const [falling,setFalling]=useState([]);
  const [caught,setCaught]=useState(null);
  const sr=useRef([]);const idr=useRef(0);

  useEffect(()=>{
    if(!game.q||game.done||caught!==null)return;
    const shuffled=[...(game.q.options||[])].sort(()=>Math.random()-0.5);
    // Position words at fixed readable heights
    const positions=[{x:8,y:22},{x:52,y:22},{x:8,y:52},{x:52,y:52},{x:30,y:37}];
    sr.current=shuffled.map((w,i)=>({
      id:++idr.current,word:w,correct:w===game.q.correct,
      x:positions[i%5].x,y:positions[i%5].y,baseY:positions[i%5].y
    }));
    setFalling([...sr.current]);
  },[game.qIdx,game.q]);

  // Words gently float — no falling, no time pressure
  useEffect(()=>{
    if(game.done||caught!==null||!game.q)return;
    let t=0;
    const loop=setInterval(()=>{
      t+=0.04;
      // Gentle float animation, words stay in readable positions
      setFalling(prev=>prev.map((w,i)=>({...w,y:w.baseY+(Math.sin(t+i*0.8)*3)})));
    },80);
    return()=>clearInterval(loop);
  },[game.done,caught,game.qIdx,game.q]);

  const catchWord=(w)=>{
    if(caught)return;
    setCaught(w);
    game.answer(w.correct);
    setTimeout(()=>setCaught(null),700);
  };

  if(game.loadErr)return <GameError name="Word Runner" onRetry={()=>onQuit()}/>;
  if(game.loading&&!game.q)return <GameLoad name="Word Runner" emoji="🏃" tutor={child.tutor}/>;
  if(game.done)return <GameEnd name="Word Runner" emoji="🏃" score={game.score} max={game.score+3-game.lives} child={child} xp={game.score*12} level={game.lvl} onRetry={()=>onRetry?onRetry():onQuit()} onDone={()=>onComplete({score:game.score,max:game.score+3-game.lives,xp:game.score*12,total:game.qIdx,correct:game.score,levelReached:game.lvl})}/>;

  const colors=["#6366F1","#EC4899","#F59E0B","#10B981"];
  return(
    <GameShell name="Word Runner" emoji="🏃" subject="English" score={game.score} maxScore={null} round={game.qIdx+1} total={null} streak={game.streak} onQuit={()=>game.setDone(true)} lives={game.lives} level={game.lvl}>
      <div style={{textAlign:"center",marginBottom:8}}>
        <div style={{background:"linear-gradient(135deg,#4F46E5,#7C3AED)",borderRadius:20,padding:"7px 18px",display:"inline-block"}}>
          <p style={{fontSize:17,fontWeight:900,color:"#fff"}}>{game.q?.instruction}</p>
        </div>
      </div>
      <div style={{position:"relative",height:210,background:"linear-gradient(180deg,#EEF2FF,#C7D2FE)",borderRadius:20,overflow:"hidden",marginBottom:8}}>
        {[25,50,75].map(x=><div key={x} style={{position:"absolute",left:`${x}%`,top:0,bottom:0,width:1,background:"rgba(99,102,241,0.1)"}}/>)}
        {!caught&&falling.map((w,i)=>(
          <button key={w.id} onClick={()=>!caught&&catchWord(w)}
            style={{position:"absolute",left:`${w.x}%`,top:`${w.y}%`,transform:"translateX(-50%)",padding:"7px 12px",borderRadius:12,fontSize:14,fontWeight:900,cursor:"pointer",background:w.correct?"#FEF3C7":"white",border:`2px solid ${colors[i%4]}`,color:colors[i%4],boxShadow:`0 3px 10px ${colors[i%4]}44`,fontFamily:F,whiteSpace:"nowrap",zIndex:2}}>
            {w.word}
          </button>
        ))}
        {caught&&<div style={{position:"absolute",inset:0,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.7)",zIndex:5,fontSize:52}}>{caught.missed?"💨":caught.correct?"🎉":"❌"}</div>}
        <div style={{position:"absolute",bottom:5,left:"50%",transform:"translateX(-50%)",fontSize:26}}>🏃</div>
      </div>
      <p style={{textAlign:"center",fontSize:12,color:C.muted,fontWeight:600}}>Tap the correct falling word before it hits the ground!</p>
    </GameShell>
  );
}


function VolcanoEscape({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 science questions with volcano escape theme for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Volcano Escape questions."),[child]);
  return <RunnerEngine child={child} name="Volcano Escape" emoji="🌋" subject="Science" color="#EF4444" bg="#FEF2F2" runnerChar="🧗" sceneBg="linear-gradient(180deg,#FEF2F2,#FCA5A5 50%,#7F1D1D)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function TreasureMap({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 history and geography treasure hunt questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Treasure Hunt questions."),[child]);
  return <RunnerEngine child={child} name="Treasure Hunt" emoji="🗺️" subject="History" color="#D97706" bg="#FFFBEB" runnerChar="🏴‍☠️" sceneBg="linear-gradient(180deg,#FFFBEB,#FDE68A 50%,#0369A1)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function GrandPrix({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const game=useLivesGame(
    useCallback(async(lvl)=>claude(`Generate 10 measurement questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options. Return ONLY JSON: {"questions":[{"q":"cm in 1m?","options":["A) 10","B) 100","C) 1000","D) 50"],"correct":"B"}]}`,"Grand prix questions."),[child]),
    level
  );
  const [pos,setPos]=useState(8);
  const [boost,setBoost]=useState(false);
  const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);

  const answer=(opt)=>{
    if(ans)return;setSel(opt);setAns(true);
    const ok=opt.charAt(0)===game.q?.correct;
    if(ok){setPos(p=>Math.max(1,p-1));setBoost(true);setTimeout(()=>setBoost(false),600);}
    else setPos(p=>Math.min(8,p+1));
    game.answer(ok);
    setTimeout(()=>{setSel(null);setAns(false);},900);
  };

  if(game.loadErr)return <GameError name="Grand Prix Racing" onRetry={()=>onQuit()}/>;
  if(game.loading&&!game.q)return <GameLoad name="Grand Prix Racing" emoji="🏎️" tutor={child.tutor}/>;
  if(game.done)return <GameEnd name="Grand Prix Racing" emoji="🏎️" score={game.score} max={game.score+3-game.lives} child={child} xp={game.score*12} level={game.lvl} onRetry={()=>onRetry?onRetry():onQuit()} onDone={()=>onComplete({score:game.score,max:game.score+3-game.lives,xp:game.score*12,total:game.qIdx,correct:game.score,levelReached:game.lvl})}/>;

  return(
    <GameShell name="Grand Prix Racing" emoji="🏎️" subject="Maths" score={game.score} maxScore={null} round={game.qIdx+1} total={null} streak={game.streak} onQuit={()=>game.setDone(true)} lives={game.lives} level={game.lvl}>
      <div style={{background:"linear-gradient(180deg,#1F2937,#111827)",borderRadius:20,padding:"10px 12px",marginBottom:12,position:"relative",overflow:"hidden",height:140}}>
        <div style={{position:"absolute",top:"30%",left:0,right:0,height:"45%",background:"#374151"}}/>
        {[...Array(8)].map((_,i)=><div key={i} style={{position:"absolute",top:"52%",left:`${(i*14+((game.qIdx*8)%14))}%`,width:"8%",height:3,background:"#FCD34D",borderRadius:2,opacity:0.7}}/>)}
        <div style={{position:"absolute",top:0,left:0,right:0,height:"30%",background:"#14532D"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"22%",background:"#14532D"}}/>
        <div style={{position:"absolute",top:8,right:12,background:"rgba(0,0,0,0.7)",borderRadius:8,padding:"4px 10px",zIndex:4}}>
          <p style={{fontSize:10,fontWeight:800,color:"#9CA3AF"}}>POSITION</p>
          <p style={{fontSize:20,fontWeight:900,color:pos===1?"#FCD34D":"#fff"}}>P{pos}</p>
        </div>
        <div style={{position:"absolute",left:"45%",top:"36%",fontSize:26,zIndex:3}}>
          {boost&&<div style={{position:"absolute",right:"100%",top:"20%",fontSize:12,opacity:0.8}}>💨💨</div>}
          🏎️
        </div>
      </div>
      <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{game.q?.q}</p>
      <Options options={game.q?.options} correct={game.q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
    </GameShell>
  );
}


function CandyShop({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 money/financial maths questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Prices, change, totals. Short option answers. Return ONLY JSON: {"questions":[{"q":"3 sweets at 20p each?","options":["50p","60p","70p","80p"],"correct":"60p"}]}`,"Candy shop questions."),[child]);
  return <CatcherEngine child={child} name="Candy Shop" emoji="🍭" subject="Maths" color="#EC4899" bg="#FDF2F8" fetchFn={fetchFn} catcherChar="🛍️" sceneBg="linear-gradient(180deg,#FDF2F8,#FCE7F3)" initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function BasketballMaths({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 statistics, data, averages, charts for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Basketball Maths questions."),[child]);
  return <CatcherEngine child={child} name="Basketball Maths" emoji="🏀" subject="Maths" color="#EA580C" bg="#FFF7ED" catcherChar="🏀" sceneBg="linear-gradient(180deg,#1E3A5F,#1E40AF)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function TrainGame({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 number sequences, place value, patterns for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Number Train questions."),[child]);
  return <SpaceExplorer child={child} name="Number Train" emoji="🚂" subject="Maths" color="#374151" bg="#F9FAFB" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function SupermarketMath({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 money, prices, change, financial maths for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Supermarket Sweep questions."),[child]);
  return <CatcherEngine child={child} name="Supermarket Sweep" emoji="🛒" subject="Maths" color="#16A34A" bg="#F0FDF4" catcherChar="🛒" sceneBg="linear-gradient(180deg,#F0FDF4,#DCFCE7)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function RocketMaths({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>({questions:genMathQs("algebra",lvl,15)}),[]); // local: instant, no AI cost
  return <SpaceExplorer child={child} name="Rocket Launch" emoji="🛸" subject="Maths" color="#7C3AED" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function SpellBingo({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 spelling at curriculum Level for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Spelling Bingo questions."),[child]);
  return <CatcherEngine child={child} name="Spelling Bingo" emoji="🎱" subject="English" color="#EC4899" bg="#FDF2F8" catcherChar="🎰" sceneBg="linear-gradient(180deg,#FDF2F8,#FCE7F3)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function WordShake({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 vocabulary, word building for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"WordShake questions."),[child]);
  return <SpaceExplorer child={child} name="WordShake" emoji="🎲" subject="English" color="#4F46E5" bg="#EEF2FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function SpotDifference({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 reading comprehension for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Spot the Difference questions."),[child]);
  return <SpaceExplorer child={child} name="Spot the Difference" emoji="🔍" subject="English" color="#DC2626" bg="#FEF2F2" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function PuzzleWords({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 vocabulary, crossword clues for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Word Puzzle questions."),[child]);
  return <SpaceExplorer child={child} name="Word Puzzle" emoji="🧩" subject="English" color="#374151" bg="#F9FAFB" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function SchoolRun({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 English grammar/writing questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options. Return ONLY JSON: {"questions":[{"q":"Best word: She ___ to school.","options":["runned","ran","ranned","runned"],"correct":"ran"}]}`,"School run questions."),[child]);
  return <RunnerEngine child={child} name="School Run" emoji="🏃" subject="English" color="#0EA5E9" fetchFn={fetchFn} runnerChar="🏃" sceneBg="linear-gradient(180deg,#BAE6FD,#7DD3FC 50%,#4ADE80 50%)" initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function MemoryWords({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 vocabulary/reading questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options. Return ONLY JSON: {"questions":[{"q":"What does 'habitat' mean?","options":["A) Food","B) Home of animal","C) Weather","D) Plant"],"correct":"B"}]}`,"Memory words questions."),[child]);
  return <SpaceExplorer child={child} name="Memory Match" emoji="🧠" subject="English" color="#0EA5E9" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}


function DinosaurGame({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 dinosaurs, fossils, evolution, prehistoric life for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Dino Dig questions."),[child]);
  return <CatcherEngine child={child} name="Dino Dig" emoji="🦕" subject="Science" color="#D97706" bg="#FFFBEB" catcherChar="⛏️" sceneBg="linear-gradient(180deg,#FFFBEB,#FEF3C7)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function JungleExplorer({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 jungle living things, habitats, food chains for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Jungle Explorer questions."),[child]);
  return <CatcherEngine child={child} name="Jungle Explorer" emoji="🌴" subject="Science" color="#16A34A" bg="#F0FDF4" catcherChar="🔭" sceneBg="linear-gradient(180deg,#F0FDF4,#DCFCE7)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function OceanGame({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 ocean creatures, marine habitats, food chains for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Ocean Adventure questions."),[child]);
  return <CatcherEngine child={child} name="Ocean Adventure" emoji="🌊" subject="Science" color="#0369A1" bg="#F0F9FF" catcherChar="🤿" sceneBg="linear-gradient(180deg,#BAE6FD,#0EA5E9 60%,#0369A1)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function BubbleBuster({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 materials science questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Properties, states, changes. Short options. Return ONLY JSON: {"questions":[{"q":"Which is waterproof?","options":["Paper","Rubber","Wood","Cotton"],"correct":"Rubber"}]}`,"Bubble buster questions."),[child]);
  return <ShooterEngine child={child} name="Bubble Buster" emoji="🫧" subject="Science" color="#0EA5E9" bg="#F0F9FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function ColourScience({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 light and colour science questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short option answers. Return ONLY JSON: {"questions":[{"q":"Red + Blue light =","options":["Green","Purple","Orange","Yellow"],"correct":"Purple"}]}`,"Colour science questions."),[child]);
  return <CatcherEngine child={child} name="Colour Lab" emoji="🎨" subject="Science" color="#7C3AED" bg="#F5F3FF" fetchFn={fetchFn} catcherChar="🎨" sceneBg="linear-gradient(180deg,#FDF4FF,#FAE8FF)" initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function AstronautGame({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 Earth and space science questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options. Return ONLY JSON: {"questions":[{"q":"Earth orbits sun in?","options":["24hrs","28 days","365 days","100 yrs"],"correct":"365 days"}]}`,"Astronaut training questions."),[child]);
  return <SpaceExplorer child={child} name="Astronaut Training" emoji="👨‍🚀" subject="Science" color="#1E40AF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function PyramidsGame({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 ancient civilisations Egypt Greece Rome for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Pyramid Builder questions."),[child]);
  return <RunnerEngine child={child} name="Pyramid Builder" emoji="🏛️" subject="History" color="#D97706" bg="#FFFBEB" runnerChar="🏃" sceneBg="linear-gradient(180deg,#FEF3C7,#FDE68A 50%,#D97706)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function InspectorGame({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 historical sources, chronology, cause and effect for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"History Inspector questions."),[child]);
  return <RunnerEngine child={child} name="History Inspector" emoji="🕵️" subject="History" color="#374151" bg="#F9FAFB" runnerChar="🕵️" sceneBg="linear-gradient(180deg,#F9FAFB,#E5E7EB 50%,#9CA3AF)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function HideSeekHistory({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 significant historical figures from national history for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"History Hide & Seek questions."),[child]);
  return <SpaceExplorer child={child} name="History Hide & Seek" emoji="🫣" subject="History" color="#4F46E5" bg="#EEF2FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function TenableGame({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 world history facts and categories for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Tenable Challenge questions."),[child]);
  return <SpaceExplorer child={child} name="Tenable Challenge" emoji="📋" subject="History" color="#1E40AF" bg="#EFF6FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function FootballHistory({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const country=child.country||"UK";
  const game=useLivesGame(
    useCallback(async(lvl)=>claude(`Generate 10 ${country==="US"?"American":country==="CA"?"Canadian":"British"} history questions for age ${child.age}, ${country} curriculum, Level ${lvl}. Short options. Return ONLY JSON: {"questions":[{"q":"WW2 ended in?","options":["A) 1943","B) 1944","C) 1945","D) 1946"],"correct":"C"}]}`,"Penalty shootout questions."),[child]),
    level
  );
  const [ballPos,setBallPos]=useState({x:50,y:80});
  const [shotResult,setShotResult]=useState(null);
  const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);

  const answer=(opt)=>{
    if(ans)return;setSel(opt);setAns(true);
    const ok=opt.charAt(0)===game.q?.correct;
    const corners=[[15,15],[50,12],[85,15],[20,32],[80,32]];
    const target=ok?corners[Math.floor(Math.random()*corners.length)]:[50,55];
    setBallPos({x:target[0],y:target[1]});
    setShotResult(ok?"⚽ GOAL!":"🧤 SAVED!");
    game.answer(ok);
    setTimeout(()=>{setBallPos({x:50,y:80});setShotResult(null);setSel(null);setAns(false);},1300);
  };

  if(game.loadErr)return <GameError name="Penalty Shootout" onRetry={()=>onQuit()}/>;
  if(game.loading&&!game.q)return <GameLoad name="Penalty Shootout" emoji="⚽" tutor={child.tutor}/>;
  if(game.done)return <GameEnd name="Penalty Shootout" emoji="⚽" score={game.score} max={game.score+3-game.lives} child={child} xp={game.score*12} level={game.lvl} onRetry={()=>onRetry?onRetry():onQuit()} onDone={()=>onComplete({score:game.score,max:game.score+3-game.lives,xp:game.score*12,total:game.qIdx,correct:game.score,levelReached:game.lvl})}/>;

  return(
    <GameShell name="Penalty Shootout" emoji="⚽" subject="History" score={game.score} maxScore={null} round={game.qIdx+1} total={null} streak={game.streak} onQuit={()=>game.setDone(true)} lives={game.lives} level={game.lvl}>
      <div style={{background:"#14532D",borderRadius:20,padding:"12px",marginBottom:12,position:"relative",height:140,overflow:"hidden"}}>
        {[...Array(6)].map((_,i)=><div key={i} style={{position:"absolute",top:0,bottom:0,left:`${i*17}%`,width:"17%",background:i%2===0?"rgba(255,255,255,0.03)":"transparent"}}/>)}
        <svg style={{position:"absolute",top:"5%",left:"15%",width:"70%",height:"45%"}} viewBox="0 0 200 80">
          <rect x="0" y="0" width="200" height="80" fill="rgba(0,0,0,0.4)" stroke="white" strokeWidth="3" rx="2"/>
          {[...Array(8)].map((_,i)=><line key={"v"+i} x1={i*28} y1="0" x2={i*28} y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>)}
          {[...Array(4)].map((_,i)=><line key={"h"+i} x1="0" y1={i*26} x2="200" y2={i*26} stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>)}
        </svg>
        <div style={{position:"absolute",bottom:"18%",left:"50%",transform:"translateX(-50%)",width:5,height:5,borderRadius:"50%",background:"white"}}/>
        <div style={{position:"absolute",left:`${ballPos.x}%`,top:`${ballPos.y}%`,transform:"translateX(-50%)",fontSize:20,zIndex:3,transition:"all 0.9s cubic-bezier(0.25,0.46,0.45,0.94)"}}>⚽</div>
        <div style={{position:"absolute",top:"8%",left:"50%",transform:"translateX(-50%)",fontSize:22,zIndex:2}}>🧤</div>
        {shotResult&&<div style={{position:"absolute",inset:0,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)",borderRadius:20,zIndex:5,fontSize:22,fontWeight:900,color:shotResult.includes("GOAL")?"#FCD34D":"#EF4444"}}>{shotResult}</div>}
      </div>
      <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{game.q?.q}</p>
      <Options options={game.q?.options} correct={game.q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
    </GameShell>
  );
}


function WorldMapGame({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 world geography, countries, capitals, continents for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"World Map Quest questions."),[child]);
  return <RunnerEngine child={child} name="World Map Quest" emoji="🌍" subject="Geography" color="#0369A1" bg="#F0F9FF" runnerChar="🌍" sceneBg="linear-gradient(180deg,#F0F9FF,#BAE6FD 50%,#0EA5E9)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function GeographyGuesser({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 identifying places from clues for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Geography Guesser questions."),[child]);
  return <RunnerEngine child={child} name="Geography Guesser" emoji="📍" subject="Geography" color="#16A34A" bg="#F0FDF4" runnerChar="🗺️" sceneBg="linear-gradient(180deg,#F0FDF4,#DCFCE7 50%,#16A34A)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function SkiingGeo({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 physical geography questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options. Return ONLY JSON: {"questions":[{"q":"Rock worn by rivers?","options":["Deposition","Erosion","Flooding","Sinking"],"correct":"Erosion"}]}`,"Ski slope questions."),[child]);
  return <RunnerEngine child={child} name="Ski Slope Race" emoji="⛷️" subject="Geography" color="#3B82F6" fetchFn={fetchFn} runnerChar="⛷️" sceneBg="linear-gradient(180deg,#EFF6FF,#DBEAFE 50%,#fff 50%)" initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function SkateboardGeo({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 human geography questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options. Return ONLY JSON: {"questions":[{"q":"People move city to country?","options":["Urbanisation","Ruralisation","Migration","Emigration"],"correct":"Ruralisation"}]}`,"Skatepark questions."),[child]);
  return <RunnerEngine child={child} name="Skatepark City" emoji="🛹" subject="Geography" color="#6366F1" fetchFn={fetchFn} runnerChar="🛹" sceneBg="linear-gradient(180deg,#1F2937,#374151 50%,#4B5563 50%)" initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function PirateGeo({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 map skills, compass, navigation for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Pirate Voyage questions."),[child]);
  return <RunnerEngine child={child} name="Pirate Voyage" emoji="🏴‍☠️" subject="Geography" color="#1E40AF" bg="#EFF6FF" runnerChar="⛵" sceneBg="linear-gradient(180deg,#BAE6FD,#0EA5E9 50%,#0369A1)" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function BusGame({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 environmental geography questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options. Return ONLY JSON: {"questions":[{"q":"Energy from the sun?","options":["Wind","Solar","Tidal","Nuclear"],"correct":"Solar"}]}`,"Eco bus questions."),[child]);
  return <RunnerEngine child={child} name="Eco Bus Driver" emoji="🚌" subject="Geography" color="#16A34A" fetchFn={fetchFn} runnerChar="🚌" sceneBg="linear-gradient(180deg,#F0FDF4,#DCFCE7 50%,#86EFAC 50%)" initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function CodeGame({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 binary, data, computing concepts for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Code Breaker questions."),[child]);
  return <SpaceExplorer child={child} name="Code Breaker" emoji="🔐" subject="Computing" color="#16A34A" bg="#F0FDF4" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function FlippingFood({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 algorithms, sequences, computational thinking for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Recipe Robot questions."),[child]);
  return <SpaceExplorer child={child} name="Recipe Robot" emoji="🍳" subject="Computing" color="#F59E0B" bg="#FFFBEB" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function MemoryComputer({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 computing terms, networks, hardware for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Computer Memory questions."),[child]);
  return <SpaceExplorer child={child} name="Computer Memory" emoji="💾" subject="Computing" color="#4F46E5" bg="#EEF2FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function ShapeShooter({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 geometry questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Shapes, angles, symmetry. Options as short labels. Return ONLY JSON: {"questions":[{"q":"Sides of a hexagon?","options":["4","5","6","7"],"correct":"6"}]}`,"Shape shooter questions."),[child]);
  return <ShooterEngine child={child} name="Shape Shooter" emoji="📐" subject="Maths" color="#7C3AED" bg="#F5F3FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function CoordinateQuest({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 coordinates, position, translation for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Coordinate Quest questions."),[child]);
  return <SpaceExplorer child={child} name="Coordinate Quest" emoji="🧭" subject="Maths" color="#4F46E5" bg="#EEF2FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function RatioRecipe({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 ratio, proportion, scaling for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Ratio Kitchen questions."),[child]);
  return <SpaceExplorer child={child} name="Ratio Kitchen" emoji="⚖️" subject="Maths" color="#F59E0B" bg="#FFFBEB" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function PoetrySlam({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 poetry, rhyme, poetic devices for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Poetry Slam questions."),[child]);
  return <SpaceExplorer child={child} name="Poetry Slam" emoji="🎤" subject="English" color="#7C3AED" bg="#F5F3FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function MediaDetective({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 media literacy, fact vs opinion for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Media Detective questions."),[child]);
  return <SpaceExplorer child={child} name="Media Detective" emoji="📱" subject="English" color="#0EA5E9" bg="#F0F9FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function SeasonsGame({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 seasons and weather science questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short option answers. Return ONLY JSON: {"questions":[{"q":"Leaves fall in?","options":["Spring","Summer","Autumn","Winter"],"correct":"Autumn"}]}`,"Seasons game questions."),[child]);
  return <CatcherEngine child={child} name="Seasons Explorer" emoji="🌤️" subject="Science" color="#F59E0B" bg="#FFFBEB" fetchFn={fetchFn} catcherChar="☂️" sceneBg="linear-gradient(180deg,#FEF9C3,#FEF3C7)" initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function SoundWaves({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 sound, vibrations, pitch, volume for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Sound Waves questions."),[child]);
  return <SpaceExplorer child={child} name="Sound Waves" emoji="🎵" subject="Science" color="#1E40AF" bg="#EFF6FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function CircuitBuilder({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const game=useLivesGame(
    useCallback(async(lvl)=>claude(`Generate 10 electricity and circuits science questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options. Return ONLY JSON: {"questions":[{"q":"Which conducts electricity?","options":["A) Plastic","B) Wood","C) Copper","D) Rubber"],"correct":"C"}]}`,"Circuit builder questions."),[child]),
    level
  );
  const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);
  const [lit,setLit]=useState(false);const [sparks,setSparks]=useState([]);

  const answer=(opt)=>{
    if(ans)return;setSel(opt);setAns(true);
    const ok=opt.charAt(0)===game.q?.correct;
    if(ok){setLit(true);setSparks(Array.from({length:6},(_,i)=>({id:i,angle:i*60})));setTimeout(()=>{setLit(false);setSparks([]);},800);}
    game.answer(ok);
    setTimeout(()=>{setSel(null);setAns(false);},1000);
  };

  if(game.loadErr)return <GameError name="Circuit Builder" onRetry={()=>onQuit()}/>;
  if(game.loading&&!game.q)return <GameLoad name="Circuit Builder" emoji="⚡" tutor={child.tutor}/>;
  if(game.done)return <GameEnd name="Circuit Builder" emoji="⚡" score={game.score} max={game.score+3-game.lives} child={child} xp={game.score*12} level={game.lvl} onRetry={()=>onRetry?onRetry():onQuit()} onDone={()=>onComplete({score:game.score,max:game.score+3-game.lives,xp:game.score*12,total:game.qIdx,correct:game.score,levelReached:game.lvl})}/>;

  return(
    <GameShell name="Circuit Builder" emoji="⚡" subject="Science" score={game.score} maxScore={null} round={game.qIdx+1} total={null} streak={game.streak} onQuit={()=>game.setDone(true)} lives={game.lives} level={game.lvl}>
      <div style={{background:"#111827",borderRadius:20,padding:"14px 12px",marginBottom:12,position:"relative"}}>
        <svg viewBox="0 0 300 120" style={{width:"100%",height:100}}>
          <polyline points="40,60 40,20 260,20 260,60" fill="none" stroke={lit?"#FCD34D":"#374151"} strokeWidth="3" strokeLinejoin="round"/>
          <polyline points="40,60 40,100 260,100 260,60" fill="none" stroke={lit?"#FCD34D":"#374151"} strokeWidth="3" strokeLinejoin="round"/>
          <rect x="20" y="45" width="40" height="30" rx="6" fill="#1F2937" stroke="#4B5563" strokeWidth="1.5"/>
          <text x="40" y="65" fontSize="14" textAnchor="middle" fill="#FCD34D">🔋</text>
          <ellipse cx="150" cy="60" rx="18" ry="18" fill={lit?"#FEF9C3":"#1F2937"} stroke={lit?"#FCD34D":"#4B5563"} strokeWidth="2"/>
          <text x="150" y="67" fontSize="16" textAnchor="middle">{lit?"💡":"○"}</text>
          {lit&&<ellipse cx="150" cy="60" rx="28" ry="28" fill="rgba(252,211,77,0.25)" stroke="none"/>}
          {sparks.map(s=><circle key={s.id} cx={150+Math.cos(s.angle*Math.PI/180)*30} cy={60+Math.sin(s.angle*Math.PI/180)*30} r="3" fill="#FCD34D" opacity="0.9"/>)}
          <rect x="230" y="45" width="50" height="30" rx="6" fill="#1F2937" stroke="#4B5563" strokeWidth="1.5"/>
          <text x="255" y="65" fontSize="12" textAnchor="middle" fill={lit?"#22C55E":"#9CA3AF"}>{lit?"ON":"OFF"}</text>
        </svg>
      </div>
      <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{game.q?.q}</p>
      <Options options={game.q?.options} correct={game.q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
    </GameShell>
  );
}


function ChemistryLab({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 materials, reversible and irreversible changes for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Chemistry Lab questions."),[child]);
  return <SpaceExplorer child={child} name="Chemistry Lab" emoji="🧫" subject="Science" color="#7C3AED" bg="#F5F3FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function TimeMachine({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const country=child.country||"UK";
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 history questions about significant past events for age ${child.age}, ${country} curriculum, Level ${lvl}. Short options. Return ONLY JSON: {"questions":[{"q":"Great Fire of London?","options":["1466","1566","1666","1766"],"correct":"1666"}]}`,"Time machine questions."),[child]);
  return <SpaceExplorer child={child} name="Time Machine" emoji="⏰" subject="History" color="#4F46E5" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function LocalHero({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 local and community history for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Local Hero Quest questions."),[child]);
  return <SpaceExplorer child={child} name="Local Hero Quest" emoji="🏘️" subject="History" color="#16A34A" bg="#F0FDF4" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function SafetyShield({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 e-safety questions for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Online safety, privacy, cyberbullying. Short options. Return ONLY JSON: {"questions":[{"q":"Keep private online?","options":["Address","Name","Opinion","Hobby"],"correct":"Address"}]}`,"Safety shield questions."),[child]);
  return <ShooterEngine child={child} name="Safety Shield" emoji="🛡️" subject="Computing" color="#1E40AF" bg="#EFF6FF" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function CreativeStudio({child,mode,onComplete,onQuit,onRetry,level=1}) {
  const fetchFn=useCallback(async(lvl)=>claude(`Generate 10 creative computing, digital content for ${child.yearGroup||"Year 3"} in ${child.country||"UK"} curriculum, Level ${lvl}/10. Short options max 20 chars each. Return ONLY JSON: {"questions":[{"q":"Question?","options":["A","B","C","D"],"correct":"B"}]}`,"Creative Studio questions."),[child]);
  return <SpaceExplorer child={child} name="Creative Studio" emoji="🎨" subject="Computing" color="#EC4899" bg="#FDF2F8" fetchFn={fetchFn} initialLevel={level} onComplete={onComplete} onQuit={onQuit} onRetry={onRetry}/>;
}

function GameHub({child,onPlay,onBack,onHome,onLevelUp}) {
  const [selectedCat,setSelectedCat]=useState(null);
  const [hoveredGame,setHoveredGame]=useState(null);
  const country=child.country||"UK";
  const availableGames=getGamesForChild(child);

  const categories=[
    {id:"maths",   label:"Maths",            emoji:"🔢", color:"#4F46E5", bg:"#EEF2FF", subjects:["Maths","Math","Mathematics"]},
    {id:"english", label:"English",           emoji:"📖", color:"#0EA5E9", bg:"#F0F9FF", subjects:["English","English Language Arts","Language"]},
    {id:"science", label:"Science",           emoji:"🔬", color:"#16A34A", bg:"#F0FDF4", subjects:["Science","Science & Technology"]},
    {id:"history", label:"History & Geo",     emoji:"🌍", color:"#D97706", bg:"#FFFBEB", subjects:["History","Geography","Social Studies"]},
    {id:"computing",label:"Computing",        emoji:"💻", color:"#7C3AED", bg:"#F5F3FF", subjects:["Computing","Computer Studies"]},
  ];

  const catGames=selectedCat?availableGames.filter(g=>g.subjects.some(s=>selectedCat.subjects.includes(s))):[];

  return (
    <Screen>
      <div style={{paddingTop:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <BackBtn onClick={selectedCat?()=>setSelectedCat(null):(onHome||onBack)}/>
          {selectedCat?(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:22}}>{selectedCat.emoji}</span>
              <div>
                <h2 style={{fontSize:22,fontWeight:900,color:C.text}}>{selectedCat.label}</h2>
                <p style={{fontSize:12,fontWeight:700,color:C.muted}}>{catGames.length} games available</p>
              </div>
            </div>
          ):(
            <div>
              <h2 style={{fontSize:22,fontWeight:900,color:C.text}}>🎮 Mini Games</h2>
              <p style={{fontSize:12,fontWeight:700,color:C.muted}}>{availableGames.length} games · choose a subject</p>
            </div>
          )}
        </div>

        {!selectedCat?(
          /* ── Category grid ── */
          <div>
            {/* ── Jump back in — one tap to the last games played ── */}
            {(child.recentGames||[]).length>0&&(
              <div style={{marginBottom:14}}>
                <p style={{fontSize:11,fontWeight:900,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8}}>⚡ Jump back in</p>
                <div style={{display:"flex",gap:8}}>
                  {(child.recentGames||[]).map(id=>{
                    const g=GAMES.find(x=>x.id===id);
                    if(!g)return null;
                    return(
                      <button key={id} onClick={()=>onPlay(id)}
                        style={{flex:1,padding:"11px 8px",borderRadius:16,border:`1.5px solid ${C.border}`,
                        background:"linear-gradient(160deg,#fff,#F5F3FF)",cursor:"pointer",fontFamily:F,
                        display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                        boxShadow:"0 3px 12px rgba(79,70,229,0.1)"}}>
                        <span style={{fontSize:24}}>{g.emoji}</span>
                        <p style={{fontSize:10.5,fontWeight:900,color:C.text,lineHeight:1.15,textAlign:"center"}}>{g.name}</p>
                        {child.gameHighScores?.[id]&&<p style={{fontSize:9,fontWeight:800,color:"#D97706"}}>🏆 {child.gameHighScores[id]}</p>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {/* ── TRICKY ONES — beat the questions that beat you ── */}
            {(child.trickyQs||[]).length>0&&(
              <button onClick={()=>onPlay("trickyReview")}
                style={{width:"100%",padding:"16px 18px",borderRadius:20,marginBottom:14,
                  background:"linear-gradient(135deg,#7C2D92 0%,#BE185D 60%,#E11D48 100%)",
                  border:"none",cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",gap:14,
                  boxShadow:"0 6px 24px rgba(190,24,93,0.45)",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-16,right:-16,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.09)"}}/>
                <span style={{fontSize:34,filter:"drop-shadow(0 3px 6px rgba(0,0,0,0.3))"}}>🎯</span>
                <div style={{textAlign:"left",flex:1}}>
                  <p style={{fontSize:16,fontWeight:900,color:"#fff"}}>Tricky Ones</p>
                  <p style={{fontSize:11.5,fontWeight:700,color:"rgba(255,255,255,0.85)"}}>Beat the {(child.trickyQs||[]).length} question{(child.trickyQs||[]).length===1?"":"s"} that beat you · 1.5× XP</p>
                </div>
                <span style={{background:"rgba(255,255,255,0.2)",borderRadius:11,padding:"5px 11px",fontSize:14,fontWeight:900,color:"#fff"}}>{(child.trickyQs||[]).length}</span>
              </button>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              {categories.slice(0,4).map(cat=>{
                const count=availableGames.filter(g=>g.subjects.some(s=>cat.subjects.includes(s))).length;
                if(!count) return null;
                return (
                  <button key={cat.id} onClick={()=>setSelectedCat(cat)}
                    style={{padding:"20px 16px",borderRadius:20,background:cat.bg,border:`2px solid ${cat.color}20`,cursor:"pointer",fontFamily:F,textAlign:"center",transition:"all 0.2s",boxShadow:`0 4px 16px ${cat.color}15`}}>
                    <div style={{fontSize:36,marginBottom:8}}>{cat.emoji}</div>
                    <p style={{fontSize:14,fontWeight:900,color:cat.color,marginBottom:2}}>{cat.label}</p>
                    <p style={{fontSize:11,fontWeight:700,color:C.muted}}>{count} games</p>
                  </button>
                );
              })}
            </div>
            {/* Computing full width */}
            {availableGames.filter(g=>g.subjects.some(s=>categories[4].subjects.includes(s))).length>0&&(
              <button onClick={()=>setSelectedCat(categories[4])}
                style={{width:"100%",padding:"16px",borderRadius:20,
                  background:`linear-gradient(135deg,${categories[4].color},${categories[4].color}CC)`,
                  border:"none",cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",gap:12,
                  boxShadow:`0 6px 20px ${categories[4].color}50`}}>
                <span style={{fontSize:32}}>{categories[4].emoji}</span>
                <div style={{textAlign:"left"}}>
                  <p style={{fontSize:14,fontWeight:900,color:"#fff"}}>{categories[4].label}</p>
                  <p style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.8)"}}>{availableGames.filter(g=>g.subjects.some(s=>categories[4].subjects.includes(s))).length} games</p>
                </div>
                <span style={{marginLeft:"auto",fontSize:18,color:"rgba(255,255,255,0.7)"}}>›</span>
              </button>
            )}
          </div>
        ):(
          /* ── 3-column game grid ── */
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {catGames.map(g=>{
              const gameLevel=getGameLevel(child,g);
              const diff=getDifficultyLabel(gameLevel);
              const isHovered=hoveredGame===g.id;
              return (
                <div key={g.id} style={{position:"relative",borderRadius:16,overflow:"hidden"}}
                  onMouseEnter={()=>setHoveredGame(g.id)}
                  onMouseLeave={()=>setHoveredGame(null)}
                  onClick={()=>onPlay(g.id)}>
                  {/* Game card */}
                  <div style={{
                    padding:"14px 10px 16px",borderRadius:20,
                    background:isHovered
                      ?`linear-gradient(145deg,${selectedCat.color},${selectedCat.color}CC)`
                      :`linear-gradient(170deg,#fff 0%,${selectedCat.bg} 100%)`,
                    border:`2px solid ${isHovered?selectedCat.color:selectedCat.color+"38"}`,
                    cursor:"pointer",textAlign:"center",
                    transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                    boxShadow:isHovered?`0 8px 24px ${selectedCat.color}45`:`0 4px 14px ${selectedCat.color}1E`,
                    transform:isHovered?"translateY(-5px) scale(1.03)":"translateY(0) scale(1)",
                    minHeight:126,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6
                  }}>
                    <div style={{width:48,height:48,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                      background:isHovered?"rgba(255,255,255,0.22)":`${selectedCat.color}1A`,
                      border:`1.5px solid ${isHovered?"rgba(255,255,255,0.4)":selectedCat.color+"30"}`,
                      fontSize:26,lineHeight:1,transition:"all 0.2s"}}>{g.emoji}</div>
                    <p style={{fontSize:12,fontWeight:900,color:isHovered?"#fff":C.text,lineHeight:1.2}}>{g.name}</p>
                    <span style={{fontSize:9,fontWeight:800,
                      color:isHovered?"rgba(255,255,255,0.9)":"#fff",
                      background:isHovered?"rgba(255,255,255,0.25)":diff.color,
                      padding:"3px 7px",borderRadius:6}}>{diff.emoji} Lv.{gameLevel}</span>
                    {child.gameHighScores?.[g.id]&&<p style={{fontSize:8,fontWeight:800,color:isHovered?"rgba(255,255,255,0.85)":C.amber}}>🏆 {child.gameHighScores[g.id]}</p>}
                  </div>
                  {/* Hover overlay */}
                  {isHovered&&(
                    <div style={{position:"absolute",inset:0,borderRadius:16,background:selectedCat.color,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px",cursor:"pointer"}}>
                      <div style={{fontSize:22,marginBottom:4}}>{g.emoji}</div>
                      <p style={{fontSize:10,fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.3,marginBottom:6}}>{g.name}</p>
                      <p style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.85)",textAlign:"center",lineHeight:1.4,marginBottom:8}}>{g.desc}</p>
                      <div style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 10px"}}>
                        <p style={{fontSize:9,fontWeight:800,color:"#fff"}}>▶ PLAY</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Screen>
  );
}


function GamePlayer({child,gameId,mode,onComplete,onQuit}) {
  const [resetKey,setResetKey]=useState(0);
  const game = GAMES.find(g=>g.id===gameId);
  const gameLevel = game ? getGameLevel(child,game) : 1;

  const handleComplete=(result)=>{
    const acc=result.max>0?result.score/result.max:0;
    const levelReached=result.levelReached||gameLevel;
    const levelSync={};
    if(game?.subjects?.length&&levelReached>1&&acc>=0.5){game.subjects.forEach(subj=>{const cur=child.level?.[subj]||1;if(levelReached>cur)levelSync[subj]=levelReached;});}
    onComplete({...result,levelReached,_gameLevelSync:Object.keys(levelSync).length?levelSync:null});
  };

  const props={child,mode,onComplete:handleComplete,onQuit,onRetry:()=>setResetKey(k=>k+1),level:gameLevel};
  const best=(child.gameHighScores||{})[gameId]||0;
  const map={trickyReview:<TrickyReview {...props}/>,meteorMaths:<MeteorMaths {...props}/>,wordMeteors:<WordMeteors {...props}/>,numberBridge:<NumberBridge {...props}/>,frogJump:<FrogJump {...props}/>,balanceScale:<BalanceScale {...props}/>,oddEvenSort:<OddEvenSort {...props}/>,livingSort:<LivingSort {...props}/>,nounVerbSort:<NounVerbSort {...props}/>,roboRescue:<RoboRescue {...props}/>,alphabetBridge:<AlphabetBridge {...props}/>,tableMatch:<TableMatch {...props}/>,wordPicMatch:<WordPicMatch {...props}/>,numberBlaster:<NumberBlaster {...props}/>,timesTableRace:<TimesTableRace {...props}/>,fractionChef:<FractionChef {...props}/>,wordScramble:<WordScramble {...props}/>,spellingBee:<SpellingBee {...props}/>,sentenceBuilder:<SentenceBuilder {...props}/>,scienceSort:<ScienceSort {...props}/>,statesOfMatter:<StatesOfMatter {...props}/>,planetPatrol:<PlanetPatrol {...props}/>,algorithmSort:<AlgorithmSort {...props}/>,debugDetective:<DebugDetective {...props}/>,wordMatch:<WordMatch {...props}/>,mathFishing:<MathFishing {...props}/>,spaceBlaster:<SpaceBlaster {...props}/>,gemHunter:<GemHunter {...props}/>,wordRunner:<WordRunner {...props}/>,volcanoEscape:<VolcanoEscape {...props}/>,treasureMap:<TreasureMap {...props}/>,grandPrix:<GrandPrix {...props}/>,candyShop:<CandyShop {...props}/>,basketballMaths:<BasketballMaths {...props}/>,trainGame:<TrainGame {...props}/>,supermarketMath:<SupermarketMath {...props}/>,rocketMaths:<RocketMaths {...props}/>,spellBingo:<SpellBingo {...props}/>,wordShake:<WordShake {...props}/>,spotDifference:<SpotDifference {...props}/>,puzzleWords:<PuzzleWords {...props}/>,schoolRun:<SchoolRun {...props}/>,memoryWords:<MemoryWords {...props}/>,dinosaurGame:<DinosaurGame {...props}/>,jungleExplorer:<JungleExplorer {...props}/>,oceanGame:<OceanGame {...props}/>,bubbleBuster:<BubbleBuster {...props}/>,colourScience:<ColourScience {...props}/>,astronautGame:<AstronautGame {...props}/>,pyramidsGame:<PyramidsGame {...props}/>,inspectorGame:<InspectorGame {...props}/>,hideSeekHistory:<HideSeekHistory {...props}/>,tenableGame:<TenableGame {...props}/>,footballHistory:<FootballHistory {...props}/>,worldMapGame:<WorldMapGame {...props}/>,geographyGuesser:<GeographyGuesser {...props}/>,skiingGeo:<SkiingGeo {...props}/>,skateboardGeo:<SkateboardGeo {...props}/>,pirateGeo:<PirateGeo {...props}/>,busGame:<BusGame {...props}/>,codeGame:<CodeGame {...props}/>,flippingFood:<FlippingFood {...props}/>,memoryComputer:<MemoryComputer {...props}/>,spellingRun:<SpellingRun {...props}/>,mathSprint:<MathSprint {...props}/>,shapeShooter:<ShapeShooter {...props}/>,coordinateQuest:<CoordinateQuest {...props}/>,ratioRecipe:<RatioRecipe {...props}/>,poetrySlam:<PoetrySlam {...props}/>,mediaDetective:<MediaDetective {...props}/>,seasonsGame:<SeasonsGame {...props}/>,soundWaves:<SoundWaves {...props}/>,circuitBuilder:<CircuitBuilder {...props}/>,chemistryLab:<ChemistryLab {...props}/>,timeMachine:<TimeMachine {...props}/>,localHero:<LocalHero {...props}/>,safetyShield:<SafetyShield {...props}/>,creativeStudio:<CreativeStudio {...props}/>,timelineSort:<AlgorithmSort {...props}/>,historyMatch:<ScienceSort {...props}/>,mapQuiz:<ScienceSort {...props}/>};
  return <GameCtx.Provider value={{gameId,best}}><div key={`${gameId}-${resetKey}`}>{map[gameId]||<div style={{padding:40,textAlign:"center"}}><p>Game not found: {gameId}</p></div>}</div></GameCtx.Provider>;
}


// ── Child Login Screen ────────────────────────────────────────────────────
function ChildLogin({children, onSelect, onParent}) { // onSelect goes to progress for parents
  if(!children||children.length===0) {
    return (
      <Screen>
        <div style={{paddingTop:60,textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:16}}>👋</div>
          <h2 style={{fontSize:24,fontWeight:900,color:C.text,marginBottom:8}}>No children yet</h2>
          <p style={{fontSize:14,color:C.muted,fontWeight:600,marginBottom:28}}>Ask your parent to set up your account first.</p>
          <Btn onClick={onParent} v="ghost">Parent Login</Btn>
        </div>
      </Screen>
    );
  }
  return (
    <Screen>
      <div style={{paddingTop:40,textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:8,animation:"floatY 2.5s ease-in-out infinite"}}>🎓</div>
        <h1 style={{fontSize:36,fontWeight:900,background:"linear-gradient(135deg,#4F46E5,#7C3AED)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-1,marginBottom:4}}>ADAPT</h1>
        <p style={{fontSize:14,color:C.muted,fontWeight:700,marginBottom:32}}>Who's learning today?</p>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
          {children.map(c=>{
            const t=TUTORS[c.tutor];
            return (
              <Card key={c.id} onClick={()=>onSelect(c)} style={{padding:"18px 20px",border:`2px solid ${t?.color||C.primary}30`,background:`linear-gradient(135deg,${t?.light||C.pLight},white)`,cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <AvatarCircle avatar={c.avatar} size={52} color={t?.color||C.primary}/>
                  <div style={{flex:1,textAlign:"left"}}>
                    <p style={{fontSize:20,fontWeight:900,color:C.text}}>{c.name}</p>
                    <p style={{fontSize:12,fontWeight:700,color:C.muted}}>{c.yearGroup} · {c.country} · 🔥 {c.streak} day streak</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{fontSize:22,fontWeight:900,color:t?.color||C.primary}}>{c.xp}<span style={{fontSize:11,color:C.muted}}>xp</span></p>
                    <p style={{fontSize:11,color:C.muted,fontWeight:700}}>Lv.{Math.max(...Object.values(c.level))}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <button onClick={onParent} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,color:C.muted,fontFamily:F,display:"flex",alignItems:"center",gap:6,margin:"0 auto"}}>
          🔒 Parent login
        </button>
      </div>
    </Screen>
  );
}


// ── Topic Picker ──────────────────────────────────────────────────────────
function TopicPicker({child,subject,onStart,onBack,onLearn}) {
  const sc = SUB[subject];
  const topics = getCurriculum(child.country)[subject] || [];
  const tLevels = child.topicLevels?.[subject] || {};
  const ctry = child.country;
  const getTopicLevels = (t) => {
    if(t.ukLevels) return ctry==="UK"?t.ukLevels:ctry==="US"?t.usLevels:(t.caLevels||t.ukLevels);
    return t.levels||[];
  };
  return (
    <Screen>
      <div style={{paddingTop:16}}>
        <BackBtn onClick={onBack}/>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <span style={{fontSize:28}}>{sc.emoji}</span>
          <h2 style={{fontSize:26,fontWeight:900,color:C.text}}>{subject}</h2>
        </div>
        <p style={{fontSize:13,fontWeight:700,color:C.muted,marginBottom:22}}>Pick a topic to practise</p>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {topics.filter(t=>t.minAge<=child.age).map(topic=>{
            const lvl = tLevels[topic.id] || 1;
            const pct = ((lvl-1)/4)*100;
            const lvlDescs = getTopicLevels(topic);
            const topicWithLevels = {...topic, levels: lvlDescs};
            return (
              <Card key={topic.id} style={{padding:"18px 18px",border:`2px solid ${sc.color}25`,background:`linear-gradient(135deg,${sc.light},white)`}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                  <div style={{width:46,height:46,borderRadius:12,background:sc.light,border:`2px solid ${sc.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{topic.emoji}</div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:2}}>{topic.name}</p>
                    <p style={{fontSize:12,fontWeight:600,color:C.muted,lineHeight:1.4}}>{lvlDescs[lvl-1]||""}</p>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <p style={{fontSize:15,fontWeight:900,color:getDifficultyLabel(lvl).color}}>Lv.{lvl}</p>
                    <p style={{fontSize:10,fontWeight:700,color:getDifficultyLabel(lvl).color}}>{getDifficultyLabel(lvl).emoji} {getDifficultyLabel(lvl).label}</p>
                  </div>
                </div>
                {(()=>{
                  const key=`${subject}_${topic.id}_lv${lvl}`;
                  const topicLvl=(child.topicLevels?.[subject]?.[topic.id]||1);
                  const qKey=`${subject}_${topic.id}_lv${topicLvl}`;
                  const qCount=(child.topicQCounts||{})[qKey]||0;
                  const testResult=(child.topicTestResults||{})[key];
                  const qPct=Math.min(100,Math.round((qCount/50)*100));
                  return (
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:10,fontWeight:700,color:C.muted}}>
                          {testResult==="pass"?"✅ Level passed":qCount>=50?"📝 Test ready!":qCount+"/50 questions"}
                        </span>
                        <span style={{fontSize:10,fontWeight:700,color:C.muted}}>{qPct}%</span>
                      </div>
                      <PBar value={qPct} max={100} color={testResult?.passed?C.green:qCount>=50?C.primary:sc.color} h={5}/>
                    </div>
                  );
                })()}
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  {child.level?.[subject]>=1&&<button onClick={()=>onLearn&&onLearn(topicWithLevels)}
                    style={{flex:1,padding:"8px",borderRadius:10,fontSize:12,fontWeight:800,cursor:"pointer",
                      fontFamily:"'Nunito',sans-serif",background:"#fff",border:`2px solid ${sc.color}`,color:sc.color}}>
                    📚 Learn
                  </button>}
                  <button onClick={()=>onStart(topicWithLevels)}
                    style={{flex:2,padding:"8px",borderRadius:10,fontSize:13,fontWeight:900,cursor:"pointer",
                      fontFamily:"'Nunito',sans-serif",
                      background:`linear-gradient(135deg,${sc.color},${sc.color}CC)`,
                      color:"#fff",border:"none",boxShadow:`0 3px 10px ${sc.color}40`}}>
                    ▶ Start
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}


// ═════════════════════════════════════════════════════════════════
// ACCESSIBILITY SYSTEM
// ═════════════════════════════════════════════════════════════════

const A11Y_CONDITIONS = [
  {id:"epilepsy",            label:"Photosensitive Epilepsy",    emoji:"⚡", category:"Neurological", desc:"Removes all confetti, flashing and looping animations"},
  {id:"visualImpairment",    label:"Visual Impairment",           emoji:"👁️", category:"Neurological", desc:"Larger text, higher contrast, no colour-only indicators"},
  {id:"hearingImpairment",   label:"Hearing Impairment",          emoji:"👂", category:"Neurological", desc:"All learning becomes fully visual — no audio dependency"},
  {id:"colourBlindness",     label:"Colour Blindness",            emoji:"🎨", category:"Neurological", desc:"Icons added alongside all colour-based feedback"},
  {id:"dyslexia",            label:"Dyslexia",                    emoji:"📝", category:"Learning",     desc:"Dyslexia-friendly font, wider spacing, shorter sentences"},
  {id:"dyscalculia",         label:"Dyscalculia",                 emoji:"🔢", category:"Learning",     desc:"Visual aids for maths, extra time, step-by-step hints always shown"},
  {id:"dyspraxia",           label:"Dyspraxia",                   emoji:"🖐️", category:"Learning",     desc:"Larger tap targets, no time pressure, simpler navigation"},
  {id:"adhd",                label:"ADHD",                        emoji:"🧠", category:"Attention",    desc:"Shorter sessions, more frequent rewards, reduced distractions"},
  {id:"autism",              label:"Autism Spectrum",             emoji:"🌈", category:"Attention",    desc:"Predictable layouts, clear instructions, no sudden changes"},
  {id:"processingDifficulties",label:"Processing Difficulties",  emoji:"⏱️", category:"Attention",    desc:"Read-aloud always on, simpler language, slower pacing"},
  {id:"testAnxiety",         label:"Test / Performance Anxiety",  emoji:"😰", category:"Anxiety",      desc:"No timers, soft wrong-answer feedback, no red colours"},
  {id:"generalAnxiety",      label:"General Anxiety",             emoji:"🌿", category:"Anxiety",      desc:"Calming colours, gentle encouraging language, no pressure"},
];

function useA11y(child) {
  const a = child?.accessibility || {};
  return {
    noMotion:          !!(a.epilepsy),
    reducedMotion:     !!(a.epilepsy || a.generalAnxiety),
    dyslexiaFont:      !!(a.dyslexia),
    largeText:         !!(a.visualImpairment || a.processingDifficulties),
    simpleLanguage:    !!(a.processingDifficulties || a.autism || a.dyslexia),
    highContrast:      !!(a.visualImpairment),
    noRedFeedback:     !!(a.testAnxiety || a.generalAnxiety),
    iconFeedback:      !!(a.colourBlindness),
    calmScheme:        !!(a.generalAnxiety || a.autism),
    noAudio:           !!(a.hearingImpairment),
    alwaysAudio:       !!(a.processingDifficulties),
    largeTapTargets:   !!(a.dyspraxia || a.visualImpairment),
    noTimers:          !!(a.testAnxiety || a.dyscalculia || a.dyspraxia),
    extraHints:        !!(a.dyscalculia || a.processingDifficulties),
    moreRewards:       !!(a.adhd),
    shorterSessions:   !!(a.adhd),
    predictableLayout: !!(a.autism),
  };
}

// ── A11y delivery: context for components + live gate for sound/speech ──
const A11yContext = React.createContext(null);
const useGameA11y = () => React.useContext(A11yContext) || {};
// Module-level mirror so playSound()/speak() (called from timeouts, outside
// render) also respect the child's needs.
const A11Y_LIVE = { current: {} };
function A11ySync({a11y}) {
  useEffect(()=>{ A11Y_LIVE.current = a11y || {}; },[JSON.stringify(a11y)]);
  return null;
}
// Prompt directives so the AI itself adapts questions to the child's needs
function a11yPromptRules(child) {
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

function AccessibilitySettings({child, onSave, onBack}) {
  const [acc, setAcc] = useState({...(child.accessibility||{})});
  const toggle = (id) => setAcc(prev => ({...prev, [id]: !prev[id]}));
  const categories = ["Neurological","Learning","Attention","Anxiety"];
  const active = Object.values(acc).filter(Boolean).length;
  return (
    <Screen>
      <div style={{paddingTop:20}}>
        <BackBtn onClick={onBack}/>
        <h2 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:6}}>Accessibility</h2>
        <p style={{fontSize:13,fontWeight:600,color:C.muted,lineHeight:1.6,marginBottom:12}}>
          Select any conditions that apply to {child.name}. ADAPT adjusts the experience automatically. Change these any time.
        </p>
        {active>0&&<div style={{marginBottom:16,padding:"10px 14px",background:C.gLight,borderRadius:12,border:`1px solid ${C.green}`}}><p style={{fontSize:13,fontWeight:800,color:C.gDark}}>✓ {active} adjustment{active!==1?"s":""} active for {child.name}</p></div>}
        {categories.map(cat=>{
          const items=A11Y_CONDITIONS.filter(c=>c.category===cat);
          return (
            <div key={cat} style={{marginBottom:22}}>
              <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>{cat}</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {items.map(cond=>{
                  const on=acc[cond.id]||false;
                  return (
                    <button key={cond.id} onClick={()=>toggle(cond.id)}
                      style={{padding:"14px 16px",borderRadius:16,border:`2px solid ${on?C.primary:C.border}`,
                        background:on?C.pLight:C.surface,cursor:"pointer",fontFamily:F,
                        display:"flex",alignItems:"center",gap:14,textAlign:"left",
                        transition:"all 0.15s",boxShadow:on?`0 4px 14px ${C.primary}22`:"none"}}>
                      <span style={{fontSize:28,flexShrink:0}}>{cond.emoji}</span>
                      <div style={{flex:1}}>
                        <p style={{fontSize:15,fontWeight:800,color:on?C.primary:C.text,marginBottom:2}}>{cond.label}</p>
                        <p style={{fontSize:12,fontWeight:600,color:C.muted,lineHeight:1.4}}>{cond.desc}</p>
                      </div>
                      <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,background:on?C.primary:C.border,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                        {on&&<span style={{color:"#fff",fontSize:13,fontWeight:900}}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div style={{padding:"14px 16px",background:C.aLight,borderRadius:14,border:`1px solid ${C.amber}30`,marginBottom:16}}>
          <p style={{fontSize:13,fontWeight:700,color:"#92400E",lineHeight:1.6}}>
            💛 These settings guide ADAPT but are not a medical tool. Always consult your child's doctor, specialist or SENCO for professional advice.
          </p>
        </div>
        <div style={{padding:"12px 16px",background:C.sLight,borderRadius:14,border:`1px solid ${C.sky}30`,marginBottom:28}}>
          <p style={{fontSize:13,fontWeight:700,color:C.sDark,lineHeight:1.6}}>
            🛡️ Safeguarding: ADAPT's content is AI-generated and filtered for child safety. If you have concerns about any content please use the report button in the app or contact us directly.
          </p>
        </div>
        <Btn onClick={()=>onSave(acc)} style={{width:"100%",fontSize:16}}>Save Settings ✓</Btn>
      </div>
    </Screen>
  );
}






// ── Auth Login Choice ─────────────────────────────────────────────────────
// ── Privacy notice — required for a children's app, even in beta ───
function PrivacyLink({light}) {
  const [open,setOpen]=useState(false);
  return(<>
    <button onClick={()=>setOpen(true)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:F,
      fontSize:12,fontWeight:700,color:light?"rgba(255,255,255,0.55)":C.muted,textDecoration:"underline",padding:6}}>
      Privacy Notice
    </button>
    {open&&(
      <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:900,
        display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,maxWidth:440,width:"100%",
          maxHeight:"82vh",overflowY:"auto",padding:"24px 22px",textAlign:"left",boxShadow:"0 24px 80px rgba(0,0,0,0.4)"}}>
          <h2 style={{fontSize:19,fontWeight:900,color:C.text,marginBottom:4}}>Privacy Notice</h2>
          <p style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:14}}>ADAPT — plain-English summary for parents</p>
          {[
            ["What we collect","Your email address; your child's first name, age, year group and country; and their learning progress (questions answered, scores, levels, badges, and questions they found tricky)."],
            ["Why we collect it","Solely to run ADAPT: adapting question difficulty to your child, showing their progress, and sending you progress reports if you request them."],
            ["Where it's stored","Securely in our database (hosted by Supabase). Question generation uses Anthropic's AI service: your child's year group, country, and topic are sent to generate age-appropriate questions. We never sell data or use it for advertising."],
            ["Your child's data rights","You can view everything we hold via the parent dashboard. To delete your child's profile and all associated data, use the parent settings or email us — we'll complete deletion within 30 days."],
            ["Cookies & tracking","We use only essential local storage to keep your child signed in and save their progress. No advertising trackers, ever."],
            ["Contact","Questions or deletion requests: contact the address shown in your welcome email."],
          ].map(([h,b])=>(
            <div key={h} style={{marginBottom:12}}>
              <p style={{fontSize:13,fontWeight:900,color:C.text,marginBottom:3}}>{h}</p>
              <p style={{fontSize:12.5,fontWeight:600,color:"#475569",lineHeight:1.6}}>{b}</p>
            </div>
          ))}
          <button onClick={()=>setOpen(false)} style={{width:"100%",marginTop:6,padding:"13px",borderRadius:14,
            background:C.primary,color:"#fff",border:"none",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:F}}>Close</button>
        </div>
      </div>
    )}
  </>);
}

function AuthLoginChoice({onParent, onChild}) {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#312E81 0%,#4F46E5 40%,#7C3AED 100%)",fontFamily:F,display:"flex",justifyContent:"center",alignItems:"center",padding:"20px 16px"}}>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:72,marginBottom:8}}>🎓</div>
        <h1 style={{fontSize:56,fontWeight:900,color:"#fff",letterSpacing:-2,marginBottom:6}}>ADAPT</h1>
        <p style={{fontSize:16,color:"rgba(255,255,255,0.7)",fontWeight:700,marginBottom:40}}>Welcome back!</p>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:28}}>
          <button onClick={onChild} style={{padding:"22px 24px",borderRadius:22,background:"#fff",border:"none",cursor:"pointer",fontFamily:F,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",transition:"all 0.2s",display:"flex",alignItems:"center",gap:16,textAlign:"left"}}
            onMouseOver={e=>e.currentTarget.style.transform="translateY(-3px)"}
            onMouseOut={e=>e.currentTarget.style.transform=""}>
            <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#4F46E5,#818CF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>🎒</div>
            <div>
              <p style={{fontSize:19,fontWeight:900,color:C.text,marginBottom:2}}>I'm a Student</p>
              <p style={{fontSize:13,fontWeight:600,color:C.muted}}>Use your username and password</p>
            </div>
            <span style={{marginLeft:"auto",fontSize:22,color:C.primary}}>›</span>
          </button>
          <button onClick={onParent} style={{padding:"22px 24px",borderRadius:22,background:"rgba(255,255,255,0.12)",border:"2px solid rgba(255,255,255,0.25)",cursor:"pointer",fontFamily:F,transition:"all 0.2s",display:"flex",alignItems:"center",gap:16,textAlign:"left",backdropFilter:"blur(4px)"}}
            onMouseOver={e=>e.currentTarget.style.transform="translateY(-3px)"}
            onMouseOut={e=>e.currentTarget.style.transform=""}>
            <div style={{width:56,height:56,borderRadius:16,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>👨‍👩‍👧</div>
            <div>
              <p style={{fontSize:19,fontWeight:900,color:"#fff",marginBottom:2}}>I'm a Parent</p>
              <p style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.65)"}}>Sign in or create an account</p>
            </div>
            <span style={{marginLeft:"auto",fontSize:22,color:"rgba(255,255,255,0.7)"}}>›</span>
          </button>
        </div>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:700}}>New to ADAPT? Parents sign up first — children get a username from their parent.</p>
        <PrivacyLink light/>
      </div>
    </div>
  );
}

// ── Child Login Screen (username + password) ─────────────────────────────
function ChildUsernameLogin({onLogin, onParentLogin, onBack}) {
  const [username, setUsername] = useState("");
  const [pass, setPass]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");

  const login = async () => {
    if(!username.trim()||!pass) return;
    setLoading(true); setErr("");
    try {
      const hash = await hashPassword(pass);
      const {data, error} = await supabase
        .from("child_accounts")
        .select("*")
        .eq("username", username.trim().toLowerCase())
        .eq("password_hash", hash)
        .single();
      if(error||!data) { setErr("Username or password incorrect"); setLoading(false); return; }
      // Load parent data and find this child
      const parentData = await supabase
        .from("adapt_data")
        .select("payload")
        .eq("user_id", data.parent_id)
        .single();
      if(parentData.data?.payload) {
        onLogin(parentData.data.payload, data.child_id, data.parent_id);
      } else {
        setErr("Could not load account data");
      }
    } catch(e) {
      setErr("Something went wrong — please try again");
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#312E81 0%,#4F46E5 40%,#7C3AED 100%)",fontFamily:F,display:"flex",justifyContent:"center",alignItems:"center",padding:"20px 16px"}}>
      <div style={{maxWidth:420,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          {onBack&&<button onClick={onBack} style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)",background:"none",border:"none",cursor:"pointer",fontFamily:F,marginBottom:12,display:"block",margin:"0 auto 12px"}}>← Back</button>}
          <div style={{fontSize:56,marginBottom:8}}>🎒</div>
          <h1 style={{fontSize:36,fontWeight:900,color:"#fff",letterSpacing:-1,marginBottom:4}}>Student Login</h1>
          <p style={{fontSize:14,color:"rgba(255,255,255,0.7)",fontWeight:700}}>Use your username and password</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.12)",borderRadius:24,padding:"28px 24px",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.2)"}}>
          {err&&<div style={{padding:"10px 14px",background:"rgba(220,38,38,0.2)",borderRadius:10,marginBottom:16,border:"1px solid rgba(220,38,38,0.4)"}}><p style={{fontSize:13,fontWeight:700,color:"#FCA5A5"}}>{err}</p></div>}
          <div style={{marginBottom:14}}>
            <p style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.7)",marginBottom:6}}>USERNAME</p>
            <input value={username} onChange={e=>setUsername(e.target.value.replace(/\s/g,"").toLowerCase())} placeholder="e.g. ella2015 (not your email)"
              style={{width:"100%",padding:"13px 16px",borderRadius:12,fontSize:15,fontWeight:700,background:"rgba(255,255,255,0.1)",border:`2px solid ${username?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.2)"}`,color:"#fff",outline:"none",fontFamily:F}}/>
          </div>
          <div style={{marginBottom:20}}>
            <p style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.7)",marginBottom:6}}>PASSWORD</p>
            <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••••"
              onKeyDown={e=>e.key==="Enter"&&login()}
              style={{width:"100%",padding:"13px 16px",borderRadius:12,fontSize:15,fontWeight:700,background:"rgba(255,255,255,0.1)",border:`2px solid ${pass?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.2)"}`,color:"#fff",outline:"none",fontFamily:F}}/>
          </div>
          <button onClick={login} disabled={loading||!username||!pass}
            style={{width:"100%",padding:"15px",borderRadius:50,background:"#fff",border:"none",cursor:loading?"wait":"pointer",fontFamily:F,fontSize:16,fontWeight:900,color:C.primary,boxShadow:"0 6px 20px rgba(0,0,0,0.2)",opacity:loading||!username||!pass?0.6:1}}>
            {loading?"Logging in...":"Let's Learn! 🚀"}
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:20}}>
          <button onClick={onParentLogin} style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)",background:"none",border:"none",cursor:"pointer",fontFamily:F}}>
            🔒 Parent / Guardian login
          </button>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:12,lineHeight:1.6}}>
            Forgotten your username or password?<br/>Ask your parent to check the ADAPT app.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Auth Screens ──────────────────────────────────────────────────────────
function AuthLogin({onLogin, onSignUp, onBack}) {
  const [email,setEmail]   = useState("");
  const [pass,setPass]     = useState("");
  const [loading,setLoading] = useState(false);
  const [err,setErr]       = useState("");
  const [reset,setReset]   = useState(false);
  const [resetSent,setResetSent] = useState(false);

  const login = async () => {
    if(!email||!pass) return;
    setLoading(true); setErr("");
    try {
      const timeout = new Promise((_,reject) => setTimeout(()=>reject(new Error("Connection timed out — please try again")), 10000));
      const signIn = supabase.auth.signInWithPassword({email,password:pass});
      const {error} = await Promise.race([signIn, timeout]);
      if(error) setErr(error.message);
    } catch(e) {
      setErr(e.message||"Connection timed out — please try again");
    }
    setLoading(false);
  };

  const sendReset = async () => {
    if(!email){setErr("Enter your email first");return;}
    setLoading(true);
    const {error} = await supabase.auth.resetPasswordForEmail(email);
    if(error) setErr(error.message);
    else setResetSent(true);
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#312E81 0%,#4F46E5 40%,#7C3AED 100%)",fontFamily:F,display:"flex",justifyContent:"center",alignItems:"center",padding:"20px 16px"}}>
      <div style={{maxWidth:420,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          {onBack&&<button onClick={onBack} style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)",background:"none",border:"none",cursor:"pointer",fontFamily:F,marginBottom:12}}>← Back</button>}
          <div style={{fontSize:56,marginBottom:8}}>🎓</div>
          <h1 style={{fontSize:42,fontWeight:900,color:"#fff",letterSpacing:-2,marginBottom:4}}>ADAPT</h1>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.7)",fontWeight:700}}>Parent / Guardian Login</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.12)",borderRadius:24,padding:"28px 24px",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.2)"}}>
          {resetSent?(
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <p style={{fontSize:32,marginBottom:12}}>📧</p>
              <p style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:8}}>Reset email sent!</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.7)",marginBottom:20}}>Check your inbox and follow the link to reset your password.</p>
              <button onClick={()=>{setReset(false);setResetSent(false);}} style={{fontSize:14,fontWeight:800,color:"rgba(255,255,255,0.8)",background:"none",border:"none",cursor:"pointer",fontFamily:F}}>← Back to login</button>
            </div>
          ):(
            <>
              <h2 style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:20}}>{reset?"Reset Password":"Sign In"}</h2>
              {err&&<div style={{padding:"10px 14px",background:"rgba(220,38,38,0.2)",borderRadius:10,marginBottom:16,border:"1px solid rgba(220,38,38,0.4)"}}><p style={{fontSize:13,fontWeight:700,color:"#FCA5A5"}}>{err}</p></div>}
              <div style={{marginBottom:14}}>
                <p style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.7)",marginBottom:6}}>EMAIL</p>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="your@email.com"
                  style={{width:"100%",padding:"13px 16px",borderRadius:12,fontSize:15,fontWeight:700,background:"rgba(255,255,255,0.1)",border:"2px solid rgba(255,255,255,0.2)",color:"#fff",outline:"none",fontFamily:F}}/>
              </div>
              {!reset&&(
                <div style={{marginBottom:20}}>
                  <p style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.7)",marginBottom:6}}>PASSWORD</p>
                  <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••••"
                    onKeyDown={e=>e.key==="Enter"&&login()}
                    style={{width:"100%",padding:"13px 16px",borderRadius:12,fontSize:15,fontWeight:700,background:"rgba(255,255,255,0.1)",border:"2px solid rgba(255,255,255,0.2)",color:"#fff",outline:"none",fontFamily:F}}/>
                </div>
              )}
              <button onClick={reset?sendReset:login} disabled={loading}
                style={{width:"100%",padding:"15px",borderRadius:50,background:"#fff",border:"none",cursor:loading?"wait":"pointer",fontFamily:F,fontSize:16,fontWeight:900,color:C.primary,boxShadow:"0 6px 20px rgba(0,0,0,0.2)",marginBottom:14,opacity:loading?0.7:1}}>
                {loading?"Please wait...":(reset?"Send Reset Email":"Sign In")}
              </button>
              {!reset&&<button onClick={()=>setReset(true)} style={{width:"100%",fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)",background:"none",border:"none",cursor:"pointer",fontFamily:F,marginBottom:6}}>Forgot password?</button>}
              {reset&&<button onClick={()=>setReset(false)} style={{width:"100%",fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)",background:"none",border:"none",cursor:"pointer",fontFamily:F}}>← Back to login</button>}
            </>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:20}}>
          <p style={{fontSize:14,color:"rgba(255,255,255,0.6)",fontWeight:600,marginBottom:10}}>Don't have an account yet?</p>
          <button onClick={onSignUp} style={{padding:"12px 28px",borderRadius:50,background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.3)",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:F}}>
            Create Account →
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthSignUp({accountType, onBack}) {
  const [name,setName]   = useState("");
  const [email,setEmail] = useState("");
  const [pass,setPass]   = useState("");
  const [pass2,setPass2] = useState("");
  const [loading,setLoading] = useState(false);
  const [err,setErr]     = useState("");
  const [done,setDone]   = useState(false);

  const signup = async () => {
    if(!name.trim()||!email||!pass) return;
    if(pass!==pass2){setErr("Passwords don't match");return;}
    if(pass.length<6){setErr("Password must be at least 6 characters");return;}
    setLoading(true); setErr("");
    const {error} = await supabase.auth.signUp({
      email, password:pass,
      options:{data:{type:accountType, name:name.trim()}}
    });
    if(error) setErr(error.message);
    else { setDone(true); }
    setLoading(false);
  };

  if(done) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#064E3B,#059669)",fontFamily:F,display:"flex",justifyContent:"center",alignItems:"center",padding:"20px 16px"}}>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:16}}>📧</div>
        <h2 style={{fontSize:28,fontWeight:900,color:"#fff",marginBottom:10}}>Check your email!</h2>
        <p style={{fontSize:15,color:"rgba(255,255,255,0.8)",fontWeight:600,lineHeight:1.7,marginBottom:24}}>
          We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back here to sign in.
        </p>
        <button onClick={onBack} style={{padding:"14px 28px",borderRadius:50,background:"#fff",border:"none",cursor:"pointer",fontFamily:F,fontSize:15,fontWeight:900,color:C.green}}>
          Back to Sign In →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#312E81 0%,#4F46E5 40%,#7C3AED 100%)",fontFamily:F,display:"flex",justifyContent:"center",alignItems:"center",padding:"20px 16px"}}>
      <div style={{maxWidth:420,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:48,marginBottom:6}}>🎓</div>
          <h1 style={{fontSize:36,fontWeight:900,color:"#fff",letterSpacing:-1,marginBottom:4}}>Create Account</h1>
          <p style={{fontSize:14,color:"rgba(255,255,255,0.7)",fontWeight:700}}>
            {accountType==="parent"?"Parent / Guardian account":"Student account"}
          </p>
        </div>
        <div style={{background:"rgba(255,255,255,0.12)",borderRadius:24,padding:"28px 24px",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.2)"}}>
          <h2 style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:20}}>Your Details</h2>
          {err&&<div style={{padding:"10px 14px",background:"rgba(220,38,38,0.2)",borderRadius:10,marginBottom:16,border:"1px solid rgba(220,38,38,0.4)"}}><p style={{fontSize:13,fontWeight:700,color:"#FCA5A5"}}>{err}</p></div>}
          {[
            {l:"YOUR NAME",v:name,set:setName,t:"text",p:accountType==="parent"?"e.g. Sarah":"e.g. Alex"},
            {l:"EMAIL ADDRESS",v:email,set:setEmail,t:"email",p:"your@email.com"},
            {l:"PASSWORD",v:pass,set:setPass,t:"password",p:"At least 6 characters"},
            {l:"CONFIRM PASSWORD",v:pass2,set:setPass2,t:"password",p:"Repeat your password"},
          ].map(f=>(
            <div key={f.l} style={{marginBottom:14}}>
              <p style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.7)",marginBottom:6}}>{f.l}</p>
              <input value={f.v} onChange={e=>f.set(e.target.value)} type={f.t} placeholder={f.p}
                onKeyDown={e=>e.key==="Enter"&&signup()}
                style={{width:"100%",padding:"13px 16px",borderRadius:12,fontSize:15,fontWeight:700,background:"rgba(255,255,255,0.1)",border:`2px solid ${f.v?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.2)"}`,color:"#fff",outline:"none",fontFamily:F}}/>
            </div>
          ))}
          <button onClick={signup} disabled={loading||!name||!email||!pass||!pass2}
            style={{width:"100%",padding:"15px",borderRadius:50,background:"#fff",border:"none",cursor:loading?"wait":"pointer",fontFamily:F,fontSize:16,fontWeight:900,color:C.primary,boxShadow:"0 6px 20px rgba(0,0,0,0.2)",marginTop:6,opacity:loading||!name||!email||!pass||!pass2?0.6:1}}>
            {loading?"Creating account...":"Create Account →"}
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:16}}>
          <button onClick={onBack} style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.6)",background:"none",border:"none",cursor:"pointer",fontFamily:F}}>← Back to sign in</button>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:12,lineHeight:1.6,textAlign:"center"}}>
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
        </div>
      </div>
    </div>
  );
}


// ── Privacy Policy Screen ─────────────────────────────────────────────────
function PrivacyPolicy({onBack}) {
  return (
    <Screen>
      <div style={{paddingTop:20}}>
        <BackBtn onClick={onBack}/>
        <h2 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:6}}>Privacy Policy</h2>
        <p style={{fontSize:12,color:C.muted,fontWeight:700,marginBottom:20}}>Last updated: 2025</p>
        {[
          {t:"What we collect",b:"We collect your child's first name, age, country and learning progress. For parent accounts we collect your email address. We do not collect surnames, photos, addresses or payment details through the app."},
          {t:"How we use it",b:"Data is used solely to personalise your child's learning experience and provide progress reports to parents. We never sell data to third parties or use it for advertising."},
          {t:"Data storage",b:"All data is stored securely using Supabase, a GDPR-compliant database provider. Data is stored in the EU West region."},
          {t:"Children's privacy",b:"ADAPT is designed for children aged 4-11. Children's accounts are created and controlled by parents. We comply with COPPA (US), UK Children's Code and PIPEDA (Canada)."},
          {t:"Your rights",b:"You can request deletion of all your data at any time from Settings → Reset All Data. For further requests contact us directly."},
          {t:"Cookies",b:"We use localStorage to store session data on your device. We do not use tracking cookies or advertising cookies."},
          {t:"Contact",b:"For privacy questions please contact us. Legal documents are in development — full policy coming soon."},
        ].map(s=>(
          <Card key={s.t} style={{marginBottom:12}}>
            <p style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:6}}>{s.t}</p>
            <p style={{fontSize:13,fontWeight:600,color:C.muted,lineHeight:1.7}}>{s.b}</p>
          </Card>
        ))}
        <div style={{padding:"12px 16px",background:C.aLight,borderRadius:12,marginTop:8}}>
          <p style={{fontSize:12,fontWeight:700,color:"#92400E",lineHeight:1.6}}>
            ⚠️ This is a preliminary privacy notice. A full legally-reviewed Privacy Policy is in development.
          </p>
        </div>
      </div>
    </Screen>
  );
}

// ── Terms of Service Screen ───────────────────────────────────────────────
function TermsOfService({onBack}) {
  return (
    <Screen>
      <div style={{paddingTop:20}}>
        <BackBtn onClick={onBack}/>
        <h2 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:6}}>Terms of Service</h2>
        <p style={{fontSize:12,color:C.muted,fontWeight:700,marginBottom:20}}>Last updated: 2025</p>
        {[
          {t:"Who can use ADAPT",b:"ADAPT is for children aged 4-18 with parental supervision. Children's accounts must be created by a parent or guardian. By signing up you confirm you are the parent or legal guardian."},
          {t:"Free trial",b:"New accounts include a 7-day free trial with full access. After the trial a subscription is required to continue."},
          {t:"Acceptable use",b:"ADAPT is for personal educational use only. You may not share accounts, resell access, or use the service for commercial purposes without written permission."},
          {t:"AI-generated content",b:"Questions and content are generated by AI and may occasionally contain errors. Parents should review content with their child. If you spot an error please report it."},
          {t:"Intellectual property",b:"All ADAPT content, branding and code is our intellectual property. The curriculum structure and question formats may not be copied or reproduced."},
          {t:"Limitation of liability",b:"ADAPT is an educational supplement. We make no guarantees about educational outcomes. The service is provided as-is."},
          {t:"Changes",b:"We may update these terms with notice. Continued use after changes constitutes acceptance."},
        ].map(s=>(
          <Card key={s.t} style={{marginBottom:12}}>
            <p style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:6}}>{s.t}</p>
            <p style={{fontSize:13,fontWeight:600,color:C.muted,lineHeight:1.7}}>{s.b}</p>
          </Card>
        ))}
        <div style={{padding:"12px 16px",background:C.aLight,borderRadius:12,marginTop:8}}>
          <p style={{fontSize:12,fontWeight:700,color:"#92400E",lineHeight:1.6}}>
            ⚠️ These are preliminary terms. Full legally-reviewed Terms of Service are in development.
          </p>
        </div>
      </div>
    </Screen>
  );
}


// ── Trial Banner ──────────────────────────────────────────────────────────
function TrialBanner({daysLeft, expired}) {
  if(!expired && daysLeft > 3) return null;
  return (
    <div style={{background:expired?"linear-gradient(135deg,#DC2626,#EF4444)":"linear-gradient(135deg,#F59E0B,#FCD34D)",padding:"10px 16px",textAlign:"center",fontFamily:F}}>
      <p style={{fontSize:13,fontWeight:800,color:"#fff"}}>
        {expired
          ? "⚠️ Your free trial has ended. Subscribe to keep learning!"
          : `⏰ ${daysLeft} day${daysLeft!==1?"s":""} left in your free trial`}
      </p>
      {expired&&<p style={{fontSize:11,color:"rgba(255,255,255,0.85)",marginTop:2}}>Contact us to subscribe — Stripe payments coming soon!</p>}
    </div>
  );
}

// ── Child Stats Screen (for solo child accounts) ─────────────────────────
function ChildStats({child, onBack}) {
  const tLevels = child.topicLevels||{};
  const acc = child.total>0?Math.round(child.correct/child.total*100):0;
  const tColor = TUTORS[child.tutor]?.color||C.primary;

  const allTopicStats = [];
  subjectsFor(child.country).forEach(subj=>{
    (getCurriculum(child.country)[subj]||[]).filter(t=>t.minAge<=child.age).forEach(topic=>{
      const lvl=(tLevels[subj]?.[topic.id])||1;
      allTopicStats.push({subj,topic,lvl});
    });
  });
  const strengths=[...allTopicStats].sort((a,b)=>b.lvl-a.lvl).filter(t=>t.lvl>1).slice(0,3);
  const weaknesses=allTopicStats.filter(t=>t.lvl<=2).sort((a,b)=>a.lvl-b.lvl).slice(0,3);

  return (
    <Screen>
      <div style={{paddingTop:20}}>
        <BackBtn onClick={onBack}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,padding:"14px 16px",background:`linear-gradient(135deg,${tColor}15,${tColor}05)`,borderRadius:18,border:`1px solid ${tColor}20`}}>
          <AvatarCircle avatar={child.avatar} size={48} color={tColor}/>
          <div>
            <h2 style={{fontSize:20,fontWeight:900,color:C.text}}>{child.name}'s Progress</h2>
            <p style={{fontSize:12,color:C.muted,fontWeight:700}}>{child.yearGroup} · {child.total} questions answered</p>
          </div>
        </div>

        {/* Key stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
          {[{v:acc+"%",l:"Accuracy",c:acc>=80?C.green:acc>=60?C.amber:C.red,e:"🎯"},
            {v:child.xp,l:"XP",c:tColor,e:"⭐"},
            {v:child.streak,l:"Streak",c:C.amber,e:"🔥"}
          ].map(s=>(
            <div key={s.l} style={{padding:"14px 10px",borderRadius:16,background:C.surface,border:`1px solid ${C.border}`,textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <p style={{fontSize:18,marginBottom:4}}>{s.e}</p>
              <p style={{fontSize:20,fontWeight:900,color:s.c}}>{s.v}</p>
              <p style={{fontSize:10,color:C.muted,fontWeight:700}}>{s.l}</p>
            </div>
          ))}
        </div>

        {child.total===0?(
          <Card style={{textAlign:"center",padding:"32px 20px",marginBottom:16}}>
            <p style={{fontSize:32,marginBottom:12}}>🚀</p>
            <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:6}}>Start your first lesson!</p>
            <p style={{fontSize:13,fontWeight:600,color:C.muted}}>Your strengths and progress will show up here after you complete a session.</p>
          </Card>
        ):(
          <>
            {strengths.length>0&&(
              <Card style={{marginBottom:14}}>
                <p style={{fontSize:13,fontWeight:800,color:C.green,marginBottom:10}}>✅ Your Strengths</p>
                {strengths.map(({subj,topic,lvl})=>(
                  <div key={topic.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"10px 12px",borderRadius:12,background:C.gLight}}>
                    <span style={{fontSize:22}}>{topic.emoji}</span>
                    <div style={{flex:1}}>
                      <p style={{fontSize:13,fontWeight:800,color:C.text}}>{topic.name}</p>
                      <p style={{fontSize:11,color:C.muted,fontWeight:600}}>{subj} · Level {lvl}/5</p>
                    </div>
                    <PBar value={lvl-1} max={4} color={C.green} h={5}/>
                  </div>
                ))}
              </Card>
            )}
            {weaknesses.length>0&&(
              <Card style={{marginBottom:14}}>
                <p style={{fontSize:13,fontWeight:800,color:C.amber,marginBottom:10}}>💪 Keep Practising</p>
                {weaknesses.map(({subj,topic,lvl})=>(
                  <div key={topic.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"10px 12px",borderRadius:12,background:C.aLight}}>
                    <span style={{fontSize:22}}>{topic.emoji}</span>
                    <div style={{flex:1}}>
                      <p style={{fontSize:13,fontWeight:800,color:C.text}}>{topic.name}</p>
                      <p style={{fontSize:11,color:C.muted,fontWeight:600}}>{subj} · Level {lvl}/5</p>
                    </div>
                  </div>
                ))}
              </Card>
            )}

            {/* Subject levels */}
            <Card style={{marginBottom:14}}>
              <Lbl c="Your Subjects"/>
              {subjectsFor(child.country).map(s=>(
                <div key={s} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:700,color:C.text}}>{SUB[s].emoji} {s}</span>
                    <span style={{fontSize:13,fontWeight:800,color:SUB[s].color}}>Level {child.level[s]||1}/5</span>
                  </div>
                  <PBar value={(child.level[s]||1)-1} max={4} color={SUB[s].color} h={8}/>
                </div>
              ))}
            </Card>

            {/* Badges */}
            <Card style={{marginBottom:14}}>
              <Lbl c={`Badges (${(child.badges||[]).length}/${BADGES.length})`}/>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {(child.badges||[]).length===0
                  ?<p style={{fontSize:13,color:C.muted,fontWeight:600}}>No badges yet — keep learning!</p>
                  :(child.badges||[]).map(id=>{const b=BADGES.find(x=>x.id===id);return b?<span key={id} style={{fontSize:26}} title={b.name}>{b.emoji}</span>:null;})}
              </div>
            </Card>
          </>
        )}
      </div>
    </Screen>
  );
}


// ── Optional Parent Email (student signup) ────────────────────────────────
function ParentEmailOptional({childName, age, onNext, onBack}) {
  const [email, setEmail] = useState("");
  const [skip, setSkip] = useState(false);
  const isUnder13 = age < 13;
  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <Lbl c="Connect a Parent (Optional)"/>
        <h2 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:8}}>
          Add a parent or guardian?
        </h2>
        <p style={{fontSize:14,fontWeight:600,color:C.muted,lineHeight:1.7,marginBottom:20}}>
          {isUnder13
            ? `Because ${childName} is under 13, a parent or guardian email is required. This keeps the account safe and lets them track progress.`
            : `A parent or guardian can track ${childName}'s progress and manage settings. Strongly recommended.`}
        </p>
        <Card style={{marginBottom:16}}>
          <Lbl c="Parent or guardian's email"/>
          <input value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="parent@example.com"
            type="email"
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:16,fontWeight:700,
              color:C.text,background:C.bg,outline:"none",
              border:`2px solid ${email?C.primary:C.border}`,transition:"border 0.2s"}}/>
          {email&&<p style={{fontSize:12,fontWeight:600,color:C.muted,marginTop:8}}>They'll get an invite to connect to {childName}'s account.</p>}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Btn onClick={()=>onNext(email||null)} style={{width:"100%"}}
            disabled={!email&&isUnder13}>
            {email?"Continue →":"Continue without parent →"}
          </Btn>
          {isUnder13&&!email&&(
            <p style={{fontSize:12,fontWeight:700,color:C.red,textAlign:"center",padding:"8px 0"}}>
              ⚠️ A parent email is required for children under 13.
            </p>
          )}
          {!isUnder13&&(
            <Btn onClick={()=>onNext(null)} v="ghost" style={{width:"100%"}}>
              Skip for now
            </Btn>
          )}
        </div>
        <p style={{fontSize:12,color:C.muted,fontWeight:600,textAlign:"center",marginTop:16,lineHeight:1.6}}>
          You can always add this later in Settings.
        </p>
      </div>
    </Screen>
  );
}



// ── Child Account Handoff Screen ─────────────────────────────────────────
function ChildHandoff({child, onSignOut, onDashboard}) {
  const [showPass, setShowPass] = useState(false);
  const t = TUTORS[child.tutor];
  return (
    <Screen>
      <div style={{paddingTop:32,textAlign:"center"}}>
        {/* Success header */}
        <div style={{fontSize:72,marginBottom:8}}>🎉</div>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:6}}>
          {child.name} is all set up!
        </h2>
        <p style={{fontSize:15,fontWeight:600,color:C.muted,marginBottom:28,lineHeight:1.6}}>
          Here are their login details. Write them down or take a screenshot.
        </p>

        {/* Credentials card */}
        <Card style={{marginBottom:14,textAlign:"left",border:`2px solid ${t?.color||C.primary}30`,background:`linear-gradient(135deg,${t?.light||C.pLight},white)`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <AvatarCircle avatar={child.avatar} size={48} color={t?.color||C.primary}/>
            <div>
              <p style={{fontSize:18,fontWeight:900,color:C.text}}>{child.name}</p>
              <p style={{fontSize:12,color:C.muted,fontWeight:700}}>{child.yearGroup} · {child.country}</p>
            </div>
          </div>
          <div style={{background:C.bg,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
            <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Username</p>
            <p style={{fontSize:22,fontWeight:900,color:C.primary,letterSpacing:1}}>{child.childUsername}</p>
          </div>
          <div style={{background:C.bg,borderRadius:12,padding:"14px 16px"}}>
            <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Password</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <p style={{fontSize:22,fontWeight:900,color:C.primary,letterSpacing:2}}>{showPass?child.childPassword:"•".repeat(child.childPassword?.length||6)}</p>
              <button onClick={()=>setShowPass(s=>!s)} style={{fontSize:12,fontWeight:800,color:C.muted,background:C.border,border:"none",cursor:"pointer",fontFamily:F,padding:"4px 10px",borderRadius:8}}>{showPass?"Hide":"Show"}</button>
            </div>
          </div>
          <p style={{fontSize:11,fontWeight:700,color:C.red,marginTop:10,lineHeight:1.5}}>
            ⚠️ You won't be able to see this password again. Save it somewhere safe.
          </p>
        </Card>

        {/* What happens next */}
        <Card style={{marginBottom:24,textAlign:"left"}}>
          <p style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:12}}>What happens next:</p>
          {[
            {n:"1",t:`Hand the device to ${child.name||"your child"}`,d:"Or they can go to the site on their own device"},
            {n:"2",t:"Tap I'm a Student",d:"On the login screen"},
            {n:"3",t:"Enter username and password",d:`Username: ${child.childUsername}`},
            {n:"4",t:"Complete a quick warm-up",d:"5 questions to find their starting level"},
            {n:"5",t:"They're in! 🚀",d:"Ready to start learning"},
          ].map(step=>(
            <div key={step.n} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:C.primary,color:"#fff",fontSize:13,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{step.n}</div>
              <div>
                <p style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:2}}>{step.t}</p>
                <p style={{fontSize:12,fontWeight:600,color:C.muted}}>{step.d}</p>
              </div>
            </div>
          ))}
        </Card>

        {/* Action buttons */}
        <Btn onClick={onSignOut} style={{width:"100%",marginBottom:10,fontSize:16}}>
          Sign out — hand to {child.name} 👋
        </Btn>
        <Btn onClick={onDashboard} v="ghost" style={{width:"100%"}}>
          Back to my dashboard
        </Btn>
      </div>
    </Screen>
  );
}

// ── Create Child Account Screen ───────────────────────────────────────────
function CreateChildAccount({childName, onNext, onBack}) {
  const [username, setUsername] = useState("");
  const [pass, setPass]         = useState("");
  const [pass2, setPass2]       = useState("");
  const [err, setErr]           = useState("");

  const [checking, setChecking] = useState(false);
  const create = async () => {
    if(!username.trim()) { setErr("Please choose a username"); return; }
    if(username.trim().length < 3) { setErr("Username must be at least 3 characters"); return; }
    if(!pass) { setErr("Please choose a password"); return; }
    if(pass.length < 6) { setErr("Password must be at least 6 characters"); return; }
    if(pass !== pass2) { setErr("Passwords don't match"); return; }
    setErr(""); setChecking(true);
    // Check username not already taken
    try {
      const r = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/child_accounts?username=eq.${username.trim().toLowerCase()}&select=id`, {
        headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` }
      });
      const data = await r.json();
      if(Array.isArray(data) && data.length > 0) {
        setErr("That username is already taken — please choose another");
        setChecking(false); return;
      }
    } catch(e) { /* proceed if check fails */ }
    setChecking(false);
    onNext({ username: username.trim().toLowerCase(), password: pass });
  };

  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <div style={{fontSize:48,textAlign:"center",marginBottom:12}}>🔐</div>
        <h2 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:6,textAlign:"center"}}>
          Create {childName}'s Account
        </h2>
        <p style={{fontSize:14,fontWeight:600,color:C.muted,lineHeight:1.7,marginBottom:24,textAlign:"center"}}>
          {childName} will use this username and password to log in to their own account.
        </p>
        {err&&<div style={{padding:"10px 14px",background:C.rLight,borderRadius:10,marginBottom:16,border:`1px solid ${C.red}`}}><p style={{fontSize:13,fontWeight:700,color:C.red}}>{err}</p></div>}
        <Card style={{marginBottom:12}}>
          <Lbl c="Username"/>
          <input value={username} onChange={e=>setUsername(e.target.value.replace(/\s/g,""))}
            placeholder="e.g. ella2015"
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:18,fontWeight:700,
              color:C.text,background:C.bg,outline:"none",
              border:`2px solid ${username?C.primary:C.border}`,transition:"border 0.2s"}}/>
          <p style={{fontSize:11,color:C.muted,fontWeight:600,marginTop:6}}>Letters and numbers only, no spaces</p>
        </Card>
        <Card style={{marginBottom:12}}>
          <Lbl c="Password"/>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password"
            placeholder="At least 6 characters"
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:18,fontWeight:700,
              color:C.text,background:C.bg,outline:"none",
              border:`2px solid ${pass?C.primary:C.border}`,transition:"border 0.2s"}}/>
        </Card>
        <Card style={{marginBottom:28}}>
          <Lbl c="Confirm Password"/>
          <input value={pass2} onChange={e=>setPass2(e.target.value)} type="password"
            placeholder="Repeat the password"
            onKeyDown={e=>e.key==="Enter"&&create()}
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:18,fontWeight:700,
              color:C.text,background:C.bg,outline:"none",
              border:`2px solid ${pass2?(pass2===pass?C.green:C.red):C.border}`,transition:"border 0.2s"}}/>
        </Card>
        <Btn onClick={create} disabled={checking} style={{width:"100%",fontSize:16}}>
          {checking?"Checking username...":"Create "+childName+"'s Account 🔐"}
        </Btn>
      </div>
    </Screen>
  );
}




// ── Year Group Advancement ────────────────────────────────────────────────
function YearGroupAdvancement({child, onSave, onBack}) {
  const country = child.country||"UK";
  const yearMap = YEAR[country]||YEAR.UK;
  const ages = Object.keys(yearMap).map(Number).sort((a,b)=>a-b);
  const currentAge = child.age||7;
  const nextAge = ages.find(a=>a>currentAge);
  const [selected, setSelected] = useState(currentAge);
  const [confirmed, setConfirmed] = useState(false);

  const yearOptions = ages.filter(a=>a>=4&&a<=11).map(a=>({
    age:a,
    year:yearMap[a],
    isCurrent:a===currentAge,
    isNext:a===nextAge,
  }));

  const save = () => {
    if(selected===currentAge) return;
    const newYearGroup = yearMap[selected]||child.yearGroup;
    onSave({age:selected, yearGroup:newYearGroup});
    setConfirmed(true);
  };

  if(confirmed) return (
    <Screen>
      <div style={{paddingTop:60,textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:16}}>🎓</div>
        <h2 style={{fontSize:24,fontWeight:900,color:C.text,marginBottom:8}}>Year Group Updated!</h2>
        <p style={{fontSize:14,color:C.muted,fontWeight:600,marginBottom:28,lineHeight:1.6}}>
          {child.name} has been moved to <strong>{yearMap[selected]}</strong>.<br/>
          Their learning will now be tailored to this year group.
        </p>
        <Btn onClick={onBack} style={{width:"100%"}}>Back to Controls</Btn>
      </div>
    </Screen>
  );

  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <h2 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:6}}>Advance Year Group</h2>
        <p style={{fontSize:13,color:C.muted,fontWeight:600,marginBottom:8,lineHeight:1.6}}>
          {child.name} is currently in <strong>{child.yearGroup}</strong>. Move them to the next year group when they are ready.
        </p>
        <div style={{padding:"10px 14px",background:C.aLight,borderRadius:10,marginBottom:20,border:`1px solid ${C.amber}`}}>
          <p style={{fontSize:12,fontWeight:700,color:"#92400E",lineHeight:1.6}}>
            ⚠️ Only advance when {child.name} has completed most topics in their current year group. Their question difficulty will increase.
          </p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
          {yearOptions.map(opt=>(
            <button key={opt.age} onClick={()=>setSelected(opt.age)}
              style={{padding:"14px 16px",borderRadius:14,border:`2px solid ${selected===opt.age?C.primary:C.border}`,
                background:selected===opt.age?C.pLight:C.surface,cursor:"pointer",fontFamily:F,
                display:"flex",alignItems:"center",justifyContent:"space-between",textAlign:"left"}}>
              <div>
                <p style={{fontSize:15,fontWeight:800,color:selected===opt.age?C.primary:C.text}}>{opt.year}</p>
                <p style={{fontSize:11,color:C.muted,fontWeight:600}}>Age {opt.age}</p>
              </div>
              <div style={{display:"flex",gap:6}}>
                {opt.isCurrent&&<span style={{fontSize:11,fontWeight:800,color:C.green,background:C.gLight,padding:"3px 8px",borderRadius:6}}>Current</span>}
                {opt.isNext&&<span style={{fontSize:11,fontWeight:800,color:C.primary,background:C.pLight,padding:"3px 8px",borderRadius:6}}>Next</span>}
              </div>
            </button>
          ))}
        </div>
        <Btn onClick={save} disabled={selected===currentAge} style={{width:"100%",fontSize:16}}>
          {selected===currentAge?"Select a different year group":"Move to "+yearMap[selected]+" →"}
        </Btn>
      </div>
    </Screen>
  );
}

// ── Edit Child Profile ────────────────────────────────────────────────────
function EditChildProfile({child, onSave, onBack}) {
  const [name, setName]     = useState(child.name||"");
  const [age, setAge]       = useState(child.age||7);
  const [country, setCountry] = useState(child.country||"UK");

  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <h2 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:20}}>Edit {child.name}'s Profile</h2>
        <Card style={{marginBottom:12}}>
          <Lbl c="Child's Name"/>
          <input value={name} onChange={e=>setName(e.target.value)}
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:16,fontWeight:700,color:C.text,background:C.bg,outline:"none",border:`2px solid ${name?C.primary:C.border}`}}/>
        </Card>
        <Card style={{marginBottom:12}}>
          <Lbl c="Age"/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[4,5,6,7,8,9,10,11].map(a=>(
              <button key={a} onClick={()=>setAge(a)}
                style={{padding:"10px 16px",borderRadius:10,border:`2px solid ${age===a?C.primary:C.border}`,background:age===a?C.pLight:C.surface,fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:F,color:age===a?C.primary:C.text}}>
                {a}
              </button>
            ))}
          </div>
        </Card>
        <Card style={{marginBottom:28}}>
          <Lbl c="Country"/>
          <div style={{display:"flex",gap:8}}>
            {["UK","US","CA"].map(c=>(
              <button key={c} onClick={()=>setCountry(c)}
                style={{flex:1,padding:"12px",borderRadius:10,border:`2px solid ${country===c?C.primary:C.border}`,background:country===c?C.pLight:C.surface,fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:F,color:country===c?C.primary:C.text}}>
                {c==="UK"?"🇬🇧 UK":c==="US"?"🇺🇸 US":"🇨🇦 CA"}
              </button>
            ))}
          </div>
        </Card>
        <Btn onClick={()=>onSave({name:name.trim(),age,country})} disabled={!name.trim()} style={{width:"100%"}}>
          Save Changes ✓
        </Btn>
      </div>
    </Screen>
  );
}



// ── Email Progress Report ─────────────────────────────────────────────────
function EmailProgressReport({child, parentEmail, onBack}) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [err, setErr]         = useState("");
  const [email, setEmail]     = useState(parentEmail||"");

  const sessions = child.sessionHistory||[];
  const acc = child.total>0?Math.round(child.correct/child.total*100):0;
  const thisWeek = sessions.slice(-7);
  const weekAcc = thisWeek.length>0?Math.round(thisWeek.reduce((a,s)=>a+s.acc,0)/thisWeek.length):0;
  const tLevels = child.topicLevels||{};
  const strengths = subjectsFor(child.country).map(s=>({s,lvl:child.level[s]||1})).sort((a,b)=>b.lvl-a.lvl).slice(0,3);
  const _rsubs=subjectsFor(child.country);
  const avgLevel = _rsubs.reduce((a,s)=>a+(child.level[s]||1),0)/_rsubs.length;

  const generateReport = async () => {
    if(!email) { setErr("Enter an email address"); return; }
    setLoading(true); setErr("");
    // Send through the real email endpoint (Resend via /api/send-report)
    try {
      const r = await fetch("/api/send-report",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({parentEmail:email,parentName:"",children:[child]})
      });
      if(r.ok){ setEmailed(true); setLoading(false); setSent(true); return; }
    } catch(e) { /* fall through to on-screen report */ }
    setEmailed(false);
    setLoading(false);
    setSent(true);
  };

  if(sent) return (
    <Screen>
      <div style={{paddingTop:20}}>
        <BackBtn onClick={onBack}/>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:48,marginBottom:12}}>📧</div>
          <h2 style={{fontSize:22,fontWeight:900,color:C.text,marginBottom:6}}>{emailed?"Report Sent! ✅":"Progress Report Ready"}</h2>
          <p style={{fontSize:13,color:C.muted,fontWeight:600,lineHeight:1.6}}>
            {emailed
              ? <>The full report is on its way to <strong>{email}</strong>. A summary is below.</>
              : <>Email sending isn't available right now — copy the report below and share it from <strong>{email}</strong>.</>}
          </p>
        </div>
        <Card style={{marginBottom:16}}>
          <p style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:12}}>📊 {child.name}'s Weekly Report</p>
          {[
            {l:"Questions answered",v:child.total+""},
            {l:"Overall accuracy",v:acc+"%"},
            {l:"This week's sessions",v:thisWeek.length+""},
            {l:"This week's accuracy",v:weekAcc+"%"},
            {l:"Current streak",v:child.streak+" days"},
            {l:"XP earned total",v:child.xp+""},
            {l:"Badges earned",v:(child.badges||[]).length+""},
            {l:"Best subject",v:strengths[0]?.s+" (Lv."+strengths[0]?.lvl+")"},
            {l:"Average level",v:avgLevel.toFixed(1)+"/21+"},
          ].map(r=>(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:13,fontWeight:600,color:C.muted}}>{r.l}</span>
              <span style={{fontSize:13,fontWeight:800,color:C.text}}>{r.v}</span>
            </div>
          ))}
        </Card>
        <div style={{padding:"14px 16px",background:C.pLight,borderRadius:12,marginBottom:16,border:`1px solid ${C.primary}20`}}>
          <p style={{fontSize:12,fontWeight:700,color:C.primary,lineHeight:1.6}}>
            {emailed
              ? <>💡 Includes {child.name}'s tricky-question wins ({child.trickyFixedCount||0} conquered so far) — the questions ADAPT is practising with them until mastered.</>
              : <>💡 Tip: email delivery needs the RESEND_API_KEY environment variable set in Vercel.</>}
          </p>
        </div>
        <Btn onClick={()=>{
          const text = `${child.name}'s ADAPT Progress Report

` +
            `Questions: ${child.total} | Accuracy: ${acc}% | Streak: ${child.streak} days
` +
            `This week: ${thisWeek.length} sessions, ${weekAcc}% accuracy
` +
            `XP: ${child.xp} | Badges: ${(child.badges||[]).length}
` +
            `Best subject: ${strengths[0]?.s} (Level ${strengths[0]?.lvl})

` +
            `Generated by ADAPT Learning`;
          if(navigator.share) navigator.share({title:"ADAPT Progress Report",text});
          else {navigator.clipboard?.writeText(text);alert("Copied to clipboard!");}
        }} style={{width:"100%",marginBottom:10}}>📤 Share Report</Btn>
        <Btn onClick={onBack} v="ghost" style={{width:"100%"}}>Back</Btn>
      </div>
    </Screen>
  );

  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:48,marginBottom:12}}>📧</div>
          <h2 style={{fontSize:24,fontWeight:900,color:C.text,marginBottom:6}}>Progress Report</h2>
          <p style={{fontSize:13,color:C.muted,fontWeight:600,lineHeight:1.6}}>
            Generate a summary of {child.name}'s learning progress to share with family or teachers.
          </p>
        </div>
        {err&&<div style={{padding:"10px 14px",background:C.rLight,borderRadius:10,marginBottom:16}}><p style={{fontSize:13,fontWeight:700,color:C.red}}>{err}</p></div>}
        
        {/* Quick stats preview */}
        <Card style={{marginBottom:16}}>
          <p style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:12}}>Report will include:</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[
              {e:"📝",l:"Questions",v:child.total},
              {e:"🎯",l:"Accuracy",v:acc+"%"},
              {e:"🔥",l:"Streak",v:child.streak+" days"},
              {e:"⭐",l:"XP",v:child.xp},
              {e:"📅",l:"Sessions this week",v:thisWeek.length},
              {e:"🏅",l:"Badges",v:(child.badges||[]).length},
            ].map(s=>(
              <div key={s.l} style={{padding:"10px 12px",background:C.bg,borderRadius:10,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18}}>{s.e}</span>
                <div>
                  <p style={{fontSize:13,fontWeight:900,color:C.text}}>{s.v}</p>
                  <p style={{fontSize:10,color:C.muted,fontWeight:700}}>{s.l}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{marginBottom:24}}>
          <Lbl c="Your email (optional)"/>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email"
            placeholder="your@email.com"
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:15,fontWeight:700,color:C.text,background:C.bg,outline:"none",border:`2px solid ${email?C.primary:C.border}`}}/>
          <p style={{fontSize:11,color:C.muted,marginTop:6,fontWeight:600}}>Full email delivery coming soon — for now we'll generate a report you can share.</p>
        </Card>

        <Btn onClick={generateReport} disabled={loading} style={{width:"100%",fontSize:16}}>
          {loading?"Generating report...":"📊 Generate Report"}
        </Btn>
      </div>
    </Screen>
  );
}

// ── Parent Change Password Screen ────────────────────────────────────────
function ChangeParentPassword({onBack}) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const [done, setDone]       = useState(false);

  const save = async () => {
    if(!newPass) { setErr("Enter a new password"); return; }
    if(newPass.length < 6) { setErr("Password must be at least 6 characters"); return; }
    if(newPass !== confirm) { setErr("Passwords don't match"); return; }
    setLoading(true); setErr("");
    try {
      const session = JSON.parse(localStorage.getItem("adapt_session")||"{}");
      const r = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${session.access_token||""}`
        },
        body: JSON.stringify({ password: newPass })
      });
      const data = await r.json();
      if(r.ok) setDone(true);
      else setErr(data.msg || data.error_description || "Failed to update password");
    } catch(e) {
      setErr("Connection failed — please try again");
    }
    setLoading(false);
  };

  if(done) return (
    <Screen>
      <div style={{paddingTop:60,textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:16}}>✅</div>
        <h2 style={{fontSize:24,fontWeight:900,color:C.text,marginBottom:8}}>Password Updated!</h2>
        <p style={{fontSize:14,color:C.muted,fontWeight:600,marginBottom:28}}>Your new password is now active.</p>
        <Btn onClick={onBack} style={{width:"100%"}}>Back to Settings</Btn>
      </div>
    </Screen>
  );

  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <h2 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:6}}>Change Password</h2>
        <p style={{fontSize:13,color:C.muted,fontWeight:600,marginBottom:24}}>Update your parent account password.</p>
        {err&&<div style={{padding:"10px 14px",background:C.rLight,borderRadius:10,marginBottom:16,border:`1px solid ${C.red}`}}><p style={{fontSize:13,fontWeight:700,color:C.red}}>{err}</p></div>}
        <Card style={{marginBottom:12}}>
          <Lbl c="New Password"/>
          <input value={newPass} onChange={e=>setNewPass(e.target.value)} type="password"
            placeholder="At least 6 characters"
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:16,fontWeight:700,color:C.text,background:C.bg,outline:"none",border:`2px solid ${newPass?C.primary:C.border}`}}/>
        </Card>
        <Card style={{marginBottom:28}}>
          <Lbl c="Confirm New Password"/>
          <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password"
            placeholder="Repeat your new password"
            onKeyDown={e=>e.key==="Enter"&&save()}
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:16,fontWeight:700,color:C.text,background:C.bg,outline:"none",border:`2px solid ${confirm?(confirm===newPass?C.green:C.red):C.border}`}}/>
        </Card>
        <Btn onClick={save} disabled={loading||!newPass||!confirm} style={{width:"100%",fontSize:16}}>
          {loading?"Updating...":"Update Password"}
        </Btn>
      </div>
    </Screen>
  );
}


// ── Child Avatar Picker ───────────────────────────────────────────────────
function ChildAvatarPicker({child, onSave, onBack}) {
  const AVATARS=[
    {id:"fox",e:"🦊"},{id:"bear",e:"🐻"},{id:"cat",e:"🐱"},{id:"dog",e:"🐶"},
    {id:"rabbit",e:"🐰"},{id:"penguin",e:"🐧"},{id:"owl",e:"🦉"},{id:"lion",e:"🦁"},
    {id:"tiger",e:"🐯"},{id:"panda",e:"🐼"},{id:"frog",e:"🐸"},{id:"duck",e:"🐥"},
    {id:"unicorn",e:"🦄"},{id:"dragon",e:"🐲"},{id:"monkey",e:"🐵"},{id:"koala",e:"🐨"},
    {id:"wolf",e:"🐺"},{id:"horse",e:"🐴"},{id:"elephant",e:"🐘"},{id:"dinosaur",e:"🦕"},
  ];
  const [selected,setSelected]=useState(child.avatar||"fox");
  return(
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:72,marginBottom:8}}>{AVATARS.find(a=>a.id===selected)?.e||"🦊"}</div>
          <h2 style={{fontSize:24,fontWeight:900,color:C.text,marginBottom:4}}>Choose Your Avatar</h2>
          <p style={{fontSize:13,color:C.muted,fontWeight:600}}>Pick the one that looks most like you!</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
          {AVATARS.map(a=>(
            <button key={a.id} onClick={()=>setSelected(a.id)}
              style={{height:70,borderRadius:16,fontSize:36,border:`3px solid ${selected===a.id?C.primary:C.border}`,
                background:selected===a.id?C.pLight:"#fff",cursor:"pointer",transition:"all 0.15s",
                boxShadow:selected===a.id?`0 4px 16px ${C.primary}40`:"0 2px 8px rgba(0,0,0,0.05)"}}>
              {a.e}
            </button>
          ))}
        </div>
        <Btn onClick={()=>onSave({avatar:selected})} style={{width:"100%",fontSize:16}}>
          Save Avatar ✓
        </Btn>
      </div>
    </Screen>
  );
}

// ── Reset Child Password ──────────────────────────────────────────────────
function ResetChildPassword({child, onSave, onBack}) {
  const [pass, setPass]   = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr]     = useState("");
  const [done, setDone]   = useState(false);

  const save = async () => {
    if(pass.length < 6) { setErr("Password must be at least 6 characters"); return; }
    if(pass !== pass2)  { setErr("Passwords don't match"); return; }
    setErr("");
    onSave(pass);
    setDone(true);
  };

  if(done) return (
    <Screen>
      <div style={{paddingTop:60,textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:16}}>✅</div>
        <h2 style={{fontSize:24,fontWeight:900,color:C.text,marginBottom:8}}>Password Updated!</h2>
        <p style={{fontSize:14,color:C.muted,fontWeight:600,marginBottom:28}}>Tell {child.name} their new password.</p>
        <Btn onClick={onBack} style={{width:"100%"}}>Back to Controls</Btn>
      </div>
    </Screen>
  );

  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <h2 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:6}}>Reset {child.name}'s Password</h2>
        <p style={{fontSize:13,color:C.muted,fontWeight:600,marginBottom:20,lineHeight:1.6}}>
          Username: <strong>{child.childUsername||"Not set"}</strong>
        </p>
        {err&&<div style={{padding:"10px 14px",background:C.rLight,borderRadius:10,marginBottom:16,border:`1px solid ${C.red}`}}><p style={{fontSize:13,fontWeight:700,color:C.red}}>{err}</p></div>}
        <Card style={{marginBottom:12}}>
          <Lbl c="New Password"/>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password"
            placeholder="At least 6 characters"
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:18,fontWeight:700,color:C.text,background:C.bg,outline:"none",border:`2px solid ${pass?C.primary:C.border}`}}/>
        </Card>
        <Card style={{marginBottom:24}}>
          <Lbl c="Confirm New Password"/>
          <input value={pass2} onChange={e=>setPass2(e.target.value)} type="password"
            placeholder="Repeat the password"
            onKeyDown={e=>e.key==="Enter"&&save()}
            style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:18,fontWeight:700,color:C.text,background:C.bg,outline:"none",border:`2px solid ${pass2?(pass2===pass?C.green:C.red):C.border}`}}/>
        </Card>
        <Btn onClick={save} disabled={!pass||!pass2} style={{width:"100%"}}>Save New Password</Btn>
      </div>
    </Screen>
  );
}

// ── Setup Accessibility Screen ───────────────────────────────────────────
function SetupAccessibility({childName, initial, onNext, onBack}) {
  const [acc, setAcc] = useState({...(initial||{})});
  const toggle = (id) => setAcc(prev => ({...prev, [id]: !prev[id]}));
  const active = Object.values(acc).filter(Boolean).length;
  const categories = ["Neurological","Learning","Attention","Anxiety"];
  return (
    <Screen>
      <div style={{paddingTop:28}}>
        <BackBtn onClick={onBack}/>
        <Lbl c="Additional Needs (Optional)"/>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:8}}>
          Does {childName} have any additional needs?
        </h2>
        <p style={{fontSize:14,fontWeight:600,color:C.muted,lineHeight:1.7,marginBottom:6}}>
          This helps ADAPT work best for {childName} from their very first question. Everything can be changed later in parental controls.
        </p>
        {active>0&&(
          <div style={{marginBottom:14,padding:"8px 14px",background:C.gLight,borderRadius:10,border:`1px solid ${C.green}`}}>
            <p style={{fontSize:13,fontWeight:800,color:C.gDark}}>✓ {active} adjustment{active!==1?"s":""} selected</p>
          </div>
        )}
        {categories.map(cat=>{
          const items=A11Y_CONDITIONS.filter(c=>c.category===cat);
          return (
            <div key={cat} style={{marginBottom:18}}>
              <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>{cat}</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {items.map(cond=>{
                  const on=acc[cond.id]||false;
                  return (
                    <button key={cond.id} onClick={()=>toggle(cond.id)}
                      style={{padding:"12px 14px",borderRadius:14,border:`2px solid ${on?C.primary:C.border}`,
                        background:on?C.pLight:C.surface,cursor:"pointer",fontFamily:F,
                        display:"flex",alignItems:"center",gap:12,textAlign:"left",
                        transition:"all 0.15s"}}>
                      <span style={{fontSize:24,flexShrink:0}}>{cond.emoji}</span>
                      <div style={{flex:1}}>
                        <p style={{fontSize:14,fontWeight:800,color:on?C.primary:C.text,marginBottom:1}}>{cond.label}</p>
                        <p style={{fontSize:11,fontWeight:600,color:C.muted,lineHeight:1.4}}>{cond.desc}</p>
                      </div>
                      <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
                        background:on?C.primary:C.border,display:"flex",alignItems:"center",
                        justifyContent:"center",transition:"all 0.15s"}}>
                        {on&&<span style={{color:"#fff",fontSize:11,fontWeight:900}}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div style={{padding:"12px 14px",background:C.aLight,borderRadius:12,border:`1px solid ${C.amber}30`,marginBottom:24}}>
          <p style={{fontSize:12,fontWeight:700,color:"#92400E",lineHeight:1.6}}>
            💛 These settings guide ADAPT but are not a medical tool. Always consult your child's doctor or SENCO for professional advice.
          </p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Btn onClick={()=>onNext(acc)} style={{width:"100%",fontSize:16}}>
            {active>0?`Save ${active} adjustment${active!==1?"s":""} & continue →`:"Continue →"}
          </Btn>
          <Btn onClick={()=>onNext({})} v="ghost" style={{width:"100%"}}>
            ⏭️ Skip — no additional needs
          </Btn>
        </div>
      </div>
    </Screen>
  );
}

// ── Ready to Start Screen ─────────────────────────────────────────────────
function ReadyToStart({child, onStart}) {
  const t = TUTORS[child.tutor];
  const a11y = useA11y(child);
  return (
    <Screen>
      <div style={{paddingTop:60,textAlign:"center"}}>
        <TutorChar name={child.tutor} size={80} noAnim={a11y.noMotion}/>
        <h2 style={{fontSize:28,fontWeight:900,color:C.text,marginTop:16,marginBottom:8}}>
          Hi {child.name}! 👋
        </h2>
        <p style={{fontSize:16,fontWeight:700,color:C.muted,marginBottom:28,lineHeight:1.7}}>
          {a11y.noTimers
            ? `Before we start, I'll ask you ${subjectsFor(child.country).length*3} quick questions to find your starting level. Take your time — there's no rush!`
            : `Before we start, let's do a quick warm-up! Just ${subjectsFor(child.country).length*3} questions to find the best starting point for you.`}
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {[
            {e:"🎯",t:"Personalised for you",d:"Questions match your exact level"},
            {e:"😊",t:"No pressure",d:a11y.noTimers?"Take as long as you need":"Just try your best — there are no wrong answers"},
            {e:"⚡",t:"Quick warm-up",d:`Only ${subjectsFor(child.country).length*3} questions, then you're in!`},
          ].map(item=>(
            <div key={item.t} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:C.surface,borderRadius:14,border:`1px solid ${C.border}`,textAlign:"left"}}>
              <span style={{fontSize:24,flexShrink:0}}>{item.e}</span>
              <div>
                <p style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:2}}>{item.t}</p>
                <p style={{fontSize:12,fontWeight:600,color:C.muted}}>{item.d}</p>
              </div>
            </div>
          ))}
        </div>
        <Btn onClick={onStart} style={{width:"100%",padding:18,fontSize:18}}>
          Let's go! {t?.emoji}
        </Btn>
      </div>
    </Screen>
  );
}

// ═════════════════════════════════════════════════════════════════
// MAIN APP — State Machine
// ═════════════════════════════════════════════════════════════════
const BLANK = {name:"",age:7,country:"UK",yearGroup:"",avatar:"fox",tutor:null,mode:null,
  level:{
    // UK subjects
    Maths:1,English:1,Science:1,History:1,Geography:1,Computing:1,
    // US subjects
    "Math":1,"English Language Arts":1,"Social Studies":1,
    // CA subjects  
    "Mathematics":1,"Language":1,"Science & Technology":1,"Social Studies":1,"Computer Studies":1
  },
  topicLevels:{
    Maths:{addition:1,multiplication:1,fractions:1,placevalue:1,geometry:1,measurement:1,statistics:1,ratio:1,algebra:1},
    English:{phonics:1,grammar:1,comprehension:1,vocabulary:1,poetry:1,media:1},
    Science:{living:1,forces:1,materials:1,earth:1,body:1,light:1,electricity:1,rocks:1},
    History:{ancient:1,british:1,modern:1,chronology:1},
    Geography:{uk_geo:1,world_geo:1,physical:1,human:1,maps:1},
    Computing:{algorithms:1,coding:1,data:1,esafety:1,networks:1},
  },
  topicQCounts:{}, // {subject_topicId: count} tracks questions per topic per level
  topicTestResults:{}, // {subject_topicId_level: pass|fail}
  xp:0,streak:0,total:0,correct:0,badges:[],sessionHistory:[],subsTried:[],bestStreak:0,gamesPlayed:0,gamesBeat:0,controls:{}};

export default function App() {
  const [screen,   setScr]  = useState("auth_login");
  const [account,  setAcct] = useState(null);
  const [children, setKids] = useState([]);
  const [active,   setAct]  = useState(null);
  const [manage,   setMgr]  = useState(null);
  const [setup,    setSetup]= useState({...BLANK});
  const [userType, setType] = useState(null);
  const [sessSub,  setSub]  = useState(null);
  const [sessTopic,setTopic] = useState(null);
  const [gameId,   setGameId]= useState(null);
  const [newBadge, setNB]   = useState(null);
  const [loaded,   setLd]   = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [signUpType, setSignUpType] = useState(null);
  const hist = useRef(["loading"]);

  // ── Auth state listener ────────────────────────────────────────
  useEffect(()=>{
    // Show login immediately — don't wait for Supabase
    setLd(true);
    go("auth_login");

    const fallback = setTimeout(()=>{
      setLd(true);
      go("auth_login");
    }, 300);

    let subscription = null;
    try {
      const result = supabase.auth.onAuthStateChange(async (event, session) => {
        clearTimeout(fallback);
        const user = session?.user || null;
        setAuthUser(user);
        if(user) {
          try {
            const d = await loadData(user.id);
            if(d?.account){
              // Fix: ensure name is never just first letter
              const acct = {...d.account};
              if(!acct.name||acct.name.length<=2) {
                acct.name = user.user_metadata?.name||user.email?.split("@")[0]||"User";
              }
              setAcct(acct);
              setKids(d.children||[]);
              if((d.children||[]).length>0){
                if(acct.type==="parent") go("parent_dash");
                else {setAct(d.children[0]);go("child_dash");}
              } else {
                go("welcome");
              }
            } else {
              // Parent logged in but no children yet — go straight to setup
              setType("parent");
              go("parent_name");
            }
          } catch(e) {
            console.error("loadData error:", e);
            go("welcome");
          }
        } else {
          go("auth_login");
        }
        setLd(true);
      });
      subscription = result.data?.subscription;
    } catch(e) {
      console.error("Supabase auth error:", e);
      clearTimeout(fallback);
      setLd(true);
      go("auth_login");
    }
    return () => { clearTimeout(fallback); subscription?.unsubscribe(); };
  }, []);

  // ── Save data when children/account changes ────────────────────
  useEffect(()=>{
    if(loaded && account && authUser){
      saveData(authUser.id, {account, children});
    } else if(loaded && account && !authUser && account._parentId) {
      // Child is logged in — save progress to parent's account
      // Load parent data, update child, save back
      loadData(account._parentId).then(parentData => {
        if(parentData) {
          const updatedChildren = (parentData.children||[]).map(c => {
            const localChild = children.find(lc => lc.id === c.id);
            return localChild || c;
          });
          saveData(account._parentId, {...parentData, children: updatedChildren});
        }
      });
    }
  },[children, account, loaded]);

  const go=(s)=>{hist.current=[...hist.current,s];setScr(s);};
  const back=()=>{
    if(hist.current.length>1){const h=[...hist.current];h.pop();hist.current=h;setScr(h[h.length-1]);}
  };

  const saveTimer=useRef(null);
  const updChild=(id,u,forceSave=false)=>{
    setKids(cs=>{
      const updated=cs.map(c=>c.id===id?{...c,...u}:c);
      // Debounced save — persist to Supabase after 2s of no updates
      // Force save immediately for critical updates (level changes, test results)
      const doSave=()=>{
        const uid=authUser?.id||account?._parentId;
        if(uid){
          setKids(cur=>{
            saveData(uid,{account,children:cur});
            return cur;
          });
        }
      };
      if(forceSave){
        clearTimeout(saveTimer.current);
        doSave();
      } else {
        clearTimeout(saveTimer.current);
        saveTimer.current=setTimeout(doSave,2000);
      }
      return updated;
    });
    if(active?.id===id) setAct(c=>({...c,...u}));
    if(manage?.id===id) setMgr(c=>({...c,...u}));
    if(u._newBadge){setNB(u._newBadge);setTimeout(()=>setNB(null),3500);}
  };

  const addChild=async(child)=>{
    const c={...BLANK,...child,id:uid()};
    setKids(cs=>[...cs,c]);
    // Save child credentials to child_accounts table
    if(authUser&&child.childUsername&&child.childPassword){
      const hash = await hashPassword(child.childPassword);
      await supabase.from("child_accounts").upsert({
        parent_id: authUser.id,
        child_id: c.id,
        username: child.childUsername,
        password_hash: hash,
        child_name: child.name,
      });
    }
    return c;
  };

  // Trial expiry check
  const trialExpired = account?.subscription==="trial" && account?.trialStart && account.trialStart!==null &&
    (Date.now() - account.trialStart) > 7 * 24 * 60 * 60 * 1000;
  const daysLeftInTrial = account?.trialStart ?
    Math.max(0, 7 - Math.floor((Date.now() - account.trialStart) / (24*60*60*1000))) : 7;

  const activeChild = active || children[0];
  const appA11y = useA11y(activeChild);

  // ── ROUTING ───────────────────────────────────────────────────────────
  return (
    <A11yContext.Provider value={appA11y}>
      <A11ySync a11y={appA11y}/>
      {newBadge&&<BadgeNotif badgeId={newBadge} onDone={()=>setNB(null)}/>}
      <TrialBanner daysLeft={daysLeftInTrial} expired={trialExpired}/>

      {screen==="auth_login"&&<AuthLoginChoice
        onParent={()=>go("auth_parent_login")}
        onChild={()=>go("auth_child_login")}
      />}
      {screen==="auth_parent_login"&&<AuthLogin
        onLogin={()=>{}}
        onSignUp={()=>go("auth_signup")}
        onBack={()=>go("auth_login")}
      />}
      {screen==="auth_child_login"&&<ChildUsernameLogin
        onBack={()=>go("auth_login")}
        onParentLogin={()=>go("auth_parent_login")}
        onLogin={async(payload, childId, parentId)=>{
          setAcct({...payload.account, _parentId: parentId});
          setKids(payload.children||[]);
          const child=(payload.children||[]).find(c=>c.id===childId);
          if(child){
            setAct(child);
            // Diagnostic only runs ONCE - check _diagDone flag
            // Once done, never runs again even if total is 0
            if(!child._diagDone) go("child_first_login");
            else go("child_dash");
          } else go("auth_login");
        }}
      />}
      {screen==="auth_signup"&&<AuthSignUp
        accountType={signUpType||"parent"}
        onBack={()=>go("auth_parent_login")}
      />}

      {screen==="welcome"&&<Welcome
        onParent={()=>{setType("parent");if(authUser)go("parent_name");else go("auth_signup");}}
      />}
      {screen==="child_login"&&<ChildLogin
        children={children}
        onSelect={c=>{setMgr(c);go("child_progress");}}
        onParent={()=>go("auth_parent_login")}
      />}

      {screen==="parent_name"&&<ParentName onBack={back} onNext={name=>{setAcct({type:"parent",name,createdAt:Date.now()});setSetup({...BLANK});go("details");}}/>}

      {/* Student signup disabled — children get accounts from parents only */}

      {screen==="details"&&<ChildDetails isParent={userType==="parent"} initial={setup} onBack={back} onNext={d=>{setSetup(s=>({...s,...d}));go("avatar");}}/>}

      {screen==="avatar"&&<AvatarPick childName={setup.name} initial={setup.avatar} onBack={back} onNext={av=>{setSetup(s=>({...s,avatar:av}));go("mode");}}/>}

      {screen==="mode"&&<ModeSelect childName={setup.name} age={setup.age} initial={setup.mode} onBack={back} onNext={m=>{setSetup(s=>({...s,mode:m}));go("character");}}/>}

      {screen==="character"&&<CharSelect childName={setup.name} initial={setup.tutor} onBack={back} onNext={t=>{
        const fin={...setup,tutor:t};
        setSetup(fin);
        if(!account) {
          const type = userType||"student";
          const name = fin.name||authUser?.user_metadata?.name||"Learner";
          setAcct({type, name, createdAt:Date.now(), trialStart:Date.now(), subscription:"trial"});
          if(authUser) {
            supabase.from("profiles").upsert({id:authUser.id, type, name}).then(()=>{});
          }
        }
        go("setup_a11y");
      }}/>}

      {screen==="setup_a11y"&&<SetupAccessibility
        childName={setup.name}
        initial={setup.accessibility||{}}
        onBack={back}
        onNext={acc=>{
          setSetup(s=>({...s,accessibility:acc}));
          go("create_child_account");
        }}
      />}

      {screen==="create_child_account"&&<CreateChildAccount
        childName={setup.name}
        onBack={back}
        onNext={async creds=>{
          const updatedSetup={...setup,childUsername:creds.username,childPassword:creds.password};
          setSetup(updatedSetup);
          if(userType==="parent"||account?.type==="parent"){
            // Parent flow: add child with default levels, skip diagnostic
            const c = await addChild({...updatedSetup});
            const cWithCreds={...c,childUsername:creds.username,childPassword:creds.password};
            setAct(cWithCreds);
            const newKids = [...children.filter(k=>k.id!==c.id), cWithCreds];
            setKids(newKids);
            // Explicitly save to Supabase immediately so child can log in
            if(authUser) {
              await saveData(authUser.id, {account, children: newKids});
            }
            // Skip accessibility setup for additional children (already set at account level)
            const isAdditionalChild=(children||[]).length>0;
            if(isAdditionalChild) go("child_handoff");
            else go("child_handoff");
          } else {
            go("ready_to_start");
          }
        }}
      />}



      {screen==="ready_to_start"&&<ReadyToStart
        child={setup}
        onStart={()=>go("diagnostic")}
      />}



      {screen==="diagnostic"&&<Diagnostic child={setup} onDone={async levels=>{
        const c=await addChild({...setup,level:levels});
        // Ensure credentials available for handoff
        const cWithCreds={...c,childUsername:setup.childUsername,childPassword:setup.childPassword};
        setAct(cWithCreds);
        setKids(prev=>prev.map(k=>k.id===c.id?cWithCreds:k));
        if(userType==="parent"||account?.type==="parent") {
          go("child_handoff");
        }
        else go("child_dash");
      }}/>}

      {screen==="child_first_login"&&activeChild&&!activeChild.total&&(
        // Child logs in for first time - do diagnostic on their account
        <Diagnostic child={activeChild} onDone={levels=>{
          const nl={...activeChild.level,...levels};
          const diagUpdate={level:nl,_diagDone:true,_diagDate:new Date().toISOString()};
          updChild(activeChild.id,diagUpdate);
          // Save immediately so it persists even if main save fails
          if(account?._parentId){
            saveData(account._parentId,{account,children:children.map(c=>c.id===activeChild.id?{...c,...diagUpdate}:c)});
          }
          go("child_dash");
        }}/>
      )}

      {screen==="child_handoff"&&active&&<ChildHandoff
        child={active}
        onSignOut={async()=>{
          // Clear plain text password before signing out
          updChild(active.id,{childPassword:null});
          await supabase.auth.signOut();
          setAcct(null);setKids([]);setAct(null);
          hist.current=["auth_login"];setScr("auth_login");
        }}
        onDashboard={()=>{
          // Clear plain text password when going to dashboard
          updChild(active.id,{childPassword:null});
          go("parent_dash");
        }}
      />}

      {screen==="child_avatar"&&activeChild&&<ChildAvatarPicker
        child={activeChild}
        onBack={()=>go("child_dash")}
        onSave={(updates)=>{updChild(activeChild.id,updates);setAct(c=>({...c,...updates}));go("child_dash");}}
      />}
      {screen==="child_dash"&&activeChild&&<ChildDash
        child={activeChild}
        isParentView={account?.type==="parent"&&!!authUser}
        onSession={sub=>{setSub(sub);go("topic_pick");}}
        onGames={()=>{
          if(activeChild.controls?.miniGames===false){alert("Mini games are turned off by your parent.");return;}
          go("game_hub");
        }}
        onBadges={()=>go("badges")}
        onMyStats={()=>go("child_stats")}
        onSignOut={async()=>{await supabase.auth.signOut();setAcct(null);setKids([]);setAct(null);hist.current=["auth_login"];setScr("auth_login");}}
        onParentView={()=>go("parent_dash")}
      />}

      {screen==="game_hub"&&activeChild&&<GameHub
        child={activeChild}
        onPlay={id=>{setGameId(id);go("game_play");}}
        onBack={back}
        onHome={()=>go("child_dash")}
      />}

      {screen==="game_play"&&activeChild&&gameId&&<GamePlayer
        child={activeChild}
        gameId={gameId}
        mode={activeChild.controls?.modeLock||activeChild.mode}
        onComplete={(stats)=>{
          const s=typeof stats==="object"?stats:{score:stats,xp:0};
          const gp=(activeChild.gamesPlayed||0)+1;
          const gb=(s.score||0)>0?(activeChild.gamesBeat||0)+1:(activeChild.gamesBeat||0);
          const xpEarned=s.xp||s.xpEarned||0;
          // Save high score for this game
          const prevHighScores=activeChild.gameHighScores||{};
          const prevBest=prevHighScores[gameId]||0;
          const newHighScores=s.score>prevBest?{...prevHighScores,[gameId]:s.score}:prevHighScores;
          const updated={xp:(activeChild.xp||0)+xpEarned,gamesPlayed:gp,gamesBeat:gb,gameHighScores:newHighScores};
          // Tricky Ones deck: remove questions the child beat in review, add new misses
          let deck=activeChild.trickyQs||[];
          if(s.fixedQs?.length){const before=deck.length;deck=deck.filter(t=>!s.fixedQs.includes(t.q));updated.trickyFixedCount=(activeChild.trickyFixedCount||0)+(before-deck.length);}
          if(s.missedQs?.length){
            const existing=new Set(deck.map(t=>t.q));
            deck=[...deck,...s.missedQs.filter(m=>m?.q&&!existing.has(m.q))].slice(-30);
          }
          updated.trickyQs=deck;
          // Daily quest progress (+chest bonus when all three complete)
          const qp=applyQuestProgress(activeChild,{answered:s.total||0,correct:s.correct||s.score||0,activities:1});
          updated.quests=qp.quests;
          if(qp.bonusXP)updated.xp+=qp.bonusXP;
          // Content audit: flagged questions go to the parent's review list
          if(s.flaggedQs?.length){
            const ex=new Set((activeChild.flaggedQs||[]).map(f=>f.q));
            updated.flaggedQs=[...(activeChild.flaggedQs||[]),...s.flaggedQs.filter(f=>!ex.has(f.q))].slice(-40);
          }
          // Frictionless replay: remember the last three games
          if(gameId&&gameId!=="trickyReview")updated.recentGames=[gameId,...(activeChild.recentGames||[]).filter(x=>x!==gameId)].slice(0,3);
          // Games count toward the day streak too — learning is learning
          const gsk=computeDayStreak(activeChild);
          updated.streak=gsk.streak;
          if(gsk.shieldUsedAt)updated.shieldUsedAt=gsk.shieldUsedAt;
          updated._shieldSaved=gsk.shieldSaved||null;
          updated.sessionHistory=[...(activeChild.sessionHistory||[]),{acc:s.total>0?Math.round((s.correct||s.score||0)/s.total*100):0,date:new Date().toISOString(),xp:s.xp||0,game:true}].slice(-30);
          updated.buddyStageSeen=buddyStage(buddyPoints(activeChild)).idx; // pre-update stage: banner shows until next activity
          if(s._gameLevelSync){const lvls={...(activeChild.level||{})};let up=false;Object.entries(s._gameLevelSync).forEach(([subj,lvl])=>{if(lvl>(lvls[subj]||1)){lvls[subj]=Math.min(10,lvl);up=true;}});if(up)Object.assign(updated,{level:lvls,_levelUp:true});}
          else if(s.levelReached&&s.levelUpSubject){const lvls={...(activeChild.level||{})};const cur=lvls[s.levelUpSubject]||1;if(s.levelReached>cur){lvls[s.levelUpSubject]=Math.min(10,s.levelReached);Object.assign(updated,{level:lvls,_levelUp:true});}}
          const {badges,newBadge}=checkBadges({...activeChild,...updated});
          updChild(activeChild.id,{...updated,badges,_newBadge:newBadge});
          go("game_hub");
        }}
        onQuit={()=>go("game_hub")}
      />}

      {screen==="topic_pick"&&activeChild&&sessSub&&<TopicPicker
        child={activeChild}
        subject={sessSub}
        onBack={()=>go("child_dash")}
        onLearn={topic=>{setTopic(topic);go("learn_mode");}}
        onStart={topic=>{setTopic(topic);go("session");}}
        onSignOut={async()=>{await supabase.auth.signOut();setAcct(null);setKids([]);setAct(null);hist.current=["auth_login"];setScr("auth_login");}}
      />}

      {screen==="learn_mode"&&activeChild&&sessTopic&&<LearnMode
        child={activeChild}
        subject={sessSub}
        topic={sessTopic}
        onBack={()=>go("topic_pick")}
        onDone={()=>go("session")}
      />}
      {screen==="session"&&activeChild&&<Session
        child={activeChild}
        a11y={appA11y}
        startSubject={sessSub}
        onComplete={stats=>{
          // Tricky Ones deck: add this session's misses
          let deck=activeChild.trickyQs||[];
          if(stats.missedQs?.length){
            const existing=new Set(deck.map(t=>t.q));
            deck=[...deck,...stats.missedQs.filter(m=>m?.q&&!existing.has(m.q))].slice(-30);
          }
          // Daily quest progress (+chest bonus)
          const qp=applyQuestProgress(activeChild,{answered:stats.total||0,correct:stats.correct||0,activities:1});
          const questXP=qp.bonusXP||0;
          // Sync game level to subject if earned
          if(stats.levelUpSubject&&stats.levelUpTo){
            const newLevel={...activeChild.level,[stats.levelUpSubject]:Math.max(activeChild.level?.[stats.levelUpSubject]||1,stats.levelUpTo)};
            updChild(activeChild.id,{level:newLevel,xp:(activeChild.xp||0)+(stats.xp||0)+questXP,gamesPlayed:(activeChild.gamesPlayed||0)+1,trickyQs:deck,quests:qp.quests});
          } else {
            updChild(activeChild.id,{xp:(activeChild.xp||0)+(stats.xp||0)+questXP,gamesPlayed:(activeChild.gamesPlayed||0)+1,trickyQs:deck,quests:qp.quests});
          }
          const session={acc:stats.total>0?Math.round(stats.correct/stats.total*100):0,date:new Date().toISOString(),xp:stats.xp};
          const sk=computeDayStreak(activeChild);
          const newXP = activeChild.xp + stats.xp;
          const milestones = [100,250,500,1000,2500,5000];
          const hitMilestone = milestones.find(m => activeChild.xp < m && newXP >= m);
          updChild(activeChild.id,{
            streak:sk.streak,
            ...(sk.shieldUsedAt?{shieldUsedAt:sk.shieldUsedAt}:{}),
            _shieldSaved:sk.shieldSaved||null,
            sessionHistory:[...(activeChild.sessionHistory||[]),session].slice(-30),
            _xpMilestone: hitMilestone||null,
            buddyStageSeen:buddyStage(buddyPoints(activeChild)).idx
          });
          go("child_dash");
        }}
        onUpdate={(u,forceSave)=>updChild(activeChild.id,u,forceSave)}
        onExit={()=>go("child_dash")}
      />}

      {screen==="change_password"&&<ChangeParentPassword onBack={back}/>}
      {screen==="privacy_policy"&&<PrivacyPolicy onBack={back}/>}
      {screen==="terms_of_service"&&<TermsOfService onBack={back}/>}
      {screen==="child_stats"&&activeChild&&<ChildStats child={activeChild} onBack={back}/>}
      {screen==="badges"&&activeChild&&<BadgesScreen child={activeChild} onBack={back}/>}

      {screen==="parent_dash"&&<ParentDash
        account={account}
        children={children}
        onBack={()=>go("child_login")}
        onProgressChild={c=>{setMgr(c);go("child_progress");}}
        onAddChild={()=>{
          if(children.length>=6){
            alert("You've reached the maximum of 6 children on one account. This covers our Family Plan limit.");
            return;
          }
          setSetup({...BLANK});setType("parent");go("details");
        }}
        onSignOut={async()=>{await supabase.auth.signOut();setAcct(null);setKids([]);setAct(null);hist.current=["auth_login"];setScr("auth_login");}}
        onSettings={()=>go("settings")}
      />}

      {screen==="child_progress"&&manage&&<ChildProgress
        child={manage}
        onBack={back}
        onControls={()=>go("child_controls")}
        onAccessibility={()=>go("child_accessibility")}
        onResetPassword={()=>go("reset_child_password")}
        onEditProfile={()=>go("edit_child_profile")}
        onAdvanceYear={()=>go("advance_year")}
        onEmailReport={()=>go("email_report")}
        onSignOut={async()=>{
          await supabase.auth.signOut();
          setAcct(null);setKids([]);setAct(null);setMgr(null);
          hist.current=["auth_login"];setScr("auth_login");
        }}
      />}

      {screen==="child_accessibility"&&manage&&<AccessibilitySettings
        child={manage}
        onBack={back}
        onSave={acc=>{updChild(manage.id,{accessibility:acc});setMgr(c=>({...c,accessibility:acc}));back();}}
      />}

      {screen==="reset_child_password"&&manage&&<ResetChildPassword
        child={manage}
        onBack={back}
        onSave={async(newPass)=>{
          const hash = await hashPassword(newPass);
          // Find existing child account by child_id to get username
          try {
            const r = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/child_accounts?child_id=eq.${manage.id}&select=username`,
              {headers:{apikey:import.meta.env.VITE_SUPABASE_ANON_KEY,Authorization:`Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`}}
            );
            const rows = await r.json();
            const username = rows?.[0]?.username || manage.childUsername;
            if(username) {
              await supabase.from("child_accounts").upsert({
                parent_id: authUser?.id,
                child_id: manage.id,
                username: username,
                password_hash: hash,
                child_name: manage.name,
              });
            }
          } catch(e) { console.error("Reset password failed:", e); }
        }}
      />}

      {screen==="edit_child_profile"&&manage&&<EditChildProfile
        child={manage}
        onBack={back}
        onSave={(updates)=>{updChild(manage.id,updates);setMgr(c=>({...c,...updates}));back();}}
      />}

      {screen==="advance_year"&&manage&&<YearGroupAdvancement
        child={manage}
        onBack={back}
        onSave={(updates)=>{
          updChild(manage.id,updates);
          setMgr(c=>({...c,...updates}));
          // Save immediately so next session uses new year group
          if(authUser){
            const updatedKids=children.map(c=>c.id===manage.id?{...c,...updates}:c);
            saveData(authUser.id,{account,children:updatedKids});
          }
          back();
        }}
      />}

      {screen==="email_report"&&manage&&<EmailProgressReport
        child={manage}
        parentEmail={authUser?.email}
        onBack={back}
      />}

      {screen==="child_controls"&&manage&&<ParentalControls
        child={manage}
        onBack={back}
        onSave={ctrl=>{updChild(manage.id,{controls:ctrl});setMgr(c=>({...c,controls:ctrl}));back();}}
      />}

      {screen==="settings"&&<Settings
        account={account}
        onBack={back}
        onPrivacy={()=>go("privacy_policy")}
        onTerms={()=>go("terms_of_service")}
        onChangePassword={()=>go("change_password")}
        onSignOut={async()=>{
          await supabase.auth.signOut();
          setAcct(null);setKids([]);setAct(null);setMgr(null);
          hist.current=["auth_login"];setScr("auth_login");
        }}
        onReset={async()=>{
          if(window.confirm("This will delete ALL progress and profiles and cannot be undone. Are you sure?")){
            try{localStorage.removeItem(SK);}catch{}
            if(authUser) await supabase.auth.signOut();
            setAcct(null);setKids([]);setAct(null);setMgr(null);
            hist.current=["auth_login"];setScr("auth_login");
          }
        }}
      />}
    </A11yContext.Provider>
  );
}
// ── Learn Mode — Animated Curriculum Book ───────────────────────────────
function LearnMode({child,subject,topic,onDone,onBack}) {
  const sc=SUB[subject]||{color:C.primary,grad:`linear-gradient(135deg,${C.primary},#6366F1)`,light:C.pLight,emoji:"📚"};
  const [lesson,setLesson]           =useState(null);
  const [slideIdx,setSlideIdx]       =useState(-1);
  const [loading,setLoading]         =useState(true);
  const [err,setErr]                 =useState(false);
  const [animIn,setAnimIn]           =useState(true);
  const [checkSel,setCheckSel]       =useState(null);
  const [checkAns,setCheckAns]       =useState(false);
  const [pIdx,setPIdx]               =useState(0);
  const [pSel,setPSel]               =useState(null);
  const [pAns,setPAns]               =useState(false);
  const [pScore,setPScore]           =useState(0);

  const topicLevel =child.topicLevels?.[subject]?.[topic?.id]||1;
  const levelObj   =topic?.levels?.[topicLevel-1]||topic?.desc||"curriculum content";
  const prevObj    =topicLevel>1?(topic?.levels?.[topicLevel-2]||"basics"):"no prior knowledge";
  const nextObj    =topic?.levels?.[topicLevel]||"advanced extension";
  const country    =child.country||"UK";
  const curriculum =country==="US"?"Common Core":country==="CA"?"Ontario":"National Curriculum";
  const lang       =country==="US"?"American English (math, color, grade)":country==="CA"?"Canadian English (math, colour, grade)":"British English (maths, colour, year group)";
  const yearGroup  =child.yearGroup||YEAR[country]?.[child.age]||"Year 3";
  const yearContent=getYearGroupContent(child,subject)||levelObj;

  useEffect(()=>{
    const t=setTimeout(()=>{setErr(true);setLoading(false);},35000);
    claudeLesson(`You are an expert primary school teacher writing a lesson for ONE child. Write warmly, personally, as if sitting next to them.
CHILD: ${child.name}, age ${child.age}, ${yearGroup}, ${country}
SUBJECT: ${subject} | TOPIC: ${topic?.name||subject} | CURRICULUM: ${curriculum} | LANGUAGE: ${lang}
${yearGroup} ${subject} EXPECTATION: "${yearContent}"
THIS LESSON (Level ${topicLevel}/10): "${levelObj}"
ALREADY KNOWS: "${prevObj}" | NOT YET: "${nextObj}"
Write a RICH DETAILED lesson — each slide should feel like 2-3 minutes of real teaching.
Return ONLY valid JSON: {"title":"...","hookQuestion":"...","tutorIntro":"2-3 warm sentences to ${child.name} building excitement","slides":[{"emoji":"📌","heading":"max 6 words","teach":"4-6 sentences of clear warm teaching, step by step, for age ${child.age} in ${country}, using you and we","workedExample":"Full worked example: Step 1: ... Step 2: ... Answer: ...","tryIt":"A thinking question for the child — no options yet","tip":"Teacher tip or common mistake to avoid"}],"practiceQuestions":[{"q":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"A","explanation":"full teacher explanation"},{"q":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"B","explanation":"full explanation"},{"q":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"C","explanation":"full explanation"}],"memoryTrick":"rhyme or acronym for this content","checkQ":{"q":"final check question","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"A","explanation":"thorough teacher explanation"},"wellDone":"warm 2-3 sentence message to ${child.name}"}
Write exactly 5 slides: 1) introduce concept 2) key rule/method 3) full worked example 4) common mistakes 5) real-world use.`,
    "Generate teacher-quality lesson.").then(d=>{clearTimeout(t);if(d?.slides?.length){setLesson(d);setLoading(false);}else{setErr(true);setLoading(false);}});
  },[]);

  const goTo=(idx)=>{setAnimIn(false);if(idx===lesson?.slides?.length+1){setCheckSel(null);setCheckAns(false);}if(idx===lesson?.slides?.length){setPIdx(0);setPSel(null);setPAns(false);}setTimeout(()=>{setSlideIdx(idx);setAnimIn(true);},180);};

  if(loading)return(<Screen><div style={{paddingTop:80,textAlign:"center"}}><div style={{fontSize:60,marginBottom:16}}>{sc.emoji||"📚"}</div><h2 style={{fontSize:22,fontWeight:900,color:C.text,marginBottom:8}}>Preparing your lesson...</h2><p style={{fontSize:14,color:C.muted,marginBottom:20}}>{topic?.name||subject} · {yearGroup}</p><div style={{width:200,height:6,borderRadius:3,background:C.border,margin:"0 auto",overflow:"hidden"}}><div style={{height:"100%",background:sc.color||C.primary,borderRadius:3,width:"70%",animation:"loading 1.5s ease-in-out infinite"}}/></div><p style={{fontSize:12,color:C.muted,marginTop:12}}>Building a personalised lesson for {child.name} ✨</p></div></Screen>);
  if(err)return(<Screen><div style={{paddingTop:60,textAlign:"center"}}><div style={{fontSize:56,marginBottom:16}}>😕</div><h2 style={{fontSize:20,fontWeight:900,color:C.text,marginBottom:8}}>Couldn't load lesson</h2><p style={{fontSize:14,color:C.muted,marginBottom:20}}>Check your connection and try again</p><Btn onClick={onBack} style={{width:"100%"}}>Go Back</Btn></div></Screen>);

  const S=lesson.slides.length;
  const isCover=slideIdx===-1,isPractice=slideIdx===S,isCheck=slideIdx===S+1,isDone=slideIdx===S+2;
  const slide=(slideIdx>=0&&slideIdx<S)?lesson.slides[slideIdx]:null;
  const step=isCover?0:isPractice?S:isCheck?S+1:isDone?S+2:slideIdx+1;
  const cols=["#E53E3E","#3182CE","#D69E2E","#38A169"];

  const PBar=()=>(<div style={{marginBottom:14}}><div style={{display:"flex",gap:3,marginBottom:3}}>{Array.from({length:S+2}).map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<step?sc.color:i===step-1?sc.color:C.border,opacity:i<step?0.5:i===step-1?1:0.2,transition:"all 0.3s"}}/>)}</div></div>);

  if(isCover)return(<Screen><div style={{paddingTop:16}}><BackBtn onClick={onBack}/>
    <div style={{background:sc.grad||`linear-gradient(135deg,${sc.color},${sc.color}CC)`,borderRadius:28,padding:"24px 18px",marginTop:8,marginBottom:14,textAlign:"center",position:"relative",overflow:"hidden",boxShadow:`0 10px 32px ${sc.color}50`}}>
      <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
      <div style={{fontSize:56,marginBottom:10}}>{sc.emoji||"📚"}</div>
      <p style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.7)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>{subject} · {yearGroup} · Level {topicLevel}</p>
      <h1 style={{fontSize:20,fontWeight:900,color:"#fff",lineHeight:1.3,marginBottom:12}}>{lesson.title}</h1>
      <div style={{background:"rgba(255,255,255,0.18)",borderRadius:12,padding:"10px 14px"}}><p style={{fontSize:14,fontWeight:700,color:"#fff",fontStyle:"italic",lineHeight:1.6}}>🤔 {lesson.hookQuestion}</p></div>
    </div>
    {lesson.tutorIntro&&<div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:14,padding:"12px 14px",background:"#fff",borderRadius:14,boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}><TutorChar name={child.tutor} size={38}/><Bubble tutor={child.tutor} text={lesson.tutorIntro} style={{flex:1}}/></div>}
    <div style={{background:"#fff",borderRadius:18,padding:"14px 16px",marginBottom:16,boxShadow:"0 2px 12px rgba(67,56,202,0.08)"}}>
      <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>In this lesson</p>
      {lesson.slides.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{width:28,height:28,borderRadius:8,background:sc.light||C.pLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{s.emoji}</div><p style={{fontSize:13,fontWeight:700,color:C.text}}>{s.heading}</p></div>)}
      <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><div style={{width:28,height:28,borderRadius:8,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>✏️</div><p style={{fontSize:13,fontWeight:700,color:C.text}}>3 practice questions</p></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:28,height:28,borderRadius:8,background:"#DCFCE7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🎯</div><p style={{fontSize:13,fontWeight:700,color:C.text}}>Final check question</p></div>
      </div>
    </div>
    <Btn onClick={()=>goTo(0)} style={{width:"100%",fontSize:17,padding:"16px"}}>Let's start! 🚀</Btn>
  </div></Screen>);

  if(isPractice){
    const pqs=lesson.practiceQuestions||[];const pq=pqs[pIdx];const pOk=pSel?.charAt(0)===pq?.correct;
    return(<Screen><div style={{paddingTop:16}}><PBar/>
      <div style={{background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:18,padding:"14px 16px",marginBottom:14,border:"2px solid #F59E0B"}}>
        <p style={{fontSize:11,fontWeight:800,color:"#92400E",textTransform:"uppercase",marginBottom:6}}>✏️ Practice Question {Math.min(pIdx+1,pqs.length)} of {pqs.length}</p>
        <p style={{fontSize:16,fontWeight:800,color:"#78350F",lineHeight:1.6}}>{pq?.q}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {pq?.options?.map((opt,i)=>{const isSel=pSel===opt,isOk=pAns&&opt===pq.correct,isBad=pAns&&isSel&&!isOk,dim=pAns&&!isOk&&!isSel;return(<button key={i} onClick={()=>{if(!pAns){setPSel(opt);setPAns(true);if(opt.charAt(0)===pq.correct)setPScore(s=>s+1);}}} style={{padding:"14px 10px",borderRadius:14,fontSize:13,fontWeight:900,cursor:pAns?"default":"pointer",fontFamily:F,border:"none",background:isOk?"#22C55E":isBad?"#EF4444":dim?"#F1F5F9":`linear-gradient(135deg,${cols[i]},${cols[i]}BB)`,color:dim?"#94A3B8":"#fff",opacity:dim?0.4:1,transition:"all 0.15s"}}>{isOk?"✅ ":isBad?"❌ ":""}{opt.replace(/^[A-D]\)\s*/,"")}</button>);})}
      </div>
      {pAns&&<><div style={{padding:"12px 14px",borderRadius:14,marginBottom:12,background:pOk?"#DCFCE7":"#FEF3C7",border:`2px solid ${pOk?"#22C55E":"#F59E0B"}`}}><p style={{fontSize:14,fontWeight:900,color:pOk?"#166534":"#92400E",marginBottom:4}}>{pOk?"🎉 Correct!":"💡 Not quite:"}</p><p style={{fontSize:13,fontWeight:600,color:pOk?"#15803D":"#78350F",lineHeight:1.6}}>{pq?.explanation}</p></div>
      <Btn onClick={()=>{if(pIdx+1>=pqs.length)goTo(S+1);else{setPIdx(i=>i+1);setPSel(null);setPAns(false);}}} style={{width:"100%"}}>{pIdx+1>=pqs.length?"Final Check 🎯":"Next →"}</Btn></>}
    </div></Screen>);
  }

  if(isCheck){
    const cq=lesson.checkQ;const cOk=checkSel?.charAt(0)===cq?.correct;
    return(<Screen><div style={{paddingTop:16}}><PBar/>
      <div style={{background:sc.grad,borderRadius:20,padding:"20px 16px",marginBottom:14,textAlign:"center",boxShadow:`0 6px 20px ${sc.color}40`}}>
        <div style={{fontSize:40,marginBottom:8}}>🎯</div>
        <p style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.75)",textTransform:"uppercase",marginBottom:6}}>Final Check</p>
        <p style={{fontSize:17,fontWeight:800,color:"#fff",lineHeight:1.6}}>{cq?.q}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {cq?.options?.map((opt,i)=>{const isSel=checkSel===opt,isOk=checkAns&&opt===cq.correct,isBad=checkAns&&isSel&&!isOk,dim=checkAns&&!isOk&&!isSel;return(<button key={i} onClick={()=>{if(!checkAns){setCheckSel(opt);setCheckAns(true);}}} style={{padding:"14px 10px",borderRadius:14,fontSize:13,fontWeight:900,cursor:checkAns?"default":"pointer",fontFamily:F,border:"none",background:isOk?"#22C55E":isBad?"#EF4444":dim?"#F1F5F9":`linear-gradient(135deg,${cols[i]},${cols[i]}BB)`,color:dim?"#94A3B8":"#fff",opacity:dim?0.4:1,transition:"all 0.15s"}}>{isOk?"✅ ":isBad?"❌ ":""}{opt.replace(/^[A-D]\)\s*/,"")}</button>);})}
      </div>
      {checkAns&&<><div style={{padding:"12px 14px",borderRadius:14,marginBottom:12,background:cOk?"#DCFCE7":"#FEF3C7",border:`2px solid ${cOk?"#22C55E":"#F59E0B"}`}}><p style={{fontSize:15,fontWeight:900,color:cOk?"#166534":"#92400E",marginBottom:4}}>{cOk?"🎉 Excellent!":"💡 Good effort!"}</p><p style={{fontSize:13,fontWeight:600,color:cOk?"#15803D":"#78350F",lineHeight:1.6}}>{cq?.explanation}</p></div>
      <Btn onClick={()=>goTo(S+2)} style={{width:"100%",fontSize:16,padding:"16px"}}>{cOk?"Start practising! 🚀":"Review the lesson →"}</Btn></>}
    </div></Screen>);
  }

  if(isDone)return(<Screen><div style={{paddingTop:40,textAlign:"center"}}>
    <div style={{fontSize:72,marginBottom:12}}>🎓</div>
    <h2 style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:8}}>Lesson Complete!</h2>
    {lesson.wellDone&&<div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:16,padding:"14px 16px",background:"#fff",borderRadius:16,textAlign:"left",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}><TutorChar name={child.tutor} size={38}/><Bubble tutor={child.tutor} text={lesson.wellDone} style={{flex:1}}/></div>}
    <div style={{background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:18,padding:"16px 18px",marginBottom:18,textAlign:"left",border:"2px solid #F59E0B"}}><p style={{fontSize:11,fontWeight:800,color:"#92400E",textTransform:"uppercase",marginBottom:6}}>🧠 Remember This</p><p style={{fontSize:15,fontWeight:700,color:"#78350F",lineHeight:1.7,fontStyle:"italic"}}>"{lesson.memoryTrick}"</p></div>
    <Btn onClick={onDone} style={{width:"100%",padding:"16px",fontSize:17,marginBottom:10}}>Start Questions Now! 🚀</Btn>
    <Btn onClick={onBack} v="ghost" style={{width:"100%"}}>Back to Topics</Btn>
  </div></Screen>);

  const slideColors = [
    {grad:"linear-gradient(135deg,#4338CA,#6366F1)",light:"#EEF2FF",accent:"#4338CA"},
    {grad:"linear-gradient(135deg,#0284C7,#38BDF8)",light:"#E0F2FE",accent:"#0284C7"},
    {grad:"linear-gradient(135deg,#16A34A,#4ADE80)",light:"#DCFCE7",accent:"#16A34A"},
    {grad:"linear-gradient(135deg,#D97706,#FBBF24)",light:"#FEF3C7",accent:"#D97706"},
    {grad:"linear-gradient(135deg,#DB2777,#F472B6)",light:"#FCE7F3",accent:"#DB2777"},
  ];
  const sc2 = slideColors[Math.max(0,slideIdx)%5] || slideColors[0];

  return(<Screen><div style={{paddingTop:16}}>
    <PBar/>
    {/* Slide number indicator */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        {Array.from({length:S}).map((_,i)=>(
          <button key={i} onClick={()=>goTo(i)}
            style={{width:i===slideIdx?28:8,height:8,borderRadius:4,border:"none",cursor:"pointer",
              background:i===slideIdx?sc2.accent:i<slideIdx?"#CBD5E1":"#E2E8F0",
              transition:"all 0.3s",padding:0}}/>
        ))}
      </div>
      <span style={{fontSize:11,fontWeight:800,color:C.muted}}>Slide {slideIdx+1} of {S}</span>
    </div>

    <div style={{opacity:animIn?1:0,transform:animIn?"translateY(0)":"translateY(8px)",transition:"all 0.22s ease"}}>
      {/* Hero header — unique colour each slide */}
      <div style={{background:sc2.grad,borderRadius:24,padding:"22px 18px 18px",marginBottom:12,
        textAlign:"center",boxShadow:`0 8px 28px ${sc2.accent}45`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-24,right:-24,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.12)"}}/>
        <div style={{position:"absolute",bottom:-16,left:-16,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
        {/* Slide badge */}
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.25)",
          borderRadius:20,padding:"4px 12px",marginBottom:10}}>
          <span style={{fontSize:10,fontWeight:800,color:"#fff",letterSpacing:"0.08em"}}>SLIDE {slideIdx+1}/{S}</span>
        </div>
        <div style={{fontSize:58,marginBottom:8,lineHeight:1,filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.15))"}}>{slide?.emoji}</div>
        <h2 style={{fontSize:20,fontWeight:900,color:"#fff",lineHeight:1.3,textShadow:"0 1px 4px rgba(0,0,0,0.2)"}}>{slide?.heading}</h2>
      </div>

      {/* Teaching content — clean white card with left accent bar */}
      <div style={{background:"#fff",borderRadius:18,padding:"16px 18px",marginBottom:10,
        boxShadow:"0 2px 16px rgba(0,0,0,0.06)",borderLeft:`4px solid ${sc2.accent}`,position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
          <div style={{width:24,height:24,borderRadius:8,background:sc2.light,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>📖</div>
          <p style={{fontSize:11,fontWeight:800,color:sc2.accent,textTransform:"uppercase",letterSpacing:"0.07em"}}>What you need to know</p>
        </div>
        <p style={{fontSize:15,fontWeight:600,color:C.text,lineHeight:1.95,margin:0}}>{slide?.teach}</p>
      </div>

      {/* Worked example — distinct background */}
      {slide?.workedExample&&(
        <div style={{background:`linear-gradient(135deg,${sc2.light},rgba(255,255,255,0.5))`,
          borderRadius:16,padding:"14px 16px",marginBottom:10,
          border:`1.5px solid ${sc2.accent}30`}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <div style={{width:24,height:24,borderRadius:8,background:sc2.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>✏️</div>
            <p style={{fontSize:11,fontWeight:800,color:sc2.accent,textTransform:"uppercase",letterSpacing:"0.07em"}}>Worked Example</p>
          </div>
          <div style={{background:"rgba(255,255,255,0.8)",borderRadius:12,padding:"12px 14px"}}>
            <p style={{fontSize:14,fontWeight:600,color:"#1E293B",lineHeight:2,whiteSpace:"pre-line",fontFamily:"'Courier New',monospace"}}>{slide.workedExample}</p>
          </div>
        </div>
      )}

      {/* Try it yourself — warm amber */}
      {slide?.tryIt&&(
        <div style={{background:"linear-gradient(135deg,#FFFBEB,#FEF9C3)",borderRadius:16,
          padding:"12px 16px",marginBottom:10,border:"2px solid #FCD34D",
          display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{fontSize:24,flexShrink:0}}>🤔</div>
          <div>
            <p style={{fontSize:11,fontWeight:800,color:"#B45309",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Your turn — think about it</p>
            <p style={{fontSize:14,fontWeight:700,color:"#92400E",lineHeight:1.65,margin:0}}>{slide.tryIt}</p>
          </div>
        </div>
      )}

      {/* Teacher tip — green */}
      {slide?.tip&&(
        <div style={{background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",borderRadius:16,
          padding:"12px 16px",marginBottom:14,border:"2px solid #86EFAC",
          display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{fontSize:22,flexShrink:0}}>💡</div>
          <div>
            <p style={{fontSize:11,fontWeight:800,color:"#166534",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Teacher Tip</p>
            <p style={{fontSize:13,fontWeight:600,color:"#166534",lineHeight:1.65,margin:0}}>{slide.tip}</p>
          </div>
        </div>
      )}
    </div>

    {/* Navigation */}
    <div style={{display:"flex",gap:10}}>
      {slideIdx>0&&<Btn onClick={()=>goTo(slideIdx-1)} v="ghost" style={{flex:"0 0 auto",padding:"14px 18px"}}>← Back</Btn>}
      <Btn onClick={()=>goTo(slideIdx+1)} style={{flex:1,padding:"15px",fontSize:15,
        background:sc2.grad,boxShadow:`0 4px 16px ${sc2.accent}40`}}>
        {slideIdx+1>=S?"Practice Questions ✏️":"Next →"}
      </Btn>
    </div>
  </div></Screen>);
}



