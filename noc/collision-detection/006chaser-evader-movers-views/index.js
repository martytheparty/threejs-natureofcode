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
const bystanderList = [];

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

    bystanderList.forEach(
      (bs) => {
        bs.three.position.x = bs.cannon.position.x;
        bs.three.position.y = bs.cannon.position.y;
        bs.three.position.z = bs.cannon.position.z;
        bs.three.quaternion.x = bs.cannon.quaternion.x;
        bs.three.quaternion.y = bs.cannon.quaternion.y;
        bs.three.quaternion.z = bs.cannon.quaternion.z;
        bs.three.quaternion.w = bs.cannon.quaternion.w;
      }
    );
  }
}

function draw() {
  if (!collisionDiv) {
    collisionDiv = document.getElementById("status");
  }

  camera.lookAt(new THREE.Vector3(0,0,0));
  camera.position.x = 0;
  camera.position.y = 200;
  camera.position.z = 0;
  renderer.render( scene, camera );
  middleRenderer.render( scene, middleCamera );

  if(mainViewMode === "fixed") {
    camera.position.x = 0;
    camera.position.y = -30;
    camera.position.z = 100;
    camera.lookAt(new THREE.Vector3(0,0,0));
    renderer.render( scene, camera );
  }

  chaserCamera.lookAt(new THREE.Vector3(ge.three.position.x,ge.three.position.y,ge.three.position.z));
  chaserCamera.position.x = aa.three.position.x;
  chaserCamera.position.y = aa.three.position.y;
  chaserCamera.position.z = aa.three.position.z;
  chaserRenderer.render( scene, chaserCamera );

  if(mainViewMode === "chaser") {
    camera.position.x =  aa.three.position.x;
    camera.position.y =  aa.three.position.y;
    camera.position.z =  aa.three.position.z;
    camera.lookAt(new THREE.Vector3(ge.three.position.x,ge.three.position.y,ge.three.position.z));
    renderer.render( scene, camera );
  }

  evaderCamera.lookAt(new THREE.Vector3(aa.three.position.x,aa.three.position.y,aa.three.position.z));
  evaderCamera.position.x = ge.three.position.x;
  evaderCamera.position.y = ge.three.position.y;
  evaderCamera.position.z = ge.three.position.z;
  evaderRenderer.render( scene, evaderCamera );

  if(mainViewMode === "evader") {
    camera.position.x =  ge.three.position.x;
    camera.position.y =  ge.three.position.y;
    camera.position.z =  ge.three.position.z;
    camera.lookAt(new THREE.Vector3(aa.three.position.x,aa.three.position.y,aa.three.position.z));
    renderer.render( scene, camera );
  }

  requestAnimationFrame( draw );


  //controls.update();
  // collisionDiv.innerHTML = collidedText;
}

let ceilingOptions = {};

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

  ceilingOptions.position = {x: 0, y: -10, z: 0};
  ceilingOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  ceilingOptions.dimensions = {width: 300, height: 1, depth: 300};
  ceilingOptions.mass = 0;
  ceilingOptions.scene = scene;
  ceilingOptions.world = world;
  ceilingOptions.debugWorld = false;
  ceilingOptions.material = bouncyMaterial;
  let ceiling = dynamicCuboid(ceilingOptions);

}

function walls() {
  /*
  Adds the walls
   */

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
  geOptions.position = {x: 0, y: -30, z: 0};
  geOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  geOptions.dimensions = {radius: 9};
  geOptions.mass = 10;
  geOptions.scene = scene;
  geOptions.world = world;
  geOptions.debugWorld = false;
  geOptions.material = groundMaterial;
  geOptions.color = 16777215;
  ge = dynamicSphere(geOptions);
  scene.add( ge.three );
}

function agent() {
  aaOptions.position = {x: 60, y: -30, z: 60};
  aaOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  aaOptions.dimensions = {radius: 8};
  aaOptions.mass = 400;
  aaOptions.scene = scene;
  aaOptions.world = world;
  aaOptions.debugWorld = false;
  aaOptions.material = groundMaterial;
  aaOptions.color = 0;
  aa = dynamicSphere(aaOptions);
  scene.add( aa.three );
}

