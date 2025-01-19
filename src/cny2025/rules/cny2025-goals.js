import Rule from '@avo/rule'

export default class CNY2025Goals extends Rule {
  constructor (app) {
    super(app)
    this._type = 'cny2025-goals'

    this.score = 0
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
}