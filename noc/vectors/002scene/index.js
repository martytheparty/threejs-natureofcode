let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
let spherePosition = new MVector(0,0,0);
let sphereVelocity = new MVector(3,4,2);

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    geometry = new THREE.SphereGeometry( 10, 32, 32 );
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(0, 0, 0);
    scene.add( mesh );

    var geometry = new THREE.BoxGeometry( 200, 150, 150 );
    var wireframe = new THREE.WireframeGeometry( geometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.transparent = true;
    scene.add( line );

    draw();
}

const updateSceneData = () => {
  try {
    spherePosition.add(sphereVelocity);
    if (spherePosition.x > 100) {
      sphereVelocity.x = sphereVelocity.x*-1;
    } else if (spherePosition.x < -100) {
      sphereVelocity.x = sphereVelocity.x*-1;
    }

    if (spherePosition.y > 75) {
      sphereVelocity.y = sphereVelocity.y*-1;
    } else if (spherePosition.y < -75) {
      sphereVelocity.y = sphereVelocity.y*-1;
    }

    if (spherePosition.z > 75) {
      sphereVelocity.z = sphereVelocity.z*-1;
    } else if (spherePosition.z < -75) {
      sphereVelocity.z = sphereVelocity.z*-1;
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
    mesh.position.set(spherePosition.x, spherePosition.y, spherePosition.z);
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
