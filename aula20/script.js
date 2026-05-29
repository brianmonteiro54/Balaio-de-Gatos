/* =========================================================
   AULA 20 · EMBEDDINGS, MÉTRICAS, INFERÊNCIA E AWS
   - RAG × Fine-tuning picker
   - Embeddings 2D map
   - Similaridade vetorial (drag-and-drop)
   - Vector DBs detail panel
   - When-embedding quiz
   - Confusion matrix interativa
   - Métricas de classificação ao vivo
   - Threshold lab com 50 fotos
   - Regressão lab com pontos arrastáveis
   - Calculadora de métricas de negócio
   - Batch × Real-time decisor
   - Serverless × Endpoint recommender
   - API × Auto-hospedada recommender
   - SageMaker components panel
   - Bedrock features panel
   ========================================================= */


/* ═══════════════════════════════════════
   1. RAG × FINE-TUNING
   ═══════════════════════════════════════ */
(function ragFt(){
  const SCEN = {
    atualizado: {
      pick:'RAG', cls:'rag',
      sub:'Conhecimento muda toda semana',
      desc:'Catálogo, preço, estoque mudam <strong class="k">o tempo todo</strong>. Treinar de novo a cada update é inviável. RAG re-indexa em segundos.',
      tip:'AWS: Bedrock Knowledge Bases sincronizando com S3 automaticamente.'
    },
    tom: {
      pick:'FT', cls:'ft',
      sub:'Tom de voz da marca',
      desc:'Tom é <strong class="k">comportamento</strong>, não dado factual. Não dá pra "buscar" tom: ele tem que estar nos pesos. Fine-tuning com 100-1.000 exemplos resolve.',
      tip:'AWS: Bedrock Custom Models · ou SageMaker JumpStart com PEFT/LoRA.'
    },
    jargao: {
      pick:'BOTH', cls:'both',
      sub:'Jargão médico-veterinário',
      desc:'<strong class="k">Continued pre-training</strong> (variante de FT) ensina o vocabulário ao modelo. RAG por cima traz fato atualizado citando bula e protocolo. Os dois andam juntos.',
      tip:'AWS: Bedrock Continued Pre-training + Knowledge Bases.'
    },
    docs: {
      pick:'RAG', cls:'rag',
      sub:'Manual interno de 500 páginas',
      desc:'Volume grande, conteúdo factual, política precisa de <strong class="k">citação da fonte</strong> exata. RAG é literalmente o caso de uso pra isso.',
      tip:'AWS: Bedrock Knowledge Bases com OpenSearch Serverless por baixo.'
    },
    formato: {
      pick:'FT', cls:'ft',
      sub:'Formato de saída específico',
      desc:'Quando você precisa de <strong class="k">saída sempre no mesmo schema</strong> (SQL custom, JSON proprietário), few-shot ajuda mas FT trava o formato.',
      tip:'AWS: Bedrock Custom Models com 50-500 exemplos input/output.'
    },
    privado: {
      pick:'RAG', cls:'rag',
      sub:'Conhecimento privado e sensível',
      desc:'RAG mantém os dados na <strong class="k">sua VPC e seu vector DB</strong>. O FM só vê o que você decide mostrar. Acesso por linha pode ser feito via filtros.',
      tip:'Cuidado: fine-tuning embute os dados nos pesos. Se vazar o modelo, vaza o dado.'
    }
  };

  const result = document.getElementById('rft-result');
  if(!result) return;

  function render(key){
    const s = SCEN[key];
    if(!s) return;
    const labelMap = { RAG:'usar RAG', FT:'usar Fine-tuning', BOTH:'os dois (RAG + FT)' };
    result.innerHTML = `
      <div class="rft-pick ${s.cls}">
        <span class="badge">${s.pick === 'BOTH' ? '🤝' : (s.pick === 'RAG' ? '📚' : '🛠️')}</span>
        <div>
          <small>recomendação</small>
          <strong>${labelMap[s.pick]}</strong>
        </div>
      </div>
      <p><strong>${s.sub}.</strong> ${s.desc}</p>
      <div class="rft-tip">💡 ${s.tip}</div>
    `;
  }

  document.querySelectorAll('.rft-scen').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.rft-scen').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.s);
    });
  });
  render('atualizado');
})();


/* ═══════════════════════════════════════
   2. EMBEDDINGS MAP
   ═══════════════════════════════════════ */
(function embeddingsMap(){
  // Cada palavra tem coordenadas 2D que refletem grupos semânticos
  // Grupos: gatos (cima-esq), cachorros (cima-dir), comida (centro-baixo),
  //         ações (esq-baixo), abstrato (dir-baixo)
  const WORDS = [
    // gatos (próximas entre si)
    { w:'gato',   x:-3.0, y: 2.8, group:'felino' },
    { w:'felino', x:-3.2, y: 2.5, group:'felino' },
    { w:'gatinho',x:-2.7, y: 2.6, group:'felino' },
    { w:'leão',   x:-3.4, y: 2.0, group:'felino' },
    { w:'tigre',  x:-3.3, y: 2.2, group:'felino' },
    // cachorros (próximas entre si, próximas a felino mas não tanto)
    { w:'cachorro', x: 2.5, y: 2.7, group:'canino' },
    { w:'cão',      x: 2.7, y: 2.5, group:'canino' },
    { w:'lobo',     x: 3.0, y: 2.0, group:'canino' },
    // comida (separadas)
    { w:'ração',  x: 0.2, y:-2.5, group:'comida' },
    { w:'lata',   x: 0.7, y:-2.3, group:'comida' },
    { w:'tigela', x:-0.2, y:-2.7, group:'comida' },
    // ações
    { w:'miar',   x:-2.8, y:-1.2, group:'ação' },
    { w:'latir',  x: 2.5, y:-1.2, group:'ação' },
    { w:'ronronar',x:-3.0,y:-1.5, group:'ação' },
    // abstrato/diferente
    { w:'carro',    x: 3.2, y:-2.5, group:'objeto' },
    { w:'banco',    x: 3.5, y:-2.7, group:'objeto' },
    { w:'felicidade',x: 0.0, y: 0.5, group:'abstrato' },
    { w:'fome',     x:-0.5, y: 0.0, group:'abstrato' }
  ];

  const COLOR = {
    felino:'#FF6B35',
    canino:'#5C8D89',
    comida:'#F4D35E',
    ação:'#8B4F7F',
    objeto:'#D4A574',
    abstrato:'#6B8E23'
  };

  const wordsEl = document.getElementById('emb-words');
  const ptsEl = document.getElementById('emb-points');
  const lblsEl = document.getElementById('emb-labels');
  const linesEl = document.getElementById('emb-lines');
  const info = document.getElementById('emb-info');
  if(!wordsEl) return;

  // Conversão de coords (-4..4) pra svg (480x360)
  function toSvg(x, y){
    const cx = 240 + x * 56;
    const cy = 180 - y * 50;
    return [cx, cy];
  }

  function dist(a, b){
    return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2);
  }

  function cosine(a, b){
    const dot = a.x*b.x + a.y*b.y;
    const ma = Math.sqrt(a.x*a.x + a.y*a.y);
    const mb = Math.sqrt(b.x*b.x + b.y*b.y);
    if(ma === 0 || mb === 0) return 0;
    return dot / (ma * mb);
  }

  // chips
  WORDS.forEach((w, i) => {
    const btn = document.createElement('button');
    btn.className = 'emb-word';
    btn.textContent = w.w;
    btn.style.borderColor = COLOR[w.group];
    btn.style.borderWidth = '2px';
    btn.dataset.i = i;
    btn.addEventListener('click', () => selectWord(i));
    wordsEl.appendChild(btn);
  });

  // pontos
  WORDS.forEach((w, i) => {
    const [x, y] = toSvg(w.x, w.y);
    const ns = 'http://www.w3.org/2000/svg';
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', 7);
    c.setAttribute('fill', COLOR[w.group]);
    c.setAttribute('stroke', '#2B1810');
    c.setAttribute('stroke-width', 1.5);
    c.classList.add('emb-pt');
    c.dataset.i = i;
    ptsEl.appendChild(c);

    const t = document.createElementNS(ns, 'text');
    t.setAttribute('x', x + 10);
    t.setAttribute('y', y + 4);
    t.setAttribute('font-family', 'JetBrains Mono');
    t.setAttribute('font-size', '11');
    t.setAttribute('fill', '#2B1810');
    t.textContent = w.w;
    lblsEl.appendChild(t);
  });

  function selectWord(i){
    document.querySelectorAll('.emb-word').forEach((el, idx) => {
      el.classList.toggle('active', idx === i);
    });
    document.querySelectorAll('.emb-pt').forEach(el => el.classList.remove('active','near'));
    linesEl.innerHTML = '';

    const target = WORDS[i];
    document.querySelector(`.emb-pt[data-i="${i}"]`).classList.add('active');

    // top 3 mais próximas por similaridade cosseno
    const ranks = WORDS.map((w, idx) => {
      if(idx === i) return null;
      return { idx, w, sim: cosine(target, w), dist: dist(target, w) };
    }).filter(Boolean).sort((a,b) => b.sim - a.sim);

    const top3 = ranks.slice(0, 3);
    const ns = 'http://www.w3.org/2000/svg';
    const [tx, ty] = toSvg(target.x, target.y);
    top3.forEach(r => {
      document.querySelector(`.emb-pt[data-i="${r.idx}"]`).classList.add('near');
      const [nx, ny] = toSvg(r.w.x, r.w.y);
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', tx);
      line.setAttribute('y1', ty);
      line.setAttribute('x2', nx);
      line.setAttribute('y2', ny);
      line.classList.add('emb-line');
      linesEl.appendChild(line);
    });

    info.innerHTML = `
      <h5>"${target.w}" (${target.group})</h5>
      <p><strong>3 vizinhos mais parecidos</strong> (similaridade cosseno):</p>
      <ul>
        ${top3.map(r => `<li><strong>${r.w.w}</strong> · cos = <code>${r.sim.toFixed(3)}</code></li>`).join('')}
      </ul>
      <p style="margin-top:8px;font-size:12px;color:var(--ink-soft)">Mesmo grupo semântico = vetores próximos. Embeddings reais usam centenas/milhares de dimensões em vez de 2.</p>
    `;
  }

  selectWord(0);
})();


