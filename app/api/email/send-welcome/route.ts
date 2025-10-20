import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/db"
import { sendEmail, getWelcomeEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { db } = await connectToDatabase()

    // Get user
    const user = await db.collection("users").findOne({ clerkId: userId })
    if (!user) return new Response("User not found", { status: 404 })

    const emailHtml = getWelcomeEmail(user.name)
    await sendEmail(user.email, "Welcome to ArtVerse!", emailHtml)

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
