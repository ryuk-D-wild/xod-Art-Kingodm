"use client"

interface FilterPanelProps {
  category: string
  onCategoryChange: (category: string) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
}

export default function FilterPanel({ category, onCategoryChange, priceRange, onPriceChange }: FilterPanelProps) {
  const categories = ["All", "Digital Painting", "Photography", "3D Art", "Animation", "Illustration"]

  return (
    <div className="glass-card p-6 rounded-2xl space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat === "All" ? "" : cat}
                checked={category === (cat === "All" ? "" : cat)}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-foreground/80">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], Number.parseInt(e.target.value)])}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-sm text-foreground/70">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
