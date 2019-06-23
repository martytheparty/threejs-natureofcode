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
    world.step(1/60);
  }

}

function uiSychronization() {
  if (world) {
    fallingBoxes.forEach(
      (box, i) => {
        box.three.position.x = box.cannon.position.x;
        box.three.position.y = box.cannon.position.y;
        box.three.position.z = box.cannon.position.z;

        box.three.quaternion.x = box.cannon.quaternion.x;
        box.three.quaternion.y = box.cannon.quaternion.y;
        box.three.quaternion.z = box.cannon.quaternion.z;
        box.three.quaternion.w = box.cannon.quaternion.w;

        /* if (z < -50) remove this from the array */
        if (box.three.position.y < -50) {
          world.remove(fallingBoxes[i].cannon);
          scene.remove(fallingBoxes[i].three);
          fallingBoxes.splice(i, 1);
        }

      }
    );

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



    // let x = topPlatform.cannon.angularVelocity.x + 10;
    // let y = topPlatform.cannon.angularVelocity.y + 10;
    // let z = topPlatform.cannon.angularVelocity.z + 10;

    // topPlatform.cannon.angularVelocity.set(x,y,z);

    //topPlatform.cannon.angularDamping = 0.5;

    // topPlatform.cannon.rotation.x += .01;
    // topPlatform.cannon.rotation.y += .01;
    // topPlatform.cannon.rotation.z += .01;


    xRot = xRot + 0;
    yRot = yRot + 0;
    zRot = zRot + 0;

    topPlatform.cannon.quaternion.setFromEuler( xRot, yRot, zRot);

    topPlatform.three.quaternion.x = topPlatform.cannon.quaternion.x;
    topPlatform.three.quaternion.y = topPlatform.cannon.quaternion.y;
    topPlatform.three.quaternion.z = topPlatform.cannon.quaternion.z;



    //debugger
    //console.log(`${fallingBoxes.length} - ${fallingSpheres.length}`);




  }

}

function rotate() {
  const step = .05;
  fins.forEach(
    (fin) => {
      fin.i = fin.i + step;
      //fin.j = fin.j + step;
// x: Math.sin(i*.3)*j*5, y: 3*j, z: Math.cos(i*.3)*j*5
      fin.cannon.position.x = Math.sin(fin.i*.3)*fin.j*5;
      //fin.cannon.position.y = 3*fin.j;
      fin.cannon.position.z = Math.cos(fin.i*.3)*fin.j*5;
      fin.three.position.x = Math.sin(fin.i*.3)*fin.j*5;
      //fin.three.position.y = 3*fin.j;
      fin.three.position.z = Math.cos(fin.i*.3)*fin.j*5;
      //console.log('fin');
    }
  );
}

let xRot = 2*Math.PI/5;
let yRot = 0;
let zRot = 0;

function draw() {
//  camera.lookAt(new THREE.Vector3(0,0,0));
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
  camera.position.x = 40;
  camera.position.y = 10;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(100,0,0));
  controls.update();

  addPlatforms();
  addFins();
  addFallingBox({x: 0,y: 15, z: 0}, {width: .2, height: .2, depth: .2}, 1);

  document.body.appendChild( renderer.domElement );

  draw();

  document.onclick = () => {
    // addFallingBox({x: 0,y: 18, z: 0}, {width: .5, height: .5, depth: .5}, 1000);
    // addFallingSphere({x: 3,y: 19, z: -3}, {radius: .3}, 1);
    // addFallingSphere({x: -3,y: 19, z: -3}, {radius: .2}, 10);
    // addFallingSphere({x: 3,y: 19, z: 3}, {radius: .1}, 1000);

  }
});

