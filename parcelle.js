        document.addEventListener('DOMContentLoaded', function() {
            // Données de démonstration
            const parcels = [
                {
                    id: 'P001',
                    name: 'Verger Nord',
                    variety: 'Noix de Grenoble',
                    size: 2.5,
                    year: 2015,
                    status: 'En production',
                    location: 'Secteur A',
                    trees: 120,
                    yield: 850,
                    notes: 'Parcelle très productive. Arbres en bonne santé.'
                },
                {
                    id: 'P002',
                    name: 'Verger Sud',
                    variety: 'Noix de Périgord',
                    size: 3.2,
                    year: 2018,
                    status: 'En conversion',
                    location: 'Secteur B',
                    trees: 150,
                    yield: 650,
                    notes: 'Conversion bio en cours. Rendement légèrement en baisse cette année.'
                },
                {
                    id: 'P003',
                    name: 'Verger Est',
                    variety: 'Franquette',
                    size: 1.8,
                    year: 2020,
                    status: 'Nouvelle plantation',
                    location: 'Secteur C',
                    trees: 90,
                    yield: 300,
                    notes: 'Jeune plantation. Première récolte prévue en 2024.'
                },
                {
                    id: 'P004',
                    name: 'Verger Ouest',
                    variety: 'Mayette',
                    size: 2.1,
                    year: 2012,
                    status: 'En entretien',
                    location: 'Secteur A',
                    trees: 110,
                    yield: 0,
                    notes: 'Taille et entretien en cours. Pas de récolte cette année.'
                },
                {
                    id: 'P005',
                    name: 'Verger Central',
                    variety: 'Noix de Grenoble',
                    size: 4.0,
                    year: 2010,
                    status: 'En production',
                    location: 'Secteur D',
                    trees: 200,
                    yield: 1200,
                    notes: 'Parcelle phare de la ferme. Rendement exceptionnel cette année.'
                },
                {
                    id: 'P006',
                    name: 'Petit Verger',
                    variety: 'Noix de Périgord',
                    size: 1.2,
                    year: 2019,
                    status: 'En production',
                    location: 'Secteur B',
                    trees: 60,
                    yield: 400,
                    notes: 'Petite parcelle mais bonne qualité de noix.'
                }
            ];

            // Éléments du DOM
            const parcelsContainer = document.getElementById('parcelsContainer');
            const parcelModal = document.getElementById('parcelModal');
            const modalTitle = document.getElementById('modalTitle');
            const parcelForm = document.getElementById('parcelForm');
            const addParcelBtn = document.getElementById('addParcelBtn');
            const closeModalBtn = document.getElementById('closeModal');
            const cancelBtn = document.getElementById('cancelBtn');

            // Afficher les parcelles
            function renderParcels(parcelsToRender = parcels) {
                parcelsContainer.innerHTML = '';
                
                parcelsToRender.forEach(parcel => {
                    const statusClass = getStatusClass(parcel.status);
                    
                    const parcelCard = document.createElement('div');
                    parcelCard.className = 'parcel-card';
                    parcelCard.innerHTML = `
                        <div class="parcel-header">
                            <div class="parcel-id">${parcel.id}</div>
                            <div class="parcel-name">${parcel.name}</div>
                            <div class="parcel-status ${statusClass}">${parcel.status}</div>
                        </div>
                        <div class="parcel-body">
                            <div class="parcel-info">
                                <div>
                                    <div class="parcel-label">Variété</div>
                                    <div class="parcel-value">${parcel.variety}</div>
                                </div>
                                <div>
                                    <div class="parcel-label">Superficie</div>
                                    <div class="parcel-value">${parcel.size} ha</div>
                                </div>
                            </div>
                            <div class="parcel-info">
                                <div>
                                    <div class="parcel-label">Plantation</div>
                                    <div class="parcel-value">${parcel.year}</div>
                                </div>
                                <div>
                                    <div class="parcel-label">Arbres</div>
                                    <div class="parcel-value">${parcel.trees}</div>
                                </div>
                            </div>
                            <div class="parcel-info">
                                <div>
                                    <div class="parcel-label">Localisation</div>
                                    <div class="parcel-value">${parcel.location}</div>
                                </div>
                                <div>
                                    <div class="parcel-label">Production</div>
                                    <div class="parcel-value">${parcel.yield || '-'} kg</div>
                                </div>
                            </div>
                            <div class="parcel-actions">
                                <button class="btn btn-primary edit-btn" data-id="${parcel.id}">
                                    <i class="fas fa-edit"></i> Modifier
                                </button>
                                <button class="btn btn-success details-btn" data-id="${parcel.id}">
                                    <i class="fas fa-info-circle"></i> Détails
                                </button>
                            </div>
                        </div>
                    `;
                    
                    parcelsContainer.appendChild(parcelCard);
                });

                // Ajouter les événements aux boutons
                document.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const parcelId = this.getAttribute('data-id');
                        editParcel(parcelId);
                    });
                });

                document.querySelectorAll('.details-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const parcelId = this.getAttribute('data-id');
                        viewParcelDetails(parcelId);
                    });
                });
            }

            // Obtenir la classe CSS pour le statut
            function getStatusClass(status) {
                switch(status) {
                    case 'En production': return 'status-production';
                    case 'En conversion': return 'status-conversion';
                    case 'Nouvelle plantation': return 'status-new';
                    case 'En entretien': return 'status-maintenance';
                    case 'Inactive': return 'status-inactive';
                    default: return '';
                }
            }

            // Ouvrir le modal pour ajouter une parcelle
            addParcelBtn.addEventListener('click', function() {
                modalTitle.textContent = 'Ajouter une nouvelle parcelle';
                parcelForm.reset();
                document.getElementById('parcelId').value = '';
                parcelModal.style.display = 'flex';
            });

            // Fermer le modal
            closeModalBtn.addEventListener('click', closeModal);
            cancelBtn.addEventListener('click', closeModal);

            function closeModal() {
                parcelModal.style.display = 'none';
            }

            // Éditer une parcelle
            function editParcel(parcelId) {
                const parcel = parcels.find(p => p.id === parcelId);
                if (!parcel) return;

                modalTitle.textContent = `Modifier la parcelle ${parcel.name}`;
                document.getElementById('parcelId').value = parcel.id;
                document.getElementById('parcelName').value = parcel.name;
                document.getElementById('parcelVariety').value = parcel.variety;
                document.getElementById('parcelSize').value = parcel.size;
                document.getElementById('parcelYear').value = parcel.year;
                document.getElementById('parcelStatus').value = parcel.status;
                document.getElementById('parcelLocation').value = parcel.location;
                document.getElementById('parcelNotes').value = parcel.notes || '';
                
                parcelModal.style.display = 'flex';
            }

            // Voir les détails d'une parcelle
            function viewParcelDetails(parcelId) {
                const parcel = parcels.find(p => p.id === parcelId);
                if (!parcel) return;

                alert(`Détails de la parcelle ${parcel.name}:\n\n` +
                      `Variété: ${parcel.variety}\n` +
                      `Superficie: ${parcel.size} ha\n` +
                      `Année de plantation: ${parcel.year}\n` +
                      `Statut: ${parcel.status}\n` +
                      `Localisation: ${parcel.location}\n` +
                      `Nombre d'arbres: ${parcel.trees}\n` +
                      `Production: ${parcel.yield || 'N/A'} kg\n\n` +
                      `Notes: ${parcel.notes || 'Aucune note'}`);
            }

            // Gérer la soumission du formulaire
            parcelForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const parcelId = document.getElementById('parcelId').value;
                const isNew = parcelId === '';
                
                const parcelData = {
                    id: isNew ? 'P' + (100 + parcels.length + 1).toString().substring(1) : parcelId,
                    name: document.getElementById('parcelName').value,
                    variety: document.getElementById('parcelVariety').value,
                    size: parseFloat(document.getElementById('parcelSize').value),
                    year: parseInt(document.getElementById('parcelYear').value),
                    status: document.getElementById('parcelStatus').value,
                    location: document.getElementById('parcelLocation').value,
                    notes: document.getElementById('parcelNotes').value,
                    trees: Math.floor(parseFloat(document.getElementById('parcelSize').value)) * 50,
                    yield: document.getElementById('parcelStatus').value === 'En production' ? 
                          Math.floor(Math.random() * 500) + 300 : 0
                };
                
                if (isNew) {
                    parcels.push(parcelData);
                } else {
                    const index = parcels.findIndex(p => p.id === parcelId);
                    if (index !== -1) {
                        parcels[index] = parcelData;
                    }
                }
                
                renderParcels();
                closeModal();
                alert(`Parcelle ${isNew ? 'ajoutée' : 'modifiée'} avec succès!`);
            });

            // Filtrer les parcelles
            document.getElementById('filterVariety').addEventListener('change', filterParcels);
            document.getElementById('filterStatus').addEventListener('change', filterParcels);
            document.getElementById('filterYear').addEventListener('change', filterParcels);

            function filterParcels() {
                const varietyFilter = document.getElementById('filterVariety').value;
                const statusFilter = document.getElementById('filterStatus').value;
                const yearFilter = document.getElementById('filterYear').value;
                
                const filtered = parcels.filter(parcel => {
                    return (varietyFilter === 'Toutes' || parcel.variety === varietyFilter) &&
                           (statusFilter === 'Tous' || parcel.status === statusFilter) &&
                           (yearFilter === 'Toutes années' || parcel.year.toString() === yearFilter);
                });
                
                renderParcels(filtered);
            }

            // Recherche de parcelles
            document.querySelector('.search-bar input').addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                
                if (searchTerm === '') {
                    renderParcels();
                    return;
                }
                
                const filtered = parcels.filter(parcel => {
                    return parcel.name.toLowerCase().includes(searchTerm) ||
                           parcel.id.toLowerCase().includes(searchTerm) ||
                           parcel.variety.toLowerCase().includes(searchTerm) ||
                           parcel.location.toLowerCase().includes(searchTerm);
                });
                
                renderParcels(filtered);
            });

            // Initialiser l'application
            renderParcels();
        });