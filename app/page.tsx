"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { user, isLoaded } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="gradient-blur">
        <div className="blur-circle w-96 h-96 bg-primary -top-20 -left-20" />
        <div className="blur-circle w-96 h-96 bg-secondary top-1/2 -right-20" />
        <div className="blur-circle w-96 h-96 bg-accent -bottom-20 left-1/3" />
      </div>

      {/* Background image with overlay */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/90s-anime-aesthetic-wric2do30b1rjds3-jGhRM5hzm2EZ2yXNKHDJxGEe08pYpU.jpg)",
          opacity: 0.15,
        }}
      />

      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 mx-4 mt-4 rounded-full px-6 py-3 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ArtVerse
        </div>
        <div className="flex gap-4">
          {isLoaded && user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-foreground hover:bg-white/10">
                  Dashboard
                </Button>
              </Link>
              <Link href="/seller">
                <Button variant="ghost" className="text-foreground hover:bg-white/10">
                  Seller
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-foreground hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 text-center">
        <div className="glass-card max-w-2xl p-12 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Sell Your Art
            </span>
            <br />
            <span className="text-foreground">Beautifully</span>
          </h1>

          <p className="text-lg text-foreground/80 text-balance">
            A premium marketplace for digital artists to showcase and sell their work with secure payments and global
            reach.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            {isLoaded && user ? (
              <>
                <Link href="/marketplace">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-accent">
                    Browse Art
                  </Button>
                </Link>
                <Link href="/seller/upload">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
                  >
                    Upload Art
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-accent">
                    Get Started
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl">
          {[
            { title: "Secure Payments", desc: "Stripe integration for safe transactions" },
            { title: "Global Reach", desc: "Sell to customers worldwide" },
            { title: "Beautiful Design", desc: "Glassmorphism UI for premium feel" },
          ].map((feature, i) => (
            <div key={i} className="glass p-6 rounded-2xl text-center">
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-foreground/70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
