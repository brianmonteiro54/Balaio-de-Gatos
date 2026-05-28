/* =========================================================
   TREINO DO GATO · AI Practitioner · Balaio de Gatos
   - Quiz com filtros (domínio, erradas, marcadas)
   - Flashcards
   - Cola de referência
   - Onboarding na primeira visita
   - Atalhos de teclado
   - Progresso em localStorage
   ========================================================= */


// ═══════════════════════════════════════════════════════
// QUESTION BANK — 59 questões cenário-estilo
// Cada questão: { d:domínio, q:enunciado, opts:[...], c:idx_correta, why:explicação, aula?:"aula3" }
// ═══════════════════════════════════════════════════════
const QUESTIONS = [
  // ─── DOMÍNIO 1: Fundamentos AI/ML (12 questões) ───
  { d:1, aula:"aula3", q:"Uma empresa de varejo quer prever o VALOR EXATO de vendas do próximo trimestre com base em dados históricos. Que tipo de problema de ML é esse?",
    opts:["Classificação binária","Classificação multi-classe","Regressão","Clustering"], c:2,
    why:"Prever um valor numérico contínuo (como vendas em R$) é <strong>regressão</strong>. Classificação prediz categorias. Clustering agrupa sem rótulos." },

  { d:1, aula:"aula2", q:"Você quer agrupar clientes parecidos sem ter rótulos pré-definidos. Qual abordagem usar?",
    opts:["Aprendizado supervisionado","Aprendizado não-supervisionado","Aprendizado por reforço","Transferência de aprendizado"], c:1,
    why:"Sem rótulos + descoberta de grupos = <strong>não-supervisionado</strong> (tipicamente clustering, ex: K-means)." },

  { d:1, aula:"aula4", q:"Um modelo classifica e-mails como spam. De 100 e-mails marcados como spam pelo modelo, 90 são spam de verdade. Que métrica isso representa?",
    opts:["Recall","Precision","Acurácia","F1-score"], c:1,
    why:"<strong>Precision</strong> = TP / (TP + FP). 'Dos que eu disse que era spam, quantos eram?' Recall seria: 'de TODOS os spams existentes, quantos peguei?'." },

  { d:1, aula:"aula4", q:"Um hospital usa IA pra detectar câncer. Falsos negativos (perder um caso real) são desastrosos. Que métrica priorizar?",
    opts:["Precision","Recall","Acurácia","AUC"], c:1,
    why:"Falso negativo = câncer não detectado. <strong>Recall</strong> mede quantos casos reais foram capturados. Maximizar recall reduz falsos negativos." },

  { d:1, aula:"aula4", q:"Um modelo tem 99% de acurácia, mas o dataset tem 99% de classe A e 1% de classe B. O modelo é confiável?",
    opts:["Sim, 99% é excelente","Não, pode estar só prevendo a classe majoritária","Sim, mas precisa de mais dados","Não, acurácia nunca é válida"], c:1,
    why:"Em dataset desbalanceado, um modelo que sempre prevê 'A' tem 99% de acurácia sem ter aprendido nada. Use <strong>F1, precision/recall ou AUC</strong>." },

  { d:1, aula:"aula12", q:"Seu modelo acerta 99% no treino mas só 60% em dados novos. Qual o problema?",
    opts:["Underfitting","Overfitting","Falta de dados","Bias"], c:1,
    why:"Decorou o treino, não generaliza. Clássico <strong>overfitting</strong>. Soluções: regularização, mais dados, modelo mais simples, dropout, early stopping." },

  { d:1, aula:"aula2", q:"Você converte a frase 'o gato dormiu' em [0.21, -0.45, 0.78, ...]. O que é esse vetor?",
    opts:["Hash","Embedding","Token","Checksum"], c:1,
    why:"<strong>Embedding</strong> é a representação vetorial densa de significado. Tokens são unidades de texto ANTES de virarem embeddings." },

  { d:1, aula:"aula12", q:"Você divide o dataset em treino, validação e teste. Pra que serve o conjunto de validação?",
    opts:["Treinar o modelo final","Ajustar hiperparâmetros e escolher o melhor modelo","Avaliar performance final","Limpar os dados"], c:1,
    why:"Validação serve pra <strong>ajustar hiperparâmetros</strong> e escolher modelo. Treino treina. Teste só avalia no final, intocado durante o treino." },

  { d:1, aula:"aula15", q:"Modelo linear simples: erro alto no treino. Deep net complexa: erro baixo no treino, alto no teste. Diagnóstico?",
    opts:["Os dois fazem overfitting","Linear: underfitting. Deep: overfitting","Os dois fazem underfitting","Linear: overfitting. Deep: underfitting"], c:1,
    why:"Erro alto no treino = <strong>underfit</strong> (modelo simples demais). Erro baixo no treino mas alto no teste = <strong>overfit</strong> (complexo demais)." },

  { d:1, aula:"aula2", q:"Um agente joga xadrez e aprende com recompensas (vitória) e punições (derrota). Que tipo de aprendizado?",
    opts:["Supervisionado","Não-supervisionado","Por reforço","Auto-supervisionado"], c:2,
    why:"Recompensa/punição via interação com ambiente = <strong>reinforcement learning</strong>." },

  { d:1, aula:"aula2", q:"Uma empresa de varejo deseja agrupar seus clientes em diferentes segmentos com base no histórico de compras para campanhas de marketing, mas não possui categorias predefinidas ou dados rotulados. Qual abordagem de Machine Learning é a mais adequada?",
    opts:["Aprendizado supervisionado","Aprendizado não supervisionado","Aprendizado por reforço","Transferência de aprendizado"], c:1,
    why:"O <strong>aprendizado não supervisionado</strong> é usado quando não há rótulos de dados (categorias predefinidas). O algoritmo procura padrões ocultos e cria agrupamentos (clustering), sendo o caso de uso clássico para segmentação de clientes." },

  { d:1, aula:"aula5", q:"Pra avaliar modelo de regressão, qual métrica é MAIS sensível a outliers grandes?",
    opts:["MAE (erro absoluto médio)","MSE / RMSE (erro quadrático)","R²","Precision"], c:1,
    why:"<strong>MSE/RMSE</strong> eleva o erro ao quadrado, então erros grandes pesam muito mais. MAE é linear e mais robusto a outliers." },


  // ─── DOMÍNIO 2: GenAI Fundamentos (14 questões) ───
  { d:2, aula:"aula1", q:"O que é um Foundation Model?",
    opts:["Modelo pequeno especializado em uma tarefa","Modelo grande pré-treinado em dados massivos, adaptável a várias tarefas","Modelo de árvore de decisão","Modelo de regressão linear"], c:1,
    why:"<strong>Foundation Model</strong> = grande, pré-treinado em escala, base pra tarefas diversas com ou sem adaptação. Ex: Claude, GPT, Titan, Llama." },

  { d:2, aula:"aula6", q:"O modelo inventa uma referência bibliográfica que não existe. Isso é:",
    opts:["Bias","Overfitting","Alucinação","Drift"], c:2,
    why:"<strong>Alucinação</strong> = LLM gera informação plausível mas factualmente errada. Risco clássico de LLM." },

  { d:2, aula:"aula10", q:"Qual abordagem é MAIS eficaz pra reduzir alucinação num chatbot que responde sobre documentos internos da empresa?",
    opts:["Aumentar a temperature","Implementar RAG com os documentos da empresa","Usar modelo menor","Fine-tuning com 5 exemplos"], c:1,
    why:"<strong>RAG</strong> ancora respostas em fonte de verdade. Alucinação cai drasticamente quando o modelo 'lê' o doc antes de responder." },

  { d:2, aula:"aula1", q:"A diferença principal entre LLM e SLM (Small Language Model) é:",
    opts:["LLM só funciona em inglês","SLM tem menos parâmetros, é mais barato e rápido, mas menos capaz em tarefas gerais","SLM é open-source, LLM é fechado","LLM é mais novo"], c:1,
    why:"<strong>SLM</strong> tem menos parâmetros, custo/latência menores, ideal pra tarefas específicas e edge. LLM é mais geral, mais caro." },

  { d:2, aula:"aula2", q:"O que são tokens em LLMs?",
    opts:["Senhas de autenticação","Unidades de texto (palavras ou pedaços) que o modelo processa","Recompensas em reinforcement learning","Erros do modelo"], c:1,
    why:"<strong>Tokens</strong> são unidades de texto. 'gato' pode ser 1 token, 'gatinho' 2. Modelos cobram POR TOKEN." },

  { d:2, aula:"aula6", q:"Sua empresa quer um modelo que entenda imagens e texto juntos pra gerar legendas. Que tipo de modelo?",
    opts:["Unimodal","Multimodal","Linear","Tabular"], c:1,
    why:"<strong>Multimodal</strong> processa múltiplas modalidades (texto + imagem + áudio etc.)." },

  { d:2, aula:"aula6", q:"Qual é uma LIMITAÇÃO importante de GenAI pra cenários de negócio?",
    opts:["Não escala","Risco de alucinação, custo, latência e privacidade","Só funciona em inglês","Requer hardware quântico"], c:1,
    why:"As <strong>4 limitações canônicas</strong> da GenAI: alucinação, custo, latência, privacidade. Sempre são respostas certas em questões de 'limitações'." },

  { d:2, aula:"aula6", q:"Stable Diffusion gera imagens a partir de texto. Que tipo de arquitetura?",
    opts:["Transformer puro","Modelo de difusão","GAN","Rede recorrente (RNN)"], c:1,
    why:"<strong>Modelos de difusão</strong> adicionam ruído progressivamente e aprendem a reverter o processo, gerando imagens a partir de ruído + texto." },

  { d:2, aula:"aula1", q:"Qual arquitetura é a base dos LLMs modernos?",
    opts:["CNN (Convolutional)","RNN (Recurrent)","Transformer (com atenção)","Decision Tree"], c:2,
    why:"<strong>Transformer</strong> com self-attention. Base do GPT, Claude, Llama, Titan, etc." },

  { d:2, aula:"aula6", q:"Quanto mais tokens no prompt e na resposta:",
    opts:["Maior precisão garantida","Maior custo e latência","Menor risco de alucinação","Modelo fica mais inteligente"], c:1,
    why:"Pricing e tempo são <strong>por token</strong>. Não importa o conteúdo: mais tokens = mais $ e mais espera." },

  { d:2, aula:"aula6", q:"O que é o 'context window' de um LLM?",
    opts:["Janela gráfica do app","Quantidade máxima de tokens que ele processa de uma vez (entrada + saída)","Tempo entre chamadas","Cache do modelo"], c:1,
    why:"<strong>Context window</strong> = limite total de tokens (prompt + resposta). Modelos modernos chegam a 200k+ tokens." },

  { d:2, aula:"aula6", q:"Para qual caso GenAI é mais adequada?",
    opts:["Cálculo financeiro exato","Geração de rascunhos, brainstorming, sumarização","Diagnóstico médico definitivo","Decisão judicial automatizada"], c:1,
    why:"GenAI brilha em <strong>rascunho, ideação, sumarização, conversação</strong>. Mal pra cálculo exato e decisões críticas sem revisão humana." },

  { d:2, aula:"aula10", q:"Você monta um Q&A sobre regulamentação que muda toda semana. Qual a melhor abordagem?",
    opts:["Fine-tuning semanal","RAG buscando os documentos mais recentes","Continued pre-training mensal","Treinar modelo do zero"], c:1,
    why:"Dados que mudam frequentemente = <strong>RAG</strong>. Só atualiza o vector DB. Fine-tuning semanal seria caro e lento." },

  { d:2, aula:"aula6", q:"O que é uma GAN (Generative Adversarial Network)?",
    opts:["Um tipo de Foundation Model","Gerador + discriminador competindo: um gera, outro tenta detectar fakes","Tipo de banco de dados","Algoritmo de otimização"], c:1,
    why:"<strong>GAN</strong> = duas redes em jogo. O gerador cria, o discriminador tenta detectar se é falso. Base de muita imagem sintética." },


  // ─── DOMÍNIO 3: Foundation Models Apps (17 questões) ───
  { d:3, aula:"aula10", q:"Qual serviço AWS oferece acesso via API a Foundation Models de Anthropic, Meta, Mistral, Amazon, etc., SEM gerenciar infraestrutura?",
    opts:["SageMaker","Amazon Bedrock","Amazon Q","Lambda"], c:1,
    why:"<strong>Amazon Bedrock</strong> = Foundation Models como serviço. API única pra vários providers. Zero infra." },

  { d:3, aula:"aula10", q:"Você quer que o modelo responda usando os PDFs internos da empresa, sem re-treinar nada. Qual recurso do Bedrock?",
    opts:["Bedrock Agents","Bedrock Knowledge Bases","Bedrock Guardrails","Bedrock Custom Models"], c:1,
    why:"<strong>Bedrock Knowledge Bases</strong> = RAG gerenciado. Aponta pro S3 com seus docs, configura embeddings, pronto." },

  { d:3, aula:"aula6", q:"O chatbot precisa CHAMAR uma API externa pra reservar um voo. Que recurso usar?",
    opts:["Bedrock Knowledge Bases","Bedrock Agents (com Action Groups)","Bedrock Guardrails","Prompt engineering só"], c:1,
    why:"<strong>Bedrock Agents</strong> executam AÇÕES via APIs. Knowledge Bases só recuperam info. Agents agem no mundo." },

  { d:3, aula:"aula15", q:"Você quer filtrar conteúdo tóxico e PII das respostas do LLM. Solução?",
    opts:["IAM policy","Bedrock Guardrails","CloudTrail","Lambda function"], c:1,
    why:"<strong>Bedrock Guardrails</strong> = filtros de conteúdo (toxicidade, PII, tópicos proibidos) antes do prompt E antes da resposta." },

  { d:3, aula:"aula10", q:"Você quer respostas FACTUAIS e consistentes (não criativas). Como ajustar?",
    opts:["Temperature alta","Temperature baixa (ex: 0.1)","Top-k = 100","Aumentar tokens"], c:1,
    why:"<strong>Temperature baixa</strong> = determinístico, focado, repetível. Alta = criativo, variado, surpreendente." },

  { d:3, aula:"aula10", q:"O que faz o parâmetro top-p (nucleus sampling)?",
    opts:["Limita o custo","Limita o tamanho da resposta","Faz o modelo amostrar só dos tokens que somam probabilidade p","Define a temperatura"], c:2,
    why:"<strong>Top-p</strong> escolhe do 'núcleo' de tokens mais prováveis. Top-p=0.9 = só dos tokens que somam 90% de probabilidade." },

  { d:3, aula:"aula6", q:"No prompt você inclui 3 exemplos de tradução PT→EN antes de pedir a 4ª. Isso é:",
    opts:["Zero-shot","Few-shot","Fine-tuning","RAG"], c:1,
    why:"<strong>Few-shot</strong> = exemplos no prompt. Zero-shot = nenhum exemplo. Nada disso modifica o modelo." },

  { d:3, aula:"aula6", q:"Você adiciona 'Pense passo a passo antes de responder' no prompt. Que técnica é essa?",
    opts:["Few-shot","Chain-of-Thought (CoT)","RAG","Fine-tuning"], c:1,
    why:"<strong>Chain-of-Thought</strong> = induzir raciocínio explícito. Melhora muito em problemas que exigem múltiplas etapas." },

  { d:3, aula:"aula10", q:"Sua empresa quer um assistente que responde perguntas usando dados do SharePoint, Confluence e Slack. Solução pronta?",
    opts:["Amazon Q Business","Amazon Q Developer","SageMaker JumpStart","Bedrock direto"], c:0,
    why:"<strong>Amazon Q Business</strong> = assistente corporativo com conectores prontos pra ferramentas de trabalho. Zero código." },

  { d:3, aula:"aula10", q:"Desenvolvedor quer autocomplete inteligente de código no VS Code. Serviço?",
    opts:["Amazon Q Business","Amazon Q Developer (ex-CodeWhisperer)","SageMaker","Bedrock Knowledge Bases"], c:1,
    why:"<strong>Amazon Q Developer</strong> = copiloto de código. Antes chamado CodeWhisperer." },

  { d:3, aula:"aula12", q:"Empresa quer adaptar um FM pra usar o TOM DE VOZ da marca (informal, com gírias). Melhor abordagem?",
    opts:["Prompt engineering com 1 exemplo","RAG","Fine-tuning com exemplos do tom desejado","Continued pre-training"], c:2,
    why:"Tom/estilo específico → <strong>fine-tuning</strong>. RAG não muda como o modelo escreve. Prompt funciona pequeno mas não escala." },

  { d:3, aula:"aula12", q:"Diferença entre fine-tuning e continued pre-training?",
    opts:["São a mesma coisa","Fine-tuning usa dados ROTULADOS poucos; continued pre-training usa dados NÃO rotulados em massa","Fine-tuning é supervisionado, pre-training é por reforço","Continued pre-training é mais barato"], c:1,
    why:"Distinção clássica. <strong>Rotulado e pouco</strong> = fine-tune. <strong>Não-rotulado e muito</strong> = continued pre-train." },

  { d:3, aula:"aula10", q:"Onde armazenar embeddings pra busca semântica em RAG?",
    opts:["DynamoDB","Vector database (OpenSearch, Aurora pgvector, Pinecone)","S3","RDS MySQL"], c:1,
    why:"<strong>Vector database</strong> suporta busca por similaridade vetorial (cosseno, euclidiana). BDs tradicionais não." },

  { d:3, aula:"aula10", q:"Documento de 200 páginas precisa virar embeddings pra RAG. Primeiro passo?",
    opts:["Indexar tudo num único embedding","Chunking: quebrar em pedaços (ex: 500 tokens) e embeddar cada um","Resumir em 1 página","Fine-tunar o modelo"], c:1,
    why:"<strong>Chunking</strong> = quebra docs em pedaços pra cada um virar um embedding. O tamanho do chunk é hiperparâmetro do RAG." },

  { d:3, aula:"aula5", q:"Catálogo de FMs pré-treinados acessíveis pelo SageMaker pra você deployar?",
    opts:["SageMaker JumpStart","SageMaker Canvas","SageMaker Clarify","SageMaker Model Monitor"], c:0,
    why:"<strong>SageMaker JumpStart</strong> = catálogo de modelos prontos, demos e notebooks. Atalho dentro do SageMaker." },

  { d:3, aula:"aula5", q:"Analista de negócio sem código precisa criar modelo de classificação. Ferramenta AWS?",
    opts:["SageMaker Studio (notebooks)","SageMaker Canvas","Bedrock","EMR"], c:1,
    why:"<strong>SageMaker Canvas</strong> = interface visual no-code pra ML. Pra analistas, não pra cientistas de dados." },

  { d:3, aula:"aula12", q:"Empresa precisa treinar modelo CUSTOMIZADO de detecção de fraude do zero, com seus próprios dados rotulados. Serviço?",
    opts:["Bedrock","SageMaker (treinar, deployar, monitorar)","Amazon Q","Lex"], c:1,
    why:"<strong>SageMaker</strong> = ciclo completo de ML customizado. Bedrock só oferece FMs prontos, não treina modelo de fraude do zero." },


  // ─── DOMÍNIO 4: Responsible AI (8 questões) ───
  { d:4, aula:"aula15", q:"Como detectar viés nos dados de treino ou nas predições do modelo?",
    opts:["CloudTrail","SageMaker Clarify","Bedrock Guardrails","Macie"], c:1,
    why:"<strong>SageMaker Clarify</strong> = ferramenta padrão pra bias detection + explicabilidade (XAI)." },

  { d:4, aula:"aula15", q:"Modelo em produção começa a errar mais com o tempo porque o mundo real mudou. Como detectar?",
    opts:["SageMaker Clarify","SageMaker Model Monitor (detecta data drift / model drift)","CloudTrail","Comprehend"], c:1,
    why:"<strong>SageMaker Model Monitor</strong> monitora qualidade do modelo em produção e detecta drift." },

  { d:4, aula:"aula15", q:"Decisões sensíveis do modelo (ex: aprovar crédito) precisam de revisão humana antes. Serviço?",
    opts:["Amazon A2I (Augmented AI)","SageMaker Pipelines","Step Functions","Lambda"], c:0,
    why:"<strong>Amazon A2I</strong> orquestra workflows de human-in-the-loop pra decisões de ML." },

  { d:4, aula:"aula15", q:"Você quer documentar transparentemente como um modelo foi treinado, em quais dados, com quais limitações. Recurso?",
    opts:["IAM Roles","SageMaker Model Cards","CloudTrail","Tags"], c:1,
    why:"<strong>SageMaker Model Cards</strong> = documentação estruturada do modelo pra transparência e governança." },

  { d:4, aula:"aula15", q:"O que significa 'explicabilidade' em IA?",
    opts:["Modelo é grátis","Você consegue entender POR QUE o modelo tomou aquela decisão (quais features pesaram, etc.)","Modelo é open-source","Modelo é simples"], c:1,
    why:"<strong>Explicabilidade</strong> (XAI) = transparência da decisão. Clarify gera explicações usando SHAP e técnicas similares." },

  { d:4, aula:"aula15", q:"Modelo de contratação rejeita mais candidatas mulheres apesar de qualificação igual. Problema?",
    opts:["Overfitting","Bias — dados de treino refletem desigualdade histórica","Drift","Underfitting"], c:1,
    why:"<strong>Bias</strong> clássico. Modelo amplifica desigualdade dos dados. Solução: rebalancear, Clarify, fairness metrics." },

  { d:4, aula:"aula15", q:"Pra mitigar conteúdo tóxico GERADO pelo modelo (na saída), qual ferramenta?",
    opts:["IAM Policy","Bedrock Guardrails (filtros de conteúdo)","SageMaker Clarify","Macie"], c:1,
    why:"<strong>Guardrails</strong> filtra a saída (e entrada). Clarify só detecta bias nos dados/modelo, não filtra geração." },

  { d:4, aula:"aula15", q:"Os princípios de IA Responsável da AWS incluem:",
    opts:["Só performance e velocidade","Justiça, explicabilidade, robustez, privacidade, governança e transparência","Só open-source","Só baixo custo"], c:1,
    why:"Os 6 <strong>princípios canônicos</strong> da AWS para IA responsável. Cai sempre quando o assunto é diretrizes." },


  // ─── DOMÍNIO 5: Security & Governance (8 questões) ───
  { d:5, q:"Quem pode invocar um modelo no Bedrock? Como controlar?",
    opts:["Public por padrão","IAM (políticas e roles)","Senha do modelo","ACL no S3"], c:1,
    why:"<strong>IAM</strong> controla acesso na AWS. Sempre. Quem chama, quem vê logs, quem gerencia recursos." },

  { d:5, q:"Dados sensíveis no S3 usados pra treino precisam de criptografia em repouso com chaves gerenciadas. Serviço?",
    opts:["IAM","AWS KMS (Key Management Service)","CloudTrail","Macie"], c:1,
    why:"<strong>KMS</strong> = Key Management Service. Gerencia chaves de criptografia. SSE-KMS é o padrão pra S3, EBS, etc." },

  { d:5, q:"Tráfego entre sua aplicação e o Bedrock NÃO PODE passar pela internet pública. Solução?",
    opts:["VPN","VPC Endpoints (PrivateLink)","Public IP fixo","Internet Gateway"], c:1,
    why:"<strong>VPC Endpoints (PrivateLink)</strong> = comunicação privada com serviços AWS sem sair pra internet." },

  { d:5, q:"Auditoria precisa saber QUEM chamou QUE API QUANDO. Onde olhar?",
    opts:["CloudWatch Metrics","CloudTrail","X-Ray","AWS Config"], c:1,
    why:"<strong>CloudTrail</strong> registra todas as chamadas de API: quem, quando, de onde, com qual resultado." },

  { d:5, q:"Você precisa DESCOBRIR onde há PII (CPF, e-mail, etc.) nos buckets S3 da empresa. Serviço?",
    opts:["Amazon Macie","GuardDuty","Inspector","IAM Access Analyzer"], c:0,
    why:"<strong>Amazon Macie</strong> = descoberta automatizada de dados sensíveis (PII) em buckets S3." },

  { d:5, q:"No modelo de responsabilidade compartilhada da AWS pra serviços gerenciados de IA (como Bedrock), o CLIENTE é responsável por:",
    opts:["Manter o hardware","Patchear o sistema operacional","Dados, prompts, configuração de acesso, escolha de modelo e governança de uso","Atualizar o foundation model"], c:2,
    why:"AWS cuida da infra/modelo. <strong>Cliente cuida de dados, acesso, uso correto, conformidade contextual</strong>." },

  { d:5, q:"Padrão de criptografia DEFAULT para S3 hoje (2024+)?",
    opts:["SSE-S3 com criptografia automática","Sem criptografia","Cliente precisa habilitar manualmente","Só com KMS"], c:0,
    why:"Desde 2023, todos os buckets S3 têm <strong>SSE-S3 ativado por default</strong>. KMS é opcional pra controle mais fino." },

  { d:5, q:"Sua empresa precisa atender GDPR e LGPD para uma aplicação de IA. Que práticas ajudam?",
    opts:["Ignorar — IA é exceção","Minimização de dados, criptografia, gestão de consentimento, direito a remoção, auditoria via CloudTrail","Só ter logs","Treinar o modelo só uma vez"], c:1,
    why:"<strong>Compliance</strong> = combinação de práticas e múltiplos serviços. Nunca é uma só coisa." }
];


