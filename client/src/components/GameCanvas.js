//import Player from "./Player.js";

//const BULLET_RADIUS = 5;
//Input is of the form of gameState (in backend gamelogic)
const consts = require("../../const.json");

let mouseX = 0;
let mouseY = 0;

export let width = undefined;
export let height = undefined;

window.onmousemove = function (e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
};

const drawPowerUp = (context, position) => {
  context.beginPath();
  context.arc(position.x, position.y, consts.POWER_UP_RADIUS, 0, 2 * Math.PI, true);
  context.fillStyle = "#FFFFFF";
  context.fill();
  context.closePath();

  context.fillStyle = "#FF0000";
  context.fillRect(position.x - 10, position.y - 3, 20, 6);
  context.fillRect(position.x - 3, position.y - 10, 6, 20);
};

const draw = (gameState, userId) => {
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;

  let xx = gameState.players[userId].position.x;
  let yy = gameState.players[userId].position.y;
  canvas.width = self.innerWidth;
  canvas.height = self.innerHeight;
  width = canvas.width / 2 - xx;
  height = canvas.height / 2 - yy;
  let X = -(canvas.width / 2 - gameState.players[userId].position.x);
  let Y = -(canvas.height / 2 - gameState.players[userId].position.y);

  //window.onresize = function (event) {
  //  canvas.width = self.innerWidth;
  //  canvas.height = self.innerHeight;
  //  width = canvas.width;
  //  height = canvas.height;
  //};
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //  ctx.beginPath();
  //  ctx.rect(
  //    -canvas.width,
  //    -canvas.height,
  //    consts.BORDER_MAX_X + 2 * canvas.width,
  //    consts.BORDER_MAX_Y + 2 * canvas.height
  //  );
  ctx.fillStyle = consts.newBlack;
  ctx.fill();
  ctx.closePath();

  // const gradient = ctx.createLinearGradient(0 - X, 0 - Y, consts.BORDER_MAX_X, consts.BORDER_MAX_Y);

  // Add three color stops
  // gradient.addColorStop(0, "#334455");
  // gradient.addColorStop(0.5, "#334477");
  // gradient.addColorStop(1, "#334499");

  // Set the fill style and draw a rectangle
  ctx.fillStyle = "#434A42";
  ctx.fillRect(0 - X, 0 - Y, consts.BORDER_MAX_X, consts.BORDER_MAX_Y);

  //draw background
  //ctx.fillStyle = "#383A31";
  //ctx.fillRect(0 - X, 0 - Y, nsts.BORDER_MAX_X, consts.BORDER_MAX_Y);

  //ctx.beginPath();
  //ctx.rect(0, 0, 500, 500);
  //ctx.fillStyle = "#272799";
  //ctx.fill();
  //ctx.closePath();
  //draw grid
  for (let i = 0; i < consts.BORDER_MAX_X / consts.gridResolution; i++) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(i * consts.gridResolution - X, 0 - Y);
    ctx.lineTo(i * consts.gridResolution - X, consts.BORDER_MAX_Y - Y);
    ctx.strokeStyle = consts.gridColor;
    ctx.stroke();
    ctx.closePath();
  }
  for (let j = 0; j < consts.BORDER_MAX_Y / consts.gridResolution; j++) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(0 - X, j * consts.gridResolution - Y);
    ctx.lineTo(consts.BORDER_MAX_X - X, j * consts.gridResolution - Y);
    ctx.strokeStyle = consts.gridColor;
    ctx.stroke();
    ctx.closePath();
  }

  if (!gameState.isActive && Object.values(gameState.players).length == 1) {
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = consts.newBlack;
    ctx.fillText("Waiting for another player...", 25, 200);
  } else {
    let i = 0;

    for (let player of Object.values(gameState.players)) {
      // shadows
      ctx.beginPath();
      ctx.arc(
        player.position.x +
          (consts.shadowFactor * (player.position.x - consts.BORDER_MAX_X / 2)) /
            (consts.BORDER_MAX_X / 2) -
          X,
        player.position.y +
          (consts.shadowFactor * (player.position.y - consts.BORDER_MAX_Y / 2)) /
            (consts.BORDER_MAX_Y / 2) -
          Y,
        player.radius,
        0,
        2 * Math.PI,
        true
      );
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fill();
      ctx.closePath();
    }

    let offX =
      xx + (consts.shadowFactor * (xx - consts.BORDER_MAX_X / 2)) / (consts.BORDER_MAX_X / 2);
    let offY =
      yy + (consts.shadowFactor * (yy - consts.BORDER_MAX_Y / 2)) / (consts.BORDER_MAX_Y / 2);
    let vec = [mouseX - canvas.width / 2, mouseY - canvas.height / 2];
    let len = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
    vec = [vec[0] / len, vec[1] / len];
    let rad = gameState.players[userId].radius;
    {
      // shadow for mouse arrow
      ctx.beginPath();
      ctx.moveTo(offX + vec[0] * (rad + 20) - X, offY + vec[1] * (rad + 20) - Y);
      ctx.lineTo(
        offX + vec[0] * (rad + 10) - 5 * vec[1] - X,
        offY + vec[1] * (rad + 10) + 5 * vec[0] - Y
      );
      //    ctx.lineTo(xx + vec[0]*(rad+5), yy + vec[1]*(rad+5));
      ctx.lineTo(
        offX + vec[0] * (rad + 10) + 5 * vec[1] - X,
        offY + vec[1] * (rad + 10) - 5 * vec[0] - Y
      );
      ctx.lineTo(offX + vec[0] * (rad + 20) - X, offY + vec[1] * (rad + 20) - Y);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();
    }

    for (let player of Object.values(gameState.players)) {
      // rendering white background before drawing circles to contrast with dark background
      ctx.beginPath();
      ctx.arc(player.position.x - X, player.position.y - Y, player.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
    }
    for (let player of Object.values(gameState.players)) {
      ctx.beginPath();
      //ctx.rect(player.position.x-player.radius, player.position.y-player.radius, 2*player.radius, 2*player.radius);
      ctx.arc(player.position.x - X, player.position.y - Y, player.radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = consts.canvasPlayerColors[player.colorid]; //"{parseInt(player.id, 16)%parseInt('FFFFFF', 16)}";// should work
      ctx.fill();
      ctx.closePath();
      for (let bullet of player.bullets) {
        ctx.beginPath();
        ctx.arc(bullet.position.x - X, bullet.position.y - Y, bullet.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = consts.rawPlayerColors[player.colorid];
        ctx.fill();
        ctx.closePath();
      }
      if (player.health > 0) {
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(player.name, player.position.x - X, player.position.y - Y);
      }
      i++;
    }
    //Draw powerups
    gameState.powerUps.forEach((powerup) => {
      drawPowerUp(ctx, { x: powerup.position.x - X, y: powerup.position.y - Y });
    });

    //    for (let i = 0; i < consts.obstacles[0].map.length; i++) {
    //      for (let j = 0; j < consts.obstacles[0].map[i].length; j++) {
    //        if (consts.obstacles[0].map[i][j] == 0) continue;
    //        ctx.beginPath();
    //        ctx.fillStyle = "rgba(225, 225, 255, 0.5)";
    //        ctx.fillRect(
    //          i * consts.obstacles[0].blockSize - X,
    //          j * consts.obstacles[0].blockSize - Y,
    //          consts.obstacles[0].blockSize,
    //          consts.obstacles[0].blockSize
    //        );
    //        ctx.strokeStyle = gradient;
    //        ctx.lineWidth = 2;
    //        ctx.strokeRect(
    //          i * consts.obstacles[0].blockSize - X,
    //          j * consts.obstacles[0].blockSize - Y,
    //          consts.obstacles[0].blockSize,
    //          consts.obstacles[0].blockSize
    //        );
    //        ctx.fill();
    //        ctx.closePath();
    //      }
    //    }
    //draw triangle
    ctx.beginPath();
    ctx.moveTo(xx + vec[0] * (rad + 20) - X, yy + vec[1] * (rad + 20) - Y);
    ctx.lineTo(
      xx + vec[0] * (rad + 10) - 5 * vec[1] - X,
      yy + vec[1] * (rad + 10) + 5 * vec[0] - Y
    );
    //    ctx.lineTo(xx + vec[0]*(rad+5), yy + vec[1]*(rad+5));
    ctx.lineTo(
      xx + vec[0] * (rad + 10) + 5 * vec[1] - X,
      yy + vec[1] * (rad + 10) - 5 * vec[0] - Y
    );
    ctx.lineTo(xx + vec[0] * (rad + 20) - X, yy + vec[1] * (rad + 20) - Y);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    //    ctx.beginPath();
    //    ctx.rect(
    //      consts.BORDER_MAX_X - X,
    //      0 - Y,
    //      2 * consts.shadowFactor,
    //      2 * consts.shadowFactor + consts.BORDER_MAX_Y
    //    );
    //    ctx.rect(
    //      0 - X,
    //      consts.BORDER_MAX_Y - Y,
    //      2 * consts.shadowFactor + consts.BORDER_MAX_X,
    //      2 * consts.shadowFactor
    //    );
    //    ctx.fillStyle = consts.newBlack;
    //    ctx.fill();
    //    ctx.closePath();

    //move canvas
    //    let tmp = ctx.globalCompositeOperation;
    //    ctx.globalCompositeOperation = "copy";
    //    ctx.drawImage(canvas, X, Y);
    //    ctx.globalCompositeOperation = tmp;
    //fog
    //
    ctx.beginPath();
    const radgrad = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      consts.innerFog,
      canvas.width / 2,
      canvas.height / 2,
      consts.outerFog
    );
    radgrad.addColorStop(0, consts.newBlackTrans);
    radgrad.addColorStop(1, consts.newBlack);
    ctx.fillStyle = radgrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.closePath();
  }
};

export { draw };
