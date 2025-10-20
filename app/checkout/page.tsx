"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { loadStripe } from "@stripe/js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cartTotal, setCartTotal] = useState(0)

  useEffect(() => {
    fetchCartTotal()
  }, [])

  const fetchCartTotal = async () => {
    try {
      const res = await fetch("/api/cart")
      if (res.ok) {
        const cart = await res.json()
        const total = cart.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
        setCartTotal(total * 1.1) // Include tax
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!stripe || !elements) return

    setLoading(true)

    try {
      // Create payment intent
      const res = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(cartTotal * 100) }),
      })

      if (!res.ok) throw new Error("Failed to create payment intent")

      const { clientSecret } = await res.json()

      // Confirm payment
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error("Card element not found")

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (result.error) {
        setError(result.error.message || "Payment failed")
      } else if (result.paymentIntent?.status === "succeeded") {
        // Create order
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: result.paymentIntent.id,
            amount: cartTotal,
          }),
        })

        router.push("/checkout/success")
      }
    } catch (err) {
      setError("Payment processing failed. Please try again.")
      console.error("Payment error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card p-6 rounded-2xl">
        <label className="block text-sm font-medium text-foreground mb-3">Card Details</label>
        <div className="p-4 bg-white/5 border border-white/20 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#ffffff",
                  "::placeholder": {
                    color: "#ffffff80",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      <div className="glass-card p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
          <span className="text-foreground/70">Total Amount</span>
          <span className="text-2xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
        </div>

        <Button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-accent"
        >
          {loading ? "Processing..." : "Complete Payment"}
        </Button>
      </div>
    </form>
  )
}

export default function CheckoutPage() {
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
        <Link href="/cart">
          <Button variant="ghost" className="text-foreground hover:bg-white/10">
            Back to Cart
          </Button>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <div className="glass-card p-8 rounded-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Secure Checkout</h1>
          <p className="text-foreground/70 mb-8">Complete your purchase with Stripe</p>

          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </main>
  )
}
