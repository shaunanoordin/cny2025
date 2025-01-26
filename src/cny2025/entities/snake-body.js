import Entity from '@avo/entity'
import { LAYERS } from '@avo/constants.js'

export default class SnakeBody extends Entity {
  constructor (app) {
    super(app)
    this._type = 'snake-body'

    this.colour = '#804040'
    this.size = 32
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play () {
    super.play()
  }

  paint (layer = 0) {
    // Bug fix: when a snake body segment first spawns, it blinks into existence
    // just outside of the arena for a single frame.
    if (this.x <= 0 || this.y <= 0) return

    const c2d = this._app.canvas2d
    this._app.applyCameraTransforms()

    if (layer === LAYERS.MIDDLE) {
      c2d.fillStyle = this.colour
      c2d.strokeStyle = '#404040'
      c2d.lineWidth = 1
      c2d.beginPath()
      c2d.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI)
      c2d.fill()
      c2d.stroke()
    }

    this._app.undoCameraTransforms()
  }
}
