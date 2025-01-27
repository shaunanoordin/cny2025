import Entity from '@avo/entity'
import { LAYERS } from '@avo/constants.js'

const SPAWN_DURATION = 30
const EXPLOSION_DURATION = 30
const ROCKET_EXHAUST_ANIMATION_DURATION = 30

export default class EnemyBasic extends Entity {
  constructor (app, col = 0, row = 0) {
    super(app)
    this._type = 'enemy-basic'

    this.colour = '#40c040'
    this.col = col
    this.row = row
    this.size = 32
    this.solid = false

    this.state = 'spawning' // 'spawning': enemy is in the process of spawning. 
                            // 'moving': enemy is moving.
                            // 'exploding': enemy has collided into something and is in the state of exploding!
                            // 'exploded': enemy has exploded.
    this.stateTransition = 0
    this.movementSpeed = 4  // How fast the enemy moves. WARNING: don't confuse with Entity.moveSpeed!

    this.spriteSheet = app.assets['cny2025'].img
    this.spriteSizeX = 16
    this.spriteSizeY = 16
    this.spriteScale = 2
    this.spriteOffsetX = -8
    this.spriteOffsetY = -8
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play () {
    super.play()

    const hero = this._app.hero

    if (this.state === 'spawning') {
      this.colour = '#408080'
      this.solid = false
      this.stateTransition++
      if (this.stateTransition >= SPAWN_DURATION) {        
        this.state = 'moving'
        this.stateTransition = 0
      }

      // Aim self the hero
      let distX = hero.x - this.x
      let distY = hero.y - this.y
      if (distX !== 0 || distY !== 0) {
        this.rotation = Math.atan2(distY, distX)
      }

    } else if (this.state === 'moving') {
      this.colour = '#40c080'
      this.solid = true

      this.moveX = this.movementSpeed * Math.cos(this.rotation)
      this.moveY = this.movementSpeed * Math.sin(this.rotation)

      this.stateTransition = (this.stateTransition + 1) % ROCKET_EXHAUST_ANIMATION_DURATION

    } else if (this.state === 'exploding') {
      this.colour = '#408080'
      this.solid = false
      this.stateTransition++
      if (this.stateTransition >= EXPLOSION_DURATION) {        
        this.state = 'exploded'
        this.stateTransition = 0
      }

    } else if (this.state === 'exploded') {
      this._expired = true
    }
  }

  onCollision (target, collisionCorrection) {
    super.onCollision(target, collisionCorrection)

    if (target.solid) {
      this.explode()
    }
  }

  /*
  Enemy has collided with something solid and needs to go boom. 
   */
  explode () {
    if (this.state !== 'moving') return
    this.state = 'exploding'
    this.stateTransition = 0
  }

  paint (layer = 0) {
    // super.paint(layer)
    const app = this._app
    const c2d = this._app.canvas2d
    const state = this.state

    if (state === 'spawning' || state === 'moving') {

      // Paint the rocket
      if (layer === LAYERS.MIDDLE) {
        this.paintSprite({
          spriteCol: 3,
          spriteRow: 0,
          spriteRotation: this.rotation - Math.PI / 2
        })
      
      // Paint the rocket exhaust
      } else if (layer === LAYERS.BOTTOM && state === 'moving') {
        let lineWidth = 4
        let exhaustDistance = -24
        let exhaustSize = 12
        if (this.stateTransition < ROCKET_EXHAUST_ANIMATION_DURATION * 0.5) {
          lineWidth = 6
          exhaustDistance = -20
          exhaustSize = 10
        }

        app.applyCameraTransforms()
        let tgtX = this.x + Math.cos(this.rotation) * exhaustDistance
        let tgtY = this.y + Math.sin(this.rotation) * exhaustDistance
  
        c2d.fillStyle = '#fff'
        c2d.strokeStyle = '#f0f040'
        c2d.lineWidth = lineWidth
        c2d.beginPath()
        c2d.arc(tgtX, tgtY, exhaustSize, 0, 2 * Math.PI)
        c2d.fill()
        c2d.stroke()
        app.undoCameraTransforms()  
      }

    } else if (state === 'exploding') {
      //Draw explosion
      if (layer === LAYERS.TOP) {
        let spriteCol = 0
        if (this.stateTransition > EXPLOSION_DURATION * 0.3) spriteCol = 1
        if (this.stateTransition > EXPLOSION_DURATION * 0.5) spriteCol = 2
        if (this.stateTransition > EXPLOSION_DURATION * 0.7) spriteCol = 3

        this.paintSprite({
          spriteCol,
          spriteRow: 1,
          spriteSizeX: 32,
          spriteSizeY: 32,
          spriteOffsetX: -16,
          spriteOffsetY: -16, 
        })
      }

    }
  }
}
