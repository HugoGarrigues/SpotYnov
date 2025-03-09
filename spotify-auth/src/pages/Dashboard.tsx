import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h1>Bienvenue sur votre Dashboard</h1>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
};

export default Dashboard;
