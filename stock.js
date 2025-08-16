let products = [];
        let editIndex = -1;
        
        // Charger les données depuis le localStorage au démarrage
        document.addEventListener('DOMContentLoaded', function() {
            const savedProducts = localStorage.getItem('inventory');
            if (savedProducts) {
                products = JSON.parse(savedProducts);
                renderInventory();
            }
        });
        
        // Gérer la soumission du formulaire
        document.getElementById('productForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const product = {
                id: generateId(),
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                quantity: parseInt(document.getElementById('productQuantity').value),
                price: parseFloat(document.getElementById('productPrice').value)
            };
            
            if (editIndex === -1) {
                // Ajouter un nouveau produit
                products.push(product);
            } else {
                // Mettre à jour un produit existant
                product.id = products[editIndex].id; // Garder le même ID
                products[editIndex] = product;
                editIndex = -1;
                
                // Revenir au mode ajout
                document.getElementById('submitBtn').style.display = 'inline-block';
                document.getElementById('updateBtn').style.display = 'none';
                document.getElementById('cancelBtn').style.display = 'none';
            }
            
            // Sauvegarder dans le localStorage
            saveToLocalStorage();
            
            // Mettre à jour l'affichage
            renderInventory();
            
            // Réinitialiser le formulaire
            this.reset();
        });
        
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        
        function renderInventory() {
            const tbody = document.getElementById('inventoryBody');
        tbody.innerHTML = '';
            
            let totalValue = 0;
            
            products.forEach((product, index) => {
                const row = document.createElement('tr');
                const totalProductValue = product.quantity * product.price;
                totalValue += totalProductValue;
                
                row.innerHTML = `
                    <td>${product.id.substring(0, 8)}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price.toFixed(2)} €</td>
                    <td>${totalProductValue.toFixed(2)} €</td>
                    <td class="actions">
                        <button class="edit-btn" onclick="editProduct(${index})">Modifier</button>
                        <button class="delete-btn" onclick="deleteProduct(${index})">Supprimer</button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            document.getElementById('totalValue').textContent = totalValue.toFixed(2) + ' €';
        }
        
        function editProduct(index) {
            const product = products[index];
            editIndex = index;
            
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productPrice').value = product.price;
            
            document.getElementById('submitBtn').style.display = 'none';
            document.getElementById('updateBtn').style.display = 'inline-block';
            document.getElementById('cancelBtn').style.display = 'inline-block';
        }
        
        function updateProduct() {
            document.getElementById('productForm').dispatchEvent(new Event('submit'));
        }
        
        function cancelEdit() {
            editIndex = -1;
            document.getElementById('productForm').reset();
            document.getElementById('submitBtn').style.display = 'inline-block';
            document.getElementById('updateBtn').style.display = 'none';
            document.getElementById('cancelBtn').style.display = 'none';
        }
        
        function deleteProduct(index) {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
                products.splice(index, 1);
                saveToLocalStorage();
                renderInventory();
                
                // Si on supprime le produit en cours d'édition
                if (editIndex === index) {
                    cancelEdit();
                } else if (editIndex > index) {
                    editIndex--;
                }
            }
        }
        
        function searchProducts() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const rows = document.getElementById('inventoryBody').getElementsByTagName('tr');
            
            for (let i = 0; i < rows.length; i++) {
                const name = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
                const category = rows[i].getElementsByTagName('td')[2].textContent.toLowerCase();
                
                if (name.includes(searchTerm) || category.includes(searchTerm)) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }
        }
        
        function saveToLocalStorage() {
            localStorage.setItem('inventory', JSON.stringify(products));
        }
    