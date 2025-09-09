# 📱 Local Pulse

Aplicativo de notícias locais desenvolvido como **PWA** (Progressive Web App).  
Pode ser acessado direto no navegador ou instalado na tela inicial do celular como se fosse um app nativo.

🔗 Link público: [Local Pulse](https://leoaraujo73.github.io/local-pulse/)

---

## 🚀 Funcionalidades
- Lista de categorias (Mineração, Cooperativismo, Política Local, Economia).
- Busca por título ou descrição.
- Leitor integrado (abre notícia completa em modal).
- Botão **LINK/Abrir fonte** só aparece se a notícia tiver um link válido.
- Instalável como **PWA** (funciona offline básico).
- Atualização fácil via arquivo `noticias.json`.

## 🎨 Paleta de cores por categoria

| Categoria        | Cor       |
|------------------|-----------|
| Mineração        | `#f59e0b` |
| Cooperativismo   | `#8b5cf6` |
| Economia         | `#10b981` |
| Política Local   | `#ef4444` |

---

## 📰 Como atualizar as notícias
1. Entre no repositório no GitHub.
2. Abra o arquivo `noticias.json`.
3. Clique no ícone do **lápis** (editar).
4. Adicione, altere ou remova notícias no formato abaixo:

```json
{
  "id": "eco-003",
  "categoria": "Economia",
  "titulo": "Exemplo de nova notícia",
  "descricao": "Resumo curto da notícia.",
  "conteudo": "Texto completo da notícia...",
  "data": "2025-09-08",
  "link": "https://exemplo.com"
}
local-pulse/
├─ index.html
├─ styles.css
├─ app.js
├─ noticias.json
├─ manifest.webmanifest
├─ sw.js
├─ icon-192.png
└─ icon-512.png
