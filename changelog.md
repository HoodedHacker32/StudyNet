# StudyNet Changelog

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
