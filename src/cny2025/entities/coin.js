import Entity from '@avo/entity'
import { LAYERS } from '@avo/constants.js'

const SPIN_DURATION = 50
const PICKEDUP_DURATION = 30

export default class COIN extends Entity {
  constructor (app, col = 0, row = 0) {
    super(app)
    this._type = 'coin'

    this.colour = '#f0c040'
    this.col = col
    this.row = row
    this.size = 32
    this.solid = false

    this.state = 'idle' // 'idle': coin is sitting around. 
                        // 'pickedup': coin has been picked up.
    this.stateTransition = 0

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

    // Check for actions.
    if (this.state === 'idle') {
      this.stateTransition = (this.stateTransition + 1) % SPIN_DURATION
    }

    // If Coin has been picked up, make it disappear after a while.
    if (this.state === 'pickedup') {
      this.colour = '#f0f080'
      this.stateTransition++
      if (this.stateTransition >= PICKEDUP_DURATION) {        
        this._expired = true
      }
    }
  }

  paint (layer = 0) {
    if (layer === LAYERS.MIDDLE) {

      if (this.state === 'idle') {
        let spriteCol = 0

        if (this.stateTransition > SPIN_DURATION * 0.25) spriteCol = 1
        if (this.stateTransition > SPIN_DURATION * 0.5) spriteCol = 2
        if (this.stateTransition > SPIN_DURATION * 0.75) spriteCol = 3

        this.paintSprite({
          spriteCol,
          spriteRow: 1,
        })
      }
    }
  }

  /*
  Snake has collided 
   */
  pickup () {
    if (this.state !== 'idle') return

    const cny2025goals = this._app.rules.get('cny2025-goals')
    cny2025goals?.increaseScore()

    console.log('BLING')
    this.state = 'pickedup'
    this.stateTransition = 0
  }
}
