import Rule from '@avo/rule'
import Coin from '../entities/coin.js'
import EnemyBasic from '../entities/enemy-basic.js'

const TIME_FOR_SHENANIGANS = 120

export default class CNY2025Goals extends Rule {
  constructor (app) {
    super(app)
    this._type = 'cny2025-goals'

    this.score = 0
    this.spawnCoin()

    this.eventCounter = 0
  }

  play () {
    const app = this._app
    const hero = app.hero

    // If there's no hero, or the hero ain't moving, then do nothing.
    if (hero?.state !== 'moving') return

    // As the player increases their score, throw some curveballs along their way.
    const difficulty = Math.floor(this.score / 3)
    if (difficulty > 0) {
      this.eventCounter++
      if (this.eventCounter >= TIME_FOR_SHENANIGANS) {
        for (let i = 0 ; i < difficulty ; i++) this.spawnEnemy()
        this.eventCounter = 0
      }
    }
  }

  doGameOver () {
    console.log('BOOM! Game over! Score: ', this.score)
  }

  spawnCoin () {
    const app = this._app

    // Spawn the coin at a random position.
    const { col, row } = this.getRandomPosition()
    const coin = new Coin(app, col, row) 
    app.addEntity(coin)
  }

  spawnEnemy () {
    const app = this._app

    // Spawn the enemy at a random position.
    const { col, row } = this.getRandomPosition()
    const enemy = new EnemyBasic(app, col, row) 
    app.addEntity(enemy)
  }

  increaseScore () {
    this.score++
    this.spawnCoin()
  }

  /*
  Pick a random position that's within the map, and not too close to any other
  entity, and definitely not too close with the Hero.
   */
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
    let col, row, safety
    do {
      col = Math.floor(Math.random() * (maxCol - minCol) + minCol)
      row = Math.floor(Math.random() * (maxRow - minRow) + minRow)
      safety++  // Loop safety
    } while (this.isTooCloseToAnyEntity(col, row, safety))

    return { col, row }
  }

  isTooCloseToAnyEntity (col, row, safety = 1000) {
    const hero = this._app.hero
    const entities = this._app.entities
    if (col === undefined || row === undefined || !hero || !entities || safety >= 1000) return false
  
    for (let i = 0 ; i < entities.length ; i++) {
      const entity = entities[i]
      let tooCloseRange = 2
      if (safety >= 100) tooCloseRange = 1  // If the map is so crowded that we're rerolling for positions too many times, we just say, heck it, spawn anywhere that's not too close to the hero.
      if (safety >= 500) tooCloseRange = 0
      if (entity === hero) tooCloseRange = 5
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
