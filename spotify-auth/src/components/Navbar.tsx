import "../styles/Navbar.css";

const localUsername = localStorage.getItem("username");

const Navbar = ({ spotifyUserName, handleConnectSpotify, handleLogout }: any) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
      <h2>
    {localUsername ? `${localUsername}` : "Utilisateur inconnu"}
    {spotifyUserName && (
      <span className="spotify-name">
        ({spotifyUserName})
      </span>
    )}
  </h2>
      </div>

      <div className="navbar-right">
        {!spotifyUserName && (
          <button onClick={handleConnectSpotify} className="spotify-btn">
            🎧 Lier un compte Spotify
          </button>
        )}
        <button onClick={handleLogout} className="spotify-btn">
          Se déconnecter
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
