/* ===== bloco 1 ===== */

// ====================================================================
  // 1) MSE / RMSE - INTERACTIVE OUTLIER DEMO
  // ====================================================================

  // Base 5 cats with fixed errors
  const baseCats = [
    { name: 'Mel',      actual: 3.2, pred: 3.5 },
    { name: 'Bento',    actual: 4.5, pred: 4.0 },
    { name: 'Pipoca',   actual: 2.8, pred: 3.0 },
    { name: 'Salem',    actual: 5.1, pred: 4.8 },
    { name: 'Estrela', actual: 3.9, pred: 4.2 }
  ];
  const MAX_KG_MSE = 8; // wider scale to fit Garfield

  const mseBarsEl = document.getElementById('mse-bars');
  const olSlider = document.getElementById('ol-slider');
  const olValue = document.getElementById('ol-value');
  const maeValEl = document.getElementById('mae-val');
  const mseValEl = document.getElementById('mse-val');
  const rmseValEl = document.getElementById('rmse-val');

  function renderMseBars(outlierErr){
    // Garfield is a 7kg cat. Model prediction = 7 - outlierErr (always under-predict for simplicity)
    const garfieldActual = 7.0;
    const garfieldPred = Math.max(0, garfieldActual - outlierErr);

    const cats = baseCats.concat([{ name: 'Garfield', actual: garfieldActual, pred: garfieldPred, outlier: true }]);
    mseBarsEl.innerHTML = '';

    let sumAbs = 0, sumSq = 0;
    cats.forEach(c => {
      const err = Math.abs(c.actual - c.pred);
      sumAbs += err;
      sumSq += err*err;
      const row = document.createElement('div');
      row.className = 'err-row';
      const nameClass = c.outlier ? 'err-name outlier' : 'err-name';
      row.innerHTML = `
        <div class="${nameClass}">${c.outlier ? '😼' : '🐈'} ${c.name}</div>
        <div class="err-bar-wrap">
          <div class="err-bar-actual" style="width: ${(c.actual/MAX_KG_MSE)*100}%">real ${c.actual.toFixed(1).replace('.', ',')}</div>
          <div class="err-bar-pred" style="width: ${(c.pred/MAX_KG_MSE)*100}%">previu ${c.pred.toFixed(1).replace('.', ',')}</div>
        </div>
        <div class="err-value">±${err.toFixed(2).replace('.', ',')}<span class="sq">erro² = ${(err*err).toFixed(2).replace('.', ',')}</span></div>
      `;
      mseBarsEl.appendChild(row);
    });

    const n = cats.length;
    const mae = sumAbs / n;
    const mse = sumSq / n;
    const rmse = Math.sqrt(mse);

    maeValEl.textContent = mae.toFixed(2).replace('.', ',');
    mseValEl.textContent = mse.toFixed(2).replace('.', ',');
    rmseValEl.textContent = rmse.toFixed(2).replace('.', ',');
  }

  function updateOutlier(){
    const v = parseInt(olSlider.value, 10) / 10; // 0..4.0 kg
    olValue.textContent = v.toFixed(1).replace('.', ',') + ' kg';
    renderMseBars(v);
  }
  olSlider.addEventListener('input', updateOutlier);
  updateOutlier();

  // ====================================================================
  // 2) R² INTERACTIVE - scatter plot with mean baseline toggle
  // ====================================================================

  // Real cat weights for 15 cats (true values)
  const r2Real = [2.4, 2.7, 3.0, 3.2, 3.5, 3.7, 3.9, 4.0, 4.2, 4.4, 4.6, 4.8, 5.0, 5.2, 5.5];
  // Per-cat noise factors that give a "good model" baseline (small residuals)
  const r2Noise = [0.15, -0.20, 0.18, -0.10, 0.22, -0.15, 0.05, 0.12, -0.18, 0.10, -0.22, 0.15, -0.10, 0.20, -0.15];

  const r2Mean = r2Real.reduce((a,b) => a+b, 0) / r2Real.length;

  const r2QualitySlider = document.getElementById('r2-quality');
  const r2QvalEl = document.getElementById('r2-qval');
  const r2ValueEl = document.getElementById('r2-value');
  const r2InterpEl = document.getElementById('r2-interp');
  const r2PointsG = document.getElementById('r2-points');
  const r2ResidualsG = document.getElementById('r2-residuals');
  let r2Mode = 'model'; // or 'mean'

  // Map (real_kg, pred_kg) -> svg coords. domain 2..6 kg => 60..360 px
  function r2ToSvg(real, pred){
    const x = 60 + ((real - 2) / 4) * 300;
    const y = 360 - ((pred - 2) / 4) * 300; // invert
    return [x, y];
  }

  function getPredictions(quality){
    // quality 0..100. higher quality -> smaller residuals.
    // We build predictions = real + noise * (1 - quality/100) * 2 (amplification at low quality)
    const factor = 1 + (1 - quality/100) * 3; // 1x at perfect, up to 4x at worst
    return r2Real.map((r, i) => {
      const n = r2Noise[i] * factor;
      // also add some bias when quality very low
      const bias = (1 - quality/100) * 0.5 * (i % 2 === 0 ? 1 : -1);
      return r + n + bias;
    });
  }

  function computeR2(reals, preds){
    const mean = reals.reduce((a,b) => a+b, 0) / reals.length;
    let ssRes = 0, ssTot = 0;
    for (let i = 0; i < reals.length; i++){
      ssRes += Math.pow(reals[i] - preds[i], 2);
      ssTot += Math.pow(reals[i] - mean, 2);
    }
    return 1 - ssRes/ssTot;
  }

  function renderR2(){
    const quality = parseInt(r2QualitySlider.value, 10);
    const preds = r2Mode === 'mean'
      ? r2Real.map(() => r2Mean)
      : getPredictions(quality);

    r2PointsG.innerHTML = '';
    r2ResidualsG.innerHTML = '';

    // Draw residual lines (real, real) -> (real, pred)
    r2Real.forEach((r, i) => {
      const [x1, y1] = r2ToSvg(r, r);
      const [x2, y2] = r2ToSvg(r, preds[i]);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', r2Mode === 'mean' ? '#C73E1D' : '#FF6B35');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('opacity', '0.45');
      line.setAttribute('stroke-dasharray', '3 3');
      r2ResidualsG.appendChild(line);
    });

    // Draw points
    r2Real.forEach((r, i) => {
      const [cx, cy] = r2ToSvg(r, preds[i]);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', '6');
      circle.setAttribute('fill', r2Mode === 'mean' ? '#C73E1D' : '#FF6B35');
      circle.setAttribute('stroke', '#2B1810');
      circle.setAttribute('stroke-width', '1.5');
      r2PointsG.appendChild(circle);
    });

    // If mean mode, also draw the mean horizontal line
    if (r2Mode === 'mean'){
      const [, meanY] = r2ToSvg(2, r2Mean);
      const meanLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      meanLine.setAttribute('x1', '60');
      meanLine.setAttribute('y1', meanY);
      meanLine.setAttribute('x2', '360');
      meanLine.setAttribute('y2', meanY);
      meanLine.setAttribute('stroke', '#C73E1D');
      meanLine.setAttribute('stroke-width', '2.5');
      meanLine.setAttribute('opacity', '0.8');
      r2ResidualsG.appendChild(meanLine);

      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', '358');
      txt.setAttribute('y', meanY - 6);
      txt.setAttribute('font-family', 'JetBrains Mono');
      txt.setAttribute('font-size', '10');
      txt.setAttribute('fill', '#C73E1D');
      txt.setAttribute('text-anchor', 'end');
      txt.setAttribute('font-weight', '700');
      txt.textContent = `média = ${r2Mean.toFixed(1).replace('.', ',')} kg`;
      r2ResidualsG.appendChild(txt);
    }

    // Compute R²
    let r2;
    if (r2Mode === 'mean'){
      // For the dumb baseline, R² is by definition 0
      r2 = 0;
    } else {
      r2 = computeR2(r2Real, preds);
    }

    r2ValueEl.textContent = r2.toFixed(2).replace('.', ',');

    // Quality label
    let qLabel;
    if (quality >= 85) qLabel = 'Excelente';
    else if (quality >= 65) qLabel = 'Bom';
    else if (quality >= 40) qLabel = 'Mediano';
    else if (quality >= 15) qLabel = 'Ruim';
    else qLabel = 'Péssimo';
    r2QvalEl.textContent = qLabel;

    // Interpretation
    if (r2Mode === 'mean'){
      r2InterpEl.textContent = 'O baseline burrão sempre chuta a média. Por construção, R² = 0.';
    } else if (r2 < 0){
      r2InterpEl.textContent = 'R² negativo! O modelo é PIOR que chutar a média. Joga fora.';
    } else if (r2 >= 0.85){
      r2InterpEl.textContent = `Excelente: o modelo explica ${(r2*100).toFixed(0)}% da variação no peso.`;
    } else if (r2 >= 0.65){
      r2InterpEl.textContent = `Bom: o modelo explica ${(r2*100).toFixed(0)}% da variação. Funcional.`;
    } else if (r2 >= 0.4){
      r2InterpEl.textContent = `Mediano: explica ${(r2*100).toFixed(0)}% da variação. Tem espaço pra melhorar.`;
    } else {
      r2InterpEl.textContent = `Ruim: só ${(r2*100).toFixed(0)}% da variação explicada. Pouco melhor que a média.`;
    }
  }

  document.getElementById('r2-mode-model').addEventListener('click', () => {
    r2Mode = 'model';
    document.getElementById('r2-mode-model').classList.add('active');
    document.getElementById('r2-mode-mean').classList.remove('active');
    renderR2();
  });
  document.getElementById('r2-mode-mean').addEventListener('click', () => {
    r2Mode = 'mean';
    document.getElementById('r2-mode-mean').classList.add('active');
    document.getElementById('r2-mode-model').classList.remove('active');
    renderR2();
  });
  r2QualitySlider.addEventListener('input', renderR2);
  renderR2();

  // ====================================================================
  // 3) PDP - feature picker with different curve shapes
  // ====================================================================

  const pdpData = {
    idade: {
      title: 'Efeito da idade na chance de adoção',
      xLabel: 'Idade do gato (anos)',
      xTicks: [{pos: 0, label: '0'}, {pos: 1, label: '15'}],
      type: 'line',
      // Each value is normalized 0..1 along x and y
      points: [
        [0.00, 0.85], [0.07, 0.78], [0.14, 0.70], [0.21, 0.62], [0.28, 0.55],
        [0.35, 0.48], [0.43, 0.42], [0.50, 0.38], [0.57, 0.34], [0.64, 0.30],
        [0.71, 0.26], [0.78, 0.23], [0.85, 0.20], [0.92, 0.18], [1.00, 0.17]
      ],
      insight: '<strong>Leitura:</strong> filhotes (0-1 ano) têm a maior chance de adoção (~85%). Cai forte conforme o gato envelhece. Gatos idosos (10+ anos) caem pra menos de 20%. <em>Triste, mas é o que o modelo aprendeu dos dados.</em>'
    },
    peso: {
      title: 'Efeito do peso na chance de adoção',
      xLabel: 'Peso (kg)',
      xTicks: [{pos: 0, label: '1'}, {pos: 1, label: '8'}],
      type: 'line',
      points: [
        [0.00, 0.40], [0.10, 0.50], [0.20, 0.62], [0.30, 0.72], [0.40, 0.78],
        [0.50, 0.76], [0.60, 0.68], [0.70, 0.58], [0.80, 0.50], [0.90, 0.44], [1.00, 0.40]
      ],
      insight: '<strong>Leitura:</strong> a curva tem formato de <strong>sino</strong>. Gatos de peso médio (3-4 kg) têm maior chance. Muito magrinhos ou muito gordos caem. <em>O modelo aprendeu que peso "normal" é um sinal positivo.</em>'
    },
    pelagem: {
      title: 'Efeito da pelagem na chance de adoção',
      xLabel: 'Cor da pelagem',
      xTicks: [],
      type: 'bar',
      bars: [
        { label: 'Preto', value: 0.45, color: '#2B1810' },
        { label: 'Branco', value: 0.62, color: '#F5E9CF' },
        { label: 'Laranja', value: 0.75, color: '#FF6B35' },
        { label: 'Cinza', value: 0.58, color: '#8B7E6A' },
        { label: 'Tricolor', value: 0.70, color: '#D4A574' }
      ],
      insight: '<strong>Leitura:</strong> gatos <strong>laranjas e tricolores</strong> têm a maior chance de adoção. Gatos pretos têm a menor — <em>infelizmente</em> existe um viés histórico nos dados de adoção. <strong>Isso é uma red flag de bias</strong> que precisa ser tratada antes de colocar o modelo em produção.'
    },
    castrado: {
      title: 'Efeito da castração na chance de adoção',
      xLabel: 'Castrado?',
      xTicks: [],
      type: 'bar',
      bars: [
        { label: 'Sim', value: 0.68, color: '#6B8E23' },
        { label: 'Não', value: 0.42, color: '#C73E1D' }
      ],
      insight: '<strong>Leitura:</strong> gatos <strong>castrados</strong> têm 26 pontos percentuais a mais de chance de adoção. Faz sentido: o adotante não vai precisar pagar pela cirurgia depois. <em>É uma feature de alto impacto e o modelo aprendeu isso bem.</em>'
    }
  };

  function renderPdp(featKey){
    const data = pdpData[featKey];
    const g = document.getElementById('pdp-content');
    g.innerHTML = '';

    document.getElementById('pdp-title').textContent = data.title;
    document.getElementById('pdp-xlabel').textContent = data.xLabel;

    // Plot area: x: 50..380 (330px), y: 60..240 (180px, inverted so 60=top=100%, 240=bottom=0%)
    const x0 = 50, x1 = 380, y0 = 240, y1 = 60;
    const w = x1 - x0;
    const h = y0 - y1;

    if (data.type === 'line'){
      // Build path
      const pts = data.points.map(p => [x0 + p[0]*w, y0 - p[1]*h]);
      let d = '';
      pts.forEach((p, i) => {
        d += (i === 0 ? 'M ' : ' L ') + p[0] + ' ' + p[1];
      });
      // Fill below path
      let dFill = d + ` L ${pts[pts.length-1][0]} ${y0} L ${pts[0][0]} ${y0} Z`;

      const fill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      fill.setAttribute('d', dFill);
      fill.setAttribute('fill', 'rgba(255,107,53,0.15)');
      fill.setAttribute('stroke', 'none');
      g.appendChild(fill);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('d', d);
      line.setAttribute('fill', 'none');
      line.setAttribute('stroke', '#FF6B35');
      line.setAttribute('stroke-width', '3.5');
      line.setAttribute('stroke-linejoin', 'round');
      g.appendChild(line);

      // Dots on points
      pts.forEach(p => {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', p[0]);
        c.setAttribute('cy', p[1]);
        c.setAttribute('r', '3.5');
        c.setAttribute('fill', '#FF6B35');
        c.setAttribute('stroke', '#2B1810');
        c.setAttribute('stroke-width', '1.5');
        g.appendChild(c);
      });

      // X ticks
      data.xTicks.forEach(t => {
        const tx = x0 + t.pos * w;
        const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x', tx);
        txt.setAttribute('y', 256);
        txt.setAttribute('font-family', 'JetBrains Mono');
        txt.setAttribute('font-size', '10');
        txt.setAttribute('fill', '#2B1810');
        txt.setAttribute('text-anchor', 'middle');
        txt.textContent = t.label;
        g.appendChild(txt);
      });

    } else if (data.type === 'bar'){
      // Bar chart
      const n = data.bars.length;
      const barW = (w / n) * 0.65;
      const gap = (w / n) * 0.35;
      data.bars.forEach((b, i) => {
        const bx = x0 + i * (w/n) + gap/2;
        const bh = b.value * h;
        const by = y0 - bh;

        // Bar
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', bx);
        rect.setAttribute('y', by);
        rect.setAttribute('width', barW);
        rect.setAttribute('height', bh);
        rect.setAttribute('fill', b.color);
        rect.setAttribute('stroke', '#2B1810');
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('rx', '4');
        g.appendChild(rect);

        // Value on top
        const val = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        val.setAttribute('x', bx + barW/2);
        val.setAttribute('y', by - 6);
        val.setAttribute('font-family', 'JetBrains Mono');
        val.setAttribute('font-size', '11');
        val.setAttribute('fill', '#2B1810');
        val.setAttribute('text-anchor', 'middle');
        val.setAttribute('font-weight', '700');
        val.textContent = (b.value*100).toFixed(0) + '%';
        g.appendChild(val);

        // Label below
        const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        lbl.setAttribute('x', bx + barW/2);
        lbl.setAttribute('y', 256);
        lbl.setAttribute('font-family', 'Sora');
        lbl.setAttribute('font-size', '11');
        lbl.setAttribute('fill', '#2B1810');
        lbl.setAttribute('text-anchor', 'middle');
        lbl.setAttribute('font-weight', '600');
        lbl.textContent = b.label;
        g.appendChild(lbl);
      });
    }

    document.getElementById('pdp-insight').innerHTML = data.insight;
  }

  document.querySelectorAll('.pdp-feat').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.pdp-feat').forEach(f => f.classList.remove('active'));
      el.classList.add('active');
      renderPdp(el.dataset.feat);
    });
  });
  renderPdp('idade');

  // ====================================================================
  // 4) TRAINIUM COST CALCULATOR
  // ====================================================================
  const TRN_GPU_HOURLY = 15.30; // R$/h GPU instance
  const TRN_AWS_HOURLY = 7.70;  // R$/h Trn1 instance

  const trnHoursSlider = document.getElementById('trn-hours');
  const trnHoursVal = document.getElementById('trn-hours-val');
  const gpuPriceEl = document.getElementById('gpu-price');
  const trnPriceEl = document.getElementById('trn-price');
  const trnSavingsEl = document.getElementById('trn-savings');
  const trnPctEl = document.getElementById('trn-pct');

  function fmtBRL(v){
    return 'R$ ' + new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(Math.round(v));
  }

  function updateTrnCalc(){
    const h = parseInt(trnHoursSlider.value, 10);
    trnHoursVal.textContent = h + ' h';
    const gpuCost = h * TRN_GPU_HOURLY;
    const trnCost = h * TRN_AWS_HOURLY;
    const savings = gpuCost - trnCost;
    const pct = (savings / gpuCost) * 100;
    gpuPriceEl.textContent = fmtBRL(gpuCost);
    trnPriceEl.textContent = fmtBRL(trnCost);
    trnSavingsEl.textContent = fmtBRL(savings);
    trnPctEl.textContent = pct.toFixed(0);
  }
  trnHoursSlider.addEventListener('input', updateTrnCalc);
  updateTrnCalc();

  // ====================================================================
  // 5) INFERENTIA COST CALCULATOR
  // ====================================================================
  const INF_GPU_PER_MILLION = 1200; // R$ per million requests on GPU
  const INF_AWS_PER_MILLION = 400;  // R$ per million requests on Inf2

  const infReqsSlider = document.getElementById('inf-reqs');
  const infReqsVal = document.getElementById('inf-reqs-val');
  const gpuInfPriceEl = document.getElementById('gpu-inf-price');
  const infPriceEl = document.getElementById('inf-price');
  const infSavingsEl = document.getElementById('inf-savings');
  const infPctEl = document.getElementById('inf-pct');

  function updateInfCalc(){
    const millions = parseInt(infReqsSlider.value, 10);
    infReqsVal.textContent = millions + ' milh' + (millions === 1 ? 'ão' : 'ões');
    const gpuCost = millions * INF_GPU_PER_MILLION;
    const infCost = millions * INF_AWS_PER_MILLION;
    const savings = gpuCost - infCost;
    const pct = (savings / gpuCost) * 100;
    gpuInfPriceEl.textContent = fmtBRL(gpuCost);
    infPriceEl.textContent = fmtBRL(infCost);
    infSavingsEl.textContent = fmtBRL(savings);
    infPctEl.textContent = pct.toFixed(0);
  }
  infReqsSlider.addEventListener('input', updateInfCalc);
  updateInfCalc();