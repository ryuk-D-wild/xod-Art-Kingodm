"use client"

import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
      <input
        type="text"
        placeholder="Search art by title, artist, or tag..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="glass-input w-full pl-12 pr-4 py-3 text-foreground placeholder-foreground/50"
      />
    </div>
  )
}
