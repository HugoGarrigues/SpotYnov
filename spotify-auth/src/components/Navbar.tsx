import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ spotifyUserName, handleConnectSpotify }: any) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>Spotynov</h2>
      </div>

      <div className="navbar-right">
        {spotifyUserName ? (
          <div className="profile">
            <span>🎵 {spotifyUserName}</span>
            <img src="https://source.unsplash.com/40x40/?music" alt="Profil" />
          </div>
        ) : (
          <button onClick={handleConnectSpotify} className="spotify-btn">
            🎧 Lier un compte Spotify
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
