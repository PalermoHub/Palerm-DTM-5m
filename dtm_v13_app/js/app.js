// HR-DTM-5m v1.1 / v1.3 a Palermo — Palermo Hub. Guscio dell'app: mappa, toolbar, legenda, interruttore
// Panoramica / Tecnico. Non calcola nulla: legge solo data/qualita.json (scripts/genera_qualita.py).
'use strict';

const BASE_URL = new URL('.', document.baseURI).href;
const CENTER = [13.35, 38.14692];
const ZOOM = 11.6;
const BOUNDS = [13.10, 37.94, 13.60, 38.33];
const el = id => document.getElementById(id);
const ATTR = 'DTM: HR-DTM-5m, Panza et al. 2026 (CC BY 4.0)';

const tms = (path, extra = {}) => ({
  type: 'raster', tiles: [`${BASE_URL}${path}/{z}/{x}/{y}.png`], tileSize: 256,
  minzoom: 8, maxzoom: 15, scheme: 'tms', ...extra,
});

// ── Mappa ──────────────────────────────────────────────────
const posLayers = OFM_STYLES.positron.map(l => ({ ...l }));
const posIds = posLayers.map(l => l.id);

const map = new maplibregl.Map({
  container: 'map',
  hash: true,
  attributionControl: false,
  maxPitch: 0,
  center: CENTER,
  zoom: ZOOM,
  maxBounds: [[BOUNDS[0] - 0.3, BOUNDS[1] - 0.2], [BOUNDS[2] + 0.3, BOUNDS[3] + 0.2]],
  style: {
    version: 8,
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sprite: OFM_STYLES.sprite,
    sources: {
      ...OFM_STYLES.sources,
      satellite: { type: 'raster', tileSize: 256, maxzoom: 18, attribution: '© Google',
        tiles: [0, 1, 2, 3].map(i => `https://mt${i}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}`) },
      ctr2k: { type: 'raster', tiles: ['https://siciliahub.github.io/Tiles/ctr_pa_2k/{z}/{x}/{y}.png'], tileSize: 256, maxzoom: 18, attribution: 'CTC - Carta tecnica comunale 2k – 2006' },
      dem: tms('tiles/dem_v13', { attribution: ATTR }),
      terrain13: { type: 'raster-dem', tiles: [`${BASE_URL}tiles/terrain_v13/{z}/{x}/{y}.png`], encoding: 'terrarium', tileSize: 256, minzoom: 8, maxzoom: 15, attribution: ATTR },
      diffcelle: tms('tiles/diff_celle', { attribution: ATTR }),
    },
    layers: [
      ...posLayers,
      { id: 'satellite', type: 'raster', source: 'satellite', layout: { visibility: 'none' } },
      { id: 'ctr2k', type: 'raster', source: 'ctr2k', layout: { visibility: 'none' } },
      { id: 'dem', type: 'raster', source: 'dem', paint: { 'raster-opacity': 1, 'raster-fade-duration': 0 } },
      { id: 'diffcelle', type: 'raster', source: 'diffcelle', paint: { 'raster-opacity': 0.9, 'raster-fade-duration': 0 } },
    ],
  },
});

// ── Scala metrica ──────────────────────────────────────────
function updateMapScale() {
  const bar = el('map-scale-bar'), label = el('map-scale-label');
  if (!bar || !label) return;
  const mpp = 156543.03392 * Math.cos(map.getCenter().lat * Math.PI / 180) / Math.pow(2, map.getZoom());
  const maxM = mpp * 120;
  const exp = Math.pow(10, Math.floor(Math.log10(maxM)));
  const nice = [1, 2, 5, 10].map(f => f * exp).find(v => v <= maxM) || exp;
  bar.style.width = Math.round(nice / mpp) + 'px';
  label.textContent = nice >= 1000 ? (nice / 1000) + ' km' : Math.round(nice) + ' m';
}
map.on('load', updateMapScale);
map.on('move', updateMapScale);

