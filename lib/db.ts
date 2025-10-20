import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI is not defined")
  }

  const client = new MongoClient(uri)
  await client.connect()

  const db = client.db(process.env.MONGODB_DB || "artverse")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
  }
}
