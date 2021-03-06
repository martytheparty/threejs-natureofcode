let camera, scene, renderer, geometry, material, mesh, arm, armMesh, origin, originMesh, bobBall, bobBallMesh, radius = 80, group, velocity = 0.1;
let framerate = 60;
let acceleration = .02;

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

    arm = new THREE.BoxGeometry( radius, 2, 0 );
    armMesh = new THREE.Mesh( arm, visibleMaterial );
    armMesh.position.set(radius/2,0,0);

    bobBall = new THREE.SphereGeometry( 10, 32, 32 );
    visibleMaterial = new THREE.MeshNormalMaterial();
    bobBallMesh = new THREE.Mesh( bobBall, visibleMaterial );

    bobBallMesh.position.set(radius,0,0);

    // scene.add( mesh );
    // scene.add( originBallMesh );
    // scene.add( bobBallMesh );

    group = new THREE.Group();
    group.add(mesh);
    group.add(bobBallMesh);
    group.add(originMesh);
    group.add(armMesh);
    scene.add(group);



    updateFramerate(10);
    draw();
}

const updateSceneData = () => {
  try {
    // mesh.rotation.x += 0.1;
    // mesh.rotation.y += 0.1;
    if (velocity > .1) {
      velocity = .1;
    }

    if (velocity < -.1) {
      velocity = -.1;
    }
    group.rotation.z += velocity;
    if (group.rotation.z > 0) {
      velocity = velocity - acceleration;
    }

    if (group.rotation.z < -Math.PI) {
      velocity = velocity + acceleration;
    }

    console.log(group.rotation.z);

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
