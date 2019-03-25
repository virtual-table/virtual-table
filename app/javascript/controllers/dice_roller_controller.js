import ApplicationController from 'controllers/application_controller'
import * as THREE from 'three'
import * as CANNON from 'cannon'
import { DiceManager, DiceD20 } from 'threejs-dice'

export default class extends ApplicationController {
  
  static targets = ['canvas']
  
  get availableHeight () {
    return 600
  }
  
  get availableWidth () {
    return 800
  }
  
  get viewAngle () { return 45 }
  get aspectRatio () { return this.availableWidth / this.availableHeight }
  
  connect () {
    console.log(DiceD20)
    this.dice = []
    
    let scene    = this.scene    = new THREE.Scene()
    let camera   = this.camera   = new THREE.PerspectiveCamera(this.viewAngle, this.aspectRatio, 1, 20000)
    
    scene.add(camera)
    camera.position.set(0, 40, 30)
    camera.up.set(0, 0, -1)
    camera.lookAt(0, 0, 0)
    
    let renderer = this.renderer = new THREE.WebGLRenderer( {antialias:true} )
    renderer.setSize(this.availableWidth, this.availableHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    this.canvasTarget.appendChild(renderer.domElement)
    
    this.setupLighting()
    this.setupFloor()
    this.setupSkyBox()
    
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
    for (var i = 0; i < 20; i++) {
      var die = new DiceD20({size: 1.5, backColor: '#000000', fontColor: '#ffffff' })
      this.scene.add(die.getObject())
      this.dice.push(die)
    }
  }
  
  roll () {
    var diceValues = []
    for (var i = 0; i < this.dice.length; i++) {
      let yRand  = Math.random() * 20
      let die    = this.dice[i]
      let dieObj = die.getObject()
      
      dieObj.position.x = -15 - (i % 3) * 1.5
      dieObj.position.y = 2 + Math.floor(i / 3) * 1.5
      dieObj.position.z = -15 + (i % 3) * 1.5
      dieObj.quaternion.x = (Math.random()*90-45) * Math.PI / 180
      dieObj.quaternion.z = (Math.random()*90-45) * Math.PI / 180
      die.updateBodyFromMesh()
      
      let roll = 20 // Math.random() * 19;
      
      dieObj.body.velocity.set(25 + roll, 40 + yRand, 15 + roll)
      dieObj.body.angularVelocity.set(20 * Math.random() -10, 20 * Math.random() -10, 20 * Math.random() -10)
      
      diceValues.push({ dice: die, value: roll });
    }
    
    DiceManager.prepareValues(diceValues);
  }
}
