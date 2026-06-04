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
import { useState, useEffect, useRef } from "react";

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
    .tap-scale:active{transform:scale(0.94)!important;transition:transform 0.08s!important}
  `;
  document.head.appendChild(s);
})();

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  bg:"#F0F4FF", surface:"#FFFFFF",
  primary:"#4F46E5", pLight:"#EEF2FF",
  amber:"#F59E0B", aLight:"#FFFBEB",
  violet:"#7C3AED", vLight:"#F5F3FF",
  sky:"#0EA5E9", sLight:"#F0F9FF",
  green:"#059669", gLight:"#ECFDF5",
  pink:"#EC4899", pkLight:"#FDF2F8",
  red:"#DC2626", rLight:"#FEF2F2",
  orange:"#EA580C", oLight:"#FFF7ED",
  text:"#111827", muted:"#6B7280", border:"#E5E7EB",
};
const F = "'Nunito',sans-serif";
const FDYS = "'OpenDyslexic','Comic Sans MS',sans-serif";

// ── DATA ──────────────────────────────────────────────────────────────────
const SUBJECTS = ["Maths","English","Science","History","Geography","Computing"];
const SUB = {
  Maths:    {emoji:"🔢",color:C.primary, light:C.pLight},
  English:  {emoji:"📖",color:C.sky,     light:C.sLight},
  Science:  {emoji:"🔬",color:C.green,   light:C.gLight},
  History:  {emoji:"📜",color:"#B45309", light:"#FEF3C7"},
  Geography:{emoji:"🌍",color:"#0369A1", light:"#E0F2FE"},
  Computing:{emoji:"💻",color:"#7C3AED", light:"#F5F3FF"},
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
     levels:["Count to 100, tens and ones, more and less","Numbers to 1000, place value, rounding to 10/100","Numbers to 10,000, negative numbers, Roman numerals","Numbers to 1,000,000, ordering, rounding, counting in steps","Numbers to 10,000,000, powers of 10, negative numbers in context"]},
    {id:"addition",       name:"Addition & Subtraction",      emoji:"➕", minAge:5,
     desc:"Mental and written addition and subtraction methods",
     levels:["Number bonds to 10 and 20, adding single digits","Adding/subtracting 2-digit numbers, column method introduction","Column addition and subtraction to 3 digits, estimating","Adding/subtracting 4-digit numbers, inverse operations","Multi-step problems, decimals, mental strategies"]},
    {id:"multiplication", name:"Multiplication & Division",   emoji:"✖️", minAge:6,
     desc:"Times tables, short and long multiplication and division",
     levels:["2, 5 and 10 times tables, arrays, grouping","3, 4 and 8 times tables, short multiplication/division","All tables to 12, short division with remainders","Long multiplication 2-digit, short division with fractions","Long multiplication and division, prime factors, BODMAS"]},
    {id:"fractions",      name:"Fractions, Decimals & %",     emoji:"½",  minAge:6,
     desc:"Fractions, decimals and percentages",
     levels:["Halves, quarters and thirds, unit fractions","Equivalent fractions, ordering, simple addition","Adding/subtracting fractions same denominator, tenths","Decimal equivalents, hundredths, fractions of amounts","Percentages, fraction/decimal/% equivalence, multi-step"]},
    {id:"measurement",    name:"Measurement",                 emoji:"📏", minAge:5,
     desc:"Length, mass, capacity, time, money, perimeter and area",
     levels:["Compare and measure length/mass/capacity, time to hour","Measure in cm/m/kg/l, money to £1, time to 5 mins","Perimeter, area basics, time to minute, Roman numerals","Area by counting, converting units, 24-hour clock","Area/perimeter formulae, volume, converting metric units"]},
    {id:"geometry",       name:"Geometry — Shape",            emoji:"📐", minAge:5,
     desc:"2D and 3D shapes, angles, symmetry and properties",
     levels:["Name 2D/3D shapes, sort by properties, symmetry lines","Quadrilaterals, polygons, right angles, lines of symmetry","Angles acute/obtuse/right, triangles, 3D shape nets","Angles on lines and points, regular/irregular polygons","Calculate angles, circles, area of triangles/parallelograms"]},
    {id:"position",       name:"Position & Direction",        emoji:"🧭", minAge:6,
     desc:"Coordinates, translation, reflection and rotation",
     levels:["Directions, half/quarter turns, patterns","Describe positions, first quadrant coordinates","Translate shapes, reflect in axes, describe movement","Four-quadrant coordinates, translation by vector","Reflection and translation, solve geometry problems"]},
    {id:"statistics",     name:"Statistics & Data",           emoji:"📊", minAge:7,
     desc:"Tally charts, bar charts, line graphs, pie charts",
     levels:["Tally charts, pictograms, block diagrams","Bar charts with labels, simple data questions","Bar charts scaled axes, line graphs, tables","Time graphs, calculate mean, compare data sets","Pie charts, line graphs, mean from frequency tables"]},
    {id:"ratio",          name:"Ratio & Proportion",          emoji:"⚖️", minAge:10,
     desc:"Ratio, proportion, scale and unequal sharing",
     levels:["Introduction to ratio notation and simple ratios","Simplify ratios, share amounts in given ratio","Scale factors, ratio in recipes and maps","Proportion problems, percentage as ratio","Combine ratio and proportion in multi-step problems"]},
    {id:"algebra",        name:"Algebra",                     emoji:"🔣", minAge:10,
     desc:"Formulae, sequences, unknowns and equations",
     levels:["Number sequences and patterns, missing numbers","Formulae with one variable, substitution","Linear sequences, generating terms, simple equations","Solve one-step equations, express missing angles","Two-step equations, enumerate possibilities, formulae"]},
  ],
  English: [
    {id:"phonics",        name:"Phonics & Decoding",          emoji:"🔤", minAge:4,
     desc:"Letter sounds, blending and segmenting",
     levels:["Phase 2: s,a,t,p,i,n,m,d,g,o,c,k — CVC words","Phase 3: j,v,w,x,y,z,qu, digraphs ch,sh,th,ng","Phase 4: CCVC/CVCC words, blending longer words","Phase 5: alternative graphemes, split digraphs","Common exception words, polysyllabic words, fluency"]},
    {id:"spelling",       name:"Spelling",                    emoji:"✏️", minAge:5,
     desc:"Spelling rules, patterns and common exception words",
     levels:["KS1 common exception words, simple CVC patterns","Suffixes -ing/-ed/-er, double consonants, y to i","Prefixes un-/re-/mis-, soft c and g, homophones","KS2 Year 3-4 statutory word list, prefixes pre-/dis-","Year 5-6 statutory list, silent letters, word origins"]},
    {id:"grammar",        name:"Grammar & Punctuation",       emoji:"📝", minAge:5,
     desc:"Sentence structure, word types and punctuation",
     levels:["Capital letters, full stops, question marks, finger spaces","Nouns, verbs, adjectives, exclamation marks, commas in lists","Conjunctions, adverbs, apostrophes, inverted commas","Pronouns, prepositions, fronted adverbials, paragraphs","Relative clauses, modal verbs, subjunctive, formal/informal"]},
    {id:"reading",        name:"Reading Comprehension",       emoji:"📖", minAge:5,
     desc:"Retrieval, inference and understanding texts",
     levels:["Retell stories, sequence events, simple retrieval","Infer character feelings, predict, ask questions about text","Explain and justify using evidence, summarise main ideas","Compare texts, author purpose, vocabulary in context","Critical analysis, writer techniques, evaluate perspectives"]},
    {id:"writing",        name:"Writing — Composition",       emoji:"🖊️", minAge:6,
     desc:"Stories, recounts, letters, instructions and reports",
     levels:["Simple sentences, describe pictures, recount events","Stories with beginning/middle/end, simple instructions","Paragraphs, expanded noun phrases, different sentence types","Multi-paragraph stories, persuasive letters, formal reports","Complex narratives, evaluate and edit, audience and purpose"]},
    {id:"vocabulary",     name:"Vocabulary & Word Study",     emoji:"💬", minAge:6,
     desc:"Word meanings, synonyms, antonyms and context",
     levels:["Match words to pictures, simple definitions","Synonyms and antonyms, word families, compound words","Prefixes and suffixes change meaning, context clues","Formal/informal word choice, figurative language intro","Connotation, etymology, technical vocabulary by subject"]},
    {id:"poetry",         name:"Poetry & Creative Writing",   emoji:"🎭", minAge:7,
     desc:"Rhyme, rhythm, imagery and creative expression",
     levels:["Rhyming couplets, simple poems, describe a scene","Similes, alliteration, acrostic poems, kennings","Metaphors, personification, performance poetry","Free verse, haiku, narrative poetry, poetic devices","Extended creative writing, evaluate techniques, original voice"]},
    {id:"media",          name:"Non-fiction & Media Literacy",emoji:"📰", minAge:7,
     desc:"Reports, persuasion, evaluating sources",
     levels:["Information texts, labels, captions, simple reports","Recount texts, newspapers, fact vs opinion","Persuasive writing techniques, bias, argument structure","Formal reports, journalistic writing, evaluate reliability","Complex argument, rhetorical devices, digital media literacy"]},
  ],
  Science: [
    {id:"plants",         name:"Plants",                      emoji:"🌱", minAge:5,
     desc:"Parts of plants, growth, pollination and life cycles",
     levels:["Name basic parts: root, stem, leaf, flower","What plants need: water, light, warmth, nutrients","Flowers, pollination, seed dispersal, germination","Life cycle of flowering plants, photosynthesis basics","Plant reproduction, adaptation, plant classification"]},
    {id:"animals",        name:"Animals Including Humans",    emoji:"🐾", minAge:5,
     desc:"Basic needs, food chains, human body and health",
     levels:["Name and group animals, basic needs, offspring","Food chains, predator/prey, habitats and survival","Skeleton and muscles, nutrition, healthy eating","Digestion, teeth types, food groups, exercise and health","Circulatory system, heart, blood, drugs and lifestyle"]},
    {id:"materials",      name:"Materials & Their Properties",emoji:"🧪", minAge:5,
     desc:"Properties of materials, changes and suitability",
     levels:["Name materials: wood, plastic, metal, glass, fabric","Properties: hard/soft, waterproof, transparent, flexible","Solids, liquids, gases — particles and properties","Dissolving, filtering, evaporation — reversible changes","Irreversible changes, burning, rusting, thermal conductivity"]},
    {id:"seasons",        name:"Seasonal Changes & Weather",  emoji:"☀️", minAge:4,
     desc:"The four seasons, weather patterns and day length",
     levels:["Four seasons: name and describe each","Weather: sunny, rainy, snowy, windy, measuring","Day length changes, sunrise and sunset across seasons","Weather symbols, recording, patterns and predictions","Climate vs weather, UK climate, impact on living things"]},
    {id:"living",         name:"Living Things & Habitats",    emoji:"🌿", minAge:6,
     desc:"Classification, adaptation and ecosystems",
     levels:["Living/non-living, microhabitats, name local animals","Food chains, producers/consumers, describe habitats","Classification: vertebrates/invertebrates, keys","Adaptation to habitats, variation within species","Classification systems, ecosystems, human impact"]},
    {id:"forces",         name:"Forces & Motion",             emoji:"🚀", minAge:7,
     desc:"Gravity, friction, magnetism and mechanisms",
     levels:["Push and pull forces, magnets attract/repel","Gravity, friction, water resistance, air resistance","Simple mechanisms: levers, pulleys, gears","Effects of forces on shape and movement, balanced forces","Speed calculations, force diagrams, pressure"]},
    {id:"light",          name:"Light & Shadow",              emoji:"💡", minAge:7,
     desc:"Light sources, reflection, shadows and seeing",
     levels:["Light sources, dark without light, eyes to see","Shadows form opposite light source, shadow size","Reflection from surfaces, mirrors and periscopes","Refraction, prism, spectrum, colour and light","Light travel, speed of light, scientific applications"]},
    {id:"sound",          name:"Sound",                       emoji:"🎵", minAge:7,
     desc:"Vibrations, pitch, volume and how sound travels",
     levels:["Sounds come from vibrations, volume near/far","Pitch high/low linked to size, volume and distance","Insulating sound, string telephones, ear drum","How sound travels through solids/liquids/gases","Speed of sound, echoes, ultrasound applications"]},
    {id:"electricity",    name:"Electricity & Circuits",      emoji:"⚡", minAge:8,
     desc:"Simple circuits, components and electrical safety",
     levels:["Everyday uses of electricity, electrical safety","Simple circuits: battery, bulb, wire, switch","Insulators and conductors, testing materials","Series circuits, voltage, changing brightness/pitch","Circuit diagrams, resistance, electrical current basics"]},
    {id:"earth",          name:"Earth & Space",               emoji:"🌍", minAge:9,
     desc:"Solar system, Earth rotation, Moon and gravity",
     levels:["Name planets in solar system, sun is a star","Earth rotation causes day and night, 365 days","Moon orbit of Earth, phases of the Moon","Geocentric vs heliocentric model, historical understanding","Gravity in space, satellites, space exploration"]},
    {id:"evolution",      name:"Evolution & Inheritance",     emoji:"🦕", minAge:10,
     desc:"Fossils, adaptation, inheritance and natural selection",
     levels:["Fossils show life has changed over time","Parents pass traits to offspring, variation","Animals adapt to environments over many generations","Natural selection: survival of the fittest","Evidence for evolution, Darwin, DNA basics"]},
    {id:"properties2",    name:"Properties & Changes",        emoji:"🔬", minAge:9,
     desc:"States of matter, dissolving, separating and reactions",
     levels:["Solids/liquids/gases, particle model basics","Dissolving, solutions, solute and solvent","Separating mixtures: filtering, sieving, evaporating","Irreversible changes, new substances formed","Combustion, oxidation, thermal decomposition"]},
  ],
  History: [
    {id:"living_memory",  name:"Changes in Living Memory",    emoji:"👴", minAge:5,
     desc:"How life has changed within living memory",
     levels:["How homes have changed: TVs, phones, appliances","How schools have changed: lessons, equipment, rules","How transport has changed: cars, planes, space","Changes to food, shops and everyday life","Oral history, interviewing grandparents, local change"]},
    {id:"beyond_memory",  name:"Events Beyond Living Memory", emoji:"📜", minAge:5,
     desc:"Significant national/global events from the past",
     levels:["Great Fire of London 1666: causes and effects","The Moon Landing 1969: space race and achievement","The Titanic 1912: why it sank, impact and memory","The Gunpowder Plot 1605: Guy Fawkes, treason, legacy","World events that changed history: suffragettes, plagues"]},
    {id:"significant",    name:"Significant People & Events", emoji:"⭐", minAge:5,
     desc:"Important people who shaped Britain and the world",
     levels:["Florence Nightingale: nursing, Crimean War, reform","Rosa Parks and Martin Luther King: civil rights","Neil Armstrong: space exploration, the Moon","Queen Elizabeth II: longest reign, modern history","Scientists and inventors: Darwin, Newton, Faraday, Curie"]},
    {id:"ancient",        name:"Ancient Civilisations",       emoji:"🏛️", minAge:7,
     desc:"Stone Age through to Roman Britain",
     levels:["Stone Age: hunter-gatherers, cave art, Stonehenge","Bronze and Iron Age: farming, hillforts, Celts","Ancient Egypt: pharaohs, pyramids, mummification, Nile","Ancient Greece: Athens, democracy, Olympics, gods, philosophers","Roman Britain: invasion, Boudicca, roads, villas, legacy"]},
    {id:"british",        name:"British History",             emoji:"👑", minAge:7,
     desc:"Anglo-Saxons, Vikings, Tudors, Victorians and beyond",
     levels:["Anglo-Saxons: kingdoms, Beowulf, culture, Christianity","Vikings: raids, Danelaw, longships, Norse mythology","Tudors: Henry VIII, six wives, Reformation, Elizabeth I","Victorians: industrial revolution, empire, poverty, reform","WW1 and WW2: causes, trenches, home front, legacy"]},
    {id:"world_history",  name:"World History",               emoji:"🌐", minAge:8,
     desc:"Significant events and changes in world history",
     levels:["Ancient civilisations: Mesopotamia, Indus Valley, China","Medieval world: Crusades, Black Death, Islamic Golden Age","Age of exploration: Columbus, Vasco da Gama, Magellan","Industrial Revolution: steam, factories, social change","Modern world: WW1, WW2, Cold War, decolonisation"]},
    {id:"local_history",  name:"Local & Community History",   emoji:"🏘️", minAge:6,
     desc:"History of the local area, buildings and community",
     levels:["Describe changes to local area using old photos","Identify old buildings and their purpose","Find out how local area developed over time","Research using local archives, maps and census records","Compare local history with national events"]},
    {id:"chronology",     name:"Chronology & Historical Skills",emoji:"📅", minAge:5,
     desc:"Timelines, historical enquiry and source skills",
     levels:["Before/after, older/newer, ordering events in sequence","BC and AD, centuries, simple timelines","Primary and secondary sources, what is evidence?","Cause and consequence, similarity and difference","Significance, interpretation, historical argument"]},
  ],
  Geography: [
    {id:"uk_geo",         name:"UK Geography",                emoji:"🇬🇧", minAge:5,
     desc:"UK countries, cities, physical features and regions",
     levels:["4 countries, capital cities, surrounding seas","Counties, regions, major cities, Offa's Dyke","UK physical features: mountains, rivers, coasts","UK climate, land use, economic regions","Environmental issues, sustainability, UK in the world"]},
    {id:"world_geo",      name:"World Geography",             emoji:"🌍", minAge:6,
     desc:"Continents, countries, capitals and world features",
     levels:["7 continents and 5 oceans, basic locations","Major countries and capitals, equator and poles","Climate zones: tropical, polar, desert, temperate","Biomes, world rivers, mountain ranges, landmarks","Globalisation, trade, world population and migration"]},
    {id:"physical",       name:"Physical Geography",          emoji:"🏔️", minAge:7,
     desc:"Weather, landscapes, rivers and natural processes",
     levels:["Weather types, measuring, recording data","Landscapes: mountains, valleys, coasts, rivers","River formation, erosion, deposition, flooding","Volcanoes, earthquakes, tectonic plates","Climate change: causes, effects, action"]},
    {id:"human",          name:"Human Geography",             emoji:"🏙️", minAge:7,
     desc:"Settlement, land use, trade and economic activity",
     levels:["Differences between villages, towns, cities","Land use types: farming, industry, leisure, housing","How settlements grow and change over time","Trade links, economic activity, imports/exports","Migration, population, global development issues"]},
    {id:"maps",           name:"Maps & Fieldwork",            emoji:"🗺️", minAge:5,
     desc:"Map reading, grid references and fieldwork skills",
     levels:["Simple maps, symbols, compass N/S/E/W","4-figure grid references, map keys and scale","6-figure grid references, contour lines, OS maps","Interpreting Ordnance Survey maps, aerial photographs","GIS, satellite imagery, fieldwork data collection"]},
    {id:"environment",    name:"Environmental Geography",     emoji:"🌿", minAge:8,
     desc:"Climate change, sustainability and environmental action",
     levels:["How humans use and change the environment","Pollution: air, water, land — causes and effects","Deforestation, desertification, habitat loss","Climate change: greenhouse gases, rising temperatures","Sustainability, renewable energy, global solutions"]},
    {id:"fieldwork",      name:"Fieldwork & Local Study",     emoji:"🔭", minAge:7,
     desc:"Observing, recording and analysing the local area",
     levels:["Observe and describe features of local area","Simple surveys and data collection outside","Map own school grounds, use compasses","Land use survey, traffic count, questionnaires","Analyse results, draw conclusions, geographical argument"]},
  ],
  Computing: [
    {id:"algorithms",     name:"Algorithms & Sequencing",     emoji:"🔢", minAge:5,
     desc:"Step-by-step instructions, sequences and logic",
     levels:["Step-by-step instructions for everyday tasks","Sequences: what order, what happens next","Loops: repeating actions to save steps","Conditions: if this, then that — decisions","Nested loops, complex conditions, algorithm design"]},
    {id:"coding",         name:"Programming",                 emoji:"💻", minAge:6,
     desc:"Creating programs using Scratch-style block coding",
     levels:["Simple sequences in Scratch: move, turn, sound","Events: when key pressed, when sprite clicked","Loops: repeat, forever, count-controlled","Variables: store and change data in programs","Functions, parameters, debugging complex programs"]},
    {id:"networks",       name:"Networks & The Internet",     emoji:"🌐", minAge:7,
     desc:"How the internet works, websites and communication",
     levels:["What is the internet? Computers connected globally","The World Wide Web, websites, search engines","How email works, digital communication forms","How data travels: packets, routers, IP addresses","Cloud computing, cybersecurity, HTTPS and encryption"]},
    {id:"data",           name:"Data & Information",          emoji:"📊", minAge:6,
     desc:"Collecting, organising and presenting data",
     levels:["Data: information we collect, store and use","Binary: computers use 0s and 1s, pixels","Spreadsheets: entering, sorting, filtering data","Charts and graphs from data, patterns and trends","Databases, big data, data analysis and ethics"]},
    {id:"esafety",        name:"E-Safety & Digital Literacy", emoji:"🛡️", minAge:5,
     desc:"Staying safe online, personal information and rights",
     levels:["Personal information: what is private, who to tell","Cyberbullying: recognise, report, how to help","Reliable information: not everything online is true","Passwords, privacy settings, safe browsing","Digital footprint, copyright, responsible use"]},
    {id:"creative",       name:"Creative Computing",          emoji:"🎨", minAge:7,
     desc:"Creating digital content: art, music, video, presentations",
     levels:["Create digital artwork using painting tools","Create simple animations frame by frame","Record and edit audio, podcasts, voice overs","Create multimedia presentations with images and sound","Design websites, video editing, digital publishing"]},
  ],
};

const US_CURRICULUM = {
  Math: [
    {id:"counting",       name:"Counting & Cardinality",      emoji:"🔢", minAge:5,
     desc:"Count to 100, compare numbers, understand quantity — Kindergarten",
     levels:["Count to 20, one-to-one correspondence, cardinality","Count to 100, count on from any number, compare groups","Skip count by 2s, 5s, 10s, even and odd numbers","Place value to 1,000, compare and order 3-digit numbers","Place value to 1,000,000, rounding, comparing large numbers"]},
    {id:"operations",     name:"Operations & Algebraic Thinking",emoji:"➕", minAge:5,
     desc:"Addition, subtraction, multiplication, division — word problems",
     levels:["Add and subtract within 10, word problems with objects","Add/subtract within 20, relate addition to subtraction","Multiplication as equal groups, division as sharing fairly","Multiply/divide within 100, properties of operations","Multi-step word problems, factors, multiples, patterns"]},
    {id:"base_ten",       name:"Number & Operations — Base Ten",emoji:"🔟", minAge:5,
     desc:"Place value, multi-digit arithmetic and rounding",
     levels:["Compose/decompose numbers 11-19 using tens and ones","Understand hundreds, add/subtract 2-digit numbers","Round to nearest 10/100, add/subtract within 1,000","Multi-digit multiplication, divide with remainders","Multiply multi-digit numbers, divide 4-digit by 2-digit"]},
    {id:"fractions",      name:"Fractions & Decimals",         emoji:"½",  minAge:7,
     desc:"Unit fractions, equivalent fractions, operations",
     levels:["Equal parts of a whole, halves, fourths, thirds","Unit fractions on number line, equivalent fractions","Fractions greater than 1, compare with same denominator","Add/subtract fractions same denominator, multiply by whole","Add/subtract unlike denominators, multiply/divide fractions"]},
    {id:"measurement_us", name:"Measurement & Data",           emoji:"📏", minAge:5,
     desc:"Measuring length, time, money, graphs and data",
     levels:["Order by length/height/weight, above and below","Measure in inches and centimeters, tell time to hour","Measure to nearest quarter inch, bar graphs, picture graphs","Perimeter of polygons, area by counting, time intervals","Convert measurement units, volume, line plots, data analysis"]},
    {id:"geometry_us",    name:"Geometry",                     emoji:"📐", minAge:5,
     desc:"2D/3D shapes, area, perimeter and coordinate plane",
     levels:["Name 2D and 3D shapes, sort by attributes","Partition shapes into equal parts, halves, fourths","Understand perimeter, identify quadrilaterals, area","Lines, angles, symmetry, classify triangles and quadrilaterals","Coordinate plane, graph points, classify 2D figures"]},
    {id:"number_system",  name:"The Number System",            emoji:"🔣", minAge:9,
     desc:"Factors, multiples, decimals and negative numbers",
     levels:["Factors and multiples, prime and composite numbers","Decimal notation, compare decimals to thousandths","Negative numbers on number line, absolute value","GCF and LCM, fraction/decimal/percent equivalence","Rational numbers, operations with integers"]},
    {id:"expressions",    name:"Expressions & Equations",      emoji:"📐", minAge:10,
     desc:"Variables, simple equations and inequalities",
     levels:["Understand variables, evaluate expressions","Write and solve one-step equations","Write and graph inequalities","Dependent and independent variables","Analyse patterns, represent relationships"]},
  ],
  "English Language Arts": [
    {id:"reading_lit",    name:"Reading — Literature",         emoji:"📚", minAge:5,
     desc:"Key ideas, story structure, character and theme",
     levels:["Retell stories, identify characters, setting, events","Ask and answer questions, central message, lesson","Describe characters and how they affect the story","Determine theme, summarise, compare stories and myths","Quote accurately, compare themes, analyse how chapters fit"]},
    {id:"reading_info",   name:"Reading — Informational Text", emoji:"📰", minAge:5,
     desc:"Main idea, text features and author's purpose",
     levels:["Identify main topic, key details, connections","Ask and answer questions, identify main idea, retell","Determine main idea, explain how reasons support it","Determine main idea, explain how examples support it","Quote text, determine main idea, explain author's purpose"]},
    {id:"foundational",   name:"Foundational Reading Skills",  emoji:"🔤", minAge:4,
     desc:"Phonics, phonological awareness and reading fluency",
     levels:["Phonemic awareness: rhyme, syllables, initial sounds","Letter-sound relationships, decode CVC words","Vowel teams, blends, digraphs, sight words 100","R-controlled vowels, prefixes/suffixes, fluency grade 2","Multisyllabic words, fluency with grade 3 texts"]},
    {id:"writing_us",     name:"Writing",                      emoji:"✏️", minAge:5,
     desc:"Opinion, informational and narrative writing",
     levels:["Write name, draw and write about topics","Write opinion with reason, informational, narrative","Write opinion with multiple reasons, informational reports","Write structured opinion, informational, narrative essays","Research-based writing, precise language, clear structure"]},
    {id:"speaking",       name:"Speaking & Listening",         emoji:"🗣️", minAge:5,
     desc:"Collaborative discussions and presentations",
     levels:["Participate in conversations, follow rules for discussion","Build on others' talk, ask clarifying questions","Determine main ideas, report on topics clearly","Engage in discussion, report on topics with facts","Adapt speech for context, present claims, multimedia"]},
    {id:"language_us",    name:"Language & Grammar",           emoji:"📝", minAge:5,
     desc:"Grammar conventions, vocabulary and figurative language",
     levels:["Print letters, capitalisation, end punctuation","Nouns, verbs, adjectives, commas in series","Irregular nouns/verbs, adjectives, adverbs, commas","Relative pronouns/adverbs, progressive verbs, modifiers","Perfect verbs, shifts in verb tense, correlative conjunctions"]},
  ],
  Science: [
    {id:"earth_space_us", name:"Earth & Space Science",        emoji:"🌍", minAge:5,
     desc:"Weather, Earth materials, solar system — NGSS aligned",
     levels:["Weather patterns: sunny, rainy, snowy, seasonal changes","Earth materials: rocks, soil, water — properties and uses","Earth's surface: mountains, valleys, plains, water bodies","Solar system: sun, moon, planets, Earth's rotation","Earth processes: erosion, weathering, water cycle, fossils"]},
    {id:"life_science",   name:"Life Science",                 emoji:"🌿", minAge:5,
     desc:"Plants, animals, ecosystems and heredity — NGSS aligned",
     levels:["Needs of living things: plants and animals, survival","Life cycles: plants, insects, frogs, birds","Ecosystems: food chains, habitats, interdependence","Heredity: traits from parents, variation, adaptation","Natural selection, evolution evidence, biodiversity"]},
    {id:"physical_sci",   name:"Physical Science",             emoji:"⚡", minAge:6,
     desc:"Matter, forces, motion and energy — NGSS aligned",
     levels:["Properties of matter: solid, liquid, gas, weight, volume","Forces and motion: pushes/pulls, speed, direction","Energy: light, heat, sound, electrical — forms and transfer","Waves: light and sound properties, communication","Chemical reactions, conservation of matter, energy transfer"]},
    {id:"engineering",    name:"Engineering Design",           emoji:"🔧", minAge:6,
     desc:"Define problems, design solutions, test and improve",
     levels:["Identify a problem, brainstorm and choose a solution","Build and test a model, improve based on results","Define criteria and constraints, compare solutions","Optimise solutions, communicate results scientifically","System thinking, trade-offs, societal impact of solutions"]},
  ],
  "Social Studies": [
    {id:"community",      name:"Community & Citizenship",      emoji:"🏘️", minAge:5,
     desc:"Rules, rights, responsibilities and community roles",
     levels:["Classroom and school rules, why we have them","Community helpers: police, firefighters, doctors, teachers","Rights and responsibilities at home, school, community","Local government: mayor, city council, how decisions made","State and national government, Constitution, Bill of Rights"]},
    {id:"us_history",     name:"American History",             emoji:"🦅", minAge:6,
     desc:"Native Americans through Civil Rights Movement",
     levels:["Native American peoples: culture, traditions, regions","Colonial America: Pilgrims, Jamestown, 13 colonies","American Revolution: causes, key figures, Declaration of Independence","Civil War: slavery, Lincoln, battles, abolition, Reconstruction","Civil Rights Movement: segregation, MLK, Rosa Parks, legislation"]},
    {id:"world_hist_us",  name:"World History",                emoji:"🌐", minAge:8,
     desc:"Ancient civilisations to modern global events",
     levels:["Ancient Egypt, Greece, Rome: achievements and legacy","Medieval world: feudalism, Crusades, Black Death, Islam","Age of Exploration: Columbus, conquistadors, colonisation","Industrial Revolution, imperialism, World War 1","World War 2, Cold War, decolonisation, modern global issues"]},
    {id:"us_geography",   name:"US Geography",                 emoji:"🇺🇸", minAge:6,
     desc:"50 states, regions, physical features and human geography",
     levels:["Cardinal directions, map symbols, continents and oceans","US regions: Northeast, Southeast, Midwest, Southwest, West","50 states and capitals, major physical features","US climate zones, rivers (Mississippi), mountain ranges","US population, cities, economic regions, immigration patterns"]},
    {id:"world_geo_us",   name:"World Geography",              emoji:"🌍", minAge:7,
     desc:"Continents, countries, cultures and world issues",
     levels:["7 continents, 5 oceans, major countries and capitals","Physical geography: biomes, climate zones, landforms","Human geography: population, urbanisation, migration","Cultural diversity: language, religion, customs worldwide","Global issues: trade, climate, conflict, interdependence"]},
    {id:"economics_us",   name:"Economics & Financial Literacy",emoji:"💵", minAge:7,
     desc:"Needs vs wants, money, trade and economic systems",
     levels:["Needs vs wants, goods and services, making choices","Earning, spending, saving, importance of budgeting","Supply and demand, producers and consumers, markets","Trade: imports, exports, comparative advantage, global trade","Economic systems, entrepreneurship, personal finance"]},
  ],
  Computing: [
    {id:"comp_thinking",  name:"Computational Thinking",       emoji:"🧠", minAge:5,
     desc:"Decomposition, patterns, abstraction and algorithms",
     levels:["Break problems into steps, spot patterns in sequences","Decompose complex tasks, identify what to ignore","Algorithm design, precise unambiguous instructions","Generalise solutions, evaluate efficiency of solutions","Abstraction in code, modelling real-world problems"]},
    {id:"programming_us", name:"Programming",                  emoji:"💻", minAge:6,
     desc:"Creating programs in Scratch and text-based languages",
     levels:["Scratch: sequences, events, motion and sounds","Scratch: loops, conditions, variables","Scratch: functions/sprites, simple games and stories","Python/JS introduction: variables, loops, conditions","Functions, lists, debugging, sharing and collaborating"]},
    {id:"networks_us",    name:"Networks & The Internet",      emoji:"🌐", minAge:7,
     desc:"How the internet works and digital communication",
     levels:["Devices connect to share information, basic network","The internet vs World Wide Web, search effectively","Email, messaging, video calls — digital communication tools","How websites work: HTML basics, DNS, IP addresses","Cybersecurity: threats, protection, staying safe online"]},
    {id:"data_us",        name:"Data & Analysis",              emoji:"📊", minAge:6,
     desc:"Collecting, visualising and interpreting data",
     levels:["Collect and organise data, tally charts, pictographs","Spreadsheets: enter and sort data, simple charts","Create graphs, identify patterns and outliers","Database queries, filtering and sorting complex data","Statistical thinking, bias in data, ethical data use"]},
    {id:"digital_citizen",name:"Digital Citizenship",          emoji:"🛡️", minAge:5,
     desc:"Online safety, privacy and responsible technology use",
     levels:["Personal information: private vs public, trusted adults","Cyberbullying: recognise, respond, report, empathy","Media balance, screen time, healthy technology habits","Privacy settings, strong passwords, phishing awareness","Digital footprint, copyright, fair use, credibility of sources"]},
    {id:"impacts",        name:"Impacts of Computing",         emoji:"🤖", minAge:8,
     desc:"How technology shapes society, AI and the future",
     levels:["How computers help us: medicine, transport, communication","Automation: jobs technology does, jobs humans do","Artificial intelligence: what it is, examples in daily life","Social media: benefits, risks, misinformation, mental health","Ethical computing: bias, accessibility, environmental impact"]},
  ],
};

const CA_CURRICULUM = {
  Mathematics: [
    {id:"number_sense",   name:"Number Sense",                 emoji:"🔢", minAge:4,
     desc:"Counting, place value, fractions and operations — Ontario aligned",
     levels:["Count to 50, subitize groups, compare quantities (Kindergarten)","Numbers to 200, place value, addition/subtraction to 20","Numbers to 1000, multiplication/division patterns, fractions","Multi-digit operations, fractions on number line, decimals intro","Operations with fractions and decimals, ratios, proportional reasoning"]},
    {id:"algebra_ca",     name:"Algebra",                      emoji:"🔣", minAge:7,
     desc:"Patterns, relationships, variables and equations",
     levels:["Identify and extend repeating and growing patterns","Describe patterns with tables and rules","Represent patterns with variables, solve simple equations","Linear patterns, algebraic expressions, solving equations","Systems of relationships, algebraic modelling, coding connections"]},
    {id:"data_ca",        name:"Data Literacy",                emoji:"📊", minAge:5,
     desc:"Collecting, organising and interpreting data — statistics",
     levels:["Sort and classify objects, simple graphs (pictographs)","Bar graphs, tally charts, ask questions about data","Stem-and-leaf plots, mean/median/mode intro, bias awareness","Scatter plots, correlation, data collection methods","Statistical reasoning, probability, census vs sample"]},
    {id:"spatial",        name:"Spatial Sense",                emoji:"📐", minAge:5,
     desc:"2D/3D shapes, measurement, location and transformation",
     levels:["Name 2D/3D shapes, describe location, measure length","Perimeter, area basics, angles as turns, coordinate grid","Area of rectangles, volume basics, transformations","Surface area, volume of prisms, Cartesian plane, scale","Pythagorean theorem intro, geometric reasoning, design projects"]},
    {id:"financial",      name:"Financial Literacy",           emoji:"💰", minAge:6,
     desc:"Money, earning, spending, saving and budgeting",
     levels:["Identify coins and bills, make amounts, simple purchases","Estimate costs, make change, save for a goal","Budgeting: income vs expenses, wants vs needs, planning","Interest, taxes intro, charitable giving, consumer rights","Credit, debt, financial planning, economic citizenship"]},
    {id:"social_emo",     name:"Social-Emotional Learning",    emoji:"❤️", minAge:5,
     desc:"Growth mindset, problem-solving and resilience in learning",
     levels:["I can learn from mistakes, try different strategies","Identify helpful vs unhelpful thinking, persist with challenges","Reflect on learning, seek help, collaborate on problems","Manage frustration, set goals, monitor own learning","Self-advocacy, mentor others, contribute to math community"]},
  ],
  Language: [
    {id:"reading_ca",     name:"Reading",                      emoji:"📖", minAge:4,
     desc:"Phonics, decoding, fluency and comprehension — Ontario",
     levels:["Letter sounds, phonemic awareness, 45 core phonemes, CVC words","Blending and segmenting, common sight words, simple books","Fluency with grade-level texts, monitor comprehension","Text features, main idea, inference, author's craft","Critical literacy, comparing perspectives, synthesising across texts"]},
    {id:"writing_ca",     name:"Writing",                      emoji:"✏️", minAge:5,
     desc:"Narrative, expository, persuasive and multimedia writing",
     levels:["Write simple sentences about familiar topics with pictures","Paragraph structure, narrative with beginning/middle/end","Multi-paragraph writing, persuasive letters, research reports","Complex narratives, formal/informal register, citation basics","Extended essays, argument writing, multimedia composition"]},
    {id:"oral",           name:"Oral Communication",           emoji:"🗣️", minAge:4,
     desc:"Listening, speaking, discussion and presentation skills",
     levels:["Follow simple instructions, speak in full sentences, listen actively","Small group discussion, take turns, ask relevant questions","Present information clearly, active listening strategies","Formal presentations, debate, adjusting for audience and purpose","Lead discussions, evaluate effectiveness, interview techniques"]},
    {id:"media_ca",       name:"Media Literacy",               emoji:"📱", minAge:6,
     desc:"Analyse, create and evaluate media texts — digital literacy",
     levels:["Identify different types of media, messages in advertising","Identify point of view in media, create simple media texts","Analyse how media constructs meaning, audience awareness","Evaluate credibility of online sources, responsible creation","Media and identity, algorithmic bias, ethical media production"]},
  ],
  "Science & Technology": [
    {id:"life_systems",   name:"Life Systems",                 emoji:"🌿", minAge:5,
     desc:"Plants, animals, human body, habitats and ecosystems",
     levels:["Needs of living things, parts of plants, animals and habitats","Life cycles of plants and animals, growth and change","Human body systems, nutrition, health and well-being","Ecosystems: food chains, biotic/abiotic, biodiversity","Population dynamics, human impact on ecosystems, conservation"]},
    {id:"matter_ca",      name:"Matter & Materials",           emoji:"🧪", minAge:5,
     desc:"Properties of materials, states of matter and changes",
     levels:["Properties of materials, sort by: hard/soft, magnetic","States of matter: solid, liquid, gas, observable changes","Physical vs chemical changes, mixtures, solutions","Particle model, changes of state, heat and temperature","Atomic structure basics, periodic table intro, chemical reactions"]},
    {id:"energy_ca",      name:"Energy & Control",             emoji:"⚡", minAge:7,
     desc:"Forces, motion, electricity, light and sound",
     levels:["Push/pull forces, magnets attract/repel, simple machines","Electricity: circuits, series, safety, conductors/insulators","Light: sources, reflection, refraction, colour spectrum","Sound: vibrations, pitch, volume, how sound travels","Forms of energy, energy transformation, conservation of energy"]},
    {id:"structures",     name:"Structures & Mechanisms",      emoji:"🏗️", minAge:6,
     desc:"Simple machines, structures, forces and design process",
     levels:["Strong shapes in structures, build stable structures","Simple machines: lever, pulley, wheel, ramp, screw","Mechanical advantage, gears, pneumatics and hydraulics","Design process: identify, design, build, test, improve","Complex structures, loads, materials engineering, systems"]},
    {id:"earth_ca",       name:"Earth & Space Systems",        emoji:"🌍", minAge:6,
     desc:"Rocks, water cycle, weather, climate and solar system",
     levels:["Rocks and minerals, soil formation, erosion","Water cycle: evaporation, condensation, precipitation","Weather patterns, climate vs weather, Canadian climate regions","Solar system, moon phases, Earth's rotation and revolution","Climate change, human impact, sustainability, Indigenous knowledge"]},
  ],
  "Social Studies": [
    {id:"canadian",       name:"Canadian Heritage & Identity", emoji:"🍁", minAge:6,
     desc:"First Nations, colonial history, Confederation and modern Canada",
     levels:["My community: home, school, neighbourhood, local leaders","First Nations peoples: diverse cultures, traditions, land relationships","New France and British colonisation: fur trade, conflict, cultural exchange","Confederation 1867: Fathers of Confederation, why Canada united","WW1, WW2, peacekeeping: Canada's role and contribution"]},
    {id:"ca_geography",   name:"Canadian Geography",           emoji:"🗺️", minAge:5,
     desc:"Provinces, territories, physical features and regions",
     levels:["Province and territory names and capitals on a map","Natural regions: Canadian Shield, Prairies, Rockies, Arctic","Physical features: Great Lakes, St. Lawrence, Rocky Mountains","Climate regions, natural resources, Indigenous territories","Population distribution, urbanisation, regional identity"]},
    {id:"world_hist_ca",  name:"World History & Global Geography",emoji:"🌐", minAge:7,
     desc:"Ancient civilisations, exploration and global connections",
     levels:["Ancient civilisations: Egypt, Greece, Rome, China, Mesopotamia","Medieval world: feudalism, Islam, trade routes, Black Death","Age of Exploration: European contact, colonisation and its impacts","Industrial Revolution, imperialism, WW1 and WW2 global impact","Cold War, decolonisation, United Nations, modern global issues"]},
    {id:"government_ca",  name:"Government & Citizenship",     emoji:"⚖️", minAge:7,
     desc:"Democratic government, rights, responsibilities and law",
     levels:["Rules vs laws, class rules, school community decisions","Municipal government: mayor, councillors, local services","Provincial government: Premier, MPPs, how laws are made","Federal government: Prime Minister, Parliament, Constitution","Canadian Charter of Rights and Freedoms, Indigenous rights, treaties"]},
    {id:"economics_ca",   name:"Economics & Sustainable Development",emoji:"🌱", minAge:7,
     desc:"Resources, trade, financial literacy and sustainability",
     levels:["Needs vs wants, goods and services, producers and consumers","Natural resources: renewable vs non-renewable, responsible use","Trade: why Canada trades, imports/exports, major trading partners","Economic systems, entrepreneurship, Indigenous economic models","Sustainable development goals, green economy, global responsibility"]},
    {id:"global_issues",  name:"Global Issues & Perspectives", emoji:"🌐", minAge:9,
     desc:"Sustainability, climate, human rights and global connections",
     levels:["Global citizenship: rights and responsibilities worldwide","Climate change: causes, effects, Canadian and global action","Poverty and inequality: causes, solutions, international aid","Conflict, peacekeeping and the UN: Canada's role","Sustainable Development Goals, activism, making a difference"]},
  ],
  "Computer Studies": [
    {id:"comp_think_ca",  name:"Computational Thinking",       emoji:"🧠", minAge:5,
     desc:"Algorithms, decomposition, patterns and problem-solving",
     levels:["Follow and give step-by-step instructions, spot patterns","Decompose problems, identify what information is needed","Design algorithms, evaluate different solutions","Generalise solutions, use abstraction to simplify problems","Model complex problems, optimise solutions, evaluate efficiency"]},
    {id:"coding_ca",      name:"Coding & Programming",         emoji:"💻", minAge:6,
     desc:"Scratch, Python and block-based programming",
     levels:["Scratch: sequences, events, sprites and backdrops","Scratch: loops, conditionals, variables, simple games","Python intro: print, input, variables, if/else statements","Python: loops, functions, lists, debug and test programs","Projects: create original programs, collaborate, present code"]},
    {id:"digital_cit_ca", name:"Digital Citizenship",          emoji:"🛡️", minAge:5,
     desc:"Online safety, privacy, wellbeing and responsible use",
     levels:["Personal information safety, trusted adults, reporting concerns","Cyberbullying: recognition, empathy, bystander responsibility","Screen time balance, mental health, healthy digital habits","Critical thinking online: misinformation, advertising, algorithms","Privacy rights, digital footprint, responsible content creation"]},
    {id:"data_ca2",       name:"Data Literacy & Computing",    emoji:"📊", minAge:7,
     desc:"Collecting, analysing and presenting data ethically",
     levels:["Collect and record data, simple graphs and charts","Spreadsheets: sort, filter, create charts from data","Statistical thinking: mean, median, bias, sampling","Database design, queries, analysis of large data sets","Ethical data use, privacy, AI and machine learning basics"]},
  ],
};

// ── Active curriculum selector ────────────────────────────────────────────
// Returns the curriculum for the child's country
function getCurriculum(country) {
  if(country === "US") return US_CURRICULUM;
  if(country === "CA") return CA_CURRICULUM;
  return UK_CURRICULUM; // default to UK
}

// Subject names per country
const SUBJECT_NAMES = {
  UK: ["Maths","English","Science","History","Geography","Computing"],
  US: ["Math","English Language Arts","Science","Social Studies","Computing"],
  CA: ["Mathematics","Language","Science & Technology","Social Studies","Computer Studies"],
};

// Canonical subjects for display (maps to country-specific names)
function getSubjects(country) {
  return SUBJECT_NAMES[country] || SUBJECT_NAMES.UK;
}

// Legacy CURRICULUM for backward compatibility
const CURRICULUM = UK_CURRICULUM;


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
async function claude(system, msg) {
  try {
    const r = await fetch("/api/chat",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1200,system,
        messages:[{role:"user",content:msg}]}),
    });
    const d = await r.json();
    const t = d.content?.find(b=>b.type==="text")?.text||"";
    const s=t.indexOf("{"),e=t.lastIndexOf("}");
    if(s===-1||e===-1) return null;
    return JSON.parse(t.slice(s,e+1));
  } catch(e){console.error(e);return null;}
}

const diagSys = (name,age,country,year,subject) =>
  `You are ADAPT, friendly AI tutor. ONE diagnostic question.
