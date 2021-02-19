import React,{useState, useEffect} from 'react'
import { useSpring, animated as a } from 'react-spring'


function Card({id, picture, game, user, flippedCount, setFlippedCount, flippedIndexes, setFlippedIndexes, socket}) {
    const [flipped, setFlippedCard] = useState(false);
    const {transform, opacity} = useSpring({
        opacity: flipped ? 1 : 0,
        transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
        config: {mass: 5, tension: 500, friction: 80},
    });

    useEffect(() => {
        if (flippedIndexes[2] === true && flippedIndexes.indexOf(id) > -1) {
            setTimeout(() => {
                setFlippedCard(state => !state);
                setFlippedCount(flippedCount + 1);
                setFlippedIndexes([])
            }, 3000)
        } else if (flippedIndexes[2] === false && id === 0) {
            setTimeout(() => {
                setFlippedCount(flippedCount + 1);
                setFlippedIndexes([])
            }, 3000)
        }
    }, [flippedIndexes]);



    useEffect(() => {

        socket.on('cardFlipped', (data) => {
            if(data.id === id){
                if (!game[id].flipped && flippedCount % 3 === 0) {
                    setFlippedCard(!flipped);
                    setFlippedCount(flippedCount + 1);
                    const newIndexes = [...data.flippedIndexes];
                    newIndexes.push(id);
                    setFlippedIndexes(newIndexes)
                } else if (
                    flippedCount % 3 === 1 &&
                    !game[id].flipped &&
                    flippedIndexes.indexOf(id) < 0
                ) {
                    setFlippedCard(state => !state);
                    setFlippedCount(flippedCount + 1);
                    const newIndexes = [...data.flippedIndexes];
                    newIndexes.push(id);
                    setFlippedIndexes(newIndexes)
                }
            }

        })

    }, []);

    const onCardClick = () => {
        socket.emit('cardFlipped', {id, flippedIndexes});
    };


    return (
        <div onClick={onCardClick}>
            <a.div
                className="c back"
                style={{
                    opacity: opacity.interpolate(o => 1 - o),
                    transform,
                }}
            />
            <a.div
                className="c front"
                style={{
                    opacity,
                    transform: transform.interpolate(t => `${t} rotateX(180deg)`),
                    backgroundImage: `url(${picture})`,
                    boxShadow: `0px 1px 4px 5px ${user.color}`
                }}
            />
        </div>
    )
}

export default Card;
