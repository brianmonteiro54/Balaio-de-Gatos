/* ===== aula 9: Textract, Translate, Personalize, Fraud, Q, Lex, Titan, Nova, OpenSearch ===== */

// ============================================================
// MÓDULO 1: AMAZON TEXTRACT
// ============================================================
const txDocs = {
  receipt: {
    title: 'Recibo · padaria',
    render: () => `
      <rect x="60" y="40" width="480" height="720" fill="#FFF" stroke="#2B1810" stroke-width="2"/>
      <text x="300" y="100" text-anchor="middle" font-family="Caprasimo" font-size="28" fill="#2B1810">PADARIA DO GATO</text>
      <text x="300" y="130" text-anchor="middle" font-family="Sora" font-size="13" fill="#4A3528">Rua das Patinhas, 42 - SP</text>
      <text x="300" y="148" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="#4A3528">CNPJ 12.345.678/0001-90</text>
      <line x1="80" y1="170" x2="520" y2="170" stroke="#4A3528" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="80" y="200" font-family="JetBrains Mono" font-size="13" fill="#2B1810">Data: 28/05/2026   14:32</text>
      <text x="80" y="220" font-family="JetBrains Mono" font-size="13" fill="#2B1810">Cupom: #001234</text>
      <line x1="80" y1="240" x2="520" y2="240" stroke="#4A3528" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="80" y="280" font-family="Sora" font-size="13" fill="#2B1810">2x Pão francês</text>
      <text x="500" y="280" text-anchor="end" font-family="JetBrains Mono" font-size="13" fill="#2B1810">R$ 1,80</text>
      <text x="80" y="310" font-family="Sora" font-size="13" fill="#2B1810">1x Café com leite</text>
      <text x="500" y="310" text-anchor="end" font-family="JetBrains Mono" font-size="13" fill="#2B1810">R$ 6,50</text>
      <text x="80" y="340" font-family="Sora" font-size="13" fill="#2B1810">3x Bisnaguinha</text>
      <text x="500" y="340" text-anchor="end" font-family="JetBrains Mono" font-size="13" fill="#2B1810">R$ 4,20</text>
      <text x="80" y="370" font-family="Sora" font-size="13" fill="#2B1810">1x Pão de queijo</text>
      <text x="500" y="370" text-anchor="end" font-family="JetBrains Mono" font-size="13" fill="#2B1810">R$ 5,00</text>
      <line x1="80" y1="395" x2="520" y2="395" stroke="#4A3528" stroke-width="1" stroke-dasharray="4 3"/>
      <text x="80" y="430" font-family="Caprasimo" font-size="18" fill="#2B1810">SUBTOTAL</text>
      <text x="500" y="430" text-anchor="end" font-family="Caprasimo" font-size="18" fill="#2B1810">R$ 17,50</text>
      <text x="80" y="460" font-family="Sora" font-size="13" fill="#2B1810">Desconto 5%</text>
      <text x="500" y="460" text-anchor="end" font-family="JetBrains Mono" font-size="13" fill="#C73E1D">- R$ 0,88</text>
      <line x1="80" y1="480" x2="520" y2="480" stroke="#2B1810" stroke-width="2"/>
      <text x="80" y="520" font-family="Caprasimo" font-size="22" fill="#2B1810">TOTAL</text>
      <text x="500" y="520" text-anchor="end" font-family="Caprasimo" font-size="22" fill="#FF6B35">R$ 16,62</text>
      <text x="80" y="560" font-family="Sora" font-size="12" fill="#4A3528">Pagamento: PIX</text>
      <text x="80" y="580" font-family="Sora" font-size="12" fill="#4A3528">Atendente: Maria S.</text>
      <text x="300" y="650" text-anchor="middle" font-family="Caprasimo" font-size="14" fill="#FF6B35">🐾 Volte sempre, gato!</text>
    `,
    bboxes: {
      text: [
        { x: 90, y: 78, w: 420, h: 28, label: 'PADARIA DO GATO' },
        { x: 110, y: 178, w: 380, h: 50, label: 'Cabeçalho' },
        { x: 70, y: 260, w: 460, h: 130, label: 'Itens (linha por linha)' },
        { x: 70, y: 410, w: 460, h: 70, label: 'Subtotal/Desconto' },
        { x: 70, y: 500, w: 460, h: 30, label: 'Total' }
      ],
      forms: [],
      tables: [
        { x: 70, y: 260, w: 460, h: 140, label: 'TABLE: 4 rows × 3 cols (item, qty, price)', cls: 'cell' }
      ],
      expense: [
        { x: 90, y: 78, w: 420, h: 28, label: 'VENDOR_NAME', cls: 'expense' },
        { x: 110, y: 138, w: 380, h: 18, label: 'VENDOR_CNPJ', cls: 'expense' },
        { x: 110, y: 188, w: 200, h: 18, label: 'INVOICE_RECEIPT_DATE', cls: 'expense' },
        { x: 110, y: 208, w: 200, h: 18, label: 'INVOICE_RECEIPT_ID', cls: 'expense' },
        { x: 70, y: 510, w: 460, h: 22, label: 'TOTAL', cls: 'expense' },
        { x: 110, y: 548, w: 200, h: 18, label: 'PAYMENT_TERMS', cls: 'expense' }
      ],
      id: [],
      layout: [
        { x: 90, y: 78, w: 420, h: 80, label: 'TITLE / HEADER', cls: 'layout' },
        { x: 80, y: 188, w: 440, h: 60, label: 'TEXT (metadata)', cls: 'layout' },
        { x: 70, y: 260, w: 460, h: 140, label: 'TABLE', cls: 'layout' },
        { x: 70, y: 410, w: 460, h: 130, label: 'TEXT (total area)', cls: 'layout' },
        { x: 80, y: 555, w: 440, h: 30, label: 'TEXT (footer)', cls: 'layout' }
      ]
    },
    json: {
      text: `{
  "Blocks": [
    { "BlockType": "PAGE", "Id": "abc-001" },
    { "BlockType": "LINE", "Text": "PADARIA DO GATO", "Confidence": 99.4 },
    { "BlockType": "LINE", "Text": "Rua das Patinhas, 42 - SP", "Confidence": 98.8 },
    { "BlockType": "LINE", "Text": "Data: 28/05/2026   14:32", "Confidence": 99.1 },
    { "BlockType": "LINE", "Text": "2x Pão francês", "Confidence": 97.6 },
    { "BlockType": "LINE", "Text": "R$ 1,80", "Confidence": 99.3 },
    { "BlockType": "LINE", "Text": "TOTAL", "Confidence": 99.9 },
    { "BlockType": "LINE", "Text": "R$ 16,62", "Confidence": 99.7 }
  ]
}`,
      tables: `{
  "Blocks": [
    { "BlockType": "TABLE", "Id": "tbl-001",
      "Relationships": [{ "Type": "CHILD", "Ids": ["c-1", "c-2", ...] }] },
    { "BlockType": "CELL", "RowIndex": 1, "ColumnIndex": 1, "Text": "2x Pão francês" },
    { "BlockType": "CELL", "RowIndex": 1, "ColumnIndex": 2, "Text": "R$ 1,80" },
    { "BlockType": "CELL", "RowIndex": 2, "ColumnIndex": 1, "Text": "1x Café com leite" },
    { "BlockType": "CELL", "RowIndex": 2, "ColumnIndex": 2, "Text": "R$ 6,50" }
  ]
}`,
      expense: `{
  "ExpenseDocuments": [{
    "SummaryFields": [
      { "Type": { "Text": "VENDOR_NAME" },         "ValueDetection": { "Text": "PADARIA DO GATO", "Confidence": 99.4 }},
      { "Type": { "Text": "INVOICE_RECEIPT_DATE" },"ValueDetection": { "Text": "28/05/2026" }},
      { "Type": { "Text": "TOTAL" },               "ValueDetection": { "Text": "R$ 16,62" }},
      { "Type": { "Text": "PAYMENT_TERMS" },       "ValueDetection": { "Text": "PIX" }}
    ],
    "LineItemGroups": [{
      "LineItems": [
        { "ITEM": "Pão francês",   "QUANTITY": "2", "PRICE": "R$ 1,80" },
        { "ITEM": "Café com leite", "QUANTITY": "1", "PRICE": "R$ 6,50" }
      ]
    }]
  }]
}`
    }
  },
  form: {
    title: 'Formulário de cadastro',
    render: () => `
      <rect x="60" y="40" width="480" height="720" fill="#FFF" stroke="#2B1810" stroke-width="2"/>
      <text x="300" y="100" text-anchor="middle" font-family="Caprasimo" font-size="22" fill="#2B1810">FICHA DE CADASTRO</text>
      <text x="300" y="125" text-anchor="middle" font-family="Sora" font-size="13" fill="#4A3528">Petshop Bigode · Cliente novo</text>
      <line x1="80" y1="150" x2="520" y2="150" stroke="#2B1810" stroke-width="1.5"/>

      <text x="90" y="195" font-family="Sora" font-size="13" fill="#2B1810" font-weight="700">Nome completo:</text>
      <rect x="240" y="180" width="280" height="22" fill="#FBF3E2" stroke="#4A3528" stroke-width="1"/>
      <text x="248" y="196" font-family="Sora" font-size="13" fill="#2B1810">Maria Silva Souza</text>

      <text x="90" y="240" font-family="Sora" font-size="13" fill="#2B1810" font-weight="700">CPF:</text>
      <rect x="240" y="225" width="180" height="22" fill="#FBF3E2" stroke="#4A3528" stroke-width="1"/>
      <text x="248" y="241" font-family="JetBrains Mono" font-size="13" fill="#2B1810">123.456.789-00</text>

      <text x="90" y="285" font-family="Sora" font-size="13" fill="#2B1810" font-weight="700">Data de nascimento:</text>
      <rect x="240" y="270" width="160" height="22" fill="#FBF3E2" stroke="#4A3528" stroke-width="1"/>
      <text x="248" y="286" font-family="JetBrains Mono" font-size="13" fill="#2B1810">15/03/1989</text>

      <text x="90" y="330" font-family="Sora" font-size="13" fill="#2B1810" font-weight="700">Telefone:</text>
      <rect x="240" y="315" width="180" height="22" fill="#FBF3E2" stroke="#4A3528" stroke-width="1"/>
      <text x="248" y="331" font-family="JetBrains Mono" font-size="13" fill="#2B1810">(11) 98765-4321</text>

      <text x="90" y="375" font-family="Sora" font-size="13" fill="#2B1810" font-weight="700">Email:</text>
      <rect x="240" y="360" width="280" height="22" fill="#FBF3E2" stroke="#4A3528" stroke-width="1"/>
      <text x="248" y="376" font-family="Sora" font-size="13" fill="#2B1810">maria.silva@email.com</text>

      <text x="90" y="420" font-family="Sora" font-size="13" fill="#2B1810" font-weight="700">Pet:</text>
      <rect x="240" y="405" width="200" height="22" fill="#FBF3E2" stroke="#4A3528" stroke-width="1"/>
      <text x="248" y="421" font-family="Sora" font-size="13" fill="#2B1810">Felix - Gato Persa</text>

      <text x="90" y="465" font-family="Sora" font-size="13" fill="#2B1810" font-weight="700">Aceita receber promoções?</text>
      <rect x="280" y="455" width="20" height="20" fill="#FBF3E2" stroke="#2B1810" stroke-width="1.5"/>
      <text x="285" y="471" font-family="Sora" font-size="14" fill="#2B1810">✓</text>
      <text x="305" y="470" font-family="Sora" font-size="13" fill="#2B1810">Sim</text>
      <rect x="350" y="455" width="20" height="20" fill="#FBF3E2" stroke="#2B1810" stroke-width="1.5"/>
      <text x="375" y="470" font-family="Sora" font-size="13" fill="#2B1810">Não</text>

      <text x="90" y="515" font-family="Sora" font-size="13" fill="#2B1810" font-weight="700">Plano de assinatura:</text>
      <rect x="240" y="500" width="20" height="20" fill="#FBF3E2" stroke="#2B1810" stroke-width="1.5"/>
      <text x="265" y="515" font-family="Sora" font-size="13" fill="#2B1810">Básico</text>
      <rect x="320" y="500" width="20" height="20" fill="#FBF3E2" stroke="#2B1810" stroke-width="1.5"/>
      <text x="325" y="515" font-family="Sora" font-size="14" fill="#2B1810">✓</text>
      <text x="345" y="515" font-family="Sora" font-size="13" fill="#2B1810">Premium</text>
      <rect x="430" y="500" width="20" height="20" fill="#FBF3E2" stroke="#2B1810" stroke-width="1.5"/>
      <text x="455" y="515" font-family="Sora" font-size="13" fill="#2B1810">Gold</text>

      <line x1="80" y1="650" x2="280" y2="650" stroke="#4A3528" stroke-width="1"/>
      <text x="180" y="670" text-anchor="middle" font-family="Sora" font-size="11" fill="#4A3528">Assinatura</text>
      <line x1="320" y1="650" x2="520" y2="650" stroke="#4A3528" stroke-width="1"/>
      <text x="420" y="670" text-anchor="middle" font-family="Sora" font-size="11" fill="#4A3528">Data</text>
    `,
    bboxes: {
      text: [
        { x: 70, y: 178, w: 460, h: 28 },
        { x: 70, y: 223, w: 460, h: 28 },
        { x: 70, y: 268, w: 460, h: 28 },
        { x: 70, y: 313, w: 460, h: 28 },
        { x: 70, y: 358, w: 460, h: 28 },
        { x: 70, y: 403, w: 460, h: 28 },
        { x: 70, y: 448, w: 460, h: 32 }
      ],
      forms: [
        { x: 80, y: 180, w: 150, h: 22, label: 'KEY: Nome completo', cls: 'kv-key' },
        { x: 240, y: 180, w: 280, h: 22, label: 'VALUE', cls: 'kv-value' },
        { x: 80, y: 225, w: 80, h: 22, label: 'KEY: CPF', cls: 'kv-key' },
        { x: 240, y: 225, w: 180, h: 22, label: 'VALUE', cls: 'kv-value' },
        { x: 80, y: 270, w: 150, h: 22, label: 'KEY: Data nasc.', cls: 'kv-key' },
        { x: 240, y: 270, w: 160, h: 22, label: 'VALUE', cls: 'kv-value' },
        { x: 80, y: 315, w: 80, h: 22, label: 'KEY: Telefone', cls: 'kv-key' },
        { x: 240, y: 315, w: 180, h: 22, label: 'VALUE', cls: 'kv-value' },
        { x: 80, y: 360, w: 80, h: 22, label: 'KEY: Email', cls: 'kv-key' },
        { x: 240, y: 360, w: 280, h: 22, label: 'VALUE', cls: 'kv-value' },
        { x: 80, y: 405, w: 80, h: 22, label: 'KEY: Pet', cls: 'kv-key' },
        { x: 240, y: 405, w: 200, h: 22, label: 'VALUE', cls: 'kv-value' },
        { x: 280, y: 455, w: 20, h: 20, label: 'CHECKBOX: SELECTED', cls: 'kv-key' },
        { x: 320, y: 500, w: 20, h: 20, label: 'CHECKBOX: SELECTED', cls: 'kv-key' }
      ],
      tables: [],
      expense: [],
      id: [],
      layout: [
        { x: 80, y: 80, w: 440, h: 70, label: 'TITLE', cls: 'layout' },
        { x: 70, y: 165, w: 460, h: 280, label: 'KEY_VALUE_GROUP', cls: 'layout' },
        { x: 70, y: 445, w: 460, h: 90, label: 'CHECKBOX_GROUP', cls: 'layout' },
        { x: 80, y: 640, w: 440, h: 50, label: 'SIGNATURE_AREA', cls: 'layout' }
      ]
    },
    json: {
      forms: `{
  "Blocks": [
    { "BlockType": "KEY_VALUE_SET", "EntityTypes": ["KEY"],
      "Text": "Nome completo:", "Confidence": 99.1 },
    { "BlockType": "KEY_VALUE_SET", "EntityTypes": ["VALUE"],
      "Text": "Maria Silva Souza", "Confidence": 98.7 },

    { "BlockType": "KEY_VALUE_SET", "EntityTypes": ["KEY"], "Text": "CPF:" },
    { "BlockType": "KEY_VALUE_SET", "EntityTypes": ["VALUE"], "Text": "123.456.789-00" },

    { "BlockType": "SELECTION_ELEMENT",
      "SelectionStatus": "SELECTED", "Confidence": 99.0 },

    { "BlockType": "KEY_VALUE_SET", "EntityTypes": ["KEY"],
      "Text": "Plano de assinatura:" },
    { "BlockType": "KEY_VALUE_SET", "EntityTypes": ["VALUE"], "Text": "Premium" }
  ]
}`,
      text: `{ "Blocks": [ /* ...LINE/WORD blocks... */ ] }`,
      layout: `{
  "Blocks": [
    { "BlockType": "LAYOUT_TITLE", "Text": "FICHA DE CADASTRO" },
    { "BlockType": "LAYOUT_KEY_VALUE_GROUP" },
    { "BlockType": "LAYOUT_TEXT" }
  ]
}`
    }
  },
  invoice: {
    title: 'Nota fiscal',
    render: () => `
      <rect x="60" y="40" width="480" height="720" fill="#FFF" stroke="#2B1810" stroke-width="2"/>
      <text x="300" y="90" text-anchor="middle" font-family="Caprasimo" font-size="20" fill="#2B1810">NOTA FISCAL ELETRÔNICA</text>
      <rect x="80" y="105" width="440" height="90" fill="#F5E9CF" stroke="#2B1810" stroke-width="1.5"/>
      <text x="90" y="125" font-family="Sora" font-size="11" font-weight="700" fill="#2B1810">EMITENTE</text>
      <text x="90" y="143" font-family="Sora" font-size="13" fill="#2B1810">Petshop Bigode Ltda</text>
      <text x="90" y="160" font-family="JetBrains Mono" font-size="11" fill="#4A3528">CNPJ: 12.345.678/0001-90</text>
      <text x="90" y="177" font-family="Sora" font-size="11" fill="#4A3528">R. das Patinhas, 42 - São Paulo, SP</text>

      <rect x="80" y="210" width="440" height="80" fill="#FBD9C5" stroke="#2B1810" stroke-width="1.5"/>
      <text x="90" y="230" font-family="Sora" font-size="11" font-weight="700" fill="#2B1810">DESTINATÁRIO</text>
      <text x="90" y="248" font-family="Sora" font-size="13" fill="#2B1810">Maria Silva Souza</text>
      <text x="90" y="265" font-family="JetBrains Mono" font-size="11" fill="#4A3528">CPF: 123.456.789-00</text>
      <text x="90" y="282" font-family="Sora" font-size="11" fill="#4A3528">R. dos Gatos, 7 - São Paulo, SP</text>

      <text x="90" y="320" font-family="Sora" font-size="11" font-weight="700" fill="#2B1810">Nº NF: 000.123.456</text>
      <text x="350" y="320" font-family="Sora" font-size="11" font-weight="700" fill="#2B1810">Emissão: 28/05/2026</text>

      <line x1="80" y1="345" x2="520" y2="345" stroke="#2B1810" stroke-width="1.5"/>
      <text x="90" y="370" font-family="Sora" font-size="11" font-weight="700" fill="#2B1810">CÓDIGO</text>
      <text x="200" y="370" font-family="Sora" font-size="11" font-weight="700" fill="#2B1810">DESCRIÇÃO</text>
      <text x="380" y="370" font-family="Sora" font-size="11" font-weight="700" fill="#2B1810">QTD</text>
      <text x="450" y="370" font-family="Sora" font-size="11" font-weight="700" fill="#2B1810">TOTAL</text>
      <line x1="80" y1="380" x2="520" y2="380" stroke="#4A3528" stroke-width="1"/>

      <text x="90" y="405" font-family="JetBrains Mono" font-size="11" fill="#2B1810">PRD-001</text>
      <text x="200" y="405" font-family="Sora" font-size="11" fill="#2B1810">Ração Gato Premium 3kg</text>
      <text x="395" y="405" text-anchor="middle" font-family="Sora" font-size="11" fill="#2B1810">2</text>
      <text x="510" y="405" text-anchor="end" font-family="JetBrains Mono" font-size="11" fill="#2B1810">R$ 178,00</text>

      <text x="90" y="430" font-family="JetBrains Mono" font-size="11" fill="#2B1810">PRD-007</text>
      <text x="200" y="430" font-family="Sora" font-size="11" fill="#2B1810">Areia Sanitária 12kg</text>
      <text x="395" y="430" text-anchor="middle" font-family="Sora" font-size="11" fill="#2B1810">1</text>
      <text x="510" y="430" text-anchor="end" font-family="JetBrains Mono" font-size="11" fill="#2B1810">R$ 45,00</text>

      <text x="90" y="455" font-family="JetBrains Mono" font-size="11" fill="#2B1810">PRD-014</text>
      <text x="200" y="455" font-family="Sora" font-size="11" fill="#2B1810">Brinquedo Mouse</text>
      <text x="395" y="455" text-anchor="middle" font-family="Sora" font-size="11" fill="#2B1810">3</text>
      <text x="510" y="455" text-anchor="end" font-family="JetBrains Mono" font-size="11" fill="#2B1810">R$ 27,00</text>

      <line x1="80" y1="475" x2="520" y2="475" stroke="#4A3528" stroke-width="1"/>
      <text x="350" y="510" font-family="Sora" font-size="13" fill="#2B1810">Subtotal:</text>
      <text x="510" y="510" text-anchor="end" font-family="JetBrains Mono" font-size="13" fill="#2B1810">R$ 250,00</text>
      <text x="350" y="535" font-family="Sora" font-size="13" fill="#2B1810">ICMS (18%):</text>
      <text x="510" y="535" text-anchor="end" font-family="JetBrains Mono" font-size="13" fill="#2B1810">R$ 45,00</text>
      <line x1="350" y1="555" x2="520" y2="555" stroke="#2B1810" stroke-width="1.5"/>
      <text x="350" y="585" font-family="Caprasimo" font-size="20" fill="#2B1810">TOTAL</text>
      <text x="510" y="585" text-anchor="end" font-family="Caprasimo" font-size="22" fill="#FF6B35">R$ 295,00</text>

      <rect x="80" y="620" width="440" height="80" fill="#DDEEEC" stroke="#2B1810" stroke-width="1.5"/>
      <text x="90" y="640" font-family="Sora" font-size="11" font-weight="700" fill="#2B1810">CHAVE DE ACESSO</text>
      <text x="90" y="660" font-family="JetBrains Mono" font-size="10" fill="#4A3528">35 2605 12345678000190 55 001 000123456 1234567890</text>
      <text x="90" y="685" font-family="Sora" font-size="11" font-weight="700" fill="#2B1810">PROTOCOLO: 1352605012345</text>
    `,
    bboxes: {
      text: [
        { x: 80, y: 105, w: 440, h: 90 },
        { x: 80, y: 210, w: 440, h: 80 },
        { x: 80, y: 350, w: 440, h: 130 }
      ],
      forms: [
        { x: 80, y: 105, w: 440, h: 90, label: 'EMITENTE block', cls: 'kv-key' },
        { x: 80, y: 210, w: 440, h: 80, label: 'DESTINATÁRIO block', cls: 'kv-value' }
      ],
      tables: [
        { x: 80, y: 360, w: 440, h: 110, label: 'TABLE: 3 itens', cls: 'cell' }
      ],
      expense: [
        { x: 90, y: 130, w: 200, h: 18, label: 'VENDOR_NAME', cls: 'expense' },
        { x: 90, y: 148, w: 200, h: 14, label: 'VENDOR_TAX_ID', cls: 'expense' },
        { x: 90, y: 240, w: 200, h: 18, label: 'CUSTOMER_NAME', cls: 'expense' },
        { x: 90, y: 256, w: 200, h: 14, label: 'CUSTOMER_TAX_ID', cls: 'expense' },
        { x: 90, y: 312, w: 160, h: 14, label: 'INVOICE_NUMBER', cls: 'expense' },
        { x: 350, y: 312, w: 170, h: 14, label: 'INVOICE_DATE', cls: 'expense' },
        { x: 80, y: 360, w: 440, h: 110, label: 'LINE_ITEMS', cls: 'expense' },
        { x: 350, y: 525, w: 170, h: 14, label: 'TAX', cls: 'expense' },
        { x: 350, y: 575, w: 170, h: 22, label: 'TOTAL', cls: 'expense' }
      ],
      id: [],
      layout: [
        { x: 80, y: 75, w: 440, h: 30, label: 'TITLE', cls: 'layout' },
        { x: 80, y: 100, w: 440, h: 95, label: 'TEXT BLOCK (emitente)', cls: 'layout' },
        { x: 80, y: 205, w: 440, h: 85, label: 'TEXT BLOCK (destinatário)', cls: 'layout' },
        { x: 80, y: 350, w: 440, h: 130, label: 'TABLE', cls: 'layout' },
        { x: 80, y: 490, w: 440, h: 110, label: 'TEXT (totais)', cls: 'layout' },
        { x: 80, y: 615, w: 440, h: 90, label: 'FOOTER', cls: 'layout' }
      ]
    },
    json: {
      expense: `{
  "ExpenseDocuments": [{
    "SummaryFields": [
      { "Type": "VENDOR_NAME",       "Value": "Petshop Bigode Ltda" },
      { "Type": "VENDOR_TAX_ID",     "Value": "12.345.678/0001-90" },
      { "Type": "CUSTOMER_NAME",     "Value": "Maria Silva Souza" },
      { "Type": "CUSTOMER_TAX_ID",   "Value": "123.456.789-00" },
      { "Type": "INVOICE_NUMBER",    "Value": "000.123.456" },
      { "Type": "INVOICE_DATE",      "Value": "28/05/2026" },
      { "Type": "TAX",               "Value": "R$ 45,00" },
      { "Type": "TOTAL",             "Value": "R$ 295,00" }
    ],
    "LineItemGroups": [{
      "LineItems": [
        { "ITEM": "Ração Gato Premium 3kg", "QUANTITY": "2", "PRICE": "R$ 178,00" },
        { "ITEM": "Areia Sanitária 12kg",   "QUANTITY": "1", "PRICE": "R$ 45,00" },
        { "ITEM": "Brinquedo Mouse",        "QUANTITY": "3", "PRICE": "R$ 27,00" }
      ]
    }]
  }]
}`
    }
  },
  id: {
    title: 'Documento de identidade',
    render: () => `
      <rect x="60" y="100" width="480" height="320" rx="14" fill="#DDEEEC" stroke="#2B1810" stroke-width="2.5"/>
      <text x="300" y="135" text-anchor="middle" font-family="Caprasimo" font-size="20" fill="#2B1810">CARTEIRA NACIONAL DE HABILITAÇÃO</text>
      <text x="300" y="160" text-anchor="middle" font-family="Sora" font-size="12" fill="#4A3528">REPÚBLICA FEDERATIVA DO BRASIL</text>

      <rect x="80" y="180" width="100" height="130" rx="8" fill="#FBF3E2" stroke="#2B1810" stroke-width="1.5"/>
      <text x="130" y="250" text-anchor="middle" font-size="50">😼</text>
      <text x="130" y="295" text-anchor="middle" font-family="Sora" font-size="9" fill="#4A3528">FOTO 3x4</text>

      <text x="200" y="200" font-family="Sora" font-size="10" font-weight="700" fill="#4A3528">NOME</text>
      <text x="200" y="218" font-family="Caprasimo" font-size="16" fill="#2B1810">MARIA SILVA SOUZA</text>

      <text x="200" y="245" font-family="Sora" font-size="10" font-weight="700" fill="#4A3528">DOC. IDENT./ÓRG. EMISSOR/UF</text>
      <text x="200" y="262" font-family="JetBrains Mono" font-size="13" fill="#2B1810">12.345.678-9 SSP/SP</text>

      <text x="200" y="285" font-family="Sora" font-size="10" font-weight="700" fill="#4A3528">CPF</text>
      <text x="200" y="302" font-family="JetBrains Mono" font-size="13" fill="#2B1810">123.456.789-00</text>

      <text x="200" y="325" font-family="Sora" font-size="10" font-weight="700" fill="#4A3528">DATA NASCIMENTO</text>
      <text x="200" y="342" font-family="JetBrains Mono" font-size="13" fill="#2B1810">15/03/1989</text>

      <text x="380" y="285" font-family="Sora" font-size="10" font-weight="700" fill="#4A3528">CATEGORIA</text>
      <text x="380" y="305" font-family="Caprasimo" font-size="22" fill="#FF6B35">B</text>

      <text x="80" y="370" font-family="Sora" font-size="10" font-weight="700" fill="#4A3528">VALIDADE</text>
      <text x="80" y="388" font-family="JetBrains Mono" font-size="13" fill="#2B1810">15/03/2030</text>

      <text x="280" y="370" font-family="Sora" font-size="10" font-weight="700" fill="#4A3528">PRIMEIRA HAB.</text>
      <text x="280" y="388" font-family="JetBrains Mono" font-size="13" fill="#2B1810">10/04/2008</text>

      <text x="430" y="370" font-family="Sora" font-size="10" font-weight="700" fill="#4A3528">N° REGISTRO</text>
      <text x="430" y="388" font-family="JetBrains Mono" font-size="11" fill="#2B1810">04231598742</text>
    `,
    bboxes: {
      text: [
        { x: 80, y: 120, w: 440, h: 40 },
        { x: 200, y: 195, w: 320, h: 30 },
        { x: 200, y: 240, w: 200, h: 30 },
        { x: 200, y: 280, w: 200, h: 30 },
        { x: 200, y: 320, w: 200, h: 30 },
        { x: 80, y: 365, w: 200, h: 30 }
      ],
      forms: [],
      tables: [],
      expense: [],
      id: [
        { x: 200, y: 195, w: 320, h: 30, label: 'NAME', cls: 'id' },
        { x: 200, y: 240, w: 220, h: 30, label: 'DOCUMENT_NUMBER', cls: 'id' },
        { x: 200, y: 280, w: 220, h: 30, label: 'CUSTOM: CPF', cls: 'id' },
        { x: 200, y: 320, w: 220, h: 30, label: 'DATE_OF_BIRTH', cls: 'id' },
        { x: 380, y: 280, w: 60, h: 30, label: 'CLASS', cls: 'id' },
        { x: 80, y: 365, w: 200, h: 30, label: 'EXPIRATION_DATE', cls: 'id' },
        { x: 280, y: 365, w: 140, h: 30, label: 'DATE_OF_ISSUE', cls: 'id' },
        { x: 80, y: 175, w: 110, h: 140, label: 'FACE', cls: 'id' }
      ],
      layout: [
        { x: 80, y: 120, w: 440, h: 280, label: 'IDENTITY_CARD', cls: 'layout' }
      ]
    },
    json: {
      id: `{
  "IdentityDocuments": [{
    "DocumentMetadata": { "Pages": 1 },
    "IdentityDocumentFields": [
      { "Type": { "Text": "FIRST_NAME" },
        "ValueDetection": { "Text": "MARIA", "Confidence": 99.0 }},
      { "Type": { "Text": "LAST_NAME" },
        "ValueDetection": { "Text": "SILVA SOUZA", "Confidence": 98.6 }},
      { "Type": { "Text": "DOCUMENT_NUMBER" },
        "ValueDetection": { "Text": "12.345.678-9", "Confidence": 99.4 }},
      { "Type": { "Text": "DATE_OF_BIRTH" },
        "ValueDetection": { "Text": "15/03/1989" }},
      { "Type": { "Text": "DATE_OF_ISSUE" },
        "ValueDetection": { "Text": "10/04/2008" }},
      { "Type": { "Text": "EXPIRATION_DATE" },
        "ValueDetection": { "Text": "15/03/2030" }},
      { "Type": { "Text": "CLASS" },
        "ValueDetection": { "Text": "B" }},
      { "Type": { "Text": "PLACE_OF_BIRTH" }, "ValueDetection": { "Text": "" }}
    ]
  }]
}`,
      text: `{ "Blocks": [/* ...LINE / WORD blocks... */] }`
    }
  },
  table: {
    title: 'Tabela financeira',
    render: () => `
      <rect x="60" y="40" width="480" height="720" fill="#FFF" stroke="#2B1810" stroke-width="2"/>
      <text x="300" y="90" text-anchor="middle" font-family="Caprasimo" font-size="22" fill="#2B1810">RELATÓRIO TRIMESTRAL</text>
      <text x="300" y="115" text-anchor="middle" font-family="Sora" font-size="13" fill="#4A3528">Vendas por região · Q1 2026</text>

      <rect x="80" y="160" width="440" height="32" fill="#2B1810"/>
      <text x="120" y="180" text-anchor="middle" font-family="Sora" font-size="13" font-weight="700" fill="#FFF9EC">Região</text>
      <text x="220" y="180" text-anchor="middle" font-family="Sora" font-size="13" font-weight="700" fill="#FFF9EC">Janeiro</text>
      <text x="320" y="180" text-anchor="middle" font-family="Sora" font-size="13" font-weight="700" fill="#FFF9EC">Fevereiro</text>
      <text x="420" y="180" text-anchor="middle" font-family="Sora" font-size="13" font-weight="700" fill="#FFF9EC">Março</text>
      <text x="500" y="180" text-anchor="middle" font-family="Sora" font-size="13" font-weight="700" fill="#FFF9EC">Total</text>

      ${['Sudeste', 'Sul', 'Nordeste', 'Centro-O.', 'Norte'].map((reg, i) => {
        const y = 215 + i * 35;
        const bg = i % 2 === 0 ? '#FBF3E2' : '#FFF9EC';
        const vals = [
          [120000, 145000, 132000],
          [85000, 92000, 78000],
          [62000, 71000, 65000],
          [38000, 42000, 41000],
          [25000, 28000, 22000]
        ][i];
        const total = vals.reduce((a, b) => a + b, 0);
        return `
          <rect x="80" y="${y - 18}" width="440" height="30" fill="${bg}" stroke="#4A3528" stroke-width="0.5"/>
          <text x="120" y="${y}" text-anchor="middle" font-family="Sora" font-size="13" fill="#2B1810">${reg}</text>
          <text x="220" y="${y}" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="#2B1810">${vals[0].toLocaleString()}</text>
          <text x="320" y="${y}" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="#2B1810">${vals[1].toLocaleString()}</text>
          <text x="420" y="${y}" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="#2B1810">${vals[2].toLocaleString()}</text>
          <text x="500" y="${y}" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="#FF6B35" font-weight="700">${total.toLocaleString()}</text>
        `;
      }).join('')}

      <rect x="80" y="394" width="440" height="32" fill="#FF6B35"/>
      <text x="120" y="414" text-anchor="middle" font-family="Caprasimo" font-size="13" fill="#FFF9EC">TOTAL</text>
      <text x="220" y="414" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="#FFF9EC" font-weight="700">330.000</text>
      <text x="320" y="414" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="#FFF9EC" font-weight="700">378.000</text>
      <text x="420" y="414" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="#FFF9EC" font-weight="700">338.000</text>
      <text x="500" y="414" text-anchor="middle" font-family="JetBrains Mono" font-size="13" fill="#F4D35E" font-weight="700">1.046.000</text>
    `,
    bboxes: {
      text: [
        { x: 80, y: 70, w: 440, h: 65 },
        { x: 80, y: 160, w: 440, h: 270 }
      ],
      forms: [],
      tables: [
        { x: 80, y: 160, w: 440, h: 270, label: 'TABLE: 6 rows × 5 cols (com header)', cls: 'cell' }
      ],
      expense: [],
      id: [],
      layout: [
        { x: 80, y: 70, w: 440, h: 65, label: 'TITLE', cls: 'layout' },
        { x: 80, y: 160, w: 440, h: 270, label: 'TABLE', cls: 'layout' }
      ]
    },
    json: {
      tables: `{
  "Blocks": [
    { "BlockType": "TABLE", "Id": "tbl-001", "RowCount": 6, "ColumnCount": 5 },
    { "BlockType": "CELL", "RowIndex": 1, "ColumnIndex": 1, "Text": "Região", "EntityTypes": ["COLUMN_HEADER"] },
    { "BlockType": "CELL", "RowIndex": 1, "ColumnIndex": 2, "Text": "Janeiro", "EntityTypes": ["COLUMN_HEADER"] },
    { "BlockType": "CELL", "RowIndex": 2, "ColumnIndex": 1, "Text": "Sudeste" },
    { "BlockType": "CELL", "RowIndex": 2, "ColumnIndex": 2, "Text": "120.000" },
    { "BlockType": "CELL", "RowIndex": 6, "ColumnIndex": 5, "Text": "1.046.000",
      "EntityTypes": ["COLUMN_HEADER", "ROW_HEADER"] }
  ]
}`
    }
  }
};