Child: ${name}, age ${age}, ${country} (${year}), Subject: ${subject}
Language: ${age<=6?"Very simple, max 1 short sentence":"Clear and friendly 1-2 sentences"}
Return ONLY valid JSON no markdown:
{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"A","explanation":"simple 1-sentence","difficulty":"easy"}`;

const sessionSys = (child, subject, topic, mode, sC, sT, askedQs=[]) => {
  const t=TUTORS[child.tutor];
  const acc=sT>0?sC/sT:0.5;
  const easier=acc<0.45&&sT>=3, harder=acc>0.82&&sT>=3;
  const topicLevel=topic?(child.topicLevels?.[subject]?.[topic.id]||1):child.level[subject];
  return `You are ${child.tutor}. Style: ${t.style}
Child: ${child.name}, age ${child.age}, ${child.country} (${child.yearGroup})
Subject: ${subject}
Topic: ${topic?.name||subject}
Country curriculum: ${child.country||"UK"} — questions must align to ${child.country||"UK"} national curriculum standards
Level: ${topicLevel} (${getLevelContext(topicLevel)})
Curriculum context: ${topic?.levels?.[Math.min(topicLevel-1,4)]||"age-appropriate content"}
Year group: ${child.yearGroup} (${child.country||"UK"})
Accuracy: ${Math.round(acc*100)}% (${sT} questions)
${easier?"Child is struggling — make it easier, add a helpful hint":""}${harder?"Child is excelling — push harder, increase complexity":""}
IMPORTANT: 
- Generate ONE question at level ${topicLevel} difficulty
- These EXACT questions have already been asked — DO NOT repeat them: ${askedQs.slice(-10).join(' ||| ')||'none yet'}
- You MUST generate a completely different question on a different aspect of the topic
- Vary the format each time: multiple choice, true/false, fill the blank, word problems, what-comes-next
- If stuck, approach the topic from a completely different angle
${easier?"⚠️ Struggling — easier + hint":""}${harder?"✨ Excelling — slightly harder":""}
Language: ${child.age<=6?"Very simple max 1 sentence":"Clear friendly"}
${mode==="visual"?"Include SVG 220x140px illustrating the TOPIC ONLY — never show the answer, never label the correct option, never include text that gives away the answer.":""}
Return ONLY valid JSON:
{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":"A","explanation":"in ${child.tutor} style","hint":"${easier?"helpful hint":""}","encouragement":"short ${child.tutor} celebration","difficulty":"easy|medium|hard"${mode==="visual"?`,"svg":"<svg width='220' height='140' viewBox='0 0 220 140' xmlns='http://www.w3.org/2000/svg'><!-- bright simple illustration --></svg>"`:""}}`
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
function speak(text, tutorName) {
  if(!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const cleaned = cleanForSpeech(text);
  const u = new SpeechSynthesisUtterance(cleaned);
  const v = TUTORS[tutorName]?.voice || {rate:0.88, pitch:1.05};
  u.rate = v.rate; u.pitch = v.pitch; u.volume = 1;
  const go = () => {
    const voices = window.speechSynthesis.getVoices();
    const pick =
      voices.find(v => v.name.includes("Samantha")) ||
      voices.find(v => v.name.includes("Karen"))    ||
      voices.find(v => v.name.includes("Daniel"))   ||
      voices.find(v => v.lang === "en-GB" && v.localService) ||
      voices.find(v => v.lang === "en-US" && v.localService) ||
      voices.find(v => v.lang.startsWith("en") && v.localService) ||
      voices.find(v => v.lang.startsWith("en")) ||
      voices[0];
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
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {options?.map(opt=>{
        const right=opt.charAt(0)===correct,isSel=opt===selected;
        const bg=answered&&right?C.gLight:answered&&isSel&&!right?C.rLight:C.bg;
        const bc=answered&&right?C.green:answered&&isSel&&!right?C.red:C.border;
        const tc=answered&&right?C.green:answered&&isSel&&!right?C.red:C.text;
        return <button key={opt} onClick={()=>onAnswer(opt)} disabled={answered} style={{padding:"13px 11px",borderRadius:12,border:`2px solid ${bc}`,background:bg,color:tc,fontSize:14,fontWeight:700,textAlign:"left",lineHeight:1.4,fontFamily:F,cursor:answered?"default":"pointer",transition:"all 0.15s"}}>{opt}</button>;
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
  const PER=3,TOTAL=SUBJECTS.length*PER; // 3 per subject = 18 total for better placement
  const [si,setSi]=useState(0);
  const [qi,setQi]=useState(0);
  const [q,setQ]=useState(null);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  const [ans,setAns]=useState(false);
  const [results,setResults]=useState({});
  const sub=SUBJECTS[si],overall=si*PER+qi;

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
      if(si+1>=SUBJECTS.length){
        const levels={};
        SUBJECTS.forEach(s=>{const r=results[s]||{correct:0,total:PER};levels[s]=r.correct/r.total>=0.8?3:r.correct/r.total>=0.5?2:1;});
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
function ChildDash({child,isParentView,onSession,onGames,onBadges,onParentView,onMyStats,onSignOut}) {
  const tutor=TUTORS[child.tutor]||TUTORS.sparky;
  const tColor=tutor?.color||C.primary;
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
      <div style={{paddingTop:0}}>
        {/* ── Clean Header ── */}
        <div style={{background:`linear-gradient(135deg,${tColor},${tColor}CC)`,padding:"20px 20px 24px",marginBottom:16}}>
          {isParentView&&(
            <div style={{marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.8)"}}>👁️ Viewing as {child.name}</span>
              <button onClick={onParentView} style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.8)",background:"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",fontFamily:F,padding:"4px 10px",borderRadius:8}}>← Parent view</button>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <AvatarCircle avatar={child.avatar} size={48} color="rgba(255,255,255,0.3)"/>
              <div>
                <p style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.75)"}}>{greeting} 👋</p>
                <h2 style={{fontSize:24,fontWeight:900,color:"#fff"}}>{child.name}</h2>
              </div>
            </div>
            <div style={{textAlign:"center",background:"rgba(255,255,255,0.2)",borderRadius:16,padding:"10px 14px"}}>
              <p style={{fontSize:22}}>🔥</p>
              <p style={{fontSize:16,fontWeight:900,color:"#fff"}}>{child.streak}</p>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.75)",fontWeight:700}}>day streak</p>
            </div>
          </div>
          {/* XP bar */}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.8)"}}>Level {Math.floor(child.xp/100)+1}</span>
              <span style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.8)"}}>{child.xp%100}/100 XP</span>
            </div>
            <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.25)"}}>
              <div style={{height:"100%",width:`${child.xp%100}%`,borderRadius:4,background:"#fff",transition:"width 0.5s"}}/>
            </div>
          </div>
        </div>

        {/* ── Tutor message ── */}
        <div style={{padding:"0 16px",marginBottom:16}}>
          <Bubble tutor={child.tutor} text={child.total>0?`Welcome back ${child.name}! Ready to keep learning? 🚀`:`Welcome ${child.name}! Your first lesson is ready. Let's discover something amazing! 🎉`}/>
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
                  style={{padding:"14px 8px",borderRadius:16,background:C.surface,border:`1.5px solid ${sc.color}20`,cursor:"pointer",fontFamily:F,textAlign:"center",transition:"all 0.2s",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                  <span style={{fontSize:26,display:"block",marginBottom:6}}>{sc.emoji}</span>
                  <p style={{fontSize:12,fontWeight:800,color:sc.color,marginBottom:2}}>{s}</p>
                  <p style={{fontSize:10,fontWeight:700,color:diff.color}}>{diff.emoji} Lv.{lvl}</p>
                </button>
              );
            })}
          </div>

          {/* Games row */}
          <button onClick={onGames} style={{width:"100%",padding:"14px 20px",borderRadius:16,background:"linear-gradient(135deg,#1E1B4B,#312E81)",border:"none",cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16}}>
            <span style={{fontSize:22}}>🎮</span>
            <span style={{fontSize:15,fontWeight:800,color:"#fff"}}>Mini Games</span>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginLeft:4}}>12 games</span>
          </button>
        </div>

        {/* ── Stats row ── */}
        <div style={{padding:"0 16px",marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[
              {e:"🏅",v:(child.badges||[]).length,l:"Badges",fn:onBadges},
              {e:"🎯",v:child.total>0?Math.round(child.correct/child.total*100)+"%":"—",l:"Accuracy"},
              {e:"⭐",v:child.xp,l:"XP"},
            ].map(s=>(
              <button key={s.l} onClick={s.fn||null}
                style={{padding:"14px 8px",borderRadius:14,background:C.surface,border:`1px solid ${C.border}`,cursor:s.fn?"pointer":"default",fontFamily:F,textAlign:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
                <span style={{fontSize:22,display:"block",marginBottom:4}}>{s.e}</span>
                <p style={{fontSize:18,fontWeight:900,color:C.text}}>{s.v}</p>
                <p style={{fontSize:10,color:C.muted,fontWeight:700}}>{s.l}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Bottom buttons ── */}
        <div style={{padding:"0 16px 32px"}}>
          {!isParentView&&<Btn onClick={onMyStats} v="ghost" style={{width:"100%",marginBottom:10}}>📊 My Progress</Btn>}
          {!isParentView&&<Btn onClick={onSignOut} v="ghost" style={{width:"100%",marginBottom:10}}>🚪 Sign Out</Btn>}
          {!isParentView&&<button onClick={()=>{if(window.confirm("Report an issue with a question or content?"))alert("Thank you! Our team will review this.");}} style={{fontSize:12,fontWeight:700,color:C.muted,background:"none",border:"none",cursor:"pointer",fontFamily:F,width:"100%"}}>🚩 Report a content issue</button>}
        </div>
      </div>
    </Screen>
  );
}


function Session({child,startSubject,startTopic,onComplete,onUpdate,onExit,a11y={}}) {
  const MAX=10;
  const [subject,setSub]=useState(startSubject||"Maths");
  const [topic,setTopic]=useState(startTopic||null);
  const [qNum,setQNum]=useState(0);
  const [mode,setMode]=useState(child.controls?.modeLock||(a11y.alwaysAudio?'audio':null)||child.mode);
  const [q,setQ]=useState(null);
  const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);
  const [ans,setAns]=useState(false);
  const [sC,setSC]=useState(0);
  const [sT,setST]=useState(0);
  const [sXP,setSXP]=useState(0);
  const [qS,setQS]=useState(0);
  const [done,setDone]=useState(false);
  const [paused,setPaused]=useState(false);
  const [showTest,setShowTest]=useState(false);
  const [topicQCount,setTopicQCount]=useState(0);
  const [askedQs,setAskedQs]=useState([]);
  const topicLevel=topic?(child.topicLevels?.[subject]?.[topic?.id]||1):child.level[subject]||1;
  const mRef=useRef(mode);
  useEffect(()=>{mRef.current=mode;},[mode]);

  const rot=(cur)=>startSubject?startSubject:SUBJECTS[(SUBJECTS.indexOf(cur)+1)%SUBJECTS.length];

  const load=async(sub,m)=>{
    setLoading(true);setSel(null);setAns(false);
    const cm=m??mRef.current;
    const r=await claude(sessionSys({...child,level:child.level},sub,topic,cm,sC,sT,askedQs),"Generate the next question. Make sure it is completely different from previous questions.");
    // If question already asked this session, request a new one
    if(r?.question && askedQs.includes(r.question)) {
      const r2=await claude(sessionSys({...child,level:child.level},sub,topic,cm,sC,sT,askedQs),"Generate a DIFFERENT question. The previous one was repeated. Make it completely new.");
      setQ(r2||r);
    } else {
      setQ(r);
    }
    setLoading(false);
    if(cm==="audio"&&r) setTimeout(()=>speak(r.question,child.tutor),400);
  };
  useEffect(()=>{load(subject,mode);},[]);

  const answer=(opt)=>{
    if(ans) return;
    setSel(opt);setAns(true);
    const ok=opt.charAt(0)===q?.correct;
    const xp=ok?(q?.difficulty==="hard"?15:q?.difficulty==="medium"?10:7):2;
    const nc=sC+(ok?1:0),nt=sT+1;
    setSC(nc);setST(nt);setSXP(x=>x+xp);setQS(s=>ok?s+1:0);
    // Track per-topic-per-level question count
    if(topic) {
      const key = `${subject}_${topic.id}_lv${topicLevel}`;
      const currentCount = (child.topicQCounts||{})[key]||0;
      const newCount = currentCount + 1;
      const updatedCounts = {...(child.topicQCounts||{}), [key]: newCount};
      onUpdate({topicQCounts: updatedCounts});
      // Trigger test after 50 questions at this level
      if(newCount >= 50 && !showTest) setShowTest(true);
    }
    setTopicQCount(c=>c+1);
    const nl={...child.level};
    const ntl={...child.topicLevels,...Object.fromEntries(Object.entries(child.topicLevels||{}).map(([s,v])=>[s,{...v}]))};
    const acc=nc/nt;
    if(nt>0&&nt%5===0){
      if(acc>0.80&&nl[subject]<5)nl[subject]++;
      if(acc<0.40&&nl[subject]>1)nl[subject]--;
      if(topic&&ntl[subject]){
        const tl=ntl[subject][topic.id]||1;
        if(acc>0.80&&tl<5) ntl[subject][topic.id]=tl+1;
        if(acc<0.40&&tl>1) ntl[subject][topic.id]=tl-1;
      }
    }
    const subsTried=[...(child.subsTried||[]),subject].filter((v,i,a)=>a.indexOf(v)===i);
    const bestStreak=Math.max(child.bestStreak||0,ok?qS+1:0);
    const updated={total:child.total+1,correct:child.correct+(ok?1:0),xp:child.xp+xp,level:nl,topicLevels:ntl,subsTried,bestStreak};
    const {badges,newBadge}=checkBadges({...child,...updated});
    onUpdate({...updated,badges,_newBadge:newBadge});
    if(mode==="audio") speak(ok?(q?.encouragement||"Correct!"):"Not quite. "+(q?.explanation||""),child.tutor);
    // Track question to prevent repeats
    if(q?.question) setAskedQs(prev=>[...prev, q.question].slice(-20));
  };

  const goNext=()=>{
    if(qNum+1>=MAX){setDone(true);return;}
    const ns=rot(subject);setSub(ns);setQNum(n=>n+1);load(ns,mode);
  };

  if(done) return <SessionDone child={child} stats={{correct:sC,total:sT,xp:sXP}} a11y={a11y} onDone={()=>onComplete({correct:sC,total:sT,xp:sXP})}/>;

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
              <p style={{fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>{topic?topic.name:subject} · Q{qNum+1}/{MAX}</p>
              <div style={{display:"flex",gap:3,marginTop:4}}>
                {Array.from({length:MAX}).map((_,i)=><div key={i} style={{width:i<=qNum?14:6,height:5,borderRadius:3,transition:"all 0.3s",background:i<qNum?C.green:i===qNum?C.primary:C.border}}/>)}
              </div>
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
          <TopicTest
            child={child} subject={subject} topic={topic} level={topicLevel||1}
            onPass={()=>{
              const ntl={...(child.topicLevels||{})};
              if(!ntl[subject]) ntl[subject]={};
              ntl[subject][topic.id]=(ntl[subject][topic.id]||1)+1;
              const key=`${subject}_${topic.id}_lv${topicLevel}`;
              const updatedCounts={...(child.topicQCounts||{}),[key]:0};
              const testKey=`${subject}_${topic.id}_lv${topicLevel}`;
              const testResults={...(child.topicTestResults||{}),[testKey]:"pass"};
              const updated={topicLevels:ntl,topicQCounts:updatedCounts,topicTestResults:testResults};
              // Check for new badges after topic pass
              const {badges,newBadge}=checkBadges({...child,...updated});
              onUpdate({...updated,badges,_newBadge:newBadge});
              setShowTest(false);
            }}
            onFail={()=>{
              // Record fail but reset count so they do another 50
              const key=`${subject}_${topic.id}_lv${topicLevel}`;
              const updatedCounts={...(child.topicQCounts||{}),[key]:0};
              const testKey=`${subject}_${topic.id}_lv${topicLevel}`;
              const testResults={...(child.topicTestResults||{}),[testKey]:"fail"};
              onUpdate({topicQCounts:updatedCounts,topicTestResults:testResults});
              setShowTest(false);
            }}
            onDismiss={()=>setShowTest(false)}
          />
        )}
        {paused&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:C.surface,borderRadius:24,padding:"32px 24px",width:"100%",maxWidth:360,textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
              <div style={{fontSize:48,marginBottom:12}}>⏸</div>
              <h2 style={{fontSize:24,fontWeight:900,color:C.text,marginBottom:8}}>Taking a break?</h2>
              <p style={{fontSize:14,fontWeight:600,color:C.muted,marginBottom:8}}>Your progress is saved!</p>
              <div style={{background:C.pLight,borderRadius:12,padding:"12px 16px",marginBottom:24,display:"flex",justifyContent:"space-around"}}>
                <div><p style={{fontSize:22,fontWeight:900,color:C.primary}}>{sC}/{sT}</p><p style={{fontSize:11,color:C.muted,fontWeight:700}}>Correct</p></div>
                <div><p style={{fontSize:22,fontWeight:900,color:C.green}}>+{sXP}</p><p style={{fontSize:11,color:C.muted,fontWeight:700}}>XP so far</p></div>
                <div><p style={{fontSize:22,fontWeight:900,color:C.amber}}>{qNum}/{MAX}</p><p style={{fontSize:11,color:C.muted,fontWeight:700}}>Done</p></div>
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
                  <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:"12px 14px",borderRadius:12,marginBottom:10,background:isRight?C.gLight:C.rLight,border:`1px solid ${isRight?C.green:C.red}`}}>
                    <TutorChar name={child.tutor} size={36}/>
                    <div>
                      <p style={{fontSize:13,fontWeight:800,marginBottom:3,color:isRight?C.green:C.red}}>{isRight?`✓ ${q.encouragement}`:"✗ Not quite!"}</p>
                      <p style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.55}}>{q.explanation}</p>
                    </div>
                  </div>
                  {isRight&&<p style={{textAlign:"center",fontSize:12,fontWeight:800,color:C.primary,marginBottom:10}}>⭐ +{q.difficulty==="hard"?15:q.difficulty==="medium"?10:7} XP earned!</p>}
                  <Btn onClick={goNext} style={{width:"100%"}}>{qNum+1>=MAX?"Finish session 🎉":"Next question →"}</Btn>
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
                  {SUBJECTS.map(s=>(
                    <div key={s} style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:12,minWidth:58,fontWeight:700,color:C.muted}}>{SUB[s].emoji} {s}</span>
                      <PBar value={c.level[s]-1} max={4} color={SUB[s].color} h={5}/>
                      <span style={{fontSize:11,fontWeight:800,color:SUB[s].color,minWidth:22}}>Lv.{c.level[s]}</span>
                    </div>
                  ))}
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
  const [expanded,setExpanded]=useState({overview:true,insight:false,gaps:true,curriculum:false,mastery:false,mastery_stats:false,habits:false,subjects:false,patterns:false,velocity:false,sessions:false});
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
  SUBJECTS.forEach(subj=>{
    const topics=CURRICULUM[subj]||[];
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
  const avgLevel=SUBJECTS.reduce((a,s)=>a+(child.level[s]||1),0)/SUBJECTS.length;
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
  SUBJECTS.forEach(s=>{
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
  const bestSubject=SUBJECTS.reduce((a,s)=>(child.level[s]||1)>(child.level[a]||1)?s:a,SUBJECTS[0]);
  const worstSubject=SUBJECTS.reduce((a,s)=>(child.level[s]||1)<(child.level[a]||1)?s:a,SUBJECTS[0]);

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

  return (
    <Screen>
      <div style={{paddingTop:20}}>
        <BackBtn onClick={onBack}/>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
          <button onClick={onSignOut} style={{padding:"8px 16px",borderRadius:10,background:"#FEE2E2",border:"none",cursor:"pointer",fontSize:13,fontWeight:800,color:"#DC2626",fontFamily:F}}>Sign Out</button>
        </div>
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
              {SUBJECTS.map(subj=>{
                const topics=(getCurriculum(child.country||"UK")[subj]||CURRICULUM[subj]||[]).filter(t=>t.minAge<=child.age);
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
                const lvl=child.level[subj]||1;
                const topics=(getCurriculum(child.country||"UK")[subj]||CURRICULUM[subj]||[]).filter(t=>t.minAge<=child.age);
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
                    <div style={{height:"100%",width:`${(d.v/SUBJECTS.length)*100}%`,background:d.c,borderRadius:4,transition:"width 0.6s"}}/>
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
                const lvl=child.level[subj]||1;
                const diff=getDifficultyLabel(lvl);
                const topicsForAge=(CURRICULUM[subj]||[]).filter(t=>t.minAge<=child.age);
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
  const subjectLevels = game.subjects.map(s => child.level?.[s] || 1);
  return Math.max(...subjectLevels);
}


function GameShell({name,emoji,subject,score,maxScore,round,total,streak,onQuit,children}) {
  const sc=SUB[subject];
  return (
    <Screen>
      <div style={{paddingTop:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:42,height:42,borderRadius:12,background:sc?.light||C.pLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{emoji}</div>
            <div><p style={{fontSize:15,fontWeight:900,color:C.text}}>{name}</p><p style={{fontSize:11,fontWeight:700,color:C.muted}}>Q{round}/{total}</p></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {streak>=2&&<span style={{fontSize:13,fontWeight:900,color:C.amber}}>🔥{streak}</span>}
            <span style={{fontSize:15,fontWeight:900,color:sc?.color||C.primary}}>{score}<span style={{fontSize:11,color:C.muted}}>/{maxScore}</span></span>
            <button onClick={onQuit} style={{background:C.rLight,border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:12,fontWeight:800,color:C.red,fontFamily:F}}>Quit</button>
          </div>
        </div>
        <PBar value={round-1} max={total} color={sc?.color||C.primary} h={5}/>
        <div style={{marginTop:16}}>{children}</div>
      </div>
    </Screen>
  );
}
function GameLoad({name,emoji,tutor,onTimeout}) {
  const t=TUTORS[tutor];
  React.useEffect(()=>{
    const timer=setTimeout(()=>{if(onTimeout)onTimeout();},12000);
    return()=>clearTimeout(timer);
  },[]);
  return <Screen><div style={{paddingTop:60,textAlign:"center"}}><div style={{fontSize:64,marginBottom:16,animation:"bounceY 1s ease-in-out infinite"}}>{emoji}</div><h2 style={{fontSize:28,fontWeight:900,color:C.text,marginBottom:8}}>{name}</h2><p style={{fontSize:15,color:C.muted,fontWeight:700,marginBottom:32}}>Getting your questions ready...</p><Spinner color={t?.color||C.primary}/></div></Screen>;
}
function GameEnd({name,emoji,score,max,child,xp,onDone}) {
  const pct=max>0?Math.round((score/max)*100):0;
  const medal=pct>=90?"🏆":pct>=70?"⭐":pct>=50?"🎯":"💪";
  const msgs={Sparky:{hi:`AMAZING!! ${score}/${max} — you nailed it! 🎉`,mid:`Great game! ${score}/${max} — keep going! ⚡`,lo:`Nice try! Play again to beat your score! 💪`},Pip:{hi:`Wonderful! ${score}/${max} — you should be really proud. 🌟`,mid:`Good effort! Getting better every time! 🦉`,lo:`Don't worry. Every try makes you better. 🌱`}};
  const tier=pct>=80?"hi":pct>=50?"mid":"lo";
  return <Screen><div style={{paddingTop:48,textAlign:"center"}}><div style={{fontSize:72,marginBottom:16,animation:"bounceY 1s ease-in-out infinite"}}>{medal}</div><h2 style={{fontSize:30,fontWeight:900,color:C.text,marginBottom:8}}>{name} Complete!</h2><div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:24}}>{[{v:`${score}/${max}`,l:"Score",c:C.primary},{v:`${pct}%`,l:"Accuracy",c:pct>=80?C.green:pct>=60?C.amber:C.red},{v:`+${xp}`,l:"XP Earned",c:C.green}].map(s=><div key={s.l} style={{padding:"12px 16px",borderRadius:12,minWidth:80,background:C.surface,border:`1px solid ${C.border}`}}><p style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</p><p style={{fontSize:11,color:C.muted,fontWeight:700}}>{s.l}</p></div>)}</div><div style={{display:"flex",gap:12,marginBottom:28,alignItems:"flex-start"}}><TutorChar name={child.tutor} size={52}/><Bubble tutor={child.tutor} text={msgs[child.tutor]?.[tier]} style={{flex:1,textAlign:"left"}}/></div><Btn onClick={onDone} style={{width:"100%",padding:16,fontSize:17}}>Back to Games 🎮</Btn></div></Screen>;
}

function NumberBlaster({child,mode,onComplete,onQuit,level=1}) {
  const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [timeLeft,setTimeLeft]=useState(Math.max(5,12-level));const [answered,setAnswered]=useState(false);const [sel,setSel]=useState(null);const [streak,setStreak]=useState(0);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);const timerRef=useRef(null);
  useEffect(()=>{claude(`Generate 10 ${child.country||"UK"} curriculum maths equations for age ${child.age}, Level ${level} difficulty (${getLevelContext(level)}).\n${child.age<=6?"Single-digit addition and subtraction only.":child.age<=8?"Addition, subtraction, simple multiplication.":"Mixed multiplication, division and operations."}\nReturn ONLY valid JSON: {"q":[{"eq":"3+4","ans":"7","wrong":["5","8","6"]},{"eq":"9-3","ans":"6","wrong":["4","7","5"]},...]}`,`Generate 10 Number Blaster questions.`).then(d=>setQs(d?.q||d?.questions));},[]);
  useEffect(()=>{
    if(!qs||answered||done)return;
    const q=qs[idx];
    if(mode==="audio"&&q)setTimeout(()=>speak(`${q.eq} equals?`,child.tutor),200);
    setTimeLeft(child?.accessibility?.testAnxiety||child?.accessibility?.dyspraxia||child?.accessibility?.dyscalculia?30:10);clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);handleAns(null);return 0;}return t-1;});},1000);
    return()=>clearInterval(timerRef.current);
  },[idx,qs]);
  const handleAns=(opt)=>{clearInterval(timerRef.current);if(answered)return;setAnswered(true);setSel(opt);const q=qs[idx];const ok=opt!==null&&opt===q.ans;if(ok){setScore(s=>s+(timeLeft>6?3:timeLeft>3?2:1));setStreak(s=>s+1);}else setStreak(0);if(mode==="audio")speak(ok?"Correct!":"The answer was "+q.ans,child.tutor);setTimeout(()=>{if(idx+1>=qs.length)setDone(true);else{setIdx(i=>i+1);setAnswered(false);setSel(null);}},750);};
  if(loadErr)return <GameError name="Number Blaster" emoji="🔢" onRetry={()=>{setLoadErr(false);}}/>;
  if(!qs)return <GameLoad name="Number Blaster" emoji="🔢" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,qs.length*3);return <GameEnd name="Number Blaster" emoji="🔢" score={score} max={qs.length*3} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}
  const q=qs[idx];
  const opts=React.useMemo(()=>q?shuffle([q.ans,...q.wrong]):[],[idx,qs]);
  const timerPct=(timeLeft/10)*100;const timerColor=timeLeft>6?C.green:timeLeft>3?C.amber:C.red;
  return <GameShell name="Number Blaster" emoji="🔢" subject="Maths" score={score} maxScore={qs.length*3} round={idx+1} total={qs.length} streak={streak} onQuit={onQuit}><div style={{height:8,background:C.border,borderRadius:4,overflow:"hidden",marginBottom:20}}><div style={{height:"100%",width:`${timerPct}%`,background:timerColor,transition:"width 1s linear"}}/></div><Card style={{textAlign:"center",marginBottom:20,padding:"32px 20px"}}><p style={{fontSize:52,fontWeight:900,color:C.text,letterSpacing:-1}}>{q?.eq} = ?</p><p style={{fontSize:13,color:timerColor,fontWeight:800,marginTop:8}}>{timeLeft}s</p></Card><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{opts.map(opt=>{const isRight=opt===q?.ans,isSel=opt===sel;const bg=answered&&isRight?C.gLight:answered&&isSel&&!isRight?C.rLight:C.pLight;const bc=answered&&isRight?C.green:answered&&isSel&&!isRight?C.red:C.primary;const tc=answered&&isRight?C.green:answered&&isSel&&!isRight?C.red:C.primary;return <button key={opt} onClick={()=>handleAns(opt)} disabled={answered} style={{padding:"22px 12px",borderRadius:16,border:`2px solid ${bc}`,background:bg,color:tc,fontSize:32,fontWeight:900,cursor:answered?"default":"pointer",transition:"all 0.15s",fontFamily:F}}>{opt}</button>;})}</div></GameShell>;
}

