import React, {useState, useEffect} from "react";
import BackButton from "./BackButton.js";
import StatsBox from "./StatsBox.js";
import { get } from "../../utilities";

import "./Profile.css";

/**
 * Profile is a component that displays the user's stats and a back button to the game menu
 *
 * Proptypes
 * @param {string} _id of user
 * @param {Number} gamesWon of user
 * @param {Number} gamesPlayed of user
 * @param {Number} kills of user
 * @param {string} name of user
 */
const profile = (props) => {
  const [stats, updateStats] = useState([]);

  useEffect(() => {
    get("/api/profile", { parent: props._id }).then((statistics) => {
      updateStats(statistics);
    });
  }, []);

  return (
    <div className="Profile-container">
      <img src={props.imageURL} alt={props.playerName}>
      <BackButton className="BackButton-container"/>
      <StatsBox className="StatsBox-container" gamesWon={props.gamesWon} gamesPlayed={props.gamesPlayed} kills={props.kills} name={props.name}/>
    </div>
  );
};

export default Profile;
