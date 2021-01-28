import { CompressedPixelFormat, DataTexture } from "../node_modules/three/src/Three";
import { worldRenderer, worldUpdate, worldRedraw } from "./ts/renderer";
import { createWorld } from './ts/worldDescriptor';

const description = worldRenderer(createWorld);

// run this 100 times a second, measure time passage, and pass it in

let d = new Date();
let currentTime = d.getTime();
let lastTime = currentTime;
const update = () => {
    d = new Date();
    currentTime = d.getTime();
    let steps = currentTime - lastTime;
    worldUpdate(description, steps/10);
    lastTime = currentTime;
};
setInterval(update, 10);

// run this on every animation frame
//worldRedraw(description);

const redraw = () => {
    description.threeBodies.forEach(
         (scene, sceneIndex) => {
             scene.forEach(
                 (body: any, bodyIndex: number) => {
                    description.threeBodies[sceneIndex][bodyIndex].body.position.z = description.threeBodies[sceneIndex][bodyIndex].physics.position.z;
                }
             );
         }
    );

    worldRedraw(description);
    requestAnimationFrame(redraw);
}

redraw();