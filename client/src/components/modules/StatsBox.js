import React from "react";

import "./StatsBox.css";

/**
 * Component that renders the user's stats on their home page
 *
 * The following props are used:
 * @param {Object} user 
 * @param {Object} stats
 */
const StatsBox = (props) => {
  return (
    <div className="fullStatsBox">
      <h1 className="StatsBox-name">{props.user.name}'s Stats</h1>
      {(props.stats.games===0) ? (
          <h2>Play a game first!</h2>
      )   :   (
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
          <h2>{props.stats.games}</h2>
          <h2>{props.stats.wins}</h2>
          <h2>{Math.round(props.stats.wins/props.stats.games*1000)/10+"%"}</h2>
          <h2>{props.stats.kills}</h2>
          <h2>{props.stats.games-props.stats.wins}</h2>
          <h2>{Math.round(props.stats.kills/props.stats.games*1000)/1000}</h2>
          <h2>{Math.round((props.stats.games-props.stats.wins)/props.stats.games*1000)/1000}</h2>
        </div>
      </div>
      )}
    </div>
  );
};

export default StatsBox;
