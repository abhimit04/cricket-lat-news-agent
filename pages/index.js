// pages/index.js
import { useState } from "react";
import { useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 3D Scene setup
  useEffect(() => {
    const container = document.getElementById("three-container");
    if (!container) return;

    // Initialize THREE.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create spinning cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 3;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      container.innerHTML = ""; // cleanup
    };
  }, []);

  // Fetch RSS feed
  async function loadNews() {
    try {
      setLoading(true);
      const res = await fetch("/api/cricket-report");
      const data = await res.json();
      setNews(data.news || []);
      gsap.from("#news-output", { opacity: 0, y: 20, duration: 0.5 });
    } catch (err) {
      console.error("Failed to load news", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "1rem", textAlign: "center" }}>
      <h1>🏏 Cricket Latest News</h1>
      <div
        id="three-container"
        style={{ width: "100%", height: "300px", marginBottom: "1rem" }}
      ></div>

      <button
        onClick={loadNews}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Loading..." : "View Latest News"}
      </button>

      <div id="news-output" style={{ marginTop: "20px", textAlign: "left" }}>
        {news.length > 0 &&
          news.map((item, i) => (
            <div
              key={i}
              style={{
                marginBottom: "15px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <strong>{item.headline}</strong>
              <br />
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
          ))}
      </div>
    </main>
  );
}
