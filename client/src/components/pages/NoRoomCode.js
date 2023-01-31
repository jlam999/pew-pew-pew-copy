import React from "react";
import { Link } from "@reach/router";

/**
 * Error no room code :(
 */
const NoRoomCode = (props) => {
  return (
    <div>
      <h1>Error: No Room Code</h1>
      <div>You don't have a room code. And you almost broke our website (-_-)</div>
      <Link to="/">Please Return Home.</Link>
    </div>
  );
};

export default NoRoomCode;
