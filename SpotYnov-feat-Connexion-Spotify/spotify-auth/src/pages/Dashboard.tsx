import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

interface LikedTrack {
  id: string;
  name: string;
  artist: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [likedTracks, setLikedTracks] = useState<LikedTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 🔐 Connexion à Spotify
  const handleConnectSpotify = () => {
    const clientId = "9c54ed91d60f40d7b4d33be3e88e69ce";
    const redirectUri = "http://localhost:5173/dashboard"; // ✅ Redirection correcte
    const scopes = "user-read-private user-read-email user-library-read"; // ✅ Ajout du scope pour les titres likés

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}&response_type=token&show_dialog=true`;

    window.location.href = authUrl;
  };

  // 🚪 Déconnexion de Spotify
  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setUserName(null);
    setLikedTracks([]); // ✅ Réinitialiser les titres likés
    setError(null);
  };

  // 🧠 Récupération du token après la connexion
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");

    if (token) {
      window.localStorage.setItem("token", token);
      window.history.replaceState(null, "", "/dashboard");
    }
  }, []);

  // 👤 Récupération du pseudo Spotify
  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des informations utilisateur");
          }

          const data = await response.json();
          setUserName(data.display_name);
        } catch (error) {
          console.error("Erreur lors de la récupération des informations utilisateur :", error);
          setError("Erreur lors de la récupération des informations utilisateur");
          window.localStorage.removeItem("token");
        }
      };

      fetchUserInfo();
    }
  }, []);

  // 🎵 Récupération des titres likés
  useEffect(() => {
    const token = window.localStorage.getItem("token");
  
    if (token) {
      console.log("TOKEN UTILISÉ :", token); // ✅ LOG DU TOKEN
  
      const fetchLikedTracks = async () => {
        try {
          const response = await fetch("https://api.spotify.com/v1/me/tracks?limit=10", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          console.log("STATUT DE LA RÉPONSE :", response.status);
  
          if (!response.ok) {
            throw new Error(`Erreur ${response.status} - ${response.statusText}`);
          }
  
          const data = await response.json();
          console.log("RÉPONSE DE L'API SPOTIFY :", data); // ✅ LOG DES DONNÉES RETOURNÉES
  
          if (data.items.length > 0) {
            const tracks = data.items.map((item: any) => ({
              id: item.track.id,
              name: item.track.name,
              artist: item.track.artists.map((artist: any) => artist.name).join(", "),
            }));
  
            setLikedTracks(tracks);
          } else {
            setError("Aucun titre liké trouvé.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des titres likés :", error);
          setError(`Erreur lors de la récupération des titres likés : ${error}`);
        }
      };
  
      fetchLikedTracks();
    }
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Bienvenue sur votre Dashboard</h1>

      {/* ✅ Si l'utilisateur est connecté */}
      {userName ? (
        <>
          <p>✅ Vous êtes connecté à votre compte Spotify : <strong>{userName}</strong></p>
          <button onClick={handleLogout}>Se déconnecter</button>
        </>
      ) : (
        <>
          <button onClick={handleConnectSpotify}>Se connecter à Spotify</button>
        </>
      )}

      {/* ⚠️ Gestion des erreurs */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🎵 Affichage des titres likés */}
      {likedTracks.length > 0 && (
        <div>
          <h2>🎶 Vos titres likés :</h2>
          <ul>
            {likedTracks.map((track) => (
              <li key={track.id}>
                {track.name} - <strong>{track.artist}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
