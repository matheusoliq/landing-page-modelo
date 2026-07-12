# 🍔 Fábrica Smash — Landing Page + Sistema de Pedidos via WhatsApp

Sistema completo de cardápio digital e geração inteligente de pedidos para
WhatsApp, construído em **HTML5, CSS3 e JavaScript puro** (sem frameworks,
sem bibliotecas externas). Pronto para ser reaproveitado em qualquer
lancheria/hamburgueria — basta editar os arquivos de configuração.

> ⚠️ Este projeto **não processa pagamentos**. Ele é um gerador inteligente
> de pedidos: o cliente monta o pedido no site e, ao confirmar, uma
> mensagem pré-formatada é aberta no WhatsApp para ele apenas apertar "Enviar".

---

## ▶️ Como executar

Como o projeto usa JavaScript com módulos e `fetch`-like behaviors do
navegador, o ideal é servir os arquivos por um servidor local (abrir o
`index.html` direto com duplo clique também funciona na maioria dos
navegadores modernos, mas um servidor evita qualquer bloqueio de segurança
do navegador ao carregar arquivos locais).

**Opção 1 — Extensão "Live Server" (VS Code)**
1. Abra a pasta `landing-page/` no VS Code.
2. Clique com o botão direito em `index.html` → "Open with Live Server".

**Opção 2 — Servidor local com Python (já vem instalado na maioria dos sistemas)**
```bash
cd landing-page
python3 -m http.server 8000
```
Depois acesse `http://localhost:8000` no navegador.

**Opção 3 — Servidor local com Node.js**
```bash
npx serve landing-page
```

