/* =========================================================
   AULA 16 · CONFIANÇA, EXPLICABILIDADE E SEGURANÇA EM IA
   - A2I flow (clicar nó → detalhe)
   - Explicabilidade (SHAP-like) com sliders
   - AWS AI Service Cards (deck de tabs)
   - Trade-off interpretabilidade × performance
   - APIs de moderação (picker → recomendação)
   - Generative AI Security Scoping Matrix (5 escopos)
   - Linhagem (citações que se highlight ao clicar)
   - Checklist de engenharia de dados segura + termômetro
   ========================================================= */


/* ═══════════════════════════════════════
   1. A2I FLOW — clicar nó mostra detalhe
   ═══════════════════════════════════════ */
(function a2iFlow(){
  const NODES = {
    input: {
      title:'📸 Input — o gato chega',
      body:'A aplicação envia um dado pra ser classificado: foto, documento, áudio, transação. O A2I não interfere ainda — é o ponto de entrada normal do sistema.'
    },
    model: {
      title:'🤖 Modelo — Rekognition, SageMaker ou Bedrock',
      body:'O modelo processa a entrada e devolve uma predição com um <strong>score de confiança</strong>. Esse score é a chave: ele que vai decidir se a resposta é confiável o bastante pra ir direto pro usuário.'
    },
    confidence: {
      title:'📊 Decisão — confiança alta?',
      body:'Você define o <strong>threshold</strong> (por exemplo, 0.85). Acima do threshold = aprovado direto. Abaixo = entra na fila de revisão humana. Esse threshold é o parâmetro mais importante do A2I — calibre com cuidado.'
    },
    auto: {
      title:'✅ Aprova automático',
      body:'Resposta vai direto pro app. Latência baixa, custo zero de revisão. Use quando o modelo está muito confiante OU quando o erro é barato (ex.: recomendar um filme).'
    },
    human: {
      title:'🧑‍⚖️ Revisão humana — workforce',
      body:'O caso vai pra um pool humano que pode ser: <strong>seu time interno</strong> (Private Workforce), <strong>um vendor da AWS Marketplace</strong>, ou <strong>Mechanical Turk</strong>. O humano vê o caso, corrige se preciso e devolve a decisão.'
    },
    feedback: {
      title:'🔄 Feedback loop — fechando o ciclo',
      body:'A correção humana volta como <strong>dado rotulado de qualidade</strong>. Esses casos viram material pra retreino do modelo, que com o tempo precisa cada vez menos de revisão. É assim que o sistema aprende.'
    }
  };

  const flow = document.getElementById('a2i-flow');
  const detail = document.getElementById('a2i-detail');
  if(!flow || !detail) return;

  flow.querySelectorAll('.a2i-node').forEach(n => {
    n.addEventListener('click', () => {
      flow.querySelectorAll('.a2i-node').forEach(x => x.classList.remove('active'));
      n.classList.add('active');
      const data = NODES[n.dataset.node];
      if(data){
        detail.innerHTML = `
          <span class="dd-tag">A2I · ${n.dataset.node}</span>
          <h3>${data.title}</h3>
          <p>${data.body}</p>
        `;
      }
    });
  });
})();


/* ═══════════════════════════════════════
   2. SHAP-LIKE — explicabilidade interativa
   ═══════════════════════════════════════ */
