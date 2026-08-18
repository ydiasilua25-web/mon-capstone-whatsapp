# Capstone-1-Kadea-Chat-Clone-Whatsapp-Web-

> Application web de messagerie instantanée développée dans le cadre du projet final du deuxieme module JavaScript chez Kadea.

![Kadea Chat](https://img.shields.io/badge/Kadea-Chat-2563EB?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

---

## 📌 Présentation

**Kadea Chat** est une application web de messagerie inspirée des interfaces modernes telles que WhatsApp.

L'application permet à un utilisateur de créer un compte, se connecter, accéder à son espace de discussion, gérer ses messages et consulter ou modifier son profil.

Ce projet a été réalisé afin de mettre en pratique les principales notions étudiées durant le module JavaScript, notamment la manipulation du DOM, les événements, les appels API REST, les Promises, `async/await`, l'authentification et le stockage côté client.

---

## 🎯 Objectifs

Les objectifs principaux du projet sont :

- Créer une interface de messagerie moderne et responsive
- Mettre en place une inscription utilisateur
- Mettre en place un système de connexion
- Communiquer avec une API REST
- Récupérer et envoyer des données avec `fetch()`
- Manipuler dynamiquement le DOM
- Gérer les opérations asynchrones avec `async/await`
- Gérer l'authentification avec un token
- Afficher et gérer les conversations
- Permettre l'envoi, la modification et la suppression des messages
- Afficher et modifier les informations du profil
- Organiser le code JavaScript de manière modulaire

---

## ✨ Fonctionnalités

### 🔐 Authentification

- Création d'un compte
- Connexion utilisateur
- Gestion du token d'authentification
- Accès aux ressources protégées
- Déconnexion

### 💬 Messagerie

- Affichage des conversations
- Sélection d'une conversation
- Affichage des messages
- Envoi de messages
- Modification des messages
- Suppression des messages
- Recherche de conversations

### 👤 Profil

- Affichage des informations utilisateur
- Affichage de l'avatar
- Affichage de l'adresse email
- Affichage des informations du compte
- Modification du profil
- Déconnexion

### 📱 Responsive Design

L'application est conçue pour fonctionner sur différents types d'écrans :

- 📱 Mobile
- 📲 Tablette
- 💻 Ordinateur
- 🖥️ Desktop

---

## 🛠️ Technologies

| Technologie | Utilisation |
|---|---|
| **HTML5** | Structure des pages |
| **Tailwind CSS** | Design et responsive |
| **JavaScript Vanilla** | Logique de l'application |
| **Fetch API** | Communication avec le serveur |
| **Async / Await** | Gestion des opérations asynchrones |
| **REST API** | Gestion des données |
| **JSON** | Format des données échangées |
| **LocalStorage** | Stockage côté client |
| **Git** | Gestion des versions |
| **GitHub** | Hébergement du repository |

---

## 🏗️ Architecture du projet

```text
Kadea Chat
│
├── assets/
│   └── avatars/
│
├── dist/
│   └── output.css
│
├── src/
│   └── input.css
│
├── js/
│   │
│   ├── services/
│   │   └── authService.js
│   │
│   └── ui/
│       ├── register.js
│       ├── login.js
│       ├── chat.js
│       └── profile.js
│
├── register.html
├── index.html
├── chat.html
├── profile.html
│
├── package.json
├── package-lock.json
└── README.md
