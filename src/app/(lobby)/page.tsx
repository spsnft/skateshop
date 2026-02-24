"use client"
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"
import { cn } from "@/lib/utils"

// Карта премиальных стилей
const GRADE_STYLES: Record<string, { border: string, text: string, shadow: string, bg: string }> = {
  "Golden grade": { 
    border: "border-[#FEC107]/50", 
    text: "text-[#FEC107]", 
    shadow: "shadow-[#FEC107]/10",
    bg: "from-[#FEC107]/20 to-transparent" 
  },
  "Silver grade": { 
    border: "border-[#C1C1C1]/40", 
    text: "text-[#C1C1C1]", 
    shadow: "shadow-[#C1C1C1]/5",
    bg: "from-[#C1C1C1]/10 to-transparent"
  },
  "Selected Premium": { 
    border: "border-[#5CE1E6]/50", 
    text: "text-[#5CE1E6]", 
    shadow: "shadow-[#5CE1E6]/15",
    bg: "from-[#5CE1E6]/15 to-transparent"
  },
  "Premium grade": { 
    border: "border-[#193D2E]/60", 
    text: "text-[#34D399]", 
    shadow: "shadow-[#193D2E]/10",
    bg: "from-[#193D2E]/20 to-transparent"
  },
  "Hash Fresh frozen premium": { 
    border: "border-[#5CE1E6]/50", 
    text: "text-[#5CE1E6]", 
    shadow: "shadow-[#5CE1E6]/15",
    bg: "from-[#5CE1E6]/10 to-transparent" 
  },
  "Live Rosin premium": { 
    border: "border-[#693A7B]/60", 
    text: "text-[#A855F7]", 
    shadow: "shadow-[#693A7B]/20",
    bg: "from-[#693A7B]/20 to-transparent" 
  },
  "Hash old school": { 
    border: "border-[#402917]/80", 
    text: "text-[#D2B48C]", 
    shadow: "shadow-[#402917]/10",
    bg: "from-[#402917]/30 to-transparent" 
  }
}

function ProductCard({ product }: { product: any }) {
  const [selectedWeight, setSelectedWeight] = React.useState<string>("1")
  const currentPrice = product.prices?.[selectedWeight] || product.price
  
  const fileName = product.image ? product.image.split('/').pop() : null
  const imageUrl = fileName ? `/images/${fileName}` : null

  // Определяем стиль на основе подкатегории или категории
  const style = GRADE_STYLES[product.subcategory] || GRADE_STYLES[product.category] || {
    border: "border-white/5",
    text: "text-white",
    shadow: "shadow-transparent",
    bg: "from-white/5 to-transparent"
  }

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 bg-[#0f0f0f] p-3 sm:p-4",
      style.border,
      "hover:shadow-[0_0_30px_-10px] shadow-2xl",
      style.shadow,
      "hover:-translate-y-1"
    )}>
      {/* Цветной градиент на фоне для "богатства" */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.03] pointer-events-none", style.bg)} />

      {/* Метка грейда */}
      {product.subcategory && (
        <div className="absolute top-4 left-4 z-10">
          <span className={cn(
            "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border",
            style.text,
            style.border,
            "bg-black/60 backdrop-blur-md"
          )}>
            {product.subcategory}
          </span>
        </div>
      )}

      <div className="aspect-square overflow-hidden rounded-xl bg-neutral-900 mb-4 relative z-0">
        <img 
          src={imageUrl || '/product-placeholder.webp'} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col flex-1 space-y-3 relative z-10">
        <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-[#34D399] transition-colors uppercase italic tracking-tight">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-1">
          <span className={cn("text-2xl font-black tracking-tighter", style.text)}>{currentPrice}</span>
          <span className="text-[10px] font-bold opacity-40 uppercase">THB</span>
        </div>
        
        <div className="flex gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
          {["1", "5", "10", "20"].map((w) => (
            <button key={w} onClick={() => setSelectedWeight(w)} className={cn(
              "flex-1 py-1.5 text-[10px] font-black rounded transition-all",
              selectedWeight === w ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"
            )}>{w}g</button>
          ))}
        </div>

        <button className={cn(
          "w-full mt-2 py-3 text-black text-[11px] font-black rounded-xl transition-all active:scale-95 shadow-lg uppercase tracking-widest",
          "bg-[#34D399] hover:brightness-110"
        )}>
          Add to Cart
        </button>
      </div>
    </div>
  )
}

// ... (остальной код IndexPage остается как в прошлом ответе)
