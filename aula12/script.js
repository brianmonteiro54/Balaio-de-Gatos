/* ===== bloco 1 ===== */

// ============================================================
// 1) PRÉ-PROCESSAMENTO INTERATIVO
// ============================================================
(function(){
  function c(raw, issue, fixed){ return {raw, issue: issue || null, fixed: fixed || raw}; }

  const rows = [
    {nome:'Mel',      peso:c('3.2 kg'),                       sexo:c('F'),                          nasc:c('2020-03-15'),                                   cor:'tricolor'},
    {nome:'Bento',    peso:c('NULL','nulls','4.3 kg (média)'), sexo:c('Male','categories','M'),     nasc:c('2018-08-22'),                                   cor:'preto'},
    {nome:'Bento',    peso:c('5.5 kg'),                       sexo:c('Male','categories','M'),      nasc:c('2018-08-22'),                                   cor:'preto', dup:true},
    {nome:'Pipoca',   peso:c('2800g','units','2.8 kg'),       sexo:c('F'),                          nasc:c('21/12/2021','dates','2021-12-21'),              cor:'branco'},
    {nome:'Salem',    peso:c('4.8 kg'),                       sexo:c('M'),                          nasc:c('2019/06/14','dates','2019-06-14'),              cor:'preto'},
    {nome:'Estrela',  peso:c('3.9 kg'),                       sexo:c('Female','categories','F'),    nasc:c('2020-11-08'),                                   cor:'laranja'},
    {nome:'Tigrão',   peso:c('5,2 kg','units','5.2 kg'),      sexo:c('macho','categories','M'),     nasc:c('14-05-2017','dates','2017-05-14'),              cor:'tabby'},
    {nome:'Luna',     peso:c('NULL','nulls','4.3 kg (média)'), sexo:c('F'),                         nasc:c('NULL','nulls','2020-01-01 (imput.)'),           cor:'siamês'},
    {nome:'Frajola',  peso:c('4400g','units','4.4 kg'),       sexo:c('Male','categories','M'),      nasc:c('2019.03.30','dates','2019-03-30'),              cor:'preto'},
    {nome:'Frajola',  peso:c('4.4 kg'),                       sexo:c('Male','categories','M'),      nasc:c('2019-03-30'),                                   cor:'preto', dup:true},
    {nome:'Mimi',     peso:c('NULL','nulls','4.3 kg (média)'), sexo:c('F'),                         nasc:c('2022-08-12'),                                   cor:'calico'},
    {nome:'Garfield', peso:c('6.1 kg'),                       sexo:c('macho','categories','M'),     nasc:c('2017-09-01'),                                   cor:'laranja'},
  ];

  let completed = new Set();

  function renderCell(cell){
    if (!cell.issue) return `<td>${cell.raw}</td>`;
    const fixed = completed.has(cell.issue);
    return `<td><span class="issue${fixed ? ' fixed' : ''}">${fixed ? cell.fixed : cell.raw}</span></td>`;
  }

  function render(){
    const body = document.getElementById('preproc-body');
    body.innerHTML = rows.map(row => {
      const isDup = row.dup && completed.has('duplicates');
      const cls = isDup ? 'removed' : '';
      return `<tr class="${cls}">
        <td><strong>${row.nome}</strong></td>
        ${renderCell(row.peso)}
        ${renderCell(row.sexo)}
        ${renderCell(row.nasc)}
        <td>${row.cor}</td>
      </tr>`;
    }).join('');

    let active = 0;
    rows.forEach(row => {
      if (row.dup && completed.has('duplicates')) return;
      if (row.dup && !completed.has('duplicates')) active++;
      ['peso','sexo','nasc'].forEach(k => {
        const cell = row[k];
        if (cell.issue && !completed.has(cell.issue)) active++;
      });
    });

    const rowsLeft = rows.filter(r => !(r.dup && completed.has('duplicates'))).length;
    const issueEl = document.getElementById('preproc-issues');
    if (active === 0){
      issueEl.className = 'ok';
      issueEl.textContent = '✓ tudo limpo!';
    } else {
      issueEl.className = 'err';
      issueEl.textContent = `${active} problema${active > 1 ? 's' : ''} restante${active > 1 ? 's' : ''}`;
    }
    document.getElementById('preproc-rows').textContent = `${rowsLeft} linha${rowsLeft > 1 ? 's' : ''}`;

    document.querySelectorAll('.preproc-btn[data-action]').forEach(btn => {
      if (completed.has(btn.dataset.action)){
        btn.classList.add('done');
      } else {
        btn.classList.remove('done');
      }
    });
  }

  document.querySelectorAll('.preproc-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (completed.has(btn.dataset.action)) return;
      completed.add(btn.dataset.action);
      render();
    });
  });

  document.getElementById('preproc-reset').addEventListener('click', () => {
    completed = new Set();
    render();
  });

  render();
})();

