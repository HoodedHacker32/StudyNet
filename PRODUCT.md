# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Junior Cycle students (1st and 2nd Year) in the owner's class and school, revising for in-school assessments such as the November and summer exams. They use it on phones and on laptops/Chromebooks about equally, in short sessions at home or between classes. Some students have an Irish exemption or a modern-language exemption, and each studies one of French, Spanish or German.

## Product Purpose
StudyNet turns the topics and notes teachers set for each assessment into quick revision activities: notes, flashcards, quizzes, matching, timelines, fill-in practice, IXL-style maths skills and practice exams marked against marking schemes. Success is a student opening it, getting straight back into their subjects, and practising exactly what is on the next test.

## Positioning
Like Studyclix, but free, with no accounts and no ads, and better in the ways that matter: content that follows what each class's teachers actually set, maths that is marked for meaning with method marks, and practice papers marked against marking schemes.
Content follows what the class's teachers actually set for each assessment (gathered from the class Teams channels), not a generic textbook syllabus.

## Operating Context
- Year mode decides which content appears. 1st Year mode shows 1st Year content. 2nd Year mode shows 1st and 2nd Year content, with 2nd Year by default. 3rd Year is not available yet.
- Profile: username, year, chosen modern language, exemption (none / Irish / language). All of it is stored in localStorage only. There are no accounts and no backend.
- A study streak counts a day only after the student answers something.
- Installable PWA that works offline.

## Capabilities and Constraints
- Static site: plain HTML/CSS/JS, no build step, no framework.
- Subject pages share `subject.js` and `app.css`; content lives in `data/<subject>.js`.
- 2nd Year subjects so far: Gaeilge, Français, History, Geography, Science, Maths. English, Deutsch and Español are planned. Choice subjects aren't offered, except Business, which is secret and unlocks with a cheat code in the student's name.
- AI is used only to mark written answers and maths working against a marking scheme (Ollama locally, a Cloudflare Worker in production). Questions never come from AI. Everything works without AI: students can mark themselves.
- Irish content must be checked against teanglann.ie / focloir.ie.

## Brand Commitments
- Name: StudyNet.
- Monochrome interface (light and dark) set in **Atkinson Hyperlegible Next**, chosen for legibility.
- Each subject has its own identity: a flag (languages) or drawn logo, and one signature colour used only on its logo, progress bars, active tab, selected pill and year switch. Gaeilge flag green, Geography leaf green, Français flag blue, History amber, Science blue, Maths red, English warm golden yellow.
- Icons are always inline SVG, never emoji or unicode symbols.
- Honest about AI: an About page says exactly who made StudyNet (a student's design, built with Claude Sonnet 4.6 and then Claude Opus 5.5), where content came from, and how AI marks.

## Evidence on Hand
- Assessment topics and class notes come from the class Teams channels (General posts, Classwork, Class Notebook).
- The site is public, so it must never contain real names (teachers, students) or personal data.

## Product Principles
1. Get students back into revision in one tap: subjects and progress come first.
2. Revise what is actually on the test: each subject states its assessment topics.
3. One consistent system: every subject page looks and behaves the same.
4. Honest progress: scores and streaks reflect real answers, never page visits. Marking is transparent: every mark shows the scheme point it came from.
5. Respect each student's setup: year, language and exemptions shape what they see.

## Accessibility & Inclusion
Keyboard support, visible focus, reduced motion, and dialogs that trap and restore focus. Text is never below 11px. Both themes must keep readable contrast.
