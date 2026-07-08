// Gera 1 imagem Open Graph 1200x630 por aula renderizando um template HTML
// e tirando screenshot via Playwright. Output em assets/og/<slug>.png.
//
// Uso:
//   node scripts/generate_og_images.mjs           # gera todas
//   node scripts/generate_og_images.mjs aula7     # gera só uma

import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TEMPLATE = path.join(__dirname, "og-template.html");
const OUT_DIR = path.join(ROOT, "assets", "og");

// Catálogo: slug, número, título curto (máx ~3 linhas), subtítulo, cor de destaque
const PAGES = [
  { slug: "home",   num: "🏠", title: "Aulas visuais e interativas de IA", subtitle: "Hub completo do AWS AI Practitioner com simuladores, sliders e gráficos vivos.", color: "#FF6B35", badge: "landing" },
  { slug: "aula1",  num: "01", title: "IA, ML, Deep Learning e LLMs", subtitle: "Hierarquia, neurônio artificial, Next-Token e simulador de attention.", color: "#FF6B35", badge: "aula 01" },
  { slug: "aula2",  num: "02", title: "Embeddings, Dados e Aprendizado", subtitle: "Tokenização, embeddings, supervisionado, não-supervisionado e reforço.", color: "#5C8D89", badge: "aula 02" },
  { slug: "aula3",  num: "03", title: "Técnicas Clássicas de ML", subtitle: "Regressão, árvores, K-NN, XGBoost e clustering K-means com simuladores.", color: "#6B8E23", badge: "aula 03" },
  { slug: "aula4",  num: "04", title: "Métricas de Classificação", subtitle: "Matriz de confusão, accuracy, precision, recall, F1, ROC e AUC.", color: "#FF6B35", badge: "aula 04" },
  { slug: "aula5",  num: "05", title: "Métricas de Regressão e AWS", subtitle: "MSE, RMSE, R², PDPs, Trainium e Inferentia da AWS.", color: "#8A6FB1", badge: "aula 05" },
  { slug: "aula6",  num: "06", title: "Prompt, Agents e Alucinação", subtitle: "Engenharia de prompt, prompt chaining, agents, GANs e NLP.", color: "#FF6B35", badge: "aula 06" },
  { slug: "aula7",  num: "07", title: "Computer Vision e NLP", subtitle: "Rekognition, Textract, Comprehend e Translate na AWS.", color: "#5C8D89", badge: "aula 07" },
  { slug: "aula8",  num: "08", title: "Voz: Polly, Transcribe e Lex", subtitle: "Text-to-speech, speech-to-text, SSML e NLU.", color: "#F4D35E", badge: "aula 08" },
  { slug: "aula9",  num: "09", title: "Canivete suíço de IA da AWS", subtitle: "Bedrock, SageMaker, Personalize, Forecast e Translate.", color: "#FF6B35", badge: "aula 09" },
  { slug: "aula10", num: "10", title: "RAG, OpenSearch e Difusão", subtitle: "Vector DB, chunking, Knowledge Bases e modelos de difusão.", color: "#8A6FB1", badge: "aula 10" },
  { slug: "aula11", num: "11", title: "Dados e Ciclo de Vida do ML", subtitle: "Coleta, limpeza, EDA, feature engineering com Kendra e Glue.", color: "#5C8D89", badge: "aula 11" },
  { slug: "aula12", num: "12", title: "Treino e Hiperparâmetros", subtitle: "Pré-processamento, Feature Store, fine-tuning e overfitting.", color: "#FF6B35", badge: "aula 12" },
  { slug: "aula13", num: "13", title: "Otimização, Avaliação e Deploy", subtitle: "AMT, Autopilot, BLEU, BERTScore, ROUGE, MLOps e DeepAR.", color: "#6B8E23", badge: "aula 13" },
  { slug: "aula14", num: "14", title: "Bedrock e Dívida Técnica", subtitle: "Playground, sob-demanda vs provisionada e dívida técnica em GenAI.", color: "#FF6B35", badge: "aula 14" },
  { slug: "aula15", num: "15", title: "IA Responsável", subtitle: "Viés, fairness, explicabilidade, governança, LGPD, SageMaker Clarify.", color: "#C73E1D", badge: "aula 15" },
  { slug: "aula16", num: "16", title: "A2I e Segurança em IA", subtitle: "Augmented AI, explicabilidade, moderação e segurança.", color: "#5C8D89", badge: "aula 16" },
  { slug: "aula17", num: "17", title: "Privacidade em IA", subtitle: "Safety vs security, PII, ataques e mitigação.", color: "#C73E1D", badge: "aula 17" },
  { slug: "aula19", num: "19", title: "Revisão Geral", subtitle: "IA, ML, GenAI, prompts e RAG pra AWS AI Practitioner.", color: "#8A6FB1", badge: "aula 19" },
  { slug: "aula20", num: "20", title: "Embeddings, Métricas e Inferência", subtitle: "Embeddings, métricas, inferência e serviços AWS.", color: "#5C8D89", badge: "aula 20" },
  { slug: "aula21", num: "21", title: "Serviços AWS e Pipeline ML", subtitle: "Serviços de IA, pipeline de ML, segurança e IA responsável.", color: "#FF6B35", badge: "aula 21" },
  { slug: "aula22", num: "22", title: "Logging, Model Cards e RAG vs FT", subtitle: "Logging, model cards, fine-tuning, hiperparâmetros e Prompt vs RAG vs FT.", color: "#6B8E23", badge: "aula 22" },
  { slug: "mapa",   num: "🗺️", title: "Mapa de Estudos · AIF-C01", subtitle: "Mapa de tópicos da prova AWS AI Practitioner com banco de questões.", color: "#FF6B35", badge: "mapa" },
  { slug: "game",   num: "🎮", title: "Jogo de Incidente", subtitle: "Minigame interativo do Balaio de Gatos.", color: "#F4D35E", badge: "game" },
];

const onlySlug = process.argv[2];
const targets = onlySlug ? PAGES.filter(p => p.slug === onlySlug) : PAGES;
if (onlySlug && targets.length === 0) {
  console.error(`Slug ${onlySlug} não encontrado.`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
});
const page = await context.newPage();

const fileUrl = "file://" + TEMPLATE.replace(/\\/g, "/");
await page.goto(fileUrl, { waitUntil: "networkidle" });
// Garante fontes carregadas
await page.evaluate(() => document.fonts.ready);

for (const p of targets) {
  await page.evaluate((data) => {
    document.getElementById("badge").textContent = data.badge;
    document.getElementById("num").textContent = data.num;
    document.getElementById("title").textContent = data.title;
    document.getElementById("subtitle").textContent = data.subtitle;
    document.querySelector(".num").style.color = data.color;
  }, p);

  // Espera fontes (Google Fonts) carregarem
  await page.waitForTimeout(500);

  const out = path.join(OUT_DIR, `${p.slug}.png`);
  await page.screenshot({ path: out, type: "png", omitBackground: false });

  // WebP é gerado depois por scripts/generate_og_webp.mjs (via sharp).
  // Playwright.screenshot() só aceita type "png" ou "jpeg" — não encoda WebP.
  console.log(`✓ ${p.slug}.png`);
}

await browser.close();
console.log(`\nGerou ${targets.length} imagem(ns) em ${path.relative(ROOT, OUT_DIR)}/`);
