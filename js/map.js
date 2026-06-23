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
          'circle-opacity': 0
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
  ]
});

map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-right');

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

// ── Attivazione automatica al caricamento ─────────────────────────────────
map.on('load', () => {
  applyHillshade();
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

document.getElementById('tb-shadow').addEventListener('click', function () {
  const panel = document.getElementById('tb-panel-shadow');
  const open = panel.style.display === 'none';
  closePanels(open ? 'tb-panel-shadow' : null);
  panel.style.display = open ? 'flex' : 'none';
  if (!open) return;
  shadowActive = true;
  this.classList.add('on');
  map.setLayoutProperty('hillshade-layer', 'visibility', 'visible');
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

// Popup griglia — hover
const grigliaPop = new maplibregl.Popup({ closeButton: false, closeOnClick: false, maxWidth: '280px' });

map.on('mouseenter', 'griglia-circles', (e) => {
  map.getCanvas().style.cursor = 'pointer';
  const p = e.features[0].properties;
  const n = (v, d=1) => v != null ? Number(v).toFixed(d) : '—';
  const rows = [
    ['Quota',        `${n(p.quota)} m s.l.m.`],
    ['Pendenza',     `${n(p.slope_deg)}° (${n(p.slope_pct)}%)`],
    ['Esposizione',  p.aspetto_nome || '—'],
    ['Geomorfologia',p.geomorf_nome || '—'],
    ['Stabilità',    p.stabilita_nome || '—'],
    ['Costruibilità',p.costr_nome || '—'],
    ['TRI',          n(p.tri, 3)],
    ['TPI',          n(p.tpi, 3)],
    ['Hillshade',    n(p.hillshade, 0)],
    ['SRI',          n(p.sri, 3)],
  ];

  const wrap = document.createElement('div');
  wrap.className = 'griglia-popup';
  const title = document.createElement('strong');
  title.textContent = '📍 Punto analisi DTM';
  wrap.appendChild(title);
  const table = document.createElement('table');
  rows.forEach(([k, v]) => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = k;
    const td2 = document.createElement('td');
    td2.textContent = v ?? '—';
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
  });
  wrap.appendChild(table);

  grigliaPop.setLngLat(e.lngLat).setDOMContent(wrap).addTo(map);
});

map.on('mouseleave', 'griglia-circles', () => {
  map.getCanvas().style.cursor = '';
  grigliaPop.remove();
});

// ── Toggle mappa elevazione ───────────────────────────────────────────
document.getElementById('toggle-elevation').addEventListener('change', function () {
  const vis = this.checked ? 'visible' : 'none';
  map.setLayoutProperty('elevation-layer', 'visibility', vis);
  document.getElementById('elevation-opacity-row').style.display = this.checked ? 'block' : 'none';
  document.getElementById('legend-elevation').classList.toggle('visible', this.checked);
});

document.getElementById('elevation-opacity-slider').addEventListener('input', function () {
  const val = parseFloat(this.value);
  document.getElementById('elevation-opacity-val').textContent = val.toFixed(2);
  map.setPaintProperty('elevation-layer', 'raster-opacity', val);
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
