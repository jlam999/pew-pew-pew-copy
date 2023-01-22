import { move } from "./client-socket";

/** Callback function that calls correct movement from key */
export const handleInput = (e) => {
  if (e.key === "ArrowUp") {
    move(90);
  } else if (e.key === "ArrowDown") {
    move(270);
  } else if (e.key === "ArrowLeft") {
    move(180);
  } else if (e.key === "ArrowRight") {
    move(0);
  }
};
