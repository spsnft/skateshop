export async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
  
  try {
    const response = await fetch(`${baseUrl}?action=getInventory`, { cache: 'no-store' })
    const data = await response.json()
    
    return data.map((item: any) => ({
      id: String(item.ID || item.Name),
      name: item.Name,
      category: item.Category,
      subcategory: item.Subcategory,
      price: item.Price_1g,
      prices: {
        "1": item.Price_1g,
        "5": item.Price_5g,
        "10": item.Price_10g,
        "20": item.Price_20g
      },
      // УПРОЩАЕМ: просто берем то, что ты написал в столбце Photo
      image: item.Photo || null, 
      description: item.Description,
      stock: item.Stock
    }))
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error)
    return []
  }
}
