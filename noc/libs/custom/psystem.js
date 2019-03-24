class MParticleSystem {
  constructor() {
    this.particles = [];
  }

  addParticle(radius, position) {
      let ball = new MParticle(radius, position);
      this.particles.push(ball);
      return ball;
  }

  getParticles() {
    return this.particles;
  }

  clearDeadParticles() {
    //console.log(`clear dead particles ${this.particles.length}`);

    this.particles = this.particles.filter(
      (ball) => {
        return !ball.isDead();
      }
    );
  }

  decrementTtl() {
    this.particles.forEach(
      (particle) => {
        particle.ttl = particle.ttl - 2;
      }
    );
  }

}
