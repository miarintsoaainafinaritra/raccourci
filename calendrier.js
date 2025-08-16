
        // Données des activités
        let activities = [];

        // Élément du DOM
        const activitiesList = document.getElementById('activitiesList');
        const activityForm = document.getElementById('activityForm');
        const exportBtn = document.getElementById('exportBtn');

        // Fonction pour formater la date
        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        }

        // Fonction pour mettre à jour la liste
        function updateActivitiesList() {
            if (activities.length === 0) {
                activitiesList.innerHTML = `
                    <div class="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <i class="fas fa-calendar-alt text-4xl mb-2 text-gray-400"></i>
                        <p>Aucune activité enregistrée</p>
                    </div>
                `;
                return;
            }

            // Trier par date
            activities.sort((a, b) => new Date(a.date) - new Date(b.date));

            activitiesList.innerHTML = activities.map(activity => `
                <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-semibold text-green-800">${activity.activity.charAt(0).toUpperCase() + activity.activity.slice(1)}</h3>
                            <p class="text-sm text-gray-600">${formatDate(activity.date)}</p>
                            ${activity.parcelle ? `<p class="text-sm text-gray-500">Parcelle: ${activity.parcelle}</p>` : ''}
                        </div>
                        <span class="text-xs text-gray-400">${new Date(activity.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                    ${activity.description ? `<p class="text-gray-700 text-sm mt-2">${activity.description}</p>` : ''}
                </div>
            `).join('');
        }

        // Gestionnaire de soumission du formulaire
        activityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const date = document.getElementById('date').value;
            const activity = document.getElementById('activity').value;
            const description = document.getElementById('description').value;
            const parcelle = document.getElementById('parcelle').value;

            if (!date || !activity) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            const newActivity = {
                id: Date.now(),
                date,
                activity,
                description,
                parcelle,
                timestamp: new Date().toISOString()
            };

            activities.push(newActivity);
            activityForm.reset();
            
            updateActivitiesList();
            
            // Message de confirmation
            alert('Activité enregistrée avec succès !');
        });

        // Fonction d'exportation
        exportBtn.addEventListener('click', function() {
            if (activities.length === 0) {
                alert('Aucune activité à exporter.');
                return;
            }

            // Créer un contenu CSV
            let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM pour UTF-8
            csvContent += "Date,Activité,Parcelle,Description,Timestamp\n";
            
            activities.forEach(activity => {
                const row = [
                    `"${formatDate(activity.date)}"`,
                    `"${activity.activity.charAt(0).toUpperCase() + activity.activity.slice(1)}"`,
                    `"${activity.parcelle || ''}"`,
                    `"${activity.description || ''}"`,
                    `"${new Date(activity.timestamp).toLocaleString('fr-FR')}"`
                ].join(',');
                csvContent += row + '\n';
            });

            // Créer un lien de téléchargement
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `calendrier_agricole_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // Initialisation
        updateActivitiesList();
