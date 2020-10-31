import { World } from './worldDescriptor';

declare let CANNON: any;  // Assume that CANNON will be on the windows NameSpace
declare let THREE: any;  // Assume that THREE will be on the windows NameSpace

export function worldRenderer(createWorld: Function) {
    const world: World = createWorld(); 
    world.physics = new CANNON.World();    
    world.scenes.forEach(
        (scene) => {
            scene.threeData.scene = new THREE.Scene();
            scene.threeData.ele = document.getElementById(scene.position);
            scene.threeData.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10000);
            scene.threeData.camera.up.set(scene.threeData.up.x, scene.threeData.up.y, scene.threeData.up.z);
            scene.threeData.camera.position.set(scene.threeData.position.x, scene.threeData.position.y, scene.threeData.position.z);
            scene.threeData.camera.lookAt(scene.threeData.look.x, scene.threeData.look.y, scene.threeData.look.z);
    
            scene.threeData.platforms.forEach(
                (platform) => {
                    const geometry = new THREE.BoxGeometry( platform.dimensions.width, platform.dimensions.depth, platform.dimensions.height );
                    let material = new THREE.MeshNormalMaterial();
                    if (platform.material.type === 'Standard') {
                        material = new THREE.MeshStandardMaterial();
                    } else if (platform.material.type === 'Phong') {
                        material = new THREE.MeshPhongMaterial({ color: platform.material.color });
                    } else if (platform.material.type === 'Lambert') {
                        material = new THREE.MeshLambertMaterial({ color: platform.material.color });
                    }
    
                    const mesh = new THREE.Mesh( geometry, material );
                    mesh.rotation.x = platform.rotateAngle.x;
                    mesh.rotation.y = platform.rotateAngle.y;
                    mesh.rotation.z = platform.rotateAngle.z;
                    mesh.position.set(platform.position.x, platform.position.y, platform.position.z);
                    material.color.set(platform.material.color);
                    scene.threeData.scene.add( mesh ); 
                }
            );

            scene.threeData.lights.forEach(
                (lightConfig) => {
                    if (lightConfig.type === "Ambient") {
                        const light = new THREE.AmbientLight(lightConfig.color);
                        scene.threeData.scene.add(light); 
                    } else if (lightConfig.type === "Point") {
                        const intensity = lightConfig.intensity || 1;

                        const light = new THREE.PointLight(lightConfig.color, intensity, 100, 1);
                        light.position.set(lightConfig.position.x,lightConfig.position.y,lightConfig.position.z);
                        scene.threeData.scene.add(light);

                        if (lightConfig.helper) {
                            const sphereSize = lightConfig.helperSize || .5;
                            const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
                            scene.threeData.scene.add( pointLightHelper );
                        }


                    } else if (lightConfig.type === "Spot") {
                        const intensity = lightConfig.intensity | 1;
                        const light = new THREE.SpotLight(lightConfig.color, intensity, 100, 1);
                        light.position.set(lightConfig.position.x,lightConfig.position.y,lightConfig.position.z);
                        scene.threeData.scene.add(light);
                    } else if (lightConfig.type === "Directional") {
                        const light = new THREE.DirectionalLight(lightConfig.color, lightConfig.intensity);
                        if (lightConfig.position) {
                            light.position.set(lightConfig.position.x, lightConfig.position.y, lightConfig.position.z);
                        }
                        scene.threeData.scene.add(light);
                    }            
                }
            );

            scene.threeData.renderer = new THREE.WebGLRenderer( { antialias: true, canvas: scene.threeData.ele} );
            scene.threeData.renderer.setSize( scene.threeData.width, scene.threeData.height );
            scene.threeData.renderer.render( scene.threeData.scene, scene.threeData.camera );
        }
    );

} 