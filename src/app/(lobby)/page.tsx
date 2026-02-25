"use client"
import * as React from "react"
import Image from "next/image"
import { getProducts } from "@/lib/fetchers/product"
import { ShoppingCart, Trash2, X, Plus, Minus, Info, Phone, Send, CheckCircle2 } from "lucide-react"
import { create } from "zustand"
import { motion, AnimatePresence } from "framer-motion"

// --- КОРЗИНА (ZUSTAND) ---
interface CartItem {
  id: string; name: string; price: number; weight: string; quantity: number; image: string;
}
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, weight: string) => void;
  updateQuantity: (id: string, weight: string, delta: number) => void;
  clearCart: () => void;
}
const useCart = create<CartStore>((set) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    const existing = state.items.find(i => i.id === newItem.id && i.weight === newItem.weight);
    if (existing) return { items: state.items.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i) };
    return { items: [...state.items, newItem] };
  }),
  removeItem: (id, weight) => set((state) => ({ items: state.items.filter(i => !(i.id === id && i.weight === weight)) })),
  updateQuantity: (id, weight, delta) => set((state) => ({
    items: state.items.map(i => (i.id === id && i.weight === weight) ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
  })),
  clearCart: () => set({ items: [] })
}));

const GRADE_STYLES: Record<string, any> = {
  "silver grade": { color: "#C1C1C1", border: "border-white/10", bg: "bg-white/5" },
  "golden grade": { color: "#FEC107", border: "border-[#FEC107]/20", bg: "bg-[#FEC107]/5" },
  "premium grade": { color: "#34D399", border: "border-[#34D399]/30", bg: "bg-[#193D2E]/20" },
  "selected premium": { color: "#00CED1", border: "border-[#00CED1]/40", bg: "bg-[#004D40]/30" },
  "hash old school": { color: "#D2B48C", border: "border-[#402917]/40", bg: "bg-[#402917]/30" },
  "hash fresh frozen": { color: "#3F999C", border: "border-[#3F999C]/40", bg: "bg-[#3F999C]/20" },
  "hash fresh frozen premium": { color: "#5CE1E6", border: "border-[#5CE1E6]/40", bg: "bg-[#5CE1E6]/20" },
  "live rosin premium": { color: "#A855F7", border: "border-[#693A7B]/40", bg: "bg-[#693A7B]/30" },
};

const getStyle = (val: string) => {
  const lowVal = String(val || "").toLowerCase().trim();
  return GRADE_STYLES[lowVal] || { color: "#34D399", border: "border-white/10", bg: "bg-white/5" };
}

// --- КОМПОНЕНТ КАРТОЧКИ С ИСПРАВЛЕННОЙ АНИМАЦИЕЙ ---
function ProductCard({ product, onOpen, index }: { product: any, onOpen: (p: any) => void, index: number }) {
  const [weight, setWeight] = React.useState("1");
  const addItem = useCart(s => s.addItem);
  const style = getStyle(product.subcategory || product.category);
  const price = product.prices?.[weight] || product.price;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }} // Начало снизу на 15px
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.03, // Быстрый каскад
        ease: "easeOut"
      }}
      className={`group relative flex flex-col rounded-[1.5rem] border p-2.5 transition-all duration-500 backdrop-blur-xl ${style.bg} ${style.border}`}
    >
      <button onClick={() => onOpen(product)} className="absolute top-4 right-4 z-20 p-1.5 bg-black/40 rounded-full text-white/50 hover:text-white transition-colors">
        <Info size={14} />
      </button>
      <div className="aspect-square relative overflow-hidden rounded-[1.2rem] bg-black/60 mb-3 cursor-pointer" onClick={() => onOpen(product)}>
        <Image src={product.image ? `/images/${product.image.split('/').pop()}` : '/product-placeholder.webp'} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 45vw, 20vw" />
      </div>
      <div className="px-1 space-y-1.5 flex-1 text-left">
        <h3 className="font-bold text-white/90 text-[11px] sm:text-[13px] uppercase italic truncate leading-tight">{product.name}</h3>
        <div className="text-lg font-black tracking-tighter" style={{ color: style.color }}>{price}฿</div>
        <div className="flex gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
          {["1", "5", "10", "20"].map(w => (
            <button key={w} onClick={() => setWeight(w)} className={`flex-1 py-1 text-[8px] font-black rounded-md transition-all ${weight === w ? "bg-white text-black shadow-md" : "text-white/20"}`}>{w}g</button>
          ))}
        </div>
      </div>
      <button onClick={() => addItem({ id: product.id, name: product.name, price, weight, quantity: 1, image: product.image })} className="w-full mt-3 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest active:scale-95 transition-all" style={{ backgroundColor: style.color, color: '#000' }}>В корзину</button>
    </motion.div>
  )
}

