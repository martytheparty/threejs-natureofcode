/*
* The idea of this library is to make functions that return objects that
* have:
* 1. General Attributes of objects
* 2. A reference to an object in CannonJS Physics Engine World
* 3. A rererence to an object in a 3JS Scene
*
* NOT IN THIS LIBRARY:
* - a list of objects
* - interaction logic between objects
*
* TO SUM UP:
* Basic utility like functions that accept argurment and return objects is all
* that should ever exist in this file.
*/

/*

fixedCuboid descriptor
{
  position: { x: number, y: number, z: number },
  rotation: { x: number, y: number, z: number },
  dimensions { width: number, height: number, depth: number },
  scene: threeJsScene,
  world; cannonJsWorld,
  debugWorld: debugWorld,
  material: cannonJsMaterial
}

*/


const createContact = (object1, object2) => {
  /*
    Defines what happens when two materials meet.

    https://schteppe.github.io/cannon.js/docs/classes/ContactMaterial.html
  */


}

const fixedCuboid = (descriptor) => {
  /* This is something like a ground or a building... ie something that doesn't move */

  let material = descriptor.material | {};
  let cannonShape = new CANNON.Box(new CANNON.Vec3(descriptor.dimensions.width, descriptor.dimensions.depth, descriptor.dimensions.height));
  let cannonBody = new CANNON.Body({ mass: 0 }, material);
  cannonBody.addShape(cannonShape);
  cannonBody.position.set(descriptor.position.x,descriptor.position.y,descriptor.position.z);
  cannonBody.quaternion.setFromEuler(descriptor.rotation.x, descriptor.rotation.y, descriptor.rotation.z);

  if (descriptor.debugWorld) {
    descriptor.debugWorld.addBody(cannonBody);
  }

  descriptor.world.add(cannonBody);

  let threeShape = new THREE.BoxGeometry( descriptor.dimensions.width*2, descriptor.dimensions.depth*2, descriptor.dimensions.height*2 );
  let mat = new THREE.MeshNormalMaterial();
  let threeMesh = new THREE.Mesh( threeShape, mat );
  threeMesh.position.set(descriptor.position.x,descriptor.position.y,descriptor.position.z);
  threeMesh.rotation.x = descriptor.rotation.x;
  threeMesh.rotation.y = descriptor.rotation.y;
  threeMesh.rotation.z = descriptor.rotation.z;




  return { cannon: cannonBody, three: threeMesh };

}

/*

dynamicCuboid descriptor
{
  position: { x: number, y: number, z: number },
  rotation: { x: number, y: number, z: number },
  dimensions { width: number, height: number, depth: number },
  mass: number,
  scene: threeJsScene,
  world; cannonJsWorld,
  debugWorld: debugWorld
}

*/
const dynamicCuboid = (descriptor) => {
  /* This is something like a ground or a building... ie something that doesn't move */
  let material = descriptor.material | {};
  let cannonShape = new CANNON.Box(new CANNON.Vec3(descriptor.dimensions.width, descriptor.dimensions.depth, descriptor.dimensions.height));
  let cannonBody = new CANNON.Body({ mass: descriptor.mass });
  cannonBody.addShape(cannonShape);
  cannonBody.position.set(descriptor.position.x,descriptor.position.y,descriptor.position.z);
  cannonBody.quaternion.setFromEuler(descriptor.rotation.x, descriptor.rotation.y, descriptor.rotation.z);

  if (descriptor.debugWorld) {
    descriptor.debugWorld.addBody(cannonBody);
  }

  descriptor.world.add(cannonBody);

  let threeShape = new THREE.BoxGeometry( descriptor.dimensions.width*2, descriptor.dimensions.depth*2, descriptor.dimensions.height*2 );
  let mat = new THREE.MeshNormalMaterial();
  let threeMesh = new THREE.Mesh( threeShape, mat );
  threeMesh.position.set(descriptor.position.x,descriptor.position.y,descriptor.position.z);
  threeMesh.rotation.x = descriptor.rotation.x;
  threeMesh.rotation.y = descriptor.rotation.y;
  threeMesh.rotation.z = descriptor.rotation.z;

  let satBody;
  if (typeof SAT !== "undefined") {
    let response = new SAT.Response();
    let V = SAT.Vector;
    let C = SAT.Circle;
    let P = SAT.Polygon;
    let position = new V(descriptor.position.x, descriptor.position.z);
    let corners = {};
    let ulx = -1*descriptor.dimensions.width;
    let uly = 1*descriptor.dimensions.depth;
    let llx = -1*descriptor.dimensions.width;
    let lly = -1*descriptor.dimensions.depth;
    let lrx = 1*descriptor.dimensions.width;
    let lry = -1*descriptor.dimensions.depth;
    let urx = 1*descriptor.dimensions.width;
    let ury = 1*descriptor.dimensions.depth;
    corners.ul = new V(ulx, uly);
    corners.ll = new V(llx, lly);
    corners.lr = new V(lrx, lry);
    corners.uu = new V(urx, ury);
    console.log(129);

    satBody = new P(position, [ corners.ul, corners.ll, corners.lr, corners.uu ]);
  }



  return { cannon: cannonBody, three: threeMesh, sat: satBody };

}

/*

dynamicSphere descriptor
{
  position: { x: number, y: number, z: number },
  rotation: { x: number, y: number, z: number },
  dimensions { radius: number },
  mass: number,
  scene: threeJsScene,
  world; cannonJsWorld,
  debugWorld: debugWorld
}

*/
const dynamicSphere = (descriptor) => {

  let material = descriptor.material | {};
  let cannonShape = new CANNON.Sphere(descriptor.dimensions.radius);
  let cannonBody = new CANNON.Body({ mass: descriptor.mass }, material);
  cannonBody.addShape(cannonShape);
  cannonBody.position.set(descriptor.position.x,descriptor.position.y,-1*descriptor.position.z);
  cannonBody.quaternion.setFromEuler(descriptor.rotation.x, descriptor.rotation.y, descriptor.rotation.z);

  if (descriptor.debugWorld) {
    descriptor.debugWorld.addBody(cannonBody);
  }

  descriptor.world.add(cannonBody);


  let threeShape = new THREE.SphereGeometry( descriptor.dimensions.radius, 32, 32 );
  let mat = new THREE.MeshNormalMaterial();
  let threeMesh = new THREE.Mesh( threeShape, mat );
  threeMesh.position.set(-1*descriptor.position.x,descriptor.position.y,-1*descriptor.position.z);
  threeMesh.rotation.x = descriptor.rotation.x;
  threeMesh.rotation.y = descriptor.rotation.y;
  threeMesh.rotation.z = descriptor.rotation.z;

  //let satBody = new C(new V(descriptor.cannon.position.x,descriptor.cannon.position.z), descriptor.dimensions.radius + 3);
  let satBody;
  
  if (typeof SAT !== "undefined") {
    satBody = new C(new V(descriptor.position.x,descriptor.position.z), descriptor.dimensions.radius + 3);
  }
  
  return { cannon: cannonBody, three: threeMesh, sat: satBody };

}

const cannonSpring = (body1, body2, options) => {
  /* going with default options for now */

  options = {
              localAnchorA: new CANNON.Vec3(0,0,0),
              localAnchorB: new CANNON.Vec3(0,0,0),
              restLength : 0,
              stiffness : 50,
              damping : 1,
          };

  var spring = new CANNON.Spring(body1,body2, options);
  return spring;

}
