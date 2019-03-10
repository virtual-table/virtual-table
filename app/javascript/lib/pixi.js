import * as PIXI from 'pixi.js'
import Viewport from 'pixi-viewport'

PIXI.Viewport = Viewport

// Make PIXI available in global namespace:
global.PIXI = PIXI

export default PIXI
