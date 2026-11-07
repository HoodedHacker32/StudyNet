# StudyNet

A public, static PWA of revision activities for Irish **Junior Cycle** students. There is no build step and no framework. All progress is stored in `localStorage`. The only server-side piece is the optional AI marking Worker in `worker/`. Product context is in `PRODUCT.md`.

## Scope
- **Years:**
  - **1st Year** mode shows 1st Year content.
  - **2nd Year** mode shows 1st and 2nd Year content, with 2nd Year by default and a year switch on each subject page.
  - **3rd Year** is greyed out as "Coming soon".
- **Subjects with content:**
  - Gaeilge, Français and History: 1st and 2nd Year.
  - Geography, Science and Maths: 2nd Year only.
  - English, Deutsch and Español are "Coming soon".
- **Where 2nd Year content comes from:**
  - Most subjects follow the November assessment topics and notes posted in each class's Teams (General posts, Classwork, Class Notebook).
  - Maths follows the class OneNote notes and the F2 class test.
- **Public site:** **never** put personal data or real names (students or teachers) in the code, placeholders or examples. That includes names printed on class tests and notes.

## Files
| File | Purpose |
|---|---|
| `about.html` | About StudyNet and exactly how AI was used to build it and is used to mark (keep it true when anything changes) |
| `index.html` | Dashboard: welcome (first run), Continue, the student's subjects, Quick Quiz (built from `data/*.js`), What's new dialog (`CHANGELOG_VER`) |
| `irish.html` `french.html` `history.html` `geography.html` `science.html` `maths.html` | Thin shells. They load `shared.js`, `subject.js`, `ai-core.js`, `ai.js`, `exam.js` (+ `maths.js` / `periodic.js`), then `calc.js` and `data/<id>.js` in the body, then call `SubjectApp.start(SN_DATA.<id>)` |
| `app.css` | The **only** stylesheet: tokens, shell, rows, controls, every activity, maths, periodic table, exams, calculator, dialogs, responsive, print |
| `shared.js` | Loaded in `<head>` on every page. Theme (applied before paint), icon sprite (`SN.ic`), subject registry (`SN.SUBJECTS`, `SN.mySubjects`), profile, streak, scores, accessible dialogs, app shell (`SN.mountShell`), Settings drawer (`SN.openSettings`, extended via `SN.settingsHooks`) |
| `subject.js` | Subject engine: Topics, then a topic's activities, then an activity with tabs. Built-in activities: Notes, Flashcards, Quiz, Match, Timeline, Practice. Extension points: `SubjectApp.addMode` (per-topic activity), `addView` (subject-level tool, hash `#v=<id>`), `addWidget` (notes `widget`). Notes sections also take `steps` (worked example) and `html`. The URL hash `#t=<topic>&m=<activity>` and `?y=<year>` record the view |
| `maths.js` | `window.MX`: maths display (`MX.m`), answer checking by algebraic equivalence (`MX.check`), the keypad answer box, 23 seeded skill generators (6 "Back to basics" 1st Year foundations + 17 from the class notes) with worked steps and method checkpoints (`cp`, read by `MX.method`), and the Skills activity (StudyNet mastery stages) |
| `exam.js` | Practice exams on every subject, laid out like a real paper (cover, instructions, marks grid; Question → parts (a) → sub-parts (i)). One topic per question, built from `examq` and topped up once per question with quiz/practice items. Marks objective answers; maths method marks from `MX.method` on a 0/low/high/full scale; AI or self-marking for written answers; results on the marked paper; history |
| `ai-core.js` | The marking prompt, JSON schema and reply checks. Shared by `ai.js` and `worker/` |
| `ai.js` | `window.SNAI`: always marks through the Worker (`SNAI.SERVER`). Students can't choose or turn off the marker; if it can't be reached, papers fall back to self-marking. Test locally against the live Worker (localhost is an allowed origin) |
| `calc.js` | Scientific calculator panel (StudyNet-branded). Loaded on demand by `SN.openCalc` from the Calculator button in the sidebar/top bar on Maths and Science (`calc: true` in `SN.SUBJECTS`); any `[data-calc]` button toggles it |
| `periodic.js`, `data/elements.js` | Interactive periodic table widget (`{ widget: 'periodic' }`), with Bohr diagrams for 1–20 |
| `data/<id>.js` | Content per year: `topics`, `notes`, `decks`, `quizzes`, `matches`, `timelines`, `practice`, `skills` (maths), `examq` (exam bank), plus `store`, `score` and `exam`. The subject object can set `marking: { spelling: 'lenient'\|'strict', note }` and `calculator: true` |
| `worker/` | Cloudflare Worker for AI marking: Groq first, then Workers AI. See `worker/README.md` |
| `sw.js` | Service worker. Bump `CACHE` whenever assets change. When any `?v=` asset changes, bump `?v=` in every page **and** in `SHELL` |
| `changelog.md` | Developer changelog. User-facing notes live in the What's new dialog in `index.html` |
| `.claude/launch.json` | Local server: `python -m http.server 5417` (port **5417**) |

## localStorage keys
- `sn_profile`: `{ name, lang: 'fr'|'es'|'de', yearMode: '1'|'2', exempt: 'none'|'irish'|'language', photo?, setupVer }`
- **Practice inputs** (`{ inputs: {...} }`):
  - 1st Year: `sn_irish_v1`, `sn_french_v1`, `sn_history_v1` (keys unchanged from the old pages).
  - 2nd Year: `sn_<id>_y2`.
