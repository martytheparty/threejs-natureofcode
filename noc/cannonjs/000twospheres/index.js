let world, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh;

let world2, body2, shape2, camera2, scene2, renderer2, geometry2, material2, mesh2;

let framerate = 60;
let cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
let mass = 5, radius = 1;
let cannonElement;
let threeElement;
let theta = Math.PI;



function setupCamera1() {
  camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 200 );
  camera.position.z = Math.sin(theta)*3;
  camera.position.x = Math.cos(theta)*3;
  camera.lookAt(new THREE.Vector3(0,0,0));
}

function setupCamera2() {
  camera2 = new THREE.PerspectiveCamera( 70, 1, 0.01, 200 );
  camera2.position.z = Math.sin(theta)*3;
  camera2.position.x = Math.cos(theta)*3;
  camera2.lookAt(new THREE.Vector3(0,0,0));
}

function setupWorld1() {
  world = new CANNON.World();
  world.gravity.set(0,0,-10);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;
}

function setupWorld2() {
  world2 = new CANNON.World();
  world2.gravity.set(0,0,-10);
  world2.broadphase = new CANNON.NaiveBroadphase();
  world2.solver.iterations = 10;
}

function setupRenderer1() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( cannon.offsetWidth, cannon.offsetHeight );
  cannonElement.appendChild( renderer.domElement );
}

function setupRenderer2() {
  scene2 = new THREE.Scene();
  renderer2 = new THREE.WebGLRenderer( { antialias: true } );
  renderer2.setSize( threeElement.offsetWidth, threeElement.offsetHeight );
  threeElement.appendChild( renderer2.domElement );
}

function addSphere1() {
  //var shape = new CANNON.Box(new CANNON.Vec3(radius,radius,radius));
  let shape = new CANNON.Sphere(radius); // Step 1
  var body = new CANNON.Body({ mass: 0 });
  body.addShape(shape);
  body.position.set(0,0,0);
  world.addBody(body);
}

function addSphere2() {
  var shape = new THREE.SphereGeometry( radius, 32, 32 );
  var mat = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh( shape, mat );
  mesh.position.set(0, 0, 0);
  scene2.add( mesh );
}

function draw1() {
  theta = theta + .01;
  camera.position.z = Math.sin(theta)*3;
  camera.position.x = Math.cos(theta)*3;
  camera.lookAt(new THREE.Vector3(0,0,0));
  cannonDebugRenderer.update();
  renderer.render( scene, camera );
  requestAnimationFrame( draw1 );
}

function draw2() {
  camera2.position.z = Math.sin(theta)*3;
  camera2.position.x = Math.cos(theta)*3;
  camera2.lookAt(new THREE.Vector3(0,0,0));
  renderer2.render( scene2, camera2 );
  requestAnimationFrame( draw2 );
}




function addSphere() {
  let sphereShape = new CANNON.Sphere(radius); // Step 1
  let sphereBody = new CANNON.Body({mass: 5, shape: sphereShape}); // Step 2
  sphereBody.position.set(-10,10,10);
  world.add(sphereBody); // Step 3
}

function setup1() {
  cannonElement = document.getElementById("cannon");
  setupCamera1();
  setupWorld1();
  setupRenderer1();
  addSphere1();
  cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
  draw1();
}

function setup2() {
  threeElement = document.getElementById("cube");
  setupCamera2();
  setupWorld2();
  setupRenderer2();
  addSphere2();
  draw2();
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



document.addEventListener("DOMContentLoaded", () => {
  setup1();
  setup2();

  document.onclick = () => {
    //addSphere();
  }
});
sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
