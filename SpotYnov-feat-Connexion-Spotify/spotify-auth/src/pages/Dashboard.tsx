import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
  };

  const handleConnectSpotify = () => {
    const clientId = "9c54ed91d60f40d7b4d33be3e88e69ce";
    // Assurez-vous que cette URI est bien enregistrée dans le dashboard de Spotify
    const redirectUri = "http://localhost:5173/callback";
    // Définissez ici les scopes dont vous avez besoin (séparés par espace)
    const scopes = "user-read-private user-read-email";
    // Pour l'Implicit Grant Flow, on utilise response_type=token
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}&response_type=token&show_dialog=true`;
    window.location.href = authUrl;
  };

  return (
    <div className="dashboard-container">
      <h1>Bienvenue sur votre Dashboard</h1>
      <button onClick={handleConnectSpotify}>Se connecter à Spotify</button>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
};

export default Dashboard;
 