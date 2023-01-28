//import Player from "./Player.js";

//const BULLET_RADIUS = 5;
//Input is of the form of gameState (in backend gamelogic)

const playerColors = ["rgba(225, 119, 29, 0.5)", "rgba(46, 134, 171, 0.5)", "rgba(241, 240, 1, 0.5)", "rgba(162, 59, 114, 0.5)"];

let mouseX = 0;
let mouseY = 0;
window.onmousemove = function(e){
  mouseX = e.offsetX;
  mouseY = e.offsetY;
};

const draw = (gameState, userId) => {
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;

   canvas.width = self.innerWidth;
   canvas.height = self.innerHeight;

   window.onresize = function(event){
     canvas.width = self.innerWidth;
     canvas.height = self.innerHeight;
   };
  const ctx = canvas.getContext("2d");

  ctx.clearRect(-canvas.width, -canvas.height, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.rect(-canvas.width, -canvas.height, 2*canvas.width, 2*canvas.height);
  ctx.fillStyle = "#272822";
  ctx.fill();
  ctx.closePath();

  const gradient = ctx.createLinearGradient(0, 0, 500, 500);

  // Add three color stops
  gradient.addColorStop(0, "#334455");
  gradient.addColorStop(0.5, "#334477");
  gradient.addColorStop(1, "#334499");

  // Set the fill style and draw a rectangle
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 500, 500);

  //ctx.beginPath();
  //ctx.rect(0, 0, 500, 500);
  //ctx.fillStyle = "#272799";
  //ctx.fill();
  //ctx.closePath();
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
    //draw triangle
    let xx = gameState.players[userId].position.x;
    let yy = gameState.players[userId].position.y;
    let vec = [mouseX - canvas.width/2, mouseY - canvas.height/2];
    let len = Math.sqrt(vec[0]**2 + vec[1]**2);
    vec = [vec[0]/len, vec[1]/len];
    let rad = gameState.players[userId].radius;

    ctx.beginPath();
    ctx.moveTo(xx + vec[0]*(rad + 20), yy + vec[1]*(rad+20));
    ctx.lineTo(xx + vec[0]*(rad+10) - 5*vec[1], yy + vec[1]*(rad+10) + 5*vec[0]);
//    ctx.lineTo(xx + vec[0]*(rad+5), yy + vec[1]*(rad+5));
    ctx.lineTo(xx + vec[0]*(rad+10) + 5*vec[1], yy + vec[1]*(rad+10) - 5*vec[0]);
    ctx.lineTo(xx + vec[0]*(rad + 20), yy + vec[1]*(rad+20));
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    //move canvas
    let X = canvas.width/2 - gameState.players[userId].position.x;
    let Y = canvas.height/2 - gameState.players[userId].position.y;
    let tmp = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(canvas, X, Y);
    ctx.globalCompositeOperation = tmp;
  }
};

export { draw };
