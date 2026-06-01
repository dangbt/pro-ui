import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="flex items-center gap-2 font-semibold">
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#818cf8"/>
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="8" fill="url(#logo-grad)"/>
          <path
            d="M 8 6 L 8 26 L 13 26 L 13 18 Q 24 18 24 12 Q 24 6 13 6 Z M 13 9 Q 21 9 21 12 Q 21 15 13 15 Z"
            fill="white"
            fillRule="evenodd"
          />
        </svg>
        pro-ui
      </span>
    ),
  },
  links: [
    { text: 'Docs',     url: '/docs',                                    active: 'nested-url' },
    { text: 'Showcase', url: 'https://pro-ui.pages.dev',                 external: true },
    { text: 'Demo',     url: 'https://pro-admin-demo.pages.dev',         external: true },
    { text: 'npm',      url: 'https://www.npmjs.com/package/@dangbt/pro-ui', external: true },
    { text: 'GitHub',   url: 'https://github.com/dangbt/pro-ui',         external: true },
  ],
}
