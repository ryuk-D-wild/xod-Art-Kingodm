"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MultiUploader from "@/components/upload/multi-uploader"

interface UploadedFile {
  url: string
  publicId: string
  type: "image" | "video"
}

export default function UploadArtPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Digital Painting",
    tags: "",
  })
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFilesChange = (uploadedFiles: UploadedFile[]) => {
    setFiles(uploadedFiles)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title || !formData.description || !formData.price) {
      setError("Please fill in all required fields")
      return
    }

    if (files.length === 0) {
      setError("Please upload at least one image")
      return
    }

    setUploading(true)

    try {
      const images = files.filter((f) => f.type === "image").map((f) => f.url)
      const videos = files.filter((f) => f.type === "video").map((f) => f.url)

      const res = await fetch("/api/art", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          category: formData.category,
          tags: formData.tags.split(",").map((t) => t.trim()),
          images,
          videos,
        }),
      })

      if (!res.ok) throw new Error("Failed to upload art")

      router.push("/seller")
    } catch (err) {
      setError("Failed to upload art. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="gradient-blur">
        <div className="blur-circle w-96 h-96 bg-primary -top-20 -left-20" />
        <div className="blur-circle w-96 h-96 bg-secondary top-1/2 -right-20" />
      </div>

      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/90s-anime-aesthetic-wric2do30b1rjds3-jGhRM5hzm2EZ2yXNKHDJxGEe08pYpU.jpg)",
          opacity: 0.1,
        }}
      />

      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 mx-4 mt-4 rounded-full px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          ArtVerse
        </Link>
        <Link href="/seller">
          <Button variant="ghost" className="text-foreground hover:bg-white/10">
            Back to Dashboard
          </Button>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="glass-card p-8 rounded-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Your Art</h1>
          <p className="text-foreground/70 mb-8">Share your creative work with the world</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Images & Videos</label>
              <MultiUploader onFilesChange={handleFilesChange} />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter art title"
                className="glass-input w-full px-4 py-3"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your art in detail"
                rows={5}
                className="glass-input w-full px-4 py-3"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Price (USD) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="glass-input w-full px-4 py-3"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="glass-input w-full px-4 py-3"
              >
                <option>Digital Painting</option>
                <option>Photography</option>
                <option>3D Art</option>
                <option>Animation</option>
                <option>Illustration</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. abstract, modern, colorful"
                className="glass-input w-full px-4 py-3"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {uploading ? "Uploading..." : "Publish Art"}
              </Button>
              <Link href="/seller" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
