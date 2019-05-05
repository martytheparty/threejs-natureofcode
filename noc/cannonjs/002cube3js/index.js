let world, body, shape, timeStep=1/60,
camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
//let cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
let mass = 5, radius = .2;
let spheres = [];
let sphere = {};

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

  /* 3JS Ground Shape */
 geometry = new THREE.PlaneGeometry( 360, 360 );
 material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
 plane = new THREE.Mesh( geometry, material );
 scene.add( plane );
 plane.rotation.x = Math.PI/12;
 plane.rotation.y = Math.PI/12;

}

function addSphere() {

  if (spheres.length > 500) {
    spheres.shift();
  }

  let sphereShape = new CANNON.Sphere(radius); // Step 1
  let sphereBody = new CANNON.Body({mass: 15, shape: sphereShape}); // Step 2
  let yPos = Math.random() * 20;
  sphereBody.position.set(-10,yPos,10);
  world.add(sphereBody); // Step 3

  /* Add A Sphere To To Canvas */
  geometry = new THREE.SphereGeometry( radius, 32, 32 );
  //geometry = new THREE.BoxGeometry( 10, 10, 10 );
  material = new THREE.MeshNormalMaterial();
  mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(-10, yPos, 10);
  scene.add( mesh );

  sphere.mesh = mesh;
  sphere.physics = sphereBody;

  spheres.push({physics: sphereBody, mesh: mesh});


}

function addBox(dimensions, position) {

}

function addBoxes(){
     // Physics
     var shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
     var shape1 = new CANNON.Box(new CANNON.Vec3(1,40,3));
     var shape2 = new CANNON.Box(new CANNON.Vec3(1,1,10));

     // var body = new CANNON.Body({ mass: 0 });
     // body.addShape(shape);
     // body.position.set(-5,20,0);
     // world.addBody(body);

     var body1 = new CANNON.Body({ mass: 0 });
     body1.addShape(shape);
     body1.position.set(0,0,0);
     world.addBody(body1);

     /* Add A Sphere To To Canvas */

     geometry = new THREE.BoxGeometry( 2, 2, 2);
    // geometry = new THREE.SphereGeometry( radius, 32, 32 );
     //geometry = new THREE.BoxGeometry( 10, 10, 10 );
     material = new THREE.MeshNormalMaterial();
     mesh = new THREE.Mesh( geometry, material );
     mesh.position.set(0, 0, 0);
     scene.add( mesh );


     // var body2 = new CANNON.Body({ mass: 0 });
     // body2.addShape(shape1);
     // body2.position.set(5,40,0);
     // world.addBody(body2);

    //  let geometry1 = new THREE.BoxGeometry( 1, 40, 3);
    // // geometry = new THREE.SphereGeometry( radius, 32, 32 );
    //  //geometry = new THREE.BoxGeometry( 10, 10, 10 );
    //  material = new THREE.MeshNormalMaterial();
    //  let mesh1 = new THREE.Mesh( geometry1, material );
    //  mesh1.position.set(5,40,0);
    //  scene.add( mesh1 );
    //
    //
    //
    //  var body3 = new CANNON.Body({ mass: 0 });
    //  body3.addShape(shape2);
    //  body3.position.set(0,0,0);
    //  world.addBody(body3);
    //
    //  let geometry2 = new THREE.BoxGeometry( 1, 40, 3);
    // // geometry = new THREE.SphereGeometry( radius, 32, 32 );
    //  //geometry = new THREE.BoxGeometry( 10, 10, 10 );
    //  material = new THREE.MeshNormalMaterial();
    //  let mesh2 = new THREE.Mesh( geometry2, material );
    //  mesh2.position.set(0,0,0);
    //  scene.add( mesh2 );


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
//  cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );
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
  // cannonDebugRenderer.update();
    spheres.forEach(
      (sphere) => {
          //console.log(sphere.physics.position.x);
          sphere.mesh.position.set(sphere.physics.position.x, sphere.physics.position.y, sphere.physics.position.z);

      }
    );

  requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();

  document.onclick = () => {
    addSphere();
  }
});
sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
ballInterval = setInterval(addSphere, 500);