/* ═══════════════════════════════════════
   3. SIMILARITY LAB (drag vectors)
   ═══════════════════════════════════════ */
(function simLab(){
  const svg = document.getElementById('sim-svg');
  if(!svg) return;
  const vecA = document.getElementById('sim-vec-a');
  const vecB = document.getElementById('sim-vec-b');
  const handleA = document.getElementById('sim-handle-a');
  const handleB = document.getElementById('sim-handle-b');
  const lblA = document.getElementById('sim-label-a');
  const lblB = document.getElementById('sim-label-b');
  const arc = document.getElementById('sim-arc');
  const cosEl = document.getElementById('sim-cos');
  const angEl = document.getElementById('sim-angle');
  const eucEl = document.getElementById('sim-eucl');
  const dotEl = document.getElementById('sim-dot');
  const tag = document.getElementById('sim-tag');
  const explain = document.getElementById('sim-explain');

  // origem em (180, 180)
  const O = { x: 180, y: 180 };
  let A = { x: 280, y: 80 };
  let B = { x: 260, y: 120 };

  const PRESETS = {
    syn:  { A:{x:280,y:80}, B:{x:260,y:90} },
    rel:  { A:{x:280,y:80}, B:{x:300,y:140} },
    orth: { A:{x:280,y:180}, B:{x:180,y:80} },
    opp:  { A:{x:280,y:80}, B:{x:80,y:280} }
  };

  function vec(P){ return { x: P.x - O.x, y: -(P.y - O.y) }; }
  function magnitude(v){ return Math.sqrt(v.x*v.x + v.y*v.y); }

  function update(){
    vecA.setAttribute('x2', A.x); vecA.setAttribute('y2', A.y);
    vecB.setAttribute('x2', B.x); vecB.setAttribute('y2', B.y);
    handleA.setAttribute('cx', A.x); handleA.setAttribute('cy', A.y);
    handleB.setAttribute('cx', B.x); handleB.setAttribute('cy', B.y);
    lblA.setAttribute('x', A.x + 10); lblA.setAttribute('y', A.y + 4);
    lblB.setAttribute('x', B.x + 10); lblB.setAttribute('y', B.y + 4);

    const va = vec(A), vb = vec(B);
    const ma = magnitude(va), mb = magnitude(vb);
    const dot = va.x * vb.x + va.y * vb.y;
    let cos = ma * mb > 0 ? dot / (ma * mb) : 0;
    cos = Math.max(-1, Math.min(1, cos));
    const angle = Math.acos(cos) * 180 / Math.PI;
    const eucl = Math.sqrt((A.x-B.x)**2 + (A.y-B.y)**2);

    cosEl.textContent = cos.toFixed(2);
    angEl.textContent = Math.round(angle) + '°';
    eucEl.textContent = Math.round(eucl);
    dotEl.textContent = Math.round(dot).toLocaleString('pt-BR');

    // arc visualizando o ângulo
    const angA = Math.atan2(-va.y, va.x);
    const angB = Math.atan2(-vb.y, vb.x);
    const r = 38;
    const ax = O.x + r * Math.cos(angA);
    const ay = O.y + r * Math.sin(angA);
    const bx = O.x + r * Math.cos(angB);
    const by = O.y + r * Math.sin(angB);
    const large = Math.abs(angA - angB) > Math.PI ? 1 : 0;
    arc.setAttribute('d', `M ${ax.toFixed(1)} ${ay.toFixed(1)} A ${r} ${r} 0 ${large} 0 ${bx.toFixed(1)} ${by.toFixed(1)}`);

    // tag e explicação
    let cls, label, expl;
    if(cos > 0.9){ cls='syn'; label='≈ idênticos'; expl='Vetores quase paralelos. Em texto: sinônimos ou paráfrases. Cos ≈ 1.'; }
    else if(cos > 0.5){ cls='rel'; label='relacionados'; expl='Mesma "região" semântica mas não idênticos. Tipo "gato" e "filhote", ou "saúde" e "veterinário".'; }
    else if(cos > -0.3){ cls='orth'; label='sem relação'; expl='Praticamente ortogonais. Conceitos sem vínculo semântico aparente. Cos ≈ 0.'; }
    else { cls='opp'; label='opostos'; expl='Vetores apontando em direções contrárias. Em embeddings reais isso é raro: palavras "opostas" tendem a estar perto (mesmo contexto).'; }
    tag.className = 'sim-tag ' + cls;
    tag.textContent = label;
    explain.innerHTML = `<p>${expl}</p>`;
  }

  function applyPreset(key){
    const p = PRESETS[key];
    if(!p) return;
    A = { ...p.A };
    B = { ...p.B };
    update();
  }

  // drag handlers
  function startDrag(target, refObj){
    let active = false;
    const move = (clientX, clientY) => {
      const rect = svg.getBoundingClientRect();
      // mapeia tela → svg coords (viewBox 360x360)
      const x = ((clientX - rect.left) / rect.width) * 360;
      const y = ((clientY - rect.top) / rect.height) * 360;
      refObj.x = Math.max(20, Math.min(340, x));
      refObj.y = Math.max(20, Math.min(340, y));
      update();
    };
    target.addEventListener('mousedown', e => { active = true; e.preventDefault(); });
    target.addEventListener('touchstart', e => { active = true; e.preventDefault(); }, { passive:false });
    document.addEventListener('mousemove', e => { if(active) move(e.clientX, e.clientY); });
    document.addEventListener('touchmove', e => {
      if(active && e.touches[0]){ move(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }
    }, { passive:false });
    document.addEventListener('mouseup', () => { active = false; });
    document.addEventListener('touchend', () => { active = false; });
  }
  startDrag(handleA, A);
  startDrag(handleB, B);

  document.querySelectorAll('.sim-presets button').forEach(b => {
    b.addEventListener('click', () => applyPreset(b.dataset.preset));
  });

  update();
})();


/* ═══════════════════════════════════════
   4. VECTOR DBs detail
   ═══════════════════════════════════════ */
(function vdbDetail(){
  const VDBS = {
    opensearch: {
      title:'🔍 Amazon OpenSearch Service',
      desc:'O <strong>vector DB completo</strong> da AWS. Suporta k-NN com HNSW e busca híbrida (BM25 + vetor). Boa pra <strong>volumes grandes</strong> e busca textual junto.',
      pros:[
        'Vector engine + busca textual no mesmo índice',
        'k-NN com HNSW, IVF, Lucene · escalonável',
        'Filtros por metadata complexos',
        'Versão Serverless ($0 quando idle)'
      ],
      cons:[
        'Configuração tem mais parâmetros',
        'Custo sobe com volume e instância'
      ],
      use:'RAG corporativo, busca em catálogo, log analytics + semantic search'
    },
    aurora: {
      title:'🐘 Aurora PostgreSQL com pgvector',
      desc:'Postgres gerenciado com a extensão <code>pgvector</code>. Você já usa Postgres? Adiciona vetor sem trocar de DB.',
      pros:[
        'Reusa toda infra Postgres existente',
        'JOIN com tabelas relacionais ✅',
        'Transações ACID',
        'Aurora Serverless v2 (escala a zero)'
      ],
      cons:[
        'Performance fica abaixo de OpenSearch em volume gigante',
        'Limites do Postgres em alta concorrência'
      ],
      use:'App que já é Postgres · semantic search + dados transacionais juntos'
    },
    neptune: {
      title:'🕸️ Amazon Neptune Analytics',
      desc:'Banco de <strong>grafo</strong> com suporte a vetor. Útil quando o conhecimento tem relações (entidades + arestas) e você quer buscar semântica em cima.',
      pros:[
        'Grafo + vetor no mesmo serviço',
        'Algoritmos de grafo otimizados',
        'Bom pra GraphRAG'
      ],
      cons:[
        'Caso de uso específico (grafo)',
        'Curva de aprendizado se nunca mexeu com grafo'
      ],
      use:'GraphRAG, knowledge graphs com semantic similarity'
    },
    rds: {
      title:'🗃️ Amazon RDS for PostgreSQL',
      desc:'Postgres "puro" gerenciado, também com <code>pgvector</code>. Mais simples e barato que Aurora para cargas modestas.',
      pros:[
        'Mais barato que Aurora em low-load',
        'Mesma extensão pgvector',
        'Familiar pra qualquer dev'
      ],
      cons:[
        'Sem Serverless v2 nem multi-region writer',
        'Escala mais limitada'
      ],
      use:'Protótipos, RAG pequeno/médio, projetos com budget apertado'
    },
    docdb: {
      title:'📄 Amazon DocumentDB (com Vector Search)',
      desc:'Banco compatível com MongoDB e suporte a vector search nativo desde 2024.',
      pros:[
        'JSON-doc storage natural',
        'Vector + queries de documento',
        'Compatível com aplicações Mongo existentes'
      ],
      cons:[
        'Comunidade menor que pgvector',
        'Custo proporcional ao tamanho do cluster'
      ],
      use:'Apps que já usam Mongo/JSON, semantic search em catálogo de produtos'
    },
    mq: {
      title:'⚡ MemoryDB / Redis (vector)',
      desc:'Vector store em memória, <strong>latência sub-ms</strong>. Para casos onde a velocidade é tudo.',
      pros:[
        'Latência mais baixa do mercado',
        'Boa pra cache de embeddings frequentes',
        'Multi-AZ e durável (MemoryDB)'
      ],
      cons:[
        'Custo de memória RAM × volume',
        'Volume limitado pela memória do cluster'
      ],
      use:'Recomendação real-time, semantic cache, busca em quantidades médias'
    },
    kb: {
      title:'📦 Bedrock Knowledge Bases',
      desc:'<strong>Não é um vector DB sozinho</strong>, é o gerenciador. Ele <em>configura</em> OpenSearch Serverless, Aurora, Neptune, MongoDB Atlas, Pinecone ou Redis Enterprise pra você. Você escolhe a fonte (S3) e o resto roda.',
      pros:[
        'Ingest, chunk, embed, store, retrieve gerenciado',
        'Atualização automática quando S3 muda',
        '<code>retrieveAndGenerate</code> em uma única chamada',
        'Citação de fonte automática'
      ],
      cons:[
        'Menos controle fino do pipeline',
        'Custo combinado (KB + vector store por baixo)'
      ],
      use:'RAG sem operação · time pequeno · time-to-market rápido'
    }
  };

  const detail = document.getElementById('vdb-detail');
  if(!detail) return;

  function render(key){
    const v = VDBS[key];
    if(!v) return;
    detail.innerHTML = `
      <h3>${v.title}</h3>
      <p>${v.desc}</p>
      <div class="vd-row">
        ${v.pros.map(p => `<span class="vd-tag green">✓ ${p}</span>`).join('')}
      </div>
      <div class="vd-row">
        ${v.cons.map(c => `<span class="vd-tag red">⚠ ${c}</span>`).join('')}
      </div>
      <p style="margin-top:10px"><strong>Use quando:</strong> ${v.use}</p>
    `;
  }

  document.querySelectorAll('.vdb-card').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.vdb-card').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.v);
    });
  });
  render('opensearch');
})();


