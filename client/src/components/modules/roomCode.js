import React, { useState } from "react";

import "./roomCode.css"

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
        <div className="roomCodeContainer"> 
            <input 
                type="text"
                placeholder={props.defaultText}
                value={roomCode}
                onChange={handleChange}
                minLength = "6"
                maxLength = "6"
                className="roomCodeInput"
            />
        </div>
    )
}

const ReadCode = () => {
    const attemptCode = (value) => {
        //Try to query a room or something
    }
    <NewCodeInput defaultText="Enter Code" onSubmit={attemptCode}/>
}

export {NewCodeInput, ReadCode};