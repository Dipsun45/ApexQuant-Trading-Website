import React, { useRef, useEffect } from 'react';

export const ThreeDCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let scene, camera, renderer, particlesMesh;

    // Dynamically load Three.js if available, or build native WebGL canvas fallback
    const initThree = async () => {
      try {
        const THREE = await import('three');
        if (!mountRef.current) return;

        const width = mountRef.current.clientWidth || window.innerWidth;
        const height = mountRef.current.clientHeight || 500;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        if (mountRef.current.children.length > 0) {
          mountRef.current.innerHTML = '';
        }
        mountRef.current.appendChild(renderer.domElement);

        // Create particles geometry
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i += 3) {
          posArray[i] = (Math.random() - 0.5) * 12;
          posArray[i + 1] = (Math.random() - 0.5) * 12;
          posArray[i + 2] = (Math.random() - 0.5) * 12;

          // Electric blue (#2563EB) & Cyan (#06B6D4) palette
          if (Math.random() > 0.5) {
            colorArray[i] = 0.14;     // R
            colorArray[i + 1] = 0.38; // G
            colorArray[i + 2] = 0.92; // B
          } else {
            colorArray[i] = 0.02;     // R
            colorArray[i + 1] = 0.71; // G
            colorArray[i + 2] = 0.83; // B
          }
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.035,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
        });

        particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Add floating geometric wireframe octahedron
        const geo = new THREE.OctahedronGeometry(1.4, 0);
        const mat = new THREE.MeshBasicMaterial({
          color: 0x06B6D4,
          wireframe: true,
          transparent: true,
          opacity: 0.25,
        });
        const octahedron = new THREE.Mesh(geo, mat);
        scene.add(octahedron);

        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          particlesMesh.rotation.y += 0.0012;
          particlesMesh.rotation.x += 0.0006;

          octahedron.rotation.x += 0.004;
          octahedron.rotation.y += 0.006;

          renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
          if (!mountRef.current) return;
          const w = mountRef.current.clientWidth;
          const h = mountRef.current.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);
      } catch (err) {
        console.warn('Three.js initialization fallback:', err);
      }
    };

    initThree();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer && renderer.domElement) {
        renderer.domElement.remove();
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full min-h-[350px] absolute inset-0 pointer-events-none z-0 overflow-hidden" />;
};
