import { worldRenderer, worldUpdate, worldRedraw } from "./ts/renderer";
import { createWorld } from './ts/worldDescriptor';

const description = worldRenderer(createWorld);

console.log('the world', description.physics.world.step);


const tables = [];

//for(let i = 0; i<100; i++) {
    //console.log(description.physics.world.bodies[0].position, i);
    const pos = description.physics.world.bodies[0].position;
    worldUpdate(description);
    worldRedraw(description);
    //  let positions = [pos.x, pos.y, pos.z];
    //tables.push(positions);
//}

//console.table(tables);

// console.log('world:', world);