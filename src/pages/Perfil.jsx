import { useState }          from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth }           from '../context/AuthContext'
import '../styles/Perfil.css'

const REGIONES = ['Región Metropolitana','Valparaíso','Biobío','La Araucanía','Los Lagos','Antofagasta','Coquimbo','O\'Higgins','Maule','Los Ríos','Atacama','Tarapacá','Arica y Parinacota','Ñuble','Aysén','Magallanes']

function Perfil() {
  const { user, logout, actualizarPerfil, agregarDireccion, eliminarDireccion, setPredeterminada } = useAuth()
  const navigate    = useNavigate()
  const [params]    = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') || 'perfil')
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({
    nombre:   user?.nombre   || '',
    apellido: user?.apellido || '',
    email:    user?.email    || '',
    telefono: user?.telefono || '',
  })
  const [modalDir, setModalDir]   = useState(false)
  const [dirForm, setDirForm]     = useState({
    alias:'', calle:'', numero:'', depto:'', comuna:'', ciudad:'', region:'', codigoPostal:''
  })
  const [dirErrors, setDirErrors] = useState({})
  const [saved, setSaved]         = useState(false)

  if (!user) {
    navigate('/login')
    return null
  }

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSavePerfil = (e) => {
    e.preventDefault()
    actualizarPerfil({ ...form, avatar: form.nombre?.[0]?.toUpperCase() })
    setEditando(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleDirChange = (e) =>
    setDirForm({ ...dirForm, [e.target.name]: e.target.value })

  const validateDir = () => {
    const errs = {}
    if (!dirForm.alias.trim())  errs.alias  = 'Requerido'
    if (!dirForm.calle.trim())  errs.calle  = 'Requerido'
    if (!dirForm.numero.trim()) errs.numero = 'Requerido'
    if (!dirForm.comuna.trim()) errs.comuna = 'Requerido'
    if (!dirForm.ciudad.trim()) errs.ciudad = 'Requerido'
    if (!dirForm.region)        errs.region = 'Requerido'
    return errs
  }

  const handleGuardarDir = (e) => {
    e.preventDefault()
    const errs = validateDir()
    if (Object.keys(errs).length > 0) { setDirErrors(errs); return }
    agregarDireccion(dirForm)
    setModalDir(false)
    setDirForm({ alias:'', calle:'', numero:'', depto:'', comuna:'', ciudad:'', region:'', codigoPostal:'' })
    setDirErrors({})
  }

  return (
    <main className="perfil">

      {/* ── HEADER ── */}
      <div className="perfil-header">
        <div className="perfil-header-inner">
          <div className="perfil-avatar-big">{user.avatar}</div>
          <div>
            <h1 className="perfil-nombre">{user.nombre} {user.apellido}</h1>
            <div className="perfil-email">{user.email}</div>
            <div className="perfil-meta">
              <span className="perfil-badge">Cliente verificado ✓</span>
              <span className="perfil-dirs">{user.direcciones.length} dirección(es) guardadas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="perfil-body">

        {/* ── SIDEBAR ── */}
        <aside className="perfil-sidebar">
          {[
            { key:'perfil',      icon:'👤', label:'Mi perfil' },
            { key:'direcciones', icon:'📍', label:'Mis direcciones' },
            { key:'pedidos',     icon:'📦', label:'Mis pedidos' },
            { key:'seguridad',   icon:'🔒', label:'Seguridad' },
          ].map(item => (
            <button
              key={item.key}
              className={`perfil-nav-btn ${tab === item.key ? 'active' : ''}`}
              onClick={() => setTab(item.key)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="perfil-sidebar-divider"></div>
          <button className="perfil-nav-btn perfil-logout" onClick={() => { logout(); navigate('/') }}>
            <span>🚪</span> Cerrar sesión
          </button>
        </aside>

        {/* ── CONTENIDO ── */}
        <div className="perfil-content">

          {/* ─ TAB PERFIL ─ */}
          {tab === 'perfil' && (
            <div className="perfil-section">
              <div className="perfil-section-header">
                <div>
                  <div className="perfil-section-title">Información personal</div>
                  <div className="perfil-section-sub">Administra tus datos personales</div>
                </div>
                {!editando && (
                  <button className="perfil-edit-btn" onClick={() => setEditando(true)}>
                    ✏️ Editar
                  </button>
                )}
              </div>

              {saved && (
                <div className="perfil-success">✓ Perfil actualizado correctamente</div>
              )}

              <form onSubmit={handleSavePerfil}>
                <div className="perfil-fields">
                  <div className="perfil-field">
                    <label className="perfil-label">NOMBRE</label>
                    <input
                      name="nombre" value={form.nombre}
                      onChange={handleFormChange}
                      disabled={!editando}
                      className={`perfil-input ${!editando ? 'disabled' : ''}`}
                    />
                  </div>
                  <div className="perfil-field">
                    <label className="perfil-label">APELLIDO</label>
                    <input
                      name="apellido" value={form.apellido}
                      onChange={handleFormChange}
                      disabled={!editando}
                      className={`perfil-input ${!editando ? 'disabled' : ''}`}
                    />
                  </div>
                  <div className="perfil-field perfil-field-full">
                    <label className="perfil-label">CORREO ELECTRÓNICO</label>
                    <input
                      name="email" type="email" value={form.email}
                      onChange={handleFormChange}
                      disabled={!editando}
                      className={`perfil-input ${!editando ? 'disabled' : ''}`}
                    />
                  </div>
                  <div className="perfil-field perfil-field-full">
                    <label className="perfil-label">TELÉFONO <span className="perfil-optional">(opcional)</span></label>
                    <input
                      name="telefono" type="tel" value={form.telefono}
                      onChange={handleFormChange}
                      disabled={!editando}
                      placeholder="+56 9 1234 5678"
                      className={`perfil-input ${!editando ? 'disabled' : ''}`}
                    />
                  </div>
                </div>

                {editando && (
                  <div className="perfil-actions">
                    <button type="button" className="perfil-cancel"
                      onClick={() => { setEditando(false); setForm({ nombre: user.nombre, apellido: user.apellido, email: user.email, telefono: user.telefono || '' }) }}>
                      Cancelar
                    </button>
                    <button type="submit" className="perfil-save">Guardar cambios →</button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ─ TAB DIRECCIONES ─ */}
          {tab === 'direcciones' && (
            <div className="perfil-section">
              <div className="perfil-section-header">
                <div>
                  <div className="perfil-section-title">Mis direcciones</div>
                  <div className="perfil-section-sub">Gestiona tus direcciones de despacho</div>
                </div>
                <button className="perfil-edit-btn" onClick={() => setModalDir(true)}>
                  + Agregar dirección
                </button>
              </div>

              {user.direcciones.length === 0 ? (
                <div className="perfil-empty">
                  <div className="perfil-empty-icon">📍</div>
                  <div className="perfil-empty-txt">No tienes direcciones guardadas</div>
                  <div className="perfil-empty-sub">Agrega una dirección para agilizar tus compras</div>
                  <button className="perfil-save" onClick={() => setModalDir(true)}>
                    + Agregar primera dirección
                  </button>
                </div>
              ) : (
                <div className="dir-list">
                  {user.direcciones.map(dir => (
                    <div key={dir.id} className={`dir-card ${dir.predeterminada ? 'dir-default' : ''}`}>
                      {dir.predeterminada && (
                        <div className="dir-default-badge">⭐ Predeterminada</div>
                      )}
                      <div className="dir-alias">{dir.alias}</div>
                      <div className="dir-address">
                        {dir.calle} {dir.numero}{dir.depto ? `, Depto ${dir.depto}` : ''}
                      </div>
                      <div className="dir-location">
                        {dir.comuna}, {dir.ciudad} · {dir.region}
                      </div>
                      {dir.codigoPostal && (
                        <div className="dir-cp">CP: {dir.codigoPostal}</div>
                      )}
                      <div className="dir-actions">
                        {!dir.predeterminada && (
                          <button className="dir-btn" onClick={() => setPredeterminada(dir.id)}>
                            Usar como predeterminada
                          </button>
                        )}
                        <button className="dir-btn dir-btn-danger" onClick={() => eliminarDireccion(dir.id)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─ TAB PEDIDOS ─ */}
          {tab === 'pedidos' && (
            <div className="perfil-section">
              <div className="perfil-section-header">
                <div>
                  <div className="perfil-section-title">Mis pedidos</div>
                  <div className="perfil-section-sub">Historial de compras</div>
                </div>
              </div>
              <div className="perfil-empty">
                <div className="perfil-empty-icon">📦</div>
                <div className="perfil-empty-txt">No tienes pedidos aún</div>
                <div className="perfil-empty-sub">¡Realiza tu primera compra!</div>
                <button className="perfil-save" onClick={() => navigate('/catalogo')}>
                  Ir al catálogo →
                </button>
              </div>
            </div>
          )}

          {/* ─ TAB SEGURIDAD ─ */}
          {tab === 'seguridad' && (
            <div className="perfil-section">
              <div className="perfil-section-header">
                <div>
                  <div className="perfil-section-title">Seguridad</div>
                  <div className="perfil-section-sub">Administra tu contraseña y acceso</div>
                </div>
              </div>
              <div className="perfil-fields">
                <div className="perfil-field perfil-field-full">
                  <label className="perfil-label">CONTRASEÑA ACTUAL</label>
                  <input type="password" className="perfil-input" placeholder="••••••••" />
                </div>
                <div className="perfil-field">
                  <label className="perfil-label">NUEVA CONTRASEÑA</label>
                  <input type="password" className="perfil-input" placeholder="Mínimo 8 caracteres" />
                </div>
                <div className="perfil-field">
                  <label className="perfil-label">CONFIRMAR CONTRASEÑA</label>
                  <input type="password" className="perfil-input" placeholder="Repite la contraseña" />
                </div>
              </div>
              <div className="perfil-actions">
                <button className="perfil-save">Cambiar contraseña →</button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── MODAL DIRECCIÓN ── */}
      {modalDir && (
        <div className="modal-overlay" onClick={() => setModalDir(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-top"></div>
            <div className="modal-header">
              <div className="modal-title">Nueva dirección</div>
              <button className="modal-close" onClick={() => setModalDir(false)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleGuardarDir}>
              <div className="modal-field">
                <label className="perfil-label">ALIAS <span className="perfil-optional">(ej: Casa, Trabajo)</span></label>
                <input name="alias" value={dirForm.alias} onChange={handleDirChange}
                  placeholder="ej: Mi casa" className={`perfil-input ${dirErrors.alias ? 'input-err' : ''}`}
                />
                {dirErrors.alias && <div className="field-error">{dirErrors.alias}</div>}
              </div>

              <div className="modal-row">
                <div className="modal-field">
                  <label className="perfil-label">CALLE</label>
                  <input name="calle" value={dirForm.calle} onChange={handleDirChange}
                    placeholder="Av. Libertador" className={`perfil-input ${dirErrors.calle ? 'input-err' : ''}`}
                  />
                  {dirErrors.calle && <div className="field-error">{dirErrors.calle}</div>}
                </div>
                <div className="modal-field modal-field-sm">
                  <label className="perfil-label">NÚMERO</label>
                  <input name="numero" value={dirForm.numero} onChange={handleDirChange}
                    placeholder="1234" className={`perfil-input ${dirErrors.numero ? 'input-err' : ''}`}
                  />
                  {dirErrors.numero && <div className="field-error">{dirErrors.numero}</div>}
                </div>
                <div className="modal-field modal-field-sm">
                  <label className="perfil-label">DEPTO <span className="perfil-optional">(opc.)</span></label>
                  <input name="depto" value={dirForm.depto} onChange={handleDirChange}
                    placeholder="301" className="perfil-input"
                  />
                </div>
              </div>

              <div className="modal-row">
                <div className="modal-field">
                  <label className="perfil-label">COMUNA</label>
                  <input name="comuna" value={dirForm.comuna} onChange={handleDirChange}
                    placeholder="Las Condes" className={`perfil-input ${dirErrors.comuna ? 'input-err' : ''}`}
                  />
                  {dirErrors.comuna && <div className="field-error">{dirErrors.comuna}</div>}
                </div>
                <div className="modal-field">
                  <label className="perfil-label">CIUDAD</label>
                  <input name="ciudad" value={dirForm.ciudad} onChange={handleDirChange}
                    placeholder="Santiago" className={`perfil-input ${dirErrors.ciudad ? 'input-err' : ''}`}
                  />
                  {dirErrors.ciudad && <div className="field-error">{dirErrors.ciudad}</div>}
                </div>
              </div>

              <div className="modal-row">
                <div className="modal-field">
                  <label className="perfil-label">REGIÓN</label>
                  <select name="region" value={dirForm.region} onChange={handleDirChange}
                    className={`perfil-input ${dirErrors.region ? 'input-err' : ''}`}
                  >
                    <option value="">Seleccionar región</option>
                    {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {dirErrors.region && <div className="field-error">{dirErrors.region}</div>}
                </div>
                <div className="modal-field modal-field-sm">
                  <label className="perfil-label">CÓDIGO POSTAL <span className="perfil-optional">(opc.)</span></label>
                  <input name="codigoPostal" value={dirForm.codigoPostal} onChange={handleDirChange}
                    placeholder="8320000" className="perfil-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="perfil-cancel" onClick={() => setModalDir(false)}>
                  Cancelar
                </button>
                <button type="submit" className="perfil-save">Guardar dirección →</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  )
}

export default Perfil