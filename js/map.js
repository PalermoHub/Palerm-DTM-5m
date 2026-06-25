// ── PMTiles protocol (MapLibre 5.x / tilev4 API) ──────────────────────────
const pmtilesProtocol = new pmtiles.Protocol();
maplibregl.addProtocol('pmtiles', pmtilesProtocol.tilev4.bind(pmtilesProtocol));

// ── Costanti ──────────────────────────────────────────────────────────────
const CENTER  = [13.35, 38.14692];
const ZOOM    = 12.12;
const BOUNDS  = [13.10, 37.94, 13.60, 38.33];

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
    tiles: ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'],
    tileSize: 256,
    attribution: '© OpenStreetMap contributors © CartoDB',
    attributionNode: makeAttribNode('© OpenStreetMap contributors © CartoDB', 'https://www.openstreetmap.org/copyright'),
    maxzoom: 18,
    opacity: 1.0
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
      'pendenza-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/pendenza/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Analisi pendenza: DTM HRDTM5m@italia'
      },
      'aspetto-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/aspetto/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Analisi esposizione: DTM HRDTM5m@italia'
      },
      'geomorfologia-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/geomorfologia/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Analisi geomorfologica: DTM HRDTM5m@italia'
      },
      'stabilita-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/stabilita/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Analisi stabilità versanti: DTM HRDTM5m@italia'
      },
      'costruibilita-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/costruibilita/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Analisi costruibilità: DTM HRDTM5m@italia'
      },
      'rugosita-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/rugosita/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Analisi rugosità TRI: DTM HRDTM5m@italia'
      },
      'radiazione-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/radiazione/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Indice radiazione solare: DTM HRDTM5m@italia'
      },
      'heatmap-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/heatmap/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Heatmap complessità terreno: DTM HRDTM5m@italia'
      },
      'vulnerabilita-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/vulnerabilita/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Indice vulnerabilità: DTM HRDTM5m@italia'
      },
      'solare-raf-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/solare_raf/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Radiazione solare raffinata: DTM HRDTM5m@italia'
      },
      'tpi-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/tpi/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'TPI locale: DTM HRDTM5m@italia'
      },
      'tpi300-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/tpi_300m/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'TPI 300m: DTM HRDTM5m@italia'
      },
      'curvplanare-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/curvatura_planare/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Curvatura planare: DTM HRDTM5m@italia'
      },
      'curvprofilo-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/curvatura_profilo/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Curvatura profilo: DTM HRDTM5m@italia'
      },
      'curvtotale-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/curvatura_totale/{z}/{x}/{y}.png`],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 15,
        scheme: 'tms',
        attribution: 'Curvatura totale: DTM HRDTM5m@italia'
      },
      'upl': {
        type: 'geojson',
        data: `${BASE_URL}docs/geojson/upl.geojson`
      },
      // ── Analisi idrologiche ──────────────────────────────────────────────
      'twi-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/twi_idro/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'TWI — Topographic Wetness Index: DTM HRDTM5m@italia'
      },
      'flowacc-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/flow_accumulation/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Flow Accumulation — reticolo idrografico: DTM HRDTM5m@italia'
      },
      'bacini-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/bacini/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Bacini idrografici: DTM HRDTM5m@italia'
      },
      'spi-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/spi/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'SPI — Stream Power Index: DTM HRDTM5m@italia'
      },
      'dtw-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/depth_to_water/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Depth-to-Water (HAND): DTM HRDTM5m@italia'
      },
      // ── Nuove analisi termica / energetica ──────────────────────────────────
      'fotovoltaico-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/potenziale_fv/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Potenziale fotovoltaico: DTM HRDTM5m@italia'
      },
      'ombra-estiva-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/ombra_estiva/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Ombreggiamento estivo: DTM HRDTM5m@italia'
      },
      'ombra-invernale-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/ombra_invernale/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Ombreggiamento invernale: DTM HRDTM5m@italia'
      },
      'frost-hollow-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/frost_hollow/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Frost hollow / cold air pooling: DTM HRDTM5m@italia'
      },
      'svf-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/svf/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Sky View Factor: DTM HRDTM5m@italia'
      },
      'viewshed-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/viewshed/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Viewshed cumulativo: DTM HRDTM5m@italia'
      },
      'accessibilita-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/accessibilita/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Accessibilità morfologica (Tobler): DTM HRDTM5m@italia'
      },
      'corridoi-ecologici-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/corridoi_ecologici/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Corridoi ecologici morfologici: DTM HRDTM5m@italia'
      },
      'erosione-rusle-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/erosione_rusle/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Erosione potenziale RUSLE LS: DTM HRDTM5m@italia'
      },
      'curvatura-instabilita-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/curvatura_instabilita/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'tms',
        attribution: 'Curvatura instabilità radicale: DTM HRDTM5m@italia'
      },
      'dtm-pai-gap-raster': {
        type: 'raster',
        tiles: [`${BASE_URL}docs/tiles/dtm_pai_gap/{z}/{x}/{y}.png`],
        tileSize: 256, minzoom: 8, maxzoom: 15, scheme: 'xyz',
        attribution: 'DTM × PAI — Gap morfologico: DTM HRDTM5m@italia + PAI Sicilia'
      },
      'transects-geojson': {
        type: 'geojson',
        data: `${BASE_URL}docs/transects.geojson`
      },
      'bivariate-elev-src': {
        type: 'vector',
        tiles: [`${BASE_URL}docs/tiles/bivariate_elev/{z}/{x}/{y}.pbf`],
        minzoom: 8, maxzoom: 15,
        attribution: 'DTM × ISTAT — Elevazione × Densità: HRDTM5m@italia + ISTAT 2021'
      },
      'bivariate-slope-src': {
        type: 'vector',
        tiles: [`${BASE_URL}docs/tiles/bivariate_slope/{z}/{x}/{y}.pbf`],
        minzoom: 8, maxzoom: 15,
        attribution: 'DTM × ISTAT — Pendenza × Densità: HRDTM5m@italia + ISTAT 2021'
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
          'hillshade-exaggeration': 0.35,
          'hillshade-shadow-color': '#283046',
          'hillshade-highlight-color': '#f5f0e8',
          'hillshade-accent-color': '#202040',
          'hillshade-illumination-direction': 180,
          'hillshade-illumination-anchor': 'map'
        }
      },

      // Basemap raster — SOPRA hillshade, con opacità per far trasparire il rilievo
      { id: 'basemap-layer', type: 'raster', source: 'basemap', paint: { 'raster-opacity': 1.0 } },

      // Mappa elevazione colorata — analisi DTM, visibile di default
      {
        id: 'elevation-layer',
        type: 'raster',
        source: 'elevation-raster',
        layout: { visibility: 'visible' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Mappa pendenza — disattiva di default
      {
        id: 'pendenza-layer',
        type: 'raster',
        source: 'pendenza-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Mappa esposizione (aspetto) — disattiva di default
      {
        id: 'aspetto-layer',
        type: 'raster',
        source: 'aspetto-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Mappa geomorfologia — disattiva di default
      {
        id: 'geomorfologia-layer',
        type: 'raster',
        source: 'geomorfologia-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Mappa stabilità versanti — disattiva di default
      {
        id: 'stabilita-layer',
        type: 'raster',
        source: 'stabilita-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Mappa costruibilità — disattiva di default
      {
        id: 'costruibilita-layer',
        type: 'raster',
        source: 'costruibilita-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Mappa rugosità TRI — disattiva di default
      {
        id: 'rugosita-layer',
        type: 'raster',
        source: 'rugosita-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Mappa radiazione solare — disattiva di default
      {
        id: 'radiazione-layer',
        type: 'raster',
        source: 'radiazione-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Heatmap complessità terreno — disattiva di default
      {
        id: 'heatmap-layer',
        type: 'raster',
        source: 'heatmap-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Indice vulnerabilità — disattiva di default
      {
        id: 'vulnerabilita-layer',
        type: 'raster',
        source: 'vulnerabilita-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Radiazione solare raffinata — disattiva di default
      {
        id: 'solare-raf-layer',
        type: 'raster',
        source: 'solare-raf-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // TPI locale — disattiva di default
      {
        id: 'tpi-layer',
        type: 'raster',
        source: 'tpi-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // TPI 300m — disattiva di default
      {
        id: 'tpi300-layer',
        type: 'raster',
        source: 'tpi300-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Curvatura planare — disattiva di default
      {
        id: 'curvplanare-layer',
        type: 'raster',
        source: 'curvplanare-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Curvatura profilo — disattiva di default
      {
        id: 'curvprofilo-layer',
        type: 'raster',
        source: 'curvprofilo-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Curvatura totale — disattiva di default
      {
        id: 'curvtotale-layer',
        type: 'raster',
        source: 'curvtotale-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // TWI — disattiva di default
      {
        id: 'twi-layer',
        type: 'raster',
        source: 'twi-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Flow Accumulation — disattiva di default
      {
        id: 'flowacc-layer',
        type: 'raster',
        source: 'flowacc-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Bacini idrografici — disattiva di default
      {
        id: 'bacini-layer',
        type: 'raster',
        source: 'bacini-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.85 }
      },

      // SPI — disattiva di default
      {
        id: 'spi-layer',
        type: 'raster',
        source: 'spi-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Depth-to-Water (HAND) — disattiva di default
      {
        id: 'dtw-layer',
        type: 'raster',
        source: 'dtw-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Potenziale fotovoltaico — disattiva di default
      {
        id: 'fotovoltaico-layer',
        type: 'raster',
        source: 'fotovoltaico-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Ombreggiamento estivo — disattiva di default
      {
        id: 'ombra-estiva-layer',
        type: 'raster',
        source: 'ombra-estiva-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.90 }
      },

      // Ombreggiamento invernale — disattiva di default
      {
        id: 'ombra-invernale-layer',
        type: 'raster',
        source: 'ombra-invernale-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.90 }
      },

      // Frost hollow — disattiva di default
      {
        id: 'frost-hollow-layer',
        type: 'raster',
        source: 'frost-hollow-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
      },

      // Sky View Factor — disattiva di default
      {
        id: 'svf-layer',
        type: 'raster',
        source: 'svf-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.85 }
      },

      // Viewshed cumulativo — disattiva di default
      {
        id: 'viewshed-layer',
        type: 'raster',
        source: 'viewshed-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.85 }
      },

      // Accessibilità morfologica — disattiva di default
      {
        id: 'accessibilita-layer',
        type: 'raster',
        source: 'accessibilita-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.85 }
      },

      // Corridoi ecologici morfologici — disattiva di default
      {
        id: 'corridoi-ecologici-layer',
        type: 'raster',
        source: 'corridoi-ecologici-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.85 }
      },

      // Erosione potenziale RUSLE LS — disattiva di default
      {
        id: 'erosione-rusle-layer',
        type: 'raster',
        source: 'erosione-rusle-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.85 }
      },

      // Curvatura instabilità radicale — disattiva di default
      {
        id: 'curvatura-instabilita-layer',
        type: 'raster',
        source: 'curvatura-instabilita-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.85 }
      },

      // DTM × PAI gap morfologico — disattiva di default
      {
        id: 'dtm-pai-gap-layer',
        type: 'raster',
        source: 'dtm-pai-gap-raster',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.9 }
      },

      // Bivariate: Elevazione × Densità abitativa ISTAT 2021
      {
        id: 'bivariate-elev-layer',
        type: 'fill',
        source: 'bivariate-elev-src',
        'source-layer': 'bivariate_elev',
        layout: { visibility: 'none' },
        filter: ['!=', ['get', 'biv_code'], '0-0'],
        paint: {
          'fill-color': ['match', ['get', 'biv_code'],
            '1-3', '#88c8b8', '2-3', '#60a898', '3-3', '#307870',
            '1-2', '#d8c8d8', '2-2', '#b0b0c0', '3-2', '#8090a0',
            '1-1', '#f0eaee', '2-1', '#e8c8d0', '3-1', '#c88090',
            '#cccccc'
          ],
          'fill-opacity': 0.80,
          'fill-outline-color': 'rgba(255,255,255,0.15)'
        }
      },

      // Bivariate: Pendenza × Densità abitativa ISTAT 2021
      {
        id: 'bivariate-slope-layer',
        type: 'fill',
        source: 'bivariate-slope-src',
        'source-layer': 'bivariate_slope',
        layout: { visibility: 'none' },
        filter: ['!=', ['get', 'biv_code'], '0-0'],
        paint: {
          'fill-color': ['match', ['get', 'biv_code'],
            '1-3', '#9ab870', '2-3', '#7a9850', '3-3', '#506030',
            '1-2', '#d8ddb8', '2-2', '#c0b898', '3-2', '#9a8058',
            '1-1', '#f0eeea', '2-1', '#e8c8b0', '3-1', '#c87050',
            '#cccccc'
          ],
          'fill-opacity': 0.80,
          'fill-outline-color': 'rgba(255,255,255,0.15)'
        }
      },

      // Bivariate proxy layers — sempre visibili (opacity 0) per queryRenderedFeatures
      {
        id: 'bivariate-elev-proxy',
        type: 'fill',
        source: 'bivariate-elev-src',
        'source-layer': 'bivariate_elev',
        filter: ['!=', ['get', 'biv_code'], '0-0'],
        paint: { 'fill-color': '#000', 'fill-opacity': 0 }
      },
      {
        id: 'bivariate-slope-proxy',
        type: 'fill',
        source: 'bivariate-slope-src',
        'source-layer': 'bivariate_slope',
        filter: ['!=', ['get', 'biv_code'], '0-0'],
        paint: { 'fill-color': '#000', 'fill-opacity': 0 }
      },

      // Transetti profili altimetrici — vettoriale GeoJSON, disattivo di default
      {
        id: 'transects-line',
        type: 'line',
        source: 'transects-geojson',
        layout: { visibility: 'none' },
        paint: {
          'line-color': ['coalesce', ['get', 'color'], '#e07800'],
          'line-width': 6,
          'line-opacity': 0.85
        }
      },
      {
        id: 'transects-label',
        type: 'symbol',
        source: 'transects-geojson',
        layout: {
          visibility: 'none',
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 9,
          'symbol-placement': 'line-center',
          'text-offset': [0, -0.8]
        },
        paint: {
          'text-color': ['coalesce', ['get', 'color'], '#e07800'],
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5
        }
      },

      // Overlay CTR — disattivo di default, si sovrappone alla basemap attiva
      {
        id: 'ctr2k-layer',
        type: 'raster',
        source: 'ctr2k',
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 1.0 }
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
      // Con MapLibre v4 l'esagerazione piena NON produce velo (il velo era una
      // regressione del renderer terrain v5). Vedi nota versione in index.html.
      exaggeration: 1.5
    }
  },
  center: CENTER,
  zoom: ZOOM,
  pitch: 60,
  bearing: -84.5,
  maxBounds: [
    [BOUNDS[0], BOUNDS[1]],
    [BOUNDS[2], BOUNDS[3]]
  ],
  attributionControl: false
});

// ── Fix: Rimuovi nebbia/atmosfera dalla vista 3D ──────────────────────────
map.on('style.load', function() {
  
  // 1. Rimuovi il layer del cielo in modo sicuro (senza far crashare la mappa)
  const layers = map.getStyle().layers;
  if (layers) {
    layers.forEach(function(layer) {
      if (layer.type === 'sky') {
        map.removeLayer(layer.id);
      }
    });
  }

  // 2. Disabilita l'atmospheric haze del "Sky" di MapLibre v5.
  // In MapLibre GL JS v5 NON esiste map.setFog (è API Mapbox): la nebbia che
  // sbiadisce le tile in 3D è l'atmosfera del Sky, renderizzata quando il
  // terrain è attivo (compare "dopo qualche secondo", al caricamento del DEM).
  // atmosphere-blend:0 + fog-blend a 0 eliminano completamente l'haze.
  // Il velo bianco sul terreno 3D è il "fog" del Sky: il suo colore di default
  // è #ffffff OPACO, perciò sbianca le tile. Lo rendiamo TRASPARENTE (alpha 0)
  // così sparisce del tutto, e azzeriamo atmosphere-blend (glow d'orizzonte).
  if (typeof map.setSky === 'function') {
    map.setSky({
      'atmosphere-blend': 0,
      'fog-color': 'rgba(255, 255, 255, 0)',
      'horizon-color': 'rgba(255, 255, 255, 0)',
      'fog-ground-blend': 0,
      'horizon-fog-blend': 0
    });
  }
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
let shadowIntensity = 0.35;
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
  map.flyTo({ center: CENTER, zoom: ZOOM, pitch: 60, bearing: -84.5, duration: 900 });
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
  map.dragRotate.enable();
  map.touchPitch.enable();
  map.setTerrain({ source: 'terrain-dem', exaggeration: currentExag });
  map.easeTo({ pitch: 45, duration: 800 });
  } else {
  map.setTerrain(null);
  map.easeTo({ pitch: 0, bearing: 0, duration: 600 });  // reset anche bearing
  map.dragRotate.disable();
  map.touchPitch.disable();
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

// ── Transetti profili altimetrici: funzione globale toggle ───────────────
window.setTransectsVisible = function (visible) {
  const vis = visible ? 'visible' : 'none';
  try { map.setLayoutProperty('transects-line',  'visibility', vis); } catch(e) {}
  try { map.setLayoutProperty('transects-label', 'visibility', vis); } catch(e) {}
  const cb = document.getElementById('transects-panel-cb');
  if (cb) cb.checked = visible;
};

// ── Tooltip hover transetti ───────────────────────────────────────────────
(function () {
  let _transectPopup = null;

  map.on('mouseenter', 'transects-line', function (e) {
    map.getCanvas().style.cursor = 'pointer';
    const p = e.features && e.features[0] && e.features[0].properties;
    if (!p) return;
    if (_transectPopup) { _transectPopup.remove(); _transectPopup = null; }

    const wrap = document.createElement('div');
    wrap.style.cssText = 'font-size:12px;color:#2a3a5c;min-width:180px;';

    const title = document.createElement('div');
    title.style.cssText = 'font-weight:700;font-size:13px;margin-bottom:4px;display:flex;align-items:center;gap:6px;';
    const dot = document.createElement('span');
    dot.style.cssText = 'display:inline-block;width:10px;height:10px;border-radius:50%;background:' + (p.color || '#e07800') + ';flex-shrink:0;';
    title.appendChild(dot);
    title.appendChild(document.createTextNode(p.name || ''));
    wrap.appendChild(title);

    if (p.description) {
      const desc = document.createElement('div');
      desc.style.cssText = 'color:#5a6a98;margin-bottom:5px;line-height:1.4;';
      desc.textContent = p.description;
      wrap.appendChild(desc);
    }

    const meta = document.createElement('div');
    meta.style.cssText = 'display:flex;gap:10px;font-size:11px;color:#3a4e78;';
    const kmSpan = document.createElement('span');
    kmSpan.textContent = '\u{1F4CF} ' + (p.length_km || '?') + ' km';
    meta.appendChild(kmSpan);
    if (p.min_m !== undefined && p.max_m !== undefined) {
      const elvSpan = document.createElement('span');
      elvSpan.textContent = '\u{26F0} ' + p.min_m + '–' + p.max_m + ' m s.l.m.';
      meta.appendChild(elvSpan);
    }
    wrap.appendChild(meta);

    _transectPopup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: '260px',
      offset: [0, -4]
    })
      .setLngLat(e.lngLat)
      .setDOMContent(wrap)
      .addTo(map);
  });

  map.on('mousemove', 'transects-line', function (e) {
    if (_transectPopup) _transectPopup.setLngLat(e.lngLat);
  });

  map.on('mouseleave', 'transects-line', function () {
    map.getCanvas().style.cursor = '';
    if (_transectPopup) { _transectPopup.remove(); _transectPopup = null; }
  });
}());

// Griglia — apertura nel pannello destro (vista #rp-punto)
let _grigliaLastKey = null;

function openGrigliaPanel(p, upl, lngLat, bivElev, bivSlope) {
  const n = (v, d = 1) => (v != null && v !== '' && !isNaN(+v)) ? Number(v).toFixed(d) : '—';
  const pEl = id => document.getElementById(id);

  // Helpers locali (classi rp-punto-*)
  function sec(label) {
    const s = document.createElement('div'); s.className = 'rp-punto-sec';
    const l = document.createElement('div'); l.className = 'rp-punto-sec-label'; l.textContent = label;
    s.appendChild(l); return s;
  }
  function row(label, value) {
    const r = document.createElement('div'); r.className = 'rp-punto-row';
    const lEl = document.createElement('span'); lEl.className = 'rp-punto-row-label'; lEl.textContent = label;
    const vEl = document.createElement('span'); vEl.className = 'rp-punto-row-value'; vEl.textContent = value;
    r.appendChild(lEl); r.appendChild(vEl); return r;
  }
  function badgeRow(label, nome) {
    const r = document.createElement('div'); r.className = 'rp-punto-row';
    const lEl = document.createElement('span'); lEl.className = 'rp-punto-row-label'; lEl.textContent = label;
    const c = classColor(nome);
    const badge = document.createElement('span'); badge.className = 'rp-punto-badge';
    badge.textContent = nome || '—';
    if (c) { badge.style.background = c.bg; badge.style.color = c.text; badge.style.borderColor = c.border; }
    r.appendChild(lEl); r.appendChild(badge); return r;
  }

  // ── Intestazione quota ──
  const hdr = document.createElement('div'); hdr.className = 'rp-punto-hdr';
  const left = document.createElement('div');
  const placeEl = document.createElement('div'); placeEl.className = 'rp-punto-place';
  placeEl.textContent = upl ? (upl.Quartiere || upl.UPL || 'Palermo') : 'Palermo';
  left.appendChild(placeEl);
  if (upl) {
    const sub = document.createElement('div'); sub.className = 'rp-punto-sub';
    sub.textContent = `Circoscrizione ${upl.circoscrizione}`;
    left.appendChild(sub);
  }
  hdr.appendChild(left);
  const qBox = document.createElement('div'); qBox.className = 'rp-punto-quota-box';
  const qVal = document.createElement('span'); qVal.className = 'rp-punto-quota-val'; qVal.textContent = n(p.quota, 0);
  const qUnit = document.createElement('span'); qUnit.className = 'rp-punto-quota-unit'; qUnit.textContent = 'm s.l.m.';
  qBox.appendChild(qVal); qBox.appendChild(qUnit); hdr.appendChild(qBox);

  // ── Pendenza ──
  const sPend = sec('Pendenza');
  sPend.appendChild(row('Gradi', `${n(p.slope_deg)}°`));
  sPend.appendChild(row('Percentuale', `${n(p.slope_pct)} %`));

  // ── Morfologia ──
  const sMorf = sec('Morfologia');
  sMorf.appendChild(row('Esposizione', p.aspetto_nome || '—'));
  sMorf.appendChild(row('Forma terreno', p.geomorf_nome || '—'));

  // ── Rischio ──
  const sRisk = sec('Rischio versanti');
  sRisk.appendChild(badgeRow('Stabilità', p.stabilita_nome));
  sRisk.appendChild(badgeRow('Costruibilità', p.costr_nome));

  // ── Indici morfometrici ──
  const sIdx = sec('Indici morfometrici');
  const idxGrid = document.createElement('div'); idxGrid.className = 'rp-punto-idx-grid';
  [['TRI', n(p.tri, 2)], ['TPI', n(p.tpi, 2)], ['SRI', n(p.sri, 2)], ['HS', n(p.hillshade, 0)]].forEach(([k, v]) => {
    const cell = document.createElement('div'); cell.className = 'rp-punto-idx-cell';
    const vEl = document.createElement('div'); vEl.className = 'rp-punto-idx-val'; vEl.textContent = v;
    const kEl = document.createElement('div'); kEl.className = 'rp-punto-idx-key'; kEl.textContent = k;
    cell.appendChild(vEl); cell.appendChild(kEl); idxGrid.appendChild(cell);
  });
  sIdx.appendChild(idxGrid);

  // ── Idrologia ──
  const sIdro = sec('Idrologia');
  sIdro.appendChild(row('TWI — Umidità topografica', p.twi != null ? n(p.twi, 1) : '—'));
  sIdro.appendChild(row('SPI — Stream Power', p.spi != null ? n(p.spi, 2) : '—'));
  if (p.flow_acc != null) sIdro.appendChild(row('Flow Acc. (log)', n(p.flow_acc, 2)));
  if (p.dtw != null)      sIdro.appendChild(row('DTW — Profondità falda', `${n(p.dtw, 1)} m`));

  // ── Energia e clima ──
  const sEn = sec('Energia e clima');
  if (p.svf != null)      sEn.appendChild(row('SVF — Cielo visibile', `${Math.round(p.svf * 100)} %`));
  if (p.fv != null)       sEn.appendChild(row('Potenziale FV', `${Math.round(p.fv * 100)} %`));
  if (p.ombra_est != null) sEn.appendChild(row('Ombra estiva', `${Math.round(p.ombra_est / 2.55)} %`));
  if (p.ombra_inv != null) sEn.appendChild(row('Ombra invernale', `${Math.round(p.ombra_inv / 2.55)} %`));
  if (p.frost != null)    sEn.appendChild(row('Rischio gelata', n(p.frost, 3)));

  // ── Accessibilità ed erosione ──
  const sMob = sec('Accessibilità ed erosione');
  if (p.tobler != null)   sMob.appendChild(row('Velocità Tobler', `${n(p.tobler, 1)} km/h`));
  if (p.viewshed != null) sMob.appendChild(row('Visibilità cumulativa', `${Math.round(p.viewshed)}/6 punti`));
  if (p.rusle != null)    sMob.appendChild(row('Erosione RUSLE LS', n(p.rusle, 2)));

  // ── DTM × PAI — Gap morfologico ──
  const PAI_INFO = {
    0: null,
    1: { label: 'PAI R4 — rischio molto elevato', bg: '#fce4e4', text: '#7a0000', border: '#f5a5a5' },
    2: { label: 'PAI R3 — rischio elevato',        bg: '#fff0e0', text: '#7a3000', border: '#ffb570' },
    3: { label: 'Gap critico — instabile, fuori PAI', bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    4: { label: 'Gap moderato — instabile, fuori PAI', bg: '#fff7e0', text: '#854d0e', border: '#fde047' },
  };
  let sPai = null;
  if (p.pai_gap != null) {
    const paiKey = Math.round(p.pai_gap);
    const paiInf = PAI_INFO[paiKey];
    sPai = sec('DTM × PAI — Gap morfologico');
    if (paiInf) {
      const r2 = document.createElement('div'); r2.className = 'rp-punto-row';
      const lEl2 = document.createElement('span'); lEl2.className = 'rp-punto-row-label'; lEl2.textContent = 'Classificazione';
      const badge2 = document.createElement('span'); badge2.className = 'rp-punto-badge';
      badge2.textContent = paiInf.label;
      badge2.style.cssText = `background:${paiInf.bg};color:${paiInf.text};border-color:${paiInf.border};`;
      r2.appendChild(lEl2); r2.appendChild(badge2); sPai.appendChild(r2);
    } else {
      sPai.appendChild(row('Classificazione', 'Stabile — fuori perimetro analisi'));
    }
  }

  // ── DTM × ISTAT — Elevazione × Densità ──
  const ELEV_LABELS  = { '1': 'bassa quota',   '2': 'media quota',   '3': 'alta quota' };
  const DENS_LABELS  = { '1': 'bassa densità', '2': 'media densità', '3': 'alta densità' };
  const SLOPE_LABELS = { '1': 'bassa pendenza', '2': 'media pendenza', '3': 'alta pendenza' };
  function decodeBiv(code, xLabels, yLabels) {
    if (!code || code === '0-0') return null;
    const [x, y] = code.split('-');
    return { x: xLabels[x] || x, y: yLabels[y] || y };
  }

  let sBivElev = null;
  if (bivElev?.biv_code) {
    const dec = decodeBiv(bivElev.biv_code, ELEV_LABELS, DENS_LABELS);
    if (dec) {
      sBivElev = sec('DTM × ISTAT — Elevazione × Densità');
      sBivElev.appendChild(row('Fascia altimetrica', dec.x));
      sBivElev.appendChild(row('Densità abitanti', dec.y));
    }
  }

  let sBivSlope = null;
  if (bivSlope?.biv_code) {
    const dec = decodeBiv(bivSlope.biv_code, SLOPE_LABELS, DENS_LABELS);
    if (dec) {
      sBivSlope = sec('DTM × ISTAT — Pendenza × Densità');
      sBivSlope.appendChild(row('Classe pendenza', dec.x));
      sBivSlope.appendChild(row('Densità abitanti', dec.y));
    }
  }

  // ── Superfici UPL ──
  let sTerr = null;
  if (upl) {
    const fmtHa = v => v != null ? v.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' ha' : '—';
    const uplHa   = upl.area != null ? fmtHa(upl.area / 10000) : '—';
    const quartHa = fmtHa(uplAreas.quartiere?.[upl.Quartiere]);
    const circHa  = fmtHa(uplAreas.circoscrizione?.[upl.circoscrizione]);
    sTerr = sec('Superfici');
    sTerr.appendChild(row(`UPL · ${upl.UPL}`, uplHa));
    sTerr.appendChild(row(`Quartiere · ${upl.Quartiere}`, quartHa));
    sTerr.appendChild(row(`Circoscrizione ${upl.circoscrizione}`, circHa));
  }

  // Popola body
  const body = pEl('rp-punto-body');
  body.innerHTML = '';
  body.appendChild(hdr);
  [sPend, sMorf, sRisk, sIdx, sIdro, sEn, sMob, sPai, sBivElev, sBivSlope, sTerr].forEach(s => s && body.appendChild(s));
  body.scrollTop = 0;

  // Titolo e coordinate
  pEl('rp-punto-title').textContent = upl ? (upl.Quartiere || upl.UPL || 'Punto') : 'Punto';
  if (lngLat) {
    pEl('rp-punto-coords').textContent = `${lngLat.lat.toFixed(4)}° N  ${lngLat.lng.toFixed(4)}° E`;
  }

  // Mostra vista
  document.getElementById('rp-gallery').style.display = 'none';
  document.getElementById('rp-detail').style.display  = 'none';
  document.getElementById('rp-punto').style.display   = '';

  // Apri pannello se chiuso (icona gestita via CSS .open)
  const rpWrap = document.getElementById('rp-wrap');
  if (!rpWrap.classList.contains('open')) rpWrap.classList.add('open');
}

// Back button: torna alla galleria
document.getElementById('rp-punto-back').addEventListener('click', function () {
  document.getElementById('rp-punto').style.display   = 'none';
  document.getElementById('rp-gallery').style.display = '';
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
  _grigliaLastKey = `${e.lngLat.lng.toFixed(5)},${e.lngLat.lat.toFixed(5)}`;
  const p        = e.features[0].properties;
  const upl      = map.queryRenderedFeatures(e.point, { layers: ['upl-fill'] })[0]?.properties ?? null;
  const bivElev  = map.queryRenderedFeatures(e.point, { layers: ['bivariate-elev-proxy'] })[0]?.properties ?? null;
  const bivSlope = map.queryRenderedFeatures(e.point, { layers: ['bivariate-slope-proxy'] })[0]?.properties ?? null;
  openGrigliaPanel(p, upl, e.lngLat, bivElev, bivSlope);
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
