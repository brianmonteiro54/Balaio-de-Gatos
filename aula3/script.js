/* ===== bloco 1 ===== */

/* ============================================================
   1. REGRESSÃO LINEAR - Interactive line
   ============================================================ */
const lrPoints = [
  // [idade_meses, peso_kg]
  [0.5, 0.3], [1, 0.5], [1.5, 0.8], [2, 1.0], [2.5, 1.2],
  [3, 1.5], [3.5, 1.7], [4, 1.9], [4.5, 2.1], [5, 2.3],
  [5.5, 2.5], [6, 2.7], [7, 3.0], [7.5, 3.2], [8, 3.4],
  [9, 3.7], [10, 3.9], [11, 4.2], [12, 4.4]
];
// SVG plot area: x 50..380 maps to idade 0..12 months; y 280..40 maps to peso 0..5 kg
function lrX(idade){ return 50 + idade / 12 * 330 }
function lrY(peso){ return 280 - peso / 5 * 240 }

function drawLrPoints(){
  const g = document.getElementById('lr-points');
  g.innerHTML = '';
  lrPoints.forEach(p => {
    const cx = lrX(p[0]);
    const cy = lrY(p[1]);
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', 5);
    c.setAttribute('fill', '#5C8D89');
    c.setAttribute('stroke', '#2B1810');
    c.setAttribute('stroke-width', 1.5);
    g.appendChild(c);
  });
}
drawLrPoints();

const lrSlopeSlider = document.getElementById('lr-slope');
const lrInterceptSlider = document.getElementById('lr-intercept');
const lrSlopeVal = document.getElementById('lr-slope-val');
const lrInterceptVal = document.getElementById('lr-intercept-val');
const lrMaeVal = document.getElementById('lr-mae-val');
const lrLine = document.getElementById('lr-line');
const lrResiduals = document.getElementById('lr-residuals');
const lrAreaInput = document.getElementById('lr-area-input');
const lrPredVal = document.getElementById('lr-pred-val');

function updateLR(){
  // slope: 0..100 -> 0..0.5 (kg per month)
  const slope = parseFloat(lrSlopeSlider.value) / 100 * 0.5;
  // intercept: -100..300 -> -0.5..1.5 kg (peso ao nascer)
  const intercept = (parseFloat(lrInterceptSlider.value) + 100) / 400 * 2 - 0.5;
  lrSlopeVal.textContent = (slope * 1000).toFixed(0); // grams/month for display
  lrInterceptVal.textContent = intercept.toFixed(2).replace('.', ',') + ' kg';

  // Compute line endpoints in chart coords
  // At idade=0 -> peso = intercept; at idade=12 -> slope*12 + intercept
  const p1 = intercept;
  const p2 = slope * 12 + intercept;
  lrLine.setAttribute('x1', lrX(0));
  lrLine.setAttribute('y1', lrY(p1));
  lrLine.setAttribute('x2', lrX(12));
  lrLine.setAttribute('y2', lrY(p2));

  // Residuals (error lines from each point to the line)
  lrResiduals.innerHTML = '';
  let totalErr = 0;
  lrPoints.forEach(p => {
    const predicted = slope * p[0] + intercept;
    const err = Math.abs(p[1] - predicted);
    totalErr += err;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', lrX(p[0]));
    line.setAttribute('y1', lrY(p[1]));
    line.setAttribute('x2', lrX(p[0]));
    line.setAttribute('y2', lrY(predicted));
    line.setAttribute('stroke', '#C73E1D');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('opacity', '0.4');
    line.setAttribute('stroke-dasharray', '2 2');
    lrResiduals.appendChild(line);
  });
  const mae = totalErr / lrPoints.length;
  lrMaeVal.textContent = mae.toFixed(2).replace('.', ',') + ' kg';

  // Prediction
  const idade = parseFloat(lrAreaInput.value) || 0;
  const pred = slope * idade + intercept;
  lrPredVal.textContent = pred.toFixed(2).replace('.', ',') + ' kg';
}
[lrSlopeSlider, lrInterceptSlider, lrAreaInput].forEach(el => el.addEventListener('input', updateLR));

