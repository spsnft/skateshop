import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(Number(price))
}

export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", year: "numeric",
  }).format(new Date(date))
}

export function slugify(str: string) {
  return str.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
}

export function unslugify(str: string) {
  return str.replace(/-/g, " ")
}

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formatId(id: number | string) {
  return `#${id}`
}

export function getUserEmail(user: any) {
  return user?.emailAddresses?.[0]?.emailAddress ?? ""
}

export function isMacOs() {
  if (typeof window === "undefined") return false
  return window.navigator.userAgent.includes("Mac")
}

export function formatNumber(number: number | string) {
  return new Intl.NumberFormat("en-US").format(Number(number))
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${["Bytes", "KB", "MB", "GB"][i]}`
}
