import React from "react";

import "../../utilities.css";
import "./HowToPlay.css";
import "../pages/Lobby.css";

const HowToPlay = () => {
  return (
    <div>
      <input type="checkbox" />
      <label className="HowToPlay-Label">
        <p className="HowToPlay-Text">How To Play</p>
      </label>
      <div id="HowToPlay-Menu">
        <div className="HowToPlay-Box">
          <p className="HowToPlay-Instructions">Use WASD or Arrow Keys to move your base.</p>
          <video src="./instrMove.mp4" autoPlay muted loop type="video/mp4" className="demoVid1"/>
        </div>
        <div className="HowToPlay-Box">
          <p className="HowToPlay-Instructions">Use mouse to aim and shoot. However, shooting decreases your health slightly.</p>
          <video src="./instrShoot.mp4" autoPlay muted loop type="video/mp4" className="demoVid1"/>     
        </div>
        <div className="HowToPlay-Box">
          <p className="HowToPlay-Instructions">Move over bullets or press and hold the space bar to retrieve you bullets.</p>
          <video src="./instrPull.mp4" autoPlay muted loop type="video/mp4" className="demoVid1"/>
        </div>
        <div className="HowToPlay-Box">
          <p className="HowToPlay-Instructions">There are health packs on the field that help you regain health!</p>
          <video src="./instrHealth.mp4" autoPlay muted loop type="video/mp4" className="demoVid1"/>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