// ── Attribuzioni collassabili ──────────────────────────────
const BASE_ATTR = {
  osm: [['© OpenFreeMap', 'https://openfreemap.org/'], ['© OpenMapTiles', 'https://openmaptiles.org/'], ['© OpenStreetMap contributors', 'https://www.openstreetmap.org/copyright']],
  satellite: [['© Google', null]],
};
const STATIC_ATTR = [['MapLibre GL JS', 'https://maplibre.org/'], [ATTR, 'https://zenodo.org/records/24009736'], ['CTC – Carta tecnica comunale 2k 2006', null]];
function buildAttrib(base) {
  const parts = [];
  [...BASE_ATTR[base], ...STATIC_ATTR].forEach(([label, url], i) => {
    if (i) parts.push(document.createTextNode(' | '));
    if (url) { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = label; parts.push(a); }
    else parts.push(document.createTextNode(label));
  });
  el('attrib-text').replaceChildren(...parts);
}
function syncPanelPos(open) { ['map-scale', 'attrib-wrap', 'ods-logo'].forEach(id => el(id).classList.toggle('panel-open', open)); }

function toast(msg) { const t = el('toast'); t.textContent = msg; t.hidden = false; setTimeout(() => { t.hidden = true; }, 6000); }

// ── Dati e legenda ─────────────────────────────────────────
const AppQualita = { vista: 'panoramica', dati: null, map, diffOn: true, confrontoAperto: false };
window.AppQualita = AppQualita;

function avviso(testo) {
  const a = el('avviso-dati');
  a.textContent = testo || '';
  a.hidden = !testo;
}

// Carica data/qualita.json. Se manca o è malformato: avviso, nessuna cifra, nessun dato vecchio.
async function caricaDati() {
  let q = null, motivo = '';
  try {
    const r = await fetch(`${BASE_URL}data/qualita.json`, { cache: 'no-cache' });  // mai numeri vecchi dalla cache
    if (!r.ok) throw new Error('HTTP ' + r.status);
    q = await r.json();
    const v = QualitaLib.verificaQualita(q);
    if (!v.ok) { motivo = v.motivo; q = null; }
  } catch (e) {
    motivo = e.message; q = null;
  }
  if (!q) {
    avviso('Dati non disponibili (' + motivo + '). Rigenera con scripts/genera_qualita.py.');
    el('map-legend').hidden = true;
    map.setLayoutProperty('diffcelle', 'visibility', 'none');
    AppQualita.dati = null;
    return null;
  }
  avviso('');
  AppQualita.dati = q;
  return q;
}
// Differenze visibili solo se l'utente non le ha spente, ci sono i dati e il cursore del confronto è chiuso
AppQualita.applicaDiff = function () {
  const on = AppQualita.diffOn && !!AppQualita.dati && !AppQualita.confrontoAperto;
  map.setLayoutProperty('diffcelle', 'visibility', on ? 'visible' : 'none');
  const ml = el('map-legend');
  ml.hidden = !on || ml.children.length === 0;
  const b = el('tb-diff');
  b.classList.toggle('on', AppQualita.diffOn);
  b.setAttribute('aria-pressed', String(AppQualita.diffOn));
};
AppQualita.caricaDati = caricaDati;
AppQualita.toast = toast;
// porta la mappa su un riquadro (ovest, sud, est, nord), lasciando libero il pannello a destra
AppQualita.vaiA = function (bbox) {
  const aperto = el('rp-wrap').classList.contains('open') && window.innerWidth > 720;
  map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
    { padding: { top: 60, bottom: 60, left: 80, right: aperto ? 400 : 40 }, maxZoom: 15, duration: 900 });
};

// dal pannello Tecnico: mostra le differenze e porta la mappa sul riquadro; su telefono chiude il pannello che la coprirebbe
AppQualita.mostraSuMappa = function (bbox) {
  AppQualita.diffOn = true;
  AppQualita.applicaDiff();
  if (window.innerWidth <= 720) {
    el('rp-wrap').classList.remove('open');
    el('rp-toggle').setAttribute('aria-expanded', 'false');
    syncPanelPos(false);
  }
  AppQualita.vaiA(bbox);
};

