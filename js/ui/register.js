const form = document.querySelector("#registerForm");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log("Le formulaire a été envoyé !");
});
