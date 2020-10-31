import { SpotLight } from "../../node_modules/three/src/Three";

export interface World {
    scenes: Scene[],
    physics: any
}

export interface Scene {
    position: string,
    threeData: ThreeData
}

export interface ThreeData {
    scene: any,
    ele: any,
    camera: any,
    renderer: any,
    width: number,
    height: number,
    position: Position,
    up: Position,
    look: Position,
    platforms: PlatformDesc[],
    lights: Light[],
}

interface Material {
    type: 'Standard' |'Lambert' | 'Phong' | 'Normal',
    color: number
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
    rotateAngle: Position,
    material: Material,
}

interface Position {
    x: number,
    y: number,
    z: number
}

interface Dimensions {
    width: number,
    height: number,
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

export function createWorld() {
    let world: World =  {
        scenes: [],
        physics: {}
    };
    addScene(world); 
    return world;
}

function addScene(world: World) {
    world.scenes.push(
        {
            position: 'top', 
            threeData: {
                scene: {},                         
                ele: {}, 
                camera: {},
                renderer: {},
                width: 600,
                height: 600,
                position: {x: 0, y: 5, z: 0},
                up: {x: 0, y: 0, z: 1},
                look: {x: 0, y: 0, z: 0},
                platforms: [
                    {
                        dimensions: { width: .3, height: 4.8, depth: 4.8},
                        position: { x: 2, y: 0, z: 0},
                        rotateAngle: {x: Math.PI/4, y: 0, z: Math.PI/4},
                        material: {
                            type: 'Lambert',
                            color: 0xFFFF00
                        },
                    },
                    {
                        dimensions: { width: .5, height: .5, depth: .5},
                        position: { x: 0, y: 0, z: 0},
                        rotateAngle: {x: 0, y: Math.PI/6, z: 0},
                        material: {
                            type: 'Standard',
                            color: 0xFFcccc
                        },
                    },
                    {
                        dimensions: { width: .5, height: .5, depth: .5},
                        position: { x: -1, y: 0, z: 0},
                        rotateAngle: {x: 0, y: 0, z: Math.PI/6},
                        material: {
                            type: 'Phong',
                            color: 0xccccFF
                        },
                    }
                ],
                lights: [
                    {
                        type: "Point",
                        color: 0xFFFFFF,
                        position: { x:0, y:4, z:3 }
                    },
                    {
                        type: "Point",
                        color: 0xFFFFFF,
                        position: { x:8, y:0, z:0 }
                    }
                ]
            }
        });
    world.scenes.push(
        {
            position: 'left', 
            threeData: {
                scene: {}, 
                ele: {}, 
                camera: {},
                renderer: {},
                width: 200,
                height: 200,
                position: {x: 0, y: 2, z: 2},
                up: {x: 0, y: 0, z: 1},
                look: {x: 0, y: 0, z: 0},
                platforms: [
                    {
                        dimensions: { width: .5, height: 4, depth: 4},
                        position: { x: 1, y: 0, z: 0},
                        rotateAngle: {x: 0, y: 0, z: 0},
                        material: {
                            type: 'Standard',
                            color: 0xccFFcc
                        },
                    },
                    {
                        dimensions: { width: .5, height: .5, depth: .5},
                        position: { x: 0, y: 0, z: 0},
                        rotateAngle: {x: 0, y: 0, z: 0},
                        material: {
                            type: 'Standard',
                            color: 0xccFFcc
                        },
                    },
                    {
                        dimensions: { width: 4, height: 4, depth: .5},
                        position: { x: -1, y: 0, z: 0},
                        rotateAngle: {x: 0, y: 0, z: Math.PI/2},
                        material: {
                            type: 'Standard',
                            color: 0xFFFFFF
                        },
                    }
                ],
                lights: [
                    {
                        type: "Ambient",
                        color: 0x00FF00,
                    }, 
                    {
                        type: "Spot",
                        color: 0xFFFFFF,
                        position: { x: 0, y: 0 , z: 1 }
                    }
                ]
            }
        });
    world.scenes.push(
        {
            position: 'player', 
            threeData: {
                scene: {}, 
                ele: {}, 
                camera: {},
                renderer: {},
                width: 200,
                height: 200,
                position: {x: 2, y: 2, z: 2},
                up: {x: 0, y: 0, z: 1},
                look: {x: 0, y: 0, z: 0},
                platforms: [
                    {
                        dimensions: { width: .5, height: .5, depth: .5},
                        position: { x: 1, y: 0, z: 0},
                        rotateAngle: {x: Math.PI/6, y: 0, z: 0},
                        material: {
                            type: 'Standard',
                            color: 0xccFFcc
                        },
                    },
                    {
                        dimensions: { width: .5, height: .5, depth: .5},
                        position: { x: 0, y: 0, z: 0},
                        rotateAngle: {x: 0, y: Math.PI/6, z: 0},
                        material: {
                            type: 'Standard',
                            color: 0xccFFcc
                        },
                    },
                    {
                        dimensions: { width: .5, height: .5, depth: .5},
                        position: { x: -1, y: 0, z: 0},
                        rotateAngle: {x: 0, y: 0, z: Math.PI/6},
                        material: {
                            type: 'Standard',
                            color: 0xccFFcc
                        },
                    }
                ],
                lights: [
                    {
                        type: "Ambient",
                        color: 0xFFFFFF,
                    }, 
                    {
                        type: "Directional",
                        color: 0xFF0000,
                        intensity: .5,
                        position: {x: 1, y: 0, z: 0 }
                    }
                ]
            }
        });
    world.scenes.push(
        {
            position: 'third', 
            threeData: {
                scene: {}, 
                ele: {}, 
                camera: {},
                renderer: {},
                width: 200,
                height: 200,
                position: {x: 0, y: 2, z: 2},
                up: {x: 0, y: 0, z: 1},
                look: {x: 0, y: 0, z: 0},
                platforms: [
                    {
                        dimensions: { width: .5, height: .5, depth: .5},
                        position: { x: 1, y: 0, z: 0 },
                        rotateAngle: {x: 0, y: 0, z: 0 },
                        material: {
                            type: 'Standard',
                            color: 0xFFFFFF
                        },
                    },
                    {
                        dimensions: { width: .5, height: .5, depth: .5},
                        position: { x: 0, y: 0, z: 0 },
                        rotateAngle: {x: 0, y: 0, z: 0 },
                        material: {
                            type: 'Standard',
                            color: 0xFFFFFF
                        },
                    },
                    {
                        dimensions: { width: .5, height: .5, depth: .5},
                        position: { x: -1, y: 0, z: 0 },
                        rotateAngle: {x: 0, y: 0, z: 0 },
                        material: {
                            type: 'Standard',
                            color: 0xFFFFFF
                        },
                    }
                ],
                lights: [
                    {
                        type: "Point",
                        color: 0xFF0000,
                        position: { x: 0, y: 0 , z: 1 },
                        helper: true,
                        helperSize: .1,
                        intensity: .8
                    },                     {
                        type: "Point",
                        color: 0x00FF00,
                        position: { x: 0, y: .5 , z: 0 },
                        helper: true,
                        helperSize: .1,
                        intensity: 1
                    }
                ]
            }
        });
}


