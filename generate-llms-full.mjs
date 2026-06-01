/**
 * Generates public/llms-full.txt from MCP components-data.
 * Run: node generate-llms-full.mjs
 */
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Dynamic import of built CJS file
const { COMPONENTS, CATEGORIES } = await import('./tools/mcp-pro-ui/dist/components-data.js')

const lines = [
  '# @dangbt/pro-ui — Full API Reference',
  '',
  '> Complete component reference for AI agents. See /llms.txt for summary.',
  `> Generated from mcp-pro-ui components-data. Total: ${COMPONENTS.length} components.`,
  '',
  '## App Setup',
  '',
  '```tsx',
  "import { ThemeProvider, ToastProvider } from '@dangbt/pro-ui'",
  "import '@dangbt/pro-ui/style'",
  '',
  '<ThemeProvider defaultTheme="system">',
  '  <ToastProvider />',
  '  {/* app content */}',
  '</ThemeProvider>',
  '```',
  '',
  '---',
  '',
]

// Group by category
const byCategory = {}
for (const comp of COMPONENTS) {
  if (!byCategory[comp.category]) byCategory[comp.category] = []
  byCategory[comp.category].push(comp)
}

const categoryOrder = ['data', 'form', 'layout', 'overlay', 'feedback', 'display', 'theme']

for (const cat of categoryOrder) {
  const comps = byCategory[cat]
  if (!comps) continue

  lines.push(`# ${CATEGORIES[cat]}`)
  lines.push('')

  for (const comp of comps) {
    lines.push(`## ${comp.name}`)
    lines.push('')
    lines.push(comp.description)
    lines.push('')
    lines.push(`Import: \`import { ${comp.importName} } from '@dangbt/pro-ui'\``)
    lines.push('')

    // Props table
    if (comp.props.length > 0) {
      lines.push('### Props')
      lines.push('')
      lines.push('| Prop | Type | Required | Default | Description |')
      lines.push('|------|------|----------|---------|-------------|')
      for (const p of comp.props) {
        const req = p.required ? '✅' : '—'
        const def = p.default ? `\`${p.default}\`` : '—'
        lines.push(`| ${p.name} | ${p.type} | ${req} | ${def} | ${p.description} |`)
      }
      lines.push('')
    }

    if (comp.notes) {
      lines.push('### Notes')
      lines.push('')
      lines.push(comp.notes)
      lines.push('')
    }

    lines.push('### Example')
    lines.push('')
    lines.push('```tsx')
    lines.push(comp.example)
    lines.push('```')
    lines.push('')
    lines.push('---')
    lines.push('')
  }
}

const output = lines.join('\n')
const outPath = resolve(__dirname, 'public/llms-full.txt')
writeFileSync(outPath, output, 'utf8')
console.log(`✓ Generated ${outPath} (${COMPONENTS.length} components, ${output.split('\n').length} lines)`)
