import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authServices.ts";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await loginUser(username, password);

    if (response.success && response.token) {
      window.localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } else {
      setError(response.message || "Une erreur inconnue s'est produite");
    }
  };

  return (
    <div className="auth-container">
      <h1>Connexion</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="text" placeholder="Pseudo" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
};

export default Login;
