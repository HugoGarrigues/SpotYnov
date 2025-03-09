import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authServices.ts";

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
      <h1>Inscription</h1>
      {message && (
        <p style={{ color: isSuccess ? "green" : "red" }}>{message}</p>
      )}
      <input
        type="text"
        placeholder="Pseudo"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>S'inscrire</button>
    </div>
  );
};

export default Register;
