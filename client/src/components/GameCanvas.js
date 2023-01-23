//import Player from "./Player.js";

const BULLET_RADIUS = 5;
//Input is of the form of gameState (in backend gamelogic)

const draw = (gameState, canvasRef) => {
  //console.log(gameState);
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

  for (let player of Object.values(gameState.players)) {
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = "#AAAAAA";
    ctx.fill();
    ctx.closePath();
    for (let bullet of player.bullets) {
      ctx.beginPath();
      ctx.arc(bullet.position.x, bullet.position.y, bullet.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = "#AAAAAA";
      ctx.fill();
      ctx.closePath();
    }
  }
};

export { draw };
