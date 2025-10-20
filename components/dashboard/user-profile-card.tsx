"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface UserProfileCardProps {
  user: any
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  const { user: clerkUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="glass-card p-8 rounded-3xl space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1 mb-4">
          <img
            src={clerkUser?.imageUrl || "/placeholder.svg?height=96&width=96&query=user+avatar"}
            alt={clerkUser?.fullName || "User"}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{clerkUser?.fullName}</h2>
        <p className="text-sm text-foreground/70">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
      </div>

      {/* Stats */}
      <div className="space-y-3 border-t border-white/10 pt-6">
        <div className="flex justify-between items-center">
          <span className="text-foreground/70">Member Since</span>
          <span className="font-semibold text-foreground">
            {clerkUser?.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-foreground/70">Account Status</span>
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">Active</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 border-t border-white/10 pt-6">
        <Link href="/dashboard/profile" className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Edit Profile</Button>
        </Link>
        <Link href="/dashboard/settings" className="w-full">
          <Button
            variant="outline"
            className="w-full border-primary/50 text-foreground hover:bg-white/10 bg-transparent"
          >
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}
