/* ============================================================================
   CONFIG.JS
   ----------------------------------------------------------------------------
   ARQUIVO CENTRAL DE CONFIGURAÇÃO DO SISTEMA.

   Este é o ÚNICO arquivo que você precisa editar para transformar este
   projeto no site de QUALQUER lancheria/hamburgueria.

   Nenhuma informação de negócio (nome, telefone, taxa, horário, endereço...)
   deve ficar espalhada em outros arquivos. Tudo vive aqui dentro.

   Para reutilizar este template em um novo cliente, basta:
     1. Alterar os valores deste arquivo (CONFIG).
     2. Alterar os produtos em js/produtos.js.
     3. Trocar as imagens em assets/images/.
     4. Trocar as cores/fontes em css/style.css (seção "TOKENS DE DESIGN").
   ========================================================================== */

const CONFIG = {

  // --------------------------------------------------------------------------
  // DADOS DA EMPRESA
  // --------------------------------------------------------------------------
  empresa: {
    nome: "Fábrica Smash",
    slogan: "Burgers artesanais, montados na hora.",
    descricaoCurta: "Hambúrgueres smash, ingredientes frescos e molhos autorais — pedidos direto pelo WhatsApp, sem enrolação.",
    logoTexto: "FÁBRICA SMASH", // usado enquanto não houver logo em imagem
    // logoImagem: "assets/images/logo.svg", // descomente e aponte para o arquivo se tiver um logo em imagem
    favicon: "assets/icons/favicon.svg",
    dominio: "https://www.fabricasmash.com.br" // usado nas tags de SEO / Open Graph
  },

  // --------------------------------------------------------------------------
  // WHATSAPP — para onde os pedidos serão enviados
  // --------------------------------------------------------------------------
  whatsapp: {
    // Formato internacional, apenas números: código do país + DDD + número
    numero: "5551999999999",
    mensagemInicial: "Olá! Gostaria de fazer o seguinte pedido:",
    mensagemFinal: "Obrigado(a)! Aguardarei a confirmação do pedido. 🙌"
  },

  // --------------------------------------------------------------------------
  // ENTREGA
  // --------------------------------------------------------------------------
  entrega: {
    taxaFixa: 8.00,          // taxa de entrega padrão (defina 0 para grátis)
    pedidoMinimo: 0,          // valor mínimo do pedido para entrega (0 = sem mínimo)
    tempoMedioRetirada: "15-20 min",
    tempoMedioEntrega: "35-45 min",
    raioAtendimento: "Entregamos em um raio de 6km do restaurante"
  },

  // --------------------------------------------------------------------------
  // HORÁRIO DE FUNCIONAMENTO
  // --------------------------------------------------------------------------
  horario: {
    // ⭐ INTERRUPTOR PRINCIPAL — controla o bloqueio de pedidos fora do horário.
    // true  = o site impede o cliente de finalizar o pedido quando a loja
    //         estiver fechada (usa os "periodos" abaixo para calcular isso).
    // false = desliga essa checagem por completo; o site aceita pedidos a
    //         qualquer hora, como antes. Não precisa mexer em mais nada.
    verificarAntesDeFinalizar: true,

    // Usado apenas para EXIBIÇÃO no rodapé do site (texto livre).
    linhas: [
      { dias: "Terça a Sexta", horas: "18h00 às 23h30" },
      { dias: "Sábado e Domingo", horas: "18h00 às 00h30" },
      { dias: "Segunda-feira", horas: "Fechado" }
    ],

    // Usado para o CÁLCULO real de "a loja está aberta agora?". Mantenha
    // sempre alinhado com as "linhas" acima (uma é o texto, a outra é a regra).
    //
    // Dias da semana seguem o padrão do JavaScript:
    //   0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta,
    //   4 = Quinta, 5 = Sexta, 6 = Sábado
    //
    // Períodos que passam da meia-noite (ex: abre 18h, fecha 00h30) são
    // tratados automaticamente — não precisa duplicar nada.
    periodos: [
      { dias: [2, 3, 4, 5], abre: "18:00", fecha: "23:30" }, // terça a sexta
      { dias: [6, 0],       abre: "18:00", fecha: "00:30" }  // sábado e domingo
      // segunda-feira (1) não aparece em nenhum período = fechado o dia todo
    ]
  },

  // --------------------------------------------------------------------------
  // GOOGLE SHEETS — registro automático de pedidos finalizados numa planilha
  // --------------------------------------------------------------------------
  googleSheets: {
    // ⭐ INTERRUPTOR PRINCIPAL — true = envia cada pedido finalizado para a
    // planilha automaticamente. false = desliga por completo (nada é enviado,
    // o site funciona normalmente sem essa integração).
    ativado: false,

    // Cole aqui a URL do Google Apps Script Web App depois de publicá-lo.
    // Veja o passo a passo completo em: google-sheets/README.md
    urlWebApp: ""
  },

  // --------------------------------------------------------------------------
  // ENDEREÇO
  // --------------------------------------------------------------------------
  endereco: {
    rua: "Rua das Torradeiras, 482",
    bairro: "Cidade Baixa",
    cidade: "Porto Alegre",
    estado: "RS",
    cep: "90050-000",
    linkGoogleMaps: "https://maps.google.com/?q=Rua+das+Torradeiras+482+Porto+Alegre"
  },

  // --------------------------------------------------------------------------
  // REDES SOCIAIS
  // --------------------------------------------------------------------------
  redes: {
    instagram: "https://instagram.com/fabricasmash",
    instagramHandle: "@fabricasmash"
  },

  // --------------------------------------------------------------------------
  // PROVA SOCIAL (usado na seção Hero)
  // --------------------------------------------------------------------------
  avaliacoes: {
    nota: 4.9,
    totalAvaliacoes: 1284
  },

  // --------------------------------------------------------------------------
  // DIFERENCIAIS (seção de cards animados)
  // --------------------------------------------------------------------------
  diferenciais: [
    {
      icone: "leaf",
      titulo: "Ingredientes frescos",
      descricao: "Selecionamos hortifruti todos os dias. Nada fica de um dia para o outro."
    },
    {
      icone: "flame",
      titulo: "Carne artesanal smash",
      descricao: "Blend próprio, moído diariamente e selado na chapa a 250°C."
    },
    {
      icone: "sauce",
      titulo: "Molhos exclusivos",
      descricao: "Receitas autorais que você não encontra em nenhum outro lugar."
    },
    {
      icone: "bike",
      titulo: "Entrega rápida",
      descricao: "Saímos da chapa direto para a sua porta em média 35 minutos."
    },
    {
      icone: "heart",
      titulo: "Atendimento humanizado",
      descricao: "Time de verdade, resposta rápida, sem robôs sem noção."
    },
    {
      icone: "clock",
      titulo: "Feito na hora",
      descricao: "Seu pedido só entra na chapa depois que você confirma. Sempre fresquinho."
    }
  ]
};

// Congela o objeto para evitar alterações acidentais em outros arquivos
Object.freeze(CONFIG);
