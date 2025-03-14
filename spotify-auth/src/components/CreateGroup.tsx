import { useState } from "react";
import { joinGroup } from "../services/groupServices";
import "../styles/CreateGroup.css";

const CreateGroup = ({ onCancel }: { onCancel: () => void }) => {
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

    console.log(`🚀 Création du groupe : ${groupName}`);
    joinGroup(username, groupName);

    // Obliger de faire reload la page sinon cela ne marche pas :D super !
    window.location.reload();

    // Fermer après succès
    setTimeout(() => {
      onCancel();
    }, 100);
  };

  return (
 <div className="create-group-container">
      <h2>Créer un Groupe</h2>

      {/* Input pour le nom du groupe */}
      <label>Nom</label>
      <input
      className="group-name-input"
        type="text"
        placeholder="Entrer le nom du groupe"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      {message && <p className="message">{message}</p>}

      {/* Boutons */}
      <div className="buttons">
        <button className="cancel-btn" onClick={onCancel}>Annuler</button>
        <button className="create-btn" onClick={handleCreateGroup}>Créer Groupe</button>
      </div>
    </div>
  );
};

export default CreateGroup;
