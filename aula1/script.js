/* ===== bloco 1 ===== */

// ============================================================
// MÓDULO 1: BONECAS RUSSAS (IA / ML / DL / IA GEN)
// ============================================================
const ringData = {
  ia: {
    tag: "Conceito mais amplo",
    title: "🧠 Inteligência Artificial (IA)",
    desc: "Campo da computação que busca criar sistemas capazes de realizar tarefas que exigiriam inteligência humana: percepção, raciocínio, aprendizado, decisão, linguagem.",
    desc2: "É o guarda-chuva. Inclui ML, mas também sistemas baseados em regras programadas à mão, sistemas especialistas, lógica simbólica, etc.",
    examples: [
      "🤖 Robôs industriais com regras programadas",
      "♟️ Deep Blue (xadrez, 1997) - busca + heurísticas",
      "🗣️ Assistentes virtuais antigos (Siri original)",
      "🎮 IA de jogos (NPCs, busca em árvore)"
    ]
  },
  ml: {
    tag: "Subárea da IA",
    title: "🐱 Machine Learning (ML)",
    desc: "Subárea da IA em que sistemas aprendem padrões a partir de <strong>dados</strong>, sem serem explicitamente programados. Em vez de regras fixas, o sistema descobre relações estatísticas.",
    desc2: "Quanto mais dados de qualidade, melhor tende a ser o aprendizado. É a base para previsões, classificações e recomendações.",
    examples: [
      "📧 Filtro de spam (aprendeu vendo milhares de emails)",
      "🛒 Recomendação da Amazon, Netflix, Spotify",
      "💳 Detecção de fraude no cartão",
      "🏥 Previsão de risco médico"
    ]
  },
  dl: {
    tag: "Subárea do ML",
    title: "🐾 Deep Learning (DL)",
    desc: "Ramo do ML baseado em <strong>redes neurais profundas</strong>, com múltiplas camadas. Capaz de aprender representações complexas direto dos dados brutos.",
    desc2: "Especialmente eficaz em imagens, áudio, vídeo e texto. Exige grande volume de dados e poder computacional elevado. \"Deep\" = muitas camadas escondidas na rede.",
    examples: [
      "👁️ Reconhecimento facial (Face ID)",
      "🚗 Carros autônomos (visão computacional)",
      "🎙️ Transcrição de áudio (Whisper)",
      "🩻 Diagnóstico por imagem médica"
    ]
  },
  iagen: {
    tag: "Aplicação de DL",
    title: "✨ IA Generativa",
    desc: "Categoria de IA capaz de <strong>criar novos conteúdos</strong> a partir do que aprendeu. Diferente da IA tradicional, que só classifica, prevê ou identifica.",
    desc2: "Apoia-se em modelos de Deep Learning de grande escala (geralmente Transformers). É a base do ChatGPT, Midjourney, etc.",
    examples: [
      "💬 ChatGPT, Claude, Gemini (texto)",
      "🎨 Midjourney, DALL-E, Stable Diffusion (imagem)",
      "🎵 ElevenLabs, Suno (voz e música)",
      "🎬 Sora, Veo (vídeo)"
    ]
  }
};

document.querySelectorAll('.matryoshka-svg .ring').forEach(ring => {
  ring.addEventListener('click', () => {
    document.querySelectorAll('.matryoshka-svg .ring').forEach(r => r.classList.remove('active'));
    ring.classList.add('active');
    const key = ring.dataset.ring;
    const d = ringData[key];
    document.getElementById('m-tag').textContent = d.tag;
    document.getElementById('m-title').textContent = d.title;
    document.getElementById('m-desc').innerHTML = d.desc;
    document.getElementById('m-desc2').textContent = d.desc2;
    document.getElementById('m-examples').innerHTML = d.examples.map(e => `<li>${e}</li>`).join('');
  });
});

// ============================================================
// MÓDULO 2: REDE NEURAL AO VIVO
// ============================================================
// Architecture: 4 inputs -> 3 hidden -> 1 output
// Weights initialized so that result starts strongly "is cat" for default
let weights1 = [
  // i0 -> h0, h1, h2
  [0.7, 0.5, -0.2],
  [0.4, 0.8, 0.1],
  [0.6, 0.3, 0.5],
  [0.2, 0.6, 0.9]
];
let weights2 = [0.8, 0.7, 0.4]; // h0, h1, h2 -> output

