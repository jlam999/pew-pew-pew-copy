import React from "react";
import { Link } from "@reach/router";

/**
 * Error not found :/
 */
const NotFound = (props) => {
  return (
    <div>
      <h1>404 Not Found</h1>
      {(!props.userId) ? (
        <p>The page you requested couldn't be found. This may be because you have not logged in.</p>
      )   :   (
        <p>The page you requested couldn't be found.</p>
      )}
      <Link to="/">Please Return Home.</Link>
    </div>
  );
};

export default NotFound;
