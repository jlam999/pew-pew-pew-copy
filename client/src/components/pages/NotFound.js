import React from "react";
import { Link } from "@reach/router";

/**
 * Error not found :/
 */
const NotFound = () => {
  return (
    <div>
      <h1>404 Not Found</h1>
      <p>The page you requested couldn't be found. This may be because you have not logged in.</p>
      <Link to="/">Please Return Home.</Link>
    </div>
  );
};

export default NotFound;
