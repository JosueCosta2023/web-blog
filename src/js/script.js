// filepath: c:\0-Projetos-React\web-blog\index.html
    // Menu hamburguer responsivo
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
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
            // Aqui você pode adicionar lógica para carregar o conteúdo SPA
        });
    });