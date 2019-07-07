let world, body, timeStep=1/60, camera, scene, renderer;
let framerate = 60;
let fallingSpheres = [];
let startPlatformPosition = 0;
let groundMaterial;
let bouncyMaterial;
let groundGroundContact;
let groundBouncyContact;
let bouncyBouncyContact;


const setupPhysics = () => {
  world = new CANNON.World();
  world.gravity.set(0,-10,0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 20;
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
    restitution: 0.3,
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
  if (world && typeof platform !== 'undefined') {
    platform.three.quaternion.x = platform.cannon.quaternion.x;
    platform.three.quaternion.y = platform.cannon.quaternion.y;
    platform.three.quaternion.z = platform.cannon.quaternion.z;
    platform.three.quaternion.w = platform.cannon.quaternion.w;
    fallingSpheres.forEach(
      (sphere, i) => {
        sphere.three.position.x = sphere.cannon.position.x;
        sphere.three.position.y = sphere.cannon.position.y;
        sphere.three.position.z = sphere.cannon.position.z;

        /* if (z < -50) remove this from the array */
        if (sphere.three.position.y < -50) {
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
}

document.addEventListener("DOMContentLoaded", () => {
  setupPhysics();

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 200 );
  camera.position.x = 100;
  camera.position.y = 15;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0,0,0));
  // cannonMaterials
  addCannonMaterials();
  addBasePlatform();
  document.body.appendChild( renderer.domElement );
  draw();
  document.onclick = () => {
     addFallingSphere({x: 0,y: 60, z: 0}, {radius: 6}, 1);
  }
});

function addFallingSphere(intialPosition, initialDimensions, mass) {
  let maxCount = 100;
  let options = {};
  options.position = intialPosition;
  options.rotation = {x: 0, y: 0, z: 0};
  options.dimensions = initialDimensions;
  options.mass = mass;
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;
  options.material = groundMaterial;

  if (fallingSpheres.length < 1) {
    let sphere = dynamicSphere(options);
    scene.add( sphere.three );
    fallingSpheres.unshift(sphere);
  }
}

function addBasePlatform() {
  let options = {};
  options.position = {x: 0, y: 0, z: 0};
  options.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  options.dimensions = {width: 48, height: .6, depth: 48};
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;
  options.material = groundMaterial;

  platform = fixedCuboid(options);
  scene.add( platform.three );
  console.log('Create A Contact Material Here');
}

function changeAngle(position) {
  if (startPlatformPosition !== platform.cannon.quaternion.x) {
    //startPlatformPosition = platform.cannon.quaternion.x;
    console.log(position/10000);
    //platform.cannon.quaternion.x =1*Math.PI/2  // + position/10000;
    platform.cannon.quaternion.setFromEuler(1*Math.PI/2 + position/10000, 0, 0);
    addFallingSphere({x: 0,y: 60, z: 0}, {radius: 6}, 1);
  }
}

sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
uiUpdateInterval = setInterval(uiSychronization, 30);