// ============================================================
// 2) FEATURE ENGINEERING INTERATIVO
// ============================================================
(function(){
  const baseData = [
    {nome:'Mel', nasc:'2020-03-15', peso:3.2, cor:'tricolor'},
    {nome:'Bento', nasc:'2018-08-22', peso:5.5, cor:'preto'},
    {nome:'Pipoca', nasc:'2024-01-05', peso:1.4, cor:'branco'},
    {nome:'Salem', nasc:'2019-06-14', peso:4.8, cor:'preto'},
    {nome:'Estrela', nasc:'2020-11-08', peso:3.9, cor:'laranja'},
    {nome:'Garfield', nasc:'2017-04-22', peso:7.2, cor:'laranja'},
  ];

  const today = new Date('2026-05-26');

  const featureDefs = {
    age: {
      colName: 'idade_meses',
      compute: row => {
        const birth = new Date(row.nasc);
        const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
        return months;
      }
    },
    kitten: {
      colName: 'is_filhote',
      compute: row => {
        const birth = new Date(row.nasc);
        const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
        return months < 12 ? 1 : 0;
      }
    },
    weight_cat: {
      colName: 'porte',
      compute: row => row.peso < 3 ? 'small' : row.peso < 5 ? 'medium' : 'large'
    },
    onehot: {
      multi: true,
      cols: ['c_preto', 'c_laranja', 'c_branco', 'c_tricolor'],
      compute: row => ({
        c_preto: row.cor === 'preto' ? 1 : 0,
        c_laranja: row.cor === 'laranja' ? 1 : 0,
        c_branco: row.cor === 'branco' ? 1 : 0,
        c_tricolor: row.cor === 'tricolor' ? 1 : 0,
      })
    },
    zscore: {
      colName: 'peso_zscore',
      compute: row => {
        const weights = baseData.map(r => r.peso);
        const mean = weights.reduce((a,b) => a+b, 0) / weights.length;
        const std = Math.sqrt(weights.map(w => (w-mean)**2).reduce((a,b) => a+b, 0) / weights.length);
        return ((row.peso - mean) / std).toFixed(2);
      }
    }
  };

  let activeFeats = new Set();

  function render(){
    const thead = document.getElementById('feat-thead');
    const tbody = document.getElementById('feat-tbody');

    const cols = ['nome', 'nascimento', 'peso_kg', 'cor'];
    const newCols = [];
    activeFeats.forEach(f => {
      const def = featureDefs[f];
      if (def.multi){
        def.cols.forEach(c => newCols.push(c));
      } else {
        newCols.push(def.colName);
      }
    });

    thead.innerHTML = cols.map(c => `<th>${c}</th>`).join('') +
      newCols.map(c => `<th class="new-col">${c}</th>`).join('');

    tbody.innerHTML = baseData.map(row => {
      let rowCells = `<td>${row.nome}</td><td>${row.nasc}</td><td>${row.peso}</td><td>${row.cor}</td>`;
      activeFeats.forEach(f => {
        const def = featureDefs[f];
        if (def.multi){
          const vals = def.compute(row);
          def.cols.forEach(c => rowCells += `<td class="new-cell">${vals[c]}</td>`);
        } else {
          rowCells += `<td class="new-cell">${def.compute(row)}</td>`;
        }
      });
      return `<tr>${rowCells}</tr>`;
    }).join('');

    document.querySelectorAll('.preproc-btn[data-feat]').forEach(btn => {
      if (activeFeats.has(btn.dataset.feat)){
        btn.classList.add('done');
      } else {
        btn.classList.remove('done');
      }
    });
  }

  document.querySelectorAll('.preproc-btn[data-feat]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (activeFeats.has(btn.dataset.feat)){
        activeFeats.delete(btn.dataset.feat);
      } else {
        activeFeats.add(btn.dataset.feat);
      }
      render();
    });
  });

  document.getElementById('feat-reset').addEventListener('click', () => {
    activeFeats.clear();
    render();
  });

  render();
})();

