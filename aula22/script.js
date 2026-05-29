/* =========================================================
   AULA 22 · LOGGING, MODEL CARDS, FINE-TUNING, HIPERPARÂMETROS, PROMPT × RAG × FT
   ========================================================= */


/* ═══════════════════════════════════════
   1. LOG STREAM ao vivo
   ═══════════════════════════════════════ */
(function logStream(){
  const list = document.getElementById('log-list');
  const detail = document.getElementById('log-detail');
  const pause = document.getElementById('log-pause');
  if(!list) return;

  const TEMPLATES = [
    { level:'OK', msg:'InvokeEndpoint · 200 · latency=<b>87ms</b>',
      data:{ requestId:'a4f2-901b', model:'cat-finder-v3.2', latencyMs:87, statusCode:200, user:'app-prod-role',
             input:'<imagem 240x240 jpg>', output:{label:'cat',score:0.94} },
      ch:'cloudtrail+cloudwatch+capture' },
    { level:'AUDIT', msg:'CloudTrail · IAM=<b>BedrockInvokeRole</b> · model=Claude-Sonnet',
      data:{ eventName:'InvokeModel', userIdentity:'arn:aws:iam::1234:role/BedrockInvokeRole', sourceIPAddress:'10.0.4.21', userAgent:'aws-sdk-python/1.34', awsRegion:'sa-east-1' },
      ch:'cloudtrail' },
    { level:'OK', msg:'Bedrock · Claude · tokens=<b>1247 in / 384 out</b>',
      data:{ modelId:'anthropic.claude-3-sonnet', inputTokens:1247, outputTokens:384, latencyMs:1840, requestId:'b7e1-a3' },
      ch:'bedrock-logging' },
    { level:'WARN', msg:'Data drift detectado · feature=<b>peso_kg</b> · z=2.4',
      data:{ schedule:'hourly-check', metric:'kl-divergence', baseline:0.05, current:0.21, feature:'peso_kg', alarmId:'drift-cat-finder-2026-05' },
      ch:'monitor' },
    { level:'BLOCK', msg:'Guardrails · <b>HATE high</b> bloqueado',
      data:{ guardrailId:'gr-balaio-prod', filter:'CONTENT::HATE', severity:'HIGH', action:'BLOCKED', userId:'user-7821', input:'(redigido pelo Guardrails)' },
      ch:'guardrails' },
    { level:'OK', msg:'Comprehend · DetectPiiEntities · <b>3 PII</b> mascaradas',
      data:{ piiTypes:['EMAIL','CREDIT_DEBIT_NUMBER','BR_CPF'], confidence:[0.99,0.97,0.96], action:'MASK' },
      ch:'cloudwatch' },
    { level:'ERR', msg:'Endpoint <b>500</b> · timeout no upstream · req=c92f',
      data:{ statusCode:500, error:'UpstreamTimeoutError', latencyMs:30000, retries:2, requestId:'c92f-de4a' },
      ch:'cloudwatch+cloudtrail' },
    { level:'OK', msg:'Async inference · job=<b>j-441</b> concluído em S3',
      data:{ inferenceJobId:'j-441', input:'s3://bucket/in/441.mp4', output:'s3://bucket/out/441.json', durationS:142 },
      ch:'cloudwatch+capture' },
    { level:'AUDIT', msg:'Model Card <b>cat-finder-v3.2</b> aprovada',
      data:{ eventName:'UpdateModelCardStatus', from:'pending', to:'approved', approver:'arn:aws:iam::1234:user/risk-officer' },
      ch:'cloudtrail' },
    { level:'WARN', msg:'A2I · score=0.62 · enviado pra <b>revisão humana</b>',
      data:{ humanLoopId:'hl-99214', confidence:0.62, threshold:0.75, workflow:'cat-finder-review', estimatedSlaMin:30 },
      ch:'cloudwatch+capture' },
    { level:'OK', msg:'SageMaker Pipeline <b>retreino-mensal</b> step 4/8',
      data:{ pipelineExecutionArn:'arn:...:pipeline/cat-finder/execution/abc', step:'TrainModel', status:'Executing', elapsedMs:481000 },
      ch:'cloudwatch' }
  ];

  let paused = false;
  let counter = 0;
  let entries = [];

  function ts(){
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
  }

  function addEntry(){
    if(paused) return;
    const t = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const id = ++counter;
    const entry = { id, t: ts(), ...t };
    entries.push(entry);
    // mantém só últimos 50
    if(entries.length > 50){
      const old = entries.shift();
      const oldEl = list.querySelector(`[data-id="${old.id}"]`);
      if(oldEl) oldEl.remove();
    }

    const div = document.createElement('div');
    div.className = 'log-entry';
    div.dataset.id = id;
    div.innerHTML = `
      <span class="ts">${entry.t}</span>
      <span class="level ${entry.level}">${entry.level}</span>
      <span class="msg">${entry.msg}</span>
    `;
    div.addEventListener('click', () => showDetail(entry, div));
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
  }

  function showDetail(e, el){
    list.querySelectorAll('.log-entry').forEach(x => x.classList.remove('active'));
    el.classList.add('active');

    const channels = {
      cloudtrail:'CloudTrail',
      cloudwatch:'CloudWatch Logs',
      capture:'Data Capture (S3)',
      monitor:'Model Monitor',
      'bedrock-logging':'Bedrock Invocation Logging',
      guardrails:'Guardrails Trace'
    };
    const chs = e.ch.split('+').map(c => channels[c] || c);

    function fmt(obj, indent=0){
      const pad = '  '.repeat(indent);
      if(Array.isArray(obj)){
        return '[' + obj.map(v => `<span class="v">${typeof v === 'string' ? `"${v}"` : v}</span>`).join(', ') + ']';
      }
      if(typeof obj === 'object' && obj !== null){
        const lines = Object.entries(obj).map(([k,v]) => {
          const val = typeof v === 'object'
            ? fmt(v, indent+1)
            : typeof v === 'number'
              ? `<span class="num">${v}</span>`
              : typeof v === 'string'
                ? `<span class="v">"${v}"</span>`
                : `<span class="v">${v}</span>`;
          return `${pad}  <span class="k">"${k}"</span>: ${val}`;
        });
        return `{\n${lines.join(',\n')}\n${pad}}`;
      }
      return String(obj);
    }

    detail.innerHTML = `
      <h3>${e.level} · ${e.t}</h3>
      <p>${e.msg}</p>
      <h4>Payload</h4>
      <pre>${fmt(e.data)}</pre>
      <h4>Canais que registram este evento</h4>
      <div class="log-svc">${chs.map(c => `<span>${c}</span>`).join('')}</div>
    `;
  }

  pause.addEventListener('click', () => {
    paused = !paused;
    pause.textContent = paused ? '▶ continuar' : '⏸ pausar';
  });

  // Popula com 8 entradas iniciais
  for(let i = 0; i < 8; i++) addEntry();
  // Continua adicionando a cada ~2s
  setInterval(addEntry, 2200);
})();


