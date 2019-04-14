
let world, mass, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh, plane;
let framerate = 60;

let spherePosition = new MVector(0,0,0);
let sphereVelocity = new MVector(0,0,0);
let sphereAcceleration = new MVector(0,0,0);
let ball = new MParticle(10, spherePosition);
ball.velocity = sphereVelocity;
ball.acceleration = sphereAcceleration;
ball.constraints = new MVector(200, 150, 150);


function initCannon() {

    world = new CANNON.World();
    //world.gravity.set(0,0,0);
    world.gravity.set(0,0,-9.82)
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

}

function addCannonGround() {
  const axis = new CANNON.Vec3(0,0,0);
  const angle = -1 * Math.PI / 4;

  const boxShape = new CANNON.Box(new CANNON.Vec3(200,3000,1));
  const boxBody = new CANNON.Body({mass: 0, shape: boxShape});

  console.log()
  boxBody.position.set(0,0,0);
  boxBody.quaternion.setFromAxisAngle(axis, angle);
  //boxShape.position.setZero();
  //boxShape.rotation.x -= Math.PI/4;

  // var groundShape = new CANNON.Plane();
  // var groundBody = new CANNON.Body({ mass: 0 });
  // groundBody.addShape(groundShape);
  world.add(boxBody);
  console.log('Add Cannon Ground');
}

function addVisualGround() {
  geometry = new THREE.PlaneGeometry( 200, 3000 );
  material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  plane = new THREE.Mesh( geometry, material );
  scene.add( plane );
  plane.rotation.x -= Math.PI/4;
}

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 4000 );
    camera.position.z = 300;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    addVisualGround();

    draw();
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

function draw() {
    /*
    This function call called on every browser render (requestAnimationFrame) event.
    */

    // mesh.rotation.y += 0.1;
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  initCannon();
  addCannonGround();
  setup();
});
