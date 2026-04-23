import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import '../styles/ProductoDetalle.css'

const productos = [
  { id:1,  nombre:'Monitor Curvo 32"',       marca:'Samsung',  cat:'Monitores',      desc:'Panel VA 165Hz, 1ms, QHD 2560x1440. Ideal para gaming y diseño profesional.',  precio:349990,  icono:'🖥️', stock:12, off:15,   rating:4.8, reviews:124,
    specs: [['Panel','VA Curvo 1800R'],['Resolución','QHD 2560x1440'],['Frecuencia','165Hz'],['Tiempo resp.','1ms MPRT'],['Brillo','250 nits'],['Contraste','3000:1'],['Puertos','2x HDMI 2.0, 1x DP 1.4'],['VESA','75x75mm']] },
  { id:2,  nombre:'Laptop Gaming RTX 4080',  marca:'ASUS',     cat:'Laptops',        desc:'Core i9-13980HX, RTX 4080 16GB, 32GB RAM DDR5, 240Hz 1080p.',                  precio:1899990, icono:'💻', stock:5,  off:null,  rating:4.9, reviews:87,
    specs: [['CPU','Intel Core i9-13980HX'],['GPU','RTX 4080 16GB'],['RAM','32GB DDR5 5600MHz'],['Almac.','2TB NVMe PCIe 4.0'],['Pantalla','15.6" FHD 240Hz'],['Batería','90Wh'],['SO','Windows 11 Pro'],['Peso','2.4kg']] },
  { id:3,  nombre:'Auriculares ANC Pro',     marca:'Sony',     cat:'Audio',          desc:'Cancelación activa de ruido híbrida, 40h batería, codec LDAC Hi-Res.',          precio:149990,  icono:'🎧', stock:16, off:20,   rating:4.7, reviews:203,
    specs: [['Driver','40mm dinamico'],['Respuesta frec.','4Hz-40kHz'],['ANC','Híbrido 8 micrófonos'],['Batería','40h (ANC on)'],['Carga','USB-C, 10min=5h'],['Codec','LDAC, AAC, SBC'],['Peso','254g'],['Conexión','Bluetooth 5.2']] },
  { id:4,  nombre:'Teclado Mecánico TKL',   marca:'Logitech', cat:'Periféricos',    desc:'Switches Cherry MX Red, retroiluminación RGB por zona, compacto TKL.',          precio:89990,   icono:'⌨️', stock:34, off:null,  rating:4.6, reviews:156,
    specs: [['Switch','Cherry MX Red'],['Iluminación','RGB por tecla'],['Formato','TKL (87 teclas)'],['Polling rate','1000Hz'],['Anti-ghosting','Full'],['Cable','1.8m trenzado'],['Conexión','USB-A'],['Peso','780g']] },
  { id:5,  nombre:'SSD NVMe 2TB Gen4',      marca:'Samsung',  cat:'Almacenamiento', desc:'Gen 4 PCIe, 7200MB/s lectura. Rendimiento máximo para workstations.',           precio:129990,  icono:'💾', stock:8,  off:10,   rating:4.8, reviews:98,
    specs: [['Capacidad','2TB'],['Interfaz','PCIe 4.0 x4 NVMe'],['Lectura','7200 MB/s'],['Escritura','6900 MB/s'],['IOPS lectura','1.000.000'],['MTBF','1.500.000h'],['Garantía','5 años'],['Factor forma','M.2 2280']] },
  { id:6,  nombre:'Router WiFi 7',          marca:'TP-Link',  cat:'Redes',          desc:'Tri-band BE19000, MU-MIMO 8x8, cobertura 300m², 4 puertos 2.5GbE.',             precio:199990,  icono:'📡', stock:21, off:null,  rating:4.5, reviews:67,
    specs: [['Estándar','WiFi 7 (802.11be)'],['Bandas','Tri-band'],['Velocidad','19000 Mbps'],['Antenas','8 externas'],['Puertos','4x 2.5GbE + 1x 10GbE'],['MU-MIMO','8x8'],['Cobertura','300 m²'],['CPU','Quad-core 2.0GHz']] },
  { id:7,  nombre:'Webcam 4K Pro',          marca:'Logitech', cat:'Periféricos',    desc:'Sensor Sony 1/2.8", autofocus AI, anillo de luz integrado, USB-C.',             precio:79990,   icono:'📷', stock:28, off:null,  rating:4.4, reviews:112,
    specs: [['Resolución','4K 30fps / 1080p 60fps'],['Sensor','Sony 1/2.8"'],['Autofocus','AI tracking'],['FOV','90°'],['Micrófono','Dual estéreo'],['Luz','Anillo LED 3 niveles'],['Conexión','USB-C'],['Compatible','Win/Mac/Linux']] },
  { id:8,  nombre:'Hub USB-C 12en1',        marca:'Anker',    cat:'Accesorios',     desc:'HDMI 4K@60Hz x2, SD/microSD, Ethernet 1Gbps, PD 100W, USB 3.2.',               precio:49990,   icono:'🔌', stock:47, off:5,    rating:4.6, reviews:189,
    specs: [['Puertos','12 en total'],['HDMI','2x 4K@60Hz'],['USB-A','3x USB 3.2 Gen2'],['USB-C','2x (1 datos + 1 PD)'],['PD','100W pass-through'],['Ethernet','1Gbps'],['SD/microSD','UHS-II'],['Peso','120g']] },
  { id:9,  nombre:'Mouse Gaming Pro',       marca:'Logitech', cat:'Periféricos',    desc:'25600 DPI, 8 botones programables, RGB, sensor óptico Hero 25K.',               precio:59990,   icono:'🖱️', stock:22, off:null,  rating:4.7, reviews:143,
    specs: [['Sensor','Hero 25K'],['DPI','100-25600'],['Botones','8 programables'],['Polling rate','1000Hz'],['Batería','N/A (con cable)'],['Cable','1.8m trenzado'],['Peso','101g'],['RGB','Logo + scroll']] },
  { id:10, nombre:'Silla Gamer Ergonómica', marca:'DXRacer',  cat:'Accesorios',     desc:'Soporte lumbar ajustable, reclinable 180°, reposabrazos 4D.',                   precio:299990,  icono:'🪑', stock:9,  off:25,   rating:4.5, reviews:76,
    specs: [['Reclinación','90°-180°'],['Reposabrazos','4D ajustable'],['Lumbar','Almohada ajustable'],['Material','PU cuero premium'],['Base','Aluminio 350mm'],['Ruedas','PU silencioso'],['Peso máx.','150kg'],['Garantía','2 años']] },
  { id:11, nombre:'Monitor 4K 27" IPS',     marca:'LG',       cat:'Monitores',      desc:'Panel IPS 4K 144Hz, HDR600, cubierta antirreflejos, USB-C 90W.',                precio:499990,  icono:'🖥️', stock:7,  off:null,  rating:4.8, reviews:54,
    specs: [['Panel','IPS Nano'],['Resolución','4K 3840x2160'],['Frecuencia','144Hz'],['HDR','HDR600'],['USB-C','90W PD'],['Color','DCI-P3 98%'],['Brillo','600 nits'],['G-Sync','Compatible']] },
  { id:12, nombre:'Laptop Ultrabook 14"',   marca:'LG',       cat:'Laptops',        desc:'Intel Core Ultra 7, 16GB LPDDR5, 1TB SSD, batería 18h, 1.2kg.',                 precio:899990,  icono:'💻', stock:13, off:8,    rating:4.7, reviews:91,
    specs: [['CPU','Intel Core Ultra 7 155H'],['RAM','16GB LPDDR5'],['Almac.','1TB NVMe SSD'],['Pantalla','14" OLED 2.8K 120Hz'],['Batería','18h'],['Peso','1.2kg'],['SO','Windows 11 Home'],['Puertos','2x TB4, 1x USB-A, HDMI']] },
  { id:13, nombre:'Parlantes 2.1 Studio',   marca:'Sony',     cat:'Audio',          desc:'200W RMS, subwoofer 8", Bluetooth 5.3, entrada óptica y RCA.',                  precio:189990,  icono:'🔊', stock:18, off:null,  rating:4.6, reviews:63,
    specs: [['Potencia','200W RMS'],['Subwoofer','8" bass reflex'],['Bluetooth','5.3'],['Entradas','Óptica, RCA, AUX'],['Frecuencia','28Hz-20kHz'],['SNR','85dB'],['Control','Remoto incluido'],['Dimensiones','Sub: 25x35x30cm']] },
  { id:14, nombre:'Disco Duro Externo 4TB', marca:'Seagate',  cat:'Almacenamiento', desc:'USB 3.2 Gen2, 220MB/s, compatible Time Machine, cifrado AES.',                  precio:89990,   icono:'💽', stock:33, off:15,   rating:4.5, reviews:177,
    specs: [['Capacidad','4TB'],['Interfaz','USB 3.2 Gen2'],['Velocidad','220 MB/s'],['Cifrado','AES 256-bit'],['Time Machine','Compatible'],['Formato','NTFS/exFAT'],['Garantía','2 años'],['Peso','230g']] },
  { id:15, nombre:'Switch 8 Puertos 2.5G',  marca:'TP-Link',  cat:'Redes',          desc:'8x 2.5GbE, 2x SFP+ 10G, gestión web, VLAN, QoS.',                              precio:149990,  icono:'🔁', stock:11, off:null,  rating:4.4, reviews:42,
    specs: [['Puertos','8x 2.5GbE'],['Uplink','2x SFP+ 10G'],['Gestión','Web + CLI'],['VLAN','802.1Q'],['QoS','L2/L3'],['PoE','No'],['Ventilador','Fanless'],['Rack','1U 19"']] },
  { id:16, nombre:'Pad Mouse XL RGB',       marca:'Razer',    cat:'Accesorios',     desc:'900x400mm, superficie de tela premium, base antideslizante, RGB 14 zonas.',     precio:29990,   icono:'🟦', stock:62, off:null,  rating:4.3, reviews:234,
    specs: [['Dimensiones','900x400x3mm'],['Material','Micro-textura tela'],['Base','Goma antideslizante'],['RGB','14 zonas Chroma'],['Cable','USB-A 1.8m'],['Lavable','No'],['Velocidad','Optimizado todos DPI'],['Peso','390g']] },
]

