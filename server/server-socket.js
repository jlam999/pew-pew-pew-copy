const { reset } = require("nodemon");
const socket = require("socket.io-client/lib/socket");
const GameState = require("./GameState");

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
const getAllRoomCodes = () => {
  return Object.keys(codeToLobbyMap);
};

const sendGameState = (code) => {
  const package = codeToGameMap[code].packageGameState();
  io.to(code).emit("update", package);
};

const usersAreConnected = (gameState) => {
  for (let playerid of Object.keys(gameState.players)) {
    if (
      getAllConnectedUsers()
        .map((user) => user.googleid)
        .includes(playerid)
    ) {
      return true;
    }
  }
  return false;
};

const addPowerUps = (gameState) => {
  if (gameState.powerUps.length < 2) {
    gameState.spawnPowerUp();
  }
};

const startRunningGame = () => {
  setInterval(() => {
    Object.values(codeToGameMap).forEach((gameState) => {
      emitted = false;
      if (gameState.isActive) {
        if (gameState.frame_count > FPS && !usersAreConnected(gameState)) {
          gameState.reset();
        }
        if (gameState.winner !== null) {
          if (gameState.win_frame === undefined) {
            gameState.win_frame = gameState.frame_count;
          } else if (gameState.frame_count - gameState.win_frame === FPS * 10) {
            io.emit("end game", gameState.packageGameState());
          }
        }
        sendGameState(gameState.code);
        gameState.updateGameState();
        if (gameState.frame_count % (FPS * 20) === 0) {
          addPowerUps(gameState);
        }
        gameState.frame_count++;
      } else {
        gameState.frame_count = 0;
        gameState.win_frame = undefined;
      }
    });
  }, 1000 / FPS);
};

//Start running the game!
startRunningGame();

const createLobby = (user, socket) => {
  let code = "";
  for (let i = 0; i < 6; i++) {
    const char = String.fromCharCode(Math.random() * 26 + 65);
    code += char;
  }
  codeToGameMap[code] = new GameState(code);
  const lobbyPlayers = [];
  codeToLobbyMap[code] = lobbyPlayers;
  return code;
};

const addPlayerToLobby = async (user, socket, roomCode) => {
  let alreadyAdded = false;
  userToCodeMap[user.googleid] = roomCode;
  const lobbyPlayers = codeToLobbyMap[roomCode];
  let emptyArray = [];
  for (let player of lobbyPlayers) {
    if (player.googleid === user.googleid) {
      // for (let j = 0; j < 4-lobbyPlayers.size; j++) {
      //   emptyArray.push(undefined)
      // }
      alreadyAdded = true;
    }
  }
  if (!alreadyAdded) {
    if (lobbyPlayers.length === 4) {
      return "Lobby is full.";
    } else {
      lobbyPlayers.push({ name: user.name, googleid: user.googleid });
      socket.join(roomCode, function () {
        // console.log("Joined", roomCode);
        // console.log("rooms: ", socket.rooms);
      });
    }
  }
  for (let j = 0; j < 4 - lobbyPlayers.length; j++) {
    emptyArray.push(undefined);
  }
  io.to(roomCode).emit("lobby", [...lobbyPlayers].concat(emptyArray));
  return [...lobbyPlayers].concat(emptyArray);
};

const removePlayerFromLobby = (user, socket, roomCode) => {
  let lobbyPlayers = codeToLobbyMap[roomCode];
  lobbyPlayers = lobbyPlayers.filter((player) => {
    if (user.googleid === player.googleid) {
      delete userToCodeMap[user.googleid];
      socket.leave(roomCode, function () {
        //console.log("Left", roomCode);
      });
      return false;
    }
    return true;
  });
  codeToLobbyMap[roomCode] = lobbyPlayers;
  let emptyArray = [];
  for (let j = 0; j < 4 - lobbyPlayers.length; j++) {
    emptyArray.push(undefined);
  }
  io.to(roomCode).emit("lobby", [...lobbyPlayers].concat(emptyArray));
  return [...lobbyPlayers].concat(emptyArray);
};

const addUserToGame = (user, socket, code) => {
  if (code === null) {
    code = getCodeFromUserID(user.googleid);
  }
  if (!Object.keys(codeToGameMap[code].players).includes(user.googleid)) {
    codeToGameMap[code].addPlayer(user.googleid, user.name);
    userToCodeMap[user.googleid] = code;
    socket.join(code, () => {
      // console.log("Joined Game", code);
      // console.log("rooms: ", socket.rooms);
    });
  }
};

const removeUserFromGame = (user, socket) => {
  const code = userToCodeMap[user.googleid];
  if (code !== undefined && Object.keys(codeToGameMap[code].players).includes(user.googleid)) {
    codeToGameMap[code].removePlayer(user.googleid);
    socket.leave(code, () => {
      //console.log("Left Game", code);
    });
    delete userToCodeMap[user.googleid];
  }
};

const startGame = (code) => {
  codeToGameMap[code].startGame();
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
    console.log("Old Socket disconnected. ID:", oldSocket.id);
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
        const roomCode = getCodeFromUserID(user.googleid);
        if (user) codeToGameMap[roomCode].movePlayer(user.googleid, dir);
      });
      socket.on("shoot", (position) => {
        const user = getUserFromSocketID(socket.id);
        const roomCode = getCodeFromUserID(user.googleid);
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
  getAllRoomCodes: getAllRoomCodes,
  getIo: () => io,

  addPlayerToLobby: addPlayerToLobby,
  removePlayerFromLobby: removePlayerFromLobby,
};
