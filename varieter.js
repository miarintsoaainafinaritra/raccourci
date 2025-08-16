document.addEventListener('DOMContentLoaded', function() {
    // Données des variétés de noix
    const nuts = [
        {
            name: "Noix de Grenoble",
            icon: "fa-leaf",
            origin: "France",
            harvest: "Septembre à Novembre",
            characteristics: "Coquille fine, cerneau bien rempli",
            use: "Pâtisserie, consommation directe"
        },
        {
            name: "Noix de Périgord",
            icon: "fa-tree",
            origin: "France",
            harvest: "Octobre",
            characteristics: "Saveur douce et subtile",
            use: "Huile, apéritif"
        },
        {
            name: "Noix de Californie",
            icon: "fa-globe-americas",
            origin: "États-Unis",
            harvest: "Toute l'année",
            characteristics: "Gros calibre, saveur neutre",
            use: "Industrie, snacking"
        },
        {
            name: "Noix du Brésil",
            icon: "fa-globe-americas",
            origin: "Amérique du Sud",
            harvest: "Janvier à Mars",
            characteristics: "Grosse amande unique",
            use: "Énergie, cosmétique"
        },
        {
            name: "Noix de Macadamia",
            icon: "fa-seedling",
            origin: "Australie",
            harvest: "Mars à Septembre",
            characteristics: "Texture beurrée",
            use: "Confiserie, cuisine"
        },
        {
            name: "Noix de Cajou",
            icon: "fa-apple-alt",
            origin: "Afrique/Asie",
            harvest: "Février à Mai",
            characteristics: "Forme en demi-lune",
            use: "Apéritif, cuisine asiatique"
        }
    ];

    const nutContainer = document.getElementById('nut-container');
    const searchInput = document.getElementById('search-input');

    // Afficher toutes les noix au chargement
    displayNuts(nuts);

    // Filtrer les noix lors de la recherche
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredNuts = nuts.filter(nut => 
            nut.name.toLowerCase().includes(searchTerm) ||
            nut.origin.toLowerCase().includes(searchTerm) ||
            nut.characteristics.toLowerCase().includes(searchTerm) ||
            nut.use.toLowerCase().includes(searchTerm)
        );
        displayNuts(filteredNuts);
    });

    // Fonction pour afficher les noix
    function displayNuts(nutsToDisplay) {
        nutContainer.innerHTML = '';
        
        if (nutsToDisplay.length === 0) {
            nutContainer.innerHTML = '<p class="no-results">Aucune variété trouvée</p>';
            return;
        }

        nutsToDisplay.forEach(nut => {
            const nutCard = document.createElement('div');
            nutCard.className = 'nut-card';
            
            nutCard.innerHTML = `
                <div class="nut-icon">
                    <i class="fas ${nut.icon}"></i>
                </div>
                <div class="nut-info">
                    <h2>${nut.name}</h2>
                    <p><strong>Origine:</strong> ${nut.origin}</p>
                    <p><strong>Récolte:</strong> ${nut.harvest}</p>
                    <p><strong>Caractéristiques:</strong> ${nut.characteristics}</p>
                    <p><strong>Utilisation:</strong> ${nut.use}</p>
                </div>
            `;
            
            nutContainer.appendChild(nutCard);
        });
    }
});