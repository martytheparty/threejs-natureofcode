let world, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh;

let cannonWorld, body2, shape2, renderer2, geometry2, material2, mesh2;

let framerate = 60;
let mass = 5, radius = 1;
let cannonElement;
let threeElement;
let controls;
let ground;
let fallingBoxes = [];
let fallingSpheres = [];

let topPlatform = {};
let fins = [];

const setupPhysics = () => {
  world = new CANNON.World();
  world.gravity.set(0,-20,0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 20;
  world.solver.tolerance = 0;
};

const updateSceneData = () => {
  updatePhysics();
}

const updateFramerate = (newFrameRate) => {
  framerate = newFrameRate;
  clearInterval(sceneUpdateInterval);
  sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
}

function updatePhysics() {

  if (world) {
    world.step(1/60);
  }

}

function uiSychronization() {
  if (world) {
    // fallingBoxes.forEach(
    //   (box, i) => {
    //     box.three.position.x = box.cannon.position.x;
    //     box.three.position.y = box.cannon.position.y;
    //     box.three.position.z = box.cannon.position.z;
    //
    //     box.three.quaternion.x = box.cannon.quaternion.x;
    //     box.three.quaternion.y = box.cannon.quaternion.y;
    //     box.three.quaternion.z = box.cannon.quaternion.z;
    //     box.three.quaternion.w = box.cannon.quaternion.w;
    //
    //     /* if (z < -50) remove this from the array */
    //     if (box.three.position.y < -50) {
    //       world.remove(fallingBoxes[i].cannon);
    //       scene.remove(fallingBoxes[i].three);
    //       fallingBoxes.splice(i, 1);
    //     }
    //
    //   }
    // );

    platform.three.quaternion.x = platform.cannon.quaternion.x;
    platform.three.quaternion.y = platform.cannon.quaternion.y;
    platform.three.quaternion.z = platform.cannon.quaternion.z;
    platform.three.quaternion.w = platform.cannon.quaternion.w;

    fallingSpheres.forEach(
      (sphere, i) => {
        sphere.three.position.x = sphere.cannon.position.x;
        sphere.three.position.y = sphere.cannon.position.y;
        sphere.three.position.z = sphere.cannon.position.z;

        //console.log(sphere.three.position.z);

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
//  controls.update();
  requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {

  setupPhysics();

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );

  camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 200 );
  //controls = new THREE.OrbitControls( camera );
  camera.position.x = 28;
  camera.position.y = 5;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(100,0,0));
//  controls.update();

  addPlatforms();
  document.body.appendChild( renderer.domElement );

  draw();

  document.onclick = () => {
    addFallingSphere({x: 0,y: 19, z: 0}, {radius: 1}, 1);
    // addFallingSphere({x: -3,y: 19, z: -3}, {radius: .2}, 10);
    // addFallingSphere({x: 3,y: 19, z: 3}, {radius: .1}, 1000);

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

  if (fallingSpheres.length < 1) {
    let sphere = dynamicSphere(options);
    scene.add( sphere.three );
    fallingSpheres.unshift(sphere);
  }

}

function addPlatforms() {
  addBasePlatform();
}

function addBasePlatform() {
  let options = {};
  options.position = {x: 0, y: 0, z: 0};
  options.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  options.dimensions = {width: 12, height: .1, depth: 12};
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;

  platform = fixedCuboid(options);
  scene.add( platform.three );
}

function newBoxes() {
  addFallingSphere({x: 10,y: 20, z: 0}, {radius: .5}, 10);
}

let startPlatformPosition = 0;
function changeAngle(position) {
  if (startPlatformPosition === 0) {
    startPlatformPosition = platform.cannon.quaternion.x;
  }

  platform.cannon.quaternion.x = startPlatformPosition + position/100;
  addFallingSphere({x: 0,y: 19, z: 0}, {radius: 1}, 1);
  // console.log(position);
  // console.log(fallingSpheres[0].three.position.z);
}
//addFallingSphere({x: 10,y: 20, z: 0}, {radius: .5}, 1000);
sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
uiUpdateInterval = setInterval(uiSychronization, 30);
// rotateInterval = setInterval(rotate, 100);
//setInterval(newBoxes, 1000);
// newBoxes();
