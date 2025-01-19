import Entity from '@avo/entity'

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
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play () {
    super.play()

    // Check for actions.
    if (this.state === 'idle') {}

    // If Coin has been picked up, make it disappear after a while.
    if (this.state === 'pickedup') {
      this.colour = '#f0f080'
      this.stateTransition++
      if (this.stateTransition >= PICKEDUP_DURATION) {        
        this._expired = true
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
