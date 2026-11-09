/* StudyNet marking server (Cloudflare Worker).
   POST /mark  { subject, year, question, marks, scheme[], model?, answer, working?, spelling, note?, image?, scale? }
   → { marks, outOf, feedback, points[] }
   POST /check { subject, year, title, checklist[], text | image } → { text?, issues[{wrong,right,why}], missing[], next, praise }
   (a student's own paragraph in a language subject: mistakes with fixes, never a rewrite)
   It only marks: it never writes questions and won't act as a general chatbot. The prompt is built here from
   the shared ai-core.js, so a caller can't send their own instructions to the model.
   Providers, in order: Groq (GROQ_API_KEY secret), then Workers AI (the AI binding). Photos go to a vision model. */
import '../../ai-core.js';

const core = globalThis.SNAIcore;

function cors(env, origin) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const ok = origin && (allowed.includes(origin) || allowed.includes('*'));
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0] || 'null',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}

async function viaGroq(env, messages) {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + env.GROQ_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: env.GROQ_MODEL || 'openai/gpt-oss-120b', messages, temperature: 0, max_completion_tokens: 900,
      response_format: { type: 'json_object' } })
  });
  if (!r.ok) throw new Error('groq ' + r.status);
  const j = await r.json();
  return j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
}
async function viaWorkersAI(env, messages, image, schema) {
  if (image) {
    // Vision: the photo goes alongside the text, as an image part.
    const msgs = [messages[0], { role: 'user', content: [{ type: 'text', text: messages[1].content }, { type: 'image_url', image_url: { url: image } }] }];
    const out = await env.AI.run(env.CF_VISION_MODEL || '@cf/meta/llama-4-scout-17b-16e-instruct', { messages: msgs, max_tokens: 900, temperature: 0 });
    return typeof out.response === 'string' ? out.response : JSON.stringify(out.response);
  }
  const out = await env.AI.run(env.CF_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
    messages, max_tokens: 900, temperature: 0, response_format: { type: 'json_schema', json_schema: schema || core.SCHEMA }
  });
  return typeof out.response === 'string' ? out.response : JSON.stringify(out.response);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const h = cors(env, origin);
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    if (url.pathname === '/health') return json({ ok: true, groq: !!env.GROQ_API_KEY, workersAI: !!env.AI }, 200, h);
    const isCheck = url.pathname === '/check';
    if ((url.pathname !== '/mark' && !isCheck) || request.method !== 'POST') return json({ error: 'Not found' }, 404, h);

    // Only the StudyNet site may use it.
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
    if (!allowed.includes('*') && !allowed.includes(origin)) return json({ error: 'This marking server only works from StudyNet.' }, 403, h);

    // Rate limit per IP (configure the RL binding in wrangler.toml).
    if (env.RL) {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { success } = await env.RL.limit({ key: ip });
      if (!success) return json({ error: 'Too many answers marked in a short time. Wait a minute and try again.' }, 429, h);
    }

    let req;
    try {
      const text = await request.text();
      if (text.length > 1600000) return json({ error: 'That answer is too big to mark.' }, 413, h);
      req = JSON.parse(text);
    } catch (e) { return json({ error: 'Bad request' }, 400, h); }
    const bad = isCheck ? core.validCheck(req) : core.validRequest(req);
    if (bad) return json({ error: bad }, 400, h);

    // /check: a student's own paragraph in a language subject, checked for mistakes against the teacher's checklist.
    if (isCheck) {
      const cm = core.buildCheckMessages(req), n = Math.min(12, (req.checklist || []).length);
      const ct = [];
      if (env.GROQ_API_KEY && !req.image) ct.push(() => viaGroq(env, cm));
      if (env.AI) ct.push(() => viaWorkersAI(env, cm, req.image, core.CHECK_SCHEMA));
      for (const t of ct) {
        try { return json(core.parseCheck(await t(), req.image ? '' : req.text, n), 200, h); }
        catch (e) { /* try the next provider */ }
      }
      return json({ error: 'The checker is busy. Try again in a minute.' }, 503, h);
    }

    const marks = Math.round(+req.marks);
    const messages = core.buildMarkMessages({ ...req, hasImage: !!req.image });
    const tries = [];
    if (env.GROQ_API_KEY && !req.image) tries.push(() => viaGroq(env, messages));
    if (env.AI) tries.push(() => viaWorkersAI(env, messages, req.image));
    for (const t of tries) {
      try { return json(core.parseMark(await t(), marks, req.scheme, req.scale), 200, h); }
      catch (e) { /* try the next provider */ }
    }
    return json({ error: 'The marking service is busy. Mark this one yourself, or try again later.' }, 503, h);
  }
};