function addFallingSphere(intialPosition, initialDimensions, mass) {
  let maxCount = 100;
  let options = {};
  options.position = intialPosition;
  options.rotation = {x: -1*Math.PI/8, y: 0, z: Math.PI/8};
  options.dimensions = initialDimensions;
  options.mass = mass;
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;

  let sphere = dynamicSphere(options);
  scene.add( sphere.three );
  fallingSpheres.unshift(sphere);

  if (fallingSpheres.length > maxCount) {
    for (var i = (fallingSpheres.length - 1); i > maxCount; i-- ) {
      //console.log(fallingSpheres[i]);
      world.remove(fallingSpheres[i].cannon);
      scene.remove(fallingSpheres[i].three);
      fallingSpheres.pop();
    }
  }

}

function addFallingBox(intialPosition, initialDimensions, mass) {
  let maxCount = 100;
  let options = {};
  options.position = intialPosition;
  options.rotation = {x: -1*Math.PI/8, y: 0, z: Math.PI/8};
  options.dimensions = initialDimensions;
  options.mass = mass;
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;

  let box = dynamicCuboid(options);
  scene.add( box.three );
  fallingBoxes.unshift(box);

  if (fallingBoxes.length > maxCount) {
    for (var i = (fallingBoxes.length - 1); i > maxCount; i-- ) {
      //console.log(fallingSpheres[i]);
      world.remove(fallingBoxes[i].cannon);
      scene.remove(fallingBoxes[i].three);
      fallingBoxes.pop();
    }
  }
}

function addFins() {
  let toggle1 = 1;
  let toggle2 = 1;
  for(let i = 0; i < 21; i++) {

    for(let j = 0; j < 4; j++) {
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
        opt.position = {x: Math.sin(i*.3)*j*5, y: 5*j, z: Math.cos(i*.3)*j*5};
        opt.rotation = {x: -1*Math.PI/2, y: -1*Math.PI/6, z: -0*Math.PI/4};
        opt.dimensions = {width: 1, height: .1, depth: 1};
        opt.scene = scene;
        opt.world = world;
        opt.debugWorld = false;
        let descriptor = fixedCuboid(opt);
        descriptor.i = i;
        descriptor.j = j;
        scene.add(descriptor.three)
        fins.push(descriptor);

      }
    }
  }
}

function addPlatforms() {
  // addBasePlatform();
  // addMiddlePlatform();
  // addTopPlatform();
}

function addTopPlatform() {
  let options = {};
  options.position = {x: 0, y: -5, z: 0};
  options.rotation = {x: 2*Math.PI/5, y: 0, z: 0};
  options.dimensions = {width: 8, height: .1, depth: 8};
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;

  topPlatform = fixedCuboid(options);

  scene.add( topPlatform.three );

}

function addMiddlePlatform() {
  let options = {};
  options.position = {x: 0, y: -10, z: 0};
  options.rotation = {x: 1*Math.PI/3, y: 0, z: -1*Math.PI/32};
  options.dimensions = {width: 3, height: .1, depth: 3};
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;

  platform = fixedCuboid(options);
  scene.add( platform.three );

}

function addBasePlatform() {
  let options = {};
  options.position = {x: 0, y: -15, z: 0};
  options.rotation = {x: -1*Math.PI/3, y: 0, z: 1*Math.PI/32};
  options.dimensions = {width: 12, height: .1, depth: 12};
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;

  platform = fixedCuboid(options);
  scene.add( platform.three );
}

function newBoxes() {
  //  opt.position = {x: Math.sin(i*.3)*j*5, y: 3*j, z: Math.cos(i*.3)*j*5};
  const radius = 24;
  addFallingBox({x: (Math.floor(Math.random() * radius) - radius/2),y: (Math.floor(Math.random() * radius) + radius/2), z: (Math.floor(Math.random() * radius) - radius/2)}, {width: .3, height: .3, depth: .3}, 1);
  addFallingSphere({x: (Math.floor(Math.random() * radius) - radius/2),y: (Math.floor(Math.random() * radius) + radius/2), z: (Math.floor(Math.random() * radius) - radius/2)}, {radius: .3}, 10);
}

sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
uiUpdateInterval = setInterval(uiSychronization, 30);
rotateInterval = setInterval(rotate, 100);
setInterval(newBoxes, 200);
