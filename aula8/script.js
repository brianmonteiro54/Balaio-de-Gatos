/* ===== aula 8: Comprehend, Medical, HealthScribe, Polly, Transcribe ===== */

// ============================================================
// MÓDULO 1: AMAZON COMPREHEND
// ============================================================
const cmpExamples = [
  "Comprei 3 caixas de ração premium na PetShop Bigode em São Paulo no dia 15 de março. O atendimento foi excelente, a Maria foi super atenciosa e meu gato adorou o produto.",
  "A Petrobras anunciou nesta segunda-feira que o lucro do segundo trimestre superou as expectativas dos analistas, atingindo R$ 28 bilhões. As ações subiram 4% em Nova York.",
  "Minha encomenda da Amazon não chegou. Já são 15 dias de atraso! O suporte da Maria Silva é horrível, ninguém responde meus e-mails. Quero meu dinheiro de volta. Telefone: 11 98765-4321.",
  "I had an amazing experience at the Whiskers Hotel in Boston last weekend. The staff was incredibly friendly and my cat loved the spacious rooms. Highly recommended!",
  "Compré una bolsa de comida para gatos en el supermercado de Madrid. La atención fue excelente y el producto llegó en perfectas condiciones. ¡Muy recomendado!"
];

const cmpLangMap = {
  0: { code: 'pt', conf: 0.99, name: 'Português' },
  1: { code: 'pt', conf: 0.99, name: 'Português' },
  2: { code: 'pt', conf: 0.99, name: 'Português' },
  3: { code: 'en', conf: 0.99, name: 'English' },
  4: { code: 'es', conf: 0.99, name: 'Español' }
};

let cmpCurrentEx = 0;
let cmpCurrentTask = 'lang';

document.querySelectorAll('#cmp-examples .cmp-ex-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('#cmp-examples .cmp-ex-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    cmpCurrentEx = parseInt(b.dataset.ex);
    document.getElementById('cmp-input').value = cmpExamples[cmpCurrentEx];
    cmpRender();
  });
});

document.querySelectorAll('.cmp-task').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.cmp-task').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    cmpCurrentTask = b.dataset.task;
    cmpRender();
  });
});

document.getElementById('cmp-input').addEventListener('input', () => {
  // user typed: we don't change the example index
  cmpRender();
});

function cmpDetectLanguage(text) {
  const lower = text.toLowerCase();
  // Heuristic
  const ptHits = (lower.match(/\b(o|a|os|as|que|para|com|não|muito|também|gato|comprei|atendimento)\b/g) || []).length;
  const enHits = (lower.match(/\b(the|and|was|with|very|i|my|highly|recommend|amazing)\b/g) || []).length;
  const esHits = (lower.match(/\b(el|la|los|las|que|para|con|muy|recomendado|atención|comida)\b/g) || []).length;
  const max = Math.max(ptHits, enHits, esHits);
  if (max === 0) return { code: 'pt', conf: 0.5, name: 'Português' };
  if (ptHits === max) return { code: 'pt', conf: Math.min(0.99, 0.6 + ptHits * 0.05), name: 'Português' };
  if (enHits === max) return { code: 'en', conf: Math.min(0.99, 0.6 + enHits * 0.05), name: 'English' };
  return { code: 'es', conf: Math.min(0.99, 0.6 + esHits * 0.05), name: 'Español' };
}

function cmpDetectSentiment(text) {
  const lower = text.toLowerCase();
  const pos = ['adorei', 'amei', 'excelente', 'ótimo', 'incrível', 'recomendo', 'maravilha', 'super', 'perfeito',
    'amazing', 'great', 'excellent', 'love', 'highly recommend', 'friendly', 'spacious',
    'excelente', 'recomendado', 'perfecto'];
  const neg = ['horrível', 'péssimo', 'ruim', 'odiei', 'não chegou', 'atraso', 'quero meu dinheiro',
    'awful', 'terrible', 'horrible', 'never', 'angry'];
  let p = 0, n = 0;
  pos.forEach(w => { if (lower.includes(w)) p++; });
  neg.forEach(w => { if (lower.includes(w)) n++; });
  let posScore, negScore, neuScore, mixScore;
  if (p === 0 && n === 0) {
    posScore = 0.05; negScore = 0.05; neuScore = 0.85; mixScore = 0.05;
  } else if (p > 0 && n > 0) {
    mixScore = Math.min(0.7, (Math.min(p, n) / Math.max(p, n)) * 0.85);
    posScore = (p / (p + n)) * (1 - mixScore) * 0.65;
    negScore = (n / (p + n)) * (1 - mixScore) * 0.65;
    neuScore = 1 - posScore - negScore - mixScore;
  } else if (p > n) {
    posScore = Math.min(0.95, 0.5 + p * 0.12);
    negScore = 0.02;
    neuScore = 1 - posScore - 0.04;
    mixScore = 0.02;
  } else {
    negScore = Math.min(0.95, 0.5 + n * 0.12);
    posScore = 0.02;
    neuScore = 1 - negScore - 0.04;
    mixScore = 0.02;
  }
  const sum = posScore + negScore + neuScore + mixScore;
  return {
    POSITIVE: posScore / sum,
    NEGATIVE: negScore / sum,
    NEUTRAL: neuScore / sum,
    MIXED: mixScore / sum
  };
}

const cmpEntityPatterns = {
  PERSON: ['Maria', 'Maria Silva', 'Brian', 'João', 'Pedro'],
  LOCATION: ['São Paulo', 'Boston', 'Madrid', 'Brasil', 'Nova York'],
  ORGANIZATION: ['Amazon', 'Petrobras', 'PetShop Bigode', 'Whiskers Hotel'],
  DATE: ['15 de março', 'last weekend', 'segunda-feira', 'segundo trimestre'],
  QUANTITY: ['3 caixas', '15 dias', 'R$ 28 bilhões', '4%'],
  COMMERCIAL_ITEM: ['ração premium', 'comida para gatos']
};

function cmpExtractEntities(text) {
  const results = [];
  Object.keys(cmpEntityPatterns).forEach(type => {
    cmpEntityPatterns[type].forEach(pat => {
      let idx = 0;
      const lower = text.toLowerCase();
      const lowPat = pat.toLowerCase();
      while ((idx = lower.indexOf(lowPat, idx)) !== -1) {
        results.push({ type, text: text.slice(idx, idx + pat.length), conf: 0.85 + Math.random() * 0.13, begin: idx, end: idx + pat.length });
        idx += pat.length;
      }
    });
  });
  return results.sort((a, b) => a.begin - b.begin);
}

function cmpExtractKeyPhrases(text) {
  // Heuristic noun phrases
  const candidates = [
    ['caixas de ração premium', 0.91],
    ['atendimento', 0.88],
    ['Maria', 0.82],
    ['lucro do segundo trimestre', 0.94],
    ['expectativas dos analistas', 0.89],
    ['encomenda da Amazon', 0.95],
    ['suporte', 0.86],
    ['amazing experience', 0.93],
    ['Whiskers Hotel', 0.91],
    ['spacious rooms', 0.88],
    ['comida para gatos', 0.95],
    ['supermercado', 0.79],
    ['perfectas condiciones', 0.86]
  ];
  return candidates.filter(([phrase]) => text.toLowerCase().includes(phrase.toLowerCase()));
}

function cmpExtractPos(text) {
  // extremely simplistic POS
  const words = text.split(/(\s+|[.,!?;:])/g).filter(x => x.trim() !== '');
  const tags = [];
  const dets = ['o', 'a', 'os', 'as', 'um', 'uma', 'the', 'a', 'an', 'el', 'la'];
  const verbs = ['comprei', 'foi', 'adorou', 'anunciou', 'subiram', 'chegou', 'responde', 'quero', 'had', 'was', 'loved', 'compré', 'llegó'];
  const adjs = ['premium', 'excelente', 'super', 'atenciosa', 'horrível', 'amazing', 'friendly', 'spacious', 'highly', 'perfectas'];
  const nums = /^\d+$/;
  const punct = /^[.,!?;:]$/;
  words.forEach(w => {
    const lw = w.toLowerCase();
    let tag = 'NOUN';
    if (punct.test(w)) tag = 'PUNCT';
    else if (nums.test(w)) tag = 'NUM';
    else if (dets.includes(lw)) tag = 'DET';
    else if (verbs.includes(lw)) tag = 'VERB';
    else if (adjs.includes(lw)) tag = 'ADJ';
    else if (/^[A-Z]/.test(w)) tag = 'PROPN';
    tags.push({ word: w, tag });
  });
  return tags;
}

function cmpExtractPii(text) {
  const results = [];
  // emails
  text.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, (m, idx) => {
    results.push({ type: 'EMAIL', text: m });
    return m;
  });
  // phones
  text.replace(/\b\d{2}\s?\d{4,5}-?\d{4}\b/g, m => { results.push({ type: 'PHONE', text: m }); return m; });
  // CPF
  text.replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, m => { results.push({ type: 'CPF', text: m }); return m; });
  // names (matching person from entities)
  const names = cmpExtractEntities(text).filter(e => e.type === 'PERSON');
  names.forEach(n => results.push({ type: 'NAME', text: n.text }));
  return results;
}

