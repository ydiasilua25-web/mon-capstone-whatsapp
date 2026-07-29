import { 
    getProfile , 
    getConversations , 
    getUsers , 
    createConversation ,
    getConversationMessages,
    sendMessage
} from "../services/authService.js";

const currentUserName = document.querySelector("#currentUserName");
const currentUserStatus = document.querySelector("#currentUserStatus");
const conversationList = document.querySelector("#conversationList");
const messagesContainer = document.querySelector("#messagesContainer");
const messageInput = document.querySelector("#messageInput");
const sendMessageBtn = document.querySelector("#sendMessageBtn");
const chatUserName = document.getElementById("chatUserName");
const chatUserBio = document.getElementById("chatUserBio");
const chatUserImg = document.getElementById("chatUserImg");
const chatProfileAvatar = document.getElementById("chatProfileAvatar");
const chatProfileName = document.getElementById("currentUserName");
const conversationPanel = document.getElementById("conversationPanel");
const chatPanel = document.getElementById("chatPanel");
const backButton = document.getElementById("backButton");
const chatButton = document.getElementById("chatButton");
const profileButton = document.getElementById("profileButton");
const themeButton = document.getElementById("themeButton");
const themeIcon = document.getElementById("themeIcon");

const token = localStorage.getItem("token");
const savedTheme = localStorage.getItem("theme");

let currentUser = null;
let activeConversationId = null; // Variable globale pour stocker la conversation en cours

if (!token) {
    window.location.href = "index.html";
}

if (savedTheme === "dark") {

    document.documentElement.classList.add("dark");

}

const moonIcon = `
<svg xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    class="w-6 h-6">
    <path stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 12.79A9 9 0 1111.21 3
        7 7 0 0021 12.79z"/>
</svg>
`;

const sunIcon = `
<svg xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    class="w-6 h-6">
    <circle cx="12" cy="12" r="5" stroke-width="2"/>
    <path stroke-linecap="round" stroke-width="2"
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
</svg>
`;

updateThemeIcon();
//charger la profile de User.
async function loadProfile() {

    try {

        const data = await getProfile();

        if (data.success) {

            currentUser = data.data;

            const user = data.data.user;

            // Nom dans la sidebar
            currentUserName.textContent = user.fullName;

            // Nom sous la photo du profil
            chatProfileName.textContent = user.fullName;

            // Avatar
            if (user.avatarUrl) {

                chatProfileAvatar.src = user.avatarUrl;

            } else {

                chatProfileAvatar.src = "assets/avatars/default-avatar.jpg";

            }

        } else {

            alert(data.message);

            localStorage.removeItem("token");

            window.location.href = "index.html";

        }

    } catch (error) {

        console.error(error);

    }

}
//Gerer les deux faces du chat
function handleMobileView() {
    if (window.innerWidth < 640) {
        conversationPanel.classList.remove("hidden");
        conversationPanel.classList.add("flex");

        chatPanel.classList.add("hidden");
    }
}


