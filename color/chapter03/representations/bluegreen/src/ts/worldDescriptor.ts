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
    helperSize?: number,
    castShadow?: boolean
}

interface PlatformDesc {
    position: Position,
    dimensions: Dimensions,
    rotateAngle: Rotation,
    material: Material,
    receiveShadow: boolean,
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
        radius:1.3,
        position: {x: 0, y: 0, z: 0},
        material: {
            type: 'Lambert',
            color: 0x254842
        },
        widthSegments: 32,
        heightSegments: 32,
        rotateAngle: {x: 0, y: 0, z: 0},

    }
];

const platforms: PlatformDesc[] = [
    {
        dimensions: { width: 6, height: 1, depth: 8},
        position: { x: 0, y: 0, z: -2.5},
        rotateAngle: {x: 0, y: 0, z: 0},
        receiveShadow: true,
        material: {
            type: 'Lambert',
            color: 0xFFFFFF
        },
    },{
        dimensions: { width: 2, height: 2, depth: 2},
        position: { x: 0, y: 0, z: 0},
        rotateAngle: {x: 0, y: 0, z: 0},
        receiveShadow: true,
        material: {
            type: 'Lambert',
            color: 0x254842
        },
    }
];

const lights: Light[] = [
    {
        type: "Point",
        color: 0xFFFFFF,
        position: {x: 0, y: 0, z:5},
        intensity: 1,
    }, 
    {
        type: "Point",
        color: 0xFFFFFF,
        position: {x: 0, y: 5, z:0},
        intensity: 1,
    },
    {
        type: "Point",
        color: 0xFFFFFF,
        position: {x: 0, y: -5, z:0},
        intensity: 1,
    },
    {
        type: "Point",
        color: 0xFFFFFF,
        position: {x: 5, y: 0, z:0},
        intensity: 1,
    },{
        type: "Point",
        color: 0xFFFFFF,
        position: {x: -5, y: 0, z:0},
        intensity: 1,
    },

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
                position: {x: 2.5, y: 0, z: 0},
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
                position: {x: 0, y: 0, z: 12},
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
                position: {x: 8, y: -6, z: 0},
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
            position: 'third', 
            objectData: {
                physicsWorld,
                scene: {}, 
                ele: {}, 
                camera: {},
                renderer: {},
                width: 400,
                height: 400,
                position: {x: -8, y: 6, z: 0},
                up: {x: 0, y: 0, z: 1},
                look: {x: 0, y: 0, z: 0},
                planes,
                spheres,
                platforms,
                lights
            }
        });
}


