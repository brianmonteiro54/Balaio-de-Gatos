/* ===== bloco 1 ===== */

// ====== CONFUSION MATRIX INTERACTION ======
  const cellData = {
    tp: {
      title: "VP - Verdadeiro Positivo (acerto certo)",
      text: "O modelo disse \"é gato\" E era gato mesmo. Isso aqui é dinheiro no bolso. <strong>É o que você quer maximizar</strong>.",
      example: "Foto: 🐈 (era gato) → Modelo: <strong>\"É gato!\"</strong> → ✓ Acertou. 35 vezes."
    },
    fp: {
      title: "FP - Falso Positivo (alarme falso)",
      text: "O modelo disse \"é gato\", mas <strong>não era</strong>. Cachorro disfarçado virou gato. Quando o custo de errar pra cima dói, esse número aqui precisa ser baixo.",
      example: "Foto: 🐶 (era cachorro) → Modelo: <strong>\"É gato!\"</strong> → ✗ Errou. 10 vezes."
    },
    fn: {
      title: "FN - Falso Negativo (deixou escapar)",
      text: "Era um <strong>gato de verdade</strong>, e o modelo passou batido. Quando o custo de perder algo importante é alto (câncer, fraude), <strong>esse é o erro que mais dói</strong>.",
      example: "Foto: 🐈 (era gato) → Modelo: <strong>\"Não é gato\"</strong> → ✗ Perdeu o gato. 5 vezes."
    },
    tn: {
      title: "VN - Verdadeiro Negativo (recusa correta)",
      text: "O modelo disse \"não é gato\" e <strong>realmente não era</strong>. O cachorro não foi confundido. É bom, mas em muitas métricas (Precisão, Recall, F1) esse número <em>nem participa</em> do cálculo.",
      example: "Foto: 🐶 (era cachorro) → Modelo: <strong>\"Não é gato\"</strong> → ✓ Acertou. 50 vezes."
    }
  };

  document.querySelectorAll('.matrix-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      document.querySelectorAll('.matrix-cell').forEach(c => c.classList.remove('active'));
      cell.classList.add('active');
      const key = cell.dataset.cell;
      const data = cellData[key];
      const titleEl = document.getElementById('me-title');
      const textEl = document.getElementById('me-text');
      const text2El = document.getElementById('me-text-2');
      const exEl = document.getElementById('me-example');
      titleEl.textContent = data.title;
      textEl.innerHTML = data.text;
      text2El.style.display = 'none';
      exEl.innerHTML = '<strong>Exemplo:</strong> ' + data.example;
    });
  });

  // ====== PHOTO GRIDS ======
  // Builds a 100-photo grid showing the desired classification
  // type = 'accuracy' | 'precision' | 'recall'
  function buildPhotoGrid(containerId, type) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = '';
    // We have: 35 TP, 5 FN, 10 FP, 50 TN. Total 100.
    // Order: first TPs, then FNs (real cats), then FPs, then TNs (non-cats).
    // Display in 10 columns x 10 rows.
    const cells = [];
    for (let i = 0; i < 35; i++) cells.push('tp');
    for (let i = 0; i < 5; i++) cells.push('fn');
    for (let i = 0; i < 10; i++) cells.push('fp');
    for (let i = 0; i < 50; i++) cells.push('tn');

    cells.forEach((kind, idx) => {
      const d = document.createElement('div');
      d.className = 'photo';
      // For accuracy: show "correct" vs "wrong"
      if (type === 'accuracy') {
        if (kind === 'tp' || kind === 'tn') d.classList.add('tp'); // green
        else d.classList.add('fn'); // red
        d.textContent = (kind === 'tp' || kind === 'fn') ? '🐈' : '🐶';
      } else if (type === 'precision') {
        // Highlight only what model predicted POSITIVE: tp + fp; rest dimmed
        if (kind === 'tp') { d.classList.add('tp'); d.textContent = '🐈'; }
        else if (kind === 'fp') { d.classList.add('fp'); d.textContent = '🐶'; }
        else { d.classList.add('dim'); d.textContent = kind === 'fn' ? '🐈' : '🐶'; }
      } else if (type === 'recall') {
        // Highlight only the REAL POSITIVES: tp + fn; rest dimmed
        if (kind === 'tp') { d.classList.add('tp'); d.textContent = '🐈'; }
        else if (kind === 'fn') { d.classList.add('fn'); d.textContent = '🐈'; }
        else { d.classList.add('dim'); d.textContent = '🐶'; }
      }
      c.appendChild(d);
    });
  }
  buildPhotoGrid('acc-grid', 'accuracy');
  buildPhotoGrid('prec-grid', 'precision');
  buildPhotoGrid('rec-grid', 'recall');

  // ====== ROC CURVE ======
  // Simulate a model with AUC ~0.89. Generate roc points.
  // Use a smooth curve.
  function generateRocPoints() {
    // pts (fpr, tpr) - points should curve upper-left
    const pts = [
      [0.00, 0.00],
      [0.02, 0.32],
      [0.05, 0.55],
      [0.08, 0.70],
      [0.12, 0.78],
      [0.17, 0.85],   // threshold ~0.5 here, tpr=0.875, fpr=0.167
      [0.25, 0.92],
      [0.38, 0.96],
      [0.55, 0.985],
      [0.75, 0.997],
      [1.00, 1.00]
    ];
    return pts;
  }
  const rocPts = generateRocPoints();

  function rocCoordsToSvg(fpr, tpr) {
    // svg viewBox 400x400, plot area 40..360 x 40..360 (320px). y axis inverted.
    const x = 40 + fpr * 320;
    const y = 360 - tpr * 320;
    return [x, y];
  }

  function buildRocPath(pts) {
    let d = '';
    pts.forEach((p, i) => {
      const [x, y] = rocCoordsToSvg(p[0], p[1]);
      if (i === 0) d += `M ${x} ${y}`;
      else d += ` L ${x} ${y}`;
    });
    // close down to bottom-right and bottom-left for fill area
    d += ` L 360 360 L 40 360 Z`;
    return d;
  }

  document.getElementById('roc-curve').setAttribute('d', buildRocPath(rocPts));

  // Compute TPR/FPR for a given threshold (0..1).
  // Map threshold inversely: low threshold = high TPR + high FPR; high threshold = low both.
  // Use linear interpolation between extreme points based on threshold position.
  function tprFprFromThreshold(thr) {
    // thr 0..1. At thr=0 -> (1,1). At thr=1 -> (0,0).
    // Map threshold to a position along the curve (using FPR as position).
    // We'll define a target FPR based on threshold (nonlinear): higher thr = lower fpr.
    // Use exponential mapping: fpr = (1 - thr)^2.5
    const fprTarget = Math.pow(1 - thr, 2.5);
    // Find TPR on the curve for this fpr by linear interpolation among rocPts.
    let tpr = 0;
    for (let i = 0; i < rocPts.length - 1; i++) {
      const [f1, t1] = rocPts[i];
      const [f2, t2] = rocPts[i + 1];
      if (fprTarget >= f1 && fprTarget <= f2) {
        const ratio = (f2 - f1) === 0 ? 0 : (fprTarget - f1) / (f2 - f1);
        tpr = t1 + ratio * (t2 - t1);
        break;
      }
    }
    if (fprTarget >= 1) tpr = 1;
    if (fprTarget <= 0) tpr = 0;
    return [fprTarget, tpr];
  }

  const thrSlider = document.getElementById('thr-slider');
  const thrValue = document.getElementById('thr-value');
  const thrTpr = document.getElementById('thr-tpr');
  const thrFpr = document.getElementById('thr-fpr');
  const rocPoint = document.getElementById('roc-point');

  function updateThreshold() {
    const thr = parseInt(thrSlider.value, 10) / 100;
    thrValue.textContent = thr.toFixed(2).replace('.', ',');
    const [fpr, tpr] = tprFprFromThreshold(thr);
    thrTpr.textContent = (tpr * 100).toFixed(1).replace('.', ',') + '%';
    thrFpr.textContent = (fpr * 100).toFixed(1).replace('.', ',') + '%';
    const [sx, sy] = rocCoordsToSvg(fpr, tpr);
    rocPoint.setAttribute('cx', sx);
    rocPoint.setAttribute('cy', sy);
  }
  thrSlider.addEventListener('input', updateThreshold);
  updateThreshold();

  // Compute AUC as integral (trapezoid) of the rocPts.
  function computeAuc(pts) {
    let area = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [f1, t1] = pts[i];
      const [f2, t2] = pts[i + 1];
      area += (f2 - f1) * (t1 + t2) / 2;
    }
    return area;
  }
  const aucVal = computeAuc(rocPts);
  document.getElementById('auc-val').textContent = aucVal.toFixed(2).replace('.', ',');

  // ====== MAE BARS ======
  const maeData = [
    { name: 'Mel',     actual: 3.2, pred: 3.5 },
    { name: 'Bento',   actual: 4.5, pred: 4.0 },
    { name: 'Pipoca',  actual: 2.8, pred: 3.0 },
    { name: 'Salem',   actual: 5.1, pred: 4.8 },
    { name: 'Estrela', actual: 3.9, pred: 4.2 }
  ];
  const MAX_KG = 6;

  const maeBars = document.getElementById('mae-bars');
  maeData.forEach((d) => {
    const row = document.createElement('div');
    row.className = 'mae-row';
    const err = Math.abs(d.actual - d.pred);
    row.innerHTML = `
      <div class="mae-cat-name">🐈 ${d.name}</div>
      <div class="mae-bar-wrap">
        <div class="mae-bar-actual" style="width: ${(d.actual/MAX_KG)*100}%">real ${d.actual.toString().replace('.', ',')} kg</div>
        <div class="mae-bar-pred" style="width: ${(d.pred/MAX_KG)*100}%">previu ${d.pred.toString().replace('.', ',')} kg</div>
      </div>
      <div class="mae-err">±${err.toFixed(1).replace('.', ',')}</div>
    `;
    maeBars.appendChild(row);
  });

  // ====== BUSINESS CALCULATOR ======
  // Fixed from our scenario: TP=35, FP=10, FN=5
  const TP = 35, FP = 10, FN = 5;

  const tpGain = document.getElementById('biz-tp-gain');
  const fpCost = document.getElementById('biz-fp-cost');
  const fnCost = document.getElementById('biz-fn-cost');
  const opCost = document.getElementById('biz-op-cost');

  function fmtBRL(v) {
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(Math.round(v));
  }

  function updateBiz() {
    const gainPer = parseFloat(tpGain.value) || 0;
    const fpC = parseFloat(fpCost.value) || 0;
    const fnC = parseFloat(fnCost.value) || 0;
    const op = parseFloat(opCost.value) || 0;

    const revenue = TP * gainPer;
    const costs = FP * fpC + FN * fnC + op;
    const profit = revenue - costs;
    const roi = costs > 0 ? ((profit) / costs) * 100 : 0;

    document.getElementById('biz-revenue').textContent = fmtBRL(revenue);
    document.getElementById('biz-costs').textContent = fmtBRL(costs);
    document.getElementById('biz-profit').textContent = fmtBRL(profit);
    document.getElementById('biz-roi').textContent = fmtBRL(roi);

    const card = document.getElementById('biz-profit-card');
    if (profit < 0) {
      card.classList.remove('full');
      card.style.background = 'var(--coral)';
      card.style.borderColor = 'var(--paper)';
    } else {
      card.classList.add('full');
      card.style.background = '';
      card.style.borderColor = '';
    }
  }
  [tpGain, fpCost, fnCost, opCost].forEach(el => el.addEventListener('input', updateBiz));
  updateBiz();

  // ====== Auto-activate TP cell on load ======
  setTimeout(() => {
    const tpCell = document.querySelector('.matrix-cell.tp');
    if (tpCell) tpCell.click();
  }, 200);