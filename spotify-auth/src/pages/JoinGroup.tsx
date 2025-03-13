import { useState, useEffect } from "react";
import { joinGroup, getUserGroup, getAllGroups } from "../services/groupServices";
import { useNavigate, Link } from "react-router-dom";


const JoinGroup = ({ isEmbedded = false }: { isEmbedded?: boolean }) => {
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [currentGroup, setCurrentGroup] = useState<any | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      console.warn("⚠️ Utilisateur non connecté. Redirection vers /login");
      navigate("/login");
      return;
    }

    refreshGroupData();
  }, []);

  // 🔄 Rafraîchir les données après une action
  const refreshGroupData = () => {
    const username = localStorage.getItem("username");
    if (username) {
      const userGroup = getUserGroup(username);
      setCurrentGroup(userGroup);
      setGroups(getAllGroups());

      console.log(`📌 Utilisateur : ${username}`);
      console.log(`👥 Groupe actuel :`, userGroup ? userGroup.name : "Aucun");
      console.log(`📜 Liste des groupes :`, getAllGroups());
    }
  };

  const handleJoinGroup = () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setMessage("Veuillez vous connecter d'abord.");
      return;
    }

    if (!groupName.trim()) {
      setMessage("Veuillez entrer un nom de groupe.");
      return;
    }

    console.log(`🔄 ${username} tente de rejoindre : ${groupName}`);
    const result = joinGroup(username, groupName);
    setMessage(result.message);
    refreshGroupData();
  };

  if (isEmbedded) {
    return (
      <div className="join-group-embedded">
        <input
          type="text"
          placeholder="Nom du groupe"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button onClick={handleJoinGroup}>Rejoindre</button>
      </div>
    );
  }

  return (
    <div className="group-container">
      <h1>Rejoindre un Groupe</h1>

      {currentGroup ? (
        <p>✅ Vous êtes actuellement dans le groupe : <strong>{currentGroup.name}</strong></p>
      ) : (
        <p>❌ Vous n'êtes dans aucun groupe.</p>
      )}

      <input
        type="text"
        placeholder="Nom du groupe"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={handleJoinGroup}>Rejoindre</button>
      {message && <p>{message}</p>}

      <h2>📜 Liste des Groupes</h2>
        {groups.length > 0 ? (
        <ul>
            {groups.map((group) => (
            <li key={group.name}>
                <Link to={`/group/${group.name}`}>
                <strong>{group.name}</strong>
                </Link> - Admin : {group.admin} ({group.members.length} membres)
            </li>
            ))}
        </ul>
        ) : (
        <p>Aucun groupe disponible.</p>
        )}
    </div>
  );
};

export default JoinGroup;
