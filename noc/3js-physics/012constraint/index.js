let world, body, timeStep=1/60, camera, scene, renderer;
let framerate = 60;
let fallingSpheres = [];
let fallingCubes = [];
let springs = [];
let startPlatformPosition = 0;
let goalPlatformPosition = .4;
let currentPlatformPosition = 0;
let groundMaterial;
let bouncyMaterial;
let groundGroundContact;
let groundBouncyContact;
let bouncyBouncyContact;


const setupPhysics = () => {
  world = new CANNON.World();
  world.gravity.set(0,0,0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;
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

  if (world && typeof platform !== 'undefined') {
    let currentGoal = 1*Math.PI/2 + goalPlatformPosition/10000;
    if (currentGoal !== platform.cannon.quaternion.x) {
      currentPlatformPosition = currentPlatformPosition + goalPlatformPosition/10;

      platform.cannon.quaternion.setFromEuler(1*Math.PI/2 + currentPlatformPosition, 0, 0);
      //platform.cannon.quaternion.setFromEuler(1*Math.PI/2 + position/10000, 0, 0);
    }


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
        if (sphere.three.position.y < -5000) {
          world.remove(fallingSpheres[i].cannon);
          scene.remove(fallingSpheres[i].three);
          fallingSpheres.splice(i, 1);
        }
      }
    );
    fallingCubes.forEach(
      (sphere, i) => {
        sphere.three.position.x = sphere.cannon.position.x;
        sphere.three.position.y = sphere.cannon.position.y;
        sphere.three.position.z = sphere.cannon.position.z;

        sphere.three.quaternion.x = sphere.cannon.quaternion.x;
        sphere.three.quaternion.y = sphere.cannon.quaternion.y;
        sphere.three.quaternion.z = sphere.cannon.quaternion.z;
        sphere.three.quaternion.w = sphere.cannon.quaternion.w;

        /* if (z < -50) remove this from the array */
        if (sphere.three.position.y < -5000) {
          world.remove(fallingCubes[i].cannon);
          scene.remove(fallingCubes[i].three);
          fallingCubes.splice(i, 1);
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
  camera.position.y = 10;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0,0,0));
  // cannonMaterials
  addCannonMaterials();
  addPlatforms();
  document.body.appendChild( renderer.domElement );
  draw();
  document.onclick = () => {
     addFallingSphere({x: 0,y: 20, z: 0}, {radius: 3}, 1);
  }
});

function intervalAdd() {
  addFallingSphere({x: 0,y: 20, z: 0}, {radius: 3}, 1);
}

function addFallingSphere(intialPosition, initialDimensions, mass) {
  let maxCount = 100;
  let options = {};
  options.position = {x: 0,y: 30, z: 0};
  options.rotation = {x: 0, y: 0, z: 0};
  options.dimensions = initialDimensions;
  options.mass = 100;
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;
  options.material = groundMaterial;


  let options1 = {};
  options1.position = {x: 0,y: 60, z: 0};
  options1.rotation = {x: 10, y: 0, z: 0};
  options1.dimensions = {width: 13, height: 3, depth: 1};
  options1.mass = 10;
  options1.scene = scene;
  options1.world = world;
  options1.debugWorld = false;
  options1.material = groundMaterial;
  let sphere = dynamicSphere(options);
  let cube = dynamicCuboid(options1);

  if (fallingCubes.length < 100) {

    scene.add( sphere.three );
    fallingSpheres.unshift(sphere);


    scene.add( cube.three );
    fallingCubes.unshift(cube);

    world.addConstraint(new CANNON.DistanceConstraint(sphere.cannon,cube.cannon,80));

    /* line */

    // let geo = new THREE.Geometry();
    // geo.vertices.push(
    //   new THREE.Vector3( pos1.x, pos1.y, pos1.z ),
    //   new THREE.Vector3( pos2.x, pos2.y, pos2.z )
    // );
    //
    // line1 = new THREE.Line( geo, material );
    // scene.add( line1 );



  }






}

