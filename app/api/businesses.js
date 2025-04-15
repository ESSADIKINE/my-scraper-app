import clientPromise from '../../app/lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('my-scraper-app');
  const businesses = await db.collection('businesses').find({}).toArray();
  res.status(200).json(businesses);
}