function TimesTableRace({child,mode,onComplete,onQuit,level=1}) {
  const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [input,setInput]=useState("");const [result,setResult]=useState(null);const [timeLeft,setTimeLeft]=useState(60);const [done,setDone]=useState(false);const timerRef=useRef(null);const inputRef=useRef(null);
  useEffect(()=>{claude(`Generate 15 times table questions for age ${child.age}, level ${child.level.Maths}/5.\n${child.age<=7?"Use 1x to 5x tables only.":child.age<=9?"Use 1x to 10x tables.":"Use 1x to 12x tables."}\nReturn ONLY valid JSON: {"q":[{"q":"6 × 7","a":"42"},{"q":"3 × 8","a":"24"},...]}`,`Generate Times Table Race questions.`).then(d=>setQs(d?.q||d?.questions));},[]);
  useEffect(()=>{if(!qs)return;timerRef.current=setInterval(()=>{setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);setDone(true);return 0;}return t-1;});},1000);return()=>clearInterval(timerRef.current);},[qs]);
  useEffect(()=>{if(qs&&mode==="audio")setTimeout(()=>speak(qs[idx]?.q+" equals?",child.tutor),200);setTimeout(()=>inputRef.current?.focus(),100);},[idx,qs]);
  const submit=()=>{if(!input.trim()||result||!qs)return;const q=qs[idx];const ok=input.trim()===q.a;setResult(ok?"correct":"wrong");if(ok)setScore(s=>s+1);if(mode==="audio")speak(ok?"Correct!":"Not quite, the answer was "+q.a,child.tutor);setTimeout(()=>{if(idx+1>=qs.length){clearInterval(timerRef.current);setDone(true);}else{setIdx(i=>i+1);setInput("");setResult(null);}},800);};
  if(!qs)return <GameLoad name="Times Table Race" emoji="⏱️" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,qs?.length||15);return <GameEnd name="Times Table Race" emoji="⏱️" score={score} max={qs?.length||15} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}
  const q=qs[idx];const timerColor=timeLeft>30?C.green:timeLeft>15?C.amber:C.red;
  return <GameShell name="Times Table Race" emoji="⏱️" subject="Maths" score={score} maxScore={qs.length} round={idx+1} total={qs.length} streak={0} onQuit={onQuit}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:13,fontWeight:800,color:timerColor}}>⏱️ {timeLeft}s left</span><div style={{flex:1,marginLeft:12}}><PBar value={timeLeft} max={60} color={timerColor} h={6}/></div></div><Card style={{textAlign:"center",padding:"32px 20px",marginBottom:20}}><p style={{fontSize:48,fontWeight:900,color:C.text}}>{q?.q} = ?</p></Card><div style={{display:"flex",gap:10,marginBottom:12}}><input ref={inputRef} value={input} onChange={e=>setInput(e.target.value.replace(/[^0-9]/g,""))} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Type your answer..." style={{flex:1,padding:"16px",borderRadius:14,fontSize:24,fontWeight:900,textAlign:"center",border:`2px solid ${result==="correct"?C.green:result==="wrong"?C.red:C.border}`,background:result==="correct"?C.gLight:result==="wrong"?C.rLight:C.bg,color:result==="correct"?C.green:result==="wrong"?C.red:C.text,outline:"none"}}/><Btn onClick={submit} style={{padding:"16px 24px",fontSize:18}}>→</Btn></div>{result&&<p style={{textAlign:"center",fontSize:15,fontWeight:800,color:result==="correct"?C.green:C.red}}>{result==="correct"?"✓ Correct!":"✗ The answer was "+q?.a}</p>}</GameShell>;
}

function FractionChef({child,mode,onComplete,onQuit,level=1}) {
  const [fractions,setFractions]=useState(null);const [idx,setIdx]=useState(0);const [filled,setFilled]=useState(new Set());const [checked,setChecked]=useState(false);const [correct,setCorrect]=useState(false);const [score,setScore]=useState(0);const [done,setDone]=useState(false);
  useEffect(()=>{claude(`Generate 5 fraction challenges for age ${child.age}, Level ${level} (${getLevelContext(level)}), level ${child.level.Maths}/5.\n${child.age<=7?"Use only halves and quarters.":"Use halves, quarters, thirds and fifths."}\nEach uses 8 pizza slices.\nReturn ONLY valid JSON: {"fractions":[{"n":1,"d":2,"label":"one half","correctSlices":4},{"n":3,"d":4,"label":"three quarters","correctSlices":6},...]}`,`Generate Fraction Chef challenges.`).then(d=>setFractions(d?.fractions));},[]);
  useEffect(()=>{if(fractions&&mode==="audio")setTimeout(()=>speak(`Fill ${fractions[idx]?.label} of the pizza!`,child.tutor),200);},[idx,fractions]);
  const toggleSlice=(i)=>{if(checked)return;setFilled(prev=>{const n=new Set(prev);n.has(i)?n.delete(i):n.add(i);return n;});};
  const check=()=>{const f=fractions[idx];const ok=filled.size===f.correctSlices;setChecked(true);setCorrect(ok);if(ok)setScore(s=>s+1);if(mode==="audio")speak(ok?"Perfect! That's "+f.label+"!":"Not quite. Needed "+f.correctSlices+" slices.",child.tutor);setTimeout(()=>{if(idx+1>=fractions.length)setDone(true);else{setIdx(i=>i+1);setFilled(new Set());setChecked(false);}},800);};
  if(!fractions)return <GameLoad name="Fraction Chef" emoji="🍕" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,fractions.length);return <GameEnd name="Fraction Chef" emoji="🍕" score={score} max={fractions.length} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}
  const f=fractions[idx];const SLICES=8,r=90,cx=110,cy=110;
  return <GameShell name="Fraction Chef" emoji="🍕" subject="Maths" score={score} maxScore={fractions.length} round={idx+1} total={fractions.length} streak={0} onQuit={onQuit}><Card style={{textAlign:"center",marginBottom:16,padding:"20px"}}><p style={{fontSize:14,fontWeight:700,color:C.muted,marginBottom:4}}>Fill the pizza to show</p><p style={{fontSize:32,fontWeight:900,color:C.primary}}>{f?.n}/{f?.d} — {f?.label}</p><p style={{fontSize:13,fontWeight:700,color:C.muted,marginTop:4}}>{filled.size} of 8 slices · need {f?.correctSlices}</p></Card><div style={{display:"flex",justifyContent:"center",marginBottom:20}}><svg width="220" height="220" viewBox="0 0 220 220">{Array.from({length:SLICES}).map((_,i)=>{const a1=(i/SLICES)*Math.PI*2-Math.PI/2,a2=((i+1)/SLICES)*Math.PI*2-Math.PI/2;const x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2);const isFilled=filled.has(i);return <g key={i} onClick={()=>toggleSlice(i)} style={{cursor:checked?"default":"pointer"}}><path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={isFilled?(checked?(correct?C.green:C.red):"#FF6B35"):"#FFF3E0"} stroke="#E65100" strokeWidth="2" opacity={isFilled?1:0.6}/></g>})}<circle cx={cx} cy={cy} r={r} fill="none" stroke="#E65100" strokeWidth="2"/></svg></div>{!checked&&<Btn onClick={check} disabled={filled.size===0} style={{width:"100%",fontSize:16}}>Check my fraction! 🍕</Btn>}{checked&&<div style={{padding:"12px",borderRadius:12,background:correct?C.gLight:C.rLight,border:`1px solid ${correct?C.green:C.red}`,textAlign:"center"}}><p style={{fontSize:16,fontWeight:800,color:correct?C.green:C.red}}>{correct?"✓ Perfect!":"✗ Needed "+f?.correctSlices+" slices"}</p></div>}</GameShell>;
}

