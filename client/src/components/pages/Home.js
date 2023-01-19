import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import {NewCodeInput, ReadCode} from "../modules/roomCode"

import "../../utilities.css";
import "./Home.css";

const Home = (props) => {
    return (
        <div className="u-textCenter">
            <div className="Home-title">
                <h1>Shoot Pew Pew</h1>
            </div>
            <section className="Home-buttons">
                <button className="Home-buttonContainer">
                    <h3 className="Home-buttonText">Create a Game</h3>
                </button>
                <button className="Home-buttonContainer">
                    <h3 className="Home-buttonText">Join a Game</h3>
                </button>
            </section>
            <NewCodeInput defaultText="Enter Code"/>
            {/*<div class="Home-codeContainer">
                <h4 class="Home-codeText">Enter Code</h4>
            </div>*/}
            <button className="Home-profileButton">
                <img src="profile.jpg" alt="Profile"/>
            </button>
        </div>
    )
}

export default Home;