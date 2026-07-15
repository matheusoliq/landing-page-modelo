/* ============================================================================
   SCRIPT.JS
   ----------------------------------------------------------------------------
   ARQUIVO PRINCIPAL DE COMPORTAMENTO DO SITE.

   Depende de (carregados antes deste arquivo no index.html):
     - config.js    -> CONFIG
     - produtos.js  -> CATEGORIAS, PRODUTOS, ADICIONAIS_DISPONIVEIS, etc.
     - carrinho.js  -> objeto Carrinho

   Organização (Ctrl+F pelo número da seção):
     1. Ícones SVG reutilizáveis
     2. Utilitários (formatação de preço, helpers de DOM)
     3. Navbar (scroll, menu mobile)
     4. Scroll Reveal
     5. Carrossel Premium
     6. Renderização do Cardápio + Filtros
     7. Modal de Personalização de Produto
     8. Carrinho Lateral (render + eventos)
     9. Checkout (retirada/entrega) + Geração da mensagem do WhatsApp
     10. Toast de notificação
     11. Módulo genérico de UI (overlay + modais)
     12. Inicialização geral
     13. Horário de funcionamento (bloqueio de pedidos fora do horário)
     14. Service Worker (PWA)
   ========================================================================== */

/* ============================================================================
   1. ÍCONES SVG REUTILIZÁVEIS
   ----------------------------------------------------------------------------
   Todos os ícones do projeto são SVGs inline (sem bibliotecas externas tipo
   FontAwesome). Ficam centralizados aqui para fácil reaproveitamento.
   ========================================================================== */
