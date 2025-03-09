// // 🔍 Fonction pour récupérer les utilisateurs depuis localStorage
// const getUsers = () => {
//   const users = localStorage.getItem("users");
//   return users ? JSON.parse(users) : [];
// };

// // 📝 Fonction pour sauvegarder les utilisateurs dans localStorage
// const saveUsers = (users: any[]) => {
//   localStorage.setItem("users", JSON.stringify(users));
// };

// // 🔐 Hachage du mot de passe avec l'API Web Crypto
// const hashPassword = async (password: string) => {
//   const encoder = new TextEncoder();
//   const data = encoder.encode(password);
//   const hashBuffer = await crypto.subtle.digest("SHA-256", data);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
// };

export const registerUser = async (username: string, password: string) => {
  try {
      let users = JSON.parse(localStorage.getItem("users") || "[]");

      // Vérifier si l'utilisateur existe déjà
      if (users.some((u: any) => u.username === username)) {
          return { success: false, message: "Ce nom d'utilisateur est déjà pris." };
      }

      // Hacher le mot de passe
      const hashedPassword = btoa(password);

      // Ajouter l'utilisateur
      let newUser = { username, password: hashedPassword };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      return { success: true, message: "Inscription réussie !" };
  } catch (error) {
      console.error("Erreur dans registerUser():", error);
      return { success: false, message: "Erreur interne." };
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
      let users = JSON.parse(localStorage.getItem("users") || "[]");

      // Hacher le mot de passe pour la comparaison
      const hashedPassword = btoa(password);

      let user = users.find((u: any) => u.username === username && u.password === hashedPassword);

      if (!user) {
        const token = btoa(`${username}:${password}`);
          return { success: false, message: "Identifiants incorrects." };
      }

      // Stocker l'utilisateur connecté
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      return { success: true, message: "Connexion réussie !" };
  } catch (error) {
      console.error("Erreur dans loginUser():", error);
      return { success: false, message: "Erreur interne." };
  }
};

export const getLoggedInUser = () => {
  return JSON.parse(localStorage.getItem("loggedInUser") || "null");
};


const USERS_FILE = "/users.json"; // 📁 Chemin du fichier JSON où sont stockés les utilisateurs

// 📥 Récupérer la liste des utilisateurs depuis users.json
export const getUsers = async () => {
    try {
        const data = localStorage.getItem("users"); // On récupère les données depuis localStorage
        return data ? JSON.parse(data) : []; // Retourne un tableau vide si aucun utilisateur n'est enregistré
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        return [];
    }
};

// 📤 Sauvegarder la liste des utilisateurs dans users.json
export const saveUsers = async (users: any) => {
    try {
        localStorage.setItem("users", JSON.stringify(users)); // Sauvegarde dans localStorage
    } catch (error) {
        console.error("Erreur lors de l'enregistrement des utilisateurs :", error);
    }
};
