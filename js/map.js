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
  esri: {
    type: 'raster',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
    tileSize: 256,
    attribution: '© Esri, Maxar, Earthstar Geographics',
    attributionNode: makeAttribNode('© Esri, Maxar, Earthstar Geographics', null),
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

      // Overlay CTR — disattivo di default, si sovrappone alla basemap attiva
      {
        id: 'ctr2k-layer',
        type: 'raster',
        source: 'ctr2k',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.7 }
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

map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-right');
map.addControl(new maplibregl.FullscreenControl(), 'top-right');

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

// ── Toggle 3D terreno ─────────────────────────────────────────────────────
document.getElementById('toggle-terrain').addEventListener('change', function () {
  terrainActive = this.checked;
  document.getElementById('exaggeration-row').style.display = terrainActive ? 'block' : 'none';

  if (terrainActive) {
    map.setTerrain({ source: 'terrain-dem', exaggeration: currentExag });
    map.easeTo({ pitch: 45, duration: 800 });
  } else {
    map.setTerrain(null);
    map.easeTo({ pitch: 0, duration: 600 });
  }
});

// ── Slider esagerazione verticale ─────────────────────────────────────────
document.getElementById('exag-slider').addEventListener('input', function () {
  currentExag = parseFloat(this.value);
  document.getElementById('exag-val').textContent = currentExag.toFixed(1) + '×';
  if (terrainActive) {
    map.setTerrain({ source: 'terrain-dem', exaggeration: currentExag });
  }
});

// ── Toggle ombreggiatura ──────────────────────────────────────────────────
document.getElementById('toggle-shadow').addEventListener('change', function () {
  shadowActive = this.checked;
  map.setLayoutProperty('hillshade-layer', 'visibility', shadowActive ? 'visible' : 'none');
  document.getElementById('shadow-controls').style.display = shadowActive ? 'block' : 'none';
});

// ── Slider intensità ombra ────────────────────────────────────────────────
document.getElementById('shadow-intensity-slider').addEventListener('input', function () {
  shadowIntensity = parseFloat(this.value);
  document.getElementById('shadow-intensity-val').textContent = shadowIntensity.toFixed(2);
  applyHillshade();
});

// ── Slider ora solare ─────────────────────────────────────────────────────
document.getElementById('shadow-time-slider').addEventListener('input', function () {
  sunMinutes = parseInt(this.value, 10);
  const label = document.getElementById('shadow-time-val');
  const az = sunAzimuth(sunMinutes);
  label.textContent = az !== null ? minutesToHHMM(sunMinutes) : minutesToHHMM(sunMinutes) + ' 🌙';
  if (shadowActive) applyHillshade();
});

// ── Pulsante "Ora locale" ─────────────────────────────────────────────────
document.getElementById('btn-now').addEventListener('click', () => {
  const now = new Date();
  sunMinutes = now.getHours() * 60 + now.getMinutes();
  const slider = document.getElementById('shadow-time-slider');
  // Clamp al range dello slider (6:00–18:00)
  slider.value = Math.max(360, Math.min(1080, sunMinutes));
  sunMinutes = parseInt(slider.value, 10);
  const label = document.getElementById('shadow-time-val');
  const az = sunAzimuth(sunMinutes);
  label.textContent = az !== null ? minutesToHHMM(sunMinutes) : minutesToHHMM(sunMinutes) + ' 🌙';
  if (shadowActive) applyHillshade();
});

// ── Toggle curve di livello ───────────────────────────────────────────────
document.getElementById('toggle-contour').addEventListener('change', function () {
  contourActive = this.checked;
  const vis = contourActive ? 'visible' : 'none';
  ['contours-10m-layer', 'contours-50m-layer', 'contours-10m-labels', 'contours-50m-labels'].forEach(id => {
    map.setLayoutProperty(id, 'visibility', vis);
  });
  document.getElementById('legend-contour').classList.toggle('visible', contourActive);
});

// ── Toggle overlay CTR ────────────────────────────────────────────────────
document.getElementById('toggle-ctr').addEventListener('change', function () {
  map.setLayoutProperty('ctr2k-layer', 'visibility', this.checked ? 'visible' : 'none');
  document.getElementById('ctr-opacity-row').style.display = this.checked ? 'block' : 'none';
});

document.getElementById('ctr-opacity-slider').addEventListener('input', function () {
  const val = parseFloat(this.value);
  document.getElementById('ctr-opacity-val').textContent = val.toFixed(2);
  map.setPaintProperty('ctr2k-layer', 'raster-opacity', val);
});

// ── Cambio basemap ────────────────────────────────────────────────────────
document.querySelectorAll('input[name="basemap"]').forEach(radio => {
  radio.addEventListener('change', function () {
    const def = BASEMAPS[this.value];
    map.getSource('basemap').setTiles(def.tiles);
    map.setPaintProperty('basemap-layer', 'raster-opacity', def.opacity);
    const attribEl = document.querySelector('.maplibregl-ctrl-attrib-inner');
    if (attribEl && def.attributionNode) {
      attribEl.replaceChildren(def.attributionNode.cloneNode(true));
    }
  });
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
