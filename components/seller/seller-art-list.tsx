"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"

export default function SellerArtList() {
  const [arts, setArts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSellerArts()
  }, [])

  const fetchSellerArts = async () => {
    try {
      const res = await fetch("/api/seller/art")
      if (res.ok) {
        setArts(await res.json())
      }
    } catch (error) {
      console.error("Error fetching arts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (artId: string) => {
    if (!confirm("Are you sure you want to delete this art?")) return

    try {
      const res = await fetch(`/api/art/${artId}`, { method: "DELETE" })
      if (res.ok) {
        setArts(arts.filter((a: any) => a._id !== artId))
      }
    } catch (error) {
      console.error("Error deleting art:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card h-24 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (arts.length === 0) {
    return (
      <div className="glass-card p-12 rounded-2xl text-center">
        <p className="text-foreground/70 text-lg">No art published yet</p>
        <p className="text-foreground/50 mt-2">Start by uploading your first artwork</p>
        <Link href="/seller/upload" className="mt-4 inline-block">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Upload Art</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Art</h2>
      <div className="space-y-4">
        {arts.map((art: any) => (
          <div key={art._id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
            <img
              src={art.images[0] || "/placeholder.svg?height=80&width=80&query=art"}
              alt={art.title}
              className="w-20 h-20 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{art.title}</h3>
              <p className="text-sm text-foreground/70">${art.price}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">{art.sold} sold</span>
                <span className="text-xs px-2 py-1 rounded bg-secondary/20 text-secondary">{art.views} views</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/seller/edit/${art._id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                onClick={() => handleDelete(art._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