function WordScramble({child,mode,onComplete,onQuit,level=1}) {
  const [words,setWords]=useState(null);const [idx,setIdx]=useState(0);const [letters,setLetters]=useState([]);const [selected,setSelected]=useState([]);const [checked,setChecked]=useState(false);const [correct,setCorrect]=useState(false);const [score,setScore]=useState(0);const [done,setDone]=useState(false);
  useEffect(()=>{claude(`Generate 6 words for word scramble for age ${child.age}, level ${child.level.English}/5.\n${child.age<=6?"3-4 letter simple words.":child.age<=8?"4-6 letter common words.":"5-8 letter vocabulary words."}\nReturn ONLY valid JSON: {"words":[{"word":"APPLE","clue":"A crunchy red or green fruit"},{"word":"HAPPY","clue":"How you feel when something good happens"},...]}`,`Generate Word Scramble words.`).then(d=>setWords(d?.words));},[]);
  useEffect(()=>{if(!words)return;const ls=shuffle(words[idx].word.split("").map((l,i)=>({l,i,id:i+"-"+Math.random()})));setLetters(ls);setSelected([]);setChecked(false);if(mode==="audio")setTimeout(()=>speak("Unscramble: "+words[idx].clue,child.tutor),200);},[idx,words]);
  const tapLetter=(lt,pos)=>{if(checked)return;setLetters(prev=>prev.map((x,i)=>i===pos?{...x,used:true}:x));setSelected(prev=>[...prev,lt]);};
  const removeLast=()=>{if(!selected.length||checked)return;const last=selected[selected.length-1];setLetters(prev=>prev.map(x=>x.id===last.id?{...x,used:false}:x));setSelected(prev=>prev.slice(0,-1));};
  const checkWord=()=>{const guess=selected.map(s=>s.l).join("");const ok=guess===words[idx].word;setChecked(true);setCorrect(ok);if(ok)setScore(s=>s+1);if(mode==="audio")speak(ok?"Correct! The word is "+words[idx].word:"Not quite. The word was "+words[idx].word,child.tutor);setTimeout(()=>{if(idx+1>=words.length)setDone(true);else setIdx(i=>i+1);},750);};
  if(!words)return <GameLoad name="Word Scramble" emoji="🔤" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,words.length);return <GameEnd name="Word Scramble" emoji="🔤" score={score} max={words.length} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}
  const w=words[idx];const guess=selected.map(s=>s.l).join("");
  return <GameShell name="Word Scramble" emoji="🔤" subject="English" score={score} maxScore={words.length} round={idx+1} total={words.length} streak={0} onQuit={onQuit}><Card style={{textAlign:"center",marginBottom:16}}><p style={{fontSize:13,fontWeight:700,color:C.muted,marginBottom:4}}>Clue</p><p style={{fontSize:18,fontWeight:700,color:C.text,lineHeight:1.5}}>{w?.clue}</p></Card><div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:20,flexWrap:"wrap"}}>{Array.from({length:w?.word.length||0}).map((_,i)=><div key={i} style={{width:44,height:52,borderRadius:10,border:`2px solid ${checked?(correct?C.green:C.red):selected[i]?C.primary:C.border}`,background:checked?(correct?C.gLight:C.rLight):selected[i]?C.pLight:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,color:checked?(correct?C.green:C.red):C.primary}}>{selected[i]?.l||""}</div>)}</div><div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap",marginBottom:16}}>{letters.map((lt,i)=><button key={lt.id} onClick={()=>!lt.used&&!checked&&tapLetter(lt,i)} style={{width:44,height:52,borderRadius:10,fontSize:20,fontWeight:900,background:lt.used?C.border:C.surface,color:lt.used?C.border:C.text,border:`2px solid ${lt.used?C.border:C.primary}`,cursor:lt.used||checked?"default":"pointer",transition:"all 0.15s",fontFamily:F}}>{lt.used?"":lt.l}</button>)}</div>{!checked&&<div style={{display:"flex",gap:10}}><Btn onClick={removeLast} v="ghost" style={{flex:1}} disabled={!selected.length}>⌫ Remove</Btn><Btn onClick={checkWord} style={{flex:2}} disabled={guess.length!==w?.word.length}>Check ✓</Btn></div>}{checked&&<div style={{padding:"12px",borderRadius:12,background:correct?C.gLight:C.rLight,textAlign:"center"}}><p style={{fontSize:16,fontWeight:800,color:correct?C.green:C.red}}>{correct?"✓ Correct!":"✗ The word was "+w?.word}</p></div>}</GameShell>;
}

function SpellingBee({child,mode,onComplete,onQuit,level=1}) {
  const [words,setWords]=useState(null);const [idx,setIdx]=useState(0);const [input,setInput]=useState("");const [result,setResult]=useState(null);const [score,setScore]=useState(0);const [done,setDone]=useState(false);const [heard,setHeard]=useState(false);const inputRef=useRef(null);
  useEffect(()=>{claude(`Generate 8 spelling words for age ${child.age}, level ${child.level.English}/5.\n${child.age<=6?"3-4 letter simple phonetic words.":child.age<=8?"4-6 letter common words.":"6-10 letter vocabulary words."}\nFor each provide a sentence using it.\nReturn ONLY valid JSON: {"words":[{"word":"beautiful","sentence":"The sunset was beautiful."},{"word":"friend","sentence":"She is my best friend."},...]}`,`Generate Spelling Bee words.`).then(d=>setWords(d?.words));},[]);
  const hearWord=()=>{if(!words)return;speak(words[idx].word,child.tutor);setHeard(true);setTimeout(()=>inputRef.current?.focus(),300);};
  useEffect(()=>{if(words){setInput("");setResult(null);setHeard(false);}},[idx,words]);
  useEffect(()=>{if(words&&mode==="audio")hearWord();},[idx,words]);
  const submit=()=>{if(!input.trim()||result||!words)return;const ok=input.trim().toLowerCase()===words[idx].word.toLowerCase();setResult(ok?"correct":"wrong");if(ok)setScore(s=>s+1);if(mode==="audio")speak(ok?"Perfect spelling!":"Correct spelling is "+words[idx].word,child.tutor);setTimeout(()=>{if(idx+1>=words.length)setDone(true);else setIdx(i=>i+1);},800);};
  if(!words)return <GameLoad name="Spelling Bee" emoji="🐝" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,words.length);return <GameEnd name="Spelling Bee" emoji="🐝" score={score} max={words.length} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}
  const w=words[idx];
  return <GameShell name="Spelling Bee" emoji="🐝" subject="English" score={score} maxScore={words.length} round={idx+1} total={words.length} streak={0} onQuit={onQuit}><Card style={{textAlign:"center",marginBottom:20,padding:"32px 20px"}}><div style={{fontSize:48,marginBottom:12}}>🐝</div><p style={{fontSize:14,fontWeight:700,color:C.muted,marginBottom:8}}>Listen to the word, then spell it!</p>{heard&&<p style={{fontSize:14,fontWeight:700,color:C.sky,lineHeight:1.5,marginTop:8}}><em>"{w?.sentence}"</em></p>}</Card><button onClick={hearWord} style={{width:"100%",padding:"16px",borderRadius:14,fontSize:16,fontWeight:800,background:C.sLight,border:`2px solid ${C.sky}`,color:C.sky,cursor:"pointer",fontFamily:F,marginBottom:14}}>🔊 {heard?"Hear again":"Hear the word"}</button>{heard&&<div style={{display:"flex",gap:10,marginBottom:12}}><input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Type the spelling..." disabled={!!result} style={{flex:1,padding:"14px 16px",borderRadius:12,fontSize:20,fontWeight:700,border:`2px solid ${result==="correct"?C.green:result==="wrong"?C.red:C.border}`,background:result==="correct"?C.gLight:result==="wrong"?C.rLight:C.bg,color:result==="correct"?C.green:result==="wrong"?C.red:C.text,outline:"none"}}/><Btn onClick={submit} disabled={!input.trim()||!!result} style={{padding:"14px 20px"}}>✓</Btn></div>}{result&&<div style={{padding:"12px",borderRadius:12,background:result==="correct"?C.gLight:C.rLight,textAlign:"center"}}><p style={{fontSize:16,fontWeight:800,color:result==="correct"?C.green:C.red}}>{result==="correct"?"✓ Perfect spelling!":"✗ Correct: "+w?.word}</p></div>}</GameShell>;
}

function SentenceBuilder({child,mode,onComplete,onQuit,level=1}) {
  const [sentences,setSentences]=useState(null);const [idx,setIdx]=useState(0);const [pool,setPool]=useState([]);const [placed,setPlaced]=useState([]);const [checked,setChecked]=useState(false);const [correct,setCorrect]=useState(false);const [score,setScore]=useState(0);const [done,setDone]=useState(false);
  useEffect(()=>{claude(`Generate 4 sentences for sentence builder for age ${child.age}, level ${child.level.English}/5.\n${child.age<=6?"3-4 word simple sentences.":child.age<=8?"4-6 word sentences.":"5-8 word sentences."}\nReturn ONLY valid JSON: {"sentences":[{"words":["The","dog","ran","fast"],"meaning":"An animal moving quickly"},{"words":["She","likes","to","read","books"],"meaning":"Someone enjoying reading"},...]}`,`Generate Sentence Builder sentences.`).then(d=>setSentences(d?.sentences));},[]);
  useEffect(()=>{if(!sentences)return;const s=sentences[idx];const shuffled=shuffle(s.words.map((w,i)=>({w,i,id:i+"-"+Math.random()})));setPool(shuffled);setPlaced(Array(s.words.length).fill(null));setChecked(false);if(mode==="audio")setTimeout(()=>speak("Build this sentence: "+s.meaning,child.tutor),200);},[idx,sentences]);
  const placeWord=(wordObj)=>{if(checked)return;const fi=placed.findIndex(p=>p===null);if(fi===-1)return;setPool(prev=>prev.filter(w=>w.id!==wordObj.id));setPlaced(prev=>{const n=[...prev];n[fi]=wordObj;return n;});};
  const removeWord=(si)=>{if(checked)return;const w=placed[si];if(!w)return;setPlaced(prev=>{const n=[...prev];n[si]=null;return n;});setPool(prev=>[...prev,w]);};
  const check=()=>{const s=sentences[idx];const ok=placed.every((p,i)=>p?.w===s.words[i]);setChecked(true);setCorrect(ok);if(ok)setScore(sc=>sc+1);if(mode==="audio")speak(ok?"Perfect sentence!":"Sentence was: "+s.words.join(" "),child.tutor);setTimeout(()=>{if(idx+1>=sentences.length)setDone(true);else setIdx(i=>i+1);},800);};
  if(!sentences)return <GameLoad name="Sentence Builder" emoji="✏️" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,sentences.length);return <GameEnd name="Sentence Builder" emoji="✏️" score={score} max={sentences.length} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}
  const s=sentences[idx];const allPlaced=placed.every(p=>p!==null);
  return <GameShell name="Sentence Builder" emoji="✏️" subject="English" score={score} maxScore={sentences.length} round={idx+1} total={sentences.length} streak={0} onQuit={onQuit}><Card style={{marginBottom:16}}><p style={{fontSize:13,fontWeight:700,color:C.muted,marginBottom:4}}>Build this sentence</p><p style={{fontSize:17,fontWeight:700,color:C.text,lineHeight:1.5}}>{s?.meaning}</p></Card><div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16,minHeight:52,padding:"12px",background:C.bg,borderRadius:12,border:`2px dashed ${checked?(correct?C.green:C.red):C.border}`}}>{placed.map((p,i)=><button key={i} onClick={()=>removeWord(i)} style={{padding:"10px 14px",borderRadius:10,fontSize:15,fontWeight:800,cursor:p&&!checked?"pointer":"default",background:p?(checked?(correct?C.gLight:C.rLight):C.pLight):"transparent",border:`2px solid ${p?(checked?(correct?C.green:C.red):C.primary):C.border}`,color:p?(checked?(correct?C.green:C.red):C.primary):C.muted,minWidth:44,minHeight:44,fontFamily:F}}>{p?.w||""}</button>)}</div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>{pool.map(w=><button key={w.id} onClick={()=>placeWord(w)} style={{padding:"10px 14px",borderRadius:10,fontSize:15,fontWeight:800,cursor:"pointer",background:C.surface,border:`2px solid ${C.border}`,color:C.text,fontFamily:F,transition:"all 0.1s"}}>{w.w}</button>)}</div>{!checked&&<Btn onClick={check} disabled={!allPlaced} style={{width:"100%"}}>Check sentence ✓</Btn>}{checked&&<div style={{padding:"12px",borderRadius:12,background:correct?C.gLight:C.rLight,textAlign:"center"}}><p style={{fontSize:15,fontWeight:800,color:correct?C.green:C.red}}>{correct?"✓ Perfect!":"✗ Correct: "+s?.words.join(" ")}</p></div>}</GameShell>;
}

function ScienceSort({child,mode,onComplete,onQuit,level=1}) {
  const [gameData,setGameData]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [flash,setFlash]=useState(null);const [done,setDone]=useState(false);
  useEffect(()=>{claude(`Generate a science sorting game for age ${child.age}.\nTopic: ${child.age<=6?"living vs non-living things":child.age<=8?"animals by type (mammals, birds, fish, insects)":"vertebrates vs invertebrates"}.\nGenerate 12 items.\nReturn ONLY valid JSON: {"title":"Living vs Non-Living","categories":["Living","Non-Living"],"items":[{"name":"Dog","emoji":"🐕","cat":"Living"},{"name":"Rock","emoji":"🪨","cat":"Non-Living"},...]}`,`Generate Science Sort game.`).then(d=>setGameData(d));},[]);
  useEffect(()=>{if(!gameData||idx>=gameData.items.length)return;if(mode==="audio")setTimeout(()=>speak("Where does "+gameData.items[idx].name+" go?",child.tutor),200);},[idx,gameData]);
  const sortItem=(cat)=>{if(flash)return;const item=gameData.items[idx];const ok=cat===item.cat;setFlash(ok?"correct":"wrong");if(ok)setScore(s=>s+1);if(mode==="audio")speak(ok?"Correct!":item.name+" is "+item.cat,child.tutor);setTimeout(()=>{setFlash(null);if(idx+1>=gameData.items.length)setDone(true);else setIdx(i=>i+1);},900);};
  if(!gameData)return <GameLoad name="Science Sort" emoji="🔬" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,gameData.items.length);return <GameEnd name="Science Sort" emoji="🔬" score={score} max={gameData.items.length} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}
  const item=gameData.items[idx];const catColors=[C.primary,C.green,C.amber];
  return <GameShell name="Science Sort" emoji="🔬" subject="Science" score={score} maxScore={gameData.items.length} round={idx+1} total={gameData.items.length} streak={0} onQuit={onQuit}><p style={{textAlign:"center",fontSize:14,fontWeight:800,color:C.muted,marginBottom:16}}>{gameData.title}</p><Card style={{textAlign:"center",padding:"36px 20px",marginBottom:24,background:flash==="correct"?C.gLight:flash==="wrong"?C.rLight:C.surface,border:`2px solid ${flash==="correct"?C.green:flash==="wrong"?C.red:C.border}`,transition:"all 0.2s"}}><div style={{fontSize:72,marginBottom:12}}>{item?.emoji}</div><p style={{fontSize:28,fontWeight:900,color:C.text}}>{item?.name}</p></Card><p style={{textAlign:"center",fontSize:14,fontWeight:700,color:C.muted,marginBottom:12}}>Where does it belong?</p><div style={{display:"flex",gap:10}}>{gameData.categories.map((cat,i)=><button key={cat} onClick={()=>sortItem(cat)} disabled={!!flash} style={{flex:1,padding:"20px 12px",borderRadius:14,fontSize:16,fontWeight:900,cursor:flash?"default":"pointer",fontFamily:F,transition:"all 0.15s",background:`${catColors[i]||C.primary}15`,border:`2px solid ${catColors[i]||C.primary}`,color:catColors[i]||C.primary}}>{cat}</button>)}</div></GameShell>;
}

function StatesOfMatter({child,mode,onComplete,onQuit,level=1}) {
  const [items,setItems]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [flash,setFlash]=useState(null);const [done,setDone]=useState(false);
  useEffect(()=>{claude(`Generate 12 items for states of matter sorting for age ${child.age}. Include solids, liquids and gases children know.\nReturn ONLY valid JSON: {"items":[{"name":"Ice","emoji":"🧊","state":"solid"},{"name":"Water","emoji":"💧","state":"liquid"},{"name":"Steam","emoji":"♨️","state":"gas"},{"name":"Rock","emoji":"🪨","state":"solid"},...]}`,`Generate States of Matter items.`).then(d=>setItems(d?.items));},[]);
  useEffect(()=>{if(!items||idx>=items.length)return;if(mode==="audio")setTimeout(()=>speak("Is "+items[idx].name+" a solid, liquid or gas?",child.tutor),200);},[idx,items]);
  const sort=(state)=>{if(flash)return;const item=items[idx];const ok=state===item.state;setFlash(ok?"correct":"wrong");if(ok)setScore(s=>s+1);if(mode==="audio")speak(ok?"Correct!":item.name+" is a "+item.state,child.tutor);setTimeout(()=>{setFlash(null);if(idx+1>=items.length)setDone(true);else setIdx(i=>i+1);},900);};
  if(!items)return <GameLoad name="States of Matter" emoji="💧" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,items.length);return <GameEnd name="States of Matter" emoji="💧" score={score} max={items.length} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}
  const item=items[idx];const states=[{s:"solid",emoji:"🧱",color:C.amber},{s:"liquid",emoji:"💧",color:C.sky},{s:"gas",emoji:"💨",color:C.violet}];
  return <GameShell name="States of Matter" emoji="💧" subject="Science" score={score} maxScore={items.length} round={idx+1} total={items.length} streak={0} onQuit={onQuit}><Card style={{textAlign:"center",padding:"36px 20px",marginBottom:20,background:flash==="correct"?C.gLight:flash==="wrong"?C.rLight:C.surface,border:`2px solid ${flash==="correct"?C.green:flash==="wrong"?C.red:C.border}`,transition:"all 0.2s"}}><div style={{fontSize:64,marginBottom:10}}>{item?.emoji}</div><p style={{fontSize:26,fontWeight:900,color:C.text}}>{item?.name}</p><p style={{fontSize:13,fontWeight:700,color:C.muted,marginTop:4}}>Solid, liquid or gas?</p></Card><div style={{display:"flex",gap:10}}>{states.map(({s,emoji,color})=><button key={s} onClick={()=>sort(s)} disabled={!!flash} style={{flex:1,padding:"18px 8px",borderRadius:14,cursor:flash?"default":"pointer",fontFamily:F,transition:"all 0.15s",background:`${color}15`,border:`2px solid ${color}`,textAlign:"center"}}><div style={{fontSize:24,marginBottom:4}}>{emoji}</div><p style={{fontSize:13,fontWeight:900,color,textTransform:"capitalize"}}>{s}</p></button>)}</div></GameShell>;
}

function PlanetPatrol({child,mode,onComplete,onQuit,level=1}) {
  const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [sel,setSel]=useState(null);const [answered,setAnswered]=useState(false);const [score,setScore]=useState(0);const [streak,setStreak]=useState(0);const [done,setDone]=useState(false);
  useEffect(()=>{claude(`Generate 8 planet quiz questions for age ${child.age}.\n${child.age<=7?"Focus on basic facts: largest, smallest, red planet, rings.":"Include moons, distance, atmosphere and features."}\nReturn ONLY valid JSON: {"q":[{"clue":"The largest planet in our solar system","answer":"Jupiter","emoji":"🪐","options":["Saturn","Jupiter","Neptune","Uranus"]},{"clue":"The red planet","answer":"Mars","emoji":"🔴","options":["Mars","Venus","Mercury","Earth"]},...]}`,`Generate Planet Patrol questions.`).then(d=>setQs(d?.q||d?.questions));},[]);
  useEffect(()=>{if(!qs)return;setSel(null);setAnswered(false);if(mode==="audio")setTimeout(()=>speak(qs[idx]?.clue,child.tutor),200);},[idx,qs]);
  const answer=(opt)=>{if(answered)return;setSel(opt);setAnswered(true);const q=qs[idx];const ok=opt===q.answer;if(ok){setScore(s=>s+1);setStreak(s=>s+1);}else setStreak(0);if(mode==="audio")speak(ok?"Correct! "+q.answer:"Not quite. The answer is "+q.answer,child.tutor);setTimeout(()=>{if(idx+1>=qs.length)setDone(true);else setIdx(i=>i+1);},750);};
  if(!qs)return <GameLoad name="Planet Patrol" emoji="🪐" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,qs.length);return <GameEnd name="Planet Patrol" emoji="🪐" score={score} max={qs.length} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}
  const q=qs[idx];const opts=q?shuffle(q.options):[];
  return <GameShell name="Planet Patrol" emoji="🪐" subject="Science" score={score} maxScore={qs.length} round={idx+1} total={qs.length} streak={streak} onQuit={onQuit}><Card style={{textAlign:"center",padding:"28px 20px",marginBottom:20}}><div style={{fontSize:56,marginBottom:12}}>{q?.emoji}</div><p style={{fontSize:19,fontWeight:700,color:C.text,lineHeight:1.6}}>{q?.clue}</p></Card><div style={{display:"flex",flexDirection:"column",gap:10}}>{opts.map(opt=>{const isRight=opt===q?.answer,isSel=opt===sel;const bg=answered&&isRight?C.gLight:answered&&isSel&&!isRight?C.rLight:C.surface;const bc=answered&&isRight?C.green:answered&&isSel&&!isRight?C.red:C.border;const tc=answered&&isRight?C.green:answered&&isSel&&!isRight?C.red:C.text;return <button key={opt} onClick={()=>answer(opt)} disabled={answered} style={{padding:"16px 20px",borderRadius:12,border:`2px solid ${bc}`,background:bg,color:tc,fontSize:16,fontWeight:800,textAlign:"left",cursor:answered?"default":"pointer",fontFamily:F,transition:"all 0.15s"}}>🪐 {opt}</button>;})}</div></GameShell>;
}


// ── Algorithm Sort (Computing drag-drop) ─────────────────────────────────
function AlgorithmSort({child,mode,onComplete,onQuit,level=1}) {
  const [tasks,setTasks]=useState(null);
  const [idx,setIdx]=useState(0);
  const [pool,setPool]=useState([]);
  const [placed,setPlaced]=useState([]);
  const [checked,setChecked]=useState(false);
  const [correct,setCorrect]=useState(false);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);

  useEffect(()=>{
    claude(
      `Generate 5 algorithm sequencing tasks for age ${child.age}.
Each task is a real-life or computing process broken into 4-6 steps that need ordering.
Suitable tasks: making toast, logging into a computer, sending an email, brushing teeth, watering a plant.
Return ONLY valid JSON: {"tasks":[{"title":"Making toast","steps":["Put bread in toaster","Press down the lever","Wait for the toast to pop up","Spread butter on the toast"],"intro":"Put these steps in the right order"},{"title":"Logging into a computer","steps":["Turn on the computer","Wait for it to load","Type your username","Type your password","Press Enter"],"intro":"What order do you log in?"},...]}`,
      "Generate Algorithm Sort tasks."
    ).then(d=>setTasks(d?.tasks));
  },[]);

  useEffect(()=>{
    if(!tasks)return;
    const t=tasks[idx];
    const shuffled=shuffle(t.steps.map((s,i)=>({s,i,id:i+"-"+Math.random()})));
    setPool(shuffled);setPlaced([]);setChecked(false);
    if(mode==="audio") setTimeout(()=>speak(t.intro+": "+t.title,child.tutor),200);
  },[idx,tasks]);

  const placeStep=(stepObj)=>{
    if(checked)return;
    setPool(prev=>prev.filter(s=>s.id!==stepObj.id));
    setPlaced(prev=>[...prev,stepObj]);
  };
  const removeStep=(i)=>{
    if(checked)return;
    const s=placed[i];
    setPlaced(prev=>prev.filter((_,j)=>j!==i));
    setPool(prev=>[...prev,s]);
  };
  const check=()=>{
    const t=tasks[idx];
    const ok=placed.every((p,i)=>p.i===i);
    setChecked(true);setCorrect(ok);
    if(ok)setScore(s=>s+1);
    if(mode==="audio") speak(ok?"Perfect order!":"Not quite. The correct order was: "+t.steps.join(", then "),child.tutor);
    setTimeout(()=>{if(idx+1>=tasks.length)setDone(true);else setIdx(i=>i+1);},900);
  };

  if(!tasks)return <GameLoad name="Algorithm Sort" emoji="🔢" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,tasks.length);return <GameEnd name="Algorithm Sort" emoji="🔢" score={score} max={tasks.length} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}

  const t=tasks[idx];
  return (
    <GameShell name="Algorithm Sort" emoji="🔢" subject="Computing" score={score} maxScore={tasks.length} round={idx+1} total={tasks.length} streak={0} onQuit={onQuit}>
      <Card style={{marginBottom:14}}>
        <p style={{fontSize:13,fontWeight:700,color:C.muted,marginBottom:3}}>{t?.intro}</p>
        <p style={{fontSize:18,fontWeight:800,color:C.text}}>{t?.title}</p>
      </Card>
      <p style={{fontSize:12,fontWeight:800,color:C.muted,marginBottom:8}}>YOUR ORDER — tap to remove:</p>
      <div style={{minHeight:52,marginBottom:14,display:"flex",flexDirection:"column",gap:6,padding:"10px",background:C.bg,borderRadius:12,border:`2px dashed ${checked?(correct?C.green:C.red):C.border}`}}>
        {placed.map((p,i)=>(
          <button key={p.id} onClick={()=>removeStep(i)} style={{padding:"10px 14px",borderRadius:10,fontSize:14,fontWeight:700,textAlign:"left",cursor:checked?"default":"pointer",background:checked?(correct?C.gLight:C.rLight):C.pLight,border:`1.5px solid ${checked?(correct?C.green:C.red):C.primary}`,color:checked?(correct?C.green:C.red):C.primary,fontFamily:F}}>
            <span style={{fontWeight:900,marginRight:8}}>{i+1}.</span>{p.s}
          </button>
        ))}
        {placed.length===0&&<p style={{textAlign:"center",color:C.muted,fontSize:13,fontWeight:600,padding:"8px"}}>Tap steps below to add them</p>}
      </div>
      <p style={{fontSize:12,fontWeight:800,color:C.muted,marginBottom:8}}>STEPS — tap to place:</p>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
        {pool.map(p=>(
          <button key={p.id} onClick={()=>placeStep(p)} style={{padding:"10px 14px",borderRadius:10,fontSize:14,fontWeight:700,textAlign:"left",cursor:"pointer",background:C.surface,border:`1.5px solid ${C.border}`,color:C.text,fontFamily:F,transition:"all 0.1s"}}>{p.s}</button>
        ))}
      </div>
      {!checked&&<Btn onClick={check} disabled={placed.length!==t?.steps.length} style={{width:"100%"}}>Check order ✓</Btn>}
      {checked&&<div style={{padding:"12px",borderRadius:12,background:correct?C.gLight:C.rLight,textAlign:"center"}}><p style={{fontSize:15,fontWeight:800,color:correct?C.green:C.red}}>{correct?"✓ Perfect algorithm!":"✗ Correct order: "+t?.steps.join(" → ")}</p></div>}
    </GameShell>
  );
}