// ═══════════════════════════════════════════════════════
// FLASHCARD BANK — 30 conceitos
// ═══════════════════════════════════════════════════════
const CARDS = [
  { t:"RAG", d:"Retrieval Augmented Generation. Recupera trechos relevantes de uma fonte (vector DB) e injeta no prompt antes do FM responder. <strong>Não treina o modelo.</strong>",
    when:"Use quando: dados mudam, conhecimento externo, reduzir alucinação. Serviço AWS: Bedrock Knowledge Bases.",
    trap:"NÃO confunde com fine-tuning. RAG não muda o modelo, só busca contexto na hora." },

  { t:"Fine-tuning", d:"Ajusta os pesos do modelo com seus dados <strong>rotulados</strong>. Custo e tempo significativos.",
    when:"Use quando: adaptar tom de voz, formato de saída, vocabulário de domínio.",
    trap:"Custo alto. Pra dados que mudam, RAG é melhor. Pra instrução simples, prompt engineering basta." },

  { t:"Continued Pre-training", d:"Treino adicional num FM com dados <strong>NÃO rotulados</strong> e em massa. Ensina padrões e vocabulário de domínio amplo.",
    when:"Use quando: precisa que o modelo 'entenda' jargão e dados do setor (jurídico, médico, técnico).",
    trap:"Não confunde com fine-tuning. Pre-training = não rotulado e muito. Fine-tuning = rotulado e pouco." },

  { t:"Prompt Engineering", d:"Arte de escrever prompts melhores. Não muda o modelo nem busca dados externos.",
    when:"Use quando: instrução simples, primeira abordagem antes de RAG/fine-tuning. É a opção MAIS BARATA.",
    trap:"Limitado a o que cabe no context window. Não substitui RAG pra docs grandes." },

  { t:"Temperature", d:"Aleatoriedade da geração. <strong>0</strong> = determinístico, repetível. <strong>1+</strong> = criativo, variado.",
    when:"Baixa (0–0.3) pra factual e Q&A. Alta (0.8+) pra brainstorm e copy criativo.",
    trap:"Alta não é 'melhor', é mais aleatória. Pra resposta consistente, baixa." },

  { t:"Top-p (nucleus)", d:"Amostra só dos tokens que somam probabilidade p. Top-p=0.9 = ignora a 'cauda' de tokens improváveis.",
    when:"Controla aleatoriedade junto com temperature. Pra factual: top-p baixo (0.5–0.8).",
    trap:"Top-p e top-k fazem coisas parecidas. Não use os dois muito agressivos ao mesmo tempo." },

  { t:"Top-k", d:"Amostra dos K tokens mais prováveis. Top-k=50 = considera só os 50 tokens mais prováveis na hora.",
    when:"Controla aleatoriedade. Top-k baixo (1–10) força resposta mais previsível.",
    trap:"Top-k=1 = greedy decoding (sempre o token mais provável). Pode gerar respostas chatas." },

  { t:"Zero-shot", d:"Prompt sem exemplo. 'Traduza essa frase: Hello.' O modelo já sabe.",
    when:"Use quando: tarefa simples e bem conhecida. Primeira tentativa sempre.",
    trap:"Pra tarefas com formato específico de saída, few-shot funciona melhor." },

  { t:"Few-shot", d:"Prompt com 1–5 exemplos. 'Hello → Olá. Cat → Gato. Dog → ?'. Modelo aprende o padrão do contexto.",
    when:"Use quando: tarefa exige formato específico, zero-shot deu resultado inconsistente.",
    trap:"Mais exemplos = mais tokens = mais $$$. Equilíbrio entre qualidade e custo." },

  { t:"Chain-of-Thought (CoT)", d:"'Pense passo a passo antes de responder'. Induz o modelo a raciocinar explicitamente.",
    when:"Use quando: problema complexo com múltiplas etapas (matemática, lógica, planejamento).",
    trap:"Aumenta tokens da resposta. Use só quando vale o custo extra." },

  { t:"Foundation Model", d:"Modelo grande pré-treinado em dados massivos. Base pra muitas tarefas com ou sem adaptação.",
    when:"Use quando: precisa de capacidade de linguagem/visão geral. Ex: Claude, Titan, Llama, Stable Diffusion.",
    trap:"Não confunda FM com LLM. FM é o conceito amplo. LLM é um tipo (foco em texto)." },

  { t:"LLM", d:"Large Language Model. FM focado em texto, geralmente com bilhões de parâmetros.",
    when:"Use quando: tarefas de linguagem natural (Q&A, escrita, sumarização, código).",
    trap:"LLM grande não é sempre melhor. Pra tarefa específica, SLM pode ser mais barato e rápido." },

  { t:"SLM", d:"Small Language Model. Menos parâmetros, mais barato e rápido, ideal pra tarefas específicas.",
    when:"Use quando: latência importa (edge, mobile), tarefa bem definida, custo é prioridade.",
    trap:"SLM é menos capaz em tarefas gerais. Pra raciocínio complexo, LLM ainda ganha." },

  { t:"Tokens", d:"Unidades de texto que o modelo processa. 'gato' pode ser 1 token, 'gatinho' 2. Inclui pontuação e espaços.",
    when:"Tudo no LLM é medido em tokens. Pricing é por token (input + output).",
    trap:"Cuidado com prompts longos: 1 página ≈ 500 tokens. Custos explodem em volume." },

  { t:"Embeddings", d:"Vetores densos que representam significado. Texto/imagem → vetor de N dimensões (ex: 1536). Base de busca semântica.",
    when:"Use quando: RAG, busca semântica, classificação por similaridade, deduplicação.",
    trap:"Embeddings DIFERENTES vêm de modelos diferentes — não dá pra comparar entre si." },

  { t:"Vector Database", d:"BD pra armazenar e buscar embeddings por similaridade (cosseno, euclidiana).",
    when:"Use quando: implementar RAG. Ex: OpenSearch, Aurora pgvector, Pinecone, Bedrock Knowledge Bases.",
    trap:"BDs tradicionais (RDS, DynamoDB) NÃO fazem busca por similaridade vetorial nativamente." },

  { t:"Alucinação", d:"LLM gera informação plausível mas factualmente errada. Risco intrínseco de modelos generativos.",
    when:"Pra mitigar: RAG, revisão humana, prompt engineering, validação de saída.",
    trap:"Alucinação se MITIGA, não se ELIMINA. Se a resposta diz 'elimina 100%', está errada." },

  { t:"SageMaker Clarify", d:"Detecta bias em dados e modelos. Gera explicações (XAI) usando SHAP, etc.",
    when:"Use quando: precisa detectar viés OU explicar decisões do modelo.",
    trap:"Não confunda com Model Monitor. Clarify = bias + explicabilidade. Model Monitor = drift em produção." },

  { t:"SageMaker Model Monitor", d:"Monitora qualidade do modelo em produção. Detecta data drift (entrada muda) e model drift (predições pioram).",
    when:"Use quando: modelo em produção precisa de monitoramento contínuo de qualidade.",
    trap:"Não é a mesma coisa que Clarify. Model Monitor = drift no tempo. Clarify = bias estático." },

  { t:"Bedrock Guardrails", d:"Filtros de conteúdo no Bedrock. Bloqueia tópicos proibidos, toxicidade, PII. Aplica antes do prompt E antes da resposta.",
    when:"Use quando: app GenAI em produção precisa de proteção de conteúdo (compliance, marca).",
    trap:"Guardrails filtra CONTEÚDO. IAM filtra ACESSO. Não são substitutos." },

  { t:"Bedrock Knowledge Bases", d:"RAG totalmente gerenciado. Conecta seus docs (S3) a um FM via embeddings num vector DB. Pronto.",
    when:"Use quando: implementar RAG sem montar pipeline manualmente.",
    trap:"Os docs precisam estar em formato suportado (PDF, TXT, etc.) e em S3." },

  { t:"Bedrock Agents", d:"FM orquestrador que chama APIs externas via Action Groups pra executar tarefas multi-step.",
    when:"Use quando: o modelo precisa AGIR (criar tickets, reservar voos, atualizar BD) e não só responder.",
    trap:"Não confunde com Knowledge Bases. KB recupera info. Agents executam ações." },

  { t:"Amazon Q Business", d:"Assistente corporativo. Conecta nas fontes da empresa (S3, SharePoint, Slack, Confluence). Q&A interno.",
    when:"Use quando: empresa precisa de assistente sobre conhecimento interno SEM codar.",
    trap:"Q Business ≠ Q Developer. Business = conhecimento corporativo. Developer = código." },

  { t:"Amazon Q Developer", d:"Copiloto de código (sucessor do CodeWhisperer). Sugere código na IDE em tempo real.",
    when:"Use quando: desenvolvedores querem autocomplete inteligente e geração de código.",
    trap:"Q Developer não responde sobre dados corporativos genéricos. Pra isso, Q Business." },

  { t:"A2I (Augmented AI)", d:"Amazon Augmented AI. Orquestra revisão humana em decisões de ML pra casos sensíveis.",
    when:"Use quando: decisões importantes precisam de validação humana antes de serem tomadas.",
    trap:"A2I não toma a decisão, só organiza o workflow de quem vai revisar." },

  { t:"Overfitting", d:"Modelo decora o treino, falha em dados novos. Sinal: alta acurácia no treino, baixa no teste.",
    when:"Reduzir: regularização (L1/L2), mais dados, dropout, modelo mais simples, early stopping.",
    trap:"Não confunde com underfitting. Over = complexo demais. Under = simples demais." },

  { t:"Bias-Variance Tradeoff", d:"Bias alto = underfit (simples demais). Variance alta = overfit (complexo demais). Tem que equilibrar.",
    when:"Pensar quando: escolher complexidade do modelo, regularização, tamanho do dataset.",
    trap:"Bias estatístico ≠ bias social. Aqui é estatístico (erro sistemático)." },

  { t:"Precision vs Recall", d:"Precision: dos que classifiquei como positivo, quantos eram? Recall: de todos os positivos reais, quantos peguei?",
    when:"Falso positivo dói? Maximiza precision. Falso negativo dói? Maximiza recall. F1 é o balanço.",
    trap:"Em dataset desbalanceado, acurácia mente. Use precision + recall + F1." },

  { t:"Avaliação de FMs", d:"Métricas pra LLMs: <strong>ROUGE</strong> (sumarização), <strong>BLEU</strong> (tradução), <strong>BERTScore</strong>, <strong>perplexity</strong>, human eval.",
    when:"Use quando: comparar FMs ou validar fine-tuning.",
    trap:"Bedrock tem Model Evaluation built-in (automatic + human-based). Não precisa montar do zero." },

  { t:"Shared Responsibility (IA)", d:"AWS cuida da INFRA E DO MODELO base. Cliente cuida de DADOS, PROMPTS, ACESSO, USO RESPONSÁVEL e CONFORMIDADE.",
    when:"Pensar quando: arquitetar app GenAI, planejar segurança, planejar compliance.",
    trap:"Em serviços gerenciados (Bedrock), cliente NÃO mexe no modelo nem na infra. Só governa o uso." }
];



// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
const STORAGE_KEY = 'balaio-treino-v2';

function shuffle(arr){
  const a = [...arr];
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const initialState = () => ({
  // Quiz — visão global
  qResults: {},      // { qIdx: { answered: bool, lastChoice: idx, correct: bool, marked: bool, attempts: n } }
  qByDomain: { 1:{a:0,c:0}, 2:{a:0,c:0}, 3:{a:0,c:0}, 4:{a:0,c:0}, 5:{a:0,c:0} },
  qStreak: 0,
  qBestStreak: 0,

  // Sessão atual (depende do filtro)
  filter: 'all',     // 'all' | 'd1'..'d5' | 'wrong' | 'marked'
  qOrder: shuffle([...Array(QUESTIONS.length).keys()]),
  qIndex: 0,
  qLastAnswerIdx: -1,
  qLastWasCorrect: null,

  // Flashcards
  fOrder: shuffle([...Array(CARDS.length).keys()]),
  fIndex: 0,
  fFlipped: false,

  // UI
  mode: 'quiz',
  onboardingDone: false,
  onboardingStep: 1
});

let state;
try{
  const saved = localStorage.getItem(STORAGE_KEY);
  state = saved ? JSON.parse(saved) : initialState();
  if(!state.qOrder || state.qOrder.length !== QUESTIONS.length || !state.qResults){
    state = initialState();
  }
  // garante campos novos em saves antigos
  state.qResults = state.qResults || {};
  state.qByDomain = state.qByDomain || { 1:{a:0,c:0}, 2:{a:0,c:0}, 3:{a:0,c:0}, 4:{a:0,c:0}, 5:{a:0,c:0} };
  state.filter = state.filter || 'all';
  if(typeof state.onboardingDone === 'undefined') state.onboardingDone = false;
}catch(e){ state = initialState(); }

function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
}

