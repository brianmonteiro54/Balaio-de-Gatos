/* =========================================================
   AULA 14 · BEDROCK, PLAYGROUND E DÍVIDA TÉCNICA
   - Painel de dívida técnica (clica nos gatos, vê impacto)
   - Termômetro de dívida
   - Bedrock Playground simulado (modelos, temperature, top-p)
   - Calculadora sob-demanda (req/dia, tokens, custo/mês)
   - Decisor visual (5 perguntas → modo recomendado)
   ========================================================= */


/* ═══════════════════════════════════════
   1. DÍVIDA TÉCNICA · gatos clicáveis + termômetro
   ═══════════════════════════════════════ */
(function debtPanel(){
  const DEBT = {
    model: {
      icon:'🪨', tag:'Modelo',
      title:'Modelo congelado em uma versão antiga',
      desc:'Você escolheu Claude 2 em 2023 e nunca mais trocou. Saiu Claude 3.5 Sonnet, Haiku, Opus 4: todos mais baratos e melhores. Você continua pagando mais por menos.',
      impact:'Custo por token até 3× maior que o ideal. Latência pior. Capacidades que economizariam prompt (multimodal, ferramenta) você não usa porque o modelo antigo não suporta.',
      fix:'Bedrock permite trocar de modelo mudando uma string (model id). Avalie cada release. Use <strong>Bedrock Model Evaluation</strong> pra comparar versões com seu próprio dataset.'
    },
    prompt: {
      icon:'📜', tag:'Prompt',
      title:'Prompt hardcoded no código, sem versionamento',
      desc:'O prompt do sistema mora no meio do JS, sem versão, sem teste, sem histórico. Quando alguém edita "só pra ajustar uma vírgula", a conversão cai 12% e ninguém sabe o que aconteceu.',
      impact:'Mudanças de prompt vão pra produção sem revisão. Não dá pra fazer A/B test. Não dá pra rollback. Comportamento muda silenciosamente.',
      fix:'Use <strong>Bedrock Prompt Management</strong> pra versionar prompts. Trate prompt como código: revisão, teste, deploy, rollback. Roda <strong>Model Evaluation</strong> antes de promover.'
    },
    eval: {
      icon:'🤷', tag:'Avaliação',
      title:'Sem avaliação sistemática da saída',
      desc:'O sistema responde, o usuário às vezes reclama, o time "olha algumas amostras" e acha que está bom. Sem métrica, sem benchmark, sem ground truth.',
      impact:'Regressões silenciosas (modelo piorou, ninguém percebe). Decisões por achismo. Quando aparece bug grave, não há baseline pra comparar.',
      fix:'<strong>Bedrock Model Evaluation</strong> roda benchmark automatizado e/ou avaliação humana. Métricas como ROUGE, BLEU, BERTScore. Crie um dataset de regressão fixo e rode em todo deploy.'
    },
    guard: {
      icon:'🚪', tag:'Guardrails',
      title:'Output cru entregue ao usuário sem filtro',
      desc:'O modelo gera o que quiser e isso vai direto pra interface. PII vaza, toxicidade passa, prompt injection ganha jackpot, o cliente vê informação privilegiada.',
      impact:'Risco legal (LGPD, GDPR), reputacional e de segurança. Um único caso vira manchete. Auditoria reprova.',
      fix:'<strong>Bedrock Guardrails</strong> filtra entrada e saída: tópicos proibidos, toxicidade, PII (CPF, e-mail), jailbreak. Aplica antes do prompt e antes da resposta. Configurável por aplicação.'
    },
    rag: {
      icon:'📚', tag:'RAG',
      title:'Vector database desatualizado',
      desc:'Você implementou RAG em janeiro, indexou os documentos e nunca mais. Hoje é julho e o modelo responde sobre versões antigas, política revogada, número de telefone errado.',
      impact:'Alucinação <em>parecendo</em> correta porque o modelo cita o "documento", só que o documento está obsoleto. Pior que não ter RAG: dá falsa confiança.',
      fix:'Pipeline de re-ingestão automática. <strong>Bedrock Knowledge Bases</strong> sincroniza com S3/SharePoint. Defina TTL. Monitore taxa de uso de cada chunk e remova os que ninguém acessa.'
    },
    cost: {
      icon:'💸', tag:'Custo',
      title:'Sem controle nem alerta de custo',
      desc:'Pricing por token escala silencioso. Um usuário envia um PDF de 200 páginas no prompt e o custo da requisição vai pra US$ 4. Multiplica por mil clientes diários e você descobre o estrago no fim do mês.',
      impact:'Fatura imprevisível. CFO não te ama. Cortes emergenciais quebram experiência. Sem dado pra negociar Provisioned vs On-Demand.',
      fix:'<strong>CloudWatch Metrics</strong> de InvocationLatency e InputTokens. Alarmes por modelo. Logs de uso por cliente/feature. Cota por usuário no aplicativo.'
    },
    log: {
      icon:'🕵️', tag:'Auditoria',
      title:'Sem audit trail das chamadas',
      desc:'Aconteceu algo errado em produção. Quem chamou? Quando? Com qual prompt? Com qual resposta? Ninguém sabe. Os logs estão em Lambdas que rotacionaram, prompts não foram salvos por causa de "PII".',
      impact:'Forense impossível. Compliance reprova (auditoria precisa de rastro). Bug crítico não dá pra reproduzir nem entender.',
      fix:'<strong>CloudTrail</strong> rastreia chamadas a APIs do Bedrock. Salve prompts e respostas (com PII redacted) em S3 com retenção. Use <strong>Model Cards</strong> pra documentar comportamento esperado.'
    },
    lock: {
      icon:'🔒', tag:'Lock-in',
      title:'Vendor lock-in cego, um modelo só',
      desc:'Toda a aplicação assume Claude Sonnet. Provider muda preço, tira o modelo do ar, ou outro fica melhor. Você não tem fallback nem migração testada.',
      impact:'Risco operacional alto. Sem alavanca de negociação. Migração emergencial sob pressão sai mal e cara.',
      fix:'Bedrock <strong>já oferece</strong> múltiplos providers atrás da mesma API. Abstraia chamadas atrás de uma camada interna. Teste fallback periodicamente. Mantenha um <em>champion + challenger</em>.'
    }
  };

  const grid = document.getElementById('debt-grid');
  const detail = document.getElementById('debt-detail');
  const counter = document.getElementById('debt-counter');
  const fill = document.getElementById('debt-fill');
  if(!grid || !detail) return;

  const selected = new Set();

  function showDetail(key){
    const d = DEBT[key];
    if(!d){
      detail.innerHTML = `<div class="debt-empty"><span class="big">👈</span><p>Clica num gato pra ver o tipo de dívida.</p></div>`;
      return;
    }
    detail.innerHTML = `
      <span class="dd-tag">${d.tag}</span>
      <span class="dd-icon">${d.icon}</span>
      <h3>${d.title}</h3>
      <p class="dd-desc">${d.desc}</p>
      <div class="dd-impact"><strong>💥 Impacto em produção:</strong> ${d.impact}</div>
      <div class="dd-fix"><strong>🛠️ Como o Bedrock ajuda:</strong> ${d.fix}</div>
    `;
  }

  function updateMeter(){
    const total = Object.keys(DEBT).length;
    const n = selected.size;
    const pct = Math.round((n / total) * 100);
    fill.style.width = pct + '%';
    if(n === 0){
      counter.textContent = 'Selecione os itens que existem no seu projeto';
    } else if(n <= 2){
      counter.innerHTML = `<strong style="color:var(--olive)">🟢 Saudável</strong> · ${n}/${total} dívidas. Continue assim.`;
    } else if(n <= 5){
      counter.innerHTML = `<strong style="color:#C28A00">🟡 Cuidado</strong> · ${n}/${total} dívidas. Tem coisa pra arrumar.`;
    } else {
      counter.innerHTML = `<strong style="color:var(--coral)">🔴 Crítico</strong> · ${n}/${total} dívidas. Para de adicionar feature e paga essa conta.`;
    }
  }

  grid.querySelectorAll('.debt-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.debt;
      // toggle visual de "selecionado" para o termômetro
      if(selected.has(key)){
        selected.delete(key);
        btn.classList.remove('selected');
      } else {
        selected.add(key);
        btn.classList.add('selected');
      }
      updateMeter();
      showDetail(key);
    });
  });

  updateMeter();
})();


