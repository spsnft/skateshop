function ProductCard({ product, onOpen }: { product: any, onOpen: (p: any) => void }) {
  const [weight, setWeight] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);
  const addItem = useCart(s => s.addItem);
  
  // Определяем сетку цен в зависимости от категории
  const priceGrids: Record<string, any> = {
    "silver grade": { 1: 150, 5: 700, 10: 1200, 20: 2000 },
    "golden grade": { 1: 250, 5: 1100, 10: 1700, 20: 3000 },
    "premium grade": { 1: 300, 5: 1300, 10: 2000, 20: 3500 },
    "selected premium": { 1: 350, 5: 1500, 10: 2500, 20: 4000 }
  };

  const style = GRADE_STYLES[String(product.subcategory || "").toLowerCase().trim()] || { color: "#34D399", bg: "bg-white/5", border: "border-white/10" };
  const grid = priceGrids[String(product.subcategory || "").toLowerCase().trim()] || priceGrids["premium grade"];

  // Функция динамического расчета цены (интерполяция)
  const calculatePrice = (w: number) => {
    if (w <= 1) return grid[1] * w;
    if (w <= 5) return grid[1] + (grid[5] - grid[1]) * ((w - 1) / 4);
    if (w <= 10) return grid[5] + (grid[10] - grid[5]) * ((w - 5) / 5);
    if (w <= 20) return grid[10] + (grid[20] - grid[10]) * ((w - 10) / 10);
    return (grid[20] / 20) * w;
  };

  const currentPrice = Math.round(calculatePrice(weight));

  return (
    <div className={`relative flex flex-col rounded-[2rem] border p-4 backdrop-blur-xl ${style.bg} ${style.border}`}>
      <div className="aspect-square relative overflow-hidden rounded-[1.6rem] bg-black/60 mb-4 cursor-pointer" onClick={() => onOpen(product)}>
        <img src={getImageUrl(product.image)} alt="" className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = "/product-placeholder.webp"} />
      </div>
      
      <div className="px-1 flex-1 text-left space-y-4">
        <div>
          <h3 className="font-bold text-white/90 text-[13px] uppercase italic truncate">{product.name}</h3>
          <div className="text-3xl font-black tracking-tighter" style={{ color: style.color }}>{currentPrice}฿</div>
        </div>

        {/* СЛАЙДЕР ВЕСА */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-white/30 italic">Select Weight:</span>
            <span className="text-lg font-black text-white italic">{weight}g</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="20" 
            step="0.5" 
            value={weight} 
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
          {/* БЫСТРЫЕ КНОПКИ */}
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 5, 10, 20].map(v => (
              <button 
                key={v} 
                onClick={() => setWeight(v)}
                className={`py-1.5 text-[9px] font-black rounded-lg border transition-all ${weight === v ? "bg-white text-black border-white" : "border-white/5 text-white/30 bg-black/20"}`}
              >
                {v}g
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={() => { addItem({ ...product, price: currentPrice, weight, quantity: 1 }); setIsAdded(true); setTimeout(() => setIsAdded(false), 1000); }}
        className="w-full mt-5 py-4 rounded-xl font-black uppercase text-[11px] shadow-lg active:scale-95 transition-all"
        style={{ backgroundColor: isAdded ? '#34D399' : style.color, color: '#000' }}
      >
        {isAdded ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