// Auto-fit slope to ~3.7 and intercept to about -25 for visual best fit
// But let user start in a slightly off position so they can see the line moving
updateLR();

/* ============================================================
   2. DECISION TREE - interactive house selector
   ============================================================ */
const treeState = { area: 'no', q2: 'no' };
const treePath = document.getElementById('tree-path');
const q2Label = document.getElementById('q2-label');

function highlightLeaf(){
  // remove active from all leaves
  document.querySelectorAll('#tree-svg .leaf-rect').forEach(r => r.classList.remove('leaf-active'));
  // determine which leaf
  let leafId = '';
  if (treeState.area === 'no' && treeState.q2 === 'no') leafId = 'leaf-1';
  else if (treeState.area === 'no' && treeState.q2 === 'yes') leafId = 'leaf-2';
  else if (treeState.area === 'yes' && treeState.q2 === 'no') leafId = 'leaf-3';
  else if (treeState.area === 'yes' && treeState.q2 === 'yes') leafId = 'leaf-4';
  const leaf = document.querySelector('#' + leafId + ' .leaf-rect');
  if (leaf) leaf.classList.add('leaf-active');

  // Path drawing
  // Root: 250, 45 (center of header)
  // L2 left node center: 110, 155
  // L2 right node center: 390, 155
  // Leaves center y: 280
  // Leaves x: 60, 170, 330, 440
  let d = '';
  if (treeState.area === 'no') {
    d = 'M 250 70 L 110 130';
    if (treeState.q2 === 'no') {
      d += ' M 110 180 L 60 240';
    } else {
      d += ' M 110 180 L 170 240';
    }
  } else {
    d = 'M 250 70 L 390 130';
    if (treeState.q2 === 'no') {
      d += ' M 390 180 L 330 240';
    } else {
      d += ' M 390 180 L 440 240';
    }
  }
  treePath.setAttribute('d', d);

  // Update q2 label based on adulto/filhote
  if (treeState.area === 'no') {
    q2Label.textContent = '🐈 Raça pura?';
  } else {
    q2Label.textContent = '🩺 Doença crônica?';
  }
}
document.querySelectorAll('.tree-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.tree-toggle');
    const q = parent.dataset.q;
    const val = btn.dataset.val;
    treeState[q] = val;
    parent.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    highlightLeaf();
  });
});
highlightLeaf();

/* ============================================================
   3. BINARY CLASSIFICATION - threshold on transactions
   ============================================================ */
// Transactions: probability values 0..1, with "true label" (1 = fraud, 0 = not)
// Made so that with threshold=0.5 we get TP=10, FP=2, FN=2, TN=10 roughly
const txns = [
  // Real fraudes (label=1): mostly high probability
  {p: 0.92, l: 1}, {p: 0.88, l: 1}, {p: 0.85, l: 1}, {p: 0.80, l: 1}, {p: 0.75, l: 1},
  {p: 0.70, l: 1}, {p: 0.66, l: 1}, {p: 0.60, l: 1}, {p: 0.55, l: 1}, {p: 0.51, l: 1},
  {p: 0.45, l: 1}, {p: 0.38, l: 1},
  // Real não-fraudes (label=0): mostly low probability
  {p: 0.08, l: 0}, {p: 0.12, l: 0}, {p: 0.15, l: 0}, {p: 0.20, l: 0}, {p: 0.22, l: 0},
  {p: 0.25, l: 0}, {p: 0.30, l: 0}, {p: 0.35, l: 0}, {p: 0.42, l: 0}, {p: 0.48, l: 0},
  {p: 0.55, l: 0}, {p: 0.62, l: 0}
];

