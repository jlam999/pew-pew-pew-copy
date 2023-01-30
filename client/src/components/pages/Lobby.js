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
    if (props.roomCode === null) {
      console.log("no room code yet");
    } else {
      document.title = "Lobby";

      const bringToGame = async () => {
        await get("/api/leaveLobby", { socketid: socket.id, roomCode: props.roomCode });
        await post("/api/spawn", {
          userid: props.userId,
          socketid: socket.id,
          code: props.roomCode,
        });
        navigate("/game");
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
        console.log("dismounting Lobby");
        // if (playerList.map((player) => player.google.id).includes(props.userId)) {
        get("/api/leaveLobby", { socketid: socket.id, roomCode: props.roomCode });
        // }
        socket.off("start game", bringToGame);
        socket.off("lobby", updateLobby);
      };
    }
  }, [props.roomCode]);

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
      {props.roomCode !== null ? (
        <>
          <h1 className="Lobby-title">Game Lobby</h1>
          <h2 className="Lobby-code">Code: {props.roomCode}</h2>{" "}
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
      ) : (
        <>
          <div>You don't have a room code.</div>
          <Link to="/">Please Return Home.</Link>
        </>
      )}
    </>
  );
};

export default Lobby;
