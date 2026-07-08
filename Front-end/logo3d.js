// Initialize Three.js scene for 3D logo
(function() {
    const container = document.getElementById('logo-container');
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
        50,
        200 / 200,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    renderer.setSize(200, 200);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x22d3ee, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);
    
    // Load 3D model
    const loader = new THREE.GLTFLoader();
    let model;
    
    loader.load(
        'https://res.cloudinary.com/drqqqhudz/image/upload/v1783427413/logo-optimized_evx5on.glb',
        function(gltf) {
            model = gltf.scene;
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDim;
            model.scale.multiplyScalar(scale);
            
            model.position.x = -center.x * scale;
            model.position.y = -center.y * scale;
            model.position.z = -center.z * scale;
            
            scene.add(model);
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.error('Error loading 3D model:', error);
        }
    );
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (model) {
            model.rotation.y += 0.01;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = 200 / 200;
        camera.updateProjectionMatrix();
        renderer.setSize(200, 200);
    });
})();
