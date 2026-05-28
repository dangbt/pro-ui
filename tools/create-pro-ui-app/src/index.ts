#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'
import kleur from 'kleur'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = join(__dirname, '..', 'templates')

const TEMPLATES = {
  minimal: {
    label: 'Minimal',
    description: 'Bare React + Vite + pro-ui + Tailwind. Clean slate.',
  },
  'admin-dashboard': {
    label: 'Admin Dashboard',
    description: 'Layout + Sidebar + ProTable + dark mode toggle. Production-ready shell.',
  },
  'saas-app': {
    label: 'SaaS App',
    description: 'Login + Dashboard + Settings + Profile. Full auth UI flow.',
  },
} as const

type Template = keyof typeof TEMPLATES

async function main() {
  console.log()
  console.log(kleur.bold().cyan('  create-pro-ui-app') + kleur.gray(' — scaffold a React app with pro-grade UI'))
  console.log()

  // Get project name from CLI arg
  let projectName = process.argv[2]

  if (!projectName) {
    const res = await prompts({
      type: 'text',
      name: 'name',
      message: 'Project name:',
      initial: 'my-pro-app',
      validate: (v) => /^[a-z0-9-_]+$/i.test(v) || 'Use only letters, numbers, dashes, underscores',
    })
    if (!res.name) process.exit(0)
    projectName = res.name as string
  }

  // Template selection
  const { template } = await prompts({
    type: 'select',
    name: 'template',
    message: 'Choose a template:',
    choices: Object.entries(TEMPLATES).map(([key, t]) => ({
      title: kleur.bold(t.label),
      description: t.description,
      value: key,
    })),
    initial: 0,
  })

  if (!template) process.exit(0)

  const targetDir = resolve(process.cwd(), projectName)

  if (existsSync(targetDir)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory "${projectName}" already exists. Overwrite?`,
      initial: false,
    })
    if (!overwrite) process.exit(0)
  }

  console.log()
  console.log(kleur.bold(`  Scaffolding ${kleur.cyan(projectName)} with ${kleur.cyan(TEMPLATES[template as Template].label)} template...`))
  console.log()

  // Copy template files
  mkdirSync(targetDir, { recursive: true })
  const templateDir = join(TEMPLATES_DIR, template as string)
  cpSync(templateDir, targetDir, { recursive: true })

  // Rename _gitignore → .gitignore (npm strips .gitignore on publish)
  const gitignoreSrc = join(targetDir, '_gitignore')
  const gitignoreDst = join(targetDir, '.gitignore')
  if (existsSync(gitignoreSrc)) {
    cpSync(gitignoreSrc, gitignoreDst)
    import('node:fs').then(({ unlinkSync }) => unlinkSync(gitignoreSrc))
  }

  // Replace {{PROJECT_NAME}} in package.json
  const pkgPath = join(targetDir, 'package.json')
  if (existsSync(pkgPath)) {
    const pkg = readFileSync(pkgPath, 'utf-8')
    writeFileSync(pkgPath, pkg.replace(/\{\{PROJECT_NAME\}\}/g, projectName))
  }

  // Write CLAUDE.md from mcp-pro-ui template
  const claudeMd = generateClaudeMd(projectName, template as Template)
  writeFileSync(join(targetDir, 'CLAUDE.md'), claudeMd)

  // Detect package manager
  const pm = detectPackageManager()
  const installCmd = pm === 'yarn' ? 'yarn' : pm === 'pnpm' ? 'pnpm install' : 'npm install'
  const devCmd = pm === 'yarn' ? 'yarn dev' : pm === 'pnpm' ? 'pnpm dev' : 'npm run dev'

  // Install dependencies
  console.log(kleur.gray(`  Installing dependencies with ${pm}...`))
  try {
    execSync(installCmd, { cwd: targetDir, stdio: 'ignore' })
    console.log(kleur.green('  ✔') + ' Dependencies installed')
  } catch {
    console.log(kleur.yellow('  ⚠') + ` Auto-install failed. Run ${kleur.cyan(installCmd)} manually.`)
  }

  // Success message
  console.log()
  console.log(kleur.bold().green('  ✔ Done! Your project is ready.'))
  console.log()
  console.log('  Next steps:')
  console.log()
  console.log(`    ${kleur.cyan(`cd ${projectName}`)}`)
  console.log(`    ${kleur.cyan(devCmd)}`)
  console.log()
  console.log('  AI coding tools:')
  console.log(`    ${kleur.gray('# Give Claude Code full pro-ui context:')}`)
  console.log(`    ${kleur.cyan('claude mcp add mcp-pro-ui -- npx -y mcp-pro-ui')}`)
  console.log()
  console.log(`  ${kleur.gray('Docs:')} ${kleur.underline('https://github.com/dangbt/pro-ui')}`)
  console.log()
}

function detectPackageManager(): 'npm' | 'yarn' | 'pnpm' {
  const ua = process.env.npm_config_user_agent ?? ''
  if (ua.includes('pnpm')) return 'pnpm'
  if (ua.includes('yarn')) return 'yarn'
  return 'npm'
}

function generateClaudeMd(projectName: string, template: Template): string {
  return `# ${projectName}

## UI Components — @dangbt/pro-ui

This project uses **@dangbt/pro-ui** for all UI components.
Template: **${TEMPLATES[template].label}**

> Add MCP server for live component API access:
> \`\`\`bash
> claude mcp add mcp-pro-ui -- npx -y mcp-pro-ui
> \`\`\`

## Import Pattern

\`\`\`tsx
import { Button, ProTable, ProForm, Modal, toast } from '@dangbt/pro-ui'
\`\`\`

## Key Components

- **ProTable** — Data table with \`request\` (server) or \`dataSource\` (client)
- **ProForm** — Form with Zod validation + field components
- **Layout** — App shell with collapsible sidebar
- **Modal / Drawer** — Overlays (inside \`DialogTrigger\`)
- **toast.success/error()** — Notifications (needs \`<ToastProvider />\` at root)
- **Statistic** — KPI cards with trend indicator
- **Badge** — Status labels: success/warning/danger/info
- **ThemeProvider / useTheme** — Dark/light/system theme

## App Root (already set up in this project)

\`\`\`tsx
<ThemeProvider defaultTheme="system">
  <ToastProvider />
  {/* app content */}
</ThemeProvider>
\`\`\`

## Theming — use semantic tokens

\`\`\`
bg-surface, bg-surface-subtle, bg-canvas  (NOT bg-white / bg-gray-*)
text-fg, text-fg-2, text-fg-muted         (NOT text-gray-900)
border-border                              (NOT border-gray-200)
\`\`\`

## Button

Use \`onPress\` (not \`onClick\`). Variants: solid / outline / ghost / danger.
`
}

main().catch((err) => {
  console.error(kleur.red('Error:'), err.message)
  process.exit(1)
})
