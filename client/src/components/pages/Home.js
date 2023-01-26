import React from "react";
import NewCodeInput from "../modules/RoomCode.js";
import ProfileButton from "../modules/ProfileButton.js";
import { Link } from "@reach/router";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
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
  const connectSocket = () => {
    post("/api/initsocket", { socketid: socket.id });
    post("/api/spawn", { userid: props.userId });
  }

  return (
    <div className="Home-titleContainer">
      <div className="Home-title">
        <h1>Pew Pew Pew</h1>
      </div>
      <Link to="/lobby">
        <button className="Home-buttonContainer" onClick={connectSocket}>
          <h3 className="Home-buttonText">Join a Game</h3>
        </button>
      </Link>
      <div>
        <h4>OR</h4>
      </div>
      <NewCodeInput onSubmit="" /> {/*NEED TO CODE SUBMISSION OF ROOM CODE*/}
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
