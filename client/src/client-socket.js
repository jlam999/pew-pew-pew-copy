import socketIOClient from "socket.io-client";
import { post } from "./utilities";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

/** send a message to the server with the move you made in game */
export const move = (dir) => {
  socket.emit("move", dir);
};

export const shoot = (x, y) => {
  let angle;
  if (x === 0) {
    angle = y < 0 ? 90 : 270;
  } else if (x > 0) {
    angle = (Math.atan2(-y, x) * 180) / Math.PI;
  } else {
    angle = (Math.atan2(-y, x) * 180) / Math.PI + 180;
  }
  angle %= 360;

  socket.emit("shoot", angle);
};
