# Prepare updated app.js and noticias.json with real links, and bundle into a zip
import json, os, zipfile, textwrap, io, shutil, datetime

base_dir = "/mnt/data/local-pulse-updates"
os.makedirs(base_dir, exist_ok=True)

# Updated app.js (same as previously provided, ensuring modal link hides when missing)
app_js = """const state = {
  data: null,
  filtered: [],
  activeCat: 'Todas',
};

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
      node.querySelector('[data-category]').textContent = item.categoria;
      node.querySelector('[data-date]').textContent = formatDate(item.data);
      node.querySelector('[data-title]').textContent = item.titulo;
      node.querySelector('[data-desc]').textContent = item.descricao || '';

      // LINK no card: só se houver URL http/https
      const linkEl = node.querySelector('[data-link]');
      if (item.link && /^https?:\\/\\//i.test(item.link)) {
        linkEl.href = item.link;
        linkEl.setAttribute('target', '_blank');
        linkEl.setAttribute('rel', 'noopener');
        linkEl.style.display = 'inline-flex';
      } else {
        linkEl.remove();
      }

      node.querySelector('[data-open]').addEventListener('click', () => openReader(item));
      feed.appendChild(node);
    });
}

function openReader(item) {
  const dlg = document.getElementById('reader');
  document.getElementById('readerCat').textContent = item.categoria;
  document.getElementById('readerTitle').textContent = item.titulo;
  document.getElementById('readerDate').textContent = formatDate(item.data);
  document.getElementById('readerBody').innerHTML = (item.conteudo || item.descricao || '')
    .replace(/\\n/g, '<br/>');

  const link = document.getElementById('readerLink');
  if (item.link && /^https?:\\/\\//i.test(item.link)) {
    link.href = item.link;
    link.style.display = 'inline-flex';
  } else {
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
})();"""

with open(os.path.join(base_dir, "app.js"), "w", encoding="utf-8") as f:
    f.write(app_js)

# Updated noticias.json with real links
today = datetime.date.today().isoformat()
noticias = {
    "versao": 1,
    "fonte": "Local Pulse",
    "items": [
        {
            "id": "min-001",
            "categoria": "Mineração",
            "titulo": "Novo layout de britagem em fase de testes em cooperativa local",
            "descricao": "Projeto prevê otimização de esteiras e moinhos para cobre.",
            "conteudo": "O projeto considera alimentador primário, moinho de martelos, transportadoras de 7 m e 7,5 m e moinho de bolas, com posterior flotação. Ajustes visam melhor manutenção e segurança operacional.",
            "data": today,
            "link": "https://www.mining.com/"  # portal de notícias do setor
        },
        {
            "id": "min-002",
            "categoria": "Mineração",
            "titulo": "Estudo aponta potencial de corretivo agrícola em jazida de Matões",
            "descricao": "Laudo químico indica alto teor de CaO e MgO.",
            "conteudo": "O levantamento químico revelou a presença significativa de CaO e MgO, essenciais para corretivo agrícola e aplicações industriais.",
            "data": today,
            "link": "https://www.gov.br/anm/pt-br"  # Agência Nacional de Mineração
        },
        {
            "id": "coop-001",
            "categoria": "Cooperativismo",
            "titulo": "Assembleia define calendário fixo de prestação de contas",
            "descricao": "Cooperados aprovam datas trimestrais.",
            "conteudo": "Calendário fixa prestação de contas trimestral com auditoria independente e publicação online dos relatórios.",
            "data": today,
            "link": "https://www.ocb.org.br/"  # Organização das Cooperativas do Brasil
        },
        {
            "id": "coop-002",
            "categoria": "Cooperativismo",
            "titulo": "Debate sobre governança em cooperativas de mineração ganha força",
            "descricao": "Lideranças pedem mais voz para a base.",
            "conteudo": "Fortalecimento de governança, participação efetiva dos cooperados e combate a irregularidades.",
            "data": today,
            "link": "https://www.brasilcooperativo.coop.br/"  # Portal do cooperativismo
        },
        {
            "id": "pol-001",
            "categoria": "Política Local",
            "titulo": "Audiência pública discute mineração sustentável no município",
            "descricao": "Vereadores e sociedade civil debatem impactos ambientais.",
            "conteudo": "Propostas de fiscalização ambiental e incentivo à mineração sustentável.",
            "data": today,
            "link": "https://www.camara.leg.br/"  # Câmara dos Deputados (referência)
        },
        {
            "id": "pol-002",
            "categoria": "Política Local",
            "titulo": "Eleições municipais terão jovem empresária como pré-candidata",
            "descricao": "Perfil de mulher advogada e empresária ganha apoio local.",
            "conteudo": "Bandeiras: inovação, emprego e empreendedorismo.",
            "data": today,
            "link": "https://www.tse.jus.br/"  # Tribunal Superior Eleitoral
        },
        {
            "id": "eco-001",
            "categoria": "Economia",
            "titulo": "Cotação do ouro acima de R$ 600/g anima cooperados",
            "descricao": "Cenário reforça plano de curto prazo para renda dos cooperados.",
            "conteudo": "Venda direta e beneficiamento podem aumentar a margem.",
            "data": today,
            "link": "https://valor.globo.com/financas/"  # Valor Econômico - finanças
        },
        {
            "id": "eco-002",
            "categoria": "Economia",
            "titulo": "Investimentos em mineração movimentam economia regional",
            "descricao": "Novos projetos aumentam emprego e renda.",
            "conteudo": "Projeções positivas para comércio e serviços locais.",
            "data": today,
            "link": "https://g1.globo.com/economia/"  # G1 Economia
        }
    ]
}

with open(os.path.join(base_dir, "noticias.json"), "w", encoding="utf-8") as f:
    json.dump(noticias, f, ensure_ascii=False, indent=2)

# Bundle zip
zip_path = "/mnt/data/local-pulse-updates.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    z.write(os.path.join(base_dir, "app.js"), arcname="app.js")
    z.write(os.path.join(base_dir, "noticias.json"), arcname="noticias.json")

(zip_path, os.path.join(base_dir, "app.js"), os.path.join(base_dir, "noticias.json"))

