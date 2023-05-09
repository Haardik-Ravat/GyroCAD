const scene = new THREE.Scene();
		
		// Create a camera
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(0, 0, 10);
		
		// Create a renderer
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		
		// Create a table top geometry
		const tableTopGeometry = new THREE.BoxGeometry(10, 0.5, 5);
		
		// Create a table top material
		const tableTopMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
		
		// Create a table top mesh from the geometry and material
		const tableTopMesh = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
		tableTopMesh.position.set(0, 0, 0);
		
		
		// Create four table legs
		const tableLegGeometry = new THREE.BoxGeometry(0.5, 4, 0.5);
		
		// Create a table leg material
		const tableLegMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
		
		// Create four table leg meshes from the geometry and material
		const tableLegMesh1 = new THREE.Mesh(tableLegGeometry, tableLegMaterial);
		tableLegMesh1.position.set(-4.25, -2, -2.25);
		scene.add(tableLegMesh1);
		
		const tableLegMesh2 = new THREE.Mesh(tableLegGeometry, tableLegMaterial);
		tableLegMesh2.position.set(-4.25, -2, 2.25);
		scene.add(tableLegMesh2);
		
		const tableLegMesh3 = new THREE.Mesh(tableLegGeometry, tableLegMaterial);
		tableLegMesh3.position.set(4.25, -2, -2.25);
		scene.add(tableLegMesh3);
		
		const tableLegMesh4 = new THREE.Mesh(tableLegGeometry, tableLegMaterial);
		tableLegMesh4.position.set(4.25, -2, 2.25);
		scene.add(tableLegMesh4);
		
		// Create an ambient light
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);
		
		// Create a point light


        const table = new THREE.Group();
        table.add(tableTopMesh);
        table.add(tableLegMesh1);
        table.add(tableLegMesh2);
        table.add(tableLegMesh3);
        table.add(tableLegMesh4);
        table.add(ambientLight);


		scene.add(table);


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
        
            if (Math.abs(alpha * deltaTime) > 0.1) table.rotation.x += alpha * deltaTime;
            if (Math.abs(beta * deltaTime) > 0.1) table.rotation.y += beta * deltaTime;
            if (Math.abs(gamma * deltaTime) > 0.1) table.rotation.z += gamma * deltaTime;
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
        