(function shapViz(){
  const els = {
    age: document.getElementById('shap-age'),
    ageV: document.getElementById('shap-age-v'),
    social: document.getElementById('shap-social'),
    socialV: document.getElementById('shap-social-v'),
    health: document.getElementById('shap-health'),
    healthV: document.getElementById('shap-health-v'),
    color: document.getElementById('shap-color'),
    colorV: document.getElementById('shap-color-v'),
    vacBtns: document.querySelectorAll('.shap-toggle button'),
    vacV: document.getElementById('shap-vac-v'),
    prob: document.getElementById('shap-prob'),
    probLabel: document.getElementById('shap-prob-label'),
    bars: document.getElementById('shap-bars')
  };
  if(!els.age || !els.bars) return;

  const COLOR_LABELS = { white:'branco', orange:'laranja malhado', black:'preto', siamese:'siamês' };

  let vac = 1;

  function compute(){
    const age = parseInt(els.age.value);
    const social = parseInt(els.social.value);
    const health = parseInt(els.health.value);
    const color = els.color.value;

    // contribuições SHAP-like (linear didático)
    // base = 50%
    // idade: filhote (0-2) +12, jovem (3-7) +5, adulto (8-12) -3, idoso (13+) -15
    let cAge = 0;
    if(age <= 2) cAge = 12;
    else if(age <= 7) cAge = 5;
    else if(age <= 12) cAge = -3;
    else cAge = -15;

    // sociabilidade: cada ponto acima de 5 = +2, abaixo = -2
    const cSocial = (social - 5) * 2;

    // saúde: cada ponto acima de 5 = +1.8, abaixo = -2.5
    const cHealth = health >= 5 ? (health - 5) * 1.8 : (health - 5) * 2.5;

    // cor: viés histórico (didático): branco +6, malhado +3, siamês +5, preto -8 (mostra bias)
    const colorMap = { white:6, orange:3, siamese:5, black:-8 };
    const cColor = colorMap[color] || 0;

    // vacinado: sim +6, não -8
    const cVac = vac ? 6 : -8;

    const total = 50 + cAge + cSocial + cHealth + cColor + cVac;
    const pct = Math.max(2, Math.min(98, Math.round(total)));

    // labels
    els.ageV.textContent = age + ' ano' + (age === 1 ? '' : 's');
    els.socialV.textContent = social + '/10';
    els.healthV.textContent = health + '/10';
    els.colorV.textContent = COLOR_LABELS[color];
    els.vacV.textContent = vac ? 'Sim' : 'Não';

    els.prob.textContent = pct + '%';
    els.prob.style.color = pct >= 70 ? '#7FCB7F' : pct >= 40 ? 'var(--yellow)' : '#FF8B6B';
    els.probLabel.textContent = pct >= 70 ? 'alta probabilidade de adoção' :
                                pct >= 40 ? 'probabilidade moderada' :
                                'baixa probabilidade — necessita atenção';

    // bars
    const features = [
      { label:'Idade', value:cAge },
      { label:'Sociabilidade', value:cSocial },
      { label:'Saúde', value:cHealth },
      { label:'Cor', value:cColor },
      { label:'Vacinado', value:cVac }
    ];
    const max = Math.max(...features.map(f => Math.abs(f.value)), 1);

    els.bars.innerHTML = features.map(f => {
      const sign = f.value >= 0 ? 'pos' : 'neg';
      const widthPct = (Math.abs(f.value) / max) * 50; // metade pra cada lado do centro
      // posição da barra no track: cresce do centro pra direita (pos) ou esquerda (neg)
      const left = f.value >= 0 ? 50 : 50 - widthPct;
      const valStr = (f.value >= 0 ? '+' : '') + f.value.toFixed(1);
      return `
        <div class="shap-bar-row">
          <div class="shap-bar-label">${f.label}</div>
          <div class="shap-bar-track">
            <div class="shap-bar-fill ${sign}" style="left:${left}%;width:${widthPct}%"></div>
          </div>
          <div class="shap-bar-value ${sign}">${valStr}</div>
        </div>
      `;
    }).join('');
  }

  ['age','social','health','color'].forEach(k => {
    if(els[k]) els[k].addEventListener('input', compute);
  });
  els.vacBtns.forEach(b => {
    b.addEventListener('click', () => {
      els.vacBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      vac = parseInt(b.dataset.vac);
      compute();
    });
  });

  compute();
})();


/* ═══════════════════════════════════════
   3. AWS AI SERVICE CARDS DECK
   ═══════════════════════════════════════ */
