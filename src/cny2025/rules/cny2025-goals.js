import Rule from '@avo/rule'
import Coin from '../entities/coin.js'

export default class CNY2025Goals extends Rule {
  constructor (app) {
    super(app)
    this._type = 'cny2025-goals'

    this.score = 0
    this.spawnCoin()
  }

  play () {
    const app = this._app
    const hero = app.hero

    // If there's no hero, or the hero ain't moving, then do nothing.
    if (hero?.state !== 'moving') return
  }

  doGameOver () {
    console.log('BOOM! Game over! Score: ', this.score)
  }

  spawnCoin () {
    const app = this._app
    const hero = app.hero

    // Figure out where to spawn the coin.

    // First, consider all possible ranges in the map.
    const mapEdgeBuffer = 2
    const minCol = 0 + mapEdgeBuffer
    const maxCol = app.gameMap.width - 1 - mapEdgeBuffer
    const minRow = 0 + mapEdgeBuffer
    const maxRow = app.gameMap.height - 1 - mapEdgeBuffer

    // Next, pick a random location in the range. 
    // If the location is too close to the hero, pick another.
    let col, row
    do {
      col = Math.floor(Math.random() * (maxCol - minCol) + minCol)
      row = Math.floor(Math.random() * (maxRow - minRow) + minRow)
    } while (isTooCloseToHero(col, row, hero))

    const coin = new Coin(app, col, row) 
    app.addEntity(coin)
  }

  increaseScore () {
    this.score++
    this.spawnCoin()
  }
}

function isTooCloseToHero (col, row, hero) {
  if (col === undefined || row === undefined || !hero) return false

  const tooCloseRange = 5
  if (
    col >= hero.col - tooCloseRange
    && col <= hero.col + tooCloseRange
    && row >= hero.row - tooCloseRange
    && row <= hero.row + tooCloseRange
  ) {
    return true
  }

  return false
}
