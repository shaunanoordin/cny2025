import Entity from '@avo/entity'
// import { POINTER_STATES, FRAME_DURATION, LAYERS, DIRECTIONS } from '@avo/constants.js'
import { angleDiff } from '@avo/misc.js'
import { LAYERS } from '@avo/constants.js'
import SnakeBody from './snake-body.js'

const EXPLOSION_DURATION = 30

export default class Snake extends Entity {
  constructor (app, col = 0, row = 0) {
    super(app)
    this._type = 'snake'

    this.colour = '#c04040'
    this.col = col
    this.row = row
    this.size = 32

    this.intent = undefined
    this.action = undefined
    this.moving = false
    this.state = 'idle' // 'idle': snake is waiting for commands. 
                        // 'moving': snake is moving. You can steer it!
                        // 'exploding': oops, snake has collided into something and is in the state of exploding!
                        // 'exploded': snake has exploded.
    this.stateTransition = 0

    this.bodySegments = []  // SnakeBody segments. index 0 is the first body segment after the head (i.e. this object), last item is the tip of the tail.
    this.moveHistory = []  // Movement history. index 0 is the most recent position of the head (i.e. this object), last item is the oldest position.
    this.moveHistoryLimit = 40
    this.movementSpeed = 4  // WARNING: don't confuse with Entity.moveSpeed!
    this.bodySegmentSpacing = 8
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play () {
    super.play()
    const app = this._app

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

  paint (layer = 0) {
    // super.paint(layer)
    const c2d = this._app.canvas2d
    this._app.applyCameraTransforms()

    if (layer === LAYERS.MIDDLE) {
      // Draw head
      c2d.fillStyle = this.colour
      c2d.strokeStyle = '#404040'
      c2d.lineWidth = 1
      c2d.beginPath()
      c2d.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI)
      c2d.fill()
      c2d.stroke()

    } else if (layer === LAYERS.BOTTOM) {
      //Draw tail
      c2d.fillStyle = '#a0a0a0'
      c2d.strokeStyle = '#c0c0c0'
      c2d.lineWidth = 1
      this.moveHistory.forEach(item => {
        c2d.beginPath()
        c2d.arc(item.x, item.y, this.size / 4, 0, 2 * Math.PI)
        c2d.fill()
        c2d.stroke()
      })
    }

    this._app.undoCameraTransforms()
  }

  onCollision (target, collisionCorrection) {
    super.onCollision(target, collisionCorrection)

    // Ignore collision with first body segment
    if (target === this.bodySegments[0]) return

    if (target._type === 'coin') {
      target.pickup()
    } else if (target.solid) {
      this.explode()
    }
  }

  /*
  Snake has collided 
   */
  explode () {
    if (this.state !== 'moving') return
    console.log('BONK')
    this.state = 'exploding'
    this.stateTransition = 0
  }
}
