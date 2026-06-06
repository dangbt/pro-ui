import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function prerender() {
  const distDir = path.join(__dirname, 'dist')
  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

  // Load the SSR bundle built by vite --ssr
  const { render } = await import(path.join(distDir, 'server', 'entry-server.js'))

  const appHtml = render()
  const html = template.replace('<!--ssr-outlet-->', appHtml)

  fs.writeFileSync(path.join(distDir, 'index.html'), html)
  console.log('✓ Prerendered index.html')
}

prerender().catch(console.error)
