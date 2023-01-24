//import Player from "./Player.js";

//const BULLET_RADIUS = 5;
//Input is of the form of gameState (in backend gamelogic)

const draw = (gameState) => {
  //console.log(gameState);
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;

  // canvas.width = self.outerWidth;
  // canvas.height = self.outerHeight;

  window.onresize = function(event){
    canvas.width = self.outerWidth;
    canvas.height = self.outerHeight;
  };
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#272822";
  ctx.fill();
  ctx.closePath();

  if (Object.values(gameState.players).length < 2) {
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Waiting for another player...", 25, 200);
  } else {
    for (let player of Object.values(gameState.players)) {
      ctx.beginPath();
      ctx.rect(player.position.x-player.radius, player.position.y-player.radius, player.radius, player.radius);
      //ctx.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = "{parseInt(player.id, 16)%parseInt('FFFFFF', 16)}";// should work
      ctx.fill();
      ctx.closePath();
      for (let bullet of player.bullets) {
        ctx.beginPath();
        ctx.arc(bullet.position.x, bullet.position.y, bullet.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = "{parseInt(bullet.id, 16)%parseInt('FFFFFF', 16)}";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

export { draw };
