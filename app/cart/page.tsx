"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface CartItem {
  artId: string
  title: string
  price: number
  image: string
  quantity: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart")
      if (res.ok) {
        const cart = await res.json()
        // Fetch art details for each item
        const itemsWithDetails = await Promise.all(
          (cart.items || []).map(async (item: any) => {
            const artRes = await fetch(`/api/art/${item.artId}`)
            const art = await artRes.json()
            return {
              artId: item.artId,
              title: art.title,
              price: item.price,
              image: art.images[0],
              quantity: item.quantity,
            }
          }),
        )
        setItems(itemsWithDetails)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (artId: string) => {
    try {
      await fetch(`/api/cart/${artId}`, { method: "DELETE" })
      setItems(items.filter((item) => item.artId !== artId))
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-4 bg-primary/20 rounded w-48" />
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
            Continue Shopping
          </Button>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-12">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center">
            <p className="text-foreground/70 text-lg">Your cart is empty</p>
            <p className="text-foreground/50 mt-2">Start shopping to add items to your cart</p>
            <Link href="/marketplace" className="mt-6 inline-block">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Browse Art</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.artId} className="glass-card p-6 rounded-2xl flex gap-6">
                  <img
                    src={item.image || "/placeholder.svg?height=120&width=120&query=art"}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                    <p className="text-primary font-bold text-xl mt-2">${item.price}</p>
                    <p className="text-sm text-foreground/70 mt-2">Quantity: {item.quantity}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                      onClick={() => handleRemove(item.artId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <p className="text-lg font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="glass-card p-6 rounded-2xl h-fit sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Tax (estimated)</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-foreground mb-6">
                <span>Total</span>
                <span>${(total * 1.1).toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-accent">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/marketplace" className="w-full mt-3">
                <Button
                  variant="outline"
                  className="w-full border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
