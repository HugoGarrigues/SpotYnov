import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Callback from "./pages/Callback.js";
import RecentlyPlayed from "./pages/RecentlyPlayed.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/recently-played" element={<RecentlyPlayed />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
