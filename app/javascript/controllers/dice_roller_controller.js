import ApplicationController from 'controllers/application_controller'
import * as THREE from 'three'
import * as CANNON from 'cannon'
import DiceTray from 'lib/dice/dice_tray'
import D4 from 'lib/dice/d4'
import D6 from 'lib/dice/d6'
import D8 from 'lib/dice/d8'
import D10 from 'lib/dice/d10'
import D12 from 'lib/dice/d12'
import D20 from 'lib/dice/d20'
import OrbitControls from 'orbit-controls-es6'

export default class extends ApplicationController {
  
  static targets = ['canvas', 'dice', 'seed']
  
  get randomCounter () {
    return this._randomCounter || (this._randomCounter = 0)
  }
  
  set randomCounter (newCount) {
    this._randomCounter = newCount
  }
  
  get seed () {
    if (this._seed) {
      return this._seed
    } else if (this.hasSeedTarget) {
      if (this.seedTarget.value) {
        this._seed = parseInt(this.seedTarget.value)
      } else {
        this._seed = parseInt(this.seedTarget.innerText.trim())
      }
      
    } else {
      this._seed = Math.random() * 1000000
    }
    
    return this._seed
  }
  
  get dimensions () {
    return {
      width:      this.canvasTarget.offsetWidth,
      height:     this.canvasTarget.offsetHeight,
      pixelRatio: window.devicePixelRatio ? window.devicePixelRatio : 1
    }
  }
  
  connect () {
    let tray = this.tray = new DiceTray(this.canvasTarget, this.dimensions)
    let controls = this.controls = new OrbitControls(tray.camera, tray.renderer.domElement)
    
    this.addDice()
    
    this.tray.animate()
    this.roll()
  }
  
  addDice () {
    this.diceTargets.forEach((diceElement, index) => {
      const sides = parseInt(diceElement.dataset.diceSides)
      
      let dicePool   = []
      let dieOptions = { 
        size: 1.5,
        backColor: diceElement.dataset.diceBackgroundColor || '#000000', 
        fontColor: diceElement.dataset.diceForegroundColor || '#ffffff'
      }
      
      switch (sides) {
        case 4:  dicePool = [ new  D4(dieOptions) ]; break
        case 6:  dicePool = [ new  D6(dieOptions) ]; break
        case 8:  dicePool = [ new  D8(dieOptions) ]; break
        case 10: dicePool = [ new D10(dieOptions) ]; break
        case 12: dicePool = [ new D12(dieOptions) ]; break
        case 20: dicePool = [ new D20(dieOptions) ]; break
      }
      
      this.tray.addDicePool(dicePool)
    })
  }
  
  roll () {
    let diceValues = []
    
    this.diceTargets.forEach((diceElement, index) => {
      const dicePool = this.tray.dicePools[index]
      const result   = parseInt(diceElement.dataset.diceResult)
      
      for (let die of dicePool) {
        let yRand  = this.random() * 20
        let object = die.getObject()
        
        object.position.x = -15 - (index % 3) * 1.5
        object.position.y = 2 + Math.floor(index / 3) * 1.5
        object.position.z = -15 + (index % 3) * 1.5
        object.quaternion.x = (this.random()*90-45) * Math.PI / 180
        object.quaternion.z = (this.random()*90-45) * Math.PI / 180
        
        die.updateBodyFromMesh()
        
        object.body.velocity.set(25 + result, 40 + yRand, 15 + result)
        object.body.angularVelocity.set(20 * this.random() -10, 20 * this.random() -10, 20 * this.random() -10)
        
        diceValues.push({ dice: die, value: result })
      }
    })
    
    this.tray.prepareValues(diceValues)
  }
  
  random () {
    let x = Math.sin(this.seed + this.randomCounter++) * 1000
    return x - Math.floor(x)
  }
}
