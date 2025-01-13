import Entity from '@avo/entity'
// import { POINTER_STATES, FRAME_DURATION, LAYERS, DIRECTIONS } from '@avo/constants.js'
import { angleDiff } from '@avo/misc.js'

export default class Snake extends Entity {
  constructor (app, col = 0, row = 0) {
    super(app)
    this._type = 'snake'

    this.colour = '#c04040'
    this.col = col
    this.row = row

    this.intent = undefined
    this.action = undefined
    this.moving = false

    this.moveHistory = []
    this.moveHistoryLimit = 60
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play () {
    super.play()

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
      const SPEED = 4

      this.moveX = SPEED * Math.cos(this.rotation)
      this.moveY = SPEED * Math.sin(this.rotation)
    }

    // Update the move history
    this.moveHistory.push({
      moveX: this.moveX,
      moveY: this.moveY,
      rotation: this.rotation,
      x: this.x,
      y: this.y,
    })

    while (this.moveHistory.length > this.moveHistoryLimit) {
      this.moveHistory.shift()  // Remove the olderst item in the history
    }
  }

  paint (layer = 0) {
    super.paint(layer)
    const c2d = this._app.canvas2d
    this._app.applyCameraTransforms()


    c2d.fillStyle = this.colour
    c2d.strokeStyle = '#c0c0c0'
    c2d.lineWidth = 1

    this.moveHistory.forEach(item => {
      c2d.beginPath()
      c2d.arc(item.x, item.y, this.size / 4, 0, 2 * Math.PI)
      c2d.fill()
      c2d.stroke()
    })

    this._app.undoCameraTransforms()
  }
}
