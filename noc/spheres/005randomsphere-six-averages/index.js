let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
let xPosition = 0;

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 4000 );
    camera.position.z = 10;
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

    updateFramerate(10);
    draw();
}

const getNextRandom = () => {
  const count = 6;
  let total = 0;
  for (let i = 0; i < count; i++) {
    total = total + Math.random() * 20;
  }
  const rnd = total/count;
  return rnd;
};

const updateSceneData = () => {
  const val = getNextRandom();
  xPosition = val;
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
    mesh.position.set((xPosition-10), 0, 0);
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
