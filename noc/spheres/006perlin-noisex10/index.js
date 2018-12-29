let camera, scene, renderer, geometry, material;
let framerate = 60;
let meshes = [];
let positions = [];
let count = 10;


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

    for(let i = 0; i < count; i++) {
      meshes[i] = new THREE.Mesh( geometry, material );
      meshes[i].xPosition = 0;
      meshes[i].yPosition = i*2 - 10;
        scene.add( meshes[i] );
    }

    //mesh = new THREE.Mesh( geometry, material );

    //updateFramerate(10);
    draw();
}

let currentCount = 0;
const setNextRandom = () => {

  currentCount = currentCount + .01;

  meshes.forEach(
    (mesh, i) => {
      mesh.xPosition = Simplex.noise(i, currentCount)*20;
    }
  );

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

    meshes.forEach(
      (mesh) => {
        mesh.position.set(mesh.xPosition, mesh.yPosition, 0);
      }
    );


    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
