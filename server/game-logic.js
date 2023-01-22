//Constants
MAP_LENGTH = 500;
INIT_HEALTH = 100;
SPAWN_DIFF = 50;

//Game State
gameState = {
  winner: null,
  players: {},
};

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
  gameState.players[id].move(dir);
};

const playerShoot = (id, dir) => {
  gameState.players[id].shoot(dir);
};

const checkWin = () => {
  //TODO: Checks if the game has been won.
};

const removePlayer = (id) => {
  if (gameState.players[id] != undefined) {
    delete gameState.players[id];
  }
};

//TODO
const updateGameState = () => {};

module.exports = {
  gameState,
  addPlayer,
  movePlayer,
  playerShoot,
  removePlayer,
};
