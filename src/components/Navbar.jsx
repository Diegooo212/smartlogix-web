import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import '../styles/Navbar.css'

function Navbar() {
  const location          = useLocation()
  const navigate          = useNavigate()
  const { user, logout }  = useAuth()
  const { cantidad }      = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef           = useRef(null)

  const links = [
    { path: '/',         label: 'Inicio' },
    { path: '/catalogo', label: 'Catálogo' },
  ]

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="nav-dot"></span>
        SmartLogix
      </Link>

      <ul className="nav-links">
        {links.map(link => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        {user ? (
          <>
            {/* Carrito */}
            <Link to="/carrito" className="nav-btn-cart">
              <span className="cart-icon">🛒</span>
              {cantidad > 0 && <span className="cart-count">{cantidad}</span>}
            </Link>

            {/* Usuario */}
            <div className="nav-user-wrap" ref={menuRef}>
              <button
                className="nav-user-btn"
                onClick={() => setMenuOpen(o => !o)}
              >
                <div className="nav-avatar">{user.avatar}</div>
                <div className="nav-user-info">
                  <span className="nav-user-name">{user.nombre}</span>
                  <span className="nav-user-label">Mi cuenta ▾</span>
                </div>
              </button>

              {menuOpen && (
                <div className="nav-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{user.avatar}</div>
                    <div>
                      <div className="dropdown-name">{user.nombre} {user.apellido}</div>
                      <div className="dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/perfil"   className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <span>👤</span> Mi perfil
                  </Link>
                  <Link to="/perfil?tab=direcciones" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <span>📍</span> Mis direcciones
                  </Link>
                  <Link to="/carrito"  className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <span>🛒</span> Mi carrito
                    {cantidad > 0 && <span className="dropdown-badge">{cantidad}</span>}
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    <span>🚪</span> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/carrito" className="nav-btn-cart">
              <span className="cart-icon">🛒</span>
              {cantidad > 0 && <span className="cart-count">{cantidad}</span>}
            </Link>
            <Link to="/login"    className="nav-btn-outline">Iniciar sesión</Link>
            <Link to="/register" className="nav-btn-solid">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar