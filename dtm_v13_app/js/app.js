// Confronto HR-DTM-5m v1.1 / v1.3 — Palermo Hub
// Dati prodotti da scripts/genera_confronto.py (data/stats.json, tiles/*, data/fonti_dtm.geojson)
'use strict';

const BASE_URL = new URL('.', document.baseURI).href;
const CENTER = [13.35, 38.14692];
const ZOOM = 11.6;
const BOUNDS = [13.10, 37.94, 13.60, 38.33];

const fmt = (v, d = 1) => Number(v).toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });
const sgn = (v, d = 1) => (v > 0 ? '+' : '') + fmt(v, d);

// Palette: identica a scripts/genera_confronto.py
const RGB = c => `rgb(${c.join(',')})`;
const DZ = {
  cols: [[5,48,97],[33,102,172],[146,197,222],null,[244,165,130],[214,96,77],[103,0,31]],
  labels: ['≤ −5 m', '−5 … −2 m', '−2 … −0,5 m', '|Δ| < 0,5 m (trasparente)', '0,5 … 2 m', '2 … 5 m', '≥ 5 m'],
  title: 'Δ quota (v1.3 − v1.1)',
  note: 'Blu: la v1.3 è più bassa. Rosso: la v1.3 è più alta. Le differenze sotto 0,5 m sono rese trasparenti.',
};
const DS = {
  cols: [[0,68,27],[27,120,55],[127,191,123],null,[175,141,195],[118,42,131],[64,0,75]],
  labels: ['≤ −8°', '−8 … −3°', '−3 … −1°', '|Δ| < 1° (trasparente)', '1 … 3°', '3 … 8°', '≥ 8°'],
  title: 'Δ pendenza (v1.3 − v1.1)',
  note: 'Verde: versante meno ripido nella v1.3. Viola: più ripido. Pendenza v1.3 calcolata sul DEM nativo.',
};

// ── Modalità / card ────────────────────────────────────────
const MODES = {
  diffq:  { title: 'Δ quota',      desc: 'Dove cambia l’altezza del terreno', color: '#2166ac', layers: ['rel13', 'diffq'] },
  diffs:  { title: 'Δ pendenza',   desc: 'Dove cambiano i versanti',          color: '#762a83', layers: ['rel13', 'diffs'] },
  rilievo:{ title: 'Rilievo',      desc: 'Ombreggiatura v1.1 contro v1.3',    color: '#7080a8', layers: ['rel11', 'rel13'] },
  fonti:  { title: 'Fonti del dato', desc: 'Rilievo di origine e anno',       color: '#e07800', layers: ['rel13', 'fonti-fill', 'fonti-line'] },
};
const ALL_LAYERS = ['rel11', 'rel13', 'diffq', 'diffs', 'fonti-fill', 'fonti-line'];
let mode = 'diffq';
let stats = null;
let uplGeo = null;

// ── Mappa ──────────────────────────────────────────────────
const posLayers = OFM_STYLES.positron.map(l => ({ ...l }));
const posIds = posLayers.map(l => l.id);
const tms = (path, extra = {}) => ({
  type: 'raster', tiles: [`${BASE_URL}${path}/{z}/{x}/{y}.png`], tileSize: 256,
  minzoom: 8, maxzoom: 15, scheme: 'tms', ...extra,
});
const ATTR = 'DTM: HR-DTM-5m, Panza et al. 2026 (CC BY 4.0)';

