// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to Cricket Latest News</h1>
      <p>Click below to see the latest cricket news with 3D animation</p>
      <Link href="/news">
        <button style={{ padding: "10px 20px", marginTop: "20px" }}>
          Go to News Page
        </button>
      </Link>
    </main>
  );
}
