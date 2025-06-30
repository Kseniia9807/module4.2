import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const modelPaths = [
  '3Dmodels/instrumentrender6.glb',
  '3Dmodels/audio2.glb',
  '3Dmodels/instrument6.3.glb',
  //'3Dmodels/ismetricrenderplatic4.glb',//
];

//const numModels = modelPaths.length;
const numModels = modelPaths.filter(Boolean).length;

let currentModelIndex = 0;


const modelContainers = Array.from(document.querySelectorAll('.model-container'));

if (modelContainers.length !== numModels) {
    console.error("Mismatch between number of model containers in HTML and numModels.");
}

const scenes = [];
const renderers = [];
const cameras = [];
const controls = [];
const modelMeshes = [];

 const modelParams = [
  {
    cameraPos: new THREE.Vector3(4, 5, 11),
    lightPos: new THREE.Vector3(0, 25, 0),
    modelPos: new THREE.Vector3(-0.5, 1.05, 0), 
    modelRotation: new THREE.Euler(-0.3, 0.3, 0.1),
    lightIntensity: 600,
  },
  {
    cameraPos: new THREE.Vector3(7, 2, 15),
    lightPos: new THREE.Vector3(10, 25, 10),
    modelPos: new THREE.Vector3(0, 0.9, 0), 
    modelRotation: new THREE.Euler( 0, -1.1, 0.1),
  },
  {
    cameraPos: new THREE.Vector3(0, 5, 10),
    lightPos: new THREE.Vector3(0, 120, 30),
    modelPos: new THREE.Vector3(0, -0.5, -1),
    modelRotation: new THREE.Euler(-0.3, 0, 0),
    lightIntensity: 140,
     
  },
    {
    cameraPos: new THREE.Vector3(2, 10, 20),
    lightPos: new THREE.Vector3(-3, 20, 2),
    modelPos: new THREE.Vector3(-1, 1, 0), 
    modelRotation: new THREE.Euler(-0.5, -0.2, 0),
  },
  
];
const modelLinks = [
  '#',
  'inforift.html',
  '#',
  '#'
];


function initThreeScene(container, index) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xF5F5F5);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000);

    let controlObject;

    if (index >= 0 && index < modelParams.length) {
        camera.position.copy(modelParams[index].cameraPos);
        const intensity = modelParams[index].lightIntensity || 600;

       
        if (index === 2) {
            const spotLight = new THREE.SpotLight(0xffffff, intensity, 100, Math.PI / 6, 0.3);
            spotLight.position.set(0, 5, 5);
            spotLight.target.position.set(0, 0, 0);
            spotLight.castShadow = true;
            spotLight.shadow.bias = -0.001;
            spotLight.shadow.mapSize.set(2048, 2048);
            scene.add(spotLight);
            scene.add(spotLight.target);
            scene.add(new THREE.AmbientLight(0x111111));
        } else {
            const spotLight = new THREE.SpotLight(0xffffff, intensity, 100, 0.22, 1);
            spotLight.position.copy(modelParams[index].lightPos);
            spotLight.castShadow = true;
            spotLight.shadow.bias = -0.0001;
            scene.add(spotLight);
            scene.add(new THREE.AmbientLight(0x404040, 50));
        }

 
        controlObject = new OrbitControls(camera, renderer.domElement);
        controlObject.enableDamping = true;
        controlObject.enablePan = false;
        controlObject.minDistance = 5;
        controlObject.maxDistance = 20;
        controlObject.minPolarAngle = 0.5;
        controlObject.autoRotate = false;
        controlObject.target = new THREE.Vector3(0, 1, 0);
        controlObject.update();
    } else {
        console.error(`Invalid model index: ${index}`);
    }

    return { renderer, scene, camera, controls: controlObject };
}





function loadModel(index, scene) {
  const loader = new GLTFLoader();
  loader.load(modelPaths[index], (gltf) => {
    const mesh = gltf.scene;
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

   
    if (index < modelParams.length) {
      mesh.position.copy(modelParams[index].modelPos);
      mesh.rotation.copy(modelParams[index].modelRotation);
    }

    scene.add(mesh);
    modelMeshes[index] = mesh;
    renderers[index].render(scene, cameras[index]);
  }, undefined, (error) => {
      console.error("Error loading model:", error);
  });
}



modelContainers.forEach((container, index) => {
  const { renderer, scene, camera, controls: controlObject } = initThreeScene(container, index); // Pass the index
  renderers.push(renderer);
  scenes.push(scene);
  cameras.push(camera);
  controls.push(controlObject);
  loadModel(index, scene);
});

const modelTexts = [
  {
    name: "Glacier",
    caption: "A portable, polyphonic synthesizer designed for ambient textures and soundscapes. Features include a responsive  keyboard, a collection of evolving pads, shimmering ambient textures, and granular synthesis capabilities.",
      style: {
      marginLeft: "43vw",
     
    }
  },
 {
    name: "Rift",
    caption: " A versatile USB-C audio interface designed for portability and high-fidelity recording. Offers multiple inputs and outputs for microphones, instruments, and line-level sources, plus high-quality preamps and converters.",
    style: {
      marginLeft: "54vw",
     
    }
  },
  
  {
    name: "Cascade",
    caption: "A rugged, high-quality field recorder built for capturing natural sounds in diverse environments. Includes multiple inputs for microphones and line-level sources, high-resolution audio recording, and a long battery life.",
     style: {
      marginLeft: "30vw",
     
    }
  },
  {
    //name: "Modules",
    //caption: "Potok recording studio is a mobile modular-based structure, which allows artists to record sounds of nature and integrate them in music while being on the move.",
    //     style: {
     // marginLeft: "40vw",
     
    }
  //}
];



function updateText(index) {
  const nameElement = document.querySelector('.name');
  const captionElement = document.querySelector('.caption');

  const { name, caption, style } = modelTexts[index];

  nameElement.textContent = name;
  captionElement.textContent = caption;

  // Apply dynamic margin-left
  if (style && style.marginLeft) {
    captionElement.style.marginLeft = style.marginLeft;
  } else {
    // Reset in case the next model doesn't have marginLeft
    captionElement.style.marginLeft = '';
  }
}



function showModel(index) {
  modelContainers.forEach((container, i) => {
    container.style.display = i === index ? 'block' : 'none';
  });
  updateText(index);
}


document.getElementById('nextButton').addEventListener('click', () => {
  currentModelIndex = (currentModelIndex + 1) % numModels;
  showModel(currentModelIndex);
});

document.getElementById('prevButton').addEventListener('click', () => {
  currentModelIndex = (currentModelIndex - 1 + numModels) % numModels;
  showModel(currentModelIndex);
});

showModel(0);



function animate() {
  requestAnimationFrame(animate);
  const visibleIndex = modelContainers.findIndex(c => c.style.display !== 'none');
    if (visibleIndex !== -1) {
        controls[visibleIndex].update();
        renderers[visibleIndex].render(scenes[visibleIndex], cameras[visibleIndex]);
    }
}

animate();

window.addEventListener('click', onModelClick, false);

function onModelClick(event) {
  // Get current visible index
  const visibleIndex = modelContainers.findIndex(c => c.style.display !== 'none');
  if (visibleIndex === -1) return;

  // Adjust mouse coordinates to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, cameras[visibleIndex]);

  const intersects = raycaster.intersectObjects(scenes[visibleIndex].children, true);

  if (intersects.length > 0) {
    // You can refine this condition to check if the clicked object is the actual model
    window.location.href = modelLinks[visibleIndex];
  }
}




