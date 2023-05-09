import nineHeart from '../../assets/9_of_hearts.svg'
import tenClub from '../../assets/10_of_clubs.svg'
import fiveSpade from '../../assets/5_of_spades.svg'
import aceDiamond from '../../assets/ace_of_diamonds.svg'
import kingClub from '../../assets/imgs/king_of_clubs2.svg'
import aceClubs from '../../assets/imgs/A_of_clubs.svg'


export function suits() {
    return ["hearts", "diaminds", "clubs", "spades"]
}

export function getAllSVGs() {
    return [nineHeart, tenClub, fiveSpade, aceDiamond, kingClub, aceClubs]
}


export function getFrontSVG(rank, suit) {
    const card = {
        suit: {
            hearts: {
                rank: {
                    nine: nineHeart
                }
            },
            diamonds: {
                rank: {
                    ace: aceDiamond
                }
            },
            clubs: {
                rank: {
                    ace: aceClubs,
                    ten: tenClub,
                    king: kingClub
                }
            },
            spades: {
                rank: {
                    five: fiveSpade
                }
            }
        }
    }
    return card.suit[suit].rank[rank]

}

