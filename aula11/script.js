/* ===== aula 11: Kendra, Coleta, Workload ML, Pipeline, EDA ===== */

// ============================================================
// MÓDULO 1: AMAZON KENDRA · console profissional
// ============================================================

// Corpus rico com 15 documentos
const knCorpus = [
  {
    id: 'doc-001', title: 'Política de Férias 2026',
    source: 'Confluence', sourceFull: 'Confluence · RH', dept: 'RH',
    author: 'Ana Costa · HR Business Partner',
    updated: '2026-02-14',
    popularity: 0.92,
    content: 'Todo colaborador efetivo tem direito a 30 dias corridos de férias após 12 meses completos de trabalho. O pedido deve ser feito com no mínimo 30 dias de antecedência via portal RH (Workday). As férias podem ser fracionadas em até 3 períodos, sendo um deles de no mínimo 14 dias corridos. Não é permitido vender mais de 10 dias (1/3 do período).',
    keywords: ['férias', 'vacation', 'descanso', '30 dias', 'rh', 'política', 'fracionar', 'vender']
  },
  {
    id: 'doc-002', title: 'Política de Home Office e Modelo Híbrido',
    source: 'SharePoint', sourceFull: 'SharePoint · RH', dept: 'RH',
    author: 'Pedro Lima · People Ops',
    updated: '2026-01-20',
    popularity: 0.88,
    content: 'O Bigode Petshop adota modelo híbrido: 3 dias de presencial e 2 de home office por semana. Líderes podem aprovar 100% home office em casos específicos (mudança, problema de saúde, demanda de cuidador). Equipamentos (laptop, monitor 27", cadeira ergonômica) são fornecidos pela empresa após 90 dias de admissão. VPN obrigatória pra acessar sistemas internos.',
    keywords: ['home office', 'remoto', 'híbrido', 'trabalho remoto', 'presencial', 'vpn', 'monitor']
  },
  {
    id: 'doc-003', title: 'Reembolso de Despesas de Viagem Corporativa',
    source: 'Workday', sourceFull: 'Workday · Finance', dept: 'Finance',
    author: 'Carla Mendes · Finance Manager',
    updated: '2025-11-08',
    popularity: 0.74,
    content: 'Despesas de viagem corporativa são reembolsadas mediante apresentação de notas fiscais via portal Workday em até 30 dias após o retorno. Limite diário: R$ 250 alimentação + R$ 400 hospedagem em capitais. Para viagens internacionais, valores em USD seguem tabela específica do RH. Aprovação em até 5 dias úteis. Taxi/Uber: usar app corporativo Mobi (cobrado direto na empresa).',
    keywords: ['reembolso', 'viagem', 'despesa', 'nota fiscal', 'corporativo', 'limite', 'alimentação', 'hospedagem', 'mobi']
  },
  {
    id: 'doc-004', title: 'Festa de Confraternização Anual · Feijoada do Bigode',
    source: 'Slack', sourceFull: 'Slack #avisos-gerais', dept: 'People',
    author: 'Roberto · Events',
    updated: '2026-11-15',
    popularity: 0.68,
    content: 'A tradicional Feijoada do Bigode acontecerá em 14 de dezembro de 2026, no salão de eventos do escritório de São Paulo (Av. Paulista, 1500), das 12h às 18h. Confirme presença até 5 de dezembro pelo formulário no Slack. Acompanhantes são permitidos (1 por colaborador). Vegetariano e vegano disponíveis mediante aviso prévio. Open bar até as 17h.',
    keywords: ['feijoada', 'festa', 'confraternização', 'evento', 'final de ano', 'acompanhante', 'vegetariano', 'open bar']
  },
  {
    id: 'doc-005', title: 'Estrutura Organizacional 2026 · Engineering',
    source: 'Confluence', sourceFull: 'Confluence · Diretoria', dept: 'Diretoria',
    author: 'João Pereira · Head of Engineering',
    updated: '2026-01-05',
    popularity: 0.83,
    content: 'O Time de Gatos é liderado por Maria Silva (Tech Lead) com reporte direto para João Pereira (Head of Engineering). O time tem 12 engenheiros divididos em 3 squads: Catalog (4 devs), Checkout (5 devs) e Recommendations (3 devs). Reuniões 1:1 quinzenais. Quarterly review com toda a área de Engineering nas últimas sextas do trimestre.',
    keywords: ['líder', 'time', 'gatos', 'maria', 'silva', 'tech lead', 'organização', 'squad', 'catalog', 'checkout', 'recommendations']
  },
  {
    id: 'doc-006', title: 'Manual de Onboarding · Primeiros 90 dias',
    source: 'Notion', sourceFull: 'Notion · People', dept: 'People',
    author: 'Beatriz · People Experience',
    updated: '2025-12-10',
    popularity: 0.71,
    content: 'Novos colaboradores recebem laptop e badge no primeiro dia. Treinamentos obrigatórios na primeira semana: Segurança da Informação, LGPD, Cultura Bigode, Política de IA Generativa. Buddy é atribuído por 30 dias pra apresentar pessoas, ferramentas e processos. Avaliação de período probatório aos 90 dias com Tech Lead e RH. Welcome kit com camiseta, ração de gato e voucher Petshop.',
    keywords: ['onboarding', 'novo', 'colaborador', 'admissão', 'buddy', 'probatório', 'lgpd', 'badge', 'welcome kit']
  },
  {
    id: 'doc-007', title: 'Pacote de Benefícios Corporativos',
    source: 'SharePoint', sourceFull: 'SharePoint · RH', dept: 'RH',
    author: 'Ana Costa · HR Business Partner',
    updated: '2026-01-15',
    popularity: 0.95,
    content: 'Plano de saúde Bradesco Saúde Top (sem coparticipação), plano odontológico, vale-refeição R$ 40/dia útil, vale-alimentação R$ 800/mês, Gympass tier completo (todas academias e estúdios), day off no aniversário, auxílio creche para filhos até 6 anos (R$ 800/mês), seguro de vida em grupo, PLR baseado em metas trimestrais.',
    keywords: ['benefícios', 'plano', 'saúde', 'vale', 'gympass', 'aniversário', 'plr', 'creche', 'seguro de vida', 'bradesco']
  },
  {
    id: 'doc-008', title: 'Documentação API Checkout v3',
    source: 'GitHub', sourceFull: 'GitHub · /docs/checkout-api', dept: 'Engineering',
    author: 'Squad Checkout',
    updated: '2026-02-28',
    popularity: 0.62,
    content: 'A API de Checkout v3 expõe endpoints REST para criação, atualização e finalização de pedidos. Base URL: https://api.bigode.com/checkout/v3. Autenticação via JWT Bearer token. Endpoints principais: POST /orders, GET /orders/{id}, POST /orders/{id}/finalize, POST /payments. Rate limit: 100 req/s por API key. Webhooks de eventos disponíveis em /webhooks.',
    keywords: ['api', 'checkout', 'documentação', 'rest', 'jwt', 'webhook', 'rate limit', 'orders', 'payments']
  },
  {
    id: 'doc-009', title: 'Política de Uso de IA Generativa',
    source: 'Confluence', sourceFull: 'Confluence · Compliance', dept: 'Diretoria',
    author: 'Rafael · Chief Compliance Officer',
    updated: '2026-02-01',
    popularity: 0.87,
    content: 'O uso de ferramentas de IA generativa (ChatGPT, Claude, GitHub Copilot, Q Developer) é PERMITIDO e ENCORAJADO no Bigode Petshop, desde que: (1) Não inserir dados sensíveis de clientes ou PII em prompts; (2) Sempre revisar código gerado antes do commit; (3) Marcar conteúdo gerado por IA quando público; (4) Usar versões enterprise quando disponíveis. Proibido: gerar conteúdo discriminatório, fake news, deepfakes.',
    keywords: ['ia', 'generativa', 'chatgpt', 'claude', 'copilot', 'política', 'pii', 'compliance', 'lgpd']
  },
  {
    id: 'doc-010', title: 'Processo de Solicitação de Equipamento',
    source: 'ServiceNow', sourceFull: 'ServiceNow · IT', dept: 'Engineering',
    author: 'IT Support',
    updated: '2025-10-20',
    popularity: 0.58,
    content: 'Solicitações de equipamento (laptop novo, monitor adicional, periféricos, cadeira) devem ser feitas via ticket no ServiceNow categoria "Hardware Request". Aprovação automática para itens até R$ 500. Acima disso, requer aprovação do gestor direto. SLA de entrega: 5 dias úteis para itens em estoque, até 30 dias para customizados.',
    keywords: ['equipamento', 'laptop', 'monitor', 'cadeira', 'servicenow', 'ticket', 'sla', 'hardware']
  },
  {
    id: 'doc-011', title: 'Calendário de Pagamentos 2026',
    source: 'Workday', sourceFull: 'Workday · Finance', dept: 'Finance',
    author: 'Folha de Pagamento',
    updated: '2026-01-02',
    popularity: 0.79,
    content: 'Datas de pagamento de salário em 2026: 5º dia útil de cada mês. 13º salário: primeira parcela até 30/11, segunda parcela até 20/12. PLR: pagamento em fevereiro de 2027 (referente a 2026), baseado em meta da empresa + meta individual. Adiantamento de salário: dia 20 de cada mês, equivalente a 40% do salário.',
    keywords: ['salário', 'pagamento', 'data', '13º', 'plr', 'folha', 'adiantamento', '5º dia útil']
  },
  {
    id: 'doc-012', title: 'Guia de Code Review',
    source: 'GitHub', sourceFull: 'GitHub · /docs/engineering', dept: 'Engineering',
    author: 'Engineering Standards',
    updated: '2025-09-15',
    popularity: 0.66,
    content: 'Todo PR (Pull Request) precisa de pelo menos 1 aprovação de membro do time + 1 aprovação adicional se tocar em código crítico (auth, payments, infra). SLA: feedback em até 24h úteis. Use templates de PR. Cobertura de testes mínima: 80%. PRs com mais de 500 linhas são fortemente desencorajados, quebra em PRs menores.',
    keywords: ['code review', 'pr', 'pull request', 'github', 'aprovação', 'sla', 'cobertura', 'testes']
  },
  {
    id: 'doc-013', title: 'Plano de Carreira Engineering',
    source: 'Confluence', sourceFull: 'Confluence · RH', dept: 'RH',
    author: 'Engineering Leadership',
    updated: '2025-11-25',
    popularity: 0.81,
    content: 'Trilha técnica e de gestão. Níveis Engineering: Junior → Pleno → Sênior → Tech Lead → Staff → Principal. Trilha de gestão a partir de Tech Lead: Engineering Manager → Director → VP. Promoção avaliada em ciclo de 6 meses (junho e dezembro). Critérios: técnico, impacto, autonomia, liderança, influência. Diferencial salarial entre níveis: 15-25%.',
    keywords: ['carreira', 'plano', 'promoção', 'nível', 'pleno', 'sênior', 'tech lead', 'staff', 'principal', 'gestão', 'manager']
  },
  {
    id: 'doc-014', title: 'Política de Licença Maternidade e Paternidade',
    source: 'SharePoint', sourceFull: 'SharePoint · RH', dept: 'RH',
    author: 'Ana Costa · HR Business Partner',
    updated: '2025-08-12',
    popularity: 0.55,
    content: 'Licença maternidade: 6 meses (180 dias) com salário integral, conforme empresa cidadã. Licença paternidade: 30 dias estendidos. Adoção: mesmas regras com base na idade da criança. Retorno gradual: 4 horas por dia nas duas primeiras semanas. Sala de amamentação disponível no escritório. Auxílio creche estendido até 6 anos da criança.',
    keywords: ['licença', 'maternidade', 'paternidade', 'adoção', 'salário', '180 dias', 'amamentação', 'empresa cidadã']
  },
  {
    id: 'doc-015', title: 'Política de Segurança da Informação',
    source: 'Confluence', sourceFull: 'Confluence · Compliance', dept: 'Diretoria',
    author: 'CISO Office',
    updated: '2026-01-30',
    popularity: 0.73,
    content: 'Senhas: mínimo 14 caracteres, MFA obrigatório em todos os sistemas críticos. Rotação de credenciais a cada 90 dias. Não compartilhar senhas. Não usar senhas pessoais em sistemas corporativos. Suspeita de phishing: encaminhar pra security@bigode.com. Treinamento anual obrigatório (quem não fizer perde acesso). VPN obrigatória fora do escritório.',
    keywords: ['segurança', 'senha', 'mfa', '2fa', 'phishing', 'vpn', 'rotação', 'credenciais', 'ciso']
  }
];

