let controls;
let getGameData;

// scene
//   meshes[] 
//     pos
//     material
//   lights[]
// TIME TO DO THIS IN TYPESCRIPT

const world = {};
world.scenes = [];
world.addPlatForm = (platform) => {
    
};

(() => {
    function viewSetup() {
        let positions = [];

        function init() {
            positions = Object.keys(game.views);
            initializeViews();
            addPlatforms();
            addSpheres();
            addGoals();
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
            const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 1 ); // soft white light
            const spotLight = new THREE.SpotLight(0xFFFFFF);
            spotLight.position.set( 0, 0, 130 );
            spotLight.castShadow = true;

            let view = {};
            let urls = [
                'neg-y.png',
                'pos-x.png',
                'pos-z.png',
                'neg-z.png',
                'neg-x.png',
                'pos-y.png'
            ];
            let sceneCube = new THREE.CubeTextureLoader()
                .load(urls);
            view.el = document.getElementById(eleId);
            view.scene = new THREE.Scene();
            world.scenes.push(view.scene);
            //view.scene.add( ambientLight );
            view.scene.add( spotLight );
            //view.scene.background = 0xFFFFFF;
                const loader = new THREE.TextureLoader();
                const bgTexture = loader.load('skybox-front.png');
                view.scene.background = sceneCube;
            
            view.camera = new THREE.PerspectiveCamera(75, view.el.width / view.el.height, 0.1, 10000);
            view.camera.position.set(metaData.camera.x, metaData.camera.y, metaData.camera.z);
            view.camera.up.set(0, 0, 1);
            view.camera.lookAt(new THREE.Vector3(metaData.lookAt.x, metaData.lookAt.y, metaData.lookAt.z));
            view.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: view.el });
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

            physics.platform.forEach(
                (platform) => {
                    // add a light above the platform
                    const pointLight = new THREE.PointLight(0x00FF00, 1);
                    //spotLight.castShadow = true;
                    pointLight.position.set( platform.position.x, platform.position.y, platform.position.z + 10 );  
                    //game.views[viewKey].view.scene.add(pointLight);                  


                    const platform1 = {};
                    const dimensions = platform.dimensions;
                    const position = platform.position;
                    const geometry = new THREE.BoxGeometry(dimensions.width * 2, dimensions.height * 2, dimensions.depth );
                    const material = new THREE.MeshBasicMaterial({ color: platform.color });
                    // var envMap = new THREE.TextureLoader().load('skybox-front.png');
                    const loader = new THREE.TextureLoader();
                    const roughTexture = loader.load('checkerboard.jpg');
                    const shinyTexture = loader.load('concrete.JPG');
                    

                    const material1 = new THREE.MeshStandardMaterial( {

                         color: 0xffffff,
                    
                         roughness: .4,
                         metalness: 1,
                    
                         roughnessMap: roughTexture,
                         metalnessMap: shinyTexture,
                    
                    //     envMap: envMap, // important -- especially for metals!
                    //     envMapIntensity: envMapIntensity
                    
                     } );

                    const mesh1 = new THREE.Mesh(geometry, material1);
                    mesh1.position.set(position.x, position.y, position.z);
                    // mesh1.castShadow = true;
                    mesh1.receiveShadow = true;
                    platform1.geometry = geometry;
                    platform1.material = material;
                    platform1.mesh = mesh1;

                    const scene = game.views[viewKey].view.scene;
                    const mesh = mesh1;
                    const threeItems = { scene, mesh };
                    platform.three.push(threeItems);

                    game.views[viewKey].view.scene.add(mesh1);
                }
            );

        }

        function addSpheres() {
            positions.forEach(
                (position) => { game.views[position].sphere = addSphere(position); }
            );
        }

        function addSphere(viewKey) {
            /*
            Convert the sphere to a group of objects so the rotation will be visible.
            */
            const sphereGroup = new THREE.Group();
            const physics = game.physics;
            const metaData = game.views[viewKey].meta;



            const sphereGeometry = new THREE.SphereGeometry(physics.sphere.radius * 1, physics.sphere.sides, physics.sphere.sides);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: physics.sphere.color });
            let mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

            const loader = new THREE.TextureLoader();
            const roughTexture = loader.load('scratch.jpg');
            const shinyTexture = loader.load('concrete.JPG');
            

            const material1 = new THREE.MeshStandardMaterial( {

                 color: 0xffffff,
            
                 roughness: .4,
                 metalness: 1,
            
                 roughnessMap: shinyTexture,
                 metalnessMap: shinyTexture,
            
            //     envMap: envMap, // important -- especially for metals!
            //     envMapIntensity: envMapIntensity
            
             } );

            mesh = new THREE.Mesh(sphereGeometry, material1);
            mesh.castShadow = true;
            sphereGroup.add(mesh);
            const nubPosition = physics.sphere.radius - 2;
            for(let i = 0; i < 6; i++) {
                const nubGeometry = new THREE.SphereGeometry(physics.sphere.radius * .2, physics.sphere.sides, physics.sphere.sides);
                const nubMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' });
                const nub = new THREE.Mesh(nubGeometry, nubMaterial);
                sphereGroup.add(nub);
                if (i === 0) {
                    nub.position.x = nubPosition;
                } else if(i === 1) {
                    nub.position.x = nubPosition * -1;
                } else if(i === 2) {
                    nub.position.y = nubPosition;
                } else if(i === 3) {
                    nub.position.y = nubPosition * -1;
                } else if(i === 4) {
                    nub.position.z = nubPosition;
                } else if(i === 5) {
                    nub.position.z = nubPosition * -1;
                }

            }

            sphereGroup.position.set(physics.sphere.x, physics.sphere.y, physics.sphere.z);
            game.views[viewKey].sphere3Instance = sphereGroup;
            game.views[viewKey].view.scene.add(sphereGroup);
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


        function addSphereGoalsToView(viewKey) {
            game.physics.goals.spheres.forEach(
                (goal) => {
                    const sphereGeometry = new THREE.SphereGeometry(goal.radius * 1, goal.sides, goal.sides);
                    const sphereMaterial = new THREE.MeshBasicMaterial({ color: goal.color });
                    const loader = new THREE.TextureLoader();
                    const roughTexture = loader.load('scratch.jpg');
                    const shinyTexture = loader.load('turtle-shell.png');
                    
                    const material1 = new THREE.MeshStandardMaterial( {
                         color: 0xffffff,
                    
                         roughness: .01,
                         metalness: 1,
                    
                         roughnessMap: shinyTexture,
                         metalnessMap: shinyTexture,                    
                    } );
                    const mesh = new THREE.Mesh(sphereGeometry, material1);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;

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
                        game.views[position].sphere3Instance.rotation.x += game.physics.sphere.cannonInstance.angularVelocity.x/10; 
                        game.views[position].sphere3Instance.rotation.y += game.physics.sphere.cannonInstance.angularVelocity.y/10; 
                        game.views[position].sphere3Instance.rotation.z += game.physics.sphere.cannonInstance.angularVelocity.z/10; 
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
                    renderer.shadowMap.enabled = true;
                    const camera = game.views[position].view.camera;
                    if (position == 'main') {
                        camera.position.set(eyeX, eyeY, eyeZ + 200);
                    } else if (position == 'front') {
                        camera.position.set(thirdX, thirdY, thirdZ);
                    } else if (position == 'left') {
                        camera.position.set(thirdX + 400, thirdY, thirdZ);
                    }

                    const scene = game.views[position].view.scene;
                    const metaData = game.views[position].meta;
                    renderer.setSize(el.width, el.height);
                    camera.up.set(0, 0, 1);

                    const sphere = game.physics.sphere.cannonInstance;

                    if (game.views[position].player) {
                        //console.log(position);

                        let lookAtZ = 1000;
                        let lookAtX = 1000;
                        let lookAtY = 1000;

                        if (sphere.position) {
                            camera.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
                            lookAtX = (thirdX- eyeX) * -1000;
                            lookAtY = (thirdY- eyeY) * -1000;
                            lookAtZ = sphere.position.z;
                            if (lookAtX === 0 && lookAtY === 0) {
                                lookAtZ = 1000;
                            }
                        }

                        camera.lookAt(new THREE.Vector3(lookAtX, lookAtY, lookAtZ));
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

            const bottom = game.physics.platform[game.physics.platform.length - 1];
            //console.log('bottom platform',bottom.position.z);

            let totalThreeElements = 0;
            let hiddenCount = 0;
            let platformCount = game.physics.platform.length;

            game.physics.platform.forEach(
                (platform, i) => {

                    if (!platform.de) {

                        platform.three.forEach(
                            (three) => {
                                totalThreeElements++;
                                if (game.gameDirection === 'down' && platform.position.z > (game.physics.sphere.cannonInstance.position.z + 30)) {
                                    three.mesh.visible = false;
                                    hiddenCount++;
                                } else {
                                    three.mesh.visible = true;
                                }
                            }
                        );

                        if (hiddenCount >= (game.physics.platform.length - 4)) {
                            game.gameDirection = 'up';
                            platform.three.forEach(
                                (three) => {
                                    totalThreeElements++;
                                    if (platform.position.z > (game.physics.sphere.cannonInstance.position.z + 30)) {
                                        three.mesh.visible = true;
                                    }
                                }
                            );
                        }

                    }
                }
            );
        }
        //checkPlatforms();
        //setInterval(checkPlatforms, 500);
    }

    function controlsSetup() {
        function init() {
            game.controls.reset = () => {
                game = JSON.parse(initStateString);
                viewSetup();
                physicsSetup();
            }
            game.controls.setPosition = (pos) => {
                const offset = .0;
                let rotate = false;

                const sphere = game.physics.sphere.cannonInstance;
                if (pos === "f") rotate = true;
                if (pos) {


                    if (rotate) {
                        const speedFactor = .1;
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

                    if (pos.includes('s')) {
                        game.physics.sphere.cannonInstance.velocity.z = 300;
                        // console.log('Apply Force ', game.physics.sphere);
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
        goalDirection: 'down',
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
            lift: {},
            gravity: { x: 0, y: 0, z: -100 },
            barriers: [],
            sphere: {
                material: new CANNON.Material('material'),
                mass: 500,
                radius: 20,
                sides: 32,
                x: 0,
                y: 0,
                z: 2500,
                color: 0x00FFFF,
                cannonInstance: {},
                eyeball: {
                    radius: 5,
                    sides: 32,
                    color: 0x0000FF,
                    xOffset: 0,
                    yOffset: 0,
                    zOffset: 30
                },
                thirdPerson: {
                    xOffset: 0,
                    yOffset: 0,
                    zOffset: 15
                }
            },
            platform: [],
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
    const platformCount = 10;
    for (let i = 0; i < platformCount; i++) {
        let color = 16777215/ (i * platformCount + 1);
        if (i === (platformCount - 1)) {
            color = 255;
        } else {
            // color = 8740418;
        }

        let value2d = simplex.noise2D(0, i / 10);
        let val = value2d * 100;
        const x = i * 400 * -1;
        const y = i * val;
        const z = i * 250 * -1;
        const platform = {
            dimensions: { width: 150, height: 150, depth: 15 },
            position: { x, y, z },
            color: color,
            three: []
        };

        const sphere1 = {
            radius: 25,
            color: 0xFFFF00,
            x: x,
            y: y + 100,
            z: z + 50,
            mass: 10,
            sides: 32,
            threeMesh: [],
            cannonInstance: {}
        };

        const sphere2 = {
            radius: 25,
            color: 0xFFFF00,
            x: x,
            y: y - 100,
            z: z + 50,
            mass: 1000,
            sides: 32,
            threeMesh: [],
            cannonInstance: {}
        };

        const sphere3 = {
            radius: 25,
            color: 0xFFFF00,
            x: x + 100,
            y: y,
            z: z + 50,
            mass: 1000,
            sides: 32,
            threeMesh: [],
            cannonInstance: {}
        };

        const sphere4 = {
            radius: 25,
            color: 0xFFFF00,
            x: x - 100,
            y: y,
            z: z + 50,
            mass: 1000,
            sides: 32,
            threeMesh: [],
            cannonInstance: {}
        };

        game.physics.platform.push(platform);
        game.physics.goals.spheres.push(sphere1);
        game.physics.goals.spheres.push(sphere2);
        game.physics.goals.spheres.push(sphere3);
        game.physics.goals.spheres.push(sphere4);
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