const map = new maplibregl.Map({
  container: 'map',
  hash: true,
  attributionControl: false,
  maxPitch: 75,
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
      terrain13: { type: 'raster-dem', tiles: [`${BASE_URL}tiles/terrain_v13/{z}/{x}/{y}.png`], encoding: 'terrarium', tileSize: 256, minzoom: 8, maxzoom: 15, attribution: ATTR },
      terrain11: { type: 'raster-dem', tiles: [`${BASE_URL}../docs/tiles/terrain/{z}/{x}/{y}.png`], encoding: 'terrarium', tileSize: 256, minzoom: 8, maxzoom: 15, attribution: ATTR },
      ctr2k: { type: 'raster', tiles: ['https://siciliahub.github.io/Tiles/ctr_pa_2k/{z}/{x}/{y}.png'], tileSize: 256, maxzoom: 18, attribution: 'CTC - Carta tecnica comunale 2k – 2006' },
      rel11:  tms('../docs/tiles/rilievo', { attribution: ATTR }),
      rel13:  tms('tiles/rilievo_v13', { attribution: ATTR }),
      diffq:  tms('tiles/diff_quota'),
      diffs:  tms('tiles/diff_pendenza'),
      fonti:  { type: 'geojson', data: `${BASE_URL}data/fonti_dtm.geojson` },
      upl:    { type: 'geojson', data: `${BASE_URL}../docs/geojson/upl.geojson`, promoteId: 'fid' },
    },
    layers: [
      ...posLayers,
      { id: 'satellite', type: 'raster', source: 'satellite', layout: { visibility: 'none' } },
      { id: 'ctr2k', type: 'raster', source: 'ctr2k', layout: { visibility: 'none' } },
      { id: 'rel11', type: 'raster', source: 'rel11', layout: { visibility: 'none' }, paint: { 'raster-fade-duration': 0 } },
      { id: 'rel13', type: 'raster', source: 'rel13', paint: { 'raster-opacity': 0.5, 'raster-fade-duration': 0 } },
      { id: 'diffq', type: 'raster', source: 'diffq', paint: { 'raster-opacity': 0.85, 'raster-fade-duration': 0 } },
      { id: 'diffs', type: 'raster', source: 'diffs', layout: { visibility: 'none' }, paint: { 'raster-opacity': 0.85, 'raster-fade-duration': 0 } },
      { id: 'fonti-fill', type: 'fill', source: 'fonti', layout: { visibility: 'none' },
        paint: { 'fill-color': ['match', ['get', 'Name'], 'DTM 2m - ATA 2012 2013', '#2458c8', '#e07800'], 'fill-opacity': 0.4 } },
      { id: 'fonti-line', type: 'line', source: 'fonti', layout: { visibility: 'none' },
        paint: { 'line-color': '#1a2a50', 'line-width': 1.2, 'line-dasharray': [3, 2] } },
      { id: 'upl-hit', type: 'fill', source: 'upl', paint: { 'fill-color': '#000', 'fill-opacity': 0 } },
      { id: 'upl-line', type: 'line', source: 'upl', paint: { 'line-color': '#1a2a50', 'line-opacity': 0.35, 'line-width': 0.8 } },
      { id: 'upl-sel', type: 'line', source: 'upl', filter: ['==', ['get', 'fid'], -1],
        paint: { 'line-color': '#e07800', 'line-width': 3 } },
    ],
  },
});

// ── Scala metrica custom (come app precedente) ─────────────
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
const STATIC_ATTR = [['MapLibre GL JS', 'https://maplibre.org/'], ['DTM: HR-DTM-5m, Panza et al. 2026 (CC BY 4.0)', 'https://zenodo.org/records/24009736'], ['CTC – Carta tecnica comunale 2k 2006', null]];
function buildAttrib(base) {
  const parts = [];
  [...BASE_ATTR[base], ...STATIC_ATTR].forEach(([label, url], i) => {
    if (i) parts.push(document.createTextNode(' | '));
    if (url) { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = label; parts.push(a); }
    else parts.push(document.createTextNode(label));
  });
  el('attrib-text').replaceChildren(...parts);
}

// scala, attribuzioni e logo si spostano insieme al pannello destro
function syncPanelPos(open) { ['map-scale', 'attrib-wrap', 'ods-logo'].forEach(id => el(id).classList.toggle('panel-open', open)); }

// ── Stato visuale ──────────────────────────────────────────
const el = id => document.getElementById(id);
let opacity = 0.85;
let mix = 1;
let cmpOn = false;   // confronto a slider scelto (solo modalità Rilievo)
let cmpPct = 50;     // posizione maniglia in %
let ovA = null, ovB = null;
const cmpActive = () => mode === 'rilievo' && cmpOn && !is3d;