// ── Debug Detective (Computing) ───────────────────────────────────────────
function DebugDetective({child,mode,onComplete,onQuit,level=1}) {
  const [puzzles,setPuzzles]=useState(null);
  const [idx,setIdx]=useState(0);
  const [sel,setSel]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);

  useEffect(()=>{
    claude(
      `Generate 6 debugging puzzles for age ${child.age}.
Each shows a set of steps with ONE bug (wrong step or step in wrong place).
The child must identify which step is the bug.
Return ONLY valid JSON: {"puzzles":[{"scenario":"A robot is trying to make a cup of tea","steps":["Fill kettle with water","Turn kettle on","Pour cold water into cup","Wait for kettle to boil","Add teabag","Pour hot water into cup"],"bugStep":"Pour cold water into cup","bugReason":"You should pour hot water, not cold — and only after boiling","options":["Fill kettle with water","Turn kettle on","Pour cold water into cup","Wait for kettle to boil"]},...]}`,
      "Generate Debug Detective puzzles."
    ).then(d=>setPuzzles(d?.puzzles));
  },[]);

  useEffect(()=>{
    if(!puzzles)return;
    setSel(null);setAnswered(false);
    if(mode==="audio") setTimeout(()=>speak("Find the bug in: "+puzzles[idx].scenario,child.tutor),200);
  },[idx,puzzles]);

  const answer=(opt)=>{
    if(answered)return;
    setSel(opt);setAnswered(true);
    const ok=opt===puzzles[idx].bugStep;
    if(ok)setScore(s=>s+1);
    if(mode==="audio") speak(ok?"Found it!":"The bug was: "+puzzles[idx].bugStep,child.tutor);
    setTimeout(()=>{if(idx+1>=puzzles.length)setDone(true);else setIdx(i=>i+1);},900);
  };

  if(!puzzles)return <GameLoad name="Debug Detective" emoji="🔍" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,puzzles.length);return <GameEnd name="Debug Detective" emoji="🔍" score={score} max={puzzles.length} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}

  const p=puzzles[idx];
  return (
    <GameShell name="Debug Detective" emoji="🔍" subject="Computing" score={score} maxScore={puzzles.length} round={idx+1} total={puzzles.length} streak={0} onQuit={onQuit}>
      <Card style={{marginBottom:14}}>
        <p style={{fontSize:13,fontWeight:700,color:C.muted,marginBottom:4}}>Find the bug in this algorithm</p>
        <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:12}}>{p?.scenario}</p>
        {p?.steps.map((step,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,padding:"8px 10px",borderRadius:8,background:answered&&step===p.bugStep?C.rLight:C.bg,border:`1px solid ${answered&&step===p.bugStep?C.red:C.border}`}}>
            <span style={{width:20,height:20,borderRadius:"50%",background:C.primary,color:"#fff",fontSize:11,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</span>
            <p style={{fontSize:13,fontWeight:600,color:answered&&step===p.bugStep?C.red:C.text}}>{step}</p>
          </div>
        ))}
      </Card>
      <p style={{fontSize:13,fontWeight:800,color:C.muted,marginBottom:10}}>Which step is the bug?</p>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {p?.options?.map(opt=>{
          const isRight=opt===p.bugStep,isSel=opt===sel;
          const bg=answered&&isRight?C.gLight:answered&&isSel&&!isRight?C.rLight:C.surface;
          const bc=answered&&isRight?C.green:answered&&isSel&&!isRight?C.red:C.border;
          return <button key={opt} onClick={()=>answer(opt)} disabled={answered} style={{padding:"12px 14px",borderRadius:10,fontSize:14,fontWeight:700,textAlign:"left",cursor:answered?"default":"pointer",background:bg,border:`2px solid ${bc}`,fontFamily:F,transition:"all 0.15s"}}>{opt}</button>;
        })}
      </div>
      {answered&&<div style={{marginTop:12,padding:"10px 14px",borderRadius:10,background:sel===p?.bugStep?C.gLight:C.rLight}}><p style={{fontSize:13,fontWeight:700,color:sel===p?.bugStep?C.green:C.red}}>{sel===p?.bugStep?"✓ Found it! ":"✗ The bug was: "+p?.bugStep+" — "}{p?.bugReason}</p></div>}
    </GameShell>
  );
}

