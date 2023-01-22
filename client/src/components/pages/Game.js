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
      window.removeEventListener("keydown", handleInput);
    };
  }, []);

  // Turn on the socket to update the game periodically
  useEffect(() => {
    socket.on("update", (update) => {
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
      This is the Game Page
      <canvas ref={canvasRef} width={500} height={500}></canvas>
    </>
  );
};

export default Game;
