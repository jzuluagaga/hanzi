import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "node_modules", "hanzi-writer-data")

const CACHE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=31536000, immutable",
}

function safePath(char: string): string | null {
  const filePath = path.resolve(DATA_DIR, `${char}.json`)
  if (!filePath.startsWith(DATA_DIR + path.sep)) return null
  return filePath
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ char: string }> }
) {
  const { char } = await params
  const filePath = safePath(char)
  if (!filePath) return new NextResponse(null, { status: 404 })
  try {
    const data = await fs.promises.readFile(filePath, "utf-8")
    return new NextResponse(data, { headers: CACHE_HEADERS })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}

export async function HEAD(
  _request: Request,
  { params }: { params: Promise<{ char: string }> }
) {
  const { char } = await params
  const filePath = safePath(char)
  if (!filePath) return new NextResponse(null, { status: 404 })
  try {
    await fs.promises.access(filePath, fs.constants.R_OK)
    return new NextResponse(null, { status: 200, headers: CACHE_HEADERS })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