// ============================================================
// 3) DATA AUGMENTATION
// ============================================================
(function(){
  const transforms = {
    rotate: {emoji: '🙃', label: 'rotated', tf: 'rotate(-25deg)'},
    flip: {emoji: '😼', label: 'flipped', tf: 'scaleX(-1)'},
    bright: {emoji: '😼', label: 'bright', tf: '', filter: 'brightness(1.5)'},
    dark: {emoji: '😼', label: 'dark', tf: '', filter: 'brightness(0.55)'},
    crop: {emoji: '😼', label: 'cropped', tf: 'scale(1.6)'},
    noise: {emoji: '😼', label: 'noise', tf: '', filter: 'contrast(0.85) saturate(0.6)'},
    color: {emoji: '😼', label: 'color', tf: '', filter: 'hue-rotate(60deg) saturate(1.5)'},
    blur: {emoji: '😼', label: 'blur', tf: '', filter: 'blur(2px)'},
  };

  const gallery = document.getElementById('aug-gallery');
  const countEl = document.getElementById('aug-count');
  let items = [];

  function render(){
    if (items.length === 0){
      gallery.innerHTML = '<div class="aug-empty">Galeria vazia. Clica nos botões pra gerar variações da Mel!</div>';
    } else {
      gallery.innerHTML = items.map(it => {
        const t = transforms[it];
        const style = `transform: ${t.tf || 'none'}; filter: ${t.filter || 'none'};`;
        return `<div class="aug-item">
          <span style="${style}">${t.emoji}</span>
          <span class="tag">${t.label}</span>
        </div>`;
      }).join('');
    }
    countEl.textContent = (1 + items.length);
  }

  document.querySelectorAll('[data-aug]').forEach(btn => {
    btn.addEventListener('click', () => {
      items.push(btn.dataset.aug);
      render();
    });
  });

  document.getElementById('aug-clear').addEventListener('click', () => {
    items = [];
    render();
  });

  render();
})();

