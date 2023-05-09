const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    const phone = new THREE.Group();
    const bodyGeometry = new THREE.BoxGeometry(4, 8, 0.5);
    const bodyMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa});
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    phone.add(body);
    const screenGeometry = new THREE.BoxGeometry(3.5, 7.5, 0.2);
    const screenMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.15;
    phone.add(screen);
    const buttonGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.2);
    const buttonMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    const button1 = new THREE.Mesh(buttonGeometry, buttonMaterial);

    button1.position.set(0, -3.5, 0.25);
  
    phone.add(button1);

    scene.add(phone);

   
    camera.position.z = 10;

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
    
        if (Math.abs(alpha * deltaTime) > 0.1) phone.rotation.x += alpha * deltaTime;
        if (Math.abs(beta * deltaTime) > 0.1) phone.rotation.y += beta * deltaTime;
        if (Math.abs(gamma * deltaTime) > 0.1) phone.rotation.z += gamma * deltaTime;
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
    