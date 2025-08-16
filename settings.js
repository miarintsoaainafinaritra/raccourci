   document.addEventListener('DOMContentLoaded', function() {
            // Elements DOM
            const saveBtn = document.getElementById('save-btn');
            const resetBtn = document.getElementById('reset-btn');
            const notification = document.getElementById('notification');
            const notificationMessage = document.getElementById('notification-message');
            const savedContainer = document.getElementById('saved-settings-container');
            const trashContainer = document.getElementById('trash-container');
            
            // Données
            let currentEditId = null;
            let settingsData = [];
            let trashData = [];

            // Initialisation
            initHarvestMonth();
            loadData();

            // Fonctions d'initialisation
            function initHarvestMonth() {
                const now = new Date();
                document.getElementById('harvest-month').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            }

            function loadData() {
                settingsData = JSON.parse(localStorage.getItem('nutSettings')) || [];
                trashData = JSON.parse(localStorage.getItem('nutTrash')) || [];
                
                // Assurer que tous les éléments ont un ID
                settingsData = settingsData.map(item => item.id ? item : {...item, id: generateId()});
                trashData = trashData.map(item => item.id ? item : {...item, id: generateId()});
                
                renderAll();
            }

            // Fonctions de rendu
            function renderAll() {
                renderSavedSettings();
                renderTrash();
                attachAllEvents();
            }

            function renderSavedSettings() {
                if (settingsData.length === 0) {
                    savedContainer.innerHTML = `
                        <div class="empty-list">
                            <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                            <p>Aucune configuration enregistrée</p>
                        </div>
                    `;
                    return;
                }

                savedContainer.innerHTML = settingsData.map((setting, index) => `
                    <div class="saved-entry" data-id="${setting.id}">
                        <h3><i class="fas fa-seedling"></i> Configuration #${index + 1}</h3>
                        <p><strong>Variété:</strong> <span class="variety-display">${getVarietyName(setting.variety)}</span></p>
                        <p><strong>Densité:</strong> <span class="density-display">${setting.density}</span> arbres/ha</p>
                        <p><strong>Culture:</strong> <span class="culture-display">${setting.cultureMode === 'bio' ? 'Bio' : 'Raisonnée'}</span></p>
                        <p><strong>Récolte:</strong> <span class="harvest-display">${getHarvestMethodName(setting.harvestMethod)}</span></p>
                        <p><strong>Date:</strong> <span class="date-display">${new Date(setting.timestamp).toLocaleString()}</span></p>
                        
                        <div class="entry-actions">
                            <button class="btn btn-secondary btn-edit">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn btn-danger btn-delete">
                                <i class="fas fa-trash-alt"></i> Supprimer
                            </button>
                        </div>
                        
                        <div class="edit-form">
                            <h3><i class="fas fa-edit"></i> Modifier la configuration</h3>
                            <div class="form-group">
                                <label>Variété:</label>
                                <select class="edit-variety">
                                    <option value="grenoble" ${setting.variety === 'grenoble' ? 'selected' : ''}>Noix de Grenoble</option>
                                    <option value="perigord" ${setting.variety === 'perigord' ? 'selected' : ''}>Noix du Périgord</option>
                                    <option value="cerneaux" ${setting.variety === 'cerneaux' ? 'selected' : ''}>Cerneaux</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Densité:</label>
                                <input type="number" class="edit-density" value="${setting.density}" min="50" max="200">
                            </div>
                            <div class="form-group">
                                <label>Culture:</label>
                                <select class="edit-culture">
                                    <option value="bio" ${setting.cultureMode === 'bio' ? 'selected' : ''}>Bio</option>
                                    <option value="raisonnee" ${setting.cultureMode === 'raisonnee' ? 'selected' : ''}>Raisonnée</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Récolte:</label>
                                <select class="edit-harvest">
                                    <option value="manual" ${setting.harvestMethod === 'manual' ? 'selected' : ''}>Manuelle</option>
                                    <option value="mechanical" ${setting.harvestMethod === 'mechanical' ? 'selected' : ''}>Mécanique</option>
                                    <option value="mixed" ${setting.harvestMethod === 'mixed' ? 'selected' : ''}>Mixte</option>
                                </select>
                            </div>
                            <div class="form-actions">
                                <button class="btn btn-primary btn-save-edit">
                                    <i class="fas fa-check"></i> Enregistrer
                                </button>
                                <button class="btn btn-secondary btn-cancel-edit">
                                    <i class="fas fa-times"></i> Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            function renderTrash() {
                if (trashData.length === 0) {
                    trashContainer.innerHTML = `
                        <div class="empty-list">
                            <i class="fas fa-trash-alt" style="font-size: 24px;"></i>
                            <p>Corbeille vide</p>
                        </div>
                    `;
                    return;
                }

                trashContainer.innerHTML = trashData.map((item, index) => `
                    <div class="trash-entry" data-id="${item.id}">
                        <div>
                            <strong>Configuration #${index + 1}</strong> - 
                            ${getVarietyName(item.variety)} (${new Date(item.timestamp).toLocaleDateString()})
                        </div>
                        <div class="trash-actions">
                            <button class="btn btn-secondary restore-btn">
                                <i class="fas fa-undo"></i> Restaurer
                            </button>
                            <button class="btn btn-danger delete-permanently-btn">
                                <i class="fas fa-times"></i> Supprimer
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            // Attachement des événements
            function attachAllEvents() {
                // Événements de modification
                document.querySelectorAll('.btn-edit').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const entry = this.closest('.saved-entry');
                        entry.classList.add('editing');
                        entry.querySelector('.edit-form').style.display = 'block';
                        entry.querySelector('.entry-actions').style.display = 'none';
                    });
                });

                // Événements d'annulation
                document.querySelectorAll('.btn-cancel-edit').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const entry = this.closest('.saved-entry');
                        entry.classList.remove('editing');
                        entry.querySelector('.edit-form').style.display = 'none';
                        entry.querySelector('.entry-actions').style.display = 'flex';
                    });
                });

                // Événements de sauvegarde
                document.querySelectorAll('.btn-save-edit').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const entry = this.closest('.saved-entry');
                        const id = entry.dataset.id;
                        
                        const updatedSetting = {
                            id: id,
                            variety: entry.querySelector('.edit-variety').value,
                            density: entry.querySelector('.edit-density').value,
                            cultureMode: entry.querySelector('.edit-culture').value,
                            harvestMethod: entry.querySelector('.edit-harvest').value,
                            timestamp: new Date().toISOString()
                        };

                        // Mettre à jour dans le tableau
                        const index = settingsData.findIndex(item => item.id === id);
                        if (index !== -1) {
                            settingsData[index] = updatedSetting;
                            saveData();
                            showNotification("Configuration mise à jour avec succès");
                        }

                        // Mettre à jour l'affichage
                        entry.querySelector('.variety-display').textContent = getVarietyName(updatedSetting.variety);
                        entry.querySelector('.density-display').textContent = updatedSetting.density;
                        entry.querySelector('.culture-display').textContent = updatedSetting.cultureMode === 'bio' ? 'Bio' : 'Raisonnée';
                        entry.querySelector('.harvest-display').textContent = getHarvestMethodName(updatedSetting.harvestMethod);
                        entry.querySelector('.date-display').textContent = new Date(updatedSetting.timestamp).toLocaleString();
                        
                        // Quitter le mode édition
                        entry.classList.remove('editing');
                        entry.querySelector('.edit-form').style.display = 'none';
                        entry.querySelector('.entry-actions').style.display = 'flex';
                    });
                });

                // Événements de suppression
                document.querySelectorAll('.btn-delete').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.closest('.saved-entry').dataset.id;
                        moveToTrash(id);
                    });
                });

                // Événements de restauration
                document.querySelectorAll('.restore-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.closest('.trash-entry').dataset.id;
                        restoreFromTrash(id);
                    });
                });

                // Événements de suppression permanente
                document.querySelectorAll('.delete-permanently-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.closest('.trash-entry').dataset.id;
                        deletePermanently(id);
                    });
                });
            }

            // Fonctions utilitaires
            function getVarietyName(value) {
                const varieties = {
                    'grenoble': 'Noix de Grenoble',
                    'perigord': 'Noix du Périgord',
                    'cerneaux': 'Cerneaux'
                };
                return varieties[value] || value;
            }

            function getHarvestMethodName(value) {
                const methods = {
                    'manual': 'Manuelle',
                    'mechanical': 'Mécanique',
                    'mixed': 'Mixte'
                };
                return methods[value] || value;
            }

            function generateId() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            }

            function showNotification(message, isError = false) {
                notification.style.backgroundColor = isError ? 'var(--danger)' : 'var(--primary)';
                notificationMessage.textContent = message;
                notification.style.display = 'flex';
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 3000);
            }

            // Fonctions de gestion des données
            function moveToTrash(id) {
                if (!confirm("Voulez-vous vraiment déplacer cette configuration vers la corbeille ?")) return;

                const index = settingsData.findIndex(item => item.id === id);
                if (index === -1) return;

                const [deletedItem] = settingsData.splice(index, 1);
                deletedItem.deletedAt = new Date().toISOString();
                trashData.unshift(deletedItem);

                saveData();
                showNotification("Configuration déplacée vers la corbeille");
            }

            function restoreFromTrash(id) {
                const index = trashData.findIndex(item => item.id === id);
                if (index === -1) return;

                const [restoredItem] = trashData.splice(index, 1);
                delete restoredItem.deletedAt;
                settingsData.unshift(restoredItem);

                saveData();
                showNotification("Configuration restaurée depuis la corbeille");
            }

            function deletePermanently(id) {
                if (!confirm("Voulez-vous vraiment supprimer définitivement cette configuration ?")) return;

                const index = trashData.findIndex(item => item.id === id);
                if (index !== -1) {
                    trashData.splice(index, 1);
                    saveData();
                    showNotification("Configuration supprimée définitivement");
                }
            }

            function saveData() {
                localStorage.setItem('nutSettings', JSON.stringify(settingsData));
                localStorage.setItem('nutTrash', JSON.stringify(trashData));
                renderAll();
            }

            // Gestion du formulaire principal
            saveBtn.addEventListener('click', function() {
                const newSetting = {
                    id: generateId(),
                    variety: document.getElementById('main-variety').value,
                    density: document.getElementById('plant-density').value,
                    cultureMode: document.querySelector('input[name="culture-mode"]:checked').value,
                    harvestMethod: document.getElementById('harvest-method').value,
                    harvestMonth: document.getElementById('harvest-month').value,
                    timestamp: new Date().toISOString()
                };

                settingsData.unshift(newSetting);
                showNotification("Nouvelle configuration enregistrée");
                saveData();
            });

            resetBtn.addEventListener('click', function() {
                if (confirm('Voulez-vous vraiment réinitialiser le formulaire ?')) {
                    document.getElementById('main-variety').value = 'grenoble';
                    document.getElementById('plant-density').value = '120';
                    document.getElementById('culture-bio').checked = true;
                    document.getElementById('harvest-method').value = 'manual';
                    document.getElementById('harvest-month').value = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
                }
            });
        });