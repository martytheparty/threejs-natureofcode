let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;



function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    // geometry = new THREE.SphereGeometry( ball.radius, 32, 32 );
    // material = new THREE.MeshNormalMaterial();
    // mesh = new THREE.Mesh( geometry, material );
    // mesh.position.set(ball.position);
    // scene.add( mesh );
    //
    // var geometry = new THREE.BoxGeometry( ball.constraints.x, ball.constraints.y, ball.constraints.z );
    // var wireframe = new THREE.WireframeGeometry( geometry );
    // var line = new THREE.LineSegments( wireframe );
    // line.material.depthTest = false;
    // line.material.transparent = true;
    // scene.add( line );

    var material = new THREE.LineBasicMaterial({
    	color: 0x0000ff
    });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
    	new THREE.Vector3( 0, 0, 0 ),
    	new THREE.Vector3( 10, 30, 100 )
    );

    var line = new THREE.Line( geometry, material );
    scene.add( line );
    draw();
}

const updateSceneData = () => {
  // try {
  //   ball.position.add(ball.velocity);
  //   if (ball.position.x > 100) {
  //     ball.velocity.x = ball.velocity.x*-1;
  //   } else if (ball.position.x < -100) {
  //     ball.velocity.x = ball.velocity.x*-1;
  //   }
  //
  //   if (ball.position.y > 75) {
  //     ball.velocity.y = ball.velocity.y*-1;
  //   } else if (spherePosition.y < -75) {
  //     ball.velocity.y = ball.velocity.y*-1;
  //   }
  //
  //   if (ball.position.z > 75) {
  //     ball.velocity.z = ball.velocity.z*-1;
  //   } else if (spherePosition.z < -75) {
  //     ball.velocity.z = ball.velocity.z*-1;
  //   }
  //
  // } catch (err) {
  //   console.log(err);
  // }
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
    // mesh.position.set(ball.position.x, ball.position.y, ball.position.z);
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
