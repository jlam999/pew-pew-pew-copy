import { Redirect, Link, useNavigate } from "@reach/router"
import React, {useState, useEffect} from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities.js";
import { handleKeyDown, handleKeyUp, handleClick } from "../../input.js";
import PlayerBox, {drawPlayer} from "../modules/PlayerBox.js"

import "./Lobby.css"

const Lobby = (props) => {
    const navigate = useNavigate()
    const [playerList, setPlayerList] = useState([]);
    const [ready, setReady] = useState(false);

    const getPlayers = () => {
        get("/api/gameState").then((gameState) => {
            const promiseArray = []
            for (let playerId of Object.keys(gameState.players)) {
                let user = get("/api/user", {googleid: playerId})
                promiseArray.push(user)
            }
            Promise.all(promiseArray).then((array) => {
                const secondPromiseArray = [];
                for (let i = 0; i < 4; i++) {
                    if (i < array.length) {
                        secondPromiseArray.push(<PlayerBox player={array[i]} playerNum={i}/>);
                        drawPlayer(array[i], i);
                        if (array.length >= 2) {
                            setReady(true);
                        } else {
                            setReady(false);
                        }
                    } else {
                        secondPromiseArray.push(<PlayerBox playerNum={i}/>);
                    }
                }
                Promise.all(secondPromiseArray).then((array) => {
                    setPlayerList(array);
                })
            })
        })
    }

    useEffect(() => {
        getPlayers();
        socket.on("add user", () => {
            getPlayers();
        })
        socket.on("disconnect", () => {
            getPlayers();
        })
    }, [playerList])

    useEffect(() => {
        socket.on("start game", () =>{
            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);
            window.addEventListener("click", handleClick);
            navigate("/game");
        })
    }, [])

    const attemptGameStart = () => {
        get("/api/gameState").then((gameState)=> {
            if (gameState.isActive) {
                alert("Game in Session; Cannot Join.");
            } else if (Object.keys(gameState.players).length < 2) {
                alert("Not enough players!")
            } else {
                post("/api/startGame", {});
            }
        })
    }

    // const players = playerList.map((playerName) => (
    //     <PlayerBox name={playerName}/>
    // ))

    return (
        <>
            <h1 className="Lobby-title">Game Lobby</h1>
            <h2 className="Lobby-code">Code: ABCXYZ</h2> {/*TO BE REPLACED WITH ROOM CODES*/}
            {playerList}
            {(!ready) ? (
                <div className="Lobby-waitButton">
                    <p className="Lobby-waitText">Waiting...</p>
                </div>
            )   :   (
                <button className="Lobby-startButton" onClick={attemptGameStart}>
                    Start Game
                </button>
            )}
            
        </>
    )
}

export default Lobby;