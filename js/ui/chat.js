import {
    getProfile,
    getConversations,
    getUsers,
    createConversation,
    getConversationMessages,
    sendMessage,
    updateMessage,
    deleteMessage
} from "../services/authService.js";

import { showToast } from "./toast.js";

/* =========================
   ELEMENTS
========================= */
const currentUserName = document.querySelector("#currentUserName");
const conversationList = document.querySelector("#conversationList");
const messagesContainer = document.querySelector("#messagesContainer");
const messageInput = document.querySelector("#messageInput");
const sendMessageBtn = document.querySelector("#sendMessageBtn");

const chatUserName = document.querySelector("#chatUserName");
const chatUserBio = document.querySelector("#chatUserBio");
const chatUserImg = document.querySelector("#chatUserImg");
const chatProfileAvatar = document.querySelector("#chatProfileAvatar");

const conversationPanel = document.querySelector("#conversationPanel");
const chatPanel = document.querySelector("#chatPanel");
const backButton = document.querySelector("#backButton");
const chatButton = document.querySelector("#chatButton");
const profileButton = document.querySelector("#profileButton");
const themeButton = document.querySelector("#themeButton");
const themeIcon = document.querySelector("#themeIcon");
const bottomNav = document.querySelector("#bottomNav");

const token = localStorage.getItem("token");
const savedTheme = localStorage.getItem("theme");

let currentUser = null;
let activeConversationId = null;
let existingContactIds = new Set();
let isLoadingMessages = false;
let isSendingMessage = false;

/* =========================
   AUTHENTICATION / THEME
========================= */
if (!token) {
    window.location.href = "index.html";
}

if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
}

const moonIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
</svg>`;

const sunIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
    <circle cx="12" cy="12" r="5" stroke-width="2"/>
    <path stroke-linecap="round" stroke-width="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
</svg>`;

function updateThemeIcon() {
    if (!themeIcon) return;
    themeIcon.innerHTML = document.documentElement.classList.contains("dark")
        ? sunIcon
        : moonIcon;
}

updateThemeIcon();

/* =========================
   RESPONSIVE VIEW
========================= */
function isMobile() {
    return window.innerWidth < 768;
}

function showConversationList() {
    conversationPanel.classList.remove("hidden");
    conversationPanel.classList.add("flex");

    if (isMobile()) {
        chatPanel.classList.add("hidden");
        chatPanel.classList.remove("flex");
        bottomNav.classList.remove("hidden");
    }
}

function showChatView() {
    if (isMobile()) {
        conversationPanel.classList.add("hidden");
        conversationPanel.classList.remove("flex");
        chatPanel.classList.remove("hidden");
        chatPanel.classList.add("flex");
        bottomNav.classList.add("hidden");
    } else {
        chatPanel.classList.remove("hidden");
        chatPanel.classList.add("flex");
    }
}

function handleResponsiveView() {
    if (isMobile()) {
        if (activeConversationId) {
            showChatView();
        } else {
            showConversationList();
        }
    } else {
        conversationPanel.classList.remove("hidden");
        conversationPanel.classList.add("flex");
        chatPanel.classList.remove("hidden");
        chatPanel.classList.add("flex");
        bottomNav.classList.add("hidden");
    }
}

/* =========================
   PROFILE
========================= */
async function loadProfile() {
    try {
        const data = await getProfile();

        if (!data.success) {
            showToast(data.message || "Impossible de charger votre profil.", "error");
            localStorage.removeItem("token");
            window.location.href = "index.html";
            return false;
        }

        currentUser = data.data;
        const user = data.data.user;

        currentUserName.textContent = user.fullName || "Utilisateur";
        chatProfileAvatar.src = user.avatarUrl || "assets/avatars/default-avatar.jpg";

        return true;
    } catch (error) {
        console.error("Erreur profil :", error);
        showToast("Une erreur est survenue lors du chargement du profil.", "error");
        return false;
    }
}

/* =========================
   CONVERSATION HELPERS
========================= */
function setChatUser(user) {
    chatUserName.textContent = user.fullName || "Utilisateur";
    chatUserBio.textContent = user.bio || "En ligne";
    chatUserImg.src = user.avatarUrl || "assets/avatars/default-avatar.jpg";
}