function applyMode() {
  const on = new Set(MODES[mode].layers);
  const cmp = cmpActive();
  ALL_LAYERS.forEach(id => map.setLayoutProperty(id, 'visibility', on.has(id) && !(cmp && (id === 'rel11' || id === 'rel13')) ? 'visible' : 'none'));
  const rilievo = mode === 'rilievo';
  el('mix-wrap').hidden = !rilievo;
  el('fade-ctl').hidden = cmpOn;
  el('cmp-note').hidden = !cmpOn;
  document.querySelectorAll('[data-cmp]').forEach(b => b.classList.toggle('active', (b.dataset.cmp === 'slider') === cmpOn));
  setCompare(cmp);
  applyOpacity();
  document.querySelectorAll('.rp-card').forEach(c => {
    const a = c.dataset.mode === mode;
    c.classList.toggle('active', a);
    c.setAttribute('aria-pressed', a);
  });
  renderLegend();
}

function applyOpacity() {
  if (mode === 'rilievo') {
    [ovA, ovB].forEach(o => o && o.isStyleLoaded() && o.setPaintProperty('rel', 'raster-opacity', opacity));
    map.setPaintProperty('rel11', 'raster-opacity', opacity);
    map.setPaintProperty('rel13', 'raster-opacity', opacity * mix);
  } else {
    map.setPaintProperty('rel13', 'raster-opacity', 0.5);
    ['diffq', 'diffs'].forEach(id => map.setPaintProperty(id, 'raster-opacity', opacity));
    map.setPaintProperty('fonti-fill', 'fill-opacity', Math.min(opacity, 0.7));
  }
}

function legendData() {
  if (mode === 'diffq' || mode === 'diffs') {
    const def = mode === 'diffq' ? DZ : DS;
    const pct = stats ? (mode === 'diffq' ? stats.dz : stats.ds).classi_pct : null;
    return { title: def.title, note: def.note + (pct ? ' Le percentuali sono sulle celle del confine comunale.' : ''),
      items: def.labels.map((l, i) => ({ label: l, color: def.cols[i] ? RGB(def.cols[i]) : null, pct: pct ? pct[i] : null })) };
  }
  if (mode === 'rilievo') {
    return { title: 'Rilievo ombreggiato', items: [],
      note: (cmpOn ? '' : 'Trascina il cursore per sfumare dalla v1.1 alla v1.3. ') + 'Le differenze di ombreggiatura sono sottili: la v1.3 appare più liscia sui versanti e senza gli artefatti di allineamento della v1.2.' };
  }
  const names = new Map();
  (map.querySourceFeatures('fonti') || []).forEach(f => names.set(f.properties.Name, f.properties.Date));
  if (!names.size) names.set('DTM 2m - ATA 2012 2013', '2012-2013');
  return { title: 'Fonti del dato',
    note: 'Bordi generalizzati a 20 m (approssimati). Fuori dal poligono LiDAR il terreno deriva dal modello TINITALY a 10 m.',
    items: [...names].map(([n, d]) => ({ label: n, color: n === 'DTM 2m - ATA 2012 2013' ? '#2458c8' : '#e07800', tag: d && d !== 'null' ? d : 'n.d.' })) };
}

function legendRow(it, bars) {
  const row = document.createElement('div'); row.className = 'lg-row';
  const sw = document.createElement('span'); sw.className = 'lg-sw' + (it.color ? '' : ' none');
  if (it.color) sw.style.background = it.color;
  const tx = document.createElement('span'); tx.textContent = it.label;
  row.append(sw, tx);
  if (bars) {
    const pc = document.createElement('span'); pc.className = 'lg-pct';
    pc.textContent = it.pct != null ? fmt(it.pct) + '%' : (it.tag || '');
    row.append(pc);
    if (it.pct != null) {
      const bar = document.createElement('div'); bar.className = 'lg-bar';
      const fill = document.createElement('i'); fill.style.width = Math.max(it.pct, 0.4) + '%';
      if (it.color) fill.style.background = it.color;
      bar.append(fill); row.append(bar);
    }
  }
  return row;
}

