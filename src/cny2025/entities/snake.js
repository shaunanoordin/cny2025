import Entity from '@avo/entity'
// import { POINTER_STATES, FRAME_DURATION, LAYERS, DIRECTIONS } from '@avo/constants.js'

export default class Snake extends Entity {
  constructor (app, col = 0, row = 0) {
    super(app)
    this._type = 'snake'

    this.colour = '#c04040'
    this.col = col
    this.row = row

    this.intent = undefined
    this.action = undefined
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play () {
    super.play()
  }
}
