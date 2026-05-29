/* ===== bloco 1 ===== */

/* =========================================================
   AULA 13 · BALAIO DE GATOS · widgets interativos
   ========================================================= */

/* -----------------------------------------------
   1) SageMaker AMT · hyperparameter tuning
   ----------------------------------------------- */
(function(){
  const svg = document.getElementById('amt-svg');
  if(!svg) return;
  const pointsG = document.getElementById('amt-points');
  const bestG = document.getElementById('amt-best');
  const bestAcc = document.getElementById('amt-best-acc');
  const cost = document.getElementById('amt-cost');
  const runsTbody = document.getElementById('amt-runs');
  const runBtn = document.getElementById('amt-run-btn');
  const stratBtns = document.querySelectorAll('.amt-strategy');
  const compareBtn = document.getElementById('amt-compare-btn');
  const convSvg = document.getElementById('amt-conv-svg');
  const convLegend = document.getElementById('amt-conv-legend');
  const winnerBox = document.getElementById('amt-winner');
  const winnerConfig = document.getElementById('amt-winner-config');

  let strategy = 'bayes';
  let convCurves = {};   // strategy -> [best-so-far per job]
  let comparing = false;
  let running = false;

  const STRAT_COLORS = {grid:'#5C8D89', random:'#F4D35E', bayes:'#FF6B35'};
  const STRAT_LABELS = {grid:'Grid', random:'Random', bayes:'Bayes'};

  stratBtns.forEach(b => {
    b.addEventListener('click', () => {
      if(running) return;
      stratBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      strategy = b.dataset.strat;
    });
  });

  // True objective: best near lr=0.03 (x=200), batch=64 (y=160)
  function evalPoint(x, y){
    const cx = 200, cy = 160;
    const dx = (x - cx) / 180;
    const dy = (y - cy) / 140;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const noise = (Math.random() - 0.5) * 0.04;
    const acc = 0.94 - dist * 0.28 + noise;
    return Math.max(0.62, Math.min(0.94, acc));
  }

  function accColor(acc){
    if(acc >= 0.86) return '#6B8E23';
    if(acc >= 0.78) return '#F4D35E';
    if(acc >= 0.72) return '#FF6B35';
    return '#C73E1D';
  }

  function genGrid(){
    const pts = [];
    const xs = [70, 130, 190, 250, 310];
    const ys = [60, 130, 200, 270];
    for(const x of xs) for(const y of ys){
      if(pts.length >= 20) break;
      pts.push({x, y});
    }
    return pts;
  }

  function genRandom(){
    const pts = [];
    for(let i=0;i<20;i++) pts.push({x:50+Math.random()*300, y:30+Math.random()*260});
    return pts;
  }

  function genBayes(){
    const pts = [];
    for(let i=0;i<5;i++) pts.push({x:50+Math.random()*300, y:30+Math.random()*260});
    let best = pts[0]; let bestA = evalPoint(best.x, best.y);
    for(let i=1;i<5;i++){
      const a = evalPoint(pts[i].x, pts[i].y);
      if(a > bestA){ bestA = a; best = pts[i]; }
    }
    for(let i=0;i<15;i++){
      const spread = 80 - i*4;
      pts.push({
        x: Math.max(45, Math.min(355, best.x + (Math.random()-0.5)*spread)),
        y: Math.max(25, Math.min(295, best.y + (Math.random()-0.5)*spread))
      });
    }
    return pts;
  }

  function clearScatter(){
    pointsG.innerHTML = '';
    bestG.style.display = 'none';
    runsTbody.innerHTML = '';
    bestAcc.textContent = '···';
    cost.textContent = '0';
    winnerBox.classList.remove('show');
  }

  function drawConvergence(){
    // grid background (always rebuilt)
    const grid = `
      <g stroke="#2B1810" stroke-opacity="0.08" stroke-width="1">
        <line x1="36" y1="20" x2="354" y2="20"/>
        <line x1="36" y1="45" x2="354" y2="45"/>
        <line x1="36" y1="70" x2="354" y2="70"/>
        <line x1="36" y1="95" x2="354" y2="95"/>
      </g>
      <line x1="36" y1="105" x2="354" y2="105" stroke="#2B1810" stroke-width="1.2"/>
      <line x1="36" y1="10" x2="36" y2="105" stroke="#2B1810" stroke-width="1.2"/>
      <g font-family="JetBrains Mono" font-size="8" fill="#4A3528">
        <text x="33" y="23" text-anchor="end">.95</text>
        <text x="33" y="73" text-anchor="end">.78</text>
        <text x="33" y="108" text-anchor="end">.62</text>
        <text x="38" y="118">job 1</text>
        <text x="354" y="118" text-anchor="end">job 20</text>
      </g>`;
    let curves = '';
    let dots = '';
    const entries = Object.entries(convCurves);
    entries.forEach(([strat, arr]) => {
      if(!arr.length) return;
      let d = '';
      arr.forEach((v, i) => {
        const x = 36 + (i / 19) * 318;
        const y = Math.max(10, Math.min(105, 105 - ((v - 0.62) / 0.33) * 95));
        d += (i === 0 ? 'M ' : ' L ') + x.toFixed(1) + ' ' + y.toFixed(1);
      });
      curves += `<path d="${d}" fill="none" stroke="${STRAT_COLORS[strat]}" stroke-width="2.2" stroke-linejoin="round"/>`;
      const li = arr.length - 1;
      const lx = 36 + (li / 19) * 318;
      const ly = Math.max(10, Math.min(105, 105 - ((arr[li] - 0.62) / 0.33) * 95));
      dots += `<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="3.5" fill="${STRAT_COLORS[strat]}" stroke="#2B1810" stroke-width="1"/>`;
    });
    convSvg.innerHTML = grid + curves + dots;
  }

  function updateLegend(){
    const strats = Object.keys(convCurves);
    if(!strats.length){
      convLegend.innerHTML = '<span class="empty">Rode um tuning pra ver a curva</span>';
      return;
    }
    // find overall winner
    let winnerStrat = strats[0];
    let winnerScore = convCurves[strats[0]].length ? convCurves[strats[0]][convCurves[strats[0]].length-1] : 0;
    strats.forEach(s => {
      const arr = convCurves[s];
      if(arr.length && arr[arr.length-1] > winnerScore){
        winnerScore = arr[arr.length-1];
        winnerStrat = s;
      }
    });
    convLegend.innerHTML = strats.map(s => {
      const arr = convCurves[s];
      const final = arr.length ? arr[arr.length-1].toFixed(3) : '···';
      const cls = (s === winnerStrat && strats.length > 1) ? 'legend-item winner' : 'legend-item';
      const crown = (s === winnerStrat && strats.length > 1) ? '👑 ' : '';
      return `<span class="${cls}"><span class="dot" style="background:${STRAT_COLORS[s]}"></span>${crown}${STRAT_LABELS[s]} · ${final}</span>`;
    }).join('');
  }

  function showWinner(best){
    const winLr = ((best.x - 50) / 300 * 0.099 + 0.001).toFixed(4);
    const winBs = Math.round((290 - best.y) / 260 * 240 + 16);
    winnerConfig.innerHTML =
      `<span class="pair"><span class="key">lr=</span><span class="val">${winLr}</span></span>` +
      `<span class="pair"><span class="key">batch=</span><span class="val">${winBs}</span></span>` +
      `<span class="pair"><span class="key">strategy=</span><span class="val">${STRAT_LABELS[strategy]}</span></span>` +
      `<span class="pair"><span class="key">acc=</span><span class="val">${best.acc.toFixed(3)}</span></span>`;
    winnerBox.classList.add('show');
  }

  function run(onComplete){
    if(running) return;
    running = true;
    clearScatter();
    if(!comparing){
      convCurves = {};
      drawConvergence();
      updateLegend();
    }
    runBtn.disabled = true;
    if(!comparing) compareBtn.disabled = true;
    runBtn.textContent = '⟳ rodando ' + STRAT_LABELS[strategy] + '...';

    const pts = strategy === 'grid' ? genGrid() : strategy === 'random' ? genRandom() : genBayes();
    const evaluated = pts.map(p => ({...p, acc: evalPoint(p.x, p.y)}));
    let best = evaluated[0];
    evaluated.forEach(e => { if(e.acc > best.acc) best = e; });

    convCurves[strategy] = [];
    let bestSoFar = 0;
    const stepDelay = comparing ? 70 : 110;

    let i = 0;
    const interval = setInterval(() => {
      if(i >= evaluated.length){
        clearInterval(interval);
        bestG.style.display = '';
        bestG.setAttribute('transform', `translate(${best.x}, ${best.y - 18})`);
        bestAcc.textContent = best.acc.toFixed(3);
        cost.textContent = (evaluated.length * 0.30).toFixed(2);
        if(!comparing) showWinner(best);
        running = false;
        runBtn.disabled = false;
        if(!comparing) compareBtn.disabled = false;
        runBtn.textContent = '▶ Rodar tuning (20 jobs)';
        if(onComplete) onComplete(best);
        return;
      }
      const p = evaluated[i];
      const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', 0);
      c.setAttribute('fill', accColor(p.acc));
      c.setAttribute('stroke', '#2B1810'); c.setAttribute('stroke-width', '1.2');
      c.style.transition = 'r 0.25s';
      pointsG.appendChild(c);
      requestAnimationFrame(() => c.setAttribute('r', '6'));

      const row = document.createElement('div');
      row.className = 'amt-run-row';
      const lr = ((p.x - 50) / 300 * 0.099 + 0.001).toFixed(4);
      const bs = Math.round((290 - p.y) / 260 * 240 + 16);
      const dot = p === best ? '⭐' : (p.acc >= 0.86 ? '🟢' : p.acc >= 0.78 ? '🟡' : '🔴');
      row.innerHTML = `<div class="n">#${(i+1).toString().padStart(2,'0')}</div><div>${dot} job</div><div>${lr}</div><div>${bs}</div><div class="acc" style="color:${accColor(p.acc)}">${p.acc.toFixed(3)}</div>`;
      if(p === best) row.classList.add('best');
      runsTbody.appendChild(row);
      runsTbody.scrollTop = runsTbody.scrollHeight;

      bestSoFar = Math.max(bestSoFar, p.acc);
      convCurves[strategy].push(bestSoFar);
      drawConvergence();
      updateLegend();

      bestAcc.textContent = bestSoFar.toFixed(3);
      cost.textContent = ((i+1) * 0.30).toFixed(2);
      i++;
    }, stepDelay);
  }

  function runAll(){
    if(comparing || running) return;
    comparing = true;
    compareBtn.disabled = true;
    compareBtn.classList.add('active');
    runBtn.disabled = true;
    convCurves = {};
    drawConvergence();
    updateLegend();
    winnerBox.classList.remove('show');

    const strats = ['grid', 'random', 'bayes'];
    const winners = {};
    let idx = 0;
    function next(prevBest){
      if(prevBest) winners[strategy] = prevBest;
      if(idx >= strats.length){
        // pick overall winner
        let bestKey = strats[0];
        Object.entries(winners).forEach(([k, v]) => {
          if(v.acc > winners[bestKey].acc) bestKey = k;
        });
        strategy = bestKey;
        stratBtns.forEach(x => x.classList.toggle('active', x.dataset.strat === bestKey));
        showWinner(winners[bestKey]);
        comparing = false;
        compareBtn.disabled = false;
        compareBtn.classList.remove('active');
        runBtn.disabled = false;
        runBtn.textContent = '▶ Rodar tuning (20 jobs)';
        return;
      }
      strategy = strats[idx];
      stratBtns.forEach(x => x.classList.toggle('active', x.dataset.strat === strategy));
      idx++;
      run(next);
    }
    next(null);
  }

  runBtn.addEventListener('click', () => run());
  compareBtn.addEventListener('click', runAll);

  // initial empty state
  drawConvergence();
  updateLegend();
})();

