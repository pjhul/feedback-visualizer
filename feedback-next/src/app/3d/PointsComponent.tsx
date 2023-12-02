import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

export default function PointsComponent({ points }) {
  const mountRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera;

    import("three").then((THREE) => {
      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Create a geometry and add points
      const geometry = new THREE.BufferGeometry();
      const vertices = [];

      points.forEach((point) => {
        vertices.push(point.x, point.y, point.z);
      });

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );

      // Create material for the points
      const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

      // Create points and add to scene
      const pointsMesh = new THREE.Points(geometry, material);
      scene.add(pointsMesh);

      // Camera position
      camera.position.z = 5;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      window.addEventListener("resize", onWindowResize, false);
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });

    // Cleanup
    return () => {
      if (renderer) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", onWindowResize);
    };
  }, [points]);

  return <div ref={mountRef}></div>;
}
