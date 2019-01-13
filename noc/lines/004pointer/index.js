let camera, scene, renderer, geometry, material, mesh, line, line1, line2, line3;
let framerate = 60;
let lineStartPosition = new MVector(0,0,0);
let lineEndPosition = new MVector(10,30,100);

let ball = new MBall(10, new MVector(0,0,0));
ball.velocity =  new MVector(3,4,2);
ball.constraints = new MVector(200, 150, 150);

let ball1 = new MBall(10, new MVector(0,0,0));
ball1.velocity = new MVector(-3,2,4);
ball1.constraints = new MVector(200, 150, 150);

let balls = [];
balls.push(ball);
balls.push(ball1);

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var material = new THREE.LineBasicMaterial({
    	color: 0x0000ff
    });

    geometry = new THREE.Geometry();
    geometry.vertices.push(
    	new THREE.Vector3( lineStartPosition.x, lineStartPosition.y, lineStartPosition.z ),
    	new THREE.Vector3( lineEndPosition.x, lineEndPosition.y, lineEndPosition.z )
    );

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
    scene.add( line );



    draw();
}

const updateSceneData = () => {

  try {
    balls.forEach(
      (ball) => {
        ball.position.add(ball.velocity);
        ball.applyConstraintsToVelocity();

      }
    );
    scene.remove(line2);
    scene.remove(line3);
    let pos1 = new MVector(balls[0].position.x, balls[0].position.y, balls[0].position.z);
    let pos2 = new MVector(balls[1].position.x, balls[1].position.y, balls[1].position.z);


    let geo = new THREE.Geometry();
    geo.vertices.push(
    	new THREE.Vector3( pos1.x, pos1.y, pos1.z ),
    	new THREE.Vector3( pos2.x, pos2.y, pos2.z )
    );

    let fPos2 = pos2.normalize().multiply(25);

    let geo1 = new THREE.Geometry();
    geo1.vertices.push(
    	new THREE.Vector3(0, 0, 0 ),
    	new THREE.Vector3( fPos2.x, fPos2.y, fPos2.z )
    );

    line2 = new THREE.Line( geo1, material );
    scene.add( line2 );

  let fPos1 = pos1.normalize().multiply(25);

    let geo2 = new THREE.Geometry();
    geo2.vertices.push(
    	new THREE.Vector3(0, 0, 0 ),
    	new THREE.Vector3( fPos1.x, fPos1.y, fPos1.z )
    );

    line3 = new THREE.Line( geo2, material );
    scene.add( line3 );


  } catch(err) {
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

  balls.forEach(
    (ball) => {
      ball.mesh.position.set(ball.position.x, ball.position.y, ball.position.z);
    }
  );

    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
