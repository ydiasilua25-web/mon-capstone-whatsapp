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

const token = localStorage.getItem("token");
let currentUser = null;
let activeConversationId = null; // Variable globale pour stocker la conversation en cours

if (!token) {
    window.location.href = "login.html";
}

//charger la profile de User.
async function loadProfile() {
    try {
        const data = await getProfile();

        if (data.success) {

            currentUser = data.data;

            currentUserName.textContent = data.data.fullName;

        } else {
            alert(data.message);
            localStorage.removeItem("token");
            window.location.href = "login.html";

        } 

    } catch (error) {
        console.error(error);
    }
}

//charger les conversations.
async function loadConversations() {
    try {
        const data = await getConversations();

       if (data.success) {
        conversationList.innerHTML = "";

       data.data.conversations.forEach((conversation) => {

        });

        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error(error);
    }

}

//charger l'utilisateur.
async function loadUsers() {
    try {
        
        const data = await getUsers();
        console.log(data);

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
                    const conversation = {
                        type: "private",
                        participantIds: [currentUser.user.id, user.id]
                    };
        
                    const data = await createConversation(conversation);
                    console.log(data);

                    if (data.success) {
                        //sauvegarde l'ID de la conversation active
                        activeConversationId = data.data.conversation.id; 
                        //récupèrer les messages de cette conversation
                        const messagesData = await getConversationMessages(activeConversationId);
                        console.log("messagesData =", messagesData);
            
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
    console.log(messagesList)
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
            
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
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

loadProfile();
loadConversations()
loadUsers();
