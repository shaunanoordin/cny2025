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
    const app = this._app
    const c2d = app.canvas2d
    
    // FIX: prevent weird flashing of canvas background colour when tile
    // sprites aren't aligned properly. Instead of using sprites, manually
    // paint the floor instead.
    if (layer === LAYERS.BOTTOM) {
      app.applyCameraTransforms()
      c2d.fillStyle = '#f0f0f0'
      c2d.strokeStyle = '#fff'
      c2d.lineWidth = 2
      c2d.beginPath()
      c2d.rect(this.left, this.top, this.size, this.size)  // width/height of 40 = 32 (tile size) + 4 (padding) x 2
      c2d.fill()
      c2d.stroke()
      app.undoCameraTransforms()
    
    // Paint the actual sprite
    }
    
    /*
    // Remove sprited floors. Sorry!
    if (layer === LAYERS.BOTTOM) {
      this.paintSprite({
        spriteCol: 6,
        spriteRow: 0,
      })
    }
     */
  }
}