function cmpRender() {
  const text = document.getElementById('cmp-input').value;
  const out = document.getElementById('cmp-output');
  const code = document.getElementById('cmp-code');

  if (cmpCurrentTask === 'lang') {
    const r = cmpDetectLanguage(text);
    out.innerHTML = `
      <h5>🌎 Idioma detectado</h5>
      <div class="row">
        <span class="lbl">${r.name} (${r.code})</span>
        <div class="cmp-bar"><div class="fill sage" style="width:${r.conf * 100}%"></div></div>
        <span class="v">${(r.conf * 100).toFixed(0)}%</span>
      </div>
      <p style="font-family: 'Sora', sans-serif; font-size: 13px; margin-top: 12px; color: var(--ink-soft);">
        ↑ Comprehend suporta 100+ idiomas. Algumas APIs (Sentiment) só rodam em alguns; idioma é sempre detectado primeiro.
      </p>`;
    code.innerHTML = `<span class="c"># Detectar idioma</span>
<span class="k">import</span> boto3
client = boto3.client(<span class="s">"comprehend"</span>)

resp = client.detect_dominant_language(
    Text=<span class="s">"${text.slice(0, 60).replace(/"/g, '\\"')}..."</span>
)
<span class="c"># resp["Languages"][0] →</span>
<span class="c"># {"LanguageCode": "${r.code}", "Score": ${r.conf.toFixed(2)}}</span>`;
  }

  else if (cmpCurrentTask === 'sent') {
    const r = cmpDetectSentiment(text);
    const sorted = Object.entries(r).sort((a, b) => b[1] - a[1]);
    const winner = sorted[0][0];
    const fillClass = { POSITIVE: 'olive', NEGATIVE: 'coral', NEUTRAL: 'sage', MIXED: 'purple' };
    let html = `<h5>💚 Sentimento dominante: <span style="color:var(--orange-deep)">${winner}</span></h5>`;
    Object.entries(r).forEach(([k, v]) => {
      html += `<div class="row">
        <span class="lbl">${k}</span>
        <div class="cmp-bar"><div class="fill ${fillClass[k]}" style="width:${v * 100}%"></div></div>
        <span class="v">${(v * 100).toFixed(0)}%</span>
      </div>`;
    });
    out.innerHTML = html;
    code.innerHTML = `<span class="c"># Análise de sentimento</span>
resp = client.detect_sentiment(
    Text=text,
    LanguageCode=<span class="s">"pt"</span>
)
<span class="c"># resp →</span>
<span class="c"># Sentiment: ${winner}</span>
<span class="c"># SentimentScore: {</span>
<span class="c">#   "Positive": ${r.POSITIVE.toFixed(3)},</span>
<span class="c">#   "Negative": ${r.NEGATIVE.toFixed(3)},</span>
<span class="c">#   "Neutral":  ${r.NEUTRAL.toFixed(3)},</span>
<span class="c">#   "Mixed":    ${r.MIXED.toFixed(3)}</span>
<span class="c"># }</span>`;
  }

  else if (cmpCurrentTask === 'entities') {
    const ents = cmpExtractEntities(text);
    if (ents.length === 0) {
      out.innerHTML = `<h5>🔍 Entidades detectadas</h5><p style="font-family: 'Sora', sans-serif; font-size: 13px; color: var(--ink-soft); margin-top: 8px;">Nenhuma entidade reconhecida no texto atual.</p>`;
    } else {
      let html = '<h5>🔍 Entidades detectadas</h5><div style="margin-top: 10px; font-family: \'Sora\', sans-serif; line-height: 2;">';
      let lastIdx = 0;
      ents.forEach(e => {
        html += text.slice(lastIdx, e.begin);
        html += `<span class="cmp-entity ${e.type}">${e.text}<small>${e.type}</small></span>`;
        lastIdx = e.end;
      });
      html += text.slice(lastIdx);
      html += '</div>';
      // counts
      const counts = {};
      ents.forEach(e => counts[e.type] = (counts[e.type] || 0) + 1);
      html += '<div style="margin-top: 16px; font-family: \'Sora\', sans-serif; font-size: 13px; color: var(--ink-soft);">';
      html += `Total: <strong>${ents.length}</strong> · ` + Object.entries(counts).map(([t, c]) => `${t}: ${c}`).join(' · ');
      html += '</div>';
      out.innerHTML = html;
    }
    code.innerHTML = `<span class="c"># Extrair entidades nomeadas</span>
resp = client.detect_entities(
    Text=text,
    LanguageCode=<span class="s">"pt"</span>
)
<span class="c"># Tipos: PERSON, LOCATION, ORGANIZATION,</span>
<span class="c">#         DATE, QUANTITY, COMMERCIAL_ITEM, EVENT,</span>
<span class="c">#         TITLE, OTHER</span>`;
  }

  else if (cmpCurrentTask === 'phrases') {
    const phrases = cmpExtractKeyPhrases(text);
    if (phrases.length === 0) {
      out.innerHTML = `<h5>🔑 Frases-chave</h5><p style="font-family: 'Sora', sans-serif; font-size: 13px; color: var(--ink-soft); margin-top: 8px;">Nenhuma frase-chave detectada.</p>`;
    } else {
      let html = '<h5>🔑 Frases-chave</h5><div style="margin-top: 10px;">';
      phrases.forEach(([phrase, conf]) => {
        html += `<span class="cmp-phrase">${phrase} <small style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--orange-deep)">${(conf * 100).toFixed(0)}%</small></span>`;
      });
      html += '</div>';
      out.innerHTML = html;
    }
    code.innerHTML = `<span class="c"># Frases-chave (núcleos significativos do texto)</span>
resp = client.detect_key_phrases(
    Text=text,
    LanguageCode=<span class="s">"pt"</span>
)
<span class="c"># Útil pra resumir documentos longos,</span>
<span class="c"># gerar tags automáticas, indexar busca</span>`;
  }

  else if (cmpCurrentTask === 'syntax') {
    const tags = cmpExtractPos(text);
    let html = '<h5>🏷️ Sintaxe (POS tagging)</h5><div style="margin-top: 10px;">';
    tags.forEach(t => {
      if (t.tag === 'PUNCT') {
        html += `<span style="margin: 0 2px;">${t.word}</span>`;
      } else {
        html += `<span class="cmp-pos-token">${t.word}<small>${t.tag}</small></span>`;
      }
    });
    html += '</div>';
    out.innerHTML = html;
    code.innerHTML = `<span class="c"># POS tagging</span>
resp = client.detect_syntax(
    Text=text,
    LanguageCode=<span class="s">"pt"</span>
)
<span class="c"># Tags: NOUN, VERB, ADJ, ADV, DET,</span>
<span class="c">#       ADP, PROPN, NUM, PUNCT, etc.</span>`;
  }

  else if (cmpCurrentTask === 'pii') {
    const pii = cmpExtractPii(text);
    if (pii.length === 0) {
      out.innerHTML = `<h5>🛡️ PII (informação pessoal)</h5><p style="font-family:'Sora', sans-serif; font-size: 13px; color: var(--ink-soft); margin-top: 8px;">✅ Nenhuma PII detectada. Texto limpo pra publicar.</p>`;
    } else {
      let html = '<h5>🛡️ PII detectada</h5><div style="margin-top: 10px;">';
      pii.forEach(p => {
        html += `<span class="cmp-entity PII">${p.text}<small>${p.type}</small></span>`;
      });
      html += '</div>';
      // redacted version
      let redacted = text;
      pii.forEach(p => {
        redacted = redacted.split(p.text).join('[' + p.type + ']');
      });
      html += `<div style="margin-top: 16px; font-family: 'Sora', sans-serif; font-size: 13px; color: var(--ink-soft);"><strong>Versão redigida:</strong></div>`;
      html += `<div style="margin-top: 6px; padding: 10px 12px; background: var(--paper); border: 1.5px solid var(--ink); border-radius: 8px; font-family:'Sora', sans-serif; font-size: 14px;">${redacted}</div>`;
      out.innerHTML = html;
    }
    code.innerHTML = `<span class="c"># Detectar PII</span>
resp = client.detect_pii_entities(
    Text=text,
    LanguageCode=<span class="s">"pt"</span>
)
<span class="c"># Tipos: NAME, EMAIL, PHONE, CREDIT_CARD,</span>
<span class="c">#         SSN, BANK_ACCOUNT, PASSWORD, etc.</span>
<span class="c"># Usa contains_pii_entities() pra check rápido</span>`;
  }
}

cmpRender();

