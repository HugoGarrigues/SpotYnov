export const getUserSpotifyProfile = async (username: string) => {
    // Simuler un token pour l'exemple
    const token = localStorage.getItem("token");
  
    if (!token) {
      return null;
    }
  
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error("Utilisateur non trouvé sur Spotify");
      }
  
      const data = await response.json();
  
      // Simule une réponse
      return {
        username: data.display_name,
        currentTrack: {
          title: "Titre de la musique",
          album: "Nom de l'album",
          artist: "Nom de l'artiste",
          image: "https://via.placeholder.com/100", // Image placeholder
        },
        device: "Iphone de " + data.display_name,
      };
    } catch (error) {
      console.error("Erreur Spotify :", error);
      return null;
    }
  };
  