# mateus-ribeiro-spec.github.io

Página pessoal do Mateus Ribeiro, bilíngue (EN padrão / PT).

**No ar:** https://mateus-ribeiro-spec.github.io

## Estrutura

| Arquivo | O que é |
| --- | --- |
| `index.html` | Estrutura da página (sem texto de conteúdo). |
| `styles.css` | Estilo editorial claro, mobile primeiro. |
| `app.js` | Carrega o JSON do idioma e troca PT/EN. |
| `data/content.en.json` | Todo o texto em inglês. |
| `data/content.pt.json` | Todo o texto em português. |
| `.github/workflows/deploy.yml` | Publica no GitHub Pages a cada push na `main`. |

## Como atualizar o conteúdo

1. Edite `data/content.en.json` **e** `data/content.pt.json`.
2. Mantenha **as mesmas chaves e a mesma estrutura** nos dois arquivos (mesmo número de itens em `highlights`, `experience`, `education`, `links` etc.). Só os valores mudam de um idioma para o outro.
3. Itens que precisam de confirmação levam `"needsConfirmation": true` e aparecem com um selo `?` na página.
4. Se mudar `meta.title` ou `meta.description` em inglês, copie os mesmos valores para as tags `<title>`, `description` e `og:*` no `<head>` do `index.html` (são a versão estática lida por robôs de busca e prévias de link).
5. Abra um PR. Ao fazer merge na `main`, o deploy roda sozinho.

Não escreva texto de conteúdo direto no HTML: tudo que aparece na tela vem do JSON.

## Rodar localmente

O `app.js` usa `fetch`, então abra por um servidor HTTP (não por `file://`):

```sh
python3 -m http.server 8000
```

Acesse http://localhost:8000 e use `?lang=pt` ou `?lang=en` para forçar um idioma. Pare o servidor com `Ctrl+C`.

## Deploy

Feito pelo workflow `.github/workflows/deploy.yml` (runner `ubuntu-latest`) a cada push na `main`, ou manualmente pela aba Actions.

**Passo único (humano):** em *Settings → Pages → Build and deployment → Source*, escolha **GitHub Actions**. Sem isso o workflow falha no deploy.

## Privacidade

Sem analytics, trackers ou cookies. A escolha de idioma fica só no `localStorage` do navegador. A única dependência externa é o Google Fonts.

## Licença

Código sob [MIT](LICENSE). Textos e dados pessoais (conteúdo de `data/`) **não** estão incluídos na licença; veja a nota no fim do `LICENSE`.
