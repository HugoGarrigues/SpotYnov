import React, { useState, useEffect } from "react";
import axios from "axios";

interface Track {
  track: {
    name: string;
    artists: { name: string }[];
  };
}

const RecentlyPlayed: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const accessToken = localStorage.getItem("spotify_access_token");

  useEffect(() => {
    if (!accessToken) return;

    axios
      .get("https://api.spotify.com/v1/me/player/recently-played", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setTracks(res.data.items);
      })
      .catch((err) => console.error(err));
  }, [accessToken]);

  return (
    <div>
      <h1>Recently Played Tracks</h1>
      <ul>
        {tracks.map((track, index) => (
          <li key={index}>
            {track.track.name} - {track.track.artists.map(a => a.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentlyPlayed;
