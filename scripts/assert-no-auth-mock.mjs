import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const needles = [
  'demo@aj-electronic-design.com',
  'limited@aj-electronic-design.com',
  'offline@aj-electronic-design.com',
  'mock-password',
]

const dist = path.resolve('dist')

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)))
      continue
    }

    if (/\.(?:js|mjs|css|html|map)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

const files = await walk(dist)
const hits = []

for (const file of files) {
  const text = await readFile(file, 'utf8')

  for (const needle of needles) {
    if (text.includes(needle)) {
      hits.push(`${path.relative(dist, file)} contains ${needle}`)
    }
  }
}

if (hits.length > 0) {
  console.error('Auth mock leaked into the production bundle:')
  console.error(hits.join('\n'))
  process.exit(1)
}

console.log(`Auth mock is absent from ${files.length} production files.`)
