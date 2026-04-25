import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart }  from '../context/CartContext'
import { useAuth }  from '../context/AuthContext'
import '../styles/Checkout.css'

const fmt = (v) => '$' + Math.round(v).toLocaleString('es-CL')

const REGIONES = ['Región Metropolitana','Valparaíso','Biobío','La Araucanía','Los Lagos','Antofagasta','Coquimbo','O\'Higgins','Maule','Los Ríos','Atacama','Tarapacá','Arica y Parinacota','Ñuble','Aysén','Magallanes']

function Checkout() {
  const { items, total, vaciar }              = useCart()
  const { user, agregarDireccion }            = useAuth()
  const navigate                              = useNavigate()

  const [step, setStep]                       = useState(1)
  const [dirSeleccionada, setDirSeleccionada] = useState(
    user?.direcciones?.find(d => d.predeterminada)?.id || null
  )
  const [usarNuevaDir, setUsarNuevaDir]       = useState(user?.direcciones?.length === 0)
  const [nuevaDir, setNuevaDir]               = useState({
    alias:'', calle:'', numero:'', depto:'', comuna:'', ciudad:'', region:'', codigoPostal:''
  })
  const [dirErrors, setDirErrors]             = useState({})
  const [metodoPago, setMetodoPago]           = useState('webpay')
  const [guardandoDir, setGuardandoDir]       = useState(false)
  const [pedidoOk, setPedidoOk]               = useState(false)
  const [orderNum]                            = useState(() => Math.floor(100000 + Math.random() * 900000))

  const iva        = total * 0.19
  const despacho   = total >= 50000 ? 0 : 4990
  const totalFinal = total + iva + despacho

  if (!user)        { navigate('/login');    return null }
  if (items.length === 0 && !pedidoOk) { navigate('/carrito'); return null }

  /* ── VALIDAR DIRECCIÓN NUEVA ── */
  const validateDir = () => {
    const errs = {}
    if (!nuevaDir.calle.trim())  errs.calle  = 'Requerido'
    if (!nuevaDir.numero.trim()) errs.numero = 'Requerido'
    if (!nuevaDir.comuna.trim()) errs.comuna = 'Requerido'
    if (!nuevaDir.ciudad.trim()) errs.ciudad = 'Requerido'
    if (!nuevaDir.region)        errs.region = 'Requerido'
    return errs
  }

  const handleNuevaDirChange = (e) => {
    setNuevaDir({ ...nuevaDir, [e.target.name]: e.target.value })
    setDirErrors({ ...dirErrors, [e.target.name]: '' })
  }

  /* ── PASO 1 → 2 ── */
  const handleSiguientePaso = () => {
    if (usarNuevaDir) {
      const errs = validateDir()
      if (Object.keys(errs).length > 0) { setDirErrors(errs); return }
      if (guardandoDir) {
        agregarDireccion({ ...nuevaDir, alias: nuevaDir.alias || 'Mi dirección' })
      }
    } else {
      if (!dirSeleccionada) {
        alert('Selecciona una dirección de despacho')
        return
      }
    }
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── CONFIRMAR COMPRA ── */
  const handleConfirmar = () => {
    setStep(3)
    vaciar()
    setPedidoOk(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const dirConfirmada = usarNuevaDir
    ? nuevaDir
    : user.direcciones.find(d => d.id === dirSeleccionada)

  /* ── PASO 3: ÉXITO ── */
  if (step === 3) {
    return (
      <main className="checkout-page">
        <div className="checkout-success">
          <div className="success-icon">✓</div>
          <h1 className="success-title">¡Pedido confirmado!</h1>
          <p className="success-sub">Tu orden ha sido procesada correctamente</p>
          <div className="success-card">
            <div className="success-card-top"></div>
            <div className="success-row">
              <span>Número de orden</span>
              <span className="success-val">#{orderNum}</span>
            </div>
            <div className="success-row">
              <span>Total pagado</span>
              <span className="success-val">{fmt(totalFinal)}</span>
            </div>
            <div className="success-row">
              <span>Método de pago</span>
              <span className="success-val" style={{textTransform:'capitalize'}}>{metodoPago}</span>
            </div>
            <div className="success-row">
              <span>Dirección de despacho</span>
              <span className="success-val">
                {dirConfirmada?.calle} {dirConfirmada?.numero}, {dirConfirmada?.comuna}
              </span>
            </div>
            <div className="success-row">
              <span>Tiempo estimado</span>
              <span className="success-val" style={{color:'#4ade80'}}>48 horas hábiles</span>
            </div>
          </div>
          <p className="success-email">
            Se enviará una confirmación a <strong>{user.email}</strong>
          </p>
          <div className="success-btns">
            <Link to="/perfil?tab=pedidos" className="btn-ver-pedidos">Ver mis pedidos</Link>
            <Link to="/" className="btn-volver-home">Volver al inicio →</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="checkout-page">

      {/* ── HEADER ── */}
      <div className="checkout-header">
        <div className="checkout-breadcrumb">
          <Link to="/">Inicio</Link><span>/</span>
          <Link to="/carrito">Carrito</Link><span>/</span>
          <span>Checkout</span>
        </div>
        <h1 className="checkout-title">Finalizar compra</h1>

        {/* Steps */}
        <div className="checkout-steps">
          <div className={`ch-step ${step >= 1 ? 'active' : ''}`}>
            <div className="ch-step-num">1</div>
            <div className="ch-step-label">Dirección</div>
          </div>
          <div className="ch-step-line"></div>
          <div className={`ch-step ${step >= 2 ? 'active' : ''}`}>
            <div className="ch-step-num">2</div>
            <div className="ch-step-label">Pago</div>
          </div>
          <div className="ch-step-line"></div>
          <div className={`ch-step ${step >= 3 ? 'active' : ''}`}>
            <div className="ch-step-num">3</div>
            <div className="ch-step-label">Confirmación</div>
          </div>
        </div>
      </div>

      <div className="checkout-body">

        {/* ── PASO 1: DIRECCIÓN ── */}
        {step === 1 && (
          <div className="checkout-content">
            <div className="checkout-section">
              <div className="checkout-section-top"></div>
              <div className="checkout-section-title">📍 Dirección de despacho</div>

              {/* Direcciones guardadas */}
              {user.direcciones.length > 0 && (
                <>
                  <div className="dir-opciones">
                    {user.direcciones.map(dir => (
                      <div
                        key={dir.id}
                        className={`dir-opcion ${dirSeleccionada === dir.id && !usarNuevaDir ? 'selected' : ''}`}
                        onClick={() => { setDirSeleccionada(dir.id); setUsarNuevaDir(false) }}
                      >
                        <div className="dir-opcion-radio">
                          {dirSeleccionada === dir.id && !usarNuevaDir && <div className="radio-dot"></div>}
                        </div>
                        <div className="dir-opcion-info">
                          <div className="dir-opcion-alias">
                            {dir.alias}
                            {dir.predeterminada && <span className="dir-pred-tag">Predeterminada</span>}
                          </div>
                          <div className="dir-opcion-addr">
                            {dir.calle} {dir.numero}{dir.depto ? `, Depto ${dir.depto}` : ''}
                          </div>
                          <div className="dir-opcion-loc">
                            {dir.comuna}, {dir.ciudad} · {dir.region}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div
                      className={`dir-opcion dir-opcion-nueva ${usarNuevaDir ? 'selected' : ''}`}
                      onClick={() => { setUsarNuevaDir(true); setDirSeleccionada(null) }}
                    >
                      <div className="dir-opcion-radio">
                        {usarNuevaDir && <div className="radio-dot"></div>}
                      </div>
                      <div className="dir-opcion-info">
                        <div className="dir-opcion-alias">+ Usar otra dirección</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Formulario nueva dirección */}
              {(usarNuevaDir || user.direcciones.length === 0) && (
                <div className="nueva-dir-form">
                  {user.direcciones.length === 0 && (
                    <div className="dir-required-notice">
                      ⚠ Necesitas agregar una dirección para continuar
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">CALLE</label>
                      <input name="calle" value={nuevaDir.calle}
                        onChange={handleNuevaDirChange} placeholder="Av. Libertador"
                        className={`form-input ${dirErrors.calle ? 'input-err' : ''}`}
                      />
                      {dirErrors.calle && <div className="field-err">{dirErrors.calle}</div>}
                    </div>
                    <div className="form-field form-field-sm">
                      <label className="form-label">NÚMERO</label>
                      <input name="numero" value={nuevaDir.numero}
                        onChange={handleNuevaDirChange} placeholder="1234"
                        className={`form-input ${dirErrors.numero ? 'input-err' : ''}`}
                      />
                      {dirErrors.numero && <div className="field-err">{dirErrors.numero}</div>}
                    </div>
                    <div className="form-field form-field-sm">
                      <label className="form-label">DEPTO <span className="opc">(opc.)</span></label>
                      <input name="depto" value={nuevaDir.depto}
                        onChange={handleNuevaDirChange} placeholder="301"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">COMUNA</label>
                      <input name="comuna" value={nuevaDir.comuna}
                        onChange={handleNuevaDirChange} placeholder="Las Condes"
                        className={`form-input ${dirErrors.comuna ? 'input-err' : ''}`}
                      />
                      {dirErrors.comuna && <div className="field-err">{dirErrors.comuna}</div>}
                    </div>
                    <div className="form-field">
                      <label className="form-label">CIUDAD</label>
                      <input name="ciudad" value={nuevaDir.ciudad}
                        onChange={handleNuevaDirChange} placeholder="Santiago"
                        className={`form-input ${dirErrors.ciudad ? 'input-err' : ''}`}
                      />
                      {dirErrors.ciudad && <div className="field-err">{dirErrors.ciudad}</div>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">REGIÓN</label>
                      <select name="region" value={nuevaDir.region}
                        onChange={handleNuevaDirChange}
                        className={`form-input ${dirErrors.region ? 'input-err' : ''}`}
                      >
                        <option value="">Seleccionar región</option>
                        {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      {dirErrors.region && <div className="field-err">{dirErrors.region}</div>}
                    </div>
                    <div className="form-field form-field-sm">
                      <label className="form-label">CÓDIGO POSTAL <span className="opc">(opc.)</span></label>
                      <input name="codigoPostal" value={nuevaDir.codigoPostal}
                        onChange={handleNuevaDirChange} placeholder="8320000"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <label className="guardar-check">
                    <input type="checkbox" checked={guardandoDir}
                      onChange={e => setGuardandoDir(e.target.checked)}
                    />
                    <span>Guardar esta dirección en mi perfil</span>
                  </label>
                </div>
              )}

              <div className="checkout-section-actions">
                <Link to="/carrito" className="btn-volver">← Volver al carrito</Link>
                <button className="btn-siguiente" onClick={handleSiguientePaso}>
                  Continuar al pago →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PASO 2: PAGO ── */}
        {step === 2 && (
          <div className="checkout-content">
            <div className="checkout-section">
              <div className="checkout-section-top"></div>
              <div className="checkout-section-title">📍 Dirección seleccionada</div>
              <div className="dir-confirmada">
                <span>📍</span>
                <div>
                  <div className="dir-conf-addr">
                    {dirConfirmada?.calle} {dirConfirmada?.numero}
                    {dirConfirmada?.depto ? `, Depto ${dirConfirmada.depto}` : ''}
                  </div>
                  <div className="dir-conf-loc">
                    {dirConfirmada?.comuna}, {dirConfirmada?.ciudad} · {dirConfirmada?.region}
                  </div>
                </div>
                <button className="btn-cambiar-dir" onClick={() => setStep(1)}>Cambiar</button>
              </div>
            </div>

            <div className="checkout-section" style={{marginTop:'1rem'}}>
              <div className="checkout-section-top"></div>
              <div className="checkout-section-title">💳 Método de pago</div>

              <div className="pago-opciones">
                {[
                  { id:'webpay',      label:'Webpay',      desc:'Débito y crédito nacional',    icon:'💳' },
                  { id:'mercadopago', label:'MercadoPago', desc:'Billetera digital y cuotas',   icon:'💰' },
                  { id:'khipu',       label:'Khipu',       desc:'Transferencia bancaria directa', icon:'🏦' },
                ].map(m => (
                  <div
                    key={m.id}
                    className={`pago-opcion ${metodoPago === m.id ? 'selected' : ''}`}
                    onClick={() => setMetodoPago(m.id)}
                  >
                    <div className="pago-radio">
                      {metodoPago === m.id && <div className="radio-dot"></div>}
                    </div>
                    <span className="pago-icon">{m.icon}</span>
                    <div className="pago-info">
                      <div className="pago-label">{m.label}</div>
                      <div className="pago-desc">{m.desc}</div>
                    </div>
                    {metodoPago === m.id && (
                      <span className="pago-selected-badge">Seleccionado</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pago-seguro">
                🔒 Pago procesado con cifrado SSL de 256 bits. Tus datos están protegidos.
              </div>

              <div className="checkout-section-actions">
                <button className="btn-volver" onClick={() => setStep(1)}>← Volver</button>
                <button className="btn-siguiente" onClick={handleConfirmar}>
                  Confirmar y pagar {fmt(totalFinal)} →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── RESUMEN LATERAL ── */}
        <div className="checkout-resumen">
          <div className="resumen-card">
            <div className="resumen-top-bar"></div>
            <div className="resumen-titulo">Resumen del pedido</div>

            <div className="resumen-items">
              {items.map(item => (
                <div key={item.id} className="resumen-item">
                  <span className="resumen-item-icon">{item.icono}</span>
                  <div className="resumen-item-info">
                    <div className="resumen-item-nombre">{item.nombre}</div>
                    <div className="resumen-item-qty">x{item.cantidad}</div>
                  </div>
                  <div className="resumen-item-precio">{fmt(item.precio * item.cantidad)}</div>
                </div>
              ))}
            </div>

            <div className="resumen-calculos">
              <div className="resumen-row">
                <span>Subtotal</span><span>{fmt(total)}</span>
              </div>
              <div className="resumen-row">
                <span>IVA (19%)</span><span>{fmt(iva)}</span>
              </div>
              <div className="resumen-row">
                <span>Despacho</span>
                <span style={{color: despacho === 0 ? '#4ade80' : 'inherit'}}>
                  {despacho === 0 ? 'Gratis' : fmt(despacho)}
                </span>
              </div>
            </div>

            <div className="resumen-total-final">
              <span>TOTAL</span>
              <span>{fmt(totalFinal)}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default Checkout