function clearChat() {
    activeConversationId = null;
    localStorage.removeItem("activeConversationId");

    chatUserName.textContent = "Sélectionnez une conversation";
    chatUserBio.textContent = "";
    chatUserImg.removeAttribute("src");

    messagesContainer.innerHTML = `
        <div class="h-full flex items-center justify-center text-center px-6">
            <div>
                <p class="text-slate-400 dark:text-slate-500 text-sm">
                    Sélectionnez une conversation pour commencer à discuter.
                </p>
            </div>
        </div>
    `;

    messageInput.value = "";
    messageInput.disabled = true;
    sendMessageBtn.disabled = true;
    sendMessageBtn.classList.add("opacity-50", "cursor-not-allowed");
}

function enableMessageInput() {
    messageInput.disabled = false;
    sendMessageBtn.disabled = false;
    sendMessageBtn.classList.remove("opacity-50", "cursor-not-allowed");
}

function scrollMessagesToBottom() {
    requestAnimationFrame(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}

/* =========================
   LOAD CONVERSATIONS
========================= */
async function loadConversations() {
    try {
        const data = await getConversations();

        if (!data.success) {
            showToast(data.message || "Impossible de charger vos discussions.", "error");
            return;
        }

        conversationList.innerHTML = "";
        existingContactIds = new Set();

        const conversations = data.data?.conversations || [];

        if (conversations.length === 0) {
            const empty = document.createElement("p");
            empty.className = "text-center text-slate-400 dark:text-slate-500 text-xs py-8 px-4";
            empty.textContent = "Aucune conversation pour le moment.";
            conversationList.appendChild(empty);
        }

        conversations.forEach((conversation) => {
            if (!conversation.participants || conversation.participants.length < 2) return;

            const otherParticipant = conversation.participants.find(
                (participant) => participant.user.id !== currentUser.user.id
            );

            if (!otherParticipant) return;

            const otherUser = otherParticipant.user;
            existingContactIds.add(otherUser.id);

            const messages = conversation.messages || [];
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

            const conversationCard = document.createElement("button");
            conversationCard.type = "button";
            conversationCard.className = `
                w-full text-left flex items-center gap-3 p-3
                hover:bg-slate-50 dark:hover:bg-slate-800
                rounded-xl cursor-pointer transition-colors
                ${activeConversationId === conversation.id ? "bg-blue-50 dark:bg-blue-900/30" : ""}
            `;

            const avatar = document.createElement("img");
            avatar.src = otherUser.avatarUrl || "assets/avatars/default-avatar.jpg";
            avatar.alt = otherUser.fullName || "Utilisateur";
            avatar.className = "w-11 h-11 rounded-full object-cover flex-shrink-0";

            const content = document.createElement("div");
            content.className = "flex-1 min-w-0";

            const name = document.createElement("h3");
            name.className = "font-medium text-sm text-slate-700 dark:text-slate-200 truncate";
            name.textContent = otherUser.fullName || "Utilisateur";

            const preview = document.createElement("p");
            preview.className = "text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5";
            preview.textContent = lastMessage?.content || "Aucun message";

            content.append(name, preview);
            conversationCard.append(avatar, content);

            conversationCard.addEventListener("click", () => {
                openConversation(conversation.id, otherUser);
            });

            conversationList.appendChild(conversationCard);
        });
    } catch (error) {
        console.error("Erreur conversations :", error);
        showToast("Une erreur est survenue lors du chargement des discussions.", "error");
    }
}

/* =========================
   LOAD USERS
========================= */
async function loadUsers() {
    try {
        const data = await getUsers();

        if (!data.success) {
            showToast(data.message || "Impossible de charger les utilisateurs.", "error");
            return;
        }

        const users = data.data?.users || [];
        const newContacts = users.filter(
            (user) => user.id !== currentUser.user.id && !existingContactIds.has(user.id)
        );

        if (newContacts.length === 0) return;

        const sectionLabel = document.createElement("p");
        sectionLabel.className = "text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase px-3 pt-4 pb-1";
        sectionLabel.textContent = "Autres utilisateurs";
        conversationList.appendChild(sectionLabel);

        newContacts.forEach((user) => {
            const userCard = document.createElement("button");
            userCard.type = "button";
            userCard.className = "w-full text-left flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors";

            const avatar = document.createElement("img");
            avatar.src = user.avatarUrl || "assets/avatars/default-avatar.jpg";
            avatar.alt = user.fullName || "Utilisateur";
            avatar.className = "w-11 h-11 rounded-full object-cover flex-shrink-0";

            const content = document.createElement("div");
            content.className = "flex-1 min-w-0";

            const name = document.createElement("h3");
            name.className = "font-medium text-sm text-slate-700 dark:text-slate-200 truncate";
            name.textContent = user.fullName || "Utilisateur";

            const bio = document.createElement("p");
            bio.className = "text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5";
            bio.textContent = user.bio || "Aucune bio";

            content.append(name, bio);
            userCard.append(avatar, content);

            userCard.addEventListener("click", () => startConversation(user));
            conversationList.appendChild(userCard);
        });
    } catch (error) {
        console.error("Erreur utilisateurs :", error);
        showToast("Une erreur est survenue lors du chargement des utilisateurs.", "error");
    }
}

/* =========================
   OPEN EXISTING CONVERSATION
========================= */
async function openConversation(conversationId, user) {
    if (!conversationId) return;

    try {
        activeConversationId = conversationId;
        localStorage.setItem("activeConversationId", conversationId);

        setChatUser(user);
        enableMessageInput();
        showChatView();

        messagesContainer.innerHTML = `
            <div class="h-full flex items-center justify-center">
                <p class="text-xs text-slate-400 dark:text-slate-500">Chargement des messages...</p>
            </div>
        `;

        const messagesData = await getConversationMessages(activeConversationId);

        if (!messagesData.success && !Array.isArray(messagesData.messages)) {
            throw new Error(messagesData.message || "Impossible de récupérer les messages.");
        }

        displayMessages(messagesData.messages || [], true);
    } catch (error) {
        console.error("Erreur ouverture discussion :", error);
        showToast("Impossible d'ouvrir cette discussion.", "error");
        activeConversationId = null;
        localStorage.removeItem("activeConversationId");
        showConversationList();
    }
}

/* =========================
   CREATE CONVERSATION
========================= */
async function startConversation(user) {
    try {
        const conversation = {
            type: "private",
            participantIds: [currentUser.user.id, user.id]
        };

        const data = await createConversation(conversation);

        if (!data.success) {
            showToast(data.message || "Impossible de démarrer la discussion.", "error");
            return;
        }

        const conversationId = data.data?.conversation?.id;

        if (!conversationId) {
            throw new Error("L'identifiant de la conversation est absent.");
        }

        await openConversation(conversationId, user);
        await loadConversations();
    } catch (error) {
        console.error("Erreur création discussion :", error);
        showToast("Impossible de démarrer cette discussion.", "error");
    }
}

/* =========================
   DISPLAY MESSAGES
========================= */
function closeAllMessageMenus() {
    document.querySelectorAll(".message-menu").forEach((menu) => {
        menu.classList.add("hidden");
    });
}


function getMessageDate(msg) {
    const rawDate = msg.createdAt || msg.sentAt || msg.timestamp || msg.date || msg.updatedAt;
    if (!rawDate) return null;

    const date = new Date(rawDate);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatMessageTime(msg) {
    const date = getMessageDate(msg);
    if (!date) return "";

    return new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

function formatMessageDate(date) {
    if (!date) return "";

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    if (isSameDay(date, today)) return "Aujourd’hui";
    if (isSameDay(date, yesterday)) return "Hier";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined
    }).format(date);
}

function createDateSeparator(date) {
    const separator = document.createElement("div");
    separator.className = "flex justify-center py-2";

    const label = document.createElement("span");
    label.className = "text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-3 py-1 rounded-full font-medium shadow-sm";
    label.textContent = formatMessageDate(date);

    separator.appendChild(label);
    return separator;
}

function createAppModal({ title, message, inputValue = null, confirmText = "Confirmer", danger = false, onConfirm }) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm px-4";

    const modal = document.createElement("div");
    modal.className = "w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-5";

    const heading = document.createElement("h3");
    heading.className = "text-base font-semibold text-slate-800 dark:text-white";
    heading.textContent = title;

    const description = document.createElement("p");
    description.className = "mt-2 text-sm text-slate-500 dark:text-slate-400";
    description.textContent = message;

    modal.append(heading, description);

    let input = null;
    if (inputValue !== null) {
        input = document.createElement("textarea");
        input.className = "mt-4 w-full min-h-28 resize-y rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30";
        input.value = inputValue;
        input.maxLength = 2000;
        modal.appendChild(input);
    }

    const actions = document.createElement("div");
    actions.className = "mt-5 flex justify-end gap-2";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors";
    cancelButton.textContent = "Annuler";

    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.className = danger
        ? "px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
        : "px-4 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors";
    confirmButton.textContent = confirmText;

    actions.append(cancelButton, confirmButton);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();

    cancelButton.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) close();
    });

    confirmButton.addEventListener("click", async () => {
        confirmButton.disabled = true;
        confirmButton.classList.add("opacity-60", "cursor-not-allowed");
        await onConfirm(input ? input.value : null, close, confirmButton);
    });

    if (input) {
        requestAnimationFrame(() => {
            input.focus();
            input.select();
        });
    }
}

