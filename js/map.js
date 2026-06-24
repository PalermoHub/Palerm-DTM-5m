// ── PMTiles protocol (MapLibre 5.x / tilev4 API) ──────────────────────────
const pmtilesProtocol = new pmtiles.Protocol();
maplibregl.addProtocol('pmtiles', pmtilesProtocol.tilev4.bind(pmtilesProtocol));

// ── Costanti ──────────────────────────────────────────────────────────────
const CENTER  = [13.32, 38.1026];
const ZOOM    = 11.51;
const BOUNDS  = [13.20, 38.01, 13.50, 38.26];

// Base URL assoluta: risolve correttamente sia in locale (http.server)
// che su GitHub Pages, sia in sottocartella che in radice.
const BASE_URL = new URL('.', document.baseURI).href;

// Costruisce un nodo attributione con link sicuro (niente innerHTML)
function makeAttribNode(text, href) {
  const frag = document.createDocumentFragment();
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = text;
    frag.appendChild(a);
  } else {
    frag.appendChild(document.createTextNode(text));
  }
  frag.appendChild(document.createTextNode(' | DTM: HRDTM5m@italia'));
  return frag;
}

// Sorgenti basemap
// opacity: trasparenza del layer raster — lascia trasparire l'hillshade sotto
const BASEMAPS = {
  osm: {
    type: 'raster',
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    tileSize: 256,
    attribution: '© OpenStreetMap contributors',
    attributionNode: makeAttribNode('© OpenStreetMap contributors', 'https://www.openstreetmap.org/copyright'),
    maxzoom: 18,
    opacity: 0.85
  },
  satellite: {
    type: 'raster',
    tiles: [
      'https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      'https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
    ],
    tileSize: 256,
    attribution: '© Google',
    attributionNode: makeAttribNode('© Google', null),
    maxzoom: 18,
    opacity: 1.0
  },
};