const ICONES = {
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" class="icone-svg"><path d="M17.47 14.38c-.28-.14-1.67-.83-1.93-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.4-1.66-1.56-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.35-.26.28-1 1-1 2.42 0 1.43 1.03 2.81 1.17 3 .14.19 2.03 3.1 4.93 4.34.69.3 1.22.48 1.64.61.69.22 1.31.19 1.81.11.55-.08 1.67-.68 1.9-1.34.24-.66.24-1.22.16-1.34-.07-.12-.25-.19-.53-.33z"/><path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.95 9.95 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2zm0 18.2c-1.66 0-3.2-.45-4.53-1.24l-.32-.19-3 .79.8-2.92-.21-.3A8.18 8.18 0 0 1 3.8 12c0-4.53 3.7-8.2 8.22-8.2 4.52 0 8.2 3.67 8.2 8.2 0 4.53-3.68 8.2-8.2 8.2z"/></svg>`,

  carrinho: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icone-svg"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,

  fechar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,

  seta: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,

  mais: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,

  lixeira: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>`,

  estrela: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,

  relogio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,

  bike: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 17.5V14l-3-3 4-3 2 3h2"/></svg>`,

  folha: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 11 13.53 11 12"/></svg>`,

  chama: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17a2.5 2.5 0 0 0 2.5-2.5c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7.5 7.5 0 1 1-15 0c0-1.153.433-2.294 1-3 1.219-1.522 2-2.5 2-4.5 2 1 2.5 4 2.5 4z"/></svg>`,

  molho: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2h10M8 2v4l-3 5v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9l-3-5V2"/><path d="M6 14h12"/></svg>`,

  coracao: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`,

  burger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18M3 14h18M4 18h16a1 1 0 0 0 1-1 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 1 1 0 0 0 1 1zM5 10a7 7 0 0 1 14 0"/></svg>`,

  combo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 5 6h6L10 2M8 6v16M3 10h10v3a5 5 0 0 1-5 5 5 5 0 0 1-5-5v-3zM18 22V8a2 2 0 0 1 4 0v3h-4"/></svg>`,

  fries: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8V4M9 8V3M13 8V4M17 8V5M4 8h16l-1.5 13a1 1 0 0 1-1 .9H6.5a1 1 0 0 1-1-.9L4 8z"/></svg>`,

  drink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l-1.2 16.2A2 2 0 0 1 14.8 21H9.2a2 2 0 0 1-2-1.8L6 3zM4 3h16M9 9h6"/></svg>`,

  dessert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1.5 1.7 2 3 2 4.2 0 1.3-.9 2.3-2 2.3s-2-1-2-2.3C10 6 10.5 4.7 12 3zM4 12h16l-1.5 7.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 12zM4 12a4 4 0 0 1 8 0 4 4 0 0 1 8 0"/></svg>`,

  retirada: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><path d="M9 21V12h6v9"/></svg>`,

  moto: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 17.5V14l-2-3 3-2.5 1.5 2.5H21"/></svg>`,

  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,

  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`
};

// Mapa auxiliar: nome usado em produtos.js/config.js -> ícone correspondente
const MAPA_ICONE_CATEGORIA = {
  burger: ICONES.burger, combo: ICONES.combo, fries: ICONES.fries,
  drink: ICONES.drink, dessert: ICONES.dessert,
  leaf: ICONES.folha, flame: ICONES.chama, sauce: ICONES.molho,
  bike: ICONES.bike, heart: ICONES.coracao, clock: ICONES.relogio
};

/* ============================================================================
   2. UTILITÁRIOS
   ========================================================================== */

// Formata um número para o padrão de moeda brasileiro: R$ 39,90
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Atalho para document.querySelector
function $(seletor, escopo = document) { return escopo.querySelector(seletor); }
// Atalho para document.querySelectorAll (retorna array de verdade)
function $all(seletor, escopo = document) { return Array.from(escopo.querySelectorAll(seletor)); }

// Busca um produto pelo id
function buscarProdutoPorId(id) {
  return PRODUTOS.find(p => p.id === id);
}

// Calcula os dados de exibição de preço de um produto, considerando desconto.
// Retorna sempre a mesma "forma", esteja o produto em promoção ou não —
// assim o resto do código nunca precisa checar "if (produto.precoPromocional)".
function obterPrecoExibicao(produto) {
  const temDesconto = typeof produto.precoPromocional === "number" && produto.precoPromocional < produto.preco;
  const precoFinal = temDesconto ? produto.precoPromocional : produto.preco;
  const percentualDesconto = temDesconto
    ? Math.round((1 - produto.precoPromocional / produto.preco) * 100)
    : 0;

  return { temDesconto, precoFinal, precoOriginal: produto.preco, percentualDesconto };
}

// Monta o HTML do bloco de preço (usado no cardápio e no carrossel).
// Quando há desconto: preço promocional em destaque + preço original riscado.
// Sem desconto: mostra só o preço normal, como sempre foi.
function montarBlocoPreco(produto, classePrecoAtual, classePrecoOriginal) {
  const { temDesconto, precoFinal, precoOriginal } = obterPrecoExibicao(produto);
  if (!temDesconto) {
    return `<span class="${classePrecoAtual}">${formatarPreco(precoFinal)}</span>`;
  }
  return `
    <span class="${classePrecoAtual}">${formatarPreco(precoFinal)}</span>
    <span class="${classePrecoOriginal}">${formatarPreco(precoOriginal)}</span>
  `;
}

// Monta a etiqueta exibida sobre a imagem: "-XX%" se houver desconto,
// ou "Mais pedido" se o produto for destaque sem desconto. Retorna "" se
// nenhum dos dois casos se aplicar (não mostra etiqueta nenhuma).
function montarEtiquetaProduto(produto) {
  const { temDesconto, percentualDesconto } = obterPrecoExibicao(produto);
  if (temDesconto) {
    return `<div class="etiqueta-produto etiqueta-desconto">-${percentualDesconto}%</div>`;
  }
  if (produto.destaque) {
    return `<div class="etiqueta-produto etiqueta-destaque">${ICONES.chama} Mais pedido</div>`;
  }
  return "";
}

/* ============================================================================
   3. NAVBAR (scroll + menu mobile)
   ========================================================================== */
function iniciarNavbar() {
  const navbar = $("#navbar");
  const btnMenuMobile = $("#btn-menu-mobile");
  const menuMobile = $("#menu-mobile");

  // Adiciona fundo de vidro à navbar depois de rolar um pouco a página
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("navbar-rolada", window.scrollY > 40);
  });

  // Abre/fecha o menu mobile (hambúrguer)
  btnMenuMobile.addEventListener("click", () => {
    btnMenuMobile.classList.toggle("aberto");
    menuMobile.classList.toggle("menu-mobile-aberto");
  });

  // Fecha o menu mobile ao clicar em qualquer link dele
  $all("a", menuMobile).forEach(link => {
    link.addEventListener("click", () => {
      btnMenuMobile.classList.remove("aberto");
      menuMobile.classList.remove("menu-mobile-aberto");
    });
  });
}

/* ============================================================================
   4. SCROLL REVEAL
   ----------------------------------------------------------------------------
   Revela elementos com a classe .reveal suavemente conforme entram na tela,
   usando IntersectionObserver (sem nenhuma biblioteca externa).
   ========================================================================== */
function iniciarScrollReveal() {
  const elementos = $all(".reveal");
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("reveal-ativo");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(el => observador.observe(el));
}

/* ============================================================================
   5. CARROSSEL PREMIUM
   ----------------------------------------------------------------------------
   Carrossel 3D "spotlight" construído do zero (HTML gerado via JS + CSS
   transforms). Suporta: autoplay, loop infinito, setas, indicadores,
   swipe/touch e clique nas imagens.
   ========================================================================== */
const CarrosselPremium = (function () {
  let produtosDestaque = [];
  let indiceAtivo = 0;
  let intervaloAutoplay = null;
  const TEMPO_AUTOPLAY = 4000;

  let elTrilho, elIndicadores;
  let inicioToqueX = 0;

  function montar() {
    // A vitrine reúne os "mais pedidos" (destaque: true) E qualquer produto
    // em promoção (precoPromocional), mesmo que não esteja marcado como
    // destaque — assim uma oferta pontual aparece aqui automaticamente.
    produtosDestaque = PRODUTOS.filter(p => p.disponivel && (p.destaque || obterPrecoExibicao(p).temDesconto));
    if (produtosDestaque.length === 0) return;

    elTrilho = $("#carrossel-trilho");
    elIndicadores = $("#carrossel-indicadores");

    // Cria um slide para cada produto em destaque/promoção
    elTrilho.innerHTML = produtosDestaque.map((produto, i) => `
      <article class="carrossel-slide" data-indice="${i}" data-produto-id="${produto.id}">
        <div class="carrossel-slide-imagem">
          <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
          ${montarEtiquetaProduto(produto)}
        </div>
        <div class="carrossel-slide-corpo">
          <h3 class="carrossel-slide-nome">${produto.nome}</h3>
          <div class="carrossel-slide-rodape">
            <div class="carrossel-slide-preco-bloco">
              ${montarBlocoPreco(produto, "carrossel-slide-preco", "carrossel-slide-preco-original")}
            </div>
            <button class="btn-add-mini" type="button" aria-label="Adicionar ${produto.nome} ao carrinho" data-acao="add-rapido" data-produto-id="${produto.id}">
              ${ICONES.mais}
            </button>
          </div>
        </div>
      </article>
    `).join("");

    // Cria os indicadores (bolinhas) inferiores
    elIndicadores.innerHTML = produtosDestaque.map((_, i) => `
      <button class="carrossel-indicador" type="button" data-indice="${i}" aria-label="Ir para slide ${i + 1}"></button>
    `).join("");

    // Clique em um slide (fora do botão de adicionar) abre a personalização
    $all(".carrossel-slide", elTrilho).forEach(slide => {
      slide.addEventListener("click", (evento) => {
        if (evento.target.closest("[data-acao='add-rapido']")) return;
        const produtoId = Number(slide.dataset.produtoId);
        ModalPersonalizacao.abrir(produtoId);
      });
    });

    // Botão de adicionar rápido direto no slide
    $all("[data-acao='add-rapido']", elTrilho).forEach(botao => {
      botao.addEventListener("click", (evento) => {
        evento.stopPropagation();
        const produtoId = Number(botao.dataset.produtoId);
        ModalPersonalizacao.abrir(produtoId);
      });
    });

    // Indicadores clicáveis
    $all(".carrossel-indicador", elIndicadores).forEach(botao => {
      botao.addEventListener("click", () => irParaSlide(Number(botao.dataset.indice)));
    });

    // Setas de navegação
    $("#carrossel-seta-anterior").addEventListener("click", () => mover(-1));
    $("#carrossel-seta-proximo").addEventListener("click", () => mover(1));

    // Suporte a swipe em telas de toque
    const palco = $("#carrossel-palco");
    palco.addEventListener("touchstart", (e) => { inicioToqueX = e.touches[0].clientX; }, { passive: true });
    palco.addEventListener("touchend", (e) => {
      const fimToqueX = e.changedTouches[0].clientX;
      const diferenca = fimToqueX - inicioToqueX;
      if (Math.abs(diferenca) > 40) {
        mover(diferenca > 0 ? -1 : 1);
      }
    }, { passive: true });

    // Pausa o autoplay quando o mouse está sobre o carrossel
    palco.addEventListener("mouseenter", pararAutoplay);
    palco.addEventListener("mouseleave", iniciarAutoplay);

    atualizarPosicoes();
    iniciarAutoplay();
  }

  // Aplica a cada slide a classe de posição relativa ao slide ativo
  // (ativo / anterior / próximo / distante-esq / distante-dir)
  function atualizarPosicoes() {
    const total = produtosDestaque.length;
    $all(".carrossel-slide", elTrilho).forEach((slide) => {
      const i = Number(slide.dataset.indice);
      const distancia = (i - indiceAtivo + total) % total;

      let posicao;
      if (distancia === 0) posicao = "ativo";
      else if (distancia === 1) posicao = "proximo";
      else if (distancia === total - 1) posicao = "anterior";
      else if (distancia <= total / 2) posicao = "distante-dir";
      else posicao = "distante-esq";

      slide.dataset.posicao = posicao;
    });

    $all(".carrossel-indicador", elIndicadores).forEach((botao, i) => {
      botao.classList.toggle("indicador-ativo", i === indiceAtivo);
    });
  }

  function irParaSlide(indice) {
    indiceAtivo = indice;
    atualizarPosicoes();
    reiniciarAutoplay();
  }

  function mover(direcao) {
    const total = produtosDestaque.length;
    indiceAtivo = (indiceAtivo + direcao + total) % total;
    atualizarPosicoes();
    reiniciarAutoplay();
  }

  function iniciarAutoplay() {
    pararAutoplay();
    intervaloAutoplay = setInterval(() => mover(1), TEMPO_AUTOPLAY);
  }
  function pararAutoplay() { clearInterval(intervaloAutoplay); }
  function reiniciarAutoplay() { pararAutoplay(); iniciarAutoplay(); }

  return { montar };
})();

/* ============================================================================
   5.1 SEÇÃO DE DIFERENCIAIS
   ----------------------------------------------------------------------------
   Gera os cards de diferenciais automaticamente a partir de
   CONFIG.diferenciais (config.js) — para adicionar/remover um diferencial,
   basta editar a lista lá, sem tocar neste arquivo.
   ========================================================================== */
function renderizarDiferenciais() {
  const grade = $("#diferenciais-grade");
  if (!grade) return;

  grade.innerHTML = CONFIG.diferenciais.map(dif => `
    <article class="diferencial-card reveal">
      <div class="diferencial-icone">${MAPA_ICONE_CATEGORIA[dif.icone] || ICONES.check}</div>
      <h3 class="diferencial-titulo">${dif.titulo}</h3>
      <p class="diferencial-desc">${dif.descricao}</p>
    </article>
  `).join("");
}

/* ============================================================================
   5.2 HORÁRIO DE FUNCIONAMENTO — bloqueio de pedidos fora do horário
   ----------------------------------------------------------------------------
   Calcula se a loja está aberta agora com base em CONFIG.horario.periodos.
   Para desligar completamente esse bloqueio, basta trocar
   CONFIG.horario.verificarAntesDeFinalizar para `false` em config.js —
   nenhum código aqui precisa ser alterado.
   ========================================================================== */
const HorarioFuncionamento = (function () {

  // Converte "18:30" em minutos desde a meia-noite (1110)
  function paraMinutos(horaTexto) {
    const [h, m] = horaTexto.split(":").map(Number);
    return h * 60 + m;
  }

  // Verifica se um instante (Date) cai dentro de algum dos períodos configurados.
  // Períodos que passam da meia-noite (ex: abre 18:00, fecha 00:30) são
  // tratados corretamente, checando também o dia anterior.
  function estaDentroDoHorario(periodos, agora) {
    const diaAtual = agora.getDay();
    const diaAnterior = (diaAtual + 6) % 7;
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    return periodos.some(periodo => {
      const abre = paraMinutos(periodo.abre);
      const fecha = paraMinutos(periodo.fecha);
      const cruzaMeiaNoite = fecha <= abre;

      if (!cruzaMeiaNoite) {
        return periodo.dias.includes(diaAtual) && minutosAgora >= abre && minutosAgora < fecha;
      }
      const aindaNoDiaDeAbertura = periodo.dias.includes(diaAtual) && minutosAgora >= abre;
      const jaNaMadrugadaSeguinte = periodo.dias.includes(diaAnterior) && minutosAgora < fecha;
      return aindaNoDiaDeAbertura || jaNaMadrugadaSeguinte;
    });
  }

  // Retorna true se o site deve aceitar pedidos agora. Se a checagem estiver
  // desligada em config.js, sempre retorna true (comportamento antigo).
  function estaAberto() {
    if (!CONFIG.horario.verificarAntesDeFinalizar) return true;
    return estaDentroDoHorario(CONFIG.horario.periodos, new Date());
  }

  // Encontra o próximo instante (Date) em que a loja abre, olhando até 7 dias à frente
  function proximaAbertura() {
    const agora = new Date();
    for (let offset = 0; offset < 8; offset++) {
      const dia = (agora.getDay() + offset) % 7;
      let melhorHorario = null;

      CONFIG.horario.periodos.forEach(periodo => {
        if (!periodo.dias.includes(dia)) return;
        const [h, m] = periodo.abre.split(":").map(Number);
        const dataAbertura = new Date(agora);
        dataAbertura.setDate(agora.getDate() + offset);
        dataAbertura.setHours(h, m, 0, 0);
        if (dataAbertura > agora && (!melhorHorario || dataAbertura < melhorHorario)) {
          melhorHorario = dataAbertura;
        }
      });

      if (melhorHorario) return melhorHorario;
    }
    return null;
  }

  // Monta uma frase amigável: "Abrimos hoje às 18:00" / "Abrimos amanhã às 18:00" / "Abrimos sexta-feira às 18:00"
  function formatarProximaAbertura() {
    const data = proximaAbertura();
    if (!data) return "Confira nosso horário de funcionamento.";

    const agora = new Date();
    const amanha = new Date(agora);
    amanha.setDate(agora.getDate() + 1);

    const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    if (data.toDateString() === agora.toDateString()) return `Abrimos hoje às ${hora}`;
    if (data.toDateString() === amanha.toDateString()) return `Abrimos amanhã às ${hora}`;
    const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "long" });
    return `Abrimos ${diaSemana} às ${hora}`;
  }

  return { estaAberto, formatarProximaAbertura };
})();

/* ============================================================================
   6. RENDERIZAÇÃO DO CARDÁPIO + FILTROS DE CATEGORIA
   ========================================================================== */
const Cardapio = (function () {
  let categoriaAtiva = "todos";

  function montar() {
    montarFiltros();
    renderizarGrade();
  }

  function montarFiltros() {
    const elFiltros = $("#cardapio-filtros");
    const categorias = [{ id: "todos", nome: "Tudo", icone: "burger" }, ...CATEGORIAS];

    elFiltros.innerHTML = categorias.map(cat => `
      <button class="filtro-categoria ${cat.id === categoriaAtiva ? "filtro-ativo" : ""}" type="button" data-categoria="${cat.id}">
        ${MAPA_ICONE_CATEGORIA[cat.icone] || ""} ${cat.nome}
      </button>
    `).join("");

    $all(".filtro-categoria", elFiltros).forEach(botao => {
      botao.addEventListener("click", () => {
        categoriaAtiva = botao.dataset.categoria;
        $all(".filtro-categoria", elFiltros).forEach(b => b.classList.remove("filtro-ativo"));
        botao.classList.add("filtro-ativo");
        renderizarGrade();
      });
    });
  }

  function renderizarGrade() {
    const elGrade = $("#cardapio-grade");
    const lista = categoriaAtiva === "todos"
      ? PRODUTOS
      : PRODUTOS.filter(p => p.categoria === categoriaAtiva);

    if (lista.length === 0) {
      elGrade.innerHTML = `<p class="cardapio-vazio">Nenhum produto encontrado nesta categoria.</p>`;
      return;
    }

    elGrade.innerHTML = lista.map(produto => `
      <article class="produto-card reveal" data-produto-id="${produto.id}">
        <div class="produto-card-imagem">
          <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
          ${montarEtiquetaProduto(produto)}
          ${!produto.disponivel ? `<div class="produto-card-indisponivel">Indisponível</div>` : ""}
        </div>
        <div class="produto-card-corpo">
          <h3 class="produto-card-nome">${produto.nome}</h3>
          <p class="produto-card-desc">${produto.descricao}</p>
          <div class="produto-card-rodape">
            <div class="produto-card-preco-bloco">
              ${montarBlocoPreco(produto, "produto-card-preco", "produto-card-preco-original")}
            </div>
            <button class="btn-add-card" type="button" data-produto-id="${produto.id}" ${!produto.disponivel ? "disabled" : ""}>
              ${ICONES.mais} Adicionar
            </button>
          </div>
        </div>
      </article>
    `).join("");

    $all(".btn-add-card", elGrade).forEach(botao => {
      botao.addEventListener("click", () => {
        ModalPersonalizacao.abrir(Number(botao.dataset.produtoId));
      });
    });

    // Reaplica o observador de scroll reveal aos novos cards
    iniciarScrollReveal();
  }

  return { montar };
})();

/* ============================================================================
   7. MODAL DE PERSONALIZAÇÃO DE PRODUTO
   ----------------------------------------------------------------------------
   Abre um modal permitindo: alterar quantidade, escolher ponto da carne,
   remover ingredientes, adicionar adicionais (com preço automático) e
   escrever observações livres. Ao confirmar, o item é enviado ao Carrinho.
   ========================================================================== */
const ModalPersonalizacao = (function () {
  let produtoAtual = null;
  let estado = {
    quantidade: 1,
    pontoDaCarne: null,
    ingredientesRemovidos: [],
    adicionaisSelecionados: [] // array de ids
  };

  function abrir(produtoId) {
    produtoAtual = buscarProdutoPorId(produtoId);
    if (!produtoAtual || !produtoAtual.disponivel) return;

    // Reseta o estado de personalização a cada abertura
    estado = {
      quantidade: 1,
      pontoDaCarne: produtoAtual.permitePontoCarne ? PONTOS_DA_CARNE[1] : null,
      ingredientesRemovidos: [],
      adicionaisSelecionados: []
    };

    renderizar();
    UI.abrirModal("#modal-personalizacao");
  }

  function renderizar() {
    const modal = $("#modal-personalizacao");

    $(".modal-produto-preview img", modal).src = produtoAtual.imagem;
    $(".modal-produto-preview img", modal).alt = produtoAtual.nome;
    $(".modal-produto-preview strong", modal).textContent = produtoAtual.nome;
    $(".modal-produto-preco-bloco", modal).innerHTML = montarBlocoPreco(produtoAtual, "modal-produto-preco", "modal-produto-preco-original");
    $(".modal-cabecalho p", modal).textContent = produtoAtual.descricao;

    // --- Ponto da carne ---
    const blocoPonto = $("#bloco-ponto-carne", modal);
    if (produtoAtual.permitePontoCarne) {
      blocoPonto.style.display = "";
      $("#opcoes-ponto-carne", modal).innerHTML = PONTOS_DA_CARNE.map(ponto => `
        <button type="button" class="pill-opcao ${ponto === estado.pontoDaCarne ? "pill-selecionada" : ""}" data-ponto="${ponto}">${ponto}</button>
      `).join("");
      $all("#opcoes-ponto-carne .pill-opcao", modal).forEach(botao => {
        botao.addEventListener("click", () => {
          estado.pontoDaCarne = botao.dataset.ponto;
          renderizar();
        });
      });
    } else {
      blocoPonto.style.display = "none";
    }

    // --- Ingredientes removíveis ---
    const blocoRemover = $("#bloco-remover-ingredientes", modal);
    if (produtoAtual.ingredientesRemoviveis && produtoAtual.ingredientesRemoviveis.length > 0) {
      blocoRemover.style.display = "";
      $("#lista-remover-ingredientes", modal).innerHTML = produtoAtual.ingredientesRemoviveis.map(ing => `
        <label class="item-checkbox">
          <span class="rotulo-checkbox">
            <input type="checkbox" data-ingrediente="${ing}" ${estado.ingredientesRemovidos.includes(ing) ? "checked" : ""}>
            Sem ${ing}
          </span>
        </label>
      `).join("");
      $all("#lista-remover-ingredientes input", modal).forEach(input => {
        input.addEventListener("change", () => {
          const nome = input.dataset.ingrediente;
          if (input.checked) estado.ingredientesRemovidos.push(nome);
          else estado.ingredientesRemovidos = estado.ingredientesRemovidos.filter(n => n !== nome);
        });
      });
    } else {
      blocoRemover.style.display = "none";
    }

    // --- Adicionais (com preço automático) ---
    const blocoAdicionais = $("#bloco-adicionais", modal);
    if (produtoAtual.permiteAdicionais) {
      blocoAdicionais.style.display = "";
      $("#lista-adicionais", modal).innerHTML = ADICIONAIS_DISPONIVEIS.map(ad => `
        <label class="item-checkbox">
          <span class="rotulo-checkbox">
            <input type="checkbox" data-adicional-id="${ad.id}" ${estado.adicionaisSelecionados.includes(ad.id) ? "checked" : ""}>
            ${ad.nome}
          </span>
          <span class="preco-adicional">+${formatarPreco(ad.preco)}</span>
        </label>
      `).join("");
      $all("#lista-adicionais input", modal).forEach(input => {
        input.addEventListener("change", () => {
          const id = input.dataset.adicionalId;
          if (input.checked) estado.adicionaisSelecionados.push(id);
          else estado.adicionaisSelecionados = estado.adicionaisSelecionados.filter(a => a !== id);
          atualizarTotalModal();
        });
      });
    } else {
      blocoAdicionais.style.display = "none";
    }

    $("#valor-quantidade-modal", modal).textContent = estado.quantidade;
    atualizarTotalModal();
  }

  function calcularPrecoUnitario() {
    const precoAdicionais = estado.adicionaisSelecionados
      .map(id => ADICIONAIS_DISPONIVEIS.find(a => a.id === id).preco)
      .reduce((soma, preco) => soma + preco, 0);
    return obterPrecoExibicao(produtoAtual).precoFinal + precoAdicionais;
  }

  function atualizarTotalModal() {
    const total = calcularPrecoUnitario() * estado.quantidade;
    $("#modal-personalizacao #total-modal-valor").textContent = formatarPreco(total);
  }

  function alterarQuantidade(delta) {
    estado.quantidade = Math.max(1, estado.quantidade + delta);
    renderizar();
  }

  function confirmarAdicao() {
    const observacoes = $("#modal-personalizacao #campo-observacoes-modal").value.trim();
    const adicionaisEscolhidos = estado.adicionaisSelecionados.map(id => ADICIONAIS_DISPONIVEIS.find(a => a.id === id));

    Carrinho.adicionarItem({
      produtoId: produtoAtual.id,
      nome: produtoAtual.nome,
      precoBase: obterPrecoExibicao(produtoAtual).precoFinal,
      imagem: produtoAtual.imagem,
      quantidade: estado.quantidade,
      adicionais: adicionaisEscolhidos,
      ingredientesRemovidos: [...estado.ingredientesRemovidos],
      pontoDaCarne: estado.pontoDaCarne,
      observacoes: observacoes
    });

    UI.fecharModal("#modal-personalizacao");
    Toast.mostrar(`${produtoAtual.nome} adicionado ao carrinho!`, "Toque no carrinho para revisar seu pedido.");
    CarrinhoLateral.abrir();
  }

  function iniciarEventos() {
    const modal = $("#modal-personalizacao");
    $("#btn-diminuir-qtd-modal", modal).addEventListener("click", () => alterarQuantidade(-1));
    $("#btn-aumentar-qtd-modal", modal).addEventListener("click", () => alterarQuantidade(1));
    $("#btn-confirmar-adicao", modal).addEventListener("click", confirmarAdicao);
  }

  return { abrir, iniciarEventos };
})();

/* ============================================================================
   9. CARRINHO LATERAL
   ========================================================================== */
const CarrinhoLateral = (function () {

  function abrir() {
    $("#carrinho-lateral").classList.add("carrinho-aberto");
    $("#overlay-carrinho").classList.add("overlay-visivel");
    document.body.style.overflow = "hidden";
  }

  function fechar() {
    $("#carrinho-lateral").classList.remove("carrinho-aberto");
    $("#overlay-carrinho").classList.remove("overlay-visivel");
    document.body.style.overflow = "";
  }

  // Monta o texto de detalhe (adicionais + ponto da carne + observações) de um item
  function montarDetalheItem(item) {
    const partes = [];
    if (item.pontoDaCarne) partes.push(`Ponto: <strong>${item.pontoDaCarne}</strong>`);
    if (item.adicionais.length > 0) {
      partes.push(`+ ${item.adicionais.map(a => a.nome).join(", ")}`);
    }
    if (item.ingredientesRemovidos.length > 0) {
      partes.push(`Sem: ${item.ingredientesRemovidos.join(", ")}`);
    }
    if (item.observacoes) partes.push(`Obs: "${item.observacoes}"`);
    return partes.join(" · ");
  }

  function renderizar(itens, totais) {
    const elItens = $("#carrinho-itens");
    const elContadorNav = $("#contador-carrinho");

    // Atualiza o contador flutuante no ícone da navbar
    elContadorNav.textContent = totais.quantidadeTotal;
    elContadorNav.classList.toggle("contador-visivel", totais.quantidadeTotal > 0);

    if (itens.length === 0) {
      elItens.innerHTML = `
        <div class="carrinho-vazio">
          ${ICONES.carrinho}
          <p>Seu carrinho está vazio.<br>Que tal dar uma olhada no cardápio?</p>
        </div>
      `;
    } else {
      elItens.innerHTML = itens.map(item => `
        <div class="carrinho-item" data-item-id="${item.itemId}">
          <img src="${item.imagem}" alt="${item.nome}">
          <div class="carrinho-item-info">
            <p class="carrinho-item-nome">${item.nome}</p>
            <p class="carrinho-item-detalhe">${montarDetalheItem(item)}</p>
            <div class="carrinho-item-rodape">
              <div class="carrinho-item-qtd">
                <button type="button" data-acao="diminuir">−</button>
                <span>${item.quantidade}</span>
                <button type="button" data-acao="aumentar">+</button>
              </div>
              <span class="carrinho-item-preco">${formatarPreco(Carrinho.calcularSubtotalItem(item))}</span>
              <button type="button" class="carrinho-item-remover" data-acao="remover" aria-label="Remover item">${ICONES.lixeira}</button>
            </div>
          </div>
        </div>
      `).join("");

      // Eventos de quantidade e remoção
      $all(".carrinho-item", elItens).forEach(elItem => {
        const itemId = elItem.dataset.itemId;
        const item = itens.find(i => i.itemId === itemId);

        $("[data-acao='diminuir']", elItem).addEventListener("click", () => {
          Carrinho.atualizarQuantidade(itemId, item.quantidade - 1);
        });
        $("[data-acao='aumentar']", elItem).addEventListener("click", () => {
          Carrinho.atualizarQuantidade(itemId, item.quantidade + 1);
        });
        $("[data-acao='remover']", elItem).addEventListener("click", () => {
          Carrinho.removerItem(itemId);
        });
      });
    }

    // Atualiza totais (subtotal + taxa de entrega, se aplicável)
    const taxaEntrega = Checkout.obterTaxaEntregaAtual();
    const totalFinal = totais.subtotalGeral + taxaEntrega;

    $("#carrinho-subtotal").textContent = formatarPreco(totais.subtotalGeral);
    $("#carrinho-taxa-entrega").textContent = taxaEntrega > 0 ? formatarPreco(taxaEntrega) : "Grátis";
    $("#carrinho-total-final").textContent = formatarPreco(totalFinal);

    // --- Bloqueio por horário de funcionamento (fácil de desligar em config.js) ---
    const lojaAberta = HorarioFuncionamento.estaAberto();
    const avisoFechado = $("#aviso-loja-fechada");
    if (avisoFechado) {
      avisoFechado.style.display = lojaAberta ? "none" : "flex";
      if (!lojaAberta) {
        $("#aviso-loja-fechada-texto").textContent = HorarioFuncionamento.formatarProximaAbertura();
      }
    }

    // Desabilita o botão de finalizar pedido se o carrinho estiver vazio OU a loja estiver fechada
    $("#btn-finalizar-pedido").disabled = itens.length === 0 || !lojaAberta;
  }

  function iniciarEventos() {
    $("#btn-abrir-carrinho").addEventListener("click", abrir);
    $("#btn-fechar-carrinho").addEventListener("click", fechar);
    $("#overlay-carrinho").addEventListener("click", fechar);
    $("#btn-limpar-carrinho").addEventListener("click", () => {
      if (confirm("Deseja realmente esvaziar o carrinho?")) Carrinho.limparCarrinho();
    });
    $("#btn-finalizar-pedido").addEventListener("click", () => {
      fechar();
      Checkout.abrir();
    });

    // Sempre que o carrinho mudar, re-renderiza a lista lateral
    document.addEventListener("carrinho:atualizado", (evento) => {
      renderizar(evento.detail.itens, evento.detail.totais);
    });
  }

  return { abrir, fechar, iniciarEventos, renderizar };
})();

/* ============================================================================
   10. CHECKOUT (Retirada / Entrega) + GERAÇÃO DA MENSAGEM DO WHATSAPP
   ========================================================================== */
const Checkout = (function () {
  let formaRecebimento = "retirada"; // "retirada" | "entrega"

  const CAMPOS_ENDERECO = [
    { id: "nome", label: "Nome completo", obrigatorio: true },
    { id: "telefone", label: "Telefone / WhatsApp", obrigatorio: true },
    { id: "rua", label: "Rua", obrigatorio: true },
    { id: "numero", label: "Número", obrigatorio: true },
    { id: "complemento", label: "Complemento", obrigatorio: false },
    { id: "bairro", label: "Bairro", obrigatorio: true },
    { id: "cidade", label: "Cidade", obrigatorio: true },
    { id: "cep", label: "CEP", obrigatorio: true },
    { id: "referencia", label: "Ponto de referência", obrigatorio: false }
  ];

  // Retorna a taxa de entrega atual (0 se a opção for retirada)
  function obterTaxaEntregaAtual() {
    return formaRecebimento === "entrega" ? CONFIG.entrega.taxaFixa : 0;
  }

  function abrir() {
    if (Carrinho.obterItens().length === 0) return;

    // Bloqueio por horário de funcionamento (desligável em config.js)
    if (!HorarioFuncionamento.estaAberto()) {
      Toast.mostrar("Estamos fechados no momento", HorarioFuncionamento.formatarProximaAbertura());
      return;
    }

    renderizarFormulario();
    UI.abrirModal("#modal-checkout");
  }

  function renderizarFormulario() {
    const corpo = $("#corpo-checkout");
    corpo.innerHTML = `
      <div class="grupo-form">
        <label class="rotulo-grupo">Como deseja receber?</label>
        <div class="opcoes-recebimento">
          <button type="button" class="opcao-recebimento ${formaRecebimento === "retirada" ? "opcao-selecionada" : ""}" data-forma="retirada">
            ${ICONES.retirada}
            <span>Retirar no local</span>
          </button>
          <button type="button" class="opcao-recebimento ${formaRecebimento === "entrega" ? "opcao-selecionada" : ""}" data-forma="entrega">
            ${ICONES.moto}
            <span>Entrega</span>
          </button>
        </div>
      </div>

      <div class="grupo-form campos-endereco ${formaRecebimento === "entrega" ? "campos-visiveis" : ""}" id="campos-endereco">
        ${CAMPOS_ENDERECO.map(campo => `
          <div class="campo-input ${campo.id === "rua" || campo.id === "referencia" ? "campo-completo" : ""}" data-campo="${campo.id}">
            <label for="input-${campo.id}">${campo.label}${campo.obrigatorio ? " *" : ""}</label>
            <input type="text" id="input-${campo.id}" placeholder="${campo.label}">
            <span class="mensagem-erro">Campo obrigatório</span>
          </div>
        `).join("")}
      </div>

      <div class="grupo-form">
        <label class="rotulo-grupo">Resumo</label>
        <div class="linha-total"><span>Subtotal</span><span id="checkout-subtotal"></span></div>
        <div class="linha-total"><span>Taxa de entrega</span><span id="checkout-taxa"></span></div>
        <div class="linha-total linha-total-final"><span>Total</span><span id="checkout-total"></span></div>
      </div>
    `;

    $all(".opcao-recebimento", corpo).forEach(botao => {
      botao.addEventListener("click", () => {
        formaRecebimento = botao.dataset.forma;
        renderizarFormulario();
        // Recalcula os totais exibidos no carrinho lateral (taxa pode mudar)
        const { itens, totais } = { itens: Carrinho.obterItens(), totais: Carrinho.calcularTotais() };
        CarrinhoLateral.renderizar(itens, totais);
      });
    });

    atualizarResumo();
  }

  function atualizarResumo() {
    const totais = Carrinho.calcularTotais();
    const taxa = obterTaxaEntregaAtual();
    $("#checkout-subtotal").textContent = formatarPreco(totais.subtotalGeral);
    $("#checkout-taxa").textContent = taxa > 0 ? formatarPreco(taxa) : "Grátis";
    $("#checkout-total").textContent = formatarPreco(totais.subtotalGeral + taxa);
  }

  // Valida os campos obrigatórios de endereço quando a opção for "entrega"
  function validarFormulario() {
    if (formaRecebimento === "retirada") return { valido: true, dados: {} };

    let valido = true;
    const dados = {};

    CAMPOS_ENDERECO.forEach(campo => {
      const wrapper = $(`[data-campo="${campo.id}"]`);
      const input = $(`#input-${campo.id}`);
      const valor = input.value.trim();
      dados[campo.id] = valor;

      if (campo.obrigatorio && valor === "") {
        wrapper.classList.add("campo-erro");
        valido = false;
      } else {
        wrapper.classList.remove("campo-erro");
      }
    });

    return { valido, dados };
  }

  // --------------------------------------------------------------------------
  // GERAÇÃO DA MENSAGEM FINAL DO WHATSAPP
  // --------------------------------------------------------------------------
  function montarMensagemPedido(dadosEntrega) {
    const itens = Carrinho.obterItens();
    const totais = Carrinho.calcularTotais();
    const taxa = obterTaxaEntregaAtual();
    const totalFinal = totais.subtotalGeral + taxa;
    const LINHA = "━━━━━━━━━━━━━━━━━━━━";

    let msg = `${CONFIG.whatsapp.mensagemInicial}\n\n`;

    itens.forEach(item => {
      const subtotalItem = Carrinho.calcularSubtotalItem(item);
      msg += `${LINHA}\n`;
      msg += `🍔 ${item.nome}\n\n`;
      msg += `Quantidade: ${item.quantidade}\n`;
      msg += `Valor Unitário:\n${formatarPreco(item.precoBase)}\n`;

      if (item.pontoDaCarne) {
        msg += `\nPonto da carne:\n${item.pontoDaCarne}\n`;
      }

      if (item.ingredientesRemovidos.length > 0) {
        msg += `\nSem:\n${item.ingredientesRemovidos.map(ing => `• ${ing}`).join("\n")}\n`;
      }

      if (item.adicionais.length > 0) {
        msg += `\nAdicionais:\n`;
        item.adicionais.forEach(ad => { msg += `• ${ad.nome} (+${formatarPreco(ad.preco)})\n`; });
      }

      if (item.observacoes) {
        msg += `\nObservações:\n• ${item.observacoes}\n`;
      }

      msg += `\nSubtotal:\n${formatarPreco(subtotalItem)}\n`;
    });

    msg += `${LINHA}\n\n`;
    msg += `Total de Itens:\n${totais.quantidadeTotal}\n\n`;
    msg += `Subtotal:\n${formatarPreco(totais.subtotalGeral)}\n\n`;
    msg += `Taxa de Entrega:\n${taxa > 0 ? formatarPreco(taxa) : "Grátis"}\n\n`;
    msg += `Valor Final:\n${formatarPreco(totalFinal)}\n\n`;
    msg += `Forma de Recebimento:\n${formaRecebimento === "entrega" ? "Entrega" : "Retirada no Local"}\n\n`;

    if (formaRecebimento === "entrega") {
      msg += `Nome:\n${dadosEntrega.nome}\n\n`;
      msg += `Telefone:\n${dadosEntrega.telefone}\n\n`;
      msg += `Endereço:\n`;
      msg += `${dadosEntrega.rua}, ${dadosEntrega.numero}\n`;
      if (dadosEntrega.complemento) msg += `${dadosEntrega.complemento}\n`;
      msg += `${dadosEntrega.bairro} - ${dadosEntrega.cidade}\n`;
      msg += `CEP: ${dadosEntrega.cep}\n`;
      if (dadosEntrega.referencia) msg += `Referência: ${dadosEntrega.referencia}\n`;
      msg += `\n`;
    } else {
      msg += `Retirada no Local.\n\n`;
    }

    msg += `${CONFIG.whatsapp.mensagemFinal}`;

    return msg;
  }

  // Monta a URL final e a abre em uma nova aba (o cliente só precisa apertar "Enviar")
  function enviarPedido() {
    // Segunda checagem de segurança: caso o modal já estivesse aberto e o
    // horário de funcionamento tenha mudado nesse meio tempo (ex: cliente
    // demorou para preencher o endereço e a loja fechou nesse intervalo).
    if (!HorarioFuncionamento.estaAberto()) {
      UI.fecharModal("#modal-checkout");
      Toast.mostrar("Estamos fechados no momento", HorarioFuncionamento.formatarProximaAbertura());
      return;
    }

    const { valido, dados } = validarFormulario();
    if (!valido) return;

    const mensagem = montarMensagemPedido(dados);
    const url = `https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;

    // Registra o pedido na planilha do Google Sheets, se essa integração
    // estiver ativada em config.js (CONFIG.googleSheets.ativado). Isso NUNCA
    // bloqueia o envio do pedido pelo WhatsApp, mesmo se falhar.
    enviarParaPlanilha(dados);

    window.open(url, "_blank");

    UI.fecharModal("#modal-checkout");
    Carrinho.limparCarrinho();
    Toast.mostrar("Pedido enviado!", "Confirme o envio dentro do WhatsApp para finalizar.");
  }

  // --------------------------------------------------------------------------
  // ENVIO DO PEDIDO PARA O GOOGLE SHEETS (opcional)
  // --------------------------------------------------------------------------
  // Envia um resumo do pedido para o Google Apps Script Web App configurado
  // em CONFIG.googleSheets.urlWebApp, que grava os dados na planilha.
  // Ver o passo a passo completo em: google-sheets/README.md
  function enviarParaPlanilha(dadosEntrega) {
    if (!CONFIG.googleSheets.ativado || !CONFIG.googleSheets.urlWebApp) return;

    const itens = Carrinho.obterItens();
    const totais = Carrinho.calcularTotais();
    const taxa = obterTaxaEntregaAtual();

    const payload = {
      dataHora: new Date().toISOString(),
      quantidadeTotal: totais.quantidadeTotal,
      subtotalGeral: totais.subtotalGeral,
      taxaEntrega: taxa,
      totalFinal: totais.subtotalGeral + taxa,
      formaRecebimento: formaRecebimento,
      dadosEntrega: formaRecebimento === "entrega" ? dadosEntrega : {},
      itens: itens.map(item => ({
        nome: item.nome,
        quantidade: item.quantidade,
        precoUnitario: item.precoBase,
        adicionais: item.adicionais.map(a => a.nome),
        valorAdicionais: item.adicionais.reduce((soma, a) => soma + a.preco, 0),
        subtotalItem: Carrinho.calcularSubtotalItem(item),
        observacoes: item.observacoes
      }))
    };

    // mode: "no-cors" + Content-Type "text/plain" evitam problemas de CORS
    // com o Apps Script (que não responde a requisições de "preflight").
    // Isso significa que não conseguimos ler a resposta, mas não precisamos:
    // é um envio "dispare e esqueça" que nunca deve travar o pedido do cliente.
    fetch(CONFIG.googleSheets.urlWebApp, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).catch(erro => {
      console.warn("Não foi possível registrar o pedido na planilha:", erro);
    });
  }

  function iniciarEventos() {
    $("#btn-enviar-pedido-whatsapp").addEventListener("click", enviarPedido);
    // Sempre que o carrinho mudar enquanto o checkout estiver aberto, atualiza o resumo
    document.addEventListener("carrinho:atualizado", () => {
      if ($("#modal-checkout").classList.contains("modal-visivel")) atualizarResumo();
    });
  }

  return { abrir, iniciarEventos, obterTaxaEntregaAtual };
})();

/* ============================================================================
   11. TOAST DE NOTIFICAÇÃO
   ========================================================================== */
const Toast = (function () {
  let temporizador = null;

  function mostrar(titulo, subtitulo = "") {
    const toast = $("#toast");
    $(".toast-icone", toast).innerHTML = ICONES.check;
    $("#toast-titulo").textContent = titulo;
    $("#toast-subtitulo").textContent = subtitulo;

    toast.classList.add("toast-visivel");
    clearTimeout(temporizador);
    temporizador = setTimeout(() => toast.classList.remove("toast-visivel"), 3800);
  }

  return { mostrar };
})();

/* ============================================================================
   12. MÓDULO GENÉRICO DE UI (overlay + modais)
   ----------------------------------------------------------------------------
   Centraliza a abertura/fechamento de qualquer modal do site, sempre
   acompanhado do overlay escurecido de fundo.
   ========================================================================== */
const UI = (function () {

  function abrirModal(seletor) {
    $(seletor).classList.add("modal-visivel");
    $("#overlay-modais").classList.add("overlay-visivel");
    document.body.style.overflow = "hidden";
  }

  function fecharModal(seletor) {
    $(seletor).classList.remove("modal-visivel");
    // só remove o overflow/overlay se nenhum outro modal ou o carrinho estiverem abertos
    const algumModalAberto = $all(".modal.modal-visivel").length > 0;
    const carrinhoAberto = $("#carrinho-lateral").classList.contains("carrinho-aberto");
    if (!algumModalAberto) $("#overlay-modais").classList.remove("overlay-visivel");
    if (!algumModalAberto && !carrinhoAberto) document.body.style.overflow = "";
  }

  function fecharTodosOsModais() {
    $all(".modal").forEach(modal => modal.classList.remove("modal-visivel"));
    $("#overlay-modais").classList.remove("overlay-visivel");
    if (!$("#carrinho-lateral").classList.contains("carrinho-aberto")) {
      document.body.style.overflow = "";
    }
  }

  function iniciarEventos() {
    // Fecha modal ao clicar no botão "X"
    $all("[data-acao='fechar-modal']").forEach(botao => {
      botao.addEventListener("click", () => fecharModal(`#${botao.closest(".modal").id}`));
    });

    // Fecha todos os modais ao clicar no overlay
    $("#overlay-modais").addEventListener("click", fecharTodosOsModais);

    // Fecha com a tecla ESC (modais e carrinho)
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") {
        fecharTodosOsModais();
        CarrinhoLateral.fechar();
      }
    });
  }

  return { abrirModal, fecharModal, iniciarEventos };
})();

