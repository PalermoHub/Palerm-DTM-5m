// Vista Panoramica: il numero «95,2% identico» e quattro casi concreti. Costruisce il pannello da data/qualita.json
// (nessun calcolo, nessuna cifra scritta a mano) e contiene le funzioni pure del cursore prima/dopo.
// Usabile nel browser (window.PanoramicaUI) e in Node (module.exports) per i test.
(function (root, factory) {
  const lib = factory(typeof require === 'function' ? require('./qualita-lib.js') : root.QualitaLib);
  if (typeof module === 'object' && module.exports) module.exports = lib;
  else {
    root.PanoramicaLib = lib;
    root.PanoramicaUI = {
      costruisci(q, radice, app) {
        lib.costruisciPanoramica(q, radice, {
          vaiA: app.vaiA, toast: app.toast, vette: app.vette,
          get confronto() { return root.ConfrontoCaso1; },
        }, root.document);
      },
    };
  }
})(typeof self !== 'undefined' ? self : this, function (Q) {
  'use strict';

  // ── funzioni pure ────────────────────────────────────────
  function distanzaM(lng1, lat1, lng2, lat2) {
    const R = 6371000, rad = x => x * Math.PI / 180;
    const dLat = rad(lat2 - lat1), dLng = rad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  // Il confronto prima/dopo vale solo attorno al caso 1 (le tile del rilievo coprono solo quella zona).
  function vicinoAlCaso1(q, centro, soglia = 1000) {
    const c = q && q.caso1;
    if (!c || typeof c.lon !== 'number' || typeof c.lat !== 'number') return false;
    return distanzaM(centro.lng, centro.lat, c.lon, c.lat) <= soglia;
  }

  // Nuova posizione (in %) della maniglia dopo un tasto; null se il tasto non la riguarda.
  function posizioneCursore(pct, tasto) {
    const passo = { ArrowLeft: -2, ArrowDown: -2, ArrowRight: 2, ArrowUp: 2, Home: -100, End: 100 }[tasto];
    if (passo === undefined) return null;
    return Math.max(2, Math.min(98, pct + passo));
  }

  // ── costruzione del pannello ─────────────────────────────
  // I quattro punti si distinguono con le lettere A-D, così non si confondono con le vette numerate 1-8.
  const lettera = n => 'ABCD'[n - 1] || String(n);

  const TITOLI = {
    1: 'Il punto dove cambia di più',
    2: 'La zona più estesa',
    3: 'Ai margini dell\'area misurata',
    4: 'Una fascia sul fianco di Monte Pellegrino',
  };

  // Dove mettere il segnaposto di ciascun caso: caso 1 = centro del cluster, caso 2 = centro della regione principale,
  // caso 3 = metà del lato ovest dell'area misurata (il bordo non ha un punto solo: è solo un'indicazione).
  function posizioniCasi(q) {
    const out = [];
    const c1 = q && q.caso1, r1 = q && q.regioni && q.regioni[0];
    const g = q && q.origine && q.origine.griglia && q.origine.griglia.bbox_wgs84;
    const ok = x => typeof x === 'number' && isFinite(x);
    if (c1 && ok(c1.lon) && ok(c1.lat)) out.push({ n: 1, lng: c1.lon, lat: c1.lat, titolo: TITOLI[1], bbox: bboxCaso(q, 1) });
    if (r1 && ok(r1.lon) && ok(r1.lat)) out.push({ n: 2, lng: r1.lon, lat: r1.lat, titolo: TITOLI[2], bbox: bboxCaso(q, 2) });
    if (Array.isArray(g) && g.every(ok)) out.push({ n: 3, lng: g[0], lat: (g[1] + g[3]) / 2, titolo: TITOLI[3], bbox: g });
    const c4 = q && q.caso4;
    if (c4 && ok(c4.lon) && ok(c4.lat) && Array.isArray(c4.bbox_wgs84)) out.push({ n: 4, lng: c4.lon, lat: c4.lat, titolo: TITOLI[4], bbox: c4.bbox_wgs84 });
    return out;
  }

  function bboxCaso(q, n) {
    if (n === 1) return q.caso1 && q.caso1.bbox_wgs84;
    if (n === 2) return q.regioni && q.regioni[0] && q.regioni[0].bbox_wgs84;
    if (n === 4) return q.caso4 && q.caso4.bbox_wgs84;
    return q.origine && q.origine.griglia && q.origine.griglia.bbox_wgs84;
  }

  // Stessa rampa della legenda «Quota» e delle tile del rilievo (scripts/genera_dem_tile.py), interpolata sulla quota.
  const RAMPA = [[0, 168, 201, 160], [50, 205, 222, 170], [150, 232, 224, 160], [300, 214, 188, 130],
    [500, 186, 150, 110], [750, 160, 128, 104], [1050, 235, 232, 228]];
  function coloreQuota(m) {
    const z = Math.max(RAMPA[0][0], Math.min(RAMPA[RAMPA.length - 1][0], m));
    let i = 1; while (i < RAMPA.length - 1 && z > RAMPA[i][0]) i++;
    const a = RAMPA[i - 1], b = RAMPA[i], t = (z - a[0]) / (b[0] - a[0]);
    const c = [1, 2, 3].map(k => Math.round(a[k] + (b[k] - a[k]) * t));
    const chiaro = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) > 170;
    return { css: 'rgb(' + c.join(',') + ')', testo: chiaro ? '#1a2a50' : '#fff' };
  }

  // Riquadro (ovest, sud, est, nord) di ~2 km attorno a una vetta, per portarci la mappa.
  function bboxVetta(v, mezzo = 0.011) {
    return [v.lon - mezzo, v.lat - mezzo * 0.8, v.lon + mezzo, v.lat + mezzo * 0.8];
  }

  // Classifica delle vette: barre proporzionali alla quota, la più alta a 100%, ognuna porta la mappa sulla vetta.
  function costruisciVette(ctx, el) {
    const v = ctx.vette && Array.isArray(ctx.vette.vette) ? ctx.vette.vette : [];
    if (!v.length) return [];
    const max = Math.max(...v.map(x => x.quota_m));
    const fmt = x => Math.round(x).toLocaleString('it-IT');
    const titolo = el('div', 'rp-label', 'Le vette attorno a Palermo');
    const sotto = el('p', 'pan-sotto', 'I rilievi che chiudono la Conca d\'Oro, dalla cima più alta in giù (una per massiccio). Clicca per andarci.');
    const lista = el('ol', 'vette');
    for (const x of v) {
      const li = el('li', 'vetta');
      const b = el('button', 'vetta-b');
      b.dataset.vetta = String(x.n);
      b.setAttribute('type', 'button');
      b.title = x.nota + ' · quota OSM ' + fmt(x.osm_ele_m) + ' m';
      const nome = el('span', 'vetta-n'); nome.append(el('b', null, String(x.n)), ' ' + x.nome);
      const barra = el('span', 'vetta-barra');
      const riemp = el('span', 'vetta-riemp');
      riemp.setAttribute('style', 'width:' + (x.quota_m / max * 100).toFixed(1) + '%;background:' + coloreQuota(x.quota_m).css);
      barra.append(riemp);
      const q = el('span', 'vetta-q', fmt(x.quota_m) + ' m');
      b.append(nome, barra, q);
      b.addEventListener('click', () => { if (ctx.vaiA) ctx.vaiA(bboxVetta(x)); });
      li.append(b);
      lista.append(li);
    }
    const nota = el('p', 'note', ctx.vette.fonte);
    return [titolo, sotto, lista, nota];
  }

  function costruisciPanoramica(q, radice, ctx, doc) {
    const el = (tag, classe, testo) => {
      const e = doc.createElement(tag);
      if (classe) e.className = classe;
      if (testo !== undefined) e.textContent = testo;
      return e;
    };
    // ogni cifra è un <span data-numero="chiave"> che rimanda al registro e mostra l'origine al passaggio
    const num = (chiave, segno, assoluto) => {
      const n = Q.trovaNumero(q, chiave);
      if (!n) return '—';
      const s = el('span', 'num', (segno && n.valore > 0 ? '+' : '') + Q.testoNumero(n, assoluto));
      s.dataset.numero = chiave;
      s.setAttribute('title', n.origine);
      return s;
    };

    // 1) cos'è: un curioso deve capire di cosa si parla prima di vedere un numero
    const cose = el('p', 'pan-cose');
    cose.append('Un modello digitale del terreno dice, per ogni quadrato di 5 m di lato (una «cella»), a che quota sta il suolo. ',
      'Di quello d\'Italia esistono due versioni, la 1.1 e la 1.3: qui le confrontiamo su Palermo, cella per cella.');

    // 2) il risultato
    const testa = el('div', 'pan-testa');
    const grande = el('div', 'pan-grande');
    grande.append(num('confronto.identiche_pct'), ' identico');
    const sotto = el('p', 'pan-sotto');
    sotto.append('delle celle di Palermo ha la stessa quota nelle due versioni (su ', num('confronto.celle_comuni'),
      ' confrontate). Dove differiscono, quasi sempre di poco: solo ', num('confronto.oltre_2'),
      ' delle celle cambia di più di 2 m.');
    // 3) come leggere la mappa
    const mappa = el('p', 'pan-sotto');
    mappa.append('Sulla mappa: verde chiaro dove le due versioni coincidono; in colore dove differiscono (blu: la v1.3 è più bassa, rosso: più alta).');
    const conc = el('p', 'pan-sotto');
    conc.append('Le differenze sono concentrate: il ', num('concentrazione.quota_top10'),
      ' delle celle diverse sta nel 10% dei blocchi di mappa da 500 m più colpiti.');
    testa.append(grande, sotto, mappa, conc);

    const intro = el('div', 'rp-label', 'Quattro punti da guardare');
    const casi = [1, 2, 3, 4].filter(n => !!bboxCaso(q, n)).map(n => {
      const box = el('div', 'caso-box');
      const b = el('button', 'caso');
      b.setAttribute('type', 'button');
      b.dataset.caso = lettera(n);
      const testo = el('span', 'caso-txt');
      testo.append(...Q.fraseCasoParti(q, n).map(p => {
        if (typeof p === 'string') return p;
        return num(p.chiave, p.segno, p.assoluto);
      }));
      b.append(el('b', 'caso-t', lettera(n) + ' · ' + TITOLI[n]), testo);
      b.addEventListener('click', () => {
        const bb = bboxCaso(q, n);
        if (bb && ctx.vaiA) ctx.vaiA(bb);
      });
      box.append(b);
      if (n === 1) {
        const c = el('button', 'pill', 'Confronta il rilievo prima e dopo');
        c.setAttribute('type', 'button');
        c.dataset.azione = 'confronto';
        c.addEventListener('click', () => { if (ctx.confronto) ctx.confronto.apri(); });
        box.append(c);
      }
      return box;
    });

    const nota = el('p', 'note',
      'Queste misure dicono dove le due versioni differiscono, non quale sia più vicina al terreno vero: per quello servirebbero quote misurate sul posto. Dettagli e comandi per rigenerare ogni numero nella vista Tecnico.');
    radice.replaceChildren(cose, testa, intro, ...casi, ...costruisciVette(ctx, el), nota);
  }

  return { coloreQuota, lettera, bboxVetta, posizioniCasi, bboxCaso, distanzaM, vicinoAlCaso1, posizioneCursore, costruisciPanoramica };
});
