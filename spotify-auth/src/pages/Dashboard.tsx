import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserGroup, getAllGroups } from "../services/groupServices";
import JoinGroup from "./JoinGroup"; 
import GroupsList from "../components/GroupsList";
import Navbar from "../components/Navbar";
import MemberProfile from "../components/MemberProfile";
import "../styles/Dashboard.css";



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


const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));
  const [groups, setGroups] = useState<any[]>([]);
  const [currentGroup, setCurrentGroup] = useState<any | null>(null);
  const [likedTracks, setLikedTracks] = useState<LikedTrack[]>([]);
  const [spotifyUserName, setSpotifyUserName] = useState<string | null>(null);
  const [recommendedTracks, setRecommendedTracks] = useState<LikedTrack[]>([]);
  const [averagePopularity, setAveragePopularity] = useState<number | null>(null);
  const [averageDuration, setAverageDuration] = useState<number | null>(null);
  // Statistiques calculées sur TOUS les titres likés (jusqu'à 50 titres)
  const [allAveragePopularity, setAllAveragePopularity] = useState<number | null>(null);
  const [allAverageDuration, setAllAverageDuration] = useState<number | null>(null);
  // Temps d'écoute total "aujourd'hui" (compte entier)
  const [todayListeningHours, setTodayListeningHours] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);


    // Vérifie que l'utilisateur est bien connecté
    useEffect(() => {
      if (!username) {
        navigate("/login");
      } else {
        setGroups(getAllGroups());
        setCurrentGroup(getUserGroup(username));
      }
    }, [username, navigate]);
  // Récupère la liste des groupes
  useEffect(() => {
    setGroups(getAllGroups());
  }, []);

  // Récupération du groupe de l'utilisateur
  useEffect(() => {
    if (username) {
      setCurrentGroup(getUserGroup(username));
    }
  }, [username]);

  


  const handleConnectSpotify = () => {
    const clientId = "5996e16cdba64f768b013901df287254";
    const redirectUri = "http://localhost:5173/dashboard";
    const scopes = [
      "user-read-private", 
      "user-read-email", 
      "user-library-read", 
      "user-read-currently-playing", // ✅ Ajout du scope pour la musique en cours
      "user-read-playback-state",    // ✅ Permet de récupérer l'état du lecteur
      "playlist-modify-public",
"playlist-modify-private",
"user-library-read",

    ].join(" ");
  
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token&show_dialog=true`;
    window.location.href = authUrl;
  };
  

  // 🚪 Déconnexion de Spotify
  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token Spotify
    localStorage.removeItem("username"); // Supprime le nom d'utilisateur
    setUsername(null);
    setSpotifyUserName(null);
    navigate("/login"); // Redirige vers la connexion
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
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => setSpotifyUserName(data.display_name))
        .catch((error) => console.error("Erreur Spotify :", error));
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

  const clearSelectedMember = () => {
    setSelectedMember(null);
  };

  return (
    <div className="dashboard">
      <GroupsList onSelectMember={setSelectedMember} />
      <div className="content">
      <Navbar spotifyUserName={spotifyUserName} handleConnectSpotify={handleConnectSpotify} />
         <div className="main-section">
         {selectedMember ? (
          <MemberProfile member={selectedMember} group={currentGroup} onClose={clearSelectedMember} />
          ) : (
            <div className="welcome-screen">
              <img src="https://via.placeholder.com/200" alt="Spotify Logo" />
              <h2>Rejoindre un groupe</h2>
              <p>Sur Spotynov, tu peux rejoindre un groupe et découvrir...</p>
              <JoinGroup isEmbedded={true} />
            </div>
          )}
        </div>
      </div>
    </div>
      
  );
  
};

export default Dashboard;
