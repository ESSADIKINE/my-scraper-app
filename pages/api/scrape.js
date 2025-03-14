import puppeteer from "puppeteer";
import mongoose from "mongoose";
import Business from "../../models/Business";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const { query, region } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www.google.com/maps", { timeout: 60000 });

    await page.type("#searchboxinput", `${query} ${region}`);
    await page.keyboard.press("Enter");
    await new Promise(resolve => setTimeout(resolve, 5000));

    const businesses = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.Nv2PK")).map(el => ({
        name: el.querySelector("div.qBF1Pd")?.innerText || "N/A",
        address: el.querySelector("span.W4Efsd")?.innerText || "N/A",
        phone: el.querySelector("span.DkEaL")?.innerText || "N/A",
      }));
    });

    await Business.insertMany(businesses);
    await browser.close();

    res.json({ message: "Data scraped successfully", data: businesses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