function createMessageElement(msg) {
    const isMe = msg.senderId === currentUser.user.id;

    const row = document.createElement("div");
    row.className = `flex min-w-0 ${isMe ? "justify-end" : "justify-start"} mb-3`;

    const wrapper = document.createElement("div");
    wrapper.className = `relative min-w-0 w-auto max-w-[78%] sm:max-w-[65%] ${isMe ? "ml-auto" : "mr-auto"}`;

    const bubble = document.createElement("div");
    bubble.className = `
        min-w-0 w-fit max-w-full rounded-2xl px-3 sm:px-4 py-2
        text-sm shadow-sm overflow-hidden
        ${isMe
            ? "bg-emerald-500 text-white rounded-tr-none"
            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none"
        }
    `;

    const text = document.createElement("p");
    text.className = "min-w-0 max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed";
    text.textContent = msg.content || "";
    bubble.appendChild(text);

    const time = document.createElement("span");
    time.className = `block text-right mt-1 text-[9px] sm:text-[10px] leading-none whitespace-nowrap ${isMe ? "text-emerald-100" : "text-slate-400 dark:text-slate-500"}`;
    time.textContent = formatMessageTime(msg);
    if (time.textContent) bubble.appendChild(time);

    let menu = null;

    if (isMe) {
        const menuButton = document.createElement("button");
        menuButton.type = "button";
        menuButton.className = "message-menu-button flex-shrink-0 text-emerald-950/70 hover:text-emerald-950 dark:text-white/80 dark:hover:text-white p-1 rounded";
        menuButton.title = "Options";
        menuButton.textContent = "⋮";

        menu = document.createElement("div");
        menu.className = "message-menu hidden absolute right-0 top-full mt-1 min-w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-message block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700";
        editButton.textContent = "Modifier";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-message block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700";
        deleteButton.textContent = "Supprimer";

        menu.append(editButton, deleteButton);
        wrapper.append(bubble, menu);

        menuButton.addEventListener("click", (event) => {
            event.stopPropagation();
            const wasOpen = !menu.classList.contains("hidden");
            closeAllMessageMenus();
            if (!wasOpen) menu.classList.remove("hidden");
        });

        editButton.addEventListener("click", async (event) => {
            event.stopPropagation();
            menu.classList.add("hidden");
            await editMessage(msg);
        });

        deleteButton.addEventListener("click", async (event) => {
            event.stopPropagation();
            menu.classList.add("hidden");
            await removeMessage(msg);
        });
    } else {
        wrapper.appendChild(bubble);
    }

    row.appendChild(wrapper);
    return row;
}

