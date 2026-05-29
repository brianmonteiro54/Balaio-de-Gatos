/* ===== aula 7: Visão, GAN, Rekognition, NLP, Sentimento ===== */

// ============================================================
// MÓDULO 1: SUB-CAMPOS DE IA
// ============================================================
const subfieldData = {
  cv: {
    tag: "Visão",
    title: "👁️ Visão Computacional",
    desc: "Sub-campo que ensina máquinas a <strong>extrair significado de imagens e vídeos</strong>. De pixel cru a conceito ('é um gato', 'tem um carro a 30m', 'a pessoa caiu').",
    tasks: [
      "Classificação de imagens (qual objeto?)",
      "Detecção (o quê e onde, com bounding boxes)",
      "Segmentação (que pixels são quais objetos)",
      "Reconhecimento facial e emoções",
      "OCR (extrair texto de imagem)",
      "Tracking em vídeo (seguir objeto no tempo)"
    ],
    aws: [
      "Amazon Rekognition (foto e vídeo)",
      "Rekognition Custom Labels",
      "Amazon Textract (OCR estruturado)",
      "AWS Panorama (CV em edge)",
      "Amazon Lookout for Vision (defeitos industriais)"
    ]
  },
  nlp: {
    tag: "Linguagem",
    title: "📖 NLP",
    desc: "Processamento de Linguagem Natural. Texto e fala humanos viram <strong>estrutura compreensível pra máquina</strong>: tokens, lemmas, entidades, sentimento, embeddings.",
    tasks: [
      "Análise de sentimento",
      "Extração de entidades (NER)",
      "Tradução automática",
      "Sumarização",
      "Q&A (responder perguntas)",
      "Classificação de tópicos / intenção"
    ],
    aws: [
      "Amazon Comprehend (e Comprehend Medical)",
      "Amazon Translate",
      "Amazon Lex (chatbots)",
      "Amazon Kendra (busca empresarial)",
      "Amazon Bedrock (LLMs gerenciados)"
    ]
  },
  speech: {
    tag: "Áudio",
    title: "🎙️ Reconhecimento de Fala",
    desc: "Áudio falado vira texto (ASR) e texto vira áudio falado (TTS). É o pilar de assistentes virtuais, transcrição e acessibilidade.",
    tasks: [
      "Transcrição (speech-to-text)",
      "Síntese de voz (text-to-speech)",
      "Detecção de palavra-chave (\"Alexa!\")",
      "Diarização (quem falou quando)",
      "Identificação de idioma falado"
    ],
    aws: [
      "Amazon Transcribe (transcrição)",
      "Amazon Polly (síntese de voz)",
      "Amazon Lex (compreensão + voz)",
      "Amazon Connect (call center IA)"
    ]
  },
  robotics: {
    tag: "Físico",
    title: "🤖 Robótica",
    desc: "IA controlando hardware. Combina percepção (sensores), planejamento (rota), atuação (motores). Carros autônomos, drones, braços de fábrica.",
    tasks: [
      "SLAM (mapear e localizar simultaneamente)",
      "Manipulação (pegar objetos sem quebrar)",
      "Navegação autônoma",
      "Detecção de colisão / segurança",
      "Aprendizado por demonstração"
    ],
    aws: [
      "AWS RoboMaker (simulação)",
      "AWS IoT Greengrass (edge)",
      "Amazon Rekognition (visão do robô)",
      "SageMaker RL (aprendizado por reforço)"
    ]
  },
  recsys: {
    tag: "Personalização",
    title: "🎯 Sistemas de Recomendação",
    desc: "Aprende preferências de cada usuário e sugere itens. O \"motor secreto\" da Netflix, Spotify, YouTube, Amazon.",
    tasks: [
      "Filtragem colaborativa (usuários parecidos)",
      "Filtragem baseada em conteúdo",
      "Modelos híbridos",
      "Cold start (usuário/item novo)",
      "Re-ranking em tempo real"
    ],
    aws: [
      "Amazon Personalize",
      "OpenSearch (busca + ranking)",
      "SageMaker Feature Store"
    ]
  },
  kr: {
    tag: "Simbólica",
    title: "🧠 Representação de Conhecimento",
    desc: "IA \"clássica\". Codifica conhecimento humano em ontologias, regras lógicas e grafos. Faz raciocínio explícito, traceável.",
    tasks: [
      "Ontologias (vocabulário de um domínio)",
      "Grafos de conhecimento",
      "Sistemas especialistas (regras IF-THEN)",
      "Raciocínio dedutivo / abdutivo"
    ],
    aws: [
      "Amazon Neptune (graph DB)",
      "Neptune ML",
      "AWS HealthLake (ontologias médicas)"
    ]
  },
  planning: {
    tag: "Decisão",
    title: "🗺️ Planejamento",
    desc: "Dado um objetivo e um conjunto de ações possíveis, gerar a sequência ótima de ações. Logística, jogos, robótica, agendamento.",
    tasks: [
      "Planejamento clássico (PDDL)",
      "Roteirização de veículos",
      "Programação de tarefas (scheduling)",
      "Path-finding (A*, Dijkstra)"
    ],
    aws: [
      "AWS Step Functions (orquestração)",
      "Amazon Forecast (previsão pra planejar)",
      "AWS DeepRacer (RL aplicado)"
    ]
  },
  rl: {
    tag: "Tentativa & erro",
    title: "🎮 Aprendizado por Reforço",
    desc: "Agente toma ações no ambiente, recebe recompensa, aprende a maximizar recompensa total. AlphaGo, robôs, ChatGPT (RLHF).",
    tasks: [
      "Jogos (Go, Xadrez, StarCraft)",
      "Robótica (controle motor)",
      "Otimização de portfólio",
      "RLHF (alinhamento de LLMs)",
      "Trading algorítmico"
    ],
    aws: [
      "SageMaker RL",
      "AWS DeepRacer",
      "RoboMaker + Gazebo"
    ]
  },
  genai: {
    tag: "Criação",
    title: "✨ IA Generativa",
    desc: "Em vez de classificar, <strong>cria conteúdo novo</strong>: texto, imagem, áudio, vídeo, código. Apoia-se em DL profundo (Transformers, Diffusion, GAN).",
    tasks: [
      "Texto: ChatGPT, Claude",
      "Imagem: Midjourney, DALL-E, Stable Diffusion",
      "Áudio: ElevenLabs, Suno",
      "Vídeo: Sora, Veo",
      "Código: Copilot, Kiro"
    ],
    aws: [
      "Amazon Bedrock (LLMs gerenciados)",
      "Amazon Q (assistente)",
      "Amazon Titan (modelos próprios da AWS)",
      "SageMaker JumpStart (deploy de open-source)"
    ]
  }
};

document.querySelectorAll('#subfield-grid .subfield-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#subfield-grid .subfield-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const key = card.dataset.sf;
    const d = subfieldData[key];
    document.getElementById('sf-tag').textContent = d.tag;
    document.getElementById('sf-title').innerHTML = d.title;
    document.getElementById('sf-desc').innerHTML = d.desc;
    document.getElementById('sf-tasks').innerHTML = d.tasks.map(t => `<li>${t}</li>`).join('');
    document.getElementById('sf-aws').innerHTML = d.aws.map(a => `<li>${a}</li>`).join('');
  });
});

// trigger initial
document.querySelector('#subfield-grid .subfield-card.active').click();

// ============================================================
// MÓDULO 2: VISÃO COMPUTACIONAL
// ============================================================
const cvTaskData = {
  classification: {
    title: "🏷️ Classificação",
    desc: "A tarefa mais clássica da CV: receber uma imagem e devolver um <strong>rótulo</strong> com confiança. \"É um gato? É um cachorro?\" - 1 imagem, 1 resposta.",
    pipeline: ["📷 Pixels", "→", "🧠 CNN", "→", "📊 Probabilidades", "→", "🏷️ Label"],
    biz: "<strong style='color: var(--yellow)'>💡 Por que CNN?</strong> Convolutional Neural Networks olham pedacinhos da imagem (3×3, 5×5 pixels) com filtros que aprendem a detectar bordas, texturas, formas - depois compõem no todo. É como o gato que vê o bigode primeiro, depois reconhece \"ah, é o outro gato\".",
    readout: [
      { l: "Cat", c: 0.97 },
      { l: "Indoor", c: 0.91 },
      { l: "Pet", c: 0.88 },
      { l: "Cushion", c: 0.62 }
    ]
  },
  detection: {
    title: "📦 Detecção de Objetos",
    desc: "Não basta saber <em>o quê</em>, também precisa do <em>onde</em>. A IA devolve uma lista de objetos, cada um com sua <strong>bounding box</strong> (caixa delimitadora) e confiança.",
    pipeline: ["📷 Pixels", "→", "🧠 YOLO/R-CNN", "→", "📦 Boxes + labels"],
    biz: "<strong style='color: var(--yellow)'>💡 Algoritmos famosos:</strong> YOLO (You Only Look Once) é rápido, ideal pra vídeo em tempo real. Faster R-CNN é mais preciso mas mais lento. SSD fica no meio. A escolha depende do trade-off latência vs. acurácia.",
    readout: [
      { l: "Cat (200,255 → 280)", c: 0.96 },
      { l: "Stuffed Toy (392,288 → 468)", c: 0.84 },
      { l: "Ball (488,323 → 532)", c: 0.91 }
    ]
  },
  segmentation: {
    title: "✂️ Segmentação",
    desc: "Vai além da caixa: classifica <strong>cada pixel</strong>. Resultado é uma máscara colorida, ideal pra remover fundo, efeitos especiais e direção autônoma.",
    pipeline: ["📷 Pixels", "→", "🧠 U-Net / Mask R-CNN", "→", "🎨 Máscara por pixel"],
    biz: "<strong style='color: var(--yellow)'>💡 Tipos:</strong> <em>semantic</em> (pixel ganha rótulo de classe), <em>instance</em> (separa cada gato individual), <em>panoptic</em> (junta os dois). Direção autônoma exige instance segmentation pra distinguir cada pedestre.",
    readout: [
      { l: "Mask: Cat (4,832 px)", c: 0.94 },
      { l: "Mask: Bunny Toy (1,210 px)", c: 0.81 },
      { l: "Mask: Floor (38,440 px)", c: 0.99 }
    ]
  },
  face: {
    title: "😺 Detecção Facial + Emoção",
    desc: "Detecta rostos e estima atributos: idade, gênero, emoção, óculos, sorriso. É a tarefa por trás de Face ID, filtros de Insta, monitoramento de fadiga.",
    pipeline: ["📷 Pixels", "→", "🔍 Face detector", "→", "🎭 Landmarks (68 pts)", "→", "😺 Atributos"],
    biz: "<strong style='color: var(--yellow)'>💡 Uso responsável:</strong> reconhecimento facial é técnica delicada. LGPD/GDPR, viés demográfico, privacidade. A AWS tem políticas restritivas no <code>SearchFacesByImage</code>. Use sempre com supervisão humana e justificativa documentada.",
    readout: [
      { l: "Face #1 (cat)", c: 0.99 },
      { l: "Emotion: Calm", c: 0.78 },
      { l: "Eyes Open", c: 0.93 },
      { l: "Whiskers: yes", c: 1.0 }
    ]
  },
  ocr: {
    title: "🔤 OCR · Optical Character Recognition",
    desc: "Extrai <strong>texto de imagens</strong>: placas, documentos, prints, recibos. Combinado com NLP, transforma documento em dado consultável.",
    pipeline: ["📷 Pixels", "→", "🔍 Text detector", "→", "🔡 Char recognizer", "→", "📄 String"],
    biz: "<strong style='color: var(--yellow)'>💡 AWS:</strong> <code>Rekognition.DetectText</code> é OCR simples. Pra docs estruturados (notas fiscais, contratos, formulários), use <strong>Amazon Textract</strong>: extrai key-value pairs e tabelas, não só texto solto.",
    readout: [
      { l: "Text: \"CASA DO\"", c: 0.97 },
      { l: "Text: \"GATO 7\"", c: 0.99 },
      { l: "Detections: 2 lines", c: 1.0 }
    ]
  }
};

