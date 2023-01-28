import { Redirect, Link, useNavigate } from "@reach/router";
import React, { useState, useEffect } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";
import { handleKeyDown, handleKeyUp, handleClick } from "../../input.js";
import PlayerBox from "../modules/PlayerBox.js";

import "./Lobby.css";

const Lobby = (props) => {
  const navigate = useNavigate();
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    document.title = "Lobby";
    console.log("mounting");

    socket.on("start game", () => {
      post("/api/spawn", { userid: props.userId });
      navigate("/game");
    });

    const updateLobby = (lobbyList) => {
      console.log(lobbyList);
      setPlayerList(
        lobbyList.map((player) => <PlayerBox key={player.googleid} name={player.name} />)
      );
    };

    socket.on("lobby", updateLobby);
    get("/api/joinLobby").then((lobbyList) => {
      setPlayerList(
        lobbyList.map((player) => <PlayerBox key={player.googleid} name={player.name} />)
      );
    });

    return () => {
      console.log("lobby dismounted");
      get("/api/leaveLobby");
      socket.off("lobby", updateLobby);
    };
  }, []);

  const attemptGameStart = () => {
    get("/api/gameState").then((gameState) => {
      console.log(gameState);
      if (gameState.isActive) {
        alert("Game in Session; Cannot Join.");
      } else if (playerList.length < 2) {
        alert("Not enough players!");
      } else {
        post("/api/startGame", {});
      }
    });
  };

  //const players = playerList.map((playerName) => <PlayerBox name={playerName} />);

  return (
    <>
      <h1 className="Lobby-title">Game Lobby</h1>
      <h2 className="Lobby-code">Code: ABCXYZ</h2> {/*TO BE REPLACED WITH ROOM CODES*/}
      <p>Players:</p>
      {playerList}
      <button className="Lobby-startButton" onClick={attemptGameStart}>
        Start Game
      </button>
    </>
  );
};

export default Lobby;
