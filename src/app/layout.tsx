import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  themeColor: "#193D2E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "BND Delivery",
  description: "Premium Service",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body style={{ backgroundColor: '#193D2E' }} className="min-h-screen antialiased text-white selection:bg-emerald-500/30">
        {children}
      </body>
    </html>
  )
}