function setCvTask(task) {
  const d = cvTaskData[task];
  document.querySelectorAll('#cv-task-picker .cv-task-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.task === task);
  });
  document.getElementById('cv-h3').textContent = d.title;
  document.getElementById('cv-explain-desc').innerHTML = d.desc;
  document.querySelector('.cv-pipeline').innerHTML = d.pipeline.map(p => `<span>${p}</span>`).join('');
  document.querySelector('.cv-explain .biz').innerHTML = d.biz;
  // readout
  const r = document.getElementById('cv-readout');
  r.innerHTML = d.readout.map(x => `
    <div class="label-line">
      <span>${x.l}</span>
      <span class="conf">${(x.c * 100).toFixed(0)}%</span>
    </div>
  `).join('');
  // overlay
  drawCvOverlay(task);
}

function drawCvOverlay(task) {
  const o = document.getElementById('cv-overlay');
  o.innerHTML = '';
  if (task === 'classification') {
    // small badge in corner
    o.innerHTML = `
      <rect x="20" y="20" width="220" height="40" rx="8" fill="#FF6B35" stroke="#2B1810" stroke-width="2"/>
      <text x="32" y="46" font-family="Caprasimo" font-size="18" fill="#FFF9EC">🏷️ Cat · 97%</text>
    `;
  } else if (task === 'detection') {
    // bounding boxes
    o.innerHTML = `
      <rect x="138" y="208" width="124" height="148" class="cv-bbox"/>
      <rect x="138" y="190" width="100" height="22" class="cv-bbox-label"/>
      <text x="148" y="206" class="cv-bbox-label-text">Cat 96%</text>

      <rect x="392" y="288" width="76" height="68" class="cv-bbox"/>
      <rect x="392" y="270" width="120" height="22" class="cv-bbox-label"/>
      <text x="402" y="286" class="cv-bbox-label-text">Stuffed Toy 84%</text>

      <rect x="488" y="323" width="44" height="44" class="cv-bbox"/>
      <rect x="488" y="305" width="74" height="22" class="cv-bbox-label"/>
      <text x="498" y="321" class="cv-bbox-label-text">Ball 91%</text>
    `;
  } else if (task === 'segmentation') {
    // colored masks
    o.innerHTML = `
      <ellipse cx="200" cy="280" rx="62" ry="50" fill="#FF6B35" class="cv-mask"/>
      <polygon points="158,238 170,210 180,238" fill="#FF6B35" class="cv-mask"/>
      <polygon points="222,238 232,210 245,238" fill="#FF6B35" class="cv-mask"/>
      <ellipse cx="430" cy="320" rx="38" ry="32" fill="#8A6FB1" class="cv-mask"/>
      <circle cx="510" cy="345" r="22" fill="#5C8D89" class="cv-mask"/>
      <rect x="0" y="280" width="600" height="120" fill="#F4D35E" class="cv-mask" opacity="0.25"/>
      <text x="20" y="44" font-family="Caprasimo" font-size="14" fill="#2B1810">🟧 Cat · 🟪 Toy · 🟢 Ball · 🟡 Floor</text>
    `;
  } else if (task === 'face') {
    // landmarks on cat face
    const pts = [
      [183, 280], [217, 280], // eyes
      [200, 294], // nose
      [188, 302], [200, 306], [212, 302], // mouth
      [170, 215], [232, 215], // ear tips
      [160, 290], [240, 290]  // whisker bases
    ];
    o.innerHTML = pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" class="cv-keypoint"/>`).join('') + `
      <rect x="138" y="208" width="124" height="100" class="cv-bbox"/>
      <rect x="20" y="20" width="240" height="40" rx="8" fill="#FF6B35" stroke="#2B1810" stroke-width="2"/>
      <text x="32" y="46" font-family="Caprasimo" font-size="16" fill="#FFF9EC">😺 Calm · Whiskered · Open</text>
    `;
  } else if (task === 'ocr') {
    // highlight sign text
    o.innerHTML = `
      <rect x="28" y="78" width="164" height="64" class="cv-bbox" stroke="#5C8D89"/>
      <rect x="28" y="60" width="84" height="20" rx="4" fill="#5C8D89" stroke="#2B1810" stroke-width="2"/>
      <text x="36" y="74" class="cv-bbox-label-text">"CASA DO"</text>
      <rect x="118" y="60" width="92" height="20" rx="4" fill="#5C8D89" stroke="#2B1810" stroke-width="2"/>
      <text x="126" y="74" class="cv-bbox-label-text">"GATO 7"</text>
    `;
  }
}

document.querySelectorAll('#cv-task-picker .cv-task-btn').forEach(b => {
  b.addEventListener('click', () => setCvTask(b.dataset.task));
});

setCvTask('classification');

// ============================================================
// MÓDULO 3: GAN
// ============================================================
let ganEpoch = 0;
let gSkill = 0.12;
let dSkill = 0.88;

const ganCells = [];
function buildGanGallery() {
  const c = document.getElementById('gan-cats');
  c.innerHTML = '';
  ganCells.length = 0;
  const cats = ['🐈', '🐱', '😸', '🐈‍⬛', '😺', '😻'];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.className = 'gan-cat-cell';
    el.innerHTML = `
      <div class="blob"></div>
      <span class="cat-emoji">${cats[i]}</span>
      <span class="verdict">FAKE</span>
    `;
    c.appendChild(el);
    ganCells.push(el);
  }
}

function renderGan() {
  document.getElementById('g-bar').style.width = (gSkill * 100) + '%';
  document.getElementById('g-num').textContent = gSkill.toFixed(2).replace('.', ',');
  document.getElementById('d-bar').style.width = (dSkill * 100) + '%';
  document.getElementById('d-num').textContent = dSkill.toFixed(2).replace('.', ',');
  document.getElementById('gan-epoch-n').textContent = ganEpoch;

  // gallery: as G improves, blur reduces and emoji shows
  const blurPx = Math.max(0, 14 - gSkill * 14);
  const opacity = 0.25 + gSkill * 0.75;
  ganCells.forEach((cell, i) => {
    const catBlur = blurPx + (Math.random() * 2 - 1);
    cell.querySelector('.cat-emoji').style.filter = `blur(${Math.max(0, catBlur)}px)`;
    cell.querySelector('.cat-emoji').style.opacity = opacity;
    // blob fade
    cell.querySelector('.blob').style.filter = `blur(${blurPx + 4}px)`;
    cell.querySelector('.blob').style.opacity = Math.max(0.05, 0.7 - gSkill * 0.65);
    // verdict
    const v = cell.querySelector('.verdict');
    if (gSkill > 0.7) {
      v.textContent = Math.random() < 0.4 ? 'FAKE?' : 'REAL?';
      v.style.background = '#5C8D89';
    } else if (gSkill > 0.4) {
      v.textContent = 'FAKE';
      v.style.background = '#C73E1D';
    } else {
      v.textContent = 'FAKE';
      v.style.background = '#2B1810';
    }
  });
}

function ganTrainOne() {
  ganEpoch++;
  // G improves, asymptotically
  gSkill += (1 - gSkill) * (0.06 + Math.random() * 0.05);
  // D adapts: starts high, drops as G catches up, stabilizes near 0.5
  const target = 0.5 + (1 - gSkill) * 0.45;
  dSkill += (target - dSkill) * 0.4 + (Math.random() * 0.04 - 0.02);
  dSkill = Math.max(0.4, Math.min(0.99, dSkill));
  gSkill = Math.max(0, Math.min(0.99, gSkill));
  renderGan();
}

document.getElementById('gan-train').addEventListener('click', ganTrainOne);

document.getElementById('gan-auto').addEventListener('click', () => {
  let n = 0;
  const t = setInterval(() => {
    ganTrainOne();
    n++;
    if (n >= 10) clearInterval(t);
  }, 220);
});

document.getElementById('gan-reset').addEventListener('click', () => {
  ganEpoch = 0;
  gSkill = 0.12;
  dSkill = 0.88;
  renderGan();
});

buildGanGallery();
renderGan();

// ============================================================
// MÓDULO 4: REKOGNITION
// ============================================================
const rekData = {
  labels: {
    title: "DetectLabels",
    code: `<span class="c"># Python · boto3</span>
<span class="k">import</span> boto3
client = boto3.client(<span class="s">"rekognition"</span>)

response = client.detect_labels(
    Image={
        <span class="s">"S3Object"</span>: {
            <span class="s">"Bucket"</span>: <span class="s">"meu-bucket"</span>,
            <span class="s">"Name"</span>: <span class="s">"gato.jpg"</span>
        }
    },
    MaxLabels=<span class="n">10</span>,
    MinConfidence=<span class="n">80</span>
)`,
    resp: `{
  <span class="k">"Labels"</span>: [
    {
      <span class="k">"Name"</span>: <span class="s">"Cat"</span>,
      <span class="k">"Confidence"</span>: <span class="n">98.3</span>,
      <span class="k">"Parents"</span>: [
        {<span class="k">"Name"</span>: <span class="s">"Pet"</span>},
        {<span class="k">"Name"</span>: <span class="s">"Animal"</span>},
        {<span class="k">"Name"</span>: <span class="s">"Mammal"</span>}
      ]
    },
    {
      <span class="k">"Name"</span>: <span class="s">"Furniture"</span>,
      <span class="k">"Confidence"</span>: <span class="n">87.1</span>
    },
    {
      <span class="k">"Name"</span>: <span class="s">"Indoor"</span>,
      <span class="k">"Confidence"</span>: <span class="n">91.5</span>
    }
  ]
}`
  },
  faces: {
    title: "DetectFaces",
    code: `response = client.detect_faces(
    Image={<span class="s">"S3Object"</span>:{<span class="s">"Bucket"</span>:<span class="s">"meu-bucket"</span>,<span class="s">"Name"</span>:<span class="s">"selfie.jpg"</span>}},
    Attributes=[<span class="s">"ALL"</span>]  <span class="c"># pega idade, emoção, óculos, etc.</span>
)`,
    resp: `{
  <span class="k">"FaceDetails"</span>: [{
    <span class="k">"AgeRange"</span>: {<span class="k">"Low"</span>:<span class="n">28</span>, <span class="k">"High"</span>:<span class="n">36</span>},
    <span class="k">"Gender"</span>: {<span class="k">"Value"</span>:<span class="s">"Female"</span>, <span class="k">"Confidence"</span>:<span class="n">99.1</span>},
    <span class="k">"Smile"</span>: {<span class="k">"Value"</span>:<span class="k">true</span>, <span class="k">"Confidence"</span>:<span class="n">94.6</span>},
    <span class="k">"Eyeglasses"</span>: {<span class="k">"Value"</span>:<span class="k">false</span>},
    <span class="k">"Emotions"</span>: [
      {<span class="k">"Type"</span>:<span class="s">"HAPPY"</span>, <span class="k">"Confidence"</span>:<span class="n">87.3</span>},
      {<span class="k">"Type"</span>:<span class="s">"CALM"</span>, <span class="k">"Confidence"</span>:<span class="n">10.1</span>}
    ],
    <span class="k">"BoundingBox"</span>: {<span class="k">"Width"</span>:<span class="n">0.32</span>, <span class="k">"Height"</span>:<span class="n">0.41</span>}
  }]
}`
  },
  moderation: {
    title: "DetectModerationLabels",
    code: `response = client.detect_moderation_labels(
    Image={<span class="s">"S3Object"</span>:{<span class="s">"Bucket"</span>:<span class="s">"uploads"</span>,<span class="s">"Name"</span>:<span class="s">"user-post.jpg"</span>}},
    MinConfidence=<span class="n">75</span>
)
<span class="c"># UI bloqueia se ModerationLabels não-vazio</span>`,
    resp: `{
  <span class="k">"ModerationLabels"</span>: [
    {
      <span class="k">"Name"</span>: <span class="s">"Violence"</span>,
      <span class="k">"Confidence"</span>: <span class="n">82.3</span>,
      <span class="k">"ParentName"</span>: <span class="s">""</span>
    },
    {
      <span class="k">"Name"</span>: <span class="s">"Weapons"</span>,
      <span class="k">"Confidence"</span>: <span class="n">81.1</span>,
      <span class="k">"ParentName"</span>: <span class="s">"Violence"</span>
    }
  ]
}
<span class="c"># Categorias: Suggestive, Violence, Visually Disturbing,</span>
<span class="c"># Drugs, Tobacco, Alcohol, Gambling, Hate Symbols, etc.</span>`
  },
  text: {
    title: "DetectText (OCR)",
    code: `response = client.detect_text(
    Image={<span class="s">"S3Object"</span>:{<span class="s">"Bucket"</span>:<span class="s">"placas"</span>,<span class="s">"Name"</span>:<span class="s">"casa.jpg"</span>}}
)`,
    resp: `{
  <span class="k">"TextDetections"</span>: [
    {
      <span class="k">"DetectedText"</span>: <span class="s">"CASA DO GATO 7"</span>,
      <span class="k">"Type"</span>: <span class="s">"LINE"</span>,
      <span class="k">"Confidence"</span>: <span class="n">98.7</span>
    },
    {
      <span class="k">"DetectedText"</span>: <span class="s">"CASA"</span>,
      <span class="k">"Type"</span>: <span class="s">"WORD"</span>,
      <span class="k">"Confidence"</span>: <span class="n">99.2</span>
    },
    {
      <span class="k">"DetectedText"</span>: <span class="s">"DO"</span>,
      <span class="k">"Type"</span>: <span class="s">"WORD"</span>,
      <span class="k">"Confidence"</span>: <span class="n">98.9</span>
    },
    {
      <span class="k">"DetectedText"</span>: <span class="s">"GATO"</span>,
      <span class="k">"Type"</span>: <span class="s">"WORD"</span>,
      <span class="k">"Confidence"</span>: <span class="n">98.8</span>
    },
    {
      <span class="k">"DetectedText"</span>: <span class="s">"7"</span>,
      <span class="k">"Type"</span>: <span class="s">"WORD"</span>,
      <span class="k">"Confidence"</span>: <span class="n">97.5</span>
    }
  ]
}`
  },
  celebrity: {
    title: "RecognizeCelebrities",
    code: `response = client.recognize_celebrities(
    Image={<span class="s">"S3Object"</span>:{<span class="s">"Bucket"</span>:<span class="s">"midia"</span>,<span class="s">"Name"</span>:<span class="s">"premio.jpg"</span>}}
)`,
    resp: `{
  <span class="k">"CelebrityFaces"</span>: [
    {
      <span class="k">"Name"</span>: <span class="s">"Brian Richard"</span>,
      <span class="k">"Id"</span>: <span class="s">"abc123"</span>,
      <span class="k">"MatchConfidence"</span>: <span class="n">94.2</span>,
      <span class="k">"Urls"</span>: [<span class="s">"linkedin.com/in/brianrichard1"</span>],
      <span class="k">"Face"</span>: {
        <span class="k">"BoundingBox"</span>: {<span class="k">"Width"</span>:<span class="n">0.21</span>, <span class="k">"Height"</span>:<span class="n">0.30</span>},
        <span class="k">"Smile"</span>: {<span class="k">"Value"</span>:<span class="k">true</span>}
      }
    }
  ],
  <span class="k">"UnrecognizedFaces"</span>: []
}`
  },
  compare: {
    title: "CompareFaces",
    code: `response = client.compare_faces(
    SourceImage={<span class="s">"S3Object"</span>:{<span class="s">"Bucket"</span>:<span class="s">"kyc"</span>,<span class="s">"Name"</span>:<span class="s">"rg.jpg"</span>}},
    TargetImage={<span class="s">"S3Object"</span>:{<span class="s">"Bucket"</span>:<span class="s">"kyc"</span>,<span class="s">"Name"</span>:<span class="s">"selfie.jpg"</span>}},
    SimilarityThreshold=<span class="n">90</span>
)`,
    resp: `{
  <span class="k">"FaceMatches"</span>: [
    {
      <span class="k">"Similarity"</span>: <span class="n">96.8</span>,
      <span class="k">"Face"</span>: {
        <span class="k">"BoundingBox"</span>: {<span class="k">"Width"</span>:<span class="n">0.28</span>, <span class="k">"Height"</span>:<span class="n">0.36</span>},
        <span class="k">"Confidence"</span>: <span class="n">99.9</span>
      }
    }
  ],
  <span class="k">"UnmatchedFaces"</span>: []
}
<span class="c"># Se Similarity ≥ threshold → mesma pessoa</span>`
  },
  ppe: {
    title: "DetectProtectiveEquipment",
    code: `response = client.detect_protective_equipment(
    Image={<span class="s">"S3Object"</span>:{<span class="s">"Bucket"</span>:<span class="s">"obra"</span>,<span class="s">"Name"</span>:<span class="s">"frame_42.jpg"</span>}},
    SummarizationAttributes={
        <span class="s">"MinConfidence"</span>: <span class="n">80</span>,
        <span class="s">"RequiredEquipmentTypes"</span>: [<span class="s">"FACE_COVER"</span>,<span class="s">"HEAD_COVER"</span>]
    }
)`,
    resp: `{
  <span class="k">"Persons"</span>: [
    {
      <span class="k">"Id"</span>: <span class="n">0</span>,
      <span class="k">"BodyParts"</span>: [
        {<span class="k">"Name"</span>:<span class="s">"HEAD"</span>, <span class="k">"EquipmentDetections"</span>:[
          {<span class="k">"Type"</span>:<span class="s">"HEAD_COVER"</span>, <span class="k">"Confidence"</span>:<span class="n">96.2</span>}
        ]},
        {<span class="k">"Name"</span>:<span class="s">"FACE"</span>, <span class="k">"EquipmentDetections"</span>:[]}
      ]
    }
  ],
  <span class="k">"Summary"</span>: {
    <span class="k">"PersonsWithRequiredEquipment"</span>: [],
    <span class="k">"PersonsWithoutRequiredEquipment"</span>: [<span class="n">0</span>]  <span class="c"># falta máscara!</span>
  }
}`
  },
  video: {
    title: "StartLabelDetection (Video)",
    code: `<span class="c"># Vídeo é assíncrono: dispara, ouve no SNS, depois consulta</span>
start = client.start_label_detection(
    Video={<span class="s">"S3Object"</span>:{<span class="s">"Bucket"</span>:<span class="s">"streams"</span>,<span class="s">"Name"</span>:<span class="s">"cam_01.mp4"</span>}},
    NotificationChannel={
        <span class="s">"SNSTopicArn"</span>: <span class="s">"arn:aws:sns:..."</span>,
        <span class="s">"RoleArn"</span>: <span class="s">"arn:aws:iam::..."</span>
    }
)
job_id = start[<span class="s">"JobId"</span>]
<span class="c"># Quando SNS disparar, busca resultado:</span>
res = client.get_label_detection(JobId=job_id)`,
    resp: `{
  <span class="k">"JobStatus"</span>: <span class="s">"SUCCEEDED"</span>,
  <span class="k">"VideoMetadata"</span>: {
    <span class="k">"DurationMillis"</span>: <span class="n">120000</span>,
    <span class="k">"FrameRate"</span>: <span class="n">30</span>
  },
  <span class="k">"Labels"</span>: [
    {
      <span class="k">"Timestamp"</span>: <span class="n">1500</span>,
      <span class="k">"Label"</span>: {
        <span class="k">"Name"</span>: <span class="s">"Cat"</span>,
        <span class="k">"Confidence"</span>: <span class="n">94.0</span>
      }
    },
    {
      <span class="k">"Timestamp"</span>: <span class="n">2200</span>,
      <span class="k">"Label"</span>: {<span class="k">"Name"</span>:<span class="s">"Jump"</span>, <span class="k">"Confidence"</span>:<span class="n">76.5</span>}
    }
  ]
}`
  }
};

