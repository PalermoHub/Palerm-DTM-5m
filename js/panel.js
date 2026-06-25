(function () {
  'use strict';

  const panel = document.getElementById('info-panel');
  let isOpen = false;
  let chartsReady = false;

  window.panelToggle = function () {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen && !chartsReady) {
      chartsReady = true;
      setTimeout(initCharts, 80);
    }
  };

  // Tab switching
  document.querySelectorAll('.ptab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.ptab').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-pane').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // Back-to-top
  var backTop = document.getElementById('panel-back-top');
  document.querySelectorAll('.tab-pane').forEach(function (pane) {
    pane.addEventListener('scroll', function () {
      backTop.classList.toggle('visible', pane.scrollTop > 120);
    });
  });

  window.panelScrollTop = function () {
    var active = document.querySelector('.tab-pane.active');
    if (active) active.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Plugin centro testo doughnut ────────────────────
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: function (chart) {
      if (chart.config.type !== 'doughnut') return;
      var text = chart.config.options.plugins.centerText && chart.config.options.plugins.centerText.text;
      if (!text) return;
      var ctx = chart.ctx;
      var ca = chart.chartArea;
      var cx = (ca.left + ca.right) / 2;
      var cy = (ca.top + ca.bottom) / 2;
      var lines = text.split('\n');
      var lh = 13;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#3a4e78';
      ctx.font = "bold 11px 'Titillium Web', sans-serif";
      lines.forEach(function (line, i) {
        ctx.fillText(line, cx, cy + (i - (lines.length - 1) / 2) * lh);
      });
      ctx.restore();
    }
  };
  Chart.register(centerTextPlugin);

  // ── Chart defaults ──────────────────────────────────
  function donutOpts(centerText) {
    return {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '58%',
      plugins: {
        centerText: { text: centerText || '' },
        legend: {
          display: true,
          position: 'right',
          labels: { color: '#3a4e78', font: { size: 10, family: "'Titillium Web', sans-serif" }, boxWidth: 11, padding: 7 }
        },
        tooltip: { callbacks: { label: function (c) { return ' ' + c.raw + '%'; } } }
      }
    };
  }

  function radarOpts() {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function (c) { return ' ' + c.raw + '%'; } } }
      },
      scales: {
        r: {
          grid: { color: 'rgba(30,60,160,0.1)' },
          angleLines: { color: 'rgba(30,60,160,0.1)' },
          ticks: { color: '#6070a0', font: { size: 9, family: "'Titillium Web', sans-serif" }, backdropColor: 'transparent', maxTicksLimit: 4 },
          pointLabels: { color: '#2a3a68', font: { size: 11, family: "'Titillium Web', sans-serif" } }
        }
      }
    };
  }

  // ── Chart data ───────────────────────────────────────
  function initCharts() {
    // 1 · Altimetria
    new Chart(document.getElementById('chart-elevation'), {
      type: 'doughnut',
      data: {
        labels: ['0–50 m', '50–200 m', '200–500 m', '500–800 m', '800–1051 m'],
        datasets: [{
          data: [35.6, 33.9, 19.2, 9.4, 1.8],
          backgroundColor: ['#00cb9b', '#00ef2f', '#e2ff00', '#fe7f01', '#141414'],
          borderWidth: 0
        }]
      },
      options: donutOpts('Elevazione')
    });

    // 2 · Pendenza
    new Chart(document.getElementById('chart-slope'), {
      type: 'doughnut',
      data: {
        labels: ['0–5° pianura', '5–15° moderata', '15–30° acclive', '30–45° molto acclive', '>45° subvert.'],
        datasets: [{
          data: [52.8, 16.4, 18.5, 10.3, 2.1],
          backgroundColor: ['#43a047', '#8bc34a', '#ffeb3b', '#ff9800', '#f44336'],
          borderWidth: 0
        }]
      },
      options: donutOpts('Pendenza')
    });

    // 3 · Esposizione (radar — 8 direzioni, esclusa pianura)
    new Chart(document.getElementById('chart-aspect'), {
      type: 'radar',
      data: {
        labels: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'],
        datasets: [{
          label: '% versanti',
          data: [14.6, 18.9, 15.0, 10.5, 6.6, 4.7, 5.1, 8.8],
          backgroundColor: 'rgba(36, 88, 200, 0.12)',
          borderColor: '#2458c8',
          borderWidth: 2,
          pointBackgroundColor: '#2458c8',
          pointRadius: 3
        }]
      },
      options: radarOpts()
    });

    // 4 · Geomorfologia
    new Chart(document.getElementById('chart-geomorph'), {
      type: 'doughnut',
      data: {
        labels: ['Pianure', 'Versanti', 'Creste', 'Valli', 'Depressioni'],
        datasets: [{
          data: [0.2, 60.1, 33.3, 3.3, 3.1],
          backgroundColor: ['#4fc3f7', '#7986cb', '#ce93d8', '#80cbc4', '#ffb74d'],
          borderWidth: 0
        }]
      },
      options: donutOpts('Geomorfologia')
    });

    // 5 · Stabilità versanti
    new Chart(document.getElementById('chart-stability'), {
      type: 'doughnut',
      data: {
        labels: ['Molto stabile', 'Stabile', 'Mod. instabile', 'Instabile', 'Molto instabile'],
        datasets: [{
          data: [52.6, 16.3, 12.1, 12.4, 6.3],
          backgroundColor: ['#2e7d32', '#66bb6a', '#ffee58', '#ffa726', '#ef5350'],
          borderWidth: 0
        }]
      },
      options: donutOpts('Stabilità\nversanti')
    });

    // 6 · Costruibilità morfologica
    new Chart(document.getElementById('chart-build'), {
      type: 'doughnut',
      data: {
        labels: ['Ottima', 'Buona', 'Moderata', 'Difficile', 'Non idonea'],
        datasets: [{
          data: [47.3, 14.1, 9.9, 16.4, 12.3],
          backgroundColor: ['#1a9641', '#a6d96a', '#ffffbf', '#fdae61', '#d7191c'],
          borderWidth: 0
        }]
      },
      options: donutOpts('Costruibilità')
    });

    // 7 · Radiazione solare
    new Chart(document.getElementById('chart-solar'), {
      type: 'doughnut',
      data: {
        labels: ['Molto bassa 0–0.3', 'Bassa 0.3–0.5', 'Media 0.5–0.65', 'Alta 0.65–0.8', 'Molto alta 0.8–1'],
        datasets: [{
          data: [8, 10, 56, 20, 6],
          backgroundColor: ['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c'],
          borderWidth: 0
        }]
      },
      options: donutOpts('Radiazione\nsolare')
    });

    // 8 · Rugosità (TRI)
    new Chart(document.getElementById('chart-rugosity'), {
      type: 'doughnut',
      data: {
        labels: ['Pianura 0–1', 'Ondulato 1–5', 'Collinare 5–10', 'Accidentato 10–25', 'Molto acc. >25'],
        datasets: [{
          data: [50, 27, 19, 3, 1],
          backgroundColor: ['#3182bd', '#6baed6', '#ffffb2', '#fd8d3c', '#bd0026'],
          borderWidth: 0
        }]
      },
      options: donutOpts('Rugosità\n(TRI)')
    });

    // 9 · TPI locale
    new Chart(document.getElementById('chart-tpi'), {
      type: 'doughnut',
      data: {
        labels: ['Valle / Depressione (< −1)', 'Versante basso (−1 – −0,5)', 'Pianura / Mezzacosta (±0,5)', 'Versante alto (+0,5 – +1)', 'Cresta / Sommità (> +1)'],
        datasets: [{ data: [5, 20, 50, 20, 5], backgroundColor: ['#4575b4','#91bfdb','#ffffbf','#fc8d59','#d73027'], borderWidth: 0 }]
      },
      options: donutOpts('TPI\nlocale')
    });

    // 10 · TPI 300 m
    new Chart(document.getElementById('chart-tpi300'), {
      type: 'doughnut',
      data: {
        labels: ['Fondovalle (< −5 m)', 'Versante basso (−5 – −2 m)', 'Pianura / Mezzacosta (±2 m)', 'Versante alto (+2 – +5 m)', 'Cresta / Dorsale (> +5 m)'],
        datasets: [{ data: [10, 15, 50, 15, 10], backgroundColor: ['#4575b4','#91bfdb','#ffffbf','#fc8d59','#d73027'], borderWidth: 0 }]
      },
      options: donutOpts('TPI\n300 m')
    });

    // 11 · Curvatura planare
    new Chart(document.getElementById('chart-curvplanare'), {
      type: 'doughnut',
      data: {
        labels: ['Convergente (accumulo)', 'Planare (±0,05)', 'Divergente (dispersione)'],
        datasets: [{ data: [25, 50, 25], backgroundColor: ['#2166ac','#f7f7f7','#d6604d'], borderWidth: 0 }]
      },
      options: donutOpts('Curvatura\nplanare')
    });

    // 12 · Curvatura profilo
    new Chart(document.getElementById('chart-curvprofilo'), {
      type: 'doughnut',
      data: {
        labels: ['Concava (accelerazione)', 'Lineare (±0,05)', 'Convessa (decelerazione)'],
        datasets: [{ data: [25, 50, 25], backgroundColor: ['#1a9850','#ffffbf','#d73027'], borderWidth: 0 }]
      },
      options: donutOpts('Curvatura\nprofilo')
    });

    // 13 · Curvatura totale
    new Chart(document.getElementById('chart-curvtotale'), {
      type: 'doughnut',
      data: {
        labels: ['Fortemente concava (< −0,10)', 'Mod. concava (−0,10 – −0,03)', 'Piatta / lineare (±0,03)', 'Mod. convessa (+0,03 – +0,10)', 'Fortemente convessa (> +0,10)'],
        datasets: [{ data: [5, 20, 50, 20, 5], backgroundColor: ['#4575b4','#91bfdb','#ffffbf','#fc8d59','#d73027'], borderWidth: 0 }]
      },
      options: donutOpts('Curvatura\ntotale')
    });

    // 14 · Heatmap complessità
    new Chart(document.getElementById('chart-heatmap'), {
      type: 'doughnut',
      data: {
        labels: ['Molto bassa (0–0,2)', 'Bassa (0,2–0,4)', 'Media (0,4–0,6)', 'Alta (0,6–0,8)', 'Molto alta (0,8–1,0)'],
        datasets: [{ data: [63, 12, 12, 8, 4], backgroundColor: ['#053061','#4393c3','#f7f7f7','#d6604d','#67001f'], borderWidth: 0 }]
      },
      options: donutOpts('Complessità\nterreno')
    });

    // 15 · Vulnerabilità
    new Chart(document.getElementById('chart-vulnerabilita'), {
      type: 'doughnut',
      data: {
        labels: ['Molto bassa (0–0,2)', 'Bassa (0,2–0,4)', 'Media (0,4–0,6)', 'Alta (0,6–0,8)', 'Critica (0,8–1,0)'],
        datasets: [{ data: [57, 12, 13, 13, 6], backgroundColor: ['#1a9641','#a6d96a','#ffffbf','#f46d43','#a50026'], borderWidth: 0 }]
      },
      options: donutOpts('Vulnerabilità\nterritoriale')
    });

    // 16 · TWI
    new Chart(document.getElementById('chart-twi'), {
      type: 'doughnut',
      data: {
        labels: ['< 6 drenato', '6–9 bassa sat.', '9–12 media sat.', '12–16 alta sat.', '> 16 fondovalle'],
        datasets: [{ data: [15, 30, 35, 15, 5], backgroundColor: ['#f7fbff','#c6dbef','#6baed6','#2171b5','#08306b'], borderWidth: 0 }]
      },
      options: donutOpts('TWI')
    });

    // 17 · Flow Accumulation
    new Chart(document.getElementById('chart-flowacc'), {
      type: 'doughnut',
      data: {
        labels: ['Versante (1–10 celle)', 'Interfluvi (10–100)', 'Rilleni (100–1k)', 'Corsi d\'acqua (1k–10k)', 'Aste principali (>10k)'],
        datasets: [{ data: [40, 30, 20, 8, 2], backgroundColor: ['#f7fbff','#c6dbef','#6baed6','#2171b5','#08306b'], borderWidth: 0 }]
      },
      options: donutOpts('Flow\nAccumulation')
    });

    // 18 · SPI
    new Chart(document.getElementById('chart-spi'), {
      type: 'doughnut',
      data: {
        labels: ['< 4 bassa energia', '4–7 moderata', '7–10 alta erosiva', '> 10 estremo'],
        datasets: [{ data: [30, 35, 25, 10], backgroundColor: ['#ffffcc','#feb24c','#f03b20','#bd0026'], borderWidth: 0 }]
      },
      options: donutOpts('SPI')
    });

    // 19 · DTW
    new Chart(document.getElementById('chart-dtw'), {
      type: 'doughnut',
      data: {
        labels: ['0–2 m falda superficiale', '2–4 m sub-superficiale', '4–6 m intermedia', '6–8 m profonda', '> 8 m molto profonda'],
        datasets: [{ data: [20, 25, 30, 15, 10], backgroundColor: ['#00682c','#31a354','#aedea7','#fd8d3c','#800026'], borderWidth: 0 }]
      },
      options: donutOpts('Depth-to\nWater')
    });

    // 20 · Solare raffinato
    new Chart(document.getElementById('chart-solarraf'), {
      type: 'doughnut',
      data: {
        labels: ['0–0,2 minima (N/ombra)', '0,2–0,4 bassa', '0,4–0,6 media', '0,6–0,8 alta', '0,8–1,0 ottima (S/SO)'],
        datasets: [{ data: [8, 41, 36, 11, 4], backgroundColor: ['#440154','#3e6f8e','#1fa188','#9fda3a','#f2a600'], borderWidth: 0 }]
      },
      options: donutOpts('Solare\nraffinato')
    });

    // 21 · Fotovoltaico
    new Chart(document.getElementById('chart-fotovoltaico'), {
      type: 'doughnut',
      data: {
        labels: ['0–0,2 basso (N/ombra)', '0,2–0,3 modesto', '0,3–0,4 medio', '0,4–0,5 buono', '0,5–0,6 alto', '> 0,6 ottimale'],
        datasets: [{ data: [10, 14, 20, 22, 28, 6], backgroundColor: ['#440154','#3e6f8e','#26808e','#35b779','#b4de2c','#fde725'], borderWidth: 0 }]
      },
      options: donutOpts('Potenziale\nFV')
    });

    // 22 · Ombra estiva
    new Chart(document.getElementById('chart-ombraestiva'), {
      type: 'doughnut',
      data: {
        labels: ['Piena luce', 'Luce parziale', 'Semi-ombra', 'Ombra (forre)'],
        datasets: [{ data: [92, 6, 1, 1], backgroundColor: ['#fff7bc','#fe9929','#cc4c02','#7f2704'], borderWidth: 0 }]
      },
      options: donutOpts('Ombra\nestiva')
    });

    // 23 · Ombra invernale
    new Chart(document.getElementById('chart-ombrainvernale'), {
      type: 'doughnut',
      data: {
        labels: ['Soleggiato (versanti S)', 'Semi-ombra (pianura)', 'Ombra parziale', 'Ombra quasi totale (N)'],
        datasets: [{ data: [5, 76, 18, 1], backgroundColor: ['#c6dbef','#6baed6','#2171b5','#084594'], borderWidth: 0 }]
      },
      options: donutOpts('Ombra\ninvernale')
    });

    // 24 · Frost hollow
    new Chart(document.getElementById('chart-frosthollow'), {
      type: 'doughnut',
      data: {
        labels: ['Nullo / aree piatte', 'Trascurabile', 'Basso', 'Moderato', 'Alto', 'Critico'],
        datasets: [{ data: [67, 21, 8, 3.5, 0.3, 0.2], backgroundColor: ['#f5f5ff','#c6dbef','#6baed6','#3182bd','#08519c','#08306b'], borderWidth: 0 }]
      },
      options: donutOpts('Frost\nHollow')
    });

    // 25 · SVF
    new Chart(document.getElementById('chart-svf'), {
      type: 'doughnut',
      data: {
        labels: ['< 0,50 forte ostruzione', '0,50–0,65 ostruito', '0,65–0,75 parziale', '0,75–0,82 semi-aperto', '0,82–0,88 aperto', '0,88–0,94 molto aperto', '> 0,94 pianura'],
        datasets: [{ data: [0.2, 0.9, 1.4, 4.8, 8.7, 12.5, 71.5], backgroundColor: ['#21252a','#1e4e79','#3182bd','#74c476','#c7e9c0','#ffffc0','#f8f8f0'], borderWidth: 0 }]
      },
      options: donutOpts('Sky View\nFactor')
    });

    // 26 · Corridoi ecologici
    new Chart(document.getElementById('chart-corridoi'), {
      type: 'doughnut',
      data: {
        labels: ['Barriera critica (0–0,15)', 'Barriera alta (0,15–0,30)', 'Barriera moderata (0,30–0,45)', 'Corridoio potenziale (0,45–0,60)', 'Corridoio buono (0,60–0,73)', 'Corridoio ottimo (0,73–0,85)', 'Nucleo ottimale (> 0,85)'],
        datasets: [{ data: [16.4, 8.9, 6.6, 6.0, 6.3, 10.4, 45.5], backgroundColor: ['#b40000','#e65520','#fdae61','#fee08b','#a6d96a','#66bd63','#1a9850'], borderWidth: 0 }]
      },
      options: donutOpts('Corridoi\necologici')
    });

    // 27 · Erosione RUSLE LS
    new Chart(document.getElementById('chart-erosionerusle'), {
      type: 'doughnut',
      data: {
        labels: ['Molto basso (LS < 0,20)', 'Basso (0,20–0,52)', 'Medio (0,52–3,68)', 'Alto (3,68–7,76)', 'Critico (> 7,76)'],
        datasets: [{ data: [25, 25, 25, 20, 5], backgroundColor: ['#ffffe0','#fecc5c','#fd8d3c','#e31a1c','#800026'], borderWidth: 0 }]
      },
      options: donutOpts('RUSLE\nLS')
    });

    // 28 · Curvatura instabilità
    new Chart(document.getElementById('chart-curvaturainstabilita'), {
      type: 'doughnut',
      data: {
        labels: ['Stabile (pianura/divergente)', 'Basso (lieve conv.)', 'Moderato (accumulo)', 'Alto (instabilità)', 'Critico (canyon)'],
        datasets: [{ data: [60, 15, 13, 7, 5], backgroundColor: ['#e5f5e0','#a1d99b','#fdd058','#ef6548','#bd0026'], borderWidth: 0 }]
      },
      options: donutOpts('Curvatura\ninstabilità')
    });

    // 29 · DTM×PAI gap
    new Chart(document.getElementById('chart-dtmpaigap'), {
      type: 'doughnut',
      data: {
        labels: ['PAI R4 perimetrato', 'PAI R3 perimetrato', 'Gap critico (fuori PAI)', 'Gap moderato (fuori PAI)'],
        datasets: [{ data: [7.2, 19.9, 42.2, 30.8], backgroundColor: ['#b00020','#ff6432','#dc1e1e','#ffa000'], borderWidth: 0 }]
      },
      options: donutOpts('DTM\n×PAI')
    });

    // 30 · Uso suolo rischio
    new Chart(document.getElementById('chart-usosuolorischio'), {
      type: 'doughnut',
      data: {
        labels: ['Pendenza bassa (≤ 15°)', 'Pendenza moderata (15–30°)', 'Pendenza alta (> 30°)'],
        datasets: [{ data: [95.2, 3.5, 1.2], backgroundColor: ['#f0c020','#e87810','#c81010'], borderWidth: 0 }]
      },
      options: donutOpts('Edificato\npendenza')
    });

    // 31 · Accessibilità Tobler
    new Chart(document.getElementById('chart-accessibilita'), {
      type: 'doughnut',
      data: {
        labels: ['< 1 km/h impraticabile', '1–2,5 km/h molto difficile', '2,5–3,8 km/h difficile', '3,8–5,0 km/h moderato', '> 5,0 km/h facile'],
        datasets: [{ data: [18.8, 16.6, 13.0, 51.4, 0.2], backgroundColor: ['#a50026','#d73027','#fd8d3c','#fee08b','#1a9641'], borderWidth: 0 }]
      },
      options: donutOpts('Accessibilità\nTobler')
    });

    // 32 · Viewshed
    new Chart(document.getElementById('chart-viewshed'), {
      type: 'doughnut',
      data: {
        labels: ['0 obs non visibile', '1 obs marginale', '2 obs bassa', '3 obs media', '4 obs alta', '5 obs molto alta'],
        datasets: [{ data: [31.0, 24.4, 17.6, 13.6, 10.5, 2.8], backgroundColor: ['#f0f0f0','#f7fbff','#c6dbef','#6baed6','#3182bd','#08519c'], borderWidth: 0 }]
      },
      options: donutOpts('Viewshed\ncumulativo')
    });
  }
})();