// FAQs cadastrados (Q&A direta sem precisar ler documento)
const knFAQs = [
  { q: 'Posso pedir férias antes de 1 ano?', a: 'Não. As férias são liberadas após 12 meses completos de trabalho.', triggers: ['antes de 1 ano', 'antes 1 ano', 'antes de um ano', 'menos de um ano', 'menos de 1 ano'] },
  { q: 'Posso vender meus dias de férias?', a: 'Sim, até 10 dias (1/3 do período). É preciso solicitar formalmente via Workday.', triggers: ['vender férias', 'vender dias', 'venda de férias', 'abono'] },
  { q: 'Quanto é o vale-refeição?', a: 'R$ 40 por dia útil trabalhado, creditado no cartão Sodexo.', triggers: ['vale refeição', 'vale-refeição', 'vr', 'quanto é o vr'] },
  { q: 'Onde fica o escritório de SP?', a: 'Av. Paulista, 1500, 8º andar (próximo ao metrô Trianon-Masp).', triggers: ['escritório', 'endereço', 'paulista', 'localização', 'onde fica'] },
  { q: 'Como pedir reembolso de academia?', a: 'Não pedimos reembolso direto, o benefício é via Gympass tier completo.', triggers: ['academia', 'gym', 'reembolso de academia', 'gympass'] }
];

