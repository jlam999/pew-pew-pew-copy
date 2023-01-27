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

router.post("/spawn", (req, res) => {
  if (req.user) {
    socketManager.addUserToGame(req.user);
  }
  res.send({});
});

router.post("/despawn", (req, res) => {
  if (req.user) {
    socketManager.removeUserFromGame(req.user);
  }
  res.send({});
});

router.get("/gameState", (req, res) => {
  res.send(socketManager.getGameState());
});

router.post("/startGame", (req, res) => {
  socketManager.startGame();
  res.send({});
});

router.post("/joinLobby", (req, res) => {
  if (req.user) {
    socketManager.addPlayerToLobby(req.user);
  }
});

router.post("/leaveLobby", (req, res) => {
  if (req.user) {
    socketManager.removePlayerFromLobby(req.user);
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
