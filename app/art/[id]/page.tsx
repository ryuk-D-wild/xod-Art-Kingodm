"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Share2 } from "lucide-react"

export default function ArtDetailPage() {
  const params = useParams()
  const [art, setArt] = useState(null)
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchArtDetails()
  }, [params.id])

  const fetchArtDetails = async () => {
    try {
      const res = await fetch(`/api/art/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setArt(data)
        // Fetch seller info
        const sellerRes = await fetch(`/api/users/${data.userId}`)
        if (sellerRes.ok) {
          setSeller(await sellerRes.json())
        }
      }
    } catch (error) {
      console.error("Error fetching art details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-96 bg-primary/20 rounded-lg mb-4" />
          <div className="h-4 bg-primary/20 rounded w-48" />
        </div>
      </div>
    )
  }

  if (!art) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-foreground/70">Art not found</p>
          <Link href="/marketplace">
            <Button className="mt-4 bg-primary hover:bg-primary/90">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
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
        <Link href="/marketplace">
          <Button variant="ghost" className="text-foreground hover:bg-white/10">
            Back to Marketplace
          </Button>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image */}
          <div className="lg:col-span-2">
            <div className="glass-card p-4 rounded-3xl">
              <img
                src={art.images[0] || "/placeholder.svg?height=500&width=500&query=digital+art"}
                alt={art.title}
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>

            {/* Description */}
            <div className="glass-card p-6 rounded-2xl mt-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">About this Art</h2>
              <p className="text-foreground/80 leading-relaxed">{art.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {art.tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Card */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-4xl font-bold text-primary mb-4">${art.price}</div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-3">
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
              >
                <Heart className="w-4 h-4 mr-2" />
                Add to Favorites
              </Button>
            </div>

            {/* Seller Info */}
            {seller && (
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-semibold text-foreground mb-4">Artist</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={seller.avatar || "/placeholder.svg?height=48&width=48&query=artist"}
                    alt={seller.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-foreground">{seller.name}</p>
                    <p className="text-sm text-foreground/70">{seller.bio || "Artist"}</p>
                  </div>
                </div>
                <Link href={`/artist/${seller._id}`} className="w-full mt-4">
                  <Button
                    variant="outline"
                    className="w-full border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
                  >
                    View Profile
                  </Button>
                </Link>
              </div>
            )}

            {/* Stats */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Sold</span>
                  <span className="font-semibold text-foreground">{art.sold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Views</span>
                  <span className="font-semibold text-foreground">{art.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Category</span>
                  <span className="font-semibold text-foreground">{art.category}</span>
                </div>
              </div>
            </div>

            {/* Share */}
            <Button
              variant="outline"
              className="w-full border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
