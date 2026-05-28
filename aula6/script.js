/* ===== bloco 1 ===== */

/* ====== ROI CALCULATOR ====== */
(function(){
  const vol = document.getElementById('roi-vol');
  const gain = document.getElementById('roi-gain');
  const impl = document.getElementById('roi-impl');
  const op = document.getElementById('roi-op');
  const mo = document.getElementById('roi-mo');
  const fmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  const fmtBRL = v => 'R$ ' + fmt.format(Math.round(v));

  function update(){
    const volV = +vol.value, gainV = +gain.value, implV = +impl.value, opV = +op.value, moV = +mo.value;
    document.getElementById('roi-vol-v').textContent = fmt.format(volV);
    document.getElementById('roi-gain-v').textContent = fmtBRL(gainV);
    document.getElementById('roi-impl-v').textContent = fmtBRL(implV);
    document.getElementById('roi-op-v').textContent = fmtBRL(opV);
    document.getElementById('roi-mo-v').textContent = moV;

    const ganho = volV * gainV * moV;
    const custo = implV + opV * moV;
    const lucro = ganho - custo;
    const roi = custo > 0 ? (lucro / custo) * 100 : 0;

    document.getElementById('roi-result').textContent = (roi >= 0 ? '+' : '') + Math.round(roi) + '%';
    document.getElementById('roi-profit').textContent = (lucro >= 0 ? '' : '-') + fmtBRL(Math.abs(lucro));

    const card = document.getElementById('roi-verdict-card');
    const rec = document.getElementById('roi-rec-text');
    if (roi > 100){
      card.className = 'roi-verdict green';
      rec.innerHTML = '<strong>🚀 Vai de IA!</strong> O retorno cobre o investimento com folga. Esse é o tipo de problema que a IA foi feita pra resolver.';
    } else if (roi > 0){
      card.className = 'roi-verdict';
      rec.innerHTML = '<strong>🤔 Tá no limite.</strong> Compensa, mas com pouca margem. Vale negociar o custo ou aumentar o volume antes de investir.';
    } else {
      card.className = 'roi-verdict red';
      rec.innerHTML = '<strong>🚫 Não vale.</strong> O retorno não cobre o investimento. Ou o problema não é grande o suficiente, ou o custo precisa baixar muito.';
    }
  }
  [vol, gain, impl, op, mo].forEach(e => e.addEventListener('input', update));
  update();
})();

