export async function getProducts() {
  // Берем ссылку из тех настроек Vercel, что ты уже заполнил
  const baseUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL

  try {
    const response = await fetch(`${baseUrl}?action=getInventory`, {
      next: { revalidate: 0 }, 
    })

    if (!response.ok) {
      throw new Error("Ошибка связи с таблицей")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Товары не загружены:", error)
    return []
  }
}

export async function getProduct(productId: string) {
  const products = await getProducts()
  return products.find((p: any) => p.id === productId)
}
