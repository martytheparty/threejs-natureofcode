
let world, mass, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh;
let framerate = 60;

let spherePosition = new MVector(0,0,0);
let sphereVelocity = new MVector(0,0,0);
let sphereAcceleration = new MVector(0,0,0);
let ball = new MParticle(10, spherePosition);
ball.velocity = sphereVelocity;
ball.acceleration = sphereAcceleration;
ball.constraints = new MVector(200, 150, 150);

function initCannon() {
    world = new CANNON.World();
    world.gravity.set(0,0,0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
    mass = 1;
    body = new CANNON.Body({
      mass: 1
    });
    body.addShape(shape);
    body.angularVelocity.set(10,10,10);
    body.angularDamping = 0.5;
    world.add(body);

}

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 5;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    geometry = new THREE.BoxGeometry( 2, 2, 2 );
    material = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    draw();
}

const updateSceneData = () => {
  updatePhysics();
}

const updateFramerate = (newFrameRate) => {
  framerate = newFrameRate;
  clearInterval(sceneUpdateInterval);
  sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
}

function updatePhysics() {
    // Step the physics world
    world.step(timeStep);
}

let sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);

function draw() {

    if (ball.isDead()) {
      scene.remove(mesh);
    } else {
      // Copy coordinates from Cannon.js to Three.js
      mesh.position.copy(body.position);
      mesh.quaternion.copy(body.quaternion);
    }
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  initCannon();
  setup();
});

document.addEventListener("click", () => {
  let x = body.angularVelocity.x + 10;
  let y = body.angularVelocity.y + 10;
  let z = body.angularVelocity.z + 10;

  body.angularVelocity.set(x,y,z);
});
