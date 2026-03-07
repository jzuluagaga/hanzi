"use client"

import { useState, useRef } from "react"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"

type ImportState = "idle" | "success" | "error"

const MOCK_RESULT = { created: 12, updated: 3, errors: 0 }

export function AdminImport() {
  const [file, setFile] = useState<File | null>(null)
  const [importState, setImportState] = useState<ImportState>("idle")
  const [dragging, setDragging] = useState(false)
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

  function handleImport() {
    if (!file) return
    setTimeout(() => setImportState("success"), 1200)
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return (
    <div
      className="min-h-screen px-5 py-10 md:px-12"
      style={{ backgroundColor: "#F8F4EE" }}
    >
      {/* Header */}
      <div className="mb-10">
        <div className="mb-6 flex items-center gap-2">
          <span
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontWeight: 700,
              fontSize: 22,
              color: "#E63946",
            }}
          >
            汉字
          </span>
          <span
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: "#1A1A2E",
            }}
          >
            hanzi
          </span>
          <span
            className="ml-2 rounded-full px-2.5 py-0.5"
            style={{
              backgroundColor: "#E63946",
              fontFamily: "'Sora', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            Admin
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: 28,
            color: "#1A1A2E",
          }}
        >
          Importar vocabulario
        </h1>
        <p
          className="mt-1.5"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            color: "#555555",
          }}
        >
          Sube un archivo Excel con el vocabulario para crear o actualizar lecciones.
        </p>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        {/* Format card */}
        <div
          className="rounded-[16px] p-6"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 24px rgba(26,26,46,0.06)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: "#1A1A2E",
              marginBottom: 16,
            }}
          >
            Formato requerido
          </h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f0ebe3" }}>
                  {["Columna", "Descripción", "Ejemplo"].map((h) => (
                    <th
                      key={h}
                      className="pb-2 pr-6 text-left"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#888888",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["hanzi", "Carácter chino", "你好"],
                  ["pinyin", "Pronunciación", "nǐ hǎo"],
                  ["traduccion", "Español", "Hola"],
                  ["leccion", "Número de lección", "1"],
                  ["hsk_nivel", "Nivel HSK", "1"],
                ].map(([col, desc, ex]) => (
                  <tr key={col} style={{ borderBottom: "1px solid #f9f6f1" }}>
                    <td
                      className="py-2.5 pr-6"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        color: "#1A1A2E",
                        fontWeight: 600,
                      }}
                    >
                      {col}
                    </td>
                    <td
                      className="py-2.5 pr-6"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555555" }}
                    >
                      {desc}
                    </td>
                    <td
                      className="py-2.5"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        color: "#888888",
                      }}
                    >
                      {ex}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            className="mt-4"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888888" }}
          >
            Las columnas <strong>image_url</strong> y <strong>audio_url</strong> son opcionales.
          </p>
        </div>

        {/* Upload area */}
        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-[16px] px-6 py-10 text-center transition-colors duration-150"
          style={{
            backgroundColor: dragging ? "rgba(230,57,70,0.04)" : "#ffffff",
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
            <div className="flex flex-col items-center gap-3">
              <CheckCircle size={40} style={{ color: "#06D6A0" }} />
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#1A1A2E",
                }}
              >
                {file.name}
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888888" }}>
                {formatSize(file.size)}
              </p>
              <button
                className="mt-1 rounded-[10px] border px-4 py-1.5 transition-colors duration-150 hover:bg-[#f5f5f5]"
                style={{
                  borderColor: "#e0e0e0",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#555555",
                }}
                onClick={(e) => { e.stopPropagation(); setFile(null); setImportState("idle") }}
              >
                Cambiar archivo
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload size={48} style={{ color: "#E63946" }} />
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#1A1A2E",
                }}
              >
                Arrastra tu archivo Excel aquí
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888888" }}>
                o
              </p>
              <button
                className="rounded-[12px] border px-5 py-2.5 transition-colors duration-150 hover:bg-[#fff5f5]"
                style={{
                  borderColor: "#E63946",
                  backgroundColor: "#ffffff",
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#E63946",
                }}
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
              >
                Seleccionar archivo
              </button>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888888" }}>
                Solo archivos .xlsx
              </p>
            </div>
          )}
        </div>

        {/* Import button */}
        <button
          onClick={handleImport}
          disabled={!file}
          className="w-full rounded-[12px] py-[14px] text-center transition-opacity duration-150"
          style={{
            backgroundColor: "#E63946",
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: "#ffffff",
            opacity: file ? 1 : 0.5,
            cursor: file ? "pointer" : "not-allowed",
          }}
        >
          Importar vocabulario
        </button>

        {/* Result: success */}
        {importState === "success" && (
          <div
            className="flex flex-col gap-4 rounded-[16px] p-5"
            style={{
              backgroundColor: "#ffffff",
              borderLeft: "4px solid #06D6A0",
              boxShadow: "0 4px 24px rgba(26,26,46,0.06)",
            }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={24} style={{ color: "#06D6A0", flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#1A1A2E",
                }}
              >
                Importación completada
              </span>
            </div>
            <div className="flex gap-2">
              {[
                { label: `${MOCK_RESULT.created} creadas`, bg: "#06D6A0", color: "#ffffff" },
                { label: `${MOCK_RESULT.updated} actualizadas`, bg: "#FFD166", color: "#1A1A2E" },
                { label: `${MOCK_RESULT.errors} errores`, bg: "#E63946", color: "#ffffff" },
              ].map(({ label, bg, color }) => (
                <span
                  key={label}
                  className="rounded-full px-3 py-1"
                  style={{
                    backgroundColor: bg,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Result: error */}
        {importState === "error" && (
          <div
            className="flex items-start gap-3 rounded-[16px] p-5"
            style={{
              backgroundColor: "#ffffff",
              borderLeft: "4px solid #E63946",
              boxShadow: "0 4px 24px rgba(26,26,46,0.06)",
            }}
          >
            <AlertCircle size={24} style={{ color: "#E63946", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#1A1A2E",
                }}
              >
                Error en la importación
              </p>
              <p
                className="mt-1"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555555" }}
              >
                El archivo no tiene el formato esperado. Revisa que las columnas sean correctas.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
