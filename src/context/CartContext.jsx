import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const agregar = (producto, cantidad = 1) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id)
      if (existe) {
        return prev.map(i =>
          i.id === producto.id
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, producto.stock) }
            : i
        )
      }
      return [...prev, { ...producto, cantidad }]
    })
  }

  const quitar = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad <= 0) { quitar(id); return }
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i))
  }

  const vaciar = () => setItems([])

  const total     = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  const cantidad  = items.reduce((acc, i) => acc + i.cantidad, 0)

  return (
    <CartContext.Provider value={{
      items, agregar, quitar,
      cambiarCantidad, vaciar,
      total, cantidad
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)