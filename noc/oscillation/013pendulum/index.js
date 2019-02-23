let camera, scene, renderer, geometry, material, mesh, origin, originMesh, bobBall, bobBallMesh, radius = 80, group;
let framerate = 60;

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    /* Add A Sphere To To Canvas */
    geometry = new THREE.SphereGeometry( radius, 32, 32 );
    //geometry = new THREE.BoxGeometry( 10, 10, 10 );
    //material = new THREE.MeshNormalMaterial();
    material = new THREE.MeshLambertMaterial({color: 0xff0000, transparent: true, opacity: 0.1});
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(0, 0, 0);


    origin = new THREE.BoxGeometry( 5, 5, 5 );
    visibleMaterial = new THREE.MeshNormalMaterial();
    originMesh = new THREE.Mesh( origin, visibleMaterial );

    bobBall = new THREE.SphereGeometry( 10, 32, 32 );
    visibleMaterial = new THREE.MeshNormalMaterial();
    bobBallMesh = new THREE.Mesh( bobBall, visibleMaterial );

    bobBallMesh.position.set(0,-radius,0);

    // scene.add( mesh );
    // scene.add( originBallMesh );
    // scene.add( bobBallMesh );

    group = new THREE.Group();
    group.add(mesh);
    group.add(bobBallMesh);
    group.add(originMesh);
    scene.add(group);



    updateFramerate(10);
    draw();
}

const updateSceneData = () => {
  try {
    // mesh.rotation.x += 0.1;
    // mesh.rotation.y += 0.1;
    group.rotation.z += 0.1;
    //group.rotation.y += 0.1;
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
