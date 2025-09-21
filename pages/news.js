import ThreeNewsVisualizer from './threeNewsVisualizer.js';

document.addEventListener('DOMContentLoaded', () => {
  const visualizer = new ThreeNewsVisualizer('three-container');

  async function loadNews() {
    const output = document.getElementById('output');
    output.innerHTML = "<div class='loading'>Loading news...</div>";

    try {
      const res = await fetch('/api/cricket-report');
      const data = await res.json();

      if (!data.success || data.count === 0) {
        output.innerHTML = `<div class="error">No news available</div>`;
        visualizer.createSpheres(); // fallback sphere
        return;
      }

      // Update Three.js spheres
      visualizer.createSpheres(data.news.map(n => n.headline));

      // AI Summary
      let html = `
        <div class="summary">
          <h2> Latest cricket news for you 📰</h2>
          <ul>
            ${data.summary
              .split("\n")
              .map(line => line ? `<li>${line.replace(/^-/, "").trim()}</li>` : "")
              .join("")}
          </ul>
        </div>
      `;

      // News Grid
      html += `<div class="news-grid">`;
      data.news.forEach(item => {
        html += `
          <div class="news-card">
            <h2>${item.headline}</h2>
            <p><strong>Source:</strong> ${item.source}</p>
            <p>${item.summary}</p>
            <a href="${item.link}" target="_blank">Read more 🔗</a>
          </div>
        `;
      });
      html += `</div>`;

      output.innerHTML = html;
    } catch (err) {
      output.innerHTML = `<div class="error">Error loading news: ${err.message}</div>`;
      visualizer.createSpheres(); // fallback sphere
    }
  }

  window.loadNews = loadNews;
});
