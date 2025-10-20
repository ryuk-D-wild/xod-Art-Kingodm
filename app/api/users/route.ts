import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/db"
import type { User } from "@/lib/models"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { email, name, avatar } = await req.json()
    const { db } = await connectToDatabase()

    const user: User = {
      clerkId: userId,
      email,
      name,
      avatar,
      isSeller: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(user)

    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/email/send-welcome`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
      })
    } catch (error) {
      console.error("Error sending welcome email:", error)
    }

    return Response.json({ _id: result.insertedId, ...user })
  } catch (error) {
    console.error("Error creating user:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ clerkId: userId })

    if (!user) return new Response("User not found", { status: 404 })
    return Response.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const updates = await req.json()
    const { db } = await connectToDatabase()

    const result = await db.collection("users").findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return Response.json(result.value)
  } catch (error) {
    console.error("Error updating user:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
