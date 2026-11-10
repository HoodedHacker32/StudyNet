/* StudyNet — shared code used by every page.
   Loaded synchronously in <head> so the saved theme is applied before first paint.
   Provides: storage, theme, icons, subject registry, profile, streak, scores,
   accessible dialogs, the app shell (sidebar + mobile top bar) and the Settings drawer. */
(function () {
  'use strict';
  var root = document.documentElement;
  var SN = window.SN = {};

  /* ── Storage ─────────────────────────────────────────────── */
  SN.readJSON = function (key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  };
  SN.writeJSON = function (key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  };

  /* ── Theme ───────────────────────────────────────────────── */
  var saved = null;
  try { saved = localStorage.getItem('sn_theme'); } catch (e) {}
  if (saved === 'light' || saved === 'dark') root.classList.add('theme-' + saved);
  var darkMQ = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  SN.isDark = function () {
    return root.classList.contains('theme-dark') ||
      (!root.classList.contains('theme-light') && !!darkMQ && darkMQ.matches);
  };
  function updateThemeIcons() {
    var dark = SN.isDark();
    document.querySelectorAll('.theme-icon-use').forEach(function (el) { el.setAttribute('href', dark ? '#i-sun' : '#i-moon'); });
    document.querySelectorAll('.theme-label').forEach(function (el) { el.textContent = dark ? 'Light mode' : 'Dark mode'; });
    document.querySelectorAll('[data-sn="theme"]').forEach(function (el) { el.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode'); });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#000000' : '#ffffff');
  }
  function toggleTheme() {
    var next = SN.isDark() ? 'light' : 'dark';
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add('theme-' + next);
    try { localStorage.setItem('sn_theme', next); } catch (e) {}
    updateThemeIcons();
  }
  SN.updateThemeIcons = updateThemeIcons;
  SN.toggleTheme = toggleTheme;
  if (darkMQ && darkMQ.addEventListener) darkMQ.addEventListener('change', updateThemeIcons);

  /* ── Utilities ───────────────────────────────────────────── */
  // Unbiased Fisher–Yates shuffle; returns a new array.
  SN.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  SN.escHtml = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  // Make a non-button element (e.g. the flashcard) work with Enter / Space.
  SN.keyActivate = function (el, fn) {
    el.addEventListener('keydown', function (e) {
      if (e.target !== el) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); }
    });
  };

  /* ── Icons: one inline SVG sprite for the whole app ───────── */
  var ICONS = {
    home:'<path d="M3 9.5 12 3l9 6.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z"/>',
    briefcase:'<rect x="2.5" y="7" width="19" height="13.5" rx="2"/><path d="M8.5 7V5a2 2 0 012-2h3a2 2 0 012 2v2"/><path d="M2.5 13h19"/><path d="M11 13v2h2v-2"/>',
    shield:'<path d="M12 21.5s7.5-3.6 7.5-9.5V5.2L12 2.5 4.5 5.2V12c0 5.9 7.5 9.5 7.5 9.5z"/><path d="M8.8 11.8l2.2 2.2 4.2-4.4"/>',
    leaf:'<path d="M11 20.5A7 7 0 019.8 6.6C15.5 5.5 17 5 19.5 2.5c1 2 2 4.2 2 8 0 5.5-4.8 10-10.5 10z"/><path d="M2.5 21.5c0-3 1.9-5.4 5.1-6 2.4-.5 4.9-2 5.9-3"/>',
    store:'<path d="M3.5 9 5 4h14l1.5 5"/><path d="M3.5 9h17v1.5a2.8 2.8 0 01-5.7 0 2.8 2.8 0 01-5.6 0 2.8 2.8 0 01-5.7 0z"/><path d="M5 12.8V21h14v-8.2"/><path d="M10 21v-4.5h4V21"/>',
    books:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',
    notes:'<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>',
    cards:'<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h11a3 3 0 013 3v11"/>',
    quiz:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    match:'<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
    timeline:'<line x1="2" y1="12" x2="22" y2="12"/><circle cx="6" cy="12" r="2.5"/><circle cx="12" cy="12" r="2.5"/><circle cx="18" cy="12" r="2.5"/>',
    pencil:'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/>',
    link:'<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>',
    clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    rewind:'<polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/>',
    bolt:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    user:'<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
    moon:'<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>',
    sun:'<circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
    download:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    chat:'<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
    cloud:'<path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>',
    calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    text:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    flask:'<path d="M9 2h6"/><path d="M10 2v6L4.5 18.5A2 2 0 006.3 21h11.4a2 2 0 001.8-2.5L14 8V2"/><line x1="7" y1="15" x2="17" y2="15"/>',
    compass:'<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>',
    mountain:'<path d="M3 20l6-11 4 7 3-4 5 8z"/>',
    volcano:'<path d="M2 21l6-11h8l6 11z"/><path d="M10 7 9 4"/><path d="m14 7 1-3"/><line x1="12" y1="6" x2="12" y2="2"/>',
    snow:'<line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="19.1" y2="19.1"/><line x1="19.1" y1="4.9" x2="4.9" y2="19.1"/>',
    activity:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    atom:'<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    wind:'<path d="M9.59 4.59A2 2 0 1111 8H2"/><path d="M12.59 19.41A2 2 0 1014 16H2"/><path d="M17.73 7.73A2.5 2.5 0 1119.5 12H2"/>',
    apple:'<path d="M12 7c-2-2-6-1.5-6 3.5 0 4 3 9.5 6 9.5s6-5.5 6-9.5C18 5.5 14 5 12 7z"/><path d="M12 7c0-2 1-4 3-4"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
    droplet:'<path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>',
    filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    map:'<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
    music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    shirt:'<path d="M20.38 3.46 16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/>',
    thermometer:'<path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>',
    cross:'<line x1="12" y1="2" x2="12" y2="22"/><line x1="6" y1="8" x2="18" y2="8"/>',
    flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    hash:'<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
    heart:'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>',
    target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    play:'<polygon points="6 4 20 12 6 20 6 4"/>',
    check:'<polyline points="20 6 9 17 4 12"/>',
    calc:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><rect x="8" y="5.5" width="8" height="4" rx=".5"/><line x1="8.5" y1="13" x2="8.5" y2="13"/><line x1="12" y1="13" x2="12" y2="13"/><line x1="15.5" y1="13" x2="15.5" y2="13"/><line x1="8.5" y1="17" x2="8.5" y2="17"/><line x1="12" y1="17" x2="12" y2="17"/><line x1="15.5" y1="17" x2="15.5" y2="17"/>',
    paper:'<path d="M14 2.5H6.5a2 2 0 00-2 2v15a2 2 0 002 2h11a2 2 0 002-2V8z"/><polyline points="14 2.5 14 8 19.5 8"/><line x1="8.5" y1="13" x2="15.5" y2="13"/><line x1="8.5" y1="17" x2="13" y2="17"/>',
    bulb:'<path d="M9 18h6"/><path d="M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 00-4 11.6c.6.5 1 1.2 1 2V16h6v-.3c0-.8.4-1.5 1-2A6.5 6.5 0 0012 2.5z"/>',
    camera:'<path d="M3 8a2 2 0 012-2h2.2l1.6-2.5h6.4L16.8 6H19a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><circle cx="12" cy="13" r="3.8"/>',
    printer:'<polyline points="6 9 6 2.5 18 2.5 18 9"/><path d="M6 18H4.5a2 2 0 01-2-2v-5a2 2 0 012-2h15a2 2 0 012 2v5a2 2 0 01-2 2H18"/><rect x="6" y="14" width="12" height="7.5"/>',
    column:'<path d="M12 2.5 3 7.5h18z"/><line x1="3" y1="20.5" x2="21" y2="20.5"/><line x1="4.5" y1="17.5" x2="19.5" y2="17.5"/><line x1="6.5" y1="10.5" x2="6.5" y2="15"/><line x1="10" y1="10.5" x2="10" y2="15"/><line x1="14" y1="10.5" x2="14" y2="15"/><line x1="17.5" y1="10.5" x2="17.5" y2="15"/>',
    pi:'<path d="M4.5 7.5h15"/><path d="M9 7.5v12"/><path d="M15 7.5v8.5a3 3 0 003 3"/>',
    quill:'<path d="M20 3.5C12 4 7.5 9.5 6.5 17"/><path d="M20 3.5c-.5 7.5-5.5 12-12.5 13"/><path d="M6.5 17 4 21"/><path d="M10 12.5h4"/>',
    menu:'<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    'chevron-right':'<polyline points="9 18 15 12 9 6"/>',
    'chevron-left':'<polyline points="15 18 9 12 15 6"/>',
    'arrow-left':'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
    'arrow-right':'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    reset:'<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>'
  };
  SN.ICONS = ICONS;
  function mountSprite() {
    if (document.getElementById('sn-sprite')) return;
    var s = '<svg id="sn-sprite" xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';
    Object.keys(ICONS).forEach(function (k) {
      s += '<symbol id="i-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' + ICONS[k] + '</symbol>';
    });
    document.body.insertAdjacentHTML('afterbegin', s + '</svg>');
  }
  SN.ic = function (name, cls) {
    return '<svg class="' + (cls || 'icon') + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-' + (ICONS[name] ? name : 'books') + '"/></svg>';
  };
  // Small inline icon (no sprite needed) used next to button text.
  SN.icon = function (name) {
    return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  };

  /* ── Profile ─────────────────────────────────────────────── */
  SN.YEAR_NAMES = { '1': '1st Year', '2': '2nd Year', '3': '3rd Year' };
  SN.LANG_NAMES = { fr: 'Français', es: 'Español', de: 'Deutsch' };
  SN.getProfile = function () {
    var p = SN.readJSON('sn_profile', {});
    if (!p || typeof p !== 'object') p = {};
    if (!p.exempt) p.exempt = p.irishExempt ? 'irish' : 'none';
    delete p.irishExempt;
    if (p.yearMode !== '2') p.yearMode = '1';
    delete p.year;
    return p;
  };
  SN.saveProfile = function (p) {
    var was = SN.secretUnlocked(SN.getProfile()), ok = SN.writeJSON('sn_profile', p);
    if (ok && !was && SN.secretUnlocked(p)) { try { sessionStorage.setItem('sn_unlock', 'business'); } catch (e) {} }
    return ok;
  };

  /* ── Subjects ────────────────────────────────────────────────
     years: years with content. Score keys: '<id>' for 1st Year, '<id>_y2' for 2nd Year. */
  SN.SUBJECTS = [
    { id: 'irish',     name: 'Gaeilge',   flag: 'ie', href: 'irish.html',     years: ['1', '2'], exempt: 'irish' },
    { id: 'french',    name: 'Français',  flag: 'fr', href: 'french.html',    years: ['1', '2'], lang: 'fr' },
    { id: 'history',   name: 'History',   glyph: 'column', href: 'history.html',   years: ['1', '2'] },
    { id: 'geography', name: 'Geography', glyph: 'globe',  href: 'geography.html', years: ['2'] },
    { id: 'science',   name: 'Science',   glyph: 'flask',  href: 'science.html',   years: ['2'], calc: true },
    { id: 'maths',     name: 'Maths',     glyph: 'pi',     href: 'maths.html',     years: ['2'], calc: true },
    // A secret subject: only listed once the student's name contains the cheat code (SN.secretUnlocked).
    { id: 'business',  name: 'Business',  glyph: 'briefcase', href: 'business.html', years: ['2'], secret: true },
    { id: 'english',   name: 'English',   glyph: 'quill',  href: 'english.html',   years: ['2'] },
    { id: 'german',    name: 'Deutsch',   flag: 'de', years: [], lang: 'de' },
    { id: 'spanish',   name: 'Español',   flag: 'es', years: [], lang: 'es' }
  ];
  // Flags fill the whole tile; other subjects get their glyph on the subject colour.
  var FLAGS = {
    ie: '<rect width="1" height="3" fill="#169B62"/><rect x="1" width="1" height="3" fill="#fff"/><rect x="2" width="1" height="3" fill="#FF883E"/>',
    fr: '<rect width="1" height="3" fill="#002395"/><rect x="1" width="1" height="3" fill="#fff"/><rect x="2" width="1" height="3" fill="#ED2939"/>',
    de: '<rect width="3" height="1" fill="#000"/><rect y="1" width="3" height="1" fill="#DD0000"/><rect y="2" width="3" height="1" fill="#FFCE00"/>',
    es: '<rect width="3" height="3" fill="#c60b1e"/><rect y=".75" width="3" height="1.5" fill="#ffc400"/>'
  };
  SN.logo = function (s, size) {
    var inner = s.flag
      ? '<svg class="flag" viewBox="0 0 3 3" preserveAspectRatio="none" aria-hidden="true">' + FLAGS[s.flag] + '</svg>'
      : SN.ic(s.glyph || 'books');
    return '<span class="logo' + (size ? ' ' + size : '') + '" data-sc="' + s.id + '" aria-hidden="true">' + inner + '</span>';
  };
  SN.subject = function (id) { return SN.SUBJECTS.filter(function (s) { return s.id === id; })[0]; };
  /* Cheat code: "$$" (or "€€") anywhere in the student's name unlocks the secret Business subject. */
  SN.CHEAT = /\$\$|€€/;
  SN.secretUnlocked = function (p) { p = p || SN.getProfile(); return SN.CHEAT.test(p.name || ''); };
  // Years of a subject this student can open (2nd Year mode includes 1st Year).
  SN.yearsFor = function (s, p) {
    p = p || SN.getProfile();
    return s.years.filter(function (y) { return y <= p.yearMode; });
  };
  SN.scoreKey = function (id, year) { return year === '1' ? id : id + '_y' + year; };
  // Splits the subjects into what this student studies, what's coming, and what's hidden.
  SN.mySubjects = function (p) {
    p = p || SN.getProfile();
    var out = { open: [], soon: [], hidden: [] };
    SN.SUBJECTS.forEach(function (s) {
      if (s.secret && !SN.secretUnlocked(p)) return;
      if (s.lang) {
        if (p.exempt === 'language') { if (s.lang === (p.lang || 'fr') && s.href) out.hidden.push({ s: s, why: 'language' }); return; }
        if (s.lang !== (p.lang || 'fr')) return;
      }
      if (s.exempt === 'irish' && p.exempt === 'irish') { out.hidden.push({ s: s, why: 'irish' }); return; }
      if (SN.yearsFor(s, p).length) out.open.push(s); else out.soon.push(s);
    });
    return out;
  };
  // The year a subject opens on by default and its saved score for that year.
  SN.defaultYear = function (s, p) { var y = SN.yearsFor(s, p); return y[y.length - 1]; };
  SN.subjectScore = function (s, p) {
    var y = SN.defaultYear(s, p);
    return y ? SN.getScores()[SN.scoreKey(s.id, y)] || null : null;
  };

  /* ── Streak ──────────────────────────────────────────────────
     A day only counts once the student actually answers something
     (SN.markStudied), not merely by opening a page. */
  function dayStr(offset) {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (offset || 0)).toDateString();
  }
  function loadStreak() {
    var s = SN.readJSON('sn_streak', null);
    if (!s || typeof s !== 'object') s = { count: 0, last: '', totalDays: 0, stars: 0 };
    if (!('totalDays' in s)) s.totalDays = s.count || 0;
    s.stars = Math.floor(s.totalDays / 10);
    return s;
  }
  SN.getStreak = function () {
    var s = loadStreak();
    var live = s.last === dayStr(0) || s.last === dayStr(-1);
    return { count: live ? s.count : 0, totalDays: s.totalDays, stars: s.stars, studiedToday: s.last === dayStr(0), progress: s.totalDays % 10 };
  };
  SN.markStudied = function () {
    var s = loadStreak(), today = dayStr(0);
    if (s.last === today) return;
    s.count = (s.last === dayStr(-1)) ? s.count + 1 : 1;
    s.totalDays++;
    s.stars = Math.floor(s.totalDays / 10);
    s.last = today;
    SN.writeJSON('sn_streak', s);
    document.dispatchEvent(new CustomEvent('sn:streak'));
  };
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  SN.streakText = function () {
    var s = SN.getStreak();
    var left = 10 - s.progress;
    return '<b class="num">' + s.count + '-day</b> streak \u00b7 ' + plural(s.stars, 'star') +
      '<br><span style="font-size:.75rem">' + plural(left, 'study day') + ' to your next star</span>';
  };

  /* ── Scores ──────────────────────────────────────────────── */
  // unit: what c counts, when it isn't "correct" answers (e.g. "skills at 80+").
  SN.saveScore = function (key, correct, total, unit) {
    var all = SN.readJSON('sn_scores', {});
    if (!all || typeof all !== 'object') all = {};
    all[key] = { c: correct, t: total };
    if (unit) all[key].u = unit;
    SN.writeJSON('sn_scores', all);
  };
  SN.getScores = function () {
    var all = SN.readJSON('sn_scores', {});
    return (all && typeof all === 'object') ? all : {};
  };

  /* ── Accessible dialogs ──────────────────────────────────────
     openDialog(overlay, {onEscape, initialFocus}) shows the overlay,
     traps Tab inside it, closes on Esc and restores focus afterwards. */
  var stack = [];
  function focusables(box) {
    return Array.prototype.filter.call(
      box.querySelectorAll('button:not([disabled]),[href],input:not([disabled]):not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])'),
      function (n) { return n.getClientRects().length > 0; });
  }
  document.addEventListener('keydown', function (e) {
    var top = stack[stack.length - 1];
    if (!top) return;
    if (e.key === 'Escape') {
      if (top.opts.onEscape) { e.preventDefault(); top.opts.onEscape(); }
    } else if (e.key === 'Tab') {
      var f = focusables(top.el);
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      if (!top.el.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  SN.openDialog = function (el, opts) {
    opts = opts || {};
    if (stack.some(function (d) { return d.el === el; })) return;
    stack.push({ el: el, opts: opts, prev: document.activeElement });
    el.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    var target = (opts.initialFocus && el.querySelector(opts.initialFocus)) || focusables(el)[0];
    if (target) setTimeout(function () { target.focus(); }, 0);
  };
  SN.closeDialog = function (el) {
    el.classList.add('hidden');
    for (var i = stack.length - 1; i >= 0; i--) {
      if (stack[i].el === el) {
        var prev = stack[i].prev;
        stack.splice(i, 1);
        if (prev && prev.focus && document.contains(prev)) prev.focus();
        break;
      }
    }
    if (!stack.length) document.body.style.overflow = '';
  };

  /* ── App shell ───────────────────────────────────────────────
     SN.mountShell(currentId) adds the sidebar (desktop) and top bar (mobile).
     The same shell is used on the dashboard ('home') and every subject page. */
  var esc = SN.escHtml;
  function linksHtml(current) {
    var p = SN.getProfile(), my = SN.mySubjects(p);
    var h = '<a class="sb-link" href="index.html"' + (current === 'home' ? ' aria-current="page"' : '') + '>' + SN.ic('home') + ' Home</a>';
    if (my.open.length) h += '<div class="sb-label">Your subjects</div>';
    my.open.forEach(function (s) {
      var sc = SN.subjectScore(s, p);
      var pct = sc && sc.t && sc.c ? '<span class="sb-pct num" title="Practice answers correct">' + Math.round(sc.c / sc.t * 100) + '%</span>' : '';
      h += '<a class="sb-link" href="' + s.href + '"' + (current === s.id ? ' aria-current="page"' : '') + '>' + SN.logo(s) + esc(s.name) + pct + '</a>';
    });
    return h;
  }
  // The calculator is offered on subjects where calculators are allowed (Maths, Science).
  function hasCalc(current) { var s = current && SN.subject(current); return !!(s && s.calc); }
  function navHtml(current) {
    var p = SN.getProfile();
    var meta = SN.YEAR_NAMES[p.yearMode] + (p.name ? ' \u00b7 ' + esc(p.name) : '');
    var h = '<a class="sb-logo" href="index.html">StudyNet</a><div class="sb-meta">' + meta + '</div>';
    h += '<div class="sb-nav">' + linksHtml(current);
    h += '</div><div class="sb-spacer"></div><div class="sb-foot">' +
      '<div class="sb-streak">' + SN.ic('star', 'icon star') + '<span data-sn="streak">' + SN.streakText() + '</span></div>' +
      '<button type="button" class="sb-link hidden" data-sn="install">' + SN.ic('download') + ' Install app</button>' +
      (hasCalc(current) ? '<button type="button" class="sb-link" data-calc aria-pressed="false">' + SN.ic('calc') + ' Calculator</button>' : '') +
      '<a class="sb-link" href="about.html"' + (current === 'about' ? ' aria-current="page"' : '') + '>' + SN.ic('info') + ' About and AI use</a>' +
      '<button type="button" class="sb-link" data-sn="settings">' + SN.ic('gear') + ' Settings</button>' +
      '<button type="button" class="sb-link" data-sn="theme">' + SN.ic('moon').replace('<use ', '<use class="theme-icon-use" ') + ' <span class="theme-label">Dark mode</span></button>' +
      '</div>';
    return h;
  }
  SN.mountShell = function (current) {
    mountSprite();
    var shell = '<nav class="sb" aria-label="StudyNet">' + navHtml(current) + '</nav>' +
      '<header class="topbar"><a class="sb-logo" href="index.html">StudyNet</a><div class="topbar-btns">' +
      '<button type="button" class="icon-btn" data-sn="menu" aria-label="Your subjects" aria-haspopup="dialog">' + SN.ic('menu') + '</button>' +
      '<button type="button" class="icon-btn hidden" data-sn="install" aria-label="Install app">' + SN.ic('download') + '</button>' +
      (hasCalc(current) ? '<button type="button" class="icon-btn" data-calc aria-pressed="false" aria-label="Calculator">' + SN.ic('calc') + '</button>' : '') +
      '<button type="button" class="icon-btn" data-sn="settings" aria-label="Settings">' + SN.ic('gear') + '</button>' +
      '<button type="button" class="icon-btn" data-sn="theme" aria-label="Switch theme">' + SN.ic('moon').replace('<use ', '<use class="theme-icon-use" ') + '</button>' +
      '</div></header>';
    document.getElementById('sn-sprite').insertAdjacentHTML('afterend', shell);
    shellCurrent = current;
    updateThemeIcons();
    if (deferredInstall) showInstall(true);
    var unlock = null; try { unlock = sessionStorage.getItem('sn_unlock'); sessionStorage.removeItem('sn_unlock'); } catch (e) {}
    if (unlock && SN.secretUnlocked()) setTimeout(function () { SN.playUnlock(unlock); }, 250);
  };

  /* ── Secret subject unlocked ─────────────────────────────────
     A briefcase drops in, its lid flips open with a burst of light and coins, then Business is yours. */
  SN.playUnlock = function (id) {
    var s = SN.subject(id); if (!s) return;
    var coins = '';
    for (var i = 0; i < 14; i++) {
      var a = (i / 14) * 360 + (i % 2 ? 9 : -9), d = 120 + (i * 37) % 70;
      coins += '<span class="ul-coin" style="--a:' + a + 'deg;--d:' + d + 'px;--t:' + (0.04 * (i % 5)) + 's"></span>';
    }
    var el = document.createElement('div');
    el.className = 'overlay unlock-ov';
    el.innerHTML = '<div class="dialog unlock" role="dialog" aria-modal="true" aria-labelledby="ul-t" aria-describedby="ul-d" data-sc="' + s.id + '">' +
      '<div class="ul-stage" aria-hidden="true"><span class="ul-rays"></span>' + coins +
        '<span class="ul-case"><span class="ul-lid"></span><span class="ul-body">' + SN.ic(s.glyph) + '</span></span></div>' +
      '<h2 id="ul-t">' + esc(s.name) + ' unlocked</h2>' +
      '<p class="lead" id="ul-d">Cheat code accepted. A secret subject is now in your subjects, with notes, quizzes and practice exams for the November assessment.</p>' +
      '<div class="dialog-actions"><button type="button" class="btn" data-ul="later">Not now</button>' +
      '<a class="btn primary" href="' + s.href + '">Open ' + esc(s.name) + ' ' + SN.ic('arrow-right') + '</a></div></div>';
    document.body.appendChild(el);
    var close = function () {
      SN.closeDialog(el); setTimeout(function () { el.remove(); }, 300);
      var link = document.querySelector('a.sb-link[href="' + s.href + '"]') || document.querySelector('a[href="' + s.href + '"]');
      if (link && link.offsetParent) link.focus(); // land on the new subject, not the top of the page
    };
    el.addEventListener('click', function (e) { if (e.target === el || e.target.closest('[data-ul="later"]')) close(); });
    SN.openDialog(el, { onEscape: close, initialFocus: '.btn.primary' });
    requestAnimationFrame(function () { el.classList.add('go'); });
    // its row in the subject lists gets a moment of shine too
    document.querySelectorAll('a[href="' + s.href + '"]').forEach(function (a) { a.classList.add('sn-new'); });
  };
  /* ── Calculator: on every page, loaded the first time it's opened ── */
  var calcSrc = (function () { var s = document.currentScript && document.currentScript.src || ''; return 'calc.js' + (s.indexOf('?') > 0 ? s.slice(s.indexOf('?')) : ''); })();
  SN.openCalc = function () {
    if (window.__calc) return window.__calc.toggle(true);
    if (SN._calcLoading) return; SN._calcLoading = true;
    function load(src, then) {
      var s = document.createElement('script'); s.src = src; s.onload = then;
      s.onerror = function () { SN._calcLoading = false; alert('The calculator didn’t load. Check your connection and try again.'); };
      document.body.appendChild(s);
    }
    // the LCD's pixel fonts first, then the calculator
    load(calcSrc.replace('calc.js', 'calc-lcd.js'), function () { load(calcSrc, function () { if (window.__calc) window.__calc.toggle(true); }); });
  };
  document.addEventListener('click', function (e) { // calc.js handles [data-calc] itself once it's loaded
    if (!window.__calc && e.target.closest && e.target.closest('[data-calc]')) SN.openCalc();
  });
  document.addEventListener('sn:streak', function () {
    document.querySelectorAll('[data-sn="streak"]').forEach(function (el) { el.innerHTML = SN.streakText(); });
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-sn]');
    if (!b) return;
    if (b.dataset.sn === 'theme') toggleTheme();
    else if (b.dataset.sn === 'settings') SN.openSettings();
    else if (b.dataset.sn === 'install') install();
    else if (b.dataset.sn === 'menu') openMenu();
  });

  /* ── Subjects menu (mobile: the sidebar is hidden under 900px) ── */
  var shellCurrent = null, menuEl = null;
  function openMenu() {
    if (!menuEl) {
      menuEl = document.createElement('div');
      menuEl.className = 'overlay side hidden';
      menuEl.innerHTML = '<div class="drawer" role="dialog" aria-modal="true" aria-labelledby="menu-title">' +
        '<div class="drawer-head"><h2 id="menu-title">Your subjects</h2><button type="button" class="icon-btn" data-act="close" aria-label="Close">' + SN.ic('x') + '</button></div>' +
        '<div class="drawer-body"><nav class="menu-list" aria-label="Subjects">' + linksHtml(shellCurrent) + '</nav>' +
        '<div class="sb-streak" style="margin-top:1rem">' + SN.ic('star', 'icon star') + '<span data-sn="streak">' + SN.streakText() + '</span></div></div></div>';
      document.body.appendChild(menuEl);
      menuEl.addEventListener('click', function (e) {
        if (e.target === menuEl || e.target.closest('[data-act="close"]')) SN.closeDialog(menuEl);
      });
    }
    SN.openDialog(menuEl, { onEscape: function () { SN.closeDialog(menuEl); }, initialFocus: '[aria-current="page"]' });
  }

  /* ── Install (PWA) ───────────────────────────────────────── */
  var deferredInstall = null;
  function showInstall(on) { document.querySelectorAll('[data-sn="install"]').forEach(function (b) { b.classList.toggle('hidden', !on); }); }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredInstall = e; showInstall(true); });
  window.addEventListener('appinstalled', function () { deferredInstall = null; showInstall(false); });
  function install() {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    deferredInstall.userChoice.then(function () { deferredInstall = null; showInstall(false); });
  }

  /* ── Profile form (used by onboarding and Settings) ────────── */
  SN.profileFields = function (p, prefix) {
    var yr = ['1', '2', '3'].map(function (y) {
      var soon = y === '3';
      return '<button type="button" data-year="' + y + '" aria-pressed="' + (p.yearMode === y) + '"' + (soon ? ' disabled' : '') + '>' +
        SN.YEAR_NAMES[y] + (soon ? '<small>Coming soon</small>' : '') + '</button>';
    }).join('');
    var lang = ['fr', 'es', 'de'].map(function (l) {
      return '<button type="button" data-lang="' + l + '" aria-pressed="' + ((p.lang || '') === l) + '">' + SN.LANG_NAMES[l] + '</button>';
    }).join('');
    var ex = [['none', 'No'], ['irish', 'Yes, from Irish'], ['language', 'Yes, from a modern language']].map(function (o) {
      return '<option value="' + o[0] + '"' + (p.exempt === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
    }).join('');
    return '<div class="field"><label for="' + prefix + '-name">Your name <span style="font-weight:400">(optional, stays on this device)</span></label>' +
      '<input class="input" id="' + prefix + '-name" type="text" maxlength="32" autocomplete="off" value="' + esc(p.name || '') + '"></div>' +
      '<div class="field"><span class="field-label" id="' + prefix + '-yr-l">School year</span><div class="choice" role="group" aria-labelledby="' + prefix + '-yr-l" data-group="year">' + yr + '</div></div>' +
      '<div class="field" data-field="lang"><span class="field-label" id="' + prefix + '-lang-l">Modern language</span><div class="choice" role="group" aria-labelledby="' + prefix + '-lang-l" data-group="lang">' + lang + '</div></div>' +
      '<div class="field"><label for="' + prefix + '-exempt">Do you have an exemption?</label><select class="input" id="' + prefix + '-exempt">' + ex + '</select></div>';
  };
  // Wires the choice buttons inside a profile form.
  SN.wireProfileFields = function (box) {
    var sel = box.querySelector('select[id$="-exempt"]'), langF = box.querySelector('[data-field="lang"]');
    function syncLang() { if (sel && langF) langF.classList.toggle('hidden', sel.value === 'language'); }
    if (sel) sel.addEventListener('change', function () { syncLang(); box.dispatchEvent(new Event('change')); });
    syncLang();
    box.querySelectorAll('.choice').forEach(function (g) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b || b.disabled) return;
        g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        box.dispatchEvent(new Event('change'));
      });
    });
  };
  SN.readProfileFields = function (box, p, prefix) {
    var yr = box.querySelector('[data-group="year"] [aria-pressed="true"]');
    var lang = box.querySelector('[data-group="lang"] [aria-pressed="true"]');
    p.name = box.querySelector('#' + prefix + '-name').value.trim();
    p.yearMode = yr ? yr.dataset.year : (p.yearMode || '1');
    p.lang = lang ? lang.dataset.lang : (p.lang || 'fr');
    p.exempt = box.querySelector('#' + prefix + '-exempt').value;
    return p;
  };

  /* ── Settings drawer (available on every page) ───────────── */
  var settingsEl = null, confirmEl = null, photo = null;
  var SILHOUETTE = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15" r="9" fill="currentColor"/><path d="M2 40c0-9.9 8.1-18 18-18s18 8.1 18 18" fill="currentColor"/></svg>';
  function paintAvatar() {
    var av = settingsEl.querySelector('.avatar'), name = settingsEl.querySelector('#set-name').value.trim();
    if (photo) { av.style.backgroundImage = 'url("' + photo + '")'; av.innerHTML = ''; }
    else { av.style.backgroundImage = ''; av.innerHTML = name ? esc(name.charAt(0).toUpperCase()) : SILHOUETTE; }
    settingsEl.querySelector('[data-act="rm-photo"]').classList.toggle('hidden', !photo);
  }
  function resizeImage(file, maxPx) {
    return new Promise(function (resolve, reject) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        URL.revokeObjectURL(url);
        var r = Math.min(maxPx / img.width, maxPx / img.height, 1), c = document.createElement('canvas');
        c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); // transparent PNGs become white, not black
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('unreadable image')); };
      img.src = url;
    });
  }
  function buildSettings() {
    var p = SN.getProfile(), s = SN.getStreak();
    settingsEl = document.createElement('div');
    settingsEl.className = 'overlay side hidden';
    settingsEl.innerHTML = '<div class="drawer" role="dialog" aria-modal="true" aria-labelledby="set-title">' +
      '<div class="drawer-head"><h2 id="set-title">Settings</h2><button type="button" class="icon-btn" data-act="close" aria-label="Close settings">' + SN.ic('x') + '</button></div>' +
      '<div class="drawer-body">' +
        '<section class="drawer-sec"><h3>Profile</h3>' +
          '<div class="avatar-row"><div class="avatar"></div><div style="display:flex;gap:.4rem;flex-wrap:wrap">' +
            '<button type="button" class="btn" data-act="photo">Change photo</button><button type="button" class="btn" data-act="rm-photo">Remove</button></div></div>' +
          '<input type="file" accept="image/*" class="hidden" data-act="file">' +
          SN.profileFields(p, 'set') +
        '</section>' +
        '<section class="drawer-sec"><h3>Study streak</h3><div class="streak-box">' +
          '<div class="streak-top">' + SN.ic('star', 'icon star') + '<span><b class="num">' + plural(s.stars, 'star') + '</b> · ' + plural(s.count, 'day') + ' streak</span></div>' +
          '<div class="bar"><i style="width:' + (s.progress * 10) + '%"></i></div>' +
          '<small>' + s.progress + ' of 10 study days to your next star. ' + (s.studiedToday ? 'Today counts.' : 'Answer a question to count today.') + '</small>' +
        '</div></section>' +
        '<div id="set-extra"></div>' +
        '<section class="drawer-sec"><h3>Your data</h3>' +
          '<p style="font-size:.875rem;color:var(--muted);margin-bottom:.7rem">Everything is saved in this browser only.</p>' +
          '<button type="button" class="btn block danger" data-act="clear">Clear all data\u2026</button></section>' +
      '</div><div class="drawer-foot"><button type="button" class="btn primary block" data-act="save">Save changes</button></div></div>';
    document.body.appendChild(settingsEl);
    SN.wireProfileFields(settingsEl);
    (SN.settingsHooks || []).forEach(function (fn) { try { fn(settingsEl.querySelector('#set-extra')); } catch (e) {} });
    settingsEl.addEventListener('click', function (e) {
      if (e.target === settingsEl) return SN.closeSettings();
      var a = e.target.closest('[data-act]');
      if (!a) return;
      var act = a.dataset.act;
      if (act === 'close') SN.closeSettings();
      else if (act === 'photo') settingsEl.querySelector('[data-act="file"]').click();
      else if (act === 'rm-photo') { photo = null; paintAvatar(); }
      else if (act === 'save') saveSettings();
      else if (act === 'clear') SN.openDialog(confirmEl, { onEscape: function () { SN.closeDialog(confirmEl); }, initialFocus: '[data-act="cancel"]' });
    });
    settingsEl.querySelector('#set-name').addEventListener('input', paintAvatar);
    settingsEl.querySelector('[data-act="file"]').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      resizeImage(f, 240).then(function (d) { photo = d; paintAvatar(); })
        .catch(function () { alert('That file could not be opened as an image. Try a JPG or PNG.'); });
      e.target.value = '';
    });
    confirmEl = document.createElement('div');
    confirmEl.className = 'overlay hidden';
    confirmEl.style.zIndex = 400;
    confirmEl.innerHTML = '<div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="cf-t" aria-describedby="cf-d" style="max-width:360px">' +
      '<h2 id="cf-t">Clear all data?</h2><p class="lead" id="cf-d">This deletes your profile, progress, streak and settings from this browser. It can’t be undone.</p>' +
      '<div class="dialog-actions"><button type="button" class="btn" data-act="cancel">Cancel</button><button type="button" class="btn primary danger" data-act="wipe">Clear data</button></div></div>';
    document.body.appendChild(confirmEl);
    confirmEl.addEventListener('click', function (e) {
      var a = e.target.closest('[data-act]');
      if (e.target === confirmEl || (a && a.dataset.act === 'cancel')) SN.closeDialog(confirmEl);
      else if (a && a.dataset.act === 'wipe') { try { localStorage.clear(); sessionStorage.clear(); } catch (x) {} location.href = 'index.html'; }
    });
  }
  function saveSettings() {
    var p = SN.readProfileFields(settingsEl, SN.getProfile(), 'set');
    if (photo) p.photo = photo; else delete p.photo;
    if (!SN.saveProfile(p)) { alert('Could not save. Your browser storage may be full. Try removing your photo.'); return; }
    location.reload(); // every page re-renders from the saved profile
  }
  SN.openSettings = function () {
    if (!settingsEl) buildSettings();
    photo = SN.getProfile().photo || null;
    paintAvatar();
    SN.openDialog(settingsEl, { onEscape: SN.closeSettings, initialFocus: '#set-name' });
  };
  SN.closeSettings = function () { if (settingsEl) SN.closeDialog(settingsEl); };
  // Old links to index.html#settings still open Settings.
  window.addEventListener('load', function () {
    if (location.hash === '#settings') { history.replaceState(null, '', location.pathname + location.search); SN.openSettings(); }
  });
})();
