"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: any }) {
  const [selectedWeight, setSelectedWeight] = React.useState<string>("1")
  
  // Берем цену из конкретного столбца в зависимости от выбора
  const currentPrice = product.prices[selectedWeight] || product.price

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border-2 transition-all duration-300 bg-[#121212] p-4",
      product.category?.toLowerCase().includes("gold") ? "border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]" : "border-neutral-800"
    )}>
      <div className="aspect-square overflow-hidden rounded-md bg-neutral-900 mb-4">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-500 text-xs">No Photo</div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-white text-lg line-clamp-1">{product.name}</h3>
          <span className="text-[#FFD700] font-mono font-bold text-lg">{currentPrice}฿</span>
        </div>

        {/* Выбор веса на основе твоих столбцов */}
        <div className="flex flex-wrap gap-2">
          {["1", "5", "10", "20"].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeight(w)}
              className={cn(
                "px-2 py-1 text-xs rounded-md border transition-all",
                selectedWeight === w ? "bg-[#FFD700] border-[#FFD700] text-black font-bold" : "border-neutral-700 text-neutral-400"
              )}
            >
              {w}g
            </button>
          ))}
        </div>

        <button className="w-full bg-[#34D399] hover:bg-[#34D399]/80 text-white font-bold py-2 rounded-lg transition-colors mt-2">
          Add to Order
        </button>
      </div>
    </div>
  )
}