/* ====== PROBLEM TYPES INTERACTIVE ====== */
(function(){
  const svg = document.getElementById('problem-svg');
  let currentTab = 'classification';
  let points = [];
  let modelDrawn = false;

  const explanations = {
    classification: {
      tag: 'CLASSIFICAÇÃO',
      title: 'Escolher uma categoria',
      text: 'O modelo recebe uma entrada e atribui uma classe entre opções pré-definidas. A saída é discreta: ou é gato laranja, ou não é.',
      use: '<strong style="color: var(--yellow);">Usos típicos:</strong> detecção de fraude, identificação de spam, diagnóstico de imagens, é/não é gato.',
      analogy: '<strong>Analogia do gato:</strong> Cada foto cai numa caixinha. Gato laranja ➜ caixa laranja. Gato preto ➜ caixa preta. <strong>Saída discreta</strong>: pertence ou não pertence à classe.'
    },
    regression: {
      tag: 'REGRESSÃO',
      title: 'Prever um número',
      text: 'O modelo prevê um valor contínuo a partir das variáveis de entrada. A saída é um número, não uma categoria.',
      use: '<strong style="color: var(--yellow);">Usos típicos:</strong> preço de imóvel, demanda de produtos, peso do gato, tempo estimado de entrega.',
      analogy: '<strong>Analogia do gato:</strong> Quanto pesa esse gato em função da idade? A resposta é um número (kg), que pode variar livremente. <strong>Saída contínua</strong>.'
    },
    clustering: {
      tag: 'CLUSTERIZAÇÃO',
      title: 'Agrupar elementos semelhantes',
      text: 'O modelo agrupa elementos parecidos SEM rótulos pré-definidos. Você não diz quais grupos existem; o modelo descobre.',
      use: '<strong style="color: var(--yellow);">Usos típicos:</strong> segmentação de clientes, análise de comportamento, detecção de anomalias, organização de catálogos.',
      analogy: '<strong>Analogia do gato:</strong> Tinha um monte de gatos misturados. O modelo, sozinho, separou em 3 grupos por pelagem parecida. <strong>Você não disse</strong> que existiam 3 grupos. Ele descobriu.'
    }
  };

  function genPoints(){
    points = [];
    if (currentTab === 'classification'){
      // 2 clusters (cats orange vs cats black)
      for (let i = 0; i < 18; i++){
        points.push({ x: 90 + Math.random()*150, y: 80 + Math.random()*100, cat: 'orange' });
      }
      for (let i = 0; i < 18; i++){
        points.push({ x: 260 + Math.random()*150, y: 200 + Math.random()*120, cat: 'black' });
      }
    } else if (currentTab === 'regression'){
      // points along a line with some noise
      for (let i = 0; i < 32; i++){
        const x = 60 + (i * 13);
        const y = 320 - (x - 60) * 0.7 + (Math.random() - 0.5) * 50;
        points.push({ x, y });
      }
    } else {
      // clustering: 3 random clusters
      const centers = [{x: 130, y: 110}, {x: 350, y: 150}, {x: 220, y: 280}];
      centers.forEach((c, ci) => {
        for (let i = 0; i < 14; i++){
          points.push({
            x: c.x + (Math.random()-0.5)*80,
            y: c.y + (Math.random()-0.5)*80,
            cluster: ci
          });
        }
      });
    }
    modelDrawn = false;
    render();
  }

  function render(){
    svg.innerHTML = '';

    // axes
    const axes = `
      <line x1="40" y1="350" x2="470" y2="350" stroke="#2B1810" stroke-width="1.5"/>
      <line x1="40" y1="30" x2="40" y2="350" stroke="#2B1810" stroke-width="1.5"/>
      <text x="455" y="368" font-family="JetBrains Mono" font-size="10" fill="#4A3528">x</text>
      <text x="26" y="38" font-family="JetBrains Mono" font-size="10" fill="#4A3528">y</text>
    `;
    svg.insertAdjacentHTML('beforeend', axes);

    if (currentTab === 'classification'){
      if (modelDrawn){
        // draw decision boundary
        svg.insertAdjacentHTML('beforeend',
          `<line x1="100" y1="60" x2="430" y2="340" stroke="#FF6B35" stroke-width="3" stroke-dasharray="6 4"/>
           <text x="380" y="55" font-family="JetBrains Mono" font-size="11" fill="#E54E1B" font-weight="600">fronteira</text>`);
      }
      points.forEach(p => {
        const color = p.cat === 'orange' ? '#FF6B35' : '#2B1810';
        const emoji = p.cat === 'orange' ? '🟧' : '⬛';
        svg.insertAdjacentHTML('beforeend',
          `<circle cx="${p.x}" cy="${p.y}" r="9" fill="${color}" stroke="#2B1810" stroke-width="1.5"/>`);
      });
      document.getElementById('prob-stats').textContent = `${points.length} pontos · 2 classes`;
    } else if (currentTab === 'regression'){
      if (modelDrawn){
        // best fit line approx
        svg.insertAdjacentHTML('beforeend',
          `<line x1="50" y1="307" x2="470" y2="13" stroke="#FF6B35" stroke-width="3" stroke-dasharray="6 4"/>
           <text x="380" y="55" font-family="JetBrains Mono" font-size="11" fill="#E54E1B" font-weight="600">y = f(x)</text>`);
      }
      points.forEach(p => {
        svg.insertAdjacentHTML('beforeend',
          `<circle cx="${p.x}" cy="${p.y}" r="6" fill="#5C8D89" stroke="#2B1810" stroke-width="1.5"/>`);
      });
      document.getElementById('prob-stats').textContent = `${points.length} pontos · 1 saída contínua`;
    } else {
      const colors = ['#FF6B35', '#5C8D89', '#B19CD9'];
      const centers = [{x: 130, y: 110}, {x: 350, y: 150}, {x: 220, y: 280}];
      if (modelDrawn){
        centers.forEach((c, i) => {
          svg.insertAdjacentHTML('beforeend',
            `<circle cx="${c.x}" cy="${c.y}" r="55" fill="${colors[i]}" fill-opacity="0.13" stroke="${colors[i]}" stroke-width="2" stroke-dasharray="5 4"/>
             <text x="${c.x}" y="${c.y - 60}" font-family="JetBrains Mono" font-size="11" fill="${colors[i]}" font-weight="700" text-anchor="middle">Grupo ${i+1}</text>`);
        });
      }
      points.forEach(p => {
        const color = modelDrawn ? colors[p.cluster] : '#888';
        svg.insertAdjacentHTML('beforeend',
          `<circle cx="${p.x}" cy="${p.y}" r="7" fill="${color}" stroke="#2B1810" stroke-width="1.5"/>`);
      });
      document.getElementById('prob-stats').textContent = `${points.length} pontos · ${modelDrawn ? '3 grupos descobertos' : 'sem rótulo ainda'}`;
    }
  }

  function updateExplain(){
    const e = explanations[currentTab];
    document.getElementById('pe-tag').textContent = e.tag;
    document.getElementById('pe-title').textContent = e.title;
    document.getElementById('pe-text').textContent = e.text;
    document.getElementById('pe-use').innerHTML = e.use;
    document.getElementById('pe-analogy').innerHTML = e.analogy;
  }

  document.querySelectorAll('#prob-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#prob-tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      updateExplain();
      genPoints();
    });
  });

  document.getElementById('prob-reshuffle').addEventListener('click', genPoints);
  document.getElementById('prob-run').addEventListener('click', () => {
    modelDrawn = true;
    render();
  });

  updateExplain();
  genPoints();
})();

