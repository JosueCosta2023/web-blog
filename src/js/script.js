// filepath: c:\0-Projetos-React\web-blog\index.html
// Menu hamburguer responsivo
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
let posts = [];
let currentPage = 1;
const postsPerPage = 6;




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

// Função para criar o HTML de cada card de post
function createPostCard(post) {
    return `
    <div class="post-card">
        <img class="post-image" src="${post.imagem}" alt="Imagem do post">
        <div class="post-content">
            <div class="post-meta">
                <span class="post-date">${post.data}</span>
                <span class="post-author">por ${post.autor}</span>
            </div>
            <h2 class="post-title">${post.titulo}</h2>
            <p class="post-summary">${post.resumo.substring(0, 120)}${post.resumo.length > 120 ? '...' : ''}</p>
            <div class="post-tags">
                ${post.temas.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="post-actions">
                <button class="share-btn" title="Compartilhar no Facebook" onclick="sharePost('facebook', '${post.titulo}')">
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" />
                </button>
                <button class="share-btn" title="Compartilhar no X" onclick="sharePost('x', '${post.titulo}')">
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="X" />
                </button>
                <button class="share-btn" title="Compartilhar no WhatsApp" onclick="sharePost('whatsapp', '${post.titulo}')">
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" alt="WhatsApp" />
                </button>
                <button class="share-btn" title="Compartilhar no LinkedIn" onclick="sharePost('linkedin', '${post.titulo}')">
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" />
                </button>
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

function renderPosts() {
    const postsSection = document.getElementById('posts');
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    postsSection.innerHTML = posts.slice(start, end).map(createPostCard).join('') + renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(posts.length / postsPerPage);
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

// Carregar posts do JSON e renderizar
fetch('./src/js/posts.json')
    .then(res => res.json())
    .then(data => {
        posts = data;
        renderPosts();
    });
// ...existing code...