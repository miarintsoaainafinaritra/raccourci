document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm")
  const submitBtn = document.getElementById("submitBtn")
  const acceptTerms = document.getElementById("acceptTerms")
  const togglePasswordBtns = document.querySelectorAll(".toggle-password")

  // Gestion de l'activation/désactivation du bouton submit
  acceptTerms.addEventListener("change", function () {
    submitBtn.disabled = !this.checked
  })

  // Gestion de l'affichage/masquage des mots de passe
  togglePasswordBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target")
      const targetInput = document.getElementById(targetId)
      const icon = this.querySelector("i")

      if (targetInput.type === "password") {
        targetInput.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        targetInput.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  })

  // Validation en temps réel des mots de passe
  const password = document.getElementById("password")
  const confirmPassword = document.getElementById("confirmPassword")

  function validatePasswords() {
    if (confirmPassword.value && password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("Les mots de passe ne correspondent pas")
    } else {
      confirmPassword.setCustomValidity("")
    }
  }

  password.addEventListener("input", validatePasswords)
  confirmPassword.addEventListener("input", validatePasswords)

  // Gestion de la soumission du formulaire
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Récupération des données du formulaire
    const formData = new FormData(form)
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      acceptTerms: formData.get("acceptTerms") === "on",
    }

    // Validation finale
    if (data.password !== data.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    if (!data.acceptTerms) {
      alert("Vous devez accepter les conditions d'utilisation")
      return
    }

    // Simulation de l'envoi des données
    submitBtn.textContent = "Création en cours..."
    submitBtn.disabled = true

    setTimeout(() => {
      console.log("Données d'inscription:", data)
      alert("Compte créé avec succès !")

      // Reset du formulaire
      form.reset()
      submitBtn.textContent = "Créer mon compte"
      submitBtn.disabled = true
    }, 2000)
  })

  // Animation des champs au focus
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]')

  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)"
      this.parentElement.style.transition = "transform 0.2s ease"
    })

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)"
    })
  })
})
