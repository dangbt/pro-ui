export type NavItem = { id: string; label: string }
export type NavGroup = { group: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  {
    group: 'Overview',
    items: [
      { id: 'overview', label: 'Introduction'  },
      { id: 'theme',    label: 'Theme Builder' },
      { id: 'colors',   label: 'Color system'  },
      { id: 'icons',    label: 'Icons'         },
    ],
  },
  {
    group: 'Form',
    items: [
      { id: 'button',        label: 'Button'              },
      { id: 'toggle-button', label: 'ToggleButton'        },
      { id: 'text-inputs',   label: 'Text inputs'         },
      { id: 'select',        label: 'Select & ComboBox'   },
      { id: 'datetime',      label: 'Date & Time'         },
      { id: 'checkbox',      label: 'Checkbox'            },
      { id: 'toggles',       label: 'Toggles & Choices'   },
      { id: 'slider',        label: 'Slider & Range'      },
      { id: 'tags',          label: 'Tags'                },
      { id: 'file',          label: 'File Upload'         },
      { id: 'autocomplete',  label: 'Autocomplete'        },
      { id: 'dropzone',      label: 'Drop Zone'           },
    ],
  },
  {
    group: 'Overlay',
    items: [
      { id: 'modal',   label: 'Modal & Dialog'  },
      { id: 'drawer',  label: 'Drawer'          },
      { id: 'popover', label: 'Popover'         },
      { id: 'tooltip', label: 'Tooltip'         },
      { id: 'menu',    label: 'Dropdown Menu'   },
    ],
  },
  {
    group: 'Navigation',
    items: [
      { id: 'tabs',        label: 'Tabs'        },
      { id: 'breadcrumbs', label: 'Breadcrumbs' },
      { id: 'toolbar',     label: 'Toolbar'     },
    ],
  },
  {
    group: 'Selection',
    items: [
      { id: 'listbox',   label: 'ListBox'   },
      { id: 'gridlist',  label: 'GridList'  },
      { id: 'tree',      label: 'Tree'      },
    ],
  },
  {
    group: 'Display',
    items: [
      { id: 'badge',        label: 'Badge'              },
      { id: 'alert',        label: 'Alert'              },
      { id: 'card',         label: 'Card'               },
      { id: 'avatar',       label: 'Avatar'             },
      { id: 'statistic',    label: 'Statistic'          },
      { id: 'empty',        label: 'Empty'              },
      { id: 'steps',        label: 'Steps'              },
      { id: 'progress',     label: 'Progress & Meter'   },
      { id: 'skeleton',     label: 'Skeleton & Divider' },
      { id: 'disclosure',   label: 'Disclosure'         },
      { id: 'link',         label: 'Link'               },
      { id: 'color-picker', label: 'Color Picker'       },
    ],
  },
  {
    group: 'Data',
    items: [
      { id: 'protable', label: 'ProTable'  },
      { id: 'proform',  label: 'ProForm'   },
    ],
  },
  {
    group: 'Layout',
    items: [
      { id: 'layout', label: 'Layout & Sider' },
    ],
  },
  {
    group: 'Integration',
    items: [
      { id: 'llm-txt',    label: 'LLM.txt'     },
      { id: 'mcp',        label: 'MCP Server'   },
      { id: 'create-app', label: 'Create App'   },
    ],
  },
]

export const THEME_PRESETS = [
  { name: 'Indigo',   hex: '#6366f1' },
  { name: 'Violet',   hex: '#8b5cf6' },
  { name: 'Purple',   hex: '#a855f7' },
  { name: 'Blue',     hex: '#3b82f6' },
  { name: 'Cyan',     hex: '#06b6d4' },
  { name: 'Teal',     hex: '#14b8a6' },
  { name: 'Emerald',  hex: '#10b981' },
  { name: 'Green',    hex: '#22c55e' },
  { name: 'Lime',     hex: '#84cc16' },
  { name: 'Amber',    hex: '#f59e0b' },
  { name: 'Orange',   hex: '#f97316' },
  { name: 'Red',      hex: '#ef4444' },
  { name: 'Rose',     hex: '#f43f5e' },
  { name: 'Pink',     hex: '#ec4899' },
  { name: 'Slate',    hex: '#64748b' },
  { name: 'Zinc',     hex: '#71717a' },
]

export const RADIUS_PRESETS = [
  { label: '0',    value: '0px'    },
  { label: '4',    value: '4px'    },
  { label: '8',    value: '8px'    },
  { label: '12',   value: '12px'   },
  { label: '16',   value: '16px'   },
  { label: 'Full', value: '9999px' },
]

export const FONT_PRESETS = [
  { name: 'System',            value: 'ui-sans-serif, system-ui, -apple-system, sans-serif', gFont: null,           mono: false },
  { name: 'Inter',             value: "'Inter', sans-serif",             gFont: 'Inter:ital,opsz,wght@0,14..32,100..900',                          mono: false },
  { name: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif", gFont: 'Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800',               mono: false },
  { name: 'DM Sans',           value: "'DM Sans', sans-serif",           gFont: 'DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000',     mono: false },
  { name: 'Outfit',            value: "'Outfit', sans-serif",            gFont: 'Outfit:wght@100..900',                                            mono: false },
  { name: 'Inter Mono',        value: "'Inter Mono', monospace",         gFont: 'Inter+Mono:ital,wght@0,100..700;1,100..700',                      mono: true  },
  { name: 'JetBrains Mono',    value: "'JetBrains Mono', monospace",     gFont: 'JetBrains+Mono:ital,wght@0,100..800;1,100..800',                  mono: true  },
  { name: 'IBM Plex Mono',     value: "'IBM Plex Mono', monospace",      gFont: 'IBM+Plex+Mono:wght@100;200;300;400;500;600;700',                  mono: true  },
  { name: 'Fira Code',         value: "'Fira Code', monospace",          gFont: 'Fira+Code:wght@300..700',                                         mono: true  },
] as const

export type FontPreset = typeof FONT_PRESETS[number]