const txApiInfo = {
  text: {
    title: '🔤 DetectDocumentText',
    desc: 'O OCR cru. Devolve cada linha e palavra com bounding box e confiança. Não tenta entender estrutura. Use quando você só precisa do texto.',
    available: ['receipt', 'form', 'invoice', 'id', 'table']
  },
  forms: {
    title: '📋 AnalyzeDocument · FORMS',
    desc: 'Detecta pares <strong>chave:valor</strong> em formulários. Também reconhece <strong>checkboxes</strong> (SelectionElement com SELECTED/NOT_SELECTED).',
    available: ['form']
  },
  tables: {
    title: '📊 AnalyzeDocument · TABLES',
    desc: 'Reconstrói tabelas: linhas, colunas, células, headers. Útil pra CSVs implícitos em PDFs.',
    available: ['receipt', 'invoice', 'table']
  },
  expense: {
    title: '💰 AnalyzeExpense',
    desc: 'API especializada em recibos e notas fiscais. Já vem com campos pré-mapeados: VENDOR_NAME, TOTAL, INVOICE_DATE, TAX, etc. + line items.',
    available: ['receipt', 'invoice']
  },
  id: {
    title: '🪪 AnalyzeID',
    desc: 'Especializada em documentos de identidade (CNH, RG, passaporte, driver license). Campos: NAME, DOB, EXPIRATION_DATE, DOCUMENT_NUMBER, CLASS, FACE bounding box.',
    available: ['id']
  },
  layout: {
    title: '📐 AnalyzeDocument · LAYOUT',
    desc: 'Análise de layout: identifica TITLE, HEADER, FOOTER, TEXT, TABLE, FIGURE, KEY_VALUE, FOOTNOTE. Útil pra alimentar RAG (chunking semântico).',
    available: ['receipt', 'form', 'invoice', 'id', 'table']
  }
};

let txCurrentDoc = 'receipt';
let txCurrentApi = 'text';

function txRender() {
  const doc = txDocs[txCurrentDoc];
  document.getElementById('tx-doc-svg').innerHTML = doc.render();
  // hide overlay until "process" pressed
}

function txProcess() {
  const doc = txDocs[txCurrentDoc];
  const svg = document.getElementById('tx-doc-svg');
  // re-render base
  svg.innerHTML = doc.render();
  // get bboxes for current API
  const bboxes = doc.bboxes[txCurrentApi] || [];
  if (bboxes.length === 0) {
    document.getElementById('tx-status').textContent = '⚠️ Esta API não se aplica a esse documento';
    return;
  }
  document.getElementById('tx-status').textContent = `✅ ${bboxes.length} blocos detectados`;
  // animate bbox appearance
  bboxes.forEach((b, idx) => {
    setTimeout(() => {
      const cls = b.cls || '';
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', b.x);
      rect.setAttribute('y', b.y);
      rect.setAttribute('width', b.w);
      rect.setAttribute('height', b.h);
      rect.setAttribute('rx', '3');
      rect.setAttribute('class', `tx-bbox ${cls}`);
      svg.appendChild(rect);
      requestAnimationFrame(() => rect.classList.add('visible'));

      if (b.label) {
        const labelW = b.label.length * 6.5 + 14;
        const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        labelBg.setAttribute('x', b.x);
        labelBg.setAttribute('y', Math.max(0, b.y - 16));
        labelBg.setAttribute('width', labelW);
        labelBg.setAttribute('height', 14);
        labelBg.setAttribute('rx', 3);
        const fillColor =
          cls === 'kv-key' ? '#8A6FB1' :
          cls === 'kv-value' ? '#6B8E23' :
          cls === 'cell' ? '#5C8D89' :
          cls === 'expense' ? '#C73E1D' :
          cls === 'id' ? '#8A6FB1' :
          cls === 'layout' ? '#F4D35E' :
          '#FF6B35';
        labelBg.setAttribute('fill', fillColor);
        labelBg.setAttribute('opacity', '0');
        labelBg.style.transition = 'opacity 0.4s';
        svg.appendChild(labelBg);
        const labelTx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelTx.setAttribute('x', b.x + 6);
        labelTx.setAttribute('y', Math.max(0, b.y - 5));
        labelTx.setAttribute('class', 'tx-bbox-label');
        labelTx.setAttribute('fill', cls === 'layout' ? '#2B1810' : '#FFF9EC');
        labelTx.textContent = b.label;
        svg.appendChild(labelTx);
        requestAnimationFrame(() => {
          labelBg.setAttribute('opacity', '0.95');
          labelTx.classList.add('visible');
        });
      }
    }, 80 * idx);
  });

  // update json output
  const json = doc.json[txCurrentApi] || `{ "Note": "Esta API não retorna estrutura especial para este tipo de documento." }`;
  // simple syntax highlight
  const highlighted = json
    .replace(/("[\w_]+")\s*:/g, '<span class="k">$1</span>:')
    .replace(/:\s*("([^"]*)")/g, ': <span class="s">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="n">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '<span class="c">$1</span>');
  document.getElementById('tx-out-json').innerHTML = highlighted;

  // update explain
  const info = txApiInfo[txCurrentApi];
  document.getElementById('tx-explain-title').textContent = info.title;
  document.getElementById('tx-explain-desc').innerHTML = info.desc;
}

document.querySelectorAll('#tx-doc-picker .tx-doc-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('#tx-doc-picker .tx-doc-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    txCurrentDoc = b.dataset.doc;
    document.getElementById('tx-status').textContent = '⏸️ Pronto. Clica em "Processar".';
    txRender();
  });
});

document.querySelectorAll('#tx-api-picker .tx-api-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('#tx-api-picker .tx-api-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    txCurrentApi = b.dataset.api;
    document.getElementById('tx-status').textContent = '⏸️ API trocada. Clica em "Processar".';
    txRender();
  });
});

document.getElementById('tx-process').addEventListener('click', () => {
  document.getElementById('tx-status').textContent = '⏳ Processando…';
  setTimeout(txProcess, 350);
});
document.getElementById('tx-clear').addEventListener('click', () => {
  txRender();
  document.getElementById('tx-status').textContent = '⏸️ Limpo';
  document.getElementById('tx-out-json').innerHTML = '<span class="c"># Clica em "Processar documento" pra ver a saída</span>';
});