/* ═══════════════════════════════════════
   5. WHEN-EMBEDDINGS QUIZ
   ═══════════════════════════════════════ */
(function whenEmbQuiz(){
  const SCEN = [
    {
      text:'O abrigo quer permitir busca por descrição livre tipo "gato amigável que se dá bem com criança". Existem 5.000 fichas em texto.',
      answer:'emb',
      why:'Busca <strong>semântica</strong> por texto livre. Palavras-chave não casariam direito ("amigável" vs "carinhoso" vs "tranquilo"). Embeddings cruzam isso.'
    },
    {
      text:'Quero achar rapidamente o gato com microchip número <code>900164001234567</code> no banco.',
      answer:'sql',
      why:'Busca <strong>exata por ID</strong>. Índice B-tree em SQL responde em ms. Embedding aqui é overkill e mais lento.'
    },
    {
      text:'Sistema de recomendação: "se você gostou da Mia (gata laranja, calma, 5 anos), pode gostar dessa outra parecida".',
      answer:'emb',
      why:'<strong>Similaridade entre itens</strong> sem critério fechado. Embedding do perfil de cada gato + busca dos K mais próximos.'
    },
    {
      text:'Listar todos os gatos castrados, machos, entre 3 e 7 anos, da Clínica X.',
      answer:'sql',
      why:'<strong>Filtros estruturados</strong> (booleano, intervalo numérico, FK). SQL com WHERE faz isso melhor que qualquer vector DB.'
    },
    {
      text:'Buscar em manuais técnicos: usuário pergunta em PT-BR, mas manuais estão em inglês. Quero achar o trecho relevante.',
      answer:'emb',
      why:'Embeddings <strong>multilíngues</strong> (Cohere, Titan multilingual) projetam pt e en no mesmo espaço. SQL/keyword falha aqui.'
    },
    {
      text:'Suporte mistura busca por palavra exata do produto ("modelo XYZ-99") <em>e</em> dúvidas em linguagem natural ("cobre acidente?"). Quero ambos no mesmo retrieval.',
      answer:'hybrid',
      why:'<strong>Híbrido</strong> (BM25 + vetor) é a resposta. OpenSearch já faz essa combinação nativamente. Você pega exato e semântico.'
    }
  ];

  let idx = 0, streak = 0, answered = false;
  const counter = document.getElementById('wq-counter');
  const streakEl = document.getElementById('wq-streak');
  const scenario = document.getElementById('wq-scenario');
  const opts = document.getElementById('wq-opts');
  const feedback = document.getElementById('wq-feedback');
  const next = document.getElementById('wq-next');
  if(!counter) return;

  function render(){
    answered = false;
    const s = SCEN[idx];
    counter.textContent = `${idx+1} / ${SCEN.length}`;
    streakEl.textContent = `🔥 ${streak}`;
    scenario.innerHTML = s.text;
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
    const s = SCEN[idx];
    const right = v === s.answer;
    if(right){ streak++; btn.classList.add('right'); }
    else { streak = 0; btn.classList.add('wrong');
      opts.querySelector(`[data-v="${s.answer}"]`).classList.add('right');
    }
    streakEl.textContent = `🔥 ${streak}`;
    feedback.hidden = false;
    feedback.className = 'wq-feedback ' + (right ? 'right' : 'wrong');
    feedback.innerHTML = (right ? '<strong>✅ Acertou!</strong> ' : '<strong>❌ Não foi.</strong> ') + s.why;
    opts.querySelectorAll('button').forEach(b => b.disabled = true);
    next.hidden = false;
    next.textContent = idx === SCEN.length - 1 ? '↺ Recomeçar' : 'Próximo →';
  }

  opts.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => answer(b.dataset.v, b));
  });
  next.addEventListener('click', () => {
    idx = (idx + 1) % SCEN.length;
    render();
  });

  render();
})();


