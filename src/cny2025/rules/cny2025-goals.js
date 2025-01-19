import Rule from '@avo/rule'
import Coin from '../entities/coin.js'

export default class CNY2025Goals extends Rule {
  constructor (app) {
    super(app)
    this._type = 'cny2025-goals'

    this.score = 0
    this.spawnCoin()
  }

  play () {
    const app = this._app
    const hero = app.hero

    // If there's no hero, or the hero ain't moving, then do nothing.
    if (hero?.state !== 'moving') return
  }

  doGameOver () {
    console.log('BOOM! Game over! Score: ', this.score)
  }

  spawnCoin () {
    const app = this._app
    const hero = app.hero

    const coin = new Coin(app, 3, 3) 
    app.addEntity(coin)
  }

  increaseScore () {
    this.score++
    // this.spawnCoin()
  }
}