// Stop words
const knStopwords = new Set(['a', 'o', 'e', 'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'pra', 'para', 'com', 'que', 'é', 'eu', 'um', 'uma', 'qual', 'quem', 'quando', 'como', 'onde', 'tempo', 'pelo', 'pela', 'os', 'as', 'meu', 'minha', 'seu', 'sua', 'ser', 'tem', 'há']);

// Sinônimos pra query expansion
const knSynonyms = {
  'férias': ['vacation', 'descanso', 'afastamento', 'recesso'],
  'home office': ['remoto', 'híbrido', 'trabalho remoto', 'teletrabalho'],
  'remoto': ['home office', 'híbrido'],
  'líder': ['chefe', 'gerente', 'tech lead', 'manager', 'liderança'],
  'reembolso': ['ressarcimento', 'despesa', 'pagamento', 'devolução'],
  'feijoada': ['confraternização', 'festa', 'evento', 'celebração'],
  'salário': ['pagamento', 'remuneração', 'rendimento'],
  'benefícios': ['benefit', 'pacote', 'vale'],
  'segurança': ['security', 'proteção'],
  'maternidade': ['gestante', 'gravidez', 'gestação'],
  'paternidade': ['pai', 'paterno'],
  'api': ['endpoint', 'interface', 'integração'],
  'ia': ['ai', 'inteligência artificial', 'genai', 'generativa'],
  'gato': ['gatos', 'felino', 'felinos'],
  'política': ['politica', 'norma', 'regra', 'diretriz']
};

// Pollinations LLM para Answer extraction real
const KN_LLM = 'https://text.pollinations.ai/';

function knTokenize(text) {
  return (text || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[?!,.;:()'"]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !knStopwords.has(t));
}

function knNormalizeText(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function knExpandQuery(tokens) {
  const expanded = new Set(tokens);
  tokens.forEach(t => {
    if (knSynonyms[t]) knSynonyms[t].forEach(s => expanded.add(knNormalizeText(s)));
    Object.entries(knSynonyms).forEach(([k, syns]) => {
      const synsNorm = syns.map(knNormalizeText);
      if (synsNorm.includes(t)) {
        expanded.add(knNormalizeText(k));
        synsNorm.forEach(s => expanded.add(s));
      }
    });
  });
  return [...expanded];
}

// Detecta intent (quem, quando, como, qual, onde, quanto)
function knDetectIntent(query) {
  const lower = query.toLowerCase();
  if (/\b(quem)\b/i.test(lower)) return { name: 'PERSON', emoji: '👤' };
  if (/\b(quando|que dia|que hora)\b/i.test(lower)) return { name: 'DATE/TIME', emoji: '📅' };
  if (/\b(onde|local|endereço)\b/i.test(lower)) return { name: 'LOCATION', emoji: '📍' };
  if (/\b(quanto|valor|custo|preço)\b/i.test(lower)) return { name: 'NUMERIC', emoji: '💰' };
  if (/\b(como|qual.*processo)\b/i.test(lower)) return { name: 'HOW-TO', emoji: '🛠️' };
  if (/\b(qual|que tipo)\b/i.test(lower)) return { name: 'WHAT', emoji: '❓' };
  return { name: 'FACTOID', emoji: '📋' };
}

// Detecta entities (nomes, datas, valores) usando regex simples
function knDetectEntities(query) {
  const entities = [];
  // Nomes próprios capitalizados (>= 2 chars)
  const namePattern = /\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]{2,}\b/g;
  const names = query.match(namePattern) || [];
  names.forEach(n => {
    if (!['Como', 'Qual', 'Onde', 'Quem', 'Quando', 'Quanto', 'Que'].includes(n)) {
      entities.push({ type: 'PERSON/ORG', text: n });
    }
  });
  // Números e datas
  const numPattern = /\b\d+(\.\d+)?(%|min|h|horas?|dias?|meses?|anos?|reais?|R\$)?\b/g;
  const nums = query.match(numPattern) || [];
  nums.forEach(n => entities.push({ type: 'NUMBER', text: n }));
  return entities;
}

// === Estado ===
let knMode = 'kendra';
let knFilterSource = 'all';
let knFilterDept = 'all';
let knBoosts = { recency: 35, title: 60, clicks: 40, authority: 20 };
let knLastQueryTime = 0;

// === Buscas ===
function knFilterDocs(docs) {
  return docs.filter(d => {
    if (knFilterSource !== 'all' && d.source !== knFilterSource) return false;
    if (knFilterDept !== 'all' && d.dept !== knFilterDept) return false;
    return true;
  });
}

// 1) Keyword (BM25 simplificado)
function knKeywordSearch(query) {
  const tokens = knTokenize(query);
  if (tokens.length === 0) return [];
  return knFilterDocs(knCorpus.map(doc => {
    const text = knNormalizeText(doc.title + ' ' + doc.content);
    let score = 0;
    tokens.forEach(t => {
      const re = new RegExp('\\b' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
      const matches = (text.match(re) || []).length;
      score += matches * 2.5;
    });
    return { ...doc, score, _matchedTokens: tokens };
  })).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
}

// 2) Semantic (mock vector kNN)
function knSemanticSearch(query) {
  const tokens = knTokenize(query);
  if (tokens.length === 0) return [];
  const expanded = knExpandQuery(tokens);
  return knFilterDocs(knCorpus.map(doc => {
    const text = knNormalizeText(doc.title + ' ' + doc.content + ' ' + doc.keywords.join(' '));
    const titleText = knNormalizeText(doc.title);
    let score = 0;
    expanded.forEach(t => {
      const re = new RegExp('\\b' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = (text.match(re) || []).length;
      score += matches * 1.0;
      if (titleText.includes(t)) score += knBoosts.title / 30;
      if (doc.keywords.some(k => knNormalizeText(k).includes(t))) score += 1.5;
    });
    // Recency boost
    const daysSinceUpdate = (Date.now() - new Date(doc.updated).getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 1 - daysSinceUpdate / 365) * (knBoosts.recency / 20);
    // Popularity (clicks)
    score += doc.popularity * (knBoosts.clicks / 30);
    return { ...doc, score, _matchedTokens: tokens };
  })).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
}

// 3) Kendra (semantic + answer extraction + FAQ matching)
function knKendraSearch(query) {
  const result = {
    docs: knSemanticSearch(query),
    answer: null,
    faq: null
  };
  // FAQ matching: cruza com triggers
  const lower = knNormalizeText(query);
  let bestFAQ = null;
  let bestFAQScore = 0;
  knFAQs.forEach(faq => {
    let score = 0;
    faq.triggers.forEach(t => {
      const tn = knNormalizeText(t);
      if (lower.includes(tn)) score += 5;
      else {
        const tokens = tn.split(/\s+/).filter(x => x.length > 2);
        tokens.forEach(tk => { if (lower.includes(tk)) score += 1; });
      }
    });
    if (score > bestFAQScore) { bestFAQScore = score; bestFAQ = faq; }
  });
  if (bestFAQScore >= 4) result.faq = bestFAQ;
  return result;
}

// === Render Query Understanding ===
function knRenderQU(query) {
  const tokens = knTokenize(query);
  const intent = knDetectIntent(query);
  const entities = knDetectEntities(query);
  const expanded = knExpandQuery(tokens);
  const newWords = expanded.filter(e => !tokens.includes(e));

  const cells = [
    {
      label: 'Intent classificado',
      value: `<span class="kn-qu-tag intent">${intent.emoji} ${intent.name}</span>`
    },
    {
      label: 'Tokens normalizados',
      value: tokens.length === 0 ? '-' : tokens.map(t => `<span class="kn-qu-tag">${t}</span>`).join(' ')
    },
    {
      label: 'Entidades detectadas',
      value: entities.length === 0 ? 'nenhuma' : entities.map(e => `<span class="kn-qu-tag entity">${e.type}: ${e.text}</span>`).join(' ')
    },
    {
      label: 'Query expansion (sinônimos)',
      value: newWords.length === 0 ? 'nenhum sinônimo aplicado' : newWords.map(w => `<span class="kn-qu-tag expand">+ ${w}</span>`).join(' ')
    },
    {
      label: 'Filtros faceted ativos',
      value: `<strong>source:</strong> ${knFilterSource} · <strong>dept:</strong> ${knFilterDept}`
    },
    {
      label: 'Pesos atuais',
      value: `📅 ${knBoosts.recency} · 🎯 ${knBoosts.title} · 📊 ${knBoosts.clicks} · 👤 ${knBoosts.authority}`
    }
  ];
  document.getElementById('kn-qu-grid').innerHTML = cells.map(c =>
    `<div class="kn-qu-cell"><div class="qu-label">${c.label}</div><div class="qu-value">${c.value}</div></div>`
  ).join('');
}

// === Highlight ===
function knHighlight(text, tokens) {
  let out = text;
  // Highlight tokens originais com <mark>
  const allTokens = new Set();
  tokens.forEach(t => allTokens.add(t));
  knExpandQuery(tokens).forEach(t => allTokens.add(t));
  // Sort by length desc to handle longer matches first
  const sorted = [...allTokens].sort((a, b) => b.length - a.length);
  sorted.forEach(t => {
    if (t.length < 2) return;
    const re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    out = out.replace(re, '<mark>$1</mark>');
  });
  return out;
}

// === LLM Answer Extraction ===
async function knLLMAnswer(query, topDoc) {
  const prompt = `You are Amazon Kendra's answer extraction. Read the document and answer the user's question with ONE concise sentence in Portuguese (Brazilian). Quote exact phrases from the document. Wrap key facts in <mark>...</mark>. Output ONLY the answer, no preamble.

DOCUMENT TITLE: ${topDoc.title}
DOCUMENT CONTENT: ${topDoc.content}

USER QUESTION: ${query}

ANSWER:`;
  try {
    const url = KN_LLM + encodeURIComponent(prompt);
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('http ' + r.status);
    let txt = (await r.text()).trim();
    // strip aspas
    txt = txt.replace(/^["'`]+|["'`]+$/g, '').replace(/^Answer:\s*/i, '');
    return txt;
  } catch (e) {
    return null;
  }
}

// === Render dos resultados ===
function knRenderDoc(d, idx, tokens, mini) {
  const snippet = knHighlight(d.content.slice(0, mini ? 140 : 220), tokens);
  return `<div class="kn-doc-result">
    <span class="kn-doc-rank">#${idx + 1}</span>
    <span class="kn-doc-title">${knHighlight(d.title, tokens)}</span>
    <div class="kn-doc-snippet">${snippet}…</div>
    <div class="kn-doc-meta">
      <span class="source-pill">📁 ${d.sourceFull}</span>
      <span>👤 ${d.author}</span>
      <span>📅 ${d.updated}</span>
      <span class="score-pill">score ${d.score.toFixed(2)}</span>
    </div>
  </div>`;
}

async function knRender() {
  const query = document.getElementById('kn-input').value.trim();
  knRenderQU(query);
  const out = document.getElementById('kn-results');
  if (!query) {
    out.innerHTML = '<div class="kn-empty">Clica em <strong>▶️ Search</strong> ou numa pergunta sugerida pra começar.</div>';
    document.getElementById('kn-stat-latency').textContent = '-';
    return;
  }

  const t0 = performance.now();
  const tokens = knTokenize(query);

  if (knMode === 'compare') {
    // Compare mode: 3 colunas lado a lado
    const kendra = knKendraSearch(query);
    const semantic = knSemanticSearch(query);
    const keyword = knKeywordSearch(query);
    let html = `<div class="kn-compare-grid">
      <div class="kn-compare-col kendra">
        <h4>🧠 Kendra (NLU)</h4>
        ${kendra.faq ? `<div class="kn-faq-card" style="margin-bottom:8px;"><span class="kn-faq-tag">FAQ MATCH</span><div class="kn-faq-q">${kendra.faq.q}</div><div class="kn-faq-a">${kendra.faq.a}</div></div>` : ''}
        ${kendra.docs.length === 0 ? '<div class="kn-empty">Nenhum.</div>' : kendra.docs.slice(0, 3).map((d, i) => knRenderDoc(d, i, tokens, true)).join('')}
      </div>
      <div class="kn-compare-col semantic">
        <h4>🎯 Semantic (kNN)</h4>
        ${semantic.length === 0 ? '<div class="kn-empty">Nenhum.</div>' : semantic.slice(0, 3).map((d, i) => knRenderDoc(d, i, tokens, true)).join('')}
      </div>
      <div class="kn-compare-col keyword">
        <h4>🔤 Keyword (BM25)</h4>
        ${keyword.length === 0 ? '<div class="kn-empty">Nenhum match.</div>' : keyword.slice(0, 3).map((d, i) => knRenderDoc(d, i, tokens, true)).join('')}
      </div>
    </div>`;
    out.innerHTML = html;
    document.getElementById('kn-stat-latency').textContent = (performance.now() - t0).toFixed(0) + 'ms';
    return;
  }

  if (knMode === 'kendra') {
    const r = knKendraSearch(query);
    let html = '';
    // Show loading first
    out.innerHTML = `<div class="kn-loading"><span class="kn-spinner"></span><span>Kendra processando · NLU + answer extraction via LLM…</span></div>`;

    // FAQ first if matches
    if (r.faq) {
      html += `<div class="kn-section-head">📋 FAQ Match</div>`;
      html += `<div class="kn-faq-card">
        <span class="kn-faq-tag">📋 FAQ · pré-cadastrado</span>
        <div class="kn-faq-q">${r.faq.q}</div>
        <div class="kn-faq-a">${r.faq.a}</div>
      </div>`;
    }

    // LLM Answer extraction (real)
    if (r.docs.length > 0) {
      html += `<div class="kn-section-head">💡 Suggested Answer · extraída via LLM</div>`;
      html += `<div class="kn-answer-card" id="kn-answer-loading">
        <span class="kn-answer-tag">⏳ Extraindo resposta…</span>
        <div class="kn-answer-text"><em>Lendo o documento "${r.docs[0].title}" via Pollinations LLM…</em></div>
      </div>`;
    }

    // Documents
    if (r.docs.length > 0) {
      html += `<div class="kn-section-head">📄 ${r.docs.length} documentos relevantes</div>`;
      r.docs.forEach((d, i) => { html += knRenderDoc(d, i, tokens, false); });
    } else if (!r.faq) {
      html += '<div class="kn-empty">Nenhum documento relevante. Ajuste filtros ou tente outras palavras.</div>';
    }

    out.innerHTML = html;
    document.getElementById('kn-stat-latency').textContent = (performance.now() - t0).toFixed(0) + 'ms (sem LLM)';

    // Trigger LLM call async
    if (r.docs.length > 0) {
      const llmStart = performance.now();
      const llmAnswer = await knLLMAnswer(query, r.docs[0]);
      const llmEl = document.getElementById('kn-answer-loading');
      if (llmEl) {
        if (llmAnswer) {
          const conf = (0.85 + Math.random() * 0.13).toFixed(2);
          llmEl.innerHTML = `
            <span class="kn-answer-tag">💡 Suggested Answer · LLM extraction</span>
            <div class="kn-answer-text">${llmAnswer}</div>
            <div class="kn-answer-source">
              <span>📄 Fonte: <strong>${r.docs[0].title}</strong> · ${r.docs[0].sourceFull}</span>
              <span class="kn-answer-confidence">✓ confidence ${conf}</span>
            </div>
          `;
        } else {
          llmEl.innerHTML = `
            <span class="kn-answer-tag" style="background:#FBD9C5;">⚠️ LLM offline</span>
            <div class="kn-answer-text">Não foi possível extrair resposta agora. Veja os documentos abaixo.</div>
          `;
        }
        document.getElementById('kn-stat-latency').textContent = (performance.now() - t0).toFixed(0) + 'ms (com LLM)';
      }
    }
    return;
  }

  if (knMode === 'semantic') {
    const docs = knSemanticSearch(query);
    let html = '';
    if (docs.length === 0) {
      html = '<div class="kn-empty">Nenhum documento relevante. Tente outras palavras.</div>';
    } else {
      html += `<div class="kn-section-head">🎯 ${docs.length} resultados semânticos (vector similarity + sinônimos)</div>`;
      docs.forEach((d, i) => { html += knRenderDoc(d, i, tokens, false); });
    }
    out.innerHTML = html;
    document.getElementById('kn-stat-latency').textContent = (performance.now() - t0).toFixed(0) + 'ms';
    return;
  }

  // keyword
  const docs = knKeywordSearch(query);
  let html = '';
  if (docs.length === 0) {
    html = '<div class="kn-empty">Nenhuma palavra-chave casou. Keyword puro só acha match exato, tenta o modo Semantic ou Kendra.</div>';
  } else {
    html += `<div class="kn-section-head">🔤 ${docs.length} matches BM25 (apenas palavras exatas)</div>`;
    docs.forEach((d, i) => { html += knRenderDoc(d, i, tokens, false); });
  }
  out.innerHTML = html;
  document.getElementById('kn-stat-latency').textContent = (performance.now() - t0).toFixed(0) + 'ms';
}

// === Event handlers ===
document.querySelectorAll('.kn-mode').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.kn-mode').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    knMode = b.dataset.mode;
    knRender();
  });
});

document.querySelectorAll('.kn-filter').forEach(b => {
  b.addEventListener('click', () => {
    const type = b.dataset.filterType;
    document.querySelectorAll(`.kn-filter[data-filter-type="${type}"]`).forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    if (type === 'source') knFilterSource = b.dataset.filter;
    else knFilterDept = b.dataset.filter;
    knRender();
  });
});

document.querySelectorAll('.kn-boost').forEach(s => {
  s.addEventListener('input', e => {
    const id = e.target.id.replace('kn-boost-', '');
    knBoosts[id] = parseInt(e.target.value);
    document.getElementById(e.target.id + '-v').textContent = knBoosts[id];
    knRender();
  });
});

document.getElementById('kn-go').addEventListener('click', knRender);
document.getElementById('kn-input').addEventListener('keypress', e => {
  if (e.key === 'Enter') knRender();
});
document.querySelectorAll('.kn-sug').forEach(b => {
  b.addEventListener('click', () => {
    document.getElementById('kn-input').value = b.dataset.q;
    knRender();
  });
});

// Init stats
document.getElementById('kn-stat-docs').textContent = knCorpus.length;
knRender();

// ============================================================
// MÓDULO 2: COLETA DE DADOS
// ============================================================
const dcVolMap = ['1 MB/dia', '100 MB/dia', '1 GB/dia', '100 GB/dia', '1 TB/dia', '100 TB/dia', '1 PB/dia'];

const dcRecommendations = {
  'db|batch-daily': {
    services: ['AWS DMS', 'AWS Glue', 'S3', 'Athena'],
    arch: ['🗄️ DB', 'AWS DMS', '🪣 S3 Raw', 'Glue ETL', '🪣 S3 Curated'],
    tip: 'DMS pra replicar o DB pro S3 (CDC). Glue pra transformar e cataloger. Athena pra queries SQL.'
  },
  'db|realtime': {
    services: ['DMS Streaming', 'Kinesis Data Streams', 'Lambda', 'S3'],
    arch: ['🗄️ DB', 'DMS CDC', 'Kinesis', 'Lambda', '🪣 S3'],
    tip: 'DMS em modo streaming captura mudanças do DB e publica em Kinesis. Lambda processa e grava no S3 quase em tempo real.'
  },
  'db|batch-hourly': {
    services: ['AWS Glue (cron)', 'EventBridge Schedule', 'S3'],
    arch: ['🗄️ DB', 'EventBridge', 'Glue Job', '🪣 S3 Parquet'],
    tip: 'EventBridge schedule dispara Glue job de hora em hora. Salva em Parquet particionado por hora pra queries rápidas.'
  },
  'db|ondemand': {
    services: ['Lambda', 'Athena Federated Query', 'API Gateway'],
    arch: ['🌐 API GW', 'Lambda', '🗄️ DB', 'Cliente']
  },
  'iot|realtime': {
    services: ['IoT Core', 'Kinesis Data Streams', 'Kinesis Firehose', 'S3', 'Lambda'],
    arch: ['📡 Sensores', 'IoT Core', 'Kinesis', 'Firehose', '🪣 S3'],
    tip: 'IoT Core recebe mensagens MQTT. Roteia pra Kinesis Streams. Firehose buffer e grava em S3 a cada 1 min ou 1 MB.'
  },
  'iot|batch-hourly': {
    services: ['IoT Core', 'Kinesis Firehose', 'S3'],
    arch: ['📡 Sensores', 'IoT Core', 'Firehose 1h', '🪣 S3']
  },
  'iot|batch-daily': {
    services: ['IoT Greengrass', 'S3 Sync', 'Glue'],
    arch: ['📡 Edge', 'Greengrass', '🪣 S3', 'Glue']
  },
  'logs|realtime': {
    services: ['CloudWatch Logs', 'Kinesis Data Firehose', 'S3', 'OpenSearch'],
    arch: ['📜 Logs', 'CloudWatch', 'Firehose', '🪣 S3', '🔍 OpenSearch'],
    tip: 'Subscription filter do CloudWatch envia pro Firehose. Espelha em S3 (longo prazo) + OpenSearch (busca/dashboards).'
  },
  'logs|batch-hourly': {
    services: ['CloudWatch Logs Export', 'S3'],
    arch: ['📜 Logs', 'CloudWatch', '🪣 S3 Bucket']
  },
  'logs|batch-daily': {
    services: ['CloudWatch Logs', 'S3', 'Athena'],
    arch: ['📜 Logs', 'CloudWatch', '🪣 S3', 'Athena']
  },
  'api|realtime': {
    services: ['Lambda + EventBridge', 'Kinesis Streams', 'S3'],
    arch: ['🌐 API', 'Lambda', 'Kinesis', '🪣 S3']
  },
  'api|batch-daily': {
    services: ['Lambda Scheduled', 'Glue', 'S3'],
    arch: ['🌐 API', 'Lambda Cron', '🪣 S3 Raw', 'Glue', '🪣 S3 Curated'],
    tip: 'Lambda agendada via EventBridge consome a API e salva no S3. Glue normaliza e categoriza.'
  },
  'api|batch-hourly': {
    services: ['Lambda', 'EventBridge', 'S3'],
    arch: ['🌐 API', 'EventBridge 1h', 'Lambda', '🪣 S3']
  },
  'api|ondemand': {
    services: ['API Gateway', 'Lambda', 'S3'],
    arch: ['🌐 API', 'API GW', 'Lambda', '🪣 S3']
  },
  'files|batch-daily': {
    services: ['S3 Transfer', 'AWS DataSync', 'Glue', 'Athena'],
    arch: ['📂 Files', 'DataSync', '🪣 S3', 'Glue', 'Athena'],
    tip: 'DataSync se for grande volume. AWS Transfer Family se vier de SFTP. Glue cataloga.'
  },
  'files|batch-hourly': {
    services: ['S3 Sync', 'Glue Crawler', 'Athena'],
    arch: ['📂 Files', '🪣 S3 Sync', 'Glue Crawler']
  },
  'files|ondemand': {
    services: ['S3 Direct Upload', 'Lambda Trigger', 'Glue'],
    arch: ['📂 Files', '🪣 S3', 'Lambda', 'Glue']
  },
  'files|realtime': {
    services: ['S3 Event Notifications', 'EventBridge', 'Lambda'],
    arch: ['📂 Files', '🪣 S3', 'EventBridge', 'Lambda']
  },
  'web|batch-daily': {
    services: ['Lambda + Playwright', 'EventBridge', 'S3'],
    arch: ['🕷️ Web', 'Lambda Cron', '🪣 S3 Raw', 'Glue']
  },
  'web|batch-hourly': {
    services: ['Lambda Scheduler', 'S3', 'Glue'],
    arch: ['🕷️ Web', 'EventBridge', 'Lambda', '🪣 S3']
  },
  'web|ondemand': {
    services: ['Step Functions', 'Lambda', 'S3'],
    arch: ['🕷️ Web', 'Step Functions', 'Lambda', '🪣 S3']
  },
  'web|realtime': {
    services: ['Lambda', 'Kinesis', 'S3'],
    arch: ['🕷️ Web', 'Lambda', 'Kinesis', '🪣 S3']
  },
  'legacy|batch-daily': {
    services: ['AWS DataSync', 'AWS Storage Gateway', 'S3'],
    arch: ['🦖 Legacy', 'DataSync', '🪣 S3', 'Glue'],
    tip: 'DataSync acelera transferência de NFS/SMB para S3. Storage Gateway pra acesso híbrido.'
  },
  'legacy|batch-hourly': {
    services: ['AWS DMS', 'S3', 'Glue'],
    arch: ['🦖 Legacy', 'DMS', '🪣 S3', 'Glue']
  },
  'legacy|realtime': {
    services: ['MSK / Kinesis', 'AWS DMS CDC'],
    arch: ['🦖 Legacy', 'DMS CDC', 'Kinesis', '🪣 S3']
  },
  'legacy|ondemand': {
    services: ['Direct Connect', 'S3 Transfer'],
    arch: ['🦖 Legacy', 'Direct Connect', '🪣 S3']
  },
  'nosql|batch-daily': {
    services: ['DynamoDB Export', 'S3', 'Glue', 'Athena'],
    arch: ['📦 NoSQL', 'Export', '🪣 S3', 'Athena']
  },
  'nosql|batch-hourly': {
    services: ['DynamoDB Streams', 'Lambda', 'S3'],
    arch: ['📦 NoSQL', 'DDB Streams', 'Lambda', '🪣 S3']
  },
  'nosql|realtime': {
    services: ['DynamoDB Streams', 'Kinesis', 'Lambda'],
    arch: ['📦 NoSQL', 'DDB Streams', 'Kinesis', '🪣 S3']
  },
  'nosql|ondemand': {
    services: ['Lambda', 'API Gateway'],
    arch: ['📦 NoSQL', 'Lambda', 'Cliente']
  }
};

function dcKey() {
  const source = document.getElementById('dc-source').value;
  const freq = document.querySelector('#dc-freq .dc-freq-btn.active').dataset.freq;
  return source + '|' + freq;
}

function dcRender() {
  // Volume label
  const volIdx = parseInt(document.getElementById('dc-volume').value);
  document.getElementById('dc-vol-label').textContent = '~ ' + dcVolMap[volIdx];

  const key = dcKey();
  const rec = dcRecommendations[key] || dcRecommendations['db|batch-daily'];

  // Result text
  const target = document.getElementById('dc-target').value;
  const targetLabels = {
    s3: 'Data Lake S3',
    warehouse: 'Redshift Warehouse',
    'lake-house': 'Lakehouse (S3 + Athena)',
    'feature-store': 'SageMaker Feature Store',
    opensearch: 'OpenSearch'
  };
  let resultHTML = `
    <div class="dc-result-head">📍 Stack recomendado para ${dcVolMap[volIdx]} → ${targetLabels[target]}</div>
    <div class="dc-result-services">
      ${rec.services.map(s => `<span class="dc-result-service">${s}</span>`).join('')}
    </div>
  `;
  if (rec.tip) {
    resultHTML += `<div class="dc-result-tip">💡 ${rec.tip}</div>`;
  }
  if (volIdx >= 5) {
    resultHTML += `<div class="dc-result-tip" style="margin-top: 8px; background: rgba(199,62,29,0.18); border-color: var(--coral);">⚠️ Volume muito alto (${dcVolMap[volIdx]}): ative <strong>S3 Intelligent-Tiering</strong>, particione por dia/hora e use <strong>Parquet/ORC</strong> em vez de JSON pra reduzir custo de storage e query.</div>`;
  }
  document.getElementById('dc-result').innerHTML = resultHTML;

  // Architecture SVG
  const svg = document.getElementById('dc-arch-svg');
  const boxes = rec.arch || [];
  const colors = ['#5C8D89', '#FF6B35', '#8A6FB1', '#6B8E23', '#F4D35E', '#C73E1D'];
  const boxW = 100, boxH = 36, gap = 10;
  const totalH = boxes.length * (boxH + gap) - gap;
  const startY = (280 - totalH) / 2;

  let svgHTML = '';
  boxes.forEach((b, i) => {
    const y = startY + i * (boxH + gap);
    const fill = colors[i % colors.length];
    svgHTML += `<g>
      <rect x="130" y="${y}" width="${boxW}" height="${boxH}" rx="8" fill="${fill}" stroke="#2B1810" stroke-width="2"/>
      <text x="180" y="${y + boxH/2 + 4}" text-anchor="middle" font-family="JetBrains Mono" font-size="11" font-weight="700" fill="${fill === '#F4D35E' ? '#2B1810' : '#FFF9EC'}">${b}</text>
    </g>`;
    if (i < boxes.length - 1) {
      const arrowY = y + boxH + 2;
      svgHTML += `<path d="M 180 ${arrowY} L 180 ${arrowY + 6}" stroke="#2B1810" stroke-width="2" marker-end="url(#dc-arrow)"/>`;
    }
  });
  svgHTML += `<defs><marker id="dc-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L0,8 L7,4 z" fill="#2B1810"/></marker></defs>`;
  svg.innerHTML = svgHTML;
}

document.getElementById('dc-source').addEventListener('change', dcRender);
document.getElementById('dc-target').addEventListener('change', dcRender);
document.getElementById('dc-volume').addEventListener('input', dcRender);
document.querySelectorAll('#dc-freq .dc-freq-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('#dc-freq .dc-freq-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    dcRender();
  });
});
dcRender();

// ============================================================
// MÓDULO 3: SEQUÊNCIA DE CRIAÇÃO ML
// ============================================================
const wlPhases = {
  define: {
    icon: '🎯',
    title: 'Definir metas de negócio',
    tagline: 'A fase mais ignorada e a mais importante',
    desc: 'Antes de qualquer linha de código, você precisa responder: "Que problema de negócio esse modelo resolve?" Sem isso, você acaba treinando modelos que ninguém usa.',
    blocks: [
      {
        head: '✅ Sub-etapas',
        items: [
          '<strong>Identificar o problema</strong>: classificação? regressão? recomendação?',
          '<strong>Definir KPI</strong>: métrica de negócio (não só F1-score), receita, churn, custo por chamada',
          '<strong>Estabelecer baseline</strong>: como o problema é resolvido hoje? Manual? Regras?',
          '<strong>Critério de sucesso</strong>: "se o modelo bater 5% acima do baseline, vai pra produção"',
          '<strong>Restrições</strong>: latência, custo por inferência, fairness, privacidade'
        ]
      },
      {
        head: '👥 Stakeholders envolvidos',
        items: [
          'Product Manager / Business Analyst',
          'Data Scientist (técnico)',
          'Engenheiro de ML',
          'Stakeholder do negócio (gerente da área)',
          'Time de Compliance/Legal (se PII)'
        ]
      },
      {
        head: '🛠️ Ferramentas AWS',
        items: [
          '<strong>Amazon Q in Connect</strong> · pra entender call center analytics e ROI',
          '<strong>QuickSight</strong> · análise de dados existentes pra dimensionar oportunidade',
          '<strong>SageMaker Canvas</strong> · POC rápido sem código pra validar viabilidade',
          'Discovery workshops · não é ferramenta AWS, mas obrigatório'
        ]
      },
      {
        head: '⚠️ Armadilhas',
        items: [
          { warn: true, text: 'Pular pra "vamos treinar um modelo" sem entender o problema → fail garantido' },
          { warn: true, text: 'Definir KPI técnico (acurácia) ignorando KPI de negócio (receita) → modelo bom mas inútil' },
          { warn: true, text: 'Não estimar baseline → como saber se o ML melhorou ou piorou?' },
          { warn: true, text: 'Esquecer de mensurar custo de erro: falso positivo vs falso negativo' }
        ]
      }
    ]
  },
  develop: {
    icon: '🏗️',
    title: 'Desenvolver o modelo',
    tagline: 'A fase técnica clássica',
    desc: 'Aqui acontecem EDA, feature engineering, treino, validação e ajuste. Iterativo: 80% do tempo é em dados (limpeza, features), 20% no algoritmo em si.',
    blocks: [
      {
        head: '✅ Sub-etapas',
        items: [
          '<strong>EDA</strong> · entender o dado antes de modelar',
          '<strong>Feature engineering</strong> · transformar raw em features úteis',
          '<strong>Split</strong> · treino / validação / teste (60/20/20 ou similar)',
          '<strong>Treinar baseline</strong> · regressão simples, decision tree, etc',
          '<strong>Iterar com algoritmos mais complexos</strong> · só depois do baseline',
          '<strong>Hyperparameter tuning</strong> · grid search, bayesian, AutoML',
          '<strong>Validação cruzada</strong> · não confiar em uma única divisão'
        ]
      },
      {
        head: '👥 Quem faz',
        items: [
          'Data Scientist (lead)',
          'ML Engineer (suporte de infra)',
          'Domain Expert (validação semântica)'
        ]
      },
      {
        head: '🛠️ Ferramentas AWS',
        items: [
          '<strong>SageMaker Studio</strong> · IDE de ML',
          '<strong>SageMaker Notebooks</strong> · prototipação com Jupyter',
          '<strong>SageMaker Training</strong> · treino distribuído em GPU',
          '<strong>SageMaker Experiments</strong> · tracking de runs',
          '<strong>SageMaker Autopilot</strong> · AutoML',
          '<strong>S3</strong> · datasets versionados'
        ]
      },
      {
        head: '⚠️ Armadilhas',
        items: [
          { warn: true, text: 'Data leakage, feature do futuro vazou pro treino' },
          { warn: true, text: 'Overfit no conjunto de validação tunando demais' },
          { warn: true, text: 'Não documentar experimentos → 3 semanas depois ninguém lembra qual modelo é qual' },
          { warn: true, text: 'Pular EDA → modelo fica enviesado por outliers ou missing pattern' }
        ]
      }
    ]
  },
  deploy: {
    icon: '🚀',
    title: 'Implantar em produção',
    tagline: 'O modelo precisa ser usado',
    desc: 'Modelo no notebook não vale nada. Implantar significa: empacotar, expor via API/batch, integrar com sistemas existentes, garantir disponibilidade, segurança e custo controlado.',
    blocks: [
      {
        head: '✅ Sub-etapas',
        items: [
          '<strong>Empacotar o modelo</strong> · Docker container ou formato proprietário',
          '<strong>Escolher modo</strong> · real-time endpoint, batch transform, async, edge',
          '<strong>Configurar autoscaling</strong> · spike de tráfego sem cair',
          '<strong>Definir estratégia de rollout</strong> · A/B test, blue/green, canary, shadow',
          '<strong>Integração com app</strong> · SDK, API Gateway, mensageria',
          '<strong>Monitoring básico</strong> · latência, throughput, errors'
        ]
      },
      {
        head: '👥 Quem faz',
        items: [
          'ML Engineer (lead)',
          'DevOps / SRE',
          'Data Scientist (handoff)',
          'Time de produto (integração)'
        ]
      },
      {
        head: '🛠️ Ferramentas AWS',
        items: [
          '<strong>SageMaker Endpoints</strong> · real-time inference',
          '<strong>SageMaker Batch Transform</strong> · processamento em lote',
          '<strong>SageMaker Multi-Model Endpoints</strong> · múltiplos modelos no mesmo endpoint',
          '<strong>Inferentia (Inf2)</strong> · custo-benefício pra inferência',
          '<strong>API Gateway + Lambda</strong> · fachada HTTPS',
          '<strong>SageMaker Edge Manager</strong> · IoT/Edge'
        ]
      },
      {
        head: '⚠️ Armadilhas',
        items: [
          { warn: true, text: 'Deploy big-bang sem A/B test → quebra silenciosamente' },
          { warn: true, text: 'Endpoint mal dimensionado → custos explodem ou rate-limit nos picos' },
          { warn: true, text: 'Skew treino vs serving → features calculadas diferente em produção' },
          { warn: true, text: 'Não testar em shadow mode antes do GA' }
        ]
      }
    ]
  },
  monitor: {
    icon: '📈',
    title: 'Monitorar e iterar',
    tagline: 'ML decai com o tempo',
    desc: 'Modelos perdem performance porque o mundo muda (concept drift) ou porque os dados de entrada mudam (data drift). Monitoramento contínuo + retreino automático fecham o ciclo.',
    blocks: [
      {
        head: '✅ Sub-etapas',
        items: [
          '<strong>Monitorar performance</strong> · acurácia, latência, taxa de erro',
          '<strong>Detectar data drift</strong> · distribuição de input mudou?',
          '<strong>Detectar concept drift</strong> · relação X→Y mudou?',
          '<strong>Alertar</strong> · CloudWatch + SNS quando métrica cai',
          '<strong>Retreino automatizado</strong> · trigger por drift ou schedule',
          '<strong>Audit trail</strong> · qual modelo respondeu o quê quando',
          '<strong>Feedback loop</strong> · capturar predição vs verdade pra avaliação contínua'
        ]
      },
      {
        head: '👥 Quem faz',
        items: [
          'ML Engineer + SRE (operação)',
          'Data Scientist (interpretação)',
          'Stakeholder de negócio (KPI)'
        ]
      },
      {
        head: '🛠️ Ferramentas AWS',
        items: [
          '<strong>SageMaker Model Monitor</strong> · drift de feature, qualidade de modelo, bias',
          '<strong>SageMaker Clarify</strong> · explicabilidade e detecção de bias',
          '<strong>CloudWatch Metrics + Alarms</strong> · alertas por threshold',
          '<strong>SageMaker Pipelines</strong> · retreino agendado',
          '<strong>SageMaker Model Registry</strong> · versionamento'
        ]
      },
      {
        head: '⚠️ Armadilhas',
        items: [
          { warn: true, text: 'Achar que modelo treina uma vez e funciona pra sempre' },
          { warn: true, text: 'Monitorar só latência, não qualidade da predição' },
          { warn: true, text: 'Não capturar feedback de produção → não consegue medir performance real' },
          { warn: true, text: 'Retreino sem validação humana pode amplificar bias' }
        ]
      }
    ]
  }
};

function wlRender(phase) {
  const p = wlPhases[phase];
  if (!p) return;
  const blocks = p.blocks.map(b => `
    <div class="wl-block">
      <div class="wl-block-head">${b.head}</div>
      <ul>
        ${b.items.map(it => {
          if (typeof it === 'string') return `<li>${it}</li>`;
          if (it.warn) return `<li class="warn">${it.text}</li>`;
          return `<li>${it.text || it}</li>`;
        }).join('')}
      </ul>
    </div>
  `).join('');
  document.getElementById('wl-detail').innerHTML = `
    <div class="wl-detail-head">
      <span class="wl-detail-icon">${p.icon}</span>
      <div>
        <div class="wl-detail-title">${p.title}</div>
        <div class="wl-detail-tagline">${p.tagline}</div>
      </div>
    </div>
    <div class="wl-detail-desc">${p.desc}</div>
    <div class="wl-detail-grid">${blocks}</div>
  `;
}

document.querySelectorAll('.wl-phase').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.wl-phase').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    wlRender(b.dataset.phase);
  });
});
wlRender('define');


