let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
let cVelocity = 0;
let cAcceleration = 0;

let boxes = [];
let boxCount = 10;
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
    for(let i = 0; i < boxCount; i++) {
      let box = new THREE.Mesh( geometry, material );
      box.position.set(i*10 - boxCount*5, 0, 0);
      scene.add( box );
      updateFramerate(10);
      box.rotation.x += Math.PI/4;
      box.radius = Math.abs(100);
      boxes.push(box);
    }

    draw();
}

const updateSceneData = () => {
  //console.log(cVelocity);
  try {
    // mesh.rotation.x += 0.1;
    // mesh.rotation.y += 0.1;
    cVelocity += cAcceleration;
    cVelocity += cVelocity;
    cAcceleration += 0.001;
    theta = theta + .1;
    boxes.forEach(
      (box, i) => {
        box.rotation.x += 1;
        box.rotation.y += 1;
        box.rotation.z += 1;

        box.position.set(i*20 - boxCount*10, box.radius * Math.cos(theta + i), 0);
      //  console.log(cVelocity);
      }
    );

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
