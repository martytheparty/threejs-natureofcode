( () => {
    const platformDescription = {
        width: 150,
        height: 150,
        depth: 15,
        x: 0,
        y: 0,
        x: 0
    };
    const sphereDescription = {
        radius: 10,
        sides: 32,
        x: -60, 
        y: 0, 
        z: 15
    };

    const view = {
        createMainView: (mesh, sphereMesh) => {
            let mainElement = document.getElementById('main');
            let threeObject = {
                element: mainElement,
                scene: new THREE.Scene(),
                camera: new THREE.PerspectiveCamera(75, mainElement.width / mainElement.height, 0.1, 1000),
                renderer: new THREE.WebGLRenderer({ antialias: true, canvas: mainElement })
            }
            threeObject.camera.position.set(0, 0, 150);
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
            threeObject.camera.position.x = 125;
            threeObject.camera.position.y = 0;
            threeObject.camera.position.z = 80;
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
            threeObject.camera.position.y = -125;
            threeObject.camera.position.z = 80;
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
        }
    }

    function createRenderingLayer(hasSphere) {
        const floor = new ThreeDObject();
        const geometry = new THREE.BoxGeometry(platformDescription.width, platformDescription.height, platformDescription.depth);
        const material = new THREE.MeshBasicMaterial({ color: 0xC19A6B });
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const meshDescription = { geometry, material, x: 0, y: 0, z: 0 };
        sphereGeometry = new THREE.SphereGeometry(sphereDescription.radius, sphereDescription.sides, sphereDescription.sides);
        const sphereMeshDescription = { geometry: sphereGeometry, material: sphereMaterial, x: sphereDescription.x, y: sphereDescription.y, z: sphereDescription.z };    

        floor.threeObjects.push(view.createMainView(view.getRenderingMesh(meshDescription), view.getRenderingMesh(sphereMeshDescription)));
        floor.threeObjects.push(view.createFrontView(view.getRenderingMesh(meshDescription), view.getRenderingMesh(sphereMeshDescription)));
        floor.threeObjects.push(view.createLeftView(view.getRenderingMesh(meshDescription), view.getRenderingMesh(sphereMeshDescription)));
        floor.threeObjects.push(view.createBallView(view.getRenderingMesh(meshDescription), view.getRenderingMesh(sphereMeshDescription)));

        return floor;
    }

    function createFloor(hasSphere) {
        let floor = createRenderingLayer(hasSphere);
        return floor;
    }

    function animate() {
        requestAnimationFrame(animate);
        layers.forEach(
            (layer, index) => {
                layer.threeObjects.forEach(
                    (threeObject) => {
                        threeObject.renderer.render(threeObject.scene, threeObject.camera);
                    }
                );
            }
        );

    }

    let layers = [];
    layers.push(createFloor(true));
    animate();
 }
)()