document.querySelectorAll('#rek-grid .rek-card').forEach(c => {
  c.addEventListener('click', () => {
    document.querySelectorAll('#rek-grid .rek-card').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    const d = rekData[c.dataset.rek];
    document.getElementById('rek-code').innerHTML = d.code;
    document.getElementById('rek-resp').innerHTML = d.resp;
  });
});

// initial
document.querySelector('#rek-grid .rek-card.active').click();

// ============================================================
// MÓDULO 5: CREDENCIAIS
// ============================================================
const credData = {
  hardcode: {
    ic: "⛔",
    title: "Hardcoded no código",
    sec: 5, easy: 60, rot: 0, aud: 30,
    verdict: `<strong>🚫 Nunca, em hipótese alguma.</strong>
      <p>Keys ficam permanentes no Git. Repositório público? AWS detecta e desabilita em horas, mas não antes de alguém minerar Bitcoin com sua conta. Repositório privado? Quem tem acesso ao código tem acesso à conta.</p>`,
    code: `<span class="c"># 💀 NÃO FAÇA ISSO</span>
<span class="k">import</span> boto3
client = boto3.client(
    <span class="s">"rekognition"</span>,
    aws_access_key_id=<span class="s">"AKIA1234567890"</span>,    <span class="c"># 🚨 HARDCODED</span>
    aws_secret_access_key=<span class="s">"wJalrXUtnFEMI..."</span>  <span class="c"># 🚨 NO GIT</span>
)`
  },
  env: {
    ic: "⚠️",
    title: "Variável de ambiente em prod",
    sec: 35, easy: 75, rot: 10, aud: 50,
    verdict: `<strong>⚠️ Aceitável só pra teste rápido.</strong>
      <p>As keys ainda são permanentes e ficam num arquivo .env. Se o servidor for invadido ou a variável vazar em log, alguém usa indefinidamente. Em prod, prefira IAM Role.</p>`,
    code: `<span class="c"># OK pra dev local, ruim pra prod</span>
<span class="c"># export AWS_ACCESS_KEY_ID=AKIA...</span>
<span class="c"># export AWS_SECRET_ACCESS_KEY=...</span>

<span class="k">import</span> boto3
client = boto3.client(<span class="s">"rekognition"</span>)  <span class="c"># lê do env automaticamente</span>`
  },
  profile: {
    ic: "✅",
    title: "AWS CLI profile (~/.aws/credentials)",
    sec: 50, easy: 85, rot: 20, aud: 60,
    verdict: `<strong>✅ Padrão pra desenvolvimento local.</strong>
      <p>Você roda <code>aws configure</code> e o SDK lê do arquivo. Bom pra dev. Em prod (EC2/Lambda) <strong>não use</strong> - lá sempre Role. Pra dev mais seguro: AWS SSO/Identity Center, que entrega credenciais temporárias por sessão.</p>`,
    code: `<span class="c"># ~/.aws/credentials</span>
<span class="c"># [default]</span>
<span class="c"># aws_access_key_id = AKIA...</span>
<span class="c"># aws_secret_access_key = ...</span>

<span class="k">import</span> boto3
session = boto3.Session(profile_name=<span class="s">"default"</span>)
client = session.client(<span class="s">"rekognition"</span>)`
  },
  role: {
    ic: "🏆",
    title: "IAM Role anexada ao recurso",
    sec: 95, easy: 90, rot: 100, aud: 100,
    verdict: `<strong>👍 Recomendado pra produção.</strong>
      <p>Você anexa uma Role no recurso (EC2/Lambda/ECS) com permissão pra Rekognition. O SDK pega credenciais temporárias automaticamente via <strong>Instance Metadata Service</strong>. Rotação a cada hora. Zero key no código.</p>`,
    code: `<span class="c"># Lambda com Role anexada — não precisa de credentials no código</span>
<span class="k">import</span> boto3
client = boto3.client(<span class="s">"rekognition"</span>)
res = client.detect_labels(
    Image={<span class="s">"S3Object"</span>: {<span class="s">"Bucket"</span>: <span class="s">"meu-bucket"</span>, <span class="s">"Name"</span>: <span class="s">"gato.jpg"</span>}},
    MinConfidence=<span class="n">80</span>
)
<span class="c"># Role precisa de policy com:</span>
<span class="c"># "rekognition:DetectLabels", "s3:GetObject"</span>`
  },
  sso: {
    ic: "🏆",
    title: "AWS IAM Identity Center (SSO)",
    sec: 92, easy: 80, rot: 95, aud: 100,
    verdict: `<strong>👍 Padrão pra usuários humanos.</strong>
      <p>Sua organização tem AD/Okta/Azure AD? Conecta no Identity Center, e os devs logam com SSO corporativo. Recebem credenciais STS temporárias (1 hora). Zero key permanente em laptop. Adeus IAM User clássico.</p>`,
    code: `<span class="c"># Configurar uma vez</span>
<span class="c"># aws configure sso</span>
<span class="c"># SSO start URL: https://minha-org.awsapps.com/start</span>

<span class="c"># Login (abre browser, autentica no SSO corp)</span>
<span class="c"># aws sso login --profile dev</span>

<span class="k">import</span> boto3
session = boto3.Session(profile_name=<span class="s">"dev"</span>)
client = session.client(<span class="s">"rekognition"</span>)
<span class="c"># Sessão expira em ~1h, é só refazer login</span>`
  },
  secrets: {
    ic: "🏆",
    title: "Secrets Manager / SSM Parameter Store",
    sec: 95, easy: 70, rot: 100, aud: 100,
    verdict: `<strong>🔐 Pra credenciais de terceiros.</strong>
      <p>Token Stripe, senha de DB, API key de fornecedor externo? Guarda no <strong>Secrets Manager</strong>. IAM controla quem pode ler. Rotação automática (Secrets Manager faz pra você no caso de RDS). CloudTrail loga cada acesso. Para configs não-sensíveis e parâmetros, <strong>SSM Parameter Store</strong> tem versão gratuita.</p>`,
    code: `<span class="k">import</span> boto3, json
sm = boto3.client(<span class="s">"secretsmanager"</span>)
secret = sm.get_secret_value(SecretId=<span class="s">"prod/stripe-token"</span>)
token = json.loads(secret[<span class="s">"SecretString"</span>])[<span class="s">"token"</span>]

<span class="c"># Pra params simples, SSM Parameter Store é mais barato:</span>
ssm = boto3.client(<span class="s">"ssm"</span>)
val = ssm.get_parameter(
    Name=<span class="s">"/prod/feature_flag/new_ui"</span>,
    WithDecryption=<span class="k">True</span>
)[<span class="s">"Parameter"</span>][<span class="s">"Value"</span>]`
  }
};

