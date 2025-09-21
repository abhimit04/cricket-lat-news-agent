// threeNewsVisualizer.js
import * as THREE from 'three';
import { gsap } from 'gsap';

export default class ThreeNewsVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id ${containerId} not found`);
      return;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 8;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    // Lights
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    this.spheres = [];
    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.spheres.forEach(s => s.rotation.y += 0.01);
    this.renderer.render(this.scene, this.camera);
  }

  createSpheres(headlines = []) {
    // Remove old spheres
    this.spheres.forEach(s => this.scene.remove(s));
    this.spheres = [];

    if (headlines.length === 0) {
      // fallback dummy sphere
      headlines = ["No news"];
    }

    headlines.forEach((headline, i) => {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${(i * 50) % 360}, 70%, 50%)`),
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(Math.random() * 8 - 4, Math.random() * 2 - 1, Math.random() * -5);
      this.scene.add(sphere);
      this.spheres.push(sphere);

      // GSAP animations
      gsap.to(sphere.position, {
        y: "+=2",
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2
      });

      gsap.to(sphere.rotation, {
        y: "+=6.28",
        duration: 4 + Math.random() * 4,
        repeat: -1,
        ease: "linear"
      });
    });
  }
}
