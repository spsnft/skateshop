export async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
  
  try {
    const response = await fetch(`${baseUrl}?action=getInventory`, { 
      next: { revalidate: 60 } 
    })
    const data = await response.json()
    
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
        // Столбец J теперь официально Type
        type: item.Description || item.Type || "", 
        stock: Number(item.Stock),
        badge: item.badge || item.Badge || null 
      }))
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error)
    return []
  }
}
