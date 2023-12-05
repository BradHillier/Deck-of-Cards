import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'

import './App.css';
import { Card3D } from './components/card/Card';
import { getAllSVGs } from './components/card/cardSVG';
import backImage from './assets/card-back.png';

const IMGs = getAllSVGs();



const x_start = window.innerWidth / 2;
const y_start = window.innerHeight / 2;


function App() {

    const [state, setState] = useState(() => {
        let count = -1
        return { 
            cardsInPlay: 0,
            deck: IMGs.map(image => {
                count++
                return {
                    id: count,
                    isSelected: false,
                    isDrag: false,
                    image: image,
                    position: {
                        x: x_start,
                        y: y_start - 200,
                        z: count
                    },
                    touchDistFromCenter: {
                        x: 0,
                        y: 0
                    },
                    transition: 'none',
                    animationdelay: '1s',
                    animate: false
                }
            }),
            count: count,
        }
    })

    const pointerDownHandler = (event, id) => {
        selectCard(event, id);
    }

    const pointerUpHandler = (event, id) => {
            if (state.deck[id].isDrag) {
                deselectCard(event, id);
            } else {
                // This also deselects the card
                rotateCard(event, id);
            }
    }

    const pointerMoveHandler = (event, id) => {
        if (state.deck[id].isSelected) {
            if (state.deck[id].isInDeck) {
                state.cardsInPlay++;
            }
            moveCardToPointer(event, id);
        }
    }

    const pointerLeaveHandler = (event, id) => {
        if (event.pointerType === "mouse") {
            deselectCard(event, id);
        }
    }

    const selectCard = (event, id) => {
        let zIndex = state.deck[id].position.z;
        setState({...state,
            deck: state.deck.map(card => {
                if (id === card.id) {
                    return {
                        ...card,
                        isSelected: true,
                        touchDistFromCenter: {
                            x: event.clientX - card.position.x,
                            y: event.clientY - card.position.y
                        },
                        position: {
                            ...card.position,
                            z: IMGs.length - 1,
                        }
                    }
                }
                return {
                    ...card, position: {
                        ...card.position,
                        z: card.position.z > zIndex ? (card.position.z - 1) : card.position.z
                    }
                }
            })
        })
    }

    const deselectCard = (event, id) => {
        setState({...state,
            deck: state.deck.map(card => {
                if (id === card.id) {
                    return {
                        ...card,
                        isSelected: false,
                        isDrag: false
                    }
                }
                return card
            })
        })
    }

    const moveCardToPointer = (event, id) => {
        setState({ ...state,
            deck: state.deck.map(card => {
                if (id === card.id) {
                    return {
                        ...card, position: {
                            x: event.clientX - card.touchDistFromCenter.x,
                            y: event.clientY - card.touchDistFromCenter.y,
                            z: IMGs.length - 1,
                        },
                        transition: 'none',
                        isInDeck: false,
                        isDrag: true
                    }
                } else {
                    return card
                }
            })
        })
    }

    const rotateCard = (event, id) => {
        setState({ ...state,
            deck: state.deck.map(card => {
                if (card.id === id && !card.isDrag) {
                    return {
                        ...card, 
                        isFaceUp: !card.isFaceUp, 
                        animate: true,
                        animationdelay: `0s`,
                        isSelected: false
                    }
                } 
                return card
            })
        })
    }

    const returnCardsToDeck = () => {
        setState({ ...state,
            cardsInPlay: 0,
            deck: state.deck.map(card => {
                return {
                    ...card, 
                    position: {
                        x: x_start - card.position.z / 4,
                        y: y_start - card.position.z / 4,
                        z: card.position.z
                    },
                    transition:  `0.6s ease-in-out`,
                    animationdelay: `${(Math.pow((card.position.z - 51 + state.cardsInPlay), 1/5) - 1)}s`,
                    isFaceUp: false,
                    isInDeck: true
                }
            })
        })
    }

    const startAnimation = () => {
        setState({ ...state,
            cardsInPlay: 0,
            deck: state.deck.map(card => {
                return {
                    ...card, 
                    position: {
                        x: x_start - card.id / 4,
                        y: y_start - card.id / 4,
                        z: card.id
                    },
                    transition:  `0.6s ease-in-out`,
                    animationdelay: `${(Math.pow(card.id + 1, 1/8) - 1)}s`,
                    isFaceUp: false,
                    isInDeck: true
                }
            })
        })
    }

    useEffect(startAnimation, [])

    return (
        <div className="App">

            <div className="container">
                {
                    state.deck.map(card => {
                        return (
                            <Card3D key={card.id}
                                top={state.deck[card.id].position.y}
                                left={state.deck[card.id].position.x}
                                zIndex={state.deck[card.id].position.z}
                                animate={state.deck[card.id].animate}
                                isFaceUp={state.deck[card.id].isFaceUp}
                                transition={state.deck[card.id].transition}
                                animationdelay={state.deck[card.id].animationdelay}>
                                <img src={card.image} alt={'card front'}style={{height: '100%', width: '100%'}}
                                    onPointerLeave={event => pointerLeaveHandler(event, card.id, card.position.z)}
                                    onPointerMove={event => pointerMoveHandler(event, card.id)}
                                    onPointerUp={event => pointerUpHandler(event, card.id)}
                                    onPointerDown={event => pointerDownHandler(event, card.id)} />
                                <img src={backImage} alt={'card back'} style={{height: '100%', width: '100%'}}
                                    onPointerLeave={event => pointerLeaveHandler(event, card.id, card.position.z)}
                                    onPointerMove={event => pointerMoveHandler(event, card.id)}
                                    onPointerUp={event => pointerUpHandler(event, card.id)}
                                    onPointerDown={event => pointerDownHandler(event, card.id)} />
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
