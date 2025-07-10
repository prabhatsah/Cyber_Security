"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SensorOverlay } from './sensor-overlay'
import LabelDialog from './label-dialog'


export function ThreeDViewer({ 
  incidents, 
  sensors, 
  selectedIncident, 
  onIncidentSelect,
  showLabels,
  focusMode,
  selectedFloor,
  selectedSystems,
  viewMode
}) {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const animationFrameRef = useRef<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredObject, setHoveredObject] = useState(null)
  const objectsRef = useRef({})
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())
  const [clickedLabel, setClickedLabel] = useState<{ message: string } | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    // === Setup ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;
  
    const camera = new THREE.PerspectiveCamera(
      80,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
  
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
  
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;
  
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;
  
    const mouse = new THREE.Vector2();
    mouseRef.current = mouse;
  
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(2048, 2048);
    scene.add(directionalLight);
  
    const gridHelper = new THREE.GridHelper(30, 30);
    scene.add(gridHelper);
  
    createBuildingModel(scene, objectsRef); // your custom model creator
  
    // === Animate ===
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  
    // === Resize ===
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
  
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);
  
    // === Mouse Move for Hover ===
    const handleMouseMove = (event: MouseEvent) => {
      if (!container) return;
  
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
  
      const intersectedObject = intersects.find(
        (i) =>
          i.object.userData &&
          (i.object.userData.type === "incident" || i.object.userData.type === "sensor")
      );
  
      if (intersectedObject) {
        setHoveredObject(intersectedObject.object.userData);
        container.style.cursor = "pointer";
      } else {
        setHoveredObject(null);
        container.style.cursor = "default";
      }
    };
    container.addEventListener("mousemove", handleMouseMove);
  
    // === Mouse Click ===
    const handleMouseClick = () => {
      if (!cameraRef.current || !raycasterRef.current) return;
  
      raycaster.setFromCamera(mouseRef.current, cameraRef.current);
  
      const labels = objectsRef.current.labels || [];
      const labelIntersects = raycaster.intersectObjects(labels, true);
  
      if (labelIntersects.length > 0) {
        const label = labelIntersects[0].object;
        if (label.userData?.isLabel && label.userData?.message) {
          setClickedLabel({ message: label.userData.message });
          return;
        }
      }
  
      if (hoveredObject?.type === "incident") {
        const incident = incidents.find((inc) => inc.id === hoveredObject.id);
        if (incident) onIncidentSelect(incident);
      }
    };
    container.addEventListener("click", handleMouseClick);
  
    setIsLoading(false);
  
    // === Cleanup ===
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleMouseClick);
  
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  
      if (controlsRef.current) controlsRef.current.dispose();
  
      if (rendererRef.current && container) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
  
      // Dispose all Three.js objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material?.dispose();
          }
        }
      });
  
      // Reset refs (optional, but helps with debugging/remounts)
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      raycasterRef.current = null;
    };
  }, []);
  

  // Update incidents and sensors
  useEffect(() => {
    if (!sceneRef.current) return

    // Remove existing incident and sensor markers
    const objectsToRemove = []
    sceneRef.current.traverse((object) => {
      if (object.userData && (object.userData.type === 'incident' || object.userData.type === 'sensor')) {
        objectsToRemove.push(object)
      }
    })
    // biome-ignore lint/complexity/noForEach: <explanation>
    objectsToRemove.forEach(object => sceneRef.current.remove(object))

    // Add incident markers
    // biome-ignore lint/complexity/noForEach: <explanation>
        incidents.forEach(incident => {
      if (incident.status === 'active' || selectedIncident?.id === incident.id) {
        addIncidentMarker(sceneRef.current, incident, selectedIncident?.id === incident.id)
      }
    })

    // Add sensor markers
    // biome-ignore lint/complexity/noForEach: <explanation>
        sensors.forEach(sensor => {
      // Check if the sensor's system type is enabled
      let systemEnabled = true
      if (sensor.type === 'temperature' || sensor.type === 'airflow') {
        systemEnabled = selectedSystems.hvac
      } else if (sensor.type === 'electrical') {
        systemEnabled = selectedSystems.electrical
      } else if (sensor.type === 'pressure' || sensor.type === 'humidity') {
        systemEnabled = selectedSystems.plumbing
      } else if (sensor.type === 'security') {
        systemEnabled = selectedSystems.security
      } else if (sensor.type === 'lighting') {
        systemEnabled = selectedSystems.lighting
      }

      if (systemEnabled) {
        addSensorMarker(sceneRef.current, sensor)
      }
    })

  }, [incidents, sensors, selectedIncident, selectedSystems])

  // Handle focus mode
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current || !selectedIncident) return

    if (focusMode && selectedIncident) {
      // Animate camera to focus on the selected incident
      const targetPosition = new THREE.Vector3(
        selectedIncident.coordinates.x,
        selectedIncident.coordinates.y,
        selectedIncident.coordinates.z
      )
      
      // Set a position slightly offset from the target
      const cameraTargetPosition = new THREE.Vector3(
        targetPosition.x + 5,
        targetPosition.y + 3,
        targetPosition.z + 5
      )
      
      // Animate camera position
      const startPosition = cameraRef.current.position.clone()
      const duration = 1000 // ms
      const startTime = Date.now()
      
      const animateCamera = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Ease function (ease-out cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        
        cameraRef.current.position.lerpVectors(startPosition, cameraTargetPosition, easeProgress)
        controlsRef.current.target.lerpVectors(
          new THREE.Vector3(0, 0, 0),
          targetPosition,
          easeProgress
        )
        
        if (progress < 1) {
          requestAnimationFrame(animateCamera)
        }
      }
      
      animateCamera()
    } else {
      // Reset camera position
      controlsRef.current.target.set(0, 0, 0)
    }
  }, [focusMode, selectedIncident])

  // Handle view mode change
  useEffect(() => {
    if (!cameraRef.current) return

    if (viewMode === '2d') {
      // Top-down view
      cameraRef.current.position.set(0, 30, 0)
     // cameraRef.current.lookAt(0, 0, 0)
      if (controlsRef.current) {
        controlsRef.current.maxPolarAngle = Math.PI / 4 // Limit rotation
      }
    } else {
      // Reset to 3D view
      if (controlsRef.current) {
        controlsRef.current.maxPolarAngle = Math.PI // Reset rotation limit
      }
      if (!focusMode) {
        cameraRef.current.position.set(15, 15, 15)
        cameraRef.current.lookAt(0, 0, 0)
      }
    }
  }, [viewMode])
  useEffect(() => {
    if (!objectsRef.current) return

    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(objectsRef.current).forEach(([key, obj]) => {
      if (key.startsWith("floor_")) {
        const floorIndex = key.split("_")[1]
        obj.visible = selectedFloor === "all" || selectedFloor === floorIndex
      }
    })
  }, [selectedFloor])

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-lg">Loading 3D environment...</p>
          </div>
        </div>
      )}
      
      {/* Hover tooltip */}
      {hoveredObject && showLabels && (
        <SensorOverlay 
          data={hoveredObject} 
          containerRef={containerRef}
          camera={cameraRef.current}
          renderer={rendererRef.current}
        />
      )}
      <LabelDialog
        open={!!clickedLabel}
        message={clickedLabel?.message || ''}
        onClose={() => setClickedLabel(null)}
      />
    </div>
  )
}