/* ═══════════════════════════════════════
   2. LOG TYPES
   ═══════════════════════════════════════ */
(function logTypes(){
  const TYPES = {
    cloudtrail: {
      title:'📋 AWS CloudTrail',
      desc:'Registra <strong>chamadas de API</strong> em todos os serviços. Pra IA, é o seu papel-trilha de "quem invocou qual modelo, com qual role, de onde, quando". Não traz o conteúdo do prompt, pra isso você usa logging dedicado de cada serviço.',
      ops:['<strong>Eventos:</strong> InvokeModel, InvokeEndpoint, CreateTrainingJob, etc.','<strong>Identidade:</strong> userIdentity, sourceIPAddress, userAgent','<strong>Auditoria 90 dias</strong> (default) ou pra sempre se enviar pra S3','Integra com EventBridge pra alertas em tempo real','<strong>Não loga payload</strong> de inferência por padrão'],
      sample:`{\n  "<span class="k">eventName</span>": <span class="v">"InvokeModel"</span>,\n  "<span class="k">eventTime</span>": <span class="v">"2026-05-28T15:42:01Z"</span>,\n  "<span class="k">awsRegion</span>": <span class="v">"sa-east-1"</span>,\n  "<span class="k">userIdentity</span>": {\n    "<span class="k">type</span>": <span class="v">"AssumedRole"</span>,\n    "<span class="k">arn</span>": <span class="v">"arn:aws:sts::1234:assumed-role/AppRole/i-abc"</span>\n  },\n  "<span class="k">requestParameters</span>": {\n    "<span class="k">modelId</span>": <span class="v">"anthropic.claude-3-sonnet"</span>\n  }\n}`
    },
    cloudwatch: {
      title:'📊 CloudWatch Logs & Metrics',
      desc:'Logs da <strong>aplicação</strong> e métricas operacionais. É onde caem os <code>print()</code> do código de inferência, latências, erros 5xx, mensagens de container. Quem faz a app falar.',
      ops:['Log groups por endpoint / Lambda / training job','Métricas: Invocations, ModelLatency, OverheadLatency, Errors','Insights query (linguagem SQL-like)','Alarms via CloudWatch Alarms','Filtros métricos (criar métrica de log)'],
      sample:`<span class="k">2026-05-28T15:42:01.034Z</span> [INFO] InvocationsHandler started\n<span class="k">2026-05-28T15:42:01.087Z</span> [INFO] Predicted: cat (0.94)\n<span class="k">2026-05-28T15:42:01.121Z</span> [INFO] Returned 200 OK in 87ms\n\n<span class="num">CloudWatch Metric:</span> ModelLatency=87 (p95=152, p99=410)`
    },
    datacapture: {
      title:'📦 SageMaker Data Capture (S3)',
      desc:'<strong>Captura input + output completos</strong> das chamadas de inferência e armazena em S3. Vital pra retreinar, debugar regressões e responder auditoria com o payload original.',
      ops:['Liga no endpoint (real-time, batch, async)','% de sampling (1-100%)','Particionado por data/hora em S3','Input + output juntos no mesmo objeto','<strong>Pode conter PII</strong>: encrypt + access policies'],
      sample:`s3://bucket/capture/cat-finder/2026/05/28/15/\n├── 0001-c92f.jsonl\n│   {\n│     "<span class="k">eventTime</span>": <span class="v">"15:42:01Z"</span>,\n│     "<span class="k">input</span>": <span class="v">"&lt;b64-img-240x240&gt;"</span>,\n│     "<span class="k">output</span>": {\n│       "<span class="k">label</span>": <span class="v">"cat"</span>,\n│       "<span class="k">score</span>": <span class="num">0.94</span>\n│     }\n│   }\n└── 0002-a4f2.jsonl ...`
    },
    monitor: {
      title:'👀 SageMaker Model Monitor',
      desc:'Sobe em cima do Data Capture pra <strong>detectar drift</strong> e queda de qualidade. Compara stats do baseline com produção. Quatro tipos de monitor: data quality, model quality, bias drift e feature attribution drift.',
      ops:['Schedule (hora/dia) ou contínuo','Baseline gerado de dataset de referência','Constraint violations exportados pra S3','Integra com Clarify pra bias drift','Dispara CloudWatch alarm quando bate threshold'],
      sample:`{\n  "<span class="k">monitorScheduleName</span>": <span class="v">"cat-finder-quality"</span>,\n  "<span class="k">violations</span>": [\n    {\n      "<span class="k">feature</span>": <span class="v">"peso_kg"</span>,\n      "<span class="k">type</span>": <span class="v">"data_drift"</span>,\n      "<span class="k">distance</span>": <span class="num">0.21</span>,\n      "<span class="k">threshold</span>": <span class="num">0.10</span>\n    }\n  ]\n}`
    },
    bedrock: {
      title:'🟪 Bedrock Invocation Logging',
      desc:'Liga no console do Bedrock e <strong>todas as chamadas (prompts e respostas)</strong> vão pra CloudWatch Logs ou S3. Crítico pra auditoria, fine-tuning e debug. Cuidado: prompts costumam ter PII.',
      ops:['Liga em conta inteira ou por modelo','Destino: CloudWatch Logs ou S3','Inclui prompt, resposta, tokens, latência, modelo','Combine com Guardrails trace pra ver o que filtrou','Custo extra de storage'],
      sample:`{\n  "<span class="k">timestamp</span>": <span class="v">"15:42:01Z"</span>,\n  "<span class="k">accountId</span>": <span class="v">"1234"</span>,\n  "<span class="k">identity</span>": {\n    "<span class="k">arn</span>": <span class="v">"arn:...:role/AppRole"</span>\n  },\n  "<span class="k">modelId</span>": <span class="v">"anthropic.claude-3-sonnet"</span>,\n  "<span class="k">input</span>": {\n    "<span class="k">inputTokens</span>": <span class="num">1247</span>,\n    "<span class="k">prompt</span>": <span class="v">"Resuma este texto..."</span>\n  },\n  "<span class="k">output</span>": {\n    "<span class="k">outputTokens</span>": <span class="num">384</span>,\n    "<span class="k">completion</span>": <span class="v">"O texto descreve..."</span>\n  }\n}`
    },
    guardrails: {
      title:'🛡️ Bedrock Guardrails Trace',
      desc:'Mostra <strong>o que cada filtro do Guardrails detectou</strong> em cada chamada (input e output). Indispensável pra entender por que algo foi bloqueado, ajustar severidade e auditar moderação.',
      ops:['Trace por chamada · GUARDRAIL_INTERVENED','Detalhes por filtro: HATE, INSULTS, SEXUAL, VIOLENCE, MISCONDUCT, PROMPT_ATTACK','Mostra denied topics e PII detectada','Vai junto com a resposta da API','Combine com CloudWatch Logs Insights pra dashboards'],
      sample:`{\n  "<span class="k">guardrailIntervened</span>": <span class="num">true</span>,\n  "<span class="k">action</span>": <span class="v">"BLOCKED"</span>,\n  "<span class="k">filters</span>": [\n    {\n      "<span class="k">type</span>": <span class="v">"CONTENT_FILTER"</span>,\n      "<span class="k">subtype</span>": <span class="v">"HATE"</span>,\n      "<span class="k">severity</span>": <span class="v">"HIGH"</span>,\n      "<span class="k">action</span>": <span class="v">"BLOCKED"</span>\n    }\n  ],\n  "<span class="k">replacedOutput</span>": <span class="v">"Não posso ajudar com isso."</span>\n}`
    }
  };

  const detail = document.getElementById('logtype-detail');
  if(!detail) return;

  function render(key){
    const t = TYPES[key];
    if(!t) return;
    detail.innerHTML = `
      <div>
        <h3>${t.title}</h3>
        <p>${t.desc}</p>
        <h4>Pontos chave</h4>
        <ul>${t.ops.map(o => `<li>${o}</li>`).join('')}</ul>
      </div>
      <div>
        <div class="lt-sample">
          <strong>📄 Exemplo de evento</strong>
          <pre>${t.sample}</pre>
        </div>
      </div>
    `;
  }

  document.querySelectorAll('.logtype-card').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.logtype-card').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.l);
    });
  });
  render('cloudtrail');
})();



