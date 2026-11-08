/* Bake set-up for tools/calc-bake.html. Not part of the site.
   tools/bake.py uses this page for two things only: the layout (window.__geom: where every key, the screen, the solar
   panel and the cursor pad sit) and the printed ink (?pass=inkbody: legends printed on the case; ?pass=inkkeys: legends
   printed on the keys). Everything else (plastic, keys, lighting, shadows) is rendered by tools/bake.py. */
(function () {
  var pass = (location.search.match(/pass=(\w+)/) || [])[1] || 'inkbody';
  window.__calc.toggle(true);
  var el = document.getElementById('calc');
  el.classList.remove('czdock');
  el.classList.add('czbake', 'czb-' + pass);
  el.style.cssText = 'display:block;position:absolute;left:0;top:0;right:auto;bottom:auto;font-size:36px';
  document.documentElement.classList.remove('calc-docked');

  window.__geom = function () {
    var body = el.querySelector('.czbody').getBoundingClientRect(), em = parseFloat(el.style.fontSize);
    function r(n) { var b = n.getBoundingClientRect(); return [(b.left - body.left) / em, (b.top - body.top) / em, b.width / em, b.height / em]; }
    return {
      em: em, body: [0, 0, body.width / em, body.height / em],
      keys: Array.prototype.map.call(el.querySelectorAll('.czk'), function (k) {
        return { id: k.getAttribute('data-id'), kind: k.classList.contains('czround') ? 'round' : k.classList.contains('czyel') ? 'yellow' : k.classList.contains('czbig') ? 'big' : 'fn', r: r(k) };
      }),
      pad: r(el.querySelector('.czpad')), bezel: r(el.querySelector('.czbezel')), glass: r(el.querySelector('.czglass')),
      screen: r(el.querySelector('.czscr')), solar: r(el.querySelector('.czsolar'))
    };
  };
  document.body.setAttribute('data-ready', '1');
})();
