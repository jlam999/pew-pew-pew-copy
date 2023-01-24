import React, { Component } from "react";
import NewCodeInput from "../modules/RoomCode.js";
import ProfileButton from "../modules/ProfileButton.js";
import { Link } from "@reach/router";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./Home.css";

/**
 * Renders the home page, path is "/"
 *
 * The following props are used:
 * @param {Function} handleLogin for Google Login
 * @param {Function} handleLogout for Google Logout
 * @param {String} userId (state) to track user using Google ID
 */

const Home = (props) => {
  return (
    <div className="Home-titleContainer">
      <div className="Home-title">
        <h1>Pew Pew Pew</h1>
      </div>
      <Link to="/game">
        <button className="Home-buttonContainer">
          <h3 className="Home-buttonText">Create a Game</h3>
        </button>
      </Link>
      <div>
        <h4>OR</h4>
      </div>
      <NewCodeInput onSubmit="" /> {/*NEED TO CODE SUBMISSION OF ROOM CODE*/}
      {/*<button className="Home-profileButton">
                <img src={ProfileImg} alt="Profile" className="Home-profileImg"/>
                </button>*/}
      <ProfileButton
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        userId={props.userId}
        className="Home-shrunkenPosition"
      />
    </div>
  );
};

export default Home;