function renderLegend() {
  const d = legendData();
  // pannello destro (con percentuali)
  el('legend-title').textContent = d.title;
  el('legend-note').textContent = d.note;
  el('legend').replaceChildren(...d.items.map(it => legendRow(it, true)));
  // legenda in mappa (compatta, come nell'app precedente)
  const ml = el('map-legend');
  ml.hidden = d.items.length === 0;
  const t = document.createElement('div'); t.className = 'map-legend-title'; t.textContent = d.title;
  ml.replaceChildren(t, ...d.items.map(it => legendRow(it, false)));
}

// ── Card ───────────────────────────────────────────────────
function buildCards() {
  const wrap = el('cards');
  Object.entries(MODES).forEach(([k, m]) => {
    const b = document.createElement('button'); b.className = 'rp-card'; b.dataset.mode = k; b.type = 'button';
    const line = document.createElement('div'); line.className = 'rp-card-line'; line.style.background = m.color;
    const ti = document.createElement('div'); ti.className = 'rp-card-title'; ti.textContent = m.title;
    const de = document.createElement('div'); de.className = 'rp-card-desc'; de.textContent = m.desc;
    b.append(line, ti, de);
    b.addEventListener('click', () => { mode = k; applyMode(); });
    wrap.append(b);
  });
}

// ── KPI, ranking, grafico ──────────────────────────────────
function buildKpis() {
  const dz = stats.dz, ds = stats.ds;
  const items = [
    [fmt(100 - dz.oltre['0.5'], 0) + '%', 'delle celle è invariato (differenza sotto 0,5 m)'],
    [fmt(dz.oltre['2']) + '%', 'delle celle cambia di oltre 2 m'],
    [sgn(dz.media, 2) + ' m', 'differenza media di quota (v1.3 − v1.1)'],
    [fmt(ds.pendenza_media_v11) + '° → ' + fmt(ds.pendenza_media_v13) + '°', 'pendenza media comunale: praticamente uguale'],
  ];
  const box = el('kpis'); box.replaceChildren();
  items.forEach(([v, l]) => {
    const d = document.createElement('div'); d.className = 'kpi';
    const b = document.createElement('b'); b.textContent = v;
    const s = document.createElement('span'); s.textContent = l;
    d.append(b, s); box.append(d);
  });
}

let showAll = false;
function buildUpl() {
  const box = el('upl-list'); box.replaceChildren();
  const rows = showAll ? stats.upl : stats.upl.slice(0, 8);
  rows.forEach(r => {
    const wrap = document.createElement('div'); wrap.className = 'upl-wrap';
    const b = document.createElement('button'); b.className = 'upl-row'; b.type = 'button';
    const n = document.createElement('span'); n.className = 'upl-name'; n.textContent = r.upl;
    const v = document.createElement('span'); v.className = 'upl-val'; v.textContent = fmt(r.pct_oltre2m) + '%';
    const m = document.createElement('span'); m.className = 'upl-meta';
    m.textContent = `Circ. ${r.circ} · Δ medio ${sgn(r.dz_media, 2)} m · ${fmt(r.area_km2)} km²`;
    b.append(n, v, m);
    b.addEventListener('click', () => focusUpl(r.upl));
    const c = document.createElement('button'); c.className = 'upl-cmp'; c.type = 'button'; c.textContent = '⇆';
    c.title = 'Confronta v1.1 / v1.3 su questa zona'; c.setAttribute('aria-label', 'Confronta v1.1 e v1.3 su ' + r.upl);
    c.addEventListener('click', () => compareUpl(r.upl));
    wrap.append(b, c); box.append(wrap);
  });
  el('upl-more').textContent = showAll ? 'Mostra solo le prime 8' : 'Mostra tutte le zone';
}

function setSel(fid) {
  const f = ['==', ['get', 'fid'], fid];
  map.setFilter('upl-sel', f);
  [ovA, ovB].forEach(o => o && o.isStyleLoaded() && o.setFilter('upl-sel', f));
}

function compareUpl(name) {
  if (is3d) set3d(false);
  mode = 'rilievo'; cmpOn = true; cmpPct = 50;
  applyMode();
  focusUpl(name);
}

