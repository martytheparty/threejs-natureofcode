let camera, scene, renderer, geometry, material, mesh;
let framerate = 60;
let cVelocity = 0;
let cAcceleration = 0;

let boxes = [];
let boxCount = 100;
let theta = 45;

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 4000 );
    camera.position.y = 500;
    camera.lookAt(new THREE.Vector3(0,0,0));


    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    /* Add A Sphere To To Canvas */
    geometry = new THREE.BoxGeometry( 100, 3, 3 );
    material = new THREE.MeshNormalMaterial();
    for(let i = 0; i < boxCount; i++) {
      let box = new THREE.Mesh( geometry, material );
      box.position.set(i*5 - boxCount*2, 0, 0);
      scene.add( box );
      updateFramerate(10);
      box.rotation.x += Math.PI/4;
      box.radius = 80;
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
    //cVelocity += cVelocity;
    cAcceleration += 0.00001;
    theta = theta + cVelocity;
    boxes.forEach(
      (box, i) => {
        // box.rotation.x += 1;
        // box.rotation.y += 1;
        // box.rotation.z += 1;

        box.position.set(i*6 - boxCount*3, box.radius * Math.sin(theta + i), box.radius * Math.cos(theta + i));
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