// ── Mappa ─────────────────────────────────────────────────────────────────
const map = new maplibregl.Map({
  container: 'map',
  hash: true,
  style: {
    version: 8,
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      basemap: BASEMAPS.osm,
      'ctr2k': {
        type: 'raster',
        tiles: ['https://siciliahub.github.io/Tiles/ctr_pa_2k/{z}/{x}/{y}.png'],
        tileSize: 256,
        maxzoom: 18,
        attribution: 'CTC - Carta tecnica comunale 2k – 2006'
      },
      'terrain-dem': {
        type: 'raster-dem',
        tiles: [`${BASE_URL}docs/tiles/terrain/{z}/{x}/{y}.png`],
        encoding: 'terrarium',
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        attribution: 'DTM: HRDTM5m@italia'
      },
      contours: {
        type: 'vector',
        url: 'pmtiles://https://palermohub.github.io/Palerm-DTM-5m/docs/tiles/contours.pmtiles',
        attribution: 'Curve di livello: DTM HRDTM5m@italia'
      },
      'griglia-dtm': {
        type: 'vector',
        tiles: [`${BASE_URL}docs/tiles/griglia_pbf/{z}/{x}/{y}.pbf`],
        minzoom: 8,
        maxzoom: 15,
        attribution: 'Analisi DTM: HRDTM5m@italia'
      },
      'elevation-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/elevazione/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Analisi elevazione: DTM HRDTM5m@italia'
      },
      'upl': {
        type: 'geojson',
        data: `${BASE_URL}docs/geojson/upl.geojson`
      }
    },
    layers: [
      // Background bianco (visibile dove non ci sono tile)
      { id: 'background', type: 'background', paint: { 'background-color': '#ffffff' } },

      // Hillshade — SOTTO il basemap, fornisce profondità al terreno
      {
        id: 'hillshade-layer',
        type: 'hillshade',
        source: 'terrain-dem',
        layout: { visibility: 'visible' },
        paint: {
          'hillshade-exaggeration': 0.6,
          'hillshade-shadow-color': '#283046',
          'hillshade-highlight-color': '#ffffff',
          'hillshade-accent-color': '#202040',
          'hillshade-illumination-direction': 180,
          'hillshade-illumination-anchor': 'map'
        }
      },

      // Basemap raster — SOPRA hillshade, con opacità per far trasparire il rilievo
      { id: 'basemap-layer', type: 'raster', source: 'basemap', paint: { 'raster-opacity': 0.85 } },

      // Mappa elevazione colorata — analisi DTM, disattiva di default
      {
        id: 'elevation-layer',
        type: 'raster',
        source: 'elevation-raster',
        layout: { visibility: 'visible' },
        paint: { 'raster-opacity': 0.70 }
      },

      // Overlay CTR — disattivo di default, si sovrappone alla basemap attiva
      {
        id: 'ctr2k-layer',
        type: 'raster',
        source: 'ctr2k',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.7 }
      },

      // UPL — confini amministrativi (fill invisibile per query + linee visibili)
      {
        id: 'upl-fill',
        type: 'fill',
        source: 'upl',
        layout: { visibility: 'visible' },
        paint: { 'fill-color': '#2458c8', 'fill-opacity': 0 }
      },
      {
        id: 'upl-line',
        type: 'line',
        source: 'upl',
        layout: { visibility: 'visible' },
        paint: {
          'line-color': '#2458c8',
          'line-width': 1.4,
          'line-opacity': 0.45,
          'line-dasharray': [4, 2]
        }
      },

      // Griglia analisi DTM 50m — punti vettoriali interrogabili (sopra tutti i raster)
      {
        id: 'griglia-circles',
        type: 'circle',
        source: 'griglia-dtm',
        'source-layer': 'griglia',
        layout: { visibility: 'visible' },
        minzoom: 8,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 4, 11, 6, 13, 8, 15, 12],
          'circle-color': 'transparent',
          'circle-stroke-width': 0,
          'circle-opacity': 0.01
        }
      },

      // Curve 10m — linee sottili, visibili da zoom 12
      {
        id: 'contours-10m-layer',
        type: 'line',
        source: 'contours',
        'source-layer': 'contours_10m',
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#dc2626',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 15, 0.8, 16, 1.0],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 13, 0.6, 15, 0.85]
        },
        minzoom: 12
      },

      // Curve 50m — linee principali, sempre visibili quando attive
      {
        id: 'contours-50m-layer',
        type: 'line',
        source: 'contours',
        'source-layer': 'contours_50m',
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#8b0000',
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.8, 12, 1.4, 15, 2.0],
          'line-opacity': 0.9
        }
      },

      // Etichette quota curve 10m (da zoom 14, spaziatura ridotta)
      {
        id: 'contours-10m-labels',
        type: 'symbol',
        source: 'contours',
        'source-layer': 'contours_10m',
        layout: {
          visibility: 'none',
          'symbol-placement': 'line',
          'symbol-spacing': 400,
          'text-field': ['concat', ['to-string', ['get', 'elevation']], ' m'],
          'text-size': 11,
          'text-font': ['Open Sans Regular'],
          'text-offset': [0, 0],
          'text-max-angle': 30,
          'text-keep-upright': true
        },
        paint: {
          'text-color': '#dc2626',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        },
        minzoom: 14
      },

      // Etichette quota curve 50m (da zoom 11, più frequenti e grandi)
      {
        id: 'contours-50m-labels',
        type: 'symbol',
        source: 'contours',
        'source-layer': 'contours_50m',
        layout: {
          visibility: 'none',
          'symbol-placement': 'line',
          'symbol-spacing': 300,
          'text-field': ['concat', ['to-string', ['get', 'elevation']], ' m'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 11, 12, 14, 15],
          'text-font': ['Open Sans Bold'],
          'text-offset': [0, 0],
          'text-max-angle': 30,
          'text-keep-upright': true
        },
        paint: {
          'text-color': '#8b0000',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        },
        minzoom: 11
      }
    ],
    terrain: {
      source: 'terrain-dem',
      exaggeration: 1.5
    }
  },
  center: CENTER,
  zoom: ZOOM,
  pitch: 23,
  bearing: -120.3,
  maxBounds: [
    [BOUNDS[0], BOUNDS[1]],
    [BOUNDS[2], BOUNDS[3]]
  ],
  attributionControl: false
});

