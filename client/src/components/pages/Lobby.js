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

  const getPlayers = () => {
    get("/api/gameState").then((gameState) => {
      const promiseArray = [];
      for (let playerId of Object.keys(gameState.players)) {
        let user = get("/api/user", { googleid: playerId });
        promiseArray.push(user);
      }
      Promise.all(promiseArray).then((array) => {
        let names = array.map((player) => {
          return player.name;
        });
        setPlayerList(names);
      });
    });
  };

  useEffect(() => {
    getPlayers();
  }, []);

  // console.log(players)

  useEffect(() => {
    document.title = "Lobby";
    socket.on("start game", () => {
      navigate("/game");
    });
  }, []);

  const attemptGameStart = () => {
    get("/api/gameState").then((gameState) => {
      console.log(gameState);
      if (gameState.isActive) {
        alert("Game in Session; Cannot Join.");
      } else if (Object.keys(gameState.players).length < 2) {
        alert("Not enough players!");
      } else {
        post("/api/startGame", {});
      }
    });
  };

  const players = playerList.map((playerName) => <PlayerBox name={playerName} />);

  return (
    <>
      <h1 className="Lobby-title">Game Lobby</h1>
      <h2 className="Lobby-code">Code: ABCXYZ</h2> {/*TO BE REPLACED WITH ROOM CODES*/}
      <p>Players:</p>
      {players}
      <button className="Lobby-startButton" onClick={attemptGameStart}>
        Start Game
      </button>
    </>
  );
};

export default Lobby;
