import { login} from "../services/authService.js";

const form = document.querySelector("#loginForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password")

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
    
            if (data.success) {
                const token = data.data.token;
                localStorage.setItem("token", token);
                //const token = localStorage.getItem("token");

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
