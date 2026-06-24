(function () {
  'use strict';

  // ── Dati per ogni analisi ────────────────────────────────────────────────
  var SVG_ICONS = {
    elevation: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 20 9 4 15 14 18 10 21 20"/></svg>',
    slope:     '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 20 21 4"/><line x1="3" y1="20" x2="21" y2="20"/><line x1="21" y1="4" x2="21" y2="20"/></svg>',
    aspect:    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    geomorph:  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20 L7 10 L11 15 L15 8 L22 20Z"/></svg>',
    stability: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    build:     '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="12"/><polyline points="3 9 12 3 21 9"/><line x1="9" y1="21" x2="9" y2="15"/><line x1="15" y1="21" x2="15" y2="15"/><line x1="9" y1="15" x2="15" y2="15"/></svg>',
    solar:     '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    rugosity:  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 Q5 8 7 12 Q9 16 11 12 Q13 8 15 12 Q17 16 19 12 Q21 8 23 12"/><line x1="3" y1="19" x2="21" y2="19"/></svg>'
  };

  const ANALYSES = {
    elevation: {
      icon: SVG_ICONS.elevation,
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

        appendRingCard(el, {
          canvasId: 'rp-c-elev',
          title: 'Distribuzione classi',
          centerVal: '158.9',
          centerLabel: 'km²',
          legendData: [
            { chartLabel: '0–50m', label: '0–50 m  costiera e pianura', val: '56.6', pct: 35.6, color: '#00cb9b' },
            { chartLabel: '50–200m', label: '50–200 m  bassa collina', val: '53.9', pct: 33.9, color: '#00ef2f' },
            { chartLabel: '200–500m', label: '200–500 m  media collina', val: '30.5', pct: 19.2, color: '#e2ff00' },
            { chartLabel: '500–800m', label: '500–800 m  alta collina', val: '14.9', pct: 9.4, color: '#fe7f01' },
            { chartLabel: '800–1051m', label: '800–1051 m  montagna', val: '2.9', pct: 1.8, color: '#505050' }
          ],
          summaries: [
            { val: '158.9', label: 'km² area' },
            { val: '183', label: 'm media' },
            { val: '1.050', label: 'm max' }
          ]
        });

        var ELEV_CLASSES = [
          { key: 'c0_50',    label: '0–50 m',    color: '#00cb9b' },
          { key: 'c50_200',  label: '50–200 m',  color: '#00ef2f' },
          { key: 'c200_500', label: '200–500 m', color: '#e2ff00' },
          { key: 'c500_800', label: '500–800 m', color: '#fe7f01' },
          { key: 'c800',     label: '800+ m',    color: '#505050' }
        ];

        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'quota media',
          unit: ' m',
          maxVal: 271.0,
          classes: ELEV_CLASSES,
          items: [
            { rank:1, label:'VI · Nord-Ovest',    val:271.0, classi:{c0_50:19.0, c50_200:35.4, c200_500:21.4, c500_800:22.8, c800:1.4} },
            { rank:2, label:'V · Noce',            val:258.3, classi:{c0_50:14.7, c50_200:43.2, c200_500:19.6, c500_800:20.7, c800:1.8} },
            { rank:3, label:'IV · Mezzomonreale',  val:241.7, classi:{c0_50:8.6,  c50_200:59.8, c200_500:14.5, c500_800:8.6,  c800:8.5} },
            { rank:4, label:'III · Oreto',         val:197.9, classi:{c0_50:17.4, c50_200:47.0, c200_500:26.2, c500_800:9.3,  c800:0.0} },
            { rank:5, label:'VIII · Libertà',      val:156.0, classi:{c0_50:59.9, c50_200:3.3,  c200_500:34.6, c500_800:2.2,  c800:0.0} },
            { rank:6, label:'VII · Mondello',      val:109.3, classi:{c0_50:55.7, c50_200:24.3, c200_500:18.5, c500_800:1.5,  c800:0.0} },
            { rank:7, label:'II · Resuttana',      val:82.2,  classi:{c0_50:66.8, c50_200:21.5, c200_500:8.3,  c500_800:3.3,  c800:0.0} },
            { rank:8, label:'I · Centro Storico',  val:14.5,  classi:{c0_50:100,  c50_200:0.0,  c200_500:0.0,  c500_800:0.0,  c800:0.0} }
          ]
        });

        appendRankingCard(el, {
          title: 'Top Quartieri',
          subtitle: 'quota media',
          unit: ' m',
          maxVal: 437.9,
          classes: ELEV_CLASSES,
          items: [
            { rank:1, label:'Boccadifalco · Baida',      val:437.9, classi:{c0_50:0.0,  c50_200:29.0, c200_500:32.6, c500_800:19.3, c800:19.1} },
            { rank:2, label:'Borgo Nuovo',               val:384.3, classi:{c0_50:0.0,  c50_200:31.8, c200_500:31.7, c500_800:33.5, c800:2.9} },
            { rank:3, label:'San Lorenzo',               val:359.8, classi:{c0_50:4.9,  c50_200:35.6, c200_500:24.2, c500_800:32.2, c800:3.1} },
            { rank:4, label:'San Giovanni Apostolo',     val:310.8, classi:{c0_50:0.0,  c50_200:37.8, c200_500:40.3, c500_800:21.9, c800:0.0} },
            { rank:5, label:'Montepellegrino',           val:290.0, classi:{c0_50:20.6, c50_200:6.1,  c200_500:68.9, c500_800:4.4,  c800:0.0} },
            { rank:6, label:'Villagrazia',               val:279.1, classi:{c0_50:0.0,  c50_200:45.9, c200_500:39.9, c500_800:14.2, c800:0.0} },
            { rank:7, label:'Cruillas',                  val:236.7, classi:{c0_50:20.2, c50_200:43.3, c200_500:11.1, c500_800:24.3, c800:1.1} },
            { rank:8, label:'Chiavelli · S.M. di Gesù', val:198.7, classi:{c0_50:9.7,  c50_200:54.7, c200_500:26.2, c500_800:9.4,  c800:0.0} }
          ]
        });

        appendRankingCard(el, {
          title: 'Top Quartieri',
          subtitle: 'quota massima',
          unit: ' m',
          maxVal: 1045.0,
          classes: ELEV_CLASSES,
          items: [
            { rank:1, label:'Boccadifalco · Baida',  val:1045.0, classi:{c0_50:0.0,  c50_200:29.0, c200_500:32.6, c500_800:19.3, c800:19.1} },
            { rank:2, label:'Borgo Nuovo',            val:990.7,  classi:{c0_50:0.0,  c50_200:31.8, c200_500:31.7, c500_800:33.5, c800:2.9} },
            { rank:3, label:'Cruillas',               val:879.8,  classi:{c0_50:20.2, c50_200:43.3, c200_500:11.1, c500_800:24.3, c800:1.1} },
            { rank:4, label:'San Lorenzo',            val:869.3,  classi:{c0_50:4.9,  c50_200:35.6, c200_500:24.2, c500_800:32.2, c800:3.1} },
            { rank:5, label:'Ciaculli · Croce Verde', val:819.6,  classi:{c0_50:34.4, c50_200:42.6, c200_500:16.5, c500_800:6.5,  c800:0.1} }
          ]
        });
      }
    },

    slope: {
      icon: SVG_ICONS.slope,
      title: 'Pendenze',
      layer: 'pendenza-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Pendenza media <strong>11,4°</strong> con deviazione standard 13,6°. ' +
          'Oltre la metà del territorio è pianeggiante, ma quasi <strong>un terzo supera i 15°</strong>.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-slope',
          title: 'Classi di pendenza',
          centerVal: '11,4°',
          centerLabel: 'media',
          legendData: [
            { chartLabel: '0–5° pianura', label: '0–5°  pianura', pct: 52.8, color: '#43a047' },
            { chartLabel: '5–15° mod.', label: '5–15°  moderata', pct: 16.4, color: '#8bc34a' },
            { chartLabel: '15–30° acclive', label: '15–30°  acclive', pct: 18.5, color: '#ffeb3b' },
            { chartLabel: '30–45° molto acclive', label: '30–45°  molto acclive', pct: 10.3, color: '#ff9800' },
            { chartLabel: '>45° subvert.', label: '>45°  subverticale', pct: 2.1, color: '#f44336' }
          ],
          summaries: [
            { val: '158.9', label: 'km² area' },
            { val: '11,4°', label: 'pendenza media' },
            { val: '13,6°', label: 'dev. standard' }
          ]
        });
      }
    },

    aspect: {
      icon: SVG_ICONS.aspect,
      title: 'Esposizione',
      layer: 'aspetto-layer',
      hasLayer: true,
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
      icon: SVG_ICONS.geomorph,
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
        appendRingCard(el, {
          canvasId: 'rp-c-geomorph',
          title: 'Unità geomorfologiche',
          centerVal: '158.9',
          centerLabel: 'km²',
          legendData: [
            { chartLabel: 'Pianure', label: '1 - Pianure e fondovalle', pct: 0.2, color: '#4fc3f7' },
            { chartLabel: 'Versanti', label: '3 - Versanti regolari', pct: 60.1, color: '#7986cb' },
            { chartLabel: 'Creste', label: '4 - Creste e dorsali', pct: 33.3, color: '#ce93d8' },
            { chartLabel: 'Valli', label: '7 - Valli e impluvii', pct: 3.3, color: '#80cbc4' },
            { chartLabel: 'Depressioni', label: '8 - Depressioni chiuse', pct: 3.1, color: '#ffb74d' }
          ]
        });
      }
    },

    stability: {
      icon: SVG_ICONS.stability,
      title: 'Stabilità versanti',
      layer: null,
      hasLayer: false,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Scala 1–5 (stabile→instabile). Più della metà del territorio è in classe 1 (aree pianeggianti). ' +
          'Ma quasi il <strong>31% ricade in classi 3–4–5</strong>: dato da considerare nella pianificazione.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-stab',
          title: 'Classi di stabilità',
          centerVal: '30.8',
          centerLabel: '% rischio',
          legendData: [
            { chartLabel: 'Molto stabile', label: '1 - Molto stabile', pct: 52.6, color: '#2e7d32' },
            { chartLabel: 'Stabile', label: '2 - Stabile', pct: 16.3, color: '#66bb6a' },
            { chartLabel: 'Mod. instabile', label: '3 - Mod. instabile', pct: 12.1, color: '#ffee58' },
            { chartLabel: 'Instabile', label: '4 - Instabile', pct: 12.4, color: '#ffa726' },
            { chartLabel: 'Molto instabile', label: '5 - Molto instabile', pct: 6.3, color: '#ef5350' }
          ]
        });
      }
    },

    build: {
      icon: SVG_ICONS.build,
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
        appendRingCard(el, {
          canvasId: 'rp-c-build',
          title: 'Classi di costruibilità',
          centerVal: '47.3',
          centerLabel: '% ottima',
          legendData: [
            { chartLabel: 'Ottima', label: '1 - Ottima (pianura)', pct: 47.3, color: '#1565c0' },
            { chartLabel: 'Buona', label: '2 - Buona', pct: 14.1, color: '#42a5f5' },
            { chartLabel: 'Moderata', label: '3 - Moderata', pct: 9.9, color: '#ffcc02' },
            { chartLabel: 'Difficile', label: '4 - Difficile', pct: 16.4, color: '#ff7043' },
            { chartLabel: 'Non idonea', label: '5 - Non idonea', pct: 12.3, color: '#b71c1c' }
          ]
        });
      }
    },

    solar: {
      icon: SVG_ICONS.solar,
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
      icon: SVG_ICONS.rugosity,
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

  function appendRankingCard(parent, opts) {
    var card = document.createElement('div');
    card.className = 'rank-card';

    var header = document.createElement('div');
    header.className = 'rank-card-header';
    var titleEl = document.createElement('div');
    titleEl.className = 'rank-card-title';
    titleEl.textContent = opts.title;
    header.appendChild(titleEl);
    if (opts.subtitle) {
      var subEl = document.createElement('div');
      subEl.className = 'rank-card-subtitle';
      subEl.textContent = opts.subtitle;
      header.appendChild(subEl);
    }
    card.appendChild(header);

    // legenda classi (una volta sola in cima)
    if (opts.classes) {
      var legend = document.createElement('div');
      legend.className = 'rank-class-legend';
      opts.classes.forEach(function (cls) {
        var item = document.createElement('div');
        item.className = 'rank-class-legend-item';
        var dot = document.createElement('span');
        dot.className = 'rank-class-dot';
        dot.style.backgroundColor = cls.color;
        item.appendChild(dot);
        var lbl = document.createElement('span');
        lbl.textContent = cls.label;
        item.appendChild(lbl);
        legend.appendChild(item);
      });
      card.appendChild(legend);
    }

    var list = document.createElement('div');
    list.className = 'rank-list';

    opts.items.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'rank-row';

      var rankEl = document.createElement('div');
      rankEl.className = 'rank-num';
      rankEl.textContent = item.rank;
      row.appendChild(rankEl);

      var labelEl = document.createElement('div');
      labelEl.className = 'rank-label';
      labelEl.textContent = item.label;
      row.appendChild(labelEl);

      var barWrap = document.createElement('div');
      barWrap.className = 'rank-bar-wrap';

      if (opts.classes && item.classi) {
        // stacked bar per classi elevazione
        opts.classes.forEach(function (cls) {
          var pct = item.classi[cls.key] || 0;
          if (pct <= 0) return;
          var seg = document.createElement('div');
          seg.className = 'rank-bar-seg';
          seg.style.width = pct + '%';
          seg.style.backgroundColor = cls.color;
          seg.title = cls.label + ': ' + pct + '%';
          barWrap.appendChild(seg);
        });
      } else {
        var barFill = document.createElement('div');
        barFill.className = 'rank-bar-fill';
        barFill.style.backgroundColor = opts.color || '#2458c8';
        barFill.style.width = Math.round((item.val / opts.maxVal) * 100) + '%';
        barWrap.appendChild(barFill);
      }
      row.appendChild(barWrap);

      var valEl = document.createElement('div');
      valEl.className = 'rank-val';
      valEl.textContent = item.val.toLocaleString('it-IT') + (opts.unit || '');
      row.appendChild(valEl);

      list.appendChild(row);
    });

    card.appendChild(list);
    parent.appendChild(card);
  }

  function appendRingCard(parent, opts) {
    var card = document.createElement('div');
    card.className = 'ring-card';

    if (opts.title) {
      var cardHeader = document.createElement('div');
      cardHeader.className = 'ring-card-header';
      cardHeader.textContent = opts.title;
      card.appendChild(cardHeader);
    }

    var chartContainer = document.createElement('div');
    chartContainer.className = 'ring-chart-container';

    var canvas = document.createElement('canvas');
    canvas.id = opts.canvasId;
    chartContainer.appendChild(canvas);

    var centerText = document.createElement('div');
    centerText.className = 'ring-chart-center';
    var centerVal = document.createElement('div');
    centerVal.className = 'ring-chart-center-val';
    centerVal.textContent = opts.centerVal;
    var centerLabel = document.createElement('div');
    centerLabel.className = 'ring-chart-center-label';
    centerLabel.textContent = opts.centerLabel;
    centerText.appendChild(centerVal);
    centerText.appendChild(centerLabel);
    chartContainer.appendChild(centerText);

    card.appendChild(chartContainer);

    var legendList = document.createElement('div');
    legendList.className = 'ring-legend-list';

    var chartLabels = [];
    var chartData = [];
    var chartColors = [];

    opts.legendData.forEach(function (item) {
      chartLabels.push(item.chartLabel || item.label);
      chartData.push(item.pct);
      chartColors.push(item.color);

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
      barFill.style.width = item.pct + '%';

      var knob = document.createElement('div');
      knob.className = 'ring-legend-bar-knob';
      knob.style.backgroundColor = item.color;
      barFill.appendChild(knob);

      barWrap.appendChild(barFill);
      itemEl.appendChild(barWrap);

      var val = document.createElement('div');
      val.className = 'ring-legend-val';
      val.textContent = item.val !== undefined ? item.val : (158.9 * item.pct / 100).toFixed(1);
      itemEl.appendChild(val);

      var pct = document.createElement('div');
      pct.className = 'ring-legend-pct';
      pct.textContent = item.pct + '%';
      itemEl.appendChild(pct);

      legendList.appendChild(itemEl);
    });

    card.appendChild(legendList);

    if (opts.summaries && opts.summaries.length > 0) {
      var divider = document.createElement('div');
      divider.className = 'ring-card-divider';
      card.appendChild(divider);

      var summaryRow = document.createElement('div');
      summaryRow.className = 'ring-summary-row';

      opts.summaries.forEach(function (s) {
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
    }

    parent.appendChild(card);

    initChart(opts.canvasId, 'ring', chartLabels, chartData, chartColors);
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

  var isMobile = window.innerWidth < 768;
  var panelOpen = !isMobile;
  var currentAnalysis = null;
  if (panelOpen) rpWrap.classList.add('open');
  updateMapControlsPosition(true);

  // Apri/chiudi pannello
  rpToggle.addEventListener('click', function () {
    panelOpen = !panelOpen;
    rpWrap.classList.toggle('open', panelOpen);
    updateMapControlsPosition();
  });

  function updateMapControlsPosition(instant) {
    var scale  = document.getElementById('map-scale');
    var attrib = document.getElementById('attrib-wrap');
    var odsLogo = document.getElementById('ods-logo');
    [scale, attrib, odsLogo].forEach(function (el) {
      if (!el) return;
      if (instant) el.style.transition = 'none';
      el.classList.toggle('panel-open', panelOpen);
      if (instant) requestAnimationFrame(function () { el.style.transition = ''; });
    });
  }

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
    rpDetailIcon.innerHTML = analysis.icon;
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

    // Attiva layer: nascondi tutti gli altri layer analisi, mostra solo quello selezionato
    document.querySelectorAll('.legend-analysis').forEach(function (el) {
      el.classList.remove('visible');
    });
    if (analysis.hasLayer) {
      try {
        Object.keys(ANALYSES).forEach(function (key) {
          var a = ANALYSES[key];
          if (!a.hasLayer || !a.layer) return;
          map.setLayoutProperty(a.layer, 'visibility', key === id ? 'visible' : 'none');
        });
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
      updateMapControlsPosition();
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

  // ── INIT ────────────────────────────────────────────────────────────────
  // Mostra sempre la gallery all'avvio
  rpGallery.style.display = 'flex';
  rpDetail.style.display = 'none';
  // Imposta opacità iniziale (slider = 0.70)
  rpOpacity.value = 0.70;
  rpOpacityVal.textContent = '0.70';
  map.on('load', function() {
    map.setPaintProperty('elevation-layer', 'raster-opacity', 0.70);
    updateMapControlsPosition();
  });
})();
