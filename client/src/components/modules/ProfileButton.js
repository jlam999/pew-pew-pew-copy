import React, { useState } from "react";
import {GoogleLogin, GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import { Link } from "@reach/router";


import "./ProfileButton.css"
import DefaultProfileImg from "../../public/profile.jpg"

const GOOGLE_CLIENT_ID = "329655122590-a18c4j9pbbiu6thahct4a0dse0p457qd.apps.googleusercontent.com"; //OUR CLIENT, NOT WEBLAB'S

const ProfileButton = (props) => {
    
    let ProfileImg;
    if (props.userId) {
        ProfileImg = <p>{props.userId}</p>
    } else {
        ProfileImg = <img src={DefaultProfileImg} alt="Profile" className="profileImg"/>
    }

    return (
        <div>
            <div className="googleLoginButton">
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                {props.userId ? (<button
                    onClick={() => {
                        googleLogout();
                        props.handleLogout();
                    }}
                >
                    Logout
                </button>) : (
                    <GoogleLogin
                        onSuccess={props.handleLogin}
                        onError={(err)=>console.log(err)}
                    />
                )}
            </GoogleOAuthProvider>
                {/*{props.userId ? (
                <GoogleLogout
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={props.handleLogout}
                onFailure={(err) => console.log(err)}
                />
                ) : (
                <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Login"
                onSuccess={props.handleLogin}
                onFailure={(err) => console.log(err)}
                />)}*/}
            </div>
            <button className="profileImgButton">
                <Link to="/profile">
                    {ProfileImg}
                </Link>
            </button>
        </div>
    )
}

export default ProfileButton;