let world, body, timeStep=1/60, camera, scene, renderer;
let framerate = 60;
let fallingSpheres = [];
let fallingCubes = [];
let groundMaterial;
let bouncyMaterial;
let groundGroundContact;
let groundBouncyContact;
let bouncyBouncyContact;
let controls;
let aa;
/* Walls */
let back;
let backOptions;
let leftOptions;
let collisionXRotation = 0;
let collisionZRotation = 0;

//renderSurfaceObjects();

const setupPhysics = () => {
  world = new CANNON.World();
  world.gravity.set(0,-1,0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 100;
  world.solver.tolerance = 0;
};

addCannonMaterials = () => {

  groundMaterial = new CANNON.Material("groundMaterial");
  bouncyMaterial = new CANNON.Material("bouncyMaterial");

  /*
  set up contact materials
  1. groundMaterial -> groundMaterial
  2. groundMaterial -> bouncyMaterial
  3. bouncyMaterial -> bouncyMaterial
  */

  let gg = {
    friction: 0.4,
    restitution: 0.1,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3
  };

  let gb = {
    friction: 0,
    restitution: 0.9,
    contactEquationStiffness: 0,
    contactEquationRelaxation: .3,
    frictionEquationStiffness: 0,
    frictionEquationRegularizationTime: .3
  };

  let bb = {
    friction: 0.1,
    restitution: 0.6,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3
  };


  groundGroundContact = new CANNON.ContactMaterial(groundMaterial, groundMaterial, gg);
  groundBouncyContact = new CANNON.ContactMaterial(groundMaterial, bouncyMaterial, gb);
  bouncyBouncyContact = new CANNON.ContactMaterial(bouncyMaterial, bouncyMaterial, bb);



  // createCannonMaterial();
}


const updateSceneData = () => {
  if (world) world.step(1/60);
}

var axis = new CANNON.Vec3(1,0,0);
var angle = Math.PI / 3;


function uiSychronization() {

  if (world ) {
    if (aa) {
      /*get the position of the aa from cannon*/
      aa.three.position.x = aa.cannon.position.x;
      aa.three.position.y = aa.cannon.position.y;
      aa.three.position.z = aa.cannon.position.z;

      aa.three.quaternion.x = aa.cannon.quaternion.x;
      aa.three.quaternion.y = aa.cannon.quaternion.y;
      aa.three.quaternion.z = aa.cannon.quaternion.z;
      aa.three.quaternion.w = aa.cannon.quaternion.w;

    }
  }
}

function draw() {
  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer.render( scene, camera );
  requestAnimationFrame( draw );
  controls.update();
}

function drawFloor() {
  /* draw a path */
  const floorOptions = {};
  floorOptions.position = {x: -20, y: -40, z: 0};
  floorOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  floorOptions.dimensions = {width: 50, height: 1, depth: 50};
  floorOptions.mass = 0;
  floorOptions.scene = scene;
  floorOptions.world = world;
  floorOptions.debugWorld = false;
  floorOptions.material = bouncyMaterial;
  let floor = dynamicCuboid(floorOptions);
  scene.add( floor.three );
}

function walls() {
  /* collision building wall */
  leftOptions = {};
  leftOptions.position = {x: -20, y: -30, z: 49};
  leftOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  leftOptions.dimensions = {width: 50, height: 10, depth: 1};
  leftOptions.mass = 0;
  leftOptions.scene = scene;
  leftOptions.world = world;
  leftOptions.debugWorld = false;
  leftOptions.material = bouncyMaterial;
  let left = dynamicCuboid(leftOptions);
  scene.add( left.three );

  /* right wall */
  const rightOptions = {};
  rightOptions.position = {x: -20, y: -30, z: -49};
  rightOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  rightOptions.dimensions = {width: 50, height: 10, depth: 1};
  rightOptions.mass = 0;
  rightOptions.scene = scene;
  rightOptions.world = world;
  rightOptions.debugWorld = false;
  rightOptions.material = bouncyMaterial;
  let right = dynamicCuboid(rightOptions);
  scene.add( right.three );

  /* back wall */
  backOptions = {};
  backOptions.position = {x: -70, y: -30, z: 0};
  backOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  backOptions.dimensions = {width: 1, height: 10, depth: 50};
  backOptions.mass = 0;
  backOptions.scene = scene;
  backOptions.world = world;
  backOptions.debugWorld = false;
  backOptions.material = bouncyMaterial;
  back = dynamicCuboid(backOptions);
  scene.add( back.three );

  /* front wall */
  const frontOptions = {};
  frontOptions.position = {x: 30, y: -30, z: 0};
  frontOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  frontOptions.dimensions = {width: 1, height: 10, depth: 50};
  frontOptions.mass = 0;
  frontOptions.scene = scene;
  frontOptions.world = world;
  frontOptions.debugWorld = false;
  frontOptions.material = bouncyMaterial;
  let front = dynamicCuboid(frontOptions);
  scene.add( front.three );

  /* interior wall One */
  const interiorOneOptions = {};
  interiorOneOptions.position = {x: -40, y: -30, z: 10};
  interiorOneOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  interiorOneOptions.dimensions = {width: 1, height: 10, depth: 40};
  interiorOneOptions.mass = 0;
  interiorOneOptions.scene = scene;
  interiorOneOptions.world = world;
  interiorOneOptions.debugWorld = false;
  interiorOneOptions.material = bouncyMaterial;
  let interiorOne = dynamicCuboid(interiorOneOptions);
  scene.add( interiorOne.three );

  /* interior wall Two */
  const interiorTwoOptions = {};
  interiorTwoOptions.position = {x: 0, y: -30, z: -10};
  interiorTwoOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  interiorTwoOptions.dimensions = {width: 1, height: 10, depth: 40};
  interiorTwoOptions.mass = 0;
  interiorTwoOptions.scene = scene;
  interiorTwoOptions.world = world;
  interiorTwoOptions.debugWorld = false;
  interiorTwoOptions.material = bouncyMaterial;
  let interiorTwo = dynamicCuboid(interiorTwoOptions);
  scene.add( interiorTwo.three );

}

function mover() {

  const aaOptions = {};
  aaOptions.position = {x: -55, y: -30, z: 0};
  aaOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  aaOptions.dimensions = {radius: 5};
  aaOptions.mass = 100;
  aaOptions.scene = scene;
  aaOptions.world = world;
  aaOptions.debugWorld = false;
  aaOptions.material = groundMaterial;
  aa = dynamicSphere(aaOptions);
  scene.add( aa.three );
}

document.addEventListener("DOMContentLoaded", () => {
  setupPhysics();

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 10000 );
  controls = new THREE.OrbitControls( camera );
  camera.position.x = 100;
  camera.position.y = 10;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0,0,0));
  // cannonMaterials
  addCannonMaterials();

  drawFloor();
  walls();
  mover();

  document.body.appendChild( renderer.domElement );
  draw();

});

