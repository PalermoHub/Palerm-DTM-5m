// Cursore satellite / rilievo (DEM v1.3 colorato): attivo con la base SAT, vista piana, su tutta Palermo.
// Il satellite resta sulla mappa principale; il DEM è una seconda mappa trasparente sincronizzata,
// tagliata a sinistra della maniglia (stessa tecnica di confronto.js).
(function (root) {
  'use strict';
  const el = id => document.getElementById(id);
  const BASE = new URL('.', document.baseURI).href;
  let ov = null, pronto = false, op = 1, pct = 50, visibile = false;

  function crea() {
    const m = root.AppQualita.map;
    ov = new maplibregl.Map({
      container: 'map-swp', interactive: false, attributionControl: false, fadeDuration: 0, maxPitch: 80,
      center: m.getCenter(), zoom: m.getZoom(), bearing: m.getBearing(), pitch: m.getPitch(),
      style: {
        version: 8,
        sources: { dem: { type: 'raster', tiles: [`${BASE}tiles/dem_v13/{z}/{x}/{y}.png`], tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms' },
          terrain13: { type: 'raster-dem', tiles: [`${BASE}tiles/terrain_v13/{z}/{x}/{y}.png`], encoding: 'terrarium', tileSize: 256, minzoom: 8, maxzoom: 15 } },
        layers: [{ id: 'dem', type: 'raster', source: 'dem', paint: { 'raster-opacity': 1, 'raster-fade-duration': 0 } }],
      },
    });
    // lo stile si carica in modo asincrono: il terreno si può impostare solo dopo
    ov.on('load', () => { pronto = true; terreno(); sync(); opacita(op); });
    m.on('move', sync);
    m.on('resize', () => { ov.resize(); sync(); });
  }

  function sync() {
    if (!ov) return;
    const m = root.AppQualita.map;
    ov.jumpTo({ center: m.getCenter(), zoom: m.getZoom(), bearing: m.getBearing(), pitch: m.getPitch() });
  }

  // Stesso terreno 3D della mappa principale, così il DEM segue la camera inclinata.
  function terreno() {
    if (!pronto) return;
    const app = root.AppQualita;
    ov.setTerrain(app.in3d() ? { source: 'terrain13', exaggeration: app.exag3d() } : null);
  }

  // Trasparenza del rilievo: stesso valore per il cursore qui e per lo slider del pannello 3D.
  function opacita(v) {
    op = v;
    // opacità sul contenitore, non sul livello: in 3D le tile di zoom diversi si sovrappongono e con
    // raster-opacity < 1 la sovrapposizione si somma (fascia più chiara)
    el('map-swp').style.opacity = String(v);
    el('swp-opac-in').value = v;
    el('swp-opac-val').textContent = Math.round(v * 100) + '%';
    el('tbp-opac').value = v;
    el('tbp-opac-val').textContent = Math.round(v * 100) + '%';
  }

  function posiziona(p) {
    pct = Math.max(2, Math.min(98, p));
    el('map-swp').style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    el('swp-line').style.left = el('swp-handle').style.left = pct + '%';
    el('swp-handle').setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  // Da chiamare a ogni cambio di base, di 3D o di confronto caso 1.
  function aggiorna() {
    const app = root.AppQualita;
    const sat = !!document.querySelector('[data-basemap="satellite"].active');
    const on = sat && !app.confrontoAperto;
    if (on && !ov) crea();
    visibile = on;
    el('swp').hidden = !on;
    el('map-swp').classList.toggle('on', on);
    // con il cursore aperto serve la legenda delle quote; con SAT puro o in 3D no
    if (sat) el('map-legend-quota').hidden = !on;
    if (on) { ov.resize(); terreno(); sync(); posiziona(pct); }
  }

  function lega() {
    el('swp-opac-in').addEventListener('input', e => opacita(parseFloat(e.target.value)));
    const h = el('swp-handle');
    const pos = e => posiziona(e.clientX / window.innerWidth * 100);
    h.addEventListener('pointerdown', e => { h.setPointerCapture(e.pointerId); h.dataset.drag = '1'; e.preventDefault(); });
    h.addEventListener('pointermove', e => { if (h.dataset.drag) pos(e); });
    h.addEventListener('pointerup', () => { delete h.dataset.drag; });
    h.addEventListener('pointercancel', () => { delete h.dataset.drag; });
    h.addEventListener('keydown', e => {
      const n = root.PanoramicaLib.posizioneCursore(pct, e.key);
      if (n !== null) { e.preventDefault(); posiziona(n); }
    });
  }

  root.SwipeSat = { aggiorna, opacita, terreno: () => ov && terreno(), attivo: () => visibile };
  lega();
})(typeof self !== 'undefined' ? self : this);
