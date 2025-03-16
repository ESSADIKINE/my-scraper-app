import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [niche, setNiche] = useState("");
  const [region, setRegion] = useState("");
  const [maxResults, setMaxResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  if (!session) {
    return (
      <div>
        <h1>Please Sign In</h1>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  const handleScrape = async () => {
    setLoading(true);
    const response = await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, region, maxResults }),
    });
    const data = await response.json();
    setResults(data.data);
    setLoading(false);
  };

  return (
    <div>
      <h1>Google Maps Scraper</h1>
      <input type="text" placeholder="Business Niche" value={niche} onChange={(e) => setNiche(e.target.value)} />
      <input type="text" placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
      <input type="number" placeholder="Max Results" value={maxResults} onChange={(e) => setMaxResults(parseInt(e.target.value))} />
      <button onClick={handleScrape} disabled={loading}>{loading ? "Scraping..." : "Scrape"}</button>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