/* -----------------------------------------------
   2) SageMaker Autopilot · animated pipeline
   ----------------------------------------------- */
(function(){
  const startBtn = document.getElementById('auto-start');
  if(!startBtn) return;
  const resetBtn = document.getElementById('auto-reset');
  const steps = document.querySelectorAll('.auto-step');
  const lb = document.getElementById('auto-lb');
  const lbBody = document.getElementById('auto-lb-body');

  const models = [
    {name: 'XGBoost · gbtree', f1: 0.89, acc: 0.91, lat: '12 ms', time: '8m 12s', medal: '🥇'},
    {name: 'Random Forest · 200', f1: 0.85, acc: 0.87, lat: '18 ms', time: '4m 30s', medal: '🥈'},
    {name: 'Linear Learner · L2', f1: 0.81, acc: 0.84, lat: '3 ms', time: '1m 52s', medal: '🥉'},
    {name: 'XGBoost · dart', f1: 0.79, acc: 0.82, lat: '15 ms', time: '11m 04s', medal: '·'},
    {name: 'Linear Learner · L1', f1: 0.74, acc: 0.78, lat: '3 ms', time: '1m 38s', medal: '·'}
  ];

  function reset(){
    steps.forEach(s => { s.classList.remove('running','done'); });
    lb.classList.remove('show');
    lbBody.innerHTML = '';
    startBtn.disabled = false;
    startBtn.textContent = '▶ Iniciar Autopilot';
  }

  function start(){
    reset();
    startBtn.disabled = true;
    startBtn.textContent = '⟳ processando...';
    let idx = 0;
    function next(){
      if(idx >= steps.length){
        // show leaderboard
        lb.classList.add('show');
        models.forEach((m, i) => {
          const tr = document.createElement('tr');
          if(i === 0) tr.classList.add('winner');
          tr.innerHTML = `<td>${m.medal} ${i+1}</td><td>${m.name}</td><td><strong>${m.f1.toFixed(2)}</strong></td><td>${m.acc.toFixed(2)}</td><td>${m.lat}</td><td>${m.time}</td>`;
          setTimeout(() => lbBody.appendChild(tr), i * 180);
        });
        startBtn.disabled = false;
        startBtn.textContent = '✓ rodar de novo';
        return;
      }
      steps[idx].classList.add('running');
      setTimeout(() => {
        steps[idx].classList.remove('running');
        steps[idx].classList.add('done');
        idx++;
        next();
      }, 900);
    }
    next();
  }

  startBtn.addEventListener('click', start);
  resetBtn.addEventListener('click', reset);
})();

/* -----------------------------------------------
   3) Domain Adaptation · 4 Q&A pairs
   ----------------------------------------------- */
