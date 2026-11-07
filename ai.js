/* StudyNet — AI marking client (window.SNAI). Needs ai-core.js.
   Written answers and maths working are always marked by StudyNet's marker: the Cloudflare Worker in worker/
   (Groq, with Workers AI as backup). Students don't choose who marks their paper. If the marker can't be
   reached, exam.js falls back to the student marking against the scheme. */
(function () {
  'use strict';
  var SNAI = window.SNAI = {};
  SNAI.SERVER = 'https://studynet-ai.studynet.workers.dev';
  function timeout(ms, p) { return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, ms); })]); }
  try { localStorage.removeItem('sn_ai'); } catch (e) {} // the old marking choice, no longer used

  // { ok, via:'server', label }
  SNAI.status = function () {
    return Promise.resolve(SNAI.SERVER ? { ok: true, via: 'server', vision: true, label: 'StudyNet’s marker' } : { ok: false, label: 'StudyNet’s marker isn’t available' });
  };

  // req: see SNAIcore.buildMarkMessages; plus image (data URL) optional. Resolves { marks, outOf, feedback, points, by }.
  SNAI.mark = function (req) {
    var bad = SNAIcore.validRequest(req);
    if (bad) return Promise.reject(new Error(bad));
    return timeout(60000, fetch(SNAI.SERVER + '/mark', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req) }))
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'the marker said no (' + r.status + ')'); return j; }); })
      .then(function (j) { j.by = 'StudyNet’s marker'; return j; });
  };
})();