const inputPositions = [
  {x: 90, y: 100}, {x: 90, y: 180}, {x: 90, y: 260}, {x: 90, y: 340}
];
const hiddenPositions = [
  {x: 350, y: 130}, {x: 350, y: 220}, {x: 350, y: 310}
];
const outputPosition = {x: 610, y: 220};

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

function drawEdges() {
  const g = document.getElementById('nn-edges');
  g.innerHTML = '';
  // Input -> Hidden edges
  for (let i = 0; i < 4; i++) {
    for (let h = 0; h < 3; h++) {
      const w = weights1[i][h];
      const absW = Math.abs(w);
      const color = w > 0 ? '#2B1810' : '#C73E1D';
      const strokeWidth = 0.5 + absW * 3;
      const opacity = 0.25 + absW * 0.65;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', inputPositions[i].x + 22);
      line.setAttribute('y1', inputPositions[i].y);
      line.setAttribute('x2', hiddenPositions[h].x - 28);
      line.setAttribute('y2', hiddenPositions[h].y);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', strokeWidth);
      line.setAttribute('opacity', opacity);
      g.appendChild(line);
    }
  }
  // Hidden -> Output edges
  for (let h = 0; h < 3; h++) {
    const w = weights2[h];
    const absW = Math.abs(w);
    const color = w > 0 ? '#2B1810' : '#C73E1D';
    const strokeWidth = 0.5 + absW * 3;
    const opacity = 0.25 + absW * 0.65;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', hiddenPositions[h].x + 28);
    line.setAttribute('y1', hiddenPositions[h].y);
    line.setAttribute('x2', outputPosition.x - 34);
    line.setAttribute('y2', outputPosition.y);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', strokeWidth);
    line.setAttribute('opacity', opacity);
    g.appendChild(line);
  }
}

function forward() {
  const inputs = [];
  for (let i = 0; i < 4; i++) {
    const slider = document.getElementById(`nn-in-${i}`);
    inputs.push(parseInt(slider.value) / 100);
    document.getElementById(`nn-v-${i}`).textContent = inputs[i].toFixed(2).replace('.', ',');
  }
  // hidden values
  const hidden = [];
  for (let h = 0; h < 3; h++) {
    let sum = 0;
    for (let i = 0; i < 4; i++) sum += inputs[i] * weights1[i][h];
    hidden.push(sigmoid(sum * 2 - 1));
  }
  // output
  let outSum = 0;
  for (let h = 0; h < 3; h++) outSum += hidden[h] * weights2[h];
  const out = sigmoid(outSum * 2 - 1.5);

  // Update neuron displays
  document.querySelectorAll('#nn-inputs g').forEach((g, i) => {
    g.querySelector('.n-val').textContent = inputs[i].toFixed(2).replace('.', ',');
    g.querySelector('circle').setAttribute('fill', interpolateColor('#FFF9EC', '#FF6B35', inputs[i]));
  });
  document.querySelectorAll('#nn-hidden g').forEach((g, h) => {
    g.querySelector('.n-val').textContent = hidden[h].toFixed(2).replace('.', ',');
    g.querySelector('circle').setAttribute('fill', interpolateColor('#FFF9EC', '#5C8D89', hidden[h]));
  });
  const outG = document.querySelector('#nn-output g');
  outG.querySelector('.n-val').textContent = out.toFixed(2).replace('.', ',');
  outG.querySelector('circle').setAttribute('fill', interpolateColor('#FFE8DD', '#FF6B35', out));

  document.getElementById('nn-out-val').textContent = out.toFixed(2).replace('.', ',');
  const verdict = out > 0.7 ? '🐈 É GATO!' : out > 0.4 ? '🤔 Talvez gato' : '🐶 Não é gato';
  document.getElementById('nn-verdict').textContent = verdict;
}

