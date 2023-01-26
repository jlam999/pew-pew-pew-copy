//import Player from "./Player.js";

//const BULLET_RADIUS = 5;
//Input is of the form of gameState (in backend gamelogic)

const playerColors = ["rgba(199, 225, 29, 0.5)", "rgba(46, 134, 171, 0.5)", "rgba(241, 240, 1, 0.5)", "rgba(162, 59, 114, 0.5)"];

let mouseX = 0;
let mouseY = 0;
window.onmousemove = function(e){
  mouseX = e.offsetX;
  mouseY = e.offsetY;
};

const draw = (gameState, userId) => {
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
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(0, 0, 500, 500);
  ctx.fillStyle = "#272722";
  ctx.fill();
  ctx.closePath();
  if (!gameState.isActive && Object.values(gameState.players).length == 1) {
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Waiting for another player...", 25, 200);
  } else {
    let i = 0;
    for(let player of Object.values(gameState.players)){ // rendering white background before drawing circles to contrast with dark background
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
    }
    for (let player of Object.values(gameState.players)) {
      ctx.beginPath();
      //ctx.rect(player.position.x-player.radius, player.position.y-player.radius, 2*player.radius, 2*player.radius);
      ctx.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = playerColors[i]; //"{parseInt(player.id, 16)%parseInt('FFFFFF', 16)}";// should work
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
    let xx = gameState.players[userId].position.x;
    let yy = gameState.players[userId].position.y;
    let vec = [mouseX-xx, mouseY - yy];
    let len = Math.sqrt(vec[0]**2 + vec[1]**2);
    vec = [vec[0]/len, vec[1]/len];
    let rad = gameState.players[userId].radius;

    ctx.beginPath();
    ctx.moveTo(xx + vec[0]*(rad + 20), yy + vec[1]*(rad+20));
    //ctx.lineTo(xx + vec[0]*(rad+10), yy + vec[1]*(rad+10));
    ctx.lineTo(xx + vec[0]*(rad+10) - 5*vec[1], yy + vec[1]*(rad+10) + 5*vec[0]);
    ctx.lineTo(xx + vec[0]*(rad+10) + 5*vec[1], yy + vec[1]*(rad+10) - 5*vec[0]);
    ctx.lineTo(xx + vec[0]*(rad + 20), yy + vec[1]*(rad+20));
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }
};

export { draw };
