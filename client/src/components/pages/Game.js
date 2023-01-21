import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { draw } from "../GameCanvas.js";

const Game = (props) => {
  // Turn on the socket to update the game periodically
  useEffect(() => {
    socket.on("update", (update) => {
      processUpdate(update);
    });
  }, []);

  //This function will redraw the canvas based on the update
  // update will be in the format of the gameState.
  const processUpdate = (update) => {
    draw(update);
  };

  return (
    <>
      This is the Game Page
      <canvas id="game-canvas" width={500} height={500}></canvas>
    </>
  );
};

export default Game;