/* ============================================================================
   13. INICIALIZAÇÃO GERAL
   ========================================================================== */
/* ============================================================================
   14. SERVICE WORKER (PWA — necessário para "Adicionar à tela inicial")
   ----------------------------------------------------------------------------
   Registrado com caminho relativo ("sw.js", sem barra na frente) para
   funcionar corretamente também em hospedagens que servem o site a partir
   de uma subpasta (ex: GitHub Pages de projeto: usuario.github.io/meu-site/).
   ========================================================================== */
function registrarServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((erro) => {
      console.warn("Não foi possível registrar o service worker:", erro);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarNavbar();
  CarrosselPremium.montar();
  renderizarDiferenciais();
  Cardapio.montar();
  ModalPersonalizacao.iniciarEventos();
  CarrinhoLateral.iniciarEventos();
  Checkout.iniciarEventos();
  UI.iniciarEventos();
  iniciarScrollReveal();
  registrarServiceWorker();

  // Preenche dinamicamente os dados vindos de config.js (nome, whatsapp, etc.)
  preencherDadosDeConfig();

  // Dispara uma primeira renderização do carrinho (vazio) para exibir o estado inicial
  CarrinhoLateral.renderizar(Carrinho.obterItens(), Carrinho.calcularTotais());

  // Reavalia o horário de funcionamento a cada minuto, para o caso de o
  // cliente deixar o site aberto exatamente no momento em que a loja fecha/abre.
  setInterval(() => {
    CarrinhoLateral.renderizar(Carrinho.obterItens(), Carrinho.calcularTotais());
  }, 60000);
});

