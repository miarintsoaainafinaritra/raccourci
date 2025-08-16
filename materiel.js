        // Fonction pour ouvrir un onglet
        function openTab(tabName) {
            var i, tabcontent, tablinks;
            
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            
            document.getElementById(tabName).style.display = "block";
            event.currentTarget.className += " active";
        }

        // Fonctions pour les modals
        function openModal(modalId) {
            document.getElementById(modalId).style.display = "block";
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = "none";
        }

        // Fonction pour ajouter un nouvel équipement
        function saveEquipment(formId, tableId) {
            const form = document.getElementById(formId);
            const table = document.getElementById(tableId);
            
            const name = form.elements['name'].value;
            const type = form.elements['type'].value;
            const purchaseDate = form.elements['purchaseDate'].value;
            const condition = form.elements['condition'].value;
            const cost = form.elements['cost'].value;
            const notes = form.elements['notes'].value;
            
            const newRow = table.insertRow();
            
            newRow.innerHTML = `
                <td>${name}</td>
                <td>${type}</td>
                <td>${purchaseDate}</td>
                <td><span class="status-badge" style="background-color: ${getStatusColor(condition)};">${condition}</span></td>
                <td>${Number(cost).toLocaleString()}</td>
                <td>
                    <button class="btn btn-edit" onclick="openEditModal(this)"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-delete" onclick="moveToTrash(this)"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            closeModal('newEquipmentModal');
            form.reset();
        }

        // Fonction pour déplacer vers la corbeille
        function moveToTrash(button) {
            const row = button.parentNode.parentNode;
            const trashTable = document.getElementById('trashTableBody');
            
            // Clone la ligne et l'ajoute à la corbeille
            const clonedRow = row.cloneNode(true);
            
            // Modifie les boutons d'action pour permettre la restauration
            const actionsCell = clonedRow.cells[5];
            actionsCell.innerHTML = `
                <button class="btn btn-edit" onclick="restoreFromTrash(this)"><i class="fas fa-undo"></i></button>
                <button class="btn btn-delete" onclick="permanentlyDelete(this)"><i class="fas fa-trash-alt"></i></button>
            `;
            
            trashTable.appendChild(clonedRow);
            
            // Supprime la ligne originale
            row.parentNode.removeChild(row);
        }

        // Fonction pour restaurer depuis la corbeille
        function restoreFromTrash(button) {
            const row = button.parentNode.parentNode;
            const equipmentTable = document.getElementById('equipmentTableBody');
            
            // Clone la ligne et l'ajoute à la table principale
            const clonedRow = row.cloneNode(true);
            
            // Rétablit les boutons d'action d'origine
            const actionsCell = clonedRow.cells[5];
            actionsCell.innerHTML = `
                <button class="btn btn-edit" onclick="openEditModal(this)"><i class="fas fa-edit"></i></button>
                <button class="btn btn-delete" onclick="moveToTrash(this)"><i class="fas fa-trash"></i></button>
            `;
            
            equipmentTable.appendChild(clonedRow);
            
            // Supprime la ligne de la corbeille
            row.parentNode.removeChild(row);
        }

        // Fonction pour supprimer définitivement
        function permanentlyDelete(button) {
            const row = button.parentNode.parentNode;
            row.parentNode.removeChild(row);
        }

        // Fonction pour ouvrir le modal d'édition
        function openEditModal(button) {
            const row = button.parentNode.parentNode;
            const cells = row.cells;
            
            const form = document.getElementById('editEquipmentForm');
            form.elements['name'].value = cells[0].textContent;
            form.elements['type'].value = cells[1].textContent;
            form.elements['purchaseDate'].value = cells[2].textContent;
            form.elements['condition'].value = cells[3].textContent.trim();
            form.elements['cost'].value = cells[4].textContent.replace(/,/g, '');
            
            // Stocke l'index de la ligne pour la mise à jour
            form.elements['rowIndex'].value = row.rowIndex;
            
            openModal('editEquipmentModal');
        }

        // Fonction pour sauvegarder les modifications
        function saveEditedEquipment() {
            const form = document.getElementById('editEquipmentForm');
            const rowIndex = form.elements['rowIndex'].value;
            const table = document.getElementById('equipmentTableBody');
            const row = table.rows[rowIndex - 1];
            
            row.cells[0].textContent = form.elements['name'].value;
            row.cells[1].textContent = form.elements['type'].value;
            row.cells[2].textContent = form.elements['purchaseDate'].value;
            row.cells[3].innerHTML = `<span class="status-badge" style="background-color: ${getStatusColor(form.elements['condition'].value)};">${form.elements['condition'].value}</span>`;
            row.cells[4].textContent = Number(form.elements['cost'].value).toLocaleString();
            
            closeModal('editEquipmentModal');
        }

        // Fonction utilitaire pour obtenir la couleur du statut
        function getStatusColor(status) {
            switch(status) {
                case 'Neuf': return '#4CAF50';
                case 'Bon': return '#4CAF50';
                case 'Usagé': return '#FFC107';
                case 'À réparer': return '#F44336';
                default: return '#9E9E9E';
            }
        }

        // Fermer les modals en cliquant en dehors
        window.onclick = function(event) {
            const modals = document.getElementsByClassName('modal');
            for (let i = 0; i < modals.length; i++) {
                if (event.target == modals[i]) {
                    modals[i].style.display = "none";
                }
            }
        }
    