export default function IndexPage() {
  const [products, setProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeCategory, setActiveCategory] = React.useState("Buds")
  const [activeSub, setActiveSub] = React.useState("All")
  const [isCartOpen, setIsCartOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null)
  
  const [tgUser, setTgUser] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [isOrdered, setIsOrdered] = React.useState(false)

  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  React.useEffect(() => {
    getProducts().then(data => { setProducts(data); setLoading(false); })
  }, [])

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  const subcategories = ["All", ...Array.from(new Set(products.filter(p => p.category === activeCategory).map(p => p.subcategory).filter(Boolean)))]
  const filtered = products.filter(p => (p.category === activeCategory) && (activeSub === "All" || p.subcategory === activeSub))

  const handleCheckout = () => {
    const text = `🚀 *НОВЫЙ ЗАКАЗ:*\n\n👤 *TG:* ${tgUser || "—"}\n📞 *Тел:* ${phone || "—"}\n\n🛒 *Товары:*\n${items.map(i => `• ${i.name} (${i.weight}g) x${i.quantity}`).join('\n')}\n\n💰 *ИТОГО: ${totalPrice}฿*`;
    setIsOrdered(true);
    setTimeout(() => {
      window.open(`https://t.me/YOUR_TG_NICKNAME?text=${encodeURIComponent(text)}`, '_blank');
      setIsOrdered(false);
      setIsCartOpen(false);
      clearCart();
    }, 1500);
  }

  const isButtonDisabled = items.length === 0 || (!tgUser.trim() && !phone.trim()) || isOrdered;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 font-sans selection:bg-emerald-500/20 overflow-x-hidden">
      <div className="container mx-auto px-4 py-6 relative">
        <header className="flex justify-between items-center mb-8">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">Inventory</div>
          <button onClick={() => setIsCartOpen(true)} className="relative p-3.5 bg-white/5 rounded-2xl border border-white/10 z-[50]">
            <ShoppingCart size={18} />
            {items.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 text-black text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">{items.length}</span>}
          </button>
        </header>

        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar sticky top-0 bg-[#050505]/80 backdrop-blur-lg z-[40] py-2">
          {!loading && categories.map(cat => (
            <button key={cat as string} onClick={() => { setActiveCategory(cat as string); setActiveSub("All"); }} className={`px-7 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? "bg-white text-black border-white shadow-xl" : "border-white/5 text-white/20"}`}>{cat as string}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!loading && subcategories.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex gap-5 mb-8 overflow-x-auto no-scrollbar py-2 border-y border-white/5"
            >
              {subcategories.map(sub => {
                const s = getStyle(sub as string);
                const isActive = activeSub === sub;
                return (
                  <button key={sub as string} onClick={() => setActiveSub(sub as string)} className="text-[9px] font-black uppercase tracking-widest transition-all relative py-1" style={{ color: isActive ? s.color : 'rgba(255,255,255,0.2)' }}>
                    {sub as string}
                    {isActive && <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-px" style={{ backgroundColor: s.color }} />}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <section className="relative">
          <motion.div 
            layout 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 overflow-hidden pt-2"
          >
            <AnimatePresence mode="popLayout">
              {loading ? [1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/4.5] rounded-[1.5rem] bg-white/5 animate-pulse" />) 
                       : filtered.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} onOpen={setSelectedProduct} />)}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>

      {/* ШТОРКА КОРЗИНЫ */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-2xl flex justify-end">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 p-6 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase italic">Корзина</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white/5 rounded-full"><X size={18}/></button>
              </div>

              {isOrdered ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <CheckCircle2 size={60} className="text-emerald-400" />
                  <h3 className="text-xl font-black uppercase italic">Заказ принят!</h3>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                    {items.map(item => (
                      <div key={item.id + item.weight} className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-black flex-shrink-0">
                          <Image src={item.image ? `/images/${item.image.split('/').pop()}` : '/product-placeholder.webp'} alt="" fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-[8px] font-black uppercase text-white/30 mb-1">{item.weight}g</div>
                          <div className="text-[11px] font-bold uppercase italic truncate mb-2">{item.name}</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center bg-black/40 rounded-lg border border-white/5">
                              <button onClick={() => updateQuantity(item.id, item.weight, -1)} className="p-1.5 text-white/40"><Minus size={10}/></button>
                              <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.weight, 1)} className="p-1.5 text-white/40"><Plus size={10}/></button>
                            </div>
                            <div className="text-sm font-black text-white">{item.price * item.quantity}฿</div>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.id, item.weight)} className="text-white/10 hover:text-red-500 ml-2"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <input type="text" placeholder="Ваш TG @nick" value={tgUser} onChange={(e) => setTgUser(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-xs font-bold outline-none" />
                    <input type="text" placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-xs font-bold outline-none" />
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">Total</span>
                      <span className="text-4xl font-black tracking-tighter">{totalPrice}฿</span>
                    </div>
                    <button onClick={handleCheckout} disabled={isButtonDisabled} className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl transition-all ${isButtonDisabled ? "bg-white/5 text-white/10" : "bg-white text-black"}`}>Заказать</button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DRAWER */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-end sm:items-center justify-center" onClick={() => setSelectedProduct(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="bg-[#0a0a0a] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2rem] border-t sm:border border-white/10 overflow-hidden relative" onClick={e => e.stopPropagation()}>
              <div className="aspect-square relative w-full">
                <Image src={selectedProduct.image ? `/images/${selectedProduct.image.split('/').pop()}` : '/product-placeholder.webp'} alt="" fill className="object-cover" />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-2 bg-black/40 rounded-full text-white/70 backdrop-blur-md"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-5 text-left">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedProduct.name}</h2>
                <p className="text-white/40 text-xs leading-relaxed italic">{selectedProduct.description || "Premium selection."}</p>
                <div className="pt-4 flex justify-between items-center">
                   <div className="text-4xl font-black" style={{ color: getStyle(selectedProduct.subcategory).color }}>{selectedProduct.price}฿</div>
                   <button onClick={() => { useCart.getState().addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, weight: "1", quantity: 1, image: selectedProduct.image }); setSelectedProduct(null); }} className="px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl" style={{ backgroundColor: getStyle(selectedProduct.subcategory).color, color: '#000' }}>В корзину</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