function interpolateColor(c1, c2, t) {
  const r1 = parseInt(c1.slice(1,3), 16), g1 = parseInt(c1.slice(3,5), 16), b1 = parseInt(c1.slice(5,7), 16);
  const r2 = parseInt(c2.slice(1,3), 16), g2 = parseInt(c2.slice(3,5), 16), b2 = parseInt(c2.slice(5,7), 16);
  const r = Math.round(r1 + (r2-r1)*t);
  const g = Math.round(g1 + (g2-g1)*t);
  const b = Math.round(b1 + (b2-b1)*t);
  return `rgb(${r},${g},${b})`;
}

document.querySelectorAll('.nn-input input').forEach(s => s.addEventListener('input', forward));

document.getElementById('nn-train').addEventListener('click', () => {
  // "Train" = randomize but bias toward output going up if inputs are high (cat-like)
  weights1 = weights1.map(row => row.map(() => (Math.random() * 1.6 - 0.4)));
  weights2 = weights2.map(() => Math.random() * 1.2 + 0.1);
  drawEdges();
  forward();
});

document.getElementById('nn-randomize').addEventListener('click', () => {
  for (let i = 0; i < 4; i++) {
    document.getElementById(`nn-in-${i}`).value = Math.floor(Math.random() * 100);
  }
  forward();
});

document.getElementById('nn-reset').addEventListener('click', () => {
  weights1 = [
    [0.7, 0.5, -0.2],
    [0.4, 0.8, 0.1],
    [0.6, 0.3, 0.5],
    [0.2, 0.6, 0.9]
  ];
  weights2 = [0.8, 0.7, 0.4];
  document.getElementById('nn-in-0').value = 80;
  document.getElementById('nn-in-1').value = 60;
  document.getElementById('nn-in-2').value = 90;
  document.getElementById('nn-in-3').value = 70;
  drawEdges();
  forward();
});

drawEdges();
forward();

// ============================================================
// MÓDULO 3: PIPELINE INTERACTION
// ============================================================
const pipStageInfo = {
  modelo: {title: "🧠 Modelo", text: "O modelo é o <strong>resultado</strong> do treinamento. Como uma receita aprendida: ele transforma entradas em saídas. Pode ser salvo, distribuído e usado depois."},
  algoritmo: {title: "⚙️ Algoritmo", text: "O algoritmo é o <strong>método</strong> usado pra treinar o modelo. Diferentes algoritmos servem pra diferentes problemas: regressão, árvore, rede neural, etc."},
  treinamento: {title: "🎓 Treinamento", text: "O processo de <strong>ajustar os pesos</strong> do modelo usando dados. Caro (GPUs!), demorado (dias/semanas) e geralmente acontece uma vez."},
  inferencia: {title: "💡 Inferência", text: "O <strong>uso real</strong> do modelo treinado. Recebe entrada nova, devolve previsão. Cada chamada custa menos, mas acontece milhares de vezes por dia."}
};

document.querySelectorAll('.pip-stage-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.pip-stage-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  });
});

// ============================================================
// MÓDULO 4: NEXT TOKEN PREDICTION
// ============================================================
const promptScenarios = [
  {
    seed: "O gato subiu no",
    tokens: [
      { tk: " telhado", prob: 38 },
      { tk: " sofá", prob: 22 },
      { tk: " muro", prob: 14 },
      { tk: " armário", prob: 9 },
      { tk: " teclado", prob: 6 }
    ]
  },
  {
    seed: "Era uma vez um",
    tokens: [
      { tk: " rei", prob: 28 },
      { tk: " menino", prob: 24 },
      { tk: " lobo", prob: 12 },
      { tk: " castelo", prob: 9 },
      { tk: " jovem", prob: 7 }
    ]
  },
  {
    seed: "Café com pão de",
    tokens: [
      { tk: " queijo", prob: 67 },
      { tk: " manteiga", prob: 14 },
      { tk: " forma", prob: 6 },
      { tk: " açúcar", prob: 4 },
      { tk: " centeio", prob: 3 }
    ]
  },
  {
    seed: "A capital do Brasil é",
    tokens: [
      { tk: " Brasília", prob: 91 },
      { tk: " a", prob: 3 },
      { tk: " uma", prob: 2 },
      { tk: " hoje", prob: 1 },
      { tk: " conhecida", prob: 1 }
    ]
  }
];

let currentText = promptScenarios[0].seed;
let currentScenarioIdx = 0;
let currentTokens = [...promptScenarios[0].tokens];

