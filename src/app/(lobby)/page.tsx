"use client"
import * as React from "react"
import { getProducts } from "@/lib/fetchers/product"

function ProductCard({ product }: { product: any }) {
  const [selectedWeight, setSelectedWeight] = React.useState<string>("1")
  
  const currentPrice = product.prices?.[selectedWeight] || product.price
  
  // Собираем путь: берем имя из таблицы и проверяем, есть ли там уже точка с расширением
  const imageName = product.image || ""
  const imageUrl = imageName.includes(".") 
    ? `/images/${imageName}` 
    : `/images/${imageName}.png`

  const isGold = product.category?.toLowerCase().includes("gold")

  return (
    <div className={`group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 bg-[#121212] p-2 sm:p-3 ${
      isGold ? "border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]" : "border-neutral-800"
    }`}>
      {/* Картинка */}
      <div className="aspect-square overflow-hidden rounded-lg bg-neutral-900 mb-2 relative">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
          onError={(e) => { 
            const target = e.target as HTMLImageElement
            // Если images/bndsmall.png не найден, пробуем корень public (на всякий случай)
            if (!target.src.includes('placeholder')) {
               target.src = `/${imageName}`
            }
          }}
        />
        {isGold && <div className="absolute top-1 left-1 bg-[#FFD700] text-black text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg">GOLD</div>}
      </div>

      <div className="flex flex-col flex-1 space-y-2">
        <div className="flex flex-col">
          <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1">{product.name}</h3>
          <span className="text-[#FFD700] font-mono font-bold text-sm sm:text-base">{currentPrice}฿</span>
        </div>

        {/* Кнопки выбора веса */}
        <div className="flex flex-wrap gap-1">
          {["1", "5", "10", "20"].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeight(w)}
              className={`px-1.5 py-0.5 text-[10px] rounded border transition-all ${
                selectedWeight === w ? "bg-[#FFD700] border-[#FFD700] text-black font-bold" : "border-neutral-700 text-neutral-400"
              }`}
            >
              {w}g
            </button>
          ))}
        </div>

        <button 
          className="w-full mt-auto bg-[#34D399] hover:bg-[#34D399]/90 text-black text-[10px] sm:text-xs font-bold py-2 rounded-md transition-colors"
          onClick={() => alert(`Added ${selectedWeight}g of ${product.name}`)}
        >
          ADD TO ORDER
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
    <div className="container mx-auto px-4 py-8">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {products.length > 0 ? (
          products.map((product: any) => (
            <ProductCard key={product.id || product.name} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-neutral-500 font-mono text-xs">
            CONNECTING TO INVENTORY...
          </div>
        )}
      </section>
    </div>
  )
}
