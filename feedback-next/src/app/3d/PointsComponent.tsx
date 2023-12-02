import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PointsComponent = ({ points }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Create a geometry and add points
        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        points.forEach(point => {
            vertices.push(point.x, point.y, point.z);
        });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        // Create material for the points
        const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

        // Create points and add to scene
        const pointsMesh = new THREE.Points(geometry, material);
        scene.add(pointsMesh);

        // Camera position
        camera.position.z = 35;

        // Handle mouse movement
        const handleMouseMove = (event) => {
          const { clientX, clientY } = event;
          const windowHalfX = window.innerWidth / 2;
          const windowHalfY = window.innerHeight / 2;
      
          // Calculate mouse movement as a fraction of the window size
          const mouseX = (clientX - windowHalfX) / windowHalfX;
          const mouseY = (clientY - windowHalfY) / windowHalfY;
      
          // Update camera rotation
          camera.rotation.y = mouseX * Math.PI / 8; // Horizontal mouse movement affects Y rotation
          camera.rotation.x = mouseY * Math.PI / 8; // Vertical mouse movement affects X rotation
      };

      // Handle zoom
      const handleScroll = (event) => {
        const zoomSensitivity = 0.1;
        const minZoom = 10;  // Minimum field of view (more zoomed in)
        const maxZoom = 75;  // Maximum field of view (more zoomed out)
    
        // Adjust the camera's FOV and clamp it within the min and max zoom levels
        camera.fov -= event.deltaY * zoomSensitivity;
        camera.fov = Math.max(Math.min(camera.fov, maxZoom), minZoom);
    
        // Update the camera's projection matrix
        camera.updateProjectionMatrix();
    };

      // Add event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('wheel', handleScroll);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        // window.addEventListener('resize', onWindowResize, false);
        // function onWindowResize() {
        //     camera.aspect = window.innerWidth / window.innerHeight;
        //     camera.updateProjectionMatrix();
        //     renderer.setSize(window.innerWidth, window.innerHeight);
        // }

        // Cleanup
        return () => {
            mountRef.current.removeChild(renderer.domElement);
            // window.removeEventListener('resize', onWindowResize);
        };
    }, [points]);

    return <div ref={mountRef}></div>;
};

export default PointsComponent;