(function serviceCards(){
  const CARDS = {
    rekognition: {
      name:'Amazon Rekognition',
      tag:'Computer Vision · Detecção e moderação',
      use:[
        'Detecção de objetos, cenas, atividades',
        'Detecção e análise facial (sem reconhecimento de identidade)',
        'Moderação de imagem e vídeo (nudez, violência)',
        'Texto em imagem (placas, legendas, OCR rápido)',
        'Comparação de faces para autenticação'
      ],
      limit:[
        'Acurácia varia com qualidade da imagem (resolução, ângulo, luz)',
        'Reconhecimento facial: testes de bias mostram variações por demografia',
        'Não substitui análise médica nem decisões legais',
        'Conteúdo borrado ou parcialmente visível pode passar batido na moderação',
        'Não recomendado para identificação em espaços públicos sem revisão humana'
      ]
    },
    textract: {
      name:'Amazon Textract',
      tag:'OCR avançado · documentos estruturados',
      use:[
        'Extração de texto, tabelas e formulários de PDFs e imagens',
        'Análise de documentos identificáveis (Analyze ID)',
        'Extração de queries específicas (Analyze Document Queries)',
        'Workflows de processamento de invoices, contratos, formulários',
        'Combina bem com A2I para validação humana de campos críticos'
      ],
      limit:[
        'Acurácia depende muito da qualidade da digitalização',
        'Manuscritos têm performance significativamente menor',
        'Idiomas cobertos são limitados (principalmente inglês, espanhol, francês, italiano, alemão, português)',
        'Não interpreta o conteúdo — apenas extrai. Pra entender, precisa de outro modelo',
        'Tabelas complexas com células mescladas ainda são desafiadoras'
      ]
    },
    transcribe: {
      name:'Amazon Transcribe',
      tag:'Speech-to-Text · transcrição de áudio',
      use:[
        'Transcrição de áudio em tempo real ou batch',
        'Diarização (separação por falante)',
        'Vocabulário customizado e modelos por domínio (Custom Language Models)',
        'Toxicity Detection direto na fala',
        'Redação automática de PII (CPF, telefone, número de cartão)'
      ],
      limit:[
        'Performance varia com sotaques, ruído de fundo e microfones de baixa qualidade',
        'Falantes simultâneos confundem a diarização',
        'Idiomas com menos dados de treino têm acurácia menor',
        'Não interpreta semântica — só transcreve',
        'Para conteúdo médico ou financeiro, use a versão especializada (Transcribe Medical, Call Analytics)'
      ]
    },
    comprehend: {
      name:'Amazon Comprehend',
      tag:'NLP gerenciado · sentimento, entidades, PII',
      use:[
        'Detecção de sentimento (positivo, negativo, neutro, misto)',
        'Extração de entidades (pessoa, lugar, organização, data)',
        'Detecção e redação de PII (DetectPiiEntities)',
        'Detecção de toxicidade em texto',
        'Classificação personalizada com Comprehend Custom'
      ],
      limit:[
        'Detecção de PII pode ter falsos positivos/negativos — não é 100%',
        'Modelos genéricos podem não pegar nuances de domínio (jurídico, médico)',
        'Sarcasmo e ironia confundem a análise de sentimento',
        'Línguas com menor cobertura têm performance reduzida',
        'Não substitui revisão humana em casos sensíveis (compliance, contratos)'
      ]
    },
    titan: {
      name:'Amazon Titan Text',
      tag:'Foundation Model · geração de texto',
      use:[
        'Geração e sumarização de texto',
        'Q&A de conhecimento geral',
        'Classificação e extração via prompt',
        'Embeddings (Titan Embeddings) para RAG',
        'Disponível com Provisioned Throughput pra produção'
      ],
      limit:[
        'Risco de alucinação — sempre valide outputs factuais',
        'Não-determinístico mesmo com temperature baixa',
        'Conhecimento limitado à data de treinamento',
        'Pode reproduzir vieses presentes nos dados de treino',
        'Use Bedrock Guardrails pra produção e Knowledge Bases pra reduzir alucinação'
      ]
    }
  };

  const tabs = document.querySelectorAll('.card-tab');
  const card = document.getElementById('service-card');
  if(!tabs.length || !card) return;

  function render(key){
    const c = CARDS[key];
    if(!c) return;
    card.innerHTML = `
      <div class="sc-head">
        <div>
          <div class="sc-name">${c.name}</div>
          <div class="sc-tag">${c.tag}</div>
        </div>
        <div class="sc-aws">AWS · AI Service Card</div>
      </div>
      <div class="sc-body">
        <div class="sc-section use">
          <h4>✓ Casos de uso pretendidos</h4>
          <ul>${c.use.map(u => `<li>${u}</li>`).join('')}</ul>
        </div>
        <div class="sc-section limit">
          <h4>⚠ Limitações conhecidas</h4>
          <ul>${c.limit.map(u => `<li>${u}</li>`).join('')}</ul>
        </div>
      </div>
    `;
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      render(t.dataset.card);
    });
  });

  render('rekognition');
})();


