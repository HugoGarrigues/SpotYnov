import React, { useEffect, useState } from "react";
import { getAllGroups, getGroupMembers } from "../services/groupService.ts";

const Groups = () => {
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGroups = async () => {
            const data = getAllGroups();
            setGroups(data);
        };
        fetchGroups();
    }, []);

    const handleViewMembers = async (groupName: string) => {
        const response = getGroupMembers(groupName);
        if (response.success) {
            setMembers(response.members);
            setSelectedGroup(groupName);
            setError("");
        } else {
            setError(response.message);
        }
    };

    return (
        <div className="groups-container">
            <h1>Liste des Groupes</h1>
            {groups.length === 0 ? <p>Aucun groupe disponible.</p> : (
                <ul>
                    {groups.map((group, index) => (
                        <li key={index}>
                            <strong>{group.groupName}</strong> ({group.memberCount} membres)
                            <button onClick={() => handleViewMembers(group.groupName)}>
                                Voir Membres
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            {selectedGroup && (
                <div>
                    <h2>Membres du groupe {selectedGroup}</h2>
                    <ul>
                        {members.map((member, index) => (
                            <li key={index}>
                                {member.username} {member.isAdmin && "(Admin)"}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Groups;
