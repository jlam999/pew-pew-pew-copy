const GameState = require("./GameState.js");

const codeToGame = {};

const addGameRoom = (code) => {
  codeToGame[code] = new GameState();
};

const removeGameRoom = (code) => {
  delete codeToGame[code];
};

const updateAllRooms = () => {
  for (let game of Object.values(codeToGame)) {
    game.updateGameState();
  }
};