document.querySelectorAll('#cred-options .cred-opt').forEach(o => {
  o.addEventListener('click', () => {
    document.querySelectorAll('#cred-options .cred-opt').forEach(x => x.classList.remove('active'));
    o.classList.add('active');
    const d = credData[o.dataset.cred];
    document.getElementById('cred-ic').textContent = d.ic;
    document.getElementById('cred-title').textContent = d.title;
    document.getElementById('cred-sec').style.width = d.sec + '%';
    document.getElementById('cred-easy').style.width = d.easy + '%';
    document.getElementById('cred-rot').style.width = d.rot + '%';
    document.getElementById('cred-aud').style.width = d.aud + '%';
    document.getElementById('cred-verdict').innerHTML = d.verdict;
    document.getElementById('cred-code').innerHTML = d.code;
  });
});

// ============================================================
// MÓDULO 6: LAB
// ============================================================
const labSteps = [
  {
    title: "1️⃣ Preparar a imagem no S3",
    body: `<p>O Rekognition consome imagens diretamente do <strong>Amazon S3</strong> ou de bytes inline. Pra pipelines de produção, sempre S3 (acima de 5MB é obrigatório).</p>
      <div class="lab-pill">📦 Bucket: <code>balaio-de-gatos-fotos</code></div>
      <div class="lab-pill">🖼️ Object: <code>gatos/persa-001.jpg</code></div>
      <div class="lab-pill">🌎 Region: <code>us-east-1</code></div>
      <p style="margin-top:14px"><strong>Suba pelo CLI:</strong></p>
      <div class="lab-snippet">aws s3 cp persa-001.jpg s3://balaio-de-gatos-fotos/gatos/persa-001.jpg</div>
      <p style="margin-top: 10px"><em>Atenção:</em> bucket precisa estar na mesma região do Rekognition (ou com replicação). Permissão <code>s3:GetObject</code> tem que estar na Role.</p>`
  },
  {
    title: "2️⃣ Criar a IAM Role com mínimo privilégio",
    body: `<p>O recurso que vai chamar Rekognition (Lambda, EC2 ou seu notebook) precisa de uma Role com <strong>2 permissões essenciais</strong>:</p>
      <div class="lab-snippet">{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["rekognition:DetectLabels"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::balaio-de-gatos-fotos/*"
    }
  ]
}</div>
      <p style="margin-top: 10px"><strong>Princípio:</strong> nada de <code>"Action": "*"</code>. Se você só vai chamar <code>DetectLabels</code>, só dê <code>DetectLabels</code>. Se vazar a credencial, o estrago é mínimo.</p>`
  },
  {
    title: "3️⃣ Chamar a API",
    body: `<p>Agora a parte gostosa: a chamada propriamente dita. Como a Role já está anexada ao recurso, o SDK pega credenciais temporárias automaticamente. <strong>Nada de keys no código.</strong></p>
      <div class="lab-snippet">import boto3

rek = boto3.client("rekognition", region_name="us-east-1")

response = rek.detect_labels(
    Image={
        "S3Object": {
            "Bucket": "balaio-de-gatos-fotos",
            "Name":   "gatos/persa-001.jpg"
        }
    },
    MaxLabels=10,
    MinConfidence=50  # filtraremos depois
)
print(response["Labels"])</div>
      <p style="margin-top: 10px">Resposta volta em ~300ms pra imagens normais. Cobrança: ~US$ 0,001 por imagem nas primeiras 1M (vai diminuindo em escala).</p>`
  },
  {
    title: "4️⃣ Filtrar por confiança",
    body: `<p>O Rekognition retorna mais labels do que você precisa. Filtra por confiança alta antes de usar. Pra uso geral: <strong>≥ 80%</strong>. Pra decisão crítica: <strong>≥ 95% + revisão humana via Amazon A2I</strong>.</p>
      <div class="lab-snippet">labels = response["Labels"]

confiantes = [
    l for l in labels
    if l["Confidence"] >= 80
]

# Estrutura útil:
for label in confiantes:
    name = label["Name"]
    conf = round(label["Confidence"], 1)
    parents = [p["Name"] for p in label.get("Parents", [])]
    print(f"{name}: {conf}%  (parents: {parents})")</div>
      <p style="margin-top: 10px"><strong>Saída esperada:</strong></p>
      <div class="lab-pill">🐈 Cat: 98.3%</div>
      <div class="lab-pill">🐾 Pet: 92.1%</div>
      <div class="lab-pill">🏠 Indoor: 91.5%</div>
      <div class="lab-pill">🛋️ Furniture: 87.1%</div>`
  },
  {
    title: "5️⃣ Pronto! 🎉",
    body: `<p>Você fechou o ciclo. Em produção, esse pipeline costuma virar um trigger:</p>
      <ul style="margin: 14px 0 14px 22px; line-height: 1.8;">
        <li>📤 Usuário sobe foto pro S3 (presigned URL)</li>
        <li>🔔 S3 dispara evento → <strong>Lambda</strong></li>
        <li>🧠 Lambda chama <strong>Rekognition.DetectLabels</strong></li>
        <li>💾 Resultado vai pro <strong>DynamoDB / RDS</strong></li>
        <li>📊 Dashboard / app consome os labels</li>
      </ul>
      <p><strong>Custos a monitorar:</strong></p>
      <div class="lab-pill">🟧 Rekognition: por imagem</div>
      <div class="lab-pill">🟦 S3: storage + GET</div>
      <div class="lab-pill">🟨 Lambda: tempo de execução</div>
      <div class="lab-pill">🟩 DynamoDB: writes</div>
      <p style="margin-top: 14px;"><strong>Próximos passos:</strong> testar com mais imagens, medir falsos positivos/negativos, decidir se Rekognition padrão basta ou se precisa de <strong>Custom Labels</strong> (próximo módulo).</p>`
  }
];

let labCurrent = 0;

function renderLab() {
  document.querySelectorAll('.lab-step').forEach((s, i) => {
    s.classList.toggle('active', i === labCurrent);
    s.classList.toggle('done', i < labCurrent);
  });
  const s = labSteps[labCurrent];
  document.getElementById('lab-content').innerHTML = `<h4>${s.title}</h4>${s.body}`;
  document.getElementById('lab-prev').disabled = labCurrent === 0;
  document.getElementById('lab-prev').style.opacity = labCurrent === 0 ? 0.4 : 1;
  document.getElementById('lab-next').textContent = labCurrent === labSteps.length - 1 ? '↺ Recomeçar' : 'Próximo passo →';
}

document.getElementById('lab-prev').addEventListener('click', () => {
  if (labCurrent > 0) {
    labCurrent--;
    renderLab();
  }
});
document.getElementById('lab-next').addEventListener('click', () => {
  if (labCurrent < labSteps.length - 1) {
    labCurrent++;
  } else {
    labCurrent = 0;
  }
  renderLab();
});
document.querySelectorAll('.lab-step').forEach((s, i) => {
  s.addEventListener('click', () => { labCurrent = i; renderLab(); });
});
renderLab();

// ============================================================
// MÓDULO 7: CUSTOM LABELS · interativo completo
// ============================================================
const CL = {
  // Each emoji has a "true" breed and a "difficulty" (some are intentionally ambiguous)
  // signature: [emoji, trueBreed, isAmbiguous]
  catalog: [
    // Persa: fluffy, flat-faced
    ['🦁', 'persa', false], ['🦁', 'persa', false], ['🦁', 'persa', false],
    ['😼', 'persa', false], ['😼', 'persa', false],
    ['😺', 'persa', true],
    // Siamês: pointy, slender
    ['🥷', 'siames', false], ['🥷', 'siames', false], ['🥷', 'siames', false],
    ['😻', 'siames', false], ['😻', 'siames', false],
    ['🐱', 'siames', true],
    // Maine Coon: big, fluffy, fierce
    ['🦌', 'maine', false], ['🦌', 'maine', false], ['🦌', 'maine', false],
    ['😸', 'maine', false], ['😸', 'maine', false],
    ['🐈‍⬛', 'maine', true]
  ],
  pool: [],
  buckets: { persa: [], siames: [], maine: [] },
  selected: null,
  step: 1,
  modelTrained: false,
  // Training state
  cfg: { epochs: 15, lr: 0.001, augment: true, pretrained: true, speed: 1 },
  trainHistory: [], // [{epoch, loss, trainAcc, valAcc}]
  trainTimer: null,
  trainPaused: false,
  // Evaluation
  testSet: [],
  predictions: [], // [{photo, predicted, truth, scores}]
  threshold: 50,
  // Live tracker (step 5)
  tracker: { total: 0, correct: 0, history: [] },
  currentInferred: null,
  breedNames: { persa: 'Persa', siames: 'Siamês', maine: 'Maine Coon' },
  breedEmojiHero: { persa: '🦁', siames: '🥷', maine: '🦌' }
};