/* ═══════════════════════════════════════
   4. MODEL CARD BUILDER
   ═══════════════════════════════════════ */
(function modelCardBuilder(){
  const ids = ['mcb-name','mcb-version','mcb-status','mcb-risk','mcb-intended','mcb-not','mcb-acc','mcb-prec','mcb-rec','mcb-risks','mcb-mit'];
  const els = {};
  ids.forEach(id => els[id] = document.getElementById(id));
  const preview = document.getElementById('mcb-preview');
  if(!preview || !els['mcb-name']) return;

  function escapeHtml(s){
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }

  function render(){
    const name = els['mcb-name'].value || '(sem nome)';
    const version = els['mcb-version'].value || 'v1';
    const status = els['mcb-status'].value;
    const risk = els['mcb-risk'].value;
    const statusLabel = { draft:'Draft', pending:'Pending review', approved:'Approved', archived:'Archived' }[status];

    preview.innerHTML = `
      <div class="mcb-head">
        <div>
          <div class="mh-title">${escapeHtml(name)}</div>
          <div class="mh-meta">version <strong>${escapeHtml(version)}</strong> · risk: ${risk}</div>
        </div>
        <span class="mh-status ${status}">${statusLabel}</span>
      </div>
      <div class="mcb-body">
        <div class="mcb-section">
          <h5>Uso pretendido</h5>
          <p>${escapeHtml(els['mcb-intended'].value)}</p>
        </div>
        <div class="mcb-section">
          <h5>Uso NÃO pretendido</h5>
          <p>${escapeHtml(els['mcb-not'].value)}</p>
        </div>
        <div class="mcb-section">
          <h5>Métricas</h5>
          <div class="mcb-metrics">
            <div class="mcb-metric"><span>Acurácia</span><strong>${escapeHtml(els['mcb-acc'].value)}</strong></div>
            <div class="mcb-metric"><span>Precisão</span><strong>${escapeHtml(els['mcb-prec'].value)}</strong></div>
            <div class="mcb-metric"><span>Recall</span><strong>${escapeHtml(els['mcb-rec'].value)}</strong></div>
          </div>
        </div>
        <div class="mcb-section risk-${risk}">
          <h5>Riscos (rating: ${risk.toUpperCase()})</h5>
          <p>${escapeHtml(els['mcb-risks'].value)}</p>
        </div>
        <div class="mcb-section">
          <h5>Mitigações</h5>
          <p>${escapeHtml(els['mcb-mit'].value)}</p>
        </div>
      </div>
      <div class="mcb-foot">
        <span>SageMaker Model Card · ${new Date().toISOString().slice(0,10)}</span>
        <div class="mf-actions">
          <button>📤 Export PDF</button>
          <button>🔁 New version</button>
        </div>
      </div>
    `;
  }

  ids.forEach(id => {
    const el = els[id];
    if(!el) return;
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  render();
})();


/* ═══════════════════════════════════════
   6. FT TYPES
   ═══════════════════════════════════════ */
(function ftTypes(){
  const TYPES = {
    full: {
      title:'🔥 Full Fine-tuning',
      sub:'Atualiza TODOS os pesos do modelo',
      desc:'Pega o modelo pré-treinado e <strong>atualiza cada peso</strong> com seus dados. Mais poderoso, também o mais caro. Resultado: você tem um modelo customizado completo, totalmente seu.',
      stats:[
        { label:'% pesos atualizados', val:'100%' },
        { label:'Custo relativo', val:'💲💲💲💲' },
        { label:'Dado mínimo típico', val:'~10k+' }
      ],
      pros:['Performance máxima possível','Cobre qualquer adaptação (estilo, conhecimento, formato)','Modelo final é só seu'],
      cons:['Caro de treinar (centenas a milhares de GPU-hora)','Precisa muito dado de qualidade','Risco de catastrophic forgetting (esquece o que sabia)','Modelo grande pra hospedar'],
      use:'Empresas com recurso, dataset grande e necessidade de modelo proprietário (BloombergGPT, Meditron). Bedrock <strong>Custom Models</strong> faz isso por você.'
    },
    peft: {
      title:'🪶 PEFT / LoRA',
      sub:'Parameter-Efficient Fine-Tuning · atualiza só uma fração',
      desc:'Em vez de mexer em todos os bilhões de pesos, congela o modelo base e <strong>treina só pequenas matrizes adicionais</strong> (LoRA: low-rank adaptation). Mesma ideia, custo 10-100× menor.',
      stats:[
        { label:'% pesos atualizados', val:'~0.1-3%' },
        { label:'Custo relativo', val:'💲' },
        { label:'Dado mínimo típico', val:'~100-1k' }
      ],
      pros:['10-100× mais barato que full FT','Funciona com poucos exemplos','Múltiplos LoRAs por base (varia comportamento)','Sem catastrophic forgetting'],
      cons:['Performance ligeiramente menor que full FT (mas próximo)','Precisa hospedar base + LoRA juntos'],
      use:'<strong>Default moderno</strong> de fine-tuning. SageMaker JumpStart suporta. Bedrock Custom Models usa LoRA por baixo. Comece sempre por aqui.'
    },
    instruct: {
      title:'🎓 Instruction Tuning',
      sub:'Ensina o modelo a seguir instruções (supervised fine-tuning)',
      desc:'Variante de fine-tuning supervisionado em pares <code>(instrução, resposta ideal)</code>. <strong>Não é "ensinar conhecimento novo"</strong>, é ensinar o formato de "siga instruções genericamente". É como o ChatGPT virou "Chat" GPT.',
      stats:[
        { label:'Tipo de dado', val:'pares I/O' },
        { label:'Custo relativo', val:'💲💲' },
        { label:'Dataset típico', val:'1k-50k pares' }
      ],
      pros:['Modelo passa a seguir instruções genéricas','Output mais consistente em formato','Combina com PEFT/LoRA','Bom pra criar assistente de domínio'],
      cons:['Não adiciona conhecimento factual (use RAG)','Qualidade do dataset é tudo','Pode aprender vícios do dataset (ex.: "como modelo de IA, não posso...")'],
      use:'Criar variante "Chat" do FM. Ensinar formato fixo de resposta. Adaptar tom. Bedrock Custom Models suporta JSONL com pares <code>{"prompt":..., "completion":...}</code>.'
    },
    rlhf: {
      title:'🎯 RLHF · Reinforcement Learning from Human Feedback',
      sub:'Aprende com humanos comparando respostas',
      desc:'Mais sofisticado. Humanos <strong>ranqueiam</strong> respostas do modelo (A > B), você treina um <em>reward model</em> com isso, e usa RL (PPO) pra otimizar o modelo principal pra preferência humana. É como o Claude e o GPT-4 ficaram "alinhados".',
      stats:[
        { label:'Etapas', val:'3' },
        { label:'Custo relativo', val:'💲💲💲💲💲' },
        { label:'Dataset típico', val:'10k+ comparações' }
      ],
      pros:['Captura preferências humanas que regra não captura','Reduz toxicidade e alucinação','Modelo se torna mais "útil/seguro/honesto" (HHH)','Estado da arte em alinhamento'],
      cons:['Caro e complexo (3 modelos!)','Pode ficar "subserviente" (sycophancy)','Reward hacking (modelo aprende a enganar a métrica)','Difícil pra time pequeno fazer sozinho'],
      use:'Foundation Models de fronteira (Claude, GPT-4, Gemini). <strong>Variantes simples:</strong> DPO, RLAIF (AI ranquia em vez de humano).'
    }
  };

  const detail = document.getElementById('ftt-detail');
  if(!detail) return;

  function render(key){
    const t = TYPES[key];
    if(!t) return;
    detail.innerHTML = `
      <h3>${t.title}</h3>
      <div class="ftt-sub">${t.sub}</div>
      <p>${t.desc}</p>
      <div class="ftt-stats">
        ${t.stats.map(s => `<div class="ftt-stat"><span>${s.label}</span><strong>${s.val}</strong></div>`).join('')}
      </div>
      <h4>Prós</h4>
      <ul>${t.pros.map(p => `<li>${p}</li>`).join('')}</ul>
      <h4>Contras</h4>
      <ul>${t.cons.map(c => `<li>${c}</li>`).join('')}</ul>
      <h4>Use quando</h4>
      <p>${t.use}</p>
    `;
  }

  document.querySelectorAll('.ftt-card').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.ftt-card').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.t);
    });
  });
  render('full');
})();


