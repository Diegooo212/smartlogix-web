import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar          from './components/Navbar'
import Home            from './pages/Home'
import Catalogo        from './pages/Catalogo'
import ProductoDetalle from './pages/ProductoDetalle'
import Login           from './pages/Login'
import Register        from './pages/Register'
import Perfil          from './pages/Perfil'
import Carrito         from './pages/Carrito'
import Checkout        from './pages/Checkout'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/catalogo"      element={<Catalogo />} />
            <Route path="/producto/:id"  element={<ProductoDetalle />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/perfil"        element={<Perfil />} />
            <Route path="/carrito"       element={<Carrito />} />
            <Route path="/checkout"      element={<Checkout />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App