// ============================================================
// MÓDULO 2: COMPREHEND MEDICAL
// ============================================================
const medCases = [
  {
    text: 'Felix, gato siamês de 8 anos, apresenta vômito persistente há 3 dias. Prescrita ondansetrona 0,5 mg/kg via oral a cada 12 horas e fluidoterapia subcutânea. Solicitada hemograma completo e ultrassom abdominal.',
    entities: [
      { text: 'Felix', type: 'PHI', cat: 'NAME' },
      { text: 'gato siamês', type: 'ANATOMY', cat: 'SYSTEM_ORGAN_SITE' },
      { text: '8 anos', type: 'PHI', cat: 'AGE' },
      { text: 'vômito', type: 'MEDICAL_CONDITION', cat: 'DX_NAME' },
      { text: '3 dias', type: 'FREQUENCY', cat: 'DURATION' },
      { text: 'ondansetrona', type: 'MEDICATION', cat: 'GENERIC_NAME' },
      { text: '0,5 mg/kg', type: 'DOSAGE', cat: 'DOSAGE' },
      { text: 'via oral', type: 'TEST_TREATMENT_PROCEDURE', cat: 'ROUTE_OR_MODE' },
      { text: 'a cada 12 horas', type: 'FREQUENCY', cat: 'FREQUENCY' },
      { text: 'fluidoterapia subcutânea', type: 'TEST_TREATMENT_PROCEDURE', cat: 'TREATMENT_NAME' },
      { text: 'hemograma completo', type: 'TEST_TREATMENT_PROCEDURE', cat: 'TEST_NAME' },
      { text: 'ultrassom abdominal', type: 'TEST_TREATMENT_PROCEDURE', cat: 'TEST_NAME' }
    ]
  },
  {
    text: 'Paciente Maria Silva, 47 anos, comparece com queixa de cefaleia há 5 dias, irradiando para região cervical. PA aferida em 140x90 mmHg. Em uso de losartana 50 mg uma vez ao dia para hipertensão arterial. Solicitada tomografia de crânio.',
    entities: [
      { text: 'Maria Silva', type: 'PHI', cat: 'NAME' },
      { text: '47 anos', type: 'PHI', cat: 'AGE' },
      { text: 'cefaleia', type: 'MEDICAL_CONDITION', cat: 'DX_NAME' },
      { text: '5 dias', type: 'FREQUENCY', cat: 'DURATION' },
      { text: 'região cervical', type: 'ANATOMY', cat: 'SYSTEM_ORGAN_SITE' },
      { text: 'PA', type: 'TEST_TREATMENT_PROCEDURE', cat: 'TEST_NAME' },
      { text: '140x90 mmHg', type: 'TEST_TREATMENT_PROCEDURE', cat: 'TEST_VALUE' },
      { text: 'losartana', type: 'MEDICATION', cat: 'GENERIC_NAME' },
      { text: '50 mg', type: 'DOSAGE', cat: 'DOSAGE' },
      { text: 'uma vez ao dia', type: 'FREQUENCY', cat: 'FREQUENCY' },
      { text: 'hipertensão arterial', type: 'MEDICAL_CONDITION', cat: 'DX_NAME' },
      { text: 'tomografia de crânio', type: 'TEST_TREATMENT_PROCEDURE', cat: 'TEST_NAME' }
    ]
  },
  {
    text: 'João Pereira, 62 anos, diabético tipo 2, mantém esquema com metformina 850 mg duas vezes ao dia, glargina 20 unidades subcutânea ao deitar e atorvastatina 40 mg uma vez ao dia. HbA1c última de 7,8%. Encaminhado ao endocrinologista.',
    entities: [
      { text: 'João Pereira', type: 'PHI', cat: 'NAME' },
      { text: '62 anos', type: 'PHI', cat: 'AGE' },
      { text: 'diabético tipo 2', type: 'MEDICAL_CONDITION', cat: 'DX_NAME' },
      { text: 'metformina', type: 'MEDICATION', cat: 'GENERIC_NAME' },
      { text: '850 mg', type: 'DOSAGE', cat: 'DOSAGE' },
      { text: 'duas vezes ao dia', type: 'FREQUENCY', cat: 'FREQUENCY' },
      { text: 'glargina', type: 'MEDICATION', cat: 'GENERIC_NAME' },
      { text: '20 unidades', type: 'DOSAGE', cat: 'DOSAGE' },
      { text: 'subcutânea', type: 'TEST_TREATMENT_PROCEDURE', cat: 'ROUTE_OR_MODE' },
      { text: 'ao deitar', type: 'FREQUENCY', cat: 'FREQUENCY' },
      { text: 'atorvastatina', type: 'MEDICATION', cat: 'GENERIC_NAME' },
      { text: '40 mg', type: 'DOSAGE', cat: 'DOSAGE' },
      { text: 'uma vez ao dia', type: 'FREQUENCY', cat: 'FREQUENCY' },
      { text: 'HbA1c', type: 'TEST_TREATMENT_PROCEDURE', cat: 'TEST_NAME' },
      { text: '7,8%', type: 'TEST_TREATMENT_PROCEDURE', cat: 'TEST_VALUE' }
    ]
  },
  {
    text: 'Resumo de alta de Pedro Souza, internado de 2024-03-12 a 2024-03-18 por pneumonia bacteriana adquirida na comunidade. Tratado com ceftriaxona 1 g endovenosa de 12 em 12 horas durante 7 dias. Alta com prescrição de azitromicina 500 mg uma vez ao dia por 5 dias e retorno em 14 dias.',
    entities: [
      { text: 'Pedro Souza', type: 'PHI', cat: 'NAME' },
      { text: '2024-03-12', type: 'PHI', cat: 'DATE' },
      { text: '2024-03-18', type: 'PHI', cat: 'DATE' },
      { text: 'pneumonia bacteriana adquirida na comunidade', type: 'MEDICAL_CONDITION', cat: 'DX_NAME' },
      { text: 'ceftriaxona', type: 'MEDICATION', cat: 'GENERIC_NAME' },
      { text: '1 g', type: 'DOSAGE', cat: 'DOSAGE' },
      { text: 'endovenosa', type: 'TEST_TREATMENT_PROCEDURE', cat: 'ROUTE_OR_MODE' },
      { text: 'de 12 em 12 horas', type: 'FREQUENCY', cat: 'FREQUENCY' },
      { text: '7 dias', type: 'FREQUENCY', cat: 'DURATION' },
      { text: 'azitromicina', type: 'MEDICATION', cat: 'GENERIC_NAME' },
      { text: '500 mg', type: 'DOSAGE', cat: 'DOSAGE' },
      { text: 'uma vez ao dia', type: 'FREQUENCY', cat: 'FREQUENCY' },
      { text: '5 dias', type: 'FREQUENCY', cat: 'DURATION' },
      { text: '14 dias', type: 'FREQUENCY', cat: 'DURATION' }
    ]
  }
];

let medCurrent = 0;
let medActiveEntity = null;

