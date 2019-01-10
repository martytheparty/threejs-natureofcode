let camera, scene, renderer, geometry, material, mesh, line;
let framerate = 60;
let lineStartPosition = new MVector(0,0,0);
let lineEndPosition = new MVector(10,30,100);



function setup() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var material = new THREE.LineBasicMaterial({
    	color: 0x0000ff
    });

    geometry = new THREE.Geometry();
    geometry.vertices.push(
    	new THREE.Vector3( lineStartPosition.x, lineStartPosition.y, lineStartPosition.z ),
    	new THREE.Vector3( lineEndPosition.x, lineEndPosition.y, lineEndPosition.z )
    );

    line = new THREE.Line( geometry, material );
    //console.log(geometry);
    scene.add( line );
    draw();
}

const updateSceneData = () => {

  try {
    scene.remove(line);

    geometry = new THREE.Geometry();
    lineEndPosition.x = -1*lineEndPosition.x;
    lineEndPosition.y = lineEndPosition.y;
    lineEndPosition.z = lineEndPosition.z;
    geometry.vertices.push(
    	new THREE.Vector3( lineStartPosition.x, lineStartPosition.y, lineStartPosition.z ),
    	new THREE.Vector3( lineEndPosition.x, lineEndPosition.y, lineEndPosition.z )
    );

    line = new THREE.Line( geometry, material );
    scene.add( line );

  } catch(err) {
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
    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
