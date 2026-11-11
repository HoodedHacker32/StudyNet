# StudyNet Changelog

## v2026-11-11-v5 (ag/ar table)
- Gaeilge Ag agus Ar: new Notes page with a table of mé, tú, sé… with English, and the ag / ar forms with their English, plus how each is used. Cache v55, assets ?v=45.

## v2026-11-11-v4 (practice: cleared answers)
- subject.js: clearing a practice box now deletes its saved answer, so an old wrong answer (and its 'Not quite') doesn't come back. Spás 'binse tosaigh' hint explains the changed form (checked against Turas 3 and teanglann: tosach, gs. tosaigh). Cache v54, assets ?v=44.

## v2026-11-11-v3 (learn your paragraphs)
- course.js: 'Learn it off by heart' in each paragraph workshop: read and listen, first letters, fill the gaps (three levels), from memory with a word-by-word check and best score on the run-through. Typed text is saved before leaving the workshop (it could be lost within 350 ms). Cache v53, assets ?v=43.

## v2026-11-11-v2 (Spás checked against the text)
- Checked every Spás question, card, match and note against the story in Turas 3. Fixed: 'an-chéile' (not in the story) → 'an-cheanúil ar a chéile'; 'saimhín' → 'sáimhín'; the marc-as-10 model no longer calls the story funny; a 'class focus' question reworded; a joke distractor replaced; the summary now says she is in her Leaving Cert year. Cache v52, assets ?v=42.

## v2026-11-11 (Gaeilge run-through)
- Gaeilge An Scrúdú: Run-through with checks for Spás, gramadach (aidiacht shealbhach, ag/ar), mé féin (aoiseanna, uimhreacha, poist) and ceistfhocail, and a workshop for the Spás question: (a) téama and (b) marc as 10.
- course.js: RULES.ga (séimhiú/urú after mo, do, ár, bhur; m'/d' before a vowel; feelings with ar; ag/ar + pronoun); overlapping quick-check hits shown once; labels follow the language.
- ai-core.js: per-language tips (LANG_TIPS), and fixes with m'/d'/l'/j' before a consonant are dropped. Cache v51, assets ?v=41.

## v2026-11-10-v6 (practice: saved wrong answers)
- subject.js: saved wrong answers kept the 'Not quite' line but lost the red 'err' style after a reload, so they looked accepted, and Check answers skipped unchanged answers. Saved wrong answers now render as wrong, and Check answers re-marks everything. Cache v50, assets ?v=40.

## v2026-11-10-v5 (paragraph checker fixes)
- Quick check: the right little word in the wrong form (au échecs → aux échecs, du guitare → de la guitare, de la vélo → du vélo).
- AI check: drops a 'fix' already in the paragraph, never turns French into English (indé), knows plural aux/des, and is told which checklist items are already covered so 'Next' suggests something missing. Cache v49, assets ?v=39.

## v2026-11-10-v4 (run-through fix)
- course.js: reopening the Run-through tab stacked click handlers, so two quizzes answered one click and the feedback named the wrong answer. Each opening now removes the previous handlers. Cache v48, assets ?v=38.

## v2026-11-10-v2 (English quotes checked)
- Poem quotes checked against the poem files in the English team's SharePoint (all matched; one comma fixed). The Early Purges now uses the teacher's quote sheet first. Added the class 20-mark poetry question plan and an exam question modelled on it. Cache v46, assets ?v=36.

