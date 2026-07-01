import { register } from "../services/authService.js";
const form = document.querySelector("#registerForm");

const fullNameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const user = {
            fullName: fullNameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value,
        };

        if (
            user.fullName.trim() === "" ||
            user.email.trim() === "" ||
            user.password.trim() === "" ||
            user.confirmPassword.trim() === ""
        ) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        if (user.password !== user.confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        const data = await register(user);

        if (data.success) {
            alert(data.message);

            //window.location.href = "login.html";
        } else {
            alert(data.message);
        }

    } catch (error) {

        alert("Une erreur est survenue. Veuillez réessayer.");

    }
});

