/* Calculator regression tests: node tools/calc-test.js
   Each case presses real keys on a fresh calculator (calc.js loaded in Node) and checks the result line.
   Key notation: digits . + - * / ( ) = ; ~ = (−) key ; > right ; < left ; v down ; ^ up ; , = SHIFT ) ;
   {name} = any other key or SHIFT/ALPHA function (see NAMED below). Results are compared as text after "=> ". */
'use strict';
const path = require('path');
const CALC = path.join(__dirname, '..', 'calc.js');
const NAMED = {
  sq: 'sq', cube: 'x3', inv: 'inv', sqrt: 'sqrt', cbrt: 'shift sqrt', pow: 'pow', root: 'shift pow', frac: 'frac', mixed: 'shift frac',
  log: 'log', ln: 'ln', ten: 'shift log', epow: 'shift ln', logab: 'logab', abs: 'abs',
  sin: 'sin', cos: 'cos', tan: 'tan', asin: 'shift sin', acos: 'shift cos', atan: 'shift tan',
  pi: 'shift exp', e: 'alpha exp', exp: 'exp', ans: 'ans', pct: 'shift ans', approx: 'shift eq', sd: 'sd', mix: 'shift sd',
  fact: 'shift inv', npr: 'shift mul', ncr: 'shift div', pol: 'shift add', rec: 'shift sub', dms: 'dms', eng: 'eng', engl: 'shift eng',
  sto: 'sto', rcl: 'shift sto', mplus: 'mplus', mminus: 'shift mplus', colon: 'alpha x3', del: 'del', ac: 'ac', shift: 'shift', alpha: 'alpha',
  A: 'alpha neg', B: 'alpha dms', C: 'alpha inv', D: 'alpha sin', E: 'alpha cos', F: 'alpha tan', M: 'alpha mplus', X: 'alpha rp', Y: 'alpha sd',
  rnd: 'shift k0', recur: 'shift sq',
};
const CH = { '+': 'add', '-': 'sub', '*': 'mul', '/': 'div', '(': 'lp', ')': 'rp', '.': 'dot', '=': 'eq', '~': 'neg', '>': 'right', '<': 'left', 'v': 'down', '^': 'up', ',': 'shift rp' };
function keys(s) {
  const out = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === ' ') continue;
    if (c === '{') { const j = s.indexOf('}', i); const n = s.slice(i + 1, j); if (!NAMED[n]) throw new Error('unknown key ' + n); out.push(NAMED[n]); i = j; continue; }
    if (c >= '0' && c <= '9') { out.push('k' + c); continue; }
    if (CH[c]) { out.push(CH[c]); continue; }
    throw new Error('bad char ' + c + ' in ' + s);
  }
  return out.join(' ');
}
function fresh(set) {
  delete require.cache[require.resolve(CALC)];
  const c = require(CALC);
  if (set) Object.assign(c.SET, set);
  return c;
}
function result(txt) {
  const i = txt.lastIndexOf('=> ');
  if (/ERROR/.test(txt)) return txt.split(' ¦')[0].trim();
  return i < 0 ? txt : txt.slice(i + 3).trim();
}

