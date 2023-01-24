import React, { useState,useEffect } from "react";
import {GoogleLogin, GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import { Link } from "@reach/router";
import { get } from "../../utilities";

import "./ProfileButton.css"

const defaultProfilePicture = "https://www.anitawatkins.com/wp-content/uploads/2016/02/Generic-Profile-1600x1600.png"

const GOOGLE_CLIENT_ID = "329655122590-a18c4j9pbbiu6thahct4a0dse0p457qd.apps.googleusercontent.com"; //OUR CLIENT, NOT WEBLAB'S

/**
 * Profile Button rendered in the home page
 * 
 * The following props are used:
 * @param {Function} handleLogin for Google Login
 * @param {Function} handleLogout for Google Logout
 * @param {String} userId (state) to track user using Google ID
 */

const ProfileButton = (props) => {
    const [user, setUser] = useState("")
    const [isLoggedIn, setStatus] = useState(false);
    useEffect(() => {
        get("/api/user", { googleid: props.userId }).then((user) => {
            if (user.length === 0) {
                setStatus(false)
            } else {
                setUser(user[0]);
                setStatus(true)
            }
        });
    }, [props.userId]);
    

    return (
        <div>
            <div className="googleLoginButton">
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                {props.userId ? (<button
                    onClick={() => {
                        googleLogout();
                        props.handleLogout();
                    }}
                    className="googleLogoutButton"
                >
                    Logout
                </button>) : (
                    <GoogleLogin
                        text="signin"
                        onSuccess={props.handleLogin}
                        onError={(err)=>console.log(err)}
                        className="googleLoginButton"
                        theme={"outline"}
                        shape={"pill"}
                        ux_mode={"popup"}
                        auto_select={false}
                        useOneTap={false}
                        context={"signin"}
                    />
                )}
            </GoogleOAuthProvider>
            </div>
            <button className="profileImgButton">
                <Link to={`/profile/${props.userId}`}>
                    {isLoggedIn ? (<img
                        src={user.picture}
                        alt="Profile" 
                        className="profileImg"
                    />
                    )   :   (<img
                        src={defaultProfilePicture}
                        alt="Profile" 
                        className="profileImg"
                    />
                    )}
                </Link>
            </button>
        </div>
    )
}

export default ProfileButton;