// ============================================================
// 4) ÉPOCAS · Sessão de estudos do gato aluno (flashcards)
// ============================================================
(function(){
  const slider = document.getElementById('epoch-slider');
  const vEl = document.getElementById('epoch-v');
  const trainEl = document.getElementById('train-loss-v');
  const testEl = document.getElementById('val-loss-v');
  const gapEl = document.getElementById('gap-v');
  const kittenEl = document.getElementById('epoch-kitten');
  const kittenTextEl = document.getElementById('epoch-kitten-text');
  const trainCardsEl = document.getElementById('epoch-train-cards');
  const testCardsEl = document.getElementById('epoch-test-cards');
  const trainPctEl = document.getElementById('epoch-train-pct');
  const testPctEl = document.getElementById('epoch-test-pct');
  const trainFillEl = document.getElementById('epoch-train-fill');
  const testFillEl = document.getElementById('epoch-test-fill');

  const trainCards = ['🐱','🐶','🐭','🐟','🐦','🐰'];
  const testCards  = ['🐈','🐩','🐀','🐠','🦜','🐇'];

  function trainAcc(e){
    return 100 * (1 - 0.82 * Math.exp(-0.11 * e));
  }
  function testAcc(e){
    const train = trainAcc(e);
    const gap1 = Math.max(0, (e - 22) * 0.55);
    const gap2 = Math.max(0, (e - 55) * 0.25);
    return Math.max(15, train - gap1 - gap2);
  }

  function renderCards(container, cards, acc){
    const right = Math.round(acc / 100 * cards.length);
    container.innerHTML = cards.map((c, i) => {
      const ok = i < right;
      return `<div class="epoch-card ${ok ? 'right' : 'wrong'}">${c}<span class="mark">${ok ? '✓' : '✗'}</span></div>`;
    }).join('');
  }

  function update(){
    const e = parseInt(slider.value, 10);
    vEl.textContent = e;

    const tr = trainAcc(e);
    const te = testAcc(e);
    const gap = tr - te;

    trainEl.textContent = Math.round(tr) + '%';
    testEl.textContent = Math.round(te) + '%';
    gapEl.textContent = (gap >= 0 ? '+' : '') + Math.round(gap) + '%';

    renderCards(trainCardsEl, trainCards, tr);
    renderCards(testCardsEl, testCards, te);

    trainPctEl.textContent = Math.round(tr) + '%';
    testPctEl.textContent = Math.round(te) + '%';
    trainFillEl.style.width = tr + '%';
    testFillEl.style.width = te + '%';

    testFillEl.classList.remove('warn', 'bad');
    if (gap >= 22) testFillEl.classList.add('bad');
    else if (gap >= 10) testFillEl.classList.add('warn');

    if (e < 8){
      kittenEl.textContent = '😴';
      kittenTextEl.textContent = 'Eu nem cheguei a abrir o caderno direito...';
    } else if (e < 18){
      kittenEl.textContent = '🤔';
      kittenTextEl.textContent = 'Tô começando a pegar o jeito de cada exercício.';
    } else if (e < 32){
      kittenEl.textContent = '😺';
      kittenTextEl.textContent = 'Aprendi o conceito! Acertei até nas perguntas novas.';
    } else if (e < 60){
      kittenEl.textContent = '😼';
      kittenTextEl.textContent = 'Decorei o caderno inteiro. Tô confiante demais.';
    } else {
      kittenEl.textContent = '🙀';
      kittenTextEl.textContent = 'Espera, essas cartas da prova não estavam no caderno!';
    }

    ['under', 'good', 'over'].forEach(z => {
      document.getElementById('zone-l-' + z).classList.remove('active');
    });
    if (e < 12){
      document.getElementById('zone-l-under').classList.add('active');
    } else if (e <= 32){
      document.getElementById('zone-l-good').classList.add('active');
    } else {
      document.getElementById('zone-l-over').classList.add('active');
    }
  }

  slider.addEventListener('input', update);
  update();
})();

