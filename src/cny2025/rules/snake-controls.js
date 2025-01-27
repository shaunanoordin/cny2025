import Rule from '@avo/rule'
import { POINTER_DEADZONE_RADIUS, POINTER_STATES, LAYERS, TILE_SIZE } from '@avo/constants.js'

export default class SnakeControls extends Rule {
  constructor (app) {
    super(app)
    this._type = 'snake-controls'
    
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    app.addEventListener('keydown', this.onKeyDown)
    app.addEventListener('keyup', this.onKeyUp)

    this.onPointerTap = this.onPointerTap.bind(this)
    app.addEventListener('pointertap', this.onPointerTap)
  }

  deconstructor () {
    app.removeEventListener('pointertap', this.onPointerTap)
  }

  play () {
    const app = this._app
    const hero = app.hero
    super.play()

    if (hero) {
      const {
        keysPressed,
        pointerCurrent,
        pointerStart,
        pointerState,
      } = app.playerInput
      let intent = undefined
      let directionX = 0
      let directionY = 0

      if (pointerState === POINTER_STATES.POINTER_DOWN) {
        // Get pointer input if there's any.

        const distX = pointerCurrent.x - pointerStart.x
        const distY = pointerCurrent.y - pointerStart.y
        const pointerDistance = Math.sqrt(distX * distX + distY * distY)
        // const movementAngle = Math.atan2(distY, distX)

        if (pointerDistance > POINTER_DEADZONE_RADIUS) {
          directionX = distX / pointerDistance
          directionY = distY / pointerDistance
        }

      } else {
        // Otherwise, check for keyboard input.

        if (keysPressed['ArrowRight']) directionX++
        if (keysPressed['ArrowDown']) directionY++
        if (keysPressed['ArrowLeft']) directionX--
        if (keysPressed['ArrowUp']) directionY--
      }
      
      // Move action
      if (!intent && (directionX || directionY)) {
        intent = {
          name: 'move',
          directionX,
          directionY,
        }
      }

      hero.intent = intent
    }
  }

  paint (layer = 0) {
    if (layer === LAYERS.OVERLAY) {
      this.paintPointerInput()
    }
  }

  /*
  Draw pointer input, if any. This helps players get visual feedback on their
  touchscreens.
   */
  paintPointerInput () {
    const c2d = this._app.canvas2d
    const {
      pointerCurrent,
      pointerStart,
      pointerState,
    } = this._app.playerInput
    const START_POINT_RADIUS = TILE_SIZE * 1, CURRENT_POINT_RADIUS = TILE_SIZE * 0.5
    
    if (pointerState === POINTER_STATES.POINTER_DOWN) {
      c2d.lineWidth = Math.floor(Math.min(TILE_SIZE * 0.125, 2))
      c2d.fillStyle = '#40404080'
      c2d.strokeStyle = '#40404080'

      c2d.beginPath()
      c2d.arc(pointerStart.x, pointerStart.y, START_POINT_RADIUS, 0, 2 * Math.PI)
      c2d.stroke()

      c2d.beginPath()
      c2d.arc(pointerCurrent.x, pointerCurrent.y, CURRENT_POINT_RADIUS, 0, 2 * Math.PI)
      c2d.fill()

      c2d.beginPath()
      c2d.moveTo(pointerStart.x, pointerStart.y)
      c2d.lineTo(pointerCurrent.x, pointerCurrent.y)
      c2d.stroke()
    }
  }

  onPointerTap () {
    this.inputTap = true
  }

  onKeyDown ({ key }) {}

  onKeyUp ({ key }) {}
}