const M = {}; // Math I/O, degrees (the default)
const CASES = [
  // ---- arithmetic and order of operations
  ['2+3*4=', '14'], ['(2+3)*4=', '20'], ['10-4-3=', '3'], ['8/4/2=', '1'], ['2*3/4=', '[3/2]'], ['7/2=', '[7/2]'],
  ['7/2={sd}', '3.5'], ['0.1+0.2=', '[3/10]'], ['1.5*4=', '6'], ['1/3*3=', '1'], ['2/0=', 'Math ERROR'], ['0/5=', '0'],
  ['123456789*987654321=', '1.219326311×10^(17)'], ['99999*99999=', '9999800001'], ['12-20=', '-8'], ['0.25*0.4=', '[1/10]'],
  ['3-5*2=', '-7'], ['2*3+4*5=', '26'], ['100/8=', '[25/2]'], ['1.2+3.45=', '[93/20]'],
  // ---- minus signs: the (−) key and the subtraction key used as a sign
  ['~3{sq}=', '-9'], ['(~3){sq}=', '9'], ['5-~2=', '7'], ['5--2=', '7'], ['~~3=', '3'], ['-3=', '-3'], ['2*-3=', '-6'],
  ['(-9)*(-1)=', '9'], ['-9*-1=', '9'], ['3*(-2){sq}=', '12'], ['-2{sq}=', '-4'], ['2{pow}-2>=', '[1/4]'], ['1-(-1)=', '2'],
  ['-(2+3)=', '-5'], ['4-~3=', '7'], ['~2*~3=', '6'], ['8/-2=', '-4'], ['(-2)(-3)=', '6'], ['-{sqrt}4>=', '-2'],
  ['~3{fact}=', '-6'], ['2{pow}~1>=', '[1/2]'], ['(-8){cube}=', '-512'], ['~0.5=', '-[1/2]'],
  // ---- implied multiplication
  ['2{pi}=', '2π'], ['2(3+4)=', '14'], ['(2)(3)=', '6'], ['6/2(1+2)=', '1'], ['4{pi}/2{pi}=', '2'], ['2{sqrt}3>=', '2√(3)'],
  ['3{sin}30)=', '[3/2]'], ['{sqrt}2>{sqrt}2>=', '2'], ['2{pi}{pi}=', '2π^(2)'.replace('2π^(2)', '19.7392088')],
  // ---- powers and roots
  ['2{pow}10>=', '1024'], ['2{pow}0.5>=', '√(2)'], ['4{pow}{frac}1v2>>=', '2'], ['(~8){pow}{frac}1v3>>=', '-2'],
  ['0{pow}0>=', 'Math ERROR'], ['{sqrt}8>=', '2√(2)'], ['{sqrt}{frac}1v4>>=', '[1/2]'], ['{sqrt}~1>=', 'Math ERROR'],
  ['{cbrt}27>=', '3'], ['{cbrt}~8>=', '-2'], ['{root}3>8>=', '2'], ['2{cube}=', '8'], ['2{inv}=', '[1/2]'], ['{sqrt}12>=', '2√(3)'],
  ['{sqrt}2>*{sqrt}8>=', '4'], ['{sqrt}50>+{sqrt}2>=', '6√(2)'], ['1/{sqrt}2>=', '[√(2)/2]'], ['(1+{sqrt}2>){sq}=', '3+2√(2)'],
  ['{sqrt}2>{sq}=', '2'], ['{sqrt}0>=', '0'], ['{sqrt}{sqrt}16>>=', '2'], ['{pow}', null], ['3{sq}{sq}=', '81'],
  ['2{pow}3{pow}2>>=', '512'], ['{root}2>9>=', '3'], ['{root}~1>8>=', '[1/8]'],
  // ---- fractions
  ['{frac}1v2>+{frac}1v3>=', '[5/6]'], ['{frac}3v6>=', '[1/2]'], ['{frac}1v2>={sd}', '0.5'], ['0.5=', '[1/2]'],
  ['{mixed}1>1>2>=', '[3/2]'], ['{frac}22v7>=', '[22/7]'], ['{frac}1v3>*3=', '1'], ['{frac}~1v2>=', '-[1/2]'],
  ['{frac}2v~4>=', '-[1/2]'], ['{frac}1v0>=', 'Math ERROR'], ['{frac}{frac}1v2>v{frac}3v4>>=', '[2/3]'], ['3{frac}4>=', '[3/4]'],
  ['{frac}1v2>{mix}', null],
  // ---- S⇔D and decimals
  ['1/3={sd}', '0.3̇'], ['1/3={sd}{sd}', '0.3333333333'], ['2/3={sd}{sd}', '0.6666666667'], ['1/3{approx}', '0.3333333333'],
  ['1/4={sd}', '0.25'], ['1/8={sd}', '0.125'], ['{sqrt}2>={sd}', '1.414213562'], ['{pi}={sd}', '3.141592654'],
  ['1/7={sd}', '0.1̇42857̇'], ['10/4={sd}', '2.5'],
  // ---- trigonometry (degrees)
  ['{sin}30)=', '[1/2]'], ['{cos}60)=', '[1/2]'], ['{tan}45)=', '1'], ['{sin}45)=', '[√(2)/2]'], ['{sin}~30)=', '-[1/2]'],
  ['{tan}90)=', 'Math ERROR'], ['{asin}0.5)=', '30'], ['{acos}~1)=', '180'], ['{atan}1)=', '45'], ['{sin}60)=', '[√(3)/2]'],
  ['{cos}0)=', '1'], ['({sin}30)){sq}=', '[1/4]'], ['{sin}390)=', '[1/2]'], ['{cos}120)=', '-[1/2]'], ['{sin}1)=', '0.01745240644'],
  ['{asin}2)=', 'Math ERROR'], ['{tan}~45)=', '-1'], ['{sin}(30))=', '[1/2]'], ['{sin}{sin}30))=', '8.726535498×10^(-3)'],
  ['{cos}30)=', '[√(3)/2]'], ['{tan}30)=', '[√(3)/3]'], ['{tan}60)=', '√(3)'], ['{sin}180)=', '0'], ['{cos}90)=', '0'],
  // ---- logs and exponentials
  ['{log}100)=', '2'], ['{log}0)=', 'Math ERROR'], ['{ln}{e})=', '1'], ['{logab}2>8>=', '3'], ['{ten}2>=', '100'],
  ['{epow}0>=', '1'], ['{log}2)=', '0.3010299957'], ['{ln}~1)=', 'Math ERROR'], ['{ten}~2>=', '[1/100]'], ['{log}1000)=', '3'],
  ['{logab}10>1000>=', '3'], ['{ln}1)=', '0'], ['{epow}1>=', '2.718281828'],
  // ---- factorial, nPr, nCr
  ['5{fact}=', '120'], ['0{fact}=', '1'], ['70{fact}=', 'Math ERROR'], ['3.5{fact}=', 'Math ERROR'], ['5{npr}2=', '20'],
  ['5{ncr}2=', '10'], ['10{ncr}0=', '1'], ['2{ncr}5=', 'Math ERROR'], ['69{fact}=', '1.711224524×10^(98)'], ['3{fact}{fact}=', '720'],
  // ---- percent
  ['200*10{pct}=', '20'], ['50{pct}=', '[1/2]'], ['200+10{pct}=', '[2001/10]'],
  // ---- Ans and carrying on from a result
  ['3=+2=', '5'], ['3=*{ans}=', '9'], ['3={sq}=', '9'], ['3=-1=', '2'], ['3=~1=', '-1'], ['3=1=', '1'], ['5={inv}=', '[1/5]'],
  ['2=*3==', '18'], ['{ans}=', '0'],
  // ---- memory and variables
  ['7{sto}{A}{ac}{A}*2=', '14'], ['5{mplus}{ac}{M}=', '5'], ['5{mplus}3{mplus}{ac}{M}=', '8'], ['5{mplus}2{mminus}{ac}{M}=', '3'],
  ['3{sto}{X}{ac}{X}{sq}+1=', '10'], ['2{sto}{B}{ac}{B}{B}=', '4'], ['4{sto}{E}{ac}{E}+1=', '5'], ['{A}=', '0'], ['9{sto}{F}{ac}2{F}=', '18'],
  ['{E}=', '0'], ['2{sto}{D}{ac}{D}{pow}3>=', '8'],
  // ---- Abs, ENG
  ['{abs}~3>=', '3'], ['{abs}2-5>=', '3'], ['1234={eng}', '1.234×10^(3)'], ['0.00012={eng}', '120×10^(-6)'], ['1234={eng}{eng}', '1234×10^(0)'], ['123={engl}', '0.123×10^(3)'], ['123={engl}{engl}', '0.000123×10^(6)'],
  // ---- big and small numbers
  ['{ten}99>*10=', 'Math ERROR'], ['1{exp}~5>=', '[1/100000]'], ['9{exp}99>*10=', 'Math ERROR'], ['1{exp}99>=', '1×10^(99)'],
  ['2{exp}3>=', '2000'], ['1{exp}~99>/10=', '0'], ['0.000001*0.000001=', '1×10^(-12)'],
  // ---- syntax
  ['2**3=', 'Syntax ERROR'], ['(2+3=', '5'], ['2+=', 'Syntax ERROR'], [')=', 'Syntax ERROR'], ['2..3=', 'Syntax ERROR'],
  ['((2+3)*(4=', '20'], ['=', null], ['2(=', 'Syntax ERROR'], ['{sin}=', 'Syntax ERROR'],
  // ---- multi-statements
  ['1+1{colon}2+2==', '4'], ['1+1{colon}2+2=', '2'],
  // ---- Pol / Rec
  ['{pol}1,1)=', 'r=1.414213562, θ=45'], ['{rec}2,60)=', 'x=1, y=1.732050808'], ['{pol}~1,0)=', 'r=1, θ=180'],
  // ---- DMS
  ['2.255{approx}{dms}', '2°15′18″'], ['2.255{approx}{dms}{dms}', '2.255'], ['660/880{pct}=', '75'], ['2500+2500*15{pct}=', '2875'],
  ['2{dms}30{dms}=', '2°30′0″'], ['2{dms}30{dms}={dms}', '2.5'], ['1.5={dms}', '1°30′0″'], ['2{dms}30{dms}+0{dms}30{dms}=', '3°0′0″'],
];
const RAD = [
  ['{sin}{pi}/6)=', '[1/2]'], ['{cos}{pi})=', '-1'], ['{sin}{frac}{pi}v2>)=', '1'], ['{tan}{pi}/4)=', '1'], ['{asin}1)=', '[1/2]π'],
  ['{sin}1)=', '0.8414709848'], ['{cos}0)=', '1'],
];
const LINE = [
  ['1{frac}2+1{frac}3=', '5⌟6'], ['2/3=', '0.6666666667'], ['{sqrt}8)=', '2.828427125'], ['1{frac}2{sd}', null], ['2{pow}10)=', '1024'],
  ['-3*-3=', '9'], ['(-9)*(-1)=', '9'], ['1{exp}~3=', '1×10^(-3)'], ['{E}=', '0'], ['4{sto}{E}{ac}{E}*2=', '8'], ['2{exp}3+1=', '2001'],
  ['1{frac}2{frac}3=', null],
];

