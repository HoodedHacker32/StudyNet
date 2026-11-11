/* StudyNet — exam run-through (a per-topic activity, "Run-through"). Data: Y.courses[key] = { label, intro, sections: [
     { id, h, p, checks: [{ id, label, quiz, topic }] }            quick checks built from that quiz: 5 of 6 to pass
     { id, h, p, paras: [{ id, title, items: [{ t, re, min?, extra? }], starters: [str] }] }  the writing workshop
   ], rules: 'fr' }
   The workshop ticks off the teacher's checklist as you type, finds common mistakes instantly with the rules below (no AI),
   and can ask StudyNet's checker (worker /check) to point out mistakes with a fix for each. It never writes the paragraph.
   Progress: localStorage sn_course_<subject>_y<year> = { q: { checkId: best }, p: { paraId: { text, done } } }. */
(function () {
  'use strict';
  if (!window.SubjectApp) return;

  /* ── Instant checks: common mistakes in French paragraphs ── */
  var MONTHS = 'janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre';
  var CAP_DATES = 'Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Août|Septembre|Octobre|Novembre|Décembre|Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche';
  var PLACES = { m: ['cinéma', 'parc', 'stade', 'supermarché', 'musée', 'château', 'café', 'restaurant', 'marché', 'centre commercial', 'centre sportif', 'collège', 'port', 'hôtel', 'hôpital', 'théâtre', 'bowling', 'club des jeunes', 'terrain de foot'],
    f: ['piscine', 'plage', 'bibliothèque', 'gare', 'patinoire', 'boulangerie', 'pharmacie', 'poste', 'mairie', 'banque', 'boucherie', 'librairie', 'salle de sport', 'aire de jeux', 'église', 'école'] };
  var INSTR = { m: ['piano', 'violon', 'saxophone', 'violoncelle', 'synthétiseur', 'clavier', 'ukulélé', 'tambour', 'accordéon', 'orgue', 'harmonica'],
    f: ['guitare', 'batterie', 'flûte', 'trompette', 'clarinette', 'harpe', 'basse'] };
  var SPORTS = { m: ['foot', 'football', 'tennis', 'rugby', 'hockey', 'basket', 'golf', 'badminton', 'volley', 'hurling', 'cricket', 'ping-pong', 'squash'], f: ['pétanque', 'camogie'], p: ['cartes', 'jeux vidéo', 'échecs'] };
  var ACTS = { m: ['vélo', 'ski', 'surf', 'judo', 'karaté', 'patinage', 'skate', 'sport', 'cheval', 'athlétisme', 'yoga'], f: ['natation', 'danse', 'gymnastique', 'voile', 'musculation', 'randonnée', 'équitation', 'escalade', 'boxe'] };
  var FEM_ADJ = { grand: 'grande', petit: 'petite', gentil: 'gentille', sportif: 'sportive', intelligent: 'intelligente', amusant: 'amusante', marrant: 'marrante',
    'sérieux': 'sérieuse', paresseux: 'paresseuse', bavard: 'bavarde', 'méchant': 'méchante', patient: 'patiente', joli: 'jolie', beau: 'belle', grand_: '' };
  var MASC_ADJ = {}; Object.keys(FEM_ADJ).forEach(function (k) { if (FEM_ADJ[k]) MASC_ADJ[FEM_ADJ[k]] = k; });
  function vowel(w) { return /^[aeiouyàâéèêëîïôûùh]/i.test(w) && !/^(harpe|hockey|hurling|handball)/i.test(w); }
  function gender(map, w) { w = w.toLowerCase(); return map.m.indexOf(w) >= 0 ? 'm' : map.f.indexOf(w) >= 0 ? 'f' : map.p && map.p.indexOf(w) >= 0 ? 'p' : null; }
  function words(list) { return list.slice().sort(function (a, b) { return b.length - a.length; }).join('|'); }
  var PL = words(PLACES.m.concat(PLACES.f)), IN = words(INSTR.m.concat(INSTR.f)), SP = words(SPORTS.m.concat(SPORTS.f, SPORTS.p)), AC = words(ACTS.m.concat(ACTS.f));
  function aForm(g, w) { return g === 'p' ? 'aux' : vowel(w) ? 'à l’' : g === 'f' ? 'à la' : 'au'; }
  function deForm(g, w) { return g === 'p' ? 'des' : vowel(w) ? 'de l’' : g === 'f' ? 'de la' : 'du'; }
  function join(art, w) { return /’$/.test(art) ? art + w : art + ' ' + w; }

  var RULES = { fr: [
    { re: /\b(je suis|tu es|il est|elle est)\s+(\S+)\s+ans\b/gi, fix: function (m, s, n) { return { 'je suis': 'j’ai', 'tu es': 'tu as', 'il est': 'il a', 'elle est': 'elle a' }[s.toLowerCase()] + ' ' + n + ' ans'; },
      why: 'Age uses avoir, not être: j’ai treize ans (literally “I have 13 years”).' },
    { re: /\bje suis\s+(onze|douze|treize|quatorze|quinze|\d+)\b(?!\s+ans)/gi, fix: function (m, n) { return 'j’ai ' + n + ' ans'; }, why: 'Age uses avoir and needs ans: j’ai treize ans.' },
    { re: /\bà le\b/gi, fix: 'au', why: 'à + le joins up to make au: je vais au cinéma.' },
    { re: /\bà les\b/gi, fix: 'aux', why: 'à + les joins up to make aux: je vais aux magasins.' },
    { re: /\bde le\b/gi, fix: 'du', why: 'de + le joins up to make du: je joue du piano.' },
    { re: /\bde les\b/gi, fix: 'des', why: 'de + les joins up to make des.' },
    { re: /\bje\s+(ai|habite|aime|adore|appelle|écoute|étudie|apprends|en)\b/gi, fix: function (m, w) { return 'j’' + w; }, why: 'je becomes j’ before a vowel or silent h: j’ai, j’habite.' },
    { re: /\b(le|la)\s+(école|église|Irlande|hôpital|équitation|athlétisme|ouest|est|escalade|accordéon|anglais|histoire|hôtel)\b/gi, fix: function (m, a, w) { return 'l’' + w; },
      why: 'le and la become l’ before a vowel or silent h: l’école, l’Irlande.' },
    { re: /\b(n['’]y a pas|n['’]ai pas)\s+(un|une|des)\s+(?=(\S))/gi, fix: function (m, neg, art, c) { return neg + ' ' + (vowel(c) ? 'd’' : 'de '); },
      why: 'After a negative (pas), un / une / des become de (d’ before a vowel): il n’y a pas de gare.' },
    { re: new RegExp('\\b(un|une|le|la|au|à la|du|de la)\\s+(' + PL + ')\\b', 'gi'), fix: function (m, art, w) {
        var g = gender(PLACES, w), a = art.toLowerCase(), right;
        if (!g) return null;
        if (a === 'un' || a === 'une') right = g === 'f' ? 'une' : 'un';
        else if (a === 'le' || a === 'la') right = vowel(w) ? 'l’' : g === 'f' ? 'la' : 'le';
        else if (a === 'au' || a === 'à la') right = aForm(g, w);
        else right = deForm(g, w);
        return right === a ? null : join(right, w);
      }, why: function (m, art, w) { var g = gender(PLACES, w); return w + ' is ' + (g === 'f' ? 'feminine' : 'masculine') + (vowel(w) ? ' and starts with a vowel' : '') + ', so it’s ' + (g === 'f' ? 'une / la / à la' : 'un / le / au') + (vowel(w) ? ' (l’ / à l’ before the vowel)' : '') + '.'; } },
    { re: new RegExp('\\b(jou(?:e|es|ons|ez|ent|er))\\s+(au|à la|à l[\'’]|aux)\\s*(' + IN + ')\\b', 'gi'), fix: function (m, v, art, w) { return v + ' ' + join(deForm(gender(INSTR, w), w), w); },
      why: 'Instruments use jouer de (du / de la / de l’), not à: je joue du piano, je joue de la guitare.' },
    { re: new RegExp('\\b(jou(?:e|es|ons|ez|ent|er))\\s+(du|de la|de l[\'’]|des)\\s*(' + SP + ')\\b', 'gi'), fix: function (m, v, art, w) { return v + ' ' + join(aForm(gender(SPORTS, w), w), w); },
      why: 'Sports and games use jouer à (au / à la / aux), not de: je joue au foot.' },
    { re: new RegExp('\\b(jou(?:e|es|ons|ez|ent|er))\\s+(' + SP + '|' + IN + ')\\b', 'gi'), fix: function (m, v, w) {
        var g = gender(INSTR, w); return v + ' ' + (g ? join(deForm(g, w), w) : join(aForm(gender(SPORTS, w), w), w)); },
      why: 'Jouer needs a little word: à for sports (je joue au foot), de for instruments (je joue du piano).' },
    // The right little word, but the wrong form of it: je joue au échecs → aux échecs, du guitare → de la guitare, de la vélo → du vélo.
    { re: new RegExp('\\b(jou(?:e|es|ons|ez|ent|er))\\s+(au|à la|à l[\'’]|aux)\\s*(' + SP + ')\\b', 'gi'), fix: function (m, v, art, w) {
        var right = aForm(gender(SPORTS, w), w); return right.replace('’', '') === art.toLowerCase().replace(/['’]/, '') ? null : v + ' ' + join(right, w); },
      why: function (m, v, art, w) { var g = gender(SPORTS, w); return w + ' is ' + (g === 'p' ? 'plural, so à + les = aux' : vowel(w) ? 'a word starting with a vowel, so it’s à l’' : g === 'f' ? 'feminine, so it’s à la' : 'masculine, so à + le = au') + '.'; } },
    { re: new RegExp('\\b(jou(?:e|es|ons|ez|ent|er))\\s+(du|de la|de l[\'’]|des)\\s*(' + IN + ')\\b', 'gi'), fix: function (m, v, art, w) {
        var right = deForm(gender(INSTR, w), w); return right.replace('’', '') === art.toLowerCase().replace(/['’]/, '') ? null : v + ' ' + join(right, w); },
      why: function (m, v, art, w) { var g = gender(INSTR, w); return w + ' is ' + (vowel(w) ? 'a word starting with a vowel, so it’s de l’' : g === 'f' ? 'feminine, so it’s de la' : 'masculine, so de + le = du') + '.'; } },
    { re: new RegExp('\\b(fais|fait|faisons|faites|font|faire)\\s+(du|de la|de l[\'’]|des)\\s*(' + AC + ')\\b', 'gi'), fix: function (m, v, art, w) {
        var right = deForm(gender(ACTS, w), w); return right.replace('’', '') === art.toLowerCase().replace(/['’]/, '') ? null : v + ' ' + join(right, w); },
      why: function (m, v, art, w) { var g = gender(ACTS, w); return w + ' is ' + (vowel(w) ? 'a word starting with a vowel, so it’s de l’' : g === 'f' ? 'feminine, so it’s de la' : 'masculine, so de + le = du') + '.'; } },
    { re: new RegExp('\\b(fais|fait|faisons|faites|font|faire)\\s+(le|la|les|au|à la|à l[\'’])\\s*(' + AC + ')\\b', 'gi'), fix: function (m, v, art, w) { return v + ' ' + join(deForm(gender(ACTS, w), w), w); },
      why: 'Faire uses de (du / de la / de l’): je fais du vélo, je fais de la natation.' },
    { re: new RegExp('\\b(fais|fait|faisons|faites|font)\\s+(' + AC + ')\\b', 'gi'), fix: function (m, v, w) { return v + ' ' + join(deForm(gender(ACTS, w), w), w); },
      why: 'Faire needs du / de la / de l’ before the activity: je fais du vélo.' },
    { re: /\bune\s+(petit|grand|joli|beau)\s+ville\b/gi, fix: function (m, a) { return 'une ' + FEM_ADJ[a.toLowerCase()] + ' ville'; }, why: 'ville is feminine, so the adjective agrees: une petite ville.' },
    { re: /\bun\s+(petite|grande|jolie|belle)\s+village\b/gi, fix: function (m, a) { return 'un ' + MASC_ADJ[a.toLowerCase()] + ' village'; }, why: 'village is masculine, so the adjective has no -e: un petit village.' },
    { re: /\b(ma mère|ma sœur|ma soeur|elle|ma tante|ma cousine|ma grand-mère)\s+est\s+(très\s+|assez\s+)?(grand|petit|gentil|sportif|intelligent|amusant|marrant|sérieux|paresseux|bavard|méchant|patient)\b/gi,
      fix: function (m, who, adv, a) { return who + ' est ' + (adv || '') + FEM_ADJ[a.toLowerCase()]; }, why: 'Describing a girl or woman, the adjective is feminine: elle est grande, ma mère est gentille.' },
    { re: /\b(mon père|mon frère|il|mon oncle|mon cousin|mon grand-père)\s+est\s+(très\s+|assez\s+)?(grande|petite|gentille|sportive|intelligente|amusante|marrante|sérieuse|paresseuse|bavarde|méchante|patiente)\b/gi,
      fix: function (m, who, adv, a) { return who + ' est ' + (adv || '') + MASC_ADJ[a.toLowerCase()]; }, why: 'Describing a boy or man, the adjective is masculine: il est grand, mon père est gentil.' },
    { re: /\bmon\s+(mère|sœur|soeur|tante|cousine|grand-mère|famille|ville)\b/gi, fix: function (m, w) { return 'ma ' + w; }, why: 'This word is feminine, so “my” is ma: ma mère, ma ville.' },
    { re: /\bma\s+(père|frère|oncle|cousin|grand-père|village)\b/gi, fix: function (m, w) { return 'mon ' + w; }, why: 'This word is masculine, so “my” is mon: mon père, mon village.' },
    { re: /\bun\s+(sœur|soeur|mère|tante|cousine|grand-mère)\b/gi, fix: function (m, w) { return 'une ' + w; }, why: 'This word is feminine, so it’s une: une sœur.' },
    { re: /\bune\s+(frère|père|oncle|cousin|grand-père)\b/gi, fix: function (m, w) { return 'un ' + w; }, why: 'This word is masculine, so it’s un: un frère.' },
    { re: /\b(parce que|que|lorsque|puisque)\s+(elle|elles|il|ils|on|un|une|en|y)\b/gi, fix: function (m, q, w) { return q.slice(0, -1) + '’' + w; },
      why: 'que becomes qu’ before a vowel: parce qu’elle est animée.' },
    { re: /\bde\s+(Irlande)\b/g, fix: function (m, w) { return 'de l’' + w; }, why: 'Countries have le or la, which becomes l’ before a vowel: le sud de l’Irlande.' },
    { re: /\b[jJ]['’]habite\s+(en|dans|au)\s+(?!Irlande|France|Espagne|Angleterre|Écosse|Allemagne|Italie)([A-ZÀ-Ý][\w-]+)/g, fix: function (m, p, town) { return 'J’habite à ' + town; },
      why: 'For a town or city, “in” is à: j’habite à Cork. (En is for feminine countries: en Irlande.)' },
    { re: /\bil y a\s+(deux|trois|quatre|cinq|six|sept|huit|neuf|dix|\d+)\s+personne\b/gi, fix: function (m, n) { return 'il y a ' + n + ' personnes'; }, why: 'More than one person, so personne takes an -s: quatre personnes.' },
    { re: new RegExp('\\ble\\s+(\\S+)\\s+de\\s+(' + MONTHS + ')\\b', 'gi'), fix: function (m, d, mo) { return 'le ' + d + ' ' + mo; }, why: 'French dates have no “of”: le cinq mars.' },
    { re: new RegExp('([^.!?\\s«]\\s+)(' + CAP_DATES + ')\\b', 'g'), part: 2, fix: function (m, pre, w) { return w.toLowerCase(); }, why: 'Months and days have no capital letter in French: le cinq mars, le samedi.' }
  ],
  /* Irish: the grammar on the November assessment (an aidiacht shealbhach, ag agus ar). "a" (his / her / their) is left alone: it can't be told apart. */
  ga: [
    { re: /\b(mo|do)\s+([aeiouáéíóú][\wáéíóú-]*)/gi, fix: function (m, p, w) { return p.charAt(0) + '’' + w; },
      why: 'mo and do become m’ and d’ before a vowel: m’athair, d’aintín.' },
    { re: /\b(mo|do)\s+((?:[bcdfgmpt](?!h)|s(?=[aeiouáéíóúlnr]))[\wáéíóú-]*)/gi, fix: function (m, p, w) { return p + ' ' + lenite(w); },
      why: 'mo and do put a séimhiú (h) on a consonant: mo chara, do theach.' },
    { re: /\b(ár|bhur)\s+([bcdfgpt][\wáéíóú-]*)/gi, fix: function (m, p, w) { return eclipsed(w) ? null : p + ' ' + eclipse(w); },
      why: 'ár and bhur put an urú on the word: ár dteach, ár gcara, bhur bpeann.' },
    { re: /\b(ár|bhur)\s+([aeiouáéíóú][\wáéíóú-]*)/gi, fix: function (m, p, w) { return p + ' n-' + w; }, why: 'ár and bhur put n- before a vowel: ár n-athair.' },
    { re: /\b(tá|bhí|beidh|níl|ní raibh)\s+(brón|áthas|fearg|eagla|tuirse|ocras|tart|imní|uaigneas|díomá|éad|náire|sceitimíní|bród|codladh|slaghdán|tinneas)\s+ag\s+([\wáéíóú-]+)/gi,
      fix: function (m, v, f, who) { return v + ' ' + f + ' ' + arWith(who); }, why: 'Feelings use ar, not ag: tá brón ar Phádraigín (tá brón orm, uirthi, air).' },
    { re: /\b(ar|ag)\s+(mé|tú|sé|sí|muid|sinn|sibh|siad)\b/gi, fix: function (m, p, who) {
        var t = { ar: { 'mé': 'orm', 'tú': 'ort', 'sé': 'air', 'sí': 'uirthi', muid: 'orainn', sinn: 'orainn', sibh: 'oraibh', siad: 'orthu' },
          ag: { 'mé': 'agam', 'tú': 'agat', 'sé': 'aige', 'sí': 'aici', muid: 'againn', sinn: 'againn', sibh: 'agaibh', siad: 'acu' } };
        return t[p.toLowerCase()][who.toLowerCase()]; }, why: 'ar and ag join with the pronoun: orm, ort, air, uirthi; agam, agat, aige, aici.' }
  ] };
  function lenite(w) { return /^([bcdfgmpt](?!h)|s(?=[aeiouáéíóúlnr]))/i.test(w) ? w.charAt(0) + (w.charAt(0) === w.charAt(0).toUpperCase() ? 'h' : 'h') + w.slice(1) : w; }
  function eclipsed(w) { return /^(mb|gc|nd|bhf|ng|bp|dt)/i.test(w); }
  function eclipse(w) { var u = { b: 'm', c: 'g', d: 'n', f: 'bh', g: 'n', p: 'b', t: 'd' }[w.charAt(0).toLowerCase()]; return u ? u + w : w; }
  function arWith(who) {
    var p = { 'mé': 'orm', 'tú': 'ort', 'sé': 'air', 'sí': 'uirthi', muid: 'orainn', sibh: 'oraibh', siad: 'orthu' }[who.toLowerCase()];
    return p || 'ar ' + lenite(who);
  }
  // JavaScript's \b doesn't count accented letters as letters (à, é), so every \b becomes a Unicode-aware boundary.
  var L = '[\\p{L}\\p{N}_]', BOUND = '(?:(?<!' + L + ')(?=' + L + ')|(?<=' + L + ')(?!' + L + '))';
  function uni(re, g) {
    var f = re.flags.replace('g', '') + (g ? 'g' : '');
    return new RegExp(re.source.split('\\b').join(BOUND), f.indexOf('u') >= 0 ? f : f + 'u');
  }
  function localIssues(text, set) {
    var out = [], seen = {}, spans = [];
    (RULES[set] || []).forEach(function (r) {
      var re = uni(r.re, true), m;
      while ((m = re.exec(text))) {
        var right = typeof r.fix === 'function' ? r.fix.apply(null, m) : r.fix, wrong = r.part ? m[r.part] : m[0];
        if (right == null || right === wrong) continue;
        if (/^[A-ZÀ-Ý]/.test(wrong) && !r.part) right = right.charAt(0).toUpperCase() + right.slice(1);
        var key = wrong.toLowerCase(), at = m.index + (r.part ? m[0].lastIndexOf(wrong) : 0), end = at + wrong.length;
        if (seen[key] || spans.some(function (sp) { return at < sp[1] && sp[0] < end; })) continue; // the same words already have a fix
        seen[key] = 1; spans.push([at, end]);
        out.push({ wrong: wrong, right: right, why: typeof r.why === 'function' ? r.why.apply(null, m) : r.why });
      }
    });
    return out;
  }
  function covers(item, text) {
    var re = uni(item.re, true), n = (text.match(re) || []).length;
    if (item.min && item.re.flags.indexOf('g') >= 0) { // count different words, e.g. five different places
      var seen = {}; (text.match(re) || []).forEach(function (x) { seen[x.toLowerCase()] = 1; }); n = Object.keys(seen).length;
    }
    return n >= (item.min || 1);
  }

  SubjectApp.addMode({
    id: 'course', label: 'Run-through', icon: 'target', key: 'course', src: 'courses', at: 0,
    count: function (t, Y) { var c = Y.courses[t.course[0]]; var n = 0; c.sections.forEach(function (s) { n += (s.drills || []).length + (s.checks || []).length + (s.paras || []).length; }); return n + ' steps'; },
    init: function (el, api, keys) {
      var ic = api.ic, esc = api.esc, Y = api.Y, C = Y.courses[keys[0]], LANG = { fr: 'French', ga: 'Irish', en: 'English' }[C.rules] || 'writing', KEY = 'sn_course_' + api.cfg.id + '_y' + api.year;
      function st() { var s = SN.readJSON(KEY, null); if (!s || typeof s !== 'object') s = {}; s.q = s.q || {}; s.p = s.p || {}; s.d = s.d || {}; return s; }
      function save(s) { SN.writeJSON(KEY, s); }
      var quiz = null; // the check in progress

      function progress() {
        var s = st(), done = 0, all = 0;
        C.sections.forEach(function (sec) {
          (sec.drills || []).forEach(function (d) { all++; if (s.d[d.id] && s.d[d.id].done) done++; });
          (sec.checks || []).forEach(function (c) { all++; if ((s.q[c.id] || 0) >= 5) done++; });
          (sec.paras || []).forEach(function (p) { all++; if (s.p[p.id] && s.p[p.id].done) done++; });
        });
        return { done: done, all: all };
      }
      function home() {
        quiz = null;
        var s = st(), pr = progress();
        var h = '<div class="course"><div class="course-top"><div><h2 class="course-t">' + esc(C.label) + '</h2><p class="course-p">' + esc(C.intro) + '</p></div>' +
          '<div class="course-prog"><span><b class="num">' + pr.done + '</b> of <span class="num">' + pr.all + '</span> done</span><span class="bar" aria-hidden="true"><i style="width:' + Math.round(pr.done / pr.all * 100) + '%"></i></span></div></div>';
        C.sections.forEach(function (sec, si) {
          h += '<section class="course-sec" aria-labelledby="cs-' + sec.id + '"><h3 id="cs-' + sec.id + '"><span class="course-n num">' + (si + 1) + '</span>' + esc(sec.h) + '</h3><p class="course-p">' + esc(sec.p) + '</p><ul class="course-list">';
          (sec.drills || []).forEach(function (d) {
            var ds = s.d[d.id] || {}, ok = !!ds.done;
            h += '<li class="course-row' + (ok ? ' on' : '') + '"><span class="course-ok" aria-hidden="true">' + (ok ? ic('check') : '') + '</span><span class="course-l">' + esc(d.label) +
              '<span class="course-sub">' + d.items.length + ' questions · ' + (ok ? 'All known' : ds.first != null ? 'Knew ' + ds.first + ' of ' + d.items.length + ' first time' : 'Not started') + '</span></span>' +
              '<span class="course-btns"><button type="button" class="btn' + (ok ? '' : ' primary') + '" data-c-drill="' + d.id + '">' + (ok ? 'Again' : 'Start') + '</button>' +
              (d.topic ? '<button type="button" class="btn" data-c-rev="' + d.topic + '">Notes</button>' : '') + '</span></li>';
          });
          (sec.checks || []).forEach(function (c) {
            var best = s.q[c.id], ok = best >= 5;
            h += '<li class="course-row' + (ok ? ' on' : '') + '"><span class="course-ok" aria-hidden="true">' + (ok ? ic('check') : '') + '</span><span class="course-l">' + esc(c.label) +
              '<span class="course-sub">' + (best == null ? 'Not tried yet' : ok ? 'Passed: ' + best + ' of 6' : 'Best so far: ' + best + ' of 6') + '</span></span>' +
              '<span class="course-btns"><button type="button" class="btn" data-c-go="' + c.id + '">' + (ok ? 'Again' : 'Check') + '</button>' +
              (c.topic ? '<button type="button" class="btn" data-c-rev="' + c.topic + '">Revise</button>' : '') + '</span></li>' +
              '<li class="course-quiz hidden" id="cq-' + c.id + '"></li>';
          });
          (sec.paras || []).forEach(function (p) {
            var ps = s.p[p.id] || {}, txt = ps.text || '', got = p.items.filter(function (it) { return !it.extra && covers(it, txt); }).length, need = p.items.filter(function (it) { return !it.extra; }).length;
            h += '<li class="course-row' + (ps.done ? ' on' : '') + '"><span class="course-ok" aria-hidden="true">' + (ps.done ? ic('check') : '') + '</span><span class="course-l">' + esc(p.title) +
              '<span class="course-sub">' + (ps.done ? 'Ready' : txt ? got + ' of ' + need + ' things your teacher asked for' : 'Not started') +
                (ps.learn != null ? ' · from memory: best ' + ps.learn + '%' : '') + '</span></span>' +
              '<span class="course-btns"><button type="button" class="btn" data-c-para="' + p.id + '">' + (txt ? 'Open' : 'Start') + '</button></span></li>';
          });
          h += '</ul></section>';
        });
        el.innerHTML = h + '</div>';
      }

      /* ── Revision-list drill: a question, think of the answer, reveal, then "I knew it" or "Not yet". Not-yet ones come back. ── */
      var drill = null;
      function findDrill(id) { var out = null; C.sections.forEach(function (s) { (s.drills || []).forEach(function (d) { if (d.id === id) out = d; }); }); return out; }
      function startDrill(id) {
        var d = findDrill(id);
        drill = { d: d, queue: d.items.map(function (x, i) { return i; }), known: 0, first: 0, seen: {}, shown: false };
        drawDrill();
      }
      function drawDrill() {
        var d = drill.d, n = d.items.length;
        if (!drill.queue.length) {
          var s = st(); s.d[d.id] = { done: true, first: Math.max((s.d[d.id] || {}).first || 0, drill.first), at: Date.now() }; save(s);
          el.innerHTML = '<div class="course"><button type="button" class="link course-back" data-c-home>' + ic('arrow-left') + ' Back to the run-through</button>' +
            '<div class="drill" role="status"><h2 class="course-t">' + esc(d.label) + ': all ' + n + ' known</h2><p class="course-p">You knew <b>' + drill.first + '</b> of ' + n + ' the first time. ' +
            (drill.first === n ? 'Perfect.' : 'Run it again later to get them all first time.') + '</p><div class="course-btns"><button type="button" class="btn primary" data-c-home>Next step</button>' +
            '<button type="button" class="btn" data-c-drill="' + d.id + '">Again</button></div></div></div>';
          el.querySelector('.drill [data-c-home]').focus(); return;
        }
        var it = d.items[drill.queue[0]];
        el.innerHTML = '<div class="course"><button type="button" class="link course-back" data-c-home>' + ic('arrow-left') + ' Back to the run-through</button>' +
          '<div class="drill"><p class="course-sub">' + esc(d.label) + ' · <span class="num">' + drill.known + '</span> of <span class="num">' + n + '</span> known' +
          '<span class="bar" aria-hidden="true"><i style="width:' + Math.round(drill.known / n * 100) + '%"></i></span></p>' +
          '<p class="drill-q">' + it.q + '</p>' +
          (drill.shown ? '<div class="drill-a" role="status">' + it.a + '</div><div class="course-btns"><button type="button" class="btn primary" data-c-knew>' + ic('check') + ' I knew it</button>' +
            '<button type="button" class="btn" data-c-notyet>Not yet: ask me again</button></div>' :
            '<p class="course-sub">Answer it in your head (or out loud), then check.</p><div class="course-btns"><button type="button" class="btn primary" data-c-show>Show the answer</button></div>') +
          '</div></div>';
        var b = el.querySelector('[data-c-knew], [data-c-show]'); if (b) b.focus();
      }
      function drillMark(knew) {
        var i = drill.queue.shift();
        SN.markStudied();
        if (knew) { drill.known++; if (!drill.seen[i]) drill.first++; }
        else drill.queue.splice(Math.min(drill.queue.length, 3), 0, i); // comes back after a few others
        drill.seen[i] = 1; drill.shown = false; drawDrill();
      }

      /* ── Quick checks ── */
      function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
      function findCheck(id) { var out = null; C.sections.forEach(function (s) { (s.checks || []).forEach(function (c) { if (c.id === id) out = c; }); }); return out; }
      function startCheck(id) {
        var c = findCheck(id), set = Y.quizzes[c.quiz];
        el.querySelectorAll('.course-quiz').forEach(function (b) { b.classList.add('hidden'); b.innerHTML = ''; });
        quiz = { c: c, set: set, qs: shuffle(set.questions).slice(0, 6), i: 0, right: 0, box: document.getElementById('cq-' + id) };
        quiz.box.classList.remove('hidden');
        askQ();
      }
      function askQ() {
        var q = quiz.qs[quiz.i], opts = shuffle(SubjectApp.quizOptions(quiz.set, q));
        quiz.box.innerHTML = '<div class="course-q"><p class="course-sub">Question <span class="num">' + (quiz.i + 1) + '</span> of <span class="num">' + quiz.qs.length + '</span></p>' +
          '<p class="quiz-q">' + SubjectApp.questionHtml(q) + '</p><div class="opts">' + opts.map(function (o) {
            return '<button type="button" class="opt" data-c-opt="' + esc(o) + '">' + esc(o) + '</button>'; }).join('') + '</div><div class="course-fb" role="status" aria-live="polite"></div></div>';
        var first = quiz.box.querySelector('.opt'); if (first) first.focus();
      }
      function answer(btn) {
        var q = quiz.qs[quiz.i], v = btn.getAttribute('data-c-opt'), ok = api.check(v, q.ans);
        SN.markStudied();
        quiz.box.querySelectorAll('.opt').forEach(function (b) {
          b.disabled = true;
          if (api.check(b.getAttribute('data-c-opt'), q.ans)) b.classList.add('correct'); else if (b === btn) b.classList.add('wrong');
        });
        if (ok) quiz.right++;
        var last = quiz.i === quiz.qs.length - 1;
        quiz.box.querySelector('.course-fb').innerHTML = '<p>' + (ok ? 'Right.' : 'Not quite: it’s <b>' + esc(q.ans[0]) + '</b>.') + '</p>' +
          '<button type="button" class="btn primary" data-c-next>' + (last ? 'See my score' : 'Next question') + '</button>';
        quiz.box.querySelector('[data-c-next]').focus();
      }
      function nextQ() {
        if (quiz.i < quiz.qs.length - 1) { quiz.i++; return askQ(); }
        var s = st(), c = quiz.c, id = c.id, n = quiz.qs.length, right = quiz.right, pass = right >= n - 1;
        s.q[id] = Math.max(s.q[id] || 0, Math.round(right * 6 / n)); save(s);
        home();
        var box = document.getElementById('cq-' + id);
        box.classList.remove('hidden');
        box.innerHTML = '<div class="course-q" role="status"><p><b>' + (pass ? 'Passed! ' : '') + 'You got ' + right + ' of ' + n + '.' + (pass ? '' : ' You need ' + (n - 1) + ' to pass.') + '</b></p><div class="course-btns">' +
          (pass ? '' : '<button type="button" class="btn primary" data-c-go="' + c.id + '">Try again</button>') +
          (c.topic && !pass ? '<button type="button" class="btn" data-c-rev="' + c.topic + '">Revise ' + esc(c.label) + '</button>' : '') + '</div></div>';
        var b = box.querySelector('button'); if (b) b.focus();
      }

      /* ── Writing workshop ── */
      var para = null, aiIssues = [], aiNote = '', busy = false;
      function findPara(id) { var out = null; C.sections.forEach(function (s) { (s.paras || []).forEach(function (p) { if (p.id === id) out = p; }); }); return out; }
      function openPara(id) {
        para = findPara(id); aiIssues = []; aiNote = '';
        var ps = st().p[id] || {};
        el.innerHTML = '<div class="course"><button type="button" class="link course-back" data-c-home>' + ic('arrow-left') + ' Back to the run-through</button>' +
          '<h2 class="course-t">' + esc(para.title) + '</h2>' +
          '<div class="course-ws"><div class="course-main">' +
          '<label class="course-lbl" for="cw-ta">Your answer (in ' + LANG + ')</label>' +
          '<textarea id="cw-ta" class="ex-ta course-ta" rows="9" spellcheck="false" lang="' + (C.rules || 'en') + '" placeholder="Type or paste your paragraph here, or add a photo of your copy.">' + esc(ps.text || '') + '</textarea>' +
          '<div class="course-btns"><button type="button" class="btn primary" data-c-check>' + ic('check') + ' Check my ' + LANG + '</button>' +
          '<button type="button" class="btn" data-c-photo>' + ic('camera') + ' Photo of my copy</button>' +
          '<button type="button" class="btn" data-c-file>' + ic('text') + ' Open a text file</button>' +
          '<button type="button" class="btn" data-c-learn>' + ic('target') + ' Learn it off by heart</button></div>' +
          '<div id="cw-read" class="course-read hidden"></div>' +
          '<div id="cw-out" class="course-out" aria-live="polite"></div></div>' +
          '<aside class="course-side"><h3>What your teacher asked for</h3><ul class="ck" id="cw-ck"></ul><p class="course-sub" id="cw-ck-sum" aria-live="polite"></p><div class="course-done"></div>' +
          '<h3>Sentence starters</h3><p class="course-sub">From your class notes. Add one, then make it about you.</p><div class="course-chips">' +
          para.starters.map(function (t, i) { return '<button type="button" class="pill" data-c-add="' + i + '">' + esc(t) + '</button>'; }).join('') + '</div></aside></div></div>';
        refresh(false);
        document.getElementById('cw-ta').focus();
      }
      function ta() { return document.getElementById('cw-ta'); }

      /* ── Learn it off by heart: read and listen → first letters → fill the gaps → from memory ── */
      var learn = null, VOICE = { fr: 'fr', ga: 'ga', en: 'en' }[C.rules] || 'en';
      function lnorm(w) { return String(w).toLowerCase().replace(/[’']/g, '\'').replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''); }
      function sentencesOf(t) { return (t.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?…]*["”»]?\s*/g) || []).map(function (x) { return x.trim(); }).filter(Boolean); }
      function openLearn() {
        clearTimeout(el._t);
        if (ta()) refresh(false); // save what's typed before the workshop is replaced
        var text = (ta() ? ta().value : (st().p[para.id] || {}).text || '').trim();
        if (text.split(/\s+/).length < 4) { var out = document.getElementById('cw-out'); if (out) out.innerHTML = '<p class="course-sub">Write your paragraph first, then learn it here.</p>'; return; }
        learn = { text: text, sents: sentencesOf(text), words: text.split(/\s+/), step: 1, level: 0, seed: Date.now() % 997 };
        drawLearn();
      }
      function drawLearn() {
        var steps = ['Read and listen', 'First letters', 'Fill the gaps', 'From memory'];
        var h = '<div class="course"><button type="button" class="link course-back" data-c-para="' + para.id + '">' + ic('arrow-left') + ' Back to my paragraph</button>' +
          '<h2 class="course-t">Learn it: ' + esc(para.title) + '</h2>' +
          '<div class="pills" role="group" aria-label="Steps">' + steps.map(function (s, i) {
            return '<button type="button" class="pill" data-c-step="' + (i + 1) + '" aria-pressed="' + (learn.step === i + 1) + '">' + (i + 1) + '. ' + s + '</button>'; }).join('') + '</div><div class="learn">';
        if (learn.step === 1) {
          h += '<p class="course-sub">Read it out loud, a sentence at a time. Then cover it and say it again.</p>' +
            '<div class="course-btns"><button type="button" class="btn" data-c-say="all">' + ic('play') + ' Listen to it all</button></div><ol class="learn-list">' +
            learn.sents.map(function (s, i) { return '<li><span lang="' + VOICE + '">' + esc(s) + '</span> <button type="button" class="link" data-c-say="' + i + '">Listen</button></li>'; }).join('') + '</ol>' +
            '<p class="course-sub" id="cl-voice" role="status"></p>';
        } else if (learn.step === 2) {
          h += '<p class="course-sub">Only the first letter of each word is left. Say each sentence from memory, then tap it to check.</p><div class="learn-text">' +
            learn.sents.map(function (s, i) {
              var cue = s.split(/\s+/).map(function (w) { return w.replace(/^([^\p{L}\p{N}]*[\p{L}\p{N}])[\p{L}\p{N}’'-]*/u, '$1'); }).join(' ');
              return '<button type="button" class="learn-sent" data-c-reveal="' + i + '" aria-pressed="false"><span class="learn-cue">' + esc(cue) + '</span><span class="learn-full hidden" lang="' + VOICE + '">' + esc(s) + '</span></button>';
            }).join('') + '</div>';
        } else if (learn.step === 3) {
          var every = [4, 2, 1][learn.level], n = 0;
          h += '<div class="pills" role="group" aria-label="How many gaps">' + ['A few gaps', 'Half', 'Every word'].map(function (l, i) {
            return '<button type="button" class="pill" data-c-level="' + i + '" aria-pressed="' + (learn.level === i) + '">' + l + '</button>'; }).join('') + '</div>' +
            '<p class="course-sub">Type the missing words, accents and fadas included, then check.</p><div class="learn-text" lang="' + VOICE + '">' +
            learn.words.map(function (w, i) {
              var core = lnorm(w);
              if (!core || core.length < 2 || (i + learn.seed) % every) return esc(w);
              var m = /^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u.exec(w), id = 'g' + (n++);
              return esc(m[1]) + '<input class="gap" id="' + id + '" data-w="' + esc(core) + '" size="' + Math.max(3, m[2].length) + '" aria-label="Missing word ' + n + '" autocomplete="off" autocapitalize="off" spellcheck="false">' + esc(m[3]);
            }).join(' ') + '</div><div class="course-btns"><button type="button" class="btn primary" data-c-gaps>' + ic('check') + ' Check</button>' +
            '<button type="button" class="btn" data-c-reshuffle>New gaps</button></div><p class="course-sub" id="cl-gap-res" role="status"></p>';
        } else {
          h += '<p class="course-sub">Write the whole paragraph from memory, then check it word by word.</p>' +
            '<textarea id="cl-mem" class="ex-ta course-ta" rows="8" spellcheck="false" lang="' + VOICE + '" aria-label="Your paragraph from memory"></textarea>' +
            '<div class="course-btns"><button type="button" class="btn primary" data-c-mem>' + ic('check') + ' Check</button></div><div id="cl-mem-res" role="status" aria-live="polite"></div>';
        }
        el.innerHTML = h + '</div></div>';
        var f = el.querySelector('.gap, #cl-mem'); if (f) f.focus();
      }
      function say(which) {
        var msg = document.getElementById('cl-voice');
        if (!('speechSynthesis' in window)) { if (msg) msg.textContent = 'This browser can’t read aloud.'; return; }
        var v = speechSynthesis.getVoices().filter(function (x) { return x.lang.toLowerCase().indexOf(VOICE) === 0; })[0];
        if (!v) { if (msg) msg.textContent = 'This device has no ' + LANG + ' voice, so it can’t read it aloud. Read it out loud yourself.'; return; }
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(which === 'all' ? learn.text : learn.sents[+which]);
        u.voice = v; u.lang = v.lang; u.rate = 0.85; speechSynthesis.speak(u);
      }
      function checkGaps() {
        var gaps = el.querySelectorAll('.gap'), ok = 0;
        gaps.forEach(function (g) {
          var right = lnorm(g.value) === g.dataset.w;
          g.classList.toggle('ok', right); g.classList.toggle('err', !right);
          var next = g.nextElementSibling;
          if (next && next.classList.contains('gap-ans')) next.remove();
          if (right) ok++; else g.insertAdjacentHTML('afterend', '<span class="gap-ans">' + esc(g.dataset.w) + '</span>');
        });
        SN.markStudied();
        document.getElementById('cl-gap-res').textContent = ok + ' of ' + gaps.length + ' right.' + (ok === gaps.length ? (learn.level < 2 ? ' Try more gaps.' : ' Now try it from memory.') : ' Check the ones in the dashed boxes, then press New gaps.');
      }
      // Word-by-word comparison (longest common subsequence), so one missed word doesn't knock every later word out.
      function checkMemory() {
        var a = learn.words, b = document.getElementById('cl-mem').value.trim().split(/\s+/).filter(Boolean);
        var A = a.map(lnorm), B = b.map(lnorm), n = A.length, m = B.length, L = [], i, j;
        for (i = 0; i <= n; i++) { L[i] = []; for (j = 0; j <= m; j++) L[i][j] = 0; }
        for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) L[i][j] = A[i] && A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
        var out = [], extra = [], got = 0; i = 0; j = 0;
        while (i < n || j < m) {
          if (i < n && j < m && A[i] && A[i] === B[j]) { out.push(esc(a[i])); got++; i++; j++; }
          else if (j < m && (i >= n || L[i][j + 1] >= L[i + 1][j])) { extra.push(b[j]); j++; }
          else { out.push(A[i] ? '<span class="lw-miss" title="You missed this">' + esc(a[i]) + '</span>' : esc(a[i])); if (!A[i]) got++; i++; }
        }
        var pct = Math.round(got / Math.max(1, n) * 100), s = st(), ps = s.p[para.id] = s.p[para.id] || {};
        ps.learn = Math.max(ps.learn || 0, pct); save(s); SN.markStudied();
        document.getElementById('cl-mem-res').innerHTML = '<p><b>' + pct + '%</b> of the words, in order. ' + (pct >= 95 ? 'You know it off by heart.' : pct >= 75 ? 'Nearly there: learn the marked words and try again.' : 'Go back to First letters, then try again.') + '</p>' +
          '<div class="learn-text" lang="' + VOICE + '">' + out.join(' ') + '</div>' +
          (extra.length ? '<p class="course-sub">Words you wrote that aren’t in your paragraph (or are spelt differently): <span class="lw-extra">' + esc(extra.join(' · ')) + '</span></p>' : '') +
          '<p class="course-sub">Underlined words are the ones you missed. Best so far: ' + ps.learn + '%.</p>';
      }
      function refresh(showLocal) {
        var text = ta().value, s = st(), ps = s.p[para.id] = s.p[para.id] || {};
        if (ps.text !== text) { ps.text = text; ps.done = false; save(s); }
        var need = 0, got = 0;
        document.getElementById('cw-ck').innerHTML = para.items.map(function (it) {
          var on = covers(it, text); if (!it.extra) { need++; if (on) got++; }
          return '<li class="' + (on ? 'on' : '') + '"><span class="ck-box" aria-hidden="true">' + (on ? ic('check') : '') + '</span><span>' + esc(it.t) + '<span class="sr-only">' + (on ? ' (done)' : ' (not yet)') + '</span></span></li>';
        }).join('');
        document.getElementById('cw-ck-sum').textContent = got + ' of ' + need + ' done' + (got === need ? '. Everything your teacher asked for is there.' : '.');
        var local = localIssues(text, C.rules);
        var doneBox = el.querySelector('.course-done');
        doneBox.innerHTML = got === need && !local.length && text.trim() ? (ps.done ? '<p class="course-ok-msg">' + ic('check') + ' Marked as ready. Keep learning it off by heart.</p>' :
          '<button type="button" class="btn primary" data-c-ready>' + ic('check') + ' It’s ready: I’ll learn this one</button>') : '';
        if (showLocal) render(local);
        return local;
      }
      function issueHtml(x, i, src) {
        return '<li class="issue"><div class="issue-fix"><span class="issue-w">' + esc(x.wrong) + '</span>' + ic('arrow-right') + '<span class="issue-r">' + esc(x.right) + '</span></div>' +
          '<p class="course-sub">' + esc(x.why) + '</p><button type="button" class="btn" data-c-fix="' + src + i + '">Fix it</button></li>';
      }
      function render(local) {
        var out = document.getElementById('cw-out'), text = ta().value;
        aiIssues = aiIssues.filter(function (x) { // still in the paragraph, and not already fixed there
          var lt = text.toLowerCase(), w = x.wrong.toLowerCase(), r = x.right.toLowerCase();
          return lt.indexOf(w) >= 0 && !(r.indexOf(w) >= 0 && lt.indexOf(r) >= 0);
        });
        // An AI point about the same words as a quick-check point is the same mistake: show it once.
        var low = text.toLowerCase(), spans = local.map(function (x) { var i = low.indexOf(x.wrong.toLowerCase()); return [i, i + x.wrong.length]; });
        var ai = aiIssues.filter(function (x) {
          var i = low.indexOf(x.wrong.toLowerCase()), j = i + x.wrong.length;
          return !spans.some(function (s) { return s[0] >= 0 && i < s[1] && s[0] < j; });
        });
        var h = '';
        if (!text.trim()) h = '<p class="course-sub">Write something first.</p>';
        else {
          if (RULES[C.rules]) h += '<h3>Quick check</h3>' + (local.length ? '<ul class="issues">' + local.map(function (x, i) { return issueHtml(x, i, 'l'); }).join('') + '</ul>' :
            '<p class="course-sub">' + ic('check') + ' None of the common mistakes (' + ({ fr: 'au / à la, jouer à / de, faire de, agreement, avoir for age, capitals on months',
              ga: 'séimhiú and urú after mo, do, ár and bhur; m’ and d’ before a vowel; feelings with ar; ag and ar with pronouns' }[C.rules] || 'the usual ones') + ').</p>');
          if (busy) h += '<h3>StudyNet’s checker</h3><p class="course-sub">Checking your ' + LANG + '…</p>';
          else if (aiNote) h += '<h3>StudyNet’s checker</h3>' + aiNote + (ai.length ? '<ul class="issues">' + ai.map(function (x) { return issueHtml(x, aiIssues.indexOf(x), 'a'); }).join('') + '</ul>' : '');
        }
        out.innerHTML = h;
      }
      function check() {
        var text = ta().value.trim();
        var local = refresh(true);
        if (!text) return;
        SN.markStudied();
        askAI({ text: text });
      }
      function askAI(extra) {
        if (!window.SNAI || !SNAI.check) { aiNote = '<p class="course-sub">The checker isn’t available here. The quick check above still works.</p>'; return render(refresh(false)); }
        busy = true; render(refresh(false));
        var req = Object.assign({ subject: api.cfg.title, year: SN.YEAR_NAMES[api.year], title: para.title, checklist: para.items.map(function (it) { return it.t; }),
          done: para.items.map(function (it, i) { return covers(it, ta().value) ? i + 1 : 0; }).filter(Boolean) }, extra);
        SNAI.check(req).then(function (res) {
          busy = false;
          if (res.text != null) showRead(res.text);
          aiIssues = res.issues || [];
          aiNote = (res.praise ? '<p>' + esc(res.praise) + '</p>' : '') + (aiIssues.length ? '' : '<p class="course-sub">' + ic('check') + ' No other mistakes found.</p>') +
            (res.next ? '<p><b>Next:</b> ' + esc(res.next) + '</p>' : '') +
            '<p class="mk-by">Checked by AI against your teacher’s checklist. It can be wrong: if a fix doesn’t look right, ask your teacher.</p>';
          render(refresh(false));
        }).catch(function (e) {
          busy = false;
          aiNote = '<p class="course-sub">The checker couldn’t be reached (' + esc(e.message) + '). The quick check above still works.</p>';
          render(refresh(false));
        });
      }
      function showRead(text) {
        var box = document.getElementById('cw-read');
        box.classList.remove('hidden');
        box.innerHTML = '<p><b>From your photo:</b></p><p class="course-readt" lang="fr">' + esc(text) + '</p><div class="course-btns"><button type="button" class="btn primary" data-c-use>Use this text</button>' +
          '<button type="button" class="btn" data-c-noread>Dismiss</button></div>';
        box._text = text;
      }
      function fix(code) {
        var list = code[0] === 'l' ? localIssues(ta().value, C.rules) : aiIssues, x = list[+code.slice(1)];
        if (!x) return;
        var t = ta(), v = t.value, i = v.indexOf(x.wrong);
        if (i < 0) i = v.toLowerCase().indexOf(x.wrong.toLowerCase());
        if (i < 0) return;
        var after = v.slice(i + x.wrong.length);
        if (/['’]$/.test(x.right) && /^ /.test(after)) after = after.slice(1); // "parce qu’ elle" → "parce qu’elle"
        t.value = v.slice(0, i) + x.right + after;
        if (code[0] === 'a') aiIssues.splice(+code.slice(1), 1);
        render(refresh(false));
        var next = el.querySelector('[data-c-fix]'); (next || t).focus();
      }
      function addStarter(i) {
        var t = ta(), s = para.starters[i], a = t.selectionStart != null ? t.selectionStart : t.value.length, v = t.value;
        var pre = v.slice(0, a), ins = (pre && !/\s$/.test(pre) ? ' ' : '') + s;
        t.value = pre + ins + v.slice(a);
        t.focus(); t.selectionStart = t.selectionEnd = a + ins.length;
        refresh(false);
      }
      function photo() {
        var f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*'; f.capture = 'environment';
        f.onchange = function () {
          var file = f.files[0]; if (!file) return;
          var img = new Image(), url = URL.createObjectURL(file);
          img.onload = function () {
            var k = Math.min(1, 1400 / Math.max(img.width, img.height)), c = document.createElement('canvas');
            c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
            var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
            URL.revokeObjectURL(url);
            SN.markStudied();
            askAI({ image: c.toDataURL('image/jpeg', 0.8) });
          };
          img.src = url;
        };
        f.click();
      }
      function textFile() {
        var f = document.createElement('input'); f.type = 'file'; f.accept = '.txt,text/plain';
        f.onchange = function () {
          var file = f.files[0]; if (!file) return;
          var r = new FileReader();
          r.onload = function () { var t = ta(); t.value = String(r.result || '').slice(0, 3000); refresh(true); t.focus(); };
          r.readAsText(file);
        };
        f.click();
      }

      // The panel is reused each time the activity opens: drop the last opening's handlers, or two quizzes answer one click.
      if (el._courseOff) el._courseOff();
      function onClick(e) {
        var b = e.target.closest('button'); if (!b || !el.contains(b)) return;
        var d = b.dataset;
        if (d.cGo) startCheck(d.cGo);
        else if (d.cOpt != null && quiz) answer(b);
        else if (d.cNext != null) nextQ();
        else if (d.cRev) api.goTopic(d.cRev);
        else if (d.cPara) openPara(d.cPara);
        else if (d.cHome != null) { clearTimeout(el._t); if (para && ta()) refresh(false); home(); }
        else if (d.cCheck != null) check();
        else if (d.cPhoto != null) photo();
        else if (d.cFile != null) textFile();
        else if (d.cAdd != null) addStarter(+d.cAdd);
        else if (d.cFix) fix(d.cFix);
        else if (d.cUse != null) { var box = document.getElementById('cw-read'); ta().value = box._text; box.classList.add('hidden'); render(refresh(false)); ta().focus(); }
        else if (d.cNoread != null) document.getElementById('cw-read').classList.add('hidden');
        else if (d.cReady != null) { var s = st(); (s.p[para.id] = s.p[para.id] || {}).done = true; save(s); refresh(false); }
        else if (d.cLearn != null) openLearn();
        else if (d.cStep) { learn.step = +d.cStep; if ('speechSynthesis' in window) speechSynthesis.cancel(); drawLearn(); }
        else if (d.cSay) say(d.cSay);
        else if (d.cReveal) { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); b.querySelector('.learn-cue').classList.toggle('hidden', on); b.querySelector('.learn-full').classList.toggle('hidden', !on); }
        else if (d.cLevel) { learn.level = +d.cLevel; drawLearn(); }
        else if (d.cGaps != null) checkGaps();
        else if (d.cReshuffle != null) { learn.seed++; drawLearn(); }
        else if (d.cMem != null) checkMemory();
        else if (d.cDrill) startDrill(d.cDrill);
        else if (d.cShow != null) { drill.shown = true; drawDrill(); }
        else if (d.cKnew != null) drillMark(true);
        else if (d.cNotyet != null) drillMark(false);
      }
      function onInput(e) {
        if (e.target.id !== 'cw-ta') return;
        clearTimeout(el._t); el._t = setTimeout(function () { if (!ta()) return; refresh(false); if (document.getElementById('cw-out').innerHTML) render(localIssues(ta().value, C.rules)); }, 350);
      }
      el.addEventListener('click', onClick);
      el.addEventListener('input', onInput);
      el._courseOff = function () { el.removeEventListener('click', onClick); el.removeEventListener('input', onInput); clearTimeout(el._t); };
      home();
    }
  });
  window.SNcourse = { localIssues: localIssues, covers: covers };
})();