/* ═══════════════════════════════════════
   6+7. CONFUSION MATRIX + METRICS LIVE
   ═══════════════════════════════════════ */
(function confusionMatrix(){
  const tp = document.getElementById('cm-tp');
  const fp = document.getElementById('cm-fp');
  const fn = document.getElementById('cm-fn');
  const tn = document.getElementById('cm-tn');
  if(!tp) return;

  const els = {
    tpV: document.getElementById('cm-tp-v'),
    fpV: document.getElementById('cm-fp-v'),
    fnV: document.getElementById('cm-fn-v'),
    tnV: document.getElementById('cm-tn-v'),
    tpN: document.getElementById('cm-num-tp'),
    fpN: document.getElementById('cm-num-fp'),
    fnN: document.getElementById('cm-num-fn'),
    tnN: document.getElementById('cm-num-tn'),
    acc: document.getElementById('m-acc'),
    prec: document.getElementById('m-prec'),
    rec: document.getElementById('m-rec'),
    f1: document.getElementById('m-f1'),
    accBar: document.getElementById('m-acc-bar'),
    precBar: document.getElementById('m-prec-bar'),
    recBar: document.getElementById('m-rec-bar'),
    f1Bar: document.getElementById('m-f1-bar')
  };

  function pct(v){
    if(isNaN(v) || !isFinite(v)) return '···';
    return (v * 100).toFixed(1) + '%';
  }

  function update(){
    const TP = parseInt(tp.value);
    const FP = parseInt(fp.value);
    const FN = parseInt(fn.value);
    const TN = parseInt(tn.value);

    els.tpV.textContent = TP;
    els.fpV.textContent = FP;
    els.fnV.textContent = FN;
    els.tnV.textContent = TN;
    els.tpN.textContent = TP;
    els.fpN.textContent = FP;
    els.fnN.textContent = FN;
    els.tnN.textContent = TN;

    const total = TP + FP + FN + TN;
    const acc = total === 0 ? 0 : (TP + TN) / total;
    const prec = (TP + FP) === 0 ? 0 : TP / (TP + FP);
    const rec = (TP + FN) === 0 ? 0 : TP / (TP + FN);
    const f1 = (prec + rec) === 0 ? 0 : 2 * prec * rec / (prec + rec);

    els.acc.textContent = pct(acc);
    els.prec.textContent = pct(prec);
    els.rec.textContent = pct(rec);
    els.f1.textContent = pct(f1);
    els.accBar.style.width = (acc * 100) + '%';
    els.precBar.style.width = (prec * 100) + '%';
    els.recBar.style.width = (rec * 100) + '%';
    els.f1Bar.style.width = (f1 * 100) + '%';
  }

  [tp, fp, fn, tn].forEach(s => s.addEventListener('input', update));
  update();
})();


/* ═══════════════════════════════════════
   8. THRESHOLD LAB
   ═══════════════════════════════════════ */
(function threshLab(){
  const slider = document.getElementById('th-slider');
  const v = document.getElementById('th-v');
  const board = document.getElementById('th-board');
  const precEl = document.getElementById('th-prec');
  const recEl = document.getElementById('th-rec');
  const f1El = document.getElementById('th-f1');
  const posEl = document.getElementById('th-pos');
  if(!slider) return;

  // Gera 50 amostras: 25 são "gato" (positivo), 25 são "não-gato"
  // Cada uma tem score 0-1; gatos tendem a ter score alto, não-gatos baixo, com sobreposição
  const SAMPLES = (() => {
    // seed determinístico pra estabilidade
    let s = 42;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const arr = [];
    for(let i = 0; i < 25; i++){
      // gatos: score alto (0.4-1.0), com média ~0.75
      arr.push({ truth: true, score: 0.4 + rand() * 0.6 });
    }
    for(let i = 0; i < 25; i++){
      // não-gatos: score baixo (0-0.7), com média ~0.25
      arr.push({ truth: false, score: rand() * 0.7 });
    }
    // ordena por score desc pra ficar mais visual
    arr.sort((a, b) => b.score - a.score);
    return arr;
  })();

  function update(){
    const t = parseInt(slider.value) / 100;
    v.textContent = t.toFixed(2);

    let TP = 0, FP = 0, FN = 0, TN = 0;
    SAMPLES.forEach(s => {
      const predPos = s.score >= t;
      if(predPos && s.truth) TP++;
      else if(predPos && !s.truth) FP++;
      else if(!predPos && s.truth) FN++;
      else TN++;
    });

    const prec = (TP + FP) === 0 ? 0 : TP / (TP + FP);
    const rec = (TP + FN) === 0 ? 0 : TP / (TP + FN);
    const f1 = (prec + rec) === 0 ? 0 : 2 * prec * rec / (prec + rec);

    precEl.textContent = (prec * 100).toFixed(1) + '%';
    recEl.textContent = (rec * 100).toFixed(1) + '%';
    f1El.textContent = (f1 * 100).toFixed(1) + '%';
    posEl.textContent = `${TP} / 25`;

    // pinta cada foto
    board.innerHTML = SAMPLES.map(s => {
      const predPos = s.score >= t;
      let cls;
      let emoji;
      if(predPos && s.truth){ cls = 'tp'; emoji = '🐈'; }
      else if(predPos && !s.truth){ cls = 'fp'; emoji = '🐕'; }
      else if(!predPos && s.truth){ cls = 'fn'; emoji = '🐈'; }
      else { cls = 'tn'; emoji = '🐕'; }
      return `<div class="th-cat ${cls}" title="score: ${s.score.toFixed(2)} · real: ${s.truth ? 'gato' : 'cachorro'}">${emoji}</div>`;
    }).join('');
  }

  slider.addEventListener('input', update);
  update();
})();


/* ═══════════════════════════════════════
   9. REGRESSION LAB
   ═══════════════════════════════════════ */
