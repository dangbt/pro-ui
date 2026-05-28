import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, ToastProvider } from '@dangbt/pro-ui'
import '@dangbt/pro-ui/style'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <ToastProvider />
      <App />
    </ThemeProvider>
  </StrictMode>
)
