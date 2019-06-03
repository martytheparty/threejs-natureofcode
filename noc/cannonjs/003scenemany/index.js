let world, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh;

let world2, body2, shape2, camera2, scene2, renderer2, geometry2, material2, mesh2;

let framerate = 60;
let cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
let mass = 5, radius = 1;
let cannonElement;
let threeElement;
let theta = Math.PI;
let controls;
let ground;


function setupCamera1() {
  camera = new THREE.PerspectiveCamera( 70, 1, 0.01, 200 );
  camera.position.x = 20;
  camera.position.y = 30;
  //camera.position.x = Math.cos(theta)*20;
  camera.lookAt(new THREE.Vector3(0,0,0));
}

function setupCamera2() {
  camera2 = new THREE.PerspectiveCamera( 70, 1, 0.01, 200 );
  controls = new THREE.OrbitControls( camera2 );
  //camera2.position.z = Math.sin(theta)*20;
  camera2.position.x = 20;
  camera2.position.y = 30;
  camera2.lookAt(new THREE.Vector3(0,0,0));
  controls.update();

}

function setupWorld1() {
  world = new CANNON.World();
  world.gravity.set(0,0,-10);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;
}

function setupWorld2() {
  world2 = new CANNON.World();
  world2.gravity.set(0,0,-10);
  world2.broadphase = new CANNON.NaiveBroadphase();
  world2.solver.iterations = 10;
}

function setupRenderer1() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( cannon.offsetWidth, cannon.offsetHeight );
  cannonElement.appendChild( renderer.domElement );
}

function setupRenderer2() {
  scene2 = new THREE.Scene();
  renderer2 = new THREE.WebGLRenderer( { antialias: true } );
  renderer2.setSize( threeElement.offsetWidth, threeElement.offsetHeight );
  threeElement.appendChild( renderer2.domElement );
}



function draw1() {
  //theta = theta + .05;
  camera.position.z = Math.sin(theta)*20;
  camera.position.x = Math.cos(theta)*20;
  camera.lookAt(new THREE.Vector3(0,0,0));
  cannonDebugRenderer.update();
  renderer.render( scene, camera );
  requestAnimationFrame( draw1 );
}

function draw2() {
  camera2.position.z = Math.sin(theta)*20;
  camera2.position.x = Math.cos(theta)*20;
  camera2.lookAt(new THREE.Vector3(0,0,0));
  renderer2.render( scene2, camera2 );
  controls.update();
  requestAnimationFrame( draw2 );
}






function setup1() {
  cannonElement = document.getElementById("cannon");
  setupCamera1();
  setupWorld1();
  setupRenderer1();
  cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
  draw1();
}

function setup2() {
  threeElement = document.getElementById("cube");
  setupCamera2();
  setupWorld2();
  setupRenderer2();
  draw2();
}

const updateSceneData = () => {
  updatePhysics();
}

const updateFramerate = (newFrameRate) => {
  framerate = newFrameRate;
  clearInterval(sceneUpdateInterval);
  sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
}

function updatePhysics() {
    world.step(timeStep);
}



document.addEventListener("DOMContentLoaded", () => {
  setup1();
  setup2();

  // cuboid descriptor
  // {
  //   position: { x: number, y: number, z: number },
  //   rotation: { x: number, y: number, z: number },
  //   dimensions { width: number, height: number, depth: number },
  //   scene: threeJsScene,
  //   world; cannonJsWorld,
  //   debugWorld: debugWorld
  // }
  let options = {};
  options.position = {x: 0, y: -5, z: 0};
  options.rotation = {x: -1*Math.PI/16, y: 0, z: 1*Math.PI/32};
  options.dimensions = {width: 8, height: .1, depth: 8};
  options.scene = scene2;
  options.world = world2;
  options.debugWorld = world;

  ground = fixedCuboid(options);
  scene2.add( ground.three );


  let options1 = {};
  options1.position = {x: 0, y: 5, z: 0};
  options1.rotation = {x: Math.PI/8, y: 0, z: Math.PI/8};
  options1.dimensions = {width: 3, height: .1, depth: 3};
  options1.scene = scene2;
  options1.world = world2;
  options1.debugWorld = world;

  ground1 = fixedCuboid(options1);
  scene2.add( ground1.three );

  let options2 = {};
  options2.position = {x: 0, y: 8, z: 0};
  options2.rotation = {x: -1*Math.PI/8, y: 0, z: Math.PI/8};
  options2.dimensions = {width: 1, height: .1, depth: 1};
  options2.scene = scene2;
  options2.world = world2;
  options2.debugWorld = world;

  ground2 = fixedCuboid(options2);
  scene2.add( ground2.three );

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
        opt.scene = scene2;
        opt.world = world2;
        opt.debugWorld = world;
        let descriptor = fixedCuboid(opt);
        scene2.add(descriptor.three)

      }
    }
  }




  document.onclick = () => {
    //addSphere();
  }
});
sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