// ============================================================
// MÓDULO 4: PIPELINE ML · 7 etapas
// ============================================================
const ppSteps = [
  {
    id: 1, icon: '📥', name: 'Ingestão',
    title: '1️⃣ Ingestão de Dados',
    services: ['S3', 'Glue', 'Kinesis', 'DMS'],
    desc: 'Trazer dado bruto de múltiplas fontes pro data lake. Em produção, costuma ser job agendado ou stream contínuo.',
    code: `<span class="c"># SageMaker Pipelines, Step de ingestão</span>
<span class="k">from</span> sagemaker.workflow.steps <span class="k">import</span> ProcessingStep
<span class="k">from</span> sagemaker.processing <span class="k">import</span> ScriptProcessor

processor = ScriptProcessor(
    image_uri=image,
    command=[<span class="s">"python3"</span>],
    instance_type=<span class="s">"ml.m5.xlarge"</span>,
    instance_count=<span class="n">1</span>,
    role=role
)

step_ingest = ProcessingStep(
    name=<span class="s">"IngestaoBase"</span>,
    processor=processor,
    inputs=[ProcessingInput(source=<span class="s">"s3://bucket/raw/"</span>, destination=<span class="s">"/opt/ml/processing/input"</span>)],
    outputs=[ProcessingOutput(source=<span class="s">"/opt/ml/processing/output"</span>, destination=<span class="s">"s3://bucket/staged/"</span>)],
    code=<span class="s">"scripts/ingestao.py"</span>
)`,
    pitfalls: ['Ingerir dado sem schema documentado', 'Não fazer idempotência → reprocessar 2x', 'Esquecer de versionar o snapshot']
  },
  {
    id: 2, icon: '🧹', name: 'Preparação',
    title: '2️⃣ Preparação / Cleaning',
    services: ['Glue', 'SageMaker Processing', 'Athena'],
    desc: 'Tratar nulls, deduplicar, normalizar tipos, mascarar PII, padronizar timezones, juntar fontes. Trabalho pesado de plumbing.',
    code: `<span class="c"># scripts/prep.py, limpa e padroniza</span>
<span class="k">import</span> pandas <span class="k">as</span> pd

df = pd.read_parquet(<span class="s">"/opt/ml/processing/input/raw.parquet"</span>)

<span class="c"># Drop duplicatas</span>
df = df.drop_duplicates(subset=[<span class="s">"order_id"</span>])

<span class="c"># Tratar missing</span>
df[<span class="s">"customer_age"</span>] = df[<span class="s">"customer_age"</span>].fillna(df[<span class="s">"customer_age"</span>].median())

<span class="c"># Normalizar timestamp pra UTC</span>
df[<span class="s">"created_at"</span>] = pd.to_datetime(df[<span class="s">"created_at"</span>]).dt.tz_convert(<span class="s">"UTC"</span>)

<span class="c"># Mascarar PII</span>
df[<span class="s">"email"</span>] = df[<span class="s">"email"</span>].apply(<span class="k">lambda</span> e: hashlib.sha256(e.encode()).hexdigest()[:<span class="n">16</span>])

df.to_parquet(<span class="s">"/opt/ml/processing/output/clean.parquet"</span>)`,
    pitfalls: ['Imputar média sem analisar pattern de missing', 'Mascarar PII depois de já ter virado feature', 'Misturar timezones']
  },
  {
    id: 3, icon: '📊', name: 'EDA',
    title: '3️⃣ Análise Exploratória',
    services: ['SageMaker Studio', 'Data Wrangler', 'QuickSight'],
    desc: 'Entender distribuição, correlação, outliers, missing patterns. NÃO É opcional, pular = treinar lixo. Veja o módulo 5 abaixo.',
    code: `<span class="k">import</span> pandas <span class="k">as</span> pd
<span class="k">import</span> seaborn <span class="k">as</span> sns

df = pd.read_parquet(<span class="s">"clean.parquet"</span>)

<span class="c"># Stats descritivas</span>
print(df.describe())

<span class="c"># Distribuição de preço</span>
sns.histplot(df[<span class="s">"price"</span>], bins=<span class="n">50</span>, kde=<span class="k">True</span>)

<span class="c"># Correlação entre features numéricas</span>
sns.heatmap(df.corr(), annot=<span class="k">True</span>, cmap=<span class="s">"RdYlBu"</span>)

<span class="c"># Outliers via IQR</span>
q1, q3 = df[<span class="s">"price"</span>].quantile([<span class="n">0.25</span>, <span class="n">0.75</span>])
iqr = q3 - q1
outliers = df[(df[<span class="s">"price"</span>] &lt; q1 - <span class="n">1.5</span>*iqr) | (df[<span class="s">"price"</span>] &gt; q3 + <span class="n">1.5</span>*iqr)]
print(<span class="s">f"Outliers: {len(outliers)} ({len(outliers)/len(df)*100:.1f}%)"</span>)`,
    pitfalls: ['Pular EDA "porque tô com pressa"', 'Olhar média sem olhar mediana', 'Ignorar correlação alta entre features']
  },
  {
    id: 4, icon: '🎨', name: 'Feature Eng',
    title: '4️⃣ Feature Engineering',
    services: ['SageMaker Feature Store', 'Glue', 'Pandas'],
    desc: 'Transformar raw em features que o modelo entende: encoding, normalização, agregações temporais, embeddings. Featuras boas > algoritmo complexo.',
    code: `<span class="c"># scripts/features.py</span>
<span class="k">from</span> sklearn.preprocessing <span class="k">import</span> StandardScaler, OneHotEncoder
<span class="k">import</span> pandas <span class="k">as</span> pd

df = pd.read_parquet(<span class="s">"clean.parquet"</span>)

<span class="c"># Numerical: standardize</span>
scaler = StandardScaler()
df[[<span class="s">"price_z"</span>, <span class="s">"age_z"</span>]] = scaler.fit_transform(df[[<span class="s">"price"</span>, <span class="s">"age"</span>]])

<span class="c"># Categorical: one-hot</span>
ohe = OneHotEncoder(sparse_output=<span class="k">False</span>)
encoded = ohe.fit_transform(df[[<span class="s">"category"</span>]])
df = pd.concat([df, pd.DataFrame(encoded, columns=ohe.get_feature_names_out())], axis=<span class="n">1</span>)

<span class="c"># Time-based features</span>
df[<span class="s">"hour_of_day"</span>] = df[<span class="s">"created_at"</span>].dt.hour
df[<span class="s">"day_of_week"</span>] = df[<span class="s">"created_at"</span>].dt.dayofweek
df[<span class="s">"is_weekend"</span>] = df[<span class="s">"day_of_week"</span>].isin([<span class="n">5</span>, <span class="n">6</span>]).astype(int)

<span class="c"># Aggregation: customer lifetime value</span>
df[<span class="s">"customer_total_orders"</span>] = df.groupby(<span class="s">"customer_id"</span>)[<span class="s">"order_id"</span>].transform(<span class="s">"count"</span>)`,
    pitfalls: ['Vazar dado do futuro nas features (data leakage)', 'Encoder treinado em treino+teste juntos → contamina avaliação', 'Não salvar o scaler/encoder pra usar em inferência → skew']
  },
  {
    id: 5, icon: '🎓', name: 'Treino',
    title: '5️⃣ Treinamento',
    services: ['SageMaker Training', 'XGBoost', 'PyTorch', 'AutoPilot'],
    desc: 'Algoritmo aprende com dados de treino. Pode ser instância única ou cluster distribuído. Hyperparameter tuning roda múltiplos jobs em paralelo.',
    code: `<span class="c"># SageMaker, Training Job</span>
<span class="k">from</span> sagemaker.xgboost <span class="k">import</span> XGBoost

xgb = XGBoost(
    entry_point=<span class="s">"train.py"</span>,
    role=role,
    instance_type=<span class="s">"ml.m5.4xlarge"</span>,
    instance_count=<span class="n">1</span>,
    framework_version=<span class="s">"1.7-1"</span>,
    hyperparameters={
        <span class="s">"max_depth"</span>: <span class="n">6</span>,
        <span class="s">"eta"</span>: <span class="n">0.1</span>,
        <span class="s">"objective"</span>: <span class="s">"binary:logistic"</span>,
        <span class="s">"num_round"</span>: <span class="n">200</span>
    }
)

xgb.fit({
    <span class="s">"train"</span>: <span class="s">"s3://bucket/features/train.parquet"</span>,
    <span class="s">"validation"</span>: <span class="s">"s3://bucket/features/val.parquet"</span>
})

<span class="c"># Hyperparameter Tuning</span>
<span class="k">from</span> sagemaker.tuner <span class="k">import</span> HyperparameterTuner
tuner = HyperparameterTuner(estimator=xgb, ...)
tuner.fit(...)`,
    pitfalls: ['Treino que demora 8h sem checkpoint → travou e perde tudo', 'Não usar early stopping → overfit', 'Hyperparameter random sem priors → busca ineficiente']
  },
  {
    id: 6, icon: '🔬', name: 'Avaliação',
    title: '6️⃣ Avaliação',
    services: ['SageMaker', 'Clarify', 'MLflow'],
    desc: 'Mede performance no conjunto de teste (holdout). Compara contra baseline. Avalia bias, fairness, robustez. Decide se vai pro deploy ou volta pro feature engineering.',
    code: `<span class="c"># Avaliar e gerar report</span>
<span class="k">from</span> sklearn.metrics <span class="k">import</span> classification_report, roc_auc_score, confusion_matrix

y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, <span class="n">1</span>]

print(classification_report(y_test, y_pred))
print(<span class="s">f"ROC AUC: {roc_auc_score(y_test, y_proba):.3f}"</span>)
print(<span class="s">f"Confusion matrix:\\n{confusion_matrix(y_test, y_pred)}"</span>)

<span class="c"># Comparar contra baseline</span>
<span class="k">if</span> auc &gt; baseline_auc + <span class="n">0.05</span>:
    print(<span class="s">"✅ Aprovado pra deploy"</span>)
<span class="k">else</span>:
    print(<span class="s">"❌ Não bate critério. Voltar pra features"</span>)

<span class="c"># Bias check via SageMaker Clarify</span>
<span class="k">from</span> sagemaker <span class="k">import</span> clarify
clarify_processor.run_bias(...)`,
    pitfalls: ['Avaliar no conjunto de validação que foi usado pra tunar → métrica otimista', 'Métrica única (acurácia) ignora desbalanceamento', 'Não checar fairness por grupo demográfico']
  },
  {
    id: 7, icon: '🚀', name: 'Deploy',
    title: '7️⃣ Deploy & Inferência',
    services: ['SageMaker Endpoint', 'Batch Transform', 'Lambda'],
    desc: 'Modelo aprovado vira endpoint, batch ou edge. Versionamento via Model Registry. Estratégias de rollout: blue/green, canary, shadow.',
    code: `<span class="c"># Registrar modelo no Model Registry</span>
<span class="k">from</span> sagemaker.workflow.step_collections <span class="k">import</span> RegisterModel

register = RegisterModel(
    name=<span class="s">"RegistraModelo"</span>,
    estimator=xgb,
    model_package_group_name=<span class="s">"churn-predictor"</span>,
    approval_status=<span class="s">"PendingManualApproval"</span>,
    inference_instances=[<span class="s">"ml.m5.large"</span>],
    transform_instances=[<span class="s">"ml.m5.xlarge"</span>]
)

<span class="c"># Após aprovação manual, deploy</span>
<span class="k">from</span> sagemaker.model <span class="k">import</span> ModelPackage

mp = ModelPackage(model_package_arn=<span class="s">"arn:..."</span>, role=role)
predictor = mp.deploy(
    instance_type=<span class="s">"ml.m5.large"</span>,
    initial_instance_count=<span class="n">2</span>,
    endpoint_name=<span class="s">"churn-prod-v1"</span>,
    <span class="c"># Estratégia: shadow mode em paralelo ao endpoint atual</span>
)`,
    pitfalls: ['Fazer big-bang em produção sem A/B', 'Não monitorar latência p95/p99 → spike fica invisível', 'Esquecer de configurar autoscaling pro modelo aguentar pico']
  }
];