(function(){
  const btns = document.querySelectorAll('.dom-q-btn');
  if(!btns.length) return;
  const promptBefore = document.getElementById('dom-prompt-before');
  const respBefore = document.getElementById('dom-resp-before');
  const promptAfter = document.getElementById('dom-prompt-after');
  const respAfter = document.getElementById('dom-resp-after');

  const pairs = [
    {
      prompt: '🐈 "FIV em filhote com 3 meses?"',
      before: 'A FIV (Feline Imunodeficiency Virus) é uma doença viral que pode afetar gatos. Recomendo levar ao veterinário para avaliação. Mantenha o filhote bem alimentado e evite contato com outros gatos doentes. Cada caso é único.',
      after: '⚠️ Filhotes com menos de 6 meses frequentemente apresentam <strong>falso-positivo</strong> em testes de FIV por anticorpos maternos. Repetir o teste após 6 meses. Se confirmado, FIV não tem cura, mas com manejo adequado (castração, ambiente fechado, dieta rica em proteína, check-ups semestrais) o gato vive com qualidade. Cuidado com co-infecções (FeLV, PIF). Use teste de PCR para confirmação molecular.'
    },
    {
      prompt: '💉 "Vacinação V4 vs V5 · qual escolher?"',
      before: 'Vacinas são importantes para a saúde dos gatos. Existem diferentes opções com diferentes coberturas. Consulte um veterinário para escolher a melhor opção para seu pet de acordo com a idade e condições.',
      after: 'A <strong>V4 (Quadrupla felina)</strong> cobre: panleucopenia, rinotraqueíte (FHV-1), calicivirose (FCV) e clamidiose. A <strong>V5 (Quíntupla)</strong> adiciona <strong>FeLV (leucemia felina)</strong>. Recomendo V5 para gatos com acesso à rua ou contato com outros felinos. Para gatos exclusivamente indoor sem contato externo, V4 é suficiente. Protocolo: primeira dose aos 60 dias, reforço a cada 21-30 dias, total de 3 doses. Reforço anual após.'
    },
    {
      prompt: '🩺 "Cisto sebáceo no ombro do gato"',
      before: 'Caroços na pele de gatos podem ter várias causas. Procure um veterinário para examinar o local. Pode ser necessário fazer exames adicionais para identificar o que é. Não tente remover em casa.',
      after: 'Cisto sebáceo (cisto epidermóide) é comum em região cervical e dorsal. Apresenta-se como <strong>nódulo subcutâneo bem delimitado, móvel, indolor</strong>, com conteúdo pastoso esbranquiçado. Diagnóstico diferencial: <strong>lipoma, fibroma, abscesso, mastocitoma cutâneo</strong> (este último maligno, exige biópsia). Conduta: <strong>citologia aspirativa</strong> primeiro. Se confirmado cisto, exérese cirúrgica eletiva (incluindo a cápsula para evitar recidiva). Histopatologia obrigatória pós-cirurgia.'
    },
    {
      prompt: '🐾 "Sintomas de PIF felino?"',
      before: 'PIF é uma doença grave em gatos. Os sintomas podem incluir febre, perda de apetite e cansaço. Se suspeitar, leve ao veterinário rapidamente. O tratamento depende de cada caso e do diagnóstico do profissional.',
      after: 'PIF (Peritonite Infecciosa Felina) deriva da mutação do <strong>coronavírus felino (FCoV)</strong>. Duas formas clínicas: <strong>efusiva (úmida)</strong>: ascite, dispneia, derrame pleural/abdominal com líquido amarelo-citrino rico em proteína (relação A:G < 0,4); <strong>não-efusiva (seca)</strong>: granulomas em SNC, olhos (uveíte, precipitados queráticos), rins. Linfopenia, hiperglobulinemia, anemia não-regenerativa. Diagnóstico: PCR de líquido efusivo + RT-PCR. <strong>Tratamento atual: GS-441524 ou Molnupiravir oral por 84 dias</strong>. Taxa de cura > 85% em protocolos atualizados.'
    }
  ];

  function render(i){
    const p = pairs[i];
    promptBefore.textContent = p.prompt;
    respBefore.textContent = p.before;
    promptAfter.textContent = p.prompt;
    respAfter.innerHTML = p.after;
  }

  btns.forEach((b, i) => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(i);
    });
  });

  render(0);
})();

/* -----------------------------------------------
   4) Dimensionality Reduction · PCA / t-SNE
   ----------------------------------------------- */
