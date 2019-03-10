let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;

let spherePosition = new MVector(0,0,0);
let sphereVelocity = new MVector(0,0,0);
let sphereAcceleration = new MVector(0.01,0.01,0.01);
let ball = new MParticle(10, spherePosition);
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
  ball.velocity.add(ball.acceleration);
  ball.ttl--;
  if (ball.ttl < 0) {
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
      } else if (spherePosition.y < -75) {
        ball.velocity.y = ball.velocity.y*-1;
        ball.acceleration.y = ball.acceleration.y*-1;
      }

      if (ball.position.z > 75) {
        ball.velocity.z = ball.velocity.z*-1;
      } else if (spherePosition.z < -75) {
        ball.velocity.z = ball.velocity.z*-1;
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
    if (ball.ttl >= 0) {
      mesh.position.set(ball.position.x, ball.position.y, ball.position.z);
    } else {
      scene.remove(mesh);
    }
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