let ppCurrent = 1;

function ppRenderPipeline() {
  const container = document.getElementById('pp-pipeline');
  container.innerHTML = ppSteps.map(s => `
    <button class="pp-step ${s.id === ppCurrent ? 'active' : ''}" data-step="${s.id}">
      <div class="pp-step-num">step ${s.id}</div>
      <div class="pp-step-icon">${s.icon}</div>
      <div class="pp-step-name">${s.name}</div>
    </button>
  `).join('');
  container.querySelectorAll('.pp-step').forEach(b => {
    b.addEventListener('click', () => {
      ppCurrent = parseInt(b.dataset.step);
      ppRenderPipeline();
      ppRenderDetail();
    });
  });
}

function ppRenderDetail() {
  const s = ppSteps.find(x => x.id === ppCurrent);
  if (!s) return;
  document.getElementById('pp-detail').innerHTML = `
    <div class="pp-detail-head">
      <div class="pp-detail-title">${s.title}</div>
      <div class="pp-detail-services">${s.services.map(svc => `<span class="pp-svc">${svc}</span>`).join('')}</div>
    </div>
    <div class="pp-detail-desc">${s.desc}</div>
    <pre class="pp-detail-code">${s.code}</pre>
    <div class="pp-pitfalls">
      <h4>⚠️ Armadilhas comuns</h4>
      <ul>${s.pitfalls.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>
  `;
}

