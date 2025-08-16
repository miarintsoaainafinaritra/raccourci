// Farm Profile Management System
class FarmProfileManager {
    constructor() {
        this.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        this.init();
    }

    init() {
        this.bindEvents();
        this.addAnimationStyles();
    }

    bindEvents() {
        // Avatar management
        this.bindAvatarEvents();
        
        // Profile editing
        this.bindProfileEditEvents();
        
        // Password management
        this.bindPasswordEvents();
        
        // Modal management
        this.bindModalEvents();
    }

    bindAvatarEvents() {
        const profileImage = document.getElementById('profileImage');
        const avatarUpload = document.getElementById('avatarUpload');
        const errorMessage = document.getElementById('errorMessage');

        if (profileImage && avatarUpload) {
            profileImage.addEventListener('click', () => {
                avatarUpload.click();
            });

            avatarUpload.addEventListener('change', (e) => {
                this.handleAvatarUpload(e, errorMessage);
            });
        }
    }

    bindProfileEditEvents() {
        // Personal information editing
        const editPersonalInfoBtn = document.getElementById('editPersonalInfoBtn');
        const personalInfoDisplay = document.getElementById('personalInfoDisplay');
        const personalInfoForm = document.getElementById('personalInfoForm');
        const cancelPersonalEdit = document.getElementById('cancelPersonalEdit');

        if (editPersonalInfoBtn) {
            editPersonalInfoBtn.addEventListener('click', () => {
                this.toggleEditMode(personalInfoDisplay, personalInfoForm, true);
            });
        }

        if (cancelPersonalEdit) {
            cancelPersonalEdit.addEventListener('click', () => {
                this.toggleEditMode(personalInfoDisplay, personalInfoForm, false);
            });
        }

        if (personalInfoForm) {
            personalInfoForm.addEventListener('submit', (e) => {
                this.handlePersonalInfoSubmit(e, personalInfoDisplay, personalInfoForm);
            });
        }

        // Professional information editing
        const editProfessionalInfoBtn = document.getElementById('editProfessionalInfoBtn');
        const professionalInfoDisplay = document.getElementById('professionalInfoDisplay');
        const professionalInfoForm = document.getElementById('professionalInfoForm');
        const cancelProfessionalEdit = document.getElementById('cancelProfessionalEdit');

        if (editProfessionalInfoBtn) {
            editProfessionalInfoBtn.addEventListener('click', () => {
                this.toggleEditMode(professionalInfoDisplay, professionalInfoForm, true);
            });
        }

        if (cancelProfessionalEdit) {
            cancelProfessionalEdit.addEventListener('click', () => {
                this.toggleEditMode(professionalInfoDisplay, professionalInfoForm, false);
            });
        }

        if (professionalInfoForm) {
            professionalInfoForm.addEventListener('submit', (e) => {
                this.handleProfessionalInfoSubmit(e, professionalInfoDisplay, professionalInfoForm);
            });
        }
    }

