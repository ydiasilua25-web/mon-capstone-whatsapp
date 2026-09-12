import { register } from "../services/authService.js";
import { showToast } from "./toast.js";

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
}

const form = document.querySelector("#registerForm");
const fullNameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");
const togglePasswordButton = document.querySelector("#togglePassword");
const toggleConfirmPasswordButton = document.querySelector("#toggleConfirmPassword");

// Afficher / masquer les mots de passe
togglePasswordButton.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

toggleConfirmPasswordButton.addEventListener("click", () => {
    confirmPasswordInput.type = confirmPasswordInput.type === "password" ? "text" : "password";
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
        confirmPassword: confirmPasswordInput.value.trim()
    };

    if (
        user.fullName === "" ||
        user.email === "" ||
        user.password === "" ||
        user.confirmPassword === ""
    ) {
        showToast("Veuillez remplir tous les champs.", "error");
        return;
    }

    if (user.password !== user.confirmPassword) {
        showToast("Les mots de passe ne correspondent pas.", "error");
        return;
    }

    try {
        const data = await register(user);

        if (data.success) {
            showToast(data.message || "Inscription réussie.", "success");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 800);
        } else {
            showToast(data.message || "Impossible de créer le compte.", "error");
        }
    } catch (error) {
        console.error(error);
        showToast("Une erreur est survenue. Veuillez réessayer.", "error");
    }
});
