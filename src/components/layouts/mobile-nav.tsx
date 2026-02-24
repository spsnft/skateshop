import * as React from "react"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function MainNav({ items }: { items?: any[] }) {
  return (
    <div className="hidden gap-6 lg:flex">
      <Link href="/" className="flex items-center space-x-2">
        <span className="hidden font-bold inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex gap-6">
        {items?.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm text-foreground/60"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
