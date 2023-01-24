import { move, shoot } from "./client-socket";

/** Callback function that calls correct movement from key */
export const handleKey = (e) => {
  if (e.key === "ArrowUp" || e.key === "w") {
    move(Math.PI / 2);
  } else if (e.key === "ArrowDown" || e.key === "s") {
    move((3 * Math.PI) / 2);
  } else if (e.key === "ArrowLeft" || e.key === "a") {
    move(Math.PI);
  } else if (e.key === "ArrowRight" || e.key === "d") {
    move(0);
  }
};

export const handleClick = (e) => {
  shoot(e.offsetX, e.offsetY);
};
