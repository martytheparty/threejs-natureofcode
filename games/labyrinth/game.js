function setupMainView(geometry, material, mesh, sphereMesh) {
    let mainElement = document.getElementById('main');
    let threeObject = {
        element: mainElement,
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(75, mainElement.width / mainElement.height, 0.1, 1000),
        renderer: new THREE.WebGLRenderer({ antialias: true, canvas: mainElement })
    }
    threeObject.camera.position.set(0, 0, 200);
    threeObject.camera.up.set(0, 0, 1);
    threeObject.camera.lookAt(new THREE.Vector3(0, 0, 0));
    threeObject.scene.add(mesh);
    if (sphereMesh) {
        threeObject.scene.add(sphereMesh);
    }
    threeObject.renderer.setSize(mainElement.width, mainElement.height);
    return threeObject;
}

function setupFrontView(geometry, material, mesh, sphereMesh) {
    let frontElement = document.getElementById('front');
    let threeObject = {
        element: frontElement,
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(75, frontElement.width / frontElement.height, 0.1, 1000),
        renderer: new THREE.WebGLRenderer({ antialias: true, canvas: frontElement })
    }
    threeObject.camera.up.set(0, 0, 1);
    threeObject.camera.position.x = 200;
    threeObject.camera.position.y = 0;
    threeObject.camera.position.z = 80;
    threeObject.camera.lookAt(new THREE.Vector3(0, 0, 0));
    threeObject.scene.add(mesh);
    if (sphereMesh) {
        threeObject.scene.add(sphereMesh);
    }

    threeObject.renderer.setSize(frontElement.width, frontElement.height);
    return threeObject;
}

function setupLeftView(geometry, material, mesh, sphereMesh) {
    let leftElement = document.getElementById('left');
    let threeObject = {
        element: leftElement,
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(75, leftElement.width / leftElement.height, 0.1, 1000),
        renderer: new THREE.WebGLRenderer({ antialias: true, canvas: leftElement })
    }
    threeObject.camera.up.set(0, 0, 1);
    threeObject.camera.position.x = 0;
    threeObject.camera.position.y = -200;
    threeObject.camera.position.z = 80;
    threeObject.camera.lookAt(new THREE.Vector3(0, 0, 0));
    threeObject.scene.add(mesh);
    if (sphereMesh) {
        threeObject.scene.add(sphereMesh);
    }
    threeObject.renderer.setSize(leftElement.width, leftElement.height);
    return threeObject;
}


function setupBallView(geometry, material, mesh, sphereMesh) {
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
}




function setupLayer(hasSphere) {
    let floor = new ThreeDObject();
    let geometry = new THREE.BoxGeometry(150, 150, 10);
    let sphereMesh1 = false;
    let sphereMesh2 = false;
    let sphereMesh3 = false;
    let sphereMesh4 = false;
    let material = new THREE.MeshBasicMaterial({ color: 0xC19A6B });
    let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    if (hasSphere) {
        sphereGeometry = new THREE.SphereGeometry(10, 32, 32);
        sphereMesh1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh1.position.set(-60, 0, 15);
        sphereMesh2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh2.position.set(-60, 0, 15);
        sphereMesh3 = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh3.position.set(-60, 0, 15);
        sphereMesh4 = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh4.position.set(-60, 0, 15);
    }


    let mesh = new THREE.Mesh(geometry, material);
    let mesh2 = new THREE.Mesh(geometry, material);
    let mesh3 = new THREE.Mesh(geometry, material);
    let mesh4 = new THREE.Mesh(geometry, material);


    let threeObject1 = setupMainView(geometry, material, mesh, sphereMesh1);
    let threeObject2 = setupFrontView(geometry, material, mesh2, sphereMesh2);
    let threeObject3 = setupLeftView(geometry, material, mesh3, sphereMesh3);
    let threeObject4 = setupBallView(geometry, material, mesh4, sphereMesh4);

    mesh.position.set(0, 0, 0);
    floor.threeObjects.push(threeObject1);
    mesh2.position.set(0, 0, 0);
    floor.threeObjects.push(threeObject2);
    mesh3.position.set(0, 0, 0);
    floor.threeObjects.push(threeObject3);
    floor.threeObjects.push(threeObject4);

    return floor;
}

let layers = [];
layers.push(setupLayer(true));

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

animate();
