import { useState } from "react";
import { getAllGroups } from "../services/groupServices";
import "../styles/GroupsList.css";

const GroupsList = ({ onCreateGroup, onSelectMember }: { onCreateGroup: () => void; onSelectMember: (member: string) => void }) => {
  const [groups] = useState(getAllGroups());
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

  const handleGroupClick = (group: any) => {
    setSelectedGroup(group);
  };

  return (
    <div className="groups-container">
      <h2 className="logo">Spotynov</h2>

      {selectedGroup ? (
        <>
          <div className="group-header">
            <div>
              <h3>{selectedGroup.name}</h3>
            </div>
          </div>

          <ul className="members-list">
            {selectedGroup.members.map((member: string, index: number) => (
              <li key={index} className="member" onClick={() => onSelectMember(member)}>
                <span>{member}</span>
                {member === selectedGroup.admin && <span className="crown">👑</span>}
              </li>
            ))}
          </ul>

          <div className="group-buttons">
            <button className="sync-btn">Synchroniser</button>
            <button className="leave-btn" onClick={() => setSelectedGroup(null)}>Quitter</button>
          </div>
        </>
      ) : (
        <ul className="group-list">
          {groups.map((group) => (
            <li key={group.name} onClick={() => handleGroupClick(group)} className="group-item">
              <div>
                <h3>{group.name}</h3>
                <p>{group.members.length} participants</p>
              </div>
              <span className="arrow">›</span>
            </li>
          ))}
        </ul>
      )}

      {!selectedGroup && (
        <div className="bottom-menu">
          <button className="create-group" onClick={onCreateGroup}>
            🌍 Créer un groupe
          </button>
        </div>
      )}



    </div>
  );
};

export default GroupsList;