// ── Word Match (Languages) ────────────────────────────────────────────────
function WordMatch({child,mode,onComplete,onQuit,level=1}) {
  const [pairs,setPairs]=useState(null);
  const [selEng,setSelEng]=useState(null);
  const [selFr,setSelFr]=useState(null);
  const [matched,setMatched]=useState([]);
  const [wrong,setWrong]=useState([]);
  const [lang,setLang]=useState("French");
  const [done,setDone]=useState(false);
  const [score,setScore]=useState(0);

  useEffect(()=>{
    claude(
      `Generate 6 word pairs for a ${lang} vocabulary matching game for age ${child.age}.
Use simple common words a beginner would learn first.
Return ONLY valid JSON: {"lang":"${lang}","pairs":[{"english":"dog","translation":"chien","emoji":"🐕"},{"english":"cat","translation":"chat","emoji":"🐱"},{"english":"house","translation":"maison","emoji":"🏠"},{"english":"water","translation":"eau","emoji":"💧"},{"english":"book","translation":"livre","emoji":"📚"},{"english":"apple","translation":"pomme","emoji":"🍎"}]}`,
      `Generate ${lang} Word Match pairs.`
    ).then(d=>setPairs(d?.pairs));
  },[lang]);

  const shuffledEng=React.useMemo(()=>pairs?shuffle([...pairs]):[],[pairs]);
  const shuffledFr=React.useMemo(()=>pairs?shuffle([...pairs]):[],[pairs]);

  useEffect(()=>{
    if(selEng&&selFr){
      const ok=selEng.english===selFr.english;
      if(ok){
        setMatched(m=>[...m,selEng.english]);
        setScore(s=>s+1);
        if(mode==="audio") speak(selEng.english+" is "+selFr.translation,child.tutor);
        if(matched.length+1>=pairs.length) setTimeout(()=>setDone(true),600);
      } else {
        setWrong([selEng.english,selFr.english]);
        setTimeout(()=>setWrong([]),800);
      }
      setTimeout(()=>{setSelEng(null);setSelFr(null);},400);
    }
  },[selEng,selFr]);

  if(!pairs)return <GameLoad name="Word Match" emoji="🌐" tutor={child.tutor}/>;
  if(done){const xp=calcXP(score,pairs.length);return <GameEnd name="Word Match" emoji="🌐" score={score} max={pairs.length} child={child} xp={xp} onDone={()=>onComplete(score,xp)}/>;}

  return (
    <GameShell name="Word Match" emoji="🌐" subject="Computing" score={score} maxScore={pairs?.length||6} round={matched.length+1} total={pairs?.length||6} streak={0} onQuit={onQuit}>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["French","Spanish"].map(l=><button key={l} onClick={()=>{setPairs(null);setLang(l);setMatched([]);setSelEng(null);setSelFr(null);}} style={{flex:1,padding:"8px",borderRadius:10,fontFamily:F,fontSize:13,fontWeight:800,cursor:"pointer",background:lang===l?C.pLight:C.surface,border:`2px solid ${lang===l?C.primary:C.border}`,color:lang===l?C.primary:C.muted}}>{l==="French"?"🇫🇷":"🇪🇸"} {l}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div>
          <p style={{fontSize:11,fontWeight:800,color:C.muted,marginBottom:8,textAlign:"center"}}>🇬🇧 ENGLISH</p>
          {shuffledEng.map(p=>{
            const isDone=matched.includes(p.english);
            const isSel=selEng?.english===p.english;
            const isWrong=wrong.includes(p.english);
            return <button key={p.english} onClick={()=>!isDone&&setSelEng(p)} style={{width:"100%",marginBottom:8,padding:"12px 8px",borderRadius:12,fontSize:14,fontWeight:800,cursor:isDone?"default":"pointer",fontFamily:F,transition:"all 0.15s",background:isDone?C.gLight:isWrong?C.rLight:isSel?C.pLight:C.surface,border:`2px solid ${isDone?C.green:isWrong?C.red:isSel?C.primary:C.border}`,color:isDone?C.green:isWrong?C.red:isSel?C.primary:C.text,textAlign:"center"}}>{p.emoji} {p.english}</button>;
          })}
        </div>
        <div>
          <p style={{fontSize:11,fontWeight:800,color:C.muted,marginBottom:8,textAlign:"center"}}>{lang==="French"?"🇫🇷":"🇪🇸"} {lang.toUpperCase()}</p>
          {shuffledFr.map(p=>{
            const isDone=matched.includes(p.english);
            const isSel=selFr?.english===p.english;
            const isWrong=wrong.includes(p.english);
            return <button key={p.translation} onClick={()=>!isDone&&setSelFr(p)} style={{width:"100%",marginBottom:8,padding:"12px 8px",borderRadius:12,fontSize:14,fontWeight:800,cursor:isDone?"default":"pointer",fontFamily:F,transition:"all 0.15s",background:isDone?C.gLight:isWrong?C.rLight:isSel?C.pLight:C.surface,border:`2px solid ${isDone?C.green:isWrong?C.red:isSel?C.primary:C.border}`,color:isDone?C.green:isWrong?C.red:isSel?C.primary:C.text,textAlign:"center"}}>{p.translation}</button>;
          })}
        </div>
      </div>
    </GameShell>
  );
}


// ── 🎣 MATHS FISHING ─────────────────────────────────────────────────────
function MathFishing({child,mode,onComplete,onQuit,level=1}) {
  const ROUNDS=8;
  const [qs,setQs]=useState(null);
  const [idx,setIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [caught,setCaught]=useState(null);
  const [fish,setFish]=useState([]);
  const [casting,setCasting]=useState(false);
  const [done,setDone]=useState(false);
  const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{
    const t=setTimeout(()=>setLoadErr(true),12000);
    claude(`Generate ${ROUNDS} maths equations for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level} (${getLevelContext(level)}). Each has one correct answer and 3 wrong answers (close but wrong). Return ONLY valid JSON: {"questions":[{"equation":"2 + 3 =","correct":5,"wrong":[4,6,7]}]}`,"Fishing maths questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});
  },[]);
  useEffect(()=>{
    if(!qs||done) return;
    const q=qs[idx];if(!q) return;
    const answers=[q.correct,...(q.wrong||[])].sort(()=>Math.random()-0.5);
    setFish(answers.map((ans,i)=>({id:i,ans,x:10+i*22,y:40+Math.random()*35,correct:ans===q.correct,speed:1+Math.random(),dir:Math.random()>0.5?1:-1})));
    setCaught(null);
  },[idx,qs]);
  useEffect(()=>{
    if(done||caught!==null) return;
    const interval=setInterval(()=>setFish(prev=>prev.map(f=>({...f,x:f.x+f.speed*f.dir*0.4,dir:f.x>85?-1:f.x<5?1:f.dir}))),120);
    return()=>clearInterval(interval);
  },[done,caught]);
  const cast=(f)=>{
    if(caught!==null) return;
    setCasting(true);
    setTimeout(()=>{
      setCaught(f);setCasting(false);
      if(f.correct) setScore(s=>s+1);
      setTimeout(()=>{if(idx+1>=ROUNDS)setDone(true);else setIdx(i=>i+1);},1200);
    },500);
  };
  if(loadErr)return <GameError name="Maths Fishing" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Maths Fishing" emoji="🎣" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Maths Fishing" emoji="🎣" score={score} max={ROUNDS} child={child} xp={score*8} onDone={()=>onComplete({score,max:ROUNDS,xp:score*8})}/>;
  const q=qs[idx];
  return (
    <GameShell name="Maths Fishing" emoji="🎣" subject="Maths" score={score} maxScore={ROUNDS} round={idx+1} total={ROUNDS} streak={0} onQuit={onQuit}>
      <div style={{textAlign:"center",marginBottom:12}}>
        <p style={{fontSize:14,fontWeight:700,color:C.muted,marginBottom:6}}>Tap the fish with the right answer!</p>
        <div style={{fontSize:30,fontWeight:900,color:C.primary,background:C.pLight,borderRadius:16,padding:"10px 20px",display:"inline-block"}}>{q?.equation}</div>
      </div>
      <div style={{position:"relative",height:200,background:"linear-gradient(180deg,#BAE6FD,#0EA5E9 50%,#0369A1)",borderRadius:20,overflow:"hidden",marginBottom:12}}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",zIndex:3}}>
          <div style={{width:3,height:casting?70:16,background:"#92400E",borderRadius:2,transition:"height 0.4s",margin:"0 auto"}}/>
          {casting&&<div style={{width:8,height:8,borderRadius:"50%",background:"#FCD34D",margin:"-4px auto"}}/>}
        </div>
        {fish.map(f=>(
          <button key={f.id} onClick={()=>cast(f)} style={{position:"absolute",left:`${f.x}%`,top:`${f.y}%`,transform:"translateX(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:26,filter:caught?.id===f.id?(f.correct?"drop-shadow(0 0 8px #22C55E)":"drop-shadow(0 0 8px #EF4444)"):"none"}}>
            🐟<div style={{position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",background:"#fff",borderRadius:6,padding:"1px 6px",fontSize:12,fontWeight:900,color:caught?.id===f.id?(f.correct?C.green:C.red):C.text,whiteSpace:"nowrap",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}>{f.ans}</div>
          </button>
        ))}
        {caught&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.35)",borderRadius:20,fontSize:56}}>{caught.correct?"✅":"❌"}</div>}
      </div>
    </GameShell>
  );
}

// ── 🚀 SPACE BLASTER ─────────────────────────────────────────────────────
function SpaceBlaster({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=10;
  const [qs,setQs]=useState(null);
  const [idx,setIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [shot,setShot]=useState(null);
  const [done,setDone]=useState(false);
  const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{
    const t=setTimeout(()=>setLoadErr(true),12000);
    claude(`Generate ${TOTAL} maths questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Each has a question and exactly 4 answer options (one correct). Return ONLY valid JSON: {"questions":[{"q":"5 × 3 =","options":[12,15,18,20],"correct":15}]}`,"Space blaster questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});
  },[]);
  const fire=(opt)=>{
    if(shot!==null||!qs) return;
    const correct=opt===qs[idx]?.correct;
    setShot(opt);
    if(correct) setScore(s=>s+1);
    setTimeout(()=>{setShot(null);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},700);
  };
  if(loadErr)return <GameError name="Space Blaster" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Space Blaster" emoji="🚀" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Space Blaster" emoji="🚀" score={score} max={TOTAL} child={child} xp={score*10} onDone={()=>onComplete({score,max:TOTAL,xp:score*10})}/>;
  const q=qs[idx];
  const aliens=["👾","🛸","👽","🤖","☄️"];
  return (
    <GameShell name="Space Blaster" emoji="🚀" subject="Maths" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
      <div style={{background:"linear-gradient(180deg,#0F0F1A,#1E1B4B,#312E81)",borderRadius:20,padding:"16px",marginBottom:12,textAlign:"center",position:"relative",minHeight:150}}>
        {[...Array(12)].map((_,i)=><div key={i} style={{position:"absolute",width:2,height:2,background:"#fff",borderRadius:"50%",top:`${Math.random()*90}%`,left:`${(i/12)*100}%`,opacity:0.5+Math.random()*0.5}}/>)}
        <div style={{fontSize:36,marginBottom:8}}>{aliens[idx%aliens.length]}</div>
        <div style={{fontSize:28,fontWeight:900,color:"#FCD34D",textShadow:"0 0 10px rgba(252,211,77,0.5)",marginBottom:8}}>{q?.q}</div>
        {shot!==null&&<div style={{position:"absolute",left:"50%",top:0,bottom:0,width:3,background:"linear-gradient(#FCD34D,transparent)",transform:"translateX(-50%)",opacity:0.7}}/>}
        <div style={{fontSize:28}}>🚀</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {q?.options?.map((opt,i)=>(
          <button key={i} onClick={()=>fire(opt)} disabled={shot!==null}
            style={{padding:"14px",borderRadius:14,fontSize:18,fontWeight:900,cursor:shot!==null?"default":"pointer",fontFamily:F,
              border:`2px solid ${shot===null?C.border:opt===q.correct?"#22C55E":opt===shot?"#EF4444":C.border}`,
              background:shot===null?C.surface:opt===q.correct?C.gLight:opt===shot?C.rLight:C.surface,
              color:shot===null?C.text:opt===q.correct?C.green:opt===shot?C.red:C.muted,transition:"all 0.2s"}}>
            {opt}
          </button>
        ))}
      </div>
    </GameShell>
  );
}

// ── 💎 GEM HUNTER ────────────────────────────────────────────────────────
function GemHunter({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;
  const [qs,setQs]=useState(null);
  const [idx,setIdx]=useState(0);
  const [gems,setGems]=useState(0);
  const [digging,setDigging]=useState(false);
  const [sel,setSel]=useState(null);
  const [ans,setAns]=useState(false);
  const [done,setDone]=useState(false);
  const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{
    const t=setTimeout(()=>setLoadErr(true),12000);
    claude(`Generate ${TOTAL} English spelling/vocabulary/grammar questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Mix question types. Return ONLY valid JSON: {"questions":[{"q":"Which word is spelt correctly?","options":["A) frend","B) friend","C) freind","D) friand"],"correct":"B"}]}`,"Gem hunter questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});
  },[]);
  const dig=()=>{if(digging)return;setDigging(true);};
  const answer=(opt)=>{
    if(ans) return;
    setSel(opt);setAns(true);
    if(opt.charAt(0)===qs[idx]?.correct) setGems(g=>g+1);
    setTimeout(()=>{setSel(null);setAns(false);setDigging(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},1000);
  };
  if(loadErr)return <GameError name="Gem Hunter" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Gem Hunter" emoji="💎" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Gem Hunter" emoji="💎" score={gems} max={TOTAL} child={child} xp={gems*8} onDone={()=>onComplete({score:gems,max:TOTAL,xp:gems*8})}/>;
  const q=qs[idx];
  const gemEmojis=["💎","🔮","💍","🌟","✨","🏆"];
  return (
    <GameShell name="Gem Hunter" emoji="💎" subject="English" score={gems} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
      {!digging?(
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>⛏️</div>
          <p style={{fontSize:15,fontWeight:700,color:C.muted,marginBottom:20}}>Tap to dig and find a gem!</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
            {Array.from({length:8}).map((_,i)=>(
              <button key={i} onClick={i===idx%8?dig:undefined} style={{height:60,borderRadius:12,fontSize:22,border:`2px solid ${i===idx%8?C.amber:C.border}`,background:i===idx%8?"linear-gradient(135deg,#78350F,#92400E)":"#E5E7EB",cursor:i===idx%8?"pointer":"default",transition:"all 0.2s"}}>
                {i===idx%8?"🪨":"💫"}
              </button>
            ))}
          </div>
          <p style={{fontSize:12,color:C.amber,fontWeight:700}}>💎 {gems} gems found</p>
        </div>
      ):(
        <div>
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:36}}>{gemEmojis[idx%6]}</div>
            <p style={{fontSize:14,fontWeight:700,color:C.green}}>You found a gem! Answer to keep it!</p>
          </div>
          <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
          <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
        </div>
      )}
    </GameShell>
  );
}

// ── 🏃 WORD RUNNER ───────────────────────────────────────────────────────
function WordRunner({child,mode,onComplete,onQuit,level=1}) {
  const ROUNDS=8;
  const [qs,setQs]=useState(null);
  const [idx,setIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [falling,setFalling]=useState([]);
  const [caught,setCaught]=useState(null);
  const [done,setDone]=useState(false);
  const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{
    const t=setTimeout(()=>setLoadErr(true),12000);
    claude(`Generate ${ROUNDS} grammar questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Types: "Catch the VERB!", "Grab the ADJECTIVE!", "Find the NOUN!". 4 options each, 1 correct. Return ONLY valid JSON: {"questions":[{"instruction":"Catch the VERB!","options":["run","happy","quickly","big"],"correct":"run"}]}`,"Word runner questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});
  },[]);
  useEffect(()=>{
    if(!qs||done||caught!==null) return;
    const q=qs[idx];if(!q) return;
    const shuffled=[...q.options].sort(()=>Math.random()-0.5);
    setFalling(shuffled.map((w,i)=>({id:i,word:w,x:8+i*23,y:-15,correct:w===q.correct,speed:0.7+level*0.1})));
  },[idx,qs]);
  useEffect(()=>{
    if(done||caught!==null) return;
    const interval=setInterval(()=>{
      setFalling(prev=>{
        const updated=prev.map(w=>({...w,y:w.y+w.speed}));
        if(updated.length&&updated.every(w=>w.y>90)){
          setCaught({missed:true});
          setTimeout(()=>{setCaught(null);if(idx+1>=ROUNDS)setDone(true);else setIdx(i=>i+1);},700);
        }
        return updated;
      });
    },80);
    return()=>clearInterval(interval);
  },[done,caught,idx]);
  const catchWord=(w)=>{
    if(caught) return;
    setCaught(w);
    if(w.correct) setScore(s=>s+1);
    setTimeout(()=>{setCaught(null);if(idx+1>=ROUNDS)setDone(true);else setIdx(i=>i+1);},800);
  };
  if(loadErr)return <GameError name="Word Runner" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Word Runner" emoji="🏃" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Word Runner" emoji="🏃" score={score} max={ROUNDS} child={child} xp={score*8} onDone={()=>onComplete({score,max:ROUNDS,xp:score*8})}/>;
  const q=qs[idx];
  return (
    <GameShell name="Word Runner" emoji="🏃" subject="English" score={score} maxScore={ROUNDS} round={idx+1} total={ROUNDS} streak={0} onQuit={onQuit}>
      <div style={{background:"linear-gradient(180deg,#EEF2FF,#C7D2FE)",borderRadius:20,height:220,position:"relative",overflow:"hidden",marginBottom:12}}>
        <div style={{position:"absolute",top:10,left:0,right:0,textAlign:"center",zIndex:2}}>
          <div style={{background:"rgba(79,70,229,0.9)",borderRadius:20,padding:"5px 14px",display:"inline-block"}}>
            <p style={{fontSize:14,fontWeight:900,color:"#fff"}}>{q?.instruction}</p>
          </div>
        </div>
        {!caught&&falling.map(w=>(
          <button key={w.id} onClick={()=>catchWord(w)}
            style={{position:"absolute",left:`${w.x}%`,top:`${w.y}%`,transform:"translateX(-50%)",
              padding:"6px 12px",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",
              background:w.correct?"#FEF3C7":"#EDE9FE",border:`2px solid ${w.correct?"#F59E0B":"#7C3AED"}`,
              color:w.correct?"#92400E":"#5B21B6",fontFamily:F,boxShadow:"0 2px 6px rgba(0,0,0,0.15)",whiteSpace:"nowrap"}}>
            {w.word}
          </button>
        ))}
        {caught&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.7)",fontSize:56}}>{caught.missed?"💨":caught.correct?"🎉":"❌"}</div>}
        <div style={{position:"absolute",bottom:6,left:"50%",transform:"translateX(-50%)",fontSize:26}}>🏃</div>
      </div>
      <p style={{textAlign:"center",fontSize:12,color:C.muted,fontWeight:600}}>Tap the correct word as it falls!</p>
    </GameShell>
  );
}

// ── 🌋 VOLCANO ESCAPE ────────────────────────────────────────────────────
function VolcanoEscape({child,mode,onComplete,onQuit,level=1}) {
  const STEPS=8;
  const [qs,setQs]=useState(null);
  const [idx,setIdx]=useState(0);
  const [climbed,setClimbed]=useState(0);
  const [sel,setSel]=useState(null);
  const [ans,setAns]=useState(false);
  const [done,setDone]=useState(false);
  const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{
    const t=setTimeout(()=>setLoadErr(true),12000);
    claude(`Generate ${STEPS} science questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Fun volcano escape theme! Return ONLY valid JSON: {"questions":[{"q":"What force pulls things down?","options":["A) Friction","B) Gravity","C) Magnetism","D) Air resistance"],"correct":"B","fact":"Gravity pulls everything towards Earth!"}]}`,"Volcano escape questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});
  },[]);
  const answer=(opt)=>{
    if(ans) return;
    setSel(opt);setAns(true);
    const q=qs[idx];
    if(opt.charAt(0)===q?.correct) setClimbed(c=>c+1);
    setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=STEPS)setDone(true);else setIdx(i=>i+1);},1200);
  };
  if(loadErr)return <GameError name="Volcano Escape" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Volcano Escape" emoji="🌋" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Volcano Escape" emoji="🌋" score={climbed} max={STEPS} child={child} xp={climbed*10} onDone={()=>onComplete({score:climbed,max:STEPS,xp:climbed*10})}/>;
  const q=qs[idx];
  const pct=Math.round((climbed/STEPS)*100);
  return (
    <GameShell name="Volcano Escape" emoji="🌋" subject="Science" score={climbed} maxScore={STEPS} round={idx+1} total={STEPS} streak={0} onQuit={onQuit}>
      <div style={{background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:16,padding:"12px 14px",marginBottom:14,border:"2px solid #F59E0B"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontSize:28}}>🌋</span>
          <div style={{flex:1}}>
            <div style={{height:10,borderRadius:5,background:"rgba(0,0,0,0.15)"}}>
              <div style={{height:"100%",width:`${pct}%`,borderRadius:5,background:pct>60?"#22C55E":"#EF4444",transition:"width 0.4s"}}/>
            </div>
          </div>
          <span style={{fontSize:24}}>{pct>60?"🏃":"🔥"}</span>
        </div>
        <p style={{fontSize:12,fontWeight:700,color:"#92400E",textAlign:"center"}}>{pct===0?"The volcano is erupting — answer to climb!":pct<50?"Keep going — lava is rising!":"Almost safe — nearly there!"}</p>
      </div>
      <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14,lineHeight:1.6}}>{q?.q}</p>
      <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
      {ans&&q?.fact&&<div style={{marginTop:10,padding:"10px 14px",borderRadius:10,background:C.pLight}}><p style={{fontSize:12,fontWeight:700,color:C.primary}}>🔬 {q.fact}</p></div>}
    </GameShell>
  );
}

// ── 🗺️ TREASURE HUNT ─────────────────────────────────────────────────────
function TreasureMap({child,mode,onComplete,onQuit,level=1}) {
  const CLUES=7;
  const [qs,setQs]=useState(null);
  const [idx,setIdx]=useState(0);
  const [found,setFound]=useState(0);
  const [sel,setSel]=useState(null);
  const [ans,setAns]=useState(false);
  const [done,setDone]=useState(false);
  const [loadErr,setLoadErr]=useState(false);
  const country=child.country||"UK";
  const histSubj=country==="US"?"American History and US Geography":country==="CA"?"Canadian Heritage and Geography":"British History and UK Geography";
  useEffect(()=>{
    const t=setTimeout(()=>setLoadErr(true),12000);
    claude(`Generate ${CLUES} treasure hunt questions about ${histSubj} for age ${child.age}, Level ${level}. Questions feel like pirate clues. Mix history and geography. Return ONLY valid JSON: {"questions":[{"clue":"To find the treasure: What is the capital of England?","options":["A) Manchester","B) London","C) Birmingham","D) Leeds"],"correct":"B","treasure":"⚓ London is the capital!"}]}`,"Treasure hunt questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});
  },[]);
  const answer=(opt)=>{
    if(ans) return;
    setSel(opt);setAns(true);
    if(opt.charAt(0)===qs[idx]?.correct) setFound(f=>f+1);
    setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=CLUES)setDone(true);else setIdx(i=>i+1);},1300);
  };
  if(loadErr)return <GameError name="Treasure Hunt" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Treasure Hunt" emoji="🗺️" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Treasure Hunt" emoji="🗺️" score={found} max={CLUES} child={child} xp={found*10} onDone={()=>onComplete({score:found,max:CLUES,xp:found*10})}/>;
  const q=qs[idx];
  const mapIcons=["🏴‍☠️","⚓","🏝️","🌊","🧭","🏰","💰"];
  return (
    <GameShell name="Treasure Hunt" emoji="🗺️" subject="History" score={found} maxScore={CLUES} round={idx+1} total={CLUES} streak={0} onQuit={onQuit}>
      <div style={{background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:16,padding:"12px 14px",marginBottom:14,border:"2px dashed #F59E0B"}}>
        <div style={{display:"flex",gap:6,marginBottom:8}}>{mapIcons.map((icon,i)=><span key={i} style={{fontSize:16,opacity:i<=idx?1:0.3}}>{icon}</span>)}</div>
        <p style={{fontSize:13,fontWeight:800,color:"#92400E",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>🗺️ Clue {idx+1} of {CLUES}</p>
        <p style={{fontSize:14,fontWeight:700,color:"#78350F",lineHeight:1.6,fontStyle:"italic"}}>{q?.clue}</p>
      </div>
      <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
      {ans&&q?.treasure&&<div style={{marginTop:10,padding:"10px 14px",borderRadius:10,background:"#FEF3C7",border:"2px solid #F59E0B"}}><p style={{fontSize:13,fontWeight:700,color:"#92400E"}}>{q.treasure}</p></div>}
    </GameShell>
  );
}

// ── 🏎️ GRAND PRIX RACING ─────────────────────────────────────────────────
function GrandPrix({child,mode,onComplete,onQuit,level=1}) {
  const LAPS=8;
  const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [pos,setPos]=useState(5);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${LAPS} measurement questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Mix: length, mass, capacity, time, money, perimeter, area. Return ONLY valid JSON: {"questions":[{"q":"How many cm in 1m?","options":["A) 10","B) 100","C) 1000","D) 10000"],"correct":"B"}]}`,"Grand prix questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);const ok=opt.charAt(0)===qs[idx]?.correct;if(ok)setPos(p=>Math.max(1,p-1));else setPos(p=>Math.min(8,p+1));setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=LAPS)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Grand Prix" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Grand Prix Racing" emoji="🏎️" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Grand Prix Racing" emoji="🏎️" score={8-pos+1} max={LAPS} child={child} xp={(8-pos+1)*10} onDone={()=>onComplete({score:8-pos+1,max:LAPS,xp:(8-pos+1)*10})}/>;
  const q=qs[idx];const cars=["🏎️","🚗","🚕","🚙","🚓","🚑","🚌","🚚"];
  return (<GameShell name="Grand Prix Racing" emoji="🏎️" subject="Maths" score={8-pos+1} maxScore={LAPS} round={idx+1} total={LAPS} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#1F2937,#374151)",borderRadius:16,padding:12,marginBottom:12}}>
      <p style={{fontSize:11,fontWeight:800,color:"#9CA3AF",textTransform:"uppercase",marginBottom:8}}>RACE POSITION</p>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {cars.map((car,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 8px",borderRadius:8,background:i===pos-1?"rgba(251,191,36,0.2)":"transparent"}}>
          <span style={{fontSize:11,fontWeight:800,color:"#9CA3AF",width:16}}>{i+1}</span>
          <div style={{flex:1,height:3,background:"#4B5563",borderRadius:2,position:"relative"}}>
            {i===pos-1&&<div style={{position:"absolute",right:0,fontSize:18,top:-8}}>🏎️</div>}
          </div>
        </div>)}
      </div>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🍭 CANDY SHOP ────────────────────────────────────────────────────────
function CandyShop({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [coins,setCoins]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} money/financial maths questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Theme: buying sweets and candy. Involve prices, change, totals. Return ONLY valid JSON: {"questions":[{"q":"You buy a lolly for 35p. You pay 50p. How much change?","options":["A) 10p","B) 15p","C) 20p","D) 25p"],"correct":"B"}]}`,"Candy shop questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setCoins(c=>c+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Candy Shop" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Candy Shop" emoji="🍭" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Candy Shop" emoji="🍭" score={coins} max={TOTAL} child={child} xp={coins*8} onDone={()=>onComplete({score:coins,max:TOTAL,xp:coins*8})}/>;
  const q=qs[idx];const sweets=["🍭","🍬","🍫","🍩","🧁","🍪","🍡","🎂"];
  return (<GameShell name="Candy Shop" emoji="🍭" subject="Maths" score={coins} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#FDF2F8,#FCE7F3)",borderRadius:16,padding:14,marginBottom:12,border:"2px dashed #EC4899",textAlign:"center"}}>
      <div style={{fontSize:28,marginBottom:4}}>{sweets[idx%8]}</div>
      <p style={{fontSize:12,fontWeight:800,color:"#BE185D"}}>🪙 {coins} coins earned</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🏀 BASKETBALL MATHS ──────────────────────────────────────────────────
function BasketballMaths({child,mode,onComplete,onQuit,level=1}) {
  const SHOTS=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [shooting,setShooting]=useState(false);const [result,setResult]=useState(null);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${SHOTS} statistics and data questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Types: reading charts, calculating averages, interpreting data. Return ONLY valid JSON: {"questions":[{"q":"A bar chart shows: Mon=5, Tue=8, Wed=3, Thu=6. What is the mean?","options":["A) 5","B) 5.5","C) 6","D) 22"],"correct":"B"}]}`,"Basketball stats questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);const ok=opt.charAt(0)===qs[idx]?.correct;setShooting(true);setTimeout(()=>{setResult(ok?"score":"miss");if(ok)setScore(s=>s+1);setShooting(false);setTimeout(()=>{setResult(null);setSel(null);setAns(false);if(idx+1>=SHOTS)setDone(true);else setIdx(i=>i+1);},600);},400);};
  if(loadErr)return <GameError name="Basketball Maths" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Basketball Maths" emoji="🏀" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Basketball Maths" emoji="🏀" score={score} max={SHOTS} child={child} xp={score*10} onDone={()=>onComplete({score,max:SHOTS,xp:score*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Basketball Maths" emoji="🏀" subject="Maths" score={score} maxScore={SHOTS} round={idx+1} total={SHOTS} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(180deg,#1E3A5F,#1E40AF)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center",position:"relative",height:80}}>
      <div style={{fontSize:28,position:"absolute",top:8,left:"50%",transform:"translateX(-50%)"}}>🏀</div>
      {result&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:16,background:"rgba(0,0,0,0.5)",fontSize:36}}>{result==="score"?"🎯":"💨"}</div>}
      <div style={{position:"absolute",bottom:8,right:16,fontSize:28}}>🏀</div>
      <div style={{position:"absolute",top:8,right:16,fontSize:22}}>🥅</div>
    </div>
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🚂 NUMBER TRAIN ──────────────────────────────────────────────────────
function TrainGame({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} number sequence and place value questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Each question shows a sequence with a missing number. Return ONLY valid JSON: {"questions":[{"sequence":"2, 4, 6, ?, 10","q":"What is the missing number?","options":["A) 7","B) 8","C) 9","D) 12"],"correct":"B"}]}`,"Number train questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Number Train" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Number Train" emoji="🚂" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Number Train" emoji="🚂" score={score} max={TOTAL} child={child} xp={score*8} onDone={()=>onComplete({score,max:TOTAL,xp:score*8})}/>;
  const q=qs[idx];
  return (<GameShell name="Number Train" emoji="🚂" subject="Maths" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#1C1917,#292524)",borderRadius:16,padding:14,marginBottom:12}}>
      <div style={{display:"flex",gap:6,alignItems:"center",overflowX:"auto",paddingBottom:4}}>
        <span style={{fontSize:26}}>🚂</span>
        {q?.sequence?.split(",").map((n,i)=><div key={i} style={{minWidth:48,height:40,borderRadius:8,background:n.trim()==="?"?"#FCD34D":"#E5E7EB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:n.trim()==="?"?"#92400E":"#1F2937",flexShrink:0,border:n.trim()==="?"?"2px solid #F59E0B":"2px solid #D1D5DB"}}>{n.trim()}</div>)}
        <span style={{fontSize:22}}>🏁</span>
      </div>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🛒 SUPERMARKET SWEEP ─────────────────────────────────────────────────
function SupermarketMath({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [basket,setBasket]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} supermarket maths questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Involve totals, change, discounts, unit prices, best value. Return ONLY valid JSON: {"questions":[{"q":"Apples cost 40p each. How much for 3?","options":["A) £1.00","B) £1.20","C) £1.40","D) £1.60"],"correct":"B","item":"🍎 Apples"}]}`,"Supermarket maths questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);const ok=opt.charAt(0)===qs[idx]?.correct;if(ok){setScore(s=>s+1);setBasket(b=>b+1);}setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Supermarket Sweep" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Supermarket Sweep" emoji="🛒" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Supermarket Sweep" emoji="🛒" score={score} max={TOTAL} child={child} xp={score*8} onDone={()=>onComplete({score,max:TOTAL,xp:score*8})}/>;
  const q=qs[idx];
  return (<GameShell name="Supermarket Sweep" emoji="🛒" subject="Maths" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",borderRadius:16,padding:14,marginBottom:12,border:"2px solid #86EFAC",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{fontSize:28}}>{q?.item?.split(" ")[0]||"🛒"}</div>
      <div style={{textAlign:"center"}}>
        <p style={{fontSize:11,fontWeight:800,color:C.green,textTransform:"uppercase"}}>Items in basket</p>
        <p style={{fontSize:24,fontWeight:900,color:C.green}}>{basket}</p>
      </div>
      <div style={{fontSize:28}}>🛒</div>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🛸 ROCKET MATHS ──────────────────────────────────────────────────────
function RocketMaths({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [fuel,setFuel]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} algebra questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Missing numbers, equations, sequences. Return ONLY valid JSON: {"questions":[{"q":"If x + 5 = 12, what is x?","options":["A) 5","B) 6","C) 7","D) 8"],"correct":"C"}]}`,"Rocket algebra questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);const ok=opt.charAt(0)===qs[idx]?.correct;if(ok)setFuel(f=>f+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Rocket Launch" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Rocket Launch" emoji="🛸" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Rocket Launch" emoji="🛸" score={fuel} max={TOTAL} child={child} xp={fuel*10} onDone={()=>onComplete({score:fuel,max:TOTAL,xp:fuel*10})}/>;
  const q=qs[idx];const fuelPct=Math.round((fuel/TOTAL)*100);
  return (<GameShell name="Rocket Launch" emoji="🛸" subject="Maths" score={fuel} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(180deg,#0F0F1A,#1E1B4B)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:6}}>🚀</div>
      <p style={{fontSize:11,fontWeight:800,color:"#9CA3AF",marginBottom:4}}>FUEL LEVEL</p>
      <div style={{height:12,borderRadius:6,background:"rgba(255,255,255,0.1)",overflow:"hidden"}}><div style={{height:"100%",width:`${fuelPct}%`,background:"linear-gradient(90deg,#3B82F6,#06B6D4)",borderRadius:6,transition:"width 0.4s"}}/></div>
      <p style={{fontSize:11,color:"#60A5FA",fontWeight:700,marginTop:4}}>{fuelPct}% — {fuel>=TOTAL*0.8?"Ready for launch! 🚀":fuel>=TOTAL*0.5?"Building fuel...":"Need more fuel!"}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🎱 SPELLING BINGO ────────────────────────────────────────────────────
function SpellBingo({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=9;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [card,setCard]=useState([]);const [dabbed,setDabbed]=useState([]);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} spelling questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Each: which is the correct spelling? Return ONLY valid JSON: {"questions":[{"q":"Which is correct?","options":["A) frend","B) friend","C) freind","D) friand"],"correct":"B","word":"friend"}]}`,"Spelling bingo questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else{setQs(d.questions);setCard(d.questions.map((q,i)=>({id:i,word:q.word||"Word"})).sort(()=>Math.random()-0.5));}});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);const ok=opt.charAt(0)===qs[idx]?.correct;if(ok)setDabbed(d=>[...d,idx]);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Spelling Bingo" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Spelling Bingo" emoji="🎱" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Spelling Bingo" emoji="🎱" score={dabbed.length} max={TOTAL} child={child} xp={dabbed.length*8} onDone={()=>onComplete({score:dabbed.length,max:TOTAL,xp:dabbed.length*8})}/>;
  const q=qs[idx];
  return (<GameShell name="Spelling Bingo" emoji="🎱" subject="English" score={dabbed.length} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}>
      {card.map((c,i)=><div key={i} style={{padding:"6px 4px",borderRadius:10,background:dabbed.includes(c.id)?"#22C55E":C.surface,border:`2px solid ${dabbed.includes(c.id)?"#22C55E":C.border}`,textAlign:"center",fontSize:11,fontWeight:800,color:dabbed.includes(c.id)?"#fff":C.text,position:"relative"}}>
        {dabbed.includes(c.id)&&<div style={{position:"absolute",inset:0,background:"rgba(34,197,94,0.9)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✓</div>}
        {c.word}
      </div>)}
    </div>
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🎲 WORDSHAKE ─────────────────────────────────────────────────────────
function WordShake({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=6;const [rounds,setRounds]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} word-building vocabulary rounds for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Give a set of letters and 4 words that could be made (only 1 is a REAL word fitting the vocabulary level). Return ONLY valid JSON: {"questions":[{"letters":"E R I F N D","q":"Which real word can you make from these letters?","options":["A) FIREN","B) FRIEND","C) FRINED","D) NDFIRE"],"correct":"B"}]}`,"WordShake questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setRounds(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===rounds[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="WordShake" onRetry={()=>{setLoadErr(false);setRounds(null);}}/>;
  if(!rounds)return <GameLoad name="WordShake" emoji="🎲" tutor={child.tutor}/>;
  if(done)return <GameEnd name="WordShake" emoji="🎲" score={score} max={TOTAL} child={child} xp={score*10} onDone={()=>onComplete({score,max:TOTAL,xp:score*10})}/>;
  const r=rounds[idx];
  return (<GameShell name="WordShake" emoji="🎲" subject="English" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#4F46E5,#7C3AED)",borderRadius:16,padding:16,marginBottom:14,textAlign:"center"}}>
      <p style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.7)",marginBottom:8}}>SHAKE THE LETTERS!</p>
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
        {r?.letters?.split(" ").map((l,i)=><div key={i} style={{width:36,height:36,borderRadius:8,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#4F46E5",boxShadow:"0 3px 6px rgba(0,0,0,0.2)"}}>{l}</div>)}
      </div>
    </div>
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>{r?.q}</p>
    <Options options={r?.options} correct={r?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🔍 SPOT THE DIFFERENCE ───────────────────────────────────────────────
function SpotDifference({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} reading comprehension spot-the-difference questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Show two versions of a short text — one with a deliberate change. Ask what changed. Return ONLY valid JSON: {"questions":[{"original":"The cat sat on the mat.","changed":"The dog sat on the mat.","q":"What is different in the second sentence?","options":["A) cat became dog","B) sat became stood","C) mat became rug","D) Nothing changed"],"correct":"A"}]}`,"Spot the difference questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},1100);};
  if(loadErr)return <GameError name="Spot the Difference" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Spot the Difference" emoji="🔍" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Spot the Difference" emoji="🔍" score={score} max={TOTAL} child={child} xp={score*10} onDone={()=>onComplete({score,max:TOTAL,xp:score*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Spot the Difference" emoji="🔍" subject="English" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{marginBottom:12}}>
      <div style={{background:"#F0FDF4",borderRadius:12,padding:"10px 14px",marginBottom:8,border:"2px solid #86EFAC"}}>
        <p style={{fontSize:11,fontWeight:800,color:C.green,marginBottom:4}}>ORIGINAL</p>
        <p style={{fontSize:14,fontWeight:600,color:C.text,lineHeight:1.6}}>{q?.original}</p>
      </div>
      <div style={{background:"#FEF2F2",borderRadius:12,padding:"10px 14px",border:"2px solid #FCA5A5"}}>
        <p style={{fontSize:11,fontWeight:800,color:C.red,marginBottom:4}}>CHANGED</p>
        <p style={{fontSize:14,fontWeight:600,color:C.text,lineHeight:1.6}}>{q?.changed}</p>
      </div>
    </div>
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🧩 WORD PUZZLE ───────────────────────────────────────────────────────
function PuzzleWords({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} crossword-style word puzzle clues for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Give the number of letters and a definition clue. Return ONLY valid JSON: {"questions":[{"clue":"A person who fixes pipes (5 letters)","options":["A) NURSE","B) PLUMB","C) PIPEP","D) PLUMBER... wait, 6 letters"],"correct":"B","answer":"PLUMB"}]}`,"Word puzzle questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Word Puzzle" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Word Puzzle" emoji="🧩" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Word Puzzle" emoji="🧩" score={score} max={TOTAL} child={child} xp={score*10} onDone={()=>onComplete({score,max:TOTAL,xp:score*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Word Puzzle" emoji="🧩" subject="English" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#1F2937,#111827)",borderRadius:16,padding:16,marginBottom:14,textAlign:"center"}}>
      <p style={{fontSize:12,fontWeight:800,color:"#9CA3AF",marginBottom:8}}>CROSSWORD CLUE</p>
      <p style={{fontSize:15,fontWeight:700,color:"#F9FAFB",lineHeight:1.7}}>{q?.clue}</p>
    </div>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
    {ans&&q?.answer&&<div style={{marginTop:10,padding:"8px 14px",borderRadius:10,background:C.gLight}}><p style={{fontSize:13,fontWeight:800,color:C.green}}>Answer: {q.answer}</p></div>}
  </GameShell>);
}

// ── 🏃 SCHOOL RUN ────────────────────────────────────────────────────────
function SchoolRun({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [dist,setDist]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} creative writing / story sequencing questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Running to school story — choose the best word/sentence to continue. Return ONLY valid JSON: {"questions":[{"story":"Maya ran out of the door. She was late for school. She ___","q":"Which word best fills the gap?","options":["A) walked","B) sprinted","C) stood","D) slept"],"correct":"B"}]}`,"School run story questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);const ok=opt.charAt(0)===qs[idx]?.correct;if(ok){setScore(s=>s+1);setDist(d=>d+15);}else setDist(d=>d+5);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="School Run" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="School Run" emoji="🏃" tutor={child.tutor}/>;
  if(done)return <GameEnd name="School Run" emoji="🏃" score={score} max={TOTAL} child={child} xp={score*8} onDone={()=>onComplete({score,max:TOTAL,xp:score*8})}/>;
  const q=qs[idx];
  return (<GameShell name="School Run" emoji="🏃" subject="English" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#EEF2FF,#C7D2FE)",borderRadius:16,padding:14,marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <span style={{fontSize:22}}>🏫</span>
        <div style={{flex:1,height:6,borderRadius:3,background:"rgba(99,102,241,0.2)"}}>
          <div style={{height:"100%",width:`${Math.min(100,(dist/(TOTAL*15))*100)}%`,background:"#6366F1",borderRadius:3,transition:"width 0.5s"}}/>
        </div>
        <span style={{fontSize:22}}>🏃</span>
      </div>
    </div>
    {q?.story&&<div style={{background:C.surface,borderRadius:10,padding:"10px 14px",marginBottom:10,border:`1px solid ${C.border}`}}><p style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.7,fontStyle:"italic"}}>{q.story}</p></div>}
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🧠 MEMORY MATCH ──────────────────────────────────────────────────────
function MemoryWords({child,mode,onComplete,onQuit,level=1}) {
  const PAIRS=6;const [pairs,setPairs]=useState(null);const [flipped,setFlipped]=useState([]);const [matched,setMatched]=useState([]);const [attempts,setAttempts]=useState(0);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);const [locked,setLocked]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${PAIRS} word-meaning pairs for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Each: a word and its short definition. Return ONLY valid JSON: {"pairs":[{"word":"habitat","meaning":"where an animal lives"}]}`,"Memory match word pairs.").then(d=>{clearTimeout(t);if(!d?.pairs)setLoadErr(true);else{const cards=[...d.pairs.map((p,i)=>({id:i,type:"word",text:p.word,pairId:i})),...d.pairs.map((p,i)=>({id:i+PAIRS,type:"meaning",text:p.meaning,pairId:i}))].sort(()=>Math.random()-0.5);setPairs(cards);}});}, []);
  const flip=(card)=>{
    if(locked||flipped.some(f=>f.id===card.id)||matched.includes(card.pairId))return;
    const newFlipped=[...flipped,card];
    setFlipped(newFlipped);
    if(newFlipped.length===2){
      setAttempts(a=>a+1);setLocked(true);
      if(newFlipped[0].pairId===newFlipped[1].pairId){
        setMatched(m=>[...m,newFlipped[0].pairId]);
        setFlipped([]);setLocked(false);
        if(matched.length+1>=PAIRS)setDone(true);
      }else setTimeout(()=>{setFlipped([]);setLocked(false);},1000);
    }
  };
  if(loadErr)return <GameError name="Memory Match" onRetry={()=>{setLoadErr(false);setPairs(null);}}/>;
  if(!pairs)return <GameLoad name="Memory Match" emoji="🧠" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Memory Match" emoji="🧠" score={PAIRS} max={PAIRS} child={child} xp={Math.max(20,60-attempts*3)} onDone={()=>onComplete({score:PAIRS,max:PAIRS,xp:Math.max(20,60-attempts*3)})}/>;
  return (<GameShell name="Memory Match" emoji="🧠" subject="English" score={matched.length} maxScore={PAIRS} round={matched.length+1} total={PAIRS} streak={0} onQuit={onQuit}>
    <p style={{textAlign:"center",fontSize:13,fontWeight:700,color:C.muted,marginBottom:12}}>Match each word to its meaning! Attempts: {attempts}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
      {pairs.map(card=>{
        const isFlipped=flipped.some(f=>f.id===card.id);const isMatched=matched.includes(card.pairId);
        return(<button key={card.id} onClick={()=>flip(card)} style={{height:64,borderRadius:12,fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:F,padding:"4px",border:`2px solid ${isMatched?"#22C55E":isFlipped?C.primary:C.border}`,background:isMatched?"#F0FDF4":isFlipped?C.pLight:C.surface,color:isMatched?C.green:isFlipped?C.primary:C.text,transition:"all 0.2s",textAlign:"center",lineHeight:1.3}}>
          {isFlipped||isMatched?card.text:"?"}
        </button>);
      })}
    </div>
  </GameShell>);
}

// ── 🦕 DINO DIG ──────────────────────────────────────────────────────────
function DinosaurGame({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [fossils,setFossils]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} questions about dinosaurs, fossils, evolution and prehistoric life for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Fun and exciting! Return ONLY valid JSON: {"questions":[{"q":"What type of dinosaur was T-Rex?","options":["A) Herbivore","B) Carnivore","C) Omnivore","D) Insectivore"],"correct":"B","dino":"🦖"}]}`,"Dino dig questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setFossils(f=>f+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Dino Dig" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Dino Dig" emoji="🦕" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Dino Dig" emoji="🦕" score={fossils} max={TOTAL} child={child} xp={fossils*10} onDone={()=>onComplete({score:fossils,max:TOTAL,xp:fossils*10})}/>;
  const q=qs[idx];const dinos=["🦕","🦖","🐉","🦴","🥚","🔬","🌋","⛏️"];
  return (<GameShell name="Dino Dig" emoji="🦕" subject="Science" score={fossils} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#78350F,#92400E)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:42,marginBottom:4}}>{q?.dino||dinos[idx%8]}</div>
      <p style={{fontSize:11,fontWeight:800,color:"#FDE68A"}}>🦴 {fossils} fossils found!</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🌴 JUNGLE EXPLORER ───────────────────────────────────────────────────
function JungleExplorer({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [disc,setDisc]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} jungle/rainforest science questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Living things, habitats, food chains, plants, animals. Return ONLY valid JSON: {"questions":[{"q":"What is the top level of a rainforest called?","options":["A) Forest floor","B) Understory","C) Canopy","D) Emergent layer"],"correct":"D","creature":"🦜"}]}`,"Jungle explorer questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setDisc(d=>d+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Jungle Explorer" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Jungle Explorer" emoji="🌴" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Jungle Explorer" emoji="🌴" score={disc} max={TOTAL} child={child} xp={disc*10} onDone={()=>onComplete({score:disc,max:TOTAL,xp:disc*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Jungle Explorer" emoji="🌴" subject="Science" score={disc} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#14532D,#166534)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:4}}>{q?.creature||"🌴"}</div>
      <p style={{fontSize:11,fontWeight:800,color:"#BBF7D0"}}>🔭 {disc} discoveries made!</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🌊 OCEAN ADVENTURE ───────────────────────────────────────────────────
function OceanGame({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [depth,setDepth]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} ocean and marine science questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Sea creatures, food chains, habitats, adaptation. Return ONLY valid JSON: {"questions":[{"q":"What do whales breathe through?","options":["A) Gills","B) Lungs","C) Skin","D) Fins"],"correct":"B","creature":"🐋"}]}`,"Ocean adventure questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setDepth(d=>d+50);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Ocean Adventure" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Ocean Adventure" emoji="🌊" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Ocean Adventure" emoji="🌊" score={depth/50} max={TOTAL} child={child} xp={depth/50*10} onDone={()=>onComplete({score:depth/50,max:TOTAL,xp:depth/50*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Ocean Adventure" emoji="🌊" subject="Science" score={depth/50} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(180deg,#BAE6FD,#0EA5E9,#0369A1)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:42}}>{q?.creature||"🌊"}</div>
      <p style={{fontSize:11,fontWeight:800,color:"#E0F2FE"}}>🤿 Depth: {depth}m</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🫧 BUBBLE BUSTER ─────────────────────────────────────────────────────
function BubbleBuster({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=9;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [popped,setPopped]=useState(0);const [bubbles,setBubbles]=useState([]);const [sel,setSel]=useState(null);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} materials science questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Properties of materials — sorting, identifying, explaining changes. Return ONLY valid JSON: {"questions":[{"q":"Which material is waterproof?","options":["A) Paper","B) Rubber","C) Cotton","D) Wood"],"correct":"B"}]}`,"Bubble buster questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else{setQs(d.questions);setBubbles(Array.from({length:TOTAL},(_,i)=>({id:i,x:10+Math.random()*80,y:20+Math.random()*60,size:40+Math.random()*20,popped:false})));}});}, []);
  const popBubble=(b)=>{if(sel||!qs)return;setSel(b.id);const q=qs[idx];if(!q)return;setBubbles(prev=>prev.map(bub=>bub.id===b.id?{...bub,popped:true}:bub));setPopped(p=>p+1);setTimeout(()=>{setSel(null);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},500);};
  if(loadErr)return <GameError name="Bubble Buster" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Bubble Buster" emoji="🫧" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Bubble Buster" emoji="🫧" score={popped} max={TOTAL} child={child} xp={popped*8} onDone={()=>onComplete({score:popped,max:TOTAL,xp:popped*8})}/>;
  const q=qs[idx];
  return (<GameShell name="Bubble Buster" emoji="🫧" subject="Science" score={popped} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:12}}>{q?.q}</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
      {q?.options?.map((opt,i)=>{
        const colors=["#60A5FA","#34D399","#F472B6","#FBBF24"];
        return(<button key={i} onClick={()=>{if(opt.charAt(0)===q.correct)setPopped(p=>p+1);setTimeout(()=>{if(idx+1>=TOTAL)setDone(true);else setIdx(n=>n+1);},700);}}
          style={{height:72,borderRadius:"50%",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:F,background:`radial-gradient(circle at 35% 35%, white, ${colors[i%4]})`,border:`3px solid ${colors[i%4]}`,color:"#1F2937",boxShadow:`0 4px 12px ${colors[i%4]}66`,transition:"all 0.15s",padding:"0 8px",textAlign:"center"}}>
          {opt.substring(3)}
        </button>);
      })}
    </div>
    <p style={{textAlign:"center",fontSize:12,color:C.muted,fontWeight:600}}>Pop the correct bubble!</p>
  </GameShell>);
}

// ── 🎨 COLOUR LAB ────────────────────────────────────────────────────────
function ColourScience({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [exp,setExp]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} light and colour science questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Light sources, shadows, reflection, refraction, spectrum. Return ONLY valid JSON: {"questions":[{"q":"What happens when red and blue light mix?","options":["A) Green","B) Purple","C) Orange","D) Yellow"],"correct":"B","colour":"#7C3AED"}]}`,"Colour lab questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setExp(e=>e+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Colour Lab" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Colour Lab" emoji="🎨" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Colour Lab" emoji="🎨" score={exp} max={TOTAL} child={child} xp={exp*10} onDone={()=>onComplete({score:exp,max:TOTAL,xp:exp*10})}/>;
  const q=qs[idx];const rainbow=["#EF4444","#F97316","#EAB308","#22C55E","#3B82F6","#8B5CF6","#EC4899"];
  return (<GameShell name="Colour Lab" emoji="🎨" subject="Science" score={exp} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{borderRadius:16,overflow:"hidden",marginBottom:12,height:60,display:"flex"}}>
      {rainbow.map((c,i)=><div key={i} style={{flex:1,background:c,opacity:0.7+0.3*((idx)%7===i?1:0.5)}}/>)}
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 👨‍🚀 ASTRONAUT TRAINING ────────────────────────────────────────────────
function AstronautGame({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [trained,setTrained]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} Earth and Space science questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Solar system, planets, day/night, gravity, space exploration. Return ONLY valid JSON: {"questions":[{"q":"How long does Earth take to orbit the Sun?","options":["A) 24 hours","B) 28 days","C) 365 days","D) 100 years"],"correct":"C","badge":"🌍"}]}`,"Astronaut training questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setTrained(t=>t+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Astronaut Training" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Astronaut Training" emoji="👨‍🚀" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Astronaut Training" emoji="👨‍🚀" score={trained} max={TOTAL} child={child} xp={trained*10} onDone={()=>onComplete({score:trained,max:TOTAL,xp:trained*10})}/>;
  const q=qs[idx];const pct=Math.round((trained/TOTAL)*100);
  return (<GameShell name="Astronaut Training" emoji="👨‍🚀" subject="Science" score={trained} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(180deg,#0F0F1A,#1E1B4B)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:4}}>{q?.badge||"👨‍🚀"}</div>
      <p style={{fontSize:11,fontWeight:800,color:"#93C5FD",marginBottom:6}}>ASTRONAUT READINESS</p>
      <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.1)",overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#3B82F6,#60A5FA)",borderRadius:4,transition:"width 0.4s"}}/></div>
      <p style={{fontSize:11,color:"#60A5FA",marginTop:4,fontWeight:700}}>{pct}% trained</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🏛️ PYRAMID BUILDER ───────────────────────────────────────────────────
function PyramidsGame({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [blocks,setBlocks]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} ancient civilisations history questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Egypt, Greece, Rome, Mesopotamia. Fun pyramid builder theme. Return ONLY valid JSON: {"questions":[{"q":"What were Egyptian rulers called?","options":["A) Kings","B) Emperors","C) Pharaohs","D) Sultans"],"correct":"C"}]}`,"Pyramid builder questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setBlocks(b=>b+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Pyramid Builder" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Pyramid Builder" emoji="🏛️" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Pyramid Builder" emoji="🏛️" score={blocks} max={TOTAL} child={child} xp={blocks*10} onDone={()=>onComplete({score:blocks,max:TOTAL,xp:blocks*10})}/>;
  const q=qs[idx];const pyr=Array.from({length:Math.min(blocks,5)},(_,i)=>4-i);
  return (<GameShell name="Pyramid Builder" emoji="🏛️" subject="History" score={blocks} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(180deg,#FEF3C7,#FDE68A)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center",minHeight:80}}>
      {pyr.map((w,i)=><div key={i} style={{height:16,borderRadius:4,background:"#D97706",margin:`0 auto ${4}px`,width:`${(i+1)/(5)*100}%`,opacity:0.7+0.3*(i/5)}}/>)}
      <p style={{fontSize:11,fontWeight:800,color:"#92400E"}}>{blocks===0?"Start building!":`${blocks} blocks placed!`}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🕵️ HISTORY INSPECTOR ─────────────────────────────────────────────────
function InspectorGame({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [cases,setCases]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} historical enquiry questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Chronology, sources, cause and effect. Detective/mystery theme. Return ONLY valid JSON: {"questions":[{"q":"A historian finds a newspaper from 1940. Is this a primary or secondary source?","options":["A) Primary source","B) Secondary source","C) Neither","D) Both"],"correct":"A","clue":"📰"}]}`,"History inspector questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setCases(c=>c+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="History Inspector" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="History Inspector" emoji="🕵️" tutor={child.tutor}/>;
  if(done)return <GameEnd name="History Inspector" emoji="🕵️" score={cases} max={TOTAL} child={child} xp={cases*10} onDone={()=>onComplete({score:cases,max:TOTAL,xp:cases*10})}/>;
  const q=qs[idx];
  return (<GameShell name="History Inspector" emoji="🕵️" subject="History" score={cases} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#1F2937,#374151)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:4}}>{q?.clue||"🕵️"}</div>
      <p style={{fontSize:11,fontWeight:800,color:"#D1D5DB"}}>📂 Cases solved: {cases}</p>
    </div>
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14,lineHeight:1.6}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🫣 HISTORY HIDE & SEEK ────────────────────────────────────────────────
function HideSeekHistory({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [found,setFound]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);const country=child.country||"UK";claude(`Generate ${TOTAL} significant historical figures questions for age ${child.age}, ${country} curriculum, Level ${level}. Famous people from ${country==="US"?"American":country==="CA"?"Canadian":"British"} history hiding — find them from clues! Return ONLY valid JSON: {"questions":[{"clue":"I led a movement for peace. I gave a famous speech with the words I have a dream. Who am I?","options":["A) Nelson Mandela","B) Martin Luther King Jr","C) Rosa Parks","D) Malcolm X"],"correct":"B","emoji":"✊"}]}`,"History hide and seek questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setFound(f=>f+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="History Hide & Seek" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="History Hide & Seek" emoji="🫣" tutor={child.tutor}/>;
  if(done)return <GameEnd name="History Hide & Seek" emoji="🫣" score={found} max={TOTAL} child={child} xp={found*10} onDone={()=>onComplete({score:found,max:TOTAL,xp:found*10})}/>;
  const q=qs[idx];
  return (<GameShell name="History Hide & Seek" emoji="🫣" subject="History" score={found} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#4F46E5,#7C3AED)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:4}}>{q?.emoji||"🫣"}</div>
      <p style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)",lineHeight:1.7,fontStyle:"italic"}}>"{q?.clue}"</p>
    </div>
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>Who is hiding in history?</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 📋 TENABLE CHALLENGE ─────────────────────────────────────────────────
function TenableGame({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=6;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [reveals,setReveals]=useState([]);const [timeLeft,setTimeLeft]=useState(30);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);const timerRef=useRef(null);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} Tenable-style history rounds for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Each: a category and 5 correct answers. Return ONLY valid JSON: {"questions":[{"category":"Name 5 Roman Emperors","answers":["Augustus","Nero","Caligula","Claudius","Hadrian"]}]}`,"Tenable history questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  useEffect(()=>{if(!qs||done)return;setTimeLeft(30);setReveals([]);clearInterval(timerRef.current);timerRef.current=setInterval(()=>setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);return 0;}return t-1;}),1000);return()=>clearInterval(timerRef.current);},[idx,qs]);
  const reveal=(i)=>{if(reveals.includes(i))return;setReveals(r=>{const nr=[...r,i];if(nr.length===qs[idx]?.answers?.length||timeLeft===0){clearInterval(timerRef.current);setScore(s=>s+nr.length);setTimeout(()=>{if(idx+1>=TOTAL)setDone(true);else{setIdx(n=>n+1);}},1500);}return nr;});};
  if(loadErr)return <GameError name="Tenable Challenge" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Tenable Challenge" emoji="📋" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Tenable Challenge" emoji="📋" score={Math.round(score/5)} max={TOTAL} child={child} xp={score*4} onDone={()=>onComplete({score:Math.round(score/5),max:TOTAL,xp:score*4})}/>;
  const q=qs[idx];
  return (<GameShell name="Tenable Challenge" emoji="📋" subject="History" score={score} maxScore={TOTAL*5} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#1E3A5F,#1E40AF)",borderRadius:16,padding:12,marginBottom:12}}>
      <p style={{fontSize:13,fontWeight:800,color:"#BFDBFE",marginBottom:4}}>CATEGORY</p>
      <p style={{fontSize:16,fontWeight:900,color:"#fff",marginBottom:8}}>{q?.category}</p>
      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:11,color:"#BFDBFE",fontWeight:700}}>⏱️ {timeLeft}s</span><div style={{flex:1,height:6,borderRadius:3,background:"rgba(255,255,255,0.2)"}}><div style={{height:"100%",width:`${(timeLeft/30)*100}%`,background:timeLeft>10?"#22C55E":"#EF4444",borderRadius:3,transition:"width 1s"}}/></div></div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {q?.answers?.map((ans,i)=><button key={i} onClick={()=>reveal(i)} style={{padding:"10px 14px",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:F,textAlign:"left",border:`2px solid ${reveals.includes(i)?"#22C55E":C.border}`,background:reveals.includes(i)?C.gLight:C.surface,color:reveals.includes(i)?C.green:C.text,transition:"all 0.2s"}}>
        {reveals.includes(i)?`✅ ${ans}`:`${i+1}. ???`}
      </button>)}
    </div>
    <p style={{textAlign:"center",fontSize:12,color:C.muted,fontWeight:600,marginTop:8}}>Tap to reveal answers you know!</p>
  </GameShell>);
}

// ── ⚽ PENALTY SHOOTOUT ──────────────────────────────────────────────────
function FootballHistory({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [goals,setGoals]=useState(0);const [saves,setSaves]=useState(0);const [shot,setShot]=useState(null);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);const country=child.country||"UK";claude(`Generate ${TOTAL} ${country==="US"?"American":country==="CA"?"Canadian":"British"} history questions for age ${child.age}, ${country} curriculum, Level ${level}. Penalty shootout theme! Return ONLY valid JSON: {"questions":[{"q":"In what year did WW2 end?","options":["A) 1943","B) 1944","C) 1945","D) 1946"],"correct":"C"}]}`,"Football history questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);const ok=opt.charAt(0)===qs[idx]?.correct;setShot(ok?"goal":"saved");if(ok)setGoals(g=>g+1);else setSaves(s=>s+1);setTimeout(()=>{setShot(null);setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},1200);};
  if(loadErr)return <GameError name="Penalty Shootout" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Penalty Shootout" emoji="⚽" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Penalty Shootout" emoji="⚽" score={goals} max={TOTAL} child={child} xp={goals*10} onDone={()=>onComplete({score:goals,max:TOTAL,xp:goals*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Penalty Shootout" emoji="⚽" subject="History" score={goals} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(180deg,#14532D,#166534)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center",minHeight:80,position:"relative"}}>
      <div style={{fontSize:28}}>🥅</div>
      {shot&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)",borderRadius:16,fontSize:42}}>{shot==="goal"?"⚽ GOAL!":"🧤 SAVED!"}</div>}
      <div style={{display:"flex",justifyContent:"center",gap:4,marginTop:4}}>{Array.from({length:TOTAL}).map((_,i)=><span key={i} style={{fontSize:16}}>{i<goals?"⚽":i<idx&&i>=goals?"❌":"⬜"}</span>)}</div>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🌍 WORLD MAP QUEST ───────────────────────────────────────────────────
function WorldMapGame({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} world geography questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Countries, capitals, continents, oceans, physical features. Return ONLY valid JSON: {"questions":[{"q":"Which continent is Brazil in?","options":["A) Africa","B) Asia","C) South America","D) North America"],"correct":"C","flag":"🇧🇷"}]}`,"World map questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="World Map Quest" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="World Map Quest" emoji="🌍" tutor={child.tutor}/>;
  if(done)return <GameEnd name="World Map Quest" emoji="🌍" score={score} max={TOTAL} child={child} xp={score*10} onDone={()=>onComplete({score,max:TOTAL,xp:score*10})}/>;
  const q=qs[idx];
  return (<GameShell name="World Map Quest" emoji="🌍" subject="Geography" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#0C4A6E,#0369A1)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:42,marginBottom:4}}>{q?.flag||"🌍"}</div>
      <p style={{fontSize:11,fontWeight:800,color:"#BAE6FD"}}>🌐 {score} countries found!</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 📍 GEOGRAPHY GUESSER ─────────────────────────────────────────────────
function GeographyGuesser({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  const country=child.country||"UK";
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} geography identification questions for age ${child.age}, ${country} curriculum, Level ${level}. Give clues about a place and ask which place it is. Use landmarks, features, facts. GeoGuessr style. Return ONLY valid JSON: {"questions":[{"clues":["I have Big Ben","I am on the River Thames","I am the capital of England"],"q":"Which city am I?","options":["A) Manchester","B) London","C) Birmingham","D) Edinburgh"],"correct":"B","emoji":"🏰"}]}`,"Geography guesser questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Geography Guesser" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Geography Guesser" emoji="📍" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Geography Guesser" emoji="📍" score={score} max={TOTAL} child={child} xp={score*10} onDone={()=>onComplete({score,max:TOTAL,xp:score*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Geography Guesser" emoji="📍" subject="Geography" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",borderRadius:16,padding:14,marginBottom:12,border:"2px solid #86EFAC"}}>
      <p style={{fontSize:11,fontWeight:800,color:C.green,textTransform:"uppercase",marginBottom:8}}>🔍 CLUES</p>
      {q?.clues?.map((clue,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:16}}>{q?.emoji||"📍"}</span><p style={{fontSize:13,fontWeight:700,color:C.text}}>{clue}</p></div>)}
    </div>
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── ⛷️ SKI SLOPE RACE ────────────────────────────────────────────────────
function SkiingGeo({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [speed,setSpeed]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} physical geography questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Mountains, rivers, valleys, weather, climate, erosion. Ski slope theme! Return ONLY valid JSON: {"questions":[{"q":"What is the wearing away of rock by wind and water called?","options":["A) Deposition","B) Erosion","C) Weathering","D) Flooding"],"correct":"C"}]}`,"Ski slope geography questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);const ok=opt.charAt(0)===qs[idx]?.correct;if(ok)setSpeed(s=>s+10);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Ski Slope Race" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Ski Slope Race" emoji="⛷️" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Ski Slope Race" emoji="⛷️" score={speed/10} max={TOTAL} child={child} xp={speed} onDone={()=>onComplete({score:speed/10,max:TOTAL,xp:speed})}/>;
  const q=qs[idx];
  return (<GameShell name="Ski Slope Race" emoji="⛷️" subject="Geography" score={speed/10} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(180deg,#EFF6FF,#DBEAFE,#BFDBFE)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:36}}>⛷️</div>
      <p style={{fontSize:11,fontWeight:800,color:"#1D4ED8"}}>🏔️ SPEED: {speed} km/h</p>
      <div style={{height:8,borderRadius:4,background:"rgba(29,78,216,0.2)",marginTop:6}}><div style={{height:"100%",width:`${(speed/(TOTAL*10))*100}%`,background:"#3B82F6",borderRadius:4,transition:"width 0.4s"}}/></div>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🛹 SKATEPARK CITY ────────────────────────────────────────────────────
function SkateboardGeo({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [tricks,setTricks]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} human geography questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Settlements, land use, cities, economic activity, urban vs rural. Skateboard city theme. Return ONLY valid JSON: {"questions":[{"q":"What word describes the movement of people from the countryside to cities?","options":["A) Migration","B) Urbanisation","C) Globalisation","D) Industrialisation"],"correct":"B"}]}`,"Skatepark geography questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setTricks(t=>t+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Skatepark City" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Skatepark City" emoji="🛹" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Skatepark City" emoji="🛹" score={tricks} max={TOTAL} child={child} xp={tricks*10} onDone={()=>onComplete({score:tricks,max:TOTAL,xp:tricks*10})}/>;
  const q=qs[idx];const trickNames=["Ollie","Kickflip","Heelflip","Grind","Manual","360 Flip","Varial","Laser Flip"];
  return (<GameShell name="Skatepark City" emoji="🛹" subject="Geography" score={tricks} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#1F2937,#374151)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:32}}>🛹</div>
      <p style={{fontSize:12,fontWeight:800,color:"#FCD34D"}}>🤸 Tricks landed: {tricks}</p>
      {tricks>0&&<p style={{fontSize:11,color:"#9CA3AF"}}>{trickNames[tricks%8]}</p>}
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🏴‍☠️ PIRATE VOYAGE ─────────────────────────────────────────────────────
function PirateGeo({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [sailed,setSailed]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} map skills and navigation geography questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Compass points, grid references, OS map symbols, scale. Pirate voyage theme! Return ONLY valid JSON: {"questions":[{"q":"Which compass direction is opposite to North?","options":["A) East","B) West","C) South","D) Northeast"],"correct":"C","compass":"S"}]}`,"Pirate voyage map questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setSailed(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Pirate Voyage" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Pirate Voyage" emoji="🏴‍☠️" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Pirate Voyage" emoji="🏴‍☠️" score={sailed} max={TOTAL} child={child} xp={sailed*10} onDone={()=>onComplete({score:sailed,max:TOTAL,xp:sailed*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Pirate Voyage" emoji="🏴‍☠️" subject="Geography" score={sailed} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#1E3A5F,#0C4A6E)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:36}}>⛵</div>
      <p style={{fontSize:11,fontWeight:800,color:"#BAE6FD"}}>🗺️ Seas sailed: {sailed}/{TOTAL}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🚌 ECO BUS DRIVER ────────────────────────────────────────────────────
function BusGame({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [passengers,setPassengers]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} environmental geography questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Climate change, pollution, sustainability, renewable energy, deforestation. Eco bus theme. Return ONLY valid JSON: {"questions":[{"q":"Which type of energy comes from the sun?","options":["A) Wind energy","B) Tidal energy","C) Solar energy","D) Nuclear energy"],"correct":"C"}]}`,"Eco bus geography questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setPassengers(p=>p+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Eco Bus Driver" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Eco Bus Driver" emoji="🚌" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Eco Bus Driver" emoji="🚌" score={passengers} max={TOTAL} child={child} xp={passengers*10} onDone={()=>onComplete({score:passengers,max:TOTAL,xp:passengers*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Eco Bus Driver" emoji="🚌" subject="Geography" score={passengers} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",borderRadius:16,padding:14,marginBottom:12,border:"2px solid #86EFAC",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{fontSize:32}}>🚌</div>
      <div style={{textAlign:"center"}}>
        <p style={{fontSize:11,fontWeight:800,color:C.green}}>ECO PASSENGERS</p>
        <p style={{fontSize:22,fontWeight:900,color:C.green}}>{passengers}</p>
      </div>
      <div style={{fontSize:24}}>🌿</div>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🔐 CODE BREAKER ──────────────────────────────────────────────────────
function CodeGame({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [cracked,setCracked]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} data and computing questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Binary, data storage, file types, databases, encryption. Code breaker theme! Return ONLY valid JSON: {"questions":[{"q":"In binary, what does 1010 equal in decimal?","options":["A) 8","B) 10","C) 12","D) 14"],"correct":"B","code":"01001000"}]}`,"Code breaker computing questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setCracked(c=>c+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Code Breaker" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Code Breaker" emoji="🔐" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Code Breaker" emoji="🔐" score={cracked} max={TOTAL} child={child} xp={cracked*10} onDone={()=>onComplete({score:cracked,max:TOTAL,xp:cracked*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Code Breaker" emoji="🔐" subject="Computing" score={cracked} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#0F0F1A,#1E1B4B)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <p style={{fontFamily:"monospace",fontSize:16,color:"#22C55E",letterSpacing:4,marginBottom:4}}>{q?.code||"01010011"}</p>
      <p style={{fontSize:11,fontWeight:800,color:"#4ADE80"}}>🔐 Codes cracked: {cracked}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🍳 RECIPE ROBOT ──────────────────────────────────────────────────────
function FlippingFood({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [dishes,setDishes]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} computational thinking / algorithm questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Sequence, loop, condition, debug — using cooking recipes as the context. Return ONLY valid JSON: {"questions":[{"q":"A robot is making toast. The steps are out of order. What comes FIRST?","options":["A) Eat the toast","B) Put bread in toaster","C) Add butter","D) Wait for toast to pop"],"correct":"B","food":"🍞"}]}`,"Recipe robot questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setDishes(d=>d+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Recipe Robot" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Recipe Robot" emoji="🍳" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Recipe Robot" emoji="🍳" score={dishes} max={TOTAL} child={child} xp={dishes*10} onDone={()=>onComplete({score:dishes,max:TOTAL,xp:dishes*10})}/>;
  const q=qs[idx];const foodEmojis=["🍳","🥞","🍕","🥗","🍜","🥘","🫕"];
  return (<GameShell name="Recipe Robot" emoji="🍳" subject="Computing" score={dishes} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:42}}>{q?.food||foodEmojis[idx%7]}</div>
      <p style={{fontSize:11,fontWeight:800,color:"#92400E"}}>🤖 Dishes cooked: {dishes}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 💾 COMPUTER MEMORY ───────────────────────────────────────────────────
function MemoryComputer({child,mode,onComplete,onQuit,level=1}) {
  const PAIRS=6;const [pairs,setPairs]=useState(null);const [flipped,setFlipped]=useState([]);const [matched,setMatched]=useState([]);const [attempts,setAttempts]=useState(0);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);const [locked,setLocked]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${PAIRS} computing term-definition pairs for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Hardware, networks, internet, data terms. Return ONLY valid JSON: {"pairs":[{"term":"CPU","definition":"the brain of the computer"}]}`,"Computer memory game pairs.").then(d=>{clearTimeout(t);if(!d?.pairs)setLoadErr(true);else{const cards=[...d.pairs.map((p,i)=>({id:i,type:"term",text:p.term,pairId:i})),...d.pairs.map((p,i)=>({id:i+PAIRS,type:"definition",text:p.definition,pairId:i}))].sort(()=>Math.random()-0.5);setPairs(cards);}});}, []);
  const flip=(card)=>{if(locked||flipped.some(f=>f.id===card.id)||matched.includes(card.pairId))return;const nf=[...flipped,card];setFlipped(nf);if(nf.length===2){setAttempts(a=>a+1);setLocked(true);if(nf[0].pairId===nf[1].pairId){setMatched(m=>[...m,nf[0].pairId]);setFlipped([]);setLocked(false);if(matched.length+1>=PAIRS)setDone(true);}else setTimeout(()=>{setFlipped([]);setLocked(false);},1000);}};
  if(loadErr)return <GameError name="Computer Memory" onRetry={()=>{setLoadErr(false);setPairs(null);}}/>;
  if(!pairs)return <GameLoad name="Computer Memory" emoji="💾" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Computer Memory" emoji="💾" score={PAIRS} max={PAIRS} child={child} xp={Math.max(20,60-attempts*3)} onDone={()=>onComplete({score:PAIRS,max:PAIRS,xp:Math.max(20,60-attempts*3)})}/>;
  return (<GameShell name="Computer Memory" emoji="💾" subject="Computing" score={matched.length} maxScore={PAIRS} round={matched.length+1} total={PAIRS} streak={0} onQuit={onQuit}>
    <p style={{textAlign:"center",fontSize:13,fontWeight:700,color:C.muted,marginBottom:12}}>Match each term to its definition! Attempts: {attempts}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
      {pairs.map(card=>{const isFlipped=flipped.some(f=>f.id===card.id);const isMatched=matched.includes(card.pairId);return(<button key={card.id} onClick={()=>flip(card)} style={{height:64,borderRadius:12,fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:F,padding:"4px",border:`2px solid ${isMatched?"#22C55E":isFlipped?"#6366F1":C.border}`,background:isMatched?"#F0FDF4":isFlipped?"#EEF2FF":C.surface,color:isMatched?C.green:isFlipped?"#4F46E5":C.text,transition:"all 0.2s",textAlign:"center",lineHeight:1.3}}>
        {isFlipped||isMatched?card.text:"💾"}
      </button>);})}
    </div>
  </GameShell>);
}

// ── 📐 SHAPE SHOOTER ─────────────────────────────────────────────────────
function ShapeShooter({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} geometry questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. 2D shapes, 3D shapes, angles, symmetry, area, perimeter. Return ONLY valid JSON: {"questions":[{"q":"How many sides does a hexagon have?","options":["A) 5","B) 6","C) 7","D) 8"],"correct":"B","shape":"⬡"}]}`,"Shape shooter geometry questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Shape Shooter" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Shape Shooter" emoji="📐" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Shape Shooter" emoji="📐" score={score} max={TOTAL} child={child} xp={score*10} onDone={()=>onComplete({score,max:TOTAL,xp:score*10})}/>;
  const q=qs[idx];const shapes=["⬛","🔺","⬡","🔷","⭕","🔶","▪️","🔸"];
  return (<GameShell name="Shape Shooter" emoji="📐" subject="Maths" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#EEF2FF,#C7D2FE)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:4}}>{q?.shape||shapes[idx%8]}</div>
      <p style={{fontSize:11,fontWeight:800,color:"#4338CA"}}>🎯 Shapes hit: {score}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🧭 COORDINATE QUEST ──────────────────────────────────────────────────
function CoordinateQuest({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} coordinates and position questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Coordinates, translation, reflection, directions. Return ONLY valid JSON: {"questions":[{"q":"A point is at (3, 4). It moves 2 right and 1 up. Where is it now?","options":["A) (5, 5)","B) (5, 4)","C) (4, 5)","D) (1, 3)"],"correct":"A"}]}`,"Coordinate quest questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Coordinate Quest" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Coordinate Quest" emoji="🧭" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Coordinate Quest" emoji="🧭" score={score} max={TOTAL} child={child} xp={score*10} onDone={()=>onComplete({score,max:TOTAL,xp:score*10})}/>;
  const q=qs[idx];
  const gridSize=5;
  return (<GameShell name="Coordinate Quest" emoji="🧭" subject="Maths" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"#F8FAFC",borderRadius:16,padding:10,marginBottom:12,position:"relative"}}>
      <svg viewBox="0 0 200 160" style={{width:"100%",height:120}}>
        {[0,1,2,3,4,5].map(i=><>
          <line key={"h"+i} x1="20" y1={20+i*24} x2="180" y2={20+i*24} stroke="#E2E8F0" strokeWidth="1"/>
          <line key={"v"+i} x1={20+i*32} y1="20" x2={20+i*32} y2="140" stroke="#E2E8F0" strokeWidth="1"/>
          <text key={"xl"+i} x={18+i*32} y="155" fontSize="8" fill="#94A3B8" textAnchor="middle">{i}</text>
          <text key={"yl"+i} x="12" y={24+i*24} fontSize="8" fill="#94A3B8" textAnchor="middle">{5-i}</text>
        </>)}
        <line x1="20" y1="20" x2="20" y2="140" stroke="#475569" strokeWidth="2"/>
        <line x1="20" y1="140" x2="180" y2="140" stroke="#475569" strokeWidth="2"/>
        <circle cx="100" cy="80" r="5" fill="#6366F1"/>
      </svg>
    </div>
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── ⚖️ RATIO KITCHEN ─────────────────────────────────────────────────────
function RatioRecipe({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [dishes,setDishes]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} ratio and proportion questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Use cooking/recipe context. Return ONLY valid JSON: {"questions":[{"q":"A recipe for 4 people needs 200g of flour. How much for 8 people?","options":["A) 300g","B) 350g","C) 400g","D) 450g"],"correct":"C","recipe":"🎂"}]}`,"Ratio kitchen questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setDishes(d=>d+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Ratio Kitchen" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Ratio Kitchen" emoji="⚖️" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Ratio Kitchen" emoji="⚖️" score={dishes} max={TOTAL} child={child} xp={dishes*10} onDone={()=>onComplete({score:dishes,max:TOTAL,xp:dishes*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Ratio Kitchen" emoji="⚖️" subject="Maths" score={dishes} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center",border:"2px solid #F59E0B"}}>
      <div style={{fontSize:36}}>{q?.recipe||"🍳"}</div>
      <p style={{fontSize:11,fontWeight:800,color:"#92400E"}}>🍽️ Dishes mastered: {dishes}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🎤 POETRY SLAM ───────────────────────────────────────────────────────
function PoetrySlam({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} poetry questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Rhyme, rhythm, alliteration, simile, metaphor, personification. Show short poem extracts. Return ONLY valid JSON: {"questions":[{"poem":"The wind whispers through the trees,\nA gentle, whispering, rustling breeze.","q":"Which technique is used in this poem?","options":["A) Simile","B) Metaphor","C) Alliteration","D) Rhyme"],"correct":"C"}]}`,"Poetry slam questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},1000);};
  if(loadErr)return <GameError name="Poetry Slam" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Poetry Slam" emoji="🎤" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Poetry Slam" emoji="🎤" score={score} max={TOTAL} child={child} xp={score*10} onDone={()=>onComplete({score,max:TOTAL,xp:score*10})}/>;
  const q=qs[idx];const mics=["🎤","🎶","🎼","🎸","🥁","🎷","🎺"];
  return (<GameShell name="Poetry Slam" emoji="🎤" subject="English" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    {q?.poem&&<div style={{background:"linear-gradient(135deg,#4F46E5,#7C3AED)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <p style={{fontSize:14,fontWeight:600,color:"#fff",lineHeight:1.9,fontStyle:"italic",whiteSpace:"pre-line"}}>{q.poem}</p>
    </div>}
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 📱 MEDIA DETECTIVE ───────────────────────────────────────────────────
function MediaDetective({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} media literacy questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Fact vs opinion, purpose of media, adverts, bias, reliability. Return ONLY valid JSON: {"questions":[{"headline":"Scientists say chocolate is good for you!","q":"Is this fact or opinion?","options":["A) Definitely fact","B) Definitely opinion","C) Could be either — need more evidence","D) Both at the same time"],"correct":"C","source":"📰"}]}`,"Media detective questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Media Detective" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Media Detective" emoji="📱" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Media Detective" emoji="📱" score={score} max={TOTAL} child={child} xp={score*10} onDone={()=>onComplete({score,max:TOTAL,xp:score*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Media Detective" emoji="📱" subject="English" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    {q?.headline&&<div style={{background:"#F8FAFC",borderRadius:12,padding:"12px 14px",marginBottom:12,border:`2px solid ${C.border}`}}>
      <p style={{fontSize:11,fontWeight:800,color:C.muted,marginBottom:4}}>{q?.source||"📰"} BREAKING NEWS</p>
      <p style={{fontSize:15,fontWeight:900,color:C.text,lineHeight:1.5}}>"{q.headline}"</p>
    </div>}
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🌤️ SEASONS EXPLORER ─────────────────────────────────────────────────
function SeasonsGame({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} seasons and weather science questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Four seasons, weather, day length, Earth's tilt, climate. Return ONLY valid JSON: {"questions":[{"q":"In which season do leaves fall from trees?","options":["A) Spring","B) Summer","C) Autumn","D) Winter"],"correct":"C","season":"🍂"}]}`,"Seasons explorer questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Seasons Explorer" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Seasons Explorer" emoji="🌤️" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Seasons Explorer" emoji="🌤️" score={score} max={TOTAL} child={child} xp={score*8} onDone={()=>onComplete({score,max:TOTAL,xp:score*8})}/>;
  const q=qs[idx];const seasons=["🌸","☀️","🍂","❄️"];const bgColors=["#FEF3C7","#FEF9C3","#FEF3C7","#EFF6FF"];
  return (<GameShell name="Seasons Explorer" emoji="🌤️" subject="Science" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,"+bgColors[idx%4]+",#fff)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center",border:`2px solid ${C.border}`}}>
      <div style={{fontSize:42,marginBottom:4}}>{q?.season||seasons[idx%4]}</div>
      <div style={{display:"flex",justifyContent:"center",gap:8}}>{seasons.map((s,i)=><span key={i} style={{fontSize:20,opacity:i===idx%4?1:0.3}}>{s}</span>)}</div>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🎵 SOUND WAVES ───────────────────────────────────────────────────────
function SoundWaves({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [score,setScore]=useState(0);const [waveAnim,setWaveAnim]=useState(false);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} sound science questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Vibrations, pitch, volume, how sound travels, echoes. Return ONLY valid JSON: {"questions":[{"q":"What do all sounds have in common?","options":["A) They are all loud","B) They all travel in water","C) They are all caused by vibrations","D) They all travel at the same speed"],"correct":"C"}]}`,"Sound waves questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);setWaveAnim(true);setTimeout(()=>setWaveAnim(false),600);if(opt.charAt(0)===qs[idx]?.correct)setScore(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Sound Waves" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Sound Waves" emoji="🎵" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Sound Waves" emoji="🎵" score={score} max={TOTAL} child={child} xp={score*10} onDone={()=>onComplete({score,max:TOTAL,xp:score*10})}/>;
  const q=qs[idx];
  const waveY=28;
  return (<GameShell name="Sound Waves" emoji="🎵" subject="Science" score={score} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#1E1B4B,#312E81)",borderRadius:16,padding:12,marginBottom:12,overflow:"hidden"}}>
      <svg viewBox="0 0 300 60" style={{width:"100%",height:50}}>
        {[0,1,2,3].map(w=>(
          <path key={w} d={`M ${w*80} ${waveY} Q ${w*80+20} ${waveY-18} ${w*80+40} ${waveY} Q ${w*80+60} ${waveY+18} ${w*80+80} ${waveY}`} fill="none" stroke={["#818CF8","#60A5FA","#34D399","#FBBF24"][w]} strokeWidth="2.5" opacity={waveAnim?1:0.6}/>
        ))}
      </svg>
      <p style={{textAlign:"center",fontSize:11,fontWeight:800,color:"#C7D2FE"}}>🎵 Sound score: {score}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── ⚡ CIRCUIT BUILDER ───────────────────────────────────────────────────
function CircuitBuilder({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [built,setBuilt]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [lit,setLit]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} electricity and circuits science questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Safety, circuits, components, conductors, insulators. Return ONLY valid JSON: {"questions":[{"q":"Which material would complete a circuit?","options":["A) Plastic ruler","B) Wooden pencil","C) Metal spoon","D) Rubber eraser"],"correct":"C"}]}`,"Circuit builder questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);const ok=opt.charAt(0)===qs[idx]?.correct;if(ok){setBuilt(b=>b+1);setLit(true);setTimeout(()=>setLit(false),800);}setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Circuit Builder" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Circuit Builder" emoji="⚡" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Circuit Builder" emoji="⚡" score={built} max={TOTAL} child={child} xp={built*10} onDone={()=>onComplete({score:built,max:TOTAL,xp:built*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Circuit Builder" emoji="⚡" subject="Science" score={built} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"#1C1917",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <svg viewBox="0 0 200 80" style={{width:"100%",height:70}}>
        <rect x="20" y="30" width="30" height="20" rx="4" fill="#374151" stroke="#6B7280" strokeWidth="1.5"/>
        <text x="35" y="44" fontSize="8" fill="#FCD34D" textAnchor="middle">🔋</text>
        <line x1="50" y1="40" x2="80" y2="40" stroke={lit?"#FCD34D":"#4B5563"} strokeWidth="2"/>
        <circle cx="100" cy="40" r="10" fill={lit?"#FEF9C3":"#374151"} stroke={lit?"#FCD34D":"#6B7280"} strokeWidth="2"/>
        <text x="100" y="44" fontSize="10" textAnchor="middle">{lit?"💡":"○"}</text>
        <line x1="110" y1="40" x2="160" y2="40" stroke={lit?"#FCD34D":"#4B5563"} strokeWidth="2"/>
        <line x1="160" y1="40" x2="160" y2="20" stroke={lit?"#FCD34D":"#4B5563"} strokeWidth="2"/>
        <line x1="20" y1="40" x2="20" y2="20" stroke={lit?"#FCD34D":"#4B5563"} strokeWidth="2"/>
        <line x1="20" y1="20" x2="160" y2="20" stroke={lit?"#FCD34D":"#4B5563"} strokeWidth="2"/>
      </svg>
      <p style={{fontSize:11,fontWeight:800,color:"#9CA3AF"}}>⚡ Circuits built: {built}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🧫 CHEMISTRY LAB ─────────────────────────────────────────────────────
function ChemistryLab({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [exp,setExp]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} materials properties and changes science questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Reversible/irreversible changes, dissolving, filtering, burning, reactions. Return ONLY valid JSON: {"questions":[{"q":"When you burn wood, can you get the wood back?","options":["A) Yes, by cooling it","B) Yes, by adding water","C) No — burning is irreversible","D) Yes, by freezing it"],"correct":"C","reaction":"🔥"}]}`,"Chemistry lab questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setExp(e=>e+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Chemistry Lab" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Chemistry Lab" emoji="🧫" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Chemistry Lab" emoji="🧫" score={exp} max={TOTAL} child={child} xp={exp*10} onDone={()=>onComplete({score:exp,max:TOTAL,xp:exp*10})}/>;
  const q=qs[idx];const colours=["#A855F7","#06B6D4","#F59E0B","#EF4444","#22C55E","#EC4899","#6366F1"];
  return (<GameShell name="Chemistry Lab" emoji="🧫" subject="Science" score={exp} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"#F8FAFC",borderRadius:16,padding:12,marginBottom:12,display:"flex",gap:8,justifyContent:"center",alignItems:"flex-end"}}>
      {colours.slice(0,idx+1).map((c,i)=><div key={i} style={{width:20,borderRadius:"10px 10px 4px 4px",background:c,height:20+i*6,opacity:0.8}}/>)}
      <p style={{fontSize:24,marginLeft:8}}>{q?.reaction||"🧪"}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── ⏰ TIME MACHINE ───────────────────────────────────────────────────────
function TimeMachine({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [jumps,setJumps]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);const country=child.country||"UK";claude(`Generate ${TOTAL} history questions about significant events beyond living memory for age ${child.age}, ${country} curriculum, Level ${level}. Events from ${country==="US"?"American":country==="CA"?"Canadian":"British"} history and world history. Time machine theme! Return ONLY valid JSON: {"questions":[{"q":"In what year did the Great Fire of London happen?","options":["A) 1566","B) 1666","C) 1766","D) 1866"],"correct":"B","year":"1666","event":"🔥"}]}`,"Time machine history questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setJumps(j=>j+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Time Machine" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Time Machine" emoji="⏰" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Time Machine" emoji="⏰" score={jumps} max={TOTAL} child={child} xp={jumps*10} onDone={()=>onComplete({score:jumps,max:TOTAL,xp:jumps*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Time Machine" emoji="⏰" subject="History" score={jumps} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#1E1B4B,#4F46E5)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:4}}>{q?.event||"⏰"}</div>
      <div style={{fontSize:24,fontWeight:900,color:"#FCD34D",marginBottom:4}}>{q?.year||"????"}</div>
      <p style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.7)"}}>⚡ Time jumps: {jumps}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🏘️ LOCAL HERO QUEST ──────────────────────────────────────────────────
function LocalHero({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [heroes,setHeroes]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);const country=child.country||"UK";claude(`Generate ${TOTAL} local and community history questions for age ${child.age}, ${country} curriculum, Level ${level}. How places change over time, old photos, buildings, local records. Return ONLY valid JSON: {"questions":[{"q":"Which type of source would best show how a town looked 100 years ago?","options":["A) A modern map","B) An old photograph","C) A new newspaper","D) A website"],"correct":"B","source":"📸"}]}`,"Local hero history questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setHeroes(h=>h+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Local Hero Quest" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Local Hero Quest" emoji="🏘️" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Local Hero Quest" emoji="🏘️" score={heroes} max={TOTAL} child={child} xp={heroes*10} onDone={()=>onComplete({score:heroes,max:TOTAL,xp:heroes*10})}/>;
  const q=qs[idx];const eras=["🏚️","🏘️","🏠","🏗️","🏙️","🌆","🌇"];
  return (<GameShell name="Local Hero Quest" emoji="🏘️" subject="History" score={heroes} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center",border:"2px solid #86EFAC"}}>
      <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:6}}>{eras.map((e,i)=><span key={i} style={{fontSize:18,opacity:i<=idx?1:0.3}}>{e}</span>)}</div>
      <p style={{fontSize:11,fontWeight:800,color:C.green}}>{q?.source||"🏘️"} Exploring local history</p>
    </div>
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🛡️ SAFETY SHIELD ─────────────────────────────────────────────────────
function SafetyShield({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=8;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [shields,setShields]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} e-safety and digital citizenship questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Personal info, cyberbullying, passwords, privacy, screen time. Age appropriate! Return ONLY valid JSON: {"questions":[{"q":"Someone online asks for your home address. What should you do?","options":["A) Share it — they seem friendly","B) Never share it — tell a trusted adult","C) Share just the street name","D) Block them then share it"],"correct":"B","shield":"🛡️"}]}`,"Safety shield e-safety questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setShields(s=>s+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Safety Shield" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Safety Shield" emoji="🛡️" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Safety Shield" emoji="🛡️" score={shields} max={TOTAL} child={child} xp={shields*10} onDone={()=>onComplete({score:shields,max:TOTAL,xp:shields*10})}/>;
  const q=qs[idx];
  return (<GameShell name="Safety Shield" emoji="🛡️" subject="Computing" score={shields} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#1E3A5F,#1E40AF)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center"}}>
      <div style={{fontSize:36}}>{q?.shield||"🛡️"}</div>
      <p style={{fontSize:11,fontWeight:800,color:"#BFDBFE"}}>🔒 Shields earned: {shields}/{TOTAL}</p>
      <div style={{display:"flex",justifyContent:"center",gap:4,marginTop:6}}>{Array.from({length:TOTAL}).map((_,i)=><span key={i} style={{fontSize:14,opacity:i<shields?1:0.2}}>🛡️</span>)}</div>
    </div>
    <p style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

// ── 🎨 CREATIVE STUDIO ───────────────────────────────────────────────────
function CreativeStudio({child,mode,onComplete,onQuit,level=1}) {
  const TOTAL=7;const [qs,setQs]=useState(null);const [idx,setIdx]=useState(0);const [projects,setProjects]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [done,setDone]=useState(false);const [loadErr,setLoadErr]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoadErr(true),12000);claude(`Generate ${TOTAL} creative computing and digital literacy questions for age ${child.age}, ${child.country||"UK"} curriculum, Level ${level}. Creating digital content, animation, audio, multimedia, impact of technology. Return ONLY valid JSON: {"questions":[{"q":"What is a pixel?","options":["A) A type of computer","B) The smallest dot of colour on a screen","C) A kind of camera","D) A computer program"],"correct":"B","tool":"🖥️"}]}`,"Creative studio questions.").then(d=>{clearTimeout(t);if(!d?.questions)setLoadErr(true);else setQs(d.questions);});}, []);
  const answer=(opt)=>{if(ans)return;setSel(opt);setAns(true);if(opt.charAt(0)===qs[idx]?.correct)setProjects(p=>p+1);setTimeout(()=>{setSel(null);setAns(false);if(idx+1>=TOTAL)setDone(true);else setIdx(i=>i+1);},900);};
  if(loadErr)return <GameError name="Creative Studio" onRetry={()=>{setLoadErr(false);setQs(null);}}/>;
  if(!qs)return <GameLoad name="Creative Studio" emoji="🎨" tutor={child.tutor}/>;
  if(done)return <GameEnd name="Creative Studio" emoji="🎨" score={projects} max={TOTAL} child={child} xp={projects*10} onDone={()=>onComplete({score:projects,max:TOTAL,xp:projects*10})}/>;
  const q=qs[idx];const tools=["🖌️","🎬","🎵","📸","🖥️","✏️","🎮"];
  return (<GameShell name="Creative Studio" emoji="🎨" subject="Computing" score={projects} maxScore={TOTAL} round={idx+1} total={TOTAL} streak={0} onQuit={onQuit}>
    <div style={{background:"linear-gradient(135deg,#FDF4FF,#FAE8FF)",borderRadius:16,padding:14,marginBottom:12,textAlign:"center",border:"2px solid #E879F9"}}>
      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:6}}>{tools.map((t,i)=><span key={i} style={{fontSize:20,opacity:i<=idx?1:0.2}}>{t}</span>)}</div>
      <p style={{fontSize:11,fontWeight:800,color:"#A21CAF"}}>{q?.tool||"🎨"} Projects completed: {projects}</p>
    </div>
    <p style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:14}}>{q?.q}</p>
    <Options options={q?.options} correct={q?.correct} selected={sel} answered={ans} onAnswer={answer}/>
  </GameShell>);
}

function GameHub({child,onPlay,onBack,onHome}) {
  const played = child.gamesPlayed||0;
  const availableGames = getGamesForChild(child);
  const country = child.country||"UK";
  const subjectList = getSubjects(country);

  // Group games by subject category
  const categories = [
    {label:"Maths", subjects:["Maths","Math","Mathematics"], emoji:"🔢", color:C.primary},
    {label:"English", subjects:["English","English Language Arts","Language"], emoji:"📖", color:C.sky},
    {label:"Science", subjects:["Science","Science & Technology"], emoji:"🔬", color:C.green},
    {label:"History & Geography", subjects:["History","Geography","Social Studies"], emoji:"🌍", color:C.amber},
    {label:"Computing", subjects:["Computing","Computer Studies"], emoji:"💻", color:C.violet},
  ];

  return (
    <Screen>
      <div style={{paddingTop:16}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <BackBtn onClick={onHome||onBack}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <TutorChar name={child.tutor} size={48}/>
          <div>
            <h2 style={{fontSize:24,fontWeight:900,color:C.text}}>Mini Games 🎮</h2>
            <p style={{fontSize:13,fontWeight:700,color:C.muted}}>{played} played · {availableGames.length} available for you</p>
          </div>
        </div>
        {categories.map(cat=>{
          const catGames=availableGames.filter(g=>g.subjects.some(s=>cat.subjects.includes(s)));
          if(!catGames.length) return null;
          return (
            <div key={cat.label} style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{fontSize:18}}>{cat.emoji}</span>
                <p style={{fontSize:13,fontWeight:800,color:cat.color,textTransform:"uppercase",letterSpacing:"0.08em"}}>{cat.label}</p>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {catGames.map(g=>{
                  const gameLevel=getGameLevel(child,g);
                  const diff=getDifficultyLabel(gameLevel);
                  const levelHint=g.levelDesc?.[Math.min(Math.floor((gameLevel-1)/4),4)]||g.desc;
                  return (
                    <Card key={g.id} onClick={()=>onPlay(g.id)} style={{padding:"14px 16px",border:`2px solid ${C.border}`,cursor:"pointer"}}>
                      <div style={{display:"flex",alignItems:"center",gap:14}}>
                        <div style={{width:52,height:52,borderRadius:14,background:cat.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{g.emoji}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                            <p style={{fontSize:16,fontWeight:800,color:C.text}}>{g.name}</p>
                            <span style={{fontSize:10,fontWeight:800,color:diff.color,background:diff.color+"15",padding:"2px 6px",borderRadius:6}}>{diff.emoji} Lv.{gameLevel}</span>
                          </div>
                          <p style={{fontSize:12,fontWeight:600,color:C.muted}}>{levelHint}</p>
                        </div>
                        <span style={{fontSize:20,color:C.border}}>›</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}

function GamePlayer({child,gameId,mode,onComplete,onQuit}) {
  const game = GAMES.find(g=>g.id===gameId);
  const gameLevel = game ? getGameLevel(child,game) : 1;
  const props={child,mode,onComplete,onQuit,level:gameLevel};
  const map={numberBlaster:<NumberBlaster {...props}/>,timesTableRace:<TimesTableRace {...props}/>,fractionChef:<FractionChef {...props}/>,wordScramble:<WordScramble {...props}/>,spellingBee:<SpellingBee {...props}/>,sentenceBuilder:<SentenceBuilder {...props}/>,scienceSort:<ScienceSort {...props}/>,statesOfMatter:<StatesOfMatter {...props}/>,planetPatrol:<PlanetPatrol {...props}/>,algorithmSort:<AlgorithmSort {...props}/>,debugDetective:<DebugDetective {...props}/>,wordMatch:<WordMatch {...props}/>,mathFishing:<MathFishing {...props}/>,spaceBlaster:<SpaceBlaster {...props}/>,gemHunter:<GemHunter {...props}/>,wordRunner:<WordRunner {...props}/>,volcanoEscape:<VolcanoEscape {...props}/>,treasureMap:<TreasureMap {...props}/>,grandPrix:<GrandPrix {...props}/>,candyShop:<CandyShop {...props}/>,basketballMaths:<BasketballMaths {...props}/>,trainGame:<TrainGame {...props}/>,supermarketMath:<SupermarketMath {...props}/>,rocketMaths:<RocketMaths {...props}/>,spellBingo:<SpellBingo {...props}/>,wordShake:<WordShake {...props}/>,spotDifference:<SpotDifference {...props}/>,puzzleWords:<PuzzleWords {...props}/>,schoolRun:<SchoolRun {...props}/>,memoryWords:<MemoryWords {...props}/>,dinosaurGame:<DinosaurGame {...props}/>,jungleExplorer:<JungleExplorer {...props}/>,oceanGame:<OceanGame {...props}/>,bubbleBuster:<BubbleBuster {...props}/>,colourScience:<ColourScience {...props}/>,astronautGame:<AstronautGame {...props}/>,pyramidsGame:<PyramidsGame {...props}/>,inspectorGame:<InspectorGame {...props}/>,hideSeekHistory:<HideSeekHistory {...props}/>,tenableGame:<TenableGame {...props}/>,footballHistory:<FootballHistory {...props}/>,worldMapGame:<WorldMapGame {...props}/>,geographyGuesser:<GeographyGuesser {...props}/>,skiingGeo:<SkiingGeo {...props}/>,skateboardGeo:<SkateboardGeo {...props}/>,pirateGeo:<PirateGeo {...props}/>,busGame:<BusGame {...props}/>,codeGame:<CodeGame {...props}/>,flippingFood:<FlippingFood {...props}/>,memoryComputer:<MemoryComputer {...props}/>,shapeShooter:<ShapeShooter {...props}/>,coordinateQuest:<CoordinateQuest {...props}/>,ratioRecipe:<RatioRecipe {...props}/>,poetrySlam:<PoetrySlam {...props}/>,mediaDetective:<MediaDetective {...props}/>,seasonsGame:<SeasonsGame {...props}/>,soundWaves:<SoundWaves {...props}/>,circuitBuilder:<CircuitBuilder {...props}/>,chemistryLab:<ChemistryLab {...props}/>,timeMachine:<TimeMachine {...props}/>,localHero:<LocalHero {...props}/>,safetyShield:<SafetyShield {...props}/>,creativeStudio:<CreativeStudio {...props}/>,timelineSort:<AlgorithmSort {...props}/>,historyMatch:<ScienceSort {...props}/>,mapQuiz:<ScienceSort {...props}/>};
  return map[gameId]||<div style={{padding:40,textAlign:"center"}}><p>Game not found</p></div>;
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
function TopicPicker({child,subject,onStart,onBack}) {
  const sc = SUB[subject];
  const topics = CURRICULUM[subject] || [];
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
              <Card key={topic.id} onClick={()=>onStart(topicWithLevels)} style={{padding:"18px 18px",border:`2px solid ${sc.color}25`,background:`linear-gradient(135deg,${sc.light},white)`,cursor:"pointer"}}>
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
                  const qCount=(child.topicQCounts||{})[key]||0;
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
                      <PBar value={qPct} max={100} color={testResult==="pass"?C.green:qCount>=50?C.primary:sc.color} h={5}/>
                    </div>
                  );
                })()}
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
  SUBJECTS.forEach(subj=>{
    (CURRICULUM[subj]||[]).filter(t=>t.minAge<=child.age).forEach(topic=>{
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
              {SUBJECTS.map(s=>(
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
  const [err, setErr]         = useState("");
  const [email, setEmail]     = useState(parentEmail||"");

  const sessions = child.sessionHistory||[];
  const acc = child.total>0?Math.round(child.correct/child.total*100):0;
  const thisWeek = sessions.slice(-7);
  const weekAcc = thisWeek.length>0?Math.round(thisWeek.reduce((a,s)=>a+s.acc,0)/thisWeek.length):0;
  const tLevels = child.topicLevels||{};
  const strengths = SUBJECTS.map(s=>({s,lvl:child.level[s]||1})).sort((a,b)=>b.lvl-a.lvl).slice(0,3);
  const avgLevel = SUBJECTS.reduce((a,s)=>a+(child.level[s]||1),0)/SUBJECTS.length;

  const generateReport = async () => {
    if(!email) { setErr("Enter an email address"); return; }
    setLoading(true); setErr("");
    
    // Generate the report content using Claude
    const reportContent = await claude(
      `You are writing a weekly progress email report for a parent about their child using ADAPT learning platform.
Write a professional, warm email in HTML format.
Include:
- A warm greeting
- Summary of this week's activity
- What they're doing well (strengths)
- What could use more practice
- Specific encouragement
- A closing line
Format as clean HTML with inline styles. Use a clean professional design.
Colours: primary #4F46E5, green #16A34A, amber #D97706
Keep it concise — parents are busy. Max 400 words.`,
      `Child: ${child.name}, age ${child.age}, ${child.yearGroup}
Total questions answered: ${child.total}
Overall accuracy: ${acc}%
This week: ${thisWeek.length} sessions, ${weekAcc}% accuracy
Current streak: ${child.streak} days
XP earned: ${child.xp}
Badges: ${(child.badges||[]).length}
Best subjects: ${strengths.map(s=>s.s+" Lv."+s.lvl).join(", ")}
Average level: ${avgLevel.toFixed(1)}/5
Sessions this week: ${thisWeek.length}`
    );

    // Since we can't send email directly from client, show report to copy
    setLoading(false);
    setSent(true);
  };

  if(sent) return (
    <Screen>
      <div style={{paddingTop:20}}>
        <BackBtn onClick={onBack}/>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:48,marginBottom:12}}>📧</div>
          <h2 style={{fontSize:22,fontWeight:900,color:C.text,marginBottom:6}}>Progress Report Ready</h2>
          <p style={{fontSize:13,color:C.muted,fontWeight:600,lineHeight:1.6}}>
            Copy the report below and send it to yourself at <strong>{email}</strong>, or share it however you like.
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
            💡 Full automated email reports are coming soon! For now, screenshot or copy this summary to share {child.name}'s progress.
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
            ? `Before we start, I'll ask you ${SUBJECTS.length*2} quick questions to find your starting level. Take your time — there's no rush!`
            : `Before we start, let's do a quick warm-up! Just ${SUBJECTS.length*2} questions to find the best starting point for you.`}
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {[
            {e:"🎯",t:"Personalised for you",d:"Questions match your exact level"},
            {e:"😊",t:"No pressure",d:a11y.noTimers?"Take as long as you need":"Just try your best — there are no wrong answers"},
            {e:"⚡",t:"Quick warm-up",d:`Only ${SUBJECTS.length*2} questions, then you're in!`},
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

  const updChild=(id,u)=>{
    setKids(cs=>cs.map(c=>c.id===id?{...c,...u}:c));
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
  const trialExpired = account?.subscription==="trial" && account?.trialStart &&
    (Date.now() - account.trialStart) > 7 * 24 * 60 * 60 * 1000;
  const daysLeftInTrial = account?.trialStart ?
    Math.max(0, 7 - Math.floor((Date.now() - account.trialStart) / (24*60*60*1000))) : 7;

  const activeChild = active || children[0];

  // ── ROUTING ───────────────────────────────────────────────────────────
  return (
    <>
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
            go("child_handoff");
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
          updChild(activeChild.id,{level:nl,_diagDone:true,_diagDate:new Date().toISOString()});
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
        onComplete={(score,xp)=>{
          const gp=(activeChild.gamesPlayed||0)+1;
          const gb=score>0?(activeChild.gamesBeat||0)+1:(activeChild.gamesBeat||0);
          const updated={xp:activeChild.xp+xp,gamesPlayed:gp,gamesBeat:gb};
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
        onStart={topic=>{setTopic(topic);go("session");}}
        onSignOut={async()=>{await supabase.auth.signOut();setAcct(null);setKids([]);setAct(null);hist.current=["auth_login"];setScr("auth_login");}}
      />}

      {screen==="session"&&activeChild&&<Session
        child={activeChild}
        startSubject={sessSub}
        onComplete={stats=>{
          const session={acc:stats.total>0?Math.round(stats.correct/stats.total*100):0,date:new Date().toISOString(),xp:stats.xp};
          const lastSession=(activeChild.sessionHistory||[]).slice(-1)[0];
          const lastDate=lastSession?new Date(lastSession.date).toDateString():null;
          const today=new Date().toDateString();
          const isNewDay=lastDate!==today;
          const newStreak=isNewDay?activeChild.streak+1:activeChild.streak;
          const newXP = activeChild.xp + stats.xp;
          const milestones = [100,250,500,1000,2500,5000];
          const hitMilestone = milestones.find(m => activeChild.xp < m && newXP >= m);
          updChild(activeChild.id,{
            streak:newStreak,
            sessionHistory:[...(activeChild.sessionHistory||[]),session].slice(-30),
            _xpMilestone: hitMilestone||null
          });
          go("child_dash");
        }}
        onUpdate={u=>updChild(activeChild.id,u)}
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
    </>
  );
}
