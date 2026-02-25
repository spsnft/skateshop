export async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
  
  try {
    // Меняем no-store на revalidate: 60 для скорости и автообновления
    const response = await fetch(`${baseUrl}?action=getInventory`, { 
      next: { revalidate: 60 } 
    })
    const data = await response.json()
    
    // Сначала фильтруем: оставляем только те, где Stock больше 0
    // Также проверяем, чтобы Stock вообще был указан
    return data
      .filter((item: any) => item.Stock !== undefined && Number(item.Stock) > 0)
      .map((item: any) => ({
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
        image: item.Photo || null, 
        description: item.Description,
        stock: Number(item.Stock)
      }))
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error)
    return []
  }
}
