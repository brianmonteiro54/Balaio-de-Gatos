/* ===== bloco 1 ===== */

/* ====== OPENSEARCH SIMULATED RESULTS ====== */
const osDocuments = [
  { title: "Introdução à computação em nuvem", desc: "O que é cloud computing e por que adotar AWS", tags: ["nuvem", "aws", "cloud", "introdução"] },
  { title: "Fundamentos de Machine Learning", desc: "Conceitos básicos de ML: dados, modelo, treinamento", tags: ["ml", "machine learning", "modelo", "treino"] },
  { title: "Amazon SageMaker para iniciantes", desc: "Como treinar seu primeiro modelo no SageMaker", tags: ["sagemaker", "ml", "treino", "aws"] },
  { title: "Detector de gatos com YOLO", desc: "Pipeline completo de visão computacional", tags: ["gato", "visão", "yolo", "detecção"] },
  { title: "RAG com Bedrock Knowledge Bases", desc: "Como montar RAG sem código de orquestração", tags: ["rag", "bedrock", "llm", "nuvem"] },
  { title: "Gato preto, gato branco, gato vetorial", desc: "Embeddings e bancos vetoriais explicados com gatos", tags: ["gato", "embedding", "vetor", "rag"] },
  { title: "Stable Diffusion na prática", desc: "Gere imagens com modelos no JumpStart", tags: ["stable diffusion", "imagem", "geração", "ml"] },
  { title: "Métricas de ML: acurácia, F1, AUC", desc: "Como avaliar seu modelo de classificação", tags: ["métrica", "f1", "auc", "ml", "modelo"] },
  { title: "OpenSearch como vector database", desc: "Use OpenSearch pra busca semântica", tags: ["opensearch", "vetor", "busca", "nuvem", "aws"] },
  { title: "Foundation models e fine-tuning", desc: "Quando treinar do zero, quando fine-tunar", tags: ["llm", "fine-tuning", "ml", "modelo"] }
];

const osInput = document.getElementById('os-input');
const osResults = document.getElementById('os-results');