/* ═══════════════════════════════════════
   7. FT PIPELINE
   ═══════════════════════════════════════ */
(function ftPipeline(){
  const STAGES = {
    dataset: {
      title:'1️⃣ Dataset',
      desc:'O ponto onde o seu FT vai brilhar ou falhar. Formato esperado é <strong>JSONL</strong> com pares de <code>prompt</code> + <code>completion</code> (ou <code>instruction</code> + <code>output</code>). Quantidade varia: ~100 pra LoRA simples, &gt; 10k pra full FT.',
      ops:['Diversidade > volume bruto','Cobertura dos casos extremos','Sem PII (limpe com Comprehend antes)','Versão imutável no S3 (nunca sobrescreva)','Mistura de formatos similares aos casos reais'],
      warn:'<strong>⚠️ Garbage in, garbage out</strong>. 1.000 exemplos bons batem 100.000 ruidosos. Revisão humana de amostra é obrigatória.',
      sample:`{"<span class="k">prompt</span>": <span class="v">"Resuma o caso clínico abaixo..."</span>, "<span class="k">completion</span>": <span class="v">"Felino macho castrado, 5 anos..."</span>}\n{"<span class="k">prompt</span>": <span class="v">"Classifique o sintoma..."</span>, "<span class="k">completion</span>": <span class="v">"trato urinário"</span>}`
    },
    split: {
      title:'2️⃣ Split treino/val/teste',
      desc:'Mesma regra do ML clássico: separe ANTES de qualquer iteração. Sem isso, você se engana sobre quão bom o modelo ficou.',
      ops:['Treino: 70-80% · Validação: 10-15% · Teste: 10-15%','Stratify por classe se desbalanceado','Time-based split em série temporal','Mantenha teste <em>intocado</em> até o final','Nunca tune nada olhando o teste']
    },
    hp: {
      title:'3️⃣ Hiperparâmetros',
      desc:'Defina antes de iniciar: <strong>learning rate</strong>, <strong>batch size</strong>, <strong>epochs</strong>, <strong>regularização</strong>. Para LoRA, ainda tem <code>rank</code> (8, 16, 32) e <code>alpha</code>. Bedrock e SageMaker têm valores default sensatos pra começar.',
      ops:['LR: 1e-4 a 3e-4 (com warmup)','Batch: o maior que cabe na GPU','Epochs: 3-10 com early stopping','LoRA rank: 8 ou 16 default','Use AMT pra refinar (Bayesian Search)']
    },
    train: {
      title:'4️⃣ Treino',
      desc:'Roda em GPU gerenciada. SageMaker / Bedrock provisionam, treinam, salvam <strong>checkpoints</strong> em S3 e desligam. Acompanhe loss em CloudWatch: se subir, há algo errado.',
      ops:['Mixed precision (FP16) pra economizar memória','Gradient checkpointing pra batch grande','Spot instances (até 90% off) com checkpoint','Parar se val loss não melhorar por N epochs (early stopping)','Salvar todos os checkpoints (pode precisar voltar)']
    },
    eval: {
      title:'5️⃣ Avaliação',
      desc:'Métricas no <strong>holdout</strong> + benchmarks de FM (MMLU, HellaSwag, TruthfulQA). Compare com a baseline (modelo sem FT). Se não melhorou ≥5pp, repensa.',
      ops:['Métrica principal pelo seu domínio (BLEU, ROUGE, exactMatch, F1)','Benchmark de capacidade geral pra detectar regression','Eval humano em sample de 100 casos','SageMaker Model Evaluation ou Bedrock Model Evaluation','Compare A/B contra base + outras variantes'],
      warn:'<strong>Catastrophic forgetting:</strong> modelo pode ter ficado bom no domínio mas pior em outras coisas. Avalie em ambos.'
    },
    deploy: {
      title:'6️⃣ Deploy',
      desc:'Hospedagem. Em <strong>Bedrock Custom Models</strong>, modelo customizado roda <strong>obrigatoriamente em Provisioned Throughput</strong> (capacidade reservada por hora). Em SageMaker, escolhe instância e modo (real-time, async, batch).',
      ops:['Bedrock: Provisioned Throughput · 1 ou 6 meses','SageMaker: instância GPU + auto-scaling','A/B test contra modelo base por algumas semanas','Versionamento no Model Registry','Fallback pro modelo base se algo quebrar']
    },
    monitor: {
      title:'7️⃣ Monitoramento',
      desc:'Modelo customizado também envelhece. Drift, degradação, conteúdo bloqueado. <strong>Regression test contínuo</strong>: roda dataset de teste fixo a cada release pra garantir que não regrediu.',
      ops:['Suite de regression: 50-100 prompts fixos','Compara saída atual vs baseline','Model Monitor pra drift de input','Guardrails Trace pra moderação','Loop de feedback pro próximo retreino']
    }
  };

  const detail = document.getElementById('ftpipe-detail');
  if(!detail) return;

  function render(key){
    const s = STAGES[key];
    if(!s) return;
    detail.innerHTML = `
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <h4>Pontos críticos</h4>
      <ul>${s.ops.map(o => `<li>${o}</li>`).join('')}</ul>
      ${s.sample ? `<h4>Exemplo</h4><pre>${s.sample}</pre>` : ''}
      ${s.warn ? `<div class="pd-warn">${s.warn}</div>` : ''}
    `;
  }

  document.querySelectorAll('.ftpipe-stage').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.ftpipe-stage').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.s);
    });
  });
  render('dataset');
})();



