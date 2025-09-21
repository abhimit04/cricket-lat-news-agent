"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

export default function ThreeNewsVisualizer({ newsData }) {
  const mountRef = useRef();
  const [sceneObjects, setSceneObjects] = useState([]);

  useEffect(() => {
    if (!newsData || newsData.length === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / 400, // Fixed height container
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, 400);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x888888);
    scene.add(ambient);

    // Create cubes for each news item
    const objects = newsData.map((item, index) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0x1565c0,
        transparent: true,
        opacity: 0.9,
      });
      const cube = new THREE.Mesh(geometry, material);

      // Position cubes in a row
      cube.position.x = index * 2 - (newsData.length - 1);
      cube.position.y = 0;
      cube.position.z = 0;
      scene.add(cube);
      return cube;
    });

    setSceneObjects(objects);

    camera.position.z = 5;

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      objects.forEach((cube, i) => {
        cube.rotation.x += 0.01 + i * 0.002;
        cube.rotation.y += 0.01 + i * 0.002;
      });
      renderer.render(scene, camera);
    };
    animate();

    // GSAP hover animation (optional)
    objects.forEach((cube, i) => {
      gsap.to(cube.position, {
        y: "+=0.2",
        duration: 1 + i * 0.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / 400;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 400);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [newsData]);

  return <div ref={mountRef} style={{ width: "100%", height: "400px" }} />;
}
