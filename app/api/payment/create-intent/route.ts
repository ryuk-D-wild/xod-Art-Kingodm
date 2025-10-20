import { auth } from "@clerk/nextjs/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { amount } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { userId },
    })

    return Response.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