/* ═══════════════════════════════════════
   8. HYPERPARAMS LAB
   ═══════════════════════════════════════ */
(function hpLab(){
  const lr = document.getElementById('hp-lr');
  const bs = document.getElementById('hp-bs');
  const ep = document.getElementById('hp-ep');
  const dr = document.getElementById('hp-dr');
  const lrV = document.getElementById('hp-lr-v');
  const bsV = document.getElementById('hp-bs-v');
  const epV = document.getElementById('hp-ep-v');
  const drV = document.getElementById('hp-dr-v');
  const trainPath = document.getElementById('hp-train');
  const valPath = document.getElementById('hp-val');
  const verdict = document.getElementById('hp-verdict');
  const gapEl = document.getElementById('hp-gap');
  if(!lr) return;

  // mapeia slider 0-100 para learning rate logarítmico (1e-6 a 1e-2)
  function lrFromSlider(v){
    const min = -6, max = -2;
    const exp = min + (v / 100) * (max - min);
    return Math.pow(10, exp);
  }
  function bsFromSlider(v){
    // 2 a 512, log scale
    const min = Math.log(2), max = Math.log(512);
    return Math.round(Math.exp(min + (v / 100) * (max - min)));
  }

  function update(){
    const lrVal = lrFromSlider(parseFloat(lr.value));
    const bsVal = bsFromSlider(parseFloat(bs.value));
    const epVal = parseInt(ep.value);
    const drVal = parseFloat(dr.value) / 100;

    lrV.textContent = lrVal.toExponential(0).replace('e+0', 'e').replace('e-0', 'e-');
    bsV.textContent = bsVal;
    epV.textContent = epVal;
    drV.textContent = drVal.toFixed(2);

    // Modelo simplificado de loss:
    // - LR muito baixo -> loss alto e quase plano (underfit)
    // - LR muito alto -> loss explode (instável)
    // - LR ideal -> cai rápido
    // - epochs alto + dropout baixo + LR ok -> overfit (val sobe)

    // Gera curvas em N epochs
    const N = epVal;
    const trainPoints = [];
    const valPoints = [];

    // train loss inicial
    let trainLoss = 1.0;
    let valLoss = 1.0;
    let unstable = false;

    // taxa de queda baseada em LR
    // lr "ideal" ~ 1e-4 a 3e-4
    const lrLog = Math.log10(lrVal); // -6 a -2
    let dropRate;
    if(lrLog < -5){ dropRate = 0.02; } // muito lento
    else if(lrLog < -4){ dropRate = 0.10; } // lento
    else if(lrLog < -3){ dropRate = 0.25; } // ideal
    else if(lrLog < -2.5){ dropRate = 0.40; } // rápido demais
    else { dropRate = 1.5; unstable = true; } // explode

    // ruído pelo batch (pequeno = ruidoso)
    const noise = bsVal < 8 ? 0.06 : bsVal < 32 ? 0.025 : 0.008;

    // overfitting: val sobe se epochs alto e dropout baixo
    const overfitFactor = Math.max(0, (N - 5) / 25) * (1 - drVal * 2);

    // underfitting: dropout muito alto
    const underfitPenalty = Math.max(0, drVal - 0.5) * 0.6;

    for(let i = 0; i <= N; i++){
      if(unstable && i > 1){
        // diverge
        trainLoss = 1.5 + Math.random() * 0.3;
        valLoss = 1.5 + Math.random() * 0.3;
      } else {
        const decay = Math.exp(-dropRate * i);
        trainLoss = 0.05 + 0.95 * decay + (Math.random() - 0.5) * noise + underfitPenalty;
        valLoss = 0.10 + 0.90 * decay + (Math.random() - 0.5) * noise + underfitPenalty
                + overfitFactor * Math.max(0, i - 5) / 5 * 0.4;
      }
      trainLoss = Math.max(0.01, Math.min(1.5, trainLoss));
      valLoss = Math.max(0.01, Math.min(1.5, valLoss));
      trainPoints.push(trainLoss);
      valPoints.push(valLoss);
    }

    // Constrói path SVG (viewBox 480x320, área plot 50-460 x, 30-280 y)
    function pathD(points){
      return points.map((p, i) => {
        const x = 50 + (i / Math.max(1, points.length - 1)) * 410;
        const y = 30 + p * (250 / 1.5);
        return (i === 0 ? 'M' : 'L') + ` ${x.toFixed(1)} ${y.toFixed(1)}`;
      }).join(' ');
    }
    trainPath.setAttribute('d', pathD(trainPoints));
    valPath.setAttribute('d', pathD(valPoints));

    // Veredicto
    const finalTrain = trainPoints[trainPoints.length - 1];
    const finalVal = valPoints[valPoints.length - 1];
    const gap = finalVal - finalTrain;
    gapEl.textContent = gap.toFixed(2);

    let cls = 'sweet', tag = '⚖️ Bem ajustado',
        msg = 'Treino estável, val próximo de train. Sweet spot: <strong>treino converge e generaliza</strong>.';

    if(unstable){
      cls = 'unstable'; tag = '🌪️ Instável (explodiu)';
      msg = 'Learning rate alto demais: gradient explosion. Loss vira NaN. <strong>Reduza LR</strong> ou adicione gradient clipping.';
    } else if(finalTrain > 0.7){
      cls = 'under'; tag = '😴 Underfitting';
      msg = 'Loss não desceu. <strong>LR muito baixo</strong>, dropout alto demais ou poucos epochs. Modelo não conseguiu aprender o padrão.';
    } else if(gap > 0.30){
      cls = 'over'; tag = '😱 Overfitting';
      msg = 'Train baixo, val alto. Modelo decorou. <strong>Mais dropout</strong>, menos epochs (early stopping) ou mais dado.';
    } else if(gap > 0.15){
      cls = 'warn'; tag = '⚠️ Começando a overfitar';
      msg = 'Gap entre train e val abrindo. Ative <strong>early stopping</strong> ou aumente regularização.';
    } else if(noise > 0.04 && finalTrain > 0.4){
      cls = 'warn'; tag = '📉 Treino ruidoso';
      msg = '<strong>Batch pequeno</strong> deixa o gradiente oscilante. Aumente batch size ou suavize com gradient accumulation.';
    }

    verdict.innerHTML = `
      <span class="hv-tag ${cls}">${tag}</span>
      <p>${msg}</p>
    `;
  }

  [lr, bs, ep, dr].forEach(s => s.addEventListener('input', update));
  update();
})();


