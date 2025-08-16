document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Gestion de l'ajout de certificat
    const addCertificateBtn = document.getElementById('addCertificateBtn');
    const uploadCertificateSection = document.getElementById('uploadCertificateSection');
    const certificatesContainer = document.getElementById('certificatesContainer');
    const cancelUploadBtn = document.getElementById('cancelUploadBtn');
    const uploadArea = document.getElementById('uploadArea');
    const certificateFile = document.getElementById('certificateFile');
    const certificateForm = document.getElementById('certificateForm');
    
    addCertificateBtn.addEventListener('click', function() {
        certificatesContainer.style.display = 'none';
        uploadCertificateSection.style.display = 'block';
        window.scrollTo(0, document.body.scrollHeight);
    });
    
    cancelUploadBtn.addEventListener('click', function() {
        certificatesContainer.style.display = 'grid';
        uploadCertificateSection.style.display = 'none';
        certificateForm.reset();
    });
    
    // Drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadArea.classList.add('highlight');
    }
    
    function unhighlight() {
        uploadArea.classList.remove('highlight');
    }
    
    uploadArea.addEventListener('drop', handleDrop, false);
    uploadArea.addEventListener('click', function() {
        certificateFile.click();
    });
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    certificateFile.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.size > 5 * 1024 * 1024) {
                alert('Le fichier est trop volumineux (max 5MB)');
                return;
            }
            
            const validExtensions = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!validExtensions.includes(file.type)) {
                alert('Format de fichier non supporté. Utilisez PDF, JPG ou PNG.');
                return;
            }
            
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: #2ecc71;"></i>
                <h3>${file.name}</h3>
                <p>${(file.size / 1024 / 1024).toFixed(2)} MB</p>
            `;
        }
    }
    
    // Soumission du formulaire
    certificateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ici, vous ajouteriez le code pour envoyer les données au serveur
        // Pour cet exemple, nous allons juste simuler l'ajout
        
        const certificateName = document.getElementById('certificateName').value;
        const certificateOrganization = document.getElementById('certificateOrganization').value;
        const certificateDate = document.getElementById('certificateDate').value;
        const certificateExpiry = document.getElementById('certificateExpiry').value;
        const certificateReference = document.getElementById('certificateReference').value;
        
        // Calcul du pourcentage de validité
        const startDate = new Date(certificateDate);
        const endDate = new Date(certificateExpiry);
        const today = new Date();
        
        const totalDuration = endDate - startDate;
        const elapsedDuration = today - startDate;
        const progressPercent = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
        
        // Création de la nouvelle carte de certificat
        const newCertificate = document.createElement('div');
        newCertificate.className = 'certificate-card';
        newCertificate.innerHTML = `
            <div class="certificate-header">
                <span class="certificate-title">${certificateName}</span>
                <span class="certificate-badge ${progressPercent < 100 ? 'badge-valid' : 'badge-expired'}">
                    ${progressPercent < 100 ? 'Valide' : 'Expiré'}
                </span>
            </div>
            
            <div class="certificate-progress">
                <div class="progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            
            <div class="certificate-details">
                <div class="certificate-detail">
                    <i class="fas fa-building"></i>
                    <span>Organisme : ${certificateOrganization}</span>
                </div>
                <div class="certificate-detail">
                    <i class="fas fa-calendar-check"></i>
                    <span>Date d'obtention : ${formatDate(certificateDate)}</span>
                </div>
                <div class="certificate-detail">
                    <i class="fas fa-calendar-times"></i>
                    <span>Date d'expiration : ${formatDate(certificateExpiry)}</span>
                </div>
                <div class="certificate-detail">
                    <i class="fas fa-file-alt"></i>
                    <span>Référence : ${certificateReference}</span>
                </div>
            </div>
            <div class="certificate-actions">
                <button class="btn btn-secondary btn-sm view-certificate">
                    <i class="fas fa-eye"></i> Voir
                </button>
                <button class="btn btn-primary btn-sm download-certificate">
                    <i class="fas fa-download"></i> Télécharger
                </button>
            </div>
        `;
        
        // Ajout au début du conteneur
        certificatesContainer.insertBefore(newCertificate, certificatesContainer.firstChild);
        
        // Réinitialisation du formulaire
        certificateForm.reset();
        uploadArea.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <h3>Glissez-déposez votre fichier ici</h3>
            <p>ou cliquez pour sélectionner un fichier</p>
            <p class="text-muted">Formats acceptés : PDF, JPG, PNG (max 5MB)</p>
        `;
        
        // Retour à la vue des certificats
        certificatesContainer.style.display = 'grid';
        uploadCertificateSection.style.display = 'none';
        
        // Ajout des écouteurs d'événements aux nouveaux boutons
        addCertificateEventListeners(newCertificate);
        
        // Message de succès
        alert('Certificat ajouté avec succès!');
    });
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    }
    
    // Filtres
    const certificateSearch = document.getElementById('certificateSearch');
    const certificateStatusFilter = document.getElementById('certificateStatusFilter');
    const certificatePeriodFilter = document.getElementById('certificatePeriodFilter');
    
    [certificateSearch, certificateStatusFilter, certificatePeriodFilter].forEach(filter => {
        filter.addEventListener('change', filterCertificates);
        filter.addEventListener('keyup', filterCertificates);
    });
    
    function filterCertificates() {
        const searchTerm = certificateSearch.value.toLowerCase();
        const statusFilter = certificateStatusFilter.value;
        const periodFilter = certificatePeriodFilter.value;
        
        const today = new Date();
        
        document.querySelectorAll('.certificate-card').forEach(card => {
            const title = card.querySelector('.certificate-title').textContent.toLowerCase();
            const organization = card.querySelector('.certificate-detail:nth-child(1) span').textContent.toLowerCase();
            const expiryDateText = card.querySelector('.certificate-detail:nth-child(3) span').textContent;
            const expiryDate = new Date(expiryDateText.split(' : ')[1].split('/').reverse().join('-'));
            
            const status = card.querySelector('.certificate-badge').classList.contains('badge-valid') ? 'valid' : 
                          card.querySelector('.certificate-badge').classList.contains('badge-expired') ? 'expired' : 'pending';
            
            // Vérification des critères
            const matchesSearch = title.includes(searchTerm) || organization.includes(searchTerm);
            const matchesStatus = statusFilter === '' || status === statusFilter;
            
            let matchesPeriod = true;
            if (periodFilter === 'current') {
                matchesPeriod = today <= expiryDate;
            } else if (periodFilter === 'future') {
                matchesPeriod = today < new Date(card.querySelector('.certificate-detail:nth-child(2) span').textContent.split(' : ')[1].split('/').reverse().join('-'));
            } else if (periodFilter === 'past') {
                matchesPeriod = today > expiryDate;
            }
            
            if (matchesSearch && matchesStatus && matchesPeriod) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Modal de visualisation
    const modal = document.getElementById('certificateModal');
    const closeModal = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalCertificateTitle');
    const certificatePreview = document.getElementById('certificatePreview');
    
    function addCertificateEventListeners(card) {
        card.querySelector('.view-certificate').addEventListener('click', function() {
            const title = card.querySelector('.certificate-title').textContent;
            modalTitle.textContent = title;
            certificatePreview.alt = title;
            modal.style.display = 'flex';
        });
        
        card.querySelector('.download-certificate').addEventListener('click', function() {
            alert('Téléchargement du certificat simulé');
            // En réalité, vous feriez une requête au serveur pour télécharger le fichier
        });
    }
    
    // Ajout des écouteurs aux certificats existants
    document.querySelectorAll('.certificate-card').forEach(addCertificateEventListeners);
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    document.getElementById('printCertificate').addEventListener('click', function() {
        window.print();
    });
    
    document.getElementById('downloadFromModal').addEventListener('click', function() {
        alert('Téléchargement du certificat simulé depuis la modal');
    });
    
    // Fermer la modal en cliquant à l'extérieur
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});