function renderText() {
  const display = document.getElementById('nt-display');
  display.innerHTML = `<span class="typed">${currentText}</span><span class="cursor"></span>`;
}

function renderTokens() {
  const container = document.getElementById('token-options');
  container.innerHTML = '';
  currentTokens.forEach((t, idx) => {
    const el = document.createElement('div');
    el.className = 'token-option';
    el.innerHTML = `
      <div class="bg-fill" style="width: ${t.prob}%"></div>
      <span class="tk">${t.tk.trim() === '' ? '(espaço)' : t.tk.replace(' ', '·')}</span>
      <span class="pct">${t.prob}%</span>
      <span class="arrow">→</span>
    `;
    el.addEventListener('click', () => {
      currentText += t.tk;
      renderText();
      generateFollowUpTokens();
    });
    container.appendChild(el);
  });
}

// Synthetic follow-up tokens
function generateFollowUpTokens() {
  const followUps = [
    [" e", " mas", " porque", " com", " da"],
    [" o", " a", " um", " uma", " que"],
    [" foi", " era", " ficou", " ficava", " virou"],
    [".", ",", " ali", " mais", " também"],
    [" tudo", " tão", " bem", " ainda", " logo"]
  ];
  const pool = followUps[Math.floor(Math.random() * followUps.length)];
  // make decaying probability distribution
  const probs = [Math.floor(35 + Math.random() * 20), 22, 14, 9, 5];
  currentTokens = pool.map((tk, i) => ({ tk, prob: probs[i] }));
  renderTokens();
}

