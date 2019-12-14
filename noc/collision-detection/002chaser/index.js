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
let rotateX = 0;
let rotateY = 0;
let collisionDiv; 

let response = new SAT.Response();
let V = SAT.Vector;
let C = SAT.Circle;
let P = SAT.Polygon;
let collidedText = "";
const interiorOneOptions = {};
const westWall = {};
const eastWall = {};
const northWall = {};
const southWall = {};
const groundOptions = {};
const aaOptions = {};
let rotationRate = 3; // The speed the ball rotates 

const wallList = [];
const cuboids = [];
let satSet = false;
var circle;

document.addEventListener('keydown', changeDirection);

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
}


function changeDirection(e) {
  if (e.code === 'KeyS') {
    rotateX = -1*rotationRate;
    rotateY = 0;
  } else if (e.code === 'KeyA') {
    rotateX = rotationRate;
    rotateY = 0;
  } else if (e.code === 'KeyW') {
    rotateX = 0;
    rotateY = rotationRate;
  } else if (e.code === 'KeyZ') {
    rotateX = 0;
    rotateY = -1*rotationRate;
  } else {
    rotateX = 0;
    rotateY = 0;
  }
}

const updateSceneData = () => {
  if (world) world.step(1/60);
}

function uiSychronization() {
  if (world ) {
    /* rectangle */
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

    if (ge) {
      ge.three.position.x = ge.cannon.position.x;
      ge.three.position.y = ge.cannon.position.y;
      ge.three.position.z = ge.cannon.position.z;
      ge.three.quaternion.x = ge.cannon.quaternion.x;
      ge.three.quaternion.y = ge.cannon.quaternion.y;
      ge.three.quaternion.z = ge.cannon.quaternion.z;
      ge.three.quaternion.w = ge.cannon.quaternion.w;
    }
  }
}

function draw() {
  if (!collisionDiv) {
    collisionDiv = document.getElementById("status");
  }
  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer.render( scene, camera );
  requestAnimationFrame( draw );
  controls.update();
  collisionDiv.innerHTML = collidedText;
}

function floor() {
  groundOptions.position = {x: 0, y: -40, z: 0};
  groundOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  groundOptions.dimensions = {width: 300, height: 1, depth: 300};
  groundOptions.mass = 0;
  groundOptions.scene = scene;
  groundOptions.world = world;
  groundOptions.debugWorld = false;
  groundOptions.material = bouncyMaterial;
  let ground = dynamicCuboid(groundOptions);
  scene.add( ground.three );
}

function walls() {
  // interiorOneOptions.position = {x: -30, y: -30, z: 30};
  // interiorOneOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  // interiorOneOptions.dimensions = {width: 10, height: 10, depth: 10};
  // interiorOneOptions.mass = 0;
  // interiorOneOptions.scene = scene;
  // interiorOneOptions.world = world;
  // interiorOneOptions.debugWorld = false;
  // interiorOneOptions.material = bouncyMaterial;
  // let interiorOne = dynamicCuboid(interiorOneOptions);
  // cuboids.push(interiorOne);
  // scene.add( interiorOne.three );
  // wallList.push(interiorOneOptions);

  westWall.position = {x: 0, y: -35, z: 100};
  westWall.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  westWall.dimensions = {width: 100, height: 20, depth: 3};
  westWall.mass = 0;
  westWall.scene = scene;
  westWall.world = world;
  westWall.debugWorld = false;
  westWall.material = bouncyMaterial;
  let west = dynamicCuboid(westWall);
  cuboids.push(west);
  scene.add( west.three );
  wallList.push(westWall);

  eastWall.position = {x: 0, y: -35, z: -100};
  eastWall.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  eastWall.dimensions = {width: 100, height: 20, depth: 3};
  eastWall.mass = 0;
  eastWall.scene = scene;
  eastWall.world = world;
  eastWall.debugWorld = false;
  eastWall.material = bouncyMaterial;
  let east = dynamicCuboid(eastWall);
  cuboids.push(east);
  scene.add( east.three );
  wallList.push(eastWall);

  southWall.position = {x: 100, y: -35, z: 0};
  southWall.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  southWall.dimensions = {width: 3, height: 20, depth: 100};
  southWall.mass = 0;
  southWall.scene = scene;
  southWall.world = world;
  southWall.debugWorld = false;
  southWall.material = bouncyMaterial;
  let south = dynamicCuboid(southWall);
  cuboids.push(south);
  scene.add( south.three );
  wallList.push(southWall);

  northWall.position = {x: -100, y: -35, z: 0};
  northWall.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  northWall.dimensions = {width: 3, height: 20, depth: 100};
  northWall.mass = 0;
  northWall.scene = scene;
  northWall.world = world;
  northWall.debugWorld = false;
  northWall.material = bouncyMaterial;
  let north = dynamicCuboid(northWall);
  cuboids.push(north);
  scene.add( north.three );
  wallList.push(northWall);

}
let geOptions = {};
function goalEntity() {
  geOptions.position = {x: 30, y: -30, z: 0};
  geOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  geOptions.dimensions = {radius: 4};
  geOptions.mass = 100;
  geOptions.scene = scene;
  geOptions.world = world;
  geOptions.debugWorld = false;
  geOptions.material = groundMaterial;
  ge = dynamicSphere(geOptions);
  scene.add( ge.three );
}

