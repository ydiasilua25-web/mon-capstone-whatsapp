export async function register(user) {
    try {
        const response = await fetch("https://kadea-chat-api.onrender.com/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "wksp_4ff9bde48b6dafc1faaae4792a3e6677"
            },
            body: JSON.stringify({
                fullName: user.fullName,
                email: user.email,
                password: user.password
            })
        });

        const data = await response.json();
        

       if (!response.ok) {
        return data;
        }

        return data;

    } catch (error) {
        throw error;
    }
}

export async function login(user) {
     try {
        const response = await fetch("https://kadea-chat-api.onrender.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "wksp_4ff9bde48b6dafc1faaae4792a3e6677"
            },
            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });
        const data = await response.json();
        
        if (!response.ok) {
            return data;
        }

            return data;

    } catch (error) {
        throw error;
    }

}

export async function getProfile() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://kadea-chat-api.onrender.com/auth/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "wksp_4ff9bde48b6dafc1faaae4792a3e6677",
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return data;
        }

        return data;

    } catch (error) {
        throw error;
    }
}

export async function getConversations() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://kadea-chat-api.onrender.com/conversations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "wksp_4ff9bde48b6dafc1faaae4792a3e6677",
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (!response.ok){
            return data
        }

            return data;
    } catch (error) {
         throw error;
    }
}

export async function createConversation(conversation) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://kadea-chat-api.onrender.com/conversations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "wksp_4ff9bde48b6dafc1faaae4792a3e6677",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(conversation)

        });

        const data = await response.json();

         if (!response.ok) {
            return data;
        }

        return data;

    } catch (error) {
        throw error;
    }

}

export async function getUsers() {
    try {

        const token = localStorage.getItem("token");

        const response = await fetch("https://kadea-chat-api.onrender.com/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "wksp_4ff9bde48b6dafc1faaae4792a3e6677",
            Authorization: `Bearer ${token}`
            },

        });
        
        const data = await response.json();

        if (!response.ok) {
            return data;
        }

        return data;
        
    } catch (error) {
        throw error;
        
    }
 
}

// Fonction pour récupérer tous les messages d'une conversation spécifique
export async function getConversationMessages(conversationId) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`https://kadea-chat-api.onrender.com/conversations/${conversationId}/messages`, {
            method: "GET",
            headers: {
                "x-api-key": "wksp_4ff9bde48b6dafc1faaae4792a3e6677",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Impossible de récupérer les messages");
        }

        // On retourne la clé .data qui contient le tableau des messages d'après ta doc
        return data.data; 

    } catch (error) {
        console.error("Erreur dans getConversationMessages :", error);
        throw error;
    }
}

// Fonction pour envoyer un nouveau message dans une conversation spécifique
export async function sendMessage(conversationId, content) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`https://kadea-chat-api.onrender.com/conversations/${conversationId}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "wksp_4ff9bde48b6dafc1faaae4792a3e6677",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ content: content }) // Envoi du texte sous la clé 'content'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Échec de l'envoi du message");
        }

        return data; // Retourne la réponse de succès du serveur ({ success: true, ... })

    } catch (error) {
        console.error("Erreur dans sendMessage :", error);
        throw error;
    }
}
