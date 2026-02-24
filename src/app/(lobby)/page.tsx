"use client"
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"
import { cn } from "@/lib/utils"

// Выносим ProductCard в отдельный компонент выше для чистоты
function ProductCard({ product }: { product: any }) {
  const [selectedWeight, setSelectedWeight] = React.useState<string>("1")
  const currentPrice = product.prices?.[selectedWeight] || product.price
  const fileName = product.image ? product.image.split('/').pop() : null
  const imageUrl = fileName ? `/images/${fileName}` : null
  const isGold = product.category?.toLowerCase().includes("gold")

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 bg-[#121212] p-3 sm:p-4",
      isGold ? "border-[#FFD700]/40 shadow-lg shadow-[#FFD700]/5" : "border-white/5 hover:border-white/10"
    )}>
      {/* Картинка и остальной дизайн как был */}
      <div className="aspect-square overflow-hidden rounded-xl bg-neutral-900 mb-4 relative">
        <img 
          src={imageUrl || '/product-placeholder.webp'} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {isGold && <div className="absolute top-2 left-2 bg-[#FFD700] text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Premium</div>}
      </div>
      <div className="flex flex-col flex-1 space-y-3">
        <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">{product.name}</h3>
        <div className="text-xl font-black text-[#FFD700]">{currentPrice}฿</div>
        
        <div className="flex gap-1.5 p-1 bg-white/5 rounded-lg">
          {["1", "5", "10", "20"].map((w) => (
            <button key={w} onClick={() => setSelectedWeight(w)} className={cn(
              "flex-1 py-1 text-[10px] font-bold rounded-md transition-all",
              selectedWeight === w ? "bg-white text-black" : "text-white/40 hover:text-white/70"
            )}>{w}g</button>
          ))}
        </div>
        <button className="w-full mt-2 py-2.5 bg-[#34D399] text-black text-xs font-black rounded-lg uppercase">Добавить</button>
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

  // Получаем уникальные категории и подкатегории из твоей таблицы
  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))]
  const subcategories = ["All", ...new Set(products
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .map(p => p.subcategory)
    .filter(Boolean)
  )]

  const filteredProducts = products.filter(p => {
    const catMatch = activeCategory === "All" || p.category === activeCategory
    const subMatch = activeSub === "All" || p.subcategory === activeSub
    return catMatch && subMatch
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        
        {/* Хедер с Категориями (Main Tabs) */}
        <header className="mb-10 text-center space-y-6">
          <h1 className="text-5xl font-black tracking-tighter italic italic tracking-tighter uppercase italic">Store</h1>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setActiveSub("All"); }}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold border transition-all",
                  activeCategory === cat 
                    ? "bg-[#34D399] border-[#34D399] text-black shadow-[0_0_20px_rgba(52,211,153,0.3)]" 
                    : "border-white/10 text-white/40 hover:border-white/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Подкатегории (Sub Tabs) — появляются если выбрана категория или есть подкатегории */}
          {subcategories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-white/5">
              {subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveSub(sub)}
                  className={cn(
                    "text-[11px] font-black uppercase tracking-widest transition-all",
                    activeSub === sub ? "text-[#FFD700]" : "text-white/20 hover:text-white/50"
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Сетка товаров */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id || product.name} product={product} />
          ))}
        </section>
      </div>
    </div>
  )
}