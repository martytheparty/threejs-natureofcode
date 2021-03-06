let camera, scene, renderer, geometry, material, mesh, followers, followersMesh;
let framerate = 60;
let followerCount = 100;

let spherePosition = new MVector(10,10,10);
let sphereVelocity = new MVector(1,2,.3);
let sphereAcceleration = new MVector(0,0,0);
let ball = new MBall(10, spherePosition);

followers = [];
followersMesh = [];

for (let i = 0; i < followerCount; i++) {
  let followerPosition = new MVector(i*10,i*10,i*10);
  let followerVelocity = new MVector(0,0,0);
  let followerAcceleration = new MVector(0,0,0);
  let follower = new MBall(5, followerPosition);
  follower.velocity = followerVelocity;
  follower.acceleration = followerAcceleration;
  followers.push(follower);
}



ball.velocity = sphereVelocity;
ball.acceleration = sphereAcceleration;
ball.constraints = new MVector(200, 150, 150);

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 4000 );
    camera.position.z = 800;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    geometry = new THREE.SphereGeometry( ball.radius, 32, 32 );
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(ball.position);
    // scene.add( mesh );

    followers.forEach(
      (follower) => {
        //console.log(follower);
        let geo = new THREE.SphereGeometry( follower.radius, 32, 32 );
        let followerMesh = new THREE.Mesh( geo, material );
        followersMesh.push(followerMesh);
        scene.add( followerMesh );
      }
    );
    //console.log(followersMesh);

    geometry = new THREE.BoxGeometry( ball.constraints.x, ball.constraints.y, ball.constraints.z );
    var wireframe = new THREE.WireframeGeometry( geometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.transparent = true;
    //scene.add( line );

    draw();
}

const updateSceneData = () => {

  followers.forEach(
    (follower) => {
      let newFollowerAcceleration = new MVector(ball.position.x,ball.position.y,ball.position.z);
      newFollowerAcceleration.subtract(follower.position);
      //newFollowerAcceleration = newFollowerAcceleration.normalize();
      follower.acceleration.add(newFollowerAcceleration);
      follower.acceleration.normalize();
      follower.acceleration = follower.acceleration.multiply(.3);
      //
      follower.velocity.add(follower.acceleration);
      follower.position.add(follower.velocity);
    }
  );


  // follower.position = newFollowerAcceleration;
  // console.log(newFollowerAcceleration.x);
  // console.log(follower.acceleration.x);

  ball.velocity.add(ball.acceleration);
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

    followersMesh.forEach(
      (followerMesh, i) => {
        followerMesh.position.set(followers[i].position.x, followers[i].position.y, followers[i].position.z);
      }
    );
    //mesh1.position.set(follower.position.x, follower.position.y, follower.position.z);
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
