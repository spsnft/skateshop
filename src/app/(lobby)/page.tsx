"use client"
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"

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

  const style = GRADE_STYLES[product.subcategory] || GRADE_STYLES[product.category] || {
    border: "border-white/5",
    text: "text-white",
    shadow: "shadow-transparent",
    bg: "from-white/5 to-transparent"
  }

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 bg-[#0f0f0f] p-3 sm:p-4 hover:shadow-[0_0_30px_-10px] shadow-2xl hover:-translate-y-1 ${style.border} ${style.shadow}`}>
      <div className={`absolute inset-0 bg-gradient-to-br opacity-[0.03] pointer-events-none ${style.bg}`} />
      
      {product.subcategory && (
        <div className="absolute top-4 left-4 z-10">
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border bg-black/60 backdrop-blur-md ${style.text} ${style.border}`}>
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
          <span className={`text-2xl font-black tracking-tighter ${style.text}`}>{currentPrice}</span>
          <span className="text-[10px] font-bold opacity-40 uppercase">THB</span>
        </div>
        <div className="flex gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
          {["1", "5", "10", "20"].map((w) => (
            <button key={w} onClick={() => setSelectedWeight(w)} className={`flex-1 py-1.5 text-[10px] font-black rounded transition-all ${selectedWeight === w ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"}`}>
              {w}g
            </button>
          ))}
        </div>
        <button className="w-full mt-2 py-3 bg-[#34D399] hover:brightness-110 text-black text-[11px] font-black rounded-xl transition-all active:scale-95 shadow-lg uppercase tracking-widest">
          Купить
        </button>
      </div>
    </div>
  )
}

export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([])
  const [activeCategory, setActiveCategory] = React.useState<string>("All")
  const [activeSub, setActiveSub] = React.useState<string>("All")

  React.useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]
  const subcategories = ["All", ...Array.from(new Set(products
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .map(p => p.subcategory)
    .filter(Boolean)
  ))]

  const filteredProducts = products.filter(p => {
    const catMatch = activeCategory === "All" || p.category === activeCategory
    const subMatch = activeSub === "All" || p.subcategory === activeSub
    return catMatch && subMatch
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10 text-center space-y-6">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Store</h1>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat as string}
                onClick={() => { setActiveCategory(cat as string); setActiveSub("All"); }}
                className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${activeCategory === cat ? "bg-[#34D399] border-[#34D399] text-black shadow-[0_0_20px_rgba(52,211,153,0.3)]" : "border-white/10 text-white/40 hover:border-white/30"}`}
              >
                {cat as string}
              </button>
            ))}
          </div>
          {subcategories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-white/5">
              {subcategories.map(sub => (
                <button
                  key={sub as string}
                  onClick={() => setActiveSub(sub as string)}
                  className={`text-[11px] font-black uppercase tracking-widest transition-all ${activeSub === sub ? "text-[#FFD700]" : "text-white/20 hover:text-white/50"}`}
                >
                  {sub as string}
                </button>
              ))}
            </div>
          )}
        </header>
        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id || product.name} product={product} />
          ))}
        </section>
      </div>
    </div>
  )
}