// ── Scala metrica custom ──────────────────────────────────────────────────
function updateMapScale() {
  const scaleBar   = document.getElementById('map-scale-bar');
  const scaleLabel = document.getElementById('map-scale-label');
  if (!scaleBar || !scaleLabel) return;
  const center = map.getCenter();
  const zoom   = map.getZoom();
  const mpp    = 156543.03392 * Math.cos(center.lat * Math.PI / 180) / Math.pow(2, zoom);
  const maxPx  = 120;
  const maxM   = mpp * maxPx;
  // Arrotonda al numero "bello" più vicino
  const exp    = Math.pow(10, Math.floor(Math.log10(maxM)));
  const nice   = [1, 2, 5, 10].map(f => f * exp).find(v => v <= maxM) || exp;
  const barW   = Math.round(nice / mpp);
  scaleBar.style.width = barW + 'px';
  scaleLabel.textContent = nice >= 1000 ? (nice / 1000) + ' km' : Math.round(nice) + ' m';
}

map.on('load', updateMapScale);
map.on('move', updateMapScale);

// ── Stato locale ──────────────────────────────────────────────────────────
let terrainActive   = true;
let shadowActive    = true;
let contourActive   = false;
let currentExag     = 1.5;
let shadowIntensity = 0.6;
let sunMinutes      = 720;   // 12:00 (mezzogiorno solare)

// ── Calcolo azimuth solare ────────────────────────────────────────────────
// Approssimazione per Palermo (38°N): alba ~6:00, tramonto ~18:00.
// direction 90°=est, 180°=sud, 270°=ovest (MapLibre: gradi da nord, orario).
function sunAzimuth(minutes) {
  const h = minutes / 60;
  const rise = 6, set = 18;
  if (h <= rise || h >= set) return null;           // notte
  return 90 + ((h - rise) / (set - rise)) * 180;   // est→sud→ovest
}

function minutesToHHMM(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function applyHillshade() {
  const az = sunAzimuth(sunMinutes);
  if (az !== null) {
    map.setPaintProperty('hillshade-layer', 'hillshade-illumination-direction', az);
  }
  map.setPaintProperty('hillshade-layer', 'hillshade-exaggeration', shadowIntensity);
}

// ── Lookup aree UPL/Quartiere/Circoscrizione (ha) ────────────────────────
const uplAreas = { upl: {}, quartiere: {}, circoscrizione: {} };

map.on('load', () => {
  applyHillshade();

  fetch(`${BASE_URL}docs/geojson/upl.geojson`)
    .then(r => r.json())
    .then(({ features }) => {
      features.forEach(({ properties: p }) => {
        const ha = (p.area || 0) / 10000;
        if (p.UPL)             uplAreas.upl[p.UPL] = (uplAreas.upl[p.UPL] || 0) + ha;
        if (p.Quartiere)       uplAreas.quartiere[p.Quartiere] = (uplAreas.quartiere[p.Quartiere] || 0) + ha;
        if (p.circoscrizione)  uplAreas.circoscrizione[p.circoscrizione] = (uplAreas.circoscrizione[p.circoscrizione] || 0) + ha;
      });
    });
});

// ── Toolbar: Home ─────────────────────────────────────────────────────────
document.getElementById('tb-home').addEventListener('click', () => {
  map.flyTo({ center: CENTER, zoom: ZOOM, pitch: 23, bearing: -120.3, duration: 900 });
});

// ── Toolbar: Basemap ──────────────────────────────────────────────────────
document.querySelectorAll('#tb-basemaps .tb-radio').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('#tb-basemaps .tb-radio').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const def = BASEMAPS[this.dataset.basemap];
    map.getSource('basemap').setTiles(def.tiles);
    map.setPaintProperty('basemap-layer', 'raster-opacity', def.opacity);
    const attribEl = document.querySelector('.maplibregl-ctrl-attrib-inner');
    if (attribEl && def.attributionNode) {
      attribEl.replaceChildren(def.attributionNode.cloneNode(true));
    }
  });
});

// ── Toolbar: CTR toggle ───────────────────────────────────────────────────
document.getElementById('tb-ctr').addEventListener('click', function () {
  this.classList.toggle('on');
  const on = this.classList.contains('on');
  map.setLayoutProperty('ctr2k-layer', 'visibility', on ? 'visible' : 'none');
  document.getElementById('tb-ctr-opacity').style.display = on ? 'flex' : 'none';
});

document.getElementById('tb-ctr-opacity-slider').addEventListener('input', function () {
  map.setPaintProperty('ctr2k-layer', 'raster-opacity', parseFloat(this.value));
});

