/* ============================================================================
   SW.JS — SERVICE WORKER
   ----------------------------------------------------------------------------
   Service worker mínimo, responsável por:
     1. Deixar o site instalável como app (ícone na tela inicial) com a
        melhor experiência possível em todos os navegadores baseados em
        Chromium (Chrome, Edge, Samsung Internet, Opera).
     2. Cachear os arquivos principais para que o site abra mais rápido
        (e continue funcionando) mesmo com internet instável.

   Não é necessário editar este arquivo. Se adicionar novas imagens/páginas
   e quiser que fiquem disponíveis offline, inclua o caminho na lista
   ARQUIVOS_PARA_CACHE abaixo.
   ========================================================================== */

const NOME_DO_CACHE = "fabrica-smash-cache-v1";

const ARQUIVOS_PARA_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/config.js",
  "./js/produtos.js",
  "./js/carrinho.js",
  "./js/script.js",
  "./manifest.json",
  "./assets/icons/favicon.svg"
];

// Ao instalar o service worker, pré-carrega os arquivos essenciais no cache
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(NOME_DO_CACHE).then((cache) => cache.addAll(ARQUIVOS_PARA_CACHE))
  );
  self.skipWaiting();
});

// Remove caches de versões antigas quando um novo service worker assume
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(
        chaves
          .filter((chave) => chave !== NOME_DO_CACHE)
          .map((chave) => caches.delete(chave))
      )
    )
  );
  self.clients.claim();
});

// Estratégia "cache primeiro, com atualização em segundo plano":
// responde rápido com o que já está em cache, e atualiza o cache com a
// versão mais nova assim que a rede responder.
self.addEventListener("fetch", (evento) => {
  // Ignora requisições que não sejam GET (ex: nenhuma neste projeto, mas por segurança)
  if (evento.request.method !== "GET") return;

  evento.respondWith(
    caches.match(evento.request).then((respostaCache) => {
      const busca = fetch(evento.request)
        .then((respostaRede) => {
          caches.open(NOME_DO_CACHE).then((cache) => {
            cache.put(evento.request, respostaRede.clone());
          });
          return respostaRede;
        })
        .catch(() => respostaCache); // sem internet: cai para o cache, se existir

      return respostaCache || busca;
    })
  );
});
