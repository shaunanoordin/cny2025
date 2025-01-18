import Entity from '@avo/entity'
// import { POINTER_STATES, FRAME_DURATION, LAYERS, DIRECTIONS } from '@avo/constants.js'
import { angleDiff } from '@avo/misc.js'
import { LAYERS } from '@avo/constants.js'
import SnakeBody from './snake-body.js'

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

    this.bodySegments = []  // SnakeBody segments. index 0 is the first body segment after the head (i.e. this object), last item is the tip of the tail.
    this.moveHistory = []  // Movement history. index 0 is the most recent position of the head (i.e. this object), last item is the oldest position.
    this.moveHistoryLimit = 120
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

    // Automatically transform intent into action
    this.action = this.intent
    const action = this.action

    // Steer the snake!
    if (action?.name === 'move') {
      const directionX = action.directionX || 0
      const directionY = action.directionY || 0
      if (!directionX && !directionY) return

      this.rotation = Math.atan2(directionY, directionX)
      this.moving = true

      /*
      // Experimental rotation limiter
      const newRotation = Math.atan2(directionY, directionX)
      if (!this.moving) {  // If snake isn't moving, head off in whatever direction.
        this.rotation = newRotation
        this.moving = true
      } else {  // If snake is already moving, only change direction if the rotation isn't too wild.
        const ang = angleDiff(this.rotation, newRotation)
        if (ang >= Math.PI * -0.75 && ang <= Math.PI * 0.75) {
          this.rotation = newRotation
        }
      }
      */
    }

    // Move the snake!
    if (this.moving) {

      this.moveX = this.movementSpeed * Math.cos(this.rotation)
      this.moveY = this.movementSpeed * Math.sin(this.rotation)

      // Update the move history
      this.moveHistory.unshift({
        moveX: this.moveX,
        moveY: this.moveY,
        rotation: this.rotation,
        x: this.x,
        y: this.y,
      })

      // TEST: automatically add snake body segments
      const expectedSegments = Math.floor(this.moveHistory.length / this.bodySegmentSpacing) - 1
      if (this.bodySegments.length < expectedSegments) {
        const newBodySegment = app.addEntity(new SnakeBody(app))
        this.bodySegments.push(newBodySegment)
      }

      // Manage snake body
      this.bodySegments.forEach((bodySegment, i) => {
        bodySegment.x = this.moveHistory[(i+1) * this.bodySegmentSpacing]?.x || 0
        bodySegment.y = this.moveHistory[(i+1) * this.bodySegmentSpacing]?.y || 0
      })
    }
    
    while (this.moveHistory.length > this.moveHistoryLimit) {
      this.moveHistory.pop()  // Remove the olderst item in the history
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
    
    console.log('BONK')
  }
}