/* ====== PROMPT LAB ====== */
(function(){
  const data = {
  zero: {
    prompt: `Classifique o comportamento deste gato como FELIZ, ESTRESSADO ou NEUTRO:

"A gata Mel aproximou-se ronronando, esfregou a cabeça na minha mão, mas quando tentei pegar no colo, fugiu correndo pra debaixo do sofá."`,
    response: `Neutro.`,
    precision: 60,
    cost: 15,
    risk: 55,
    explain: '<strong>Zero-shot:</strong> envia a instrução sem nenhum exemplo. É a forma mais simples e barata. Funciona bem em tarefas que o modelo já viu muito no treinamento (sentimento de texto, tradução). Pode falhar em tarefas específicas ou nicho.'
  },
  one: {
    prompt: `Veja o exemplo abaixo e classifique o comportamento seguinte:

Comportamento: "O gato veio correndo, ronronou alto e deitou de barriga pra cima."
Classe: Feliz

Comportamento: "A gata Mel aproximou-se ronronando, esfregou a cabeça na minha mão, mas quando tentei pegar no colo, fugiu correndo pra debaixo do sofá."
Classe:`,
    response: `Misto / Neutro (começou positivo - ronronar e esfregar a cabeça - mas terminou em fuga, indicando desconforto com contato físico forçado).`,
    precision: 75,
    cost: 30,
    risk: 35,
    explain: '<strong>One-shot:</strong> apresenta UM exemplo antes da pergunta. Ajuda o modelo a entender o <strong>formato esperado</strong> da resposta. Mais preciso que zero-shot em cenários menos comuns.'
  },
  few: {
    prompt: `Classifique cada comportamento como F, E ou N (Feliz, Estressado, Neutro):

"Ronronou alto e deitou de barriga pra cima." → F
"Orelhas pra trás, pelo arrepiado, rosnando baixinho." → E
"Sentado na janela observando os pássaros, tranquilo." → N
"A Mel veio ronronando, esfregou a cabeça na mão, mas fugiu quando tentei pegar no colo." →`,
    response: `N`,
    precision: 88,
    cost: 50,
    risk: 18,
    explain: '<strong>Few-shot:</strong> apresenta VÁRIOS exemplos. O modelo aprende o padrão a partir deles. Melhora muito em tarefas de nicho. Custo do prompt aumenta (mais tokens), mas a precisão sobe forte.'
  },
  cot: {
    prompt: `Classifique o comportamento abaixo como FELIZ, ESTRESSADO ou NEUTRO.
Antes de dar a resposta, explique seu raciocínio passo a passo.

Comportamento: "A gata Mel aproximou-se ronronando, esfregou a cabeça na minha mão, mas quando tentei pegar no colo, fugiu correndo pra debaixo do sofá."`,
    response: `Passo 1: Identifico os sinais de linguagem corporal felina.
 - "ronronando" → sinal POSITIVO de conforto
 - "esfregou a cabeça" (bunting) → sinal POSITIVO de afeto e marcação amigável
 - "fugiu pra debaixo do sofá" → sinal NEGATIVO de medo/estresse

Passo 2: A SEQUÊNCIA importa. A Mel estava confortável socializando, mas o gatilho foi o contato físico forçado (pegar no colo).

Passo 3: Não é estresse generalizado (ela veio voluntariamente), nem felicidade plena (fugiu ao primeiro toque invasivo).

✅ Classificação final: NEUTRO - gata sociável, mas com limites claros de contato. Recomenda-se respeitar o tempo dela. 🐾`,
    precision: 92,
    cost: 65,
    risk: 10,
    explain: '<strong>Chain-of-Thought (CoT):</strong> pede pro modelo "pensar passo a passo" antes de responder. Reduz erros em tarefas que exigem lógica ou raciocínio. Output mais longo (custo maior) mas muito mais auditável.'
  }
};

  function updateLab(tech){
    const d = data[tech];
    document.getElementById('prompt-text').textContent = d.prompt;
    document.getElementById('response-text').textContent = d.response;
    document.getElementById('q-precision').style.width = d.precision + '%';
    document.getElementById('q-precision-v').textContent = d.precision + '%';
    document.getElementById('q-cost').style.width = d.cost + '%';
    document.getElementById('q-cost-v').textContent = d.cost + '%';
    document.getElementById('q-risk').style.width = d.risk + '%';
    document.getElementById('q-risk-v').textContent = d.risk + '%';
    document.getElementById('prompt-explainer').innerHTML = d.explain;
  }

  document.querySelectorAll('#prompt-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#prompt-tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateLab(btn.dataset.technique);
    });
  });

  updateLab('zero');
})();

