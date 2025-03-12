// 📂 Récupère les groupes depuis localStorage
const getGroups = () => {
    const groups = localStorage.getItem("groups");
    return groups ? JSON.parse(groups) : [];
  };
  
  // 💾 Sauvegarde les groupes dans localStorage
  const saveGroups = (groups: any[]) => {
    localStorage.setItem("groups", JSON.stringify(groups));
  };
  
  // 🔍 Récupérer le groupe actuel de l'utilisateur
  export const getUserGroup = (username: string) => {
    const groups = getGroups();
    return groups.find((group: any) => group.members.includes(username)) || null;
  };
  
  export const joinGroup = (username: string, groupName: string) => {
    if (!username) return { success: false, message: "Utilisateur non connecté." };
  
    let groups = getGroups();
    console.log("🔍 Groupes AVANT modification :", JSON.stringify(groups, null, 2));
  
    // 📌 Vérifier si l'utilisateur appartient déjà à un groupe
    let previousGroupIndex = groups.findIndex((group: any) =>
      group.members.includes(username)
    );
  
    if (previousGroupIndex !== -1) {
      let previousGroup = groups[previousGroupIndex];
  
      console.log(`🔄 ${username} quitte son ancien groupe : ${previousGroup.name}`);
  
      // ✅ Retirer l'utilisateur de son ancien groupe
      previousGroup.members = previousGroup.members.filter((m: any) => m !== username);
  
      // ✅ Si l'utilisateur était ADMIN, choisir un nouvel admin ou supprimer le groupe
      if (previousGroup.admin === username) {
        if (previousGroup.members.length > 0) {
          previousGroup.admin = previousGroup.members[0]; // Le premier membre devient admin
          console.log(`👑 Nouveau admin de ${previousGroup.name} : ${previousGroup.admin}`);
        } else {
          console.log(`🗑️ Suppression du groupe vide : ${previousGroup.name}`);
          groups.splice(previousGroupIndex, 1); // Supprime le groupe de la liste
        }
      }
  
      // 🔄 **Mettre à jour `groups` pour refléter la suppression**
      saveGroups(groups);
    }
  
    // 📌 Vérifier si le groupe cible existe déjà
    let group = groups.find((g: any) => g.name === groupName);
    if (!group) {
      console.log(`🆕 Création du groupe : ${groupName}`);
      group = { name: groupName, admin: username, members: [] };
      groups.push(group);
    }
  
    // ✅ Ajouter l'utilisateur au groupe cible
    if (!group.members.includes(username)) {
      group.members.push(username);
      console.log(`✅ ${username} a rejoint le groupe ${groupName}`);
    } else {
      console.warn(`⚠️ ${username} est déjà membre du groupe ${groupName}`);
    }
  
    // 💾 Sauvegarde des groupes après modification
    saveGroups(groups);
  
    console.log("🔍 Groupes APRÈS modification :", JSON.stringify(groups, null, 2));
  
    return { success: true, message: `Vous avez rejoint le groupe ${groupName}` };
  };
  
  
  
  // 📜 Récupérer la liste de tous les groupes
  export const getAllGroups = () => getGroups();
  