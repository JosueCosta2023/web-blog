// filepath: c:\0-Projetos-React\web-blog\index.html
// Menu hamburguer responsivo
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
let posts = [];
let currentPage = 1;
const postsPerPage = 6;


// Eventos de busca e clique nas tags
document.addEventListener("DOMContentLoaded", function() {
    // ...ano do footer...

    const searchInput = document.getElementById('search-input');
    const searchForm = document.getElementById('search-form');
    const tagCloud = document.getElementById('tag-cloud');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // Remove destaque das tags ao digitar
            document.querySelectorAll('.tag.active').forEach(tag => tag.classList.remove('active'));
            filterPosts();
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            filterPosts();
        });
    }

    if (tagCloud) {
        tagCloud.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', function() {
                // Ativa/desativa a tag
                tagCloud.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                if (searchInput) searchInput.value = '';
                filterPosts();
            });
        });
    }
});



hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// SPA navegação simples (hash)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href').replace('#', '');
        window.location.hash = target;
    });
});


// ...existing code...

function createPostCard(post) {
    return `
    <div class="post-card" onclick="window.location.href='src/pages/post.html?id=${post.id}'" style="cursor:pointer">
        <img class="post-image" src="${post.imagem}" alt="Imagem do post">
        <div class="post-content">
            <div class="post-meta">
                <span class="post-date">${post.data}</span>
                <span class="post-author">por ${post.autor}</span>
            </div>
            <h2 class="post-title">${post.titulo}</h2>
            <p class="post-summary">${post.resumo.substring(0, 120)}${post.resumo.length > 120 ? '...' : ''}</p>
            <div class="post-footer">
                <div class="post-tags">
                    ${post.temas.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="post-actions">
                    <!-- ...botões de compartilhar... -->
                </div>
            </div>
        </div>
    </div>
    `;
}

// Função para compartilhar (simples, apenas exemplo)
function sharePost(rede, titulo) {
    const url = window.location.href;
    let shareUrl = '';
    const text = encodeURIComponent(`Veja este post: ${titulo} - ${url}`);
    switch (rede) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'x':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(titulo)}`;
            break;
    }
    window.open(shareUrl, '_blank');
}


let filteredPosts = [];

function filterPosts() {
    const searchInput = document.getElementById('search-input');
    const activeTag = document.querySelector('.tag.active');
    let searchText = searchInput ? searchInput.value.trim().toLowerCase() : '';
    filteredPosts = posts;

    if (searchText) {
        filteredPosts = filteredPosts.filter(post =>
            post.titulo.toLowerCase().includes(searchText)
        );
    }

    if (activeTag) {
        const keyword = activeTag.textContent.trim().toLowerCase();
        filteredPosts = filteredPosts.filter(post =>
            post.temas.some(tag => tag.toLowerCase().includes(keyword))
        );
    }

    currentPage = 1;
    renderPosts(filteredPosts);
}

function renderPosts(list = filteredPosts.length ? filteredPosts : posts) {
    const postsSection = document.getElementById('posts');
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    if (list.length === 0) {
        postsSection.innerHTML = `<div class="no-posts-message">Não há publicações com o filtro ou palavra pesquisada.</div>`;
        return;
    }
    postsSection.innerHTML = list.slice(start, end).map(createPostCard).join('') + renderPagination(list);
}

function renderPagination(list = filteredPosts.length ? filteredPosts : posts) {
    const totalPages = Math.ceil(list.length / postsPerPage);
    if (totalPages <= 1) return '';
    let html = `<div class="pagination">`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn${i === currentPage ? ' active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    html += `</div>`;
    return html;
}

window.goToPage = function(page) {
    currentPage = page;
    renderPosts();
};

// ...fetch posts...
fetch('./src/js/posts.json')
    .then(res => res.json())
    .then(data => {
        posts = data;
        filteredPosts = posts;

        // Gera lista única de temas
        const temasSet = new Set();
        posts.forEach(post => {
            if (Array.isArray(post.temas)) {
                post.temas.forEach(tag => temasSet.add(tag));
            }
        });

        // Renderiza as tags na tag-cloud
        const tagCloud = document.getElementById('tag-cloud');
        if (tagCloud) {
            tagCloud.innerHTML = '';
            Array.from(temasSet).sort().forEach(tag => {
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = tag;
                tagCloud.appendChild(span);
            });

            // Adiciona eventos de clique nas tags criadas
            tagCloud.querySelectorAll('.tag').forEach(tagEl => {
                tagEl.addEventListener('click', function() {
                    tagCloud.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) searchInput.value = '';
                    filterPosts();
                });
            });
        }

        renderPosts();
    });