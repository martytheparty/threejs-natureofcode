let world, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
let cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
let mass = 5, radius = 1;

function setupCamera() {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 200 );
  camera.position.z = 10;
  camera.position.y = -20;
  camera.lookAt(new THREE.Vector3(0,0,0));
}

function setupWorld() {
  world = new CANNON.World();
  world.gravity.set(0,0,-10);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;
}

function setupRenderer() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}

function addGround() {
  let groundShape = new CANNON.Plane();
  let groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
  groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3(1,1,0), Math.PI/16 );
  world.add(groundBody);
}

function addSphere() {
  let sphereShape = new CANNON.Sphere(radius); // Step 1
  let sphereBody = new CANNON.Body({mass: 5, shape: sphereShape}); // Step 2
  sphereBody.position.set(-10,10,10);
  world.add(sphereBody); // Step 3
}

function setup() {
  setupCamera();
  setupWorld();
  setupRenderer();
  addGround();
  addSphere();
  cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
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
    world.step(timeStep);
}

function draw() {
  renderer.render( scene, camera );
  cannonDebugRenderer.update();
  requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();

  document.onclick = () => {
    addSphere();
  }
});
sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