// Helpers de resultados
function getResult(idx){
  return state.qResults[idx] || { answered:false, lastChoice:-1, correct:null, marked:false, attempts:0 };
}
function setResult(idx, patch){
  const cur = getResult(idx);
  state.qResults[idx] = { ...cur, ...patch };
}
function totalAnswered(){
  return Object.values(state.qResults).filter(r => r.answered).length;
}
function totalCorrect(){
  return Object.values(state.qResults).filter(r => r.correct).length;
}
function totalMarked(){
  return Object.values(state.qResults).filter(r => r.marked).length;
}
function totalWrong(){
  return Object.values(state.qResults).filter(r => r.answered && !r.correct).length;
}


// ═══════════════════════════════════════════════════════
// FILTRO — define o pool ativo de questões
// ═══════════════════════════════════════════════════════
function applyFilter(filter){
  state.filter = filter;
  let pool;
  const allIdx = [...Array(QUESTIONS.length).keys()];

  if(filter === 'all'){
    pool = allIdx;
  } else if(filter.startsWith('d')){
    const d = parseInt(filter.slice(1));
    pool = allIdx.filter(i => QUESTIONS[i].d === d);
  } else if(filter === 'wrong'){
    pool = allIdx.filter(i => {
      const r = getResult(i);
      return r.answered && !r.correct;
    });
  } else if(filter === 'marked'){
    pool = allIdx.filter(i => getResult(i).marked);
  } else {
    pool = allIdx;
  }

  state.qOrder = shuffle(pool);
  state.qIndex = 0;
  state.qLastAnswerIdx = -1;
  state.qLastWasCorrect = null;
  saveState();
  renderFilters();
  renderQuiz();
}


