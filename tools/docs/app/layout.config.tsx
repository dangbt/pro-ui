import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="flex items-center gap-2 font-semibold">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect width="20" height="20" rx="5" fill="#6366f1" />
          <path d="M6 10h8M10 6v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        pro-ui
      </span>
    ),
  },
  links: [
    { text: 'Docs', url: '/docs', active: 'nested-url' },
    { text: 'Showcase', url: 'https://pro-ui.pages.dev', external: true },
    { text: 'npm', url: 'https://www.npmjs.com/package/@dangbt/pro-ui', external: true },
    { text: 'GitHub', url: 'https://github.com/dangbt/pro-ui', external: true },
  ],
}
