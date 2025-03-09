import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../services/authServices";

const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = getLoggedInUser();
        if (!loggedUser) {
            navigate("/login");
        } else {
            setUser(loggedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleJoinGroup = () => {
        navigate("/join-group");
    };

    return (
        <div className="dashboard-container">
            <h1>Bienvenue, {user?.username}</h1>

            <button onClick={handleJoinGroup} style={{ marginRight: "10px" }}>
                Rejoindre un Groupe
            </button>

            <button onClick={handleLogout} style={{ backgroundColor: "red", color: "white" }}>
                Déconnexion
            </button>
        </div>
    );
};

export default Dashboard;