function drawTxns(thr){
  const g = document.getElementById('binary-txns');
  g.innerHTML = '';
  // probability axis: 40..420 maps 0..1
  function px(p){ return 40 + p * 380; }
  // Y position: random-ish but stable per index, with two horizontal "rows" (fraudes and não)
  txns.forEach((t, i) => {
    const x = px(t.p);
    // Spread y values vertically
    let y;
    if (t.l === 1) {
      // fraudes: top row 110..170
      y = 110 + ((i * 17) % 60);
    } else {
      // não-fraudes: bottom row 180..220
      y = 180 + ((i * 13) % 40);
    }
    const isAboveThr = t.p >= thr;
    const isCorrect = (isAboveThr && t.l === 1) || (!isAboveThr && t.l === 0);

    // Color based on TP/FP/TN/FN
    let fill;
    if (t.l === 1 && isAboveThr) fill = '#6B8E23';        // TP - olive green
    else if (t.l === 1 && !isAboveThr) fill = '#D4A574';  // FN - caramel (missed fraud)
    else if (t.l === 0 && isAboveThr) fill = '#C73E1D';   // FP - coral (false alarm)
    else fill = '#5C8D89';                                // TN - sage

    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', 7);
    c.setAttribute('fill', fill);
    c.setAttribute('stroke', '#2B1810');
    c.setAttribute('stroke-width', 1.5);
    g.appendChild(c);

    // Add icon for fraude
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', x);
    txt.setAttribute('y', y + 3);
    txt.setAttribute('font-size', 8);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('fill', '#FFF9EC');
    txt.textContent = t.l === 1 ? '!' : '·';
    g.appendChild(txt);
  });

  // Update counts
  let tp = 0, fp = 0, fn = 0;
  txns.forEach(t => {
    const above = t.p >= thr;
    if (t.l === 1 && above) tp++;
    else if (t.l === 0 && above) fp++;
    else if (t.l === 1 && !above) fn++;
  });
  document.getElementById('bin-tp').textContent = tp;
  document.getElementById('bin-fp').textContent = fp;
  document.getElementById('bin-fn').textContent = fn;
}

const binarySlider = document.getElementById('binary-thr-slider');
const binaryThrVal = document.getElementById('binary-thr-val');
const binaryThrLine = document.getElementById('binary-thr-line');
const binaryThrLabel = document.getElementById('binary-thr-label');

function updateBinary(){
  const thr = parseInt(binarySlider.value, 10) / 100;
  binaryThrVal.textContent = thr.toFixed(2).replace('.', ',');
  // Position line: 40 + thr * 380
  const lineX = 40 + thr * 380;
  binaryThrLine.setAttribute('x1', lineX);
  binaryThrLine.setAttribute('x2', lineX);
  binaryThrLabel.setAttribute('x', lineX);
  binaryThrLabel.textContent = 'limiar = ' + thr.toFixed(2).replace('.', ',');
  drawTxns(thr);
}
binarySlider.addEventListener('input', updateBinary);
updateBinary();

/* ============================================================
   4. MULTICLASS - Cat meow classification
   ============================================================ */
const tickets = [
  {
    text: '"Miado curto e repetido, vindo da direção da cozinha às 6h da manhã"',
    probs: [
      { label: 'Fome',       pct: 82, emoji: '🍽️' },
      { label: 'Atenção',    pct: 12, emoji: '👀' },
      { label: 'Dor',        pct:  4, emoji: '🤕' },
      { label: 'Cio',        pct:  2, emoji: '💘' }
    ]
  },
  {
    text: '"Miado longo, agudo e estridente, fêmea não castrada, rolando no chão"',
    probs: [
      { label: 'Cio',        pct: 88, emoji: '💘' },
      { label: 'Dor',        pct:  6, emoji: '🤕' },
      { label: 'Atenção',    pct:  4, emoji: '👀' },
      { label: 'Fome',       pct:  2, emoji: '🍽️' }
    ]
  },
  {
    text: '"Miado grave e contínuo, gato escondido embaixo da cama, recusa toque"',
    probs: [
      { label: 'Dor',        pct: 71, emoji: '🤕' },
      { label: 'Atenção',    pct: 14, emoji: '👀' },
      { label: 'Cio',        pct: 10, emoji: '💘' },
      { label: 'Fome',       pct:  5, emoji: '🍽️' }
    ]
  },
  {
    text: '"Miado médio, gato no colo do tutor, depois de dormir o dia inteiro"',
    probs: [
      { label: 'Atenção',    pct: 39, emoji: '👀' },
      { label: 'Fome',       pct: 31, emoji: '🍽️' },
      { label: 'Dor',        pct: 22, emoji: '🤕' },
      { label: 'Cio',        pct:  8, emoji: '💘' }
    ]
  }
];

