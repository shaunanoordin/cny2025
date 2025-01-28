import Rule from '@avo/rule'
import Coin from '../entities/coin.js'
import EnemyBasic from '../entities/enemy-basic.js'
import { LAYERS } from '@avo/constants.js'
import { DIFFICULTY } from '../cny2025.js'

const ANIMATION_DURATION = 120

export default class CNY2025Goals extends Rule {
  constructor (app, difficulty = DIFFICULTY.EASY) {
    super(app)
    this._type = 'cny2025-goals'

    this.difficulty = difficulty
    this.score = 0
    this.spawnCoin()

    this.eventCounter = 0
    this.timeToEvent = 600
    if (this.difficulty === DIFFICULTY.HARD) { this.timeToEvent = 120 }

    this.coinsPerEnemy = 10
    if (this.difficulty === DIFFICULTY.HARD) { this.coinsPerEnemy = 3 }

    this.gameOver = false
    this.animationCounter = 0

    this.spriteSheet = app.assets['cny2025'].img
    this.spriteSizeX = 16  // Size of each sprite on the sprite sheet.
    this.spriteSizeY = 16
    this.spriteScale = 2  // Scale of the sprite when paint()ed.
    this.spriteOffsetX = -8  // Offset of the sprite when paint()ed.
    this.spriteOffsetY = -8  // Usually half of sprite size, to centre-align.
  }

  play () {
    const app = this._app
    const hero = app.hero

    // If there's no hero, or the hero ain't moving, then do nothing except increment the animation counter.
    if (hero?.state !== 'moving') {
      this.animationCounter = (this.animationCounter + 1) % ANIMATION_DURATION
      return
    }

    // As the player increases their score, throw some curveballs along their way.
    const enemiesToSpawn = Math.floor(this.score / this.coinsPerEnemy)
    if (enemiesToSpawn > 0) {
      this.eventCounter++
      if (this.eventCounter >= this.timeToEvent) {
        for (let i = 0 ; i < enemiesToSpawn ; i++) this.spawnEnemy()
        this.eventCounter = 0
      }
    }
  }

  paint (layer = 0) {
    if (layer !== LAYERS.OVERLAY) return

    const app = this._app
    const c2d = app.canvas2d
    const hero = app.hero

    // If the game is over, display the score.
    if (this.gameOver) {
      const MID_X = app.canvasWidth / 2
      const MID_Y = app.canvasHeight / 2

      // Paint background
      c2d.strokeStyle = '#c04040'
      c2d.lineWidth = 8
      c2d.fillStyle = 'rgba(255, 255, 255, 0.8)'
      c2d.beginPath()
      c2d.rect(MID_X - 200, MID_Y - 100, 400, 200)
      c2d.fill()
      c2d.stroke()
      
      // Paint Game Over Text
      c2d.font = '4em monospace'
      c2d.textBaseline = 'middle'
      c2d.lineWidth = 12

      let text = 'GAME OVER'
      c2d.textAlign = 'center'
      c2d.strokeStyle = '#fff'
      c2d.strokeText(text, MID_X, MID_Y - 32)
      c2d.fillStyle = '#C04040'
      c2d.fillText(text, MID_X, MID_Y - 32)

      // Paint score
      this.paintSprite(MID_X - 32, MID_Y + 32, {
        spriteCol: 0,
        spriteRow: 1,
        spriteScale: 3,
      })

      text = this.score
      c2d.textAlign = 'left'
      c2d.strokeStyle = '#fff'
      c2d.strokeText(text, MID_X + 16, MID_Y + 32)
      c2d.fillStyle = '#C0A040'
      c2d.fillText(text, MID_X + 16, MID_Y + 32)

    // If the hero hasn't moved, display the controls.
    } else if (hero?.state === 'idle') {
      const MID_X = app.canvasWidth / 2
      const MID_Y = app.canvasHeight / 2
      const animOffset = (this.animationCounter < ANIMATION_DURATION / 2) ? 0 : 1
      
      this.paintSprite(MID_X - 256, MID_Y - 32, {
        spriteCol: 0 + animOffset,
        spriteRow: 3,
        spriteScale: 4,
        spriteSizeX: 32,
        spriteSizeY: 32,
      })

      this.paintSprite(MID_X + 192, MID_Y - 32, {
        spriteCol: 2 + animOffset,
        spriteRow: 3,
        spriteScale: 4,
        spriteSizeX: 32,
        spriteSizeY: 32,
      })

    // Otherwise, display the current score
    } else if (hero && hero.state === 'moving') {
      const LEFT = 64
      const TOP = 32
      c2d.font = '2em monospace'
      c2d.textBaseline = 'middle'
      c2d.lineWidth = 8

      let text = this.score
      c2d.textAlign = 'left'
      c2d.strokeStyle = '#fff'
      c2d.strokeText(text, LEFT, TOP)
      c2d.fillStyle = '#C0A040'
      c2d.fillText(text, LEFT, TOP)

      this.paintSprite(32, 32, {
        spriteCol: 0,
        spriteRow: 1,
        spriteScale: 3,
      })
    }
  }

  paintSprite (x, y, args = {
      spriteCol: undefined,
      spriteRow: undefined,
      spriteOffsetX: undefined,
      spriteOffsetY: undefined,
      spriteScale: undefined,
      spriteSizeX: undefined,
      spriteSizeY: undefined,
      spriteRotation: undefined,
    }) {
      const app = this._app
      const c2d = app.canvas2d
      const spriteSheet = this.spriteSheet
      if (!spriteSheet) return

      c2d.save()
  
      const sizeX = args?.spriteSizeX ?? this.spriteSizeX
      const sizeY = args?.spriteSizeY ?? this.spriteSizeY
      const srcX = (args?.spriteCol ?? 0) * sizeX
      const srcY = (args?.spriteRow ?? 0) * sizeY
      const scale = args?.spriteScale ?? this.spriteScale
  
      c2d.translate(x, y)
      c2d.scale(scale, scale)
  
      let tgtX = args?.spriteOffsetX ?? this.spriteOffsetX
      let tgtY = args?.spriteOffsetY ?? this.spriteOffsetY
  
      c2d.drawImage(spriteSheet,
        srcX, srcY, sizeX, sizeY,
        tgtX, tgtY, sizeX, sizeY
      )

      c2d.restore()
    }

  doGameOver () {
    console.log('BOOM! Game over! Score: ', this.score)
    this.gameOver = true
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
    const enemy = new EnemyBasic(app, col, row, this.difficulty) 
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
