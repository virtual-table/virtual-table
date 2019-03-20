import _ from 'underscore'
import { Room, Block, Segment, Point } from './types'
import { loadMap } from './loadMap'
import { calculateVisibility } from './visibility'

const spreadMap =
  (cb) => (array2d) =>
    array2d.map(array1d => cb(...array1d));

const makeSegments = spreadMap(Segment)
const makeBlocks = spreadMap(Block);

const DEFAULT_OPTIONS = {
  lightRadius: 200,
  width:  50,
  height: 50
}

export default class {
  
  get origin ()  { return this._origin }
  set origin (v) { this._origin = Point(v[0], v[1])}
  
  get blocks ()  { return this._blocks }
  set blocks (v) { this._blocks = makeBlocks(v) }
  
  get obstacles ()  { return this._obstacles }
  set obstacles (v) {
    this.room = this.pointsToRoom(v.shift().points)
    this._obstacles = v
    this.preprocess()
  }
  
  get lightWalls () {
    let radius  = this.options.lightRadius
    let xRadius = radius + this.options.width  / 2
    let yRadius = radius + this.options.height / 2
    let steps   = this.options.lightRadius / 50 * 12
    let points  = []
    
    let x = this.origin.x
    let y = this.origin.y
    
    for (var i = 0; i < steps; i++) {
      let r = Math.PI * i / steps
      points.push([
        (x + xRadius * Math.cos(2 * r)),
        (y + yRadius * Math.sin(2 * r))
      ])
    }
    
    points.push(points[0])
    
    return this.pointsToWalls(points)
  }
  
  constructor (origin, obstacles, options = {}) {
    this.options   = _.extend(DEFAULT_OPTIONS, options)
    this.origin    = origin
    this.obstacles = obstacles
    
    this.preprocess()
  }
  
  pointsToRoom (points) {
    const topLeft     = points[0]
    const bottomRight = points[2]
    
    return Room(topLeft[0], topLeft[1], bottomRight[0], bottomRight[1])
  }
  
  pointsToWalls (points) {
    let walls = []
    
    for (let i = 0; i < points.length; i++) {
      let point     = points[i]
      let nextPoint = points[i + 1]
      if (nextPoint) {
        walls.push([point[0], point[1], nextPoint[0], nextPoint[1]])
      }
    }
    
    return walls
  }
  
  preprocess () {
    let walls = []
    for (let obstacle of this.obstacles) {
      walls = walls.concat(this.pointsToWalls(obstacle.points))
    }
    this.walls = walls
  }
  
  cast () {
    const walls = this.walls.concat(this.lightWalls)
    const endpoints = loadMap(this.room, [], makeSegments(walls), this.origin)
    return calculateVisibility(this.origin, endpoints)
  }
  
  drawLight (graphics) {
    let walls = this.lightWalls
    for (let [ax, ay, bx, by] of walls) {
      graphics.moveTo(ax, ay).lineTo(bx, by)
    }
  }
  
  drawVision (graphics) {
    this.drawVisibilityTriangles(graphics, this.cast())
  }
  
  drawVisibilityTriangles (graphics, output) {
    for (var i = 0; i < output.length; i += 1) {
      let [p1, p2] = output[i]
      
      graphics.moveTo(this.origin.x, this.origin.y)
      graphics.lineTo(p1.x, p1.y)
      graphics.lineTo(p2.x, p2.y)
    }
  }
}