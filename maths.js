/* StudyNet — maths engine (window.MX).
   - MX.m(src): writes maths for display ("3x^2 - 5x", "frac(2x, 3)", "sqrt(88)", "+-").
   - MX.check(spec, input): marks a typed answer. Algebra is checked for equivalence, not exact text,
     so (x + 2)(x + 3) and (x+3)(x+2) both count; factorising answers must be fully factorised.
   - MX.skills: question generators (IXL-style practice), each with a worked solution.
   - MX.inputHtml(): an answer box with a maths keypad and a "reads as" preview.
   Plain browser JS, no build step. Used by maths.html and the practice exam. */
(function () {
  'use strict';
  var MX = window.MX = {};

  /* ── Random numbers (seeded, so an exam paper can be shared by code) ── */
  MX.rng = function (seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function nz(r, a, b) { var v; do { v = ri(r, a, b); } while (v === 0); return v; }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
  MX.gcd = gcd;

  /* ── Display ───────────────────────────────────────────────────── */
  function escH(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  // Reads a balanced (...) group starting at s[i] === '('; returns [inner, indexAfter].
  function group(s, i) {
    var d = 0, j = i;
    for (; j < s.length; j++) { if (s[j] === '(') d++; else if (s[j] === ')') { d--; if (!d) break; } }
    return [s.slice(i + 1, j), j + 1];
  }
  function splitTop(s) { // split on top-level commas
    var out = [], d = 0, cur = '';
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '(') d++; else if (c === ')') d--;
      if (c === ',' && !d) { out.push(cur); cur = ''; } else cur += c;
    }
    out.push(cur);
    return out;
  }
  MX.m = function (src) {
    var s = String(src), out = '', i = 0;
    while (i < s.length) {
      var rest = s.slice(i);
      if (/^frac\(/.test(rest)) {
        var g = group(s, i + 4), parts = splitTop(g[0]);
        out += '<span class="mfrac"><span>' + MX.m(parts[0].trim()) + '</span><span>' + MX.m((parts[1] || '').trim()) + '</span></span>';
        i = g[1]; continue;
      }
      if (/^sqrt\(/.test(rest)) {
        var g2 = group(s, i + 4);
        out += '<span class="msqrt">√<span>' + MX.m(g2[0]) + '</span></span>';
        i = g2[1]; continue;
      }
      if (rest[0] === '^') {
        if (rest[1] === '(') { var g3 = group(s, i + 1); out += '<sup>' + MX.m(g3[0]) + '</sup>'; i = g3[1]; continue; }
        var mm = /^\^(-?[0-9a-z]+)/.exec(rest);
        if (mm) {
          var said = mm[1] === '2' ? ' squared' : mm[1] === '3' ? ' cubed' : ' to the power ' + mm[1];
          out += '<sup aria-hidden="true">' + mm[1].replace('-', '−') + '</sup><span class="sr-only">' + said + '</span>'; i += mm[0].length; continue;
        }
      }
      if (rest.slice(0, 2) === '+-') { out += '±'; i += 2; continue; }
      var c = s[i];
      if (c === '-') out += '−';
      else if (c === '*') out += '×';
      else if (/[a-z]/i.test(c) && !/[a-z]/i.test(s[i - 1] || '') && !/[a-z]/i.test(s[i + 1] || '')) out += '<i>' + c + '</i>';
      else out += escH(c);
      i++;
    }
    return '<span class="mx">' + out + '</span>';
  };

  // Builds "3x^2 - 5x + 2" from [[3,'x^2'],[-5,'x'],[2,'']] (zero terms dropped, 1s hidden).
  function ps(terms) {
    var out = '';
    terms.forEach(function (t) {
      var c = t[0], v = t[1] || '';
      if (!c) return;
      var a = Math.abs(c), body = v ? (a === 1 ? '' : a) + v : String(a);
      out += out ? (c < 0 ? ' - ' : ' + ') + body : (c < 0 ? '-' : '') + body;
    });
    return out || '0';
  }
  MX.ps = ps;
  function lin(a, b, v) { return ps([[a, v || 'x'], [b, '']]); } // "2x - 3"
  function br(s) { return '(' + s + ')'; }
  function sgn(n) { return n < 0 ? '- ' + Math.abs(n) : '+ ' + n; }
  function num(n) { return n < 0 ? '-' + Math.abs(n) : String(n); }
  function paren(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function fracStr(p, q) { // p/q in lowest terms, as display source
    if (q < 0) { p = -p; q = -q; }
    var g = gcd(p, q) || 1; p /= g; q /= g;
    if (q === 1) return String(p);
    return (p < 0 ? '-' : '') + 'frac(' + Math.abs(p) + ', ' + q + ')';
  }
  MX.fracStr = fracStr;
  function fracPlain(p, q) { if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; p /= g; q /= g; return q === 1 ? String(p) : p + '/' + q; }
  function round(v, dp) { var f = Math.pow(10, dp); return Math.round(v * f + (v >= 0 ? 1e-9 : -1e-9)) / f; }

  /* ── Parsing typed answers ─────────────────────────────────────── */
  function clean(s) {
    return String(s).replace(/[−–—]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/')
      .replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4').replace(/√/g, ' sqrt ')
      .replace(/\s*\^\s*/g, '^').replace(/\s+/g, ' ').trim();
  }
  function tokenize(s) {
    var toks = [], re = /\s*(sqrt|\d+(?:[.,]\d+)?|\.\d+|[a-z]|[-+*/^()=,])/gy, m, last = 0;
    s = s.toLowerCase();
    while (last < s.length) {
      re.lastIndex = last;
      m = re.exec(s);
      if (!m) { if (/^\s*$/.test(s.slice(last))) break; throw new Error('bad'); }
      toks.push(m[1].replace(',', m[1].length > 1 && /\d,\d/.test(m[1]) ? '.' : ','));
      last = re.lastIndex;
    }
    return toks;
  }
  // AST: {n:value} | {v:'x'} | {op:'+',a,b} | {op:'-',a,b} | {op:'*',a,b} | {op:'/',a,b} | {op:'^',a,b} | {op:'neg',a} | {op:'sqrt',a}
  function parse(str) {
    var t = tokenize(clean(str)), i = 0;
    function peek() { return t[i]; }
    function eat(x) { if (t[i] !== x) throw new Error('expected ' + x); i++; }
    function startsAtom(x) { return x !== undefined && (/^[\d.]/.test(x) || /^[a-z]$/.test(x) || x === '(' || x === 'sqrt'); }
    function expr() {
      var a = term();
      while (peek() === '+' || peek() === '-') { var o = t[i++]; a = { op: o, a: a, b: term() }; }
      return a;
    }
    function term() {
      var a = unary();
      for (;;) {
        if (peek() === '*' || peek() === '/') { var o = t[i++]; a = { op: o, a: a, b: unary() }; }
        else if (startsAtom(peek())) a = { op: '*', a: a, b: power() };
        else return a;
      }
    }
    function unary() {
      if (peek() === '-') { i++; return { op: 'neg', a: unary() }; }
      if (peek() === '+') { i++; return unary(); }
      return power();
    }
    function power() {
      var a = atom();
      if (peek() === '^') { i++; return { op: '^', a: a, b: peek() === '-' ? (i++, { op: 'neg', a: atom() }) : atom() }; }
      return a;
    }
    function atom() {
      var x = t[i++];
      if (x === undefined) throw new Error('end');
      if (x === '(') { var e = expr(); eat(')'); return e; }
      if (x === 'sqrt') {
        if (peek() === '(') { i++; var e2 = expr(); eat(')'); return { op: 'sqrt', a: e2 }; }
        return { op: 'sqrt', a: atom() };
      }
      if (/^[\d.]/.test(x)) return { n: parseFloat(x) };
      if (/^[a-z]$/.test(x)) return { v: x };
      throw new Error('unexpected ' + x);
    }
    var e = expr();
    if (i < t.length) throw new Error('left over');
    return e;
  }
  MX.parse = parse;
  function topCount(ast) { // how many terms are added or taken away at the top level
    if (ast.op === '+' || ast.op === '-') return topCount(ast.a) + topCount(ast.b);
    return 1;
  }

  /* ── Polynomials: { "x2y1": coef } ─────────────────────────────── */
  function key(m) { return Object.keys(m).filter(function (k) { return m[k]; }).sort().map(function (k) { return k + m[k]; }).join(''); }
  function unkey(k) { var m = {}, re = /([a-z])(\d+)/g, x; while ((x = re.exec(k))) m[x[1]] = +x[2]; return m; }
  function P(c) { var p = {}; if (c) p[''] = c; return p; }
  function padd(p, q, s) { var r = {}, k; for (k in p) r[k] = p[k]; for (k in q) { r[k] = (r[k] || 0) + (s || 1) * q[k]; if (Math.abs(r[k]) < 1e-9) delete r[k]; } return r; }
  function pmul(p, q) {
    var r = {};
    for (var a in p) for (var b in q) {
      var ma = unkey(a), mb = unkey(b);
      for (var v in mb) ma[v] = (ma[v] || 0) + mb[v];
      var k = key(ma);
      r[k] = (r[k] || 0) + p[a] * q[b];
      if (Math.abs(r[k]) < 1e-9) delete r[k];
    }
    return r;
  }
  function isConst(p) { var ks = Object.keys(p); return !ks.length || (ks.length === 1 && ks[0] === ''); }
  function cval(p) { return p[''] || 0; }
  function poly(ast) {
    if (ast.n != null) return P(ast.n);
    if (ast.v) { var p = {}; p[ast.v + '1'] = 1; return p; }
    switch (ast.op) {
      case '+': return padd(poly(ast.a), poly(ast.b));
      case '-': return padd(poly(ast.a), poly(ast.b), -1);
      case 'neg': return padd({}, poly(ast.a), -1);
      case '*': return pmul(poly(ast.a), poly(ast.b));
      case '/': {
        var d = poly(ast.b);
        if (!isConst(d) || !cval(d)) throw new Error('not a polynomial');
        return pmul(poly(ast.a), P(1 / cval(d)));
      }
      case '^': {
        var e = poly(ast.b);
        if (!isConst(e)) throw new Error('not a polynomial');
        var n = cval(e);
        if (n < 0 || n > 12 || Math.round(n) !== n) throw new Error('not a polynomial');
        var r = P(1), base = poly(ast.a);
        for (var j = 0; j < n; j++) r = pmul(r, base);
        return r;
      }
      case 'sqrt': {
        var s = poly(ast.a);
        if (!isConst(s) || cval(s) < 0) throw new Error('not a polynomial');
        return P(Math.sqrt(cval(s)));
      }
    }
    throw new Error('?');
  }
  MX.poly = function (s) { return poly(typeof s === 'string' ? parse(s) : s); };
  function peq(p, q) {
    var d = padd(p, q, -1);
    for (var k in d) if (Math.abs(d[k]) > 1e-6) return false;
    return true;
  }
  function numVal(ast) { var p = poly(ast); if (!isConst(p)) throw new Error('not a number'); return cval(p); }

  // Top-level factors of a product: (x + 2)(x - 3), 3q(5p + q), -2(x - 1)^2
  function factors(ast) {
    if (ast.op === '*') return factors(ast.a).concat(factors(ast.b));
    if (ast.op === 'neg') return [{ n: -1 }].concat(factors(ast.a));
    if (ast.op === '^' && ast.b.n != null && ast.b.n > 1 && ast.b.n < 6) { var out = []; for (var i = 0; i < ast.b.n; i++) out = out.concat(factors(ast.a)); return out; }
    return [ast];
  }
  // Is a polynomial factor still factorisable (common factor, a perfect-square split, or a difference of squares)?
  function contentOf(p) {
    var ks = Object.keys(p), g = 0, common = null;
    ks.forEach(function (k) {
      g = gcd(g, Math.round(p[k]));
      var m = unkey(k);
      if (common === null) common = m;
      else for (var v in common) common[v] = Math.min(common[v], m[v] || 0);
    });
    var vars = []; for (var v in common) if (common[v] > 0) vars.push(v);
    return { g: g, vars: vars };
  }
  function isSquare(n) { if (n < 0) return false; var r = Math.round(Math.sqrt(n)); return r * r === n; }
  function reducible(p) {
    var ks = Object.keys(p);
    if (ks.length < 2) return null;
    var c = contentOf(p);
    if (c.g > 1 || c.vars.length) return 'common';
    var vars = {}; ks.forEach(function (k) { var m = unkey(k); for (var v in m) vars[v] = 1; });
    var vl = Object.keys(vars);
    if (vl.length === 1) { // ax^2 + bx + c in one letter
      var v = vl[0], a = p[v + '2'] || 0, b = p[v + '1'] || 0, cc = p[''] || 0, deg2 = ks.every(function (k) { return k === '' || k === v + '1' || k === v + '2'; });
      if (deg2 && a && isSquare(b * b - 4 * a * cc)) return 'quadratic';
    }
    if (ks.length === 2) { // u^2 - w^2 with both squares
      var t = ks.map(function (k) { return { k: k, c: p[k], m: unkey(k) }; });
      var sq = t.every(function (x) { for (var v in x.m) if (x.m[v] % 2) return false; return isSquare(Math.abs(x.c)); });
      if (sq && t[0].c * t[1].c < 0) return 'dots';
    }
    return null;
  }

  /* ── Marking a typed answer ────────────────────────────────────── */
  // Turns "x = 3 or x = -5", "3, -5", "3 ± 2√2" into numbers.
  function values(input) {
    var s = clean(input).toLowerCase().replace(/\b(or|and)\b/g, ',').replace(/;/g, ',');
    var out = [];
    splitTop(s).forEach(function (part) {
      part = part.replace(/^\s*[a-z]\s*=\s*/, '').trim();
      if (!part) return;
      var pm = part.split('+-');
      if (part.indexOf('±') >= 0) pm = part.split('±');
      if (pm.length === 2) {
        var a = pm[0].trim() ? numVal(parse(pm[0])) : 0, b = numVal(parse(pm[1]));
        out.push(a + b, a - b);
      } else out.push(numVal(parse(part)));
    });
    return out;
  }
  MX.values = values;
  function sameSet(got, want, dp) {
    if (got.length !== want.length) return false;
    var left = want.slice();
    return got.every(function (g) {
      for (var i = 0; i < left.length; i++) {
        var ok = dp != null ? round(g, dp) === round(left[i], dp) : Math.abs(g - left[i]) < 1e-6;
        if (ok) { left.splice(i, 1); return true; }
      }
      return false;
    });
  }
  /* spec kinds:
       { kind:'expr', expr:'(x+2)(x+3)', form:'factorised'|'expanded'|'surd' }
       { kind:'values', vals:[3,-5], dp?, surd? }       solutions of an equation
       { kind:'pair', vals:{x:1,y:2} }                   simultaneous equations
       { kind:'equation', expr:'x^2 - x - 6' }           any equation equivalent to expr = 0 (integer coefficients)
     Returns { ok, msg } — msg explains a near miss. */
  MX.check = function (spec, input) {
    input = String(input || '').trim();
    if (!input) return { ok: false, empty: true };
    try {
      if (spec.kind === 'values') {
        if (spec.surd && !/√|sqrt/i.test(input)) return { ok: false, msg: 'Give the answer in surd form (with √), not as a decimal.' };
        var got = values(input);
        if (sameSet(got, spec.vals, spec.dp)) return { ok: true };
        if (got.length !== spec.vals.length) return { ok: false, msg: 'There should be ' + spec.vals.length + ' answer' + (spec.vals.length > 1 ? 's' : '') + '. Separate them with a comma.' };
        if (spec.dp != null && got.some(function (g) { return spec.vals.some(function (w) { return Math.abs(g - w) < Math.pow(10, -spec.dp) * 1.5; }); }))
          return { ok: false, msg: 'Close: check your rounding to ' + spec.dp + ' decimal place' + (spec.dp > 1 ? 's' : '') + '.' };
        return { ok: false };
      }
      if (spec.kind === 'pair') {
        var s = clean(input).toLowerCase(), names = Object.keys(spec.vals), got2 = {};
        var named = s.match(/[a-z]\s*=\s*[^,;]+/g);
        if (named && named.length === names.length) named.forEach(function (a) { var p = a.split('='); got2[p[0].trim()] = numVal(parse(p[1])); });
        else { var vs = values(s); if (vs.length !== names.length) return { ok: false, msg: 'Give both values, like ' + names.map(function (n) { return n + ' = …'; }).join(', ') + '.' }; names.forEach(function (n, i) { got2[n] = vs[i]; }); }
        var ok = names.every(function (n) { return got2[n] != null && Math.abs(got2[n] - spec.vals[n]) < 1e-6; });
        if (!ok && names.every(function (n) { return got2[names[0] === n ? names[1] : names[0]] != null; })) {
          var swapped = Math.abs(got2[names[0]] - spec.vals[names[1]]) < 1e-6 && Math.abs(got2[names[1]] - spec.vals[names[0]]) < 1e-6;
          if (swapped) return { ok: false, msg: 'Those look swapped. Check which value is ' + names[0] + ' and which is ' + names[1] + '.' };
        }
        return { ok: ok };
      }
      if (spec.kind === 'equation') {
        var sides = clean(input).split('=');
        if (sides.length !== 2) return { ok: false, msg: 'Write it as an equation, ending in = 0.' };
        var L = padd(MX.poly(sides[0]), MX.poly(sides[1]), -1), W = MX.poly(spec.expr), ratio = null, good = true;
        var ks = Object.keys(L).concat(Object.keys(W));
        ks.forEach(function (k) {
          var a = L[k] || 0, b = W[k] || 0;
          if (!b && Math.abs(a) > 1e-9) good = false;
          else if (b) { var r = a / b; if (ratio === null) ratio = r; else if (Math.abs(r - ratio) > 1e-9) good = false; }
        });
        if (!good || !ratio) return { ok: false };
        if (Object.keys(L).some(function (k) { return Math.abs(L[k] - Math.round(L[k])) > 1e-9; })) return { ok: false, msg: 'Right equation, but clear the fractions so a, b and c are whole numbers.' };
        return { ok: true };
      }
      // expressions
      var ast = parse(input), want = MX.poly(spec.expr), have = poly(ast);
      if (!peq(have, want)) return { ok: false };
      if (spec.form === 'factorised') {
        var fs = factors(ast), sums = fs.filter(function (f) { return Object.keys(poly(f)).length > 1; });
        if (!sums.length && Object.keys(want).length > 1) return { ok: false, msg: 'That’s equal to the expression, but it isn’t factorised. Put it into brackets.' };
        for (var i = 0; i < sums.length; i++) {
          var why = reducible(poly(sums[i]));
          if (why === 'common') return { ok: false, msg: 'Nearly: a bracket still has a common factor. Factorise fully.' };
          if (why) return { ok: false, msg: 'Nearly: one bracket can still be factorised. Factorise fully.' };
        }
        return { ok: true };
      }
      if (spec.form === 'expanded' && /\(/.test(input)) return { ok: false, msg: 'Correct value, but multiply out the brackets.' };
      if ((spec.form === 'expanded' || spec.form === 'simplified') && topCount(ast) > Object.keys(have).length) return { ok: false, msg: 'Correct value, but collect the like terms into one.' };
      if (spec.form === 'surd') {
        var roots = [];
        (function walk(n) { if (!n || n.n != null || n.v) return; if (n.op === 'sqrt') roots.push(numVal(n.a)); walk(n.a); walk(n.b); })(ast);
        if (roots.length !== 1) return { ok: false, msg: 'Write it as a whole number times one square root, like 4√2.' };
        var r = roots[0];
        for (var d = 2; d * d <= r; d++) if (r % (d * d) === 0) return { ok: false, msg: 'Nearly: the number under the √ still has a square factor (' + d * d + ').' };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, msg: 'I couldn’t read that. Use x^2 or x² for squares, brackets for factors and / for fractions.' };
    }
  };

  /* ── Method marks: spotting correct steps in a student's working ── */
  // Each generator lists checkpoints (cp). A line of working that passes one earns that band:
  // 'hi' (high partial credit: substantially correct method) or 'lo' (low partial credit: a correct first step).
  function polyOf(src) { return poly(parse(src)); }
  function proportional(p, q) { // p = k·q for some k ≠ 0
    var k = null, ks = Object.keys(p).concat(Object.keys(q));
    if (!Object.keys(q).length) return false;
    for (var i = 0; i < ks.length; i++) {
      var a = p[ks[i]] || 0, b = q[ks[i]] || 0;
      if (!b) { if (Math.abs(a) > 1e-9) return false; continue; }
      var r = a / b; if (k === null) k = r; else if (Math.abs(r - k) > 1e-9) return false;
    }
    return !!k;
  }
  function subtrees(ast, out) { out = out || []; if (!ast || ast.n != null || ast.v) return out; out.push(ast); subtrees(ast.a, out); subtrees(ast.b, out); return out; }
  function topTerms(src) { return (String(src).replace(/\([^()]*\)/g, '()').match(/[+\-−]/g) || []).length + 1; }
  // Working that only copies out the question earns nothing.
  var qNorm = '';
  function normM(x) { return clean(x).toLowerCase().replace(/\s+/g, '').replace(/[.]+$/, ''); }
  function inQ(x) { var n = normM(x); return !!n && qNorm.indexOf(n) >= 0; }
  function questionText(html) {
    return String(html).replace(/<span class="sr-only">[^<]*<\/span>/g, '').replace(/<sup[^>]*>(.*?)<\/sup>/g, '^$1')
      .replace(/<span class="mfrac"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, '($1)/($2)').replace(/<[^>]+>/g, '');
  }
  function test(cp, line) {
    if (inQ(line)) return false;
    var segs = line.split('=').map(function (x) { return x.trim(); }), exprs = segs.filter(function (x) { return x && !inQ(x); });
    var eq = segs.length === 2 && segs[0] && segs[1] && !(inQ(segs[0]) && inQ(segs[1])) ? { L: segs[0], R: segs[1] } : null;
    function anyExpr(fn) { return exprs.some(function (x) { try { return fn(x, parse(x)); } catch (e) { return false; } }); }
    function eqPoly() { return padd(polyOf(eq.L), polyOf(eq.R), -1); }
    switch (cp.kind) {
      case 'num': return new RegExp('(^|[^\\d.])' + String(Math.abs(cp.n)).replace('.', '\\.') + '(?![\\d.])').test(line);
      case 'equiv': return anyExpr(function (x, a) { return peq(poly(a), polyOf(cp.e)) && x.replace(/\s/g, '') !== cp.e.replace(/\s/g, ''); });
      case 'step': return anyExpr(function (x, a) { return peq(poly(a), polyOf(cp.e)) && (/\(/.test(x) || topTerms(x) > topTerms(cp.e)); });
      case 'product': return anyExpr(function (x, a) { return peq(poly(a), polyOf(cp.e)) && factors(a).some(function (f) { return Object.keys(poly(f)).length > 1; }); });
      case 'factor': { // a correct bracket: high credit if the whole line is right, low if only that bracket is
        var res = false;
        anyExpr(function (x, a) {
          var hit = factors(a).some(function (f) { var pf = poly(f); return cp.f.some(function (g) { return proportional(pf, polyOf(g)); }); });
          if (!hit) return false;
          if (peq(poly(a), polyOf(cp.e))) { res = true; return true; }
          if (!res) res = 'lo';
          return false;
        });
        return res;
      }
      case 'has': return anyExpr(function (x, a) {
        if (!peq(poly(a), polyOf(cp.e))) return false;
        return subtrees(a).some(function (n) { var pn; try { pn = poly(n); } catch (e) { return false; } return Object.keys(pn).length > 1 && cp.f.some(function (g) { return proportional(pn, polyOf(g)); }); });
      });
      case 'term': return anyExpr(function (x, a) { var p = poly(a); return Math.abs((p[cp.m] || 0) - cp.c) < 1e-9; });
      case 'term2': return anyExpr(function (x, a) { var p = poly(a); return cp.t.every(function (t) { return Math.abs((p[t[1]] || 0) - t[0]) < 1e-9; }); });
      case 'eqn': if (!eq) return false; try { return proportional(eqPoly(), polyOf(cp.e)) && segs[1].replace(/\s/g, '') === '0'; } catch (e) { return false; }
      case 'eqfactor': {
        if (!eq) return false;
        try {
          var a = parse(eq.L), whole = padd(poly(a), polyOf(eq.R), -1); if (!proportional(whole, polyOf(cp.e)) || segs[1].replace(/\s/g, '') !== '0') {
            // fromRoots: "x + 3 = 0" is a factor of the answer
            if (cp.both) return false;
            var want = polyOf(cp.e), pf = whole;
            return Object.keys(pf).length > 1 && dividesEvenly(want, pf);
          }
          var fs = factors(a).filter(function (f) { return Object.keys(poly(f)).length > 1; });
          return cp.both ? fs.length >= 2 : fs.length >= 1;
        } catch (e) { return false; }
      }
      case 'value': {
        var m = /^\s*[a-z]\s*=\s*(.+)$/.exec(line); if (!m) return false;
        try { var v = numVal(parse(m[1])); return cp.vals.some(function (w) { return cp.dp != null ? round(v, cp.dp) === round(w, cp.dp) : Math.abs(v - w) < 1e-6; }); } catch (e) { return false; }
      }
      case 'named': {
        var mm = /^\s*([a-z])\s*=\s*([^,;]+)$/.exec(line); if (!mm || cp.vals[mm[1]] == null) return false;
        try { return Math.abs(numVal(parse(mm[2])) - cp.vals[mm[1]]) < 1e-6; } catch (e) { return false; }
      }
      case 'sat': { // a correct linear equation in x and y (not just a copy of the question)
        if (!eq) return false;
        try {
          var p = eqPoly(), ks = Object.keys(p);
          if (!ks.length || ks.some(function (k) { return k !== '' && k !== 'x1' && k !== 'y1'; }) || !(p.x1 || p.y1)) return false;
          var val = (p[''] || 0) + (p.x1 || 0) * cp.vals.x + (p.y1 || 0) * cp.vals.y;
          if (Math.abs(val) > 1e-6) return false;
          return !(cp.not || []).some(function (g) { var s2 = g.split('='); try { return proportional(p, padd(polyOf(s2[0]), polyOf(s2[1]), -1)); } catch (e) { return false; } });
        } catch (e) { return false; }
      }
      case 'cleared': { // linear equation with no fractions that x satisfies
        if (!eq || /\//.test(line)) return false;
        try { var q = eqPoly(); if (!q.x1 || Object.keys(q).some(function (k) { return k !== '' && k !== 'x1'; })) return false; return Math.abs((q[''] || 0) + q.x1 * cp.x) < 1e-6; } catch (e) { return false; }
      }
      case 'isolated': { // "kx = m" with the right numbers
        if (!eq) return false;
        try { var L2 = polyOf(eq.L), R2 = polyOf(eq.R); if (Object.keys(L2).join() !== 'x1' || !isConst(R2)) return false; return Math.abs(L2.x1 * cp.x - cval(R2)) < 1e-6; } catch (e) { return false; }
      }
      case 'abc': {
        var t = clean(line).toLowerCase().replace(/\s/g, '');
        function has(n, v) { return new RegExp(n + '=' + (v < 0 ? '-' : '\\+?') + Math.abs(v) + '(?![\\d.])').test(t); }
        return has('a', cp.a) && has('b', cp.b) && has('c', cp.c);
      }
    }
    return false;
  }
  function dividesEvenly(p, f) { // does linear f divide polynomial p (one variable)? check p(root of f) = 0
    var v = null; Object.keys(f).forEach(function (k) { var m = /^([a-z])1$/.exec(k); if (m) v = m[1]; });
    if (!v || Object.keys(f).some(function (k) { return k !== '' && k !== v + '1'; })) return false;
    var root = -(f[''] || 0) / f[v + '1'], val = 0;
    Object.keys(p).forEach(function (k) { var m = unkey(k), deg = m[v] || 0; val += p[k] * Math.pow(root, deg); });
    return Math.abs(val) < 1e-6;
  }
  // Best band reached by the working: { band:'hi'|'lo', why } or null.
  MX.method = function (q, working, answer) {
    if (!q.cp) return null;
    qNorm = normM(questionText(q.q));
    var lines = [];
    String((working || '') + '\n' + (answer || '')).split(/\n|;/).forEach(function (x) {
      x = x.trim().replace(/[.✓]+$/, '').trim(); if (!x) return;
      lines.push(x);
      // "HCF first: 4(x^2 − 25)" or "Factorise: (x + 5)(x − 3) = 0": also try the maths after the label
      var after = x.replace(/^.*:\s*/, '');
      if (after !== x && after) lines.push(after);
      // "… or x − 3 = 0", "… and y = 2": try each piece
      after.split(/\s+(?:or|and|gives|so)\s+|,\s*/).forEach(function (bit) { bit = bit.trim(); if (bit && bit !== after) lines.push(bit); });
    });
    lines = lines.slice(0, 120);
    var best = null;
    q.cp.forEach(function (cp) {
      if (best && (best.band === 'hi' || cp.band === 'lo')) return;
      var got = false;
      lines.forEach(function (l) { if (got === true) return; var t; try { t = test(cp, l); } catch (e) { t = false; } if (t === true || (t && !got)) got = t; });
      if (got === true) best = { band: cp.band, why: cp.why };
      else if (got === 'lo' && !best) best = { band: 'lo', why: 'One of your brackets is right' };
    });
    return best;
  };

  /* ── Typed-answer box with keypad and preview ─────────────────── */
  // A plain-text preview of what was typed ("3x^2" shows as 3x²), so mistakes are easy to spot.
  MX.preview = function (input) {
    var s = clean(input).replace(/\s*sqrt\s*/g, '√');
    s = s.replace(/\+\-|\+−/g, '±');
    return MX.m(s.replace(/√\(/g, 'sqrt(').replace(/√(\d+|[a-z])/g, 'sqrt($1)'));
  };
  var KEYS = [['x', 'x'], ['y', 'y'], ['²', '^2'], ['xⁿ', '^'], ['√', '√'], ['(', '('], [')', ')'], ['/', '/'], ['±', '±'], ['=', '=']];
  MX.inputHtml = function (id, label, value, opts) {
    opts = opts || {};
    return '<div class="mxin" data-mxin>' +
      '<input class="input mxin-box" id="' + id + '" type="text" inputmode="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="' + escH(label || 'Answer') + '"' +
        (opts.placeholder ? ' placeholder="' + escH(opts.placeholder) + '"' : '') + ' value="' + escH(value || '') + '" aria-describedby="' + id + '-pv">' +
      '<div class="mxin-keys" role="toolbar" aria-label="Maths keys (arrow keys move between them)">' + KEYS.map(function (k, i) {
        return '<button type="button" class="mxk" data-ins="' + escH(k[1]) + '" tabindex="' + (i ? -1 : 0) + '" aria-label="Insert ' + escH(k[0]) + '">' + k[0] + '</button>';
      }).join('') + '</div>' +
      '<div class="mxin-pv" id="' + id + '-pv">' + (value ? 'Reads as ' + MX.preview(value) : '') + '</div></div>';
  };
  // One delegated handler per page for every maths box.
  document.addEventListener('mousedown', function (e) { if (e.target.closest && e.target.closest('.mxk')) e.preventDefault(); });
  document.addEventListener('click', function (e) {
    var k = e.target.closest && e.target.closest('.mxk'); if (!k) return;
    var box = k.closest('[data-mxin]').querySelector('input'), ins = k.dataset.ins;
    var a = box.selectionStart == null ? box.value.length : box.selectionStart, b = box.selectionEnd == null ? a : box.selectionEnd;
    box.value = box.value.slice(0, a) + ins + box.value.slice(b);
    if (e.detail) { box.focus(); box.setSelectionRange(a + ins.length, a + ins.length); } // mouse/touch: back to the box; keyboard: stay on the key
    box.dispatchEvent(new Event('input', { bubbles: true }));
  });
  document.addEventListener('keydown', function (e) { // roving focus in the keypad toolbar
    var k = e.target.closest && e.target.closest('.mxk'); if (!k || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    var keys = Array.prototype.slice.call(k.parentNode.querySelectorAll('.mxk')), i = keys.indexOf(k);
    var n = keys[(i + (e.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length];
    k.tabIndex = -1; n.tabIndex = 0; n.focus(); e.preventDefault();
  });
  document.addEventListener('input', function (e) {
    var w = e.target.closest && e.target.closest('[data-mxin]'); if (!w || e.target.tagName !== 'INPUT') return;
    var pv = w.querySelector('.mxin-pv'), v = e.target.value.trim();
    pv.innerHTML = v ? 'Reads as ' + MX.preview(v) : '';
  });

  /* ── Long division working (used in worked solutions) ──────────── */
  function polyToTerms(coefs) { // [a3,a2,a1,a0] highest first
    var n = coefs.length - 1;
    return ps(coefs.map(function (c, i) { var p = n - i; return [c, p === 0 ? '' : p === 1 ? 'x' : 'x^' + p]; }));
  }
  function divSteps(num, den) { // den = [d1, d0]; exact division
    var rem = num.slice(), q = [], steps = [];
    for (var i = 0; i < num.length - 1; i++) {
      var lead = rem[i], qc = lead / den[0], p = num.length - 2 - i;
      q.push(qc);
      var qt = ps([[qc, p === 0 ? '' : p === 1 ? 'x' : 'x^' + p]]);
      steps.push({ h: 'Divide:', t: MX.m(ps([[lead, (num.length - 1 - i) === 1 ? 'x' : 'x^' + (num.length - 1 - i)]])) + ' ÷ ' + MX.m(ps([[den[0], 'x']])) + ' = ' + MX.m(qt) + '. Multiply ' + MX.m(qt) + ' by ' + MX.m(br(lin(den[0], den[1]))) + ' and subtract.' });
      rem[i] -= qc * den[0]; rem[i + 1] -= qc * den[1];
    }
    return { q: q, steps: steps };
  }

  /* ── Skills (IXL-style generators) ─────────────────────────────── */
  // Each gen(r) returns { q: HTML, spec, steps:[HTML or {h,t}], hint, show: HTML answer }
  function S(id, label, desc, gen) { return { id: id, label: label, desc: desc, gen: gen }; }
  function vpick(r) { return pick(r, ['x', 'x', 'x', 'y', 'a', 'p', 'k']); }
  MX.skills = {};
  [
    S('expand', 'Expand two brackets', 'Multiply out (ax + b)(cx + d)', function (r) {
      var a = nz(r, 1, 4), b = nz(r, -9, 9), c = nz(r, 1, 3), d = nz(r, -9, 9), v = vpick(r);
      var e = ps([[a * c, v + '^2'], [a * d + b * c, v], [b * d, '']]);
      return { q: 'Expand and simplify ' + MX.m(br(lin(a, b, v)) + br(lin(c, d, v))) + '.', spec: { kind: 'expr', expr: e, form: 'expanded' }, show: MX.m(e),
        cp: [{ band: 'hi', kind: 'equiv', e: e, why: 'Your working reaches the right expansion' }, { band: 'lo', kind: 'term', c: a * c, m: v + '2', why: 'You multiplied the first terms correctly' }],
        hint: 'Multiply each term in the first bracket by each term in the second.',
        steps: [{ h: 'Multiply the first term of each bracket:', t: MX.m(ps([[a, v]]) + '*' + ps([[c, v]])) + ' = ' + MX.m(ps([[a * c, v + '^2']])) },
          { h: 'First term of bracket 1 × second term of bracket 2:', t: MX.m(ps([[a, v]]) + '*' + paren(d)) + ' = ' + MX.m(ps([[a * d, v]])) },
          { h: 'Second term of bracket 1 × first term of bracket 2:', t: MX.m(num(b) + '*' + ps([[c, v]])) + ' = ' + MX.m(ps([[b * c, v]])) },
          { h: 'Multiply the second term of each bracket:', t: MX.m(num(b) + ' * ' + paren(d)) + ' = ' + MX.m(num(b * d)) },
          { h: 'Add the two ' + v + ' terms together and write the answer:', t: MX.m(ps([[a * d, v]]) + ' + ' + (b * c < 0 ? '(' + ps([[b * c, v]]) + ')' : ps([[b * c, v]]))) + ' = ' + MX.m(ps([[a * d + b * c, v]])) + ', so the answer is ' + MX.m(e) }] };
    }),
    S('hcf', 'Highest common factor of terms', 'Find the HCF, e.g. of 18a³ and 24a²', function (r) {
      var g = pick(r, [2, 3, 4, 5, 6, 7, 8]), m = pick(r, [[1, 2], [2, 3], [3, 4], [2, 5], [3, 5], [1, 3], [4, 5], [5, 6]]);
      if (r() < 0.5) m = [m[1], m[0]];
      var v = pick(r, ['x', 'y', 'a', 'b', 'm']), w = pick(r, ['y', 'n', 'b', 'q']), e1 = ri(r, 1, 3), e2 = ri(r, 1, 3), two = r() < 0.45 && v !== w;
      var f1 = two ? ri(r, 1, 2) : 0, f2 = two ? ri(r, 1, 2) : 0;
      function mono(c, a, b) { return ps([[c, (a ? v + (a > 1 ? '^' + a : '') : '') + (b ? w + (b > 1 ? '^' + b : '') : '') || '']]); }
      var t1 = mono(g * m[0], e1, f1), t2 = mono(g * m[1], e2, f2), ans = mono(g, Math.min(e1, e2), Math.min(f1, f2));
      return { q: 'Find the highest common factor (HCF) of ' + MX.m(t1) + ' and ' + MX.m(t2) + '.', spec: { kind: 'expr', expr: ans }, show: MX.m(ans),
        cp: [{ band: 'lo', kind: 'num', n: g, why: 'You found the HCF of the numbers' }],
        hint: 'Find the HCF of the numbers, then take the lowest power of each letter that is in both terms.',
        steps: [{ h: 'Numbers:', t: 'the HCF of ' + g * m[0] + ' and ' + g * m[1] + ' is ' + g + '.' },
          { h: 'Letters:', t: 'the lowest power of ' + MX.m(v) + ' in both is ' + MX.m(v + (Math.min(e1, e2) > 1 ? '^' + Math.min(e1, e2) : '')) + (two ? ', and of ' + MX.m(w) + ' it is ' + MX.m(w + (Math.min(f1, f2) > 1 ? '^' + Math.min(f1, f2) : '')) : '') + '.' },
          { h: 'HCF =', t: MX.m(ans) }] };
    }),
    S('factHcf', 'Factorise: take out the HCF', 'Type 1, e.g. 15pq + 3q²', function (r) {
      var v = pick(r, ['x', 'p', 'a']), w = pick(r, ['y', 'q', 'b']), inner, gc = pick(r, [2, 3, 4, 5, 6]), gv = pick(r, ['', v, w]);
      do {
        inner = [[ri(r, 1, 9), v + (r() < 0.4 ? '^2' : '')], [nz(r, -9, 9), pick(r, [w, v + w, ''])]];
        if (r() < 0.3) inner.push([nz(r, -6, 6), pick(r, ['', w])]);
      } while (reducible(MX.poly(ps(inner))) || Object.keys(MX.poly(ps(inner))).length !== inner.length);
      var hcf = ps([[gc, gv]]), e = expandTerms(hcf + '*(' + ps(inner) + ')');
      var ans = hcf + br(ps(inner));
      return { q: 'Factorise ' + MX.m(e) + '.', spec: { kind: 'expr', expr: e, form: 'factorised' }, show: MX.m(ans),
        cp: [{ band: 'hi', kind: 'product', e: e, why: 'You took out a common factor correctly (but not the highest one)' }, { band: 'lo', kind: 'num', n: gc, why: 'You found the number part of the HCF' }],
        hint: 'Find the HCF of every term and put it outside the bracket.',
        steps: [{ h: 'Step 1:', t: 'the HCF of the terms is ' + MX.m(hcf) + '. Put it outside the bracket.' },
          { h: 'Step 2:', t: 'divide each term by ' + MX.m(hcf) + ' to get what goes in the bracket: ' + MX.m(ps(inner)) + '.' },
          { h: 'Answer:', t: MX.m(ans) }] };
    }),
    S('group', 'Factorise by grouping', 'Type 2: four terms, two pairs', function (r) {
      var sets = [['p', 'q', 'r', 's'], ['a', 'b', 'x', 'y'], ['a', 'b', 'c', 'd'], ['x', 'y', 'm', 'n']], L = pick(r, sets), A, B, C, D, ex, tries = 0;
      do {
        var a1 = ri(r, 1, 5), b1 = nz(r, -5, 5), c1 = ri(r, 1, 4), d1 = nz(r, -5, 5);
        if (gcd(a1, b1) !== 1 || gcd(c1, d1) !== 1) continue;
        A = ps([[a1, L[0]]]); B = ps([[b1, L[1]]]); C = ps([[c1, L[2]]]); D = ps([[d1, L[3]]]);
        var f1 = ps([[a1, L[0]], [b1, L[1]]]), f2 = ps([[c1, L[2]], [d1, L[3]]]);
        var t = [[a1 * c1, L[0] + L[2]], [a1 * d1, L[0] + L[3]], [b1 * c1, L[1] + L[2]], [b1 * d1, L[1] + L[3]]];
        var order = r() < 0.35 ? [0, 2, 1, 3] : [0, 1, 2, 3];
        ex = { e: ps(order.map(function (i) { return t[i]; })), f1: f1, f2: f2, t: t, re: order[1] === 2 };
      } while (!ex && ++tries < 50);
      var ans = br(ex.f1) + br(ex.f2);
      return { q: 'Factorise ' + MX.m(ex.e) + '.', spec: { kind: 'expr', expr: ex.e, form: 'factorised' }, show: MX.m(ans),
        cp: [{ band: 'hi', kind: 'factor', e: ex.e, f: [ex.f1, ex.f2], why: 'You found a correct common bracket' }, { band: 'lo', kind: 'has', e: ex.e, f: [ex.f1, ex.f2], why: 'You took out the HCF of a pair correctly' }],
        hint: 'Pair up terms that share a factor, take out the HCF of each pair, then take out the common bracket.',
        steps: [ex.re ? { h: 'Rearrange', t: 'so each pair shares a factor: ' + MX.m(ps(ex.t)) + '.' } : { h: 'Pair up:', t: MX.m(br(ps(ex.t.slice(0, 2))) + ' + ' + br(ps(ex.t.slice(2)))) + '.' },
          { h: 'HCF of each pair:', t: MX.m(A + br(ex.f2) + (B[0] === '-' ? ' - ' + B.slice(1) : ' + ' + B) + br(ex.f2)) + '. The brackets must match.' },
          { h: 'Take out the common bracket:', t: MX.m(ans) }] };
    }),
    S('quad1', 'Factorise x² + bx + c', 'Type 3 with one x²', function (r) {
      var p, q, v = vpick(r);
      do { p = nz(r, -9, 9); q = nz(r, -9, 9); } while (p + q === 0);
      return quadFactor(1, p, 1, q, v);
    }),
    S('quad2', 'Factorise ax² + bx + c', 'Type 3, e.g. 3x² + 10x + 8', function (r) {
      var a, b, c, d;
      do { a = ri(r, 1, 3); b = nz(r, -7, 7); c = ri(r, 2, 5); d = nz(r, -7, 7); } while (gcd(a, b) !== 1 || gcd(c, d) !== 1 || a * d + b * c === 0);
      return quadFactor(a, b, c, d, 'x');
    }),
    S('dots', 'Difference of two squares', 'Type 4: a² − b² = (a + b)(a − b)', function (r) {
      var p, q, q2 = ri(r, 1, 9), form = ri(r, 0, 2), v = pick(r, ['x', 'y', 'a']), w = v === 'y' ? 'x' : 'y', A, B;
      do { p = ri(r, 1, 9); q = ri(r, 1, 12); } while (gcd(p, q) !== 1 || (form === 2 && gcd(p, q2) !== 1));
      if (form === 0) { A = ps([[p, v]]); B = String(q); }
      else if (form === 1) { A = String(q); B = ps([[p, v]]); }
      else { A = ps([[p, v]]); B = ps([[q2, w]]); }
      var sq = function (s) { var c = /^(\d*)([a-z]?)$/.exec(s); var n = c[1] ? +c[1] : 1; return ps([[n * n, c[2] ? c[2] + '^2' : '']]); };
      var e = sq(A) + ' - ' + sq(B), ans = '(' + A + ' + ' + B + ')(' + A + ' - ' + B + ')';
      return { q: 'Factorise ' + MX.m(e) + '.', spec: { kind: 'expr', expr: e, form: 'factorised' }, show: MX.m(ans),
        cp: [{ band: 'hi', kind: 'factor', e: e, f: [A + ' + ' + B, A + ' - ' + B], why: 'You found a correct bracket' }, { band: 'lo', kind: 'step', e: e, why: 'You wrote each term as a square' }],
        hint: 'Write each term as something squared, then use a² − b² = (a + b)(a − b).',
        steps: [{ h: 'Step 1:', t: 'write each term as a perfect square: ' + MX.m('(' + A + ')^2 - (' + B + ')^2') + '.' },
          { h: 'Step 2:', t: 'use ' + MX.m('a^2 - b^2 = (a + b)(a - b)') + '.' }, { h: 'Answer:', t: MX.m(ans) }] };
    }),
    S('fully', 'Factorise fully', 'Take out the HCF, then factorise again', function (r) {
      var g = pick(r, [2, 3, 4, 5]), kind = r() < 0.5, inner, ans, e, how;
      if (kind) { var p, q; do { p = ri(r, 1, 5); q = ri(r, 1, 7); } while (gcd(p, q) !== 1); inner = ps([[p * p, 'x^2'], [-q * q, '']]); ans = g + '(' + lin(p, q) + ')(' + lin(p, -q) + ')'; how = 'a difference of two squares'; }
      else { var m, n; do { m = nz(r, -8, 8); n = nz(r, -8, 8); } while (m + n === 0); inner = ps([[1, 'x^2'], [m + n, 'x'], [m * n, '']]); ans = g + '(' + lin(1, m) + ')(' + lin(1, n) + ')'; how = 'a quadratic trinomial'; }
      e = expandTerms(g + '*(' + inner + ')');
      return { q: 'Factorise fully ' + MX.m(e) + '.', spec: { kind: 'expr', expr: e, form: 'factorised' }, show: MX.m(ans),
        cp: [{ band: 'hi', kind: 'factor', e: e, f: ans.slice(String(g).length).replace(/^\(|\)$/g, '').split(')('), why: 'You factorised the bracket correctly' },
          { band: 'lo', kind: 'has', e: e, f: [inner], why: 'You took out the HCF first' }],
        hint: 'Take out the HCF first. Then look at what is left in the bracket.',
        steps: [{ h: 'HCF first:', t: MX.m(g + br(inner)) + '.' }, { h: 'The bracket is', t: how + ', so factorise it again.' }, { h: 'Answer:', t: MX.m(ans) }] };
    }),
    S('solveFact', 'Solve quadratics by factorising', 'Three types: three terms, no constant, no x term', function (r) {
      var type = ri(r, 0, 3), steps, e, vals;
      if (type === 0) {
        var p, q; do { p = nz(r, -9, 9); q = nz(r, -9, 9); } while (p === q || p + q === 0);
        e = ps([[1, 'x^2'], [-(p + q), 'x'], [p * q, '']]) + ' = 0'; vals = [p, q];
        steps = [{ h: 'Factorise:', t: MX.m(br(lin(1, -p)) + br(lin(1, -q)) + ' = 0') }, { h: 'Let each factor = 0:', t: MX.m(lin(1, -p) + ' = 0') + ' or ' + MX.m(lin(1, -q) + ' = 0') }];
      } else if (type === 1) {
        var a = ri(r, 1, 4), b = nz(r, -12, 12); if (b % a) b = a * nz(r, -5, 5);
        e = ps([[a, 'x^2'], [b, 'x']]) + ' = 0'; vals = [0, -b / a];
        steps = [{ h: 'Take out the HCF:', t: MX.m(ps([[a, 'x']]) + br(lin(1, b / a)) + ' = 0') }, { h: 'Let each factor = 0:', t: MX.m(ps([[a, 'x']]) + ' = 0') + ' or ' + MX.m(lin(1, b / a) + ' = 0') }];
      } else if (type === 2) {
        var k = ri(r, 1, 10);
        e = r() < 0.5 ? 'x^2 = ' + k * k : 'x^2 - ' + k * k + ' = 0'; vals = [k, -k];
        steps = [{ h: 'Bring everything to the left:', t: MX.m('x^2 - ' + k * k + ' = 0') }, { h: 'Difference of two squares:', t: MX.m('(x + ' + k + ')(x - ' + k + ') = 0') }];
      } else {
        var a2 = ri(r, 2, 3), b2 = nz(r, -5, 5), n = nz(r, -4, 4); if (gcd(a2, b2) !== 1) b2 = 1;
        // (a2 x + b2)(x - n) = 0  ->  a2 x^2 + (b2 - a2 n) x - b2 n = 0, written with the constant on the right
        var B = b2 - a2 * n, C = -b2 * n;
        if (!B || !C) { B = b2 - a2 * 2; C = -b2 * 2; n = 2; }
        e = ps([[a2, 'x^2'], [B, 'x']]) + ' = ' + (-C); vals = [-b2 / a2, n];
        steps = [{ h: 'Bring everything to the left:', t: MX.m(ps([[a2, 'x^2'], [B, 'x'], [C, '']]) + ' = 0') }, { h: 'Factorise:', t: MX.m(br(lin(a2, b2)) + br(lin(1, -n)) + ' = 0') },
          { h: 'Let each factor = 0:', t: MX.m(lin(a2, b2) + ' = 0') + ' or ' + MX.m(lin(1, -n) + ' = 0') }];
      }
      var show = vals.map(function (v) { return MX.m('x = ' + (Math.round(v) === v ? num(v) : fracStr(Math.round(v * 6), 6))); }).join(' or ');
      steps.push({ h: 'Solve:', t: show });
      var sides = e.split('='), eq = sides[0] + ' - (' + sides[1] + ')';
      return { q: 'Solve ' + MX.m(e) + '.', spec: { kind: 'values', vals: vals }, show: show,
        cp: [{ band: 'hi', kind: 'value', vals: vals, why: 'You found one of the solutions' }, { band: 'hi', kind: 'eqfactor', e: eq, why: 'You factorised the equation correctly' },
          { band: 'lo', kind: 'eqn', e: eq, why: 'You rearranged the equation to = 0' }], hint: 'Get everything on the left equal to 0, factorise, then let each factor equal 0.', steps: steps, placeholder: 'e.g. x = 3, x = −5' };
    }),
    S('formula', 'The −b formula (decimals)', 'Solve to 1 or 2 decimal places', function (r) {
      var a, b, c, D;
      do { a = nz(r, -3, 6); b = nz(r, -9, 9); c = nz(r, -9, 9); D = b * b - 4 * a * c; } while (a < 1 || D <= 0 || isSquare(D));
      var dp = r() < 0.5 ? 1 : 2, x1 = (-b + Math.sqrt(D)) / (2 * a), x2 = (-b - Math.sqrt(D)) / (2 * a);
      var e = ps([[a, 'x^2'], [b, 'x'], [c, '']]) + ' = 0';
      var show = MX.m('x = ' + round(x1, dp).toFixed(dp)) + ' or ' + MX.m('x = ' + round(x2, dp).toFixed(dp));
      return { q: 'Solve ' + MX.m(e) + ', giving your answers correct to ' + dp + ' decimal place' + (dp > 1 ? 's' : '') + '.', spec: { kind: 'values', vals: [x1, x2], dp: dp }, show: show,
        cp: [{ band: 'hi', kind: 'value', vals: [x1, x2], dp: dp, why: 'You found one of the solutions' }, { band: 'hi', kind: 'num', n: D, why: 'You worked out b² − 4ac correctly' },
          { band: 'lo', kind: 'abc', a: a, b: b, c: c, why: 'You labelled a, b and c correctly' }],
        hint: 'Label a, b and c, then use x = (−b ± √(b² − 4ac)) / 2a. It’s on page 20 of the log tables.', placeholder: 'e.g. 2.90, −0.23',
        steps: [{ h: 'Label:', t: 'a = ' + a + ', b = ' + b + ', c = ' + c + '.' },
          { h: 'Fill into the formula:', t: MX.m('x = frac(-' + paren(b) + ' +- sqrt(' + paren(b) + '^2 - 4' + '(' + a + ')(' + c + ')), 2(' + a + '))') },
          { h: 'Simplify:', t: MX.m('x = frac(' + (-b) + ' +- sqrt(' + D + '), ' + 2 * a + ')') },
          { h: 'Work out both:', t: show }] };
    }),
    S('formulaSurd', 'The −b formula (surd form)', 'Answers like 3 ± 2√2', function (r) {
      var h, s, rr, c;
      do { h = nz(r, -5, 5); s = ri(r, 1, 3); rr = pick(r, [2, 3, 5, 6, 7]); c = h * h - s * s * rr; } while (!c);
      var b = -2 * h, e = ps([[1, 'x^2'], [b, 'x'], [c, '']]) + ' = 0', D = b * b - 4 * c;
      var show = MX.m('x = ' + h + ' +- ' + (s > 1 ? s : '') + 'sqrt(' + rr + ')');
      return { q: 'Solve ' + MX.m(e) + ', giving your answers in surd form.', spec: { kind: 'values', vals: [h + s * Math.sqrt(rr), h - s * Math.sqrt(rr)], surd: true }, show: show,
        cp: [{ band: 'hi', kind: 'num', n: D, why: 'You worked out b² − 4ac correctly' }, { band: 'lo', kind: 'abc', a: 1, b: b, c: c, why: 'You labelled a, b and c correctly' }],
        hint: 'Use the −b formula, then simplify the surd: find a square number that divides into the number under the √.', placeholder: 'e.g. 3 ± 2√2',
        steps: [{ h: 'Label:', t: 'a = 1, b = ' + b + ', c = ' + c + '.' },
          { h: 'Fill in:', t: MX.m('x = frac(' + (-b) + ' +- sqrt(' + D + '), 2)') },
          { h: 'Simplify the surd:', t: MX.m('sqrt(' + D + ') = sqrt(' + 4 * s * s + ' * ' + rr + ') = ' + 2 * s + 'sqrt(' + rr + ')') },
          { h: 'Divide each term by 2:', t: show }] };
    }),
    S('surd', 'Simplify surds', 'Write √32 as 4√2', function (r) {
      var k = ri(r, 2, 6), rr = pick(r, [2, 3, 5, 6, 7, 10, 11]), n = k * k * rr;
      return { q: 'Express ' + MX.m('sqrt(' + n + ')') + ' in the form ' + MX.m('a sqrt(b)') + ', where b is a prime number or has no square factor.', spec: { kind: 'expr', expr: String(k * Math.sqrt(rr)), form: 'surd' }, show: MX.m(k + 'sqrt(' + rr + ')'),
        cp: [{ band: 'hi', kind: 'num', n: k * k, why: 'You found the square factor' }],
        hint: 'Find the biggest square number that divides into ' + n + '.', placeholder: 'e.g. 4√2',
        steps: [{ h: 'Biggest square factor:', t: n + ' = ' + k * k + ' × ' + rr + '.' }, { h: 'Split the root:', t: MX.m('sqrt(' + k * k + ') * sqrt(' + rr + ')') }, { h: 'Answer:', t: MX.m(k + 'sqrt(' + rr + ')') }] };
    }),
    S('fromRoots', 'Form a quadratic from its roots', 'Given the roots, find ax² + bx + c = 0', function (r) {
      var frac = r() < 0.4, p, q, f1, f2;
      if (!frac) { do { p = nz(r, -7, 7); q = nz(r, -7, 7); } while (p === q); f1 = [1, -p]; f2 = [1, -q]; }
      else { var a = ri(r, 2, 5), b = nz(r, -4, 4), c = ri(r, 1, 5), d = nz(r, -4, 4); if (gcd(a, b) !== 1) b = 1; if (gcd(c, d) !== 1) d = 1; p = [b, a]; q = [d, c]; f1 = [a, -b]; f2 = [c, -d]; }
      var e = ps([[f1[0] * f2[0], 'x^2'], [f1[0] * f2[1] + f1[1] * f2[0], 'x'], [f1[1] * f2[1], '']]);
      var rs = frac ? [fracStr(p[0], p[1]), fracStr(q[0], q[1])] : [String(p), String(q)];
      return { q: 'Find a quadratic equation with roots ' + MX.m(rs[0]) + ' and ' + MX.m(rs[1]) + '. Write it in the form ' + MX.m('ax^2 + bx + c = 0') + ', where a, b and c are whole numbers.',
        spec: { kind: 'equation', expr: e }, show: MX.m(e + ' = 0'), hint: 'Work backwards: x = root becomes a factor equal to 0. Multiply the two factors.',
        cp: [{ band: 'hi', kind: 'eqfactor', e: e, both: true, why: 'You turned both roots into factors' }, { band: 'lo', kind: 'eqfactor', e: e, why: 'You turned a root into a factor' }],
        placeholder: 'e.g. x² − x − 6 = 0',
        steps: [{ h: 'Make each root a factor:', t: MX.m('x = ' + rs[0]) + ' gives ' + MX.m(lin(f1[0], f1[1]) + ' = 0') + '; ' + MX.m('x = ' + rs[1]) + ' gives ' + MX.m(lin(f2[0], f2[1]) + ' = 0') + '.' },
          { h: 'Multiply:', t: MX.m(br(lin(f1[0], f1[1])) + br(lin(f2[0], f2[1])) + ' = 0') }, { h: 'Expand:', t: MX.m(e + ' = 0') }] };
    }),
    S('simul', 'Simultaneous equations', 'Solve two equations with two unknowns', function (r) {
      var x, y, a1, b1, a2, b2;
      do { x = nz(r, -6, 8); y = nz(r, -6, 8); a1 = nz(r, -5, 6); b1 = nz(r, -5, 6); a2 = nz(r, -5, 6); b2 = nz(r, -5, 6); } while (a1 * b2 - a2 * b1 === 0 || Math.abs(a1) === Math.abs(a2));
      var c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
      var e1 = ps([[a1, 'x'], [b1, 'y']]) + ' = ' + c1, e2 = ps([[a2, 'x'], [b2, 'y']]) + ' = ' + c2;
      var L = lcm(a1, a2), m1 = L / a1, m2 = L / a2, ny = m1 * b1 - m2 * b2, nc = m1 * c1 - m2 * c2;
      return { q: 'Solve the simultaneous equations ' + MX.m(e1) + ' and ' + MX.m(e2) + '.', spec: { kind: 'pair', vals: { x: x, y: y } }, show: MX.m('x = ' + x + ', y = ' + y),
        cp: [{ band: 'hi', kind: 'named', vals: { x: x, y: y }, why: 'You found one of the values' }, { band: 'lo', kind: 'sat', vals: { x: x, y: y }, not: [e1, e2], why: 'You combined the equations correctly' }],
        hint: 'Multiply one or both equations so the x terms are the same, then subtract to cancel x.', placeholder: 'x = …, y = …',
        steps: [{ h: 'Line up and multiply:', t: MX.m(e1) + ' (× ' + MX.m(num(m1)) + ') and ' + MX.m(e2) + ' (× ' + MX.m(num(m2)) + ') so both x terms are ' + MX.m(L + 'x') + '.' },
          { h: 'Subtract to cancel x:', t: MX.m(ps([[ny, 'y']]) + ' = ' + nc) + ', so ' + MX.m('y = ' + y) + '.' },
          { h: 'Substitute back:', t: MX.m(ps([[a1, 'x']]) + ' ' + sgn(b1 * y) + ' = ' + c1) + ', so ' + MX.m('x = ' + x) + '.' },
          { h: 'Check', t: 'in the second equation: ' + MX.m(a2 + '(' + x + ') + ' + paren(b2) + '(' + y + ') = ' + c2) + ' ✓' }] };
    }),
    S('simulWord', 'Simultaneous equations in context', 'Write two equations from a problem, then solve', function (r) {
      var t = ri(r, 0, 3), x, y, txt, e1, e2, names;
      if (t === 0) {
        var d = ri(r, 12, 20), n = ri(r, 5, 9); x = ri(r, 4, 14) * 50; y = ri(r, 2, 10) * 50;
        var cost = (d * x + n * y) / 100;
        txt = 'Electricity is charged at a day rate of ' + d + ' cent per unit and a night rate of ' + n + ' cent per unit. A household uses ' + (x + y) + ' units in total, costing €' + cost.toFixed(2) + '. Let x be the day units and y the night units. Find x and y.';
        e1 = 'x + y = ' + (x + y); e2 = d + 'x + ' + n + 'y = ' + (d * x + n * y) + ' (in cent)';
      } else if (t === 1) {
        var A = ri(r, 8, 15), C = ri(r, 4, A - 2); x = ri(r, 2, 12); y = ri(r, 2, 15);
        txt = 'Cinema tickets cost €' + A + ' for an adult and €' + C + ' for a child. A group buys ' + (x + y) + ' tickets for €' + (A * x + C * y) + '. Let x be the number of adult tickets and y the number of child tickets. Find x and y.';
        e1 = 'x + y = ' + (x + y); e2 = A + 'x + ' + C + 'y = ' + (A * x + C * y);
      } else if (t === 2) {
        x = ri(r, 3, 20); y = ri(r, 3, 15);
        txt = 'A farm has hens and sheep. Altogether there are ' + (x + y) + ' heads and ' + (2 * x + 4 * y) + ' legs. Let x be the number of hens and y the number of sheep. Find x and y.';
        e1 = 'x + y = ' + (x + y); e2 = '2x + 4y = ' + (2 * x + 4 * y);
      } else {
        x = ri(r, 10, 40); y = ri(r, 1, x - 1);
        txt = 'Two numbers, x and y, add to ' + (x + y) + '. The difference between them (x − y) is ' + (x - y) + '. Find x and y.';
        e1 = 'x + y = ' + (x + y); e2 = 'x - y = ' + (x - y);
      }
      return { q: txt, spec: { kind: 'pair', vals: { x: x, y: y } }, show: MX.m('x = ' + x + ', y = ' + y), placeholder: 'x = …, y = …',
        cp: [{ band: 'hi', kind: 'named', vals: { x: x, y: y }, why: 'You found one of the values' }, { band: 'lo', kind: 'sat', vals: { x: x, y: y }, why: 'You wrote a correct equation' }],
        hint: 'Write one equation for the totals of the two quantities and one for the cost (or legs, or difference).',
        steps: [{ h: 'Equation 1:', t: MX.m(e1) }, { h: 'Equation 2:', t: MX.m(e2) }, { h: 'Solve together', t: 'by elimination: ' + MX.m('x = ' + x) + ', ' + MX.m('y = ' + y) + '.' }] };
    }),
    S('longDiv', 'Long division in algebra', 'Divide a cubic by (x − a) or (2x − 1)', function (r) {
      var den = r() < 0.7 ? [1, nz(r, -5, 5)] : [2, pick(r, [-1, 1, -3, 3])], q = [ri(r, 1, 3), nz(r, -6, 6), nz(r, -9, 9)];
      if (den[0] === 2) q[0] = pick(r, [1, 2]);
      var num = [q[0] * den[0], q[1] * den[0] + q[0] * den[1], q[2] * den[0] + q[1] * den[1], q[2] * den[1]];
      var e = polyToTerms(num), d = lin(den[0], den[1]), qs = polyToTerms(q), ds = divSteps(num, den);
      return { q: 'Divide ' + MX.m(e) + ' by ' + MX.m(d) + '.', spec: { kind: 'expr', expr: qs }, show: MX.m(qs),
        cp: [{ band: 'hi', kind: 'term2', t: [[q[0], 'x2'], [q[1], 'x1']], why: 'You got the first two terms of the answer' }, { band: 'lo', kind: 'term', c: q[0], m: 'x2', why: 'You got the first term of the answer' }],
        hint: 'Divide the first term by x (or 2x), multiply back, subtract, bring down the next term. Repeat.',
        steps: ds.steps.concat([{ h: 'Answer:', t: MX.m(qs) + ' (remainder 0)' }]) };
    }),
    S('fracEq', 'Linear equations with fractions', 'Multiply everything by the LCM, then solve', function (r) {
      var p, q, a, b, x, s, Ln, top;
      do { p = pick(r, [2, 3, 4, 5, 6]); q = pick(r, [2, 3, 4, 5, 6, 10]); } while (p === q);
      a = ri(r, -6, 6); b = ri(r, -6, 6); x = nz(r, -10, 10); s = r() < 0.6 ? 1 : -1;
      Ln = lcm(p, q); top = (Ln / p) * (x + a) + s * (Ln / q) * (x + b);
      if ((Ln / p) + s * (Ln / q) === 0) { s = 1; top = (Ln / p) * (x + a) + (Ln / q) * (x + b); }
      var rhs = fracStr(top, Ln), t1 = 'frac(' + lin(1, a) + ', ' + p + ')', t2 = 'frac(' + lin(1, b) + ', ' + q + ')';
      var e = t1 + (s > 0 ? ' + ' : ' - ') + t2 + ' = ' + rhs, k = (Ln / p) + s * (Ln / q);
      return { q: 'Solve for x: ' + MX.m(e) + '.', spec: { kind: 'values', vals: [x] }, show: MX.m('x = ' + x), placeholder: 'x = …',
        cp: [{ band: 'hi', kind: 'cleared', x: x, why: 'You cleared the fractions correctly' }, { band: 'lo', kind: 'num', n: Ln, why: 'You found the LCM' }],
        hint: 'Find the LCM of the denominators and multiply every term by it.',
        steps: [{ h: 'LCM:', t: 'the LCM of ' + p + ', ' + q + (/frac/.test(rhs) ? ' and ' + Ln : '') + ' is ' + Ln + '. Multiply every term by ' + Ln + '.' },
          { h: 'Clear fractions:', t: MX.m((Ln / p) + br(lin(1, a)) + (s > 0 ? ' + ' : ' - ') + (Ln / q) + br(lin(1, b)) + ' = ' + top) },
          { h: 'Expand and collect:', t: MX.m(ps([[k, 'x'], [(Ln / p) * a + s * (Ln / q) * b, '']]) + ' = ' + top) },
          { h: 'Solve:', t: MX.m('x = ' + x) }] };
    }),
    S('negatives', 'Negative numbers', 'Add, take away, multiply and divide with minus numbers', function (r) {
      var t = ri(r, 0, 3), a, b, e, v, steps;
      if (t === 0) { a = nz(r, -12, 9); b = nz(r, -9, 12); if (a > 0 && b > 0) a = -a; e = num(a) + ' + ' + paren(b); v = a + b;
        steps = [{ h: 'Think of a number line.', t: 'Start at ' + num(a) + '. Adding ' + (b > 0 ? 'a positive number moves right (up) ' + b : 'a negative number moves left (down) ' + Math.abs(b)) + '.' }, { h: 'Answer:', t: MX.m(num(v)) }]; }
      else if (t === 1) { a = nz(r, -9, 12); b = nz(r, -9, 9); e = num(a) + ' - ' + paren(b); v = a - b;
        steps = b < 0 ? [{ h: 'Two minus signs together make a plus:', t: MX.m(num(a) + ' - (' + b + ') = ' + num(a) + ' + ' + Math.abs(b)) }, { h: 'Answer:', t: MX.m(num(v)) }]
          : [{ h: 'Taking away moves left (down) on the number line.', t: 'Start at ' + num(a) + ' and go down ' + b + '.' }, { h: 'Answer:', t: MX.m(num(v)) }]; }
      else if (t === 2) { a = nz(r, -9, 9); b = nz(r, -9, 9); e = paren(a) + ' * ' + paren(b); v = a * b;
        steps = [{ h: 'Signs first:', t: (a < 0) === (b < 0) ? 'same signs give a plus.' : 'different signs give a minus.' }, { h: 'Then the numbers:', t: Math.abs(a) + ' × ' + Math.abs(b) + ' = ' + Math.abs(v) + '.' }, { h: 'Answer:', t: MX.m(num(v)) }]; }
      else { b = nz(r, -9, 9); v = nz(r, -9, 9); a = b * v; e = paren(a) + ' / ' + paren(b);
        steps = [{ h: 'Signs first:', t: (a < 0) === (b < 0) ? 'same signs give a plus.' : 'different signs give a minus.' }, { h: 'Then the numbers:', t: Math.abs(a) + ' ÷ ' + Math.abs(b) + ' = ' + Math.abs(v) + '.' }, { h: 'Answer:', t: MX.m(num(v)) }]; }
      return { q: 'Work out ' + MX.m(e.replace(' / ', ' ÷ ')) + '.', spec: { kind: 'values', vals: [v] }, show: MX.m(num(v)), placeholder: 'e.g. −4',
        hint: 'Same signs give a plus; different signs give a minus. For adding and taking away, picture a number line.', steps: steps, cp: [] };
    }),
    S('likeTerms', 'Collect like terms', 'Simplify, e.g. 3x + 5 − x + 2', function (r) {
      var v = pick(r, ['x', 'a', 'y']), w = v === 'y' ? 'x' : 'y', two = r() < 0.4, a, c, b, d;
      do { a = nz(r, -6, 9); c = nz(r, -6, 7); b = nz(r, -9, 9); d = nz(r, -9, 9); } while (a + c === 0 || b + d === 0);
      var terms = two ? [[a, v], [b, w], [c, v], [d, w]] : [[a, v], [b, ''], [c, v], [d, '']];
      var e = ps(terms), ans = ps([[a + c, v], [b + d, two ? w : '']]);
      return { q: 'Simplify ' + MX.m(e) + '.', spec: { kind: 'expr', expr: ans, form: 'simplified' }, show: MX.m(ans), placeholder: 'e.g. 2x + 7',
        hint: 'Like terms have exactly the same letter. Add up the ' + v + ' terms, then the ' + (two ? w + ' terms' : 'numbers') + '.',
        steps: [{ h: 'The ' + v + ' terms:', t: MX.m(ps([[a, v], [c, v]])) + ' = ' + MX.m(ps([[a + c, v]])) },
          { h: 'The ' + (two ? w + ' terms' : 'numbers') + ':', t: MX.m(ps([[b, two ? w : ''], [d, two ? w : '']])) + ' = ' + MX.m(ps([[b + d, two ? w : '']])) },
          { h: 'Answer:', t: MX.m(ans) }], cp: [{ band: 'lo', kind: 'term', c: a + c, m: v + '1', why: 'You collected the ' + v + ' terms correctly' }] };
    }),
    S('expand1', 'Expand one bracket', 'Multiply out, e.g. 3(2x − 5)', function (r) {
      var a = nz(r, -6, 9), b = nz(r, 1, 6), c = nz(r, -9, 9), v = pick(r, ['x', 'x', 'a', 'y']);
      if (a === 1) a = 2;
      var ans = ps([[a * b, v], [a * c, '']]);
      return { q: 'Expand ' + MX.m((a === -1 ? '-' : num(a)) + br(lin(b, c, v))) + '.', spec: { kind: 'expr', expr: ans, form: 'expanded' }, show: MX.m(ans), placeholder: 'e.g. 6x − 15',
        hint: 'Multiply the number outside by each term inside the bracket. Watch the signs.',
        steps: [{ h: 'First term:', t: MX.m(paren(a) + ' * ' + ps([[b, v]]) + ' = ' + ps([[a * b, v]])) },
          { h: 'Second term:', t: MX.m(paren(a) + ' * ' + paren(c) + ' = ' + num(a * c)) }, { h: 'Answer:', t: MX.m(ans) }],
        cp: [{ band: 'lo', kind: 'term', c: a * b, m: v + '1', why: 'You multiplied the first term correctly' }] };
    }),
    S('subst', 'Substitution', 'Find the value of an expression when x is a number', function (r) {
      var x = nz(r, -4, 5), a = nz(r, -3, 4), b = nz(r, -6, 6), c = ri(r, -9, 9), sq = r() < 0.55;
      var e = sq ? ps([[a, 'x^2'], [b, 'x'], [c, '']]) : ps([[a, 'x'], [c || 3, '']]);
      if (!sq && !c) c = 3;
      var v = sq ? a * x * x + b * x + c : a * x + c;
      var sub = sq ? (a === 1 ? '' : a === -1 ? '-' : a) + '(' + x + ')^2 ' + (b < 0 ? '- ' + (Math.abs(b) === 1 ? '' : Math.abs(b)) : '+ ' + (b === 1 ? '' : b)) + '(' + x + ')' + (c ? ' ' + sgn(c) : '')
        : (a === 1 ? '' : a === -1 ? '-' : a) + '(' + x + ') ' + sgn(c);
      return { q: 'Find the value of ' + MX.m(e) + ' when ' + MX.m('x = ' + x) + '.', spec: { kind: 'values', vals: [v] }, show: MX.m(num(v)), placeholder: 'e.g. 14',
        hint: 'Replace every x with (' + x + ') in brackets. Do the powers first, then multiply, then add and take away.',
        steps: [{ h: 'Put the number in, in brackets:', t: MX.m(sub) }].concat(sq ? [{ h: 'Powers first:', t: MX.m('(' + x + ')^2 = ' + x * x) }] : [])
          .concat([{ h: 'Multiply, then add:', t: (sq ? MX.m(paren(a * x * x)) + ' ' + MX.m(sgn(b * x)) : MX.m(num(a * x))) + (c ? ' ' + MX.m(sgn(c)) : '') + ' = ' + MX.m(num(v)) }]),
        cp: [{ band: 'lo', kind: 'num', n: Math.abs(x * x), why: 'You squared x correctly' }] };
    }),
    S('linear', 'Solve simple equations', 'Find x, e.g. 3x + 4 = 19', function (r) {
      var x = nz(r, -8, 10), a = nz(r, 2, 7), b = nz(r, -12, 12), two = r() < 0.4, c = two ? nz(r, -4, 5) : 0;
      if (two && c === a) c = a - 1 || 1;
      var rhsK = two ? ri(r, -9, 9) : 0, lhs = ps([[a, 'x'], [b, '']]), rhs = two ? ps([[c, 'x'], [rhsK, '']]) : String(a * x + b);
      if (two) { rhsK = a * x + b - c * x; rhs = ps([[c, 'x'], [rhsK, '']]); }
      var k = a - c, m = (two ? rhsK : a * x + b) - b;
      var steps = two ? [{ h: 'x terms to the left, numbers to the right', t: '(change side, change sign): ' + MX.m(ps([[a, 'x'], [-c, 'x']]) + ' = ' + num(rhsK) + ' ' + sgn(-b)) }]
        : [{ h: 'Move the number across', t: '(change side, change sign): ' + MX.m(ps([[a, 'x']]) + ' = ' + num(a * x + b) + ' ' + sgn(-b)) }];
      steps.push({ h: 'Simplify:', t: MX.m(ps([[k, 'x']]) + ' = ' + m) }, { h: 'Divide both sides by ' + k + ':', t: MX.m('x = ' + x) });
      return { q: 'Solve ' + MX.m(lhs + ' = ' + rhs) + '.', spec: { kind: 'values', vals: [x] }, show: MX.m('x = ' + x), placeholder: 'x = …',
        hint: 'Get the x terms on one side and the numbers on the other. When something changes side, its sign changes. Then divide.', steps: steps,
        cp: [{ band: 'hi', kind: 'isolated', x: x, why: 'You got the x terms and the numbers on separate sides correctly' }] };
    }),
    S('factorPair', 'Two numbers that multiply and add', 'The key step in factorising: e.g. multiply to 24, add to 10', function (r) {
      var p, q; do { p = nz(r, -9, 9); q = nz(r, -9, 9); } while (p + q === 0 || Math.abs(p * q) < 2);
      var P = p * q, Sm = p + q, pairs = [];
      for (var i = 1; i * i <= Math.abs(P); i++) if (Math.abs(P) % i === 0) pairs.push(i + ' × ' + Math.abs(P) / i);
      return { q: 'Find two numbers that <b>multiply</b> to ' + MX.m(num(P)) + ' and <b>add</b> to ' + MX.m(num(Sm)) + '.', spec: { kind: 'values', vals: [p, q] }, show: MX.m(num(p) + ', ' + num(q)), placeholder: 'e.g. 6, 4',
        hint: 'List the pairs of numbers that multiply to ' + Math.abs(P) + '. Then think about the signs.',
        steps: [{ h: 'Pairs that multiply to ' + Math.abs(P) + ':', t: pairs.join(', ') + '.' },
          { h: 'Signs:', t: P > 0 ? 'the product is positive, so both numbers have the same sign: ' + (Sm > 0 ? 'both positive' : 'both negative') + ' (because they add to ' + num(Sm) + ').' : 'the product is negative, so one is positive and one is negative. The bigger one takes the sign of ' + num(Sm) + '.' },
          { h: 'Check:', t: MX.m(paren(p) + ' * ' + paren(q) + ' = ' + num(P)) + ' and ' + MX.m(num(p) + ' + ' + paren(q) + ' = ' + num(Sm)) + '.' },
          { h: 'Answer:', t: MX.m(num(p) + ', ' + num(q)) }], cp: [] };
    })
  ].forEach(function (s) {
    var g = s.gen;
    s.gen = function (r) { // typographic minus in the worked steps
      var o = g(r), fix = function (x) { return typeof x === 'string' ? x.replace(/(^|[\s(:])-(?=\d)/g, '$1−') : x; };
      o.steps = o.steps.map(function (st) { return typeof st === 'string' ? fix(st) : { h: fix(st.h), t: fix(st.t) }; });
      o.q = fix(o.q);
      return o;
    };
    MX.skills[s.id] = s;
  });

  function expandTerms(src) { // polynomial source back to "3x^2 - 5x + 2" order (by degree, then letters)
    var p = MX.poly(src), ks = Object.keys(p);
    ks.sort(function (a, b) {
      var da = 0, db = 0, ma = unkey(a), mb = unkey(b), v;
      for (v in ma) da += ma[v]; for (v in mb) db += mb[v];
      return db - da || (a < b ? -1 : 1);
    });
    return ps(ks.map(function (k) {
      var m = unkey(k), s = Object.keys(m).sort().map(function (v) { return v + (m[v] > 1 ? '^' + m[v] : ''); }).join('');
      return [Math.round(p[k] * 1e6) / 1e6, s];
    }));
  }
  MX.expand = expandTerms;
  function quadFactor(a, b, c, d, v) { // (a v + b)(c v + d)
    var A = a * c, B = a * d + b * c, C = b * d, e = ps([[A, v + '^2'], [B, v], [C, '']]);
    var ans = br(lin(a, b, v)) + br(lin(c, d, v)), split1 = a * d, split2 = b * c;
    return { q: 'Factorise ' + MX.m(e) + '.', spec: { kind: 'expr', expr: e, form: 'factorised' }, show: MX.m(ans),
      cp: [{ band: 'hi', kind: 'factor', e: e, f: [lin(a, b, v), lin(c, d, v)], why: 'You found a correct factor' },
        { band: 'lo', kind: 'step', e: e, why: 'You split the middle term correctly' }, { band: 'lo', kind: 'num', n: A * C, why: 'You multiplied a × c' }],
      hint: 'Multiply the number in front of ' + v + '² by the constant. Find two factors of that which add to the number in front of ' + v + '.',
      steps: [{ h: 'Step 1:', t: A + ' × ' + paren(C) + ' = ' + A * C + '. Two numbers that multiply to ' + A * C + ' and add to ' + B + ': ' + num(split1) + ' and ' + num(split2) + '.' },
        { h: 'Step 2:', t: 'split the middle term: ' + MX.m(ps([[A, v + '^2'], [split1, v], [split2, v], [C, '']])) + '.' },
        { h: 'Step 3:', t: 'take out the HCF of each pair. The brackets match.' },
        { h: 'Answer:', t: MX.m(ans) }] };
  }

  /* ── Skills activity (registered with the subject engine) ─────── */
  /* StudyNet mastery: based on your last 10 answers, not a points total.
     Stages: Learning → Practising (6 of last 10) → Confident (8 of last 10) → Mastered (9 of last 10 and the last 5 in a row).
     A right answer after a hint, or a wrong answer with the right method, counts half. A mastered skill asks for a
     quick review after 7 days, so it stays fresh. */
  var PRAISE = ['Correct!', 'Correct, nice work.', 'Correct. Keep going.', 'That’s right.'];
  var STORE = 'sn_maths_mastery', STAGES = ['Learning', 'Practising', 'Confident', 'Mastered'], DAY = 864e5;
  function allRec() { var o = window.SN ? SN.readJSON(STORE, {}) : {}; return o && typeof o === 'object' ? o : {}; }
  MX.mastery = function (id) {
    var o = allRec()[id] || {}, r = o.r || '', last = r.slice(-10), n = last.length, pts = 0;
    for (var i = 0; i < n; i++) pts += last[i] === 'c' ? 1 : last[i] === 'w' ? 0 : 0.5;
    var right = Math.round(pts * 2) / 2, stage = -1;
    if (n) stage = 0;
    if (n >= 5 && pts >= n * 0.6) stage = 1;
    if (n >= 8 && pts >= 8) stage = 2;
    if (n >= 10 && pts >= 9 && r.slice(-5) === 'ccccc') stage = 3;
    var review = stage === 3 && o.at && Date.now() - o.at > 7 * DAY;
    var goal = stage < 1 ? 'Get 6 of your next 10 right to reach Practising.' : stage < 2 ? 'Get 8 of your last 10 right to reach Confident.' :
      stage < 3 ? 'Get 9 of your last 10 right, with the last 5 in a row, to master it.' : review ? 'It’s been a week: answer one to keep it mastered.' : 'Mastered. Come back in a week to keep it fresh.';
    return { stage: stage, label: stage < 0 ? 'Not started' : (review ? 'Review due' : STAGES[stage]), right: right, n: n, goal: goal, review: review, total: o.n || 0 };
  };
  function ladder(m, big) {
    var h = '<span class="ladder' + (big ? ' big' : '') + '" aria-hidden="true">';
    for (var i = 0; i < 4; i++) h += '<i' + (i <= m.stage ? ' class="on' + (m.review && i === 3 ? ' due' : '') + '"' : '') + '></i>';
    return h + '</span>';
  }
  MX.ladder = ladder;

  if (window.SubjectApp) SubjectApp.addMode({
    id: 'skills', label: 'Skills', icon: 'target', key: 'skills', at: 1, // right after Notes
    count: function (t) { var n = t.skills.length; return n + ' skill' + (n !== 1 ? 's' : ''); },
    score: function (Y) { // skills at Confident or better, for the page chip and the dashboard
      var ids = Object.keys(Y.skills || {});
      return { c: ids.filter(function (id) { return MX.mastery(id).stage >= 2; }).length, t: ids.length, u: 'skills confident' };
    },
    init: function (el, api, keys) {
      var ic = api.ic, esc = api.esc, cur = null, q = null, hinted = false, nearMiss = false, streak = 0, seed = Date.now() % 1e9, shownExample = {};
      function skillPills() {
        return '<div class="pills skill-pills" role="group" aria-label="Skills in this topic">' + keys.map(function (k) {
          var m = MX.mastery(k);
          return '<button type="button" class="pill" data-skill="' + k + '" aria-pressed="' + (k === cur) + '">' + esc(MX.skills[k].label) +
            (m.stage >= 0 ? ' ' + ladder(m) + '<span class="sr-only">, ' + m.label + '</span>' : '') + '</button>';
        }).join('') + '</div><p class="skill-legend">The bars show your stage: Learning, Practising, Confident, Mastered. They’re based on your last 10 answers.</p>';
      }
      function save(res) {
        var all = allRec(), o = all[cur] || { r: '', n: 0 };
        o.r = (o.r + res).slice(-20); o.n++; o.at = Date.now();
        all[cur] = o; SN.writeJSON(STORE, all);
      }
      function head() {
        var m = MX.mastery(cur), sk = MX.skills[cur];
        return '<div class="skill-head"><div><h2 class="skill-t">' + esc(sk.label) + '</h2><p class="skill-d">' + esc(sk.desc) + '</p></div>' +
          '<div class="mastery"><div class="mastery-top">' + ladder(m, true) + '<b>' + m.label + '</b></div>' +
          '<span class="mastery-sub">' + (m.n ? '<span class="num">' + m.right + '</span> of your last <span class="num">' + m.n + '</span> right' : 'No answers yet') + '</span></div></div>' +
          '<p class="skill-goal">' + m.goal + '</p>';
      }
      function next() {
        q = MX.skills[cur].gen(MX.rng(seed++)); hinted = false; nearMiss = false;
        var first = MX.mastery(cur).stage < 0 && !shownExample[cur], ex = first ? MX.skills[cur].gen(MX.rng(seed + 7777)) : null;
        if (first) shownExample[cur] = 1;
        el.innerHTML = skillPills() + '<div class="skill"><div class="skill-top">' + head() + '</div>' +
          (ex ? '<div class="skill-example"><h3>New skill: watch one being done first</h3>' + api.stepsHtml(ex.steps, ex.q) + '<p class="skill-foot">Then try the question below. Stuck? Press <b>Show me how</b>.</p></div>' : '') +
          '<div class="skill-q" id="sk-q">' + (ex ? '<span class="skill-try">Your turn: </span>' : '') + q.q + '</div>' +
          '<form class="skill-form" id="sk-form" novalidate>' + MX.inputHtml('sk-in', 'Your answer', '', { placeholder: q.placeholder || 'Type your answer' }) +
          '<details class="skill-work"><summary>Show your working (optional)</summary><textarea id="sk-w" class="ex-ta" rows="3" aria-label="Your working" placeholder="One step per line"></textarea>' +
          '<p class="skill-foot">If your answer is wrong but your method is right, it counts half, like method marks in an exam.</p></details>' +
          '<div class="skill-btns"><button type="submit" class="btn primary">' + ic('check') + ' Submit</button>' +
          '<button type="button" class="btn" id="sk-hint">' + ic('bulb') + ' Hint</button>' +
          '<button type="button" class="btn" id="sk-how">Show me how</button></div></form>' +
          '<div id="sk-fb" class="skill-fb" role="status" aria-live="polite"></div>' +
          '<p class="skill-foot">' + (streak > 1 ? '<b class="num">' + streak + '</b> in a row. ' : '') + 'Any correct form of the answer counts, unless the question asks for a particular one.</p></div>';
      }
      function submit() {
        var inp = document.getElementById('sk-in'), fb = document.getElementById('sk-fb'), w = document.getElementById('sk-w');
        var r = MX.check(q.spec, inp.value);
        if (r.empty) { fb.innerHTML = '<p class="skill-msg">Type an answer first.</p>'; inp.focus(); return; }
        if (!r.ok && r.msg && !nearMiss) {
          // A near miss (not fully factorised, rounding, can't read it) gets one more go before it counts.
          nearMiss = true;
          fb.innerHTML = '<p class="skill-msg warn">' + ic('info') + ' <span>' + esc(r.msg) + ' Try again.</span></p>';
          inp.focus(); return;
        }
        SN.markStudied();
        var meth = !r.ok ? MX.method(q, w ? w.value : '', inp.value) : null;
        var res = r.ok ? (hinted ? 'h' : 'c') : (meth && meth.band === 'hi' ? 'm' : 'w');
        var before = MX.mastery(cur).stage;
        save(res);
        var after = MX.mastery(cur);
        streak = r.ok ? streak + 1 : 0;
        document.querySelectorAll('#sk-form input, #sk-form button, #sk-form textarea').forEach(function (x) { x.disabled = true; });
        el.querySelector('.skill-top').innerHTML = head();
        var up = after.stage > before ? ' You’ve reached <b>' + after.label + '</b>.' : '';
        if (r.ok) {
          fb.innerHTML = '<p class="skill-msg good">' + ic('check') + ' <span>' + (hinted ? 'Correct. Answers after a hint count half.' : PRAISE[Math.floor(Math.random() * PRAISE.length)]) + up + '</span></p>' +
            '<button type="button" class="btn primary" id="sk-next">Next question ' + ic('arrow-right') + '</button>';
        } else {
          // Walk through the question they just got wrong (not a different example), one step at a time.
          fb.innerHTML = '<p class="skill-msg bad">Not quite' + (r.msg ? ': ' + esc(r.msg) : '.') + ' You answered <b>' + esc(inp.value.trim()) + '</b>. The answer is ' + q.show + '.</p>' +
            (meth ? '<p class="skill-msg">' + ic('check') + ' <span>Method marks: ' + esc(meth.why) + '.' + (meth.band === 'hi' ? ' That counts half. Check the arithmetic in your last steps.' : '') + '</span></p>' : '') +
            '<div class="skill-learn"><h3>Let’s go through your question</h3>' + api.stepsHtml(q.steps, q.q) +
            '<p class="skill-foot">Compare each step with what you did. The first step that’s different is where it went wrong.</p></div>' +
            '<button type="button" class="btn primary" id="sk-next">Got it, next question ' + ic('arrow-right') + '</button>';
        }
        var stepBtn = !r.ok && fb.querySelector('[data-step="next"]');
        (stepBtn || document.getElementById('sk-next')).focus();
        api.updateScore();
      }
      el.onclick = function (e) {
        var b = e.target.closest('[data-skill]');
        if (b) { cur = b.dataset.skill; streak = 0; next(); el.querySelector('.pill[aria-pressed="true"]').focus(); return; }
        if (e.target.closest('#sk-next')) { next(); document.getElementById('sk-in').focus(); return; }
        if (e.target.closest('#sk-how')) {
          hinted = true;
          document.getElementById('sk-fb').innerHTML = '<div class="skill-learn"><h3>How to do this one</h3>' + api.stepsHtml(q.steps) +
            '<p class="skill-foot">Go through the steps, then type the answer in the box yourself. Answers after “Show me how” count half, so you still move forward.</p></div>';
          var nb = document.querySelector('#sk-fb [data-step="next"]'); if (nb) nb.focus();
          return;
        }
        if (e.target.closest('#sk-hint')) {
          hinted = true;
          document.getElementById('sk-fb').innerHTML = '<div class="skill-msg">' + ic('bulb') + ' <span>' + q.hint +
            ' <button type="button" class="link" id="sk-step1">Show the first step</button></span></div>';
          return;
        }
        if (e.target.closest('#sk-step1')) {
          var st = q.steps[0];
          e.target.closest('.skill-msg').insertAdjacentHTML('afterend', '<p class="skill-msg">' + (st.h ? '<b>' + st.h + '</b> ' : '') + (st.t || st) + '</p>');
          e.target.remove();
        }
      };
      el.onsubmit = function (e) { e.preventDefault(); submit(); };
      // Start on a skill that's due for review, else the first one that isn't Confident yet.
      cur = keys.filter(function (k) { return MX.mastery(k).review; })[0] || keys.filter(function (k) { return MX.mastery(k).stage < 2; })[0] || keys[0];
      next();
    }
  });
  try { localStorage.removeItem('sn_maths_skills'); } catch (e) {} // the old points-based scores
})();
