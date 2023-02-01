const consts = require("../client/const.json");
class Bullet {
  #position = 0;
  #angle = 0;
  #speed = 0;
  #isActive = true;
  #owner = undefined;

  constructor(x, y, theta, owner) {
    this.#position = { x: x, y: y };
    this.#angle = theta;
    this.#speed = consts.bulletSpeed;
    this.#owner = owner;
  }

  getPosition() {
    return this.#position;
  }

  getAngle() {
    return this.#angle;
  }

  getSpeed() {
    return this.#speed;
  }

  getIsActive() {
    return this.#isActive;
  }

  //Updates bullet's position and speed based on current position and speed
  //Be sure to use checkWallCollision()
  update(players, parentSpeed, parentLoc) {
    let parentAngle = Math.atan2(parentLoc.y - this.#position.y, parentLoc.x - this.#position.x);
    this.#position = {
      x:
        this.#position.x +
        this.#speed * Math.cos(this.#angle) +
        parentSpeed * Math.cos(parentAngle),
      y:
        this.#position.y -
        this.#speed * Math.sin(this.#angle) +
        parentSpeed * Math.sin(parentAngle),
    };
    this.checkWallCollision();
    this.checkCollision(players);
    //    this.checkMapCollision();
    this.#speed *= consts.bulletFriction;
  }

  /**
   * ig we don't do this when updating game state?
   * @param {[Player]} players : List of all the players in the game
   */
  checkCollision(players) {
    Object.values(players).forEach((player) => {
      let playerPos = player.getPosition();
      let distance = Math.sqrt(
        (playerPos.x - this.#position.x) ** 2 + (playerPos.y - this.#position.y) ** 2
      );
      if (!player.getIsDead() && distance < consts.BULLET_RADIUS + player.getRadius()) {
        if (player.getId() === this.#owner) {
          player.absorb();
        } else {
          const killed = player.getsHit();
          if (killed) {
            players[this.#owner].incrementKills();
          }
        }
        this.#isActive = false;
      }
    });
  }

  checkWallCollision() {
    if (consts.BORDER_MAX_X < this.#position.x || this.#position.x < 0) {
      this.#angle = Math.PI - this.#angle;
    }
    if (consts.BORDER_MAX_Y < this.#position.y || this.#position.y < 0) {
      this.#angle = -this.#angle;
    }
    this.#position.x = Math.max(0, Math.min(this.#position.x, consts.BORDER_MAX_X - 0.0001));
    this.#position.y = Math.max(0, Math.min(this.#position.y, consts.BORDER_MAX_Y - 0.0001));
  }

  // checkMapCollision() {
  //   let ll = Math.floor(this.#position.x / consts.obstacles[0].blockSize);
  //   let uu = Math.floor(this.#position.y / consts.obstacles[0].blockSize);
  //   let blockSize = consts.obstacles[0].blockSize;
  //   if (consts.obstacles[0].map[ll][uu] == 1) {
  //     //console.log(this.#position, "Before");
  //     let xOrY = false;
  //     if (
  //       Math.min(
  //         blockSize * (ll + 1) - (this.#position.x + consts.BULLET_RADIUS),
  //         this.#position.x - consts.BULLET_RADIUS - blockSize * ll
  //       ) <
  //       Math.min(
  //         blockSize * (uu + 1) - (this.#position.y + consts.BULLET_RADIUS),
  //         this.#position.y - consts.BULLET_RADIUS - blockSize * uu
  //       )
  //     )
  //       xOrY = true;
  //     if (xOrY) {
  //       this.#angle = Math.PI - this.#angle;
  //       this.#position.x =
  //         blockSize * (ll + 1) - this.#position.x < this.#position.x - blockSize * ll
  //           ? blockSize * (ll + 1) + consts.BULLET_RADIUS
  //           : blockSize * ll - consts.BULLET_RADIUS;
  //     } else {
  //       this.#angle = -this.#angle;
  //       this.#position.y =
  //         blockSize * (uu + 1) - this.#position.y < this.#position.y - blockSize * uu
  //           ? blockSize * (uu + 1) + consts.BULLET_RADIUS
  //           : blockSize * uu - consts.BULLET_RADIUS;
  //     }
  //     //console.log(this.#position, "After");
  //   }
  // }

  toObject() {
    return {
      position: this.#position,
      radius: consts.BULLET_RADIUS,
      owner: this.#owner,
    };
  }
}

module.exports = Bullet;
