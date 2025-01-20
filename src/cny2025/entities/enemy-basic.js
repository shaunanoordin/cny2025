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

    // Check for actions.
    if (this.state === 'idle' || this.state === 'moving') {
      // Automatically transform intent into action
      this.action = this.intent
      const action = this.action

      // Steer the snake!
      if (action?.name === 'move') {
        const directionX = action.directionX || 0
        const directionY = action.directionY || 0
        if (!directionX && !directionY) return

        this.rotation = Math.atan2(directionY, directionX)
        this.state = 'moving'
      }
    }

    // Move the snake!
    if (this.state === 'moving') {

      // Update the move history
      this.moveHistory.unshift({  // Add newest position to the start of the array.
        moveX: this.moveX,
        moveY: this.moveY,
        rotation: this.rotation,
        x: this.x,
        y: this.y,
      })

      // Now, move.
      this.moveX = this.movementSpeed * Math.cos(this.rotation)
      this.moveY = this.movementSpeed * Math.sin(this.rotation)

      // Spawn new snake body segments, if necessary.
      const expectedSegments = Math.floor(this.moveHistory.length / this.bodySegmentSpacing)
      if (this.bodySegments.length < expectedSegments) {
        const newBodySegment = app.addEntity(new SnakeBody(app))
        this.bodySegments.push(newBodySegment)
      }

      // Manage snake body segments. They should follow the head.
      this.bodySegments.forEach((bodySegment, i) => {
        bodySegment.x = this.moveHistory[(i+1) * this.bodySegmentSpacing]?.x || 0
        bodySegment.y = this.moveHistory[(i+1) * this.bodySegmentSpacing]?.y || 0
      })

      // Cleanup.
      while (this.moveHistory.length > this.moveHistoryLimit) {
        this.moveHistory.pop()  // Remove the oldest position (last item in the array) in the history.
      }
    }

    // Explode the snake!
    if (this.state === 'exploding') {
      this.colour = '#e0c040'
      this.stateTransition++
      if (this.stateTransition >= EXPLOSION_DURATION) {        
        this.state = 'exploded'
        const cny2025goals = app.rules.get('cny2025-goals')
        cny2025goals?.doGameOver()
      }
    } else if (this.state === 'exploded') {
      this.colour = '#602020'
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