const fmt = (v) => '$' + Math.round(v).toLocaleString('es-CL')

function ProductoDetalle() {
  const { id }          = useParams()
  const [tab, setTab]   = useState('specs')
  const [qty, setQty]   = useState(1)
  const p = productos.find(x => x.id === Number(id))

  if (!p) return (
    <main className="detalle-notfound">
      <div>Producto no encontrado</div>
      <Link to="/catalogo">← Volver al catálogo</Link>
    </main>
  )

  const precioOriginal = p.off ? Math.round(p.precio / (1 - p.off / 100)) : null

  return (
    <main className="detalle">

      {/* ── BREADCRUMB ── */}
      <div className="detalle-breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo">Catálogo</Link>
        <span>/</span>
        <span>{p.nombre}</span>
      </div>

      {/* ── BODY ── */}
      <div className="detalle-body">

        {/* ── GALERÍA ── */}
        <div className="detalle-galeria">
          <div className="galeria-main">
            <span className="galeria-icono">{p.icono}</span>
            {p.off && <span className="detalle-badge-off">-{p.off}%</span>}
          </div>
          <div className="galeria-thumbs">
            {[p.icono, p.icono, p.icono, p.icono].map((ic, i) => (
              <div key={i} className={`galeria-thumb ${i === 0 ? 'active' : ''}`}>
                <span>{ic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── INFO ── */}
        <div className="detalle-info">
          <div className="detalle-marca">{p.marca}</div>
          <h1 className="detalle-nombre">{p.nombre}</h1>

          <div className="detalle-rating">
            <span className="stars">{'★'.repeat(Math.floor(p.rating))}{'☆'.repeat(5 - Math.floor(p.rating))}</span>
            <span className="rating-val">{p.rating}</span>
            <span className="rating-reviews">({p.reviews} reviews)</span>
            <span className="detalle-id">ID: {String(p.id).padStart(5,'0')}</span>
          </div>

          <div className="detalle-precio-block">
            {precioOriginal && (
              <div className="precio-original">{fmt(precioOriginal)}</div>
            )}
            <div className="precio-main">
              <span className="precio-cur">CLP </span>
              {fmt(p.precio)}
            </div>
            {p.off && (
              <div className="precio-ahorro">
                Ahorras {fmt(precioOriginal - p.precio)} ({p.off}% off)
              </div>
            )}
          </div>

          <div className="detalle-metodos">
            <div className="metodos-title">MÉTODOS DE PAGO</div>
            <div className="metodos-list">
              <span className="metodo-badge metodo-webpay">Webpay</span>
              <span className="metodo-badge metodo-mp">MercadoPago</span>
              <span className="metodo-badge metodo-khipu">Khipu</span>
            </div>
          </div>

          <div className="detalle-despacho">
            <div className="despacho-row">
              <span className="despacho-icon">🚚</span>
              <div>
                <div className="despacho-nombre">Despacho a domicilio</div>
                <div className="despacho-info">48h · Todo Chile</div>
              </div>
              <span className="despacho-disponible">Disponible</span>
            </div>
            <div className="despacho-row">
              <span className="despacho-icon">🏪</span>
              <div>
                <div className="despacho-nombre">Retiro en tienda</div>
                <div className="despacho-info">Gratis · Mismo día</div>
              </div>
              <span className="despacho-disponible">Disponible</span>
            </div>
          </div>

          <div className="detalle-stock">
            <span className="stock-dot"></span>
            {p.stock} unidades disponibles
          </div>

          <div className="detalle-acciones">
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => Math.min(p.stock, q+1))}>+</button>
            </div>
            <button className="btn-agregar">🛒 Agregar al carrito</button>
          </div>

          <button className="btn-comprar">⚡ Comprar ahora</button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="detalle-tabs">
        <div className="tabs-header">
          {['specs','desc','reviews'].map(t => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'specs'   && 'Especificaciones'}
              {t === 'desc'    && 'Descripción'}
              {t === 'reviews' && `Reviews (${p.reviews})`}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {tab === 'specs' && (
            <div className="specs-grid">
              {p.specs.map(([key, val]) => (
                <div key={key} className="spec-row">
                  <div className="spec-key">{key}</div>
                  <div className="spec-val">{val}</div>
                </div>
              ))}
            </div>
          )}
          {tab === 'desc' && (
            <div className="desc-content">
              <p>{p.desc}</p>
              <p>Producto original con garantía oficial {p.marca}. Incluye todos los accesorios de fábrica y manual de usuario.</p>
            </div>
          )}
          {tab === 'reviews' && (
            <div className="reviews-content">
              <div className="reviews-summary">
                <div className="reviews-score">{p.rating}</div>
                <div>
                  <div className="stars large">{'★'.repeat(Math.floor(p.rating))}</div>
                  <div className="reviews-total">{p.reviews} reviews</div>
                </div>
              </div>
              {[5,4,3].map(r => (
                <div key={r} className="review-item">
                  <div className="review-header">
                    <span className="stars small">{'★'.repeat(r)}</span>
                    <span className="review-autor">Usuario verificado</span>
                  </div>
                  <div className="review-txt">Excelente producto, cumple con todo lo prometido. La calidad es muy buena para el precio.</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </main>
  )
}

export default ProductoDetalle