import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import '../styles/Catalogo.css'

const productos = [
  { id:1,  nombre:'Monitor Curvo 32"',       marca:'Samsung',  cat:'Monitores',      desc:'Panel VA 165Hz, 1ms, QHD 2560x1440.',             precio:349990,  icono:'🖥️', stock:12, off:15,   rating:4.8, reviews:124 },
  { id:2,  nombre:'Laptop Gaming RTX 4080',  marca:'ASUS',     cat:'Laptops',        desc:'Core i9-13980HX, RTX 4080 16GB, 32GB DDR5.',       precio:1899990, icono:'💻', stock:5,  off:null,  rating:4.9, reviews:87  },
  { id:3,  nombre:'Auriculares ANC Pro',     marca:'Sony',     cat:'Audio',          desc:'Cancelación activa de ruido, 40h batería LDAC.',   precio:149990,  icono:'🎧', stock:16, off:20,   rating:4.7, reviews:203 },
  { id:4,  nombre:'Teclado Mecánico TKL',   marca:'Logitech', cat:'Periféricos',    desc:'Switches Cherry MX Red, RGB por zona, TKL.',       precio:89990,   icono:'⌨️', stock:34, off:null,  rating:4.6, reviews:156 },
  { id:5,  nombre:'SSD NVMe 2TB Gen4',      marca:'Samsung',  cat:'Almacenamiento', desc:'Gen 4 PCIe, 7200MB/s lectura.',                    precio:129990,  icono:'💾', stock:8,  off:10,   rating:4.8, reviews:98  },
  { id:6,  nombre:'Router WiFi 7',          marca:'TP-Link',  cat:'Redes',          desc:'Tri-band BE19000, cobertura 300m².',               precio:199990,  icono:'📡', stock:21, off:null,  rating:4.5, reviews:67  },
  { id:7,  nombre:'Webcam 4K Pro',          marca:'Logitech', cat:'Periféricos',    desc:'Sensor Sony, autofocus AI, anillo de luz.',        precio:79990,   icono:'📷', stock:28, off:null,  rating:4.4, reviews:112 },
  { id:8,  nombre:'Hub USB-C 12en1',        marca:'Anker',    cat:'Accesorios',     desc:'HDMI 4K@60Hz x2, Ethernet 1Gbps, PD 100W.',       precio:49990,   icono:'🔌', stock:47, off:5,    rating:4.6, reviews:189 },
  { id:9,  nombre:'Mouse Gaming Pro',       marca:'Logitech', cat:'Periféricos',    desc:'25600 DPI, 8 botones, sensor Hero 25K.',           precio:59990,   icono:'🖱️', stock:22, off:null,  rating:4.7, reviews:143 },
  { id:10, nombre:'Silla Gamer Ergonómica', marca:'DXRacer',  cat:'Accesorios',     desc:'Soporte lumbar, reclinable 180°, reposabrazos 4D.',precio:299990,  icono:'🪑', stock:9,  off:25,   rating:4.5, reviews:76  },
  { id:11, nombre:'Monitor 4K 27" IPS',     marca:'LG',       cat:'Monitores',      desc:'Panel IPS 4K 144Hz, HDR600, USB-C 90W.',           precio:499990,  icono:'🖥️', stock:7,  off:null,  rating:4.8, reviews:54  },
  { id:12, nombre:'Laptop Ultrabook 14"',   marca:'LG',       cat:'Laptops',        desc:'Intel Core Ultra 7, 16GB, 1TB, batería 18h.',      precio:899990,  icono:'💻', stock:13, off:8,    rating:4.7, reviews:91  },
  { id:13, nombre:'Parlantes 2.1 Studio',   marca:'Sony',     cat:'Audio',          desc:'200W RMS, subwoofer 8", Bluetooth 5.3.',           precio:189990,  icono:'🔊', stock:18, off:null,  rating:4.6, reviews:63  },
  { id:14, nombre:'Disco Duro Externo 4TB', marca:'Seagate',  cat:'Almacenamiento', desc:'USB 3.2 Gen2, 220MB/s, cifrado AES.',              precio:89990,   icono:'💽', stock:33, off:15,   rating:4.5, reviews:177 },
  { id:15, nombre:'Switch 8 Puertos 2.5G',  marca:'TP-Link',  cat:'Redes',          desc:'8x 2.5GbE, 2x SFP+ 10G, gestión web.',            precio:149990,  icono:'🔁', stock:11, off:null,  rating:4.4, reviews:42  },
  { id:16, nombre:'Pad Mouse XL RGB',       marca:'Razer',    cat:'Accesorios',     desc:'900x400mm, tela premium, RGB 14 zonas.',           precio:29990,   icono:'🟦', stock:62, off:null,  rating:4.3, reviews:234 },
]

