import * as React from "react"
import { Lobby } from "./_components/lobby"
import { LobbySkeleton } from "./_components/lobby-skeleton"

// Это функция-заглушка, пока мы не настроили реальный импорт из таблицы
async function getTableProducts() {
  const GOOGLE_SCRIPT_URL = "ТВОЯ_ССЫЛКА_ИЗ_APPS_SCRIPT" // Мы вставим её следующим шагом
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, { next: { revalidate: 60 } })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

export default async function IndexPage() {
  // Запускаем получение товаров
  const productsPromise = getTableProducts()
  
  // Категории пока оставим пустым массивом или статикой, 
  // Lobby их подхватит
  const categoriesPromise = Promise.resolve([])
  const storesPromise = Promise.resolve([])
  const githubStarsPromise = Promise.resolve(0)

  return (
    <React.Suspense fallback={<LobbySkeleton />}>
      <Lobby
        githubStarsPromise={githubStarsPromise}
        productsPromise={productsPromise}
        categoriesPromise={categoriesPromise}
        storesPromise={storesPromise}
      />
    </React.Suspense>
  )
}