(function regLab(){
  const svg = document.getElementById('reg-svg');
  if(!svg) return;
  const realG = document.getElementById('reg-real');
  const errG = document.getElementById('reg-errors');
  const maeEl = document.getElementById('rm-mae');
  const mseEl = document.getElementById('rm-mse');
  const rmseEl = document.getElementById('rm-rmse');
  const r2El = document.getElementById('rm-r2');

  // 10 gatos: idade (x: 0.5..10) → peso (y: 2..6). Linha previsão fixa.
  // SVG: x 50-450 = idade 0.5-10; y 240-80 = peso 2-6
  const PRED_LINE = { x1: 50, y1: 240, x2: 450, y2: 80 }; // y=240 é peso 2; y=80 é peso 6
  function svgX(idade){ return 50 + (idade - 0.5) / 9.5 * 400; }
  function svgY(peso){ return 240 - (peso - 2) / 4 * 160; }
  function pesoFromY(y){ return 2 + (240 - y) / 160 * 4; }

  // peso previsto na idade = linha
  function predicaoPeso(idade){
    // linha: peso = 2 + (idade-0.5)/9.5 * 4 (vai de peso 2 -> 6)
    return 2 + (idade - 0.5) / 9.5 * 4;
  }

  // pontos reais iniciais (pequenas variações na linha)
  const POINTS = [
    { idade: 1.0, real: 2.4 },
    { idade: 2.0, real: 2.8 },
    { idade: 3.0, real: 3.5 },
    { idade: 4.0, real: 3.7 },
    { idade: 5.0, real: 4.3 },
    { idade: 6.0, real: 4.5 },
    { idade: 7.0, real: 5.1 },
    { idade: 8.0, real: 5.4 },
    { idade: 9.0, real: 5.7 },
    { idade: 9.5, real: 5.8 }
  ];

  function render(){
    const ns = 'http://www.w3.org/2000/svg';
    realG.innerHTML = '';
    errG.innerHTML = '';

    // computa métricas
    let sumAbs = 0, sumSq = 0, sumY = 0;
    const realYs = POINTS.map(p => p.real);
    const meanY = realYs.reduce((a,b) => a+b, 0) / realYs.length;
    let ssRes = 0, ssTot = 0;

    POINTS.forEach((p, i) => {
      const pred = predicaoPeso(p.idade);
      const err = p.real - pred;
      sumAbs += Math.abs(err);
      sumSq += err * err;
      ssRes += err * err;
      ssTot += (p.real - meanY) ** 2;
    });

    const n = POINTS.length;
    const mae = sumAbs / n;
    const mse = sumSq / n;
    const rmse = Math.sqrt(mse);
    const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

    maeEl.textContent = mae.toFixed(2);
    mseEl.textContent = mse.toFixed(2);
    rmseEl.textContent = rmse.toFixed(2);
    r2El.textContent = r2.toFixed(2);

    // desenha pontos reais (verdes) + linhas de erro (vermelhas)
    POINTS.forEach((p, i) => {
      const x = svgX(p.idade);
      const realY = svgY(p.real);
      const predY = svgY(predicaoPeso(p.idade));

      // linha de erro
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', x);
      line.setAttribute('y1', realY);
      line.setAttribute('x2', x);
      line.setAttribute('y2', predY);
      line.classList.add('reg-err-line');
      errG.appendChild(line);

      // ponto previsto (laranja, em cima da linha)
      const predDot = document.createElementNS(ns, 'circle');
      predDot.setAttribute('cx', x);
      predDot.setAttribute('cy', predY);
      predDot.setAttribute('r', 4);
      predDot.setAttribute('fill', '#FF6B35');
      predDot.setAttribute('stroke', '#2B1810');
      predDot.setAttribute('stroke-width', 1);
      realG.appendChild(predDot);

      // ponto real (verde, arrastável)
      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', realY);
      dot.setAttribute('r', 7);
      dot.setAttribute('fill', '#5C8D89');
      dot.setAttribute('stroke', '#2B1810');
      dot.setAttribute('stroke-width', 1.5);
      dot.classList.add('reg-real-pt');
      dot.dataset.i = i;
      realG.appendChild(dot);

      // drag
      let active = false;
      const move = (clientY) => {
        const rect = svg.getBoundingClientRect();
        const yRaw = ((clientY - rect.top) / rect.height) * 320;
        const yClamped = Math.max(80, Math.min(240, yRaw));
        POINTS[i].real = pesoFromY(yClamped);
        render();
      };
      dot.addEventListener('mousedown', e => { active = true; e.preventDefault(); e.stopPropagation();
        const moveH = ev => move(ev.clientY);
        const upH = () => { active = false; document.removeEventListener('mousemove', moveH); document.removeEventListener('mouseup', upH); };
        document.addEventListener('mousemove', moveH);
        document.addEventListener('mouseup', upH);
      });
      dot.addEventListener('touchstart', e => { active = true; e.preventDefault(); e.stopPropagation();
        const moveH = ev => { if(ev.touches[0]) move(ev.touches[0].clientY); ev.preventDefault(); };
        const upH = () => { active = false; document.removeEventListener('touchmove', moveH); document.removeEventListener('touchend', upH); };
        document.addEventListener('touchmove', moveH, { passive:false });
        document.addEventListener('touchend', upH);
      }, { passive:false });
    });
  }

  render();
})();


/* ═══════════════════════════════════════
   10. BUSINESS METRICS CALC
   ═══════════════════════════════════════ */
(function bizMetrics(){
  const els = {
    vol: document.getElementById('biz-vol'),
    rec: document.getElementById('biz-rec'),
    rev: document.getElementById('biz-rev'),
    cost: document.getElementById('biz-cost'),
    fp: document.getElementById('biz-fp'),
    volV: document.getElementById('biz-vol-v'),
    recV: document.getElementById('biz-rec-v'),
    revV: document.getElementById('biz-rev-v'),
    costV: document.getElementById('biz-cost-v'),
    fpV: document.getElementById('biz-fp-v'),
    result: document.getElementById('biz-result')
  };
  if(!els.vol) return;

  function brl(n){
    return 'R$ ' + n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  }

  function update(){
    const vol = parseInt(els.vol.value);
    const rec = parseInt(els.rec.value);
    const rev = parseInt(els.rev.value);
    const cost = parseInt(els.cost.value);
    const fpCost = parseInt(els.fp.value);

    els.volV.textContent = vol.toLocaleString('pt-BR');
    els.recV.textContent = rec + '%';
    els.revV.textContent = brl(rev);
    els.costV.textContent = brl(cost);
    els.fpV.textContent = brl(fpCost);

    // Modelo simplificado:
    // - vol gatos buscados/mês
    // - 60% deles tem chance de retorno (ground truth = perdidos detectáveis)
    // - recall do modelo determina quantos detecta
    // - precisão fixa em 80% (1 FP a cada 4 TPs)
    const realPositives = vol * 0.6;
    const detected = realPositives * (rec / 100);
    const fpRate = 0.25; // 1 FP a cada 4 TP (precisão = 0.8)
    const falseAlarms = detected * fpRate;

    const receita = detected * rev;
    const custoFp = falseAlarms * fpCost;
    const totalCost = cost + custoFp;
    const lucro = receita - totalCost;
    const roi = totalCost === 0 ? 0 : (lucro / totalCost) * 100;

    let verdictCls = 'good';
    let verdict = '✅ Vale a pena: ROI saudável.';
    if(roi < 0){ verdictCls = 'bad'; verdict = '❌ Modelo dá prejuízo. Revisar precificação ou recall.'; }
    else if(roi < 30){ verdictCls = ''; verdict = '⚠️ ROI baixo. Avaliar se vale o esforço operacional.'; }

    els.result.innerHTML = `
      <h4>📊 Painel financeiro mensal</h4>
      <div class="biz-stats">
        <div class="biz-stat">
          <span>Gatos detectados</span>
          <strong>${Math.round(detected).toLocaleString('pt-BR')}</strong>
        </div>
        <div class="biz-stat">
          <span>Falsos positivos</span>
          <strong>${Math.round(falseAlarms).toLocaleString('pt-BR')}</strong>
        </div>
        <div class="biz-stat good">
          <span>Receita gerada</span>
          <strong>${brl(receita)}</strong>
        </div>
        <div class="biz-stat bad">
          <span>Custo total</span>
          <strong>${brl(totalCost)}</strong>
        </div>
        <div class="biz-stat big ${lucro >= 0 ? 'good' : 'bad'}">
          <span>ROI mensal</span>
          <strong>${roi.toFixed(0)}%</strong>
        </div>
      </div>
      <div class="biz-verdict ${verdictCls}">${verdict} · Lucro líquido: ${brl(lucro)}</div>
    `;
  }

  Object.keys(els).filter(k => els[k] && els[k].type === 'range').forEach(k => {
    els[k].addEventListener('input', update);
  });
  update();
})();