(function(){
  const svg = document.getElementById('dr-svg');
  if(!svg) return;
  const pointsG = document.getElementById('dr-points');
  const btns = document.querySelectorAll('.dr-btn');
  const name = document.getElementById('dr-name');
  const desc = document.getElementById('dr-desc');
  const bullets = document.getElementById('dr-bullets');
  const dims = document.getElementById('dr-dims');
  const variance = document.getElementById('dr-var');
  const tip = document.getElementById('dr-tip');

  // 18 gatos in 3 clusters (pretos, laranjas, tricolores)
  // each gato has coords for raw / pca / tsne
  const gatos = [
    // pretos (color #2B1810)
    {c:'#2B1810', raw:[80,90],  pca:[90,90],  tsne:[80,80]},
    {c:'#2B1810', raw:[150,250],pca:[100,110],tsne:[105,75]},
    {c:'#2B1810', raw:[300,120],pca:[80,130], tsne:[90,100]},
    {c:'#2B1810', raw:[200,310],pca:[120,90], tsne:[85,110]},
    {c:'#2B1810', raw:[60,200], pca:[70,100], tsne:[95,90]},
    {c:'#2B1810', raw:[280,280],pca:[110,120],tsne:[110,95]},
    // laranjas (color #FF6B35)
    {c:'#FF6B35', raw:[180,80], pca:[220,160],tsne:[250,80]},
    {c:'#FF6B35', raw:[260,200],pca:[240,180],tsne:[265,90]},
    {c:'#FF6B35', raw:[100,300],pca:[210,170],tsne:[270,105]},
    {c:'#FF6B35', raw:[340,90], pca:[230,200],tsne:[255,100]},
    {c:'#FF6B35', raw:[40,160], pca:[250,170],tsne:[260,115]},
    {c:'#FF6B35', raw:[220,250],pca:[225,190],tsne:[275,75]},
    // tricolores (color #6B8E23)
    {c:'#6B8E23', raw:[120,180],pca:[160,260],tsne:[160,290]},
    {c:'#6B8E23', raw:[330,250],pca:[170,280],tsne:[150,300]},
    {c:'#6B8E23', raw:[160,140],pca:[150,270],tsne:[170,295]},
    {c:'#6B8E23', raw:[80,330], pca:[180,250],tsne:[165,310]},
    {c:'#6B8E23', raw:[300,40], pca:[140,290],tsne:[155,285]},
    {c:'#6B8E23', raw:[240,160],pca:[175,260],tsne:[145,305]}
  ];

  const meta = {
    raw: {
      name: '📦 Raw (todas as features originais)',
      desc: 'Aqui a gente mostra só 2 das 5 features (peso × idade) sem nenhuma redução. Os clusters ficam misturados, o modelo se perde em alta dimensão.',
      bullets: [
        '<li>🎯 <strong>5 features</strong> originais: peso, idade, cor dominante, comprimento de pelo, score de bicho-grilice</li>',
        '<li>🌀 <strong>Maldição da dimensionalidade</strong>: distância entre pontos perde significado</li>',
        '<li>💸 Treino fica caro e lento</li>'
      ],
      dims: '5D · sem redução',
      variance: 'N/A',
      tip: '⚡ "Bora reduzir!" Partir pra PCA ou t-SNE faz a diferença em modelos lineares e visualização.'
    },
    pca: {
      name: '📐 PCA (Principal Component Analysis)',
      desc: 'PCA encontra as direções de <strong>maior variância</strong> nos dados e projeta tudo nelas. Linear, rápido, determinístico. Os clusters começam a se separar mas sobrepõem.',
      bullets: [
        '<li>📏 <strong>Linear</strong>: rotaciona os eixos pra alinhar com a variância</li>',
        '<li>⚡ Super <strong>rápido</strong>: funciona em milhões de pontos</li>',
        '<li>🎯 Preserva <strong>estrutura global</strong>, mas perde relações não-lineares</li>',
        '<li>🛠️ Bom como <strong>pré-processamento</strong> antes de outro modelo</li>'
      ],
      dims: '5D → 2D',
      variance: '~ 78%',
      tip: '🎓 Na prova: PCA é <strong>linear</strong> e <strong>supervisionável</strong>. Use quando quiser velocidade e interpretabilidade.'
    },
    tsne: {
      name: '🎨 t-SNE (t-distributed Stochastic Neighbor Embedding)',
      desc: 't-SNE é <strong>não-linear</strong> e foca em preservar <strong>vizinhança local</strong>: pontos próximos no espaço original ficam próximos no plot. Os clusters se separam <em>lindamente</em>.',
      bullets: [
        '<li>🌀 <strong>Não-linear</strong>: captura curvas, espirais, manifolds complexos</li>',
        '<li>👁️ Feito <strong>pra visualização</strong>, não pra usar como feature</li>',
        '<li>🐢 <strong>Lento</strong>: O(n²), não escala bem</li>',
        '<li>🎲 <strong>Estocástico</strong>: rodadas diferentes dão plots diferentes</li>'
      ],
      dims: '5D → 2D',
      variance: 'N/A (não-linear)',
      tip: '🎨 t-SNE é o queridinho pra <strong>visualizar embeddings</strong> (palavras, imagens, gatos). UMAP é o concorrente moderno: mais rápido e estável.'
    }
  };

  function render(algo){
    pointsG.innerHTML = '';
    gatos.forEach((g, i) => {
      const [x, y] = g[algo];
      const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx', x);
      c.setAttribute('cy', y);
      c.setAttribute('r', 8);
      c.setAttribute('fill', g.c);
      c.setAttribute('stroke', '#2B1810');
      c.setAttribute('stroke-width', '1.5');
      c.style.transition = 'cx 0.6s, cy 0.6s';
      c.style.transitionDelay = (i * 0.02) + 's';
      pointsG.appendChild(c);
    });
    const m = meta[algo];
    name.textContent = m.name;
    desc.innerHTML = m.desc;
    bullets.innerHTML = m.bullets.join('');
    dims.textContent = m.dims;
    variance.textContent = m.variance;
    tip.innerHTML = m.tip;
  }

  btns.forEach(b => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.algo);
    });
  });

  render('raw');
})();

/* ===== bloco 2 ===== */

/* -----------------------------------------------
   5) BLEU · n-gram overlap calc
   ----------------------------------------------- */
(function(){
  const tokensG = document.getElementById('bleu-tokens');
  if(!tokensG) return;
  const btns = document.querySelectorAll('.bleu-cand-btn');
  const score = document.getElementById('bleu-score');
  const verdict = document.getElementById('bleu-verdict');

  const ref = 'o gato preto pulou em cima do sofá'.split(' ');
  const cands = [
    {tokens: 'o gato preto pulou em cima do sofá'.split(' '), verdict: '🎯 Tradução idêntica à referência. BLEU máximo.'},
    {tokens: 'o gato preto pulou no sofá'.split(' '), verdict: '✅ Quase perfeita: pulou "em cima do" foi simplificado pra "no". Boa BLEU.'},
    {tokens: 'o felino escuro saltou sobre o estofado'.split(' '), verdict: '😼 Sentido idêntico, palavras diferentes. BLEU detesta sinônimos. Aqui ele <strong>falha</strong>.'},
    {tokens: 'em cima do sofá pulou o gato preto'.split(' '), verdict: '🔀 Todas as palavras certas, ordem diferente. Unigramas batem, mas n-gramas maiores caem.'},
    {tokens: 'o cachorro azul comeu a casa'.split(' '), verdict: '❌ Tradução completamente errada. BLEU vai pro chão.'}
  ];

  function ngrams(arr, n){
    const out = [];
    for(let i=0;i<=arr.length-n;i++) out.push(arr.slice(i,i+n).join(' '));
    return out;
  }

  function precision(candNg, refNg){
    if(candNg.length === 0) return 0;
    const refCount = {};
    refNg.forEach(g => refCount[g] = (refCount[g]||0)+1);
    let matches = 0;
    candNg.forEach(g => {
      if(refCount[g] > 0){ matches++; refCount[g]--; }
    });
    return matches / candNg.length;
  }

  function calc(i){
    const c = cands[i];
    const refSet = new Set(ref);

    // tokens visualization
    tokensG.innerHTML = '';
    c.tokens.forEach(t => {
      const s = document.createElement('span');
      s.className = 'bleu-tok';
      if(refSet.has(t)) s.classList.add('match');
      else s.classList.add('miss');
      s.textContent = t;
      tokensG.appendChild(s);
    });

    // n-gram precisions
    const p = [];
    for(let n=1;n<=4;n++){
      p.push(precision(ngrams(c.tokens, n), ngrams(ref, n)));
    }
    for(let n=1;n<=4;n++){
      const pct = Math.round(p[n-1]*100);
      document.getElementById('bleu-'+n+'gram').style.width = pct + '%';
      document.getElementById('bleu-'+n+'pct').textContent = pct + '%';
    }

    // geometric mean (with smoothing for zeros)
    const safeP = p.map(x => Math.max(x, 0.001));
    const gm = Math.pow(safeP[0]*safeP[1]*safeP[2]*safeP[3], 0.25);

    // brevity penalty
    const bp = c.tokens.length >= ref.length ? 1 : Math.exp(1 - ref.length / Math.max(1, c.tokens.length));
    const final = gm * bp;

    // if all near zero, just floor
    const display = p.some(x => x === 0) && i === 4 ? 0 : final;
    score.textContent = display.toFixed(2);
    verdict.innerHTML = c.verdict;
  }

  btns.forEach((b, i) => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      calc(i);
    });
  });
  calc(0);
})();

/* -----------------------------------------------
   6) BERTScore · semantic similarity demo
   ----------------------------------------------- */
