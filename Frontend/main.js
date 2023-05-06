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
const rotationQuaternion = new THREE.Quaternion();
function animate(x, y, z, w) {
  // requestAnimationFrame(animate);
  rotationQuaternion.set(x, y, z, w);
  cube.quaternion.copy(rotationQuaternion);

  // cube.translateZ = x;
  // cube.rotation.y += 0.001;
  // cube.rotation.z += 0.001;
  renderer.render(scene, camera);
}

setInterval(() => {
  fetch("http://localhost:8000/")
    .then((data) => {
      return data.json();
    })
    .then((axis) => {
      console.log(axis);
      animate(axis.x, axis.y, axis.z, axis.w);
    });
}, 10);
