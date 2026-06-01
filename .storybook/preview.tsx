import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '../src/components/theme-provider'
import '../src/index.css'
import React from 'react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <div className="p-6 min-h-[200px] flex items-start justify-center">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export default preview