function renderMulti(idx){
  const t = tickets[idx];
  document.getElementById('multi-ticket-text').textContent = t.text;
  const container = document.getElementById('multi-bars');
  container.innerHTML = '';
  const maxPct = Math.max(...t.probs.map(p => p.pct));
  t.probs.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'multi-bar-row';
    const isWinner = p.pct === maxPct;
    const isRunner = !isWinner && i === 1 && t.probs[1].pct > 20;
    const cls = isWinner ? 'winner' : (p.pct > 15 ? 'runner' : 'other');
    row.innerHTML = `
      <div class="multi-cat"><span>${p.emoji}</span> ${p.label}</div>
      <div class="multi-bar-wrap">
        <div class="multi-bar ${cls}" style="width: 0%"></div>
      </div>
      <div class="multi-pct">${p.pct}%</div>
    `;
    container.appendChild(row);
    // animate
    requestAnimationFrame(() => {
      row.querySelector('.multi-bar').style.width = p.pct + '%';
    });
  });
  const winner = t.probs.reduce((a,b) => a.pct > b.pct ? a : b);
  document.getElementById('multi-winner').textContent = winner.emoji + ' ' + winner.label + (winner.pct < 50 ? ' (com baixa confiança)' : '');
}

document.querySelectorAll('.ticket-selector button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ticket-selector button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMulti(parseInt(btn.dataset.ticket, 10));
  });
});
renderMulti(0);

/* ============================================================
   5. KNN - k nearest neighbors visualization
   ============================================================ */
// Training points: [x, y, label] where label is 'apple' or 'orange'
// SVG plot 40..380 x 40..360
// New query point at (220, 200)
const knnTraining = [
  // Apples cluster (high doçura, lower tamanho)
  [110, 100, 'apple'], [140, 130, 'apple'], [160, 90, 'apple'],
  [120, 140, 'apple'], [180, 110, 'apple'], [200, 145, 'apple'],
  [150, 170, 'apple'], [100, 160, 'apple'],
  // Oranges cluster (more spread, lower doçura, higher tamanho)
  [270, 260, 'orange'], [310, 240, 'orange'], [330, 290, 'orange'],
  [280, 310, 'orange'], [240, 280, 'orange'], [350, 250, 'orange'],
  [300, 220, 'orange'], [260, 230, 'orange'],
  // Some borderline points around the query (220, 200)
  [220, 230, 'orange'], [240, 200, 'orange'],
  [195, 175, 'apple'], [200, 220, 'apple']
];
const queryPoint = [220, 200];