const categorias    = ['Todos','Monitores','Laptops','Audio','Periféricos','Almacenamiento','Redes','Accesorios']
const marcas        = ['Todas', ...new Set(productos.map(p => p.marca))]
const ordenOpciones = ['Relevancia','Menor precio','Mayor precio','Más reviews']
const PRECIO_MAX    = 2000000
const fmt           = (v) => '$' + Math.round(v).toLocaleString('es-CL')
const fmtStock      = (s) => s > 100 ? '+100 Unid.' : s > 50 ? '+50 Unid.' : `${s} Unid.`

function Catalogo() {
  const navigate                          = useNavigate()
  const [cat, setCat]                     = useState('Todos')
  const [marca, setMarca]                 = useState('Todas')
  const [orden, setOrden]                 = useState('Relevancia')
  const [busqueda, setBusqueda]           = useState('')
  const [soloOfertas, setSoloOfertas]     = useState(false)
  const [precioMax, setPrecioMax]         = useState(PRECIO_MAX)
  const [vista, setVista]                 = useState('grid')

  const filtrados = useMemo(() => {
    return productos
      .filter(p => cat === 'Todos'   || p.cat   === cat)
      .filter(p => marca === 'Todas' || p.marca === marca)
      .filter(p => !soloOfertas      || p.off)
      .filter(p => p.precio <= precioMax)
      .filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.cat.toLowerCase().includes(busqueda.toLowerCase())    ||
        p.marca.toLowerCase().includes(busqueda.toLowerCase())
      )
      .sort((a, b) => {
        if (orden === 'Menor precio') return a.precio - b.precio
        if (orden === 'Mayor precio') return b.precio - a.precio
        if (orden === 'Más reviews')  return b.reviews - a.reviews
        return 0
      })
  }, [cat, marca, orden, busqueda, soloOfertas, precioMax])

  const limpiarFiltros = () => {
    setCat('Todos'); setMarca('Todas'); setBusqueda('')
    setSoloOfertas(false); setPrecioMax(PRECIO_MAX)
  }

  const hayFiltros = cat !== 'Todos' || marca !== 'Todas' || busqueda || soloOfertas || precioMax < PRECIO_MAX

  return (
    <main className="catalogo">

      <div className="cat-header">
        <div className="cat-breadcrumb">
          <Link to="/">Inicio</Link><span>/</span><span>Catálogo</span>
        </div>
        <h1 className="cat-title">Catálogo de <span className="cat-grad">productos</span></h1>
        <p className="cat-sub">{filtrados.length} productos encontrados</p>
      </div>

      <div className="cat-body">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          {hayFiltros && (
            <div className="sidebar-section">
              <button className="limpiar-btn" onClick={limpiarFiltros}>✕ Limpiar filtros</button>
            </div>
          )}

          <div className="sidebar-section">
            <div className="sidebar-title">CATEGORÍAS</div>
            {categorias.map(c => (
              <button key={c} className={`sidebar-btn ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                <span>{c}</span>
                <span className="sidebar-count">
                  {c === 'Todos' ? productos.length : productos.filter(p => p.cat === c).length}
                </span>
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">MARCAS</div>
            {marcas.map(m => (
              <button key={m} className={`sidebar-btn ${marca === m ? 'active' : ''}`} onClick={() => setMarca(m)}>
                <span>{m}</span>
                <span className="sidebar-count">
                  {m === 'Todas' ? productos.length : productos.filter(p => p.marca === m).length}
                </span>
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">PRECIO MÁXIMO</div>
            <div className="precio-range">
              <input type="range" min="0" max={PRECIO_MAX} step="10000"
                value={precioMax} onChange={e => setPrecioMax(Number(e.target.value))}
              />
              <div className="precio-range-row">
                <span className="precio-range-label">Hasta</span>
                <span className="precio-range-val">{fmt(precioMax)}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">FILTROS</div>
            <label className="sidebar-check">
              <input type="checkbox" checked={soloOfertas}
                onChange={e => setSoloOfertas(e.target.checked)}
              />
              <span>Solo ofertas</span>
            </label>
          </div>
        </aside>

        {/* ── CONTENIDO ── */}
        <div className="cat-content">

          <div className="cat-toolbar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Buscar por nombre, marca o categoría..."
                value={busqueda} onChange={e => setBusqueda(e.target.value)}
                className="search-input"
              />
              {busqueda && (
                <button className="search-clear" onClick={() => setBusqueda('')}>✕</button>
              )}
            </div>
            <div className="toolbar-right">
              <select className="orden-select" value={orden} onChange={e => setOrden(e.target.value)}>
                {ordenOpciones.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <div className="vista-toggle">
                <button className={`vista-btn ${vista === 'grid' ? 'active' : ''}`} onClick={() => setVista('grid')}>⊞</button>
                <button className={`vista-btn ${vista === 'list' ? 'active' : ''}`} onClick={() => setVista('list')}>☰</button>
              </div>
            </div>
          </div>

          <div className="filtros-activos">
            {cat !== 'Todos'       && <span className="chip">{cat}<button onClick={() => setCat('Todos')}>✕</button></span>}
            {marca !== 'Todas'     && <span className="chip">{marca}<button onClick={() => setMarca('Todas')}>✕</button></span>}
            {precioMax < PRECIO_MAX && <span className="chip">Hasta {fmt(precioMax)}<button onClick={() => setPrecioMax(PRECIO_MAX)}>✕</button></span>}
            {soloOfertas           && <span className="chip">Solo ofertas<button onClick={() => setSoloOfertas(false)}>✕</button></span>}
            {busqueda              && <span className="chip">"{busqueda}"<button onClick={() => setBusqueda('')}>✕</button></span>}
          </div>

          {filtrados.length === 0 ? (
            <div className="sin-resultados">
              <div className="sin-icon">🔍</div>
              <div className="sin-txt">No se encontraron productos</div>
              <div className="sin-sub">Intenta con otro filtro o búsqueda</div>
              <button className="limpiar-btn" onClick={limpiarFiltros} style={{marginTop:'1rem'}}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className={`productos-${vista}`}>
              {filtrados.map(p =>
                vista === 'grid'
                  ? <CardGrid key={p.id} p={p} onClick={() => navigate(`/producto/${p.id}`)} />
                  : <CardList key={p.id} p={p} onClick={() => navigate(`/producto/${p.id}`)} />
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function CardGrid({ p, onClick }) {
  const { agregar }             = useCart()
  const [agregado, setAgregado] = useState(false)

  const handleCart = (e) => {
    e.stopPropagation()
    agregar(p)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1200)
  }

  return (
    <div className="prod-card-grid" onClick={onClick}>
      <div className="prod-badges">
        <div className="badge-left">
          {p.off && <span className="badge-off">-{p.off}%</span>}
        </div>
        <div className="badge-right">
          <span className="badge-stock">{fmtStock(p.stock)}</span>
        </div>
      </div>
      <div className="prod-img">
        <span className="prod-icono">{p.icono}</span>
      </div>
      <div className="prod-info">
        <div className="prod-top-row">
          <div className="prod-cat">{p.cat}</div>
          <div className="prod-marca">{p.marca}</div>
        </div>
        <div className="prod-nombre">{p.nombre}</div>
        <div className="prod-desc">{p.desc}</div>
        <div className="prod-footer">
          <div className="prod-precio">
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

function CardList({ p, onClick }) {
  const { agregar }             = useCart()
  const [agregado, setAgregado] = useState(false)

  const handleCart = (e) => {
    e.stopPropagation()
    agregar(p)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1200)
  }

  return (
    <div className="prod-card-list" onClick={onClick}>
      <div className="prod-list-img">
        <span className="prod-icono">{p.icono}</span>
        {p.off && <span className="badge-off">-{p.off}%</span>}
      </div>
      <div className="prod-list-info">
        <div className="prod-top-row">
          <div className="prod-cat">{p.cat}</div>
          <div className="prod-marca">{p.marca}</div>
        </div>
        <div className="prod-nombre">{p.nombre}</div>
        <div className="prod-desc">{p.desc}</div>
      </div>
      <div className="prod-list-footer">
        <span className="badge-stock">{fmtStock(p.stock)}</span>
        <div className="prod-precio">
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
  )
}

export default Catalogo