(function(){
  const btns = document.querySelectorAll('.bert-pair-btn');
  if(!btns.length) return;
  const ref = document.getElementById('bert-ref');
  const cand = document.getElementById('bert-cand');
  const analysis = document.getElementById('bert-analysis');
  const bleuV = document.getElementById('bert-bleu');
  const bleuVerd = document.getElementById('bert-bleu-verdict');
  const bertV = document.getElementById('bert-bert');
  const bertVerd = document.getElementById('bert-bert-verdict');

  const pairs = [
    {
      ref: '"o gato adora dormir no sol"',
      cand: '"o gato adora dormir no sol"',
      analysis: 'As duas frases são <strong>idênticas</strong>. Qualquer métrica acerta. Score máximo nos dois.',
      bleu: 1.00, bleuV: 'match exato',
      bert: 1.00, bertV: 'idêntico em significado'
    },
    {
      ref: '"o gato adora dormir no sol"',
      cand: '"o felino aprecia cochilar ao sol"',
      analysis: 'Significado <strong>quase idêntico</strong>, mas <em>todas</em> as palavras-conteúdo trocaram. BLEU desaba. <strong>BERTScore</strong> entende que "felino"≈"gato" e "cochilar"≈"dormir" via embeddings.',
      bleu: 0.13, bleuV: 'sem overlap léxico',
      bert: 0.91, bertV: 'sentido preservado'
    },
    {
      ref: '"o gato adora dormir no sol"',
      cand: '"o bichano gosta de tirar sonecas ensolaradas"',
      analysis: '<strong>Paráfrase livre</strong>. Estrutura sintática diferente, vocabulário trocado, mas a ideia é a mesma. BLEU pena. BERTScore entende o que tá acontecendo.',
      bleu: 0.08, bleuV: 'baixa precisão',
      bert: 0.84, bertV: 'paráfrase válida'
    },
    {
      ref: '"o gato adora dormir no sol"',
      cand: '"o gato detesta dormir no sol"',
      analysis: '<strong>Quase tudo igual</strong>, só "adora" virou "detesta". BLEU acha que tá ótimo (4 de 6 unigramas batem). BERTScore <strong>também</strong> dá score alto, porque mede similaridade contextual: esse é um caso onde BERTScore <em>falha</em>.',
      bleu: 0.78, bleuV: 'palavras quase iguais',
      bert: 0.88, bertV: '⚠️ falha em negação'
    },
    {
      ref: '"o gato adora dormir no sol"',
      cand: '"o gato adora atacar o brinquedinho"',
      analysis: 'Mesmo sujeito, mesmo verbo "adora", mas <strong>contexto diferente</strong>. BLEU dá score parcial (3 de 6 palavras batem). BERTScore vê que o restante da frase tem outro sentido, score baixa.',
      bleu: 0.43, bleuV: 'overlap parcial',
      bert: 0.62, bertV: 'sentido divergente'
    },
    {
      ref: '"o gato adora dormir no sol"',
      cand: '"a impressora estava sem tinta ontem"',
      analysis: '<strong>Frases completamente independentes</strong>. Nenhuma relação semântica nem lexical. As duas métricas batem fundo.',
      bleu: 0.00, bleuV: 'zero overlap',
      bert: 0.18, bertV: 'sem relação'
    }
  ];

  function render(i){
    const p = pairs[i];
    ref.textContent = p.ref;
    cand.textContent = p.cand;
    analysis.innerHTML = p.analysis;
    bleuV.textContent = p.bleu.toFixed(2);
    bleuVerd.textContent = p.bleuV;
    bertV.textContent = p.bert.toFixed(2);
    bertVerd.innerHTML = p.bertV;
  }

  btns.forEach((b, i) => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(i);
    });
  });
  render(0);
})();

/* -----------------------------------------------
   7) ROUGE · recall-oriented metric
   ----------------------------------------------- */
(function(){
  const btns = document.querySelectorAll('.rouge-cand-btn');
  if(!btns.length) return;
  const refEl = document.getElementById('rouge-ref');
  const candEl = document.getElementById('rouge-cand');
  const r1 = document.getElementById('rouge-1');
  const r2 = document.getElementById('rouge-2');
  const rL = document.getElementById('rouge-l');
  const verdict = document.getElementById('rouge-verdict');

  const refHTML = '"<span class="hit">o gato preto</span> <span class="hit">passou o dia</span> <span class="hit">dormindo</span> no sofá <span class="hit">depois</span> de muito brincar"';
  const refClean = '"o gato preto passou o dia dormindo no sofá depois de muito brincar"';

  const cands = [
    {
      html: '"<span class="hit">o gato preto</span> <span class="hit">passou o dia</span> <span class="hit">dormindo</span> no sofá <span class="hit">depois</span> de muito brincar"',
      refMode: 'highlight',
      r1: 1.00, r2: 1.00, rL: 1.00,
      verdict: 'Resumo idêntico à referência: score máximo em todas as variantes.'
    },
    {
      html: '"o <span class="hit">gato preto dormiu</span> bastante depois de <span class="hit">brincar</span>"',
      refMode: 'partial',
      r1: 0.62, r2: 0.31, rL: 0.54,
      verdict: 'Resumo coerente, captura a ideia principal mas perde detalhes ("o dia", "sofá"). ROUGE-1 OK, ROUGE-2 baixo.'
    },
    {
      html: '"<span class="hit">o gato</span> brincou e cansou"',
      refMode: 'low',
      r1: 0.31, r2: 0.08, rL: 0.23,
      verdict: 'Resumo muito curto: perdeu informação demais. ROUGE pune resumos que não cobrem a referência.'
    },
    {
      html: '"o bichano negro tirou uma soneca após muita diversão"',
      refMode: 'paraphrase',
      r1: 0.08, r2: 0.00, rL: 0.08,
      verdict: '<strong>Paráfrase semanticamente perfeita</strong>, mas ROUGE não enxerga sinônimos. Use BERTScore aqui.'
    },
    {
      html: '"<span class="hit">o cachorro</span> ladrou para o carteiro de manhã cedo"',
      refMode: 'wrong',
      r1: 0.08, r2: 0.00, rL: 0.08,
      verdict: '❌ Resumo trocou de assunto. Mas ROUGE confunde: só vê overlap de tokens, sem entender que falou outro bicho.'
    }
  ];

  function render(i){
    const c = cands[i];
    refEl.innerHTML = refHTML;
    candEl.innerHTML = c.html;
    // animate bars
    r1.textContent = c.r1.toFixed(2);
    r2.textContent = c.r2.toFixed(2);
    rL.textContent = c.rL.toFixed(2);
    verdict.innerHTML = c.verdict;
  }

  btns.forEach((b, i) => {
    b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(i);
    });
  });
  render(0);
})();

/* -----------------------------------------------
   8) Endpoint types · traffic patterns & tradeoffs
   ----------------------------------------------- */
