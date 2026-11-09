// Vista Panoramica: il numero «95,2% identico» e tre casi concreti. Costruisce il pannello da data/qualita.json
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
          vaiA: app.vaiA, toast: app.toast,
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
  const TITOLI = {
    1: 'Il punto dove cambia di più',
    2: 'La zona più estesa',
    3: 'Ai margini dell\'area misurata',
  };

  function bboxCaso(q, n) {
    if (n === 1) return q.caso1 && q.caso1.bbox_wgs84;
    if (n === 2) return q.regioni && q.regioni[0] && q.regioni[0].bbox_wgs84;
    return q.origine && q.origine.griglia && q.origine.griglia.bbox_wgs84;
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

    const intro = el('div', 'rp-label', 'Tre punti da guardare');
    const casi = [1, 2, 3].map(n => {
      const box = el('div', 'caso-box');
      const b = el('button', 'caso');
      b.setAttribute('type', 'button');
      b.dataset.caso = String(n);
      const testo = el('span', 'caso-txt');
      testo.append(...Q.fraseCasoParti(q, n).map(p => {
        if (typeof p === 'string') return p;
        return num(p.chiave, p.segno, p.assoluto);
      }));
      b.append(el('b', 'caso-t', n + ' · ' + TITOLI[n]), testo);
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
    radice.replaceChildren(cose, testa, intro, ...casi, nota);
  }

  return { distanzaM, vicinoAlCaso1, posizioneCursore, costruisciPanoramica };
});
