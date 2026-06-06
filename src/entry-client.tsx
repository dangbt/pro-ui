import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import './index.css'
import App from './app'

const root = document.getElementById('root')!

// Hydrate if server rendered, otherwise create fresh
if (root.innerHTML.trim()) {
  hydrateRoot(root, <StrictMode><App /></StrictMode>)
} else {
  createRoot(root).render(<StrictMode><App /></StrictMode>)
}
