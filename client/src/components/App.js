import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import jwt_decode from "jwt-decode";
import { socket } from "../client-socket.js";

import NotFound from "./pages/NotFound.js";

import "../utilities.css";

import { get, post } from "../utilities";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile.js";
import Game from "./pages/Game.js";
import Lobby from "./pages/Lobby.js";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(null);
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user.googleid) {
        // they are registed in the database, and currently logged in.
        setUserId(user.googleid);
      }
    });

    get("/api/getUserRoomCode").then((code) => {
      if (code !== "undefined") {
        setRoomCode(code);
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

  const createLobby = async () => {
    const code = await post("/api/createLobby", { socketid: socket.id });
    setRoomCode(code);
    return code;
  };

  const joinLobby = async (code) => {
    setRoomCode(code);
    return code;
  };

  return (
    <>
      {userId ? (
        <Router>
          <Home
            path="/"
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            userId={userId}
            createLobby={createLobby}
            joinLobby={joinLobby}
          />
          <Profile path={`/profile/${userId}`} userId={userId} />
          <Game path="/game" userId={userId} roomCode={roomCode} />
          <Lobby path="/lobby" userId={userId} roomCode={roomCode} />
          <NotFound default userId={userId} />
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
