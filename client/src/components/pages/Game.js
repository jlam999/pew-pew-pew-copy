import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { draw } from "../GameCanvas.js";
import { handleKeyUp, handleKeyDown, handleClick } from "../../input.js";
import { Link, useNavigate } from "@reach/router";

import "./Game.css";

const Game = (props) => {
  const [winnerModal, setWinnerModal] = useState(null);
  const [aloneModal, setAloneModal] = useState(null);
  const navigate = useNavigate();

  // add event listener on mount
  useEffect(() => {
    get("/api/gameState").then((gameState) => {
      if (!Object.keys(gameState.players).includes(props.userId)) {
        alert("You are not part of this game");
        navigate("/");
      }
    });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("click", handleClick);
    // remove event listener on unmount
    return () => {
      console.log("dismounting");
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
      post("/api/despawn", { userid: props.userId });
    };
  }, []);

  // Turn on the socket to update the game periodically
  useEffect(() => {
    const dummy = (update) => {
      processUpdate(update);
    };
    socket.on("update", dummy);
    const leaveGame = () => {
      navigate("/lobby");
    };
    socket.on("end game", leaveGame);
    return () => {
      socket.off("update", dummy);
      socket.off("end game", leaveGame);
    };
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
    const leaveAfterGameOver = () => {
      updateStats(update);
      // post("/api/despawn", { userid: props.userId });
    };
    const lobbyLink = (
      <Link to="/lobby">
        <button onClick={leaveAfterGameOver}>Please Return to Lobby</button>
      </Link>
    );

    if (update.winner === props.userId) {
      setWinnerModal(<div className="Banner"> You Won! {lobbyLink}</div>);
    } else if (update.players[props.userId].health <= 0) {
      setWinnerModal(<div className="Banner"> You Lost. {lobbyLink}</div>);
    } else {
      setWinnerModal(null);
    }

    if (
      update.isActive &&
      Object.keys(update.players).length === 1 &&
      update.players[props.userId] !== undefined
    ) {
      setAloneModal(<div> Your opponent(s) left! {lobbyLink}</div>);
    } else {
      setAloneModal(null);
    }
    draw(update, props.userId);
  };

  return (
    <>
      {props.userId ? (
        <div className="GameBox">
          <canvas id="gameCanvas" width={500} height={500} className="GameCanvas"></canvas>
          {winnerModal}
          {aloneModal}
        </div>
      ) : (
        <div>Please Login First!</div>
      )}
    </>
  );
};

export default Game;
