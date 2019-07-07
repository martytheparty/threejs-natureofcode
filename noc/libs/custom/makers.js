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

  return { cannon: cannonBody, three: threeMesh };

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
  cannonBody.position.set(descriptor.position.z,descriptor.position.y,descriptor.position.x);
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

  return { cannon: cannonBody, three: threeMesh };

}
