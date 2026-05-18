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
| **[15](aula15/)** | Ética, viés e governança | IA Responsável | Características · viés · explicabilidade · bias-variance · human-in-the-loop · SageMaker |

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
├── favicon.png        # Identidade visual
├── cat-thumbnail.png  # Capa Open Graph
├── README.md
└── aulaN/
    └── index.html     # Cada aula: 1 arquivo, HTML+CSS+JS inline
```

Sim, cada aula é um único arquivo. Intencional, facilita distribuição, versionamento e hospedagem em qualquer lugar.

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
