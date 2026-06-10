import { useEffect, type RefObject } from 'react'

export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return
    const onMouseDown = (e: MouseEvent) => {
      if (refs.every(ref => !ref.current?.contains(e.target as Node))) handler()
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [refs, handler, enabled])
}
