import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import {NewCodeInput, ReadCode} from "../modules/roomCode"

import "../../utilities.css";
import "./Home.css";
import ProfileImg from "../../public/profile.jpg"

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
            <button className="Home-profileButton">
                <img src={ProfileImg} alt="Profile" className="Home-profileImg"/>
            </button>
        </div>
    )
}

export default Home;