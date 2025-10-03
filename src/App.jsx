import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import Dex from "./pages/Dex";
import HeroDetail from "./pages/HeroDetail";
import Raid from "./pages/Raid";
import GrowthDungeon from "./pages/GrowthDungeon";
import SummonSimulation from "./pages/SummonSimulation";
import GuildWar from "./pages/GuildWar";
import "./App.css";

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // 자동재생 막힐 경우 대비
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dex" element={<Dex />} />
        <Route path="/hero/:name" element={<HeroDetail />} />
        <Route path="/raid" element={<Raid />} />
        <Route path="/growth-dungeon" element={<GrowthDungeon />} />
        <Route path="/summon" element={<SummonSimulation />} />
        <Route path="/guild-war" element={<GuildWar />} />
      </Routes>

      {/* GitHub 버튼 */}
      <a
        href="https://github.com/Dongsusin/SavenKnight"
        target="_blank"
        rel="noopener noreferrer"
        className="github-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="28px"
          height="28px"
        >
          <path
            d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 
          0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.73.08-.72.08-.72 
          1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.73 1.26 3.4.96.1-.76.41-1.26.75-1.55-2.55-.29-5.23-1.28-5.23-5.7 
          0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.2-1.49 
          3.17-1.18 3.17-1.18.64 1.57.24 2.73.12 3.02.74.81 1.18 1.84 1.18 3.1 
          0 4.43-2.69 5.41-5.25 5.69.42.37.8 1.1.8 2.22 
          0 1.6-.01 2.88-.01 3.27 0 .31.21.68.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"
          />
        </svg>
      </a>

      {/* 사운드 버튼 */}
      <button
        className={`sound-btn ${isPlaying ? "rotate" : ""}`}
        onClick={togglePlay}
      >
        <img src="/logo.png" alt="logo" className="sound-logo" />
      </button>

      {/* 오디오*/}
      <audio ref={audioRef} src="/ost.mp3" loop />
    </Router>
  );
}

export default App;
