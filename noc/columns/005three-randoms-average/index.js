let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
const boxes = [];
for(let i = 0; i < 100; i++) {
  boxes.push({ cube: {}, count: .1});
}

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 4000 );
    camera.position.z = 800;
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
        box.cube.position.set((i*20 - 1000), 0, 0);
        scene.add( box.cube );
      }
    );

    mesh = new THREE.Mesh( geometry, material );

    updateFramerate(60);
    draw();
}

const getNextRandom = () => {
  const count = 3;
  let total = 0;
  for (let i = 0; i < count; i++) {
    total = total + Math.floor(Math.random() * boxes.length);
  }
  const rnd = total/count;
  return rnd;
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
