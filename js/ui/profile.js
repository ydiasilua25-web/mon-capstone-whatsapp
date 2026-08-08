import {
    getCurrentUser,
    logout,
    updateProfile
}  from "../services/authService.js";

import { uploadImage } from "../services/cloudinaryService.js";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileMemberSince = document.getElementById("profileMemberSince");
const logoutButton = document.getElementById("logoutButton");

const profileUsername = document.getElementById("profileUsername");
const profilePhone = document.getElementById("profilePhone");
const profileLanguage = document.getElementById("profileLanguage");

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

        console.log(data);

        if (data.success) {

            const user = data.data.user;

            profileName.textContent = user.fullName;

            profileEmail.textContent = user.email;

            if (user.avatarUrl) {
                profileAvatar.src = user.avatarUrl;
            }

        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error(error);
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

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

    }

});

//Bouton Editer la profile
editProfileButton.addEventListener("click", async () => {

    try {

        const data = await getCurrentUser();
             console.log(data);
        if (data.success) {

            const user = data.data.user;
            console.log(user);

            editFullName.value = user.fullName || "";
            editBio.value = user.bio || "";

        }

        editProfileModal.classList.remove("hidden");
        editProfileModal.classList.add("flex");

    } catch (error) {

        console.error(error);

    }

});

// Bouton d'enregistrement modification du profile
cancelEdit.addEventListener("click", () => {

    editProfileModal.classList.add("hidden");
    editProfileModal.classList.remove("flex");

});

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
        console.log(data);

        if (data.success) {

            alert(data.message);

            editProfileModal.classList.add("hidden");
            editProfileModal.classList.remove("flex");

            loadCurrentUserProfile();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Une erreur est survenue.");

    }

});

chatButton.addEventListener("click", () => {

    window.location.href = "chat.html";

});