function agent() {
  aaOptions.position = {x: 60, y: -30, z: 60};
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

function setupController() {
  let control = document.getElementById('c2d');
  control.addOnchangeListener(
    (pos) => { 
      rotateX = -1*Math.floor(pos.currentX)/10;
      rotateY = Math.floor(pos.currentY)/10;
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  setupController();
  setupPhysics();
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 10000 );
  controls = new THREE.OrbitControls( camera );
  camera.position.x = 200;
  camera.position.y = 60;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0,0,0));
  addCannonMaterials();
  floor();
  walls();
  agent();
  goalEntity();
  document.body.appendChild( renderer.domElement );
  draw();
});

/* SAT WALL*/
let ulx, uly, llx, lly, lrx, lry, urx, ury, middleWallPosition,middleWall;

function getWallPosition(options) {
  return position = new V(options.position.x, options.position.z);
}

function getWallCorners(options) {
  let corner = {};
  ulx = -1*options.dimensions.width;
  uly = 1*options.dimensions.depth;
  llx = -1*options.dimensions.width;
  lly = -1*options.dimensions.depth;
  lrx = 1*options.dimensions.width;
  lry = -1*options.dimensions.depth;
  urx = 1*options.dimensions.width;
  ury = 1*options.dimensions.depth;

  corner.ul = new V(ulx, uly);
  corner.ll = new V(llx, lly);
  corner.lr = new V(lrx, lry);
  corner.uu = new V(urx, ury);
  return corner;

}

function setupSatWalls() {
  wallList.forEach(
    (wall, i) => {
      const position = getWallPosition(wall);
      const corners = getWallCorners(wall);
      console.log( cuboids[i]);
      wall.satWall = cuboids[i].sat;
    }
  );
}


function checkForWallCollission() {
  /* SAT CIRCLE*/
  circle = new C(new V(aa.cannon.position.x,aa.cannon.position.z), aaOptions.dimensions.radius + 3);
  updateWallCollisions(circle);
  setCollisionText();

}

function updateWallCollisions(aa) {
  wallList.forEach(
    (wall, i) => {
      wall.collided = SAT.testPolygonCircle(cuboids[i].sat, aa, response);
    }
  );
}

function setCollisionText() {
  let collidedWalls = wallList.filter(
    (wall) => {
      return wall.collided;
    }
  )
  if (collidedWalls.length > 0) {
    collidedText = "TRUE";
  } else  {
    collidedText = "FALSE";
  }  
}

function chase() {
  let aaX  = aa.cannon.position.x;
  let aaZ = aa.cannon.position.z;

  let geX  = ge.cannon.position.x;
  let geZ = ge.cannon.position.z;

  let xDiff = aaX - geX;
  let zDiff = geZ - aaZ;

  rotateX = zDiff*.8;
  rotateY = xDiff*.8;
  
  console.log(`aaPosz ${aaZ} gePosz ${geZ} ${zDiff}`);
}

function uiSteering() {
  checkForWallCollission();
  chase();
  aa.cannon.angularVelocity.set(rotateX,0,rotateY);
  aa.cannon.angularDamping = 0.1;
}

sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
uiUpdateInterval = setInterval(uiSychronization, 30);
updateSteering = setInterval(uiSteering, 1000);