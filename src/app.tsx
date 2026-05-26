import { useState, useEffect } from 'react'
import { Menu as MenuIcon } from 'lucide-react'
import { Badge } from './components'
import { cn } from './lib/cn'
import type { Size } from './lib/size'

import { ShowcaseSizeCtx } from './showcase/context'
import { NAV } from './showcase/constants'

import { Overview }       from './showcase/sections/overview'
import { ColorSystemSection } from './showcase/sections/color-system'
import { IconsSection }   from './showcase/sections/icons'
import { LLMTxtSection }  from './showcase/sections/llm-txt'
import {
  ButtonSection, ToggleButtonSection, TextInputsSection, SelectSection,
  DateSection, CheckboxSection, TogglesSection, SliderSection,
  TagsSection, FileSection, AutocompleteSection,
} from './showcase/sections/form'
import {
  ModalSection, TooltipSection, MenuSection, PopoverSection,
} from './showcase/sections/overlay'
import {
  TabsSection, BreadcrumbsSection, ToolbarSection,
} from './showcase/sections/navigation'
import {
  ListBoxSection, GridListSection, TreeSection,
} from './showcase/sections/selection'
import {
  BadgeSection, AlertSection, CardSection, AvatarSection,
  ProgressSection, SkeletonSection, DisclosureSection, LinkSection,
  DropZoneSection, ColorPickerSection,
} from './showcase/sections/display'
import { ProTableSection, ProFormSection } from './showcase/sections/data'
import { LayoutSection }  from './showcase/sections/layout'
import { ThemeBuilderPage } from './showcase/theme-builder'

declare const __APP_VERSION__: string

const SECTIONS: Record<string, React.ReactNode> = {
  overview:        <Overview />,
  theme:           null,
  colors:          <ColorSystemSection />,
  icons:           <IconsSection />,
  button:          <ButtonSection />,
  'toggle-button': <ToggleButtonSection />,
  'text-inputs':   <TextInputsSection />,
  select:          <SelectSection />,
  datetime:        <DateSection />,
  checkbox:        <CheckboxSection />,
  toggles:         <TogglesSection />,
  slider:          <SliderSection />,
  tags:            <TagsSection />,
  file:            <FileSection />,
  autocomplete:    <AutocompleteSection />,
  dropzone:        <DropZoneSection />,
  modal:           <ModalSection />,
  popover:         <PopoverSection />,
  tooltip:         <TooltipSection />,
  menu:            <MenuSection />,
  tabs:            <TabsSection />,
  breadcrumbs:     <BreadcrumbsSection />,
  toolbar:         <ToolbarSection />,
  listbox:         <ListBoxSection />,
  gridlist:        <GridListSection />,
  tree:            <TreeSection />,
  'color-picker':  <ColorPickerSection />,
  badge:           <BadgeSection />,
  alert:           <AlertSection />,
  card:            <CardSection />,
  avatar:          <AvatarSection />,
  progress:        <ProgressSection />,
  skeleton:        <SkeletonSection />,
  disclosure:      <DisclosureSection />,
  link:            <LinkSection />,
  protable:        <ProTableSection />,
  proform:         <ProFormSection />,
  layout:          <LayoutSection />,
  'llm-txt':       <LLMTxtSection />,
}

type RadiusMode = 'none' | 'md' | 'lg'
const RADIUS_MAP: Record<RadiusMode, string> = { none: '0px', md: '6px', lg: '12px' }

const ALL_IDS = new Set(NAV.flatMap(g => g.items).map(i => i.id))

function getHashSection() {
  const id = window.location.hash.slice(1)
  return ALL_IDS.has(id) ? id : 'overview'
}

export default function App() {
  const [active, setActive] = useState(getHashSection)
  const [radius, setRadius] = useState<RadiusMode>('none')
  const [primary, setPrimary] = useState('#6366f1')
  const [size, setSize] = useState<Size>('md')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const onHash = () => setActive(getHashSection())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (id: string) => {
    window.location.hash = id
    setMobileNavOpen(false)
  }

  const applyTheme = (r: RadiusMode, p: string) => {
    document.documentElement.style.setProperty('--base-radius', RADIUS_MAP[r])
    document.documentElement.style.setProperty('--primary', p)
  }

  const navLabel = NAV.flatMap(g => g.items).find(i => i.id === active)?.label ?? ''

  if (active === 'theme') {
    return <ThemeBuilderPage onBack={() => navigate('overview')} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur border-b border-gray-200 z-50 flex items-center px-4 gap-4">
        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-1.5 rounded text-gray-500 hover:bg-gray-100"
          onClick={() => setMobileNavOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-[var(--base-radius)] bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm tracking-tight">pro-ui</span>
          <Badge color="info" className="hidden sm:inline-flex">v{__APP_VERSION__}</Badge>
        </div>

        <div className="flex-1" />

        {/* GitHub + npm links */}
        <div className="hidden sm:flex items-center gap-1 mr-2">
          <a
            href="https://github.com/dangbt/pro-ui"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          <a
            href="https://www.npmjs.com/package/@dangbt/pro-ui"
            target="_blank"
            rel="noopener noreferrer"
            title="npm"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474C23.214 24 24 23.214 24 22.237V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.009-10.382h-3.456l-.009 10.382H5.13z" />
            </svg>
          </a>
        </div>

        {/* Theme controls */}
        <div className="flex items-center gap-2">
          {/* Primary color */}
          <input
            type="color"
            value={primary}
            title="Primary color"
            onChange={e => { setPrimary(e.target.value); applyTheme(radius, e.target.value) }}
            className="w-7 h-7 border border-gray-200 rounded cursor-pointer p-0.5 bg-white shrink-0"
          />

          {/* Size toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg p-0.5 shrink-0">
            {(['sm', 'md', 'lg'] as Size[]).map(sz => (
              <button key={sz} onClick={() => setSize(sz)}
                className={cn('px-2 py-1 text-[11px] font-semibold uppercase rounded-md transition-all',
                  size === sz ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-700')}
              >{sz}</button>
            ))}
          </div>

          {/* Radius toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg p-0.5 shrink-0">
            {([['0','none'],['M','md'],['L','lg']] as [string, RadiusMode][]).map(([label, val]) => (
              <button key={val} onClick={() => { setRadius(val); applyTheme(val, primary) }}
                className={cn('px-2 py-1 text-[11px] font-semibold rounded-md transition-all',
                  radius === val ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-700')}
              >{label}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar overlay for mobile */}
        {mobileNavOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-14 left-0 w-56 h-[calc(100vh-56px)] border-r border-gray-100 bg-white',
            'overflow-y-auto z-40 transition-transform',
            'md:translate-x-0',
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          )}
        >
          <nav className="py-4 px-3">
            {NAV.map(group => (
              <div key={group.group} className="mb-5">
                <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {group.group}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map(item => (
                    <li key={item.id}>
                      <button
                        onClick={() => navigate(item.id)}
                        className={cn(
                          'w-full text-left px-3 py-1.5 text-sm rounded-[var(--base-radius)] transition-colors',
                          active === item.id
                            ? 'bg-primary-50 text-primary font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                        )}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <ShowcaseSizeCtx.Provider value={size}>
          <main className={cn(
            'flex-1 min-w-0 md:ml-56',
            (active === 'protable' || active === 'layout') ? 'p-6' : 'px-6 py-8 max-w-4xl',
          )}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <span>pro-ui</span>
              <span>›</span>
              <span className="text-gray-700 font-medium">{navLabel}</span>
            </div>

            {SECTIONS[active]}
          </main>
        </ShowcaseSizeCtx.Provider>
      </div>
    </div>
  )
}