// === Preenchimento de JSONs faltantes ou placeholder ===
txDocs.receipt.json.layout = `{
  "Blocks": [
    { "BlockType": "LAYOUT_TITLE",  "Text": "PADARIA DO GATO", "Confidence": 99.4 },
    { "BlockType": "LAYOUT_TEXT",   "Text": "Data: 28/05/2026 · Cupom: #001234", "Confidence": 98.7 },
    { "BlockType": "LAYOUT_TABLE",  "Confidence": 97.2 },
    { "BlockType": "LAYOUT_TEXT",   "Text": "Subtotal R$ 17,50 · TOTAL R$ 16,62", "Confidence": 99.5 },
    { "BlockType": "LAYOUT_TEXT",   "Text": "Pagamento: PIX · Atendente: Maria S.", "Confidence": 98.3 }
  ]
}`;

txDocs.form.json.text = `{
  "Blocks": [
    { "BlockType": "PAGE", "Id": "p-001" },
    { "BlockType": "LINE", "Text": "FICHA DE CADASTRO", "Confidence": 99.5 },
    { "BlockType": "LINE", "Text": "Petshop Bigode · Cliente novo", "Confidence": 98.7 },
    { "BlockType": "LINE", "Text": "Nome completo: Maria Silva Souza", "Confidence": 99.2 },
    { "BlockType": "LINE", "Text": "CPF: 123.456.789-00", "Confidence": 99.4 },
    { "BlockType": "LINE", "Text": "Data de nascimento: 15/03/1989", "Confidence": 98.9 },
    { "BlockType": "LINE", "Text": "Telefone: (11) 98765-4321", "Confidence": 99.1 },
    { "BlockType": "LINE", "Text": "Email: maria.silva@email.com", "Confidence": 98.6 },
    { "BlockType": "LINE", "Text": "Pet: Felix - Gato Persa", "Confidence": 99.0 },
    { "BlockType": "LINE", "Text": "Plano: Premium", "Confidence": 99.3 }
  ]
}`;

txDocs.invoice.json.text = `{
  "Blocks": [
    { "BlockType": "PAGE", "Id": "p-001" },
    { "BlockType": "LINE", "Text": "NOTA FISCAL ELETRÔNICA", "Confidence": 99.7 },
    { "BlockType": "LINE", "Text": "Petshop Bigode Ltda", "Confidence": 99.4 },
    { "BlockType": "LINE", "Text": "CNPJ: 12.345.678/0001-90", "Confidence": 99.5 },
    { "BlockType": "LINE", "Text": "Maria Silva Souza", "Confidence": 99.2 },
    { "BlockType": "LINE", "Text": "CPF: 123.456.789-00", "Confidence": 99.5 },
    { "BlockType": "LINE", "Text": "Nº NF: 000.123.456", "Confidence": 99.3 },
    { "BlockType": "LINE", "Text": "Emissão: 28/05/2026", "Confidence": 99.4 },
    { "BlockType": "LINE", "Text": "Ração Gato Premium 3kg · 2 · R$ 178,00", "Confidence": 98.8 },
    { "BlockType": "LINE", "Text": "Areia Sanitária 12kg · 1 · R$ 45,00", "Confidence": 98.7 },
    { "BlockType": "LINE", "Text": "Brinquedo Mouse · 3 · R$ 27,00", "Confidence": 98.9 },
    { "BlockType": "LINE", "Text": "TOTAL R$ 295,00", "Confidence": 99.8 },
    { "BlockType": "LINE", "Text": "PROTOCOLO: 1352605012345", "Confidence": 99.1 }
  ]
}`;

txDocs.invoice.json.tables = `{
  "Blocks": [
    { "BlockType": "TABLE", "Id": "tbl-001", "RowCount": 4, "ColumnCount": 4 },
    { "BlockType": "CELL", "RowIndex": 1, "ColumnIndex": 1, "Text": "CÓDIGO",    "EntityTypes": ["COLUMN_HEADER"] },
    { "BlockType": "CELL", "RowIndex": 1, "ColumnIndex": 2, "Text": "DESCRIÇÃO", "EntityTypes": ["COLUMN_HEADER"] },
    { "BlockType": "CELL", "RowIndex": 1, "ColumnIndex": 3, "Text": "QTD",       "EntityTypes": ["COLUMN_HEADER"] },
    { "BlockType": "CELL", "RowIndex": 1, "ColumnIndex": 4, "Text": "TOTAL",     "EntityTypes": ["COLUMN_HEADER"] },
    { "BlockType": "CELL", "RowIndex": 2, "ColumnIndex": 1, "Text": "PRD-001" },
    { "BlockType": "CELL", "RowIndex": 2, "ColumnIndex": 2, "Text": "Ração Gato Premium 3kg" },
    { "BlockType": "CELL", "RowIndex": 2, "ColumnIndex": 3, "Text": "2" },
    { "BlockType": "CELL", "RowIndex": 2, "ColumnIndex": 4, "Text": "R$ 178,00" },
    { "BlockType": "CELL", "RowIndex": 3, "ColumnIndex": 1, "Text": "PRD-007" },
    { "BlockType": "CELL", "RowIndex": 3, "ColumnIndex": 2, "Text": "Areia Sanitária 12kg" },
    { "BlockType": "CELL", "RowIndex": 4, "ColumnIndex": 1, "Text": "PRD-014" },
    { "BlockType": "CELL", "RowIndex": 4, "ColumnIndex": 2, "Text": "Brinquedo Mouse" }
  ]
}`;

txDocs.invoice.json.layout = `{
  "Blocks": [
    { "BlockType": "LAYOUT_TITLE",  "Text": "NOTA FISCAL ELETRÔNICA",   "Confidence": 99.7 },
    { "BlockType": "LAYOUT_TEXT",   "Text": "Bloco EMITENTE",           "Confidence": 98.4 },
    { "BlockType": "LAYOUT_TEXT",   "Text": "Bloco DESTINATÁRIO",       "Confidence": 98.6 },
    { "BlockType": "LAYOUT_TABLE",  "RelatedBlockIds": ["tbl-001"],     "Confidence": 99.1 },
    { "BlockType": "LAYOUT_TEXT",   "Text": "Subtotal · ICMS · TOTAL",  "Confidence": 99.0 },
    { "BlockType": "LAYOUT_FOOTER", "Text": "PROTOCOLO 1352605012345",  "Confidence": 98.8 }
  ]
}`;

txDocs.id.json.text = `{
  "Blocks": [
    { "BlockType": "PAGE", "Id": "p-001" },
    { "BlockType": "LINE", "Text": "CARTEIRA NACIONAL DE HABILITAÇÃO", "Confidence": 99.7 },
    { "BlockType": "LINE", "Text": "REPÚBLICA FEDERATIVA DO BRASIL", "Confidence": 99.5 },
    { "BlockType": "LINE", "Text": "MARIA SILVA SOUZA", "Confidence": 99.4 },
    { "BlockType": "LINE", "Text": "12.345.678-9 SSP/SP", "Confidence": 99.1 },
    { "BlockType": "LINE", "Text": "123.456.789-00", "Confidence": 99.6 },
    { "BlockType": "LINE", "Text": "15/03/1989", "Confidence": 99.3 },
    { "BlockType": "LINE", "Text": "B", "Confidence": 99.8 },
    { "BlockType": "LINE", "Text": "VALIDADE 15/03/2030", "Confidence": 99.0 },
    { "BlockType": "LINE", "Text": "10/04/2008", "Confidence": 98.9 },
    { "BlockType": "LINE", "Text": "04231598742", "Confidence": 98.4 }
  ]
}`;

txDocs.id.json.layout = `{
  "Blocks": [
    { "BlockType": "LAYOUT_TITLE",     "Text": "CARTEIRA NACIONAL DE HABILITAÇÃO", "Confidence": 99.7 },
    { "BlockType": "LAYOUT_FIGURE",    "Text": "Foto 3x4 do titular",              "Confidence": 99.0 },
    { "BlockType": "LAYOUT_KEY_VALUE", "Text": "Bloco de campos da CNH",           "Confidence": 98.5 }
  ]
}`;

txDocs.table.json.text = `{
  "Blocks": [
    { "BlockType": "PAGE", "Id": "p-001" },
    { "BlockType": "LINE", "Text": "RELATÓRIO TRIMESTRAL", "Confidence": 99.6 },
    { "BlockType": "LINE", "Text": "Vendas por região · Q1 2026", "Confidence": 99.0 },
    { "BlockType": "LINE", "Text": "Região Janeiro Fevereiro Março Total", "Confidence": 98.5 },
    { "BlockType": "LINE", "Text": "Sudeste 120.000 145.000 132.000 397.000", "Confidence": 98.2 },
    { "BlockType": "LINE", "Text": "Sul 85.000 92.000 78.000 255.000", "Confidence": 98.4 },
    { "BlockType": "LINE", "Text": "Nordeste 62.000 71.000 65.000 198.000", "Confidence": 98.3 },
    { "BlockType": "LINE", "Text": "TOTAL 330.000 378.000 338.000 1.046.000", "Confidence": 99.1 }
  ]
}`;

txDocs.table.json.layout = `{
  "Blocks": [
    { "BlockType": "LAYOUT_TITLE", "Text": "RELATÓRIO TRIMESTRAL",   "Confidence": 99.6 },
    { "BlockType": "LAYOUT_TEXT",  "Text": "Vendas por região · Q1 2026", "Confidence": 99.0 },
    { "BlockType": "LAYOUT_TABLE", "RelatedBlockIds": ["tbl-001"],   "Confidence": 99.4 }
  ]
}`;

// === Filtra os botões de API conforme o documento selecionado ===
function txFilterApis() {
  const available = Object.keys(txApiInfo).filter(api =>
    txApiInfo[api].available.includes(txCurrentDoc)
  );
  document.querySelectorAll('#tx-api-picker .tx-api-btn').forEach(b => {
    b.style.display = available.includes(b.dataset.api) ? '' : 'none';
  });
  // Se a API atual não serve pro novo doc, troca pra primeira disponível
  if (!available.includes(txCurrentApi) && available.length > 0) {
    txCurrentApi = available[0];
    document.querySelectorAll('#tx-api-picker .tx-api-btn').forEach(x => x.classList.remove('active'));
    const newBtn = document.querySelector(`#tx-api-picker .tx-api-btn[data-api="${txCurrentApi}"]`);
    if (newBtn) newBtn.classList.add('active');
  }
}

// Re-aplica o filtro a cada troca de documento (handler adicional, não substitui o original)
document.querySelectorAll('#tx-doc-picker .tx-doc-btn').forEach(b => {
  b.addEventListener('click', () => {
    // Sempre volta pra DetectDocumentText ao trocar de documento (funciona em todos)
    txCurrentApi = 'text';
    document.querySelectorAll('#tx-api-picker .tx-api-btn').forEach(x => x.classList.remove('active'));
    const txtBtn = document.querySelector('#tx-api-picker .tx-api-btn[data-api="text"]');
    if (txtBtn) txtBtn.classList.add('active');
    // Atualiza explicação
    document.getElementById('tx-explain-title').textContent = txApiInfo.text.title;
    document.getElementById('tx-explain-desc').innerHTML = txApiInfo.text.desc;
    // Reseta saída JSON pro placeholder padrão
    document.getElementById('tx-out-json').innerHTML = '<span class="c"># Clica em "Processar documento" pra ver a saída</span>';
    document.getElementById('tx-status').textContent = '⏸️ Pronto. Clica em "Processar".';
    txFilterApis();
  });
});
txFilterApis();

txRender();
// Initialize explanation
document.getElementById('tx-explain-title').textContent = txApiInfo.text.title;
document.getElementById('tx-explain-desc').innerHTML = txApiInfo.text.desc;

// ============================================================
// MÓDULO 2: TEXTRACT LAB · arquitetura
// ============================================================
const labStepData = {
  upload: {
    head: '📤 Upload via presigned URL',
    desc: 'O frontend pede ao backend uma URL presigned de upload. Usuário envia direto pro S3, sem passar pela sua API. Escala infinita.',
    code: `<span class="c"># Backend gera URL presigned</span>
<span class="k">import</span> boto3
s3 = boto3.client(<span class="s">"s3"</span>)

url = s3.generate_presigned_url(
    <span class="s">"put_object"</span>,
    Params={
        <span class="s">"Bucket"</span>: <span class="s">"notas-fiscais"</span>,
        <span class="s">"Key"</span>: <span class="s">f"raw/{user_id}/{uuid4()}.pdf"</span>,
        <span class="s">"ContentType"</span>: <span class="s">"application/pdf"</span>
    },
    ExpiresIn=<span class="n">300</span>  <span class="c"># 5 min</span>
)
<span class="k">return</span> {<span class="s">"upload_url"</span>: url}`
  },
  s3: {
    head: '🪣 S3 + EventBridge',
    desc: 'Bucket guarda os PDFs. Configurado pra disparar evento toda vez que chega um arquivo novo no prefixo `raw/`. EventBridge ou notification direta pra Lambda.',
    code: `<span class="c"># S3 EventBridge config (CloudFormation)</span>
NotificationConfiguration:
  EventBridgeConfiguration: { EventBridgeEnabled: <span class="k">true</span> }

<span class="c"># Regra do EventBridge</span>
EventPattern:
  source: [<span class="s">"aws.s3"</span>]
  detail-type: [<span class="s">"Object Created"</span>]
  detail:
    bucket:
      name: [<span class="s">"notas-fiscais"</span>]
    object:
      key:
        - {<span class="s">"prefix"</span>: <span class="s">"raw/"</span>}

Targets:
  - { Arn: !GetAtt MyLambda.Arn }`
  },
  lambda: {
    head: '⚡ Lambda handler',
    desc: 'Recebe o evento do S3, valida o arquivo, dispara o job no Textract. Importante: <strong>async</strong> pra arquivos grandes (>5 páginas), porque Textract pode levar segundos a minutos.',
    code: `<span class="k">import</span> boto3, json, os
textract = boto3.client(<span class="s">"textract"</span>)

<span class="k">def</span> handler(event, context):
    <span class="k">for</span> rec <span class="k">in</span> event[<span class="s">"Records"</span>]:
        bucket = rec[<span class="s">"s3"</span>][<span class="s">"bucket"</span>][<span class="s">"name"</span>]
        key    = rec[<span class="s">"s3"</span>][<span class="s">"object"</span>][<span class="s">"key"</span>]

        <span class="c"># Async: melhor pra PDFs grandes</span>
        resp = textract.start_expense_analysis(
            DocumentLocation={
                <span class="s">"S3Object"</span>: {<span class="s">"Bucket"</span>: bucket, <span class="s">"Name"</span>: key}
            },
            NotificationChannel={
                <span class="s">"SNSTopicArn"</span>: os.environ[<span class="s">"TEXTRACT_SNS"</span>],
                <span class="s">"RoleArn"</span>: os.environ[<span class="s">"TEXTRACT_ROLE"</span>]
            }
        )
        <span class="c"># Salva job id pra acompanhar depois</span>
        save_job(key, resp[<span class="s">"JobId"</span>])`
  },
  textract: {
    head: '📄 Textract · AnalyzeExpense',
    desc: 'Extrai campos da nota fiscal: vendor, customer, total, tax, line items. Quando termina, manda mensagem pro SNS, que dispara outra Lambda pra processar o resultado.',
    code: `<span class="c"># 2ª Lambda: handler do callback do SNS</span>
<span class="k">def</span> on_textract_done(event, context):
    msg = json.loads(event[<span class="s">"Records"</span>][<span class="n">0</span>][<span class="s">"Sns"</span>][<span class="s">"Message"</span>])
    job_id = msg[<span class="s">"JobId"</span>]

    <span class="c"># Buscar resultado completo</span>
    result = textract.get_expense_analysis(JobId=job_id)
    docs = result[<span class="s">"ExpenseDocuments"</span>]

    <span class="k">for</span> doc <span class="k">in</span> docs:
        summary = {
            f[<span class="s">"Type"</span>][<span class="s">"Text"</span>]: f[<span class="s">"ValueDetection"</span>][<span class="s">"Text"</span>]
            <span class="k">for</span> f <span class="k">in</span> doc[<span class="s">"SummaryFields"</span>]
        }
        save_to_dynamodb(summary)`
  },
  db: {
    head: '💾 DynamoDB + Athena',
    desc: 'DynamoDB pra armazenar nota individual com lookup rápido. Athena/Glue pra analytics em escala (queries SQL no S3 com Glue Catalog).',
    code: `<span class="c"># Salvar no Dynamo</span>
<span class="k">import</span> boto3
ddb = boto3.resource(<span class="s">"dynamodb"</span>).Table(<span class="s">"notas-extraidas"</span>)

ddb.put_item(Item={
    <span class="s">"pk"</span>: <span class="s">f"NOTA#{summary['INVOICE_NUMBER']}"</span>,
    <span class="s">"sk"</span>: summary[<span class="s">"INVOICE_DATE"</span>],
    <span class="s">"vendor"</span>: summary[<span class="s">"VENDOR_NAME"</span>],
    <span class="s">"customer"</span>: summary[<span class="s">"CUSTOMER_NAME"</span>],
    <span class="s">"total"</span>: Decimal(summary[<span class="s">"TOTAL"</span>]),
    <span class="s">"line_items"</span>: doc[<span class="s">"LineItemGroups"</span>],
    <span class="s">"raw_s3"</span>: <span class="s">f"s3://{bucket}/{key}"</span>,
    <span class="s">"processed_at"</span>: int(time.time())
})

<span class="c"># Pra analytics, periodicamente exporta tudo pra S3</span>
<span class="c"># formato Parquet e cataloga no Glue → Athena queries SQL</span>`
  },
  dash: {
    head: '📊 QuickSight / dashboard',
    desc: 'Dashboard executivo: notas processadas/dia, top vendors, anomalias de valor. QuickSight conecta direto no Athena ou Dynamo.',
    code: `<span class="c"># QuickSight não exige código - é configuração visual.</span>
<span class="c"># Mas pode automatizar via API:</span>

<span class="k">import</span> boto3
qs = boto3.client(<span class="s">"quicksight"</span>)

qs.create_data_source(
    AwsAccountId=<span class="s">"123..."</span>,
    DataSourceId=<span class="s">"notas-athena"</span>,
    Name=<span class="s">"Notas Fiscais (Athena)"</span>,
    Type=<span class="s">"ATHENA"</span>,
    DataSourceParameters={
        <span class="s">"AthenaParameters"</span>: {
            <span class="s">"WorkGroup"</span>: <span class="s">"primary"</span>
        }
    }
)
<span class="c"># Agora cria dataset, dashboard, e Q pra perguntar em LP natural</span>`
  }
};

document.querySelectorAll('.lab-box').forEach(box => {
  box.addEventListener('click', () => {
    document.querySelectorAll('.lab-box').forEach(b => b.classList.remove('active'));
    box.classList.add('active');
    const data = labStepData[box.dataset.step];
    document.getElementById('lab-detail-head').textContent = data.head;
    document.getElementById('lab-detail-desc').textContent = data.desc;
    document.getElementById('lab-detail-code').innerHTML = data.code;
  });
});

document.getElementById('lab-fire').addEventListener('click', () => {
  const order = ['upload', 's3', 'lambda', 'textract', 'db', 'dash'];
  document.querySelectorAll('.lab-box').forEach(b => b.classList.remove('firing', 'active'));
  order.forEach((step, i) => {
    setTimeout(() => {
      const box = document.querySelector(`.lab-box[data-step="${step}"]`);
      if (box) {
        box.classList.add('firing');
        setTimeout(() => box.classList.remove('firing'), 600);
      }
    }, i * 500);
  });
});


// ============================================================
// MÓDULO 3: AMAZON TRANSLATE · agora chama API real (Pollinations LLM)
// ============================================================

const trLangNames = {
  pt: '🇧🇷 Português', en: '🇺🇸 English', es: '🇪🇸 Español',
  fr: '🇫🇷 Français', de: '🇩🇪 Deutsch', it: '🇮🇹 Italiano',
  ja: '🇯🇵 日本語', zh: '🇨🇳 中文', ko: '🇰🇷 한국어',
  ru: '🇷🇺 Русский', ar: '🇸🇦 العربية', hi: '🇮🇳 हिन्दी',
  nl: '🇳🇱 Nederlands', sv: '🇸🇪 Svenska', tr: '🇹🇷 Türkçe',
  pl: '🇵🇱 Polski', auto: '🌐 Auto-detectar'
};

const trLangFullNames = {
  pt: 'Portuguese (Brazilian)', en: 'English', es: 'Spanish',
  fr: 'French', de: 'German', it: 'Italian', ja: 'Japanese',
  zh: 'Mandarin Chinese', ko: 'Korean', ru: 'Russian',
  ar: 'Arabic', hi: 'Hindi', nl: 'Dutch', sv: 'Swedish',
  tr: 'Turkish', pl: 'Polish'
};

const trExamples = [
  { from: 'en', to: 'pt', text: 'I bought 3 cans of premium cat food at the Bigode Petshop. The customer service was excellent, and Maria was super helpful. My cat loved the product.' },
  { from: 'pt', to: 'es', text: 'Paciente com cefaleia há cinco dias, em uso de paracetamol 750 mg comprimido duas vezes ao dia.' },
  { from: 'pt', to: 'en', text: 'Cardápio do Balaio: pão de queijo, café com leite, chocolate quente, pão francês. Bom apetite!' },
  { from: 'en', to: 'pt', text: 'This contract is binding upon both parties. The parties agree to the terms specified herein.' },
  { from: 'pt', to: 'ja', text: 'Olá, doutor. Preciso falar com você. Meu gato está com dor de barriga.' },
  // Demo dedicado de Custom Terminology
  { from: 'pt', to: 'en', text: 'O Balaio de Gatos é um marketplace pra Bigode Petshop e outras petshops. Felix, o gato laranja, é nosso cliente fiel. Hoje pediu 2kg de Premium Crunchy.', preset: 'customDemo' }
];

