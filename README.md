<div align="center">

<img src="favicon.png" width="120" alt="Balaio de Gatos">

# 🐈 Balaio de Gatos

**Aulas visuais e interativas de IA pra [Escola da Nuvem](https://escoladanuvem.org).**
*Aprende mexendo, não decorando.*

</div>

---

## 🎯 O que é isso

Um conjunto de aulas-zine sobre Inteligência Artificial e Machine Learning, cada uma como uma página HTML única e interativa. Tudo em **HTML/CSS/JS puro**, zero dependências, com um detector de gatos como fio condutor de todos os exemplos.

Você arrasta sliders, clica em matrizes de confusão, vê a curva ROC se mexer ao vivo conforme você muda o threshold. Os conceitos abstratos viram concretos.

> 🌐 **Página inicial com todas as aulas:** abre o `index.html` na raiz.

---

## 📚 As aulas

| # | Tema | Categoria | Tópicos principais |
|---|------|-----------|--------------------|
| **[01](aula1/)** | O que é IA de verdade (e o que não é)? | Fundamentos | IA · ML · Deep Learning · LLM/SLM · neurônio artificial · treino vs. inferência |
| **[02](aula2/)** | Como transformar um gato em um monte de números? | Dados | Tokenização · embeddings · tipos de dados · supervisionado/não-supervisionado/reforço |
| **[03](aula3/)** | As técnicas clássicas de Machine Learning | Algoritmos | Regressão · árvores de decisão · classificação · K-NN |
| **[04](aula4/)** | Métricas de classificação | Métricas · Pt. 1 | Matriz de confusão · acurácia · precisão · recall · F1 · ROC · AUC |
| **[05](aula5/)** | Métricas de regressão + AWS | Métricas · Pt. 2 | MSE · RMSE · R² · PDPs · serviços de ML da AWS |
| **[06](aula6/)** | Engenharia de prompt, agents e quando a IA inventa | IA Generativa | Prompts · prompt chaining · agents · alucinação · GANs · NLP |
| **[10](aula10/)** | A caixa de ferramentas do IA Practitioner | Toolbox AWS | Vector DB · modelos de difusão · temperatura · RAG · chunking · Knowledge Bases |
| **[12](aula12/)** | Como o gato aprende: features, treino e hiperparâmetros | Treinamento | Limpeza de dados · feature stores · augmentation · fine-tuning · hiperparâmetros · overfitting |
| **[13](aula13/)** | Tunar, medir e deployar: do modelo treinado ao modelo em produção | Otimização & Deploy | SageMaker AMT · Autopilot · domain adaptation · PCA/t-SNE · BLEU · BERTScore · ROUGE · Endpoints · MLOps · DeepAR · Experiments · monitoramento |
| **[14](aula14/)** | Bedrock, Playground e dívida técnica | Bedrock & Custos | Amazon Bedrock · Playground · capacidade Sob-Demanda vs Provisionada · Model Units · dívida técnica em GenAI · simulador de fatura · decisor visual |
| **[15](aula15/)** | Ética, viés e governança | IA Responsável | Características · viés · explicabilidade · bias-variance · human-in-the-loop · SageMaker |
| **[16](aula16/)** | A2I, explicabilidade, moderação e dados seguros | Confiança & Segurança | Amazon A2I · SHAP/LIME · SageMaker Clarify · AWS AI Service Cards · trade-off interpretabilidade × performance · APIs de moderação (Guardrails, Comprehend, Rekognition, Transcribe) · GenAI Security Scoping Matrix · linhagem · engenharia de dados segura |
| **[17](aula17/)** | Segurança e privacidade em IA — atacar pra defender | Segurança & Privacidade | Safety × Security · prompt injection · jailbreak · adversarial prompting · vazamento · Bedrock Guardrails (6 categorias) · PII (Macie, Comprehend, Guardrails) · residência de dados (LGPD/GDPR/HIPAA) · ciclo de vida e retenção · defesa em profundidade · 8 pilares de governança · Model Cards · logging de invocação · custom service role · network isolation · live event stream |
| **[19](aula19/)** | Revisão geral interativa: D1 + D2 + D3 num só lugar | Revisão (Fundamentos+GenAI+FM Apps) | IA × ML × DL × GenAI · supervisionado/não-sup/reforço · classificação/regressão/clustering · over/underfitting · LLM × SLM · tokenização · janela de contexto · temperature/top-k/max · alucinação · zero/one/few-shot · Chain-of-Thought · prompt chaining vs ReAct · boas práticas · RAG · pipeline · chunking |
| **[20](aula20/)** | Embeddings, métricas, inferência e AWS | Revisão (D4 + D5) | RAG × Fine-tuning · embeddings · similaridade vetorial · vector DBs · quando usar embeddings · matriz de confusão · acurácia/precisão/recall/F1 · threshold · MAE/MSE/RMSE/R² · métricas de negócio · batch × real-time · serverless × endpoint · async · API × auto-hospedada · SageMaker (visão geral) · Bedrock (visão geral) |

---

## ✨ Por que esse formato funciona

- 🖱️ **Interativo de verdade**: sliders, matrizes clicáveis, gráficos que respondem ao mouse. Não é vídeo, não é PDF, é manipulação direta
- 📦 **Zero dependências**: só HTML, CSS e JS puros. Abre direto no navegador, funciona offline, hospeda em qualquer lugar (GitHub Pages, S3, Netlify...)
- 🐈 **Tudo com gato**: um detector de gatos é o fio condutor. Conceito abstrato vira concreto na hora
- 🎨 **Identidade visual consistente**: mesma paleta, mesmas fontes, mesmo "feel" zine em todas as aulas
- ☁️ **Foco em AWS**: alinhado com a trilha de IA Practitioner da Escola da Nuvem

---

---

## 🗂️ Estrutura

```
balaio-de-gatos/
├── index.html         # Landing com cards de todas as aulas
├── style.css          # Estilos da landing
├── favicon.png        # Identidade visual
├── cat-thumbnail.png  # Capa Open Graph
├── README.md
└── aulaN/
    ├── index.html     # Marcação semântica da aula
    ├── style.css      # Visual da aula (paleta, layout, animações)
    └── script.js      # Interatividade (sliders, gráficos, widgets)
```

Cada aula é uma página independente em **arquitetura modular**: o HTML cuida só da estrutura, o CSS dos estilos e o JS da interatividade. Continua sem dependências externas, abre direto no navegador, funciona offline e hospeda em qualquer lugar.

Algumas aulas têm uma versão alternativa (`v2.html` + `v2.css` + `v2.js`) ao lado do `index.html`.

---

## 🛠️ Stack

- HTML5 semântico
- CSS puro (variáveis, grid, animações, responsivo)
- JavaScript vanilla (sem frameworks, sem dependências)
- Fontes via Google Fonts: `Caprasimo`, `Sora`, `JetBrains Mono`

---


## 🤝 Contribuindo

Issues e PRs são bem-vindos, especialmente para:

- Adicionar novas métricas (RMSE, Log Loss, MAPE...)
- Tradução para inglês ou espanhol
- Melhorar acessibilidade
- Adaptações para outros datasets de exemplo

---

## 📄 Licença

MIT - usa, adapta, distribui. Só dá os créditos. 🐾

---

<div align="center">

Feito com 🧡 pra **Escola da Nuvem**  
pelo professor [Brian Richard](https://www.linkedin.com/in/brianrichard1/)

*"Os alunos que aprendam mexendo, não decorando."*

</div>
