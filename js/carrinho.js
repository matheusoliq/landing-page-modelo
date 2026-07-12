/* ============================================================================
   CARRINHO.JS
   ----------------------------------------------------------------------------
   MÓDULO DO CARRINHO DE COMPRAS.

   Responsável por guardar o estado do pedido (itens, quantidades,
   adicionais, observações) e expor funções para adicionar, remover e
   editar itens. Não manipula o DOM diretamente — quem desenha o carrinho
   na tela é o script.js, que escuta o evento "carrinho:atualizado".

   Cada item do carrinho tem este formato:
   {
     itemId:        string  -> identificador único da LINHA no carrinho
                                (o mesmo produto pode aparecer em mais de uma
                                linha se as personalizações forem diferentes)
     produtoId:     number  -> id do produto em produtos.js
     nome:          string
     precoBase:     number
     imagem:        string
     quantidade:    number
     adicionais:    [{id, nome, preco}]
     ingredientesRemovidos: [string]
     pontoDaCarne:  string | null
     observacoes:   string
   }
   ========================================================================== */

const Carrinho = (function () {

  // Estado interno do carrinho. Mantido apenas em memória (sem localStorage)
  // para garantir compatibilidade total com qualquer ambiente de preview.
  // Para persistir entre recarregamentos de página em produção, basta
  // salvar/ler este array de um backend próprio ou de localStorage.
  let itens = [];

  // Gera um id único para cada linha do carrinho
  function gerarItemId() {
    return "item-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
  }

  // Dispara um evento customizado para que a interface se atualize sozinha
  function notificar() {
    document.dispatchEvent(new CustomEvent("carrinho:atualizado", {
      detail: { itens: obterItens(), totais: calcularTotais() }
    }));
  }

  // Calcula o subtotal de UMA linha do carrinho (produto + adicionais) x quantidade
  function calcularSubtotalItem(item) {
    const precoAdicionais = item.adicionais.reduce((soma, ad) => soma + ad.preco, 0);
    return (item.precoBase + precoAdicionais) * item.quantidade;
  }

  // Adiciona um novo item (produto já personalizado) ao carrinho
  function adicionarItem(dadosItem) {
    const item = {
      itemId: gerarItemId(),
      produtoId: dadosItem.produtoId,
      nome: dadosItem.nome,
      precoBase: dadosItem.precoBase,
      imagem: dadosItem.imagem,
      quantidade: dadosItem.quantidade || 1,
      adicionais: dadosItem.adicionais || [],
      ingredientesRemovidos: dadosItem.ingredientesRemovidos || [],
      pontoDaCarne: dadosItem.pontoDaCarne || null,
      observacoes: dadosItem.observacoes || ""
    };
    itens.push(item);
    notificar();
    return item.itemId;
  }

  // Remove uma linha inteira do carrinho
  function removerItem(itemId) {
    itens = itens.filter(i => i.itemId !== itemId);
    notificar();
  }

  // Atualiza a quantidade de uma linha (mínimo 1)
  function atualizarQuantidade(itemId, novaQuantidade) {
    const item = itens.find(i => i.itemId === itemId);
    if (!item) return;
    item.quantidade = Math.max(1, novaQuantidade);
    notificar();
  }

  // Atualiza as observações de uma linha
  function atualizarObservacoes(itemId, texto) {
    const item = itens.find(i => i.itemId === itemId);
    if (!item) return;
    item.observacoes = texto;
    notificar();
  }

  // Substitui a lista de adicionais de uma linha
  function atualizarAdicionais(itemId, novosAdicionais) {
    const item = itens.find(i => i.itemId === itemId);
    if (!item) return;
    item.adicionais = novosAdicionais;
    notificar();
  }

  // Esvazia o carrinho por completo
  function limparCarrinho() {
    itens = [];
    notificar();
  }

  // Retorna uma cópia dos itens (evita alteração externa acidental do estado)
  function obterItens() {
    return JSON.parse(JSON.stringify(itens));
  }

  // Calcula os totais gerais do pedido
  function calcularTotais() {
    const quantidadeTotal = itens.reduce((soma, i) => soma + i.quantidade, 0);
    const subtotalGeral = itens.reduce((soma, i) => soma + calcularSubtotalItem(i), 0);
    return { quantidadeTotal, subtotalGeral };
  }

  // API pública do módulo
  return {
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    atualizarObservacoes,
    atualizarAdicionais,
    limparCarrinho,
    obterItens,
    calcularTotais,
    calcularSubtotalItem
  };

})();