ppRenderPipeline();
ppRenderDetail();

// ============================================================
// MÓDULO 5: EDA · Análise Exploratória
// ============================================================

// Gera dataset sintético de vendas com problemas reais (outliers, missing, etc)
function edaGenDataset() {
  const N = 500;
  const categories = ['Ração', 'Brinquedo', 'Areia', 'Higiene', 'Acessórios'];
  const segments = ['novo', 'recorrente', 'premium', 'inativo'];
  const data = [];
  for (let i = 0; i < N; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const seg = segments[Math.floor(Math.random() * segments.length)];
    // base price by category
    const basePrice = { 'Ração': 80, 'Brinquedo': 30, 'Areia': 45, 'Higiene': 25, 'Acessórios': 60 }[cat];
    const price = Math.max(5, basePrice + (Math.random() - 0.5) * basePrice * 0.6);
    // age (alguns missing e alguns outliers)
    let age = 25 + Math.random() * 50;
    if (Math.random() < 0.05) age = null; // 5% missing
    if (Math.random() < 0.02) age = 200 + Math.random() * 50; // outlier de idade
    // qty
    let qty = Math.floor(1 + Math.random() * 5);
    if (Math.random() < 0.01) qty = 50 + Math.floor(Math.random() * 200); // outlier de qty
    // rating com missing
    let rating = Math.round((3 + Math.random() * 2) * 10) / 10;
    if (Math.random() < 0.12) rating = null;
    // satisfação correlacionada com price (bom pra correlação)
    let satisfaction = 3 + (price / 200) + (Math.random() - 0.5) * 0.8;
    satisfaction = Math.max(1, Math.min(5, satisfaction));
    if (Math.random() < 0.08) satisfaction = null;
    data.push({
      order_id: 1000 + i,
      category: cat,
      segment: seg,
      price: parseFloat(price.toFixed(2)),
      qty,
      revenue: parseFloat((price * qty).toFixed(2)),
      customer_age: age ? Math.round(age) : null,
      rating,
      satisfaction: satisfaction ? parseFloat(satisfaction.toFixed(2)) : null
    });
  }
  return data;
}