function addPlatforms() {
  let options = {};
  options.position = {x: 0, y: 0, z: 0};
  options.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  options.dimensions = {width: 40, height: 5, depth: 60};
  options.scene = scene;
  options.world = world;
  options.debugWorld = false;
  options.material = groundMaterial;

  platform = fixedCuboid(options);
  //scene.add( platform.three );

  let optionsa = {};
  optionsa.position = {x: 0, y: -40, z: 0};
  optionsa.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  optionsa.dimensions = {width: 40, height: 2, depth: 40};
  optionsa.scene = scene;
  optionsa.world = world;
  optionsa.debugWorld = false;
  optionsa.material = groundMaterial;

  platforma = fixedCuboid(optionsa);
  //scene.add( platforma.three );

  let options1 = {};
  options1.position = {x: 0, y: 40, z: 0};
  options1.rotation = {x: 1*Math.PI/2, y: 0, z: 0};
  options1.dimensions = {width: 40, height: .6, depth: 40};
  options1.scene = scene;
  options1.world = world;
  options1.debugWorld = false;
  options1.material = groundMaterial;

  platform1 = fixedCuboid(options1);
  // scene.add( platform1.three );

  let options2 = {};
  options2.position = {x: -40, y: 0, z: 0};
  options2.rotation = {x: 2*Math.PI/2, y: 0, z: 0};
  options2.dimensions = {width: .6, height: 40, depth: 40};
  options2.scene = scene;
  options2.world = world;
  options2.debugWorld = false;
  options2.material = groundMaterial;

  platform2 = fixedCuboid(options2);
  // scene.add( platform2.three );

  let options3 = {};
  options3.position = {x: 0, y: 0, z: 40};
  options3.rotation = {x: 2*Math.PI/2, y: 0, z: 0};
  options3.dimensions = {width: 40, height: .6, depth: 40};
  options3.scene = scene;
  options3.world = world;
  options3.debugWorld = false;
  options3.material = groundMaterial;

  platform3 = fixedCuboid(options3);
  // scene.add( platform3.three );

  let options4 = {};
  options4.position = {x: 0, y: 0, z: -40};
  options4.rotation = {x: 2*Math.PI/2, y: 0, z: 0};
  options4.dimensions = {width: 40, height: .6, depth: 40};
  options4.scene = scene;
  options4.world = world;
  options4.debugWorld = false;
  options4.material = groundMaterial;

  platform4 = fixedCuboid(options4);
//  scene.add( platform4.three );

  let options5 = {};
  options5.position = {x: 40, y: 0, z: 0};
  options5.rotation = {x: 2*Math.PI/2, y: 0, z: 0};
  options5.dimensions = {width: .6, height: 40, depth: 40};
  options5.scene = scene;
  options5.world = world;
  options5.debugWorld = false;
  options5.material = groundMaterial;

  platform5 = fixedCuboid(options5);
//  scene.add( platform5.three );


}

function changeAngle(position) {
  goalPlatformPosition = position/10000;
  if (startPlatformPosition !== platform.cannon.quaternion.x) {
    //startPlatformPosition = platform.cannon.quaternion.x;
    //console.log(position/10000);
    //platform.cannon.quaternion.x =1*Math.PI/2  // + position/10000;
    //platform.cannon.quaternion.setFromEuler(1*Math.PI/2 + position/10000, 0, 0);
    //addFallingSphere({x: 0,y: 30, z: 0}, {radius: 3}, 1);
  }
}

function rotionalSpeedUpdate() {
    goalPlatformPosition = Math.random() - .5;
}

sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
uiUpdateInterval = setInterval(uiSychronization, 30);
addSphereInterval = setInterval(intervalAdd, 500);
rotationalSpeedInterval = setInterval(rotionalSpeedUpdate, 3500);