/* ═══════════════════════════════════════
   4. TRADE-OFF interpretabilidade × performance
   ═══════════════════════════════════════ */
(function tradeoff(){
  const MODELS = [
    {
      max:20,
      name:'Regressão Linear',
      desc:'Performance modesta, mas você consegue explicar cada coeficiente. Ideal pra crédito, saúde, justiça e qualquer área regulada onde "porquê" importa mais que ".001 a mais de F1".',
      int:'★★★★★', perf:'★★☆☆☆',
      cx:80, cy:215
    },
    {
      max:40,
      name:'Árvore de Decisão',
      desc:'If/else aprendido dos dados. Você consegue desenhar o caminho da decisão. Performance OK em dados tabulares, fica fraco em dados não-estruturados (imagem, texto livre).',
      int:'★★★★☆', perf:'★★★☆☆',
      cx:180, cy:195
    },
    {
      max:60,
      name:'Random Forest',
      desc:'Centenas de árvores votando. Bom equilíbrio: ainda dá pra ver feature importance, mas a decisão exata é mais difícil. Cavalo de batalha pra dados tabulares na maioria das empresas.',
      int:'★★★☆☆', perf:'★★★★☆',
      cx:290, cy:135
    },
    {
      max:85,
      name:'Deep Neural Network',
      desc:'Milhões de parâmetros, performance forte em imagem, texto e áudio. Caixa preta — pra explicar use SHAP/LIME ou SageMaker Clarify. Cuidado em decisões reguladas.',
      int:'★★☆☆☆', perf:'★★★★★',
      cx:430, cy:80
    },
    {
      max:100,
      name:'LLM / Foundation Model',
      desc:'Bilhões de parâmetros. Capacidade impressionante em linguagem e raciocínio. Mas explicabilidade é prática emergente — não há SHAP fácil. Use Bedrock Model Evaluation, prompt logging e human review.',
      int:'★☆☆☆☆', perf:'★★★★★',
      cx:540, cy:55
    }
  ];

  const slider = document.getElementById('trade');
  const dot = document.getElementById('trade-dot');
  const result = document.getElementById('trade-result');
  const nameEl = document.getElementById('trade-model');
  const descEl = document.getElementById('trade-desc');
  const intEl = document.getElementById('trade-int');
  const perfEl = document.getElementById('trade-perf');
  if(!slider || !dot) return;

  function update(){
    const v = parseInt(slider.value);
    const m = MODELS.find(x => v <= x.max) || MODELS[MODELS.length-1];
    dot.setAttribute('cx', m.cx);
    dot.setAttribute('cy', m.cy);
    nameEl.textContent = m.name;
    descEl.textContent = m.desc;
    intEl.textContent = m.int;
    perfEl.textContent = m.perf;
  }
  slider.addEventListener('input', update);
  update();
})();


/* ═══════════════════════════════════════
   5. APIs DE MODERAÇÃO — picker
   ═══════════════════════════════════════ */