// ============================================================
// 5) TEMPERATURA
// ============================================================
(function(){
  const candidates = [
    {token: 'sofá', logit: 3.5},
    {token: 'tapete', logit: 2.8},
    {token: 'cachorro', logit: 1.9},
    {token: 'guarda-roupa', logit: 1.3},
    {token: 'piano', logit: 0.6},
    {token: 'lustre', logit: -0.4},
    {token: 'dragão', logit: -1.5},
  ];

  const slider = document.getElementById('temp-slider');
  const vEl = document.getElementById('temp-v');
  const distEl = document.getElementById('temp-dist');
  const genEl = document.getElementById('temp-gen');

  function softmax(logits, t){
    const tt = Math.max(0.01, t);
    const scaled = logits.map(l => l / tt);
    const maxL = Math.max(...scaled);
    const exps = scaled.map(l => Math.exp(l - maxL));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
  }

  function update(){
    const t = parseInt(slider.value, 10) / 10;
    vEl.textContent = t.toFixed(1);

    const probs = softmax(candidates.map(c => c.logit), t);

    distEl.innerHTML = candidates.map((c, i) => {
      const h = Math.max(6, probs[i] * 100);
      let cls = 'medium';
      if (t < 0.4) cls = 'cold';
      else if (t > 1.2) cls = 'hot';
      return `<div class="temp-bar ${cls}" style="height: ${h}%">
        <span class="pct">${(probs[i]*100).toFixed(0)}%</span>
        <span class="lbl">${c.token}</span>
      </div>`;
    }).join('');

    let chosen;
    if (t < 0.3){
      chosen = candidates[0].token;
    } else {
      const r = Math.random();
      let acc = 0;
      for (let i = 0; i < probs.length; i++){
        acc += probs[i];
        if (r < acc){ chosen = candidates[i].token; break; }
      }
      if (!chosen) chosen = candidates[0].token;
    }

    let comment = '';
    if (t < 0.3) comment = ' (sempre o mesmo)';
    else if (t < 0.8) comment = ' (variando pouco)';
    else if (t < 1.3) comment = ' (criativo)';
    else comment = ' (caos · pode soar estranho)';

    genEl.innerHTML = `<span class="picked">${chosen}</span>...<br><span style="font-size:11px;color:rgba(255,255,255,0.5);font-style:italic">temp=${t.toFixed(1)}${comment}</span>`;
  }

  slider.addEventListener('input', update);
  update();
})();

// ============================================================
// 6) TOP-K
// ============================================================
(function(){
  const candidates = [
    {token: 'fofinho', prob: 0.32},
    {token: 'curioso', prob: 0.21},
    {token: 'preguiçoso', prob: 0.14},
    {token: 'esperto', prob: 0.10},
    {token: 'bagunceiro', prob: 0.08},
    {token: 'manhoso', prob: 0.06},
    {token: 'bravo', prob: 0.04},
    {token: 'medroso', prob: 0.03},
    {token: 'falante', prob: 0.015},
    {token: 'dramático', prob: 0.005},
  ];

  const slider = document.getElementById('topk-slider');
  const vEl = document.getElementById('topk-v');
  const barsEl = document.getElementById('topk-bars');
  const massEl = document.getElementById('topk-mass');

  function update(){
    const k = parseInt(slider.value, 10);
    vEl.textContent = k;

    const maxProb = Math.max(...candidates.map(c => c.prob));
    let mass = 0;
    barsEl.innerHTML = candidates.map((c, i) => {
      const kept = i < k;
      if (kept) mass += c.prob;
      const w = (c.prob / maxProb) * 100;
      return `<div class="topk-row ${kept ? 'kept' : 'rejected'}">
        <div class="token">${c.token}</div>
        <div class="topk-bar-wrap">
          <div class="topk-bar-fill" style="width: ${w}%">${(c.prob*100).toFixed(1)}%</div>
        </div>
        <div class="topk-pct">${kept ? '✓' : '✗'}</div>
      </div>`;
    }).join('');

    massEl.textContent = (mass * 100).toFixed(0) + '%';
  }

  slider.addEventListener('input', update);
  update();
})();

