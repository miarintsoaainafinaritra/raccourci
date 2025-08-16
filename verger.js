const OrchardManager = (function() {
    let orchardsData = [];
    let deletedOrchards = [];
    let currentPage = 1;
    const rowsPerPage = 10;
    
    const elements = {
        menuToggle: null,
        sidebar: null,
        searchInput: null,
        statusFilter: null,
        varietyFilter: null,
        resetFiltersBtn: null,
        exportBtn: null,
        addOrchardBtn: null,
        orchardTableBody: null,
        pagination: null,
        orchardModal: null,
        closeOrchardModal: null,
        cancelOrchardBtn: null,
        orchardForm: null,
        orchardDetailModal: null,
        closeDetailModal: null,
        closeDetailBtn: null,
        trashBtn: null,
        trashModal: null,
        closeTrashModal: null,
        closeTrashBtn: null,
        emptyTrashBtn: null,
        trashContent: null,
        trashCount: null
    };
    
    function initializeData() {
        orchardsData = [
            {
                id: 1,
                name: "Verger des Coteaux",
                location: "Parcelle A12",
                surface: 5.2,
                variety: "franquette",
                trees: 156,
                plantationDate: "2015-03-15",
                status: "active",
                notes: "Verger en pleine production. Rendement stable."
            },
            {
                id: 2,
                name: "Verger du Plateau",
                location: "Parcelle B07",
                surface: 7.8,
                variety: "mayette",
                trees: 234,
                plantationDate: "2018-10-22",
                status: "active",
                notes: "Excellente production cette année."
            },
            {
                id: 3,
                name: "Verger des Sources",
                location: "Parcelle C03",
                surface: 3.5,
                variety: "parisienne",
                trees: 105,
                plantationDate: "2020-04-05",
                status: "conversion",
                notes: "En conversion bio. Premier contrôle prévu en juin."
            },
            {
                id: 4,
                name: "Verger Nouveau",
                location: "Parcelle D15",
                surface: 2.0,
                variety: "ferragnes",
                trees: 60,
                plantationDate: "2022-11-12",
                status: "young",
                notes: "Jeune plantation. Première récolte prévue dans 2 ans."
            },
            {
                id: 5,
                name: "Ancien Verger Est",
                location: "Parcelle E09",
                surface: 4.3,
                variety: "franquette",
                trees: 129,
                plantationDate: "2010-06-18",
                status: "inactive",
                notes: "Verger inactif en attente de renouvellement."
            }
        ];
        
        renderTable();
        setupPagination();
        updateTrashButton();
    }
    
    function renderTable(filteredData = orchardsData) {
        elements.orchardTableBody.innerHTML = '';
        
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        if (paginatedData.length === 0) {
            elements.orchardTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-results">Aucun verger trouvé</td>
                </tr>
            `;
            return;
        }
        
        paginatedData.forEach(orchard => {
            const row = document.createElement('tr');
            
            const formattedDate = new Date(orchard.plantationDate).toLocaleDateString('fr-FR');
            const varietyNames = {
                franquette: "Franquette",
                mayette: "Mayette",
                parisienne: "Parisienne",
                ferragnes: "Ferragnès"
            };
            
            let statusBadge = '';
            if (orchard.status === 'active') {
                statusBadge = `<span class="status-badge status-active"><i class="fas fa-check-circle"></i> En production</span>`;
            } else if (orchard.status === 'young') {
                statusBadge = `<span class="status-badge status-young"><i class="fas fa-seedling"></i> Jeune plantation</span>`;
            } else if (orchard.status === 'conversion') {
                statusBadge = `<span class="status-badge status-conversion"><i class="fas fa-clock"></i> En conversion bio</span>`;
            } else {
                statusBadge = `<span class="status-badge status-inactive"><i class="fas fa-times-circle"></i> Inactif</span>`;
            }
            
            row.innerHTML = `
                <td>${orchard.name}</td>
                <td>${orchard.location}</td>
                <td>${orchard.surface}</td>
                <td>${varietyNames[orchard.variety] || orchard.variety}</td>
                <td>${orchard.trees}</td>
                <td>${formattedDate}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="action-btn info-btn" data-id="${orchard.id}" data-action="view" title="Voir détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-id="${orchard.id}" data-action="edit" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${orchard.id}" data-action="delete" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            elements.orchardTableBody.appendChild(row);
        });
    }
    
    function filterOrchards() {
        const searchTerm = elements.searchInput.value.toLowerCase();
        const statusValue = elements.statusFilter.value;
        const varietyValue = elements.varietyFilter.value;
        
        const filteredData = orchardsData.filter(orchard => {
            const matchesSearch = 
                orchard.name.toLowerCase().includes(searchTerm) ||
                orchard.location.toLowerCase().includes(searchTerm) ||
                orchard.variety.toLowerCase().includes(searchTerm);
            
            const matchesStatus = statusValue ? orchard.status === statusValue : true;
            const matchesVariety = varietyValue ? orchard.variety === varietyValue : true;
            
            return matchesSearch && matchesStatus && matchesVariety;
        });
        
        currentPage = 1;
        renderTable(filteredData);
        setupPagination(filteredData);
    }
    
    function setupPagination(data = orchardsData) {
        elements.pagination.innerHTML = '';
        const pageCount = Math.ceil(data.length / rowsPerPage);
        
        if (pageCount <= 1) return;
        
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&laquo;';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable(data);
                setupPagination(data);
            }
        });
        elements.pagination.appendChild(prevButton);
        
        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = currentPage === i ? 'active' : '';
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderTable(data);
                setupPagination(data);
            });
            elements.pagination.appendChild(pageButton);
        }
        
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '&raquo;';
        nextButton.disabled = currentPage === pageCount;
        nextButton.addEventListener('click', () => {
            if (currentPage < pageCount) {
                currentPage++;
                renderTable(data);
                setupPagination(data);
            }
        });
        elements.pagination.appendChild(nextButton);
    }
    
    function exportData() {
        const searchTerm = elements.searchInput.value.toLowerCase();
        const statusValue = elements.statusFilter.value;
        const varietyValue = elements.varietyFilter.value;
        
        const dataToExport = orchardsData.filter(orchard => {
            const matchesSearch = 
                orchard.name.toLowerCase().includes(searchTerm) ||
                orchard.location.toLowerCase().includes(searchTerm) ||
                orchard.variety.toLowerCase().includes(searchTerm);
            
            const matchesStatus = statusValue ? orchard.status === statusValue : true;
            const matchesVariety = varietyValue ? orchard.variety === varietyValue : true;
            
            return matchesSearch && matchesStatus && matchesVariety;
        });
        
        const headers = ['Nom', 'Localisation', 'Surface (ha)', 'Variété', 'Arbres', 'Plantation', 'Statut'];
        const csvRows = [];
        csvRows.push(headers.join(';'));
        
        dataToExport.forEach(orchard => {
            const formattedDate = new Date(orchard.plantationDate).toLocaleDateString('fr-FR');
            const varietyNames = {
                franquette: "Franquette",
                mayette: "Mayette",
                parisienne: "Parisienne",
                ferragnes: "Ferragnès"
            };
            
            let statusText = '';
            if (orchard.status === 'active') {
                statusText = 'En production';
            } else if (orchard.status === 'young') {
                statusText = 'Jeune plantation';
            } else if (orchard.status === 'conversion') {
                statusText = 'En conversion bio';
            } else {
                statusText = 'Inactif';
            }
            
            const row = [
                orchard.name,
                orchard.location,
                orchard.surface,
                varietyNames[orchard.variety] || orchard.variety,
                orchard.trees,
                formattedDate,
                statusText
            ];
            
            csvRows.push(row.join(';'));
        });
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `vergers_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    function openModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function viewOrchard(id) {
        const orchard = orchardsData.find(o => o.id == id) || deletedOrchards.find(o => o.id == id);
        if (!orchard) return;
        
        const modalContent = document.getElementById('orchardDetailContent');
        const formattedDate = new Date(orchard.plantationDate).toLocaleDateString('fr-FR');
        const varietyNames = {
            franquette: "Franquette",
            mayette: "Mayette",
            parisienne: "Parisienne",
            ferragnes: "Ferragnès"
        };
        
        let statusText = '';
        if (orchard.status === 'active') {
            statusText = 'En production';
        } else if (orchard.status === 'young') {
            statusText = 'Jeune plantation';
        } else if (orchard.status === 'conversion') {
            statusText = 'En conversion bio';
        } else {
            statusText = 'Inactif';
        }
        
        modalContent.innerHTML = `
            <div class="detail-row">
                <div class="detail-label"><i class="fas fa-signature"></i> Nom</div>
                <div class="detail-value">${orchard.name}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label"><i class="fas fa-map-marked-alt"></i> Localisation</div>
                <div class="detail-value">${orchard.location}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label"><i class="fas fa-ruler-combined"></i> Surface</div>
                <div class="detail-value">${orchard.surface} hectares</div>
            </div>
            <div class="detail-row">
                <div class="detail-label"><i class="fas fa-seedling"></i> Variété</div>
                <div class="detail-value">${varietyNames[orchard.variety] || orchard.variety}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label"><i class="fas fa-tree"></i> Nombre d'arbres</div>
                <div class="detail-value">${orchard.trees}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label"><i class="fas fa-calendar-alt"></i> Date de plantation</div>
                <div class="detail-value">${formattedDate}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label"><i class="fas fa-info-circle"></i> Statut</div>
                <div class="detail-value">${statusText}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label"><i class="fas fa-sticky-note"></i> Notes</div>
                <div class="detail-value">${orchard.notes || 'Aucune note'}</div>
            </div>
        `;
        
        document.getElementById('detailOrchardTitle').textContent = `Détails du Verger: ${orchard.name}`;
        openModal(elements.orchardDetailModal);
    }
    
    function editOrchard(id) {
        const orchard = orchardsData.find(o => o.id == id);
        if (!orchard) return;
        
        document.getElementById('modalOrchardTitle').innerHTML = '<i class="fas fa-edit"></i> Modifier le Verger';
        elements.orchardForm.dataset.id = id;
        
        document.getElementById('orchardName').value = orchard.name;
        document.getElementById('orchardLocation').value = orchard.location;
        document.getElementById('orchardSurface').value = orchard.surface;
        document.getElementById('orchardVariety').value = orchard.variety;
        document.getElementById('orchardTrees').value = orchard.trees;
        document.getElementById('orchardPlantationDate').value = orchard.plantationDate;
        document.getElementById('orchardStatus').value = orchard.status;
        document.getElementById('orchardNotes').value = orchard.notes || '';
        
        openModal(elements.orchardModal);
    }
    
    function deleteOrchard(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce verger ? Il sera déplacé dans la corbeille.')) {
            const orchardIndex = orchardsData.findIndex(o => o.id == id);
            if (orchardIndex !== -1) {
                // Ajoute à la corbeille avec la date de suppression
                const deletedOrchard = {
                    ...orchardsData[orchardIndex],
                    deletedDate: new Date().toISOString()
                };
                deletedOrchards.push(deletedOrchard);
                
                // Supprime du tableau principal
                orchardsData.splice(orchardIndex, 1);
                
                currentPage = 1;
                renderTable();
                setupPagination();
                updateTrashButton();
                
                showNotification('Verger déplacé dans la corbeille', 'success');
            }
        }
    }
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
    
    function showTrash() {
        elements.trashContent.innerHTML = '';
        
        if (deletedOrchards.length === 0) {
            elements.trashContent.innerHTML = '<p>La corbeille est vide.</p>';
        } else {
            const table = document.createElement('table');
            table.className = 'trash-table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Localisation</th>
                        <th>Variété</th>
                        <th>Date de suppression</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="trashTableBody"></tbody>
            `;
            
            elements.trashContent.appendChild(table);
            
            const tbody = document.getElementById('trashTableBody');
            deletedOrchards.forEach(orchard => {
                const row = document.createElement('tr');
                const formattedDate = new Date(orchard.deletedDate).toLocaleDateString('fr-FR');
                
                row.innerHTML = `
                    <td>${orchard.name}</td>
                    <td>${orchard.location}</td>
                    <td>${orchard.variety}</td>
                    <td>${formattedDate}</td>
                    <td>
                        <button class="action-btn restore-btn" data-id="${orchard.id}" title="Restaurer">
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="action-btn delete-permanently-btn" data-id="${orchard.id}" title="Supprimer définitivement">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
        }
        
        openModal(elements.trashModal);
    }
    
    function restoreOrchard(id) {
        const orchardIndex = deletedOrchards.findIndex(o => o.id == id);
        if (orchardIndex !== -1) {
            // Retire la date de suppression avant de restaurer
            const { deletedDate, ...orchard } = deletedOrchards[orchardIndex];
            orchardsData.push(orchard);
            deletedOrchards.splice(orchardIndex, 1);
            
            showTrash();
            filterOrchards();
            updateTrashButton();
            showNotification('Verger restauré avec succès', 'success');
        }
    }
    
    function deletePermanently(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce verger ? Cette action est irréversible.')) {
            deletedOrchards = deletedOrchards.filter(o => o.id != id);
            showTrash();
            updateTrashButton();
            showNotification('Verger supprimé définitivement', 'info');
        }
    }
    
    function emptyTrash() {
        if (confirm('Êtes-vous sûr de vouloir vider complètement la corbeille ? Tous les vergers seront supprimés définitivement.')) {
            deletedOrchards = [];
            showTrash();
            updateTrashButton();
            showNotification('Corbeille vidée avec succès', 'info');
        }
    }
    
    function updateTrashButton() {
        if (elements.trashBtn && elements.trashCount) {
            elements.trashBtn.innerHTML = `<i class="fas fa-trash"></i> Corbeille (${deletedOrchards.length})`;
            elements.trashCount.textContent = deletedOrchards.length;
        }
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            id: elements.orchardForm.dataset.id || Math.max(...orchardsData.map(o => o.id), 0) + 1,
            name: document.getElementById('orchardName').value,
            location: document.getElementById('orchardLocation').value,
            surface: parseFloat(document.getElementById('orchardSurface').value),
            variety: document.getElementById('orchardVariety').value,
            trees: parseInt(document.getElementById('orchardTrees').value),
            plantationDate: document.getElementById('orchardPlantationDate').value,
            status: document.getElementById('orchardStatus').value,
            notes: document.getElementById('orchardNotes').value
        };
        
        const isEdit = elements.orchardForm.dataset.id;
        
        if (isEdit) {
            const index = orchardsData.findIndex(o => o.id == isEdit);
            if (index !== -1) {
                orchardsData[index] = formData;
            }
        } else {
            orchardsData.push(formData);
        }
        
        closeModal(elements.orchardModal);
        filterOrchards();
    }
    
    function handleTableClick(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        
        if (action === 'view') {
            viewOrchard(id);
        } else if (action === 'edit') {
            editOrchard(id);
        } else if (action === 'delete') {
            deleteOrchard(id);
        }
    }
    
    function handleTrashClick(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const id = btn.dataset.id;
        
        if (btn.classList.contains('restore-btn')) {
            restoreOrchard(id);
        } else if (btn.classList.contains('delete-permanently-btn')) {
            deletePermanently(id);
        }
    }
    
    return {
        init: function() {
            // Initialisation des éléments
            elements.menuToggle = document.getElementById('menuToggle');
            elements.sidebar = document.getElementById('sidebar');
            elements.searchInput = document.getElementById('searchOrchardInput');
            elements.statusFilter = document.getElementById('statusOrchardFilter');
            elements.varietyFilter = document.getElementById('varietyFilter');
            elements.resetFiltersBtn = document.getElementById('resetFiltersBtn');
            elements.exportBtn = document.getElementById('exportOrchardBtn');
            elements.addOrchardBtn = document.getElementById('addOrchardBtn');
            elements.orchardTableBody = document.getElementById('orchardTableBody');
            elements.pagination = document.getElementById('pagination');
            elements.orchardModal = document.getElementById('orchardModal');
            elements.closeOrchardModal = document.getElementById('closeOrchardModal');
            elements.cancelOrchardBtn = document.getElementById('cancelOrchardBtn');
            elements.orchardForm = document.getElementById('orchardForm');
            elements.orchardDetailModal = document.getElementById('orchardDetailModal');
            elements.closeDetailModal = document.getElementById('closeDetailModal');
            elements.closeDetailBtn = document.getElementById('closeDetailBtn');
            elements.trashBtn = document.getElementById('trashBtn');
            elements.trashModal = document.getElementById('trashModal');
            elements.closeTrashModal = document.getElementById('closeTrashModal');
            elements.closeTrashBtn = document.getElementById('closeTrashBtn');
            elements.emptyTrashBtn = document.getElementById('emptyTrashBtn');
            elements.trashContent = document.getElementById('trashContent');
            elements.trashCount = document.getElementById('trashCount');
            
            // Événements
            elements.menuToggle.addEventListener('click', () => {
                elements.sidebar.classList.toggle('active');
            });
            
            elements.searchInput.addEventListener('input', filterOrchards);
            elements.statusFilter.addEventListener('change', filterOrchards);
            elements.varietyFilter.addEventListener('change', filterOrchards);
            
            elements.resetFiltersBtn.addEventListener('click', () => {
                elements.searchInput.value = '';
                elements.statusFilter.value = '';
                elements.varietyFilter.value = '';
                filterOrchards();
            });
            
            elements.exportBtn.addEventListener('click', exportData);
            
            elements.addOrchardBtn.addEventListener('click', () => {
                document.getElementById('modalOrchardTitle').innerHTML = '<i class="fas fa-tree"></i> Ajouter un Verger';
                elements.orchardForm.reset();
                delete elements.orchardForm.dataset.id;
                openModal(elements.orchardModal);
            });
            
            elements.closeOrchardModal.addEventListener('click', () => closeModal(elements.orchardModal));
            elements.cancelOrchardBtn.addEventListener('click', () => closeModal(elements.orchardModal));
            elements.closeDetailModal.addEventListener('click', () => closeModal(elements.orchardDetailModal));
            elements.closeDetailBtn.addEventListener('click', () => closeModal(elements.orchardDetailModal));
            elements.closeTrashModal.addEventListener('click', () => closeModal(elements.trashModal));
            elements.closeTrashBtn.addEventListener('click', () => closeModal(elements.trashModal));
            
            elements.orchardForm.addEventListener('submit', handleFormSubmit);
            elements.orchardTableBody.addEventListener('click', handleTableClick);
            elements.trashBtn.addEventListener('click', showTrash);
            elements.emptyTrashBtn.addEventListener('click', emptyTrash);
            elements.trashContent.addEventListener('click', handleTrashClick);
            
            initializeData();
        }
    };
})();

document.addEventListener('DOMContentLoaded', function() {
    OrchardManager.init();
});