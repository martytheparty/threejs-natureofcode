let world, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh;

let cannonWorld, body2, shape2, renderer2, geometry2, material2, mesh2;

let framerate = 60;
let mass = 5, radius = 1;
let cannonElement;
let threeElement;
let controls;
let ground;


const setupPhysics = () => {
  world = new CANNON.World();
  world.gravity.set(0,0,-10);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;
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
    world.step(timeStep);
  }


}


function draw() {
  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer.render( scene, camera );
  controls.update();
  requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {

  setupPhysics();

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );

  camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 200 );
  controls = new THREE.OrbitControls( camera );
  camera.position.x = 20;
  camera.position.y = 30;
  camera.lookAt(new THREE.Vector3(0,0,0));
  controls.update();

  addPlatforms();
  addFins();

  document.body.appendChild( renderer.domElement );

  draw();

  document.onclick = () => {
    //addSphere();
  }
});

function addFins() {
  let toggle1 = 1;
  let toggle2 = 1;
  for(let i = 0; i < 22; i++) {
    // let opt = {};
    // opt.position = {x: 0, y: i, z: i};
    // opt.rotation = {x: 0, y: 0, z: 0};
    // opt.dimensions = {width: 1, height: .1, depth: 1};
    // opt.scene = scene2;
    // opt.world = world2;
    // opt.debugWorld = world;
    // fixedCuboid(opt);
    for(let j = 0; j < 4; j++) {
      // let opt = {};
      // opt.position = {x: 0, y: i, z: j};
      // opt.rotation = {x: 0, y: 0, z: 0};
      // opt.dimensions = {width: 1, height: .1, depth: 1};
      // opt.scene = scene2;
      // opt.world = world2;
      // opt.debugWorld = world;
      // fixedCuboid(opt);
      for(let k = 0; k < 5; k++) {


        if (toggle1 === 1 && toggle2 === 1) {
          toggle1 = 1;
          toggle2 = -1;
        } else if (toggle1 === 1 && toggle2 === -1) {
          toggle1 = -1;
          toggle2 = 1;
        } else if (toggle1 === -1 && toggle2 === 1) {
          toggle1 = -1;
          toggle2 = -1;
        } else if (toggle1 === -1 && toggle2 === -1) {
          toggle1 = 1;
          toggle2 = 1;
        }

        let opt = {};
        opt.position = {x: Math.sin(i*.3)*j*5, y: 3*j, z: Math.cos(i*.3)*j*5};
        opt.rotation = {x: 1*Math.PI/8, y: 1*Math.PI/8, z: -1*Math.PI/4};
        opt.dimensions = {width: 1, height: .1, depth: 1};
        opt.scene = scene;
        opt.world = world;
        opt.debugWorld = false;
        let descriptor = fixedCuboid(opt);
        scene.add(descriptor.three)

      }
    }
  }
}

function addPlatforms() {
  addBasePlatform();
  addMiddlePlatform();
  addTopPlatform();
}

function addTopPlatform() {
  let options = {};
  options.position = {x: 0, y: 8, z: 0};
  options.rotation = {x: -1*Math.PI/8, y: 0, z: Math.PI/8};
  options.dimensions = {width: 1, height: .1, depth: 1};
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;

  platform = fixedCuboid(options);
  scene.add( platform.three );

}

function addMiddlePlatform() {
  let options = {};
  options.position = {x: 0, y: 5, z: 0};
  options.rotation = {x: Math.PI/8, y: 0, z: Math.PI/8};
  options.dimensions = {width: 3, height: .1, depth: 3};
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;

  platform = fixedCuboid(options);
  scene.add( platform.three );

}

function addBasePlatform() {
  let options = {};
  options.position = {x: 0, y: -5, z: 0};
  options.rotation = {x: -1*Math.PI/16, y: 0, z: 1*Math.PI/32};
  options.dimensions = {width: 8, height: .1, depth: 8};
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;

  platform = fixedCuboid(options);
  scene.add( platform.three );
}

sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