/* ═══════════════════════════════════════
   2. PLAYGROUND simulado
   ═══════════════════════════════════════ */
(function playground(){
  const SYSTEM_PROMPTS = {
    vet: {
      label:'Veterinário', emoji:'🩺',
      user:'Tenho um gato persa de 8 anos com tosse seca há 2 dias. Devo levar ao veterinário?',
      // respostas por temperature (baixa, média, alta) e por modelo
      responses: {
        low: 'Sim, recomendo agendar consulta veterinária em até 24h. Tosse seca persistente em gato sênior pode indicar (1) doença respiratória superior, (2) asma felina, (3) problema cardíaco. Antes da consulta: observe se há dispneia, secreção nasal, perda de apetite ou letargia. Mantenha o ambiente sem poeira ou aerossóis até a avaliação.',
        med: 'Em gato de 8 anos com tosse seca por 2 dias, é prudente procurar avaliação veterinária nos próximos dias. As causas mais comuns são problemas respiratórios, asma felina ou condições cardíacas. Observe sinais como dificuldade pra respirar, falta de apetite, ou letargia, e evite ambientes empoeirados. Se piorar, procure atendimento de urgência.',
        high: 'Tosse seca em gato sênior é tipo aviso silencioso do organismo. Pode ser nada (gato engasgou com pelo, tava arranhando a garganta) ou pode ser asma, problema cardíaco, ou infecção respiratória. Eu, na sua pele, marcava uma consulta pra essa semana. Enquanto isso: ambiente arejado, sem produto químico no ar, observa se ele tá comendo e se cansa fácil. Se aparecer respiração ofegante ou lábios azulados, é emergência: corre pro pronto-atendimento.'
      }
    },
    poet: {
      label:'Poeta de gatos', emoji:'🎭',
      user:'Escreva um pequeno poema sobre um gato preto que dorme na janela ao meio-dia.',
      responses: {
        low: 'No parapeito, o gato preto dorme.\nO sol do meio-dia o aquece.\nSeus bigodes tremem suavemente.\nO mundo gira, ele permanece.',
        med: 'Sentinela de pelagem noturna,\ndorme onde o sol do meio-dia escreve.\nA janela é seu trono provisório.\nO mundo ruge, ele apenas ronrona.',
        high: 'Carvão & sol, paradoxo de quatro patas.\nNa janela onde a tarde estaciona,\no gato preto vira poesia e bocejo,\nrelógio de areia que ronrona contra o tempo.\nDorme o gato, e o universo, gentilmente, espera.'
      }
    },
    aws: {
      label:'Especialista AWS', emoji:'☁️',
      user:'Preciso de chatbot que responda sobre os documentos internos da minha empresa, atualizados toda semana. Que arquitetura AWS recomenda?',
      responses: {
        low: 'Use Amazon Bedrock Knowledge Bases com S3 como fonte de documentos. Configure ingestão semanal automática via EventBridge. Use OpenSearch Serverless como vector store, embeddings via Amazon Titan ou Cohere. Aplique Bedrock Guardrails pra filtrar PII e toxicidade. Acesso via IAM, criptografia via KMS, audit via CloudTrail.',
        med: 'A arquitetura padrão pra esse caso: Bedrock Knowledge Bases conectado a S3 onde ficam seus PDFs. Sincronização automática semanal via EventBridge. Vector store: OpenSearch Serverless. Modelo: Claude Sonnet ou Llama. Coloque Guardrails na frente pra filtrar conteúdo, IAM pra controle de acesso e CloudTrail pra auditoria. Pra latência baixa em produção, considere Provisioned Throughput.',
        high: 'Bora! Receita: Bedrock Knowledge Bases é a estrela. Joga seus PDFs no S3, aponta o KB pra esse bucket, escolhe um vector store (OpenSearch Serverless é o caminho de menor atrito), define embeddings (Titan é solido, Cohere também). Pra atualização semanal, EventBridge dispara re-ingestão. Coloca Guardrails na entrada e saída pra dormir tranquilo. IAM, KMS, CloudTrail formam o trio de segurança. Se for tráfego pesado, sai do On-Demand e vai pra Provisioned Throughput.'
      }
    },
    code: {
      label:'Code reviewer', emoji:'💻',
      user:'Revise: const sum = (a, b) => { return a + b }',
      responses: {
        low: 'Função correta. Sugestões: (1) remova as chaves e o return: uma arrow function com expressão única dispensa: `const sum = (a, b) => a + b`. (2) considere validação de tipos via TypeScript ou JSDoc.',
        med: 'A função está funcional, mas pode ficar mais idiomática. Em arrow function de uma linha, o `return` e as chaves são desnecessários: `const sum = (a, b) => a + b`. Se quiser robustez, adicione tipagem (TypeScript) ou JSDoc, e considere o caso de inputs não-numéricos.',
        high: 'Funciona, mas tá usando smoking pra ir na padaria. Em vez de `(a, b) => { return a + b }`, escreve `(a, b) => a + b`. Um charme. Bonus: se sua codebase usa TypeScript, tipa: `(a: number, b: number): number => a + b`. Se aceita objetos, valida. Se vai virar lib, exporta com docstring. Se é só pra somar dois inteiros uma vez no projeto inteiro, deixa quieto e vai pra próxima task.'
      }
    }
  };

  const MODEL_INFO = {
    haiku: { name:'Claude Haiku', costPerKtokIn:0.00025, costPerKtokOut:0.00125, latencyMs:380 },
    sonnet:{ name:'Claude Sonnet', costPerKtokIn:0.003,   costPerKtokOut:0.015,   latencyMs:850 },
    opus:  { name:'Claude Opus',   costPerKtokIn:0.015,   costPerKtokOut:0.075,   latencyMs:1700 }
  };

  const els = {
    temp: document.getElementById('pg-temp'),
    tempV: document.getElementById('pg-temp-v'),
    topp: document.getElementById('pg-topp'),
    toppV: document.getElementById('pg-topp-v'),
    max: document.getElementById('pg-max'),
    maxV: document.getElementById('pg-max-v'),
    sys: document.getElementById('pg-sys'),
    user: document.getElementById('pg-user-prompt'),
    response: document.getElementById('pg-response'),
    meta: document.getElementById('pg-meta'),
    stats: document.getElementById('pg-stats'),
    tokIn: document.getElementById('pg-tok-in'),
    tokOut: document.getElementById('pg-tok-out'),
    cost: document.getElementById('pg-cost'),
    latency: document.getElementById('pg-latency'),
    run: document.getElementById('pg-run')
  };
  if(!els.run) return;

  let currentModel = 'haiku';

  function updateLabels(){
    els.tempV.textContent = (els.temp.value / 100).toFixed(2);
    els.toppV.textContent = (els.topp.value / 100).toFixed(2);
    els.maxV.textContent = els.max.value;
    const info = MODEL_INFO[currentModel];
    els.meta.textContent = `${info.name} · t=${(els.temp.value/100).toFixed(2)}`;
  }

  function updateUserPrompt(){
    const sys = SYSTEM_PROMPTS[els.sys.value];
    if(sys && els.user){
      els.user.textContent = sys.user;
    }
  }

  // estima tokens (~ 4 chars / token, simplificado)
  function estimateTokens(text){
    return Math.max(1, Math.round(text.length / 4));
  }

  function pickResponseLevel(temp){
    if(temp < 0.34) return 'low';
    if(temp < 0.7) return 'med';
    return 'high';
  }

  function typewriter(text, container, onDone){
    container.innerHTML = '';
    container.appendChild(document.createTextNode(''));
    const cursor = document.createElement('span');
    cursor.className = 'typing';
    container.appendChild(cursor);

    let i = 0;
    const speed = currentModel === 'haiku' ? 8 : currentModel === 'sonnet' ? 14 : 22;
    const tick = () => {
      if(i >= text.length){
        cursor.remove();
        onDone();
        return;
      }
      const chunk = text.slice(i, i + 3); // 3 chars por tick
      i += 3;
      container.firstChild.textContent += chunk;
      setTimeout(tick, speed);
    };
    tick();
  }

  function run(){
    const sysKey = els.sys.value;
    const sys = SYSTEM_PROMPTS[sysKey];
    const temp = parseFloat(els.temp.value) / 100;
    const maxTok = parseInt(els.max.value);
    const level = pickResponseLevel(temp);
    let response = sys.responses[level];

    // respeita max tokens
    const respTokens = Math.min(estimateTokens(response), maxTok);
    if(respTokens < estimateTokens(response)){
      response = response.slice(0, maxTok * 4) + '... [truncado por max_tokens]';
    }

    const inTokens = estimateTokens(sys.user);
    const outTokens = estimateTokens(response);
    const info = MODEL_INFO[currentModel];
    const cost = (inTokens / 1000) * info.costPerKtokIn + (outTokens / 1000) * info.costPerKtokOut;
    // latência: base do modelo + variação proporcional ao output e à temp (mais aleatório a temp alta)
    const latency = Math.round(info.latencyMs + outTokens * 1.2 + temp * 200);

    els.run.disabled = true;
    els.stats.hidden = true;
    els.response.innerHTML = '<em class="pg-placeholder">gerando...</em>';

    setTimeout(() => {
      typewriter(response, els.response, () => {
        els.tokIn.textContent = inTokens;
        els.tokOut.textContent = outTokens;
        els.cost.textContent = '$' + cost.toFixed(4);
        els.latency.textContent = latency + ' ms';
        els.stats.hidden = false;
        els.run.disabled = false;
      });
    }, 200);
  }

  // bind controles
  document.querySelectorAll('.pg-model').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.pg-model').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      currentModel = b.dataset.model;
      updateLabels();
    });
  });
  els.temp.addEventListener('input', updateLabels);
  els.topp.addEventListener('input', updateLabels);
  els.max.addEventListener('input', updateLabels);
  els.sys.addEventListener('change', updateUserPrompt);
  els.run.addEventListener('click', run);

  updateLabels();
  updateUserPrompt();
})();


