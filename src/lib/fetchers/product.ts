export async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
  try {
    const response = await fetch(`${baseUrl}?action=getInventory`, { cache: 'no-store' })
    const data = await response.json()
    
    // Мапим твои столбцы под формат сайта
    return data.map((item: any) => ({
      id: String(item.ID || item.Name),
      name: item.Name,
      category: item.Category,
      subcategory: item.Subcategory,
      price: item.Price_1g, // Базовая цена за 1г
      prices: {
        "1": item.Price_1g,
        "5": item.Price_5g,
        "10": item.Price_10g,
        "20": item.Price_20g
      },
      image: item.Photo ? `https://raw.githubusercontent.com/spsnft/skateshop/main/public/${item.Photo}.webp` : null,
      description: item.Description,
      stock: item.Stock
    }))
  } catch (error) {
    return []
  }
}