//charger les conversations.
async function loadConversations() {
    try {
        const data = await getConversations();

       if (data.success) {
        conversationList.innerHTML = "";
        data.data.conversations.forEach((conversation) => {

            if (conversation.participants.length < 2) {
                return;
            }
            const otherParticipant = conversation.participants.find(
            (participant) => participant.user.id !== currentUser.user.id
            );
            console.log(conversation.messages);           
            const lastMessage = conversation.messages.at(-1);
            const conversationCard = document.createElement("div");

            conversationCard.className =
                "flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors";

            conversationCard.innerHTML = `
                <div class="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    ${otherParticipant.user.fullName.charAt(0).toUpperCase()}
                </div>

                <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-sm text-slate-700 truncate">
                        ${otherParticipant.user.fullName}
                    </h3>

                   <p class="text-xs text-slate-500 truncate">
                        ${lastMessage ? lastMessage.content : "Aucun message"}
                    </p>
                </div>
            `;
            conversationCard.addEventListener("click", async () => {
                try {
                    activeConversationId = conversation.id;

                    if (window.innerWidth < 640) {
                        conversationPanel.classList.add("hidden");

                        chatPanel.classList.remove("hidden");
                        chatPanel.classList.add("flex");
                    }

                    chatUserName.textContent = otherParticipant.user.fullName;
                    chatUserBio.textContent = otherParticipant.user.bio || "Aucun bio";
                    
                    if (otherParticipant.user.avatarUrl) {
                        chatUserImg.src = otherParticipant.user.avatarUrl;
                    } else {
                        chatUserImg.src = "assets/avatars/default-avatar.jpg"
                    }

                    const messagesData = await getConversationMessages(activeConversationId);
                    displayMessages(messagesData.messages);
                          
                } catch (error) {
                    console.error("Erreur lors de la sélection de la discussion :", error);
                }

            });
                
           conversationList.appendChild(conversationCard);
        });

        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error(error);
    }

}

//charger les utilisateurs.
async function loadUsers() {
    try {      
        const data = await getUsers();

        if (data.success){
            conversationList.innerHTML = "";

            data.data.users.forEach((user) => {
            const userCard = document.createElement("div");

            userCard.className =
                "flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors";

            userCard.innerHTML = `
                <div class="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    ${user.fullName.charAt(0).toUpperCase()}
                </div>

                <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-sm text-slate-700 truncate">
                        ${user.fullName}
                    </h3>

                    <p class="text-xs text-slate-500 truncate">
                        ${user.bio || "Aucune bio"}
                    </p>
                </div>
            `;

            userCard.addEventListener("click", async () => {
                try {
                    chatUserName.textContent = user.fullName;
                    chatUserBio.textContent = user.bio || "enligne";
                    
                    if (user.avatarUrl) {
                        chatUserImg.src = user.avatarUrl;
                    } else {
                        chatUserImg.src = "assets/avatars/default-avatar.jpg"
                    }

                    const conversation = {
                        type: "private",
                        participantIds: [currentUser.user.id, user.id]
                    };
        
                    const data = await createConversation(conversation);
                       
                    if (data.success) {
                        //sauvegarde l'ID de la conversation active
                        activeConversationId = data.data.conversation.id; 
                        //récupèrer les messages de cette conversation
                        const messagesData = await getConversationMessages(activeConversationId);
            
                        //appelle la fonction pour afficher les messages à l'écran
                        displayMessages(messagesData.messages);
                    } else {
                        alert(data.message);
                    }
                } catch (error) {
                    console.error("Erreur lors de la sélection de la discussion :", error);
                }
            });
                
            conversationList.appendChild(userCard);    

        });
            

        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error(error);
    }

}

// Fonction pour afficher l'historique des messages
function displayMessages(messagesList) {
    messagesContainer.innerHTML = ""; // On vide l'écran

    // Si le tableau est vide ou non valide, on affiche le message d'accueil
    if (!messagesList || messagesList.length === 0) {
        messagesContainer.innerHTML = `<div class="text-center text-slate-400 text-xs my-auto">Aucun message. Dites bonjour !</div>`;
        return;
    }
    // On boucle directement sur la liste reçue
        messagesList.forEach((msg) => {
        const messageDiv = document.createElement("div");
        const isMe = msg.senderId === currentUser.user.id;

        messageDiv.className = `flex ${isMe ? "justify-end" : "justify-start"} mb-3`;
        messageDiv.innerHTML = `
            <div class="max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm 
            ${isMe ? "bg-emerald-500 text-gray-800 rounded-tr-none" : "bg-white text-slate-700 rounded-tl-none border"}">
                <p class="break-words">${msg.content}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Fonction pour gérer l'envoi d'un nouveau message
async function handleSendMessage() {
    const text = messageInput.value.trim();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    // Si pas de texte ou si aucune conversation n'est ouverte, on ne fait rien
    if (!text || !activeConversationId) return;

    try {
        // Appel de l'API (POST /conversations/:conversationId/messages)
        const data = await sendMessage(activeConversationId, text);

        if (data.success) {
            messageInput.value = ""; // On vide le champ de saisie
            
            // On recharge immédiatement les messages pour voir notre message apparaître
            const updatedMessages = await getConversationMessages(activeConversationId);
            displayMessages(updatedMessages.messages);

            await loadConversations();
            
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
    }
}

function updateThemeIcon() {

    if (document.documentElement.classList.contains("dark")) {

        themeIcon.innerHTML = sunIcon;

    } else {

        themeIcon.innerHTML = moonIcon;

    }

}

// Écouteur sur le bouton d'envoi
sendMessageBtn.addEventListener("click", handleSendMessage);

// Écouteur sur la touche Entrée du clavier
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSendMessage();
    }
});

// Bouton retour sur mobile
backButton.addEventListener("click", () => {
    if (window.innerWidth < 640) {
        conversationPanel.classList.remove("hidden");
        conversationPanel.classList.add("flex");

        chatPanel.classList.add("hidden");
    }
});

chatButton.addEventListener("click", () => {

    window.location.href = "chat.html";

});

profileButton.addEventListener("click", () => {

    window.location.href = "profile.html";

});
// Ecouter la redimension.
window.addEventListener("resize", () => {
    handleMobileView();
});
//Ecouter le changement des modes (sombre/claire).
themeButton.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    if (document.documentElement.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");

    } else {
        localStorage.setItem("theme", "light");

    }
    updateThemeIcon();

});

loadProfile();
handleMobileView()
loadConversations();
loadUsers();
