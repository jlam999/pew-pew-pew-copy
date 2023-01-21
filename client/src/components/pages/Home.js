import React, { Component } from "react";
import NewCodeInput from "../modules/RoomCode.js";
import ProfileButton from "../modules/ProfileButton.js";
import { Link } from "@reach/router";

import "../../utilities.css";
import "./Home.css";

const Home = (props) => {
  return (
    <div className="u-textCenter">
      <div className="Home-title">
        <h1>Pew Pew Pew</h1>
      </div>
      <button className="Home-buttonContainer">
        <h3 className="Home-buttonText">Create a Game</h3>
      </button>
      <div>
        <h4>OR</h4>
      </div>
      <NewCodeInput defaultText="Enter Code" />
      {/*<button className="Home-profileButton">
                <img src={ProfileImg} alt="Profile" className="Home-profileImg"/>
                </button>*/}
      <ProfileButton
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
      />
      <Link to="/game"></Link>
    </div>
  );
};

export default Home;
