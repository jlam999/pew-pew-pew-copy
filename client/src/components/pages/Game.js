import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { draw } from "../GameCanvas.js";
import { handleKeyUp, handleKeyDown, handleClick } from "../../input.js";
import { Link } from "@reach/router";

import "./Game.css";

const Game = (props) => {
  const [winnerModal, setWinnerModal] = useState(null);
  const [aloneModal, setAloneModal] = useState(null);
  const [joined, setJoined] = useState(false);

  // add event listener on mount
  useEffect(() => {
    // remove event listener on unmount
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
      post("/api/despawn", { userid: props.userId });
      setJoined(false);
    };
  }, []);

  // Turn on the socket to update the game periodically
  useEffect(() => {
    socket.on("update", (update) => {
      processUpdate(update);
    });
  }, []);

  const updateStats = (gameState) => {
    const requestBody = {
      win: 0,
      kills: 0,
    };
    if (props.userId === gameState.winner) {
      requestBody.win = 1;
      requestBody.kills = 1;
    }
    post("/api/addGameStats", requestBody);
  };

  //This function will redraw the canvas based on the update
  // update will be in the format of the gameState.
  const processUpdate = (update) => {
    const homeLink = (
      <Link to="/">
        <button onClick={() => updateStats(update)}>Please Return Home</button>
      </Link>
    );

    if (update.winner === null || !Object.keys(update.players).includes(props.userId)) {
      setWinnerModal(null);
    } else if (update.winner === props.userId) {
      setWinnerModal(<div className="Banner"> You Won! {homeLink}</div>);
    } else {
      setWinnerModal(<div className="Banner"> You Lost. {homeLink}</div>);
    }

    if (
      update.isActive &&
      Object.keys(update.players).length === 1 &&
      update.players[props.userId] !== undefined
    ) {
      setAloneModal(<div>Your opponent has left! {homeLink}</div>);
    } else {
      setAloneModal(null);
    }
    draw(update);
  };

  const attemptJoinGame = () => {
    if (!joined) {
      get("/api/isActive").then((isActive) => {
        if (isActive) {
          alert("Game in Session; Cannot Join.");
        } else {
          setJoined(true);
          window.addEventListener("keydown", handleKeyDown);
          window.addEventListener("keyup", handleKeyUp);
          window.addEventListener("click", handleClick);
          post("/api/spawn", { userid: props.userId });
        }
      });
    }
  };

  return (
    <>
      {props.userId ? (
        <div className="GameBox">
          <canvas id="gameCanvas" width={500} height={500} className="GameCanvas"></canvas>
          {winnerModal}
          {aloneModal}
          {joined ? <></> : <button onClick={attemptJoinGame}>Join Game</button>}
        </div>
      ) : (
        <div>Please Login First!</div>
      )}
    </>
  );
};

export default Game;
