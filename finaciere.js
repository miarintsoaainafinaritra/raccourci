// Fonction pour initialiser la page
document.addEventListener('DOMContentLoaded', function() {
    // Toggle du menu mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // Gestion des onglets
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons et contenus
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Ajouter la classe active au bouton cliqué et au contenu correspondant
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });

    // Gestion du filtre de période
    const periodFilter = document.getElementById('periodFilter');
    const dateRangeGroup = document.getElementById('dateRangeGroup');
    
    periodFilter.addEventListener('change', function() {
        if (this.value === 'custom') {
            dateRangeGroup.style.display = 'flex';
        } else {
            dateRangeGroup.style.display = 'none';
        }
    });

    // Initialisation du graphique avec Chart.js
    const ctx = document.getElementById('financialChart').getContext('2d');
    const financialChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: [
                {
                    label: 'Revenus',
                    data: [8500, 9200, 10500, 12000, 11500, 13000, 12500, 12450, 13200, 14000, 14500, 15000],
                    backgroundColor: '#4a7c59',
                    borderRadius: 4
                },
                {
                    label: 'Dépenses',
                    data: [6200, 5800, 6500, 7200, 6800, 7500, 7100, 6780, 6900, 7200, 7500, 8000],
                    backgroundColor: '#dc3545',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' €';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + ' €';
                        }
                    }
                }
            }
        }
    });

    // Gestion des modals
    // Modal de transaction
    const transactionModal = document.getElementById('transactionModal');
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const closeTransactionModal = document.getElementById('closeTransactionBtn');
    const cancelTransactionBtn = document.getElementById('cancelTransactionBtn');
    
    addTransactionBtn.addEventListener('click', function() {
        document.getElementById('transactionModalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Nouvelle Transaction';
        transactionModal.style.display = 'block';
    });
    
    closeTransactionModal.addEventListener('click', function() {
        transactionModal.style.display = 'none';
    });
    
    cancelTransactionBtn.addEventListener('click', function() {
        transactionModal.style.display = 'none';
    });
    
    // Modal de catégorie
    const categoryModal = document.getElementById('categoryModal');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const closeCategoryModal = document.getElementById('closeCategoryBtn');
    const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
    
    addCategoryBtn.addEventListener('click', function() {
        document.getElementById('categoryModalTitle').innerHTML = '<i class="fas fa-tag"></i> Nouvelle Catégorie';
        categoryModal.style.display = 'block';
    });
    
    closeCategoryModal.addEventListener('click', function() {
        categoryModal.style.display = 'none';
    });
    
    cancelCategoryBtn.addEventListener('click', function() {
        categoryModal.style.display = 'none';
    });
    
    // Modal de budget
    const budgetModal = document.getElementById('budgetModal');
    const addBudgetBtn = document.getElementById('addBudgetBtn');
    const closeBudgetModal = document.getElementById('closeBudgetBtn');
    const cancelBudgetBtn = document.getElementById('cancelBudgetBtn');
    
    addBudgetBtn.addEventListener('click', function() {
        document.getElementById('budgetModalTitle').innerHTML = '<i class="fas fa-wallet"></i> Nouveau Budget';
        budgetModal.style.display = 'block';
    });
    
    closeBudgetModal.addEventListener('click', function() {
        budgetModal.style.display = 'none';
    });
    
    cancelBudgetBtn.addEventListener('click', function() {
        budgetModal.style.display = 'none';
    });
    
    // Fermer les modals en cliquant à l'extérieur
    window.addEventListener('click', function(event) {
        if (event.target === transactionModal) {
            transactionModal.style.display = 'none';
        }
        if (event.target === categoryModal) {
            categoryModal.style.display = 'none';
        }
        if (event.target === budgetModal) {
            budgetModal.style.display = 'none';
        }
    });

    // Remplir le tableau des transactions avec des données fictives
    const financialTableBody = document.getElementById('financialTableBody');
    const transactions = [
        { date: '2023-06-15', description: 'Vente de noix bio', category: 'Ventes', amount: 2450, type: 'income', invoice: 'FAC-2023-015' },
        { date: '2023-06-14', description: 'Achat d\'emballages', category: 'Fournitures', amount: 320, type: 'expense', invoice: 'FOU-2023-042' },
        { date: '2023-06-12', description: 'Salaire employé', category: 'Personnel', amount: 1850, type: 'expense', invoice: 'SAL-2023-06' },
        { date: '2023-06-10', description: 'Achat nouveau tracteur', category: 'Équipement', amount: 12500, type: 'investment', invoice: 'EQU-2023-003' },
        { date: '2023-06-08', description: 'Renouvellement certification', category: 'Certifications', amount: 650, type: 'expense', invoice: 'CERT-2023-01' },
        { date: '2023-06-05', description: 'Vente gros client', category: 'Ventes', amount: 3800, type: 'income', invoice: 'FAC-2023-014' },
        { date: '2023-06-03', description: 'Achat engrais bio', category: 'Fournitures', amount: 420, type: 'expense', invoice: 'FOU-2023-041' },
        { date: '2023-06-01', description: 'Maintenance équipement', category: 'Équipement', amount: 280, type: 'expense', invoice: 'MAINT-2023-06' }
    ];

    function renderTransactions() {
        financialTableBody.innerHTML = '';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            
            // Déterminer l'icône et la classe en fonction du type
            let typeIcon, typeClass;
            if (transaction.type === 'income') {
                typeIcon = '<i class="fas fa-arrow-down text-success"></i>';
                typeClass = 'text-success';
            } else if (transaction.type === 'expense') {
                typeIcon = '<i class="fas fa-arrow-up text-danger"></i>';
                typeClass = 'text-danger';
            } else {
                typeIcon = '<i class="fas fa-exchange-alt text-info"></i>';
                typeClass = 'text-info';
            }
            
            row.innerHTML = `
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td class="${typeClass}">${transaction.amount.toFixed(2)} €</td>
                <td>${typeIcon} ${capitalizeFirstLetter(transaction.type)}</td>
                <td>${transaction.invoice}</td>
                <td>
                    <button class="btn-action edit-btn" data-id="${transaction.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-action delete-btn" data-id="${transaction.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            financialTableBody.appendChild(row);
        });
    }

    // Remplir les catégories avec des données fictives
    const categoriesGrid = document.getElementById('categoriesGrid');
    const categories = [
        { id: 1, name: 'Ventes', color: '#4a7c59' },
        { id: 2, name: 'Fournitures', color: '#6c757d' },
        { id: 3, name: 'Personnel', color: '#007bff' },
        { id: 4, name: 'Équipement', color: '#6610f2' },
        { id: 5, name: 'Certifications', color: '#fd7e14' }
    ];

    function renderCategories() {
        categoriesGrid.innerHTML = '';
        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.style.borderLeftColor = category.color;
            categoryItem.innerHTML = `
                <div class="category-color" style="background-color: ${category.color}"></div>
                <div class="category-name">${category.name}</div>
                <div class="category-actions">
                    <button class="edit-category-btn" data-id="${category.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-category-btn" data-id="${category.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            categoriesGrid.appendChild(categoryItem);
        });
    }

    // Remplir les budgets avec des données fictives
    const budgetsContainer = document.getElementById('budgetsContainer');
    const budgets = [
        { id: 1, category: 'Ventes', amount: 15000, spent: 12450, period: 'monthly' },
        { id: 2, category: 'Fournitures', amount: 1000, spent: 780, period: 'monthly' },
        { id: 3, category: 'Personnel', amount: 2000, spent: 1850, period: 'monthly' },
        { id: 4, category: 'Équipement', amount: 5000, spent: 12780, period: 'yearly' },
        { id: 5, category: 'Certifications', amount: 800, spent: 650, period: 'yearly' }
    ];

    function renderBudgets() {
        budgetsContainer.innerHTML = '';
        budgets.forEach(budget => {
            const percentage = Math.min(100, (budget.spent / budget.amount) * 100);
            
            const budgetItem = document.createElement('div');
            budgetItem.className = 'budget-item';
            budgetItem.innerHTML = `
                <div class="budget-header">
                    <div class="budget-name">${budget.category}</div>
                    <div class="budget-amount">${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)} €</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%; background-color: ${getCategoryColor(budget.category)}"></div>
                </div>
                <div class="budget-footer">
                    <div>${percentage.toFixed(1)}%</div>
                    <div>${capitalizeFirstLetter(budget.period)}</div>
                </div>
            `;
            budgetsContainer.appendChild(budgetItem);
        });
    }

    // Fonctions utilitaires
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getCategoryColor(categoryName) {
        const category = categories.find(cat => cat.name === categoryName);
        return category ? category.color : '#4a7c59';
    }

    // Écouteurs d'événements pour les formulaires
    document.getElementById('transactionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Ici, vous ajouteriez la logique pour sauvegarder la transaction
        alert('Transaction enregistrée avec succès !');
        transactionModal.style.display = 'none';
        this.reset();
    });

    document.getElementById('categoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Ici, vous ajouteriez la logique pour sauvegarder la catégorie
        alert('Catégorie enregistrée avec succès !');
        categoryModal.style.display = 'none';
        this.reset();
    });

    document.getElementById('budgetForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Ici, vous ajouteriez la logique pour sauvegarder le budget
        alert('Budget enregistré avec succès !');
        budgetModal.style.display = 'none';
        this.reset();
    });

    // Initialiser les données
    renderTransactions();
    renderCategories();
    renderBudgets();
});