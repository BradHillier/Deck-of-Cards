import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight, faHand, faShuffle } from '@fortawesome/free-solid-svg-icons'

import './App.css';
import { Card3D } from './components/card/Card';
import { getAllSVGs } from './components/card/cardSVG';
import backImage from './assets/card-back.png';

const IMGs = getAllSVGs();



const x_start = window.innerWidth / 2 - 40.5;
const y_start = window.innerHeight / 2 - 69.5;

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
                    isShuffling: false,
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
            inDeck: Array(count + 1).fill().map((el, idx) => idx),
            isShuffling: false
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
                state.inDeck = state.inDeck.filter(num => num !== id);
            }
            moveCardToPointer(event, id);
        }
    }

    const pointerLeaveHandler = (event, id) => {
        //    if (event.pointerType === "mouse") {
        //        if (state.deck[id].isSelected) {
        //            moveCardToPointer(event, id);
        //        }
        //    } else {
        //        deselectCard(event, id);
        //    }
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
            inDeck: [...state.deck].sort((a,b) => a.position.z - b.position.z).map(card => card.id),
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
                    animationdelay: `${(Math.pow(card.id + 2, 1/8) - 1)}s`,
                    isFaceUp: false,
                    isInDeck: true
                }
            })
        })
    }

    const drawCards = (num) => {
        // Bug related to cards in deck and card.position.z not being synced
        // the position in deck should be equivalent to the cards z-index
        let ids = state.inDeck.splice(-num);
        if (ids.length) {
            setState({
                ...state,
                cardsInPlay: state.cardsInPlay + ids.length,
                deck: state.deck.map(card => {
                    if (ids.includes(card.id)) {
                        const i = ids.indexOf(card.id);
                        return {
                            ...card,
                            position: {
                                x: x_start - (num / 2 * 81) + (i) * 81 + (15 * i), // card width padding
                                y: y_start + 200,
                                z: card.position.z
                            },
                            animationdelay: `0.${num - i + 1}s`,
                            transition:  `0.6s ease-in-out`
                        };
                    }
                    return card;
                })
            });
        }
    }

    const shuffle = () => {
        setState({
            ...state,
            isShuffling: true,
            deck: state.deck.map(card => {
                // animate cards in groups of four to inmitate a person shuffling 
                const side = (Math.floor(card.position.z / 4)) % 2 === 0;
                const delay = side ? card.id : 51 - card.id
                return {
                    ...card,
                    animate: true,
                    animationdelay: `${card.id / 300}s`,
                }
            })
        })
    }

    useEffect(() => {
        const handleAnimationEnd = () => {
            setState({
                ...state,
                isShuffling: false,
                deck: state.deck.map(card => {
                    return {
                        ...card,
                        animate: false
                    }
                })
            })
        }
        const cardContainer = document.getElementById(`card-51`).parentNode.parentNode.parentNode;
        if (cardContainer && state.isShuffling) {
            cardContainer.addEventListener('animationend', handleAnimationEnd, {once: true});
            // clean 
            return () => {
                cardContainer.removeEventListener('animationend', handleAnimationEnd);
            }
        }
    }, [state.isShuffling]);


    useEffect(startAnimation, []);


    /**
     * If a card is selected, move it the the cursor
     *
     * This avoids a card not following the cursor if the cursor
     * moves too quickly
     *
     * This has no dependencies and will fire when any change to the DOM occurs
     */
    useEffect(() => {
        const handleMouseMove = (event) => {
            const selectedCard = state.deck.find(card => card.isSelected);
            if (selectedCard) {
                moveCardToPointer(event, selectedCard.id);
            }
        }

        const  handleTouch = (event) => {
            if (event.touches.length > 1) {
                // If there are multiple touches (pinch), prevent default behavior
                event.preventDefault();
            }
        }

        window.addEventListener("mousemove", handleMouseMove);

        //NOTE: passive: false is not reccomended as it may cause poor performance 
        //      when scrolling
        // Prevent the user from pinch zoom on desktop
        window.addEventListener("wheel", (event) => event.preventDefault(), {passive:false});
        // Prevent the user from pinch zoom on mobile and tablets
        window.addEventListener("touchstart", (event) => handleTouch(event), {passive:false});

        return () => {
            // Remove event handler from window to avoid memory leak
            window.removeEventListener("mousemove", handleMouseMove);
        };
    });

    return (
        <div className="App"> 

            <div className="container">
            {
                state.deck.map(card => {
                    return (
                        <Card3D key={card.id} 
                            id={ card.id}
                            top={state.deck[card.id].position.y}
                            left={state.deck[card.id].position.x}
                            zIndex={state.deck[card.id].position.z}
                            animate={state.deck[card.id].animate}
                            isFaceUp={state.deck[card.id].isFaceUp}
                            transition={state.deck[card.id].transition}
                            animationdelay={state.deck[card.id].animationdelay}
                            shuffling={state.isShuffling}
                        >
                            <img src={card.image} alt={'card front'}style={{height: '100%', width: '100%'}}
                id={`card-${card.id}`}
                                onPointerMove={event => pointerMoveHandler(event, card.id)}
                                onPointerUp={event => pointerUpHandler(event, card.id)}
                                onPointerDown={event => pointerDownHandler(event, card.id)} 
                            />
                            <img src={backImage} alt={'card back'} style={{height: '100%', width: '100%'}}
                                onPointerMove={event => pointerMoveHandler(event, card.id)}
                                onPointerUp={event => pointerUpHandler(event, card.id)}
                                onPointerDown={event => pointerDownHandler(event, card.id)} 
                            />
                        </Card3D>
                    )
                })
            }
            </div>
            <div id="top-bar">
                <button onClick={returnCardsToDeck}>
                    <FontAwesomeIcon icon={faArrowRotateRight} />
                    <span>Reset</span>
                </button>

                <button id="drawbtn" onClick={event => drawCards(5)}>
                    <FontAwesomeIcon icon={faHand} />
                    <span>Draw</span>
                </button>

                <button id="shuffle-btn" onClick={event => shuffle()}>
                    <FontAwesomeIcon icon={faShuffle} />
                    <span>Shuffle</span>
                </button>
            </div>
        </div>
    );
}

export default App;
