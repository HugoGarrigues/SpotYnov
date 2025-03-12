// 🔍 Fonction pour récupérer les utilisateurs depuis localStorage
const getUsers = () => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

// 📝 Fonction pour sauvegarder les utilisateurs dans localStorage
const saveUsers = (users: any[]) => {
  localStorage.setItem("users", JSON.stringify(users));
};

// 🔐 Hachage du mot de passe avec l'API Web Crypto
const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
};

// 🆕 Fonction d'inscription
export const registerUser = async (username: string, password: string) => {
  const users = getUsers();

  // Vérifier si le pseudo existe déjà
  if (users.some((user: any) => user.username === username)) {
    return { success: false, message: "Ce pseudo est déjà utilisé" };
  }

  // Hasher le mot de passe
  const hashedPassword = await hashPassword(password);

  // Ajouter un nouvel utilisateur
  const newUser = { username, password: hashedPassword };
  users.push(newUser);
  saveUsers(users);

  return { success: true, message: "Inscription réussie !" };
};

// 🔑 Fonction de connexion
export const loginUser = async (username: string, password: string) => {
  const users = getUsers();
  const hashedPassword = await hashPassword(password);

  // Vérifier si l'utilisateur existe
  const user = users.find((u: any) => u.username === username && u.password === hashedPassword);

  if (!user) {
    return { success: false, message: "Pseudo ou mot de passe incorrect" };
  }

  return { success: true, token: "fake-auth-token" };
};
