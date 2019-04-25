let world, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
//let cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );

let mass = 5, radius = 1;

let spheres = [];

let sphere = {};

function setupCamera() {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 12000 );
  camera.position.z = 10;
  camera.position.y = -20;
  camera.lookAt(new THREE.Vector3(0,0,0));
}

function setupWorld() {
  world = new CANNON.World();
  world.gravity.set(0,0,-10);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;
}

function setupRenderer() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}

function addGround() {
  /* Cannon Ground Shape */
  let groundShape = new CANNON.Plane();
  let groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
  groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3(1,1,0), Math.PI/32 );
  world.add(groundBody);

  /* 3JS Ground Shape */
 geometry = new THREE.PlaneGeometry( 360, 360 );
 //material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
material = new THREE.MeshLambertMaterial({color: 0xffff00, transparent: true, opacity: 1});
 plane = new THREE.Mesh( geometry, material );
 scene.add( plane );
 plane.rotation.x = Math.PI/32;
 plane.rotation.y = Math.PI/32;
}

function addSphere() {
  let sphereShape = new CANNON.Sphere(radius); // Step 1
  let sphereBody = new CANNON.Body({mass: 5, shape: sphereShape}); // Step 2
  sphereBody.position.set(-10,10,10);
  world.add(sphereBody); // Step 3


  /* Add A Sphere To To Canvas */
  geometry = new THREE.SphereGeometry( radius, 32, 32 );
  //geometry = new THREE.BoxGeometry( 10, 10, 10 );
  material = new THREE.MeshLambertMaterial({color: 0x0000ff, transparent: true, opacity: 1});
  mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(-30, 60, 30);
  scene.add( mesh );

  sphere.mesh = mesh;
  sphere.physics = sphereBody;

  spheres.push({physics: sphereBody, mesh: mesh});



}

function setup() {
  setupCamera();
  setupWorld();
  setupRenderer();
  addGround();
  addSphere();
  //cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
  draw();

  var directionalLight1 = new THREE.DirectionalLight( 0xFFFFFF, 1 );
  directionalLight1.position.set( 0, 20, 20 );
  directionalLight1.castShadow = true;
  scene.add( directionalLight1 );

  var directionalLight2 = new THREE.DirectionalLight( 0x0000FF, 1 );
  directionalLight2.position.set( 0, 0, 20 );
  directionalLight2.castShadow = true;
  scene.add( directionalLight2 );

  var pointLight = new THREE.PointLight( 0xFF0000, 20);
  pointLight.position.set( 0, 0, 10 );
  pointLight.castShadow = true;
  scene.add( pointLight );



 var ambientLight = new THREE.AmbientLight( 0x404040 );
 scene.add(ambientLight);

}

const updateSceneData = () => {

  // if (sphere) {
  //   console.log(sphere.physics.position.x);
  //   sphere.mesh.position.set(sphere.physics.position.x, sphere.physics.position.y, sphere.physics.position.z);
  //   updatePhysics();
  // }

  spheres.forEach(
    (sphere) => {
        //console.log(sphere.physics.position.x);
        sphere.mesh.position.set(sphere.physics.position.x, sphere.physics.position.y, sphere.physics.position.z);

    }
  );

  updatePhysics();

  /*
    Remove all spheres that aren't on the screen
  */


}

const updateFramerate = (newFrameRate) => {
  framerate = newFrameRate;
  clearInterval(sceneUpdateInterval);
  sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
}

function updatePhysics() {
    world.step(timeStep);
    //addSphere();
}

function draw() {
  renderer.render( scene, camera );
  //cannonDebugRenderer.update();
  requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();

  document.onclick = () => {
    addSphere();
  }
});
sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
setInterval(addSphere, 1000);
