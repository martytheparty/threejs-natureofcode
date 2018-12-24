let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
let xPosition = 0;
let yPosition = 0;

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 4000 );
    camera.position.z = 20;
    //camera.position.y = 80;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    /* Add A Sphere To To Canvas */
    geometry = new THREE.SphereGeometry( 1, 32, 32 );
    //geometry = new THREE.BoxGeometry( 10, 10, 10 );
    material = new THREE.MeshNormalMaterial();


    mesh = new THREE.Mesh( geometry, material );
    //mesh.position.set(100, 0, 0);
    scene.add( mesh );

    //mesh = new THREE.Mesh( geometry, material );

    //updateFramerate(10);
    draw();
}

let currentCount = 0;
const setNextRandom = () => {
  const val = Simplex.noise(1, currentCount)*20;
  const val2 = Simplex.noise(2, currentCount)*20;
  xPosition = val;
  yPosition = val2;
  currentCount = currentCount + .01;
  return val;
};

const updateSceneData = () => {
  setNextRandom();
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
    mesh.position.set(xPosition, yPosition, 0);
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
