// Vista Tecnico: tabella numeri → origine, fonti, regioni, idrologia (rete e bacini),
// profilo del caso 1, cosa non è dimostrato. Legge solo data/qualita.json, non calcola nulla.
// Usabile nel browser (window.TecnicoUI) e in Node (module.exports) per i test.
(function (root, factory) {
  const lib = factory(typeof require === 'function' ? require('./qualita-lib.js') : root.QualitaLib);
  if (typeof module === 'object' && module.exports) module.exports = lib;
  else {
    root.TecnicoLib = lib;
    root.TecnicoUI = {
      costruisci(q, radice, app) {
        lib.costruisciTecnico(q, radice, { profilo: disegnaProfilo, mostraSuMappa: app && app.mostraSuMappa }, root.document);
      },
    };
  }

  // Grafico a tre linee (Chart.js caricato da index.html); se manca, il canvas resta vuoto senza errori.
  function disegnaProfilo(canvas, p) {
    if (!root.Chart) return;
    const serie = (label, dati, colore, tratteggio) => ({
      label, data: dati, borderColor: colore, borderWidth: 1.6, pointRadius: 0, spanGaps: false, borderDash: tratteggio || [],
    });
    new root.Chart(canvas, {
      type: 'line',
      data: {
        labels: p.dist_m,
        datasets: [serie('v1.1', p.v11, '#d1495b'), serie('v1.3', p.v13, '#2b6cb0'), serie('Rilievo laser 2013', p.dsm, '#555', [4, 3])],
      },
      options: {
        animation: false, responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { boxWidth: 14, font: { size: 11 } } } },
        scales: {
          x: { title: { display: true, text: 'distanza lungo il profilo (m)' }, ticks: { maxTicksLimit: 6 } },
          y: { title: { display: true, text: 'quota (m)' } },
        },
      },
    });
  }
})(typeof self !== 'undefined' ? self : this, function (Q) {
  'use strict';

  function costruisciTecnico(q, radice, ctx, doc) {
    const el = (tag, classe, testo) => {
      const e = doc.createElement(tag);
      if (classe) e.className = classe;
      if (testo !== undefined) e.textContent = testo;
      return e;
    };
    const num = chiave => {
      const n = Q.trovaNumero(q, chiave);
      if (!n) return '—';
      const s = el('span', 'num', Q.testoNumero(n));
      s.dataset.numero = chiave;
      s.setAttribute('title', n.origine);
      return s;
    };
    const sezione = (id, titolo) => {
      const s = el('section', 'tec-sez');
      s.dataset.sezione = id;
      s.append(el('div', 'rp-label', titolo));
      return s;
    };
    const tabella = (intestazioni, righe, id) => {
      const wrap = el('div', 'tec-scroll');
      const t = el('table', 'tec-tab');
      if (id) t.dataset.tabella = id;
      if (id === 'numeri') t.className = 'tec-tab tec-impila'; // schede per misura: 5 colonne non entrano nel pannello
      const th = el('tr'); th.dataset.intestazione = '1';
      intestazioni.forEach(h => th.append(el('th', '', h)));
      t.append(th);
      righe.forEach(celle => {
        const tr = el('tr');
        celle.forEach((c, i) => { const td = el('td'); td.setAttribute('data-label', intestazioni[i]); td.append(c); tr.append(td); });
        if (celle.dataset) Object.assign(tr.dataset, celle.dataset);
        t.append(tr);
      });
      wrap.append(t);
      return wrap;
    };
    const coppia = (a, b) => { const s = el('span'); s.append(a, ' / ', b); return s; };
    const pct = v => Q.fmtPct(v, 1) + '%';

    const parti = [];
    parti.push(el('p', 'note', 'Ogni cifra dell\'app arriva da data/qualita.json. Qui sotto: da dove nasce ogni misura.'));

    // 1) tabella dei numeri
    const sNum = sezione('numeri', 'Misure e origine');
    const origineCella = n => {
      const bb = Q.bboxMisura(q, n.chiave);
      if (!bb || !(ctx && ctx.mostraSuMappa)) return n.origine;
      const c = el('span');
      const b = el('button', 'tec-mappa', 'Vedi sulla mappa');
      b.type = 'button';
      b.dataset.mappa = n.chiave;
      b.addEventListener('click', () => ctx.mostraSuMappa(bb));
      c.append(n.origine, el('br'), b);
      return c;
    };
    // Prima i quattro punti della Panoramica (stessa numerazione dei segnaposto), poi i temi generali
    const TEMI = {
      p1: 'Punto 1 · Il punto dove cambia di più', p2: 'Punto 2 · La zona più estesa',
      p3: 'Punto 3 · Ai margini dell\'area misurata', p4: 'Punto 4',
      confronto: 'Confronto v1.1 / v1.3', concentrazione: 'Concentrazione delle differenze',
      traslazione: 'Traslazione', pendenza: 'Pendenza', altreregioni: 'Altre regioni', fonte: 'Fonti del rilievo',
      idro: 'Idrologia', rumore: 'Rumore'
    };
    const ORDINE = ['p1', 'p2', 'p3', 'p4', 'confronto', 'concentrazione', 'traslazione', 'pendenza', 'altreregioni', 'fonte', 'idro', 'rumore'];
    const temaDi = chiave => {
      const pre = chiave.split('.')[0];
      if (pre === 'caso1') return 'p1';
      if (pre === 'regione1') return 'p2';
      if (pre === 'bordi') return 'p3';
      if (pre === 'caso4') return 'p4';
      if (/^regione\d+$/.test(pre)) return 'altreregioni';
      return /^fonte\d+$/.test(pre) ? 'fonte' : pre;
    };
    const perTema = new Map();
    for (const n of Q.numeriMostrati(q)) {
      const t = temaDi(n.chiave);
      if (!perTema.has(t)) perTema.set(t, []);
      perTema.get(t).push([n.chiave, n.testo, origineCella(n)]);
    }
    const gruppi = new Map([...perTema].sort((x, y) => {
      const i = ORDINE.indexOf(x[0]), j = ORDINE.indexOf(y[0]);
      return (i < 0 ? 99 : i) - (j < 0 ? 99 : j);
    }));
    for (const [t, righe] of gruppi) {
      sNum.append(el('div', 'tec-gruppo', (TEMI[t] || t) + ' · ' + righe.length));
      sNum.append(tabella(['Misura', 'Valore', 'Origine'], righe, 'numeri'));
    }
    parti.push(sNum);

    // 2) soglie e file di partenza
    const o = q.origine || {};
    const sOr = sezione('origine', 'File di partenza e soglie');
    const sg = o.soglie || {};
    sOr.append(el('p', 'note', 'v1.1: ' + (o.record || '') + ' · md5 sorgente ' + (o.md5_sorgente || '—') + ' · md5 ritaglio ' + (o.md5_ritaglio || '—')));
    if (o.v13) sOr.append(el('p', 'note', 'v1.3: ' + o.v13.record + ' · md5 sorgente ' + o.v13.md5_sorgente));
    if (o.maschera) sOr.append(el('p', 'note', 'Maschera fonti: ' + o.maschera.file + ' · md5 ' + o.maschera.md5));
    sOr.append(el('p', 'note',
      '«Diversa» = |d| > ' + Q.fmtNum(sg.diversa_m, 2) + ' m. Regione = blocchi di ' + sg.blocco_celle + '×' + sg.blocco_celle +
      ' celle con almeno ' + sg.blocco_min_celle + ' celle valide e più del ' + Q.fmtNum((sg.blocco_frazione || 0) * 100, 0) +
      '% di celle diverse. Cluster = |d| > ' + Q.fmtNum(sg.cluster_m, 0) + ' m, 8-vicini. Bordo = entro ' + sg.bordo_celle + ' celle dal limite dell\'area valida.'));
    parti.push(sOr);

    // 3) fonti
    if (Array.isArray(q.fonti) && q.fonti.length) {
      const sF = sezione('fonti', 'Per fonte del rilievo (maschera)');
      sF.append(tabella(['Fonte', 'Anno', 'Celle', 'Celle diverse', '|d| > 2 m'],
        q.fonti.map(f => [f.nome, f.data || '—', Q.fmtNum(f.celle, 0), pct(f.diverse_pct), pct(f.oltre2_pct)]), 'fonti'));
      parti.push(sF);
    }

    // 4) regioni
    if (Array.isArray(q.regioni) && q.regioni.length) {
      const sR = sezione('regioni', 'Regioni dove la maggior parte delle celle differisce');
      const righe = q.regioni.map(r => {
        const riga = [String(r.id), Q.fmtNum(r.area_km2, 2) + ' km²', String(r.blocchi), pct(r.diverse_pct), pct(r.oltre05_pct)];
        riga.dataset = { regione: String(r.id) };
        return riga;
      });
      sR.append(tabella(['Regione', 'Area', 'Blocchi', 'Celle diverse', '|d| > 0,5 m'], righe, 'regioni'));
      parti.push(sR);
    }

    // 5) idrologia: solo rete e bacini, accanto al controllo di rumore
    if (q.idro && q.controllo_rumore) {
      const sI = sezione('idro', 'Idrologia: rete di drenaggio e bacini');
      sI.append(el('p', 'note',
        'Solo la rete (celle con accumulo di almeno ' + Q.fmtNum(q.idro.soglia_rete_celle, 0) + ') e i bacini; l\'indicatore è la sovrapposizione tra le due reti (1 = identiche). ' +
        'Il controllo di rumore applica un errore casuale di ' + Q.fmtNum(q.controllo_rumore.sigma_m, 2) + ' m alla v1.1: è un limite superiore, perché gli errori veri sono correlati nello spazio.'));
      sI.append(tabella(['Misura', 'v1.1 contro v1.3', 'Controllo di rumore'], [
        ['Sovrapposizione della rete', num('idro.rete_jaccard'), num('rumore.rete_jaccard')],
        ['Bacini concordanti', num('idro.bacini_accordo_pct'), num('rumore.bacini_accordo_pct')],
        ['Numero di bacini', coppia(num('idro.bacini_a'), num('idro.bacini_b')), String(q.controllo_rumore.bacini_n)],
        ['Rete vicino alle celle diverse (≤ ' + q.idro.vicino_distanza_m + ' m)', num('idro.vicino_rete_jaccard'), '—'],
        ['Rete lontano dalle celle diverse', num('idro.lontano_rete_jaccard'), '—'],
      ], 'idro'));
      parti.push(sI);
    }

    // 6) profilo del caso 1
    const p = q.caso1 && q.caso1.profilo;
    if (p && Array.isArray(p.dist_m)) {
      const sP = sezione('profilo', 'Profilo nel punto dove cambia di più');
      const box = el('div', 'tec-grafico');
      const canvas = el('canvas');
      canvas.setAttribute('aria-label', 'Profilo di quota: v1.1, v1.3 e rilievo laser 2013');
      box.append(canvas);
      sP.append(box, el('p', 'note', 'Tre linee sulla stessa traccia: v1.1, v1.3 e il rilievo laser del 2013 (indipendente dalla procedura a 5 m, non dalla fonte).'));
      parti.push(sP);
      if (ctx && ctx.profilo) ctx.profilo(canvas, p);
    }

    // 7) cosa non è dimostrato
    const sN = sezione('non-dimostrato', 'Non dimostrato');
    const ul = el('ul', 'tec-lista');
    (q.non_dimostrato || []).forEach(t => ul.append(el('li', '', t)));
    sN.append(ul);
    parti.push(sN);

    radice.replaceChildren(...parti);
  }

  return { costruisciTecnico };
});