/* ═══════════════════════════════════════
   9. AMT
   ═══════════════════════════════════════ */
(function amt(){
  const STRAT = {
    random: {
      title:'🎲 Random Search',
      desc:'Sorteia combinações aleatórias do espaço de hiperparâmetros. Surpreendentemente eficaz: amostra cobre o espaço bem em alta dimensão.',
      use:'Baseline confiável quando você não sabe nada sobre o espaço. Bom pra paralelizar (cada job é independente).',
      sample:`<span class="k">strategy:</span> <span class="v">Random</span>\n<span class="k">max_jobs:</span> <span class="num">50</span>\n<span class="k">parallel_jobs:</span> <span class="num">10</span>\n<span class="k">objective_metric:</span> <span class="v">"validation:loss"</span>\n<span class="k">objective_type:</span> <span class="v">"Minimize"</span>\n\n<span class="k">parameters:</span>\n  <span class="k">learning_rate:</span> log(1e-6, 1e-2)\n  <span class="k">batch_size:</span> [16, 32, 64, 128]\n  <span class="k">dropout:</span> linear(0.0, 0.5)`
    },
    grid: {
      title:'🪟 Grid Search',
      desc:'Cobre TODAS as combinações de uma grade fixa. Previsível, mas explode em alta dimensão (3 hp × 5 valores = 125 jobs; 5 × 5 = 3125).',
      use:'Espaço pequeno, bem definido (≤ 3 hp × poucos valores). Bom pra documentação ou quando precisa de cobertura completa.',
      sample:`<span class="k">strategy:</span> <span class="v">Grid</span>\n<span class="k">max_jobs:</span> <span class="num">27</span>  <span class="err"># 3 × 3 × 3 = explosão!</span>\n\n<span class="k">parameters:</span>\n  <span class="k">learning_rate:</span> [<span class="num">1e-4</span>, <span class="num">3e-4</span>, <span class="num">1e-3</span>]\n  <span class="k">batch_size:</span> [<span class="num">32</span>, <span class="num">64</span>, <span class="num">128</span>]\n  <span class="k">dropout:</span> [<span class="num">0.1</span>, <span class="num">0.2</span>, <span class="num">0.3</span>]`
    },
    bayesian: {
      title:'🧠 Bayesian Optimization',
      desc:'Aprende com cada job: usa um <em>surrogate model</em> (Gaussian Process) que prevê a perda no espaço, e escolhe a próxima combinação com maior probabilidade de melhorar. <strong>Default no SageMaker AMT</strong>.',
      use:'Padrão na maioria dos casos. Acha o melhor ponto com 3-5× menos jobs que Random. Só não brilha em paralelismo extremo (precisa esperar resultado pra escolher próximo).',
      sample:`<span class="k">strategy:</span> <span class="v">Bayesian</span>  <span class="err"># default no SageMaker AMT</span>\n<span class="k">max_jobs:</span> <span class="num">30</span>\n<span class="k">parallel_jobs:</span> <span class="num">3</span>  <span class="err"># menor que Random</span>\n<span class="k">objective_metric:</span> <span class="v">"validation:loss"</span>\n\n<span class="k">parameters:</span>\n  <span class="k">learning_rate:</span> log(1e-6, 1e-2)\n  <span class="k">batch_size:</span> [16, 32, 64, 128]\n  <span class="k">dropout:</span> linear(0.0, 0.5)\n\n<span class="err"># job 1-5: explora amplo</span>\n<span class="err"># job 6-30: converge no melhor</span>`
    },
    hyperband: {
      title:'⚡ Hyperband',
      desc:'<strong>Early stopping inteligente</strong>: roda muitos jobs com poucas epochs, mata os ruins, dá mais epochs aos sobreviventes, repete. Concentra GPU no promissor.',
      use:'Quando jobs longos custam caro e a "promessa" do hp aparece cedo. Bom pra deep learning. Ruim pra modelos onde o ganho vem só no final do treino.',
      sample:`<span class="k">strategy:</span> <span class="v">Hyperband</span>\n<span class="k">min_resource:</span> <span class="num">1</span>     <span class="err"># epoch mínima</span>\n<span class="k">max_resource:</span> <span class="num">81</span>    <span class="err"># epoch máxima</span>\n<span class="k">eta:</span> <span class="num">3</span>             <span class="err"># fator de redução</span>\n\n<span class="err"># bracket 1: 81 jobs × 1 epoch → 27 sobrevivem</span>\n<span class="err"># bracket 2: 27 × 3 epochs → 9 sobrevivem</span>\n<span class="err"># bracket 3: 9 × 9 epochs → 3 sobrevivem</span>\n<span class="err"># bracket 4: 3 × 27 epochs → 1 vencedor</span>`
    }
  };

  const detail = document.getElementById('amt-detail');
  if(!detail) return;

  function render(key){
    const s = STRAT[key];
    if(!s) return;
    detail.innerHTML = `
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <h4>Use quando</h4>
      <p>${s.use}</p>
      <h4>Configuração típica</h4>
      <pre>${s.sample}</pre>
    `;
  }

  document.querySelectorAll('.amt-card').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.amt-card').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.a);
    });
  });
  render('random');
})();


