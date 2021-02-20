import React, {useState, useEffect, useRef} from 'react'
import './App.css';
import SignIn from "./components/SignIn";
import Game from './components/Game';
import io from "socket.io-client/build/index";
import Lobby from "./components/Lobby";

const screenStrings = {
    lobby: 'lobby',
    signIn: 'signIn',
    game: 'game'
};


// const socket = io.connect(`http://localhost:${PORT}` , {
//     withCredentials: true,
//     extraHeaders: {
//         "my-custom-header": "abcd"
//     }
// });

const socket = io.connect();


function App() {
    const [userList, setUserList] = useState([]);
    const [screen, setScreen] = useState(screenStrings.signIn);
    const [userName, setUserName] = useState('')

    const options = 24;

    useEffect(() => {
        socket.on('users', (connectedUsers) => {
            setUserList(connectedUsers)
        });
    },[]);


    const join = (name) => {
        setScreen(screenStrings.lobby);
        setUserName(name);
        socket.emit('join', name)
    };

    const playerIsReady = () => {
        socket.emit('ready', userName)
    };

    const goToGame = () => {
        setScreen(screenStrings.game)
    };


    return (
        <div className="App">
            <div className="title">Memory Game {userName}</div>
            {screen === screenStrings.signIn &&
            <SignIn join={join} />
            }
            {screen === screenStrings.lobby &&
            <Lobby
                userList={userList}
                playerIsReady={playerIsReady}
                goToGame={goToGame}
                userName={userName}
            />
            }
            {screen === screenStrings.game &&
            <Game
                options={options}
                socket={socket}
                userList={userList}
                setScreen={setScreen}
            />
            }
        </div>
    );
}

export default App;
