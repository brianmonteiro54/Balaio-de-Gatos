# 🐈 Balaio de Gatos  - Métricas de ML

> Uma aula visual e interativa sobre métricas de Machine Learning, feita pra [Escola da Nuvem](https://escoladanuvem.org).
> **Aprende mexendo, não decorando.**

---

## 🎯 O que é isso

Um site de página única (HTML/CSS/JS puro, zero dependências) que explica as métricas mais importantes de ML usando um detector de gatos como fio condutor. Todos os exemplos são interativos: os números mudam ao vivo conforme você mexe nos controles.

**Cobertura:**

| # | Métrica | Tipo |
|---|---------|------|
| 00 | Cenário & Dataset | — |
| 01 | Matriz de Confusão (VP, FP, FN, VN) | Classificação |
| 02 | Acurácia | Classificação |
| 03 | Precisão | Classificação |
| 04 | Recall (Sensibilidade) | Classificação |
| 05 | F1 Score | Classificação |
| 06 | Curva ROC + AUC | Classificação |
| 07 | MAE (Mean Absolute Error) | Regressão |
| 08 | Métricas de Negócio (ROI) | Negócio |

---

## ✨ Features

- **Matriz de confusão clicável**: clica em cada quadrante e lê o que significa
- **Grids de 100 fotos**: visualização imediata de acurácia, precisão e recall
- **Curva ROC com slider de threshold**: muda o limiar e vê TPR/FPR atualizarem ao vivo
- **Calculadora de negócio**: coloca seus valores de ganho/custo e vê o ROI recalculado em tempo real
- **Cola final (TL;DR)**: cheat sheet de todas as métricas

---

---

## 🗂️ Estrutura

```
balaio-de-gatos/
└── index.html      # Tudo aqui: HTML + CSS + JS inline
```

Sim, é tudo num arquivo só. Intencional, facilita distribuição e hospedagem estática em qualquer lugar.

---

## 🛠️ Stack

- HTML5 semântico
- CSS puro (variáveis, grid, animações, responsivo)
- JavaScript vanilla (sem frameworks, sem dependências)
- Fontes via Google Fonts: `Caprasimo`, `Sora`, `JetBrains Mono`

---

## 📸 Preview

| Seção | O que faz |
|-------|-----------|
| Matriz de confusão | Clica nos quadrantes para ver explicação contextual |
| Acurácia | Grid de 100 fotos coloridas mostrando acertos e erros |
| Precisão / Recall | Destaque visual do subconjunto relevante pra cada métrica |
| ROC + AUC | Curva interativa com ponto móvel via slider |
| MAE | Barras comparativas de valor real vs. previsto |
| Calculadora de ROI | Inputs editáveis que recalculam lucro e ROI instantaneamente |

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
