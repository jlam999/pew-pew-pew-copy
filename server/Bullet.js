class Bullet {
  position = 0;
  angle = 0;
  speed = 0;

  constructor(x, y, theta) {
    this.position = [x, y];
    this.angle = theta;
    this.speed = 100 / Math.sqrt(2); // start at 100/sqrt(2) and decrease exponentially
  }

  adjustPath(theta, health) {
    // the speed at which the bullet is drawn toward a player is inversely proportional to the root of the player's health
    speed = 100 / Math.sqrt(health);
    vec = [
      this.speed * Math.cos(this.angle) + speed * Math.cos(this.angle),
      this.speed * Math.sin(this.angle) + speed * Math.sin(this.angle),
    ];
    this.angle = Math.tan(vec[1] / vec[0]); // update angle
    this.speed += speed / 0.95; // TODO: rewrite for projection calculations
  }

  move() {
    this.position = [
      this.position[0] + this.speed * Math.cos(this.angle),
      this.position[1] + this.speed * Math.sin(this.angle),
    ];
    this.speed *= 0.95;
  }

  getLocation(theta = undefined, health = undefined) {
    if (!(theta == undefined && health == undefined)) adjustPath(theta, health);
    return position;
  }
}

export default Bullet;
