"use client"
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"

// --- ТВОЯ ОБНОВЛЕННАЯ ПАЛИТРА (LIQUID GLASS STYLE) ---
const GRADE_STYLES: Record<string, { color: string, border: string, bg: string, glow: string }> = {
  // Buds
  "silver grade": { color: "#C1C1C1", border: "border-white/20", bg: "bg-white/5", glow: "shadow-white/5" },
  "golden grade": { color: "#FEC107", border: "border-[#FEC107]/40", bg: "bg-[#FEC107]/10", glow: "shadow-[#FEC107]/20" },
  "premium grade": { color: "#34D399", border: "border-[#34D399]/40", bg: "bg-[#193D2E]/40", glow: "shadow-[#34D399]/20" }, // Исправил: теперь ярче
  "selected premium": { color: "#5CE1E6", border: "border-[#5CE1E6]/40", bg: "bg-[#5CE1E6]/10", glow: "shadow-[#5CE1E6]/30" }, // Исправил: мягче
  
  // Concentrates (твои 4 категории)
  "hash old school": { color: "#D2B48C", border: "border-[#402917]/60", bg: "bg-[#402917]/50", glow: "shadow-[#402917]/20" },
  "hash fresh frozen": { color: "#3F999C", border: "border-[#3F999C]/50", bg: "bg-[#3F999C]/20", glow: "shadow-[#3F999C]/20" },
  "hash fresh frozen premium": { color: "#5CE1E6", border: "border-[#5CE1E6]/50", bg: "bg-[#5CE1E6]/20", glow: "shadow-[#5CE1E6]/40" },
  "live rosin premium": { color: "#A855F7", border: "border-[#693A7B]/60", bg: "bg-[#693A7B]/40", glow: "shadow-[#693A7B]/30" },
}

const getStyle = (val: string) => {
  const lowVal = String(val || "").toLowerCase().trim();
  // Сначала ищем прямое совпадение
  if (GRADE_STYLES[lowVal]) return GRADE_STYLES[lowVal];
  
  // Если не нашли, ищем по ключевым словам для надежности
  if (lowVal.includes("old school")) return GRADE_STYLES["hash old school"];
  if (lowVal.includes("frozen premium")) return GRADE_STYLES["hash fresh frozen premium"];
  if (lowVal.includes("frozen")) return GRADE_STYLES["hash fresh frozen"];
  if (lowVal.includes("rosin")) return GRADE_STYLES["live rosin premium"];
  
  return { color: "#34D399", border: "border-white/10", bg: "bg-white/5", glow: "shadow-transparent" };
}

