import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { draw } from "../GameCanvas.js";
import { handleKey, handleClick } from "../../input.js";

const Game = (props) => {
  const canvasRef = useRef(null);
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
    draw(update, canvasRef);
  };

  return (
    <>
      {props.userId ? (
        <canvas ref={canvasRef} width={500} height={500}></canvas>
      )   :   (
        <h3>Please login in order to play a game.</h3>
      )}
    </>
  );
};

export default Game;
