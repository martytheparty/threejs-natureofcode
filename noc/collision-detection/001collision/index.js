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
const groundOptions = {};
const aaOptions = {};
let rotationRate = 3; // The speed the ball rotates 


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
  interiorOneOptions.position = {x: 0, y: -30, z: 0};
  interiorOneOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  interiorOneOptions.dimensions = {width: 10, height: 10, depth: 10};
  interiorOneOptions.mass = 0;
  interiorOneOptions.scene = scene;
  interiorOneOptions.world = world;
  interiorOneOptions.debugWorld = false;
  interiorOneOptions.material = bouncyMaterial;
  let interiorOne = dynamicCuboid(interiorOneOptions);
  scene.add( interiorOne.three );
}

function agent() {
  aaOptions.position = {x: 30, y: -30, z: 0};
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

function setupButtons() {
  let upButton = document.getElementById('up');
  upButton.onTouch = () => {
    rotateX = 0;
    rotateY = rotationRate;
    upButton.style = 'border: 3px solid blue;background-color:#ccc';
  }

  upButton.ontouchend = () => {
    rotateX = 0;
    rotateY = 0;
    upButton.style = ''
  }


  upButton.onmousedown = () => {
    rotateX = 0;
    rotateY = rotationRate;
    upButton.style = 'border: 3px solid blue;background-color:#ccc';
  }
  upButton.onmouseup = () => {
    rotateX = 0;
    rotateY = 0;
    upButton.style = '';
  }

  let downButton = document.getElementById('down');
  downButton.onmousedown = () => {
    rotateX = 0;
    rotateY = -1*rotationRate;
    downButton.style = 'border: 3px solid blue;background-color:#ccc';
  }
  downButton.onmouseup = () => {
    rotateX = 0;
    rotateY = 0;
    downButton.style = '';
  }

  let leftButton = document.getElementById('left');
  leftButton.onmousedown = () => {
    rotateX = rotationRate;
    rotateY = 0;
    leftButton.style = 'border: 3px solid blue;background-color:#ccc';
  }
  leftButton.onmouseup = () => {
    rotateX = 0;
    rotateY = 0;
    leftButton.style = '';
  }

  let rightButton = document.getElementById('right');
  rightButton.onmousedown = () => {
    rotateX = -1*rotationRate;
    rotateY = 0;
    rightButton.style = 'border: 3px solid blue;background-color:#ccc';
  }
  rightButton.onmouseup = () => {
    rotateX = 0;
    rotateY = 0;
    rightButton.style = '';
  }

}

document.addEventListener("DOMContentLoaded", () => {
  setupButtons();
  setupPhysics();
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 10000 );
  controls = new THREE.OrbitControls( camera );
  camera.position.x = 100;
  camera.position.y = 30;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0,0,0));
  addCannonMaterials();
  floor();
  walls();
  agent();
  document.body.appendChild( renderer.domElement );
  draw();
});

/* SAT WALL*/
let ulx, uly, llx, lly, lrx, lry, urx, ury, middleWallPosition,middleWall;

function checkForWallCollission() {
  /* SAT CIRCLE*/
  var circle = new C(new V(aa.cannon.position.x,aa.cannon.position.z), aaOptions.dimensions.radius + 3);

  if (!uly) {
    ulx = -1*interiorOneOptions.dimensions.width;
    uly = 1*interiorOneOptions.dimensions.depth;
    llx = -1*interiorOneOptions.dimensions.width;
    lly = -1*interiorOneOptions.dimensions.depth;
    lrx = 1*interiorOneOptions.dimensions.width;
    lry = -1*interiorOneOptions.dimensions.depth;
    urx = 1*interiorOneOptions.dimensions.width;
    ury = 1*interiorOneOptions.dimensions.depth;
    middleWallPosition = new V(interiorOneOptions.position.x,interiorOneOptions.position.z);

    middleWall = new P(middleWallPosition, [
      new V(ulx, uly),
      new V(llx, lly),
      new V(lrx, lry),
      new V(urx, ury)
    ]);
  }

  var collided = SAT.testPolygonCircle(middleWall, circle, response);
  if (collided) {
    collidedText = "TRUE";
  } else  {
    collidedText = "FALSE";
  }
}

function uiSteering() {
  checkForWallCollission();
  aa.cannon.angularVelocity.set(rotateX,0,rotateY);
  aa.cannon.angularDamping = 0.1;
}

sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
uiUpdateInterval = setInterval(uiSychronization, 30);
updateSteering = setInterval(uiSteering, 1000);