document.addEventListener("DOMContentLoaded", function () {
    // Atualiza o ano do footer
    const yearSpan = document.getElementById('footer-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Função de compartilhamento
    window.sharePost = function (rede, titulo, resumo) {
        const url = window.location.href;
        let shareUrl = '';
        const text = encodeURIComponent(`${titulo} - ${resumo}\n${url}`);
        const title = encodeURIComponent(titulo);
        const summary = encodeURIComponent(resumo);

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
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`;
                break;
        }
        window.open(shareUrl, '_blank');
    };

    // Pega o ID do post da URL
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    fetch('../js/posts.json')
        .then(res => res.json())
        .then(posts => {
            const post = posts.find(p => p.id == postId);
            if (!post) {
                document.getElementById('post-content').innerHTML = "<p>Post não encontrado.</p>";
                return;
            }
            document.title = post.titulo + " - Blog AI";
            document.getElementById('post-content').innerHTML = `
                <article class="post-full">
                    <img class="post-full-image" src="${post.imagem}" alt="Imagem do post">
                    <h1 class="post-full-title">${post.titulo}</h1>
                    <div class="post-meta">
                        <span class="post-date">${post.data}</span>
                        <span class="post-author">por <a href="mailto:contato@blogai.com.br">${post.autor}</a></span>
                    </div>
                    <div class="post-full-body">
                        ${post.texto ? post.texto.map(paragrafo => `<p>${paragrafo}</p>`).join('') : `<p>${post.resumo}</p>`}
                    </div>
                    
                    <h4 class="share-text">Compartilhar</h4>
                    <div class="post-footer">
                        <div class="post-tags">
                            ${post.temas.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <div class="post-actions">
                            <button class="share-btn" title="Compartilhar no Facebook" onclick="sharePost('facebook', '${post.titulo}', '${post.resumo}')">
                                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg" alt="Facebook" />
                            </button>
                            <button class="share-btn" title="Compartilhar no X" onclick="sharePost('x', '${post.titulo}', '${post.resumo}')">
                                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg" alt="X" />
                            </button>
                            <button class="share-btn" title="Compartilhar no WhatsApp" onclick="sharePost('whatsapp', '${post.titulo}', '${post.resumo}')">
                                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg" alt="WhatsApp" />
                            </button>
                            <button class="share-btn" title="Compartilhar no LinkedIn" onclick="sharePost('linkedin', '${post.titulo}', '${post.resumo}')">
                                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg" alt="LinkedIn" />
                            </button>
                        </div>
                    </div>
                </article>
            `;
        });
});