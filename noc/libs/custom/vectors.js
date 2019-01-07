class MVector {
  constructor(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.magnitude = 1;
  }
  add(vector) {
    this.x = this.x + vector.x;
    this.y = this.y + vector.y;
    this.z = this.z + vector.z;
  }
  setMagnitute(magnitude) {
    this.magnitude = magnitude;
  }
}
