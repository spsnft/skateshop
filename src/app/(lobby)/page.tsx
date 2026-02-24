import { getProducts } from "@/lib/fetchers/product"

export default async function IndexPage() {
  const products = await getProducts()

  return (
    <div className="container py-8">
      {/* Настройка grid: 1 колонка на мобиле, 3 на планшете, 4 на десктопе */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products && products.length > 0 ? (
          products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-neutral-500">
            Товары загружаются...
          </div>
        )}
      </section>
    </div>
  )
}

// Переносим компонент карточки сюда для удобства, если не хочешь прыгать по файлам
import { ProductCard } from "@/components/cards/product-card"
