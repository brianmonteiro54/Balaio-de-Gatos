/* ===== bloco 1 ===== */

// =================== WORD VECTOR DEMO ===================
  // Each word has an 8-dim vector. Similar words have similar vectors.
  const wordVectors = {
    'gato':  { vec: [ 0.82, -0.31,  0.65,  0.12, -0.44,  0.27,  0.71, -0.18 ], cluster: 'animal' },
    'cão':   { vec: [ 0.78, -0.28,  0.61,  0.15, -0.40,  0.30,  0.69, -0.20 ], cluster: 'animal' },
    'leão':  { vec: [ 0.85, -0.35,  0.70,  0.08, -0.48,  0.25,  0.68, -0.16 ], cluster: 'animal' },
    'carro': { vec: [-0.45,  0.72, -0.31,  0.65,  0.22, -0.18, -0.55,  0.41 ], cluster: 'veiculo' },
    'moto':  { vec: [-0.42,  0.68, -0.28,  0.60,  0.18, -0.15, -0.52,  0.38 ], cluster: 'veiculo' },
    'maçã':  { vec: [ 0.12,  0.05, -0.18, -0.62,  0.71,  0.55,  0.08, -0.45 ], cluster: 'fruta' }
  };

  const wordEmojis = {
    'gato': '🐈', 'cão': '🐶', 'leão': '🦁',
    'carro': '🚗', 'moto': '🏍️', 'maçã': '🍎'
  };

  function cosine(a, b) {
    let dot = 0, mA = 0, mB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      mA += a[i] * a[i];
      mB += b[i] * b[i];
    }
    return dot / (Math.sqrt(mA) * Math.sqrt(mB));
  }

  function formatVector(vec) {
    return '[' + vec.map(n => {
      const sign = n < 0 ? 'neg' : '';
      return `<span class="num ${sign}">${n.toFixed(2)}</span>`;
    }).join(', ') + ']';
  }

  document.querySelectorAll('[data-word]').forEach(btn => {
    btn.addEventListener('click', () => {
      const w = btn.dataset.word;
      const data = wordVectors[w];
      document.getElementById('word-vector').innerHTML = `<strong>"${w}"</strong> → ` + formatVector(data.vec);

      // compute similarity to all OTHER words
      const sims = Object.keys(wordVectors)
        .filter(k => k !== w)
        .map(k => ({ word: k, sim: cosine(data.vec, wordVectors[k].vec) }))
        .sort((a, b) => b.sim - a.sim)
        .slice(0, 3);

      const html = sims.map((s, i) => `
        <div class="sim-result${i === 0 ? ' top' : ''}">
          <span class="sim-emoji">${wordEmojis[s.word]}</span>
          <span class="sim-name">${s.word}</span>
          <span class="sim-score">${s.sim.toFixed(3)}</span>
        </div>
      `).join('');
      document.getElementById('similar-words').innerHTML = html;

      // Highlight the active chip
      document.querySelectorAll('[data-word]').forEach(b => b.style.background = '');
      btn.style.background = 'var(--orange)';
      btn.style.color = 'var(--paper)';
      setTimeout(() => {
        btn.style.background = '';
        btn.style.color = '';
      }, 1200);
    });
  });

  // Click "gato" by default
  setTimeout(() => {
    const def = document.querySelector('[data-word="gato"]');
    if (def) def.click();
  }, 300);


  // =================== TOKENIZER ===================
  function tokenize() {
    const text = document.getElementById('tok-input').value.trim();
    const stage = document.getElementById('tok-output');
    const counter = document.getElementById('tok-count');

    if (!text) {
      stage.innerHTML = '<span class="empty">Digite algo acima pra ver os tokens...</span>';
      counter.textContent = '0';
      return;
    }
    // simple split by spaces and punctuation
    const tokens = text.toLowerCase().split(/[\s,;:!?.()"]+/).filter(t => t.length);
    counter.textContent = tokens.length;
    const colors = ['token-1', 'token-2', 'token-3', 'token-4', 'token-5'];
    stage.innerHTML = tokens.map((t, i) => `<span class="chip ${colors[i % colors.length]}">${t}</span>`).join('');
  }
  document.getElementById('tok-input').addEventListener('input', tokenize);
  tokenize();


  // =================== BAG OF WORDS ===================
  function updateBoW() {
    const text = document.getElementById('bow-input').value.toLowerCase();
    const tokens = text.split(/[\s,;:!?.()"]+/).filter(t => t.length);

    const counts = {};
    tokens.forEach(t => {
      counts[t] = (counts[t] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = sorted.length ? sorted[0][1] : 1;
    const tbody = document.querySelector('#bow-table tbody');

    if (!sorted.length) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color: var(--ink-soft); font-style: italic;">vazio</td></tr>';
      return;
    }

    tbody.innerHTML = sorted.map(([word, count]) => `
      <tr>
        <td>${word}</td>
        <td class="count">${count}</td>
        <td><div class="bow-bar"><div style="width: ${(count / max) * 100}%"></div></div></td>
      </tr>
    `).join('');
  }
  document.getElementById('bow-input').addEventListener('input', updateBoW);
  updateBoW();


  // =================== CONTEXT WINDOW ===================
  const sampleTokens = [
    "Os", "gatos", "são", "animais", "domésticos", "que",
    "dormem", "muito", "durante", "o", "dia", "e", "adoram",
    "brincar", "com", "novelos", "de", "lã", "à", "noite"
  ];
  function updateCtx() {
    const size = parseInt(document.getElementById('ctx-slider').value, 10);
    document.getElementById('ctx-size').textContent = size + ' tokens';
    const display = document.getElementById('ctx-display');
    display.innerHTML = sampleTokens.map((t, i) => {
      const inside = i < size;
      return `<span class="ctx-token ${inside ? 'inside' : 'outside'}">${t}</span>`;
    }).join('');
  }
  document.getElementById('ctx-slider').addEventListener('input', updateCtx);
  updateCtx();


  // =================== LEARN CARDS (click to highlight) ===================
  document.querySelectorAll('.learn-card').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'translate(-3px, -3px) scale(1.02)';
      setTimeout(() => {
        card.style.transform = '';
      }, 300);
    });
  });