// ── Toolbar: UPL confini quartieri ────────────────────────────────────────
// upl-fill rimane sempre visibile (opacity 0) per queryRenderedFeatures nel popup
document.getElementById('tb-upl').addEventListener('click', function () {
  this.classList.toggle('on');
  const vis = this.classList.contains('on') ? 'visible' : 'none';
  map.setLayoutProperty('upl-line', 'visibility', vis);
});

// ── Toolbar: Curve di livello ─────────────────────────────────────────────
document.getElementById('tb-contour').addEventListener('click', function () {
  this.classList.toggle('on');
  contourActive = this.classList.contains('on');
  const vis = contourActive ? 'visible' : 'none';
  ['contours-10m-layer','contours-50m-layer','contours-10m-labels','contours-50m-labels'].forEach(id => {
    map.setLayoutProperty(id, 'visibility', vis);
  });
  document.getElementById('legend-contour').classList.toggle('visible', contourActive);
});

// ── Toolbar: Fullscreen ───────────────────────────────────────────────────
const SVG_NS = 'http://www.w3.org/2000/svg';

function makeFsIcon(compress) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '14'); svg.setAttribute('height', '14');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'currentColor'); svg.setAttribute('stroke', 'none');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', compress
    ? 'M5 19h4v2H3v-6h2v4zm14 0v-4h2v6h-6v-2h4zM5 5v4H3V3h6v2H5zm14 4V5h-4V3h6v6h-2z'
    : 'M3 3h6v2H5v4H3V3zm12 0h6v6h-2V5h-4V3zM3 15h2v4h4v2H3v-6zm16 4h-4v2h6v-6h-2v4z');
  svg.appendChild(path);
  return svg;
}

document.getElementById('tb-fullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  const btn = document.getElementById('tb-fullscreen');
  const isFs = !!document.fullscreenElement;
  btn.replaceChildren(makeFsIcon(isFs));
  btn.classList.toggle('active', isFs);
});

// ── Toolbar: Nord / orientamento ──────────────────────────────────────────
document.getElementById('tb-north').addEventListener('click', () => {
  map.resetNorthPitch({ duration: 600 });
});

// ── Toolbar: Toggle 3D / Piano ────────────────────────────────────────────
document.getElementById('tb-3d').addEventListener('click', function () {
  const panel = document.getElementById('tb-panel-3d');
  const panelWasOpen = panel.style.display !== 'none';

  terrainActive = !terrainActive;
  this.classList.toggle('active', terrainActive);
  document.getElementById('tb-3d-label').textContent = terrainActive ? '3D' : '2D';

  if (terrainActive) {
    map.setTerrain({ source: 'terrain-dem', exaggeration: currentExag });
    map.easeTo({ pitch: 45, duration: 800 });
    if (!panelWasOpen) { closePanels('tb-panel-3d'); panel.style.display = 'flex'; }
  } else {
    map.setTerrain(null);
    map.easeTo({ pitch: 0, duration: 600 });
    panel.style.display = 'none';
  }
});

// ── Sotto-pannello 3D: slider esagerazione ────────────────────────────────
document.getElementById('tbp-exag').addEventListener('input', function () {
  currentExag = parseFloat(this.value);
  document.getElementById('tbp-exag-val').textContent = currentExag.toFixed(1) + '×';
  if (terrainActive) map.setTerrain({ source: 'terrain-dem', exaggeration: currentExag });
});


// ── Toolbar: Ombreggiatura ────────────────────────────────────────────────
function closePanels(except) {
  ['tb-panel-shadow', 'tb-panel-3d'].forEach(id => {
    if (id !== except) document.getElementById(id).style.display = 'none';
  });
}

// Toggle semplice on/off ombreggiatura
document.getElementById('tb-shadow-toggle').addEventListener('click', function () {
  this.classList.toggle('on');
  shadowActive = this.classList.contains('on');
  map.setLayoutProperty('hillshade-layer', 'visibility', shadowActive ? 'visible' : 'none');
  // Se si spegne l'ombreggiatura chiudi anche il pannello impostazioni
  if (!shadowActive) {
    document.getElementById('tb-panel-shadow').style.display = 'none';
    document.getElementById('tb-shadow').classList.remove('on');
  }
});

