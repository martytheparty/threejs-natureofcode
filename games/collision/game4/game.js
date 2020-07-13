let controls;
let getGameData;

(() => {
    function viewSetup() {
        let positions = [];

        function init() {
            positions = Object.keys(game.views);
            initializeViews();
            addWalls();
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
            view.camera = new THREE.PerspectiveCamera(75, view.el.width / view.el.height, 0.1, 10000);
            view.camera.position.set(metaData.camera.x, metaData.camera.y, metaData.camera.z);
            view.camera.up.set(0, 0, 1);
            view.camera.lookAt(new THREE.Vector3(metaData.lookAt.x, metaData.lookAt.y, metaData.lookAt.z));
            view.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: view.el });
            return view;
        }

        function addWalls() {
            
            positions.forEach(
                (position) => { 
                    console.log('add wall to ', position); 
                    game.walls.forEach(
                        (wall) => {
                            console.log(wall);
                            // var geometry = new THREE.PlaneGeometry( 0, 0, 1000 );
                            // var material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
                            // var plane = new THREE.Mesh( geometry, material );
                            // game.views[position].view.scene.add(plane);
                            //const position = platform.position;
                            //const geometry = new THREE.BoxGeometry(2000, 2000, 2000);
                            //const material = new THREE.MeshBasicMaterial({ color: wall.color });
                            //material.sides = THREE.BackSide;
                            //const mesh1 = new THREE.Mesh(geometry, material);
                            //mesh1.position.set(wall.x, wall.y, wall.z);
                            //game.views[position].view.scene.add(mesh1);


                            var geometry = new THREE.PlaneGeometry( 10000, 10000, 1, 1 );
                            var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
                            var plane = new THREE.Mesh( geometry, material );

                            plane.rotation.y = Math.PI / 2;
                            plane.position.set(5000, 0, 0);
                            game.views[position].view.scene.add( plane );

                            var geometry1 = new THREE.PlaneGeometry( 10000, 10000, 1, 1 );
                            var material1 = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
                            var plane1 = new THREE.Mesh( geometry1, material1 );

                            plane1.rotation.y = Math.PI / 2;
                            plane1.position.set(-5000, 0, 0);
                            game.views[position].view.scene.add( plane1 );

                            var geometry2 = new THREE.PlaneGeometry( 10000, 10000, 1, 1 );
                            var material2 = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} );
                            var plane2 = new THREE.Mesh( geometry2, material2 );

                            plane2.rotation.x = Math.PI / 2;
                            plane2.position.set(0, 5000, 0);
                            game.views[position].view.scene.add( plane2 );                            

                            var geometry3 = new THREE.PlaneGeometry( 10000, 10000, 1, 1 );
                            var material3 = new THREE.MeshBasicMaterial( {color: 0x00ffff, side: THREE.DoubleSide} );
                            var plane3 = new THREE.Mesh( geometry3, material3 );

                            plane3.rotation.x = Math.PI / 2;
                            plane3.position.set(0, 5000, 0);
                            game.views[position].view.scene.add( plane3 );              
                            
                            var geometry4 = new THREE.PlaneGeometry( 10000, 10000, 1, 1 );
                            var material4 = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} );
                            var plane4 = new THREE.Mesh( geometry4, material4 );

                            plane4.rotation.x = Math.PI / 2;
                            plane4.position.set(0, -5000, 0);
                            game.views[position].view.scene.add( plane4 );

                            var geometry5 = new THREE.PlaneGeometry( 10000, 10000, 1, 1 );
                            var material5 = new THREE.MeshBasicMaterial( {color: 0xcccccc, side: THREE.DoubleSide} );
                            var plane5 = new THREE.Mesh( geometry5, material5 );

                            //plane5.rotation.x = 0;
                            plane5.position.set(0, 0, -5000);
                            game.views[position].view.scene.add( plane5 );

                        }
                    );

                }
            );
        } 

        function addPlatforms() {
            positions.forEach(
                (position) => { game.views[position].platform = addPlatform(position); }
            );
        }

        function addPlatform(viewKey) {
            const physics = game.physics;
            const metaData = game.views[viewKey].meta;

            physics.platform.forEach(
                (platform) => {
                    const platform1 = {};
                    const dimensions = platform.dimensions;
                    const position = platform.position;
                    const geometry = new THREE.BoxGeometry(dimensions.width * 2, dimensions.height * 2, dimensions.depth * 2);
                    const material = new THREE.MeshBasicMaterial({ color: platform.color });
                    const mesh1 = new THREE.Mesh(geometry, material);
                    mesh1.position.set(position.x, position.y, position.z);
                    platform1.geometry = geometry;
                    platform1.material = material;
                    platform1.mesh = mesh1;

                    const scene = game.views[viewKey].view.scene;
                    const mesh = mesh1;
                    const threeItems = {scene, mesh};
                    platform.three.push(threeItems);

                    game.views[viewKey].view.scene.add(mesh1);
                }
            );



            // const platform2 = {};
            // const dimensions2 = physics.platform[1].dimensions;
            // const position2 = physics.platform[1].position;
            // const geometry2 = new THREE.BoxGeometry(dimensions.width*2, dimensions.height*2, dimensions.depth*2);
            // const material2 = new THREE.MeshBasicMaterial({ color: physics.platform[1].color });
            // const mesh2 = new THREE.Mesh(geometry2, material2);
            // mesh2.position.set( position2.x, position2.y, position2.z);
            // platform1.geometry = geometry2;
            // platform1.material = material2;
            // platform1.mesh = mesh2;
            // game.views[viewKey].view.scene.add(mesh2);

            // return platform1;
        }

        function addSpheres() {
            positions.forEach(
                (position) => { game.views[position].sphere = addSphere(position); }
            );
        }

        function addSphere(viewKey) {
            const physics = game.physics;
            const metaData = game.views[viewKey].meta;
            const sphereGeometry = new THREE.SphereGeometry(physics.sphere.radius * .9, physics.sphere.sides, physics.sphere.sides);
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
            mesh.position.set(physics.sphere.x + physics.sphere.eyeball.xOffset, physics.sphere.y + physics.sphere.eyeball.yOffset, physics.sphere.z + + physics.sphere.eyeball.zOffset);
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
                    const cubeGeometry = new THREE.BoxGeometry(goal.width * 2, goal.height * 2, goal.depth * 2);
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
                    const cubeGeometry = new THREE.BoxGeometry(barrier.width * 2, barrier.height * 2, barrier.depth * 2);
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
                    const sphereGeometry = new THREE.SphereGeometry(goal.radius * .6, goal.sides, goal.sides);
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
                    let eyeX = 0;
                    let eyeY = 0;
                    let eyeZ = 0;
                    let thirdX = 0;
                    let thirdY = 0;
                    let thirdZ = 0;

                    if (game.physics.sphere.cannonInstance.position) {
                        game.views[position].sphere3Instance.position.set(game.physics.sphere.cannonInstance.position.x, game.physics.sphere.cannonInstance.position.y, game.physics.sphere.cannonInstance.position.z);
                        game.views[position].eyeball3Instance.position.set(game.physics.sphere.cannonInstance.position.x + game.physics.sphere.eyeball.xOffset, game.physics.sphere.cannonInstance.position.y + game.physics.sphere.eyeball.yOffset, game.physics.sphere.cannonInstance.position.z + + game.physics.sphere.eyeball.zOffset);
                        eyeX = game.physics.sphere.cannonInstance.position.x;
                        eyeY = game.physics.sphere.cannonInstance.position.y;
                        eyeZ = game.physics.sphere.cannonInstance.position.z;
                        thirdX = game.physics.sphere.cannonInstance.position.x + game.physics.sphere.thirdPerson.xOffset;
                        thirdY = game.physics.sphere.cannonInstance.position.y + game.physics.sphere.thirdPerson.yOffset;
                        thirdZ = game.physics.sphere.cannonInstance.position.z + 50;
                    }

                    const el = game.views[position].view.el;
                    const renderer = game.views[position].view.renderer;
                    const camera = game.views[position].view.camera;
                    if (position == 'main') {
                        camera.position.set(eyeX, eyeY, eyeZ + 200);
                    } else if (position == 'front') {
                        // camera.position.set(eyeX, eyeY, eyeZ + 200);
                        camera.position.set(thirdX, thirdY, thirdZ);
                    } else if (position == 'left') {
                        // camera.position.set(eyeX, eyeY, eyeZ + 200);
                        camera.position.set(thirdX + 400, thirdY, thirdZ);
                    } else {
                        camera.position.set(camera.position.x, camera.position.y, eyeZ + 15);
                    }
                    const scene = game.views[position].view.scene;
                    const metaData = game.views[position].meta;
                    renderer.setSize(el.width, el.height);
                    camera.up.set(0, 0, 1);

                    const sphere = game.physics.sphere.cannonInstance;

                    if (game.views[position].player) {

                        let lookAtZ = 0;

                        if (sphere.position) {
                            camera.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
                            lookAtZ = sphere.position.z;
                        }

                        camera.lookAt(new THREE.Vector3(metaData.lookAt.x, metaData.lookAt.y, lookAtZ));
                    } else if (position == 'front' && sphere.position) {
                        camera.lookAt(new THREE.Vector3(sphere.position.x, sphere.position.y, sphere.position.z));
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
            addPlatforms();
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

        function addPlatforms() {
            const physics = game.physics;

            physics.platform.forEach(
                (platform) => {
                    const platformDescription = platform;
                    let cannonShape = new CANNON.Box(new CANNON.Vec3(platformDescription.dimensions.width, platformDescription.dimensions.height, platformDescription.dimensions.depth));
                    let cannonBody = new CANNON.Body({ mass: 0 });
                    cannonBody.addShape(cannonShape);
                    cannonBody.position.set(
                        platformDescription.position.x,
                        platformDescription.position.y,
                        platformDescription.position.z - platformDescription.dimensions.depth / 2
                    );
                    game.world.add(cannonBody);
                    platform.cannonInstance = cannonBody;
                }
            );

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
            game.world.step(1 / 30);
        }
        setInterval(calculatePhysics, 10);
 
 
        const checkPlatforms = () => {
            //console.log('set platforms', game.physics.platform[0].three);
            game.physics.platform.forEach(
                (platform) => {
                    if (!platform.de) {
                        platform.three.forEach(
                            (three) => {
                                if (platform.position.z > game.physics.sphere.cannonInstance.position.z) {
                                    platform.deleted = true;
                                    three.scene.remove(three.mesh);
                                }
                            }
                        );
                    }
                }
            );
        }
        checkPlatforms();
        setInterval(checkPlatforms, 500);
    }

    function controlsSetup() {
        function init() {
            game.controls.reset = () => {
                game = JSON.parse(initStateString);
                viewSetup();
                physicsSetup();
            }
            game.controls.setPosition = (pos) => {
                const offset = .01;
                let rotate = false;

                game.physics.platform.forEach(
                    (platform) => {
                        platform.cannonInstance.quaternion.y = 0;
                        platform.cannonInstance.quaternion.x = 0;

                        if (pos.includes('u')) platform.cannonInstance.quaternion.y = -1 * offset;
                        if (pos.includes('d')) platform.cannonInstance.quaternion.y = offset;
                        if (pos.includes('r')) platform.cannonInstance.quaternion.x = -1 * offset;
                        if (pos.includes('l')) platform.cannonInstance.quaternion.x = offset;
                        if (pos === "f") rotate = true;

                    }
                );

                const sphere = game.physics.sphere.cannonInstance;

                if (pos) {


                    if (rotate) {
                        const speedFactor = .25;
                        sphere.angularVelocity.set(
                            speedFactor * game.physics.sphere.eyeball.yOffset * -1,
                            speedFactor * game.physics.sphere.eyeball.xOffset,
                            0
                        );
                    } else {
                        game.physics.sphere.eyeball.xOffset = 0;
                        game.physics.sphere.eyeball.yOffset = 0;
                        game.physics.sphere.thirdPerson.xOffset = 0;
                        game.physics.sphere.thirdPerson.yOffset = 0;
                    }

                    if (pos.includes('u') || pos.includes('d') || pos.includes('r') || pos.includes('l')) {
                        game.views.ball.meta.lookAt.x = game.physics.sphere.cannonInstance.position.x;
                        game.views.ball.meta.lookAt.y = game.physics.sphere.cannonInstance.position.y;
                    } else if (pos.includes('f')) {
                        console.log('?');
                    } else {
                        game.views.ball.meta.lookAt.x = 0;
                        game.views.ball.meta.lookAt.y = 0;
                        game.views.ball.meta.lookAt.z = 0;
                    }

                    if (pos.includes('u')) {
                        game.views.ball.meta.lookAt.x = -1450;
                        game.physics.sphere.eyeball.xOffset = game.physics.sphere.radius * -1;
                        game.physics.sphere.thirdPerson.xOffset = game.physics.sphere.radius * 5;
                    }

                    if (pos.includes('d')) {
                        game.views.ball.meta.lookAt.x = 1450;
                        game.physics.sphere.eyeball.xOffset = game.physics.sphere.radius;
                        game.physics.sphere.thirdPerson.xOffset = game.physics.sphere.radius * -5;
                    }

                    if (pos.includes('r')) {
                        game.views.ball.meta.lookAt.y = 1450;
                        game.physics.sphere.eyeball.yOffset = game.physics.sphere.radius;
                        game.physics.sphere.thirdPerson.yOffset = game.physics.sphere.radius * -5;
                    }

                    if (pos.includes('l')) {
                        game.views.ball.meta.lookAt.y = -1450;
                        game.physics.sphere.eyeball.yOffset = game.physics.sphere.radius * -1;
                        game.physics.sphere.thirdPerson.yOffset = game.physics.sphere.radius * 5;
                    }
                }



            };
        }

        init();

    }

    /*
     * state of the game 
     */
    let game = {
        walls: [
            {
                color: 0x00FF00
            }
        ],
        controls: {
            setPosition: undefined
        },
        world: {},
        physics: {
            gravity: { x: 0, y: 0, z: -100 },
            barriers: [],
            sphere: {
                material: new CANNON.Material('material'),
                mass: 15000,
                radius: 15,
                sides: 32,
                x: 0,
                y: 0,
                z: 500,
                color: 0x00FFFF,
                cannonInstance: {},
                eyeball: {
                    radius: 5,
                    sides: 32,
                    color: 0x0000FF,
                    xOffset: 0,
                    yOffset: 0,
                    zOffset: 15
                },
                thirdPerson: {
                    xOffset: 0,
                    yOffset: 0,
                    zOffset: 15
                }
            },
            platform: [{
                dimensions: { width: 150, height: 150, depth: 15 },
                position: { x: 0, y: 0, z: 0 },
                color: 0x555555,
                three: {}
            }, {
                dimensions: { width: 150, height: 150, depth: 15 },
                position: { x: -350, y: 0, z: -160 },
                color: 0x555555,
                three: []
            }, {
                dimensions: { width: 150, height: 150, depth: 15 },
                position: { x: -700, y: 0, z: -300 },
                color: 0x555555,
                three: []
            }, {
                dimensions: { width: 150, height: 150, depth: 15 },
                position: { x: -1050, y: 0, z: -380 },
                color: 0x555555,
                three: []
            }, {
                dimensions: { width: 150, height: 150, depth: 15 },
                position: { x: -1400, y: 0, z: -500 },
                color: 0x555555,
                three: []
            }],
            goals: {
                cubes: [],
                spheres: []
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
                    camera: { x: 0, y: 0, z: 500 },
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
                    camera: { x: 400, y: 0, z: 20 },
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

    game.physics.platform = [];

    const seed = 1;
    const simplex = new SimplexNoise(seed);

    for(let i = 0; i < 20; i++) {
        let color = 16777215 - i * 4000;
        if (i === 19) {
            color = 255;
        }

        let value2d = simplex.noise2D(0, i/10);
        //console.log('value', value2d*200);
        
        const val = value2d*100;
        
        //console.log(i, val);

        const x = i * 200 * -1;
        const y = i * val;
        const z = i * 150 * -1;
        const platform = {


            dimensions: { width: 150, height: 150, depth: 15 },
            position: { x, y, z },
            color: color,
            three: []
        };

        game.physics.platform.push(platform);
    }

    const initStateString = JSON.stringify(game);

    viewSetup();
    physicsSetup();
    controlsSetup();
    controls = game.controls;
    getGameData = () => {
        return game;
    }
})()