/* ═══════════════════════════════════════
   11. BATCH × REAL-TIME DECISOR
   ═══════════════════════════════════════ */
(function brtDecisor(){
  const SCEN = [
    {
      q:'"Quero recalcular o score de saúde de todos os 2M de gatos do sistema toda madrugada de domingo."',
      ans:'batch',
      why:'Volume gigante + sem usuário esperando + janela noturna = <strong>Batch Transform</strong>. Você dispara o job, ele consome arquivos do S3, escreve resultado em outro S3 e desliga. Paga só o tempo do job.'
    },
    {
      q:'"O usuário tira foto do gato e quer saber a raça em tempo real, na tela do app."',
      ans:'rt',
      why:'Usuário esperando em frente à tela = <strong>Real-time Endpoint</strong>. Latência baixa, HTTPS, instância sempre quente. Auto-scaling pra absorver picos.'
    },
    {
      q:'"Detecção de fraude na hora do pagamento. Decisão tem que vir em &lt; 200ms."',
      ans:'rt',
      why:'Latência crítica e síncrona = <strong>Real-time Endpoint</strong>. Batch nem se cogita aqui: a transação não pode esperar madrugada.'
    },
    {
      q:'"Toda noite recalcular embeddings de 500k novos artigos pra atualizar a base RAG."',
      ans:'batch',
      why:'Tarefa offline, alto volume, ninguém esperando = <strong>Batch Transform</strong>. SageMaker dispara em paralelo em várias instâncias, escreve no S3, encerra.'
    }
  ];

  let idx = 0;
  const qEl = document.getElementById('brt-q');
  const opts = document.querySelectorAll('.brt-opts button');
  const fb = document.getElementById('brt-feedback');
  const next = document.getElementById('brt-next');
  if(!qEl) return;

  function render(){
    qEl.textContent = SCEN[idx].q;
    fb.hidden = true;
    next.hidden = true;
    opts.forEach(b => { b.disabled = false; b.classList.remove('right','wrong'); });
  }

  function answer(v, btn){
    const s = SCEN[idx];
    const right = v === s.ans;
    if(right) btn.classList.add('right');
    else { btn.classList.add('wrong');
      document.querySelector(`.brt-opts button[data-v="${s.ans}"]`).classList.add('right');
    }
    fb.hidden = false;
    fb.innerHTML = (right ? '<strong>✅ Mandou bem.</strong> ' : '<strong>❌ Não foi.</strong> ') + s.why;
    opts.forEach(b => b.disabled = true);
    next.hidden = false;
    next.textContent = idx === SCEN.length - 1 ? '↺ Recomeçar' : 'Próximo cenário →';
  }

  opts.forEach(b => b.addEventListener('click', () => answer(b.dataset.v, b)));
  next.addEventListener('click', () => {
    idx = (idx + 1) % SCEN.length;
    render();
  });
  render();
})();


/* ═══════════════════════════════════════
   12. SERVERLESS × ENDPOINT recommender
   ═══════════════════════════════════════ */
(function seRec(){
  const traf = document.getElementById('se-traf');
  const trafV = document.getElementById('se-traf-v');
  const result = document.getElementById('se-result');
  const patBtns = document.querySelectorAll('.se-pat button');
  if(!traf) return;

  let pattern = 'bursty';

  function update(){
    const v = parseInt(traf.value);
    trafV.textContent = v.toLocaleString('pt-BR');
    patBtns.forEach(b => b.classList.toggle('active', b.dataset.p === pattern));

    // Heurística:
    // - tráfego alto e steady → endpoint
    // - tráfego baixo ou esporádico → serverless
    // - bursty alto também aceita endpoint com auto-scaling
    let pick, cls, sub, desc, costSL, costEP;

    // custo serverless: ~$0.000200 por request (estimativa rough)
    costSL = v * 30 * 0.0002; // mensal
    // custo endpoint: ~$0.50/h × 24 × 30 = $360/mês para 1 ml.t3.medium
    costEP = 360;

    if(pattern === 'rare' || (pattern === 'bursty' && v < 10000) || v < 2000){
      pick = 'Serverless'; cls = 'serverless';
      sub = 'Tráfego baixo/esporádico';
      desc = `Pra ${v.toLocaleString('pt-BR')} req/dia ${pattern === 'rare' ? '(raríssimo)' : '(bursty/baixo)'} não compensa pagar instância 24/7. Serverless escala a zero quando idle.`;
    } else if(pattern === 'steady' && v > 20000){
      pick = 'Endpoint dedicado'; cls = 'endpoint';
      sub = 'Tráfego alto e constante';
      desc = `Com ${v.toLocaleString('pt-BR')} req/dia steady, instância sempre quente sai mais barata e elimina cold start. Configure auto-scaling pra absorver picos.`;
    } else if(pattern === 'bursty' && v >= 10000){
      pick = 'Endpoint + auto-scaling'; cls = 'endpoint';
      sub = 'Tráfego alto e bursty';
      desc = `${v.toLocaleString('pt-BR')} req/dia com picos = endpoint dedicado com auto-scaling. Cold start de serverless prejudica UX nos picos.`;
    } else {
      pick = 'Serverless'; cls = 'serverless';
      sub = 'Volume médio, sem urgência';
      desc = `Pra ${v.toLocaleString('pt-BR')} req/dia steady (baixo/médio), Serverless ainda ganha por simplicidade e custo previsível.`;
    }

    result.innerHTML = `
      <div class="se-pick ${cls}">
        <span class="badge">${pick}</span>
        <div>
          <small>recomendação</small>
          <strong>${sub}</strong>
        </div>
      </div>
      <p>${desc}</p>
      <div class="se-cost">
        💰 <strong>Custo estimado/mês:</strong><br>
        ☁️ Serverless ≈ R$ ${(costSL * 5).toFixed(0).toLocaleString('pt-BR')} · 🖥️ Endpoint dedicado ≈ R$ ${(costEP * 5).toFixed(0).toLocaleString('pt-BR')}<br>
        <small style="color:rgba(251,243,226,0.6);font-size:11px">(estimativas rough · varia com instância e modelo)</small>
      </div>
    `;
  }

  traf.addEventListener('input', update);
  patBtns.forEach(b => b.addEventListener('click', () => {
    pattern = b.dataset.p;
    update();
  }));
  update();
})();


/* ═══════════════════════════════════════
   14. API × HOSTED recommender
   ═══════════════════════════════════════ */