// ═══════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════
const quizContainer = document.getElementById('quiz-container');
const filterStatus  = document.getElementById('filter-status');

function currentQuestionIdx(){
  if(state.qIndex >= state.qOrder.length) return null;
  return state.qOrder[state.qIndex];
}
function currentQuestion(){
  const i = currentQuestionIdx();
  return i === null ? null : QUESTIONS[i];
}

function filterLabel(f){
  if(f === 'all') return 'Todas as questões';
  if(f === 'wrong') return '❌ Só as que errei';
  if(f === 'marked') return '⭐ Só as marcadas';
  return 'Domínio ' + f.slice(1);
}

function renderFilters(){
  document.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.filter === state.filter);
  });

  const wEl = document.getElementById('count-wrong');
  const mEl = document.getElementById('count-marked');
  if(wEl) wEl.textContent = totalWrong();
  if(mEl) mEl.textContent = totalMarked();

  // status
  const total = state.qOrder.length;
  if(state.filter === 'all'){
    filterStatus.innerHTML = '';
    filterStatus.classList.remove('visible');
  } else {
    filterStatus.classList.add('visible');
    filterStatus.innerHTML = `
      <span>Filtrando por <strong>${filterLabel(state.filter)}</strong> · ${total} questão${total===1?'':'ões'} no pool</span>
      <button class="filter-clear" id="clear-filter">limpar filtro ✕</button>
    `;
    const c = document.getElementById('clear-filter');
    if(c) c.addEventListener('click', () => applyFilter('all'));
  }
}