// ============================================================
// 7) MAX TOKENS
// ============================================================
(function(){
  const fullText = "Adotar um gato é uma das melhores decisões que você pode tomar. Eles são companheiros incríveis, independentes mas afetuosos. Reduzem o estresse com o ronronar, mantêm a casa livre de roedores, e cada gato tem uma personalidade única: uns são brincalhões, outros são bibliotecas vivas que preferem observar o mundo da janela. Além disso, ao adotar de uma ONG ou abrigo, você dá uma segunda chance a um animal que precisa, e geralmente o gato já vem castrado e vacinado.";

  const tokens = fullText.split(/(\s+)/);
  const slider = document.getElementById('maxtok-slider');
  const vEl = document.getElementById('maxtok-v');
  const textEl = document.getElementById('maxtok-text');
  const costEl = document.getElementById('maxtok-cost');
  const latEl = document.getElementById('maxtok-latency');

  function update(){
    const max = parseInt(slider.value, 10);
    vEl.textContent = max + ' tokens';

    let kept = '', cut = '';
    let count = 0;
    let cutMode = false;
    tokens.forEach(t => {
      const isWord = t.trim().length > 0;
      if (!cutMode){
        if (isWord && count >= max){
          cutMode = true;
          cut += t;
        } else {
          kept += t;
          if (isWord) count++;
        }
      } else {
        cut += t;
      }
    });

    let html = kept;
    if (cut.trim().length > 0){
      html += `<span class="maxtok-truncated">${cut}</span>`;
      html += `<span class="maxtok-cut">⛔ Resposta cortada em ${max} tokens (sem fechar a ideia)</span>`;
    } else {
      html += `<span class="maxtok-cut">✓ Resposta completa cabe em ${max} tokens</span>`;
    }
    textEl.innerHTML = html;

    const cost = max * 0.001;
    costEl.textContent = 'R$ ' + cost.toFixed(2).replace('.', ',');
    const lat = (max * 0.025).toFixed(1);
    latEl.textContent = lat + 's';
  }

  slider.addEventListener('input', update);
  update();
})();

