# DTM 3D Palermo

Visualizzatore 3D del Modello Digitale del Terreno (DTM 5 m) del Comune di Palermo, pubblicato come webapp statica su GitHub Pages con [MapLibre GL JS 4](https://maplibre.org/).

**Demo:** `https://<utente>.github.io/<repo>/`

---

## Cosa contiene il repo

```
├── palermo_dtm5m_clipped.tif   # DTM sorgente ritagliato sul Comune (EPSG:6875, 5 m, ~55 MB)
├── palermo_dtm5m_epsg6875.tif  # DTM grezzo originale (pre-clip)
├── palermo_comune.geojson       # Perimetro comunale (per il clip)
├── scripts/
│   ├── build.sh                 # Pipeline GDAL → PMTiles (terrain, hillshade, contours)
│   ├── encode_terrarium.py      # Codifica DTM float → Terrarium RGB uint8
│   └── serve.py                 # Dev server HTTP/1.1 con Range request (richiesto da PMTiles)
├── web/
│   ├── index.html               # Webapp MapLibre GL JS 4 con pannello controlli
│   └── tiles/                   # PMTiles generati (gitignored su main, prodotti dalla CI)
│       ├── terrain.pmtiles      # Terrarium RGB z9-14, 512 px
│       ├── hillshade.pmtiles    # Hillshade z9-14, 512 px
│       └── contours.pmtiles     # Curve di livello 10 m, z10-16 (MVT)
└── .github/workflows/build.yml  # GitHub Actions: build automatico al push del TIF
```

---

## Dati sorgente

| Campo | Valore |
|---|---|
| Sorgente | DTM 5 m — [Zenodo HRDTM5m Palermo](https://zenodo.org/) |
| CRS originale | EPSG:6875 (RDN2008 / Italy zone, N-E) |
| Risoluzione | 5 m/pixel |
| Area | Comune di Palermo (bbox 13.13–13.60°E, 38.01–38.26°N) |
| Quota min/max | 0 – 1050 m (Monte Cuccio) |
| NoData | -9999 |

---

## Pipeline di build

```
palermo_dtm5m_clipped.tif  (EPSG:6875)
        │
        ├─ gdalwarp → EPSG:3857 (5 m) ──────────────────────────┐
        │       │                                                 │
        │       ├─ encode_terrarium.py → terrain_rgb.tif         │
        │       │       │                                         │
        │       │       └─ gdal2tiles z9-14 (512 px)             │
        │       │               └─ mb-util → .mbtiles            │
        │       │                       └─ pmtiles convert        │
        │       │                               └─ terrain.pmtiles│
        │       │                                                 │
        │       └─ gdaldem hillshade ──────────────────────────── │
        │               └─ gdal2tiles → mb-util → pmtiles.convert │
        │                       └─ hillshade.pmtiles              │
        │                                                         │
        └─ gdalwarp → EPSG:4326 ──────────────────────────────────┘
                │
                └─ gdal_contour -i 10 → ogr2ogr (campo major) → GeoJSON
                        └─ tippecanoe z10-16
                                └─ contours.pmtiles
```

### Encoding Terrarium

MapLibre usa l'encoding **Terrarium** per decodificare l'elevazione dai canali RGB:

```
elevation = (R × 256 + G + B ÷ 256) − 32768
```

`encode_terrarium.py` applica la trasformazione inversa sul DTM float a 32 bit.

---

## Sviluppo locale

### Requisiti

| Tool | Uso |
|---|---|
| GDAL ≥ 3.6 (`gdal-bin`) | warp, gdal2tiles, hillshade, contour |
| Python 3.9+ con `rasterio`, `mbutil` | encoding RGB, pack MBTiles |
| `pmtiles` CLI ([go-pmtiles](https://github.com/protomaps/go-pmtiles)) | conversione MBTiles → PMTiles |
| `tippecanoe` ([felt/tippecanoe](https://github.com/felt/tippecanoe)) | tiling vettoriale contour |

### Build

```bash
# dalla root del repo
bash scripts/build.sh
```

Variabili d'ambiente disponibili:

| Variabile | Default | Descrizione |
|---|---|---|
| `SRC` | `palermo_dtm5m_clipped.tif` | DTM sorgente |
| `ZOOM_TERRAIN` | `9-14` | Range zoom terrain/hillshade |
| `ZOOM_CONTOURS_MIN` | `10` | Zoom minimo contour |
| `ZOOM_CONTOURS_MAX` | `16` | Zoom massimo contour |
| `CONTOUR_INTERVAL` | `10` | Intervallo curve di livello (m) |

Tempi indicativi su 8 core: **~25 secondi**.

### Dev server

Il browser richiede Range requests HTTP per caricare i PMTiles in modo efficiente.
**Non usare** `python3 -m http.server` (HTTP/1.0, no Range).

```bash
python3 scripts/serve.py         # http://localhost:8765
python3 scripts/serve.py 9000    # porta alternativa
```

---

## Deploy su GitHub Pages

1. Abilita Git LFS nel repo (i file `.tif` e `.pmtiles` sono tracciati via LFS):
   ```bash
   git lfs install
   git add .
   git commit -m "feat: DTM 3D Palermo"
   git push
   ```

2. In **Settings → Pages → Source** seleziona il branch `gh-pages`.

3. Il workflow `.github/workflows/build.yml` si attiva automaticamente ad ogni push che modifica `palermo_dtm5m_clipped.tif` o i file in `scripts/` o `web/`. Genera i PMTiles e li pubblica su `gh-pages`.

---

## Webapp — funzionalità

| Controllo | Funzione |
|---|---|
| Terreno 3D | Attiva/disattiva `setTerrain` |
| Esagerazione | Slider 1×–6× (default 1.5×) |
| Hillshade | Toggle + slider opacità |
| Curve di livello | Toggle + slider opacità |
| Vista 3D ↔ Pianta | Alterna pitch 45° / 0° |
| Hash URL | Posizione mappa salvata nell'URL |

Stack front-end: **MapLibre GL JS 4.7.1** + **pmtiles@3.2.1** (caricati da CDN unpkg con hash SRI).

---

## File non tracciati da git

`web/tiles/` è nel `.gitignore` del branch `main` — i PMTiles vengono generati dalla CI e pubblicati direttamente su `gh-pages`, non commitati sul branch principale.
