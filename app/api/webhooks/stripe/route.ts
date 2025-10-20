import { headers } from "next/headers"
import Stripe from "stripe"
import { connectToDatabase } from "@/lib/db"
import { sendEmail, getSaleNotificationEmail } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) return new Response("No signature", { status: 400 })

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return new Response("Webhook Error", { status: 400 })
    }

    const { db } = await connectToDatabase()

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Get orders for this payment
      const orders = await db
        .collection("orders")
        .aggregate([
          { $match: { stripePaymentId: paymentIntent.id } },
          {
            $lookup: {
              from: "users",
              localField: "sellerId",
              foreignField: "_id",
              as: "seller",
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
          { $unwind: "$seller" },
          { $unwind: "$art" },
        ])
        .toArray()

      // Send notifications
      for (const order of orders) {
        try {
          const sellerEmail = order.seller.email
          const sellerName = order.seller.name
          const artTitle = order.art.title
          const amount = order.amount

          const emailHtml = getSaleNotificationEmail(sellerName, artTitle, amount)
          await sendEmail(sellerEmail, "New Sale - ArtVerse", emailHtml)
        } catch (error) {
          console.error("Error sending sale notification:", error)
        }
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
