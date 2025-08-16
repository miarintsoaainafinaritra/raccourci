  // Script pour gérer les interactions de la page
        document.addEventListener('DOMContentLoaded', function() {
            // Gestion du modal
            const modal = document.getElementById('harvestModal');
            const addBtn = document.getElementById('addHarvestBtn');
            const closeBtn = document.querySelector('#harvestModal .close-modal');
            const cancelBtn = document.getElementById('cancelHarvestBtn');
            
            // Ouvrir le modal
            addBtn.addEventListener('click', function() {
                modal.style.display = 'flex';
                // Définir la date d'aujourd'hui comme valeur par défaut
                document.getElementById('harvestDate').valueAsDate = new Date();
            });
            
            // Fermer le modal
            function closeModal() {
                modal.style.display = 'none';
            }
            
            closeBtn.addEventListener('click', closeModal);
            cancelBtn.addEventListener('click', closeModal);
            
            // Fermer quand on clique en dehors du modal
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    closeModal();
                }
            });
            
            // Gestion du formulaire
            const harvestForm = document.getElementById('harvestForm');
            
            harvestForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Ici vous ajouteriez le code pour sauvegarder la récolte
                alert('Récolte enregistrée avec succès!');
                closeModal();
                harvestForm.reset();
            });
            
            // Initialisation du graphique avec Chart.js
            const ctx = document.getElementById('harvestChart').getContext('2d');
            const harvestChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
                    datasets: [{
                        label: 'Production de noix (kg)',
                        data: [0, 0, 0, 0, 0, 0, 0, 45, 257, 120, 0, 0],
                        backgroundColor: 'rgba(39, 174, 96, 0.2)',
                        borderColor: 'rgba(39, 174, 96, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Kilogrammes (kg)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Mois de l\'année'
                            }
                        }
                    }
                }
            });
            
            // Gestion des boutons d'action dans le tableau
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remplir le modal avec les données de la ligne
                    modal.style.display = 'flex';
                    document.querySelector('.modal-title').innerHTML = '<i class="fas fa-clipboard-check"></i> Modifier Récolte';
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('Voulez-vous vraiment supprimer cette récolte ?')) {
                        // Code pour supprimer la récolte
                        const row = this.closest('tr');
                        row.style.transition = 'all 0.3s';
                        row.style.opacity = '0';
                        setTimeout(() => {
                            row.remove();
                        }, 300);
                    }
                });
            });
        });
    