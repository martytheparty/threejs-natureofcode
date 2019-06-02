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

cuboid descriptor
{
  position: { x: number, y: number, z: number },
  rotation: { x: number, y: number, z: number },
  dimensions { width: number, height: number, depth: number },
  scene: threeJsScene,
  world; cannonJsWorld,
  debugWorld: debugWorld
}

*/

const fixedCuboid = (descriptor) => {
  /* This is something like a ground or a building... ie something that doesn't move */

  // function addBox1() {
  //   var shape = new CANNON.Box(new CANNON.Vec3(radius,radius,radius));
  //   var body = new CANNON.Body({ mass: 0 });
  //   body.addShape(shape);
  //   body.position.set(0,0,0);
  //   world.addBody(body);
  // }
  //
  // function addBox2() {
  //   var shape = new THREE.BoxGeometry( radius*2, radius*2, radius*2 );
  //   var mat = new THREE.MeshNormalMaterial();
  //   var mesh = new THREE.Mesh( shape, mat );
  //   mesh.position.set(0, 0, 0);
  //   scene2.add( mesh );
  // }


  // body.quaternion.setFromEuler(Math.PI/2, 0, 0);
  let cannonShape = new CANNON.Box(new CANNON.Vec3(descriptor.dimensions.depth, descriptor.dimensions.height, descriptor.dimensions.width));
  let cannonBody = new CANNON.Body({ mass: 0 });
  cannonBody.addShape(cannonShape);
  cannonBody.position.set(descriptor.position.x,descriptor.position.y,descriptor.position.z);
  cannonBody.quaternion.setFromEuler(descriptor.rotation.x, descriptor.rotation.y, descriptor.rotation.z);
  descriptor.debugWorld.addBody(cannonBody);

  let threeShape = new THREE.BoxGeometry( descriptor.dimensions.width*2,descriptor.dimensions.height*2,descriptor.dimensions.depth*2 );
  let mat = new THREE.MeshNormalMaterial();
  let threeMesh = new THREE.Mesh( threeShape, mat );
  threeMesh.position.set(-1*descriptor.position.x,descriptor.position.y,-1*descriptor.position.z);
  threeMesh.rotation.x = descriptor.rotation.x;
  threeMesh.rotation.y = descriptor.rotation.y;
  threeMesh.rotation.z = descriptor.rotation.z;

  scene2.add( threeMesh );


  return { cannon: cannonShape, three: threeMesh };

}
