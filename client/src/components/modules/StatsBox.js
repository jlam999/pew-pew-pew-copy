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
const profile = (props) => {
  return (
    <div className="StatsBox-container">
      <h1>{props.name}</h1>
      <h2><b>Games Played:</b> {props.gamesPlayed}</h2>
      <h2><b>Games Won:</b> {props.gamesWon}</h2>
      <h2><b>Win Percentage:</b> {props.gamesWon/props.gamesWon}</h2>
      <h2><b>Kills:</b> {props.kills}</h2>
      <h2><b>Deaths:</b> {props.gamesPlayed-props.gamesWon}</h2>
      <h2><b>Kills Per Game:</b> {props.kills/props.gamesPlayed}</h2>
      <h2><b>Deaths Per Game:</b> {(props.gamesPlayed-props.gamesWon)/props.gamesPlayed}</h2>
    </div>
  );
};

export default StatsBox;
