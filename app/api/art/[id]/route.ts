import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { db } = await connectToDatabase()

    // Get user's MongoDB ID
    const user = await db.collection("users").findOne({ clerkId: userId })
    if (!user) return new Response("User not found", { status: 404 })

    // Delete art (only if user is the owner)
    const result = await db.collection("art").deleteOne({
      _id: new ObjectId(params.id),
      userId: user._id,
    })

    if (result.deletedCount === 0) return new Response("Not found or unauthorized", { status: 404 })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting art:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
