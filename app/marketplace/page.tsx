"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ArtCard from "@/components/marketplace/art-card"
import SearchBar from "@/components/marketplace/search-bar"
import FilterPanel from "@/components/marketplace/filter-panel"

export default function MarketplacePage() {
  const [arts, setArts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])

  useEffect(() => {
    fetchArts()
  }, [search, category, priceRange])

  const fetchArts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (category) params.append("category", category)
      params.append("minPrice", priceRange[0].toString())
      params.append("maxPrice", priceRange[1].toString())

      const res = await fetch(`/api/art?${params}`)
      if (res.ok) {
        setArts(await res.json())
      }
    } catch (error) {
      console.error("Error fetching arts:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="gradient-blur">
        <div className="blur-circle w-96 h-96 bg-primary -top-20 -left-20" />
        <div className="blur-circle w-96 h-96 bg-secondary top-1/2 -right-20" />
        <div className="blur-circle w-96 h-96 bg-accent -bottom-20 left-1/3" />
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
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-foreground hover:bg-white/10">
              Dashboard
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" className="text-foreground hover:bg-white/10">
              Cart
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Discover Amazing Art</h1>
          <p className="text-foreground/70">Browse and purchase beautiful digital art from talented artists</p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <div className="lg:col-span-3">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="lg:col-span-1">
            <FilterPanel
              category={category}
              onCategoryChange={setCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
            />
          </div>
        </div>

        {/* Art Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card h-80 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : arts.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center">
            <p className="text-foreground/70 text-lg">No art found matching your criteria</p>
            <p className="text-foreground/50 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {arts.map((art: any) => (
              <ArtCard key={art._id} art={art} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