function highlight(text, q){
  if (!q) return text;
  const re = new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+')', 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function searchOpenSearch(q){
  if (!q.trim()) {
    osResults.innerHTML = '<div class="opensearch-empty">👆 Digita aí em cima pra ver a busca acontecer</div>';
    return;
  }
  const ql = q.toLowerCase();
  const scored = osDocuments.map(d => {
    let s = 0;
    if (d.title.toLowerCase().includes(ql)) s += 5;
    if (d.desc.toLowerCase().includes(ql)) s += 3;
    d.tags.forEach(t => {
      if (t.toLowerCase().includes(ql)) s += 4;
      if (ql.includes(t.toLowerCase())) s += 2;
    });
    // partial match
    ql.split(' ').forEach(word => {
      if (word.length > 2){
        if (d.title.toLowerCase().includes(word)) s += 1;
        if (d.desc.toLowerCase().includes(word)) s += 0.5;
      }
    });
    return {...d, score: s};
  }).filter(d => d.score > 0).sort((a,b) => b.score - a.score).slice(0, 5);

  if (scored.length === 0){
    osResults.innerHTML = '<div class="opensearch-empty">😿 Nenhum documento encontrado. Tenta outra palavra (gato, ml, nuvem, rag...)</div>';
    return;
  }

  const maxS = scored[0].score;
  osResults.innerHTML = scored.map(d => `
    <div class="opensearch-result">
      <div>
        <div class="title">${highlight(d.title, q)}</div>
        <div class="desc">${highlight(d.desc, q)}</div>
      </div>
      <div class="score">${(d.score/maxS).toFixed(2).replace('.', ',')}</div>
    </div>
  `).join('');
}
osInput.addEventListener('input', e => searchOpenSearch(e.target.value));

/* ====== STABLE DIFFUSION STAGES ====== */
const diffusionStagesEl = document.getElementById('diffusion-stages');
const diffSlider = document.getElementById('diff-slider');
const diffStepValue = document.getElementById('diff-step-value');

function buildDiffusionStage(idx, totalSteps){
  // idx 0 = pure noise; idx totalSteps = final image
  const noise = 1 - (idx / totalSteps);
  return `
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="grain${idx}">
          <feTurbulence type="fractalNoise" baseFrequency="${1.8 - idx * 0.18}" numOctaves="2" seed="${idx * 7}"/>
          <feColorMatrix type="matrix" values="0 0 0 0 ${0.18 + idx*0.04} 0 0 0 0 ${0.10 + idx*0.05} 0 0 0 0 ${0.05 + idx*0.04} 0 0 0 ${noise*1.2} 0"/>
        </filter>
        <radialGradient id="img${idx}" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stop-color="#F4D35E"/>
          <stop offset="40%" stop-color="#FF6B35"/>
          <stop offset="100%" stop-color="#4A7C9E"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#img${idx})" opacity="${1 - noise * 0.7}"/>
      ${ idx >= 3 ? `
        <ellipse cx="50" cy="58" rx="22" ry="20" fill="#2B1810" opacity="${(idx-2)/3}"/>
        <circle cx="42" cy="54" r="3" fill="#F4D35E" opacity="${(idx-2)/3}"/>
        <circle cx="58" cy="54" r="3" fill="#F4D35E" opacity="${(idx-2)/3}"/>
        <polygon points="35,42 42,32 48,42" fill="#2B1810" opacity="${(idx-2)/3}"/>
        <polygon points="52,42 58,32 65,42" fill="#2B1810" opacity="${(idx-2)/3}"/>
      ` : '' }
      <rect width="100" height="100" filter="url(#grain${idx})"/>
    </svg>
  `;
}

function renderDiffusion(currentStep){
  const total = 5;
  diffusionStagesEl.innerHTML = '';
  for (let i = 0; i <= total; i++){
    if (i > currentStep) break;
    const div = document.createElement('div');
    div.className = 'diffusion-stage';
    const label = i === 0 ? 'ruído' : (i === total ? 'imagem' : `passo ${i}`);
    div.innerHTML = buildDiffusionStage(i, total) + `<span class="step-label">${label}</span>`;
    diffusionStagesEl.appendChild(div);
  }
  diffStepValue.textContent = `${currentStep}/5`;
}
diffSlider.addEventListener('input', e => renderDiffusion(parseInt(e.target.value)));
renderDiffusion(5);

/* ====== CFG ====== */
const cfgSlider = document.getElementById('cfg-slider');
const cfgValue = document.getElementById('cfg-value');
const cfgEmoji = document.getElementById('cfg-emoji');
const cfgImage = document.getElementById('cfg-image');
const cfgLabel = document.getElementById('cfg-label');
const cfgDesc = document.getElementById('cfg-desc');

// Pré-carrega as imagens pra trocar suave
const CFG_IMAGES = {
  'muito-criativo': 'Muitocriativo.png',
  'criativo':       'Criativo.png',
  'equilibrado':    'Equilibrado.png',
  'literal':        'Literal.png',
  'muito-literal':  'Muito_literal.png',
  'forcado':        'Forçado_demais.png'
};
Object.values(CFG_IMAGES).forEach(src => { const im = new Image(); im.src = src; });

let lastCfgKey = '';

function updateCfg(){
  const v = parseFloat(cfgSlider.value);
  cfgValue.textContent = v.toFixed(1).replace('.', ',');

  let key, label, desc;
  if (v <= 3) {
    key = 'muito-criativo'; label = 'Muito criativo'; desc = 'O modelo ignora boa parte do prompt. Pode gerar abstrações artísticas, mas pode sair do tema.';
  } else if (v <= 5) {
    key = 'criativo';       label = 'Criativo';       desc = 'Pouco controle do prompt. Mais variação e interpretação livre.';
  } else if (v <= 9) {
    key = 'equilibrado';    label = 'Equilibrado';    desc = 'Sweet spot. Mistura bem fidelidade ao prompt com criatividade visual. 7-8 é o padrão.';
  } else if (v <= 13) {
    key = 'literal';        label = 'Literal';        desc = 'Segue o prompt à risca. Bom pra prompts específicos. Pode perder um pouco de naturalidade.';
  } else if (v <= 17) {
    key = 'muito-literal';  label = 'Muito literal';  desc = 'Imagens saturadas, contrastes fortes. Risco de artefatos visuais ("queimado").';
  } else {
    key = 'forcado';        label = 'Forçado demais'; desc = 'Modelo "tenta demais" obedecer. Resultados podem ficar distorcidos, com cores ruins.';
  }

  // só troca a imagem se mudou de categoria, pra evitar piscar
  if (key !== lastCfgKey){
    cfgEmoji.classList.add('flipping');
    setTimeout(() => {
      cfgImage.src = CFG_IMAGES[key];
      cfgImage.alt = label;
      cfgEmoji.classList.remove('flipping');
    }, 150);
    lastCfgKey = key;
  }

  // dá um efeito sutil de escala conforme o CFG sobe
  cfgEmoji.style.transform = `scale(${0.96 + Math.min(v, 18)/120})`;
  cfgLabel.textContent = label;
  cfgDesc.textContent = desc;
}
cfgSlider.addEventListener('input', updateCfg);
updateCfg();

/* ====== RAG STEP DETAILS ====== */
const ragSteps = {
  '1': {
    title: '📄 Etapa 1 · Ingestão de documentos',
    text: 'Você coleta os documentos que o LLM vai precisar consultar: PDFs de manual, artigos, base de conhecimento da empresa, FAQ, transcrições de reunião... Esses arquivos geralmente moram no S3.',
    example: 'manuais/produto_X.pdf, faqs/atendimento.docx, politicas/RH.pdf'
  },
  '2': {
    title: '✂️ Etapa 2 · Chunking',
    text: 'Cada documento é dividido em pedaços menores (chunks) -tipicamente 300-1000 caracteres ou alguns parágrafos. Isso é necessário porque o LLM tem limite de contexto e queremos achar o trecho relevante, não o documento inteiro.',
    example: 'PDF de 200 páginas → 600 chunks de ~500 caracteres cada'
  },
  '3': {
    title: '🔢 Etapa 3 · Embedding (vetorização)',
    text: 'Cada chunk passa por um modelo de embedding (ex.: Amazon Titan Embeddings, Cohere Embed) que transforma o texto em um vetor de números (ex.: 1024 dimensões). Textos com significado parecido viram vetores próximos no espaço.',
    example: '"gato no Rio" → [0.23, -0.91, 0.45, ..., 0.12]'
  },
  '4': {
    title: '🔍 Etapa 4 · Retrieval (busca)',
    text: 'Quando o usuário faz uma pergunta, ela também é transformada em vetor. O sistema então busca no banco vetorial (OpenSearch, Pinecone) os K chunks mais parecidos. Esses são os candidatos a contexto.',
    example: 'Pergunta: "como devolvo um produto?" → top 3 chunks de FAQ + manual'
  },
  '5': {
    title: '🤖 Etapa 5 · Geração (com contexto)',
    text: 'Os chunks recuperados são injetados no prompt junto com a pergunta original. O LLM responde usando esse contexto. Resultado: resposta personalizada, baseada nos documentos da empresa, com citações da fonte.',
    example: 'Prompt final: "Use o seguinte contexto: [chunks]. Pergunta: como devolvo?"'
  }
};

document.querySelectorAll('.rag-step').forEach(step => {
  step.addEventListener('click', () => {
    document.querySelectorAll('.rag-step').forEach(s => s.classList.remove('active'));
    step.classList.add('active');
    const data = ragSteps[step.dataset.step];
    const detail = document.getElementById('rag-detail');
    detail.innerHTML = `
      <h4>${data.title}</h4>
      <p>${data.text}</p>
      <div class="example-line">📌 Exemplo: ${data.example}</div>
    `;
  });
});
// auto-activate step 1
setTimeout(() => {
  document.querySelector('.rag-step[data-step="1"]').click();
}, 200);

/* ====== CHUNKING ====== */
const chunkText = `O OpenSearch Service é um motor de busca gerenciado da AWS. Ele indexa documentos e vetores em milissegundos. Em pipelines de RAG, ele guarda os embeddings dos seus documentos. Quando o usuário faz uma pergunta, a pergunta vira vetor e o OpenSearch acha os documentos semanticamente parecidos. Depois, esses documentos viram contexto para o LLM gerar a resposta final.`;

const chunkSizeInput = document.getElementById('chunk-size');
const chunkOverlapInput = document.getElementById('chunk-overlap');
const chunkSizeVal = document.getElementById('chunk-size-val');
const chunkOverlapVal = document.getElementById('chunk-overlap-val');
const chunkTextEl = document.getElementById('chunk-text');
const chunkCountEl = document.getElementById('chunk-count');
const chunkAvgEl = document.getElementById('chunk-avg');
const chunkTotalCharsEl = document.getElementById('chunk-total-chars');

function renderChunks(){
  const size = parseInt(chunkSizeInput.value);
  const overlap = parseInt(chunkOverlapInput.value);
  chunkSizeVal.textContent = size;
  chunkOverlapVal.textContent = overlap;

  // build chunks: positions of each character per chunk index
  const chunks = [];
  let start = 0;
  while (start < chunkText.length) {
    const end = Math.min(start + size, chunkText.length);
    chunks.push({start, end});
    if (end >= chunkText.length) break;
    start = end - overlap;
    if (start <= chunks[chunks.length-1].start) start = chunks[chunks.length-1].start + 1;
  }

  // each char gets the chunk indices it belongs to
  // we will render: for each char, take the FIRST chunk index normally,
  // but if it's also in chunk index+1 -> mark as overlap.
  let html = '';
  const N = chunkText.length;
  for (let i = 0; i < N; i++){
    const owners = chunks.map((c,idx) => (i >= c.start && i < c.end) ? idx : -1).filter(x => x >= 0);
    const char = chunkText[i] === ' ' ? '&nbsp;' : (chunkText[i] === '\n' ? '<br>' : chunkText[i]);
    if (owners.length > 1) {
      html += `<span class="chunk-piece overlap">${char}</span>`;
    } else if (owners.length === 1){
      html += `<span class="chunk-piece c${owners[0] % 6}">${char}</span>`;
    } else {
      html += char;
    }
  }
  chunkTextEl.innerHTML = html;

  chunkCountEl.textContent = chunks.length;
  const avg = Math.round(chunks.reduce((a,c) => a + (c.end - c.start), 0) / chunks.length);
  chunkAvgEl.textContent = avg;
  chunkTotalCharsEl.textContent = chunkText.length;
}
chunkSizeInput.addEventListener('input', renderChunks);
chunkOverlapInput.addEventListener('input', renderChunks);
renderChunks();