/* ═══════════════════════════════════════
   3. CALCULADORA SOB-DEMANDA
   ═══════════════════════════════════════ */
(function pricingSim(){
  const PRICING = {
    haiku:  { in:0.00025, out:0.00125, name:'Haiku' },
    sonnet: { in:0.003,   out:0.015,   name:'Sonnet' },
    opus:   { in:0.015,   out:0.075,   name:'Opus' },
    llama:  { in:0.00072, out:0.00072, name:'Llama 70B' }
  };

  const els = {
    req: document.getElementById('sim-req'),
    reqV: document.getElementById('sim-req-v'),
    inT: document.getElementById('sim-in'),
    inV: document.getElementById('sim-in-v'),
    outT: document.getElementById('sim-out'),
    outV: document.getElementById('sim-out-v'),
    model: document.getElementById('sim-model'),
    day: document.getElementById('sim-day'),
    month: document.getElementById('sim-month'),
    tokens: document.getElementById('sim-tokens'),
    tpm: document.getElementById('sim-tpm'),
    warn: document.getElementById('sim-warn')
  };
  if(!els.req) return;

  function fmt(n){
    return n.toLocaleString('pt-BR', { minimumFractionDigits:2, maximumFractionDigits:2 });
  }
  function fmtNum(n){
    if(n >= 1e9) return (n/1e9).toFixed(1) + 'B';
    if(n >= 1e6) return (n/1e6).toFixed(1) + 'M';
    if(n >= 1e3) return (n/1e3).toFixed(1) + 'k';
    return Math.round(n).toLocaleString('pt-BR');
  }

  function calc(){
    const req = parseInt(els.req.value);
    const inT = parseInt(els.inT.value);
    const outT = parseInt(els.outT.value);
    const model = PRICING[els.model.value];

    els.reqV.textContent = req.toLocaleString('pt-BR');
    els.inV.textContent = inT.toLocaleString('pt-BR');
    els.outV.textContent = outT.toLocaleString('pt-BR');

    const inTokensDay = req * inT;
    const outTokensDay = req * outT;
    const totalTokensDay = inTokensDay + outTokensDay;

    const costDay = (inTokensDay/1000) * model.in + (outTokensDay/1000) * model.out;
    const costMonth = costDay * 30;
    const tokensMonth = totalTokensDay * 30;
    const tpm = Math.round(totalTokensDay / (24 * 60));

    els.day.textContent = 'US$ ' + fmt(costDay);
    els.month.textContent = 'US$ ' + fmt(costMonth);
    els.tokens.textContent = fmtNum(tokensMonth);
    els.tpm.textContent = fmtNum(tpm);

    // alerta inteligente
    let warn = '', cls = '';
    if(costMonth > 50000){
      warn = `🚨 <strong>Custo mensal acima de US$ 50k.</strong> Pra esse volume, <strong>Provisioned Throughput</strong> quase certamente sai mais barato e dá throughput dedicado. Faça o cálculo de TCO comparado.`;
      cls = 'danger';
    } else if(costMonth > 10000){
      warn = `⚠️ <strong>Custo mensal acima de US$ 10k.</strong> Compare com Provisioned Throughput, especialmente se o tráfego é constante. Vale negociar Savings Plans com a AWS.`;
      cls = 'warn';
    } else if(tpm > 5000){
      warn = `⚠️ <strong>${fmtNum(tpm)} tokens/min</strong> é alto pra On-Demand. Verifique limites de throttling do modelo escolhido na sua região. Considere Provisioned se tem picos.`;
      cls = 'warn';
    } else if(req <= 1000 && costMonth < 100){
      warn = `✅ <strong>Volume baixo + custo baixo.</strong> On-Demand é o caminho. Não comprometa em Provisioned ainda.`;
      cls = 'ok';
    } else {
      warn = `✅ Volume e custo estão na zona típica de On-Demand. Monitore métricas pra ver se compensa migrar conforme cresce.`;
      cls = 'ok';
    }

    els.warn.className = 'sim-warn show ' + cls;
    els.warn.innerHTML = warn;
  }

  ['req','inT','outT'].forEach(k => els[k].addEventListener('input', calc));
  els.model.addEventListener('change', calc);
  calc();
})();


