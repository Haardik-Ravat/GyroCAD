const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
const dotSize = 0.2; // Size of the dot
const dotGeometry = new THREE.BoxGeometry(dotSize, dotSize, 0);
const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(dotGeometry, dotMaterial);
scene.add(cube);

camera.position.z = 5;
let gyroData;
let accelData;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

let prevTime = performance.now();
let cubeVelocity = new THREE.Vector3();
let cubeRotation = new THREE.Vector3();



function updateCubeMotion() {
  if (gyroData && accelData) {
    const alpha = gyroData[0];
    const beta = gyroData[1];
    const gamma = gyroData[2];

    const x = accelData[0];
    const y = accelData[1];
    const z = accelData[2];

    const time = performance.now();
    const deltaTime = (time - prevTime) / 1000;
    prevTime = time;

    if (Math.abs(x) > 1) {
      cube.position.x += -x * deltaTime;
      let t = cube.position.x - x * deltaTime;
      if (t >= 6.23) cube.position.x = 6.23;
      else if (t <= -6.31) cube.position.x = -6.31;
      else cube.position.x = t;
    }
    if (Math.abs(y) > 1) {
      let t = cube.position.y + y * deltaTime;
      if (t >= 3) cube.position.y = 3;
      else if (t <= -2.83) cube.position.y = -2.83;
      else cube.position.y = t;
    }

    console.log(cube.position.x, cube.position.y);
  }
}

setInterval(() => {
  fetch("http://localhost:8000/")
    .then((data) => {
      return data.json();
    })
    .then((axis) => {
      accelData = [axis["accx"], axis["accy"], axis["accz"]];
      gyroData = [axis["gyrx"], axis["gyry"], axis["gyrz"]];

      //updateCubeOrientation();
       updateCubeMotion();
      animate();
    });
}, 100);
