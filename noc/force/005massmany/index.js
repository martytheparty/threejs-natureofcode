let camera, scene, renderer, geometry, geometry1, material, mesh, mesh1;
let framerate = 60;
let gravity = new MVector(0,-0.2,0);
let wind = new MVector(.01,0,.03);

let ballCount = 4;
let balls = [];

for(var i = 0; i < ballCount; i++){
  let spherePosition = new MVector(0,30,0);
  let sphereVelocity = new MVector(0,0,0);
  let ball = new MBall(i*5 + 5, spherePosition);
  ball.velocity = sphereVelocity;
  ball.mass = i*1 + 1;
  ball.applyGravity(gravity);
  ball.applyForce(wind);
  ball.constraints = new MVector(150, 150, 150);
  balls.push(ball);
}


function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    balls.forEach(
      (ball, i) => {
        geometry = new THREE.SphereGeometry( balls[i].radius, 32, 32 );
        material = new THREE.MeshNormalMaterial();
        let ballMesh =  new THREE.Mesh( geometry, material );
        ballMesh.position.set(balls[i].position);
        balls[i].mesh = ballMesh;
        scene.add(ballMesh);
      }
    );

    geometry = new THREE.BoxGeometry( balls[0].constraints.x, balls[0].constraints.y, balls[0].constraints.z );

    var wireframe = new THREE.WireframeGeometry( geometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.transparent = true;
    scene.add( line );

    draw();
}

const updateSceneData = () => {
  try {
    balls.forEach(
      (ball) => {
        //console.log(ball.velocity.x);
        ball.velocity.add(ball.acceleration);
        ball.position.add(ball.velocity);
        //ball.position.add(ball.velocity);
        //ball.acceleration = new MVector(0,0,0);;
        //console.log(ball.velocity.x);
        ball.applyConstraintsToVelocity(true);
      }
    );
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

    balls.forEach(
      (ball, i) => {
        //console.log(ball.position.x);
        ball.mesh.position.set(ball.position.x, ball.position.y, ball.position.z);
      }
    );


    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
