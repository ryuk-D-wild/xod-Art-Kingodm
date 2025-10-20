"use client"

import { useEffect, useState } from "react"

interface SellerStatsProps {
  data: any
}

export default function SellerStats({ data }: SellerStatsProps) {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalEarnings: 0,
    totalArt: 0,
    totalViews: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/seller/stats")
      if (res.ok) {
        setStats(await res.json())
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: "Total Sales", value: stats.totalSales, icon: "📊" },
        { label: "Total Earnings", value: `$${stats.totalEarnings.toFixed(2)}`, icon: "💰" },
        { label: "Art Published", value: stats.totalArt, icon: "🎨" },
        { label: "Total Views", value: stats.totalViews, icon: "👁️" },
      ].map((stat, i) => (
        <div key={i} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/70 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-primary mt-2">{stat.value}</p>
            </div>
            <div className="text-4xl opacity-50">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