document.getElementById('prompt-buttons').addEventListener('click', e => {
  if (!e.target.classList.contains('prompt-btn')) return;
  document.querySelectorAll('.prompt-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  currentScenarioIdx = parseInt(e.target.dataset.prompt);
  currentText = promptScenarios[currentScenarioIdx].seed;
  currentTokens = [...promptScenarios[currentScenarioIdx].tokens];
  renderText();
  renderTokens();
});

document.getElementById('nt-generate').addEventListener('click', () => {
  // greedy: pick top token, repeat 4x
  let steps = 0;
  const interval = setInterval(() => {
    const top = currentTokens.reduce((a, b) => a.prob > b.prob ? a : b);
    currentText += top.tk;
    renderText();
    generateFollowUpTokens();
    steps++;
    if (steps >= 4) clearInterval(interval);
  }, 500);
});

document.getElementById('nt-temp').addEventListener('click', () => {
  // simulate higher temperature: shuffle probs
  currentTokens = currentTokens.map(t => ({
    ...t,
    prob: Math.max(2, Math.floor(t.prob * (0.5 + Math.random() * 1.2)))
  }));
  // normalize a bit
  const sum = currentTokens.reduce((s, t) => s + t.prob, 0);
  if (sum > 100) {
    currentTokens = currentTokens.map(t => ({ ...t, prob: Math.floor(t.prob / sum * 100) }));
  }
  // shuffle
  currentTokens.sort(() => Math.random() - 0.5);
  renderTokens();
});

document.getElementById('nt-clear').addEventListener('click', () => {
  currentText = promptScenarios[currentScenarioIdx].seed;
  currentTokens = [...promptScenarios[currentScenarioIdx].tokens];
  renderText();
  renderTokens();
});

renderText();
renderTokens();

// ============================================================
// MÓDULO 5: SLM vs LLM SLIDER
// ============================================================
const sizeSlider = document.getElementById('size-slider');
const sizeValEl = document.getElementById('size-val');

function getModelProfile(pct) {
  // pct 0..100 mapped to log scale of params
  // 0 -> 1B, 25 -> 7B, 50 -> 25B, 75 -> 100B, 100 -> 500B
  let paramsB;
  let label, costLabel, speedLabel, qualityLabel, whereLabel, privacyLabel, bestLabel;
  let cost, speed, quality, where, privacy, best;

  // Anchor presets: 3=Gemma 2B, 15=Phi-3 3.8B, 40=Llama 3 8B, 65=Llama 3 70B, 92=Frontier ~500B
  if (pct < 10) {
    paramsB = 1 + pct * 0.2;
    label = paramsB < 2 ? `${paramsB.toFixed(1).replace('.', ',')}B` : `${Math.round(paramsB)}B`;
    costLabel = "Muito baixo"; cost = 8;
    speedLabel = "Ultra rápido"; speed = 95;
    qualityLabel = "Limitada"; quality = 25;
    whereLabel = "Celular / IoT"; where = 20;
    privacyLabel = "Total (local)"; privacy = 100;
    bestLabel = "Tarefas focadas"; best = 30;
  } else if (pct < 27) {
    paramsB = 2.5 + (pct-10) * 0.12; // around 3.8B at pct=15
    label = `${paramsB.toFixed(1).replace('.', ',').replace(/,0$/, '')}B`;
    costLabel = "Baixo"; cost = 20;
    speedLabel = "Muito rápido"; speed = 80;
    qualityLabel = "Razoável"; quality = 50;
    whereLabel = "Laptop / GPU mod."; where = 35;
    privacyLabel = "Sim, local"; privacy = 85;
    bestLabel = "Edge, no device"; best = 50;
  } else if (pct < 52) {
    // 8B at pct=40
    paramsB = 5 + (pct-27) * 0.24;
    label = `${Math.round(paramsB)}B`;
    costLabel = "Médio"; cost = 40;
    speedLabel = "Rápido"; speed = 65;
    qualityLabel = "Boa"; quality = 70;
    whereLabel = "GPU média"; where = 55;
    privacyLabel = "Sim, dá"; privacy = 65;
    bestLabel = "Uso geral"; best = 70;
  } else if (pct < 80) {
    // 70B at pct=65
    paramsB = 20 + (pct-52) * 3.2;
    label = `${Math.round(paramsB)}B`;
    costLabel = "Alto"; cost = 70;
    speedLabel = "Médio"; speed = 45;
    qualityLabel = "Excelente"; quality = 88;
    whereLabel = "Multi-GPU"; where = 75;
    privacyLabel = "Difícil"; privacy = 30;
    bestLabel = "Reasoning, criativo"; best = 90;
  } else {
    // ~500B at pct=92
    paramsB = 150 + (pct-80) * 20;
    label = `~${Math.round(paramsB)}B`;
    costLabel = "Altíssimo"; cost = 95;
    speedLabel = "Mais lento"; speed = 25;
    qualityLabel = "Top de linha"; quality = 100;
    whereLabel = "Cluster, nuvem"; where = 100;
    privacyLabel = "Só via API"; privacy = 10;
    bestLabel = "Tudo, mas caro"; best = 100;
  }

  return { label, costLabel, cost, speedLabel, speed, qualityLabel, quality, whereLabel, where, privacyLabel, privacy, bestLabel, best };
}

function updateSlmLlm() {
  const pct = parseInt(sizeSlider.value);
  const p = getModelProfile(pct);
  sizeValEl.textContent = p.label;
  document.getElementById('m-cost').textContent = p.costLabel;
  document.getElementById('bar-cost').style.width = p.cost + '%';
  document.getElementById('m-speed').textContent = p.speedLabel;
  document.getElementById('bar-speed').style.width = p.speed + '%';
  document.getElementById('m-quality').textContent = p.qualityLabel;
  document.getElementById('bar-quality').style.width = p.quality + '%';
  document.getElementById('m-where').textContent = p.whereLabel;
  document.getElementById('bar-where').style.width = p.where + '%';
  document.getElementById('m-privacy').textContent = p.privacyLabel;
  document.getElementById('bar-privacy').style.width = p.privacy + '%';
  document.getElementById('m-best').textContent = p.bestLabel;
  document.getElementById('bar-best').style.width = p.best + '%';

  // Recommendation text
  let rec;
  if (pct < 12) {
    rec = "📱 <strong>SLM clássico</strong>. Cabe no celular. Ideal pra rodar offline, IoT, dispositivos finais. Tarefas bem específicas: classificação, extração simples, autocomplete.";
  } else if (pct < 30) {
    rec = "🪶 <strong>SLM médio</strong>. Roda num MacBook. Bom pra chatbots focados, assistente embarcado, tarefas com latência baixa. Excelente custo-benefício pra um caso de uso bem definido.";
  } else if (pct < 55) {
    rec = "⚖️ <strong>Modelo médio</strong>. Equilíbrio ótimo. Bom pra projetos sérios sem queimar o orçamento. Faz quase tudo decentemente, sem custar uma fortuna por inferência.";
  } else if (pct < 80) {
    rec = "🦾 <strong>LLM forte</strong>. Excelente em raciocínio, escrita criativa, código. Custa mais por chamada, mas faz mais por chamada. Pra produto sério ou pesquisa.";
  } else {
    rec = "🏆 <strong>Modelo de fronteira</strong>. Top de linha (GPT-5, Claude Opus, etc). Caro, mais lento, requer infra cara. Usa quando o problema realmente exige raciocínio amplo e nuance.";
  }
  document.getElementById('rec-text').innerHTML = rec;

  // Preset buttons
  document.querySelectorAll('#preset-models .preset-btn').forEach(b => {
    const targetPct = parseInt(b.dataset.size);
    b.classList.toggle('active', Math.abs(targetPct - pct) < 5);
  });
}

sizeSlider.addEventListener('input', updateSlmLlm);
document.querySelectorAll('#preset-models .preset-btn').forEach(b => {
  b.addEventListener('click', () => {
    sizeSlider.value = b.dataset.size;
    updateSlmLlm();
  });
});

updateSlmLlm();

// ============================================================
// MÓDULO 6: ATTENTION VISUALIZER
// ============================================================
const sentences = [
  {
    words: ["O", "gato", "preto", "sentou", "no", "telhado"],
    // attention[i][j] = how much word i attends to word j when processed
    attention: [
      [0.30, 0.40, 0.10, 0.08, 0.07, 0.05], // O
      [0.20, 0.30, 0.25, 0.15, 0.05, 0.05], // gato
      [0.05, 0.55, 0.30, 0.05, 0.03, 0.02], // preto -> gato (modifica)
      [0.03, 0.40, 0.07, 0.30, 0.10, 0.10], // sentou -> gato (sujeito)
      [0.02, 0.05, 0.03, 0.30, 0.20, 0.40], // no -> telhado
      [0.02, 0.15, 0.05, 0.30, 0.10, 0.38]  // telhado -> sentou
    ]
  },
  {
    words: ["A", "médica", "disse", "que", "ela", "precisava", "descansar"],
    attention: [
      [0.40, 0.30, 0.10, 0.05, 0.05, 0.05, 0.05],
      [0.20, 0.30, 0.15, 0.05, 0.20, 0.05, 0.05],
      [0.05, 0.30, 0.30, 0.10, 0.10, 0.10, 0.05],
      [0.03, 0.20, 0.30, 0.20, 0.15, 0.07, 0.05],
      [0.03, 0.50, 0.10, 0.05, 0.20, 0.07, 0.05], // ela -> médica (coreferência)
      [0.03, 0.10, 0.10, 0.05, 0.40, 0.20, 0.12],
      [0.02, 0.15, 0.05, 0.05, 0.20, 0.40, 0.13]
    ]
  },
  {
    words: ["O", "banco", "da", "praça", "estava", "molhado"],
    attention: [
      [0.30, 0.45, 0.05, 0.10, 0.05, 0.05],
      [0.15, 0.30, 0.05, 0.45, 0.03, 0.02], // banco -> praça (desambigua: praça → banco de praça, não banco financeiro)
      [0.02, 0.30, 0.20, 0.40, 0.05, 0.03],
      [0.05, 0.30, 0.20, 0.30, 0.10, 0.05],
      [0.03, 0.30, 0.05, 0.15, 0.30, 0.17],
      [0.03, 0.40, 0.03, 0.10, 0.30, 0.14]  // molhado -> banco
    ]
  }
];

let currentSentence = 0;
let selectedWord = -1;

function renderAttention() {
  const container = document.getElementById('att-words');
  container.innerHTML = '';
  const s = sentences[currentSentence];
  s.words.forEach((word, idx) => {
    const el = document.createElement('span');
    el.className = 'att-word';
    el.textContent = word;
    el.dataset.idx = idx;
    if (selectedWord === idx) {
      el.classList.add('selected');
    } else if (selectedWord !== -1) {
      const att = s.attention[selectedWord][idx];
      if (att > 0.3) el.classList.add('attended-hi');
      else if (att > 0.15) el.classList.add('attended-mid');
      else el.classList.add('attended-lo');
    }
    el.addEventListener('click', () => {
      selectedWord = (selectedWord === idx) ? -1 : idx;
      renderAttention();
    });
    container.appendChild(el);
  });
}

document.querySelectorAll('#att-sent-picker .att-sent-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('#att-sent-picker .att-sent-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    currentSentence = parseInt(b.dataset.s);
    selectedWord = -1;
    renderAttention();
  });
});

