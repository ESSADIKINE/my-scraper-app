// app/page.js
"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import * as XLSX from "xlsx";

const Button = ({ children, ...props }) => (
  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" {...props}>
    {children}
  </button>
);

const Input = ({ ...props }) => (
  <input className="border border-gray-300 rounded p-2 w-full" {...props} />
);

export default function ScraperApp() {
  const { data: session } = useSession();
  const [niche, setNiche] = useState("");
  const [region, setRegion] = useState("");
  const [maxResults, setMaxResults] = useState(10);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("Waiting for input...");
  const [results, setResults] = useState([]);

  const handleScrape = async () => {
    setLoading(true);
    setProgress("Fetching search results...");
    
    const response = await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, region, maxResults }),
    });
    
    const data = await response.json();
    setResults(data.data || []);
    setProgress("Scraping completed!");
    setLoading(false);
  };

  const exportToCSV = () => {
    if (results.length === 0) return;
    const csvContent = [
      "Name,Address,Phone,Website,Category,Email",
      ...results.map(biz => `${biz.name},${biz.address},${biz.phone},${biz.website || "N/A"},${biz.category || "N/A"},${biz.email || "N/A"}`)
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scraped_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportToExcel = () => {
    if (results.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "scraped_data.xlsx");
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-4">Sign in to use the scraper</h1>
        <Button onClick={() => signIn("google")}>Sign in with Google</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Google Maps Scraper</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input placeholder="Business Niche" value={niche} onChange={(e) => setNiche(e.target.value)} />
        <Input placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
        <Input type="number" placeholder="Max Results" value={maxResults} onChange={(e) => setMaxResults(parseInt(e.target.value))} />
      </div>

      <Button onClick={handleScrape} disabled={loading} className="w-full">
        {loading ? "Scraping..." : "Start Scraping"}
      </Button>
      {progress && <p className="text-gray-600 mt-4">{progress}</p>}

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Scraped Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Address</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Website</th>
                  <th className="px-4 py-2 border">Category</th>
                  <th className="px-4 py-2 border">Email</th>
                </tr>
              </thead>
              <tbody>
                {results.map((business, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{business.name}</td>
                    <td className="px-4 py-2 border">{business.address}</td>
                    <td className="px-4 py-2 border">{business.phone}</td>
                    <td className="px-4 py-2 border">{business.website || "N/A"}</td>
                    <td className="px-4 py-2 border">{business.category || "N/A"}</td>
                    <td className="px-4 py-2 border">{business.email || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4">
            <Button onClick={exportToCSV}>Download CSV</Button>
            <Button onClick={exportToExcel}>Download Excel</Button>
          </div>
        </div>
      )}
    </div>
  );
}