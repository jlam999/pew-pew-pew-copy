/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Stats = require("./models/stats");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const { STATES } = require("mongoose");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

//Get user by user id.
router.get("/user", (req, res) => {
  const query = { googleid: req.query.googleid };
  User.find(query).then((user) => {
    res.send(user[0]);
  });
});

router.get("/stats", (req, res) => {
  const query = { googleid: req.query.googleid };
  Stats.find(query).then((stats) => {
    res.send(stats[0]);
  });
});

router.post("/addGameStats", (req, res) => {
  const query = { googleid: req.user.googleid };

  Stats.findOne(query).then((stats) => {
    stats.games++;
    stats.wins += req.body.win;
    stats.kills += req.body.kills;
    stats.save();
  });
});

router.get("/roomCode", (req, res) => {
  if (req.user) {
    const code = socketManager.getCodeFromUserID(String(req.user.googleid));
    console.log(req.user.googleid);
    console.log(socketManager.userToCodeMap);
    console.log(code);
    res.send(JSON.stringify(code));
  }
});

router.post("/spawn", (req, res) => {
  if (req.user) {
    socketManager.addUserToGame(
      req.user,
      socketManager.getSocketFromSocketID(req.body.socketid),
      req.body.code
    );
  }
  res.send({});
});

router.post("/despawn", (req, res) => {
  if (req.user) {
    socketManager.removeUserFromGame(
      req.user,
      socketManager.getSocketFromSocketID(req.body.socketid)
    );
  }
  res.send({});
});

router.get("/gameState", (req, res) => {
  res.send(socketManager.getGameState(req.query.code));
});

router.post("/startGame", (req, res) => {
  socketManager.startGame(req.body.code);
  res.send({});
});

router.get("/joinLobby", async (req, res) => {
  if (req.user) {
    const lobbyPlayers = await socketManager.addPlayerToLobby(
      req.user,
      socketManager.getSocketFromSocketID(req.query.socketid),
      req.query.roomCode
    );
    res.send([...lobbyPlayers]);
  }
});

router.get("/leaveLobby", async (req, res) => {
  if (req.user) {
    const lobbyPlayers = await socketManager.removePlayerFromLobby(
      req.user,
      socketManager.getSocketFromSocketID(req.query.socketid),
      req.query.roomCode
    );
    console.log("Left lobby!");
    res.send([...lobbyPlayers]);
  }
});

router.post("/createLobby", (req, res) => {
  const code = socketManager.createLobby();
  res.send(JSON.stringify(code));
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
