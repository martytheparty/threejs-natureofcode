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
  subtract(vector) {
    this.x = this.x - vector.x;
    this.y = this.y - vector.y;
    this.z = this.z - vector.z;
  }
  clone(vector) {
    const myVec = new MVector(this.x, this.y, this.z);
    myVec.magnitude = this.magnitude;
    return myVec;
  }
  setMagnitute(magnitude) {
    this.magnitude = magnitude;
  }
}
