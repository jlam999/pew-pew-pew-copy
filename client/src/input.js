import { move, shoot } from "./client-socket";

/** Callback function that calls correct movement from key */
export const handleKey = (e) => {
  if (e.key === "ArrowUp") {
    move(Math.PI / 2);
  } else if (e.key === "ArrowDown") {
    move((3 * Math.PI) / 2);
  } else if (e.key === "ArrowLeft") {
    move(Math.PI);
  } else if (e.key === "ArrowRight") {
    move(0);
  }
};

export const handleClick = (e) => {
  shoot(e.offsetX, e.offsetY);
};
