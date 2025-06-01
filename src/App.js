import React, { useState, useEffect, useRef } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthForm from "./AuthForm";
import Navbar from "./Navbar";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  // Logout handler for Navbar
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Search iTunes API
  const searchSongs = async (e) => {
    e.preventDefault();
    if (!query) return;
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=10`
    );
    const data = await res.json();
    setTracks(data.results || []);
  };

  // Play a track
  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (!playlist.find((t) => t.trackId === track.trackId)) {
      setPlaylist([...playlist, track]);
    }
  };

  // Pause/Resume
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
    }
  };

  // When song ends, play next in playlist
  const handleEnded = () => {
    if (!currentTrack || playlist.length === 0) return;
    const idx = playlist.findIndex((t) => t.trackId === currentTrack.trackId);
    if (idx !== -1 && idx < playlist.length - 1) {
      setCurrentTrack(playlist[idx + 1]);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  if (!user) {
    return (
      <div className="App">
        <h1 className="app-title">🎵 React Music App</h1>
        <Navbar user={null} onLogout={handleLogout} />
        <AuthForm user={user} setUser={setUser} />
      </div>
    );
  }

  return (
    <div className="App">
      <h1 className="app-title">🎵 React Music App</h1>
      <Navbar user={user} onLogout={handleLogout} />
      <form onSubmit={searchSongs}>
        <input
          type="text"
          placeholder="Search for songs or artists"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="results">
        <h2>Results</h2>
        {tracks.map((track) => (
          <div className="track" key={track.trackId}>
            <img src={track.artworkUrl100} alt={track.trackName} />
            <div>
              <strong>{track.trackName}</strong>
              <div>{track.artistName}</div>
              <button onClick={() => playTrack(track)}>Play</button>
            </div>
          </div>
        ))}
      </div>
      <div className="player">
        <h2>Now Playing</h2>
        {currentTrack ? (
          <div>
            <img src={currentTrack.artworkUrl100} alt={currentTrack.trackName} />
            <div>
              <strong>{currentTrack.trackName}</strong> - {currentTrack.artistName}
            </div>
            <audio
              ref={audioRef}
              src={currentTrack.previewUrl}
              autoPlay={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleEnded}
              controls
            />
            <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
          </div>
        ) : (
          <div>No song playing</div>
        )}
      </div>
      <div className="playlist">
        <h2>Playlist</h2>
        {playlist.length === 0 ? (
          <div>Playlist is empty</div>
        ) : (
          playlist.map((track, idx) => (
            <div key={track.trackId} className="playlist-track">
              {idx + 1}. {track.trackName} - {track.artistName}
              <button onClick={() => setCurrentTrack(track)}>Play</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;