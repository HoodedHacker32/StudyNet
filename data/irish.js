/* StudyNet — Gaeilge data (1st and 2nd Year). Loaded by irish.html. */
window.SN_DATA = window.SN_DATA || {};
(function () {
  'use strict';
  var shuffle = SN.shuffle;

  /* ── Shared helpers for plausible wrong quiz options ───────── */
  var prepTable = {
    ag: ['agam', 'agat', 'aige', 'aici', 'againn', 'agaibh', 'acu'],
    ar: ['orm', 'ort', 'air', 'uirthi', 'orainn', 'oraibh', 'orthu'],
    do: ['dom', 'duit', 'dó', 'di', 'dúinn', 'daoibh', 'dóibh'],
    le: ['liom', 'leat', 'leis', 'léi', 'linn', 'libh', 'leo']
  };
  var pronouns = ['Mé', 'Tú', 'Sé', 'Sí', 'Muid', 'Sibh', 'Siad'];
  var PREP_PRONOUNS = ['mé', 'tú', 'sé', 'sí', 'muid', 'sibh', 'siad'];

  // Réamhfhocail: same pronoun with another preposition, or same preposition with another pronoun.
  function reamhDistractors(q) {
    var m = /\((\S+)\s*\+\s*(\S+)\)/.exec(q.h || '');
    if (!m || !prepTable[m[1]]) return [];
    var prep = m[1], pi = PREP_PRONOUNS.indexOf(m[2].toLowerCase());
    if (pi < 0) return [];
    var other = shuffle(Object.keys(prepTable).filter(function (p) { return p !== prep; })).map(function (p) { return prepTable[p][pi]; });
    var same = shuffle(prepTable[prep].filter(function (_, i) { return i !== pi; }));
    return other.slice(0, 2).concat(same.slice(0, 1), other.slice(2), same.slice(1));
  }
  // Verbs: the same word with the wrong mutation or the wrong person ending.
  var URU = { b: 'm', c: 'g', d: 'n', f: 'bh', g: 'n', p: 'b', t: 'd' };
  var ENDING_SWAPS = [[/aíonn$/, 'aím'], [/íonn$/, 'ím'], [/eann$/, 'im'], [/ann$/, 'aim'],
    [/aím$/, 'aíonn'], [/ím$/, 'íonn'], [/aim$/, 'ann'], [/im$/, 'eann'], [/aigh$/, 'aíonn'], [/igh$/, 'íonn']];
  function mutationVariants(q) {
    var ans = q.ans[0];
    var words = ans.split(' '), w = words[0], rest = words.slice(1).join(' ');
    var cap = w.charAt(0) !== w.charAt(0).toLowerCase();
    var base = w.toLowerCase();
    if (base.indexOf("d'") === 0) base = base.slice(2);
    Object.keys(URU).some(function (k) {
      if (base.indexOf(URU[k] + k) === 0) { base = base.slice(URU[k].length); return true; } return false;
    });
    if (base.indexOf('n-') === 0) base = base.slice(2);
    if (base.length > 2 && base.charAt(1) === 'h' && 'bcdfgmpst'.indexOf(base.charAt(0)) >= 0) base = base.charAt(0) + base.slice(2);
    function C(x) { return cap ? x.charAt(0).toUpperCase() + x.slice(1) : x; }
    var c0 = base.charAt(0), forms = [C(base)];
    if ('bcdfgmpst'.indexOf(c0) >= 0) forms.push(C(c0 + 'h' + base.slice(1)));
    if (URU[c0]) forms.push(URU[c0] + C(base));
    if ('aeiouáéíóú'.indexOf(c0) >= 0) { forms.push(C('h' + base)); forms.push('n-' + C(base)); }
    ENDING_SWAPS.some(function (r) {
      if (r[0].test(base)) { forms.push(C(base.replace(r[0], r[1]))); return true; } return false;
    });
    return shuffle(forms.map(function (f) { return rest ? f + ' ' + rest : f; }));
  }

  var reamhRef = {
    cols: ['Forainm', 'ag', 'ar', 'do', 'le'],
    rows: pronouns.map(function (p, i) { return [p, prepTable.ag[i], prepTable.ar[i], prepTable.do[i], prepTable.le[i]]; })
  };

  /* ════════════════════════════════════════════════════════════
     1st YEAR (storage keys unchanged from the original page)
  ════════════════════════════════════════════════════════════ */
  var y1 = {
    /* Exam bank (1st Year): exam-style questions written for StudyNet, modelled on the question types that recur in Junior Cycle papers. */
    examq: [
      { id: 'ga1-rf-1', topic: 'reamhfhocail', src: 'Exam style', type: 'group', q: 'Forainmneacha réamhfhoclacha: líon na bearnaí. (Fill in the blanks.)', parts: [
        { type: 'short', q: 'Tá airgead ___ (ag + mé).', ans: ['agam'], marks: 2 },
        { type: 'short', q: 'Thug mé bronntanas ___ (do + í).', ans: ['di'], marks: 2 },
        { type: 'short', q: 'Bhí mé ag caint ___ (le + iad).', ans: ['leo'], marks: 2 },
        { type: 'short', q: 'Tá fearg ___ (ar + muid).', ans: ['orainn'], marks: 2 }] },
      { id: 'ga1-rf-2', topic: 'reamhfhocail', src: 'Exam style', type: 'group', q: 'Líon na bearnaí.', parts: [
        { type: 'short', q: 'Is maith ___ (le + mé) peil.', ans: ['liom'], marks: 2 },
        { type: 'short', q: 'Tá slaghdán ___ (ar + tú).', ans: ['ort'], marks: 2 },
        { type: 'short', q: 'Inis an scéal ___ (do + muid).', ans: ['dúinn', 'duinn'], marks: 2 },
        { type: 'short', q: 'Tá madra ___ (ag + sí).', ans: ['aici'], marks: 2 }] },
      { id: 'ga1-rf-3', topic: 'reamhfhocail', src: 'Exam style', type: 'group', q: 'Roghnaigh an fhoirm cheart. (Choose the correct form.)', parts: [
        { type: 'mcq', q: 'Tá ocras ___ (ar + sí).', ans: 'uirthi', opts: ['aici', 'orthu', 'air'], marks: 2 },
        { type: 'mcq', q: 'Chabhraigh mé ___ (le + sé).', ans: 'leis', opts: ['léi', 'leo', 'liom'], marks: 2 },
        { type: 'mcq', q: 'Tá teach mór ___ (ag + sibh).', ans: 'agaibh', opts: ['againn', 'acu', 'agat'], marks: 2 }] },
      { id: 'ga1-al-1', topic: 'laithreach', src: 'Exam style', type: 'group', q: 'An aimsir láithreach: scríobh an briathar san fhoirm cheart.', parts: [
        { type: 'short', q: '(éist) ___ sí leis an raidió gach maidin.', ans: ['Éisteann', 'eisteann'], marks: 2 },
        { type: 'short', q: '(ceannaigh) ___ siad bia sa siopa.', ans: ['Ceannaíonn', 'ceannaionn'], marks: 2 },
        { type: 'short', q: '(tóg) ___ mé an bus ar scoil.', ans: ['Tógaim', 'togaim'], marks: 2 },
        { type: 'short', q: '(éirigh) ___ muid ar a seacht.', ans: ['Éirímid', 'Éiríonn muid', 'eirimid', 'eirionn muid'], marks: 2 }] },
      { id: 'ga1-al-2', topic: 'laithreach', src: 'Exam style', type: 'group', q: 'An aimsir láithreach.', parts: [
        { type: 'mcq', q: 'Which is the present tense of <i>glan</i> with <i>mé</i>?', ans: 'Glanaim', opts: ['Ghlan mé', 'Glanfaidh mé', 'Glanann mé'], marks: 2 },
        { type: 'short', q: '(ól) ___ tú bainne gach lá.', ans: ['Ólann', 'olann'], marks: 2 },
        { type: 'short', q: '(mothaigh) ___ sé tuirseach.', ans: ['Mothaíonn', 'mothaionn'], marks: 2 }] },
      { id: 'ga1-al-3', topic: 'laithreach', src: 'Exam style', type: 'written', marks: 8, lines: 5,
        q: 'Scríobh trí abairt faoi do ghnáthlá san aimsir láithreach. (Write three sentences about your usual day in the present tense.)',
        scheme: ['Three sentences, each with a correct present-tense verb, e.g. Éirím, Ithim, Téim (2 marks each)', 'Overall accuracy of Irish (2 marks)'],
        model: 'Éirím ar a seacht a chlog gach maidin. Ithim mo bhricfeasta sa chistin. Téim ar scoil ar an mbus.' },
      { id: 'ga1-ac-1', topic: 'chaite', src: 'Exam style', type: 'group', q: 'An aimsir chaite: scríobh an briathar san fhoirm cheart.', parts: [
        { type: 'short', q: '(glan) ___ mé mo sheomra inné.', ans: ['Ghlan'], marks: 2 },
        { type: 'short', q: '(ól) ___ sé cupán tae.', ans: ['D’ól', "D'ól", 'Dol', "D'ol"], marks: 2 },
        { type: 'short', q: '(ceannaigh) ___ siad ríomhaire nua.', ans: ['Cheannaigh'], marks: 2 },
        { type: 'short', q: '(tosaigh) ___ an cluiche ar a trí.', ans: ['Thosaigh'], marks: 2 }] },
      { id: 'ga1-ac-2', topic: 'chaite', src: 'Exam style', type: 'group', q: 'Roghnaigh an fhoirm cheart den aimsir chaite.', parts: [
        { type: 'mcq', q: '___ mé le mo chara sa Ghaillimh. (fan)', ans: 'D’fhan', opts: ['Fhan', 'Fanann', 'Fanfaidh'], marks: 2 },
        { type: 'mcq', q: '___ sí an doras. (dún)', ans: 'Dhún', opts: ['Dún', 'Dúnann', 'D’dún'], marks: 2 },
        { type: 'mcq', q: '___ mé go luath inné. (éirigh)', ans: 'D’éirigh', opts: ['Éirigh', 'Éirím', 'Héirigh'], marks: 2 }] },
      { id: 'ga1-ac-3', topic: 'chaite', src: 'Exam style', type: 'written', marks: 8, lines: 5,
        q: 'Scríobh trí abairt faoi rud a rinne tú an deireadh seachtaine seo caite. (Write three sentences about something you did last weekend, in the past tense.)',
        scheme: ['Three sentences, each with a correct past-tense verb, e.g. Chuaigh mé, D’imir mé, Cheannaigh mé (2 marks each)', 'Overall accuracy of Irish (2 marks)'],
        model: 'Chuaigh mé go dtí an phictiúrlann le mo chairde Dé Sathairn. D’imir mé peil Dé Domhnaigh. Cheannaigh mé geansaí nua sa bhaile mór.' },
      { id: 'ga1-nr-1', topic: 'irregulars', src: 'Exam style', type: 'group', q: 'Briathra neamhrialta san aimsir láithreach.', parts: [
        { type: 'short', q: '(téigh) ___ sé ar scoil gach lá.', ans: ['Téann', 'teann'], marks: 2 },
        { type: 'short', q: '(déan) ___ siad an obair bhaile.', ans: ['Déanann', 'deanann'], marks: 2 },
        { type: 'short', q: '(tar) ___ sí abhaile ar a ceathair.', ans: ['Tagann'], marks: 2 },
        { type: 'short', q: '(feic) ___ mé mo chairde ag an deireadh seachtaine.', ans: ['Feicim'], marks: 2 }] },
      { id: 'ga1-nr-2', topic: 'irregulars', src: 'Exam style', type: 'group', q: 'Briathra neamhrialta san aimsir chaite.', parts: [
        { type: 'short', q: '(téigh) ___ mé go Corcaigh inné.', ans: ['Chuaigh'], marks: 2 },
        { type: 'short', q: '(feic) ___ sí scannán aréir.', ans: ['Chonaic'], marks: 2 },
        { type: 'short', q: '(bí) ___ mé tinn an tseachtain seo caite.', ans: ['Bhí', 'bhi'], marks: 2 },
        { type: 'short', q: '(faigh) ___ mé bronntanas deas.', ans: ['Fuair'], marks: 2 }] },
      { id: 'ga1-nr-3', topic: 'irregulars', src: 'Exam style', type: 'group', q: 'Roghnaigh an fhoirm cheart.', parts: [
        { type: 'mcq', q: '(abair) ___ sí “Dia duit” leis an múinteoir gach maidin.', ans: 'Deir', opts: ['Abair', 'Abraíonn', 'Dúirt'], marks: 2 },
        { type: 'mcq', q: '(tabhair) ___ siad cabhair dom gach lá.', ans: 'Tugann', opts: ['Tabhair', 'Thug', 'Tabharann'], marks: 2 },
        { type: 'mcq', q: '(clois) ___ mé an ceol.', ans: 'Cloisim', opts: ['Cloiseann mé', 'Chuala mé', 'Clois mé'], marks: 2 }] },
      { id: 'ga1-as-1', topic: 'aidiacht', src: 'Exam style', type: 'group', q: 'An aidiacht shealbhach: scríobh i gceart. (Write correctly.)', parts: [
        { type: 'short', q: 'mo + teach', ans: ['mo theach'], marks: 2 },
        { type: 'short', q: 'a (her) + athair', ans: ['a hathair'], marks: 2 },
        { type: 'short', q: 'ár + carr', ans: ['ár gcarr', 'ar gcarr'], marks: 2 },
        { type: 'short', q: 'do + aintín', ans: ['d’aintín', "d'aintín", 'daintin', "d'aintin"], marks: 2 }] },
      { id: 'ga1-as-2', topic: 'aidiacht', src: 'Exam style', type: 'group', q: 'Roghnaigh an fhoirm cheart.', parts: [
        { type: 'mcq', q: 'his car', ans: 'a charr', opts: ['a carr', 'a gcarr'], marks: 2 },
        { type: 'mcq', q: 'their table (bord)', ans: 'a mbord', opts: ['a bord', 'a bhord'], marks: 2 },
        { type: 'mcq', q: 'our aunt', ans: 'ár n-aintín', opts: ['ár aintín', 'ár haintín'], marks: 2 }] },
      { id: 'ga1-as-3', topic: 'aidiacht', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Scríobh abairt amháin le gach ceann díobh seo: <b>mo</b>, <b>a</b> (her), <b>ár</b>. (One sentence with each.)',
        scheme: ['Correct sentence with mo + séimhiú (or m’ before a vowel) (2 marks)', 'Correct sentence with a (her): no change before a consonant, h before a vowel (2 marks)', 'Correct sentence with ár + urú (n- before a vowel) (2 marks)'],
        model: 'Tá mo theach in aice na scoile. Is múinteoir é a hathair. Tá ár gcarr dearg.' },
    ],
    blurb: 'Irish Language — 1st Year revision activities',
    store: 'sn_irish_v1',
    score: 'irish',
    topics: [
      { id: 'reamhfhocail', label: 'Réamhfhocail', icon: 'link', desc: 'Prepositional pronouns',
        fc: ['ag', 'ar', 'do', 'le'], quiz: ['reamhfhocail'], match: ['ag', 'ar', 'do', 'le'], prac: ['reamhfhocail'] },
      { id: 'laithreach', label: 'Aimsir Láithreach', icon: 'clock', desc: 'Present tense verbs',
        quiz: ['laithreach1', 'laithreach2'], prac: ['laithreach1', 'laithreach2'] },
      { id: 'chaite', label: 'Aimsir Chaite', icon: 'rewind', desc: 'Past tense verbs',
        quiz: ['chaite'], prac: ['chaite'] },
      { id: 'irregulars', label: 'Briathra Neamhrialta', icon: 'bolt', desc: 'Irregular verbs',
        quiz: ['irregulars'], prac: ['irregulars'] },
      { id: 'aidiacht', label: 'Aidiacht Shealbhach', icon: 'user', desc: 'Possessive adjectives',
        fc: ['aidiacht'], quiz: ['aidiacht'], match: ['mutations'], prac: ['aidiacht'] }
    ],
    decks: {
      ag: { label: 'ag + Pronoun', cards: pronouns.map(function (p, i) { return { front: 'ag + ' + p, back: prepTable.ag[i], sub: '"with/at" + ' + p.toLowerCase() }; }) },
      ar: { label: 'ar + Pronoun', cards: pronouns.map(function (p, i) { return { front: 'ar + ' + p, back: prepTable.ar[i], sub: '"on" + ' + p.toLowerCase() }; }) },
      do: { label: 'do + Pronoun', cards: pronouns.map(function (p, i) { return { front: 'do + ' + p, back: prepTable.do[i], sub: '"to/for" + ' + p.toLowerCase() }; }) },
      le: { label: 'le + Pronoun', cards: pronouns.map(function (p, i) { return { front: 'le + ' + p, back: prepTable.le[i], sub: '"with" + ' + p.toLowerCase() }; }) },
      aidiacht: { label: 'Aidiacht Shealbhach', cards: [
        { front: 'Mo — my', sub: 'Possessive adjective', back: "+ consan → séimhiú: mo theach\n+ guta → elision: m'aintín" },
        { front: 'Do — your', sub: 'Possessive adjective', back: "+ consan → séimhiú: do theach\n+ guta → elision: d'aintín" },
        { front: 'A (sé) — his', sub: 'Possessive adjective', back: '+ consan → séimhiú: a theach\n+ guta → gan athrú: a aintín' },
        { front: 'A (sí) — her', sub: 'Possessive adjective', back: '+ consan → gan athrú: a teach\n+ guta → h-: a haintín' },
        { front: 'Ár — our', sub: 'Possessive adjective', back: '+ consan → urú: ár dteach\n+ guta → n-: ár n-aintín' },
        { front: 'Bhur — your (pl)', sub: 'Possessive adjective', back: '+ consan → urú: bhur dteach\n+ guta → n-: bhur n-aintín' },
        { front: 'A (siad) — their', sub: 'Possessive adjective', back: '+ consan → urú: a dteach\n+ guta → n-: a n-aintín' },
        { front: 'Séimhiú', sub: 'Mo, Do, A (sé)', back: 'h tar éis an chéad chonsain\nteach → theach · carr → charr · bean → bhean' },
        { front: 'Urú', sub: 'Ár, Bhur, A (siad)', back: 't→dt · c→gc · b→mb · d→nd · f→bhf · g→ng · p→bp\nteach → dteach · carr → gcarr' },
        { front: 'H-réimír', sub: 'A (sí) + guta', back: 'aintín → haintín · athair → hathair' },
        { front: 'N-réimír', sub: 'Ár, Bhur, A (siad) + guta', back: 'aintín → n-aintín · athair → n-athair' },
        { front: "Elision (')", sub: 'Mo / Do + guta', back: "mo + aintín → m'aintín\ndo + athair → d'athair" },
        { front: 'Séimhiú le cé?', sub: 'Cuir i gceart', back: 'Mo · Do · A (sé)' },
        { front: 'Urú le cé?', sub: 'Cuir i gceart', back: 'Ár · Bhur · A (siad)' }
      ] }
    },
    quizzes: {},
    matches: {
      ag: { label: 'ag', pairs: pronouns.map(function (p, i) { return { left: 'ag + ' + p, right: prepTable.ag[i] }; }) },
      ar: { label: 'ar', pairs: pronouns.map(function (p, i) { return { left: 'ar + ' + p, right: prepTable.ar[i] }; }) },
      do: { label: 'do', pairs: pronouns.map(function (p, i) { return { left: 'do + ' + p, right: prepTable.do[i] }; }) },
      le: { label: 'le', pairs: pronouns.map(function (p, i) { return { left: 'le + ' + p, right: prepTable.le[i] }; }) },
      mutations: { label: 'Mutations', pairs: [
        { left: 'Mo', right: "Séimhiú: mo theach, m'aintín" },
        { left: 'Do', right: "Séimhiú: do theach, d'aintín" },
        { left: 'A (sé — his)', right: 'Séimhiú: a theach, a aintín' },
        { left: 'A (sí — her)', right: 'H-prefix: a teach, a haintín' },
        { left: 'Ár', right: 'Urú: ár dteach, ár n-aintín' },
        { left: 'Bhur', right: 'Urú: bhur dteach, bhur n-aintín' },
        { left: 'A (siad — their)', right: 'Urú: a dteach, a n-aintín' }
      ] }
    },
    practice: {}
  };

  var y1Ex = {
    reamhfhocail: { label: 'Réamhfhocail', questions: [
      { b: 'Tá hata nua', h: '(ar + sé)', a: '.', ans: ['air'] },
      { b: 'Thug mé bronntanas', h: '(do + sí)', a: '.', ans: ['di'] },
      { b: 'Is', h: '(le + siad)', a: 'an carr mór.', ans: ['leo'] },
      { b: 'An bhfuil peann dearg', h: '(ag + tú)', a: '?', ans: ['agat'] },
      { b: 'Tá brú mór', h: '(ar + muid)', a: 'inniu.', ans: ['orainn'] },
      { b: 'Léigh sí an scéal', h: '(do + mé)', a: '.', ans: ['dom'] },
      { b: 'Tá triúr deartháireacha', h: '(ag + sí)', a: '.', ans: ['aici'] },
      { b: 'Is', h: '(le + sé)', a: 'an madra beag.', ans: ['leis'] },
      { b: 'Thug siad cuireadh', h: '(do + sibh)', a: '.', ans: ['daoibh'] },
      { b: 'Tá geansaí te', h: '(ar + mé)', a: '.', ans: ['orm'] },
      { b: 'Is maith', h: '(le + muid)', a: 'an obair bhaile.', ans: ['linn'] },
      { b: 'An bhfuil ceisteanna', h: '(ag + sibh)', a: '?', ans: ['agaibh'] },
      { b: 'Thaispeáin sé an pictiúr', h: '(do + siad)', a: '.', ans: ['dóibh'] },
      { b: 'Tá cóta fada', h: '(ar + tú)', a: '.', ans: ['ort'] },
      { b: 'Is', h: '(le + tú)', a: 'an rothar nua.', ans: ['leat'] },
      { b: 'Tá cat bán', h: '(ag + mé)', a: '.', ans: ['agam'] },
      { b: "D'inis an múinteoir an freagra", h: '(do + sé)', a: '.', ans: ['dó'] },
      { b: 'Tá fearg mhór', h: '(ar + siad)', a: '.', ans: ['orthu'] },
      { b: 'An maith', h: '(le + sibh)', a: 'an cheolchoirm?', ans: ['libh'] },
      { b: 'Tá fón nua', h: '(ag + sé)', a: '.', ans: ['aige'] }
    ] },
    irregulars: { label: 'Briathra Neamhrialta', questions: [
      { b: '', h: '[Beir]', a: 'Robbie Henshaw ar an liathróid.', ans: ['Beireann'] },
      { b: '', h: '[Tabhair]', a: 'sé cic mór láidir di.', ans: ['Tugann'] },
      { b: '', h: '[Téigh]', a: 'an liathróid suas san aer.', ans: ['Téann'] },
      { b: '', h: '[Bí]', a: 'Jacob Stockdale ag feitheamh léi.', ans: ['Bíonn', 'Tá'] },
      { b: '', h: '[Tar]', a: 'an liathróid chuige.', ans: ['Tagann'] },
      { b: '', h: '[Deir]', a: "sé 'Jacob!'", ans: ['Deir'] },
      { b: '', h: '[Clois]', a: 'sé an lucht leanúna ag screadach.', ans: ['Cloiseann'] },
      { b: '', h: '[Feic]', a: 'sé bearna.', ans: ['Feiceann'] },
      { b: '', h: '[Déan]', a: 'sé a shlí tríd.', ans: ['Déanann'] },
      { b: '', h: '[Faigh]', a: 'sé úd iontach.', ans: ['Faigheann'] },
      { b: '', h: '[Ith]', a: 'an fhoireann dinnéar tar éis an chluiche.', ans: ['Itheann'] }
    ] },
    laithreach1: { label: 'Aimsir Láithreach 1', questions: [
      { b: '', h: '[Ceap: mé]', a: 'go bhfuil Learpholl níos fearr.', ans: ['Ceapaim'] },
      { b: '', h: '[Creid: sé]', a: 'go bhfuil An Mhí níos crua.', ans: ['Creideann sé'] },
      { b: 'An', h: '[caith: siad]', a: 'a lán airgid ar éadaí?', ans: ['gcaitheann siad'] },
      { b: 'Ní', h: '[tóg: muid]', a: 'sos am lóin.', ans: ['thógann muid', 'thógaimid'] },
      { b: 'Conas a', h: '[litrigh: sí]', a: 'na ceisteanna anois?', ans: ['litríonn sí'] },
      { b: '', h: '[Bain: siad]', a: 'móin sa phortach.', ans: ['Baineann siad'] },
      { b: '', h: '[Sroich: mé]', a: 'mo theach ar 17:00 gach lá.', ans: ['Sroichim'] },
      { b: 'Ní', h: '[mothaigh: mé]', a: 'tuirseach ar scoil.', ans: ['mhothaím'] },
      { b: 'Ceapaim go n-', h: '[éist: sí]', a: 'le rac-cheol.', ans: ['éisteann sí'] },
      { b: 'Ceapaim go n-', h: '[úsáid: sé]', a: 'Facebook.', ans: ['úsáideann sé'] }
    ] },
    laithreach2: { label: 'Aimsir Láithreach 2', questions: [
      { b: '', h: '[Aistrigh: mé]', a: 'abairtí gach lá!', ans: ['Aistrím'] },
      { b: '', h: '[Éirigh: muid]', a: 'ag 07:00 gach maidin.', ans: ['Éiríonn muid', 'Éirímid'] },
      { b: '', h: '[Críochnaigh: muid]', a: 'ar scoil ag 15:30.', ans: ['Críochnaíonn muid', 'Críochnaímid'] },
      { b: 'An', h: '[dúisigh: tú]', a: 'go héasca?', ans: ['ndúisíonn tú'] },
      { b: 'Conas a', h: '[litrigh: tú]', a: "'críochnaithe'?", ans: ['litríonn tú'] },
      { b: 'Ní', h: '[mothaigh: sé]', a: 'tinn go minic.', ans: ['mhothaíonn sé'] },
      { b: 'An', h: '[ceannaigh: sibh]', a: 'lón ar scoil gach lá?', ans: ['gceannaíonn sibh'] },
      { b: 'Ní', h: '[breathnaigh: mé]', a: 'ar an teilifís go rialta.', ans: ['bhreathnaím'] },
      { b: 'Sílim go n-', h: '[aontaigh: siad]', a: 'leat.', ans: ['aontaíonn siad'] },
      { b: 'Sílim go n-', h: '[éirigh: sí]', a: 'go luath gach maidin.', ans: ['éiríonn sí'] }
    ] },
    chaite: { label: 'Aimsir Chaite', questions: [
      { b: '', h: '[Tosaigh: muid]', a: 'ag imirt cruicéid anuraidh.', ans: ['Thosaigh muid', 'Thosaíomar'] },
      { b: '', h: '[Éirigh: mé]', a: 'ag 07:00 ar maidin.', ans: ["D'éirigh mé"] },
      { b: '', h: '[Mothaigh: muid]', a: 'tinn inné.', ans: ['Mhothaigh muid', 'Mhothaíomar'] },
      { b: 'Ar', h: '[deisigh: tú]', a: 'do rothar?', ans: ['dheisigh tú'] },
      { b: 'Ar', h: '[aistrigh: tú]', a: 'na habairtí sin?', ans: ['aistrigh tú'] },
      { b: 'Níor', h: '[sínigh: sí]', a: 'a hainm ar an litir.', ans: ['shínigh sí'] },
      { b: 'Ar', h: '[ceannaigh: siad]', a: 'aon rud deas?', ans: ['cheannaigh siad'] },
      { b: 'Ar', h: '[smaoinigh: tú]', a: 'faoi mo phlean?', ans: ['smaoinigh tú'] },
      { b: 'Sílim gur', h: '[réitigh: siad]', a: 'an fhadhb.', ans: ['réitigh siad'] },
      { b: 'Sílim gur', h: '[cealaigh: sí]', a: 'an lá spóirt.', ans: ['chealaigh sí'] }
    ] }
  };
  Object.keys(y1Ex).forEach(function (k) {
    var ex = y1Ex[k];
    y1.quizzes[k] = { label: ex.label, questions: ex.questions,
      distractors: k === 'reamhfhocail' ? reamhDistractors : mutationVariants };
    y1.practice[k] = { label: ex.label, type: 'lines', items: ex.questions,
      hintBefore: k === 'reamhfhocail', ref: k === 'reamhfhocail' ? reamhRef : null,
      intro: k === 'reamhfhocail' ? 'Type the correct prepositional pronoun.' : 'Type the correct form of the verb.' };
  });
  y1.quizzes.aidiacht = { label: 'Aidiacht Shealbhach', questions: [
    { b: '', h: '[Mo (my) + teach (house)]', a: '→ ?', ans: ['mo theach'] },
    { b: '', h: '[Do (your) + teach (house)]', a: '→ ?', ans: ['do theach'] },
    { b: '', h: '[A (his) + teach (house)]', a: '→ ?', ans: ['a theach'] },
    { b: '', h: '[A (her) + teach (house)]', a: '→ ?', ans: ['a teach'] },
    { b: '', h: '[Ár (our) + teach (house)]', a: '→ ?', ans: ['ár dteach'] },
    { b: '', h: '[Bhur (your pl.) + teach (house)]', a: '→ ?', ans: ['bhur dteach'] },
    { b: '', h: '[A (their) + teach (house)]', a: '→ ?', ans: ['a dteach'] },
    { b: '', h: '[A (her) + aintín (aunt)]', a: '→ ?', ans: ['a haintín'] }
  ] };
  // Practice table: storage keys aidiacht_teach_<row> / aidiacht_aintin_<row>, as before.
  var aidRows = [['Mo', 'my'], ['Do', 'your'], ['A (his)', 'his'], ['A (her)', 'her'], ['Ár', 'our'], ['Bhur', 'your (pl)'], ['A (their)', 'their']];
  var aidTeach = [['mo theach'], ['do theach'], ['a theach'], ['a teach'], ['ár dteach'], ['bhur dteach'], ['a dteach']];
  var aidAintin = [["m'aintín"], ["d'aintín"], ['a aintín'], ['a haintín'], ['ár n-aintín'], ['bhur n-aintín'], ['a n-aintín']];
  y1.practice.aidiacht = { label: 'Aidiacht Shealbhach', type: 'table', intro: 'Write the possessive adjective with each noun.',
    cols: ['Aidiacht', 'teach (house)', 'aintín (aunt)'],
    rows: aidRows.map(function (r, i) {
      return [r[0] + ' (' + r[1] + ')', { k: 'teach_' + i, ans: aidTeach[i] }, { k: 'aintin_' + i, ans: aidAintin[i] }];
    }) };
  // Keep the original practice order.
  y1.practice = { reamhfhocail: y1.practice.reamhfhocail, aidiacht: y1.practice.aidiacht, irregulars: y1.practice.irregulars,
    laithreach1: y1.practice.laithreach1, laithreach2: y1.practice.laithreach2, chaite: y1.practice.chaite };

  /* ════════════════════════════════════════════════════════════
     2nd YEAR — November assessment: Spás (gearrscéal),
     léamhthuiscint and gramadach.
  ════════════════════════════════════════════════════════════ */
  var y2 = {
    blurb: 'Irish Language — 2nd Year: November assessment revision',
    exam: '<b>November assessment:</b> the short story <i>Spás</i> by Mícheál Ó Ruairc (theme or message, and a mark out of 10 with reasons), a léamhthuiscint, and gramadach.',
    store: 'sn_irish_y2',
    score: 'irish_y2',
    /* Exam bank: Junior Cycle style questions with marking schemes. Irish answers: spelling, fadas and grammar count. */
    examq: [
      { id: 'ga-as2-1', topic: 'aidiacht2', src: 'Exam style', type: 'group', q: 'An aidiacht shealbhach roimh ghuta agus roimh chonsan: scríobh i gceart.', parts: [
        { type: 'short', q: 'ár + athair', ans: ['ár n-athair', 'ar n-athair'], marks: 2 },
        { type: 'short', q: 'bhur + teach', ans: ['bhur dteach'], marks: 2 },
        { type: 'short', q: 'a (his) + uncail', ans: ['a uncail'], marks: 2 },
        { type: 'short', q: 'a (her) + uncail', ans: ['a huncail'], marks: 2 },
        { type: 'short', q: 'mo + uncail', ans: ['m’uncail', "m'uncail", 'muncail'], marks: 2 }] },
      { id: 'ga-as2-2', topic: 'aidiacht2', src: 'Exam style', type: 'group', q: 'Roghnaigh an fhoirm cheart.', parts: [
        { type: 'mcq', q: 'their door (doras)', ans: 'a ndoras', opts: ['a doras', 'a dhoras'], marks: 2 },
        { type: 'mcq', q: 'our field (páirc)', ans: 'ár bpáirc', opts: ['ár páirc', 'ár pháirc'], marks: 2 },
        { type: 'mcq', q: 'your (plural) coat (cóta)', ans: 'bhur gcóta', opts: ['bhur cóta', 'bhur chóta'], marks: 2 },
        { type: 'mcq', q: 'her bag (mála)', ans: 'a mála', opts: ['a mhála', 'a mmála'], marks: 2 }] },
      { id: 'ga-as2-3', topic: 'aidiacht2', src: 'Exam style', type: 'written', marks: 10, lines: 6,
        q: 'Scríobh cúig abairt faoi do theaghlach. Úsáid <b>mo</b>, <b>a</b> (his) agus <b>ár</b> ar a laghad uair amháin. (Write five sentences about your family using mo, a (his) and ár at least once.)',
        scheme: ['Correct mo + séimhiú / m’ (2 marks)', 'Correct a (his) + séimhiú / no change before a vowel (2 marks)', 'Correct ár + urú / n- (2 marks)', 'Five sentences relevant to family (2 marks)', 'Overall accuracy of Irish (2 marks)'],
        model: 'Áine is ainm do mo mháthair. Is siopadóir é m’athair. Tá deartháir amháin agam agus is é Liam a chara is fearr. Tá ár dteach i lár an bhaile. Tá ár madra an-chairdiúil.' },
      { id: 'ga-mo-2', topic: 'mothu', src: 'Exam style', type: 'group', q: 'Mothúcháin: líon na bearnaí.', parts: [
        { type: 'short', q: 'Tá tuirse ___ (ar + iad).', ans: ['orthu'], marks: 2 },
        { type: 'short', q: 'Tá eagla ___ (ar + sé).', ans: ['air'], marks: 2 },
        { type: 'short', q: 'Tá áthas ___ (ar + sibh).', ans: ['oraibh'], marks: 2 },
        { type: 'short', q: 'Tá carr nua ___ (ag + sí).', ans: ['aici'], marks: 2 }] },
      { id: 'ga-mo-3', topic: 'mothu', src: 'Exam style', type: 'written', marks: 6, lines: 4,
        q: 'Scríobh trí abairt faoi conas a mhothaíonn tú i rith na seachtaine. Úsáid <b>ar</b> le mothúcháin. (Write three sentences about how you feel during the week, using ar with feelings.)',
        scheme: ['Three correct sentences using Tá + feeling + orm/air/uirthi… (2 marks each)'],
        model: 'Tá áthas orm ar an Aoine. Bíonn tuirse orm ar an Luan. Tá ocras orm tar éis na scoile.' },
      { id: 'ga-te-2', topic: 'teaghlach', src: 'Exam style', type: 'group', q: 'Uimhreacha pearsanta agus aois.', parts: [
        { type: 'short', q: 'How do you say 2 people (counting people)?', ans: ['beirt'], marks: 2 },
        { type: 'short', q: 'How do you say 3 people?', ans: ['triúr', 'triur'], marks: 2 },
        { type: 'short', q: 'How do you say 5 people?', ans: ['cúigear', 'cuigear'], marks: 2 },
        { type: 'short', q: 'Freagair i nGaeilge: Cén aois thú? (I am 13.)', ans: ['Tá mé trí bliana déag d’aois', "Tá mé trí bliana déag d'aois", 'Táim trí bliana déag d’aois', "Táim trí bliana déag d'aois", 'trí bliana déag d’aois', "trí bliana déag d'aois"], marks: 2 }] },
      { id: 'ga-te-3', topic: 'teaghlach', src: 'Exam style', type: 'written', marks: 10, lines: 6,
        q: 'Scríobh alt gairid faoi do theaghlach: cé mhéad duine atá sa teaghlach, a n-aoiseanna agus a bpoist. (A short piece about your family: how many people, their ages and their jobs.)',
        scheme: ['How many people, using personal numbers, e.g. Tá cúigear i mo theaghlach (2 marks)', 'Ages, e.g. Tá mo dheartháir deich mbliana d’aois (3 marks)', 'Jobs, e.g. Is dochtúir í mo mháthair (3 marks)', 'Overall accuracy of Irish (2 marks)'],
        model: 'Tá ceathrar i mo theaghlach. Tá mo dheirfiúr naoi mbliana d’aois agus tá mé féin trí bliana déag d’aois. Is múinteoir í mo mháthair agus is feirmeoir é m’athair.' },
      { id: 'ga-le-1', topic: 'leamh', src: 'Exam style', type: 'group', q: 'Na ceistfhocail: what do they mean in English?', parts: [
        { type: 'short', q: 'Cathain?', ans: ['when', 'when?'], marks: 2 },
        { type: 'short', q: 'Cá?', ans: ['where', 'where?'], marks: 2 },
        { type: 'short', q: 'Cén fáth?', ans: ['why', 'why?'], marks: 2 },
        { type: 'short', q: 'Cé mhéad?', ans: ['how many', 'how much', 'how many?', 'how much?'], marks: 2 },
        { type: 'short', q: 'Conas?', ans: ['how', 'how?'], marks: 2 }] },
      { id: 'ga-le-2', topic: 'leamh', src: 'Exam style', type: 'group',
        q: 'Léigh an sliocht agus freagair na ceisteanna. <br><i>Is mise Síle. Tá mé trí bliana déag d’aois agus tá cónaí orm i nGaillimh. Tá beirt deartháireacha agam. Is breá liom peil agus imrím le club áitiúil gach Satharn. Inné, chuaigh mé go dtí an trá le mo chairde agus d’itheamar uachtar reoite.</i>', parts: [
        { type: 'short', q: 'Cén aois í Síle?', ans: ['13', 'trí bliana déag', 'trí bliana déag d’aois', "trí bliana déag d'aois", 'tri bliana deag'], marks: 2 },
        { type: 'short', q: 'Cá bhfuil cónaí uirthi?', ans: ['i nGaillimh', 'Gaillimh', 'in Galway', 'Galway'], marks: 2 },
        { type: 'short', q: 'Cé mhéad deartháir atá aici?', ans: ['2', 'beirt', 'dhá', 'beirt deartháireacha', 'two'], marks: 2 },
        { type: 'short', q: 'Cathain a imríonn sí peil?', ans: ['gach Satharn', 'Dé Sathairn', 'ar an Satharn', 'every Saturday', 'Saturday'], marks: 2 },
        { type: 'short', q: 'Cá ndeachaigh sí inné?', ans: ['go dtí an trá', 'an trá', 'chuig an trá', 'to the beach', 'the beach'], marks: 2 }] },
      { id: 'ga-le-3', topic: 'leamh', src: 'Exam style', type: 'group', q: 'Exam instructions: what do they ask you to do?', parts: [
        { type: 'mcq', q: 'Tabhair dhá phointe eolais.', ans: 'Give two pieces of information', opts: ['Give two reasons', 'Write two sentences', 'Explain two words'], marks: 2 },
        { type: 'mcq', q: 'Luaigh…', ans: 'Mention / state', opts: ['Explain', 'Describe', 'Translate'], marks: 2 },
        { type: 'mcq', q: 'Mínigh…', ans: 'Explain', opts: ['List', 'Name', 'Underline'], marks: 2 },
        { type: 'mcq', q: 'Cuir tic leis an bhfreagra ceart.', ans: 'Tick the correct answer', opts: ['Write the correct answer', 'Circle the wrong answer', 'Fill in the blank'], marks: 2 }] },
      { id: 'ga-sp-3', topic: 'spas', src: 'Exam style', type: 'written', marks: 10, lines: 6,
        q: 'Spás: Déan cur síos ar Phádraigín, an príomhcharachtar. Luaigh dhá thréith a bhaineann léi agus tabhair sampla as an scéal do gach ceann. (Describe Pádraigín: two traits, each with an example from the story.)',
        scheme: ['First trait named (2 marks) with an example from the story (2 marks)', 'Second trait named (2 marks) with an example from the story (2 marks)', 'Quality of Irish (2 marks)'],
        model: 'Tá Pádraigín míshona. Níl aon phríobháideacht aici ó cuireadh a deirfiúr Aoife ina seomra, agus mothaíonn sí cosúil le príosúnach. Tá sí dóchasach ag deireadh an scéil, áfach: tá plean aici agus ligeann sí osna áthais.' },
      { id: 'ga-sp-1', topic: 'spas', src: 'Exam style', type: 'written', marks: 15, lines: 8,
        q: 'Spás le Mícheál Ó Ruairc: Cad é téama an scéil? Déan plé air. (What is the theme of the story? Discuss it.) Tabhair dhá phointe eolais as an scéal.',
        scheme: ['Names a valid theme, e.g. an t-uaigneas (loneliness), an teaghlach (family), spás pearsanta / príobháideacht (personal space / privacy) (5 marks)', 'First point from the story that supports the theme (4 marks)', 'Second point from the story that supports the theme (4 marks)', 'Quality of Irish (2 marks)'],
        model: 'Is é an téama atá sa ghearrscéal seo ná an gá atá ag déagóir le spás agus le príobháideacht. Bhí seomra dá cuid féin ag Pádraigín. Ní raibh sí sásta nuair a cuireadh a deirfiúr Aoife in aon seomra léi.' },
      { id: 'ga-sp-2', topic: 'spas', src: 'Exam style', type: 'written', marks: 10, lines: 6,
        q: 'Spás: Cén marc as deich a thabharfá don scéal? Tabhair dhá fháth le d’fhreagra. (What mark out of ten would you give the story? Give two reasons.)',
        scheme: ['Gives a mark out of 10 (2 marks)', 'First reason based on the story (4 marks)', 'Second reason based on the story (4 marks)'],
        model: 'Thabharfainn ocht as deich don scéal. Is maith liom é mar go bhfuil sé réalaíoch: bíonn ar a lán déagóirí seomra a roinnt. Thuig mé conas a mhothaigh Pádraigín, agus tá críoch dhóchasach leis an scéal.' },
      { id: 'ga-gr-1', topic: 'mothu', src: 'Exam style', type: 'group', q: 'Gramadach: líon na bearnaí. (Fill in the blanks.)', parts: [
        { type: 'short', q: 'Tá ocras ___ (ar + mé).', ans: ['orm'], marks: 2 },
        { type: 'short', q: 'Tá brón ___ (ar + sí).', ans: ['uirthi'], marks: 2 },
        { type: 'short', q: 'Tá rothar nua ___ (ag + sé).', ans: ['aige'], marks: 2 },
        { type: 'short', q: 'Tá teach mór ___ (ag + siad).', ans: ['acu'], marks: 2 }] },
      { id: 'ga-te-1', topic: 'teaghlach', src: 'Exam style', type: 'written', marks: 10, lines: 6,
        q: 'Scríobh cúig abairt faoi do theaghlach. (Write five sentences about your family.)',
        scheme: ['Says how many are in the family (e.g. Tá cúigear i mo theaghlach) (2 marks)', 'Names or describes family members (2 marks)', 'Gives an age or job correctly (2 marks)', 'Uses an adjective / description correctly (2 marks)', 'Accuracy of Irish across the five sentences (2 marks)'],
        model: 'Tá cúigear i mo theaghlach. Tá deartháir amháin agus deirfiúr amháin agam. Tá mo dheartháir dhá bhliain déag d’aois. Is múinteoir í mo mháthair. Tá m’athair cairdiúil agus greannmhar.' }
    ],
    topics: [
      { id: 'scrudu', info: true, label: 'An Scrúdú', icon: 'target', desc: 'What’s on the November assessment, and a run-through of all of it', course: ['nov'], notes: ['scrudu'] },
      { id: 'spas', label: 'Spás', icon: 'notes', desc: 'Gearrscéal le Mícheál Ó Ruairc',
        notes: ['spasScéal', 'spasCarachtair', 'spasTeama'], fc: ['spasFocail', 'spasNathanna'],
        quiz: ['spasCeisteanna', 'spasEnglish'], match: ['spasNathanna', 'spasMothu'], prac: ['spasAchoimre'] },
      { id: 'aidiacht2', label: 'Aidiacht Shealbhach', icon: 'user', desc: 'Roimh chonsan agus roimh ghuta',
        notes: ['aidiachtNotes'], quiz: ['aidiacht2'], prac: ['aidiachtTable', 'aidiachtSentences'] },
      { id: 'mothu', label: 'Ag agus Ar', icon: 'heart', desc: 'Mothúcháin le ar, seilbh le ag',
        fc: ['mothuFocail'], quiz: ['agAr'], match: ['mothuEn'], prac: ['agAr'] },
      { id: 'teaghlach', label: 'Mé Féin & Mo Theaghlach', icon: 'users', desc: 'Aoiseanna, dátaí, uimhreacha pearsanta, poist',
        notes: ['teaghlachNotes'], fc: ['poist', 'uimhreacha'], quiz: ['poist', 'uimhreacha', 'aoiseanna'], match: ['poist', 'miosa'], prac: ['teaghlach'] },
      { id: 'leamh', label: 'Léamhthuiscint', icon: 'text', desc: 'Exam technique and question words', notes: ['leamh'], match: ['ceistfhocail'], quiz: ['ceistfhocail'] }
    ],

    /* The November assessment run-through (course.js): Spás, gramadach, mé féin, léamhthuiscint. */
    courses: {
      nov: { label: 'November assessment run-through', intro: 'Pass each check, then get your two Spás answers ready. Read Spás and its notes first if you haven’t.',
        sections: [
          { id: 'spas', h: 'Spás (Mícheál Ó Ruairc)', p: 'Know the story, the characters and the key phrases. Get 5 of 6 to pass each check.', checks: [
            { id: 'spasQ', label: 'Spás: ceisteanna', quiz: 'spasCeisteanna', topic: 'spas' },
            { id: 'spasEn', label: 'Spás: what happens', quiz: 'spasEnglish', topic: 'spas' }] },
          { id: 'gram', h: 'Gramadach', p: 'An aidiacht shealbhach (séimhiú, urú, h roimh ghuta) and ag / ar.', checks: [
            { id: 'aidiacht', label: 'An aidiacht shealbhach', quiz: 'aidiacht2', topic: 'aidiacht2' },
            { id: 'agAr', label: 'Ag agus ar', quiz: 'agAr', topic: 'mothu' }] },
          { id: 'me', h: 'Mé féin & mo theaghlach', p: 'Ages, personal numbers and jobs.', checks: [
            { id: 'aoiseanna', label: 'Aoiseanna', quiz: 'aoiseanna', topic: 'teaghlach' },
            { id: 'uimhreacha', label: 'Uimhreacha pearsanta', quiz: 'uimhreacha', topic: 'teaghlach' },
            { id: 'poist', label: 'Poist', quiz: 'poist', topic: 'teaghlach' }] },
          { id: 'leamh', h: 'Léamhthuiscint', p: 'Know your question words so you answer the right question.', checks: [
            { id: 'ceist', label: 'Ceistfhocail', quiz: 'ceistfhocail', topic: 'leamh' }] },
          { id: 'write', h: 'Ceist ar an ngearrscéal', p: 'Write your two answers here (or add a photo of your copy). Tick off what the question needs, then check your Irish.', paras: [
            { id: 'teama', title: '(a) An téama nó an teachtaireacht',
              items: [
                { t: 'The title and author: Spás le Mícheál Ó Ruairc', re: /sp[aá]s[^.]*[oó] ruairc|[oó] ruairc[^.]*sp[aá]s/i },
                { t: 'Name the theme: Is é an téama atá sa ghearrscéal seo ná …', re: /(t[eé]ama|teachtaireacht)/i },
                { t: 'Space and privacy: spás / príobháideacht', re: /(sp[aá]s|pr[ií]obh[aá]ideacht)\b[^.]*(sp[aá]s|pr[ií]obh[aá]ideacht|d[eé]ag[oó]ir)|d[eé]ag[oó]ir[^.]*(sp[aá]s|pr[ií]obh[aá]ideacht)/i },
                { t: 'Two examples from the story (her room, Aoife, Peadar, school, Mamó, Diarmaid…)', re: /\b(seomra|aoife|peadar|leanbh|scoil|m[uú]inteoir|mam[oó]|diarmaid|pr[ií]os[uú]nach|cill|tuismitheoir[ií])\b/gi, min: 2 },
                { t: 'A feeling: brón, frustrachas, dóchas…', re: /\b(br[oó]n|br[oó]nach|frustrachas|d[oó]chas|d[oó]chasach|uaigneas|fearg|br[uú])\b/i },
                { t: 'Extra: a phrase from the story (rún daingean, i ndeireadh na feide…)', re: /(r[uú]n daingean|i ndeireadh na feide|faoi bhois an chait|c[ií]or thuathail|osna [aá]thais)/i, extra: true }],
              starters: ['Is é Spás le Mícheál Ó Ruairc an gearrscéal a ndearna mé staidéar air.', 'Is é an téama atá sa ghearrscéal seo ná an gá atá ag déagóir le spás agus le príobháideacht.',
                'Bhí a saol ina chíor thuathail.', 'Bhí sí faoi bhois an chait acu.', 'Bhí sí i ndeireadh na feide.', 'Rinne sí rún daingean.'] },
            { id: 'marc', title: '(b) Marc as 10 agus do chúiseanna',
              items: [
                { t: 'The title and author: Spás le Mícheál Ó Ruairc', re: /sp[aá]s[^.]*[oó] ruairc|[oó] ruairc[^.]*sp[aá]s/i },
                { t: 'A mark: Thabharfainn … as 10 don ghearrscéal seo', re: /\b(\d+|aon|dh[aá]|tr[ií]|ceithre|c[uú]ig|s[eé]|seacht|ocht|naoi|deich)\s+as\s+(10|deich)\b/i },
                { t: 'Give a reason: mar … / toisc …', re: /\b(mar|toisc|de bharr|cionn is)\b/i },
                { t: 'At least two reasons (réalaíoch, dóchasach, thuig mé…)', re: /\b(r[eé]ala[ií]och|d[oó]chasach|thuig m[eé]|suimi[uú]il|corraitheach|br[oó]nach|taitneamhach|greannmhar|deireadh|cr[ií]och|carachtar)\b/gi, min: 2 }],
              starters: ['Thabharfainn 8 as 10 don ghearrscéal seo mar …', 'Tá an scéal réalaíoch.', 'Thuig mé conas a mhothaigh sí.', 'Tá an chríoch dóchasach.'] }] }
        ], rules: 'ga' }
    },
    notes: {
      scrudu: { label: 'An Scrúdú', sections: [
        { h: 'Na rannóga (the sections)', list: [
          '<b>Spás</b> le Mícheál Ó Ruairc — the short story (Ceist 10 style, 25 marc).',
          '<b>Léamhthuiscint</b> — reading comprehension.',
          '<b>Gramadach</b> — grammar: an aidiacht shealbhach, na réamhfhocail <i>ag</i> agus <i>ar</i>.'
        ] },
        { h: 'Ceist ar an ngearrscéal', list: [
          'Write the <b>title</b> (Spás) and the <b>author</b> (Mícheál Ó Ruairc) correctly.',
          '(a) Déan cur síos ar an <b>téama</b> nó ar an <b>teachtaireacht</b> atá sa ghearrscéal.',
          '(b) Bronn <b>marc idir 1 agus 10</b> ar an ngearrscéal agus mínigh do rogha.'
        ], tip: 'Use the <b>Ransú Smaointe</b> box for rough work: jot down your keywords first, then build your answer from them.' },
        { h: 'Léamhthuiscint', list: [
          'Highlight the <b>eochairfhocail</b> (keywords) in the question.',
          'Find and highlight the matching sentence in the text.',
          'Answer in full sentences, using the words from the text.'
        ] }
      ] },
      spasScéal: { label: 'An scéal (summary)', sections: [
        { h: 'Read the story', p: ['<i>Spás</i> by Mícheál Ó Ruairc is printed in the <i>Turas 3</i> textbook, which can be read online. ' +
          '<a class="link" href="https://content.yudu.com/web/1zxd4/0A1zxd5/turas-3/html/72.html?page=72" target="_blank" rel="noopener">Read Spás in Turas 3, page 72</a> (opens in a new tab).'],
          tip: 'Read it once for the story, then again with the notes below beside you.' },
        { h: 'Achoimre — summary in English', ol: [
          'Pádraigín is sitting in <b>French class</b> but isn’t listening. She is thinking about her life and how it has changed.',
          'Three months ago she had her <b>own room</b>. When a new baby, <b>Peadar</b>, was born, her younger sister <b>Aoife</b> was moved into her room. The two never got on.',
          'Before that she could do what she liked: read and listen to the radio until 1 a.m. and stay in bed until midday at weekends.',
          'Now she has <b>no privacy</b>. She had to turn off the lights at ten, Aoife woke her at seven with her noisy PlayStation and the baby cried all night.',
          'Her parents keep <b>pressuring</b> her to study more, but she can’t find a quiet corner. At weekends she has to mind Aoife and Peadar.',
          'Even at school there’s no relief: the <b>history teacher</b> accused her of looking out the window, so she was moved from the back bench to the <b>front</b> of the class.',
          'She feels like a <b>prisoner</b> locked in a cell and that everyone is against her.',
          'She thinks of <b>Diarmaid</b>, a kind boy she met last summer while staying with her grandmother in the countryside. They wrote letters, but her parents made her stop: her father says she should be ashamed, as she is doing her <b>Leaving Cert</b> this year.',
          'Now her parents won’t let her go to her grandmother’s on her own either. <b>Mamó’s house</b> was the one place she had her own room and her own space.',
          'She makes a <b>firm resolution (rún daingean)</b>: she will write to Mamó and ask to spend a holiday with her. If Mamó invites her, her parents can’t refuse. She’d have a month of space and a chance to see Diarmaid again.',
          'The bell rings and French is over. She gives a sigh — but this time it is a <b>sigh of happiness</b>.'
        ] },
        { h: 'Tús agus críoch (beginning and end)', kv: [
          ['Tús', 'Pádraigín lets out a sigh (<i>osna</i>) in class. She is sad and wants space.'],
          ['Críoch', 'She lets out another sigh, but it is an <i>osna áthais</i> (sigh of happiness) because she has a plan.']
        ], tip: 'The story begins and ends with a sigh: the first is sad, the last is hopeful.' }
      ] },
      spasCarachtair: { label: 'Na carachtair', sections: [
        { h: 'Pádraigín (an príomhcharachtar)', list: [
          'A teenage girl who wants <b>spás</b> (space) and <b>príobháideacht</b> (privacy).',
          '<b>Brónach</b> (sad) and <b>uaigneach</b> (lonely): she cries several times and feels no one has pity for her.',
          '<b>Frustrachas</b>: she feels everyone is against her and her life is <i>ina chíor thuathail</i> (in chaos).',
          '<b>Cliste / diongbháilte</b> (clever / determined): she makes a plan to get her space back.'
        ] },
        { h: 'Mamó (a seanmháthair)', list: [
          'Pádraigín and Mamó are <b>an-cheanúil ar a chéile</b> (very fond of each other). There is <b>tuiscint</b> (understanding) between them.',
          'Mamó gives her space. In Mamó’s house she has her own room and can come and go as she pleases.'
        ] },
        { h: 'Na carachtair eile', kv: [
          ['Aoife', 'Her younger sister. Moved into Pádraigín’s room; wakes her early with her PlayStation.'],
          ['Peadar', 'The new baby brother who cries all night.'],
          ['Na tuismitheoirí', 'Strict. They pressure her to study, stop her writing to Diarmaid and stop her visiting Mamó alone.'],
          ['Diarmaid', 'A kind, gentle boy (<i>caoin cneasta</i>) she met last summer in the countryside.'],
          ['An múinteoir staire', 'Accused her of looking out the window and moved her to the front bench.']
        ] }
      ] },
      spasTeama: { label: 'Téama & mothúcháin', sections: [
        { h: 'An téama', p: [
          'The main theme is the need for <b>spás</b> (space) and <b>príobháideacht</b> (privacy) as a teenager. Pádraigín has lost her space at home, at school and in her friendship with Diarmaid.',
          'Other themes: <b>brú</b> (pressure from parents and exams) and <b>an déagóir agus a tuismitheoirí</b> (a teenager and her parents).'
        ], tip: 'Sample line: <i>Is é an téama atá sa ghearrscéal seo ná an gá atá ag déagóir le spás agus le príobháideacht.</i>' },
        { h: 'Na mothúcháin', kv: [
          ['Brón (sadness)', 'She cries in class; she has lost her room, her privacy and contact with Diarmaid.'],
          ['Frustrachas (frustration)', 'Everyone is against her; she feels like a prisoner in a cell.'],
          ['Dóchas (hope)', 'Her <i>rún daingean</i> to write to Mamó; the story ends with an <i>osna áthais</i>.']
        ] },
        { h: 'Marc as 10 (sample reasons)', list: [
          'The story is <b>réalaíoch</b> (realistic): lots of teenagers share a room and feel pressure.',
          'I understood how Pádraigín felt (<i>thuig mé conas a mhothaigh sí</i>).',
          'The ending is <b>dóchasach</b> (hopeful).'
        ], tip: 'Give a mark and at least two reasons, e.g. <i>Thabharfainn 8 as 10 don ghearrscéal seo mar…</i>' }
      ] },
      aidiachtNotes: { label: 'Aidiacht Shealbhach', sections: [
        { h: 'Roimh chonsan (before a consonant)', kv: [
          ['mo, do, a (his)', '<b>Séimhiú</b>: mo charr, do pheann, a mhála'],
          ['a (her)', '<b>Gan athrú</b>: a carr, a peann, a mála'],
          ['ár, bhur, a (their)', '<b>Urú</b>: ár gcarr, bhur bpeann, a mbád']
        ], tip: 'm, l, n, r and s never take an urú: <i>ár mála, bhur múinteoir</i>.' },
        { h: 'Roimh ghuta (before a vowel)', kv: [
          ['mo, do', "<b>m' / d'</b>: m'athair, d'aintín"],
          ['a (his)', '<b>Gan athrú</b>: a athair'],
          ['a (her)', '<b>h</b>: a hathair'],
          ['ár, bhur, a (their)', '<b>n-</b>: ár n-athair, bhur n-aintín, a n-uncail']
        ], tip: "f takes séimhiú and then behaves like a vowel: <i>m'fhón póca, d'fhear</i>." }
      ] },
      teaghlachNotes: { label: 'Mé féin & mo theaghlach', sections: [
        { h: 'Aois (age)', kv: [
          ['1', 'aon bhliain d’aois'], ['2', 'dhá bhliain d’aois'], ['3–6', 'trí / ceithre / cúig / sé bliana d’aois'],
          ['7–10', 'seacht / ocht / naoi / deich mbliana d’aois'], ['13', 'trí bliana déag d’aois'], ['14', 'ceithre bliana déag d’aois']
        ], tip: 'Táim trí bliana déag d’aois. = I am thirteen years old.' },
        { h: 'Breithlá (birthday)', p: [
          '<b>Rugadh mé ar an</b> … lá de … = I was born on the … of …',
          'Sampla: <i>Rugadh mé ar an gcúigiú lá de Mhárta.</i>'
        ], kv: [
          ['Eanáir', 'de Eanáir'], ['Feabhra', 'd’Fheabhra'], ['Márta', 'de Mhárta'], ['Aibreán', 'd’Aibreán'],
          ['Bealtaine', 'de Bhealtaine'], ['Meitheamh', 'de Mheitheamh'], ['Iúil', 'd’Iúil'], ['Lúnasa', 'de Lúnasa'],
          ['Meán Fómhair', 'de Mheán Fómhair'], ['Deireadh Fómhair', 'de Dheireadh Fómhair'], ['Samhain', 'de Shamhain'], ['Nollaig', 'de Nollaig']
        ] },
        { h: 'Uimhreacha pearsanta (counting people)', p: ['duine (amháin), beirt, triúr, ceathrar, cúigear, seisear, seachtar, ochtar, naonúr, deichniúr'],
          tip: 'Tá cúigear i mo theaghlach. = There are five people in my family.' },
        { h: 'Poist (jobs)', list: [
          '<b>Is</b> múinteoir <b>í</b> mo mham. (her) — <b>Is</b> feirmeoir <b>é</b> mo dhaid. (him)',
          'Oibríonn sé / sí in ospidéal / i siopa / ar fheirm.'
        ] }
      ] },
      leamh: { label: 'Léamhthuiscint', sections: [
        { h: 'Na ceistfhocail (question words)', kv: [
          ['Cé?', 'Who?'], ['Cad? / Céard?', 'What?'], ['Cá? / Cén áit?', 'Where?'], ['Cathain? / Cén uair?', 'When?'],
          ['Cén fáth?', 'Why?'], ['Conas?', 'How?'], ['Cé mhéad?', 'How many / how much?'], ['Cén sórt?', 'What sort?'],
          ['Luaigh', 'Mention / state'], ['Ainmnigh', 'Name']
        ] },
        { h: 'Steps', ol: [
          'Read the questions first and <b>highlight the eochairfhocail</b>.',
          'Find the paragraph and <b>highlight the sentence</b> that answers it.',
          'Answer in Irish, taking the words from the text and changing them to suit the question (e.g. <i>mé</i> → <i>sé/sí</i>).',
          'If the question says <b>dhá phointe</b>, give two separate points.'
        ] }
      ] }
    },

    decks: {
      spasFocail: { label: 'Stór focal', cards: [
        { front: 'spás', back: 'space' },
        { front: 'príobháideacht', back: 'privacy' },
        { front: 'osna', back: 'a sigh\nLig sí osna. = She sighed.' },
        { front: 'tuismitheoirí', back: 'parents' },
        { front: 'saolaíodh leanbh', back: 'a baby was born' },
        { front: 'níor réitigh siad', back: 'they didn’t get on' },
        { front: 'glórach', back: 'noisy' },
        { front: 'ag caoineadh', back: 'crying' },
        { front: 'brú', back: 'pressure' },
        { front: 'aire a thabhairt do', back: 'to look after / mind' },
        { front: 'faoiseamh', back: 'relief' },
        { front: 'an binse cúil / tosaigh', back: 'the back / front bench' },
        { front: 'príosúnach', back: 'a prisoner' },
        { front: 'caoin cneasta', back: 'kind and gentle' },
        { front: 'cosc', back: 'a ban' },
        { front: 'tuiscint', back: 'understanding' },
        { front: 'cuireadh', back: 'an invitation' },
        { front: 'deis', back: 'a chance / opportunity' },
        { front: 'dóchas', back: 'hope' },
        { front: 'áthas', back: 'joy / happiness' }
      ] },
      spasNathanna: { label: 'Nathanna as an scéal', cards: [
        { front: 'ina chíor thuathail', sub: 'Bhí a saol ina chíor thuathail.', back: 'in a mess / in chaos' },
        { front: 'faoi bhois an chait', sub: 'Bhí sí faoi bhois an chait acu.', back: 'under someone’s thumb\n(lit. under the cat’s paw)' },
        { front: 'i ndeireadh na feide', sub: 'Bhí sí i ndeireadh na feide.', back: 'at the end of her tether' },
        { front: 'ar a sáimhín só', back: 'at ease / happy and content' },
        { front: 'rún daingean', sub: 'Rinne sí rún daingean.', back: 'a firm resolution' },
        { front: 'an-cheanúil ar a chéile', sub: 'Bhí sí féin agus a Mamó an-cheanúil ar a chéile.', back: 'very fond of each other' },
        { front: 'ar a toil', sub: 'Bhí an saol ar a toil aici.', back: 'as she pleased' },
        { front: 'in ord is in eagar', back: 'neat and in order' },
        { front: 'chuir sé ina leith', back: 'he accused her' },
        { front: 'osna áthais', back: 'a sigh of happiness' }
      ] },
      mothuFocail: { label: 'Mothúcháin le ar', cards: [
        { front: 'Tá brón orm.', back: 'I am sad.' },
        { front: 'Tá áthas uirthi.', back: 'She is happy.' },
        { front: 'Tá fearg air.', back: 'He is angry.' },
        { front: 'Tá eagla orainn.', back: 'We are afraid.' },
        { front: 'Tá díomá orthu.', back: 'They are disappointed.' },
        { front: 'Tá náire ort.', back: 'You are embarrassed.' },
        { front: 'Tá imní orm.', back: 'I am worried.' },
        { front: 'Tá tuirse uirthi.', back: 'She is tired.' },
        { front: 'Tá ocras air.', back: 'He is hungry.' },
        { front: 'Tá tart orainn.', back: 'We are thirsty.' }
      ] },
      poist: { label: 'Poist (jobs)', cards: [
        { front: 'múinteoir', back: 'teacher' }, { front: 'dochtúir', back: 'doctor' }, { front: 'altra', back: 'nurse' },
        { front: 'feirmeoir', back: 'farmer' }, { front: 'siopadóir', back: 'shopkeeper' }, { front: 'innealtóir', back: 'engineer' },
        { front: 'garda', back: 'garda (police officer)' }, { front: 'fiaclóir', back: 'dentist' }, { front: 'cuntasóir', back: 'accountant' },
        { front: 'leictreoir', back: 'electrician' }, { front: 'siúinéir', back: 'carpenter' }, { front: 'tréidlia', back: 'vet' },
        { front: 'rúnaí', back: 'secretary' }, { front: 'meicneoir', back: 'mechanic' }, { front: 'cócaire', back: 'cook / chef' },
        { front: 'gruagaire', back: 'hairdresser' }
      ] },
      uimhreacha: { label: 'Uimhreacha pearsanta', cards: [
        { front: '1 person', back: 'duine (amháin)' }, { front: '2 people', back: 'beirt' }, { front: '3 people', back: 'triúr' },
        { front: '4 people', back: 'ceathrar' }, { front: '5 people', back: 'cúigear' }, { front: '6 people', back: 'seisear' },
        { front: '7 people', back: 'seachtar' }, { front: '8 people', back: 'ochtar' }, { front: '9 people', back: 'naonúr' },
        { front: '10 people', back: 'deichniúr' }
      ] }
    },

    quizzes: {
      spasCeisteanna: { label: 'Spás: ceisteanna', questions: [
        { q: 'Cé a scríobh an gearrscéal “Spás”?', ans: ['Mícheál Ó Ruairc'], opts: ['Pádraig Mac Piarais', 'Máirtín Ó Cadhain', 'Peig Sayers'] },
        { q: 'Cén rang ina raibh Pádraigín ag tús an scéil?', ans: ['An rang Fraincise'], opts: ['An rang staire', 'An rang Gaeilge', 'An rang matamaitice'] },
        { q: 'Cén fáth ar cuireadh Aoife in aon seomra le Pádraigín?', ans: ['Saolaíodh leanbh nua, Peadar'], opts: ['Bhí Mamó ag teacht chun fanacht', 'Bhí Aoife tinn', 'Bhog an teaghlach go teach nua'] },
        { q: 'Cad a dhéanadh Pádraigín go dtí a haon a chlog ar maidin?', ans: ['Bhíodh sí ag léamh agus ag éisteacht leis an raidió'], opts: ['Bhíodh sí ag imirt ar an Playstation', 'Bhíodh sí ag déanamh staidéir', 'Bhíodh sí ag scríobh litreacha chuig Mamó'] },
        { q: 'Cad a rinne Aoife ag a seacht a chlog ar maidin?', ans: ['Dhúisigh sí Pádraigín lena Playstation'], opts: ['Mhúch sí na soilse', 'Chaoin sí an oíche go léir', 'Léigh sí litir Dhiarmada'] },
        { q: 'Cad a chuir an múinteoir staire i leith Phádraigín?', ans: ['Go raibh sí ag féachaint amach an fhuinneog'], opts: ['Go raibh sí ag caint sa rang', 'Nach ndearna sí a hobair bhaile', 'Go raibh sí déanach don rang'] },
        { q: 'Cá raibh Pádraigín ina suí sa rang roimhe sin?', ans: ['Ar an mbinse cúil'], opts: ['Ar an mbinse tosaigh', 'In aice an dorais', 'In aice le hAoife'] },
        { q: 'Cé hé Diarmaid?', ans: ['Buachaill a bhuail sí leis faoin tuath an samhradh seo caite'], opts: ['A deartháir óg', 'An múinteoir staire', 'Cara scoile léi sa chathair'] },
        { q: 'Cén fáth nár lig a tuismitheoirí di scríobh chuig Diarmaid?', ans: ['Bhí sí ag ullmhú do scrúdú mór'], opts: ['Ní raibh siad sásta le Mamó', 'Bhí Diarmaid ina chónaí thar lear', 'Níor thaitin Diarmaid le Mamó'] },
        { q: 'Cén rún daingean a rinne sí?', ans: ['Scríobhfadh sí chuig a Mamó'], opts: ['Ghlanfadh sí a seomra', 'D’éistfeadh sí sa rang', 'Rachadh sí abhaile go luath'] },
        { q: 'Cén deis a bheadh aici dá gcaithfeadh sí mí le Mamó?', ans: ['Bheadh spás aici agus bhuailfeadh sí le Diarmaid arís'], opts: ['Bheadh sí in ann staidéar a dhéanamh', 'Bheadh sí in ann aire a thabhairt do Pheadar', 'Gheobhadh sí Playstation nua'] },
        { q: 'Cén sórt osna a lig sí ag deireadh an scéil?', ans: ['Osna áthais'], opts: ['Osna bróin', 'Osna feirge', 'Osna tuirse'] }
      ] },
      spasEnglish: { label: 'Spás: in English', questions: [
        { q: 'Why does Pádraigín feel she has no privacy at home?', ans: ['She has to share her room with Aoife'], opts: ['Her parents read her diary', 'Mamó moved in with them', 'She sleeps in the sitting room'] },
        { q: 'What time did she have to turn off the lights?', ans: ['Ten o’clock'], opts: ['Nine o’clock', 'Eleven o’clock', 'Midnight'] },
        { q: 'What does she have to do at the weekend if her parents go out?', ans: ['Mind Aoife and Peadar'], opts: ['Visit Mamó', 'Clean the house', 'Go to study classes'] },
        { q: 'How does she describe herself when she feels trapped?', ans: ['Like a prisoner locked in a cell'], opts: ['Like a bird in a cage', 'Like a fish out of water', 'Like a ghost in the house'] },
        { q: 'Why is Mamó’s house special to her?', ans: ['She has her own room and space there'], opts: ['It is beside the sea', 'Diarmaid lives there', 'She can watch TV all day'] },
        { q: 'What is the main theme of the story?', ans: ['A teenager’s need for space and privacy'], opts: ['Friendship at school', 'Life in the countryside', 'Learning a new language'] },
        { q: 'How does Pádraigín feel at the start of the story, and at the end?', ans: ['Sad at the start, hopeful at the end'], opts: ['Angry at the start, calm at the end', 'Happy at the start, sad at the end', 'Bored at the start, excited at the end'] },
        { q: 'Why can’t her parents object to her plan?', ans: ['Mamó would be the one inviting her'], opts: ['She would pay for it herself', 'Diarmaid would ask them', 'The school arranged it'] }
      ] },
      aidiacht2: { label: 'Aidiacht Shealbhach', questions: [
        { q: 'mo + carr', ans: ['mo charr'], opts: ['mo carr', 'mo gcarr', "m'carr"] },
        { q: 'a (her) + athair', ans: ['a hathair'], opts: ['a athair', 'a n-athair', "a'athair"] },
        { q: 'ár + teaghlach', ans: ['ár dteaghlach'], opts: ['ár theaghlach', 'ár teaghlach', 'ár nteaghlach'] },
        { q: 'mo + uncail', ans: ["m'uncail"], opts: ['mo uncail', 'mo huncail', 'mo n-uncail'] },
        { q: 'a (his) + deirfiúr', ans: ['a dheirfiúr'], opts: ['a deirfiúr', 'a ndeirfiúr', 'a hdeirfiúr'] },
        { q: 'a (their) + aintín', ans: ['a n-aintín'], opts: ['a haintín', 'a aintín', "a'aintín"] },
        { q: 'bhur + múinteoir', ans: ['bhur múinteoir'], opts: ['bhur mhúinteoir', 'bhur mbúinteoir', 'bhur n-múinteoir'] },
        { q: 'do + seomra', ans: ['do sheomra'], opts: ['do seomra', 'do tseomra', "d'seomra"] },
        { q: 'mo + fón póca', ans: ["m'fhón póca"], opts: ['mo fón póca', 'mo bhfón póca', 'mo fhón póca'] },
        { q: 'a (her) + deartháir', ans: ['a deartháir'], opts: ['a dheartháir', 'a ndeartháir', 'a hdeartháir'] },
        { q: 'ár + peann', ans: ['ár bpeann'], opts: ['ár pheann', 'ár peann', 'ár mpeann'] },
        { q: 'a (his) + athair', ans: ['a athair'], opts: ['a hathair', "a'athair", 'a n-athair'] }
      ] },
      agAr: { label: 'Ag agus Ar', questions: [
        { b: 'Tá brón', h: '(ar + sí)', a: 'mar níl spás aici.', ans: ['uirthi'] },
        { b: 'Tá fearg', h: '(ar + sé)', a: 'leis an múinteoir.', ans: ['air'] },
        { b: 'Tá deirfiúr óg', h: '(ag + sí)', a: 'darb ainm Aoife.', ans: ['aici'] },
        { b: 'Tá eagla', h: '(ar + mé)', a: 'roimh an scrúdú.', ans: ['orm'] },
        { b: 'Bhí seomra dá cuid féin', h: '(ag + sí)', a: 'tráth.', ans: ['aici'] },
        { b: 'Tá áthas', h: '(ar + muid)', a: 'inniu.', ans: ['orainn'] },
        { b: 'An bhfuil tuirse', h: '(ar + tú)', a: '?', ans: ['ort'] },
        { b: 'Tá díomá', h: '(ar + siad)', a: '.', ans: ['orthu'] },
        { b: 'Tá rothar nua', h: '(ag + sé)', a: '.', ans: ['aige'] },
        { b: 'An bhfuil peata', h: '(ag + sibh)', a: '?', ans: ['agaibh'] }
      ], distractors: reamhDistractors },
      poist: { label: 'Poist', questions: [
        { q: 'dochtúir', ans: ['doctor'] }, { q: 'altra', ans: ['nurse'] }, { q: 'feirmeoir', ans: ['farmer'] },
        { q: 'innealtóir', ans: ['engineer'] }, { q: 'fiaclóir', ans: ['dentist'] }, { q: 'cuntasóir', ans: ['accountant'] },
        { q: 'leictreoir', ans: ['electrician'] }, { q: 'siúinéir', ans: ['carpenter'] }, { q: 'tréidlia', ans: ['vet'] },
        { q: 'meicneoir', ans: ['mechanic'] }, { q: 'gruagaire', ans: ['hairdresser'] }, { q: 'siopadóir', ans: ['shopkeeper'] }
      ] },
      uimhreacha: { label: 'Uimhreacha pearsanta', questions: [
        { q: 'Tá ___ i mo theaghlach. (5 people)', ans: ['cúigear'] },
        { q: 'Tá ___ deirfiúracha agam. (2 people)', ans: ['beirt'] },
        { q: 'Tá ___ deartháireacha agam. (3 people)', ans: ['triúr'] },
        { q: 'Tá ___ i mo theaghlach. (4 people)', ans: ['ceathrar'] },
        { q: 'Tá ___ i mo theaghlach. (6 people)', ans: ['seisear'] },
        { q: 'Tá ___ i mo theaghlach. (7 people)', ans: ['seachtar'] },
        { q: '8 people', ans: ['ochtar'] }, { q: '9 people', ans: ['naonúr'] }, { q: '10 people', ans: ['deichniúr'] }
      ] },
      aoiseanna: { label: 'Aoiseanna', questions: [
        { q: 'I am 13 years old.', ans: ['Táim trí bliana déag d’aois.'], opts: ['Táim trí bhliain déag d’aois.', 'Táim trí mbliana déag d’aois.', 'Táim trí bliain déag d’aois.'] },
        { q: 'He is 2 years old.', ans: ['Tá sé dhá bhliain d’aois.'], opts: ['Tá sé dhá bliana d’aois.', 'Tá sé dhá mbliana d’aois.', 'Tá sé dó bliain d’aois.'] },
        { q: 'She is 7 years old.', ans: ['Tá sí seacht mbliana d’aois.'], opts: ['Tá sí seacht bliana d’aois.', 'Tá sí seacht bhliain d’aois.', 'Tá sí seacht bliain d’aois.'] },
        { q: 'My brother is 4 years old.', ans: ['Tá mo dheartháir ceithre bliana d’aois.'], opts: ['Tá mo dheartháir ceithre mbliana d’aois.', 'Tá mo dheartháir ceithre bhliain d’aois.', 'Tá mo deartháir ceithre bliana d’aois.'] },
        { q: 'The baby is 1 year old.', ans: ['Tá an leanbh aon bhliain d’aois.'], opts: ['Tá an leanbh aon bliana d’aois.', 'Tá an leanbh aon mbliain d’aois.', 'Tá an leanbh a haon bliain d’aois.'] },
        { q: 'I am 14 years old.', ans: ['Táim ceithre bliana déag d’aois.'], opts: ['Táim ceithre mbliana déag d’aois.', 'Táim ceithre bhliain déag d’aois.', 'Táim ceathair bliana déag d’aois.'] }
      ] },
      ceistfhocail: { label: 'Ceistfhocail', questions: [
        { q: 'Cén fáth?', ans: ['Why?'] }, { q: 'Cathain?', ans: ['When?'] }, { q: 'Cé?', ans: ['Who?'] },
        { q: 'Cá?', ans: ['Where?'] }, { q: 'Conas?', ans: ['How?'] }, { q: 'Cé mhéad?', ans: ['How many?'] },
        { q: 'Cad?', ans: ['What?'] }, { q: 'Luaigh', ans: ['Mention / state'] }
      ] }
    },

    matches: {
      spasNathanna: { label: 'Nathanna', colL: 'Gaeilge', colR: 'English', pairs: [
        { left: 'ina chíor thuathail', right: 'in chaos' },
        { left: 'faoi bhois an chait', right: 'under someone’s thumb' },
        { left: 'i ndeireadh na feide', right: 'at the end of her tether' },
        { left: 'rún daingean', right: 'a firm resolution' },
        { left: 'an-cheanúil ar a chéile', right: 'very fond of each other' },
        { left: 'osna áthais', right: 'a sigh of happiness' },
        { left: 'príosúnach', right: 'a prisoner' }
      ] },
      spasMothu: { label: 'Carachtair', colL: 'Carachtar', colR: 'Cur síos', pairs: [
        { left: 'Pádraigín', right: 'Wants space and privacy' },
        { left: 'Aoife', right: 'Younger sister who shares her room' },
        { left: 'Peadar', right: 'New baby who cries all night' },
        { left: 'Mamó', right: 'Grandmother who gives her space' },
        { left: 'Diarmaid', right: 'Kind boy she met last summer' },
        { left: 'An múinteoir staire', right: 'Moved her to the front bench' }
      ] },
      mothuEn: { label: 'Mothúcháin', colL: 'Gaeilge', colR: 'English', pairs: [
        { left: 'brón', right: 'sadness' }, { left: 'áthas', right: 'happiness' }, { left: 'fearg', right: 'anger' },
        { left: 'eagla', right: 'fear' }, { left: 'dóchas', right: 'hope' }, { left: 'díomá', right: 'disappointment' },
        { left: 'imní', right: 'worry' }
      ] },
      poist: { label: 'Poist', colL: 'Gaeilge', colR: 'English', pairs: [
        { left: 'múinteoir', right: 'teacher' }, { left: 'altra', right: 'nurse' }, { left: 'feirmeoir', right: 'farmer' },
        { left: 'innealtóir', right: 'engineer' }, { left: 'tréidlia', right: 'vet' }, { left: 'siúinéir', right: 'carpenter' },
        { left: 'leictreoir', right: 'electrician' }
      ] },
      miosa: { label: 'Míonna', colL: 'Gaeilge', colR: 'English', pairs: [
        { left: 'Eanáir', right: 'January' }, { left: 'Feabhra', right: 'February' }, { left: 'Márta', right: 'March' },
        { left: 'Aibreán', right: 'April' }, { left: 'Bealtaine', right: 'May' }, { left: 'Meitheamh', right: 'June' },
        { left: 'Iúil', right: 'July' }, { left: 'Lúnasa', right: 'August' }, { left: 'Meán Fómhair', right: 'September' },
        { left: 'Deireadh Fómhair', right: 'October' }, { left: 'Samhain', right: 'November' }, { left: 'Nollaig', right: 'December' }
      ] },
      ceistfhocail: { label: 'Ceistfhocail', colL: 'Gaeilge', colR: 'English', pairs: [
        { left: 'Cé?', right: 'Who?' }, { left: 'Cad?', right: 'What?' }, { left: 'Cá?', right: 'Where?' },
        { left: 'Cathain?', right: 'When?' }, { left: 'Cén fáth?', right: 'Why?' }, { left: 'Conas?', right: 'How?' },
        { left: 'Cé mhéad?', right: 'How many?' }
      ] }
    },

    practice: {
      spasAchoimre: { label: 'Spás: líon na bearnaí', type: 'lines', intro: 'Fill in the missing word. Each answer comes from the story.', items: [
        { q: 'Theastaigh ___ ó Phádraigín.', h: '(space)', ans: ['spás'] },
        { q: 'Lig sí ___ sa rang.', h: '(a sigh)', ans: ['osna'] },
        { q: 'Saolaíodh leanbh óg darb ainm ___.', h: '(the baby’s name)', ans: ['Peadar'] },
        { q: 'Cuireadh a deirfiúr ___ isteach in aon seomra léi.', ans: ['Aoife'] },
        { q: 'Ní raibh aon ___ fágtha aici.', h: '(privacy)', ans: ['phríobháideacht', 'príobháideacht'] },
        { q: 'Bhí a tuismitheoirí ag cur ___ uirthi níos mó staidéir a dhéanamh.', h: '(pressure)', ans: ['brú'] },
        { q: 'Cuireadh ina suí ar an mbinse ___ í.', h: '(front: after binse, tosach changes form, like cúl in an binse cúil)', ans: ['tosaigh'] },
        { q: 'Bhí a saol ina chíor ___ ar fad.', ans: ['thuathail'] },
        { q: 'Bhí sí ar nós ___ faoi ghlas sa chillín.', h: '(a prisoner)', ans: ['príosúnaigh'] },
        { q: 'Bhuail sí le ___ an samhradh seo caite.', ans: ['Diarmaid'] },
        { q: 'Rinne sí rún ___.', h: '(firm)', ans: ['daingean'] },
        { q: 'Ag an deireadh, lig sí osna ___.', h: '(of happiness)', ans: ['áthais'] }
      ] },
      aidiachtTable: { label: 'Tábla: carr & athair', type: 'table', intro: 'Write each possessive adjective with carr (a consonant) and athair (a vowel).',
        cols: ['Aidiacht', 'carr (car)', 'athair (father)'],
        rows: [
          ['mo (my)', { k: 'carr_0', ans: ['mo charr'] }, { k: 'athair_0', ans: ["m'athair"] }],
          ['do (your)', { k: 'carr_1', ans: ['do charr'] }, { k: 'athair_1', ans: ["d'athair"] }],
          ['a (his)', { k: 'carr_2', ans: ['a charr'] }, { k: 'athair_2', ans: ['a athair'] }],
          ['a (her)', { k: 'carr_3', ans: ['a carr'] }, { k: 'athair_3', ans: ['a hathair'] }],
          ['ár (our)', { k: 'carr_4', ans: ['ár gcarr'] }, { k: 'athair_4', ans: ['ár n-athair'] }],
          ['bhur (your pl.)', { k: 'carr_5', ans: ['bhur gcarr'] }, { k: 'athair_5', ans: ['bhur n-athair'] }],
          ['a (their)', { k: 'carr_6', ans: ['a gcarr'] }, { k: 'athair_6', ans: ['a n-athair'] }]
        ] },
      aidiachtSentences: { label: 'Abairtí', type: 'lines', intro: 'Write the noun with the correct mutation.', hintBefore: false, items: [
        { b: 'Tá', h: '[mo + máthair]', a: 'ag obair.', ans: ['mo mháthair'] },
        { b: 'Is múinteoir é', h: '[a (her) + uncail]', a: '.', ans: ['a huncail'] },
        { b: 'Cá bhfuil', h: '[do + mála]', a: '?', ans: ['do mhála'] },
        { b: 'Tá', h: '[ár + teach]', a: 'mór.', ans: ['ár dteach'] },
        { b: 'Bhí', h: '[a (their) + seanmháthair]', a: 'faoin tuath.', ans: ['a seanmháthair'] },
        { b: 'Chaill sé', h: '[a (his) + fón]', a: '.', ans: ['a fhón'] },
        { b: 'Tá', h: '[mo + aintín]', a: 'ina cónaí i gCorcaigh.', ans: ["m'aintín"] },
        { b: 'Tá', h: '[bhur + bricfeasta]', a: 'réidh.', ans: ['bhur mbricfeasta'] }
      ] },
      agAr: { label: 'Ag agus Ar', type: 'lines', hintBefore: true, intro: 'Type the correct form of ag or ar.', ref: reamhRef, items: null },
      teaghlach: { label: 'Mé féin', type: 'lines', intro: 'Complete each sentence about yourself and your family.', items: [
        { q: 'Táim trí bliana ___ d’aois.', h: '(13)', ans: ['déag'] },
        { q: 'Tá ___ i mo theaghlach.', h: '(5 people)', ans: ['cúigear'] },
        { q: 'Rugadh mé ar an gcúigiú lá de ___.', h: '(March)', ans: ['Mhárta'] },
        { q: 'Rugadh mé ar an dara lá ___ Aibreán.', h: '(of)', ans: ["d'"] },
        { q: 'Is múinteoir ___ mo mham.', h: '(her)', ans: ['í'] },
        { q: 'Is feirmeoir ___ mo dhaid.', h: '(him)', ans: ['é'] },
        { q: 'Tá ___ deartháireacha agam.', h: '(3 people)', ans: ['triúr'] },
        { q: '___ sé in ospidéal.', h: '(He works)', ans: ['Oibríonn'] }
      ] }
    }
  };
  y2.practice.agAr.items = y2.quizzes.agAr.questions;

  window.SN_DATA.irish = {
    id: 'irish',
    title: 'Gaeilge',
    subtitle: 'Irish language',
    mobTitle: 'Gaeilge / Irish',
    exemptType: 'irish',
    marking: { spelling: 'strict', note: 'Gaeilge: in gramadach and scríobh questions the Irish spelling, fadas and grammar count. Answers in English (léamhthuiscint in English) are marked for meaning only.' },
    years: { '1': y1, '2': y2 }
  };
})();
