let camera, scene, renderer, geometry, material, mesh;
let framerate = 120;
const systems = [];

systems.push(new MParticleSystem());
systems[0].constraints = new MVector(250, 150, 150);
systems.push(new MParticleSystem());
systems[1].constraints = new MVector(50, 150, 150);
//systems.push(new MParticleSystem());

const addBall = () => {


  systems.forEach(
    (system, i) => {

      let spherePosition = new MVector(0,0,0);
      let sphereVelocity = new MVector(0,0,0);
      let xAcc =  (Math.floor(Math.random() * 20)/1000) * (Math.random() < 0.5 ? -1 : 1) ;
      let yAcc =  (Math.floor(Math.random() * 20)/1000) * (Math.random() < 0.5 ? -1 : 1) ;
      let zAcc =  (Math.floor(Math.random() * 20)/1000) * (Math.random() < 0.5 ? -1 : 1) ;
      let sphereAcceleration = new MVector(xAcc,yAcc,zAcc);
      let radius = Math.floor(Math.random() * 10) + 5;

      if (i === 1) {
        radius = 5;
      } else {
        radius = 10;
      }

      let ball = system.addParticle(radius, spherePosition);
      ball.velocity = sphereVelocity;
      ball.acceleration = sphereAcceleration;

      //ball.constraints = new MVector(200, 150, 150);
    }
  );

    addMeshes();

}



function addMeshes() {
  systems.forEach(
    (system) => {
      system.getParticles().forEach(
        (ball) => {
          if (!ball.mesh) {

            geometry = new THREE.SphereGeometry( ball.radius, 32, 32 );
            material = new THREE.MeshNormalMaterial();
            //mesh = new THREE.Mesh( geometry, material );
            let currentMesh = new THREE.Mesh( geometry, material );
            ball.mesh = currentMesh;
            ball.mesh.position.set(ball.position);
            scene.add( ball.mesh );
          }
        }
      );
    }
  );

}

function setup() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 400 );
    camera.position.z = 200;
    camera.position.y = 0;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    addBall();
    systems.forEach(
      (system) => {
        let currentBall = system.getParticles()[0];
        var constraintGeometry = new THREE.BoxGeometry( currentBall.constraints.x, currentBall.constraints.y, currentBall.constraints.z );
        var wireframe = new THREE.WireframeGeometry( constraintGeometry );
        var line = new THREE.LineSegments( wireframe );
        line.material.depthTest = false;
        line.material.transparent = true;
        scene.add( line );
      }
    );

    draw();
}

const updateSceneData = () => {
  systems.forEach(
    (system) => {
      system.decrementTtl();

      system.getParticles().forEach(
        (ball) => {

          ball.velocity.add(ball.acceleration);
          ball.ttl = ball.ttl - 2;

          if (ball.isDead()) {
            ball.acceleration = new MVector(0,0,0);
            ball.velocity = new MVector(0,0,0);
          } else {
            try {
              ball.position.add(ball.velocity);
              //console.log(ball.constraints.x);
              if (ball.position.x > ball.constraints.x/2) {
                ball.velocity.x = ball.velocity.x*-1;
                ball.acceleration.x = ball.acceleration.x*-1;
              } else if (ball.position.x < -1*ball.constraints.x/2) {
                ball.velocity.x = ball.velocity.x*-1;
                ball.acceleration.x = ball.acceleration.x*-1;
              }

              if (ball.position.y > ball.constraints.y/2) {
                ball.velocity.y = ball.velocity.y*-1;
                ball.acceleration.y = ball.acceleration.y*-1;
              } else if (ball.position.y < -1*ball.constraints.y/2) {
                ball.velocity.y = ball.velocity.y*-1;
                ball.acceleration.y = ball.acceleration.y*-1;
              }

              if (ball.position.z > ball.constraints.z/2) {
                ball.velocity.z = ball.velocity.z*-1;
              } else if (ball.position.z < -1*ball.constraints.z/2) {
                ball.velocity.z = ball.velocity.z*-1;
              }

            } catch (err) {
              console.log(err);
            }
          }
        }
      )

    }
  );


}

let sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);

let addBallInterval = setInterval(() => {

  systems.forEach(
    (system) => {
      system.getParticles().forEach(
        (ball, i) => {
          if (ball.isDead()) {
            scene.remove(ball.mesh);
          }
        }
      );

      system.clearDeadParticles();
    }
  );


  addBall();
  addMeshes();

}, 500);

const updateFramerate = (newFrameRate) => {
  framerate = newFrameRate;
  clearInterval(sceneUpdateInterval);
  sceneUpdateInterval = setInterval(updateSceneData, 1000/framerate);
}

function draw() {
    /*
    This function call called on every browser render (requestAnimationFrame) event.
    */
    systems.forEach(
      (system, j) => {
        system.getParticles().forEach(
          (ball, i) => {
            if (ball.isDead()) {
              scene.remove(ball.mesh);
            } else {
              ball.mesh.position.set(ball.position.x, ball.position.y, ball.position.z);
            }
          }
        );
      }
    );

    renderer.render( scene, camera );
    requestAnimationFrame( draw );
}

document.addEventListener("DOMContentLoaded", () => {
  setup();
});
