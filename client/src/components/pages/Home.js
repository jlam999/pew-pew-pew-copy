import React, { Component } from "react";
import NewCodeInput from "../modules/RoomCode.js";
import ProfileButton from "../modules/ProfileButton.js";
import { Link } from "@reach/router";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";

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
  const joinGame = () => {
    post("/api/spawn", { userid: props.userId });
  };

  return (
    <div className="u-textCenter">
      <div className="Home-title">
        <h1>Pew Pew Pew</h1>
      </div>
      <button className="Home-buttonContainer">
        <Link to="/game">
          <h3 className="Home-buttonText" onClick={joinGame}>
            Create a Game
          </h3>
        </Link>
      </button>
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
      />
    </div>
  );
};

export default Home;