renderAttention();

// ============================================================
// MÓDULO 7: EMBEDDINGS / SPATIAL DRAG
// ============================================================
const wordsData = {
  default: [
    { id: 'gato', label: 'gato', emoji: '🐈', x: 180, y: 200, color: '#FF6B35', cat: 'animal' },
    { id: 'cachorro', label: 'cachorro', emoji: '🐶', x: 240, y: 180, color: '#FF6B35', cat: 'animal' },
    { id: 'passaro', label: 'pássaro', emoji: '🐦', x: 200, y: 130, color: '#FF6B35', cat: 'animal' },
    { id: 'rei', label: 'rei', emoji: '🤴', x: 420, y: 150, color: '#8A6FB1', cat: 'royal' },
    { id: 'rainha', label: 'rainha', emoji: '👸', x: 470, y: 170, color: '#8A6FB1', cat: 'royal' },
    { id: 'principe', label: 'príncipe', emoji: '🤴', x: 460, y: 220, color: '#8A6FB1', cat: 'royal' },
    { id: 'mesa', label: 'mesa', emoji: '🪑', x: 380, y: 410, color: '#5C8D89', cat: 'furniture' },
    { id: 'cadeira', label: 'cadeira', emoji: '🪑', x: 440, y: 430, color: '#5C8D89', cat: 'furniture' },
    { id: 'sofa', label: 'sofá', emoji: '🛋️', x: 400, y: 360, color: '#5C8D89', cat: 'furniture' },
    { id: 'carro', label: 'carro', emoji: '🚗', x: 110, y: 380, color: '#6B8E23', cat: 'vehicle' },
    { id: 'onibus', label: 'ônibus', emoji: '🚌', x: 150, y: 430, color: '#6B8E23', cat: 'vehicle' }
  ],
  organized: [
    { id: 'gato', label: 'gato', emoji: '🐈', x: 130, y: 130, color: '#FF6B35', cat: 'animal' },
    { id: 'cachorro', label: 'cachorro', emoji: '🐶', x: 180, y: 110, color: '#FF6B35', cat: 'animal' },
    { id: 'passaro', label: 'pássaro', emoji: '🐦', x: 160, y: 180, color: '#FF6B35', cat: 'animal' },
    { id: 'rei', label: 'rei', emoji: '🤴', x: 450, y: 130, color: '#8A6FB1', cat: 'royal' },
    { id: 'rainha', label: 'rainha', emoji: '👸', x: 500, y: 150, color: '#8A6FB1', cat: 'royal' },
    { id: 'principe', label: 'príncipe', emoji: '🤴', x: 460, y: 190, color: '#8A6FB1', cat: 'royal' },
    { id: 'mesa', label: 'mesa', emoji: '🪑', x: 130, y: 410, color: '#5C8D89', cat: 'furniture' },
    { id: 'cadeira', label: 'cadeira', emoji: '🪑', x: 180, y: 430, color: '#5C8D89', cat: 'furniture' },
    { id: 'sofa', label: 'sofá', emoji: '🛋️', x: 160, y: 380, color: '#5C8D89', cat: 'furniture' },
    { id: 'carro', label: 'carro', emoji: '🚗', x: 460, y: 400, color: '#6B8E23', cat: 'vehicle' },
    { id: 'onibus', label: 'ônibus', emoji: '🚌', x: 500, y: 430, color: '#6B8E23', cat: 'vehicle' }
  ],
  random: null
};

