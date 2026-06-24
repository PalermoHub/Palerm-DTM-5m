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
          'Quota media comunale <strong>183 m</strong> s.l.m. su un\'area di 158,9 km². ' +
          'Quasi il <strong>70% della superficie</strong> ricade sotto i 200 m: la Conca d\'Oro e le zone ' +
          'costiere dominano il profilo basso. Il territorio si estende però verticalmente per oltre un chilometro — ' +
          'dalla riva del mare fino ai rilievi dei Monti di Palermo. ' +
          'Il Centro Storico è interamente sotto i 50 m (quota media 14,5 m); ' +
          'la Circoscrizione VI Nord-Ovest è la più elevata in media (<strong>271 m</strong>).'
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
            { val: '158.9', label: 'km² area' },
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
            { rank:8, label:'I · Centro Storico',  val:1.5,  classi:{c1:88.4, c2:8.8,  c3:1.5,  c4:0.0,  c5:0.0}  }
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
          maxVal: 89.7,
          classes: BUILD_CLASSES,
          items: [
            { rank:1, label:'I · Centro Storico',  val:89.7, classi:{c1:89.7, c2:8.8,  c3:1.5,  c4:0.0,  c5:0.0}  },
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
            { rank:1, label:'I · Centro Storico',  val:33.9, classi:{c_conv:33.9, c_plan:33.4, c_div:32.7} },
            { rank:2, label:'VIII · Libertà',      val:30.8, classi:{c_conv:30.8, c_plan:40.5, c_div:28.7} },
            { rank:3, label:'V · Noce',            val:29.0, classi:{c_conv:29.0, c_plan:42.0, c_div:29.0} },
            { rank:4, label:'VII · Mondello',      val:28.5, classi:{c_conv:28.5, c_plan:42.5, c_div:29.0} },
            { rank:5, label:'II · Resuttana',      val:26.8, classi:{c_conv:26.8, c_plan:46.2, c_div:27.0} },
            { rank:6, label:'VI · Nord-Ovest',     val:26.4, classi:{c_conv:26.4, c_plan:47.5, c_div:26.1} },
            { rank:7, label:'III · Oreto',         val:26.2, classi:{c_conv:26.2, c_plan:47.5, c_div:26.3} },
            { rank:8, label:'IV · Mezzomonreale',  val:26.0, classi:{c_conv:26.0, c_plan:47.2, c_div:26.7} }
          ]
        });
        appendRankingCard(el, {
          title: 'Top Quartieri · curvatura planare',
          subtitle: '% superficie convergente',
          unit: '%',
          maxVal: 36.0,
          classes: CP_CLASSES,
          items: [
            { rank:1, label:'Noce',                               val:36.0, classi:{c_conv:36.0, c_plan:27.8, c_div:36.2} },
            { rank:2, label:'Palazzo Reale - Monte di Pietà',     val:35.5, classi:{c_conv:35.5, c_plan:29.3, c_div:35.2} },
            { rank:3, label:'Oreto - Stazione',                   val:32.5, classi:{c_conv:32.5, c_plan:33.3, c_div:34.2} },
            { rank:4, label:'Cuba - Calatafimi',                  val:32.0, classi:{c_conv:32.0, c_plan:35.4, c_div:32.7} },
            { rank:5, label:'Brancaccio - Ciaculli',              val:31.7, classi:{c_conv:31.7, c_plan:37.8, c_div:30.5} },
            { rank:6, label:'Villagrazia - Falsomiele',           val:30.4, classi:{c_conv:30.4, c_plan:38.5, c_div:31.1} },
            { rank:7, label:'Cruillas - S.Giovanni Apostolo',     val:29.7, classi:{c_conv:29.7, c_plan:41.0, c_div:29.3} },
            { rank:8, label:'Montepellegrino',                    val:29.6, classi:{c_conv:29.6, c_plan:41.4, c_div:29.0} }
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
            { rank:1, label:'VI · Nord-Ovest',     val:25.8, classi:{c_conv:24.2, c_lin:50.0, c_cvx:25.8} },
            { rank:2, label:'III · Oreto',         val:25.7, classi:{c_conv:25.6, c_lin:48.7, c_cvx:25.7} },
            { rank:3, label:'VII · Mondello',      val:25.3, classi:{c_conv:24.3, c_lin:50.4, c_cvx:25.3} },
            { rank:4, label:'IV · Mezzomonreale',  val:25.1, classi:{c_conv:25.1, c_lin:49.8, c_cvx:25.1} },
            { rank:5, label:'II · Resuttana',      val:24.9, classi:{c_conv:24.6, c_lin:50.5, c_cvx:24.9} },
            { rank:6, label:'V · Noce',            val:24.9, classi:{c_conv:25.2, c_lin:49.9, c_cvx:24.9} },
            { rank:7, label:'VIII · Libertà',      val:24.4, classi:{c_conv:23.8, c_lin:51.8, c_cvx:24.4} },
            { rank:8, label:'I · Centro Storico',  val:23.3, classi:{c_conv:23.0, c_lin:53.7, c_cvx:23.3} }
          ]
        });
        appendRankingCard(el, {
          title: 'Top Quartieri · curvatura profilo',
          subtitle: '% superficie convessa',
          unit: '%',
          maxVal: 29.2,
          classes: CPR_CLASSES,
          items: [
            { rank:1, label:'Borgo Nuovo',                        val:29.2, classi:{c_conv:27.8, c_lin:43.0, c_cvx:29.2} },
            { rank:2, label:'Boccadifalco',                       val:28.6, classi:{c_conv:28.4, c_lin:43.0, c_cvx:28.6} },
            { rank:3, label:'Montepellegrino',                    val:27.8, classi:{c_conv:25.6, c_lin:46.6, c_cvx:27.8} },
            { rank:4, label:'Partanna Mondello',                  val:27.5, classi:{c_conv:25.5, c_lin:47.0, c_cvx:27.5} },
            { rank:5, label:'Arenella - Vergine Maria',           val:27.4, classi:{c_conv:27.2, c_lin:45.4, c_cvx:27.4} },
            { rank:6, label:'Villagrazia - Falsomiele',           val:26.5, classi:{c_conv:26.3, c_lin:47.2, c_cvx:26.5} },
            { rank:7, label:'Resuttana - San Lorenzo',            val:26.3, classi:{c_conv:26.5, c_lin:47.2, c_cvx:26.3} },
            { rank:8, label:'Tommaso Natale - Sferracavallo',     val:25.6, classi:{c_conv:25.8, c_lin:48.6, c_cvx:25.6} }
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
            { rank:1, label:'III · Oreto',        val:55.8, classi:{c_concava:4.2,  c_lbassa:19.5, c_piano:55.8, c_lalta:15.2, c_convessa:5.3} },
            { rank:2, label:'I · Centro Storico', val:55.0, classi:{c_concava:4.5,  c_lbassa:18.0, c_piano:55.0, c_lalta:16.0, c_convessa:6.5} },
            { rank:3, label:'V · Noce',           val:52.8, classi:{c_concava:5.1,  c_lbassa:18.8, c_piano:52.8, c_lalta:17.4, c_convessa:5.9} },
            { rank:4, label:'VIII · Libertà',     val:52.5, classi:{c_concava:4.8,  c_lbassa:19.3, c_piano:52.5, c_lalta:17.5, c_convessa:5.9} },
            { rank:5, label:'II · Resuttana',     val:52.0, classi:{c_concava:4.6,  c_lbassa:19.8, c_piano:52.0, c_lalta:17.9, c_convessa:5.7} },
            { rank:6, label:'IV · Mezzomonreale', val:50.2, classi:{c_concava:4.6,  c_lbassa:21.6, c_piano:50.2, c_lalta:17.5, c_convessa:6.1} },
            { rank:7, label:'VI · Nord-Ovest',    val:47.0, classi:{c_concava:5.9,  c_lbassa:21.9, c_piano:47.0, c_lalta:18.6, c_convessa:6.5} },
            { rank:8, label:'VII · Mondello',     val:44.1, classi:{c_concava:7.0,  c_lbassa:22.1, c_piano:44.1, c_lalta:19.8, c_convessa:7.1} }
          ]
        });
        appendRankingCard(el, {
          title: 'Top Quartieri · curvatura totale',
          subtitle: '% superficie piana',
          unit: '%',
          maxVal: 69.0,
          classes: CT_CLASSES,
          items: [
            { rank:1, label:'Boccadifalco',                       val:69.0, classi:{c_concava:3.0, c_lbassa:10.8, c_piano:69.0, c_lalta:12.5, c_convessa:4.7} },
            { rank:2, label:'Oreto - Stazione',                   val:65.3, classi:{c_concava:3.2, c_lbassa:13.5, c_piano:65.3, c_lalta:13.4, c_convessa:4.6} },
            { rank:3, label:'Cuba - Calatafimi',                   val:58.1, classi:{c_concava:4.8, c_lbassa:17.0, c_piano:58.1, c_lalta:14.5, c_convessa:5.5} },
            { rank:4, label:'Palazzo Reale - Monte di Pietà',     val:57.2, classi:{c_concava:4.6, c_lbassa:16.8, c_piano:57.2, c_lalta:15.2, c_convessa:6.2} },
            { rank:5, label:'Noce',                               val:55.9, classi:{c_concava:5.1, c_lbassa:16.0, c_piano:55.9, c_lalta:17.0, c_convessa:6.1} },
            { rank:6, label:'Cruillas - S.Giovanni Apostolo',     val:54.8, classi:{c_concava:5.0, c_lbassa:18.2, c_piano:54.8, c_lalta:16.0, c_convessa:6.0} },
            { rank:7, label:'Villagrazia - Falsomiele',           val:53.5, classi:{c_concava:4.8, c_lbassa:19.5, c_piano:53.5, c_lalta:17.0, c_convessa:5.2} },
            { rank:8, label:'Resuttana - San Lorenzo',            val:53.5, classi:{c_concava:5.3, c_lbassa:19.4, c_piano:53.5, c_lalta:16.6, c_convessa:5.2} }
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
      var currentOpacity = 1.0;
      try { currentOpacity = map.getPaintProperty(analysis.layer, 'raster-opacity') || 1.0; } catch(e) {}
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
  // Imposta opacità iniziale (slider = 1.0)
  rpOpacity.value = 1.0;
  rpOpacityVal.textContent = '1.00';
  map.on('load', function() {
    map.setPaintProperty('elevation-layer', 'raster-opacity', 1.0);
    updateMapControlsPosition();
  });
})();