// Estado do Custom Terminology · editável pelo usuário
const trTermDefault = [
  { from: 'gato', to: 'cat' },
  { from: 'Bigode Petshop', to: 'Bigode Petshop' },
  { from: 'Balaio de Gatos', to: 'Balaio de Gatos' },
  { from: 'Premium Crunchy', to: 'Premium Crunchy' },
  { from: 'Felix', to: 'Felix' }
];
let trTerms = JSON.parse(JSON.stringify(trTermDefault));

function trRenderTerminology() {
  const table = document.getElementById('tr-term-table');
  if (!table) return;
  table.innerHTML = '';
  trTerms.forEach((t, idx) => {
    const row = document.createElement('div');
    row.className = 'tr-term-row';
    row.innerHTML = `
      <input type="text" class="tr-term-input" value="${t.from.replace(/"/g, '&quot;')}" data-idx="${idx}" data-field="from" placeholder="texto original">
      <span class="tr-term-arrow">→</span>
      <input type="text" class="tr-term-input" value="${t.to.replace(/"/g, '&quot;')}" data-idx="${idx}" data-field="to" placeholder="tradução fixa">
      <button class="tr-term-del" data-idx="${idx}" title="Remover">×</button>
    `;
    table.appendChild(row);
  });
  // CSV preview
  const csv = 'source,target\n' + trTerms.map(t => `"${t.from}","${t.to}"`).join('\n');
  document.getElementById('tr-term-csv').textContent = csv;

  // Bind events
  table.querySelectorAll('.tr-term-input').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      const field = e.target.dataset.field;
      if (trTerms[idx]) {
        trTerms[idx][field] = e.target.value;
        document.getElementById('tr-term-csv').textContent = 'source,target\n' + trTerms.map(t => `"${t.from}","${t.to}"`).join('\n');
      }
    });
  });
  table.querySelectorAll('.tr-term-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      trTerms.splice(idx, 1);
      trRenderTerminology();
    });
  });
}

function trUpdateTermVisibility() {
  const enabled = document.getElementById('tr-custom').checked;
  const panel = document.getElementById('tr-terminology');
  if (panel) panel.style.display = enabled ? 'block' : 'none';
}

// Cache de traduções pra evitar re-fetch da mesma frase
const trCache = new Map();
let trDebounceTimer = null;
let trAbortCtrl = null;
let trBusy = false;

function trDetectLang(text) {
  const lower = text.toLowerCase();
  // Heurística por caracteres especiais primeiro
  if (/[\u3040-\u30ff\u4e00-\u9fff]/.test(text) && /[\u3040-\u30ff]/.test(text)) return 'ja';
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
  if (/[\uac00-\ud7af]/.test(text)) return 'ko';
  if (/[\u0600-\u06ff]/.test(text)) return 'ar';
  if (/[\u0400-\u04ff]/.test(text)) return 'ru';
  if (/[\u0900-\u097f]/.test(text)) return 'hi';
  // Palavras-chave por idioma latino
  const checks = [
    ['pt', /\b(o|a|que|para|com|não|nao|gato|olá|você|também|muito|os|as|isso|estou|está|sou)\b/g],
    ['es', /\b(el|la|que|para|con|gato|hola|tú|gracias|muy|los|las|eso|estoy|está|soy|también|pero)\b/g],
    ['en', /\b(the|and|was|with|very|my|cat|hello|you|love|that|this|are|have|will)\b/g],
    ['fr', /\b(le|la|les|et|avec|très|chat|bonjour|merci|vous|une|un|pour|que)\b/g],
    ['de', /\b(der|die|das|und|mit|sehr|katze|hallo|danke|sie|ein|ist|nicht|für)\b/g],
    ['it', /\b(il|la|le|e|con|molto|gatto|ciao|grazie|tu|un|una|per|che|sono)\b/g],
    ['nl', /\b(de|het|en|met|zeer|kat|hallo|dank|ik|jij|een|is|niet|voor)\b/g],
    ['sv', /\b(och|att|jag|du|att|inte|den|det|en|ett|för)\b/g],
    ['tr', /\b(ve|bir|bu|şu|ben|sen|değil|için|var|kedi)\b/g],
    ['pl', /\b(i|w|na|to|jest|nie|ten|ta|to|kot|dla)\b/g]
  ];
  let best = 'en';
  let bestScore = 0;
  for (const [lang, re] of checks) {
    const hits = (lower.match(re) || []).length;
    if (hits > bestScore) { bestScore = hits; best = lang; }
  }
  return best;
}

// Tradução real via Pollinations LLM com retry + backoff
async function trCallAPI(text, from, to, options) {
  options = options || {};
  const cacheKey = `${from}|${to}|${options.formal ? 'F' : ''}|${options.custom ? 'C' : ''}|${JSON.stringify(trTerms)}|${text}`;
  if (trCache.has(cacheKey)) return trCache.get(cacheKey);

  // cancela call anterior se houver
  if (trAbortCtrl) trAbortCtrl.abort();
  trAbortCtrl = new AbortController();
  const myCtrl = trAbortCtrl;

  const targetLang = trLangFullNames[to] || to;
  const sourceLang = from === 'auto' ? 'auto-detect' : (trLangFullNames[from] || from);

  const directives = [];
  if (options.formal) directives.push('Use FORMAL register (vous in French, Sie in German, usted in Spanish, etc.)');
  if (options.custom && trTerms.length > 0) {
    const validTerms = trTerms.filter(t => t.from.trim() && t.to.trim());
    if (validTerms.length > 0) {
      const termList = validTerms.map(t => `  "${t.from}" → "${t.to}"`).join('\n');
      directives.push(`Apply this CUSTOM TERMINOLOGY DICTIONARY strictly. These exact mappings MUST be respected (case-insensitive match in source, exact form in target):\n${termList}\nBrand names and proper nouns mapped here must NEVER be translated to other forms.`);
    }
  }
  if (options.profanity) directives.push('Mask any profanity with ***.');
  const directivesStr = directives.length ? '\nADDITIONAL RULES:\n- ' + directives.join('\n- ') : '';

  const prompt = `You are Amazon Translate, the AWS neural machine translation service. Translate the text from ${sourceLang} to ${targetLang}.

RULES:
- Output ONLY the translation, nothing else. No explanations, no quotes, no labels.
- Preserve the original tone, punctuation, and line breaks.
- Translate names of products/brands consistently. Keep proper nouns intact unless they have known target-language equivalents.
- For ${targetLang}: deliver natural, idiomatic text.${directivesStr}

TEXT TO TRANSLATE:
${text}`;

  // Tenta múltiplos endpoints / modelos. Primeiro o que costuma funcionar mais rápido.
  const attempts = [
    { base: 'https://text.pollinations.ai/', params: '' },
    { base: 'https://text.pollinations.ai/', params: '?model=openai' },
    { base: 'https://text.pollinations.ai/', params: '?model=mistral' }
  ];

  let lastError = null;
  for (let i = 0; i < attempts.length; i++) {
    if (myCtrl.signal.aborted) return null;
    const { base, params } = attempts[i];
    const url = base + encodeURIComponent(prompt) + params;

    // Timeout de 25s por tentativa via Promise.race
    try {
      const fetchPromise = fetch(url, { cache: 'no-store', signal: myCtrl.signal });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 25000)
      );
      const r = await Promise.race([fetchPromise, timeoutPromise]);
      if (!r.ok) throw new Error('http ' + r.status);
      let translated = (await r.text()).trim();

      // Detecta resposta inválida: HTML de erro ou string vazia
      if (!translated) throw new Error('empty');
      if (translated.startsWith('<') || translated.toLowerCase().includes('<!doctype')) {
        throw new Error('html-error-page');
      }
      // Detecta mensagens de erro típicas
      if (/^(error|sorry|i cannot|i can't|unable to|gateway|bad request|too many)/i.test(translated)) {
        throw new Error('llm-refused');
      }
      // Strip aspas e prefixos comuns
      translated = translated.replace(/^["'`]+|["'`]+$/g, '');
      translated = translated.replace(/^Translation:\s*/i, '');
      translated = translated.replace(/^Translated text:\s*/i, '');
      translated = translated.replace(/^Here is the translation:\s*/i, '');
      translated = translated.replace(/^The translation is:\s*/i, '');

      trCache.set(cacheKey, translated);
      return translated;
    } catch (e) {
      lastError = e;
      if (e.name === 'AbortError') return null;
      // Backoff entre tentativas
      if (i < attempts.length - 1) {
        await new Promise(r => setTimeout(r, 600 * (i + 1)));
      }
    }
  }

  // Se chegou aqui, todas as tentativas falharam
  const err = new Error('all-attempts-failed');
  err.lastError = lastError;
  throw err;
}

function trSetStatus(msg, kind) {
  const el = document.getElementById('tr-translate-status');
  if (!el) return;
  el.className = 'tr-status ' + (kind || '');
  el.textContent = msg;
}

async function trDoTranslate() {
  const text = document.getElementById('tr-input').value;
  const fromSel = document.getElementById('tr-from').value;
  const to = document.getElementById('tr-to').value;
  const formal = document.getElementById('tr-formal').checked;
  const profanity = document.getElementById('tr-profanity').checked;
  const custom = document.getElementById('tr-custom').checked;

  if (!text.trim()) {
    document.getElementById('tr-output').textContent = '';
    trSetStatus('Digite um texto pra traduzir.', '');
    return;
  }

  const from = fromSel === 'auto' ? trDetectLang(text) : fromSel;

  if (fromSel === 'auto') {
    document.getElementById('tr-detect').textContent = `auto-detectado: ${from}`;
    document.getElementById('tr-from-name').textContent = `🌐 Auto (${from.toUpperCase()})`;
  } else {
    document.getElementById('tr-detect').textContent = '';
    document.getElementById('tr-from-name').textContent = trLangNames[from] || from;
  }
  document.getElementById('tr-to-name').textContent = trLangNames[to] || to;

  if (from === to) {
    document.getElementById('tr-output').textContent = text;
    trSetStatus('Mesmo idioma, nada a traduzir.', '');
    document.getElementById('tr-conf').textContent = '··· · sem mudança';
    trUpdateCode(text, from, to, formal, custom);
    return;
  }

  trBusy = true;
  trSetStatus('🔄 Traduzindo via Pollinations API…', 'loading');
  document.getElementById('tr-conf').textContent = 'chamando…';

  const t0 = performance.now();
  try {
    let translated = await trCallAPI(text, from, to, { formal, profanity, custom });
    if (translated === null) { trBusy = false; return; }
    if (profanity) translated = translated.replace(/\b(merda|caralho|porra|fuck|shit|damn)\b/gi, '***');

    // Animação de fade-in com efeito digitando
    const outEl = document.getElementById('tr-output');
    outEl.textContent = '';
    const chunkSize = Math.max(1, Math.floor(translated.length / 40));
    let i = 0;
    function pump() {
      i = Math.min(i + chunkSize, translated.length);
      outEl.textContent = translated.slice(0, i);
      if (i < translated.length) requestAnimationFrame(pump);
    }
    requestAnimationFrame(pump);

    const ms = Math.round(performance.now() - t0);
    document.getElementById('tr-conf').textContent = `~${ms}ms · neural · 🌐 LLM`;
    trSetStatus(`✅ Traduzido em ${ms}ms via Pollinations API. ${trCache.size > 0 ? '(cache: ' + trCache.size + ')' : ''}`, 'ok');
    trClearRetry();
  } catch (e) {
    const reason = e && e.lastError ? e.lastError.message : (e && e.message) || 'erro desconhecido';
    document.getElementById('tr-output').textContent = '';
    document.getElementById('tr-conf').textContent = 'erro';

    // Decide quanto tempo esperar e mostra countdown auto-retry
    let waitSec, errIcon, errLabel;
    if (/timeout/i.test(reason)) {
      waitSec = 8;  errIcon = '⏳'; errLabel = 'API demorou muito (timeout)';
    } else if (/429|too many|rate/i.test(reason)) {
      waitSec = 30; errIcon = '🚦'; errLabel = 'Rate limit do Pollinations';
    } else if (/html-error-page|gateway/i.test(reason)) {
      waitSec = 12; errIcon = '🌐'; errLabel = 'API retornou erro de gateway';
    } else {
      waitSec = 8;  errIcon = '⚠️'; errLabel = `Falhou (${reason})`;
    }
    trShowRetryCountdown(errIcon, errLabel, waitSec);
  } finally {
    trBusy = false;
  }

  trUpdateCode(text, from, to, formal, custom);
}

// =============== Countdown overlay de retry ==================
let trRetryTimer = null;
let trRetryRemaining = 0;

function trClearRetry() {
  const overlay = document.getElementById('tr-retry-overlay');
  if (overlay) overlay.remove();
  if (trRetryTimer) {
    clearInterval(trRetryTimer);
    trRetryTimer = null;
  }
  trRetryRemaining = 0;
}

function trShowRetryCountdown(icon, label, seconds) {
  trClearRetry();
  trRetryRemaining = seconds;

  const card = document.querySelector('.tr-card');
  if (!card) return;
  const overlay = document.createElement('div');
  overlay.className = 'tr-retry-overlay';
  overlay.id = 'tr-retry-overlay';
  overlay.innerHTML = `
    <div class="tr-retry-modal">
      <div class="tr-retry-icon">${icon}</div>
      <div class="tr-retry-title">${label}</div>
      <div class="tr-retry-msg">Tentando novamente em <strong id="tr-retry-num">${seconds}</strong> segundos…</div>
      <div class="tr-retry-bar">
        <div class="tr-retry-bar-fill" id="tr-retry-bar-fill"></div>
      </div>
      <div class="tr-retry-hint">⏳ Aguarde o contador zerar. Pollinations free está sob carga.</div>
    </div>
  `;
  card.style.position = 'relative';
  card.appendChild(overlay);

  // animação da barra
  const fillEl = document.getElementById('tr-retry-bar-fill');
  const numEl = document.getElementById('tr-retry-num');
  const start = Date.now();
  const totalMs = seconds * 1000;

  trRetryTimer = setInterval(() => {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
    if (numEl) numEl.textContent = remaining;
    if (fillEl) fillEl.style.width = ((elapsed / totalMs) * 100).toFixed(1) + '%';
    trRetryRemaining = remaining;
    if (elapsed >= totalMs) {
      clearInterval(trRetryTimer);
      trRetryTimer = null;
      trClearRetry();
      trDoTranslate();
    }
  }, 100);
}

function trUpdateMetadata() {
  const text = document.getElementById('tr-input').value;
  document.getElementById('tr-char-count').textContent = `${text.length} chars`;
  document.getElementById('tr-word-count').textContent = `${text.trim().split(/\s+/).filter(x => x).length} words`;
  // Atualiza o nome do idioma de origem se for auto
  const fromSel = document.getElementById('tr-from').value;
  if (fromSel === 'auto' && text.trim()) {
    const from = trDetectLang(text);
    document.getElementById('tr-detect').textContent = `auto-detectado: ${from}`;
    document.getElementById('tr-from-name').textContent = `🌐 Auto (${from.toUpperCase()})`;
  } else {
    document.getElementById('tr-detect').textContent = '';
    document.getElementById('tr-from-name').textContent = trLangNames[fromSel] || fromSel;
  }
  document.getElementById('tr-to-name').textContent = trLangNames[document.getElementById('tr-to').value] || '';
}

// Auto-traduz com debounce ao digitar (só pra textos com >= 8 chars)
function trAutoTranslate() {
  if (trDebounceTimer) clearTimeout(trDebounceTimer);
  trUpdateMetadata();
  const text = document.getElementById('tr-input').value;
  if (text.trim().length < 8) return;
  trDebounceTimer = setTimeout(() => trDoTranslate(), 1200);
}

function trUpdateCode(text, from, to, formal, custom) {
  const settings = [];
  if (formal) settings.push('Settings={"Formality": "FORMAL"}');
  if (custom && trTerms.filter(t => t.from && t.to).length > 0) {
    settings.push('TerminologyNames=["balaio-de-gatos-v1"]');
  }
  const settingsStr = settings.length ? '\n    ' + settings.join(',\n    ') + ',' : '';
  const termCount = trTerms.filter(t => t.from && t.to).length;
  const termCsv = custom && termCount > 0
    ? `\n<span class="c"># Custom Terminology · ${termCount} termos ativos</span>\n<span class="c"># aws translate import-terminology --name balaio-de-gatos-v1 --terminology-data file=balaio.csv</span>\n`
    : '';
  document.getElementById('tr-code').innerHTML = `<span class="c"># Real-time translation (TranslateText)</span>${termCsv}<span class="k">import</span> boto3
client = boto3.client(<span class="s">"translate"</span>)

resp = client.translate_text(
    Text=<span class="s">"${text.slice(0, 60).replace(/"/g, '\\"')}..."</span>,
    SourceLanguageCode=<span class="s">"${from}"</span>,
    TargetLanguageCode=<span class="s">"${to}"</span>,${settingsStr}
)
<span class="c"># resp["TranslatedText"] →</span>
<span class="c"># "${(document.getElementById('tr-output').textContent || '').slice(0, 60).replace(/"/g, '\\"')}..."</span>`;
}

// Botão "Traduzir" explícito (única forma de disparar tradução)
document.getElementById('tr-translate-btn').addEventListener('click', () => {
  if (trDebounceTimer) clearTimeout(trDebounceTimer);
  trDoTranslate();
});

// Atualiza só metadata enquanto digita (contadores e auto-detect),
// SEM disparar tradução
document.getElementById('tr-input').addEventListener('input', trUpdateMetadata);

// Trocar idioma só atualiza nomes; usuário precisa clicar Traduzir
['tr-from', 'tr-to'].forEach(id =>
  document.getElementById(id).addEventListener('change', trUpdateMetadata)
);
// Toggles também só atualizam UI; tradução fica pra quando clicar
['tr-formal', 'tr-profanity', 'tr-custom'].forEach(id =>
  document.getElementById(id).addEventListener('change', () => {
    trUpdateMetadata();
    // Atualiza o snippet de código mostrando os settings ativos
    const text = document.getElementById('tr-input').value;
    const fromSel = document.getElementById('tr-from').value;
    const from = fromSel === 'auto' ? trDetectLang(text) : fromSel;
    const to = document.getElementById('tr-to').value;
    trUpdateCode(text, from, to,
      document.getElementById('tr-formal').checked,
      document.getElementById('tr-custom').checked
    );
  })
);

document.getElementById('tr-swap').addEventListener('click', () => {
  const from = document.getElementById('tr-from').value;
  const to = document.getElementById('tr-to').value;
  if (from === 'auto') return;
  document.getElementById('tr-from').value = to;
  document.getElementById('tr-to').value = from;
  // troca texto também
  const inText = document.getElementById('tr-input').value;
  const outText = document.getElementById('tr-output').textContent;
  if (outText && outText !== inText) {
    document.getElementById('tr-input').value = outText;
  }
  trUpdateMetadata();
  // Não traduz automaticamente; usuário clica em Traduzir
});

document.querySelectorAll('#tr-examples .tr-ex-btn').forEach((b, i) => {
  b.addEventListener('click', () => {
    const ex = trExamples[i];
    document.getElementById('tr-from').value = ex.from;
    document.getElementById('tr-to').value = ex.to;
    document.getElementById('tr-input').value = ex.text;

    // Demo dedicado de Custom Terminology: força ON e abre dica
    if (ex.preset === 'customDemo') {
      document.getElementById('tr-custom').checked = true;
      trUpdateTermVisibility();
      trTerms = JSON.parse(JSON.stringify(trTermDefault));
      trRenderTerminology();
      trSetStatus('💡 Demo Custom Terminology · clica em "Traduzir" pra ver "Felix", "Bigode Petshop" e "Premium Crunchy" sendo preservados.', 'ok');
    } else {
      trSetStatus('✏️ Exemplo carregado. Clica em "Traduzir" pra processar.', 'ok');
    }
    trUpdateMetadata();
    // Limpa output anterior pra deixar claro que precisa traduzir
    document.getElementById('tr-output').textContent = '';
    document.getElementById('tr-conf').textContent = '··· · neural';
  });
});

// Botões da tabela de Custom Terminology
const trTermAddBtn = document.getElementById('tr-term-add');
if (trTermAddBtn) trTermAddBtn.addEventListener('click', () => {
  trTerms.push({ from: '', to: '' });
  trRenderTerminology();
});
const trTermResetBtn = document.getElementById('tr-term-reset');
if (trTermResetBtn) trTermResetBtn.addEventListener('click', () => {
  trTerms = JSON.parse(JSON.stringify(trTermDefault));
  trRenderTerminology();
});

// Toggle do Custom mostra/esconde a tabela
document.getElementById('tr-custom').addEventListener('change', trUpdateTermVisibility);

document.getElementById('tr-copy').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('tr-output').textContent || '');
  trSetStatus('📋 Copiado!', 'ok');
});

