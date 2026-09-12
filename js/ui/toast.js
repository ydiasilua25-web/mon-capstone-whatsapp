// toast.js
// Petit utilitaire pour afficher des messages temporaires à l'écran,
// à la place des alert() natifs du navigateur.

let toastContainer = null;

function getToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toastContainer";
        toastContainer.className =
            "fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none";
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

/**
 * Affiche un message temporaire à l'utilisateur.
 * @param {string} message - Le texte à afficher.
 * @param {"success"|"error"|"info"} [type="info"] - Le style du message.
 * @param {number} [duration=3000] - Durée d'affichage en millisecondes.
 */
export function showToast(message, type = "info", duration = 3000) {
    const container = getToastContainer();

    const styles = {
        success: "bg-emerald-500 text-white",
        error: "bg-red-500 text-white",
        info: "bg-slate-700 text-white",
    };

    const toast = document.createElement("div");
    toast.className = `pointer-events-auto max-w-xs w-full px-4 py-3 rounded-xl shadow-lg text-sm transition-all duration-300 opacity-0 translate-x-4 ${
        styles[type] || styles.info
    }`;
    toast.textContent = message;

    container.appendChild(toast);

    // Animation d'entrée
    requestAnimationFrame(() => {
        toast.classList.remove("opacity-0", "translate-x-4");
    });

    // Retrait automatique après "duration" ms
    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-x-4");
        setTimeout(() => toast.remove(), 300);
    }, duration);
}
