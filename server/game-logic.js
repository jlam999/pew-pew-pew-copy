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
  newPlayer = new Player(INIT_HEALTH, 0, 0, id);
  gameState.players[id] = newPlayer;
  init_position = spawnPositions[Object.keys(gameState.players).length-1];
  newPlayer.setPosition(init_position.x, init_position.y);
  console.log(newPlayer.getPosition());
};

const movePlayer = (id, dir) => {
  gameState.players[id].move(dir);
};

const playerShoot = (id, position) => {
  const player = gameState.players[id];
  playerPos = player.getPosition();
  const diffX = position.x - playerPos.x;
  const diffY = playerPos.y - position.y;
  let angle = Math.atan2(diffY, diffX);
  player.shoot(angle);
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
  for (let p of Object.values(gameState.players)) p.moveBullets(gameState.players);
};

const packageGameState = () => {
  newPlayers = {};
  for (let player_id of Object.keys(gameState.players)) {
    newPlayers[player_id] = gameState.players[player_id].toObject();
  }
  return { winner: gameState.winner, players: newPlayers };
};

module.exports = {
  //gameState,
  addPlayer,
  movePlayer,
  playerShoot,
  removePlayer,
  updateGameState,
  packageGameState,
};