let edaData = edaGenDataset();
let edaTab = 'overview';

function edaNumStats(values) {
  const v = values.filter(x => x !== null && !isNaN(x)).slice().sort((a, b) => a - b);
  const n = v.length;
  if (n === 0) return null;
  const mean = v.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 === 0 ? (v[n/2 - 1] + v[n/2]) / 2 : v[Math.floor(n/2)];
  const min = v[0], max = v[n - 1];
  const q1 = v[Math.floor(n * 0.25)];
  const q3 = v[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  const variance = v.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance);
  return { n, mean, median, std, min, max, q1, q3, iqr };
}

function edaUpdateSummary() {
  const cols = Object.keys(edaData[0]).length;
  document.getElementById('eda-summary').textContent = `${edaData.length} linhas · ${cols} colunas · ~${(edaData.length * cols * 8 / 1024).toFixed(1)} KB`;

  // Stats sidebar
  const priceStats = edaNumStats(edaData.map(d => d.price));
  const revStats = edaNumStats(edaData.map(d => d.revenue));
  const grid = document.getElementById('eda-stats-grid');
  grid.innerHTML = `
    <div class="eda-stat"><span class="lbl">price · mean</span><div class="v">R$ ${priceStats.mean.toFixed(0)}</div></div>
    <div class="eda-stat"><span class="lbl">price · median</span><div class="v">R$ ${priceStats.median.toFixed(0)}</div></div>
    <div class="eda-stat"><span class="lbl">price · std</span><div class="v">${priceStats.std.toFixed(1)}</div></div>
    <div class="eda-stat"><span class="lbl">price · IQR</span><div class="v">${priceStats.iqr.toFixed(1)}</div></div>
    <div class="eda-stat"><span class="lbl">revenue · max</span><div class="v">R$ ${revStats.max.toFixed(0)}</div></div>
    <div class="eda-stat"><span class="lbl">linhas</span><div class="v">${edaData.length}</div></div>
  `;
}

function edaRenderOverview() {
  const cols = ['order_id', 'category', 'segment', 'price', 'qty', 'revenue', 'customer_age', 'rating', 'satisfaction'];
  const types = ['int', 'str', 'str', 'float', 'int', 'float', 'int', 'float', 'float'];
  const missing = cols.map(c => edaData.filter(r => r[c] === null || r[c] === undefined).length);

  const previewRows = edaData.slice(0, 5).map(r =>
    `<tr>${cols.map(c => `<td>${r[c] !== null && r[c] !== undefined ? r[c] : '<span style="color:var(--coral)">NaN</span>'}</td>`).join('')}</tr>`
  ).join('');

  const summaryRows = cols.map((c, i) => {
    const vals = edaData.map(r => r[c]);
    const isNum = ['int', 'float'].includes(types[i]);
    if (isNum) {
      const stats = edaNumStats(vals);
      return `<tr>
        <td><strong>${c}</strong></td>
        <td>${types[i]}</td>
        <td>${edaData.length - missing[i]}</td>
        <td>${missing[i]} (${(missing[i] / edaData.length * 100).toFixed(1)}%)</td>
        <td>${stats ? stats.mean.toFixed(2) : '-'}</td>
        <td>${stats ? stats.std.toFixed(2) : '-'}</td>
        <td>${stats ? stats.min.toFixed(0) + ' / ' + stats.max.toFixed(0) : '-'}</td>
      </tr>`;
    } else {
      const unique = new Set(vals).size;
      return `<tr>
        <td><strong>${c}</strong></td>
        <td>${types[i]}</td>
        <td>${edaData.length - missing[i]}</td>
        <td>${missing[i]} (${(missing[i] / edaData.length * 100).toFixed(1)}%)</td>
        <td>${unique} únicos</td>
        <td>-</td>
        <td>-</td>
      </tr>`;
    }
  }).join('');

  return `
    <div class="eda-overview-grid" style="margin-bottom: 14px;">
      <div class="eda-ov-cell"><span class="label">📋 Linhas</span><div class="v">${edaData.length}</div></div>
      <div class="eda-ov-cell"><span class="label">📊 Colunas</span><div class="v">${cols.length}</div></div>
      <div class="eda-ov-cell"><span class="label">🕳️ Total NaN</span><div class="v">${missing.reduce((a, b) => a + b, 0)}</div><div class="sub">${(missing.reduce((a, b) => a + b, 0) / (edaData.length * cols.length) * 100).toFixed(1)}% do total</div></div>
      <div class="eda-ov-cell"><span class="label">💾 Memória</span><div class="v">${(edaData.length * cols.length * 8 / 1024).toFixed(1)} KB</div></div>
    </div>

    <div class="eda-chart-title">📋 .info() · resumo das colunas</div>
    <table class="eda-table" style="margin-bottom: 14px;">
      <thead><tr><th>Coluna</th><th>Type</th><th>Non-null</th><th>Missing</th><th>Mean / Cardinalidade</th><th>Std</th><th>Min / Max</th></tr></thead>
      <tbody>${summaryRows}</tbody>
    </table>

    <div class="eda-chart-title">👀 .head() · primeiras 5 linhas</div>
    <table class="eda-table">
      <thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${previewRows}</tbody>
    </table>
  `;
}

function edaRenderHistogram() {
  const values = edaData.map(d => d.price);
  const stats = edaNumStats(values);
  const bins = 30;
  const binSize = (stats.max - stats.min) / bins;
  const counts = new Array(bins).fill(0);
  values.forEach(v => {
    const idx = Math.min(bins - 1, Math.floor((v - stats.min) / binSize));
    counts[idx]++;
  });
  const maxCount = Math.max(...counts);
  const w = 600, h = 240, pad = 30;

  const bars = counts.map((c, i) => {
    const x = pad + (i / bins) * (w - pad * 2);
    const barW = (w - pad * 2) / bins - 1;
    const barH = (c / maxCount) * (h - pad * 2);
    return `<rect x="${x.toFixed(1)}" y="${(h - pad - barH).toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" fill="var(--orange)" stroke="var(--ink)" stroke-width="0.5"/>`;
  }).join('');

  // mean & median markers
  const meanX = pad + ((stats.mean - stats.min) / (stats.max - stats.min)) * (w - pad * 2);
  const medianX = pad + ((stats.median - stats.min) / (stats.max - stats.min)) * (w - pad * 2);

  return `
    <div class="eda-chart-title">📊 Histograma · price (R$)</div>
    <svg class="eda-chart-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      ${bars}
      <line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="var(--ink)" stroke-width="1"/>
      <line x1="${meanX}" y1="${pad}" x2="${meanX}" y2="${h - pad}" stroke="var(--coral)" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="${meanX + 4}" y="${pad + 12}" font-family="JetBrains Mono" font-size="10" fill="var(--coral)">mean ${stats.mean.toFixed(0)}</text>
      <line x1="${medianX}" y1="${pad}" x2="${medianX}" y2="${h - pad}" stroke="var(--olive)" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="${medianX + 4}" y="${pad + 24}" font-family="JetBrains Mono" font-size="10" fill="var(--olive)">median ${stats.median.toFixed(0)}</text>
      <text x="${pad}" y="${h - 8}" font-family="JetBrains Mono" font-size="10" fill="var(--ink-soft)">${stats.min.toFixed(0)}</text>
      <text x="${w - pad}" y="${h - 8}" text-anchor="end" font-family="JetBrains Mono" font-size="10" fill="var(--ink-soft)">${stats.max.toFixed(0)}</text>
    </svg>
  `;
}

function edaRenderScatter() {
  const w = 600, h = 280, pad = 35;
  const points = edaData.filter(d => d.price !== null && d.satisfaction !== null);
  const minX = Math.min(...points.map(p => p.price));
  const maxX = Math.max(...points.map(p => p.price));
  const minY = 1, maxY = 5;

  const dots = points.map(p => {
    const x = pad + ((p.price - minX) / (maxX - minX)) * (w - pad * 2);
    const y = h - pad - ((p.satisfaction - minY) / (maxY - minY)) * (h - pad * 2);
    const colors = { 'Ração': '#FF6B35', 'Brinquedo': '#5C8D89', 'Areia': '#8A6FB1', 'Higiene': '#6B8E23', 'Acessórios': '#F4D35E' };
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${colors[p.category]}" stroke="var(--ink)" stroke-width="0.5" opacity="0.7"/>`;
  }).join('');

  // Calc correlation
  const n = points.length;
  const meanX = points.reduce((a, p) => a + p.price, 0) / n;
  const meanY = points.reduce((a, p) => a + p.satisfaction, 0) / n;
  let num = 0, dX = 0, dY = 0;
  points.forEach(p => {
    num += (p.price - meanX) * (p.satisfaction - meanY);
    dX += (p.price - meanX) ** 2;
    dY += (p.satisfaction - meanY) ** 2;
  });
  const r = num / Math.sqrt(dX * dY);

  return `
    <div class="eda-chart-title">📈 Scatter · price (R$) vs satisfaction (1-5) · r = ${r.toFixed(3)}</div>
    <svg class="eda-chart-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      ${dots}
      <line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="var(--ink)" stroke-width="1"/>
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h - pad}" stroke="var(--ink)" stroke-width="1"/>
      <text x="${w - pad}" y="${h - 6}" text-anchor="end" font-family="JetBrains Mono" font-size="10" fill="var(--ink-soft)">price →</text>
      <text x="6" y="${pad + 4}" font-family="JetBrains Mono" font-size="10" fill="var(--ink-soft)">satisf ↑</text>
    </svg>
    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; font-size: 11px; font-family: 'JetBrains Mono', monospace;">
      ${['Ração', 'Brinquedo', 'Areia', 'Higiene', 'Acessórios'].map(c => {
        const colors = { 'Ração': '#FF6B35', 'Brinquedo': '#5C8D89', 'Areia': '#8A6FB1', 'Higiene': '#6B8E23', 'Acessórios': '#F4D35E' };
        return `<span style="display:inline-flex; align-items:center; gap:4px;"><span style="width:10px; height:10px; background:${colors[c]}; border:1px solid var(--ink); border-radius:2px;"></span>${c}</span>`;
      }).join('')}
    </div>
  `;
}

