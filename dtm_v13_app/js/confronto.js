// Cursore prima/dopo (rilievo ombreggiato v1.1 originale / v1.3) valido solo attorno al caso 1:
// le tile rilievo_v11o e rilievo_v13c coprono solo quella zona (scripts/genera_tile.py).
// Due mappe trasparenti sincronizzate con la principale, tagliate a sinistra e a destra della maniglia.
(function (root) {
  'use strict';
  const el = id => document.getElementById(id);
  const BASE = new URL('.', document.baseURI).href;
  let ovA = null, ovB = null, attivo = false, pct = 50;

  function overlay(contenitore, nome) {
    const m = root.AppQualita.map;
    return new maplibregl.Map({
      container: contenitore, interactive: false, attributionControl: false, fadeDuration: 0,
      center: m.getCenter(), zoom: m.getZoom(), bearing: m.getBearing(), pitch: 0,
      style: {
        version: 8,
        sources: { rel: { type: 'raster', tiles: [`${BASE}tiles/${nome}/{z}/{x}/{y}.png`], tileSize: 256, minzoom: 13, maxzoom: 16, scheme: 'tms' } },
        layers: [{ id: 'rel', type: 'raster', source: 'rel', paint: { 'raster-opacity': 0.9, 'raster-fade-duration': 0 } }],
      },
    });
  }

  function sync() {
    const m = root.AppQualita.map;
    const v = { center: m.getCenter(), zoom: m.getZoom(), bearing: m.getBearing(), pitch: 0 };
    [ovA, ovB].forEach(o => o && o.jumpTo(v));
  }

  function posiziona(p) {
    pct = Math.max(2, Math.min(98, p));
    el('map-a').style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    el('map-b').style.clipPath = `inset(0 0 0 ${pct}%)`;
    el('cmp-line').style.left = el('cmp-handle').style.left = pct + '%';
    el('cmp-handle').setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  function mostra(si) {
    attivo = si;
    el('cmp').hidden = !si;
    el('map-a').classList.toggle('on', si);
    el('map-b').classList.toggle('on', si);
    // col cursore aperto si guardano i due rilievi: la mappa delle differenze resta nascosta
    // (e la legenda delle differenze non vale per i due rilievi: nascosta finché il cursore è aperto)
    root.AppQualita.confrontoAperto = si;
    if (root.SwipeSat) root.SwipeSat.aggiorna();
    root.AppQualita.applicaDiff();
  }

  function apri() {
    const app = root.AppQualita, c = app.map.getCenter();
    if (!root.PanoramicaLib.vicinoAlCaso1(app.dati, { lng: c.lng, lat: c.lat })) {
      app.toast('Il confronto è disponibile solo sul caso 1: premi il riquadro del caso 1 per andarci.');
      return;
    }
    if (!ovA) {
      ovA = overlay('map-a', 'rilievo_v11o');
      ovB = overlay('map-b', 'rilievo_v13c');
      app.map.on('move', sync);
      app.map.on('resize', () => { ovA.resize(); ovB.resize(); sync(); });
    }
    mostra(true);
    ovA.resize(); ovB.resize(); sync(); posiziona(pct);
    el('cmp-handle').focus();
  }

  function chiudi() { if (attivo) mostra(false); }

  function lega() {
    const h = el('cmp-handle');
    const pos = e => posiziona(e.clientX / window.innerWidth * 100);
    h.addEventListener('pointerdown', e => { h.setPointerCapture(e.pointerId); h.dataset.drag = '1'; e.preventDefault(); });
    h.addEventListener('pointermove', e => { if (h.dataset.drag) pos(e); });
    h.addEventListener('pointerup', () => { delete h.dataset.drag; });
    h.addEventListener('pointercancel', () => { delete h.dataset.drag; });
    h.addEventListener('keydown', e => {
      const n = root.PanoramicaLib.posizioneCursore(pct, e.key);
      if (n !== null) { e.preventDefault(); posiziona(n); }
    });
    el('cmp-close').addEventListener('click', chiudi);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') chiudi(); });
  }

  root.ConfrontoCaso1 = { apri, chiudi, attivo: () => attivo };
  lega();
})(typeof self !== 'undefined' ? self : this);
