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
Generate samples by playing each subject's games/lessons with a test child set to
the target year group, or by calling the /api/chat endpoint with the same prompts.

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
