import React, { useEffect, useState } from "react";
import { getGroupInfo, leaveGroup } from "../services/groupService.ts";
import { useNavigate } from "react-router-dom";

const Group = () => {
    const [group, setGroup] = useState<any>(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroupInfo = async () => {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
            if (!loggedInUser.username) {
                navigate("/login");
                return;
            }

            const response = await getGroupInfo(loggedInUser.username);
            if (response.success) {
                setGroup(response);
            } else {
                setError(response.message);
            }
        };

        fetchGroupInfo();
    }, []);

    const handleLeaveGroup = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

        if (!loggedInUser.username) {
            setError("Veuillez vous connecter.");
            return;
        }

        const response = await leaveGroup(loggedInUser.username);
        if (response.success) {
            navigate("/dashboard");
        } else {
            setError(response.message);
        }
    };

    return (
        <div className="group-container">
            <h1>Mon Groupe</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {group && (
                <>
                    <h2>Groupe: {group.groupName}</h2>
                    <h3>Membres:</h3>
                    <ul>
                        {group.members.map((member: any, index: number) => (
                            <li key={index}>
                                {member.username} {member.isAdmin && "(Admin)"}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleLeaveGroup} style={{ background: "red", color: "white", padding: "10px", borderRadius: "5px", cursor: "pointer" }}>
                        Quitter le groupe
                    </button>
                </>
            )}
        </div>
    );
};

export default Group;
