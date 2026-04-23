import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (datos) => {
    setUser({
      id:        1,
      nombre:    datos.nombre    || 'Usuario',
      apellido:  datos.apellido  || '',
      email:     datos.email,
      telefono:  datos.telefono  || '',
      avatar:    datos.nombre?.[0]?.toUpperCase() || 'U',
      direcciones: [],
    })
  }

  const logout = () => setUser(null)

  const agregarDireccion = (dir) => {
    setUser(prev => ({
      ...prev,
      direcciones: [
        ...prev.direcciones,
        { ...dir, id: Date.now(), predeterminada: prev.direcciones.length === 0 }
      ]
    }))
  }

  const eliminarDireccion = (id) => {
    setUser(prev => ({
      ...prev,
      direcciones: prev.direcciones.filter(d => d.id !== id)
    }))
  }

  const setPredeterminada = (id) => {
    setUser(prev => ({
      ...prev,
      direcciones: prev.direcciones.map(d => ({ ...d, predeterminada: d.id === id }))
    }))
  }

  const actualizarPerfil = (datos) => {
    setUser(prev => ({ ...prev, ...datos }))
  }

  return (
    <AuthContext.Provider value={{
      user, login, logout,
      agregarDireccion, eliminarDireccion,
      setPredeterminada, actualizarPerfil
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)