(function(){
  const types = document.querySelectorAll('.endpoint-type');
  if(!types.length) return;
  const explains = {
    realtime: document.getElementById('ep-realtime'),
    serverless: document.getElementById('ep-serverless'),
    async: document.getElementById('ep-async'),
    batch: document.getElementById('ep-batch')
  };
  const trafficG = document.getElementById('ep-traffic-pattern');
  const costBar = document.getElementById('ep-cost-bar');
  const costV = document.getElementById('ep-cost-v');
  const latBar = document.getElementById('ep-lat-bar');
  const latV = document.getElementById('ep-lat-v');
  const volBar = document.getElementById('ep-vol-bar');
  const volV = document.getElementById('ep-vol-v');

  const profiles = {
    realtime: {
      pattern: () => {
        // smooth steady curve with mild variation
        let d = 'M 20 150';
        for(let x=20;x<=380;x+=20){
          const y = 80 + Math.sin(x*0.05)*15 + Math.random()*8;
          d += ` L ${x} ${y}`;
        }
        return `<path d="${d}" fill="none" stroke="#FF6B35" stroke-width="2.5"/><path d="${d} L 380 180 L 20 180 Z" fill="#FF6B35" fill-opacity="0.18"/>`;
      },
      cost: {w: 82, v: 'Alto · 24/7', c: '#C73E1D'},
      lat: {w: 12, v: 'Muito baixa (ms)', c: '#6B8E23'},
      vol: {w: 80, v: 'Alto contínuo', c: '#FF9900'}
    },
    serverless: {
      pattern: () => {
        // spiky pattern
        let d = 'M 20 180';
        const spikes = [60, 110, 180, 240, 310, 360];
        for(let x=20;x<=380;x+=4){
          const near = spikes.find(s => Math.abs(s-x) < 12);
          let y = 175;
          if(near) y = 80 + Math.abs(near - x)*8;
          y = Math.max(50, Math.min(180, y));
          d += ` L ${x} ${y}`;
        }
        return `<path d="${d}" fill="none" stroke="#5C8D89" stroke-width="2.5"/><path d="${d} L 380 180 L 20 180 Z" fill="#5C8D89" fill-opacity="0.18"/>`;
      },
      cost: {w: 38, v: 'Baixo · paga uso', c: '#6B8E23'},
      lat: {w: 55, v: 'Variável (cold start)', c: '#F4D35E'},
      vol: {w: 40, v: 'Picado · intermitente', c: '#5C8D89'}
    },
    async: {
      pattern: () => {
        // slow steady, gentle rise
        let d = 'M 20 160';
        for(let x=20;x<=380;x+=15){
          const y = 130 + Math.sin(x*0.02)*20 + Math.random()*6;
          d += ` L ${x} ${y}`;
        }
        return `<path d="${d}" fill="none" stroke="#8B4F7F" stroke-width="2.5"/><path d="${d} L 380 180 L 20 180 Z" fill="#8B4F7F" fill-opacity="0.18"/>`;
      },
      cost: {w: 50, v: 'Médio · com fila', c: '#F4D35E'},
      lat: {w: 75, v: 'Aceita demora', c: '#8B4F7F'},
      vol: {w: 60, v: 'Payload grande', c: '#8B4F7F'}
    },
    batch: {
      pattern: () => {
        // single big burst at end
        let d = 'M 20 178';
        for(let x=20;x<=240;x+=10){
          d += ` L ${x} 178`;
        }
        // ramp up sharply
        d += ' L 260 170 L 280 130 L 300 80 L 320 60 L 340 75 L 360 130 L 380 178';
        return `<path d="${d}" fill="none" stroke="#6B8E23" stroke-width="2.5"/><path d="${d} L 380 180 L 20 180 Z" fill="#6B8E23" fill-opacity="0.18"/>`;
      },
      cost: {w: 22, v: 'Baixo · só na hora', c: '#6B8E23'},
      lat: {w: 95, v: 'Offline (lote)', c: '#C73E1D'},
      vol: {w: 95, v: 'Massivo (em lote)', c: '#6B8E23'}
    }
  };

  function activate(ep){
    types.forEach(t => t.classList.toggle('active', t.dataset.ep === ep));
    Object.entries(explains).forEach(([k, el]) => el.classList.toggle('active', k === ep));
    const p = profiles[ep];
    trafficG.innerHTML = p.pattern();
    costBar.style.width = p.cost.w + '%';
    costBar.style.background = p.cost.c;
    costV.textContent = p.cost.v;
    latBar.style.width = p.lat.w + '%';
    latBar.style.background = p.lat.c;
    latV.textContent = p.lat.v;
    volBar.style.width = p.vol.w + '%';
    volBar.style.background = p.vol.c;
    volV.textContent = p.vol.v;
  }

  types.forEach(t => {
    t.addEventListener('click', () => activate(t.dataset.ep));
  });
  activate('realtime');
})();

/* ===== bloco 3 ===== */

/* -----------------------------------------------
   9) MLOps loop · node detail panel
   ----------------------------------------------- */
(function(){
  const nodes = document.querySelectorAll('.mlops-node');
  if(!nodes.length) return;
  const title = document.getElementById('mlops-detail-title');
  const text = document.getElementById('mlops-detail-text');
  const tools = document.getElementById('mlops-detail-tools');

  const phases = {
    data: {
      title: '📊 Data · ingestão e preparação',
      text: 'Tudo começa com dado. Aqui você coleta, limpa, versiona e armazena. <strong>Feature Store</strong> é o coração: features reutilizáveis entre times. <strong>Glue</strong> faz ETL serverless. <strong>S3</strong> é o data lake. Sem dado bom, modelo bom é miragem.',
      tools: ['Feature Store', 'Glue', 'S3', 'Data Wrangler', 'Athena']
    },
    train: {
      title: '🧪 Train · treino e tuning',
      text: 'Pega o dataset, configura hiperparâmetros, treina. <strong>SageMaker Training Jobs</strong> sobem cluster, treina, mata. <strong>AMT</strong> tuna automaticamente. <strong>Autopilot</strong> testa N algoritmos sozinho. <strong>Pipelines</strong> automatiza essa etapa.',
      tools: ['Training Jobs', 'AMT', 'Autopilot', 'Pipelines', 'Spot Instances']
    },
    eval: {
      title: '📐 Eval · validação e métricas',
      text: 'Modelo treinado <em>não é</em> modelo aprovado. Mede accuracy, F1, BLEU, ROUGE, BERTScore (depende do problema). <strong>Clarify</strong> avalia viés e explicabilidade (SHAP). Só passa se bater o baseline e regras de fairness.',
      tools: ['Clarify', 'Experiments', 'Model Cards', 'Custom metrics']
    },
    deploy: {
      title: '🚀 Deploy · subir pra produção',
      text: 'Modelo aprovado vira <em>endpoint</em>. <strong>Model Registry</strong> guarda versões e quem aprovou. <strong>Endpoints</strong> (real-time/serverless/async/batch) servem inferência. Blue/green ou shadow deploy pra trocar sem dor.',
      tools: ['Model Registry', 'Endpoints', 'Bedrock', 'EKS', 'CodeDeploy']
    },
    monitor: {
      title: '👀 Monitor · vigiar 24/7',
      text: 'Modelo em produção precisa ser vigiado. <strong>Model Monitor</strong> compara distribuição da produção vs treino: data quality, model quality, bias, feature attribution. Dispara alerta via <strong>CloudWatch</strong> se algo desvia.',
      tools: ['Model Monitor', 'CloudWatch', 'EventBridge', 'Clarify']
    },
    retrain: {
      title: '🔄 Retrain · loop fechado',
      text: 'Drift detectado → dispara <strong>Pipeline</strong> de retreino. Coleta dados novos, retreina, avalia, deploya (com aprovação humana ou automática). É aí que MLOps fecha o ciclo e vira <em>contínuo</em>.',
      tools: ['Pipelines', 'EventBridge', 'Step Functions', 'Lambda', 'Approvals']
    }
  };

  const detailWrap = document.getElementById('mlops-detail');

  function show(key){
    nodes.forEach(n => n.classList.toggle('active', n.dataset.node === key));
    const p = phases[key];
    title.textContent = p.title;
    text.innerHTML = p.text;
    tools.innerHTML = p.tools.map(t => `<span class="tool">${t}</span>`).join('');
    detailWrap.classList.add('show');
  }

  nodes.forEach(n => n.addEventListener('click', () => show(n.dataset.node)));
  show('data');
})();

