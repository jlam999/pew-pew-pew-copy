import React, { useState } from "react";

import "./RoomCode.css";

/**
 * The box in the home page that allows you to input the room code
 *
 * The following props are used:
 * @param {Function} onSubmit //NOT PASSED IN YET, MUST BE RESOLVED
 */

const NewCodeInput = (props) => {
  const [roomCode, setRoomCode] = useState("");

  const handleChange = (event) => {
    setRoomCode(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(roomCode);
  };

  return (
    <div className="largeContainer">
      <div className="roomCodeContainer">
        <input
          type="text"
          value={roomCode}
          placeholder="Enter Code"
          onChange={handleChange}
          minLength="6"
          maxLength="6"
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
  );
};

const ReadCode = () => {
  const attemptCode = (value) => {
    //Try to query a room or something
  };
  <NewCodeInput defaultText="Enter Code" onSubmit={attemptCode} />;
};

export default NewCodeInput;
