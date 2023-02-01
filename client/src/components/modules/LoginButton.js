import React, { useEffect, useState } from "react";
import { GoogleLogin, GoogleOAuthProvider, googleLogout } from "@react-oauth/google";

import "./LoginButton.css";
const GOOGLE_CLIENT_ID = "329655122590-a18c4j9pbbiu6thahct4a0dse0p457qd.apps.googleusercontent.com"; //OUR CLIENT, NOT WEBLAB'S

const LoginButton = (props) => {
  return (
    <div className="LoginButton">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {props.userId ? (
          <button
            onClick={() => {
              googleLogout();
              props.handleLogout();
            }}
            className="LogoutButton"
          >
            Logout
          </button>
        ) : (
          <GoogleLogin
            text="signin"
            onSuccess={props.handleLogin}
            onError={(err) => console.log(err)}
            className="LoginButton"
            theme={"outline"}
            shape="pill"
            ux_mode={"popup"}
            width="200px"
            size="large"
          />
        )}
      </GoogleOAuthProvider>
    </div>
  );
};

export default LoginButton;
