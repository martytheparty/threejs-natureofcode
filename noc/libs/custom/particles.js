class MParticle {
  constructor(radius, position) {
    this.radius = radius;
    this.position = position;
    this.velocity = new MVector(0,0,0);
    this.acceleration = new MVector(0,0,0);
    this.constraints = false;
    this.mass = 1;
    this.ttl = 1000;
  }

  applyForce(force) {
    let lForce = force.clone();
    this.acceleration.add(lForce.multiply(1/this.mass));
  }

  applyGravity(force) {
    /* special case of force that ignores mass */
    this.acceleration.add(force);
  }

  applyConstraintsToVelocity(implementsForce) {
    if (this.constraints) {

      if (this.position.x > this.constraints.x/2 || this.position.x < -this.constraints.x/2) {
        this.velocity.x = this.velocity.x*-1;
        if (!implementsForce) this.acceleration.x = this.acceleration.x*-1;
      }

      if (this.position.y > this.constraints.y/2 || this.position.y < -this.constraints.y/2) {
        this.velocity.y = this.velocity.y*-1;
        if (!implementsForce) this.acceleration.y = this.acceleration.y*-1;
      }

      if (this.position.z > this.constraints.z/2 || this.position.z < -this.constraints.z/2) {
        this.velocity.z = this.velocity.z*-1;
        if (!implementsForce) this.acceleration.z = this.acceleration.z*-1;
      }

      if (this.position.x > this.constraints.x/2) {
        this.position.x = this.constraints.x/2;
      }

      if (this.position.x < -this.constraints.x/2) {
        this.position.x = -this.constraints.x/2;
      }

      if (this.position.y > this.constraints.y/2) {
        this.position.y = this.constraints.y/2;
      }

      if (this.position.y < -this.constraints.y/2) {
        this.position.y = -this.constraints.y/2;
      }

      if (this.position.z > this.constraints.z/2) {
        this.position.z = this.constraints.z/2;
      }

      if (this.position.z < -this.constraints.z/2) {
        this.position.z = -this.constraints.z/2;
      }


    }
  }

}
