import { Redirect, Link, useNavigate } from "@reach/router";
import React, { useState, useEffect } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";
import { handleKeyDown, handleKeyUp, handleClick } from "../../input.js";
import PlayerBox, { drawPlayer } from "../modules/PlayerBox.js";

import "./Lobby.css";

const Lobby = (props) => {
  const navigate = useNavigate();
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    document.title = "Lobby";

    socket.on("start game", () => {
      post("/api/spawn", { userid: props.userId });
      navigate("/game");
    });

    const updateLobby = (lobbyList) => {
      setPlayerList(lobbyList.map((player) => <PlayerBox key={player.googleid} player={player} />));
    };

    socket.on("lobby", updateLobby);
    get("/api/joinLobby").then((lobbyList) => {
      if (lobbyList.length > 4) {
        alert("Lobby is full.");
        navigate("/");
      }
      setPlayerList(lobbyList.map((player) => <PlayerBox key={player.googleid} player={player} />));
    });

    return () => {
      get("/api/leaveLobby");
      socket.off("lobby", updateLobby);
    };
  }, []);

  const attemptGameStart = () => {
    get("/api/gameState").then((gameState) => {
      if (gameState.isActive) {
        alert("Game in Session; Cannot Join.");
      } else if (playerList.length < 2) {
        alert("Not enough players!");
      } else {
        post("/api/startGame", {});
      }
    });
  };

  return (
    <>
      <h1 className="Lobby-title">Game Lobby</h1>
      <h2 className="Lobby-code">Code: ABCXYZ</h2> {/*TO BE REPLACED WITH ROOM CODES*/}
      <p>Players:</p>
      {playerList}
      {playerList.length < 2 ? (
        <div className="Lobby-waitButton">
          <p className="Lobby-waitText">Waiting...</p>
        </div>
      ) : (
        <button className="Lobby-startButton" onClick={attemptGameStart}>
          Start Game
        </button>
      )}
    </>
  );
};

export default Lobby;