(function ahRec(){
  const tok = document.getElementById('ah-tok');
  const tokV = document.getElementById('ah-tok-v');
  const latBtns = document.querySelectorAll('.ah-lat button');
  const teamBtns = document.querySelectorAll('.ah-team button');
  const result = document.getElementById('ah-result');
  if(!tok) return;

  let lat = 'strict';
  let team = 'solo';

  function fmtTok(n){
    if(n >= 1e9) return (n/1e9).toFixed(1).replace('.0','') + 'B';
    if(n >= 1e6) return (n/1e6).toFixed(1).replace('.0','') + 'M';
    if(n >= 1e3) return (n/1e3).toFixed(1).replace('.0','') + 'k';
    return n.toString();
  }

  function update(){
    const v = parseInt(tok.value);
    tokV.textContent = fmtTok(v);
    latBtns.forEach(b => b.classList.toggle('active', b.dataset.l === lat));
    teamBtns.forEach(b => b.classList.toggle('active', b.dataset.t === team));

    // Heurística:
    // - team solo → quase sempre API
    // - tokens muito altos (>1B) e team grande → self-hosted vence
    // - latência strict + volume alto → self-hosted (custo de tokens explodiu)
    let pick, cls, sub, desc;

    const heavyVolume = v >= 1e9;
    const bigTeam = team === 'big';
    const tightLatency = lat === 'strict';

    if(team === 'solo'){
      pick = 'API gerenciada (Bedrock)'; cls = 'api';
      sub = 'Time pequeno, deixa a AWS cuidar';
      desc = `Solo dev não tem braço pra operar GPU 24/7. Bedrock paga-se sozinho até bilhões de tokens. Configure cota e Provisioned Throughput se a latência apertar.`;
    } else if(heavyVolume && bigTeam){
      pick = 'Auto-hospedada'; cls = 'self';
      sub = 'Volume alto + time MLOps dedicado';
      desc = `Com ${fmtTok(v)} tokens/mês, custo por token vira o problema #1. Llama 70B em EKS+vLLM ou SageMaker JumpStart (g5.12xlarge) sai dramaticamente mais barato que API. Mas exige time pra manter.`;
    } else if(heavyVolume && !bigTeam){
      pick = 'API gerenciada · com Provisioned Throughput'; cls = 'api';
      sub = 'Volume alto mas sem time grande';
      desc = `${fmtTok(v)} tokens/mês é muito mas operar cluster sem time MLOps é tiro no pé. Use Bedrock <strong>Provisioned Throughput</strong>: capacidade reservada, custo previsível, latência garantida.`;
    } else if(tightLatency && bigTeam){
      pick = 'Auto-hospedada'; cls = 'self';
      sub = 'Latência crítica + time disponível';
      desc = 'Inferência local em GPU dedicada quase sempre bate API gerenciada em latência (sem hop pela internet). Mas só vale se time aguenta operar.';
    } else {
      pick = 'API gerenciada (Bedrock)'; cls = 'api';
      sub = 'Caso padrão · time-to-market';
      desc = 'Volume razoável, time não é gigante: Bedrock entrega FM em minutos. Migre pra self-hosted só quando o ROI justificar a complexidade.';
    }

    result.innerHTML = `
      <div class="ah-pick ${cls}">
        <span class="badge">${cls === 'api' ? '🛒' : '🏗️'}</span>
        <div>
          <small>recomendação</small>
          <strong>${pick}</strong>
        </div>
      </div>
      <p><strong style="color:var(--yellow)">${sub}.</strong> ${desc}</p>
    `;
  }

  tok.addEventListener('input', update);
  latBtns.forEach(b => b.addEventListener('click', () => { lat = b.dataset.l; update(); }));
  teamBtns.forEach(b => b.addEventListener('click', () => { team = b.dataset.t; update(); }));
  update();
})();


/* ═══════════════════════════════════════
   15. SAGEMAKER components
   ═══════════════════════════════════════ */
(function sagemaker(){
  const COMP = {
    studio: {
      title:'🏠 SageMaker Studio',
      desc:'IDE web unificada de ML. Você faz <strong>tudo dentro</strong>: notebooks, treinamento, deploy, monitoramento. Tipo VS Code online com kernel Python e acesso aos serviços SageMaker.',
      ops:['Notebooks Jupyter gerenciados','Visual workflows (Canvas)','Acesso aos jobs/endpoints/pipelines','Compartilhar projetos com o time'],
      use:'Ambiente principal de trabalho do data scientist na AWS'
    },
    'data-wrangler': {
      title:'🧹 SageMaker Data Wrangler',
      desc:'Limpeza e feature engineering <strong>visual</strong> (sem código). Conecta em S3, Athena, Redshift, Snowflake. Aplica 300+ transformações prontas (encoding, normalização, datas, texto).',
      ops:['Visual point-and-click','300+ transformações built-in','Detecta data quality automaticamente','Exporta pra Feature Store ou pipeline'],
      use:'Pré-processamento sem precisar codar pandas'
    },
    'ground-truth': {
      title:'🏷️ SageMaker Ground Truth',
      desc:'Serviço de <strong>rotulagem</strong>. Você manda dados não rotulados e ele orquestra trabalhadores humanos (Mechanical Turk, vendor próprio ou seu time interno) ou auto-rotulagem com modelo.',
      ops:['Templates pra imagem, texto, áudio, vídeo','Rotulagem ativa (active learning)','Quality control via consenso','Integração com Mechanical Turk'],
      use:'Quando você tem dados crus mas não tem labels'
    },
    'feature-store': {
      title:'🗄️ SageMaker Feature Store',
      desc:'Catálogo central de <strong>features reutilizáveis</strong>. Em vez de cada projeto recalcular "media de compras dos últimos 30 dias", você guarda na Feature Store e todo modelo da empresa usa.',
      ops:['Online store (latência ms · DynamoDB-like)','Offline store (S3 · pra treino)','Versionamento de features','Linhagem (de onde veio a feature)'],
      use:'Empresa com vários modelos compartilhando features'
    },
    training: {
      title:'🏋️ SageMaker Training Jobs',
      desc:'Treinamento <strong>gerenciado</strong> em CPU/GPU. Você manda código + dados (S3), ele provisiona instância, treina, salva o modelo no S3 e <strong>desliga sozinho</strong>. Paga só o tempo de treino.',
      ops:['Containers prontos (TF, PyTorch, XGBoost, sklearn)','Distributed training multi-GPU','Spot instances (até 90% desconto)','Checkpoints automáticos pro S3'],
      use:'Treinar modelo do zero ou fine-tunar com seu código'
    },
    amt: {
      title:'🎯 SageMaker Automatic Model Tuning (AMT)',
      desc:'Ajuste <strong>automático</strong> de hiperparâmetros. Você define o range (learning rate de 0.001 a 0.1, etc.) e o SageMaker testa combinações usando Bayesian optimization, até achar o melhor.',
      ops:['Bayesian, Random, Grid e Hyperband','Early stopping de jobs ruins','Warm start de tuning prévio','Paraleliza vários jobs'],
      use:'Espremer mais performance sem chutar hiperparâmetro'
    },
    autopilot: {
      title:'🤖 SageMaker Autopilot',
      desc:'<strong>AutoML</strong>. Você manda CSV + coluna alvo, ele faz tudo: explora algoritmos (XGBoost, Linear, MLP), faz feature engineering, treina, escolhe o melhor. Devolve modelo pronto.',
      ops:['Foco em dados tabulares','Explica cada modelo testado','Gera notebooks reproduzíveis','Suporta classificação e regressão'],
      use:'Time sem expertise profunda em ML, ou quer baseline rápido'
    },
    jumpstart: {
      title:'🚀 SageMaker JumpStart',
      desc:'<strong>Catálogo de modelos prontos</strong>: Foundation Models (Llama, Falcon, Stable Diffusion, etc.) e modelos clássicos (XGBoost, etc.). Deploy em 1 clique, fine-tuning idem.',
      ops:['Modelos abertos e proprietários','Fine-tuning gerenciado','Deploy direto pra Endpoint','Notebooks de exemplo prontos'],
      use:'Pegar um FM e rodar/customizar sem reinventar a roda'
    },
    endpoints: {
      title:'🛰️ SageMaker Endpoints',
      desc:'Hospeda o modelo treinado pra inferência. <strong>Quatro modos</strong>: Real-time (HTTPS, ms), Serverless (escala a zero), Async (fila pra payloads grandes) e Batch Transform (job).',
      ops:['Real-time: HTTPS sempre quente','Serverless: paga por uso','Async: fila + S3','Batch Transform: job offline'],
      use:'Servir o modelo pra aplicação ou pipeline consumir'
    },
    monitor: {
      title:'👀 SageMaker Model Monitor',
      desc:'Detecta <strong>drift</strong> em produção: dado muda, qualidade cai, viés aumenta, feature attribution muda. Coleta amostra de chamadas do endpoint e compara com baseline.',
      ops:['Data quality drift (schema, missing, range)','Model quality drift (accuracy real)','Bias drift','Feature attribution drift'],
      use:'Manter o modelo saudável depois do deploy'
    },
    clarify: {
      title:'🔎 SageMaker Clarify',
      desc:'<strong>Viés e explicabilidade</strong>. Antes do treino: detecta dataset enviesado. Depois: explica predições com SHAP, identifica features mais importantes.',
      ops:['Bias detection (pre-train e post-train)','SHAP values para explicação','Métricas de fairness','Integra com Model Monitor'],
      use:'IA responsável · domínios sensíveis (crédito, saúde, RH)'
    },
    pipelines: {
      title:'🔁 SageMaker Pipelines',
      desc:'<strong>CI/CD para ML</strong>. Define o pipeline (preparar → treinar → avaliar → deploy) como código. Roda automaticamente quando dado novo chega ou em schedule.',
      ops:['DSL Python pra definir steps','Versionamento de modelos','Aprovação manual de deploy','Integra Model Registry'],
      use:'MLOps em produção · automação de retreino'
    }
  };

  const detail = document.getElementById('sm-detail');
  if(!detail) return;

  function render(key){
    const c = COMP[key];
    if(!c) return;
    detail.innerHTML = `
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <h4>Recursos principais</h4>
      <ul>${c.ops.map(o => `<li>${o}</li>`).join('')}</ul>
      <h4>Use quando</h4>
      <p>${c.use}</p>
    `;
  }

  document.querySelectorAll('.sm-comp').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.sm-comp').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.c);
    });
  });
  render('studio');
  document.querySelector('.sm-comp[data-c="studio"]').classList.add('active');
})();