let embedPoints = JSON.parse(JSON.stringify(wordsData.default));
let dragging = null;
let dragOffset = {x: 0, y: 0};

function renderEmbed() {
  const g = document.getElementById('embed-points');
  g.innerHTML = '';
  embedPoints.forEach(pt => {
    const grp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    grp.classList.add('word-pt');
    grp.setAttribute('data-id', pt.id);
    grp.innerHTML = `
      <circle cx="${pt.x}" cy="${pt.y}" r="26" fill="${pt.color}" stroke="#2B1810" stroke-width="2"/>
      <text x="${pt.x}" y="${pt.y + 5}" font-size="20">${pt.emoji}</text>
      <text x="${pt.x}" y="${pt.y + 48}" font-size="13" font-weight="700" fill="#2B1810">${pt.label}</text>
    `;
    g.appendChild(grp);
  });
  updateDistances();
}

function getPoint(id) { return embedPoints.find(p => p.id === id); }

function dist(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx*dx + dy*dy);
}

function updateDistances() {
  // Normalize distance display to "0 (idêntico) - 1.0 (longe)"
  const maxDist = 700; // diagonal of svg viewbox
  const pairs = [
    {id: 'd-1', a: 'gato', b: 'cachorro'},
    {id: 'd-2', a: 'rei', b: 'rainha'},
    {id: 'd-3', a: 'mesa', b: 'cadeira'},
    {id: 'd-4', a: 'gato', b: 'mesa'}
  ];
  pairs.forEach(p => {
    const pa = getPoint(p.a), pb = getPoint(p.b);
    if (pa && pb) {
      const d = dist(pa, pb) / maxDist;
      document.getElementById(p.id).textContent = d.toFixed(2).replace('.', ',');
    }
  });
}

