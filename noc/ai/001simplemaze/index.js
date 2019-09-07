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


function uiSychronization() {

  if (world ) {
    /*get the position of the sphere from cannon*/
    /* rectangle */


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
  /* left wall */
  const leftOptions = {};
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
  const backOptions = {};
  backOptions.position = {x: -70, y: -30, z: 0};
  backOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  backOptions.dimensions = {width: 1, height: 10, depth: 50};
  backOptions.mass = 0;
  backOptions.scene = scene;
  backOptions.world = world;
  backOptions.debugWorld = false;
  backOptions.material = bouncyMaterial;
  let back = dynamicCuboid(backOptions);
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
  walls()

  document.body.appendChild( renderer.domElement );
  draw();

});


sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
uiUpdateInterval = setInterval(uiSychronization, 30);
