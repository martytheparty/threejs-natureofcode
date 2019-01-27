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
    this.x = isNaN(this.x) ? 0 : this.x;
    this.y = isNaN(this.y) ? 0 : this.y;
    this.z = isNaN(this.z) ? 0 : this.z;
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
  multiply(factor) {
    const localVec = new MVector(this.x*factor, this.y*factor, this.z*factor);
    return localVec;
  }
  normalize() {
    let totalLength = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    if (totalLength === 0) {
      totalLength = 1;
    }
    const localVec = new MVector(this.x/totalLength, this.y/totalLength, this.z/totalLength);

    this.x = this.x/totalLength;
    this.y = this.y/totalLength;
    this.z = this.z/totalLength;

    return localVec;
  }
  setMagnitute(magnitude) {
    this.magnitude = magnitude;
  }
  random() {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    let z = Math.floor(Math.random() * 10);

    let ux = x/Math.sqrt(x*x + y*y + z*z);
    let uy = y/Math.sqrt(x*x + y*y + z*z);
    let uz = z/Math.sqrt(x*x + y*y + z*z);

    ux = ux*(x%2==0 ? 1 : -1);
    uy = uy*(y%2==0 ? 1 : -1);
    uz = uz*(z%2==0 ? 1 : -1);

    this.x = ux;
    this.y = uy;
    this.z = uz;

    return (new MVector(ux, uy, uz));

  }

  normalDistribution() {
    function getRandom() {
      let random = Math.floor(Math.random() * 10);
      random = random * (random%2==0 ? 1 : -1);
      return random;
    }

    function getNormalDistribution() {
      let norm = 0;
      for (let i = 0; i < 6; i++) {
        norm = norm + getRandom();
      }

      return norm/6;
    }

    let x = getNormalDistribution();
    let y = getNormalDistribution();
    let z = getNormalDistribution();

    let ux = x/Math.sqrt(x*x + y*y + z*z);
    let uy = y/Math.sqrt(x*x + y*y + z*z);
    let uz = z/Math.sqrt(x*x + y*y + z*z);

    this.x = ux;
    this.y = uy;
    this.z = uz;

    return (new MVector(ux, uy, uz));

  }

  perlinDistribution(i, count) {






    function getPerlinNoise(pos) {
      return  Simplex.noise(pos, count);
    }

    let x = getPerlinNoise(10*i + 1);
    let y = getPerlinNoise(10*i + 2);
    let z = getPerlinNoise(10*i + 3);

    let ux = x/Math.sqrt(x*x + y*y + z*z);
    let uy = y/Math.sqrt(x*x + y*y + z*z);
    let uz = z/Math.sqrt(x*x + y*y + z*z);

    this.x = ux;
    this.y = uy;
    this.z = uz;

    return (new MVector(ux, uy, uz));

  }


}
