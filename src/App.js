import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Cake from "./components/Cake";
import Balloons from "./components/Balloons";
import Stars from "./components/Stars";
import birthdayMusic from "./assets/birthday.mp3";
import HeartEffect from "./components/HeartEffect";
import FallingConfetti from "./components/FallingConfetti";

function App() {
  const [showSurprise, setShowSurprise] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const audioRef = useRef(null);

  // 🎞️ Image list for slideshow
  const images = [
    require("./assets/pic2.jpeg"),
    require("./assets/pic3.jpeg"),
    require("./assets/pic2.jpeg"),
    require("./assets/pic3.jpeg"),
  ];

  const handleClick = () => {
    setShowSurprise(true);
  };

  const handleCakeClick = () => {
    setCelebrate(true);
  };

  // 🎵 Play music once the surprise shows
  useEffect(() => {
    if (showSurprise && audioRef.current) {
      audioRef.current.play().catch(() => {
        console.log("User interaction required to play audio.");
      });
    }
  }, [showSurprise]);

  // 🎞️ Auto change slideshow images every 3 seconds
  useEffect(() => {
    if (celebrate) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [celebrate, images.length]);

  return (
    <div className="App">
      <audio ref={audioRef} src={birthdayMusic} loop></audio>

      {/* ❤️ Hearts appear after "Show Surprise" */}
      {showSurprise && <HeartEffect />}

      {!showSurprise ? (
        // 🎈 INTRO SCREEN
        <div className="intro fadeIn">
          <h1 id="Suprise">🎈 Click Below for a Surprise! 🎈</h1>
          <button className="surprise-btn" onClick={handleClick}>
            Click Me! 🎉
          </button>
        </div>
      ) : (
        // 🎂 SURPRISE SCREEN
        <div className="surprise fadeInSlow">
          {/* 💖 Cake (click to trigger celebration) */}
          <div onClick={handleCakeClick} style={{ cursor: "pointer" }}>
            <Cake />
          </div>

          {/* 🌟 After clicking cake → show celebration effects */}
          {celebrate && (
            <>
              {/* 🎁 Pink glowing box */}
              <div className="celebration-box"></div>

              {/* 🎞️ Image Slideshow */}
              <div className="slideshow">
                <img
                  src={images[currentImage]}
                  alt="Birthday Memory"
                  className="slideshow-img fade"
                />
              </div>

              <Stars />
              <Balloons />
              <HeartEffect />
              <FallingConfetti />
            </>
          )}

          <div className="wish-text">
            <h1>🎂 Happy Birthday! 🎂</h1>
            <p>May your day be filled with joy, laughter, and love!</p>
            {!celebrate && <p id="CeleBtn"> Tap the Cake to Celebrate </p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
