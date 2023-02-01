import React, { useEffect, useState } from "react";
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
  // const connectSocket = () => {
  //   post("/api/spawn", { userid: props.userId });
  // };
  const navigate = useNavigate();
  const [videoSource, setVideoSource] = useState(null);

  const createNewLobby = async () => {
    const code = await props.createLobby();
    // await get("/api/joinLobby", { socketid: socket.id, roomCode: code });
    navigate(`/lobby`);
  };

  const enterLobby = async (code) => {
    const response = await get("/api/joinLobby", { socketid: socket.id, roomCode: code });
    console.log(JSON.stringify(response));
    if (JSON.stringify(response) !== "{}") {
      await props.joinLobby(code);
      navigate(`/lobby`);
    } else {
      alert("Invalid Room Code");
    }
  };

  // let videoSource = "./video1.mp4";
  useEffect(() => {
    const picker = Math.floor(Math.random() * 6) + 1;
    const url = "./video" + picker + ".mp4";
    setVideoSource(url);
    setInterval(() => {
      const picker = Math.floor(Math.random() * 6) + 1;
      const url = "./video" + picker + ".mp4";
      setVideoSource(url);
    }, 10000);
  }, [videoSource]);

  return (
    <div className="Home-titleContainer">
      <video autoPlay loop muted src={videoSource} type="video/mp4" className="Home-backgroundVid"/>
      <div className="Home-title">
        <h1>Pew Pew Pew</h1>
      </div>
      {props.userId ? (
        <div> 
          <button className="Home-buttonContainer" onClick={createNewLobby}>
            <h3 className="Home-buttonText">Create a Game</h3>
          </button>
          <div>
            <h4>OR</h4>
          </div>
        <NewCodeInput onSubmit={enterLobby} /> {/*NEED TO CODE SUBISSION OF ROOM CODE*/}
      </div>
      )   :   (
        <h1>Please Login First!</h1>
      )}
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
