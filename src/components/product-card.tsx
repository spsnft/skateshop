import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-4 shadow-sm transition-all hover:shadow-md">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden rounded-md bg-muted">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Нет фото
            </div>
          )}
        </div>
      </Link>
      <div className="mt-4 space-y-1">
        <h3 className="font-bold">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold">{formatPrice(product.price)}</span>
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          Купить
        </button>
      </div>
    </div>
  )
}