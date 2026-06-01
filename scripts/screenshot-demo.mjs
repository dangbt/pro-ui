/**
 * Chụp screenshots từ pro-admin-demo.pages.dev để dùng cho Dev.to / README / marketing
 * Usage: node scripts/screenshot-demo.mjs
 */

import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../docs/screenshots')
const BASE_URL = 'https://pro-admin-demo.pages.dev'

const SHOTS = [
  { name: 'dashboard-light',    path: '/',          theme: 'light', width: 1440 },
  { name: 'dashboard-dark',     path: '/',          theme: 'dark',  width: 1440 },
  { name: 'dashboard-mobile',   path: '/',          theme: 'light', width: 390  },
  { name: 'analytics',          path: '/analytics', theme: 'light', width: 1440 },
  { name: 'users-table',        path: '/users',     theme: 'light', width: 1440 },
  { name: 'users-table-dark',   path: '/users',     theme: 'dark',  width: 1440 },
  { name: 'billing',            path: '/billing',   theme: 'light', width: 1440 },
  { name: 'settings',           path: '/settings',  theme: 'light', width: 1440 },
  { name: 'login',              path: '/login',     theme: 'light', width: 1440 },
  { name: 'login-dark',         path: '/login',     theme: 'dark',  width: 1440 },
]

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(t)
    localStorage.setItem('theme', t)
  }, theme)
  await page.waitForTimeout(300) // let CSS vars settle
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  console.log(`📸 Taking ${SHOTS.length} screenshots → ${OUT_DIR}\n`)

  for (const shot of SHOTS) {
    const page = await browser.newPage()
    await page.setViewportSize({ width: shot.width, height: 900 })

    const url = `${BASE_URL}${shot.path}`
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500) // let animations finish

    await setTheme(page, shot.theme)

    const file = join(OUT_DIR, `${shot.name}.png`)
    await page.screenshot({ path: file, fullPage: false })
    console.log(`  ✅ ${shot.name}.png  (${shot.width}px, ${shot.theme})`)

    await page.close()
  }

  await browser.close()
  console.log(`\n🎉 Done! Files in: docs/screenshots/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
