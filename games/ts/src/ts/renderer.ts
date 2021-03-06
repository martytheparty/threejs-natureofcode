import { World } from './worldDescriptor';

declare let CANNON: any;  // Assume that CANNON will be on the windows NameSpace
declare let THREE: any;  // Assume that THREE will be on the windows NameSpace

export function worldRenderer(createWorld: Function) {
    const world: World = createWorld();

    // all four scenes will share the same physics... they don't have to 
    const cannonWorld = new CANNON.World();
    world.physics = {world: cannonWorld};
    cannonWorld.gravity.set(0,0,world.scenes[0].objectData.physicsWorld.gravity);
    cannonWorld.broadPhase = new CANNON.NaiveBroadphase();
    const physicsSpheres: any[] = [];

    world.scenes.forEach(
        (scene, sceneIndex) => {

            scene.objectData.physicsWorld.world = cannonWorld;
            scene.objectData.scene = new THREE.Scene();
            scene.objectData.ele = document.getElementById(scene.position);
            scene.objectData.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10000);
            scene.objectData.camera.up.set(scene.objectData.up.x, scene.objectData.up.y, scene.objectData.up.z);
            scene.objectData.camera.position.set(scene.objectData.position.x, scene.objectData.position.y, scene.objectData.position.z);
            scene.objectData.camera.lookAt(scene.objectData.look.x, scene.objectData.look.y, scene.objectData.look.z);

            if (scene.objectData.planes) {
                scene.objectData.planes.forEach(
                    (plane) => {
                        const geometry = new THREE.PlaneGeometry(plane.width, plane.height, plane.heightSegments, plane.widthSegments);
                        const material = new THREE.MeshPhongMaterial({ color: plane.material.color, side: THREE.DoubleSide });
                        const planeMesh = new THREE.Mesh(geometry, material);
                        planeMesh.rotation.x = plane.rotateAngle.x;
                        planeMesh.rotation.y = plane.rotateAngle.y;
                        planeMesh.rotation.z = plane.rotateAngle.z;
                        //planeMesh.rotation.set(new THREE.Vector3(plane.rotateAngle.x, plane.rotateAngle.y, plane.rotateAngle.z ));
                        scene.objectData.scene.add(planeMesh);
                    }
                )
            }

            if (scene.objectData.spheres) {
                scene.objectData.spheres.forEach(
                    (sphere, sphereIndex) => {

                        // Three JS
                        const geometry = new THREE.SphereGeometry(sphere.radius, sphere.heightSegments, sphere.widthSegments);
                        let material = new THREE.MeshNormalMaterial();
                        if (sphere.material.type === 'Standard') {
                            material = new THREE.MeshStandardMaterial();
                        } else if (sphere.material.type === 'Phong') {
                            material = new THREE.MeshPhongMaterial({ color: sphere.material.color });
                        } else if (sphere.material.type === 'Lambert') {
                            material = new THREE.MeshLambertMaterial({ color: sphere.material.color });
                        }
                        const mesh = new THREE.Mesh(geometry, material);
                        material.color.set(sphere.material.color);

                        mesh.rotation.x = sphere.rotateAngle.x;
                        mesh.rotation.y = sphere.rotateAngle.y;
                        mesh.rotation.z = sphere.rotateAngle.z;
                        mesh.position.set(sphere.position.x, sphere.position.y, sphere.position.z);

                        scene.objectData.scene.add(mesh);
                        sphere.uiBody = mesh;

                        if (sceneIndex === 0) {
                            const mass = sphere.mass;
                            const radius = sphere.radius;
                            const sphereShape = new CANNON.Sphere(radius); // Step 1
                            const sphereBody = new CANNON.Body({ mass: mass, shape: sphereShape }); // Step 2
                            sphereBody.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
                            scene.objectData.physicsWorld.world.addBody(sphereBody); // Step 3
                            sphere.physicsBody = sphereBody;
                            physicsSpheres[sphereIndex] = sphereBody;
                        } else {
                            sphere.physicsBody = physicsSpheres[sphereIndex];
                        }

                    }
                );
            }

            scene.objectData.platforms.forEach(
                (platform) => {
                    const geometry = new THREE.BoxGeometry(platform.dimensions.width, platform.dimensions.depth, platform.dimensions.height);
                    let material = new THREE.MeshNormalMaterial();
                    if (platform.material.type === 'Standard') {
                        material = new THREE.MeshStandardMaterial();
                    } else if (platform.material.type === 'Phong') {
                        material = new THREE.MeshPhongMaterial({ color: platform.material.color });
                    } else if (platform.material.type === 'Lambert') {
                        material = new THREE.MeshLambertMaterial({ color: platform.material.color });
                    }

                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.rotation.x = platform.rotateAngle.x;
                    mesh.rotation.y = platform.rotateAngle.y;
                    mesh.rotation.z = platform.rotateAngle.z;
                    mesh.position.set(platform.position.x, platform.position.y, platform.position.z);
                    material.color.set(platform.material.color);
                    scene.objectData.scene.add(mesh);
                }
            );

            scene.objectData.lights.forEach(
                (lightConfig) => {
                    if (lightConfig.type === "Ambient") {
                        const light = new THREE.AmbientLight(lightConfig.color);
                        scene.objectData.scene.add(light);
                    } else if (lightConfig.type === "Point") {
                        const intensity = lightConfig.intensity || 1;

                        const light = new THREE.PointLight(lightConfig.color, intensity, 100, 1);
                        light.position.set(lightConfig.position.x, lightConfig.position.y, lightConfig.position.z);
                        scene.objectData.scene.add(light);

                        if (lightConfig.helper) {
                            const sphereSize = lightConfig.helperSize || .5;
                            const pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
                            scene.objectData.scene.add(pointLightHelper);
                        }


                    } else if (lightConfig.type === "Spot") {
                        const intensity = lightConfig.intensity | 1;
                        const light = new THREE.SpotLight(lightConfig.color, intensity, 100, 1);
                        light.position.set(lightConfig.position.x, lightConfig.position.y, lightConfig.position.z);
                        scene.objectData.scene.add(light);

                        if (lightConfig.helper) {
                            const lightHelper = new THREE.SpotLightHelper(light);
                            scene.objectData.scene.add(lightHelper);
                        }


                    } else if (lightConfig.type === "Directional") {
                        const light = new THREE.DirectionalLight(lightConfig.color, lightConfig.intensity);
                        if (lightConfig.position) {
                            light.position.set(lightConfig.position.x, lightConfig.position.y, lightConfig.position.z);
                        }

                        if (lightConfig.helper) {
                            const sphereSize = lightConfig.helperSize || .5;
                            const lightHelper = new THREE.DirectionalLightHelper(light, sphereSize);
                            scene.objectData.scene.add(lightHelper);
                        }

                        scene.objectData.scene.add(light);
                    }
                }
            );

            scene.objectData.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: scene.objectData.ele });
            scene.objectData.renderer.setSize(scene.objectData.ele.offsetWidth, scene.objectData.height);
            scene.objectData.renderer.render(scene.objectData.scene, scene.objectData.camera);
        }
    );
    return world;
}

export function worldUpdate(world: World) {
    world.physics.world.step(1/1000, 1, 3);
}

export function worldRedraw(world: World) {
     world.scenes.forEach(
        (scene, sceneIndex) => {
            scene.objectData.spheres.forEach(
                (sphere, index) => {

                    if (sphere.uiBody.geometry.type === 'SphereGeometry') {
                        console.log('da sphere mesh', sphere.uiBody.position);
                        sphere.uiBody.geometry.elementsNeedUpdate = true;
                    }
                    sphere.uiBody.position.set(1000, 0, 0);
                    // sphere.uiBody.position.x = 0;
                    // sphere.uiBody.position.y = 0;
                    // sphere.uiBody.position.z = 0;

                    sphere.position.x = 0;
                    sphere.position.y = 0;
                    sphere.position.z = 0;
                }
            );
        }
    );
    world.scenes.forEach(
        (scene, i) => {
            //console.log('*scene ' + i + ': ',scene.objectData.scene);
            //console.log('camera ' + i + ': ',scene.objectData.camera);
            scene.objectData.renderer.render(scene.objectData.scene, scene.objectData.camera);
            //scene.objectData.renderer.render(scene.objectData.scene, scene.objectData.camera);
        }
    );
}