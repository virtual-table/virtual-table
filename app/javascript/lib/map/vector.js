class Vector {
  constructor (x = 0, y = 0) {
    if (x instanceof Array) {
      this.x = x[0]
      this.y = x[1]
    } else {
      this.x = x
      this.y = y
    }
  }
  
  add (vector) {
    return new Vector(this.x + vector.x, this.y + vector.y)
  }
  
  sub (vector) {
    return new Vector(this.x - vector.x, this.y - vector.y)
  }
  
  negate () {
    return new Vector(-this.x, -this.y)
  }
  
  mult (a, b) {
    if (typeof b == 'undefined') b = a
    return new Vector(this.x * a, this.y * b)
  }
  
  div (a, b) {
    if (typeof b == 'undefined') b = a
    return new Vector(this.x / a, this.y / b)
  }
  
  dot (vector) {
    return new Vector(this.x * vector.x, this.y * vector.y)
  }
  
  get len () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  
  get dir () {
    return Math.atan2(this.y, this.x)
  }
  
  clone () {
    return new Vector(this.x, this.y)
  }
  
  normalize () {
    let len = this.len
    if (this.len == 0) return new Vector(0, 0)
    return new Vector(this.x / len, this.y / len)
  }
}

Vector.fromDir = function(angle, mag) {
  mag = typeof mag === "number" ? mag : 1
  return new Vector(
    Math.cos(angle) * mag,
    Math.sin(angle) * mag
  )
}

export default Vector 