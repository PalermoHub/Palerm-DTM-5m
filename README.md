# Palermo DTM 5m — Analisi morfologica interattiva

**Webapp interattiva** per l'esplorazione del territorio del Comune di Palermo attraverso 36+ layer analitici derivati dall'HR-DTM-5m (risoluzione 5 m). Sviluppata per [OpenDataSicilia](https://opendatasicilia.it).

🗺️ **Demo:** [palermohub.github.io/Palerm-DTM-5m](https://palermohub.github.io/Palerm-DTM-5m/)

---

## Il dato di partenza

L'[HR-DTM-5m](https://zenodo.org/records/18872933) (Panza et al., 2026) è un Modello Digitale del Terreno ad alta risoluzione per l'intera Italia, prodotto dall'IRPI-CNR integrando rilievi LiDAR a 1–2 m con il modello nazionale TINITALY 1.1 a 10 m nelle aree non coperte. Licenza CC BY 4.0.

Il ritaglio usato copre l'intero territorio comunale di Palermo: ~6,4 milioni di pixel a 5×5 m, quota massima 1.050 m (Monte Cuccio).

---

## Layer disponibili

### Morfometria di base
| Layer | Descrizione |
|-------|-------------|
| Elevazione | Quota assoluta sul livello del mare |
| Pendenza | In gradi (media 11,4°; 52,8% pianura < 5°) |
| Esposizione | Orientamento dei versanti (prevalente: Nord-Est) |
| Rugosità (TRI / Roughness) | Irregolarità locale del terreno |

### Geomorfologia
| Layer | Descrizione |
|-------|-------------|
| Geomorfologia | Classificazione in 5 unità (versanti 60%, creste 33%) |
| TPI / TPI 300m | Topographic Position Index a scala locale e regionale |
| Curvatura totale / planare / profilo | Forma del terreno in 3 componenti |
| Curvatura instabilità | Indice morfologico di franosità |

### Idrologia morfologica
| Layer | Descrizione |
|-------|-------------|
| Bacini versanti | Delimitazione automatica dei bacini idrografici |
| Flow accumulation | Reticolo idrografico potenziale |
| TWI (Indice umidità topografica) | Predisposizione al ristagno idrico |
| SPI (Stream Power Index) | Potenziale erosivo del deflusso superficiale |
| Depth to water | Profondità alla falda morfologica |

### Rischio e pianificazione
| Layer | Descrizione |
|-------|-------------|
| Stabilità versanti | 5 classi (31% territorio in classi 3–5) |
| Costruibilità morfologica | Idoneità edificatoria da sola forma del terreno |
| Vulnerabilità | Indice composito di vulnerabilità morfologica |
| DTM × PAI gap | Aree instabili non coperte dal PAI (79% del totale) |
| Uso suolo × rischio | Cross-analisi ISPRA con stabilità |
| Heatmap rischio | Densità spaziale del rischio cumulato |

### Energia e microclima
| Layer | Descrizione |
|-------|-------------|
| Radiazione solare | Indice medio annuo (media 0,59/1,00) |
| Potenziale fotovoltaico | Stima morfologica del potenziale FV |
| Ombra estiva / invernale | Ombreggiamento al solstizio estivo e invernale |
| Sky View Factor (SVF) | Proxy per l'isola di calore urbana |
| Frost hollow | Accumulo di aria fredda nelle depressioni |

### Verde e accessibilità
| Layer | Descrizione |
|-------|-------------|
| Corridoi ecologici | Connettività morfologica del verde |
| Erosione RUSLE | Potenziale erosivo (fattore LS) |
| Accessibilità (Tobler) | Tempo di percorrenza a piedi |
| Viewshed cumulativo | Intervisibilità del territorio |

### Analisi bivariate
| Layer | Descrizione |
|-------|-------------|
| Bivariate elevazione × densità | DTM × ISTAT 2021 |
| Bivariate pendenza × densità | Slope × ISTAT 2021 |

---

## Edificato 3D

Il layer edifici combina **4 fonti** con una logica a priorità geometrica:

- **Volumetria comunale 2006** — 100.432 unità con altezza, quota gronda/piede e volume
- **Overture Maps** — copertura globale aggiornata
- **Global Building Atlas (DLR/TU München)** — immagini satellitari
- **OpenBuildingMap (Google Open Buildings)** — deep learning su satellite

**Risultato:** 111.844 poligoni finali — vince la fonte geometricamente più dettagliata (confronto vertici), con eccezione per edifici globali molto più grandi della corrispondente volumetria 2006.

Il layer supporta visualizzazione **fill-extrusion 3D** con tematizzazione per altezza (7 classi) o destinazione d'uso (11 categorie), con legenda commutabile.

---

## Analisi per zona

28 ranking card per zona (8 circoscrizioni + 25 quartieri UPL), calcolate su tutti i layer analitici tramite statistiche zonali PyQGIS. Ogni card mostra valore medio, posizione nel ranking e distribuzione per classe.

**9 transetti altimetrici** con profilo interattivo Chart.js — hover sulla mappa, grafico nel pannello laterale.

---

## Stack tecnico

| Componente | Tecnologia |
|-----------|-----------|
| Visualizzazione mappa | MapLibre GL JS v4.7.1 |
| Tile raster | PNG z8–z15 (docs/tiles/) |
| Tile vettoriali | PMTiles (contours, edificato) |
| Profili altimetrici | Chart.js 4.4.3 |
| Basemap | OSM / Google Satellite / CartoDB Dark |
| Overlay vettoriale | CTR Sicilia 2K (SiciliaHub), UPL GeoJSON |
| Pipeline analisi | PyQGIS headless (QGIS 3.x / GRASS GIS) |
| Formato intermedio | GeoPackage (GPKG) + GeoTIFF |
| Conversione tile | GDAL/OGR + gdal2tiles |
| Deploy | GitHub Pages (docs/) |

---

## Struttura repository

```
palermo_dtm_5m/
├── index.html              # Webapp principale
├── css/
│   └── map.css             # Stili (dark mode, responsive, toolbar)
├── js/
│   ├── map.js              # Logica mappa, layer, toolbar
│   ├── panel.js            # Pannello sinistro (layer selector)
│   └── right-panel.js      # Pannello destro (analisi, ranking, transetti)
├── docs/
│   ├── tiles/              # Tile PNG per layer (z8–z15)
│   │   ├── elevazione/
│   │   ├── pendenza/
│   │   ├── geomorfologia/
│   │   └── … (36 layer)
│   └── geojson/            # Contour lines, UPL boundaries
├── dati/
│   ├── palermo_dtm5m.tif   # DTM sorgente (5m)
│   ├── palermo_analisi_completa.gpkg  # GPKG con tutti i layer derivati
│   ├── analisi/            # Raster TIF per layer (input pipeline)
│   ├── analisi_per_zona.json          # Statistiche zonali
│   └── analisi/genera_*.py            # Script PyQGIS pipeline
└── run_server.py           # Server locale di sviluppo
```

---

## Features UI

- **Dark mode** — toggle con persistenza `localStorage`
- **Responsive** — toolbar collassabile su mobile, bottom sheet per pannelli
- **Vista 3D** — terrain exaggeration 0.3×–3×, ombreggiatura solare con ora regolabile
- **Edificato 3D** — fill-extrusion con altezze reali, toggle altezza/destinazione
- **Griglia analisi** — popup on-click con tutti i valori per la cella 50×50m selezionata
- **Pannello UPL** — statistiche per quartiere e circoscrizione, ranking interattivo
- **Transetti** — 9 profili altimetrici con grafico Chart.js on-hover

---

## Dati e crediti

| Dato | Fonte | Licenza |
|------|-------|---------|
| DTM 5m Italia | [IRPI-CNR / Zenodo](https://zenodo.org/records/18872933) (Panza et al., 2026) | CC BY 4.0 |
| Edificato globale | Overture Maps, Global Building Atlas (DLR), OpenBuildingMap | varie open |
| Volumetria 2006 | Comune di Palermo | open |
| Limiti UPL | Comune di Palermo | open |
| CTR Sicilia 2K | Regione Siciliana / SiciliaHub | uso pubblico |
| Uso suolo | ISPRA — Carta Nazionale di Uso del Suolo | CC BY 4.0 |
| Dati censuari | ISTAT Sezioni di Censimento 2021 | CC BY 4.0 |
| Rischio idrogeologico | PAI — Regione Siciliana | open |

**Riferimento scientifico:**
> Panza et al. (2026). *5m Resolution Digital Terrain Model for Italy HR-DTM-5m.* Zenodo. https://doi.org/10.5281/zenodo.18872933

> Oostwegel et al. (2025). *Automated high-resolution DTM production for Italy.* EarthArXiv preprint.

**Elaborazione:** Giovan Battista Vitrano per [OpenDataSicilia](https://opendatasicilia.it)
**Ringraziamenti:** Andrea Borruso, Totò Fiandaca (QGIS headless WSL2)

---

## Licenza

Codice: **MIT** — libero riuso con attribuzione.
Dati derivati: eredita licenze delle fonti originali (vedi tabella sopra).
