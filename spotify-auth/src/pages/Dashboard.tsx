import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserGroup, getAllGroups } from "../services/groupServices";
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

const logoSpotynov = <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 245 173" fill="none"><g opacity="0.5"><path d="M220.33 63.0325C160.732 31.5482 90.1041 24.9272 22.8977 48.0313C13.7932 51.141 4.0447 47.148 1.04567 38.2349C-1.96006 29.3582 3.93065 18.569 14.236 15.0724C89.0105 -10.3749 167.824 -2.95826 234.574 32.4753C243.799 37.3589 247.281 48.4328 242.786 56.521C238.271 64.6239 228.402 67.2737 220.33 63.0325Z" fill="#CCA9DD"/><path d="M203.731 122.212C152.157 94.7576 90.9017 89.0053 32.6857 109.241C25.3055 111.795 17.3282 108.511 14.8861 101.284C14.7049 100.722 14.5238 100.159 14.3359 99.5974C11.9072 92.3632 16.7043 83.5815 25.0707 80.7053C89.8953 58.4043 158.303 64.8501 216.116 95.7723C223.617 99.7799 226.462 108.795 222.825 115.38C222.544 115.891 222.269 116.409 221.993 116.92C218.337 123.526 210.293 125.687 203.731 122.212Z" fill="#CCA9DD"/><path d="M186.891 170.713C143.04 147.207 90.8553 142.302 41.3009 159.69C35.3834 161.763 29.0163 159.142 27.0639 153.346C26.762 152.434 26.4668 151.521 26.1716 150.609C24.2326 144.82 28.0837 137.797 34.7929 135.469C89.9831 116.292 148.3 121.796 197.478 148.287C203.477 151.507 205.764 158.726 202.846 163.997L201.504 166.493C198.552 171.786 192.111 173.516 186.891 170.713Z" fill="#CCA9DD"/></g></svg>


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
    const clientId = "412347dd5e464e63bb25f8e19264dd7e";
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
      <Navbar spotifyUserName={spotifyUserName} username handleConnectSpotify={handleConnectSpotify} handleLogout={handleLogout} />
         <div className="main-section">
         {selectedMember ? (
          <MemberProfile member={selectedMember} group={currentGroup} onClose={clearSelectedMember} />
          ) : (
            <div className="welcome-screen">
              {logoSpotynov}
            </div>

          )}
        </div>
      </div>
    </div>
      
  );
  
};

export default Dashboard;