function medRender() {
  const c = medCases[medCurrent];
  const container = document.getElementById('med-text');
  let html = c.text;
  // Replace entities with highlighted spans (longest first to avoid overlap)
  const ents = [...c.entities].sort((a, b) => b.text.length - a.text.length);
  ents.forEach((e, idx) => {
    const safe = e.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<!data-text=")${safe}(?!")`);
    html = html.replace(re, `<span class="med-ent ${e.type}" data-eidx="${idx}" data-text="${e.text}" data-cat="${e.cat}" data-type="${e.type}">${e.text}</span>`);
  });
  container.innerHTML = html;

  // attach hover/click listeners
  container.querySelectorAll('.med-ent').forEach(span => {
    span.addEventListener('click', () => {
      container.querySelectorAll('.med-ent').forEach(x => x.classList.remove('active'));
      span.classList.add('active');
      medShowDetail(span);
    });
  });

  document.getElementById('med-detail').innerHTML = `<span class="hint">💡 Passa o mouse (ou clica) numa palavra destacada pra ver detalhes da entidade.</span>`;
  document.getElementById('med-mapping').style.display = 'none';
}

function medShowDetail(span) {
  const text = span.dataset.text;
  const type = span.dataset.type;
  const cat = span.dataset.cat;
  const conf = (0.85 + Math.random() * 0.13).toFixed(3);
  const traits = [];
  if (type === 'MEDICATION') traits.push('GENERIC_NAME');
  if (type === 'MEDICAL_CONDITION') traits.push('SYMPTOM', 'DIAGNOSIS');
  if (type === 'PHI') traits.push('PROTECTED_HEALTH_INFO');

  document.getElementById('med-detail').innerHTML = `
    <h6>🔍 Entidade: ${text}</h6>
    <div class="row"><span>Type</span><strong>${type}</strong></div>
    <div class="row"><span>Category</span><strong>${cat}</strong></div>
    <div class="row"><span>Score</span><strong>${conf}</strong></div>
    ${traits.length ? `<div class="row"><span>Traits</span><strong>${traits.join(', ')}</strong></div>` : ''}
    <div class="row"><span>BeginOffset</span><strong>${span.offsetLeft}px (mock)</strong></div>
  `;
}

document.querySelectorAll('#med-cases .med-case-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('#med-cases .med-case-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    medCurrent = parseInt(b.dataset.case);
    medRender();
  });
});

// ICD-10 mapping
const icd10Map = {
  'cefaleia': { code: 'R51', desc: 'Cefaleia' },
  'hipertensão arterial': { code: 'I10', desc: 'Hipertensão essencial (primária)' },
  'diabético tipo 2': { code: 'E11', desc: 'Diabetes mellitus tipo 2' },
  'pneumonia bacteriana adquirida na comunidade': { code: 'J18.9', desc: 'Pneumonia, não especificada' },
  'vômito': { code: 'R11.0', desc: 'Náusea com vômito' }
};
const rxNormMap = {
  'losartana': { code: '203160', desc: 'losartan 50 MG Oral Tablet' },
  'metformina': { code: '861007', desc: 'metformin hydrochloride 850 MG Oral Tablet' },
  'glargina': { code: '847230', desc: 'insulin glargine 100 UNT/ML Injectable Solution' },
  'atorvastatina': { code: '617318', desc: 'atorvastatin 40 MG Oral Tablet' },
  'ceftriaxona': { code: '309106', desc: 'ceftriaxone 1000 MG Injection' },
  'azitromicina': { code: '308459', desc: 'azithromycin 500 MG Oral Tablet' },
  'ondansetrona': { code: '198039', desc: 'ondansetron 4 MG Oral Tablet' }
};

document.getElementById('med-icd').addEventListener('click', () => {
  const c = medCases[medCurrent];
  const conds = c.entities.filter(e => e.type === 'MEDICAL_CONDITION');
  const mapping = document.getElementById('med-mapping');
  mapping.style.display = 'block';
  let html = '<h6>🏷️ ICD-10-CM Mapping</h6>';
  if (conds.length === 0) {
    html += '<p style="font-style: italic;">Nenhuma condição médica detectada nesse caso.</p>';
  } else {
    conds.forEach(c => {
      const m = icd10Map[c.text.toLowerCase()];
      if (m) {
        html += `<div class="map-row">
          <span>${c.text}</span>
          <span class="code">${m.code}</span>
          <span>${m.desc}</span>
        </div>`;
      } else {
        html += `<div class="map-row">
          <span>${c.text}</span>
          <span class="code">···</span>
          <span style="font-style:italic; color: var(--ink-soft)">sem match no demo</span>
        </div>`;
      }
    });
  }
  mapping.innerHTML = html;
});

document.getElementById('med-rxnorm').addEventListener('click', () => {
  const c = medCases[medCurrent];
  const meds = c.entities.filter(e => e.type === 'MEDICATION');
  const mapping = document.getElementById('med-mapping');
  mapping.style.display = 'block';
  let html = '<h6>💊 RxNorm Mapping</h6>';
  if (meds.length === 0) {
    html += '<p style="font-style: italic;">Nenhum medicamento detectado nesse caso.</p>';
  } else {
    meds.forEach(c => {
      const m = rxNormMap[c.text.toLowerCase()];
      if (m) {
        html += `<div class="map-row">
          <span>${c.text}</span>
          <span class="code">${m.code}</span>
          <span>${m.desc}</span>
        </div>`;
      } else {
        html += `<div class="map-row">
          <span>${c.text}</span>
          <span class="code">···</span>
          <span style="font-style:italic; color: var(--ink-soft)">sem match no demo</span>
        </div>`;
      }
    });
  }
  mapping.innerHTML = html;
});

document.getElementById('med-redact').addEventListener('click', () => {
  const phis = document.querySelectorAll('#med-text .med-ent.PHI');
  const isRedacted = phis.length > 0 && phis[0].classList.contains('redacted');
  phis.forEach(p => p.classList.toggle('redacted'));
  document.getElementById('med-redact').textContent = isRedacted ? '🛡️ Redact PHI' : '👁️ Mostrar PHI';
  document.getElementById('med-mapping').style.display = 'none';
});

medRender();


// ============================================================
// MÓDULO 3: HEALTHSCRIBE
// ============================================================
const hsScript = [
  { t: 0,    speaker: 'CLINICIAN', text: 'Bom dia, dona Ana. O que trouxe a senhora aqui hoje?', soap: null },
  { t: 4,    speaker: 'PATIENT',   text: 'Doutor, tô com uma dor de cabeça forte há uns 4 dias, e tá piorando.', soap: { S: 'Cefaleia há 4 dias, em piora progressiva.' } },
  { t: 9,    speaker: 'CLINICIAN', text: 'Entendi. A dor é mais de um lado da cabeça, ou em volta toda?', soap: null },
  { t: 13,   speaker: 'PATIENT',   text: 'É mais aqui na nuca, e tá indo pro pescoço.', soap: { S: 'Dor de localização cervical, irradiando para pescoço.' } },
  { t: 17,   speaker: 'CLINICIAN', text: 'A senhora teve febre, vômito, ou alguma alteração visual?', soap: null },
  { t: 21,   speaker: 'PATIENT',   text: 'Febre não, mas tá enjoada e a luz tá incomodando.', soap: { S: 'Sem febre. Refere náusea e fotofobia.' } },
  { t: 25,   speaker: 'CLINICIAN', text: 'Vou aferir sua pressão. Está em 150 por 95. Pulso 78.', soap: { O: 'PA: 150/95 mmHg.', O2: 'FC: 78 bpm.' } },
  { t: 30,   speaker: 'CLINICIAN', text: 'Pelo quadro, parece uma cefaleia tensional com componente hipertensivo. Vamos pedir uma TC de crânio sem contraste pra descartar.', soap: { A: 'Hipótese diagnóstica: cefaleia tensional + hipertensão arterial não controlada.' } },
  { t: 36,   speaker: 'CLINICIAN', text: 'Vou prescrever paracetamol 750 mg de 8 em 8 horas se dor, e vamos ajustar a losartana pra 100 mg uma vez ao dia. Retorno em 7 dias.', soap: { P: 'Paracetamol 750 mg 8/8h SOS.', P2: 'Aumentar losartana para 100 mg 1x/dia.', P3: 'Solicitada TC de crânio sem contraste.', P4: 'Retorno em 7 dias.' } },
  { t: 42,   speaker: 'PATIENT',   text: 'Tá certo, doutor. Obrigada.', soap: null }
];

let hsTime = 0;
let hsTimer = null;
let hsCurrentLine = -1;

function hsBuildWaveform() {
  const w = document.getElementById('hs-waveform');
  w.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const bar = document.createElement('div');
    bar.className = 'hs-wave-bar';
    bar.style.height = '20%';
    w.appendChild(bar);
  }
}

function hsAnimateWaveform(active) {
  const bars = document.querySelectorAll('.hs-wave-bar');
  bars.forEach(b => {
    if (active) {
      const h = 20 + Math.random() * 70;
      b.style.height = h + '%';
    } else {
      b.style.height = '20%';
    }
  });
}

function hsUpdate() {
  const total = 42;
  document.getElementById('hs-progress').style.width = (hsTime / total * 100) + '%';
  document.getElementById('hs-time').textContent =
    `${String(Math.floor(hsTime / 60)).padStart(2, '0')}:${String(Math.floor(hsTime % 60)).padStart(2, '0')} / 00:42`;

  // Find current line based on time
  let curIdx = -1;
  for (let i = 0; i < hsScript.length; i++) {
    if (hsTime >= hsScript[i].t) curIdx = i;
  }
  if (curIdx !== hsCurrentLine) {
    hsCurrentLine = curIdx;
    if (curIdx >= 0) {
      const line = hsScript[curIdx];
      document.getElementById('hs-current-speaker').textContent = line.speaker;
      document.getElementById('hs-current-speaker').className = 'hs-speaker-pill ' + line.speaker;
      document.getElementById('hs-current-line').textContent = '"' + line.text + '"';
      hsRenderTranscript();
      hsRenderSoap();
    }
  }
}

function hsRenderTranscript() {
  const c = document.getElementById('hs-transcript');
  c.innerHTML = '';
  for (let i = 0; i <= hsCurrentLine; i++) {
    const line = hsScript[i];
    const div = document.createElement('div');
    div.className = 'hs-transcript-line ' + line.speaker + (i === hsCurrentLine ? ' current' : ' played');
    div.innerHTML = `
      <span class="speaker">${line.speaker}</span>
      <span>${line.text}</span>
      <span class="ts">${String(Math.floor(line.t / 60)).padStart(2, '0')}:${String(line.t % 60).padStart(2, '0')}</span>
    `;
    c.appendChild(div);
  }
  c.scrollTop = c.scrollHeight;
}

function hsRenderSoap() {
  const sects = { S: [], O: [], A: [], P: [] };
  for (let i = 0; i <= hsCurrentLine; i++) {
    const line = hsScript[i];
    if (!line.soap) continue;
    Object.keys(line.soap).forEach(k => {
      const sect = k.charAt(0); // strips trailing digits like S2, O2
      if (sects[sect]) sects[sect].push({ text: line.soap[k], cite: i });
    });
  }
  Object.keys(sects).forEach(k => {
    const ul = document.getElementById('soap-' + k);
    ul.innerHTML = '';
    sects[k].forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `${item.text} <small>↩ citação: linha ${item.cite + 1}</small>`;
      ul.appendChild(li);
    });
  });
}

document.getElementById('hs-play').addEventListener('click', () => {
  if (hsTimer) clearInterval(hsTimer);
  hsTimer = setInterval(() => {
    hsTime += 0.5;
    hsAnimateWaveform(true);
    hsUpdate();
    if (hsTime >= 42) {
      clearInterval(hsTimer);
      hsTimer = null;
      hsAnimateWaveform(false);
    }
  }, 250);
});

document.getElementById('hs-pause').addEventListener('click', () => {
  if (hsTimer) {
    clearInterval(hsTimer);
    hsTimer = null;
    hsAnimateWaveform(false);
  }
});

document.getElementById('hs-reset').addEventListener('click', () => {
  if (hsTimer) clearInterval(hsTimer);
  hsTimer = null;
  hsTime = 0;
  hsCurrentLine = -1;
  hsAnimateWaveform(false);
  hsUpdate();
  document.getElementById('hs-current-speaker').textContent = '···';
  document.getElementById('hs-current-speaker').className = 'hs-speaker-pill';
  document.getElementById('hs-current-line').textContent = 'aguardando…';
  document.getElementById('hs-transcript').innerHTML = '';
  ['S', 'O', 'A', 'P'].forEach(k => {
    document.getElementById('soap-' + k).innerHTML = '';
  });
});

// Stage tabs
document.querySelectorAll('.hs-stage-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.hs-stage-tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.querySelectorAll('.hs-panel').forEach(p => p.classList.remove('active'));
    document.querySelector(`.hs-panel[data-panel="${t.dataset.stage}"]`).classList.add('active');
  });
});

hsBuildWaveform();

// ============================================================
// MÓDULO 4: TTS PIPELINE
// ============================================================
const ttsStageData = {
  text: {
    title: '📝 Texto cru',
    desc: 'A frase que você quer transformar em áudio. Pode ter números, abreviações, símbolos, datas: tudo bagunçado.',
    render: () => `<div style="font-size: 17px; color: var(--paper);">"O Dr. Smith mediu 38,5°C às 14h30 do dia 5/12."</div>`
  },
  normalize: {
    title: '🧹 Normalização',
    desc: 'Expandir abreviações, números e símbolos pra forma falável. Datas, unidades, moeda: cada idioma tem regras próprias.',
    render: () => `<div>Original: <em>"O Dr. Smith mediu 38,5°C às 14h30 do dia 5/12."</em></div>
      <div style="margin-top: 10px;">Normalizado:</div>
      <div style="margin-top: 6px; padding: 10px; background: rgba(255,255,255,0.06); border-radius: 8px;">
        "O <strong style="color:var(--yellow)">doutor</strong> Smith mediu <strong style="color:var(--yellow)">trinta e oito vírgula cinco graus celsius</strong> às <strong style="color:var(--yellow)">quatorze horas e trinta minutos</strong> do dia <strong style="color:var(--yellow)">cinco de dezembro</strong>."
      </div>`
  },
  phoneme: {
    title: '🔡 Conversão pra fonemas',
    desc: 'Cada palavra vira sequência de fonemas (sons mínimos). Aqui usamos IPA. "Casa" em pt-BR = /ˈkazɐ/.',
    render: () => `<div>Frase: <em>"O gato preto pulou no telhado"</em></div>
      <div style="margin-top: 10px;">Fonemas (IPA simplificado):</div>
      <div style="margin-top: 8px;">
        <span class="phoneme-tok">u</span>
        <span class="phoneme-tok">ˈga.tu</span>
        <span class="phoneme-tok">ˈpɾe.tu</span>
        <span class="phoneme-tok">pu.ˈlow</span>
        <span class="phoneme-tok">nu</span>
        <span class="phoneme-tok">tɛ.ˈʎa.du</span>
      </div>
      <div style="margin-top: 12px; font-size: 12px; opacity: 0.75;">↑ "ʎ" é o som de "lh" em telhado. Cada idioma tem seu inventário.</div>`
  },
  prosody: {
    title: '🎵 Prosódia',
    desc: 'A "música" da fala: onde colocar pausa, qual sílaba é tônica, entonação sobe ou desce. Determina se a frase soa robótica ou humana.',
    render: () => `<div>Marcação prosódica:</div>
      <div style="margin-top: 10px; line-height: 2.4;">
        O ga<span class="tts-stress">to</span> pre<span class="tts-stress">to</span> pu<span class="tts-stress">lou</span> no te<span class="tts-stress">lha</span>do<span style="font-size: 18px; color: var(--orange); margin: 0 6px;">↘️</span>
      </div>
      <div style="margin-top: 12px; font-size: 13px;">
        🟧 sílabas tônicas (mais força)<br>
        ↘️ entonação descendente (afirmativa, fim)<br>
        ↗️ ascendente (pergunta)
      </div>`
  },
  wave: {
    title: '📊 Mel-spectrogram → Waveform',
    desc: 'Modelos modernos (Tacotron, FastSpeech) geram um mel-spectrogram. Um vocoder neural (HiFi-GAN, WaveNet) transforma esse spectrogram em waveform de áudio.',
    render: () => `<div>Mel-spectrogram (representação tempo×frequência):</div>
      <svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" style="width:100%; margin-top: 10px; background: rgba(255,255,255,0.06); border-radius: 8px;">
        ${Array.from({length: 80}, (_, i) => {
          const cells = Array.from({length: 16}, (_, j) => {
            const intensity = Math.sin(i * 0.3 + j * 0.5) * 0.4 + 0.5 + Math.random() * 0.1;
            const a = Math.max(0, intensity);
            return `<rect x="${i * 5}" y="${j * 6 + 4}" width="5" height="6" fill="rgb(${255 * a}, ${107 * a}, ${53 * a})"/>`;
          }).join('');
          return cells;
        }).join('')}
      </svg>
      <div style="margin-top: 10px;">↓ Vocoder gera waveform:</div>
      <svg viewBox="0 0 400 40" xmlns="http://www.w3.org/2000/svg" style="width:100%; margin-top: 6px; background: rgba(255,255,255,0.06); border-radius: 8px;">
        <polyline points="${Array.from({length: 200}, (_, i) => {
          const y = 20 + Math.sin(i * 0.3) * 8 * Math.sin(i * 0.05) + Math.random() * 4 - 2;
          return `${i * 2},${y.toFixed(1)}`;
        }).join(' ')}" fill="none" stroke="var(--yellow)" stroke-width="1.5"/>
      </svg>`
  },
  audio: {
    title: '🔊 Áudio final',
    desc: 'O resultado: arquivo MP3 / OGG / PCM, ou stream direto pra navegador / SDK. Latência real do Polly: ~500ms pra primeira amostra.',
    render: () => `<div>Saída disponível em:</div>
      <ul style="margin-top: 10px; margin-left: 20px;">
        <li>📦 <strong style="color: var(--yellow)">MP3</strong> · padrão pra web e mobile</li>
        <li>📦 <strong style="color: var(--yellow)">OGG Vorbis</strong> · open source, mais leve</li>
        <li>📦 <strong style="color: var(--yellow)">PCM</strong> · raw, pra processamento adicional</li>
        <li>📡 <strong style="color: var(--yellow)">Streaming</strong> · áudio começa antes de terminar a síntese</li>
      </ul>
      <div style="margin-top: 14px; padding: 10px; background: rgba(244, 211, 94, 0.1); border-left: 4px solid var(--yellow); border-radius: 6px; font-size: 12.5px;">
        💡 <strong>Speech Marks</strong>: Polly também devolve metadados (tempo de cada palavra/fonema/sentença) pra animar avatar ou destacar texto sincronizado.
      </div>`
  }
};

document.querySelectorAll('.tts-stage').forEach(s => {
  s.addEventListener('click', () => {
    document.querySelectorAll('.tts-stage').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    const d = ttsStageData[s.dataset.tts];
    document.getElementById('tts-detail-head').textContent = d.title;
    document.getElementById('tts-detail-desc').innerHTML = d.desc;
    document.getElementById('tts-detail-result').innerHTML = d.render();
  });
});
document.querySelector('.tts-stage.active').click();

// ============================================================
// MÓDULO 5: AMAZON POLLY (Web Speech API)
// ============================================================
const pollySynth = window.speechSynthesis;
let pollyVoices = [];
let pollyCurrentTab = 'text';

const pollySsmlMap = {
  break: '<speak>Olá, sou o gato. <break time="1s"/> Pausa de 1 segundo. <break time="500ms"/> Outra de meio segundo.</speak>',
  'prosody-slow': '<speak>Vou <prosody rate="slow">falar bem devagar agora</prosody>, e voltar ao normal.</speak>',
  'prosody-fast': '<speak>Vou <prosody rate="fast">falar bem rápido agora!</prosody> Voltei ao normal.</speak>',
  emphasis: '<speak>Esse produto é <emphasis level="strong">excelente</emphasis>, mas o frete foi <emphasis level="reduced">aceitável</emphasis>.</speak>',
  phoneme: '<speak>O nome do gato é <phoneme alphabet="ipa" ph="ˈfɛlɪks">Felix</phoneme>, e ele é fofo.</speak>',
  'say-as': '<speak>O endereço é <say-as interpret-as="characters">RJ</say-as> e o telefone <say-as interpret-as="telephone">21988887777</say-as>. Hoje é <say-as interpret-as="date" format="dmy">28/05/2026</say-as>.</speak>',
  full: '<speak>Boas <emphasis>vindas</emphasis> ao Balaio de Gatos! <break time="500ms"/> Hoje você vai aprender sobre <prosody rate="slow" pitch="+5%">síntese de voz</prosody>. <break time="300ms"/> Vamos lá?</speak>'
};

function pollyLoadVoices() {
  pollyVoices = pollySynth.getVoices();
  const select = document.getElementById('polly-voice');
  select.innerHTML = '';
  if (pollyVoices.length === 0) {
    select.innerHTML = '<option>(Aguardando vozes do navegador…)</option>';
    return;
  }
  // Group by lang prefix
  const groups = {};
  pollyVoices.forEach((v, i) => {
    const lang = v.lang.split('-')[0];
    if (!groups[lang]) groups[lang] = [];
    groups[lang].push({ voice: v, idx: i });
  });
  // PT-BR first if exists
  const order = ['pt', 'en', 'es', 'fr', 'de', 'it', 'ja', 'zh'];
  const otherLangs = Object.keys(groups).filter(l => !order.includes(l)).sort();
  const finalOrder = order.filter(l => groups[l]).concat(otherLangs);
  finalOrder.forEach(lang => {
    const og = document.createElement('optgroup');
    og.label = `${lang.toUpperCase()} (${groups[lang].length} ${groups[lang].length === 1 ? 'voz' : 'vozes'})`;
    groups[lang].forEach(({ voice, idx }) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `${voice.name} · ${voice.lang}${voice.localService ? ' 💻' : ' ☁️'}`;
      og.appendChild(opt);
    });
    select.appendChild(og);
  });
  // Default: prefer pt-BR
  if (groups.pt && groups.pt.length > 0) {
    select.value = groups.pt[0].idx;
  }
  pollyUpdateCode();
}

if (pollySynth) {
  pollyLoadVoices();
  pollySynth.onvoiceschanged = pollyLoadVoices;
}

document.querySelectorAll('.polly-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.polly-tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    pollyCurrentTab = t.dataset.pollyTab;
    if (pollyCurrentTab === 'ssml') {
      document.getElementById('polly-ssml-examples').style.display = 'flex';
      document.getElementById('polly-text').value = pollySsmlMap.full;
    } else {
      document.getElementById('polly-ssml-examples').style.display = 'none';
      document.getElementById('polly-text').value = 'Oi, sou o gato do Balaio! Tô falando ao vivo, no seu navegador, sem chamar nenhuma API externa. A mesma interface seria usada pra chamar o Amazon Polly em produção.';
    }
    pollyUpdateCode();
  });
});

document.querySelectorAll('.polly-ssml-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.getElementById('polly-text').value = pollySsmlMap[b.dataset.ssml];
    pollyUpdateCode();
  });
});

function pollySsmlToText(ssml) {
  // strip tags
  return ssml.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

document.getElementById('polly-rate').addEventListener('input', e => {
  document.getElementById('polly-rate-v').textContent = parseFloat(e.target.value).toFixed(1).replace('.', ',') + '×';
  pollyUpdateCode();
});
document.getElementById('polly-pitch').addEventListener('input', e => {
  document.getElementById('polly-pitch-v').textContent = parseFloat(e.target.value).toFixed(1).replace('.', ',');
  pollyUpdateCode();
});
document.getElementById('polly-vol').addEventListener('input', e => {
  document.getElementById('polly-vol-v').textContent = Math.round(parseFloat(e.target.value) * 100) + '%';
  pollyUpdateCode();
});
document.getElementById('polly-voice').addEventListener('change', pollyUpdateCode);
document.getElementById('polly-text').addEventListener('input', pollyUpdateCode);

function pollyUpdateCode() {
  const txt = document.getElementById('polly-text').value;
  const rate = document.getElementById('polly-rate').value;
  const v = pollyVoices[document.getElementById('polly-voice').value] || { lang: 'pt-BR', name: 'Default' };
  const lang = v.lang || 'pt-BR';
  // Polly Voice IDs heuristic (just for display)
  const voiceMap = { 'pt-BR': 'Camila', 'en-US': 'Joanna', 'es-ES': 'Lucia', 'fr-FR': 'Lea', 'de-DE': 'Vicki', 'it-IT': 'Bianca', 'ja-JP': 'Takumi', 'zh-CN': 'Zhiyu', 'es-MX': 'Mia' };
  const voiceId = voiceMap[lang] || 'Joanna';
  const isSsml = pollyCurrentTab === 'ssml';
  document.getElementById('polly-code').innerHTML = `<span class="c"># Equivalente em Polly real (boto3)</span>