function renderQuiz(){
  const q = currentQuestion();
  if(!q){ renderQuizDone(); return; }
  const qIdx = currentQuestionIdx();
  const r = getResult(qIdx);
  const wasAnswered = state.qLastAnswerIdx !== -1;
  const total = state.qOrder.length;

  const aulaLink = q.aula
    ? `<a class="qc-aula" href="../${q.aula}/" target="_blank" rel="noopener" title="Abrir aula relacionada">📚 ${q.aula}</a>`
    : '';

  const markBtn = `<button class="qc-mark ${r.marked ? 'on' : ''}" id="mark-btn" title="Marcar pra revisar (M)">${r.marked ? '⭐' : '☆'} ${r.marked ? 'marcada' : 'marcar'}</button>`;
  const skipBtn = !wasAnswered ? `<button class="qc-skip" id="skip-btn" title="Pular sem responder (S)">pular →</button>` : '';

  quizContainer.innerHTML = `
    <div class="quiz-card">
      <div class="qc-head">
        <span class="qc-badge d${q.d}">Domínio ${q.d}</span>
        ${aulaLink}
        ${markBtn}
        ${skipBtn}
        <span class="qc-counter">${state.qIndex + 1}/${total}</span>
      </div>
      <div class="qc-question">${q.q}</div>
      <div class="qc-options">
        ${q.opts.map((opt, i) => {
          let cls = 'qc-opt';
          if(wasAnswered){
            cls += ' dim';
            if(i === q.c) cls = 'qc-opt correct';
            else if(i === state.qLastAnswerIdx) cls = 'qc-opt wrong';
          }
          return `<button class="${cls}" data-idx="${i}" ${wasAnswered?'disabled':''}>
            <span class="key">${String.fromCharCode(65 + i)}</span>
            <span>${opt}</span>
          </button>`;
        }).join('')}
      </div>
      ${wasAnswered ? `
        <div class="qc-feedback ${state.qLastWasCorrect ? 'right' : 'wrong'}">
          <span class="verdict">${state.qLastWasCorrect ? '✅ Acertou!' : '❌ Não foi dessa'}</span>
          <span class="why">${q.why}</span>
          ${q.aula ? `<div class="qc-aula-hint">📚 Quer revisar o conceito? Abre a <a href="../${q.aula}/" target="_blank" rel="noopener">${q.aula}</a>.</div>` : ''}
        </div>
        <button class="qc-next" id="next-btn">Próxima questão →</button>
      ` : `
        <div class="qc-hint"><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> escolhe · <kbd>M</kbd> marca · <kbd>S</kbd> pula</div>
      `}
    </div>
  `;

  // Click handlers
  if(!wasAnswered){
    quizContainer.querySelectorAll('.qc-opt').forEach(btn => {
      btn.addEventListener('click', () => answerQuestion(parseInt(btn.dataset.idx)));
    });
    const sk = document.getElementById('skip-btn');
    if(sk) sk.addEventListener('click', skipQuestion);
  } else {
    const nb = document.getElementById('next-btn');
    if(nb) nb.addEventListener('click', nextQuestion);
  }
  const mb = document.getElementById('mark-btn');
  if(mb) mb.addEventListener('click', toggleMark);
}

