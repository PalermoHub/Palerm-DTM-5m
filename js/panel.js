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

  // ── Chart defaults ──────────────────────────────────
  function barOpts(unit) {
    unit = unit || '%';
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function (c) { return ' ' + c.raw + unit; } } }
      },
      scales: {
        x: { ticks: { color: '#6070a0', font: { size: 10, family: "'Titillium Web', sans-serif" } }, grid: { color: 'rgba(30,60,160,0.06)' } },
        y: { ticks: { color: '#6070a0', font: { size: 10, family: "'Titillium Web', sans-serif" }, callback: function (v) { return v + unit; } }, grid: { color: 'rgba(30,60,160,0.08)' } }
      }
    };
  }

  function donutOpts() {
    return {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '58%',
      plugins: {
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
      type: 'bar',
      data: {
        labels: ['0–50 m', '50–200 m', '200–500 m', '500–800 m', '800–1051 m'],
        datasets: [{
          data: [35.6, 33.9, 19.2, 9.4, 1.8],
          backgroundColor: ['#00cb9b', '#00ef2f', '#e2ff00', '#fe7f01', '#505050'],
          borderRadius: 4, borderWidth: 0
        }]
      },
      options: barOpts()
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
      options: donutOpts()
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
      type: 'bar',
      data: {
        labels: ['Pianure', 'Versanti', 'Creste', 'Valli', 'Depressioni'],
        datasets: [{
          data: [0.2, 60.1, 33.3, 3.3, 3.1],
          backgroundColor: ['#4fc3f7', '#7986cb', '#ce93d8', '#80cbc4', '#ffb74d'],
          borderRadius: 4, borderWidth: 0
        }]
      },
      options: barOpts()
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
      options: donutOpts()
    });

    // 6 · Costruibilità morfologica
    new Chart(document.getElementById('chart-build'), {
      type: 'doughnut',
      data: {
        labels: ['Ottima', 'Buona', 'Moderata', 'Difficile', 'Non idonea'],
        datasets: [{
          data: [47.3, 14.1, 9.9, 16.4, 12.3],
          backgroundColor: ['#1565c0', '#42a5f5', '#ffcc02', '#ff7043', '#b71c1c'],
          borderWidth: 0
        }]
      },
      options: donutOpts()
    });
  }
})();
