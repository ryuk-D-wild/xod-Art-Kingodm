"use client"

import { useEffect, useState } from "react"

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const res = await fetch("/api/orders")
      if (res.ok) {
        setPurchases(await res.json())
      }
    } catch (error) {
      console.error("Error fetching purchases:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-semibold text-foreground mb-4">Recent Purchases</h3>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-foreground/70">No purchases yet</p>
          <p className="text-sm text-foreground/50 mt-2">Start exploring the marketplace to find amazing art!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map((purchase: any) => (
            <div
              key={purchase._id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
            >
              <div>
                <p className="font-medium text-foreground">{purchase.title}</p>
                <p className="text-sm text-foreground/70">${purchase.amount}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary">{purchase.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