// Preenche elementos do HTML marcados com atributos data-config-* usando CONFIG
function preencherDadosDeConfig() {
  $all("[data-config-texto]").forEach(el => {
    const caminho = el.dataset.configTexto.split(".");
    let valor = CONFIG;
    caminho.forEach(chave => { valor = valor ? valor[chave] : undefined; });
    if (valor !== undefined) el.textContent = valor;
  });

  $all("[data-config-href]").forEach(el => {
    const chave = el.dataset.configHref;
    if (chave === "whatsapp") {
      el.href = `https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(CONFIG.whatsapp.mensagemInicial)}`;
    } else if (chave === "instagram") {
      el.href = CONFIG.redes.instagram;
    } else if (chave === "mapa") {
      el.href = CONFIG.endereco.linkGoogleMaps;
    }
  });

  // Nota de avaliação (estrelas) na Hero
  const notaEl = $("#hero-nota-avaliacao");
  if (notaEl) notaEl.textContent = CONFIG.avaliacoes.nota.toFixed(1);
  const totalAvaliacoesEl = $("#hero-total-avaliacoes");
  if (totalAvaliacoesEl) totalAvaliacoesEl.textContent = `${CONFIG.avaliacoes.totalAvaliacoes.toLocaleString("pt-BR")} avaliações`;
}