/* -----------------------------------------------
   10) DeepAR · time series forecast
   ----------------------------------------------- */
(function(){
  const svg = document.getElementById('deepar-svg');
  if(!svg) return;
  const past = document.getElementById('deepar-past');
  const forecast = document.getElementById('deepar-forecast');
  const band = document.getElementById('deepar-band');
  const sep = document.getElementById('deepar-sep');
  const sepLbl = document.getElementById('deepar-sep-label');
  const pointsG = document.getElementById('deepar-points');
  const toggles = document.querySelectorAll('.deepar-toggle');

  const state = { forecast: false, confidence: false, multi: false };

  // Generate past + forecast for "biscoito Pipoca"
  // viewBox 0 0 600 320, x range 60..560, sep at 380, y range 40..260
  // 12 months past + 6 forecast = 18 points
  function makeSeries(seed, scale, trend){
    let v = 150;
    const pts = [];
    let r = seed;
    function rand(){ r = (r * 9301 + 49297) % 233280; return r / 233280; }
    for(let i=0;i<18;i++){
      v += (rand() - 0.5) * 18 + trend;
      // seasonality
      v += Math.sin(i * 0.7) * 8 * scale;
      pts.push(v);
    }
    return pts;
  }

  const pipoca = makeSeries(42, 1.0, 0.4);
  const mel = makeSeries(99, 0.8, 0.2);
  const bento = makeSeries(13, 1.2, 0.6);

  function pathFor(arr, startIdx, endIdx, xOffset){
    let d = '';
    for(let i=startIdx;i<=endIdx;i++){
      const x = 60 + (i / 17) * 500;
      const y = 280 - arr[i];
      if(y < 40 || y > 260) continue;
      const clampedY = Math.max(40, Math.min(260, y));
      d += (i === startIdx ? 'M ' : ' L ') + x + ' ' + clampedY;
    }
    return d;
  }

  function bandPath(arr, startIdx, endIdx, spread){
    // upper line going forward
    let dUp = '';
    let dDown = '';
    for(let i=startIdx;i<=endIdx;i++){
      const x = 60 + (i / 17) * 500;
      const wid = spread * (1 + (i - startIdx) * 0.25);
      const yUp = Math.max(40, Math.min(260, 280 - (arr[i] + wid)));
      const yDown = Math.max(40, Math.min(260, 280 - (arr[i] - wid)));
      dUp += (i === startIdx ? 'M ' : ' L ') + x + ' ' + yUp;
      dDown = ' L ' + x + ' ' + yDown + dDown;
    }
    return dUp + dDown + ' Z';
  }

  function renderPoints(){
    pointsG.innerHTML = '';
    // past points
    for(let i=0;i<12;i++){
      const x = 60 + (i / 17) * 500;
      const y = Math.max(40, Math.min(260, 280 - pipoca[i]));
      const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx', x);
      c.setAttribute('cy', y);
      c.setAttribute('r', 3.5);
      c.setAttribute('fill', '#2B1810');
      pointsG.appendChild(c);
    }
    // forecast points if toggled
    if(state.forecast){
      for(let i=12;i<18;i++){
        const x = 60 + (i / 17) * 500;
        const y = Math.max(40, Math.min(260, 280 - pipoca[i]));
        const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx', x);
        c.setAttribute('cy', y);
        c.setAttribute('r', 3.5);
        c.setAttribute('fill', '#FF6B35');
        c.setAttribute('stroke', '#2B1810');
        c.setAttribute('stroke-width', '1');
        pointsG.appendChild(c);
      }
    }
    // multi series
    if(state.multi){
      ['mel', 'bento'].forEach((name, idx) => {
        const arr = name === 'mel' ? mel : bento;
        const color = name === 'mel' ? '#5C8D89' : '#8B4F7F';
        const past12 = pathFor(arr, 0, 11);
        const pPast = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pPast.setAttribute('d', past12);
        pPast.setAttribute('fill', 'none');
        pPast.setAttribute('stroke', color);
        pPast.setAttribute('stroke-width', '2');
        pPast.setAttribute('opacity', '0.65');
        pointsG.appendChild(pPast);

        if(state.forecast){
          const fc = pathFor(arr, 11, 17);
          const pFc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          pFc.setAttribute('d', fc);
          pFc.setAttribute('fill', 'none');
          pFc.setAttribute('stroke', color);
          pFc.setAttribute('stroke-width', '2');
          pFc.setAttribute('stroke-dasharray', '5 3');
          pFc.setAttribute('opacity', '0.65');
          pointsG.appendChild(pFc);
        }

        // label
        const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const lastX = 60 + (11 / 17) * 500;
        const lastY = Math.max(40, Math.min(260, 280 - arr[11]));
        lbl.setAttribute('x', lastX - 60);
        lbl.setAttribute('y', lastY - 6);
        lbl.setAttribute('font-family', 'JetBrains Mono');
        lbl.setAttribute('font-size', '10');
        lbl.setAttribute('fill', color);
        lbl.setAttribute('font-weight', '700');
        lbl.textContent = name === 'mel' ? 'Mel' : 'Bento';
        pointsG.appendChild(lbl);
      });
    }
  }

  function update(){
    past.setAttribute('d', pathFor(pipoca, 0, 11));

    if(state.forecast){
      forecast.setAttribute('d', pathFor(pipoca, 11, 17));
      forecast.setAttribute('opacity', '1');
      sep.setAttribute('opacity', '0.8');
      sepLbl.setAttribute('opacity', '1');
    } else {
      forecast.setAttribute('opacity', '0');
      sep.setAttribute('opacity', '0');
      sepLbl.setAttribute('opacity', '0');
    }

    if(state.confidence && state.forecast){
      band.setAttribute('d', bandPath(pipoca, 11, 17, 18));
      band.setAttribute('opacity', '1');
    } else {
      band.setAttribute('opacity', '0');
    }

    // Pipoca label
    renderPoints();

    // main label "Pipoca"
    const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lbl.setAttribute('x', 70);
    lbl.setAttribute('y', Math.max(40, Math.min(260, 280 - pipoca[0]) - 8));
    lbl.setAttribute('font-family', 'JetBrains Mono');
    lbl.setAttribute('font-size', '11');
    lbl.setAttribute('fill', '#2B1810');
    lbl.setAttribute('font-weight', '700');
    lbl.textContent = 'Pipoca';
    pointsG.appendChild(lbl);
  }

  toggles.forEach(t => {
    t.addEventListener('click', () => {
      const k = t.dataset.toggle;
      state[k] = !state[k];
      t.classList.toggle('active', state[k]);
      // confidence depends on forecast being on
      if(k === 'forecast' && !state.forecast) state.confidence = false;
      const confBtn = document.querySelector('.deepar-toggle[data-toggle="confidence"]');
      if(confBtn && !state.confidence) confBtn.classList.remove('active');
      update();
    });
  });

  update();
})();

/* -----------------------------------------------
   11) SageMaker Experiments · add run
   ----------------------------------------------- */
