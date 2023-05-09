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

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
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

function updateCubeOrientation() {
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

    if (Math.abs(alpha * deltaTime) > 0.1) cube.rotation.x += alpha * deltaTime;
    if (Math.abs(beta * deltaTime) > 0.1) cube.rotation.y += beta * deltaTime;
    if (Math.abs(gamma * deltaTime) > 0.1) cube.rotation.z += gamma * deltaTime;
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

      updateCubeOrientation();
      // updateCubeOrientation();
      animate();
    });
}, 100);


