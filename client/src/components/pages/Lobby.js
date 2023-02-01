import { Link, useNavigate } from "@reach/router";
import React, { useState, useEffect } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";
import PlayerBox, { drawPlayer } from "../modules/PlayerBox.js";
import NoRoomCode from "./NoRoomCode.js";

import HowToPlay from "../modules/HowToPlay.js";
import BackButton from "../modules/BackButton.js";

import "./Lobby.css";
import "../../utilities.css";
import "../modules/BackButton.css";

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

      const updateLobby = (newLobbyList) => {
        setPlayerList(newLobbyList);
        for (let i = 0; i < 4; i++) {
          drawPlayer(newLobbyList[i], i);
        }
      };

      socket.on("lobby", updateLobby);

      get("/api/joinLobby", { socketid: socket.id, roomCode: props.roomCode }).then((lobbyList) => {
        if (lobbyList.length > 4) {
          alert("Lobby is full.");
          navigate("/");
        } else {
          setPlayerList(lobbyList);
          for (let i = 0; i < lobbyList.length; i++) {
            drawPlayer(lobbyList[i], i);
          }
        }
      });

      return () => {
        get("/api/leaveLobby", { socketid: socket.id, roomCode: props.roomCode });
        socket.off("start game", bringToGame);
        socket.off("lobby", updateLobby);
      };
    }
  }, [props.roomCode]);

  const attemptGameStart = () => {
    get("/api/gameState", { code: props.roomCode }).then((gameState) => {
      if (gameState.isActive) {
        alert("Game in Session; Cannot Join.");
      } else {
        post("/api/startGame", { code: props.roomCode });
      }
    });
  };
  return (
    <>
      {props.roomCode !== null ? (
        <div className="Lobby-all">
          <HowToPlay />
          <div>
            <BackButton className="BackButton-container" />
            <div className="Lobby-centerText">
              <h1 className="Lobby-title">Game Lobby</h1>
              <h2 className="Lobby-code">Code: {props.roomCode}</h2>{" "}
              {playerList.map((player) => (
                <PlayerBox player={player} />
              ))}
              {playerList.filter((player) => {
                return player !== null;
              }).length < 2 ? (
                <div className="Lobby-waitButton">
                  <p className="Lobby-waitText">Waiting...</p>
                </div>
              ) : (
                <button className="Lobby-startButton" onClick={attemptGameStart}>
                  Start Game
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <NoRoomCode />
      )}
    </>
  );
};

export default Lobby;
