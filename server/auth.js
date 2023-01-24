const { OAuth2Client } = require("google-auth-library");
//const { Stats } = require("webpack");
const User = require("./models/user");
const Stats = require("./models/stats");
const socketManager = require("./server-socket");

// create a new OAuth client used to verify google sign-in
//    TODO: replace with your own CLIENT_ID
const CLIENT_ID = "329655122590-a18c4j9pbbiu6thahct4a0dse0p457qd.apps.googleusercontent.com"; //OUR CLIENT, NOT WEBLAB'S
const client = new OAuth2Client(CLIENT_ID);
//console.log(client);

// accepts a login token from the frontend, and verifies that it's legit
function verify(token) {
  return client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((ticket) => ticket.getPayload());
}

// gets user from DB, or makes a new account if it doesn't exist yet
function getOrCreateUser(user) {
  // the "sub" field means "subject", which is a unique identifier for each user
  return User.findOne({ googleid: user.sub }).then((existingUser) => {
    if (existingUser) return existingUser;

    const newUser = new User({
      name: user.name,
      googleid: user.sub,
      picture: user.picture,
    });
    const newUserStats = new Stats({
      googleid: user.sub,
      games: 0,
      wins: 0,
      kills: 0,
    });

    newUserStats.save();
    newUser.save();
    return newUser;
  });
}

function login(req, res) {
  verify(req.body.token)
    .then((user) => getOrCreateUser(user))
    .then((user) => {
      // persist user in the session
      req.session.user = user;
      res.send(user);
    })
    .catch((err) => {
      console.log(`Failed to log in: ${err}`);
      res.status(401).send({ err });
    });
}

function logout(req, res) {
  req.session.user = null;
  res.send({});
}

function populateCurrentUser(req, res, next) {
  // simply populate "req.user" for convenience
  req.user = req.session.user;
  next();
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ err: "not logged in" });
  }

  next();
}

module.exports = {
  login,
  logout,
  populateCurrentUser,
  ensureLoggedIn,
};
