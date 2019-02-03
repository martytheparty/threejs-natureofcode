let camera, scene, renderer, geometry, geometry1, material, mesh, mesh1;
let framerate = 60;
let gravity = new MVector(0,-0.01,0);
let wind = new MVector(0.05,0,0);


let spherePosition = new MVector(-70,70,0);
let sphereVelocity = new MVector(0,0,0);
//let sphereAcceleration = new MVector(0,-0.01,0);
let ball = new MBall(10, spherePosition);
ball.velocity = sphereVelocity;
ball.mass = 2;
ball.applyForce(gravity);
ball.applyForce(wind);

ball.constraints = new MVector(150, 150, 150);


let spherePosition1 = new MVector(-70,70,0);
let sphereVelocity1 = new MVector(0,0,0);
let ball1 = new MBall(5, spherePosition1);
ball1.velocity = sphereVelocity1;
ball1.mass = 1;
ball1.applyForce(gravity);
ball1.applyForce(wind);

ball1.constraints = new MVector(150, 150, 150);


function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    geometry = new THREE.SphereGeometry( ball.radius, 32, 32 );
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(ball.position);
    scene.add( mesh );

    geometry1 = new THREE.SphereGeometry( ball1.radius, 32, 32 );
    mesh1 = new THREE.Mesh( geometry1, material );
    mesh1.position.set(ball1.position);

    scene.add( mesh );
    scene.add( mesh1 );


    geometry = new THREE.BoxGeometry( ball.constraints.x, ball.constraints.y, ball.constraints.z );

    var wireframe = new THREE.WireframeGeometry( geometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.transparent = true;
    scene.add( line );

    draw();
}

const updateSceneData = () => {
  //console.log(ball.acceleration);
  ball.velocity.add(ball.acceleration);
  ball1.velocity.add(ball1.acceleration);
  try {
    ball.position.add(ball.velocity);
    ball1.position.add(ball1.velocity);
    if (ball.position.x > 75) {
      ball.velocity.x = ball.velocity.x*-1;
    } else if (ball.position.x < -75) {
      ball.velocity.x = ball.velocity.x*-1;
    }

    if (ball.position.y > 75) {
      ball.velocity.y = ball.velocity.y*-1;
    } else if (spherePosition.y < -75) {
      ball.velocity.y = ball.velocity.y*-1;
    }

    if (ball.position.z > 75) {
      ball.velocity.z = ball.velocity.z*-1;
    } else if (spherePosition.z < -75) {
      ball.velocity.z = ball.velocity.z*-1;
    }

    if (ball1.position.x > 100) {
      ball1.velocity.x = ball1.velocity.x*-1;
    } else if (ball1.position.x < -100) {
      ball1.velocity.x = ball1.velocity.x*-1;
    }

    if (ball1.position.y > 75) {
      ball1.velocity.y = ball1.velocity.y*-1;
    } else if (ball.position.y < -75) {
      ball1.velocity.y = ball1.velocity.y*-1;
    }

    if (ball1.position.z > 75) {
      ball1.velocity.z = ball1.velocity.z*-1;
    } else if (ball1.position.z < -75) {
      ball1.velocity.z = ball1.velocity.z*-1;
    }

  } catch (err) {
    console.log(err);
  }
}

let sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);

const updateFramerate = (newFrameRate) => {

  framerate = newFrameRate;
  clearInterval(sceneUpdateInterval);
  sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
}

function draw() {
    /*
    This function call called on every browser render (requestAnimationFrame) event.
    */
    mesh.position.set(ball.position.x, ball.position.y, ball.position.z);
    mesh1.position.set(ball1.position.x, ball.position.y, ball.position.z);
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
