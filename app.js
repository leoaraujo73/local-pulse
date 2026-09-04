const state = {
  data: null,
  filtered: [],
  activeCat: 'Todas',
};

// Mapeia categorias para cores de identificação nos cards
const categoryColors = {
  'Mineração': '#f59e0b',      // âmbar
  'Cooperativismo': '#8b5cf6', // violeta
  'Economia': '#10b981',       // verde
  'Política Local': '#ef4444', // vermelho
};

function getHttpUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') return null;

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function applyCategoryColor(element, category) {
  const color = categoryColors[category];
  if (!color) return;

  element.style.background = color;
  element.style.borderColor = color;
  element.style.color = '#0b1220';
}

async function loadData() {
  const res = await fetch('./noticias.json?_=' + Date.now());
  if (!res.ok) throw new Error('Falha ao carregar noticias.json');
  const json = await res.json();
  state.data = json;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderCategories() {
  const cats = ['Todas', ...new Set(state.data.items.map(i => i.categoria))];
  const nav = document.getElementById('categories');
  nav.innerHTML = '';
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (cat === state.activeCat ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      state.activeCat = cat; filterAndRender(); renderCategories();
    });
    nav.appendChild(btn);
  });
}

function filterAndRender() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  state.filtered = state.data.items.filter(item => {
    const passCat = state.activeCat === 'Todas' || item.categoria === state.activeCat;
    const passSearch = !q || item.titulo.toLowerCase().includes(q) || (item.descricao||'').toLowerCase().includes(q);
    return passCat && passSearch;
  });
  renderFeed();
}

function renderFeed() {
  const feed = document.getElementById('feed');
  const tpl = document.getElementById('cardTemplate');
  feed.innerHTML = '';

  if (state.filtered.length === 0) {
    feed.innerHTML = '<p style="opacity:.7">Nenhuma notícia encontrada.</p>';
    return;
  }

  state.filtered
      .sort((a,b) => new Date(b.data) - new Date(a.data))
      .forEach(item => {
        const node = tpl.content.cloneNode(true);
        const catEl = node.querySelector('[data-category]');
        catEl.textContent = item.categoria;
        applyCategoryColor(catEl, item.categoria);
        node.querySelector('[data-date]').textContent = formatDate(item.data);
        node.querySelector('[data-title]').textContent = item.titulo;
        node.querySelector('[data-desc]').textContent = item.descricao || '';

        const imageUrl = getHttpUrl(item.imagem);
        const image = node.querySelector('[data-img]');
        if (imageUrl) {
          image.src = imageUrl;
          image.alt = item.titulo || 'Imagem da notícia';
          image.style.display = 'block';
          image.addEventListener('error', () => {
            image.style.display = 'none';
          }, { once: true });
        }

        const sourceUrl = getHttpUrl(item.link);
        const sourceLink = node.querySelector('[data-link]');
        if (sourceUrl) {
          sourceLink.href = sourceUrl;
        } else {
          sourceLink.style.display = 'none';
        }

        node.querySelector('[data-open]').addEventListener('click', () => openReader(item));
        feed.appendChild(node);
      });
}

function openReader(item) {
  const dlg = document.getElementById('reader');
  const readerCategory = document.getElementById('readerCat');
  readerCategory.removeAttribute('style');
  readerCategory.textContent = item.categoria;
  applyCategoryColor(readerCategory, item.categoria);
  document.getElementById('readerTitle').textContent = item.titulo;
  document.getElementById('readerDate').textContent = formatDate(item.data);
  document.getElementById('readerBody').textContent = item.conteudo || item.descricao || '';
  const link = document.getElementById('readerLink');
  const sourceUrl = getHttpUrl(item.link);
  if (sourceUrl) {
    link.href = sourceUrl;
    link.style.display = 'inline-flex';
  } else {
    link.removeAttribute('href');
    link.style.display = 'none';
  }
  dlg.showModal();
}

function setupEvents() {
  document.getElementById('searchInput').addEventListener('input', filterAndRender);
  document.getElementById('closeReader').addEventListener('click', () => {
    document.getElementById('reader').close();
  });
}

(async function init(){
  try {
    await loadData();
    setupEvents();
    renderCategories();
    filterAndRender();
  } catch (e) {
    document.getElementById('feed').innerHTML = '<p style="color:#fca5a5">Erro: '+ e.message +'</p>';
  }
})();
