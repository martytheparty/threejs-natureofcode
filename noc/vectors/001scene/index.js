let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
let xPosition = 0;
let yPosition = 0;
let zPosition = 0;
let xVelocity = 3;
let yVelocity = 4;
let zVelocity = 2;

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    /* Add A Sphere To To Canvas */
    geometry = new THREE.SphereGeometry( 10, 32, 32 );
    //geometry = new THREE.BoxGeometry( 10, 10, 10 );
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(0, 0, 0);
    scene.add( mesh );

    var geometry = new THREE.BoxGeometry( 200, 150, 150 );
    var wireframe = new THREE.WireframeGeometry( geometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;

    line.material.transparent = true;

    //var material = new THREE.MeshBasicMaterial( {color: 0xff0000, wireframe: true} );
    //var cube = new THREE.Mesh( geometry );
    scene.add( line );

    //updateFramerate(10);
    draw();
}

const updateSceneData = () => {
  try {
    xPosition = xPosition + xVelocity;
    yPosition = yPosition + yVelocity;
    zPosition = zPosition + zVelocity;
    if (xPosition > 100) {
      xVelocity = xVelocity*-1;
    } else if (xPosition < -100) {
      xVelocity = xVelocity*-1;
    }

    if (yPosition > 75) {
      yVelocity = yVelocity*-1;
    } else if (yPosition < -75) {
      yVelocity = yVelocity*-1;
    }

    if (zPosition > 75) {
      zVelocity = zVelocity*-1;
    } else if (zPosition < -75) {
      zVelocity = zVelocity*-1;
    }

    // mesh.rotation.x += 0.1;
    // mesh.rotation.y += 0.1;
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
    mesh.position.set(xPosition, yPosition, zPosition);
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
