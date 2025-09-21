import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ThreeNewsVisualizer = dynamic(
  () => import("../components/ThreeNewsVisualizer"),
  { ssr: false }
);

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/cricket-report");
        const data = await res.json();
        if (data.success) {
          setNews(data.news);
          setSummary(data.summary);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cricket News 3D Visualizer 🏏</h1>
      {loading && <p>Loading news...</p>}
      {!loading && summary && (
        <div style={{ marginBottom: "20px" }}>
          <h2>AI Summary:</h2>
          <ul>
            {summary.split("\n").map((line, i) =>
              line ? <li key={i}>{line.replace(/^-/, "").trim()}</li> : null
            )}
          </ul>
        </div>
      )}
      {!loading && news.length > 0 && (
        <ThreeNewsVisualizer newsData={news} />
      )}
    </div>
  );
}
