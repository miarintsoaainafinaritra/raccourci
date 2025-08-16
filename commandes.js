document.addEventListener('DOMContentLoaded', function() {
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    const ordersTable = document.querySelector('.orders-table tbody');
    const newOrderBtn = document.querySelector('.btn-primary');
    const filterBtn = document.querySelector('.btn-secondary');

    let ordersData = [
        {
            id: "#1287",
            date: "15/06/2023",
            client: "Épicerie Bio Paris",
            products: "Noix Grenoble x5, Cerneaux x2",
            amount: "148,50 €",
            status: "shipped"
        },
        {
            id: "#1286",
            date: "14/06/2023",
            client: "Restaurant La Table",
            products: "Noix Cerneaux x10",
            amount: "210,00 €",
            status: "processing"
        },
        {
            id: "#1285",
            date: "12/06/2023",
            client: "Particulier - Lyon",
            products: "Mélange Noix x3",
            amount: "45,00 €",
            status: "delivered"
        },
        {
            id: "#1284",
            date: "10/06/2023",
            client: "Magasin Bio Vert",
            products: "Noix Grenoble x8, Cerneaux x5",
            amount: "237,60 €",
            status: "pending"
        },
        {
            id: "#1283",
            date: "08/06/2023",
            client: "Traiteur Les Saveurs",
            products: "Cerneaux x15",
            amount: "315,00 €",
            status: "delivered"
        }
    ];

    function normalizeText(text) {
        return text ? text.toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim() : '';
    }

    function formatDate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        return new Date(year, month - 1, day);
    }

    function isThisWeek(date) {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
        return date >= firstDayOfWeek && date <= lastDayOfWeek;
    }

    function filterOrders() {
        const statusValue = statusFilter.value;
        const dateValue = dateFilter.value;
        const searchValue = normalizeText(searchInput.value);
        
        const rows = ordersTable.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const orderId = row.cells[0].textContent;
            const order = ordersData.find(o => o.id === orderId);
            if (!order) return;
            
            let shouldShow = true;
            
            if (statusValue !== 'all' && order.status !== statusValue) {
                shouldShow = false;
            }

            const orderDate = formatDate(order.date);
            if (dateValue === 'today') {
                const today = new Date().toLocaleDateString('fr-FR');
                if (order.date !== today) shouldShow = false;
            } else if (dateValue === 'week' && !isThisWeek(orderDate)) {
                shouldShow = false;
            } else if (dateValue === 'month' && orderDate.getMonth() !== new Date().getMonth()) {
                shouldShow = false;
            } else if (dateValue === 'year' && orderDate.getFullYear() !== new Date().getFullYear()) {
                shouldShow = false;
            }
            
            if (searchValue) {
                const searchIn = normalizeText(order.id + order.client + order.products);
                if (!searchIn.includes(searchValue)) {
                    shouldShow = false;
                }
            }
            
            row.style.display = shouldShow ? '' : 'none';
        });
    }

    function renderOrders() {
        ordersTable.innerHTML = ordersData.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>${order.client}</td>
                <td>${order.products}</td>
                <td>${order.amount}</td>
                <td><span class="status ${order.status}">${
                    order.status === 'pending' ? 'En attente' :
                    order.status === 'processing' ? 'En préparation' :
                    order.status === 'shipped' ? 'Expédiée' : 'Livrée'
                }</span></td>
                <td>
                    <button class="btn-icon view-btn" data-id="${order.id}"><i class="fas fa-eye"></i></button>
                    ${order.status === 'pending' || order.status === 'processing' ? 
                     `<button class="btn-icon edit-btn" data-id="${order.id}"><i class="fas fa-edit"></i></button>` : 
                     `<button class="btn-icon print-btn" data-id="${order.id}"><i class="fas fa-print"></i></button>`}
                </td>
            </tr>
        `).join('');

        addRowEventListeners();
    }

    function addRowEventListeners() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                const order = ordersData.find(o => o.id === orderId);
                if (order) showOrderDetails(order);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                showEditForm(orderId);
            });
        });
        
        document.querySelectorAll('.print-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                const order = ordersData.find(o => o.id === orderId);
                if (order) {
                    const printContent = `
                        <h1>Commande ${order.id}</h1>
                        <p>Date: ${order.date}</p>
                        <p>Client: ${order.client}</p>
                        <p>Produits: ${order.products}</p>
                        <p>Montant: ${order.amount}</p>
                        <p>Statut: ${order.status}</p>
                    `;
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(printContent);
                    printWindow.document.close();
                    printWindow.print();
                }
            });
        });
    }

    function showOrderDetails(order) {
        const detailsHtml = `
            <div class="modal" id="orderDetailsModal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3><i class="fas fa-info-circle"></i> Détails de la Commande ${order.id}</h3>
                    <div class="order-details">
                        <p><strong>Date:</strong> ${order.date}</p>
                        <p><strong>Client:</strong> ${order.client}</p>
                        <p><strong>Produits:</strong> ${order.products}</p>
                        <p><strong>Montant:</strong> ${order.amount}</p>
                        <p><strong>Statut:</strong> <span class="status ${order.status}">${
                            order.status === 'pending' ? 'En attente' :
                            order.status === 'processing' ? 'En préparation' :
                            order.status === 'shipped' ? 'Expédiée' : 'Livrée'
                        }</span></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', detailsHtml);
        
        const modal = document.getElementById('orderDetailsModal');
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.onclick = function() {
            modal.remove();
        };
        
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.remove();
            }
        };
    }

    function showEditForm(orderId) {
        const order = ordersData.find(o => o.id === orderId);
        if (!order) return;
        
        const formHtml = `
            <div class="modal" id="editOrderModal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3><i class="fas fa-edit"></i> Modifier Commande ${orderId}</h3>
                    <form id="editForm">
                        <div class="form-group">
                            <label for="editClient">Client:</label>
                            <input type="text" id="editClient" value="${order.client}" required>
                        </div>
                        <div class="form-group">
                            <label for="editProducts">Produits:</label>
                            <textarea id="editProducts" required>${order.products}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="editAmount">Montant (€):</label>
                            <input type="text" id="editAmount" value="${order.amount.replace(' €', '')}" required>
                        </div>
                        <div class="form-group">
                            <label for="editStatus">Statut:</label>
                            <select id="editStatus">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>En attente</option>
                                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>En préparation</option>
                                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Expédiée</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Livrée</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Mettre à jour</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
        
        const modal = document.getElementById('editOrderModal');
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.onclick = function() {
            modal.remove();
        };
        
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.remove();
            }
        };
        
        document.getElementById('editForm').onsubmit = function(e) {
            e.preventDefault();
            order.client = document.getElementById('editClient').value;
            order.products = document.getElementById('editProducts').value;
            order.amount = document.getElementById('editAmount').value + ' €';
            order.status = document.getElementById('editStatus').value;
            
            filterOrders();
            modal.remove();
        };
    }

    function showNewOrderForm() {
        const formHtml = `
            <div class="modal" id="newOrderModal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3><i class="fas fa-plus"></i> Nouvelle Commande</h3>
                    <form id="orderForm">
                        <div class="form-group">
                            <label for="client">Client:</label>
                            <input type="text" id="client" required>
                        </div>
                        <div class="form-group">
                            <label for="products">Produits:</label>
                            <textarea id="products" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="amount">Montant (€):</label>
                            <input type="text" id="amount" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Enregistrer</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
        
        const modal = document.getElementById('newOrderModal');
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.onclick = function() {
            modal.remove();
        };
        
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.remove();
            }
        };
        
        document.getElementById('orderForm').onsubmit = function(e) {
            e.preventDefault();
            const newOrder = {
                id: `#${Math.floor(1000 + Math.random() * 9000)}`,
                date: new Date().toLocaleDateString('fr-FR'),
                client: document.getElementById('client').value,
                products: document.getElementById('products').value,
                amount: document.getElementById('amount').value + ' €',
                status: 'pending'
            };
            
            ordersData.unshift(newOrder);
            renderOrders();
            modal.remove();
        };
    }

    function init() {
        renderOrders();
        
        searchButton.addEventListener('click', filterOrders);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') filterOrders();
        });
        
        statusFilter.addEventListener('change', filterOrders);
        dateFilter.addEventListener('change', filterOrders);
        newOrderBtn.addEventListener('click', showNewOrderForm);
        filterBtn.addEventListener('click', function() {
            alert('Filtres avancés - À implémenter');
        });
    }

    init();
});