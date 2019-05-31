import * as CANNON from 'cannon';
import * as THREE from 'three';

export default class DiceTray {
  constructor (scene, world) {
    this.dicePools = []
    this.scene = scene
    this.world = world
    this.materials = {}
    
    this.setup()
  }
  
  setup () {
    let { world, scene } = this
    
    let diceMaterial  = this.materials.dice  = new CANNON.Material()
    let floorMaterial = this.materials.floor = new CANNON.Material()
    let wallMaterial  = this.materials.wall  = new CANNON.Material()
    
    world.addContactMaterial(new CANNON.ContactMaterial(floorMaterial, diceMaterial, { friction: 0.01, restitution: 0.5 }))
    world.addContactMaterial(new CANNON.ContactMaterial(wallMaterial,  diceMaterial, { friction: 0,    restitution: 1.0 }))
    world.addContactMaterial(new CANNON.ContactMaterial(diceMaterial,  diceMaterial, { friction: 0,    restitution: 0.5 }))
    
    let material = new THREE.MeshPhongMaterial( { color: 0x00aa00, side: THREE.DoubleSide } )
    let geometry = new THREE.PlaneGeometry(30, 30, 10, 10)
    let floor    = new THREE.Mesh(geometry, material)
    
    floor.receiveShadow  = true
    floor.rotation.x = Math.PI / 2
    
    let floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: floorMaterial })
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    
    world.add(floorBody)
    scene.add(floor)
  }
  
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