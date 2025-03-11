import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // L'access token est retourné dans le fragment de l'URL : #access_token=...&token_type=...&expires_in=...
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");

    if (token) {
      window.localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      // En cas d'erreur ou d'absence de token, vous pouvez rediriger vers une page d'erreur ou la page d'accueil
      navigate("/");
    }
  }, [navigate]);

  return <div>Chargement...</div>;
};

export default Callback;
