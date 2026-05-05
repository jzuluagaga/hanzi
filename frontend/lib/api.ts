export interface AuthResponse {
  token: string
  nombre: string
  email: string
  fotoUrl: string | null
  rol: string
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

// Wraps fetch for authenticated calls — clears session and redirects to /login on 401
function authFetch(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, init).then(res => {
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("hanzi_token")
      localStorage.removeItem("hanzi_user")
      document.cookie = "hanzi_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "hanzi_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      window.location.href = "/login"
    }
    return res
  })
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    let message = "Error inesperado. Inténtalo de nuevo."
    try {
      const data = await res.json()
      if (data.mensaje) message = data.mensaje
    } catch {
      // mantener mensaje genérico
    }
    throw new Error(message)
  }

  return res.json() as Promise<T>
}

export function register(
  nombre: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/register", { nombre, email, password })
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", { email, password })
}

export function requestPasswordReset(email: string): Promise<{ mensaje: string }> {
  return request<{ mensaje: string }>("/api/auth/request-password-reset", { email })
}

export async function actualizarNombre(nombre: string, token: string): Promise<AuthResponse> {
  const res = await authFetch(`${BASE_URL}/api/me/nombre`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nombre }),
  })
  if (!res.ok) throw new Error("No se pudo actualizar el nombre")
  return res.json()
}

export async function cambiarPassword(
  passwordActual: string,
  passwordNueva: string,
  token: string
): Promise<void> {
  const res = await authFetch(`${BASE_URL}/api/me/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ passwordActual, passwordNueva }),
  })
  if (!res.ok) {
    let message = "Error al cambiar la contraseña"
    try {
      const data = await res.json()
      if (data.mensaje) message = data.mensaje
    } catch {}
    throw new Error(message)
  }
}

export interface ImportResult {
  created: number
  updated: number
  errors: number
  errorDetails: string[]
}

// ── Stats ────────────────────────────────────────────────────────────────────

export interface UserStatsDto {
  totalPalabras: number
  palabrasEstaSemana: number
  leccionesActivas: number
  actividadPorDia: { fecha: string; cantidad: number }[]
  categoriasHskIniciadas: number
}

export async function getStats(token: string): Promise<UserStatsDto> {
  const res = await authFetch(`${BASE_URL}/api/me/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("No se pudieron cargar las estadísticas")
  return res.json()
}

// ── Lecciones / Cartas ──────────────────────────────────────────────────────

export interface LeccionDto {
  id: number
  nombre: string
  orden: number
  totalCartas: number
  cartasEstudiadas: number
  cartasPendientesHoy: number
  healthStatus: "NUEVA" | "VERDE" | "AMARILLO" | "ROJO"
}

export interface CartaDto {
  id: number
  hanzi: string
  pinyin: string
  traduccion: string
  esPrimeraVez: boolean
}

export async function getLecciones(token: string): Promise<LeccionDto[]> {
  const res = await authFetch(`${BASE_URL}/api/lecciones`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("No se pudieron cargar las lecciones")
  return res.json()
}

export async function getCartasDeLeccion(leccionId: string, token: string): Promise<CartaDto[]> {
  const res = await authFetch(`${BASE_URL}/api/lecciones/${leccionId}/cartas`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("No se pudieron cargar las cartas de esta lección")
  return res.json()
}

export async function getCartasPendientes(leccionId: string, token: string): Promise<CartaDto[]> {
  const res = await authFetch(`${BASE_URL}/api/lecciones/${leccionId}/cartas/pendientes`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("No se pudieron cargar las cartas pendientes")
  return res.json()
}

export async function getCartasHsk(nivel: string, categoria: string, token: string): Promise<CartaDto[]> {
  const res = await authFetch(
    `${BASE_URL}/api/hsk/${nivel}/categorias/${encodeURIComponent(categoria)}/cartas`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) throw new Error("No se pudieron cargar las cartas HSK")
  return res.json()
}

export async function getCartasHskPendientes(nivel: string, categoria: string, token: string): Promise<CartaDto[]> {
  const res = await authFetch(
    `${BASE_URL}/api/hsk/${nivel}/categorias/${encodeURIComponent(categoria)}/cartas/pendientes`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) throw new Error("No se pudieron cargar las cartas HSK pendientes")
  return res.json()
}

export async function registrarRespuesta(
  cartaId: number,
  recordo: boolean,
  token: string
): Promise<void> {
  const res = await authFetch(`${BASE_URL}/api/cartas/${cartaId}/respuesta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recordo }),
  })
  if (!res.ok) throw new Error("No se pudo guardar la respuesta")
}

// ── HSK ──────────────────────────────────────────────────────────────────────

export interface HskCategoriaDto {
  categoria: string
  totalCartas: number
  cartas: CartaDto[]
}

export interface HskNivelDto {
  nivel: number
  totalCartas: number
  categorias: HskCategoriaDto[]
}

export interface HskCategoriaEstadoDto {
  totalCartas: number
  cartasPendientes: number
  healthStatus: "NUEVA" | "VERDE" | "AMARILLO" | "ROJO"
}

export async function getHskCategoriaEstado(nivel: string | number, categoria: string, token: string): Promise<HskCategoriaEstadoDto> {
  const res = await authFetch(
    `${BASE_URL}/api/hsk/${nivel}/categorias/${encodeURIComponent(categoria)}/estado`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) throw new Error("No se pudo cargar el estado de la categoría HSK")
  return res.json()
}

export async function getHskNivel(nivel: number, token: string): Promise<HskNivelDto> {
  const res = await authFetch(`${BASE_URL}/api/hsk/${nivel}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("No se pudo cargar el nivel HSK")
  return res.json()
}

// ── Admin ────────────────────────────────────────────────────────────────────

export async function deleteLeccion(id: number, token: string): Promise<void> {
  const res = await authFetch(`${BASE_URL}/api/admin/lecciones/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    let message = "Error al eliminar la lección"
    try {
      const data = await res.json()
      if (data.mensaje) message = data.mensaje
    } catch {}
    throw new Error(message)
  }
}

export async function replaceLeccion(id: number, file: File, token: string): Promise<ImportResult> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await authFetch(`${BASE_URL}/api/admin/lecciones/${id}/replace`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  if (!res.ok) {
    let message = "Error al reemplazar la lección"
    try {
      const data = await res.json()
      if (data.mensaje) message = data.mensaje
    } catch {}
    throw new Error(message)
  }

  return res.json() as Promise<ImportResult>
}

export async function importExcel(file: File, token: string): Promise<ImportResult> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await authFetch(`${BASE_URL}/api/admin/import`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  if (!res.ok) {
    let message = "Error al importar el archivo"
    try {
      const data = await res.json()
      if (data.mensaje) message = data.mensaje
    } catch {
      // mantener mensaje genérico
    }
    throw new Error(message)
  }

  return res.json() as Promise<ImportResult>
}

export async function importExcelHsk(file: File, token: string): Promise<ImportResult> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await authFetch(`${BASE_URL}/api/admin/import-hsk`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  if (!res.ok) {
    let message = "Error al importar el archivo HSK"
    try {
      const data = await res.json()
      if (data.mensaje) message = data.mensaje
    } catch {
      // mantener mensaje genérico
    }
    throw new Error(message)
  }

  return res.json() as Promise<ImportResult>
}
