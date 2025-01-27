import Entity from '@avo/entity'
import { LAYERS } from '@avo/constants.js'

export default class SnakeBody extends Entity {
  constructor (app) {
    super(app)
    this._type = 'snake-body'

    this.colour = '#804040'
    this.size = 32

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
  }

  paint (layer = 0) {
    // Bug fix: when a snake body segment first spawns, it blinks into existence
    // just outside of the arena for a single frame.
    if (this.x <= 0 || this.y <= 0) return

    if (layer === LAYERS.MIDDLE) {
      this.paintSprite({
        spriteCol: 2,
        spriteRow: 0,
        spriteRotation: this.rotation - Math.PI / 2
      })
    }
  }
}