document.getElementById('tr-tts').addEventListener('click', () => {
  const text = document.getElementById('tr-output').textContent;
  if (!text || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  const lang = document.getElementById('tr-to').value;
  const langMap = {
    pt: 'pt-BR', en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
    it: 'it-IT', ja: 'ja-JP', zh: 'zh-CN', ko: 'ko-KR', ru: 'ru-RU',
    ar: 'ar-SA', hi: 'hi-IN', nl: 'nl-NL', sv: 'sv-SE', tr: 'tr-TR', pl: 'pl-PL'
  };
  u.lang = langMap[lang] || 'pt-BR';
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
});

// Boot inicial: só metadata, não traduz automaticamente
trUpdateMetadata();
trUpdateCode('', 'en', 'pt', false, true);
trRenderTerminology();
trUpdateTermVisibility();
trSetStatus('Pronto. Edite o texto ou clique em Traduzir.', '');

// ============================================================
// MÓDULO 4: TRANSLATE LAB · batch vs realtime
// ============================================================
const tlabVolMap = [100000, 1000000, 5000000, 10000000, 50000000, 200000000, 1000000000];
const tlabLatMap = ['≤ 100ms (humano-em-loop)', '≤ 1 segundo', '≤ 1 minuto', '≤ 1 hora'];
const tlabLatVal = [100, 1000, 60000, 3600000];

function tlabUpdate() {
  const volIdx = parseInt(document.getElementById('tlab-vol').value);
  const latIdx = parseInt(document.getElementById('tlab-lat').value);
  const freq = document.getElementById('tlab-freq').value;
  const multi = document.getElementById('tlab-multi').checked;

  const vol = tlabVolMap[volIdx];
  const volLabel = vol >= 1000000000 ? `${(vol / 1000000000).toFixed(1)} bi` :
                    vol >= 1000000 ? `${(vol / 1000000).toFixed(0)} milhões` :
                    `${(vol / 1000).toFixed(0)} mil`;
  document.getElementById('tlab-vol-v').textContent = volLabel;
  document.getElementById('tlab-lat-v').textContent = tlabLatMap[latIdx];

  // Cost: ~$15 per 1M chars
  const cost = (vol / 1000000) * 15;
  const realtimeCost = cost * 1.0;
  const batchCost = cost * 0.95;  // batch a tiny bit cheaper in our mock
  document.getElementById('tlab-rt-v').textContent = '$' + realtimeCost.toFixed(2);
  document.getElementById('tlab-bt-v').textContent = '$' + batchCost.toFixed(2);

  // Decision logic
  let pick = 'rt';
  let reasoning = '';
  if (latIdx <= 1) {
    pick = 'rt';
    reasoning = 'Latência exigida é baixa (segundos ou menos). Real-time é o único caminho.';
  } else if (freq === 'initial' || freq === 'daily') {
    pick = 'bt';
    reasoning = 'Cargas iniciais e diárias se beneficiam de batch: maior throughput, gerencia múltiplos arquivos do S3.';
  } else if (multi && volIdx >= 4) {
    pick = 'bt';
    reasoning = 'Múltiplos idiomas-alvo e volume grande: batch traduz pra todos os alvos numa só execução.';
  } else if (volIdx >= 4) {
    pick = 'bt';
    reasoning = 'Volume alto (>50M chars/mês). Batch processa em uma janela só, sem rate limits.';
  } else if (freq === 'continuous') {
    pick = 'rt';
    reasoning = 'Tráfego contínuo de pequenos textos casa com real-time integrado na sua API.';
  } else {
    pick = 'rt';
    reasoning = 'Volume baixo e padrão sob demanda: real-time é mais simples de integrar.';
  }

  const winner = pick === 'rt' ? '⚡ Real-time' : '📦 Batch';
  document.getElementById('tlab-result').innerHTML = `
    <span class="winner-badge">VEREDITO</span>
    <h4>${winner}</h4>
    <p>${reasoning}</p>
  `;

  document.getElementById('tlab-rt-cost').classList.toggle('recommended', pick === 'rt');
  document.getElementById('tlab-bt-cost').classList.toggle('recommended', pick === 'bt');
  document.querySelectorAll('.tlab-side-row').forEach(r => {
    r.classList.toggle('dim', r.dataset.tab !== pick);
  });
}

document.getElementById('tlab-vol').addEventListener('input', tlabUpdate);
document.getElementById('tlab-lat').addEventListener('input', tlabUpdate);
document.getElementById('tlab-freq').addEventListener('change', tlabUpdate);
document.getElementById('tlab-multi').addEventListener('change', tlabUpdate);
tlabUpdate();

// ============================================================
// MÓDULO 5: PERSONALIZE
// ============================================================
const recCatalog = [
  { id: 'r1',  emoji: '🥫', name: 'Ração Premium 3kg',     price: 'R$ 89',  cat: 'food'  },
  { id: 'r2',  emoji: '🍣', name: 'Sachê Salmão',          price: 'R$ 6',   cat: 'food'  },
  { id: 'r3',  emoji: '🥩', name: 'Petisco Carne',         price: 'R$ 22',  cat: 'food'  },
  { id: 'r4',  emoji: '🐟', name: 'Patê Atum',             price: 'R$ 5',   cat: 'food'  },
  { id: 't1',  emoji: '🐭', name: 'Brinquedo Mouse',       price: 'R$ 12',  cat: 'toy'   },
  { id: 't2',  emoji: '🪀', name: 'Bolinha Catnip',        price: 'R$ 18',  cat: 'toy'   },
  { id: 't3',  emoji: '🪶', name: 'Vara com Pena',         price: 'R$ 25',  cat: 'toy'   },
  { id: 't4',  emoji: '🧶', name: 'Novelo Lã',             price: 'R$ 8',   cat: 'toy'   },
  { id: 'h1',  emoji: '🛏️', name: 'Caminha Felpuda',       price: 'R$ 145', cat: 'home'  },
  { id: 'h2',  emoji: '🏠', name: 'Arranhador Torre',      price: 'R$ 220', cat: 'home'  },
  { id: 'h3',  emoji: '🪴', name: 'Planta Catnip',         price: 'R$ 35',  cat: 'home'  },
  { id: 'h4',  emoji: '🚪', name: 'Caixa Areia c/ tampa',  price: 'R$ 180', cat: 'home'  },
  { id: 's1',  emoji: '🧼', name: 'Areia Sanitária 12kg',  price: 'R$ 45',  cat: 'sanit' },
  { id: 's2',  emoji: '🪥', name: 'Escova Pelo',           price: 'R$ 32',  cat: 'sanit' },
  { id: 's3',  emoji: '🧴', name: 'Shampoo Felino',        price: 'R$ 28',  cat: 'sanit' },
  { id: 'ac1', emoji: '🐾', name: 'Coleira Identificação', price: 'R$ 19',  cat: 'acc'   },
  { id: 'ac2', emoji: '🎒', name: 'Bolsa Transporte',      price: 'R$ 95',  cat: 'acc'   },
  { id: 'ac3', emoji: '🦺', name: 'Peitoral Walking',      price: 'R$ 58',  cat: 'acc'   }
];

let recLikes = new Set();
let recCurrentRecipe = 'user';

function recRender() {
  const grid = document.getElementById('rec-catalog');
  grid.innerHTML = '';
  recCatalog.forEach(item => {
    const el = document.createElement('div');
    el.className = 'rec-item' + (recLikes.has(item.id) ? ' liked' : '');
    el.innerHTML = `
      <span class="cat-tag">${item.cat}</span>
      <span class="heart">❤️</span>
      <span class="emoji">${item.emoji}</span>
      <span class="name">${item.name}</span>
      <span class="price">${item.price}</span>
    `;
    el.addEventListener('click', () => {
      if (recLikes.has(item.id)) recLikes.delete(item.id);
      else recLikes.add(item.id);
      recRender();
      recComputeRecos();
    });
    grid.appendChild(el);
  });
  document.getElementById('rec-liked-count').textContent = recLikes.size;
}

function recComputeRecos() {
  const list = document.getElementById('rec-recos-list');
  if (recLikes.size === 0) {
    list.innerHTML = `<div class="rec-empty">Curta alguns itens à esquerda pra começar a receber recomendações.</div>`;
    document.getElementById('rec-recos-title').textContent = '🎯 Recomendados pra você';
    return;
  }

  // Compute scores per non-liked item based on recipe
  const liked = recCatalog.filter(i => recLikes.has(i.id));
  const candidates = recCatalog.filter(i => !recLikes.has(i.id));
  const scored = candidates.map(c => {
    let score = 0;
    let reason = '';
    if (recCurrentRecipe === 'user') {
      // USER_PERSONALIZATION: match by category + price preference
      const sameCat = liked.filter(l => l.cat === c.cat).length;
      const avgPrice = liked.reduce((a, l) => a + parseFloat(l.price.replace('R$ ', '').replace(',', '.')), 0) / liked.length;
      const itemPrice = parseFloat(c.price.replace('R$ ', '').replace(',', '.'));
      const priceCloseness = 1 - Math.min(1, Math.abs(itemPrice - avgPrice) / 200);
      score = sameCat * 25 + priceCloseness * 35 + Math.random() * 15;
      reason = sameCat > 0 ? `Você curtiu ${sameCat} itens de "${c.cat}"` : `Faixa de preço similar`;
    } else if (recCurrentRecipe === 'sims') {
      // Similar items (focus only on the LAST liked item)
      const lastLiked = liked[liked.length - 1];
      const sameCat = c.cat === lastLiked.cat ? 1 : 0;
      score = sameCat * 60 + Math.random() * 30;
      reason = sameCat ? `Parecido com ${lastLiked.emoji} ${lastLiked.name}` : 'Pouca similaridade';
    } else {
      // PERSONALIZED_RANKING: ranks all items but uses liked as bias
      const sameCat = liked.filter(l => l.cat === c.cat).length;
      score = sameCat * 15 + Math.random() * 60;
      reason = `Reordenado pra você (PERSONALIZED_RANKING)`;
    }
    return { item: c, score, reason };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 5);

  list.innerHTML = '';
  top.forEach(s => {
    const row = document.createElement('div');
    row.className = 'rec-reco-row';
    row.innerHTML = `
      <span class="em">${s.item.emoji}</span>
      <span class="nm">${s.item.name} <small>${s.reason}</small></span>
      <span class="sc">${s.score.toFixed(0)}</span>
    `;
    list.appendChild(row);
  });
  document.getElementById('rec-recos-title').textContent = `🎯 Top 5 · recipe: ${recCurrentRecipe.toUpperCase()}`;
}

const recExplains = {
  user: { title: '🧠 USER_PERSONALIZATION', desc: 'Recipe principal do Personalize. Aprende preferências do usuário com Hierarchical Recurrent Neural Networks. Considera contexto temporal e similaridade entre usuários.' },
  sims: { title: '🔄 SIMS · Similar Items', desc: 'Item-to-item: dado um item, retorna os mais similares com base em padrões de co-interação. Tipo "quem viu isso, viu também".' },
  rank: { title: '📊 PERSONALIZED_RANKING', desc: 'Reordena uma lista pré-existente (ex: resultados de busca, catálogo) baseada nas preferências do usuário. Não cria recomendações do zero, ranqueia.' }
};

document.querySelectorAll('.rec-recipe-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.rec-recipe-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    recCurrentRecipe = b.dataset.recipe;
    const r = recExplains[recCurrentRecipe];
    document.getElementById('rec-explain-title').textContent = r.title;
    document.getElementById('rec-explain-desc').textContent = r.desc;
    recComputeRecos();
  });
});

document.getElementById('rec-clear-likes').addEventListener('click', () => {
  recLikes.clear();
  recRender();
  recComputeRecos();
});

recRender();

// ============================================================
// MÓDULO 6: FRAUD DETECTOR
// ============================================================
function frEval() {
  const amount = parseFloat(document.getElementById('fr-amount').value);
  const country = document.getElementById('fr-country').value;
  const hour = document.getElementById('fr-hour').value;
  const emailAge = parseInt(document.getElementById('fr-email-age').value);
  const card = document.getElementById('fr-card').value;
  const velocity = parseInt(document.getElementById('fr-velocity').value);
  const distance = document.getElementById('fr-distance').value;
  const customer = document.getElementById('fr-customer').value;

  let score = 80; // baseline
  const factors = [];
  // pos = true → empurra pra APROVAR (reduz risco). Display do delta com sinal certo.
  const add = (label, points) => {
    score += points;
    factors.push({ label, value: points, pos: points <= 0 });
  };

  // Amount factor
  if (isNaN(amount) || amount <= 0) {
    add('Valor inválido', 0);
  } else if (amount > 5000) add('Valor muito alto (>R$5k)', +200);
  else if (amount > 2000)   add('Valor alto (>R$2k)', +120);
  else if (amount < 50)     add('Valor pequeno (teste de cartão)', +40);
  else                       add('Valor dentro do padrão', -10);

  // Country factor (do IP de origem)
  const highRisk = ['UA', 'NG', 'RO'];
  if (highRisk.includes(country)) add(`País de origem do IP é de alto risco (${country})`, +280);
  else if (country !== 'BR')       add('País de origem do IP fora do Brasil', +120);
  else                              add('País do IP combina com cliente (BR)', -20);

  // Hour factor
  if (hour === 'dawn')         add('Compra de madrugada', +130);
  else if (hour === 'evening') add('Noite (suave)', +30);
  else                          add('Horário comercial', -15);

  // Email age (em dias)
  if (isNaN(emailAge) || emailAge < 0) add('Idade de email inválida', 0);
  else if (emailAge < 7)               add('Email criado há <1 semana', +220);
  else if (emailAge < 90)              add('Email recente (<3 meses)', +80);
  else                                  add('Email maduro (>3 meses)', -25);

  // Card
  if (card === 'new')          add('Cartão novo cadastrado hoje', +180);
  else if (card === 'prepaid') add('Cartão pré-pago / virtual', +220);
  else                          add('Cartão conhecido', -40);

  // Velocity
  if (isNaN(velocity) || velocity < 0) add('Velocidade inválida', 0);
  else if (velocity > 10)              add('Velocidade altíssima (>10/h)', +250);
  else if (velocity > 3)               add('Velocidade elevada (>3/h)', +100);
  else                                  add('Velocidade normal', -10);

  // Distance (geolocalização do IP vs endereço cadastrado)
  if (distance === 'far')          add('Geolocalização do IP em outro continente', +200);
  else if (distance === 'country') add('Geolocalização do IP em outro país', +60);
  else if (distance === 'state')   add('Geolocalização do IP em outro estado', +20);
  else                              add('Geolocalização do IP próxima ao endereço', -25);

  // Customer type
  if (customer === 'new')             add('Primeira compra do cliente', +90);
  else if (customer === 'returning')  add('Cliente que volta', +20);
  else                                 add('Cliente recorrente (>5 compras)', -60);

  score = Math.max(0, Math.min(1000, Math.round(score)));
  const decision = score < 300 ? 'APPROVE' : score < 700 ? 'REVIEW' : 'DENY';

  // Hero (decisão é o elemento visual dominante)
  const hero = document.getElementById('fr-decision-hero');
  const heroIcon = document.getElementById('fr-hero-icon');
  const heroLabel = document.getElementById('fr-hero-label');
  const heroMsg = document.getElementById('fr-hero-msg');
  hero.className = 'fr-decision-hero ' + decision.toLowerCase();
  if (decision === 'APPROVE') {
    heroIcon.textContent = '✅';
    heroLabel.textContent = 'APROVAR';
    heroMsg.textContent = 'Risco baixo · libera automaticamente';
  } else if (decision === 'REVIEW') {
    heroIcon.textContent = '⚠️';
    heroLabel.textContent = 'REVISAR';
    heroMsg.textContent = 'Risco médio · revisão humana ou 2FA';
  } else {
    heroIcon.textContent = '🚫';
    heroLabel.textContent = 'NEGAR';
    heroMsg.textContent = 'Risco alto · bloqueia e dispara alerta';
  }

  // Termômetro com marker na posição do score
  const marker = document.getElementById('fr-thermo-marker');
  const markerNum = document.getElementById('fr-marker-num');
  marker.style.left = (score / 1000 * 100) + '%';
  markerNum.textContent = score;

  // Ordena por impacto absoluto (do maior pro menor); agora usa o número de verdade
  factors.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  const list = document.getElementById('fr-factors-list');
  list.innerHTML = '';
  // Barras com escala consistente: max é o maior |value|
  const maxAbs = Math.max(...factors.map(f => Math.abs(f.value)), 1);
  factors.forEach(f => {
    if (f.value === 0) return;
    const isRisk = f.value > 0;
    const tagText = isRisk ? '⚠️ ALERTA' : '✅ SEGURO';
    const intensity = Math.min(100, (Math.abs(f.value) / maxAbs) * 100);
    const el = document.createElement('div');
    el.className = 'fr-factor ' + (isRisk ? 'neg' : 'pos');
    el.innerHTML = `
      <span class="fr-tag">${tagText}</span>
      <span class="fr-label">${f.label}</span>
      <div class="fr-bar"><div class="fr-bar-fill" style="width:${intensity}%"></div></div>
    `;
    list.appendChild(el);
  });
}

document.getElementById('fr-eval').addEventListener('click', frEval);
document.getElementById('fr-reset').addEventListener('click', () => {
  document.getElementById('fr-amount').value = 450;
  document.getElementById('fr-country').value = 'BR';
  document.getElementById('fr-hour').value = 'day';
  document.getElementById('fr-email-age').value = 730;
  document.getElementById('fr-card').value = 'known';
  document.getElementById('fr-velocity').value = 1;
  document.getElementById('fr-distance').value = 'same';
  document.getElementById('fr-customer').value = 'repeat';

  const hero = document.getElementById('fr-decision-hero');
  hero.className = 'fr-decision-hero';
  document.getElementById('fr-hero-icon').textContent = '⏸️';
  document.getElementById('fr-hero-label').textContent = 'AGUARDANDO';
  document.getElementById('fr-hero-msg').textContent = 'Submete uma transação pra avaliar';
  document.getElementById('fr-thermo-marker').style.left = '0%';
  document.getElementById('fr-marker-num').textContent = '···';
  document.getElementById('fr-factors-list').innerHTML = '<span class="fr-empty">Submete uma transação pra ver o detalhamento.</span>';
});

document.getElementById('fr-preset-fraud').addEventListener('click', () => {
  document.getElementById('fr-amount').value = 4800;
  document.getElementById('fr-country').value = 'UA';
  document.getElementById('fr-hour').value = 'dawn';
  document.getElementById('fr-email-age').value = 3;
  document.getElementById('fr-card').value = 'prepaid';
  document.getElementById('fr-velocity').value = 8;
  document.getElementById('fr-distance').value = 'far';
  document.getElementById('fr-customer').value = 'new';
  frEval();
});

document.getElementById('fr-preset-safe').addEventListener('click', () => {
  document.getElementById('fr-amount').value = 220;
  document.getElementById('fr-country').value = 'BR';
  document.getElementById('fr-hour').value = 'day';
  document.getElementById('fr-email-age').value = 1825;
  document.getElementById('fr-card').value = 'known';
  document.getElementById('fr-velocity').value = 0;
  document.getElementById('fr-distance').value = 'same';
  document.getElementById('fr-customer').value = 'repeat';
  frEval();
});

// ============================================================
// MÓDULO 7: OUTROS SERVIÇOS · 6 mini-demos
// ============================================================

