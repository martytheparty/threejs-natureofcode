let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;


let balls = [];

const addBall = () => {
  let spherePosition = new MVector(0,0,0);
  let sphereVelocity = new MVector(0,0,0);
  let sphereAcceleration = new MVector(0.01,0.01,0.01);

  let ball = new MParticle(10, spherePosition);

  balls.push(ball);
  ball.velocity = sphereVelocity;
  ball.acceleration = sphereAcceleration;
  ball.constraints = new MVector(200, 150, 150);
  return ball;
}

addBall();

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    balls.forEach(
      (ball) => {
        geometry = new THREE.SphereGeometry( ball.radius, 32, 32 );
        material = new THREE.MeshNormalMaterial();
        mesh = new THREE.Mesh( geometry, material );
        ball.mesh = mesh;
        mesh.position.set(ball.position);
        scene.add( mesh );
      }
    );

    var constraintGeometry = new THREE.BoxGeometry( balls[0].constraints.x, balls[0].constraints.y, balls[0].constraints.z );
    var wireframe = new THREE.WireframeGeometry( constraintGeometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.transparent = true;
    scene.add( line );

    draw();
}

const updateSceneData = () => {
  //console.log(ball.acceleration);
  balls.forEach(
    (ball) => {
      ball.velocity.add(ball.acceleration);
      ball.ttl--;

      console.log(ball.ttl);
      if (ball.isDead()) {
        // set velocity and accelleratin to 0
        ball.acceleration = new MVector(0,0,0);
        ball.velocity = new MVector(0,0,0);
        //alert('remove ball');
        //scene.remove( ball );
      } else {
        try {
          console.log('*******');
          ball.position.add(ball.velocity);
          if (ball.position.x > 100) {
            ball.velocity.x = ball.velocity.x*-1;
            ball.acceleration.x = ball.acceleration.x*-1;
          } else if (ball.position.x < -100) {
            ball.velocity.x = ball.velocity.x*-1;
            ball.acceleration.x = ball.acceleration.x*-1;
          }

          if (ball.position.y > 75) {
            ball.velocity.y = ball.velocity.y*-1;
            ball.acceleration.y = ball.acceleration.y*-1;
          } else if (ball.position.y < -75) {
            ball.velocity.y = ball.velocity.y*-1;
            ball.acceleration.y = ball.acceleration.y*-1;
          }

          if (ball.position.z > 75) {
            ball.velocity.z = ball.velocity.z*-1;
          } else if (ball.position.z < -75) {
            ball.velocity.z = ball.velocity.z*-1;
          }

        } catch (err) {
          console.log(err);
        }
      }
    }
  );

}

let sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);

let addBallInterval = setInterval(() => {
  let ball = addBall();
  geometry = new THREE.SphereGeometry( ball.radius, 32, 32 );
  material = new THREE.MeshNormalMaterial();
  mesh = new THREE.Mesh( geometry, material );
  ball.mesh = mesh;
  mesh.position.set(ball.position);
  scene.add( mesh );
  console.log('ball added...');
}, 5000);

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
        console.log(ball.isDead());
        if (ball.isDead()) {
          scene.remove(ball.mesh);
        } else {
          ball.mesh.position.set(ball.position.x, ball.position.y, ball.position.z);
        }
      }
    );

    balls = balls.filter(
      (ball) => {
        return !ball.isDead();
      }
    );

    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
