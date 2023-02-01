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
        <div className="HowToPlay-Box">Use WASD or Arrow Keys to move</div>
        <div className="HowToPlay-Box">
          Use mouse to aim and shoot. Be careful though! Every time you shoot, your health decreases
          slightly.
        </div>
        <div className="HowToPlay-Box">
          Move over bullets or press and hold the space bar to retrieve you bullets.
        </div>
        <div className="HowToPlay-Box">
          There are health packs on the field that help you regain health!
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
