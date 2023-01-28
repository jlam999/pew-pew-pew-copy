const socket = require("socket.io-client/lib/socket");
const gameLogic = require("./game-logic");
const { remove } = require("./models/user");

const FPS = 60;

let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const lobbyPlayers = new Set();

const addPlayerToLobby = (user) => {
  let alreadyAdded = false;
  for (let player of lobbyPlayers) {
    if (player.googleid === user.googleid) {
      alreadyAdded = true;
    }
  }
  if (!alreadyAdded) {
    lobbyPlayers.add({ name: user.name, googleid: user.googleid });
    io.emit("lobby", [...lobbyPlayers]);
  }
  return lobbyPlayers;
};

const removePlayerFromLobby = (user) => {
  lobbyPlayers.forEach((player) => {
    if (user.googleid === player.googleid) {
      lobbyPlayers.delete(player);
    }
  });
  io.emit("lobby", [...lobbyPlayers]);
  return lobbyPlayers;
};

const sendGameState = () => {
  const package = gameLogic.packageGameState();
  io.emit("update", package);
};

const startRunningGame = () => {
  setInterval(() => {
    sendGameState();
    gameLogic.updateGameState();
  }, 1000 / FPS);
};

//Start running the game!
startRunningGame();

const addUserToGame = (user) => {
  if (!Object.keys(gameLogic.gameState.players).includes(user.googleid)) {
    gameLogic.addPlayer(user.googleid);
  }
};

const removeUserFromGame = (user) => {
  if (Object.keys(gameLogic.gameState.players).includes(user.googleid)) {
    gameLogic.removePlayer(user.googleid);
  }
};

const startGame = () => {
  io.emit("start game");
  gameLogic.startGame();
};

const getGameState = () => {
  return gameLogic.gameState;
};

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user.googleid];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user.googleid] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  if (user) {
    delete userToSocketMap[user.googleid];
  }

  delete socketToUserMap[socket.id];
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
      socket.on("move", (dir) => {
        const user = getUserFromSocketID(socket.id);
        if (user) gameLogic.movePlayer(user.googleid, dir);
      });
      socket.on("shoot", (position) => {
        const user = getUserFromSocketID(socket.id);
        if (user) gameLogic.playerShoot(user.googleid, position);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,
  addUserToGame: addUserToGame,
  removeUserFromGame: removeUserFromGame,
  startGame: startGame,
  getGameState: getGameState,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,

  addPlayerToLobby: addPlayerToLobby,
  removePlayerFromLobby: removePlayerFromLobby,
};
