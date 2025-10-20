import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ clerkId: userId })
    if (!user) return new Response("User not found", { status: 404 })

    await db.collection("cart").updateOne(
      { userId: user._id },
      {
        $pull: {
          items: { artId: new ObjectId(params.id) },
        },
      },
    )

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
