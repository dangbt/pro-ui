# Changelog

## 1.13.1

- docs(readme): render correctly on npm.io's new dark UI — logo wordmark readable on dark/light backgrounds, comparison table uses text instead of emoji (npm.io strips emoji), absolute links for CHANGELOG/ROADMAP/SPONSORS/LICENSE.
- docs(readme): component list updated to the real 70+ exports (Sheet, AsyncSelect, Descriptions, Timeline, Transfer, InputOTP…); README changelog now shows the latest release and links to CHANGELOG.md.

## 1.13.0

- feat(sheet): new `Sheet` component wrapping React Aria 1.22 `Sheet` — swipe-to-dismiss overlay from any edge (`position` bottom/top/left/right/start/end/center), `snapPoints`, `preventDismissal`, drag handle, stacked sheets; Drawer-like API (`title`, `footer`, `triggerElement` or controlled `isOpen`/`onOpenChange`) (PROUI-19).
- feat(link): active styling via `aria-current` (`page`/`true`) for every variant (PROUI-20).
- docs(ai-dx): `Sheet` and `Link` `aria-current` added to MCP components data, `llms.txt`, `llms-full.txt`, `registry.json` (PROUI-21).
- **peer**: `react-aria-components` raised to `>=1.22.0` (required by `Sheet`).

## 1.12.5

- chore(deps): `tailwind-merge` 3.3.1 → 3.7.0 (runtime dependency).
- chore(deps): tested against `react-aria-components` 1.22.1 and React 19.3.1 (peer range unchanged: `react-aria-components >=1.21.0`) (PROUI-17).
- chore(deps): dev tooling — tailwindcss / @tailwindcss/vite 4.3.5, vite 8.3.7, vitest 5.1.0, storybook 10.6.6 (PROUI-18).

## 1.12.4

- fix(async-select): search input no longer overflows the popover; long labels no longer break the trigger at narrow widths (PROUI-16).

## 1.12.3

- fix(layout): Sider group header is now a fixed-height slot (`h-5 mb-1`) in both states; collapsed shows a horizontal line (aria-hidden, label kept as `sr-only`) so nav items no longer shift when collapsing. `SiderNavItem` uses fixed `h-9` in both states (PROUI-15).
- refactor(layout): split Sider context and nav helpers into `sider-context.ts` / `sider-nav.tsx`.
