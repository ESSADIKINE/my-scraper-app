import { getSession } from "next-auth/react";
import GoogleMapsPuppeteerScraper from "../../scraper";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { niche, region, maxResults } = req.body;

    const scraper = new GoogleMapsPuppeteerScraper(false);
    await scraper.init();
    const results = await scraper.searchBusinesses(niche, region, maxResults);
    await scraper.saveToMongoDB(results);
    await scraper.close();

    res.status(200).json({ success: true, data: results });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
