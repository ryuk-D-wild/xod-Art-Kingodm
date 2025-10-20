"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import FileUploader from "./file-uploader"
import { X } from "lucide-react"

interface UploadedFile {
  url: string
  publicId: string
  type: "image" | "video"
}

interface MultiUploaderProps {
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
}

export default function MultiUploader({ onFilesChange, maxFiles = 10 }: MultiUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [activeTab, setActiveTab] = useState<"image" | "video">("image")

  const handleUpload = (url: string, publicId: string) => {
    const newFile: UploadedFile = { url, publicId, type: activeTab }
    const updated = [...files, newFile]
    setFiles(updated)
    onFilesChange(updated)
  }

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onFilesChange(updated)
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "image" ? "default" : "outline"}
          onClick={() => setActiveTab("image")}
          className={
            activeTab === "image"
              ? "bg-primary hover:bg-primary/90"
              : "border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
          }
        >
          Upload Images
        </Button>
        <Button
          variant={activeTab === "video" ? "default" : "outline"}
          onClick={() => setActiveTab("video")}
          className={
            activeTab === "video"
              ? "bg-primary hover:bg-primary/90"
              : "border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
          }
        >
          Upload Videos
        </Button>
      </div>

      {/* Uploader */}
      {files.filter((f) => f.type === activeTab).length < maxFiles && (
        <FileUploader onUpload={handleUpload} type={activeTab} />
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-semibold text-foreground mb-4">Uploaded Files ({files.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {file.type === "video" ? (
                  <video src={file.url} className="w-full h-32 object-cover rounded-lg" />
                ) : (
                  <img
                    src={file.url || "/placeholder.svg"}
                    alt="Uploaded"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
