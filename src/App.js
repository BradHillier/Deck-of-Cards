import { useState, useEffect } from 'react';
import { Card3D } from './components/card/Card';

import kingDiamond from './assets/imgs/king_of_diamonds.svg';

import aceClub from './assets/imgs/clubs/A_of_clubs.svg';
import twoClub from './assets/imgs/clubs/2_of_clubs.svg';
import threeClub from './assets/imgs/clubs/3_of_clubs.svg';
import fourClub from './assets/imgs/clubs/4_of_clubs.svg';
import fiveClub from './assets/imgs/clubs/5_of_clubs.svg';
import sixClub from './assets/imgs/clubs/6_of_clubs.svg';
import sevenClub from './assets/imgs/clubs/7_of_clubs.svg';
import eightClub from './assets/imgs/clubs/8_of_clubs.svg';

import nineClub from './assets/imgs/clubs/9_of_clubs.svg';
import tenClub from './assets/imgs/clubs/10_of_clubs.svg';
import jackClub from './assets/imgs/clubs/jack_of_clubs.svg';
import queenClub from './assets/imgs/clubs/queen_of_clubs.svg';
import kingClub from './assets/imgs/clubs/king_of_clubs.svg';

import aceHeart from './assets/imgs/hearts/A_of_hearts.svg';
import twoHeart from './assets/imgs/hearts/2_of_hearts.svg';
import threeHeart from './assets/imgs/hearts/3_of_hearts.svg';
import fourHeart from './assets/imgs/hearts/4_of_hearts.svg';
import fiveHeart from './assets/imgs/hearts/5_of_hearts.svg';
import sixHeart from './assets/imgs/hearts/6_of_hearts.svg';
import sevenHeart from './assets/imgs/hearts/7_of_hearts.svg';
import eightHeart from './assets/imgs/hearts/8_of_hearts.svg';
import nineHeart from './assets/imgs/hearts/9_of_hearts.svg';
import tenHeart from './assets/imgs/hearts/10_of_hearts.svg';
import jackHeart from './assets/imgs/hearts/jack_of_hearts.svg';
import queenHeart from './assets/imgs/hearts/queen_of_hearts.svg';
import kingHeart from './assets/imgs/hearts/king_of_hearts.svg';

import backImage from './assets/card-back.png';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'


import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//const IMGs = [kingHeart, aceClub, kingClub, kingDiamond, twoClub, threeClub, fourClub, fiveClub, sixClub, sevenClub, eightClub, nineClub, tenClub, jackClub, queenClub, aceHeart, twoHeart]
const IMGs = [aceClub, kingClub, kingDiamond, twoClub, threeClub, fourClub, fiveClub, sixClub, sevenClub, eightClub, nineClub, tenClub, jackClub, queenClub, kingClub, aceHeart, kingHeart, kingDiamond, twoHeart, threeHeart, fourHeart, fiveHeart, sixHeart, sevenHeart, eightHeart, nineHeart, tenHeart, jackHeart, queenHeart, kingHeart]

function App() {

    const [state, setState] = useState(() => {
        let count = -1
        return IMGs.map(image => {
            count++
            return {
                id: count,
                image: image,
                position: {
                    x: window.innerWidth / 2,
                    y: 100,
                    z: count
                },
                isFaceUp: false,
                touchDistFromCenter: {
                    x: 0,
                    y: 0
                },
                transition: 'none',
                animationdelay: '1s'
            }

        })
    })


    const moveCardToPointer = (event, id) => {
        setState(state.map(card => {
            if (id === card.id) {
                return {
                    ...card, position:
                    {
                        x: event.clientX - card.touchDistFromCenter.x,
                        y: event.clientY - card.touchDistFromCenter.y,
                        z: IMGs.length
                    },
                    transition: 'none'
                }
            } else {
                return card
            }
        }))
    }

    const rotateCard = (event, id) => {
        setState(state.map(card => {
            return id === card.id ? { ...card, isFaceUp: !card.isFaceUp } : card
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
                    x: window.innerWidth / 2 - card.position.z / 2,
                    y: window.innerHeight / 2 - card.position.z / 2,
                    z: card.position.z
                },
                transition:  `0.6s ease-in-out`,
                animationdelay: `${(Math.pow((card.position.z + 1), 1/8) - 1)}s`,
                isFaceUp: true
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
