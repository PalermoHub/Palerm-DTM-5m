// Formattazione it-IT e registro dei numeri di data/qualita.json (nessuna dipendenza dal DOM).
// Usabile nel browser (window.QualitaLib) e in Node (module.exports) per i test.
(function (root, factory) {
  const lib = factory();
  if (typeof module === 'object' && module.exports) module.exports = lib;
  else root.QualitaLib = lib;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const NON_DISPONIBILE = '—';

  function fmtNum(v, d = 1) {
    if (typeof v !== 'number' || !Number.isFinite(v)) return NON_DISPONIBILE;
    return v.toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  // Percentuale: mai "100" per un valore sotto 100, mai "0" per un valore positivo.
  function fmtPct(v, d = 1) {
    if (typeof v !== 'number' || !Number.isFinite(v)) return NON_DISPONIBILE;
    if (v === 0) return fmtNum(0, d);
    if (v > 0 && v < 0.01) return '< 0,01';
    let dec = d;
    const rotto = x => (v > 0 && x === 0) || (v < 100 && x >= 100);
    while (dec < 4 && rotto(Number(v.toFixed(dec)))) dec += 1;
    if (v < 100 && Number(v.toFixed(dec)) >= 100) return '> 99,9999';
    return fmtNum(v, dec);
  }

  // assoluto = true: mostra il modulo (il segno lo dice il testo, es. «più alta di 36,3 m»)
  function testoNumero(n, assoluto = false) {
    const v = assoluto ? Math.abs(n.valore) : n.valore;
    if (n.unita === '%') return fmtPct(v, n.decimali) + '%';
    return fmtNum(v, n.decimali) + (n.unita ? ' ' + n.unita : '');
  }

  function verificaQualita(q) {
    if (!q || typeof q !== 'object') return { ok: false, motivo: 'dati assenti' };
    for (const k of ['origine', 'confronto']) {
      if (!q[k] || typeof q[k] !== 'object') return { ok: false, motivo: 'manca la sezione ' + k };
    }
    if (!Array.isArray(q.numeri) || q.numeri.length === 0) return { ok: false, motivo: 'registro dei numeri vuoto' };
    return { ok: true };
  }

  // Ogni numero mostrato ha origine, comando di rigenerazione e test: altrimenti non si mostra.
  function numeriMostrati(q) {
    return q.numeri.map(n => {
      for (const campo of ['chiave', 'origine', 'comando', 'test']) {
        if (!n[campo]) throw new Error('numero ' + (n.chiave || '?') + ': manca ' + campo);
      }
      return { chiave: n.chiave, testo: testoNumero(n), origine: n.origine, comando: n.comando, test: n.test };
    });
  }

  const trova = (q, chiave) => q.numeri.find(n => n.chiave === chiave);
  const trovaNumero = (q, chiave) => (q && Array.isArray(q.numeri) && trova(q, chiave)) || null;

  // Riquadro WGS84 su cui portare la mappa per una misura, o null se la misura non ha un posto sulla mappa
  // (idrologia, rumore, fasce di pendenza: nessun layer corrispondente, quindi nessun pulsante).
  function bboxMisura(q, chiave) {
    if (!q || typeof chiave !== 'string') return null;
    const [gruppo] = chiave.split('.');
    const m = /^regione(\d+)$/.exec(gruppo);
    if (m) {
      const r = (q.regioni || []).find(x => x.id === Number(m[1]));
      return (r && r.bbox_wgs84) || null;
    }
    if (gruppo === 'caso1') return (q.caso1 && q.caso1.bbox_wgs84) || null;
    // confronto e blocchi più colpiti: zoom sulla regione che raccoglie più blocchi con più del 50% di celle diverse
    // (l'unione di tutte le regioni darebbe uno zoom largo quanto la città, inutile)
    if (gruppo === 'confronto' || chiave === 'concentrazione.blocchi_sopra_50pct' || chiave === 'concentrazione.quota_top10') {
      const r = (q.regioni || []).filter(x => x.bbox_wgs84).sort((x, y) => y.blocchi - x.blocchi)[0];
      return r ? r.bbox_wgs84 : null;
    }
    return null;
  }

  // Testi dei tre casi in linguaggio semplice: nessuna sigla, ogni cifra viene dal registro.
  function modello(q, n) {
    if (n === 1) {
      const m = trovaNumero(q, 'caso1.media_d');
      const x = trovaNumero(q, 'caso1.dsm_meno_x'), y = trovaNumero(q, 'caso1.dsm_meno_y');
      const parti = ['In una zona piccola, di ', { chiave: 'caso1.area_km2' }, ', la v1.3 è in media ',
        { chiave: 'caso1.media_d', assoluto: true }, m && m.valore < 0 ? ' più bassa' : ' più alta', ' della v1.1.'];
      if (x && y) {
        // il rilievo laser del 2013 sta dalla parte della versione con lo scarto minore
        parti.push(' Un rilievo laser del 2013 è ', Math.abs(x.valore) < Math.abs(y.valore) ? 'più vicino alla v1.1.' : 'più vicino alla v1.3.');
      }
      return parti;
    }
    if (n === 2) {
      return ['In un\'area di ', { chiave: 'regione1.area_km2' }, ' il ', { chiave: 'regione1.oltre05_pct' },
        ' delle celle cambia di più di mezzo metro. Nel resto della città le differenze crescono con la pendenza: ',
        { chiave: 'pendenza.10_20_diverse_pct' }, ' di celle diverse tra 10° e 20°, ',
        { chiave: 'pendenza.0_2_diverse_pct' }, ' in pianura.'];
    }
    if (n === 3) {
      return ['Vicino al bordo dell\'area misurata la quota di celle diverse è più alta (', { chiave: 'bordi.0_2_diverse_pct' },
        '), ma sono poche: ', { chiave: 'bordi.celle' }, ' su ', { chiave: 'confronto.celle_comuni' }, '.'];
    }
    return null;
  }

  // Segmenti: stringhe e {chiave}. Se un numero manca, tutto il caso diventa un avviso (mai "undefined").
  function fraseCasoParti(q, n) {
    const parti = modello(q, n);
    if (!parti) return ['Caso non previsto.'];
    for (const p of parti) {
      if (typeof p === 'object' && !trova(q, p.chiave)) return ['Dati di questo caso non disponibili.'];
    }
    return parti.map(p => (typeof p === 'object' ? { chiave: p.chiave, segno: !!p.segno, assoluto: !!p.assoluto } : p));
  }

  function fraseCaso(q, n) {
    return fraseCasoParti(q, n).map(p => {
      if (typeof p === 'string') return p;
      const num = trova(q, p.chiave);
      return (p.segno && num.valore > 0 ? '+' : '') + testoNumero(num, p.assoluto);
    }).join('');
  }

  // Legenda della mappa delle differenze: colori e etichette arrivano dai dati (scripts/palette.py).
  function legendaDiff(q) {
    const p = q && q.palette_diff;
    if (!p || !Array.isArray(p.cols)) return [];
    const classi = p.cols.map((c, i) => ({ colore: 'rgb(' + c.join(',') + ')', etichetta: p.etichette[i] }));
    // «identica» per prima: è il territorio che non cambia, sfondo su cui risaltano le differenze
    return p.identica ? [{ colore: 'rgb(' + p.identica.col.join(',') + ')', etichetta: p.identica.etichetta }, ...classi] : classi;
  }

  return { fmtNum, fmtPct, testoNumero, verificaQualita, numeriMostrati, fraseCasoParti, fraseCaso, legendaDiff, trovaNumero, bboxMisura };
});