(function(){
  const addBtn = document.getElementById('exp-add-btn');
  if(!addBtn) return;
  const tbody = document.getElementById('exp-tbody');
  const algoSel = document.getElementById('exp-algo');
  const algoV = document.getElementById('exp-algo-v');
  const lrIn = document.getElementById('exp-lr');
  const lrV = document.getElementById('exp-lr-v');
  const epIn = document.getElementById('exp-ep');
  const epV = document.getElementById('exp-ep-v');
  const dsSel = document.getElementById('exp-ds');
  const dsV = document.getElementById('exp-ds-v');

  let runCount = 4;
  let bestAcc = 0.88;

  function lrValue(slider){
    // slider 1..100 → lr 0.001..0.1, linear
    const v = parseInt(slider, 10);
    const lr = 0.001 + (v/100) * 0.099;
    return lr < 0.01 ? lr.toFixed(4) : lr.toFixed(3);
  }

  function updateLabels(){
    algoV.textContent = algoSel.value;
    lrV.textContent = lrValue(lrIn.value);
    epV.textContent = epIn.value;
    dsV.textContent = dsSel.value;
  }

  [algoSel, lrIn, epIn, dsSel].forEach(el => {
    el.addEventListener('input', updateLabels);
    el.addEventListener('change', updateLabels);
  });
  updateLabels();

  function simulateAcc(){
    let base = {'XGBoost': 0.85, 'Linear Learner': 0.72, 'Random Forest': 0.79, 'Neural Net': 0.81}[algoSel.value];
    // lr sweet spot at slider=30 (~0.03)
    const lrPenalty = Math.abs(parseInt(lrIn.value) - 30) / 100 * 0.18;
    base -= lrPenalty;
    // epochs: slight gain
    const epBoost = (parseInt(epIn.value) - 50) / 200 * 0.04;
    base += epBoost;
    // dataset
    const dsBoost = {'v1.0': -0.02, 'v1.1': 0, 'v2.0-augmented': 0.045}[dsSel.value];
    base += dsBoost;
    base += (Math.random() - 0.5) * 0.02;
    return Math.max(0.55, Math.min(0.94, base));
  }

  addBtn.addEventListener('click', () => {
    runCount++;
    const acc = simulateAcc();
    const f1 = acc - 0.02 - Math.random() * 0.02;
    const tr = document.createElement('tr');
    const isBest = acc > bestAcc;
    if(isBest){
      // remove old best
      const oldBest = tbody.querySelector('tr.best');
      if(oldBest) oldBest.classList.remove('best');
      tr.classList.add('best');
      bestAcc = acc;
    }
    const id = 'run-' + String(runCount).padStart(3, '0');
    tr.innerHTML = `<td>${id}</td><td>${algoSel.value}</td><td>${lrValue(lrIn.value)}</td><td>${epIn.value}</td>
      <td><div class="acc-cell"><div class="acc-bar"><div class="acc-fill" style="width:0%;transition:width 0.7s ease"></div></div>${acc.toFixed(2)}</div></td>
      <td>${f1.toFixed(2)}</td><td>${dsSel.value}</td>`;
    tbody.appendChild(tr);
    // animate fill
    setTimeout(() => {
      const fill = tr.querySelector('.acc-fill');
      if(fill) fill.style.width = (acc * 100).toFixed(0) + '%';
    }, 50);
    // scroll the table into view (guarded for older browsers)
    if(tr.scrollIntoView) try { tr.scrollIntoView({behavior: 'smooth', block: 'nearest'}); } catch(e) {}
  });
})();

/* -----------------------------------------------
   12) Monitor · alert state machine
   ----------------------------------------------- */
(function(){
  const btns = document.querySelectorAll('.monitor-step-btn');
  if(!btns.length) return;
  const alertBox = document.getElementById('monitor-alert');
  const icon = document.getElementById('monitor-icon');
  const status = document.getElementById('monitor-status');
  const title = document.getElementById('monitor-title');
  const text = document.getElementById('monitor-text');
  const action = document.getElementById('monitor-action');
  const zone = document.getElementById('monitor-zone');
  const marker = document.getElementById('monitor-marker');
  const markerLabel = document.getElementById('monitor-marker-label');

  const states = {
    baseline: {
      cls: '',
      icon: '✅',
      status: 'SISTEMA · OK',
      title: 'Modelo saudável',
      text: 'Acurácia em 94% nos últimos checks. Distribuição dos dados de entrada bate com a distribuição de treino. Nenhuma anomalia detectada.',
      action: '<strong>📊 Próxima ação:</strong> Continuar monitorando. Próximo check em 24h.',
      markerX: 60, zoneX: 0, zoneW: 0
    },
    drift: {
      cls: 'warning',
      icon: '⚠️',
      status: 'DRIFT · DETECTADO',
      title: 'Distribuição mudando',
      text: 'Detectado <strong>data drift</strong> na feature <code style="color:#F4D35E">cor_pelo</code>: a distribuição em produção diverge da baseline em 12% (KL = 0.31). A acurácia caiu de 94% pra 88%. Ainda acima do threshold, mas atenção.',
      action: '<strong>🔍 Próxima ação:</strong> Investigar fonte do drift. Avaliar se é sazonal ou estrutural.',
      markerX: 360, zoneX: 280, zoneW: 200
    },
    alert: {
      cls: 'critical',
      icon: '🚨',
      status: 'ALERTA · CRÍTICO',
      title: 'Acurácia abaixo do threshold!',
      text: 'Acurácia caiu para <strong>71%</strong>, abaixo do mínimo aceitável (78%). <strong>CloudWatch</strong> disparou alarme. Modelo está respondendo mal em produção. Decisão imediata necessária: rollback ou retreino?',
      action: '<strong>⚡ Próxima ação:</strong> EventBridge → SageMaker Pipeline → coletar dados novos → retreinar.',
      markerX: 560, zoneX: 460, zoneW: 120
    },
    retrain: {
      cls: '',
      icon: '🔄',
      status: 'RETREINANDO · EM ANDAMENTO',
      title: 'Pipeline disparado',
      text: 'Retreino automático em execução. Dataset atualizado com últimos 90 dias de produção. Modelo novo será validado contra baseline + bias check antes de ir pra Model Registry. Aprovação humana (1-click) habilitada.',
      action: '<strong>✅ Após retreino:</strong> blue/green deploy do novo modelo → novo baseline → loop volta ao começo.',
      markerX: 60, zoneX: 0, zoneW: 0
    }
  };

  function apply(key){
    btns.forEach(b => b.classList.toggle('active', b.dataset.step === key));
    const s = states[key];
    alertBox.classList.remove('warning', 'critical');
    if(s.cls) alertBox.classList.add(s.cls);
    icon.textContent = s.icon;
    status.textContent = s.status;
    title.textContent = s.title;
    text.innerHTML = s.text;
    action.innerHTML = s.action;
    zone.setAttribute('x', s.zoneX);
    zone.setAttribute('width', s.zoneW);
    marker.setAttribute('transform', `translate(${s.markerX}, 0)`);
    markerLabel.textContent = ({baseline:'aqui', drift:'drift', alert:'alarme!', retrain:'reset'})[key];
  }

  btns.forEach(b => {
    b.addEventListener('click', () => apply(b.dataset.step));
  });
  apply('baseline');
})();