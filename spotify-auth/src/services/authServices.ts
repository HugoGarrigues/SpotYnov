export const registerUser = async (username: string, password: string) => {
  try {
      let users = JSON.parse(localStorage.getItem("users") || "[]");

      if (users.some((u: any) => u.username === username)) {
          return { success: false, message: "Ce nom d'utilisateur est déjà pris." };
      }
      const hashedPassword = btoa(password);
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
      const hashedPassword = btoa(password);
      let user = users.find((u: any) => u.username === username && u.password === hashedPassword);
      if (!user) {
        const token = btoa(`${username}:${password}`);
          return { success: false, message: "Identifiants incorrects." };
      }
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


const USERS_FILE = "/users.json"; 

export const getUsers = async () => {
    try {
        const data = localStorage.getItem("users");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        return [];
    }
};

export const saveUsers = async (users: any) => {
    try {
        localStorage.setItem("users", JSON.stringify(users)); 
    } catch (error) {
        console.error("Erreur lors de l'enregistrement des utilisateurs :", error);
    }
};