function focusUpl(name) {
  if (!uplGeo) return;
  const f = uplGeo.features.find(x => x.properties.UPL === name);
  if (!f) return;
  setSel(f.properties.fid);
  const b = new maplibregl.LngLatBounds();
  const walk = c => (typeof c[0] === 'number' ? b.extend(c) : c.forEach(walk));
  walk(f.geometry.coordinates);
  map.fitBounds(b, { padding: { top: 60, bottom: 60, left: 80, right: window.innerWidth > 720 ? 400 : 40 }, maxZoom: 14.5, duration: 900 });
}

function buildChart() {
  if (typeof Chart === 'undefined') { el('chart-fasce').replaceWith(Object.assign(document.createElement('p'), { className: 'note', textContent: 'Grafico non disponibile (libreria non caricata).' })); return; }
  const f = stats.fasce_quota;
  new Chart(el('chart-fasce'), {
    type: 'bar',
    data: {
      labels: f.map(x => `${x.da < 0 ? 0 : x.da}–${x.a} m`),
      datasets: [
        { label: '95° percentile di |Δ| (m)', data: f.map(x => x.p95_abs), backgroundColor: '#2458c8', borderRadius: 4 },
        { label: 'Δ medio (m)', data: f.map(x => x.media), backgroundColor: '#e07800', borderRadius: 4 },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { family: 'Titillium Web', size: 11 } } } },
      scales: {
        x: { ticks: { font: { family: 'Titillium Web', size: 11 } }, grid: { display: false } },
        y: { ticks: { font: { family: 'Titillium Web', size: 11 } }, title: { display: true, text: 'metri', font: { family: 'Titillium Web', size: 11 } } },
      },
    },
  });
}

// ── Popup zona ─────────────────────────────────────────────
function bindPopup() {
  map.on('mouseenter', 'upl-hit', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'upl-hit', () => { map.getCanvas().style.cursor = ''; });
  map.on('click', 'upl-hit', e => {
    if (cmpActive()) { setSel(e.features[0].properties.fid); return; }
    const p = e.features[0].properties;
    const r = stats && stats.upl.find(x => x.upl === p.UPL);
    const pop = new maplibregl.Popup({ maxWidth: '280px' }).setLngLat(e.lngLat);
    const root = document.createElement('div');
    const t = document.createElement('div'); t.className = 'pp-title'; t.textContent = p.UPL;
    const s = document.createElement('div'); s.className = 'pp-sub'; s.textContent = `Circoscrizione ${p.circoscrizione}`;
    root.append(t, s);
    const add = (k, v) => { const row = document.createElement('div'); row.className = 'pp-row'; const a = document.createElement('span'); a.textContent = k; const b = document.createElement('b'); b.textContent = v; row.append(a, b); root.append(row); };
    if (r) {
      add('Celle con |Δ quota| > 2 m', fmt(r.pct_oltre2m) + '%');
      add('Δ quota medio', sgn(r.dz_media, 2) + ' m');
      add('|Δ quota| medio', fmt(r.dz_abs_media, 2) + ' m');
      add('Δ pendenza media', sgn(r.ds_media, 2) + '°');
      add('Area', fmt(r.area_km2) + ' km²');
    } else add('Dati', 'non disponibili');
    pop.setDOMContent(root).addTo(map);
    setSel(p.fid);
  });
}

