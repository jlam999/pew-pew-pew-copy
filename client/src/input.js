import { move, shoot } from "./client-socket";

/** Callback function that calls correct movement from key */
// modify to trigger on and off keypress
export const handleKeyUp = (e) => {
  if (e.key === "ArrowUp" || e.key === "w") {
    move({ up: false });
  } else if (e.key === "ArrowDown" || e.key === "s") {
    move({ down: false });
  } else if (e.key === "ArrowLeft" || e.key === "a") {
    move({ left: false });
  } else if (e.key === "ArrowRight" || e.key === "d") {
    move({ right: false });
  } else if (e.key === " " || e.key === "Space" || e.key === "Spacebar") {
    move({ space: false });
  }
};

export const handleKeyDown = (e) => {
  if (e.key === "ArrowUp" || e.key === "w") {
    move({ up: true });
  } else if (e.key === "ArrowDown" || e.key === "s") {
    move({ down: true });
  } else if (e.key === "ArrowLeft" || e.key === "a") {
    move({ left: true });
  } else if (e.key === "ArrowRight" || e.key === "d") {
    move({ right: true });
  } else if (e.key === " " || e.key === "Space" || e.key === "Spacebar") {
    move({ space: true });
  }
};

export const handleClick = (e) => {
  shoot(e.offsetX, e.offsetY);
};