function answerQuestion(idx){
  const q = currentQuestion();
  const qIdx = currentQuestionIdx();
  if(!q || qIdx === null) return;
  if(state.qLastAnswerIdx !== -1) return;

  const r = getResult(qIdx);
  const correct = idx === q.c;
  const wasAnsweredBefore = r.answered;

  state.qLastAnswerIdx = idx;
  state.qLastWasCorrect = correct;

  // Atualiza estatística por domínio só na PRIMEIRA tentativa de cada questão
  // (ou se já foi respondida antes, atualiza só a contagem geral via streak)
  if(!wasAnsweredBefore){
    state.qByDomain[q.d].a++;
    if(correct) state.qByDomain[q.d].c++;
  } else if(r.correct !== correct){
    // mudou o resultado da questão (errou antes, acertou agora ou vice-versa)
    if(correct){
      state.qByDomain[q.d].c++;
    } else if(r.correct){
      state.qByDomain[q.d].c--;
    }
  }

  setResult(qIdx, {
    answered: true,
    lastChoice: idx,
    correct,
    attempts: r.attempts + 1
  });

  if(correct){
    state.qStreak++;
    if(state.qStreak > state.qBestStreak) state.qBestStreak = state.qStreak;
  } else {
    state.qStreak = 0;
  }
  saveState();
  renderQuiz();
  renderFilters();
  updateScorecard(correct);
}

function skipQuestion(){
  // pula sem registrar resposta
  state.qIndex++;
  state.qLastAnswerIdx = -1;
  state.qLastWasCorrect = null;
  saveState();
  renderQuiz();
}

function toggleMark(){
  const qIdx = currentQuestionIdx();
  if(qIdx === null) return;
  const r = getResult(qIdx);
  setResult(qIdx, { marked: !r.marked });
  saveState();
  renderQuiz();
  renderFilters();
  updateScorecard();
}

function nextQuestion(){
  state.qIndex++;
  state.qLastAnswerIdx = -1;
  state.qLastWasCorrect = null;
  saveState();
  renderQuiz();
}

