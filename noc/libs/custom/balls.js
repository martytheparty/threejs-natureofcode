class MBall {
  constructor(radius, position) {
    this.radius = radius;
    this.position = position;
    this.velocity = new MVector(0,0,0);
    this.constraints = false;
  }

}
