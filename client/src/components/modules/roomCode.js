import React, { useState } from "react";

import "./RoomCode.css"

/**
 * 
 * @param {funct} props 
 * @returns 
 */

const NewCodeInput = (props) => {
    const [roomCode,setRoomCode] = useState("");

    const handleChange = (event) => {
        setRoomCode(event.target.roomCode)
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        props.onSubmit && props.onSubmit(code);
        setValue("");
    };

    return (
        <div className="largeContainer">
        <div className="roomCodeContainer"> 
            <input 
                type="text"
                value={roomCode}
                placeholder={props.defaultText}
                onChange={handleChange}
                minLength = "6"
                maxLength = "6"
                className="roomCodeInput"
            />
            <button
                type="submit"
                value="Join" //TO BE CHANGED: VALUE THAT IS SUBMITTED UPON PRESS
                onClick={handleSubmit}
                className="joinButton"
            >
                Join
            </button>
        </div>
        </div>
    )
}

const ReadCode = () => {
    const attemptCode = (value) => {
        //Try to query a room or something
    }
    <NewCodeInput defaultText="Enter Code" onSubmit={attemptCode}/>
}

export default NewCodeInput;