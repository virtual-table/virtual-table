import * as CANNON from 'cannon';
import * as THREE from 'three';

class DiceManagerSingleton {
  constructor() {
    this.world = null;
  }
  
  setWorld(world) {
    this.world = world;
    
    this.diceBodyMaterial = new CANNON.Material();
    this.floorBodyMaterial = new CANNON.Material();
    this.barrierBodyMaterial = new CANNON.Material();
    
    world.addContactMaterial(
      new CANNON.ContactMaterial(this.floorBodyMaterial, this.diceBodyMaterial, { friction: 0.01, restitution: 0.5 })
    );
    world.addContactMaterial(
      new CANNON.ContactMaterial(this.barrierBodyMaterial, this.diceBodyMaterial, { friction: 0, restitution: 1.0 })
    );
    world.addContactMaterial(
      new CANNON.ContactMaterial(this.diceBodyMaterial, this.diceBodyMaterial, { friction: 0, restitution: 0.5 })
    );
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
        DiceManager.world.removeEventListener('postStep', check);
        
        for (let i = 0; i < diceValues.length; i++) {
          diceValues[i].dice.shiftUpperValue(diceValues[i].value);
          diceValues[i].dice.setVectors(diceValues[i].vectors);
          diceValues[i].dice.simulationRunning = false;
        }
        
        this.throwRunning = false;
      } else {
        DiceManager.world.step(DiceManager.world.dt);
      }
    };
    
    this.world.addEventListener('postStep', check);
  }
}

const DiceManager = new DiceManagerSingleton()
export default DiceManager