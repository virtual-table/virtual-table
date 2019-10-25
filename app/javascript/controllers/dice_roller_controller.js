import ApplicationController from 'controllers/application_controller'
import THREE from 'lib/three'
import CANNON from 'lib/cannon'
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
      screen: {
        width:      this.canvasTarget.offsetWidth,
        height:     this.canvasTarget.offsetHeight,
        pixelRatio: window.devicePixelRatio ? window.devicePixelRatio : 1
      }
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
    let count = 0
    let loop  = 0
    
    this.diceTargets.forEach((diceElement, index) => {
      const dicePool = this.tray.dicePools[index]
      const result   = parseInt(diceElement.dataset.diceResult)
      
      for (let die of dicePool) {
        let object = die.getObject()
        
        // x = left to right
        // y = floor to ceiling
        // z = top to bottom
        
        // POSITION DIE:
        this.tray.positionObject(object, count, loop)
        
        if (die.outOfBounds) {
          loop++
          count = 0
          
          this.tray.positionObject(object, count, loop)
        } else {
          count++
        }
        
        // ROTATE DIE:
        // object.quaternion.x = (this.random()*90-45) * Math.PI / 180
        // object.quaternion.z = (this.random()*90-45) * Math.PI / 180
        
        die.updateBodyFromMesh()
        
        // GO DIE, GO:
        const velocity = this.shuffle([
          (this.random() < 0.5 ? 2 : -2) * this.random() * die.inertia,
          (this.random() < 0.5 ? 5 : -5) * this.random() * die.inertia,
          (this.random() < 0.5 ? 8 : -8) * this.random() * die.inertia
        ])
        
        object.body.velocity.set(...velocity)
        object.body.angularVelocity.set(this.random(), this.random(), this.random())
        
        diceValues.push({ dice: die, value: result })
      }
    })
    
    this.tray.cheat(diceValues)
  }
  
  shuffle (a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(this.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
  
  random () {
    let x = Math.sin(this.seed + this.randomCounter++) * 1000
    return x - Math.floor(x)
  }
}
