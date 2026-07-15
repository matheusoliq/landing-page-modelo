/* ============================================================================
   PRODUTOS.JS
   ----------------------------------------------------------------------------
   CATÁLOGO DE PRODUTOS DO CARDÁPIO.

   Este é o ÚNICO arquivo que você precisa editar para adicionar, remover
   ou alterar produtos, categorias e adicionais.

   O restante do sistema (carrossel, cardápio, modal de personalização)
   lê estes dados automaticamente — você não precisa tocar em nenhum outro
   arquivo para atualizar o menu.
   ========================================================================== */

// ----------------------------------------------------------------------------
// CATEGORIAS — controla a ordem e os filtros exibidos no cardápio
// ----------------------------------------------------------------------------
const CATEGORIAS = [
  { id: "hamburgueres", nome: "Hambúrgueres", icone: "burger" },
  { id: "combos",       nome: "Combos",       icone: "combo"  },
  { id: "porcoes",      nome: "Porções",      icone: "fries"  },
  { id: "bebidas",      nome: "Bebidas",      icone: "drink"  },
  { id: "sobremesas",   nome: "Sobremesas",   icone: "dessert"}
];

// ----------------------------------------------------------------------------
// ADICIONAIS GLOBAIS — disponíveis para personalização dos hambúrgueres/combos
// Cada produto pode reutilizar esta lista via a chave `adicionais` (por id).
// ----------------------------------------------------------------------------
const ADICIONAIS_DISPONIVEIS = [
  { id: "bacon",     nome: "Bacon crocante",       preco: 5.00 },
  { id: "cheddar",   nome: "Cheddar cremoso",      preco: 4.00 },
  { id: "ovo",       nome: "Ovo caipira",          preco: 3.00 },
  { id: "cebola",    nome: "Cebola caramelizada",  preco: 2.50 },
  { id: "molho",     nome: "Molho especial extra", preco: 2.00 },
  { id: "carne",     nome: "Carne extra (100g)",   preco: 8.00 },
  { id: "picles",    nome: "Picles artesanal",     preco: 2.00 }
];

// Ingredientes que podem ser removidos (checkbox "sem X") — padrão para burgers
const INGREDIENTES_REMOVIVEIS_PADRAO = [
  "Cebola", "Picles", "Alface", "Tomate", "Molho especial", "Maionese"
];

// Pontos da carne disponíveis para personalização
const PONTOS_DA_CARNE = ["Mal passada", "Ao ponto", "Bem passada"];