// ----------- Build pool -----------
function clBuildPool() {
  CL.pool = [];
  CL.buckets = { persa: [], siames: [], maine: [] };
  CL.modelTrained = false;
  CL.trainHistory = [];
  CL.predictions = [];
  CL.testSet = [];
  CL.tracker = { total: 0, correct: 0, history: [] };
  let id = 0;
  CL.catalog.forEach(([em, breed, amb]) => {
    CL.pool.push({ id: id++, emoji: em, truth: breed, ambiguous: amb });
  });
  // shuffle
  CL.pool.sort(() => Math.random() - 0.5);
}

// ----------- Step navigation -----------
function clGoStep(n) {
  CL.step = n;
  document.querySelectorAll('.cl-step').forEach(s => {
    const sn = parseInt(s.dataset.step);
    s.classList.toggle('active', sn === n);
    s.classList.toggle('done', sn < n);
  });
  document.querySelectorAll('.cl-panel').forEach(p => {
    p.classList.toggle('active', parseInt(p.dataset.panel) === n);
  });
  // refreshes for some panels
  if (n === 2) clBuildManifest();
  if (n === 3) clResetTrainingUI();
  if (n === 4) clRenderConfusion();
  if (n === 5) clBuildTestPool();
}

document.querySelectorAll('.cl-step').forEach(s => {
  s.addEventListener('click', () => {
    const n = parseInt(s.dataset.step);
    // only allow going to steps already unlocked
    const totalLabeled = Object.values(CL.buckets).reduce((a, b) => a + b.length, 0);
    const minPerClass = Math.min(...Object.values(CL.buckets).map(b => b.length));
    if (n >= 3 && minPerClass < 3) return;
    if (n >= 4 && !CL.modelTrained) return;
    clGoStep(n);
  });
});

// ----------- Step 1: dataset -----------
function clRenderPool() {
  const pool = document.getElementById('cl-pool');
  pool.innerHTML = '';
  pool.classList.toggle('empty', CL.pool.length === 0);
  if (CL.pool.length === 0) return;
  CL.pool.forEach(p => {
    const el = document.createElement('div');
    el.className = 'cl-photo';
    if (CL.selected === p.id) el.classList.add('selected');
    if (p.ambiguous) el.classList.add('confused');
    el.dataset.id = p.id;
    el.draggable = true;
    el.textContent = p.emoji;
    el.title = p.ambiguous ? 'Foto ambígua — desafia o modelo!' : '';
    // click to select
    el.addEventListener('click', () => {
      CL.selected = CL.selected === p.id ? null : p.id;
      clRenderPool();
      document.querySelectorAll('.cl-bucket').forEach(b => {
        b.classList.toggle('target', CL.selected !== null);
      });
    });
    // drag
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', String(p.id));
      e.dataTransfer.effectAllowed = 'move';
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
    });
    pool.appendChild(el);
  });
}

function clRenderBuckets() {
  document.querySelectorAll('.cl-bucket').forEach(b => {
    const breed = b.dataset.breed;
    b.querySelector('.count').textContent = CL.buckets[breed].length;
    const drop = b.querySelector('.cl-drop');
    drop.innerHTML = '';
    CL.buckets[breed].forEach(p => {
      const m = document.createElement('div');
      m.className = 'cl-photo-mini';
      m.textContent = p.emoji;
      m.title = 'Click pra devolver pro pool';
      m.addEventListener('click', () => {
        // return to pool
        CL.buckets[breed] = CL.buckets[breed].filter(x => x.id !== p.id);
        CL.pool.unshift(p);
        clRenderPool();
        clRenderBuckets();
        clRenderStats();
      });
      drop.appendChild(m);
    });
  });
}

function clMoveToBucket(photoId, breed) {
  const idx = CL.pool.findIndex(p => p.id === photoId);
  if (idx === -1) return;
  const p = CL.pool[idx];
  CL.buckets[breed].push(p);
  CL.pool.splice(idx, 1);
  CL.selected = null;
  document.querySelectorAll('.cl-bucket').forEach(x => x.classList.remove('target', 'drop-over'));
  clRenderPool();
  clRenderBuckets();
  clRenderStats();
}

// drag-and-drop on buckets
document.querySelectorAll('.cl-bucket').forEach(b => {
  b.addEventListener('click', () => {
    if (CL.selected === null) return;
    clMoveToBucket(CL.selected, b.dataset.breed);
  });
  b.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    b.classList.add('drop-over');
  });
  b.addEventListener('dragleave', () => b.classList.remove('drop-over'));
  b.addEventListener('drop', e => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    b.classList.remove('drop-over');
    clMoveToBucket(id, b.dataset.breed);
  });
});

function clRenderStats() {
  const counts = {
    persa: CL.buckets.persa.length,
    siames: CL.buckets.siames.length,
    maine: CL.buckets.maine.length
  };
  const total = counts.persa + counts.siames + counts.maine;
  const totalCatalog = CL.catalog.length;

  document.getElementById('cl-stat-total').textContent = `${total} / ${totalCatalog}`;
  document.getElementById('cl-stat-total-bar').style.width = (total / totalCatalog * 100) + '%';

  ['persa', 'siames', 'maine'].forEach(b => {
    document.getElementById(`cl-stat-${b}`).textContent = counts[b];
    const max = Math.max(1, ...Object.values(counts));
    document.getElementById(`cl-stat-${b}-bar`).style.width = (counts[b] / max * 100) + '%';
  });

  // Balance
  const min = Math.min(...Object.values(counts));
  const max = Math.max(...Object.values(counts));
  const balance = max === 0 ? 0 : min / max;
  const balanceEl = document.getElementById('cl-balance');
  const balanceTitle = document.getElementById('cl-balance-title');
  const balanceMsg = document.getElementById('cl-balance-msg');
  balanceEl.classList.remove('warn', 'ok');
  if (total === 0) {
    balanceTitle.textContent = 'Balanceamento: aguardando dados';
    balanceMsg.textContent = 'Datasets desbalanceados ensinam a IA a "chutar a maioria". Mantenha os 3 baldes parecidos.';
  } else if (balance >= 0.7) {
    balanceEl.classList.add('ok');
    balanceTitle.textContent = `Balanceamento: ${Math.round(balance * 100)}% (ótimo)`;
    balanceMsg.textContent = 'Dataset bem distribuído entre as classes. Modelo vai treinar melhor.';
  } else if (balance >= 0.4) {
    balanceEl.classList.add('warn');
    balanceTitle.textContent = `Balanceamento: ${Math.round(balance * 100)}% (médio)`;
    balanceMsg.textContent = 'Tá ficando desbalanceado. Considere rotular mais da classe minoritária.';
  } else {
    balanceEl.classList.add('warn');
    balanceTitle.textContent = `Balanceamento: ${Math.round(balance * 100)}% (ruim)`;
    balanceMsg.textContent = 'Muito desbalanceado! O modelo vai aprender a só chutar a classe maior. Adicione mais das menores.';
  }

  // Quality checks
  const minOk = min >= 3;
  const balOk = balance >= 0.7 && total > 0;
  const sizeOk = total >= 9;
  const setBadge = (id, ok, txtOk, txtBad) => {
    const el = document.getElementById(id);
    el.className = 'badge ' + (ok ? 'ok' : 'bad');
    el.textContent = ok ? `✓ ${txtOk}` : `✗ ${txtBad}`;
  };
  if (total === 0) {
    ['cl-q-min', 'cl-q-bal', 'cl-q-size'].forEach(id => {
      const el = document.getElementById(id);
      el.className = 'badge';
      el.textContent = '⏳';
    });
  } else {
    setBadge('cl-q-min', minOk, 'OK', `${min} < 3`);
    setBadge('cl-q-bal', balOk, `${Math.round(balance * 100)}%`, `${Math.round(balance * 100)}% < 70%`);
    setBadge('cl-q-size', sizeOk, `${total}`, `${total} < 9`);
  }

  // Enable next button
  document.getElementById('cl-go-step2').disabled = !minOk;
  document.getElementById('cl-sum-imgs').textContent = `${total}`;
}

// ----------- Pool action buttons -----------
document.getElementById('cl-auto-label').addEventListener('click', () => {
  // moves all remaining pool items to their TRUE bucket (cheating, but useful for demo)
  while (CL.pool.length > 0) {
    const p = CL.pool[0];
    clMoveToBucket(p.id, p.truth);
  }
});
document.getElementById('cl-shuffle').addEventListener('click', () => {
  CL.pool.sort(() => Math.random() - 0.5);
  clRenderPool();
});
document.getElementById('cl-reset-pool').addEventListener('click', () => {
  // return everything to the pool
  Object.values(CL.buckets).flat().forEach(p => CL.pool.push(p));
  CL.buckets = { persa: [], siames: [], maine: [] };
  CL.pool.sort(() => Math.random() - 0.5);
  clRenderPool();
  clRenderBuckets();
  clRenderStats();
});

document.getElementById('cl-go-step2').addEventListener('click', () => clGoStep(2));

// ----------- Step 2: config -----------
function clBuildManifest() {
  const lrMap = [0.0001, 0.0005, 0.001, 0.005, 0.01];
  CL.cfg.lr = lrMap[parseInt(document.getElementById('cfg-lr').value)];
  CL.cfg.epochs = parseInt(document.getElementById('cfg-epochs').value);
  CL.cfg.augment = document.getElementById('cfg-augment').checked;
  CL.cfg.pretrained = document.getElementById('cfg-pretrained').checked;

  const labels = [];
  Object.keys(CL.buckets).forEach(breed => {
    CL.buckets[breed].forEach((p, i) => {
      labels.push({
        "source-ref": `s3://balaio-cat-breeds/v1/${breed}/img_${p.id}.jpg`,
        "label": breed
      });
    });
  });
  const sample = labels.slice(0, 5);
  const manifest = {
    project: "balaio-cat-breeds",
    classes: ["persa", "siames", "maine"],
    total_images: labels.length,
    train_test_split: { train: 0.8, test: 0.2 },
    hyperparameters: {
      epochs: CL.cfg.epochs,
      learning_rate: CL.cfg.lr,
      data_augmentation: CL.cfg.augment,
      transfer_learning: CL.cfg.pretrained,
      base_model: CL.cfg.pretrained ? "ResNet-50 (ImageNet)" : "from-scratch"
    },
    samples: sample
  };
  document.getElementById('cl-manifest').textContent = JSON.stringify(manifest, null, 2);
  // cost
  const minutes = 20 + CL.cfg.epochs * 1.5;
  document.getElementById('cost-train').textContent = `~$${(minutes / 60).toFixed(2)} (${Math.round(minutes)}min × $1 / hora)`;
}

document.getElementById('cfg-epochs').addEventListener('input', e => {
  document.getElementById('cfg-epochs-v').textContent = e.target.value;
  clBuildManifest();
});
document.getElementById('cfg-lr').addEventListener('input', e => {
  const lrMap = [0.0001, 0.0005, 0.001, 0.005, 0.01];
  const v = lrMap[parseInt(e.target.value)];
  document.getElementById('cfg-lr-v').textContent = v.toString().replace('.', ',');
  clBuildManifest();
});
document.getElementById('cfg-augment').addEventListener('change', clBuildManifest);
document.getElementById('cfg-pretrained').addEventListener('change', clBuildManifest);

