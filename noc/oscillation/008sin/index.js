let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
let cVelocity = 0;
let cAcceleration = 0;
let radius = 100;
let theta = 45;

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    /* Add A Sphere To To Canvas */
    geometry = new THREE.BoxGeometry( 10, 10, 10 );
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(radius * Math.cos(theta), radius * Math.sin(theta), 0);
    scene.add( mesh );
    updateFramerate(10);
    mesh.rotation.x += Math.PI/4;
    draw();
}

const updateSceneData = () => {
  try {
    // mesh.rotation.x += 0.1;
    // mesh.rotation.y += 0.1;
    cVelocity += cAcceleration;
    cAcceleration += 0.001;
    mesh.rotation.z += .1;
    theta = theta + .1;
    mesh.position.set(0, radius * Math.sin(theta), 0);
    //mesh.rotation.z += 0.1;

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
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
