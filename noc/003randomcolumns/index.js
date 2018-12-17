let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
const boxes = [];
for(let i = 0; i < 10; i++) {
  boxes.push({ cube: {}, count: 0});
}

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    //camera.position.y = 80;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    /* Add A Sphere To To Canvas */
    // geometry = new THREE.SphereGeometry( 10, 32, 32 );
    geometry = new THREE.BoxGeometry( 10, 10, 10 );
    material = new THREE.MeshNormalMaterial();

    boxes.forEach(
      (box, i) => {
        box.cube = new THREE.Mesh( geometry, material );
        box.cube.position.set((i*40 - 200), 0, 0);
        scene.add( box.cube );
      }
    );

    mesh = new THREE.Mesh( geometry, material );

    updateFramerate(10);
    draw();
}

const getNextRandom = () => {
  return Math.floor(Math.random() * 10);
};

const updateSceneData = () => {
  const val = getNextRandom();
  try {
    boxes.forEach(
      (box, i) => {
        if (i === val) {
          box.count = box.count + .1;
        }
        box.cube.rotation.y += 0.1;
        box.cube.scale.y = box.count*10;
      }
    );
    //mesh.rotation.y += 0.1;
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
