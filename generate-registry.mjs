/**
 * Generates public/registry.json from MCP components-data.
 * Compatible with AI tools like v0, bolt.new, Cursor.
 * Run: node generate-registry.mjs
 */
import { writeFileSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const { COMPONENTS, CATEGORIES } = await import('./tools/mcp-pro-ui/dist/components-data.js')
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'))

const registry = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  homepage: 'https://pro-ui.pages.dev',
  docs: 'https://pro-ui.pages.dev/docs',
  mcp: 'npx -y mcp-pro-ui',
  install: `npm install ${pkg.name}`,
  setup: [
    "import { ThemeProvider, ToastProvider } from '@dangbt/pro-ui'",
    "import '@dangbt/pro-ui/style'",
    '// Wrap app: <ThemeProvider defaultTheme="system"><ToastProvider />{children}</ThemeProvider>',
  ].join('\n'),
  categories: CATEGORIES,
  components: COMPONENTS.map(comp => ({
    name: comp.name,
    import: comp.importName,
    package: pkg.name,
    category: comp.category,
    description: comp.description,
    useCases: comp.useCases,
    props: comp.props.map(p => ({
      name: p.name,
      type: p.type,
      required: p.required,
      ...(p.default !== undefined ? { default: p.default } : {}),
      description: p.description,
    })),
    ...(comp.notes ? { notes: comp.notes } : {}),
    example: comp.example,
  })),
}

const outPath = resolve(__dirname, 'public/registry.json')
writeFileSync(outPath, JSON.stringify(registry, null, 2), 'utf8')
console.log(`✓ Generated ${outPath} (${COMPONENTS.length} components)`)
