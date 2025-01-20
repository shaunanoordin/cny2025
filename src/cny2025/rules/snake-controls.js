import Rule from '@avo/rule'
import { POINTER_DEADZONE_RADIUS, POINTER_STATES } from '@avo/constants.js'

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

  onPointerTap () {
    this.inputTap = true
  }

  onKeyDown ({ key }) {}

  onKeyUp ({ key }) {}
}
