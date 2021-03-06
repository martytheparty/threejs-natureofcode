let camera, scene, renderer, geometry, material, mesh, origin, originMesh, bobBall, bobBallMesh, radius = 60, group;
let framerate = 60;
let adding = false;
let springK = .3;
let velocity = 0;
let acceleration = 0;

function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    renderer.domElement.onmousedown =  () => {
      adding = true;
    }

    renderer.domElement.onmouseup =  () => {
      adding = false;
    }

    renderer.domElement.onpointerdown =  () => {
      adding = true;
    }

    renderer.domElement.onpointerup =  () => {
      adding = false;
    }

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

    bobBallMesh.position.set(radius,0,0);

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
    group.rotation.z += 0.05;
    let x = radius - 60;

    if (adding) {
      radius = radius + 10;
      acceleration = 0;
      velocity = 0;
    } else if (radius !== 30) {
      acceleration = x*springK*-1;
      velocity = velocity + acceleration;
    }

    if (radius < 0) {
      radius = 1;
      velocity = velocity*.1;
    } else if (radius < 60) {
      //acceleration = acceleration*.5;
      velocity = velocity*.9;
      radius = radius + velocity;
    } else {
      radius = radius + velocity;
    }

    if (radius < 0) {
      radius = Math.floor(Math.random() * 20);
    }

    bobBallMesh.position.set(radius,0,0)
    console.log(radius);
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
