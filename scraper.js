import puppeteer from 'puppeteer';
import clientPromise from './app/lib/mongodb';

class GoogleMapsPuppeteerScraper {
  constructor(headless = false) {
    this.headless = headless;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: this.headless,
      args: [
        '--window-size=1920,1080',
        '--disable-notifications',
        '--disable-infobars',
        '--start-maximized',
        '--disable-extensions',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox'
      ],
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
    );
  }

  // ... (include all the methods from your provided scraper class)

  async saveToMongoDB(businesses) {
    const client = await clientPromise;
    const db = client.db('my-scraper-app');
    const collection = db.collection('businesses');
    await collection.insertMany(businesses);
    console.log('Data saved to MongoDB');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log("Browser closed.");
    }
  }
}

export default GoogleMapsPuppeteerScraper;