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
const Stats = require("./models/stats")

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const { STATES } = require("mongoose");
//const { default: StatsBox } = require("../client/src/components/modules/StatsBox");

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
  console.log("Searching for ", req)
  const query = { googleid: req.query.googleid };
  User.find(query).then((user) => {
    console.log("Found ", user)
    res.send(user);
  });
});

router.get("/stats", (req, res) => {
  console.log("Searching for stats for ", req)
  const query = { googleid: req.query.googleid };
  Stats.find(query).then((stats) => {
    console.log("Found Stats",stats);
    res.send(stats)
  })
})

/*
//Does not take in picture yet.
router.post("/addUser", (req, res) => {
  const newUser = new User({
    id: req.user._id,
    name: req.user.name,
  });
  const newUserStats = new Stats({
    id: req.user._id,
    wins: 0,
    games: 0,
    kills: 0,
  })
  newUser.save().then(res.send(`User ${req.user.name} was created.`));
  newUserStats.save().then(res.send(`User ${req.user.name}$ stats were created.`))
});*/

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
