import { useState } from "react";
import { joinGroup } from "../services/groupServices";

const CreateGroupForm = ({ onCancel }: { onCancel: () => void }) => {
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateGroup = () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setMessage("Veuillez vous connecter d'abord.");
      return;
    }

    if (!groupName.trim()) {
      setMessage("Veuillez entrer un nom de groupe.");
      return;
    }

    const result = joinGroup(username, groupName);
    setMessage(result.message);
    setTimeout(() => {
      onCancel();
    }, 1000); // Ferme après 1 seconde
  };

  return (
    <div className="create-group-container">
      <h2>Créer un Groupe</h2>
      <input
        type="text"
        placeholder="Nom du groupe"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      {message && <p>{message}</p>}
      <div className="buttons">
        <button className="cancel-btn" onClick={onCancel}>Annuler</button>
        <button className="create-btn" onClick={handleCreateGroup}>Créer Groupe</button>
      </div>
    </div>
  );
};

export default CreateGroupForm;
