import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import '../styles/Home.css'

const productos = [
  { id:1,  nombre:'Monitor Curvo 32"',       marca:'Samsung',  cat:'MONITORES',      desc:'165Hz, 1ms, panel VA QHD',        precio:349990,  icono:'🖥️', stock:12, off:15   },
  { id:2,  nombre:'Laptop Gaming RTX 4080',  marca:'ASUS',     cat:'LAPTOPS',        desc:'i9-13Gen, 32GB DDR5, 240Hz',      precio:1899990, icono:'💻', stock:5,  off:null },
  { id:3,  nombre:'Auriculares ANC Pro',     marca:'Sony',     cat:'AUDIO',          desc:'40h batería, codec LDAC Hi-Res',  precio:149990,  icono:'🎧', stock:16, off:20   },
  { id:4,  nombre:'Teclado Mecánico TKL',   marca:'Logitech', cat:'PERIFÉRICOS',    desc:'Cherry MX Red, RGB por zona',     precio:89990,   icono:'⌨️', stock:34, off:null },
  { id:5,  nombre:'SSD NVMe 2TB Gen4',      marca:'Samsung',  cat:'ALMACENAMIENTO', desc:'7200MB/s lectura, PCIe 4.0',      precio:129990,  icono:'💾', stock:8,  off:10   },
  { id:6,  nombre:'Router WiFi 7',          marca:'TP-Link',  cat:'REDES',          desc:'Tri-band, cobertura 300m²',       precio:199990,  icono:'📡', stock:21, off:null },
  { id:7,  nombre:'Webcam 4K Pro',          marca:'Logitech', cat:'PERIFÉRICOS',    desc:'Sensor Sony, autofocus AI',       precio:79990,   icono:'📷', stock:28, off:null },
  { id:8,  nombre:'Hub USB-C 12en1',        marca:'Anker',    cat:'ACCESORIOS',     desc:'HDMI 4K, Ethernet, PD 100W',      precio:49990,   icono:'🔌', stock:47, off:5    },
  { id:9,  nombre:'Mouse Gaming Pro',       marca:'Logitech', cat:'PERIFÉRICOS',    desc:'25600 DPI, 8 botones, RGB',       precio:59990,   icono:'🖱️', stock:22, off:null },
  { id:10, nombre:'Silla Gamer Ergonómica', marca:'DXRacer',  cat:'ACCESORIOS',     desc:'Soporte lumbar, reclinable 180°', precio:299990,  icono:'🪑', stock:9,  off:25   },
]

const categorias = [
  { label:'Monitores',  icono:'🖥️' },
  { label:'Laptops',    icono:'💻' },
  { label:'Audio',      icono:'🎧' },
  { label:'Teclados',   icono:'⌨️' },
  { label:'Mouse',      icono:'🖱️' },
  { label:'Storage',    icono:'💾' },
  { label:'Redes',      icono:'📡' },
  { label:'Accesorios', icono:'🔌' },
]

const fmt      = (v) => '$' + Math.round(v).toLocaleString('es-CL')
const fmtStock = (s) => s > 100 ? '+100 Unid.' : s > 50 ? '+50 Unid.' : `${s} Unid.`

