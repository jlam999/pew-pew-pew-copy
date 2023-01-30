const Bullet = require("./Bullet.js");
const consts = require("../client/const.json");
class Player {
  #position = { x: 0, y: 0 };
  #health = 0; // max health should be 100 and the bullet speed should be the
  // same speed as somebody at 2 health (100/sqrt(2))
  #id = 0;
  #bullets = [];
  #initHealth = 0;
  #isDead = false;
  #directions = { up: false, down: false, left: false, right: false, space: false };
  #speed = { up: 0, down: 0, left: 0, right: 0, space: false };
  #kills = 0;

  constructor(health, x, y, id) {
    this.#health = health;
    this.#initHealth = health;
    this.#position = { x: x, y: y };
    this.#id = id;
  }

  getPosition() {
    return this.#position;
  }

  setPosition(x, y) {
    this.#position.x = x;
    this.#position.y = y;
  }

  getHealth() {
    return this.#health;
  }

  getBullets() {
    return this.#bullets;
  }

  getSpeed() {
    return this.#initHealth / 1.5 / (1 + Math.exp(Math.sqrt(this.#health) / 5));
  }

  getRadius() {
    return Math.sqrt(this.#health) * 5;
  }

  getId() {
    return this.#id;
  }

  getIsDead() {
    return this.#isDead;
  }

  /**
   * @param {Number} theta: The angle that the player will shoot towards
   */
  shoot(theta) {
    // mouse direction
    if (this.#health > 2) {
      this.#health--;
      this.#bullets.push(
        new Bullet(
          this.#position.x + (this.getRadius() + this.getSpeed()) * Math.cos(theta),
          this.#position.y - (this.getRadius() + this.getSpeed()) * Math.sin(theta),
          theta,
          this.#id
        )
      );
    }
  }

  /**
   * @param {Number} theta: The angle that the player will move in
   */
  move(dir) {
    // pi/4 increments because if like up & left are pressed, we get a 3pi/4
    // angle --- keyboard directions
    this.#directions[Object.keys(dir)[0]] = Object.values(dir)[0];
    //    if (theta !== undefined) {
    //      this.#position.x += this.getSpeed() * Math.cos(theta);
    //      this.#position.y -= this.getSpeed() * Math.sin(theta);
    //    }
    //    this.#position = {x: Math.max(Math.min(this.#position.x, BORDER_MAX_X-this.getRadius()), this.getRadius()),
    //      y:Math.max(Math.min(this.#position.y, BORDER_MAX_Y-this.getRadius()), this.getRadius())};
  }

  updatePlayerState(players) {
    for (let dir of Object.keys(this.#directions)) {
      if (this.#directions[dir]) this.#speed[dir] = Math.min(this.#speed[dir] + 1, consts.MAX_SPEED);
      else this.#speed[dir] = Math.max(this.#speed[dir] - 1, 0);
    }
    if (this.#directions.space === false && this.#bullets.length === 0) this.#speed.space = 0;
    this.#position = {
      x: this.#position.x + (100 * (this.#speed.right - this.#speed.left)) / consts.MAX_SPEED,
      y: this.#position.y + (100 * (this.#speed.down - this.#speed.up)) / consts.MAX_SPEED,
    };
    if (this.#position.x >= consts.BORDER_MAX_X - this.getRadius()) {
      this.#position.x = consts.BORDER_MAX_X - this.getRadius();
      this.#speed.left = Math.min(this.#speed.right * 0.5 + this.#speed.left, consts.MAX_SPEED); //kickback
      this.#speed.right = 0;
    }
    if (this.#position.x <= this.getRadius()) {
      this.#position.x = this.getRadius();
      this.#speed.right = Math.min(this.#speed.left * 0.5 + this.#speed.right, consts.MAX_SPEED); //kickback
      this.#speed.left = 0;
    }
    if (this.#position.y <= this.getRadius()) {
      this.#position.y = this.getRadius();
      this.#speed.down = Math.min(this.#speed.up * 0.5 + this.#speed.down, consts.MAX_SPEED); //kickback
      this.#speed.up = 0;
    }
    if (this.#position.y >= consts.BORDER_MAX_Y - this.getRadius()) {
      this.#position.y = consts.BORDER_MAX_Y - this.getRadius();
      this.#speed.up = Math.min(this.#speed.down * 0.5 + this.#speed.up, consts.MAX_SPEED); //kickback
      this.#speed.down = 0;
    }
    this.#position.x = Math.max(
      Math.min(consts.BORDER_MAX_X - this.getRadius(), this.#position.x),
      0 + this.getRadius()
    );
    this.#position.y = Math.max(
      Math.min(consts.BORDER_MAX_Y - this.getRadius(), this.#position.y),
      0 + this.getRadius()
    );
    this.moveBullets(players);
  }

  /**
   * Used to draw bullets toward player base --- call when space key is pressed
   * @param {Number} index
   */
  moveBullets(players) {
    for (let i = 0; i < this.#bullets.length; i++) {
      //pos = this.#bullets[i].getPosition();
      //vec = [pos[0] - this.base[0], pos[1] - this.base[1]];
      //this.#bullets[i].getPosition(Math.tan(vec[1] / vec[0]), this.#health);
      this.#bullets[i].update(players, (50 * this.#speed.space) / consts.MAX_SPEED, this.#position);
    }
    this.#bullets = this.#bullets.filter((bullet) => {
      return bullet.getIsActive();
    });
  }

  // /**
  //  * @param {Boolean} whether or not to pull bullets
  //  * @param {Number} theta nonempty for movement of base
  //  */
  // move(pull, theta) {
  //   if (theta !== undefined) this.#move(theta);
  //   this.#moveBullets();
  // }

  getsHit() {
    this.#health -= 5;
    if (this.#health <= 0) {
      this.#isDead = true;
      return true;
    }
    return false;
  }

  absorb() {
    this.#health++;
  }

  incrementKills() {
    this.#kills++;
    console.log("player " + String(this.#id) + " just got a kill.");
    console.log("they now have " + String(this.#kills) + " kills.");
  }

  toObject() {
    const bulletObjs = [];
    for (let bullet of this.#bullets) {
      bulletObjs.push(bullet.toObject());
    }
    return {
      position: this.#position,
      radius: this.getRadius(),
      health: this.#health,
      bullets: bulletObjs,
      id: this.#id,
      kills: this.#kills,
    };
  }
}

module.exports = Player;