**Publicar online (gratuito):** arraste a pasta para a [Netlify](https://app.netlify.com/drop),
ou suba num repositório e ative o **GitHub Pages** / **Vercel** — nenhuma
configuração de build é necessária, pois é HTML/CSS/JS puro.

---

## 📁 Estrutura do projeto

```
landing-page/
├── index.html              → Estrutura da página (todas as seções)
├── css/
│   └── style.css           → Todo o visual (tokens de design + componentes)
├── js/
│   ├── config.js           → ⭐ Dados da empresa (nome, WhatsApp, taxa, horário...)
│   ├── produtos.js         → ⭐ Catálogo de produtos, categorias e adicionais
│   ├── carrinho.js         → Lógica do carrinho (estado em memória)
│   └── script.js           → Toda a interatividade (carrossel, modais, cardápio...)
├── assets/
│   ├── images/             → Pasta para imagens próprias (burgers/drinks/desserts)
│   ├── icons/               → favicon.svg (ícone do site)
│   └── fonts/               → (opcional) fontes customizadas
├── manifest.json           → Configuração PWA (ícone, cor do tema)
├── robots.txt               → Instruções para buscadores
├── sitemap.xml               → Mapa do site para SEO
└── README.md                → Este arquivo
```

**Os únicos dois arquivos que você provavelmente vai editar são `js/config.js`
e `js/produtos.js`.** Tudo o resto foi construído para funcionar
automaticamente a partir deles.

---

## ⚙️ Como personalizar para um novo cliente

### 1. Nome da empresa, WhatsApp, taxa de entrega, horário, endereço, Instagram
Edite **`js/config.js`**. Todos os campos têm comentários explicando o que
fazem. Exemplo:

```js
whatsapp: {
  numero: "5551999999999", // código do país + DDD + número, só dígitos
  ...
}
```

### 2. Logo
Por padrão, o site exibe o nome da empresa em texto estilizado
(`botekos`). Se quiser usar uma imagem de logo:
1. Coloque o arquivo em `assets/images/logo.svg` (ou `.png`).
2. No `index.html`, troque o texto dentro de `<a class="marca">` por uma tag `<img>` apontando para o arquivo.

### 3. Produtos, categorias e preços
Edite **`js/produtos.js`**:
- Adicione/remova itens do array `PRODUTOS` (cada um com id, nome, categoria, descrição, preço, imagem, disponibilidade etc.).
- `destaque: true` faz o produto aparecer no carrossel premium da home.
- Categorias (abas de filtro) ficam no array `CATEGORIAS`.

### 4. Adicionais (ex: Bacon +R$5,00)
Edite a lista `ADICIONAIS_DISPONIVEIS` em `js/produtos.js`. Todo produto com
`permiteAdicionais: true` mostrará automaticamente essa lista no modal de
personalização, com o preço somado em tempo real.

### 5. Ingredientes removíveis e ponto da carne
Cada produto pode ter sua própria lista em `ingredientesRemoviveis`, e
`permitePontoCarne: true/false` controla se o seletor de ponto aparece.

### 6. Taxa de entrega
Altere `entrega.taxaFixa` em `js/config.js`. Se for `0`, o carrinho e a
mensagem do WhatsApp mostrarão "Grátis" automaticamente.

### 7. Cores da marca
No topo de `css/style.css`, seção **"1. TOKENS DE DESIGN"**, altere as
variáveis (ex: `--cor-laranja`, `--cor-amarelo`, `--cor-vermelho`). Todo o
site (botões, gradientes, ícones, preços em destaque) usa essas variáveis —
não é necessário caçar cores espalhadas pelo CSS.

### 8. Fontes
O projeto usa **Sora** (títulos) e **Inter** (corpo de texto), carregadas
via Google Fonts no `<head>` do `index.html`. Para trocar, edite a tag
`<link>` das fontes e as variáveis `--fonte-display` / `--fonte-corpo` em
`style.css`.

### 9. Ícones
Todos os ícones são SVGs inline, centralizados no objeto `ICONES` no topo
de `js/script.js`. Para trocar um ícone, basta substituir o `path` do SVG
correspondente.

### 10. Imagens dos produtos
Por padrão, o projeto usa imagens de exemplo (Unsplash) apenas para fins de
demonstração. Substitua os links no campo `imagem` de cada produto em
`produtos.js` por fotos reais — o ideal é hospedá-las em `assets/images/`.

---

## 🧠 Como o sistema funciona por baixo dos panos

1. **`produtos.js`** é a fonte única de verdade do cardápio. O carrossel, a
   grade de produtos e o assistente de recomendação leem esses dados e se
   renderizam sozinhos — você nunca edita HTML para adicionar um produto.
2. **`carrinho.js`** guarda o estado do pedido em memória e dispara o
   evento customizado `carrinho:atualizado` sempre que algo muda. A
   interface (carrinho lateral, contador no ícone da navbar, resumo do
   checkout) escuta esse evento e se atualiza automaticamente — nada fica
   desatualizado.
3. **`script.js`** orquestra tudo: navbar, carrossel 3D, cardápio,
   modal de personalização, assistente de recomendação, carrinho lateral e
   checkout.
4. Ao clicar em **"Enviar pelo WhatsApp"**, o sistema monta um texto
   formatado (produto por produto, com adicionais, observações, subtotal,
   total geral e dados de entrega/retirada), usa `encodeURIComponent()`
   para deixá-lo seguro em uma URL, e abre `https://wa.me/SEUNUMERO?text=...`
   em uma nova aba. O cliente só precisa apertar "Enviar" dentro do
   WhatsApp.

> 💾 **Sobre persistência:** o carrinho é mantido apenas em memória
> (variável JavaScript) durante a visita — ele é limpo ao recarregar a
> página. Isso foi uma escolha deliberada para máxima compatibilidade em
> qualquer ambiente de preview. Se quiser que o carrinho sobreviva a um
> recarregamento de página em produção, é possível persistir o array
> `itens` do `carrinho.js` em `localStorage` (ou em um backend próprio)
> com poucas linhas de código.

---

## 🚀 Performance e SEO

- Todas as imagens usam `loading="lazy"`.
- Meta tags de SEO, Open Graph, Twitter Cards e dados estruturados
  **Schema.org** (`FastFoodRestaurant`) já estão configurados no `<head>`
  do `index.html` — atualize os valores conforme seu negócio.
- `manifest.json` deixa o site instalável como um app (PWA básico).
- `robots.txt` e `sitemap.xml` prontos para indexação em buscadores.
- CSS e JS são organizados em módulos pequenos e comentados, sem
  dependências externas pesadas — mantendo o Lighthouse alto por padrão.

---

## 🔮 Preparado para crescer

A arquitetura foi pensada para permitir, no futuro, sem reescrever a base:
- Painel administrativo para gerenciar produtos/pedidos.
- Integração com banco de dados e API própria (troque a leitura estática
  de `produtos.js` por uma chamada `fetch` à sua API).
- Sistema de autenticação de clientes.
- Pagamentos online (hoje o fluxo termina no WhatsApp; pode-se inserir uma
  etapa de pagamento antes do envio da mensagem).
- Atendimento automático via WhatsApp com IA (o "Assistente de
  Recomendação" já simula esse comportamento no front-end e pode ser
  conectado a uma IA real no back-end).

---

## 📱 Responsividade

Testado visualmente para: celular, tablet, notebook, desktop e telas
ultrawide — via CSS Grid, Flexbox, `clamp()` e media queries em
`css/style.css` (seção 15).

---

Feito com 🍔 e JavaScript puro.
