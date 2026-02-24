"use client"
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"

// --- Стили для грейдов ---
const GRADE_STYLES: Record<string, { border: string, text: string, shadow: string, bg: string }> = {
  "Golden grade": { border: "border-[#FEC107]/40", text: "text-[#FEC107]", shadow: "shadow-[#FEC107]/5", bg: "from-[#FEC107]/10 to-transparent" },
  "Silver grade": { border: "border-[#C1C1C1]/30", text: "text-[#C1C1C1]", shadow: "shadow-[#C1C1C1]/5", bg: "from-[#C1C1C1]/10 to-transparent" },
  "Selected Premium": { border: "border-[#5CE1E6]/40", text: "text-[#5CE1E6]", shadow: "shadow-[#5CE1E6]/10", bg: "from-[#5CE1E6]/10 to-transparent" },
  "Premium grade": { border: "border-[#193D2E]/50", text: "text-[#34D399]", shadow: "shadow-[#193D2E]/5", bg: "from-[#193D2E]/10 to-transparent" }
}

// --- Скелетон ---
function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-white/5 bg-[#121212] p-4 space-y-4 animate-pulse">
      <div className="aspect-square rounded-xl bg-white/5" />
      <div className="h-4 w-2/3 bg-white/5 rounded" />
      <div className="h-10 w-full bg-white/5 rounded-xl" />
    </div>
  )
}

// --- Компонент Карточки ---
function ProductCard({ product, onOpen }: { product: any, onOpen: (p: any) => void }) {
  const [selectedWeight, setSelectedWeight] = React.useState<string>("1")
  const currentPrice = product.prices?.[selectedWeight] || product.price
  const fileName = product.image ? product.image.split('/').pop() : null
  const imageUrl = fileName ? `/images/${fileName}` : null
  const style = GRADE_STYLES[product.subcategory] || GRADE_STYLES[product.category] || { border: "border-white/5", text: "text-white", shadow: "shadow-transparent", bg: "from-white/5 to-transparent" }

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 bg-[#0f0f0f] p-3 sm:p-4 hover:-translate-y-1 ${style.border} ${style.shadow}`}>
      <div className={`absolute inset-0 bg-gradient-to-br opacity-[0.03] pointer-events-none ${style.bg}`} />
      
      <div className="aspect-square overflow-hidden rounded-xl bg-neutral-900 mb-4 cursor-pointer" onClick={() => onOpen(product)}>
        <img src={imageUrl || '/product-placeholder.webp'} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>

      <div className="flex flex-col flex-1 space-y-3 relative z-10">
        <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 cursor-pointer hover:text-[#34D399]" onClick={() => onOpen(product)}>
          {product.name}
        </h3>
        <div className="text-xl font-black text-[#FFD700]">{currentPrice}฿</div>
        
        <div className="flex gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
          {["1", "5", "10", "20"].map((w) => (
            <button key={w} onClick={() => setSelectedWeight(w)} className={`flex-1 py-1.5 text-[10px] font-black rounded transition-all ${selectedWeight === w ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"}`}>{w}g</button>
          ))}
        </div>
        <button className="w-full mt-2 py-3 bg-[#34D399] text-black text-[11px] font-black rounded-xl uppercase tracking-widest active:scale-95 transition-all">Купить</button>
      </div>
    </div>
  )
}

// --- Главная страница ---
export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeCategory, setActiveCategory] = React.useState<string>("Buds")
  const [activeSub, setActiveSub] = React.useState<string>("All")
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null) // Для модалки

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
        <header className="mb-10 text-center space-y-6 italic uppercase tracking-tighter opacity-20">
            <h1 className="text-4xl font-black">Store</h1>
        </header>

        {/* Категории и подразделы (как в прошлый раз) */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {!loading && categories.map(cat => (
            <button key={cat as string} onClick={() => { setActiveCategory(cat as string); setActiveSub("All"); }} className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${activeCategory === cat ? "bg-[#34D399] border-[#34D399] text-black" : "border-white/10 text-white/40 hover:border-white/30"}`}>{cat as string}</button>
          ))}
        </div>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {loading ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />) : filteredProducts.map((p) => <ProductCard key={p.id} product={p} onOpen={setSelectedProduct} />)}
        </section>
      </div>

      {/* --- МОДАЛЬНОЕ ОКНО (DETAIL VIEW) --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="bg-[#121212] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 overflow-hidden relative animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/40 rounded-full text-white font-bold">✕</button>
            
            <div className="aspect-square w-full bg-neutral-900">
              <img src={selectedProduct.image ? `/images/${selectedProduct.image.split('/').pop()}` : '/product-placeholder.webp'} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#FFD700] tracking-[0.2em]">{selectedProduct.subcategory}</span>
                <h2 className="text-2xl font-black italic uppercase tracking-tight">{selectedProduct.name}</h2>
              </div>
              
              <p className="text-white/60 text-sm leading-relaxed">
                {selectedProduct.description || "У этого товара пока нет описания. Но мы гарантируем лучшее качество!"}
              </p>

              <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <div className="text-3xl font-black text-[#FFD700]">{selectedProduct.price}฿</div>
                <button className="bg-[#34D399] text-black px-8 py-3 rounded-xl font-black uppercase text-sm shadow-lg shadow-[#34D399]/20">Добавить</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
