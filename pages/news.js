import { useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function NewsPage() {
  useEffect(() => {
    // ✅ Make sure we are in the browser (no SSR issues)
    if (typeof window === "undefined") return;

    // --- THREE.JS SETUP ---
    const container = document.getElementById("three-container");
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create a cricket-ball-like sphere
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      metalness: 0.3,
      roughness: 0.7,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Light setup
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    camera.position.z = 5;

    // Animate with GSAP (bounce + rotate)
    gsap.to(sphere.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      repeat: -1,
      ease: "none",
      duration: 5,
    });

    gsap.to(sphere.position, {
      y: 1,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // ✅ Cleanup on unmount
    return () => {
      container.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  async function loadNews() {
    const output = document.getElementById("output");
    output.innerHTML = "<div>Loading...</div>";

    try {
      const res = await fetch("/api/cricket-report");
      const data = await res.json();

      if (!data.success || data.count === 0) {
        output.innerHTML = `<div>No news available</div>`;
        return;
      }

      output.innerHTML = `
        <div class="summary">
          <h2>Latest cricket news 📰</h2>
          <ul>
            ${data.summary
              .split("\n")
              .map((line) => (line ? `<li>${line.replace(/^-/, "").trim()}</li>` : ""))
              .join("")}
          </ul>
        </div>
      `;
    } catch (err) {
      output.innerHTML = `<div>Error loading news: ${err.message}</div>`;
    }
  }

  return (
    <div>
      <div
        id="three-container"
        style={{
          width: "100%",
          height: "400px",
          background: "rgba(0,0,0,0.4)",
          borderRadius: "16px",
        }}
      ></div>

      <main style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={loadNews}
          style={{
            padding: "12px 24px",
            background: "#1565c0",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          View Latest News
        </button>
        <div id="output" style={{ marginTop: "20px" }}></div>
      </main>
    </div>
  );
}
