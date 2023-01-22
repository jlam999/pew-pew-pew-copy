//import Player from "./Player.js";

//Input is of the form of gameState (in backend gamelogic)

const draw = (gameState, canvasRef) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  // canvas.width = self.outerWidth;
  // canvas.height = self.outerHeight;

  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  for (let player of Object.values(gameState.players)) {
    ctx.arc(player.position.x, player.position.y, Math.sqrt(player.health), 0, 2 * Math.PI, true);
    // player.move();
    // for (let x of player.getBullets()) {
    //   ctx.rect(x[0] - 10, x[1] - 10, 20, 20);
    // }
  }
  ctx.fillStyle = "#AAAAAA";
  ctx.fill();
  ctx.closePath();
};

export { draw };
