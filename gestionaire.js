
        // Données d'exemple pour les employés
        let employees = [
            {
                id: 1,
                name: "Marie Dubois",
                email: "marie.dubois@ferme-noix.fr",
                phone: "06 12 34 56 78",
                position: "Responsable Production",
                department: "production",
                hireDate: "2020-03-15",
                salary: 2800,
                status: "active"
            },
            {
                id: 2,
                name: "Pierre Martin",
                email: "pierre.martin@ferme-noix.fr",
                phone: "06 23 45 67 89",
                position: "Technicien Maintenance",
                department: "maintenance",
                hireDate: "2021-07-20",
                salary: 2200,
                status: "active"
            },
            {
                id: 3,
                name: "Sophie Leroy",
                email: "sophie.leroy@ferme-noix.fr",
                phone: "06 34 56 78 90",
                position: "Assistante Administrative",
                department: "administration",
                hireDate: "2019-11-10",
                salary: 1900,
                status: "pending"
            },
            {
                id: 4,
                name: "Jean Moreau",
                email: "jean.moreau@ferme-noix.fr",
                phone: "06 45 67 89 01",
                position: "Ouvrier Agricole",
                department: "production",
                hireDate: "2022-01-05",
                salary: 1700,
                status: "active"
            },
            {
                id: 5,
                name: "Lucie Bernard",
                email: "lucie.bernard@ferme-noix.fr",
                phone: "06 56 78 90 12",
                position: "Commerciale",
                department: "vente",
                hireDate: "2021-09-12",
                salary: 2400,
                status: "inactive"
            }
        ];

        let currentPage = 1;
        const itemsPerPage = 10;
        let filteredEmployees = [...employees];
        let editingEmployeeId = null;

        // Éléments DOM
        const employeeTableBody = document.getElementById('employeeTableBody');
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        const departmentFilter = document.getElementById('departmentFilter');
        const addEmployeeBtn = document.getElementById('addEmployeeBtn');
        const employeeModal = document.getElementById('employeeModal');
        const closeModal = document.getElementById('closeModal');
        const employeeForm = document.getElementById('employeeForm');
        const modalTitle = document.getElementById('modalTitle');
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            renderEmployeeTable();
            setupEventListeners();
            updateStats();
        });

        // Configuration des écouteurs d'événements
        function setupEventListeners() {
            // Recherche et filtres
            searchInput.addEventListener('input', debounce(filterEmployees, 300));
            statusFilter.addEventListener('change', filterEmployees);
            departmentFilter.addEventListener('change', filterEmployees);

            // Modal
            addEmployeeBtn.addEventListener('click', openAddModal);
            closeModal.addEventListener('click', closeEmployeeModal);
            document.getElementById('cancelBtn').addEventListener('click', closeEmployeeModal);
            employeeForm.addEventListener('submit', handleFormSubmit);

            // Menu mobile
            menuToggle.addEventListener('click', toggleMobileMenu);

            // Fermer modal en cliquant à l'extérieur
            window.addEventListener('click', function(event) {
                if (event.target === employeeModal) {
                    closeEmployeeModal();
                }
            });

            // Export
            document.getElementById('exportBtn').addEventListener('click', exportData);
        }

        // Fonction debounce pour optimiser la recherche
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Rendu du tableau des employés
        function renderEmployeeTable() {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageEmployees = filteredEmployees.slice(startIndex, endIndex);

            employeeTableBody.innerHTML = '';

            if (pageEmployees.length === 0) {
                employeeTableBody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-light);">
                            <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                            Aucun employé trouvé
                        </td>
                    </tr>
                `;
                return;
            }

            pageEmployees.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.8rem;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                                ${employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <div style="font-weight: 600;">${employee.name}</div>
                                <div style="font-size: 0.8rem; color: var(--text-light);">${employee.phone}</div>
                            </div>
                        </div>
                    </td>
                    <td>${employee.email}</td>
                    <td>${employee.position}</td>
                    <td>
                        <span style="padding: 0.3rem 0.6rem; background: rgba(74, 124, 89, 0.1); color: var(--primary); border-radius: 4px; font-size: 0.8rem; font-weight: 500;">
                            ${getDepartmentName(employee.department)}
                        </span>
                    </td>
                    <td>${formatDate(employee.hireDate)}</td>
                    <td>
                        <span class="status-badge status-${employee.status}">
                            <i class="fas ${getStatusIcon(employee.status)}"></i>
                            ${getStatusText(employee.status)}
                        </span>
                    </td>
                    <td>
                        <button class="action-btn info-btn" onclick="viewEmployee(${employee.id})" title="Voir détails">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="editEmployee(${employee.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteEmployee(${employee.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                employeeTableBody.appendChild(row);
            });

            renderPagination();
        }

        // Fonctions utilitaires
        function getDepartmentName(dept) {
            const departments = {
                'production': 'Production',
                'maintenance': 'Maintenance',
                'administration': 'Administration',
                'vente': 'Vente'
            };
            return departments[dept] || dept;
        }

        function getStatusText(status) {
            const statuses = {
                'active': 'Actif',
                'pending': 'En attente',
                'inactive': 'Inactif'
            };
            return statuses[status] || status;
        }

        function getStatusIcon(status) {
            const icons = {
                'active': 'fa-check-circle',
                'pending': 'fa-clock',
                'inactive': 'fa-times-circle'
            };
            return icons[status] || 'fa-question-circle';
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }

        // Filtrage des employés
        function filterEmployees() {
            const searchTerm = searchInput.value.toLowerCase();
            const statusValue = statusFilter.value;
            const departmentValue = departmentFilter.value;

            filteredEmployees = employees.filter(employee => {
                const matchesSearch = 
                    employee.name.toLowerCase().includes(searchTerm) ||
                    employee.email.toLowerCase().includes(searchTerm) ||
                    employee.position.toLowerCase().includes(searchTerm);
                
                const matchesStatus = !statusValue || employee.status === statusValue;
                const matchesDepartment = !departmentValue || employee.department === departmentValue;

                return matchesSearch && matchesStatus && matchesDepartment;
            });

            currentPage = 1;
            renderEmployeeTable();
            updateStats();
        }

        // Pagination
        function renderPagination() {
            const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
            const pagination = document.getElementById('pagination');
            
            if (totalPages <= 1) {
                pagination.innerHTML = '';
                return;
            }

            let paginationHTML = '';
            
            // Bouton précédent
            paginationHTML += `
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
                        <i class="fas fa-chevron-left"></i>
                    </a>
                </li>
            `;

            // Numéros de page
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                    paginationHTML += `
                        <li class="page-item ${i === currentPage ? 'active' : ''}">
                            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                        </li>
                    `;
                } else if (i === currentPage - 3 || i === currentPage + 3) {
                    paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                }
            }

            // Bouton suivant
            paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            `;

            pagination.innerHTML = paginationHTML;
        }

        function changePage(page) {
            const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                renderEmployeeTable();
            }
        }

        // Gestion du modal
        function openAddModal() {
            editingEmployeeId = null;
            modalTitle.innerHTML = '<i class="fas fa-user-plus"></i> Ajouter un Employé';
            employeeForm.reset();
            employeeModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function editEmployee(id) {
            const employee = employees.find(emp => emp.id === id);
            if (!employee) return;

            editingEmployeeId = id;
            modalTitle.innerHTML = '<i class="fas fa-user-edit"></i> Modifier l\'Employé';
            
            document.getElementById('employeeName').value = employee.name;
            document.getElementById('employeeEmail').value = employee.email;
            document.getElementById('employeePhone').value = employee.phone;
            document.getElementById('employeePosition').value = employee.position;
            document.getElementById('employeeDepartment').value = employee.department;
            document.getElementById('employeeHireDate').value = employee.hireDate;
            document.getElementById('employeeSalary').value = employee.salary;

            employeeModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeEmployeeModal() {
            employeeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            employeeForm.reset();
            editingEmployeeId = null;
        }

        function handleFormSubmit(event) {
            event.preventDefault();
            
            const formData = {
                name: document.getElementById('employeeName').value,
                email: document.getElementById('employeeEmail').value,
                phone: document.getElementById('employeePhone').value,
                position: document.getElementById('employeePosition').value,
                department: document.getElementById('employeeDepartment').value,
                hireDate: document.getElementById('employeeHireDate').value,
                salary: parseFloat(document.getElementById('employeeSalary').value) || 0,
                status: 'active'
            };

            if (editingEmployeeId) {
                // Modification
                const index = employees.findIndex(emp => emp.id === editingEmployeeId);
                if (index !== -1) {
                    employees[index] = { ...employees[index], ...formData };
                    showNotification('Employé modifié avec succès!', 'success');
                }
            } else {
                // Ajout
                const newEmployee = {
                    id: Math.max(...employees.map(emp => emp.id)) + 1,
                    ...formData
                };
                employees.push(newEmployee);
                showNotification('Employé ajouté avec succès!', 'success');
            }

            closeEmployeeModal();
            filterEmployees();
            updateStats();
        }

        // Actions sur les employés
        function viewEmployee(id) {
            const employee = employees.find(emp => emp.id === id);
            if (!employee) return;

            const details = `
                <strong>Nom:</strong> ${employee.name}<br>
                <strong>Email:</strong> ${employee.email}<br>
                <strong>Téléphone:</strong> ${employee.phone}<br>
                <strong>Poste:</strong> ${employee.position}<br>
                <strong>Département:</strong> ${getDepartmentName(employee.department)}<br>
                <strong>Date d'embauche:</strong> ${formatDate(employee.hireDate)}<br>
                <strong>Salaire:</strong> ${employee.salary}€<br>
                <strong>Statut:</strong> ${getStatusText(employee.status)}
            `;

            showNotification(details, 'info');
        }

        function deleteEmployee(id) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
                employees = employees.filter(emp => emp.id !== id);
                showNotification('Employé supprimé avec succès!', 'success');
                filterEmployees();
                updateStats();
            }
        }

        // Notifications
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 5000);
        }

        // Menu mobile
        function toggleMobileMenu() {
            sidebar.classList.toggle('mobile-hidden');
        }

        // Mise à jour des statistiques
        function updateStats() {
            const activeCount = employees.filter(emp => emp.status === 'active').length;
            document.getElementById('activeEmployees').textContent = activeCount;
        }

        // Export des données
        function exportData() {
            const csvContent = "data:text/csv;charset=utf-8," 
                + "Nom,Email,Téléphone,Poste,Département,Date d'embauche,Salaire,Statut\n"
                + filteredEmployees.map(emp => 
                    `"${emp.name}","${emp.email}","${emp.phone}","${emp.position}","${getDepartmentName(emp.department)}","${emp.hireDate}","${emp.salary}","${getStatusText(emp.status)}"`
                ).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "employes_ferme_noix.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showNotification('Export réalisé avec succès!', 'success');
        }

        // Animation des statistiques au chargement
        function animateStats() {
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const finalValue = stat.textContent;
                stat.textContent = '0';
                
                let current = 0;
                const increment = finalValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalValue) {
                        stat.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 30);
            });
        }

        // Lancer l'animation des stats après le chargement
        setTimeout(animateStats, 500);
   