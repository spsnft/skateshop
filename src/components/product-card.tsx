"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: any }) {
  const [selectedWeight, setSelectedWeight] = React.useState<string>("1")
  
  // Берем цену для выбранного веса из объекта prices
  const currentPrice = product.prices?.[selectedWeight] || product.price

  // Берем имя файла из таблицы. Теперь оно должно включать расширение, например "test.png"
  const imageUrl = product.image ? `/images/${product.image}` : null

  return (
    <div className={cn(
      "group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 bg-[#121212] p-2 sm:p-3",
      product.category?.toLowerCase().includes("gold") 
        ? "border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.15)]" 
        : "border-neutral-800"
    )}>
      {/* Область картинки */}
      <div className="aspect-square overflow-hidden rounded-lg bg-neutral-900 mb-2">
        <img 
          src={imageUrl || "/images/placeholder.png"} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png' }}
        />
      </div>

      <div className="flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1">{product.name}</h3>
          <span className="text-[#FFD700] font-mono font-bold text-sm sm:text-base">{currentPrice}฿</span>
        </div>

        {/* Кнопки выбора веса (1g, 5g, 10g, 20g) */}
        <div className="flex flex-wrap gap-1 mb-3">
          {["1", "5", "10", "20"].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeight(w)}
              className={cn(
                "px-1.5 py-0.5 text-[10px] rounded border transition-all",
                selectedWeight === w 
                  ? "bg-[#FFD700] border-[#FFD700] text-black font-bold" 
                  : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
              )}
            >
              {w}g
            </button>
          ))}
        </div>

        <button className="w-full mt-auto bg-[#34D399] hover:bg-[#34D399]/90 text-black text-[10px] sm:text-xs font-bold py-2 rounded-md transition-colors">
          ADD
        </button>
      </div>
    </div>
  )
}
