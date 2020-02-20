( () => {
    let world;
    const floor = new ThreeDObject();
    const goal = {
            width: 10,
            depth: 10,
            height: 10,
            x: 0,
            y: 0,
            z: 20,
            found: false
    };

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
        x: -145, 
        y: 0, 
        z: 45
    };

    const sphereMeshes = [];
    const plaformMeshes = [];
    const goalMeshes = [];
    const cannonPlatforms = [];
    const gravity = -100;
    let topCameraPosition = 350;
    let frontCameraXPosition = 250;
    let frontCameraZPosition = 20;
    let leftCameraYPosition = -250;
    let leftCameraZPosition = 20;
    let ballCamera;
    let win = false;
    let lose = false;
    let done = false;
    let subscriptions = [];

    const gameApi = (
        () => {
            const api = {};
            api.setPosition = (position) => {
                const offset = .01;
                cannonPlatforms[0].quaternion.y = 0;
                cannonPlatforms[0].quaternion.x = 0;
                if (position.includes('u')) cannonPlatforms[0].quaternion.y = -1*offset;
                if (position.includes('d')) cannonPlatforms[0].quaternion.y = offset;
                if (position.includes('r')) cannonPlatforms[0].quaternion.x = -1*offset;
                if (position.includes('l')) cannonPlatforms[0].quaternion.x = offset;

            };
            api.addSubscription = (callback) => {
                subscriptions.push(callback);
            }
            api.reset = () => {
                document.location.reload();
            }
            return api;
        }
    )();

    const view = {
        createMainView: (mesh, sphereMesh, goalMesh) => {
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
            if (goalMesh) {
                threeObject.scene.add(goalMesh);
            }
            threeObject.renderer.setSize(mainElement.width, mainElement.height);
            return threeObject;
        },
        createFrontView: (mesh, sphereMesh, goalMesh) => {
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
            if (goalMesh) {
                threeObject.scene.add(goalMesh);
            }
            threeObject.renderer.setSize(frontElement.width, frontElement.height);
            return threeObject;
        },
        createLeftView: (mesh, sphereMesh, goalMesh) => {
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
            if (goalMesh) {
                threeObject.scene.add(goalMesh);
            }
            threeObject.renderer.setSize(leftElement.width, leftElement.height);
            return threeObject;
        },
        createBallView: (mesh, sphereMesh, goalMesh) => {
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
            if (goalMesh) {
                threeObject.scene.add(goalMesh);
            }
            threeObject.renderer.setSize(ballElement.width, ballElement.height);
            ballCamera = threeObject.camera;
            return threeObject;
        },
        getRenderingMesh: (meshDescription) => {
            let mesh = new THREE.Mesh(meshDescription.geometry, meshDescription.material);
            mesh.position.set(meshDescription.x, meshDescription.y, meshDescription.z);
            return mesh;
        },
        createViews: (meshDescription, sphereMeshDescription, goalMeshDescription) => {
            sphereMeshes.push(view.getRenderingMesh(sphereMeshDescription));
            sphereMeshes.push(view.getRenderingMesh(sphereMeshDescription));
            sphereMeshes.push(view.getRenderingMesh(sphereMeshDescription));
            sphereMeshes.push(view.getRenderingMesh(sphereMeshDescription));

            plaformMeshes.push(view.getRenderingMesh(meshDescription));
            plaformMeshes.push(view.getRenderingMesh(meshDescription));
            plaformMeshes.push(view.getRenderingMesh(meshDescription));
            plaformMeshes.push(view.getRenderingMesh(meshDescription));

            goalMeshes.push(view.getRenderingMesh(goalMeshDescription));
            goalMeshes.push(view.getRenderingMesh(goalMeshDescription));
            goalMeshes.push(view.getRenderingMesh(goalMeshDescription));
            goalMeshes.push(view.getRenderingMesh(goalMeshDescription));

            const views = [];
            views.push(view.createMainView(plaformMeshes[0], sphereMeshes[0], goalMeshes[0]));
            views.push(view.createFrontView(plaformMeshes[1], sphereMeshes[1], goalMeshes[1]));
            views.push(view.createLeftView(plaformMeshes[2], sphereMeshes[2], goalMeshes[2]));
            views.push(view.createBallView(plaformMeshes[3], sphereMeshes[3], goalMeshes[3]));
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
            cannonPlatforms.push(cannonBody1);
            let cannonBody2 = new CANNON.Body({ mass: 0 });
            cannonBody2.addShape(cannonShape);
            cannonBody2.position.set(
                platformDescription.x,
                platformDescription.y,
                platformDescription.z-(platformDescription.depth + platformDescription.depth/2)
            );
            world.add(cannonBody2);
            cannonPlatforms.push(cannonBody2);
            floor.sphereLookup.cannonIndex = floor.cannonObjects.length;
            floor.cannonObjects.push(cannonBody);
            floor.platformLookup.uiPlatformIndex = floor.cannonObjects.length;
            floor.cannonObjects.push(cannonBody1);
            floor.platformLookup.rotatePlatformIndex = floor.cannonObjects.length;
            floor.cannonObjects.push(cannonBody2);
        }
    }

    const CollisionDetection = {
        checkForCollision: () => {
            const sphereBody = floor.cannonObjects[floor.sphereLookup.cannonIndex];
            const goalX = goal.x - sphereBody.position.x;
            const goalY = goal.y - sphereBody.position.y;
            const sphere = new SAT.Circle(new SAT.Vector(), sphereBody.boundingRadius);
            const goalSquare = new SAT.Polygon(new SAT.Vector(goalX, goalY), [
            new SAT.Vector(goal.depth, goal.width),
            new SAT.Vector(-1*goal.depth, goal.width),
            new SAT.Vector(-1*goal.depth, -1*goal.width),
            new SAT.Vector(goal.depth, -1*goal.width)
           ]);

           var response = new SAT.Response();
           var collided = SAT.testPolygonCircle(goalSquare, sphere, response);
           return collided;

        }
    }

    function setView() {
        const geometry = new THREE.BoxGeometry(platformDescription.width*2, platformDescription.height*2, platformDescription.depth*2);
        const goalGeometry = new THREE.BoxGeometry(goal.width*2, goal.height*2, goal.depth*2);
        const material = new THREE.MeshBasicMaterial({ color: 0xC19A6B });
        const goalMaterial = new THREE.MeshBasicMaterial({ color: 0x8b2222 });
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const meshDescription = { geometry, material, x: 0, y: 0, z: 0 };
        const goalDescription = { goalGeometry, goalMaterial, x: goal.x, y: goal.y, z: goal.z };
        sphereGeometry = new THREE.SphereGeometry(sphereDescription.radius, sphereDescription.sides, sphereDescription.sides);
        const sphereMeshDescription = { geometry: sphereGeometry, material: sphereMaterial, x: sphereDescription.x, y: sphereDescription.y, z: sphereDescription.z };    
        const goalMeshDescription = { geometry: goalGeometry, material: goalMaterial, x: goalDescription.x, y: goalDescription.y, z: goalDescription.z };
        floor.sphereLookup.threeIndex = floor.threeObjects.length;
        floor.threeObjects.push(sphereGeometry);
        floor.threeObjects.push(meshDescription);
        floor.threeObjects.push(goalDescription);
        floor.layers = view.createViews(meshDescription, sphereMeshDescription, goalMeshDescription);
    }

    function setPhysics() {
        physics.createWorld();
        physics.addShapes();
    }

    function setupApi() {
        const gameDiv = document.getElementById('game');
        gameDiv.gameApi = gameApi;
    }

    function setupFloor() {
        setView();
        setPhysics();
        setupApi();
    }
    checkStatus = () => {

        if (!done) {
            const sphereBody = floor.cannonObjects[floor.sphereLookup.cannonIndex];
            if (sphereBody.position.z < 0) {
                //console.log('LOSE');
                lose = true;
            }
        }


        if(win && !done) {
            done = true;
            subscriptions.forEach(
                (subscription) => {
                    subscription('win');
                }
            );
        } else if (lose && !done) {
            // console.log('LOSE');
            done = true;
            subscriptions.forEach(
                (subscription) => {
                    subscription('lose');
                }
            );
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        if (!win && CollisionDetection.checkForCollision()) {
            goalMeshes.forEach(
                (goalMesh) => {
                    goalMesh.material.color.r = 0;
                    goalMesh.material.color.b = 1;
                }
            );
            win = true;
        }

        checkStatus();

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
            plaformMeshes.forEach(
                (mesh) => {
                    mesh.quaternion.x = cannonPlatforms[0].quaternion.x;
                    mesh.quaternion.y = cannonPlatforms[0].quaternion.y;
                    mesh.quaternion.z = cannonPlatforms[0].quaternion.z;
                    mesh.quaternion.w = cannonPlatforms[0].quaternion.w;
                }
            );
            ballCamera.position.x = sphereBody.position.x;
            ballCamera.position.y = sphereBody.position.y;
            ballCamera.position.z = sphereBody.position.z;
            ballCamera.lookAt(new THREE.Vector3(0, 0, 0));
        }
    }
    setupFloor();
    let layers = [];
    layers.push(floor);
    animate();
    setInterval(calculatePhysics, 10);
 }
)()