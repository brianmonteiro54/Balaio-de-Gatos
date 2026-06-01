/* ===== bloco 1 ===== */

// ═══════════════════════════════════════
// 1. Toggle dos domínios (acordeão)
// ═══════════════════════════════════════
document.querySelectorAll('.domain-head').forEach(head => {
  head.addEventListener('click', () => {
    const row = head.closest('.domain-row');
    const wasOpen = row.classList.contains('open');
    document.querySelectorAll('.domain-row').forEach(r => r.classList.remove('open'));
    if (!wasOpen) row.classList.add('open');
  });
});

// ═══════════════════════════════════════
// 2. Animação das barras quando entra na viewport
// ═══════════════════════════════════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (el.classList.contains('domain-bar')) {
        el.classList.add('animated');
      } else if (el.classList.contains('topic-bar')) {
        el.classList.add('animated');
      }
      observer.unobserve(el);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.domain-bar').forEach((bar, i) => {
  bar.style.setProperty('--delay', (i * 0.08) + 's');
  observer.observe(bar);
});
document.querySelectorAll('.topic').forEach((topic, i) => {
  const bar = topic.querySelector('.topic-bar');
  const p = topic.dataset.p;
  bar.style.setProperty('--p', p + '%');
  bar.style.setProperty('--delay', (i * 0.04) + 's');
  observer.observe(bar);
});

// ═══════════════════════════════════════
// 3. Filtro do mapa de palavras-chave
// ═══════════════════════════════════════
const filterBtns = document.querySelectorAll('.kw-filter');
const kws = document.querySelectorAll('.kw');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.f;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    kws.forEach(kw => {
      if (filter === 'all') {
        kw.classList.remove('dim');
      } else {
        kw.classList.toggle('dim', !kw.classList.contains('k-' + filter));
      }
    });
  });
});

// ═══════════════════════════════════════
// 4. Abrir o domínio 3 (o maior) por padrão depois de 1s
// ═══════════════════════════════════════
setTimeout(() => {
  const d3 = document.querySelector('[data-domain="3"]');
  if (d3 && !document.querySelector('.domain-row.open')) {
    d3.classList.add('open');
  }
}, 1400);



/* =========================================================
   ===== bloco 2 · UX do mapa de estudos
   - Lê progresso do treino (localStorage do v2)
   - Diagnóstico de 3 perguntas com recomendação
   - Tooltip nas palavras-chave
   - FAB "Treinar agora" com auto-hide no topo
   ========================================================= */

// ═══════════════════════════════════════
// 5. Card de progresso (sincroniza com v2.html)
// ═══════════════════════════════════════
(function progressCard(){
  const TREINO_KEY = 'balaio-treino-v2';
  const strip      = document.getElementById('progress-strip');
  if(!strip) return;

  let state = null;
  try{
    const raw = localStorage.getItem(TREINO_KEY);
    if(raw) state = JSON.parse(raw);
  }catch(e){ state = null; }

  if(!state || !state.qResults || Object.keys(state.qResults).length === 0){
    return; // primeira visita, esconde a strip
  }

  // Calcula stats
  const results = state.qResults || {};
  const answered = Object.values(results).filter(r => r.answered).length;
  const correct  = Object.values(results).filter(r => r.correct).length;
  const wrong    = Object.values(results).filter(r => r.answered && !r.correct).length;
  const marked   = Object.values(results).filter(r => r.marked).length;

  // Total de questões: usa o tamanho do qOrder OU dos qResults, pra refletir
  // mudanças no banco quando a aula adiciona questões novas.
  const total   = Math.max(
    state.qOrder?.length || 0,
    Object.keys(results).length,
    answered + 1   // pelo menos o que já foi visto
  ) || 67;
  const acc     = answered > 0 ? Math.round((correct/answered)*100) : 0;
  const headline = document.getElementById('ps-headline');
  const detail   = document.getElementById('ps-detail');
  const domsEl   = document.getElementById('ps-domains');
  const weakBtn  = document.getElementById('ps-weakest');

  headline.innerHTML = `Você já respondeu <strong>${answered}</strong> de ${total} questões`;

  let detailParts = [];
  if(answered > 0) detailParts.push(`${acc}% de acerto`);
  if(wrong > 0) detailParts.push(`<a href="v2.html?mode=wrong">${wrong} pra refazer ❌</a>`);
  if(marked > 0) detailParts.push(`<a href="v2.html?mode=marked">${marked} marcadas ⭐</a>`);
  detail.innerHTML = detailParts.length ? '· ' + detailParts.join(' · ') : 'Bora continuar de onde parou.';

  // Domain bars
  const dByDomain = state.qByDomain || {};
  const dColors = { 1:'#5C8D89', 2:'#8A6FB1', 3:'#FF6B35', 4:'#C73E1D', 5:'#D4A574' };
  let weakestD = null, weakestPct = 101;

  let html = '';
  for(let d = 1; d <= 5; d++){
    const data = dByDomain[d] || { a:0, c:0 };
    const pct = data.a > 0 ? Math.round((data.c/data.a)*100) : null;
    if(data.a >= 2 && pct !== null && pct < weakestPct){
      weakestPct = pct;
      weakestD = d;
    }
    const pctText = pct === null ? '-' : pct + '%';
    html += `<a class="ps-dom" href="v2.html?d=${d}" title="Domínio ${d}: ${data.c}/${data.a} (${pctText}) · clica pra praticar">
      <div class="ps-dom-bar"><div class="fill" style="width:${pct||0}%; background:${dColors[d]}"></div></div>
      <div class="ps-dom-meta"><span>D${d}</span><span class="pct">${pctText}</span></div>
    </a>`;
  }
  domsEl.innerHTML = html;

  if(weakestD !== null){
    weakBtn.hidden = false;
    weakBtn.href = `v2.html?d=${weakestD}`;
    weakBtn.innerHTML = `Treinar D${weakestD} (${weakestPct}%) ↗`;
    weakBtn.title = `Domínio ${weakestD} é seu ponto mais fraco no momento`;
  }

  strip.hidden = false;
})();