// Segnaposto numerati, gli stessi dei casi del pannello Panoramica
const segnaposti = [];
function metti3Segnaposti(q) {
  segnaposti.splice(0).forEach(m => m.remove());
  if (!window.PanoramicaLib) return;
  for (const c of window.PanoramicaLib.posizioniCasi(q)) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'segnaposto'; b.textContent = String(c.n);
    b.title = c.n + ' · ' + c.titolo; b.setAttribute('aria-label', 'Punto ' + c.n + ': ' + c.titolo);
    b.dataset.caso = String(c.n);
    b.addEventListener('click', e => { e.stopPropagation(); AppQualita.vaiA(c.bbox); });
    segnaposti.push(new maplibregl.Marker({ element: b }).setLngLat([c.lng, c.lat]).addTo(map));
  }
}

// Evidenziazione reciproca: segnaposto sulla mappa <-> box del caso nel pannello destro
function evidenziaCaso(n, on) {
  document.querySelectorAll('.segnaposto[data-caso="' + n + '"], .caso[data-caso="' + n + '"]')
    .forEach(x => x.classList.toggle('evid', on));
}
document.addEventListener('mouseover', e => {
  const t = e.target.closest && e.target.closest('.segnaposto, .caso');
  if (t && t.dataset.caso) evidenziaCaso(t.dataset.caso, true);
});
document.addEventListener('mouseout', e => {
  const t = e.target.closest && e.target.closest('.segnaposto, .caso');
  if (t && t.dataset.caso && !t.contains(e.relatedTarget)) evidenziaCaso(t.dataset.caso, false);
});

function renderLegend(q) {
  const ml = el('map-legend');
  const voci = QualitaLib.legendaDiff(q);
  ml.hidden = voci.length === 0;
  if (!voci.length) return;
  const t = document.createElement('div'); t.className = 'map-legend-title'; t.textContent = q.palette_diff.titolo;
  const righe = voci.map(v => {
    const row = document.createElement('div'); row.className = 'lg-row';
    const sw = document.createElement('span'); sw.className = 'lg-sw'; sw.style.background = v.colore;
    if (v.etichetta === (q.palette_diff.identica || {}).etichetta && q.palette_diff.identica.alpha === 0) { sw.style.background = ''; sw.classList.add('none'); }
    const tx = document.createElement('span'); tx.textContent = v.etichetta;
    row.append(sw, tx);
    return row;
  });
  const nota = document.createElement('div'); nota.className = 'note'; nota.textContent = q.palette_diff.nota;
  ml.replaceChildren(t, ...righe, nota);
}

// ── Vista Panoramica / Tecnico ─────────────────────────────
function setVista(v) {
  AppQualita.vista = v;
  document.querySelectorAll('[data-vista-btn]').forEach(b => {
    const on = b.dataset.vistaBtn === v;
    b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
  });
  el('vista-panoramica').hidden = v !== 'panoramica';
  el('vista-tecnico').hidden = v !== 'tecnico';
  try { localStorage.setItem('dtm13-vista', v); } catch (e) { /* storage non disponibile */ }
}
AppQualita.setVista = setVista;

// ── Terreno 3D ─────────────────────────────────────────────
let is3d = false;
let exag3d = 1.5;
function applyOpacita3d(v) {
  // il rilievo colorato e il satellite condividono lo slider: abbassandolo traspare la base sotto
  ['dem', 'satellite'].forEach(id => map.setPaintProperty(id, 'raster-opacity', v));
}
function bind3dPanel() {
  el('tbp-exag').addEventListener('input', e => {
    exag3d = parseFloat(e.target.value);
    el('tbp-exag-val').textContent = exag3d.toFixed(1) + '×';
    if (is3d) map.setTerrain({ source: 'terrain13', exaggeration: exag3d });
  });
  el('tbp-opac').addEventListener('input', e => {
    const v = parseFloat(e.target.value);
    el('tbp-opac-val').textContent = Math.round(v * 100) + '%';
    applyOpacita3d(v);
  });
}
function set3d(on) {
  is3d = on;
  el('tb-3d').classList.toggle('active', on);
  el('tb-3d').setAttribute('aria-pressed', String(on));
  el('tb-panel-3d').hidden = !on;
  if (on) { map.setMaxPitch(80); map.setTerrain({ source: 'terrain13', exaggeration: exag3d }); map.easeTo({ center: [13.34, 38.115], zoom: 11.3, pitch: 60, bearing: -20, duration: 1400 }); }
  else { map.setTerrain(null); map.easeTo({ center: CENTER, zoom: ZOOM, pitch: 0, bearing: 0, duration: 800 }); map.once('moveend', () => { if (!is3d) map.setMaxPitch(0); }); }
}

