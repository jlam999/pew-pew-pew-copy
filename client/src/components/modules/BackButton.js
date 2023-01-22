import React from "react";
import { Link } from "@reach/router";
import "./BackButton.css";
import BackButtonImg from "../../public/back-arrow.jpg"

/**
 * Back button rendered on the profile page that returns user to home
 */
const BackButton = () => {
  return (
    <div className="BackButton-container">
      <Link to="/">
        <img src={BackButtonImg} alt="Back Button" className="BackButton-img"/>
      </Link> {/*we should call the menu MeNU to emphasize the U&I theme*/}
    </div>
  );
};

export default BackButton;
