import React,{useState, useEffect, useMemo} from 'react'
import Card from './Card'
import Modal from './Modal'

let indexes = 1;

function Game({options, socket, userList, setScreen}) {
    const [game, setGame] = useState([]);
    const [flippedCount, setFlippedCount] = useState(0);
    const [flippedIndexes, setFlippedIndexes] = useState([]);
    const [modals, setModals] = useState({nextPlayer: false, match: false, gameOver: false})
    const [showModal, setShowModal] = useState(false);


    const user = useMemo(() => {
        const turnArr = userList.filter(e => e.turn === true);
        if(turnArr.length > 0){
            return turnArr[0]
        }
    },[userList]);

    const newGame = () => {
        setScreen('signIn');
        socket.emit('startNewGame');
    };

    useEffect(() => {
        socket.emit('newGame', options);
        socket.on('newGame', (shuffledGame) => {
            setGame(shuffledGame)
        });
        setShowModal(true);
        setModals({nextPlayer: true, match: false, gameOver: false})
    }, []);

    const checkIfThereIsAWinner = () => {
        let points = [];
        for( let i = 0; i < userList.length; i++){
            points.push(userList[i].points)
        }
        const totalPoints = points.reduce((a, b) => a + b, 0);
        return totalPoints === options;
    };

    const checkIfTheresAMatch = () => {
        return game[flippedIndexes[0]].pictureId === game[flippedIndexes[1]].pictureId;
    };

    const getNextPlayer = () => {
        let indexOfUser = indexes++;
        if(indexOfUser >= userList.length - 1){
            indexes = 0
        }
        socket.emit('nextPlayer', indexOfUser);
    };


    useEffect(() => {
        if(flippedCount === 2 && userList.length > 1){
            if(checkIfThereIsAWinner()){
                setModals({nextPlayer: false, match: false, gameOver: true})
            } else if (checkIfTheresAMatch()){
                setModals({nextPlayer: false, match: true, gameOver: false})
            } else {
                getNextPlayer();
                setModals({nextPlayer: true, match: false, gameOver: false})
            }
            setShowModal(true)
        }

    },[flippedCount]);



    if (flippedIndexes.length === 2) {
        const match = game[flippedIndexes[0]].pictureId === game[flippedIndexes[1]].pictureId;

        if (match) {
            const newGame = [...game];
            newGame[flippedIndexes[0]].flipped = true;
            newGame[flippedIndexes[1]].flipped = true;
            newGame[flippedIndexes[0]].user = user;
            newGame[flippedIndexes[1]].user = user;
            setGame(newGame);
            const newIndexes = [...flippedIndexes];
            newIndexes.push(false);
            setFlippedIndexes(newIndexes);
        } else {
            const newIndexes = [...flippedIndexes];
            newIndexes.push(true);
            setFlippedIndexes(newIndexes)
        }
    }

    useEffect(() => {
        let users = [];
        for(let i = 0; i < game.length; i++){
            if(game[i].user?.name){
                users.push(game[i].user.name)
            }
        }
        const pointsArr = users.reduce(function (acc, curr) {
            if (typeof acc[curr] == 'undefined') {
                acc[curr] = 1;
            } else {
                acc[curr] += 1
            }
            return acc;
        }, {});

        socket.emit('addPoints', pointsArr);

    },[game]);

    if (game.length === 0) return <div>loading...</div>;
    else {
        return (
            <div>
                {userList.length > 1 &&
                    <div className="usersWrapper">
                        {userList.map(user => {
                            return (
                                <div
                                    className={user.turn ? 'userTurn user' : 'user'}
                                    style={{borderLeft: `10px solid ${user.color}`}}
                                >
                                    {user.name}: {user.points}
                                </div>
                            )
                        })}
                    </div>
                }
                <div id="cards">
                    {game.map((card, index) => (
                        <div className="card" key={index}>
                            <Card
                                id={index}
                                picture={card.picture}
                                user={card.user}
                                game={game}
                                flippedCount={flippedCount}
                                setFlippedCount={setFlippedCount}
                                flippedIndexes={flippedIndexes}
                                setFlippedIndexes={setFlippedIndexes}
                                socket={socket}
                            />
                        </div>
                    ))}
                </div>
                {showModal &&
                <Modal user={user} closeModal={() => setShowModal(false)} modals={modals} newGame={newGame}/>
                    }
            </div>
        )
}
}

export default Game;
