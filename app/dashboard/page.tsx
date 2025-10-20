"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import UserProfileCard from "@/components/dashboard/user-profile-card"
import PurchaseHistory from "@/components/dashboard/purchase-history"
import Favorites from "@/components/dashboard/favorites"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData()
    }
  }, [isLoaded, user])

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/users")
      if (res.ok) {
        setUserData(await res.json())
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-primary/20 rounded w-48" />
            <div className="h-4 bg-primary/20 rounded w-32" />
          </div>
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
          <Link href="/marketplace">
            <Button variant="ghost" className="text-foreground hover:bg-white/10">
              Browse
            </Button>
          </Link>
          <Link href="/seller">
            <Button variant="ghost" className="text-foreground hover:bg-white/10">
              Seller
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <UserProfileCard user={userData} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-2xl">
                <div className="text-3xl font-bold text-primary">0</div>
                <p className="text-sm text-foreground/70 mt-2">Purchases</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <div className="text-3xl font-bold text-secondary">0</div>
                <p className="text-sm text-foreground/70 mt-2">Favorites</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <PurchaseHistory />
              <Favorites />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
