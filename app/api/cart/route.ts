import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ clerkId: userId })
    if (!user) return new Response("User not found", { status: 404 })

    const cart = await db.collection("cart").findOne({ userId: user._id })
    return Response.json(cart || { items: [] })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { artId, quantity, price } = await req.json()
    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ clerkId: userId })
    if (!user) return new Response("User not found", { status: 404 })

    const cart = await db.collection("cart").findOne({ userId: user._id })

    if (cart) {
      await db.collection("cart").updateOne(
        { userId: user._id },
        {
          $push: {
            items: {
              artId: new ObjectId(artId),
              quantity,
              price,
            },
          },
          $set: { updatedAt: new Date() },
        },
      )
    } else {
      await db.collection("cart").insertOne({
        userId: user._id,
        items: [
          {
            artId: new ObjectId(artId),
            quantity,
            price,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