// ── Confronto a slider (due mappe trasparenti sincronizzate sopra la principale) ──
function makeOverlay(container, path) {
  const o = new maplibregl.Map({
    container, interactive: false, attributionControl: false, fadeDuration: 0,
    center: map.getCenter(), zoom: map.getZoom(), bearing: map.getBearing(), pitch: 0,
    style: {
      version: 8,
      sources: { rel: tms(path), upl: { type: 'geojson', data: `${BASE_URL}../docs/geojson/upl.geojson`, promoteId: 'fid' } },
      layers: [
        { id: 'rel', type: 'raster', source: 'rel', paint: { 'raster-opacity': opacity, 'raster-fade-duration': 0 } },
        { id: 'upl-line', type: 'line', source: 'upl', layout: { visibility: el('tb-upl').classList.contains('on') ? 'visible' : 'none' },
          paint: { 'line-color': '#1a2a50', 'line-opacity': 0.35, 'line-width': 0.8 } },
        { id: 'upl-sel', type: 'line', source: 'upl', filter: map.getFilter('upl-sel'), paint: { 'line-color': '#e07800', 'line-width': 3 } },
      ],
    },
  });
  o.on('load', () => { applyOpacity(); o.setFilter('upl-sel', map.getFilter('upl-sel')); });
  return o;
}
function syncOverlays() {
  const v = { center: map.getCenter(), zoom: map.getZoom(), bearing: map.getBearing(), pitch: 0 };
  [ovA, ovB].forEach(o => o && o.jumpTo(v));
}
function setCmpPos(pct) {
  cmpPct = Math.max(2, Math.min(98, pct));
  el('map-a').style.clipPath = `inset(0 ${100 - cmpPct}% 0 0)`;
  el('map-b').style.clipPath = `inset(0 0 0 ${cmpPct}%)`;
  el('cmp-line').style.left = el('cmp-handle').style.left = cmpPct + '%';
  el('cmp-handle').setAttribute('aria-valuenow', Math.round(cmpPct));
}
function setCompare(on) {
  if (on && !ovA) {
    ovA = makeOverlay('map-a', '../docs/tiles/rilievo');
    ovB = makeOverlay('map-b', 'tiles/rilievo_v13');
    map.on('move', syncOverlays);
    map.on('resize', () => { ovA.resize(); ovB.resize(); });
  }
  el('cmp').hidden = !on;
  el('map-a').classList.toggle('on', on);
  el('map-b').classList.toggle('on', on);
  if (on) { ovA.resize(); ovB.resize(); syncOverlays(); setCmpPos(cmpPct); }
}
function bindCompare() {
  const h = el('cmp-handle');
  const pos = e => setCmpPos(e.clientX / window.innerWidth * 100);
  h.addEventListener('pointerdown', e => { h.setPointerCapture(e.pointerId); h.dataset.drag = '1'; e.preventDefault(); });
  h.addEventListener('pointermove', e => { if (h.dataset.drag) pos(e); });
  h.addEventListener('pointerup', () => { delete h.dataset.drag; });
  h.addEventListener('pointercancel', () => { delete h.dataset.drag; });
  h.addEventListener('keydown', e => {
    const d = { ArrowLeft: -2, ArrowDown: -2, ArrowRight: 2, ArrowUp: 2, Home: -100, End: 100 }[e.key];
    if (d !== undefined) { e.preventDefault(); setCmpPos(cmpPct + d); }
  });
  document.querySelectorAll('[data-cmp]').forEach(b => b.addEventListener('click', () => {
    cmpOn = b.dataset.cmp === 'slider';
    if (cmpOn && is3d) set3d(false);
    applyMode();
    renderLegend();
  }));
}

// ── Terreno 3D ─────────────────────────────────────────────
let is3d = false, dem = 'v13', exag = 1.5;
function applyTerrain() { map.setTerrain({ source: dem === 'v13' ? 'terrain13' : 'terrain11', exaggeration: exag }); }
function set3d(on) {
  is3d = on;
  if (on) applyMode();
  el('tb-3d').classList.toggle('active', on);
  el('tb-3d').setAttribute('aria-pressed', on);
  el('sec-3d').hidden = !on;
  if (on) { applyTerrain(); map.easeTo({ pitch: 62, bearing: -25, duration: 1200 }); }
  else { map.setTerrain(null); map.easeTo({ pitch: 0, bearing: 0, duration: 800 }); applyMode(); }
}

