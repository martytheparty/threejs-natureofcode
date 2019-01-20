let camera, scene, renderer, geometry, geometry1, material, mesh, mesh1, wireframe, line, box;
let framerate = 60;

let ball = new MBall(10, new MVector(0,0,0));
ball.velocity =  new MVector(0,0,0);
ball.acceleration =  new MVector(0.01,0.01,0.01);
ball.constraints = new MVector(200, 150, 150);

let ball1 = new MBall(10, new MVector(0,0,0));
ball1.velocity = new MVector(0,0,0);
ball1.acceleration =  new MVector(0.01,0.01,-0.01);
ball1.constraints = new MVector(200, 150, 150);

let ball2 = new MBall(10, new MVector(0,0,0));
ball2.velocity = new MVector(0,0,0);
ball2.acceleration =  new MVector(0.01,-0.01,0.01);
ball2.constraints = new MVector(200, 150, 150);

let ball3 = new MBall(10, new MVector(0,0,0));
ball3.velocity = new MVector(0,0,0);
ball3.acceleration =  new MVector(0.01,-0.01,-0.01);
ball3.constraints = new MVector(200, 150, 150);

let ball4 = new MBall(10, new MVector(0,0,0));
ball4.velocity = new MVector(0,0,0);
ball4.acceleration =  new MVector(-0.01,0.01,0.01);
ball4.constraints = new MVector(200, 150, 150);

let ball5 = new MBall(10, new MVector(0,0,0));
ball5.velocity = new MVector(0,0,0);
ball5.acceleration =  new MVector(-0.01,0.01,-0.01);
ball5.constraints = new MVector(200, 150, 150);

let ball6 = new MBall(10, new MVector(0,0,0));
ball6.velocity = new MVector(0,0,0);
ball6.acceleration =  new MVector(-0.01,-0.01,0.01);
ball6.constraints = new MVector(200, 150, 150);

let ball7 = new MBall(10, new MVector(0,0,0));
ball7.velocity = new MVector(0,0,0);
ball7.acceleration =  new MVector(-0.01,-0.01,-0.01);
ball7.constraints = new MVector(200, 150, 150);


let balls = [];
balls.push(ball);
balls.push(ball1);
balls.push(ball2);
balls.push(ball3);
balls.push(ball4);
balls.push(ball5);
balls.push(ball6);
balls.push(ball7);

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
        mesh.position.set(balls.position);
        ball.mesh = mesh;
        scene.add( mesh );
      }
    );

    box = new THREE.BoxGeometry( ball.constraints.x, ball.constraints.y, ball.constraints.z );
    wireframe = new THREE.WireframeGeometry( box );
    line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.transparent = true;
    //scene.add( line );

    draw();
}

const updateSceneData = () => {

  try {
    balls.forEach(
      (ball) => {
        ball.acceleration.normalDistribution().multiply(.001);
        ball.velocity.add(ball.acceleration);
        ball.position.add(ball.velocity);
        ball.applyConstraintsToVelocity();
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
      (ball) => {
        ball.position.x = isNaN(ball.position.x) ? 0 : ball.position.x;
        ball.position.y = isNaN(ball.position.y) ? 0 : ball.position.y;
        ball.position.z = isNaN(ball.position.z) ? 0 : ball.position.z;

        ball.mesh.position.set(ball.position.x, ball.position.y, ball.position.z);
      }
    );

    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
