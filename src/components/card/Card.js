import styled, { keyframes } from 'styled-components'
import { useState, useLayoutEffect } from 'react'

import cardBack from '../../assets/card-back.png'
import { getFrontSVG } from './cardSVG'


export function Card(idx, rank, suit, deckPos) {

    const [isFaceUp, flipCard] = useState(false)
    const [inDeck, deckToggle] = useState(true)
    const [card_class, setCardClass] = useState('card')
    const [container_class, setContainerClass] = useState('card')
    const [pos, setPosition] = useState({ x: deckPos.x, y: deckPos.y })
    const svg = getFrontSVG(rank, suit)

    useLayoutEffect(
        () => {
            if (card_class.includes("rotated")) {
                setCardClass("card reverse")
                setContainerClass("card-container to-top")
            } else {
                setCardClass("card rotated")
                setContainerClass("card-container to-bottom")
            }
        },
        [isFaceUp]
    )

    useLayoutEffect(
        () => {
            if (inDeck) {
                setPosition({ x: deckPos.x, y: deckPos.y })
            } else {
                setPosition({
                    x: `${window.innerWidth / 6 * idx}px`,
                    y: `${window.innerHeight / 2}px`
                })
            }
        },
        [inDeck]
    )

    function clickHandler(event) {
        if (event.detail === 1) {
            flipCard(!isFaceUp)
        } else if (event.detail === 2) {
            deckToggle(!inDeck)
        }
    }

    return (
        <>
            <div class={container_class} style={{ top: pos.y, left: pos.x }}>
                <div class={card_class} onClick={clickHandler}>
                    <div class="card-content card-front">
                        <img src={svg} class="card"></img>
                    </div>
                    <div class="card-content card-back">
                        <img src={cardBack} class="card"></img>
                    </div>
                </div>
            </div>
        </>
    );

}

const rotateAnimation = keyframes `
    0% {
        transform: rotate3d(0, 1, 0, 0deg) scale(1);
    }
    50% {
        transform: rotate3d(0, 1, 0, 90deg) scale(1.3);
    }
    100% {
        transform: rotate3d(0, 1, 0, 180deg) scale(1);
    }
`

const rotateBackAnimation = keyframes`
  0% {
    transform: rotate3d(0, 1, 0, 180deg) scale(1);
  }
  50% {
    transform: rotate3d(0, 1, 0, 90deg) scale(1.3);
  }
  100% {
    transform: rotate3d(0, 1, 0, 0deg) scale(1);
  }
`;

const CardContainer = styled.div.attrs(props => ({
    style: {
        top: props.top,
        left: props.left 
    },
}))`
        width: 116px;
        height: 166px;
        transform: translate(-50%, -50%);
        perspective: 1200px;
        margin: 5px;
        position: absolute;
    `

    const CardBody = styled.div`
    top: 0px;
    background: white;
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    cursor: pointer;
    margin: 0 auto;
    transition: all 0.6s ease-in-out;
    animation: ${props => props.rotated ? rotateAnimation : rotateBackAnimation} 0.6s ease-in-out forwards;
    transform-style: preserve-3d;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
  `;

const CardContent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    backface-visibility: hidden;
    `

const Front = styled(CardContent).attrs(props => ({
    style: {
        'zIndex': props.rotated
    }
}))`
        tranform-style: preserve-3d;
    `

const Back = styled(CardContent).attrs(props => ({
    style: {
        'zIndex': !props.rotated
    }
}))`
        transform: rotateY(180deg);
        tranform-style: preserve-3d;
    `


export const Card3D = ({
    children,
    id: id,
    top: top,
    left: left,
    isFaceUp: isFaceUp
}) => {

    const [frontContent, backContent] = children;
    return (
        <CardContainer top={top} left={left}>
            <CardBody rotated={isFaceUp}> 
                <Front rotated={isFaceUp}>
                    {frontContent}
                </Front>
                <Back rotated={isFaceUp}>
                    {backContent}
                </Back>
            </CardBody>
        </CardContainer>
    );
}
