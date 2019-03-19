import _ from 'underscore'
import PIXI from 'lib/pixi'
import Vector from 'lib/map/vector'

const DEFAULT_OPTIONS = {
  lightRadius: 200,
  width:  50,
  height: 50
}

export default class {
  
  get origin ()  { return this._origin }
  set origin (v) { this._origin = new Vector(v) }
  
  get obstacles ()  { return this._obstacles }
  set obstacles (v) {
    this._obstacles = v
    this.preprocess()
  }
  
  get lightPolygon () {
    let radius  = this.options.lightRadius
    let xRadius = radius + this.options.width / 2
    let yRadius = radius + this.options.height / 2
    let steps   = this.options.lightRadius / 50 * 4
    let path    = []
    
    let x = this.origin.x
    let y = this.origin.y
    
    for (var i = 0; i < steps; i++) {
      let r = Math.PI * i / steps
      path.push([
        (x + xRadius * Math.cos(2 * r)),
        (y + yRadius * Math.sin(2 * r))
      ])
    }
    
    path.push(path[0])
    
    return new PIXI.Polygon(path)
  }
  
  constructor (origin, obstacles, options = {}) {
    this.options   = _.extend(DEFAULT_OPTIONS, options)
    this.origin    = origin
    this.obstacles = obstacles
    
    this.preprocess()
  }
  
  preprocess () {
    this.vertices = _.flatten(
      this.obstacles.map((poly) => poly.points.map((point) => new Vector(point)))
    )
  }
  
  drawLight (graphics) {
    graphics.drawPolygon(_.flatten(this.lightPolygon.points))
  }
  
  drawVision (graphics) {
    for (let polygon of this.cast()) {
      this.drawPoints(graphics, polygon.points)
    }
  }
  
  drawPoints (graphics, points) {
    graphics.moveTo(points[points.length-1].x, points[points.length-1].y)
    for (var i=0; i<points.length; i++) graphics.lineTo(points[i].x, points[i].y)
  }
  
  cast () {
    let angles = _.flatten(
      _.uniq(
        this.vertices.map((vector) => vector.sub(this.origin).dir)
      ).map(
        (angle) => [angle - 0.00001, angle, angle + 0.00001]
      )
    ).sort()
    
    let intersections = []
    let visiblePolys  = []
    
    for (let dir of angles) {
      let min = null
      let minPoly = null
      
      for (let polygon of this.obstacles) {
        for (var i = 0, j = polygon.points.length; i<j; i++) {
          var pointA = new Vector(polygon.points[i])
          var pointB = new Vector(polygon.points[(i+1)%j])
          var result = this.rayLineIntersect(
            this.origin, Vector.fromDir(dir), pointA, pointB
          )
          
          if (result !== null) {
            if (min === null || result.param < min.param) {
              min = result
              minPoly = polygon
            }
          }
        }
      }
      
      if (min !== null) {
        intersections.push(new Vector(min.x, min.y))
        
        if (!visiblePolys.includes(minPoly)) visiblePolys.push(minPoly)
      }
    }
    
    // sort intersections by angle
    intersections.sort((a,b) => a.sub(this.origin).dir - b.sub(this.origin).dir)
    
    // construct polygon representing vision
    visiblePolys.push(new PIXI.Polygon(intersections))
    
    return visiblePolys
  }
  
  rayLineIntersect (rayPoint, rayDir, pointA, pointB) {
    var segDx = pointB.sub(pointA);
    if (rayDir.dir === segDx.dir) return null;
    
    //do math
    var T2 = (rayDir.x * (pointA.y - rayPoint.y) + rayDir.y * (rayPoint.x - pointA.x));
    T2 /= (segDx.x*rayDir.y - segDx.y*rayDir.x);
    var T1 = (pointA.x + segDx.x * T2 - rayPoint.x) / rayDir.x;
    
    //determine intersection
    if (T1<0)
      return null;
    if (T2<0 || T2>1)
      return null;
    
    // Return the POINT OF INTERSECTION
    return {
      x: rayPoint.x+rayDir.x*T1,
      y: rayPoint.y+rayDir.y*T1,
      param: T1
    };
  }
}