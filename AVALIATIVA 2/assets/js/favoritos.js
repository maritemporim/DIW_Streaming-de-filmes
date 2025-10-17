document.addEventListener('DOMContentLoaded', function() {
    const favoritosContainer = document.getElementById('favoritos-container');
    const emptyMessage = document.getElementById('empty-favorites');

    function renderFavoritos() {
        if (!window.filmes) {
            console.error('Lista de filmes não carregada!');
            return;
        }

        const favoritosIds = JSON.parse(localStorage.getItem('favoritos') || '[]');
        console.log('IDs favoritos:', favoritosIds); 
        
        const filmesFavoritos = window.filmes.filter(filme => 
            favoritosIds.includes(filme.id));
        console.log('Filmes favoritos:', filmesFavoritos); 

        if (filmesFavoritos.length === 0) {
            favoritosContainer.style.display = 'none';
            emptyMessage.style.display = 'block';
            return;
        }

        favoritosContainer.innerHTML = '';
        filmesFavoritos.forEach(filme => {
            const col = document.createElement('div');
            col.className = 'col-6 col-sm-4 col-md-3 col-lg-2 mb-3';
            col.innerHTML = `
                <div class="card h-100">
                    <a href="detalhes.html?id=${filme.id}">
                        <img src="${filme.imagem}" class="card-img-top" alt="${filme.titulo}">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">${filme.titulo}</h5>
                        <button class="btn btn-danger btn-sm btn-remove" data-id="${filme.id}">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    </div>
                </div>
            `;
            favoritosContainer.appendChild(col);
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const filmeId = parseInt(this.getAttribute('data-id'));
                let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
                favoritos = favoritos.filter(id => id !== filmeId);
                localStorage.setItem('favoritos', JSON.stringify(favoritos));
                renderFavoritos(); 
            });
        });
    }

    if (!window.filmes) {
        setTimeout(renderFavoritos, 500);
    } else {
        renderFavoritos();
    }

    window.addEventListener('pageshow', renderFavoritos);
});