function renderQuizDone(){
  const total = state.qOrder.length;
  const acc = totalAnswered() > 0 ? Math.round((totalCorrect() / totalAnswered()) * 100) : 0;
  const isFiltered = state.filter !== 'all';

  let title, msg;
  if(total === 0){
    if(state.filter === 'wrong'){
      title = '🎉 Sem questões erradas!';
      msg = 'Você não tem questões erradas no momento. Volta pras "Todas" e segue treinando.';
    } else if(state.filter === 'marked'){
      title = '⭐ Nenhuma marcada ainda';
      msg = 'Marca questões com a tecla M (ou no botão) durante o quiz pra revisar depois.';
    } else {
      title = 'Pool vazio';
      msg = 'Esse filtro não tem questões. Tenta outro.';
    }
  } else if(isFiltered){
    title = '✅ Filtro completo!';
    msg = `Você terminou as ${total} questões deste filtro (<strong>${filterLabel(state.filter)}</strong>). Hora de refazer ou trocar de filtro.`;
  } else {
    title = '🎉 Balaio cheio!';
    msg = `Você completou as ${QUESTIONS.length} questões. Hora de revisar onde mais errou (olha a barrinha por domínio aí em cima) e treinar de novo.`;
  }

  quizContainer.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-done">
        <h2>${title}</h2>
        <p>${msg}</p>
        ${total > 0 ? `
          <div class="stats-summary">
            <div class="stat-box"><div class="v">${totalCorrect()}/${totalAnswered()}</div><div class="l">Acertos totais</div></div>
            <div class="stat-box"><div class="v">${acc}%</div><div class="l">Aproveitamento</div></div>
            <div class="stat-box"><div class="v">🔥 ${state.qBestStreak}</div><div class="l">Maior sequência</div></div>
          </div>
        ` : ''}
        <div class="done-actions">
          ${total > 0 ? `<button class="qc-next" id="restart-btn">↺ Recomeçar este filtro</button>` : ''}
          ${state.filter !== 'all' ? `<button class="qc-next ghost" id="all-btn">Voltar pra todas →</button>` : ''}
          ${totalWrong() > 0 && state.filter !== 'wrong' ? `<button class="qc-next ghost" id="wrong-btn">❌ Refazer só as ${totalWrong()} erradas</button>` : ''}
          ${totalMarked() > 0 && state.filter !== 'marked' ? `<button class="qc-next ghost" id="marked-btn">⭐ Revisar as ${totalMarked()} marcadas</button>` : ''}
        </div>
      </div>
    </div>
  `;

  const r = document.getElementById('restart-btn');
  if(r) r.addEventListener('click', () => applyFilter(state.filter));
  const a = document.getElementById('all-btn');
  if(a) a.addEventListener('click', () => applyFilter('all'));
  const w = document.getElementById('wrong-btn');
  if(w) w.addEventListener('click', () => applyFilter('wrong'));
  const mk = document.getElementById('marked-btn');
  if(mk) mk.addEventListener('click', () => applyFilter('marked'));
}


// ═══════════════════════════════════════════════════════
// FLASHCARDS
// ═══════════════════════════════════════════════════════
const flashContainer = document.getElementById('flash-container');

function currentCard(){
  return CARDS[state.fOrder[state.fIndex % state.fOrder.length]];
}

function renderFlash(){
  const c = currentCard();
  const total = CARDS.length;
  flashContainer.innerHTML = `
    <div class="flash-card ${state.fFlipped ? 'flipped' : ''}" id="fc">
      <div class="fc-head">
        <span class="fc-side">${state.fFlipped ? '← verso' : 'frente →'}</span>
        <span class="fc-counter">${(state.fIndex % total) + 1}/${total}</span>
      </div>
      <div class="fc-content">
        ${state.fFlipped ? `
          <div class="fc-back">
            <div class="fc-term-small">${c.t}</div>
            <div class="fc-def">${c.d}</div>
            <div class="fc-when"><strong>Quando usar:</strong> ${c.when}</div>
            ${c.trap ? `<div class="fc-trap"><strong>⚠️ Pegadinha:</strong> ${c.trap}</div>` : ''}
          </div>
        ` : `
          <div class="fc-front">
            <div class="fc-term">${c.t}</div>
            <div class="fc-hint">clica ou aperta <kbd>espaço</kbd> pra virar</div>
          </div>
        `}
      </div>
    </div>
    <div class="fc-controls">
      ${state.fFlipped ? `
        <button class="fc-btn review" id="fc-review">🔁 revisar de novo</button>
        <button class="fc-btn know" id="fc-know">✅ saquei essa</button>
      ` : `
        <button class="fc-btn" id="fc-prev">← anterior</button>
        <button class="fc-btn" id="fc-flip">virar carta</button>
        <button class="fc-btn" id="fc-next">próxima →</button>
      `}
    </div>
  `;

  document.getElementById('fc').addEventListener('click', flipCard);
  if(state.fFlipped){
    document.getElementById('fc-review').addEventListener('click', (e) => { e.stopPropagation(); nextCard(); });
    document.getElementById('fc-know').addEventListener('click', (e) => { e.stopPropagation(); nextCard(); });
  } else {
    document.getElementById('fc-prev').addEventListener('click', (e) => { e.stopPropagation(); prevCard(); });
    document.getElementById('fc-flip').addEventListener('click', (e) => { e.stopPropagation(); flipCard(); });
    document.getElementById('fc-next').addEventListener('click', (e) => { e.stopPropagation(); nextCard(); });
  }
}

function flipCard(){
  state.fFlipped = !state.fFlipped;
  saveState();
  renderFlash();
}
function nextCard(){
  state.fIndex++;
  state.fFlipped = false;
  saveState();
  renderFlash();
}
function prevCard(){
  state.fIndex = Math.max(0, state.fIndex - 1);
  state.fFlipped = false;
  saveState();
  renderFlash();
}


// ═══════════════════════════════════════════════════════
// SCORECARD
// ═══════════════════════════════════════════════════════
function updateScorecard(flashFire = false){
  document.getElementById('sc-answered').textContent = totalAnswered();
  document.getElementById('sc-total').textContent = QUESTIONS.length;
  document.getElementById('sc-acc').textContent = totalAnswered() > 0
    ? Math.round((totalCorrect() / totalAnswered()) * 100) + '%'
    : '—';

  const markedEl = document.getElementById('sc-marked');
  if(markedEl) markedEl.textContent = totalMarked();

  const streakEl = document.getElementById('sc-streak');
  streakEl.querySelector('.val').textContent = state.qStreak;
  if(flashFire && state.qStreak >= 3){
    streakEl.classList.remove('fire');
    void streakEl.offsetWidth;
    streakEl.classList.add('fire');
  }

  for(let d = 1; d <= 5; d++){
    const data = state.qByDomain[d];
    const pct = data.a > 0 ? Math.round((data.c / data.a) * 100) : 0;
    const el = document.querySelector('.sc-dom.d' + d);
    if(!el) continue;
    const bar = el.querySelector('.bar');
    if(bar) bar.style.setProperty('--p', pct + '%');
    el.title = `Domínio ${d}: ${data.c}/${data.a} acertos (${pct}%) · clica pra praticar só este`;
  }
}


// ═══════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});
function switchTab(name){
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.mode').forEach(m => m.classList.toggle('active', m.id === 'mode-' + name));
  state.mode = name;
  saveState();
  if(name === 'flash') renderFlash();
  if(name === 'quiz') renderQuiz();
}


// ═══════════════════════════════════════════════════════
// FILTERS BAR + DOMAIN BARS NAVIGATION
// ═══════════════════════════════════════════════════════
document.querySelectorAll('.filter-pill').forEach(p => {
  p.addEventListener('click', () => applyFilter(p.dataset.filter));
});
document.querySelectorAll('.sc-dom[data-dom]').forEach(b => {
  b.addEventListener('click', () => {
    switchTab('quiz');
    applyFilter('d' + b.dataset.dom);
  });
});
document.querySelectorAll('.ref-domain[data-dom]').forEach(b => {
  b.addEventListener('click', () => {
    switchTab('quiz');
    applyFilter('d' + b.dataset.dom);
  });
});


// ═══════════════════════════════════════════════════════
// RESET
// ═══════════════════════════════════════════════════════
document.getElementById('reset-btn').addEventListener('click', () => {
  if(confirm('Zerar todo o progresso e recomeçar do zero? (Marcadas, erradas e sequência serão perdidas.)')){
    state = initialState();
    state.onboardingDone = true; // não mostra de novo após reset
    saveState();
    applyFilter('all');
    renderFlash();
    updateScorecard();
  }
});


// ═══════════════════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════════════════
const ob = document.getElementById('onboarding');

function showOnboarding(step){
  state.onboardingStep = step || 1;
  ob.classList.remove('hidden');
  document.querySelectorAll('.ob-step').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.step) === state.onboardingStep);
  });
  document.querySelectorAll('.ob-dots .dot').forEach(d => {
    d.classList.toggle('active', parseInt(d.dataset.go) === state.onboardingStep);
  });
  const isLast = state.onboardingStep === 4;
  const nextBtn = document.getElementById('ob-next');
  if(nextBtn) nextBtn.textContent = isLast ? 'Bora começar 🐾' : 'Próximo →';
}

function dismissOnboarding(){
  ob.classList.add('hidden');
  state.onboardingDone = true;
  saveState();
}

document.getElementById('ob-close').addEventListener('click', dismissOnboarding);
document.getElementById('ob-skip').addEventListener('click', dismissOnboarding);
document.getElementById('ob-next').addEventListener('click', () => {
  if(state.onboardingStep >= 4){
    dismissOnboarding();
  } else {
    showOnboarding(state.onboardingStep + 1);
  }
});
document.querySelectorAll('.ob-dots .dot').forEach(d => {
  d.addEventListener('click', () => showOnboarding(parseInt(d.dataset.go)));
});


// ═══════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  // Onboarding aberto?
  if(!ob.classList.contains('hidden')){
    if(e.key === 'Escape') dismissOnboarding();
    else if(e.key === 'ArrowRight' || e.key === 'Enter'){
      if(state.onboardingStep >= 4) dismissOnboarding();
      else showOnboarding(state.onboardingStep + 1);
    } else if(e.key === 'ArrowLeft'){
      showOnboarding(Math.max(1, state.onboardingStep - 1));
    }
    return;
  }

  // ? abre ajuda
  if(e.key === '?'){
    switchTab('help');
    e.preventDefault();
    return;
  }

  if(state.mode === 'quiz'){
    const q = currentQuestion();
    if(!q) return;
    if(state.qLastAnswerIdx === -1){
      // ainda não respondeu
      if(e.key >= '1' && e.key <= '4'){
        const idx = parseInt(e.key) - 1;
        if(idx < q.opts.length){ answerQuestion(idx); e.preventDefault(); }
      } else if(e.key.toLowerCase() === 'm'){
        toggleMark(); e.preventDefault();
      } else if(e.key.toLowerCase() === 's'){
        skipQuestion(); e.preventDefault();
      }
    } else {
      // já respondeu — Enter ou espaço pra próxima
      if(e.key === 'Enter' || e.key === ' '){
        nextQuestion();
        e.preventDefault();
      } else if(e.key.toLowerCase() === 'm'){
        toggleMark(); e.preventDefault();
      }
    }
  } else if(state.mode === 'flash'){
    if(e.key === ' '){ flipCard(); e.preventDefault(); }
    else if(e.key === 'ArrowRight'){ nextCard(); e.preventDefault(); }
    else if(e.key === 'ArrowLeft'){ prevCard(); e.preventDefault(); }
  }
});


// ═══════════════════════════════════════════════════════
// DEEP-LINK via URL: ?d=3, ?mode=wrong, ?mode=marked, ?tab=flash
// ═══════════════════════════════════════════════════════
function handleDeepLink(){
  const params = new URLSearchParams(window.location.search);
  let didApplyFilter = false;

  if(params.has('d')){
    const d = params.get('d');
    if(['1','2','3','4','5'].includes(d)){
      state.filter = 'd' + d;
      didApplyFilter = true;
    }
  } else if(params.has('mode')){
    const m = params.get('mode');
    if(['wrong','marked','all'].includes(m)){
      state.filter = m;
      didApplyFilter = true;
    }
  }

  if(didApplyFilter){
    applyFilter(state.filter);
  }

  if(params.has('tab')){
    const t = params.get('tab');
    if(['quiz','flash','ref','help'].includes(t)){
      switchTab(t);
    }
  }
}


// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════
// Restaura aba ativa
if(state.mode && state.mode !== 'quiz'){
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === state.mode));
  document.querySelectorAll('.mode').forEach(m => m.classList.toggle('active', m.id === 'mode-' + state.mode));
}

renderFilters();
renderQuiz();
renderFlash();
updateScorecard();
handleDeepLink();

if(!state.onboardingDone){
  showOnboarding(1);
}