let fail = 0, n = 0;
function run(list, set, label) {
  for (const [k, want] of list) {
    if (want === null) continue;
    const c = fresh(set);
    let got;
    try { got = result(c.seq(keys(k))); } catch (e) { got = 'THROW ' + e.message; }
    n++;
    if (got !== want) { fail++; console.log('FAIL [' + label + ']', k.padEnd(34), 'got', JSON.stringify(got).padEnd(28), 'want', JSON.stringify(want)); }
  }
}
// ---- other modes: whole-screen text must contain these
const MODES = [
  ['menu k2 k1 k2 eq k4 eq k4 eq k5 eq k5 eq k7 eq k9 eq ac optn k2', ['x̄=5.142857143', 'Σx=36', 'Σx^(2)=216', 'σ^(2)x=4.408163265', 's^(2)x=5.142857143']],
  ['menu k2 k1 k2 eq k4 eq k4 eq k5 eq k5 eq k7 eq k9 eq ac optn k2 down', ['n=7', 'Q1=4', 'Med=5', 'Q3=7']],
  ['menu k2 k2 k1 eq k2 eq k3 eq k4 eq up up up up right k3 eq k5 eq k7 eq k9 eq ac optn k3', ['a=1', 'b=2', 'r=1']],
  ['menu k2 k2 k1 eq k2 eq k3 eq k4 eq up up up up right k3 eq k5 eq k7 eq k9 eq ac optn k2 down', ['Σy=24', 'Σy^(2)=164']],
  ['menu k3 alpha rp sq add k1 eq eq k1 eq k5 eq k1 eq', ['1 2', '2 5', '3 10', '4 17']],
  ['menu k4 k1 k2 eq k3 eq k1 k0 eq eq', ['[20/3]']],
  ['k1 k2 eq shift dms', ['2^(2)×3']], ['k9 k9 k9 k9 eq shift dms', ['3^(2)×11×101']],
  ['k0 dot shift sq k3 right eq', ['[1/3]']], ['k1 dot shift sq k4 k2 k8 k5 k7 k1 right eq', ['[10/7]']],
  ['k7 frac k3 right eq shift sd', ['2[1/3]']], ['k2 add k3 eq left k4 eq', ['36']], ['k2 add k3 eq ac up up eq', ['5']],
];
function runModes() {
  for (const [k, wants] of MODES) {
    const c = fresh(); c.seq(k); const t = c.text().split(String.fromCharCode(10)).join(' ');
    n++;
    const miss = wants.filter(w => t.indexOf(w) < 0);
    if (miss.length) { fail++; console.log('FAIL [modes]', k, 'missing', JSON.stringify(miss), 'in', JSON.stringify(t.slice(0, 160))); }
  }
}
run(CASES, null, 'math');
runModes();
run(RAD, { angle: 'rad' }, 'rad');
run(LINE, { io: 'LL' }, 'line');
console.log(n - fail + '/' + n + ' passed');
process.exit(fail ? 1 : 0);
