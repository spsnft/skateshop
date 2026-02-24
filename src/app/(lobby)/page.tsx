"use client"
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"

const GRADE_STYLES: Record<string, { color: string, border: string, bg: string, shadow: string }> = {
  "silver grade": { color: "#C1C1C1", border: "border-[#C1C1C1]/50", bg: "from-[#C1C1C1]/20", shadow: "shadow-[#C1C1C1]/20" },
  "golden grade": { color: "#FEC107", border: "border-[#FEC107]/60", bg: "from-[#FEC107]/30", shadow: "shadow-[#FEC107]/30" },
  "premium grade": { color: "#193D2E", border: "border-[#193D2E]/80", bg: "from-[#193D2E]/40", shadow: "shadow-[#193D2E]/20" },
  "selected premium": { color: "#5CE1E6", border: "border-[#5CE1E6]/70", bg: "from-[#5CE1E6]/30", shadow: "shadow-[#5CE1E6]/40" },
  "hash old school": { color: "#402917", border: "border-[#402917]/80", bg: "from-[#402917]/40", shadow: "shadow-[#402917]/20" },
  "hash fresh frozen": { color: "#3F999C", border: "border-[#3F999C]/70", bg: "from-[#3F999C]/30", shadow: "shadow-[#3F999C]/20" },
  "hash fresh frozen premium": { color: "#5CE1E6", border: "border-[#5CE1E6]/70", bg: "from-[#5CE1E6]/30", shadow: "shadow-[#5CE1E6]/40" },
  "live rosin premium": { color: "#693A7B", border: "border-[#693A7B]/80", bg: "from-[#693A7B]/40", shadow: "shadow-[#693A7B]/30" },
}

// Универсальная функция получения стиля
const getStyle = (val: string) => {
  const key = String(val || "").toLowerCase().trim();
  return GRADE_STYLES[key] || { color: "#34D399", border: "border-white/10", bg: "from-white/5", shadow: "shadow-transparent" };
}

function ProductCard({ product, onOpen }: { product: any, onOpen: (p: any) => void }) {
  const [selectedWeight, setSelectedWeight] = React.useState<string>("1")
  const currentPrice = product.prices?.[selectedWeight] || product.price
  
  // Проверяем стиль и по подкатегории, и по категории
  const style = getStyle(product.subcategory) || getStyle(product.category);
  const imageUrl = product.image ? `/images/${product.image.split('/').pop()}` : '/product-placeholder.webp'

  return (
    <div 
      className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 transition-all duration-500 bg-[#0f0f0f] p-3 sm:p-4 hover:-translate-y-1 ${style.border} ${style.shadow} hover:shadow-2xl`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br opacity-[0.08] pointer-events-none ${style.bg} to-transparent`} />
      
      <div className="aspect-square overflow-hidden rounded-xl bg-neutral-900 mb-4 cursor-pointer relative z-10" onClick={() => onOpen(product)}>
        <img src={imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>

      <div className="flex flex-col flex-1 space-y-3 relative z-10 text-left">
        <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 uppercase italic tracking-tight" onClick={() => onOpen(product)}>
          {product.name}
        </h3>
        <div className="text-2xl font-black" style={{ color: style.color }}>{currentPrice}฿</div>
        
        <div className="flex gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
          {["1", "5", "10", "20"].map((w) => (
            <button key={w} onClick={() => setSelectedWeight(w)} className={`flex-1 py-1.5 text-[10px] font-black rounded transition-all ${selectedWeight === w ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"}`}>{w}g</button>
          ))}
        </div>
        <button 
           className="w-full mt-2 py-3 text-black text-[11px] font-black rounded-xl uppercase tracking-widest active:scale-95 transition-all shadow-lg"
           style={{ backgroundColor: style.color }}
        >
            Добавить
        </button>
      </div>
    </div>
  )
}

export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeCategory, setActiveCategory] = React.useState<string>("Buds")
  const [activeSub, setActiveSub] = React.useState<string>("All")
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null)

  React.useEffect(() => {
    getProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  const subcategories = ["All", ...Array.from(new Set(products.filter(p => p.category === activeCategory).map(p => p.subcategory).filter(Boolean)))]
  const filteredProducts = products.filter(p => (p.category === activeCategory) && (activeSub === "All" || p.subcategory === activeSub))

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10 text-center space-y-8">
            <h1 className="text-2xl font-black uppercase tracking-[0.3em] opacity-10 italic">Inventory</h1>
            
            <div className="flex flex-wrap justify-center gap-3">
              {!loading && categories.map(cat => (
                <button 
                    key={cat as string} 
                    onClick={() => { setActiveCategory(cat as string); setActiveSub("All"); }} 
                    className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "border-white/10 text-white/40 hover:border-white/30"}`}
                >
                    {cat as string}
                </button>
              ))}
            </div>

            {!loading && subcategories.length > 1 && (
              <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-white/5">
                {subcategories.map(sub => {
                   const s = getStyle(sub as string)
                   const isActive = activeSub === sub
                   return (
                    <button
                      key={sub as string}
                      onClick={() => setActiveSub(sub as string)}
                      className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-1`}
                      style={{ color: isActive ? s.color : 'rgba(255,255,255,0.2)' }}
                    >
                      {sub as string}
                      {isActive && <div className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: s.color }} />}
                    </button>
                   )
                })}
              </div>
            )}
        </header>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {loading ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />) : filteredProducts.map((p) => <ProductCard key={p.id} product={p} onOpen={setSelectedProduct} />)}
        </section>
      </div>

      {/* --- МОДАЛКА --- */}
      {selectedProduct && (() => {
        const s = getStyle(selectedProduct.subcategory || selectedProduct.category)
        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md transition-all animate-in fade-in duration-300" onClick={() => setSelectedProduct(null)}>
            <div className="bg-[#0f0f0f] w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[2rem] border-t sm:border border-white/10 overflow-hidden relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white/50 transition-colors">✕</button>
              
              <div className="aspect-[4/3] w-full bg-neutral-900 relative">
                 <img src={selectedProduct.image ? `/images/${selectedProduct.image.split('/').pop()}` : '/product-placeholder.webp'} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
              </div>

              <div className="p-8 sm:p-10 -mt-12 relative z-10 space-y-6 text-left">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: s.color }}>{selectedProduct.subcategory}</span>
                  <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-white">{selectedProduct.name}</h2>
                </div>
                
                <p className="text-white/50 text-sm sm:text-base leading-relaxed font-medium">
                  {selectedProduct.description || "Premium quality product curated for the best experience."}
                </p>

                <div className="pt-8 flex flex-col sm:flex-row items-center gap-6 border-t border-white/5">
                  <div className="flex flex-col items-center sm:items-start">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Price</span>
                    <div className="text-4xl font-black" style={{ color: s.color }}>{selectedProduct.price}฿</div>
                  </div>
                  <button className="flex-1 w-full py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl transition-transform active:scale-95" style={{ backgroundColor: s.color, color: '#000' }}>
                    Заказать
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
