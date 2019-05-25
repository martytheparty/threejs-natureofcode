let world, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh, cannonSphere, threeSphere,
cannonFloor, threeFloor;

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

let threeBoxes = [];
let boxes = [];


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

function addBox() {
  let threeBox = addBox2();
  let cannonBox = addBox1();
  let box = { threeBox, cannonBox };
  boxes.push(box);
}

function addBox1() {
  var shape = new CANNON.Box(new CANNON.Vec3(radius,radius*.1,radius));
  var body = new CANNON.Body({ mass: 0 });

  body.addShape(shape);
  body.position.set(radius+radius*.2, -(radius + radius*.1),radius+radius*.2);
  world.addBody(body);
  return body;
}

function addBox2() {
  var shape = new THREE.BoxGeometry( radius*2, radius*2*.1, radius*2 );
  var mat = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh( shape, mat );
  threeFloor = mesh;
  scene2.add( mesh );
  return mesh;
}

function addGround1() {
  var shape = new CANNON.Box(new CANNON.Vec3(10,.1,10));
  var body = new CANNON.Body({ mass: 0 });
  body.addShape(shape);
  body.position.set(0, -11,0);
  world.addBody(body);
}

function leftWall1() {
  var shape = new CANNON.Box(new CANNON.Vec3(10,10,.1));
  var body = new CANNON.Body({ mass: 0 });
  body.addShape(shape);
  body.position.set(0,-1,-10);
  world.addBody(body);
}

function rightWall1() {
  var shape = new CANNON.Box(new CANNON.Vec3(10,10,.1));
  var body = new CANNON.Body({ mass: 0 });
  body.addShape(shape);
  body.position.set(0,-1,10);
  world.addBody(body);
}

function backWall1() {
  var shape = new CANNON.Box(new CANNON.Vec3(.1,10,10));
  var body = new CANNON.Body({ mass: 0 });
  body.addShape(shape);
  body.position.set(10,-1,0);
  world.addBody(body);
}

function frontWall1() {
  var shape = new CANNON.Box(new CANNON.Vec3(.1,10,10));
  var body = new CANNON.Body({ mass: 0 });
  body.addShape(shape);
  body.position.set(-10,-1,0);
  world.addBody(body);
}



function addGround2() {
  var shape = new THREE.BoxGeometry( 20, .2, 20 );
  var mat = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh( shape, mat );
  mesh.position.set(0, -11, 0);
  scene2.add( mesh );
}

function leftWall2() {
  var shape = new THREE.BoxGeometry( 20, 20, .2 );
  var mat = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh( shape, mat );
  mesh.position.set(0, -1, -10);
  scene2.add( mesh );
}

function rightWall2() {
  var shape = new THREE.BoxGeometry( 20, 20, .2 );
  var mat = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh( shape, mat );
  mesh.position.set(0, -1, 10);
  scene2.add( mesh );
}

function backWall2() {
  var shape = new THREE.BoxGeometry(.2,20,20);
  var mat = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh( shape, mat );
  mesh.position.set(10,-1,0);
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
  alpha = alpha + .6;
  boxes.forEach(
    (box) => {
      box.cannonBox.position.y = Math.sin(alpha)*2 - bottom;
    }
  );

  cannonDebugRenderer.update();
  renderer.render( scene, camera );
  requestAnimationFrame( draw1 );
}

function draw2() {

  boxes.forEach(
    (box) => {
      box.threeBox.position.set(boxes[0].cannonBox.position.x, box.cannonBox.position.y, box.cannonBox.position.z);
      //box.cannonBox.position.y = Math.sin(alpha)*2 - bottom;
    }
  );


  threeSphere.position.set(cannonSphere.position.x, cannonSphere.position.y, cannonSphere.position.z);
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

function setup() {
  cannonElement = document.getElementById("cannon");
  threeElement = document.getElementById("cube");

  setupCamera1();
  setupCamera2();

  setupWorld1();
  setupWorld2();

  setupRenderer1();
  setupRenderer2();

  // addBox1();
  // addBox2();
  addBox();

  addGround1();
  addGround2();

  leftWall1();
  leftWall2();

  rightWall1();
  rightWall2();

  backWall1();
  backWall2();

  frontWall1();
  addSphere1();

  cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
  addSphere2();

  draw1();
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
  setup();
  //setup2();

  document.onclick = () => {
    //addSphere();
  }
});
sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
