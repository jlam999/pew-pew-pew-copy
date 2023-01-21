//Constants
MAP_LENGTH = 500;
INIT_HEALTH = 100;
SPAWN_DIFF = 50;

//Game State
gameState = {
  winner: null,
  players: {},
};

/**
 * gameState.players will comprise PlayerObjs of the following form:
 * PlayerObj = {
 *  position: {x: Number, y: Number},
 *  health: Number,
 *  bullets: [BulletObj],
 * }
 *
 * BulletObjs are of the following form:
 * BulletObj = {
 *  position: {x: Number, y: Number},
 *  angle: Number,
 *  speed: Number,
 * }
 */

//Determines the spawn locations of all four players
const spawnPositions = [
  { x: SPAWN_DIFF, y: SPAWN_DIFF },
  { x: MAP_LENGTH - SPAWN_DIFF, y: MAP_LENGTH - SPAWN_DIFF },
  { x: SPAWN_DIFF, y: MAP_LENGTH - SPAWN_DIFF },
  { x: MAP_LENGTH - SPAWN_DIFF, y: SPAWN_DIFF },
];

const addPlayer = (id) => {
  gameState.players[id] = {
    position: spawnPositions[Object.keys(gameState.players).length], //Initial position to be calculated later
    health: INIT_HEALTH,
    bullets: [],
  };
};

const movePlayer = (id, dir) => {
  // Unbounded moves
  speed = 10;
  if (dir === "up") {
    gameState.players[id].position.y -= speed;
  } else if (dir === "down") {
    gameState.players[id].position.y += speed;
  } else if (dir === "left") {
    gameState.players[id].position.x -= speed;
  } else if (dir === "right") {
    gameState.players[id].position.x += speed;
  }
};

const removePlayer = (id) => {
  if (gameState.players[id] != undefined) {
    delete gameState.players[id];
  }
};

module.exports = {
  gameState,
  addPlayer,
  movePlayer,
  removePlayer,
};
