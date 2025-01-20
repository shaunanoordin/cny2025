import Rule from '@avo/rule'
import Coin from '../entities/coin.js'
import EnemyBasic from '../entities/enemy-basic.js'

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

    // Figure out where to spawn the coin.
    const { col, row } = this.getRandomPosition()

    const coin = new Coin(app, col, row) 
    app.addEntity(coin)
  }

  spawnEnemy () {

  }

  increaseScore () {
    this.score++
    this.spawnCoin()
  }

  getRandomPosition () {
    const app = this._app

    // Calculate acceptable range of positions.
    // Basically, the random position must be within the game map. 
    const mapEdgeBuffer = 2
    const minCol = 0 + mapEdgeBuffer
    const maxCol = app.gameMap.width - 1 - mapEdgeBuffer
    const minRow = 0 + mapEdgeBuffer
    const maxRow = app.gameMap.height - 1 - mapEdgeBuffer

    // Next, pick a random location in the range. 
    // If the location is too close to another entity, pick another location.
    let col, row
    do {
      col = Math.floor(Math.random() * (maxCol - minCol) + minCol)
      row = Math.floor(Math.random() * (maxRow - minRow) + minRow)
    } while (this.isTooCloseToAnyEntity(col, row))
  }

  isTooCloseToAnyEntity (col, row) {
    const hero = this._app.hero
    const entities = this._app.entities
    if (col === undefined || row === undefined || !hero || !entities) return false
  
    for (let i = 0 ; i < entities.length ; i++) {
      const entity = entities[i]
      const tooCloseRange = (entity === hero) ? 5 : 2
      if (
        col >= entity.col - tooCloseRange
        && col <= entity.col + tooCloseRange
        && row >= entity.row - tooCloseRange
        && row <= entity.row + tooCloseRange
      ) {
        return true
      }
    }
  
    return false
  }
}
