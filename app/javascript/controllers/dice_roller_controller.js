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
  
  get availableHeight () {
    return this.canvasTarget.offsetHeight
  }
  
  get availableWidth () {
    return this.canvasTarget.offsetWidth
  }
  
  get worldHeight () { return this.availableHeight / this.aspectRatio / Math.tan(10 * Math.PI / 180) }
  
  get viewAngle ()   { return 40 }
  get aspectRatio () { return this.availableWidth / this.availableHeight }
  
  connect () {
    let scene    = this.scene  = new THREE.Scene()
    let camera   = this.camera = new THREE.PerspectiveCamera(this.viewAngle, this.aspectRatio, 1, this.worldHeight * 1.3)
    camera.position.set(0, this.worldHeight / 20, 10)
    camera.up.set(0, 0, -1)
    camera.lookAt(0, 0, 0)
    scene.add(camera)
    
    let renderer = this.renderer = new THREE.WebGLRenderer( {antialias:true} )
    renderer.setSize(this.availableWidth, this.availableHeight)
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    this.canvasTarget.appendChild(renderer.domElement)
    
    this.setupLighting()
    this.setupSkyBox()
    
    let controls = this.controls = new THREE.OrbitControls(camera, renderer.domElement)
    
    this.setupPhysics()
    
    this.tray = new DiceTray(this.scene, this.world)
    this.addDice()
    
    this.animate()
    this.roll()
  }
  
  animate () {
    if (this.scene) {
      this.render()
      requestAnimationFrame(this.animate.bind(this))
    }
  }
  
  render () {
    this.world.step(1.0 / 60.0)
    
    for (let dicePool of this.tray.dicePools) {
      for (let die of dicePool) die.updateMeshFromBody()
    }
    
    this.renderer.render(this.scene, this.camera)
  }
  
  setupLighting () {
    let ambient = new THREE.AmbientLight(0xffffff, 0.3)
    this.scene.add(ambient)
    
    let directional = new THREE.DirectionalLight(0xffffff, 0.5)
    directional.position.x = -1000
    directional.position.y = 1000
    directional.position.z = 1000
    this.scene.add(directional)
    
    let spot = new THREE.SpotLight(0xefdfd5, 1.3)
    spot.position.y = 100
    spot.target.position.set(0, 0, 0)
    spot.castShadow = true
    spot.shadow.camera.near = 50
    spot.shadow.camera.far = 110
    spot.shadow.mapSize.width = 1024
    spot.shadow.mapSize.height = 1024
    this.scene.add(spot)
  }
  
  setupSkyBox () {
    let geometry = new THREE.CubeGeometry( 10000, 10000, 10000 )
    let material = new THREE.MeshPhongMaterial( { color: 0x9999ff, side: THREE.BackSide } )
    let skyBox   = new THREE.Mesh( geometry, material )
    this.scene.add(skyBox)
    this.scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 )
  }
  
  setupPhysics () {
    let world = this.world = new CANNON.World()
    
    world.gravity.set(0, -9.82 * 20, 0)
    world.broadphase = new CANNON.NaiveBroadphase()
    world.solver.iterations = 16
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
