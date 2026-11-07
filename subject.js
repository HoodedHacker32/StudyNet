/* StudyNet — shared subject page engine.
   A subject page is a thin shell: it loads shared.js, this file and data/<subject>.js,
   then calls SubjectApp.start(SN_DATA.<subject>).
   Views: Topics -> a topic's activities -> one activity (tabs switch between activities).
   The URL hash (#t=<topic>&m=<activity>) records the view, so Back works and the
   dashboard can link straight to where the student left off.

   Data shape (per year, see data/*.js):
     { blurb, exam, store, score, topics:[{id,label,icon,desc, notes,fc,quiz,match,tl,prac}],
       notes:{key:{label,sections:[{h,p,list,ol,kv,tip}]}},
       decks:{key:{label,cards:[{front,back,sub}]}},
       quizzes:{key:{label,questions:[{q | b,h,a, ans:[...], opts?:[wrong...]}], distractors?:fn}},
       matches:{key:{label,colL,colR,pairs:[{left,right}]}},
       timelines:{key:{label,nodes:[{year,event}]}},
       practice:{key:{label,intro,type:'lines'|'table', items|cols+rows, rule?, ref?, hintBefore?}} } */
(function () {
  'use strict';
  var ic = SN.ic, esc = SN.escHtml;

  /* ── Answer checking ───────────────────────────────────────── */
  // Case, accents (fadas / accents), punctuation and extra spaces are ignored.
  // Signs, subscripts and maths symbols are kept apart so "+1"/"−1", "CO₂"/"CO" and "×"/"÷" stay different.
  function norm(s) {
    return String(s).toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae')
      .replace(/^\s*\+/, 'plus ').replace(/^\s*[-−]/, 'minus ')
      .replace(/×/g, ' times ').replace(/÷/g, ' over ').replace(/→/g, ' to ')
      .normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  }
  function chk(v, ans) { var n = norm(v); return !!n && ans.some(function (a) { return norm(a) === n; }); }

  /* Forgiving spelling (subjects where spelling isn't what's being tested, e.g. Science, History).
     An answer counts if it is one or two letters off, or sounds the same read aloud.
     Short words, numbers and symbols (Na/Ne, CO₂) are never loosened. */
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
        i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1] ? d[i - 2][j - 2] + 1 : Infinity);
    return d[m][n];
  }
  function sound(s) {
    return s.replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/c(?=[eiy])/g, 's').replace(/[cq]/g, 'k').replace(/x/g, 'ks')
      .replace(/z/g, 's').replace(/y/g, 'i').replace(/(\w)\1+/g, '$1').replace(/\B[aeiou]+/g, 'a').replace(/\s+/g, '');
  }
  // Real words that are one or two letters from a course term but mean something else. A typed answer that is
  // one of these (or any other answer in the subject) is never "close enough".
  var CONFUSABLE = ('neuron neurons photon photons proton protons neutron neutrons electron electrons election elections ion iron ' +
    'mitosis meiosis respiration perspiration inspiration expiration weathering withering erosion corrosion erupt eruption corruption ' +
    'artery arteries cartilage carriage condensation condemnation evaporation evacuation solution solutions pollution ' +
    'metal medal mettle petal mantel mantle mental magma margin trust crust core cure lava larva larvae ' +
    'compound compounds component mixture mixtures moisture filtration infiltration fixation friction fiction faction diffusion fusion ' +
    'colony colonies colon calorie calories celery reformation formation information deformation transformation ' +
    'plantation plantations planation explanation planter painter revolution evolution resolution revelation ' +
    'protestant protestants prostrate prostate catholic catholics glacier glaciers glazier').split(' ');
  var CONF = {}; CONFUSABLE.forEach(function (w) { CONF[w] = 1; });
  function closeWord(v, a) {
    if (v === a) return true;
    if (/\d/.test(v + a) || a.length < 5) return false;
    if (CONF[v] && v !== a) return false;
    if (v[0] !== a[0] && sound(v)[0] !== sound(a)[0]) return false; // a misspelling nearly always keeps the first letter or sound
    var allow = a.length < 8 ? 1 : 2;
    return lev(v, a) <= allow || (a.length >= 5 && sound(v) === sound(a));
  }
  var vocab = null; // every answer in the subject, so a different real term ("neuron" for "neutron") is never "close enough"
  function isOtherTerm(n, ans) {
    if (!vocab) return false;
    return vocab[n] && !ans.some(function (a) { return norm(a) === n; });
  }
  // { ok, exact }: lenient matching only when asked for.
  function match(v, ans, lenient) {
    var n = norm(v);
    if (!n) return { ok: false };
    if (ans.some(function (a) { return norm(a) === n; })) return { ok: true, exact: true };
    if (!lenient || isOtherTerm(n, ans)) return { ok: false };
    return { ok: ans.some(function (a) {
      var A = norm(a), vw = n.split(' '), aw = A.split(' ');
      if (vw.length === aw.length && vw.length > 1) return aw.every(function (w, i) { return w === vw[i] || closeWord(vw[i], w); });
      return closeWord(n, A);
    }), exact: false };
  }
  // Four options: the answer plus plausible wrong ones (explicit, then smart, then other answers in the set).
  function quizOptions(set, q) {
    var taken = q.ans.map(norm), picks = [];
    function add(c) { var n = norm(c); if (c && taken.indexOf(n) < 0) { taken.push(n); picks.push(c); } }
    (q.opts ? SN.shuffle(q.opts) : []).forEach(function (c) { if (picks.length < 3) add(c); });
    if (picks.length < 3 && set.distractors) set.distractors(q).forEach(function (c) { if (picks.length < 3) add(c); });
    SN.shuffle(set.questions.map(function (x) { return x.ans[0]; })).forEach(function (c) { if (picks.length < 3) add(c); });
    return SN.shuffle([q.ans[0]].concat(picks));
  }
  function questionHtml(q) {
    if (q.q != null) return esc(q.q);
    return (q.b ? esc(q.b) + ' ' : '') + (q.h ? '<em>' + esc(q.h) + '</em>' : '') + (q.a ? ' ' + esc(q.a) : '');
  }

  var MODES = [
    { id: 'notes',      label: 'Notes',      icon: 'notes',    key: 'notes', src: 'notes' },
    { id: 'flashcards', label: 'Flashcards', icon: 'cards',    key: 'fc',    src: 'decks' },
    { id: 'quiz',       label: 'Quiz',       icon: 'quiz',     key: 'quiz',  src: 'quizzes' },
    { id: 'match',      label: 'Match',      icon: 'match',    key: 'match', src: 'matches' },
    { id: 'timeline',   label: 'Timeline',   icon: 'timeline', key: 'tl',    src: 'timelines' },
    { id: 'practice',   label: 'Practice',   icon: 'pencil',   key: 'prac',  src: 'practice' }
  ];
  function modeById(id) { return MODES.filter(function (m) { return m.id === id; })[0]; }
  // Subject-level tools shown above the topics (Practice exam, Periodic table…), added by other scripts.
  var VIEWS = [], WIDGETS = {};
  function viewById(id) { return VIEWS.filter(function (v) { return v.id === id; })[0]; }
  function viewsHere() { return VIEWS.filter(function (v) { return !v.available || v.available(Y, cfg); }); }

  /* ── State ─────────────────────────────────────────────────── */
  var cfg, subj, Y, yearKey, topics, topic = null, mode = null, view = null;
  function lenient() { return !!(cfg && cfg.marking && cfg.marking.spelling === 'lenient'); }
  var $ = function (id) { return document.getElementById(id); };

  /* ── Page skeleton ─────────────────────────────────────────── */
  function skeleton() {
    return '<main class="main" id="main"><div class="page">' +
      '<nav class="crumbs" aria-label="Breadcrumb" id="crumbs"></nav>' +

      '<div id="v-topics" class="view">' +
        '<header class="ph"><div class="ph-title">' + (subj ? SN.logo(subj, 'lg') : '') + '<h1 id="topics-h" tabindex="-1">' + esc(cfg.title) + '</h1></div><p id="blurb"></p>' +
          '<div class="ph-row"><span class="chip"><span id="score-l">Practice score</span> <b class="num" id="score">—</b></span>' +
          (cfg.calculator ? '<button type="button" class="btn" data-calc aria-pressed="false">' + ic('calc') + ' Calculator</button>' : '') +
          '<div class="seg hidden" id="years" role="group" aria-label="Which year’s content"></div></div>' +
          '<p class="exam hidden" id="exam"></p></header>' +
        '<div id="notices"></div>' +
        '<section id="tools-sec" class="hidden"><h2 class="h2">Exam practice</h2><div class="rows" id="tool-rows"></div></section>' +
        '<section><h2 class="h2">Topics</h2><div class="rows" id="topic-rows"></div></section>' +
      '</div>' +

      '<div id="v-tool" class="view hidden"></div>' +

      '<div id="v-acts" class="view hidden">' +
        '<header class="ph"><h1 id="t-title" tabindex="-1"></h1><p id="t-desc"></p></header>' +
        '<div class="acts" id="acts"></div>' +
      '</div>' +

      '<div id="v-act" class="view hidden">' +
        '<h1 class="sr-only" id="act-h" tabindex="-1"></h1>' +
        '<div class="tabs" role="tablist" id="tabs"></div>' +
        '<div role="tabpanel" id="panel" aria-labelledby="">' +
          '<div class="pills" id="pills"></div>' +

          '<div data-panel="notes" class="notes" id="notes-body"></div>' +

          '<div data-panel="flashcards" class="fc-wrap">' +
            '<div class="progress"><i id="fc-prog" style="width:0%"></i></div>' +
            '<div class="fc-scene" id="fc-scene" role="button" tabindex="0" aria-label="Flashcard. Press Enter or Space to flip; arrow keys for previous and next.">' +
              '<div class="fc-card" id="fc-card">' +
                '<div class="fc-face fc-front"><div class="fc-main" id="fc-front"></div><div class="fc-sub" id="fc-sub"></div><div class="fc-hint">Tap or press Space to flip</div></div>' +
                '<div class="fc-face fc-back" aria-hidden="true"><div class="fc-main" id="fc-back"></div></div>' +
              '</div>' +
            '</div>' +
            '<div class="fc-controls">' +
              '<button type="button" class="btn" id="fc-prev">' + ic('arrow-left') + ' Previous</button>' +
              '<span class="fc-counter num" id="fc-count"></span>' +
              '<button type="button" class="btn" id="fc-next">Next ' + ic('arrow-right') + '</button>' +
            '</div>' +
          '</div>' +

          '<div data-panel="quiz"><div class="quiz">' +
            '<div id="quiz-live">' +
              '<div class="quiz-head"><b id="quiz-title"></b><span class="num" id="quiz-count"></span></div>' +
              '<div class="progress"><i id="quiz-prog" style="width:0%"></i></div>' +
              '<div class="quiz-body"><div class="quiz-q" id="quiz-q"></div><div class="opts" id="opts"></div></div>' +
              '<div class="quiz-foot"><span class="quiz-fb" id="quiz-fb" role="status"></span><button type="button" class="btn primary hidden" id="quiz-next"></button></div>' +
            '</div>' +
            '<div class="result hidden" id="quiz-result" role="status"><h3 class="num" id="res-score"></h3><p id="res-msg"></p><button type="button" class="btn" id="quiz-retry">' + ic('reset') + ' Try again</button></div>' +
          '</div></div>' +

          '<div data-panel="match"><div class="match" id="match"></div><div class="done hidden" id="match-done" role="status"></div></div>' +

          '<div data-panel="timeline">' +
            '<div class="tl-status"><span>Drag an event onto its year, or tap an event and then its year.</span><span class="num" id="tl-count" role="status"></span></div>' +
            '<div class="tl-visual"><div class="tl-nodes" id="tl-nodes"></div></div>' +
            '<div id="tl-done"></div>' +
            '<div class="tl-tray-label">Events to place</div><div class="tl-tray" id="tl-tray"></div>' +
          '</div>' +

          '<div data-panel="practice" id="prac"></div>' +
          MODES.filter(function (m) { return m.init; }).map(function (m) { return '<div data-panel="' + m.id + '" id="panel-' + m.id + '"></div>'; }).join('') +
        '</div>' +
      '</div>' +

      '<footer class="foot"><span>Progress is saved in this browser.</span><a href="index.html">Back to all subjects</a></footer>' +
    '</div></main>';
  }

  /* ── Year selection ────────────────────────────────────────── */
  // 1st Year mode sees 1st Year content; 2nd Year mode sees 1st and 2nd Year (2nd by default).
  function allowedYears() {
    var p = SN.getProfile(), have = Object.keys(cfg.years);
    var allowed = have.filter(function (y) { return y <= p.yearMode; });
    return { mode: p.yearMode, allowed: allowed.length ? allowed : have, outOfYear: !allowed.length };
  }
  function pickYear() {
    var a = allowedYears();
    var q = (location.search.match(/[?&]y=(\d)/) || [])[1];
    if (q && a.allowed.indexOf(q) >= 0) return q;
    var saved = null;
    try { saved = sessionStorage.getItem('sn_view_' + cfg.id); } catch (e) {}
    if (saved && a.allowed.indexOf(saved) >= 0) return saved;
    return a.allowed[a.allowed.length - 1];
  }

  function renderNotices() {
    var p = SN.getProfile(), out = [];
    var settings = '<button type="button" class="link" data-sn="settings">Settings</button>';
    if (cfg.exemptType === 'irish' && p.exempt === 'irish')
      out.push('You have an <b>Irish exemption</b>, so Gaeilge isn’t on your dashboard. You can still practise here, or change it in ' + settings + '.');
    if (cfg.lang) {
      if (p.exempt === 'language') out.push('You have a <b>modern language exemption</b>, so ' + esc(cfg.title) + ' isn’t on your dashboard. You can still practise here, or change it in ' + settings + '.');
      else if (p.lang && p.lang !== cfg.lang) out.push(esc(cfg.title) + ' isn’t your chosen language, so it isn’t on your dashboard. You can change your language in ' + settings + '.');
    }
    var a = allowedYears();
    if (a.outOfYear) out.push(esc(cfg.title) + ' only has <b>' + SN.YEAR_NAMES[yearKey] + '</b> content so far, and you’re set to ' + SN.YEAR_NAMES[a.mode] + '. You can change your year in ' + settings + '.');
    $('notices').innerHTML = out.map(function (t) { return '<div class="notice" role="note">' + ic('info') + '<div>' + t + '</div></div>'; }).join('');
  }
  function renderYears() {
    var a = allowedYears(), el = $('years');
    el.classList.toggle('hidden', a.allowed.length < 2);
    el.innerHTML = a.allowed.map(function (y) {
      return '<button type="button" data-year="' + y + '" aria-pressed="' + (y === yearKey) + '">' + SN.YEAR_NAMES[y] + '</button>';
    }).join('');
  }

  /* ── Topics ────────────────────────────────────────────────── */
  function keysOf(src) { return Object.keys(Y[src] || {}); }
  function buildTopics() {
    var all = { id: 'all', label: 'All topics', icon: 'books', desc: 'Every activity in ' + SN.YEAR_NAMES[yearKey] + ' ' + cfg.title };
    MODES.forEach(function (m) { all[m.key] = keysOf(m.src); });
    topics = (Y.topics || []).map(function (t) {
      var c = Object.assign({}, t);
      MODES.forEach(function (m) { c[m.key] = (c[m.key] || []).filter(function (k) { return Y[m.src] && Y[m.src][k]; }); });
      return c;
    }).concat([all]);
  }
  function has(t, m) { return t[m.key] && t[m.key].length > 0; }
  function topicById(id) { return topics.filter(function (t) { return t.id === id; })[0]; }

  function countFor(t, m) {
    var n;
    if (m.count) return m.count(t, Y);
    if (m.id === 'flashcards') { n = t.fc.reduce(function (s, k) { return s + Y.decks[k].cards.length; }, 0); return n + ' card' + (n !== 1 ? 's' : ''); }
    if (m.id === 'quiz') { n = t.quiz.reduce(function (s, k) { return s + Y.quizzes[k].questions.length; }, 0); return n + ' question' + (n !== 1 ? 's' : ''); }
    if (m.id === 'practice') { n = t.prac.reduce(function (s, k) { return s + inputsOf(k).length; }, 0); return n + ' answer' + (n !== 1 ? 's' : ''); }
    n = t[m.key].length;
    var word = { notes: 'page', match: 'set', timeline: 'timeline' }[m.id];
    return n + ' ' + word + (n !== 1 ? 's' : '');
  }

  function renderTopics() {
    var vs = viewsHere();
    $('tools-sec').classList.toggle('hidden', !vs.length);
    $('tool-rows').innerHTML = vs.map(function (v) {
      return '<button type="button" class="row' + (v.featured ? ' featured' : '') + '" data-view="' + v.id + '">' +
        '<span class="row-ic">' + ic(v.icon) + '</span>' +
        '<span class="row-body"><span class="row-title">' + esc(v.label) + '</span>' +
        '<span class="row-desc">' + (v.desc ? (typeof v.desc === 'function' ? v.desc(Y, cfg) : esc(v.desc)) : '') + '</span></span>' + ic('chevron-right', 'icon row-chev') + '</button>';
    }).join('');
    $('topic-rows').innerHTML = topics.map(function (t) {
      var tags = MODES.filter(function (m) { return has(t, m); }).map(function (m) { return '<span class="tag">' + m.label + '</span>'; }).join('');
      return '<button type="button" class="row" data-topic="' + t.id + '">' +
        '<span class="row-ic">' + ic(t.icon) + '</span>' +
        '<span class="row-body"><span class="row-title">' + esc(t.label) + '</span>' +
        (t.desc ? '<span class="row-desc">' + esc(t.desc) + '</span>' : '') +
        '<span class="row-tags">' + tags + '</span></span>' + ic('chevron-right', 'icon row-chev') + '</button>';
    }).join('');
  }
  function renderActs() {
    $('t-title').textContent = topic.label;
    $('t-desc').textContent = topic.desc || '';
    $('acts').innerHTML = MODES.filter(function (m) { return has(topic, m); }).map(function (m) {
      return '<button type="button" class="act" data-mode="' + m.id + '">' + ic(m.icon) +
        '<span class="act-name">' + m.label + '</span><span class="act-count">' + countFor(topic, m) + '</span></button>';
    }).join('');
  }
  function renderTabs() {
    $('tabs').innerHTML = MODES.filter(function (m) { return has(topic, m); }).map(function (m) {
      var on = m.id === mode;
      return '<button type="button" class="tab" role="tab" id="tab-' + m.id + '" data-mode="' + m.id + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '">' + ic(m.icon) + m.label + '</button>';
    }).join('');
    $('panel').setAttribute('aria-labelledby', 'tab-' + mode);
    var on = $('tab-' + mode), bar = $('tabs');
    if (on && bar.scrollWidth > bar.clientWidth) bar.scrollLeft = Math.max(0, on.offsetLeft - (bar.clientWidth - on.offsetWidth) / 2); // keep the active tab visible on phones
  }
  function renderCrumbs() {
    var c = '<a href="index.html">Home</a>' + ic('chevron-right', 'icon sep');
    if (view) c += '<button type="button" data-go="topics">' + esc(cfg.title) + '</button>' + ic('chevron-right', 'icon sep') + '<span aria-current="page">' + esc(view.label) + '</span>';
    else if (!topic) c += '<span aria-current="page">' + esc(cfg.title) + '</span>';
    else {
      c += '<button type="button" data-go="topics">' + esc(cfg.title) + '</button>' + ic('chevron-right', 'icon sep');
      if (!mode) c += '<span aria-current="page">' + esc(topic.label) + '</span>';
      else c += '<button type="button" data-go="acts">' + esc(topic.label) + '</button>' + ic('chevron-right', 'icon sep') + '<span aria-current="page">' + modeById(mode).label + '</span>';
    }
    $('crumbs').innerHTML = c;
  }

  /* ── Navigation ────────────────────────────────────────────── */
  function hashFor(t, m) { return t ? '#t=' + t.id + (m ? '&m=' + m : '') : ''; }
  function readHash() {
    var h = location.hash.replace(/^#/, ''), o = {};
    h.split('&').forEach(function (kv) { var p = kv.split('='); if (p[0]) o[p[0]] = decodeURIComponent(p[1] || ''); });
    return o;
  }
  // Show a view and push it to history (so the browser Back button walks back up).
  function go(t, m, replace, fromTab) {
    var url = location.pathname + location.search + hashFor(t, m);
    if (url !== location.pathname + location.search + location.hash) history[replace ? 'replaceState' : 'pushState'](null, '', url);
    show(t, m);
    // Move keyboard / screen-reader focus to the new view.
    var target = fromTab ? $('tab-' + m) : !t ? $('topics-h') : !m ? $('t-title') : $('act-h');
    if (target) target.focus({ preventScroll: true });
  }
  function openView(id, params, replace) {
    var url = location.pathname + location.search + '#v=' + id + (params ? '&' + params : '');
    if (url !== location.pathname + location.search + location.hash) history[replace ? 'replaceState' : 'pushState'](null, '', url);
    fromHash();
    var h = $('v-tool').querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  function show(t, m, v, params) {
    if (m && (!t || !has(t, modeById(m) || {}))) m = null;
    if (v && viewsHere().indexOf(v) < 0) v = null;
    if (view && view !== v && view.leave) view.leave();
    view = v || null;
    topic = view ? null : t || null; mode = topic ? m || null : null;
    $('v-topics').classList.toggle('hidden', !!topic || !!view);
    $('v-acts').classList.toggle('hidden', !topic || !!mode);
    $('v-act').classList.toggle('hidden', !mode);
    $('v-tool').classList.toggle('hidden', !view);
    ['v-topics', 'v-acts', 'v-act', 'v-tool'].forEach(function (id) { var v = $(id); v.classList.remove('view'); void v.offsetWidth; v.classList.add('view'); });
    renderCrumbs();
    document.title = (view ? view.label + ' · ' : '') + (mode ? modeById(mode).label + ' · ' : '') + (topic ? topic.label + ' · ' : '') + cfg.title + ' · StudyNet';
    if (view) { view.render($('v-tool'), api, params || {}); window.scrollTo(0, 0); return; }
    $('v-tool').innerHTML = '';
    if (!topic) { renderTopics(); updateScore(); }
    else if (!mode) renderActs();
    else {
      $('act-h').textContent = modeById(mode).label + ': ' + topic.label;
      renderTabs();
      document.querySelectorAll('[data-panel]').forEach(function (p) { p.classList.toggle('hidden', p.dataset.panel !== mode); });
      initMode(mode);
      SN.writeJSON('sn_last', { subject: cfg.id, year: yearKey, topic: topic.id, topicLabel: topic.label, mode: mode, at: Date.now() });
    }
    window.scrollTo(0, 0);
  }
  function fromHash() {
    var h = readHash();
    show(h.t ? topicById(h.t) : null, h.m || null, h.v ? viewById(h.v) : null, h);
  }

  // Set pills shared by every activity; hidden when there is only one set.
  function pills(keys, src, onPick) {
    var el = $('pills');
    el.classList.toggle('hidden', keys.length < 2);
    el.innerHTML = keys.map(function (k, i) {
      return '<button type="button" class="pill" data-set="' + k + '" aria-pressed="' + (i === 0) + '">' + esc(Y[src][k].label || k) + '</button>';
    }).join('');
    el.onclick = function (e) {
      var b = e.target.closest('.pill'); if (!b) return;
      el.querySelectorAll('.pill').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      onPick(b.dataset.set);
    };
    if (keys.length) onPick(keys[0]);
  }

  /* ── Notes ─────────────────────────────────────────────────── */
  function renderNotes(k) {
    var h = '';
    Y.notes[k].sections.forEach(function (s) {
      h += '<section class="note">';
      if (s.h) h += '<h3>' + s.h + '</h3>';
      (s.p || []).forEach(function (p) { h += '<p>' + p + '</p>'; });
      if (s.list) h += '<ul>' + s.list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
      if (s.ol) h += '<ol>' + s.ol.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
      if (s.kv) h += '<dl class="kv">' + s.kv.map(function (x) { return '<dt>' + x[0] + '</dt><dd>' + x[1] + '</dd>'; }).join('') + '</dl>';
      if (s.html) h += s.html;
      if (s.steps) h += stepsHtml(s.steps, s.q);
      if (s.widget) h += '<div class="widget" data-widget="' + s.widget + '"></div>';
      if (s.tip) h += '<p class="tip">' + s.tip + '</p>';
      h += '</section>';
    });
    var body = $('notes-body');
    body.innerHTML = h;
    mountWidgets(body);
  }
  function mountWidgets(box) {
    box.querySelectorAll('[data-widget]').forEach(function (el) { var w = WIDGETS[el.dataset.widget]; if (w) w(el, api); });
  }
  // A worked example revealed one step at a time.
  function stepsHtml(steps, q) {
    return '<div class="steps" data-steps>' + (q ? '<p class="steps-q">' + q + '</p>' : '') +
      '<ol aria-live="polite">' + steps.map(function (st, i) {
        var o = typeof st === 'string' ? { t: st } : st;
        return '<li' + (i ? ' class="hidden"' : '') + '>' + (o.h ? '<b>' + o.h + '</b> ' : '') + o.t + '</li>';
      }).join('') + '</ol>' +
      (steps.length > 1 ? '<div class="steps-ctl"><button type="button" class="btn" data-step="next">Show step 2 of ' + steps.length + ' ' + ic('arrow-right') + '</button>' +
        '<button type="button" class="link" data-step="all">Show all steps</button></div>' : '') + '</div>';
  }
  function stepClick(btn) {
    var box = btn.closest('[data-steps]'), hidden = box.querySelectorAll('li.hidden');
    if (btn.dataset.step === 'all') hidden.forEach(function (li) { li.classList.remove('hidden'); });
    else if (hidden[0]) hidden[0].classList.remove('hidden');
    var left = box.querySelectorAll('li.hidden').length, total = box.querySelectorAll('li').length;
    if (!left) {
      var c = box.querySelector('.steps-ctl'), last = box.querySelector('li:last-child');
      if (c && c.contains(document.activeElement)) { last.tabIndex = -1; last.focus(); }
      if (c) c.remove();
    } else { var nx = box.querySelector('[data-step="next"]'); nx.innerHTML = 'Show step ' + (total - left + 1) + ' of ' + total + ' ' + ic('arrow-right'); }
  }

  /* ── Flashcards ────────────────────────────────────────────── */
  var deck = [], fcIdx = 0;
  function loadDeck(k) { deck = Y.decks[k].cards; fcIdx = 0; renderCard(); }
  function renderCard() {
    var c = deck[fcIdx] || {};
    $('fc-card').classList.remove('flipped');
    $('fc-card').querySelector('.fc-front').setAttribute('aria-hidden', 'false');
    $('fc-card').querySelector('.fc-back').setAttribute('aria-hidden', 'true');
    var f = $('fc-front');
    f.textContent = c.front || '';
    f.classList.toggle('long', (c.front || '').length > 26);
    $('fc-sub').textContent = c.sub || '';
    $('fc-back').textContent = c.back || '';
    $('fc-count').textContent = (fcIdx + 1) + ' / ' + deck.length;
    $('fc-prog').style.width = Math.round((fcIdx + 1) / deck.length * 100) + '%';
  }
  function flip() {
    var c = $('fc-card'), on = c.classList.toggle('flipped');
    c.querySelector('.fc-front').setAttribute('aria-hidden', on ? 'true' : 'false');
    c.querySelector('.fc-back').setAttribute('aria-hidden', on ? 'false' : 'true');
    if (on) SN.markStudied();
  }
  function fcNav(d) { if (!deck.length) return; fcIdx = (fcIdx + d + deck.length) % deck.length; renderCard(); }

  /* ── Quiz ──────────────────────────────────────────────────── */
  var qKey, qPool = [], qCur = 0, qScore = 0;
  function loadQuiz(k) {
    qKey = k; qPool = SN.shuffle(Y.quizzes[k].questions); qCur = 0; qScore = 0;
    $('quiz-live').classList.remove('hidden');
    $('quiz-result').classList.add('hidden');
    $('quiz-title').textContent = Y.quizzes[k].label;
    renderQ();
  }
  function renderQ() {
    if (qCur >= qPool.length) return showResults();
    var q = qPool[qCur];
    $('quiz-count').textContent = (qCur + 1) + ' / ' + qPool.length;
    $('quiz-prog').style.width = Math.round(qCur / qPool.length * 100) + '%';
    $('quiz-q').innerHTML = questionHtml(q);
    var grid = $('opts');
    grid.innerHTML = '';
    quizOptions(Y.quizzes[qKey], q).forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'opt'; b.textContent = o;
      b.addEventListener('click', function () { answer(b, o, q.ans); });
      grid.appendChild(b);
    });
    var fb = $('quiz-fb'); fb.textContent = ''; fb.className = 'quiz-fb';
    $('quiz-next').classList.add('hidden');
  }
  function answer(btn, chosen, ans) {
    SN.markStudied();
    var grid = $('opts'), fb = $('quiz-fb');
    grid.querySelectorAll('.opt').forEach(function (b) { b.disabled = true; });
    if (chk(chosen, ans)) { btn.classList.add('correct'); qScore++; fb.textContent = 'Correct!'; }
    else {
      btn.classList.add('wrong');
      grid.querySelectorAll('.opt').forEach(function (b) { if (chk(b.textContent, ans)) b.classList.add('correct'); });
      fb.textContent = 'Answer: ' + ans[0]; fb.className = 'quiz-fb bad';
    }
    var nx = $('quiz-next');
    nx.innerHTML = qCur < qPool.length - 1 ? 'Next ' + ic('arrow-right') : 'See results';
    nx.classList.remove('hidden');
    nx.focus();
  }
  function showResults() {
    $('quiz-live').classList.add('hidden');
    $('quiz-result').classList.remove('hidden');
    var pct = Math.round(qScore / qPool.length * 100);
    $('res-score').textContent = qScore + ' / ' + qPool.length;
    $('res-msg').textContent = pct === 100 ? 'Perfect score. Excellent work!' : pct >= 80 ? 'Great job, almost perfect.' :
      pct >= 60 ? 'Good effort. Keep practising!' : 'Keep going. Try the notes or flashcards, then have another go.';
    $('quiz-retry').focus();
  }

  /* ── Match ─────────────────────────────────────────────────── */
  var mSel = { left: null, right: null }, mLeft = 0, mKey;
  function loadMatch(k) {
    mKey = k;
    var set = Y.matches[k];
    mSel = { left: null, right: null }; mLeft = set.pairs.length;
    $('match-done').classList.add('hidden');
    function col(side, head) {
      return '<div class="match-col">' + (head ? '<div class="match-h">' + esc(head) + '</div>' : '') +
        SN.shuffle(set.pairs.map(function (_, i) { return i; })).map(function (i) {
          return '<button type="button" class="mt" data-i="' + i + '" data-side="' + side + '">' + esc(set.pairs[i][side]) + '</button>';
        }).join('') + '</div>';
    }
    $('match').innerHTML = col('left', set.colL) + col('right', set.colR);
  }
  function matchClick(b) {
    var side = b.dataset.side;
    if (mSel[side] === b) { b.classList.remove('selected'); mSel[side] = null; return; }
    if (mSel[side]) mSel[side].classList.remove('selected');
    b.classList.add('selected'); mSel[side] = b;
    if (!(mSel.left && mSel.right)) return;
    var l = mSel.left, r = mSel.right;
    mSel = { left: null, right: null };
    if (l.dataset.i === r.dataset.i) {
      SN.markStudied();
      [l, r].forEach(function (x) { x.classList.remove('selected'); x.classList.add('matched'); x.disabled = true; });
      if (--mLeft <= 0) {
        var d = $('match-done');
        d.innerHTML = 'All matched. Well done! <button type="button" class="btn" id="match-again">' + ic('reset') + ' Play again</button>';
        d.classList.remove('hidden');
        $('match-again').focus();
      } else {
        var nx = document.querySelector('#match .mt:not(:disabled)'); if (nx) nx.focus();
      }
    } else {
      [l, r].forEach(function (x) { x.classList.remove('selected'); x.classList.add('wrong'); });
      setTimeout(function () { [l, r].forEach(function (x) { x.classList.remove('wrong'); }); }, 450);
    }
  }

  /* ── Timeline ──────────────────────────────────────────────── */
  var tlKey, tlPlaced = 0, tlSel = null, tlTimer;
  function tlCount(msg) {
    var n = Y.timelines[tlKey].nodes.length, base = tlPlaced + ' / ' + n + ' placed';
    $('tl-count').textContent = msg || base;
    clearTimeout(tlTimer);
    if (msg) tlTimer = setTimeout(function () { $('tl-count').textContent = tlPlaced + ' / ' + n + ' placed'; }, 1400);
  }
  function tlSelect(card) {
    if (tlSel) tlSel.setAttribute('aria-pressed', 'false');
    tlSel = tlSel === card ? null : card;
    if (tlSel) tlSel.setAttribute('aria-pressed', 'true');
    $('tl-nodes').classList.toggle('picking', !!tlSel);
  }
  function tlPlace(drop, cardId) {
    if (drop.classList.contains('filled')) return;
    var card = document.querySelector('.tl-card[data-id="' + cardId + '"]');
    if (!card || card.classList.contains('placed')) return;
    var year = drop.dataset.year;
    if (card.dataset.year === year) {
      SN.markStudied();
      drop.textContent = card.textContent;
      drop.classList.add('filled'); drop.disabled = true;
      drop.setAttribute('aria-label', drop.dataset.label + ': ' + card.textContent);
      drop.parentNode.classList.add('filled');
      if (tlSel === card) tlSelect(card);
      card.classList.add('placed');
      tlPlaced++; tlCount();
      if (tlPlaced === Y.timelines[tlKey].nodes.length) {
        $('tl-done').innerHTML = '<div class="done" role="status" style="margin-bottom:1.25rem">Timeline complete! <button type="button" class="btn" id="tl-again">' + ic('reset') + ' Try again</button></div>';
        $('tl-again').focus();
      } else { var nx = document.querySelector('.tl-card:not(.placed)'); if (nx) nx.focus(); }
    } else {
      drop.classList.add('wrong');
      setTimeout(function () { drop.classList.remove('wrong'); }, 400);
      tlCount('Not ' + drop.dataset.label + '. Try another year.');
    }
  }
  function loadTimeline(k) {
    tlKey = k; tlPlaced = 0; tlSel = null;
    var set = Y.timelines[k];
    $('tl-done').innerHTML = '';
    $('tl-nodes').classList.remove('picking');
    $('tl-nodes').innerHTML = set.nodes.slice().sort(function (a, b) { return a.year - b.year; }).map(function (n) {
      var label = n.label || n.year;
      return '<div class="tl-node"><button type="button" class="tl-drop" data-year="' + n.year + '" data-label="' + esc(label) + '" aria-label="Place the selected event at ' + esc(label) + '">Drop here</button>' +
        '<div class="tl-dot"></div><div class="tl-year num">' + esc(label) + '</div></div>';
    }).join('');
    $('tl-tray').innerHTML = SN.shuffle(set.nodes.map(function (n, i) { return { n: n, i: i }; })).map(function (o) {
      return '<button type="button" class="tl-card" draggable="true" data-year="' + o.n.year + '" data-id="e' + o.i + '" aria-pressed="false">' + esc(o.n.event) + '</button>';
    }).join('');
    tlCount();
  }

  /* ── Practice ──────────────────────────────────────────────── */
  function loadStore() {
    var s = SN.readJSON(Y.store, null);
    if (!s || typeof s !== 'object') s = {};
    if (!s.inputs || typeof s.inputs !== 'object') s.inputs = {};
    return s;
  }
  // Every scorable input in a set: [{id, ans}]
  function inputsOf(k) {
    var set = Y.practice[k], out = [];
    if (set.type === 'table') set.rows.forEach(function (row) { row.forEach(function (c) { if (c && c.ans) out.push({ id: k + '_' + c.k, ans: c.ans }); }); });
    else set.items.forEach(function (it, i) { out.push({ id: k + '_' + i, ans: it.ans }); });
    return out;
  }
  function pchk(v, ans) { return match(v, ans, lenient()).ok; }
  function countSet(k, store) { return inputsOf(k).filter(function (x) { return pchk(store.inputs[x.id] || '', x.ans); }).length; }
  function updateScore() {
    var store = loadStore(), c = 0, t = 0;
    Object.keys(Y.practice || {}).forEach(function (k) { c += countSet(k, store); t += inputsOf(k).length; });
    var unit = null;
    MODES.forEach(function (m) { if (m.score && Y[m.src]) { var x = m.score(Y, api); c += x.c; t += x.t; unit = x.u; } });
    $('score').textContent = t ? c + ' / ' + t : '—';
    $('score-l').textContent = unit ? unit.charAt(0).toUpperCase() + unit.slice(1) : 'Practice score';
    if (t) SN.saveScore(Y.score, c, t, unit);
    document.querySelectorAll('[data-prac-count]').forEach(function (el) {
      var k = el.dataset.pracCount;
      el.textContent = countSet(k, store) + ' of ' + inputsOf(k).length + ' correct';
    });
  }
  function inputHtml(id, ans, saved, wide, label) {
    var ok = saved && pchk(saved, ans);
    return '<span class="inp-wrap"><input class="prac-inp' + (ok ? ' ok' : '') + (wide ? ' wide' : '') + '" data-id="' + esc(id) + '" type="text" value="' + esc(saved || '') +
      '" placeholder="&#8230;" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="' + esc(label || 'Answer') + '">' +
      (ok ? tickHtml() : '') + '</span>';
  }
  function tickHtml() { return '<span class="prac-tick" role="img" aria-label="Correct">' + SN.icon('check') + '</span>'; }
  function ansHtml(saved, ans) {
    if (!saved) return '';
    var r = match(saved, ans, lenient());
    if (r.ok && !r.exact) return '<span class="prac-ans ok" role="status">Accepted. Spelling: <b>' + esc(ans[0]) + '</b></span>';
    return r.ok ? '' : '<span class="prac-ans" role="status">Not quite. Answer: <b>' + esc(ans[0]) + '</b></span>';
  }
  function tableHtml(cols, rows, k, store, cls) {
    var h = '<div class="tbl-wrap"><table class="tbl ' + (cls || '') + '"><thead><tr>' +
      cols.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
    rows.forEach(function (row) {
      h += '<tr>' + row.map(function (c, ci) {
        if (c == null) return '<td></td>';
        if (typeof c === 'string') return ci === 0 ? '<th scope="row">' + esc(c) + '</th>' : '<td>' + esc(c) + '</td>';
        if (c.dim) return '<td class="dim">' + esc(c.dim) + '</td>';
        if (c.na) return '<td class="dim" title="' + esc(c.title || '') + '">' + esc(c.na) + '</td>';
        var id = k + '_' + c.k, sv = store ? store.inputs[id] || '' : '';
        var lbl = (typeof row[0] === 'string' ? row[0] : '') + ', ' + (cols[ci] || '');
        return '<td>' + inputHtml(id, c.ans, sv, false, lbl) + ansHtml(sv, c.ans) + '</td>';
      }).join('') + '</tr>';
    });
    return h + '</tbody></table></div>';
  }
  function buildPracSet(k) {
    var set = Y.practice[k], store = loadStore(), h = '<div class="prac-top">';
    h += '<p class="prac-intro">' + esc(set.intro || 'Fill in the answers.') + ' Press Enter or tap Check to mark your answers.</p>';
    h += '<span class="prac-count" data-prac-count="' + k + '"></span>';
    if (set.ref) h += '<button type="button" class="btn" data-ref aria-expanded="false">Show reference table</button>';
    h += '<button type="button" class="btn primary" data-check>' + ic('check') + ' Check answers</button>';
    h += '<button type="button" class="btn" data-reset="' + k + '">' + ic('reset') + ' Reset</button></div>';
    if (set.ref) h += '<div class="ref-wrap">' + tableHtml(set.ref.cols, set.ref.rows, k, null, 'ref') + '</div>';
    if (set.rule) h += '<div class="rule-box">' + set.rule + '</div>';
    if (set.type === 'table') h += tableHtml(set.cols, set.rows, k, store);
    else set.items.forEach(function (it, i) {
      var id = k + '_' + i, sv = store.inputs[id] || '', line;
      var inp = inputHtml(id, it.ans, sv, it.wide || (it.ans[0] || '').length > 14, 'Answer ' + (i + 1));
      var hint = it.h || it.tip ? '<span class="prac-hint">' + esc(it.h || it.tip) + '</span>' : '';
      if (it.q != null) {
        var parts = String(it.q).split('___');
        line = esc(parts[0]) + ' ' + inp + ' ' + esc(parts.slice(1).join('___')) + (hint ? ' ' + hint : '');
      } else if (set.hintBefore) line = (it.b ? esc(it.b) + ' ' : '') + hint + ' ' + inp + ' ' + esc(it.a || '');
      else line = (it.b ? esc(it.b) + ' ' : '') + inp + ' ' + hint + ' ' + esc(it.a || '');
      h += '<div class="prac-q"><span class="prac-num">' + (i + 1) + '.</span> ' + line + ' ' + ansHtml(sv, it.ans) + '</div>';
    });
    $('prac').innerHTML = h;
    updateScore();
  }
  function findAns(id) {
    var hit = null;
    Object.keys(Y.practice).some(function (k) { return inputsOf(k).some(function (x) { if (x.id === id) { hit = x.ans; return true; } return false; }); });
    return hit;
  }
  function checkInput(inp) {
    var id = inp.dataset.id, val = inp.value.trim(), ans = findAns(id);
    if (!ans) return;
    var holder = inp.closest('td') || inp.closest('.prac-q'), old = holder.querySelector('.prac-ans'), tick = holder.querySelector('.prac-tick');
    if (!val) { inp.classList.remove('ok', 'err'); if (old) old.remove(); if (tick) tick.remove(); return; }
    var store = loadStore();
    if (store.inputs[id] === val) return; // unchanged: don't re-flash on blur
    store.inputs[id] = val;
    SN.writeJSON(Y.store, store);
    SN.markStudied();
    if (old) old.remove();
    if (tick) tick.remove();
    if (pchk(val, ans)) { inp.classList.remove('err'); inp.classList.add('ok'); inp.insertAdjacentHTML('afterend', tickHtml()); holder.insertAdjacentHTML('beforeend', ansHtml(val, ans)); }
    else {
      inp.classList.remove('ok'); inp.classList.add('err');
      setTimeout(function () { inp.classList.remove('err'); }, 400);
      holder.insertAdjacentHTML('beforeend', ' ' + ansHtml(val, ans));
    }
    updateScore();
  }
  var resetTimer;
  function resetSet(btn, k) {
    if (!btn.dataset.armed) { // two-step so progress isn't lost by a stray click
      btn.dataset.armed = '1';
      btn.innerHTML = ic('reset') + ' Click again to clear';
      resetTimer = setTimeout(function () { delete btn.dataset.armed; btn.innerHTML = ic('reset') + ' Reset'; }, 3000);
      return;
    }
    clearTimeout(resetTimer);
    var store = loadStore();
    inputsOf(k).forEach(function (x) { delete store.inputs[x.id]; });
    SN.writeJSON(Y.store, store);
    buildPracSet(k);
  }

  var INIT = {
    notes: function () { pills(topic.notes, 'notes', renderNotes); },
    flashcards: function () { pills(topic.fc, 'decks', loadDeck); },
    quiz: function () { pills(topic.quiz, 'quizzes', loadQuiz); },
    match: function () { pills(topic.match, 'matches', loadMatch); },
    timeline: function () { pills(topic.tl, 'timelines', loadTimeline); },
    practice: function () { pills(topic.prac, 'practice', buildPracSet); }
  };
  function initMode(id) {
    if (INIT[id]) return INIT[id]();
    var m = modeById(id), el = $('panel-' + id);
    $('pills').classList.add('hidden');
    m.init(el, api, topic[m.key]);
  }

  /* ── Events (delegated) ────────────────────────────────────── */
  function wire() {
    document.addEventListener('click', function (e) {
      var t = e.target;
      var el;
      if ((el = t.closest('[data-topic]'))) return go(topicById(el.dataset.topic), null);
      if ((el = t.closest('[data-view]'))) return openView(el.dataset.view);
      if ((el = t.closest('[data-step]'))) return stepClick(el);
      if ((el = t.closest('[data-mode]'))) { var inTabs = !!t.closest('.tabs'); return go(topic, el.dataset.mode, inTabs, inTabs); }
      if ((el = t.closest('[data-go]'))) return go(el.dataset.go === 'topics' ? null : topic, null);
      if ((el = t.closest('#years button'))) { if (el.dataset.year !== yearKey) switchYear(el.dataset.year); return; }
      if ((el = t.closest('[data-reset]'))) return resetSet(el, el.dataset.reset);
      if (t.closest('[data-check]')) { $('prac').querySelectorAll('.prac-inp').forEach(checkInput); return; }
      if ((el = t.closest('[data-ref]'))) {
        var w = $('prac').querySelector('.ref-wrap'), open = w.classList.toggle('open');
        el.textContent = open ? 'Hide reference table' : 'Show reference table';
        el.setAttribute('aria-expanded', open ? 'true' : 'false');
        return;
      }
      if ((el = t.closest('.mt'))) return matchClick(el);
      if (t.closest('#match-again')) return loadMatch(mKey);
      if ((el = t.closest('.tl-card'))) return tlSelect(el);
      if ((el = t.closest('.tl-drop'))) { if (!tlSel) tlCount('Pick an event card first'); else tlPlace(el, tlSel.dataset.id); return; }
      if (t.closest('#tl-again')) return loadTimeline(tlKey);
    });
    document.addEventListener('dragstart', function (e) {
      var c = e.target.closest && e.target.closest('.tl-card'); if (!c) return;
      e.dataTransfer.setData('text/plain', c.dataset.id);
      setTimeout(function () { c.classList.add('dragging'); }, 0);
    });
    document.addEventListener('dragend', function (e) { if (e.target.classList) e.target.classList.remove('dragging'); });
    document.addEventListener('dragover', function (e) {
      var d = e.target.closest && e.target.closest('.tl-drop'); if (!d) return;
      e.preventDefault(); if (!d.classList.contains('filled')) d.classList.add('drag-over');
    });
    document.addEventListener('dragleave', function (e) { var d = e.target.closest && e.target.closest('.tl-drop'); if (d) d.classList.remove('drag-over'); });
    document.addEventListener('drop', function (e) {
      var d = e.target.closest && e.target.closest('.tl-drop'); if (!d) return;
      e.preventDefault(); d.classList.remove('drag-over'); tlPlace(d, e.dataTransfer.getData('text/plain'));
    });
    document.addEventListener('keydown', function (e) {
      var t = e.target;
      if (t.classList && t.classList.contains('prac-inp') && e.key === 'Enter') { e.preventDefault(); checkInput(t); return; }
      if (t.classList && t.classList.contains('tab') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab')), i = tabs.indexOf(t);
        var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        go(topic, n.dataset.mode, true, true);
        e.preventDefault(); return;
      }
      if (mode !== 'flashcards' || /INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.closest('.overlay')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); fcNav(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); fcNav(1); }
    });
    document.addEventListener('focusout', function (e) { if (e.target.classList && e.target.classList.contains('prac-inp')) checkInput(e.target); });
    var scene = $('fc-scene');
    scene.addEventListener('click', flip);
    SN.keyActivate(scene, flip);
    $('fc-prev').addEventListener('click', function () { fcNav(-1); });
    $('fc-next').addEventListener('click', function () { fcNav(1); });
    $('quiz-next').addEventListener('click', function () { qCur++; renderQ(); var f = document.querySelector('#opts .opt'); if (f) f.focus(); });
    $('quiz-retry').addEventListener('click', function () { loadQuiz(qKey); var f = document.querySelector('#opts .opt'); if (f) f.focus(); });
    window.addEventListener('popstate', fromHash);
  }

  function switchYear(y) {
    try { sessionStorage.setItem('sn_view_' + cfg.id, y); } catch (e) {}
    var url = location.pathname + '?y=' + y;
    history.replaceState(null, '', url);
    load(y);
    show(null, null);
    var b = document.querySelector('#years [aria-pressed="true"]'); if (b) b.focus();
  }
  function load(y) {
    yearKey = y; Y = cfg.years[y];
    buildTopics();
    $('blurb').textContent = SN.YEAR_NAMES[y] + (cfg.subtitle && cfg.subtitle !== cfg.title ? ' · ' + cfg.subtitle : '');
    var ex = $('exam');
    ex.classList.toggle('hidden', !Y.exam);
    if (Y.exam) ex.innerHTML = ic('target') + '<span>' + Y.exam + '</span>';
    renderYears();
    renderNotices();
  }

  // What extra modes, tools and widgets get to work with.
  var api = {
    get cfg() { return cfg; }, get Y() { return Y; }, get year() { return yearKey; }, get subj() { return subj; },
    get topics() { return topics.filter(function (t) { return t.id !== 'all'; }); },
    norm: norm, check: chk, match: match, lenient: lenient, esc: esc, ic: ic,
    open: openView, home: function () { go(null, null); },
    goTopic: function (id, m) { go(topicById(id), m || null); },
    updateScore: function () { updateScore(); },
    mountWidgets: mountWidgets, stepsHtml: stepsHtml
  };
  function buildVocab() {
    vocab = {};
    function add(a) { (a || []).forEach(function (x) { var n = norm(x); if (n) vocab[n] = 1; }); }
    Object.keys(cfg.years).forEach(function (y) {
      var Z = cfg.years[y];
      Object.keys(Z.quizzes || {}).forEach(function (k) { Z.quizzes[k].questions.forEach(function (q) { add(q.ans); add(q.opts); }); });
      Object.keys(Z.practice || {}).forEach(function (k) {
        var set = Z.practice[k];
        if (set.type === 'table') set.rows.forEach(function (r) { r.forEach(function (c) { if (c && c.ans) add(c.ans); }); });
        else (set.items || []).forEach(function (it) { add(it.ans); });
      });
      Object.keys(Z.decks || {}).forEach(function (k) { Z.decks[k].cards.forEach(function (c) { add([c.front]); }); });
    });
  }

  window.SubjectApp = {
    norm: norm,
    check: chk,
    match: match,
    quizOptions: quizOptions,
    questionHtml: questionHtml,
    api: api,
    // Register before start(): a per-topic activity { id, label, icon, key, count(t,Y), init(el, api, keys) }
    addMode: function (m) { m.src = m.src || m.key; if (m.at != null) MODES.splice(m.at, 0, m); else MODES.push(m); },
    // A subject-level tool { id, label, icon, desc, available(Y,cfg), render(el, api, params), leave() }
    addView: function (v) { VIEWS.push(v); },
    addWidget: function (name, fn) { WIDGETS[name] = fn; },
    start: function (data) {
      if (!data) {
        SN.mountShell(null);
        document.body.insertAdjacentHTML('beforeend', '<main class="main"><div class="page"><div class="notice" role="alert">' + ic('info') +
          '<div><b>This subject didn\u2019t load.</b> Check your connection and <button type="button" class="link" onclick="location.reload()">reload the page</button>.</div></div></div></main>');
        return;
      }
      cfg = data; subj = SN.subject(cfg.id);
      buildVocab();
      document.documentElement.setAttribute('data-sc', cfg.id); // subject colour for tabs, pills, bars
      SN.mountShell(cfg.id);
      document.body.insertAdjacentHTML('beforeend', skeleton());
      wire();
      load(pickYear());
      fromHash();
      if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  };
})();