/* ====== CHAIN PROMPTING ====== */
/* ====== CHAIN PROMPTING ====== */
(function(){
  const stepData = [
    {
      input: '📊 Linha da planilha de avaliações:\n\ncustomer_id: 4287\nrating: 5\nfeedback_raw: "Adotei a Mel há 3 meses\nna ONG, foi tudo super tranquilo. O\natendimento da equipe foi maravilhoso,\nme explicaram tudo sobre cuidados,\nvacinas, alimentação. A Mel chegou\nem casa muito feliz e saudável!\nRecomendo demais pra quem tá\npensando em adotar. ❤️"',
      prompt: 'Extraia o campo "feedback_raw" da linha da planilha abaixo e retorne APENAS o texto puro do feedback, sem aspas, sem outros campos.',
      output: 'Adotei a Mel há 3 meses na ONG, foi tudo super tranquilo. O atendimento da equipe foi maravilhoso, me explicaram tudo sobre cuidados, vacinas, alimentação. A Mel chegou em casa muito feliz e saudável! Recomendo demais pra quem tá pensando em adotar. ❤️'
    },
    {
      input: 'Adotei a Mel há 3 meses na ONG, foi tudo super tranquilo. O atendimento da equipe foi maravilhoso, me explicaram tudo sobre cuidados, vacinas, alimentação. A Mel chegou em casa muito feliz e saudável! Recomendo demais pra quem tá pensando em adotar. ❤️',
      prompt: 'Resuma o feedback abaixo em UMA frase curta (até 20 palavras), mantendo o tom e os pontos principais.',
      output: 'Adoção da Mel foi excelente. Equipe atenciosa, processo claro, gata saudável e bem adaptada. Cliente recomenda.'
    },
    {
      input: 'Adoção da Mel foi excelente. Equipe atenciosa, processo claro, gata saudável e bem adaptada. Cliente recomenda.',
      prompt: 'Traduza o texto abaixo do português para o inglês, mantendo o tom natural e a concisão.',
      output: 'Adoption of Mel was excellent. Caring team, clear process, healthy and well-adjusted cat. Customer recommends.'
    },
    {
      input: 'Adoption of Mel was excellent. Caring team, clear process, healthy and well-adjusted cat. Customer recommends.',
      prompt: 'Estruture o resumo abaixo em JSON válido com os campos:\n- customer_id (4287)\n- sentiment ("positive" / "neutral" / "negative")\n- rating (5)\n- summary (o texto)\n- topics (lista de tags)\n- lang ("en")',
      output: '{\n  "customer_id": 4287,\n  "sentiment": "positive",\n  "rating": 5,\n  "summary": "Adoption of Mel was excellent. Caring team, clear process, healthy and well-adjusted cat. Customer recommends.",\n  "topics": ["adoption", "team", "cat_health"],\n  "lang": "en"\n}'
    }
  ];

  let current = 0;
  let isPlaying = false;

  const steps = document.querySelectorAll('.chain-step');
  const inputEl = document.getElementById('chain-input');
  const promptEl = document.getElementById('chain-prompt');
  const outputEl = document.getElementById('chain-output');
  const prevBtn = document.getElementById('chain-prev');
  const nextBtn = document.getElementById('chain-next');
  const playBtn = document.getElementById('chain-play');
  const resetBtn = document.getElementById('chain-reset');

  function render(){
    steps.forEach((s, i) => s.classList.toggle('active', i === current));
    const d = stepData[current];
    inputEl.textContent = d.input;
    promptEl.textContent = d.prompt;
    outputEl.textContent = d.output;
    prevBtn.disabled = current === 0 || isPlaying;
    nextBtn.disabled = current === stepData.length - 1 || isPlaying;

    // centraliza passo ativo no scroll horizontal (desktop)
    const flow = document.getElementById('chain-flow');
    const activeStep = steps[current];
    if (flow && activeStep && flow.scrollWidth > flow.clientWidth){
      const target = activeStep.offsetLeft - (flow.clientWidth - activeStep.offsetWidth) / 2;
      flow.scrollTo({ left: target, behavior: 'smooth' });
    }
  }

  steps.forEach((s, i) => {
    s.addEventListener('click', () => {
      if (isPlaying) return;
      current = i;
      render();
    });
  });

  prevBtn.addEventListener('click', () => {
    if (current > 0 && !isPlaying){ current--; render(); }
  });
  nextBtn.addEventListener('click', () => {
    if (current < stepData.length - 1 && !isPlaying){ current++; render(); }
  });
  resetBtn.addEventListener('click', () => {
    if (isPlaying) return;
    current = 0; render();
  });

  playBtn.addEventListener('click', async () => {
    if (isPlaying) return;
    isPlaying = true;
    playBtn.disabled = true;
    resetBtn.disabled = true;

    for (let i = 0; i < stepData.length; i++){
      current = i;
      render();
      await new Promise(r => setTimeout(r, 2800));
    }

    isPlaying = false;
    playBtn.disabled = false;
    resetBtn.disabled = false;
    render();
  });

  render();
})();