function drawKnn(K){
  const ptsG = document.getElementById('knn-points');
  const linesG = document.getElementById('knn-lines');
  ptsG.innerHTML = '';
  linesG.innerHTML = '';

  // Calculate distances
  const distances = knnTraining.map(p => {
    const dx = p[0] - queryPoint[0];
    const dy = p[1] - queryPoint[1];
    return { p, d: Math.sqrt(dx*dx + dy*dy) };
  });
  distances.sort((a, b) => a.d - b.d);
  const kNearest = distances.slice(0, K);
  const kSet = new Set(kNearest.map(x => x.p));

  // Update the dashed radius circle to include the Kth nearest
  const radius = kNearest[kNearest.length - 1].d + 8;
  document.getElementById('knn-radius').setAttribute('r', radius);

  // Draw all points
  knnTraining.forEach(p => {
    const isInK = kSet.has(p);
    const isApple = p[2] === 'apple';
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', p[0]);
    c.setAttribute('cy', p[1]);
    c.setAttribute('r', isInK ? 11 : 8);
    c.setAttribute('fill', isApple ? '#C73E1D' : '#FF8C42');
    c.setAttribute('stroke', '#2B1810');
    c.setAttribute('stroke-width', isInK ? 2.5 : 1.5);
    c.setAttribute('opacity', isInK ? 1 : 0.45);
    ptsG.appendChild(c);

    // Emoji on top
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', p[0]);
    txt.setAttribute('y', p[1] + 4);
    txt.setAttribute('font-size', isInK ? 12 : 10);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('opacity', isInK ? 1 : 0.45);
    txt.textContent = isApple ? '🐈‍⬛' : '🐈';
    ptsG.appendChild(txt);

    // Lines from query to K nearest
    if (isInK) {
      const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      ln.setAttribute('x1', queryPoint[0]);
      ln.setAttribute('y1', queryPoint[1]);
      ln.setAttribute('x2', p[0]);
      ln.setAttribute('y2', p[1]);
      ln.setAttribute('stroke', '#2B1810');
      ln.setAttribute('stroke-width', 1.5);
      ln.setAttribute('opacity', 0.4);
      ln.setAttribute('stroke-dasharray', '3 3');
      linesG.appendChild(ln);
    }
  });

  // Count classes in K nearest
  const appleCount = kNearest.filter(x => x.p[2] === 'apple').length;
  const orangeCount = K - appleCount;
  document.getElementById('knn-count-apple').textContent = appleCount;
  document.getElementById('knn-count-orange').textContent = orangeCount;
  document.getElementById('knn-decision').textContent = appleCount >= orangeCount ? '🐈‍⬛ Persa' : '🐈 SRD';
}

const knnSlider = document.getElementById('knn-k');
const knnVal = document.getElementById('knn-k-val');
function updateKnn(){
  const K = parseInt(knnSlider.value, 10);
  knnVal.textContent = K;
  drawKnn(K);
}
knnSlider.addEventListener('input', updateKnn);
updateKnn();

/* ============================================================
   6. XGBOOST - Error reduction visualization
   ============================================================ */
// Simulate 100 cases, each with a "difficulty"; trees gradually correct them
// Tree 1 corrects easy ones; Tree 2 catches medium; Tree 3 catches hard

// Generate fixed cases: each case gets a difficulty 0..1
// We'll show a row of dots
const xgbCases = [];
for (let i = 0; i < 50; i++) {
  xgbCases.push({ difficulty: Math.random() });
}

