const Player = require("./Player");

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
  console.log("hi");
  init_position = spawnPositions[Object.keys(gameState.players).length];
  newPlayer = new Player(INIT_HEALTH, init_position.x, init_position.y, id);
  console.log(newPlayer.getPosition());
  gameState.players[id] = newPlayer;
};

const movePlayer = (id, dir) => {
  gameState.players[id].move(dir);
};

const playerShoot = (id, dir) => {
  gameState.players[id].shoot(dir);
};

const checkWin = () => {
  winner = undefined;
  nonzeroHealth = 0;
  for (let player_id of Object.keys(gameState.players)) {
    if (gameState.players[player_id].health !== 0) {
      nonzeroHealth++;
      winner = player_id;
    }
  }
  if (nonzeroHealth === 1) gameState.winner = winner;
};

const removePlayer = (id) => {
  if (gameState.players[id] != undefined) {
    delete gameState.players[id];
  }
};

const updateGameState = () => {
  //checkWin();
  for (p of Object.values(gameState.players)) p.moveBullets(gameState.players);
};

module.exports = {
  gameState,
  addPlayer,
  movePlayer,
  playerShoot,
  removePlayer,
  updateGameState,
};
