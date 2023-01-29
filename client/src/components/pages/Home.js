import React from "react";
import NewCodeInput from "../modules/RoomCode.js";
import ProfileButton from "../modules/ProfileButton.js";
import { Link, useNavigate } from "@reach/router";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket.js";

import "./Home.css";

/**
 * Renders the home page, path is "/"
 *
 * The following props are used:
 * @param {Function} handleLogin for Google Login
 * @param {Function} handleLogout for Google Logout
 * @param {String} userId (state) to track user using Google ID
 * @param {Function} createLobby to create a room Lobby
 */

const Home = (props) => {
  const connectSocket = () => {
    post("/api/spawn", { userid: props.userId });
  };
  const navigate = useNavigate();

  const createNewLobby = async () => {
    const code = await props.createLobby();
    get("/api/joinLobby", {socketid: socket.id, roomCode: code});
    // console.log("HIHIHI")
    // console.log(code)
    navigate(`/lobby`)
  }
  
  const enterLobby = async (code) => {
    console.log(code)
    await props.joinLobby(code);
    console.log("in lobby", code)
    get("/api/joinLobby", {socketid: socket.id, roomCode: code});
    navigate(`/lobby`)
  }
  
  return (
    <div className="Home-titleContainer">
      <div className="Home-title">
        <h1>Pew Pew Pew</h1>
      </div>
      {/* <Link to="/lobby"> */}
        <button className="Home-buttonContainer" onClick={createNewLobby}>
          <h3 className="Home-buttonText">Join a Game</h3>
        </button>
      {/* </Link> */}
      <div>
        <h4>OR</h4>
      </div>
      <NewCodeInput onSubmit={enterLobby} /> {/*NEED TO CODE SUBISSION OF ROOM CODE*/}
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
