import type { FooterItem, MainNavItem } from "@/types"
import { productConfig } from "@/config/product"
import { slugify } from "@/lib/utils"

export type SiteConfig = typeof siteConfig

const links = {
  // Твой ник прописан
  telegram: "https://t.me/spacenft", 
}

export const siteConfig = {
  name: "bnd",
  description:
    "Premium Phuket Delivery Service. Top-tier selection delivered to your door.",
  url: "https://app.bnd.delivery", 
  ogImage: "https://app.bnd.delivery/og-image.png",
  links,
  mainNav: [
    {
      title: "Lobby",
      items: [
        {
          title: "Inventory",
          href: "/",
          description: "Our current selection of premium products.",
          items: [],
        },
      ],
    },
  ] satisfies MainNavItem[],
  footerNav: [
    {
      title: "Support",
      items: [
        {
          title: "Contact Telegram",
          href: links.telegram,
          external: true,
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "Telegram",
          href: links.telegram,
          external: true,
        },
      ],
    },
  ] satisfies FooterItem[],
}