<span class="k">import</span> boto3
polly = boto3.client(<span class="s">"polly"</span>)

resp = polly.synthesize_speech(
    Text=<span class="s">"${txt.slice(0, 50).replace(/"/g, '\\"')}..."</span>,
    TextType=<span class="s">"${isSsml ? 'ssml' : 'text'}"</span>,
    VoiceId=<span class="s">"${voiceId}"</span>,
    OutputFormat=<span class="s">"mp3"</span>,
    Engine=<span class="s">"neural"</span>,
    LanguageCode=<span class="s">"${lang}"</span>
)

<span class="k">with</span> open(<span class="s">"output.mp3"</span>, <span class="s">"wb"</span>) as f:
    f.write(resp[<span class="s">"AudioStream"</span>].read())`;
}

let pollyCanvasRaf = null;
function pollyAnimateCanvas() {
  const canvas = document.getElementById('polly-canvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;

  function render() {
    ctx.fillStyle = '#1A0F0A';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const t = performance.now() / 1000;
    for (let i = 0; i < w; i++) {
      const noise = (Math.sin(i * 0.05 + t * 4) + Math.sin(i * 0.13 + t * 2.3) + Math.sin(i * 0.21 - t * 5)) * 0.3;
      const y = h / 2 + noise * h * 0.4 * (0.5 + Math.random() * 0.5);
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    ctx.stroke();
    pollyCanvasRaf = requestAnimationFrame(render);
  }
  render();
}
function pollyStopCanvas() {
  if (pollyCanvasRaf) cancelAnimationFrame(pollyCanvasRaf);
  pollyCanvasRaf = null;
  const canvas = document.getElementById('polly-canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1A0F0A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // flat line
  ctx.strokeStyle = '#4A3528';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

document.getElementById('polly-speak').addEventListener('click', () => {
  if (!pollySynth) {
    pollySetStatus('Seu navegador não tem Web Speech API.', 'error');
    return;
  }
  pollySynth.cancel();
  let text = document.getElementById('polly-text').value;
  if (pollyCurrentTab === 'ssml') text = pollySsmlToText(text);
  const utterance = new SpeechSynthesisUtterance(text);
  const v = pollyVoices[document.getElementById('polly-voice').value];
  if (v) {
    utterance.voice = v;
    utterance.lang = v.lang;
  }
  utterance.rate = parseFloat(document.getElementById('polly-rate').value);
  utterance.pitch = parseFloat(document.getElementById('polly-pitch').value);
  utterance.volume = parseFloat(document.getElementById('polly-vol').value);
  utterance.onstart = () => {
    pollySetStatus(`🗣️ Falando · "${text.slice(0, 60)}${text.length > 60 ? '…' : ''}"`, 'speaking');
    pollyAnimateCanvas();
  };
  utterance.onend = () => {
    pollySetStatus('✅ Concluído.', 'idle');
    pollyStopCanvas();
  };
  utterance.onerror = (e) => {
    pollySetStatus('❌ Erro: ' + e.error, 'error');
    pollyStopCanvas();
  };
  pollySynth.speak(utterance);
});

document.getElementById('polly-stop').addEventListener('click', () => {
  pollySynth.cancel();
  pollySetStatus('⏹️ Parado.', 'idle');
  pollyStopCanvas();
});
document.getElementById('polly-pause').addEventListener('click', () => {
  pollySynth.pause();
  pollySetStatus('⏸️ Pausado.', 'idle');
});
document.getElementById('polly-resume').addEventListener('click', () => {
  pollySynth.resume();
  pollySetStatus('▶️ Retomado.', 'speaking');
});
document.getElementById('polly-download').addEventListener('click', () => {
  pollySetStatus('📁 (mock) num Polly real, isso baixaria o MP3 retornado pela API. O navegador não expõe o áudio sintetizado.', 'idle');
});

function pollySetStatus(msg, cls) {
  const el = document.getElementById('polly-status');
  el.className = 'polly-status ' + (cls === 'speaking' ? 'speaking' : cls === 'error' ? 'error' : '');
  document.getElementById('polly-status-msg').textContent = msg;
}

const pollyPresets = {
  announce: { text: 'Atenção, atenção! O Balaio de Gatos transmite agora a primeira hora do telejornal das gatonotícias!', rate: 1.05, pitch: 0.9 },
  story: { text: 'Era uma vez um gatinho laranja que morava num telhado de cerâmica vermelha, e tinha uma paixão secreta por aprender inteligência artificial.', rate: 0.9, pitch: 1.05 },
  bedtime: { text: 'Boa noite, pequeno aprendiz. Feche os olhos. O gato preto vai contar até dez, bem devagarzinho.', rate: 0.75, pitch: 1.1, vol: 0.7 },
  hype: { text: 'Promoção imperdível! Cinquenta por cento de desconto em todos os modelos! Só hoje! Corra agora!', rate: 1.3, pitch: 1.15 },
  poetry: { text: 'No silêncio da madrugada, o gato observa as estrelas. Aprende, sem ninguém ensinar.', rate: 0.8, pitch: 1.0 },
  multi: { text: 'Olá! Hello! Hola! Bonjour! Konnichiwa! Cada idioma tem sua voz no Polly.', rate: 1.0, pitch: 1.0 }
};

document.querySelectorAll('.polly-preset').forEach(b => {
  b.addEventListener('click', () => {
    const p = pollyPresets[b.dataset.preset];
    document.getElementById('polly-text').value = p.text;
    document.getElementById('polly-rate').value = p.rate;
    document.getElementById('polly-pitch').value = p.pitch;
    if (p.vol !== undefined) document.getElementById('polly-vol').value = p.vol;
    document.getElementById('polly-rate-v').textContent = p.rate.toFixed(1).replace('.', ',') + '×';
    document.getElementById('polly-pitch-v').textContent = p.pitch.toFixed(1).replace('.', ',');
    document.getElementById('polly-vol-v').textContent = Math.round((p.vol !== undefined ? p.vol : 1) * 100) + '%';
    pollyUpdateCode();
    document.getElementById('polly-speak').click();
  });
});

pollyUpdateCode();
pollyStopCanvas();

// ============================================================
// MÓDULO 6: STT PIPELINE
// ============================================================
const sttStageData = {
  audio: {
    title: '🎙️ Áudio bruto',
    desc: 'Sinal de áudio digitalizado: array de amplitudes ao longo do tempo (geralmente 16 kHz). É bagunçado: contém voz, ruído de fundo, silêncio.',
    render: () => `<div>Waveform raw (~3 segundos):</div>
      <svg viewBox="0 0 400 50" xmlns="http://www.w3.org/2000/svg" style="width:100%; margin-top: 10px; background: rgba(255,255,255,0.06); border-radius: 8px;">
        <polyline points="${Array.from({length: 200}, (_, i) => {
          const noise = (Math.random() - 0.5) * 2;
          const wave = Math.sin(i * 0.4) * 12 + Math.sin(i * 0.18) * 8;
          const burst = i > 50 && i < 150 ? wave * (1 + Math.random() * 0.5) : noise * 3;
          const y = 25 + burst;
          return `${i * 2},${y.toFixed(1)}`;
        }).join(' ')}" fill="none" stroke="var(--yellow)" stroke-width="1"/>
      </svg>
      <div style="margin-top: 10px; font-size: 12.5px;">Características: 16 kHz, 16-bit PCM, mono. ~32 KB/s.</div>`
  },
  spectrogram: {
    title: '🌈 Espectrograma',
    desc: 'FFT (Fast Fourier Transform) decompõe o áudio em frequências ao longo do tempo. Cada coluna é uma janelinha temporal, cada linha uma frequência.',
    render: () => `<div>Mel-spectrogram (eixo Y = frequência, X = tempo):</div>
      <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" style="width:100%; margin-top: 10px; background: rgba(255,255,255,0.06); border-radius: 8px;">
        ${Array.from({length: 80}, (_, i) => {
          return Array.from({length: 16}, (_, j) => {
            const intensity = Math.max(0, Math.sin(i * 0.2 + j * 0.3) * 0.4 + 0.4 + (i > 10 && i < 70 ? 0.2 : 0) + Math.random() * 0.15);
            return `<rect x="${i * 5}" y="${j * 5}" width="5" height="5" fill="rgb(${255 * intensity}, ${107 * intensity}, ${53 * intensity})"/>`;
          }).join('');
        }).join('')}
      </svg>
      <div style="margin-top: 10px; font-size: 12.5px;">Faixas claras = frequência presente naquele instante. Vogais geram bandas largas, consoantes geram pulsos curtos.</div>`
  },
  acoustic: {
    title: '🔡 Modelo acústico',
    desc: 'Rede neural (CNN ou Transformer) que olha o espectrograma e prevê probabilidades de fonema/letra a cada frame. Saída crua, sem gramática.',
    render: () => `<div>Hipóteses do modelo acústico (top-3 por janela):</div>
      <div style="margin-top: 10px; font-family: 'JetBrains Mono', monospace; font-size: 12px;">
        <div>frame 042: <strong style="color: var(--yellow)">"o"</strong> 0.82 · "u" 0.11 · "h" 0.04</div>
        <div>frame 043: <strong style="color: var(--yellow)">"g"</strong> 0.71 · "k" 0.18 · "_" 0.09</div>
        <div>frame 044: <strong style="color: var(--yellow)">"a"</strong> 0.88 · "ɐ" 0.08 · "_" 0.03</div>
        <div>frame 045: <strong style="color: var(--yellow)">"t"</strong> 0.79 · "d" 0.14 · "_" 0.05</div>
        <div>frame 046: <strong style="color: var(--yellow)">"u"</strong> 0.74 · "o" 0.21 · "_" 0.04</div>
      </div>
      <div style="margin-top: 12px; font-size: 12.5px;">↑ Saída ainda crua. "Gato" começa a aparecer mas precisa do modelo de linguagem pra desambiguação.</div>`
  },
  language: {
    title: '🧠 Modelo de linguagem',
    desc: 'Refina a saída acústica com conhecimento gramatical: "o gato preto" é mais provável que "o gato breto". Pode ser n-gram clássico, RNN, ou hoje em dia um pequeno LLM.',
    render: () => `<div>Antes (acústico cru):</div>
      <div style="margin-top: 6px; padding: 8px 12px; background: rgba(199, 62, 29, 0.15); border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 13px;">
        "o gattu preto pulow no terhado"
      </div>
      <div style="margin-top: 12px;">Depois (com modelo de linguagem):</div>
      <div style="margin-top: 6px; padding: 8px 12px; background: rgba(107, 142, 35, 0.18); border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 13px;">
        "o gato preto pulou no telhado"
      </div>
      <div style="margin-top: 14px; font-size: 12.5px;">↑ Modelo de linguagem corrige erros consistentes do acústico, escolhe palavras prováveis no contexto, formata. <strong>Custom Vocabulary</strong> entra aqui pra forçar boost em termos do seu domínio.</div>`
  },
  text: {
    title: '📝 Texto final',
    desc: 'Saída pronta. Pode ser stream incremental (palavra a palavra) ou batch completo. Inclui timestamps por palavra, score de confiança, e (se ativado) speaker labels.',
    render: () => `<div>JSON estruturado:</div>
      <pre style="margin-top: 10px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.55; color: var(--cream-2);">{
  <span style="color:var(--yellow)">"transcript"</span>: <span style="color:#C7E5C0">"O gato preto pulou no telhado"</span>,
  <span style="color:var(--yellow)">"items"</span>: [
    { <span style="color:var(--yellow)">"start"</span>: 0.12, <span style="color:var(--yellow)">"end"</span>: 0.18, <span style="color:var(--yellow)">"alt"</span>: <span style="color:#C7E5C0">"O"</span>,       <span style="color:var(--yellow)">"conf"</span>: 0.99 },
    { <span style="color:var(--yellow)">"start"</span>: 0.18, <span style="color:var(--yellow)">"end"</span>: 0.42, <span style="color:var(--yellow)">"alt"</span>: <span style="color:#C7E5C0">"gato"</span>,    <span style="color:var(--yellow)">"conf"</span>: 0.97 },
    { <span style="color:var(--yellow)">"start"</span>: 0.42, <span style="color:var(--yellow)">"end"</span>: 0.65, <span style="color:var(--yellow)">"alt"</span>: <span style="color:#C7E5C0">"preto"</span>,   <span style="color:var(--yellow)">"conf"</span>: 0.94 }
  ],
  <span style="color:var(--yellow)">"speaker"</span>: <span style="color:#C7E5C0">"spk_0"</span>
}</pre>`
  }
};

document.querySelectorAll('.stt-stage').forEach(s => {
  s.addEventListener('click', () => {
    document.querySelectorAll('.stt-stage').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    const d = sttStageData[s.dataset.stt];
    document.getElementById('stt-detail-head').textContent = d.title;
    document.getElementById('stt-detail-desc').innerHTML = d.desc;
    document.getElementById('stt-detail-result').innerHTML = d.render();
  });
});
document.querySelector('.stt-stage.active').click();

// ============================================================
// MÓDULO 7: AMAZON TRANSCRIBE (Web Speech Recognition)
// ============================================================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let transRec = null;
let transRunning = false;
let transStartTime = null;
let transTimer = null;
let transFinalText = '';
let transInterimText = '';
let transAudioCtx = null;
let transAnalyser = null;
let transStream = null;
let transAnimRaf = null;
let transConfSum = 0;
let transConfCount = 0;

function transUpdateCode() {
  const lang = document.getElementById('trans-lang').value;
  const interim = document.getElementById('trans-interim').checked;
  const continuous = document.getElementById('trans-continuous').checked;
  const vocab = document.getElementById('trans-vocab').checked;
  document.getElementById('trans-code').innerHTML = `<span class="c"># Equivalente em Transcribe streaming</span>
