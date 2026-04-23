import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Register.css'

function Register() {
  const navigate    = useNavigate()
  const { login }   = useAuth()
  const [form, setForm] = useState({ nombre:'', apellido:'', email:'', password:'', confirmar:'' })
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [errors, setErrors]       = useState({})
  const [step, setStep]           = useState(1)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validateStep1 = () => {
    const errs = {}
    if (!form.nombre.trim())   errs.nombre   = 'El nombre es requerido'
    if (!form.apellido.trim()) errs.apellido = 'El apellido es requerido'
    if (!form.email.trim())    errs.email    = 'El correo es requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Correo inválido'
    return errs
  }

  const validateStep2 = () => {
    const errs = {}
    if (!form.password)                errs.password  = 'La contraseña es requerida'
    else if (form.password.length < 8) errs.password  = 'Mínimo 8 caracteres'
    if (form.password !== form.confirmar) errs.confirmar = 'Las contraseñas no coinciden'
    return errs
  }

  const handleNext = (e) => {
    e.preventDefault()
    const errs = validateStep1()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStep(2)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validateStep2()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => {
      login({ nombre: form.nombre, apellido: form.apellido, email: form.email })
      setLoading(false)
      navigate('/')
    }, 1500)
  }

  const strength = () => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 8)          s++
    if (/[A-Z]/.test(p))        s++
    if (/[0-9]/.test(p))        s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }

  const strengthLabel = ['', 'Débil', 'Regular', 'Buena', 'Fuerte']
  const strengthColor = ['', '#ff3d71', '#f59e0b', '#00d4ff', '#00ffc8']
  const s = strength()

  return (
    <main className="auth-page">
      <div className="auth-bg-grid"></div>
      <div className="auth-glow auth-glow-left"></div>
      <div className="auth-glow auth-glow-right"></div>

      <div className="auth-card register-card">
        <div className="auth-card-top"></div>

        <div className="auth-logo">
          <span className="auth-logo-dot"></span>
          SmartLogix
        </div>

        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-sub">Únete y accede a ofertas exclusivas</p>

        <div className="reg-steps">
          <div className={`reg-step ${step >= 1 ? 'active' : ''}`}>
            <div className="reg-step-num">1</div>
            <div className="reg-step-label">Datos personales</div>
          </div>
          <div className="reg-step-line"></div>
          <div className={`reg-step ${step >= 2 ? 'active' : ''}`}>
            <div className="reg-step-num">2</div>
            <div className="reg-step-label">Contraseña</div>
          </div>
        </div>

        {step === 1 && (
          <form className="auth-form" onSubmit={handleNext}>
            <div className="auth-fields-row">
              <div className="auth-field">
                <label className="auth-label">NOMBRE</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input type="text" name="nombre" placeholder="Tu nombre"
                    value={form.nombre} onChange={handleChange}
                    className={`auth-input ${errors.nombre ? 'input-error' : ''}`}
                  />
                </div>
                {errors.nombre && <div className="field-error">{errors.nombre}</div>}
              </div>
              <div className="auth-field">
                <label className="auth-label">APELLIDO</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input type="text" name="apellido" placeholder="Tu apellido"
                    value={form.apellido} onChange={handleChange}
                    className={`auth-input ${errors.apellido ? 'input-error' : ''}`}
                  />
                </div>
                {errors.apellido && <div className="field-error">{errors.apellido}</div>}
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">CORREO ELECTRÓNICO</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input type="email" name="email" placeholder="correo@ejemplo.com"
                  value={form.email} onChange={handleChange}
                  className={`auth-input ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>
            <button type="submit" className="auth-submit">Continuar →</button>
          </form>
        )}

        {step === 2 && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">CONTRASEÑA</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'} name="password"
                  placeholder="Mínimo 8 caracteres"
                  value={form.password} onChange={handleChange}
                  className={`auth-input ${errors.password ? 'input-error' : ''}`}
                />
                <button type="button" className="auth-eye" onClick={() => setShowPass(s => !s)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <div className="field-error">{errors.password}</div>}
              {form.password && (
                <div className="strength-wrap">
                  <div className="strength-bar">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="strength-seg"
                        style={{ background: i <= s ? strengthColor[s] : 'var(--border)' }}
                      />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthColor[s] }}>
                    {strengthLabel[s]}
                  </span>
                </div>
              )}
            </div>
            <div className="auth-field">
              <label className="auth-label">CONFIRMAR CONTRASEÑA</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'} name="confirmar"
                  placeholder="Repite tu contraseña"
                  value={form.confirmar} onChange={handleChange}
                  className={`auth-input ${errors.confirmar ? 'input-error' : ''}`}
                />
              </div>
              {errors.confirmar && <div className="field-error">{errors.confirmar}</div>}
            </div>
            <div className="auth-check-row">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms" className="auth-check-label">
                Acepto los <Link to="/terms" className="auth-link">Términos y condiciones</Link>
              </label>
            </div>
            <div className="auth-btns-row">
              <button type="button" className="auth-back" onClick={() => setStep(1)}>← Volver</button>
              <button type="submit" className={`auth-submit ${loading ? 'loading' : ''}`}
                disabled={loading} style={{ flex:1 }}>
                {loading ? <span className="auth-spinner"></span> : 'Crear cuenta →'}
              </button>
            </div>
          </form>
        )}

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="auth-link">Inicia sesión</Link>
        </p>
      </div>
    </main>
  )
}

export default Register