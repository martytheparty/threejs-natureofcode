let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
let cVelocity = 0;
let cAcceleration = 0;
let currentCount = 0;
let yPos = 0;

let boxes = [];
let boxCount = 10;

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.z = 100;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    /* Add A Sphere To To Canvas */
    geometry = new THREE.BoxGeometry( 5, 10, 5 );
    material = new THREE.MeshNormalMaterial();
    for(let i = 0; i < boxCount; i++) {
      let box = new THREE.Mesh( geometry, material );
      box.position.set(i*20 - boxCount*10, yPos, 0);
      scene.add( box );
      updateFramerate(10);
      box.rotation.x += Math.PI/4;
      boxes.push(box);
    }

    draw();
}

const updateSceneData = () => {

  try {
    cAcceleration = Simplex.noise(0, currentCount);
    cVelocity += cAcceleration;
    currentCount = currentCount + .01;



    boxes.forEach(
      (box, i) => {
        box.rotation.z = cVelocity;
        box.position.set(i*20 - boxCount*10, 0, 0);
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
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