function Home() {
  const navigate             = useNavigate()
  const [catActiva, setCatActiva] = useState('Monitores')

  return (
    <main className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>

        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left:              `${Math.random() * 100}%`,
              animationDelay:    `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              width:             `${2 + Math.random() * 3}px`,
              height:            `${2 + Math.random() * 3}px`,
              opacity:            0.3 + Math.random() * 0.5,
            }}/>
          ))}
        </div>

        <div className="hero-txt">
          <div className="hero-badge">◆ NUEVA TEMPORADA 2025</div>
          <h1 className="hero-title">
            Tecnología<br/>
            <span className="hero-grad hero-glitch" data-text="al límite">al límite</span>
          </h1>
          <p className="hero-sub">
            Los mejores productos electrónicos con despacho express.
            Stock en tiempo real, pagos seguros y garantía extendida.
          </p>
          <div className="hero-btns">
            <Link to="/catalogo" className="btn-primary btn-pulse">Ver ofertas →</Link>
            <Link to="/catalogo" className="btn-secondary">Explorar todo</Link>
          </div>
          <div className="hero-stats-row">
            <StatCounter value={2400} suffix="+" label="Productos" />
            <StatCounter value={48}   suffix="h"  label="Despacho" />
            <StatCounter value={4.9}  suffix="★"  label="Valoración" decimals={1} />
            <StatCounter value={3}    suffix=""   label="Métodos pago" />
          </div>
        </div>

        <div className="hero-prod hero-prod-float" onClick={() => navigate('/producto/2')} style={{cursor:'pointer'}}>
          <div className="hero-prod-glow"></div>
          <div className="hero-prod-icon">💻</div>
          <div className="hero-prod-tag">🔥 PRODUCTO DEL DÍA</div>
          <div className="hero-prod-name">Laptop Gaming RTX 4080</div>
          <div className="hero-prod-price">
            <span className="precio-cur">CLP </span>1.899.990
          </div>
          <button
            className="btn-primary"
            onClick={e => { e.stopPropagation(); navigate('/producto/2') }}
          >
            Ver producto →
          </button>
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <div className="categorias">
        {categorias.map(cat => (
          <button
            key={cat.label}
            className={`cat-btn ${catActiva === cat.label ? 'active' : ''}`}
            onClick={() => setCatActiva(cat.label)}
          >
            <span className="cat-icono">{cat.icono}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── BANNERS PROMO ── */}
      <div className="promos">
        <div className="promo promo-1">
          <div className="promo-inner">
            <div className="promo-tag">OFERTA ESPECIAL</div>
            <h3>Hasta 40% OFF en monitores</h3>
            <p>Solo esta semana · Unidades limitadas</p>
            <span className="promo-cta">Ver ofertas →</span>
          </div>
          <span className="promo-icon">🖥️</span>
        </div>
        <div className="promo promo-2">
          <div className="promo-inner">
            <div className="promo-tag">NUEVO INGRESO</div>
            <h3>RTX 5090 disponible</h3>
            <p>Reserva la tuya ahora</p>
            <span className="promo-cta">Ver productos →</span>
          </div>
          <span className="promo-icon">🎮</span>
        </div>
        <div className="promo promo-3">
          <div className="promo-inner">
            <div className="promo-tag">DESPACHO GRATIS</div>
            <h3>Compras sobre $50.000</h3>
            <p>Todo Chile · 48 horas</p>
            <span className="promo-cta">Ver condiciones →</span>
          </div>
          <span className="promo-icon">🚚</span>
        </div>
      </div>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <section className="productos-section">
        <div className="sec-label">01 · MÁS VENDIDOS</div>
        <div className="sec-header">
          <h2 className="sec-title">Productos destacados</h2>
          <Link to="/catalogo" className="sec-link">Ver todo →</Link>
        </div>
        <div className="productos-grid">
          {productos.map(p => (
            <ProductoCard
              key={p.id}
              p={p}
              onClick={() => navigate(`/producto/${p.id}`)}
            />
          ))}
        </div>
      </section>

      {/* ── CYBER WEEK ── */}
      <div className="promo-full">
        <div className="promo-full-txt">
          <div className="promo-full-tag">⚡ TIEMPO LIMITADO</div>
          <h2>Cyber Week SmartLogix</h2>
          <p>Descuentos de hasta 50% en laptops, monitores y periféricos seleccionados. Solo hasta el domingo.</p>
          <Link to="/catalogo" className="btn-primary">Ver todas las ofertas →</Link>
        </div>
        <div className="promo-full-nums">
          <div className="countdown-item">
            <div className="countdown-val">02</div>
            <div className="countdown-label">DÍAS</div>
          </div>
          <div className="countdown-sep">:</div>
          <div className="countdown-item">
            <div className="countdown-val">14</div>
            <div className="countdown-label">HORAS</div>
          </div>
          <div className="countdown-sep">:</div>
          <div className="countdown-item">
            <div className="countdown-val">37</div>
            <div className="countdown-label">MIN</div>
          </div>
        </div>
      </div>

      {/* ── NUEVOS INGRESOS ── */}
      <section className="productos-section">
        <div className="sec-label">02 · RECIÉN LLEGADOS</div>
        <div className="sec-header">
          <h2 className="sec-title">Nuevos ingresos</h2>
          <Link to="/catalogo" className="sec-link">Ver todo →</Link>
        </div>
        <div className="productos-grid">
          {[...productos].reverse().slice(0, 5).map(p => (
            <ProductoCard
              key={p.id}
              p={p}
              esNuevo
              onClick={() => navigate(`/producto/${p.id}`)}
            />
          ))}
        </div>
      </section>

      {/* ── BENEFICIOS ── */}
      <div className="beneficios">
        <div className="beneficio">
          <span className="ben-icono">⚡</span>
          <div className="ben-txt">
            <div className="ben-nombre">Despacho 48h</div>
            <div className="ben-desc">Todo Chile</div>
          </div>
        </div>
        <div className="beneficio">
          <span className="ben-icono">🔒</span>
          <div className="ben-txt">
            <div className="ben-nombre">Pago seguro</div>
            <div className="ben-desc">Webpay · MercadoPago · Khipu</div>
          </div>
        </div>
        <div className="beneficio">
          <span className="ben-icono">↩️</span>
          <div className="ben-txt">
            <div className="ben-nombre">30 días garantía</div>
            <div className="ben-desc">Devolución sin preguntas</div>
          </div>
        </div>
        <div className="beneficio">
          <span className="ben-icono">🎧</span>
          <div className="ben-txt">
            <div className="ben-nombre">Soporte 24/7</div>
            <div className="ben-desc">Chat y teléfono</div>
          </div>
        </div>
      </div>

    </main>
  )
}

/* ── STAT COUNTER ── */
function StatCounter({ value, suffix, label, decimals = 0 }) {
  const [count, setCount] = useState(0)
  const ref               = useRef(null)
  const started           = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current  = true
        const duration   = 1800
        const steps      = 60
        const increment  = value / steps
        let current      = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= value) {
            setCount(value)
            clearInterval(timer)
          } else {
            setCount(parseFloat(current.toFixed(decimals)))
          }
        }, duration / steps)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, decimals])

  return (
    <div className="stat-counter" ref={ref}>
      <div className="stat-counter-val">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
      </div>
      <div className="stat-counter-label">{label}</div>
    </div>
  )
}

/* ── PRODUCTO CARD ── */
function ProductoCard({ p, esNuevo, onClick }) {
  const { agregar }             = useCart()
  const [agregado, setAgregado] = useState(false)

  const handleCart = (e) => {
    e.stopPropagation()
    agregar(p)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1200)
  }

  return (
    <div className="producto-card card-reveal" onClick={onClick}>
      <div className="prod-badges">
        <div className="badge-left">
          {esNuevo
            ? <span className="badge-new">NUEVO</span>
            : p.off && <span className="badge-off">-{p.off}%</span>
          }
        </div>
        <div className="badge-right">
          <span className="badge-stock">{fmtStock(p.stock)}</span>
        </div>
      </div>

      <div className="producto-img">
        <span className="producto-icono img-hover">{p.icono}</span>
      </div>

      <div className="producto-info">
        <div className="prod-top-row">
          <div className="producto-cat">{p.cat}</div>
          <div className="prod-marca">{p.marca}</div>
        </div>
        <div className="producto-nombre">{p.nombre}</div>
        <div className="producto-desc">{p.desc}</div>
        <div className="producto-footer">
          <div className="producto-precio">
            <span className="precio-cur">CLP </span>
            {fmt(p.precio)}
          </div>
          <button
            className={`cart-btn ${agregado ? 'cart-btn-ok' : ''}`}
            onClick={handleCart}
            title="Agregar al carrito"
          >
            {agregado ? '✓' : '🛒'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home