let rotateX = 0;
let rotateY = 0;

/*
 * listen for arrow keys
 */

document.addEventListener('keydown', changeDirection);

function changeDirection(e) {

  if (e.code === 'ArrowRight') {
    rotateX = -100;
    rotateY = 0;
  } else if (e.code === 'ArrowLeft') {
    rotateX = 100;
    rotateY = 0;
  } else if (e.code === 'ArrowUp') {
    rotateX = 0;
    rotateY = 100;
  } else if (e.code === 'ArrowDown') {
    rotateX = 0;
    rotateY = -100;
  } else if (e.code === 'KeyS') {
    showData = true;
  } else {
    rotateX = 0;
    rotateY = 0;
  }
  //console.log(e.code);

}

function wander() {
  // let x = Math.random() * 200 - 100;
  // let y = Math.random() * 200 - 100;
  // let z = Math.random() * 200 - 100;
  let x = rotateX;
  let y = 0;
  let z = rotateY;
  return {x, y, z};
}

function respond() {
  let x = collisionXRotation;
  let y = 0;
  let z = collisionZRotation;
  return {x, y, z};
}

let showData = false;
let lastShowData = false;

function impendingWallCollision() {
  collisionXRotation = 0;
  collisionZRotation = 0;
  let radius = aa.cannon.boundingRadius;
  /* Check Back Wall */

// https://www.npmjs.com/package/sat


  // Create a box at (10,10) with width 20 and height 40.
  // var b = new SAT.Box(new SAT.Vector(10,10), 20, 40);

  // Create a circle whose center is (10,10) with radius of 20
  // var c = new SAT.Circle(new SAT.Vector(10,10), 20);


  //  console.log(`back option x - ${backOptions.position.x} y - ${backOptions.position.y} `);
  // backOptions.dimensions = {width: 1, height: 10, depth: 50}

  var V = SAT.Vector;
  var C = SAT.Circle;
  var P = SAT.Polygon;

  let backWallPosition = new V(backOptions.position.x,backOptions.position.y);

  // backOptions.position = {x: -70, y: -30, z: 0};
  // backOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  // backOptions.dimensions = {width: 1, height: 10, depth: 50};

  var backWall = new P(backWallPosition, [
    new V(0, 0),
    new V(backOptions.dimensions.height, 0),
    new V(backOptions.dimensions.height, backOptions.dimensions.depth),
    new V(0, backOptions.dimensions.depth)
  ]);

  var circle = new SAT.Circle(new SAT.Vector(aa.cannon.position.x, aa.cannon.position.y), radius);
  //debugger
  var response = new SAT.Response();
  let collissionDetected = false;
  var collided = SAT.testPolygonCircle(backWall, circle, response);
  if (collided){
    collisionZRotation = -300;
    collissionDetected = true;
  }

// leftOptions

// leftOptions.position = {x: -20, y: -30, z: 49};
// leftOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
// leftOptions.dimensions = {width: 50, height: 10, depth: 1};
// -55, 42
//console.log(aa.cannon.position.x, aa.cannon.position.z);
  let leftWallPosition = new V(leftOptions.position.x, leftOptions.position.z);
  var leftWall = new P(leftWallPosition, [
    new V(0, 0),
    new V(0, leftOptions.dimensions.width),
    new V(leftOptions.dimensions.depth, leftOptions.dimensions.width),
    new V(leftOptions.dimensions.depth, 0)
  ]);
  var response1 = new SAT.Response();

  collided = SAT.testPolygonCircle(leftWall, circle, response1);
  if (collided){
    collisionXRotation = 300;
    collissionDetected = true;
    console.log('LEFT WALL COLLISION');
  }


  return collissionDetected;

}
function uiSteering() {
  let radius = aa.cannon.boundingRadius + 2;
  // console.log('x:' + aa.cannon.position.x);
  // console.log('z:' +aa.cannon.position.z);

  /*
  * 1. Check if it in the walls
  * 2. Check if it is near the interiorOne wall
  * 3. Check if it is near the interiorTwo wall
  */



  let pos = {x: 0, y: 0, z: 0};
  if (impendingWallCollision()) {
    //pos = wander();
    pos = respond();
  } else {

  }

  pos = wander();

  aa.cannon.angularVelocity.set(pos.x,pos.y,pos.z);
  aa.cannon.angularDamping = 0.1;
}



sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
uiUpdateInterval = setInterval(uiSychronization, 30);
updateSteering = setInterval(uiSteering, 100);
