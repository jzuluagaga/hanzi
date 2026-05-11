import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

const pkgPath = require.resolve('hanzi-writer-data/package.json')
const src = path.dirname(pkgPath)
const dst = path.join(__dirname, '..', 'public', 'hanzi-data')

fs.mkdirSync(dst, { recursive: true })

let count = 0
for (const file of fs.readdirSync(src)) {
  if (file.endsWith('.json') && file !== 'package.json') {
    fs.copyFileSync(path.join(src, file), path.join(dst, file))
    count++
  }
}
console.log(`Copiados ${count} archivos a public/hanzi-data/`)
