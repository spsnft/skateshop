import { getProducts } from "@/lib/fetchers/product"
import { ProductCard } from "@/components/cards/product-card"

export default async function IndexPage() {
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {products?.length > 0 ? (
          products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
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