function displayMessages(messagesList, forceScrollToBottom = false) {
    const distanceFromBottom =
        messagesContainer.scrollHeight -
        messagesContainer.scrollTop -
        messagesContainer.clientHeight;

    const wasAtBottom = distanceFromBottom <= 40;

    messagesContainer.innerHTML = "";

    if (!messagesList || messagesList.length === 0) {
        const empty = document.createElement("div");
        empty.className = "h-full flex items-center justify-center text-center px-6";

        const text = document.createElement("p");
        text.className = "text-slate-400 dark:text-slate-500 text-xs";
        text.textContent = "Aucun message. Dites bonjour !";

        empty.appendChild(text);
        messagesContainer.appendChild(empty);
        return;
    }

    const fragment = document.createDocumentFragment();
    let previousDayKey = null;

    messagesList.forEach((msg) => {
        const date = getMessageDate(msg);
        const dayKey = date
            ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            : null;

        if (date && dayKey !== previousDayKey) {
            fragment.appendChild(createDateSeparator(date));
            previousDayKey = dayKey;
        }

        fragment.appendChild(createMessageElement(msg));
    });

    messagesContainer.appendChild(fragment);

    requestAnimationFrame(() => {
        if (forceScrollToBottom || wasAtBottom) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            return;
        }

        const maxScrollTop =
            messagesContainer.scrollHeight - messagesContainer.clientHeight;

        messagesContainer.scrollTop = Math.max(
            0,
            maxScrollTop - distanceFromBottom
        );
    });
}

