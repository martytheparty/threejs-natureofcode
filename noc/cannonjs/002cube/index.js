let world, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
let cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
let mass = 5, radius = .2;

function setupCamera() {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 200 );
  camera.position.z = 10;
  camera.position.y = -20;
  camera.lookAt(new THREE.Vector3(0,0,0));
}

function setupWorld() {
  world = new CANNON.World();
  world.gravity.set(0,0,-10);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 60;
}

function setupRenderer() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

}

function addGround() {
  let groundShape = new CANNON.Plane();
  let groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
  groundBody.quaternion.setFromAxisAngle( new CANNON.Vec3(1,1,0), Math.PI/12 );
  world.add(groundBody);
}

function addSphere() {
  let sphereShape = new CANNON.Sphere(radius); // Step 1
  let sphereBody = new CANNON.Body({mass: 15, shape: sphereShape}); // Step 2
  let yPos = Math.random() * 20;
  sphereBody.position.set(-10,yPos,10);
  world.add(sphereBody); // Step 3
}

function addBoxes(){
     // Physics
     var shape = new CANNON.Box(new CANNON.Vec3(15,1,1));
     var shape1 = new CANNON.Box(new CANNON.Vec3(1,40,3));
     var shape2 = new CANNON.Box(new CANNON.Vec3(1,1,10));

     // var body = new CANNON.Body({ mass: 0 });
     // body.addShape(shape);
     // body.position.set(-5,20,0);
     // world.addBody(body);

     var body1 = new CANNON.Body({ mass: 0 });
     body1.addShape(shape);
     body1.position.set(-10,-5,0);
     world.addBody(body1);

     var body2 = new CANNON.Body({ mass: 0 });
     body2.addShape(shape1);
     body2.position.set(5,40,0);
     world.addBody(body2);

     var body3 = new CANNON.Body({ mass: 0 });
     body3.addShape(shape2);
     body3.position.set(0,0,0);
     world.addBody(body3);


     // var bodya = new CANNON.Body({ mass: 0 });
     // bodya.addShape(shape);
     // bodya.position.set(-5,10,0);
     // world.addBody(bodya);

     // var bodya1 = new CANNON.Body({ mass: 0 });
     // bodya1.addShape(shape);
     // bodya1.position.set(0,6,0);
     // world.addBody(bodya1);

     // var bodya2 = new CANNON.Body({ mass: 0 });
     // bodya2.addShape(shape);
     // bodya2.position.set(5,2,0);
     // world.addBody(bodya2);
     //
     //
     // var bodyb = new CANNON.Body({ mass: 0 });
     // bodyb.addShape(shape);
     // bodyb.position.set(-5,0,0);
     // world.addBody(bodyb);
     //
     // var bodyb1 = new CANNON.Body({ mass: 0 });
     // bodyb1.addShape(shape);
     // bodyb1.position.set(0,-2,0);
     // world.addBody(bodyb1);
     //
     // var bodyb2 = new CANNON.Body({ mass: 0 });
     // bodyb2.addShape(shape);
     // bodyb2.position.set(5,-4,0);
     // world.addBody(bodyb2);

 }

function setup() {
  setupCamera();
  setupWorld();
  setupRenderer();
  addGround();
  addSphere();
  addBoxes();
  cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
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
  renderer.render( scene, camera );
  cannonDebugRenderer.update();
  requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();

  document.onclick = () => {
    addSphere();
  }
});
sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
ballInterval = setInterval(addSphere, 50);