<span class="k">import</span> boto3
<span class="k">from</span> amazon_transcribe.client <span class="k">import</span> TranscribeStreamingClient

client = TranscribeStreamingClient(region=<span class="s">"us-east-1"</span>)

stream = await client.start_stream_transcription(
    language_code=<span class="s">"${lang}"</span>,
    media_sample_rate_hz=<span class="n">16000</span>,
    media_encoding=<span class="s">"pcm"</span>,
    enable_partial_results_stabilization=<span class="k">${interim ? 'True' : 'False'}</span>,
    show_speaker_label=<span class="k">${continuous ? 'True' : 'False'}</span>${vocab ? `,
    vocabulary_name=<span class="s">"medical-terms-v1"</span>` : ''}
)

<span class="c"># Envia chunks de áudio em loop:</span>
<span class="k">async for</span> chunk <span class="k">in</span> microphone:
    <span class="k">await</span> stream.input_stream.send_audio_event(audio_chunk=chunk)

<span class="c"># Recebe eventos com transcrição parcial e final</span>`;
}

['trans-lang', 'trans-interim', 'trans-continuous', 'trans-vocab'].forEach(id => {
  document.getElementById(id).addEventListener('change', transUpdateCode);
});
transUpdateCode();

function transSetupRecognition() {
  if (!SpeechRecognition) {
    document.getElementById('trans-status').textContent = '❌ Seu navegador não tem Web Speech Recognition. Tenta Chrome, Edge ou Safari.';
    document.getElementById('trans-rec-btn').disabled = true;
    return false;
  }
  transRec = new SpeechRecognition();
  transRec.continuous = document.getElementById('trans-continuous').checked;
  transRec.interimResults = document.getElementById('trans-interim').checked;
  transRec.lang = document.getElementById('trans-lang').value;

  transRec.onstart = () => {
    transRunning = true;
    transStartTime = Date.now();
    document.getElementById('trans-rec-btn').classList.add('recording');
    document.getElementById('trans-rec-lbl').textContent = '⏹️ Parar gravação';
    document.getElementById('trans-status').textContent = '🔴 Gravando · fala alguma coisa…';
    transStartTimer();
    transStartMeter();
  };

  transRec.onend = () => {
    transRunning = false;
    document.getElementById('trans-rec-btn').classList.remove('recording');
    document.getElementById('trans-rec-lbl').textContent = '🎙️ Iniciar gravação';
    document.getElementById('trans-status').textContent = '✅ Gravação encerrada.';
    transStopTimer();
    transStopMeter();
  };

  transRec.onerror = (e) => {
    transRunning = false;
    document.getElementById('trans-rec-btn').classList.remove('recording');
    document.getElementById('trans-rec-lbl').textContent = '🎙️ Iniciar gravação';
    let msg = '❌ Erro: ' + e.error;
    if (e.error === 'not-allowed') msg = '❌ Permissão de microfone negada. Libera nas configurações do navegador.';
    if (e.error === 'no-speech') msg = '🤔 Nenhuma fala detectada.';
    document.getElementById('trans-status').textContent = msg;
    transStopTimer();
    transStopMeter();
  };

  transRec.onresult = (event) => {
    transInterimText = '';
    let confs = [];
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i];
      if (r.isFinal) {
        transFinalText += r[0].transcript + ' ';
        if (r[0].confidence) {
          transConfSum += r[0].confidence;
          transConfCount++;
        }
      } else {
        transInterimText += r[0].transcript;
      }
    }
    transRender();
  };
  return true;
}

