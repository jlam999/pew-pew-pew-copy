//initialization
const body = document.getElementById("main");
const canvas = document.createElement("canvas");
body.appendChild(canvas);

canvas.width = self.innerWidth;
canvas.height = self.innerHeight;
const ctx = canvas.getContext("2d");


let moveBounds = [5,5];
class Player{
    #base = [0,0];
    #radius = 0;
    #id = 0;
    #blocks = [];

    constructor(radius, x, y, id){
        this.#radius = radius;
        this.#base = [x,y];
        this.#id = id;
        this.#blocks.push([this.#base[0] + this.#radius, this.#base[1] + this.#radius, [4,4], 4]);// location, vector, speed
        //console.log(this.#radius, this.#base, this.#id);
    }

    shoot(){
    }

    /**
     * @param {Number} dx
     * @param {Number} dy
     */
    #move(dx, dy){
        this.#base[0] += 100/this.#radius * dx;
        this.#base[1] += 100/this.#radius * dy;
    }

    /**
     * @param {Number} index // integer
     */
    #moveBlock(index){
        this.#blocks[index][0] += this.#blocks[index][2][0]*this.#blocks[index][3];
        this.#blocks[index][1] += this.#blocks[index][2][1]*this.#blocks[index][3];
        this.#blocks[index][3] *= 0.95;
    }

    turn(dx, dy){// add option for pulling blocks toward base
        if(Math.abs(dx) <= moveBounds[0] && Math.abs(dy) <= moveBounds[1]){
            this.#move(dx, dy);
            let pops = [];
            for(let i = 0; i < this.#blocks.length; i++){
                if((this.#base[0] - this.#blocks[i][0])**2 + (this.#base[1] - this.#blocks[i][1])**2 <= this.#radius**2){
                    pops.push(i);
                }
                else if(this.#blocks[i][3] > 0.01){
                    this.#moveBlock(i);
                }
            }
            pops.reverse();
            for(let x of pops) this.#blocks.splice(x);
        }
    }

    getBase(){
        return [...(this.#base), this.#radius];
    }

    getBlocks(){
        return this.#blocks;
    }
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#AABBFF";
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();

    for(let player of players){
        ctx.arc(...(player.getBase()), 0, 2*Math.PI, true);
        player.turn(0,0);
        for(let x of player.getBlocks()){
            ctx.rect(x[0]-10, x[1]-10, 20, 20);
        }
    }
    ctx.fillStyle = "#FFBBAA";
    ctx.fill();
    ctx.closePath();
}

let players = [new Player(30, 50, 50, 1), new Player(30, 400, 400, 2)];

setInterval(draw, 1000/30);
