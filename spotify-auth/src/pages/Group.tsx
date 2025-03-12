import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserGroup } from "../services/groupServices";

const Group = () => {
  const navigate = useNavigate();
  const [group, setGroup] = useState<any | null>(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      navigate("/login"); // Redirige vers /login si l'utilisateur n'est pas connecté
      return;
    }

    const userGroup = getUserGroup(username);
    setGroup(userGroup);
  }, [navigate, username]);

  return (
    <div className="group-container">
      <h1>📌 Mon Groupe</h1>

      {group ? (
        <>
          <p><strong>Nom du Groupe :</strong> {group.name}</p>
          <p><strong>Admin :</strong> {group.admin}</p>
          <h2>👥 Membres :</h2>
          <ul>
            {group.members.map((member: string) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>❌ Vous n'êtes dans aucun groupe.</p>
      )}
    </div>
  );
};

export default Group;

