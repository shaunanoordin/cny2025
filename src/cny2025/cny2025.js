import Story from '@avo/story'
import ImageAsset from '@avo/image-asset.js'
import { ROTATIONS } from '@avo/constants.js'

import Snake from './entities/snake.js'
// import PlayerControls from './rules/player-controls.js'

export default class CNY2025 extends Story {
  constructor (app) {
    super(app)
  }

  get assets () {
    return {
      // "hero": new ImageAsset('assets/avo-sprites-2024-08-samiel.png'),
    }
  }

  start () {
    super.start()
    this.load_first_scene()
  }

  load_first_scene () {
    const app = this._app

    app.hero = app.addEntity(new Snake(app, 0, 0))
    app.hero.rotation = ROTATIONS.NORTH
    app.camera.target = app.hero

    // app.addRule(new PlayerControls(app))

  }
}
