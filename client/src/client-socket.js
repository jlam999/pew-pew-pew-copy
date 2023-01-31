import socketIOClient from "socket.io-client";
import { post } from "./utilities";
import { width, height } from "../src/components/GameCanvas.js";

const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

/** send a message to the server with the move you made in game */
export const move = (dir) => {
  socket.emit("move", dir);
};

export const shoot = (xPos, yPos) => {
  socket.emit("shoot", { x: xPos - width, y: yPos - height });
};
