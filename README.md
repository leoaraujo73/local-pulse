# 🌐 Local Pulse

**Local Pulse** é um aplicativo web (PWA) de notícias locais, simples e rápido, publicado via **GitHub Pages**.  
O conteúdo é totalmente dinâmico e vem do arquivo [`noticias.json`](./noticias.json), que pode ser editado para atualizar o app.

🔗 **Acesse o app online:** [Local Pulse](https://leoaraujo73.github.io/local-pulse/)

---

## ✨ Funcionalidades
- Listagem de notícias por categorias.
- Filtro por categoria e pesquisa por texto.
- Leitor integrado para abrir a notícia completa.
- Instalação no celular como aplicativo (PWA).
- Atualização automática do conteúdo editando o `noticias.json`.

---

## 📁 Estrutura do projeto
- `index.html` → Página principal do app.  
- `styles.css` → Estilos (tema escuro, responsivo).  
- `app.js` → Lógica para carregar e renderizar notícias.  
- `noticias.json` → Fonte de dados das notícias.  
- `manifest.webmanifest` → Configuração do PWA.  
- `sw.js` → Service Worker para cache offline básico.  
- `icons/` → Ícones do app.  

---

## 📰 Como atualizar o conteúdo
1. Abra o arquivo [`noticias.json`](./noticias.json) no GitHub.  
2. Clique em **Editar** (ícone de lápis).  
3. Adicione, altere ou remova notícias no formato abaixo:

```json
{
  "id": "eco-003",
  "categoria": "Economia",
  "titulo": "Nova notícia de exemplo",
  "descricao": "Resumo curto da notícia.",
  "conteudo": "Texto completo da notícia, com detalhes e informações adicionais.",
  "data": "2025-09-08",
  "link": ""
}
