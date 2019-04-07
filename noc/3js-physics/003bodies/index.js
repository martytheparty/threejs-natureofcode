
let world, mass, body1, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh1, mesh2;
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
    body1 = new CANNON.Body({
      mass: 1
    });
    body1.addShape(shape);
    body1.angularVelocity.set(10,10,10);
    body1.angularDamping = 0.5;
    world.add(body1);

}

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 5;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    geometry = new THREE.BoxGeometry( 1, 1, 1 );
    material = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );

    mesh1 = new THREE.Mesh( geometry, material );
    mesh1.position.set(-1,0,0);
    mesh2 = new THREE.Mesh( geometry, material );
    mesh2.position.set(1,0,0);
    console.log(mesh1.position);
    scene.add( mesh1 );
    scene.add( mesh2 );
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
      //mesh.position.copy(body1.position);
      mesh1.quaternion.copy(body1.quaternion);
      mesh2.quaternion.copy(body1.quaternion);
    }
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  initCannon();
  setup();
});

document.addEventListener("click", () => {
  let x = body1.angularVelocity.x + 10;
  let y = body1.angularVelocity.y + 10;
  let z = body1.angularVelocity.z + 10;

  body1.angularVelocity.set(x,y,z);
});
