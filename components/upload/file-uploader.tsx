"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

interface FileUploaderProps {
  onUpload: (url: string, publicId: string) => void
  type: "image" | "video"
  maxSize?: number
}

export default function FileUploader({ onUpload, type, maxSize = 50 * 1024 * 1024 }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setError(null)

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      return
    }

    // Validate file type
    const validTypes =
      type === "video" ? ["video/mp4", "video/webm", "video/quicktime"] : ["image/jpeg", "image/png", "image/webp"]

    if (!validTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted: ${validTypes.join(", ")}`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const { url, publicId } = await res.json()
      onUpload(url, publicId)
    } catch (err) {
      setError("Upload failed. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file) handleFileSelect(file)
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          {type === "video" ? (
            <video src={preview} className="w-full h-64 object-cover rounded-lg" controls />
          ) : (
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
          )}
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="glass-card p-8 rounded-2xl border-2 border-dashed border-primary/50 text-center cursor-pointer hover:border-primary transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-primary/50 mx-auto mb-3" />
          <p className="text-foreground font-medium">Drop your {type} here or click to browse</p>
          <p className="text-sm text-foreground/70 mt-1">Max size: {maxSize / 1024 / 1024}MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={type === "video" ? "video/*" : "image/*"}
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      {uploading && (
        <div className="p-3 bg-primary/20 border border-primary/50 rounded-lg text-primary text-sm">
          Uploading... Please wait
        </div>
      )}
    </div>
  )
}
