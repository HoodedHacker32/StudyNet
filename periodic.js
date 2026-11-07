/* StudyNet — interactive periodic table (a notes widget: { widget: 'periodic' }).
   "First 20" shows the Junior Cycle elements in groups 1, 2 and 13–18; "All 118" shows the full table.
   Choosing an element shows its particles, electron arrangement and a Bohr diagram drawn like the class notes
   (protons and neutrons in the nucleus, electrons placed singly at the four sides of a shell before they pair up). */
(function () {
  'use strict';
  var FAMILY = { hydrogen: 'Hydrogen (non-metal)', alkali: 'Alkali metal', alkaline: 'Alkaline earth metal', transition: 'Transition metal',
    post: 'Metal', metalloid: 'Metalloid', nonmetal: 'Non-metal', halogen: 'Halogen', noble: 'Noble gas', lanthanide: 'Lanthanide (metal)', actinide: 'Actinide (metal)' };
  var KEY = [['alkali', 'Alkali metals'], ['alkaline', 'Alkaline earth metals'], ['transition', 'Transition metals'], ['post', 'Other metals'], ['metalloid', 'Metalloids'],
    ['nonmetal', 'Non-metals'], ['halogen', 'Halogens'], ['noble', 'Noble gases']];
  function metalType(e) { return /alkali|alkaline|transition|post|lanthanide|actinide/.test(e.fam) ? 'Metal' : e.fam === 'metalloid' ? 'Metalloid' : 'Non-metal'; }
  function shells(z) { var out = [], caps = [2, 8, 8, 2], n = z; for (var i = 0; i < caps.length && n > 0; i++) { var k = Math.min(caps[i], n); out.push(k); n -= k; } return out; }

  // Electrons at top, bottom, left, right first, then paired up (as drawn in class).
  function bohr(e) {
    var sh = shells(e.z), R0 = 17, step = 13, size = 2 * (R0 + step * sh.length) + 16, c = size / 2;
    var svg = '<svg class="pt-bohr" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Bohr diagram of ' + e.name + ': ' + sh.join(', ') + '">';
    svg += '<circle cx="' + c + '" cy="' + c + '" r="' + R0 + '" fill="var(--bg)" stroke="currentColor" stroke-width="1.4"/>';
    svg += '<text x="' + c + '" y="' + (c - 2) + '" text-anchor="middle" font-size="8.5" fill="currentColor">P' + e.z + '</text>';
    svg += '<text x="' + c + '" y="' + (c + 8) + '" text-anchor="middle" font-size="8.5" fill="currentColor">N' + (e.mass - e.z) + '</text>';
    var dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    sh.forEach(function (n, i) {
      var r = R0 + step * (i + 1);
      svg += '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke="currentColor" stroke-width="1.4"/>';
      for (var k = 0; k < n; k++) {
        var d = dirs[k % 4], pair = n > 4 && k % 4 < n - 4, off = pair ? (k < 4 ? -3.2 : 3.2) : 0;
        var x = c + d[0] * r + (d[1] ? off : 0), y = c + d[1] * r + (d[0] ? off : 0);
        svg += '<circle class="e" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.3"/>';
      }
    });
    return svg + '</svg>';
  }
  function detail(e) {
    var esc = SN.escHtml, jc = e.z <= 20, h = '<div class="pt-detail" data-fam="' + e.fam + '">';
    h += '<div class="pt-tile"><div class="pt-big" aria-hidden="true"><span class="z">' + e.z + '</span><b>' + esc(e.sym) + '</b>' + (e.mass ? '<span class="a">' + e.mass + '</span>' : '') + '</div>' +
      '<div><div class="pt-name">' + esc(e.name) + '</div><div class="pt-fam">' + esc(FAMILY[e.fam]) + (e.fblock ? '' : ' · group ' + e.group) + ' · period ' + e.period + '</div></div></div>';
    if (jc) {
      var sh = shells(e.z);
      h += '<dl class="kv">' +
        '<dt>Atomic number</dt><dd>' + e.z + ' (the number of protons)</dd>' +
        '<dt>Mass number</dt><dd>' + e.mass + ' (protons + neutrons)</dd>' +
        '<dt>Protons</dt><dd>' + e.z + '</dd><dt>Neutrons</dt><dd>' + e.mass + ' − ' + e.z + ' = ' + (e.mass - e.z) + '</dd><dt>Electrons</dt><dd>' + e.z + ' (same as protons in a neutral atom)</dd>' +
        '<dt>Electron arrangement</dt><dd><b>' + sh.join(', ') + '</b> (' + sh.length + ' shell' + (sh.length > 1 ? 's' : '') + ', ' + sh[sh.length - 1] + ' in the outer shell)</dd>' +
        '<dt>Type</dt><dd>' + metalType(e) + ', ' + e.state + ' at room temperature</dd></dl>';
      h += bohr(e);
      if (e.z === 17) h += '<p class="pt-note">Chlorine’s mass number here is 35, its most common isotope. Tables that average all isotopes give 35.5.</p>';
    } else {
      h += '<p class="pt-note">Beyond calcium (20), the electron arrangement isn’t on the Junior Cycle course. ' + esc(e.name) + ' is a ' + metalType(e).toLowerCase() + ', ' + e.state + ' at room temperature.</p>';
    }
    return h + '</div>';
  }

  function render(el) {
    var all = SN_DATA.elements, wide = el.dataset.view === 'all', sel = +(el.dataset.sel || 11);
    var list = wide ? all : all.slice(0, 20), cols = wide ? 18 : 8;
    var colOf = function (e) { return wide ? e.group : (e.group <= 2 ? e.group : e.group - 10); };
    var rows = wide ? 10 : 4, cells = [];
    for (var r = 1; r <= rows; r++) for (var cc = 1; cc <= cols; cc++) cells.push(null);
    list.forEach(function (e) { var row = e.row > 7 ? e.row : e.period; cells[(row - 1) * cols + colOf(e) - 1] = e; });
    var h = '<div class="pt-bar" role="group" aria-label="How much of the table to show">' +
      '<button type="button" class="pill" data-ptview="20" aria-pressed="' + !wide + '">First 20 (your course)</button>' +
      '<button type="button" class="pill" data-ptview="all" aria-pressed="' + wide + '">All 118</button></div>';
    if (!wide) h += '<div class="pt-grid" style="--cols:8;--cell:38px" aria-hidden="true">' + [1, 2, 13, 14, 15, 16, 17, 18].map(function (g) { return '<span class="pt-lbl" title="Group ' + g + '">' + g + '</span>'; }).join('') + '</div>';
    if (wide) h += '<p class="pt-hint">The full table is wide: scroll sideways to see it all.</p>';
    else h += '<p class="pt-hint">Numbers along the top are the groups. Choose an element to see its details.</p>';
    h += '<div class="pt-scroll"><div class="pt-grid' + (wide ? ' wide' : '') + '" role="group" aria-label="Periodic table" style="--cols:' + cols + ';--cell:' + (wide ? '34px' : '38px') + '">';
    cells.forEach(function (e, i) {
      var row = Math.floor(i / cols) + 1;
      if (wide && row === 8) { h += '<span class="pt-gap" aria-hidden="true"></span>'; return; }
      if (!e) {
        var lbl = wide && (i === 5 * cols + 2) ? '57–71' : wide && (i === 6 * cols + 2) ? '89–103' : '';
        h += '<span class="pt-gap' + (lbl ? ' pt-lbl' : '') + '" aria-hidden="true">' + lbl + '</span>'; return;
      }
      h += '<button type="button" class="pt-el" data-fam="' + e.fam + '" data-z="' + e.z + '" aria-pressed="' + (e.z === sel) + '" tabindex="' + (e.z === sel ? 0 : -1) + '" aria-label="' + e.name + ', atomic number ' + e.z + '">' +
        '<span class="z">' + e.z + '</span><span class="sym">' + e.sym + '</span></button>';
    });
    h += '</div></div>';
    h += '<div class="pt-key" aria-hidden="true">' + KEY.map(function (k) { return '<span data-fam="' + k[0] + '"><i></i>' + k[1] + '</span>'; }).join('') + '</div>';
    h += '<div class="pt-out" aria-live="polite">' + detail(all[sel - 1]) + '</div>';
    el.innerHTML = '<div class="pt">' + h + '</div>';
  }

  function mount(el) {
    render(el);
    el.addEventListener('click', function (e) {
      var v = e.target.closest('[data-ptview]');
      if (v) { el.dataset.view = v.dataset.ptview; if (v.dataset.ptview === '20' && +(el.dataset.sel || 0) > 20) el.dataset.sel = 11; render(el); el.querySelector('[data-ptview="' + v.dataset.ptview + '"]').focus(); return; }
      var b = e.target.closest('.pt-el');
      if (b) { el.dataset.sel = b.dataset.z; render(el); el.querySelector('.pt-el[data-z="' + b.dataset.z + '"]').focus(); }
    });
    el.addEventListener('keydown', function (e) { // arrow keys move around the grid
      var b = e.target.closest && e.target.closest('.pt-el'); if (!b) return;
      var d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -2, ArrowDown: 2 }[e.key]; if (!d) return;
      e.preventDefault();
      var btns = Array.prototype.slice.call(el.querySelectorAll('.pt-el')), r0 = b.getBoundingClientRect(), best = null, bd = Infinity;
      btns.forEach(function (x) {
        if (x === b) return;
        var r = x.getBoundingClientRect(), dx = r.left - r0.left, dy = r.top - r0.top;
        var ok = d === -1 ? dx < -2 && Math.abs(dy) < 4 : d === 1 ? dx > 2 && Math.abs(dy) < 4 : d === -2 ? dy < -2 : dy > 2;
        if (!ok) return;
        var dist = Math.abs(dx) + Math.abs(dy) * (Math.abs(d) === 2 ? 1 : 10) + (Math.abs(d) === 2 ? Math.abs(dx) * 3 : 0);
        if (dist < bd) { bd = dist; best = x; }
      });
      if (best) { b.tabIndex = -1; best.tabIndex = 0; best.focus(); }
    });
  }
  if (window.SubjectApp) SubjectApp.addWidget('periodic', mount);
  SN.periodicMount = mount;
})();
