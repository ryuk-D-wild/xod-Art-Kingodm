import { auth } from "@clerk/nextjs/server"
import { uploadImage, uploadVideo } from "@/lib/cloudinary"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as "image" | "video"

    if (!file) return new Response("No file provided", { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${userId}-${Date.now()}-${file.name}`

    let result

    if (type === "video") {
      result = await uploadVideo(buffer, filename)
    } else {
      result = await uploadImage(buffer, filename)
    }

    return Response.json({
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return new Response("Upload failed", { status: 500 })
  }
}
