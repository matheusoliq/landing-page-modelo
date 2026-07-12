# 📊 Integração com Google Sheets — Registro Automático de Pedidos

Esta pasta contém tudo que você precisa para que **cada pedido finalizado no
site seja automaticamente registrado numa planilha do Google Sheets** —
permitindo calcular quantos pedidos foram feitos, valor bruto arrecadado,
produto mais vendido, ticket médio, e outras métricas que você quiser
construir em cima dos dados.

Eu não tenho acesso à sua conta Google, então não consigo criar a planilha
por você — mas o processo abaixo leva uns 10 minutos e não exige nenhum
conhecimento técnico além de copiar e colar.

---

## Passo 1 — Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha em branco.
2. Dê um nome a ela, por exemplo **"Fábrica Smash — Pedidos"**.

Você **não precisa criar nenhuma aba/coluna manualmente** — o script faz
isso sozinho no primeiro pedido recebido.

---

## Passo 2 — Colar o código do Apps Script

1. Na planilha, vá em **Extensões → Apps Script**.
2. Apague todo o conteúdo do arquivo `Código.gs` que abrir.
3. Copie **todo o conteúdo** do arquivo [`apps-script.gs`](./apps-script.gs) (nesta mesma pasta) e cole lá.
4. Clique no ícone de salvar (💾) ou `Ctrl+S`.

---

## Passo 3 — Publicar como Web App

1. No editor do Apps Script, clique em **Implantar → Nova implantação**.
2. Clique no ícone de engrenagem ⚙️ ao lado de "Selecionar tipo" e escolha **"App da Web"**.
3. Configure:
   - **Executar como:** Eu (seu e-mail)
   - **Quem pode acessar:** Qualquer pessoa
4. Clique em **Implantar**.
5. Na primeira vez, o Google vai pedir autorização — clique em **Autorizar acesso**, escolha sua conta, e depois em **Avançado → Acessar [nome do projeto] (não seguro)** → **Permitir**. (Esse aviso aparece porque é um script feito por você mesmo, não por um desenvolvedor externo — é seguro.)
6. Copie a **URL do Web App** que aparece (algo como `https://script.google.com/macros/s/AKfycb.../exec`).

> ⚠️ Sempre que você **editar** o código do Apps Script, é necessário fazer
> **Implantar → Gerenciar implantações → ✏️ Editar → Nova versão → Implantar**
> para que as mudanças entrem em vigor. Só salvar o arquivo não é suficiente.

---

## Passo 4 — Conectar ao site

Abra `js/config.js` e edite:

```js
googleSheets: {
  ativado: true, // troque de false para true
  urlWebApp: "https://script.google.com/macros/s/SEU-CODIGO-AQUI/exec" // cole a URL do passo 3
}
```

Pronto. A partir de agora, todo pedido enviado pelo site também será
gravado na planilha, automaticamente, sem nenhuma ação do cliente.

**Para desligar essa integração a qualquer momento**, basta voltar
`ativado` para `false` — nenhuma outra alteração é necessária.

---

## O que é gravado, e onde

O script cria automaticamente duas abas:

### Aba "Pedidos" (1 linha por pedido)

| Coluna | Conteúdo |
|---|---|
| A — Data/Hora | Data e hora exata do pedido |
| B — Qtd. Itens | Quantidade total de itens no pedido |
| C — Subtotal | Soma dos produtos (sem taxa de entrega) |
| D — Taxa de Entrega | Valor da taxa (0 se for retirada) |
| E — Total | Valor final do pedido |
| F — Forma de Recebimento | "Entrega" ou "Retirada" |
| G — Nome | Nome do cliente (só em pedidos de entrega) |
| H — Telefone | Telefone do cliente (só em pedidos de entrega) |
| I — Endereço | Rua, número e complemento |
| J — Bairro | |
| K — Cidade | |
| L — CEP | |
| M — Referência | Ponto de referência |

### Aba "Itens_Pedidos" (1 linha por produto dentro do pedido)

| Coluna | Conteúdo |
|---|---|
| A — Data/Hora | Mesma data/hora do pedido (para conseguir agrupar depois) |
| B — Produto | Nome do produto |
| C — Quantidade | Quantidade daquele produto no pedido |
| D — Preço Unitário | Preço base do produto (sem adicionais) |
| E — Adicionais | Lista dos adicionais escolhidos, separados por vírgula |
| F — Valor Adicionais | Soma do valor de todos os adicionais daquele item |
| G — Subtotal do Item | (Preço unitário + adicionais) × quantidade |
| H — Observações | Texto livre digitado pelo cliente |

A separação em duas abas é proposital: a aba **"Pedidos"** serve para
métricas de pedido (quantos pedidos, valor total, ticket médio), e a aba
**"Itens_Pedidos"** serve para métricas de produto (o que mais vende) —
sem isso, calcular "produto mais pedido" a partir de uma única célula com
vários produtos juntos seria bem mais difícil.

---

## Passo 5 — Criar o painel de métricas ("Resumo")

Crie uma nova aba chamada **"Resumo"** e cole as fórmulas abaixo em
qualquer célula (eu recomendo montar um pequeno painel como no exemplo):

**Total de pedidos:**
```
=COUNTA(Pedidos!A2:A)
```

**Valor bruto arrecadado:**
```
=SUM(Pedidos!E2:E)
```

**Ticket médio por pedido:**
```
=IFERROR(AVERAGE(Pedidos!E2:E), 0)
```

**Total de itens vendidos:**
```
=SUM(Itens_Pedidos!C2:C)
```

**Top 5 produtos mais pedidos (por quantidade):**
```
=QUERY(Itens_Pedidos!B2:C, "select B, sum(C) where B is not null group by B order by sum(C) desc limit 5 label sum(C) 'Quantidade Total'", 0)
```

**Pedidos de hoje:**
```
=COUNTIFS(Pedidos!A2:A, ">="&TODAY(), Pedidos!A2:A, "<"&(TODAY()+1))
```

**Faturamento do mês atual:**
```
=SUMIFS(Pedidos!E2:E, Pedidos!A2:A, ">="&EOMONTH(TODAY(),-1)+1, Pedidos!A2:A, "<="&TODAY())
```

> 💡 **Alternativa mais visual (sem fórmulas):** em vez da fórmula de "Top 5
> produtos", você também pode selecionar a aba `Itens_Pedidos` e ir em
> **Inserir → Gráfico dinâmico (Pivot Table)**, colocando "Produto" nas
> linhas e "SOMA de Quantidade" nos valores, ordenando do maior para o
> menor. É a forma mais simples de enxergar o ranking sem escrever nada.

---

## Testando

1. Faça um pedido de teste no site (com `googleSheets.ativado = true` e a
   URL configurada).
2. Abra a planilha — em poucos segundos, uma nova linha deve aparecer em
   "Pedidos" e uma ou mais linhas em "Itens_Pedidos".
3. Se nada aparecer, abra a URL do Web App direto no navegador: ela deve
   mostrar a mensagem *"Apps Script da Fábrica Smash está funcionando..."*.
   Se der erro, revise o Passo 3 (a implantação precisa estar com acesso
   "Qualquer pessoa").

---

## Sobre privacidade

Os dados enviados (nome, telefone, endereço) ficam apenas na sua própria
planilha do Google — nada passa por servidores de terceiros além da
infraestrutura do próprio Google. Trate o link da planilha e o acesso a
ela com o mesmo cuidado que trataria qualquer outro dado de cliente.
