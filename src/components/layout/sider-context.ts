import { createContext, useContext } from 'react'

/* ── Sider context ────────────────────────────────────────────────────────── */

interface SiderCtxValue {
  collapsed: boolean
  collapsedWidth: number
  width: number
}

export const SiderCtx = createContext<SiderCtxValue>({ collapsed: false, collapsedWidth: 64, width: 240 })

export const useSider = () => useContext(SiderCtx)
