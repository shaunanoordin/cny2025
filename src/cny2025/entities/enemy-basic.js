import Entity from '@avo/entity'

const SPAWN_DURATION = 30
const EXPLOSION_DURATION = 30

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
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play () {
    super.play()
    const app = this._app

    if (this.state === 'spawning') {
      this.colour = '#408080'
      this.solid = false
      this.stateTransition++
      if (this.stateTransition >= SPAWN_DURATION) {        
        this.state = 'moving'
      }

    } else if (this.state === 'moving') {
      this.colour = '#40c080'
      this.solid = true

    } else if (this.state === 'exploding') {
      this.colour = '#408080'
      this.solid = false
      this.stateTransition++
      if (this.stateTransition >= EXPLOSION_DURATION) {        
        this.state = 'exploded'
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
}
