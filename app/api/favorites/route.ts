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

    // Get favorites
    const favorites = await db.collection("favorites").find({ userId: user._id }).toArray()

    // Get art details
    const artIds = favorites.map((f: any) => f.artId)
    const arts = await db
      .collection("art")
      .find({ _id: { $in: artIds } })
      .toArray()

    return Response.json(arts)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { artId } = await req.json()
    const { db } = await connectToDatabase()

    // Get user's MongoDB ID
    const user = await db.collection("users").findOne({ clerkId: userId })
    if (!user) return new Response("User not found", { status: 404 })

    // Add to favorites
    await db.collection("favorites").insertOne({
      userId: user._id,
      artId,
      createdAt: new Date(),
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error adding favorite:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