/* ====== REACT ====== */
(function(){
  document.getElementById('react-play').addEventListener('click', async () => {
    const steps = document.querySelectorAll('.react-step');
    steps.forEach(s => s.classList.remove('shown'));
    for (let i = 0; i < steps.length; i++){
      await new Promise(r => setTimeout(r, 900));
      steps[i].classList.add('shown');
    }
  });
  document.getElementById('react-reset').addEventListener('click', () => {
    document.querySelectorAll('.react-step').forEach(s => s.classList.remove('shown'));
  });
})();

/* ====== HALLUCINATION DETECTOR ====== */
/* ====== HALLUCINATION SIMULATION ====== */
(function(){
  const cases = [
    {
      question: 'Qual a idade do gato mais velho já registrado oficialmente?',
      response: 'O gato mais velho registrado oficialmente foi <strong>Whiskers III</strong>, do Egito, que viveu <strong>47 anos e 3 meses</strong>, certificado pelo Guinness World Records em 1998. Era um Maine Coon adotado por uma família de Cairo e ganhou fama por sua dieta exclusiva à base de peixe do Nilo.',
      truth: 'TUDO inventado. O recordista REAL é a <strong>Creme Puff</strong>, do Texas, que viveu 38 anos. O LLM fabricou nome ("Whiskers III"), local, idade absurda (47 anos é fisiologicamente impossível pra gato), certificação e até a história da dieta. Quando o modelo não sabe, ele cria <strong>detalhes específicos</strong> pra parecer convincente.'
    },
    {
      question: 'Me conta sobre a raça Persa-Siberiano-Imperial. Vale a pena adotar?',
      response: 'A <strong>Persa-Siberiano-Imperial</strong> é um cruzamento desenvolvido nos anos 1970 na Rússia, reconhecido pela TICA em 1985. Tem pelagem tripla, olhos heterocromáticos, pesa entre 8-12kg e vive de 18 a 22 anos. É hipoalergênico e excelente com crianças.',
      truth: 'Essa raça <strong>NÃO EXISTE</strong>. Eu inventei o nome juntando palavras plausíveis. Mas o LLM mordeu a isca e construiu data, país, peso, expectativa de vida - tudo do zero. Esse é o "teste do nome falso": se você nunca ouviu mas o modelo responde detalhado, <strong>desconfie sempre</strong>.'
    },
    {
      question: 'Em que frequência exata os gatos ronronam?',
      response: 'Os gatos ronronam em uma frequência de exatos <strong>27,3 Hz</strong>, que ativa o nervo vago e libera dopamina no cérebro humano. Foi descoberto pela <strong>Universidade de Stanford em 2003</strong> e publicado no Journal of Feline Acoustics.',
      truth: 'A frequência real é uma <strong>faixa</strong> de 25-150 Hz (varia por gato), não um valor preciso. A "descoberta de Stanford 2003" e o "Journal of Feline Acoustics" foram <strong>inventados</strong>. O LLM partiu de um fato real (ronronar tem efeito terapêutico) e enfeitou com número preciso + universidade famosa + nome de journal. Receita clássica de alucinação credível.'
    },
    {
      question: 'Quantos gatos domésticos existem no mundo hoje?',
      response: 'Segundo o último levantamento da <strong>OMS em 2024</strong>, existem exatamente <strong>643.829.117 gatos domésticos</strong> no mundo, distribuídos em 197 países. O Brasil ocupa a 4ª posição com cerca de 27 milhões de exemplares.',
      truth: 'A <strong>OMS NÃO faz esse levantamento</strong> - ela cuida de saúde HUMANA. Estimativas reais ficam em torno de 600-700 milhões, <strong>sem precisão de dígito</strong>. O LLM combinou autoridade falsa + número absurdamente exato = parece científico, é fake. Regra de ouro: número com 9 dígitos sobre população animal é quase sempre invenção.'
    },
    {
      question: 'O que é a Síndrome de Felinopatia Cortical Felídea?',
      response: 'É uma condição neurológica rara em gatos da família Felidae, caracterizada por episódios de <strong>catalepsia diurna</strong> e hipersensibilidade auditiva. Afeta cerca de <strong>0,003% dos felinos</strong> e foi descrita pela primeira vez em 1987 pela veterinária <strong>Dra. Helena Vasconcelos</strong>, no Instituto Pasteur.',
      truth: 'Essa síndrome <strong>NÃO EXISTE</strong>. O nome foi inventado juntando palavras médicas em português. O LLM construiu uma resposta inteira em cima do vazio - sintomas, prevalência, ano, pesquisadora, instituição. Sempre que o termo técnico soar suspeito demais e você nunca ouviu, <strong>peça a fonte primária</strong>. Sem fonte = invenção.'
    }
  ];

  let idx = 0;
  let timers = [];
  let countdownTimer = null;

  const userEl = document.getElementById('hall-user');
  const typingEl = document.getElementById('hall-typing');
  const aiEl = document.getElementById('hall-ai');
  const revealEl = document.getElementById('hall-reveal');
  const questionEl = document.getElementById('hall-question');
  const responseEl = document.getElementById('hall-response');
  const truthEl = document.getElementById('hall-truth');
  const currentEl = document.getElementById('hall-current');
  const dotsEl = document.getElementById('hall-dots');
  const countdownEl = document.getElementById('hall-countdown');

  document.getElementById('hall-total').textContent = cases.length;

  cases.forEach(() => {
    const d = document.createElement('span');
    d.className = 'pdot';
    dotsEl.appendChild(d);
  });

  function updateDots(){
    const dots = dotsEl.querySelectorAll('.pdot');
    dots.forEach((d, i) => {
      d.classList.remove('active', 'done');
      if (i < idx) d.classList.add('done');
      if (i === idx) d.classList.add('active');
    });
  }

  function clearAllTimers(){
    timers.forEach(t => clearTimeout(t));
    timers = [];
    if (countdownTimer){ clearInterval(countdownTimer); countdownTimer = null; }
  }

  function schedule(fn, ms){
    const t = setTimeout(fn, ms);
    timers.push(t);
  }

  function reset(){
    userEl.classList.remove('shown');
    typingEl.classList.remove('shown');
    aiEl.classList.remove('shown');
    revealEl.classList.remove('shown');
  }

  function playCase(){
    clearAllTimers();
    reset();
    const c = cases[idx];
    currentEl.textContent = idx + 1;
    updateDots();

    questionEl.textContent = c.question;
    responseEl.innerHTML = c.response +
      '<div class="hall-confidence"><span>✓</span><span>Resposta gerada com confiança alta</span></div>';
    truthEl.innerHTML = c.truth;

    schedule(() => userEl.classList.add('shown'), 400);
    schedule(() => typingEl.classList.add('shown'), 1400);
    schedule(() => typingEl.classList.remove('shown'), 3200);
    schedule(() => aiEl.classList.add('shown'), 3400);
    schedule(() => revealEl.classList.add('shown'), 6000);

    schedule(() => {
      let cd = 30;
      countdownEl.textContent = cd;
      countdownTimer = setInterval(() => {
        cd--;
        countdownEl.textContent = cd;
        if (cd <= 0){
          clearInterval(countdownTimer);
          countdownTimer = null;
          idx = (idx + 1) % cases.length;
          playCase();
        }
      }, 1000);
    }, 6500);
  }

  // Só começa quando o usuário rolar até a seção
  let started = false;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started){
        started = true;
        playCase();
      }
    });
  }, { threshold: 0.25 });
  observer.observe(document.getElementById('hall-sim'));
})();

