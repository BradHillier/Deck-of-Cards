import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'

import './App.css';
import { Card3D } from './components/card/Card';
import { getAllSVGs } from './components/card/cardSVG';
import backImage from './assets/card-back.png';

const IMGs = getAllSVGs();

const x_start = window.innerWidth - 100;
const y_start = window.innerHeight - 100;

function App() {

    let cardsInPlay = 0;
    let count = -1

    const [state, setState] = useState(() => {
        return IMGs.map(image => {
            count++
            return {
                id: count,
                image: image,
                position: {
                    x: x_start + 200,
                    y: y_start - 200,
                    z: count
                },
                isFaceUp: false,
                isInDeck: true,
                touchDistFromCenter: {
                    x: 0,
                    y: 0
                },
                transition: 'none',
                animationdelay: '1s',
                animate: false
            }

        })
    })

    const moveCardToPointer = (event, id) => {
        setState(state.map(card => {
            if (id === card.id) {
                if (card.isInDeck) {
                    cardsInPlay++;
                }
                return {
                    ...card, position:
                    {
                        x: event.clientX - card.touchDistFromCenter.x,
                        y: event.clientY - card.touchDistFromCenter.y,
                        z: IMGs.length
                    },
                    transition: 'none',
                    isInDeck: false
                }
            } else {
                return card
            }
        }))
    }

    const rotateCard = (event, id) => {
        setState(state.map(card => {
            return id === card.id ? { 
                ...card, 
                isFaceUp: !card.isFaceUp, 
                animate: true,
                animationdelay: `0s`
            } : card
        }))
    }

    const getDistance = (event, id, zIndex) => {
        setState(state.map(card => {
            if (id === card.id) {
                return {
                    ...card, touchDistFromCenter:
                    {
                        x: event.clientX - card.position.x,
                        y: event.clientY - card.position.y
                    },
                    position:  {
                        x: card.position.x,
                        y: card.position.y,
                        z: IMGs.length
                    }
                }
            } else {
                return {
                    ...card, position:
                    {
                        x: card.position.x,
                        y: card.position.y,
                        z: zIndex < card.position.z ? (card.position.z - 1) : card.position.z
                    }
                }
            }
        }))
    }

    const returnCardsToDeck = () => {
        setState(state.map(card => {
            return {
                ...card, position: {
                    x: x_start + card.id / 4,
                    y: y_start - card.id / 4,
                    z: card.id
                },
                transition:  `0.6s ease-in-out`,
                animationdelay: `${(Math.pow((card.id - count + cardsInPlay), 1/8) - 1)}s`,
                isFaceUp: false
            }
        }))
    }

    useEffect(returnCardsToDeck, [])

    return (
        <div className="App">

            <div className="container">
                {
                    state.map(card => {
                        return (
                            <Card3D key={card.id}
                                top={state[card.id].position.y}
                                left={state[card.id].position.x}
                                zIndex={state[card.id].position.z}
                                animate={state[card.id].animate}
                                isFaceUp={state[card.id].isFaceUp}
                                transition={state[card.id].transition}
                                animationdelay={state[card.id].animationdelay}>
                                <img src={card.image} alt={'card front'}style={{height: '100%', width: '100%'}}
                                    onPointerEnter={event => getDistance(event, card.id, card.position.z)}
                                    onPointerMove={event => moveCardToPointer(event, card.id)}
                                    onMouseUp={event => rotateCard(event, card.id)} />
                                <img src={backImage} alt={'card back'} style={{height: '100%', width: '100%'}}
                                    onPointerEnter={event => getDistance(event, card.id, card.position.z)}
                                    onPointerMove={event => moveCardToPointer(event, card.id)}
                                    onMouseUp={event => rotateCard(event, card.id)} />
                            </Card3D>
                        )
                    })
                }
            </div>
            <button onClick={returnCardsToDeck}>
                <FontAwesomeIcon icon={faArrowRotateRight} />
                </button>
        </div>
    );
}

export default App;
