"use client"
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"

function ProductCard({ product }: { product: any }) {
  const [selectedWeight, setSelectedWeight] = React.useState<string>("1")
  const currentPrice = product.prices?.[selectedWeight] || product.price
  
  const fileName = product.image ? product.image.split('/').pop() : null
  const imageUrl = fileName ? `/images/${fileName}` : null
  const isGold = product.category?.toLowerCase().includes("gold")

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 bg-gradient-to-b from-[#1a1a1a] to-[#121212] p-3 sm:p-4 ${
      isGold ? "border-[#FFD700]/50 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]" : "border-white/5 hover:border-white/20"
    } hover:-translate-y-1`}>
      
      {/* Метка категории */}
      <div className="absolute top-5 left-5 z-10 flex gap-2">
        {isGold && (
          <span className="bg-[#FFD700] text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
            Gold Edition
          </span>
        )}
      </div>

      {/* Изображение с мягким градиентом сверху */}
      <div className="aspect-square overflow-hidden rounded-xl bg-neutral-900 mb-4 relative">
        <img 
          src={imageUrl || '/product-placeholder.webp'} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).src = '/product-placeholder.webp' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-transparent to-transparent opacity-60" />
      </div>

      <div className="flex flex-col flex-1 space-y-3">
        <div>
          <h3 className="font-bold text-white text-base sm:text-lg tracking-tight line-clamp-1 group-hover:text-[#34D399] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#FFD700]">{currentPrice}</span>
            <span className="text-xs font-bold text-[#FFD700]/60 uppercase">THB</span>
          </div>
        </div>

        {/* Выбор веса — Премиальный вид */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
          {["1", "5", "10", "20"].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeight(w)}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                selectedWeight === w 
                ? "bg-white text-black shadow-xl" 
                : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              {w}g
            </button>
          ))}
        </div>

        <button 
          className="w-full mt-2 py-3 bg-[#34D399] hover:bg-[#4ade80] text-black text-[13px] font-black rounded-xl transition-all active:scale-95 shadow-[0_4px_14px_0_rgba(52,211,153,0.39)] uppercase tracking-tight"
          onClick={() => alert(`Заказ: ${product.name} ${selectedWeight}g`)}
        >
          В корзину
        </button>
      </div>
    </div>
  )
}

export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([])

  React.useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">
            FRESH BUDS
          </h1>
          <p className="text-white/40 font-medium tracking-widest uppercase text-[10px]">
            Directly from our inventory • Updated live
          </p>
        </header>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product.id || product.name} product={product} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-40 space-y-4">
              <div className="w-8 h-8 border-2 border-[#34D399] border-t-transparent rounded-full animate-spin" />
              <p className="text-white/20 font-mono text-[10px] tracking-widest uppercase">Synchronizing Inventory...</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
