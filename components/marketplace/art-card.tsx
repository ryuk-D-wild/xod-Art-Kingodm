"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface ArtCardProps {
  art: any
}

export default function ArtCard({ art }: ArtCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artId: art._id, quantity: 1, price: art.price }),
      })
      if (res.ok) {
        // Show success toast
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleFavorite = async () => {
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artId: art._id }),
      })
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  return (
    <Link href={`/art/${art._id}`}>
      <div className="glass-card group overflow-hidden rounded-2xl cursor-pointer transition hover:shadow-2xl">
        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
          <img
            src={art.images[0] || "/placeholder.svg?height=256&width=256&query=digital+art"}
            alt={art.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-3">
            <Button
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={(e) => {
                e.preventDefault()
                handleAddToCart()
              }}
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="opacity-0 group-hover:opacity-100 transition border-white/50 text-white hover:bg-white/10 bg-transparent"
              onClick={(e) => {
                e.preventDefault()
                handleToggleFavorite()
              }}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-sm font-semibold">
            ${art.price}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground truncate">{art.title}</h3>
          <p className="text-sm text-foreground/70 line-clamp-2 mt-1">{art.description}</p>

          {/* Stats */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
            <span className="text-xs text-foreground/50">{art.sold} sold</span>
            <span className="text-xs text-foreground/50">{art.views} views</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
