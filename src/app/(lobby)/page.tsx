import { getProducts } from "@/lib/fetchers/product"
import { Shell } from "@/components/shells/shell"
import { ProductCard } from "@/components/cards/product-card"

export default async function IndexPage() {
  const products = await getProducts()

  return (
    <Shell className="max-w-6xl">
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center">
            <h2 className="text-2xl font-bold">Товары не найдены</h2>
            <p className="text-muted-foreground">Проверьте связь с таблицей</p>
          </div>
        )}
      </section>
    </Shell>
  )
}