import * as React from "react"
import { cn } from "@/lib/utils"
import { ContentSection } from "@/components/content-section"
import { ProductCard } from "@/components/product-card"
import { Shell } from "@/components/shell"

interface LobbyProps {
  productsPromise: Promise<any[]>
  // Остальные пропсы оставляем для совместимости, но не используем
  githubStarsPromise?: any
  categoriesPromise?: any
  storesPromise?: any
}

export async function Lobby({
  productsPromise,
}: LobbyProps) {
  const allProducts = await productsPromise

  // Группируем товары по Категории из таблицы (Buds, Concentrates и т.д.)
  const categories = Array.from(new Set(allProducts.map((p: any) => p.Category)))

  return (
    <Shell className="max-w-6xl gap-0 pb-20">
      {/* Логотип или заголовок вместо баннера */}
      <div className="py-10 text-center">
         <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            BND <span className="text-brand-selected text-2xl not-italic">Delivery</span>
         </h1>
         <p className="text-neutral-500 mt-2">Premium quality only</p>
      </div>

      {categories.map((category: string) => {
        const categoryProducts = allProducts.filter((p: any) => p.Category === category)
        
        return (
          <ContentSection
            key={category}
            title={category}
            description={`Premium selection of ${category.toLowerCase()}`}
            href="#"
            linkText=""
            className="pt-10"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryProducts.map((item: any, index: number) => {
                // Преобразуем данные из таблицы в формат, который понимает наша ProductCard
                const formattedProduct = {
                  id: index.toString(),
                  name: item.Name,
                  price: item.Price_1g, // По умолчанию ставим цену за 1г
                  category: item.Subcategory, // Чтобы работала логика цветов (Silver/Gold)
                  images: [{ url: item.Photo || "/images/product-placeholder.webp", name: item.Name }],
                  inventory: 1
                }
                
                return (
                  <ProductCard 
                    key={index} 
                    product={formattedProduct} 
                  />
                )
              })}
            </div>
          </ContentSection>
        )
      })}
    </Shell>
  )
}