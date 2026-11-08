/* StudyNet — Practice exams (a subject-level tool on every subject page).
   A paper is laid out like a Junior Cycle / class-test paper: a cover with instructions and a marks grid, then
   Questions 1, 2, 3… Each question is about one topic, with parts (a), (b), (c) and sub-parts (i), (ii).
   Parts come from the subject's exam bank (Y.examq, each with a marking scheme), topped up with short questions
   from the subject's quizzes and practice. Maths parts are generated fresh from the class-test patterns.
   Nothing is written by AI. Objective answers are marked here. Maths gets method marks from MX.method (correct
   steps in the working), on a scale like the State Exams' (0 / low partial / high partial / full). Written
   answers are marked by AI against the scheme when it's set up (ai.js), otherwise the student marks them with
   the scheme. Papers are seeded, so a paper code rebuilds the same paper for a friend. */
(function () {
  'use strict';
  if (!window.SubjectApp) return;
  var ic = SN.ic, esc = SN.escHtml;
  var LEN = { short: 2, standard: 4, full: 7 }; // older paper codes
  // Question size: marks each question aims for, and how many lettered parts it can have.
  var SIZE = { s: { min: 8, max: 15, parts: 3, label: 'Short', hint: 'about 10 marks each' }, m: { min: 15, max: 30, parts: 5, label: 'Standard', hint: 'about 20 marks each' },
    l: { min: 25, max: 45, parts: 6, label: 'Long', hint: 'about 35 marks each' } };
  var KINDS = [['written', 'Written answers'], ['short', 'Short answers'], ['mcq', 'Tick the box'], ['gen', 'Maths with working']];
  function kindOfPart(p) { return p.type === 'fill' ? 'short' : p.type; }
  var DEFAULTS = { n: 4, z: 'm', k: ['written', 'short', 'mcq', 'gen'], m: 0, mm: 40, hc: 0, w: 0, c: 1 };
  var LETTERS = 'abcdefgh', ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi'];

  function descriptor(p) { return p >= 90 ? 'Distinction' : p >= 75 ? 'Higher Merit' : p >= 55 ? 'Merit' : p >= 40 ? 'Achieved' : p >= 20 ? 'Partially Achieved' : 'Not Graded'; }
  function rng(seed) { return window.MX ? MX.rng(seed) : (function (a) { return function () { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; }; })(seed); }
  function shuffle(arr, r) { arr = arr.slice(); for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
  function plain(html) { // text for the AI marker: x² as x^2, fractions as (a)/(b), no screen-reader words
    var d = document.createElement('div');
    d.innerHTML = String(html).replace(/<span class="sr-only">[^<]*<\/span>/g, '').replace(/<sup[^>]*>(.*?)<\/sup>/g, '^$1')
      .replace(/<span class="mfrac"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, '($1)/($2)');
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function encode(o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function decode(s) { try { return JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))))); } catch (e) { return null; } }
  function stepText(st) { return typeof st === 'string' ? st : (st.h ? st.h + ' ' : '') + st.t; }

  var api, cfg, Y, el, timerId = null, photos = {}, calcWasOpen = false;
  function calcBack() { document.documentElement.classList.remove('no-calc'); if (calcWasOpen && window.__calc) window.__calc.toggle(true); calcWasOpen = false; }
  function curKey() { return 'sn_exam_cur_' + cfg.id + '_y' + api.year; }
  function history() { var h = SN.readJSON('sn_exams', []); return Array.isArray(h) ? h.filter(function (x) { return x.subject === cfg.id && x.year === api.year; }) : []; }
  function spelling(item) { return item.spell || (cfg.marking && cfg.marking.spelling) || 'strict'; }
  function topicLabel(id) { var t = (Y.topics || []).filter(function (x) { return x.id === id; })[0]; return t ? t.label : 'Other'; }

  /* ── The bank, by topic ────────────────────────────────────── */
  function topicOf(src, key) { var t = (Y.topics || []).filter(function (t) { return (t[src] || []).indexOf(key) >= 0; })[0]; return t ? t.id : null; }
  // Exam-bank items come first; short questions from quizzes and practice top questions up.
  function bankByTopic() {
    var out = {};
    function add(t, kind, it) { if (!t) return; var o = out[t] = out[t] || { bank: [], short: [] }; o[kind].push(it); }
    (Y.examq || []).forEach(function (q) { add(q.topic, 'bank', q); });
    Object.keys(Y.quizzes || {}).forEach(function (k) {
      var t = topicOf('quiz', k);
      Y.quizzes[k].questions.forEach(function (q, i) { add(t, 'short', { id: 'qz-' + k + '-' + i, quizKey: k, raw: q }); });
    });
    Object.keys(Y.practice || {}).forEach(function (k) {
      var set = Y.practice[k], t = topicOf('prac', k);
      if (set.type !== 'lines') return;
      set.items.forEach(function (it, i) { add(t, 'short', { id: 'pr-' + k + '-' + i, prac: it, intro: set.intro }); });
    });
    return out;
  }
  function marksOf(item) { return item.type === 'group' ? item.parts.reduce(function (s, p) { return s + (p.marks || 2); }, 0) : item.marks || 2; }

  // One concrete answerable item (maths numbers generated with the paper's seed).
  function realiseItem(p, r) {
    if (p.type === 'gen') {
      var g = MX.skills[p.gen].gen(r), mk = p.marks || 5;
      var lo = Math.max(1, Math.round(mk * 0.3)), hi = Math.max(lo + 1, Math.round(mk * 0.7));
      return { type: 'gen', marks: mk, q: (p.intro ? esc(p.intro) + ' ' : '') + g.q, spec: g.spec, show: g.show, steps: g.steps, cp: g.cp, placeholder: g.placeholder,
        scale: true, lo: lo, hi: hi,
        scheme: ['Full marks (' + mk + '): correct answer, in the form asked for.',
          'High partial credit (' + hi + '): correct method all the way through, with one slip, or a correct but unfinished answer.',
          'Low partial credit (' + lo + '): a correct first step, e.g. ' + plain(stepText(g.steps[0])),
          'No credit (0): no correct relevant work.'] };
    }
    if (p.type === 'mcq') return { type: 'mcq', marks: p.marks || 3, q: p.q, ans: p.ans, opts: shuffle([p.ans].concat(p.opts), r) };
    if (p.type === 'fill') return { type: 'fill', marks: p.marks || p.ans.length, q: p.q, ans: p.ans, spell: p.spell };
    if (p.type === 'short') return { type: 'short', marks: p.marks || 2, q: p.q, ans: p.ans, spell: p.spell, intro: p.intro };
    return { type: 'written', marks: p.marks || 5, q: p.q, scheme: p.scheme || [], model: p.model, lines: p.lines || 4, spell: p.spell, photo: p.photo };
  }
  // A quiz or practice question as a short exam part. Short answers are typed; long ones become "tick the correct box".
  function shortItem(s, r, allowTick) {
    if (s.prac) {
      var it = s.prac, q = it.q != null ? esc(it.q).replace('___', '<span class="blank" aria-label="blank"></span>') : esc((it.b || '') + ' ____ ' + (it.a || ''));
      return { type: 'short', marks: 3, q: q + (it.h ? ' <em>' + esc(it.h) + '</em>' : ''), ans: it.ans };
    }
    var q2 = s.raw, a = q2.ans[0], words = a.split(/\s+/).length;
    // Typed only when the answer is a word or two and the question doesn't expect a choice ("Which…").
    if (words <= 2 && a.length <= 20 && !/[.!]$/.test(a) && !/^\s*which\b/i.test(q2.q || '')) return { type: 'short', marks: 3, q: SubjectApp.questionHtml(q2), ans: q2.ans };
    if (!allowTick) return null;
    return { type: 'mcq', marks: 3, q: SubjectApp.questionHtml(q2), ans: a, opts: shuffle(SubjectApp.quizOptions(Y.quizzes[s.quizKey], q2), r) };
  }

  // Builds the paper: one topic per question, each 15–30 marks, made of lettered parts.
  function build(conf) {
    var r = rng(conf.s), bt = bankByTopic(), tps = conf.t.filter(function (t) { return bt[t]; });
    if (!tps.length) return null;
    var pools = {};
    tps.forEach(function (t) { pools[t] = { bank: shuffle(bt[t].bank, r), short: shuffle(bt[t].short, r) }; });
    conf = normConf(conf);
    var SZ = SIZE[conf.z] || SIZE.m, Q_MIN = SZ.min, Q_MAX = SZ.max, MAX_PARTS = SZ.parts, kinds = conf.k;
    function allowed(p) { return kinds.indexOf(kindOfPart(p)) >= 0; }
    var nQ = conf.n, perf = conf.w === 1 ? topicPerf() : null, qs = [], guard = 0;
    // Mixed: random order; weakest first: by past results; notes order: the order of the topics in the subject.
    var order = conf.w === 2 ? tps.slice() : shuffle(tps, r);
    if (conf.w === 1) order.sort(function (a, b) { return (perf[a] != null ? perf[a] : 0.5) - (perf[b] != null ? perf[b] : 0.5); });
    while (qs.length < nQ && guard++ < 40) {
      var avail = order.filter(function (t) { return pools[t].bank.length || pools[t].short.length >= 2; });
      if (!avail.length) break;
      var t = avail[qs.length % avail.length];

      var q = { topic: t, parts: [] }, marks = 0, ticks = 0, topped = false, used = {}, pool = pools[t];
      while (q.parts.length < MAX_PARTS && marks < Q_MIN) {
        var it = null;
        var subs = null;
        for (var b = 0; b < pool.bank.length; b++) {
          var cand = pool.bank[b], cs = (cand.type === 'group' ? cand.parts : [cand]).filter(function (p) { return allowed(p.type === 'gen' ? { type: 'gen' } : p); });
          if (!cs.length) { pool.bank.splice(b, 1); b--; continue; } // no part of this question is a type the student chose
          var cm = cs.reduce(function (sm, p) { return sm + (p.marks || 2); }, 0);
          if (!q.parts.length || marks + cm <= Q_MAX) { it = pool.bank.splice(b, 1)[0]; subs = cs.map(function (p) { return realiseItem(p, r); }); break; }
        }
        if (it) {
          subs.forEach(function (p) { if (p.ans) used[SubjectApp.norm(Array.isArray(p.ans) ? (Array.isArray(p.ans[0]) ? p.ans[0][0] : p.ans[0]) : p.ans)] = 1; plain(p.q).toLowerCase().split(/\W+/).forEach(function (w) { if (w.length > 6) used[w] = 1; }); });
          q.parts.push({ stem: it.type === 'group' ? it.q : '', sub: subs, src: it.src });
          marks += subs.reduce(function (s, p) { return s + p.marks; }, 0);
          continue;
        }
        // Top up with two or three short questions as one lettered part (once per question).
        if (topped || (kinds.indexOf('short') < 0 && kinds.indexOf('mcq') < 0)) break;
        topped = true;
        var shorts = [];
        while (pool.short.length && shorts.length < 3 && marks + 3 * (shorts.length + 1) <= Q_MAX) {
          var si = shortItem(pool.short.shift(), r, ticks < 1 && kinds.indexOf('mcq') >= 0);
          if (!si || !allowed(si)) continue;
          // Skip a top-up that repeats an answer already asked in this question.
          var key = SubjectApp.norm(Array.isArray(si.ans) ? si.ans[0] : si.ans);
          if (used[key] || key.split(' ').some(function (w) { return w.length > 6 && used[w]; })) continue;
          used[key] = 1;
          if (si.type === 'mcq') ticks++;
          shorts.push(si);
        }
        if (!shorts.length) break;
        q.parts.push({ stem: '', sub: shorts });
        marks += shorts.reduce(function (s, p) { return s + p.marks; }, 0);
      }
      if (!q.parts.length) { pools[t] = { bank: [], short: [] }; continue; }
      // Short questions read best first, as (a); longer ones after.
      q.parts.sort(function (a, b2) { return (a.stem || a.sub.length > 1 && a.sub[0].type !== 'short' ? 1 : 0) - (b2.stem || b2.sub.length > 1 && b2.sub[0].type !== 'short' ? 1 : 0); });
      q.marks = marks;
      qs.push(q);
    }
    return qs.length ? qs : null;
  }
  function topicPerf() {
    var acc = {};
    history().forEach(function (h) { Object.keys(h.topics || {}).forEach(function (t) { var a = acc[t] = acc[t] || { g: 0, o: 0 }; a.g += h.topics[t].g; a.o += h.topics[t].o; }); });
    var out = {}; Object.keys(acc).forEach(function (t) { out[t] = acc[t].o ? acc[t].g / acc[t].o : null; });
    return out;
  }
  // Every answerable item on a paper, with its id.
  function eachItem(cur, fn) { cur.qs.forEach(function (q, qi) { q.parts.forEach(function (pt, ai) { pt.sub.forEach(function (p, si) { fn(p, 'q' + qi + '_' + ai + '_' + si, q, pt, qi, ai, si); }); }); }); }

  /* ── Setup screen ──────────────────────────────────────────── */
  function setup(params) {
    stopTimer();
    var bt = bankByTopic(), tps = (Y.topics || []).filter(function (t) { return bt[t.id] && (bt[t.id].bank.length || bt[t.id].short.length >= 2); });
    var cur = SN.readJSON(curKey(), null), hist = history().slice(-6).reverse(), perf = topicPerf(), pr = prefs();
    var h = '<header class="ph"><div class="ph-title">' + SN.logo(api.subj, 'lg') + '<h1 tabindex="-1">Practice exam</h1></div>' +
      '<p>' + esc(SN.YEAR_NAMES[api.year]) + ' ' + esc(cfg.title) + '. A paper laid out like your class tests, built from exam-style questions on the topics you choose, then marked against a marking scheme.</p></header>';
    if (cur && !cur.done && cur.v === 2) h += '<div class="notice" role="note">' + ic('clock') + '<div>You have a paper in progress. <button type="button" class="link" data-ex="resume">Continue it</button> or build a new one below.</div></div>';
    h += '<form id="ex-form" novalidate>';
    h += '<section class="ex-sec"><h2 id="ex-h-t">Topics</h2><p>Each question on the paper covers one topic. <button type="button" class="link" data-ex="all">All</button> · <button type="button" class="link" data-ex="none">None</button>.' + (Object.keys(perf).length ? ' The % is your average on that topic in past papers.' : '') + '</p>' +
      '<div class="ex-opts" data-group="t" role="group" aria-labelledby="ex-h-t">' + tps.map(function (t) {
        var pf = perf[t.id];
        return '<button type="button" class="pill" data-v="' + t.id + '" aria-pressed="' + (!pr.t || pr.t.indexOf(t.id) >= 0) + '">' + esc(t.label) + (pf != null ? ' <span class="pill-n num">' + Math.round(pf * 100) + '%</span>' : '') + '</button>';
      }).join('') + '</div></section>';
    var have = kindsHere(bt), calcSubj = !!cfg.calculator;
    function pill(g, v, label, on, extra) { return '<button type="button" class="pill" data-v="' + v + '" aria-pressed="' + !!on + '"' + (extra || '') + '>' + label + '</button>'; }
    h += '<section class="ex-sec"><h2>The paper</h2>' +
      '<div class="ex-row"><label for="ex-n">Questions</label><div class="stepper"><button type="button" class="btn" data-inc="-1" aria-label="One fewer question">−</button>' +
        '<input class="input num" type="number" id="ex-n" min="1" max="10" value="' + pr.n + '" inputmode="numeric"><button type="button" class="btn" data-inc="1" aria-label="One more question">+</button></div></div>' +
      '<div class="ex-row"><span class="ex-lbl" id="ex-h-z">Question size</span><div class="ex-opts" data-group="z" data-one role="group" aria-labelledby="ex-h-z">' +
        Object.keys(SIZE).map(function (k) { return pill('z', k, SIZE[k].label + ' <span class="ex-meta">' + SIZE[k].hint + '</span>', pr.z === k); }).join('') + '</div></div>' +
      '<div class="ex-row"><span class="ex-lbl" id="ex-h-k">Question types</span><div class="ex-opts" data-group="k" role="group" aria-labelledby="ex-h-k">' +
        KINDS.filter(function (k) { return have[k[0]]; }).map(function (k) { return pill('k', k[0], k[1], pr.k.indexOf(k[0]) >= 0); }).join('') + '</div></div>' +
      (calcSubj ? '<div class="ex-row"><span class="ex-lbl" id="ex-h-c">Calculator</span><div class="ex-opts" data-group="c" data-one role="group" aria-labelledby="ex-h-c">' +
        pill('c', 1, 'Allowed', pr.c === 1) + pill('c', 0, 'Not allowed', pr.c === 0) + '</div></div>' : '') +
      '</section>';
    h += '<section class="ex-sec"><h2>Timing</h2>' +
      '<div class="ex-row"><span class="ex-lbl" id="ex-h-m">Timer</span><div class="ex-opts" data-group="m" data-one role="group" aria-labelledby="ex-h-m">' +
        pill('m', 0, 'No timer', pr.m === 0) + pill('m', 1, 'Suggested time', pr.m === 1) + pill('m', 2, 'My own time', pr.m === 2) + '</div></div>' +
      '<div class="ex-row' + (pr.m === 2 ? '' : ' hidden') + '" id="ex-mm-row"><label for="ex-mm">Minutes</label><div class="stepper"><button type="button" class="btn" data-inc-mm="-5" aria-label="5 minutes less">−</button>' +
        '<input class="input num" type="number" id="ex-mm" min="5" max="180" step="5" value="' + pr.mm + '" inputmode="numeric"><button type="button" class="btn" data-inc-mm="5" aria-label="5 minutes more">+</button></div></div>' +
      '<div class="ex-row' + (pr.m ? '' : ' hidden') + '" id="ex-hc-row"><span class="ex-lbl" id="ex-h-hc">Clock</span><div class="ex-opts" data-group="hc" data-one role="group" aria-labelledby="ex-h-hc">' +
        pill('hc', 0, 'Show time left', pr.hc === 0) + pill('hc', 1, 'Hide it; warn me at 5 and 1 minutes', pr.hc === 1) + '</div></div>' +
      '</section>';
    h += '<section class="ex-sec"><h2 id="ex-h-w">Order of questions</h2><div class="ex-opts" data-group="w" data-one role="group" aria-labelledby="ex-h-w">' +
      pill('w', 0, 'Mixed', pr.w === 0) + pill('w', 1, 'Weakest topics first', pr.w === 1, hist.length ? '' : ' disabled title="Sit a paper first"') + pill('w', 2, 'Same order as my notes', pr.w === 2) + '</div></section>';
    h += '<p class="ex-sum" id="ex-sum" aria-live="polite"></p>';
    h += '<div class="ex-actions"><button type="submit" class="btn primary">' + ic('paper') + ' Build my paper</button><button type="button" class="link" data-ex="defaults">Reset options</button>' +
      '<span class="ex-meta">or open a friend’s paper:</span><input class="input ex-code" id="ex-code" placeholder="Paper code" aria-label="Paper code" autocomplete="off"><button type="button" class="btn" data-ex="code">Open</button></div>';
    h += '<p class="ex-meta" id="ex-err" role="alert"></p></form>';
    h += '<section class="ex-sec gap"><h2>How it’s marked</h2><p id="ex-ai">Checking…</p>' +
      '<p class="ex-meta">Real Junior Cycle papers and marking schemes are free on <a class="link" href="https://www.examinations.ie/exammaterialarchive/" target="_blank" rel="noopener">examinations.ie</a> (opens in a new tab). <a class="link" href="about.html">How StudyNet uses AI</a>.</p></section>';
    if (hist.length) h += '<section class="ex-sec"><h2>Your recent papers</h2><ul class="ex-hist">' + hist.map(function (x) {
      return '<li><span>' + new Date(x.at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' }) + ' · ' + x.n + ' questions</span><span><b class="num">' + x.pct + '%</b> ' + descriptor(x.pct) + '</span></li>';
    }).join('') + '</ul></section>';
    el.innerHTML = h;
    var maths = cfg.id === 'maths';
    window.SNAI && SNAI.status().then(function (st) {
      var p = el.querySelector('#ex-ai'); if (!p) return;
      var base = 'Short answers and multiple choice are marked straight away' + (cfg.marking && cfg.marking.spelling === 'lenient' ? '; spelling doesn’t cost marks in ' + esc(cfg.title) + ' if the word is readable or sounds right' : '') + '. ' +
        (maths ? 'Maths is marked like a State Exam: full marks for a correct answer, and partial credit for correct steps in your working, so always show it. ' : '');
      p.innerHTML = base + 'Written answers are marked by AI against each question’s marking scheme. If the marker can’t be reached (for example offline), you’ll mark them yourself against the scheme.';
    });
    summary();
    if (params && params.code) { el.querySelector('#ex-code').value = params.code; openCode(params.code); }
  }
  // Which question types this subject's bank can produce.
  function kindsHere(bt) {
    var k = {};
    Object.keys(bt).forEach(function (t) {
      bt[t].bank.forEach(function (it) { (it.type === 'group' ? it.parts : [it]).forEach(function (p) { k[kindOfPart(p)] = 1; }); });
      if (bt[t].short.length) { k.short = 1; if (bt[t].short.some(function (x) { return x.raw; })) k.mcq = 1; }
    });
    return k;
  }
  function prefsKey() { return 'sn_exam_prefs_' + cfg.id; }
  function prefs() { var p = SN.readJSON(prefsKey(), null); return normConf(Object.assign({}, DEFAULTS, p && typeof p === 'object' ? p : {})); }
  function normConf(c) {
    c = Object.assign({}, c);
    if (c.n == null) c.n = c.l ? LEN[c.l] || 4 : DEFAULTS.n; // old codes
    c.n = Math.max(1, Math.min(10, Math.round(+c.n) || 4));
    if (!SIZE[c.z]) c.z = 'm';
    if (!Array.isArray(c.k)) c.k = DEFAULTS.k.slice();
    c.m = +c.m || 0; c.mm = Math.max(5, Math.min(180, Math.round(+c.mm) || 40)); c.hc = +c.hc || 0; c.w = +c.w || 0; c.c = c.c == null ? 1 : +c.c;
    return c;
  }
  function snapFields() { // keep the number boxes on valid values: 1–10 questions, 5–180 minutes in steps of 5
    var n = el.querySelector('#ex-n'), mm = el.querySelector('#ex-mm');
    if (n) n.value = Math.max(1, Math.min(10, Math.round(+n.value) || 1));
    if (mm) mm.value = Math.max(5, Math.min(180, Math.round((+mm.value || 5) / 5) * 5));
  }
  function suggestedMinutes(marks) { return Math.max(10, Math.round(marks * 0.5 / 5) * 5); }
  function summary() {
    var f = readForm(), el2 = el.querySelector('#ex-sum'); if (!el2) return;
    var sample = f.t.length && f.k.length ? build(Object.assign({}, f, { s: 1 })) : null;
    var marks = sample ? sample.reduce(function (sm, q) { return sm + q.marks; }, 0) : 0, nq = sample ? sample.length : 0;
    var time = f.m === 2 ? f.mm + ' minutes' : f.m === 1 ? 'about ' + suggestedMinutes(marks) + ' minutes' : 'no time limit';
    var warn = !f.t.length ? 'Choose at least one topic.' : !f.k.length ? 'Choose at least one question type.' : !sample ? 'There aren’t questions of those types for those topics yet.' : '';
    if (!warn && nq < f.n) warn = '';
    el2.innerHTML = warn ? '<b>' + warn + '</b>' : '<b>' + nq + ' question' + (nq > 1 ? 's' : '') + '</b>' + (nq < f.n ? ' (that’s all there are for these choices)' : '') + ' · about ' + marks + ' marks · ' + time + (cfg.calculator ? ' · calculator ' + (f.c ? 'allowed' : 'not allowed') : '');
    el.querySelector('#ex-mm-row').classList.toggle('hidden', f.m !== 2);
    el.querySelector('#ex-hc-row').classList.toggle('hidden', !f.m);
  }
  function readForm() {
    function vals(g) { return Array.prototype.map.call(el.querySelectorAll('[data-group="' + g + '"] [aria-pressed="true"]'), function (b) { return b.dataset.v; }); }
    var n = el.querySelector('#ex-n'), mm = el.querySelector('#ex-mm');
    return normConf({ t: vals('t'), n: n ? n.value : 4, z: vals('z')[0], k: vals('k'), m: +vals('m')[0] || 0, mm: mm ? mm.value : 40, hc: +vals('hc')[0] || 0,
      w: +vals('w')[0] || 0, c: cfg.calculator ? +(vals('c')[0] || 0) : 1, s: Math.floor(Math.random() * 1e9), y: api.year });
  }
  function start(conf, fromForm) {
    conf = normConf(conf);
    var err = el.querySelector('#ex-err');
    if (!conf.t.length || !conf.k.length) { if (err) err.textContent = !conf.t.length ? 'Choose at least one topic.' : 'Choose at least one question type.'; return; }
    if (fromForm) { var keep = Object.assign({}, conf); delete keep.s; delete keep.y; SN.writeJSON(prefsKey(), keep); }
    var qs = build(conf);
    if (!qs) { if (err) err.textContent = 'There aren’t questions of those types for those topics yet. Choose more topics or question types.'; return; }
    var total = qs.reduce(function (s, q) { return s + q.marks; }, 0);
    var cur = { v: 2, code: encode(conf), conf: conf, qs: qs, answers: {}, started: Date.now(), total: total,
      limit: conf.m === 2 ? conf.mm * 60000 : conf.m === 1 ? suggestedMinutes(total) * 60000 : 0, hideClock: !!(conf.m && conf.hc), noCalc: !!(cfg.calculator && !conf.c) };
    photos = {};
    SN.writeJSON(curKey(), cur);
    paper(cur);
  }
  function openCode(code) {
    var conf = decode(code.trim()), err = el.querySelector('#ex-err');
    if (!conf || !conf.t || conf.y !== api.year) { err.textContent = conf && conf.y && conf.y !== api.year ? 'That code is for ' + SN.YEAR_NAMES[conf.y] + '. Switch year on the ' + cfg.title + ' page first.' : 'That paper code isn’t valid.'; return; }
    start(conf);
  }

  /* ── The paper ─────────────────────────────────────────────── */
  function lbl(ai, si, n) { return n > 1 ? '(' + ROMAN[si] + ')' : ''; }
  function answerArea(p, id, val) {
    if (p.type === 'mcq') return '<p class="tick-ins">Tick (<span class="tick-mark" aria-hidden="true"></span>) the correct box.</p><div class="tick-row" role="radiogroup" aria-label="Choose one">' + p.opts.map(function (o) {
      return '<label class="tick"><input type="radio" name="' + id + '" value="' + esc(o) + '"' + (val === o ? ' checked' : '') + '><span class="tick-box" aria-hidden="true"></span><span>' + esc(o) + '</span></label>';
    }).join('') + '</div>';
    if (p.type === 'gen') return '<div class="grid-box"><label class="sr-only" for="' + id + '-w">Working</label><textarea id="' + id + '-w" data-w="' + id + '" rows="5">' + esc((val && val.w) || '') + '</textarea></div>' +
      '<div class="ans-line"><span class="ans-l">Answer:</span>' + MX.inputHtml(id, 'Answer', val && val.a, { placeholder: '' }) + '</div>' +
      '<div class="pq-photo"><button type="button" class="btn" data-photo="' + id + '">' + ic('camera') + ' Add a photo of written working</button><span data-photo-out="' + id + '"></span></div>';
    if (p.type === 'fill') {
      var n = 0;
      return '<p class="pq-q">' + esc(p.q).replace(/___/g, function () { var v = (val || [])[n++] || ''; return '<input class="blank-in" data-fill="' + id + '" value="' + esc(v) + '" aria-label="Blank ' + n + '" autocomplete="off" spellcheck="false">'; }) + '</p>';
    }
    if (p.type === 'short') return '<input class="line-in" id="' + id + '" value="' + esc(val || '') + '" aria-label="Answer" autocomplete="off" spellcheck="false">';
    return '<textarea class="ruled" id="' + id + '" rows="' + Math.max(3, p.lines || 4) + '" aria-label="Answer">' + esc(val || '') + '</textarea>' +
      (p.photo ? '<div class="pq-photo"><button type="button" class="btn" data-photo="' + id + '">' + ic('camera') + ' Add a photo of a drawing or diagram</button><span data-photo-out="' + id + '"></span></div>' : '');
  }
  function cover(cur, marked) {
    var maths = cfg.id === 'maths', min = cur.limit ? Math.round(cur.limit / 60000) : Math.max(10, Math.round(cur.total * 0.5 / 5) * 5);
    var tot = marked ? totals(cur) : null, busy = marked && Object.keys(cur.marks).some(function (k) { return cur.marks[k].by === 'pending'; });
    var rows = cur.qs.map(function (q, qi) {
      var g = tot ? tot.byQ[qi] : null;
      return '<tr><th scope="row">' + (qi + 1) + '</th><td>' + (g != null ? '<span class="pen num">' + (busy ? '–' : g) + '</span>' : '<span class="blank-mark" aria-hidden="true"></span>') + '<span class="of num">/' + q.marks + '</span></td></tr>';
    }).join('');
    return '<header class="sheet-cover"><div class="cover-top"><span>StudyNet practice paper</span><span>' + esc(SN.YEAR_NAMES[api.year]) + ' · Common Level</span></div>' +
      '<div class="cover-title">' + SN.logo(api.subj, 'md') + '<h2 tabindex="-1" class="cover-h">' + esc(cfg.title) + ': practice paper</h2></div>' +
      '<p class="cover-sub">' + (cur.limit ? 'Time allowed: ' + min + ' minutes' : 'Suggested time: ' + min + ' minutes') + ' · ' + cur.total + ' marks · ' + cur.qs.length + ' questions</p>' +
      '<div class="cover-grid"><div class="cover-ins"><h2>Instructions</h2><ul><li>Answer <b>all</b> questions.</li><li>Write your answers in the spaces provided.</li>' +
        (maths ? '<li>Show all your work clearly. Marks may be lost if necessary work is not shown.</li>' : '') +
        (cfg.calculator ? (cur.noCalc ? '<li><b>Calculators may not be used</b> in this paper.</li>' : '<li>You may use a calculator.</li>') : '') +
        '<li>The marks for each part are shown in brackets on the right.</li></ul></div>' +
        '<table class="cover-marks"><caption class="sr-only">Marks for each question</caption><thead><tr><th scope="col">Question</th><th scope="col">Mark</th></tr></thead><tbody>' + rows +
        '<tr class="tot"><th scope="row">Total</th><td>' + (tot ? '<span class="pen num">' + (busy ? '–' : tot.got) + '</span>' : '<span class="blank-mark" aria-hidden="true"></span>') + '<span class="of num">/' + cur.total + '</span></td></tr></tbody></table></div>' +
      '<p class="cover-code">Want a friend to sit the same paper? <button type="button" class="link" data-ex="copy" title="Paper code ' + esc(cur.code) + '">Copy a link to it</button></p></header>';
  }
  function paper(cur) {
    var h = '<div class="ex-bar"><span class="sr-only" id="ex-say" role="status"></span><span class="ex-time num" id="ex-time" aria-live="off"></span><span class="ex-meta" id="ex-count"></span><span class="grow"></span>' +
      '<button type="button" class="btn ex-print" data-ex="print">' + ic('printer') + ' Print</button><button type="button" class="btn primary" data-ex="finish">' + ic('check') + ' Finish and mark</button></div>';
    h += '<div class="desk"><article class="sheet">' + cover(cur, false);
    cur.qs.forEach(function (q, qi) {
      h += '<section class="qn" aria-labelledby="qn' + qi + '"><div class="qn-head"><h2 id="qn' + qi + '">Question ' + (qi + 1) + '</h2><span class="qn-marks">(' + q.marks + ' marks)</span></div>';
      q.parts.forEach(function (pt, ai) {
        h += '<div class="qp"><span class="qp-l">(' + LETTERS[ai] + ')</span><div class="qp-b">';
        if (pt.stem) h += '<p class="qp-stem">' + pt.stem + '</p>';
        pt.sub.forEach(function (p, si) {
          var id = 'q' + qi + '_' + ai + '_' + si, l = lbl(ai, si, pt.sub.length);
          h += '<div class="qs' + (l ? ' has-l' : '') + '">' + (l ? '<span class="qs-l">' + l + '</span>' : '') + '<div class="qs-b">' +
            (p.type !== 'fill' ? '<div class="pq-q">' + p.q + '</div>' : '') + answerArea(p, id, cur.answers[id]) + '</div><span class="qs-m">(' + p.marks + ')</span></div>';
        });
        h += '</div></div>';
      });
      h += '</section>';
    });
    h += '<p class="sheet-end">End of paper</p></article></div>' +
      '<div class="ex-actions gap"><button type="button" class="btn primary" data-ex="finish">' + ic('check') + ' Finish and mark</button></div>';
    el.innerHTML = h;
    document.documentElement.classList.toggle('no-calc', !!cur.noCalc);
    calcWasOpen = !!(cur.noCalc && window.__calc && window.__calc.el && window.__calc.el.style.display !== 'none');
    if (cur.noCalc && window.__calc) window.__calc.toggle(false);
    el.querySelector('.cover-h').focus({ preventScroll: true });
    window.scrollTo(0, 0);
    tick(cur); stopTimer(); timerId = setInterval(function () { tick(SN.readJSON(curKey(), cur)); }, 1000);
    countAnswered(cur);
  }
  function say(msg) { var s = el && el.querySelector('#ex-say'); if (s) s.textContent = msg; }
  function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }
  function fmt(ms) { ms = Math.max(0, ms); var s = Math.round(ms / 1000), m = Math.floor(s / 60); return m + ':' + ('0' + (s % 60)).slice(-2); }
  var warned = {};
  function tick(cur) {
    var t = el.querySelector('#ex-time'); if (!t) return stopTimer();
    var used = Date.now() - cur.started;
    if (cur.limit) {
      var left = cur.limit - used;
      t.textContent = cur.hideClock ? (left < 5 * 60000 ? 'Under 5 minutes left' : 'Timed paper') : fmt(left) + ' left' + (left < 5 * 60000 ? ' (nearly out of time)' : ''); t.classList.toggle('low', left < 5 * 60000);
      [5, 1].forEach(function (mins) { if (left < mins * 60000 && !warned[cur.started + '' + mins]) { warned[cur.started + '' + mins] = 1; say(mins + ' minute' + (mins > 1 ? 's' : '') + ' left.'); } });
      if (left <= 0) { stopTimer(); finish(true); }
    } else t.textContent = fmt(used);
  }
  function collect() {
    var cur = SN.readJSON(curKey(), null); if (!cur || !el.querySelector('.ex-bar')) return cur;
    eachItem(cur, function (p, id) {
      var v;
      if (p.type === 'mcq') { var c = el.querySelector('input[name="' + id + '"]:checked'); v = c ? c.value : ''; }
      else if (p.type === 'gen') { var a = el.querySelector('#' + id), w = el.querySelector('[data-w="' + id + '"]'); v = { a: a ? a.value : '', w: w ? w.value : '' }; }
      else if (p.type === 'fill') v = Array.prototype.map.call(el.querySelectorAll('[data-fill="' + id + '"]'), function (x) { return x.value; });
      else { var x = el.querySelector('#' + id); v = x ? x.value : ''; }
      cur.answers[id] = v;
    });
    SN.writeJSON(curKey(), cur);
    return cur;
  }
  function answered(v) { return v && (typeof v === 'string' ? v.trim() : Array.isArray(v) ? v.some(function (x) { return x.trim(); }) : (v.a || '').trim() || (v.w || '').trim()); }
  function countAnswered(cur) {
    var n = 0, t = 0;
    eachItem(cur, function (p, id) { t++; if (answered(cur.answers[id]) || photos[id]) n++; });
    var c = el.querySelector('#ex-count'); if (c) c.textContent = n + ' of ' + t + ' parts answered';
    return t - n;
  }

  /* ── Marking ───────────────────────────────────────────────── */
  function finish(timeUp) {
    var cur = collect(); if (!cur) return;
    var left = countAnswered(cur), btn = el.querySelector('.ex-bar [data-ex="finish"]');
    if (!timeUp && left && btn && !btn.dataset.armed) {
      btn.dataset.armed = '1'; btn.innerHTML = ic('check') + ' ' + left + ' unanswered. Tap again to finish';
      say(left + ' parts unanswered. Press Finish again to finish anyway.');
      var cnt = el.querySelector('#ex-count'); if (cnt && !el.querySelector('[data-ex="first-blank"]')) cnt.insertAdjacentHTML('afterend', ' <button type="button" class="link" data-ex="first-blank">Go to the first blank</button>');
      setTimeout(function () { if (btn.isConnected) { delete btn.dataset.armed; btn.innerHTML = ic('check') + ' Finish and mark'; } }, 8000);
      return;
    }
    stopTimer();
    calcBack();
    SN.markStudied();
    cur.done = true; cur.finished = Date.now(); cur.timeUp = !!timeUp; cur.marks = {};
    eachItem(cur, function (p, id) { cur.marks[id] = autoMark(p, cur.answers[id], id); });
    SN.writeJSON(curKey(), cur);
    results(cur);
    aiPass(cur);
  }
  // { got, of, by:'auto'|'ai'|'self'|'pending', note?, feedback?, self?:[bool], band? }
  function autoMark(p, v, id) {
    if (p.type === 'mcq') return { got: v && SubjectApp.check(v, [p.ans]) ? p.marks : 0, of: p.marks, by: 'auto', ok: !!(v && SubjectApp.check(v, [p.ans])) };
    if (p.type === 'short') {
      var r = SubjectApp.match(v || '', p.ans, spelling(p) === 'lenient');
      return { got: r.ok ? p.marks : 0, of: p.marks, by: 'auto', ok: r.ok, note: r.ok && !r.exact ? 'Accepted: the spelling is close enough in ' + cfg.title + '.' : '' };
    }
    if (p.type === 'fill') {
      var each = p.marks / p.ans.length, got = 0;
      (v || []).forEach(function (x, i) { if (p.ans[i] && SubjectApp.match(x || '', p.ans[i], spelling(p) === 'lenient').ok) got += each; });
      return { got: Math.round(got), of: p.marks, by: 'auto', ok: Math.round(got) === p.marks };
    }
    if (p.type === 'gen') {
      var r2 = MX.check(p.spec, v && v.a);
      if (r2.ok) return { got: p.marks, of: p.marks, by: 'auto', ok: true };
      // Method marks from the working, found by the maths checker.
      var meth = MX.method(p, v && v.w, v && v.a), band = meth ? meth.band : null;
      var got2 = band === 'hi' ? p.hi : band === 'lo' ? p.lo : 0;
      var hasWork = (v && (v.w || '').trim()) || photos[id];
      return { got: got2, of: p.marks, band: band, why: meth ? meth.why : '', by: hasWork && band !== 'hi' ? 'pending' : 'auto', note: r2.msg || '',
        self: [false, band === 'hi', band === 'lo', false] };
    }
    var blank = !answered(v) && !photos[id];
    return { got: 0, of: p.marks, by: blank ? 'auto' : 'pending', note: blank ? 'No answer.' : '', self: (p.scheme || []).map(function () { return false; }) };
  }
  function schemeMarks(p) {
    var parsed = p.scheme.map(function (s) { var m = /\((\d+)\s*marks?\)/.exec(s); return m ? +m[1] : null; });
    if (parsed.every(function (x) { return x != null; })) return parsed;
    var each = p.marks / Math.max(1, p.scheme.length);
    return p.scheme.map(function () { return each; });
  }
  function partGot(p, m) {
    if (m.by !== 'self') return m.got;
    if (p.scale) return Math.max(m.got || 0, m.self[0] ? p.marks : m.self[1] ? p.hi : m.self[2] ? p.lo : 0);
    var w = schemeMarks(p);
    return Math.min(p.marks, Math.round(m.self.reduce(function (s, on, i) { return s + (on ? w[i] : 0); }, 0)));
  }
  function aiPass(cur) {
    if (!window.SNAI) return toSelf(cur);
    SNAI.status().then(function (st) {
      if (!st.ok) return toSelf(cur);
      var jobs = [];
      eachItem(cur, function (p, id, q, pt) { if (cur.marks[id].by === 'pending') jobs.push({ p: p, id: id, stem: pt.stem }); });
      var done = 0, i = 0;
      function status() { var s = el.querySelector('#ex-ai-status'); if (s) s.textContent = jobs.length ? (done < jobs.length ? 'AI is marking ' + (done + 1) + ' of ' + jobs.length + '…' : 'AI marking finished.') : ''; }
      status();
      function next() {
        if (i >= jobs.length) return Promise.resolve();
        var j = jobs[i++], v = cur.answers[j.id];
        var req = { subject: cfg.title, year: SN.YEAR_NAMES[api.year], question: plain((j.stem ? j.stem + ' ' : '') + j.p.q), marks: j.p.marks, scheme: j.p.scheme,
          model: j.p.type === 'gen' ? plain(j.p.show) + '. Worked solution: ' + j.p.steps.map(function (s) { return plain(stepText(s)); }).join(' ') : j.p.model,
          answer: j.p.type === 'gen' ? 'Final answer: ' + ((v && v.a) || '(none)') : (v || ''), working: j.p.type === 'gen' ? (v && v.w) || '' : '',
          spelling: spelling(j.p), note: cfg.marking && cfg.marking.note, image: photos[j.id] || undefined, scale: !!j.p.scale };
        return SNAI.mark(req).then(function (res) {
          var prev = cur.marks[j.id], got = res.marks;
          if (!j.p.scale && res.points && res.points.length && j.p.scheme && j.p.scheme.length) { // trust the points over a mismatched total
            var w = schemeMarks(j.p), fromPts = Math.min(j.p.marks, Math.round(res.points.reduce(function (s, pt) { return s + (pt.awarded && w[pt.point - 1] ? w[pt.point - 1] : 0); }, 0)));
            if (fromPts !== got) got = fromPts;
          }
          // The maths checker knows the final answer is wrong: AI can give method marks, never full marks, and never less than the checker found.
          if (j.p.type === 'gen') got = Math.max(prev.got || 0, Math.min(got, j.p.hi));
          cur.marks[j.id] = { got: got, of: j.p.marks, by: 'ai', feedback: res.feedback, points: res.points, who: res.by, note: res.note || '', band: prev.band, why: prev.why };
        }).catch(function (e) {
          cur.marks[j.id] = Object.assign(cur.marks[j.id], { by: 'self', note: 'AI marking didn’t work (' + e.message + '). Mark this one yourself below.' });
        }).then(function () { done++; SN.writeJSON(curKey(), cur); results(cur, true); status(); return next(); });
      }
      next().then(function () { SN.writeJSON(curKey(), cur); saveHistory(cur); results(cur, true); });
    });
  }
  function toSelf(cur) {
    Object.keys(cur.marks).forEach(function (id) { if (cur.marks[id].by === 'pending') cur.marks[id].by = 'self'; });
    SN.writeJSON(curKey(), cur); saveHistory(cur); results(cur, true);
  }
  function totals(cur) {
    var got = 0, of = 0, tp = {}, byQ = cur.qs.map(function () { return 0; });
    eachItem(cur, function (p, id, q, pt, qi) {
      var m = cur.marks[id], g = partGot(p, m);
      got += g; of += m.of; byQ[qi] += g;
      var t = tp[q.topic] = tp[q.topic] || { g: 0, o: 0 }; t.g += g; t.o += m.of;
    });
    return { got: got, of: of, pct: of ? Math.round(got / of * 100) : 0, topics: tp, byQ: byQ };
  }
  function saveHistory(cur) {
    var t = totals(cur), all = SN.readJSON('sn_exams', []);
    if (!Array.isArray(all)) all = [];
    all = all.filter(function (x) { return x.id !== cur.started + cfg.id; });
    all.push({ id: cur.started + cfg.id, subject: cfg.id, year: api.year, at: cur.finished, n: cur.qs.length, got: t.got, of: t.of, pct: t.pct, topics: t.topics });
    SN.writeJSON('sn_exams', all.slice(-60));
  }

  /* ── The marked paper ──────────────────────────────────────── */
  function answerShown(p, v) {
    if (p.type === 'gen') return (v && v.w ? '<div class="grid-box shown">' + esc(v.w).replace(/\n/g, '<br>') + '</div>' : '') +
      '<div class="ans-line"><span class="ans-l">Answer:</span><span class="ans-v">' + (v && v.a ? MX.preview(v.a) : '<i>none</i>') + '</span></div>';
    if (p.type === 'mcq') return '<div class="tick-row">' + p.opts.map(function (o) {
      return '<span class="tick' + (o === v ? ' on' : '') + (o === p.ans ? ' right' : '') + '"><span class="tick-box" aria-hidden="true"></span><span>' + esc(o) +
        (o === v ? '<span class="sr-only"> (your choice)</span>' : '') + (o === p.ans && o !== v ? ' <span class="tag-right">Correct answer</span>' : '') + '</span></span>';
    }).join('') + '</div>';
    if (p.type === 'fill') return '<p class="pq-q">' + esc(p.q).replace(/___/g, (function () { var n = 0; return function () { return '<span class="blank-v">' + esc((v || [])[n++] || '…') + '</span>'; }; })()) + '</p>';
    if (p.type === 'short') return '<div class="line-v">' + (v ? esc(v) : '<i>No answer</i>') + '</div>';
    return '<div class="ruled shown">' + (v ? esc(v).replace(/\n/g, '<br>') : '<i>No answer</i>') + '</div>';
  }
  function correctText(p) {
    if (p.type === 'mcq' || p.type === 'short') return esc(Array.isArray(p.ans) ? p.ans[0] : p.ans);
    if (p.type === 'fill') return p.ans.map(function (a) { return esc(a[0]); }).join(' / ');
    if (p.type === 'gen') return p.show;
    return p.model ? esc(p.model) : '';
  }
  function examiner(p, m, id, got) {
    var h = '';
    if (m.note) h += '<p>' + esc(m.note) + '</p>';
    if (p.type === 'gen' && got < p.marks) {
      h += '<p><b>Scale:</b> 0 · ' + p.lo + ' · ' + p.hi + ' · ' + p.marks + ' (no credit · low partial · high partial · full). ' +
        (m.band ? 'Your working earned <b>' + (m.band === 'hi' ? 'high' : 'low') + ' partial credit</b>: ' + esc(m.why) + '.' : 'No correct steps were found in your working.') + '</p>';
    }
    if (m.by === 'ai') {
      h += '<p>' + esc(m.feedback || '') + '</p>';
      if (m.points && m.points.length && p.scheme && !p.scale) h += '<ul>' + m.points.map(function (pt) { var s = p.scheme[pt.point - 1]; return s ? '<li>' + (pt.awarded ? 'Got: ' : 'Missed: ') + esc(s) + '</li>' : ''; }).join('') + '</ul>';
      h += '<p class="mk-by">Marked by AI (' + esc(m.who || '') + ') against the marking scheme. If it looks wrong, ask your teacher.</p>';
    }
    if (m.by === 'self') {
      if (p.scale) h += '<fieldset class="mk-self"><legend>Mark it yourself: which band does your work reach?</legend>' + p.scheme.map(function (s, si) {
        return '<label><input type="radio" name="self-' + id + '" data-self="' + id + '" data-i="' + si + '"' + (m.self[si] ? ' checked' : '') + '><span>' + esc(s) + '</span></label>';
      }).join('') + '</fieldset>';
      else h += '<fieldset class="mk-self"><legend>Marking scheme: tick each point your answer makes</legend>' + p.scheme.map(function (s, si) {
        return '<label><input type="checkbox" data-self="' + id + '" data-i="' + si + '"' + (m.self[si] ? ' checked' : '') + '><span>' + esc(s) + '</span></label>';
      }).join('') + '</fieldset>';
    }
    var c = correctText(p);
    if (c && got < p.marks) h += '<p class="mk-model"><b>' + (p.type === 'written' ? 'Sample answer:' : 'Answer:') + '</b> ' + c + '</p>';
    if (p.type === 'gen' && got < p.marks) h += '<details><summary class="link">Worked solution</summary><div class="steps"><ol>' + p.steps.map(function (st) { return '<li>' + (st.h ? '<b>' + st.h + '</b> ' : '') + (st.t || st) + '</li>'; }).join('') + '</ol></div></details>';
    return h ? '<div class="examiner">' + h + '</div>' : '';
  }
  function results(cur, keepScroll) {
    var t = totals(cur), pending = Object.keys(cur.marks).some(function (k) { return cur.marks[k].by === 'pending'; }), y = window.scrollY;
    var openSol = Array.prototype.map.call(el.querySelectorAll('.sheet details'), function (d) { return d.open; });
    var weak = weakest(t);
    if (pending) weak = null;
    var h = '<div class="ex-res" role="status"><div class="ex-res-top"><span class="ex-res-pct num">' + (pending ? 'Marking…' : t.pct + '%') + '</span><div><div class="ex-res-desc">' + (pending ? 'Your paper is being marked' : descriptor(t.pct)) + '</div>' +
      '<div class="ex-meta"><b class="num">' + t.got + '</b> of <span class="num">' + t.of + '</span> marks' + (cur.timeUp ? ' · time was up' : '') + (pending ? ' · still marking some answers' : '') + '</div>' +
      '<div class="ex-meta" id="ex-ai-status" aria-live="polite"></div></div></div>' +
      '<div class="ex-topics' + (pending ? ' hidden' : '') + '">' + Object.keys(t.topics).map(function (k) { var x = t.topics[k], pc = Math.round(x.g / x.o * 100);
        return '<div><span>' + esc(topicLabel(k)) + '</span><span class="bar" aria-hidden="true"><i style="width:' + pc + '%"></i></span><span class="num">' + pc + '%</span></div>'; }).join('') + '</div>' +
      '<p class="ex-meta">Junior Cycle descriptors: Distinction 90+, Higher Merit 75+, Merit 55+, Achieved 40+, Partially Achieved 20+.</p>' +
      '<div class="ex-actions"><button type="button" class="btn primary" data-ex="new">' + ic('paper') + ' Build another paper</button>' +
      (weak ? '<button type="button" class="btn" data-ex="revise" data-topic-id="' + weak + '">Revise ' + esc(topicLabel(weak)) + '</button>' : '') +
      '<button type="button" class="btn" data-ex="print">' + ic('printer') + ' Print</button></div></div>';
    h += '<div class="desk"><article class="sheet marked">' + cover(cur, true);
    cur.qs.forEach(function (q, qi) {
      h += '<section class="qn"><div class="qn-head"><h2>Question ' + (qi + 1) + '</h2><span class="qn-marks"><span class="pen num">' + t.byQ[qi] + '</span> / ' + q.marks + ' marks</span></div>';
      q.parts.forEach(function (pt, ai) {
        h += '<div class="qp"><span class="qp-l">(' + LETTERS[ai] + ')</span><div class="qp-b">' + (pt.stem ? '<p class="qp-stem">' + pt.stem + '</p>' : '');
        pt.sub.forEach(function (p, si) {
          var id = 'q' + qi + '_' + ai + '_' + si, m = cur.marks[id], got = partGot(p, m), l = lbl(ai, si, pt.sub.length);
          var verdict = m.by === 'pending' ? '' : got === p.marks ? 'right' : got > 0 ? 'part' : 'wrong';
          h += '<div class="qs' + (l ? ' has-l' : '') + '">' + (l ? '<span class="qs-l">' + l + '</span>' : '') + '<div class="qs-b">' +
            (p.type !== 'fill' ? '<div class="pq-q">' + p.q + '</div>' : '') + answerShown(p, cur.answers[id]) + examiner(p, m, id, got) + '</div>' +
            '<span class="qs-m mark ' + verdict + '">' + (m.by === 'pending' ? '<span class="ex-meta">Marking…</span>' : '<span class="pen num">' + got + '</span><span class="of">/' + p.marks + '</span>') +
            '<span class="sr-only">' + (verdict === 'right' ? ' Correct.' : verdict === 'part' ? ' Partly correct.' : verdict === 'wrong' ? ' Not correct.' : '') + '</span></span></div>';
        });
        h += '</div></div>';
      });
      h += '</section>';
    });
    h += '<p class="sheet-end">End of paper</p></article></div>';
    el.innerHTML = h;
    el.querySelectorAll('.sheet details').forEach(function (d, i) { if (openSol[i]) d.open = true; });
    if (keepScroll) window.scrollTo(0, y);
    else { var r = el.querySelector('.ex-res'); r.setAttribute('tabindex', '-1'); r.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }
  function weakest(t) { var best = null, lo = 2; Object.keys(t.topics).forEach(function (k) { var x = t.topics[k]; if (x.o && x.g / x.o < lo && x.g / x.o < 0.75) { lo = x.g / x.o; best = k; } }); return best; }

  /* ── Events ────────────────────────────────────────────────── */
  function wire() {
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-group] .pill');
      if (b && !b.disabled) {
        var g = b.closest('[data-group]');
        if (g.hasAttribute('data-one')) g.querySelectorAll('.pill').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        else b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        summary(); return;
      }
      var inc = e.target.closest('[data-inc],[data-inc-mm]');
      if (inc) {
        var box = el.querySelector(inc.hasAttribute('data-inc') ? '#ex-n' : '#ex-mm'), d = +(inc.dataset.inc || inc.dataset.incMm);
        box.value = Math.max(+box.min, Math.min(+box.max, (+box.value || 0) + d)); snapFields(); summary(); return;
      }
      var ph = e.target.closest('[data-photo]'); if (ph) return pickPhoto(ph.dataset.photo);
      var a = e.target.closest('[data-ex]'); if (!a) return;
      var act = a.dataset.ex;
      if (act === 'finish') finish(false);
      else if (act === 'resume') { photos = {}; paper(SN.readJSON(curKey(), null)); }
      else if (act === 'code') openCode(el.querySelector('#ex-code').value);
      else if (act === 'all' || act === 'none') { el.querySelectorAll('[data-group="t"] .pill').forEach(function (p) { p.setAttribute('aria-pressed', act === 'all' ? 'true' : 'false'); }); summary(); }
      else if (act === 'defaults') { try { localStorage.removeItem(prefsKey()); } catch (x) {} setup(); }
      else if (act === 'first-blank') { var cur2 = collect(), first = null; eachItem(cur2, function (p, id) { if (!first && !answered(cur2.answers[id]) && !photos[id]) first = id; });
        var tgt = first && (el.querySelector('#' + first) || el.querySelector('[name="' + first + '"]') || el.querySelector('[data-fill="' + first + '"]'));
        if (tgt) { tgt.scrollIntoView({ block: 'center' }); tgt.focus({ preventScroll: true }); } }
      else if (act === 'new') api.open('exam', null, true);
      else if (act === 'print') { collect(); window.print(); }
      else if (act === 'copy') {
        var cur = SN.readJSON(curKey(), null), url = location.origin + location.pathname + '?y=' + api.year + '#v=exam&code=' + cur.code;
        (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { a.textContent = 'Link copied'; }, function () { a.textContent = url; });
      } else if (act === 'revise') api.goTopic(a.dataset.topicId);
    });
    el.addEventListener('submit', function (e) { e.preventDefault(); snapFields(); start(readForm(), true); });
    el.addEventListener('focusout', function (e) { if (e.target.id === 'ex-n' || e.target.id === 'ex-mm') { snapFields(); summary(); } });
    el.addEventListener('change', function (e) {
      var s = e.target.closest('[data-self]');
      if (s) {
        var cur = SN.readJSON(curKey(), null), m = cur.marks[s.dataset.self];
        if (s.type === 'radio') m.self = m.self.map(function (_, i) { return i === +s.dataset.i; }); else m.self[+s.dataset.i] = s.checked;
        SN.writeJSON(curKey(), cur); saveHistory(cur);
        results(cur, true);
        var again = el.querySelector('[data-self="' + s.dataset.self + '"][data-i="' + s.dataset.i + '"]'); if (again) again.focus({ preventScroll: true });
        return;
      }
      if (el.querySelector('.ex-bar')) { var c = collect(); if (c) countAnswered(c); }
    });
    el.addEventListener('input', function (e) { if (e.target.id === 'ex-n' || e.target.id === 'ex-mm') summary(); if (el.querySelector('.ex-bar')) { clearTimeout(el._t); el._t = setTimeout(function () { var c = collect(); if (c) countAnswered(c); }, 400); } });
  }
  function pickPhoto(id) {
    var f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*'; f.capture = 'environment';
    f.onchange = function () {
      var file = f.files[0]; if (!file) return;
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var k = Math.min(1, 1400 / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
        photos[id] = c.toDataURL('image/jpeg', 0.8); URL.revokeObjectURL(url);
        var out = el.querySelector('[data-photo-out="' + id + '"]');
        if (out) out.innerHTML = '<img src="' + photos[id] + '" alt="Your photo"> Added. It’s only used for marking and isn’t saved.';
        var cur = collect(); if (cur) countAnswered(cur);
      };
      img.src = url;
    };
    f.click();
  }

  SubjectApp.addView({
    id: 'exam', label: 'Practice exam', icon: 'paper', featured: true,
    desc: function () { return 'A paper laid out like your class tests, built from exam-style questions, then marked against a marking scheme'; },
    available: function (Yy) { return !!((Yy.examq && Yy.examq.length) || Object.keys(Yy.quizzes || {}).length); },
    render: function (target, a, params) {
      var fresh = el !== target;
      api = a; cfg = a.cfg; Y = a.Y; el = target;
      if (fresh) wire();
      setup(params);
    },
    leave: function () { stopTimer(); calcBack(); if (el && el.querySelector('.ex-bar')) collect(); }
  });
})();
