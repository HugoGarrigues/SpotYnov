import { useState, useEffect } from "react";
import { getUserGroup, getAllGroups } from "../services/groupServices";
import { useNavigate, Link } from "react-router-dom";

const JoinGroup = () => {
  const [currentGroup, setCurrentGroup] = useState<any | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }

    refreshGroupData();
  }, []);

  const refreshGroupData = () => {
    const username = localStorage.getItem("username");
    if (username) {
      const userGroup = getUserGroup(username);
      setCurrentGroup(userGroup);
      setGroups(getAllGroups());
    }
  };

  return (
    <div className="group-container">
      <h1>Rejoindre un Groupe</h1>

      {currentGroup ? (
        <p>✅ Vous êtes dans le groupe : <strong>{currentGroup.name}</strong></p>
      ) : (
        <p>❌ Vous n'êtes dans aucun groupe.</p>
      )}

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
