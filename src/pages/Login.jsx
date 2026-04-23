import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Login.css'

function Login() {
  const navigate      = useNavigate()
  const { login }     = useAuth()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Por favor completa todos los campos.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      login({ email: form.email, nombre: form.email.split('@')[0] })
      setLoading(false)
      navigate('/')
    }, 1500)
  }

  return (
    <main className="auth-page">
      <div className="auth-bg-grid"></div>
      <div className="auth-glow auth-glow-left"></div>
      <div className="auth-glow auth-glow-right"></div>

      <div className="auth-card">
        <div className="auth-card-top"></div>

        <div className="auth-logo">
          <span className="auth-logo-dot"></span>
          SmartLogix
        </div>

        <h1 className="auth-title">Bienvenido de vuelta</h1>
        <p className="auth-sub">Ingresa tus credenciales para continuar</p>

        {error && (
          <div className="auth-error"><span>⚠</span> {error}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">CORREO ELECTRÓNICO</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">✉</span>
              <input
                type="email" name="email"
                placeholder="correo@ejemplo.com"
                value={form.email} onChange={handleChange}
                className="auth-input" autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label">CONTRASEÑA</label>
              <Link to="/forgot" className="auth-forgot">¿Olvidaste tu contraseña?</Link>
            </div>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input
                type={showPass ? 'text' : 'password'} name="password"
                placeholder="Tu contraseña"
                value={form.password} onChange={handleChange}
                className="auth-input" autoComplete="current-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPass(s => !s)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className={`auth-submit ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? <span className="auth-spinner"></span> : 'Iniciar sesión →'}
          </button>
        </form>

        <div className="auth-divider"><span>o continúa con</span></div>

        <div className="auth-social">
          <button className="social-btn"><span>G</span> Google</button>
          <button className="social-btn"><span>f</span> Facebook</button>
        </div>

        <p className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="auth-link">Regístrate gratis</Link>
        </p>
      </div>
    </main>
  )
}

export default Login