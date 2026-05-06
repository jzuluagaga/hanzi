"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { AuthResponse } from "./api"

export interface AuthUser {
  nombre: string
  email: string
  fotoUrl: string | null
  rol: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (response: AuthResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = "hanzi_token"
const USER_KEY = "hanzi_user"

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Restaurar sesión desde localStorage al montar
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)
    if (savedToken && savedUser) {
      try {
        const parsedUser: AuthUser = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsedUser)
        // Sincronizar cookie para que el middleware pueda leerla
        setCookie(TOKEN_KEY, savedToken)
        setCookie("hanzi_role", parsedUser.rol)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
  }, [])

  function login(response: AuthResponse) {
    const { token, nombre, email, fotoUrl, rol } = response
    const authUser: AuthUser = { nombre, email, fotoUrl, rol }

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(authUser))
    setCookie(TOKEN_KEY, token)
    setCookie("hanzi_role", rol)

    setToken(token)
    setUser(authUser)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    deleteCookie(TOKEN_KEY)
    deleteCookie("hanzi_role")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.rol === "ADMIN",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