document.getElementById('cl-back-step1').addEventListener('click', () => clGoStep(1));
document.getElementById('cl-go-step3').addEventListener('click', () => clGoStep(3));

// ----------- Step 3: training -----------
function clResetTrainingUI() {
  CL.trainHistory = [];
  CL.modelTrained = false;
  CL.trainPaused = false;
  if (CL.trainTimer) {
    clearInterval(CL.trainTimer);
    CL.trainTimer = null;
  }
  document.getElementById('cl-loss-line').setAttribute('points', '');
  document.getElementById('cl-acc-line').setAttribute('points', '');
  document.getElementById('live-epoch').textContent = `0 / ${CL.cfg.epochs}`;
  document.getElementById('live-loss').textContent = '—';
  document.getElementById('live-train-acc').textContent = '—';
  document.getElementById('live-val-acc').textContent = '—';
  document.getElementById('live-status').textContent = 'Aguardando…';
  document.getElementById('cl-train-log').innerHTML = '';
  document.getElementById('cl-go-step4').disabled = true;
  document.getElementById('cl-train-start').disabled = false;
  document.getElementById('cl-train-pause').disabled = true;
  document.querySelectorAll('.cl-out').forEach(o => o.classList.remove('training'));
}

function clAppendLog(line, cls) {
  const log = document.getElementById('cl-train-log');
  const div = document.createElement('div');
  div.className = 'cl-log-line ' + (cls || '');
  div.textContent = line;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function clUpdateLossCurve() {
  if (CL.trainHistory.length === 0) return;
  const w = 420; // x-range from 40 to 460
  const lossPts = [];
  const accPts = [];
  CL.trainHistory.forEach((h, i) => {
    const x = 40 + (i / Math.max(1, CL.cfg.epochs - 1)) * w;
    const yLoss = 200 - h.loss * 180;
    const yAcc = 200 - h.valAcc * 180;
    lossPts.push(`${x.toFixed(1)},${yLoss.toFixed(1)}`);
    accPts.push(`${x.toFixed(1)},${yAcc.toFixed(1)}`);
  });
  document.getElementById('cl-loss-line').setAttribute('points', lossPts.join(' '));
  document.getElementById('cl-acc-line').setAttribute('points', accPts.join(' '));
}

function clRunOneEpoch(epoch) {
  // Simulate loss / accuracy as a function of:
  // - epoch (improves with more)
  // - augment (smooths overfitting)
  // - lr (too high → unstable)
  // - data quality (balance, total)
  const counts = Object.values(CL.buckets).map(b => b.length);
  const total = counts.reduce((a, b) => a + b, 0);
  const balance = Math.min(...counts) / Math.max(...counts);
  const dataQuality = Math.min(1, (total / 18) * 0.5 + balance * 0.5);

  // base learning curve
  const progress = epoch / CL.cfg.epochs;
  let baseAcc = 0.33 + dataQuality * 0.65 * (1 - Math.exp(-3.5 * progress));
  let baseLoss = 1.1 * Math.exp(-2.8 * progress) + (1 - dataQuality) * 0.2;

  // lr penalty
  const lrPenalty = CL.cfg.lr >= 0.01 ? 0.15 : (CL.cfg.lr <= 0.0001 ? 0.08 : 0);
  baseLoss += lrPenalty * (Math.random() * 0.5 + 0.5);

  // pretrained boost
  if (CL.cfg.pretrained) {
    baseAcc += 0.08;
    baseLoss -= 0.05;
  }

  // augment: lowers val/train gap (less overfitting)
  const overfit = CL.cfg.augment ? 0.02 : 0.08 + Math.max(0, progress - 0.5) * 0.15;
  const trainAcc = Math.min(0.99, baseAcc + overfit + Math.random() * 0.02 - 0.01);
  const valAcc = Math.max(0.30, Math.min(0.97, baseAcc + Math.random() * 0.02 - 0.01));
  const loss = Math.max(0.05, baseLoss + Math.random() * 0.04 - 0.02);

  return { epoch, loss, trainAcc, valAcc };
}

function clStartTraining() {
  CL.trainHistory = [];
  CL.trainPaused = false;
  document.getElementById('cl-train-start').disabled = true;
  document.getElementById('cl-train-pause').disabled = false;
  document.getElementById('cl-train-pause').textContent = '⏸️ Pausar';
  document.querySelectorAll('.cl-out').forEach(o => o.classList.add('training'));
  document.getElementById('live-status').textContent = '🔥 Treinando…';

  clAppendLog(`[INFO] starting training: ${CL.cfg.epochs} epochs, lr=${CL.cfg.lr}, augment=${CL.cfg.augment}, pretrained=${CL.cfg.pretrained}`);
  if (CL.cfg.lr >= 0.01) clAppendLog('[WARN] learning rate alto: pode haver instabilidade', 'warn');
  if (!CL.cfg.augment) clAppendLog('[WARN] data augmentation desligada: maior risco de overfitting', 'warn');

  let i = CL.trainHistory.length;
  const tick = () => {
    if (CL.trainPaused) return;
    if (i >= CL.cfg.epochs) {
      clearInterval(CL.trainTimer);
      CL.trainTimer = null;
      CL.modelTrained = true;
      document.getElementById('live-status').textContent = '✅ Concluído';
      document.getElementById('cl-train-pause').disabled = true;
      document.querySelectorAll('.cl-out').forEach(o => o.classList.remove('training'));
      const final = CL.trainHistory[CL.trainHistory.length - 1];
      clAppendLog(`[INFO] training done. final val_acc=${(final.valAcc * 100).toFixed(1)}% loss=${final.loss.toFixed(3)}`, 'ok');
      // Mark step 3 as done in stepper
      document.querySelectorAll('.cl-step').forEach(s => {
        if (parseInt(s.dataset.step) === 3) s.classList.add('done');
      });
      document.getElementById('cl-go-step4').disabled = false;
      // pre-compute predictions for step 4
      clComputeEvaluation();
      return;
    }
    const h = clRunOneEpoch(i + 1);
    CL.trainHistory.push(h);
    i++;
    document.getElementById('live-epoch').textContent = `${i} / ${CL.cfg.epochs}`;
    document.getElementById('live-loss').textContent = h.loss.toFixed(3);
    document.getElementById('live-train-acc').textContent = (h.trainAcc * 100).toFixed(1) + '%';
    document.getElementById('live-val-acc').textContent = (h.valAcc * 100).toFixed(1) + '%';
    clAppendLog(`epoch ${i.toString().padStart(2, '0')}/${CL.cfg.epochs} · loss=${h.loss.toFixed(3)} · train_acc=${(h.trainAcc * 100).toFixed(1)}% · val_acc=${(h.valAcc * 100).toFixed(1)}%`);
    clUpdateLossCurve();
  };
  CL.trainTimer = setInterval(tick, 350 / CL.cfg.speed);
}

document.getElementById('cl-train-start').addEventListener('click', () => {
  if (CL.trainHistory.length > 0 && !CL.modelTrained) {
    // resume
    CL.trainPaused = false;
    document.getElementById('cl-train-pause').disabled = false;
    document.getElementById('cl-train-pause').textContent = '⏸️ Pausar';
    return;
  }
  clResetTrainingUI();
  clStartTraining();
});

document.getElementById('cl-train-pause').addEventListener('click', () => {
  CL.trainPaused = !CL.trainPaused;
  document.getElementById('cl-train-pause').textContent = CL.trainPaused ? '▶️ Retomar' : '⏸️ Pausar';
  document.getElementById('live-status').textContent = CL.trainPaused ? '⏸️ Pausado' : '🔥 Treinando…';
});

document.getElementById('cl-train-faster').addEventListener('click', () => {
  CL.cfg.speed = CL.cfg.speed === 1 ? 2 : (CL.cfg.speed === 2 ? 4 : 1);
  document.getElementById('cl-train-faster').textContent = `⚡ ${CL.cfg.speed}× velocidade`;
  if (CL.trainTimer) {
    clearInterval(CL.trainTimer);
    if (!CL.modelTrained && CL.trainHistory.length < CL.cfg.epochs) {
      // restart timer at new speed (continues from current i)
      let i = CL.trainHistory.length;
      const tick = () => {
        if (CL.trainPaused) return;
        if (i >= CL.cfg.epochs) {
          clearInterval(CL.trainTimer);
          CL.trainTimer = null;
          CL.modelTrained = true;
          document.getElementById('live-status').textContent = '✅ Concluído';
          document.getElementById('cl-train-pause').disabled = true;
          document.querySelectorAll('.cl-out').forEach(o => o.classList.remove('training'));
          document.getElementById('cl-go-step4').disabled = false;
          document.querySelectorAll('.cl-step').forEach(s => {
            if (parseInt(s.dataset.step) === 3) s.classList.add('done');
          });
          clComputeEvaluation();
          return;
        }
        const h = clRunOneEpoch(i + 1);
        CL.trainHistory.push(h);
        i++;
        document.getElementById('live-epoch').textContent = `${i} / ${CL.cfg.epochs}`;
        document.getElementById('live-loss').textContent = h.loss.toFixed(3);
        document.getElementById('live-train-acc').textContent = (h.trainAcc * 100).toFixed(1) + '%';
        document.getElementById('live-val-acc').textContent = (h.valAcc * 100).toFixed(1) + '%';
        clAppendLog(`epoch ${i.toString().padStart(2, '0')}/${CL.cfg.epochs} · loss=${h.loss.toFixed(3)} · train_acc=${(h.trainAcc * 100).toFixed(1)}% · val_acc=${(h.valAcc * 100).toFixed(1)}%`);
        clUpdateLossCurve();
      };
      CL.trainTimer = setInterval(tick, 350 / CL.cfg.speed);
    }
  }
});

document.getElementById('cl-back-step2').addEventListener('click', () => clGoStep(2));
document.getElementById('cl-go-step4').addEventListener('click', () => clGoStep(4));

// ----------- Step 4: evaluation -----------
function clScorePhoto(photo) {
  // Use what was labeled to predict, similar to a memorized model
  // also influenced by training quality (last valAcc)
  const counts = { persa: 0, siames: 0, maine: 0 };
  const totals = { persa: 0, siames: 0, maine: 0 };
  Object.keys(CL.buckets).forEach(b => {
    CL.buckets[b].forEach(p => {
      totals[b]++;
      if (p.emoji === photo.emoji) counts[b]++;
    });
  });
  const finalValAcc = CL.trainHistory.length > 0
    ? CL.trainHistory[CL.trainHistory.length - 1].valAcc
    : 0.7;

  // scores: how strongly each class "matches" this emoji
  const scores = {};
  Object.keys(counts).forEach(b => {
    const exact = (counts[b] + 0.1) / (totals[b] + 1);
    scores[b] = exact;
  });
  // ambiguous photos get noise proportional to (1 - finalValAcc)
  if (photo.ambiguous) {
    Object.keys(scores).forEach(b => {
      scores[b] += Math.random() * (1 - finalValAcc) * 0.4;
    });
  } else {
    // small noise
    Object.keys(scores).forEach(b => {
      scores[b] += Math.random() * (1 - finalValAcc) * 0.15;
    });
  }
  // softmax-ish normalization
  const exp = {};
  let sum = 0;
  Object.keys(scores).forEach(b => {
    exp[b] = Math.exp(scores[b] * 4);
    sum += exp[b];
  });
  const probs = {};
  Object.keys(exp).forEach(b => probs[b] = exp[b] / sum);
  return probs;
}

function clComputeEvaluation() {
  CL.predictions = [];
  // Test set: take everything that's not in buckets (the "unseen") + some ambiguous duplicates
  const allEmojis = CL.catalog.map(([em, breed, amb]) => ({ emoji: em, truth: breed, ambiguous: amb }));
  // Build test set: random sample of 12 photos
  const shuffled = [...allEmojis].sort(() => Math.random() - 0.5);
  CL.testSet = shuffled.slice(0, 12);
  // run predictions
  CL.testSet.forEach(p => {
    const scores = clScorePhoto(p);
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    CL.predictions.push({
      photo: p,
      predicted: sorted[0][0],
      confidence: sorted[0][1],
      scores
    });
  });
}

function clRenderConfusion() {
  if (CL.predictions.length === 0) clComputeEvaluation();
  const breeds = ['persa', 'siames', 'maine'];
  const dotMap = { persa: 'persa', siames: 'siames', maine: 'maine' };
  // Filter by threshold
  const filtered = CL.predictions.filter(p => p.confidence * 100 >= CL.threshold);

  // confusion[true][pred] = count
  const cm = {};
  breeds.forEach(t => { cm[t] = {}; breeds.forEach(p => cm[t][p] = 0); });
  filtered.forEach(p => {
    cm[p.photo.truth][p.predicted]++;
  });

  // Build grid
  const grid = document.getElementById('cl-confusion');
  grid.innerHTML = '';
  // top-left axis
  const axis = document.createElement('div');
  axis.className = 'cf-axis';
  axis.innerHTML = '↓ Verdade<br>→ Predição';
  grid.appendChild(axis);
  // column headers
  breeds.forEach(b => {
    const h = document.createElement('div');
    h.className = 'cf-header col';
    h.innerHTML = `<span class="dot ${b}" style="background:${b === 'persa' ? '#FF6B35' : b === 'siames' ? '#8A6FB1' : '#6B8E23'}"></span><span>${CL.breedNames[b]}</span>`;
    grid.appendChild(h);
  });
  // rows
  breeds.forEach(t => {
    const rh = document.createElement('div');
    rh.className = 'cf-header row';
    rh.innerHTML = `<span class="dot ${t}" style="background:${t === 'persa' ? '#FF6B35' : t === 'siames' ? '#8A6FB1' : '#6B8E23'}"></span><span>${CL.breedNames[t]}</span>`;
    grid.appendChild(rh);
    const rowTotal = breeds.reduce((a, b) => a + cm[t][b], 0);
    breeds.forEach(p => {
      const cell = document.createElement('div');
      cell.className = 'cf-cell' + (t === p ? ' diag' : '');
      const v = cm[t][p];
      const pct = rowTotal === 0 ? 0 : (v / rowTotal);
      const isDiagHigh = t === p && pct >= 0.5;
      if (isDiagHigh) cell.classList.add('high');
      cell.innerHTML = `<div class="heat" style="opacity:${Math.min(0.85, pct * 0.9 + (v > 0 ? 0.1 : 0))}"></div><div class="v">${v}</div><div class="pct">${rowTotal === 0 ? '—' : (pct * 100).toFixed(0) + '%'}</div>`;
      grid.appendChild(cell);
    });
  });

  // Metrics
  const total = filtered.length;
  const correct = filtered.filter(p => p.photo.truth === p.predicted).length;
  const acc = total === 0 ? 0 : correct / total;

  const precPerClass = {};
  const recPerClass = {};
  breeds.forEach(b => {
    const tp = cm[b][b];
    const fp = breeds.filter(t => t !== b).reduce((a, t) => a + cm[t][b], 0);
    const fn = breeds.filter(p => p !== b).reduce((a, p) => a + cm[b][p], 0);
    precPerClass[b] = (tp + fp) === 0 ? 0 : tp / (tp + fp);
    recPerClass[b] = (tp + fn) === 0 ? 0 : tp / (tp + fn);
  });
  const meanPrec = (precPerClass.persa + precPerClass.siames + precPerClass.maine) / 3;
  const meanRec = (recPerClass.persa + recPerClass.siames + recPerClass.maine) / 3;
  const f1 = (meanPrec + meanRec) === 0 ? 0 : 2 * meanPrec * meanRec / (meanPrec + meanRec);

  document.getElementById('m-acc').textContent = total === 0 ? '—' : (acc * 100).toFixed(0) + '%';
  document.getElementById('m-prec').textContent = total === 0 ? '—' : (meanPrec * 100).toFixed(0) + '%';
  document.getElementById('m-rec').textContent = total === 0 ? '—' : (meanRec * 100).toFixed(0) + '%';
  document.getElementById('m-f1').textContent = total === 0 ? '—' : f1.toFixed(2);

  breeds.forEach(b => {
    document.getElementById(`cw-${b}-p`).textContent = total === 0 ? '—' : (precPerClass[b] * 100).toFixed(0) + '%';
    document.getElementById(`cw-${b}-r`).textContent = total === 0 ? '—' : (recPerClass[b] * 100).toFixed(0) + '%';
  });
}

document.getElementById('thr-slider').addEventListener('input', e => {
  CL.threshold = parseInt(e.target.value);
  document.getElementById('thr-v').textContent = CL.threshold + '%';
  clRenderConfusion();
});

document.getElementById('cl-back-step3').addEventListener('click', () => clGoStep(3));
document.getElementById('cl-go-step5').addEventListener('click', () => clGoStep(5));

// ----------- Step 5: deploy / playground -----------
function clBuildTestPool() {
  // Use test set + a few more random ones. These photos are "unseen" by the model
  const allEmojis = [];
  const seen = new Set();
  CL.catalog.forEach(([em, breed, amb]) => {
    const key = em + breed;
    if (!seen.has(key)) {
      allEmojis.push({ emoji: em, truth: breed, ambiguous: amb });
      seen.add(key);
    }
  });
  // shuffle and limit
  const pool = allEmojis.sort(() => Math.random() - 0.5).slice(0, 12);
  const container = document.getElementById('cl-test-pool');
  container.innerHTML = '';
  pool.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'cl-photo';
    el.draggable = true;
    el.textContent = p.emoji;
    el.dataset.idx = i;
    if (p.ambiguous) el.classList.add('confused');
    el.addEventListener('click', () => clRunInference(p));
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('application/json', JSON.stringify(p));
      e.dataTransfer.effectAllowed = 'copy';
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
    container.appendChild(el);
  });
}