/* ═══════════════════════════════════════
   11. DECISION TREE
   ═══════════════════════════════════════ */
(function decisionTree(){
  // path: 'pe' | 'rag' | 'ft' | 'combo'
  const SCEN = {
    catalogo: {
      pick:'rag', label:'📚 RAG',
      title:'Catálogo muda toda semana',
      reason:'Conhecimento <strong>factual e atualizado</strong>. RAG re-indexa em segundos quando muda preço/estoque. Fine-tuning custaria semanas pra cada update.',
      stack:['Bedrock Knowledge Bases','S3 do catálogo sincronizado','OpenSearch Serverless por baixo','Citação automática de fonte'],
      path:['root','fact','rag']
    },
    tom: {
      pick:'ft', label:'🛠️ Fine-tuning',
      title:'Tom de voz da marca',
      reason:'Tom é <strong>comportamento</strong>, não fato. Não dá pra "buscar" tom: tem que estar nos pesos. Fine-tuning com 100-500 exemplos resolve.',
      stack:['Bedrock Custom Models','Dataset de pares (msg cliente → resposta na voz da marca)','LoRA pra economizar','Provisioned Throughput pra rodar'],
      path:['root','form','ft']
    },
    formato: {
      pick:'ft', label:'🛠️ Fine-tuning',
      title:'Formato de saída fixo (JSON proprietário)',
      reason:'Few-shot ajuda mas falha em produção. <strong>Instruction tuning</strong> trava o formato. Schema fica encrustado nos pesos.',
      stack:['Instruction Tuning supervisionado','JSONL com 200-1000 pares','Validação de schema no output','Bedrock Custom ou SageMaker JumpStart'],
      path:['root','form','ft']
    },
    manual: {
      pick:'rag', label:'📚 RAG',
      title:'Manual interno de 500 páginas',
      reason:'Volume grande, <strong>conhecimento factual</strong>, política <strong>precisa de citação</strong>. RAG é literalmente o caso de uso pra isso.',
      stack:['Bedrock Knowledge Bases','PDFs no S3','Chunking 300 tokens, overlap 20%','Citation automática (página + arquivo)'],
      path:['root','fact','rag']
    },
    jargao: {
      pick:'combo', label:'🤝 Combinação',
      title:'Jargão veterinário',
      reason:'Vocabulário específico exige <strong>continued pre-training</strong> (variante de FT) pra ensinar palavras. Mas dado factual (bula, protocolo) precisa de RAG. Os dois andam juntos.',
      stack:['Bedrock Continued Pre-training (texto cru)','+ Bedrock Knowledge Bases (bulas)','+ Prompt restritivo ("cite fonte sempre")'],
      path:['root','combo']
    },
    quick: {
      pick:'pe', label:'💬 Prompt Engineering',
      title:'Resposta inconsistente · usuário reclama do formato',
      reason:'Sintoma típico de <strong>prompt mal escrito</strong>. Antes de RAG ou FT, reescreva o prompt: defina formato, dê few-shot, especifique restrições. Custo zero pra testar.',
      stack:['Bedrock Prompt Management','Few-shot com 3 exemplos','Output em formato fechado (JSON schema)','Versionar prompt'],
      path:['root','quick','pe']
    },
    resumo: {
      pick:'pe', label:'💬 Prompt Engineering',
      title:'Resumir reunião gravada · 1× por semana',
      reason:'Caso pontual, <strong>baixo volume</strong>, sem tom específico. Não vale RAG nem FT. Prompt bem escrito + Claude Sonnet resolve em uma chamada.',
      stack:['Bedrock InvokeModel · Claude Sonnet','Prompt com estrutura: "📋 Decisões / 📌 Pendências / 👥 Responsáveis"','Lambda agendado se quiser'],
      path:['root','quick','pe']
    },
    combo: {
      pick:'combo', label:'🤝 Combinação',
      title:'Atendente médico do app · tom + base + formato',
      reason:'Caso real complexo. <strong>FT</strong> pro tom da clínica. <strong>RAG</strong> pra trazer protocolo médico atualizado. <strong>Prompt</strong> garante formato e disclaimer obrigatório.',
      stack:['Bedrock Custom Models pro tom','+ Knowledge Bases pros protocolos','+ Prompt com restrições e disclaimer','+ Guardrails pra moderação','+ A2I pra casos sensíveis'],
      path:['root','combo']
    }
  };

  const result = document.getElementById('dt-result');
  if(!result) return;

  function highlight(path){
    // dimm everything
    document.querySelectorAll('#dt-svg .dt-leaf').forEach(el => {
      el.classList.remove('highlight');
      el.classList.add('dimmed');
    });
    // highlight the picked leaf(s)
    if(path === 'pe') document.getElementById('dt-pe').classList.add('highlight');
    else if(path === 'rag') document.getElementById('dt-rag').classList.add('highlight');
    else if(path === 'ft') document.getElementById('dt-ft').classList.add('highlight');
    else if(path === 'combo') document.getElementById('dt-combo').classList.add('highlight');
    if(path !== 'combo') document.getElementById('dt-combo').classList.remove('dimmed');
    document.getElementById(path === 'pe' ? 'dt-pe' : path === 'rag' ? 'dt-rag' : path === 'ft' ? 'dt-ft' : 'dt-combo').classList.remove('dimmed');
  }

  function render(key){
    const s = SCEN[key];
    if(!s) return;
    result.innerHTML = `
      <span class="dt-pick ${s.pick}">${s.label}</span>
      <h3>${s.title}</h3>
      <p>${s.reason}</p>
      <h4>Stack recomendada</h4>
      <ul>${s.stack.map(x => `<li>${x}</li>`).join('')}</ul>
    `;
    highlight(s.pick);
  }

  document.querySelectorAll('.dt-scen').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.dt-scen').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.d);
    });
  });
  render('catalogo');
})();
