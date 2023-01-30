//Constants
MAP_LENGTH = 500;
INIT_HEALTH = 100;
SPAWN_DIFF = 50;

//Determines the spawn locations of all four players
const spawnPositions = [
  { x: SPAWN_DIFF, y: SPAWN_DIFF },
  { x: MAP_LENGTH - SPAWN_DIFF, y: MAP_LENGTH - SPAWN_DIFF },
  { x: SPAWN_DIFF, y: MAP_LENGTH - SPAWN_DIFF },
  { x: MAP_LENGTH - SPAWN_DIFF, y: SPAWN_DIFF },
];

const Player = require("./Player");

class GameState {
  winner = null;
  isActive = false;
  players = {};
  code;
  frame_count = 0;

  constructor(code) {
    this.winner = null;
    this.isActive = false;
    this.players = {};
    this.code = code;
  }

  startGame() {
    this.isActive = true;
  }

  reset() {
    this.winner = null;
    this.isActive = false;
    this.players = {};
  }

  addPlayer(id) {
    const newPlayer = new Player(INIT_HEALTH, 0, 0, id);
    this.players[id] = newPlayer;
    const numPlayers = Object.keys(this.players).length;
    const init_position = spawnPositions[numPlayers - 1]; //TO CHANGE
    newPlayer.setPosition(init_position.x, init_position.y);
  }

  movePlayer(id, dir) {
    if (this.isActive) {
      this.players[id].move(dir);
    }
  }

  playerShoot(id, position) {
    if (this.isActive) {
      const player = this.players[id];
      const playerPos = player.getPosition();
      const diffX = position.x - playerPos.x;
      const diffY = playerPos.y - position.y;
      let angle = Math.atan2(diffY, diffX);
      player.shoot(angle);
    }
  }

  //There can only be a winner if there is more than one player in the game.
  checkWin() {
    let winner = undefined;
    let notDead = 0;
    const player_ids = Object.keys(this.players);
    if (player_ids.length > 1) {
      for (let player_id of Object.keys(this.players)) {
        if (!this.players[player_id].getIsDead()) {
          notDead++;
          winner = player_id;
        }
      }
      if (notDead === 1) {
        this.winner = winner;
      }
    }
  }

  removePlayer(id) {
    if (this.players[id] != undefined) {
      delete this.players[id];
      if (Object.keys(this.players).length === 0) {
        this.isActive = false;
        this.winner = null;
      }
    }
  }

  updateGameState() {
    //make players move as well
    this.checkWin();
    for (let p of Object.values(this.players)) p.updatePlayerState(this.players);
  }

  packageGameState() {
    const newPlayers = {};
    for (let player_id of Object.keys(this.players)) {
      newPlayers[player_id] = this.players[player_id].toObject();
    }
    return { winner: this.winner, players: newPlayers, isActive: this.isActive };
  }
}

module.exports = GameState;
