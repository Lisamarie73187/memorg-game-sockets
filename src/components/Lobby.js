import React, {useEffect, useState} from 'react'
import checkMark from '../assets/checkmark.png'



function Lobby({userList, userName, playerIsReady, everyoneIsReady, goToGame}) {

    useEffect(() => {
        if(userList.length > 0){
            const everyoneIsReady = userList.every(e => {
                return e.ready
            });
            if(everyoneIsReady){
                goToGame()
            }
        }
    },[userList]);

    return (
        <>
            <div>
                {userList.map((e,i) => {
                    return (
                        <div className="playerNameWrapper">
                            <div className="playerName">
                                {console.log(e[userName])}
                                <div>{e.name}</div>
                                <div onClick={playerIsReady}>
                                    {!!e.ready ? <img src={checkMark} alt="checkmark" height={30} width={30}/>  : <div className="ready">ready?</div>}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
}

export default Lobby;