function edaRenderCorrelation() {
  const numCols = ['price', 'qty', 'revenue', 'customer_age', 'rating', 'satisfaction'];
  // Build correlation matrix
  function corr(a, b) {
    const pairs = a.map((v, i) => ({a: v, b: b[i]})).filter(p => p.a !== null && p.b !== null && !isNaN(p.a) && !isNaN(p.b));
    const n = pairs.length;
    if (n < 2) return 0;
    const mA = pairs.reduce((s, p) => s + p.a, 0) / n;
    const mB = pairs.reduce((s, p) => s + p.b, 0) / n;
    let num = 0, dA = 0, dB = 0;
    pairs.forEach(p => {
      num += (p.a - mA) * (p.b - mB);
      dA += (p.a - mA) ** 2;
      dB += (p.b - mB) ** 2;
    });
    return num / Math.sqrt(dA * dB);
  }
  const matrix = numCols.map(c1 => numCols.map(c2 => corr(edaData.map(d => d[c1]), edaData.map(d => d[c2]))));

  // Color scale: -1 vermelho → 0 branco → 1 verde
  function corrColor(r) {
    if (r > 0) {
      const a = r;
      return `rgba(107, 142, 35, ${a.toFixed(2)})`;
    } else {
      const a = -r;
      return `rgba(199, 62, 29, ${a.toFixed(2)})`;
    }
  }

  const cellSize = 90;
  let html = `
    <div class="eda-chart-title">🔥 Heatmap de Correlação (Pearson)</div>
    <div style="display: grid; grid-template-columns: 100px repeat(${numCols.length}, 1fr); gap: 2px;">
      <div></div>
      ${numCols.map(c => `<div class="eda-corr-cell" style="background: var(--ink); color: var(--paper); font-size: 10.5px; padding: 6px 4px; text-align: center;">${c}</div>`).join('')}
  `;
  matrix.forEach((row, i) => {
    html += `<div class="eda-corr-cell" style="background: var(--ink); color: var(--paper); font-size: 10.5px; padding: 6px 4px;">${numCols[i]}</div>`;
    row.forEach((v, j) => {
      const isDiag = i === j;
      html += `<div class="eda-corr-cell" style="background: ${isDiag ? '#2B1810' : corrColor(v)}; padding: 8px; aspect-ratio: 1.4/1; color: ${isDiag ? 'var(--yellow)' : (Math.abs(v) > 0.5 ? 'var(--paper)' : 'var(--ink)')};">${isDiag ? '-' : v.toFixed(2)}</div>`;
    });
  });
  html += '</div>';
  html += '<div style="margin-top: 10px; font-size: 11.5px; color: var(--ink-soft);">Verde = correlação positiva, vermelho = negativa, intensidade = magnitude. <strong>price × revenue</strong> sempre alto (revenue = price × qty).</div>';
  return html;
}

function edaRenderCategorical() {
  const counts = {};
  edaData.forEach(d => { counts[d.category] = (counts[d.category] || 0) + 1; });
  const total = edaData.length;
  const colors = { 'Ração': '#FF6B35', 'Brinquedo': '#5C8D89', 'Areia': '#8A6FB1', 'Higiene': '#6B8E23', 'Acessórios': '#F4D35E' };

  // Pie chart
  const r = 80, cx = 100, cy = 100;
  let cumul = 0;
  const slices = Object.entries(counts).map(([cat, c]) => {
    const start = (cumul / total) * 2 * Math.PI - Math.PI / 2;
    cumul += c;
    const end = (cumul / total) * 2 * Math.PI - Math.PI / 2;
    const large = c / total > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    return `<path d="M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${colors[cat]}" stroke="#2B1810" stroke-width="2"/>`;
  }).join('');

  const legend = Object.entries(counts).map(([cat, c]) =>
    `<div class="eda-pie-row">
      <div class="eda-pie-sw" style="background: ${colors[cat]}"></div>
      <span>${cat}</span>
      <span class="eda-pie-pct">${(c / total * 100).toFixed(1)}%</span>
    </div>`
  ).join('');

  return `
    <div class="eda-chart-title">🥧 Distribuição da coluna "category"</div>
    <div class="eda-pie">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width: 200px;">${slices}</svg>
      <div class="eda-pie-legend">${legend}</div>
    </div>
  `;
}

function edaRenderMissing() {
  const cols = Object.keys(edaData[0]);
  const total = edaData.length;
  const html = cols.map(c => {
    const missing = edaData.filter(r => r[c] === null || r[c] === undefined).length;
    const pct = (missing / total * 100);
    return `<div class="eda-missing-row">
      <span><strong>${c}</strong></span>
      <div class="eda-missing-bar"><div class="eda-missing-fill" style="width: ${pct}%"></div></div>
      <span class="eda-missing-pct">${pct.toFixed(1)}%</span>
    </div>`;
  }).join('');
  return `
    <div class="eda-chart-title">🕳️ Missing values por coluna</div>
    ${html}
    <div style="margin-top: 14px; font-size: 12px; color: var(--ink-soft);">
      💡 Estratégias: <strong>imputar mediana</strong> (numérico simétrico), <strong>imputar moda</strong> (categórico), <strong>flag separado</strong> (missing tem significado), <strong>descartar coluna</strong> se &gt; 50% missing, <strong>descartar linha</strong> se poucos casos.
    </div>
  `;
}

function edaRenderOutlier() {
  const cols = ['price', 'qty', 'customer_age', 'revenue'];
  const w = 600, h = 240;
  const colW = w / cols.length;

  let html = `<div class="eda-chart-title">🚨 Box plot · detecção de outliers (regra IQR × 1.5)</div>`;
  html += `<svg class="eda-chart-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;

  cols.forEach((col, i) => {
    const stats = edaNumStats(edaData.map(d => d[col]));
    if (!stats) return;
    const cx = colW * (i + 0.5);
    const lowerFence = stats.q1 - 1.5 * stats.iqr;
    const upperFence = stats.q3 + 1.5 * stats.iqr;
    const outliers = edaData.map(d => d[col]).filter(v => v !== null && (v < lowerFence || v > upperFence));

    // Normalize: top of box = q3, bottom = q1
    const padTop = 30, padBot = 50;
    const range = stats.max - stats.min;
    const scale = (h - padTop - padBot) / range;
    const yQ1 = padTop + (stats.max - stats.q1) * scale;
    const yQ3 = padTop + (stats.max - stats.q3) * scale;
    const yMedian = padTop + (stats.max - stats.median) * scale;
    const yLowerFence = padTop + (stats.max - Math.max(stats.min, lowerFence)) * scale;
    const yUpperFence = padTop + (stats.max - Math.min(stats.max, upperFence)) * scale;

    // Box
    html += `<rect x="${cx - 25}" y="${yQ3}" width="50" height="${yQ1 - yQ3}" fill="var(--orange)" stroke="var(--ink)" stroke-width="1.5"/>`;
    // Median line
    html += `<line x1="${cx - 25}" y1="${yMedian}" x2="${cx + 25}" y2="${yMedian}" stroke="var(--ink)" stroke-width="2"/>`;
    // Whiskers
    html += `<line x1="${cx}" y1="${yQ3}" x2="${cx}" y2="${yUpperFence}" stroke="var(--ink)" stroke-width="1"/>`;
    html += `<line x1="${cx}" y1="${yQ1}" x2="${cx}" y2="${yLowerFence}" stroke="var(--ink)" stroke-width="1"/>`;
    html += `<line x1="${cx - 15}" y1="${yUpperFence}" x2="${cx + 15}" y2="${yUpperFence}" stroke="var(--ink)" stroke-width="1.5"/>`;
    html += `<line x1="${cx - 15}" y1="${yLowerFence}" x2="${cx + 15}" y2="${yLowerFence}" stroke="var(--ink)" stroke-width="1.5"/>`;

    // Outliers (round dots)
    outliers.forEach(v => {
      const y = padTop + (stats.max - v) * scale;
      html += `<circle cx="${cx}" cy="${Math.max(padTop, Math.min(h - padBot, y))}" r="3" fill="var(--coral)" stroke="var(--ink)" stroke-width="0.5"/>`;
    });

    // Label
    html += `<text x="${cx}" y="${h - 30}" text-anchor="middle" font-family="JetBrains Mono" font-size="11" font-weight="700">${col}</text>`;
    html += `<text x="${cx}" y="${h - 14}" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="var(--coral)">${outliers.length} outliers</text>`;
  });

  html += '</svg>';
  html += '<div style="margin-top: 10px; font-size: 12px; color: var(--ink-soft);">📐 Outliers detectados via <strong>IQR × 1.5</strong>: pontos abaixo de Q1 - 1.5·IQR ou acima de Q3 + 1.5·IQR. <strong>customer_age</strong> tem valores absurdos (200+ anos), bug do source que precisa ser tratado antes do modelo.</div>';
  return html;
}

const edaInsights = {
  overview: '🔬 <strong>Primeira inspeção</strong>: 500 linhas, 9 colunas. Veja a coluna missing, se você notou que <strong>rating</strong> e <strong>satisfaction</strong> têm 8-12% NaN, parabéns: aprendeu a regra nº 1 do EDA: olhar info() antes de modelar.',
  hist: '📊 <strong>Histograma de price</strong>: distribuição multimodal, diferentes categorias têm preços bem distintos (Higiene fica em ~25, Ração em ~80). <strong>Mean</strong> (vermelho) e <strong>median</strong> (verde) próximos = distribuição razoavelmente simétrica.',
  scatter: '📈 <strong>Scatter price × satisfaction</strong>: correlação positiva moderada, produtos mais caros tendem a ser melhor avaliados. Cores revelam que Higiene (verde) fica concentrado em preço baixo + satisfação média.',
  corr: '🔥 <strong>Heatmap</strong>: <code>price × revenue</code> tem correlação alta porque revenue = price × qty (redundância matemática). Cuidado: incluir as duas no modelo causa <strong>multicolinearidade</strong>.',
  cat: '🥧 <strong>Pie chart</strong> revela balanceamento das categorias. Se uma categoria dominasse (>70%), seria sinal de <strong>desbalanceamento</strong>, pode precisar de SMOTE ou class_weight no treino.',
  missing: '🕳️ <strong>Missing</strong>: rating tem ~12%, satisfaction ~8%. Padrão: usuários que dão rating também avaliam. Isso é <strong>MAR</strong> (Missing At Random), pode imputar com confiança.',
  outlier: '🚨 <strong>Outliers</strong>: customer_age tem valores de 200+ anos, <strong>data quality bug</strong>. Provavelmente erro de digitação no source (mistura de ano e idade). Deve ser tratado: descartar ou corrigir.'
};

function edaRender() {
  let html = '';
  if (edaTab === 'overview') html = edaRenderOverview();
  else if (edaTab === 'hist') html = edaRenderHistogram();
  else if (edaTab === 'scatter') html = edaRenderScatter();
  else if (edaTab === 'corr') html = edaRenderCorrelation();
  else if (edaTab === 'cat') html = edaRenderCategorical();
  else if (edaTab === 'missing') html = edaRenderMissing();
  else if (edaTab === 'outlier') html = edaRenderOutlier();
  document.getElementById('eda-content').innerHTML = html;
  document.getElementById('eda-insights').innerHTML = '💡 ' + edaInsights[edaTab];
}

document.querySelectorAll('.eda-tab').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.eda-tab').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    edaTab = b.dataset.eda;
    edaRender();
  });
});

document.getElementById('eda-regen').addEventListener('click', () => {
  edaData = edaGenDataset();
  edaUpdateSummary();
  edaRender();
});

edaUpdateSummary();
edaRender();
