#!/usr/bin/env python3
"""
Gera sitemap.xml com lastmod (último commit) e extensão sitemap-image
incluindo title/caption específicos por aula. Cada URL aponta para a
imagem OG própria em assets/og/<slug>.png.
"""
from __future__ import annotations

import subprocess
from html import escape
from pathlib import Path

BASE = "https://brianmonteiro54.github.io/Balaio-de-Gatos"


def og_image(slug: str) -> str:
    return f"{BASE}/assets/og/{slug}.png"


# (file_path, url_path, priority, og_slug, image_title, image_caption)
PAGES: list[tuple[str, str, str, str, str, str]] = [
    ("index.html", f"{BASE}/", "1.0", "home",
     "Balaio de Gatos · landing",
     "Hub de aulas visuais e interativas de IA Practitioner pra Escola da Nuvem."),
    ("aula1/index.html", f"{BASE}/aula1/", "0.9", "aula1",
     "Aula 1 · IA, ML, Deep Learning e LLMs",
     "Aula 1: hierarquia IA → ML → DL → IA Generativa, neurônio artificial e simulador de Next-Token."),
    ("aula2/index.html", f"{BASE}/aula2/", "0.9", "aula2",
     "Aula 2 · Embeddings e Aprendizado",
     "Aula 2: tokenização, embeddings, supervisionado, não-supervisionado e reforço com laboratórios visuais."),
    ("aula3/index.html", f"{BASE}/aula3/", "0.9", "aula3",
     "Aula 3 · Técnicas Clássicas de ML",
     "Aula 3: regressão linear, árvores de decisão, K-NN, XGBoost e clustering K-means com simuladores interativos."),
    ("aula4/index.html", f"{BASE}/aula4/", "0.9", "aula4",
     "Aula 4 · Métricas de Classificação",
     "Aula 4: matriz de confusão, accuracy, precision, recall, F1, ROC e AUC com sliders e matrizes clicáveis."),
    ("aula5/index.html", f"{BASE}/aula5/", "0.9", "aula5",
     "Aula 5 · Métricas de Regressão e AWS",
     "Aula 5: MSE, RMSE, R², Partial Dependence Plots, Trainium e Inferentia da AWS."),
    ("aula6/index.html", f"{BASE}/aula6/", "0.9", "aula6",
     "Aula 6 · Prompt, Agents e Alucinação",
     "Aula 6: engenharia de prompt, prompt chaining, agents, alucinação, GANs e NLP em laboratórios práticos."),
    ("aula7/index.html", f"{BASE}/aula7/", "0.9", "aula7",
     "Aula 7 · Computer Vision e NLP",
     "Aula 7: Computer Vision e NLP na AWS com Rekognition, Textract, Comprehend e Translate."),
    ("aula8/index.html", f"{BASE}/aula8/", "0.9", "aula8",
     "Aula 8 · Voz com Polly, Transcribe e Lex",
     "Aula 8: text-to-speech, speech-to-text, SSML e NLU com Polly, Transcribe e Lex da AWS."),
    ("aula9/index.html", f"{BASE}/aula9/", "0.9", "aula9",
     "Aula 9 · Canivete suíço de IA da AWS",
     "Aula 9: Bedrock, SageMaker, Personalize, Forecast e Translate em laboratórios práticos."),
    ("aula10/index.html", f"{BASE}/aula10/", "0.9", "aula10",
     "Aula 10 · RAG, OpenSearch e Difusão",
     "Aula 10: caixa de ferramentas com OpenSearch, RAG, chunking, Knowledge Bases e modelos de difusão."),
    ("aula11/index.html", f"{BASE}/aula11/", "0.9", "aula11",
     "Aula 11 · Dados e Ciclo de Vida do ML",
     "Aula 11: coleta, limpeza, EDA, feature engineering e ciclo de vida de ML com AWS Kendra e Glue."),
    ("aula12/index.html", f"{BASE}/aula12/", "0.9", "aula12",
     "Aula 12 · Treino e Hiperparâmetros",
     "Aula 12: pré-processamento, feature engineering, SageMaker Feature Store, fine-tuning e hiperparâmetros."),
    ("aula13/index.html", f"{BASE}/aula13/", "0.9", "aula13",
     "Aula 13 · Otimização, Avaliação e Deploy",
     "Aula 13: SageMaker AMT, Autopilot, BLEU, BERTScore, ROUGE, MLOps e DeepAR."),
    ("aula14/index.html", f"{BASE}/aula14/", "0.9", "aula14",
     "Aula 14 · Bedrock e Dívida Técnica",
     "Aula 14: Amazon Bedrock, Playground, sob-demanda vs provisionada e dívida técnica em GenAI."),
    ("aula15/index.html", f"{BASE}/aula15/", "0.9", "aula15",
     "Aula 15 · IA Responsável",
     "Aula 15: viés, fairness, explicabilidade, governança, LGPD, SageMaker Clarify e Model Monitor."),
    ("aula16/index.html", f"{BASE}/aula16/", "0.9", "aula16",
     "Aula 16 · A2I e Segurança em IA",
     "Aula 16: Augmented AI, explicabilidade, moderação de conteúdo e segurança em IA."),
    ("aula17/index.html", f"{BASE}/aula17/", "0.9", "aula17",
     "Aula 17 · Privacidade em IA",
     "Aula 17: safety vs security, privacidade, ataques comuns em IA e mitigação."),
    ("aula19/index.html", f"{BASE}/aula19/", "0.9", "aula19",
     "Aula 19 · Revisão Geral",
     "Aula 19: revisão geral pra AWS AI Practitioner com IA, ML, GenAI, prompts e RAG."),
    ("aula20/index.html", f"{BASE}/aula20/", "0.9", "aula20",
     "Aula 20 · Embeddings, Métricas e Inferência",
     "Aula 20: embeddings, métricas, inferência e serviços AWS pra AI Practitioner."),
    ("aula21/index.html", f"{BASE}/aula21/", "0.9", "aula21",
     "Aula 21 · Serviços AWS e Pipeline ML",
     "Aula 21: serviços de IA da AWS, pipeline de ML, segurança e IA responsável."),
    ("aula22/index.html", f"{BASE}/aula22/", "0.9", "aula22",
     "Aula 22 · Logging, Model Cards e RAG vs FT",
     "Aula 22: logging, model cards, fine-tuning, hiperparâmetros e Prompt vs RAG vs Fine-Tuning."),
    ("mapa/index.html", f"{BASE}/mapa/", "0.7", "mapa",
     "Mapa de Estudos · AI Practitioner",
     "Mapa de tópicos da prova AWS AI Practitioner (AIF-C01) com banco de questões."),
    ("game/index.html", f"{BASE}/game/", "0.6", "game",
     "Game · Jogo de incidente",
     "Minigame interativo do Balaio de Gatos."),
]