// Pulsante impostazioni ombreggiatura (apre/chiude pannello)
document.getElementById('tb-shadow').addEventListener('click', function () {
  // Non fare nulla se l'ombreggiatura è spenta
  if (!shadowActive) return;
  const panel = document.getElementById('tb-panel-shadow');
  const open = panel.style.display === 'none';
  closePanels(open ? 'tb-panel-shadow' : null);
  panel.style.display = open ? 'flex' : 'none';
  this.classList.toggle('on', open);
});

document.getElementById('tbp-shadow-intensity').addEventListener('input', function () {
  shadowIntensity = parseFloat(this.value);
  document.getElementById('tbp-shadow-intensity-val').textContent = shadowIntensity.toFixed(2);
  applyHillshade();
});

document.getElementById('tbp-shadow-time').addEventListener('input', function () {
  sunMinutes = parseInt(this.value, 10);
  const az = sunAzimuth(sunMinutes);
  document.getElementById('tbp-shadow-time-val').textContent =
    minutesToHHMM(sunMinutes) + (az === null ? ' 🌙' : '');
  if (shadowActive) applyHillshade();
});

document.getElementById('tbp-btn-now').addEventListener('click', () => {
  const now = new Date();
  sunMinutes = now.getHours() * 60 + now.getMinutes();
  const slider = document.getElementById('tbp-shadow-time');
  slider.value = Math.max(360, Math.min(1080, sunMinutes));
  sunMinutes = parseInt(slider.value, 10);
  const az = sunAzimuth(sunMinutes);
  document.getElementById('tbp-shadow-time-val').textContent =
    minutesToHHMM(sunMinutes) + (az === null ? ' 🌙' : '');
  if (shadowActive) applyHillshade();
});


// ── Toolbar: Griglia analisi DTM ──────────────────────────────────────────
document.getElementById('tb-griglia').addEventListener('click', function () {
  this.classList.toggle('on');
  map.setLayoutProperty('griglia-circles', 'visibility', this.classList.contains('on') ? 'visible' : 'none');
});

// Popup griglia — custom fixed div (bypassa il container MapLibre)
let _grigliaLastKey = null;
let _grigliaPopEl = null;

function grigliaPopShow(wrap, clientX, clientY) {
  grigliaPopClose();
  const pop = document.createElement('div');
  pop.id = 'griglia-pop-fixed';
  pop.appendChild(wrap);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'gp-close-btn';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', grigliaPopClose);
  const hdr = wrap.querySelector('.gp-header');
  if (hdr) hdr.appendChild(closeBtn);
  else pop.insertBefore(closeBtn, pop.firstChild);

  document.body.appendChild(pop);
  _grigliaPopEl = pop;

  // Posiziona: default sopra-sinistra del click, poi aggiusta se esce dallo schermo
  const W = window.innerWidth, H = window.innerHeight;
  const PW = 350, PH = Math.min(pop.scrollHeight || 520, H * 0.8);
  let left = clientX + 12;
  let top  = clientY - PH - 12;
  if (left + PW > W - 8)  left = clientX - PW - 12;
  if (top < 8)             top  = clientY + 12;
  if (top + PH > H - 8)   top  = H - PH - 8;
  pop.style.left = left + 'px';
  pop.style.top  = top  + 'px';
}

function grigliaPopClose() {
  if (_grigliaPopEl) { _grigliaPopEl.remove(); _grigliaPopEl = null; }
}

// Chiudi popup griglia cliccando fuori
document.addEventListener('click', function (e) {
  if (_grigliaPopEl && !_grigliaPopEl.contains(e.target)) grigliaPopClose();
});

