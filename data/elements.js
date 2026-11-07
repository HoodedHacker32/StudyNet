/* StudyNet — periodic table data (used by periodic.js on the Science page).
   All 118 elements: [atomic number, symbol, name, family].
   Junior Cycle detail (mass number of the most common isotope, state at room temperature)
   is given for the first 20, matching the class notes (e.g. chlorine 35, argon 40). */
window.SN_DATA = window.SN_DATA || {};
(function () {
  'use strict';
  var F = { h: 'hydrogen', a: 'alkali', e: 'alkaline', t: 'transition', p: 'post', m: 'metalloid', n: 'nonmetal', x: 'halogen', g: 'noble', l: 'lanthanide', c: 'actinide' };
  var raw = 'H Hydrogen h|He Helium g|Li Lithium a|Be Beryllium e|B Boron m|C Carbon n|N Nitrogen n|O Oxygen n|F Fluorine x|Ne Neon g|' +
    'Na Sodium a|Mg Magnesium e|Al Aluminium p|Si Silicon m|P Phosphorus n|S Sulfur n|Cl Chlorine x|Ar Argon g|K Potassium a|Ca Calcium e|' +
    'Sc Scandium t|Ti Titanium t|V Vanadium t|Cr Chromium t|Mn Manganese t|Fe Iron t|Co Cobalt t|Ni Nickel t|Cu Copper t|Zn Zinc t|' +
    'Ga Gallium p|Ge Germanium m|As Arsenic m|Se Selenium n|Br Bromine x|Kr Krypton g|Rb Rubidium a|Sr Strontium e|Y Yttrium t|Zr Zirconium t|' +
    'Nb Niobium t|Mo Molybdenum t|Tc Technetium t|Ru Ruthenium t|Rh Rhodium t|Pd Palladium t|Ag Silver t|Cd Cadmium t|In Indium p|Sn Tin p|' +
    'Sb Antimony m|Te Tellurium m|I Iodine x|Xe Xenon g|Cs Caesium a|Ba Barium e|La Lanthanum l|Ce Cerium l|Pr Praseodymium l|Nd Neodymium l|' +
    'Pm Promethium l|Sm Samarium l|Eu Europium l|Gd Gadolinium l|Tb Terbium l|Dy Dysprosium l|Ho Holmium l|Er Erbium l|Tm Thulium l|Yb Ytterbium l|' +
    'Lu Lutetium l|Hf Hafnium t|Ta Tantalum t|W Tungsten t|Re Rhenium t|Os Osmium t|Ir Iridium t|Pt Platinum t|Au Gold t|Hg Mercury t|' +
    'Tl Thallium p|Pb Lead p|Bi Bismuth p|Po Polonium p|At Astatine x|Rn Radon g|Fr Francium a|Ra Radium e|Ac Actinium c|Th Thorium c|' +
    'Pa Protactinium c|U Uranium c|Np Neptunium c|Pu Plutonium c|Am Americium c|Cm Curium c|Bk Berkelium c|Cf Californium c|Es Einsteinium c|Fm Fermium c|' +
    'Md Mendelevium c|No Nobelium c|Lr Lawrencium c|Rf Rutherfordium t|Db Dubnium t|Sg Seaborgium t|Bh Bohrium t|Hs Hassium t|Mt Meitnerium t|Ds Darmstadtium t|' +
    'Rg Roentgenium t|Cn Copernicium t|Nh Nihonium p|Fl Flerovium p|Mc Moscovium p|Lv Livermorium p|Ts Tennessine x|Og Oganesson g';
  // First 20: mass number (most common isotope) and state at room temperature.
  var MASS = [1, 4, 7, 9, 11, 12, 14, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35, 40, 39, 40];
  var GAS = { 1: 1, 2: 1, 7: 1, 8: 1, 9: 1, 10: 1, 17: 1, 18: 1, 36: 1, 54: 1, 86: 1 };
  var LIQUID = { 35: 1, 80: 1 };

  function place(z) { // [period, group]; lanthanides and actinides go in rows 9 and 10
    if (z === 1) return [1, 1];
    if (z === 2) return [1, 18];
    if (z <= 18) { var s = z <= 10 ? 3 : 11, p = z <= 10 ? 2 : 3, i = z - s; return [p, i < 2 ? i + 1 : i + 11]; }
    if (z <= 36) return [4, z - 18];
    if (z <= 54) return [5, z - 36];
    if (z <= 56) return [6, z - 54];
    if (z <= 71) return [9, z - 57 + 3];
    if (z <= 86) return [6, z - 68];
    if (z <= 88) return [7, z - 86];
    if (z <= 103) return [10, z - 89 + 3];
    return [7, z - 100];
  }
  window.SN_DATA.elements = raw.split('|').map(function (r, i) {
    var p = r.split(' '), z = i + 1, pos = place(z);
    var e = { z: z, sym: p[0], name: p[1], fam: F[p[2]], period: pos[0] > 7 ? (pos[0] === 9 ? 6 : 7) : pos[0], row: pos[0], group: pos[1] };
    e.fblock = pos[0] > 7;
    if (z <= 20) e.mass = MASS[i];
    e.state = GAS[z] ? 'gas' : LIQUID[z] ? 'liquid' : 'solid';
    return e;
  });
})();
