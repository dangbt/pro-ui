# Changelog

## 1.12.3

- fix(layout): Sider group header is now a fixed-height slot (`h-5 mb-1`) in both states; collapsed shows a horizontal line (aria-hidden, label kept as `sr-only`) so nav items no longer shift when collapsing. `SiderNavItem` uses fixed `h-9` in both states (PROUI-15).
- refactor(layout): split Sider context and nav helpers into `sider-context.ts` / `sider-nav.tsx`.