/* ═══════════════════════════════════════
   16. BEDROCK features
   ═══════════════════════════════════════ */
(function bedrock(){
  const FEAT = {
    invoke: {
      title:'🎯 InvokeModel API',
      desc:'API REST (e SDKs) pra chamar <strong>qualquer FM disponível no Bedrock</strong>. Mesma assinatura pra Claude, Titan, Llama, Mistral, Cohere, Stability. Paga por token.',
      ops:['<code>InvokeModel</code> · sync, devolve JSON',' <code>InvokeModelWithResponseStream</code> · streaming','<code>Converse</code> · API unificada multi-modelo','Integração via SDK (Python, JS, etc.)'],
      use:'Caso de uso básico de GenAI: pergunta entra, resposta sai'
    },
    playground: {
      title:'🎮 Bedrock Playground',
      desc:'Interface web no console pra <strong>testar prompts</strong> sem escrever código. Compara modelos lado a lado. Ajusta temperature, top-p, max tokens. Dá pra ver os tokens por segundo.',
      ops:['Chat playground','Text playground','Image playground (Stable Diffusion, Titan Image)','Comparar 2-3 modelos lado a lado'],
      use:'Prototipar e validar qual FM escolher'
    },
    kb: {
      title:'📚 Bedrock Knowledge Bases',
      desc:'<strong>RAG gerenciado</strong>. Você aponta pra um bucket S3, escolhe um vector store (OpenSearch Serverless, Aurora, Mongo Atlas, Pinecone, Redis Enterprise) e o Bedrock cuida de tudo: chunking, embedding, indexação, atualização, retrieve.',
      ops:['Ingest de S3 (PDF, MD, CSV, etc.)','Chunking automático ou customizado','API <code>retrieve</code> e <code>retrieveAndGenerate</code>','Citação de fonte automática'],
      use:'RAG sem operar pipeline · resposta de FAQ corporativo · busca em manual'
    },
    agents: {
      title:'🤖 Bedrock Agents',
      desc:'<strong>ReAct gerenciado</strong>. Você define ações (chamadas a Lambda/API) e bases de conhecimento. O agente decide o que fazer, em loop, até ter resposta. Memória de sessão integrada.',
      ops:['Action Groups (Lambdas como ferramentas)','Conexão com Knowledge Bases','Memória de sessão (curto e longo prazo)','Trace com explicação de cada decisão'],
      use:'Assistente que executa tarefas (consultar API, fazer reserva, criar ticket)'
    },
    guardrails: {
      title:'🛡️ Bedrock Guardrails',
      desc:'<strong>Filtros de segurança</strong> pra entrada E saída do FM. 6 categorias: Hate, Insults, Sexual, Violence, Misconduct, Prompt Attack. Mais filtros de PII, palavras proibidas e <strong>contextual grounding</strong> (mata alucinação).',
      ops:['6 filtros de conteúdo (low/med/high)','Bloqueio de tópicos (denied topics)','Mascaramento de PII','Contextual grounding (resposta vs fontes)'],
      use:'Qualquer aplicação pública · domínios sensíveis · compliance'
    },
    finetune: {
      title:'🧪 Bedrock Custom Models',
      desc:'<strong>Fine-tuning</strong> e <strong>Continued Pre-training</strong> dos FMs. Você manda exemplos no S3 (JSONL), Bedrock treina e devolve um modelo customizado privado seu. Paga storage do modelo + Provisioned Throughput pra usar.',
      ops:['Fine-tuning supervisionado (label/output)','Continued pre-training (texto bruto)','Modelo é seu, não compartilhado','Métricas de treino expostas'],
      use:'Tom de marca, jargão de domínio, formato proprietário · só roda em Provisioned'
    },
    evaluations: {
      title:'📊 Bedrock Model Evaluation',
      desc:'<strong>Compara modelos</strong> de forma estruturada. Manda dataset de testes (JSONL com prompt + resposta esperada), Bedrock roda em N modelos e dá relatório com métricas (BLEU, ROUGE, BERTScore, ou avaliação humana).',
      ops:['Auto evaluation (programática)','Human evaluation (workforce)','Métricas: accuracy, robustness, toxicity','Suporta modelos custom'],
      use:'Escolher modelo · validar release de prompt · comparar fine-tune × base'
    },
    provisioned: {
      title:'⚙️ Bedrock Provisioned Throughput',
      desc:'<strong>Capacidade reservada</strong>. Em vez de pagar por token (sob-demanda), você compra Model Units por hora. Latência garantida, throughput previsível, custo fixo. Obrigatório pra Custom Models.',
      ops:['Model Units (commitment 1 mês ou 6 meses)','Latência mais baixa que sob-demanda','Custo previsível e linear','Escalonamento manual via mais MUs'],
      use:'Aplicação de produção em escala · Custom Models · SLAs estritos'
    }
  };

  const detail = document.getElementById('br-detail');
  if(!detail) return;

  function render(key){
    const f = FEAT[key];
    if(!f) return;
    detail.innerHTML = `
      <h3>${f.title}</h3>
      <p>${f.desc}</p>
      <h4>Recursos principais</h4>
      <ul>${f.ops.map(o => `<li>${o}</li>`).join('')}</ul>
      <h4>Use quando</h4>
      <p>${f.use}</p>
    `;
  }

  document.querySelectorAll('.br-feat').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.br-feat').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      render(b.dataset.f);
    });
  });
  render('invoke');
})();
