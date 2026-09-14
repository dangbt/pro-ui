// Shared Vitest setup for all component tests.
//
// jsdom lacks two APIs React Aria relies on:
//   - CSS.escape: used by React Aria's selection manager when a ListBox/Menu mounts.
//   - IntersectionObserver: used by MenuLoadMoreItem's load-more sentinel.
// Polyfill both once, globally, so component trees can mount.

if (typeof globalThis.CSS === 'undefined') {
  // @ts-expect-error minimal shim
  globalThis.CSS = {}
}
if (typeof globalThis.CSS.escape !== 'function') {
  globalThis.CSS.escape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&')
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
    root = null
    rootMargin = ''
    thresholds = []
  }
  globalThis.IntersectionObserver = IO as unknown as typeof IntersectionObserver
}

// jsdom does not implement matchMedia. ThemeProvider reads it after mount to
// resolve 'system' → 'light' | 'dark'. Provide a minimal, no-op shim.
if (typeof globalThis.matchMedia !== 'function') {
  globalThis.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false
    },
  })) as unknown as typeof globalThis.matchMedia
}
