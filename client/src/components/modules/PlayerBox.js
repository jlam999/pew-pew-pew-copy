import React from "react";
import "./PlayerBox.css";
const consts = require("../../../const.json");

const PlayerBox = (props) => {
  // drawPlayer(props);
  return (
    <section>
      {props.player === undefined ? (
        <div className="emptyContainer">
          {/* <canvas id={"emptySlot"+props.playerNum} width={50} height={50} className="playerAvatar"/> */}
          <div className="emptySlot">Empty Slot</div>
        </div>
      ) : (
        <div className="playerContainer">
          <canvas id={props.player.googleid} width={50} height={50} className="playerAvatar" />
          <div className="playerName">{props.player.name}</div>
        </div>
      )}
    </section>
  );
};

export const drawPlayer = (player, playerNum) => {
  if (player !== null) {
    const canvas = document.getElementById(player.googleid);
    if (!canvas) return;

    canvas.width = 50;
    canvas.height = 50;

    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(25, 25, 16, 0, 2 * Math.PI, true);
    ctx.fillStyle = consts.rawPlayerColors[playerNum];
    ctx.fill();
    ctx.closePath();
  }
  //     } else {
  //         const canvas=document.getElementById("emptySlot" + playerNum)
  //         if (!canvas) return;

  //         canvas.width = 50;
  //         canvas.height = 50;

  //         const ctx = canvas.getContext("2d");

  //         ctx.setLineDash([5, 5]);
  // ctx.beginPath();
  // ctx.arc(100, 60, 50, 0, Math.PI * 2);
  // ctx.closePath();
  // ctx.stroke();
  //     }
};

export default PlayerBox;
