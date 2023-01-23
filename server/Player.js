const Bullet = require("./Bullet.js");

class Player {
  #position = [0, 0];
  #health = 0; // max health should be 100 and the bullet speed should be the same speed as somebody at 2 health (100/sqrt(2))
  #id = 0;
  #bullets = {};
  #initHealth = 0;

  constructor(health, x, y, id) {
    this.#health = health;
    this.#initHealth = health;
    this.#position = { x: x, y: y };
    this.#id = id;
  }

  getPosition() {
    return this.#position;
  }

  getHealth() {
    return this.#health;
  }

  getBullets() {
    return this.#bullets;
  }

  getSpeed() {
    return this.#initHealth / Math.sqrt(this.#health);
  }

  getRadius() {
    return Math.sqrt(this.#health / Math.PI);
  }

  // /**
  //  * @param {Number} theta: The angle that the player will shoot towards
  //  */
  // shoot(theta) {
  //   // mouse direction
  //   this.#health--;
  //   this.#bullets.push(
  //     new Bullet(
  //       this.#base[0] + (this.#radius() + this.#speed()) * Math.cos(theta),
  //       this.#base[1] + (this.#radius + this.#speed()) * Math.sin(theta),
  //       theta
  //     )
  //   );
  // }

  /**
   * @param {Number} theta: The angle that the player will move in
   */
  // move(theta) {
  //   // pi/4 increments because if like up & left are pressed, we get a 3pi/4 angle --- keyboard directions
  //   if (theta !== undefined) {
  //     this.#base[0] += this.#speed() * Math.cos(theta);
  //     this.#base[1] += this.#speed() * Math.sin(theta);
  //   }
  // }

  // Will implement later
  // /**
  //  * Used to draw bullets toward player base --- call when Ctrl key or something is pressed
  //  * @param {Number} index
  //  */
  // #moveBullets() {
  //   for (let i = 0; i < this.#bullets.length; i++) {
  //     pos = this.#bullets[i].getPosition();
  //     vec = [pos[0] - this.base[0], pos[1] - this.base[1]];
  //     this.#bullets[i].getPosition(Math.tan(vec[1] / vec[0]), this.#health);
  //     this.#bullets[i].move();
  //   }
  // }

  // /**
  //  * @param {Boolean} whether or not to pull bullets
  //  * @param {Number} theta nonempty for movement of base
  //  */
  // move(pull, theta) {
  //   if (theta !== undefined) this.#move(theta);
  //   this.#moveBullets();
  // }

  getsHit() {
    //TODO: Updates player instance if it gets hit by opponent's bullet
  }

  absorb() {
    //TODO: Update player instance if it absorbs one of its own bullets
  }
}

module.exports = Player;
