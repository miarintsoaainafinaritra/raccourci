  // Fonction pour ouvrir un onglet
        function openTab(tabName) {
            const tabcontents = document.getElementsByClassName("tabcontent");
            for (let i = 0; i < tabcontents.length; i++) {
                tabcontents[i].style.display = "none";
            }
            
            const tablinks = document.getElementsByClassName("tablinks");
            for (let i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            
            document.getElementById(tabName).style.display = "block";
            event.currentTarget.className += " active";
        }
        
        // Fonction pour ouvrir une modal
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
        }
        
        // Fonction pour fermer une modal
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }
        
        // Fonctions pour la gestion des employés
        function changeView(viewType) {
            const cardView = document.getElementById('cardView');
            const tableView = document.getElementById('tableView');
            const viewOptions = document.querySelectorAll('.view-option');
            
            if (viewType === 'card') {
                cardView.style.display = 'block';
                tableView.style.display = 'none';
                viewOptions[0].classList.add('active');
                viewOptions[1].classList.remove('active');
            } else {
                cardView.style.display = 'none';
                tableView.style.display = 'block';
                viewOptions[0].classList.remove('active');
                viewOptions[1].classList.add('active');
            }
        }
        
        function openEditEmployeeModal(button) {
            // Récupérer les données de l'employé à partir de la ligne ou de la carte
            const employeeCard = button.closest('.employee-card');
            const employeeRow = button.closest('tr');
            
            if (employeeCard) {
                // Remplir le formulaire avec les données de la carte
                const name = employeeCard.querySelector('.employee-name').textContent;
                const position = employeeCard.querySelector('.employee-position').textContent;
                const phone = employeeCard.querySelector('.employee-info-item:nth-child(1)').textContent.replace(' ', '').slice(2);
                const email = employeeCard.querySelector('.employee-info-item:nth-child(2)').textContent;
                const hireDate = employeeCard.querySelector('.employee-info-item:nth-child(3)').textContent.split(': ')[1];
                const status = employeeCard.querySelector('.status-badge').textContent;
                
                const [firstName, lastName] = name.split(' ');
                
                document.querySelector('#editEmployeeForm input[name="firstName"]').value = firstName;
                document.querySelector('#editEmployeeForm input[name="lastName"]').value = lastName;
                document.querySelector('#editEmployeeForm select[name="position"]').value = position;
                document.querySelector('#editEmployeeForm input[name="phone"]').value = phone;
                document.querySelector('#editEmployeeForm input[name="email"]').value = email.split(': ')[1].trim();
                document.querySelector('#editEmployeeForm input[name="hireDate"]').value = formatDateForInput(hireDate);
                document.querySelector('#editEmployeeForm select[name="status"]').value = status;
            } else if (employeeRow) {
                // Remplir le formulaire avec les données de la ligne du tableau
                const cells = employeeRow.querySelectorAll('td');
                
                const [firstName, lastName] = cells[0].textContent.split(' ');
                const position = cells[1].textContent;
                const phone = cells[2].textContent;
                const email = cells[3].textContent;
                const hireDate = cells[4].textContent;
                const status = cells[5].querySelector('.status-badge').textContent;
                
                document.querySelector('#editEmployeeForm input[name="firstName"]').value = firstName;
                document.querySelector('#editEmployeeForm input[name="lastName"]').value = lastName;
                document.querySelector('#editEmployeeForm select[name="position"]').value = position;
                document.querySelector('#editEmployeeForm input[name="phone"]').value = phone;
                document.querySelector('#editEmployeeForm input[name="email"]').value = email;
                document.querySelector('#editEmployeeForm input[name="hireDate"]').value = formatDateForInput(hireDate);
                document.querySelector('#editEmployeeForm select[name="status"]').value = status;
            }
            
            openModal('editEmployeeModal');
        }
        
        function formatDateForInput(dateString) {
            // Convertir une date au format DD/MM/YYYY en YYYY-MM-DD pour l'input date
            const parts = dateString.split('/');
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        
        function saveEmployee() {
            // Logique pour sauvegarder un nouvel employé
            const form = document.getElementById('newEmployeeForm');
            const firstName = form.querySelector('input[name="firstName"]').value;
            const lastName = form.querySelector('input[name="lastName"]').value;
            const position = form.querySelector('select[name="position"]').value;
            const email = form.querySelector('input[name="email"]').value;
            const phone = form.querySelector('input[name="phone"]').value;
            const hireDate = form.querySelector('input[name="hireDate"]').value;
            const status = form.querySelector('select[name="status"]').value;
            
            // Ici vous devriez ajouter la logique pour enregistrer dans votre base de données
            // Pour l'exemple, nous allons juste afficher une alerte
            alert(`Nouvel employé enregistré:\n${firstName} ${lastName}\n${position}\n${email}\n${phone}\nEmbauche: ${hireDate}\nStatut: ${status}`);
            
            closeModal('newEmployeeModal');
            form.reset();
        }
        
        function updateEmployee() {
            // Logique pour mettre à jour un employé
            alert('Employé mis à jour avec succès!');
            closeModal('editEmployeeModal');
        }
        
        function deactivateEmployee(button) {
            if (confirm('Voulez-vous vraiment désactiver cet employé?')) {
                // Logique pour désactiver l'employé
                alert('Employé désactivé avec succès!');
            }
        }
        
        function reactivateEmployee(button) {
            if (confirm('Voulez-vous réactiver cet employé?')) {
                // Logique pour réactiver l'employé
                alert('Employé réactivé avec succès!');
            }
        }
        
        function exportEmployeesToCSV() {
            // Créer le contenu CSV
            let csvContent = "data:text/csv;charset=utf-8,Nom,Poste,Téléphone,Email,Date d'embauche,Statut\n";
            
            // Ajouter les employés actifs
            const activeEmployees = document.querySelectorAll('#cardView .employee-card');
            activeEmployees.forEach(employee => {
                const name = employee.querySelector('.employee-name').textContent;
                const position = employee.querySelector('.employee-position').textContent;
                const phone = employee.querySelector('.employee-info-item:nth-child(1)').textContent.replace(' ', '').slice(2);
                const email = employee.querySelector('.employee-info-item:nth-child(2)').textContent;
                const hireDate = employee.querySelector('.employee-info-item:nth-child(3)').textContent.split(': ')[1];
                const status = employee.querySelector('.status-badge').textContent;
                
                csvContent += `${name},${position},${phone},${email},${hireDate},${status}\n`;
            });
            
            // Créer le lien de téléchargement
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "employes_ferme_de_noix.csv");
            document.body.appendChild(link);
            
            // Déclencher le téléchargement
            link.click();
            document.body.removeChild(link);
        }
        
        // Fermer la modal si on clique en dehors
        window.onclick = function(event) {
            if (event.target.className === 'modal') {
                event.target.style.display = 'none';
            }
        }
    