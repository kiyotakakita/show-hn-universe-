import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ShowHnProject, ClusterId } from '../types';
import { CLUSTERS } from '../data/clusters';

interface GalaxyCanvasProps {
  projects: ShowHnProject[];
  selectedProject: ShowHnProject | null;
  hoveredProject: ShowHnProject | null;
  activeCluster: ClusterId | 'all';
  searchQuery: string;
  autoRotate: boolean;
  onSelectProject: (project: ShowHnProject) => void;
  onHoverProject: (project: ShowHnProject | null) => void;
}

// Procedurally generate a high-res circular glowing star texture
function createStarTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.15, 'rgba(230, 245, 255, 0.95)');
  gradient.addColorStop(0.4, 'rgba(120, 180, 255, 0.5)');
  gradient.addColorStop(0.7, 'rgba(50, 100, 255, 0.15)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const GalaxyCanvas: React.FC<GalaxyCanvasProps> = ({
  projects,
  selectedProject,
  hoveredProject,
  activeCluster,
  searchQuery,
  autoRotate,
  onSelectProject,
  onHoverProject,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const selectionRingRef = useRef<THREE.Mesh | null>(null);
  const pulseRingsRef = useRef<THREE.Group | null>(null);

  // Interaction tracking refs
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const touchStartDist = useRef<number | null>(null);
  const sphericalRef = useRef({ radius: 85, theta: 0.6, phi: 1.1 });
  const targetSphericalRef = useRef({ radius: 85, theta: 0.6, phi: 1.1 });
  const cameraLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const projectsDataRef = useRef<ShowHnProject[]>(projects);
  const selectedProjectRef = useRef<ShowHnProject | null>(selectedProject);

  projectsDataRef.current = projects;
  selectedProjectRef.current = selectedProject;

  // When selectedProject changes, animate camera towards it
  useEffect(() => {
    if (selectedProject) {
      const [x, y, z] = selectedProject.position;
      targetLookAtRef.current.set(x, y, z);
      targetSphericalRef.current.radius = 45; // zoom closer to examine
    } else if (activeCluster !== 'all') {
      const cluster = CLUSTERS[activeCluster];
      const [cx, cy, cz] = cluster.centerPosition;
      targetLookAtRef.current.set(cx, cy, cz);
      targetSphericalRef.current.radius = 65;
    } else {
      targetLookAtRef.current.set(0, 0, 0);
      targetSphericalRef.current.radius = 85;
    }
  }, [selectedProject, activeCluster]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x030712, 0.007);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const starTexture = createStarTexture();

    // 4. Cosmic ambient background dust (twinkling starfield)
    const bgStarsGeo = new THREE.BufferGeometry();
    const bgCount = 1800;
    const bgPositions = new Float32Array(bgCount * 3);
    const bgColors = new Float32Array(bgCount * 3);

    for (let i = 0; i < bgCount; i++) {
      const r = 160 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      bgPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      bgPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bgPositions[i * 3 + 2] = r * Math.cos(phi);

      const colorTint = Math.random() > 0.7 ? 0.9 : 0.6;
      bgColors[i * 3] = 0.6 * colorTint;
      bgColors[i * 3 + 1] = 0.7 * colorTint;
      bgColors[i * 3 + 2] = 0.95 * colorTint;
    }

    bgStarsGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgStarsGeo.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));
    const bgStarsMat = new THREE.PointsMaterial({
      size: 1.8,
      map: starTexture,
      transparent: true,
      opacity: 0.55,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const bgStarField = new THREE.Points(bgStarsGeo, bgStarsMat);
    scene.add(bgStarField);

    // 5. Cluster Nebulae Spheres (soft ambient clouds at each cluster center)
    const nebulaGroup = new THREE.Group();
    Object.values(CLUSTERS).forEach((cluster) => {
      const [cx, cy, cz] = cluster.centerPosition;
      const nebulaGeo = new THREE.SphereGeometry(14, 16, 16);
      const nebulaMat = new THREE.MeshBasicMaterial({
        color: cluster.hexColor,
        transparent: true,
        opacity: 0.035,
        wireframe: true,
      });
      const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);
      nebulaMesh.position.set(cx, cy, cz);
      nebulaGroup.add(nebulaMesh);
    });
    scene.add(nebulaGroup);

    // 6. Selection Ring Mesh (tracks selected project)
    const selRingGeo = new THREE.RingGeometry(1.6, 2.1, 32);
    const selRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const selectionRing = new THREE.Mesh(selRingGeo, selRingMat);
    selectionRing.visible = false;
    scene.add(selectionRing);
    selectionRingRef.current = selectionRing;

    // 7. Pulse rings for Supernovas
    const pulseGroup = new THREE.Group();
    scene.add(pulseGroup);
    pulseRingsRef.current = pulseGroup;

    // 8. Constellation connection lines
    const lineGroup = new THREE.Group();
    scene.add(lineGroup);

    // Mouse Raycasting
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 2.2 };
    const mouse = new THREE.Vector2(-10, -10);

    // Track touch interactions
    const getTouchDistance = (t1: Touch, t2: Touch) => {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current) {
        const dx = e.clientX - prevMousePos.current.x;
        const dy = e.clientY - prevMousePos.current.y;
        prevMousePos.current = { x: e.clientX, y: e.clientY };

        targetSphericalRef.current.theta -= dx * 0.006;
        targetSphericalRef.current.phi = Math.max(
          0.1,
          Math.min(Math.PI - 0.1, targetSphericalRef.current.phi - dy * 0.006)
        );
      } else {
        // Raycast hover
        raycaster.setFromCamera(mouse, camera);
        if (pointsRef.current) {
          const intersects = raycaster.intersectObject(pointsRef.current);
          if (intersects.length > 0 && intersects[0].index !== undefined) {
            const idx = intersects[0].index;
            const p = projectsDataRef.current[idx];
            if (p) onHoverProject(p);
          } else {
            onHoverProject(null);
          }
        }
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      if (pointsRef.current) {
        const intersects = raycaster.intersectObject(pointsRef.current);
        if (intersects.length > 0 && intersects[0].index !== undefined) {
          const idx = intersects[0].index;
          const p = projectsDataRef.current[idx];
          if (p) onSelectProject(p);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.05;
      targetSphericalRef.current.radius = Math.max(
        15,
        Math.min(150, targetSphericalRef.current.radius + zoomFactor)
      );
    };

    // Touch event handlers for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isDraggingRef.current = false;
        touchStartDist.current = getTouchDistance(e.touches[0], e.touches[1]);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const dx = e.touches[0].clientX - prevMousePos.current.x;
        const dy = e.touches[0].clientY - prevMousePos.current.y;
        prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        targetSphericalRef.current.theta -= dx * 0.007;
        targetSphericalRef.current.phi = Math.max(
          0.1,
          Math.min(Math.PI - 0.1, targetSphericalRef.current.phi - dy * 0.007)
        );
      } else if (e.touches.length === 2 && touchStartDist.current !== null) {
        const newDist = getTouchDistance(e.touches[0], e.touches[1]);
        const diff = touchStartDist.current - newDist;
        targetSphericalRef.current.radius = Math.max(
          15,
          Math.min(150, targetSphericalRef.current.radius + diff * 0.25)
        );
        touchStartDist.current = newDist;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        isDraggingRef.current = false;
        touchStartDist.current = null;
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width && height && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation when not dragging or inspecting closely
      if (autoRotate && !isDraggingRef.current && !selectedProjectRef.current) {
        targetSphericalRef.current.theta += delta * 0.05;
      }

      // Smooth camera interpolation
      const damping = 0.08;
      sphericalRef.current.radius += (targetSphericalRef.current.radius - sphericalRef.current.radius) * damping;
      sphericalRef.current.theta += (targetSphericalRef.current.theta - sphericalRef.current.theta) * damping;
      sphericalRef.current.phi += (targetSphericalRef.current.phi - sphericalRef.current.phi) * damping;

      cameraLookAtRef.current.lerp(targetLookAtRef.current, 0.08);

      const r = sphericalRef.current.radius;
      const th = sphericalRef.current.theta;
      const ph = sphericalRef.current.phi;

      camera.position.x = cameraLookAtRef.current.x + r * Math.sin(ph) * Math.sin(th);
      camera.position.y = cameraLookAtRef.current.y + r * Math.cos(ph);
      camera.position.z = cameraLookAtRef.current.z + r * Math.sin(ph) * Math.cos(th);
      camera.lookAt(cameraLookAtRef.current);

      // Subtle background drift
      bgStarField.rotation.y = elapsedTime * 0.01;
      nebulaGroup.rotation.y = -elapsedTime * 0.015;

      // Update selection ring
      if (selectedProjectRef.current && selectionRingRef.current) {
        const [sx, sy, sz] = selectedProjectRef.current.position;
        selectionRingRef.current.visible = true;
        selectionRingRef.current.position.set(sx, sy, sz);
        selectionRingRef.current.lookAt(camera.position);
        const scale = 1 + Math.sin(elapsedTime * 4) * 0.15;
        selectionRingRef.current.scale.set(scale, scale, 1);
      } else if (selectionRingRef.current) {
        selectionRingRef.current.visible = false;
      }

      // Pulse supernova rings
      if (pulseRingsRef.current) {
        pulseRingsRef.current.children.forEach((mesh) => {
          mesh.lookAt(camera.position);
          const s = 1 + (Math.sin(elapsedTime * 5 + Number(mesh.userData.offset || 0)) + 1) * 0.4;
          mesh.scale.set(s, s, 1);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starTexture.dispose();
    };
  }, []);

  // Update Points and Constellation lines when projects, filters, or search change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove previous points
    if (pointsRef.current) {
      scene.remove(pointsRef.current);
      pointsRef.current.geometry.dispose();
      pointsRef.current = null;
    }

    // Remove previous lines
    const oldLines = scene.getObjectByName('constellationLines');
    if (oldLines) scene.remove(oldLines);

    // Remove previous supernova rings
    if (pulseRingsRef.current) {
      while (pulseRingsRef.current.children.length > 0) {
        pulseRingsRef.current.remove(pulseRingsRef.current.children[0]);
      }
    }

    const count = projects.length;
    if (count === 0) return;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const query = searchQuery.toLowerCase().trim();

    projects.forEach((p, i) => {
      const [x, y, z] = p.position;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const clusterInfo = CLUSTERS[p.cluster];
      const baseColor = new THREE.Color(clusterInfo.hexColor);

      const isClusterMatch = activeCluster === 'all' || p.cluster === activeCluster;
      const isSearchMatch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.summary.oneLiner.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query)) ||
        p.author.toLowerCase().includes(query);

      const isSelected = selectedProject?.id === p.id;
      const isHovered = hoveredProject?.id === p.id;

      if (!isClusterMatch || !isSearchMatch) {
        // Dim out non-matching stars
        colors[i * 3] = baseColor.r * 0.15;
        colors[i * 3 + 1] = baseColor.g * 0.15;
        colors[i * 3 + 2] = baseColor.b * 0.15;
        sizes[i] = 2.0;
      } else {
        // Highlight active stars
        if (isSelected || isHovered) {
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 1.0;
          colors[i * 3 + 2] = 1.0;
          sizes[i] = 9.0;
        } else if (p.isSupernova) {
          // Supernova star glows bright gold / cyan
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 0.9;
          colors[i * 3 + 2] = 0.4;
          sizes[i] = 8.0;

          // Add pulsing ring for supernova
          if (pulseRingsRef.current) {
            const ringGeo = new THREE.RingGeometry(1.2, 1.8, 24);
            const ringMat = new THREE.MeshBasicMaterial({
              color: 0xfacc15,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.7,
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.position.set(x, y, z);
            ringMesh.userData = { offset: i };
            pulseRingsRef.current.add(ringMesh);
          }
        } else {
          // Normal active star
          colors[i * 3] = baseColor.r;
          colors[i * 3 + 1] = baseColor.g;
          colors[i * 3 + 2] = baseColor.b;
          // Scale size slightly by points
          sizes[i] = Math.min(7.5, Math.max(4.0, 3.5 + Math.log10(p.points || 10) * 1.5));
        }
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader or PointsMaterial with vertex sizes
    const starTexture = createStarTexture();
    const pointsMat = new THREE.PointsMaterial({
      size: 5.5,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, pointsMat);
    scene.add(points);
    pointsRef.current = points;

    // Constellation lines: connect nearby stars within the same cluster
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    for (let i = 0; i < count; i++) {
      const p1 = projects[i];
      if (activeCluster !== 'all' && p1.cluster !== activeCluster) continue;

      for (let j = i + 1; j < count; j++) {
        const p2 = projects[j];
        if (p1.cluster !== p2.cluster) continue;

        const dx = p1.position[0] - p2.position[0];
        const dy = p1.position[1] - p2.position[1];
        const dz = p1.position[2] - p2.position[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // If stars are close enough, connect with a delicate constellation thread
        if (dist < 11) {
          linePositions.push(...p1.position, ...p2.position);
          const c = new THREE.Color(CLUSTERS[p1.cluster].hexColor);
          const alphaFade = Math.max(0.05, (1 - dist / 11) * 0.25);
          lineColors.push(c.r * alphaFade, c.g * alphaFade, c.b * alphaFade);
          lineColors.push(c.r * alphaFade, c.g * alphaFade, c.b * alphaFade);
        }
      }
    }

    if (linePositions.length > 0) {
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      lines.name = 'constellationLines';
      scene.add(lines);
    }
  }, [projects, activeCluster, searchQuery, selectedProject, hoveredProject]);

  return (
    <div className="relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