function ProductCard({ product, onOpen }: { product: any, onOpen: (p: any) => void }) {
  const [selectedWeight, setSelectedWeight] = React.useState<string>("1")
  const currentPrice = product.prices?.[selectedWeight] || product.price
  const style = getStyle(product.subcategory || product.category);
  const imageUrl = product.image ? `/images/${product.image.split('/').pop()}` : '/product-placeholder.webp'

  return (
    <div 
      className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border transition-all duration-700 p-3 sm:p-5 hover:-translate-y-2 backdrop-blur-2xl ${style.bg} ${style.border} ${style.glow} hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]`}
    >
      {/* Эффект блика на стекле */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="aspect-square overflow-hidden rounded-[2rem] bg-black/60 mb-5 cursor-pointer relative z-10 border border-white/5 shadow-inner" onClick={() => onOpen(product)}>
        <img src={imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      </div>

      <div className="flex flex-col flex-1 space-y-4 relative z-10">
        <h3 className="font-black text-white/90 text-sm sm:text-base line-clamp-1 uppercase tracking-tighter italic" onClick={() => onOpen(product)}>
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tighter" style={{ color: style.color }}>{currentPrice}</span>
            <span className="text-[9px] font-bold opacity-30 uppercase">THB</span>
          </div>
        </div>
        
        <div className="flex gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md">
          {["1", "5", "10", "20"].map((w) => (
            <button key={w} onClick={() => setSelectedWeight(w)} className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${selectedWeight === w ? "bg-white text-black shadow-xl scale-105" : "text-white/20 hover:text-white/40"}`}>{w}g</button>
          ))}
        </div>

        <button 
          className="w-full mt-2 py-4 text-black text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] active:scale-95 transition-all shadow-2xl"
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
    <div className="min-h-screen bg-[#050505] text-white pb-20 font-sans selection:bg-white/10">
      {/* Динамическое фоновое свечение */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-full h-[600px] bg-white/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="mb-16 text-center space-y-12">
            <div className="space-y-2">
                <h1 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30">Premium Selection</h1>
                <div className="h-px w-12 bg-white/20 mx-auto" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {!loading && categories.map(cat => (
                <button 
                    key={cat as string} 
                    onClick={() => { setActiveCategory(cat as string); setActiveSub("All"); }} 
                    className={`px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border transition-all duration-500 ${activeCategory === cat ? "bg-white text-black border-white shadow-2xl scale-105" : "border-white/5 text-white/20 hover:border-white/20 hover:bg-white/5"}`}
                >
                    {cat as string}
                </button>
              ))}
            </div>

            {!loading && subcategories.length > 1 && (
              <div className="flex flex-wrap justify-center gap-10 pt-10 border-t border-white/5">
                {subcategories.map(sub => {
                   const s = getStyle(sub as string)
                   const isActive = activeSub === sub
                   return (
                    <button
                      key={sub as string}
                      onClick={() => setActiveSub(sub as string)}
                      className="text-[10px] font-black uppercase tracking-[0.3em] transition-all relative py-2"
                      style={{ color: isActive ? s.color : 'rgba(255,255,255,0.15)' }}
                    >
                      {sub as string}
                      {isActive && <div className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: s.color }} />}
                    </button>
                   )
                })}
              </div>
            )}
        </header>

        <section className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:gap-10">
          {loading ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-[2.5rem] bg-white/5 animate-pulse" />) : filteredProducts.map((p) => <ProductCard key={p.id} product={p} onOpen={setSelectedProduct} />)}
        </section>
      </div>

      {/* Модалка Detail View */}
      {selectedProduct && (() => {
        const s = getStyle(selectedProduct.subcategory || selectedProduct.category)
        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-500" onClick={() => setSelectedProduct(null)}>
            <div className="bg-[#080808]/80 w-full max-w-4xl rounded-t-[3.5rem] sm:rounded-[4rem] border sm:border-white/10 overflow-hidden relative shadow-2xl flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 z-30 w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white/50 transition-all backdrop-blur-md">✕</button>
              
              <div className="w-full md:w-1/2 aspect-square relative group">
                 <img src={selectedProduct.image ? `/images/${selectedProduct.image.split('/').pop()}` : '/product-placeholder.webp'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-60" />
              </div>

              <div className="w-full md:w-1/2 p-12 sm:p-16 flex flex-col justify-center space-y-8 text-left relative">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: s.color }}>{selectedProduct.subcategory}</span>
                  <h2 className="text-5xl sm:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">{selectedProduct.name}</h2>
                </div>
                
                <p className="text-white/40 text-sm sm:text-base leading-relaxed font-medium italic">
                  {selectedProduct.description || "The ultimate choice for the most demanding palates. Experience excellence in every detail."}
                </p>

                <div className="pt-10 space-y-8">
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black tracking-tighter" style={{ color: s.color }}>{selectedProduct.price}</span>
                        <span className="text-sm font-bold text-white/20 uppercase tracking-widest">THB</span>
                    </div>
                    <button className="w-full py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-2xl transition-all active:scale-95 hover:brightness-110" style={{ backgroundColor: s.color, color: '#000' }}>
                        Добавить в корзину
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