function byStanders() {
  let bystanderCount = 30;
  for (let i = 0; i < bystanderCount; i++) {
    let bsOptions = {};
    bsOptions.position = {
      x: Math.random(240)*100 - 60,
      y: -20,
      z: Math.random(240)*100 - 60
    };
    bsOptions.rotation = {x: 0, y: 0, z: 0};
    bsOptions.mass = 80;
    bsOptions.dimensions = { radius: 5};
    bsOptions.scene = scene;
    bsOptions.world = world;
    bsOptions.debugWorld = false;
    bsOptions.material = groundMaterial;
    let bs = dynamicSphere(bsOptions);
    scene.add( bs.three );
    bystanderList.push(bs);
  }

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

let middleRenderer;
let chaserRenderer;
let evaderRenderer;
let middleCamera;
let chaserCamera;
let evaderCamera;
let mainViewMode = "top";

function setupViewButtons() {

  const topViewButton = document.getElementById("topview-button");
  const fixedViewButton = document.getElementById("fixedview-button");
  const chaserViewButton = document.getElementById("chaserview-button");
  const evaderViewButton = document.getElementById("evaderview-button");
  topViewButton.onclick = () => {
    mainViewMode = "top";
  }

  fixedViewButton.onclick = () => {
    mainViewMode = "fixed";
  }

  chaserViewButton.onclick = () => {
    mainViewMode = "chaser";
  }

  evaderViewButton.onclick = () => {
    mainViewMode = "evader";
  }


}

document.addEventListener("DOMContentLoaded", () => {
  setupController();
  setupPhysics();
  setupViewButtons();

  const mainCanvas = document.getElementById("main-view");
  const middleView = document.getElementById("middle-view");
  const chaserView = document.getElementById("chaser-view");
  const evaderView = document.getElementById("evader-view");
  scene = new THREE.Scene();
  
  middleRenderer = new THREE.WebGLRenderer( { antialias: true, canvas: middleView } );
  chaserRenderer = new THREE.WebGLRenderer( { antialias: true, canvas: chaserView } );
  evaderRenderer = new THREE.WebGLRenderer( { antialias: true, canvas: evaderView } );

  let renderWidth = 0;
  let renderHeight = 0;
  if (window.innerWidth > window.innerHeight) {
    renderHeight = window.innerHeight*.75;
    renderWidth = window.innerHeight*.75;
  } else {
    renderHeight = window.innerWidth;
    renderWidth = window.innerWidth;
  }

  middleRenderer.setSize( renderWidth/3, renderHeight/3 );
  middleCamera = new THREE.PerspectiveCamera( 70, 1, 0.01, 1000 );
  middleCamera.position.x = 0;
  middleCamera.position.y = -30;
  middleCamera.position.z = 100;
  middleCamera.lookAt(new THREE.Vector3(0,0,0));

  chaserRenderer.setSize( renderWidth/3, renderHeight/3 );
  chaserCamera = new THREE.PerspectiveCamera( 70, 1, 0.01, 1000 );

  chaserCamera.position.x = 0;
  chaserCamera.position.y = -30;
  chaserCamera.position.z = 100;
  chaserCamera.lookAt(new THREE.Vector3(0,0,0));

  evaderRenderer.setSize( renderWidth/3, renderHeight/3 );
  evaderCamera = new THREE.PerspectiveCamera( 70, 1, 0.01, 1000 );
  evaderCamera.position.x = 0;
  evaderCamera.position.y = -30;
  evaderCamera.position.z = 100;
  evaderCamera.lookAt(new THREE.Vector3(0,0,0));


  renderer = new THREE.WebGLRenderer( { antialias: true, canvas: mainCanvas } );
  renderer.setSize(  renderWidth, renderHeight );
  camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 1000 );
  //controls = new THREE.OrbitControls( camera );
  camera.position.x = 0;
  camera.position.y = 200;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0,0,0));
  addCannonMaterials();
  floor();
  walls();
  agent();
  goalEntity();
  byStanders();
  //document.body.appendChild( renderer.domElement );
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
}

let geRotateX;
let geRotateY;

function evade() {
  let geX  = ge.cannon.position.x;
  let geZ = ge.cannon.position.z;

  let xDiff =  geX;
  let zDiff =  geZ;

  //console.log(`${xDiff} `);
  
  if (geX > 0) {
    geRotateX = 10;
  } else {
    geRotateX = -10;
  }

  if (geZ > 0) {
    geRotateY = -10;
  } else  {
    geRotateY = 10;
  }
}

function movers() {
  bystanderList.forEach(
    (bs, index) => {
      const val1 = Simplex.noise(index, moveCount)*300;
      const val2 = Simplex.noise(index + 1, moveCount)*300;
      bs.cannon.angularVelocity.set(val1,0,val2);
    }
  );
}

let moveCount = 0;

function uiSteering() {
  checkForWallCollission();
  chase()

  aa.cannon.angularVelocity.set(rotateX,0,rotateY);
  aa.cannon.angularDamping = 0.1;

  evade();
  ge.cannon.angularVelocity.set(geRotateX,0,geRotateY);
  ge.cannon.angularDamping = 0.1;

  movers();
  moveCount++;
}

sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
uiUpdateInterval = setInterval(uiSychronization, 30);
updateSteering = setInterval(uiSteering, 1000);