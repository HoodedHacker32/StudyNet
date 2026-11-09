# StudyNet marking server

A small Cloudflare Worker with two jobs:

- `POST /mark` marks practice-exam answers against their marking scheme.
- `POST /check` checks a student's own paragraph (French run-through). It returns the mistakes with a fix for each, the checklist items that are missing and one next step. It never rewrites the paragraph.

The site works without it: students can mark themselves, and the paragraph quick check runs in the browser.

It never writes questions, and it builds every prompt itself from `../ai-core.js`. Callers can't send their own instructions to the model. To try a prompt change without touching the live server, run `npx wrangler versions upload`, test against the preview URL it prints, then `npx wrangler deploy`.

## Providers

Both providers are free to start. The Worker tries them in this order:

1. **Groq**: `openai/gpt-oss-120b`, used for typed answers. You need a free account and an API key from console.groq.com.
2. **Cloudflare Workers AI**: used as the fallback, and for photos of working. It has a daily free allowance.

## Live

`https://studynet-ai.studynet.workers.dev` (check `/health`). `ALLOWED_ORIGINS` is set to the GitHub Pages site and localhost.

## Deploy

```bash
cd worker
npx wrangler login
npx wrangler secret put GROQ_API_KEY
npx wrangler deploy
```

Then:

1. Set `ALLOWED_ORIGINS` in `wrangler.toml` to the site's real address and deploy again.
2. Put the Worker's URL in `ai.js` as `SNAI.SERVER`.
3. Bump the `?v=` versions and `CACHE` in `sw.js`.

## Safety

- **Origins:** only `ALLOWED_ORIGINS` are accepted.
- **Rate limit:** 20 requests a minute per IP address (the `RL` binding).
- **Size limits:** answers over 4,000 characters are cut, and photos are capped at about 1.5 MB.
- **Model replies:** checked and clamped by `parseMark` before they reach the student.
- **Maths:** the site caps AI marks below full marks when its own checker says the final answer is wrong.
- **Privacy:** answers are sent to the provider for marking and not stored by the Worker. Tell students not to put personal details in answers. The site says this in Settings.
