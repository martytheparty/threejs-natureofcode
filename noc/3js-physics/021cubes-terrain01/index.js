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

/*
 * Starting Corner:
 * x - displacement
 * y - displacement
 *
 * z - displacementFunction
 */

let startingCorner = { x: -10, y: -20};
let xDisplacement = 20;
let yDisplacement = 40;
let zDisplacementFunction = (x, y) => {
  /* straight line */
  return y*(-1);
};

let surface = [];

let calculateSurface = () => {
  for (let i = 0; i < xDisplacement; i++ ) {
    for (let j = 0; j < yDisplacement; j++ ) {
      const x = startingCorner.x + i;
      const y = startingCorner.y + j;
      const z = zDisplacementFunction(x,y);
      //console.log(`x: ${x} y: ${y} z: ${z}`);
      surface.push({x, y, z});
    }
  }
}



let generateSurfaceObjects = () => {
  let incomplete = false;
  let count = 0;
  surface.forEach(
    (position) => {
      //console.log(sphere);



      options = {};

      options.position = {x: position.x, y: position.z, z: position.y};
      options.rotation = {x: 0, y: 0, z: 0};
      options.dimensions = {width: .25, height: .25, depth: .25};
      options.mass = 0;
      options.scene = scene;
      options.world = world;
      options.debugWorld = false;
      options.material = groundMaterial;

      if (!position.sphere && !incomplete) {
        position.sphere = fixedCuboid(options);
        scene.add( position.sphere.three );
        //incomplete = true;
      }

    }
  );

  if (incomplete) {
    setTimeout(generateSurfaceObjects);
  }

}

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
  //addCell();


  calculateSurface();
  generateSurfaceObjects();


  // addPlatforms();
  document.body.appendChild( renderer.domElement );
  draw();
  document.onclick = () => {
     addFallingSphere({x: -20,y: 15, z: 0}, {radius: 1}, 1);
  }
});


function addFallingSphere(intialPosition, initialDimensions, mass) {
  let maxCount = 10;
  let options = {};
  options.position = {x: 0,y: 25, z: 18};
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
