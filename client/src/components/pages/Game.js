import React, { useState, useEffect } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { draw } from "../GameCanvas.js";
import { handleKeyUp, handleKeyDown, handleClick } from "../../input.js";
import { Link, useNavigate } from "@reach/router";
import NoRoomCode from "./NoRoomCode.js";

import "./Game.css";

const Game = (props) => {
  const [winnerModal, setWinnerModal] = useState(null);
  const [aloneModal, setAloneModal] = useState(null);
  const navigate = useNavigate();

  // add event listener on mount
  useEffect(() => {
    if (props.roomCode !== null) {
      get("/api/gameState", { code: props.roomCode }).then((gameState) => {
        if (!gameState.isActive || !Object.keys(gameState.players).includes(props.userId)) {
          alert("Cannot enter game");
          navigate("/");
        } else {
          window.addEventListener("keydown", handleKeyDown);
          window.addEventListener("keyup", handleKeyUp);
          window.addEventListener("click", handleClick);
        }
      });
    }
    // remove event listener on unmount
    return () => {
      console.log("dismounting");
      post("/api/despawn", { userid: props.userId, socketid: socket.id });
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  // Turn on the socket to update the game periodically
  useEffect(() => {
    socket.on("update", processUpdate);
    const leaveGame = (update) => {
      updateStats(update);
      navigate("/lobby");
    };
    socket.on("end game", leaveGame);
    return () => {
      socket.off("update", processUpdate);
      socket.off("end game", leaveGame);
    };
  }, []);

  const updateStats = (gameState) => {
    const requestBody = {
      win: 0,
      kills: gameState.players[props.userId].kills,
    };
    if (props.userId === gameState.winner) {
      requestBody.win = 1;
    }
    post("/api/addGameStats", requestBody);
  };

  //This function will redraw the canvas based on the update
  // update will be in the format of the gameState.
  const processUpdate = (update) => {
    const leaveAfterGameOver = () => {
      updateStats(update);
    };
    const lobbyLink = (
      <Link to="/lobby">
        <button onClick={leaveAfterGameOver} className="returnHome">Return Home</button>
      </Link>
    );

    if (update.winner === props.userId) {
      setWinnerModal(
        <div className="Banner">
          <div> You Won!</div>
          {lobbyLink}
        </div>
      );
    } else if (update.players[props.userId].health <= 0) {
      setWinnerModal(
        <div className="Banner">
          <div> You Lost.</div>
          {lobbyLink}
        </div>
      );
    } else {
      setWinnerModal(null);
    }

    if (
      update.isActive &&
      Object.keys(update.players).length === 1 &&
      update.players[props.userId] !== undefined
    ) {
      setAloneModal(
        <div className="Banner">
          <div>Your opponent(s) left the game room.</div>
          {lobbyLink}
        </div>
      );
    } else {
      setAloneModal(null);
    }
    draw(update, props.userId);
  };

  return (
    <>
      {props.roomCode !== null ? (
        <div className="GameBox">
          <canvas id="gameCanvas" className="GameCanvas"></canvas>
          {winnerModal}
          {aloneModal}
        </div>
      ) : (
        <NoRoomCode />
      )}
    </>
  );
};

export default Game;
