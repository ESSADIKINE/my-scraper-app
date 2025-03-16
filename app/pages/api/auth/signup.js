import clientPromise from "../../../lib/mongodb";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  const client = await clientPromise;
  const db = client.db("my-scraper-app");

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await hash(password, 10);
  await db.collection("users").insertOne({ email, password: hashedPassword });

  res.status(201).json({ message: "User created successfully" });
}
