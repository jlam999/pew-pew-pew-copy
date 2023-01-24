import React, { useState, useEffect } from "react";
import BackButton from "../modules/BackButton.js";
import StatsBox from "../modules/StatsBox.js";
import { get } from "../../utilities";

import "./Profile.css";

/**
 * User is a component that displays the user's stats and a back button to the game menu
 * Renders the Profile Page, which contains user stats, path is "/profile/{User's Google Id}"
 *
 * The following props are used:
 * @param {String} userId to track user through Google ID
 */
const Profile = (props) => {
  const [user, setUser] = useState("");
  const [stats, updateStats] = useState([]);

  useEffect(() => {
    get("/api/user", { googleid: props.userId }).then((user) => {
      setUser(user[0]);
    });
    get("/api/stats", { googleid: props.userId }).then((stats) => updateStats(stats[0]));
  }, []);

  return (
    <div>
      <BackButton className="BackButton-container" />
      <div>
        {props.userId ? (
          <StatsBox className="StatsBox-container" user={user} stats={stats} />
        ) : (
          <p className="LoginToSeeStatsText"> Login to track and see your stats!</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
