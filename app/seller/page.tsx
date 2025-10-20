"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SellerStats from "@/components/seller/seller-stats"
import SellerArtList from "@/components/seller/seller-art-list"

export default function SellerPage() {
  const { user, isLoaded } = useUser()
  const [sellerData, setSellerData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchSellerData()
    }
  }, [isLoaded, user])

  const fetchSellerData = async () => {
    try {
      const res = await fetch("/api/seller")
      if (res.ok) {
        setSellerData(await res.json())
      }
    } catch (error) {
      console.error("Error fetching seller data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-4 bg-primary/20 rounded w-48 mb-4" />
          <div className="h-4 bg-primary/20 rounded w-32" />
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
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-foreground hover:bg-white/10">
              Dashboard
            </Button>
          </Link>
          <Link href="/seller/upload">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Upload Art</Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Seller Dashboard</h1>
          <p className="text-foreground/70">Manage your art, track sales, and grow your business</p>
        </div>

        {/* Stats */}
        <SellerStats data={sellerData} />

        {/* Art List */}
        <div className="mt-12">
          <SellerArtList />
        </div>
      </div>
    </main>
  )
}
