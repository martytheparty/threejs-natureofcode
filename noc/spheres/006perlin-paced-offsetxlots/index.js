let camera, scene, renderer, geometry, material;
let framerate = 60;
let meshes = [];
let positions = [];
let count = 1;

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 4000 );
    camera.position.z = 200;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    geometry = new THREE.SphereGeometry( 1, 32, 32 );
    material = new THREE.MeshNormalMaterial();

    for(let i = 0; i < count; i++) {
      meshes[i] = new THREE.Mesh( geometry, material );
      meshes[i].xPosition = 0;
      meshes[i].yPosition = i*2 - 10;
      meshes[i].perlinXOffset = false;
      meshes[i].perlinYOffset = false;
      meshes[i].perlinZOffset = false;
      scene.add( meshes[i] );
    }

    draw();
}

let currentCount = 0;
const setNextRandom = () => {

  currentCount = currentCount + .001;

  meshes.forEach(
    (mesh, i) => {
      mesh.xPosition = Simplex.noise(i, currentCount)*200;
      mesh.yPosition = Simplex.noise(i+count, currentCount)*200;
      mesh.zPosition = Simplex.noise(i+count+count, currentCount)*200;

      if (meshes[i].perlinXOffset === false) {
        mesh.perlinXOffset = mesh.xPosition;
        mesh.perlinYOffset = mesh.yPosition;
        mesh.perlinZOffset = mesh.zPosition;
      }

    }
  );

};

const updateSceneData = () => {
  setNextRandom();
}

let sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);

setInterval(() => {
    meshes[meshes.length] = new THREE.Mesh( geometry, material );
    scene.add( meshes[meshes.length - 1] );
    meshes[meshes.length - 1].perlinXOffset = false;
    meshes[meshes.length - 1].perlinYOffset = false;
    meshes[meshes.length - 1].perlinZOffset = false;
}, 50);

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
        mesh.position.set(mesh.xPosition - mesh.perlinXOffset, mesh.yPosition  - mesh.perlinYOffset, mesh.zPosition - mesh.perlinZOffset);
      }
    );


    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