(function moderation(){
  const MODS = {
    'text-llm': {
      api:'Bedrock Guardrails',
      tag:'Aplicado em apps GenAI no Bedrock',
      desc:'Filtro nativo do Bedrock que aplica regras <strong>antes do prompt</strong> e <strong>antes da resposta</strong>. Bloqueia tópicos proibidos configuráveis, palavrões, PII (CPF, telefone, e-mail), jailbreaks comuns. Funciona com qualquer FM disponível no Bedrock.',
      detects:[
        'Tópicos sensíveis configuráveis (ex.: aconselhamento médico, financeiro)',
        'PII (CPF, e-mail, telefone, endereço — redacted ou bloqueado)',
        'Toxicidade (ódio, insultos, conteúdo sexual)',
        'Tentativas de jailbreak ("ignore previous instructions...")',
        'Palavras e expressões customizadas via blocklist'
      ],
      example:'Configura uma vez no console, aplica em <strong>todas as chamadas Bedrock</strong> daquele guardrail. Cliente final nem vê o que foi bloqueado — mensagem padrão é retornada.'
    },
    'text-user': {
      api:'Amazon Comprehend',
      tag:'NLP gerenciado pra texto livre',
      desc:'Pra texto que <strong>não veio de LLM</strong> (ex.: chat de cliente, comentário em rede social, formulário). Comprehend faz toxicity detection e PII detection direto.',
      detects:[
        'Toxicidade em 7 categorias (ódio, insulto, sexual, violência, etc.)',
        'Entidades nomeadas (pessoa, lugar, org)',
        'PII com DetectPiiEntities (CPF, e-mail, etc.)',
        'Sentimento (positivo, negativo, neutro, misto)',
        'Idioma e classificações customizadas (Comprehend Custom)'
      ],
      example:'API call: <strong>DetectToxicContent</strong> retorna score por categoria. Threshold típico: bloqueia acima de 0.8, manda pra revisão entre 0.5 e 0.8.'
    },
    image: {
      api:'Amazon Rekognition',
      tag:'Computer Vision · DetectModerationLabels',
      desc:'Identifica conteúdo inapropriado em <strong>imagens</strong>. Útil pra moderação de upload em redes sociais, marketplaces, dating apps, e-commerce.',
      detects:[
        'Nudez explícita e sugestiva',
        'Violência (armas, ferimentos, sangue)',
        'Drogas e parafernália',
        'Símbolos de ódio',
        'Tabaco e álcool em contexto'
      ],
      example:'Hierarquia de labels: "Explicit" → "Nudity" → "Graphic Female Nudity". Retorna score por label. Recomenda-se combinar com <strong>Amazon A2I</strong> pra revisão humana em casos limítrofes.'
    },
    video: {
      api:'Amazon Rekognition Video',
      tag:'Computer Vision · vídeo frame por frame',
      desc:'Mesmas categorias de moderação que Rekognition, aplicadas a <strong>vídeos</strong> armazenados em S3 ou streams ao vivo via Kinesis Video Streams.',
      detects:[
        'Nudez, violência, drogas (mesmas categorias da imagem)',
        'Timestamps exatos onde apareceu cada label',
        'Detecção de pessoas, faces, celebridades',
        'Atividades (correndo, lutando, dirigindo)',
        'Análise em batch (S3) ou tempo real (Kinesis Video)'
      ],
      example:'Análise async: chama <strong>StartContentModeration</strong>, recebe notificação SNS quando termina. Resultado tem timestamp de cada flag. Bom pra revisão moderada com humano olhando só os trechos suspeitos.'
    },
    audio: {
      api:'Amazon Transcribe Toxicity Detection',
      tag:'Speech-to-Text com moderação',
      desc:'Detecta toxicidade <strong>direto no áudio</strong>, sem precisar transcrever em uma etapa separada. Roda como parte do job de transcrição.',
      detects:[
        'Toxicidade em 7 categorias (mesmas do Comprehend)',
        'Score por trecho da fala (com timestamps)',
        'Funciona durante transcrição batch ou streaming',
        'Disponível em inglês (ainda em expansão para outros idiomas)',
        'Combina com diarização (qual falante foi tóxico)'
      ],
      example:'Útil em call centers, jogos com voz e podcasts. Habilita-se com a flag <strong>ToxicityDetection</strong> no job de Transcribe. Resultado vem junto com a transcrição.'
    }
  };

  const picker = document.getElementById('mod-picker');
  const result = document.getElementById('mod-result');
  if(!picker || !result) return;

  function render(key){
    const m = MODS[key];
    if(!m) return;
    result.innerHTML = `
      <h3>👉 <span class="api-name">${m.api}</span></h3>
      <div class="mod-when">${m.tag}</div>
      <p>${m.desc}</p>
      <ul>${m.detects.map(d => `<li>${d}</li>`).join('')}</ul>
      <div class="mod-example">${m.example}</div>
    `;
  }

  picker.querySelectorAll('.mod-type').forEach(b => {
    b.addEventListener('click', () => {
      picker.querySelectorAll('.mod-type').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.type);
    });
  });

  render('text-llm');
})();