// SVG drag implementation
const embedSvg = document.getElementById('embed-svg');

function getSvgCoords(evt) {
  const pt = embedSvg.createSVGPoint();
  pt.x = evt.clientX || (evt.touches && evt.touches[0].clientX);
  pt.y = evt.clientY || (evt.touches && evt.touches[0].clientY);
  const ctm = embedSvg.getScreenCTM().inverse();
  return pt.matrixTransform(ctm);
}

embedSvg.addEventListener('mousedown', e => {
  const target = e.target.closest('.word-pt');
  if (!target) return;
  dragging = target.dataset.id;
  target.classList.add('dragging');
  const coords = getSvgCoords(e);
  const pt = getPoint(dragging);
  dragOffset = { x: coords.x - pt.x, y: coords.y - pt.y };
});

window.addEventListener('mousemove', e => {
  if (!dragging) return;
  const coords = getSvgCoords(e);
  const pt = getPoint(dragging);
  pt.x = Math.max(40, Math.min(560, coords.x - dragOffset.x));
  pt.y = Math.max(40, Math.min(490, coords.y - dragOffset.y));
  renderEmbed();
});

window.addEventListener('mouseup', () => {
  if (dragging) {
    document.querySelectorAll('.word-pt').forEach(p => p.classList.remove('dragging'));
    dragging = null;
  }
});

// Touch support
embedSvg.addEventListener('touchstart', e => {
  const target = e.target.closest('.word-pt');
  if (!target) return;
  e.preventDefault();
  dragging = target.dataset.id;
  const coords = getSvgCoords(e);
  const pt = getPoint(dragging);
  dragOffset = { x: coords.x - pt.x, y: coords.y - pt.y };
}, {passive: false});

window.addEventListener('touchmove', e => {
  if (!dragging) return;
  e.preventDefault();
  const coords = getSvgCoords(e);
  const pt = getPoint(dragging);
  pt.x = Math.max(40, Math.min(560, coords.x - dragOffset.x));
  pt.y = Math.max(40, Math.min(490, coords.y - dragOffset.y));
  renderEmbed();
}, {passive: false});

window.addEventListener('touchend', () => { dragging = null; });

// Preset buttons
document.querySelectorAll('.embed-presets .preset-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.embed-presets .preset-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const preset = b.dataset.preset;
    if (preset === 'random') {
      embedPoints = embedPoints.map(p => ({
        ...p,
        x: 60 + Math.random() * 480,
        y: 60 + Math.random() * 410
      }));
    } else {
      embedPoints = JSON.parse(JSON.stringify(wordsData[preset]));
    }
    renderEmbed();
  });
});

renderEmbed();