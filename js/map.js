// ── Costanti ──────────────────────────────────────────────────────────────
const CENTER  = [13.348027, 38.136896];
const ZOOM    = 11;
const BOUNDS  = [13.241342, 38.048415, 13.454712, 38.225377];
const TILEJSON_URL = 'docs/tiles/terrain/tilejson.json';

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
const BASEMAPS = {
  osm: {
    type: 'raster',
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    tileSize: 256,
    attribution: '© OpenStreetMap contributors',
    attributionNode: makeAttribNode('© OpenStreetMap contributors', 'https://www.openstreetmap.org/copyright'),
    maxzoom: 19
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
    maxzoom: 21
  },
  esri: {
    type: 'raster',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
    tileSize: 256,
    attribution: '© Esri, Maxar, Earthstar Geographics',
    attributionNode: makeAttribNode('© Esri, Maxar, Earthstar Geographics', null),
    maxzoom: 19
  }
};

// ── Mappa ─────────────────────────────────────────────────────────────────
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
      basemap: BASEMAPS.osm,
      'terrain-dem': {
        type: 'raster-dem',
        url: TILEJSON_URL,
        encoding: 'terrarium',
        tileSize: 256
      },
      contours_50m: {
        type: 'geojson',
        data: 'docs/geojson/contours_50m.geojson'
      },
      contours_10m: {
        type: 'geojson',
        data: 'docs/geojson/contours_10m.geojson'
      }
    },
    layers: [
      // Basemap raster
      { id: 'basemap-layer', type: 'raster', source: 'basemap', paint: { 'raster-opacity': 1 } },

      // Hillshade (sempre presente, visibilità controllata)
      {
        id: 'hillshade-layer',
        type: 'hillshade',
        source: 'terrain-dem',
        layout: { visibility: 'none' },
        paint: {
          'hillshade-exaggeration': 0.5,
          'hillshade-shadow-color': '#283046',
          'hillshade-highlight-color': '#ffffff',
          'hillshade-accent-color': '#202040',
          'hillshade-illumination-direction': 315,
          'hillshade-illumination-anchor': 'viewport'
        }
      },

      // Curve 10m (visibili solo da zoom 13)
      {
        id: 'contours-10m-layer',
        type: 'line',
        source: 'contours_10m',
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#fcd34d',
          'line-width': 0.6,
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 13, 0.7, 15, 0.9]
        },
        minzoom: 12
      },

      // Curve 50m (principali, sempre visibili quando attive)
      {
        id: 'contours-50m-layer',
        type: 'line',
        source: 'contours_50m',
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#f59e0b',
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.8, 12, 1.2, 15, 1.8],
          'line-opacity': 0.85
        }
      },

      // Etichette quota curve 50m (visibili da zoom 13)
      {
        id: 'contours-50m-labels',
        type: 'symbol',
        source: 'contours_50m',
        layout: {
          visibility: 'none',
          'symbol-placement': 'line',
          'text-field': ['concat', ['to-string', ['get', 'elevation']], 'm'],
          'text-size': 10,
          'text-font': ['Open Sans Regular'],
          'text-offset': [0, -0.3]
        },
        paint: {
          'text-color': '#f59e0b',
          'text-halo-color': 'rgba(0,0,0,0.6)',
          'text-halo-width': 1.5
        },
        minzoom: 13
      }
    ]
  },
  center: CENTER,
  zoom: ZOOM,
  pitch: 0,
  bearing: 0,
  maxBounds: [
    [BOUNDS[0] - 0.5, BOUNDS[1] - 0.5],
    [BOUNDS[2] + 0.5, BOUNDS[3] + 0.5]
  ]
});

map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-right');
map.addControl(new maplibregl.FullscreenControl(), 'top-right');

// ── Stato locale ──────────────────────────────────────────────────────────
let terrainActive = false;
let shadowActive  = false;
let contourActive = false;
let currentExag   = 1.5;

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
});

// ── Toggle curve di livello ───────────────────────────────────────────────
document.getElementById('toggle-contour').addEventListener('change', function () {
  contourActive = this.checked;
  const vis = contourActive ? 'visible' : 'none';
  ['contours-10m-layer', 'contours-50m-layer', 'contours-50m-labels'].forEach(id => {
    map.setLayoutProperty(id, 'visibility', vis);
  });
  document.getElementById('legend-contour').classList.toggle('visible', contourActive);
});

// ── Cambio basemap ────────────────────────────────────────────────────────
document.querySelectorAll('input[name="basemap"]').forEach(radio => {
  radio.addEventListener('change', function () {
    const def = BASEMAPS[this.value];
    map.getSource('basemap').setTiles(def.tiles);
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
map.on('mouseenter', 'contours-50m-layer', () => { map.getCanvas().style.cursor = 'crosshair'; });
map.on('mouseleave', 'contours-50m-layer', () => { map.getCanvas().style.cursor = ''; });