def last_commit_date(path: str) -> str:
    """Retorna ISO 8601 do último commit que tocou o arquivo."""
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%cI", "--", path],
            capture_output=True, text=True, check=True,
        )
        return result.stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return ""


def build_sitemap() -> str:
    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ]

    for file_path, url, priority, og_slug, img_title, img_caption in PAGES:
        if not Path(file_path).exists():
            print(f"[SKIP] {file_path} não existe")
            continue

        lastmod = last_commit_date(file_path)
        changefreq = "weekly" if priority == "1.0" else "monthly"
        img_url = og_image(og_slug)

        parts.append("  <url>")
        parts.append(f"    <loc>{escape(url)}</loc>")
        if lastmod:
            parts.append(f"    <lastmod>{lastmod}</lastmod>")
        parts.append(f"    <changefreq>{changefreq}</changefreq>")
        parts.append(f"    <priority>{priority}</priority>")
        parts.append("    <image:image>")
        parts.append(f"      <image:loc>{escape(img_url)}</image:loc>")
        parts.append(f"      <image:title>{escape(img_title)}</image:title>")
        parts.append(f"      <image:caption>{escape(img_caption)}</image:caption>")
        parts.append("    </image:image>")
        parts.append("  </url>")

    parts.append("</urlset>")
    return "\n".join(parts) + "\n"


def main() -> None:
    sitemap = build_sitemap()
    Path("sitemap.xml").write_text(sitemap, encoding="utf-8")
    print(f"sitemap.xml regenerado com {len(PAGES)} URLs.")


if __name__ == "__main__":
    main()
