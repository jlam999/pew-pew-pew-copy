BULLET_RADIUS = 5;
BORDER_MAX_X = 500;
BORDER_MAX_Y = 500;

class Bullet {
  #position = 0;
  #angle = 0;
  #speed = 0;
  #isActive = true;

  constructor(x, y, theta) {
    this.#position = { x: x, y: y };
    this.#angle = theta;
    this.#speed = 100 / Math.sqrt(2); // start at 100/sqrt(2) and decrease exponentially
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
  update() {
    this.position = [
      this.position[0] + this.speed * Math.cos(this.angle),
      this.position[1] + this.speed * Math.sin(this.angle),
    ];
    this.speed *= 0.95;
  }

  /**
   *
   * @param {[Player]} players : List of all the players in the game
   * @param {Player} bulletOwner : the Player object that owns this bullet
   */
  checkCollision(players, bulletOwner) {
    //TODO: Iterates through all of the players and determine if any of them were hit by this bullet
    players.forEach(player => {
      let playerPos = player.getPosition();
      let distance = Math.sqrt((playerPos[0]-this.position[0])**2 + (playerPos[1]-this.position[1])**2);
      if (distance < BULLET_RADIUS + player.getRadius()) {
        if (player === bulletOwner) {
          player.absorb();
        } else {
          player.getsHit();
        }
        this.#isActive = false;
      }
    })
  }

  checkWallCollision() {
    //TODO: Checks if this bullet is hitting a wall.
    if (!(Math.abs(BORDER_MAX_X/2-this.position[0])<BORDER_MAX_X/2-BULLET_RADIUS)) {
      this.#angle = Math.PI-this.#angle;
    }
    if (!(Math.abs(BORDER_MAX_Y/2-this.position[1])<BORDER_MAX_Y/2-BULLET_RADIUS)) {
      this.#angle = -this.#angle;
    }
  }
}

export default Bullet;
