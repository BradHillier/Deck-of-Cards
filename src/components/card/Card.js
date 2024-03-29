import styled, { keyframes } from 'styled-components'
import { useState, useEffect } from 'react';


// export function Card(idx, rank, suit, deckPos) {
// 
//     const [isFaceUp, flipCard] = useState(false)
//     const [inDeck, deckToggle] = useState(true)
//     const [card_class, setCardClass] = useState('card')
//     const [container_class, setContainerClass] = useState('card')
//     const [pos, setPosition] = useState({ x: deckPos.x, y: deckPos.y })
//     const svg = getFrontSVG(rank, suit)
// 
//     useLayoutEffect(
//         () => {
//             if (card_class.includes("rotated")) {
//                 setCardClass("card reverse")
//                 setContainerClass("card-container to-top")
//             } else {
//                 setCardClass("card rotated")
//                 setContainerClass("card-container to-bottom")
//             }
//         },
//         [isFaceUp]
//     )
// 
//     useLayoutEffect(
//         () => {
//             if (inDeck) {
//                 setPosition({ x: deckPos.x, y: deckPos.y })
//             } else {
//                 setPosition({
//                     x: `${window.innerWidth / 6 * idx}px`,
//                     y: `${window.innerHeight / 2}px`
//                 })
//             }
//         },
//         [inDeck]
//     )
// 
//     function clickHandler(event) {
//         if (event.detail === 1) {
//             flipCard(!isFaceUp)
//         } else if (event.detail === 2) {
//             deckToggle(!inDeck)
//         }
//     }
// 
//     return (
//         <>
//             <div class={container_class} style={{ top: pos.y, left: pos.x }}>
//                 <div class={card_class} onClick={clickHandler}>
//                     <div class="card-content card-front">
//                         <img src={svg} class="card"></img>
//                     </div>
//                     <div class="card-content card-back">
//                         <img src={cardBack} class="card"></img>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// 
// }
//
const rotateAnimation = keyframes `
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
`;


const rotateBackAnimation = keyframes `
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.3);
    }
    100% {
        transform: scale(1);
    }
`

const shuffleLeftAnimation = keyframes`
    0% {
        transform: translateX(0%);
    }
    50% {
        transform: translateX(-80%);
    }
    80%, 100% {
        transform: translateX(0%);
    }
`

const shuffleRightAnimation = keyframes`
    0% {
        transform: translateX(0%);
    }
    50% {
        transform: translateX(80%);
    }
    80%, 100% {
        transform: translateX(0%);
    }
`

const CardContainer = styled.div.attrs(props => ({
    style: {
        top: props.$top,
        left: props.$left,
        zIndex: props.$zIndex,
        transition: `${props.$transition} ${props.$animationdelay}`
    },
}))`
        width: 81px;
        height: 119px;
        perspective: 500px;
        margin: 5px;
        position: absolute;
        animation: ${props => props.$animation} 0.6s ${props => props.$animationRepeat} ease-in-out forwards;
        animation-delay: ${props => props.$animationdelay};
        animation-play-state: ${props => props.$animate ? "running" : "paused"};
    `

const CardBody = styled.div`
    top: 0px;
    background: white;
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    cursor: pointer;
    margin: 0 auto;
    transform: ${props => props.$faceUp ? 'rotate3d(0,1,0,180deg)' : 'rotate3d(0,1,0,0deg)'};
    transition: transform 0.6s ease-in-out;
    transition-delay: ${props => props.$animationdelay};
    transform-style: preserve-3d;

    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
  `;

const CardContent = styled.div`
    touch-action: none;
    background: white;
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    border-radius: 6px;
    overflow: hidden;
    top: 0;
    left: 0;
    backface-visibility: hidden;
    `

const Front = styled(CardContent).attrs(props => ({
    style: {
        zIndex: props.rotated,
    }
}))`
        height: 95%;
        top: 2.5%;
        tranform-style: preserve-3d;
        justify-content: center;
        transform: rotateY(180deg);
    `

// Somehow backface visibility is not getting set to none
// when I have gotten it to work, the animation flipping from front to 
// back doesn't work properly
const Back = styled(CardContent).attrs(props => ({
    style: {
        zIndex: !props.rotated,
    }
}))`
        tranform-style: preserve-3d;
    `


export const Card3D = ({
    children,
    id,
    top,
    left,
    zIndex,
    transition,
    animationdelay,
    isFaceUp,
    animate,
    shuffling
}) => {

    const [frontContent, backContent] = children;
    const [animationRepeat, setAnimationRepeat] = useState(0)

    const animation = () => {
        // This and the shuffle function in App ned to be synced some how
        if (shuffling) {
            setAnimationRepeat(2);
            const group_num = Math.floor(zIndex / 4);
            if (group_num % 2 === 0) {
                return shuffleLeftAnimation;
            }
            return shuffleRightAnimation;
        }
        setAnimationRepeat(1);
        if (isFaceUp) {
            return rotateBackAnimation;
        }
        return rotateAnimation;
    }


    return (
        <CardContainer $top={top} $left={left} $zIndex={zIndex} $transition={transition} $animation={animation} $animationdelay={animationdelay} $animate={animate} $animationRepeat={animationRepeat}>
            <CardBody $faceUp={isFaceUp} $animation={animation} $animate={animate} $animationdelay={animationdelay} $animationRepeat={animationRepeat}> 
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
