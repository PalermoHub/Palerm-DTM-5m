
  (function () {
    // ── PMTiles protocol ──────────────────────────────────────────────────────
    const p = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", p.tile);

    // Absolute URL for tiles dir — works locally and on GitHub Pages
    const TILES = new URL("tiles", location.href).href;

    // ── Map init ──────────────────────────────────────────────────────────────
    const map = new maplibregl.Map({
      container: "map",
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [13.35, 38.12],
      zoom: 10,
      pitch: 45,
      bearing: -10,
      maxPitch: 85,
      hash: true,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

    // ── Error logging (remove after debug) ───────────────────────────────────
    map.on("error", (e) => console.error("[MapLibre error]", e.error || e));

    // ── Load sources + layers ─────────────────────────────────────────────────
    map.on("load", () => {

      // Terrain RGB source (Terrarium, 512 px tiles)
      map.addSource("terrain-dem", {
        type: "raster-dem",
        url: `pmtiles://${TILES}/terrain.pmtiles`,
        tileSize: 512,
        encoding: "terrarium",
        minzoom: 9,
        maxzoom: 14,
      });

      map.setTerrain({ source: "terrain-dem", exaggeration: 1.5 });
      console.log("[DTM] setTerrain called", map.getTerrain());

      // Hillshade raster
      map.addSource("hillshade-src", {
        type: "raster",
        url: `pmtiles://${TILES}/hillshade.pmtiles`,
        tileSize: 512,
        minzoom: 9,
        maxzoom: 14,
      });

      map.addLayer({
        id: "hillshade",
        type: "raster",
        source: "hillshade-src",
        paint: {
          "raster-opacity": 0.55,
          "raster-opacity-transition": { duration: 300 },
          "raster-resampling": "linear",
        },
      });

      // Contour lines (vector PMTiles, source-layer: contours)
      map.addSource("contours-src", {
        type: "vector",
        url: `pmtiles://${TILES}/contours.pmtiles`,
        minzoom: 10,
        maxzoom: 16,
      });

      map.addLayer({
        id: "contours-minor",
        type: "line",
        source: "contours-src",
        "source-layer": "contours",
        filter: ["==", ["get", "major"], 0],
        minzoom: 12,
        paint: {
          "line-color": "#6b4226",
          "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.4, 16, 0.9],
          "line-opacity": 0.7,
        },
      });

      map.addLayer({
        id: "contours-major",
        type: "line",
        source: "contours-src",
        "source-layer": "contours",
        filter: ["==", ["get", "major"], 1],
        minzoom: 10,
        paint: {
          "line-color": "#6b4226",
          "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.8, 16, 2.0],
          "line-opacity": 0.7,
        },
      });

      map.addLayer({
        id: "contours-label",
        type: "symbol",
        source: "contours-src",
        "source-layer": "contours",
        filter: ["==", ["get", "major"], 1],
        minzoom: 12,
        layout: {
          "symbol-placement": "line",
          "text-field": ["concat", ["to-string", ["get", "elev"]], " m"],
          "text-size": 10,
          "text-font": ["Noto Sans Regular"],
          "text-offset": [0, 0.2],
        },
        paint: {
          "text-color": "#5a3010",
          "text-halo-color": "rgba(255,255,255,0.7)",
          "text-halo-width": 1.5,
        },
      });
    });

    // ── Controls wiring ───────────────────────────────────────────────────────
    function onReady(fn) {
      if (map.isStyleLoaded()) fn();
      else map.once("load", fn);
    }

    // Terrain toggle
    document.getElementById("chk-terrain").addEventListener("change", e => {
      onReady(() => {
        if (e.target.checked) {
          map.setTerrain({ source: "terrain-dem", exaggeration: +slExag.value });
        } else {
          map.setTerrain(null);
        }
      });
    });

    // Exaggeration
    const slExag = document.getElementById("sl-exag");
    const valExag = document.getElementById("val-exag");
    slExag.addEventListener("input", () => {
      const v = +slExag.value;
      valExag.textContent = v.toFixed(1) + "×";
      onReady(() => {
        const t = map.getTerrain();
        if (t) map.setTerrain({ ...t, exaggeration: v });
      });
    });

    // Hillshade toggle
    document.getElementById("chk-hs").addEventListener("change", e => {
      onReady(() => map.setLayoutProperty("hillshade", "visibility", e.target.checked ? "visible" : "none"));
    });

    // Hillshade opacity
    const slHs = document.getElementById("sl-hs");
    const valHs = document.getElementById("val-hs");
    slHs.addEventListener("input", () => {
      const v = +slHs.value;
      valHs.textContent = v.toFixed(2);
      onReady(() => map.setPaintProperty("hillshade", "raster-opacity", v));
    });

    // Contours toggle
    document.getElementById("chk-cnt").addEventListener("change", e => {
      const vis = e.target.checked ? "visible" : "none";
      onReady(() => {
        ["contours-minor", "contours-major", "contours-label"].forEach(id =>
          map.setLayoutProperty(id, "visibility", vis)
        );
      });
    });

    // Contours opacity
    const slCnt = document.getElementById("sl-cnt");
    const valCnt = document.getElementById("val-cnt");
    slCnt.addEventListener("input", () => {
      const v = +slCnt.value;
      valCnt.textContent = v.toFixed(2);
      onReady(() => {
        map.setPaintProperty("contours-minor", "line-opacity", v);
        map.setPaintProperty("contours-major", "line-opacity", v);
        map.setPaintProperty("contours-label", "text-opacity", v);
      });
    });

    // Pitch toggle 3D ↔ top-down
    let in3d = true;
    document.getElementById("pitch-btn").addEventListener("click", () => {
      in3d = !in3d;
      map.easeTo({ pitch: in3d ? 45 : 0, bearing: in3d ? -10 : 0, duration: 600 });
    });
  })();


