import { getProducts } from "@/lib/fetchers/product"

// Компонент карточки теперь живет прямо здесь
function ProductCard({ product }: { product: any }) {
  // Мы не можем использовать useState в серверном компоненте, 
  // поэтому пока сделаем статичную карточку, чтобы просто запуститься.
  const imageUrl = product.image ? `/images/${product.image}` : null
  const isGold = product.category?.toLowerCase().includes("gold")

  return (
    <div className={`group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 bg-[#121212] p-2 sm:p-3 ${
      isGold ? "border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.15)]" : "border-neutral-800"
    }`}>
      <div className="aspect-square overflow-hidden rounded-lg bg-neutral-900 mb-2">
        <img 
          src={imageUrl || "/images/placeholder.png"} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1">{product.name}</h3>
          <span className="text-[#FFD700] font-mono font-bold text-sm sm:text-base">{product.price}฿</span>
        </div>
        <button className="w-full mt-auto bg-[#34D399] text-black text-[10px] sm:text-xs font-bold py-2 rounded-md">
          VIEW DETAILS
        </button>
      </div>
    </div>
  )
}

export default async function IndexPage() {
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {products?.length > 0 ? (
          products.map((product: any) => (
            <ProductCard key={product.id || product.name} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-neutral-500">
            Товары загружаются из таблицы...
          </div>
        )}
      </section>
    </div>
  )
}
