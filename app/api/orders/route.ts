import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import type { Order } from "@/lib/models"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { paymentIntentId, amount } = await req.json()
    const { db } = await connectToDatabase()

    // Get buyer
    const buyer = await db.collection("users").findOne({ clerkId: userId })
    if (!buyer) return new Response("User not found", { status: 404 })

    // Get cart items
    const cart = await db.collection("cart").findOne({ userId: buyer._id })
    if (!cart || cart.items.length === 0) return new Response("Cart is empty", { status: 400 })

    // Create orders for each item
    const orders: Order[] = []
    for (const item of cart.items) {
      const art = await db.collection("art").findOne({ _id: new ObjectId(item.artId) })
      if (!art) continue

      const order: Order = {
        buyerId: buyer._id,
        sellerId: art.userId,
        artId: new ObjectId(item.artId),
        amount: item.price * item.quantity,
        stripePaymentId: paymentIntentId,
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await db.collection("orders").insertOne(order)
      orders.push({ _id: result.insertedId, ...order })

      // Update art sold count
      await db.collection("art").updateOne({ _id: new ObjectId(item.artId) }, { $inc: { sold: item.quantity } })
    }

    // Clear cart
    await db.collection("cart").deleteOne({ userId: buyer._id })

    for (const order of orders) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/email/send-order-confirmation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userId}`,
          },
          body: JSON.stringify({ orderId: order._id }),
        })
      } catch (error) {
        console.error("Error sending order confirmation:", error)
      }
    }

    return Response.json({ orders })
  } catch (error) {
    console.error("Error creating orders:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
