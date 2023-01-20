import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";

const Game = (props) => {
  // Turn on the socket to update the game periodically
  useEffect(() => {
    socket.on("update", (update) => {
      processUpdate(update);
    });
  }, []);

  //This function will redraw the canvas based on the update
  // update will be in the format of the gameState.
  const processUpdate = (update) => {};

  return <>This is the Game Page</>;
};
