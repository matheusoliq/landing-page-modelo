/* ============================================================================
   APPS-SCRIPT.GS
   ----------------------------------------------------------------------------
   Cole todo o conteúdo deste arquivo no editor de Apps Script vinculado à
   sua planilha do Google Sheets (veja o passo a passo em README.md, nesta
   mesma pasta).

   O que este script faz:
     1. Recebe cada pedido finalizado no site (enviado via fetch/POST pelo
        js/script.js) como um JSON.
     2. Grava um resumo do pedido na aba "Pedidos" (uma linha por pedido).
     3. Grava cada item do pedido na aba "Itens_Pedidos" (uma linha por
        produto, o que permite calcular facilmente "produto mais vendido").
     4. Cria as abas e os cabeçalhos automaticamente, caso ainda não existam
        — você não precisa criar nada manualmente na planilha.
   ========================================================================== */

// Nomes das abas (se quiser renomear, troque aqui — e nas fórmulas do README)
const ABA_PEDIDOS = "Pedidos";
const ABA_ITENS = "Itens_Pedidos";

// Cabeçalhos de cada aba, na ordem em que as colunas serão preenchidas
const CABECALHOS_PEDIDOS = [
  "Data/Hora", "Qtd. Itens", "Subtotal", "Taxa de Entrega", "Total",
  "Forma de Recebimento", "Nome", "Telefone", "Endereço", "Bairro", "Cidade", "CEP", "Referência"
];

const CABECALHOS_ITENS = [
  "Data/Hora", "Produto", "Quantidade", "Preço Unitário",
  "Adicionais", "Valor Adicionais", "Subtotal do Item", "Observações"
];

/**
 * Ponto de entrada: é chamado automaticamente pelo Google toda vez que o
 * site faz um POST para a URL do Web App publicado a partir deste script.
 */
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const planilha = SpreadsheetApp.getActiveSpreadsheet();

    const abaPedidos = obterOuCriarAba(planilha, ABA_PEDIDOS, CABECALHOS_PEDIDOS);
    const abaItens = obterOuCriarAba(planilha, ABA_ITENS, CABECALHOS_ITENS);

    const agora = dados.dataHora ? new Date(dados.dataHora) : new Date();
    const entrega = dados.dadosEntrega || {};
    const ehEntrega = dados.formaRecebimento === "entrega";

    const enderecoCompleto = ehEntrega
      ? [entrega.rua, entrega.numero, entrega.complemento].filter(Boolean).join(", ")
      : "";

    // --- 1 linha na aba "Pedidos" com o resumo geral do pedido ---
    abaPedidos.appendRow([
      agora,
      dados.quantidadeTotal || 0,
      dados.subtotalGeral || 0,
      dados.taxaEntrega || 0,
      dados.totalFinal || 0,
      ehEntrega ? "Entrega" : "Retirada",
      entrega.nome || "",
      entrega.telefone || "",
      enderecoCompleto,
      entrega.bairro || "",
      entrega.cidade || "",
      entrega.cep || "",
      entrega.referencia || ""
    ]);

    // --- 1 linha por produto na aba "Itens_Pedidos" ---
    (dados.itens || []).forEach(function (item) {
      abaItens.appendRow([
        agora,
        item.nome || "",
        item.quantidade || 0,
        item.precoUnitario || 0,
        (item.adicionais || []).join(", "),
        item.valorAdicionais || 0,
        item.subtotalItem || 0,
        item.observacoes || ""
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, erro: String(erro) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Permite abrir a URL do Web App direto no navegador para um teste rápido
 * (deve mostrar a mensagem abaixo, confirmando que o script está no ar).
 */
function doGet(e) {
  return ContentService.createTextOutput(
    "Apps Script da Fábrica Smash está funcionando. Use POST para registrar pedidos."
  );
}

/**
 * Busca uma aba pelo nome; se não existir, cria e já escreve o cabeçalho
 * em negrito na primeira linha (fixa/congelada para facilitar a leitura).
 */
function obterOuCriarAba(planilha, nome, cabecalhos) {
  let aba = planilha.getSheetByName(nome);
  if (!aba) {
    aba = planilha.insertSheet(nome);
    aba.appendRow(cabecalhos);
    aba.getRange(1, 1, 1, cabecalhos.length).setFontWeight("bold");
    aba.setFrozenRows(1);
    aba.autoResizeColumns(1, cabecalhos.length);
  }
  return aba;
}
