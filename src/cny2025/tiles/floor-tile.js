import Tile from '@avo/tile'
import { LAYERS } from '@avo/constants.js'

export default class FloorTile extends Tile {
  constructor (app, col = 0, row = 0) {
    super(app, col, row)
    this._type = 'floor-tile'

    this.colour = '#f0f0f0'
    this.solid = false

    this.spriteSheet = app.assets['cny2025'].img
    this.spriteSizeX = 16
    this.spriteSizeY = 16
    this.spriteScale = 2
    this.spriteOffsetX = -8
    this.spriteOffsetY = -8
  }

  paint (layer = 0) {
    if (layer === LAYERS.BOTTOM) {
      this.paintSprite({
        spriteCol: 6,
        spriteRow: 0,
      })
    }
  }
}