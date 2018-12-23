let camera, scene, renderer, geometry, material, mesh;

class Walker {
  constructor(scene, x = 0, y = 0, z = 0) {
    this.radius = 10;
    this.moved = false;
    this.x = x;
    this.y = y;
    this.z = z;
    this.scene = scene;
    this.geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.position.set(this.x, this.y, this.z);
  }

  walk() {

    const choice = Math.floor(Math.random()*this.radius);

    if (choice === 0) {
      this.x = this.x + this.radius*2;
    } else if (choice === 1) {
      this.x = this.x - this.radius*2;
    } else if (choice === 2) {
      this.y = this.y + this.radius*2;
    } else if (choice === 3) {
      this.y = this.y - this.radius*2;
    } else if (choice === 4) {
      this.y = this.z + this.radius*2;
    } else if (choice === 5) {
      this.y = this.z - this.radius*2;
    }

    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.rotation.x += 0.7;
    this.mesh.rotation.y += 0.7;
  }


}

let walkers = [];
const walker = new Walker(scene, 0, 0, 0);
walkers.push(walker);

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 400;
    //camera.position.y = 400;
    camera.lookAt(new THREE.Vector3(0,0,0));
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene.add( walker.mesh );


    draw();

}

function addNext() {
  const lastWalker = walkers[walkers.length - 1];
  const newWalker = new Walker(scene, lastWalker.x, lastWalker.y, lastWalker.z);
  scene.add( newWalker.mesh );
  walkers.push(newWalker);
  return newWalker;
}

setInterval( addNext, 100);


function draw() {
    const lastWalker = walkers[walkers.length - 1];
    //  console.log(walkers);
    if (!lastWalker.moved) {
      lastWalker.walk();
      lastWalker.moved = true;
      renderer.render( scene, camera );
    }

    requestAnimationFrame( draw );

}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
