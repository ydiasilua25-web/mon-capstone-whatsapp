import { getCurrentUser, logout, updateProfile } from "../services/authService.js";
import { uploadImage } from "../services/cloudinaryService.js";
import { showToast } from "./toast.js";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
}

const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const logoutButton = document.getElementById("logoutButton");
const chatButton = document.getElementById("chatButton");

const editProfileButton = document.getElementById("editProfileButton");
const editProfileModal = document.getElementById("editProfileModal");
const cancelEdit = document.getElementById("cancelEdit");
const saveProfile = document.getElementById("saveProfile");
const editFullName = document.getElementById("editFullName");
const editAvatar = document.getElementById("editAvatar");
const editBio = document.getElementById("editBio");

async function loadCurrentUserProfile() {
    try {
        const data = await getCurrentUser();

        if (data.success) {
            const user = data.data.user;

            profileName.textContent = user.fullName;
            profileEmail.textContent = user.email;

            if (user.avatarUrl) {
                profileAvatar.src = user.avatarUrl;
            }
        } else {
            showToast(data.message || "Impossible de charger votre profil.", "error");
        }
    } catch (error) {
        console.error(error);
        showToast("Une erreur est survenue lors du chargement du profil.", "error");
    }
}

loadCurrentUserProfile();

logoutButton.addEventListener("click", async () => {
    try {
        const data = await logout();

        if (data.success) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
        } else {
            showToast(data.message || "Impossible de vous déconnecter.", "error");
        }
    } catch (error) {
        console.error(error);
        showToast("Une erreur est survenue lors de la déconnexion.", "error");
    }
});

// Bouton "Éditer le profil"
editProfileButton.addEventListener("click", async () => {
    try {
        const data = await getCurrentUser();

        if (data.success) {
            const user = data.data.user;

            editFullName.value = user.fullName || "";
            editBio.value = user.bio || "";
        }

        editProfileModal.classList.remove("hidden");
        editProfileModal.classList.add("flex");
    } catch (error) {
        console.error(error);
        showToast("Impossible de charger les informations du profil.", "error");
    }
});

// Fermer la modale d'édition
cancelEdit.addEventListener("click", () => {
    editProfileModal.classList.add("hidden");
    editProfileModal.classList.remove("flex");
});

// Enregistrer les modifications du profil
saveProfile.addEventListener("click", async () => {
    try {
        let avatarUrl = "";

        if (editAvatar.files.length > 0) {
            const image = await uploadImage(editAvatar.files[0]);
            avatarUrl = image.secure_url;
        }

        const user = {
            fullName: editFullName.value.trim(),
            bio: editBio.value.trim()
        };

        if (avatarUrl !== "") {
            user.avatarUrl = avatarUrl;
        }

        const data = await updateProfile(user);

        if (data.success) {
            showToast(data.message || "Profil mis à jour avec succès.", "success");

            editProfileModal.classList.add("hidden");
            editProfileModal.classList.remove("flex");

            loadCurrentUserProfile();
        } else {
            showToast(data.message || "Impossible de mettre à jour le profil.", "error");
        }
    } catch (error) {
        console.error(error);
        showToast("Une erreur est survenue.", "error");
    }
});

chatButton.addEventListener("click", () => {
    window.location.href = "chat.html";
});