/* ═══════════════════════════════════════
   6. SCOPING MATRIX — 5 escopos
   ═══════════════════════════════════════ */
(function scopingMatrix(){
  const SCOPES = {
    1: {
      title:'Escopo 1 · Consumer App',
      example:'Funcionário usa ChatGPT.com no navegador pra rascunhar um e-mail.',
      yourResp:[
        'Política interna sobre o que pode ser colocado nessas ferramentas',
        'Treinamento pros funcionários (não cole dado confidencial)',
        'Bloqueio em rede pra ferramentas não-aprovadas, se necessário'
      ],
      providerResp:[
        'Toda a infra, modelo, segurança da plataforma',
        'Termos de uso e privacidade do consumer app',
        'Você está usando o produto deles, nas regras deles'
      ]
    },
    2: {
      title:'Escopo 2 · Enterprise App',
      example:'Sua empresa contrata Microsoft Copilot, ChatGPT Enterprise, ou similar com contrato corporativo.',
      yourResp:[
        'Configurar políticas de DLP (Data Loss Prevention)',
        'Gestão de identidade e SSO pra controlar quem acessa',
        'Revisar termos de privacidade e contrato de processamento de dados',
        'Treinar usuários nas políticas internas'
      ],
      providerResp:[
        'Modelo, infra, segurança da plataforma',
        'Garantias contratuais (não treina nos seus dados, criptografia, compliance)',
        'Logs e auditoria do produto'
      ]
    },
    3: {
      title:'Escopo 3 · Pre-trained Model via API',
      example:'Você chama Claude no Bedrock via API. Não fine-tuna nem treina.',
      yourResp:[
        'Engenharia de prompt e prompt injection prevention',
        'Bedrock Guardrails na entrada e saída',
        'IAM pra controle de acesso ao Bedrock',
        'Source citation, validação de output, redução de alucinação',
        'Audit trail (CloudTrail) e monitoramento'
      ],
      providerResp:[
        'Modelo base, infra, treinamento original',
        'Garantias contratuais (não treina nos seus prompts)',
        'Disponibilidade do serviço (Bedrock SLA)'
      ]
    },
    4: {
      title:'Escopo 4 · Fine-tuned Model',
      example:'Você fine-tuna Claude no Bedrock com seu dataset pra adaptar tom de voz.',
      yourResp:[
        'Tudo do Escopo 3 +',
        '<strong>Curadoria do dataset de fine-tuning</strong> (qualidade, bias, PII redacted)',
        'Avaliação do modelo customizado (Bedrock Model Evaluation)',
        'Monitoramento de drift e regressões pós-fine-tune',
        'Gestão de versões do modelo e rollback',
        'Documentação via Model Cards'
      ],
      providerResp:[
        'Infra de fine-tuning, modelo base original',
        'Capacidade dedicada (Provisioned Throughput obrigatório pra modelos custom)'
      ]
    },
    5: {
      title:'Escopo 5 · Self-trained Model',
      example:'Você treina um Foundation Model próprio do zero ou com continued pre-training extenso.',
      yourResp:[
        '<strong>Tudo</strong> dos escopos anteriores +',
        'Curadoria de dataset gigante (terabytes), incluindo licenças e copyright',
        'Decisões arquiteturais do modelo (parâmetros, dados, RLHF)',
        'Custo computacional e ambiental do treino',
        'Toda a transparência: Model Cards, AI Service Cards, datasheets',
        'Compliance com regulações emergentes (EU AI Act, etc.)',
        'Red teaming, adversarial testing, bias audit completo'
      ],
      providerResp:[
        'Infra de computação (GPUs, rede, storage)',
        'Ferramentas (SageMaker, Bedrock Custom Model Import)',
        'Nada do conteúdo ou comportamento do modelo'
      ]
    }
  };

  const grid = document.getElementById('scope-grid');
  const detail = document.getElementById('scope-detail');
  if(!grid || !detail) return;

  function render(scope){
    const s = SCOPES[scope];
    if(!s) return;
    detail.innerHTML = `
      <h3>${s.title}</h3>
      <p style="color:rgba(251,243,226,0.85);font-size:14.5px;line-height:1.55"><strong>Cenário típico:</strong> ${s.example}</p>
      <div class="sd-body">
        <div class="sd-section">
          <h4>👤 Sua responsabilidade</h4>
          <ul>${s.yourResp.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
        <div class="sd-section">
          <h4>☁️ Responsabilidade do provider</h4>
          <ul>${s.providerResp.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
      </div>
    `;
  }

  grid.querySelectorAll('.scope-card').forEach(c => {
    c.addEventListener('click', () => {
      grid.querySelectorAll('.scope-card').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      render(c.dataset.scope);
    });
  });

  // estado inicial
  grid.querySelector('[data-scope="3"]').classList.add('active');
  render('3');
})();


