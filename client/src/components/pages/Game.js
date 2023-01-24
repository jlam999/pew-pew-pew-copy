import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { draw } from "../GameCanvas.js";
import { handleKey, handleClick } from "../../input.js";

const Game = (props) => {
  const [winnerModal, setWinnerModal] = useState(null);

  // add event listener on mount
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    window.addEventListener("click", handleClick);
    // remove event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  // Turn on the socket to update the game periodically
  useEffect(() => {
    socket.on("update", (update) => {
      //console.log(update.players);
      processUpdate(update);
    });
  }, []);

  //This function will redraw the canvas based on the update
  // update will be in the format of the gameState.
  const processUpdate = (update) => {
    if (update.winner === props.userId) {
      setWinnerModal(<div>You Won!</div>);
    } else if (update.winner !== null) {
      setWinnerModal(<div>You Lost.</div>);
    } else {
      setWinnerModal(null);
    }
    draw(update);
  };

  let loginModal = null;
  if (!props.userId) {
    loginModal = <div>Please Login First!</div>;
  }

  return (
    <>
      <canvas id="gameCanvas" width={500} height={500}>
        {loginModal}
      </canvas>
    </>
  );
};

export default Game;
