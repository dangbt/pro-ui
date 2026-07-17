import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import type { ProTableProps } from './types'

type StickyProp = ProTableProps<object>['sticky']

interface UseStickyOptions {
  sticky: StickyProp
}

export function useSticky({ sticky }: UseStickyOptions) {
  const stickyEnabled = !!sticky
  const stickyOffsetTop = typeof sticky === 'object' ? (sticky.offsetTop ?? 0) : 0
  const stickyWindowScroll = typeof sticky === 'object' && !!sticky.windowScroll

  // maxHeight mode
  const stickyMaxHeight =
    typeof sticky === 'object' && sticky.maxHeight != null
      ? typeof sticky.maxHeight === 'number'
        ? `${sticky.maxHeight}px`
        : sticky.maxHeight
      : undefined

  // `maxHeight: 'fit'` → auto-compute height to fill viewport
  const fitEnabled = stickyMaxHeight === 'fit'
  const scrollRef = useRef<HTMLDivElement>(null)
  const [fitMaxHeight, setFitMaxHeight] = useState<string>()

  useLayoutEffect(() => {
    if (!fitEnabled) return
    const compute = () => {
      const el = scrollRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      // Account for sibling elements below (pagination, bulk bar, etc.)
      const parent = el.parentElement
      let siblingHeight = 0
      if (parent) {
        let sibling = el.nextElementSibling
        while (sibling) {
          siblingHeight += (sibling as HTMLElement).offsetHeight ?? 0
          sibling = sibling.nextElementSibling
        }
      }
      const offset = siblingHeight + 8
      const next = `${Math.max(160, Math.round(window.innerHeight - top - offset))}px`
      setFitMaxHeight((prev) => (prev === next ? prev : next))
    }
    compute()
    window.addEventListener('resize', compute)
    const ro = new ResizeObserver(compute)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('resize', compute)
      ro.disconnect()
    }
  }, [fitEnabled])

  const effectiveMaxHeight = fitEnabled ? fitMaxHeight : stickyMaxHeight

  // ─── Window-scroll sticky mode ───
  const wsSentinelRef = useRef<HTMLDivElement>(null)
  const wsWrapperRef = useRef<HTMLDivElement>(null)
  const wsTheadRef = useRef<HTMLTableSectionElement>(null)
  const wsTableRef = useRef<HTMLTableElement>(null)
  const [wsIsSticky, setWsIsSticky] = useState(false)
  const [wsScrollLeft, setWsScrollLeft] = useState(0)
  const [wsStyle, setWsStyle] = useState<React.CSSProperties>({})

  // IntersectionObserver: detect when sentinel leaves viewport
  useEffect(() => {
    if (!stickyWindowScroll) return
    const sentinel = wsSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setWsIsSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: `-${stickyOffsetTop}px 0px 0px 0px` },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [stickyWindowScroll, stickyOffsetTop])

  // Sync fixed header position with wrapper bounds
  const wsSyncPosition = useCallback(() => {
    const wrapper = wsWrapperRef.current
    if (!wrapper) return
    const rect = wrapper.getBoundingClientRect()
    setWsStyle({
      position: 'fixed',
      top: stickyOffsetTop,
      left: rect.left,
      width: rect.width,
      zIndex: 50,
      overflow: 'hidden',
      pointerEvents: 'none',
    })
  }, [stickyOffsetTop])

  // When sticky active: listen to resize/scroll to keep position synced
  useEffect(() => {
    if (!stickyWindowScroll || !wsIsSticky) return
    wsSyncPosition()
    window.addEventListener('resize', wsSyncPosition)
    window.addEventListener('scroll', wsSyncPosition)
    return () => {
      window.removeEventListener('resize', wsSyncPosition)
      window.removeEventListener('scroll', wsSyncPosition)
    }
  }, [stickyWindowScroll, wsIsSticky, wsSyncPosition])

  // Track horizontal scroll of wrapper
  const wsHandleScroll = useCallback(() => {
    const wrapper = wsWrapperRef.current
    if (!wrapper) return
    setWsScrollLeft(wrapper.scrollLeft)
    if (wsIsSticky) wsSyncPosition()
  }, [wsIsSticky, wsSyncPosition])

  return {
    stickyEnabled,
    stickyOffsetTop,
    stickyWindowScroll,
    stickyMaxHeight,
    effectiveMaxHeight,
    scrollRef,
    wsSentinelRef,
    wsWrapperRef,
    wsTheadRef,
    wsTableRef,
    wsIsSticky,
    wsScrollLeft,
    wsStyle,
    wsHandleScroll,
  }
}