function drawXgbBars(treeCount){
  // For each tree count, decide which cases are still wrong
  // Tree 1: corrects difficulty < 0.62  -> ~62% correct = 38 wrong of 100; with 50 cases ~19 wrong
  // Tree 2: corrects difficulty < 0.75 -> ~25 wrong of 100; ~13 of 50
  // Tree 3: corrects difficulty < 0.86 -> ~14 wrong of 100; ~7 of 50
  const thresholds = { 1: 0.62, 2: 0.75, 3: 0.86 };

  // Three bar groups
  for (let t = 1; t <= 3; t++) {
    const g = document.getElementById('xgb-err-bar-' + t);
    g.innerHTML = '';
    const visible = t <= treeCount;
    const opacity = visible ? 1 : 0.18;
    // 50 dots in a 10x5 grid
    const startX = 35 + (t - 1) * 155;
    const startY = 225;
    xgbCases.forEach((c, i) => {
      const col = i % 11;
      const row = Math.floor(i / 11);
      const cx = startX + col * 10;
      const cy = startY + row * 12;
      const wrong = c.difficulty > thresholds[Math.min(t, treeCount)];
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', cx);
      dot.setAttribute('cy', cy);
      dot.setAttribute('r', 3);
      dot.setAttribute('fill', visible ? (wrong ? '#C73E1D' : '#6B8E23') : '#C73E1D');
      dot.setAttribute('opacity', opacity);
      g.appendChild(dot);
    });
  }

  // Update error count for current tree count
  const thr = thresholds[treeCount];
  let wrongCount = xgbCases.filter(c => c.difficulty > thr).length;
  // Scale to a representative 100-base number
  const wrongOf100 = Math.round((wrongCount / 50) * 100);
  document.getElementById('xgb-error-count').textContent = wrongOf100;

  // Highlight active trees
  for (let i = 1; i <= 3; i++) {
    const tree = document.getElementById('xgb-tree-' + i);
    if (tree) {
      const rect = tree.querySelector('rect');
      if (i <= treeCount) {
        rect.setAttribute('fill', i === treeCount ? '#FF6B35' : '#FBF3E2');
        if (i === treeCount) {
          tree.querySelectorAll('text').forEach(t => t.setAttribute('fill', '#FFF9EC'));
        } else {
          tree.querySelectorAll('text').forEach((t, idx) => {
            if (idx === 0) t.setAttribute('fill', '#2B1810');
            else if (idx === 1) t.setAttribute('fill', '#4A3528');
            else if (idx === 2) t.setAttribute('fill', '#4A3528');
          });
          // ensure result text keeps its specific color
          const txts = tree.querySelectorAll('text');
          if (i === 1) txts[3].setAttribute('fill', '#C73E1D');
          if (i === 2) txts[3].setAttribute('fill', '#D4A574');
          if (i === 3) txts[3].setAttribute('fill', '#6B8E23');
        }
      } else {
        rect.setAttribute('fill', '#FBF3E2');
        rect.setAttribute('opacity', '0.3');
        tree.querySelectorAll('text').forEach(t => t.setAttribute('opacity', '0.3'));
      }
      if (i <= treeCount) {
        rect.setAttribute('opacity', '1');
        tree.querySelectorAll('text').forEach(t => t.setAttribute('opacity', '1'));
      }
    }
  }
}

document.querySelectorAll('.xgb-controls button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.xgb-controls button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    drawXgbBars(parseInt(btn.dataset.trees, 10));
  });
});
drawXgbBars(1);

/* ============================================================
   7. K-MEANS - Animated clustering
   ============================================================ */
// Generate clusters of points
const kmPoints = [];
// Cluster 1: low freq, low value (occasional small buyers)
for (let i = 0; i < 18; i++) {
  kmPoints.push({
    x: 70 + Math.random() * 80,
    y: 260 + Math.random() * 70,
    cluster: -1
  });
}
// Cluster 2: high freq, high value (premium customers)
for (let i = 0; i < 16; i++) {
  kmPoints.push({
    x: 250 + Math.random() * 90,
    y: 70 + Math.random() * 80,
    cluster: -1
  });
}
// Cluster 3: medium freq, medium value
for (let i = 0; i < 14; i++) {
  kmPoints.push({
    x: 180 + Math.random() * 80,
    y: 170 + Math.random() * 70,
    cluster: -1
  });
}

const clusterColors = ['#FF6B35', '#5C8D89', '#8B6FAE', '#6B8E23', '#D4A574'];

let kmK = 3;
let kmCentroids = [];
let kmIter = 0;
let kmStable = false;

function initKmeans(){
  kmCentroids = [];
  kmIter = 0;
  kmStable = false;
  // Random initial positions
  const positions = [
    [80, 80], [330, 100], [200, 320], [340, 320], [80, 330]
  ];
  for (let i = 0; i < kmK; i++) {
    kmCentroids.push({ x: positions[i][0], y: positions[i][1], color: clusterColors[i] });
  }
  kmPoints.forEach(p => p.cluster = -1);
  drawKmeans();
  document.getElementById('kmeans-iter-num').textContent = '0';
  document.getElementById('kmeans-state').textContent = 'inicial (clica em Iterar)';
}

