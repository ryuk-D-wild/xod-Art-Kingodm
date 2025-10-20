import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/db"
import type { Art } from "@/lib/models"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { title, description, price, category, tags, images, videos } = await req.json()
    const { db } = await connectToDatabase()

    // Get user's MongoDB ID
    const user = await db.collection("users").findOne({ clerkId: userId })
    if (!user) return new Response("User not found", { status: 404 })

    // Create art document
    const art: Art = {
      userId: user._id,
      title,
      description,
      price,
      images,
      videos,
      category,
      tags,
      sold: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("art").insertOne(art)
    return Response.json({ _id: result.insertedId, ...art })
  } catch (error) {
    console.error("Error creating art:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