/* ═══════════════════════════════════════
   4. DECISOR · 5 perguntas
   ═══════════════════════════════════════ */
(function decisor(){
  const root = document.getElementById('decisor');
  const result = document.getElementById('dec-result');
  if(!root || !result) return;

  const answers = {};
  const totalQ = root.querySelectorAll('.dec-q').length;

  function recommend(){
    if(Object.keys(answers).length < totalQ){
      const missing = totalQ - Object.keys(answers).length;
      result.className = 'dec-result';
      result.innerHTML = `
        <span class="dec-bubble">🐈</span>
        <h3>Faltam ${missing} resposta${missing===1?'':'s'}</h3>
        <p>Continue respondendo. O gato analisa cada cenário e te diz o melhor modo de cobrança.</p>
      `;
      return;
    }

    // Heurística: soma os pesos
    const total = Object.values(answers).reduce((a,b) => a + b, 0);
    // total mínimo = 5, máximo = 15
    // <= 7  → On-Demand claro
    // 8-10  → Misto / depende
    // >= 11 → Provisioned claro

    // Se usa modelo custom (q4=3), Provisioned é obrigatório
    const usesCustom = answers.custom === 3;

    if(usesCustom){
      result.className = 'dec-result provisioned';
      result.innerHTML = `
        <span class="dec-bubble">🏗️</span>
        <span class="dec-tag">Provisioned obrigatório</span>
        <h3>Provisioned Throughput</h3>
        <p>Você indicou que usa modelo <strong>custom</strong> (fine-tuned ou imported). No Bedrock, modelos custom <strong>só rodam em Provisioned Throughput</strong>. Não tem opção On-Demand pra eles.</p>
        <ul class="dec-list">
          <li>Compre Model Units com compromisso de 1 ou 6 meses</li>
          <li>Dimensione pelo TPM esperado de pico</li>
          <li>Use CloudWatch pra monitorar utilização</li>
        </ul>
      `;
      return;
    }

    if(total <= 7){
      result.className = 'dec-result on-demand';
      result.innerHTML = `
        <span class="dec-bubble">💸</span>
        <span class="dec-tag">Recomendação clara</span>
        <h3>Sob-Demanda (On-Demand)</h3>
        <p>Seu cenário tem volume modesto, tráfego irregular e nenhum SLA crítico de latência. <strong>Pague só por token</strong>, sem compromisso.</p>
        <ul class="dec-list">
          <li>Comece já, sem reservas</li>
          <li>Monitore custo mensal pra detectar crescimento</li>
          <li>Reavalie quando o uso virar 24/7 ou bater em throttling</li>
        </ul>
      `;
    } else if(total <= 10){
      result.className = 'dec-result mixed';
      result.innerHTML = `
        <span class="dec-bubble">🤔</span>
        <span class="dec-tag">Cenário misto</span>
        <h3>Comece On-Demand, planeje migração</h3>
        <p>Você está numa zona cinza. Tem volume e exigências, mas talvez não o suficiente pra justificar compromisso de Provisioned hoje.</p>
        <ul class="dec-list">
          <li>Lance em On-Demand pra coletar dados reais</li>
          <li>Monitore TPM, custo e throttling por 30,60 dias</li>
          <li>Calcule break-even Provisioned vs On-Demand com dados reais</li>
          <li>Migre quando o cálculo justificar (geralmente acima de 10k req/dia constantes)</li>
        </ul>
      `;
    } else {
      result.className = 'dec-result provisioned';
      result.innerHTML = `
        <span class="dec-bubble">🏗️</span>
        <span class="dec-tag">Recomendação clara</span>
        <h3>Provisioned Throughput</h3>
        <p>Volume alto, tráfego constante e/ou SLA rígido. Reservar capacidade dedicada vai dar previsibilidade de custo, latência consistente e zero throttling até o limite contratado.</p>
        <ul class="dec-list">
          <li>Comece com 1 mês de compromisso pra calibrar</li>
          <li>Dimensione com base no TPM de pico, não no médio</li>
          <li>Combine com On-Demand pra absorver picos imprevistos (estratégia híbrida)</li>
        </ul>
      `;
    }
  }

  root.querySelectorAll('.dec-q').forEach(q => {
    const key = q.dataset.q;
    q.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        q.querySelectorAll('button').forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
        q.classList.add('answered');
        answers[key] = parseInt(b.dataset.v);
        recommend();
      });
    });
  });
})();
