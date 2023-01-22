const socket = require("socket.io-client/lib/socket");
const gameLogic = require("./game-logic");

const FPS = 1;

let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const sendGameState = () => {
  io.emit("update", gameLogic.gameState);
};

const startRunningGame = () => {
  setInterval(() => {
    sendGameState();
  }, 1000 / FPS);
};

//Start running the game!
startRunningGame();

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user.googleId];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user.googleId] = socket;
  socketToUserMap[socket.id] = user;

  gameLogic.addPlayer(user.googleId);
  console.log("Player added");
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user.googleId];
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
        const uder = getUserFromSocketID(socket.id);
        if (user) gameLogic.movePlayer(user.googleId, dir);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
