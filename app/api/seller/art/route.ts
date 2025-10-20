import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { db } = await connectToDatabase()

    // Get user's MongoDB ID
    const user = await db.collection("users").findOne({ clerkId: userId })
    if (!user) return new Response("User not found", { status: 404 })

    // Get user's art
    const arts = await db.collection("art").find({ userId: user._id }).sort({ createdAt: -1 }).toArray()

    return Response.json(arts)
  } catch (error) {
    console.error("Error fetching seller arts:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
