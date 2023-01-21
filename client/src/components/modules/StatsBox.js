import React from "react";
import { get } from "../../utilities";

import "./StatsBox.css";

/**
 * Stats is a component that displays the user's stats
 *
 * Proptypes
 * @param {Number} gamesWon of user
 * @param {Number} gamesPlayed of user
 * @param {Number} kills of user
 * @param {string} name of user
 */
const StatsBox = (props) => {
  return (
    <div>
      <h1 className="StatsBox-name">{props.name}'s Stats</h1>
      <div className="StatsBox-largeContainer">
        <div className="StatsBox-containerName">
          <h2><b>Games Played:</b></h2>
          <h2><b>Games Won:</b></h2>
          <h2><b>Win Percentage:</b></h2>
          <h2><b>Kills:</b></h2>
          <h2><b>Deaths:</b></h2>
          <h2><b>Kills Per Game:</b></h2>
          <h2><b>Deaths Per Game:</b></h2>
        </div>
        <div className="StatsBox-containerNumber">
          <h2>{props.gamesPlayed}</h2>
          <h2>{props.gamesWon}</h2>
          <h2>{props.gamesWon/props.gamesWon}</h2>
          <h2>{props.kills}</h2>
          <h2>{props.gamesPlayed-props.gamesWon}</h2>
          <h2>{props.kills/props.gamesPlayed}</h2>
          <h2>{(props.gamesPlayed-props.gamesWon)/props.gamesPlayed}</h2>
        </div>
      </div>
    </div>
  );
};

export default StatsBox;
