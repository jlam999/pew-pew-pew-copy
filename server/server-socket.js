const { reset } = require("nodemon");
const socket = require("socket.io-client/lib/socket");
//const gameLogic = require("./game-logic");
const GameState = require("./GameState");
const { remove } = require("./models/user");

const FPS = 60;

let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object
const codeToGameMap = {};
const codeToLobbyMap = {};
const userToCodeMap = {}; // maps user ID to room code

const getAllConnectedUsers = () => Object.values(socketToUserMap);
const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];
const getCodeFromUserID = (userid) => {
  return userToCodeMap[userid];
};

const sendGameState = (code) => {
  const package = codeToGameMap[code].packageGameState();
  //console.log(package);
  //console.log("Sending to room code:", code);
  io.to(code).emit("update", package);
};

//Returns true if at least one connected user is in the game.
// const checkUserConnection = () => {
//   for (let user of getAllConnectedUsers()) {
//     if (Object.keys(gameLogic.gameState.players).includes(user.googleid)) {
//       return false;
//     }
//   }
//   // console.log("connected users: ");
//   // console.log(
//   //   getAllConnectedUsers().map((user) => {
//   //     return user.googleid;
//   //   })
//   // );
//   // console.log("users in game: ");
//   // console.log(Object.keys(gameLogic.gameState.players));
//   return true;
// };

const startRunningGame = () => {
  setInterval(() => {
    const gameStates = Object.values(codeToGameMap).forEach((gameState) => {
      if (gameState.isActive) {
        sendGameState(gameState.code);
        gameState.updateGameState();
      }
    });
  }, 1000 / FPS);

  // let frame_counter = 0;
  // let win_count;
  // setInterval(() => {
  //   if (gameLogic.gameState.isActive) {
  //     frame_counter++;
  //     sendGameState();
  //     gameLogic.updateGameState();
  //     if (frame_counter > FPS && checkUserConnection()) {
  //       console.log("all players left");
  //       gameLogic.reset();
  //     }
  //     if (gameLogic.gameState.winner !== null) {
  //       if (win_count === undefined) {
  //         win_count = frame_counter;
  //       } else if (frame_counter - win_count > FPS * 10) {
  //         io.emit("end game");
  //       }
  //     }
  //   } else {
  //     frame_counter = 0;
  //     win_count = undefined;
  //   }
  // }, 1000 / FPS);
};

//Start running the game!
startRunningGame();

// const lobbyPlayers = new Set();

const createLobby = (user, socket) => {
  let code = "";
  for (let i = 0; i < 6; i++) {
    const char = String.fromCharCode(Math.random() * 26 + 65);
    code += char;
  }
  codeToGameMap[code] = new GameState(code);
  const lobbyPlayers = new Set();
  codeToLobbyMap[code] = lobbyPlayers;
  return code;
};

const addPlayerToLobby = async (user, socket, roomCode) => {
  let alreadyAdded = false;
  userToCodeMap[user.googleid] = roomCode;
  const lobbyPlayers = codeToLobbyMap[roomCode];
  // console.log("code", JSON.stringify(roomCode));
  // console.log(codeToLobbyMap);
  // console.log("Players: ", lobbyPlayers);
  // console.log(codeToGameMap);
  for (let player of lobbyPlayers) {
    if (player.googleid === user.googleid) {
      alreadyAdded = true;
    }
  }
  if (!alreadyAdded) {
    lobbyPlayers.add({ name: user.name, googleid: user.googleid });
    socket.join(roomCode, function () {
      console.log("Joined", roomCode);
      console.log("rooms: ", socket.rooms);
    });
    io.to(roomCode).emit("lobby", [...lobbyPlayers]);
  }
  return lobbyPlayers;
};

const removePlayerFromLobby = (user, socket, roomCode) => {
  const lobbyPlayers = codeToLobbyMap[roomCode];
  lobbyPlayers.forEach((player) => {
    if (user.googleid === player.googleid) {
      lobbyPlayers.delete(player);
      delete userToCodeMap[user.googleid];
      console.log("delete roomCode");
      socket.leave(roomCode, function () {
        console.log("Left", roomCode);
      });
    }
  });
  io.to(roomCode).emit("lobby", [...lobbyPlayers]);
  return lobbyPlayers;
};

const addUserToGame = (user, socket, code) => {
  if (code === null) {
    code = getCodeFromUserID(user.googleid);
  }
  if (!Object.keys(codeToGameMap[code].players).includes(user.googleid)) {
    codeToGameMap[code].addPlayer(user.googleid);
    userToCodeMap[user.googleid] = code;
    socket.join(code, () => {
      console.log("Joined Game", code);
      console.log("rooms: ", socket.rooms);
    });
    //console.log(String(user.googleid) + " has been added to the game. Code: " + String(code));
  }
};

const removeUserFromGame = (user, socket) => {
  const code = userToCodeMap[user.googleid];
  if (Object.keys(codeToGameMap[code].players).includes(user.googleid)) {
    codeToGameMap[code].removePlayer(user.googleid);
    socket.leave(code, () => {
      console.log("Left Game", code);
    });
    delete userToCodeMap[user.googleid];
    //console.log(String(user.googleid) + " has been removed to the game. Code: " + String(code));
  }
};

const startGame = (code) => {
  codeToGameMap[code].startGame();
  //console.log("Game Started");
  io.to(code).emit("start game");
};

const getGameState = (code) => {
  return codeToGameMap[code];
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

  roomCode = getCodeFromUserID(user.googleid);
  if (roomCode !== undefined) {
    socket.join(roomCode);
  }
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
        console.log("Socket has disconnected " + String(socket.id));
      });
      socket.on("move", (dir) => {
        const user = getUserFromSocketID(socket.id);
        //console.log("after move attempt:", userToCodeMap);
        const roomCode = getCodeFromUserID(user.googleid);
        //console.log("code:", roomCode);
        if (user) codeToGameMap[roomCode].movePlayer(user.googleid, dir);
      });
      socket.on("shoot", (position) => {
        const user = getUserFromSocketID(socket.id);
        //console.log("after shoot attempet:", userToCodeMap);
        const roomCode = getCodeFromUserID(user.googleid);
        //console.log("code:", roomCode);
        if (user) codeToGameMap[roomCode].playerShoot(user.googleid, position);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,
  addUserToGame: addUserToGame,
  removeUserFromGame: removeUserFromGame,
  startGame: startGame,
  getGameState: getGameState,
  createLobby: createLobby,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getCodeFromUserID: getCodeFromUserID,
  userToCodeMap: userToCodeMap,
  getIo: () => io,

  addPlayerToLobby: addPlayerToLobby,
  removePlayerFromLobby: removePlayerFromLobby,
};
