import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authServices.ts";
import "../styles/Auth.css"; // Réutilisation du même fichier CSS

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await registerUser(username, password);

    setMessage(response.message);
    setIsSuccess(response.success);

    if (response.success) {
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-text">
      <h2 className="auth-title">Inscription</h2>

      {/* Affichage du message de confirmation ou d'erreur */}
      {message && (
        <p className={`message-text ${isSuccess ? "success-message" : "error-message"}`}>
          {message}
        </p>
      )}

      {/* Champs de formulaire */}
      <div className="auth-inputs">
        <input
          type="text"
          placeholder="Pseudo"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
      </div>

      {/* Bouton d'inscription */}
      <button className="login-btn2" onClick={handleRegister}>
        S'inscrire
      </button>

      {/* Lien vers la connexion */}
      <p className="redirect-text">
        Déjà inscrit ? <a href="/login">Se connecter</a>
      </p>
    </div>
    </div>
  );
};

export default Register;
