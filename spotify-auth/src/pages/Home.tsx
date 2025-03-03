import React from "react";
import { getAuthorizeUrl } from "../services/authServices.js";

const Home: React.FC = () => {
  return (
    <div>
      <h1>Spotify Auth</h1>
      <a href={getAuthorizeUrl()}>Login with Spotify</a>
    </div>
  );
};

export default Home;
