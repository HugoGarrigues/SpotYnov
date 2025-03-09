export interface User {
    username: string;
    isAdmin: boolean;
}

export interface Group {
    name: string;
    members: string[];
    admin: string;
}

const GROUPS_KEY = "groups"; 

export const getGroups = (): Group[] => {
    return JSON.parse(localStorage.getItem(GROUPS_KEY) || "[]");
};

export const saveGroups = (groups: Group[]) => {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
};

export const joinGroup = async (groupName: string) => {
    try {
        if (!groupName) {
            return { success: false, message: "Le nom du groupe est requis." };
        }

        let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

        if (!loggedInUser) {
            return { success: false, message: "Veuillez vous connecter." };
        }

        let groups = getGroups();
        let group = groups.find(g => g.name === groupName);
        if (!group) {
            group = { name: groupName, members: [loggedInUser.username], admin: loggedInUser.username };
            groups.push(group);
        } else {
            if (!group.members.includes(loggedInUser.username)) {
                group.members.push(loggedInUser.username);
            } else {
                return { success: false, message: "Vous êtes déjà dans ce groupe." };
            }
        }

        saveGroups(groups);
        return { success: true, message: `Groupe ${groupName} rejoint avec succès !` };

    } catch (error) {
        return { success: false, message: "Erreur interne." };
    }
};

// Fonction pour récupérer les infos du groupe
export const getGroupInfo = async (username: string) => {
    const groups = getGroups();
    const group = groups.find(g => g.members.includes(username));
    
    if (!group) {
        return { success: false, message: "Aucun groupe trouvé." };
    }

    return {
        success: true,
        groupName: group.name,
        members: group.members.map(member => ({
            username: member,
            isAdmin: group.admin === member,
        })),
    };
};

export const leaveGroup = async (username: string) => {
    let groups = getGroups();

    const groupIndex = groups.findIndex(g => g.members.includes(username));
    if (groupIndex === -1) {
        return { success: false, message: "Vous n'êtes dans aucun groupe." };
    }

    let group = groups[groupIndex];

    group.members = group.members.filter(member => member !== username);

    if (group.admin === username) {
        if (group.members.length > 0) {
            group.admin = group.members[0];
        } else {
            groups.splice(groupIndex, 1); 
        }
    }

    saveGroups(groups);
    return { success: true, message: "Vous avez quitté le groupe." };
};
