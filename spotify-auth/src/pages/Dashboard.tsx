import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { getUserGroup } from "../services/groupServices";


interface LikedTrack {
  id: string;
  name: string;
  artist: string;
  popularity: number;
  durationMs: number;
  addedAt: string;
}

interface PlayedTrack {
  id: string;
  name: string;
  artist: string;
  durationMs: number;
  playedAt: string;
}

// Fonction utilitaire pour formater un nombre d'heures en "X h Y min"
const formatHours = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h} h ${m} min`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [likedTracks, setLikedTracks] = useState<LikedTrack[]>([]);
  const [recommendedTracks, setRecommendedTracks] = useState<LikedTrack[]>([]);
  const [averagePopularity, setAveragePopularity] = useState<number | null>(null);
  const [averageDuration, setAverageDuration] = useState<number | null>(null);
  // Statistiques calculées sur TOUS les titres likés (jusqu'à 50 titres)
  const [allAveragePopularity, setAllAveragePopularity] = useState<number | null>(null);
  const [allAverageDuration, setAllAverageDuration] = useState<number | null>(null);
  // Temps d'écoute total "aujourd'hui" (compte entier)
  const [todayListeningHours, setTodayListeningHours] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔐 Connexion à Spotify
  const handleConnectSpotify = () => {
    const clientId = "5996e16cdba64f768b013901df287254";
    const redirectUri = "http://localhost:5173/dashboard";
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
    setLikedTracks([]);
    setRecommendedTracks([]);
    setAveragePopularity(null);
    setAverageDuration(null);
    setAllAveragePopularity(null);
    setAllAverageDuration(null);
    setTodayListeningHours(null);
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

  // 👤 Récupération des informations utilisateur
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

  // 🎵 Récupération des 10 derniers titres likés et calcul des statistiques associées
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const fetchLikedTracks = async () => {
        try {
          const response = await fetch("https://api.spotify.com/v1/me/tracks?limit=10", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error(`Erreur ${response.status} - ${response.statusText}`);
          }
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const tracks: LikedTrack[] = data.items.map((item: any) => ({
              id: item.track.id,
              name: item.track.name,
              artist: item.track.artists.map((artist: any) => artist.name).join(", "),
              popularity: item.track.popularity ?? 0,
              durationMs: item.track.duration_ms ?? 0,
              addedAt: item.added_at,
            }));
            setLikedTracks(tracks);
            const totalPopularity = tracks.reduce(
              (sum, track) => sum + (track.popularity || 0),
              0
            );
            const totalDuration = tracks.reduce(
              (sum, track) => sum + (track.durationMs || 0),
              0
            );
            setAveragePopularity(tracks.length > 0 ? totalPopularity / tracks.length : 0);
            setAverageDuration(tracks.length > 0 ? totalDuration / tracks.length : 0);

            // 🔥 Récupération des recommandations basées sur ces titres likés
            const seedTracks = tracks.slice(0, 5).map((track) => track.id).join(",");
            fetchRecommendations(token, seedTracks);
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

  // 📊 Fonction pour récupérer tous les titres likés (jusqu'à 50) et calculer la moyenne sur l'ensemble
  const fetchAllLikedTracks = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/tracks?limit=50", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Erreur ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const tracks: LikedTrack[] = data.items.map((item: any) => ({
            id: item.track.id,
            name: item.track.name,
            artist: item.track.artists.map((artist: any) => artist.name).join(", "),
            popularity: item.track.popularity ?? 0,
            durationMs: item.track.duration_ms ?? 0,
            addedAt: item.added_at,
          }));
          const totalPopularity = tracks.reduce(
            (sum, track) => sum + (track.popularity || 0),
            0
          );
          const totalDuration = tracks.reduce(
            (sum, track) => sum + (track.durationMs || 0),
            0
          );
          setAllAveragePopularity(tracks.length > 0 ? totalPopularity / tracks.length : 0);
          setAllAverageDuration(tracks.length > 0 ? totalDuration / tracks.length : 0);
        } else {
          setError("Aucun titre liké trouvé pour le calcul complet.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de tous les titres likés :", error);
        setError(`Erreur lors de la récupération de tous les titres likés : ${error}`);
      }
    }
  };

  // 🎧 Récupération des pistes récemment écoutées pour calculer le temps d'écoute d'aujourd'hui
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const fetchRecentlyPlayed = async () => {
        try {
          const response = await fetch(
            "https://api.spotify.com/v1/me/player/recently-played?limit=50",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!response.ok) {
            throw new Error(`Erreur ${response.status} - ${response.statusText}`);
          }
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const playedTracks: PlayedTrack[] = data.items.map((item: any) => ({
              id: item.track.id,
              name: item.track.name,
              artist: item.track.artists.map((artist: any) => artist.name).join(", "),
              durationMs: item.track.duration_ms ?? 0,
              playedAt: item.played_at,
            }));
            const dailyDurations: Record<string, number> = {};
            playedTracks.forEach((track) => {
              const dateStr = new Date(track.playedAt).toISOString().split("T")[0];
              dailyDurations[dateStr] = (dailyDurations[dateStr] || 0) + track.durationMs;
            });
            const todayDate = new Date().toISOString().split("T")[0];
            const todayDurationMs = dailyDurations[todayDate] || 0;
            const todayHours = todayDurationMs / (1000 * 3600);
            setTodayListeningHours(todayHours);
          } else {
            setTodayListeningHours(0);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des pistes récemment écoutées :", error);
        }
      };
      fetchRecentlyPlayed();
    }
  }, []);

  // 💡 Récupération des recommandations basées sur les titres likés
  const fetchRecommendations = async (token: string, seedTracks: string) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks}&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) {
        throw new Error(`Erreur ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      if (data.tracks) {
        const recommendations: LikedTrack[] = data.tracks.map((track: any) => ({
          id: track.id,
          name: track.name,
          artist: track.artists.map((artist: any) => artist.name).join(", "),
          popularity: track.popularity ?? 0,
          durationMs: track.duration_ms ?? 0,
          addedAt: "",
        }));
        setRecommendedTracks(recommendations);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des recommandations :", error);
    }
  };

  // 🔹 Récupération du groupe actuel de l'utilisateur
  const username = localStorage.getItem("username");
  const currentGroup = username ? getUserGroup(username) : null;

  return (
    <div className="dashboard-container">
      <h1>Bienvenue sur votre Dashboard</h1>
      {userName ? (
        <>
          <p>
            ✅ Vous êtes connecté à votre compte Spotify : <strong>{userName}</strong>
          </p>
          <button onClick={handleLogout}>Se déconnecter</button>
          <div>
            <h2>🎯 Portrait de votre profil :</h2>
            {currentGroup ? (
          <p>👥 Groupe actuel : <strong>{currentGroup.name}</strong></p>
        ) : (
          <p>❌ Vous n'êtes dans aucun groupe.</p>
        )}
        <Link to="/join-group">
          <button>Rejoindre un Groupe</button>
        </Link>

            {averagePopularity !== null && (
              <p>
                ⭐️ Popularité moyenne (10 derniers titres likés) :{" "}
                {Math.round(averagePopularity)} / 100
              </p>
            )}
            {averageDuration !== null && (
              <p>
                ⏳ Durée moyenne (10 derniers titres likés) :{" "}
                {Math.round(averageDuration / 1000)} s
              </p>
            )}
            {todayListeningHours !== null && (
              <p>
                🎧 Musique écoutée aujourd'hui (compte entier) :{" "}
                {formatHours(todayListeningHours)}
              </p>
            )}
            {/* Bouton pour afficher les moyennes sur tous les titres likés */}
            <button onClick={fetchAllLikedTracks}>
              Afficher la moyenne de TOUS les titres likés
            </button>
            {allAveragePopularity !== null && allAverageDuration !== null && (
              <div>
                <h3>Moyennes pour tous les titres likés</h3>
                <p>
                  ⭐️ Popularité moyenne (tous titres) : {Math.round(allAveragePopularity)} / 100
                </p>
                <p>
                  ⏳ Durée moyenne (tous titres) : {Math.round(allAverageDuration / 1000)} s
                </p>
              </div>
            )}
          </div>
          <div>
            <h2>🎶 Vos 10 titres likés :</h2>
            <ul>
              {likedTracks.map((track) => (
                <li key={track.id}>
                  {track.name} - <strong>{track.artist}</strong>
                </li>
              ))}
            </ul>
          </div>
          {recommendedTracks.length > 0 && (
            <div>
              <h2>💡 Ce que vous pourriez aimer :</h2>
              <ul>
                {recommendedTracks.map((track) => (
                  <li key={track.id}>
                    {track.name} - <strong>{track.artist}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={handleLogout}>Se déconnecter</button>
        </>
      ) : (
        <button onClick={handleConnectSpotify}>Se connecter à Spotify</button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Dashboard;
