"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { type Product } from "@/db/schema"
import { EyeOpenIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

import { cn, formatPrice } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlaceholderImage } from "@/components/placeholder-image"

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Pick<Product, "id" | "name" | "price" | "images" | "inventory"> & {
    category: string | null
  }
}

export function ProductCard({
  product,
  className,
  ...props
}: ProductCardProps) {
  const [weight, setWeight] = React.useState<number>(1)
  
  // Логика определения стиля по категории
  const isGolden = product.category?.toLowerCase().includes("golden")
  const isSelected = product.category?.toLowerCase().includes("selected")

  const presets = [1, 3, 5, 10]

  return (
    <Card
      className={cn(
        "size-full overflow-hidden rounded-xl border-2 transition-all duration-300 bg-[#121212]",
        isGolden ? "border-brand-gold shadow-gold-glow" : "border-neutral-800",
        isSelected && "border-brand-selected shadow-selected-glow",
        className
      )}
      {...props}
    >
      <Link aria-label={product.name} href={`/product/${product.id}`}>
        <CardHeader className="p-0">
          <AspectRatio ratio={1 / 1}>
            {product.images?.length ? (
              <Image
                src={product.images[0]?.url ?? "/images/product-placeholder.webp"}
                alt={product.name}
                className="object-cover transition-transform hover:scale-105"
                fill
                loading="lazy"
              />
            ) : (
              <PlaceholderImage />
            )}
          </AspectRatio>
        </CardHeader>
      </Link>

      <CardContent className="space-y-3 p-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="line-clamp-1 text-lg font-bold text-white">
            {product.name}
          </CardTitle>
          <div className="text-brand-gold font-mono font-bold">
            {product.price}฿
          </div>
        </div>

        {/* Выбор веса (Пресеты) */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setWeight(p)}
              className={cn(
                "px-2 py-1 text-xs rounded-md border transition-all",
                weight === p 
                  ? "bg-brand-selected border-brand-selected text-black font-bold" 
                  : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
              )}
            >
              {p}g
            </button>
          ))}
        </div>

        {/* Кастомный степпер */}
        <div className="flex items-center justify-between bg-black/40 rounded-lg p-1 border border-neutral-800">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white"
            onClick={() => setWeight(Math.max(0.5, weight - 0.5))}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm font-bold text-brand-selected">{weight}g</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white"
            onClick={() => setWeight(weight + 0.5)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          className="w-full bg-brand-buds hover:bg-brand-buds/80 text-white font-bold"
          onClick={() => {
            toast.success(`Added ${weight}g of ${product.name} to cart`)
          }}
        >
          Add to Order
        </Button>
        <Link
          href={`/preview/product/${product.id}`}
          className={cn(
            buttonVariants({
              variant: "secondary",
              size: "icon",
              className: "h-10 w-10 shrink-0 bg-neutral-800 border-neutral-700",
            })
          )}
        >
          <EyeOpenIcon className="h-5 w-5 text-white" />
        </Link>
      </CardFooter>
    </Card>
  )
}