function clRunInference(photo) {
  CL.currentInferred = photo;
  const camera = document.querySelector('.cl-camera-frame');
  const cameraEmoji = document.getElementById('cl-camera-emoji');
  const cameraHint = document.getElementById('cl-camera-hint');
  cameraEmoji.textContent = photo.emoji;
  camera.classList.add('has-photo', 'scanning');
  cameraHint.textContent = '🔄 Inferindo…';

  // Reset prediction bars
  ['persa', 'siames', 'maine'].forEach(b => {
    document.getElementById(`pred-${b}`).style.width = '0%';
    document.getElementById(`pred-${b}-v`).textContent = '0%';
  });
  document.getElementById('pred-label').textContent = '🔄 Processando…';
  document.getElementById('pred-msg').textContent = `Chamando DetectCustomLabels com a foto ${photo.emoji}`;
  document.getElementById('cl-pred-verdict').className = 'cl-pred-verdict';

  // Simulated network delay
  setTimeout(() => {
    const scores = clScorePhoto(photo);
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const winner = sorted[0][0];
    const correct = winner === photo.truth;

    // Update bars
    ['persa', 'siames', 'maine'].forEach(b => {
      document.getElementById(`pred-${b}`).style.width = (scores[b] * 100) + '%';
      document.getElementById(`pred-${b}-v`).textContent = (scores[b] * 100).toFixed(0) + '%';
    });
    document.querySelectorAll('.cl-pred-bar-row').forEach(r => {
      r.classList.toggle('winner', r.dataset.pred === winner);
    });

    // Verdict
    const verdict = document.getElementById('cl-pred-verdict');
    verdict.className = 'cl-pred-verdict ' + (correct ? 'correct' : 'wrong');
    verdict.querySelector('.ic').textContent = correct ? '✅' : '❌';
    document.getElementById('pred-label').textContent = correct
      ? `${CL.breedNames[winner]} (acertou!)`
      : `${CL.breedNames[winner]} (errou)`;
    document.getElementById('pred-msg').textContent = correct
      ? `Confiança ${(scores[winner] * 100).toFixed(0)}% · era mesmo ${CL.breedNames[photo.truth]}.`
      : `Modelo achou ${CL.breedNames[winner]}, mas era ${CL.breedNames[photo.truth]}. ${photo.ambiguous ? 'Foto ambígua, modelo se confundiu.' : 'Pode precisar de mais dados.'}`;

    camera.classList.remove('scanning');
    cameraHint.textContent = correct ? '✅ Acertou! Tenta outra' : '❌ Errou. Tenta outra';

    // Track
    CL.tracker.total++;
    if (correct) CL.tracker.correct++;
    CL.tracker.history.unshift({
      emoji: photo.emoji,
      correct,
      predicted: winner,
      truth: photo.truth
    });
    if (CL.tracker.history.length > 10) CL.tracker.history.pop();
    clUpdateTracker();
  }, 600);
}

function clUpdateTracker() {
  document.getElementById('trk-total').textContent = CL.tracker.total;
  document.getElementById('trk-correct').textContent = CL.tracker.correct;
  document.getElementById('trk-wrong').textContent = CL.tracker.total - CL.tracker.correct;
  const acc = CL.tracker.total === 0 ? 0 : CL.tracker.correct / CL.tracker.total;
  document.getElementById('trk-acc').textContent = CL.tracker.total === 0 ? '—' : (acc * 100).toFixed(0) + '%';

  const hist = document.getElementById('cl-history');
  hist.innerHTML = '';
  CL.tracker.history.forEach(h => {
    const cell = document.createElement('div');
    cell.className = 'cl-history-cell ' + (h.correct ? 'correct' : 'wrong');
    cell.textContent = h.emoji;
    cell.title = `Predito: ${CL.breedNames[h.predicted]} · Verdade: ${CL.breedNames[h.truth]}`;
    hist.appendChild(cell);
  });
}

// Camera drag-and-drop
const cameraFrame = document.querySelector('.cl-camera-frame');
cameraFrame.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  cameraFrame.classList.add('dragging-over');
});
cameraFrame.addEventListener('dragleave', () => cameraFrame.classList.remove('dragging-over'));
cameraFrame.addEventListener('drop', e => {
  e.preventDefault();
  cameraFrame.classList.remove('dragging-over');
  try {
    const photo = JSON.parse(e.dataTransfer.getData('application/json'));
    clRunInference(photo);
  } catch (err) {}
});

document.getElementById('cl-back-step4').addEventListener('click', () => clGoStep(4));
document.getElementById('cl-restart-all').addEventListener('click', () => {
  if (CL.trainTimer) clearInterval(CL.trainTimer);
  clBuildPool();
  clRenderPool();
  clRenderBuckets();
  clRenderStats();
  clGoStep(1);
});

// ----------- INIT -----------
clBuildPool();
clRenderPool();
clRenderBuckets();
clRenderStats();

// ============================================================
// MÓDULO 8: NLP PIPELINE
// ============================================================
const nlpSentence = "A Maria comprou 3 ração na PetShop do Rio.";

