import Link from "next/link"
import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/layouts/main-nav"
import { MobileNav } from "@/components/layouts/mobile-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />
        <MobileNav mainNavItems={siteConfig.mainNav} sidebarNavItems={[]} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {/* Мы временно убрали кнопку профиля, чтобы сайт заработал */}
          </nav>
        </div>
      </div>
    </header>
  )
}
