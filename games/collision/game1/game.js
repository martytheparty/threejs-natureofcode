let controls;

(() => {
    function viewSetup() {
        let positions = [];
    
        function init() {
            positions = Object.keys(game.views);
            initializeViews();
            addPlatforms();
            addSpheres();
            addGoals();
            addBarriers();
            renderViews();
        }
    
        function initializeViews() {
            positions.forEach(
                (position) => { 
                    game.views[position].view = createView(position);
                }
            );
        }
    
        function createView(eleId) {
            const metaData = game.views[eleId].meta;
            let view = {};
            view.el = document.getElementById(eleId);
            view.scene = new THREE.Scene();
            view.camera = new THREE.PerspectiveCamera(75, view.el.width / view.el.height, 0.1, 1000);
            view.camera.position.set(metaData.camera.x, metaData.camera.y, metaData.camera.z);
            view.camera.up.set(0, 0, 1);
            view.camera.lookAt(new THREE.Vector3(metaData.lookAt.x, metaData.lookAt.y, metaData.lookAt.z));
            view.renderer = new THREE.WebGLRenderer({antialias: true, canvas: view.el});
            return view;
        }
    
        function addPlatforms() {
            positions.forEach(
                (position) => { game.views[position].platform = addPlatform(position); }
            );
        }
    
        function addPlatform(viewKey) {
            const physics = game.physics;
            const metaData = game.views[viewKey].meta;
            const platform = {};
            const dimensions = physics.platform.dimensions;
            const position = physics.platform.position;
            const geometry = new THREE.BoxGeometry(dimensions.width*2, dimensions.height*2, dimensions.depth*2);
            const material = new THREE.MeshBasicMaterial({ color: physics.platform.color });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set( position.x, position.y, position.z);
            platform.geometry = geometry;
            platform.material = material;
            platform.mesh = mesh;
            game.views[viewKey].view.scene.add(mesh);
            return platform;
        }
    
        function addSpheres() {
            positions.forEach(
                (position) => { game.views[position].sphere = addSphere(position); }
            );
        }
    
        function addSphere(viewKey) {
            const physics = game.physics;
            const metaData = game.views[viewKey].meta;
            const sphereGeometry = new THREE.SphereGeometry(physics.sphere.radius*1, physics.sphere.sides, physics.sphere.sides);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: physics.sphere.color });
            const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            mesh.position.set(physics.sphere.x, physics.sphere.y, physics.sphere.z);
            game.views[viewKey].sphere3Instance = mesh;
            game.views[viewKey].view.scene.add(mesh);
            addEyeball(viewKey);
        }

        function addEyeball(viewKey) {
            const physics = game.physics;
            const metaData = game.views[viewKey].meta;
            const sphereGeometry = new THREE.SphereGeometry(physics.sphere.eyeball.radius, physics.sphere.eyeball.sides, physics.sphere.eyeball.sides);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: physics.sphere.eyeball.color });
            const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            mesh.position.set(physics.sphere.x + physics.sphere.eyeball.xOffset, physics.sphere.y + physics.sphere.eyeball.yOffset, physics.sphere.z  +  + physics.sphere.eyeball.zOffset);
            game.views[viewKey].eyeball3Instance = mesh;
            game.views[viewKey].view.scene.add(mesh);
        }

        function addGoals() {
            addSphereGoalsToViews();
            addCubeGoalsToViews();
        }

        function addCubeGoalsToViews() {
            positions.forEach(
                (position) => {
                    addCubeGoalsToView(position);
                }
            );
        }

        function addCubeGoalsToView(viewKey) {
            game.physics.goals.cubes.forEach(
                (goal) => {
                    const cubeGeometry = new THREE.BoxGeometry(goal.width*2, goal.height*2, goal.depth*2);
                    const cubeMaterial = new THREE.MeshBasicMaterial({ color: goal.color });
                    const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    mesh.position.set(goal.x, goal.y, goal.z);
                    goal.threeMesh.push(mesh);
                    game.views[viewKey].goals.cubes.push(mesh);
                    game.views[viewKey].view.scene.add(mesh);
                }
            );
        }

        function addSphereGoalsToViews() {
            positions.forEach(
                (position) => { 
                    addSphereGoalsToView(position);
                 }
            );
        }

        function addBarriers() {
            addBarriersToViews();
        }

        function addBarriersToViews() {
            positions.forEach(
                (position) => {
                    addBarrierToView(position);
                }
            );
        }

        function addBarrierToView(viewKey) {
            game.physics.barriers.forEach(
                (barrier) => {
                    const cubeGeometry = new THREE.BoxGeometry(barrier.width*2, barrier.height*2, barrier.depth*2);
                    const cubeMaterial = new THREE.MeshBasicMaterial({ color: barrier.color });
                    const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    mesh.position.set(barrier.x, barrier.y, barrier.z);
                    barrier.threeMesh.push(mesh);
                    game.views[viewKey].goals.cubes.push(mesh);
                    game.views[viewKey].view.scene.add(mesh);
                }
            );
        }

        function addSphereGoalsToView(viewKey) {
            game.physics.goals.spheres.forEach(
                (goal) => {
                    const sphereGeometry = new THREE.SphereGeometry(goal.radius*1, goal.sides, goal.sides);
                    const sphereMaterial = new THREE.MeshBasicMaterial({ color: goal.color });
                    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
                    mesh.position.set(goal.x, goal.y, goal.z);
                    goal.threeMesh.push(mesh);
                    game.views[viewKey].goals.spheres.push(mesh);
                    game.views[viewKey].view.scene.add(mesh);
                }
            );            
        }
    
    
        function renderViews() {
            requestAnimationFrame(renderViews);

            positions.forEach(
                (position) => {
                    if (game.physics.sphere.cannonInstance.position) {
                        game.views[position].sphere3Instance.position.set(game.physics.sphere.cannonInstance.position.x, game.physics.sphere.cannonInstance.position.y, game.physics.sphere.cannonInstance.position.z);
                        game.views[position].eyeball3Instance.position.set(game.physics.sphere.cannonInstance.position.x + game.physics.sphere.eyeball.xOffset, game.physics.sphere.cannonInstance.position.y + game.physics.sphere.eyeball.yOffset, game.physics.sphere.cannonInstance.position.z +  + game.physics.sphere.eyeball.zOffset);
                     }

                    const el = game.views[position].view.el;
                    const renderer = game.views[position].view.renderer;
                    const camera = game.views[position].view.camera;
                    const scene = game.views[position].view.scene;
                    const metaData = game.views[position].meta;
                    renderer.setSize(el.width, el.height);
                    camera.up.set(0, 0, 1);
                     
                     if (game.views[position].player) {

                        const sphere = game.physics.sphere.cannonInstance;
                        if (sphere.position) {
                            camera.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
                        }
                        
                        camera.lookAt(new THREE.Vector3(metaData.lookAt.x, metaData.lookAt.y, metaData.lookAt.z));
                     }

                     game.physics.goals.spheres.forEach(
                         (sphere) => {
                            if (sphere.cannonInstance.position) {
                                sphere.threeMesh.forEach((mesh) => {
                                    mesh.position.set(sphere.cannonInstance.position.x, sphere.cannonInstance.position.y, sphere.cannonInstance.position.z);
                                });
                            }

                         }
                     );

                     game.physics.goals.cubes.forEach(
                        (cube) => {
                           if (cube.cannonInstance.position) {
                               cube.threeMesh.forEach((mesh) => {
                                   mesh.position.set(cube.cannonInstance.position.x, cube.cannonInstance.position.y, cube.cannonInstance.position.z);


                                   mesh.quaternion.x = cube.cannonInstance.quaternion.x;
                                   mesh.quaternion.y = cube.cannonInstance.quaternion.y;
                                   mesh.quaternion.z = cube.cannonInstance.quaternion.z;

                                });
                           }

                        }
                    );

                    renderer.render(scene, camera);
                }
            );
    
        }
    
        init();
    };

    function physicsSetup() {
        function init() {
            createWorld();
            addSphere();
            addPlatform();
            addGoals();
            addBarriers();
        }

        function createWorld() {
            const physics = game.physics;
            const gravity = physics.gravity;
            game.world = new CANNON.World();
            game.world.gravity.set(gravity.x, gravity.y, gravity.z);
            game.world.broadphase = new CANNON.NaiveBroadphase();
            game.world.solver.iterations = 100;
            game.world.solver.tolerance = 0;
        }

        function addSphere() {
            const sphereData = game.physics.sphere;
            const cannonSphere = new CANNON.Sphere(sphereData.radius);
            const cannonBody = new CANNON.Body({ mass: sphereData.mass }, sphereData.material);    
            cannonBody.addShape(cannonSphere);
            cannonBody.position.set(
                sphereData.x,
                sphereData.y,
                sphereData.z
            );
            game.world.add(cannonBody);
            sphereData.cannonInstance = cannonBody;
        }

        function addPlatform() {
            const physics = game.physics;
            const platformDescription = physics.platform;
            let cannonShape = new CANNON.Box(new CANNON.Vec3(platformDescription.dimensions.width, platformDescription.dimensions.height, platformDescription.dimensions.depth));
            let cannonBody = new CANNON.Body({ mass: 0 });
            cannonBody.addShape(cannonShape);
            cannonBody.position.set(
                 platformDescription.position.x,
                 platformDescription.position.y,
                 platformDescription.position.z-platformDescription.dimensions.depth/2
            );
            game.world.add(cannonBody);
            game.physics.platform.cannonInstance = cannonBody;
        }

        function addGoals() {
            addGoalSpheres();
            addGoalCubes();
        }

        function addGoalSpheres() {
            game.physics.goals.spheres.forEach(
                (sphere) => {
                    const sphereData = sphere;
                    const cannonSphere = new CANNON.Sphere(sphereData.radius);
                    const cannonBody = new CANNON.Body({ mass: sphereData.mass }, sphereData.material);    
                    cannonBody.addShape(cannonSphere);
                    cannonBody.position.set(
                        sphereData.x,
                        sphereData.y,
                        sphereData.z
                    );
                    game.world.add(cannonBody);
                    sphereData.cannonInstance = cannonBody;

                }
            );
        }

        function addGoalCubes() {
            game.physics.goals.cubes.forEach(
                (cube) => {
                    const cubeData = cube;
                    const cannonCube = new CANNON.Box(new CANNON.Vec3(cube.width, cube.height, cube.depth));
                    const cannonBody = new CANNON.Body({ mass: cube.mass }, cube.material);    
                    cannonBody.addShape(cannonCube);
                    cannonBody.position.set(
                        cubeData.x,
                        cubeData.y,
                        cubeData.z
                    );
                    game.world.add(cannonBody);
                    cubeData.cannonInstance = cannonBody;

                }
            );
        }

        function addBarriers() {
            game.physics.barriers.forEach(
                (barrier) => {
                    const cubeData = barrier;
                    const cannonCube = new CANNON.Box(new CANNON.Vec3(cubeData.width, cubeData.height, cubeData.depth));
                    const cannonBody = new CANNON.Body({ mass: cubeData.mass }, cubeData.material);    
                    cannonBody.addShape(cannonCube);
                    cannonBody.position.set(
                        cubeData.x,
                        cubeData.y,
                        cubeData.z
                    );
                    game.world.add(cannonBody);
                    cubeData.cannonInstance = cannonBody;
                }
            );
        }

        init();
        const calculatePhysics = () => {
            game.world.step(1/30);
        }
        setInterval(calculatePhysics, 10);
    }

    function controlsSetup() {
        function init() {
            game.controls.setPosition = (pos) => {
                const offset = .01;
                const platform = game.physics.platform.cannonInstance;
                platform.quaternion.y = 0;
                platform.quaternion.x = 0;

                if (pos.includes('u')) platform.quaternion.y = -1*offset;
                if (pos.includes('d')) platform.quaternion.y = offset;
                if (pos.includes('r')) platform.quaternion.x = -1*offset;
                if (pos.includes('l')) platform.quaternion.x = offset;

                const sphere = game.physics.sphere.cannonInstance;

                if (pos) {
                    game.views.ball.meta.lookAt.x = 0;
                    game.views.ball.meta.lookAt.y = 0; 
                    game.views.ball.meta.lookAt.z = 0;

                    game.physics.sphere.eyeball.xOffset = 0;
                    game.physics.sphere.eyeball.yOffset = 0;
                    
                    if (pos.includes('u')) {
                        game.views.ball.meta.lookAt.x = -145;
                        game.physics.sphere.eyeball.xOffset = game.physics.sphere.radius * -1;
                    } 

                    if (pos.includes('d')){
                        game.views.ball.meta.lookAt.x = 145;
                        game.physics.sphere.eyeball.xOffset = game.physics.sphere.radius;
                    } 

                    if (pos.includes('r')){
                        game.views.ball.meta.lookAt.y = 145;
                        game.physics.sphere.eyeball.yOffset = game.physics.sphere.radius;
                    } 

                    if (pos.includes('l')){
                        game.views.ball.meta.lookAt.y = -145;
                        game.physics.sphere.eyeball.yOffset = game.physics.sphere.radius * -1;
                    } 
                }


            };
        }

        init();

    }

    /*
     * state of the game 
     */
    const game = {
        controls: {
            setPosition: undefined
        },
        world: {},
        physics: {
            gravity: {x: 0, y: 0, z: -100},
            barriers: [{
                material: new CANNON.Material('material'),
                mass: 10000,
                width: 25,
                depth: 25,
                height: 25,
                x: -130,
                y: -130,
                z: 40,
                color: 0x654321,
                cannonInstance: {},
                threeMesh: [],
            },{
                material: new CANNON.Material('material'),
                mass: 10000,
                width: 25,
                depth: 25,
                height: 25,
                x: -130,
                y: 130,
                z: 40,
                color: 0x654321,
                cannonInstance: {},
                threeMesh: [],
            },{
                material: new CANNON.Material('material'),
                mass: 10000,
                width: 25,
                depth: 25,
                height: 25,
                x: 130,
                y: -130,
                z: 40,
                color: 0x654321,
                cannonInstance: {},
                threeMesh: [],
            },{
                material: new CANNON.Material('material'),
                mass: 10000,
                width: 25,
                depth: 25,
                height: 25,
                x: 130,
                y: 130,
                z: 40,
                color: 0x654321,
                cannonInstance: {},
                threeMesh: [],
            }],
            sphere: {
                material: new CANNON.Material('material'),
                mass: 15000,
                radius: 15,
                sides: 32,
                x: 0, 
                y: 25, 
                z: 500,
                color: 0xca2c92,
                cannonInstance: {},
                eyeball: {
                    radius: 5,
                    sides: 32,
                    color: 0xffffff,
                    xOffset: 0,
                    yOffset: 0,
                    zOffset: 15
                }
            },
            platform: {
                dimensions: {width: 150, height: 150, depth: 15},
                position: { x: 0, y: 0, z: 0 },
                color: 0xC19A6B
            },
            goals: { 
                cubes: [{
                    material: new CANNON.Material('material'),
                    mass: 50,
                    width: 100,
                    depth: 35,
                    height: 3,
                    x: 0,
                    y: -130,
                    z: 35,
                    color: 0xFF0000,
                    cannonInstance: {},
                    threeMesh: [],
                },{
                    material: new CANNON.Material('material'),
                    mass: 50,
                    width: 100,
                    depth: 35,
                    height: 3,
                    x: 0,
                    y: 130,
                    z: 35,
                    color: 0xFF0000,
                    cannonInstance: {},
                    threeMesh: [],
                },{
                    material: new CANNON.Material('material'),
                    mass: 50,
                    width: 3,
                    depth: 35,
                    height: 100,
                    x: 130,
                    y: 0,
                    z: 35,
                    color: 0xFF0000,
                    cannonInstance: {},
                    threeMesh: [],
                },{
                    material: new CANNON.Material('material'),
                    mass: 50,
                    width: 3,
                    depth: 35,
                    height: 100,
                    x: -130,
                    y: 0,
                    z: 35,
                    color: 0xFF0000,
                    cannonInstance: {},
                    threeMesh: [],
                }
                ], 
                spheres: [{
                    material: new CANNON.Material('material'),
                    mass: 100,
                    radius: 20,
                    sides: 32,
                    x: 0, 
                    y: 0, 
                    z: 45,
                    color: 0x00FFFF,
                    cannonInstance: {},
                    threeMesh: [],
                }, {
                    material: new CANNON.Material('material'),
                    mass: 100,
                    radius: 20,
                    sides: 32,
                    x: 30, 
                    y: 30, 
                    z: 45,
                    color: 0x0000FF,
                    cannonInstance: {},
                    threeMesh: [],
                }, {
                    material: new CANNON.Material('material'),
                    mass: 100,
                    radius: 20,
                    sides: 32,
                    x: 0, 
                    y: 56, 
                    z: 45,
                    color: 0x00FF00,
                    cannonInstance: {},
                    threeMesh: [],
                }, {
                    material: new CANNON.Material('material'),
                    mass: 100,
                    radius: 20,
                    sides: 32,
                    x: 30, 
                    y: -30, 
                    z: 45,
                    color: 0xFFFF00,
                    cannonInstance: {},
                    threeMesh: [],
                }, {
                    material: new CANNON.Material('material'),
                    mass: 100,
                    radius: 20,
                    sides: 32,
                    x: -30, 
                    y: 30, 
                    z: 45,
                    color: 0xFF0000,
                    cannonInstance: {},
                    threeMesh: [],
                }
                ] 
            }
        },
        views: {
            main: {
                sphere3Instance: {},
                eyeball3Instance: {},
                goals: {
                    cubes: [],
                    spheres: [],
                },
                meta: { 
                    camera: { x: 0, y: 0, z: 350 },
                    lookAt: { x: 0, y: 0, z: 0 }
                } 
            },
            left: { 
                sphere3Instance: {},
                eyeball3Instance: {},
                goals: {
                    cubes: [],
                    spheres: [],
                },
                meta: { 
                    camera: { x: 750, y: 0, z: 20 },
                    lookAt: { x: 0, y: 0, z: 0 }
                }
            },
            front: { 
                sphere3Instance: {},
                eyeball3Instance: {},
                goals: {
                    cubes: [],
                    spheres: [],
                },
                meta: { 
                    camera: { x: 250, y: 0, z: 20 },
                    lookAt: { x: 0, y: 0, z: 0 }
                } 
            },
            ball: { 
                player: true,
                sphere3Instance: {},
                eyeball3Instance: {},
                goals: {
                    cubes: [],
                    spheres: [],
                },
                meta: { 
                    camera: { x: -145, y: 0, z: 20 },
                    lookAt: { x: 0, y: 0, z: 0 }
                } 
            }
        }
    }

    viewSetup();
    physicsSetup();
    controlsSetup();
    controls = game.controls;
  })()