const nlpStageData = {
  raw: {
    title: "📝 Texto cru",
    desc: "A frase original, do jeito que veio do usuário. Ainda sem nada de processamento.",
    render: () => `<div style="font-size: 17px;">"${nlpSentence}"</div>
      <div style="margin-top: 10px; font-size: 11px; color: rgba(255,249,236,0.55); font-family: monospace;">${nlpSentence.length} caracteres · 1 string</div>`
  },
  token: {
    title: "✂️ Tokenização",
    desc: "Quebrar o texto em <strong>tokens</strong>: palavras, números, pontuação. É o primeiro passo de quase todo pipeline NLP.",
    render: () => {
      const tokens = ["A", "Maria", "comprou", "3", "ração", "na", "PetShop", "do", "Rio", "."];
      return tokens.map(t => `<span class="nlp-token">${t}</span>`).join(' ');
    }
  },
  lemma: {
    title: "🧹 Lematização",
    desc: "Reduzir cada palavra à sua forma <strong>de dicionário</strong> (lemma). \"comprou\" → \"comprar\", \"melhores\" → \"bom\". Útil pra busca, agrupamento.",
    render: () => {
      const pairs = [
        ["A", "a"], ["Maria", "maria"], ["comprou", "comprar"],
        ["3", "3"], ["ração", "ração"], ["na", "em+a"],
        ["PetShop", "petshop"], ["do", "de+o"], ["Rio", "rio"], [".", "."]
      ];
      return pairs.map(([orig, l]) =>
        `<span class="nlp-token">${orig}<br><small style="font-size:10px;color:#FF6B35">→ ${l}</small></span>`
      ).join(' ');
    }
  },
  pos: {
    title: "🏷️ POS tagging · Part-of-Speech",
    desc: "Cada token recebe sua <strong>classe gramatical</strong>: substantivo, verbo, adjetivo. Ajuda a desambiguar palavras polissêmicas.",
    render: () => {
      const tagged = [
        ["A", "DET"], ["Maria", "PROPN"], ["comprou", "VERB"],
        ["3", "NUM"], ["ração", "NOUN"], ["na", "ADP"],
        ["PetShop", "PROPN"], ["do", "ADP"], ["Rio", "PROPN"], [".", "PUNCT"]
      ];
      return tagged.map(([w, t]) =>
        `<span class="nlp-token pos">${w}<small>${t}</small></span>`
      ).join(' ');
    }
  },
  ner: {
    title: "🔍 NER · Named Entity Recognition",
    desc: "Detectar e classificar <strong>entidades nomeadas</strong>: pessoa, lugar, organização, data, dinheiro. Crítico pra extrair info de docs.",
    render: () => {
      const tagged = [
        ["A", null], ["Maria", "PER"], ["comprou", null],
        ["3", null], ["ração", null], ["na", null],
        ["PetShop", "ORG"], ["do", null], ["Rio", "LOC"], [".", null]
      ];
      return tagged.map(([w, t]) => {
        if (!t) return `<span class="nlp-token">${w}</span>`;
        return `<span class="nlp-token ner-${t.toLowerCase()}">${w}<small style="margin-left:4px;font-size:9.5px;">${t}</small></span>`;
      }).join(' ') + `
        <div style="margin-top: 12px; font-size: 12.5px; opacity: 0.85;">
          <span class="nlp-token ner-per" style="font-size:11px;padding:2px 6px;">PER</span> Pessoa
          &nbsp;<span class="nlp-token ner-org" style="font-size:11px;padding:2px 6px;">ORG</span> Organização
          &nbsp;<span class="nlp-token ner-loc" style="font-size:11px;padding:2px 6px;">LOC</span> Local
        </div>`;
    }
  },
  embed: {
    title: "📐 Embedding",
    desc: "Cada token (ou a frase inteira) vira um <strong>vetor numérico</strong>. É o que entra em qualquer modelo de DL: LLM, classificador, busca semântica.",
    render: () => {
      // generate fake embeddings
      const tokens = ["A", "Maria", "comprou", "3", "ração", "na", "PetShop", "do", "Rio", "."];
      const dim = 6;
      return tokens.map(t => {
        const vec = Array.from({ length: dim }, () => (Math.random() * 2 - 1).toFixed(2));
        return `<div style="margin-bottom: 4px;"><span class="nlp-token" style="min-width:80px;display:inline-block;">${t}</span> <span class="nlp-token embed">[${vec.join(', ')}]</span></div>`;
      }).join('') + `
        <div style="margin-top: 10px; font-size: 12px; opacity: 0.7;">
          ↑ aqui mostramos só 6 dimensões. Embeddings reais têm 384, 768, 1536 ou mais.
        </div>`;
    }
  }
};

document.querySelectorAll('.nlp-stage').forEach(s => {
  s.addEventListener('click', () => {
    document.querySelectorAll('.nlp-stage').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    const d = nlpStageData[s.dataset.nlp];
    document.getElementById('nlp-stage-title').textContent = d.title;
    document.getElementById('nlp-stage-desc').innerHTML = d.desc;
    document.getElementById('nlp-output-result').innerHTML = d.render();
  });
});
// initial
document.querySelector('.nlp-stage.active').click();

// ============================================================
// MÓDULO 9: ANÁLISE DE SENTIMENTO
// ============================================================
const sentLexicon = {
  // positivos
  'adorei': 2.5, 'amei': 2.5, 'amo': 2, 'adoro': 2, 'ótimo': 2, 'otimo': 2,
  'excelente': 2.5, 'perfeito': 2.5, 'maravilha': 2.5, 'maravilhoso': 2.5,
  'incrível': 2.2, 'incrivel': 2.2, 'lindo': 1.8, 'top': 1.8, 'gostei': 1.8,
  'recomendo': 1.5, 'super': 1.2, 'bom': 1.5, 'boa': 1.5, 'feliz': 2,
  'rápido': 1, 'rapido': 1, 'atencioso': 1.5, 'atenciosa': 1.5,
  'satisfeito': 2, 'satisfeita': 2, 'parabéns': 1.8, 'parabens': 1.8,
  'fantástico': 2.5, 'fantastico': 2.5, 'sensacional': 2.5,
  // negativos
  'péssimo': -2.5, 'pessimo': -2.5, 'ruim': -2, 'horrível': -2.5, 'horrivel': -2.5,
  'terrível': -2.5, 'terrivel': -2.5, 'odiei': -2.5, 'odeio': -2.2,
  'detestei': -2.5, 'lixo': -2.2, 'porcaria': -2, 'decepção': -2, 'decepcao': -2,
  'decepcionado': -2, 'decepcionante': -2, 'lento': -1.2, 'lerdo': -1.2,
  'caro': -0.8, 'quebrado': -1.8, 'quebrada': -1.8, 'estragado': -2, 'estragada': -2,
  'tosco': -1.5, 'frio': -0.5, 'piorou': -1.5, 'piora': -1.2,
  'reclamação': -1, 'reclamacao': -1, 'desastre': -2.5, 'fracasso': -2.5,
  'demorou': -0.8, 'atrasado': -1.2, 'errado': -1.5, 'errou': -1.2,
  'horror': -2.5, 'pior': -2
};

// Negation words
const sentNegations = ['não', 'nao', 'nunca', 'jamais', 'nem'];

function analyzeSentiment(text) {
  const lower = text.toLowerCase();
  // simple tokenization
  const rawTokens = lower.match(/[\wáàãâéêíóôõúç]+/gi) || [];

  let posSum = 0, negSum = 0;
  let wordCount = 0;
  const matched = [];
  let negate = false;

  for (let i = 0; i < rawTokens.length; i++) {
    const tok = rawTokens[i];
    if (sentNegations.includes(tok)) {
      negate = true;
      continue;
    }
    if (sentLexicon[tok] !== undefined) {
      let v = sentLexicon[tok];
      if (negate) v = -v;
      if (v > 0) posSum += v;
      else negSum += -v;
      matched.push({ tok, v: negate ? `¬${tok}` : tok, pos: v > 0 });
      negate = false;
    } else {
      wordCount++;
      // negation has limited window
      if (negate && wordCount > 2) negate = false;
    }
  }

  const total = posSum + negSum;
  let pos, neg, neu, mix;

  if (total < 0.3) {
    // mostly neutral
    neu = 0.85 + Math.random() * 0.05;
    pos = 0.05;
    neg = 0.05;
    mix = 0.05;
  } else {
    const rawPos = posSum / (posSum + negSum + 1);
    const rawNeg = negSum / (posSum + negSum + 1);
    const ratio = Math.min(posSum, negSum) / (Math.max(posSum, negSum) + 0.01);
    mix = posSum > 0.3 && negSum > 0.3 ? Math.min(0.7, ratio * 0.85) : 0.05;
    const remaining = 1 - mix;
    if (posSum > negSum * 1.4) {
      pos = remaining * 0.85;
      neg = remaining * 0.05;
      neu = remaining * 0.10;
    } else if (negSum > posSum * 1.4) {
      neg = remaining * 0.85;
      pos = remaining * 0.05;
      neu = remaining * 0.10;
    } else {
      pos = remaining * 0.4;
      neg = remaining * 0.4;
      neu = remaining * 0.2;
    }
  }

  const sum = pos + neg + neu + mix;
  pos /= sum; neg /= sum; neu /= sum; mix /= sum;

  // determine label
  const scores = { pos, neg, neu, mix };
  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

  return { pos, neg, neu, mix, winner, matched };
}

const sentExamples = [
  "Adorei o atendimento, super atencioso.",
  "Não recomendo, o produto chegou quebrado.",
  "O pedido chegou no prazo.",
  "Adorei o produto, mas o frete foi terrível."
];

const sentLabels = {
  pos: { name: 'POSITIVO', emoji: '😊', msg: 'O texto carrega tom positivo claro.' },
  neg: { name: 'NEGATIVO', emoji: '😠', msg: 'O texto expressa insatisfação ou crítica.' },
  neu: { name: 'NEUTRO', emoji: '😐', msg: 'Texto sem carga emocional clara, descritivo.' },
  mix: { name: 'MIXED', emoji: '🤷', msg: 'Tem cargas opostas no mesmo texto: elogio e crítica juntos.' }
};

function renderSentiment() {
  const text = document.getElementById('sent-input').value;
  const r = analyzeSentiment(text);
  document.getElementById('sent-pos').style.width = (r.pos * 100) + '%';
  document.getElementById('sent-neg').style.width = (r.neg * 100) + '%';
  document.getElementById('sent-neu').style.width = (r.neu * 100) + '%';
  document.getElementById('sent-mix').style.width = (r.mix * 100) + '%';
  document.getElementById('sent-pos-v').textContent = (r.pos * 100).toFixed(0) + '%';
  document.getElementById('sent-neg-v').textContent = (r.neg * 100).toFixed(0) + '%';
  document.getElementById('sent-neu-v').textContent = (r.neu * 100).toFixed(0) + '%';
  document.getElementById('sent-mix-v').textContent = (r.mix * 100).toFixed(0) + '%';

  const lbl = sentLabels[r.winner];
  document.getElementById('sent-emoji').textContent = lbl.emoji;
  document.getElementById('sent-label').textContent = lbl.name;
  document.getElementById('sent-msg').textContent = lbl.msg;

  // tokens
  const list = document.getElementById('sent-tok-list');
  if (r.matched.length === 0) {
    list.innerHTML = '<span style="color:var(--ink-soft); font-style:italic; font-size:12px;">Nenhuma palavra do dicionário foi reconhecida.</span>';
  } else {
    list.innerHTML = r.matched.map(m =>
      `<span class="sent-tok ${m.pos ? 'pos' : 'neg'}">${m.v} <small>${m.pos ? '+' : '−'}</small></span>`
    ).join('');
  }
}

document.getElementById('sent-input').addEventListener('input', renderSentiment);

document.querySelectorAll('#sent-examples .sent-ex-btn').forEach((b, i) => {
  b.addEventListener('click', () => {
    document.getElementById('sent-input').value = sentExamples[i];
    renderSentiment();
  });
});

renderSentiment();
