import aceHeart from '../../assets/imgs/hearts/A_of_hearts.svg';
import twoHeart from '../../assets/imgs/hearts/2_of_hearts.svg';
import threeHeart from '../../assets/imgs/hearts/3_of_hearts.svg';
import fourHeart from '../../assets/imgs/hearts/4_of_hearts.svg';
import fiveHeart from '../../assets/imgs/hearts/5_of_hearts.svg';
import sixHeart from '../../assets/imgs/hearts/6_of_hearts.svg';
import sevenHeart from '../../assets/imgs/hearts/7_of_hearts.svg';
import eightHeart from '../../assets/imgs/hearts/8_of_hearts.svg';
import nineHeart from '../../assets/imgs/hearts/9_of_hearts.svg';
import tenHeart from '../../assets/imgs/hearts/10_of_hearts.svg';
import jackHeart from '../../assets/imgs/hearts/jack_of_hearts.svg';
import queenHeart from '../../assets/imgs/hearts/queen_of_hearts.svg';
import kingHeart from '../../assets/imgs/hearts/king_of_hearts.svg';

const hearts = [aceHeart, twoHeart, threeHeart, fourHeart, fiveHeart, sixHeart, sevenHeart, eightHeart, nineHeart, tenHeart, jackHeart, queenHeart, kingHeart]


export function suits() {
    return ["hearts", "diaminds", "clubs", "spades"]
}

export function getAllSVGs() {
    return [...hearts, ...hearts, ...hearts, ...hearts]
}


//export function getFrontSVG(rank, suit) {
//    const card = {
//        suit: {
//            hearts: {
//                rank: {
//                    nine: nineHeart
//                }
//            },
//            diamonds: {
//                rank: {
//                    ace: aceDiamond
//                }
//            },
//            clubs: {
//                rank: {
//                    ace: aceClubs,
//                    ten: tenClub,
//                    king: kingClub
//                }
//            },
//            spades: {
//                rank: {
//                    five: fiveSpade
//                }
//            }
//        }
//    }
//    return card.suit[suit].rank[rank]
//
//}

