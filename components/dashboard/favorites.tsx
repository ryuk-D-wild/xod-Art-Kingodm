"use client"

import { useEffect, useState } from "react"

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites")
      if (res.ok) {
        setFavorites(await res.json())
      }
    } catch (error) {
      console.error("Error fetching favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-semibold text-foreground mb-4">Favorite Art</h3>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-foreground/70">No favorites yet</p>
          <p className="text-sm text-foreground/50 mt-2">Add art to your favorites to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favorites.map((art: any) => (
            <div key={art._id} className="group relative overflow-hidden rounded-lg">
              <img
                src={art.images[0] || "/placeholder.svg?height=128&width=128&query=art"}
                alt={art.title}
                className="w-full h-32 object-cover group-hover:scale-110 transition"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <p className="text-white text-sm font-medium">{art.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
