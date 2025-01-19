import Story from '@avo/story'
import ImageAsset from '@avo/image-asset.js'
import { ROTATIONS } from '@avo/constants.js'

import Snake from './entities/snake.js'
import SnakeControls from './rules/snake-controls.js'

import FloorTile from './tiles/floor-tile.js'
import WallTile from './tiles/wall-tile.js'

export default class CNY2025 extends Story {
  constructor (app) {
    super(app)
    
    this.assets = {
      // "hero": new ImageAsset('assets/avo-sprites-2024-08-samiel.png'),
      // "map": new ImageAsset('assets/avo-sprites-2024-09-simple-map-tiles.png'),
    }
  }

  start () {
    super.start()
    this.load_first_scene()
  }

  load_first_scene () {
    const app = this._app
    const ARENA_WIDTH = 25
    const ARENA_HEIGHT = 25

    app.hero = app.addEntity(new Snake(app, Math.floor(ARENA_WIDTH / 2), Math.floor(ARENA_HEIGHT / 2)))
    app.hero.rotation = ROTATIONS.NORTH
    app.camera.target = app.hero

    app.addRule(new SnakeControls(app))

    app.gameMap.tiles = []
    app.gameMap.width = ARENA_WIDTH
    app.gameMap.height = ARENA_HEIGHT

    for (let row = 0 ; row < app.gameMap.height ; row++) {
      app.gameMap.tiles.push([])
      for (let col = 0 ; col < app.gameMap.width ; col++) {
        const isWall = row === 0
          || row === app.gameMap.height - 1
          || col === 0
          || col === app.gameMap.width - 1
         
        if (isWall) {
          const tile = new WallTile(app, col, row)
          app.gameMap.tiles[row].push(tile)
        } else {
          const tile = new FloorTile(app, col, row)
          app.gameMap.tiles[row].push(tile)
        }
      }
    }
  }
}
