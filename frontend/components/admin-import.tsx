"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, CheckCircle, AlertCircle, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { importExcel, importExcelHsk, getLecciones, deleteLeccion, replaceLeccion, type ImportResult, type LeccionDto } from "@/lib/api"

type ImportState = "idle" | "success" | "error"

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

function ImportSection({
  title,
  subtitle,
  columns,
  onImport,
}: {
  title: string
  subtitle: string
  columns: { col: string; desc: string; ex: string }[]
  onImport: (file: File) => Promise<ImportResult>
}) {
  const [file, setFile] = useState<File | null>(null)
  const [importState, setImportState] = useState<ImportState>("idle")
  const [dragging, setDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [apiError, setApiError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File | null) {
    if (!f) return
    setFile(f)
    setImportState("idle")
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  async function handleImport() {
    if (!file) return
    setIsLoading(true)
    setApiError("")
    try {
      const data = await onImport(file)
      setResult(data)
      setImportState("success")
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "Error al importar el archivo")
      setImportState("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="rounded-[20px] p-6 md:p-8"
      style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 24px rgba(26,26,46,0.07)" }}
    >
      <h2
        style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A2E", marginBottom: 4 }}
      >
        {title}
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555555", marginBottom: 20 }}>
        {subtitle}
      </p>

      {/* Column reference */}
      <div className="mb-6 overflow-x-auto rounded-[12px]" style={{ backgroundColor: "#F8F4EE" }}>
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Columna", "Descripción", "Ejemplo"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#888888" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {columns.map(({ col, desc, ex }) => (
              <tr key={col} style={{ borderTop: "1px solid rgba(26,26,46,0.06)" }}>
                <td className="px-4 py-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>
                  {col}
                </td>
                <td className="px-4 py-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555555" }}>
                  {desc}
                </td>
                <td className="px-4 py-2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888888" }}>
                  {ex}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drop zone */}
      <div
        className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-[14px] px-6 py-8 text-center transition-colors duration-150"
        style={{
          backgroundColor: dragging ? "rgba(230,57,70,0.04)" : "#F8F4EE",
          border: `2px dashed ${dragging ? "#E63946" : "#e0e0e0"}`,
        }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle size={32} style={{ color: "#06D6A0" }} />
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A2E" }}>
              {file.name}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#888888" }}>
              {formatSize(file.size)}
            </p>
            <button
              className="mt-1 rounded-[8px] border px-3 py-1 transition-colors duration-150 hover:bg-white"
              style={{ borderColor: "#e0e0e0", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555555" }}
              onClick={(e) => { e.stopPropagation(); setFile(null); setImportState("idle") }}
            >
              Cambiar archivo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={36} style={{ color: "#E63946" }} />
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14, color: "#1A1A2E" }}>
              Arrastra tu archivo Excel aquí
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888888" }}>
              o haz click para seleccionar · Solo .xlsx
            </p>
          </div>
        )}
      </div>

      {/* Import button */}
      <button
        onClick={handleImport}
        disabled={!file || isLoading}
        className="w-full rounded-[12px] py-3.5 text-center transition-opacity duration-150"
        style={{
          backgroundColor: "#E63946",
          fontFamily: "'Sora', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: "#ffffff",
          opacity: file && !isLoading ? 1 : 0.5,
          cursor: file && !isLoading ? "pointer" : "not-allowed",
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Importando...
          </span>
        ) : "Importar"}
      </button>

      {/* Result: success */}
      {importState === "success" && (
        <div
          className="mt-4 flex flex-col gap-3 rounded-[12px] p-4"
          style={{ backgroundColor: "#F8F4EE", borderLeft: "4px solid #06D6A0" }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={20} style={{ color: "#06D6A0", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A2E" }}>
              Importación completada
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: `${result?.created ?? 0} creadas`, bg: "#06D6A0", color: "#ffffff" },
              { label: `${result?.updated ?? 0} actualizadas`, bg: "#FFD166", color: "#1A1A2E" },
              { label: `${result?.errors ?? 0} errores`, bg: "#E63946", color: "#ffffff" },
            ].map(({ label, bg, color }) => (
              <span
                key={label}
                className="rounded-full px-3 py-1"
                style={{ backgroundColor: bg, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color }}
              >
                {label}
              </span>
            ))}
          </div>
          {result && result.errorDetails.length > 0 && (
            <ul className="flex flex-col gap-1 border-t pt-2" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
              {result.errorDetails.map((detail, idx) => (
                <li key={idx} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#E63946" }}>
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Result: error */}
      {importState === "error" && (
        <div
          className="mt-4 flex items-start gap-3 rounded-[12px] p-4"
          style={{ backgroundColor: "#F8F4EE", borderLeft: "4px solid #E63946" }}
        >
          <AlertCircle size={20} style={{ color: "#E63946", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15, color: "#1A1A2E" }}>
              Error en la importación
            </p>
            <p className="mt-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555555" }}>
              {apiError || "El archivo no tiene el formato esperado. Revisa que las columnas sean correctas."}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function LeccionesAdmin() {
  const { token } = useAuth()
  const [lecciones, setLecciones] = useState<LeccionDto[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [replacingId, setReplacingId] = useState<number | null>(null)
  const [replaceStatus, setReplaceStatus] = useState<{ id: number; ok: boolean; msg: string } | null>(null)
  const [pendingReplaceId, setPendingReplaceId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!token) return
    getLecciones(token).then(setLecciones).catch(() => {}).finally(() => setLoading(false))
  }, [token])

  function openReplace(id: number) {
    setPendingReplaceId(id)
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !pendingReplaceId) return
    const id = pendingReplaceId
    setPendingReplaceId(null)
    setReplacingId(id)
    setReplaceStatus(null)
    try {
      const result = await replaceLeccion(id, file, token!)
      setReplaceStatus({ id, ok: true, msg: `${result.created} creadas · ${result.updated} actualizadas · ${result.errors} errores` })
      getLecciones(token!).then(setLecciones).catch(() => {})
    } catch (err) {
      setReplaceStatus({ id, ok: false, msg: err instanceof Error ? err.message : "Error al reemplazar" })
    } finally {
      setReplacingId(null)
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id)
    try {
      await deleteLeccion(id, token!)
      setLecciones(prev => prev.filter(l => l.id !== id))
      setConfirmDelete(null)
    } catch {
      // silent — el botón vuelve al estado normal
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div
      className="rounded-[20px] p-6 md:p-8"
      style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 24px rgba(26,26,46,0.07)" }}
    >
      <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A2E", marginBottom: 4 }}>
        Gestionar Lecciones
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555555", marginBottom: 20 }}>
        Elimina una lección o reemplaza su contenido subiendo un nuevo Excel (borra las cartas actuales e importa las nuevas).
      </p>

      <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleFileChange} />

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin" style={{ color: "#E63946" }} />
        </div>
      ) : lecciones.length === 0 ? (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888888" }}>
          No hay lecciones todavía.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-[12px]" style={{ backgroundColor: "#F8F4EE" }}>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Lección", "Cartas", "Acciones"].map(h => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#888888" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lecciones.map(l => (
                <tr key={l.id} style={{ borderTop: "1px solid rgba(26,26,46,0.06)" }}>
                  <td className="px-4 py-3" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>
                    {l.nombre}
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555555" }}>
                    {l.totalCartas}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {replaceStatus?.id === l.id && (
                        <span
                          className="rounded-full px-3 py-1"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: replaceStatus.ok ? "rgba(6,214,160,0.12)" : "rgba(230,57,70,0.10)",
                            color: replaceStatus.ok ? "#06D6A0" : "#E63946",
                          }}
                        >
                          {replaceStatus.msg}
                        </span>
                      )}
                      {confirmDelete === l.id ? (
                        <>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#555555" }}>
                            ¿Eliminar?
                          </span>
                          <button
                            onClick={() => handleDelete(l.id)}
                            disabled={deletingId === l.id}
                            className="rounded-[8px] px-3 py-1 text-white transition-opacity"
                            style={{
                              backgroundColor: "#E63946",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 12,
                              fontWeight: 600,
                              opacity: deletingId === l.id ? 0.5 : 1,
                            }}
                          >
                            {deletingId === l.id ? <Loader2 size={13} className="animate-spin inline" /> : "Sí, eliminar"}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="rounded-[8px] px-3 py-1 transition-colors"
                            style={{
                              backgroundColor: "rgba(26,26,46,0.07)",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#1A1A2E",
                            }}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setReplaceStatus(null); openReplace(l.id) }}
                            disabled={replacingId === l.id}
                            className="flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 transition-colors"
                            style={{
                              backgroundColor: "rgba(26,26,46,0.07)",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#1A1A2E",
                              opacity: replacingId === l.id ? 0.5 : 1,
                              cursor: replacingId === l.id ? "not-allowed" : "pointer",
                            }}
                          >
                            {replacingId === l.id
                              ? <><Loader2 size={13} className="animate-spin" /> Subiendo...</>
                              : <><Upload size={13} /> Reemplazar</>}
                          </button>
                          <button
                            onClick={() => { setReplaceStatus(null); setConfirmDelete(l.id) }}
                            className="flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 transition-colors"
                            style={{
                              backgroundColor: "rgba(230,57,70,0.08)",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#E63946",
                            }}
                          >
                            <Trash2 size={13} /> Borrar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function AdminImport() {
  const { token } = useAuth()

  return (
    <div className="min-h-screen px-5 py-10 md:px-12" style={{ backgroundColor: "#F8F4EE" }}>
      {/* Header */}
      <div className="mb-10">
        <div className="mb-6 flex items-center gap-2">
          <span style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 700, fontSize: 22, color: "#E63946" }}>
            汉字
          </span>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A2E" }}>
            hanzi
          </span>
          <span
            className="ml-2 rounded-full px-2.5 py-0.5"
            style={{ backgroundColor: "#E63946", fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600, color: "#ffffff" }}
          >
            Admin
          </span>
        </div>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 28, color: "#1A1A2E" }}>
          Importar vocabulario
        </h1>
        <p className="mt-1.5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#555555" }}>
          Sube archivos Excel para crear o actualizar el contenido del curso.
        </p>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <LeccionesAdmin />
        <ImportSection
          title="Lecciones del Libro"
          subtitle="Vocabulario organizado en lecciones del libro de texto."
          columns={[
            { col: "hanzi",     desc: "Carácter chino",    ex: "你好" },
            { col: "pinyin",    desc: "Pronunciación",     ex: "nǐ hǎo" },
            { col: "traduccion",desc: "Español",           ex: "Hola" },
            { col: "leccion",   desc: "Nombre de lección", ex: "Lección 1" },
            { col: "image_url", desc: "Imagen (opcional)", ex: "https://..." },
            { col: "audio_url", desc: "Audio (opcional)",  ex: "https://..." },
          ]}
          onImport={(file) => importExcel(file, token!)}
        />

        <ImportSection
          title="Vocabulario HSK"
          subtitle="Vocabulario oficial del examen HSK, agrupado por nivel y categoría."
          columns={[
            { col: "hanzi",     desc: "Carácter chino",  ex: "你好" },
            { col: "pinyin",    desc: "Pronunciación",   ex: "nǐ hǎo" },
            { col: "traduccion",desc: "Español",         ex: "Hola" },
            { col: "hsk_nivel", desc: "Nivel HSK (1-6)", ex: "1" },
            { col: "categoria", desc: "Categoría",       ex: "Saludos" },
          ]}
          onImport={(file) => importExcelHsk(file, token!)}
        />
      </div>
    </div>
  )
}
