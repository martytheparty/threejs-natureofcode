( () => {
    let world;
    const floor = new ThreeDObject();

    const platformDescription = {
        width: 150,
        height: 150,
        depth: 15,
        x: 0,
        y: 0,
        z: 0
    };
    const sphereDescription = {
        radius: 20,
        sides: 32,
        x: -150, 
        y: 0, 
        z: 50
    };

    const sphereMeshes = [];
    const plaformMeshes = [];
    const gravity = -100;
    let topCameraPosition = 350;
    let frontCameraXPosition = 250;
    let frontCameraZPosition = 20;
    let leftCameraYPosition = -250;
    let leftCameraZPosition = 20;

    const view = {
        createMainView: (mesh, sphereMesh) => {
            let mainElement = document.getElementById('main');
            let threeObject = {
                element: mainElement,
                scene: new THREE.Scene(),
                camera: new THREE.PerspectiveCamera(75, mainElement.width / mainElement.height, 0.1, 1000),
                renderer: new THREE.WebGLRenderer({ antialias: true, canvas: mainElement })
            }
            threeObject.camera.position.set(0, 0, topCameraPosition);
            threeObject.camera.up.set(0, 0, 1);
            threeObject.camera.lookAt(new THREE.Vector3(0, 0, 0));
            threeObject.scene.add(mesh);
            if (sphereMesh) {
                threeObject.scene.add(sphereMesh);
            }
            threeObject.renderer.setSize(mainElement.width, mainElement.height);
            return threeObject;
        },

        createFrontView: (mesh, sphereMesh) => {
            let frontElement = document.getElementById('front');
            let threeObject = {
                element: frontElement,
                scene: new THREE.Scene(),
                camera: new THREE.PerspectiveCamera(75, frontElement.width / frontElement.height, 0.1, 1000),
                renderer: new THREE.WebGLRenderer({ antialias: true, canvas: frontElement })
            }
            threeObject.camera.up.set(0, 0, 1);
            threeObject.camera.position.x = frontCameraXPosition;
            threeObject.camera.position.y = 0;
            threeObject.camera.position.z = frontCameraZPosition;
            threeObject.camera.lookAt(new THREE.Vector3(0, 0, 0));
            threeObject.scene.add(mesh);
            if (sphereMesh) {
                threeObject.scene.add(sphereMesh);
            }
    
            threeObject.renderer.setSize(frontElement.width, frontElement.height);
            return threeObject;
        },

        createLeftView: (mesh, sphereMesh) => {
            let leftElement = document.getElementById('left');
            let threeObject = {
                element: leftElement,
                scene: new THREE.Scene(),
                camera: new THREE.PerspectiveCamera(75, leftElement.width / leftElement.height, 0.1, 1000),
                renderer: new THREE.WebGLRenderer({ antialias: true, canvas: leftElement })
            }
            threeObject.camera.up.set(0, 0, 1);
            threeObject.camera.position.x = 0;
            threeObject.camera.position.y = leftCameraYPosition;
            threeObject.camera.position.z = leftCameraZPosition;
            threeObject.camera.lookAt(new THREE.Vector3(0, 0, 0));
            threeObject.scene.add(mesh);
            if (sphereMesh) {
                threeObject.scene.add(sphereMesh);
            }
            threeObject.renderer.setSize(leftElement.width, leftElement.height);
            return threeObject;
        },

        createBallView: (mesh, sphereMesh) => {
            let ballElement = document.getElementById('ball');
            let threeObject = {
                element: ballElement,
                scene: new THREE.Scene(),
                camera: new THREE.PerspectiveCamera(75, ballElement.width / ballElement.height, 0.1, 1000),
                renderer: new THREE.WebGLRenderer({ antialias: true, canvas: ballElement })
            }
            threeObject.camera.up.set(0, 0, 1);
            threeObject.camera.position.x = sphereMesh.position.x;
            threeObject.camera.position.y = sphereMesh.position.y;
            threeObject.camera.position.z = sphereMesh.position.z;
            threeObject.camera.lookAt(new THREE.Vector3(0, 0, 0));
            threeObject.scene.add(mesh);
            if (sphereMesh) {
                threeObject.scene.add(sphereMesh);
            }
            threeObject.renderer.setSize(ballElement.width, ballElement.height);
            return threeObject;
        },
        getRenderingMesh: (meshDescription) => {
            let mesh = new THREE.Mesh(meshDescription.geometry, meshDescription.material);
            mesh.position.set(meshDescription.x, meshDescription.y, meshDescription.z);
            return mesh;
        },
        createViews: (meshDescription, sphereMeshDescription) => {
            sphereMeshes.push(view.getRenderingMesh(sphereMeshDescription));
            sphereMeshes.push(view.getRenderingMesh(sphereMeshDescription));
            sphereMeshes.push(view.getRenderingMesh(sphereMeshDescription));
            sphereMeshes.push(view.getRenderingMesh(sphereMeshDescription));

            plaformMeshes.push(view.getRenderingMesh(meshDescription));
            plaformMeshes.push(view.getRenderingMesh(meshDescription));
            plaformMeshes.push(view.getRenderingMesh(meshDescription));
            plaformMeshes.push(view.getRenderingMesh(meshDescription));

            const views = [];
            views.push(view.createMainView(plaformMeshes[0], sphereMeshes[0]));
            views.push(view.createFrontView(plaformMeshes[1], sphereMeshes[1]));
            views.push(view.createLeftView(plaformMeshes[2], sphereMeshes[2]));
            views.push(view.createBallView(plaformMeshes[3], sphereMeshes[3]));
            return views;
        }
    }

    const physics = {
        createWorld : () => {
            world = new CANNON.World();
            world.gravity.set(0,0,gravity);
            world.broadphase = new CANNON.NaiveBroadphase();
            world.solver.iterations = 100;
            world.solver.tolerance = 0;
        },
        addShapes: () => {
            const material = new CANNON.Material("material");
            const gg = {
                friction: 0.4,
                restitution: 0.1,
                contactEquationStiffness: 1e8,
                contactEquationRelaxation: 3,
                frictionEquationStiffness: 1e8,
                frictionEquationRegularizationTime: 3
              };
            const groundGroundContact = new CANNON.ContactMaterial(material, material, gg);
            const cannonSphere = new CANNON.Sphere(
                sphereDescription.radius
            );
            const cannonBody = new CANNON.Body({ mass: 10000 }, material);
    
    
            cannonBody.addShape(cannonSphere);
            cannonBody.position.set(
                sphereDescription.x,
                sphereDescription.y,
                sphereDescription.z
            );
            world.add(cannonBody);
    
            let cannonShape = new CANNON.Box(new CANNON.Vec3(platformDescription.width, platformDescription.height, platformDescription.depth));
            let cannonBody1 = new CANNON.Body({ mass: 0 });
            cannonBody1.addShape(cannonShape);
            cannonBody1.position.set(
                platformDescription.x,
                platformDescription.y,
                platformDescription.z-platformDescription.depth/2
            );
            world.add(cannonBody1);
    
            let cannonBody2 = new CANNON.Body({ mass: 0 });
            cannonBody2.addShape(cannonShape);
            cannonBody2.position.set(
                platformDescription.x,
                platformDescription.y,
                platformDescription.z-(platformDescription.depth + platformDescription.depth/2)
            );
            world.add(cannonBody2);
    
            floor.sphereLookup.cannonIndex = floor.cannonObjects.length;
            floor.cannonObjects.push(cannonBody);
            floor.platformLookup.uiPlatformIndex = floor.cannonObjects.length;
            floor.cannonObjects.push(cannonBody1);
            floor.platformLookup.rotatePlatformIndex = floor.cannonObjects.length;
            floor.cannonObjects.push(cannonBody2);
        }

    }

    function setView() {
        const geometry = new THREE.BoxGeometry(platformDescription.width*2, platformDescription.height*2, platformDescription.depth*2);
        const material = new THREE.MeshBasicMaterial({ color: 0xC19A6B });
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const meshDescription = { geometry, material, x: 0, y: 0, z: 0 };
        sphereGeometry = new THREE.SphereGeometry(sphereDescription.radius, sphereDescription.sides, sphereDescription.sides);
        const sphereMeshDescription = { geometry: sphereGeometry, material: sphereMaterial, x: sphereDescription.x, y: sphereDescription.y, z: sphereDescription.z };    
        floor.sphereLookup.threeIndex = floor.threeObjects.length;
        floor.threeObjects.push(sphereGeometry);
        floor.threeObjects.push(meshDescription);
        floor.layers = view.createViews(meshDescription, sphereMeshDescription);
    }

    function setPhysics() {
        physics.createWorld();
        physics.addShapes();
    }

    function setupFloor() {
        setView();
        setPhysics();
        // console.log('setup');
        // console.log(plaformMeshes);
        // plaformMeshes.forEach(
        //     (mesh) => {
        //       mesh.rotation.x = Math.PI / 2;
        //     }
        // );

    }

    function animate() {
        requestAnimationFrame(animate);
        layers.forEach(
            (layer, index) => {
                layer.layers.forEach(
                    (threeObject) => {
                        threeObject.renderer.render(threeObject.scene, threeObject.camera);
                    }
                );
            }
        );
    }

    const calculatePhysics = () => {
        if (floor.cannonObjects && floor.cannonObjects.length > 0) {
            world.step(1/30);
            const sphereBody = floor.cannonObjects[floor.sphereLookup.cannonIndex];

            sphereMeshes.forEach(
                (sphere) => {
                    sphere.position.x = sphereBody.position.x;
                    sphere.position.y = sphereBody.position.y;
                    sphere.position.z = sphereBody.position.z;

                    sphere.quaternion.x = sphereBody.quaternion.x;
                    sphere.quaternion.y = sphereBody.quaternion.y;
                    sphere.quaternion.z = sphereBody.quaternion.z;
                    sphere.quaternion.w = sphereBody.quaternion.w;
                }
            );
        }
    }

    setupFloor();
    let layers = [];
    layers.push(floor);
    animate();
    setInterval(calculatePhysics, 10);
 }
)()