/* =========================
   EDIT / DELETE
========================= */
async function editMessage(msg) {
    createAppModal({
        title: "Modifier le message",
        message: "Modifiez votre message puis validez.",
        inputValue: msg.content || "",
        confirmText: "Enregistrer",
        onConfirm: async (value, close, button) => {
            const updatedContent = (value || "").trim();

            if (!updatedContent) {
                showToast("Le message ne peut pas être vide.", "error");
                button.disabled = false;
                button.classList.remove("opacity-60", "cursor-not-allowed");
                return;
            }

            try {
                const data = await updateMessage(msg.id, updatedContent);

                if (!data.success) {
                    showToast(data.message || "Impossible de modifier le message.", "error");
                    button.disabled = false;
                    button.classList.remove("opacity-60", "cursor-not-allowed");
                    return;
                }

                close();
                await refreshMessages(false);
                await loadConversations();
                showToast("Message modifié.", "success");
            } catch (error) {
                console.error("Erreur modification :", error);
                showToast("Une erreur est survenue lors de la modification.", "error");
                button.disabled = false;
                button.classList.remove("opacity-60", "cursor-not-allowed");
            }
        }
    });
}

async function removeMessage(msg) {
    createAppModal({
        title: "Supprimer le message",
        message: "Voulez-vous vraiment supprimer ce message ? Cette action est irréversible.",
        confirmText: "Supprimer",
        danger: true,
        onConfirm: async (_value, close, button) => {
            try {
                const data = await deleteMessage(msg.id);

                if (!data.success) {
                    showToast(data.message || "Impossible de supprimer le message.", "error");
                    button.disabled = false;
                    button.classList.remove("opacity-60", "cursor-not-allowed");
                    return;
                }

                close();
                await refreshMessages(false);
                await loadConversations();
                showToast("Message supprimé.", "success");
            } catch (error) {
                console.error("Erreur suppression :", error);
                showToast("Une erreur est survenue lors de la suppression.", "error");
                button.disabled = false;
                button.classList.remove("opacity-60", "cursor-not-allowed");
            }
        }
    });
}

/* =========================
   REFRESH MESSAGES
========================= */
async function refreshMessages(keepScrollAtBottom = true) {
    if (!activeConversationId || isLoadingMessages) return;

    isLoadingMessages = true;

    try {
        const messagesData = await getConversationMessages(activeConversationId);
        const messages = messagesData.messages || [];

        displayMessages(messages, keepScrollAtBottom);
    } catch (error) {
        console.error("Erreur actualisation messages :", error);
    } finally {
        isLoadingMessages = false;
    }
}

/* =========================
   SEND MESSAGE
========================= */
async function handleSendMessage() {
    if (isSendingMessage) return;

    const text = messageInput.value.trim();

    if (!text || !activeConversationId) return;

    isSendingMessage = true;
    sendMessageBtn.disabled = true;
    sendMessageBtn.classList.add("opacity-50", "cursor-not-allowed");

    try {
        const data = await sendMessage(activeConversationId, text);

        if (!data.success) {
            showToast(data.message || "Impossible d'envoyer le message.", "error");
            return;
        }

        messageInput.value = "";

        const updatedMessages = await getConversationMessages(activeConversationId);
        // Après l'envoi, on revient volontairement au dernier message.
        displayMessages(updatedMessages.messages || [], true);
        await loadConversations();
    } catch (error) {
        console.error("Erreur envoi message :", error);
        showToast("Une erreur est survenue lors de l'envoi du message.", "error");
    } finally {
        isSendingMessage = false;
        enableMessageInput();
        messageInput.focus();
    }
}

/* =========================
   EVENTS
========================= */
sendMessageBtn.addEventListener("click", handleSendMessage);

messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        handleSendMessage();
    }
});

document.addEventListener("click", closeAllMessageMenus);

backButton.addEventListener("click", () => {
    if (!isMobile()) return;

    clearChat();
    showConversationList();
});

chatButton.addEventListener("click", () => {
    if (!isMobile()) return;
    clearChat();
    showConversationList();
});

profileButton.addEventListener("click", () => {
    window.location.href = "profile.html";
});

window.addEventListener("resize", handleResponsiveView);

themeButton.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
        "theme",
        document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
    updateThemeIcon();
});

/* =========================
   INITIALIZATION
========================= */
async function init() {
    const profileLoaded = await loadProfile();

    if (!profileLoaded) return;

    clearChat();
    handleResponsiveView();

    await loadConversations();
    await loadUsers();
}

init();

// Actualise les messages toutes les 2 secondes uniquement dans une conversation.
setInterval(() => {
    if (activeConversationId) {
        refreshMessages(false);
    }
}, 2000);
