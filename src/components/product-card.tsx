"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: any }) {
  const [selectedWeight, setSelectedWeight] = React.useState<string>("1")
  const currentPrice = product.prices?.[selectedWeight] || product.price

  // Исправляем путь: добавляем .png (проверь расширение в своем GitHub!)
  const imageUrl = product.image ? `${product.image}.png` : null

  return (
    <div className={cn(
      "group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 bg-[#121212] p-3",
      product.category?.toLowerCase().includes("gold") ? "border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.2)]" : "border-neutral-800"
    )}>
      {/* Уменьшили область картинки */}
      <div className="aspect-square overflow-hidden rounded-lg bg-neutral-900 mb-3">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/spsnft/skateshop/main/public/img/placeholder.png' }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-neutral-600">No Img</div>
        )}
      </div>

      <div className="flex flex-col flex-1 space-y-2">
        <div className="flex flex-col">
          <h3 className="font-bold text-white text-sm line-clamp-1">{product.name}</h3>
          <span className="text-[#FFD700] font-mono font-bold text-base">{currentPrice}฿</span>
        </div>

        {/* Компактные кнопки веса */}
        <div className="flex flex-wrap gap-1.5">
          {["1", "5", "10", "20"].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeight(w)}
              className={cn(
                "px-2 py-0.5 text-[10px] rounded border transition-all",
                selectedWeight === w ? "bg-[#FFD700] border-[#FFD700] text-black font-bold" : "border-neutral-700 text-neutral-400"
              )}
            >
              {w}g
            </button>
          ))}
        </div>

        <button className="w-full mt-auto bg-[#34D399] hover:bg-[#34D399]/90 text-black text-[11px] font-bold py-1.5 rounded-md transition-colors">
          Add to Order
        </button>
      </div>
    </div>
  )
}
