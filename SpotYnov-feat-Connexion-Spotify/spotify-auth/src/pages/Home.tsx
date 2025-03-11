import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div>
      <h1>Bienvenue sur SpotYnov API</h1>
      <Link to="/register"><button>S'inscrire</button></Link>
      <Link to="/login"><button>Se connecter</button></Link>
    </div>
  );
};

export default Home;