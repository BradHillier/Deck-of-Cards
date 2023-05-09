import { Component, useState, useRef, useEffect, useContext, createContext, useLayoutEffect } from 'react';
import { Card, Card3D } from './components/card/Card';

import kingClub from './assets/imgs/king_of_clubs2.svg';
import aceClub from './assets/imgs/A_of_clubs.svg';
import { ReactComponent as AceClub } from './assets/imgs/A_of_clubs.svg';
import backImage from './assets/card-back.png';


import './App.css';



class Deck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            x: 0,
            y: 0,
            cards: []
        }
    }

    addCard(card) {
        this.state.cards.push(card)
    }

    draw(num_cards) {
        const drawn_cards = this.state.cards.slice(0, num_cards)
        drawn_cards.forEach(card => {
            card.setState({ inDeck: false })
        })
    }
}


function App() {

    //    let count = 0
    //   
    //    const deck = new Deck
    //
    //
    //    let l = [1, 1, 1, 1, 1]
    //    l.forEach(() => {
    //        count++
    //        const card = <Card suit="hearts" rank="nine" key={count} pos={count} deck_pos={DeckPos}/>
    //        deck.addCard(card)
    //    })



    const card_height = 243
    const window_padding = 20


    const [state, setState] = useState(
        [
            {
                id: 0,
                image: kingClub,
                position: {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                },
                isFaceUp: true,
                touchDistFromCenter: {
                    x: 0,
                    y: 0
                }
            },
            {
                id: 1,
                image: aceClub,
                position: {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                },
                isFaceUp: true,
                touchDistFromCenter: {
                    x: 0,
                    y: 0
                }
            }
        ]
    )

    const mouse = (event, id) => {
        setState(state.map(card => {
            return id === card.id ? { ...card, position: { x: event.clientX - card.touchDistFromCenter.x,  y: event.clientY - card.touchDistFromCenter.y } } : card

        }))
    }

    const up = (event, id) => {
        setState(state.map(card => {
            return id === card.id ? {...card, isFaceUp: !card.isFaceUp} : card
        }))
    }

    const getDistance = (event, id) => {
        setState(state.map(card => {
            return id === card.id ? { ...card, touchDistFromCenter: { x: event.clientX - card.position.x,  y: event.clientY - card.position.y} } : card
        }))
    }


    return (
        <div className="App">

            <div className="container">
                {
                    state.map(card => {
                        return (
                        <Card3D key={card.id}top={state[card.id].position.y} left={state[card.id].position.x} isFaceUp={state[card.id].isFaceUp}>
                            <img src={card.image} style={{ height: "100%" }} 
                                onPointerEnter={event => getDistance(event, card.id)}
                                onPointerMove={event =>mouse(event, card.id)} 
                                onMouseUp={event => up(event, card.id)} />
                            <img src={backImage} style={{ height: "100%" }} 
                                onPointerEnter={event => getDistance(event, card.id)}
                                onPointerMove={event => mouse(event, card.id)} 
                                onMouseUp={event => up(event, card.id)} />
                        </Card3D>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default App;