/* ═══════════════════════════════════════
   7. LINHAGEM — citações que se highlight
   ═══════════════════════════════════════ */
(function lineage(){
  const cites = document.querySelectorAll('.cite');
  const items = document.querySelectorAll('.cite-item');
  if(!cites.length) return;

  function highlight(num){
    cites.forEach(c => c.classList.toggle('highlight', c.dataset.cite === num));
    items.forEach(i => i.classList.toggle('highlight', i.dataset.cite === num));
  }
  function clear(){
    cites.forEach(c => c.classList.remove('highlight'));
    items.forEach(i => i.classList.remove('highlight'));
  }

  cites.forEach(c => {
    c.addEventListener('mouseenter', () => highlight(c.dataset.cite));
    c.addEventListener('mouseleave', clear);
    c.addEventListener('click', () => {
      highlight(c.dataset.cite);
      const target = document.querySelector(`.cite-item[data-cite="${c.dataset.cite}"]`);
      if(target) target.scrollIntoView({behavior:'smooth', block:'nearest'});
    });
  });
  items.forEach(i => {
    i.addEventListener('mouseenter', () => highlight(i.dataset.cite));
    i.addEventListener('mouseleave', clear);
  });
})();


/* ═══════════════════════════════════════
   8. CHECKLIST DE DADOS SEGUROS — termômetro
   ═══════════════════════════════════════ */
(function checklist(){
  const list = document.getElementById('checklist');
  const counter = document.getElementById('check-counter');
  const fill = document.getElementById('check-fill');
  if(!list || !fill) return;

  const items = list.querySelectorAll('input[type=checkbox]');
  const totalWeight = Array.from(items).reduce((a, c) => a + parseInt(c.dataset.w), 0);

  function update(){
    let score = 0;
    items.forEach(c => { if(c.checked) score += parseInt(c.dataset.w); });
    const pct = Math.round((score / totalWeight) * 100);
    fill.style.width = pct + '%';

    let label;
    if(pct === 0){
      label = 'Marque os itens que já aplica';
    } else if(pct < 35){
      label = `<strong style="color:var(--coral)">🌱 Começo</strong> — ${pct}% da maturidade. Pega o básico (KMS, IAM, CloudTrail) primeiro.`;
    } else if(pct < 70){
      label = `<strong style="color:#C28A00">🌳 Crescendo</strong> — ${pct}% da maturidade. Já tem fundação, agora foca em PII e linhagem.`;
    } else if(pct < 100){
      label = `<strong style="color:var(--olive)">🌲 Quase maduro</strong> — ${pct}% da maturidade. Faltam detalhes pra estar pronto pra qualquer auditoria.`;
    } else {
      label = `<strong style="color:var(--olive)">🌲 Maduro</strong> — 100%. Sua engenharia de dados pra IA está sólida. Só não relaxa.`;
    }
    counter.innerHTML = label;
  }

  items.forEach(c => c.addEventListener('change', update));
  update();
})();
