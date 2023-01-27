import React, { useState, useEffect } from "react";
import { Router, useNavigate } from "@reach/router";
import jwt_decode from "jwt-decode";

import NotFound from "./pages/NotFound.js";

import "../utilities.css";

import { get, post } from "../utilities";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile.js";
import Game from "./pages/Game.js";
import Lobby from "./pages/Lobby.js";

import { socket } from "../client-socket.js";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user.googleid) {
        // they are registed in the database, and currently logged in.
        setUserId(user.googleid);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user.googleid);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  return (
    <>
      {userId ? (
        <Router>
          <Home path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
          <Profile path={`/profile/${userId}`} userId={userId} />
          <Game path="/game" userId={userId} />
          <Lobby path="/lobby" userId={userId} />
          <NotFound default />
        </Router>
      ) : (
        <Router>
          <Home path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
          <NotFound default />
        </Router>
      )}
    </>
  );
};

export default App;
