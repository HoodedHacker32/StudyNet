/* StudyNet — scientific calculator panel (loaded on Maths and Science pages).
   It works like the scientific calculators used in Junior Cycle classes: exact fractions, surds,
   S<=>D, SHIFT/ALPHA functions. Plain browser JS (no modules). Creates #calc, exposes window.__calc;
   __calc.toggle() shows or hides it (any [data-calc] button calls it).

   window.__calc.press(id) presses a key. Key ids (left-to-right, top-to-bottom as on the calculator):
     shift  alpha  [up down left right] (cursor pad)  menu  on
     optn   x3                                   abs    logab
     frac   sqrt   sq     pow    log    ln
     neg    dms    inv    sin    cos    tan
     sto    eng    lp     rp     sd     mplus
     k7     k8     k9     del    ac
     k4     k5     k6     mul    div
     k1     k2     k3     add    sub
     k0     dot    exp    ans    eq
   (lp/rp = ( ) ; sd = S<=>D ; mplus = M+ ; dms = degree/min/sec key ; inv = x^-1 ; exp = x10^x ; frac = fraction key)
   SHIFT / ALPHA functions are reached by pressing 'shift' or 'alpha' first, exactly as on the calculator.
   Other members: __calc.seq('k1 add k2 eq') presses a sequence and returns the LCD text,
   __calc.text() LCD text, __calc.status() status-bar text, __calc.S state, __calc.SET settings, __calc.VARS variables.
*/
(function () {
'use strict';
/* ======================================================================
   1. NUMBERS
   Three kinds of value:
     {k:'x', t:[[n,d,r],...]}  exact: sum of (n/d)*sqrt(r)  (BigInt n,d,r; r=1 is the rational part)
     {k:'p', n, d}             exact: (n/d)*pi
     {k:'f', v}                approximate (double, rounded to 15 significant digits like the real
                               calculator's 15-digit internal precision)
   ====================================================================== */
function CErr(m, pos) { this.m = m; this.pos = pos; }
var E_MATH = 'Math ERROR', E_SYN = 'Syntax ERROR', E_STACK = 'Stack ERROR', E_ARG = 'Argument ERROR', E_RANGE = 'Range ERROR';
function merr() { throw new CErr(E_MATH); }
function babs(a) { return a < 0n ? -a : a; }
function gcd(a, b) { a = babs(a); b = babs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
var LIM = 10n ** 120n;
function isqrt(n) {
  if (n < 0n) merr(); if (n < 2n) return n;
  var x = n < (1n << 52n) ? BigInt(Math.floor(Math.sqrt(Number(n)))) + 1n : (1n << BigInt(Math.ceil(n.toString(2).length / 2) + 1));
  for (;;) { var y = (x + n / x) >> 1n; if (y >= x) break; x = y; }
  while (x * x > n) x--; while ((x + 1n) * (x + 1n) <= n) x++; return x;
}
function iroot(n, k) { // exact integer k-th root of n>=0 or null
  if (n < 2n) return n; var kn = Number(k); if (kn === 2) { var s = isqrt(n); return s * s === n ? s : null; }
  var f = Number(n); if (!isFinite(f)) return null;
  var g = BigInt(Math.round(Math.pow(f, 1 / kn)));
  for (var c = g - 1n; c <= g + 1n; c++) if (c >= 0n && c ** k === n) return c;
  return null;
}
function q2f(n, d) { return Number(n) / Number(d); }
function rq(n, d) { if (d === 0n) merr(); if (d < 0n) { n = -n; d = -d; } var g = gcd(n, d); if (g > 1n) { n /= g; d /= g; } return [n, d]; }
function xf(t) { var s = 0; for (var i = 0; i < t.length; i++) s += q2f(t[i][0], t[i][1]) * (t[i][2] === 1n ? 1 : Math.sqrt(Number(t[i][2]))); return s; }
function F(v) {
  if (typeof v !== 'number' || v !== v || !isFinite(v)) merr();
  if (Math.abs(v) >= 1e100) merr();
  if (Math.abs(v) < 1e-99) v = 0;
  v = Number(v.toPrecision(15)); if (v === 0) v = 0;
  return { k: 'f', v: v };
}
function mkX(raw) {
  var out = [];
  for (var i = 0; i < raw.length; i++) {
    var t = raw[i]; if (t[0] === 0n) continue; var q = rq(t[0], t[1]), r = t[2], j;
    for (j = 0; j < out.length; j++) if (out[j][2] === r) break;
    if (j < out.length) { var s = rq(out[j][0] * q[1] + q[0] * out[j][1], out[j][1] * q[1]); out[j] = [s[0], s[1], r]; }
    else out.push([q[0], q[1], r]);
  }
  out = out.filter(function (t) { return t[0] !== 0n; }).sort(function (a, b) { return a[2] < b[2] ? -1 : a[2] > b[2] ? 1 : 0; });
  var big = out.length > 6;
  for (i = 0; i < out.length && !big; i++) if (babs(out[i][0]) > LIM || out[i][1] > LIM || out[i][2] > LIM) big = true;
  var fv = xf(out);
  if (Math.abs(fv) >= 1e100) merr();
  if (big) return F(fv);
  return { k: 'x', t: out };
}
function Rat(n, d) { return mkX([[BigInt(n), BigInt(d === undefined ? 1 : d), 1n]]); }
var ZERO = { k: 'x', t: [] };
function mkP(n, d) { var q = rq(BigInt(n), BigInt(d)); if (q[0] === 0n) return ZERO; if (babs(q[0]) > LIM || q[1] > LIM) return F(q2f(q[0], q[1]) * Math.PI); if (Math.abs(q2f(q[0], q[1]) * Math.PI) >= 1e100) merr(); return { k: 'p', n: q[0], d: q[1] }; }
function toF(v) { return v.k === 'f' ? v.v : v.k === 'p' ? q2f(v.n, v.d) * Math.PI : xf(v.t); }
function isZero(v) { return v.k === 'x' ? v.t.length === 0 : v.k === 'f' ? v.v === 0 : false; }
function isRatV(v) { return v.k === 'x' && (v.t.length === 0 || (v.t.length === 1 && v.t[0][2] === 1n)); }
function ratOf(v) { return v.t.length ? [v.t[0][0], v.t[0][1]] : [0n, 1n]; }
function isIntV(v) { return isRatV(v) && ratOf(v)[1] === 1n; }
/* integer value of v if it is (or rounds to, for floats) an integer; else null */
function intOf(v) {
  if (isRatV(v)) { var q = ratOf(v); return q[1] === 1n ? q[0] : null; }
  if (v.k === 'f' && Number.isInteger(v.v) && Math.abs(v.v) < 1e15) return BigInt(v.v);
  return null;
}
function sgn(v) { var f = toF(v); return f > 0 ? 1 : f < 0 ? -1 : 0; }
function neg(a) { return a.k === 'x' ? mkX(a.t.map(function (t) { return [-t[0], t[1], t[2]]; })) : a.k === 'p' ? mkP(-a.n, a.d) : F(-a.v); }
function add(a, b) {
  if (isZero(a)) return b; if (isZero(b)) return a;
  if (a.k === 'x' && b.k === 'x') return mkX(a.t.concat(b.t));
  if (a.k === 'p' && b.k === 'p') { var q = rq(a.n * b.d + b.n * a.d, a.d * b.d); return mkP(q[0], q[1]); }
  return F(toF(a) + toF(b));
}
function sub(a, b) { return add(a, neg(b)); }
function mul(a, b) {
  if (isZero(a) || isZero(b)) return ZERO;
  if (a.k === 'x' && b.k === 'x') {
    var raw = [];
    a.t.forEach(function (s) { b.t.forEach(function (u) { var g = gcd(s[2], u[2]); raw.push([s[0] * u[0] * g, s[1] * u[1], (s[2] / g) * (u[2] / g)]); }); });
    return mkX(raw);
  }
  if (a.k === 'p' && isRatV(b)) { var q = ratOf(b); return mkP(a.n * q[0], a.d * q[1]); }
  if (b.k === 'p' && isRatV(a)) return mul(b, a);
  return F(toF(a) * toF(b));
}
function inv(b) {
  if (isZero(b)) merr();
  if (b.k === 'x') {
    if (b.t.length === 1) { var t = b.t[0]; return mkX([[t[1], t[0] * t[2], t[2]]]); }
    if (b.t.length === 2) {
      var c = mkX([b.t[0], [-b.t[1][0], b.t[1][1], b.t[1][2]]]), den = mul(b, c);
      if (den.k === 'x' && isRatV(den)) return mul(c, inv(den));
    }
  }
  return F(1 / toF(b));
}
function div(a, b) {
  if (isZero(b)) merr();
  if (a.k === 'p' && b.k === 'p') { var q = rq(a.n * b.d, a.d * b.n); return mkX([[q[0], q[1], 1n]]); }
  if (a.k === 'p' && isRatV(b)) { q = ratOf(b); return mkP(a.n * q[1], a.d * q[0]); }
  if (a.k === 'x' && b.k === 'x') return mul(a, inv(b));
  return F(toF(a) / toF(b));
}
/* sqrt of a non-negative rational n/d -> exact k*sqrt(s)/d or null */
var SMALLP = (function () { var p = [], i, j; for (i = 2; i < 1000; i++) { for (j = 2; j * j <= i; j++) if (i % j === 0) break; if (j * j > i) p.push(BigInt(i)); } return p; })();
function sqrtQ(n, d) {
  if (n < 0n) merr(); if (n === 0n) return ZERO;
  var m = n * d; if (m > 10n ** 40n) return null;
  var k = 1n, s = m;
  for (var i = 0; i < SMALLP.length; i++) { var p = SMALLP[i], pp = p * p; if (pp > s) break; while (s % pp === 0n) { s /= pp; k *= p; } }
  var r = isqrt(s); if (r * r === s) { k *= r; s = 1n; }
  return mkX([[k, d, s]]);
}
function rootExact(q, n) { // q=[num,den] rational, n BigInt>0 : exact n-th root or null
  var a = q[0], b = q[1];
  if (a < 0n) { if (n % 2n === 0n) merr(); var r = rootExact([-a, b], n); return r ? neg(r) : null; }
  if (n === 1n) return mkX([[a, b, 1n]]);
  if (n === 2n) return sqrtQ(a, b);
  var ra = iroot(a, n), rb = iroot(b, n);
  if (ra !== null && rb !== null) return mkX([[ra, rb, 1n]]);
  return null;
}
function powInt(a, k) {
  if (isZero(a)) { if (k <= 0n) merr(); return ZERO; }
  if (a.k !== 'f' && babs(k) <= 64n) {
    var r = Rat(1), base = a, kk = babs(k);
    while (kk > 0n) { if (kk & 1n) r = mul(r, base); kk >>= 1n; if (kk > 0n) base = mul(base, base); }
    return k < 0n ? inv(r) : r;
  }
  return F(Math.pow(toF(a), Number(k)));
}
function pow(a, b) {
  if (isRatV(b)) {
    var e = ratOf(b);
    if (e[1] === 1n) return powInt(a, e[0]);
    var p = e[0], q = e[1];
    if (isRatV(a)) {
      var ab = ratOf(a);
      if (ab[0] < 0n && q % 2n === 0n) merr();
      if (ab[0] === 0n) { if (p <= 0n) merr(); return ZERO; }
      if (q <= 1000n) { var rr = rootExact(ab, q); if (rr) return powInt(rr, p); }
    }
    var x = toF(a);
    if (x < 0) { if (q % 2n === 0n) merr(); var m = Math.pow(-x, q2f(p, q)); return F(p % 2n === 0n ? m : -m); }
    if (x === 0) { if (p <= 0n) merr(); return ZERO; }
    return F(Math.pow(x, q2f(p, q)));
  }
  var xx = toF(a), y = toF(b);
  if (xx === 0) { if (y <= 0) merr(); return ZERO; }
  if (xx < 0) { if (Number.isInteger(y)) return F(Math.pow(xx, y)); merr(); }
  return F(Math.pow(xx, y));
}
function nthRoot(x, n) { // n-th root (n is a value)
  var ni = intOf(n);
  if (ni !== null && ni !== 0n && isRatV(n)) {
    if (ni < 0n) return inv(nthRoot(x, Rat(-ni)));
    if (isRatV(x)) { var q = ratOf(x); if (q[0] < 0n && ni % 2n === 0n) merr(); var r = rootExact(q, ni); if (r) return r; }
    var f = toF(x); if (f < 0) { if (ni % 2n === 0n) merr(); return F(-Math.pow(-f, 1 / Number(ni))); }
    return F(Math.pow(f, 1 / Number(ni)));
  }
  var nf = toF(n); if (nf === 0) merr();
  var xf2 = toF(x); if (xf2 < 0) merr();
  return F(Math.pow(xf2, 1 / nf));
}
function vabs(v) { return sgn(v) < 0 ? neg(v) : v; }
/* ---------- decimal string -> exact rational ---------- */
function decToRat(s) { // s like "-12.345" or "1.2e-5"
  var m = /^(-?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/.exec(s); if (!m) merr();
  var ip = m[2] || '0', fp = m[3] || '', ex = parseInt(m[4] || '0', 10);
  var n = BigInt(ip + fp), d = 10n ** BigInt(fp.length);
  if (ex > 0) n *= 10n ** BigInt(ex); else if (ex < 0) d *= 10n ** BigInt(-ex);
  if (m[1]) n = -n; return mkX([[n, d, 1n]]);
}

/* ---------- angles ---------- */
var SET; // settings object, defined later
function sinTab(k) { // sin(15k degrees), exact
  k = ((k % 24) + 24) % 24; var s = 1; if (k >= 12) { s = -1; k -= 12; } if (k > 6) k = 12 - k;
  var v = [ZERO, mkX([[1n, 4n, 6n], [-1n, 4n, 2n]]), Rat(1, 2), mkX([[1n, 2n, 2n]]), mkX([[1n, 2n, 3n]]), mkX([[1n, 4n, 6n], [1n, 4n, 2n]]), Rat(1)][k];
  return s < 0 ? neg(v) : v;
}
function degExact(v) { // exact rational degrees for angle v in current unit, or null
  var u = SET.angle;
  if (isZero(v)) return [0n, 1n];
  if (u === 'deg' && isRatV(v)) return ratOf(v);
  if (u === 'rad' && v.k === 'p') return rq(v.n * 180n, v.d);
  if (u === 'gra' && isRatV(v)) { var q = ratOf(v); return rq(q[0] * 9n, q[1] * 10n); }
  return null;
}
function trigRange(v) {
  var a = Math.abs(toF(v)), u = SET.angle;
  if ((u === 'deg' && a >= 9e9) || (u === 'rad' && a >= 157079632.7) || (u === 'gra' && a >= 1e10)) merr();
}
function toRadF(v) { // float radians, with exact range reduction for deg/gra
  var x = toF(v), u = SET.angle;
  if (u === 'deg') return (x % 360) * Math.PI / 180;
  if (u === 'gra') return (x % 400) * Math.PI / 200;
  return x;
}
function vsin(v) { trigRange(v); var d = degExact(v); if (d && d[1] === 1n && d[0] % 15n === 0n) return sinTab(Number((d[0] / 15n) % 24n)); return F(Math.sin(toRadF(v))); }
function vcos(v) { trigRange(v); var d = degExact(v); if (d && d[1] === 1n && d[0] % 15n === 0n) return sinTab(6 - Number((d[0] / 15n) % 24n)); return F(Math.cos(toRadF(v))); }
function vtan(v) {
  trigRange(v); var d = degExact(v);
  if (d && d[1] === 1n && d[0] % 15n === 0n) { var k = Number((d[0] / 15n) % 24n), c = sinTab(6 - k); if (isZero(c)) merr(); return div(sinTab(k), c); }
  var r = toRadF(v), cc = Math.cos(r); if (Math.abs(cc) < 1e-15) merr(); return F(Math.tan(r));
}
function angOut(rad) { // radians (float) -> value in current unit, exact for multiples of 15 degrees
  var deg = rad * 180 / Math.PI, k = Math.round(deg / 15);
  if (Math.abs(deg - 15 * k) < 1e-9) {
    var u = SET.angle; if (u === 'deg') return Rat(15 * k); if (u === 'rad') return mkP(15 * k, 180); return Rat(50 * k, 3);
  }
  var u2 = SET.angle; return F(u2 === 'deg' ? deg : u2 === 'gra' ? rad * 200 / Math.PI : rad);
}
function vasin(v) { var x = toF(v); if (Math.abs(x) > 1) merr(); return angOut(Math.asin(x)); }
function vacos(v) { var x = toF(v); if (Math.abs(x) > 1) merr(); return angOut(Math.acos(x)); }
function vatan(v) { return angOut(Math.atan(toF(v))); }
/* convert angle value from unit 'from' into the current unit (OPTN Angle Unit) */
function angConv(v, from) {
  var to = SET.angle; if (from === to) return v;
  var f2d = from === 'deg' ? Rat(1) : from === 'gra' ? Rat(9, 10) : null; // factor to degrees
  var deg;
  if (from === 'rad') deg = v.k === 'p' ? mkX([[v.n * 180n, v.d, 1n]]) : isZero(v) ? ZERO : F(toF(v) * 180 / Math.PI);
  else deg = mul(v, f2d);
  if (to === 'deg') return deg;
  if (to === 'gra') return mul(deg, Rat(10, 9));
  return isRatV(deg) ? (function () { var q = ratOf(deg); return mkP(q[0], q[1] * 180n); })() : F(toF(deg) * Math.PI / 180);
}
/* ---------- other functions ---------- */
function vlog10(v) { var x = toF(v); if (x <= 0) merr(); return F(Math.log10(x)); }
function vln(v) { var x = toF(v); if (x <= 0) merr(); return F(Math.log(x)); }
function vlogab(a, b) { var x = toF(a), y = toF(b); if (x <= 0 || x === 1 || y <= 0) merr(); return F(Math.log(y) / Math.log(x)); }
function vten(v) { var k = intOf(v); if (k !== null && isRatV(v) && babs(k) <= 99n) return k >= 0n ? Rat(10n ** k) : mkX([[1n, 10n ** (-k), 1n]]); var x = toF(v); if (x > 99.99999999 + 1e-9) merr(); return F(Math.pow(10, x)); }
function vexp(v) { if (isZero(v)) return Rat(1); var x = toF(v); if (x > 230.2585092 + 1e-9) merr(); return F(Math.exp(x)); }
function vfact(v) { var k = intOf(v); if (k === null || k < 0n || k > 69n) merr(); var r = 1n; for (var i = 2n; i <= k; i++) r *= i; return Rat(r); }
function vperm(a, b, comb) {
  var n = intOf(a), r = intOf(b);
  if (n === null || r === null || n < 0n || r < 0n || r > n || n >= 10n ** 10n) merr();
  var k = comb && r > n - r ? n - r : r; if (k > 5000n) merr();
  var p = 1n; for (var i = 0n; i < k; i++) { p *= (n - i); if (!comb && p >= 10n ** 100n) merr(); }
  if (comb) { var f = 1n; for (var j = 2n; j <= k; j++) f *= j; p /= f; }
  if (p >= 10n ** 100n) merr(); return Rat(p);
}
function hyp(name, v) {
  var x = toF(v), r;
  switch (name) {
    case 'sinh': if (Math.abs(x) > 230.2585092) merr(); r = Math.sinh(x); break;
    case 'cosh': if (Math.abs(x) > 230.2585092) merr(); r = Math.cosh(x); break;
    case 'tanh': r = Math.tanh(x); break;
    case 'sinh⁻¹': r = Math.asinh(x); break;
    case 'cosh⁻¹': if (x < 1) merr(); r = Math.acosh(x); break;
    case 'tanh⁻¹': if (Math.abs(x) >= 1) merr(); r = Math.atanh(x); break;
  }
  if (x === 0 && name !== 'cosh') return ZERO; if (x === 0) return Rat(1);
  return F(r);
}
function vPol(x, y) {
  var r2 = add(mul(x, x), mul(y, y)), r;
  if (isRatV(r2)) r = sqrtQ(ratOf(r2)[0], ratOf(r2)[1]); if (!r) r = F(Math.sqrt(toF(r2)));
  var fx = toF(x), fy = toF(y); if (fx === 0 && fy === 0) return [ZERO, ZERO];
  return [r, angOut(Math.atan2(fy, fx))];
}
function vRec(r, th) { if (sgn(r) < 0) merr(); return [mul(r, vcos(th)), mul(r, vsin(th))]; }

/* ======================================================================
   2. SETTINGS + RESULT FORMATTING
   ====================================================================== */
function defaultSet() {
  return { io: 'MM', angle: 'deg', fmt: { t: 'norm', n: 1 }, frac: 'dc', freq: false, table: 'fg', rec: true, mark: 'dot', sep: false, font: 'normal', contrast: 5 };
}
SET = defaultSet();
function isMathIn() { return SET.io === 'MM' || SET.io === 'MD'; }
function digitsOf(b) { return babs(b).toString().length; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/* ---- decimal parts {m:'-1.234', e:5|null} according to the number format ---- */
function plainStr(r) { // r>=0 , < 1e10, >= 1e-9 ; 10 significant digits, no exponent
  if (r === 0) return '0';
  var dec = Math.max(0, 9 - Math.floor(Math.log10(r)));
  var s = r.toFixed(Math.min(dec, 20));
  if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}
function trimMant(s) { return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s; }
function decParts(x, f) {
  f = f || SET.fmt;
  var neg = x < 0, a = Math.abs(x), m, e = null, p;
  if (f.t === 'sci') {
    var n = f.n || 10; p = a.toExponential(n - 1).split('e'); m = p[0]; e = +p[1];
  } else if (f.t === 'fix') {
    var s2 = a.toFixed(f.n);
    if (a >= 1e10 || Number(s2) >= 1e10) { p = a.toExponential(9).split('e'); m = trimMant(p[0]); e = +p[1]; }
    else m = s2;
    if (Number(m) === 0) neg = false;
  } else {
    var lo = f.n === 2 ? 1e-9 : 1e-2, r = Number(a.toPrecision(10));
    if (a === 0) m = '0';
    else if (r >= 1e10 || r < lo) { p = a.toExponential(9).split('e'); m = trimMant(p[0]); e = +p[1]; }
    else m = plainStr(r);
  }
  return { m: (neg ? '-' : '') + m, e: e };
}
/* round a value the way Rnd( does */
function rndValue(v) {
  var x = toF(v), f = SET.fmt, s;
  if (x === 0) return ZERO;
  if (f.t === 'fix') s = x.toFixed(f.n);
  else if (f.t === 'sci') s = x.toExponential((f.n || 10) - 1);
  else s = x.toPrecision(10);
  return decToRat(String(Number(s)));
}

/* ---- recognise a float as an exact value (MathO display only) ---- */
function cfrac(x, maxd) {
  var sg = x < 0 ? -1 : 1; x = Math.abs(x);
  var h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = x;
  for (var i = 0; i < 40; i++) {
    var a = Math.floor(b), h2 = a * h1 + h0, k2 = a * k1 + k0;
    if (k2 > maxd) break; h0 = h1; h1 = h2; k0 = k1; k1 = k2;
    if (Math.abs(x - h1 / k1) <= 1e-13 * Math.max(x, 1e-300)) return [sg * h1, k1];
    var fr = b - a; if (fr < 1e-15) break; b = 1 / fr;
  }
  return Math.abs(x - h1 / k1) <= 1e-13 * Math.max(x, 1e-300) && k1 > 0 ? [sg * h1, k1] : null;
}
function recog(x) {
  if (x === 0) return ZERO;
  if (Math.abs(x) >= 1e10 || Math.abs(x) < 1e-6) return null;
  var q = cfrac(x, 9999); if (q) return Rat(q[0], q[1]);
  var q2 = cfrac(x * x, 9999);
  if (q2 && Math.abs(x * x) < 1e8) { var s = sqrtQ(BigInt(q2[0]), BigInt(q2[1])); if (s && s.k === 'x') return x < 0 ? neg(s) : s; }
  var q3 = cfrac(x / Math.PI, 999); if (q3 && Math.abs(x) < 1e6) return mkP(q3[0], q3[1]);
  return null;
}

/* ---- exact forms ----
   returns {t:'int'|'frac'|'surd'|'pi', ...} or null when the value cannot be shown exactly */
function fracDesc(n, d, mixed) {
  var ng = n < 0n; n = babs(n);
  if (d === 1n) return digitsOf(n) <= 10 ? { t: 'int', neg: ng, i: n } : null;
  if (mixed && n > d) {
    var i = n / d, r = n % d;
    if (digitsOf(i) + digitsOf(r) + digitsOf(d) + 2 > 10) return null;
    return { t: 'frac', neg: ng, i: i, n: r, d: d };
  }
  if (digitsOf(n) + digitsOf(d) + 1 > 10) return null;
  return { t: 'frac', neg: ng, i: null, n: n, d: d };
}
function lcm(a, b) { return a / gcd(a, b) * b; }
function exactDesc(v, mixed) {
  if (v.k === 'f') return null;
  if (v.k === 'p') {
    if (Math.abs(toF(v)) >= 1e6) return null;
    var fd = fracDesc(v.n, v.d, mixed); if (!fd) return null;
    if (fd.t === 'int') { if (digitsOf(fd.i) > 9) return null; return { t: 'pi', neg: fd.neg, i: fd.i, n: null, d: 1n }; }
    return { t: 'pi', neg: fd.neg, i: fd.i, n: fd.n, d: fd.d };
  }
  if (isRatV(v)) { var q = ratOf(v); return fracDesc(q[0], q[1], mixed); }
  if (v.t.length > 2) return null;
  var C = 1n; v.t.forEach(function (t) { C = lcm(C, t[1]); });
  if (C >= 100n) return null;
  var terms = v.t.map(function (t) { return { a: t[0] * (C / t[1]), r: t[2] }; });
  for (var i = 0; i < terms.length; i++) { if (babs(terms[i].a) >= 100n || terms[i].r >= 1000n) return null; }
  terms.sort(function (a, b) { return a.r === 1n ? -1 : b.r === 1n ? 1 : (a.r > b.r ? -1 : 1); });
  var allNeg = terms.every(function (t) { return t.a < 0n; });
  if (allNeg) terms.forEach(function (t) { t.a = -t.a; });
  return { t: 'surd', neg: allNeg, terms: terms, d: C };
}
/* recurring decimal of rational n/d, or null */
function recurDesc(v) {
  if (!isRatV(v)) return null; var q = ratOf(v), n = q[0], d = q[1]; if (d === 1n) return null;
  var ng = n < 0n; n = babs(n);
  var ip = n / d, r = n % d, digs = [], seen = new Map();
  while (r !== 0n && !seen.has(r)) { seen.set(r, digs.length); r *= 10n; digs.push(Number(r / d)); r %= d; if (digs.length > 30) return null; }
  if (r === 0n) return null;
  var st = seen.get(r);
  if (ip.toString().length + digs.length > 15) return null;
  return { neg: ng, ip: ip.toString(), pre: digs.slice(0, st).join(''), per: digs.slice(st).join('') };
}
/* prime factorisation display (FACT) */
function factDesc(v) {
  var k = intOf(v); if (k === null || !isRatV(v) || k < 2n || k >= 10n ** 10n) return null;
  var n = Number(k), out = [], p;
  for (p = 2; p < 1000 && p * p <= n; p++) { var e = 0; while (n % p === 0) { n /= p; e++; } if (e) out.push([String(p), e]); }
  var rest = null;
  if (n > 1) {
    var isPrime = true; for (p = 2; p * p <= n; p++) if (n % p === 0) { isPrime = false; break; }
    if (isPrime && n < 1018081) out.push([String(n), 1]); else rest = String(n);
  }
  return { f: out, rest: rest };
}

/* ---- HTML builders for the LCD ---- */
var FL = '<span class="czfl"></span>';
function hMinus() { return '<span class="czmi">-</span>'; }
function hMant(m, isResult) {
  var neg = m.charAt(0) === '-'; if (neg) m = m.slice(1);
  var ip = m, fp = null, k = m.indexOf('.'); if (k >= 0) { ip = m.slice(0, k); fp = m.slice(k + 1); }
  if (isResult && SET.sep && ip.length > 3) ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, SET.mark === 'comma' ? '.' : ',');
  var mk = isResult && SET.mark === 'comma' ? ',' : '.';
  return (neg ? hMinus() : '') + ip + (fp !== null ? mk + fp : '');
}
function hExp(e) { return '<span class="czx10">×10</span><span class="czsup">' + (e < 0 ? hMinus() + (-e) : e) + '</span>'; }
function hDec(x, f) { var p = decParts(x, f); return hMant(p.m, true) + (p.e !== null ? hExp(p.e) : ''); }
function hFrac(a, b) { return '<span class="czfr"><span class="czfn">' + a + '</span><span class="czfd">' + b + '</span></span>'; }
var RADSVG = '<svg class="czrs" viewBox="0 0 10 20" preserveAspectRatio="none"><path d="M0.5 12.5 L3 11 L5.5 19 L9.4 0.8 L10 0.8" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>';
function hRoot(inner, idx) { return '<span class="czrt">' + (idx ? '<span class="czri">' + idx + '</span>' : '') + RADSVG + '<span class="czrb">' + inner + '</span></span>'; }
function hSurdNum(terms) {
  var s = '';
  terms.forEach(function (t, i) {
    var a = t.a;
    if (i > 0) s += a < 0n ? '−' : '+'; else if (a < 0n) s += hMinus();
    a = babs(a);
    if (t.r === 1n) s += a.toString();
    else s += (a === 1n ? '' : a.toString()) + hRoot(t.r.toString());
  });
  return s;
}
/* exact descriptor -> HTML (math) or text (line) */
function hExact(D, line) {
  var sg = D.neg ? (line ? '-' : hMinus()) : '';
  if (D.t === 'int') return sg + hMant(D.i.toString(), true);
  if (D.t === 'frac') {
    if (line) return sg + (D.i !== null ? D.i + FL : '') + D.n + FL + D.d;
    return sg + (D.i !== null ? D.i.toString() : '') + hFrac(D.n.toString(), D.d.toString());
  }
  if (D.t === 'pi') {
    if (D.n === null) return sg + (D.i === 1n ? '' : D.i.toString()) + '<i class="czpi">π</i>';
    return sg + (D.i !== null ? D.i.toString() : '') + hFrac(D.n.toString(), D.d.toString()) + '<i class="czpi">π</i>';
  }
  if (D.t === 'surd') { var num = hSurdNum(D.terms); return sg + (D.d === 1n ? num : hFrac(num, D.d.toString())); }
  return '';
}
function hRecur(R, line) {
  var s = (R.neg ? (line ? '-' : hMinus()) : '') + R.ip + (SET.mark === 'comma' ? ',' : '.') + R.pre, p = R.per;
  for (var i = 0; i < p.length; i++) s += (i === 0 || i === p.length - 1) ? '<span class="czdot">' + p[i] + '</span>' : p[i];
  return s;
}
function hDMS(x) {
  var neg = x < 0, a = Math.abs(x); if (a > 9999999.99999) return null;
  var cs = Math.round(a * 360000); // hundredths of a second
  var d = Math.floor(cs / 360000), rem = cs - d * 360000, m = Math.floor(rem / 6000), s = (rem - m * 6000) / 100;
  return (neg ? hMinus() : '') + d + '°' + m + '′' + trimMant(s.toFixed(2)) + '″';
}
function hEng(x, E) {
  var m = x / Math.pow(10, E);
  var am = Math.abs(m); if (am !== 0 && (am >= 1e10)) return null;
  var s = am === 0 ? '0' : Number(am.toPrecision(10)).toString();
  if (s.indexOf('e') >= 0) { s = am.toFixed(Math.min(20, 9 - Math.floor(Math.log10(am)))); s = trimMant(s); }
  var sig = s.replace(/^0\.0*/, '').replace('.', '').length; if (sig > 10 && am !== 0) return null;
  return hMant((m < 0 ? '-' : '') + s, true) + hExp(E);
}
function hFact(F) {
  var parts = F.f.map(function (p) { return p[0] + (p[1] > 1 ? '<span class="czsup">' + p[1] + '</span>' : ''); });
  if (F.rest) parts.push('(' + F.rest + ')');
  return parts.join('×');
}
/* short text for small cells (stat editor, table, recall): fits in w characters */
function shortStr(v, w) {
  var x = toF(v); if (x === 0) return '0';
  for (var p = Math.min(10, w); p >= 1; p--) {
    var s = Number(x.toPrecision(p)).toString();
    if (s.indexOf('e') < 0 && s.length <= w) return s.replace('-', '-');
  }
  var e = Math.floor(Math.log10(Math.abs(x))), es = 'E' + e;
  for (p = Math.max(1, w - es.length - 1); p >= 1; p--) {
    var m = Number((x / Math.pow(10, e)).toPrecision(p)).toString();
    if (m.length + es.length <= w) return m + es;
  }
  return x.toExponential(0).replace('e+', 'E').replace('e', 'E');
}
/* linear (Line I/O style) text of a value, used on the RECALL screen */
function lineExactText(v) {
  if (v.k === 'x' && !isRatV(v)) {
    var D = exactDesc(v, false); if (D) {
      var t = D.terms.map(function (t, i) { var a = t.a, s = (i > 0 ? (a < 0n ? '-' : '+') : (a < 0n ? '-' : '')); a = babs(a); return s + (t.r === 1n ? a.toString() : (a === 1n ? '' : a.toString()) + '√(' + t.r + ')'); }).join('');
      if (D.neg) t = '-' + (D.d === 1n ? t : '(' + t + ')');
      return D.d === 1n ? t : t + '⌟' + D.d;
    }
  }
  if (isRatV(v)) { var q = ratOf(v); if (q[1] !== 1n) { var fd = fracDesc(q[0], q[1], false); if (fd) return (fd.neg ? '-' : '') + fd.n + '⌟' + fd.d; } }
  var p = decParts(toF(v), { t: 'norm', n: 1 });
  return p.m + (p.e !== null ? '×₁₀' + p.e : '');
}

/* ======================================================================
   3. EXPRESSION TOKENS + PARSER / EVALUATOR
   An expression is a flat array of string tokens. Natural-display templates are written as
   BEGIN slot '|' slot ... ']' , e.g. ['F[', '2', '|', '3', ']'] is 2/3.
   Templates: F[ fraction(2)  X[ mixed fraction(3)  √[ (1)  ∛[ (1)  R[ n-th root idx|radicand (2)
              ^[ power exponent, postfix (1)  L[ log_base(arg) (2)  A[ |x| (1)  E[ ×10^n (1)
              TEN[ 10^x (1)  EXP[ e^x (1)
   ====================================================================== */
var SLOTS = { 'RD[': 1, 'F[': 2, 'X[': 3, '√[': 1, '∛[': 1, 'R[': 2, '^[': 1, 'L[': 2, 'A[': 1, 'E[': 1, 'TEN[': 1, 'EXP[': 1 };
var FUN1 = { 'sin(': 1, 'cos(': 1, 'tan(': 1, 'sin⁻¹(': 1, 'cos⁻¹(': 1, 'tan⁻¹(': 1, 'sinh(': 1, 'cosh(': 1, 'tanh(': 1, 'sinh⁻¹(': 1, 'cosh⁻¹(': 1, 'tanh⁻¹(': 1,
  'log(': 1, 'ln(': 1, 'Abs(': 1, 'Rnd(': 1, '√(': 1, '³√(': 1, '10^(': 1, 'e^(': 1, 'Pol(': 2, 'Rec(': 2, 'RanInt#(': 2 };
var POSTFIX = { '²': 1, '³': 1, '⁻¹': 1, '!': 1, '%': 1, '°a': 1, 'ʳ': 1, 'ᵍ': 1, '^[': 1, '^(': 1, 'ˣ√(': 1 };
var EST = { 'x̂': 1, 'ŷ': 1, 'x̂₁': 1, 'x̂₂': 1 };
var VARN = { 'A': 1, 'B': 1, 'C': 1, 'D': 1, 'E': 1, 'F': 1, 'M': 1, 'x': 1, 'y': 1 };
function isDigitT(t) { return t !== undefined && t.length === 1 && t >= '0' && t <= '9'; }
function isStatTok(t) { return t !== undefined && t.charAt(0) === '§'; }
function startsOperand(t) {
  if (t === undefined) return false;
  if (isDigitT(t) || t === '.' || t === 'E[' || t === 'E' || t === '(' || t === 'neg') return true;
  if (FUN1[t] || (SLOTS[t] && t !== '^[' && t !== 'RD[')) return true;
  if (t === 'π' || t === 'e' || t === 'Ans' || t === 'Ran#' || VARN[t] || isStatTok(t)) return true;
  return false;
}
var P = null; // parser state
function serr() { throw new CErr(E_SYN); }
function pk(o) { var i = P.p + (o || 0); return i < P.e ? P.t[i] : undefined; }
function G(v) { var c = {}; for (var k in v) c[k] = v[k]; c.g = true; return c; }
function bin(v, w, f) { var g = v.g || w.g, r = f(v, w); return g ? G(r) : r; }
function pExpr() {
  var v = pTerm();
  for (;;) { var t = pk(); if (t === '+' || t === '−') { P.p++; var w = pTerm(); v = bin(v, w, t === '+' ? add : sub); } else return v; }
}
function pTerm() {
  var v = pPerm();
  for (;;) { var t = pk(); if (t === '×' || t === '÷') { P.p++; var w = pPerm(); v = bin(v, w, t === '×' ? mul : div); } else return v; }
}
function pPerm() {
  var v = pImp();
  for (;;) { var t = pk(); if (t === 'nPr' || t === 'nCr') { P.p++; var w = pImp(); v = vperm(v, w, t === 'nCr'); } else return v; }
}
function pImp() {
  var v = pEst();
  while (startsOperand(pk())) { var w = pEst(); v = bin(v, w, mul); }
  return v;
}
function pEst() {
  var v = pNeg();
  while (EST[pk()]) { var t = pk(); P.p++; v = statEst(t, v); }
  return v;
}
function pNeg() {
  if (pk() === 'neg') { P.p++; var v = pNeg(), r = neg(v); return v.g ? G(r) : r; }
  return pLfrac();
}
function pLfrac() {
  var v = pPost();
  if (pk() === '⌟') {
    P.frac = true; P.p++; var w = pPost();
    if (pk() === '⌟') { P.p++; var z = pPost(); var fr = div(w, z); v = sgn(v) < 0 ? sub(v, fr) : add(v, fr); }
    else v = div(v, w);
  }
  return v;
}
function pPost() {
  var v = pAtom(), e;
  for (;;) {
    var t = pk(); if (!POSTFIX[t]) return v;
    P.p++;
    switch (t) {
      case '²': v = pow(v, Rat(2)); break;
      case '³': v = pow(v, Rat(3)); break;
      case '⁻¹': v = inv(v); break;
      case '!': v = vfact(v); break;
      case '%': v = div(v, Rat(100)); break;
      case '°a': v = angConv(v, 'deg'); break;
      case 'ʳ': v = angConv(v, 'rad'); break;
      case 'ᵍ': v = angConv(v, 'gra'); break;
      case '^[': deeper(); e = pSlot(']'); P.depth--; v = pow(v, e); break;
      case '^(': deeper(); e = pExpr(); closeP(); v = pow(v, e); break;
      case 'ˣ√(': deeper(); e = pExpr(); closeP(); v = nthRoot(e, v); break;
    }
  }
}
function deeper() { if (++P.depth > 24) throw new CErr(E_STACK); }
function closeP() {
  P.depth--;
  var t = pk(); if (t === ')') { P.p++; return; }
  if (t === undefined || t === ':' || t === ']' || t === '|') return;
  serr();
}
function pSlot(end) { var v = pExpr(); if (pk() !== end) serr(); P.p++; return v; }
function pArgs(n) {
  var a = [pExpr()]; while (pk() === ',') { P.p++; a.push(pExpr()); }
  closeP(); if (a.length !== n) serr(); return a;
}
function sqrtV(v) { if (isRatV(v)) { var q = ratOf(v); if (q[0] < 0n) merr(); var s = sqrtQ(q[0], q[1]); if (s) return s; } var x = toF(v); if (x < 0) merr(); return F(Math.sqrt(x)); }
function pNum() {
  var s = '', dot = false, any = false, rep = null;
  for (;;) {
    var t = pk();
    if (isDigitT(t)) { s += t; any = true; }
    else if (t === '.') { if (dot) serr(); dot = true; s += '.'; }
    else break;
    P.p++;
  }
  if (pk() === 'RD[') { // recurring period template
    if (!dot) serr(); P.p++; rep = '';
    while (isDigitT(pk())) { rep += pk(); P.p++; }
    if (pk() !== ']' || !rep) serr(); P.p++;
  }
  var v;
  if (s === '') v = Rat(1);
  else {
    if (!any && !rep) serr();
    if (dot) P.dec = true;
    if (rep !== null) {
      var k = s.indexOf('.'), ip = s.slice(0, k) || '0', nonrep = s.slice(k + 1);
      var a = BigInt(nonrep.length), r = BigInt(rep.length);
      v = add(mkX([[BigInt(ip + nonrep), 10n ** a, 1n]]), mkX([[BigInt(rep), (10n ** r - 1n) * 10n ** a, 1n]]));
    } else v = decToRat(s);
  }
  var t2 = pk();
  if (t2 === 'E[') { P.p++; deeper(); var e = pSlot(']'); P.depth--; var ei = intOf(e); if (ei === null) merr(); v = mul(v, vten(e)); }
  else if (t2 === 'E') {
    P.p++; var sg = 1n, ds = '';
    if (pk() === 'neg' || pk() === '−') { P.p++; sg = -1n; }
    while (isDigitT(pk())) { ds += pk(); P.p++; }
    if (!ds) serr(); v = mul(v, vten(Rat(sg * BigInt(ds))));
  } else if (s === '') serr();
  if (pk() === 'DMS') {
    P.p++; var tot = v, parts = 1;
    while (parts < 3 && (isDigitT(pk()) || pk() === '.')) {
      var s2 = ''; while (isDigitT(pk()) || pk() === '.') { s2 += pk(); P.p++; }
      if (s2 === '.' || s2.split('.').length > 2) serr();
      var w = decToRat(s2); tot = add(tot, div(w, Rat(parts === 1 ? 60 : 3600))); parts++;
      if (pk() === 'DMS') P.p++; else break;
    }
    v = G(tot);
  }
  return v;
}
function pAtom() {
  var t = pk();
  if (t === undefined) serr();
  if (isDigitT(t) || t === '.' || t === 'E[' || t === 'E') return pNum();
  P.p++;
  var a, b, c, v;
  if (t === '(') { deeper(); v = pExpr(); closeP(); return v; }
  if (t === 'π') return mkP(1, 1);
  if (t === 'e') return F(Math.E);
  if (t === 'Ans') return S.ans;
  if (t === 'Ran#') return Rat(Math.floor(Math.random() * 1000), 1000);
  if (VARN[t]) return VARS[t];
  if (isStatTok(t)) return statVal(t);
  if (SLOTS[t]) {
    deeper(); var r;
    switch (t) {
      case 'F[': a = pSlot('|'); b = pSlot(']'); P.frac = true; r = div(a, b); break;
      case 'X[': a = pSlot('|'); b = pSlot('|'); c = pSlot(']'); P.frac = true; var fr = div(b, c); r = sgn(a) < 0 ? sub(a, fr) : add(a, fr); break;
      case '√[': r = sqrtV(pSlot(']')); break;
      case '∛[': r = nthRoot(pSlot(']'), Rat(3)); break;
      case 'R[': a = pSlot('|'); b = pSlot(']'); r = nthRoot(b, a); break;
      case 'L[': a = pSlot('|'); b = pSlot(']'); r = vlogab(a, b); break;
      case 'A[': r = vabs(pSlot(']')); break;
      case 'TEN[': r = vten(pSlot(']')); break;
      case 'EXP[': r = vexp(pSlot(']')); break;
      default: serr();
    }
    P.depth--; return r;
  }
  if (FUN1[t]) {
    deeper();
    if (t === 'Pol(' || t === 'Rec(' || t === 'RanInt#(') {
      var g = pArgs(2);
      if (t === 'RanInt#(') {
        var lo = intOf(g[0]), hi = intOf(g[1]);
        if (lo === null || hi === null || lo >= hi || babs(lo) >= 10n ** 10n || babs(hi) >= 10n ** 10n) merr();
        return Rat(lo + BigInt(Math.floor(Math.random() * Number(hi - lo + 1n))));
      }
      var pr = t === 'Pol(' ? vPol(g[0], g[1]) : vRec(g[0], g[1]);
      VARS.x = pr[0]; VARS.y = pr[1];
      P.pair = { v: pr, end: P.p, kind: t };
      return pr[0];
    }
    if (t === 'log(' && !isMathIn()) {
      var la = [pExpr()]; if (pk() === ',') { P.p++; la.push(pExpr()); } closeP();
      return la.length === 2 ? vlogab(la[0], la[1]) : vlog10(la[0]);
    }
    if (t === 'log(') { var lv = [pExpr()]; if (pk() === ',') { P.p++; lv.push(pExpr()); } closeP(); return lv.length === 2 ? vlogab(lv[0], lv[1]) : vlog10(lv[0]); }
    a = pExpr(); closeP();
    switch (t) {
      case 'sin(': return vsin(a); case 'cos(': return vcos(a); case 'tan(': return vtan(a);
      case 'sin⁻¹(': return vasin(a); case 'cos⁻¹(': return vacos(a); case 'tan⁻¹(': return vatan(a);
      case 'sinh(': case 'cosh(': case 'tanh(': case 'sinh⁻¹(': case 'cosh⁻¹(': case 'tanh⁻¹(': return hyp(t.slice(0, -1), a);
      case 'ln(': return vln(a);
      case 'Abs(': return vabs(a);
      case 'Rnd(': return rndValue(a);
      case '√(': return sqrtV(a);
      case '³√(': return nthRoot(a, Rat(3));
      case '10^(': return vten(a);
      case 'e^(': return vexp(a);
    }
  }
  P.p--; serr();
}
/* split a token list into statements at top-level ':' */
function splitStmts(toks) {
  var out = [], st = 0, d = 0;
  for (var i = 0; i < toks.length; i++) {
    var t = toks[i]; if (SLOTS[t]) d++; else if (t === ']') d--;
    else if (t === ':' && d === 0) { out.push([st, i]); st = i + 1; }
  }
  out.push([st, toks.length]); return out;
}
/* evaluate tokens [s,e) ; returns {v, pair, frac, dec, g} ; throws CErr with .pos */
function evalRange(toks, s, e) {
  var saved = P;
  P = { t: toks, p: s, e: e, frac: false, dec: false, depth: 0, pair: null };
  try {
    if (s >= e) serr();
    var v = pExpr();
    if (P.p < e) { if (toks[P.p] === ')') serr(); serr(); }
    var res = { v: v, frac: P.frac, dec: P.dec, g: !!v.g, pair: null };
    if (P.pair && (toks[s] === 'Pol(' || toks[s] === 'Rec(') && P.pair.end === e) res.pair = P.pair;
    return res;
  } catch (ex) {
    if (ex instanceof CErr && ex.pos === undefined) ex.pos = Math.min(P.p, e);
    throw ex;
  } finally { P = saved; }
}
function evalSimple(toks) { return evalRange(toks, 0, toks.length).v; }

/* ======================================================================
   4. EXPRESSION EDITOR (cursor movement, insert, delete) + RENDERING
   ====================================================================== */
var STATN = { // statistics command tokens -> display
  '§n': 'n', '§x̄': 'x̄', '§ȳ': 'ȳ', '§Σx': 'Σx', '§Σx²': 'Σx<span class="czsup">2</span>', '§Σy': 'Σy', '§Σy²': 'Σy<span class="czsup">2</span>',
  '§Σxy': 'Σxy', '§Σx³': 'Σx<span class="czsup">3</span>', '§Σx²y': 'Σx<span class="czsup">2</span>y', '§Σx⁴': 'Σx<span class="czsup">4</span>',
  '§σ²x': 'σ<span class="czsup">2</span>x', '§σx': 'σx', '§s²x': 's<span class="czsup">2</span>x', '§sx': 'sx',
  '§σ²y': 'σ<span class="czsup">2</span>y', '§σy': 'σy', '§s²y': 's<span class="czsup">2</span>y', '§sy': 'sy',
  '§min(x)': 'min(x)', '§max(x)': 'max(x)', '§min(y)': 'min(y)', '§max(y)': 'max(y)', '§Q₁': 'Q<span class="czsb">1</span>', '§Med': 'Med', '§Q₃': 'Q<span class="czsb">3</span>',
  '§a': 'a', '§b': 'b', '§c': 'c', '§r': 'r'
};
function sup(s) { return '<span class="czsup">' + s + '</span>'; }
var TXT = {
  '−': '−', '×': '×', '÷': '÷', '²': sup('2'), '³': sup('3'), '⁻¹': sup('-1'), 'DMS': '°', '°a': '°', 'ʳ': sup('r'), 'ᵍ': sup('g'),
  'nPr': '<span class="czpc">P</span>', 'nCr': '<span class="czpc">C</span>', 'neg': '<span class="czng">-</span>',
  'π': '<i class="czpi">π</i>', 'e': '<i class="cze">e</i>', 'x': '<i class="czv">x</i>', 'y': '<i class="czv">y</i>',
  'sin⁻¹(': 'sin' + sup('-1') + '(', 'cos⁻¹(': 'cos' + sup('-1') + '(', 'tan⁻¹(': 'tan' + sup('-1') + '(',
  'sinh⁻¹(': 'sinh' + sup('-1') + '(', 'cosh⁻¹(': 'cosh' + sup('-1') + '(', 'tanh⁻¹(': 'tanh' + sup('-1') + '(',
  '³√(': sup('3') + '√(', 'ˣ√(': sup('x') + '√(', 'e^(': '<i class="cze">e</i>^(', 'E': '<span class="czx10">×10</span>',
  '⌟': '<span class="czfl"></span>', 'STO': '→', 'M+': 'M+', 'M−': 'M−', '§x̂': 'x̂', 'x̂': 'x̂', 'ŷ': 'ŷ', 'x̂₁': 'x̂<span class="czsb">1</span>', 'x̂₂': 'x̂<span class="czsb">2</span>',
  '&': '&amp;', '<': '&lt;'
};
for (var _k in STATN) TXT[_k] = STATN[_k];
function tokText(t) { return TXT[t] !== undefined ? TXT[t] : esc(t); }
/* --- structure helpers on a token array --- */
function tplEnd(toks, st) { var d = 0; for (var j = st; j < toks.length; j++) { var t = toks[j]; if (SLOTS[t]) d++; else if (t === ']') { d--; if (d === 0) return j; } } return -1; }
function tplStart(toks, i) { var d = 0; for (var j = i; j >= 0; j--) { var t = toks[j]; if (t === ']') d++; else if (SLOTS[t]) { if (d === 0) return j; d--; } } return -1; }
function tplSeps(toks, st) { var out = [], d = 0, en = tplEnd(toks, st); for (var j = st + 1; j < en; j++) { var t = toks[j]; if (SLOTS[t]) d++; else if (t === ']') d--; else if (t === '|' && d === 0) out.push(j); } return out; }
/* stack of enclosing templates for cursor c: [{st, slot}] innermost last */
function frames(toks, c) {
  var st = [];
  for (var i = 0; i < c; i++) { var t = toks[i]; if (SLOTS[t]) st.push({ st: i, slot: 0 }); else if (t === '|' && st.length) st[st.length - 1].slot++; else if (t === ']') st.pop(); }
  return st;
}
function slotBounds(toks, st, k) { // [from, to) token range of slot k of template at st
  var seps = tplSeps(toks, st), en = tplEnd(toks, st);
  var a = k === 0 ? st + 1 : seps[k - 1] + 1, b = k < seps.length ? seps[k] : en; return [a, b];
}
/* --- rendering (natural display) --- */
var CURH = '<span class="czcur"></span>';
function recurMarks(toks) { // indices of digits that need a dot above
  var m = {};
  for (var i = 0; i < toks.length; i++) if (toks[i] === 'RD[') { var j = i + 1, d = []; while (j < toks.length && toks[j] !== ']') { if (isDigitT(toks[j])) d.push(j); j++; } if (d.length) { m[d[0]] = 1; m[d[d.length - 1]] = 1; } }
  return m;
}
function renderToks(toks, cur, curCls) {
  var i = 0, marks = recurMarks(toks), C = '<span class="czcur ' + (curCls || '') + '"></span>';
  function seq() {
    var h = '', n = 0;
    while (i < toks.length) { var t = toks[i]; if (t === '|' || t === ']') break; if (i === cur) h += C; h += node(); n++; }
    if (i === cur) h += C;
    return { h: h, n: n };
  }
  function slot() {
    var r = seq(); if (toks[i] === '|' || toks[i] === ']') i++;
    if (r.n === 0) return '<span class="czbx">' + r.h + '</span>';
    return r.h;
  }
  function node() {
    var t = toks[i++], a, b, c;
    switch (t) {
      case 'F[': a = slot(); b = slot(); return hFrac(a, b);
      case 'X[': a = slot(); b = slot(); c = slot(); return '<span class="czmx">' + a + '</span>' + hFrac(b, c);
      case '√[': return hRoot(slot());
      case '∛[': return hRoot(slot(), '3');
      case 'R[': a = slot(); b = slot(); return hRoot(b, a);
      case '^[': return '<span class="czsup czsupt">' + slot() + '</span>';
      case 'L[': a = slot(); b = slot(); return 'log<span class="czsub">' + a + '</span>(' + b + ')';
      case 'A[': return '<span class="czab">' + slot() + '</span>';
      case 'E[': return '<span class="czx10">×10</span><span class="czsup czsupt">' + slot() + '</span>';
      case 'TEN[': return '10<span class="czsup czsupt">' + slot() + '</span>';
      case 'EXP[': return '<i class="cze">e</i><span class="czsup czsupt">' + slot() + '</span>';
      case 'RD[': return toks[i] === ']' ? (i === cur ? '<span class="czbx czdotb">' + C + '</span>' : '<span class="czbx czdotb"></span>') + (i++, '') : slot();
    }
    if (marks[i - 1]) return '<span class="czdot">' + t + '</span>';
    return tokText(t);
  }
  var out = '';
  while (i < toks.length) { var r = seq(); out += r.h; if (i < toks.length) { out += tokText(toks[i]); i++; } }
  if (!toks.length && cur === 0) out = C;
  return out;
}
/* --- editor operations; E = {toks, cur} --- */
function edInsert(E, arr, back, ovw) {
  if (ovw && arr.length === 1 && E.cur < E.toks.length && !SLOTS[E.toks[E.cur]] && E.toks[E.cur] !== '|' && E.toks[E.cur] !== ']') { E.toks[E.cur] = arr[0]; E.cur++; return; }
  E.toks.splice.apply(E.toks, [E.cur, 0].concat(arr)); E.cur += arr.length - (back || 0);
}
function edFrac(E) { // natural-display fraction: a number just typed becomes the numerator
  var j = E.cur, T = E.toks;
  while (j > 0 && (isDigitT(T[j - 1]) || T[j - 1] === '.')) j--;
  if (j === E.cur && E.cur > 0 && (T[E.cur - 1] === 'Ans' || T[E.cur - 1] === 'π' || VARN[T[E.cur - 1]])) j = E.cur - 1;
  if (j < E.cur) { var num = T.slice(j, E.cur); T.splice.apply(T, [j, E.cur - j, 'F['].concat(num, ['|', ']'])); E.cur = j + num.length + 2; }
  else edInsert(E, ['F[', '|', ']'], 2);
}
function edDel(E, ovw) {
  var T = E.toks;
  if (ovw) { if (E.cur < T.length) T.splice(E.cur, 1); else if (E.cur > 0) { T.splice(E.cur - 1, 1); E.cur--; } return; }
  if (E.cur === 0) return;
  var t = T[E.cur - 1];
  if (t === ']') { E.cur--; edDel(E); return; }
  if (SLOTS[t] || t === '|') {
    var st = SLOTS[t] ? E.cur - 1 : tplStart(T, E.cur - 2), en = tplEnd(T, st), seps = tplSeps(T, st);
    var rm = [st].concat(seps, [en]), before = 0;
    rm.forEach(function (k) { if (k < E.cur) before++; });
    for (var q = rm.length - 1; q >= 0; q--) T.splice(rm[q], 1);
    E.cur -= before; return;
  }
  T.splice(E.cur - 1, 1); E.cur--;
}
function edLeft(E) { if (E.cur > 0) E.cur--; else E.cur = E.toks.length; }
function edRight(E) { if (E.cur < E.toks.length) E.cur++; else E.cur = 0; }
function edUpDown(E, dir) { // move between numerator and denominator
  var fr = frames(E.toks, E.cur);
  for (var k = fr.length - 1; k >= 0; k--) {
    var f = fr[k], t = E.toks[f.st], target = -1;
    if (t === 'F[') target = dir > 0 ? (f.slot === 0 ? 1 : -1) : (f.slot === 1 ? 0 : -1);
    else if (t === 'X[') target = dir > 0 ? (f.slot === 1 ? 2 : -1) : (f.slot === 2 ? 1 : -1);
    if (target >= 0) { E.cur = slotBounds(E.toks, f.st, target)[1]; return true; }
  }
  return false;
}
function edJump(E, dir) { // SHIFT + left/right: jump out of the current template
  var fr = frames(E.toks, E.cur); if (!fr.length) return;
  var f = fr[fr.length - 1]; E.cur = dir > 0 ? tplEnd(E.toks, f.st) + 1 : f.st;
}
/* extent of the item that starts at cursor (for INS = incorporate) */
function itemAt(T, c) {
  var t = T[c]; if (t === undefined) return 0;
  if (isDigitT(t) || t === '.') { var j = c; while (isDigitT(T[j]) || T[j] === '.') j++; if (T[j] === 'RD[') j = tplEnd(T, j) + 1; return j - c; }
  if (SLOTS[t]) return tplEnd(T, c) - c + 1;
  if (t === '(' || FUN1[t]) { var d = 0; for (var k = c; k < T.length; k++) { var u = T[k]; if (u === '(' || FUN1[u]) d++; else if (u === ')') { d--; if (d === 0) return k - c + 1; } } return T.length - c; }
  if (VARN[t] || t === 'π' || t === 'e' || t === 'Ans') return 1;
  return 0;
}
function edIncorporate(E, tpl) { // tpl like ['√[',']'] or ['F[','|',']']; the item after the cursor goes into
  var n = itemAt(E.toks, E.cur); if (!n) return false;           // the numerator (fraction) or the last slot
  var item = E.toks.splice(E.cur, n), st = E.cur, arr, pos;
  if (tpl[0] === 'F[') { arr = ['F['].concat(item, ['|', ']']); pos = st + item.length + 2; }
  else { arr = tpl.slice(0, tpl.length - 1).concat(item, [']']); pos = st + arr.length; }
  E.toks.splice.apply(E.toks, [st, 0].concat(arr));
  E.cur = pos; return true;
}

/* ======================================================================
   5. STATE + CALCULATE-SCREEN CONTROLLER
   ====================================================================== */
function freshVars() { return { A: ZERO, B: ZERO, C: ZERO, D: ZERO, E: ZERO, F: ZERO, M: ZERO, x: ZERO, y: ZERO }; }
var VARS = freshVars();
var S = {
  on: true, mode: 'calc', scr: 'calc', shift: false, alpha: false, sto: false,
  ed: { toks: [], cur: 0 }, st: 'edit', R: null, err: null, last: null,
  ans: ZERO, hist: [], hi: -1, ovw: false, inc: false, undo: null,
  menu: null, mm: 0, cin: null, msg: null, slist: null
};
/* the calculation screen of Statistics mode always uses linear input/output */
function lineIn() { return S.mode === 'stat' || !isMathIn(); }
/* tokens produced by an input action: [array, cursorBack] or null */
function tokFor(a, line) {
  var M = !line;
  switch (a) {
    case 'mixed': return M ? [['X[', '|', '|', ']'], 3] : [['⌟'], 0];
    case 'frac': return M ? null : [['⌟'], 0];
    case 'sqrt': return M ? [['√[', ']'], 1] : [['√('], 0];
    case 'cbrt': return M ? [['∛[', ']'], 1] : [['³√('], 0];
    case 'pow': return M ? [['^[', ']'], 1] : [['^('], 0];
    case 'root': return M ? [['R[', '|', ']'], 2] : [['ˣ√('], 0];
    case 'logab': return M ? [['L[', '|', ']'], 2] : [['log('], 0];
    case 'abs': return M ? [['A[', ']'], 1] : [['Abs('], 0];
    case 'ten': return M ? [['TEN[', ']'], 1] : [['10^('], 0];
    case 'epow': return M ? [['EXP[', ']'], 1] : [['e^('], 0];
    case 'exp10': return M ? [['E[', ']'], 1] : [['E'], 0];
    case 'recur': return M ? [['RD[', ']'], 1] : null;
  }
  var simple = {
    add: '+', sub: '−', mul: '×', div: '÷', npr: 'nPr', ncr: 'nCr', neg: 'neg', dot: '.', sq: '²', cube: '³', inv: '⁻¹', fct: '!', pct: '%',
    lp: '(', rp: ')', comma: ',', colon: ':', pi: 'π', econst: 'e', ans: 'Ans', ran: 'Ran#', ranint: 'RanInt#(', rnd: 'Rnd(', pol: 'Pol(', rec: 'Rec(',
    log: 'log(', ln: 'ln(', sin: 'sin(', cos: 'cos(', tan: 'tan(', asin: 'sin⁻¹(', acos: 'cos⁻¹(', atan: 'tan⁻¹(', dmsmark: 'DMS'
  };
  if (simple[a]) return [[simple[a]], 0];
  if (/^d\d$/.test(a)) return [[a.charAt(1)], 0];
  if (/^v:/.test(a)) return [[a.slice(2)], 0];
  if (/^t:/.test(a)) return [[a.slice(2)], 0];
  return null;
}
var AUTOANS = { '+': 1, '−': 1, '×': 1, '÷': 1, 'nPr': 1, 'nCr': 1, '²': 1, '³': 1, '⁻¹': 1, '!': 1, '%': 1, '^[': 1, '^(': 1, 'ˣ√(': 1, '°a': 1, 'ʳ': 1, 'ᵍ': 1, 'x̂': 1, 'ŷ': 1, 'x̂₁': 1, 'x̂₂': 1, '⌟': 1 };
var TPLKEY = { sqrt: 1, cbrt: 1, pow: 1, root: 1, logab: 1, abs: 1, ten: 1, epow: 1, frac: 1, mixed: 1 };
function snapUndo() { S.undo = { toks: S.ed.toks.slice(), cur: S.ed.cur, st: S.st, R: S.R }; }
function clearCalc() { S.ed = { toks: [], cur: 0 }; S.st = 'edit'; S.R = null; S.inc = false; }
/* begin a new expression after a result (or keep editing) */
function beginInput(firstTok) {
  if (S.st === 'result') {
    S.last = S.R.toks.slice();
    S.ed = { toks: AUTOANS[firstTok] ? ['Ans'] : [], cur: 0 }; S.ed.cur = S.ed.toks.length;
    S.st = 'edit'; S.R = null;
  }
}
function calcInsert(a) {
  var line = lineIn(), E;
  if (a === 'frac' && !line) {
    snapUndo();
    if (S.st === 'result') beginInput('F[');
    E = S.ed;
    if (S.inc) { S.inc = false; if (edIncorporate(E, ['F[', '|', ']'])) return; }
    edFrac(E); return;
  }
  var tk = tokFor(a, line); if (!tk) return;
  snapUndo(); beginInput(tk[0][0]); E = S.ed;
  if (S.inc) { S.inc = false; if (!line && TPLKEY[a] && edIncorporate(E, tk[0])) return; }
  edInsert(E, tk[0], tk[1], S.ovw && line);
}
/* ----- results ----- */
function viewsFor(r, approx) {
  var v = r.v, io = S.mode === 'stat' ? 'LL' : SET.io, ex = null, rv = v, rat = null;
  if (v.k === 'f') { var g = recog(v.v); if (g) rv = g; }
  if (io === 'MM' || io === 'MD') ex = exactDesc(rv, false);
  else if (isRatV(rv)) ex = exactDesc(rv, false);
  if (ex && ex.t === 'int') ex = null;
  if (isRatV(rv) && SET.rec && recurDesc(rv)) rat = 'rec';
  var vs;
  if (!ex) vs = ['dec'];
  else if (io === 'MM') vs = rat ? ['exact', 'rec', 'dec'] : ['exact', 'dec'];
  else if (io === 'MD' || io === 'LD') vs = rat ? ['dec', 'exact', 'rec'] : ['dec', 'exact'];
  else vs = (r.frac && !r.dec) ? (rat ? ['exact', 'rec', 'dec'] : ['exact', 'dec']) : (rat ? ['dec', 'exact', 'rec'] : ['dec', 'exact']);
  var vi = 0; if (approx) { vi = vs.indexOf('dec'); }
  return { rv: rv, views: vs, vi: vi };
}
function mkCur(r, approx) {
  var vw = viewsFor(r, approx);
  return { v: r.v, pair: r.pair, g: r.g && !r.pair, rv: vw.rv, views: vw.views, vi: vw.vi, mixT: false, eng: null, dmsV: r.g && !r.pair, factV: false };
}
function doError(ex, toks, from) {
  if (!(ex instanceof CErr)) throw ex;
  S.err = { m: ex.m, pos: ex.pos === undefined ? toks.length : ex.pos, from: from || 'calc' };
  S.scr = 'error';
}
function runStmt(R) {
  var sp = R.stmts[R.mi];
  var r = evalRange(R.etoks, sp[0], sp[1]);
  S.ans = r.v;
  R.cur = mkCur(r, R.approx);
  if (R.post) {
    if (R.post.k === 'sto') VARS[R.post.v] = r.v;
    else if (R.post.k === 'm+') VARS.M = add(VARS.M, r.v);
    else if (R.post.k === 'm-') VARS.M = sub(VARS.M, r.v);
  }
}
function execute(toks, approx, post) {
  var etoks = toks.slice();
  var R = { toks: toks.slice(), etoks: etoks, stmts: splitStmts(etoks), mi: 0, approx: !!approx, post: post || null };
  if (post) R.toks = toks.concat(post.k === 'sto' ? ['STO', post.v] : post.k === 'm+' ? ['M+'] : ['M−']);
  try { runStmt(R); }
  catch (ex) { S.ed = { toks: toks.slice(), cur: toks.length }; S.st = 'edit'; doError(ex, toks, 'calc'); return false; }
  S.R = R; S.st = 'result'; S.last = R.toks.slice();
  if (S.mode === 'calc') { S.hist.push(R); if (S.hist.length > 40) S.hist.shift(); S.hi = S.hist.length - 1; }
  return true;
}
function doEq(approx) {
  if (S.st === 'result') {
    var R = S.R;
    if (R.mi < R.stmts.length - 1) {
      R.mi++;
      try { runStmt(R); } catch (ex) { S.ed = { toks: R.etoks.slice(), cur: R.etoks.length }; S.st = 'edit'; doError(ex, R.etoks, 'calc'); }
      return;
    }
    execute(R.etoks, approx, R.post); return;
  }
  if (!S.ed.toks.length) return;
  execute(S.ed.toks, approx, null);
}
function stmtToks(R) { // tokens of the statement currently shown (multi-statements show one at a time)
  if (R.stmts.length === 1) return R.toks;
  var sp = R.stmts[R.mi]; return R.etoks.slice(sp[0], sp[1]);
}
function editFromResult(atEnd) {
  var R = S.R; S.ed = { toks: R.etoks.slice(), cur: atEnd ? R.etoks.length : 0 }; S.st = 'edit'; S.R = null;
}
function storeTo(vn) {
  var toks = S.st === 'result' ? ['Ans'] : S.ed.toks.slice();
  if (!toks.length) toks = ['Ans'];
  if (S.st === 'result' && S.R && S.R.stmts.length === 1 && !S.R.post) toks = S.R.etoks.slice();
  execute(toks, false, { k: 'sto', v: vn });
}
function memPlus(minus) {
  var toks = S.st === 'result' ? ['Ans'] : S.ed.toks.slice(); if (!toks.length) toks = ['Ans'];
  if (S.st === 'result' && S.R && S.R.stmts.length === 1 && !S.R.post) toks = S.R.etoks.slice();
  execute(toks, false, { k: minus ? 'm-' : 'm+' });
}
function histShow(i) { S.hi = i; S.R = S.hist[i]; S.R.mi = S.R.stmts.length - 1; S.st = 'result'; }
function calcKey(a) {
  var line = lineIn(), E = S.ed, C = S.R && S.R.cur;
  if (tokFor(a, line) || (a === 'frac')) { calcInsert(a); return; }
  switch (a) {
    case 'eq': S.inc = false; doEq(false); return;
    case 'approx': S.inc = false; doEq(true); return;
    case 'ac': if (S.st === 'result') S.last = S.R.toks.slice(); clearCalc(); S.hi = S.hist.length; return;
    case 'del':
      if (S.st === 'result') { editFromResult(true); return; }
      snapUndo(); edDel(E, S.ovw && line); return;
    case 'ins': if (line) S.ovw = !S.ovw; else if (S.st === 'edit') S.inc = !S.inc; return;
    case 'undo':
      if (S.undo) { var u = S.undo; snapUndo(); S.ed = { toks: u.toks, cur: u.cur }; S.st = u.st === 'result' && u.R ? 'result' : 'edit'; S.R = S.st === 'result' ? u.R : null; }
      return;
    case 'left': case 'right':
      if (S.st === 'result') { editFromResult(a === 'left'); return; }
      if (!E.toks.length && S.last) { S.ed = { toks: S.last.filter(function (t, i, arr) { return !(t === 'STO' || t === 'M+' || t === 'M−' || (i > 0 && arr[i - 1] === 'STO')); }), cur: 0 }; if (a === 'left') S.ed.cur = S.ed.toks.length; return; }
      if (a === 'left') edLeft(E); else edRight(E); return;
    case 'jl': case 'jr': if (S.st === 'edit') edJump(E, a === 'jr' ? 1 : -1); return;
    case 'up': case 'down':
      if (S.st === 'result') {
        if (S.mode !== 'calc') return;
        if (a === 'up' && S.hi > 0) histShow(S.hi - 1);
        else if (a === 'down' && S.hi < S.hist.length - 1) histShow(S.hi + 1);
        return;
      }
      if (!line && edUpDown(E, a === 'down' ? 1 : -1)) return;
      if (!E.toks.length && S.hist.length && a === 'up' && S.mode === 'calc') histShow(S.hist.length - 1);
      return;
    case 'sd':
      if (S.st === 'result' && C && !C.pair && C.views.length > 1) { C.vi = (C.vi + 1) % C.views.length; C.eng = null; C.factV = false; C.dmsV = false; }
      else if (S.st === 'result' && C && C.dmsV) { C.dmsV = false; }
      return;
    case 'mixtog': if (S.st === 'result' && C) C.mixT = !C.mixT; return;
    case 'eng': case 'engl':
      if (S.st !== 'result' || !C || C.pair) return;
      var x = toF(C.v); if (x === 0) { C.eng = C.eng === null ? 0 : C.eng; return; }
      var E0 = Math.floor(Math.log10(Math.abs(x)) / 3) * 3;
      if (C.eng === null) C.eng = a === 'eng' ? E0 : E0 + 3; else C.eng += a === 'eng' ? -3 : 3;
      if (!hEng(x, C.eng)) C.eng += a === 'eng' ? 3 : -3;
      C.factV = false; C.dmsV = false; return;
    case 'dms':
      if (S.st === 'result') { if (C && !C.pair) { C.dmsV = !C.dmsV; C.eng = null; C.factV = false; } return; }
      calcInsert('dmsmark'); return;
    case 'fact':
      if (S.st === 'result' && C && !C.pair) { if (C.factV) C.factV = false; else if (factDesc(C.v)) { C.factV = true; C.eng = null; C.dmsV = false; } }
      return;
    case 'sto': S.sto = true; return;
    case 'rcl': S.scr = 'recall'; return;
    case 'mplus': case 'mminus': memPlus(a === 'mminus'); return;
  }
}

/* ======================================================================
   6. MENUS, SETUP, RESET, RECALL, STATISTICS, TABLE, RATIO
   ====================================================================== */
function mkMenu(pages, o) { o = o || {}; return { pages: pages, cols: o.cols || 1, page: 0, noClose: !!o.noClose, title: o.title || null }; }
function it(label, act) { return { label: label, act: act }; }
function openMenu(m, asSub) {
  if (asSub && S.menu && S.scr === 'menu') { m.parent = S.menu; m.ret = S.menu.ret; }
  else { m.parent = null; m.ret = S.scr === 'menu' && S.menu ? S.menu.ret : S.scr; }
  S.menu = m; S.scr = 'menu';
}
function closeMenus() { var r = S.menu ? S.menu.ret : 'calc'; S.menu = null; S.scr = r; }
function menuKey(a) {
  var m = S.menu;
  if (a === 'ac') { if (!m.noClose) closeMenus(); return; }
  if (a === 'left' && m.parent) { S.menu = m.parent; return; }
  if (a === 'up' || a === 'down') { if (m.pages.length > 1) m.page = (m.page + (a === 'down' ? 1 : m.pages.length - 1)) % m.pages.length; return; }
  var d = /^d(\d)$/.exec(a); if (d) { var x = m.pages[m.page][+d[1] - 1]; if (x) x.act(); }
}
/* insert a token into whatever editor the menu was opened from */
function insertTok(t) {
  closeMenus(); handle('t:' + t);
}
/* ---------- SETUP ---------- */
function setAndClose(fn) { return function () { fn(); S.menu = null; S.scr = S.setRet || 'calc'; }; }
function setIO(io) {
  if (SET.io !== io) { SET.io = io; S.hist = []; S.hi = -1; clearCalc(); S.last = null; TB.f = { toks: [], cur: 0 }; TB.g = { toks: [], cur: 0 }; }
  S.ovw = false;
}
function openSetup() {
  if (S.scr !== 'menu') S.setRet = S.scr; else S.setRet = S.menu.ret;
  if (S.setRet === 'menu' || S.setRet === 'mainmenu' || S.setRet === 'error' || S.setRet === 'confirm' || S.setRet === 'msg' || S.setRet === 'fmtsel' || S.setRet === 'contrast') S.setRet = modeHome();
  var sub = function (items) { return function () { openMenu(mkMenu([items]), true); }; };
  var m = mkMenu([
    [it('Input/Output', sub([it('MathI/MathO', setAndClose(function () { setIO('MM'); })), it('MathI/DecimalO', setAndClose(function () { setIO('MD'); })), it('LineI/LineO', setAndClose(function () { setIO('LL'); })), it('LineI/DecimalO', setAndClose(function () { setIO('LD'); }))])),
     it('Angle Unit', sub([it('Degree', setAndClose(function () { SET.angle = 'deg'; })), it('Radian', setAndClose(function () { SET.angle = 'rad'; })), it('Gradian', setAndClose(function () { SET.angle = 'gra'; }))])),
     it('Number Format', sub([it('Fix', function () { S.fmtsel = 'fix'; S.scr = 'fmtsel'; }), it('Sci', function () { S.fmtsel = 'sci'; S.scr = 'fmtsel'; }), it('Norm', function () { S.fmtsel = 'norm'; S.scr = 'fmtsel'; })])),
     it('Fraction Result', sub([it('ab/c', setAndClose(function () { SET.frac = 'abc'; })), it('d/c', setAndClose(function () { SET.frac = 'dc'; }))]))],
    [it('Statistics', sub([it('On', setAndClose(function () { if (!SET.freq) { SET.freq = true; ST.rows = []; } })), it('Off', setAndClose(function () { if (SET.freq) { SET.freq = false; ST.rows = []; } }))])),
     it('Table', sub([it('f(x)', setAndClose(function () { SET.table = 'f'; })), it('f(x),g(x)', setAndClose(function () { SET.table = 'fg'; }))])),
     it('Recurring Dec', sub([it('On', setAndClose(function () { SET.rec = true; })), it('Off', setAndClose(function () { SET.rec = false; }))])),
     it('Decimal Mark', sub([it('Dot', setAndClose(function () { SET.mark = 'dot'; })), it('Comma', setAndClose(function () { SET.mark = 'comma'; }))]))],
    [it('Digit Separator', sub([it('On', setAndClose(function () { SET.sep = true; })), it('Off', setAndClose(function () { SET.sep = false; }))])),
     it('MultiLine Font', sub([it('Normal Font', setAndClose(function () { SET.font = 'normal'; })), it('Small Font', setAndClose(function () { SET.font = 'small'; }))])),
     it('Contrast', function () { S.menu = null; S.scr = 'contrast'; })]
  ]);
  S.menu = null; openMenu(m); m.ret = S.setRet;
}
function fmtselKey(a) {
  var d = /^d(\d)$/.exec(a);
  if (a === 'ac') { S.scr = S.setRet || 'calc'; return; }
  if (!d) return; var n = +d[1];
  if (S.fmtsel === 'norm') { if (n !== 1 && n !== 2) return; SET.fmt = { t: 'norm', n: n }; }
  else SET.fmt = { t: S.fmtsel, n: n };
  S.scr = S.setRet || 'calc';
}
function contrastKey(a) {
  if (a === 'left') SET.contrast = Math.max(0, SET.contrast - 1);
  else if (a === 'right') SET.contrast = Math.min(10, SET.contrast + 1);
  else if (a === 'ac') S.scr = S.setRet || 'calc';
}
/* ---------- RESET (SHIFT 9) ---------- */
function modeHome() { return S.mode === 'calc' ? 'calc' : S.mode === 'stat' ? 'stated' : S.mode === 'table' ? 'tblf' : 'ratio'; }
function openReset() {
  var ask = function (q, done, fn) { return function () { S.menu = null; S.conf = { q: q, done: done, fn: fn }; S.scr = 'confirm'; }; };
  var m = mkMenu([[
    it('Setup Data', ask('Reset Setup Data?', 'Reset Setup Data', function () { var c = SET.contrast; SET = defaultSet(); SET.contrast = c; enterMode('calc'); })),
    it('Memory', ask('Clear Memory?', 'Clear Memory', function () { VARS = freshVars(); S.ans = ZERO; })),
    it('Initialize All', ask('Initialize All?', 'Initialize All', function () { var c = SET.contrast; SET = defaultSet(); SET.contrast = c; VARS = freshVars(); S.ans = ZERO; resetModeData(); enterMode('calc'); }))
  ]]);
  S.menu = null; openMenu(m);
  if (/^(menu|mainmenu|error|confirm|msg|fmtsel|contrast|recall)$/.test(m.ret)) m.ret = modeHome();
}
function confirmKey(a) {
  if (a === 'eq') { var c = S.conf; var ret = S.menu ? S.menu.ret : modeHome(); c.fn(); S.msg = { l1: c.done, l2: 'Press [AC] Key', ret: modeHome() }; S.scr = 'msg'; return; }
  if (a === 'ac') S.scr = modeHome();
}
function msgKey(a) { if (a === 'ac') S.scr = S.msg.ret; }
/* ---------- RECALL ---------- */
var VARKEY = { neg: 'A', dms: 'B', inv: 'C', sin: 'D', cos: 'E', tan: 'F', mplus: 'M', rp: 'x', sd: 'y' };
/* ---------- MAIN MENU ---------- */
var MODES = [{ id: 'calc', name: 'Calculate' }, { id: 'stat', name: 'Statistics' }, { id: 'table', name: 'Table' }, { id: 'ratio', name: 'Ratio' }];
function openMainMenu() {
  if (S.scr !== 'mainmenu') S.mmRet = (S.scr === 'menu' && S.menu) ? S.menu.ret : S.scr;
  if (/^(error|confirm|msg|fmtsel|contrast|recall|menu)$/.test(S.mmRet)) S.mmRet = modeHome();
  S.menu = null; S.mm = MODES.map(function (m) { return m.id; }).indexOf(S.mode); S.scr = 'mainmenu';
}
function mainMenuKey(a) {
  var d = /^d(\d)$/.exec(a);
  if (a === 'left' || a === 'up') S.mm = (S.mm + 3) % 4;
  else if (a === 'right' || a === 'down') S.mm = (S.mm + 1) % 4;
  else if (a === 'eq') enterMode(MODES[S.mm].id);
  else if (d && +d[1] >= 1 && +d[1] <= 4) enterMode(MODES[+d[1] - 1].id);
  else if (a === 'ac') S.scr = S.mmRet || modeHome();
}
function resetModeData() { ST.rows = []; ST.type = null; TB.f = { toks: [], cur: 0 }; TB.g = { toks: [], cur: 0 }; TB.start = Rat(1); TB.end = Rat(5); TB.step = Rat(1); RA.type = 1; RA.v = [Rat(1), Rat(1), Rat(1)]; }
function enterMode(m) {
  S.mode = m; S.hist = []; S.hi = -1; clearCalc(); S.last = null; S.menu = null; S.cin = null; S.ovw = false; S.sto = false;
  if (m === 'calc') S.scr = 'calc';
  else if (m === 'stat') { ST.rows = []; openStatType(true); }
  else if (m === 'table') { S.scr = 'tblf'; TB.which = 'f'; }
  else { openRatioType(true); }
}
function onKey() {
  S.shift = S.alpha = S.sto = false;
  if (!S.on) { S.on = true; }
  S.hist = []; S.hi = -1; clearCalc(); S.last = null; S.menu = null; S.cin = null;
  if (S.mode === 'stat') S.scr = ST.type ? 'calc' : 'stated'; else S.scr = modeHome();
  if (S.mode === 'stat' && !ST.type) openStatType(true);
  if (S.mode === 'ratio' && !RA.type) openRatioType(true);
}
/* ---------- OPTN ---------- */
function hypMenu() { openMenu(mkMenu([[it('sinh', function () { insertTok('sinh('); }), it('cosh', function () { insertTok('cosh('); }), it('tanh', function () { insertTok('tanh('); }), it('sinh⁻¹', function () { insertTok('sinh⁻¹('); }), it('cosh⁻¹', function () { insertTok('cosh⁻¹('); }), it('tanh⁻¹', function () { insertTok('tanh⁻¹('); })]], { cols: 2 }), true); }
function angMenu() { openMenu(mkMenu([[it('°', function () { insertTok('°a'); }), it('ʳ', function () { insertTok('ʳ'); }), it('ᵍ', function () { insertTok('ᵍ'); })]], { cols: 2 }), true); }
var HYPPAGE = function () { return [it('Hyperbolic Func', hypMenu), it('Angle Unit', angMenu)]; };
function openOptn() {
  var s = S.scr;
  if (s === 'calc' && S.mode === 'stat') return openMenu(statCalcMenu());
  if (s === 'calc' || s === 'tblf') return openMenu(mkMenu([HYPPAGE()]));
  if (s === 'stated') return openMenu(statEdMenu());
  if (s === 'ratio' || s === 'ratres') return openMenu(mkMenu([[it('Select Type', function () { openRatioType(false); })]]));
}
/* ======================= STATISTICS ======================= */
var STYPES = [{ id: '1', l: '1-Variable' }, { id: 'lin', l: 'y=a+bx' }, { id: 'quad', l: 'y=a+bx+cx²' }, { id: 'log', l: 'y=a+b·ln(x)' },
  { id: 'eexp', l: 'y=a·e^(bx)' }, { id: 'abexp', l: 'y=a·b^x' }, { id: 'pow', l: 'y=a·x^b' }, { id: 'inv', l: 'y=a+b/x' }];
var ST = { type: null, rows: [], r: 0, c: 0, top: 0 };
function paired() { return ST.type && ST.type !== '1'; }
function statCols() { var c = ['x']; if (paired()) c.push('y'); if (SET.freq) c.push('f'); return c; }
function statMax() { return paired() ? (SET.freq ? 53 : 80) : (SET.freq ? 80 : 160); }
function openStatType(initial) {
  var pick = function (id) { return function () { var wasP = paired(); var was = ST.type; ST.type = id; if (was && wasP !== paired()) ST.rows = []; ST.r = 0; ST.c = 0; ST.top = 0; S.menu = null; S.cin = null; S.scr = 'stated'; }; };
  var items = STYPES.map(function (t) { return it(t.l, pick(t.id)); });
  S.menu = null; openMenu(mkMenu([items.slice(0, 4), items.slice(4)], { noClose: initial }));
}
function statEdMenu() {
  var ed = function () { openMenu(mkMenu([[it('Insert Row', function () { if (ST.rows.length < statMax() && ST.r < ST.rows.length) ST.rows.splice(ST.r, 0, { x: ZERO, y: ZERO, f: Rat(1) }); closeMenus(); }), it('Delete All', function () { ST.rows = []; ST.r = 0; ST.top = 0; closeMenus(); })]]), true); };
  var p1 = [it('Select Type', function () { openStatType(false); }), it('Editor', ed)];
  if (!paired()) return mkMenu([p1.concat([it('1-Variable Calc', function () { showStatList('var'); }), it('Statistics Calc', function () { S.menu = null; S.scr = 'calc'; })]), HYPPAGE()]);
  return mkMenu([p1.concat([it('2-Variable Calc', function () { showStatList('var'); }), it('Regression Calc', function () { showStatList('reg'); })]), [it('Statistics Calc', function () { S.menu = null; S.scr = 'calc'; })], HYPPAGE()]);
}
function statCalcMenu() {
  var t = function (tok) { return function () { insertTok(tok); }; };
  var sumM = function () { openMenu(mkMenu([paired() ? [it('Σx', t('§Σx')), it('Σx²', t('§Σx²')), it('Σy', t('§Σy')), it('Σy²', t('§Σy²')), it('Σxy', t('§Σxy')), it('Σx³', t('§Σx³')), it('Σx²y', t('§Σx²y')), it('Σx⁴', t('§Σx⁴'))] : [it('Σx', t('§Σx')), it('Σx²', t('§Σx²'))]], { cols: 2 }), true); };
  var varM = function () {
    var a = [it('x̄', t('§x̄')), it('σ²x', t('§σ²x')), it('σx', t('§σx')), it('s²x', t('§s²x')), it('sx', t('§sx')), it('n', t('§n'))];
    openMenu(mkMenu(paired() ? [a.concat([it('ȳ', t('§ȳ')), it('σ²y', t('§σ²y'))]), [it('σy', t('§σy')), it('s²y', t('§s²y')), it('sy', t('§sy'))]] : [a], { cols: 2 }), true);
  };
  var mmM = function () { openMenu(mkMenu([paired() ? [it('min(x)', t('§min(x)')), it('max(x)', t('§max(x)')), it('min(y)', t('§min(y)')), it('max(y)', t('§max(y)'))] : [it('min(x)', t('§min(x)')), it('Q₁', t('§Q₁')), it('Med', t('§Med')), it('Q₃', t('§Q₃')), it('max(x)', t('§max(x)'))]], { cols: 2 }), true); };
  var regM = function () { openMenu(mkMenu([ST.type === 'quad' ? [it('a', t('§a')), it('b', t('§b')), it('c', t('§c')), it('x̂₁', t('x̂₁')), it('x̂₂', t('x̂₂')), it('ŷ', t('ŷ'))] : [it('a', t('§a')), it('b', t('§b')), it('r', t('§r')), it('x̂', t('x̂')), it('ŷ', t('ŷ'))]], { cols: 2 }), true); };
  var data = function () { S.menu = null; ST.r = 0; ST.c = 0; ST.top = 0; S.scr = 'stated'; };
  if (!paired()) return mkMenu([[it('Select Type', function () { openStatType(false); }), it('1-Variable Calc', function () { showStatList('var'); }), it('Data', data)], [it('Summation', sumM), it('Variable', varM), it('Min/Max', mmM)], HYPPAGE()]);
  return mkMenu([[it('Select Type', function () { openStatType(false); }), it('2-Variable Calc', function () { showStatList('var'); }), it('Regression Calc', function () { showStatList('reg'); }), it('Data', data)], [it('Summation', sumM), it('Variable', varM), it('Min/Max', mmM), it('Regression', regM)], HYPPAGE()]);
}
/* ---- statistics maths ---- */
function sumV(arr) { return arr.reduce(function (s, v) { return add(s, v); }, ZERO); }
function statBasic() {
  var rows = ST.rows; if (!rows.length) merr();
  var P2 = paired(), n = ZERO, sx = ZERO, sx2 = ZERO, sy = ZERO, sy2 = ZERO, sxy = ZERO, sx3 = ZERO, sx2y = ZERO, sx4 = ZERO;
  rows.forEach(function (r) {
    var f = SET.freq ? r.f : Rat(1); if (sgn(f) < 0) merr();
    var x = r.x, y = r.y, x2 = mul(x, x);
    n = add(n, f); sx = add(sx, mul(f, x)); sx2 = add(sx2, mul(f, x2));
    if (P2) { sy = add(sy, mul(f, y)); sy2 = add(sy2, mul(f, mul(y, y))); sxy = add(sxy, mul(f, mul(x, y))); sx3 = add(sx3, mul(f, mul(x2, x))); sx2y = add(sx2y, mul(f, mul(x2, y))); sx4 = add(sx4, mul(f, mul(x2, x2))); }
  });
  if (isZero(n)) merr();
  return { n: n, sx: sx, sx2: sx2, sy: sy, sy2: sy2, sxy: sxy, sx3: sx3, sx2y: sx2y, sx4: sx4 };
}
function svar(s1, s2, n, samp) { var d = samp ? sub(n, Rat(1)) : n; if (sgn(d) <= 0) merr(); var v = div(sub(s2, div(mul(s1, s1), n)), d); if (sgn(v) < 0) v = ZERO; return v; }
function quartiles() {
  var list = [];
  ST.rows.forEach(function (r) { var f = SET.freq ? intOf(r.f) : 1n; if (f === null || f < 0n) merr(); for (var i = 0n; i < f; i++) list.push(r.x); });
  if (!list.length) merr();
  list.sort(function (a, b) { return toF(a) - toF(b); });
  var med = function (a) { var m = a.length; if (!m) merr(); return m % 2 ? a[(m - 1) / 2] : div(add(a[m / 2 - 1], a[m / 2]), Rat(2)); };
  var m = list.length, h = Math.floor(m / 2);
  var lo = list.slice(0, h), hi = list.slice(m % 2 ? h + 1 : h);
  if (m === 1) { lo = list; hi = list; }
  return { q1: med(lo), med: med(list), q3: med(hi), min: list[0], max: list[m - 1] };
}
function minmax(key) { if (!ST.rows.length) merr(); var a = ST.rows.map(function (r) { return r[key]; }); var mn = a[0], mx = a[0]; a.forEach(function (v) { if (toF(v) < toF(mn)) mn = v; if (toF(v) > toF(mx)) mx = v; }); return [mn, mx]; }
function regress() { // returns {a,b,c,r}
  var t = ST.type, rows = ST.rows; if (!rows.length || !paired()) merr();
  var n = 0, X = 0, Y = 0, XX = 0, YY = 0, XY = 0, X3 = 0, X4 = 0, X2Y = 0;
  rows.forEach(function (r) {
    var f = SET.freq ? toF(r.f) : 1, x = toF(r.x), y = toF(r.y);
    if (t === 'log' || t === 'pow') { if (x <= 0) merr(); x = Math.log(x); }
    if (t === 'inv') { if (x === 0) merr(); x = 1 / x; }
    if (t === 'eexp' || t === 'abexp' || t === 'pow') { if (y <= 0) merr(); y = Math.log(y); }
    n += f; X += f * x; Y += f * y; XX += f * x * x; YY += f * y * y; XY += f * x * y; X3 += f * x * x * x; X4 += f * x * x * x * x; X2Y += f * x * x * y;
  });
  if (t === 'quad') {
    var A = [[n, X, XX, Y], [X, XX, X3, XY], [XX, X3, X4, X2Y]];
    for (var i = 0; i < 3; i++) {
      var p = i; for (var k = i + 1; k < 3; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k;
      var tmp = A[i]; A[i] = A[p]; A[p] = tmp; if (Math.abs(A[i][i]) < 1e-300) merr();
      for (k = 0; k < 3; k++) if (k !== i) { var fc = A[k][i] / A[i][i]; for (var j = i; j < 4; j++) A[k][j] -= fc * A[i][j]; }
    }
    return { a: F(A[0][3] / A[0][0]), b: F(A[1][3] / A[1][1]), c: F(A[2][3] / A[2][2]), r: null };
  }
  var Sxx = XX - X * X / n, Syy = YY - Y * Y / n, Sxy = XY - X * Y / n;
  if (Sxx === 0) merr();
  var b = Sxy / Sxx, a = (Y - b * X) / n, r = (Syy === 0) ? NaN : Sxy / Math.sqrt(Sxx * Syy);
  if (t === 'eexp' || t === 'pow') a = Math.exp(a);
  if (t === 'abexp') { a = Math.exp(a); b = Math.exp(b); }
  return { a: F(a), b: F(b), c: null, r: isNaN(r) ? null : F(Math.max(-1, Math.min(1, r))) };
}
function statVal(tok) {
  if (S.mode !== 'stat') merr();
  var k = tok.slice(1), B, q;
  if (k === 'a' || k === 'b' || k === 'c' || k === 'r') { var R = regress(); if (!R[k]) merr(); return R[k]; }
  if (k === 'min(x)' || k === 'max(x)' || k === 'Q₁' || k === 'Med' || k === 'Q₃') {
    if (paired() && (k === 'min(x)' || k === 'max(x)')) { var mmx = minmax('x'); return k === 'min(x)' ? mmx[0] : mmx[1]; }
    q = quartiles(); return { 'min(x)': q.min, 'max(x)': q.max, 'Q₁': q.q1, 'Med': q.med, 'Q₃': q.q3 }[k];
  }
  if (k === 'min(y)' || k === 'max(y)') { var mmy = minmax('y'); return k === 'min(y)' ? mmy[0] : mmy[1]; }
  B = statBasic();
  switch (k) {
    case 'n': return B.n; case 'Σx': return B.sx; case 'Σx²': return B.sx2; case 'Σy': return B.sy; case 'Σy²': return B.sy2;
    case 'Σxy': return B.sxy; case 'Σx³': return B.sx3; case 'Σx²y': return B.sx2y; case 'Σx⁴': return B.sx4;
    case 'x̄': return div(B.sx, B.n); case 'ȳ': return div(B.sy, B.n);
    case 'σ²x': return svar(B.sx, B.sx2, B.n, false); case 'σx': return sqrtV(svar(B.sx, B.sx2, B.n, false));
    case 's²x': return svar(B.sx, B.sx2, B.n, true); case 'sx': return sqrtV(svar(B.sx, B.sx2, B.n, true));
    case 'σ²y': return svar(B.sy, B.sy2, B.n, false); case 'σy': return sqrtV(svar(B.sy, B.sy2, B.n, false));
    case 's²y': return svar(B.sy, B.sy2, B.n, true); case 'sy': return sqrtV(svar(B.sy, B.sy2, B.n, true));
  }
  merr();
}
function statEst(tok, v) {
  if (S.mode !== 'stat' || !paired()) merr();
  var R = regress(), a = toF(R.a), b = toF(R.b), c = R.c ? toF(R.c) : 0, x = toF(v), t = ST.type, r;
  if (tok === 'ŷ') {
    switch (t) {
      case 'lin': r = a + b * x; break; case 'quad': r = a + b * x + c * x * x; break;
      case 'log': if (x <= 0) merr(); r = a + b * Math.log(x); break; case 'eexp': r = a * Math.exp(b * x); break;
      case 'abexp': r = a * Math.pow(b, x); break; case 'pow': if (x < 0) merr(); r = a * Math.pow(x, b); break;
      case 'inv': if (x === 0) merr(); r = a + b / x; break;
    }
    return F(r);
  }
  if (t === 'quad') {
    if (tok === 'x̂') merr(); if (c === 0) merr();
    var D = b * b - 4 * c * (a - x); if (D < 0) merr();
    return F(tok === 'x̂₁' ? (-b + Math.sqrt(D)) / (2 * c) : (-b - Math.sqrt(D)) / (2 * c));
  }
  if (tok !== 'x̂') merr();
  switch (t) {
    case 'lin': if (b === 0) merr(); r = (x - a) / b; break;
    case 'log': if (b === 0) merr(); r = Math.exp((x - a) / b); break;
    case 'eexp': if (b === 0 || x / a <= 0) merr(); r = Math.log(x / a) / b; break;
    case 'abexp': if (b <= 0 || b === 1 || x / a <= 0) merr(); r = Math.log(x / a) / Math.log(b); break;
    case 'pow': if (b === 0 || x / a <= 0) merr(); r = Math.pow(x / a, 1 / b); break;
    case 'inv': if (x === a) merr(); r = b / (x - a); break;
  }
  return F(r);
}
function showStatList(kind) {
  var ret = S.menu ? S.menu.ret : S.scr; S.menu = null;
  var lines = [], tryv = function (lbl, tok) { var v; try { v = statVal(tok); lines.push([lbl, v]); } catch (e) { if (!(e instanceof CErr)) throw e; lines.push([lbl, null]); } };
  if (kind === 'var') {
    var L = paired() ? ['x̄', 'Σx', 'Σx²', 'σ²x', 'σx', 's²x', 'sx', 'n', 'ȳ', 'Σy', 'Σy²', 'σ²y', 'σy', 's²y', 'sy', 'Σxy', 'Σx³', 'Σx²y', 'Σx⁴', 'min(x)', 'max(x)', 'min(y)', 'max(y)']
      : ['x̄', 'Σx', 'Σx²', 'σ²x', 'σx', 's²x', 'sx', 'n', 'min(x)', 'Q₁', 'Med', 'Q₃', 'max(x)'];
    L.forEach(function (k) { tryv(STATN['§' + k], '§' + k); });
    S.slist = { lines: lines, top: 0, ret: ret, head: null };
  } else {
    var lbl = STYPES.filter(function (t) { return t.id === ST.type; })[0].l;
    ['a', 'b', ST.type === 'quad' ? 'c' : 'r'].forEach(function (k) { tryv(k, '§' + k); });
    S.slist = { lines: lines, top: 0, ret: ret, head: lbl };
  }
  S.scr = 'slist';
}
function slistKey(a) {
  var L = S.slist, per = L.head ? 5 : 6;
  if (a === 'down' && L.top + per < L.lines.length) L.top += per;
  else if (a === 'up' && L.top > 0) L.top -= per;
  else if (a === 'ac') S.scr = L.ret === 'menu' ? modeHome() : L.ret;
}
/* generic editing on a cell-input / function editor */
function genEdit(E, a, line) {
  if (a === 'frac' && !line) { edFrac(E); return true; }
  var tk = tokFor(a, line); if (tk) { edInsert(E, tk[0], tk[1], S.ovw && line); return true; }
  switch (a) {
    case 'del': edDel(E, S.ovw && line); return true;
    case 'left': edLeft(E); return true;
    case 'right': edRight(E); return true;
    case 'jl': case 'jr': edJump(E, a === 'jr' ? 1 : -1); return true;
    case 'ins': if (line) S.ovw = !S.ovw; return true;
  }
  return false;
}
function cellCommit(from, fn) { // evaluate S.cin and pass the value to fn
  try { var v = evalSimple(S.cin.toks); fn(v); S.cin = null; return true; }
  catch (ex) { doError(ex, S.cin.toks, from); return false; }
}
function statEdKey(a) {
  var cols = statCols(), max = statMax();
  if (S.cin) {
    if (a === 'eq') {
      cellCommit('stated', function (v) {
        if (ST.r >= ST.rows.length) { if (ST.rows.length >= max) return; ST.rows.push({ x: ZERO, y: ZERO, f: Rat(1) }); }
        ST.rows[ST.r][cols[ST.c]] = v; ST.r = Math.min(ST.r + 1, Math.min(ST.rows.length, max - 1));
      });
    } else if (a === 'ac') S.cin = null;
    else genEdit(S.cin, a, true);
    statScroll(); return;
  }
  if (tokFor(a, true)) { S.cin = { toks: [], cur: 0 }; genEdit(S.cin, a, true); return; }
  switch (a) {
    case 'up': ST.r = ST.r > 0 ? ST.r - 1 : Math.min(ST.rows.length, max - 1); break;
    case 'down': ST.r = ST.r < Math.min(ST.rows.length, max - 1) ? ST.r + 1 : 0; break;
    case 'left': if (ST.c > 0) ST.c--; break;
    case 'right': if (ST.c < cols.length - 1) ST.c++; break;
    case 'del': if (ST.r < ST.rows.length) { ST.rows.splice(ST.r, 1); if (ST.r > ST.rows.length) ST.r = ST.rows.length; } break;
    case 'ac': S.scr = 'calc'; break;
    case 'optn': openOptn(); break;
  }
  statScroll();
}
function statScroll() { if (ST.r < ST.top) ST.top = ST.r; if (ST.r > ST.top + 3) ST.top = ST.r - 3; }
/* ======================= TABLE ======================= */
var TB = { f: { toks: [], cur: 0 }, g: { toks: [], cur: 0 }, which: 'f', start: Rat(1), end: Rat(5), step: Rat(1), rsel: 0, rows: [], r: 0, c: 0, top: 0 };
function tblFunKey(a) {
  var E = TB[TB.which], line = !isMathIn();
  if (a === 'eq') {
    if (TB.which === 'f' && !TB.f.toks.length) return;
    if (TB.which === 'f' && SET.table === 'fg') { TB.which = 'g'; return; }
    TB.rsel = 0; S.cin = null; S.scr = 'tblr'; return;
  }
  if (a === 'ac') { TB[TB.which] = { toks: [], cur: 0 }; return; }
  if (a === 'optn') { openOptn(); return; }
  if ((a === 'up' || a === 'down') && (line || !edUpDown(E, a === 'down' ? 1 : -1))) {
    if (SET.table === 'fg') TB.which = a === 'up' ? 'f' : 'g'; return;
  }
  genEdit(E, a, line);
}
function tblRangeKey(a) {
  var keys = ['start', 'end', 'step'];
  var next = function () { if (TB.rsel < 2) TB.rsel++; else tblGen(); };
  if (S.cin) {
    if (a === 'eq') { if (cellCommit('tblr', function (v) { TB[keys[TB.rsel]] = v; })) next(); }
    else if (a === 'ac') S.cin = null;
    else genEdit(S.cin, a, true);
    return;
  }
  if (tokFor(a, true)) { S.cin = { toks: [], cur: 0 }; genEdit(S.cin, a, true); return; }
  if (a === 'eq') next();
  else if (a === 'up' && TB.rsel > 0) TB.rsel--;
  else if (a === 'down' && TB.rsel < 2) TB.rsel++;
  else if (a === 'ac') { S.scr = 'tblf'; TB.which = 'f'; }
}
function tblEval(E, x) {
  if (!E.toks.length) return null;
  var save = VARS.x; VARS.x = x;
  try { return evalSimple(E.toks); } catch (ex) { if (ex instanceof CErr) return 'ERR'; throw ex; } finally { VARS.x = save; }
}
function tblRow(x) { var r = { x: x, f: tblEval(TB.f, x), g: SET.table === 'fg' ? tblEval(TB.g, x) : null }; VARS.x = x; return r; }
function tblGen() {
  try {
    if (isZero(TB.step)) merr();
    var cnt = (toF(TB.end) - toF(TB.start)) / toF(TB.step);
    var max = SET.table === 'fg' ? 30 : 45;
    if (cnt < -1e-9 || Math.floor(cnt + 1e-9) + 1 > max) throw new CErr(E_RANGE);
    var n = Math.floor(cnt + 1e-9) + 1, rows = [];
    for (var i = 0; i < n; i++) rows.push(tblRow(add(TB.start, mul(Rat(i), TB.step))));
    TB.rows = rows; TB.r = 0; TB.c = 0; TB.top = 0; S.scr = 'tbl';
  } catch (ex) { doError(ex, [], 'tblr'); S.err.pos = 0; }
}
function tblKey(a) {
  if (S.cin) {
    if (a === 'eq') cellCommit('tbl', function (v) { TB.rows[TB.r] = tblRow(v); });
    else if (a === 'ac') S.cin = null;
    else genEdit(S.cin, a, true);
    return;
  }
  var ncol = SET.table === 'fg' ? 3 : 2;
  if (TB.c === 0 && (a === 'add' || a === 'sub' || a === 'eq') && TB.r > 0) { var above = TB.rows[TB.r - 1].x; TB.rows[TB.r] = tblRow(a === 'sub' ? sub(above, TB.step) : add(above, TB.step)); return; }
  if (TB.c === 0 && tokFor(a, true)) { S.cin = { toks: [], cur: 0 }; genEdit(S.cin, a, true); return; }
  switch (a) {
    case 'up': if (TB.r > 0) TB.r--; break;
    case 'down': if (TB.r < TB.rows.length - 1) TB.r++; break;
    case 'left': if (TB.c > 0) TB.c--; break;
    case 'right': if (TB.c < ncol - 1) TB.c++; break;
    case 'ac': S.scr = 'tblf'; TB.which = 'f'; break;
  }
  if (TB.r < TB.top) TB.top = TB.r; if (TB.r > TB.top + 3) TB.top = TB.r - 3;
}
/* ======================= RATIO ======================= */
var RA = { type: 1, v: [Rat(1), Rat(1), Rat(1)], sel: 0, x: null };
function openRatioType(initial) {
  var pick = function (t) { return function () { RA.type = t; RA.v = [Rat(1), Rat(1), Rat(1)]; RA.sel = 0; S.menu = null; S.cin = null; S.scr = 'ratio'; }; };
  S.menu = null; openMenu(mkMenu([[it('A:B=X:D', pick(1)), it('A:B=C:X', pick(2))]], { noClose: initial }));
}
function ratioKey(a) {
  if (S.cin) {
    if (a === 'eq') { if (cellCommit('ratio', function (v) { RA.v[RA.sel] = v; })) { if (RA.sel < 2) RA.sel++; } }
    else if (a === 'ac') S.cin = null;
    else genEdit(S.cin, a, true);
    return;
  }
  if (tokFor(a, true)) { S.cin = { toks: [], cur: 0 }; genEdit(S.cin, a, true); return; }
  switch (a) {
    case 'left': case 'up': if (RA.sel > 0) RA.sel--; break;
    case 'right': case 'down': if (RA.sel < 2) RA.sel++; break;
    case 'ac': RA.v = [Rat(1), Rat(1), Rat(1)]; RA.sel = 0; break;
    case 'optn': openOptn(); break;
    case 'eq':
      try {
        var A = RA.v[0], B = RA.v[1], C = RA.v[2];
        if (isZero(A) || isZero(B) || isZero(C)) merr();
        var X = RA.type === 1 ? div(mul(A, C), B) : div(mul(B, C), A);
        S.ans = X; RA.x = mkCur({ v: X, frac: false, dec: false, g: false, pair: null }, false); S.scr = 'ratres';
      } catch (ex) { doError(ex, [], 'ratio'); S.err.pos = 0; }
      break;
  }
}
function ratresKey(a) { if (a === 'eq' || a === 'ac') S.scr = 'ratio'; else if (a === 'sd') { var C = RA.x; if (C.views.length > 1) C.vi = (C.vi + 1) % C.views.length; } else if (a === 'optn') openOptn(); }

/* ======================================================================
   7. SCREEN RENDERING  (returns HTML for the LCD; positions are in LCD pixels, 1px = 0.1em)
   ====================================================================== */
var MATHICON = '<svg viewBox="0 0 9 6" class="czmicon"><path d="M0.3 3.4 L1.3 3 L2.2 5.6 L3.6 0.4 H8.6 V5.6 H4.6 V2" fill="none" stroke="currentColor" stroke-width="0.8"/><path d="M6.3 1.2 L8.7 3.6 L7.6 4.6 L5.4 2.4 Z" fill="currentColor"/></svg>';
function icon(x, cls, html) { return '<span class="czi" style="left:' + (x / 10) + 'em"><span class="czic ' + cls + '">' + html + '</span></span>'; }
function statusHTML() {
  var h = '';
  if (S.shift) h += icon(1, 'czinv', 'S'); else if (S.alpha) h += icon(1, 'czinv', 'A');
  if (!isZero(VARS.M)) h += icon(13, '', 'M');
  if (S.sto) h += icon(21, 'czsto', '→<span class="czinv">x</span>');
  if (isMathIn() && !(S.mode === 'stat' && (S.scr === 'calc' || S.scr === 'stated' || S.scr === 'slist'))) h += icon(40, 'czmi2', MATHICON);
  h += icon(57, 'czinv', { deg: 'D', rad: 'R', gra: 'G' }[SET.angle]);
  if (SET.fmt.t !== 'norm') h += icon(73, 'czsm', SET.fmt.t === 'fix' ? 'FIX' : 'SCI');
  if (S.scr === 'calc' && S.st === 'result' && S.R) {
    var R = S.R;
    if (R.mi < R.stmts.length - 1) h += icon(178, 'czinv czpause', '<b></b><b></b>');
    if (S.mode === 'calc') {
      var up = S.hi > 0 || (S.hi === S.hist.length - 1 && S.hist.length > 0), dn = S.hi < S.hist.length - 1;
      if (dn) h += icon(156, 'czar', '▼'); if (up) h += icon(164, 'czar', '▲');
    }
  }
  return h;
}
function resultHTML(C, line) {
  var x = toF(C.v);
  if (C.factV) { var fd = factDesc(C.v); if (fd) return hFact(fd); }
  if (C.eng !== null) return hEng(x, C.eng) || hDec(x);
  if (C.dmsV) return hDMS(x) || hDec(x);
  var vw = C.views[C.vi];
  if (vw === 'exact') { var D = exactDesc(C.rv, (SET.frac === 'abc') !== C.mixT); if (D) return hExact(D, line); }
  if (vw === 'rec') { var Rr = recurDesc(C.rv); if (Rr) return hRecur(Rr, line); }
  return hDec(x);
}
function pairNames(C) { return C.pair.kind === 'Pol(' ? ['r', 'θ'] : ['<i>x</i>', '<i>y</i>']; }
function curCls(line) { return S.inc ? 'czinc' : (S.ovw && line) ? 'czov' : ''; }
function calcBody() {
  var line = lineIn(), h, exprH, resH = '';
  if (S.mode === 'stat' && S.st === 'edit' && !S.ed.toks.length) {
    var lbl = (STYPES.filter(function (t) { return t.id === ST.type; })[0] || { l: '' }).l;
    return '<div class="czln">' + '<span class="czcur"></span>' + '</div><div class="czidle"><div>Statistics</div><div>' + esc(lbl) + '</div></div>';
  }
  if (S.st === 'result') {
    var R = S.R, C = R.cur;
    exprH = renderToks(stmtToks(R), -1);
    if (C.pair) {
      var nm = pairNames(C), a = hDec(toF(C.pair.v[0])), b = hDec(toF(C.pair.v[1]));
      if (line) resH = '<div class="czlr2"><span>' + nm[0] + '=</span><span>' + a + '</span></div><div class="czlr2"><span>' + nm[1] + '=</span><span>' + b + '</span></div>';
      else resH = nm[0] + '=' + a + ', ' + nm[1] + '=' + b;
    } else resH = resultHTML(C, line);
  } else {
    exprH = renderToks(S.ed.toks, S.ed.cur, curCls(line));
  }
  if (line) {
    h = '<div class="czln' + (SET.font === 'small' ? ' czsmall' : '') + '">' + exprH + '</div>';
    if (S.st === 'result') h += (S.R.cur.pair ? resH : '<div class="czlr' + (SET.font === 'small' ? ' czsmall' : '') + '">' + resH + '</div>');
    return h;
  }
  h = '<div class="czin"><div class="czinr">' + exprH + '</div></div>';
  if (S.st === 'result') h += '<div class="czout"><div class="czoutr">' + resH + '</div></div>';
  return h;
}
function menuBody() {
  var m = S.menu, items = m.pages[m.page], h = '<div class="czmenu' + (m.cols === 2 ? ' czm2' : '') + '">';
  if (m.title) h += '<div class="czml">' + esc(m.title) + '</div>';
  items.forEach(function (x, i) { h += '<div class="czml">' + (i + 1) + ':' + esc(x.label).replace(/([²³⁴])/g, function (c) { return sup({ '²': 2, '³': 3, '⁴': 4 }[c]); }) + '</div>'; });
  h += '</div>';
  if (m.parent) h += '<span class="czsubar">◄</span>';
  if (m.pages.length > 1) h += scrollbar(m.page, m.pages.length);
  return h;
}
function scrollbar(i, n) { var hgt = 6.3 / n; return '<span class="czsb2" style="top:' + (i * hgt) + 'em;height:' + hgt + 'em"></span>'; }
var MMICON = [
  '<path d="M4 3 L9 8 M9 3 L4 8" /><path d="M13 5.5 H19 M16 2.6 v0.1 M16 8.4 v0.1"/><path d="M6.5 10.5 V15.5 M4 13 H9"/><path d="M13 13 H19"/>',
  '<path d="M3 15.5 H21 M4 15.5 V3 M7 15 V6 H10 V15 M10 15 V2 H13 V15 M13 15 V9 H16 V15 M16 15 V11 H19 V15" />',
  '<path d="M3 2.5 H21 V15.5 H3 Z M3 6 H21 M12 2.5 V15.5 M6 9 H9.5 V12.5 H6 Z M14.5 9 H18 V12.5 H14.5 Z" />',
  '<path d="M3 4 H9 V12 H3 Z M14 4 H20 V12 H14 Z M11.5 6 v0.1 M11.5 10 v0.1" />'
];
function mainMenuBody() {
  var h = '<div class="czmm">';
  MODES.forEach(function (m, i) {
    h += '<span class="czmmi' + (i === S.mm ? ' czsel' : '') + '"><svg viewBox="0 0 24 18"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square">' + MMICON[i] + '</g></svg><span class="czmmn">' + (i + 1) + '</span></span>';
  });
  return h + '</div><div class="czmml">' + (S.mm + 1) + ':' + MODES[S.mm].name + '</div>';
}
function linesBody(arr, cls) { return '<div class="czmenu ' + (cls || '') + '">' + arr.map(function (l) { return '<div class="czml">' + l + '</div>'; }).join('') + '</div>'; }
function recallBody() {
  var order = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['M', 'x'], ['y', null]], h = '<div class="czrcl">';
  order.forEach(function (row) {
    row.forEach(function (n) {
      if (!n) { h += '<span></span>'; return; }
      var t = lineExactText(VARS[n]); if (t.length > 11) t = t.slice(0, 10) + '…';
      h += '<span>' + (n === 'x' || n === 'y' ? '<i>' + n + '</i>' : n) + '=' + esc(t).replace(/×₁₀(-?\d+)/, '<span class="czx10">×10</span><span class="czsup">$1</span>') + '</span>';
    });
  });
  return h + '</div>';
}
function cellInputHTML() { return renderToks(S.cin.toks, S.cin.cur, curCls(true)); }
function statEdBody() {
  var cols = statCols(), names = { x: '<i>x</i>', y: '<i>y</i>', f: 'Freq' }, h = '<div class="czgrid czg' + cols.length + '">';
  h += '<span class="czrn"></span>' + cols.map(function (c) { return '<span class="czgh">' + names[c] + '</span>'; }).join('');
  for (var i = ST.top; i < ST.top + 4; i++) {
    h += '<span class="czrn">' + (i + 1) + '</span>';
    cols.forEach(function (c, j) {
      var v = ST.rows[i] ? shortStr(ST.rows[i][c], 6) : '';
      h += '<span class="czgc' + (i === ST.r && j === ST.c ? ' czsel' : '') + '">' + esc(v) + '</span>';
    });
  }
  h += '</div>';
  if (S.cin) h += '<div class="czbot czbotl">' + cellInputHTML() + '</div>';
  else if (ST.rows[ST.r]) h += '<div class="czbot">' + hDec(toF(ST.rows[ST.r][cols[ST.c]])) + '</div>';
  return h;
}
function slistBody() {
  var L = S.slist, per = L.head ? 5 : 6, h = '<div class="czlist">';
  if (L.head && L.top === 0) h += '<div>' + esc(L.head) + '</div>';
  L.lines.slice(L.top, L.top + per).forEach(function (l) {
    var p = l[1] ? decParts(toF(l[1]), { t: 'norm', n: 1 }) : null;
    h += '<div><span class="czlk">' + l[0] + '</span>=' + (p ? hMant(p.m, true) + (p.e !== null ? hExp(p.e) : '') : 'ERROR') + '</div>';
  });
  h += '</div><span class="czsubar">◄</span>';
  var pages = Math.ceil(L.lines.length / per); if (pages > 1) h += scrollbar(Math.floor(L.top / per), pages);
  return h;
}
function tblFunBody() {
  var line = !isMathIn(), h = '';
  ['f', 'g'].forEach(function (w) {
    if (w === 'g' && SET.table !== 'fg') return;
    var E = TB[w], act = TB.which === w;
    if (!act && w === 'g' && TB.which === 'f') return;
    if (!act && TB.which === 'g' && w === 'f') return;
    h += '<div class="' + (line ? 'czln' : 'czin czin2') + '"><div class="czinr"><i>' + w + '</i>(<i>x</i>)=' + renderToks(E.toks, act ? E.cur : -1, curCls(line)) + '</div></div>';
  });
  return h;
}
function tblRangeBody() {
  var lab = ['Start', 'End', 'Step'], keys = ['start', 'end', 'step'], h = '<div class="czmenu czrange"><div class="czml">Table Range</div>';
  keys.forEach(function (k, i) {
    var val = (S.cin && TB.rsel === i) ? cellInputHTML() : esc(shortStr(TB[k], 10));
    h += '<div class="czml' + (TB.rsel === i ? ' czsel' : '') + '">&nbsp;<span class="czrl">' + lab[i] + '</span>:' + val + '</div>';
  });
  return h + '</div>';
}
function tblBody() {
  var fg = SET.table === 'fg', h = '<div class="czgrid czg' + (fg ? 3 : 2) + '"><span class="czrn"></span><span class="czgh"><i>x</i></span><span class="czgh"><i>f</i>(<i>x</i>)</span>' + (fg ? '<span class="czgh"><i>g</i>(<i>x</i>)</span>' : '');
  var cell = function (v) { return v === null ? '' : v === 'ERR' ? 'ERROR' : shortStr(v, 6); };
  for (var i = TB.top; i < TB.top + 4; i++) {
    var r = TB.rows[i];
    h += '<span class="czrn">' + (r ? i + 1 : '') + '</span>';
    [r ? r.x : null, r ? r.f : null, r ? r.g : null].slice(0, fg ? 3 : 2).forEach(function (v, j) { h += '<span class="czgc' + (i === TB.r && j === TB.c ? ' czsel' : '') + '">' + esc(r ? cell(v) : '') + '</span>'; });
  }
  h += '</div>';
  if (S.cin) h += '<div class="czbot czbotl">' + cellInputHTML() + '</div>';
  else { var rr = TB.rows[TB.r], cv = rr ? [rr.x, rr.f, rr.g][TB.c] : null; h += '<div class="czbot">' + (cv === 'ERR' ? 'ERROR' : cv ? hDec(toF(cv)) : '') + '</div>'; }
  return h;
}
function ratioBody() {
  var lbl = RA.type === 1 ? ['', ':', '=X:'] : ['', ':', '='], h = '<div class="czratio">';
  for (var i = 0; i < 3; i++) {
    h += '<span class="czrsep">' + lbl[i] + '</span><span class="czrc' + (i === RA.sel ? ' czsel' : '') + '">' + esc(shortStr(RA.v[i], 6)) + '</span>';
  }
  if (RA.type === 2) h += '<span class="czrsep">:X</span>';
  h += '</div>';
  if (S.cin) h += '<div class="czbot czbotl">' + cellInputHTML() + '</div>';
  else h += '<div class="czbot">' + hDec(toF(RA.v[RA.sel])) + '</div>';
  return h;
}
function ratresBody() { return '<div class="czln">X=</div><div class="czout"><div class="czoutr">' + resultHTML(RA.x, !isMathIn()) + '</div></div>'; }
/* full render: {st: status html, body: html, cls: screen class} */
function render() {
  if (!S.on) return { st: '', body: '', cls: 'czoff' };
  var s = S.scr, body = '', st = statusHTML(), cls = 'czs-' + s;
  switch (s) {
    case 'calc': body = calcBody(); break;
    case 'menu': body = menuBody(); st = ''; break;
    case 'mainmenu': body = mainMenuBody(); st = ''; break;
    case 'error': body = linesBody([esc(S.err.m), '', '[AC]&nbsp;&nbsp;:Cancel', '[◄][►]:Goto']); break;
    case 'recall': body = recallBody(); st = ''; break;
    case 'contrast': body = linesBody(['Contrast', '', '<span>Light</span><span class="czrt2">Dark</span>', '&nbsp;[◄]<span class="czrt2">[►]</span>']); st = ''; break;
    case 'fmtsel': body = linesBody([{ fix: 'Fix 0~9?', sci: 'Sci 0~9?', norm: 'Norm 1~2?' }[S.fmtsel]]); st = ''; break;
    case 'confirm': body = linesBody([esc(S.conf.q), '', '[=]&nbsp;:Yes', '[AC]:Cancel']); st = ''; break;
    case 'msg': body = linesBody([esc(S.msg.l1), '', esc(S.msg.l2)]); st = ''; break;
    case 'stated': body = statEdBody(); break;
    case 'slist': body = slistBody(); st = ''; break;
    case 'tblf': body = tblFunBody(); break;
    case 'tblr': body = tblRangeBody(); st = ''; break;
    case 'tbl': body = tblBody(); break;
    case 'ratio': body = ratioBody(); break;
    case 'ratres': body = ratresBody(); break;
  }
  return { st: st, body: body, cls: cls };
}
/* plain text of the LCD (for tests / accessibility) */
function lcdText() {
  var r = render(), t = (r.body || '').replace(/<span class="czcur[^"]*"><\/span>/g, '|').replace(/<span class="czsup[^"]*">/g, '^{').replace(/<span class="czfn">/g, '{').replace(/<\/span><span class="czfd">/g, '}/{');
  t = t.replace(/<span class="czrb">/g, '√{').replace(/<span class="czbx[^"]*"><\/span>/g, '□');
  t = t.replace(/<\/div>/g, ' / ').replace(/<[^>]+>/g, function (m) { return m === '</span>' ? '' : ''; });
  return t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
}

/* ======================================================================
   8. KEYBOARD TABLE + DISPATCH
   KEYS[id] = { m: main action, s: SHIFT action, a: ALPHA action, lab, sl (shift legend), al (alpha legend) }
   ====================================================================== */
var BX = '<span class="czkb"></span>', BXF = '<span class="czkb czkbf"></span>';
var KEYS = {
  shift: { m: 'shift' }, alpha: { m: 'alpha' }, menu: { m: 'menu', s: 'setup' }, on: { m: 'on' },
  up: { m: 'up' }, down: { m: 'down' }, left: { m: 'left', s: 'jl' }, right: { m: 'right', s: 'jr' },
  optn: { m: 'optn', lab: 'OPTN' },
  x3: { m: 'cube', a: 'colon', lab: '<i class="czkx">x</i><span class="czks">3</span>', al: ':' },
  abs: { m: 'abs', lab: 'Abs' },
  logab: { m: 'logab', lab: 'log<span class="czksub">' + BXF + '</span>' + BX },
  frac: { m: 'frac', s: 'mixed', lab: '<span class="czkfr">' + BXF + BX + '</span>', sl: BXF + '<span class="czkfr">' + BX + BX + '</span>' },
  sqrt: { m: 'sqrt', s: 'cbrt', lab: '√' + BXF, sl: '<span class="czks2">3</span>√' + BXF },
  sq: { m: 'sq', s: 'recur', lab: '<i class="czkx">x</i><span class="czks">2</span>', sl: '<span class="czkdot">' + BXF + '</span>' },
  pow: { m: 'pow', s: 'root', lab: '<i class="czkx">x</i><span class="czks">' + BXF + '</span>', sl: '<span class="czks2">' + BXF + '</span>√' + BX },
  log: { m: 'log', s: 'ten', lab: 'log', sl: '10<span class="czks2">' + BXF + '</span>' },
  ln: { m: 'ln', s: 'epow', lab: 'ln', sl: '<i>e</i><span class="czks2">' + BXF + '</span>' },
  neg: { m: 'neg', a: 'v:A', lab: '(−)', al: 'A' },
  dms: { m: 'dms', s: 'fact', a: 'v:B', lab: '°&#8239;’&#8239;”', sl: 'FACT', al: 'B' },
  inv: { m: 'inv', s: 'fct', a: 'v:C', lab: '<i class="czkx">x</i><span class="czks">-1</span>', sl: '<i>x</i>!', al: 'C' },
  sin: { m: 'sin', s: 'asin', a: 'v:D', lab: 'sin', sl: 'sin<span class="czks2">-1</span>', al: 'D' },
  cos: { m: 'cos', s: 'acos', a: 'v:E', lab: 'cos', sl: 'cos<span class="czks2">-1</span>', al: 'E' },
  tan: { m: 'tan', s: 'atan', a: 'v:F', lab: 'tan', sl: 'tan<span class="czks2">-1</span>', al: 'F' },
  sto: { m: 'sto', s: 'rcl', lab: 'STO', sl: 'RECALL' },
  eng: { m: 'eng', s: 'engl', lab: 'ENG', sl: '←' },
  lp: { m: 'lp', lab: '(' },
  rp: { m: 'rp', s: 'comma', a: 'v:x', lab: ')', sl: ',', al: '<i>x</i>' },
  sd: { m: 'sd', s: 'mixtog', a: 'v:y', lab: 'S⇔D', sl: '<span class="czkab">a<span class="czkfr2"><span>b</span><span>c</span></span>⇔<span class="czkfr2"><span>d</span><span>c</span></span></span>', al: '<i>y</i>' },
  mplus: { m: 'mplus', s: 'mminus', a: 'v:M', lab: 'M+', sl: 'M−', al: 'M' },
  k7: { m: 'd7', lab: '7' }, k8: { m: 'd8', lab: '8' }, k9: { m: 'd9', s: 'reset', lab: '9', sl: 'RESET' },
  del: { m: 'del', s: 'ins', a: 'undo', lab: 'DEL', sl: 'INS', al: 'UNDO' },
  ac: { m: 'ac', s: 'off', lab: 'AC', sl: 'OFF' },
  k4: { m: 'd4', lab: '4' }, k5: { m: 'd5', lab: '5' }, k6: { m: 'd6', lab: '6' },
  mul: { m: 'mul', s: 'npr', lab: '×', sl: '<i>n</i>P<i>r</i>' },
  div: { m: 'div', s: 'ncr', lab: '÷', sl: '<i>n</i>C<i>r</i>' },
  k1: { m: 'd1', lab: '1' }, k2: { m: 'd2', lab: '2' }, k3: { m: 'd3', lab: '3' },
  add: { m: 'add', s: 'pol', lab: '+', sl: 'Pol' },
  sub: { m: 'sub', s: 'rec', lab: '−', sl: 'Rec' },
  k0: { m: 'd0', s: 'rnd', lab: '0', sl: 'Rnd' },
  dot: { m: 'dot', s: 'ran', a: 'ranint', lab: '•', sl: 'Ran#', al: 'RanInt' },
  exp: { m: 'exp10', s: 'pi', a: 'econst', lab: '×10<span class="czks"><i>x</i></span>', sl: 'π', al: '<i>e</i>' },
  ans: { m: 'ans', s: 'pct', lab: 'Ans', sl: '%' },
  eq: { m: 'eq', s: 'approx', lab: '=', sl: '≈' }
};
function handle(a) {
  if (a === 'off') { S.on = false; S.menu = null; S.sto = false; return; }
  if (a === 'on') { onKey(); return; }
  if (S.scr === 'error') { errorKey(a); return; }
  if (a === 'menu') { openMainMenu(); return; }
  if (a === 'setup') { openSetup(); return; }
  if (a === 'reset') { openReset(); return; }
  switch (S.scr) {
    case 'calc': if (a === 'optn') { openOptn(); return; } calcKey(a); return;
    case 'menu': menuKey(a); return;
    case 'mainmenu': mainMenuKey(a); return;
    case 'contrast': contrastKey(a); return;
    case 'fmtsel': fmtselKey(a); return;
    case 'confirm': confirmKey(a); return;
    case 'msg': msgKey(a); return;
    case 'stated': statEdKey(a); return;
    case 'slist': slistKey(a); return;
    case 'tblf': tblFunKey(a); return;
    case 'tblr': tblRangeKey(a); return;
    case 'tbl': tblKey(a); return;
    case 'ratio': ratioKey(a); return;
    case 'ratres': ratresKey(a); return;
  }
}
function errorKey(a) {
  var e = S.err, f = e.from;
  if (a === 'ac') { if (f === 'calc') clearCalc(); else S.cin = null; S.scr = f; return; }
  if (a === 'left' || a === 'right') {
    S.scr = f;
    if (f === 'calc') S.ed.cur = Math.min(e.pos, S.ed.toks.length);
    else if (S.cin) S.cin.cur = Math.min(e.pos, S.cin.toks.length);
  }
}
var onDraw = null, onFlash = null;
function press(id) {
  var k = KEYS[id]; if (!k) return false;
  if (onFlash) onFlash(id);
  if (!S.on) { if (id === 'on') onKey(); if (onDraw) onDraw(); return true; }
  if (id === 'shift') { S.shift = !S.shift; S.alpha = false; if (onDraw) onDraw(); return true; }
  if (id === 'alpha') { S.alpha = !S.alpha; S.shift = false; if (onDraw) onDraw(); return true; }
  var layer = S.shift ? 's' : S.alpha ? 'a' : 'm', act = k[layer] || k.m;
  S.shift = S.alpha = false;
  try {
    if (S.sto) {
      S.sto = false;
      if (VARKEY[id] && layer !== 's' && S.scr === 'calc') { storeTo(VARKEY[id]); if (onDraw) onDraw(); return true; }
      if (act === 'ac') { if (onDraw) onDraw(); return true; }
    }
    if (S.scr === 'recall') {
      if (VARKEY[id] && layer !== 's') { S.scr = 'calc'; calcInsert('v:' + VARKEY[id]); }
      else if (act === 'ac') S.scr = 'calc';
      else if (act === 'off' || act === 'on' || act === 'menu' || act === 'setup') handle(act);
    } else handle(act);
  } catch (ex) {
    if (ex instanceof CErr) doError(ex, S.ed.toks, S.scr === 'calc' ? 'calc' : S.scr); else throw ex;
  }
  if (onDraw) onDraw();
  return true;
}

/* ======================================================================
   9. PANEL (DOM), mouse + keyboard, public API
   Geometry is taken from the photo: 1 photo pixel = 0.1em, body 254 x 549 px.
   ====================================================================== */
function lcdTextOf(html) {
  var out = '', stack = [];
  var OPEN = { czsup: '^(', czsub: '_(', czfn: '[', czfd: '/', czrb: '√(', czcur: '|', czbx: '□', czab: '|', czri: '', czml: '', czlr: ' => ', czout: ' => ', czfl: '⌟' };
  var CLOSE = { czsup: ')', czsub: ')', czfd: ']', czrb: ')', czab: '|', czdot: '̇', czml: ' ¦ ', czln: ' ', czlr2: ' ', czgc: ' ', czgh: ' ', czrn: ' ', czrc: ' ', czrsep: ' ' };
  String(html).replace(/<(\/?)([a-zA-Z0-9]+)([^>]*)>|([^<]+)/g, function (m, close, tag, attrs, text) {
    if (text !== undefined) { if (stack.indexOf('svg') < 0) out += text; return m; }
    if (close) { var c = stack.pop() || ''; c.split(' ').forEach(function (k) { if (CLOSE[k]) out += CLOSE[k]; }); return m; }
    if (/\/\s*$/.test(attrs)) return m;
    var cls = tag === 'svg' ? 'svg' : ((/class="([^"]*)"/.exec(attrs) || [])[1] || '');
    stack.push(cls); cls.split(' ').forEach(function (k) { if (OPEN[k]) out += OPEN[k]; });
    return m;
  });
  return out.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}
var API = {
  press: press, S: S, render: render,
  text: function () { return lcdTextOf(render().body); },
  status: function () { return lcdTextOf(render().st); },
  get SET() { return SET; }, get VARS() { return VARS; }, get ST() { return ST; }, get TB() { return TB; }, get RA() { return RA; },
  keys: KEYS,
  /* press a sequence: 'k1 add k2 eq' */
  seq: function (s) { s.split(/\s+/).filter(Boolean).forEach(function (k) { if (!press(k)) throw new Error('no key ' + k); }); return API.text(); },
  _eng: { evalSimple: evalSimple, toF: toF, Rat: Rat, exactDesc: exactDesc, recog: recog, decParts: decParts }
};
if (typeof document !== 'undefined') (function () {
  var old = document.getElementById('calc'); if (old) old.remove();
  var el = document.createElement('div'); el.id = 'calc'; el.tabIndex = 0; el.style.display = 'none';
  el.setAttribute('role', 'application'); el.setAttribute('aria-label', 'StudyNet scientific calculator. Type numbers and + − × ÷ on the keyboard, Enter for equals, Escape to clear.');
  var SM = [15, 52.9, 90.8, 128.7, 166.6, 204.5], BIGX = [13, 59.2, 105.4, 151.6, 197.8];
  var h = '';
  function keyHTML(id, x, y, w, ht, cls) {
    var k = KEYS[id], s = 'left:' + x / 10 + 'em;top:' + y / 10 + 'em;width:' + w / 10 + 'em;height:' + ht / 10 + 'em';
    var t = id.replace(/^k/, '');
    var out = '<button type="button" class="czk ' + cls + '" data-id="' + id + '" style="' + s + '" tabindex="-1" aria-label="' + t + '"><span class="czkl">' + (k.lab || '') + '</span></button>';
    if (k.sl || k.al) {
      out += '<div class="czleg" style="left:' + (x - 4) / 10 + 'em;top:' + (y - 10.5) / 10 + 'em;width:' + (w + 8) / 10 + 'em">' +
        (k.sl ? '<span class="czsl">' + k.sl + '</span>' : '') + (k.al ? '<span class="czal">' + k.al + '</span>' : '') + '</div>';
    }
    return out;
  }
  h += '<div class="czhead"><span class="czttl">Calculator</span><span class="czctl"><button type="button" data-z="-1" title="Smaller" aria-label="Make calculator smaller">−</button><button type="button" data-z="1" title="Bigger" aria-label="Make calculator bigger">+</button><button type="button" data-x="1" title="Close" aria-label="Close calculator">×</button></span></div>';
  h += '<div class="czbody">';
  h += '<div class="czbrand"><svg class="czmark" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.6" fill="none" stroke="currentColor" stroke-width="1.7"/>' +
    '<ellipse cx="12" cy="12" rx="5.2" ry="10.6" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M2.4 8.6h19.2M1.6 12h20.8M2.4 15.4h19.2" stroke="currentColor" stroke-width="1.1"/>' +
    '<text x="12.3" y="18.4" text-anchor="middle" font-size="18" font-weight="900" font-family="Georgia,Times New Roman,serif" font-style="italic" fill="currentColor" stroke="#2b2d33" stroke-width="2.2" paint-order="stroke">S</text></svg>' +
    '<span>StudyNet</span></div><div class="czmodel">SN-2 SCIENTIFIC</div>';
  h += '<div class="czsolar"><i></i><i></i><i></i><i></i></div>';
  h += '<div class="czbezel"><div class="czglass"><div class="czscr"><div class="czstat"></div><div class="czmain"></div></div></div></div>';
  // round keys + their printed labels
  [['shift', 30, '<span class="czsl">SHIFT</span>'], ['alpha', 63.5, '<span class="czal">ALPHA</span>'], ['menu', 187, 'MENU <span class="czsl">SETUP</span>'], ['on', 220, 'ON']].forEach(function (r) {
    h += '<div class="czrlab" style="left:' + (r[1] - 20) / 10 + 'em;top:18.5em"><span class="czrlt">' + r[2] + '</span></div>';
    h += '<button type="button" class="czk czround" data-id="' + r[0] + '" tabindex="-1" aria-label="' + r[0] + '" style="left:' + (r[1] - 11) / 10 + 'em;top:19.8em"></button>';
  });
  // cursor pad
  h += '<div class="czpad"><button type="button" class="czpk czpu" data-id="up" tabindex="-1" aria-label="up"></button><button type="button" class="czpk czpd" data-id="down" tabindex="-1" aria-label="down"></button>' +
    '<button type="button" class="czpk czpl" data-id="left" tabindex="-1" aria-label="left"></button><button type="button" class="czpk czpr" data-id="right" tabindex="-1" aria-label="right"></button><span class="czpc"></span></div>';
  h += keyHTML('optn', SM[0], 244, 31, 17, 'czkf') + keyHTML('x3', SM[1], 244, 31, 17, 'czkf') + keyHTML('abs', SM[4], 244, 31, 17, 'czkf') + keyHTML('logab', SM[5], 244, 31, 17, 'czkf');
  [['frac', 'sqrt', 'sq', 'pow', 'log', 'ln', 276], ['neg', 'dms', 'inv', 'sin', 'cos', 'tan', 307.5], ['sto', 'eng', 'lp', 'rp', 'sd', 'mplus', 339]].forEach(function (row) {
    for (var i = 0; i < 6; i++) h += keyHTML(row[i], SM[i], row[6], 31, 17, 'czkf');
  });
  [['k7', 'k8', 'k9', 'del', 'ac', 373], ['k4', 'k5', 'k6', 'mul', 'div', 411.5], ['k1', 'k2', 'k3', 'add', 'sub', 450], ['k0', 'dot', 'exp', 'ans', 'eq', 488.5]].forEach(function (row) {
    for (var i = 0; i < 5; i++) h += keyHTML(row[i], BIGX[i], row[5], 39, 26, 'czbig' + (row[i] === 'del' || row[i] === 'ac' ? ' czyel' : '') + (/^k\d$|dot/.test(row[i]) ? ' czdig' : ''));
  });
  h += '</div>';
  el.innerHTML = h;
  document.body.appendChild(el);
  var scr = el.querySelector('.czscr'), stEl = el.querySelector('.czstat'), mainEl = el.querySelector('.czmain'), scrollX = 0;
  function post() {
    var inr = mainEl.querySelector('.czin .czinr'), cur = mainEl.querySelector('.czcur');
    if (inr) {
      var box = inr.parentNode, cw = box.clientWidth, pad = cw * 0.08;
      if (cur && inr.contains(cur)) {
        var cx = cur.getBoundingClientRect().left - inr.getBoundingClientRect().left;
        if (cx - scrollX > cw - pad) scrollX = cx - cw + pad; else if (cx - scrollX < 0) scrollX = Math.max(0, cx - pad);
        if (inr.scrollWidth <= cw) scrollX = 0;
      } else scrollX = 0;
      inr.style.transform = 'translateX(' + (-scrollX) + 'px)';
      box.classList.toggle('czmoreL', scrollX > 1); box.classList.toggle('czmoreR', inr.scrollWidth - scrollX > cw + 1);
    } else scrollX = 0;
    var out = mainEl.querySelector('.czoutr');
    if (out && out.scrollWidth > out.parentNode.clientWidth + 1) out.parentNode.classList.add('czclip');
  }
  function draw() {
    var r = render();
    scr.className = 'czscr ' + r.cls + (S.on ? '' : ' czoff') + (SET.font === 'small' ? ' czfsm' : '') + (pixOk ? ' czpixon' : '');
    scr.style.setProperty('--czink', String(0.35 + 0.065 * SET.contrast));
    stEl.innerHTML = r.st; mainEl.innerHTML = r.body;
    try { post(); } catch (e) { /* layout only */ }
    pixelRender();
  }
  /* The screen is rendered from the same HTML into a 192 × 63 image (1 LCD pixel = 0.1em at a 10px base),
     every pixel is snapped fully on or off, and the result is scaled up with no smoothing, so characters sit on a real
     pixel grid like the dot-matrix screen in the manual. If the browser can't do this, the HTML shows instead. */
  var pix = document.createElement('canvas'), pctx = pix.getContext('2d'), pixOk = false, pixBusy = false, pixAgain = false, pixCss = null, blinkOn = true;
  pix.width = 192; pix.height = 63; pix.className = 'czpix'; pix.setAttribute('aria-hidden', 'true');
  scr.appendChild(pix);
  function lcdCss() {
    if (pixCss != null) return pixCss;
    var out = [];
    Array.prototype.forEach.call(document.styleSheets, function (sh) {
      var rules; try { rules = sh.cssRules; } catch (e) { return; }
      // Only rules for things inside the panel ("#calc .x"), never the panel's own position and size.
      Array.prototype.forEach.call(rules || [], function (ru) { if (ru.selectorText && /#calc[ ]/.test(ru.selectorText) && !/#calc[.:\[]/.test(ru.selectorText)) out.push(ru.cssText.replace(/#calc/g, '.czroot')); });
    });
    out.push('.czroot{position:relative;font-size:10px;width:192px;height:63px;overflow:hidden;margin:0;padding:0;font-family:Arial,sans-serif;line-height:normal}',
      '.czroot .czscr{position:relative!important;left:0!important;top:0!important;--czink:1!important;color:#000!important}',
      '.czroot .czscr::after,.czroot .czpix{display:none!important}',
      '.czroot .czscr>.czstat,.czroot .czscr>.czmain{opacity:1!important}',
      '.czroot *,.czroot *::before,.czroot *::after{animation:none!important;transition:none!important;text-shadow:none!important}',
      '.czroot.czboff .czcur::before,.czroot.czboff .czcur::after{opacity:0!important}');
    pixCss = out.join('\n');
    return pixCss;
  }
  function pixelRender() {
    if (el.style.display === 'none') return;
    if (pixBusy) { pixAgain = true; return; }
    pixBusy = true;
    var wrap = document.createElement('div'), st = document.createElement('style'), root = document.createElement('div'), sc = scr.cloneNode(true);
    var oldPix = sc.querySelector('.czpix'); if (oldPix) oldPix.remove();
    root.className = 'czroot' + (blinkOn ? '' : ' czboff');
    st.textContent = lcdCss();
    root.appendChild(sc); wrap.appendChild(st); wrap.appendChild(root);
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="192" height="63"><defs><filter id="b" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
      '<feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter></defs>' +
      '<g filter="url(#b)"><foreignObject x="0" y="0" width="192" height="63">' + new XMLSerializer().serializeToString(wrap) + '</foreignObject></g></svg>';
    var img = new Image();
    img.onload = function () {
      pctx.clearRect(0, 0, 192, 63); pctx.drawImage(img, 0, 0);
      if (!pixOk) { pixOk = true; scr.classList.add('czpixon'); }
      pixBusy = false; if (pixAgain) { pixAgain = false; pixelRender(); }
    };
    img.onerror = function () { pixOk = false; scr.classList.remove('czpixon'); pixBusy = false; };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  setInterval(function () { // the cursor blinks on the pixel screen too
    if (el.style.display === 'none' || !mainEl.querySelector('.czcur')) { if (!blinkOn) { blinkOn = true; } return; }
    blinkOn = !blinkOn; pixelRender();
  }, 530);
  onDraw = draw;
  onFlash = function (id) {
    var b = el.querySelector('[data-id="' + id + '"]'); if (!b) return;
    b.classList.add('czdn'); clearTimeout(b._t); b._t = setTimeout(function () { b.classList.remove('czdn'); }, 120);
  };
  el.addEventListener('mousedown', function (e) { if (e.target.closest('[data-id],.czctl button')) e.preventDefault(); });
  el.addEventListener('click', function (e) {
    var b = e.target.closest('[data-id]'); if (b) { press(b.getAttribute('data-id')); el.focus({ preventScroll: true }); return; }
    var z = e.target.closest('[data-z]'); if (z) { zoom(+z.getAttribute('data-z')); return; }
    if (e.target.closest('[data-x]')) API.toggle(false);
  });
  function fit() { // keep the whole panel on screen on small windows
    var r = el.getBoundingClientRect();
    while (el.offsetHeight > window.innerHeight - 8 && size > 7) { size--; el.style.fontSize = size + 'px'; }
    r = el.getBoundingClientRect();
    if (r.top < 0) { el.style.top = '4px'; el.style.bottom = 'auto'; }
    if (r.left < 0) { el.style.left = '4px'; el.style.right = 'auto'; }
  }
  var size = 14, zoomed = false; function zoom(d) { zoomed = true; size = Math.max(7, Math.min(20, size + d)); el.style.fontSize = size + 'px'; draw(); dock(); }
  // Desktop: the calculator docks on the right and the page slides left, so it never covers a question.
  function dock() {
    var on = el.style.display !== 'none' && window.innerWidth >= 900, root = document.documentElement;
    el.classList.toggle('czdock', on);
    root.classList.toggle('calc-docked', on);
    if (!on) { root.style.removeProperty('--calc-w'); return; }
    if (!zoomed) { size = Math.max(7, Math.min(16, Math.floor((window.innerHeight - 40) / 57.5))); el.style.fontSize = size + 'px'; }
    el.style.left = el.style.top = el.style.right = el.style.bottom = '';
    root.style.setProperty('--calc-w', el.offsetWidth + 'px');
  }
  window.addEventListener('resize', function () { if (el.style.display !== 'none') dock(); });
  el.style.fontSize = size + 'px';
  (function () {
    var hd = el.querySelector('.czhead'), sx, sy, ox, oy, dr = false;
    hd.addEventListener('pointerdown', function (e) { if (e.target.closest('button') || el.classList.contains('czdock')) return; dr = true; sx = e.clientX; sy = e.clientY; var r = el.getBoundingClientRect(); ox = r.left; oy = r.top; hd.setPointerCapture(e.pointerId); });
    hd.addEventListener('pointermove', function (e) {
      if (!dr) return;
      el.style.left = Math.max(0, Math.min(window.innerWidth - 40, ox + e.clientX - sx)) + 'px';
      el.style.top = Math.max(0, Math.min(window.innerHeight - 30, oy + e.clientY - sy)) + 'px';
      el.style.right = 'auto'; el.style.bottom = 'auto';
    });
    hd.addEventListener('pointerup', function () { dr = false; });
  })();
  var KB = { '+': 'add', '*': 'mul', '/': 'div', '(': 'lp', ')': 'rp', '.': 'dot', ',': 'dot', 'Enter': 'eq', '=': 'eq', 'Backspace': 'del', 'Delete': 'del', 'Escape': 'ac',
    'ArrowLeft': 'left', 'ArrowRight': 'right', 'ArrowUp': 'up', 'ArrowDown': 'down', '^': 'pow' };
  el.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key, id = null;
    if (/^[0-9]$/.test(k)) id = 'k' + k;
    else if (KB[k]) id = KB[k];
    else if (k === '-') {
      var T = S.ed.toks, p = T[S.ed.cur - 1];
      id = (S.scr === 'calc' && S.st === 'edit' && (p === undefined || p === '(' || p === '|' || /[+−×÷(,]$|^\^|\[$|neg/.test(p))) ? 'neg' : 'sub';
    }
    else if (k === '!') { press('shift'); id = 'inv'; }
    else if (k === '%') { press('shift'); id = 'ans'; }
    if (id) { e.preventDefault(); e.stopPropagation(); press(id); }
  });
  var fontAsked = false;
  function lcdFont() { // the key-legend face (the LCD itself is drawn pixel by pixel, below)
    if (fontAsked) return; fontAsked = true;
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Saira+Semi+Condensed:wght@500;600;700&display=swap';
    document.head.appendChild(l);
  }
  API.toggle = function (force) {
    var show = force != null ? !!force : el.style.display === 'none';
    if (show) lcdFont();
    el.style.display = show ? 'block' : 'none';
    if (show) {
      // Phones: start nearly as wide as the screen so the keys are big enough to tap (- makes it smaller, drag to move).
      if (!zoomed && window.innerWidth < 600) { size = Math.max(7, Math.floor(Math.min(window.innerWidth * 0.94 / 26, window.innerHeight * 0.86 / 57))); el.style.fontSize = size + 'px'; }
      dock();
      if (!el.classList.contains('czdock')) fit();
      draw(); el.focus({ preventScroll: true });
    } else dock();
    document.querySelectorAll('[data-calc]').forEach(function (b) { b.setAttribute('aria-pressed', show ? 'true' : 'false'); });
    return show;
  };
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-calc]'); if (b) API.toggle(); });
  API.el = el; API.draw = draw;
  draw();
})();
if (typeof window !== "undefined") window.__calc = API;
if (typeof module === "object" && module && module.exports && typeof document === "undefined") module.exports = API;

})();
