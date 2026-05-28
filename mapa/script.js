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
   ===== bloco 2 — UX do mapa de estudos
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

  const total   = 59;
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
  detail.innerHTML = detailParts.length ? '— ' + detailParts.join(' · ') : '— bora continuar de onde parou.';

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
    const pctText = pct === null ? '—' : pct + '%';
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
        { v: 'some',  label: '⏳ 1–2 semanas', tip: 'Foco no que pesa' },
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
      body = 'Pula direto pro <strong>Treino do Gato</strong>. 59 questões com feedback na hora, filtro por domínio, modo "só erradas". Volta aqui quando tiver dúvida em conceito.';
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
    'Bedrock': 'Amazon Bedrock — Foundation Models como serviço, sem gerenciar infra',
    'RAG': 'Retrieval Augmented Generation — busca contexto e injeta no prompt',
    'Foundation Model': 'Modelo grande pré-treinado, base pra muitas tarefas',
    'Knowledge Bases': 'Bedrock RAG totalmente gerenciado',
    'Fine-tuning': 'Ajustar pesos do modelo com dados rotulados',
    'Prompt Engineering': 'Arte de escrever prompts melhores, sem mudar o modelo',
    'SageMaker': 'Plataforma full-stack de ML da AWS',
    'Bias': 'Viés algorítmico — modelo trata grupos de forma desigual',
    'LLM': 'Large Language Model — FM focado em texto',
    'Alucinação': 'Quando o modelo inventa informação que parece verdadeira',
    'Embeddings': 'Vetores que representam significado de texto/imagem',
    'Bedrock Agents': 'FM que chama APIs externas pra executar ações',
    'Guardrails': 'Filtros de conteúdo no Bedrock (toxicidade, PII)',
    'Supervisionado': 'Aprende com dados rotulados',
    'Não-supervisionado': 'Aprende padrões sem rótulos (ex: clustering)',
    'Reinforcement Learning': 'Aprende por recompensa/punição',
    'Temperature': 'Aleatoriedade da resposta. Baixa = factual. Alta = criativa',
    'Top-p': 'Nucleus sampling — amostra de tokens que somam probabilidade p',
    'Top-k': 'Amostra dos K tokens mais prováveis',
    'Zero-shot': 'Prompt sem exemplo',
    'Few-shot': 'Prompt com poucos exemplos',
    'SageMaker Clarify': 'Detecta viés e gera explicações (XAI)',
    'Fairness': 'Imparcialidade — decisões similares pra casos similares',
    'Explicabilidade (XAI)': 'Entender POR QUE o modelo decidiu assim',
    'Amazon Q Business': 'Assistente corporativo de Q&A interno',
    'Amazon Q Developer': 'Copiloto de código (ex-CodeWhisperer)',
    'Classificação': 'Saída categórica (gato/cachorro)',
    'Regressão': 'Saída numérica contínua (preço, temperatura)',
    'Vector Database': 'BD pra embeddings + busca por similaridade',
    'IAM': 'Identity and Access Management — controle de acesso',
    'KMS': 'Key Management Service — gerencia chaves de criptografia',
    'Acurácia': 'Acertos / total — pode mentir em dataset desbalanceado',
    'Precision': 'Dos que disse positivo, quantos eram?',
    'Recall': 'Dos positivos reais, quantos peguei?',
    'F1-Score': 'Média harmônica entre precision e recall',
    'Matriz de Confusão': 'Tabela VP/FP/VN/FN das classificações',
    'ROC / AUC': 'Curva e área sob ela — qualidade global do classificador',
    'RMSE': 'Raiz do erro quadrático médio (regressão)',
    'MSE': 'Erro quadrático médio (regressão)',
    'R²': 'Variância explicada pelo modelo (regressão)',
    'Overfitting': 'Decora o treino, falha em dados novos',
    'Underfitting': 'Modelo simples demais, erra até no treino',
    'Bias-Variance': 'Tradeoff entre erro sistemático e instabilidade',
    'Tokens': 'Unidades de texto — preço é por token',
    'Tokenização': 'Quebrar texto em tokens',
    'Transformer': 'Arquitetura por trás dos LLMs modernos',
    'Multimodal': 'Modelo que processa texto + imagem + áudio',
    'GAN': 'Generative Adversarial Network — gerador vs discriminador',
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
    'Toxicidade': 'Conteúdo ofensivo — bloqueia com Guardrails',
    'Model Cards': 'Documentação estruturada do modelo (governança)',
    'Transparência': 'Saber como o modelo foi treinado e suas limitações',
    'VPC Endpoints': 'PrivateLink — tráfego AWS sem internet pública',
    'CloudTrail': 'Auditoria — quem chamou que API quando',
    'CloudWatch': 'Monitoramento e métricas de recursos AWS',
    'Macie': 'Descoberta automatizada de PII em S3',
    'GDPR': 'Lei europeia de proteção de dados',
    'Compliance': 'Estar de acordo com normas e leis',
    'S3 Bucket Policy': 'Policy a nível de bucket no S3',
    'Pipeline ML': 'Sequência de passos de um sistema de ML',
    'Feature Engineering': 'Transformar dados brutos em features úteis',
    'K-NN': 'K-Nearest Neighbors — classifica pelo "vizinho mais parecido"',
    'Árvore de Decisão': 'Modelo if/else aprendido dos dados',
    'Cross-validation': 'Validação dividindo o dataset em K dobras',
    'SLM': 'Small Language Model — menor, mais rápido, mais barato',
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
    'HIPAA': 'Lei de saúde dos EUA — privacidade médica',
    'PII': 'Personally Identifiable Information — dados pessoais'
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
// 8. FAB "Treinar agora" — esconde no topo, aparece ao rolar
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
