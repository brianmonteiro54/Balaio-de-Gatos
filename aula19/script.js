/* =========================================================
   AULA 19 · REVISÃO GERAL INTERATIVA
   - Hierarquia IA/ML/DL/GenAI (boneca russa clicável)
   - Quiz de tipos de aprendizado (6 cenários)
   - Tabs Classificação/Regressão/Clustering com canvas
   - Slider over/underfitting
   - Picker LLM × SLM por cenário
   - Tokenizador ao vivo
   - Comparador de janela de contexto
   - Sliders de parâmetros (temp, top-k, max)
   - Mitigações de alucinação
   - Tabs zero/one/few-shot
   - Pipeline RAG clicável
   - Chunking lab com sliders
   ========================================================= */


/* ═══════════════════════════════════════
   1. CLASSIFICADOR — quiz IA / ML / DL / GenAI
   Card central + diagrama vivo + dica + skip + atalhos
   ═══════════════════════════════════════ */
(function classifier(){
  const ITEMS = [
    { id:'gps',          label:'GPS roteando rota',         emoji:'🗺️', cat:'ai',
      hint:'Não aprende com dados — só aplica algoritmo de busca em grafo (A*, Dijkstra).',
      explain:'Algoritmos de busca são IA <strong>clássica</strong>. Não aprendem — seguem regras matemáticas. IA mas fora de ML.' },
    { id:'sql-rules',    label:'Regras SQL anti-fraude',    emoji:'📜', cat:'ai',
      hint:'Você ESCREVE as regras à mão (ex.: "valor > R$ 10k em país X = bloqueia"). Sem aprendizado.',
      explain:'Regras explícitas (if/else) é IA mas <strong>NÃO é ML</strong>. Não aprende padrões — você codifica as regras.' },
    { id:'chess-engine', label:'Stockfish (xadrez)',        emoji:'♟️', cat:'ai',
      hint:'Stockfish faz busca em árvore com poda. Não aprende com partidas — é puro algoritmo.',
      explain:'Stockfish usa busca alfa-beta — IA pura, não ML. (AlphaZero é diferente: ele é DL/RL.)' },
    { id:'spam-bayes',   label:'Filtro de spam Naive Bayes',emoji:'📧', cat:'ml',
      hint:'Aprende probabilidades a partir de e-mails rotulados. Mas é estatística simples — não usa rede neural profunda.',
      explain:'Naive Bayes aprende probabilidades de dados rotulados. <strong>ML clássico</strong> — sem redes neurais profundas.' },
    { id:'price-reg',    label:'Regressão linear de preços',emoji:'📈', cat:'ml',
      hint:'Aprende coeficientes (a,b) que minimizam o erro. Modelo estatístico, não rede neural.',
      explain:'Modelo estatístico que aprende coeficientes. ML supervisionado clássico. Nada profundo aqui.' },
    { id:'kmeans',       label:'K-Means de clientes',       emoji:'🎯', cat:'ml',
      hint:'Agrupa clientes parecidos sem rótulos. Algoritmo iterativo simples, sem rede neural.',
      explain:'Clustering não-supervisionado. Algoritmo iterativo simples. ML clássico — sem rede neural.' },
    { id:'random-forest',label:'Random Forest de fraude',   emoji:'🌳', cat:'ml',
      hint:'Centenas de árvores votando. Cada árvore aprende dos dados. Mas não é "deep" — sem camadas neurais.',
      explain:'Ensemble de árvores. ML clássico — performa muito bem em dados tabulares. Nada deep.' },
    { id:'cnn-imagenet', label:'CNN classificando imagens', emoji:'🖼️', cat:'dl',
      hint:'Convolutional Neural Network — múltiplas camadas profundas. Mas só CLASSIFICA (gato/cachorro), não gera.',
      explain:'CNN com várias camadas convolucionais aprendendo features de pixels. <strong>Deep Learning</strong> puro.' },
    { id:'resnet',       label:'ResNet pra raio-X',         emoji:'🩻', cat:'dl',
      hint:'Rede neural com 50+ camadas (deep). NÃO gera imagem nova — só classifica se há tumor.',
      explain:'Rede com 50+ camadas e skip connections. Deep Learning aplicado a imagem médica. NÃO gera nada.' },
    { id:'transformer-class', label:'BERT classificando texto', emoji:'📝', cat:'dl',
      hint:'BERT é Transformer com 12+ camadas (deep). Aqui ele só CLASSIFICA (positivo/negativo), não gera texto novo.',
      explain:'BERT é Transformer deep, MAS só classifica — não gera. Logo é DL, não GenAI.' },
    { id:'claude',       label:'Claude respondendo prompt', emoji:'💬', cat:'genai',
      hint:'É deep, mas a categoria mais ESPECÍFICA é a que descreve o uso: aqui ele GERA texto novo.',
      explain:'LLM Transformer gerando texto novo. É DL <em>e</em> GenAI. A categoria mais específica é <strong>GenAI</strong>.' },
    { id:'stable-diff',  label:'Stable Diffusion → imagem', emoji:'🎨', cat:'genai',
      hint:'Diffusion model é deep, mas a categoria mais específica é a que descreve o uso: GERA imagem nova.',
      explain:'Diffusion model gerando imagem nova. Deep Learning <strong>aplicado em geração</strong> = GenAI.' }
  ];

  const CAT_NAME = { ai:'IA', ml:'ML clássico', dl:'Deep Learning', genai:'GenAI' };
  // Slots pré-calculados por categoria pra evitar sobreposição.
  // Cada slot é um ponto (cx, cy) na zona da camada, e cada categoria
  // tem capacidade pra todos os itens daquela classe (até 4 com folga).
  // Posições escolhidas no arco INFERIOR de cada anel (longe das labels).
  const SLOTS = {
    ai:    [ {cx:80, cy:230}, {cx:240, cy:230}, {cx:120, cy:280} ],          // 3 itens
    ml:    [ {cx:90, cy:200}, {cx:230, cy:200}, {cx:160, cy:250}, {cx:200, cy:230} ],  // 4 itens
    dl:    [ {cx:100, cy:180}, {cx:220, cy:180}, {cx:160, cy:215} ],         // 3 itens
    genai: [ {cx:135, cy:185}, {cx:185, cy:185} ]                            // 2 itens
  };
  const slotIndex = { ai:0, ml:0, dl:0, genai:0 };

  const stage = document.getElementById('cl-stage');
  const counter = document.getElementById('cl-counter');
  const fill = document.getElementById('cl-fill');
  const score = document.getElementById('cl-score');
  const opts = document.querySelectorAll('.cl-opt');
  const reset = document.getElementById('cl-reset');
  const hintBtn = document.getElementById('cl-hint');
  const skipBtn = document.getElementById('cl-skip');
  const autoCheck = document.getElementById('cl-auto');
  const diagramItems = document.getElementById('cl-diagram-items');
  const diagramCounts = {
    ai: document.getElementById('dl-c-ai'),
    ml: document.getElementById('dl-c-ml'),
    dl: document.getElementById('dl-c-dl'),
    genai: document.getElementById('dl-c-genai')
  };
  if(!stage) return;

  let order, idx, correct, wrong, locked, hintUsed, autoTimer;
  const AUTO_DELAY = 7000;
  const AUTO_KEY = 'aula19-classifier-auto';
  let autoEnabled = true;
  try {
    const saved = localStorage.getItem(AUTO_KEY);
    if(saved !== null) autoEnabled = saved === '1';
  } catch(e){}
  const placedItems = []; // pra desenhar no SVG e gerar revisão
  const wrongList = [];

  function shuffle(arr){
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function init(){
    order = shuffle(ITEMS);
    idx = 0; correct = 0; wrong = 0; locked = false; hintUsed = false;
    placedItems.length = 0;
    wrongList.length = 0;
    Object.keys(slotIndex).forEach(k => slotIndex[k] = 0);
    if(autoTimer){ clearTimeout(autoTimer); autoTimer = null; }
    diagramItems.innerHTML = '';
    Object.values(diagramCounts).forEach(el => el.textContent = '0');
    hintBtn.disabled = false;
    skipBtn.disabled = false;
    if(autoCheck) autoCheck.checked = autoEnabled;
    opts.forEach(o => { o.disabled = false; o.classList.remove('is-right','is-wrong','hinted'); });
    document.querySelectorAll('.dl-ring').forEach(r => r.classList.remove('pulse'));
    renderCard();
    updateProgress();
  }

  function renderCard(){
    const item = order[idx];
    if(!item){ renderDone(); return; }
    stage.className = 'cl-stage';
    stage.innerHTML = `
      <div class="cl-card" id="cl-card">
        <div class="cl-card-top">
          <span class="cl-card-emoji">${item.emoji}</span>
          <div class="cl-card-info">
            <span class="cl-card-tag">Tecnologia ${idx+1} de ${ITEMS.length}</span>
            <div class="cl-card-name">${item.label}</div>
            <div class="cl-card-q">A qual camada esta pertence?</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderDone(){
    const total = ITEMS.length;
    const pct = Math.round((correct / total) * 100);
    let emoji, msg;
    if(pct === 100){ emoji = '🏆'; msg = 'Perfeito! Hierarquia tatuada na cabeça.'; }
    else if(pct >= 80){ emoji = '🎯'; msg = 'Muito bem! Quase tudo certo.'; }
    else if(pct >= 60){ emoji = '👍'; msg = 'Bom, mas dá pra melhorar — refaz e relê os feedbacks.'; }
    else { emoji = '🔁'; msg = 'Vale revisar a teoria. Lê o resumo abaixo e tenta de novo.'; }

    const reviewHtml = wrongList.length
      ? `<div style="margin-top:14px;padding-top:14px;border-top:1px dashed rgba(251,243,226,0.25);text-align:left">
           <strong style="color:var(--yellow);font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.06em">📋 Você errou em ${wrongList.length}:</strong>
           <ul style="list-style:none;padding:0;margin-top:8px;font-size:13px">
             ${wrongList.map(w => `<li style="padding:3px 0;color:rgba(251,243,226,0.85)">${w.emoji} <strong style="color:var(--paper)">${w.label}</strong> → era <span style="color:var(--yellow)">${CAT_NAME[w.cat]}</span></li>`).join('')}
           </ul>
         </div>`
      : '<p style="margin-top:14px;color:rgba(251,243,226,0.7);font-size:13px">✨ Zero erros — você acertou todas!</p>';

    stage.className = 'cl-stage done';
    stage.innerHTML = `
      <span class="done-emoji">${emoji}</span>
      <h3>${correct}/${total} acertos · ${pct}%</h3>
      <p>${msg}</p>
      ${reviewHtml}
      <div class="done-actions">
        <button id="cl-restart" type="button">↺ Tentar de novo</button>
      </div>
    `;
    document.getElementById('cl-restart').addEventListener('click', init);
    opts.forEach(o => o.disabled = true);
    hintBtn.disabled = true;
    skipBtn.disabled = true;
  }

  function updateProgress(){
    counter.textContent = idx >= ITEMS.length ? 'Concluído!' : `Item ${idx+1} de ${ITEMS.length}`;
    fill.style.width = (idx / ITEMS.length * 100) + '%';
    const ans = correct + wrong;
    score.textContent = `🎯 ${correct}/${ans}`;
  }

  function plotItemInDiagram(item){
    // Pega o próximo slot livre da categoria
    const slots = SLOTS[item.cat];
    if(!slots || slotIndex[item.cat] >= slots.length) return;
    const slot = slots[slotIndex[item.cat]];
    slotIndex[item.cat]++;

    const ns = 'http://www.w3.org/2000/svg';
    // Bolinha branca de fundo pra emoji ficar legível
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('class', 'cl-diagram-item');
    circle.setAttribute('cx', slot.cx);
    circle.setAttribute('cy', slot.cy);
    circle.setAttribute('r', 0);
    circle.setAttribute('fill', '#FFF9EC');
    circle.setAttribute('stroke', '#2B1810');
    circle.setAttribute('stroke-width', '1.5');
    diagramItems.appendChild(circle);

    const text = document.createElementNS(ns, 'text');
    text.setAttribute('class', 'cl-diagram-item');
    text.setAttribute('x', slot.cx);
    text.setAttribute('y', slot.cy + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '0');
    text.textContent = item.emoji;
    diagramItems.appendChild(text);

    // Anima entrada
    requestAnimationFrame(() => {
      circle.setAttribute('r', '13');
      text.setAttribute('font-size', '16');
    });

    // pulsa o anel da categoria
    const ring = document.querySelector(`.dl-ring[data-cat="${item.cat}"]`);
    if(ring){
      ring.classList.add('pulse');
      setTimeout(() => ring.classList.remove('pulse'), 500);
    }

    // atualiza contador da legenda
    const counts = { ai:0, ml:0, dl:0, genai:0 };
    placedItems.forEach(p => counts[p.cat]++);
    Object.keys(counts).forEach(k => {
      if(diagramCounts[k]) diagramCounts[k].textContent = counts[k];
    });
  }

  function startAutoTimer(){
    if(autoTimer){ clearTimeout(autoTimer); autoTimer = null; }
    if(!autoEnabled) return;
    autoTimer = setTimeout(advance, AUTO_DELAY);
  }

  function cancelAutoTimer(){
    if(autoTimer){ clearTimeout(autoTimer); autoTimer = null; }
    // remove a barra de progresso do card atual
    const bar = document.querySelector('.fb-auto-bar');
    if(bar) bar.remove();
  }

  function renderFeedback(type, item, opts){
    // type: 'right' | 'wrong' | 'skip' | 'hint'
    const isHint = type === 'hint';
    const verdictMap = {
      right: '✅ Acertou',
      wrong: '❌ Não foi',
      skip:  '⏭ Pulado',
      hint:  '💡 Dica'
    };
    const arrow = isHint ? '' : `<span class="fb-arrow">→</span><span class="fb-cat">${CAT_NAME[item.cat]}</span>`;
    const isLast = idx === ITEMS.length - 1;
    const nextBtn = isHint
      ? `<span class="fb-help">Pense antes de clicar. A categoria certa pisca em amarelo nos botões abaixo.</span>`
      : `<button class="fb-next-btn" id="fb-next-btn" type="button">${isLast ? 'Ver resultado 🏁' : 'Próxima questão'} →</button>
         <span class="fb-help">${autoEnabled ? '⏱️ avança em ' + (AUTO_DELAY/1000) + 's' : ''} <kbd>Enter</kbd> ou <kbd>Espaço</kbd></span>`;

    // Barra de progresso só pra resposta (não pra dica)
    const autoBar = (!isHint && autoEnabled)
      ? `<div class="fb-auto-bar"><div class="fb-auto-bar-fill" style="animation-duration:${AUTO_DELAY}ms"></div></div>`
      : '';

    stage.className = 'cl-stage';
    stage.innerHTML = `
      <div class="cl-card feedback ${type}" id="cl-card">
        <div class="fb-head">
          <span class="fb-verdict">${verdictMap[type]}</span>
          <span class="fb-item"><span class="fb-emoji">${item.emoji}</span> ${item.label}</span>
          ${arrow}
        </div>
        <div class="fb-text">${isHint ? item.hint : item.explain}</div>
        <div class="fb-next">${nextBtn}</div>
        ${autoBar}
      </div>
    `;

    // bind next button
    const btn = document.getElementById('fb-next-btn');
    if(btn){
      btn.addEventListener('click', () => {
        cancelAutoTimer();
        advance();
      });
      // foco no botão pra Enter funcionar imediatamente
      setTimeout(() => btn.focus(), 50);
    }

    // se o usuário interagir com o card (mouse ou foco), pausa o timer pra ele ler
    const card = document.getElementById('cl-card');
    if(card){
      card.addEventListener('mouseenter', cancelAutoTimer, { once: false });
    }

    // dispara o timer auto-advance
    if(!isHint) startAutoTimer();
  }

  function answer(cat, optEl){
    if(locked) return;
    const item = order[idx];
    if(!item) return;
    locked = true;

    const isRight = item.cat === cat;
    if(isRight){
      correct++;
      optEl.classList.add('is-right');
    } else {
      wrong++;
      wrongList.push(item);
      optEl.classList.add('is-wrong');
      const right = document.querySelector(`.cl-opt[data-cat="${item.cat}"]`);
      if(right) right.classList.add('is-right');
    }

    placedItems.push(item);
    plotItemInDiagram(item);
    renderFeedback(isRight ? 'right' : 'wrong', item);
    updateProgress();
  }

  function advance(){
    if(!locked) return;
    if(autoTimer){ clearTimeout(autoTimer); autoTimer = null; }
    locked = false;
    hintUsed = false;
    idx++;
    opts.forEach(o => o.classList.remove('is-right','is-wrong','hinted'));
    hintBtn.disabled = false;
    skipBtn.disabled = false;
    renderCard();
    updateProgress();
  }

  function showHint(){
    if(locked) return;
    const item = order[idx];
    if(!item || hintUsed) return;
    hintUsed = true;
    hintBtn.disabled = true;

    const right = document.querySelector(`.cl-opt[data-cat="${item.cat}"]`);
    if(right) right.classList.add('hinted');

    // Adiciona a dica DENTRO do card (sem substituir), preserva nome/emoji
    const card = document.getElementById('cl-card');
    if(card){
      card.classList.add('with-hint');
      const hintBox = document.createElement('div');
      hintBox.className = 'cl-hint-inline';
      hintBox.innerHTML = `<strong>💡 Dica:</strong> ${item.hint}`;
      // remove dica anterior se houver
      const prev = card.querySelector('.cl-hint-inline');
      if(prev) prev.remove();
      card.appendChild(hintBox);
    }
  }

  function skip(){
    if(locked) return;
    const item = order[idx];
    if(!item) return;
    locked = true;

    wrong++;
    wrongList.push(item);
    placedItems.push(item);
    plotItemInDiagram(item);

    const right = document.querySelector(`.cl-opt[data-cat="${item.cat}"]`);
    if(right) right.classList.add('is-right');

    renderFeedback('skip', item);
    updateProgress();
  }

  // Eventos de clique
  opts.forEach(o => {
    o.addEventListener('click', () => {
      if(locked) return; // depois de responder, só avança pelo botão Próxima
      answer(o.dataset.cat, o);
    });
  });
  reset.addEventListener('click', init);
  hintBtn.addEventListener('click', showHint);
  skipBtn.addEventListener('click', skip);

  // Toggle auto-advance
  if(autoCheck){
    autoCheck.checked = autoEnabled;
    autoCheck.addEventListener('change', () => {
      autoEnabled = autoCheck.checked;
      try { localStorage.setItem(AUTO_KEY, autoEnabled ? '1' : '0'); } catch(e){}
      // se desligou enquanto contava, cancela
      if(!autoEnabled) cancelAutoTimer();
      // se ligou e tem feedback ativo, começa a contar
      else if(locked) {
        // re-renderiza só a barra, mantendo o card
        const card = document.getElementById('cl-card');
        if(card && !card.querySelector('.fb-auto-bar')){
          const bar = document.createElement('div');
          bar.className = 'fb-auto-bar';
          bar.innerHTML = `<div class="fb-auto-bar-fill" style="animation-duration:${AUTO_DELAY}ms"></div>`;
          card.appendChild(bar);
        }
        startAutoTimer();
      }
    });
  }

  // Atalhos de teclado (só quando o classificador tá visível)
  const section = document.getElementById('hierarquia');
  function isInView(){
    const r = section.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
  document.addEventListener('keydown', e => {
    if(!isInView()) return;
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const k = e.key.toLowerCase();
    if(['1','2','3','4'].includes(k) && !locked){
      const map = { '1':'ai','2':'ml','3':'dl','4':'genai' };
      const opt = document.querySelector(`.cl-opt[data-cat="${map[k]}"]`);
      if(opt && !opt.disabled){
        e.preventDefault();
        answer(map[k], opt);
      }
    } else if(k === 'h' && !locked && !hintUsed){
      e.preventDefault();
      showHint();
    } else if(k === 's' && !locked){
      e.preventDefault();
      skip();
    } else if(k === 'a'){
      e.preventDefault();
      if(autoCheck){
        autoCheck.checked = !autoCheck.checked;
        autoCheck.dispatchEvent(new Event('change'));
      }
    } else if((e.key === 'Enter' || e.key === ' ') && locked){
      e.preventDefault();
      advance();
    }
  });

  init();
})();


/* ═══════════════════════════════════════
   2. LEARNING QUIZ
   ═══════════════════════════════════════ */
(function learnQuiz(){
  const SCENARIOS = [
    {
      text:'O abrigo tem 5.000 fotos de gatos rotuladas como "saudável" ou "doente" pelo veterinário. Você quer treinar um modelo pra classificar fotos novas.',
      answer:'supervised',
      why:'Dados <strong>rotulados</strong> (saudável/doente) + tarefa de classificação = <strong>supervisionado</strong>. O modelo aprende o mapeamento foto→rótulo.'
    },
    {
      text:'Você tem dados de 10.000 gatos do abrigo (idade, peso, raça, tempo até adoção) mas SEM categorias predefinidas. Quer descobrir grupos naturais.',
      answer:'unsupervised',
      why:'Sem rótulos + descoberta de grupos = <strong>não-supervisionado</strong>. K-Means clustering agruparia gatos similares automaticamente.'
    },
    {
      text:'Quer ensinar um robô a empilhar caixas de ração. Cada vez que empilha certo, ganha pontos. Cada vez que derruba, perde.',
      answer:'reinforcement',
      why:'Recompensa/punição por tentativa = <strong>reinforcement learning</strong>. Base do AlphaGo, RLHF dos LLMs e robótica.'
    },
    {
      text:'Spam filter: você tem 50.000 e-mails marcados como "spam" ou "não-spam" e quer um modelo pra classificar e-mails novos.',
      answer:'supervised',
      why:'Rótulos binários + classificação = <strong>supervisionado</strong>. Perfeito pra Naive Bayes ou Logistic Regression.'
    },
    {
      text:'Você quer reduzir 100 features de imóveis pra 10 dimensões mais importantes (PCA), sem usar o preço como rótulo.',
      answer:'unsupervised',
      why:'PCA é técnica de <strong>redução de dimensionalidade não-supervisionada</strong>. Não usa rótulo, descobre direções de maior variância.'
    },
    {
      text:'Treina um modelo de jogar xadrez fazendo ele jogar contra si mesmo milhões de vezes, recompensando vitórias.',
      answer:'reinforcement',
      why:'Self-play + recompensa por outcome = <strong>reinforcement learning</strong>. Foi assim que o AlphaZero aprendeu.'
    }
  ];

  let idx = 0, streak = 0, answered = false;
  const counter = document.getElementById('lq-counter');
  const streakEl = document.getElementById('lq-streak');
  const scenario = document.getElementById('lq-scenario');
  const opts = document.getElementById('lq-opts');
  const feedback = document.getElementById('lq-feedback');
  const next = document.getElementById('lq-next');
  if(!counter) return;

  function render(){
    answered = false;
    const s = SCENARIOS[idx];
    counter.textContent = `${idx+1} / ${SCENARIOS.length}`;
    streakEl.textContent = `🔥 ${streak}`;
    scenario.textContent = s.text;
    feedback.hidden = true;
    next.hidden = true;
    opts.querySelectorAll('button').forEach(b => {
      b.disabled = false;
      b.classList.remove('right','wrong');
    });
  }

  function answer(v, btn){
    if(answered) return;
    answered = true;
    const s = SCENARIOS[idx];
    const right = v === s.answer;
    if(right){ streak++; btn.classList.add('right'); }
    else { streak = 0; btn.classList.add('wrong');
      // marca a certa
      opts.querySelector(`[data-v="${s.answer}"]`).classList.add('right');
    }
    streakEl.textContent = `🔥 ${streak}`;
    feedback.hidden = false;
    feedback.className = 'lq-feedback ' + (right ? 'right' : 'wrong');
    feedback.innerHTML = (right ? '<strong>✅ Acertou!</strong> ' : '<strong>❌ Não foi.</strong> ') + s.why;
    opts.querySelectorAll('button').forEach(b => b.disabled = true);
    next.hidden = false;
    next.textContent = idx === SCENARIOS.length - 1 ? '↺ Recomeçar' : 'Próximo cenário →';
  }

  opts.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => answer(b.dataset.v, b));
  });
  next.addEventListener('click', () => {
    idx = (idx + 1) % SCENARIOS.length;
    render();
  });

  render();
})();


/* ═══════════════════════════════════════
   3. TASK TABS — classificação/regressão/clustering
   ═══════════════════════════════════════ */
(function taskTabs(){
  const tasks = {
    classification: {
      title:'🏷️ Classificação',
      desc:'Saída <strong>categórica</strong> (discreta). O modelo escolhe um rótulo de um conjunto fechado.',
      cases:'Spam vs não-spam · gato vs cachorro · fraude vs legítima · sentimento (pos/neg/neutro) · diagnóstico (3 doenças possíveis).',
      svg:`<svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="cg1" width="40" height="28" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 28" fill="none" stroke="rgba(43,24,16,0.08)"/></pattern></defs>
        <rect width="320" height="280" fill="url(#cg1)"/>
        <line x1="20" y1="240" x2="300" y2="240" stroke="#2B1810" stroke-width="2"/>
        <line x1="20" y1="20" x2="20" y2="240" stroke="#2B1810" stroke-width="2"/>
        <text x="280" y="255" font-size="10" font-family="JetBrains Mono" fill="#4A3528">peso</text>
        <text x="0" y="20" font-size="10" font-family="JetBrains Mono" fill="#4A3528">altura</text>
        <!-- Linha de decisão -->
        <line x1="40" y1="200" x2="290" y2="40" stroke="#FF6B35" stroke-width="2.5" stroke-dasharray="6,4"/>
        <text x="220" y="100" font-size="11" font-family="Sora" font-weight="700" fill="#FF6B35">fronteira</text>
        <!-- Classe A (gatos jovens — laranja) -->
        <circle cx="60" cy="180" r="9" fill="#FF6B35" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="80" cy="200" r="9" fill="#FF6B35" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="100" cy="170" r="9" fill="#FF6B35" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="110" cy="210" r="9" fill="#FF6B35" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="130" cy="190" r="9" fill="#FF6B35" stroke="#2B1810" stroke-width="1.5"/>
        <!-- Classe B (gatos adultos — sage) -->
        <circle cx="180" cy="80" r="9" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="220" cy="60" r="9" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="240" cy="100" r="9" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="260" cy="80" r="9" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="280" cy="120" r="9" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <text x="50" y="165" font-size="11" font-family="Sora" font-weight="700" fill="#FF6B35">filhote</text>
        <text x="240" y="50" font-size="11" font-family="Sora" font-weight="700" fill="#5C8D89">adulto</text>
      </svg>`
    },
    regression: {
      title:'📈 Regressão',
      desc:'Saída <strong>numérica</strong> (contínua). O modelo prediz um valor.',
      cases:'Preço de imóvel · temperatura amanhã · vendas próximo trimestre · idade do gato pela foto · tempo até adoção em dias.',
      svg:`<svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="cg2" width="40" height="28" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 28" fill="none" stroke="rgba(43,24,16,0.08)"/></pattern></defs>
        <rect width="320" height="280" fill="url(#cg2)"/>
        <line x1="20" y1="240" x2="300" y2="240" stroke="#2B1810" stroke-width="2"/>
        <line x1="20" y1="20" x2="20" y2="240" stroke="#2B1810" stroke-width="2"/>
        <text x="280" y="255" font-size="10" font-family="JetBrains Mono" fill="#4A3528">idade</text>
        <text x="0" y="20" font-size="10" font-family="JetBrains Mono" fill="#4A3528">peso</text>
        <!-- Linha de regressão -->
        <line x1="30" y1="220" x2="295" y2="40" stroke="#FF6B35" stroke-width="3"/>
        <!-- Pontos -->
        <circle cx="50" cy="210" r="6" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="80" cy="195" r="6" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="120" cy="175" r="6" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="140" cy="160" r="6" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="170" cy="140" r="6" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="200" cy="120" r="6" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="230" cy="100" r="6" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="260" cy="80" r="6" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="290" cy="60" r="6" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <text x="200" y="65" font-size="11" font-family="Sora" font-weight="700" fill="#FF6B35">y = ax + b</text>
      </svg>`
    },
    clustering: {
      title:'🔍 Clustering',
      desc:'Sem rótulos. O modelo <strong>descobre grupos</strong> de dados similares automaticamente.',
      cases:'Segmentação de clientes · agrupar gatos por comportamento · detectar anomalias · recomendação por similaridade · análise de pesquisa de mercado.',
      svg:`<svg viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="cg3" width="40" height="28" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 28" fill="none" stroke="rgba(43,24,16,0.08)"/></pattern></defs>
        <rect width="320" height="280" fill="url(#cg3)"/>
        <line x1="20" y1="240" x2="300" y2="240" stroke="#2B1810" stroke-width="2"/>
        <line x1="20" y1="20" x2="20" y2="240" stroke="#2B1810" stroke-width="2"/>
        <!-- Cluster 1 (laranja) -->
        <circle cx="80" cy="80" r="50" fill="rgba(255,107,53,0.1)" stroke="#FF6B35" stroke-width="2" stroke-dasharray="4,4"/>
        <circle cx="60" cy="70" r="7" fill="#FF6B35" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="80" cy="60" r="7" fill="#FF6B35" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="100" cy="80" r="7" fill="#FF6B35" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="70" cy="100" r="7" fill="#FF6B35" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="95" cy="105" r="7" fill="#FF6B35" stroke="#2B1810" stroke-width="1.5"/>
        <!-- Cluster 2 (sage) -->
        <circle cx="220" cy="100" r="55" fill="rgba(92,141,137,0.1)" stroke="#5C8D89" stroke-width="2" stroke-dasharray="4,4"/>
        <circle cx="200" cy="80" r="7" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="220" cy="100" r="7" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="240" cy="80" r="7" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="245" cy="120" r="7" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="210" cy="125" r="7" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>
        <!-- Cluster 3 (plum) -->
        <circle cx="160" cy="200" r="50" fill="rgba(138,111,177,0.1)" stroke="#8B4F7F" stroke-width="2" stroke-dasharray="4,4"/>
        <circle cx="140" cy="190" r="7" fill="#8B4F7F" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="170" cy="180" r="7" fill="#8B4F7F" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="180" cy="210" r="7" fill="#8B4F7F" stroke="#2B1810" stroke-width="1.5"/>
        <circle cx="155" cy="220" r="7" fill="#8B4F7F" stroke="#2B1810" stroke-width="1.5"/>
        <text x="105" y="50" font-size="11" font-family="Sora" font-weight="700" fill="#FF6B35">cluster A</text>
        <text x="245" y="55" font-size="11" font-family="Sora" font-weight="700" fill="#5C8D89">cluster B</text>
        <text x="180" y="170" font-size="11" font-family="Sora" font-weight="700" fill="#8B4F7F">cluster C</text>
      </svg>`
    }
  };

  const tabs = document.getElementById('task-tabs');
  const viz = document.getElementById('task-viz');
  if(!tabs || !viz) return;

  function render(key){
    const t = tasks[key];
    if(!t) return;
    viz.innerHTML = `
      <div class="task-canvas-wrap">${t.svg.replace('<svg', '<svg class="task-canvas"')}</div>
      <div class="task-info">
        <h3>${t.title}</h3>
        <p>${t.desc}</p>
        <div class="ti-cases"><strong>Casos clássicos:</strong> ${t.cases}</div>
      </div>
    `;
  }

  tabs.querySelectorAll('.task-tab').forEach(b => {
    b.addEventListener('click', () => {
      tabs.querySelectorAll('.task-tab').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.task);
    });
  });

  render('classification');
})();


/* ═══════════════════════════════════════
   4. FIT LAB
   ═══════════════════════════════════════ */
(function fitLab(){
  const slider = document.getElementById('fit-slider');
  const tag = document.getElementById('fs-tag');
  const desc = document.getElementById('fs-desc');
  const cursorLine = document.getElementById('cursor-line');
  const cursorTrain = document.getElementById('cursor-train');
  const cursorTest = document.getElementById('cursor-test');
  if(!slider) return;

  // Curve mappings (calibrated to SVG paths)
  // Train: starts at (60, 70), ends at (580, 270) — desce
  // Test: U-shape, mínimo perto x=320 (sweet spot)
  function trainY(x){
    // monotonicamente decrescente: y = 70 + (200 * progress^1.3)
    const progress = (x - 60) / 520;
    return 70 + 200 * Math.pow(Math.max(0, Math.min(1, progress)), 1.3);
  }
  function testY(x){
    // U: alta nas pontas, baixa no meio
    const progress = (x - 60) / 520;
    const distFromCenter = Math.abs(progress - 0.5) * 2;  // 0 no centro, 1 nas pontas
    return 130 + 110 * Math.pow(distFromCenter, 1.8) - 30 * (progress < 0.5 ? 0 : Math.pow(progress - 0.5, 1.5));
  }

  function update(){
    const v = parseInt(slider.value);
    // map 1-100 to x 60-580
    const x = 60 + (v - 1) / 99 * 520;
    cursorLine.setAttribute('x1', x);
    cursorLine.setAttribute('x2', x);
    cursorTrain.setAttribute('cx', x);
    cursorTrain.setAttribute('cy', trainY(x));
    cursorTest.setAttribute('cx', x);
    cursorTest.setAttribute('cy', testY(x));

    if(v < 30){
      tag.textContent = '😴 Underfitting';
      tag.style.background = 'var(--yellow)';
      tag.style.color = 'var(--ink)';
      desc.innerHTML = '<strong>Modelo simples demais.</strong> Erra no treino E no teste. Não capturou o padrão. Solução: modelo mais complexo, mais features, menos regularização.';
    } else if(v <= 65){
      tag.textContent = '⚖️ Bem ajustado';
      tag.style.background = 'var(--olive)';
      tag.style.color = 'var(--paper)';
      desc.innerHTML = '<strong>Ponto doce.</strong> Erro de teste mínimo. Modelo capturou o padrão sem decorar. É aqui que você quer ficar.';
    } else if(v <= 85){
      tag.textContent = '⚠️ Começando a overfitar';
      tag.style.background = 'var(--orange)';
      tag.style.color = 'var(--paper)';
      desc.innerHTML = '<strong>Atenção.</strong> Erro de treino caindo, mas erro de teste já parou de melhorar. Considere regularização, dropout, early stopping.';
    } else {
      tag.textContent = '😱 Overfitting';
      tag.style.background = 'var(--coral)';
      tag.style.color = 'var(--paper)';
      desc.innerHTML = '<strong>Modelo decorou o treino.</strong> Erro de treino bem baixo, mas erro de teste alto. Generaliza mal. Solução: regularização L1/L2, mais dados, dropout, modelo mais simples.';
    }
  }
  slider.addEventListener('input', update);
  update();
})();


/* ═══════════════════════════════════════
   5. LLM × SLM PICKER
   ═══════════════════════════════════════ */
(function llmPicker(){
  const RECS = {
    raciocinio: {
      pick:'LLM', cls:'llm',
      desc:'Raciocínio multi-step requer <strong>capacidade de inferência</strong> profunda. SLMs perdem em problemas com várias etapas, lógica encadeada e ambiguidade.',
      examples:['Claude Sonnet/Opus','GPT-4','Llama 70B/405B']
    },
    classificacao: {
      pick:'SLM', cls:'slm',
      desc:'Classificação simples (1 input → 1 categoria) é <strong>desperdiçar dinheiro</strong> com LLM grande. SLM faz com qualidade similar e custo 10x menor.',
      examples:['Claude Haiku','Llama 8B','Distilled BERT']
    },
    edge: {
      pick:'SLM', cls:'slm',
      desc:'Mobile/edge precisa rodar offline. LLMs não cabem na memória do celular. <strong>SLM compacto</strong> é a única opção viável.',
      examples:['Phi-3 Mini (3.8B)','Llama 3.2 (1B/3B)','Gemma 2B']
    },
    latencia: {
      pick:'SLM', cls:'slm',
      desc:'Latência crítica (&lt;200ms) é incompatível com LLM grande, que tem latência base de 500–2000ms. <strong>SLM responde em ~100ms</strong>.',
      examples:['Claude Haiku','Llama 8B','Mistral 7B']
    },
    custo: {
      pick:'SLM', cls:'slm',
      desc:'Em volume gigante, a diferença de custo por token vira <strong>milhões de dólares por mês</strong>. SLM bem calibrado pra sua tarefa é o caminho.',
      examples:['Llama 8B','Claude Haiku','Modelos fine-tuned próprios']
    },
    criativo: {
      pick:'LLM', cls:'llm',
      desc:'Geração criativa longa exige <strong>vocabulário rico, coerência narrativa e capacidade de manter contexto</strong> por milhares de tokens. LLMs grandes brilham aqui.',
      examples:['Claude Opus','GPT-4','Llama 405B']
    }
  };

  const picker = document.getElementById('llm-picker');
  const result = document.getElementById('llm-result');
  if(!picker || !result) return;

  function render(key){
    const r = RECS[key];
    if(!r) return;
    result.innerHTML = `
      <div class="llm-pick ${r.cls}">
        <span class="label">RECOMENDAÇÃO</span>
        <span class="winner">${r.pick}</span>
      </div>
      <div class="llm-explain">
        <h3>Por quê ${r.pick}?</h3>
        <p>${r.desc}</p>
        <div class="examples">${r.examples.map(e => `<span>${e}</span>`).join('')}</div>
      </div>
    `;
  }

  picker.querySelectorAll('.llm-scenario').forEach(b => {
    b.addEventListener('click', () => {
      picker.querySelectorAll('.llm-scenario').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.s);
    });
  });
  render('raciocinio');
})();


/* ═══════════════════════════════════════
   6. TOKEN LAB
   ═══════════════════════════════════════ */
(function tokenLab(){
  const text = document.getElementById('token-text');
  const viz = document.getElementById('token-viz');
  const chars = document.getElementById('ts-chars');
  const words = document.getElementById('ts-words');
  const tokens = document.getElementById('ts-tokens');
  const cost = document.getElementById('ts-cost');
  if(!text) return;

  // Tokenização aproximada estilo BPE: tokens ~ palavras + sufixos comuns + pontuação
  function tokenize(s){
    // Quebra por palavras + pontuação
    const re = /\w+|[.,!?;:()\-—'"\[\]{}\/]|[\s]+/g;
    const matches = s.match(re) || [];
    const result = [];
    matches.forEach(m => {
      if(/^\s+$/.test(m)){ result.push(m); return; }
      // se palavra > 6 chars, divide em sub-tokens (simulação BPE)
      if(m.length > 7 && /^\w+$/.test(m)){
        // divide aproximadamente: prefixo + sufixo
        const mid = Math.ceil(m.length / 2);
        result.push(m.slice(0, mid));
        result.push(m.slice(mid));
      } else {
        result.push(m);
      }
    });
    return result;
  }

  function update(){
    const s = text.value;
    const ts = tokenize(s);
    // tokens "reais" (ignora espaços puros pra contagem)
    const realTokens = ts.filter(t => !/^\s+$/.test(t));

    chars.textContent = s.length.toLocaleString('pt-BR');
    words.textContent = (s.match(/\b\w+\b/g) || []).length.toLocaleString('pt-BR');
    tokens.textContent = realTokens.length.toLocaleString('pt-BR');

    // Pricing Sonnet aprox: input $3/1M = 0.000003 por token
    const c = realTokens.length * 0.000003;
    cost.textContent = '$' + c.toFixed(6);

    // viz colorida
    let html = '';
    let colorIdx = 0;
    ts.forEach(t => {
      if(/^\s+$/.test(t)){ html += t.replace(/\n/g, '<br>'); return; }
      html += `<span class="tok t-${colorIdx % 6}">${t.replace(/</g, '&lt;')}</span>`;
      colorIdx++;
    });
    viz.innerHTML = html;
  }

  text.addEventListener('input', update);
  update();
})();


/* ═══════════════════════════════════════
   7. WINDOW LAB — context window
   ═══════════════════════════════════════ */
(function windowLab(){
  const MODELS = [
    { name:'Claude Opus 4.7', ctx:1000000, note:'1M tokens · novidade 2026' },
    { name:'Claude Sonnet', ctx:200000, note:'200k tokens' },
    { name:'Claude Haiku', ctx:200000, note:'200k tokens' },
    { name:'GPT-4o', ctx:128000, note:'128k tokens' },
    { name:'Llama 3.1 70B', ctx:128000, note:'128k tokens' },
    { name:'Titan Text Premier', ctx:32000, note:'32k tokens' },
    { name:'Mistral 7B', ctx:8192, note:'8k tokens' }
  ];

  const slider = document.getElementById('window-slider');
  const valEl = document.getElementById('window-val');
  const modelsEl = document.getElementById('window-models');
  const quickBtns = document.querySelectorAll('.window-quick button');
  if(!slider || !modelsEl) return;

  function fmtNum(n){
    if(n >= 1e6) return (n/1e6).toFixed(1).replace('.0','') + 'M';
    if(n >= 1e3) return (n/1e3).toFixed(1).replace('.0','') + 'k';
    return n.toLocaleString('pt-BR');
  }

  function render(){
    const wanted = parseInt(slider.value);
    valEl.textContent = fmtNum(wanted) + ' tokens';
    quickBtns.forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.tokens) === wanted);
    });

    modelsEl.innerHTML = MODELS.map(m => {
      const pct = Math.min(100, (wanted / m.ctx) * 100);
      const fits = wanted <= m.ctx;
      const close = wanted >= m.ctx * 0.8 && fits;
      const status = fits
        ? (close ? `⚠ ${Math.round(pct)}% cheio` : `✓ cabe (${Math.round(pct)}%)`)
        : `✗ ${fmtNum(wanted - m.ctx)} acima`;
      const cls = fits ? (close ? 'warn' : 'ok') : 'over';
      const fillCls = fits ? '' : 'over';
      return `
        <div class="window-model">
          <div class="wm-name">${m.name}<small>${m.note}</small></div>
          <div class="wm-bar"><div class="wm-fill ${fillCls}" style="width:${pct}%"></div></div>
          <div class="wm-status ${cls}">${status}</div>
        </div>
      `;
    }).join('');
  }

  slider.addEventListener('input', render);
  quickBtns.forEach(b => {
    b.addEventListener('click', () => {
      slider.value = b.dataset.tokens;
      render();
    });
  });
  render();
})();


/* ═══════════════════════════════════════
   8. PARAM LAB
   ═══════════════════════════════════════ */
(function paramLab(){
  const els = {
    temp: document.getElementById('pc-temp'),
    tempV: document.getElementById('pc-temp-v'),
    topk: document.getElementById('pc-topk'),
    topkV: document.getElementById('pc-topk-v'),
    max: document.getElementById('pc-max'),
    maxV: document.getElementById('pc-max-v'),
    answer: document.getElementById('pp-answer'),
    personality: document.getElementById('pp-personality')
  };
  if(!els.temp) return;

  // 4 respostas pra "Como você descreveria um gato laranja?"
  const RESPONSES = {
    boring:    'Um gato laranja é um felino doméstico de pelagem laranja.',
    factual:   'Gatos laranjas (também chamados ruivos ou marmalade) têm pelagem em tons de laranja devido ao gene O ligado ao cromossomo X. A maioria é macho. São conhecidos por serem amigáveis e vocalizadores.',
    balanced:  'Um gato laranja, também conhecido como ruivo ou marmalade, é um felino com pelagem em tons que vão do amarelo dourado ao laranja intenso. Devido à genética ligada ao cromossomo X, cerca de 80% dos gatos laranjas são machos. Costumam ter personalidade extrovertida e vocal.',
    creative:  'Imagine um pôr-do-sol que decidiu virar gato. Um gato laranja é exatamente isso: pelagem cor de cobre, olhos âmbar curiosos, ronronar de motor velho de fusca. Geralmente macho (culpa do cromossomo X), de personalidade entre o palhaço e o filósofo. Se você tiver um, prepare-se: ele vai te seguir, miar a tarde inteira sem assunto e dormir no teclado quando você mais precisa.'
  };

  function describePersonality(t, k){
    if(t < 0.2 && k < 30) return '🤖 Determinístico · sempre a mesma resposta · uso: factual, Q&A jurídico/médico';
    if(t < 0.4) return '📋 Conservador · respostas focadas e factuais · uso: documentação, suporte técnico';
    if(t < 0.7) return '⚖️ Equilibrado · resposta padrão pra chatbot e geração geral';
    if(t < 0.9) return '🎨 Criativo · variação alta · uso: copy, brainstorm, narrativa';
    return '🌪️ Caótico · pode alucinar mais · uso: brainstorm bruto, exploração';
  }

  function update(){
    const t = parseFloat(els.temp.value) / 100;
    const k = parseInt(els.topk.value);
    const m = parseInt(els.max.value);

    els.tempV.textContent = t.toFixed(2);
    els.topkV.textContent = k;
    els.maxV.textContent = m;

    // escolhe resposta baseada em temp
    let resp;
    if(t < 0.15) resp = RESPONSES.boring;
    else if(t < 0.4) resp = RESPONSES.factual;
    else if(t < 0.75) resp = RESPONSES.balanced;
    else resp = RESPONSES.creative;

    // top-k baixo (<10) força resposta mais previsível: usa boring/factual
    if(k < 10 && t > 0.4) resp = RESPONSES.factual;

    // respeita max tokens (aproximação: 1 token ≈ 4 chars)
    const maxChars = m * 4;
    if(resp.length > maxChars){
      resp = resp.slice(0, maxChars) + '... <em>[truncado por max_tokens]</em>';
    }

    els.answer.innerHTML = resp;
    els.personality.textContent = describePersonality(t, k);
  }

  ['temp','topk','max'].forEach(key => els[key].addEventListener('input', update));
  update();
})();


/* ═══════════════════════════════════════
   9. ALUCINAÇÃO mitigations
   ═══════════════════════════════════════ */
(function alucinacao(){
  const MITS = {
    rag: {
      title:'📚 RAG grounding',
      desc:'<strong>Recupera trechos reais</strong> de uma base autorizada e injeta no prompt antes do FM responder. O modelo é instruído a usar APENAS esses trechos. Quando não há fonte, o modelo deve dizer "não sei". Reduz alucinação em 70-90% em casos típicos. AWS: <strong>Bedrock Knowledge Bases</strong>.'
    },
    prompt: {
      title:'📝 Prompt restritivo',
      desc:'Instrução explícita no system prompt: <em>"Se você não tem certeza ou não tem informação suficiente, responda \\"não sei\\". Nunca invente dados, fontes, números ou citações."</em> Não elimina alucinação, mas reduz drasticamente. Combine com RAG pro melhor resultado.'
    },
    human: {
      title:'👥 Human-in-the-loop',
      desc:'Decisões sensíveis passam por revisão humana antes de virar resposta final. AWS: <strong>Amazon A2I</strong> orquestra workflows de revisão automática quando o score de confiança está abaixo do threshold ou em amostra aleatória pra audit.'
    },
    validation: {
      title:'✅ Output validation',
      desc:'Checa o output do modelo contra regras ou fontes <strong>antes de devolver</strong> ao usuário. Exemplos: validar URLs (existe?), checar números contra base de dados, conferir formato JSON. Pode ser implementado com Lambda + Bedrock Guardrails (categoria Contextual Grounding).'
    }
  };

  const detail = document.getElementById('hm-detail');
  if(!detail) return;

  document.querySelectorAll('.hm-card').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.hm-card').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const m = MITS[b.dataset.mit];
      if(m) detail.innerHTML = `<strong>${m.title}</strong><br>${m.desc}`;
    });
  });
})();


/* ═══════════════════════════════════════
   10. SHOTS tabs
   ═══════════════════════════════════════ */
(function shots(){
  const SHOTS = {
    zero: {
      title:'Zero-shot',
      desc:'<strong>Nenhum exemplo</strong> no prompt. Você só descreve a tarefa e espera que o modelo entenda.',
      prompt:`<span class="key">Tarefa:</span> Classifique o sentimento da review abaixo como <span class="sample">positivo</span>, <span class="sample">negativo</span> ou <span class="sample">neutro</span>.

<span class="key">Review:</span> "A clínica tem ótimos veterinários, mas o atendimento na recepção é caótico."
<span class="target">Resposta:</span>`,
      pros:'Mais barato (menos tokens). Rápido. Funciona bem em tarefas comuns que o modelo já viu no treino.',
      cons:'Resultado inconsistente em formato. Pra tarefas específicas ou formato peculiar, performa pior que few-shot.'
    },
    one: {
      title:'One-shot (single-shot)',
      desc:'<strong>Exatamente 1 exemplo</strong> input→output antes da pergunta real. Mostra o padrão sem encarecer muito.',
      prompt:`<span class="key">Tarefa:</span> Classifique o sentimento como positivo/negativo/neutro.

<span class="sample">Review:</span> "Excelente atendimento, gato amou."
<span class="sample">Sentimento:</span> positivo

<span class="key">Review:</span> "A clínica tem ótimos veterinários, mas o atendimento na recepção é caótico."
<span class="target">Sentimento:</span>`,
      pros:'Estabelece formato preciso da resposta com 1 exemplo. Pouco overhead em tokens.',
      cons:'Pra tarefas complexas, 1 exemplo pode não ser representativo. Modelo pode fixar em padrões do exemplo único.'
    },
    few: {
      title:'Few-shot',
      desc:'<strong>2 a 5 exemplos</strong> input→output cobrindo a variedade da tarefa. Forma mais robusta de in-context learning.',
      prompt:`<span class="key">Tarefa:</span> Classifique o sentimento como positivo/negativo/neutro.

<span class="sample">Review:</span> "Excelente atendimento, gato amou."
<span class="sample">Sentimento:</span> positivo

<span class="sample">Review:</span> "Caro e demorado. Não recomendo."
<span class="sample">Sentimento:</span> negativo

<span class="sample">Review:</span> "Atendimento ok, preço justo."
<span class="sample">Sentimento:</span> neutro

<span class="key">Review:</span> "A clínica tem ótimos veterinários, mas o atendimento na recepção é caótico."
<span class="target">Sentimento:</span>`,
      pros:'Performance significativamente melhor que zero/one-shot em tarefas específicas. Cobre edge cases via exemplos.',
      cons:'Mais tokens = mais custo. Cada exemplo extra pesa. Acima de 5 exemplos, retorno marginal cai.'
    }
  };

  const tabs = document.getElementById('shots-tabs');
  const viz = document.getElementById('shots-viz');
  if(!tabs || !viz) return;

  function render(key){
    const s = SHOTS[key];
    if(!s) return;
    viz.innerHTML = `
      <h3>${s.title}</h3>
      <div class="desc">${s.desc}</div>
      <div class="shots-prompt">${s.prompt}</div>
      <div class="shots-pros">
        <div class="pros"><strong>✅ Vantagens</strong>${s.pros}</div>
        <div class="cons"><strong>⚠️ Custos/Limites</strong>${s.cons}</div>
      </div>
    `;
  }

  tabs.querySelectorAll('.shot-tab').forEach(b => {
    b.addEventListener('click', () => {
      tabs.querySelectorAll('.shot-tab').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.shot);
    });
  });
  render('zero');
})();


/* ═══════════════════════════════════════
   11. PRACTICES
   ═══════════════════════════════════════ */
(function practices(){
  const PRACS = {
    specific: {
      title:'🎯 Seja específico',
      bad:'Faça um resumo do texto.',
      badNote:'Quão grande? Em que formato? Pra qual público?',
      good:'Faça um resumo executivo de até 5 bullets, em português, focado nas ações que o gestor precisa tomar nesta semana.',
      goodNote:'Tamanho, formato, idioma, público e foco — tudo definido.'
    },
    role: {
      title:'🎭 Defina o papel',
      bad:'Me dê dicas pro meu gato comer melhor.',
      badNote:'Modelo responde genérico, talvez impreciso.',
      good:'Você é um nutrólogo veterinário com 20 anos de experiência. Para um gato persa, 8 anos, com sobrepeso, dê 3 mudanças nutricionais práticas e cite a evidência clínica.',
      goodNote:'Contexto + autoridade + parâmetros do "paciente" + estrutura de resposta.'
    },
    format: {
      title:'📋 Especifique formato',
      bad:'Liste os 5 maiores planos de seguro pet.',
      badNote:'Modelo vai listar em prosa, do jeito dele.',
      good:'Liste os 5 maiores planos de seguro pet em <code>JSON</code> com campos: <code>name</code>, <code>monthly_cost_brl</code>, <code>coverage</code> (lista de strings), <code>pros</code>, <code>cons</code>.',
      goodNote:'JSON estruturado. Fácil de parsear no app, validar e mostrar.'
    },
    examples: {
      title:'🐾 Use few-shot',
      bad:'Classifique se o review é positivo ou negativo.',
      badNote:'Modelo pode dar formato variável.',
      good:'Classifique se o review é positivo ou negativo.<br><br>Exemplo 1: "Atendimento horrível" → <code>negative</code><br>Exemplo 2: "Adorei a clínica" → <code>positive</code><br>Exemplo 3: "Demorado mas resolveu" → <code>negative</code><br><br>Review: "A consulta foi rápida e o vet super atencioso."',
      goodNote:'3 exemplos cobrem positivo, negativo e ambíguo. Formato fica fixo.'
    },
    constraints: {
      title:'🚧 Liste restrições',
      bad:'Sugira tratamento para um gato com tosse.',
      badNote:'Modelo pode inventar diagnóstico, dose, fonte.',
      good:'Sugira possíveis causas para tosse em gato sênior. <strong>NÃO</strong> dê diagnóstico definitivo, dose de medicamento ou nome de remédio. Recomende consulta veterinária. Cite só fontes verificáveis (manuais clínicos conhecidos). Se incerto, diga "não sei".',
      goodNote:'Restrições explícitas reduzem alucinação e responsabilidade legal.'
    },
    break: {
      title:'✂️ Quebre em passos',
      bad:'Analise esse contrato de 30 páginas e me diga o que tenho que assinar.',
      badNote:'Tarefa gigante, modelo perde contexto, alucina cláusulas.',
      good:'Vou usar prompt chaining:<br><strong>Passo 1:</strong> "Liste todas as cláusulas relevantes do contrato e numere."<br><strong>Passo 2:</strong> "Para a cláusula N, identifique riscos para o cliente."<br><strong>Passo 3:</strong> "Resuma os 3 maiores riscos em linguagem simples."',
      goodNote:'Cada passo tem entrada/saída clara. Mais fácil de validar e debugar.'
    },
    iterate: {
      title:'🔁 Itere e versione',
      bad:'Escreve prompt → joga em produção → reza.',
      badNote:'Quando degrada, ninguém sabe o que mudou.',
      good:'Versiona o prompt no Bedrock <strong>Prompt Management</strong>. Roda <strong>Bedrock Model Evaluation</strong> a cada release com 50 casos fixos. Compara métricas. Só promove se passa.',
      goodNote:'Prompt é código. Trate igual: versão, teste, deploy gradual.'
    }
  };

  const detail = document.getElementById('prac-detail');
  if(!detail) return;

  document.querySelectorAll('.prac-card').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.prac-card').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const p = PRACS[b.dataset.prac];
      if(!p) return;
      detail.innerHTML = `
        <h3>${p.title}</h3>
        <div class="prac-compare">
          <div class="bad">
            <strong>❌ Ruim</strong>
            ${p.bad}
            <em style="display:block;margin-top:6px;font-size:12px;color:var(--ink-soft);font-style:italic">${p.badNote}</em>
          </div>
          <div class="good">
            <strong>✅ Bom</strong>
            ${p.good}
            <em style="display:block;margin-top:6px;font-size:12px;color:var(--ink-soft);font-style:italic">${p.goodNote}</em>
          </div>
        </div>
      `;
    });
  });
})();


/* ═══════════════════════════════════════
   12. PIPELINE RAG
   ═══════════════════════════════════════ */
(function pipeline(){
  const STAGES = {
    ingest: {
      title:'1️⃣ Ingestão',
      desc:'Documentos entram no sistema. Coloca PDFs, DOCs, HTML, MD num bucket S3. Pode ser disparado por upload ou em batch agendado (EventBridge).',
      ops:['PDFs e DOCs no S3','Sincronização semanal/diária','Detecção de novos arquivos via S3 events','Deduplicação por hash'],
      services:['S3','EventBridge','Lambda','Glue']
    },
    chunk: {
      title:'2️⃣ Chunking',
      desc:'Divide cada documento em pedaços menores. Tamanho típico: 200-1000 tokens. <strong>Por quê quebrar?</strong> Embeddings funcionam melhor em pedaços focados, e o retrieval não precisa puxar 50 páginas pra responder uma pergunta.',
      ops:['Tamanho de chunk (token count)','Overlap entre chunks','Estratégia: fixa, semântica ou híbrida','Preserva metadata (página, arquivo, autor)'],
      services:['Bedrock Knowledge Bases (gerencia)','Lambda + LangChain (custom)']
    },
    embed: {
      title:'3️⃣ Embedding',
      desc:'Cada chunk vira um <strong>vetor de N dimensões</strong> (ex: 1536) que captura seu significado. Usa um modelo de embeddings: Titan Embeddings, Cohere Embed, Amazon SageMaker JumpStart.',
      ops:['Modelo de embedding fixo (não trocar depois)','Batch processing pra economizar','Cache pra evitar reembedding desnecessário','Custo proporcional aos tokens'],
      services:['Amazon Titan Embeddings','Cohere Embed','Bedrock embedding API']
    },
    store: {
      title:'4️⃣ Storage',
      desc:'Vetores + metadata vão pra um <strong>vector database</strong> que sabe fazer busca por similaridade (cosseno, euclidiana). Não é DB tradicional — é otimizado pra "qual vetor é mais parecido com este?".',
      ops:['Indexação (HNSW, IVF, etc.)','Filtros por metadata (data, autor)','Sharding para volume grande','Latência de busca <100ms típica'],
      services:['Amazon OpenSearch Service','Aurora PostgreSQL (pgvector)','Amazon Neptune Analytics','Bedrock KB (gerenciado)']
    },
    query: {
      title:'5️⃣ Query',
      desc:'Usuário faz uma pergunta. A pergunta também vira um vetor (mesmo modelo de embedding usado nos chunks).',
      ops:['Reformulação da query (opcional)','Embedding em tempo real','Pré-processamento (remoção de stopwords)'],
      services:['App layer','Bedrock embedding API']
    },
    retrieve: {
      title:'6️⃣ Retrieval',
      desc:'Busca os <strong>top-K chunks</strong> mais similares ao vetor da query. Tipicamente K=3 ou 5. Re-ranking opcional pra melhorar relevância. Filtros por metadata.',
      ops:['Top-K (3 a 10 tipicamente)','Threshold de similaridade','Re-ranking com modelo dedicado','Filtros (data, departamento, idioma)'],
      services:['OpenSearch query API','Bedrock Knowledge Bases retrieve','pgvector cosine similarity']
    },
    generate: {
      title:'7️⃣ Generation',
      desc:'Os chunks recuperados + a pergunta + uma instrução vão pro FM. O modelo gera resposta <strong>baseada nos chunks</strong>, não nos pesos. Inclui <strong>source citations</strong> automaticamente.',
      ops:['Prompt template fixo','Instrução: "use APENAS as fontes dadas"','Grounding check (Bedrock Guardrails)','Validação de output'],
      services:['Bedrock InvokeModel','Bedrock Knowledge Bases (retrieveAndGenerate)','Bedrock Guardrails']
    }
  };

  const detail = document.getElementById('pipeline-detail');
  if(!detail) return;

  document.querySelectorAll('.pipe-stage').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.pipe-stage').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const s = STAGES[b.dataset.stage];
      if(!s) return;
      detail.innerHTML = `
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <h4>O que rola dentro</h4>
        <ul>${s.ops.map(o => `<li>${o}</li>`).join('')}</ul>
        <h4>Serviços AWS</h4>
        <div class="pd-services">${s.services.map(sv => `<span>${sv}</span>`).join('')}</div>
      `;
    });
  });
})();


/* ═══════════════════════════════════════
   13. CHUNKING LAB
   ═══════════════════════════════════════ */
(function chunkingLab(){
  // Texto de exemplo (~ 1500 tokens / 6000 chars)
  const TEXT = `A política de reembolso da Clínica Felina XPTO foi atualizada em janeiro de 2025 para refletir as novas exigências da legislação consumerista brasileira e as melhores práticas do setor veterinário. A partir desta data, todos os clientes ativos com pelo menos uma consulta nos últimos 12 meses têm direito a reembolso integral em até 30 dias corridos contados da emissão da nota fiscal, mediante apresentação dos seguintes documentos: comprovante de pagamento original, nota fiscal eletrônica, e laudo veterinário detalhado.

O processo de reembolso é iniciado pela abertura de um chamado no portal do cliente ou pelo contato direto com a central de atendimento. O atendente registrará a solicitação e encaminhará para análise da equipe de auditoria clínica, que avaliará a procedência do pedido em até 5 dias úteis. Caso aprovado, o reembolso é creditado na mesma forma de pagamento original (cartão de crédito, débito ou Pix) em até 7 dias úteis após a aprovação.

Existem situações específicas em que o reembolso pode ser parcial ou negado. São elas: serviços já consumidos integralmente (ex.: vacinação aplicada), procedimentos eletivos cosméticos sem indicação clínica, ausência de documentação completa, e casos em que o cliente descumpriu orientações pré-procedimento documentadas. Em qualquer caso de negativa, o cliente recebe parecer escrito explicando os motivos e o direito de recorrer em segunda instância.

Para procedimentos cirúrgicos de alto custo, há um período de carência de 60 dias contados da contratação do plano, durante o qual reembolsos não se aplicam. Após esse período, todas as cirurgias eletivas e emergenciais são cobertas conforme a tabela de procedimentos do plano contratado, com franquia de R$ 200 por cirurgia.

A vacinação anual completa está inclusa em todos os planos a partir do plano Bronze. Inclui as vacinas múltipla felina (V4 ou V5), antirrábica, e leucemia felina (FeLV) quando recomendada por avaliação prévia. Vacinas adicionais podem ser cobradas separadamente conforme a tabela em vigor.`;

  const sizeS = document.getElementById('chunk-size');
  const sizeV = document.getElementById('chunk-size-v');
  const overS = document.getElementById('chunk-overlap');
  const overV = document.getElementById('chunk-overlap-v');
  const viz = document.getElementById('chunk-viz');
  const cntEl = document.getElementById('cc-count');
  const dupEl = document.getElementById('cc-dup');
  const costEl = document.getElementById('cc-cost');
  if(!sizeS || !viz) return;

  function tokenizeApprox(s){
    // ~4 chars/token
    return Math.ceil(s.length / 4);
  }

  function update(){
    const size = parseInt(sizeS.value);
    const overlap = parseInt(overS.value);
    sizeV.textContent = size;
    overV.textContent = overlap;

    if(overlap >= size){
      viz.innerHTML = '<em style="color:var(--coral)">Overlap não pode ser maior ou igual ao tamanho do chunk.</em>';
      cntEl.textContent = 0;
      dupEl.textContent = 0;
      costEl.textContent = '$0.00';
      return;
    }

    // tamanho em chars (4 chars / token)
    const sizeChars = size * 4;
    const overlapChars = overlap * 4;
    const stride = sizeChars - overlapChars;

    const chunks = [];
    let pos = 0;
    while(pos < TEXT.length){
      const end = Math.min(TEXT.length, pos + sizeChars);
      chunks.push({ start: pos, end, text: TEXT.slice(pos, end) });
      if(end === TEXT.length) break;
      pos += stride;
    }

    // viz: pinta cada chunk com cor diferente; sobreposições recebem outline
    let html = '';
    // Cria array de char→[chunkIndices]
    const charChunks = new Array(TEXT.length).fill(null).map(() => []);
    chunks.forEach((c, ci) => {
      for(let i = c.start; i < c.end; i++) charChunks[i].push(ci);
    });

    // Renderiza char a char agrupando por mesma combinação de chunks
    let lastKey = null;
    let buffer = '';
    function flush(){
      if(!buffer) return;
      const indices = lastKey ? lastKey.split(',').map(Number) : [];
      if(indices.length === 0){
        html += buffer.replace(/\n/g, '<br>');
      } else {
        const cls = indices.length > 1
          ? `chunk c${indices[0] % 6} overlap`
          : `chunk c${indices[0] % 6}`;
        html += `<span class="${cls}">${buffer.replace(/\n/g, '<br>')}</span>`;
      }
      buffer = '';
    }
    for(let i = 0; i < TEXT.length; i++){
      const key = charChunks[i].join(',');
      if(key !== lastKey){
        flush();
        lastKey = key;
      }
      buffer += TEXT[i] === '<' ? '&lt;' : TEXT[i] === '>' ? '&gt;' : TEXT[i] === '&' ? '&amp;' : TEXT[i];
    }
    flush();
    viz.innerHTML = html;

    // stats
    cntEl.textContent = chunks.length;
    const totalTokens = chunks.reduce((s, c) => s + tokenizeApprox(c.text), 0);
    const baseTokens = tokenizeApprox(TEXT);
    dupEl.textContent = (totalTokens - baseTokens).toLocaleString('pt-BR');
    // Pricing Titan Embeddings: ~$0.0001/1k tokens
    const cost = (totalTokens / 1000) * 0.0001;
    costEl.textContent = '$' + cost.toFixed(5);
  }

  sizeS.addEventListener('input', update);
  overS.addEventListener('input', update);
  update();
})();
