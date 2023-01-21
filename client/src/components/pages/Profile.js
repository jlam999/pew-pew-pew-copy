import React, {useState, useEffect} from "react";
import BackButton from "../modules/BackButton.js";
import StatsBox from "../modules/StatsBox.js";
import { get } from "../../utilities";

import "./Profile.css";

/**
 * User is a component that displays the user's stats and a back button to the game menu
 *
 * Proptypes
 * @param {string} _id of user
 * @param {Number} gamesWon of user
 * @param {Number} gamesPlayed of user
 * @param {Number} kills of user
 * @param {string} name of user
 */
const User = (props) => {
  const [stats, updateStats] = useState([]);

  useEffect(() => {
    get("/api/profile", { parent: props._id }).then((statistics) => {
      updateStats(statistics);
    });
  }, []);

  return (
    <div>
      <BackButton className="BackButton-container"/>
      <div>
        <StatsBox className="StatsBox-container" 
          gamesWon={props.gamesWon} 
          gamesPlayed={props.gamesPlayed} 
          kills={props.kills} 
          name={props.name}/>
      </div> 
    </div>
  );
};

export default User;