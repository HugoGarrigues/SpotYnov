import { useEffect, useState } from "react";
import "../styles/MemberProfile.css";

const MemberProfile = ({ member, group, onClose }: { member: string; group: any; onClose: () => void }) => {
  const [spotifyProfile, setSpotifyProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserSpotifyData(member)
      .then((profile) => {
        setSpotifyProfile(profile);
      })
      .catch(() => {
        setSpotifyProfile(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [member]);

  const fetchUserSpotifyData = async (username: string) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      console.log("🔍 Récupération des données Spotify...");
      const likedTracksResponse = await fetch("https://api.spotify.com/v1/me/tracks?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 👤 **Récupération du profil Spotify**
      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📀 Réponse API Titres likés :", likedTracksResponse);

      

      let userData = null;
      if (userResponse.ok) {
        userData = await userResponse.json();
        console.log("🎵 Profil Spotify :", userData);
      }

      let likedTracksData = [];
      if (likedTracksResponse.ok) {
        
        const data = await likedTracksResponse.json();
        console.log("📀 Données brutes des titres likés :", data);
        likedTracksData = data.items.map((item: any) => ({
          id: item.track.id,
          uri: `spotify:track:${item.track.id}`, // ✅ Ajoute l'URI nécessaire pour Spotify
          name: item.track.name,
          artist: item.track.artists.map((artist: any) => artist.name).join(", "),
          popularity: item.track.popularity ?? 0,
          durationMs: item.track.duration_ms ?? 0,
          album: item.track.album.name,
        }));
        
        console.log("🎶 Titres likés récupérés :", likedTracksData);
      }else {
        console.error("❌ Erreur lors de la récupération des titres likés :", await likedTracksResponse.text());
      }
  
      console.log("✅ Titres likés formatés :", likedTracksData);


      // 📊 **Calcul des stats musicales**
      const totalPopularity = likedTracksData.reduce((sum, track) => sum + track.popularity, 0);
      const totalDuration = likedTracksData.reduce((sum, track) => sum + track.durationMs, 0);
      const avgPopularity = likedTracksData.length > 0 ? totalPopularity / likedTracksData.length : 0;
      const avgDuration = likedTracksData.length > 0 ? totalDuration / likedTracksData.length : 0;

      // 🔥 **Récupération des recommandations musicales**
      let recommendedTracksData = [];
      if (likedTracksData.length > 0) {
        const seedTracks = likedTracksData.slice(0, 5).map((track) => track.id).join(",");
        console.log("🌱 Seed Tracks pour recommandations :", seedTracks);

        const recResponse = await fetch(
          `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (recResponse.ok) {
          const recData = await recResponse.json();
          recommendedTracksData = recData.tracks.map((track: any) => ({
            id: track.id,
            name: track.name,
            artist: track.artists.map((artist: any) => artist.name).join(", "),
            album: track.album.name,
            image: track.album.images[0]?.url || "https://via.placeholder.com/100",
          }));
          console.log("🔮 Recommandations récupérées :", recommendedTracksData);
        }
      }

      // ⏳ **Récupération du temps d'écoute aujourd’hui**
      const playedResponse = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=50",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let todayHours = 0;
      if (playedResponse.ok) {
        const playedData = await playedResponse.json();
        console.log("⏳ Historique de lecture :", playedData.items);

        const dailyDurations: Record<string, number> = {};
        playedData.items.forEach((item: any) => {
          const dateStr = new Date(item.played_at).toISOString().split("T")[0];
          dailyDurations[dateStr] = (dailyDurations[dateStr] || 0) + item.track.duration_ms;
        });

        const todayDate = new Date().toISOString().split("T")[0];
        const todayDurationMs = dailyDurations[todayDate] || 0;
        todayHours = todayDurationMs / (1000 * 3600);
      }

      return {
        username: userData?.display_name ?? username, 
        likedTracks: likedTracksData,
        recommendedTracks: recommendedTracksData,
        averagePopularity: avgPopularity,
        averageDuration: avgDuration,
        todayListeningHours: todayHours,
      };
    } catch (error) {
      console.error("🚨 Erreur Spotify :", error);
      return null;
    }
  };

  const isAdmin = group.admin === member;

  const createPlaylist = async () => {
    const token = localStorage.getItem("token");
  
    console.log("🎵 Tentative de création de playlist...");
    console.log("📀 Token récupéré ?", token ? "✅ Oui" : "❌ Non");
    console.log("📀 Titres likés disponibles :", likedTracks);
  
    if (!token || likedTracks.length === 0) {
      setMessage("⚠️ Impossible de créer la playlist : aucune musique trouvée.");
      console.error("🚨 Erreur : Aucun token ou aucun titre liké.");
      return;
    }
  
    try {
      // ✅ Vérification si l’utilisateur appartient au même groupe
      console.log("👥 Vérification de l'appartenance au groupe...");
      if (!group.members.includes(member)) {
        setMessage("❌ L'utilisateur ne fait pas partie de votre groupe.");
        console.error("🚨 Erreur : L'utilisateur n'est pas dans le groupe.");
        return;
      }
  
      console.log("🎵 Création de la playlist pour :", member);
  
      // 1️⃣ **Créer une nouvelle playlist**
      const createResponse = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Top 10 de ${member}`,
          description: `Playlist des 10 musiques préférées de ${member}`,
          public: false,
        }),
      });
  
      console.log("📀 Réponse de création de la playlist :", createResponse);
  
      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error("🚨 Erreur lors de la création de la playlist :", errorText);
        throw new Error("Erreur lors de la création de la playlist.");
      }
  
      const playlistData = await createResponse.json();
      const playlistId = playlistData.id;
      console.log("✅ Playlist créée avec succès ! ID :", playlistId);
  
      // 2️⃣ **Ajouter les morceaux à la playlist**
      const trackUris = likedTracks.map((track) => track.uri).filter(uri => uri);
      console.log("🎵 URIs des titres à ajouter :", trackUris);
  
      if (trackUris.length === 0) {
        setMessage("⚠️ Aucune musique valide à ajouter.");
        console.error("🚨 Erreur : Aucun URI de musique à ajouter.");
        return;
      }
  
      const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: trackUris }),
      });
  
      console.log("📀 Réponse d'ajout des morceaux :", addTracksResponse);
  
      if (!addTracksResponse.ok) {
        const errorText = await addTracksResponse.text();
        console.error("🚨 Erreur lors de l'ajout des morceaux :", errorText);
        throw new Error("Erreur lors de l'ajout des morceaux.");
      }
  
      console.log("🎶 Titres ajoutés à la playlist !");
      setMessage(`✅ Playlist créée avec succès ! 🎉`);
    } catch (error) {
      console.error("🚨 Erreur lors de la création de la playlist :", error);
      setMessage("⚠️ Une erreur est survenue lors de la création de la playlist.");
    }
  };

  return (
    <div className="member-profile">
      <div className="profile-header">
        <h2>Profil</h2>
        <button className="close-btn" onClick={onClose}>❌</button>
      </div>

      <div className="profile-section">
        <label>Nom</label>
        <input type="text" value={member} readOnly />

        <label>Statut</label>
        <input type="text" value={isAdmin ? "Administrateur" : "Membre"} readOnly />
      </div>

      {isLoading ? (
        <p>Chargement des goûts musicaux...</p>
      ) : spotifyProfile ? (
        <>
          <h2>🎵 Goûts musicaux</h2>
          <div className="profile-section">
            <label>Pseudo Spotify</label>
            <input type="text" value={spotifyProfile.username} readOnly />

            <h3>🎶 Titres les plus likés</h3>
            <ul>
              {spotifyProfile.likedTracks.map((track: any) => (
                <li key={track.id}>
                  <strong>{track.name}</strong> - {track.artist}
                </li>
                
              ))}
            </ul>
            {/* 🎵 Bouton pour créer une playlist avec les titres likés */}
            <button className="create-playlist-btn" onClick={createPlaylist}>
              🎶 Créer une Playlist avec les titres préférés de {member}
            </button>

            {/* Affichage du message de statut */}
            {message && <p>{message}</p>}


            <h3>📊 Statistiques musicales</h3>
            <p><strong>Popularité moyenne :</strong> {spotifyProfile.averagePopularity.toFixed(2)}</p>
            <p><strong>Durée moyenne :</strong> {(spotifyProfile.averageDuration / 1000 / 60).toFixed(2)} min</p>

            <h3>⏳ Temps d'écoute aujourd'hui</h3>
            <p>{spotifyProfile.todayListeningHours.toFixed(2)} heures</p>
          </div>
        </>
      ) : (
        <p>Ce membre n'a pas lié son compte Spotify.</p>
      )}
    </div>
  );
};

export default MemberProfile;