// Helper function to create a simplified building model
function createBuildingModel(scene, objectsRef) {
  const floors = [
    { y: 0, name: 'Ground Floor' },
    { y: 4, name: 'First Floor' },
    { y: 8, name: 'Second Floor' },
    { y: 12, name: 'Third Floor' },
    { y: 16, name: 'Fourth Floor' },
    { y: 18, name: 'Fifth Floor' }
  ];

  const floorGroups = {}; // For dropdown filtering

  function createLabel(text, position, onClickMessage) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;
  
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    sprite.scale.set(2.5, 1.25, 1);
    sprite.userData = {
      isLabel: true,
      message: onClickMessage || `You clicked on ${text}`
    };
    return sprite;
  }

  function createRoom(group, material, wallHeight, config) {
    const { width, depth, center, label } = config;
    const wallThickness = 0.1;
    const halfW = width / 2;
    const halfD = depth / 2;
    const wallY = center.y;

    // Front and back walls
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(width, wallHeight, wallThickness), material);
    frontWall.position.set(center.x, wallY, center.z + halfD);
    frontWall.castShadow = true;
    frontWall.receiveShadow = true;

    const backWall = frontWall.clone();
    backWall.position.set(center.x, wallY, center.z - halfD);

    // Left and right walls
    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, depth), material);
    sideWall.position.set(center.x - halfW, wallY, center.z);
    sideWall.castShadow = true;
    sideWall.receiveShadow = true;

    const sideWall2 = sideWall.clone();
    sideWall2.position.set(center.x + halfW, wallY, center.z);

    group.add(frontWall, backWall, sideWall, sideWall2);

    // Add label
    if (label) {
      const message = `This is the ${label}`;
      const labelSprite = createLabel(label, new THREE.Vector3(center.x, wallY + wallHeight / 2 + 0.5, center.z), message);
      group.add(labelSprite);
      objectsRef.current.labels = objectsRef.current.labels || [];
      objectsRef.current.labels.push(labelSprite);
    }
    
  }

  floors.forEach((floor, index) => {
    const floorGroup = new THREE.Group();
    floorGroup.name = floor.name;
    scene.add(floorGroup);
    floorGroups[`floor_${index}`] = floorGroup;
    objectsRef.current[`floor_${index}`] = floorGroup;

    const floorGeometry = new THREE.BoxGeometry(20, 0.2, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.9
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.position.set(0, floor.y, 0);
    floorMesh.receiveShadow = true;
    floorGroup.add(floorMesh);

    if (index < floors.length - 1) {
      const wallHeight = 3.8;
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        transparent: true,
        opacity: 0.8
      });

      const wallY = floor.y + wallHeight / 2 + 0.1;

      // Add rooms per floor
      const roomsByFloor = {
        0: [ // Ground Floor
          { width: 6, depth: 4, center: { x: -6, y: wallY, z: 5 }, label: "Reception" },
          { width: 5, depth: 5, center: { x: 6, y: wallY, z: -4 }, label: "Technical Room" },
          { width: 4, depth: 4, center: { x: -6, y: wallY, z: -4 }, label: "Washroom" },
          
        ],
        1: [ // First Floor
          { width: 10, depth: 5, center: { x: -5, y: wallY, z: 4 }, label: "Conference Room" },
          { width: 8, depth: 5, center: { x: 6, y: wallY, z: -4 }, label: "Office Space" }
        ],
        2: [ // Second Floor
          { width: 7, depth: 4, center: { x: -5, y: wallY, z: 4 }, label: "Break Room" },
          { width: 6, depth: 5, center: { x: 5, y: wallY, z: -3 }, label: "Meeting Room" }
        ],
        3: [ // Third Floor
          { width: 9, depth: 5, center: { x: 0, y: wallY, z: 4 }, label: "Work Area" },
          { width: 6, depth: 4, center: { x: 6, y: wallY, z: -4 }, label: "Storage" }
        ],
        4: [ // Fourth Floor
          { width: 8, depth: 5, center: { x: -5, y: wallY, z: 4 }, label: "Training Room" },
          { width: 8, depth: 5, center: { x: 5, y: wallY, z: -4 }, label: "Open Workspace" }
        ]
      };

      // biome-ignore lint/complexity/noForEach: <explanation>
      roomsByFloor[index]?.forEach(room =>
        createRoom(floorGroup, wallMaterial, wallHeight, room)
      );
    }
  });

  // Roof
  const roofGeometry = new THREE.BoxGeometry(22, 0.3, 17);
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, floors[floors.length - 1].y + 4, 0);
  roof.castShadow = true;
  roof.receiveShadow = true;
  scene.add(roof);

  // HVAC Units
  const hvacGeometry = new THREE.BoxGeometry(2, 1, 2);
  const hvacMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
  for (let i = 0; i < 3; i++) {
    const hvac = new THREE.Mesh(hvacGeometry, hvacMaterial);
    hvac.position.set(-6 + i * 6, floors[floors.length - 1].y + 4.7, -5);
    hvac.castShadow = true;
    hvac.receiveShadow = true;
    hvac.userData = { type: 'equipment', name: `HVAC Unit ${i + 1}`, system: 'hvac' };
    scene.add(hvac);
  }

  // Electrical Panel
  const panelGeometry = new THREE.BoxGeometry(1, 2, 0.3);
  const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const panel = new THREE.Mesh(panelGeometry, panelMaterial);
  panel.position.set(7, 1, 4);
  panel.castShadow = true;
  panel.receiveShadow = true;
  panel.userData = { type: 'equipment', name: 'Main Distribution Panel', system: 'electrical' };
  scene.add(panel);
  objectsRef.current['electrical_panel'] = panel;

  // Floor visibility toggle helper
  objectsRef.current.setFloorVisibility = (floorKey) => {
    Object.keys(floorGroups).forEach(key => {
      floorGroups[key].visible = (key === floorKey || floorKey === 'all');
    });
  };
}


