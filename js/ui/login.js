import { login } from "../services/authService.js";
import { showToast } from "./toast.js";


// ================================
// Gestion du thème
// ================================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
}


// ================================
// Récupération des éléments HTML
// ================================

const form = document.querySelector("#loginForm");

const emailInput = document.querySelector("#email");

const passwordInput = document.querySelector("#password");

const togglePasswordButton =
    document.querySelector("#togglePassword");

const loginButton =
    document.querySelector("#loginButton");

const loginButtonText =
    document.querySelector("#loginButtonText");

const loginSpinner =
    document.querySelector("#loginSpinner");


// ================================
// Afficher / masquer le mot de passe
// ================================

togglePasswordButton.addEventListener("click", () => {

    passwordInput.type =
        passwordInput.type === "password"
            ? "text"
            : "password";

});


// ================================
// Connexion
// ================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    // ================================
    // Récupérer les informations
    // ================================

    const user = {

        email: emailInput.value.trim(),

        password: passwordInput.value.trim()

    };


    // ================================
    // Vérification des champs
    // ================================

    if (user.email === "" || user.password === "") {

        showToast(
            "Veuillez remplir tous les champs.",
            "error"
        );

        return;
    }


    // ================================
    // État de chargement
    // ================================

    loginButton.disabled = true;

    loginButtonText.textContent = "Connexion en cours...";

    loginSpinner.classList.remove("hidden");


    try {

        // ================================
        // Appel de l'API
        // ================================

        const data = await login(user);


        // ================================
        // Connexion réussie
        // ================================

        if (data.success) {

            const token = data.data.token;

            localStorage.setItem("token", token);


            // Message de succès
            showToast(
                data.message || "Connexion réussie !",
                "success"
            );


            // Changement du bouton
            loginButtonText.textContent = "Connexion réussie !";

            loginSpinner.classList.remove("hidden");


            // ================================
            // Redirection vers le chat
            // ================================

            setTimeout(() => {

                window.location.href = "chat.html";

            }, 1200);


        } else {

            // ================================
            // Identifiants incorrects
            // ================================

            showToast(
                data.message || "Identifiants incorrects.",
                "error"
            );


            // Réactiver le bouton
            loginButton.disabled = false;

            loginButtonText.textContent = "Login";

            loginSpinner.classList.add("hidden");

        }


    } catch (error) {

        console.error(error);


        // ================================
        // Erreur serveur / API
        // ================================

        showToast(
            "Une erreur est survenue. Veuillez réessayer.",
            "error"
        );


        // Réactiver le bouton
        loginButton.disabled = false;

        loginButtonText.textContent = "Login";

        loginSpinner.classList.add("hidden");

    }

});