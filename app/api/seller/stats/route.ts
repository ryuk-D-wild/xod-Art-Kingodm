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

    // Get stats
    const totalArt = await db.collection("art").countDocuments({ userId: user._id })

    const artStats = await db
      .collection("art")
      .aggregate([
        { $match: { userId: user._id } },
        {
          $group: {
            _id: null,
            totalSold: { $sum: "$sold" },
            totalViews: { $sum: "$views" },
          },
        },
      ])
      .toArray()

    const orders = await db
      .collection("orders")
      .aggregate([
        { $match: { sellerId: user._id, status: "completed" } },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$amount" },
          },
        },
      ])
      .toArray()

    return Response.json({
      totalArt,
      totalSales: artStats[0]?.totalSold || 0,
      totalViews: artStats[0]?.totalViews || 0,
      totalEarnings: orders[0]?.totalEarnings || 0,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