// ═══════════════════════════════════════
// 6. Diagnóstico de 3 perguntas
// ═══════════════════════════════════════
(function diagnostic(){
  const body = document.getElementById('diag-body');
  const result = document.getElementById('diag-result');
  if(!body) return;

  const QUESTIONS = [
    {
      id: 'time',
      q: 'Quanto tempo você tem até a prova?',
      opts: [
        { v: 'lots',  label: '🌱 3+ semanas', tip: 'Caminho completo' },
        { v: 'some',  label: '⏳ 1,2 semanas', tip: 'Foco no que pesa' },
        { v: 'short', label: '🔥 Menos de uma semana',  tip: 'Modo véspera' }
      ]
    },
    {
      id: 'level',
      q: 'Quanto você já sabe de IA/ML?',
      opts: [
        { v: 'none',   label: '🐣 Praticamente nada' },
        { v: 'some',   label: '🐈 Já vi algumas coisas' },
        { v: 'solid',  label: '🦁 Já trabalho com isso' }
      ]
    },
    {
      id: 'goal',
      q: 'O que mais te incomoda agora?',
      opts: [
        { v: 'concept', label: '🤔 Confundir conceitos básicos (RAG vs FT, supervised vs não)' },
        { v: 'aws',     label: '☁️ Saber qual serviço AWS usa em cada cenário' },
        { v: 'practice',label: '🎯 Não ter onde treinar com questões reais' }
      ]
    }
  ];

  const answers = {};

  function render(){
    body.innerHTML = QUESTIONS.map((q, i) => `
      <div class="diag-q ${answers[q.id] ? 'answered' : ''}">
        <div class="diag-q-num">${i+1}</div>
        <div class="diag-q-content">
          <div class="diag-q-text">${q.q}</div>
          <div class="diag-q-opts">
            ${q.opts.map(o => `
              <button class="diag-opt ${answers[q.id]===o.v?'sel':''}" data-q="${q.id}" data-v="${o.v}">
                ${o.label}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');

    body.querySelectorAll('.diag-opt').forEach(b => {
      b.addEventListener('click', () => {
        answers[b.dataset.q] = b.dataset.v;
        render();
        if(Object.keys(answers).length === QUESTIONS.length){
          showResult();
        } else {
          result.hidden = true;
        }
      });
    });
  }

  function showResult(){
    const { time, level, goal } = answers;

    // Heurística simples: prioriza tempo > goal > level
    let title = '', body = '', actions = [];

    if(time === 'short'){
      title = '🔥 Modo véspera de prova';
      body = 'Sem tempo pra teoria pura. Bora direto no quiz, foca em <strong>RAG vs Fine-tuning</strong>, <strong>Bedrock</strong> e <strong>SageMaker Clarify vs Model Monitor</strong>. Lê as 10 pegadinhas, dorme.';
      actions = [
        { href: 'v2.html', label: '🎯 Quiz completo (revisão geral)' },
        { href: '#decisoes', label: '⚡ As 3 grandes decisões' },
        { href: '#pegadinhas', label: '🚨 10 pegadinhas favoritas' }
      ];
    } else if(level === 'none'){
      title = '🐣 Comece pelos fundamentos';
      body = 'Os <strong>5 domínios</strong> primeiro pra ter mapa mental. Depois <a href="../aula1/">Aula 1</a> (IA vs ML vs DL) e <a href="../aula2/">Aula 2</a> (dados, embeddings). Só aí você ataca o quiz.';
      actions = [
        { href: '#dominios', label: '📊 Os 5 domínios' },
        { href: '../aula1/', label: '📚 Aula 1: IA na prática' },
        { href: '../aula2/', label: '📚 Aula 2: Dados pra IA' }
      ];
    } else if(goal === 'concept'){
      title = '🤔 Foco em conceitos confusos';
      body = 'Vai direto na seção <strong>3 grandes decisões</strong> e nas <strong>10 pegadinhas</strong>. Depois treina Domínio 2 (GenAI fundamentos) que dá a base pro resto.';
      actions = [
        { href: '#decisoes', label: '⚡ As 3 decisões' },
        { href: '#pegadinhas', label: '🚨 10 pegadinhas' },
        { href: 'v2.html?d=2', label: '🎯 Quiz Domínio 2' }
      ];
    } else if(goal === 'aws'){
      title = '☁️ Foco em mapeamento de serviços';
      body = 'Vai pro <strong>cheatsheet de serviços AWS</strong> e o quiz do <strong>Domínio 3</strong> (28% da prova, todos os "qual serviço usar?"). É o domínio com maior peso.';
      actions = [
        { href: '#servicos', label: '🛠️ Cheatsheet AWS' },
        { href: 'v2.html?d=3', label: '🎯 Quiz Domínio 3 (o maior)' },
        { href: 'v2.html?tab=ref', label: '📚 Cola de cenários' }
      ];
    } else if(goal === 'practice'){
      title = '🎯 Modo prática';
      body = 'Pula direto pro <strong>Treino do Gato</strong>. 67 questões com feedback na hora, filtro por domínio, modo "só erradas". Volta aqui quando tiver dúvida em conceito.';
      actions = [
        { href: 'v2.html', label: '🎯 Abrir Treino do Gato' },
        { href: 'v2.html?d=3', label: '🎯 Direto pro D3 (28%)' },
        { href: 'v2.html?tab=flash', label: '🔁 Flashcards' }
      ];
    } else {
      title = '⏳ Caminho equilibrado';
      body = 'Você tem tempo. Sequência sugerida: <strong>5 domínios → Aulas → Quiz por domínio → Pegadinhas → Quiz geral</strong>. Mira em 80% nos simulados antes de marcar prova.';
      actions = [
        { href: '#dominios', label: '📊 Começa nos domínios' },
        { href: '../index.html#aulas', label: '📚 Pegar uma aula' },
        { href: 'v2.html', label: '🎯 Treinar' }
      ];
    }

    result.hidden = false;
    result.innerHTML = `
      <div class="diag-result-head">
        <span class="diag-result-tag">🎯 Recomendação personalizada</span>
        <h3>${title}</h3>
        <p>${body}</p>
      </div>
      <div class="diag-result-actions">
        ${actions.map((a, i) => `<a href="${a.href}" class="diag-action ${i===0?'primary':''}">${a.label}</a>`).join('')}
      </div>
      <button class="diag-restart" id="diag-restart">↺ Refazer diagnóstico</button>
    `;
    document.getElementById('diag-restart').addEventListener('click', () => {
      Object.keys(answers).forEach(k => delete answers[k]);
      result.hidden = true;
      render();
      document.getElementById('diag').scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  render();
})();


// ═══════════════════════════════════════
// 7. Tooltip nas palavras-chave
// ═══════════════════════════════════════
(function kwTooltips(){
  const KW_DEFS = {
    'Bedrock': 'Amazon Bedrock · Foundation Models como serviço, sem gerenciar infra',
    'RAG': 'Retrieval Augmented Generation · busca contexto e injeta no prompt',
    'Foundation Model': 'Modelo grande pré-treinado, base pra muitas tarefas',
    'Knowledge Bases': 'Bedrock RAG totalmente gerenciado',
    'Fine-tuning': 'Ajustar pesos do modelo com dados rotulados',
    'Prompt Engineering': 'Arte de escrever prompts melhores, sem mudar o modelo',
    'SageMaker': 'Plataforma full-stack de ML da AWS',
    'Bias': 'Viés algorítmico · modelo trata grupos de forma desigual',
    'LLM': 'Large Language Model · FM focado em texto',
    'Alucinação': 'Quando o modelo inventa informação que parece verdadeira',
    'Embeddings': 'Vetores que representam significado de texto/imagem',
    'Bedrock Agents': 'FM que chama APIs externas pra executar ações',
    'Guardrails': 'Filtros de conteúdo no Bedrock (toxicidade, PII)',
    'Supervisionado': 'Aprende com dados rotulados',
    'Não-supervisionado': 'Aprende padrões sem rótulos (ex: clustering)',
    'Reinforcement Learning': 'Aprende por recompensa/punição',
    'Temperature': 'Aleatoriedade da resposta. Baixa = factual. Alta = criativa',
    'Top-p': 'Nucleus sampling · amostra de tokens que somam probabilidade p',
    'Top-k': 'Amostra dos K tokens mais prováveis',
    'Zero-shot': 'Prompt sem exemplo',
    'Few-shot': 'Prompt com poucos exemplos',
    'SageMaker Clarify': 'Detecta viés e gera explicações (XAI)',
    'Fairness': 'Imparcialidade · decisões similares pra casos similares',
    'Explicabilidade (XAI)': 'Entender POR QUE o modelo decidiu assim',
    'Amazon Q Business': 'Assistente corporativo de Q&A interno',
    'Amazon Q Developer': 'Copiloto de código (ex-CodeWhisperer)',
    'Classificação': 'Saída categórica (gato/cachorro)',
    'Regressão': 'Saída numérica contínua (preço, temperatura)',
    'Vector Database': 'BD pra embeddings + busca por similaridade',
    'IAM': 'Identity and Access Management · controle de acesso',
    'KMS': 'Key Management Service · gerencia chaves de criptografia',
    'Acurácia': 'Acertos / total · pode mentir em dataset desbalanceado',
    'Precision': 'Dos que disse positivo, quantos eram?',
    'Recall': 'Dos positivos reais, quantos peguei?',
    'F1-Score': 'Média harmônica entre precision e recall',
    'Matriz de Confusão': 'Tabela VP/FP/VN/FN das classificações',
    'ROC / AUC': 'Curva e área sob ela · qualidade global do classificador',
    'RMSE': 'Raiz do erro quadrático médio (regressão)',
    'MSE': 'Erro quadrático médio (regressão)',
    'R²': 'Variância explicada pelo modelo (regressão)',
    'Overfitting': 'Decora o treino, falha em dados novos',
    'Underfitting': 'Modelo simples demais, erra até no treino',
    'Bias-Variance': 'Tradeoff entre erro sistemático e instabilidade',
    'Tokens': 'Unidades de texto · preço é por token',
    'Tokenização': 'Quebrar texto em tokens',
    'Transformer': 'Arquitetura por trás dos LLMs modernos',
    'Multimodal': 'Modelo que processa texto + imagem + áudio',
    'GAN': 'Generative Adversarial Network · gerador vs discriminador',
    'Diffusion': 'Modelos que removem ruído pra gerar imagens',
    'NLP': 'Natural Language Processing',
    'Chunking': 'Quebrar docs em pedaços pra RAG',
    'Chain-of-Thought': 'Pedir pro modelo "pensar passo a passo"',
    'JumpStart': 'Catálogo de FMs pré-treinados no SageMaker',
    'SageMaker Canvas': 'ML no-code pra analistas',
    'Continued Pre-training': 'Treino adicional com dados não rotulados',
    'Inference': 'Quando o modelo usa o que aprendeu (rodar em produção)',
    'Endpoints': 'URL do modelo deployado (SageMaker)',
    'Comprehend': 'NLP gerenciado: sentimento, entidades, idioma',
    'Rekognition': 'Visão computacional gerenciada',
    'Lex': 'Chatbots conversacionais (mesma tech da Alexa)',
    'Polly': 'Texto → fala (TTS)',
    'Translate': 'Tradução neural',
    'Transcribe': 'Fala → texto (STT)',
    'Textract': 'OCR avançado de documentos',
    'Kendra': 'Busca empresarial semântica',
    'Model Monitor': 'Monitora drift do modelo em produção',
    'Drift': 'Modelo piora com o tempo (mundo muda, dados mudam)',
    'A2I (Human-in-the-loop)': 'Workflow de revisão humana em decisões de ML',
    'Toxicidade': 'Conteúdo ofensivo · bloqueia com Guardrails',
    'Model Cards': 'Documentação estruturada do modelo (governança)',
    'Transparência': 'Saber como o modelo foi treinado e suas limitações',
    'VPC Endpoints': 'PrivateLink · tráfego AWS sem internet pública',
    'CloudTrail': 'Auditoria · quem chamou que API quando',
    'CloudWatch': 'Monitoramento e métricas de recursos AWS',
    'Macie': 'Descoberta automatizada de PII em S3',
    'GDPR': 'Lei europeia de proteção de dados',
    'Compliance': 'Estar de acordo com normas e leis',
    'S3 Bucket Policy': 'Policy a nível de bucket no S3',
    'Pipeline ML': 'Sequência de passos de um sistema de ML',
    'Feature Engineering': 'Transformar dados brutos em features úteis',
    'K-NN': 'K-Nearest Neighbors · classifica pelo "vizinho mais parecido"',
    'Árvore de Decisão': 'Modelo if/else aprendido dos dados',
    'Cross-validation': 'Validação dividindo o dataset em K dobras',
    'SLM': 'Small Language Model · menor, mais rápido, mais barato',
    'Multimodalidade': 'Capacidade de processar múltiplos tipos de dado',
    'Model Evaluation': 'Avaliar qualidade de modelos (Bedrock tem integrado)',
    'ROUGE': 'Métrica pra avaliar sumarização',
    'BLEU': 'Métrica pra avaliar tradução',
    'Perplexity': 'Métrica de qualidade de LLM (quão "surpreso" o modelo fica)',
    'PartyRock': 'Playground gratuito de prototipagem com Bedrock',
    'CodeWhisperer': 'Antigo nome do Amazon Q Developer',
    'Inclusão': 'IA funciona pra todos, não só pro grupo majoritário',
    'Sustentabilidade': 'Custo ambiental do treinamento e inferência',
    'AWS Config': 'Inventário e mudanças de configuração',
    'Shared Responsibility': 'AWS cuida da infra, cliente cuida dos dados',
    'HIPAA': 'Lei de saúde dos EUA · privacidade médica',
    'PII': 'Personally Identifiable Information · dados pessoais'
  };

  // Aplica title e classe nos elementos .kw
  document.querySelectorAll('.kw').forEach(el => {
    const term = el.textContent.trim();
    const def = KW_DEFS[term];
    if(def){
      el.title = def;
      el.classList.add('kw-has-def');
      el.tabIndex = 0;
    }
  });
})();


// ═══════════════════════════════════════
// 8. FAB "Treinar agora" · esconde no topo, aparece ao rolar
// ═══════════════════════════════════════
(function fabBehavior(){
  const fab = document.getElementById('fab-train');
  if(!fab) return;

  function update(){
    const scrolled = window.scrollY > 320;
    fab.classList.toggle('visible', scrolled);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
/* =========================================================
   ===== bloco 9 · PERIODIC TABLE de serviços AWS de IA
   Substitui a seção "Mapa de palavras-chave" por uma
   referência visual: 33 serviços em 8 famílias funcionais.
   Clique em uma célula → painel de detalhe inline.
   ========================================================= */
(function periodicTable(){

  // ───────────────────────────────────────
  // FAMÍLIAS · cor + emoji + label
  // ───────────────────────────────────────
  const FAMILIES = {
    gen:  { label: 'Foundation / GenAI',         emoji: '🧠', shortLabel: 'GenAI' },
    ml:   { label: 'ML Workbench (SageMaker)',   emoji: '⚙️', shortLabel: 'ML' },
    txt:  { label: 'Texto / NLP',                emoji: '💬', shortLabel: 'NLP' },
    voz:  { label: 'Voz',                        emoji: '🎤', shortLabel: 'Voz' },
    vis:  { label: 'Visão',                      emoji: '👁️', shortLabel: 'Visão' },
    asst: { label: 'Assistentes prontos',        emoji: '🤖', shortLabel: 'Q' },
    data: { label: 'Dados / Infra',              emoji: '🗃️', shortLabel: 'Dados' },
    sec:  { label: 'Segurança / Governança',     emoji: '🔒', shortLabel: 'Seg' }
  };

  // ───────────────────────────────────────
  // SERVIÇOS · símbolo, nome, frase, família, domínio, quando-usar, quando-NÃO, link aula, pegadinha
  // ───────────────────────────────────────
  const SERVICES = [
    // ── Foundation / GenAI
    { sym: 'Bed', name: 'Amazon Bedrock',     line: 'FMs como serviço, sem infra', fam: 'gen', d: 3,
      use:  'Construir apps GenAI usando FMs prontos via API (Anthropic, Meta, Mistral, Amazon).',
      avoid: 'Quando precisa de modelo customizado from-scratch — vai pra SageMaker.',
      aula: 'aula14', trap: null },
    { sym: 'BKB', name: 'Knowledge Bases',    line: 'RAG gerenciado',              fam: 'gen', d: 3,
      use:  'RAG totalmente gerenciado em cima do Bedrock — conecta docs do S3, monta vector DB, retrieval.',
      avoid: 'Quando a info muda raramente e cabe no contexto direto (basta prompt engineering).',
      aula: 'aula10', trap: null },
    { sym: 'BAg', name: 'Bedrock Agents',     line: 'FM chama APIs externas',      fam: 'gen', d: 3,
      use:  'Quando o LLM precisa EXECUTAR ações (buscar dados, agendar, transacionar) em vez de só responder.',
      avoid: 'Quando o caso é só responder perguntas — basta RAG/Knowledge Bases.',
      aula: 'aula6', trap: null },
    { sym: 'BGr', name: 'Bedrock Guardrails', line: 'Filtra conteúdo do FM',       fam: 'gen', d: 3,
      use:  'Filtrar entrada e saída do FM contra PII, toxicidade, tópicos proibidos.',
      avoid: 'Pra controlar QUEM chama o modelo — isso é IAM, não Guardrails.',
      aula: 'aula16', trap: 'Guardrails ≠ IAM. Guardrails filtra CONTEÚDO, IAM filtra ACESSO.' },
    { sym: 'BEv', name: 'Bedrock Eval',       line: 'Avalia qualidade de FMs',     fam: 'gen', d: 3,
      use:  'Comparar FMs entre si com métricas automáticas (ROUGE, BLEU, BERTScore) e revisão humana.',
      avoid: null,
      aula: 'aula13', trap: null },
    { sym: 'PRk', name: 'PartyRock',          line: 'Playground gratuito',         fam: 'gen', d: 3,
      use:  'Prototipar apps GenAI sem código nem conta AWS. Bom pra demo e exploração.',
      avoid: 'Não é production-ready. Pra produção use Bedrock direto.',
      aula: 'aula14', trap: null },

    // ── ML Workbench (SageMaker family)
    { sym: 'SM',  name: 'Amazon SageMaker',   line: 'Plataforma ML completa',      fam: 'ml',  d: 1,
      use:  'Ciclo completo de ML customizado: rotular → treinar → tuning → deployar → monitorar.',
      avoid: 'Quando quer só usar FM pronto — vai pra Bedrock. Mais técnico, mais flexível, mais responsabilidade.',
      aula: 'aula13', trap: 'SageMaker treina/deploya MODELOS. Bedrock dá ACESSO A FMs prontos.' },
    { sym: 'SMC', name: 'SageMaker Canvas',   line: 'ML no-code',                  fam: 'ml',  d: 1,
      use:  'Analista de negócio criar modelo via interface visual sem escrever código.',
      avoid: 'Workflows automatizados em escala — use SageMaker normal.',
      aula: 'aula13', trap: null },
    { sym: 'SMJ', name: 'SageMaker JumpStart',line: 'Catálogo de FMs/modelos',     fam: 'ml',  d: 1,
      use:  'Atalho pra usar modelos pré-treinados (FMs e classicos) dentro do SageMaker.',
      avoid: null,
      aula: 'aula13', trap: null },
    { sym: 'SMx', name: 'SageMaker Clarify',  line: 'Detecta viés + XAI',          fam: 'ml',  d: 4,
      use:  'Detectar bias em dados/modelo (pre-train, post-train) e gerar explicações (SHAP).',
      avoid: 'Monitorar DRIFT do modelo em produção — isso é Model Monitor.',
      aula: 'aula16', trap: 'Clarify ≠ Model Monitor. Clarify = BIAS. Monitor = DRIFT.' },
    { sym: 'SMM', name: 'SM Model Monitor',   line: 'Drift em produção',           fam: 'ml',  d: 4,
      use:  'Alertar quando modelo piora ao longo do tempo (data drift, concept drift).',
      avoid: 'Detectar viés no dataset/modelo — isso é Clarify.',
      aula: 'aula13', trap: null },
    { sym: 'SMA', name: 'SM Autopilot',       line: 'AutoML',                      fam: 'ml',  d: 1,
      use:  'SageMaker escolhe modelo, features e hiperparâmetros automaticamente.',
      avoid: null,
      aula: 'aula13', trap: null },

    // ── Texto / NLP
    { sym: 'Cmp', name: 'Comprehend',         line: 'NLP gerenciado',              fam: 'txt', d: 3,
      use:  'Sentimento, entidades, idioma, key phrases, tópicos. Texto → insights.',
      avoid: 'Busca/Q&A em docs — use Kendra ou Q Business.',
      aula: 'aula8', trap: null },
    { sym: 'Knd', name: 'Kendra',             line: 'Busca empresarial',           fam: 'txt', d: 3,
      use:  'Busca semântica em docs internos com NLU. Bom pra "enterprise search".',
      avoid: 'Pra Q&A conversacional hoje use Q Business (mais novo, mais conversacional).',
      aula: 'aula11', trap: null },
    { sym: 'Trl', name: 'Translate',          line: 'Tradução neural',             fam: 'txt', d: 3,
      use:  'Tradução automática entre 75+ idiomas. Por API ou batch.',
      avoid: null,
      aula: 'aula9', trap: null },
    { sym: 'Txt', name: 'Textract',           line: 'OCR avançado',                fam: 'txt', d: 3,
      use:  'Extrair texto, TABELAS e FORMULÁRIOS de docs digitalizados/PDFs.',
      avoid: 'Pra detectar objetos em imagem qualquer use Rekognition.',
      aula: 'aula9', trap: null },

    // ── Voz
    { sym: 'Pll', name: 'Polly',              line: 'Texto → fala (TTS)',          fam: 'voz', d: 3,
      use:  'Sintetizar áudio realista a partir de texto. Várias vozes e idiomas.',
      avoid: null,
      aula: 'aula8', trap: null },
    { sym: 'Tsc', name: 'Transcribe',         line: 'Fala → texto (STT)',          fam: 'voz', d: 3,
      use:  'Reconhecimento de voz com pontuação, diarização, vocabulário customizado.',
      avoid: null,
      aula: 'aula8', trap: null },
    { sym: 'Lex', name: 'Amazon Lex',         line: 'Chatbots conversacionais',    fam: 'voz', d: 3,
      use:  'Interfaces de chat com intent + slots. Mesma tecnologia da Alexa.',
      avoid: 'Não responde com FM sozinho — Lex é o FLUXO. Inteligência vem do Bedrock atrás.',
      aula: 'aula9', trap: 'Lex ≠ Bedrock. Lex = fluxo conversacional. Bedrock = inteligência. Combinam.' },

    // ── Visão
    { sym: 'Rek', name: 'Rekognition',        line: 'Visão computacional',         fam: 'vis', d: 3,
      use:  'Detectar objetos, rostos, texto, moderar conteúdo em imagens e vídeos.',
      avoid: 'OCR de documentos estruturados (tabelas, forms) — vai melhor com Textract.',
      aula: 'aula7', trap: null },

    // ── Assistentes prontos
    { sym: 'QB',  name: 'Amazon Q Business',  line: 'Q&A corporativo',             fam: 'asst', d: 3,
      use:  'Assistente pronto que conecta nas fontes de dados da empresa (S3, SharePoint, Slack) e responde sobre conhecimento interno.',
      avoid: 'Pra sugerir/completar código — use Q Developer.',
      aula: 'aula9', trap: 'Q Business ≠ Q Developer. Business = docs. Developer = código.' },
    { sym: 'QD',  name: 'Amazon Q Developer', line: 'Copiloto de código',          fam: 'asst', d: 3,
      use:  'Sugestões de código em tempo real na IDE. Sucessor do CodeWhisperer.',
      avoid: 'Pra perguntar sobre docs internos da empresa — use Q Business.',
      aula: 'aula9', trap: null },

    // ── Dados / Infra
    { sym: 'S3',  name: 'Amazon S3',          line: 'Armazenamento de objetos',    fam: 'data', d: 5,
      use:  'Onde ficam datasets, artefatos de modelo, embeddings serializados. A "fundação" de quase todo pipeline AWS.',
      avoid: null,
      aula: 'aula11', trap: null },
    { sym: 'OS',  name: 'OpenSearch',         line: 'Vector DB pra RAG',           fam: 'data', d: 3,
      use:  'Banco vetorial pra armazenar embeddings + busca por similaridade. Base de RAG na AWS.',
      avoid: null,
      aula: 'aula10', trap: null },
    { sym: 'Aur', name: 'Aurora pgvector',    line: 'PostgreSQL com vetores',      fam: 'data', d: 3,
      use:  'Alternativa ao OpenSearch quando o app já usa Aurora — adiciona extensão pgvector.',
      avoid: null,
      aula: 'aula10', trap: null },

    // ── Segurança / Governança
    { sym: 'IAM', name: 'IAM',                line: 'Controle de acesso',          fam: 'sec', d: 5,
      use:  'Controlar QUEM (usuário, role, serviço) pode chamar O QUE na AWS.',
      avoid: 'Filtrar CONTEÚDO gerado por FM — isso é Guardrails.',
      aula: 'aula17', trap: null },
    { sym: 'KMS', name: 'KMS',                line: 'Chaves de criptografia',      fam: 'sec', d: 5,
      use:  'Gerenciar chaves pra criptografar dados em repouso (S3, EBS, RDS).',
      avoid: null,
      aula: 'aula17', trap: null },
    { sym: 'VPC', name: 'VPC Endpoints',      line: 'PrivateLink',                 fam: 'sec', d: 5,
      use:  'Garantir que chamadas pra serviços AWS NÃO passem pela internet pública.',
      avoid: null,
      aula: 'aula17', trap: null },
    { sym: 'CT',  name: 'CloudTrail',         line: 'Auditoria de chamadas',       fam: 'sec', d: 5,
      use:  'Quem chamou qual API quando. Pra responder "quem deletou isso?".',
      avoid: 'Monitorar latência/custo/throughput — use CloudWatch.',
      aula: 'aula17', trap: 'CloudTrail ≠ CloudWatch. Trail = AUDITORIA. Watch = MÉTRICAS.' },
    { sym: 'CW',  name: 'CloudWatch',         line: 'Métricas e logs',             fam: 'sec', d: 5,
      use:  'Monitorar métricas, alertar em throughput, latência, custo. Logs centralizados.',
      avoid: 'Auditoria de quem-chamou-o-que — isso é CloudTrail.',
      aula: 'aula17', trap: null },
    { sym: 'Mac', name: 'Macie',              line: 'Descobre PII em S3',          fam: 'sec', d: 5,
      use:  'Descoberta automatizada de dados sensíveis (CPF, e-mails, cartões) em buckets S3.',
      avoid: null,
      aula: 'aula16', trap: null },
    { sym: 'Cfg', name: 'AWS Config',         line: 'Inventário e conformidade',   fam: 'sec', d: 5,
      use:  'Histórico de mudanças de configuração e regras de compliance automatizadas.',
      avoid: null,
      aula: 'aula17', trap: null },
    { sym: 'A2I', name: 'Amazon A2I',         line: 'Revisão humana (HITL)',       fam: 'sec', d: 4,
      use:  'Meter humano-no-loop em decisões críticas/incertas do modelo. Workflow de revisão.',
      avoid: null,
      aula: 'aula16', trap: 'HITL — Human In The Loop. Cai sempre.' }
  ];

  // ───────────────────────────────────────
  // ESTADO · qual célula tá selecionada (nada persistido — é só referência)
  // ───────────────────────────────────────
  let selectedSym = null;

  // ───────────────────────────────────────
  // RENDER · monta a tabela
  // ───────────────────────────────────────
  function renderTable(){
    const wrap = document.getElementById('pt-table');
    if(!wrap) return;

    // agrupa serviços por família
    const groups = {};
    for(const s of SERVICES){
      if(!groups[s.fam]) groups[s.fam] = [];
      groups[s.fam].push(s);
    }

    // ordem das famílias (gen primeiro porque é o que mais cai)
    const order = ['gen', 'ml', 'txt', 'voz', 'vis', 'asst', 'data', 'sec'];

    wrap.innerHTML = order.map(famKey => {
      const fam = FAMILIES[famKey];
      const items = groups[famKey] || [];
      return `
        <div class="pt-row pt-fam-${famKey}">
          <div class="pt-row-label">
            <span class="pt-row-emoji" aria-hidden="true">${fam.emoji}</span>
            <span class="pt-row-name">${fam.label}</span>
            <span class="pt-row-count">${items.length}</span>
          </div>
          <div class="pt-row-cells">
            ${items.map(s => buildCell(s)).join('')}
          </div>
        </div>
      `;
    }).join('');

    wireCellClicks();
  }

  function buildCell(s){
    return `
      <button class="pt-cell pt-fam-${s.fam}" data-sym="${escAttr(s.sym)}" type="button"
              aria-label="${escAttr(s.name)} — ${escAttr(s.line)}">
        <span class="pt-cell-d">D${s.d}</span>
        <span class="pt-cell-sym">${escHtml(s.sym)}</span>
        <span class="pt-cell-name">${escHtml(s.name.replace(/^Amazon /,''))}</span>
        <span class="pt-cell-line">${escHtml(s.line)}</span>
      </button>
    `;
  }

  // ───────────────────────────────────────
  // RENDER · painel de detalhe
  // ───────────────────────────────────────
  function showDetail(sym){
    const s = SERVICES.find(x => x.sym === sym);
    const detail = document.getElementById('pt-detail');
    if(!s || !detail) return;
    selectedSym = sym;

    const fam = FAMILIES[s.fam];
    detail.innerHTML = `
      <div class="pt-d-head pt-fam-${s.fam}">
        <div class="pt-d-head-main">
          <span class="pt-d-sym">${escHtml(s.sym)}</span>
          <div class="pt-d-titles">
            <h3 class="pt-d-name">${escHtml(s.name)}</h3>
            <div class="pt-d-meta">
              <span class="pt-d-fam">${fam.emoji} ${escHtml(fam.label)}</span>
              <span class="pt-d-dom">Domínio ${s.d}</span>
            </div>
          </div>
        </div>
        <button class="pt-d-close" id="pt-d-close" aria-label="Fechar">✕</button>
      </div>
      <div class="pt-d-body">
        <div class="pt-d-row pt-d-use">
          <span class="pt-d-label">✅ Quando usar</span>
          <p>${escHtml(s.use)}</p>
        </div>
        ${s.avoid ? `
          <div class="pt-d-row pt-d-avoid">
            <span class="pt-d-label">🚫 Quando NÃO usar</span>
            <p>${escHtml(s.avoid)}</p>
          </div>
        ` : ''}
        ${s.trap ? `
          <div class="pt-d-row pt-d-trap">
            <span class="pt-d-label">⚠️ Pegadinha</span>
            <p>${escHtml(s.trap)}</p>
          </div>
        ` : ''}
        <div class="pt-d-actions">
          <a href="../${s.aula}/" class="pt-d-btn">📚 Aula relacionada →</a>
          <button class="pt-d-btn ghost" id="pt-d-next">Próximo serviço →</button>
        </div>
      </div>
    `;
    detail.hidden = false;

    // wire close
    document.getElementById('pt-d-close').addEventListener('click', closeDetail);

    // wire "próximo"
    document.getElementById('pt-d-next').addEventListener('click', () => {
      const idx = SERVICES.findIndex(x => x.sym === sym);
      const next = SERVICES[(idx + 1) % SERVICES.length];
      showDetail(next.sym);
      // foca a célula correspondente
      const cell = document.querySelector(`.pt-cell[data-sym="${cssEsc(next.sym)}"]`);
      if(cell){
        cell.focus();
        cell.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
      }
    });

    // marca a célula como selected
    document.querySelectorAll('.pt-cell').forEach(c => {
      c.classList.toggle('pt-selected', c.dataset.sym === sym);
    });

    // scroll suave até o detalhe
    setTimeout(() => detail.scrollIntoView({behavior:'smooth', block:'center'}), 100);
  }

  function closeDetail(){
    const detail = document.getElementById('pt-detail');
    if(detail){ detail.hidden = true; detail.innerHTML = ''; }
    document.querySelectorAll('.pt-cell.pt-selected').forEach(c => c.classList.remove('pt-selected'));
    selectedSym = null;
  }

  // ───────────────────────────────────────
  // WIRE · cliques
  // ───────────────────────────────────────
  function wireCellClicks(){
    document.querySelectorAll('.pt-cell').forEach(cell => {
      cell.addEventListener('click', () => showDetail(cell.dataset.sym));
    });
  }

  // ESC fecha o detalhe
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && selectedSym) closeDetail();
  });

  // ───────────────────────────────────────
  // HELPERS
  // ───────────────────────────────────────
  function escHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  }
  function escAttr(s){ return escHtml(s); }
  function cssEsc(s){
    if(window.CSS && window.CSS.escape) return CSS.escape(s);
    return String(s).replace(/[^a-zA-Z0-9_-]/g, c => '\\' + c);
  }

  // ───────────────────────────────────────
  // BOOT
  // ───────────────────────────────────────
  if(document.getElementById('pt-table')){
    renderTable();
  }
})();
