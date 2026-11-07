# StudyNet marking server

A small Cloudflare Worker that marks practice-exam answers against their marking scheme. The site works without it: students can mark themselves, and locally the site uses Ollama.

It only marks answers. It never writes questions, and it builds the prompt itself from `../ai-core.js`. Callers can't send their own instructions to the model.

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
