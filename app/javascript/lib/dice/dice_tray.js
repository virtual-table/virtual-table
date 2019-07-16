import * as CANNON from 'cannon';
import * as THREE from 'three';

export default class DiceTray {
  constructor (container, dimensions) {
    this.container  = container
    this.dicePools  = []
    this.dimensions = dimensions
    this.materials  = {}
    
    this.setup()
  }
  
  // SETUP:
  
  setup () {
    this.setupDimensions()
    this.setupWorld()
    this.setupScene()
    
    this.setupCamera()
    this.setupRenderer()
    
    this.container.appendChild(this.renderer.domElement)
  }
  
  setupDimensions () {
    let dimensions = this.dimensions
    let screen     = dimensions.screen
    
    screen.aspect = screen.width / screen.height
    
    dimensions.scale  = (screen.width ** 2 + screen.height ** 2) / 13
    dimensions.x      = screen.width / screen.pixelRatio
    dimensions.y      = screen.height / screen.pixelRatio
    dimensions.z      = dimensions.y / Math.tan(10 * Math.PI / 180)
  }
  
  setupScene () {
    let scene = this.scene = new THREE.Scene()
    
    this.setupMaterials()
    this.setupCage()
    this.setupLighting()
    this.setupSkybox()
  }
  
  setupWorld () {
    let world = this.world = new CANNON.World()
    
    world.gravity.set(0, -9.82 * 20, 0)
    world.broadphase = new CANNON.NaiveBroadphase()
    world.solver.iterations = 16
  }
  
  setupMaterials () {
    let world = this.world
    
    let diceMaterial  = this.materials.dice  = new CANNON.Material()
    let floorMaterial = this.materials.floor = new CANNON.Material()
    let wallMaterial  = this.materials.wall  = new CANNON.Material()
    
    world.addContactMaterial(new CANNON.ContactMaterial(floorMaterial, diceMaterial, { friction: 0.01, restitution: 0.5 }))
    world.addContactMaterial(new CANNON.ContactMaterial(wallMaterial,  diceMaterial, { friction: 0,    restitution: 1.0 }))
    world.addContactMaterial(new CANNON.ContactMaterial(diceMaterial,  diceMaterial, { friction: 0,    restitution: 0.5 }))
  }
  
  setupCage () {
    let floor = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: this.materials.floor })
    floor.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    this.world.add(floor)
    
    let wall
    
    [
      { axis: [0, 0, 1], angle:  Math.PI,      position: [  0, 0, -15] }, // TOP
      { axis: [0, 1, 0], angle: -Math.PI / 2,  position: [ 15, 0,   0] },
      { axis: [0, 1, 0], angle:  Math.PI,      position: [  0, 0,  15] },
      { axis: [0, 1, 0], angle:  Math.PI / 2,  position: [-15, 0,   0] }
    ].forEach((options) => {
      let wall = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: this.materials.floor })
      wall.quaternion.setFromAxisAngle(new CANNON.Vec3(...options.axis), options.angle)
      wall.position.set(...options.position)
      this.world.add(wall)
    })
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
  
  setupSkybox () {
    let geometry = new THREE.CubeGeometry( 10000, 10000, 10000 )
    let material = new THREE.MeshPhongMaterial( { color: 0x9999ff, side: THREE.BackSide } )
    let skyBox   = new THREE.Mesh( geometry, material )
    this.scene.add(skyBox)
    this.scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 )
  }
  
  setupCamera () {
    const { dimensions } = this
    const { screen     } = dimensions
    
    let camera = this.camera = new THREE.PerspectiveCamera(20, screen.aspect, 1, dimensions.z * 1.3)
    camera.position.set(0, dimensions.z / 20, 10)
    camera.up.set(0, 0, -1)
    camera.lookAt(0, 0, 0)
    
    this.scene.add(camera)
  }
  
  setupRenderer () {
    const screen = this.dimensions.screen
    let renderer = this.renderer = new THREE.WebGLRenderer({ antialias:true })
    
    renderer.setSize(screen.width, screen.height)
    renderer.setPixelRatio(screen.pixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftMap
    renderer.setClearColor(0xffffff, 1)
    
    this.cannonDebugger = new THREE.CannonDebugRenderer(this.scene, this.world)
  }
  
  // RENDERING:
  
  animate () {
    if (this.scene) {
      this.render()
      requestAnimationFrame(this.animate.bind(this))
    }
  }
  
  render () {
    this.cannonDebugger.update()
    this.world.step(1.0 / 60.0)
    
    for (let dicePool of this.dicePools) {
      for (let die of dicePool) die.updateMeshFromBody()
    }
    
    this.renderer.render(this.scene, this.camera)
  }
  
  // DICE:
  
  addDicePool (dice) {
    for (let die of dice) {
      die.tray = this
      this.scene.add(die.getObject())
    }
    
    this.dicePools.push(dice)
  }
  
  /**
   *
   * @param {array} diceValues
   * @param {DiceObject} [diceValues.dice]
   * @param {number} [diceValues.value]
   *
   */
  prepareValues(diceValues) {
    if (this.throwRunning) throw new Error('Cannot start another throw. Please wait, till the current throw is finished.');
    
    for (let i = 0; i < diceValues.length; i++) {
      if (diceValues[i].value < 1 || diceValues[i].dice.values < diceValues[i].value) {
        throw new Error('Cannot throw die to value ' + diceValues[i].value + ', because it has only ' + diceValues[i].dice.values + ' sides.');
      }
    }
    
    this.throwRunning = true;
    
    for (let i = 0; i < diceValues.length; i++) {
      diceValues[i].dice.simulationRunning = true;
      diceValues[i].vectors = diceValues[i].dice.getCurrentVectors();
      diceValues[i].stableCount = 0;
    }
    
    let check = () => {
      let allStable = true;
      for (let i = 0; i < diceValues.length; i++) {
        if (diceValues[i].dice.isFinished()) {
          diceValues[i].stableCount++;
        } else {
          diceValues[i].stableCount = 0;
        }
        
        if (diceValues[i].stableCount < 50) {
          allStable = false;
        }
      }
      
      if (allStable) {
        this.world.removeEventListener('postStep', check);
        
        for (let i = 0; i < diceValues.length; i++) {
          diceValues[i].dice.shiftUpperValue(diceValues[i].value);
          diceValues[i].dice.setVectors(diceValues[i].vectors);
          diceValues[i].dice.simulationRunning = false;
        }
        
        this.throwRunning = false;
      } else {
        this.world.step(this.world.dt);
      }
    };
    
    this.world.addEventListener('postStep', check);
  }
}