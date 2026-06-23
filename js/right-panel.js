(function () {
  'use strict';

  // ── Dati per ogni analisi ────────────────────────────────────────────────
  const ANALYSES = {
    elevation: {
      icon: '🎨',
      title: 'Mappa Elevazione',
      layer: 'elevation-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Quota max <strong>1.050 m</strong> (Monte Cuccio). Quota media <strong>183 m</strong> s.l.m. ' +
          'Quasi il <strong>70% della superficie</strong> si trova sotto i 200 m, ma il territorio si estende ' +
          'verticalmente per oltre un chilometro.'
        );

        var canvasId = 'rp-c-elev';

        // Crea la card della ring chart ad anello
        var card = document.createElement('div');
        card.className = 'ring-card';

        // Intestazione card
        var cardHeader = document.createElement('div');
        cardHeader.className = 'ring-card-header';
        cardHeader.textContent = 'Distribuzione classi';
        card.appendChild(cardHeader);

        // Container grafico
        var chartContainer = document.createElement('div');
        chartContainer.className = 'ring-chart-container';

        var canvas = document.createElement('canvas');
        canvas.id = canvasId;
        chartContainer.appendChild(canvas);

        // Testo centrale all'anello
        var centerText = document.createElement('div');
        centerText.className = 'ring-chart-center';

        var centerVal = document.createElement('div');
        centerVal.className = 'ring-chart-center-val';
        centerVal.textContent = '158.9';

        var centerLabel = document.createElement('div');
        centerLabel.className = 'ring-chart-center-label';
        centerLabel.textContent = 'km²';

        centerText.appendChild(centerVal);
        centerText.appendChild(centerLabel);
        chartContainer.appendChild(centerText);

        card.appendChild(chartContainer);

        // Lista legenda
        var legendList = document.createElement('div');
        legendList.className = 'ring-legend-list';

        var legendData = [
          { label: '0–50 m  costiera e pianura', val: '56.6', pct: '35.6%', color: '#00cb9b' },
          { label: '50–200 m  bassa collina', val: '53.9', pct: '33.9%', color: '#00ef2f' },
          { label: '200–500 m  media collina', val: '30.5', pct: '19.2%', color: '#e2ff00' },
          { label: '500–800 m  alta collina', val: '14.9', pct: '9.4%', color: '#fe7f01' },
          { label: '800–1051 m  montagna', val: '2.9', pct: '1.8%', color: '#505050' }
        ];

        legendData.forEach(function (item) {
          var itemEl = document.createElement('div');
          itemEl.className = 'ring-legend-item';

          var dot = document.createElement('div');
          dot.className = 'ring-legend-dot';
          dot.style.backgroundColor = item.color;
          itemEl.appendChild(dot);

          var label = document.createElement('div');
          label.className = 'ring-legend-label';
          label.textContent = item.label;
          itemEl.appendChild(label);

          var barWrap = document.createElement('div');
          barWrap.className = 'ring-legend-bar-wrap';

          var barFill = document.createElement('div');
          barFill.className = 'ring-legend-bar-fill';
          barFill.style.backgroundColor = item.color;
          var pctVal = parseFloat(item.pct);
          barFill.style.width = pctVal + '%';

          var knob = document.createElement('div');
          knob.className = 'ring-legend-bar-knob';
          knob.style.backgroundColor = item.color;
          barFill.appendChild(knob);

          barWrap.appendChild(barFill);
          itemEl.appendChild(barWrap);

          var val = document.createElement('div');
          val.className = 'ring-legend-val';
          val.textContent = item.val;
          itemEl.appendChild(val);

          var pct = document.createElement('div');
          pct.className = 'ring-legend-pct';
          pct.textContent = item.pct;
          itemEl.appendChild(pct);

          legendList.appendChild(itemEl);
        });

        card.appendChild(legendList);

        // Separatore
        var divider = document.createElement('div');
        divider.className = 'ring-card-divider';
        card.appendChild(divider);

        // Righe di sintesi
        var summaryRow = document.createElement('div');
        summaryRow.className = 'ring-summary-row';

        var summaries = [
          { val: '158.9', label: 'km² area' },
          { val: '183', label: 'm media' },
          { val: '1.050', label: 'm max' }
        ];

        summaries.forEach(function (s) {
          var sumItem = document.createElement('div');
          sumItem.className = 'ring-summary-item';

          var sVal = document.createElement('span');
          sVal.className = 'ring-summary-val';
          sVal.textContent = s.val;

          var sLabel = document.createElement('span');
          sLabel.className = 'ring-summary-label';
          sLabel.textContent = s.label;

          sumItem.appendChild(sVal);
          sumItem.appendChild(sLabel);
          summaryRow.appendChild(sumItem);
        });

        card.appendChild(summaryRow);
        el.appendChild(card);

        // Inizializza il grafico ad anello (ring)
        initChart(canvasId, 'ring',
          ['0–50m', '50–200m', '200–500m', '500–800m', '800–1051m'],
          [35.6, 33.9, 19.2, 9.4, 1.8],
          ['#00cb9b', '#00ef2f', '#e2ff00', '#fe7f01', '#505050']
        );
      }
    },

    slope: {
      icon: '📐',
      title: 'Pendenze',
      layer: null,
      hasLayer: false,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Pendenza media <strong>11,4°</strong> con deviazione standard 13,6°. ' +
          'Oltre la metà del territorio è pianeggiante, ma quasi <strong>un terzo supera i 15°</strong>.'
        );
        appendSectionTitle(el, 'Classi di pendenza');
        var canvasId = 'rp-c-slope';
        appendChart(el, canvasId);
        appendTable(el, ['Classe', '%'], [
          ['0–5°  pianura', '52,8%', 'hl'],
          ['5–15°  moderata', '16,4%', ''],
          ['15–30°  acclive', '18,5%', ''],
          ['30–45°  molto acclive', '10,3%', 'hl-warn'],
          ['>45°  subverticale', '2,1%', 'hl-warn']
        ]);
        initChart(canvasId, 'doughnut',
          ['0–5° pianura', '5–15° mod.', '15–30° acclive', '30–45° molto acclive', '>45° subvert.'],
          [52.8, 16.4, 18.5, 10.3, 2.1],
          ['#43a047', '#8bc34a', '#ffeb3b', '#ff9800', '#f44336']
        );
      }
    },

    aspect: {
      icon: '🧭',
      title: 'Esposizione',
      layer: null,
      hasLayer: false,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'I versanti dominano verso <strong>Nord-Est (18,9%)</strong>: coerente con la posizione di Palermo ' +
          'aperta sul Tirreno. I versanti a Sud e Sud-Ovest sono i meno rappresentati.'
        );
        appendSectionTitle(el, 'Distribuzione per direzione');
        var canvasId = 'rp-c-aspect';
        appendChart(el, canvasId);
        appendTable(el, ['Esposizione', '%'], [
          ['Pianura (nessuna netta)', '15,9%', ''],
          ['Nord', '14,6%', ''],
          ['Nord-Est  ← prevalente', '18,9%', 'hl'],
          ['Est', '15,0%', ''],
          ['Sud-Est', '10,5%', ''],
          ['Sud', '6,6%', ''],
          ['Sud-Ovest', '4,7%', ''],
          ['Ovest', '5,1%', ''],
          ['Nord-Ovest', '8,8%', '']
        ]);
        initChart(canvasId, 'radar',
          ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'],
          [14.6, 18.9, 15.0, 10.5, 6.6, 4.7, 5.1, 8.8],
          null
        );
      }
    },

    geomorph: {
      icon: '🏔️',
      title: 'Geomorfologia',
      layer: null,
      hasLayer: false,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Il paesaggio di Palermo è dominato dai <strong>versanti (60%)</strong> e dalle ' +
          '<strong>creste (33%)</strong>. Le pianure vere sono pochissime. ' +
          'Valli e depressioni (<strong>6,4%</strong>) concentrano il deflusso idrico.'
        );
        appendSectionTitle(el, 'Unità geomorfologiche');
        var canvasId = 'rp-c-geomorph';
        appendChart(el, canvasId);
        appendTable(el, ['Classe', 'Descrizione', '%'], [
          ['1', 'Pianure e fondovalle', '0,2%'],
          ['3', 'Versanti regolari', '60,1%'],
          ['4', 'Creste e dorsali', '33,3%'],
          ['7', 'Valli e impluvii', '3,3%'],
          ['8', 'Depressioni chiuse', '3,1%']
        ]);
        initChart(canvasId, 'bar',
          ['Pianure', 'Versanti', 'Creste', 'Valli', 'Depressioni'],
          [0.2, 60.1, 33.3, 3.3, 3.1],
          ['#4fc3f7', '#7986cb', '#ce93d8', '#80cbc4', '#ffb74d']
        );
      }
    },

    stability: {
      icon: '⚠️',
      title: 'Stabilità versanti',
      layer: null,
      hasLayer: false,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Scala 1–5 (stabile→instabile). Più della metà del territorio è in classe 1 (aree pianeggianti). ' +
          'Ma quasi il <strong>31% ricade in classi 3–4–5</strong>: dato da considerare nella pianificazione.'
        );
        appendSectionTitle(el, 'Classi di stabilità');
        var canvasId = 'rp-c-stab';
        appendChart(el, canvasId);
        appendTable(el, ['Classe', 'Significato', '%'], [
          ['1', 'Molto stabile', '52,6%'],
          ['2', 'Stabile', '16,3%'],
          ['3', 'Mod. instabile', '12,1%'],
          ['4', 'Instabile', '12,4%'],
          ['5', 'Molto instabile', '6,3%']
        ]);
        initChart(canvasId, 'doughnut',
          ['Molto stabile', 'Stabile', 'Mod. instabile', 'Instabile', 'Molto instabile'],
          [52.6, 16.3, 12.1, 12.4, 6.3],
          ['#2e7d32', '#66bb6a', '#ffee58', '#ffa726', '#ef5350']
        );
      }
    },

    build: {
      icon: '🏗️',
      title: 'Costruibilità',
      layer: null,
      hasLayer: false,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Indice morfologico puro — non include vincoli legali. Quasi la <strong>metà del territorio</strong> ' +
          'ha caratteristiche favorevoli. Il <strong>28,7% ricade in classi 4–5</strong>: ' +
          'edificazione fisicamente problematica.'
        );
        appendSectionTitle(el, 'Classi di costruibilità');
        var canvasId = 'rp-c-build';
        appendChart(el, canvasId);
        appendTable(el, ['Classe', 'Significato', '%'], [
          ['1', 'Ottima — pianeggiante e stabile', '47,3%'],
          ['2', 'Buona', '14,1%'],
          ['3', 'Moderata — alcune limitazioni', '9,9%'],
          ['4', 'Difficile', '16,4%'],
          ['5', 'Non idonea', '12,3%']
        ]);
        initChart(canvasId, 'doughnut',
          ['Ottima', 'Buona', 'Moderata', 'Difficile', 'Non idonea'],
          [47.3, 14.1, 9.9, 16.4, 12.3],
          ['#1565c0', '#42a5f5', '#ffcc02', '#ff7043', '#b71c1c']
        );
      }
    },

    solar: {
      icon: '☀️',
      title: 'Radiazione solare',
      layer: null,
      hasLayer: false,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Indice di Radiazione Solare (SRI) normalizzato 0–1. Valore medio per Palermo: ' +
          '<strong>0,59</strong> — coerente con la latitudine e il clima mediterraneo. ' +
          'Rilevante per potenziale fotovoltaico e agricoltura eliofile.'
        );
        appendSectionTitle(el, 'Riepilogo SRI');
        var tbl = document.createElement('table');
        tbl.className = 'rp-table';
        var tb = document.createElement('tbody');
        [
          ['SRI medio', '0,59 / 1,00'],
          ['SRI minimo', '~0,00 (versanti nord in ombra)'],
          ['SRI massimo', '~1,00 (versanti meridionali)'],
          ['Versanti più esposti', 'Sud, Sud-Ovest'],
          ['Versanti meno esposti', 'Nord, Nord-Est (ma più estesi)']
        ].forEach(function (r) {
          var tr = document.createElement('tr');
          var td1 = document.createElement('td'); td1.textContent = r[0]; tr.appendChild(td1);
          var td2 = document.createElement('td'); td2.textContent = r[1]; tr.appendChild(td2);
          tb.appendChild(tr);
        });
        tbl.appendChild(tb);
        el.appendChild(tbl);
        appendText(el,
          'I versanti nord e nord-est, pur essendo i più estesi, ricevono meno luce rispetto ' +
          'ai versanti meridionali. Questo dato è rilevante per studi energetici e pianificazione ' +
          'del verde urbano.'
        );
      }
    },

    rugosity: {
      icon: '📏',
      title: 'Rugosità (TRI)',
      layer: null,
      hasLayer: false,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Il <strong>TRI (Terrain Ruggedness Index)</strong> misura la variazione media di quota ' +
          'rispetto alle celle vicine. Media <strong>3,05</strong>, punte fino a <strong>369</strong> ' +
          'nelle creste più frastagliate.'
        );
        appendSectionTitle(el, 'Indicatori di rugosità');
        var tbl = document.createElement('table');
        tbl.className = 'rp-table';
        var tb = document.createElement('tbody');
        [
          ['TRI medio', '3,05'],
          ['TRI massimo', '369 (creste rocciose)'],
          ['Roughness media', '3,04'],
          ['Roughness massima', '280 (pareti verticali)'],
          ['Aree più rugose', 'Monti di Palermo, Parco Favorita'],
          ['Aree più lisce', 'Conca d\'Oro, zona costiera']
        ].forEach(function (r) {
          var tr = document.createElement('tr');
          var td1 = document.createElement('td'); td1.textContent = r[0]; tr.appendChild(td1);
          var td2 = document.createElement('td'); td2.textContent = r[1]; tr.appendChild(td2);
          tb.appendChild(tr);
        });
        tbl.appendChild(tb);
        el.appendChild(tbl);
        appendText(el,
          'La rugosità assoluta conferma la forte variabilità del paesaggio: ambienti lisci ' +
          'lungo la fascia costiera e la pianura, con picchi estremi sulle pareti rocciose dei rilievi nord.'
        );
      }
    }
  };

  // ── Helpers DOM ──────────────────────────────────────────────────────────

  // Parsa solo <strong>...</strong> senza innerHTML
  function parseStrongText(parent, text) {
    var parts = text.split(/(<strong>|<\/strong>)/);
    var inStrong = false;
    parts.forEach(function (part) {
      if (part === '<strong>') { inStrong = true; return; }
      if (part === '</strong>') { inStrong = false; return; }
      if (!part) return;
      if (inStrong) {
        var s = document.createElement('strong');
        s.textContent = part;
        parent.appendChild(s);
      } else {
        parent.appendChild(document.createTextNode(part));
      }
    });
  }

  function appendIntro(parent, text) {
    var div = document.createElement('div');
    div.className = 'rp-intro';
    parseStrongText(div, text);
    parent.appendChild(div);
  }

  function appendSectionTitle(parent, text) {
    var div = document.createElement('div');
    div.className = 'rp-section-title';
    div.textContent = text;
    parent.appendChild(div);
  }

  function appendText(parent, text) {
    var div = document.createElement('div');
    div.className = 'rp-text';
    div.textContent = text;
    parent.appendChild(div);
  }

  function appendChart(parent, canvasId) {
    var wrap = document.createElement('div');
    wrap.className = 'rp-chart-wrap';
    var canvas = document.createElement('canvas');
    canvas.id = canvasId;
    wrap.appendChild(canvas);
    parent.appendChild(wrap);
  }

  function appendTable(parent, headers, rows) {
    var tbl = document.createElement('table');
    tbl.className = 'rp-table';
    var thead = document.createElement('thead');
    var trh = document.createElement('tr');
    headers.forEach(function (h) {
      var th = document.createElement('th');
      th.textContent = h;
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    tbl.appendChild(thead);
    var tbody = document.createElement('tbody');
    // rows: [label, value] or [label, value, 'hl'|'hl-warn'] — 3rd element is class for last td
    rows.forEach(function (row) {
      var tr = document.createElement('tr');
      var hasClass = row.length === 3 && (row[2] === 'hl' || row[2] === 'hl-warn');
      var cols = hasClass ? 2 : row.length;
      for (var i = 0; i < cols; i++) {
        var td = document.createElement('td');
        td.textContent = row[i];
        if (i === cols - 1 && hasClass) { td.className = row[2]; }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);
    parent.appendChild(tbl);
  }

  // ── Chart.js helpers ────────────────────────────────────────────────────
  var chartInstances = {};

  function initChart(canvasId, type, labels, data, colors) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Se esiste già un'istanza per questo canvasId, la distruggiamo per poterla ricreare
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
      delete chartInstances[canvasId];
    }

    var defaultColors = [
      '#2458c8', '#e07800', '#1a7a40', '#b84010', '#7986cb',
      '#66bb6a', '#ffb74d', '#4fc3f7'
    ];
    var bgColors = colors || defaultColors.slice(0, data.length);

    var opts;
    if (type === 'bar') {
      opts = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return ' ' + c.raw + '%'; } } }
        },
        scales: {
          x: { ticks: { color: '#6070a0', font: { size: 9, family: "'Titillium Web', sans-serif" } }, grid: { color: 'rgba(30,60,160,0.06)' } },
          y: { ticks: { color: '#6070a0', font: { size: 9, family: "'Titillium Web', sans-serif" }, callback: function (v) { return v + '%'; } }, grid: { color: 'rgba(30,60,160,0.08)' } }
        }
      };
      chartInstances[canvasId] = new Chart(canvas, {
        type: 'bar',
        data: { labels: labels, datasets: [{ data: data, backgroundColor: bgColors, borderRadius: 4, borderWidth: 0 }] },
        options: opts
      });

    } else if (type === 'doughnut') {
      opts = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '55%',
        plugins: {
          legend: { display: true, position: 'bottom', labels: { color: '#3a4e78', font: { size: 9, family: "'Titillium Web', sans-serif" }, boxWidth: 10, padding: 5 } },
          tooltip: { callbacks: { label: function (c) { return ' ' + c.raw + '%'; } } }
        }
      };
      chartInstances[canvasId] = new Chart(canvas, {
        type: 'doughnut',
        data: { labels: labels, datasets: [{ data: data, backgroundColor: bgColors, borderWidth: 0 }] },
        options: opts
      });

    } else if (type === 'ring') {
      opts = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return ' ' + c.raw + '%'; } } }
        }
      };
      chartInstances[canvasId] = new Chart(canvas, {
        type: 'doughnut',
        data: { labels: labels, datasets: [{ data: data, backgroundColor: bgColors, borderWidth: 0 }] },
        options: opts
      });

    } else if (type === 'radar') {
      opts = {
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
            ticks: { color: '#6070a0', font: { size: 8 }, backdropColor: 'transparent', maxTicksLimit: 4 },
            pointLabels: { color: '#2a3a68', font: { size: 10, family: "'Titillium Web', sans-serif" } }
          }
        }
      };
      chartInstances[canvasId] = new Chart(canvas, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: '% versanti',
            data: data,
            backgroundColor: 'rgba(36,88,200,0.12)',
            borderColor: '#2458c8',
            borderWidth: 2,
            pointBackgroundColor: '#2458c8',
            pointRadius: 3
          }]
        },
        options: opts
      });
    }
  }

  // ── Stato pannello ───────────────────────────────────────────────────────
  var rpWrap    = document.getElementById('rp-wrap');
  var rpToggle  = document.getElementById('rp-toggle');
  var rpGallery = document.getElementById('rp-gallery');
  var rpDetail  = document.getElementById('rp-detail');
  var rpBack    = document.getElementById('rp-back');
  var rpOpacity = document.getElementById('rp-opacity');
  var rpOpacityVal = document.getElementById('rp-opacity-val');
  var rpOpacityBar = document.getElementById('rp-opacity-bar');
  var rpDetailBody = document.getElementById('rp-detail-body');
  var rpDetailIcon = document.getElementById('rp-detail-icon');
  var rpDetailName = document.getElementById('rp-detail-name');

  var panelOpen = false;
  var currentAnalysis = null;

  // Apri/chiudi pannello
  rpToggle.addEventListener('click', function () {
    panelOpen = !panelOpen;
    rpWrap.classList.toggle('open', panelOpen);
  });

  // Click su card analisi
  document.querySelectorAll('.rp-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var id = card.dataset.analysis;
      openDetail(id);
    });
  });

  function openDetail(id) {
    var analysis = ANALYSES[id];
    if (!analysis) return;
    currentAnalysis = id;

    // Evidenzia card attiva
    document.querySelectorAll('.rp-card').forEach(function (c) { c.classList.remove('active'); });
    var activeCard = document.querySelector('.rp-card[data-analysis="' + id + '"]');
    if (activeCard) activeCard.classList.add('active');

    // Aggiorna header
    rpDetailIcon.textContent = analysis.icon;
    rpDetailName.textContent = analysis.title;

    // Opacità slider
    if (analysis.hasLayer) {
      rpOpacityBar.classList.remove('hidden');
      var currentOpacity = 0.70;
      try { currentOpacity = map.getPaintProperty(analysis.layer, 'raster-opacity') || 0.70; } catch(e) {}
      rpOpacity.value = currentOpacity;
      rpOpacityVal.textContent = currentOpacity.toFixed(2);
    } else {
      rpOpacityBar.classList.add('hidden');
    }

    // Render contenuto
    analysis.render(rpDetailBody);

    // Attiva layer se disponibile
    if (analysis.hasLayer) {
      try {
        map.setLayoutProperty(analysis.layer, 'visibility', 'visible');
        // Sync toggle in controls panel se esiste
        var toggleEl = document.getElementById('toggle-' + id);
        if (toggleEl) { toggleEl.checked = true; }
        var opacityRow = document.getElementById(id + '-opacity-row');
        if (opacityRow) { opacityRow.style.display = 'block'; }
        var legend = document.getElementById('legend-' + id);
        if (legend) { legend.classList.add('visible'); }
      } catch(e) {}
    }

    // Mostra detail, nascondi gallery
    rpGallery.style.display = 'none';
    rpDetail.style.display = 'flex';

    // Apri pannello se chiuso
    if (!panelOpen) {
      panelOpen = true;
      rpWrap.classList.add('open');
    }
  }

  // Torna alla galleria
  rpBack.addEventListener('click', function () {
    rpDetail.style.display = 'none';
    rpGallery.style.display = '';
    currentAnalysis = null;
  });

  // Slider opacità → layer mappa
  rpOpacity.addEventListener('input', function () {
    var val = parseFloat(this.value);
    rpOpacityVal.textContent = val.toFixed(2);
    if (!currentAnalysis) return;
    var analysis = ANALYSES[currentAnalysis];
    if (!analysis || !analysis.hasLayer) return;
    try {
      map.setPaintProperty(analysis.layer, 'raster-opacity', val);
      // Sync slider nel pannello controlli
      var syncSlider = document.getElementById(currentAnalysis + '-opacity-slider');
      if (syncSlider) {
        syncSlider.value = val;
        var syncVal = document.getElementById(currentAnalysis + '-opacity-val');
        if (syncVal) syncVal.textContent = val.toFixed(2);
      }
    } catch(e) {}
  });

})();
