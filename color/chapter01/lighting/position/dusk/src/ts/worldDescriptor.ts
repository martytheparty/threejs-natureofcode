import { Sphere } from "../../node_modules/three/src/Three";

export interface World {
    physics?: Physics;
    scenes: Scene[],
    threeBodies?: any[]
}

export interface Physics {
    gravity?: number,
    world?: any;
}

export interface Scene {
    position: string,
    objectData: ObjectData
}

export interface ObjectData {
    physicsWorld: Physics,
    scene: any,
    ele: any,
    camera: any,
    renderer: any,
    width: number,
    height: number,
    position: Position,
    up: Position,
    look: Position,
    platforms?: PlatformDesc[],
    spheres?: SphereDesc[],
    lights?: Light[],
    planes?: Plane[],
}

interface Plane {
    width: number,
    height: number,
    widthSegments: number,
    heightSegments: number,
    material: Material,
    helper?: boolean,
    rotateAngle?: Position,
}

interface SphereDesc {
    material: Material,
    radius: number,
    widthSegments: number,
    heightSegments: number,
    position: Position,
    rotateAngle: Position,
    mass?: number,
    physicsBody?: any,
    uiBody?: any,
}

interface Material {
    type: 'Standard' |'Lambert' | 'Phong' | 'Normal',
    color: number,
    side?: 'Double' | 'Front' | 'Back'
}

interface Light {
    type: 'Ambient' | 'Hemisphere' | 'Directional' | 'Point' | 'Spot',
    position?: Position,
    color: number,
    intensity?: number,
    width?: number,
    height?: number,
    lookAt?: Position,
    helper?: boolean,
    helperSize?: number
}

interface PlatformDesc {
    position: Position,
    dimensions: Dimensions,
    rotateAngle: Rotation,
    material: Material,
}

interface Position {
    /** position on the x axis */
    x: number,
     /** position on the y axis */
    y: number,
    /** position on the z axis */
    z: number
}

interface Rotation {
    /** rotation (in radians) around the x axis */
    x: number,
    /** rotation (in radians) around the y axis */
    y: number,
    /** rotation (in radians) around the z axis */
    z: number
}

interface Dimensions {
    /** width: represents the length (along the x axis) */
    width: number,
    /** depth: represents the length (along the z axis) */
    height: number,
    /** height: represents the length (along the y axis) */
    depth: number
}

enum LightTypes {
    'Ambient',
    'Hemisphere',
    'Directional',
    'Point',
    'Spot'
}

enum MaterialTypes {
    'Basic',
    'Lambert',
    'Phong',
    'Standard'
}

enum SideTypes {
    'Double',
    'Front',
    'Back'
}

export function createWorld() {
    let world: World =  {
        scenes: [],
        threeBodies: []
    };
    addScene(world); 

    //addPhysics(world);
    return world;
}

const planes: Plane[] = [];

const spheres: SphereDesc[] = [
    {
        position: { x: 0, y: 3, z: 5},
        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
        material: {
            type: 'Lambert',
            color: 0xFF0000
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: .1,
    },
    {
        position: { x: 0, y: 0, z: 8},
        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
        material: {
            type: 'Lambert',
            color: 0x00FF00
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: .1,
    },
    {
        position: { x: 0, y: -3, z: 11},
        rotateAngle: {x: Math.PI/4, y: 0, z: 0},
        material: {
            type: 'Lambert',
            color: 0x0000FF
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: .1,
    },
];

const platforms: PlatformDesc[] = [
    {
        dimensions: { width: 12, height: 2, depth: 12},
        position: { x: 0, y: 0, z: 0},
        rotateAngle: {x: 0, y: 0, z: 0},
        material: {
            type: 'Lambert',
            color: 0xD2B48C
        },
    }
];

const lights: Light[] = [
    {
        type: "Point",
        color: 0xFFFFFF,
        position: {x: 0, y: -9, z:2},
        intensity: 2
    }
];

const physicsWorld: Physics = {
    gravity: -3,
    world: {}
};

function addScene(world: World) {
    world.scenes.push(
        {
            position: 'top', 
            objectData: {
                physicsWorld,
                scene: {},                         
                ele: {}, 
                camera: {},
                renderer: {},
                width: 400,
                height: 400,
                position: {x: 0, y: 4, z: 4},
                up: {x: 0, y: 0, z: 1},
                look: {x: 0, y: 0, z: 0},
                planes,
                spheres,
                platforms,
                lights
            }
        });
    world.scenes.push(
        {
            position: 'left', 
            objectData: {
                physicsWorld,
                scene: {}, 
                ele: {}, 
                camera: {},
                renderer: {},
                width: 400,
                height: 400,
                position: {x: 0, y: 0, z: 10},
                up: {x: 0, y: 0, z: 1},
                look: {x: 0, y: 0, z: 0},
                planes,
                spheres,
                platforms,
                lights
            }
        });
    world.scenes.push(
        {
            position: 'player', 
            objectData: {
                physicsWorld,
                scene: {}, 
                ele: {}, 
                camera: {},
                renderer: {},
                width: 400,
                height: 400,
                position: {x: 10, y: 0, z: 6},
                up: {x: 0, y: 0, z: 1},
                look: {x: 0, y: 0, z: 2},
                planes,
                spheres,
                platforms,
                lights
            }
        });
    world.scenes.push(
        {
            position: 'third', 
            objectData: {
                physicsWorld,
                scene: {}, 
                ele: {}, 
                camera: {},
                renderer: {},
                width: 400,
                height: 400,
                position: {x: -10, y: 0, z: 6},
                up: {x: 0, y: 0, z: 1},
                look: {x: 0, y: 0, z: 2},
                planes,
                spheres,
                platforms,
                lights
            }
        });
}


