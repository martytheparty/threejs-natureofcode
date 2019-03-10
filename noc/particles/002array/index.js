let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;

let spherePosition = new MVector(0,0,0);
let sphereVelocity = new MVector(0,0,0);
let sphereAcceleration = new MVector(0.01,0.01,0.01);
let balls = [];
let ball = new MParticle(10, spherePosition);

balls.push(ball);
ball.velocity = sphereVelocity;
ball.acceleration = sphereAcceleration;
ball.constraints = new MVector(200, 150, 150);

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
    balls[0].mesh = mesh;
    mesh.position.set(ball.position);
    scene.add( mesh );

    var geometry = new THREE.BoxGeometry( ball.constraints.x, ball.constraints.y, ball.constraints.z );
    var wireframe = new THREE.WireframeGeometry( geometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.transparent = true;
    scene.add( line );

    draw();
}

const updateSceneData = () => {
  //console.log(ball.acceleration);
  balls[0].velocity.add(ball.acceleration);
  balls[0].ttl--;
  if (balls[0].isDead()) {
    // set velocity and accelleratin to 0
    balls[0].acceleration = new MVector(0,0,0);
    balls[0].velocity = new MVector(0,0,0);
    //alert('remove ball');
    //scene.remove( ball );
  } else {
    try {
      console.log('*******');
      balls[0].position.add(balls[0].velocity);
      if (balls[0].position.x > 100) {
        balls[0].velocity.x = balls[0].velocity.x*-1;
        balls[0].acceleration.x = balls[0].acceleration.x*-1;
      } else if (ball.position.x < -100) {
        balls[0].velocity.x = balls[0].velocity.x*-1;
        balls[0].acceleration.x = balls[0].acceleration.x*-1;
      }

      if (balls[0].position.y > 75) {
        balls[0].velocity.y = balls[0].velocity.y*-1;
        balls[0].acceleration.y = balls[0].acceleration.y*-1;
      } else if (spherePosition.y < -75) {
        balls[0].velocity.y = balls[0].velocity.y*-1;
        balls[0].acceleration.y = balls[0].acceleration.y*-1;
      }

      if (balls[0].position.z > 75) {
        balls[0].velocity.z = balls[0].velocity.z*-1;
      } else if (spherePosition.z < -75) {
        balls[0].velocity.z = balls[0].velocity.z*-1;
      }

    } catch (err) {
      console.log(err);
    }
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
    if (balls[0].isDead()) {
      scene.remove(balls[0].mesh);
    } else {
      balls[0].mesh.position.set(balls[0].position.x, balls[0].position.y, balls[0].position.z);
    }
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
