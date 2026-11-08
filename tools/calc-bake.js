/* Bake set-up for tools/calc-bake.html (?pass=body or ?pass=keys). Not part of the site. */
(function () {
  var pass = /pass=keys/.test(location.search) ? 'keys' : 'body';
  var NS = 'http://www.w3.org/2000/svg';
  // Lighting filters: the key shapes' own alpha becomes a height map, lit from the top left.
  var defs = '<svg xmlns="' + NS + '" width="0" height="0" style="position:absolute">' +
    '<filter id="kb" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="7" result="b"/>' +
      '<feSpecularLighting in="b" surfaceScale="6" specularConstant=".5" specularExponent="22" lighting-color="#fff" result="s"><feDistantLight azimuth="240" elevation="50"/></feSpecularLighting>' +
      '<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>' +
      '<feDiffuseLighting in="b" surfaceScale="6" diffuseConstant="1.12" lighting-color="#fff" result="d"><feDistantLight azimuth="240" elevation="62"/></feDiffuseLighting>' +
      '<feComposite in="d" in2="SourceAlpha" operator="in" result="d2"/>' +
      '<feBlend in="SourceGraphic" in2="d2" mode="multiply" result="m"/>' +
      '<feComposite in="s2" in2="m" operator="arithmetic" k1="0" k2=".32" k3="1" k4="0"/>' +
    '</filter>' +
    '<filter id="kbs" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="4" result="b"/>' +
      '<feSpecularLighting in="b" surfaceScale="4" specularConstant=".45" specularExponent="26" lighting-color="#fff" result="s"><feDistantLight azimuth="240" elevation="50"/></feSpecularLighting>' +
      '<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>' +
      '<feDiffuseLighting in="b" surfaceScale="4" diffuseConstant="1.1" lighting-color="#fff" result="d"><feDistantLight azimuth="240" elevation="62"/></feDiffuseLighting>' +
      '<feComposite in="d" in2="SourceAlpha" operator="in" result="d2"/>' +
      '<feBlend in="SourceGraphic" in2="d2" mode="multiply" result="m"/>' +
      '<feComposite in="s2" in2="m" operator="arithmetic" k1="0" k2=".28" k3="1" k4="0"/>' +
    '</filter></svg>';
  document.body.insertAdjacentHTML('afterbegin', defs);

  // Round keys: fine radial lines from the centre, like the brushed "record" finish on the real round keys.
  var rec = '<svg xmlns="' + NS + '" viewBox="0 0 200 200">';
  for (var i = 0; i < 360; i++) {
    var t = i * Math.PI / 180, c = Math.cos(t), s = Math.sin(t), w = i % 2 ? '255,255,255' : '0,0,0', o = i % 2 ? (0.05 + 0.04 * ((i * 7919) % 5) / 4) : 0.16;
    rec += '<line x1="' + (100 + 6 * c).toFixed(2) + '" y1="' + (100 + 6 * s).toFixed(2) + '" x2="' + (100 + 100 * c).toFixed(2) + '" y2="' + (100 + 100 * s).toFixed(2) + '" stroke="rgba(' + w + ',' + o + ')" stroke-width=".55"/>';
  }
  rec += '</svg>';
  document.documentElement.style.setProperty('--record', 'url("data:image/svg+xml,' + encodeURIComponent(rec) + '")');

  window.__calc.toggle(true);
  var el = document.getElementById('calc');
  el.classList.remove('czdock');
  el.classList.add('czbake', 'czb-' + pass);
  el.style.cssText = 'display:block;position:absolute;left:0;top:0;right:auto;bottom:auto;font-size:36px';
  document.documentElement.classList.remove('calc-docked');

  // The cursor pad: four keys around a centre, split by an X, inside a dark surround (like the GT X's pad).
  var pad = el.querySelector('.czpad');
  var W = 770, H = 530, cx = W / 2, cy = H / 2, k = Math.tan(31 * Math.PI / 180);
  var dy = cx * k; // where the dividing lines meet the sides
  function sector(points) { return points.map(function (p) { return p[0] + ',' + p[1]; }).join(' '); }
  var up = sector([[0, 0], [W, 0], [W, cy - dy], [cx, cy], [0, cy - dy]]);
  var dn = sector([[0, H], [W, H], [W, cy + dy], [cx, cy], [0, cy + dy]]);
  var lf = sector([[0, cy - dy], [cx, cy], [0, cy + dy]]);
  var rt = sector([[W, cy - dy], [cx, cy], [W, cy + dy]]);
  var svg = '<svg xmlns="' + NS + '" viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="position:absolute;inset:0;overflow:visible">' +
    '<defs>' +
      '<clipPath id="pin"><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (cx - 24) + '" ry="' + (cy - 22) + '"/></clipPath>' +
      '<mask id="gap"><rect width="' + W + '" height="' + H + '" fill="#fff"/>' +
        '<line x1="0" y1="' + (cy - dy) + '" x2="' + W + '" y2="' + (cy + dy) + '" stroke="#000" stroke-width="15"/>' +
        '<line x1="0" y1="' + (cy + dy) + '" x2="' + W + '" y2="' + (cy - dy) + '" stroke="#000" stroke-width="15"/>' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="22" ry="16" fill="#000"/></mask>' +
      '<linearGradient id="pk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b3d43"/><stop offset=".5" stop-color="#303237"/><stop offset="1" stop-color="#25262b"/></linearGradient>' +
      '<radialGradient id="pring" cx=".5" cy=".42" r=".62"><stop offset=".78" stop-color="#0b0b0d"/><stop offset=".93" stop-color="#16171a"/><stop offset="1" stop-color="#2c2e34"/></radialGradient>' +
      '<radialGradient id="pctr" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#1c1d21"/><stop offset="1" stop-color="#0c0c0e"/></radialGradient>' +
    '</defs>' +
    // surround: a recessed dark ring
    '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + cx + '" ry="' + cy + '" fill="url(#pring)"/>' +
    '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (cx - 1) + '" ry="' + (cy - 1) + '" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="2"/>' +
    // centre well
    '<ellipse cx="' + cx + '" cy="' + cy + '" rx="26" ry="19" fill="url(#pctr)"/>' +
    // the four keys, lit together so each gets its own bevel from the gaps between them
    '<g filter="url(#kb)"><g clip-path="url(#pin)" mask="url(#gap)">' +
      '<polygon points="' + up + '" fill="url(#pk)"/><polygon points="' + dn + '" fill="url(#pk)"/>' +
      '<polygon points="' + lf + '" fill="url(#pk)"/><polygon points="' + rt + '" fill="url(#pk)"/>' +
    '</g></g></svg>';
  pad.insertAdjacentHTML('afterbegin', svg);
  document.body.setAttribute('data-ready', '1');
})();