// Helper function to add incident marker
function addIncidentMarker(scene, incident, isSelected) {
  const { coordinates, severity, id, title } = incident
  
  // Create marker
  const markerGeometry = new THREE.SphereGeometry(0.3, 16, 16)
  const markerMaterial = new THREE.MeshStandardMaterial({ 
    color: severity === 'critical' ? 0xff0000 : severity === 'warning' ? 0xffaa00 : 0x0088ff,
    emissive: severity === 'critical' ? 0xff0000 : severity === 'warning' ? 0xffaa00 : 0x0088ff,
    emissiveIntensity: isSelected ? 0.8 : 0.5
  })
  
  const marker = new THREE.Mesh(markerGeometry, markerMaterial)
  marker.position.set(coordinates.x, coordinates.y, coordinates.z)
  marker.userData = { type: 'incident', id, title, severity }
  scene.add(marker)
  
  // Add pulsing effect for active incidents
  if (incident.status === 'active') {
    // Create outer glow
    const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16)
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color: severity === 'critical' ? 0xff0000 : severity === 'warning' ? 0xffaa00 : 0x0088ff,
      transparent: true,
      opacity: 0.3
    })
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    glow.position.copy(marker.position)
    glow.userData = { type: 'glow', parentId: id }
    scene.add(glow)
    
    // Animate the glow
    let scale = 1
    let growing = true
    
    const animateGlow = () => {
      if (growing) {
        scale += 0.01
        if (scale >= 1.5) {
          growing = false
        }
      } else {
        scale -= 0.01
        if (scale <= 1) {
          growing = true
        }
      }
      
      glow.scale.set(scale, scale, scale)
      requestAnimationFrame(animateGlow)
    }
    
    animateGlow()
  }
  
  // Add highlight for selected incident
  if (isSelected) {
    const ringGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 32)
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    })
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.position.copy(marker.position)
    ring.rotation.x = Math.PI / 2
    ring.userData = { type: 'highlight', parentId: id }
    scene.add(ring)
    
    // Rotate the ring
    const animateRing = () => {
      ring.rotation.z += 0.01
      requestAnimationFrame(animateRing)
    }
    animateRing()
  }
}

