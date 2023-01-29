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

    const bringToGame = () => {
      get("/api/leaveLobby", { socketid: socket.id, roomCode: props.roomCode }).then(
        (lobbyPlayers) => {
          navigate("/game");
        }
      );
    };
    socket.on("start game", bringToGame);

    const updateLobby = (lobbyList) => {
      setPlayerList(lobbyList);
      for (let i = 0; i < lobbyList.length; i++) {
        drawPlayer(lobbyList[i], i);
      }
    };

    socket.on("lobby", updateLobby);
    get("/api/joinLobby", { socketid: socket.id, roomCode: props.roomCode }).then((lobbyList) => {
      if (lobbyList.length > 4) {
        alert("Lobby is full.");
        navigate("/");
      }
      setPlayerList(lobbyList);
      for (let i = 0; i < lobbyList.length; i++) {
        drawPlayer(lobbyList[i], i);
      }
    });

    return () => {
      if (playerList.map((player) => player.google.id).includes(props.userId)) {
        get("/api/leaveLobby", { socketid: socket.id, roomCode: props.roomCode });
      }
      socket.off("start game", bringToGame);
      socket.off("lobby", updateLobby);
    };
  }, []);

  const attemptGameStart = () => {
    get("/api/gameState", { code: props.roomCode }).then((gameState) => {
      if (gameState.isActive) {
        alert("Game in Session; Cannot Join.");
      } else if (playerList.length < 2) {
        alert("Not enough players!");
      } else {
        post("/api/startGame", { code: props.roomCode });
      }
    });
  };
  return (
    <>
      <h1 className="Lobby-title">Game Lobby</h1>
      <h2 className="Lobby-code">Code: {props.roomCode}</h2> {/*TO BE REPLACED WITH ROOM CODES*/}
      {playerList.map((player) => (
        <PlayerBox key={player.googleid} player={player} />
      ))}
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
