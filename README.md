<div align="center">

<img src="favicon.png" width="120" alt="Balaio de Gatos">

# 🐈 Balaio de Gatos

**Aulas visuais e interativas de IA pra [Escola da Nuvem](https://escoladanuvem.org).**
*Aprende mexendo, não decorando.*

[![21 aulas](https://img.shields.io/badge/aulas-21-FF6B35?style=flat-square&labelColor=2B1810)](#-as-aulas)
[![1 jogo](https://img.shields.io/badge/jogo-on--call_simulator-39D353?style=flat-square&labelColor=2B1810)](#-jogo--on-call-simulator)
[![1 mapa](https://img.shields.io/badge/mapa-AIF--C01-5B3F87?style=flat-square&labelColor=2B1810)](#-mapa-de-estudos--aif-c01)
[![Zero dependências](https://img.shields.io/badge/dependências-0-2B1810?style=flat-square)](#%EF%B8%8F-stack)

</div>

---

## 🎯 O que é isso

Um conjunto de aulas-zine sobre Inteligência Artificial e Machine Learning, cada uma como uma página HTML única e interativa. Tudo em **HTML/CSS/JS puro**, zero dependências, com um detector de gatos como fio condutor de todos os exemplos.

Você arrasta sliders, clica em matrizes de confusão, vê a curva ROC se mexer ao vivo conforme você muda o threshold. Os conceitos abstratos viram concretos.

> 🌐 **Página inicial com todas as aulas:** abre o `index.html` na raiz.

---

## 📚 As aulas

A numeração pula da 17 pra 19 porque a 18 nunca existiu — herança da numeração antiga. As aulas **19, 20, 21 e 22** são revisões interativas pros 5 domínios da prova AIF-C01.

| # | Tema | Categoria | Tópicos principais |
|---|------|-----------|--------------------|
| **[01](aula1/)** | O que é IA de verdade (e o que não é)? | Fundamentos | IA · ML · Deep Learning · LLM/SLM · neurônio artificial · treino vs. inferência |
| **[02](aula2/)** | Como transformar um gato em um monte de números? | Dados | Tokenização · embeddings · tipos de dados · supervisionado/não-supervisionado/reforço |
| **[03](aula3/)** | As técnicas clássicas de Machine Learning | Algoritmos | Regressão · árvores de decisão · classificação · K-NN |
| **[04](aula4/)** | Métricas de classificação | Métricas · Pt. 1 | Matriz de confusão · acurácia · precisão · recall · F1 · ROC · AUC · slider de threshold ao vivo · calculadora de ROI |
| **[05](aula5/)** | Métricas de regressão + AWS | Métricas · Pt. 2 | MSE · RMSE · R² · PDPs · serviços de ML da AWS |
| **[06](aula6/)** | Engenharia de prompt, agents e quando a IA inventa | IA Generativa | Prompts · prompt chaining · agents · alucinação · GANs · NLP |
| **[07](aula7/)** | O gato vê e o gato lê: GAN, Rekognition, NLP e sentimento | Visão & Linguagem | Sub-campos de IA · Visão Computacional (classificação, detecção, segmentação, OCR) · GAN com galeria progressiva · Amazon Rekognition + Custom Labels (wizard de 5 etapas) · distribuição de credenciais AWS · NLP pipeline · análise de sentimento ao vivo |
| **[08](aula8/)** | O gato fala, escuta e entende: Comprehend, Polly e Transcribe | Voz & Linguagem | Amazon Comprehend · Comprehend Medical · AWS HealthScribe simulado · pipeline TTS · **Polly real** via `speechSynthesis` · pipeline STT · **Transcribe real** via Web Speech Recognition |
| **[09](aula9/)** | Os 7 serviços que os gatos mais usam: Textract, Translate, Personalize e cia | Catálogo AWS de IA | Textract com bounding boxes em 5 docs · Translate com 16 idiomas via LLM real · Personalize (3 recipes) · Fraud Detector (score 0-1000) · Q Developer · Q QuickSight · Lex com NLU LLM real · Titan playground · Nova com Pollinations real (texto + imagem) · OpenSearch |
| **[10](aula10/)** | A caixa de ferramentas do IA Practitioner | Toolbox AWS | Vector DB · modelos de difusão · temperatura · RAG · chunking · Knowledge Bases |
| **[11](aula11/)** | Antes do modelo, tem o dado: Kendra, EDA e ciclo de vida ML | Dados & Ciclo ML | Amazon Kendra como console real (NLU + Answer extraction via LLM, semantic kNN, BM25, **comparar lado a lado**) · 4 boosts ajustáveis · FAQ matching · 15 docs corporativos · coleta de dados (gerador de arquitetura AWS) · ciclo ML (4 fases) · pipeline (7 etapas) · EDA brincável (histograma, scatter, correlação, missing, outliers) |
| **[12](aula12/)** | Como o gato aprende: features, treino e hiperparâmetros | Treinamento | Limpeza de dados · feature stores · augmentation · fine-tuning · hiperparâmetros · overfitting |
| **[13](aula13/)** | Tunar, medir e deployar: do modelo treinado ao modelo em produção | Otimização & Deploy | SageMaker AMT · Autopilot · domain adaptation · PCA/t-SNE · BLEU · BERTScore · ROUGE · Endpoints · MLOps · DeepAR · Experiments · monitoramento |
| **[14](aula14/)** | Bedrock, Playground e dívida técnica | Bedrock & Custos | Amazon Bedrock · Playground · capacidade Sob-Demanda vs Provisionada · Model Units · dívida técnica em GenAI · simulador de fatura · decisor visual |
| **[15](aula15/)** | Ética, viés e governança | IA Responsável | Características · viés · explicabilidade · bias-variance · human-in-the-loop · SageMaker |
| **[16](aula16/)** | A2I, explicabilidade, moderação e dados seguros | Confiança & Segurança | Amazon A2I · SHAP/LIME · SageMaker Clarify · AWS AI Service Cards · trade-off interpretabilidade × performance · APIs de moderação (Guardrails, Comprehend, Rekognition, Transcribe) · GenAI Security Scoping Matrix · linhagem · engenharia de dados segura |
| **[17](aula17/)** | Segurança e privacidade em IA — atacar pra defender | Segurança & Privacidade | Safety × Security · prompt injection · jailbreak · adversarial prompting · vazamento · Bedrock Guardrails (6 categorias) · PII (Macie, Comprehend, Guardrails) · residência de dados (LGPD/GDPR/HIPAA) · ciclo de vida e retenção · defesa em profundidade · 8 pilares de governança · Model Cards · logging de invocação · custom service role · network isolation · live event stream |
| **[19](aula19/)** | Revisão geral interativa: D1 + D2 + D3 num só lugar | 📚 Revisão · D1+D2+D3 | IA × ML × DL × GenAI · supervisionado/não-sup/reforço · classificação/regressão/clustering · over/underfitting · LLM × SLM · tokenização · janela de contexto · temperature/top-k/max · alucinação · zero/one/few-shot · Chain-of-Thought · prompt chaining vs ReAct · boas práticas · RAG · pipeline · chunking |
| **[20](aula20/)** | Embeddings, métricas, inferência e AWS | 📚 Revisão · D4+D5 | RAG × Fine-tuning · embeddings · similaridade vetorial · vector DBs · quando usar embeddings · matriz de confusão · acurácia/precisão/recall/F1 · threshold · MAE/MSE/RMSE/R² · métricas de negócio · batch × real-time · serverless × endpoint · async · API × auto-hospedada · SageMaker (visão geral) · Bedrock (visão geral) |
| **[21](aula21/)** | Serviços de IA, pipeline ML, segurança e IA responsável | 📚 Revisão · Serviços + Pipeline | Rekognition · Comprehend · Lex · Transcribe · Translate · Personalize · Fraud Detector · pipeline de ML (8 etapas) · EDA e pré-processamento · feature engineering · Feature Store (online/offline) · PII detector · prompt injection · jailbreak · Safety × Security · Bedrock Guardrails · residência de dados (LGPD/GDPR/HIPAA) · viés · explicabilidade (SHAP) · human-in-the-loop · trade-off performance × interpretabilidade · monitoramento e data drift · retreinamento |
| **[22](aula22/)** | Logging, Model Cards, Fine-tuning, Hiperparâmetros e Prompt × RAG × FT | 📚 Revisão · Operação + Customização | Logging de inferência (CloudTrail · CloudWatch · Data Capture · Model Monitor · Bedrock Invocation Logging · Guardrails Trace) · SageMaker Model Cards · ajuste fino (Full · PEFT/LoRA · Instruction Tuning · RLHF) · pipeline de FT (7 etapas) · hiperparâmetros (LR · batch · epochs · dropout) · AMT (Random · Grid · Bayesian · Hyperband) · Prompt Engineering × RAG × Fine-tuning (árvore de decisão) |

---

## 🎮 Jogo · On-Call Simulator

> **[`game/`](game/)** · *AI Incident · On-Call Simulator*

3:17h da manhã. A produção tá pegando fogo. Bedrock alucinando, custo subindo $400/min, cliente reclamando no Twitter. Em vez de decorar flashcard, você apaga incêndio.

- 🔥 **19 missões** de incidentes reais em prod (Bedrock · Guardrails · Comprehend · Rekognition · RAG · Clarify · Transcribe · Polly · Lex)
- ⚡ **XP** com progressão Junior → Pleno → Sênior → Tech Lead → Staff → Principal
- 🏆 **Leaderboard** global salvo em `localStorage`
- 🎯 **Desafio diário** com 2× XP
- 🏅 **12 conquistas** desbloqueáveis

Cada missão tem dashboards ao vivo, logs de terminal e decisões. Cada decisão te ensina um pedaço da AWS porque você *viu* a coisa quebrar.

---

## 📍 Mapa de Estudos · AIF-C01

> **[`mapa/`](mapa/)** · *O que cai mesmo na prova AWS AI Practitioner*

Painel interativo do exam guide oficial:

- **5 domínios** com pesos oficiais
- **85 questões** · **90 min** de prova · **$100** de inscrição
- Top tópicos por peso, palavras-chave que acionam cada serviço
- Decisões críticas que sempre caem (Sob-Demanda × Provisionada · RAG × Fine-tuning · Real-time × Batch)
- Roteiro sugerido de estudo por dia
- Aba **🎯 Treino** com simulado em [`mapa/v2.html`](mapa/v2.html)

---

## ✨ Por que esse formato funciona

- 🖱️ **Interativo de verdade**: sliders, matrizes clicáveis, gráficos que respondem ao mouse. Não é vídeo, não é PDF, é manipulação direta
- 📦 **Zero dependências**: só HTML, CSS e JS puros. Abre direto no navegador, funciona offline, hospeda em qualquer lugar (GitHub Pages, S3, Netlify...)
- 🌐 **APIs reais quando faz sentido**: Polly e Transcribe usam Web Speech do navegador; Translate, Lex, Kendra (answer extraction) e Nova usam [Pollinations API](https://pollinations.ai) gratuita. APIs AWS que exigem credencial são simuladas com fidelidade visual.
- 🐈 **Tudo com gato**: um detector de gatos é o fio condutor. Conceito abstrato vira concreto na hora
- 🎨 **Identidade visual consistente**: mesma paleta neobrutalist (cream, orange, sage, yellow, purple, coral), mesmas fontes (Caprasimo + Sora + JetBrains Mono), mesmo "feel" zine em todas as aulas
- 📱 **Responsivo de verdade**: 4 breakpoints (1024px, 900px, 600px, 380px) ajustam grid, fontes, navegação, hero stats e cards especiais. No mobile o nav vira scroll horizontal em vez de sumir
- ☁️ **Foco em AWS**: alinhado com a trilha de IA Practitioner (AIF-C01) da Escola da Nuvem

---

## 🗂️ Estrutura

```
balaio-de-gatos/
├── index.html         # Landing com cards de todas as aulas, em ordem crescente
├── style.css          # Estilos compartilhados da landing
├── favicon.png        # Identidade visual
├── cat-thumbnail.png  # Capa Open Graph
├── README.md
│
├── aulaN/             # 21 aulas (1-17, 19-22)
│   ├── index.html     # Marcação semântica
│   ├── style.css      # Visual (paleta, layout, animações)
│   └── script.js      # Interatividade (sliders, gráficos, widgets)
│
├── game/              # AI Incident · On-Call Simulator
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── mapa/              # Mapa AIF-C01 + simulado
    ├── index.html     # Mapa de estudos
    ├── v2.html        # Simulado de prova
    ├── style.css
    ├── v2.css
    ├── script.js
    └── v2.js
```

Cada aula é uma página independente em **arquitetura modular**: HTML cuida da estrutura, CSS dos estilos e JS da interatividade. Sem dependências externas, abre direto no navegador, funciona offline e hospeda em qualquer lugar.

Algumas aulas têm uma versão alternativa (`v2.html` + `v2.css` + `v2.js`) ao lado do `index.html`.

---

## 🛠️ Stack

- **HTML5** semântico
- **CSS** puro com variáveis CSS, grid, flexbox, container queries leves, animações
- **JavaScript vanilla** (sem frameworks, sem build, sem dependências)
- **Fontes** via Google Fonts: [Caprasimo](https://fonts.google.com/specimen/Caprasimo), [Sora](https://fonts.google.com/specimen/Sora), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- **APIs externas opcionais** usadas em algumas aulas (todas free, sem key, com CORS aberto):
  - [Pollinations API](https://pollinations.ai) — texto e imagem (Translate, Lex NLU, Nova, Kendra answer extraction)
  - **Web Speech API** nativa do navegador (Polly via `speechSynthesis` · Transcribe via `webkitSpeechRecognition`)

---

## 🚀 Como rodar localmente

Abre direto no navegador:

```bash
# clone
git clone https://github.com/brianmonteiro54/Balaio-de-Gatos.git
cd Balaio-de-Gatos

# abre o index.html duplo-clique, ou serve um http simples:
python -m http.server 8000
# depois acessa http://localhost:8000
```

Não precisa de `npm install`, não tem `package.json`, não tem build step.

---

## 🤝 Contribuindo

Issues e PRs são bem-vindos, especialmente para:

- Adicionar novas métricas (Log Loss, MAPE, Quantile Loss…)
- Tradução para inglês ou espanhol
- Melhorar acessibilidade (ARIA, contraste, foco visível)
- Adaptações para outros datasets de exemplo
- Novas missões pro jogo `game/`

---

## 📄 Licença

MIT — usa, adapta, distribui. Só dá os créditos. 🐾

---

<div align="center">

Feito com 🧡 pra **[Escola da Nuvem](https://escoladanuvem.org)**  
pelo professor [Brian Richard](https://www.linkedin.com/in/brianrichard1/)

*"Os alunos aprendem mexendo, não decorando."*

</div>
