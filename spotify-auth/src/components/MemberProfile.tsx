import { useEffect, useState } from "react";
import { getUserSpotifyProfile } from "../services/spotifyServices";
import "../styles/MemberProfile.css";

const MemberProfile = ({ member, group, onClose }: { member: string; group: any; onClose: () => void }) => {
  const [spotifyProfile, setSpotifyProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getUserSpotifyProfile(member)
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

  // Vérifier si l'utilisateur est admin du groupe
  const isAdmin = group.admin === member;

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

            <label>Musique en cours d'écoute</label>
            <div className="music-card">
              <img src={spotifyProfile.currentTrack.image} alt="Album Cover" />
              <div>
                <strong>{spotifyProfile.currentTrack.title}</strong>
                <p>{spotifyProfile.currentTrack.album}</p>
                <p>{spotifyProfile.currentTrack.artist}</p>
              </div>
            </div>

            <label>Écoute sur</label>
            <input type="text" value={spotifyProfile.device} readOnly />
          </div>
        </>
      ) : (
        <p>Ce membre n'a pas lié son compte Spotify.</p>
      )}
    </div>
  );
};

export default MemberProfile;