// Helper function to add sensor marker
function addSensorMarker(scene, sensor) {
  const { coordinates, type, id, name, status } = sensor
  
  // Create marker
  const markerGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
  const markerMaterial = new THREE.MeshStandardMaterial({ 
    color: status === 'alert' ? 0xff0000 : 0x00aaff,
    emissive: status === 'alert' ? 0xff0000 : 0x00aaff,
    emissiveIntensity: status === 'alert' ? 0.7 : 0.3
  })
  
  const marker = new THREE.Mesh(markerGeometry, markerMaterial)
  marker.position.set(coordinates.x, coordinates.y, coordinates.z)
  marker.userData = { type: 'sensor', id, name, sensorType: type, status }
  scene.add(marker)
  
  // Add small indicator light for active sensors
  if (status === 'alert') {
    const lightGeometry = new THREE.SphereGeometry(0.05, 8, 8)
    const lightMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 1
    })
    
    const light = new THREE.Mesh(lightGeometry, lightMaterial)
    light.position.set(
      coordinates.x + 0.15,
      coordinates.y + 0.15,
      coordinates.z + 0.15
    )
    light.userData = { type: 'indicator', parentId: id }
    scene.add(light)
    
    // Add blinking effect
    let visible = true
    setInterval(() => {
      visible = !visible
      light.visible = visible
    }, 500)
  }
}