function transRender() {
  const cont = document.getElementById('trans-transcript');
  if (transFinalText === '' && transInterimText === '') {
    cont.innerHTML = '<div class="trans-placeholder">A transcrição vai aparecer aqui conforme você fala. Linhas em <em>itálico cinza</em> são resultados parciais; em preto sólido são finais.</div>';
  } else {
    cont.innerHTML = `<span class="trans-final">${transFinalText}</span><span class="trans-interim">${transInterimText}</span>`;
  }
  cont.scrollTop = cont.scrollHeight;
  // stats
  const fullText = transFinalText + transInterimText;
  const words = fullText.trim().split(/\s+/).filter(w => w).length;
  document.getElementById('trans-stat-words').textContent = words;
  document.getElementById('trans-stat-chars').textContent = fullText.length;
  if (transConfCount > 0) {
    document.getElementById('trans-stat-conf').textContent = (transConfSum / transConfCount * 100).toFixed(0) + '%';
  }
}

function transStartTimer() {
  transTimer = setInterval(() => {
    if (!transStartTime) return;
    const elapsed = Math.floor((Date.now() - transStartTime) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    document.getElementById('trans-stat-time').textContent = `${m}:${s}`;
  }, 500);
}
function transStopTimer() {
  if (transTimer) clearInterval(transTimer);
  transTimer = null;
}

async function transStartMeter() {
  try {
    transStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    transAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = transAudioCtx.createMediaStreamSource(transStream);
    transAnalyser = transAudioCtx.createAnalyser();
    transAnalyser.fftSize = 256;
    source.connect(transAnalyser);
    const data = new Uint8Array(transAnalyser.frequencyBinCount);
    const bars = document.getElementById('trans-meter-bars').querySelectorAll('span');
    function update() {
      transAnalyser.getByteFrequencyData(data);
      const slice = Math.floor(data.length / bars.length);
      for (let i = 0; i < bars.length; i++) {
        let sum = 0;
        for (let j = 0; j < slice; j++) sum += data[i * slice + j];
        const avg = sum / slice;
        const h = Math.max(6, Math.min(28, (avg / 255) * 30));
        bars[i].style.height = h + 'px';
      }
      transAnimRaf = requestAnimationFrame(update);
    }
    update();
  } catch (e) {
    console.warn('Audio meter unavailable:', e);
  }
}

function transStopMeter() {
  if (transAnimRaf) cancelAnimationFrame(transAnimRaf);
  transAnimRaf = null;
  if (transAudioCtx) {
    transAudioCtx.close();
    transAudioCtx = null;
  }
  if (transStream) {
    transStream.getTracks().forEach(t => t.stop());
    transStream = null;
  }
  document.getElementById('trans-meter-bars').querySelectorAll('span').forEach(s => s.style.height = '6px');
}

document.getElementById('trans-rec-btn').addEventListener('click', () => {
  if (!SpeechRecognition) {
    alert('Web Speech Recognition não disponível. Tenta no Chrome, Edge ou Safari.');
    return;
  }
  if (transRunning) {
    transRec.stop();
  } else {
    if (!transRec) transSetupRecognition();
    if (transRec) {
      transRec.continuous = document.getElementById('trans-continuous').checked;
      transRec.interimResults = document.getElementById('trans-interim').checked;
      transRec.lang = document.getElementById('trans-lang').value;
      try {
        transRec.start();
      } catch (e) {
        document.getElementById('trans-status').textContent = '❌ ' + e.message;
      }
    }
  }
});

document.getElementById('trans-clear').addEventListener('click', () => {
  transFinalText = '';
  transInterimText = '';
  transConfSum = 0;
  transConfCount = 0;
  document.getElementById('trans-stat-words').textContent = 0;
  document.getElementById('trans-stat-chars').textContent = 0;
  document.getElementById('trans-stat-conf').textContent = '···';
  document.getElementById('trans-stat-time').textContent = '00:00';
  document.getElementById('trans-analysis').style.display = 'none';
  transRender();
});

document.getElementById('trans-copy').addEventListener('click', () => {
  const text = (transFinalText + transInterimText).trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('trans-status').textContent = '📋 Copiado pra clipboard!';
  });
});

