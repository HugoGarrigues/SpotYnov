import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authServices.ts";
import "../styles/Auth.css"; // Fichier CSS pour le design uniforme

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await loginUser(username, password);

    if (response.success && response.token) {
      // ✅ Stocker le username et le token après une connexion réussie
      localStorage.setItem("username", username);
      localStorage.setItem("token", response.token);

      // ✅ Redirection vers le Dashboard
      navigate("/dashboard");
    } else {
      setError(response.message || "Une erreur inconnue s'est produite");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-text">
      <h2 className="auth-title">Connexion</h2>

      {/* Affichage de l'erreur si présente */}
      {error && <p className="error-message">{error}</p>}

      {/* Champs de connexion */}
      <div className="auth-inputs">
        <input
          className="login-input"
          type="text"
          placeholder="Pseudo"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
        className="login-input"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Bouton de connexion */}
      <button className="login-btn2" onClick={handleLogin}>
        Se connecter
      </button>

      {/* Lien vers l'inscription */}
      <p className="redirect-text">
        Pas encore inscrit ? <a href="/register">Créer un compte</a>
      </p>
      </div>
    </div>
  );
};

export default Login;
