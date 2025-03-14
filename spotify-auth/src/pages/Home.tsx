import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"; // Ajoute le fichier CSS pour le design

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="title">SpotYnov</h1>
      <div className="buttons-container">
        <Link to="/register">
          <button className="register-btn">S'inscrire</button>
        </Link>
        <Link to="/login">
          <button className="login-btn">Se connecter</button>
        </Link>
      </div>
    </div>

    
    
  );
};

export default Home;