- `sn_scores`: `{ <id>: {c,t,u?} }` for 1st Year and `{ <id>_y2: {c,t,u?} }` for 2nd Year. `u` is the unit when it isn't "correct" (Maths: "skills confident"). Subject pages write them and the dashboard only reads them.
- `sn_maths_mastery`: `{ <skill>: { r: last 20 results ('c' right, 'h' right after hint, 'm' wrong answer but right method, 'w' wrong), n, at } }`. Stages come from the last 10.
- **Exams:**
  - `sn_exams`: up to 60 finished papers `{ subject, year, at, n, got, of, pct, topics }`.
  - `sn_exam_cur_<id>_y<year>`: the paper in progress or last finished paper.
- `sn_last`: the last activity opened (drives "Continue where you left off").
- `sn_streak`: a day counts only when `SN.markStudied()` runs (on answering), never on page load.
- `sn_theme`, `sn_changelog_seen`. `sessionStorage.sn_view_<id>` remembers the year viewed on a subject page.

## Conventions
- **Design system:**
  - Monochrome UI, Atkinson Hyperlegible Next, light and dark tokens in `app.css`.
  - Each subject has a logo (`SN.logo`: a flag for languages, a drawn glyph otherwise) and one colour (`--sc`, set by `data-sc`). The colour is used only for its logo, progress bars, active tab, selected pill and year switch.
  - Colours: Gaeilge flag green, Geography leaf green, Français blue, History amber, Science blue, Maths red, English golden yellow.
  - Every page uses the same shell (sidebar on desktop, top bar under 900px), page header (`.ph`), rows (`.rows`/`.row`), buttons (`.btn`, `.btn.primary`), pills, tabs and dialogs.
  - Never add page-specific CSS; extend `app.css`.
  - Exam papers have their own tokens (`--paper`, `--desk`, `--rule`, `--grid`) and one marking colour, `--pen` (red), used only for marks on a marked paper.
  - Text is never smaller than `.75rem`. The only exception is the calculator's keypad legends, which scale with the panel.
- **Content goes in `data/*.js`**, never in the engine. Add a topic by listing its keys; the engine builds the "All topics" topic automatically.
- **Answer checking** (`norm`) ignores case, accents/fadas and punctuation, but keeps leading +/− signs, subscripts and × ÷.
  - Subjects with `marking.spelling: 'lenient'` also accept close spellings and sound-alikes. Words under 5 letters, numbers and symbols are never loosened; the first letter or sound must match; and another real term (any answer in the subject, or the `CONFUSABLE` list in `subject.js`, e.g. neuron/neutron) never counts.
  - Maths answers go through `MX.check`, never `norm`.
- **Exams and AI:**
  - Exams test, they don't teach: while a paper is being sat it shows only what a real paper would (no hints, example answers, placeholders or "Show me how"). Feedback appears only on the marked paper. Practice-only cues in data use `tip` instead of `h`, so they never reach a paper.
  - Exam questions come from the banks; AI never writes questions. AI only marks, against the question's scheme.
  - Give every written `examq` item a `scheme` (points with "(n marks)") and a `model` answer.
  - Maths `gen` items use a banded scale (0 / low partial ≈30% / high partial ≈70% / full). `MX.method` finds correct steps in the working without AI; AI may raise a mark up to high partial, never to full when the checker says the final answer is wrong.
  - Keep at least three bank questions per topic so papers read like tests, not quizzes.
  - Never reproduce copyrighted exam papers or textbook questions; write exam-style questions and link examinations.ie.
- **Irish content:**
  - Check words, spelling and grammar against teanglann.ie and focloir.ie (verb forms: teanglann's grammar database, `/en/gram/<verb>`).
  - Use *Is le…* for ownership and *Tá … ag* for having.
  - *Spás* is copyrighted: link to the online Turas 3 text, never copy it.
- **Maths content:**
  - Students may be rusty: every skill needs "Show me how" (walk through the current question) and shows a worked example before a student's first question. Keep "Back to basics" first.
  - `MX.method` never gives credit for working that only copies the question.
  - Notes follow the class methods (e.g. the a × c split for trinomials).
  - Every generator must pass its own check: run a self-test of all skills × 300 seeds after changing `maths.js`.
- **Icons:** always inline SVG via `SN.ic(name)` (sprite) or `SN.icon(name)` (inline). Never use unicode arrows, symbols or emoji as icons. Unicode arrows inside *content* are fine.
- **Accessibility:**
  - Clickable things are `<button>`s or links.
  - Dialogs use `SN.openDialog`/`SN.closeDialog`.
  - Keep keyboard support: tabs and the periodic table use arrow keys, flashcards use arrows and Space.
- **Mastery (maths):** StudyNet's own stages (Learning, Practising 6/10, Confident 8/10, Mastered 9/10 + last 5 right, review after 7 days). Don't copy other platforms' scoring systems or names.
- **Honesty:** `about.html` must stay accurate about who made what and how AI is used. No real names: the creator is "a Junior Cycle student".
- **Design work:** use the impeccable skill. Run design audits with a Sonnet subagent.
- Commit or push only when the user asks. Test on `http://localhost:5417` first.

## Known follow-ups
- The marking Worker is live at `https://studynet-ai.studynet.workers.dev` (account subdomain `studynet`, chosen to keep real names out of public code). Redeploy with `cd worker && npx wrangler deploy`. The Groq key is a Wrangler secret (`GROQ_API_KEY`), set by the owner, never committed.
- Add 3rd Year, and English, Deutsch and Español content. Maths needs more strands (number, geometry, statistics) as they're taught.
- Geography, Science and Maths have no 1st Year content yet; in 1st Year mode they appear as "Coming soon".
- The Quick Quiz uses each subject's default year only.
- Exam banks are exam-style questions written for StudyNet. Real SEC past-paper questions could be added (with `src`) if their reuse is allowed.
