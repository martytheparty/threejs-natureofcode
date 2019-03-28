let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
const systems = [];

const pSystem = new MParticleSystem();

systems.push(pSystem);



const addBall = () => {
  let spherePosition = new MVector(0,0,0);
  let sphereVelocity = new MVector(0,0,0);
  let xAcc =  (Math.floor(Math.random() * 20)/1000) * (Math.random() < 0.5 ? -1 : 1) ;
  let yAcc =  (Math.floor(Math.random() * 20)/1000) * (Math.random() < 0.5 ? -1 : 1) ;
  let zAcc =  (Math.floor(Math.random() * 20)/1000) * (Math.random() < 0.5 ? -1 : 1) ;
  let sphereAcceleration = new MVector(xAcc,yAcc,zAcc);
  let radius = Math.floor(Math.random() * 10) + 5;

  let ball = systems[0].addParticle(radius, spherePosition);

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

    systems[0].getParticles().forEach(
      (ball) => {
        geometry = new THREE.SphereGeometry( ball.radius, 32, 32 );
        material = new THREE.MeshNormalMaterial();
        mesh = new THREE.Mesh( geometry, material );
        ball.mesh = mesh;
        mesh.position.set(ball.position);
        scene.add( mesh );
      }
    );

    let currentBall = systems[0].getParticles()[0];
    var constraintGeometry = new THREE.BoxGeometry( currentBall.constraints.x, currentBall.constraints.y, currentBall.constraints.z );
    var wireframe = new THREE.WireframeGeometry( constraintGeometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.transparent = true;
    scene.add( line );

    draw();
}

const updateSceneData = () => {
  systems[0].decrementTtl();

  systems[0].getParticles().forEach(
    (ball) => {
      ball.velocity.add(ball.acceleration);
      ball.ttl = ball.ttl - 2;

      if (ball.isDead()) {
        ball.acceleration = new MVector(0,0,0);
        ball.velocity = new MVector(0,0,0);
      } else {
        try {
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
  systems[0].getParticles().forEach(
    (ball, i) => {
      if (ball.isDead()) {
        scene.remove(ball.mesh);
      }
    }
  );

  systems[0].clearDeadParticles();

  let ball = addBall();
  geometry = new THREE.SphereGeometry( ball.radius, 32, 32 );
  material = new THREE.MeshNormalMaterial();
  mesh = new THREE.Mesh( geometry, material );
  ball.mesh = mesh;
  mesh.position.set(ball.position);
  scene.add( mesh );

}, 500);

const updateFramerate = (newFrameRate) => {
  framerate = newFrameRate;
  clearInterval(sceneUpdateInterval);
  sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
}

function draw() {
    /*
    This function call called on every browser render (requestAnimationFrame) event.
    */

    systems[0].getParticles().forEach(
      (ball, i) => {
        if (ball.isDead()) {
          scene.remove(ball.mesh);
        } else {
          ball.mesh.position.set(ball.position.x, ball.position.y, ball.position.z);
        }
      }
    );

    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
