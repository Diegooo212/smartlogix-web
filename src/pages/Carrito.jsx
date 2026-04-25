import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import '../styles/Carrito.css'

const fmt = (v) => '$' + Math.round(v).toLocaleString('es-CL')

function Carrito() {
  const { items, quitar, cambiarCantidad, total, vaciar } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const iva      = total * 0.19
  const subtotal = total
  const totalFinal = total + iva

  if (items.length === 0) {
    return (
      <main className="carrito-page">
        <div className="carrito-empty">
          <div className="carrito-empty-icon">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde el catálogo para comenzar</p>
          <Link to="/catalogo" className="btn-ir-catalogo">Ir al catálogo →</Link>
        </div>
      </main>
    )
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  return (
    <main className="carrito-page">
      <div className="carrito-header">
        <div className="carrito-breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <span>Carrito</span>
        </div>
        <div className="carrito-header-row">
          <h1 className="carrito-title">Mi carrito <span>({items.length} productos)</span></h1>
          <button className="vaciar-btn" onClick={vaciar}>🗑 Vaciar carrito</button>
        </div>
      </div>

      <div className="carrito-body">

        {/* ── ITEMS ── */}
        <div className="carrito-items">
          {items.map(item => (
            <div key={item.id} className="carrito-item">
              <div className="item-img">
                <span>{item.icono}</span>
              </div>
              <div className="item-info">
                <div className="item-cat">{item.cat}</div>
                <div className="item-nombre">{item.nombre}</div>
                <div className="item-marca">{item.marca}</div>
                {item.off && (
                  <div className="item-desc">{item.desc}</div>
                )}
              </div>
              <div className="item-qty">
                <button
                  className="qty-btn"
                  onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                >−</button>
                <span className="qty-val">{item.cantidad}</span>
                <button
                  className="qty-btn"
                  onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                  disabled={item.cantidad >= item.stock}
                >+</button>
              </div>
              <div className="item-precio-col">
                <div className="item-precio">{fmt(item.precio * item.cantidad)}</div>
                <div className="item-precio-unit">{fmt(item.precio)} c/u</div>
              </div>
              <button className="item-quitar" onClick={() => quitar(item.id)}>✕</button>
            </div>
          ))}
        </div>

        {/* ── RESUMEN ── */}
        <div className="carrito-resumen">
          <div className="resumen-card">
            <div className="resumen-top"></div>
            <div className="resumen-title">Resumen del pedido</div>

            <div className="resumen-rows">
              <div className="resumen-row">
                <span>Subtotal ({items.length} productos)</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="resumen-row">
                <span>IVA (19%)</span>
                <span>{fmt(iva)}</span>
              </div>
              <div className="resumen-row">
                <span>Despacho</span>
                <span className="resumen-gratis">
                  {subtotal >= 50000 ? 'Gratis' : fmt(4990)}
                </span>
              </div>
              {subtotal >= 50000 && (
                <div className="resumen-envio-gratis">
                  🚚 ¡Tienes despacho gratis!
                </div>
              )}
            </div>

            <div className="resumen-total">
              <span>TOTAL</span>
              <span>{fmt(subtotal >= 50000 ? totalFinal : totalFinal + 4990)}</span>
            </div>

            <div className="resumen-metodos">
              <div className="resumen-metodos-label">MÉTODOS DE PAGO</div>
              <div className="resumen-metodos-list">
                <span className="metodo webpay">Webpay</span>
                <span className="metodo mp">MercadoPago</span>
                <span className="metodo khipu">Khipu</span>
              </div>
            </div>

            <button className="btn-checkout" onClick={handleCheckout}>
              {user ? 'Proceder al pago →' : 'Iniciar sesión para comprar →'}
            </button>

            {!user && (
              <p className="resumen-login-hint">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="resumen-link">Regístrate gratis</Link>
              </p>
            )}

            <Link to="/catalogo" className="btn-seguir">← Seguir comprando</Link>
          </div>

          {/* Garantías */}
          <div className="resumen-garantias">
            <div className="garantia">
              <span>🔒</span>
              <div>
                <div className="garantia-nombre">Compra segura</div>
                <div className="garantia-desc">Datos protegidos con SSL</div>
              </div>
            </div>
            <div className="garantia">
              <span>↩️</span>
              <div>
                <div className="garantia-nombre">30 días garantía</div>
                <div className="garantia-desc">Devolución sin preguntas</div>
              </div>
            </div>
            <div className="garantia">
              <span>🎧</span>
              <div>
                <div className="garantia-nombre">Soporte 24/7</div>
                <div className="garantia-desc">Estamos para ayudarte</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default Carrito