// ----- Q DEVELOPER · 4 modos: complete / chat / test / scan -----
const qdevModes = {
  complete: {
    intro: [
      { num: 1, html: '<span class="qdev-c">// Função que valida CPF brasileiro</span>' },
      { num: 2, html: '<span class="qdev-k">function</span> <span class="qdev-fn">validarCPF</span><span class="qdev-pn">(cpf) </span>{' }
    ],
    suggestions: [
      [
        { num: 3, html: '<span class="qdev-c">  // Remove caracteres não numéricos</span>', delay: 200, type: 'final' },
        { num: 4, html: '  cpf = cpf.<span class="qdev-fn">replace</span>(/[^\\d]/g, <span class="qdev-str">""</span>);', delay: 600, type: 'suggest' }
      ],
      [
        { num: 5, html: '  <span class="qdev-k">if</span> (cpf.length !== <span class="qdev-num-lit">11</span>) <span class="qdev-k">return</span> <span class="qdev-num-lit">false</span>;', delay: 200, type: 'suggest' }
      ],
      [
        { num: 6, html: '  <span class="qdev-c">// Calcula primeiro dígito verificador</span>', delay: 200, type: 'final' },
        { num: 7, html: '  <span class="qdev-k">let</span> sum = <span class="qdev-num-lit">0</span>;', delay: 400, type: 'final' },
        { num: 8, html: '  <span class="qdev-k">for</span> (<span class="qdev-k">let</span> i = <span class="qdev-num-lit">0</span>; i &lt; <span class="qdev-num-lit">9</span>; i++) sum += parseInt(cpf[i]) * (<span class="qdev-num-lit">10</span> - i);', delay: 600, type: 'suggest' }
      ],
      [
        { num: 9, html: '  <span class="qdev-k">return</span> validateDigits(cpf, sum);', delay: 200, type: 'suggest' },
        { num: 10, html: '}', delay: 400, type: 'final' }
      ]
    ],
    buttons: [
      { id: 'qdev-suggest-btn', class: 'primary', label: '💡 Próxima sugestão' },
      { id: 'qdev-tab', class: 'ghost', label: '⌨️ Tab pra aceitar' },
      { id: 'qdev-reset-btn', class: 'ghost', label: '↺ Reset' }
    ]
  },
  chat: {
    intro: [
      { num: 1, html: '<span class="qdev-c">// 💬 Pergunta no chat do Q Developer:</span>' },
      { num: 2, html: '<span class="qdev-c">// "Como faço deploy dessa Lambda no SAM?"</span>' }
    ],
    suggestions: [
      [
        { num: 3, html: '<div class="qdev-bot">🤖 <strong>Amazon Q</strong>: Você pode usar <span class="qdev-str">sam build &amp;&amp; sam deploy --guided</span>. Quer que eu gere o template.yaml?</div>', delay: 200, type: 'final' }
      ],
      [
        { num: 4, html: '<span class="qdev-c"># template.yaml gerado pelo Q:</span>', delay: 200, type: 'final' },
        { num: 5, html: '<span class="qdev-k">AWSTemplateFormatVersion</span>: <span class="qdev-str">"2010-09-09"</span>', delay: 350, type: 'final' },
        { num: 6, html: '<span class="qdev-k">Transform</span>: <span class="qdev-str">AWS::Serverless-2016-10-31</span>', delay: 500, type: 'final' },
        { num: 7, html: '<span class="qdev-k">Resources</span>:', delay: 650, type: 'final' },
        { num: 8, html: '  <span class="qdev-k">ValidaCPF</span>:', delay: 800, type: 'final' },
        { num: 9, html: '    <span class="qdev-k">Type</span>: <span class="qdev-str">AWS::Serverless::Function</span>', delay: 950, type: 'final' },
        { num: 10, html: '    <span class="qdev-k">Properties</span>:', delay: 1100, type: 'final' },
        { num: 11, html: '      <span class="qdev-k">Handler</span>: <span class="qdev-str">index.handler</span>', delay: 1250, type: 'final' },
        { num: 12, html: '      <span class="qdev-k">Runtime</span>: <span class="qdev-str">nodejs20.x</span>', delay: 1400, type: 'final' }
      ]
    ],
    buttons: [
      { id: 'qdev-suggest-btn', class: 'primary', label: '💡 Continuar resposta' },
      { id: 'qdev-reset-btn', class: 'ghost', label: '↺ Nova pergunta' }
    ]
  },
  test: {
    intro: [
      { num: 1, html: '<span class="qdev-c">// 🧪 Comando: /test no editor</span>' },
      { num: 2, html: '<span class="qdev-c">// Q lê a função e gera os testes pra você</span>' }
    ],
    suggestions: [
      [
        { num: 3, html: '<span class="qdev-c">// validarCPF.test.js · gerado pelo Q</span>', delay: 200, type: 'final' },
        { num: 4, html: '<span class="qdev-k">describe</span>(<span class="qdev-str">"validarCPF"</span>, () =&gt; {', delay: 350, type: 'final' }
      ],
      [
        { num: 5, html: '  <span class="qdev-k">test</span>(<span class="qdev-str">"aceita CPF válido"</span>, () =&gt; {', delay: 200, type: 'final' },
        { num: 6, html: '    expect(validarCPF(<span class="qdev-str">"123.456.789-09"</span>)).toBe(<span class="qdev-num-lit">true</span>);', delay: 350, type: 'suggest' },
        { num: 7, html: '  });', delay: 500, type: 'final' }
      ],
      [
        { num: 8, html: '  <span class="qdev-k">test</span>(<span class="qdev-str">"rejeita string vazia"</span>, () =&gt; {', delay: 200, type: 'final' },
        { num: 9, html: '    expect(validarCPF(<span class="qdev-str">""</span>)).toBe(<span class="qdev-num-lit">false</span>);', delay: 350, type: 'suggest' },
        { num: 10, html: '  });', delay: 500, type: 'final' }
      ],
      [
        { num: 11, html: '  <span class="qdev-k">test</span>(<span class="qdev-str">"rejeita 11 dígitos iguais"</span>, () =&gt; {', delay: 200, type: 'final' },
        { num: 12, html: '    expect(validarCPF(<span class="qdev-str">"11111111111"</span>)).toBe(<span class="qdev-num-lit">false</span>);', delay: 350, type: 'suggest' },
        { num: 13, html: '  });', delay: 500, type: 'final' },
        { num: 14, html: '});', delay: 650, type: 'final' },
        { num: 15, html: '<div class="qdev-bot qdev-ok">✅ <strong>3 testes</strong> · cobertura estimada: <strong>92%</strong></div>', delay: 800, type: 'final' }
      ]
    ],
    buttons: [
      { id: 'qdev-suggest-btn', class: 'primary', label: '💡 Próximo teste' },
      { id: 'qdev-reset-btn', class: 'ghost', label: '↺ Reset' }
    ]
  },
  security: {
    intro: [
      { num: 1, html: '<span class="qdev-c">// 🛡️ Comando: /scan rodando no projeto…</span>' },
      { num: 2, html: '<span class="qdev-c">// Q analisa CWE, OWASP Top 10, secrets</span>' }
    ],
    suggestions: [
      [
        { num: 3, html: '<div class="qdev-bot qdev-warn">⚠️ <strong>HIGH · CWE-798</strong>: hardcoded credential em <span class="qdev-str">src/db.js:14</span>.<br>Mover pra Secrets Manager via SDK.</div>', delay: 200, type: 'final' }
      ],
      [
        { num: 4, html: '<div class="qdev-bot qdev-warn">⚠️ <strong>MEDIUM · CWE-89</strong>: SQL injection em <span class="qdev-str">api/users.js:42</span>.<br>Use prepared statements (?, $1).</div>', delay: 200, type: 'final' }
      ],
      [
        { num: 5, html: '<div class="qdev-bot qdev-warn">⚠️ <strong>MEDIUM · CWE-79</strong>: XSS em <span class="qdev-str">templates/profile.ejs:8</span>.<br>Escape com <span class="qdev-str">&lt;%- escape(name) %&gt;</span>.</div>', delay: 200, type: 'final' }
      ],
      [
        { num: 6, html: '<div class="qdev-bot qdev-ok">✅ <strong>3 issues</strong> encontradas · 1 high, 2 medium · 0 críticas. Q pode auto-corrigir as 3.</div>', delay: 200, type: 'final' }
      ]
    ],
    buttons: [
      { id: 'qdev-suggest-btn', class: 'primary', label: '💡 Próximo issue' },
      { id: 'qdev-fix-btn', class: 'ghost', label: '✨ Q corrige tudo' },
      { id: 'qdev-reset-btn', class: 'ghost', label: '↺ Reset' }
    ]
  }
};

let qdevCurrentMode = 'complete';
let qdevCurrentStep = 0;

function qdevRender() {
  const m = qdevModes[qdevCurrentMode];
  const editor = document.getElementById('qdev-editor');
  // build intro lines
  let html = '';
  m.intro.forEach(l => {
    html += `<div class="qdev-line"><span class="qdev-num">${l.num}</span><span>${l.html}</span></div>`;
  });
  // already-shown steps
  for (let i = 0; i < qdevCurrentStep; i++) {
    const step = m.suggestions[i];
    step.forEach(l => {
      html += `<div class="qdev-line"><span class="qdev-num">${l.num}</span><span>${l.html}</span></div>`;
    });
  }
  // current cursor
  const cursorNum = (m.intro.length + 1) + (m.suggestions.slice(0, qdevCurrentStep).reduce((a, s) => a + s.length, 0));
  html += `<div class="qdev-line"><span class="qdev-num">${cursorNum}</span><span class="qdev-cur"></span></div>`;
  editor.innerHTML = html;
  editor.scrollTop = editor.scrollHeight;

  // buttons
  const btnEl = document.getElementById('qdev-buttons');
  btnEl.innerHTML = '';
  m.buttons.forEach(b => {
    const bt = document.createElement('button');
    bt.className = 'qdev-btn ' + (b.class || '');
    bt.id = b.id;
    bt.textContent = b.label;
    btnEl.appendChild(bt);
  });
  // bind
  const sBtn = document.getElementById('qdev-suggest-btn');
  if (sBtn) sBtn.addEventListener('click', qdevAdvance);
  const rBtn = document.getElementById('qdev-reset-btn');
  if (rBtn) rBtn.addEventListener('click', qdevReset);
  const tBtn = document.getElementById('qdev-tab');
  if (tBtn) tBtn.addEventListener('click', qdevAdvance);
  const fBtn = document.getElementById('qdev-fix-btn');
  if (fBtn) fBtn.addEventListener('click', () => {
    qdevCurrentStep = qdevModes[qdevCurrentMode].suggestions.length;
    qdevRender();
  });
}

function qdevAdvance() {
  const m = qdevModes[qdevCurrentMode];
  if (qdevCurrentStep < m.suggestions.length) {
    qdevCurrentStep++;
    qdevRender();
  }
}

function qdevReset() {
  qdevCurrentStep = 0;
  qdevRender();
}

document.querySelectorAll('.qdev-tab-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.qdev-tab-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    qdevCurrentMode = b.dataset.qdevTab;
    qdevCurrentStep = 0;
    qdevRender();
  });
});
qdevRender();

// ----- Q QUICKSIGHT (chart variations: bar, line, pie) -----
const qqsAnswers = [
  {
    question: 'Quais foram as vendas por mês em 2025?',
    type: 'line',
    series: [
      { label: 'Jan', v: 1.2 },
      { label: 'Fev', v: 1.5 },
      { label: 'Mar', v: 1.8 },
      { label: 'Abr', v: 1.3 },
      { label: 'Mai', v: 1.6 },
      { label: 'Jun', v: 1.9 },
      { label: 'Jul', v: 1.7 },
      { label: 'Ago', v: 2.0 },
      { label: 'Set', v: 1.85 },
      { label: 'Out', v: 1.95 },
      { label: 'Nov', v: 2.1 },
      { label: 'Dez', v: 2.3 }
    ],
    suffix: 'M',
    chartTypeLabel: '📈 Line chart · ideal para séries temporais',
    narrative: 'Crescimento sustentado: dezembro fechou 92% acima de janeiro. Apenas abril teve queda. Tendência forte → considere expandir capacidade no Q1.'
  },
  {
    question: 'Quais os 5 produtos mais vendidos?',
    type: 'bar',
    series: [
      { label: 'Ração', v: 100, value: '12.450 un' },
      { label: 'Areia', v: 75, value: '9.320 un' },
      { label: 'Brinq.', v: 55, value: '6.870 un' },
      { label: 'Petisco', v: 40, value: '4.910 un' },
      { label: 'Coleira', v: 30, value: '3.720 un' }
    ],
    chartTypeLabel: '🏆 Bar chart · ideal para ranking',
    narrative: 'Ração lidera com 12.450 un, sozinha = 33% do volume top-5. A diferença pra 6º produto é abrupta: o catálogo "long tail" não está performando.'
  },
  {
    question: 'Vendas por região em 2025',
    type: 'bar',
    series: [
      { label: 'SE', v: 100, value: '52%' },
      { label: 'S', v: 50, value: '24%' },
      { label: 'NE', v: 32, value: '14%' },
      { label: 'CO', v: 18, value: '7%' },
      { label: 'N', v: 8, value: '3%' }
    ],
    chartTypeLabel: '🗺️ Bar chart · regional',
    narrative: 'Sudeste sozinho = mais que todas as outras regiões juntas (52%). Norte com menos de 5%: alto custo logístico ou subexposição? Investigar.'
  },
  {
    question: 'Comparativo trimestral',
    type: 'bar',
    series: [
      { label: 'Q1', v: 60, value: 'R$ 4.5M' },
      { label: 'Q2', v: 80, value: 'R$ 5.8M' },
      { label: 'Q3', v: 95, value: 'R$ 6.7M' },
      { label: 'Q4', v: 70, value: 'R$ 5.1M' }
    ],
    chartTypeLabel: '📊 Bar chart · trimestre',
    narrative: 'Q3 é pico (R$ 6.7M). Q4 abaixo de Q2: possível ruptura de estoque pré-natal ou ciclo de campanhas. Cruzar com tabela de estoque.'
  },
  {
    question: 'Mix de categorias do catálogo',
    type: 'pie',
    series: [
      { label: 'Alimentos', v: 42, color: '#FF6B35' },
      { label: 'Higiene', v: 23, color: '#5C8D89' },
      { label: 'Brinquedos', v: 17, color: '#8A6FB1' },
      { label: 'Acessórios', v: 12, color: '#6B8E23' },
      { label: 'Casa', v: 6, color: '#F4D35E' }
    ],
    chartTypeLabel: '🥧 Pie chart · proporção',
    narrative: 'Alimentos puxam 42% do mix de receita. Casa com só 6%: provável que o ticket alto compense o volume baixo. Validar margem por categoria.'
  },
  {
    question: 'Devoluções por mês',
    type: 'line',
    series: [
      { label: 'Jan', v: 0.8 },
      { label: 'Fev', v: 0.7 },
      { label: 'Mar', v: 0.9 },
      { label: 'Abr', v: 1.5 },
      { label: 'Mai', v: 1.3 },
      { label: 'Jun', v: 1.0 },
      { label: 'Jul', v: 0.9 },
      { label: 'Ago', v: 1.1 },
      { label: 'Set', v: 0.8 },
      { label: 'Out', v: 0.7 },
      { label: 'Nov', v: 0.9 },
      { label: 'Dez', v: 1.4 }
    ],
    suffix: '%',
    chartTypeLabel: '📉 Line chart · taxa de devolução',
    narrative: 'Pico em abril (1.5%) e dezembro (1.4%): sazonalidades. Resto do ano abaixo de 1%. Investigar lotes/fornecedores nesses meses específicos.'
  }
];

function qqsRender(idx) {
  const a = qqsAnswers[idx];
  const chart = document.getElementById('qqs-chart');
  const typeEl = document.getElementById('qqs-chart-type');
  document.getElementById('qqs-input').value = a.question;
  typeEl.textContent = a.chartTypeLabel || '';

  if (a.type === 'pie') {
    const total = a.series.reduce((s, x) => s + x.v, 0);
    let cumul = 0;
    const r = 38, cx = 45, cy = 45;
    const slices = a.series.map(s => {
      const start = (cumul / total) * 2 * Math.PI - Math.PI / 2;
      cumul += s.v;
      const end = (cumul / total) * 2 * Math.PI - Math.PI / 2;
      const large = s.v / total > 0.5 ? 1 : 0;
      const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
      return `<path d="M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${s.color}" stroke="#2B1810" stroke-width="1.5"/>`;
    }).join('');
    chart.innerHTML = `
      <div class="qqs-pie-row">
        <svg class="qqs-pie-svg" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
          ${slices}
        </svg>
        <div class="qqs-pie-legend">
          ${a.series.map(s => `
            <div class="row">
              <span class="sw" style="background:${s.color}"></span>
              <span>${s.label}</span>
              <span class="pct">${s.v}%</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="qqs-narrative">💡 ${a.narrative}</div>
    `;
  } else if (a.type === 'line') {
    const w = 280, h = 80, pad = 8;
    const max = Math.max(...a.series.map(s => s.v));
    const points = a.series.map((s, i) => {
      const x = pad + (i / (a.series.length - 1)) * (w - pad * 2);
      const y = h - pad - (s.v / max) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const dots = a.series.map((s, i) => {
      const x = pad + (i / (a.series.length - 1)) * (w - pad * 2);
      const y = h - pad - (s.v / max) * (h - pad * 2);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#FF6B35" stroke="#2B1810" stroke-width="1"/>`;
    }).join('');
    const labels = a.series.map((s, i) => {
      if (a.series.length > 7 && i % 2 !== 0) return ''; // skip odd labels if dense
      const x = pad + (i / (a.series.length - 1)) * (w - pad * 2);
      return `<text x="${x.toFixed(1)}" y="${h - 1}" font-family="JetBrains Mono" font-size="7" fill="#4A3528" text-anchor="middle">${s.label}</text>`;
    }).join('');
    chart.innerHTML = `
      <svg class="qqs-line-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#4A3528" stroke-width="0.5"/>
        <polyline points="${points}" fill="none" stroke="#FF6B35" stroke-width="2"/>
        ${dots}
        ${labels}
      </svg>
      <div class="qqs-narrative">💡 ${a.narrative}</div>
    `;
  } else {
    // bar (default)
    chart.innerHTML = `
      <div class="qqs-bars">
        ${a.series.map(b => `<div class="qqs-bar" style="height: ${b.v}%">${b.value || b.v}</div>`).join('')}
      </div>
      <div class="qqs-labels">
        ${a.series.map(b => `<span>${b.label}</span>`).join('')}
      </div>
      <div class="qqs-narrative">💡 ${a.narrative}</div>
    `;
  }
}

document.querySelectorAll('.qqs-q').forEach(b => {
  b.addEventListener('click', () => qqsRender(parseInt(b.dataset.q)));
});

document.getElementById('qqs-go').addEventListener('click', () => {
  const q = document.getElementById('qqs-input').value.toLowerCase();
  let idx = 0;
  if (q.includes('devoluç') || q.includes('return')) idx = 5;
  else if (q.includes('categor') || q.includes('mix')) idx = 4;
  else if (q.includes('mês') || q.includes('mes ') || q.includes('vendas por mês')) idx = 0;
  else if (q.includes('produto') || q.includes('top') || q.includes('vendido')) idx = 1;
  else if (q.includes('regi') || q.includes('local') || q.includes('estad')) idx = 2;
  else if (q.includes('trim') || q.includes('quart') || q.includes('q1') || q.includes('q2')) idx = 3;
  else idx = Math.floor(Math.random() * qqsAnswers.length);
  qqsRender(idx);
});
qqsRender(0);

// ----- LEX (NLU real via Pollinations LLM, com fallback keyword) -----
// Define os intents do bot (mesmo que você definiria no Lex Console)
const lexBotIntents = {
  AgendarConsulta: {
    description: 'Cliente quer agendar consulta veterinária',
    slots: ['pet', 'data', 'horario'],
    examples: ['quero agendar consulta', 'marcar veterinário', 'agendar pro felix amanhã']
  },
  ComprarRacao: {
    description: 'Cliente quer comprar ração ou alimento',
    slots: ['marca', 'qtd'],
    examples: ['comprar ração', 'preciso de comida pro gato', 'quero ração premium 3kg']
  },
  CancelarPedido: {
    description: 'Cliente quer cancelar um pedido',
    slots: ['pedido'],
    examples: ['cancelar pedido 12345', 'desistir da compra', 'quero cancelar']
  },
  ConsultarPedido: {
    description: 'Cliente quer saber status de um pedido',
    slots: ['pedido'],
    examples: ['status do pedido', 'cadê minha encomenda', 'rastreio do pedido 999']
  },
  Ajuda: {
    description: 'Cliente quer saber o que o bot faz',
    slots: [],
    examples: ['ajuda', 'menu', 'o que vc faz', 'opções']
  },
  Saudacao: {
    description: 'Cumprimento/abertura de conversa',
    slots: [],
    examples: ['oi', 'olá', 'bom dia', 'boa tarde']
  }
};

// Slot definitions: prompt, validation regex/values, e ajuda quando usuário pede
const lexSlotDefs = {
  pet: {
    prompt: 'Qual o nome do pet?',
    help: 'Pode ser qualquer nome. Ex: Felix, Mia, Bidu, Thor.',
    validate: (v) => v && v.length >= 2 && v.length <= 30 && !/\?$/.test(v)
  },
  data: {
    prompt: 'Pra qual dia? (amanhã, terça, sexta, 28/05…)',
    help: 'Aceito: hoje, amanhã, dias da semana (segunda, terça…) ou data DD/MM.',
    validate: (v) => /(hoje|amanh|segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo|\d{1,2}\/\d{1,2})/i.test(v)
  },
  horario: {
    prompt: 'Que horário? (manhã, tarde, 14h, 16h30…)',
    help: 'Aceito: manhã, tarde, noite, ou hora cheia tipo 14h, 16h30.',
    validate: (v) => /(manh|tarde|noite|\d{1,2}h|\d{1,2}:\d{2}|\d{1,2}h\d{2})/i.test(v)
  },
  marca: {
    prompt: 'Qual marca de ração? Temos: **Premium**, **Golden**, **Whiskas**, **Royal Canin**.',
    help: 'Marcas disponíveis: Premium, Golden, Whiskas, Royal Canin. Qual prefere?',
    options: ['premium', 'golden', 'whiskas', 'royal canin', 'royal'],
    validate: function (v) {
      const lower = (v || '').toLowerCase();
      return this.options.some(o => lower.includes(o));
    }
  },
  qtd: {
    prompt: 'Quantos kg? (1, 3, 7, 15)',
    help: 'Tamanhos disponíveis: 1 kg, 3 kg, 7 kg ou 15 kg.',
    options: ['1', '3', '7', '15'],
    validate: function (v) {
      const m = String(v).match(/\b(1|3|7|15)\b/);
      return !!m;
    },
    extract: (v) => {
      const m = String(v).match(/\b(1|3|7|15)\b/);
      return m ? m[1] : v;
    }
  },
  pedido: {
    prompt: 'Qual o número do pedido?',
    help: 'O número aparece no email de confirmação. Geralmente 4 a 6 dígitos.',
    validate: (v) => /\d{3,}/.test(v),
    extract: (v) => {
      const m = String(v).match(/\d{3,}/);
      return m ? m[0] : v;
    }
  }
};

const lexFulfillment = {
  AgendarConsulta: (s) => ({
    msg: `Confirma o agendamento? *${s.pet}* em ${s.data}, ${s.horario}.`,
    askConfirm: true,
    onConfirm: () => `✅ Confirmado! Consulta para *${s.pet}* em ${s.data}, ${s.horario}. SMS enviado.`,
    onDeny: () => `Tudo bem, agendamento cancelado. Em que mais posso ajudar?`
  }),
  ComprarRacao: (s) => ({
    msg: `Confirma o pedido? **${s.marca}** · **${s.qtd}kg** · R$ ${(parseInt(s.qtd) || 5) * 30},00`,
    askConfirm: true,
    onConfirm: () => `✅ Pedido fechado! ${s.marca} ${s.qtd}kg vai chegar em 2 dias. Pagamento via PIX no email.`,
    onDeny: () => `Sem problema, removi do carrinho. Em que mais posso ajudar?`
  }),
  CancelarPedido: (s) => ({
    msg: `Confirma o cancelamento do pedido **#${s.pedido}**? O estorno cai em até 5 dias úteis.`,
    askConfirm: true,
    onConfirm: () => `✅ Pedido #${s.pedido} cancelado. Estorno em até 5 dias úteis.`,
    onDeny: () => `Pedido mantido. Em que mais posso ajudar?`
  }),
  ConsultarPedido: (s) => ({
    msg: `📦 Pedido #${s.pedido}: em trânsito · previsão de entrega em 3 dias úteis.`,
    askConfirm: false
  }),
  Ajuda: () => ({
    msg: `Posso ajudar com:\n📅 agendar consulta\n🥫 comprar ração\n❌ cancelar pedido\n📦 consultar pedido\n📞 falar com humano`,
    askConfirm: false
  }),
  Saudacao: () => ({
    msg: `Oi! 🐾 Como posso ajudar hoje? Posso agendar consulta, vender ração, cancelar/consultar pedido…`,
    askConfirm: false
  })
};

