import { login} from "../services/authService.js";

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
}

const form = document.querySelector("#loginForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
            const user = {
                email: emailInput.value,
                password: passwordInput.value,
            };
    
            if (
                user.email.trim() === "" ||
                user.password.trim() === ""
            ) {
                alert("Veuillez remplir tous les champs");
                return;
            }
    
            const data = await login(user);
                console.log(data.data);

            if (data.success) {
                const token = data.data.token;
                localStorage.setItem("token", token);

                alert(data.message);

                window.location.href = "chat.html";

            } else {
                alert(data.message);
            }
    
        } catch (error) {
             console.error(error);
    
            alert("Une erreur est survenue. Veuillez réessayer.");
    
        }
})
