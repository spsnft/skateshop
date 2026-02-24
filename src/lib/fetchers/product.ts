export async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL

  try {
    // Добавляем случайное число, чтобы Vercel не брал старые данные из памяти
    const response = await fetch(`${baseUrl}?action=getInventory&t=${Date.now()}`, {
      cache: 'no-store' 
    })

    if (!response.ok) return []
    const data = await response.json()
    return data
  } catch (error) {
    return []
  }
}