let lexState = { intent: null, slots: {}, nextSlot: null, awaitingConfirm: null };
let lexThinking = false;

function lexUpdateStateBar() {
  const intentEl = document.querySelector('#lex-state-intent strong');
  const slotEl = document.querySelector('#lex-state-slot strong');
  intentEl.textContent = lexState.intent || '···';
  if (lexState.awaitingConfirm) {
    slotEl.textContent = '🔔 confirmação';
  } else {
    slotEl.textContent = lexState.nextSlot || '···';
  }
}

function lexAddMessage(text, type, meta) {
  const chat = document.getElementById('lex-chat');
  const msg = document.createElement('div');
  msg.className = 'lex-msg ' + type;
  // Suporta **bold** simples e \n
  let html = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  msg.innerHTML = html + (meta ? `<span class="meta">${meta}</span>` : '');
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  return msg;
}

function lexShowTyping() {
  const chat = document.getElementById('lex-chat');
  const msg = document.createElement('div');
  msg.className = 'lex-msg bot lex-typing';
  msg.id = 'lex-typing-bubble';
  msg.innerHTML = '<span class="lex-dot"></span><span class="lex-dot"></span><span class="lex-dot"></span>';
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function lexHideTyping() {
  const t = document.getElementById('lex-typing-bubble');
  if (t) t.remove();
}

// Detecta se a entrada é uma "pergunta de socorro" no meio do flow
function lexIsHelpQuestion(input) {
  const lower = input.toLowerCase().trim();
  if (lower.length < 3) return false;
  const helpPatterns = [
    /\?$/,                                                 // termina com ?
    /\b(quais|qual)\b.*(opç|opcao|opção|disponí|tem|aceit)/i,
    /\bnão sei\b|\bnao sei\b/i,
    /\b(que|quais|como)\b.*\b(escolh|selec|prefer|disponí)/i,
    /^(ajuda|help|menu|opções|opcoes|dúvida|duvida)\b/i,
    /\bme\s+ajud/i,
    /\bcomo\s+(funcion|fac|faz)/i,
    /\bo\s+que\s+(eu\s+)?(faç|escolh|tenho)/i
  ];
  return helpPatterns.some(re => re.test(lower));
}

// Fallback keyword-based (intent)
function lexLocalNLU(input) {
  const lower = input.toLowerCase();
  const triggers = [
    ['AgendarConsulta', ['agendar', 'consulta', 'marcar', 'veterinário', 'veterinario']],
    ['ComprarRacao', ['ração', 'racao', 'compra', 'comprar', 'comida']],
    ['CancelarPedido', ['cancelar', 'cancelamento', 'desistir']],
    ['ConsultarPedido', ['status', 'rastreio', 'cadê', 'cade', 'onde está', 'onde esta']],
    ['Saudacao', ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite']],
    ['Ajuda', ['ajuda', 'help', 'menu', 'opções', 'opcoes']]
  ];
  for (const [intent, words] of triggers) {
    if (words.some(w => new RegExp('\\b' + w + '\\b', 'i').test(lower))) {
      return { intent, confidence: 0.78, slots: {}, source: 'keyword-fallback' };
    }
  }
  return { intent: 'FallbackIntent', confidence: 0.0, slots: {}, source: 'keyword-fallback' };
}

// NLU via Pollinations: prompt estruturado pedindo JSON
async function lexCallNLU(input, currentIntent, currentSlots) {
  const intentList = Object.entries(lexBotIntents).map(([n, def]) =>
    `- ${n}: ${def.description}. Slots: [${def.slots.join(', ') || 'nenhum'}]. Ex: ${def.examples.slice(0, 2).join(' / ')}`
  ).join('\n');

  let contextNote = '';
  if (currentIntent) {
    const def = lexBotIntents[currentIntent];
    if (def) {
      const filled = Object.entries(currentSlots || {}).map(([k, v]) => `${k}=${v}`).join(', ') || 'nenhum';
      const missing = def.slots.filter(s => !currentSlots[s]).join(', ') || 'nenhum';
      contextNote = `\nCONTEXTO ATUAL DA CONVERSA:\n- Intent ativa: ${currentIntent}\n- Slots já preenchidos: ${filled}\n- Slots faltando: ${missing}\nO usuário provavelmente está respondendo a um slot. Extraia esse valor.\n`;
    }
  }

  const prompt = `Você é o motor de NLU do Amazon Lex. Analise a mensagem do usuário e retorne APENAS um JSON válido (sem markdown, sem prefixo, sem explicação).

INTENTS DISPONÍVEIS:
${intentList}
${contextNote}
MENSAGEM DO USUÁRIO: "${input}"

FORMATO DE RESPOSTA (JSON estrito, uma linha):
{"intent":"<NomeDaIntent ou FallbackIntent>","confidence":<0 a 1>,"slots":{"<nome_slot>":"<valor extraído>"}}

REGRAS:
- Se a mensagem combina com uma intent, extraia também todos os slots possíveis dela.
- Se há contexto atual, prefira preencher os slots faltando da intent ativa.
- Se o usuário está PERGUNTANDO (ex: "quais opções?", "não sei"), retorne FallbackIntent com confidence 0.
- Slots devem conter apenas o VALOR limpo (ex: "felix", não "o pet é felix").
- Se não detectar intent clara, use "FallbackIntent" com confidence 0.
- NÃO escreva nada além do JSON.`;

  try {
    const url = 'https://text.pollinations.ai/' + encodeURIComponent(prompt);
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('http ' + r.status);
    let txt = (await r.text()).trim();
    txt = txt.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const start = txt.indexOf('{');
    const end = txt.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('no JSON');
    const jsonStr = txt.slice(start, end + 1);
    const parsed = JSON.parse(jsonStr);
    return {
      intent: parsed.intent || 'FallbackIntent',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
      slots: parsed.slots || {},
      source: 'pollinations-llm'
    };
  } catch (e) {
    return null;
  }
}

async function lexProcess(input) {
  if (lexThinking) return;
  lexAddMessage(input, 'user');
  lexThinking = true;

  // ATALHO 0: aguardando confirmação (sim/não)
  if (lexState.awaitingConfirm) {
    const lower = input.toLowerCase().trim();
    const isYes = /^(s|sim|claro|pode|fecha|confirma|ok|isso|positivo|aceito|certo|yep|yes|👍|✅|aff?irma)/i.test(lower);
    const isNo = /^(n|não|nao|nope|nem|cancela|esquece|nego|negativo|👎|❌)/i.test(lower);
    if (isYes) {
      const result = lexState.awaitingConfirm.onConfirm();
      lexAddMessage(result, 'bot', `✅ confirmação aceita · DynamoDB.put_item`);
      lexState = { intent: null, slots: {}, nextSlot: null, awaitingConfirm: null };
      lexUpdateStateBar();
      lexThinking = false;
      return;
    }
    if (isNo) {
      const result = lexState.awaitingConfirm.onDeny();
      lexAddMessage(result, 'bot', `❌ confirmação negada · estado resetado`);
      lexState = { intent: null, slots: {}, nextSlot: null, awaitingConfirm: null };
      lexUpdateStateBar();
      lexThinking = false;
      return;
    }
    // Resposta ambígua → re-pergunta
    lexAddMessage('Por favor responde **sim** ou **não** pra eu finalizar.', 'bot', 'awaiting confirmation · ambiguous');
    lexThinking = false;
    return;
  }

  // ATALHO 1: usuário pediu ajuda no meio do flow
  if (lexState.intent && lexState.nextSlot && lexIsHelpQuestion(input)) {
    const slotDef = lexSlotDefs[lexState.nextSlot];
    if (slotDef) {
      lexAddMessage(slotDef.help, 'bot', `🆘 ajuda no slot "${lexState.nextSlot}" · ${lexState.intent} mantida`);
    } else {
      lexAddMessage('Você está respondendo a pergunta acima. Pode me dizer o valor?', 'bot', 'help mid-flow');
    }
    lexThinking = false;
    return;
  }

  // ATALHO 2: usuário pediu cancelamento mid-flow
  if (lexState.intent && /\b(cancela|esquece|deixa pra lá|deixa pra la|desisti|sair)\b/i.test(input)) {
    lexAddMessage('Tudo bem, cancelei essa solicitação. Em que mais posso ajudar?', 'bot', 'cancellation · resetando state');
    lexState = { intent: null, slots: {}, nextSlot: null, awaitingConfirm: null };
    lexUpdateStateBar();
    lexThinking = false;
    return;
  }

  lexShowTyping();
  let nlu = await lexCallNLU(input, lexState.intent, lexState.slots);
  if (!nlu) nlu = lexLocalNLU(input);
  lexHideTyping();

  const sourceTag = nlu.source === 'pollinations-llm' ? '🌐 LLM-NLU' : '⚠️ keyword';
  const confTag = `${(nlu.confidence * 100).toFixed(0)}%`;

  // === FLUXO COM INTENT ATIVA ===
  if (lexState.intent) {
    const def = lexBotIntents[lexState.intent];
    // Mescla slots que o LLM extraiu validamente
    let absorbed = false;
    Object.entries(nlu.slots || {}).forEach(([k, v]) => {
      if (!v || !def.slots.includes(k)) return;
      const sd = lexSlotDefs[k];
      const cleaned = sd && sd.extract ? sd.extract(v) : v;
      if (sd && sd.validate && !sd.validate.call(sd, cleaned)) return;
      lexState.slots[k] = cleaned;
      absorbed = true;
    });

    // Se o NLU não conseguiu extrair slot do que o usuário disse,
    // tentamos validar a resposta diretamente como o nextSlot
    if (!absorbed && lexState.nextSlot && input.length < 80) {
      const sd = lexSlotDefs[lexState.nextSlot];
      const cleaned = sd && sd.extract ? sd.extract(input) : input.trim();
      if (sd && sd.validate && sd.validate.call(sd, cleaned)) {
        lexState.slots[lexState.nextSlot] = cleaned;
        absorbed = true;
      } else if (sd) {
        // Resposta inválida; re-pergunta com hint
        lexAddMessage(
          `🤔 "${input}" não parece um valor válido pra ${lexState.nextSlot}.\n${sd.help}`,
          'bot',
          `slot inválido · ${sourceTag}`
        );
        lexThinking = false;
        return;
      }
    }

    return lexAdvance(`intent: ${lexState.intent} (mantida) · ${sourceTag}`);
  }

  // === SEM INTENT: detecta nova ===
  if (nlu.intent === 'FallbackIntent' || !lexBotIntents[nlu.intent]) {
    lexAddMessage(
      `🤔 Não entendi. Posso ajudar com: agendar consulta, comprar ração, cancelar pedido, consultar pedido. O que precisa?`,
      'bot', `FallbackIntent · ${confTag} · ${sourceTag}`
    );
    lexThinking = false;
    return;
  }

  // Nova intent
  lexState = { intent: nlu.intent, slots: {}, nextSlot: null };
  Object.entries(nlu.slots || {}).forEach(([k, v]) => {
    if (!v || !lexBotIntents[nlu.intent].slots.includes(k)) return;
    const sd = lexSlotDefs[k];
    const cleaned = sd && sd.extract ? sd.extract(v) : v;
    if (sd && sd.validate && !sd.validate.call(sd, cleaned)) return;
    lexState.slots[k] = cleaned;
  });

  lexAdvance(`intent: ${nlu.intent} (${confTag}) · ${sourceTag}`);
}

function lexAdvance(meta) {
  const intent = lexState.intent;
  const def = lexBotIntents[intent];
  if (!def) {
    lexThinking = false;
    return;
  }
  // Intent sem slot → executa direto
  if (def.slots.length === 0) {
    const ff = lexFulfillment[intent](lexState.slots);
    lexAddMessage(ff.msg, 'bot', `Lambda fulfillment ✓ · ${meta}`);
    lexState = { intent: null, slots: {}, nextSlot: null, awaitingConfirm: null };
    lexUpdateStateBar();
    lexThinking = false;
    return;
  }
  // Próximo slot vazio
  const nextSlot = def.slots.find(s => !lexState.slots[s]);
  if (nextSlot) {
    lexState.nextSlot = nextSlot;
    const filled = Object.keys(lexState.slots).length;
    const total = def.slots.length;
    const sd = lexSlotDefs[nextSlot];
    const promptText = sd ? sd.prompt : `Qual o ${nextSlot}?`;
    lexAddMessage(promptText, 'bot', `${meta} · slots: ${filled}/${total}`);
    lexUpdateStateBar();
    lexThinking = false;
    return;
  }
  // Todos os slots cheios → fulfillment com possível confirmação
  const ff = lexFulfillment[intent](lexState.slots);
  if (ff.askConfirm) {
    lexState.awaitingConfirm = ff;
    lexState.nextSlot = null;
    lexAddMessage(ff.msg, 'bot', `🔔 ConfirmationPrompt · ${meta} · aguardando sim/não`);
    lexUpdateStateBar();
    lexThinking = false;
    return;
  }
  // Sem confirmação → executa direto
  lexAddMessage(ff.msg, 'bot', `Lambda fulfillment ✓ · ${meta} · DynamoDB.put_item`);
  lexState = { intent: null, slots: {}, nextSlot: null, awaitingConfirm: null };
  lexUpdateStateBar();
  lexThinking = false;
}

document.getElementById('lex-send').addEventListener('click', () => {
  const v = document.getElementById('lex-input').value.trim();
  if (!v || lexThinking) return;
  lexProcess(v);
  document.getElementById('lex-input').value = '';
});
document.getElementById('lex-input').addEventListener('keypress', e => {
  if (e.key === 'Enter') document.getElementById('lex-send').click();
});
document.querySelectorAll('.lex-sugg').forEach(b => {
  b.addEventListener('click', () => {
    document.getElementById('lex-input').value = b.dataset.sugg;
    document.getElementById('lex-send').click();
  });
});

// Mic via Web Speech Recognition (mantido)
const LexSR = window.SpeechRecognition || window.webkitSpeechRecognition;
let lexRec = null;
let lexRecording = false;
document.getElementById('lex-mic').addEventListener('click', () => {
  if (!LexSR) {
    lexAddMessage('🎙️ Microfone não suportado nesse navegador (use Chrome/Edge).', 'bot', 'no Web Speech API');
    return;
  }
  const btn = document.getElementById('lex-mic');
  if (lexRecording) {
    if (lexRec) lexRec.stop();
    lexRecording = false;
    btn.classList.remove('recording');
    return;
  }
  lexRec = new LexSR();
  lexRec.lang = 'pt-BR';
  lexRec.continuous = false;
  lexRec.interimResults = false;
  lexRec.onstart = () => { lexRecording = true; btn.classList.add('recording'); };
  lexRec.onresult = (e) => {
    const txt = e.results[0][0].transcript;
    document.getElementById('lex-input').value = txt;
    document.getElementById('lex-send').click();
  };
  lexRec.onend = () => { lexRecording = false; btn.classList.remove('recording'); };
  lexRec.onerror = () => { lexRecording = false; btn.classList.remove('recording'); };
  try { lexRec.start(); } catch (err) {}
});

setTimeout(() => {
  lexAddMessage('🐈 Oi! Sou o gato-bot do Petshop Bigode. NLU rodando ao vivo via LLM. Pode digitar livre, não precisa palavra-chave exata.', 'bot', 'session start');
  lexUpdateStateBar();
}, 100);

// ----- TITAN (with playground per model + escala mensal) -----
const titanModels = {
  'text-express': {
    name: 'Titan Text Express',
    desc: 'Texto generalista. Bom equilíbrio entre custo e qualidade. 8K context.',
    bullets: ['8K tokens contexto', '~32 idiomas', '$0.0008/1K input · $0.0016/1K output', 'Sumarização, Q&A, geração'],
    inputCost: 0.0008,
    playground: () => `<span class="titan-pg-prompt">prompt: "Resuma em 2 linhas: o gato Felix subiu no telhado e ficou observando os pássaros, recusando descer mesmo quando chamado pra jantar."</span>
<div class="titan-pg-result">📝 <span class="em">Felix subiu ao telhado e fixou-se a observar pássaros.</span> <span class="em">Ignora chamados para o jantar.</span></div>`
  },
  'text-lite': {
    name: 'Titan Text Lite',
    desc: 'Versão econômica. Pra resumos curtos, classificação, tarefas focadas.',
    bullets: ['4K tokens contexto', '~32 idiomas', '$0.0003/1K input · $0.0004/1K output', 'Resumo, classificação, intent'],
    inputCost: 0.0003,
    playground: () => `<span class="titan-pg-prompt">prompt: "Classifique o sentimento: 'Adorei o atendimento, super atencioso!'"</span>
<div class="titan-pg-result">🏷️ <span class="em">POSITIVE · 0.96</span></div>`
  },
  'embed-v2': {
    name: 'Titan Embeddings v2',
    desc: 'Embeddings de texto pra busca semântica e RAG. Multilíngue.',
    bullets: ['1024 dim (configurável: 256/512/1024)', '8K tokens input', '$0.00002/1K tokens', 'RAG, similarity, classificação'],
    inputCost: 0.00002,
    playground: () => {
      const dims = Array.from({ length: 12 }, () => (Math.random() * 2 - 1).toFixed(2));
      return `<span class="titan-pg-prompt">embed("gato dorme no sofá") → vetor de 1024 dimensões (mostrando 12):</span>
<div class="titan-pg-vector">${dims.map(d => `<span>${d}</span>`).join('')}</div>`;
    }
  },
  image: {
    name: 'Titan Image Generator G1',
    desc: 'Gera e edita imagens. 512×512 ou 1024×1024. Inpainting, outpainting, variações.',
    bullets: ['512×512 e 1024×1024', 'Inpainting / outpainting', '$0.008/imagem (standard)', 'Geração, edição, mascaramento'],
    inputCost: 0.008,
    playground: () => `<span class="titan-pg-prompt">prompt: "cute orange cat astronaut, watercolor style, 4 variants"</span>
<div class="titan-pg-image">
  <div class="titan-pg-image-tile">🐈‍🚀</div>
  <div class="titan-pg-image-tile">😺</div>
  <div class="titan-pg-image-tile">🦁</div>
  <div class="titan-pg-image-tile">😼</div>
</div>`
  }
};

function titanRender(key) {
  const m = titanModels[key];
  document.getElementById('titan-info').innerHTML = `
    <h6>${m.name}</h6>
    <p style="font-size: 11.5px; color: var(--cream-2); margin-bottom: 6px;">${m.desc}</p>
    <ul>${m.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
  `;
  document.getElementById('titan-playground').innerHTML = m.playground();
  titanUpdateCost(key);
}

function titanUpdateCost(key) {
  const tokens = parseInt(document.getElementById('titan-tokens').value);
  const m = titanModels[key];
  const cost = key === 'image' ? m.inputCost * (tokens / 1000) : (tokens / 1000) * m.inputCost;
  document.getElementById('titan-tokens-v').textContent = tokens.toLocaleString('pt-BR');
  let costStr = '~$' + cost.toFixed(cost < 0.01 ? 4 : 2);
  if (key === 'image') {
    const imgs = Math.round(tokens / 1000);
    costStr = `~$${cost.toFixed(2)} · ${imgs.toLocaleString('pt-BR')} imagens/mês`;
  } else {
    costStr += '/mês';
  }
  document.getElementById('titan-cost-r').textContent = costStr;
}

document.querySelectorAll('.titan-model').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.titan-model').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    titanRender(b.dataset.tm);
  });
});
document.getElementById('titan-tokens').addEventListener('input', () => {
  const active = document.querySelector('.titan-model.active');
  if (active) titanUpdateCost(active.dataset.tm);
});
titanRender('text-express');

// ----- NOVA (chama Pollinations API de verdade pra texto e imagem) -----

let novaCurrentTier = 'micro';
let novaCurrentPrompt = 'gato detetive';
let novaGenerating = false;
let novaSessionCount = 0;
let novaTypeTimer = null;

const novaTiers = {
  micro: { name: 'Nova Micro', desc: 'Texto puro, ultra-rápido e barato.', specs: { 'Tipo': 'Texto', 'Contexto': '128K', 'Latência': '<200ms', 'Custo': '$0.000035/1K' }, compare: { speed: 100, quality: 55, cost: 95 } },
  lite:  { name: 'Nova Lite',  desc: 'Multimodal (texto + imagem + vídeo).',     specs: { 'Tipo': 'Multimodal', 'Contexto': '300K', 'Inputs': 'Text+Img+Vid', 'Custo': '$0.0006/1K' }, compare: { speed: 75, quality: 75, cost: 75 } },
  pro:   { name: 'Nova Pro',   desc: 'Topo multimodal. Reasoning forte.',         specs: { 'Tipo': 'Multimodal', 'Contexto': '300K', 'Reasoning': 'Avançado', 'Custo': '$0.008/1K' }, compare: { speed: 50, quality: 95, cost: 35 } },
  canvas:{ name: 'Nova Canvas',desc: 'Geração e edição de imagens em qualidade studio.', specs: { 'Tipo': 'Image gen', 'Resolução': 'até 2048×2048', 'Variantes': '1-4', 'Custo': '$0.04/img' }, compare: { speed: 40, quality: 90, cost: 50 } },
  reel:  { name: 'Nova Reel',  desc: 'Vídeo de 6s, 720p, 24fps. Concorrente do Sora.', specs: { 'Tipo': 'Video gen', 'Duração': '6s', 'Resolução': '1280×720', 'Custo': '$0.80/vídeo' }, compare: { speed: 15, quality: 85, cost: 15 } }
};

