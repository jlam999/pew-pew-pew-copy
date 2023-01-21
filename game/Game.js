import {Player} from "./Player.js"

//initialization
const body = document.getElementById("main");
const canvas = document.createElement("canvas");
body.appendChild(canvas);

canvas.width = self.outerWidth;
canvas.height = self.outerHeight;
const ctx = canvas.getContext("2d");


function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.beginPath();
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#272822";
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    for(let player of players){
        ctx.arc(...(player.getBase()), 0, 2*Math.PI, true);
        player.move();
        for(let x of player.getBullets()){
            ctx.rect(x[0]-10, x[1]-10, 20, 20);
        }
    }
    ctx.fillStyle = "#FFBBAA";
    ctx.fill();
    ctx.closePath();
}

let players = [new Player(30, 50, 50, 1), new Player(30, 400, 400, 2)];

setInterval(draw, 1000/30);
