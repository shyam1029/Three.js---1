// 
// IMPORTS 
// 
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';


// 
// UTILS 
// 
let sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}
let aspectRatio = sizes.width / sizes.height;
const canvas = document.querySelector('canvas.webgl');


// 
// SCENE 
// 
const scene = new THREE.Scene();

// scene.add(new THREE.AxesHelper(10));

// 
// OBJECTS 
// 
let material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let cubeMaterial = material;
let cubeMesh1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
let cubeMesh2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh2.position.x = 1.5;
let cubeMesh3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh3.position.x = 3;
let cubeMesh4 = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh4.position.x = -1.5;
let cubeMesh5 = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh5.position.x = -3;




let shapesGroup = new THREE.Group();
shapesGroup.add(cubeMesh1, cubeMesh2, cubeMesh3, cubeMesh4, cubeMesh5);
shapesGroup.position.y = 0.5;

shapesGroup.children.forEach((obj) => {
    obj.castShadow = true;
})

let objArr = [];
objArr.push(cubeMesh1, cubeMesh2, cubeMesh3, cubeMesh4, cubeMesh5);

scene.add(shapesGroup);

let planeGeometry = new THREE.PlaneGeometry(20, 20);
let planeMaterial = material;
let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.position.y = -3.;
planeMesh.rotation.x = -Math.PI / 2;

planeMesh.receiveShadow = true;
scene.add(planeMesh);

// 
// LIGHTS 
// 
let ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight('#ffffff', 2);
directionalLight.position.set(0, 5, 7);
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

scene.add(directionalLight);

let hemisphereLight = new THREE.HemisphereLight('red', 'white', 2);
scene.add(hemisphereLight);

let pointLight = new THREE.PointLight('white', 3);
pointLight.position.y = 1;
pointLight.castShadow = true;
scene.add(pointLight);

// let rectAreaLight = new THREE.RectAreaLight('red', 5, 2, 5)
// rectAreaLight.position.z = 2;
// rectAreaLight.position.x = -2;
// rectAreaLight.lookAt(shapesGroup.position);
// scene.add(rectAreaLight);

// let spotLight = new THREE.SpotLight('purple', 10);
// spotLight.position.y = 2;

// spotLight.castShadow = true;

// scene.add(spotLight)

//
// LIGHT HELPERS
//
// let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(directionalLightHelper);

// let pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

// let spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

// let rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// scene.add(rectAreaLightHelper);


// 
// CAMERA 
// 
let camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);
camera.position.z = 15;
camera.position.y = 0;
camera.position.x = 0;
camera.lookAt(shapesGroup.position);
scene.add(camera);

// 
// RENDERER 
// 
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

// 
// CONTROLS 
// 
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.01;

// 
// RESIZE HANDLE 
// 
window.addEventListener('resize', () => {
    sizes.height = window.innerHeight;
    sizes.width = window.innerWidth;

    renderer.setSize(sizes.width, sizes.height);
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
})


//
// RAYCASTING
//
const raycaster = new THREE.Raycaster();

// 
// Mouse handler
// 
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;
})

window.addEventListener('click', () => {
    if (currentIntersectFlag) {
        const mesh = currentIntersectFlag.object;
        if (!mesh.originalPosition) {
            mesh.originalPosition = mesh.position.y;
        }
        
        if (mesh.position.y > -3) {
            const interval = setInterval(() => {
                if (mesh.position.y > -3) {
                    mesh.position.y -= 0.1;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        const resetInterval = setInterval(() => {
                            if (mesh.position.y < mesh.originalPosition) {
                                mesh.position.y += 0.1;
                            } else {
                                clearInterval(resetInterval);
                            }
                        }, 50);
                    }, 3000);
                }
            }, 50);
        }
    } else {
        console.log("Didn't click on a mesh");
    }
});


//
// DEBUG UI
//
const gui = new GUI();

document.body.appendChild(gui.domElement);
console.log(gui);


gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);

let lightsFolder = gui.addFolder('Lights');

lightsFolder
    .add(ambientLight, 'intensity')
    .min(0)
    .max(6)
    .step(0.001)
    .name('Ambient Intensity');


lightsFolder
    .add(directionalLight, 'intensity')
    .min(0)
    .max(6)
    .step(0.001)
    .name('Directional Intensity');



let objDebug = {};
objDebug.color = '#17dae8';

lightsFolder
    .addColor(objDebug, 'color')
    .onChange(() => {
        directionalLight.color.set(objDebug.color);
    })
    .name('Directional Color');



// 
// ANIMATION LOOP 
// 
let clock = new THREE.Clock();

let currentIntersectFlag;

let animation = () => {
    let deltaTimeSinceBeginning = clock.getElapsedTime();

    pointLight.position.x = Math.sin(deltaTimeSinceBeginning) * 2;
    pointLight.position.z = Math.cos(deltaTimeSinceBeginning) * 2;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objArr);

    if (intersects.length) {
        if (!currentIntersectFlag) {
            // console.log('entered a mesh');
        }
        currentIntersectFlag = intersects[0];
    }
    else {
        if (currentIntersectFlag) {
            // console.log('exited a mesh');
        }
        currentIntersectFlag = false;
    }


    // camera.lookAt(shapesGroup.position);
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
}

animation()