// Pollinations endpoints (free, sem API key, com CORS aberto)
const POLL_TXT = 'https://text.pollinations.ai/';
const POLL_IMG = 'https://image.pollinations.ai/prompt/';

async function novaCallText(prompt) {
  try {
    const url = POLL_TXT + encodeURIComponent(prompt);
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('http ' + r.status);
    const txt = await r.text();
    return txt.trim();
  } catch (e) {
    return null;
  }
}

function novaImageURL(prompt, seed, w, h) {
  const params = new URLSearchParams({
    width: String(w || 512),
    height: String(h || 512),
    seed: String(seed),
    nologo: 'true',
    model: 'flux'
  });
  return POLL_IMG + encodeURIComponent(prompt) + '?' + params.toString();
}

function novaTypewrite(el, text, cb) {
  if (novaTypeTimer) { clearInterval(novaTypeTimer); novaTypeTimer = null; }
  el.textContent = '';
  let i = 0;
  novaTypeTimer = setInterval(() => {
    if (i < text.length) {
      el.textContent = text.slice(0, ++i) + '▌';
    } else {
      el.textContent = text;
      clearInterval(novaTypeTimer);
      novaTypeTimer = null;
      if (cb) cb();
    }
  }, 18);
}

function novaShell(tier, bodyHTML, headerExtra) {
  const t = novaTiers[tier];
  const specs = Object.entries(t.specs).map(([k, v]) =>
    `<div class="spec">${k} <span>${v}</span></div>`
  ).join('');
  document.getElementById('nova-display').innerHTML = `
    <div class="nova-display-head">
      <h6>${t.name}</h6>
      <span class="nova-session-pill">${headerExtra || 'geração #' + novaSessionCount}</span>
    </div>
    <p class="nova-tier-desc">${t.desc}</p>
    <div class="specs">${specs}</div>
    <div class="demo-out">${bodyHTML}</div>
  `;
  // comparison bars
  const c = t.compare;
  document.getElementById('nova-compare').innerHTML = `
    <div class="nova-compare-head">📊 Vs. concorrentes (mock)</div>
    <div class="nova-bar-row"><span class="lbl">⚡ Speed</span><div class="bar"><div class="fill" style="width:${c.speed}%"></div></div><span class="v">${c.speed}/100</span></div>
    <div class="nova-bar-row"><span class="lbl">🎯 Quality</span><div class="bar"><div class="fill" style="width:${c.quality}%; background: var(--olive);"></div></div><span class="v">${c.quality}/100</span></div>
    <div class="nova-bar-row"><span class="lbl">💰 Custo-benefício</span><div class="bar"><div class="fill" style="width:${c.cost}%; background: var(--purple);"></div></div><span class="v">${c.cost}/100</span></div>
  `;
}

function novaLoadingHTML(tier, label) {
  return `<div class="nova-loading">
    <span class="nova-spinner"></span>
    <span>${label || 'Chamando Pollinations API…'}</span>
  </div>`;
}

async function novaRunMicro() {
  novaShell('micro', novaLoadingHTML('micro', 'Gerando texto via API real…'));
  const t0 = performance.now();
  const sysPrompt = `Em uma frase curta, criativa e em português brasileiro, descreva: ${novaCurrentPrompt}. Apenas a frase, nada mais.`;
  const text = await novaCallText(sysPrompt);
  const ms = Math.round(performance.now() - t0);
  if (!text) {
    novaShell('micro', `<div class="nova-out-text" style="color:var(--coral)">⚠️ API offline. Tenta de novo em alguns segundos.</div>`);
    return;
  }
  novaShell('micro',
    `<div class="nova-out-text" id="nova-typed"></div>
     <div class="nova-out-meta">⚡ ${ms}ms · ~${text.split(/\s+/).length} tokens · stream · 🌐 pollinations.ai</div>`
  );
  const el = document.getElementById('nova-typed');
  if (el) novaTypewrite(el, text);
}

async function novaRunLite() {
  novaShell('lite', novaLoadingHTML('lite', 'Análise multimodal via API real…'));
  const t0 = performance.now();
  const sysPrompt = `Você é um analisador de imagem. Analise o seguinte conceito: "${novaCurrentPrompt}". Retorne EXATAMENTE no formato:
Tema: <substantivo curto>
Mood: <adjetivo>
Composição: <opção>
Iluminação: <opção>
Postura: <opção>
Apenas as 5 linhas, em português, sem explicações.`;
  const text = await novaCallText(sysPrompt);
  const ms = Math.round(performance.now() - t0);
  if (!text) {
    novaShell('lite', `<div class="nova-out-text" style="color:var(--coral)">⚠️ API offline.</div>`);
    return;
  }
  // parse the 5 lines into bullet list
  const lines = text.split('\n').map(l => l.trim()).filter(l => l && l.includes(':'));
  const icons = { 'tema': '🔍', 'mood': '🎨', 'composição': '📐', 'composicao': '📐', 'iluminação': '💡', 'iluminacao': '💡', 'postura': '🎭' };
  const formatted = lines.slice(0, 5).map(l => {
    const [k, ...rest] = l.split(':');
    const key = k.toLowerCase().trim();
    const ic = icons[key] || '•';
    const v = rest.join(':').trim();
    return `<li>${ic} <strong>${k.trim()}:</strong> ${v}</li>`;
  }).join('');
  novaShell('lite',
    `<div class="nova-out-header">📊 Análise multimodal de "${novaCurrentPrompt}"</div>
     <ul class="nova-out-list">${formatted}</ul>
     <div class="nova-out-meta">🖼️📝 ${ms}ms · ~${text.split(/\s+/).length} tokens · 🌐 pollinations.ai</div>`
  );
}

async function novaRunPro() {
  novaShell('pro', novaLoadingHTML('pro', 'Reasoning chain-of-thought via API real…'));
  const t0 = performance.now();
  const sysPrompt = `Faça raciocínio passo-a-passo (chain-of-thought) sobre: "${novaCurrentPrompt}". Em português, retorne EXATAMENTE 4 passos curtos no formato:
1. <título>: <explicação curta em uma frase>
2. <título>: <explicação curta em uma frase>
3. <título>: <explicação curta em uma frase>
4. <título>: <explicação curta em uma frase>
Apenas os 4 itens, sem introdução nem conclusão.`;
  const text = await novaCallText(sysPrompt);
  const ms = Math.round(performance.now() - t0);
  if (!text) {
    novaShell('pro', `<div class="nova-out-text" style="color:var(--coral)">⚠️ API offline.</div>`);
    return;
  }
  // parse "1. title: body"
  const stepRegex = /^\s*(\d+)[\.\)]\s*([^:]+?):\s*(.+)$/gm;
  const steps = [];
  let m;
  while ((m = stepRegex.exec(text)) !== null && steps.length < 4) {
    steps.push({ n: m[1], title: m[2].trim(), body: m[3].trim() });
  }
  if (steps.length === 0) {
    // fallback: split by line numbers
    text.split('\n').filter(l => /^\d/.test(l.trim())).slice(0, 4).forEach((l, i) => {
      steps.push({ n: i + 1, title: 'Passo ' + (i + 1), body: l.replace(/^\d+[\.\)]\s*/, '').trim() });
    });
  }
  const stepsHTML = steps.map(s =>
    `<div class="nova-step"><strong>${['1️⃣','2️⃣','3️⃣','4️⃣'][s.n-1] || s.n} ${s.title}</strong><p>${s.body}</p></div>`
  ).join('');
  novaShell('pro',
    `<div class="nova-out-header">🧠 Reasoning sobre "${novaCurrentPrompt}"</div>
     <div class="nova-out-steps">${stepsHTML}</div>
     <div class="nova-out-meta">🧠 ${(ms/1000).toFixed(2)}s · ~${text.split(/\s+/).length} tokens · 🌐 pollinations.ai</div>`
  );
}

async function novaRunCanvas() {
  // gera 4 imagens reais com seeds diferentes
  const seeds = [
    Math.floor(Math.random() * 99999),
    Math.floor(Math.random() * 99999),
    Math.floor(Math.random() * 99999),
    Math.floor(Math.random() * 99999)
  ];
  const tilesHTML = seeds.map(s =>
    `<div class="nova-canvas-tile loading" data-seed="${s}">
      <span class="nova-canvas-load">⏳</span>
    </div>`
  ).join('');
  novaShell('canvas',
    `<div class="nova-out-header">🎨 4 variantes de "${novaCurrentPrompt}"</div>
     <div class="nova-canvas-result">${tilesHTML}</div>
     <div class="nova-out-meta" id="nova-canvas-meta">🖼️ 512×512 · seeds: ${seeds.join(', ')} · 🌐 pollinations.ai · flux model</div>`
  );
  // Carrega 4 imagens em série (Pollinations rate-limita conexões paralelas).
  // Cada imagem aguarda antes de chamar a próxima (stagger 600ms entre chamadas).
  const tiles = document.querySelectorAll('.nova-canvas-result .nova-canvas-tile');
  function loadOne(idx, attempts) {
    return new Promise(resolve => {
      const tile = tiles[idx];
      if (!tile) { resolve(); return; }
      const seed = seeds[idx];
      const url = novaImageURL(novaCurrentPrompt, seed, 512, 512);
      const img = new Image();
      img.onload = () => {
        tile.classList.remove('loading');
        tile.style.backgroundImage = `url("${url}")`;
        tile.style.backgroundSize = 'cover';
        tile.style.backgroundPosition = 'center';
        tile.innerHTML = '';
        resolve();
      };
      img.onerror = () => {
        if ((attempts || 0) < 2) {
          // retry com 1s de espera
          setTimeout(() => loadOne(idx, (attempts || 0) + 1).then(resolve), 1000);
        } else {
          tile.classList.remove('loading');
          tile.classList.add('error');
          tile.innerHTML = '<span style="font-size:18px">❌</span>';
          tile.title = 'Falhou após 3 tentativas. Clica nessa tile pra tentar de novo.';
          tile.addEventListener('click', () => {
            tile.classList.remove('error');
            tile.classList.add('loading');
            tile.innerHTML = '<span class="nova-canvas-load">⏳</span>';
            loadOne(idx, 0);
          }, { once: true });
          resolve();
        }
      };
      img.src = url;
    });
  }
  // Roda 1 por vez com pequeno gap pra Pollinations não rate-limitar
  for (let i = 0; i < seeds.length; i++) {
    await loadOne(i, 0);
    if (i < seeds.length - 1) await new Promise(r => setTimeout(r, 200));
  }
}

async function novaRunReel() {
  const seed = Math.floor(Math.random() * 99999);
  const camera = ['dolly-in', 'crane down', 'tracking lateral', 'close-up', 'wide shot'][Math.floor(Math.random() * 5)];
  novaShell('reel',
    `<div class="nova-out-header">🎬 Vídeo 6s de "${novaCurrentPrompt}"</div>
     <div class="nova-reel-frame loading">
       <span class="nova-canvas-load">⏳ renderizando primeiro frame…</span>
       <div class="nova-reel-controls">
         <span class="nova-reel-play">▶</span>
         <div class="nova-reel-progress"><div class="nova-reel-bar"></div></div>
         <span class="nova-reel-time">0:06</span>
       </div>
       <div class="nova-reel-meta">⏱ 0:06 · 1280×720 · 24fps</div>
     </div>
     <p style="font-size: 11px; margin-top: 6px; color: rgba(255,249,236,0.7); font-style: italic;">"${novaCurrentPrompt}" · cinematic · cam: ${camera} · seed ${seed}</p>
     <div class="nova-out-meta">🎥 Frame estático real · 🌐 pollinations.ai (geração de vídeo full não disponível na API free)</div>`
  );
  // Carrega 1 imagem como frame inicial
  const url = novaImageURL(novaCurrentPrompt + ', cinematic, ' + camera, seed, 640, 360);
  const img = new Image();
  img.onload = () => {
    const frame = document.querySelector('.nova-reel-frame');
    if (!frame) return;
    frame.classList.remove('loading');
    frame.style.backgroundImage = `url(${url})`;
    frame.style.backgroundSize = 'cover';
    frame.style.backgroundPosition = 'center';
    const load = frame.querySelector('.nova-canvas-load');
    if (load) load.remove();
  };
  img.onerror = () => {
    const frame = document.querySelector('.nova-reel-frame');
    if (frame) {
      frame.classList.add('error');
      const load = frame.querySelector('.nova-canvas-load');
      if (load) load.textContent = '❌ falhou';
    }
  };
  img.src = url;
}

async function novaGenerate() {
  if (novaGenerating) return;
  const v = document.getElementById('nova-prompt').value.trim();
  if (v) novaCurrentPrompt = v;
  novaGenerating = true;
  novaSessionCount++;
  try {
    if (novaCurrentTier === 'micro') await novaRunMicro();
    else if (novaCurrentTier === 'lite') await novaRunLite();
    else if (novaCurrentTier === 'pro') await novaRunPro();
    else if (novaCurrentTier === 'canvas') await novaRunCanvas();
    else if (novaCurrentTier === 'reel') await novaRunReel();
  } finally {
    novaGenerating = false;
  }
}

// boot inicial: só shell, sem disparar API
function novaRenderInitial() {
  novaShell(novaCurrentTier,
    `<div class="nova-out-text" style="color: rgba(255,249,236,0.55); font-style: italic;">
      🌟 Clica em <strong>"▶️ Gerar"</strong> ou troca de tier pra chamar a Pollinations API ao vivo.
      <br><br>Cada tier vai produzir um output real e diferente.
    </div>`,
    'aguardando'
  );
}

document.querySelectorAll('.nova-tier').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.nova-tier').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    novaCurrentTier = b.dataset.tier;
    novaGenerate();
  });
});

document.getElementById('nova-go').addEventListener('click', novaGenerate);
document.getElementById('nova-prompt').addEventListener('keypress', e => {
  if (e.key === 'Enter') novaGenerate();
});

document.getElementById('nova-prompt').placeholder = 'ex: gato detetive, paisagem ao pôr do sol, robô fofo…';

novaSessionCount = 0;
novaRenderInitial();

// ----- OPENSEARCH (suggestions + per-mode explanation + better synonym highlight) -----
const osDocs = [
  { id: 1, title: 'Receita: Curry de frango apimentado', body: 'Curry indiano com pimenta-malagueta, gengibre, leite de coco quente. Servir bem fresquinho com arroz basmati.' },
  { id: 2, title: 'Sopa quente de abóbora', body: 'Sopa cremosa de abóbora cabotiá, gengibre fresco, leite de coco. Quentinha pra dias frios.' },
  { id: 3, title: 'Sushi de salmão', body: 'Salmão cru fresco, arroz japonês temperado com vinagre. Servir com molho shoyu, gengibre e wasabi.' },
  { id: 4, title: 'Tacos picantes mexicanos', body: 'Tortilhas com carne moída temperada com chile, jalapeño, cominho. Bem picante, bem quente.' },
  { id: 5, title: 'Chá gelado de hibisco', body: 'Bebida fria refrescante com flores de hibisco, mel e limão. Pra dias quentes de verão.' },
  { id: 6, title: 'Macarrão Aglio e Olio', body: 'Espaguete com alho dourado, azeite extra virgem, pimenta calabresa. Italiano simples e quente.' },
  { id: 7, title: 'Salada Caesar fria', body: 'Folhas de alface americana, queijo parmesão, croutons, molho cremoso. Refrescante.' }
];

const osConcepts = {
  'apimentada': ['picante', 'pimenta', 'malagueta', 'jalapeño', 'chile', 'calabresa'],
  'apimentado': ['picante', 'pimenta', 'malagueta', 'jalapeño', 'chile', 'calabresa'],
  'picante': ['apimentada', 'pimenta', 'malagueta', 'jalapeño', 'chile', 'calabresa'],
  'comida': ['receita', 'curry', 'sopa', 'sushi', 'tacos', 'macarrão', 'salada', 'salmão'],
  'almoço': ['receita', 'curry', 'sopa', 'sushi', 'tacos', 'macarrão', 'salada', 'salmão'],
  'quente': ['quentinha', 'fresquinho'],
  'fresca': ['gelado', 'fresquinha', 'fria', 'refrescante'],
  'fresco': ['gelado', 'fresquinha', 'fria', 'refrescante'],
  'frio': ['gelado', 'fresquinha', 'fria', 'refrescante'],
  'verão': ['gelado', 'refrescante', 'fria'],
  'bebida': ['chá', 'leite', 'limão'],
  'japonês': ['sushi', 'salmão', 'shoyu', 'wasabi'],
  'cru': ['fresco', 'sushi', 'salmão'],
  'rápida': ['simples', 'macarrão', 'aglio'],
  'massa': ['macarrão', 'espaguete']
};

function osHighlight(text, tokens, mode) {
  let out = text;
  // Highlight exact matches
  tokens.forEach(t => {
    if (!t) return;
    const re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    out = out.replace(re, '<em>$1</em>');
  });
  // Highlight synonyms (only in vec/hyb)
  if (mode !== 'kw') {
    const synSet = new Set();
    tokens.forEach(t => (osConcepts[t] || []).forEach(s => synSet.add(s)));
    synSet.forEach(s => {
      const re = new RegExp('(' + s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      out = out.replace(re, '<em class="synonym">$1</em>');
    });
  }
  return out;
}

function osSearch(query, mode) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const tokens = q.split(/\s+/);

  return osDocs.map(doc => {
    const text = (doc.title + ' ' + doc.body).toLowerCase();
    let score = 0;

    if (mode === 'kw') {
      tokens.forEach(t => {
        const matches = (text.match(new RegExp('\\b' + t + '\\b', 'g')) || []).length;
        score += matches * 2;
      });
    } else if (mode === 'vec') {
      tokens.forEach(t => {
        if (text.includes(t)) score += 10;
        const syns = osConcepts[t] || [];
        syns.forEach(s => { if (text.includes(s)) score += 7; });
      });
      tokens.forEach(t => { if (doc.title.toLowerCase().includes(t)) score += 5; });
    } else { // hybrid
      tokens.forEach(t => {
        const matches = (text.match(new RegExp('\\b' + t + '\\b', 'g')) || []).length;
        score += matches * 2;
        const syns = osConcepts[t] || [];
        syns.forEach(s => { if (text.includes(s)) score += 4; });
      });
    }

    return { ...doc, score, snippet: osHighlight(doc.body, tokens, mode), titleHi: osHighlight(doc.title, tokens, mode) };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
}

const osModeExplain = {
  kw: '🔤 <strong>Keyword</strong>: BM25 / TF-IDF. Casa só palavras exatas. Rápido e barato. Não pega sinônimos.',
  vec: '🧠 <strong>Semantic (k-NN)</strong>: usa embeddings (vetores). Casa por significado: "quente" pega "quentinha", "fria" pega "gelado".',
  hyb: '🔀 <strong>Híbrido</strong>: combina os dois com peso. Estado da arte hoje pra busca de produção (RAG, e-commerce).'
};

function osRender() {
  const q = document.getElementById('os-input').value;
  const mode = document.querySelector('.os-mode.active').dataset.mode;
  document.getElementById('os-explain').innerHTML = osModeExplain[mode];

  const results = osSearch(q, mode);
  const out = document.getElementById('os-results');
  if (!q.trim()) {
    out.innerHTML = '<div style="text-align: center; padding: 14px; color: var(--ink-soft); font-style: italic; font-size: 12px;">Digite uma busca pra começar.</div>';
    return;
  }
  if (results.length === 0) {
    out.innerHTML = `<div style="text-align: center; padding: 14px; color: var(--ink-soft); font-style: italic; font-size: 12px;">Nenhum resultado pra "${q}" no modo ${mode}. ${mode === 'kw' ? 'Tenta o modo Semantic, entende sinônimos.' : ''}</div>`;
    return;
  }
  out.innerHTML = '';
  results.forEach((r, i) => {
    const el = document.createElement('div');
    el.className = 'os-hit';
    el.style.animationDelay = (i * 0.06) + 's';
    el.innerHTML = `
      <div>
        <div class="title">${r.titleHi}</div>
        <div class="snippet">${r.snippet}</div>
      </div>
      <div class="score">${r.score.toFixed(1)}</div>
    `;
    out.appendChild(el);
  });
}

document.querySelectorAll('.os-mode').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.os-mode').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    osRender();
  });
});
document.getElementById('os-input').addEventListener('input', osRender);
document.querySelectorAll('.os-sug').forEach(b => {
  b.addEventListener('click', () => {
    document.getElementById('os-input').value = b.dataset.sug;
    osRender();
  });
});
osRender();

// ----- PERSONALIZE personas (auto-curtir um conjunto) -----
const recPersonas = {
  newbie: ['r1', 's1', 'h2'],
  gourmet: ['r2', 'r3', 'r4'],
  player: ['t1', 't2', 't3', 't4'],
  hygienic: ['s1', 's2', 's3', 'h4']
};

document.querySelectorAll('.rec-persona-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.rec-persona-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const ids = recPersonas[b.dataset.persona] || [];
    recLikes = new Set(ids);
    recRender();
    recComputeRecos();
  });
});

