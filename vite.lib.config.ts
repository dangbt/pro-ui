import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/components/index.ts'),
      name: 'ProUI',
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom',
        'react-aria-components',
        'lucide-react',
        'clsx',
        'tailwind-merge',
        '@tanstack/react-table',
        'react-hook-form',
        '@hookform/resolvers',
        '@hookform/resolvers/zod',
        'zod',
        '@internationalized/date',
      ],
      output: [
        {
          format: 'es',
          entryFileNames: 'index.mjs',
          banner: '"use client";\n',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'ReactJSXRuntime',
            'react/jsx-dev-runtime': 'ReactJSXDevRuntime',
          },
        },
        {
          format: 'cjs',
          entryFileNames: 'index.js',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'ReactJSXRuntime',
            'react/jsx-dev-runtime': 'ReactJSXDevRuntime',
          },
        },
      ],
    },
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
  },
})
