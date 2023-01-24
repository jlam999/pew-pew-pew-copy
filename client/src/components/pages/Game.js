import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { draw } from "../GameCanvas.js";
import { handleKey, handleClick } from "../../input.js";
import { Link } from "@reach/router";

const Game = (props) => {
  const [winnerModal, setWinnerModal] = useState(null);
  const [joined, setJoined] = useState(false);

  // add event listener on mount
  useEffect(() => {
    // remove event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("click", handleClick);
      //post("/api/despawn", { userid: props.userId });
      setJoined(false);
    };
  }, []);

  // Turn on the socket to update the game periodically
  useEffect(() => {
    socket.on("update", (update) => {
      //console.log(update.players);
      processUpdate(update);
    });
  }, []);

  const homeLink = <Link to="/">Return Home</Link>;
  //This function will redraw the canvas based on the update
  // update will be in the format of the gameState.
  const processUpdate = (update) => {
    if (update.winner === props.userId) {
      setWinnerModal(<div>You Won! {homeLink}</div>);
    } else if (update.winner !== null) {
      setWinnerModal(<div>You Lost. {homeLink}</div>);
    } else {
      setWinnerModal(null);
    }
    draw(update);
  };

  const attemptJoinGame = () => {
    if (!joined) {
      get("/api/isActive").then((isActive) => {
        console.log("Is Active: " + String(isActive));
        if (isActive) {
          alert("Game in Session; Cannot Join.");
        } else {
          setJoined(true);
          window.addEventListener("keydown", handleKey);
          window.addEventListener("click", handleClick);
          post("/api/spawn", { userid: props.userId });
        }
      });
    }
  };

  return (
    <>
      {props.userId ? (
        <div>
          <canvas id="gameCanvas" width={500} height={500}></canvas>
          {winnerModal}
          {joined ? <></> : <button onClick={attemptJoinGame}>Join Game</button>}
        </div>
      ) : (
        <div>Please Login First!</div>
      )}
    </>
  );
};

export default Game;