// ============================================================
// 8) OVERFIT / UNDERFIT · Regressão polinomial interativa
// ============================================================
(function(){
  function rng(seed){
    let s = seed;
    return () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
  }
  const r = rng(42);
  const r2 = rng(99);

  const train = [];
  for (let i = 0; i < 18; i++){
    const age = 2 + r() * 58;
    const noise = (r() - 0.5) * 1.2;
    const w = 0.5 + Math.sqrt(age) * 0.6 + noise;
    train.push({age, w});
  }
  const test = [];
  for (let i = 0; i < 8; i++){
    const age = 4 + r2() * 54;
    const noise = (r2() - 0.5) * 1.2;
    const w = 0.5 + Math.sqrt(age) * 0.6 + noise;
    test.push({age, w});
  }

  function toX(age){ return 50 + (age / 60) * 330; }
  function toY(w){ return 340 - Math.min(6, Math.max(0, w / 6)) * 300; }

  const AGE_MAX = 60;

  function fitPoly(data, degree){
    const n = data.length;
    const X = data.map(p => {
      const xn = p.age / AGE_MAX;
      const row = [];
      for (let d = 0; d <= degree; d++) row.push(Math.pow(xn, d));
      return row;
    });
    const y = data.map(p => p.w);

    const m = degree + 1;
    const A = [];
    for (let i = 0; i < m; i++){
      A.push(new Array(m + 1).fill(0));
      for (let j = 0; j < m; j++){
        for (let k = 0; k < n; k++){
          A[i][j] += X[k][i] * X[k][j];
        }
      }
      for (let k = 0; k < n; k++){
        A[i][m] += X[k][i] * y[k];
      }
    }

    for (let i = 0; i < m; i++){
      let maxRow = i;
      for (let k = i + 1; k < m; k++){
        if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
      }
      [A[i], A[maxRow]] = [A[maxRow], A[i]];
      if (Math.abs(A[i][i]) < 1e-12) continue;
      for (let k = i + 1; k < m; k++){
        const factor = A[k][i] / A[i][i];
        for (let j = i; j <= m; j++){
          A[k][j] -= factor * A[i][j];
        }
      }
    }
    const c = new Array(m).fill(0);
    for (let i = m - 1; i >= 0; i--){
      let sum = A[i][m];
      for (let j = i + 1; j < m; j++){
        sum -= A[i][j] * c[j];
      }
      c[i] = Math.abs(A[i][i]) < 1e-12 ? 0 : sum / A[i][i];
    }
    return c;
  }

  function predict(coeffs, x){
    const xn = x / AGE_MAX;
    let y = 0;
    for (let i = 0; i < coeffs.length; i++){
      y += coeffs[i] * Math.pow(xn, i);
    }
    return y;
  }

  function rmse(data, coeffs){
    let sum = 0;
    data.forEach(p => {
      const pred = predict(coeffs, p.age);
      sum += (pred - p.w) ** 2;
    });
    return Math.sqrt(sum / data.length);
  }

  const slider = document.getElementById('fit-slider');
  const vEl = document.getElementById('fit-comp-v');
  const curveEl = document.getElementById('fit-curve');
  const trainErrEl = document.getElementById('fit-train-err');
  const testErrEl = document.getElementById('fit-test-err');
  const verdictEl = document.getElementById('fit-verdict');
  const verdictVEl = document.getElementById('fit-verdict-v');

  const trainG = document.getElementById('fit-train-points');
  const testG = document.getElementById('fit-test-points');
  const errG = document.getElementById('fit-err-lines');
  trainG.innerHTML = train.map(p =>
    `<circle cx="${toX(p.age)}" cy="${toY(p.w)}" r="5" fill="#2B1810" stroke="#FBF3E2" stroke-width="1"/>`
  ).join('');
  testG.innerHTML = test.map(p =>
    `<circle cx="${toX(p.age)}" cy="${toY(p.w)}" r="5" fill="#FF6B35" stroke="#2B1810" stroke-width="1"/>`
  ).join('');

  function setActivePreset(d){
    document.querySelectorAll('.fit-preset-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.degree, 10) === d);
    });
  }

  function update(){
    const d = parseInt(slider.value, 10);
    vEl.textContent = d;
    setActivePreset(d);

    let coeffs;
    try {
      coeffs = fitPoly(train, d);
    } catch(e){
      coeffs = [0];
    }

    const steps = 240;
    let path = '';
    for (let i = 0; i <= steps; i++){
      const age = (i / steps) * 60;
      const w = predict(coeffs, age);
      const cmd = i === 0 ? 'M' : 'L';
      const yClamp = Math.min(7, Math.max(-1, w));
      path += `${cmd} ${toX(age)} ${toY(yClamp)} `;
    }
    curveEl.setAttribute('d', path);

    errG.innerHTML = test.map(p => {
      const predW = predict(coeffs, p.age);
      const predWClamp = Math.min(7, Math.max(-1, predW));
      return `<line x1="${toX(p.age)}" y1="${toY(p.w)}" x2="${toX(p.age)}" y2="${toY(predWClamp)}" stroke="#C73E1D" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.75"/>`;
    }).join('');

    const trainErr = rmse(train, coeffs);
    const testErr = rmse(test, coeffs);
    trainErrEl.textContent = trainErr.toFixed(2);
    testErrEl.textContent = testErr.toFixed(2);

    const verdictSubEl = document.getElementById('fit-verdict-sub');
    let cls = 'good';
    let main = '';
    let sub = '';
    if (d === 1){
      cls = 'under';
      main = '🐢 UNDERFIT · tá perdido';
      sub = 'A reta passa longe da maioria dos gatos. Erra os do treino E os da prova.';
    } else if (d === 2){
      cls = 'under';
      main = '🐢 UNDERFIT · aprendeu pouco';
      sub = 'A curva já tenta, mas ainda passa longe demais. Modelo simples demais.';
    } else if (d >= 13){
      cls = 'over';
      main = '🤖 OVERFIT grave';
      sub = 'A linha passa exato em cada gato preto (treino), mas erra feio nos laranja (prova).';
    } else if (d >= 8){
      cls = 'over';
      main = '🙀 OVERFIT chegando';
      sub = 'A curva começa a fazer voltas estranhas pra encaixar nos pontos do treino. Cuidado.';
    } else {
      cls = 'good';
      main = '🐱 Bem ajustado!';
      sub = 'A curva acompanha o padrão sem grudar em cada gato. Acerta no treino E na prova.';
    }
    verdictEl.className = 'fit-verdict ' + cls;
    verdictVEl.textContent = main;
    verdictSubEl.textContent = sub;
  }

  document.querySelectorAll('.fit-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      slider.value = btn.dataset.degree;
      update();
    });
  });

  slider.addEventListener('input', update);
  update();
})();