let world, body, timeStep=1/60, camera, scene, renderer;
let framerate = 60;
let fallingSpheres = [];
let startPlatformPosition = 0;
let goalPlatformPosition = 0;
let currentPlatformPosition = 0;
let groundMaterial;
let bouncyMaterial;
let groundGroundContact;
let groundBouncyContact;
let bouncyBouncyContact;


const setupPhysics = () => {
  world = new CANNON.World();
  world.gravity.set(0,-60,0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;
  world.solver.tolerance = 0;
};



const updateSceneData = () => {
  if (world) world.step(1/60);
}


function uiSychronization() {

  if (world && typeof platform !== 'undefined') {
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
}

document.addEventListener("DOMContentLoaded", () => {
  setupPhysics();

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 10000 );
  camera.position.x = 240;
  camera.position.y = 40;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0,0,0));
  // cannonMaterials

  addPlatforms();
  document.body.appendChild( renderer.domElement );
  draw();

});

function addPlatforms() {

  /* 1) Create a group of 100 fixed platforms with a slight downward incline */
  /* 2) Create two invisable walls to prevent balls from falling off the platforms */



  for(let i = 0; i < 100; i++) {
    let options = {};
    let zposition = 100 - i*2;
    let height = 100 - i;
    options.position = {x: 0, y: i*-1, z: zposition};
    options.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
    options.dimensions = {width: 240, height: height, depth: 2};
    options.scene = scene;
    options.world = world;
    options.debugWorld = false;
    options.material = groundMaterial;

    platform = fixedCuboid(options);
    scene.add( platform.three );
  }

}


function addFallingSphere(intialPosition, initialDimensions, mass) {
  let maxCount = 100;
  let options = {};
  options.position = {x: 0,y: 130, z: -90};
  options.rotation = {x: 0, y: 0, z: 0};
  options.dimensions = initialDimensions;
  options.mass = 100;
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;
  options.material = bouncyMaterial;
  let sphere = dynamicSphere(options);

  if (fallingSpheres.length < 100) {
    scene.add( sphere.three );
    fallingSpheres.unshift(sphere);

  }
}


document.onclick = () => {
   addFallingSphere({x: 0,y: 130, z: -100}, {radius: 3}, 1);
}

sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
uiUpdateInterval = setInterval(uiSychronization, 30);