// ── Toolbar e pannello ─────────────────────────────────────
function bindUi() {
  document.querySelectorAll('[data-basemap]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-basemap]').forEach(x => x.classList.toggle('active', x === b));
    const sat = b.dataset.basemap === 'satellite';
    map.setLayoutProperty('satellite', 'visibility', sat ? 'visible' : 'none');
    buildAttrib(b.dataset.basemap);
    posIds.forEach(id => map.setLayoutProperty(id, 'visibility', sat ? 'none' : 'visible'));
  }));
  el('tb-fullscreen').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => toast('Schermo intero non disponibile'));
  });
  el('tb-upl').addEventListener('click', e => {
    const on = e.currentTarget.classList.toggle('on');
    e.currentTarget.setAttribute('aria-pressed', on);
    map.setLayoutProperty('upl-line', 'visibility', on ? 'visible' : 'none');
    [ovA, ovB].forEach(o => o && o.isStyleLoaded() && o.setLayoutProperty('upl-line', 'visibility', on ? 'visible' : 'none'));
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
  el('tb-3d').addEventListener('click', () => set3d(!is3d));
  document.querySelectorAll('[data-dem]').forEach(b => b.addEventListener('click', () => {
    dem = b.dataset.dem;
    document.querySelectorAll('[data-dem]').forEach(x => x.classList.toggle('active', x === b));
    if (is3d) applyTerrain();
  }));
  el('ex-range').addEventListener('input', e => { exag = e.target.value / 10; el('ex-val').textContent = '×' + fmt(exag); if (is3d) applyTerrain(); });
  el('tb-home').addEventListener('click', () => {
    setSel(-1);
    map.flyTo({ center: CENTER, zoom: ZOOM, pitch: 0, bearing: 0 });
  });
  el('rp-toggle').addEventListener('click', () => {
    const open = el('rp-wrap').classList.toggle('open');
    el('rp-toggle').setAttribute('aria-expanded', open);
    syncPanelPos(open);
  });
  document.querySelectorAll('.rp-tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.rp-tab').forEach(x => {
      const on = x === t;
      x.classList.toggle('active', on); x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      el('pane-' + x.dataset.pane).hidden = !on;
    });
  }));
  el('op-range').addEventListener('input', e => { opacity = e.target.value / 100; el('op-val').textContent = e.target.value + '%'; applyOpacity(); });
  el('mix-range').addEventListener('input', e => { mix = e.target.value / 100; applyOpacity(); });
  let blinkT = null;
  el('btn-blink').addEventListener('click', e => {
    if (blinkT) { clearInterval(blinkT); blinkT = null; e.target.textContent = 'Alterna v1.1 / v1.3'; return; }
    e.target.textContent = 'Ferma';
    blinkT = setInterval(() => { mix = mix > 0.5 ? 0 : 1; el('mix-range').value = mix * 100; applyOpacity(); }, 900);
  });
  el('upl-more').addEventListener('click', () => { showAll = !showAll; buildUpl(); });
  if (window.innerWidth <= 720) el('rp-wrap').classList.remove('open');
  syncPanelPos(el('rp-wrap').classList.contains('open'));
  buildAttrib('osm');
  el('attrib-btn').addEventListener('click', () => { const p = el('attrib-panel'); p.hidden = !p.hidden; el('attrib-btn').setAttribute('aria-expanded', String(!p.hidden)); });
}

function toast(msg) { const t = el('toast'); t.textContent = msg; t.hidden = false; setTimeout(() => { t.hidden = true; }, 6000); }

// ── Avvio ──────────────────────────────────────────────────
buildCards();
bindUi();
bindCompare();
map.on('load', async () => {
  applyMode();
  bindPopup();
  try {
    const [s, g] = await Promise.all([
      fetch(`${BASE_URL}data/stats.json`).then(r => { if (!r.ok) throw new Error('stats ' + r.status); return r.json(); }),
      fetch(`${BASE_URL}../docs/geojson/upl.geojson`).then(r => { if (!r.ok) throw new Error('upl ' + r.status); return r.json(); }),
    ]);
    stats = s; uplGeo = g;
    buildKpis(); buildUpl(); buildChart(); renderLegend();
  } catch (err) {
    console.error(err);
    toast('Statistiche non caricate: ' + err.message);
  }
});
map.on('sourcedata', e => { if (e.sourceId === 'fonti' && e.isSourceLoaded && mode === 'fonti') renderLegend(); });
