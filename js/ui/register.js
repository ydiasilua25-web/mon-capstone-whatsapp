const form = document.querySelector("#registerForm");

const fullNameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log("Le formulaire a été envoyé !");

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
console.log(user);
});
