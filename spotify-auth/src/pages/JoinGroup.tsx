import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../services/authServices";

const JoinGroup = () => {
    const [groupName, setGroupName] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleJoinGroup = () => {
        const user = getLoggedInUser();
        if (!user) {
            setMessage("Veuillez vous connecter.");
            return;
        }

        let groups = JSON.parse(localStorage.getItem("groups") || "[]");

        let existingGroup = groups.find((g: any) => g.name === groupName);

        if (!existingGroup) {
            existingGroup = { name: groupName, members: [user.username], admin: user.username };
            groups.push(existingGroup);
        } else {
            if (!existingGroup.members.includes(user.username)) {
                existingGroup.members.push(user.username);
            }
        }

        localStorage.setItem("groups", JSON.stringify(groups));
        navigate("/dashboard");
    };

    return (
        <div className="group-container">
            <h1>Rejoindre un Groupe</h1>
            <input type="text" placeholder="Nom du groupe" onChange={(e) => setGroupName(e.target.value)} />
            <button onClick={handleJoinGroup}>Rejoindre</button>
            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
};

export default JoinGroup;