function dist(a, b){
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function kmeansStep(){
  if (kmStable) return false;
  // Step 1: assign each point to nearest centroid
  let anyChanged = false;
  kmPoints.forEach(p => {
    let nearest = 0;
    let minD = Infinity;
    kmCentroids.forEach((c, idx) => {
      const d = dist(p, c);
      if (d < minD) {
        minD = d;
        nearest = idx;
      }
    });
    if (p.cluster !== nearest) anyChanged = true;
    p.cluster = nearest;
  });

  // Step 2: recalculate centroid positions
  let centroidChanged = false;
  kmCentroids.forEach((c, idx) => {
    const cluster = kmPoints.filter(p => p.cluster === idx);
    if (cluster.length > 0) {
      const newX = cluster.reduce((s, p) => s + p.x, 0) / cluster.length;
      const newY = cluster.reduce((s, p) => s + p.y, 0) / cluster.length;
      if (Math.abs(c.x - newX) > 0.5 || Math.abs(c.y - newY) > 0.5) centroidChanged = true;
      c.x = newX;
      c.y = newY;
    }
  });

  kmIter++;
  document.getElementById('kmeans-iter-num').textContent = kmIter;
  if (!centroidChanged) {
    kmStable = true;
    document.getElementById('kmeans-state').textContent = 'estabilizou ✓';
  } else {
    document.getElementById('kmeans-state').textContent = 'em movimento...';
  }
  drawKmeans();
  return !kmStable;
}

function drawKmeans(){
  const ptsG = document.getElementById('kmeans-points');
  const cenG = document.getElementById('kmeans-centroids');
  ptsG.innerHTML = '';
  cenG.innerHTML = '';

  kmPoints.forEach(p => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', p.x);
    c.setAttribute('cy', p.y);
    c.setAttribute('r', 6);
    if (p.cluster === -1) {
      c.setAttribute('fill', '#D4A574');
    } else {
      c.setAttribute('fill', kmCentroids[p.cluster].color);
    }
    c.setAttribute('stroke', '#2B1810');
    c.setAttribute('stroke-width', 1);
    c.setAttribute('opacity', 0.85);
    ptsG.appendChild(c);
  });

  kmCentroids.forEach((c, i) => {
    // Outer halo
    const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    halo.setAttribute('cx', c.x);
    halo.setAttribute('cy', c.y);
    halo.setAttribute('r', 14);
    halo.setAttribute('fill', c.color);
    halo.setAttribute('opacity', 0.15);
    cenG.appendChild(halo);

    // X marker
    const x1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    x1.setAttribute('x1', c.x - 8); x1.setAttribute('y1', c.y - 8);
    x1.setAttribute('x2', c.x + 8); x1.setAttribute('y2', c.y + 8);
    x1.setAttribute('stroke', '#2B1810');
    x1.setAttribute('stroke-width', 3);
    cenG.appendChild(x1);

    const x2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    x2.setAttribute('x1', c.x - 8); x2.setAttribute('y1', c.y + 8);
    x2.setAttribute('x2', c.x + 8); x2.setAttribute('y2', c.y - 8);
    x2.setAttribute('stroke', '#2B1810');
    x2.setAttribute('stroke-width', 3);
    cenG.appendChild(x2);

    const x1c = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    x1c.setAttribute('x1', c.x - 8); x1c.setAttribute('y1', c.y - 8);
    x1c.setAttribute('x2', c.x + 8); x1c.setAttribute('y2', c.y + 8);
    x1c.setAttribute('stroke', c.color);
    x1c.setAttribute('stroke-width', 1.5);
    cenG.appendChild(x1c);
  });
}

document.querySelectorAll('#k-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#k-toggle button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    kmK = parseInt(btn.dataset.k, 10);
    initKmeans();
  });
});

document.getElementById('kmeans-iter').addEventListener('click', kmeansStep);
document.getElementById('kmeans-reset').addEventListener('click', initKmeans);
document.getElementById('kmeans-run').addEventListener('click', () => {
  let safety = 0;
  function loop(){
    if (kmeansStep() && safety < 20) {
      safety++;
      setTimeout(loop, 450);
    }
  }
  loop();
});
initKmeans();