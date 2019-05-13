let world, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh, cannonSphere, threeSphere, cannonFloor, threeFloor;

let world2, body2, shape2, camera2, scene2, renderer2, geometry2, material2, mesh2;

let framerate = 60;
let cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
let mass = 5, radius = 1;
let cannonElement;
let threeElement;
let theta = Math.PI;
let alpha = Math.PI;
let cameraDistance = 20;
let bottom = 10;



function setupCamera1() {
  camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 200 );
  camera.position.z = Math.sin(theta)*cameraDistance;
  camera.position.x = Math.cos(theta)*cameraDistance;
  camera.position.y = -10;
  camera.lookAt(new THREE.Vector3(0,0,0));
}

function setupCamera2() {
  camera2 = new THREE.PerspectiveCamera( 70, 1, 0.01, 200 );
  camera2.position.z = Math.sin(theta)*cameraDistance;
  camera2.position.x = Math.cos(theta)*cameraDistance;
  camera2.position.y = -10;
  camera2.lookAt(new THREE.Vector3(0,0,0));
}

function setupWorld1() {
  world = new CANNON.World();
  world.gravity.set(0,-4,0);
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

function addBox1() {
  var shape = new CANNON.Box(new CANNON.Vec3(radius,radius*.1,radius));
  var body = new CANNON.Body({ mass: 0 });
  cannonFloor = body;
  body.addShape(shape);
  body.position.set(0, -(radius + radius*.1),0);
  world.addBody(body);
}

function addBox2() {
  var shape = new THREE.BoxGeometry( radius*2, radius*2*.1, radius*2 );
  var mat = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh( shape, mat );
  threeFloor = mesh;
  mesh.position.set(0, -(radius + radius*.1), 0);
  scene2.add( mesh );
}

function addSphere1() {
  //var shape = new CANNON.Box(new CANNON.Vec3(radius,radius,radius));
  let shape = new CANNON.Sphere(radius); // Step 1
  var body = new CANNON.Body({ mass: .1 });
  cannonSphere = body;
  body.addShape(shape);
  body.position.set(0,3,0);
  world.addBody(body);
}

function addSphere2() {
  var shape = new THREE.SphereGeometry( radius, 32, 32 );
  var mat = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh( shape, mat );
  threeSphere = mesh;
  threeSphere.position.set(cannonSphere.position.x, cannonSphere.position.y, cannonSphere.position.z);
  scene2.add( mesh );
}

function draw1() {
  theta = theta + .01;
  alpha = alpha + .3;
  cannonFloor.position.y = Math.sin(alpha)*1 - bottom;
  // camera.position.z = Math.sin(theta)*cameraDistance;
  // camera.position.x = Math.cos(theta)*cameraDistance;
  // camera.lookAt(new THREE.Vector3(0,0,0));
  cannonDebugRenderer.update();
  renderer.render( scene, camera );
  requestAnimationFrame( draw1 );
}

function draw2() {
  threeFloor.position.set(cannonFloor.position.x, cannonFloor.position.y, cannonFloor.position.z);
  threeSphere.position.set(cannonSphere.position.x, cannonSphere.position.y, cannonSphere.position.z);
  // camera2.position.z = Math.sin(theta)*cameraDistance;
  // camera2.position.x = Math.cos(theta)*cameraDistance;
  // camera2.lookAt(new THREE.Vector3(0,0,0));
  renderer2.render( scene2, camera2 );
  requestAnimationFrame( draw2 );

}
let debug = false;



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
  addBox1();
  addSphere1();
  cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
  draw1();
}

function setup2() {
  threeElement = document.getElementById("cube");
  setupCamera2();
  setupWorld2();
  setupRenderer2();
  addBox2();
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
