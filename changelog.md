# StudyNet Changelog

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