/* ====== GAN ARENA ====== */
(function(){
  const cats = ['😼', '🐱', '🐈', '🐈‍⬛', '😸', '😺', '😻', '🙀'];
  const fakeArtsBad = ['🐈🌀', '?🐱?', '🐉?🐈', '◔̯◔', '⚆_⚆', 'ʕ•ᴥ•ʔ', '(=ↀᆽↀ=)'];
  let round = 0;
  let history = [];

  const realismCurve = (r) => Math.min(100, Math.round(15 + r * 12 + (Math.random() - 0.5) * 4));

  const genStatuses = [
    'Tentando gerar primeiro gato a partir de ruído puro...',
    'Aprendendo o que é uma orelha pontuda...',
    'Olha, agora tem bigode! Mas o olho ainda tá torto...',
    'Bigode + olhos no lugar certo. Ficando convincente!',
    'Quase indistinguível. Discriminador suando...',
    'Discriminador caiu! Foi taxado como real!',
    'Treino convergiu. Gerador produz fake quase perfeito.',
    'Gerador domina. Pode parar.'
  ];
  const discStatuses = [
    'Isso é gato? Tá mais pra Picasso bêbado. FAKE óbvio.',
    'Estranho. Algo não bate. FAKE.',
    'Hmm, parece gato mas tem algo errado... FAKE.',
    'Bigode bom, mas pelo ainda inconsistente. FAKE.',
    'Difícil... 51% fake, 49% real. FAKE no chute.',
    'Confundi! Achei que era real. CAÍ.',
    'Não consigo mais distinguir. Eu mereço aposentadoria.',
    'Aceito derrota. Equilíbrio adversarial atingido.'
  ];

  function next(){
    if (round >= 8) return;
    round++;
    const genCanvas = document.getElementById('gan-gen-canvas');
    const discCanvas = document.getElementById('gan-disc-canvas');
    const genArt = document.getElementById('gan-gen-art');
    const discArt = document.getElementById('gan-disc-art');

    genCanvas.classList.add('generating');
    setTimeout(() => genCanvas.classList.remove('generating'), 500);

    // pick generator art
    let art;
    if (round <= 2) art = fakeArtsBad[Math.floor(Math.random() * fakeArtsBad.length)];
    else if (round <= 4) art = '🐱?';
    else if (round <= 6) art = cats[Math.floor(Math.random() * cats.length)];
    else art = cats[Math.floor(Math.random() * cats.length)];

    genArt.textContent = art;

    // discriminator verdict
    const fooled = round >= 5 && Math.random() < (round - 4) * 0.3;
    discArt.textContent = fooled ? '✅' : '❌';

    document.getElementById('gan-gen-status').textContent = genStatuses[round - 1] || '';
    document.getElementById('gan-disc-status').textContent = discStatuses[round - 1] || '';

    const realism = realismCurve(round);
    document.getElementById('gan-round').textContent = round;
    document.getElementById('gan-realism').textContent = realism + '%';

    history.push({ round, fooled });
    const histDom = document.getElementById('gan-history');
    histDom.innerHTML = history.map(h => `<span class="h-item ${h.fooled ? 'real' : 'fake'}">R${h.round}: ${h.fooled ? 'FOOLED (real)' : 'caught (fake)'}</span>`).join('');

    if (round >= 8){
      document.getElementById('gan-next').disabled = true;
    }
  }

  function reset(){
    round = 0;
    history = [];
    document.getElementById('gan-gen-art').textContent = '🎨';
    document.getElementById('gan-disc-art').textContent = '🔍';
    document.getElementById('gan-gen-status').textContent = 'Esperando primeiro round...';
    document.getElementById('gan-disc-status').textContent = 'Pronto pra inspecionar...';
    document.getElementById('gan-round').textContent = 0;
    document.getElementById('gan-realism').textContent = '0%';
    document.getElementById('gan-history').innerHTML = '';
    document.getElementById('gan-next').disabled = false;
  }

  document.getElementById('gan-next').addEventListener('click', next);
  document.getElementById('gan-reset').addEventListener('click', reset);
})();