## v2026-11-10 (English)
- New 2nd Year English (english.html, data/english.js) from the F2 English exam post: comprehension, the two Heaney poems (notes in own words with short key quotes for analysis; link to the publisher's page for Clearances III), descriptive writing with the class sentence patterns. 12 exam-bank questions. Cache v45, assets ?v=35.

## v2026-11-09-v2 (French exam run-through, clearer maths steps)
- New `course.js`: a Run-through activity on the Français L’examen topic, built from the November exam post in the class Team. Quick checks for reading/vocab and grammar (from the existing quizzes), and a writing workshop for Moi, Ma famille, Ma ville and Mes loisirs: the teacher's checklist ticks live, sentence starters, .txt or photo upload, instant rule-based checks with "Fix it", and an AI check.
- Worker: new `POST /check` (mistakes with fixes, checklist items missing, one next step; never rewrites). `parseCheck` keeps only mistakes that quote the paragraph, drops "this is correct" items and overlaps.
- Maths: clearer worked steps for HCF, factorising (HCF, grouping, trinomials, fully), solving by factorising, the −b formula, surds, roots, simultaneous equations (and word problems), long division and fractions. Self-test: 23 skills × 300 seeds, all answers pass their own check, no broken step text.
- about.html: says AI also checks French paragraphs, and never writes them. What's new updated (CHANGELOG_VER 2026-11-09-v1).
- Cache v44, assets ?v=34, course.js in SHELL.

## v2026-11-09 (fairer AI marking, clearer expanding brackets)
- AI marking: marks per scheme point with part marks; the total is the sum of the points, so marks and feedback agree. "/" means any one alternative; "Any two … (n marks each)" and "max N" are scored properly (`SNAIcore.pointMarks`, `tidyPoints`). Stronger prompt-injection wording. Worker needs redeploying.
- Short answers: the right answer with an aside in brackets counts ("H2O (water)"), unless the aside offers another answer.
- Papers skip a bank question that asks the same thing as one already on the paper.
- Maths: "Expand two brackets" steps now say which terms are multiplied, instead of "outside and inside".
- Cache v43, assets ?v=33.

## November 2026 — v2026-11-08-v9 (sensible wrong answers in tick-box questions)
- When a quiz question has no hand-written wrong options, `quizOptions` (Quiz activity and exam top-ups) now borrows wrong answers of the same kind as the right one: years with years, people with people, single words with single words, phrases with phrases, actions with actions, of similar length. It borrows from the year's other quizzes when one quiz is too small. Before, it picked at random, so a date could be offered for a conquistador. Tested on 4,680 generated options: no date/number options mixed with text answers.

## November 2026 — v2026-11-08-v8 (bigger practice exam banks)
- About 150 new exam-bank questions across every subject, modelled on the question types that come up again and again in the 2024 and 2025 Junior Cycle papers (studied on examinations.ie), written in StudyNet's own words and scenarios. Every content topic now has at least three bank questions, including 1st Year History, Gaeilge and Français, which had none. Recurring patterns now covered include earthquake labelling, epicentre and responses; weather-chart reading; six-figure grid references; cause vs consequence and a named reformer's beliefs and actions; the Plantation's undertakers and its impact; investigation skills (variables, hypothesis, repeats) and the breathing system in Science; grouping, long division, simultaneous equations and quadratic word problems in Maths; refunds when you change your mind, misleading advertising, social and cultural enterprises in Business; verb forms and reading comprehension in Gaeilge; profile and passé composé writing tasks in Français.
- The dashboard only loads the secret Business data once it is unlocked.

## November 2026 — v2026-11-08-v7 (secret Business subject)
- **Business (2nd Year)**, hidden: it only appears when the profile name contains `$$` (or `€€`). The first time, an unlock animation plays: the violet briefcase drops in, its lid hinges open, light and coins burst out, then "Business unlocked" with Open Business / Not now (reduced motion lands on the final frame). The Business row in the subject lists shines once.
- Content from the Business team's notes: Ch 12 Protecting the Consumer, Ch 13 Ethical & Sustainable Consumption, Ch 15 Entrepreneurs, Ch 16 Types of Enterprise (the November assessment) and Ch 17 Impact of Organisations, with notes, flashcards, quizzes, matching, fill-in practice and an 18-question exam bank with marking schemes. Written in StudyNet's own words; textbook case studies aren't copied.
- New icons: briefcase, shield, leaf, store.

## November 2026 — v2026-11-08-v6 (Maths: walk through the question you got wrong)
- A wrong answer in a Maths skill now shows your answer next to the right one, then walks through **that same question** one step at a time ("Let's go through your question", with the question at the top), instead of showing every step at once under "Learn from this example".

## November 2026 — v2026-11-08-v5 (calculator test suite)
- `tools/calc-test.js` (run with `node tools/calc-test.js`): 234 checks that press real keys on a fresh calculator and compare the result with the fx-85GT X's behaviour (checked against its manual): arithmetic and order of operations, minus signs everywhere, implied multiplication, powers and roots, fractions, S⇔D and recurring decimals, trig in degrees and radians, logs, factorials, nPr/nCr, percent, Ans, memory and every variable, Abs, ENG, range limits, syntax errors, multi-statements, Pol/Rec, DMS, Line I/O, Statistics, Table and Ratio.
- Fixed: results smaller than 1×10⁻⁹⁹ show 0 (the calculation range), not 1×10⁻¹⁰⁰; °′″ on a sexagesimal result converts to the decimal (2°30′0″ → 2.5), not a fraction.
- calc.js loads in Node again (for the tests).

## November 2026 — v2026-11-08-v4 (calculator fixes)
- The subtraction key now works as a minus sign where a number is expected, as on the real calculator: (−9)×(−1), −9×−1 and 2×−3 no longer give Syntax ERROR.
- ALPHA then cos inserts the variable E again (it showed and worked as ×10, because both used the same internal token; Line-mode ×10ⁿ now has its own).
- Indicators sit in their own row at the top of the LCD glass, above the dot matrix, and aren't shown on error screens.
- Solar panel and display window are smooth glass again (the case texture was being subtracted twice there, leaving a bumpy relief); the logo's "S" has its dark outline back.

## November 2026 — v2026-11-08-v3 (photo-real calculator)
- **Rendered like a product photo:** `tools/bake.py` now renders the body and keys itself (numpy + OpenCV) as a lit height field instead of styling HTML: rounded case edge, raised keys with rounded top edges sitting in dark gaps, domed round keys with fine radial lines, recessed display window and solar panel, a soft key light from the top left, ambient occlusion, soft cast shadows, a studio softbox reflection and sensor grain, rendered at 2x and scaled down. The browser only supplies the layout and the printed legends.
- **Cursor pad like the real one:** a sunken rounded-diamond well with four separate raised keys (curved up and down keys, wedge-shaped left and right keys) around a sunken hub. The pad keys come from the keys picture, move when pressed, and their hit areas follow the drawn keys.
- **Case texture:** the fine staggered moulded pattern of the real case (repeat about 1.1em x 0.3em, about 3.5% in brightness), measured from a close-up photo (`tools/panel-texture.npy`), replacing the plain gradient.
- Operator legends (×, ÷, +, −, =) are as large as the digits, like the real keypad.

## November 2026 — v2026-11-08-v2 (calculator screen font, baked look)
- **LCD font:** the screen uses "ClassWiz X Display" by Windy Deng (SIL Open Font License 1.1, `fonts/classwiz-x-display/`), embedded unmodified in `calc-lcd.js`, at 14px so each font pixel is one LCD pixel. `tools/lcdfont.py` builds three companion faces on the same grid: SN LCD Small (exponents, root indexes: the font's superscript digits on the baseline plus drawn brackets and signs), SN LCD Italic (variables x, y, e, π, θ from the font's maths italics) and SN LCD (StudyNet's own glyphs for the ~20 characters the font lacks). The derived faces keep the OFL and their own names.
- **Indicators** (S, A, M, STO, Math, D/R/G, FIX/SCI, ▲▼, multi-statement pause) are the font's own indicator glyphs, drawn smoothly in the top row like LCD segments instead of blurry text.
- **Screen rendering:** rendered at 4 × 4 per LCD pixel (exact blocks) and shown at screen size; the cursor has its own canvas that blinks with CSS, so nothing is re-rendered while the calculator is idle (it used to redraw every 530 ms).
- **Baked look:** the body and keys are two pictures (`calc/body.webp`, `calc/keys.webp`, about 160 KB together) rendered once by `tools/bake.py` (Playwright) from `tools/calc-bake.html` and its studio-only CSS: smooth matte charcoal plastic with a moulded step above the keys, lit key bevels (SVG lighting), round keys with fine radial "record" lines, and a four-key cursor pad in a dark surround. No noise filters, blend modes or Saira web font load at runtime; the HTML legends stay underneath for screen readers and as a fallback.

## November 2026 — v2026-11-08-v1 (exam builder options, calculator look)
- **Exam builder:** choose 1–10 questions, question size (short / standard / long), which question types appear, whether a calculator is allowed (Maths, Science), timer off / suggested / your own minutes, an optional hidden clock with 5- and 1-minute warnings, and question order (mixed / weakest first / notes order). A live summary shows questions, marks and time; options are remembered per subject; "Go to the first blank" when finishing with gaps. Older paper links still open.
- **Calculator:** looks like a real calculator, StudyNet-branded (globe-S logo, no Casio names or marks), modelled on a photo of the fx-85GT X: near-black rounded keys with a light edge, squared key digits, yellow DEL/AC, moulded grain with a cross-hatched keyboard area. The LCD is drawn at its real 192×63 resolution with every pixel on or off, so characters look like the manual's screens. On desktop it docks on the right; a paper with "calculator not allowed" hides it.
- **Marking:** always by StudyNet's marker; the AI-marking choice is removed from Settings.

## November 2026 — v2026-11-07-v3 (+ Back to basics)
- **Back to basics** (Maths): six 1st Year skills that 2nd Year algebra depends on (negative numbers, like terms, expanding one bracket, substitution, simple equations, two numbers that multiply and add), with notes. **Show me how** walks through the current question; a new skill opens with a worked example first. Method marks ignore working that only copies the question, and read the maths after labels like "HCF first:".

## (same release) (real papers, method marks, own mastery system, calculator everywhere, About page)
- **Practice exams look like real papers:** cover with instructions and a marks grid; one topic per question; parts (a), (b), (c) with sub-parts (i), (ii) and marks in the right margin. Ruled lines for written answers, squared boxes for maths working, an Answer line, and "Tick (✓) the correct box" for the few multiple-choice parts. The marked paper shows red-pen marks in the margin, ticks and crosses, the marks grid filled in, and examiner notes under each part. Quiz and practice items only top up a question (once each), and the question-type picker is gone.
- **Maths method marks:** each generator lists checkpoints; `MX.method` finds correct steps in the working (a correct bracket, a, b and c labelled, b² − 4ac, the equation rearranged to 0, one correct root, the LCM, a correct combined equation…). The mark scale is 0 / low partial / high partial / full. AI can add method marks but never full marks for a wrong final answer.
- **StudyNet mastery** replaces the IXL-style SmartScore: four stages from your last 10 answers (Learning → Practising → Confident → Mastered), half credit for right-after-a-hint or right-method-wrong-answer, and a review prompt a week after mastering. Skills has an optional working box.
- **Calculator on every page:** a Calculator button in the sidebar and top bar; `calc.js` loads the first time it's opened.
- **About and AI use page** (`about.html`): who made StudyNet, where the content came from, and exactly how AI is used.
- More Science exam-bank questions (8 new), so every topic has at least two.

## November 2026 — v2026-11-07-v2 (Maths, practice exams, AI marking, periodic table)
- **Maths (new page, 2nd Year):** notes from the class OneNote (four types of factorising, factorising fully, quadratic equations by factors and the −b formula, surds, forming a quadratic from its roots, simultaneous equations and problems in context, long division in algebra, equations with fractions), with step-by-step worked examples (`steps` in notes).
- **Skills activity (`maths.js`):** 17 IXL-style skills that generate a fresh question each time, with a points score (replaced in v3), hints and a worked solution after a wrong answer. Answers are checked for algebraic equivalence; factorising answers must be fully factorised; decimals are checked to the requested places; surd answers must be in surd form. 5,100 generated questions were self-checked.
- **Maths keypad and preview:** the answer box has keys for x, y, ², xⁿ, √, brackets, /, ± and =, plus a "Reads as" preview.
- **Calculator (`calc.js`):** a scientific calculator panel (fractions, surds, S⇔D) on Maths and Science, rebranded StudyNet.
- **Practice exams (`exam.js`) on every subject:** papers are built from each subject's exam bank (`examq`: class-test and exam-style questions with marking schemes) plus quiz and practice questions, by topic, question type and length, with an optional timer, autosave, print, and shareable paper codes. Results show marks, a percentage, the Junior Cycle descriptor and a per-topic breakdown, and history is stored in `sn_exams`. "Focus on my weakest topics" uses that history.
- **AI marking (`ai.js`, `ai-core.js`, `worker/`):** written answers and maths working are marked against the scheme, by Ollama on localhost or by a Cloudflare Worker (Groq, then Workers AI). The AI never writes questions. Spelling is lenient in Science, History, Geography and Maths, and strict in Gaeilge and Français; a different real term (e.g. "neuron" for "neutron") never counts. The maths checker caps AI marks below full when the final answer is wrong. Without AI, students tick the scheme points themselves.
- **Lenient spelling in short answers:** Science, History, Geography and Maths accept answers one or two letters off, or that sound the same, in practice and exams.
- **Science:** structure of the atom expanded (particles table, isotopes, models of the atom, electron shells, Bohr diagrams, ions), plus an interactive periodic table (`periodic.js`, `data/elements.js`) and electron-arrangement practice.
- **Colours:** Gaeilge is now the flag's green; Geography moved to a yellower leaf green so the two stay distinct.
- Score chips and the dashboard support a unit (Maths shows "skills at 80+").

## November 2026 — v2026-11-07-v1 (subject identity, font, Irish grammar)
- **Subject identity restored:** flags for Gaeilge, Français, Deutsch and Español; drawn logos for History (column), Geography (globe), Science (flask), Maths (pi) and English (quill), via `SN.logo`. Each subject has one colour (`--sc` / `data-sc`, light and dark variants) on its logo, progress bars, active tab, selected pill and year switch.
- **Font:** Inter replaced by Atkinson Hyperlegible Next.
- **Irish grammar:** every verb form checked against teanglann's grammar database. Fixed 1st Year réamhfhocail sentences that used *le* for possession, plus two present-tense sentences that didn't make sense and the tense of three *Spás* questions. Answers are unchanged.
- **Spás:** the notes link to the story online in *Turas 3*, page 72.

## November 2026 — v2026-11-06-v2 (2nd Year, one design system)

### 2nd Year content (November assessments)
- **Gaeilge:** *Spás* (summary, characters, theme, feelings, mark out of 10, story vocabulary and phrases), aidiacht shealbhach before consonants and vowels, *ag*/*ar* with feelings, mé féin agus mo theaghlach (ages, dates, personal numbers, jobs), léamhthuiscint technique. Vocabulary checked against teanglann.ie and focloir.ie.
- **Français:** jouer à / jouer de / faire de, music and instruments, town buildings with *il y a / il n'y a pas de / ni…ni*, *aller* + au / à la / à l' / aux, numbers 1–100, clothes, weather, hobbies, model writing paragraphs.
- **History:** the Reformation, the Plantation of Ulster and the American Revolution, covering every question on the class revision list, with three timelines.
- **Geography (new page):** Dynamic Earth, volcanic activity, earthquakes, fold mountains, glaciation (with cirque and esker explanations), weather, OS map grid references.
- **Science (new page):** food and digestion, elements/compounds/mixtures, solutions, separating mixtures, force (with formulas and calculations), the atom (first 20 elements table), the breathing system.
- New **Notes** activity and a per-subject "November exam" line.

### One design system
- `app.css` replaces `shared.css`, the dashboard's inline CSS and the per-page subject CSS.
- `subject.js` is a shared engine and `data/*.js` hold content. The five subject pages are thin shells. 1st Year storage keys are unchanged, so existing progress carries over.
- Shared app shell: the sidebar lists the student's own subjects with progress, streak, Settings and theme. The mobile top bar has Settings and theme. The old per-page sidebar buttons, mobile mode grid and pill strip are gone; navigation is now breadcrumb + activity tabs, and the browser Back button works.
- Settings is a drawer available on every page.
- Dashboard rebuilt: Continue where you left off, Your subjects (topics and progress), coming-soon and exemption notes, Quick Quiz built from the same data as the subject pages (no duplicated answer keys).
- Subject pages respect year mode, exemptions and chosen language, with notices.
- No text below 12px.

### Fixes
- Answer checking keeps +/− signs, subscripts and × ÷ distinct.
- Practice Reset needs a second click to confirm.

## November 2026 — v2026-11-06-v1 (audit fixes)

### Bugs
- **French / History quiz Retry** no longer crashes. Results render in their own block instead of replacing the question area.
- **French practice Reset** called a function that doesn't exist (`updateProgress`). It now calls `updateScore`.
- **History timeline** works on touch and keyboard: tap/Enter an event, then tap/Enter its year. Drag-and-drop still works.
- **Dashboard scores**: each subject page now saves its own score (`sn_scores` in localStorage) and the dashboard reads it. This removes the duplicated answer keys that had drifted (Irish showed /65 instead of /75). History progress now shows on the dashboard.
- **French verb endings**: the blank `-re` il/elle/on cell is no longer counted as a free point (practice total is now 53).
- **Quick Quiz** respects the Irish exemption and language, shuffles answer order, and restarts without a page reload.
- **Settings**: the Irish exemption can be edited, and name and school year can be cleared.
- **Quizzes shuffle** questions on French and History, using an unbiased Fisher–Yates shuffle everywhere.
- **Streak** only counts a day after a question is answered, and shows 0 once it has lapsed.
- Hard-coded "Active: 2 subjects" and "Exercises: 6" chips are now computed.
- "Profile" on subject pages opens Settings on the dashboard (`index.html#settings`).

### Content
- Irish: fixed `múinteoir` (contained Cyrillic letters), `deartháireacha`, `pictiúr`, `abairtí`. Removed misspellings that were accepted as correct (`Biann`, `Eiriann`, `mhothaoim`, `nduisiann`, `eiriann`).
- Irish quiz wrong options are now plausible (same pronoun with another preposition, wrong mutation or ending), so the hint no longer gives the answer away.
- History: removed a hint that gave away its answer. French: corrected the "Vocabulaire" topic description.

### Accessibility
- Settings, changelog, confirm and onboarding are proper dialogs: Esc closes them, focus is trapped and then restored.
- Irish topic cards, match tiles, timeline cards and slots are real buttons. Flashcards flip with Enter/Space and move with the arrow keys.
- Visible `:focus-visible` outlines and `prefers-reduced-motion` support (`shared.css`).
- The "Exempt" label uses a theme-aware colour that's readable in dark mode.
- The onboarding exemption checkbox and its label now sit on one line.
- French and Irish mobile headers have a home button. Irish mobile mode buttons and the topic label stay in sync.

### Theme / PWA / code
- The saved theme is applied in `<head>` (`shared.js`), so there's no light flash on load. The theme-color meta follows the theme.
- Service worker: pages are network-first (new deploys show immediately) with an offline fallback, Google Fonts are cached for offline use, and shared files are added to the precache.
- Corrupted localStorage no longer crashes any page. Photo upload handles unreadable files, and transparent PNGs get a white background.
- Shared theme, streak, score and dialog code moved to `shared.js`. Removed the unused `french-data.txt`.

## May 2025 — v2025-05-19-v1

### Icons
- **Fixed all activity icons** — flashcard, quiz, match, and practice icons now render correctly in both light and dark mode across all subject pages.
- Root cause: CSS stroke/fill rules did not cascade through SVG `<use>` shadow DOM. Fixed by adding `fill="none" stroke="currentColor" stroke-width="1.5"` as presentation attributes directly on each `<symbol>` element.
- Irish `icon-cards` replaced (was a monitor shape → now stacked-layers flashcard icon).
- Irish `icon-match` replaced (was near-invisible 1px dots → arrow-swap icon matching History).
- All sidebar mode button SVGs in Irish now use the `.icon` CSS class for consistent rendering.

### Dark Mode & Theming
- **French**: removed all hardcoded green/red feedback colours. Correct answers now use `var(--fg)/var(--bg)` inversion; wrong answers fade + strikethrough. Match tiles and practice inputs are now fully theme-aware.
- **History**: `@keyframes wrongFlash` updated — no longer flashes `#fdd` red in dark mode; uses `var(--hover)` and `var(--fg)` instead.
- **Irish**: quiz feedback (`.ok` / `.bad`), practice inputs (`.prac-inp.ok/.err`), and Aidiacht table inputs (`.aid-inp.ok/.err`) all updated to theme-aware variables.
- All subject pages now have a `.icon` CSS class matching the dashboard.
- All subject pages now have `color:var(--muted)` on `.sb-btn` (consistent with template).
- French `.hero h1` updated to use `clamp()` for responsive sizing.

### Quiz
- **Randomised questions** — French and History quizzes now shuffle question order on each load (Fisher-Yates). Irish was already shuffling.

### Streak Tracker
- Progress tracking sections replaced with a **7-day streak tracker** on all three subject pages (Irish, French, History), synced with the dashboard streak counter via the `sn_streak` localStorage key.

### Irish (Gaeilge)
- **Aidiacht Shealbhach flashcard backs simplified** — verbose English grammar explanations replaced with concise Irish-format rules (e.g. `+ consan → séimhiú: mo theach`). White-space: pre-line added so line breaks render correctly.

### Account & Settings
- **Clear all data** button added to Settings drawer — removes all localStorage data with a confirmation dialog.
- **Changelog popup** — shown on first visit after each update. Skipped if user has never set up an account (onboarding shows first).

### PWA / Meta
- French and Irish pages now include full PWA meta tags (manifest, icons, theme-color, apple-mobile-web-app).
