const BULLET_RADIUS = 5;
const BORDER_MAX_X = 500;
const BORDER_MAX_Y = 500;

class Bullet {
  #position = 0;
  #angle = 0;
  #speed = 0;
  #isActive = true;
  #owner = undefined;

  constructor(x, y, theta, owner) {
    this.#position = { x: x, y: y };
    this.#angle = theta;
    this.#speed = 20 / Math.sqrt(2); // start at 100/sqrt(2) and decrease exponentially
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

  // Will implement later:
  //   adjustPath(theta, health) {
  //     // the speed at which the bullet is drawn toward a player is inversely proportional to the root of the player's health
  //     speed = 100 / Math.sqrt(health);
  //     vec = [
  //       this.speed * Math.cos(this.angle) + speed * Math.cos(this.angle),
  //       this.speed * Math.sin(this.angle) + speed * Math.sin(this.angle),
  //     ];
  //     this.angle = Math.tan(vec[1] / vec[0]); // update angle
  //     this.speed += speed / 0.95; // TODO: rewrite for projection calculations
  //   }

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
    this.#speed *= 0.95;
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
      if (distance < BULLET_RADIUS + player.getRadius()) {
        if (player.getId() === this.#owner) {
          player.absorb();
        } else {
          const killed = player.getsHit();
          if (killed) {
            players[this.#owner].incrementKills();
            console.log("There was a kill");
          }
        }
        this.#isActive = false;
      }
    });
  }

  checkWallCollision() {
    if (!(Math.abs(BORDER_MAX_X / 2 - this.#position.x) < BORDER_MAX_X / 2 - BULLET_RADIUS)) {
      this.#angle = Math.PI - this.#angle;
    }
    if (!(Math.abs(BORDER_MAX_Y / 2 - this.#position.y) < BORDER_MAX_Y / 2 - BULLET_RADIUS)) {
      this.#angle = -this.#angle;
    }
  }

  toObject() {
    return {
      position: this.#position,
      radius: BULLET_RADIUS,
      owner: this.#owner,
    };
  }
}

module.exports = Bullet;
