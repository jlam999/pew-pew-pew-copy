const Bullet = require("./Bullet.js");
const BORDER_MAX_X = 500;
const BORDER_MAX_Y = 500;
const MAX_SPEED = 1000;
class Player {
  #position = { x: 0, y: 0 };
  #health = 0; // max health should be 100 and the bullet speed should be the
  // same speed as somebody at 2 health (100/sqrt(2))
  #id = 0;
  #bullets = [];
  #initHealth = 0;
  #isDead = false;
  #directions = { up: false, down: false, left: false, right: false };
  #speed = { up: 0, down: 0, left: 0, right: 0 };

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
  // move(theta) {
  //   // pi/4 increments because if like up & left are pressed, we xget a 3pi/4 angle --- keyboard directions
  //   if (theta !== undefined) {
  //     this.#base[0] += this.#speed() * Math.cos(theta);
  //     this.#base[1] += this.#speed() * Math.sin(theta);
  //   }
  // }
  move(dir) {
    // pi/4 increments because if like up & left are pressed, we get a 3pi/4
    // angle --- keyboard directions
    //
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
      if (this.#directions[dir]) this.#speed[dir] = Math.min(this.#speed[dir] + 1, MAX_SPEED);
      else this.#speed[dir] = Math.max(this.#speed[dir] - 1, 0);
    }
    this.#position = {
      x: this.#position.x + (100 * (this.#speed.right - this.#speed.left)) / MAX_SPEED,
      y: this.#position.y + (100 * (this.#speed.down - this.#speed.up)) / MAX_SPEED,
    };
    this.#position.x = Math.max(
      Math.min(BORDER_MAX_X - this.getRadius(), this.#position.x),
      0 + this.getRadius()
    );
    this.#position.y = Math.max(
      Math.min(BORDER_MAX_Y - this.getRadius(), this.#position.y),
      0 + this.getRadius()
    );
    this.moveBullets(players);
  }

  /**
   * Used to draw bullets toward player base --- call when Ctrl key or
   something is pressed
   * @param {Number} index
   */
  moveBullets(players) {
    for (let i = 0; i < this.#bullets.length; i++) {
      //pos = this.#bullets[i].getPosition();
      //vec = [pos[0] - this.base[0], pos[1] - this.base[1]];
      //this.#bullets[i].getPosition(Math.tan(vec[1] / vec[0]), this.#health);
      this.#bullets[i].update(players);
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
    }
  }

  absorb() {
    this.#health++;
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
    };
  }
}

module.exports = Player;
