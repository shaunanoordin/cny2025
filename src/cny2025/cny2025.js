import Story from '@avo/story'
import ImageAsset from '@avo/image-asset.js'

import Snake from './entities/snake.js'
import SnakeControls from './rules/snake-controls.js'
import CNY2025Goals from './rules/cny2025-goals.js'

import FloorTile from './tiles/floor-tile.js'
import WallTile from './tiles/wall-tile.js'

export const DIFFICULTY = {
  'EASY': 0,
  'HARD': 1,
}

export default class CNY2025 extends Story {
  constructor (app) {
    super(app)

    this.assets = {
      "cny2025": new ImageAsset('assets/cny2025-sprites.png'),
    }

    this.difficulty = DIFFICULTY.EASY

    // Add event listener
    this.startButton_onClick = this.startButton_onClick.bind(this)
    this.startExpertModeButton_onClick = this.startExpertModeButton_onClick.bind(this)
    document.getElementById('cny2025-start-button').addEventListener('click', this.startButton_onClick)
    document.getElementById('cny2025-start-expert-mode-button').addEventListener('click', this.startExpertModeButton_onClick)
    // ⚠️ NOTE: since the Story doesn't ever unload/deconstruct, there's no corresponding .removeEventListener()

    // Open home menu when the game starts
    app.setHomeMenu(true)
  }

  start () {
    super.start()
    this.load_first_scene()
  }

  load_first_scene () {
    const app = this._app
    const ARENA_WIDTH = 25
    const ARENA_HEIGHT = 25

    // Set up Entities (just the hero, actually)
    app.hero = app.addEntity(new Snake(app, Math.floor(ARENA_WIDTH / 2), Math.floor(ARENA_HEIGHT / 2)))
    app.camera.target = app.hero

    // Set up Map
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

    // Add Rules
    // Be sure to only do this after the map and entities have been set up. 
    app.addRule(new SnakeControls(app))
    app.addRule(new CNY2025Goals(app))
  }

  startButton_onClick () {
    this._app.setHomeMenu(false)
    this.difficulty = DIFFICULTY.EASY
    this.start()
  }

  startExpertModeButton_onClick () {
    this._app.setHomeMenu(false)
    this.difficulty = DIFFICULTY.HARD
    this.start()
  }
}
