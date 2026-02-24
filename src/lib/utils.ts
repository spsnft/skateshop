import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// 1. Базовая функция стилей
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 2. Форматирование цены (теперь поддерживает THB по умолчанию)
export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "THB"
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { currency = "THB", notation = "standard" } = options

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 0,
  }).format(Number(price))
}

// 3. Форматирование чисел и байтов
export function formatNumber(number: number | string) {
  return new Intl.NumberFormat("en-US").format(Number(number))
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const result = (bytes / Math.pow(1024, i)).toFixed(decimals)
  return `${result} ${
    sizeType === "accurate" ? accurateSizes[i] : sizes[i]
  }`
}

// 4. Работа с текстом и ссылками (slugify)
export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export function unslugify(str: string) {
  return str.replace(/-/g, " ")
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

// 5. Работа с URL и ID
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formatId(id: number | string) {
  return `#${id}`
}

// 6. Заглушки для авторизации (чтобы не падал Clerk)
export function getUserEmail(user: any) {
  return user?.emailAddresses?.[0]?.emailAddress ?? ""
}

// 7. Проверки системы
export function isMacOs() {
  if (typeof window === "undefined") return false
  return window.navigator.userAgent.includes("Mac")
}

export function idGenerator() {
  return Math.random().toString(36).substr(2, 9)
}
