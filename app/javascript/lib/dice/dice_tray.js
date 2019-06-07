import * as CANNON from 'cannon';
import * as THREE from 'three';

export default class DiceTray {
  constructor (scene, world, dimensions) {
    this.dicePools = []
    this.dimensions = dimensions
    this.world = world
    this.materials = {}
    
    this.setup()
  }
  
  // SETUP:
  
  setup () {
    this.setupWorld()
    this.setupScene()
    
    this.setupCamera()
    this.setupRenderer()
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
    let material = new THREE.MeshPhongMaterial( { color: 0x00aa00, side: THREE.DoubleSide } )
    let geometry = new THREE.PlaneGeometry(30, 30, 10, 10)
    let floor    = new THREE.Mesh(geometry, material)
    
    floor.receiveShadow  = true
    floor.rotation.x = Math.PI / 2
    
    let floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: this.materials.floor })
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    
    this.world.add(floorBody)
    this.scene.add(floor)
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
    let fov = 40
    let aspect = this.dimensions.width / this.dimensions.height
    let near = 1
    let far = (this.dimensions.height / aspect / Math.tan(10 * Math.PI / 180))
    
    let camera = this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, far / 20, 10)
    camera.up.set(0, 0, -1)
    camera.lookAt(0, 0, 0)
    
    this.scene.add(camera)
  }
  
  setupRenderer () {
    let renderer = this.renderer = new THREE.WebGLRenderer( {antialias:true} )
    renderer.setSize(this.dimensions.width, this.dimensions.height)
    renderer.setPixelRatio(this.dimensions.pixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }
  
  // RENDERING:
  
  animate () {
    if (this.scene) {
      this.render()
      requestAnimationFrame(this.animate.bind(this))
    }
  }
  
  render () {
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