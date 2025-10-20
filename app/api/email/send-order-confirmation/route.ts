import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/db"
import { sendEmail, getOrderConfirmationEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { orderId } = await req.json()
    const { db } = await connectToDatabase()

    // Get order details
    const order = await db
      .collection("orders")
      .aggregate([
        { $match: { _id: orderId } },
        {
          $lookup: {
            from: "users",
            localField: "buyerId",
            foreignField: "_id",
            as: "buyer",
          },
        },
        {
          $lookup: {
            from: "art",
            localField: "artId",
            foreignField: "_id",
            as: "art",
          },
        },
        { $unwind: "$buyer" },
        { $unwind: "$art" },
      ])
      .toArray()

    if (order.length === 0) return new Response("Order not found", { status: 404 })

    const orderData = order[0]
    const buyerEmail = orderData.buyer.email
    const buyerName = orderData.buyer.name
    const artTitle = orderData.art.title
    const amount = orderData.amount

    const emailHtml = getOrderConfirmationEmail(buyerName, [{ title: artTitle, price: amount }], amount)
    await sendEmail(buyerEmail, "Order Confirmation - ArtVerse", emailHtml)

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error sending order confirmation:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
