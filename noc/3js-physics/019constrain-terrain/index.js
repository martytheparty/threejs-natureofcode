let world, body, timeStep=1/60, camera, scene, renderer;
let framerate = 60;
let fallingSpheres = [];
let fallingCubes = [];
let springs = [];
let startPlatformPosition = 0;
let goalPlatformPosition = 0;
let currentPlatformPosition = 0;
let groundMaterial;
let bouncyMaterial;
let groundGroundContact;
let groundBouncyContact;
let bouncyBouncyContact;
let controls;
let cellbody;


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

    cellbody.three.position.x = cellbody.cannon.position.x;
    cellbody.three.position.y = cellbody.cannon.position.y;
    cellbody.three.position.z = cellbody.cannon.position.z;

    cellbody.three.quaternion.x = cellbody.cannon.quaternion.x;
    cellbody.three.quaternion.y = cellbody.cannon.quaternion.y;
    cellbody.three.quaternion.z = cellbody.cannon.quaternion.z;
    cellbody.three.quaternion.w = cellbody.cannon.quaternion.w;

    fallingSpheres.forEach(
      (sphere, i) => {
        sphere.three.position.x = sphere.cannon.position.x;
        sphere.three.position.y = sphere.cannon.position.y;
        sphere.three.position.z = sphere.cannon.position.z;

        /* if (z < -50) remove this from the array */
        if (sphere.three.position.y < -5000) {
          world.remove(fallingSpheres[i].cannon);
          scene.remove(fallingSpheres[i].three);
          fallingSpheres.splice(i, 1);
        }
      }
    );


  }
}

function draw() {
  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer.render( scene, camera );
  requestAnimationFrame( draw );
  controls.update();
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

  /*
  1. Add four static spheres
  2. Add a platform that is location constrained to the spheres
  */
  addCell();

  // addPlatforms();
  document.body.appendChild( renderer.domElement );
  draw();
  document.onclick = () => {
     addFallingSphere({x: 0,y: 20, z: 0}, {radius: 3}, 1);
  }
});

function addCell() {
  const cell = {};
  cell.cornerRadius = {radius: .1};
  cell.cornerDistance = 8;
  cell.constraintDistance = 8;
  cell.scene = scene;
  cell.world = world;

  /* Four static spheres and a thin rectangle that is constrained by location */
  /* TOP */
  cell.topOptions = {};

  cell.topOptions.position = {x: cell.cornerDistance,y: 0, z: 0};
  cell.topOptions.rotation = {x: 0, y: 0, z: 0};
  cell.topOptions.dimensions = cell.cornerRadius;
  cell.topOptions.mass = 0;
  cell.topOptions.scene = cell.scene;
  cell.topOptions.world = cell.world;
  cell.topOptions.debugWorld = false;
  cell.topOptions.material = groundMaterial;
  let topSphere = dynamicSphere(cell.topOptions);
  scene.add( topSphere.three );
  /* BOTTOM */
  cell.bottomOptions = {};
  cell.bottomOptions.position = {x: -1*cell.cornerDistance,y: 0, z: 0};
  cell.bottomOptions.rotation = {x: 0, y: 0, z: 0};
  cell.bottomOptions.dimensions = cell.cornerRadius;
  cell.bottomOptions.mass = 0;
  cell.bottomOptions.scene = cell.scene;
  cell.bottomOptions.world = cell.world;
  cell.bottomOptions.debugWorld = false;
  cell.bottomOptions.material = groundMaterial;
  let bottomSphere = dynamicSphere(cell.bottomOptions);
  scene.add( bottomSphere.three );
  /* LEFT */
  cell.leftOptions = {};
  cell.leftOptions.position = {x: 0,y: 0, z: -1*cell.cornerDistance};
  cell.leftOptions.rotation = {x: 0, y: 0, z: 0};
  cell.leftOptions.dimensions = cell.cornerRadius;
  cell.leftOptions.mass = 0;
  cell.leftOptions.scene = cell.scene;
  cell.leftOptions.world = cell.world;
  cell.leftOptions.debugWorld = false;
  cell.leftOptions.material = groundMaterial;
  let leftSphere = dynamicSphere(cell.leftOptions);
  scene.add( leftSphere.three );
  /* RIGHT */
  cell.rightOptions = {};
  cell.rightOptions.position = {x: 0,y: 0, z: cell.cornerDistance};
  cell.rightOptions.rotation = {x: 0, y: 0, z: 0};
  cell.rightOptions.dimensions = cell.cornerRadius;
  cell.rightOptions.mass = 0;
  cell.rightOptions.scene = cell.scene;
  cell.rightOptions.world = cell.world;
  cell.rightOptions.debugWorld = false;
  cell.rightOptions.material = groundMaterial;
  let rightSphere = dynamicSphere(cell.rightOptions);
  scene.add( rightSphere.three );

  /* rectangle */
  const bodyOptions = {};
  bodyOptions.position = {x: 0, y: 0, z: 0};
  bodyOptions.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  bodyOptions.dimensions = {width: (cell.cornerDistance - 1), height: 1, depth: (cell.cornerDistance - 1)};
  bodyOptions.mass = 10000;
  bodyOptions.scene = cell.scene;
  bodyOptions.world = cell.world;
  bodyOptions.debugWorld = false;
  bodyOptions.material = bouncyMaterial;
  cellbody = dynamicCuboid(bodyOptions);
  scene.add( cellbody.three );

  fallingCubes.unshift(cellbody);


  world.addConstraint(new CANNON.DistanceConstraint(rightSphere.cannon,cellbody.cannon,cell.constraintDistance));
  world.addConstraint(new CANNON.DistanceConstraint(leftSphere.cannon,cellbody.cannon,cell.constraintDistance));
  world.addConstraint(new CANNON.DistanceConstraint(bottomSphere.cannon,cellbody.cannon,cell.constraintDistance));
  world.addConstraint(new CANNON.DistanceConstraint(topSphere.cannon,cellbody.cannon,cell.constraintDistance));
}

function addFallingSphere(intialPosition, initialDimensions, mass) {
  let maxCount = 10;
  let options = {};
  options.position = {x: 0,y: 130, z: 0};
  options.rotation = {x: 0, y: 0, z: 0};
  options.dimensions = initialDimensions;
  options.mass = 100;
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;
  options.material = groundMaterial;
  let sphere = dynamicSphere(options);



  if (fallingCubes.length < 100) {

    scene.add( sphere.three );
    fallingSpheres.unshift(sphere);


  }

}


sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
uiUpdateInterval = setInterval(uiSychronization, 30);
