class Player {
  #base = [0, 0];
  #health = 0; // max health should be 100 and the bullet speed should be the same speed as somebody at 2 health (100/sqrt(2))
  #id = 0;
  #bullets = [];
  #baseHealth = 0;

  constructor(health, x, y, id) {
    this.#health = health;
    this.#baseHealth = health;
    this.#base = [x, y];
    this.#id = id;
  }

  #speed() {
    return this.#baseHealth / Math.sqrt(this.#health);
  }

  /**
   * @param {Number} theta
   */
  #radius() {
    return Math.sqrt(this.#health / Math.PI);
  }

  shoot(theta) {
    // mouse direction
    this.#health--;
    this.#bullets.push(
      new BulletObj(
        this.#base[0] + (this.#radius() + this.#speed()) * Math.cos(theta),
        this.#base[1] + (this.#radius + this.#speed()) * Math.sin(theta),
        theta
      )
    );
  }

  /**
   * @param {Number} theta
   */
  #move(theta) {
    // pi/4 increments because if like up & left are pressed, we get a 3pi/4 angle --- keyboard directions
    if (theta !== undefined) {
      this.#base[0] += this.#speed() * Math.cos(theta);
      this.#base[1] += this.#speed() * Math.sin(theta);
    }
  }

  /**
   * Used to draw bullets toward player base --- call when Ctrl key or something is pressed
   * @param {Number} index
   */
  #moveBullets() {
    for (let i = 0; i < this.#bullets.length; i++) {
      pos = this.#bullets[i].getPosition();
      vec = [pos[0] - this.base[0], pos[1] - this.base[1]];
      this.#bullets[i].getPosition(Math.tan(vec[1] / vec[0]), this.#health);
      this.#bullets[i].move();
    }
  }

  /**
   * @param {Boolean} whether or not to pull bullets
   * @param {Number} theta nonempty for movement of base
   */
  move(pull, theta) {
    if (theta !== undefined) this.#move(theta);
    this.#moveBullets();
  }

  getBase() {
    return [...this.#base, this.#radius()];
  }

  getBullets() {
    arr = [];
    for (bullet of this.#bullets) arr.push(bullet.getPosition());
    return arr;
  }
}

export default Player;
