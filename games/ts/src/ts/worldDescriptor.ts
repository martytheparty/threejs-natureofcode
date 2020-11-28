import { Sphere } from "../../node_modules/three/src/Three";

export interface World {
    physics?: Physics;
    scenes: Scene[]
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
        scenes: []
    };
    addScene(world); 
    //addPhysics(world);
    return world;
}

const planes: Plane[] = [
    {
        width: 1,
        widthSegments: 32,
        height: 8,
        heightSegments: 32,
        helper: true,
        material: {
            type: 'Lambert',
            color: 0x00000FF,
            side: 'Double'
        },
        rotateAngle: {x: Math.PI/2, y: 0, z: 0},
    },
    {
        width: 1,
        widthSegments: 32,
        height: 8,
        heightSegments: 32,
        helper: true,
        material: {
            type: 'Lambert',
            color: 0x00FF00,
            side: 'Double'
        },
        rotateAngle: {x: 0, y: Math.PI/2, z: 0},
    },
    {
        width: 1,
        widthSegments: 32,
        height: 8,
        heightSegments: 32,
        helper: true,
        material: {
            type: 'Lambert',
            color: 0xFF0000,
            side: 'Double'
        },
        rotateAngle: {x: Math.PI/2, y: 0, z: Math.PI/2},
    }
];

const spheres: SphereDesc[] = [
    {
        position: { x: -10, y: -6, z: 2},
        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
        material: {
            type: 'Lambert',
            color: 0xFFFF00
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: 100,
    },
    {
        position: { x: 4, y: -4, z: -4},
        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
        material: {
            type: 'Lambert',
            color: 0x00FFFF
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: 100,
    },
    {
        position: { x: -4, y: 4, z: -4},
        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
        material: {
            type: 'Lambert',
            color: 0xFF0000
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: 100,
    },
    {
        position: { x: 4, y: 4, z: -4},
        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
        material: {
            type: 'Lambert',
            color: 0x00FF00
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: 100,
    },
    {
        position: { x: -4, y: -4, z: 4},
        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
        material: {
            type: 'Lambert',
            color: 0x00FF00
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: 100,
    },
    {
        position: { x: 4, y: -4, z: 4},
        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
        material: {
            type: 'Lambert',
            color: 0x00FF00
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: 100,
    },
    {
        position: { x: -4, y: 4, z: 4},
        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
        material: {
            type: 'Lambert',
            color: 0x0000FF
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: 100,
    },
    {
        position: { x: 4, y: -4, z: 4},
        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
        material: {
            type: 'Lambert',
            color: 0xFFFF00
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: 100,
    },
    {
        position: { x: -4, y: -4, z: 4},
        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
        material: {
            type: 'Lambert',
            color: 0xFFFFFF
        },
        radius: 1,
        widthSegments: 32,
        heightSegments: 32,
        mass: 100,
    },
];

const platforms: PlatformDesc[] = [
    {
        dimensions: { width: 1, height: 1, depth: 1},
        position: { x: 2, y: 0, z: 0},
        rotateAngle: {x: 0, y: 0, z: Math.PI/3},
        material: {
            type: 'Lambert',
            color: 0xFFFF00
        },
    },
    {
        dimensions: { width: .5, height: .5, depth: .5},
        position: { x: 0, y: 0, z: 2},
        rotateAngle: {x: 0, y: Math.PI/6, z: 0},
        material: {
            type: 'Standard',
            color: 0xFFcccc
        },
    },
    {
        dimensions: { width: .5, height: .5, depth: .5},
        position: { x: -1, y: 0, z: 4},
        rotateAngle: {x: 0, y: 0, z: Math.PI/6},
        material: {
            type: 'Phong',
            color: 0x00FFFF
        },
    }
];

const lights: Light[] = [
    {
        type: "Point",
        color: 0xFFFFFF,
        position: { x:10, y:0, z:0 },
        helper: false
    },
    {
        type: "Point",
        color: 0xFFFFFF,
        position: { x:0, y:10, z:0 },
        helper: false
    },
    {
        type: "Point",
        color: 0xFFFFFF,
        position: { x:0, y:0, z:10 },
        helper: false
    },                    {
        type: "Point",
        color: 0xFFFFFF,
        position: { x:-10, y:0, z:0 },
        helper: false
    },
    {
        type: "Point",
        color: 0xFFFFFF,
        position: { x:0, y:-10, z:0 },
        helper: false
    },
    {
        type: "Point",
        color: 0xFFFFFF,
        position: { x:0, y:0, z:-10 },
        helper: false
    }
];

const physicsWorld: Physics = {
    gravity: -9.8,
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
                width: 600,
                height: 600,
                position: {x: 10, y: 10, z: 10},
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
                width: 200,
                height: 200,
                position: {x: 0, y: 6, z: 6},
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
            position: 'player', 
            objectData: {
                physicsWorld,
                scene: {}, 
                ele: {}, 
                camera: {},
                renderer: {},
                width: 200,
                height: 200,
                position: {x: 2, y: 2, z: 2},
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
                width: 200,
                height: 200,
                position: {x: 4, y: 0, z: 4},
                up: {x: 0, y: 0, z: 1},
                look: {x: 0, y: 0, z: 0},
                planes,
                spheres,
                platforms,
                lights
            }
        });
}


