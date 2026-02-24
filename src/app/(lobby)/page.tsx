import { getProducts } from "@/lib/fetchers/product"

export default async function IndexPage() {
  const products = await getProducts()

  return (
    <div className="container py-10">
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products && products.length > 0 ? (
          products.map((product: any) => (
            <div key={product.id} className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="mb-4 aspect-square w-full rounded-md object-cover"
                />
              )}
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{product.price} ฿</span>
                <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                  Купить
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <h2 className="text-2xl font-bold">Товары загружаются...</h2>
            <p className="text-muted-foreground">Если это висит долго — проверьте ссылку на таблицу</p>
          </div>
        )}
      </section>
    </div>
  )
}