// ----------------------------------------------------------------------------
// PRODUTOS
// ----------------------------------------------------------------------------
// Estrutura de cada produto:
//   id                     -> identificador único (number)
//   nome                   -> nome exibido
//   categoria              -> deve bater com um id em CATEGORIAS
//   descricao              -> texto curto exibido nos cards
//   preco                  -> preço de tabela (number)
//   precoPromocional       -> ⭐ OPCIONAL. Se definido e menor que "preco",
//                             o produto passa a exibir o preço promocional em
//                             destaque, com o preço de tabela riscado ao lado
//                             e uma etiqueta de desconto na imagem — tanto no
//                             cardápio quanto no carrossel. É esse valor
//                             (o promocional) que efetivamente vai para o
//                             carrinho e para a mensagem do WhatsApp. Para
//                             remover o desconto de um produto, basta apagar
//                             esta linha (ou deixar undefined).
//   imagem                 -> caminho/URL da imagem
//   disponivel             -> true/false (esconde do cardápio se false)
//   destaque               -> true = aparece na vitrine "Ofertas e Mais Pedidos"
//                             da home (o carrossel também inclui automaticamente
//                             qualquer produto com desconto, mesmo sem destaque)
//   tags                   -> livre, não é mais usado por nenhuma lógica automática
//                             (pode remover ou manter como anotação própria)
//   permiteAdicionais      -> true = mostra seção de adicionais no modal
//   permitePontoCarne      -> true = mostra seletor de ponto da carne
//   ingredientesRemoviveis -> array de strings (checkboxes "sem X")
// ----------------------------------------------------------------------------
const PRODUTOS = [
  {
    id: 1,
    nome: "Smash Bacon Supreme",
    categoria: "hamburgueres",
    descricao: "Dois smash burgers, queijo cheddar duplo, bacon crocante e molho especial da casa.",
    preco: 34.90,
    precoPromocional: 27.90,
    imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: true,
    tags: ["bacon", "fome", "carne-dupla"],
    permiteAdicionais: true,
    permitePontoCarne: true,
    ingredientesRemoviveis: INGREDIENTES_REMOVIVEIS_PADRAO
  },
  {
    id: 2,
    nome: "Cheddar Melt Clássico",
    categoria: "hamburgueres",
    descricao: "Smash burger, cheddar derretido, cebola caramelizada e picles no pão brioche amanteigado.",
    preco: 28.90,
    imagem: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: true,
    tags: ["classico", "economico"],
    permiteAdicionais: true,
    permitePontoCarne: true,
    ingredientesRemoviveis: INGREDIENTES_REMOVIVEIS_PADRAO
  },
  {
    id: 3,
    nome: "Spicy Jalapeño Burger",
    categoria: "hamburgueres",
    descricao: "Smash burger apimentado, jalapeños, pepper jack e maionese de chipotle picante.",
    preco: 32.90,
    imagem: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: true,
    tags: ["apimentado"],
    permiteAdicionais: true,
    permitePontoCarne: true,
    ingredientesRemoviveis: INGREDIENTES_REMOVIVEIS_PADRAO
  },
  {
    id: 4,
    nome: "Veggie Grelhado",
    categoria: "hamburgueres",
    descricao: "Hambúrguer de grão-de-bico e cogumelos grelhado, rúcula, tomate seco e maionese de ervas.",
    preco: 30.90,
    imagem: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: false,
    tags: ["vegetariano", "leve"],
    permiteAdicionais: true,
    permitePontoCarne: false,
    ingredientesRemoviveis: ["Rúcula", "Tomate seco", "Maionese de ervas"]
  },
  {
    id: 5,
    nome: "Combo Smash Bacon",
    categoria: "combos",
    descricao: "Smash Bacon Supreme + batata frita média + refrigerante lata.",
    preco: 49.90,
    precoPromocional: 42.90,
    imagem: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: true,
    tags: ["combo", "fome"],
    permiteAdicionais: true,
    permitePontoCarne: true,
    ingredientesRemoviveis: INGREDIENTES_REMOVIVEIS_PADRAO
  },
  {
    id: 6,
    nome: "Combo Cheddar Melt",
    categoria: "combos",
    descricao: "Cheddar Melt Clássico + batata frita média + refrigerante lata.",
    preco: 44.90,
    imagem: "https://images.unsplash.com/photo-1610614819513-58e34989848b?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: false,
    tags: ["combo", "economico"],
    permiteAdicionais: true,
    permitePontoCarne: true,
    ingredientesRemoviveis: INGREDIENTES_REMOVIVEIS_PADRAO
  },
  {
    id: 7,
    nome: "Batata Frita Grande",
    categoria: "porcoes",
    descricao: "Porção generosa de batatas crocantes, tempero da casa e molho especial.",
    preco: 22.90,
    imagem: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: true,
    tags: ["leve", "economico"],
    permiteAdicionais: false,
    permitePontoCarne: false,
    ingredientesRemoviveis: []
  },
  {
    id: 8,
    nome: "Onion Rings",
    categoria: "porcoes",
    descricao: "Anéis de cebola empanados e fritos, servidos com molho barbecue defumado.",
    preco: 24.90,
    precoPromocional: 19.90,
    imagem: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: false,
    tags: ["leve"],
    permiteAdicionais: false,
    permitePontoCarne: false,
    ingredientesRemoviveis: []
  },
  {
    id: 9,
    nome: "Coca-Cola Lata",
    categoria: "bebidas",
    descricao: "Lata 350ml, gelada.",
    preco: 7.00,
    imagem: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: false,
    tags: ["bebida"],
    permiteAdicionais: false,
    permitePontoCarne: false,
    ingredientesRemoviveis: []
  },
  {
    id: 10,
    nome: "Limonada Suíça",
    categoria: "bebidas",
    descricao: "Limonada cremosa batida na hora, bem gelada.",
    preco: 11.00,
    precoPromocional: 8.90,
    imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: true,
    tags: ["bebida", "leve"],
    permiteAdicionais: false,
    permitePontoCarne: false,
    ingredientesRemoviveis: []
  },
  {
    id: 11,
    nome: "Milkshake de Chocolate",
    categoria: "sobremesas",
    descricao: "Milkshake cremoso de chocolate belga com chantilly e calda.",
    preco: 18.90,
    imagem: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: true,
    tags: ["doce"],
    permiteAdicionais: false,
    permitePontoCarne: false,
    ingredientesRemoviveis: []
  },
  {
    id: 12,
    nome: "Brownie com Sorvete",
    categoria: "sobremesas",
    descricao: "Brownie quente de chocolate 70% com bola de sorvete de creme.",
    preco: 19.90,
    imagem: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&q=80&auto=format&fit=crop",
    disponivel: true,
    destaque: false,
    tags: ["doce"],
    permiteAdicionais: false,
    permitePontoCarne: false,
    ingredientesRemoviveis: []
  }
];