// Colore badge per classi stabilità / costruibilità (1=migliore, 5=peggiore)
const CLASS_COLORS = {
  1: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  2: { bg: '#d9f99d', text: '#3a5a0a', border: '#a3e635' },
  3: { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
  4: { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' },
  5: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
};
const NAME_TO_CLASS = {
  'molto stabile': 1, 'stabile': 2, 'moderatamente instabile': 3,
  'instabile': 4, 'molto instabile': 5,
  'ottima': 1, 'buona': 2, 'moderata': 3, 'difficile': 4, 'non idonea': 5,
};

function classColor(nome) {
  if (!nome) return null;
  const key = nome.toLowerCase().trim();
  for (const [k, v] of Object.entries(NAME_TO_CLASS)) {
    if (key.includes(k)) return CLASS_COLORS[v];
  }
  return null;
}

function el(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
function txt(tag, text, cls) { const e = el(tag, cls); e.textContent = text; return e; }

function makeBadge(nome) {
  const c = classColor(nome);
  const badge = el('span', 'gp-badge');
  badge.textContent = nome || '—';
  if (c) { badge.style.background = c.bg; badge.style.color = c.text; badge.style.borderColor = c.border; }
  return badge;
}

function makeSection(label) {
  const sec = el('div', 'gp-section');
  sec.appendChild(txt('div', label, 'gp-section-label'));
  return sec;
}

function makeRow(label, value) {
  const row = el('div', 'gp-row');
  row.appendChild(txt('span', label, 'gp-row-label'));
  row.appendChild(txt('span', value, 'gp-row-value'));
  return row;
}

function makeBadgeRow(label, nome) {
  const row = el('div', 'gp-row');
  row.appendChild(txt('span', label, 'gp-row-label'));
  row.appendChild(makeBadge(nome));
  return row;
}

map.on('mouseenter', 'griglia-circles', () => { map.getCanvas().style.cursor = 'pointer'; });
map.on('mouseleave', 'griglia-circles', () => { map.getCanvas().style.cursor = ''; });

map.on('click', 'griglia-circles', (e) => {
  e.originalEvent.stopPropagation();
  const key = `${e.lngLat.lng.toFixed(5)},${e.lngLat.lat.toFixed(5)}`;
  _grigliaLastKey = key;
  const p = e.features[0].properties;
  const n = (v, d = 1) => (v != null && v !== '' && !isNaN(v)) ? Number(v).toFixed(d) : '—';

  // Query UPL al punto corrente
  const uplFeats = map.queryRenderedFeatures(e.point, { layers: ['upl-fill'] });
  const upl = uplFeats.length ? uplFeats[0].properties : null;

  const wrap = el('div', 'griglia-popup');

  // ── Header ──
  const hdr = el('div', 'gp-header');
  const hdrLeft = el('div', 'gp-header-left');
  hdrLeft.appendChild(txt('div', upl ? (upl.Quartiere || upl.UPL) : 'Palermo', 'gp-header-label'));
  if (upl) {
    hdrLeft.appendChild(txt('div', `Circoscrizione ${upl.circoscrizione}`, 'gp-header-sub'));
  }
  hdr.appendChild(hdrLeft);
  const quotaBox = el('div', 'gp-quota');
  quotaBox.appendChild(txt('span', n(p.quota, 0), 'gp-quota-value'));
  quotaBox.appendChild(txt('span', ' m s.l.m.', 'gp-quota-unit'));
  hdr.appendChild(quotaBox);
  wrap.appendChild(hdr);

  // ── Pendenza ──
  const secPend = makeSection('Pendenza');
  const pendVal = `${n(p.slope_deg)}°`;
  const pendPct = `${n(p.slope_pct)} %`;
  const pendRow = el('div', 'gp-row');
  pendRow.appendChild(txt('span', pendVal, 'gp-pend-main'));
  pendRow.appendChild(txt('span', pendPct, 'gp-pend-sub'));
  secPend.appendChild(pendRow);
  wrap.appendChild(secPend);

  // ── Morfologia ──
  const secMorf = makeSection('Morfologia');
  secMorf.appendChild(makeRow('Esposizione', p.aspetto_nome || '—'));
  secMorf.appendChild(makeRow('Forma terreno', p.geomorf_nome || '—'));
  wrap.appendChild(secMorf);

  // ── Rischio ──
  const secRisk = makeSection('Rischio');
  secRisk.appendChild(makeBadgeRow('Stabilità', p.stabilita_nome));
  secRisk.appendChild(makeBadgeRow('Costruibilità', p.costr_nome));
  wrap.appendChild(secRisk);

  // ── Indici ──
  const secIdx = makeSection('Indici');
  const grid = el('div', 'gp-index-grid');
  [['TRI', n(p.tri, 2)], ['TPI', n(p.tpi, 2)], ['SRI', n(p.sri, 2)], ['HS', n(p.hillshade, 0)]].forEach(([k, v]) => {
    const cell = el('div', 'gp-index-cell');
    cell.appendChild(txt('div', v, 'gp-index-val'));
    cell.appendChild(txt('div', k, 'gp-index-key'));
    grid.appendChild(cell);
  });
  secIdx.appendChild(grid);
  wrap.appendChild(secIdx);

  // ── Territorio (aree in ha) ──
  if (upl) {
    const ha = v => {
      const val = uplAreas[Object.keys(uplAreas).find(k => uplAreas[k][v] !== undefined) || '']?.[v];
      return val != null ? val.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' ha' : '—';
    };
    const uplHa  = upl.area != null ? (upl.area / 10000).toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' ha' : '—';
    const quartHa = uplAreas.quartiere[upl.Quartiere]
      ? uplAreas.quartiere[upl.Quartiere].toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' ha' : '—';
    const circHa  = uplAreas.circoscrizione[upl.circoscrizione]
      ? uplAreas.circoscrizione[upl.circoscrizione].toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' ha' : '—';

    const secTerr = makeSection('Superfici');
    secTerr.appendChild(makeRow(`UPL · ${upl.UPL}`, uplHa));
    secTerr.appendChild(makeRow(`Quartiere · ${upl.Quartiere}`, quartHa));
    secTerr.appendChild(makeRow(`Circoscrizione ${upl.circoscrizione}`, circHa));
    wrap.appendChild(secTerr);
  }

  grigliaPopShow(wrap, e.originalEvent.clientX, e.originalEvent.clientY);
});





// ── Popup quota al click ──────────────────────────────────────────────────
map.on('click', function (e) {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['contours-50m-layer', 'contours-10m-layer']
  });
  if (features.length > 0) {
    const elev = Math.round(Number(features[0].properties.elevation));
    const label = document.createElement('span');
    const strong = document.createElement('strong');
    strong.textContent = 'Quota: ';
    label.appendChild(strong);
    label.appendChild(document.createTextNode(`${elev} m s.l.m.`));
    new maplibregl.Popup({ closeButton: true, closeOnClick: true })
      .setLngLat(e.lngLat)
      .setDOMContent(label)
      .addTo(map);
  }
});

// Cursore pointer sulle curve
['contours-50m-layer', 'contours-10m-layer'].forEach(id => {
  map.on('mouseenter', id, () => { map.getCanvas().style.cursor = 'crosshair'; });
  map.on('mouseleave', id, () => { map.getCanvas().style.cursor = ''; });
});

// ── Attribution collassabile ──────────────────────────────────────────────
(function () {
  const btn   = document.getElementById('attrib-btn');
  const panel = document.getElementById('attrib-panel');
  const text  = document.getElementById('attrib-text');

  const STATIC_ATTRIB = [
    { label: 'MapLibre GL JS', url: 'https://maplibre.org/' },
    { label: 'DTM HRDTM5m@italia', url: null },
    { label: 'Curve di livello: DTM HRDTM5m@italia', url: null },
    { label: 'CTC – Carta tecnica comunale 2k 2006', url: null },
  ];

  function buildAttribContent(basemapDef) {
    text.textContent = '';
    const parts = [];

    // basemap attribution
    if (basemapDef.attributionNode) {
      parts.push(basemapDef.attributionNode.cloneNode(true));
    }

    // separatore + attribuzioni statiche
    STATIC_ATTRIB.forEach(item => {
      const sep = document.createTextNode(' | ');
      parts.push(sep);
      if (item.url) {
        const a = document.createElement('a');
        a.href = item.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = item.label;
        parts.push(a);
      } else {
        parts.push(document.createTextNode(item.label));
      }
    });

    text.replaceChildren(...parts);
  }

  // init con basemap OSM
  buildAttribContent(BASEMAPS.osm);

  // aggiorna al cambio basemap
  document.querySelectorAll('#tb-basemaps .tb-radio').forEach(b => {
    b.addEventListener('click', function () {
      buildAttribContent(BASEMAPS[this.dataset.basemap]);
    });
  });

  // toggle pannello
  btn.addEventListener('click', function () {
    const open = panel.hidden === false;
    panel.hidden = open;
    btn.setAttribute('aria-expanded', String(!open));
  });
})();
