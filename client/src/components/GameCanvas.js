//import Player from "./Player.js";

//const BULLET_RADIUS = 5;
//Input is of the form of gameState (in backend gamelogic)

const playerColors = ["#C73E1D","#2E86AB","#F18F01","#A23B72"]

const draw = (gameState) => {
  //console.log(gameState);
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;

  // canvas.width = 800;
// canvas.height = 800;

  // window.onresize = function(event){
  //   canvas.width = self.innerWidth;
  //   canvas.height = self.innerHeight;
  // };
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
  
  ctx.beginPath();
  ctx.rect(0, 0, 500, 500);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  if (Object.values(gameState.players).length < 2) {
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Waiting for another player...", 25, 200);
  } else {
    let i = 0
    for (let player of Object.values(gameState.players)) {
      ctx.beginPath();
      ctx.rect(player.position.x-player.radius, player.position.y-player.radius, 2*player.radius, 2*player.radius);
      //ctx.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = playerColors[i];//"{parseInt(player.id, 16)%parseInt('FFFFFF', 16)}";// should work
      ctx.fill();
      ctx.closePath();
      for (let bullet of player.bullets) {
        ctx.beginPath();
        ctx.arc(bullet.position.x, bullet.position.y, bullet.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = playerColors[i];
        ctx.fill();
        ctx.closePath();
      }
      i++;
    }
  }
};

export { draw };
