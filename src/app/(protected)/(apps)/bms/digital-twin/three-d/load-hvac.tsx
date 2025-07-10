import type React from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeTest: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.zoomSpeed = 1.2;

    // Helpers (Optional)
   // const axesHelper = new THREE.AxesHelper(2);
   // scene.add(axesHelper);

    let model: THREE.Object3D;

    // Load .OBJ model
    const loader = new OBJLoader();
    loader.load(
      `${process.env.NEXT_BASE_PATH_URL}/models/base.obj`,
      (object) => {
        // Create a wrapper group to reposition object
        const wrapper = new THREE.Group();
        wrapper.add(object);
    
        // Auto center the model by computing its bounding box
        const box = new THREE.Box3().setFromObject(object);
        const center = new THREE.Vector3();
        box.getCenter(center);
        object.position.sub(center); // center the model
    
        // Optional: fix tilt if it's rotated weird
        object.rotation.x = 0;
        object.rotation.y = 0;
        object.rotation.z = 0;
    
        // Adjust scale if needed
        object.scale.set(1, 1, 1);
    
        scene.add(wrapper);
        model = wrapper;
    
        animate();
      },
      undefined,
      (err) => {
        console.error('Error loading OBJ model:', err);
      }
    );

    // Animation loop
    let animationId: number;
    const animate = () => {
      controls.update(); // required for damping
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.remove();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '400px', background: 'black' }}
    />
  );
};

export default ThreeTest;