document.getElementById('trans-analyze').addEventListener('click', () => {
  const text = transFinalText.trim();
  const out = document.getElementById('trans-analysis');
  if (!text) {
    out.style.display = 'block';
    out.innerHTML = '<p style="font-style:italic; color: var(--ink-soft);">Grava algo primeiro pra analisar.</p>';
    return;
  }
  out.style.display = 'block';
  // run light analysis using Comprehend functions defined above
  const lang = cmpDetectLanguage(text);
  const sent = cmpDetectSentiment(text);
  const ents = cmpExtractEntities(text);
  const phrases = cmpExtractKeyPhrases(text);
  const winnerSent = Object.entries(sent).sort((a, b) => b[1] - a[1])[0][0];
  let html = '<h6>📖 Análise Comprehend (mock)</h6>';
  html += `<div class="row"><span>🌎 Idioma</span><strong>${lang.name} (${(lang.conf * 100).toFixed(0)}%)</strong></div>`;
  html += `<div class="row"><span>💚 Sentimento</span><strong>${winnerSent} (${(sent[winnerSent] * 100).toFixed(0)}%)</strong></div>`;
  html += `<div class="row"><span>🔍 Entidades</span><strong>${ents.length === 0 ? '···' : ents.map(e => e.text).join(', ')}</strong></div>`;
  html += `<div class="row"><span>🔑 Frases-chave</span><strong>${phrases.length === 0 ? '···' : phrases.map(p => p[0]).join(' · ')}</strong></div>`;
  out.innerHTML = html;
});

document.getElementById('trans-tts').addEventListener('click', () => {
  const text = transFinalText.trim();
  if (!text) return;
  if (!pollySynth) return;
  pollySynth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const lang = document.getElementById('trans-lang').value;
  const v = pollyVoices.find(x => x.lang === lang) || pollyVoices.find(x => x.lang.startsWith(lang.split('-')[0]));
  if (v) u.voice = v;
  u.lang = lang;
  pollySynth.speak(u);
});
