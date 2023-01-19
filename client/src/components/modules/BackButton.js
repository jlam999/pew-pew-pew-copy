import React from "react";
import { Link } from "@reach/router";
import "./BackButton.css";

/**
 * Profile is a component that displays the user's stats and a back button to the game menu
 */
const profile = (props) => {
  return (
    <div className="BackButton-container">
      <Link to="/MeNU/">Back</Link> // we should call the menu MeNU to emphasize the U&I theme
    </div>
  );
};

export default BackButton;
