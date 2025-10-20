"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
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

      <div className="relative z-10 glass-card p-12 rounded-3xl text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
        <p className="text-foreground/70 mb-8">Thank you for your purchase. Your order has been confirmed.</p>

        <div className="space-y-3">
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">View Orders</Button>
          </Link>
          <Link href="/marketplace" className="block">
            <Button
              variant="outline"
              className="w-full border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
