import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: Buffer, filename: string) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `artverse/images/${filename}`,
        folder: "artverse/images",
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      },
    )

    stream.end(file)
  })
}

export async function uploadVideo(file: Buffer, filename: string) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        public_id: `artverse/videos/${filename}`,
        folder: "artverse/videos",
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      },
    )

    stream.end(file)
  })
}

export async function deleteAsset(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}

export function getCloudinaryUrl(publicId: string, options: any = {}) {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  })
}