    bindPasswordEvents() {
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const passwordModal = document.getElementById('passwordModal');
        const closePasswordModal = document.getElementById('closePasswordModal');
        const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
        const passwordForm = document.getElementById('passwordForm');

        if (changePasswordBtn && passwordModal) {
            changePasswordBtn.addEventListener('click', () => {
                this.openModal(passwordModal);
            });
        }

        if (closePasswordModal && passwordModal) {
            closePasswordModal.addEventListener('click', () => {
                this.closePasswordModal(passwordModal);
            });
        }

        if (cancelPasswordBtn && passwordModal) {
            cancelPasswordBtn.addEventListener('click', () => {
                this.closePasswordModal(passwordModal);
            });
        }

        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                this.handlePasswordSubmit(e, passwordModal);
            });
        }
    }

    bindModalEvents() {
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            const passwordModal = document.getElementById('passwordModal');
            if (e.target === passwordModal) {
                this.closePasswordModal(passwordModal);
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const passwordModal = document.getElementById('passwordModal');
                if (passwordModal && passwordModal.style.display === 'block') {
                    this.closePasswordModal(passwordModal);
                }
            }
        });
    }

    handleAvatarUpload(event, errorElement) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image/(png|jpeg|webp)')) {
            this.showError(errorElement, 'Veuillez sélectionner une image PNG, JPEG ou WebP');
            return;
        }

        // Validate file size
        if (file.size > this.MAX_FILE_SIZE) {
            this.showError(errorElement, 'L\'image ne doit pas dépasser 5MB');
            return;
        }

        // Read and display the image
        const reader = new FileReader();
        reader.onload = (e) => {
            const profileImage = document.getElementById('profileImage');
            if (profileImage) {
                profileImage.src = e.target.result;
                this.showToast('Photo de profil mise à jour avec succès', 'success');
            }
        };
        reader.onerror = () => {
            this.showError(errorElement, 'Erreur lors du chargement de l\'image');
        };
        reader.readAsDataURL(file);
    }

    toggleEditMode(displayElement, formElement, isEditing) {
        if (displayElement && formElement) {
            displayElement.style.display = isEditing ? 'none' : 'grid';
            formElement.style.display = isEditing ? 'block' : 'none';
        }
    }

    handlePersonalInfoSubmit(event, displayElement, formElement) {
        event.preventDefault();
        
        // Update displayed values
        const updates = [
            { displayId: 'infoEmail', inputId: 'editEmail' },
            { displayId: 'infoPhone', inputId: 'editPhone' },
            { displayId: 'infoBirthdate', inputId: 'editBirthdate', isDate: true },
            { displayId: 'infoAddress', inputId: 'editAddress' }
        ];

        updates.forEach(update => {
            const displayElement = document.getElementById(update.displayId);
            const inputElement = document.getElementById(update.inputId);
            
            if (displayElement && inputElement) {
                if (update.isDate) {
                    const date = new Date(inputElement.value);
                    displayElement.textContent = date.toLocaleDateString('fr-FR');
                } else {
                    displayElement.textContent = inputElement.value;
                }
            }
        });
        
        this.toggleEditMode(displayElement, formElement, false);
        this.showToast('Informations personnelles mises à jour', 'success');
    }

    handleProfessionalInfoSubmit(event, displayElement, formElement) {
        event.preventDefault();
        
        // Update displayed values
        const updates = [
            { displayId: 'infoSpecialty', inputId: 'editSpecialty' },
            { displayId: 'infoCertifications', inputId: 'editCertifications' },
            { displayId: 'infoInstallation', inputId: 'editInstallation' },
            { displayId: 'infoSurface', inputId: 'editSurface' }
        ];

        updates.forEach(update => {
            const displayElement = document.getElementById(update.displayId);
            const inputElement = document.getElementById(update.inputId);
            
            if (displayElement && inputElement) {
                displayElement.textContent = inputElement.value;
            }
        });
        
        this.toggleEditMode(displayElement, formElement, false);
        this.showToast('Informations professionnelles mises à jour', 'success');
    }

    openModal(modal) {
        if (modal) {
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus on first input
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closePasswordModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Reset form
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
            
            // Hide error messages
            const errorMessage = document.getElementById('passwordErrorMessage');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }
    }

    handlePasswordSubmit(event, modal) {
        event.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword')?.value;
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        const errorMessage = document.getElementById('passwordErrorMessage');
        
        // Validation
        if (newPassword !== confirmPassword) {
            this.showError(errorMessage, 'Les nouveaux mots de passe ne correspondent pas');
            return;
        }
        
        if (newPassword.length < 8) {
            this.showError(errorMessage, 'Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        // Additional password strength validation
        if (!this.validatePasswordStrength(newPassword)) {
            this.showError(errorMessage, 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre');
            return;
        }
        
        // Simulate API call
        this.simulatePasswordChange(modal);
    }

    validatePasswordStrength(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        
        return hasUpperCase && hasLowerCase && hasNumbers;
    }

    simulatePasswordChange(modal) {
        // Show loading state
        const submitBtn = modal.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Changement en cours...';
        }
        
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
            
            this.closePasswordModal(modal);
            this.showToast('Mot de passe changé avec succès', 'success');
        }, 1500);
    }

    showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }

    showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.textContent = message;

        document.body.appendChild(toast);

        // Auto-remove after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    addAnimationStyles() {
        // Check if styles already exist
        if (document.getElementById('dynamic-animations')) return;

        const style = document.createElement('style');
        style.id = 'dynamic-animations';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                10% { opacity: 1; transform: translateX(-50%) translateY(0); }
                90% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(20px); }
            }
            
            @keyframes fadeOut {
                to { opacity: 0; }
            }
            
            .toast {
                animation: fadeInOut 3s ease-in-out;
            }
            
            .form-group input:invalid {
                border-color: var(--error);
            }
            
            .form-group input:valid {
                border-color: var(--success);
            }
            
            .loading {
                opacity: 0.7;
                pointer-events: none;
            }
            
            .fade-in {
                animation: fadeIn 0.3s ease-in;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Utility functions for enhanced functionality
class ProfileUtils {
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    static debounce(func, wait) {
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const profileManager = new FarmProfileManager();
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add loading states for better UX
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && !e.defaultPrevented) {
                submitBtn.classList.add('loading');
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                }, 1000);
            }
        });
    });

    console.log('Farm Profile Management System initialized successfully');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FarmProfileManager, ProfileUtils };
}