import Tile from '@avo/tile'
import { LAYERS } from '@avo/constants.js'

export default class WallTile extends Tile {
  constructor (app, col = 0, row = 0) {
    super(app, col, row)
    this._type = 'floor-tile'

    this.colour = '#808080'
    this.solid = true

    this.spriteSheet = app.assets['cny2025'].img
    this.spriteSizeX = 16
    this.spriteSizeY = 16
    this.spriteScale = 2
    this.spriteOffsetX = -8
    this.spriteOffsetY = -8
  }

  paint (layer = 0) {
    if (layer === LAYERS.MIDDLE) {
      this.paintSprite({
        spriteCol: 7,
        spriteRow: 0,
      })
    }
  }
}
