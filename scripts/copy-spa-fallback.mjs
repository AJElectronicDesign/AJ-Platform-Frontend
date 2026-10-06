import { copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * GitHub Pages serves 404.html for unknown paths and keeps the requested URL.
 * Copying the built index lets React Router handle deep links such as /app/clientes
 * under the project base /AJ-Platform-Frontend/.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

copyFileSync(resolve(root, 'dist/index.html'), resolve(root, 'dist/404.html'))
