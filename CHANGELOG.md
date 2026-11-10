# Changelog

## 1.12.5

- chore(deps): `tailwind-merge` 3.3.1 → 3.7.0 (runtime dependency).
- chore(deps): tested against `react-aria-components` 1.22.1 and React 19.3.1 (peer range unchanged: `react-aria-components >=1.21.0`) (PROUI-17).
- chore(deps): dev tooling — tailwindcss / @tailwindcss/vite 4.3.5, vite 8.3.7, vitest 5.1.0, storybook 10.6.6 (PROUI-18).

## 1.12.4

- fix(async-select): search input no longer overflows the popover; long labels no longer break the trigger at narrow widths (PROUI-16).

## 1.12.3

- fix(layout): Sider group header is now a fixed-height slot (`h-5 mb-1`) in both states; collapsed shows a horizontal line (aria-hidden, label kept as `sr-only`) so nav items no longer shift when collapsing. `SiderNavItem` uses fixed `h-9` in both states (PROUI-15).
- refactor(layout): split Sider context and nav helpers into `sider-context.ts` / `sider-nav.tsx`.
