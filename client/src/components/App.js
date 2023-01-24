import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import jwt_decode from "jwt-decode";

import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";

import "../utilities.css";

import { get, post } from "../utilities";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile.js";
import Game from "./pages/Game.js";

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
    //console.log("cred", decodedCredential);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      console.log("Set ID: ", user.googleid);
      setUserId(user.googleid);
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  return (
    <>
      <Router>
        <Home path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
        <Profile path={`/profile/${userId}`} userId={userId} />
        <Skeleton
          path="/skeleton"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
        />
        <Game path="/game" userId={userId} />
        <NotFound default />
      </Router>
    </>
  );
};

export default App;
