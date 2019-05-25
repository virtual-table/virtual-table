import ApplicationController from 'controllers/application_controller'
import * as THREE from 'three'
import * as CANNON from 'cannon'
import DiceManager from 'lib/dice/dice_manager'
import D4 from 'lib/dice/d4'
import D6 from 'lib/dice/d6'
import D8 from 'lib/dice/d8'
import D10 from 'lib/dice/d10'
import D12 from 'lib/dice/d12'
import D20 from 'lib/dice/d20'

export default class extends ApplicationController {
  
  static targets = ['canvas', 'dice']
  
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
    this.dice = []
    
    let scene    = this.scene    = new THREE.Scene()
    let camera   = this.camera   = new THREE.PerspectiveCamera(this.viewAngle, this.aspectRatio, 1, this.worldHeight * 1.3)
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
    this.setupFloor()
    this.setupSkyBox()
    
    let controls = this.controls = new THREE.OrbitControls(camera, renderer.domElement)
    
    this.setupPhysics()
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
    
    for (let die of this.dice) die.updateMeshFromBody()
    
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
  
  setupFloor () {
    let material = new THREE.MeshPhongMaterial( { color: 0x00aa00, side: THREE.DoubleSide } )
    let geometry = new THREE.PlaneGeometry(30, 30, 10, 10)
    let floor    = new THREE.Mesh(geometry, material)
    
    floor.receiveShadow  = true
    floor.rotation.x = Math.PI / 2
    
    this.scene.add(floor)
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
    
    let floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.floorBodyMaterial })
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    world.add(floorBody)
    
    // ADD WALLS:
    
    DiceManager.setWorld(world)
  }
  
  addDice () {
    this.diceTargets.forEach((diceElement, index) => {
      const sides = parseInt(diceElement.dataset.diceSides)
      let die
      let dieOptions = { 
        size: 1.5,
        backColor: diceElement.dataset.diceBackgroundColor || '#000000', 
        fontColor: diceElement.dataset.diceForegroundColor || '#ffffff'
      }
      
      
      switch (sides) {
        case 4:  die = new D4(dieOptions);  break
        case 6:  die = new D6(dieOptions);  break
        case 8:  die = new D8(dieOptions);  break
        case 10: die = new D10(dieOptions); break
        case 12: die = new D12(dieOptions); break
        case 20: die = new D20(dieOptions); break
      }
      
      if (die) {
        this.scene.add(die.getObject())
      }
      
      this.dice.push(die)
    })
  }
  
  roll () {
    let diceValues = []
    
    this.diceTargets.forEach((diceElement, index) => {
      const die    = this.dice[index]
      const result = parseInt(diceElement.dataset.diceResult)
      
      if (die) {
        let yRand  = Math.random() * 20
        let object = die.getObject()
        
        object.position.x = -15 - (index % 3) * 1.5
        object.position.y = 2 + Math.floor(index / 3) * 1.5
        object.position.z = -15 + (index % 3) * 1.5
        object.quaternion.x = (Math.random()*90-45) * Math.PI / 180
        object.quaternion.z = (Math.random()*90-45) * Math.PI / 180
        
        die.updateBodyFromMesh()
        
        object.body.velocity.set(25 + result, 40 + yRand, 15 + result)
        object.body.angularVelocity.set(20 * Math.random() -10, 20 * Math.random() -10, 20 * Math.random() -10)
        
        diceValues.push({ dice: die, value: result })
      }
    })
    
    DiceManager.prepareValues(diceValues)
  }
}