// ── Toolbar e pannello ─────────────────────────────────────
function bindUi() {
  el('tb-diff').addEventListener('click', () => { AppQualita.diffOn = !AppQualita.diffOn; AppQualita.applicaDiff(); });
  el('tb-3d').addEventListener('click', () => set3d(!is3d));
  bind3dPanel();
  document.querySelectorAll('[data-basemap]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-basemap]').forEach(x => x.classList.toggle('active', x === b));
    const sat = b.dataset.basemap === 'satellite';
    map.setLayoutProperty('satellite', 'visibility', sat ? 'visible' : 'none');
    // col satellite il rilievo colorato coprirebbe la foto: resta solo la geometria 3D del DEM
    map.setLayoutProperty('dem', 'visibility', sat ? 'none' : 'visible');
    el('map-legend-quota').hidden = sat;
    posIds.forEach(id => map.setLayoutProperty(id, 'visibility', sat ? 'none' : 'visible'));
    buildAttrib(b.dataset.basemap);
  }));
  el('tb-fullscreen').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => toast('Schermo intero non disponibile'));
  });
  el('tb-ctr').addEventListener('click', e => {
    const on = e.currentTarget.classList.toggle('on');
    e.currentTarget.setAttribute('aria-pressed', on);
    map.setLayoutProperty('ctr2k', 'visibility', on ? 'visible' : 'none');
  });
  el('tb-zin').addEventListener('click', () => map.zoomIn());
  el('tb-zout').addEventListener('click', () => map.zoomOut());
  el('tb-north').addEventListener('click', () => map.resetNorthPitch ? map.resetNorthPitch() : map.easeTo({ bearing: 0, pitch: 0 }));
  const needle = el('compass-svg');
  map.on('rotate', () => { needle.style.transform = `rotate(${-map.getBearing()}deg)`; });
  el('tb-home').addEventListener('click', () => map.flyTo({ center: CENTER, zoom: ZOOM, pitch: 0, bearing: 0 }));
  el('rp-toggle').addEventListener('click', () => {
    const open = el('rp-wrap').classList.toggle('open');
    el('rp-toggle').setAttribute('aria-expanded', open);
    syncPanelPos(open);
  });
  document.querySelectorAll('[data-vista-btn]').forEach(b => b.addEventListener('click', () => setVista(b.dataset.vistaBtn)));
  if (window.innerWidth <= 720) el('rp-wrap').classList.remove('open');
  syncPanelPos(el('rp-wrap').classList.contains('open'));
  buildAttrib('osm');
  el('attrib-btn').addEventListener('click', () => { const p = el('attrib-panel'); p.hidden = !p.hidden; el('attrib-btn').setAttribute('aria-expanded', String(!p.hidden)); });
}

// ── Avvio ──────────────────────────────────────────────────
bindUi();
map.on('load', async () => {
  const q = await caricaDati();
  if (!q) return;
  renderLegend(q); AppQualita.applicaDiff();
  metti3Segnaposti(q);
  // le due viste sono costruite da js/panoramica.js e js/tecnico.js, se presenti
  if (window.PanoramicaUI) window.PanoramicaUI.costruisci(q, el('vista-panoramica'), AppQualita);
  if (window.TecnicoUI) window.TecnicoUI.costruisci(q, el('vista-tecnico'), AppQualita);
  let v0 = 'panoramica'; try { v0 = localStorage.getItem('dtm13-vista') || v0; } catch (e) { /* ignora */ }
  setVista(v0 === 'tecnico' ? 'tecnico' : 'panoramica');
});
