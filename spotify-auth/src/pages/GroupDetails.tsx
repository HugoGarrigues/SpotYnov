import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllGroups } from "../services/groupServices";

const GroupDetails = () => {
  const { groupName } = useParams(); // Récupère le nom du groupe dans l’URL
  const navigate = useNavigate();
  const [group, setGroup] = useState<any | null>(null);

  useEffect(() => {
    const groups = getAllGroups();
    const selectedGroup = groups.find((g: any) => g.name === groupName);

    if (!selectedGroup) {
      navigate("/join-group"); // Redirige si le groupe n'existe pas
    } else {
      setGroup(selectedGroup);
    }
  }, [groupName, navigate]);

  return (
    <div className="group-details">
      {group ? (
        <>
          <h1>📌 Groupe : {group.name}</h1>
          <p><strong>👑 Admin :</strong> {group.admin}</p>
          <h2>👥 Membres :</h2>
          <ul>
            {group.members.map((member: string) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default GroupDetails;
