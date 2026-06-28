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
    rugosity:  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 Q5 8 7 12 Q9 16 11 12 Q13 8 15 12 Q17 16 19 12 Q21 8 23 12"/><line x1="3" y1="19" x2="21" y2="19"/></svg>',
    tpi:       '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20 L6 8 L10 14 L14 6 L18 11 L22 20Z"/><line x1="2" y1="20" x2="22" y2="20"/></svg>',
    curvature: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20 Q8 4 12 12 Q16 20 20 4"/></svg>'
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
          'Quota massima <strong>1.050 m</strong> (Monte Cuccio / Pizzuta, quartiere Boccadifalco·Baida). ' +
          'Quota media comunale <strong>183 m</strong> s.l.m. su un\'area di 159,5 km². ' +
          'Quasi il <strong>70% della superficie</strong> ricade sotto i 200 m: la Conca d\'Oro e le zone ' +
          'costiere dominano il profilo basso. Il territorio si estende però verticalmente per oltre un chilometro — ' +
          'dalla riva del mare fino ai rilievi dei Monti di Palermo. ' +
          'Il Centro Storico è interamente sotto i 50 m (quota media 14,5 m); ' +
          'la Circoscrizione VI Nord-Ovest è la più elevata in media (<strong>271 m</strong>).'
        );

        appendRingCard(el, {
          canvasId: 'rp-c-elev',
          title: 'Distribuzione classi',
          centerVal: '159.5',
          centerLabel: 'km²',
          legendData: [
            { chartLabel: '0–50m', label: '0–50 m  costiera e pianura', val: '56.8', pct: 35.6, color: '#00cb9b' },
            { chartLabel: '50–200m', label: '50–200 m  bassa collina', val: '54.1', pct: 33.9, color: '#00ef2f' },
            { chartLabel: '200–500m', label: '200–500 m  media collina', val: '30.6', pct: 19.2, color: '#e2ff00' },
            { chartLabel: '500–800m', label: '500–800 m  alta collina', val: '15.0', pct: 9.4, color: '#fe7f01' },
            { chartLabel: '800–1051m', label: '800–1051 m  montagna', val: '2.9', pct: 1.8, color: '#505050' }
          ],
          summaries: [
            { val: '159.5', label: 'km² area' },
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
            { rank:2, label:'V · Noce',            val:259.1, classi:{c0_50:14.7, c50_200:43.2, c200_500:19.6, c500_800:20.7, c800:1.8} },
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
          'Pendenza media <strong>11,4°</strong>, deviazione standard 13,6° — segno di un paesaggio ' +
          'molto eterogeneo. Il 52,8% del territorio è pianeggiante (0–5°), concentrato nella Conca d\'Oro ' +
          'e nelle aree costiere. Quasi <strong>un terzo supera i 15°</strong>, con il 12,4% in classi ' +
          'fortemente acclivi (oltre 30°). ' +
          'La Circoscrizione III Oreto è la più acclive (media 14,5°), il Centro Storico la più piatta (2,7°). ' +
          'Tra i quartieri, Boccadifalco registra la pendenza media più alta: <strong>20,5°</strong>.'
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
            { val: '159.5', label: 'km² area' },
            { val: '11,4°', label: 'pendenza media' },
            { val: '13,6°', label: 'dev. standard' }
          ]
        });

        var SLOPE_CLASSES = [
          { key: 'c0_5',   label: '0–5°',   color: '#43a047' },
          { key: 'c5_15',  label: '5–15°',  color: '#8bc34a' },
          { key: 'c15_30', label: '15–30°', color: '#ffeb3b' },
          { key: 'c30_45', label: '30–45°', color: '#ff9800' },
          { key: 'c45',    label: '>45°',   color: '#f44336' }
        ];

        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'pendenza media',
          unit: '°',
          maxVal: 14.5,
          classes: SLOPE_CLASSES,
          items: [
            { rank:1, label:'III · Oreto',         val:14.5, classi:{c0_5:44.4, c5_15:15.5, c15_30:19.3, c30_45:18.7, c45:2.1} },
            { rank:2, label:'VII · Mondello',       val:14.0, classi:{c0_5:48.0, c5_15:14.8, c15_30:19.9, c30_45:13.2, c45:4.2} },
            { rank:3, label:'V · Noce',             val:11.3, classi:{c0_5:48.7, c5_15:18.1, c15_30:23.6, c30_45:8.9,  c45:0.7} },
            { rank:4, label:'IV · Mezzomonreale',   val:11.0, classi:{c0_5:55.7, c5_15:13.1, c15_30:19.2, c30_45:11.1, c45:0.8} },
            { rank:5, label:'VI · Nord-Ovest',      val:10.8, classi:{c0_5:44.5, c5_15:24.8, c15_30:25.4, c30_45:4.1,  c45:1.2} },
            { rank:6, label:'VIII · Libertà',       val:9.0,  classi:{c0_5:59.8, c5_15:17.8, c15_30:14.3, c30_45:6.0,  c45:2.0} },
            { rank:7, label:'II · Resuttana',       val:8.3,  classi:{c0_5:70.0, c5_15:11.9, c15_30:6.8,  c30_45:8.6,  c45:2.6} },
            { rank:8, label:'I · Centro Storico',   val:2.7,  classi:{c0_5:89.5, c5_15:8.9,  c15_30:1.5,  c30_45:0.0,  c45:0.0} }
          ]
        });

        appendRankingCard(el, {
          title: 'Top Quartieri · pendenza media',
          subtitle: 'pendenza media',
          unit: '°',
          maxVal: 20.5,
          classes: SLOPE_CLASSES,
          items: [
            { rank:1, label:'Boccadifalco',                 val:20.5, classi:{c0_5:20.8, c5_15:13.9, c15_30:39.1, c30_45:24.3, c45:1.9} },
            { rank:2, label:'Arenella - Vergine Maria',     val:18.7, classi:{c0_5:34.1, c5_15:20.2, c15_30:19.7, c30_45:18.3, c45:7.7} },
            { rank:3, label:'Partanna Mondello',            val:17.5, classi:{c0_5:40.5, c5_15:11.4, c15_30:24.6, c30_45:16.9, c45:6.6} },
            { rank:4, label:'Borgo Nuovo',                  val:17.0, classi:{c0_5:20.8, c5_15:25.8, c15_30:37.7, c30_45:14.4, c45:1.2} },
            { rank:5, label:'Villagrazia - Falsomiele',     val:15.8, classi:{c0_5:39.6, c5_15:16.2, c15_30:21.0, c30_45:20.8, c45:2.3} },
            { rank:6, label:'Montepellegrino',              val:14.2, classi:{c0_5:34.0, c5_15:28.3, c15_30:24.2, c30_45:10.0, c45:3.4} },
            { rank:7, label:'Brancaccio - Ciaculli',        val:12.6, classi:{c0_5:55.2, c5_15:14.4, c15_30:11.3, c30_45:14.7, c45:4.5} },
            { rank:8, label:'Tommaso Natale - Sferracavallo', val:12.2, classi:{c0_5:44.8, c5_15:21.4, c15_30:20.9, c30_45:12.0, c45:0.9} }
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
          'L\'esposizione prevalente è <strong>Nord-Est (18,9%)</strong>: i rilievi scendono verso il ' +
          'Mar Tirreno orientando gran parte dei versanti a nord e nord-est. ' +
          'I versanti esposti a Sud-Ovest sono i meno diffusi (4,7%) — i pendii più soleggiati, ' +
          'tipicamente più caldi e aridi. Il 15,9% del territorio è pianura senza esposizione netta. ' +
          'La Circoscrizione III Oreto è la più ombreggiata (<strong>68,7%</strong> di versanti N+NE+NO); ' +
          'Montepellegrino è il quartiere con la maggiore esposizione a sud (<strong>44,5%</strong> di versanti S+SE+SO).'
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

        var ASP_CLASSES = [
          { key: 'Piano', label: 'Pianura',   color: '#aaaaaa' },
          { key: 'N',     label: 'Nord',      color: '#4575b4' },
          { key: 'NE',    label: 'Nord-Est',  color: '#313695' },
          { key: 'E',     label: 'Est',       color: '#74add1' },
          { key: 'SE',    label: 'Sud-Est',   color: '#abd9e9' },
          { key: 'S',     label: 'Sud',       color: '#d73027' },
          { key: 'SO',    label: 'Sud-Ovest', color: '#f46d43' },
          { key: 'O',     label: 'Ovest',     color: '#fdae61' },
          { key: 'NO',    label: 'Nord-Ovest',color: '#fee090' }
        ];

        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni · versanti nord',
          subtitle: '% versanti N+NE+NO (più ombreggiati)',
          unit: '%',
          maxVal: 68.7,
          classes: ASP_CLASSES,
          items: [
            { rank:1, label:'III · Oreto',        val:68.7, classi:{Piano:11.0, N:27.1, NE:18.8, E:5.6,  SE:2.0,  S:1.0, SO:2.8, O:8.8,  NO:22.8} },
            { rank:2, label:'II · Resuttana',     val:56.9, classi:{Piano:25.3, N:25.0, NE:20.9, E:7.5,  SE:2.7,  S:1.8, SO:1.8, O:3.8,  NO:11.0} },
            { rank:3, label:'VII · Mondello',     val:39.9, classi:{Piano:15.2, N:11.6, NE:18.1, E:16.4, SE:9.0,  S:6.2, SO:5.3, O:8.1,  NO:10.2} },
            { rank:4, label:'IV · Mezzomonreale', val:39.5, classi:{Piano:12.2, N:11.7, NE:23.3, E:19.4, SE:15.0, S:9.3, SO:2.4, O:2.1,  NO:4.5}  },
            { rank:5, label:'V · Noce',           val:37.8, classi:{Piano:14.0, N:13.5, NE:21.7, E:17.6, SE:16.8, S:8.9, SO:3.0, O:2.0,  NO:2.6}  },
            { rank:6, label:'I · Centro Storico', val:34.6, classi:{Piano:23.4, N:12.4, NE:14.9, E:13.5, SE:13.2, S:5.5, SO:4.8, O:4.8,  NO:7.3}  },
            { rank:7, label:'VI · Nord-Ovest',    val:27.8, classi:{Piano:13.9, N:7.7,  NE:16.1, E:21.6, SE:16.6, S:10.0,SO:6.7, O:3.4,  NO:4.0}  },
            { rank:8, label:'VIII · Libertà',     val:25.2, classi:{Piano:21.1, N:6.4,  NE:13.8, E:13.2, SE:10.8, S:9.7, SO:12.4,O:7.5,  NO:5.0}  }
          ]
        });

        appendRankingCard(el, {
          title: 'Top Quartieri · versanti sud',
          subtitle: '% versanti S+SE+SO (più soleggiati)',
          unit: '%',
          maxVal: 44.5,
          classes: ASP_CLASSES,
          items: [
            { rank:1, label:'Montepellegrino',              val:44.5, classi:{Piano:10.1, N:9.6,  NE:13.6, E:14.4, SE:12.6, S:13.6, SO:18.3, O:3.4, NO:4.4} },
            { rank:2, label:'Cruillas - S.Giov. Apostolo',  val:42.8, classi:{Piano:7.3,  N:7.8,  NE:10.7, E:21.9, SE:25.1, S:13.5, SO:4.2,  O:4.5, NO:5.0} },
            { rank:3, label:'Borgo Nuovo',                  val:39.1, classi:{Piano:7.8,  N:15.4, NE:23.2, E:10.5, SE:22.7, S:12.5, SO:3.9,  O:2.2, NO:2.0} },
            { rank:4, label:'Boccadifalco',                 val:37.5, classi:{Piano:7.4,  N:17.6, NE:15.8, E:15.9, SE:18.5, S:15.9, SO:3.1,  O:3.9, NO:1.5} },
            { rank:5, label:'Partanna Mondello',            val:28.3, classi:{Piano:15.1, N:11.4, NE:18.6, E:16.9, SE:12.5, S:9.4,  SO:6.4,  O:6.4, NO:3.4} },
            { rank:6, label:'Palazzo Reale - Monte di Pietà',val:26.6,classi:{Piano:27.5, N:16.5, NE:22.5, E:3.3,  SE:15.7, S:6.5,  SO:4.4,  O:2.8, NO:0.8} },
            { rank:7, label:'Resuttana - San Lorenzo',      val:25.9, classi:{Piano:14.3, N:22.1, NE:20.7, E:11.3, SE:10.0, S:7.2,  SO:8.7,  O:4.6, NO:1.1} },
            { rank:8, label:'Libertà',                      val:25.5, classi:{Piano:19.8, N:6.0,  NE:13.0, E:13.6, SE:11.9, S:6.9,  SO:6.7,  O:8.7, NO:13.4} }
          ]
        });
      }
    },

    geomorph: {
      icon: SVG_ICONS.geomorph,
      title: 'Geomorfologia',
      layer: 'geomorfologia-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Il territorio di Palermo è classificato in cinque unità geomorfologiche derivate da ' +
          'curvatura, rugosità e indice di posizione topografica (TPI). ' +
          'Dominano i <strong>versanti regolari (60,1%)</strong> e le <strong>creste e dorsali (33,3%)</strong> — ' +
          'morfologia tipicamente collinare e montana. Le pianure e fondovalle coprono appena lo <strong>0,2%</strong>: ' +
          'la Conca d\'Oro è morfologicamente piatta ma è classificata come versante di raccordo. ' +
          'Valli e depressioni chiuse (<strong>6,4% complessivo</strong>) sono cruciali per il deflusso ' +
          'idrico superficiale. Tra i quartieri, Malaspina-Palagonia ha la percentuale più alta di creste: <strong>80,7%</strong>.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-geomorph',
          title: 'Unità geomorfologiche',
          centerVal: '159.5',
          centerLabel: 'km²',
          legendData: [
            { chartLabel: 'Pianure', label: '1 - Pianure e fondovalle', pct: 0.2, color: '#4fc3f7' },
            { chartLabel: 'Versanti', label: '3 - Versanti regolari', pct: 60.1, color: '#7986cb' },
            { chartLabel: 'Creste', label: '4 - Creste e dorsali', pct: 33.3, color: '#ce93d8' },
            { chartLabel: 'Valli', label: '7 - Valli e impluvii', pct: 3.3, color: '#80cbc4' },
            { chartLabel: 'Depressioni', label: '8 - Depressioni chiuse', pct: 3.1, color: '#ffb74d' }
          ]
        });

        var GEOMORPH_CLASSES = [
          { key: 'c1', label: 'Pianure',    color: '#4fc3f7' },
          { key: 'c3', label: 'Versanti',   color: '#7986cb' },
          { key: 'c4', label: 'Creste',     color: '#ce93d8' },
          { key: 'c7', label: 'Valli',      color: '#80cbc4' },
          { key: 'c8', label: 'Depressioni',color: '#ffb74d' }
        ];

        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: '% creste e dorsali',
          unit: '%',
          maxVal: 52.8,
          classes: GEOMORPH_CLASSES,
          items: [
            { rank:1, label:'I · Centro Storico',  val:52.8, classi:{c1:1.3,  c3:45.9, c4:52.8, c7:0.0, c8:0.0} },
            { rank:2, label:'II · Resuttana',      val:47.4, classi:{c1:0.5,  c3:47.0, c4:47.4, c7:2.5, c8:2.7} },
            { rank:3, label:'VIII · Libertà',      val:43.3, classi:{c1:0.5,  c3:49.8, c4:43.3, c7:5.1, c8:1.3} },
            { rank:4, label:'IV · Mezzomonreale',  val:31.3, classi:{c1:0.0,  c3:60.2, c4:31.3, c7:4.2, c8:4.3} },
            { rank:5, label:'V · Noce',            val:30.7, classi:{c1:0.0,  c3:65.7, c4:30.7, c7:2.2, c8:1.5} },
            { rank:6, label:'VII · Mondello',      val:29.8, classi:{c1:0.5,  c3:64.4, c4:29.8, c7:3.2, c8:2.0} },
            { rank:7, label:'VI · Nord-Ovest',     val:28.2, classi:{c1:0.0,  c3:67.5, c4:28.2, c7:1.8, c8:2.4} },
            { rank:8, label:'III · Oreto',         val:26.1, classi:{c1:0.0,  c3:63.7, c4:26.1, c7:4.9, c8:5.2} }
          ]
        });

        appendRankingCard(el, {
          title: 'Top Quartieri · creste e dorsali',
          subtitle: '% creste e dorsali',
          unit: '%',
          maxVal: 80.7,
          classes: GEOMORPH_CLASSES,
          items: [
            { rank:1, label:'Malaspina - Palagonia',   val:80.7, classi:{c1:0.0, c3:19.3, c4:80.7, c7:0.0, c8:0.0} },
            { rank:2, label:'Politeama',               val:76.8, classi:{c1:1.3, c3:22.0, c4:76.8, c7:0.0, c8:0.0} },
            { rank:3, label:'Noce',                    val:73.9, classi:{c1:0.0, c3:26.1, c4:73.9, c7:0.0, c8:0.0} },
            { rank:4, label:'Libertà',                 val:72.7, classi:{c1:0.0, c3:27.3, c4:72.7, c7:0.0, c8:0.0} },
            { rank:5, label:'Oreto - Stazione',        val:64.9, classi:{c1:0.2, c3:35.0, c4:64.9, c7:0.0, c8:0.0} },
            { rank:6, label:'Settecannoli',            val:64.4, classi:{c1:1.2, c3:34.4, c4:64.4, c7:0.0, c8:0.0} },
            { rank:7, label:'Zisa',                    val:64.4, classi:{c1:0.0, c3:35.6, c4:64.4, c7:0.0, c8:0.0} },
            { rank:8, label:'Altarello',               val:64.0, classi:{c1:0.0, c3:36.0, c4:64.0, c7:0.0, c8:0.0} }
          ]
        });
      }
    },

    stability: {
      icon: SVG_ICONS.stability,
      title: 'Stabilità versanti',
      layer: 'stabilita-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Indice calcolato combinando pendenza, curvatura e morfologia su scala 1–5 ' +
          '(molto stabile → molto instabile). Il <strong>52,6%</strong> del territorio è in classe 1: ' +
          'aree pianeggianti o a bassa pendenza, naturalmente stabili. ' +
          'Il <strong>30,8% ricade in classi 3–4–5</strong> — zone dove la combinazione di pendenza elevata, ' +
          'curvatura convessa e morfologia accidentata aumenta il rischio di instabilità. ' +
          'Dato importante per la pianificazione urbanistica e la prevenzione del rischio idrogeologico. ' +
          'La Circoscrizione III Oreto ha il 40% di superficie a rischio; ' +
          'il quartiere più critico è Boccadifalco con <strong>65%</strong> in classi 3–4–5.'
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

        var STAB_CLASSES = [
          { key: 'c1', label: 'Molto stabile',  color: '#2e7d32' },
          { key: 'c2', label: 'Stabile',         color: '#66bb6a' },
          { key: 'c3', label: 'Mod. instabile',  color: '#ffee58' },
          { key: 'c4', label: 'Instabile',       color: '#ffa726' },
          { key: 'c5', label: 'Molto instabile', color: '#ef5350' }
        ];

        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: '% rischio (classi 3–4–5)',
          unit: '%',
          maxVal: 40.0,
          classes: STAB_CLASSES,
          items: [
            { rank:1, label:'III · Oreto',        val:40.0, classi:{c1:44.4, c2:15.5, c3:10.8, c4:19.0, c5:10.2} },
            { rank:2, label:'VII · Mondello',      val:37.1, classi:{c1:47.7, c2:14.7, c3:11.9, c4:16.2, c5:9.0}  },
            { rank:3, label:'V · Noce',            val:33.2, classi:{c1:48.6, c2:18.1, c3:16.8, c4:11.7, c5:4.7}  },
            { rank:4, label:'IV · Mezzomonreale',  val:31.0, classi:{c1:55.5, c2:13.1, c3:11.6, c4:14.7, c5:4.7}  },
            { rank:5, label:'VI · Nord-Ovest',     val:30.7, classi:{c1:44.5, c2:24.8, c3:19.9, c4:8.0,  c5:2.8}  },
            { rank:6, label:'VIII · Libertà',      val:22.2, classi:{c1:59.5, c2:17.7, c3:9.9,  c4:7.7,  c5:4.6}  },
            { rank:7, label:'II · Resuttana',      val:17.9, classi:{c1:69.7, c2:11.9, c3:4.3,  c4:6.3,  c5:7.3}  },
            { rank:8, label:'I · Centro Storico',  val:1.2,  classi:{c1:87.0, c2:11.1, c3:1.0,  c4:0.2,  c5:0.0}  }
          ]
        });

        appendRankingCard(el, {
          title: 'Top Quartieri · aree a rischio',
          subtitle: '% rischio (classi 3–4–5)',
          unit: '%',
          maxVal: 65.0,
          classes: STAB_CLASSES,
          items: [
            { rank:1, label:'Boccadifalco',               val:65.0, classi:{c1:20.7, c2:13.8, c3:22.7, c4:32.0, c5:10.3} },
            { rank:2, label:'Borgo Nuovo',                val:53.4, classi:{c1:20.8, c2:25.8, c3:26.8, c4:19.0, c5:7.6}  },
            { rank:3, label:'Partanna Mondello',          val:47.7, classi:{c1:40.3, c2:11.3, c3:14.3, c4:20.4, c5:13.0} },
            { rank:4, label:'Arenella - Vergine Maria',   val:45.0, classi:{c1:33.5, c2:19.8, c3:9.3,  c4:24.4, c5:11.3} },
            { rank:5, label:'Villagrazia - Falsomiele',   val:44.0, classi:{c1:39.6, c2:16.2, c3:11.6, c4:21.1, c5:11.3} },
            { rank:6, label:'Montepellegrino',            val:37.5, classi:{c1:33.8, c2:28.2, c3:16.7, c4:13.0, c5:7.8}  },
            { rank:7, label:'Tommaso Natale - Sferracavallo', val:33.6, classi:{c1:44.6, c2:21.3, c3:13.6, c4:14.5, c5:5.5} },
            { rank:8, label:'Cruillas - S.Giov. Apostolo', val:30.8, classi:{c1:41.2, c2:28.1, c3:20.5, c4:7.3,  c5:3.0}  }
          ]
        });
      }
    },

    build: {
      icon: SVG_ICONS.build,
      title: 'Costruibilità',
      layer: 'costruibilita-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Indice morfologico puro derivato da pendenza, stabilità e forma del terreno: ' +
          'non include vincoli legali o urbanistici, ma fornisce una base oggettiva per valutare ' +
          'l\'idoneità fisica di un\'area all\'edificazione. ' +
          'Il <strong>47,3% del territorio</strong> è in classe 1 (ottima): terreno pianeggiante e stabile. ' +
          'Il <strong>28,7% ricade in classi 4–5</strong>: pendenza, instabilità o morfologia complessa ' +
          'rendono l\'edificazione fisicamente problematica. ' +
          'Il quartiere Noce ha la costruibilità morfologica più alta in assoluto (<strong>98,8%</strong> classe ottima), ' +
          'seguito da Malaspina-Palagonia (97,4%) e Politeama (96,9%). ' +
          'Le aree peggiori corrispondono alle pendici dei rilievi nord-occidentali.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-build',
          title: 'Classi di costruibilità',
          centerVal: '47.3',
          centerLabel: '% ottima',
          legendData: [
            { chartLabel: 'Ottima', label: '1 - Ottima (pianura)', pct: 47.3, color: '#1a9641' },
            { chartLabel: 'Buona', label: '2 - Buona', pct: 14.1, color: '#a6d96a' },
            { chartLabel: 'Moderata', label: '3 - Moderata', pct: 9.9, color: '#ffffbf' },
            { chartLabel: 'Difficile', label: '4 - Difficile', pct: 16.4, color: '#fdae61' },
            { chartLabel: 'Non idonea', label: '5 - Non idonea', pct: 12.3, color: '#d7191c' }
          ]
        });

        var BUILD_CLASSES = [
          { key: 'c1', label: '1 - Ottima',      color: '#1a9641' },
          { key: 'c2', label: '2 - Buona',       color: '#a6d96a' },
          { key: 'c3', label: '3 - Moderata',    color: '#ffffbf' },
          { key: 'c4', label: '4 - Difficile',   color: '#fdae61' },
          { key: 'c5', label: '5 - Non idonea',  color: '#d7191c' }
        ];

        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: '% ottima (classe 1)',
          unit: '%',
          maxVal: 87.7,
          classes: BUILD_CLASSES,
          items: [
            { rank:1, label:'I · Centro Storico',  val:87.7, classi:{c1:87.7, c2:11.1, c3:1.0,  c4:0.2,  c5:0.0}  },
            { rank:2, label:'II · Resuttana',      val:70.0, classi:{c1:70.0, c2:12.0, c3:4.1,  c4:5.8,  c5:8.2}  },
            { rank:3, label:'VIII · Libertà',      val:55.2, classi:{c1:55.2, c2:4.5,  c3:17.5, c4:18.2, c5:4.6}  },
            { rank:4, label:'VII · Mondello',      val:47.9, classi:{c1:47.9, c2:12.7, c3:10.6, c4:19.6, c5:9.3}  },
            { rank:5, label:'V · Noce',            val:42.2, classi:{c1:42.2, c2:11.5, c3:6.8,  c4:23.8, c5:15.7} },
            { rank:6, label:'VI · Nord-Ovest',     val:40.7, classi:{c1:40.7, c2:8.2,  c3:13.3, c4:19.9, c5:17.9} },
            { rank:7, label:'III · Oreto',         val:38.1, classi:{c1:38.1, c2:20.0, c3:10.6, c4:19.0, c5:12.2} },
            { rank:8, label:'IV · Mezzomonreale',  val:38.1, classi:{c1:38.1, c2:26.0, c3:8.5,  c4:10.7, c5:16.7} }
          ]
        });

        appendRankingCard(el, {
          title: 'Top Quartieri · costruibilità ottima',
          subtitle: '% ottima (classe 1)',
          unit: '%',
          maxVal: 98.8,
          classes: BUILD_CLASSES,
          items: [
            { rank:1, label:'Noce',                    val:98.8, classi:{c1:98.8, c2:1.2,  c3:0.0, c4:0.0, c5:0.0} },
            { rank:2, label:'Malaspina - Palagonia',   val:97.4, classi:{c1:97.4, c2:2.4,  c3:0.0, c4:0.0, c5:0.2} },
            { rank:3, label:'Politeama',               val:96.9, classi:{c1:96.9, c2:2.5,  c3:0.5, c4:0.1, c5:0.0} },
            { rank:4, label:'Libertà',                 val:95.3, classi:{c1:95.3, c2:3.9,  c3:0.0, c4:0.6, c5:0.2} },
            { rank:5, label:'Tribunali-Castellammare', val:93.9, classi:{c1:93.9, c2:5.8,  c3:0.4, c4:0.0, c5:0.0} },
            { rank:6, label:'Zisa',                    val:93.2, classi:{c1:93.2, c2:5.5,  c3:1.2, c4:0.2, c5:0.0} },
            { rank:7, label:'Uditore - Passo di Rigano', val:92.3, classi:{c1:92.3, c2:7.0, c3:0.6, c4:0.0, c5:0.0} },
            { rank:8, label:'Altarello',               val:92.2, classi:{c1:92.2, c2:7.5,  c3:0.3, c4:0.0, c5:0.0} }
          ]
        });
      }
    },

    solar: {
      icon: SVG_ICONS.solar,
      title: 'Radiazione solare',
      layer: 'radiazione-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'L\'Indice di Radiazione Solare (SRI) misura la quantità di energia solare ' +
          'mediamente ricevuta da ogni cella nel corso dell\'anno, normalizzata tra 0 (assenza di luce) ' +
          'e 1 (massima esposizione). Valore medio per Palermo: <strong>0,59</strong>, ' +
          'coerente con la latitudine mediterranea. Il 56% del territorio ricade nella fascia media (0,5–0,65). ' +
          'La Circoscrizione VIII Libertà è la più irraggiata (SRI <strong>0,641</strong>); ' +
          'la III Oreto la meno irraggiata (0,494) per effetto dei versanti esposti a nord. ' +
          'Tra i quartieri, Cruillas–S.Giovanni Apostolo raggiunge SRI <strong>0,663</strong>. ' +
          'Dato utile per: potenziale fotovoltaico, colture eliofile, comfort termico urbano.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-solar',
          title: 'Classi di radiazione (SRI)',
          centerVal: '0,59',
          centerLabel: 'SRI medio',
          legendData: [
            { chartLabel: 'Molto bassa 0–0.3',  label: '0,0–0,3  molto bassa',  pct:  8, color: '#2c7bb6' },
            { chartLabel: 'Bassa 0.3–0.5',     label: '0,3–0,5  bassa',        pct: 10, color: '#abd9e9' },
            { chartLabel: 'Media 0.5–0.65',    label: '0,5–0,65  media',       pct: 56, color: '#ffffbf' },
            { chartLabel: 'Alta 0.65–0.8',     label: '0,65–0,8  alta',        pct: 20, color: '#fdae61' },
            { chartLabel: 'Molto alta 0.8–1',  label: '0,8–1,0  molto alta',   pct:  6, color: '#d7191c' }
          ],
          summaries: [
            { val: '0,59', label: 'SRI medio' },
            { val: '~0,00', label: 'min (ombra N)' },
            { val: '~1,00', label: 'max (S/SO)' }
          ]
        });
        appendText(el,
          'I versanti nord e nord-est, pur essendo i più estesi, ricevono meno luce rispetto ' +
          'ai versanti meridionali. Questo dato è rilevante per studi energetici e pianificazione ' +
          'del verde urbano.'
        );

        var SOLAR_CLASSES = [
          { key: 'c0_03',   label: '0,0–0,3',   color: '#2c7bb6' },
          { key: 'c03_05',  label: '0,3–0,5',   color: '#abd9e9' },
          { key: 'c05_065', label: '0,5–0,65',  color: '#ffffbf' },
          { key: 'c065_08', label: '0,65–0,8',  color: '#fdae61' },
          { key: 'c08_1',   label: '0,8–1,0',   color: '#d7191c' }
        ];

        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'SRI medio',
          unit: '',
          maxVal: 0.641,
          classes: SOLAR_CLASSES,
          items: [
            { rank:1, label:'VIII · Libertà',      val:0.641, classi:{c0_03:2.0,  c03_05:5.3,  c05_065:53.8, c065_08:32.2, c08_1:6.8} },
            { rank:2, label:'I · Centro Storico',  val:0.628, classi:{c0_03:1.6,  c03_05:0.7,  c05_065:70.6, c065_08:26.7, c08_1:0.4} },
            { rank:3, label:'IV · Mezzomonreale',  val:0.627, classi:{c0_03:5.8,  c03_05:6.8,  c05_065:56.2, c065_08:19.2, c08_1:12.1} },
            { rank:4, label:'VI · Nord-Ovest',     val:0.626, classi:{c0_03:3.0,  c03_05:9.6,  c05_065:46.2, c065_08:34.3, c08_1:6.9} },
            { rank:5, label:'V · Noce',            val:0.607, classi:{c0_03:8.3,  c03_05:8.8,  c05_065:49.6, c065_08:24.3, c08_1:9.1} },
            { rank:6, label:'VII · Mondello',      val:0.581, classi:{c0_03:9.2,  c03_05:11.0, c05_065:54.5, c065_08:18.2, c08_1:7.1} },
            { rank:7, label:'II · Resuttana',      val:0.561, classi:{c0_03:9.7,  c03_05:6.8,  c05_065:74.7, c065_08:8.3,  c08_1:0.5} },
            { rank:8, label:'III · Oreto',         val:0.494, classi:{c0_03:19.5, c03_05:16.5, c05_065:55.9, c065_08:7.5,  c08_1:0.5} }
          ]
        });

        appendRankingCard(el, {
          title: 'Top Quartieri · radiazione solare',
          subtitle: 'SRI medio',
          unit: '',
          maxVal: 0.663,
          classes: SOLAR_CLASSES,
          items: [
            { rank:1, label:'Cruillas - S.Giov. Apostolo', val:0.663, classi:{c0_03:2.1, c03_05:5.0, c05_065:41.4, c065_08:39.3, c08_1:12.2} },
            { rank:2, label:'Montepellegrino',             val:0.645, classi:{c0_03:3.0, c03_05:8.8, c05_065:36.9, c065_08:39.7, c08_1:11.6} },
            { rank:3, label:'Libertà',                     val:0.643, classi:{c0_03:0.1, c03_05:0.5, c05_065:65.5, c065_08:33.9, c08_1:0.0}  },
            { rank:4, label:'Mezzomonreale - Villa Tasca', val:0.640, classi:{c0_03:0.3, c03_05:0.6, c05_065:74.1, c065_08:23.0, c08_1:2.0}  },
            { rank:5, label:'Montegrappa - S.Rosalia',     val:0.639, classi:{c0_03:0.1, c03_05:1.9, c05_065:75.4, c065_08:20.0, c08_1:2.5}  },
            { rank:6, label:'Malaspina - Palagonia',       val:0.638, classi:{c0_03:0.0, c03_05:0.2, c05_065:85.0, c065_08:14.8, c08_1:0.0}  },
            { rank:7, label:'Zisa',                        val:0.638, classi:{c0_03:0.0, c03_05:0.3, c05_065:82.8, c065_08:16.0, c08_1:0.9}  },
            { rank:8, label:'Noce',                        val:0.636, classi:{c0_03:0.0, c03_05:0.0, c05_065:87.2, c065_08:12.8, c08_1:0.0}  }
          ]
        });
      }
    },

    heatmap: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>',
      title: 'Heatmap complessità',
      layer: 'heatmap-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La <strong>Heatmap di Complessità Terreno</strong> combina tre indicatori morfometrici: ' +
          'pendenza (peso 40%), Terrain Ruggedness Index — TRI (35%) e rugosità assoluta (25%). ' +
          'Ogni variabile è normalizzata tra 0 e 1 (percentile 2–98 per escludere outlier). ' +
          'Il <strong>63,6% del territorio</strong> ricade nella classe molto bassa (0–0,2): ' +
          'la pianura costiera e la Conca d\'Oro presentano terreno semplice. ' +
          'Solo il <strong>12,2% supera 0,6</strong>: si tratta dei versanti nord (Monte Cuccio, Pizzuta) ' +
          'dove pendenza, irregolarità e rugosità si sommano. Indice utile per: ' +
          'valutazione itinerari, pianificazione infrastrutture, analisi di pericolosità geomorfologica.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-heatmap',
          title: 'Distribuzione complessità',
          centerVal: '0,22',
          centerLabel: 'media',
          legendData: [
            { chartLabel: 'Molto bassa 0–0.2', label: '0,0–0,2  molto bassa',  pct: 63, color: '#053061' },
            { chartLabel: 'Bassa 0.2–0.4',     label: '0,2–0,4  bassa',        pct: 12, color: '#4393c3' },
            { chartLabel: 'Media 0.4–0.6',     label: '0,4–0,6  media',        pct: 12, color: '#f7f7f7' },
            { chartLabel: 'Alta 0.6–0.8',      label: '0,6–0,8  alta',         pct:  8, color: '#d6604d' },
            { chartLabel: 'Molto alta 0.8–1',  label: '0,8–1,0  molto alta',   pct:  4, color: '#67001f' }
          ],
          summaries: [
            { val: '0,22', label: 'media' },
            { val: '63,6%', label: 'bassa (<0,2)' },
            { val: '12,2%', label: 'alta (>0,6)' }
          ]
        });
        appendText(el,
          'Il confronto incrociato dei tre indici morfometrici rivela le aree di massima ' +
          'complessità topografica: le creste dei Monti di Palermo, i versanti nord-ovest ' +
          'verso Monreale e le balze rocciose di Montepellegrino.'
        );

        var HM_CLASSES = [
          { key:'c0_02',  label:'0–0,2  molto bassa',  color:'#053061' },
          { key:'c02_04', label:'0,2–0,4  bassa',       color:'#4393c3' },
          { key:'c04_06', label:'0,4–0,6  media',       color:'#f7f7f7' },
          { key:'c06_08', label:'0,6–0,8  alta',        color:'#d6604d' },
          { key:'c08_1',  label:'0,8–1,0  molto alta',  color:'#67001f' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'complessità media',
          unit: '',
          maxVal: 0.284,
          classes: HM_CLASSES,
          items: [
            { rank:1, label:'III · Oreto',           val:0.284, classi:{c0_02:55.0, c02_04:10.5, c04_06:14.0, c06_08:15.5, c08_1:5.1} },
            { rank:2, label:'VII · Mondello',         val:0.265, classi:{c0_02:58.1, c02_04:10.7, c04_06:14.1, c06_08:10.9, c08_1:6.2} },
            { rank:3, label:'V · Noce',               val:0.219, classi:{c0_02:59.8, c02_04:16.4, c04_06:14.7, c06_08:6.8,  c08_1:2.3} },
            { rank:4, label:'IV · Mezzomonreale',     val:0.214, classi:{c0_02:64.6, c02_04:10.2, c04_06:13.7, c06_08:9.2,  c08_1:2.4} },
            { rank:5, label:'VI · Nord-Ovest',        val:0.203, classi:{c0_02:59.1, c02_04:23.4, c04_06:12.3, c06_08:3.3,  c08_1:1.9} },
            { rank:6, label:'VIII · Libertà',         val:0.171, classi:{c0_02:71.8, c02_04:12.0, c04_06:8.4,  c06_08:4.5,  c08_1:3.4} },
            { rank:7, label:'II · Resuttana',         val:0.158, classi:{c0_02:78.9, c02_04:5.5,  c04_06:4.5,  c06_08:6.4,  c08_1:4.6} },
            { rank:8, label:'I · Centro Storico',     val:0.048, classi:{c0_02:97.1, c02_04:2.4,  c04_06:0.4,  c06_08:0.0,  c08_1:0.0} }
          ]
        });
        appendRankingCard(el, {
          title: 'Top Quartieri · complessità',
          subtitle: 'complessità media',
          unit: '',
          maxVal: 0.403,
          classes: HM_CLASSES,
          items: [
            { rank:1, label:'Boccadifalco',                     val:0.403, classi:{c0_02:28.3, c02_04:17.2, c04_06:29.1, c06_08:20.2, c08_1:5.1} },
            { rank:2, label:'Arenella - Vergine Maria',         val:0.340, classi:{c0_02:48.7, c02_04:10.5, c04_06:16.8, c06_08:14.8, c08_1:9.2} },
            { rank:3, label:'Borgo Nuovo',                      val:0.333, classi:{c0_02:35.8, c02_04:25.8, c04_06:23.7, c06_08:11.0, c08_1:3.7} },
            { rank:4, label:'Partanna Mondello',                val:0.330, classi:{c0_02:48.0, c02_04:10.9, c04_06:17.5, c06_08:14.4, c08_1:9.2} },
            { rank:5, label:'Villagrazia - Falsomiele',         val:0.310, classi:{c0_02:50.6, c02_04:11.2, c04_06:15.4, c06_08:17.2, c08_1:5.6} },
            { rank:6, label:'Montepellegrino',                  val:0.272, classi:{c0_02:52.6, c02_04:19.9, c04_06:14.1, c06_08:7.6,  c08_1:5.8} },
            { rank:7, label:'Brancaccio - Ciaculli',            val:0.242, classi:{c0_02:65.5, c02_04:8.2,  c04_06:7.5,  c06_08:10.9, c08_1:7.9} },
            { rank:8, label:'Tommaso Natale - Sferracavallo',   val:0.239, classi:{c0_02:58.9, c02_04:14.7, c04_06:14.2, c06_08:9.4,  c08_1:2.9} }
          ]
        });
      }
    },

    vulnerabilita: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      title: 'Indice vulnerabilità',
      layer: 'vulnerabilita-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'L\'<strong>Indice di Vulnerabilità Territoriale</strong> aggrega quattro fattori di rischio ' +
          'morfologico con pesi differenziati: pendenza (35%), classe di stabilità versanti (30%), ' +
          'costruibilità (20%), rugosità TRI (15%). ' +
          'Il <strong>56,9%</strong> del territorio presenta vulnerabilità molto bassa: aree pianeggianti ' +
          'e stabili dove il rischio geomorfologico è trascurabile. ' +
          'Il <strong>18,8%</strong> supera la soglia critica (0,6): versanti ripidi, instabili o con ' +
          'costruibilità molto limitata — concentrati nei rilievi nord-ovest e nelle balze collinari. ' +
          'Il <strong>6,3%</strong> raggiunge vulnerabilità massima (0,8–1,0), ' +
          'corrispondente a pendenze oltre 35°, stabilità classe 4–5 e costruibilità nulla.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-vuln',
          title: 'Classi di vulnerabilità',
          centerVal: '0,26',
          centerLabel: 'media',
          legendData: [
            { chartLabel: 'Molto bassa 0–0.2', label: '0,0–0,2  molto bassa',  pct: 57, color: '#1a9641' },
            { chartLabel: 'Bassa 0.2–0.4',     label: '0,2–0,4  bassa',        pct: 12, color: '#a6d96a' },
            { chartLabel: 'Media 0.4–0.6',     label: '0,4–0,6  media',        pct: 13, color: '#ffffbf' },
            { chartLabel: 'Alta 0.6–0.8',      label: '0,6–0,8  alta',         pct: 13, color: '#f46d43' },
            { chartLabel: 'Critica 0.8–1.0',   label: '0,8–1,0  critica',      pct:  6, color: '#a50026' }
          ],
          summaries: [
            { val: '0,26', label: 'media' },
            { val: '56,9%', label: 'bassa (<0,2)' },
            { val: '18,8%', label: 'alta (>0,6)' }
          ]
        });
        appendText(el,
          'L\'indice sintetico di vulnerabilità individua le zone a maggior rischio combinato. ' +
          'Zona critica: crinali dei Monti di Palermo tra Boccadifalco, Baida e Mondello. ' +
          'Zona sicura: tutta la fascia costiera pianeggiante dalla Noce al Centro Storico ' +
          'e il fondovalle dell\'Oreto.'
        );

        var VL_CLASSES = [
          { key:'c0_02',  label:'0–0,2  molto bassa', color:'#1a9641' },
          { key:'c02_04', label:'0,2–0,4  bassa',      color:'#a6d96a' },
          { key:'c04_06', label:'0,4–0,6  media',      color:'#ffffbf' },
          { key:'c06_08', label:'0,6–0,8  alta',       color:'#f46d43' },
          { key:'c08_1',  label:'0,8–1,0  critica',    color:'#a50026' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'vulnerabilità media',
          unit: '',
          maxVal: 0.324,
          classes: VL_CLASSES,
          items: [
            { rank:1, label:'III · Oreto',        val:0.324, classi:{c0_02:50.0, c02_04:9.8,  c04_06:11.0, c06_08:18.9, c08_1:10.4} },
            { rank:2, label:'VII · Mondello',      val:0.297, classi:{c0_02:53.3, c02_04:9.3,  c04_06:12.0, c06_08:16.3, c08_1:9.1} },
            { rank:3, label:'V · Noce',            val:0.275, classi:{c0_02:51.6, c02_04:14.3, c04_06:16.8, c06_08:13.0, c08_1:4.2} },
            { rank:4, label:'VI · Nord-Ovest',     val:0.265, classi:{c0_02:46.8, c02_04:20.9, c04_06:21.2, c06_08:8.4,  c08_1:2.7} },
            { rank:5, label:'IV · Mezzomonreale',  val:0.259, classi:{c0_02:59.7, c02_04:8.7,  c04_06:11.5, c06_08:15.2, c08_1:4.9} },
            { rank:6, label:'VIII · Libertà',      val:0.206, classi:{c0_02:62.0, c02_04:15.6, c04_06:10.1, c06_08:7.6,  c08_1:4.6} },
            { rank:7, label:'II · Resuttana',      val:0.170, classi:{c0_02:75.4, c02_04:6.5,  c04_06:4.3,  c06_08:6.3,  c08_1:7.5} },
            { rank:8, label:'I · Centro Storico',  val:0.043, classi:{c0_02:94.1, c02_04:4.7,  c04_06:1.0,  c06_08:0.2,  c08_1:0.0} }
          ]
        });
        appendRankingCard(el, {
          title: 'Top Quartieri · vulnerabilità',
          subtitle: 'vulnerabilità media',
          unit: '',
          maxVal: 0.492,
          classes: VL_CLASSES,
          items: [
            { rank:1, label:'Boccadifalco',                   val:0.492, classi:{c0_02:22.3, c02_04:11.2, c04_06:22.7, c06_08:33.1, c08_1:10.7} },
            { rank:2, label:'Borgo Nuovo',                    val:0.428, classi:{c0_02:23.5, c02_04:21.8, c04_06:26.9, c06_08:20.9, c08_1:6.8} },
            { rank:3, label:'Arenella - Vergine Maria',       val:0.377, classi:{c0_02:42.7, c02_04:11.1, c04_06:10.6, c06_08:23.4, c08_1:12.2} },
            { rank:4, label:'Partanna Mondello',              val:0.367, classi:{c0_02:44.4, c02_04:7.6,  c04_06:14.1, c06_08:20.8, c08_1:13.1} },
            { rank:5, label:'Villagrazia - Falsomiele',       val:0.355, classi:{c0_02:45.3, c02_04:10.3, c04_06:11.9, c06_08:20.9, c08_1:11.5} },
            { rank:6, label:'Montepellegrino',                val:0.337, classi:{c0_02:36.5, c02_04:25.8, c04_06:16.9, c06_08:12.9, c08_1:7.8} },
            { rank:7, label:'Tommaso Natale - Sferracavallo', val:0.278, classi:{c0_02:51.2, c02_04:14.5, c04_06:14.0, c06_08:14.8, c08_1:5.5} },
            { rank:8, label:'Cruillas - S.Giovanni Apostolo', val:0.272, classi:{c0_02:43.9, c02_04:24.2, c04_06:21.7, c06_08:7.3,  c08_1:2.9} }
          ]
        });
      }
    },

    solarraf: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/><line x1="12" y1="8" x2="12" y2="12" stroke-width="3"/></svg>',
      title: 'Solare raffinato',
      layer: 'solare-raf-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Il <strong>Solare Raffinato</strong> corregge l\'Indice di Radiazione Solare (SRI) base ' +
          'moltiplicandolo per due fattori: (1) <strong>fattore aspetto</strong> — massimo per esposizione ' +
          'Sud (180°), minimo per Nord; formula: 0,60 + 0,40 × (1 − cos(aspetto))/2; ' +
          '(2) <strong>fattore pendenza</strong> — ottimale 3°–30°, penalità lieve sotto 3° (pianura ' +
          'quasi orizzontale) e oltre 30° (versante eccessivo). ' +
          'Rispetto al SRI grezzo (media 0,59), la correzione riduce la media a <strong>0,43</strong> ' +
          'perché penalizza i numerosi versanti esposti a nord. ' +
          'Il <strong>14,7%</strong> raggiunge valori ottimali (0,6–1,0): versanti meridionali ' +
          'moderatamente inclinati — zone ideali per impianti fotovoltaici e colture eliofile.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-solarraf',
          title: 'Distribuzione solare corretto',
          centerVal: '0,43',
          centerLabel: 'media corr.',
          legendData: [
            { chartLabel: 'Minima 0–0.2',   label: '0,0–0,2  minima (N/ombra)',  pct:  8, color: '#440154' },
            { chartLabel: 'Bassa 0.2–0.4',  label: '0,2–0,4  bassa',             pct: 41, color: '#3e6f8e' },
            { chartLabel: 'Media 0.4–0.6',  label: '0,4–0,6  media',             pct: 36, color: '#1fa188' },
            { chartLabel: 'Alta 0.6–0.8',   label: '0,6–0,8  alta',              pct: 11, color: '#9fda3a' },
            { chartLabel: 'Ottima 0.8–1.0', label: '0,8–1,0  ottima (S/SO)',     pct:  4, color: '#f2a600' }
          ],
          summaries: [
            { val: '0,43', label: 'media corr.' },
            { val: '0,59', label: 'SRI grezzo' },
            { val: '14,7%', label: 'ottimale (>0,6)' }
          ]
        });
        appendText(el,
          'La correzione rivela la reale potenzialità energetica del territorio: ' +
          'le zone pianeggianti costiere (SRI grezzo alto ma aspetto piatto) scendono a ' +
          'valori medi, mentre i versanti meridionali moderatamente inclinati (Mezzomonreale, ' +
          'Cruillas-Brancaccio) emergono come aree di massima efficienza solare.'
        );

        var SR_CLASSES = [
          { key:'c0_02',  label:'0–0,2  minima',    color:'#440154' },
          { key:'c02_04', label:'0,2–0,4  bassa',   color:'#3e6f8e' },
          { key:'c04_06', label:'0,4–0,6  media',   color:'#1fa188' },
          { key:'c06_08', label:'0,6–0,8  alta',    color:'#9fda3a' },
          { key:'c08_1',  label:'0,8–1,0  ottima',  color:'#f2a600' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'solare corretto medio',
          unit: '',
          maxVal: 0.41,
          classes: SR_CLASSES,
          items: [
            { rank:1, label:'VI · Nord-Ovest',     val:0.410, classi:{c0_02:20.6, c02_04:31.8, c04_06:24.1, c06_08:18.6, c08_1:4.9} },
            { rank:2, label:'IV · Mezzomonreale',  val:0.391, classi:{c0_02:24.7, c02_04:36.0, c04_06:18.1, c06_08:12.3, c08_1:9.0} },
            { rank:3, label:'V · Noce',            val:0.381, classi:{c0_02:29.2, c02_04:31.1, c04_06:15.9, c06_08:17.9, c08_1:5.9} },
            { rank:4, label:'VIII · Libertà',      val:0.370, classi:{c0_02:28.9, c02_04:32.2, c04_06:17.7, c06_08:17.0, c08_1:4.1} },
            { rank:5, label:'VII · Mondello',      val:0.349, classi:{c0_02:29.8, c02_04:35.2, c04_06:19.8, c06_08:10.3, c08_1:4.8} },
            { rank:6, label:'I · Centro Storico',  val:0.313, classi:{c0_02:31.2, c02_04:41.8, c04_06:17.9, c06_08:9.0,  c08_1:0.2} },
            { rank:7, label:'III · Oreto',         val:0.261, classi:{c0_02:38.1, c02_04:47.5, c04_06:10.8, c06_08:3.4,  c08_1:0.2} },
            { rank:8, label:'II · Resuttana',      val:0.242, classi:{c0_02:44.3, c02_04:43.7, c04_06:9.5,  c06_08:2.3,  c08_1:0.2} }
          ]
        });
        appendRankingCard(el, {
          title: 'Top Quartieri · solare raffinato',
          subtitle: 'solare corretto medio',
          unit: '',
          maxVal: 0.478,
          classes: SR_CLASSES,
          items: [
            { rank:1, label:'Boccadifalco',                   val:0.478, classi:{c0_02:17.6, c02_04:30.6, c04_06:16.1, c06_08:16.9, c08_1:18.8} },
            { rank:2, label:'Cruillas - S.Giovanni Apostolo', val:0.469, classi:{c0_02:18.5, c02_04:22.6, c04_06:23.7, c06_08:26.0, c08_1:9.2} },
            { rank:3, label:'Montepellegrino',                val:0.467, classi:{c0_02:14.4, c02_04:28.7, c04_06:22.8, c06_08:27.1, c08_1:7.1} },
            { rank:4, label:'Borgo Nuovo',                    val:0.458, classi:{c0_02:20.7, c02_04:25.4, c04_06:17.5, c06_08:27.0, c08_1:9.5} },
            { rank:5, label:'Arenella - Vergine Maria',       val:0.384, classi:{c0_02:18.7, c02_04:30.0, c04_06:40.5, c06_08:10.1, c08_1:0.7} },
            { rank:6, label:'Partanna Mondello',              val:0.376, classi:{c0_02:31.2, c02_04:28.8, c04_06:17.1, c06_08:14.1, c08_1:8.8} },
            { rank:7, label:'Resuttana - San Lorenzo',        val:0.364, classi:{c0_02:22.3, c02_04:39.0, c04_06:24.4, c06_08:12.8, c08_1:1.5} },
            { rank:8, label:'Palazzo Reale - Monte di Pietà', val:0.351, classi:{c0_02:22.6, c02_04:44.2, c04_06:20.5, c06_08:12.3, c08_1:0.4} }
          ]
        });
      }
    },

    tpi: {
      icon: SVG_ICONS.tpi,
      title: 'TPI — Posizione topografica locale',
      layer: 'tpi-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Il <strong>TPI (Topographic Position Index)</strong> confronta la quota di ogni cella con la media ' +
          'del vicinato (scala ~100 m): valori negativi indicano valli e depressioni, valori positivi creste e sommità. ' +
          'A Palermo il 50% del territorio ha TPI compreso tra <strong>−0,08 e +0,08</strong> — pianura e mezzacosta. ' +
          'Le valli incise (TPI &lt; −0,5) rappresentano il <strong>5%</strong>, le creste (TPI &gt; 0,5) il <strong>5%</strong>. ' +
          'Utile per identificare percorsi di deflusso idrico, aree di accumulo e crinali morfologici.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-tpi',
          title: 'Classi TPI locale',
          centerVal: '0,00',
          centerLabel: 'media TPI',
          legendData: [
            { chartLabel: 'Valle < −1',        label: 'Valle / Depressione  TPI < −1',       pct:  5, color: '#4575b4' },
            { chartLabel: 'Vers. basso −1/−0.5', label: 'Versante basso  −1 – −0,5',         pct: 20, color: '#91bfdb' },
            { chartLabel: 'Pianura −0.5/+0.5', label: 'Pianura / Mezzacosta  −0,5 – +0,5',  pct: 50, color: '#ffffbf' },
            { chartLabel: 'Vers. alto +0.5/+1', label: 'Versante alto  +0,5 – +1',           pct: 20, color: '#fc8d59' },
            { chartLabel: 'Cresta > +1',        label: 'Cresta / Sommità  TPI > +1',         pct:  5, color: '#d73027' }
          ],
          summaries: [
            { val: '50%', label: 'pianura/mezzac.' },
            { val: '5%',  label: 'valli incise' },
            { val: '5%',  label: 'creste' }
          ]
        });
        appendText(el,
          'Le valli principali (Oreto, Gabriele, Eleuterio) emergono come depressioni lineari (TPI molto negativo). ' +
          'I rilievi di Montepellegrino e i Monti di Palermo mostrano creste continue ad alto TPI. ' +
          'La Conca d\'Oro e il centro urbano costiero risultano in classe pianura/mezzacosta.'
        );

        var TPI_CLASSES = [
          { key:'c_valle',   label:'Valle  TPI < −1',       color:'#4575b4' },
          { key:'c_basso',   label:'Vers. basso  −1/−0,5', color:'#91bfdb' },
          { key:'c_pianura', label:'Pianura  ±0,5',         color:'#ffffbf' },
          { key:'c_alto',    label:'Vers. alto  +0,5/+1',  color:'#fc8d59' },
          { key:'c_cresta',  label:'Cresta  TPI > +1',      color:'#d73027' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni · creste',
          subtitle: '% creste (TPI > +1)',
          unit: '%',
          maxVal: 2.2,
          classes: TPI_CLASSES,
          items: [
            { rank:1, label:'VII · Mondello',      val:2.2, classi:{c_valle:2.3, c_basso:5.4,  c_pianura:85.0, c_alto:5.2, c_cresta:2.2} },
            { rank:2, label:'VIII · Libertà',      val:1.6, classi:{c_valle:1.2, c_basso:2.8,  c_pianura:91.4, c_alto:3.0, c_cresta:1.6} },
            { rank:3, label:'III · Oreto',         val:1.4, classi:{c_valle:1.4, c_basso:6.7,  c_pianura:84.0, c_alto:6.5, c_cresta:1.4} },
            { rank:4, label:'II · Resuttana',      val:1.2, classi:{c_valle:1.3, c_basso:3.2,  c_pianura:91.4, c_alto:2.9, c_cresta:1.2} },
            { rank:5, label:'IV · Mezzomonreale',  val:0.9, classi:{c_valle:1.0, c_basso:4.9,  c_pianura:88.2, c_alto:5.0, c_cresta:0.9} },
            { rank:6, label:'V · Noce',            val:0.9, classi:{c_valle:0.9, c_basso:4.1,  c_pianura:90.0, c_alto:4.2, c_cresta:0.9} },
            { rank:7, label:'VI · Nord-Ovest',     val:0.8, classi:{c_valle:0.8, c_basso:3.2,  c_pianura:91.8, c_alto:3.3, c_cresta:0.8} },
            { rank:8, label:'I · Centro Storico',  val:0.1, classi:{c_valle:0.1, c_basso:0.5,  c_pianura:98.8, c_alto:0.6, c_cresta:0.1} }
          ]
        });
        appendRankingCard(el, {
          title: 'Top Quartieri · creste locali',
          subtitle: '% creste (TPI > +1)',
          unit: '%',
          maxVal: 3.3,
          classes: TPI_CLASSES,
          items: [
            { rank:1, label:'Arenella - Vergine Maria',  val:3.3, classi:{c_valle:4.3, c_basso:7.4,  c_pianura:78.7, c_alto:6.3,  c_cresta:3.3} },
            { rank:2, label:'Partanna Mondello',         val:3.3, classi:{c_valle:3.3, c_basso:6.5,  c_pianura:80.5, c_alto:6.3,  c_cresta:3.3} },
            { rank:3, label:'Montepellegrino',           val:2.7, classi:{c_valle:1.9, c_basso:4.6,  c_pianura:85.8, c_alto:5.0,  c_cresta:2.7} },
            { rank:4, label:'Brancaccio - Ciaculli',     val:2.1, classi:{c_valle:2.2, c_basso:5.1,  c_pianura:86.0, c_alto:4.6,  c_cresta:2.1} },
            { rank:5, label:'Boccadifalco',              val:1.9, classi:{c_valle:1.9, c_basso:9.8,  c_pianura:76.5, c_alto:10.0, c_cresta:1.9} },
            { rank:6, label:'Villagrazia - Falsomiele',  val:1.6, classi:{c_valle:1.5, c_basso:7.3,  c_pianura:82.5, c_alto:7.1,  c_cresta:1.6} },
            { rank:7, label:'Borgo Nuovo',               val:1.4, classi:{c_valle:1.4, c_basso:6.4,  c_pianura:84.2, c_alto:6.6,  c_cresta:1.4} },
            { rank:8, label:'Cruillas - S.Giovanni Apostolo', val:1.0, classi:{c_valle:1.0, c_basso:3.4, c_pianura:91.1, c_alto:3.6, c_cresta:1.0} }
          ]
        });
      }
    },

    tpi300: {
      icon: SVG_ICONS.tpi,
      title: 'TPI — Posizione topografica regionale (300 m)',
      layer: 'tpi300-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Il <strong>TPI a scala regionale (300 m)</strong> confronta la quota di ogni cella con la media ' +
          'di un vicinato ampio (~300 m di raggio): cattura la posizione morfologica nel paesaggio più vasto — ' +
          'fondovalli fluviali, pianure intermontane, dorsali principali. ' +
          'I valori spaziano da <strong>−142 m</strong> (fondovalle incassato) a <strong>+623 m</strong> (vetta prominente). ' +
          'Combinato col TPI locale permette di classificare in 6 tipi morfologici: ' +
          'piana, cresta locale, cresta esposta, versante aperto, valle chiusa, depressione.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-tpi300',
          title: 'Classi TPI 300m',
          centerVal: '4,9',
          centerLabel: 'media (m)',
          legendData: [
            { chartLabel: 'Valle < −12',         label: 'Valle / Fondovalle  TPI < −12 m',    pct: 10, color: '#4575b4' },
            { chartLabel: 'Vers. basso −12/−1.5', label: 'Versante basso  −12 – −1,5 m',      pct: 15, color: '#91bfdb' },
            { chartLabel: 'Pianura −1.5/+1.5',   label: 'Pianura regionale  −1,5 – +1,5 m',  pct: 50, color: '#ffffbf' },
            { chartLabel: 'Vers. alto +1.5/+12', label: 'Versante alto  +1,5 – +12 m',        pct: 15, color: '#fc8d59' },
            { chartLabel: 'Cresta > +12',         label: 'Cresta / Dorsale  TPI > +12 m',     pct: 10, color: '#d73027' }
          ],
          summaries: [
            { val: '−142',  label: 'm min (fondovalle)' },
            { val: '+623',  label: 'm max (vetta)' },
            { val: '34 m',  label: 'dev. std.' }
          ]
        });
        appendText(el,
          'A scala regionale emergono i grandi sistemi morfologici: la pianura costiera (Conca d\'Oro) in classe pianura, ' +
          'le dorsali calcaree dei Monti di Palermo come creste continue, le incisioni fluviali maggiori come valli profonde. ' +
          'Utile per pianificazione territoriale e valutazione del rischio idrogeologico a grande scala.'
        );

        var T3_CLASSES = [
          { key:'c_valle',   label:'Valle  TPI < −12 m',       color:'#4575b4' },
          { key:'c_basso',   label:'Vers. basso  −12/−1,5 m', color:'#91bfdb' },
          { key:'c_pianura', label:'Pianura  ±1,5 m',          color:'#ffffbf' },
          { key:'c_alto',    label:'Vers. alto  +1,5/+12 m',  color:'#fc8d59' },
          { key:'c_cresta',  label:'Cresta  TPI > +12 m',      color:'#d73027' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'TPI regionale medio (m)',
          unit: 'm',
          maxVal: 9.37,
          classes: T3_CLASSES,
          items: [
            { rank:1, label:'III · Oreto',        val:9.37, classi:{c_valle:8.1,  c_basso:20.0, c_pianura:44.3, c_alto:13.4, c_cresta:14.2} },
            { rank:2, label:'IV · Mezzomonreale', val:7.87, classi:{c_valle:4.2,  c_basso:17.1, c_pianura:51.6, c_alto:14.3, c_cresta:12.9} },
            { rank:3, label:'VI · Nord-Ovest',    val:4.09, classi:{c_valle:5.2,  c_basso:21.7, c_pianura:47.3, c_alto:17.5, c_cresta:8.3} },
            { rank:4, label:'II · Resuttana',     val:4.05, classi:{c_valle:4.1,  c_basso:14.7, c_pianura:67.0, c_alto:7.1,  c_cresta:7.0} },
            { rank:5, label:'VIII · Libertà',     val:3.06, classi:{c_valle:2.0,  c_basso:14.4, c_pianura:58.8, c_alto:14.2, c_cresta:10.7} },
            { rank:6, label:'V · Noce',           val:2.65, classi:{c_valle:4.3,  c_basso:22.9, c_pianura:51.5, c_alto:14.1, c_cresta:7.3} },
            { rank:7, label:'VII · Mondello',     val:0.10, classi:{c_valle:11.2, c_basso:22.5, c_pianura:47.9, c_alto:9.4,  c_cresta:8.9} },
            { rank:8, label:'I · Centro Storico', val:0.08, classi:{c_valle:0.0,  c_basso:12.7, c_pianura:73.7, c_alto:13.6, c_cresta:0.0} }
          ]
        });
        appendRankingCard(el, {
          title: 'Top Quartieri · TPI 300m',
          subtitle: 'TPI regionale medio (m)',
          unit: 'm',
          maxVal: 15.87,
          classes: T3_CLASSES,
          items: [
            { rank:1, label:'Boccadifalco',                   val:15.87, classi:{c_valle:7.9, c_basso:24.7, c_pianura:25.5, c_alto:17.8, c_cresta:24.1} },
            { rank:2, label:'Villagrazia - Falsomiele',       val:10.43, classi:{c_valle:8.9, c_basso:21.1, c_pianura:41.0, c_alto:13.2, c_cresta:15.9} },
            { rank:3, label:'Brancaccio - Ciaculli',          val:6.69,  classi:{c_valle:7.0, c_basso:21.7, c_pianura:54.8, c_alto:4.9,  c_cresta:11.6} },
            { rank:4, label:'Montepellegrino',                val:5.23,  classi:{c_valle:3.4, c_basso:22.8, c_pianura:33.7, c_alto:21.8, c_cresta:18.3} },
            { rank:5, label:'Cruillas - S.Giovanni Apostolo', val:5.17,  classi:{c_valle:4.6, c_basso:23.9, c_pianura:43.6, c_alto:18.2, c_cresta:9.6} },
            { rank:6, label:'Borgo Nuovo',                    val:4.29,  classi:{c_valle:6.9, c_basso:35.1, c_pianura:25.1, c_alto:21.0, c_cresta:11.8} },
            { rank:7, label:'Resuttana - San Lorenzo',        val:3.24,  classi:{c_valle:5.6, c_basso:20.0, c_pianura:50.2, c_alto:16.9, c_cresta:7.3} },
            { rank:8, label:'Tommaso Natale - Sferracavallo', val:3.18,  classi:{c_valle:3.7, c_basso:28.3, c_pianura:46.4, c_alto:12.9, c_cresta:8.7} }
          ]
        });
      }
    },

    curvplanare: {
      icon: SVG_ICONS.curvature,
      title: 'Curvatura planare',
      layer: 'curvplanare-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La <strong>curvatura planare</strong> descrive la forma della superficie nel piano orizzontale: ' +
          'valori negativi (blu) indicano forme <strong>convergenti</strong> — il flusso idrico si concentra, ' +
          'accumulo di sedimenti e saturazione del suolo. ' +
          'Valori positivi (arancio-rosso) indicano forme <strong>divergenti</strong> — il flusso si disperde, ' +
          'drenaggio rapido. I valori vicini a zero (grigio chiaro) indicano superfici planari. ' +
          'Indicatore chiave per rischio idraulico e modellazione del deflusso.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-curvp',
          title: 'Curvatura planare',
          centerVal: '0,00',
          centerLabel: 'media',
          legendData: [
            { chartLabel: 'Convergente < −0.05', label: 'Convergente (accumulo)  < −0,05',  pct: 25, color: '#2166ac' },
            { chartLabel: 'Planare ±0.05',       label: 'Planare  −0,05 – +0,05',           pct: 50, color: '#f7f7f7' },
            { chartLabel: 'Divergente > +0.05',  label: 'Divergente (dispersione)  > +0,05', pct: 25, color: '#d6604d' }
          ],
          summaries: [
            { val: '25%', label: 'convergente' },
            { val: '50%', label: 'planare' },
            { val: '25%', label: 'divergente' }
          ]
        });
        appendText(el,
          'Le zone convergenti (blu intenso) corrispondono ai canali drenanti e ai fondovalle — ' +
          'aree a rischio alluvione e frana per saturazione. Le superfici divergenti (rosso) sono ' +
          'tipiche di speroni e creste — drenaggio rapido ma rischio erosione superficiale. ' +
          'Sovrapposta alla pendenza, guida la localizzazione dei bacini di raccolta.'
        );

        var CP_CLASSES = [
          { key:'c_conv',  label:'Convergente  < −0,05', color:'#2166ac' },
          { key:'c_plan',  label:'Planare  ±0,05',       color:'#f7f7f7' },
          { key:'c_div',   label:'Divergente  > +0,05',  color:'#d6604d' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni · convergenza',
          subtitle: '% superficie convergente',
          unit: '%',
          maxVal: 33.9,
          classes: CP_CLASSES,
          items: [
            { rank:1, label:'I · Centro Storico',  val:33.9, classi:{c_conv:33.9, c_plan:33.2, c_div:32.9} },
            { rank:2, label:'II · Resuttana',      val:28.0, classi:{c_conv:28.0, c_plan:43.0, c_div:29.0} },
            { rank:3, label:'VIII · Libertà',      val:26.4, classi:{c_conv:26.4, c_plan:48.2, c_div:25.4} },
            { rank:4, label:'IV · Mezzomonreale',  val:26.3, classi:{c_conv:26.3, c_plan:47.2, c_div:26.5} },
            { rank:5, label:'VII · Mondello',      val:24.2, classi:{c_conv:24.2, c_plan:51.2, c_div:24.6} },
            { rank:6, label:'V · Noce',            val:23.9, classi:{c_conv:23.9, c_plan:52.3, c_div:23.8} },
            { rank:7, label:'VI · Nord-Ovest',     val:23.7, classi:{c_conv:23.7, c_plan:52.4, c_div:23.9} },
            { rank:8, label:'III · Oreto',         val:22.4, classi:{c_conv:22.4, c_plan:55.3, c_div:22.4} }
          ]
        });
        appendRankingCard(el, {
          title: 'Top Quartieri · curvatura planare',
          subtitle: '% superficie convergente',
          unit: '%',
          maxVal: 36.0,
          classes: CP_CLASSES,
          items: [
            { rank:1, label:'Noce',                            val:36.0, classi:{c_conv:36.0, c_plan:28.4, c_div:35.5} },
            { rank:2, label:'Oreto - Stazione',                val:35.9, classi:{c_conv:35.9, c_plan:28.6, c_div:35.5} },
            { rank:3, label:'Malaspina - Palagonia',           val:35.5, classi:{c_conv:35.5, c_plan:29.6, c_div:34.9} },
            { rank:4, label:'Uditore - Passo di Rigano',       val:35.5, classi:{c_conv:35.5, c_plan:28.0, c_div:36.5} },
            { rank:5, label:'Montegrappa - S. Rosalia',        val:34.9, classi:{c_conv:34.9, c_plan:30.9, c_div:34.2} },
            { rank:6, label:'Libertà',                         val:34.9, classi:{c_conv:34.9, c_plan:29.5, c_div:35.6} },
            { rank:7, label:'Settecannoli',                    val:34.8, classi:{c_conv:34.8, c_plan:29.9, c_div:35.4} },
            { rank:8, label:'Zisa',                            val:34.5, classi:{c_conv:34.5, c_plan:30.5, c_div:35.0} }
          ]
        });
      }
    },

    curvprofilo: {
      icon: SVG_ICONS.curvature,
      title: 'Curvatura profilo',
      layer: 'curvprofilo-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La <strong>curvatura del profilo</strong> misura la variazione di pendenza lungo la linea di massima pendenza: ' +
          'valori negativi (verde) = superfici <strong>concave</strong> — il flusso decelera, favorisce deposito ' +
          'e accumulo (forma a cucchiaio). Valori positivi (rosso) = superfici <strong>convesse</strong> — ' +
          'il flusso accelera, favorisce erosione e trasporto. ' +
          'Utile per individuare aree di deposito (rischio frana da colamento) e zone di erosione attiva.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-curvpr',
          title: 'Curvatura profilo',
          centerVal: '0,00',
          centerLabel: 'media',
          legendData: [
            { chartLabel: 'Concava < −0.005', label: 'Concava (deposito)  < −0,005',   pct: 25, color: '#1a9850' },
            { chartLabel: 'Lineare ±0.005',   label: 'Lineare  −0,005 – +0,005',       pct: 50, color: '#ffffbf' },
            { chartLabel: 'Convessa > 0.005', label: 'Convessa (erosione)  > +0,005',  pct: 25, color: '#d73027' }
          ],
          summaries: [
            { val: '25%', label: 'concava (deposito)' },
            { val: '50%', label: 'lineare' },
            { val: '25%', label: 'convessa (erosione)' }
          ]
        });
        appendText(el,
          'I versanti convessi (rosso) nei rilievi calcarei dei Monti di Palermo indicano erosione attiva e ' +
          'trasporto di materiale. Le superfici concave (verde) ai piedi dei versanti e nelle conche ' +
          'intravallive segnalano depositi colluviali — zone a rischio frana per colamento e debris flow. ' +
          'Combinata con la pendenza, è un predittore di instabilità dei versanti.'
        );

        var CPR_CLASSES = [
          { key:'c_conv',  label:'Concava  < −0,005',    color:'#1a9850' },
          { key:'c_lin',   label:'Lineare  ±0,005',      color:'#ffffbf' },
          { key:'c_cvx',   label:'Convessa  > +0,005',   color:'#d73027' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni · convessità',
          subtitle: '% superficie convessa',
          unit: '%',
          maxVal: 25.8,
          classes: CPR_CLASSES,
          items: [
            { rank:1, label:'VI · Nord-Ovest',     val:25.8, classi:{c_conv:27.1, c_lin:47.1, c_cvx:25.8} },
            { rank:2, label:'V · Noce',            val:24.6, classi:{c_conv:26.2, c_lin:49.2, c_cvx:24.6} },
            { rank:3, label:'IV · Mezzomonreale',  val:24.2, classi:{c_conv:25.0, c_lin:50.9, c_cvx:24.2} },
            { rank:4, label:'VII · Mondello',      val:24.2, classi:{c_conv:26.8, c_lin:48.9, c_cvx:24.2} },
            { rank:5, label:'III · Oreto',         val:23.0, classi:{c_conv:25.0, c_lin:52.0, c_cvx:23.0} },
            { rank:6, label:'VIII · Libertà',      val:21.7, classi:{c_conv:21.7, c_lin:56.7, c_cvx:21.7} },
            { rank:7, label:'II · Resuttana',      val:18.0, classi:{c_conv:20.1, c_lin:61.9, c_cvx:18.0} },
            { rank:8, label:'I · Centro Storico',  val:17.2, classi:{c_conv:18.6, c_lin:64.1, c_cvx:17.2} }
          ]
        });
        appendRankingCard(el, {
          title: 'Top Quartieri · curvatura profilo',
          subtitle: '% superficie convessa',
          unit: '%',
          maxVal: 29.2,
          classes: CPR_CLASSES,
          items: [
            { rank:1, label:'Borgo Nuovo',                        val:29.2, classi:{c_conv:31.7, c_lin:39.1, c_cvx:29.2} },
            { rank:2, label:'Cruillas - S.Giovanni Apostolo',     val:28.1, classi:{c_conv:29.2, c_lin:42.7, c_cvx:28.1} },
            { rank:3, label:'Montepellegrino',                    val:28.0, classi:{c_conv:27.9, c_lin:44.1, c_cvx:28.0} },
            { rank:4, label:'Boccadifalco',                       val:26.8, classi:{c_conv:28.6, c_lin:44.5, c_cvx:26.8} },
            { rank:5, label:'Tommaso Natale - Sferracavallo',     val:25.5, classi:{c_conv:26.6, c_lin:47.9, c_cvx:25.5} },
            { rank:6, label:'Partanna Mondello',                  val:25.4, classi:{c_conv:28.5, c_lin:46.1, c_cvx:25.4} },
            { rank:7, label:'Resuttana - San Lorenzo',            val:23.9, classi:{c_conv:25.5, c_lin:50.5, c_cvx:23.9} },
            { rank:8, label:'Villagrazia - Falsomiele',           val:23.5, classi:{c_conv:25.7, c_lin:50.8, c_cvx:23.5} }
          ]
        });
      }
    },

    curvtotale: {
      icon: SVG_ICONS.curvature,
      title: 'Curvatura totale',
      layer: 'curvtotale-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La <strong>curvatura totale</strong> (Laplaciano) è la somma di curvatura planare e di profilo: ' +
          'sintetizza la complessità morfologica in un unico indice. ' +
          'Valori molto negativi (blu scuro) = superfici molto concave — zone di convergenza totale (flusso + deposito). ' +
          'Valori molto positivi (rosso) = superfici molto convesse — zone di massima dispersione e accelerazione. ' +
          'I valori centrali (giallo pallido) = terreno piano o a curvatura nulla.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-curvt',
          title: 'Curvatura totale',
          centerVal: '0,00',
          centerLabel: 'media',
          legendData: [
            { chartLabel: 'Molto concava < −0.27', label: 'Molto concava  < −0,27',        pct:  5, color: '#4575b4' },
            { chartLabel: 'Concava −0.27/−0.05',  label: 'Concava  −0,27 – −0,05',        pct: 20, color: '#91bfdb' },
            { chartLabel: 'Piana ±0.05',           label: 'Piana  −0,05 – +0,05',          pct: 50, color: '#ffffbf' },
            { chartLabel: 'Convessa +0.05/+0.27', label: 'Convessa  +0,05 – +0,27',        pct: 20, color: '#fc8d59' },
            { chartLabel: 'Molto conv. > +0.27',  label: 'Molto convessa  > +0,27',        pct:  5, color: '#d73027' }
          ],
          summaries: [
            { val: '50%', label: 'piana' },
            { val: '5%',  label: 'molto concava' },
            { val: '5%',  label: 'molto convessa' }
          ]
        });
        appendText(el,
          'La curvatura totale è la mappa geomorfologica più immediata per il pubblico generale: ' +
          'le aree rosse corrispondono a creste e speroni erosi, le aree blu a valli e conche di accumulo. ' +
          'Le aree gialle (pianura) dominano la Conca d\'Oro e il fronte costiero. ' +
          'Utile per carte del rischio combinato e comunicazione del paesaggio.'
        );

        var CT_CLASSES = [
          { key:'c_concava',  label:'Molto concava  < −0,27',  color:'#4575b4' },
          { key:'c_lbassa',   label:'Liev. concava  −0,27/−0,046', color:'#91bfdb' },
          { key:'c_piano',    label:'Piano  ±0,046',             color:'#ffffbf' },
          { key:'c_lalta',    label:'Liev. convessa  +0,046/+0,27', color:'#fc8d59' },
          { key:'c_convessa', label:'Molto convessa  > +0,27',  color:'#d73027' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni · pianura',
          subtitle: '% superficie piana',
          unit: '%',
          maxVal: 55.8,
          classes: CT_CLASSES,
          items: [
            { rank:1, label:'III · Oreto',        val:55.8, classi:{c_concava:3.9,  c_lbassa:18.1, c_piano:55.8, c_lalta:18.4, c_convessa:3.8} },
            { rank:2, label:'VI · Nord-Ovest',    val:53.1, classi:{c_concava:4.5,  c_lbassa:19.0, c_piano:53.1, c_lalta:19.0, c_convessa:4.5} },
            { rank:3, label:'V · Noce',           val:52.7, classi:{c_concava:4.7,  c_lbassa:19.0, c_piano:52.7, c_lalta:18.7, c_convessa:4.9} },
            { rank:4, label:'VII · Mondello',     val:51.7, classi:{c_concava:5.0,  c_lbassa:19.1, c_piano:51.7, c_lalta:19.3, c_convessa:4.9} },
            { rank:5, label:'VIII · Libertà',     val:48.5, classi:{c_concava:5.4,  c_lbassa:20.7, c_piano:48.5, c_lalta:20.2, c_convessa:5.2} },
            { rank:6, label:'IV · Mezzomonreale', val:47.3, classi:{c_concava:5.2,  c_lbassa:21.0, c_piano:47.3, c_lalta:21.3, c_convessa:5.1} },
            { rank:7, label:'II · Resuttana',     val:42.6, classi:{c_concava:6.4,  c_lbassa:21.9, c_piano:42.6, c_lalta:22.7, c_convessa:6.4} },
            { rank:8, label:'I · Centro Storico', val:32.2, classi:{c_concava:7.3,  c_lbassa:27.4, c_piano:32.2, c_lalta:25.7, c_convessa:7.4} }
          ]
        });
        appendRankingCard(el, {
          title: 'Top Quartieri · curvatura totale',
          subtitle: '% superficie piana',
          unit: '%',
          maxVal: 69.0,
          classes: CT_CLASSES,
          items: [
            { rank:1, label:'Boccadifalco',                       val:69.0, classi:{c_concava:1.8, c_lbassa:13.9, c_piano:69.0, c_lalta:13.5, c_convessa:1.8} },
            { rank:2, label:'Borgo Nuovo',                        val:68.4, classi:{c_concava:2.0, c_lbassa:14.1, c_piano:68.4, c_lalta:13.3, c_convessa:2.2} },
            { rank:3, label:'Montepellegrino',                    val:61.3, classi:{c_concava:3.3, c_lbassa:16.7, c_piano:61.3, c_lalta:15.9, c_convessa:2.9} },
            { rank:4, label:'Arenella - Vergine Maria',           val:60.6, classi:{c_concava:3.1, c_lbassa:17.1, c_piano:60.6, c_lalta:16.4, c_convessa:2.8} },
            { rank:5, label:'Villagrazia - Falsomiele',           val:58.8, classi:{c_concava:3.4, c_lbassa:17.1, c_piano:58.8, c_lalta:17.5, c_convessa:3.2} },
            { rank:6, label:'Partanna Mondello',                  val:55.6, classi:{c_concava:4.6, c_lbassa:17.7, c_piano:55.6, c_lalta:17.6, c_convessa:4.5} },
            { rank:7, label:'Resuttana - San Lorenzo',            val:54.1, classi:{c_concava:4.5, c_lbassa:18.3, c_piano:54.1, c_lalta:18.5, c_convessa:4.6} },
            { rank:8, label:'Tommaso Natale - Sferracavallo',     val:53.3, classi:{c_concava:4.6, c_lbassa:18.5, c_piano:53.3, c_lalta:19.1, c_convessa:4.5} }
          ]
        });
      }
    },

    rugosity: {
      icon: SVG_ICONS.rugosity,
      title: 'Rugosità (TRI)',
      layer: 'rugosita-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Il <strong>TRI (Terrain Ruggedness Index)</strong> misura la differenza media di quota ' +
          'tra ogni cella e le 8 celle circostanti: più alto il valore, più il terreno è irregolare. ' +
          'Media comunale <strong>3,05</strong>, con picchi fino a <strong>369</strong> sulle creste ' +
          'più frastagliate dei rilievi nord. Il 50% del territorio ha TRI 0–1 (pianura quasi piatta). ' +
          'La Circoscrizione I Centro Storico è la più regolare (TRI medio 0,67); ' +
          'la VII Mondello la più accidentata (4,19). ' +
          'Tra i quartieri, Arenella–Vergine Maria registra la rugosità più alta: TRI <strong>6,67</strong>.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-rugosity',
          title: 'Classi di rugosità (TRI)',
          centerVal: '3,05',
          centerLabel: 'TRI medio',
          legendData: [
            { chartLabel: 'Pianura 0–1',        label: '0–1  pianura',           pct: 50, color: '#3182bd' },
            { chartLabel: 'Ondulato 1–5',      label: '1–5  ondulato',          pct: 27, color: '#6baed6' },
            { chartLabel: 'Collinare 5–10',    label: '5–10  collinare',        pct: 19, color: '#ffffb2' },
            { chartLabel: 'Accidentato 10–25', label: '10–25  accidentato',     pct:  3, color: '#fd8d3c' },
            { chartLabel: 'Molto acc. >25',    label: '>25  molto accidentato', pct:  1, color: '#bd0026' }
          ],
          summaries: [
            { val: '3,05', label: 'TRI medio' },
            { val: '369', label: 'TRI max' },
            { val: '3,04', label: 'roughness' }
          ]
        });
        appendText(el,
          'La rugosità assoluta conferma la forte variabilità del paesaggio: ambienti lisci ' +
          'lungo la fascia costiera e la pianura, con picchi estremi sulle pareti rocciose dei rilievi nord.'
        );

        var TRI_CLASSES = [
          { key: 'c0_1',   label: '0–1',    color: '#3182bd' },
          { key: 'c1_5',   label: '1–5',    color: '#6baed6' },
          { key: 'c5_10',  label: '5–10',   color: '#ffffb2' },
          { key: 'c10_25', label: '10–25',  color: '#fd8d3c' },
          { key: 'c25',    label: '>25',    color: '#bd0026' }
        ];

        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'TRI medio',
          unit: '',
          maxVal: 4.19,
          classes: TRI_CLASSES,
          items: [
            { rank:1, label:'VII · Mondello',      val:4.19, classi:{c0_1:44.9, c1_5:24.7, c5_10:24.0, c10_25:4.2,  c25:2.1} },
            { rank:2, label:'III · Oreto',         val:3.69, classi:{c0_1:41.0, c1_5:25.3, c5_10:28.7, c10_25:4.6,  c25:0.4} },
            { rank:3, label:'V · Noce',            val:2.77, classi:{c0_1:45.7, c1_5:32.0, c5_10:19.9, c10_25:2.4,  c25:0.0} },
            { rank:4, label:'IV · Mezzomonreale',  val:2.76, classi:{c0_1:52.0, c1_5:23.4, c5_10:22.3, c10_25:2.2,  c25:0.1} },
            { rank:5, label:'VI · Nord-Ovest',     val:2.68, classi:{c0_1:41.5, c1_5:42.2, c5_10:14.2, c10_25:1.7,  c25:0.4} },
            { rank:6, label:'VIII · Libertà',      val:2.45, classi:{c0_1:57.3, c1_5:26.8, c5_10:12.4, c10_25:3.0,  c25:0.5} },
            { rank:7, label:'II · Resuttana',      val:2.26, classi:{c0_1:66.6, c1_5:18.0, c5_10:10.6, c10_25:4.2,  c25:0.6} },
            { rank:8, label:'I · Centro Storico',  val:0.67, classi:{c0_1:85.0, c1_5:14.3, c5_10:0.7,  c10_25:0.0,  c25:0.0} }
          ]
        });

        appendRankingCard(el, {
          title: 'Top Quartieri · rugosità (TRI)',
          subtitle: 'TRI medio',
          unit: '',
          maxVal: 6.67,
          classes: TRI_CLASSES,
          items: [
            { rank:1, label:'Arenella - Vergine Maria',     val:6.67, classi:{c0_1:31.4, c1_5:27.7, c5_10:32.1, c10_25:3.0, c25:5.8} },
            { rank:2, label:'Partanna Mondello',            val:5.49, classi:{c0_1:38.4, c1_5:21.6, c5_10:30.6, c10_25:6.1, c25:3.3} },
            { rank:3, label:'Boccadifalco',                 val:5.10, classi:{c0_1:19.0, c1_5:28.0, c5_10:47.9, c10_25:4.8, c25:0.3} },
            { rank:4, label:'Borgo Nuovo',                  val:4.16, classi:{c0_1:18.1, c1_5:45.8, c5_10:32.1, c10_25:3.9, c25:0.1} },
            { rank:5, label:'Villagrazia - Falsomiele',     val:4.02, classi:{c0_1:36.3, c1_5:26.4, c5_10:31.7, c10_25:5.1, c25:0.4} },
            { rank:6, label:'Montepellegrino',              val:3.85, classi:{c0_1:31.2, c1_5:42.1, c5_10:20.9, c10_25:4.9, c25:0.9} },
            { rank:7, label:'Brancaccio - Ciaculli',        val:3.45, classi:{c0_1:52.1, c1_5:21.6, c5_10:18.0, c10_25:7.2, c25:1.0} },
            { rank:8, label:'Tommaso Natale - Sferracavallo', val:2.99, classi:{c0_1:41.0, c1_5:33.7, c5_10:22.3, c10_25:2.9, c25:0.0} }
          ]
        });
      }
    },

    // ── Analisi idrologiche ────────────────────────────────────────────────

    twi: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M6 12c0-3.314 2.686-6 6-6s6 2.686 6 6"/><line x1="2" y1="17" x2="22" y2="17"/><path d="M8 17c0-2.21 1.79-4 4-4s4 1.79 4 4"/></svg>',
      title: 'TWI — Topographic Wetness Index',
      layer: 'twi-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Il <strong>Topographic Wetness Index (TWI)</strong> stima la propensione di ogni cella ad accumulare ' +
          'acqua superficiale: TWI = ln(A_s / tan β), dove A_s è l\'area contributiva specifica e β la pendenza. ' +
          'Valori elevati (blu scuro) indicano fondovalli, pianure e zone concave dove l\'acqua si raccoglie — ' +
          '<strong>aree a rischio alluvione e zone umide potenziali</strong>. ' +
          'Valori bassi (bianco/celeste chiaro) corrispondono a creste e versanti ripidi con drenaggio rapido. ' +
          'Il TWI è fondamentale per la valutazione del rischio idrogeologico urbano.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-twi',
          title: 'Classi TWI',
          centerVal: 'TWI',
          centerLabel: 'indice',
          legendData: [
            { chartLabel: 'Drenato < 6',      label: '< 6  drenato rapidamente',      pct: 15, color: '#f7fbff' },
            { chartLabel: 'Basso 6–9',         label: '6–9  bassa saturazione',        pct: 30, color: '#c6dbef' },
            { chartLabel: 'Medio 9–12',        label: '9–12  media — versanti',        pct: 35, color: '#6baed6' },
            { chartLabel: 'Alto 12–16',        label: '12–16  alta saturazione',       pct: 15, color: '#2171b5' },
            { chartLabel: 'Molto alto > 16',   label: '> 16  fondovalle/pianura',      pct:  5, color: '#08306b' }
          ],
          summaries: [
            { val: '~9', label: 'TWI medio' },
            { val: '5%', label: 'fondovalle' },
            { val: '15%', label: 'drenato' }
          ]
        });
        appendText(el,
          'Le pianure costiere e la Conca d\'Oro mostrano i TWI più elevati — aree storicamente soggette ad alluvioni. ' +
          'Le valli fluviali dell\'Oreto e del Gabriele emergono come corridoi ad alta saturazione potenziale. ' +
          'I rilievi dei Monti di Palermo presentano TWI molto bassi per l\'elevata pendenza e il drenaggio rapido.'
        );
        // RANK:twi

        var TWI_CLS = [
          { key: 'c_molto_basso', label: '< 4.5 (molto basso)', color: '#ffffcc' },
          { key: 'c_basso', label: '4.5÷5.7 (basso)', color: '#a1dab4' },
          { key: 'c_medio', label: '5.7÷6.9 (medio)', color: '#41b6c4' },
          { key: 'c_alto', label: '6.9÷10.3 (alto)', color: '#2c7fb8' },
          { key: 'c_molto_alto', label: '> 10.3 (molto alto)', color: '#253494' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'TWI medio',
          maxVal: 6.515,
          classes: TWI_CLS,
          items: [
            { rank: 1, label:'I · Centro Storico', val:6.515, classi:{c_molto_basso: 9.1, c_basso: 30.9, c_medio: 31.1, c_alto: 22.9, c_molto_alto: 6.0} },
            { rank: 2, label:'II · Resuttana', val:6.354, classi:{c_molto_basso: 16.5, c_basso: 25.8, c_medio: 27.2, c_alto: 23.9, c_molto_alto: 6.6} },
            { rank: 3, label:'VIII · Libertà', val:6.198, classi:{c_molto_basso: 19.6, c_basso: 25.4, c_medio: 26.6, c_alto: 22.6, c_molto_alto: 5.7} },
            { rank: 4, label:'V · Noce', val:5.948, classi:{c_molto_basso: 23.9, c_basso: 27.6, c_medio: 24.5, c_alto: 19.0, c_molto_alto: 5.0} },
            { rank: 5, label:'VI · Nord-Ovest', val:5.928, classi:{c_molto_basso: 24.6, c_basso: 27.1, c_medio: 23.9, c_alto: 19.9, c_molto_alto: 4.5} },
            { rank: 6, label:'IV · Mezzomonreale', val:5.893, classi:{c_molto_basso: 23.8, c_basso: 29.9, c_medio: 23.1, c_alto: 18.3, c_molto_alto: 4.8} },
            { rank: 7, label:'VII · Mondello', val:5.792, classi:{c_molto_basso: 26.3, c_basso: 27.2, c_medio: 23.6, c_alto: 18.2, c_molto_alto: 4.6} },
            { rank: 8, label:'III · Oreto', val:5.693, classi:{c_molto_basso: 28.9, c_basso: 28.3, c_medio: 21.5, c_alto: 16.7, c_molto_alto: 4.5} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'TWI medio',
          maxVal: 7.056,
          classes: TWI_CLS,
          items: [
            { rank: 1, label:'Politeama', val:7.056, classi:{c_molto_basso: 2.7, c_basso: 23.6, c_medio: 34.5, c_alto: 30.7, c_molto_alto: 8.4} },
            { rank: 2, label:'Malaspina - Palagonia', val:6.941, classi:{c_molto_basso: 2.8, c_basso: 25.0, c_medio: 35.9, c_alto: 28.0, c_molto_alto: 8.3} },
            { rank: 3, label:'Libertà', val:6.934, classi:{c_molto_basso: 4.0, c_basso: 26.2, c_medio: 34.9, c_alto: 26.8, c_molto_alto: 8.1} },
            { rank: 4, label:'Noce', val:6.92, classi:{c_molto_basso: 2.2, c_basso: 27.7, c_medio: 35.9, c_alto: 25.9, c_molto_alto: 8.4} },
            { rank: 5, label:'Settecannoli', val:6.803, classi:{c_molto_basso: 6.7, c_basso: 26.7, c_medio: 31.4, c_alto: 27.4, c_molto_alto: 7.8} },
            { rank: 6, label:'Altarello', val:6.795, classi:{c_molto_basso: 5.3, c_basso: 31.4, c_medio: 30.8, c_alto: 23.5, c_molto_alto: 9.1} },
            { rank: 7, label:'Uditore - Passo di Rigano', val:6.769, classi:{c_molto_basso: 6.2, c_basso: 30.8, c_medio: 31.0, c_alto: 24.0, c_molto_alto: 8.1} },
            { rank: 8, label:'Zisa', val:6.75, classi:{c_molto_basso: 5.8, c_basso: 29.5, c_medio: 32.2, c_alto: 24.5, c_molto_alto: 8.1} }
        ]
        });

      }
    },

    flowacc: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 7 17 3 3 3 3 17"/><polyline points="7 17 3 17"/><path d="M22 22 L17 17 M17 17 L12 22 M17 17 L22 12 M17 17 L3 17"/><circle cx="17" cy="17" r="2" fill="currentColor"/></svg>',
      title: 'Flow Accumulation — reticolo idrografico',
      layer: 'flowacc-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La <strong>flow accumulation</strong> conta il numero di celle del DTM che drenano verso ciascun punto ' +
          'seguendo la direzione di flusso D8 (massima pendenza). Visualizzata in scala logaritmica, ' +
          'rivela il <strong>reticolo idrografico potenziale</strong> derivato unicamente dalla morfologia — ' +
          'senza dati di portata o di rete idrografica ufficiale. ' +
          'Le linee blu scuro corrispondono agli assi di drenaggio principali, ' +
          'le aree bianche ai versanti con contributo minimo.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-flowacc',
          title: 'Log₁₀ celle contribuenti',
          centerVal: 'acc',
          centerLabel: 'log₁₀',
          legendData: [
            { chartLabel: 'Versante 0–1', label: '1–10 celle   versante',           pct: 40, color: '#f7fbff' },
            { chartLabel: 'Interfl. 1–2', label: '10–100 celle  interfluvi',        pct: 30, color: '#c6dbef' },
            { chartLabel: 'Rill. 2–3',    label: '100–1000 celle  rilleni',         pct: 20, color: '#6baed6' },
            { chartLabel: 'Stream 3–4',   label: '1.000–10.000 celle  corsi d\'acqua', pct: 8, color: '#2171b5' },
            { chartLabel: 'Asta > 4',     label: '> 10.000 celle  aste principali', pct: 2, color: '#08306b' }
          ],
          summaries: [
            { val: '~1,5M', label: 'max celle' },
            { val: '500', label: 'soglia km²' },
            { val: '2%', label: 'rete idrografica' }
          ]
        });
        appendText(el,
          'Soglia di 500 celle (~0,012 km²) per la definizione del reticolo. ' +
          'I corsi d\'acqua principali identificati coincidono con i valloni storici di Palermo: ' +
          'Oreto, Gabriele, Eleuterio e i torrenti dei Monti di Palermo. ' +
          'Il reticolo potenziale è fondamentale per il dimensionamento dei collettori fognari.'
        );
        // RANK:flow_acc

        var FLOW_ACC_CLS = [
          { key: 'c_disperso', label: '< 0.7 (disperso)', color: '#f7fbff' },
          { key: 'c_rill', label: '0.7÷1.3 (rill)', color: '#c6dbef' },
          { key: 'c_canale', label: '1.3÷2.4 (canale)', color: '#6baed6' },
          { key: 'c_torrente', label: '2.4÷4.0 (torrente)', color: '#2171b5' },
          { key: 'c_fiume', label: '> 4.0 (fiume)', color: '#084594' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'Accumulo medio',
          unit: ' log10',
          maxVal: 0.978,
          classes: FLOW_ACC_CLS,
          items: [
            { rank: 1, label:'III · Oreto', val:0.978, classi:{c_disperso: 49.4, c_rill: 24.8, c_canale: 20.6, c_torrente: 4.4, c_fiume: 0.8} },
            { rank: 2, label:'V · Noce', val:0.978, classi:{c_disperso: 51.0, c_rill: 23.3, c_canale: 20.0, c_torrente: 4.6, c_fiume: 1.0} },
            { rank: 3, label:'VI · Nord-Ovest', val:0.973, classi:{c_disperso: 50.0, c_rill: 24.5, c_canale: 20.2, c_torrente: 4.5, c_fiume: 0.7} },
            { rank: 4, label:'VII · Mondello', val:0.967, classi:{c_disperso: 51.4, c_rill: 22.7, c_canale: 20.5, c_torrente: 4.7, c_fiume: 0.6} },
            { rank: 5, label:'IV · Mezzomonreale', val:0.931, classi:{c_disperso: 53.9, c_rill: 22.4, c_canale: 18.8, c_torrente: 4.2, c_fiume: 0.6} },
            { rank: 6, label:'VIII · Libertà', val:0.914, classi:{c_disperso: 55.1, c_rill: 23.1, c_canale: 16.8, c_torrente: 4.3, c_fiume: 0.7} },
            { rank: 7, label:'II · Resuttana', val:0.906, classi:{c_disperso: 56.6, c_rill: 21.8, c_canale: 16.2, c_torrente: 4.7, c_fiume: 0.7} },
            { rank: 8, label:'I · Centro Storico', val:0.8, classi:{c_disperso: 65.2, c_rill: 20.3, c_canale: 10.3, c_torrente: 3.0, c_fiume: 1.2} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'Accumulo medio',
          unit: ' log10',
          maxVal: 1.079,
          classes: FLOW_ACC_CLS,
          items: [
            { rank: 1, label:'Borgo Nuovo', val:1.079, classi:{c_disperso: 41.2, c_rill: 27.1, c_canale: 26.2, c_torrente: 4.8, c_fiume: 0.7} },
            { rank: 2, label:'Boccadifalco', val:1.063, classi:{c_disperso: 40.9, c_rill: 27.1, c_canale: 27.5, c_torrente: 4.1, c_fiume: 0.4} },
            { rank: 3, label:'Arenella - Vergine Maria', val:1.051, classi:{c_disperso: 43.7, c_rill: 25.0, c_canale: 25.9, c_torrente: 5.2, c_fiume: 0.2} },
            { rank: 4, label:'Tommaso Natale - Sferracavallo', val:1.001, classi:{c_disperso: 50.4, c_rill: 21.8, c_canale: 21.8, c_torrente: 5.3, c_fiume: 0.7} },
            { rank: 5, label:'Villagrazia - Falsomiele', val:0.997, classi:{c_disperso: 47.5, c_rill: 25.5, c_canale: 21.8, c_torrente: 4.4, c_fiume: 0.8} },
            { rank: 6, label:'Brancaccio - Ciaculli', val:0.983, classi:{c_disperso: 50.2, c_rill: 24.2, c_canale: 19.7, c_torrente: 5.1, c_fiume: 0.8} },
            { rank: 7, label:'Montepellegrino', val:0.98, classi:{c_disperso: 47.8, c_rill: 26.1, c_canale: 21.4, c_torrente: 4.2, c_fiume: 0.4} },
            { rank: 8, label:'Resuttana - San Lorenzo', val:0.977, classi:{c_disperso: 50.0, c_rill: 23.9, c_canale: 20.8, c_torrente: 4.6, c_fiume: 0.7} }
        ]
        });

      }
    },

    bacini: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 2 17 12 22 22 17 22 7 12 2"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="7" x2="22" y2="7"/><line x1="2" y1="17" x2="22" y2="17"/></svg>',
      title: 'Bacini idrografici',
      layer: 'bacini-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La <strong>delineazione automatica dei bacini idrografici</strong> partiziona il territorio comunale ' +
          'in <strong>28 sottobacini versanti</strong>, ciascuno corrispondente a un\'area che drena verso ' +
          'un\'unica sezione del reticolo idrografico. Ogni bacino è identificato da un colore categorico distinto. ' +
          'La delineazione si basa sull\'algoritmo D8 applicato al DTM pit-filled, con soglia di accumulo ' +
          'di 500 celle (~0,012 km²) per la definizione del reticolo di riferimento. ' +
          'Fondamentale per la <strong>gestione delle acque urbane</strong> e il dimensionamento dei collettori fognari.'
        );
        appendTable(el,
          ['Caratteristica', 'Valore'],
          [
            ['Numero sottobacini', '28'],
            ['Soglia reticolo', '500 celle ≈ 0,012 km²'],
            ['Metodo delineazione', 'D8 watershed su DTM pit-filled'],
            ['Bacini principali', 'Oreto, Gabriele, Eleuterio'],
            ['Utilizzo', 'Gestione acque urbane · collettori fognari']
          ]
        );
        appendText(el,
          'I bacini principali corrispondono ai bacini idrografici storici: Oreto (sud-ovest), ' +
          'Gabriele (nord-est), Eleuterio (est) e i numerosi valloni minori dei Monti di Palermo. ' +
          'Le zone pianeggianti costiere tendono a formare bacini ampi con reticolo poco gerarchizzato. ' +
          'Ogni bacino rappresenta un\'unità idrologica per la pianificazione del rischio alluvione.'
        );
      }
    },

    spi: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6 Q8 2 12 6 Q16 10 21 6"/><path d="M3 12 Q8 8 12 12 Q16 16 21 12"/><path d="M3 18 Q8 14 12 18 Q16 22 21 18"/><line x1="3" y1="22" x2="21" y2="22"/></svg>',
      title: 'SPI — Stream Power Index',
      layer: 'spi-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Lo <strong>Stream Power Index (SPI)</strong> misura il potenziale erosivo dei corsi d\'acqua: ' +
          'SPI = ln(A_s × tan β), dove A_s è l\'area contributiva specifica e β la pendenza. ' +
          'Combina la quantità d\'acqua che transita in un punto con la velocità con cui si muove: ' +
          'valori elevati (rosso) indicano aree ad alto potenziale di <strong>erosione e trasporto solido</strong>, ' +
          'tipicamente nei fondovalli incisi ad alta pendenza. ' +
          'Valori bassi (giallo) nelle pianure dove l\'acqua è abbondante ma lenta.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-spi',
          title: 'Classi SPI',
          centerVal: 'SPI',
          centerLabel: 'indice',
          legendData: [
            { chartLabel: 'Basso < 4',    label: '< 4  bassa energia erosiva',     pct: 30, color: '#ffffcc' },
            { chartLabel: 'Medio 4–7',    label: '4–7  energia moderata',          pct: 35, color: '#feb24c' },
            { chartLabel: 'Alto 7–10',    label: '7–10  alta energia erosiva',     pct: 25, color: '#f03b20' },
            { chartLabel: 'Estremo > 10', label: '> 10  potenziale estremo',       pct: 10, color: '#bd0026' }
          ],
          summaries: [
            { val: '35%', label: 'media energia' },
            { val: '10%', label: 'estremo' },
            { val: '30%', label: 'bassa energia' }
          ]
        });
        appendText(el,
          'Le valli incise dei Monti di Palermo (Gabriele, Eleuterio) mostrano gli SPI più elevati: ' +
          'alta pendenza + grande area contributiva = massimo potenziale erosivo. ' +
          'L\'SPI è usato nella progettazione di opere di difesa del suolo e nella valutazione ' +
          'del rischio di colate detritiche e trasporto solido.'
        );
        // RANK:spi

        var SPI_CLS = [
          { key: 'c_bassa', label: '< -1 (bassa)', color: '#2166ac' },
          { key: 'c_medio_bassa', label: '−1÷1 (medio-bassa)', color: '#74add1' },
          { key: 'c_media', label: '1÷3 (media)', color: '#fee090' },
          { key: 'c_alta', label: '3÷5.5 (alta)', color: '#f46d43' },
          { key: 'c_molto_alta', label: '> 5.5 (molto alta)', color: '#d73027' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'SPI medio',
          unit: ' log',
          maxVal: 1.471,
          classes: SPI_CLS,
          items: [
            { rank: 1, label:'III · Oreto', val:1.471, classi:{c_bassa: 19.9, c_medio_bassa: 25.0, c_media: 25.0, c_alta: 24.6, c_molto_alta: 5.6} },
            { rank: 2, label:'VII · Mondello', val:1.299, classi:{c_bassa: 23.8, c_medio_bassa: 24.6, c_media: 22.6, c_alta: 22.7, c_molto_alta: 6.4} },
            { rank: 3, label:'VI · Nord-Ovest', val:1.203, classi:{c_bassa: 21.8, c_medio_bassa: 26.8, c_media: 26.5, c_alta: 20.0, c_molto_alta: 4.8} },
            { rank: 4, label:'V · Noce', val:1.197, classi:{c_bassa: 23.6, c_medio_bassa: 26.1, c_media: 24.4, c_alta: 20.3, c_molto_alta: 5.6} },
            { rank: 5, label:'IV · Mezzomonreale', val:1.005, classi:{c_bassa: 25.2, c_medio_bassa: 29.1, c_media: 22.4, c_alta: 18.5, c_molto_alta: 4.8} },
            { rank: 6, label:'VIII · Libertà', val:0.615, classi:{c_bassa: 30.9, c_medio_bassa: 28.1, c_media: 21.7, c_alta: 15.4, c_molto_alta: 4.0} },
            { rank: 7, label:'II · Resuttana', val:0.4, classi:{c_bassa: 34.7, c_medio_bassa: 29.6, c_media: 17.8, c_alta: 14.2, c_molto_alta: 3.8} },
            { rank: 8, label:'I · Centro Storico', val:-0.328, classi:{c_bassa: 40.2, c_medio_bassa: 41.0, c_media: 13.2, c_alta: 3.9, c_molto_alta: 1.8} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'SPI medio',
          unit: ' log',
          maxVal: 2.46,
          classes: SPI_CLS,
          items: [
            { rank: 1, label:'Boccadifalco', val:2.46, classi:{c_bassa: 7.7, c_medio_bassa: 18.3, c_media: 31.9, c_alta: 34.1, c_molto_alta: 8.0} },
            { rank: 2, label:'Borgo Nuovo', val:2.289, classi:{c_bassa: 8.1, c_medio_bassa: 20.5, c_media: 33.5, c_alta: 30.3, c_molto_alta: 7.6} },
            { rank: 3, label:'Arenella - Vergine Maria', val:2.068, classi:{c_bassa: 13.5, c_medio_bassa: 23.1, c_media: 24.0, c_alta: 30.6, c_molto_alta: 8.8} },
            { rank: 4, label:'Villagrazia - Falsomiele', val:1.686, classi:{c_bassa: 16.9, c_medio_bassa: 23.9, c_media: 26.4, c_alta: 26.9, c_molto_alta: 5.9} },
            { rank: 5, label:'Partanna Mondello', val:1.6, classi:{c_bassa: 21.4, c_medio_bassa: 20.3, c_media: 24.2, c_alta: 27.1, c_molto_alta: 7.0} },
            { rank: 6, label:'Montepellegrino', val:1.561, classi:{c_bassa: 15.9, c_medio_bassa: 24.3, c_media: 30.9, c_alta: 23.6, c_molto_alta: 5.3} },
            { rank: 7, label:'Tommaso Natale - Sferracavallo', val:1.412, classi:{c_bassa: 20.3, c_medio_bassa: 27.1, c_media: 24.4, c_alta: 21.6, c_molto_alta: 6.6} },
            { rank: 8, label:'Cruillas - S.Giovanni Apostolo', val:1.252, classi:{c_bassa: 20.2, c_medio_bassa: 26.9, c_media: 28.9, c_alta: 19.5, c_molto_alta: 4.6} }
        ]
        });

      }
    },

    dtw: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 L12 12"/><circle cx="12" cy="16" r="4" fill="none"/><line x1="4" y1="22" x2="20" y2="22"/><path d="M4 10 Q8 6 12 10 Q16 14 20 10" stroke-dasharray="3,2"/></svg>',
      title: 'Depth-to-Water — profondità falda',
      layer: 'dtw-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Il <strong>Depth-to-Water (DTW)</strong> stima la profondità relativa della falda freatica ' +
          'basandosi sulla morfologia del terreno (metodo HAND — Height Above Nearest Drainage). ' +
          'Ogni cella misura la <strong>quota sul punto di drenaggio più vicino</strong> nel proprio bacino: ' +
          'valori bassi (verde) indicano aree con falda vicina alla superficie — fondovalli, aree alluvionali, ' +
          'pianure costiere. Valori alti (rosso) corrispondono a rilievi con falda profonda. ' +
          'Utile per la pianificazione di scavi, fondazioni e per la valutazione del rischio ' +
          'di <strong>allagamento dei piani interrati</strong>.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-dtw',
          title: 'Classi DTW (HAND)',
          centerVal: 'DTW',
          centerLabel: 'indice',
          legendData: [
            { chartLabel: 'Falda alta 0–2',   label: '0–2  falda superficiale',   pct: 20, color: '#00682c' },
            { chartLabel: 'Bassa 2–4',        label: '2–4  falda sub-superficiale',pct: 25, color: '#31a354' },
            { chartLabel: 'Media 4–6',        label: '4–6  falda intermedia',      pct: 30, color: '#aedea7' },
            { chartLabel: 'Profonda 6–8',     label: '6–8  falda profonda',        pct: 15, color: '#fd8d3c' },
            { chartLabel: 'Molto prof. > 8',  label: '> 8  falda molto profonda',  pct: 10, color: '#800026' }
          ],
          summaries: [
            { val: '20%', label: 'falda alta' },
            { val: '30%', label: 'intermedia' },
            { val: '10%', label: 'molto profonda' }
          ]
        });
        appendText(el,
          'La pianura costiera e la Conca d\'Oro mostrano DTW bassi: falda freatica spesso entro 2–5 m, ' +
          'con rischi di allagamento di scantinati e piani interrati. ' +
          'Le zone collinari e montane dei Monti di Palermo hanno DTW elevati (> 50 m sulle creste). ' +
          'Il metodo HAND fornisce una stima relativa — per valori assoluti servono dati piezometrici.'
        );
        // RANK:dtw

        var DTW_CLS = [
          { key: 'c_superficiale', label: '< 0.17 m (superficiale)', color: '#253494' },
          { key: 'c_bassa', label: '0.17÷0.47 m (bassa)', color: '#2c7fb8' },
          { key: 'c_media', label: '0.47÷4.7 m (media)', color: '#41b6c4' },
          { key: 'c_alta', label: '4.7÷7.2 m (alta)', color: '#a1dab4' },
          { key: 'c_profonda', label: '> 7.2 m (profonda)', color: '#ffffcc' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'Profondità media (m)',
          unit: ' m',
          maxVal: 3.181,
          classes: DTW_CLS,
          items: [
            { rank: 1, label:'II · Resuttana', val:0.156, classi:{c_superficiale: 57.1, c_bassa: 42.9, c_media: 0.0, c_alta: 0.0, c_profonda: 0.0} },
            { rank: 2, label:'VII · Mondello', val:2.218, classi:{c_superficiale: 0.0, c_bassa: 0.0, c_media: 100.0, c_alta: 0.0, c_profonda: 0.0} },
            { rank: 3, label:'VIII · Libertà', val:3.181, classi:{c_superficiale: 9.7, c_bassa: 15.9, c_media: 37.4, c_alta: 29.8, c_profonda: 7.2} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'Profondità media (m)',
          unit: ' m',
          maxVal: 3.181,
          classes: DTW_CLS,
          items: [
            { rank: 1, label:'Settecannoli', val:0.156, classi:{c_superficiale: 57.1, c_bassa: 42.9, c_media: 0.0, c_alta: 0.0, c_profonda: 0.0} },
            { rank: 2, label:'Arenella - Vergine Maria', val:2.218, classi:{c_superficiale: 0.0, c_bassa: 0.0, c_media: 100.0, c_alta: 0.0, c_profonda: 0.0} },
            { rank: 3, label:'Montepellegrino', val:3.181, classi:{c_superficiale: 9.7, c_bassa: 15.9, c_media: 37.4, c_alta: 29.8, c_profonda: 7.2} }
        ]
        });

      }
    },

    // ── Potenziale fotovoltaico ──────────────────────────────────────────────
    fotovoltaico: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="1"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="7" y1="7" x2="17" y2="7"/><line x1="7" y1="11" x2="17" y2="11"/></svg>',
      title: 'Potenziale fotovoltaico',
      layer: 'fotovoltaico-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Il <strong>Potenziale Fotovoltaico</strong> stima l\'idoneità del territorio all\'installazione ' +
          'di impianti FV su tetto, combinando tre fattori: ' +
          '(1) <strong>Indice di Radiazione Solare (SRI)</strong> — quantità di energia solare disponibile; ' +
          '(2) <strong>fattore aspetto</strong> — massimo per esposizione Sud (1,0), minimo per Nord (0,5) — ' +
          'anche i tetti non idealmente orientati rimangono utilizzabili; ' +
          '(3) <strong>fattore zona</strong> — priorità alle aree sotto i 200 m (densamente urbanizzate). ' +
          'La <strong>media comunale è 0,41</strong>; il <strong>5,9%</strong> del territorio raggiunge ' +
          'valori ottimali (> 0,60): versanti collinari meridionali tra 50 e 200 m di quota.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-fv',
          title: 'Distribuzione potenziale FV',
          centerVal: '0,41',
          centerLabel: 'media',
          legendData: [
            { chartLabel: 'Basso 0–0.2',     label: '0,0–0,2  basso (N, ombra)',     pct: 10, color: '#440154' },
            { chartLabel: 'Modesto 0.2–0.3', label: '0,2–0,3  modesto',              pct: 14, color: '#3e6f8e' },
            { chartLabel: 'Medio 0.3–0.4',   label: '0,3–0,4  medio',               pct: 20, color: '#26808e' },
            { chartLabel: 'Buono 0.4–0.5',   label: '0,4–0,5  buono',               pct: 22, color: '#35b779' },
            { chartLabel: 'Alto 0.5–0.6',    label: '0,5–0,6  alto (S, pianura)',   pct: 28, color: '#b4de2c' },
            { chartLabel: 'Ottimo > 0.6',    label: '> 0,6  ottimale (S/SE, colle)',pct:  6, color: '#fde725' }
          ],
          summaries: [
            { val: '0,41', label: 'media comunale' },
            { val: '5,9%', label: 'ottimale > 0,6' },
            { val: '34%',  label: 'buono/alto' }
          ]
        });
        appendText(el,
          'Le zone di massimo potenziale (giallo) corrispondono ai versanti collinari ' +
          'meridionali tra Mezzomonreale, Boccadifalco e Cruillas: esposizione a Sud, ' +
          'quota 50–200 m, radiazione elevata. La pianura costiera (Centro Storico, Brancaccio) ' +
          'ha potenziale buono grazie all\'alta radiazione, nonostante l\'orientamento variabile dei tetti. ' +
          'Questa mappa supporta la pianificazione degli impianti FV per il PNRR — Comunità Energetiche.'
        );
        // RANK:fv

        var FV_CLS = [
          { key: 'c_scarso', label: '< 0.31 (scarso)', color: '#d73027' },
          { key: 'c_basso', label: '0.31÷0.42 (basso)', color: '#fc8d59' },
          { key: 'c_medio', label: '0.42÷0.54 (medio)', color: '#fee090' },
          { key: 'c_buono', label: '0.54÷0.61 (buono)', color: '#91cf60' },
          { key: 'c_ottimo', label: '> 0.61 (ottimo)', color: '#1a9850' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'Indice FV medio',
          maxVal: 0.494,
          classes: FV_CLS,
          items: [
            { rank: 1, label:'I · Centro Storico', val:0.494, classi:{c_scarso: 0.1, c_basso: 27.7, c_medio: 31.8, c_buono: 29.8, c_ottimo: 10.6} },
            { rank: 2, label:'II · Resuttana', val:0.477, classi:{c_scarso: 12.8, c_basso: 14.0, c_medio: 23.9, c_buono: 33.4, c_ottimo: 15.9} },
            { rank: 3, label:'VII · Mondello', val:0.42, classi:{c_scarso: 18.7, c_basso: 27.1, c_medio: 28.9, c_buono: 18.0, c_ottimo: 7.3} },
            { rank: 4, label:'VIII · Libertà', val:0.41, classi:{c_scarso: 17.4, c_basso: 39.5, c_medio: 24.2, c_buono: 13.4, c_ottimo: 5.5} },
            { rank: 5, label:'IV · Mezzomonreale', val:0.407, classi:{c_scarso: 25.3, c_basso: 21.7, c_medio: 31.1, c_buono: 20.8, c_ottimo: 1.0} },
            { rank: 6, label:'III · Oreto', val:0.387, classi:{c_scarso: 31.6, c_basso: 15.6, c_medio: 25.6, c_buono: 24.3, c_ottimo: 3.0} },
            { rank: 7, label:'V · Noce', val:0.371, classi:{c_scarso: 35.6, c_basso: 21.7, c_medio: 23.9, c_buono: 17.0, c_ottimo: 1.8} },
            { rank: 8, label:'VI · Nord-Ovest', val:0.355, classi:{c_scarso: 35.5, c_basso: 33.5, c_medio: 21.0, c_buono: 8.6, c_ottimo: 1.5} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'Indice FV medio',
          maxVal: 0.535,
          classes: FV_CLS,
          items: [
            { rank: 1, label:'Settecannoli', val:0.535, classi:{c_scarso: 0.1, c_basso: 14.9, c_medio: 24.1, c_buono: 39.2, c_ottimo: 21.6} },
            { rank: 2, label:'Politeama', val:0.523, classi:{c_scarso: 0.0, c_basso: 15.5, c_medio: 32.6, c_buono: 37.2, c_ottimo: 14.7} },
            { rank: 3, label:'Noce', val:0.517, classi:{c_scarso: 0.1, c_basso: 16.3, c_medio: 36.1, c_buono: 35.7, c_ottimo: 11.9} },
            { rank: 4, label:'Oreto - Stazione', val:0.515, classi:{c_scarso: 0.4, c_basso: 19.0, c_medio: 31.0, c_buono: 34.2, c_ottimo: 15.4} },
            { rank: 5, label:'Pallavicino', val:0.51, classi:{c_scarso: 0.5, c_basso: 18.4, c_medio: 33.9, c_buono: 33.6, c_ottimo: 13.5} },
            { rank: 6, label:'Malaspina - Palagonia', val:0.503, classi:{c_scarso: 0.0, c_basso: 21.2, c_medio: 38.5, c_buono: 27.7, c_ottimo: 12.6} },
            { rank: 7, label:'Zisa', val:0.501, classi:{c_scarso: 0.3, c_basso: 19.7, c_medio: 41.2, c_buono: 31.5, c_ottimo: 7.3} },
            { rank: 8, label:'Montegrappa - S. Rosalia', val:0.499, classi:{c_scarso: 0.5, c_basso: 20.9, c_medio: 38.9, c_buono: 31.9, c_ottimo: 7.7} }
        ]
        });

      }
    },

    // ── Ombreggiamento estivo ────────────────────────────────────────────────
    ombraestiva: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
      title: 'Ombreggiamento estivo (21 giugno)',
      layer: 'ombra-estiva-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La mappa mostra l\'<strong>ombra media</strong> proiettata dal rilievo nelle tre ore chiave ' +
          'del solstizio d\'estate (<strong>21 giugno</strong>): ore 9, 12 e 15 CEST. ' +
          'Posizioni solari calcolate per Palermo (φ = 38,1°N): ' +
          '<strong>ore 9</strong> — altitudine 36°, azimuth 87° (quasi Est); ' +
          '<strong>ore 12</strong> — altitudine 70°, azimuth 131° (SE); ' +
          '<strong>ore 15</strong> — altitudine 62°, azimuth 247° (SO). ' +
          'Il <strong>92,3%</strong> del territorio è prevalentemente soleggiato in estate (classe giallo-chiaro): ' +
          'il sole alto estivo illumina quasi tutta la città. Solo le forre strette dei Monti di Palermo ' +
          'rimangono in ombra (0,6% classe marrone scuro). ' +
          'Utile per la progettazione di <strong>verde urbano</strong> e spazi pubblici estivi.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-ombraest',
          title: 'Distribuzione ombra estiva',
          centerVal: '56',
          centerLabel: 'media',
          legendData: [
            { chartLabel: 'Piena luce', label: 'piena luce (val. basso)',   pct: 92, color: '#fff7bc' },
            { chartLabel: 'Luce parz.', label: 'luce parziale',            pct:  6, color: '#fe9929' },
            { chartLabel: 'Semi-ombra', label: 'semi-ombra',               pct:  1, color: '#cc4c02' },
            { chartLabel: 'Ombra',      label: 'ombra (forre/incisioni)',  pct:  1, color: '#7f2704' }
          ],
          summaries: [
            { val: '92%', label: 'soleggiato' },
            { val: '0,6%', label: 'in ombra' },
            { val: '70°', label: 'alt. max ore 12' }
          ]
        });
        appendText(el,
          'In estate l\'alto angolo solare (fino a 70° a mezzogiorno) minimizza le ombre portate. ' +
          'Le poche zone d\'ombra si concentrano nelle incisioni vallive dei Monti di Palermo ' +
          '(Boccadifalco-Baida, val di Mazara) e nei canyon urbani del Centro Storico. ' +
          'Confronta con l\'ombreggiamento invernale per valutare la variazione stagionale.'
        );
        // RANK:ombra_e

        var OMBRA_E_CLS = [
          { key: 'c_ombra_forte', label: '< 80 (forte ombra)', color: '#2166ac' },
          { key: 'c_ombra_parz', label: '80÷170 (parziale)', color: '#74add1' },
          { key: 'c_semi_luce', label: '170÷250 (semi-luce)', color: '#fdae61' },
          { key: 'c_piena_luce', label: '> 250 (piena luce)', color: '#d73027' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'Irradiazione media',
          maxVal: 66.008,
          classes: OMBRA_E_CLS,
          items: [
            { rank: 1, label:'III · Oreto', val:66.008, classi:{c_ombra_forte: 77.4, c_ombra_parz: 21.8, c_semi_luce: 0.3, c_piena_luce: 0.6} },
            { rank: 2, label:'VII · Mondello', val:59.559, classi:{c_ombra_forte: 89.6, c_ombra_parz: 8.3, c_semi_luce: 1.1, c_piena_luce: 0.9} },
            { rank: 3, label:'II · Resuttana', val:57.764, classi:{c_ombra_forte: 93.0, c_ombra_parz: 5.3, c_semi_luce: 0.3, c_piena_luce: 1.4} },
            { rank: 4, label:'VIII · Libertà', val:57.672, classi:{c_ombra_forte: 92.4, c_ombra_parz: 5.8, c_semi_luce: 0.2, c_piena_luce: 1.5} },
            { rank: 5, label:'IV · Mezzomonreale', val:53.72, classi:{c_ombra_forte: 96.5, c_ombra_parz: 2.5, c_semi_luce: 0.0, c_piena_luce: 1.0} },
            { rank: 6, label:'I · Centro Storico', val:53.451, classi:{c_ombra_forte: 98.2, c_ombra_parz: 0.0, c_semi_luce: 0.0, c_piena_luce: 1.7} },
            { rank: 7, label:'V · Noce', val:52.314, classi:{c_ombra_forte: 96.9, c_ombra_parz: 3.0, c_semi_luce: 0.0, c_piena_luce: 0.1} },
            { rank: 8, label:'VI · Nord-Ovest', val:51.599, classi:{c_ombra_forte: 97.3, c_ombra_parz: 2.4, c_semi_luce: 0.1, c_piena_luce: 0.2} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'Irradiazione media',
          maxVal: 67.795,
          classes: OMBRA_E_CLS,
          items: [
            { rank: 1, label:'Villagrazia - Falsomiele', val:67.795, classi:{c_ombra_forte: 74.8, c_ombra_parz: 24.3, c_semi_luce: 0.3, c_piena_luce: 0.6} },
            { rank: 2, label:'Partanna Mondello', val:64.209, classi:{c_ombra_forte: 83.1, c_ombra_parz: 13.8, c_semi_luce: 2.1, c_piena_luce: 1.0} },
            { rank: 3, label:'Arenella - Vergine Maria', val:62.332, classi:{c_ombra_forte: 89.1, c_ombra_parz: 6.4, c_semi_luce: 0.4, c_piena_luce: 4.1} },
            { rank: 4, label:'Montepellegrino', val:62.302, classi:{c_ombra_forte: 87.7, c_ombra_parz: 9.8, c_semi_luce: 0.4, c_piena_luce: 2.1} },
            { rank: 5, label:'Brancaccio - Ciaculli', val:59.519, classi:{c_ombra_forte: 89.7, c_ombra_parz: 9.1, c_semi_luce: 0.5, c_piena_luce: 0.7} },
            { rank: 6, label:'Boccadifalco', val:57.424, classi:{c_ombra_forte: 93.1, c_ombra_parz: 5.5, c_semi_luce: 0.1, c_piena_luce: 1.3} },
            { rank: 7, label:'Tribunali-Castellammare', val:56.39, classi:{c_ombra_forte: 96.8, c_ombra_parz: 0.0, c_semi_luce: 0.0, c_piena_luce: 3.2} },
            { rank: 8, label:'Settecannoli', val:55.576, classi:{c_ombra_forte: 97.5, c_ombra_parz: 0.0, c_semi_luce: 0.0, c_piena_luce: 2.5} }
        ]
        });

      }
    },

    // ── Ombreggiamento invernale ─────────────────────────────────────────────
    ombrainvernale: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="18" x2="16" y2="18"/></svg>',
      title: 'Ombreggiamento invernale (21 dicembre)',
      layer: 'ombra-invernale-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La mappa mostra l\'<strong>ombra media</strong> del solstizio d\'inverno (<strong>21 dicembre</strong>): ' +
          'ore 9, 12 e 15 CET. Posizioni solari per Palermo (φ = 38,1°N): ' +
          '<strong>ore 9</strong> — altitudine 15°, azimuth 137° (SE); ' +
          '<strong>ore 12</strong> — altitudine 28°, azimuth 178° (quasi S); ' +
          '<strong>ore 15</strong> — altitudine 16°, azimuth 221° (SO). ' +
          'Il sole basso invernale (max 28°) genera <strong>ombre lunghe</strong>: il <strong>18,5%</strong> del ' +
          'territorio è quasi sempre in ombra (classe blu scuro), concentrato sui versanti settentrionali ' +
          'dei rilievi. Il <strong>76%</strong> è nella fascia di semi-ombra (blu chiaro). ' +
          'Critico per la <strong>progettazione del verde urbano invernale</strong>, la localizzazione ' +
          'di piste ciclabili e aree di sosta al sole.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-ombrainv',
          title: 'Distribuzione ombra invernale',
          centerVal: '174',
          centerLabel: 'media',
          legendData: [
            { chartLabel: 'Soleggiato', label: 'soleggiato (versanti S)',  pct:  5, color: '#c6dbef' },
            { chartLabel: 'Semi-ombra', label: 'semi-ombra (pianura)',     pct: 76, color: '#6baed6' },
            { chartLabel: 'Ombra parz.','label': 'ombra parziale',        pct: 18, color: '#2171b5' },
            { chartLabel: 'Ombra tot.', label: 'ombra quasi totale (N)',  pct:  1, color: '#084594' }
          ],
          summaries: [
            { val: '18%', label: 'ombra profonda' },
            { val: '5%',  label: 'soleggiato' },
            { val: '28°', label: 'alt. max ore 12' }
          ]
        });
        appendText(el,
          'Il contrasto con l\'estate è marcato: dove in estate il 92% è soleggiato, ' +
          'in inverno solo il 5% riceve luce diretta piena. ' +
          'Le zone più colpite dall\'ombra invernale sono i versanti nord dei Monti di Palermo ' +
          '(Monte Cuccio, Pizzuta) e le valli strette di Boccadifalco e Baida. ' +
          'La pianura costiera, pur nella fascia di semi-ombra, riceve luce diretta nelle ore centrali ' +
          'della giornata (ore 11-14 circa). Questo dato è fondamentale per il comfort termico ' +
          'degli spazi pubblici e la progettazione bioClimatica.'
        );
        // RANK:ombra_i

        var OMBRA_I_CLS = [
          { key: 'c_ombra_forte', label: '< 80 (forte ombra)', color: '#2166ac' },
          { key: 'c_ombra_parz', label: '80÷170 (parziale)', color: '#74add1' },
          { key: 'c_semi_luce', label: '170÷250 (semi-luce)', color: '#fdae61' },
          { key: 'c_piena_luce', label: '> 250 (piena luce)', color: '#d73027' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'Irradiazione media',
          maxVal: 192.063,
          classes: OMBRA_I_CLS,
          items: [
            { rank: 1, label:'III · Oreto', val:192.063, classi:{c_ombra_forte: 0.0, c_ombra_parz: 16.5, c_semi_luce: 77.3, c_piena_luce: 6.3} },
            { rank: 2, label:'II · Resuttana', val:181.241, classi:{c_ombra_forte: 0.1, c_ombra_parz: 23.5, c_semi_luce: 71.3, c_piena_luce: 5.1} },
            { rank: 3, label:'VII · Mondello', val:174.42, classi:{c_ombra_forte: 0.6, c_ombra_parz: 40.2, c_semi_luce: 56.2, c_piena_luce: 3.0} },
            { rank: 4, label:'V · Noce', val:171.563, classi:{c_ombra_forte: 0.4, c_ombra_parz: 48.2, c_semi_luce: 49.6, c_piena_luce: 1.8} },
            { rank: 5, label:'I · Centro Storico', val:171.557, classi:{c_ombra_forte: 0.0, c_ombra_parz: 48.8, c_semi_luce: 49.5, c_piena_luce: 1.7} },
            { rank: 6, label:'VI · Nord-Ovest', val:168.867, classi:{c_ombra_forte: 0.3, c_ombra_parz: 59.0, c_semi_luce: 40.1, c_piena_luce: 0.6} },
            { rank: 7, label:'IV · Mezzomonreale', val:167.935, classi:{c_ombra_forte: 0.4, c_ombra_parz: 45.7, c_semi_luce: 52.0, c_piena_luce: 1.9} },
            { rank: 8, label:'VIII · Libertà', val:166.85, classi:{c_ombra_forte: 0.4, c_ombra_parz: 59.8, c_semi_luce: 38.0, c_piena_luce: 1.8} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'Irradiazione media',
          maxVal: 194.459,
          classes: OMBRA_I_CLS,
          items: [
            { rank: 1, label:'Villagrazia - Falsomiele', val:194.459, classi:{c_ombra_forte: 0.0, c_ombra_parz: 14.2, c_semi_luce: 78.8, c_piena_luce: 7.0} },
            { rank: 2, label:'Brancaccio - Ciaculli', val:186.718, classi:{c_ombra_forte: 0.2, c_ombra_parz: 16.1, c_semi_luce: 76.6, c_piena_luce: 7.1} },
            { rank: 3, label:'Tommaso Natale - Sferracavallo', val:182.42, classi:{c_ombra_forte: 0.3, c_ombra_parz: 26.0, c_semi_luce: 71.8, c_piena_luce: 1.9} },
            { rank: 4, label:'Arenella - Vergine Maria', val:175.149, classi:{c_ombra_forte: 0.6, c_ombra_parz: 44.0, c_semi_luce: 50.4, c_piena_luce: 4.9} },
            { rank: 5, label:'Resuttana - San Lorenzo', val:174.768, classi:{c_ombra_forte: 0.3, c_ombra_parz: 50.4, c_semi_luce: 48.7, c_piena_luce: 0.5} },
            { rank: 6, label:'Settecannoli', val:173.917, classi:{c_ombra_forte: 0.0, c_ombra_parz: 31.8, c_semi_luce: 65.7, c_piena_luce: 2.5} },
            { rank: 7, label:'Tribunali-Castellammare', val:172.695, classi:{c_ombra_forte: 0.0, c_ombra_parz: 48.6, c_semi_luce: 48.2, c_piena_luce: 3.2} },
            { rank: 8, label:'Borgo Nuovo', val:172.274, classi:{c_ombra_forte: 0.6, c_ombra_parz: 51.5, c_semi_luce: 45.1, c_piena_luce: 2.8} }
        ]
        });

      }
    },

    // ── Frost hollow / cold air pooling ─────────────────────────────────────
    frosthollow: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/><path d="M2 12h20"/><path d="M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364"/></svg>',
      title: 'Frost hollow — accumulo aria fredda',
      layer: 'frost-hollow-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Il <strong>Frost Hollow Index</strong> individua le <strong>depressioni morfologiche</strong> ' +
          'dove l\'aria fredda tende ad accumularsi nelle notti serene per effetto della gravità. ' +
          'Il calcolo combina: (1) <strong>TPI negativo</strong> (Topographic Position Index < 0: depressioni, ' +
          'valli chiuse) normalizzato su 3 deviazioni standard; ' +
          '(2) <strong>curvatura concava</strong> (curvatura totale < 0: bacini morfologici), ' +
          'normalizzata su 2 deviazioni standard; ' +
          '(3) <strong>fattore quota</strong> — le depressioni a bassa quota (<200 m) hanno ' +
          'accumulo più intenso rispetto alle depressioni montane. ' +
          'Il <strong>4,6%</strong> del territorio è ad alto o critico rischio di frost hollow ' +
          '(classi blu scuro e blu notte): si tratta delle <strong>depressioni chiuse</strong> ' +
          'identificate anche dall\'analisi geomorfologica (pianure e fondovalle al 3,1%). ' +
          'Rilevante per la <strong>gestione del verde</strong>, le colture sensibili al gelo ' +
          'e le infrastrutture critiche nelle aree depresse.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-frost',
          title: 'Classi rischio frost hollow',
          centerVal: '4,6%',
          centerLabel: 'alto/critico',
          legendData: [
            { chartLabel: 'Nullo / pianura',   label: 'nullo / aree piatte e creste',    pct: 67, color: '#f5f5ff' },
            { chartLabel: 'Trascurabile',      label: 'trascurabile (TPI liev. neg.)',   pct: 21, color: '#c6dbef' },
            { chartLabel: 'Basso',             label: 'basso — depressioni ampie',       pct:  8, color: '#6baed6' },
            { chartLabel: 'Moderato',          label: 'moderato — valli parzial. chiuse',pct:  4, color: '#3182bd' },
            { chartLabel: 'Alto',              label: 'alto — fondovalli stretti',       pct:  0, color: '#08519c' },
            { chartLabel: 'Critico',           label: 'critico — depressioni chiuse',    pct:  0, color: '#08306b' }
          ],
          summaries: [
            { val: '4,6%', label: 'alto/critico' },
            { val: '67%',  label: 'nullo/pianura' },
            { val: '0,2%', label: 'critico' }
          ]
        });
        appendText(el,
          'Le zone a rischio critico (blu notte) corrispondono alle depressioni chiuse ' +
          'identificate dall\'analisi geomorfologica come "Pianure e fondovalle" con ' +
          'TPI fortemente negativo: il fondovalle dell\'Oreto, alcune depressioni di ' +
          'Boccadifalco e Baida, e le conche nelle zone rurali della Circoscrizione VI. ' +
          'In queste aree, nelle notti invernali serene, la temperatura può scendere ' +
          '2-5°C sotto quella delle zone circostanti. ' +
          'Attenzione nella pianificazione di colture sensibili al gelo tardivo ' +
          '(agrumi, ulivi fioriti) e nella localizzazione di infrastrutture critiche.'
        );
        // RANK:frost

        var FROST_CLS = [
          { key: 'c_minimo', label: '< 0.005 (minimo)', color: '#ffffcc' },
          { key: 'c_basso', label: '0.005÷0.023 (basso)', color: '#a1dab4' },
          { key: 'c_medio', label: '0.023÷0.074 (medio)', color: '#41b6c4' },
          { key: 'c_alto', label: '0.074÷0.28 (alto)', color: '#2c7fb8' },
          { key: 'c_critico', label: '> 0.28 (critico)', color: '#253494' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'Indice medio',
          maxVal: 0.073,
          classes: FROST_CLS,
          items: [
            { rank: 1, label:'VII · Mondello', val:0.073, classi:{c_minimo: 23.1, c_basso: 21.3, c_medio: 25.0, c_alto: 24.2, c_critico: 6.4} },
            { rank: 2, label:'I · Centro Storico', val:0.072, classi:{c_minimo: 18.9, c_basso: 24.6, c_medio: 26.7, c_alto: 23.2, c_critico: 6.6} },
            { rank: 3, label:'II · Resuttana', val:0.068, classi:{c_minimo: 23.1, c_basso: 23.8, c_medio: 24.9, c_alto: 21.9, c_critico: 6.2} },
            { rank: 4, label:'VIII · Libertà', val:0.059, classi:{c_minimo: 25.5, c_basso: 27.6, c_medio: 24.0, c_alto: 17.6, c_critico: 5.3} },
            { rank: 5, label:'IV · Mezzomonreale', val:0.058, classi:{c_minimo: 25.1, c_basso: 23.8, c_medio: 27.1, c_alto: 19.5, c_critico: 4.5} },
            { rank: 6, label:'III · Oreto', val:0.055, classi:{c_minimo: 25.8, c_basso: 22.3, c_medio: 28.4, c_alto: 19.8, c_critico: 3.7} },
            { rank: 7, label:'V · Noce', val:0.053, classi:{c_minimo: 28.0, c_basso: 27.2, c_medio: 23.6, c_alto: 16.9, c_critico: 4.3} },
            { rank: 8, label:'VI · Nord-Ovest', val:0.051, classi:{c_minimo: 28.1, c_basso: 28.0, c_medio: 24.2, c_alto: 15.5, c_critico: 4.1} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'Indice medio',
          maxVal: 0.082,
          classes: FROST_CLS,
          items: [
            { rank: 1, label:'Montegrappa - S. Rosalia', val:0.082, classi:{c_minimo: 18.6, c_basso: 22.1, c_medio: 25.3, c_alto: 25.9, c_critico: 8.1} },
            { rank: 2, label:'Oreto - Stazione', val:0.082, classi:{c_minimo: 19.0, c_basso: 24.0, c_medio: 24.0, c_alto: 24.1, c_critico: 8.9} },
            { rank: 3, label:'Arenella - Vergine Maria', val:0.081, classi:{c_minimo: 23.2, c_basso: 19.0, c_medio: 23.1, c_alto: 27.8, c_critico: 7.0} },
            { rank: 4, label:'Settecannoli', val:0.079, classi:{c_minimo: 20.7, c_basso: 24.1, c_medio: 23.6, c_alto: 22.9, c_critico: 8.6} },
            { rank: 5, label:'Uditore - Passo di Rigano', val:0.079, classi:{c_minimo: 19.7, c_basso: 23.9, c_medio: 24.6, c_alto: 23.3, c_critico: 8.4} },
            { rank: 6, label:'Cuba - Calatafimi', val:0.078, classi:{c_minimo: 18.9, c_basso: 22.3, c_medio: 26.3, c_alto: 25.2, c_critico: 7.4} },
            { rank: 7, label:'Libertà', val:0.077, classi:{c_minimo: 20.7, c_basso: 26.6, c_medio: 22.3, c_alto: 22.1, c_critico: 8.2} },
            { rank: 8, label:'Malaspina - Palagonia', val:0.077, classi:{c_minimo: 20.4, c_basso: 26.9, c_medio: 21.9, c_alto: 22.5, c_critico: 8.3} }
        ]
        });

      }
    },

    // ── Sky View Factor ─────────────────────────────────────────────────────
    svf: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M5 12 Q12 4 19 12"/><line x1="12" y1="2" x2="12" y2="22" stroke-dasharray="3,2"/></svg>',
      title: 'Sky View Factor (SVF)',
      layer: 'svf-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Lo <strong>Sky View Factor (SVF)</strong> misura la <strong>frazione di cielo visibile</strong> ' +
          'da ogni punto del territorio: valori prossimi a 1,0 indicano un orizzonte aperto (creste, pianure), ' +
          'valori bassi indicano forti ostruzioni (valli strette, canyon urbani). ' +
          'Il calcolo esegue uno <strong>scan dell\'orizzonte in 8 direzioni</strong> (raggio 600 m): ' +
          'per ogni direzione viene misurato il massimo angolo di elevazione verso il terreno circostante; ' +
          'SVF = media dei cos²(angolo) — angoli positivi (terreno sopra l\'orizzonte) riducono l\'SVF. ' +
          'Rilevante per la <strong>stima dell\'isola di calore urbana</strong>, il comfort termico negli spazi pubblici ' +
          'e le strategie del PAESC (Piano di Adattamento ai Cambiamenti Climatici). ' +
          'Il <strong>7,3%</strong> del territorio ha SVF < 0,90 (ostruzione significativa): ' +
          'valli incise dei Monti di Palermo, fondovalli dell\'Oreto e le depressioni chiuse.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-svf',
          title: 'Distribuzione SVF',
          centerVal: '0,97',
          centerLabel: 'media',
          legendData: [
            { chartLabel: 'Forte ostru. <0,50', label: '< 0,50  fortemente ostruito',  pct:  0.2, color: '#21252a' },
            { chartLabel: 'Ostruito 0,50-0,65', label: '0,50–0,65  ostruito (valli)',  pct:  0.9, color: '#1e4e79' },
            { chartLabel: 'Parz. 0,65-0,75',    label: '0,65–0,75  parzialmente',      pct:  1.4, color: '#3182bd' },
            { chartLabel: 'Semi-ap. 0,75-0,82', label: '0,75–0,82  semi-aperto',       pct:  4.8, color: '#74c476' },
            { chartLabel: 'Aperto 0,82-0,88',   label: '0,82–0,88  aperto',            pct:  8.7, color: '#c7e9c0' },
            { chartLabel: 'Molto ap. 0,88-0,94',label: '0,88–0,94  molto aperto',      pct: 12.5, color: '#ffffc0' },
            { chartLabel: 'Pianura >0,94',      label: '> 0,94  pianura / crinale',    pct: 71.5, color: '#ffffff' }
          ],
          summaries: [
            { val: '0,97', label: 'SVF medio' },
            { val: '7,3%', label: 'SVF < 0,90' },
            { val: '0,25', label: 'min (valli)' }
          ]
        });
        appendText(el,
          'I valori SVF più bassi (< 0,65) si concentrano nelle valli montane ' +
          'del Gabriele e dell\'Eleuterio (Circoscrizione VI), nelle pareti ripide ' +
          'verso Monte Cuccio e Monte Grifone. Le aree costiere e la Conca d\'Oro ' +
          'presentano SVF > 0,95 (cielo quasi completamente aperto). ' +
          'SVF bassi nelle aree urbanizzate dense favoriscono il riscaldamento notturno ' +
          '(l\'energia re-emessa non disperde verso il cielo) — utile per ' +
          'identificare priorità di intervento con verde urbano e materiali riflettenti.'
        );
        // RANK:svf

        var SVF_CLS = [
          { key: 'c_incassato', label: '< 0.87 (incassato)', color: '#d73027' },
          { key: 'c_chiuso', label: '0.87÷0.96 (chiuso)', color: '#fc8d59' },
          { key: 'c_semi_aperto', label: '0.96÷0.994 (semi-aperto)', color: '#fee090' },
          { key: 'c_aperto', label: '> 0.994 (aperto)', color: '#1a9850' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'SVF medio',
          maxVal: 0.999,
          classes: SVF_CLS,
          items: [
            { rank: 1, label:'I · Centro Storico', val:0.999, classi:{c_incassato: 0.0, c_chiuso: 0.2, c_semi_aperto: 4.6, c_aperto: 95.2} },
            { rank: 2, label:'VIII · Libertà', val:0.98, classi:{c_incassato: 2.8, c_chiuso: 13.0, c_semi_aperto: 23.7, c_aperto: 60.5} },
            { rank: 3, label:'IV · Mezzomonreale', val:0.977, classi:{c_incassato: 1.6, c_chiuso: 22.8, c_semi_aperto: 20.3, c_aperto: 55.3} },
            { rank: 4, label:'V · Noce', val:0.977, classi:{c_incassato: 1.3, c_chiuso: 19.5, c_semi_aperto: 34.2, c_aperto: 44.9} },
            { rank: 5, label:'VI · Nord-Ovest', val:0.977, classi:{c_incassato: 2.4, c_chiuso: 13.1, c_semi_aperto: 44.8, c_aperto: 39.7} },
            { rank: 6, label:'II · Resuttana', val:0.974, classi:{c_incassato: 6.3, c_chiuso: 13.0, c_semi_aperto: 11.3, c_aperto: 69.4} },
            { rank: 7, label:'III · Oreto', val:0.962, classi:{c_incassato: 4.6, c_chiuso: 32.5, c_semi_aperto: 20.7, c_aperto: 42.2} },
            { rank: 8, label:'VII · Mondello', val:0.945, classi:{c_incassato: 12.6, c_chiuso: 24.9, c_semi_aperto: 24.1, c_aperto: 38.4} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'SVF medio',
          maxVal: 1.0,
          classes: SVF_CLS,
          items: [
            { rank: 1, label:'Noce', val:1.0, classi:{c_incassato: 0.0, c_chiuso: 0.0, c_semi_aperto: 0.1, c_aperto: 99.9} },
            { rank: 2, label:'Altarello', val:0.999, classi:{c_incassato: 0.0, c_chiuso: 0.1, c_semi_aperto: 1.0, c_aperto: 98.9} },
            { rank: 3, label:'Libertà', val:0.999, classi:{c_incassato: 0.0, c_chiuso: 0.7, c_semi_aperto: 1.9, c_aperto: 97.4} },
            { rank: 4, label:'Malaspina - Palagonia', val:0.999, classi:{c_incassato: 0.0, c_chiuso: 0.1, c_semi_aperto: 1.1, c_aperto: 98.8} },
            { rank: 5, label:'Politeama', val:0.999, classi:{c_incassato: 0.0, c_chiuso: 0.3, c_semi_aperto: 1.5, c_aperto: 98.2} },
            { rank: 6, label:'Settecannoli', val:0.999, classi:{c_incassato: 0.0, c_chiuso: 0.1, c_semi_aperto: 2.9, c_aperto: 97.0} },
            { rank: 7, label:'Tribunali-Castellammare', val:0.999, classi:{c_incassato: 0.0, c_chiuso: 0.1, c_semi_aperto: 1.8, c_aperto: 98.1} },
            { rank: 8, label:'Uditore - Passo di Rigano', val:0.999, classi:{c_incassato: 0.0, c_chiuso: 0.1, c_semi_aperto: 2.8, c_aperto: 97.1} }
        ]
        });

      }
    },

    // ── Viewshed cumulativo ─────────────────────────────────────────────────
    viewshed: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M1 12 C4 6 8 3 12 3 C16 3 20 6 23 12 C20 18 16 21 12 21 C8 21 4 18 1 12Z"/></svg>',
      title: 'Visibilità / Viewshed',
      layer: 'viewshed-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La mappa di <strong>visibilità cumulativa (Viewshed)</strong> mostra, per ogni cella del DTM, ' +
          'da quanti dei <strong>6 punti strategici</strong> di Palermo quella cella è visibile. ' +
          'I punti osservatori sono: <strong>Monte Pellegrino</strong> (429 m), <strong>Monte Cuccio</strong> ' +
          '(1.002 m), <strong>Monte Grifone</strong> (504 m), <strong>Palazzo dei Normanni</strong> (72 m), ' +
          '<strong>Teatro Massimo</strong> (15 m), <strong>Belvedere Mondello</strong>. ' +
          'Raggio massimo 25 km, correzione curvatura terrestre. ' +
          'Il <strong>69%</strong> del territorio è visibile da almeno un punto; ' +
          'nessuna cella risulta visibile da tutti e 6 gli osservatori (effetto del rilievo interno). ' +
          'Utile per la pianificazione paesaggistica, l\'individuazione di corridoi visuali protetti ' +
          'e la localizzazione di infrastrutture (antenne, impianti eolici, edifici alti).'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-vs',
          title: 'Visibilità da N osservatori',
          centerVal: '69%',
          centerLabel: 'visibile ≥1',
          legendData: [
            { chartLabel: 'Non visibile',    label: '0 obs — non visibile',   pct: 31.0, color: '#f0f0f0' },
            { chartLabel: '1 osservatore',   label: '1 obs — marginale',      pct: 24.4, color: '#f7fbff' },
            { chartLabel: '2 osservatori',   label: '2 obs — bassa',          pct: 17.6, color: '#c6dbef' },
            { chartLabel: '3 osservatori',   label: '3 obs — media',          pct: 13.6, color: '#6baed6' },
            { chartLabel: '4 osservatori',   label: '4 obs — alta',           pct: 10.5, color: '#3182bd' },
            { chartLabel: '5 osservatori',   label: '5 obs — molto alta',     pct:  2.8, color: '#08519c' }
          ],
          summaries: [
            { val: '69%',  label: 'visibile' },
            { val: '31%',  label: 'non visibile' },
            { val: '2,8%', label: 'da 5 obs' }
          ]
        });
        appendText(el,
          'Monte Pellegrino (2.526.309 celle visibili) e Palazzo dei Normanni (2.202.109) ' +
          'hanno il maggiore dominio visuale. Monte Cuccio (976.280) e il Belvedere di Mondello ' +
          '(845.049) hanno visibilità più contenuta per le ostruzioni dei rilievi intermedi. ' +
          'Le zone non visibili da nessun punto (31%) si trovano nelle valli montane interne, ' +
          'nelle depressioni tra le creste e nelle zone costiere fuori dal campo visivo. ' +
          'Questa analisi è base per valutazioni di impatto paesaggistico (art. 146 D.Lgs. 42/2004).'
        );
        // RANK:viewshed

        var VIEWSHED_CLS = [
          { key: 'c0', label: '0 (invisibile)', color: '#f7f7f7' },
          { key: 'c1', label: '1 (scarsa)', color: '#cccccc' },
          { key: 'c2_3', label: '2÷3 (media)', color: '#969696' },
          { key: 'c4_5', label: '4÷5 (alta)', color: '#636363' },
          { key: 'c6', label: '6 (massima)', color: '#252525' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'Visibilità media',
          unit: ' n. vp',
          maxVal: 2.143,
          classes: VIEWSHED_CLS,
          items: [
            { rank: 1, label:'III · Oreto', val:2.143, classi:{c0: 26.8, c1: 15.5, c2_3: 30.2, c4_5: 27.5, c6: 0.0} },
            { rank: 2, label:'VI · Nord-Ovest', val:1.977, classi:{c0: 17.7, c1: 24.1, c2_3: 39.9, c4_5: 18.3, c6: 0.0} },
            { rank: 3, label:'V · Noce', val:1.776, classi:{c0: 17.3, c1: 27.8, c2_3: 43.3, c4_5: 11.6, c6: 0.0} },
            { rank: 4, label:'VIII · Libertà', val:1.669, classi:{c0: 33.3, c1: 16.2, c2_3: 36.3, c4_5: 14.2, c6: 0.0} },
            { rank: 5, label:'IV · Mezzomonreale', val:1.46, classi:{c0: 30.2, c1: 28.9, c2_3: 31.1, c4_5: 9.6, c6: 0.2} },
            { rank: 6, label:'II · Resuttana', val:1.2, classi:{c0: 44.9, c1: 16.5, c2_3: 32.9, c4_5: 5.6, c6: 0.0} },
            { rank: 7, label:'I · Centro Storico', val:1.164, classi:{c0: 38.3, c1: 27.6, c2_3: 29.1, c4_5: 5.0, c6: 0.0} },
            { rank: 8, label:'VII · Mondello', val:1.132, classi:{c0: 39.5, c1: 33.6, c2_3: 16.8, c4_5: 10.0, c6: 0.0} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'Visibilità media',
          unit: ' n. vp',
          maxVal: 2.281,
          classes: VIEWSHED_CLS,
          items: [
            { rank: 1, label:'Villagrazia - Falsomiele', val:2.281, classi:{c0: 24.6, c1: 14.3, c2_3: 30.8, c4_5: 30.3, c6: 0.0} },
            { rank: 2, label:'Libertà', val:2.166, classi:{c0: 12.5, c1: 20.2, c2_3: 52.3, c4_5: 15.0, c6: 0.0} },
            { rank: 3, label:'Malaspina - Palagonia', val:2.106, classi:{c0: 3.8, c1: 30.1, c2_3: 52.9, c4_5: 13.1, c6: 0.0} },
            { rank: 4, label:'Cruillas - S.Giovanni Apostolo', val:2.006, classi:{c0: 18.8, c1: 21.2, c2_3: 43.1, c4_5: 16.9, c6: 0.0} },
            { rank: 5, label:'Resuttana - San Lorenzo', val:1.954, classi:{c0: 16.8, c1: 26.4, c2_3: 37.3, c4_5: 19.4, c6: 0.0} },
            { rank: 6, label:'Borgo Nuovo', val:1.901, classi:{c0: 22.5, c1: 20.1, c2_3: 40.2, c4_5: 17.1, c6: 0.1} },
            { rank: 7, label:'Zisa', val:1.751, classi:{c0: 7.7, c1: 37.5, c2_3: 49.6, c4_5: 5.2, c6: 0.0} },
            { rank: 8, label:'Noce', val:1.703, classi:{c0: 5.2, c1: 40.5, c2_3: 50.7, c4_5: 3.7, c6: 0.0} }
        ]
        });

      }
    },

    // ── Profili altimetrici ──────────────────────────────────────────────────
    profili: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 20 7 10 11 16 15 6 19 13 23 8"/><line x1="3" y1="20" x2="23" y2="20"/></svg>',
      title: 'Profili altimetrici',
      layer: 'transects-line',
      extraLayers: ['transects-label'],
      hasLayer: true,
      noOpacity: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);

        // ── Checkbox toggle layer transetti ─────────────────────────────────
        var cbRow = document.createElement('label');
        cbRow.style.cssText = 'display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;' +
          'background:rgba(36,88,200,0.06);border:1px solid rgba(36,88,200,0.15);border-radius:6px;' +
          'padding:7px 10px;margin-bottom:10px;font-size:12px;color:#2458c8;font-weight:600;';
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = 'transects-panel-cb';
        cb.checked = true;
        cb.style.cssText = 'width:14px;height:14px;accent-color:#e07800;cursor:pointer;flex-shrink:0;';
        cb.addEventListener('change', function () {
          if (typeof window.setTransectsVisible === 'function') {
            window.setTransectsVisible(this.checked);
          }
        });
        var cbIcon = document.createElement('span');
        cbIcon.style.cssText = 'display:flex;align-items:center;flex-shrink:0;';
        var svgNS = 'http://www.w3.org/2000/svg';
        var svgEl = document.createElementNS(svgNS, 'svg');
        svgEl.setAttribute('width', '18'); svgEl.setAttribute('height', '6');
        svgEl.setAttribute('viewBox', '0 0 18 6'); svgEl.setAttribute('fill', 'none');
        var lineEl = document.createElementNS(svgNS, 'line');
        lineEl.setAttribute('x1', '0'); lineEl.setAttribute('y1', '3');
        lineEl.setAttribute('x2', '18'); lineEl.setAttribute('y2', '3');
        lineEl.setAttribute('stroke', '#e07800'); lineEl.setAttribute('stroke-width', '4');
        lineEl.setAttribute('stroke-linecap', 'round');
        svgEl.appendChild(lineEl);
        cbIcon.appendChild(svgEl);
        var cbTxt = document.createElement('span');
        cbTxt.textContent = 'Mostra transetti sulla mappa';
        cbRow.appendChild(cb);
        cbRow.appendChild(cbIcon);
        cbRow.appendChild(cbTxt);
        el.appendChild(cbRow);

        appendIntro(el,
          'I <strong>9 profili altimetrici</strong> mostrano la variazione di quota lungo assi ' +
          'territoriali significativi, campionati sul DTM 5m con 200 punti per transetto. ' +
          'Utili per l\'analisi dei <strong>costi di accessibilità pedonale e ciclabile</strong>, ' +
          'la comprensione della morfologia urbana e la progettazione di percorsi sostenibili. ' +
          'Il transetto <strong>Monte Pellegrino Traversata</strong> è il più spettacolare: ' +
          'dal mare di Mondello (0 m) alla vetta (476 m) e giù verso i quartieri nord. ' +
          'La <strong>Valle dell\'Oreto</strong> percorre il fondovalle fluviale inciso (8,8 km). ' +
          'La <strong>Costa Nord</strong> (17 km) rivela la morfologia costiera da Sferracavallo a Palermo nord.'
        );

        // ── Mini-mappa posizione transetti ──────────────────────────────────
        appendSectionTitle(el, 'Posizione dei transetti');
        var mapWrap = document.createElement('div');
        mapWrap.style.cssText = 'position:relative;width:100%;margin:6px 0 10px;border-radius:6px;overflow:hidden;border:1px solid #c8d4e8;background:#d9e8f5;';
        var mmCanvas = document.createElement('canvas');
        mmCanvas.id = 'transects-minimap-canvas';
        mmCanvas.style.cssText = 'width:100%;height:auto;display:block;';
        mmCanvas.width = 260; mmCanvas.height = 176;
        mapWrap.appendChild(mmCanvas);
        el.appendChild(mapWrap);

        requestAnimationFrame(function () {
          var c = document.getElementById('transects-minimap-canvas');
          if (!c) return;
          var ctx = c.getContext('2d');
          var W = 260, H = 176;
          var BOUNDS = { w: 13.22, e: 13.47, s: 38.03, n: 38.24 };
          function toC(lon, lat) {
            return [(lon - BOUNDS.w) / (BOUNDS.e - BOUNDS.w) * W,
                    (1 - (lat - BOUNDS.s) / (BOUNDS.n - BOUNDS.s)) * H];
          }

          // sfondo mare
          ctx.fillStyle = '#b8d8ee'; ctx.fillRect(0, 0, W, H);

          // perimetro comunale (fill territorio)
          var BOUNDARY = [[13.35856,38.19193],[13.36774,38.17536],[13.36698,38.16857],[13.37664,38.15222],[13.37643,38.1495],[13.37591,38.14872],[13.37549,38.15245],[13.37183,38.14821],[13.37324,38.14433],[13.37135,38.14583],[13.36881,38.14273],[13.37134,38.14192],[13.37217,38.14426],[13.37781,38.13252],[13.3737,38.14068],[13.37136,38.14077],[13.37234,38.13767],[13.37043,38.14055],[13.37137,38.13729],[13.36969,38.14008],[13.37124,38.13641],[13.36832,38.13847],[13.37079,38.13314],[13.3731,38.13337],[13.37553,38.12676],[13.38033,38.1227],[13.37502,38.12635],[13.37254,38.13299],[13.37031,38.13056],[13.36793,38.1326],[13.36891,38.1355],[13.36698,38.13553],[13.36269,38.13402],[13.36337,38.13048],[13.36568,38.13039],[13.36267,38.12984],[13.36691,38.12935],[13.36361,38.12811],[13.36773,38.12745],[13.36442,38.12662],[13.36925,38.12541],[13.37033,38.12296],[13.367,38.11936],[13.37248,38.12252],[13.37182,38.12615],[13.37279,38.1225],[13.37164,38.12095],[13.37926,38.11423],[13.37855,38.11263],[13.39302,38.10469],[13.41172,38.09862],[13.42825,38.09929],[13.43452,38.09552],[13.4506,38.09545],[13.45271,38.09262],[13.45147,38.08872],[13.44502,38.09228],[13.44024,38.09095],[13.44305,38.08811],[13.44172,38.0857],[13.43322,38.08696],[13.43417,38.08253],[13.42996,38.0783],[13.43414,38.07648],[13.43315,38.06611],[13.42201,38.06158],[13.42143,38.0591],[13.4092,38.0589],[13.40247,38.06015],[13.39602,38.06631],[13.38403,38.06877],[13.37663,38.06772],[13.36793,38.07197],[13.36839,38.06466],[13.36632,38.06298],[13.35866,38.06459],[13.35293,38.06111],[13.34758,38.06186],[13.34169,38.05651],[13.33352,38.05851],[13.32431,38.05034],[13.3184,38.05072],[13.31462,38.05443],[13.32529,38.06568],[13.31921,38.07096],[13.31499,38.0702],[13.31334,38.07831],[13.30928,38.07464],[13.303,38.0747],[13.30207,38.07756],[13.30497,38.07929],[13.30138,38.08517],[13.30551,38.09711],[13.30333,38.10004],[13.29426,38.10094],[13.29004,38.1048],[13.29165,38.10864],[13.24238,38.10051],[13.24719,38.10626],[13.2472,38.11415],[13.25265,38.12229],[13.24832,38.1304],[13.24836,38.135],[13.26478,38.15035],[13.26247,38.16005],[13.2558,38.1685],[13.26388,38.16975],[13.27155,38.17683],[13.26952,38.18367],[13.27599,38.18607],[13.26948,38.19902],[13.25871,38.19957],[13.2585,38.201],[13.26529,38.19987],[13.26854,38.20358],[13.27433,38.19835],[13.27624,38.20009],[13.27394,38.20089],[13.28204,38.206],[13.2808,38.21104],[13.28517,38.20923],[13.30121,38.22032],[13.31647,38.22468],[13.32432,38.21618],[13.32292,38.21383],[13.33067,38.21202],[13.32565,38.20591],[13.32888,38.19985],[13.33384,38.19677],[13.33714,38.19757],[13.3466,38.19108],[13.35856,38.19193]];

          ctx.beginPath();
          BOUNDARY.forEach(function (pt, j) {
            var xy = toC(pt[0], pt[1]);
            if (j === 0) ctx.moveTo(xy[0], xy[1]); else ctx.lineTo(xy[0], xy[1]);
          });
          ctx.closePath();
          ctx.fillStyle = '#e8eef7';
          ctx.fill();
          ctx.strokeStyle = '#8899cc';
          ctx.lineWidth = 1;
          ctx.stroke();

          // etichette
          ctx.fillStyle = '#7aadcc'; ctx.font = '7px sans-serif'; ctx.fillText('Mar Tirreno', 4, 14);
          ctx.fillStyle = '#99aacc'; ctx.font = '9px sans-serif'; ctx.fillText('Palermo', 106, 96);

          // transetti
          var TCOLORS = ['#e07800','#2458c8','#1a7a40','#b84010','#7040b0','#cc3399','#e63900','#0066aa','#669900'];
          var TCOORDS = [
            [[13.3502,38.2127],[13.3506,38.1815],[13.3523,38.1114],[13.3513,38.0879],[13.3481,38.0632]],
            [[13.2847,38.1289],[13.3130,38.1200],[13.3523,38.1114],[13.3900,38.1050],[13.4100,38.1020]],
            [[13.2750,38.1900],[13.3100,38.1600],[13.3523,38.1114],[13.3900,38.0800],[13.4150,38.0650]],
            [[13.4100,38.1800],[13.3900,38.1500],[13.3523,38.1114],[13.3000,38.0800],[13.2700,38.0600]],
            [[13.2900,38.1700],[13.3200,38.1600],[13.3600,38.1500],[13.3900,38.1400],[13.4200,38.1300]],
            [[13.3630,38.0710],[13.3520,38.0830],[13.3440,38.0960],[13.3400,38.1070],[13.3450,38.1180],[13.3540,38.1250]],
            [[13.3150,38.2150],[13.3300,38.1850],[13.3420,38.1630],[13.3520,38.1470],[13.3650,38.1350],[13.3850,38.1300]],
            [[13.2900,38.1380],[13.3200,38.1330],[13.3500,38.1270],[13.3800,38.1220],[13.4100,38.1170]],
            [[13.2550,38.2000],[13.2850,38.2150],[13.3150,38.2120],[13.3400,38.2050],[13.3700,38.1950],[13.4000,38.1900]]
          ];
          var TLABELS = ['N-S','E-O','NO-SE','NE-SO','C.O.','Oreto','Pell.','Bocc.','Costa'];

          TCOORDS.forEach(function (pts, i) {
            ctx.strokeStyle = TCOLORS[i];
            ctx.lineWidth = 2;
            ctx.beginPath();
            pts.forEach(function (pt, j) {
              var xy = toC(pt[0], pt[1]);
              if (j === 0) ctx.moveTo(xy[0], xy[1]); else ctx.lineTo(xy[0], xy[1]);
            });
            ctx.stroke();
            // punto iniziale marcato
            var p0 = toC(pts[0][0], pts[0][1]);
            ctx.fillStyle = TCOLORS[i];
            ctx.beginPath(); ctx.arc(p0[0], p0[1], 2.5, 0, Math.PI*2); ctx.fill();
            ctx.font = 'bold 7px sans-serif';
            ctx.fillText(TLABELS[i], p0[0] + 3, p0[1] - 2);
          });
        });

        // ── Lista transetti ──────────────────────────────────────────────────
        appendSectionTitle(el, 'Transetti disponibili');
        var PROFILES = [
          { key: 'Nord-Sud_Costiero',           label: 'N-S Costiero',             km: 21.2,  min:   2, max: 550, color: '#e07800' },
          { key: 'Est-Ovest_Centro',            label: 'E-O Centro',               km: 14.5,  min:   1, max: 127, color: '#2458c8' },
          { key: 'NordOvest-SudEst',            label: 'NO-SE Montagna',           km: 23.7,  min:  12, max: 402, color: '#1a7a40' },
          { key: 'NordEst-SudOvest',            label: 'NE-SO Diagonale',          km: 23.4,  min:   2, max: 145, color: '#b84010' },
          { key: 'Conca_d_Oro',                 label: 'Conca d\'Oro',             km: 15.6,  min:   4, max: 340, color: '#7040b0' },
          { key: 'Valle_Oreto',                 label: 'Valle dell\'Oreto',        km:  8.82, min:  16, max: 168, color: '#cc3399' },
          { key: 'Monte_Pellegrino_Traversata', label: 'M. Pellegrino Traversata', km: 15.05, min:   0, max: 476, color: '#e63900' },
          { key: 'Boccadifalco_Brancaccio',     label: 'Boccadifalco–Brancaccio', km: 13.69, min:   1, max: 269, color: '#0066aa' },
          { key: 'Costa_Nord',                  label: 'Costa Nord',               km: 17.32, min:   3, max: 511, color: '#669900' }
        ];

        PROFILES.forEach(function (p) {
          var row = document.createElement('div');
          row.style.cssText = 'display:flex;align-items:center;gap:6px;margin:3px 0;font-size:11px;color:#3a4e78;';
          var dot = document.createElement('span');
          dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:' + p.color + ';flex-shrink:0;';
          var txt = document.createElement('span');
          txt.textContent = p.label + ' — ' + p.km + ' km · ' + p.min + '–' + p.max + ' m';
          row.appendChild(dot); row.appendChild(txt);
          el.appendChild(row);
        });

        // ── 5 profili chiave come grafici ────────────────────────────────────
        var KEY_PROFILES = [
          { key: 'Nord-Sud_Costiero',           title: 'N-S Costiero (21 km)',          id: 'rp-c-profilo-ns',   color: '#e07800', alpha: 'rgba(224,120,0,0.12)'   },
          { key: 'Monte_Pellegrino_Traversata', title: 'M.Pellegrino: Mondello → Città (15 km)', id: 'rp-c-profilo-pell', color: '#e63900', alpha: 'rgba(230,57,0,0.12)'   },
          { key: 'Valle_Oreto',                 title: 'Valle dell\'Oreto (8,8 km)',    id: 'rp-c-profilo-ore',  color: '#cc3399', alpha: 'rgba(204,51,153,0.12)' },
          { key: 'NordOvest-SudEst',            title: 'NO-SE Montagna (23,7 km)',      id: 'rp-c-profilo-nose', color: '#1a7a40', alpha: 'rgba(26,122,64,0.12)'  },
          { key: 'Costa_Nord',                  title: 'Costa Nord (17 km)',            id: 'rp-c-profilo-costa',color: '#669900', alpha: 'rgba(102,153,0,0.12)' }
        ];

        KEY_PROFILES.forEach(function (kp) {
          appendSectionTitle(el, 'Profilo ' + kp.title);
          appendChart(el, kp.id);
          (function (chartId, profileKey, borderColor, bgColor) {
            requestAnimationFrame(function () {
              var cvs = document.getElementById(chartId);
              if (!cvs || !window.transectsProfiles) return;
              var d = window.transectsProfiles[profileKey];
              if (!d) return;
              var labels = d.distances.map(function (v) { return (v/1000).toFixed(1)+'km'; });
              var filtered = [];
              labels.forEach(function(_,i){ if(i%3===0) filtered.push(labels[i]); else filtered.push(''); });
              if (chartInstances[chartId]) chartInstances[chartId].destroy();
              chartInstances[chartId] = new Chart(cvs, {
                type: 'line',
                data: {
                  labels: filtered,
                  datasets: [{
                    data: d.elevations,
                    borderColor: borderColor,
                    borderWidth: 1.5,
                    pointRadius: 0,
                    fill: true,
                    backgroundColor: bgColor,
                    spanGaps: true
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: { legend: { display: false }, tooltip: {
                    callbacks: { label: function(c){ return c.raw ? c.raw.toFixed(0)+' m' : 'ND'; } }
                  }},
                  scales: {
                    x: { ticks: { color: '#6070a0', font: { size: 8 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }, grid: { color: 'rgba(30,60,160,0.06)' } },
                    y: { ticks: { color: '#6070a0', font: { size: 8 }, callback: function(v){ return v+'m'; } }, grid: { color: 'rgba(30,60,160,0.06)' } }
                  }
                }
              });
            });
          }(kp.id, kp.key, kp.color, kp.alpha));
        });

        appendIntro(el,
          'I profili mostrano i transetti sul terreno reale (DTM 5m). ' +
          '<strong>Monte Pellegrino</strong>: dal livello del mare a 476 m in meno di 3 km orizzontali — ' +
          'il dislivello più drammatico del territorio comunale. ' +
          '<strong>Costa Nord</strong>: profilo costiero tirrenico con le balze di Sferracavallo (511 m) ' +
          'che scendono direttamente al mare. ' +
          '<strong>Valle dell\'Oreto</strong>: fondovalle inciso a 16–50 m s.l.m., circondato da versanti a 100–168 m. ' +
          'Tutti i 9 transetti sono attivi sulla mappa come linee colorabili. ' +
          'Dati utili per il Piano Urbano della Mobilità Sostenibile (PUMS) e la rete ciclabile.'
        );
      }
    },

    // ── Accessibilità morfologica ────────────────────────────────────────────
    corridoi: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17 C7 17 7 7 12 7 C17 7 17 17 21 17"/><path d="M3 12 C7 12 7 4 12 4 C17 4 17 12 21 12"/></svg>',
      title: 'Corridoi ecologici morfologici',
      layer: 'corridoi-ecologici-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'I <strong>Corridoi Ecologici Morfologici</strong> identificano le aree dove la morfologia ' +
          'del suolo <strong>favorisce la continuità della vegetazione naturalizzata</strong>: ' +
          'bassa pendenza e bassa rugosità superficiale consentono alla flora di colonizzare ' +
          'e connettere nuclei vegetali distanti. ' +
          'L\'indice è calcolato come <strong>conn = (1 − slope_norm)^1.5 × (1 − rough_norm)^0.8</strong>, ' +
          'dove slope_norm = pendenza/45° e rough_norm = rugosità/98° percentile. ' +
          'Valori vicino a 1 (verde scuro) indicano <strong>nuclei e corridoi ottimali</strong>; ' +
          'valori vicino a 0 (rosso) corrispondono a <strong>barriere morfologiche</strong> — ' +
          'versanti calcarei ripidi e rocciosi dei Monti di Palermo. ' +
          'Il <strong>45,5%</strong> del territorio ha connettività > 0,85 (corridoio ottimale), ' +
          'prevalentemente nelle aree pianeggianti costiere e nella Conca d\'Oro.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-corridoi',
          title: 'Connettività morfologica',
          centerVal: '45,5%',
          centerLabel: 'corridoio ottimale',
          legendData: [
            { chartLabel: 'Barriera critica',   label: '0,00–0,15  barriera critica (versanti ripidi)',  pct: 16.4, color: '#b40000' },
            { chartLabel: 'Barriera alta',       label: '0,15–0,30  barriera alta',                       pct:  8.9, color: '#e65520' },
            { chartLabel: 'Barriera moderata',   label: '0,30–0,45  barriera moderata',                   pct:  6.6, color: '#fdae61' },
            { chartLabel: 'Potenziale',          label: '0,45–0,60  corridoio potenziale',                pct:  6.0, color: '#fee08b' },
            { chartLabel: 'Buono',               label: '0,60–0,73  corridoio buono',                     pct:  6.3, color: '#a6d96a' },
            { chartLabel: 'Ottimo',              label: '0,73–0,85  corridoio ottimo',                    pct: 10.4, color: '#66bd63' },
            { chartLabel: 'Ottimale / nucleo',   label: '> 0,85  nucleo — alta connettività',             pct: 45.5, color: '#1a9850' }
          ],
          summaries: [
            { val: '45,5%', label: 'corridoio ottimale' },
            { val: '16,4%', label: 'barriera critica' },
            { val: '0,634', label: 'indice medio' }
          ]
        });
        appendText(el,
          'Le barriere morfologiche critiche (16,4%) coincidono con i versanti calcarei di ' +
          'Monte Pellegrino, Monte Cuccio, Monte Grifone e le falesie costiere. ' +
          'I corridoi ottimali (45,5%) si concentrano nelle pianure costiere (Mondello–Sferracavallo), ' +
          'nella Conca d\'Oro e nelle aree agricole della Circoscrizione VI. ' +
          'Questa mappa è utile per la pianificazione della Rete Ecologica Comunale (REC): ' +
          'i corridoi ottimali (verde) sono candidati prioritari per fasce boscate e greenway, ' +
          'le aree "corridoio buono" (verde chiaro) per stepping stone vegetali, ' +
          'le barriere moderate (giallo–arancio) richiedono interventi di ingegneria naturalistica.'
        );
        // RANK:corridoi

        var CORRIDOI_CLS = [
          { key: 'c_barriera_crit', label: '< 0.15 (barriera critica)', color: '#b2182b' },
          { key: 'c_barriera_alta', label: '0.15÷0.30', color: '#ef8a62' },
          { key: 'c_barriera_mod', label: '0.30÷0.45', color: '#fddbc7' },
          { key: 'c_corridoio_pot', label: '0.45÷0.60 (potenziale)', color: '#d9f0a3' },
          { key: 'c_corridoio_ok', label: '0.60÷0.73 (buono)', color: '#78c679' },
          { key: 'c_corridoio_ott', label: '0.73÷0.85 (ottimo)', color: '#31a354' },
          { key: 'c_nucleo', label: '> 0.85 (nucleo)', color: '#006837' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'Connettività media',
          maxVal: 0.878,
          classes: CORRIDOI_CLS,
          items: [
            { rank: 1, label:'I · Centro Storico', val:0.878, classi:{c_barriera_crit: 0.1, c_barriera_alta: 0.4, c_barriera_mod: 0.8, c_corridoio_pot: 2.0, c_corridoio_ok: 4.9, c_corridoio_ott: 16.7, c_nucleo: 75.2} },
            { rank: 2, label:'II · Resuttana', val:0.742, classi:{c_barriera_crit: 12.9, c_barriera_alta: 3.1, c_barriera_mod: 2.4, c_corridoio_pot: 3.5, c_corridoio_ok: 4.8, c_corridoio_ott: 11.0, c_nucleo: 62.3} },
            { rank: 3, label:'VIII · Libertà', val:0.702, classi:{c_barriera_crit: 10.8, c_barriera_alta: 6.5, c_barriera_mod: 6.0, c_corridoio_pot: 6.5, c_corridoio_ok: 7.2, c_corridoio_ott: 8.9, c_nucleo: 53.9} },
            { rank: 4, label:'IV · Mezzomonreale', val:0.636, classi:{c_barriera_crit: 16.9, c_barriera_alta: 9.5, c_barriera_mod: 5.5, c_corridoio_pot: 4.5, c_corridoio_ok: 5.1, c_corridoio_ott: 11.2, c_nucleo: 47.3} },
            { rank: 5, label:'VI · Nord-Ovest', val:0.627, classi:{c_barriera_crit: 8.1, c_barriera_alta: 11.6, c_barriera_mod: 12.8, c_corridoio_pot: 10.9, c_corridoio_ok: 8.6, c_corridoio_ott: 10.4, c_nucleo: 37.6} },
            { rank: 6, label:'V · Noce', val:0.618, classi:{c_barriera_crit: 14.0, c_barriera_alta: 11.7, c_barriera_mod: 8.8, c_corridoio_pot: 7.4, c_corridoio_ok: 6.5, c_corridoio_ott: 9.5, c_nucleo: 42.0} },
            { rank: 7, label:'VII · Mondello', val:0.582, classi:{c_barriera_crit: 22.6, c_barriera_alta: 9.9, c_barriera_mod: 5.7, c_corridoio_pot: 4.8, c_corridoio_ok: 5.8, c_corridoio_ott: 10.2, c_nucleo: 41.0} },
            { rank: 8, label:'III · Oreto', val:0.551, classi:{c_barriera_crit: 26.5, c_barriera_alta: 9.2, c_barriera_mod: 5.2, c_corridoio_pot: 5.3, c_corridoio_ok: 6.4, c_corridoio_ott: 10.3, c_nucleo: 37.1} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'Connettività media',
          maxVal: 0.929,
          classes: CORRIDOI_CLS,
          items: [
            { rank: 1, label:'Noce', val:0.929, classi:{c_barriera_crit: 0.0, c_barriera_alta: 0.0, c_barriera_mod: 0.0, c_corridoio_pot: 0.0, c_corridoio_ok: 0.5, c_corridoio_ott: 5.0, c_nucleo: 94.5} },
            { rank: 2, label:'Malaspina - Palagonia', val:0.926, classi:{c_barriera_crit: 0.1, c_barriera_alta: 0.2, c_barriera_mod: 0.3, c_corridoio_pot: 0.5, c_corridoio_ok: 0.9, c_corridoio_ott: 4.4, c_nucleo: 93.6} },
            { rank: 3, label:'Politeama', val:0.923, classi:{c_barriera_crit: 0.1, c_barriera_alta: 0.2, c_barriera_mod: 0.3, c_corridoio_pot: 0.5, c_corridoio_ok: 1.1, c_corridoio_ott: 4.4, c_nucleo: 93.3} },
            { rank: 4, label:'Libertà', val:0.915, classi:{c_barriera_crit: 0.4, c_barriera_alta: 0.3, c_barriera_mod: 0.4, c_corridoio_pot: 0.6, c_corridoio_ok: 1.4, c_corridoio_ott: 6.3, c_nucleo: 90.6} },
            { rank: 5, label:'Altarello', val:0.906, classi:{c_barriera_crit: 0.0, c_barriera_alta: 0.1, c_barriera_mod: 0.2, c_corridoio_pot: 0.5, c_corridoio_ok: 1.7, c_corridoio_ott: 11.5, c_nucleo: 86.0} },
            { rank: 6, label:'Uditore - Passo di Rigano', val:0.902, classi:{c_barriera_crit: 0.0, c_barriera_alta: 0.1, c_barriera_mod: 0.6, c_corridoio_pot: 1.2, c_corridoio_ok: 2.6, c_corridoio_ott: 11.2, c_nucleo: 84.3} },
            { rank: 7, label:'Zisa', val:0.902, classi:{c_barriera_crit: 0.1, c_barriera_alta: 0.4, c_barriera_mod: 0.5, c_corridoio_pot: 1.1, c_corridoio_ok: 2.1, c_corridoio_ott: 10.3, c_nucleo: 85.5} },
            { rank: 8, label:'Settecannoli', val:0.901, classi:{c_barriera_crit: 0.0, c_barriera_alta: 0.2, c_barriera_mod: 0.5, c_corridoio_pot: 1.4, c_corridoio_ok: 3.6, c_corridoio_ott: 11.6, c_nucleo: 82.6} }
        ]
        });

      }
    },

    erosionerusle: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20 Q8 10 12 14 Q16 18 21 4"/><path d="M3 16 L7 12"/><path d="M10 18 L14 10"/></svg>',
      title: 'Erosione potenziale RUSLE',
      layer: 'erosione-rusle-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La mappa di <strong>Erosione Potenziale RUSLE</strong> stima il <strong>fattore LS</strong> ' +
          '(lunghezza e inclinazione del versante) dell\'equazione di perdita del suolo ' +
          'RUSLE (Revised Universal Soil Loss Equation): ' +
          '<strong>LS = L × S</strong>, dove ' +
          'L = (A_s / 22,1)^0,4 (area drenante per unità di larghezza) e ' +
          'S = (sin θ / 0,0896)^1,3 per pendenze ≥ 9% (McCool 1987). ' +
          'Questo indice è <strong>adimensionale</strong> — rappresenta il potenziale erosivo ' +
          'relativo rispetto a un versante standard di riferimento (22,1 m, 9%). ' +
          'Senza i fattori K (erodibilità), R (pioggia), C (copertura), P (pratiche) ' +
          'non è una stima di kg/ha/anno ma un <strong>indice spaziale di priorità</strong> ' +
          'per la gestione del suolo e la difesa idrogeologica.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-rusle',
          title: 'Potenziale erosivo LS',
          centerVal: 'LS 3,7',
          centerLabel: 'mediana',
          legendData: [
            { chartLabel: 'Molto basso',  label: 'LS < 0,20  molto basso (fondovalle/pianura)',  pct: 25, color: '#ffffe0' },
            { chartLabel: 'Basso',        label: 'LS 0,20–0,52  basso',                          pct: 25, color: '#fecc5c' },
            { chartLabel: 'Medio',        label: 'LS 0,52–3,68  medio (versanti moderati)',       pct: 25, color: '#fd8d3c' },
            { chartLabel: 'Alto',         label: 'LS 3,68–6,58  alto',                           pct: 15, color: '#e31a1c' },
            { chartLabel: 'Molto alto',   label: 'LS 6,58–7,76  molto alto',                     pct:  5, color: '#b10026' },
            { chartLabel: 'Critico',      label: 'LS > 7,76  critico (canyon, forre calcaree)',  pct:  5, color: '#800026' }
          ],
          summaries: [
            { val: '0,52',  label: 'LS mediana' },
            { val: '5%',    label: 'LS critico' },
            { val: '11,4',  label: 'LS max (p99)' }
          ]
        });
        appendText(el,
          'I valori più elevati (LS > 7,76 — critico, rosso scuro) si concentrano ' +
          'nelle forre calcaree di Monte Pellegrino e Monte Cuccio, nelle incisioni ' +
          'torrentizie dell\'Oreto e nei versanti acclivi della Circoscrizione VI. ' +
          'Le aree pianeggianti costiere e la Conca d\'Oro hanno LS < 0,20 (pianura). ' +
          'Per ottenere una stima di perdita di suolo in t/ha/anno si deve moltiplicare ' +
          'LS × R × K × C × P, dove R per Palermo è circa 600–900 MJ·mm/(ha·h·anno) ' +
          '(elevata erosività delle piogge autunnali) e K varia 0,02–0,45 ' +
          'a seconda della litologia (calcare, argille, suoli alluvionali).'
        );
        // RANK:rusle

        var RUSLE_CLS = [
          { key: 'c_molto_bassa', label: '< 0.2 (molto bassa)', color: '#ffffb2' },
          { key: 'c_bassa', label: '0.2÷0.52 (bassa)', color: '#fecc5c' },
          { key: 'c_media', label: '0.52÷3.7 (media)', color: '#fd8d3c' },
          { key: 'c_alta', label: '3.7÷7.8 (alta)', color: '#f03b20' },
          { key: 'c_critica', label: '> 7.8 (critica)', color: '#bd0026' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'LS medio',
          maxVal: 2.801,
          classes: RUSLE_CLS,
          items: [
            { rank: 1, label:'III · Oreto', val:2.801, classi:{c_molto_bassa: 18.6, c_bassa: 22.5, c_media: 23.3, c_alta: 28.4, c_critica: 7.2} },
            { rank: 2, label:'VII · Mondello', val:2.664, classi:{c_molto_bassa: 22.8, c_bassa: 22.3, c_media: 22.5, c_alta: 24.6, c_critica: 7.7} },
            { rank: 3, label:'V · Noce', val:2.127, classi:{c_molto_bassa: 23.1, c_bassa: 22.6, c_media: 28.8, c_alta: 22.5, c_critica: 2.9} },
            { rank: 4, label:'IV · Mezzomonreale', val:2.086, classi:{c_molto_bassa: 21.6, c_bassa: 30.9, c_media: 21.5, c_alta: 22.2, c_critica: 3.7} },
            { rank: 5, label:'VI · Nord-Ovest', val:1.936, classi:{c_molto_bassa: 22.1, c_bassa: 19.3, c_media: 39.2, c_alta: 17.3, c_critica: 2.2} },
            { rank: 6, label:'VIII · Libertà', val:1.635, classi:{c_molto_bassa: 34.3, c_bassa: 23.1, c_media: 25.6, c_alta: 13.3, c_critica: 3.6} },
            { rank: 7, label:'II · Resuttana', val:1.538, classi:{c_molto_bassa: 37.0, c_bassa: 30.2, c_media: 16.9, c_alta: 10.0, c_critica: 5.9} },
            { rank: 8, label:'I · Centro Storico', val:0.375, classi:{c_molto_bassa: 38.4, c_bassa: 45.2, c_media: 16.0, c_alta: 0.4, c_critica: 0.0} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'LS medio',
          maxVal: 4.048,
          classes: RUSLE_CLS,
          items: [
            { rank: 1, label:'Boccadifalco', val:4.048, classi:{c_molto_bassa: 4.5, c_bassa: 14.8, c_media: 24.5, c_alta: 47.9, c_critica: 8.2} },
            { rank: 2, label:'Arenella - Vergine Maria', val:3.53, classi:{c_molto_bassa: 11.0, c_bassa: 19.1, c_media: 27.8, c_alta: 30.4, c_critica: 11.6} },
            { rank: 3, label:'Partanna Mondello', val:3.358, classi:{c_molto_bassa: 22.0, c_bassa: 16.6, c_media: 19.0, c_alta: 31.3, c_critica: 11.2} },
            { rank: 4, label:'Borgo Nuovo', val:3.268, classi:{c_molto_bassa: 6.3, c_bassa: 11.1, c_media: 41.5, c_alta: 36.3, c_critica: 4.7} },
            { rank: 5, label:'Villagrazia - Falsomiele', val:3.068, classi:{c_molto_bassa: 15.2, c_bassa: 21.1, c_media: 24.3, c_alta: 31.5, c_critica: 8.0} },
            { rank: 6, label:'Montepellegrino', val:2.621, classi:{c_molto_bassa: 15.2, c_bassa: 15.4, c_media: 40.8, c_alta: 22.5, c_critica: 6.2} },
            { rank: 7, label:'Brancaccio - Ciaculli', val:2.413, classi:{c_molto_bassa: 25.4, c_bassa: 26.7, c_media: 20.9, c_alta: 16.9, c_critica: 10.1} },
            { rank: 8, label:'Tommaso Natale - Sferracavallo', val:2.346, classi:{c_molto_bassa: 16.8, c_bassa: 24.1, c_media: 31.4, c_alta: 23.5, c_critica: 4.2} }
        ]
        });

      }
    },

    curvaturainstabilita: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22 C8 22 4 18 4 14 C4 10 8 6 12 6"/><path d="M12 6 C16 6 20 10 20 14"/><path d="M9 14 L12 10 L15 14"/><line x1="12" y1="10" x2="12" y2="20"/></svg>',
      title: 'Curvatura instabilità radicale',
      layer: 'curvatura-instabilita-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La mappa di <strong>Curvatura e Instabilità Radicale</strong> combina ' +
          '<strong>curvatura planare</strong> (convergenza/divergenza del flusso idrico) ' +
          'e <strong>curvatura di profilo</strong> (accelerazione/decelerazione del flusso) ' +
          'per identificare due tipologie critiche: ' +
          '(1) <strong>siti di accumulo detritico</strong> — convergenza planare (plan < 0) + ' +
          'concavità di profilo (prof < 0) = acqua e materiale si concentrano; ' +
          '(2) <strong>instabilità radicale</strong> — convergenza planare (plan < 0) + ' +
          'convessità di profilo (prof > 0) + pendenza elevata = suolo secco, radici sottoposte ' +
          'a stress meccanico laterale (rilevante per la gestione dei pini marittimi in aree acclivi). ' +
          'L\'indice è normalizzato per deviazione standard: il <strong>5%</strong> del territorio ' +
          'è classificato critico.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-instab',
          title: 'Instabilità curvatura',
          centerVal: '5%',
          centerLabel: 'critico',
          legendData: [
            { chartLabel: 'Stabile',           label: 'stabile — pianura/divergente',              pct: 60, color: '#e5f5e0' },
            { chartLabel: 'Basso',             label: 'basso — lieve convergenza',                 pct: 15, color: '#a1d99b' },
            { chartLabel: 'Moderato',          label: 'moderato — potenziale accumulo detritico',  pct: 13, color: '#fdd058' },
            { chartLabel: 'Alto',              label: 'alto — accumulo o instabilità radicale',    pct:  7, color: '#ef6548' },
            { chartLabel: 'Critico',           label: 'critico — canyon convergenti/versanti ripidi', pct: 5, color: '#bd0026' }
          ],
          summaries: [
            { val: '5%',   label: 'critico' },
            { val: '60%',  label: 'stabile' },
            { val: '20%',  label: 'accumulo/instab.' }
          ]
        });
        appendText(el,
          'Le aree critiche (5%, rosso) corrispondono alle incisioni torrentizie, ' +
          'alle forre calcaree e ai canyon dei Monti di Palermo, dove la doppia convergenza ' +
          '(planare + di profilo) concentra acqua e sedimenti. ' +
          'Rilevante per la gestione forestale urbana: i pini in zone "alto" (7%) ' +
          'sono soggetti a stress radicale combinato (suolo discontinuo, radici espanse ' +
          'su versante convesso + apporto idrico laterale convergente) che ne aumenta ' +
          'il rischio di schianto in caso di piogge intense. ' +
          'Sovrapponendo questa mappa al catasto degli alberi è possibile identificare ' +
          'i pini ad alto rischio per prioritizzare i controlli arboristici.'
        );
        // RANK:curv_inst

        var CURV_INST_CLS = [
          { key: 'c_stabile', label: '< 0.002 (stabile)', color: '#1a9641' },
          { key: 'c_basso', label: '0.002÷0.026 (basso)', color: '#a6d96a' },
          { key: 'c_moderato', label: '0.026÷0.1 (moderato)', color: '#ffffbf' },
          { key: 'c_alto', label: '0.1÷0.25 (alto)', color: '#fdae61' },
          { key: 'c_critico', label: '> 0.25 (critico)', color: '#d7191c' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'Indice medio',
          maxVal: 0.006,
          classes: CURV_INST_CLS,
          items: [
            { rank: 1, label:'VII · Mondello', val:0.006, classi:{c_stabile: 74.6, c_basso: 20.1, c_moderato: 4.4, c_alto: 0.7, c_critico: 0.2} },
            { rank: 2, label:'III · Oreto', val:0.005, classi:{c_stabile: 75.9, c_basso: 19.1, c_moderato: 4.1, c_alto: 0.8, c_critico: 0.2} },
            { rank: 3, label:'IV · Mezzomonreale', val:0.005, classi:{c_stabile: 74.4, c_basso: 20.2, c_moderato: 4.7, c_alto: 0.7, c_critico: 0.1} },
            { rank: 4, label:'V · Noce', val:0.005, classi:{c_stabile: 74.3, c_basso: 20.6, c_moderato: 4.4, c_alto: 0.6, c_critico: 0.1} },
            { rank: 5, label:'VI · Nord-Ovest', val:0.005, classi:{c_stabile: 73.7, c_basso: 21.4, c_moderato: 4.4, c_alto: 0.5, c_critico: 0.1} },
            { rank: 6, label:'VIII · Libertà', val:0.005, classi:{c_stabile: 77.7, c_basso: 17.5, c_moderato: 3.9, c_alto: 0.8, c_critico: 0.1} },
            { rank: 7, label:'II · Resuttana', val:0.004, classi:{c_stabile: 80.7, c_basso: 15.6, c_moderato: 2.9, c_alto: 0.6, c_critico: 0.2} },
            { rank: 8, label:'I · Centro Storico', val:0.003, classi:{c_stabile: 79.9, c_basso: 17.1, c_moderato: 2.8, c_alto: 0.2, c_critico: 0.0} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'Indice medio',
          maxVal: 0.007,
          classes: CURV_INST_CLS,
          items: [
            { rank: 1, label:'Boccadifalco', val:0.007, classi:{c_stabile: 71.2, c_basso: 21.4, c_moderato: 6.0, c_alto: 1.2, c_critico: 0.2} },
            { rank: 2, label:'Borgo Nuovo', val:0.007, classi:{c_stabile: 70.2, c_basso: 22.9, c_moderato: 5.9, c_alto: 0.9, c_critico: 0.1} },
            { rank: 3, label:'Montepellegrino', val:0.007, classi:{c_stabile: 72.2, c_basso: 20.7, c_moderato: 5.6, c_alto: 1.3, c_critico: 0.2} },
            { rank: 4, label:'Partanna Mondello', val:0.007, classi:{c_stabile: 73.0, c_basso: 20.6, c_moderato: 5.0, c_alto: 1.0, c_critico: 0.3} },
            { rank: 5, label:'Arenella - Vergine Maria', val:0.006, classi:{c_stabile: 74.8, c_basso: 19.9, c_moderato: 4.3, c_alto: 0.8, c_critico: 0.2} },
            { rank: 6, label:'Brancaccio - Ciaculli', val:0.006, classi:{c_stabile: 80.5, c_basso: 15.0, c_moderato: 3.2, c_alto: 0.9, c_critico: 0.3} },
            { rank: 7, label:'Cruillas - S.Giovanni Apostolo', val:0.006, classi:{c_stabile: 71.2, c_basso: 22.5, c_moderato: 5.5, c_alto: 0.7, c_critico: 0.1} },
            { rank: 8, label:'Villagrazia - Falsomiele', val:0.006, classi:{c_stabile: 75.5, c_basso: 19.4, c_moderato: 4.1, c_alto: 0.8, c_critico: 0.2} }
        ]
        });

      }
    },

    accessibilita: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M7 22 L10 14 L8 9 L14 9 L12 14 L15 22"/><path d="M8 9 L6 13"/><path d="M14 9 L17 13"/></svg>',
      title: 'Accessibilità morfologica',
      layer: 'accessibilita-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'La mappa di <strong>Accessibilità Morfologica</strong> mostra la <strong>velocità di percorrenza ' +
          'pedonale teorica</strong> secondo la <strong>funzione di Tobler</strong>: ' +
          'V = 6 × exp(−3,5 × |tan(pendenza) + 0,05|) km/h. ' +
          'Questa formula, calibrata su escursionisti, produce valori massimi per terreno ' +
          'pianeggiante (~5,0 km/h) e minimi per pendenze superiori al 45° (< 0,5 km/h). ' +
          'La <strong>velocità media comunale è 3,1 km/h</strong>, fortemente condizionata ' +
          'dalla presenza dei Monti di Palermo (NW). ' +
          'Il <strong>51,4%</strong> del territorio ha velocità 3,8–5,0 km/h (moderato), ' +
          'il <strong>18,8%</strong> è sotto 1 km/h (quasi impraticabile a piedi). ' +
          'Utile come <strong>raster di attrito</strong> per analisi di prossimità realistiche ' +
          '(servizi, scuole, ospedali) e il Piano Urbano della Mobilità Sostenibile (PUMS).'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-acc',
          title: 'Velocità pedonale Tobler',
          centerVal: '3,1',
          centerLabel: 'km/h media',
          legendData: [
            { chartLabel: '< 1 km/h',     label: '< 1 km/h  impraticabile (>45°)',    pct: 18.8, color: '#a50026' },
            { chartLabel: '1–2,5 km/h',   label: '1–2,5 km/h  molto difficile',       pct: 16.6, color: '#d73027' },
            { chartLabel: '2,5–3,8 km/h', label: '2,5–3,8 km/h  difficile',           pct: 13.0, color: '#fd8d3c' },
            { chartLabel: '3,8–5,0 km/h', label: '3,8–5,0 km/h  moderato / piano',   pct: 51.4, color: '#fee08b' },
            { chartLabel: '> 5,0 km/h',   label: '> 5,0 km/h  facile (lieve discesa)',pct:  0.2, color: '#1a9641' }
          ],
          summaries: [
            { val: '3,1',  label: 'km/h media' },
            { val: '18,8%',label: '< 1 km/h' },
            { val: '51,4%',label: '3,8–5 km/h' }
          ]
        });
        appendText(el,
          'Le aree pianeggianti costiere (Mondello, Sferracavallo, litorale di Brancaccio) ' +
          'mostrano velocità 4,5–5,0 km/h. Le aree urbane centrali con pendenza media ' +
          'del 2–8% hanno velocità 4,0–4,8 km/h. I versanti montani di Monte Cuccio, ' +
          'Monte Pellegrino e Monte Grifone scendono sotto 1 km/h nelle aree più ripide. ' +
          'Questa mappa può essere usata come layer di attrito per calcolare isocrone ' +
          'realistiche (es. servizi raggiungibili in 10/15/30 minuti a piedi) ' +
          'nell\'ambito del Piano Urbano della Mobilità Sostenibile di Palermo.'
        );
        // RANK:tobler

        var TOBLER_CLS = [
          { key: 'c_molto_diff', label: '< 1.4 (molto difficile)', color: '#d73027' },
          { key: 'c_difficile', label: '1.4÷3.9 (difficile)', color: '#fc8d59' },
          { key: 'c_media', label: '3.9÷4.6 (media)', color: '#fee090' },
          { key: 'c_facile', label: '4.6÷4.9 (facile)', color: '#91cf60' },
          { key: 'c_ottima', label: '> 4.9 (ottima)', color: '#1a9850' }
        ];
        appendRankingCard(el, {
          title: 'Classifica Circoscrizioni',
          subtitle: 'Velocità Tobler media',
          unit: ' km/h',
          maxVal: 4.311,
          classes: TOBLER_CLS,
          items: [
            { rank: 1, label:'I · Centro Storico', val:4.311, classi:{c_molto_diff: 0.5, c_difficile: 16.4, c_media: 44.4, c_facile: 33.3, c_ottima: 5.4} },
            { rank: 2, label:'II · Resuttana', val:3.67, classi:{c_molto_diff: 15.8, c_difficile: 17.1, c_media: 30.1, c_facile: 29.5, c_ottima: 7.6} },
            { rank: 3, label:'VIII · Libertà', val:3.464, classi:{c_molto_diff: 16.9, c_difficile: 25.7, c_media: 23.5, c_facile: 27.8, c_ottima: 6.1} },
            { rank: 4, label:'IV · Mezzomonreale', val:3.152, classi:{c_molto_diff: 26.0, c_difficile: 21.6, c_media: 30.2, c_facile: 19.0, c_ottima: 3.2} },
            { rank: 5, label:'VI · Nord-Ovest', val:3.066, classi:{c_molto_diff: 19.0, c_difficile: 39.4, c_media: 19.4, c_facile: 18.1, c_ottima: 4.1} },
            { rank: 6, label:'V · Noce', val:3.047, classi:{c_molto_diff: 25.0, c_difficile: 29.1, c_media: 22.5, c_facile: 19.7, c_ottima: 3.7} },
            { rank: 7, label:'VII · Mondello', val:2.892, classi:{c_molto_diff: 32.0, c_difficile: 22.8, c_media: 22.3, c_facile: 18.7, c_ottima: 4.3} },
            { rank: 8, label:'III · Oreto', val:2.744, classi:{c_molto_diff: 35.3, c_difficile: 23.4, c_media: 22.3, c_facile: 16.3, c_ottima: 2.7} }
        ]
        });
        appendRankingCard(el, {
          title: 'Classifica Quartieri',
          subtitle: 'Velocità Tobler media',
          unit: ' km/h',
          maxVal: 4.597,
          classes: TOBLER_CLS,
          items: [
            { rank: 1, label:'Noce', val:4.597, classi:{c_molto_diff: 0.0, c_difficile: 2.9, c_media: 37.4, c_facile: 51.4, c_ottima: 8.3} },
            { rank: 2, label:'Malaspina - Palagonia', val:4.592, classi:{c_molto_diff: 0.3, c_difficile: 4.0, c_media: 31.3, c_facile: 54.2, c_ottima: 10.2} },
            { rank: 3, label:'Politeama', val:4.57, classi:{c_molto_diff: 0.4, c_difficile: 4.0, c_media: 36.5, c_facile: 49.7, c_ottima: 9.5} },
            { rank: 4, label:'Libertà', val:4.533, classi:{c_molto_diff: 0.7, c_difficile: 5.6, c_media: 34.9, c_facile: 49.2, c_ottima: 9.6} },
            { rank: 5, label:'Altarello', val:4.465, classi:{c_molto_diff: 0.1, c_difficile: 8.4, c_media: 45.7, c_facile: 39.9, c_ottima: 5.9} },
            { rank: 6, label:'Zisa', val:4.45, classi:{c_molto_diff: 0.5, c_difficile: 9.2, c_media: 41.6, c_facile: 41.3, c_ottima: 7.4} },
            { rank: 7, label:'Settecannoli', val:4.447, classi:{c_molto_diff: 0.3, c_difficile: 11.9, c_media: 35.1, c_facile: 41.4, c_ottima: 11.3} },
            { rank: 8, label:'Uditore - Passo di Rigano', val:4.446, classi:{c_molto_diff: 0.2, c_difficile: 10.2, c_media: 40.9, c_facile: 40.5, c_ottima: 8.2} }
        ]
        });

      }
    },

    dtmpaigap: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 20 2 20"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      title: 'DTM × PAI — Gap morfologico',
      layer: 'dtm-pai-gap-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Confronto tra la <strong>stabilità morfologica derivata dal DTM</strong> e le ' +
          '<strong>perimetrazioni PAI R3/R4</strong> (Piano per l\'Assetto Idrogeologico — Sicilia). ' +
          'Le aree <strong>morfologicamente instabili</strong> (classi 3–4–5 dell\'indice di stabilità ' +
          'versanti: pendenza, curvatura, morfologia) vengono incrociate con i poligoni PAI R4 ' +
          '(rischio molto elevato) e R3 (rischio elevato). ' +
          'Il risultato evidenzia le <strong>zone di gap</strong>: territorio con caratteristiche ' +
          'geomorfologiche di instabilità che non risulta ancora coperto dalla perimetrazione PAI. ' +
          'L\'analisi rivela che il <strong>73% delle aree morfologicamente instabili</strong> (38,7 km² ' +
          'su 53,05 km² totali) ricade <strong>fuori dai perimetri PAI R3/R4</strong>, suggerendo ' +
          'un potenziale aggiornamento della perimetrazione ufficiale del rischio idrogeologico.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-dtmpaigap',
          title: 'Distribuzione gap morfologico',
          centerVal: '73%',
          centerLabel: 'fuori PAI',
          legendData: [
            { chartLabel: 'PAI R4',       label: 'PAI R4 perimetrato — rischio molto elevato',  pct: 7.2,  color: '#b00020' },
            { chartLabel: 'PAI R3',       label: 'PAI R3 perimetrato — rischio elevato',        pct: 19.9, color: '#ff6432' },
            { chartLabel: 'Gap critico',  label: 'Gap critico — instabile cl.4-5, fuori PAI',   pct: 42.2, color: '#dc1e1e' },
            { chartLabel: 'Gap moderato', label: 'Gap moderato — instabile cl.3, fuori PAI',    pct: 30.8, color: '#ffa000' }
          ],
          summaries: [
            { val: '73%',    label: 'fuori PAI' },
            { val: '22,4',   label: 'km² gap critico' },
            { val: '14,4',   label: 'km² PAI R3+R4' }
          ]
        });
        appendSectionTitle(el, 'Superfici per categoria');
        appendTable(el,
          ['Categoria', 'Superficie', '%'],
          [
            ['PAI R4 (perimetrato)',         '3,81 km²',   '7,2%'],
            ['PAI R3 (perimetrato)',         '10,54 km²',  '19,9%'],
            ['Gap critico (cl.4-5, fuori)', '22,37 km²',  '42,2%'],
            ['Gap moderato (cl.3, fuori)',   '16,33 km²',  '30,8%'],
            ['Totale (PAI R3+R4 + gap)',     '53,05 km²',  '100%',  'hl']
          ]
        );
        appendSectionTitle(el, 'Interpretazione');
        appendText(el,
          'Le aree di gap critico (rosso intenso) corrispondono prevalentemente ai versanti ripidi ' +
          'dei Monti di Palermo (Monte Cuccio, Monte Pellegrino, Monte Grifone) e alle valli ' +
          'torrentizie che scendono verso la pianura. ' +
          'Il gap moderato (arancione) include collina urbana e periurbana con instabilità di classe 3 ' +
          'non ancora oggetto di specifica perimetrazione PAI. ' +
          'I poligoni PAI (bordeaux/arancio-rosso) si concentrano nei fondovalle e nelle aree urbane ' +
          'già coinvolte da eventi franosi o alluvionali storici (Bacino Oreto, aree costiere).'
        );
        appendText(el,
          'Nota metodologica: l\'indice di stabilità morfologica è derivato unicamente dal DTM 5m ' +
          '(pendenza, curvatura, rugosità) e non considera la geologia, l\'uso del suolo o la ' +
          'vegetazione. Le aree di gap non sono automaticamente a rischio: la perimetrazione PAI ' +
          'si basa su criteri idrologici, geologici e storico-documentali più completi. ' +
          'L\'analisi è uno strumento preliminare di prioritizzazione per eventuali verifiche sul campo.'
        );
      }
    },

    bivariateElev: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>',
      title: 'DTM × ISTAT — Elevazione × Densità',
      layer: 'bivariate-elev-layer',
      hasLayer: true,
      fillLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Mappa <strong>bivariate</strong> che incrocia la <strong>fascia altimetrica media</strong> ' +
          '(derivata dal DTM 5m) con la <strong>densità abitativa</strong> (ab/km²) per ogni ' +
          '<strong>sezione di censimento ISTAT 2021</strong>. ' +
          'Le 3.600 sezioni di Palermo vengono colorate con una matrice 3×3: asse X = elevazione, ' +
          'asse Y = densità. Il risultato rivela dove si concentra la <strong>pressione demografica ' +
          'in relazione all\'altitudine</strong> e al rischio geomorfologico associato.'
        );
        // Bivariate legend matrix
        (function() {
          var C = {
            '1-3':'#88c8b8','2-3':'#60a898','3-3':'#307870',
            '1-2':'#d8c8d8','2-2':'#b0b0c0','3-2':'#8090a0',
            '1-1':'#f0eaee','2-1':'#e8c8d0','3-1':'#c88090'
          };
          var colH = ['BASSA','MEDIA','ALTA'];   // elevazione bassa→alta
          var rowH = ['ALTA','MEDIA','BASSA'];   // densità alta→bassa (riga 1=alta)
          // y-index: riga 0→y=3 (alta), riga 1→y=2, riga 2→y=1 (bassa)
          var rowY = [3, 2, 1];

          var wrap = document.createElement('div');
          wrap.style.cssText = 'margin:10px 0 16px;width:100%;box-sizing:border-box;';

          // Titolo
          var title = document.createElement('div');
          title.style.cssText = 'font-size:13px;font-weight:700;letter-spacing:0.08em;color:#444;text-transform:uppercase;margin-bottom:2px;';
          title.textContent = 'CLASSE BIVARIATA';
          wrap.appendChild(title);
          var sub = document.createElement('div');
          sub.style.cssText = 'font-size:11px;color:#aaa;margin-bottom:10px;';
          sub.textContent = 'Elevazione DTM × Densità ab/km²';
          wrap.appendChild(sub);

          // Griglia 4 colonne: [label-riga] + [3 celle]
          // Prima riga: vuoto + 3 intestazioni colonne
          var grid = document.createElement('div');
          grid.style.cssText = 'display:grid;grid-template-columns:36px repeat(3,1fr);gap:4px;width:100%;';

          // header row
          var empty = document.createElement('div'); grid.appendChild(empty);
          colH.forEach(function(h) {
            var d = document.createElement('div');
            d.style.cssText = 'font-size:12px;font-weight:600;letter-spacing:0.06em;color:#888;text-align:center;text-transform:uppercase;padding-bottom:2px;';
            d.textContent = h;
            grid.appendChild(d);
          });

          // 3 data rows
          rowH.forEach(function(rh, ri) {
            var y = rowY[ri];
            var lbl = document.createElement('div');
            lbl.style.cssText = 'font-size:12px;font-weight:600;letter-spacing:0.05em;color:#888;text-transform:uppercase;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;';
            lbl.textContent = rh;
            grid.appendChild(lbl);
            [1,2,3].forEach(function(x) {
              var k = x+'-'+y;
              var cell = document.createElement('div');
              cell.style.cssText = 'background:'+C[k]+';height:64px;border-radius:6px;cursor:default;transition:transform 0.15s,box-shadow 0.15s;';
              cell.title = colH[x-1]+' elev. · densità '+rh;
              cell.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 3px 10px rgba(0,0,0,0.15)';
              });
              cell.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
              });
              grid.appendChild(cell);
            });
          });
          wrap.appendChild(grid);

          // asse X label sotto
          var axRow = document.createElement('div');
          axRow.style.cssText = 'display:grid;grid-template-columns:36px 1fr;gap:4px;margin-top:5px;';
          axRow.appendChild(document.createElement('div'));
          var axX = document.createElement('div');
          axX.style.cssText = 'font-size:11px;color:#aaa;text-align:center;letter-spacing:0.04em;';
          axX.textContent = 'Elevazione DTM →';
          axRow.appendChild(axX);
          wrap.appendChild(axRow);

          // asse Y label
          var axY = document.createElement('div');
          axY.style.cssText = 'font-size:11px;color:#aaa;margin-top:2px;padding-left:36px;letter-spacing:0.04em;';
          axY.textContent = '↑ Densità pop. (ab/km²)';
          wrap.appendChild(axY);

          // Nessun dato
          var nd = document.createElement('div');
          nd.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:8px;font-size:11px;color:#aaa;padding-left:36px;';
          var ndBox = document.createElement('div');
          ndBox.style.cssText = 'width:14px;height:14px;border-radius:3px;background:#cccccc;flex-shrink:0;';
          var ndTxt = document.createElement('span'); ndTxt.textContent = 'Nessun dato';
          nd.appendChild(ndBox); nd.appendChild(ndTxt);
          wrap.appendChild(nd);

          el.appendChild(wrap);
        })();
        appendSectionTitle(el, 'Distribuzione popolazione (635.439 ab.)');
        appendTable(el,
          ['Combinazione', 'Pop.', '%', 'Area'],
          [
            ['0–50m × Alta densità',   '200.388', '31,5%', '6,2 km²'],
            ['0–50m × Media densità',  '162.569', '25,6%', '11,0 km²'],
            ['50–300m × Bassa dens.',  '76.778',  '12,1%', '53,1 km²'],
            ['0–50m × Bassa densità',  '61.633',  '9,7%',  '28,8 km²'],
            ['50–300m × Media dens.',  '84.661',  '13,3%', '5,9 km²'],
            ['50–300m × Alta dens.',   '48.291',  '7,6%',  '1,6 km²'],
            ['>300m × Bassa dens.',    '1.119',   '0,2%',  '27,6 km²', 'hl']
          ]
        );
        appendSectionTitle(el, 'Interpretazione');
        appendText(el,
          'Il <strong>57,1% della popolazione</strong> vive in sezioni di pianura costiera (0–50m) ' +
          'a media-alta densità. Questo corrisponde al tessuto urbano denso del centro e dei quartieri ' +
          'storici. Le sezioni collinari (50–300m) ospitano il <strong>32,7% della popolazione</strong> ' +
          'su una superficie molto maggiore (60,6 km²), con densità prevalentemente bassa: ' +
          'periferie, ville e aree residenziali a bassa densità. ' +
          'La zona montana (>300m) ha una popolazione trascurabile (1.119 ab.) distribuita su 27,6 km², ' +
          'confermando che i versanti alti di Monte Cuccio e Monte Pellegrino sono quasi disabitati.'
        );
        appendText(el,
          'Soglie densità (terzili ISTAT 2021): bassa <8.777 ab/km² · media 8.777–22.389 ab/km² · ' +
          'alta >22.389 ab/km². Elevazione: media DTM 5m per sezione. ' +
          'Sezioni fuori DTM (nessun pixel valido) escluse dalla classificazione.'
        );
      }
    },

    bivariateSlope: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>',
      title: 'DTM × ISTAT — Pendenza × Densità',
      layer: 'bivariate-slope-layer',
      hasLayer: true,
      fillLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Mappa <strong>bivariate</strong> che incrocia la <strong>pendenza media</strong> ' +
          '(in gradi, derivata dal DTM 5m) con la <strong>densità abitativa</strong> (ab/km²) ' +
          'per ogni sezione di censimento ISTAT 2021. ' +
          'La combinazione rivela dove coesistono <strong>alta densità e terreno acclive</strong>, ' +
          'indicatore di potenziale vulnerabilità sismica e idrogeologica nelle aree urbanizzate.'
        );
        // Bivariate legend matrix
        (function() {
          var C = {
            '1-3':'#9ab870','2-3':'#7a9850','3-3':'#506030',
            '1-2':'#d8ddb8','2-2':'#c0b898','3-2':'#9a8058',
            '1-1':'#f0eeea','2-1':'#e8c8b0','3-1':'#c87050'
          };
          var colH = ['BASSA','MEDIA','ALTA'];   // pendenza bassa→alta
          var rowH = ['ALTA','MEDIA','BASSA'];   // densità alta→bassa
          var rowY = [3, 2, 1];

          var wrap = document.createElement('div');
          wrap.style.cssText = 'margin:10px 0 16px;width:100%;box-sizing:border-box;';

          var title = document.createElement('div');
          title.style.cssText = 'font-size:13px;font-weight:700;letter-spacing:0.08em;color:#444;text-transform:uppercase;margin-bottom:2px;';
          title.textContent = 'CLASSE BIVARIATA';
          wrap.appendChild(title);
          var sub = document.createElement('div');
          sub.style.cssText = 'font-size:11px;color:#aaa;margin-bottom:10px;';
          sub.textContent = 'Pendenza DTM × Densità ab/km²';
          wrap.appendChild(sub);

          var grid = document.createElement('div');
          grid.style.cssText = 'display:grid;grid-template-columns:36px repeat(3,1fr);gap:4px;width:100%;';

          var empty = document.createElement('div'); grid.appendChild(empty);
          colH.forEach(function(h) {
            var d = document.createElement('div');
            d.style.cssText = 'font-size:12px;font-weight:600;letter-spacing:0.06em;color:#888;text-align:center;text-transform:uppercase;padding-bottom:2px;';
            d.textContent = h;
            grid.appendChild(d);
          });

          rowH.forEach(function(rh, ri) {
            var y = rowY[ri];
            var lbl = document.createElement('div');
            lbl.style.cssText = 'font-size:12px;font-weight:600;letter-spacing:0.05em;color:#888;text-transform:uppercase;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;';
            lbl.textContent = rh;
            grid.appendChild(lbl);
            [1,2,3].forEach(function(x) {
              var k = x+'-'+y;
              var cell = document.createElement('div');
              cell.style.cssText = 'background:'+C[k]+';height:64px;border-radius:6px;cursor:default;transition:transform 0.15s,box-shadow 0.15s;';
              cell.title = colH[x-1]+' pendenza · densità '+rh;
              cell.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 3px 10px rgba(0,0,0,0.15)';
              });
              cell.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
              });
              grid.appendChild(cell);
            });
          });
          wrap.appendChild(grid);

          var axRow = document.createElement('div');
          axRow.style.cssText = 'display:grid;grid-template-columns:36px 1fr;gap:4px;margin-top:5px;';
          axRow.appendChild(document.createElement('div'));
          var axX = document.createElement('div');
          axX.style.cssText = 'font-size:11px;color:#aaa;text-align:center;letter-spacing:0.04em;';
          axX.textContent = 'Pendenza DTM →';
          axRow.appendChild(axX);
          wrap.appendChild(axRow);

          var axY = document.createElement('div');
          axY.style.cssText = 'font-size:11px;color:#aaa;margin-top:2px;padding-left:36px;letter-spacing:0.04em;';
          axY.textContent = '↑ Densità pop. (ab/km²)';
          wrap.appendChild(axY);

          var nd = document.createElement('div');
          nd.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:8px;font-size:11px;color:#aaa;padding-left:36px;';
          var ndBox = document.createElement('div');
          ndBox.style.cssText = 'width:14px;height:14px;border-radius:3px;background:#cccccc;flex-shrink:0;';
          var ndTxt = document.createElement('span'); ndTxt.textContent = 'Nessun dato';
          nd.appendChild(ndBox); nd.appendChild(ndTxt);
          wrap.appendChild(nd);

          el.appendChild(wrap);
        })();
        appendSectionTitle(el, 'Distribuzione popolazione per pendenza');
        appendTable(el,
          ['Combinazione', 'Pop.', '%', 'Area'],
          [
            ['0–5° × Alta dens.',   '238.450', '37,5%', '7,5 km²'],
            ['0–5° × Media dens.',  '235.617', '37,1%', '16,1 km²'],
            ['0–5° × Bassa dens.', '107.401', '16,9%', '48,5 km²'],
            ['5–15° × Bassa dens.', '27.813',  '4,4%',  '15,5 km²'],
            ['5–15° × Media dens.', '10.449',  '1,6%',  '0,7 km²'],
            ['>15° × Bassa dens.',  '4.316',   '0,7%',  '45,5 km²'],
            ['5–15° × Alta dens.',  '8.644',   '1,4%',  '0,3 km²', 'hl'],
            ['>15° × Alta dens.',   '1.585',   '0,2%',  '0,1 km²', 'hl']
          ]
        );
        appendSectionTitle(el, 'Interpretazione — Vulnerabilità demografica');
        appendText(el,
          'Il <strong>91,5% della popolazione</strong> abita su terreni con pendenza 0–5° (pianura): ' +
          'la città di Palermo è prevalentemente costruita sulla piana alluvionale. ' +
          'Tuttavia, <strong>10.229 residenti</strong> occupano sezioni con pendenza >5°, ' +
          'incluse <strong>10.229 ab. su versanti ripidi</strong> (5–15° e >15°). ' +
          'Le celle colorate in arancione-marrone (alta pendenza × alta densità) — 1.585 ab. — ' +
          'corrispondono a edifici su versanti ripidi nei quartieri periurbani di Mezzomonreale, ' +
          'Boccadifalco e Altarello, dove la densità edilizia si combina con l\'acclività del suolo.'
        );
        appendText(el,
          'Soglie pendenza: pianeggiante <5° · moderato 5–15° · ripido >15°. ' +
          'Soglie densità (terzili): bassa <8.777 · media 8.777–22.389 · alta >22.389 ab/km².'
        );
      }
    },

    usosuolorischio: {
      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="12"/><polyline points="3 9 12 3 21 9"/><line x1="9" y1="21" x2="9" y2="15"/><line x1="15" y1="21" x2="15" y2="15"/><line x1="9" y1="15" x2="15" y2="15"/><path d="M12 3 L12 3" stroke-width="3"/><path d="M4 14 L4 14 M20 14 L20 14" stroke-width="3"/></svg>',
      title: 'DTM × Uso Suolo ISPRA — Edificato su pendenze critiche',
      layer: 'uso-suolo-rischio-layer',
      hasLayer: true,
      render: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
        appendIntro(el,
          'Incrocio tra la <strong>copertura del suolo ISPRA 2023</strong> (EAGLE v5, 10m) e la ' +
          '<strong>pendenza derivata dal DTM 5m</strong>. Vengono evidenziate le superfici ' +
          '<strong>edificate</strong> (codici EAGLE 1110, 1210, 1220 — suolo artificiale continuo, ' +
          'discontinuo e infrastrutture) classificate per pendenza: <strong>bassa ≤15°</strong>, ' +
          '<strong>moderata 15–30°</strong>, <strong>alta >30°</strong>. ' +
          'L\'analisi individua le aree urbane dove l\'edificazione si sovrappone a versanti ' +
          'acclivi, indicatore primario di rischio urbanistico da frana e instabilità.'
        );
        appendRingCard(el, {
          canvasId: 'rp-c-usosuolo',
          title: 'Edificato per classe di pendenza',
          centerVal: '4,8%',
          centerLabel: 'su versanti >15°',
          legendData: [
            { chartLabel: '≤15°',   label: 'Pendenza bassa (≤15°) — rischio basso',      pct: 95.2, color: '#f0c020' },
            { chartLabel: '15–30°', label: 'Pendenza moderata (15–30°) — rischio moderato', pct: 3.5,  color: '#e87810' },
            { chartLabel: '>30°',   label: 'Pendenza alta (>30°) — rischio elevato',      pct: 1.2,  color: '#c81010' }
          ],
          summaries: [
            { val: '63,8',  label: 'km² edificato' },
            { val: '3,05',  label: 'km² su >15°' },
            { val: '0,79',  label: 'km² su >30°' }
          ]
        });
        appendSectionTitle(el, 'Superfici edificate per pendenza');
        appendTable(el,
          ['Categoria', 'Superficie', '% edificato'],
          [
            ['Edificato — pendenza bassa (≤15°)',    '60,70 km²', '95,2%'],
            ['Edificato — pendenza moderata (15–30°)', '2,26 km²',  '3,5%',  'hl'],
            ['Edificato — pendenza alta (>30°)',       '0,79 km²',  '1,2%',  'hl'],
            ['Totale edificato',                       '63,75 km²', '100%'],
            ['Di cui su pendenza critica (>15°)',      '3,05 km²',  '4,8%',  'hl']
          ]
        );
        appendSectionTitle(el, 'Uso del suolo EAGLE');
        appendTable(el,
          ['Codice EAGLE', 'Classe', 'Note'],
          [
            ['1110', 'Suolo artificiale continuo', 'tessuto urbano compatto'],
            ['1210', 'Suolo artificiale discontinuo', 'residenziale, industriale, commerciale'],
            ['1220', 'Infrastrutture di trasporto', 'strade, ferrovie, aree connesse']
          ]
        );
        appendSectionTitle(el, 'Contesto territoriale');
        appendText(el,
          'Il <strong>39,9%</strong> del territorio comunale (63,75 km² su 159,7 km²) risulta ' +
          'classificato come suolo artificiale secondo ISPRA 2023. Di questo edificato, ' +
          'la grande maggioranza (95,2%) si trova su pendenze ≤15° — la piana costiera e la ' +
          'Conca d\'Oro. I <strong>3,05 km² su pendenze >15°</strong> corrispondono principalmente ' +
          'ai quartieri periurbani collinari: Boccadifalco, Mezzomonreale, Santa Maria di Gesù, ' +
          'Altarello e le pendici dei Monti di Palermo. ' +
          'I <strong>0,79 km² su pendenza >30°</strong> rappresentano il rischio più critico: ' +
          'strutture edificate su versanti ripidi dove il rischio di scivolamento e crollo ' +
          'è significativamente amplificato.'
        );
        appendText(el,
          'Fonte uso suolo: ISPRA — Copertura del suolo 2023 (v5), codifica EAGLE a 4 cifre, ' +
          'risoluzione 10m, EPSG:3035 → riproiettato su griglia DTM 5m (EPSG:6875). ' +
          'Pendenza calcolata dal DTM HRDTM5m@italia 5m.'
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
    parseStrongText(div, text);
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
      val.textContent = item.val !== undefined ? item.val : (159.5 * item.pct / 100).toFixed(1);
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

  var isMobile = window.innerWidth < 640;
  var panelOpen = !isMobile;
  var currentAnalysis = null;
  var rpMobileBtn = document.getElementById('rp-mobile-btn');
  var rpBackdrop  = document.getElementById('rp-backdrop');

  if (panelOpen) rpWrap.classList.add('open');
  updateMapControlsPosition(true);

  function setPanel(open) {
    panelOpen = open;
    if (open && typeof window.closeMobilePanels === 'function') window.closeMobilePanels('rp-wrap');
    rpWrap.classList.toggle('open', panelOpen);
    if (rpMobileBtn) rpMobileBtn.classList.toggle('panel-open', panelOpen);
    if (rpBackdrop)  rpBackdrop.classList.toggle('visible', panelOpen && isMobile);
    if (!isMobile) updateMapControlsPosition();
  }
  window.rpSetPanel = setPanel;

  // Quando map.js aggiunge/rimuove .open direttamente (es. click su griglia),
  // sincronizza panelOpen e backdrop senza passare per setPanel.
  if (isMobile) {
    new MutationObserver(function () {
      var isOpen = rpWrap.classList.contains('open');
      if (isOpen === panelOpen) return;
      panelOpen = isOpen;
      if (rpMobileBtn) rpMobileBtn.classList.toggle('panel-open', isOpen);
      if (rpBackdrop)  rpBackdrop.classList.toggle('visible', isOpen);
    }).observe(rpWrap, { attributes: true, attributeFilter: ['class'] });
  }

  // Toggle laterale desktop
  rpToggle.addEventListener('click', function () { setPanel(!panelOpen); });

  // Bottone mobile: apre sempre sulla gallery (non sulla vista punto)
  if (rpMobileBtn) rpMobileBtn.addEventListener('click', function () {
    var isOpen = rpWrap.classList.contains('open');
    if (!isOpen) {
      var rpPunto = document.getElementById('rp-punto');
      rpGallery.style.display = '';
      rpDetail.style.display  = 'none';
      if (rpPunto) rpPunto.style.display = 'none';
    }
    setPanel(!isOpen);
  });

  // Backdrop chiude il pannello
  if (rpBackdrop) rpBackdrop.addEventListener('click', function () { setPanel(false); });

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
    if (analysis.hasLayer && !analysis.noOpacity) {
      rpOpacityBar.classList.remove('hidden');
      var currentOpacity = 1.0;
      try {
        var opKey = analysis.fillLayer ? 'fill-opacity' : 'raster-opacity';
        currentOpacity = map.getPaintProperty(analysis.layer, opKey) || 1.0;
      } catch(e) {}
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
          // extra layers (es. transects-label per profili)
          if (a.extraLayers) {
            a.extraLayers.forEach(function(lyr) {
              try { map.setLayoutProperty(lyr, 'visibility', key === id ? 'visible' : 'none'); } catch(e){}
            });
          }
        });
        // Sync toggle in controls panel se esiste
        var toggleEl = document.getElementById('toggle-' + id);
        if (toggleEl) { toggleEl.checked = true; }
        var opacityRow = document.getElementById(id + '-opacity-row');
        if (opacityRow) { opacityRow.style.display = 'block'; }
        var legend = document.getElementById('legend-' + id);
        if (legend) { legend.classList.add('visible'); }
        // Sync checkbox overlay transetti
        if (typeof window.setTransectsVisible === 'function') {
          window.setTransectsVisible(id === 'profili');
        }
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
      var opProp = (analysis.fillLayer) ? 'fill-opacity' : 'raster-opacity';
      map.setPaintProperty(analysis.layer, opProp, val);
      // Sync slider nel pannello controlli
      var syncSlider = document.getElementById(currentAnalysis + '-opacity-slider');
      if (syncSlider) {
        syncSlider.value = val;
        var syncVal = document.getElementById(currentAnalysis + '-opacity-val');
        if (syncVal) syncVal.textContent = val.toFixed(2);
      }
    } catch(e) {}
  });

  // ── Carica dati transetti profili altimetrici ────────────────────────────
  fetch(new URL('docs/transects_profiles.json', document.baseURI).href)
    .then(function(r){ return r.json(); })
    .then(function(data){ window.transectsProfiles = data; })
    .catch(function(){});

  // ── INIT ────────────────────────────────────────────────────────────────
  // Mostra sempre la gallery all'avvio
  rpGallery.style.display = 'flex';
  rpDetail.style.display = 'none';
  // Imposta opacità iniziale (slider = 1.0)
  rpOpacity.value = 1.0;
  rpOpacityVal.textContent = '1.00';
  map.on('load', function() {
    map.setPaintProperty('elevation-layer', 'raster-opacity', 1.0);
    updateMapControlsPosition();
  });
})();
